const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");

function createGame() {
  const genericNode = {
    innerHTML: "",
    addEventListener() {},
    getAttribute() { return ""; },
    classList: { add() {} },
    querySelector() { return null; }
  };
  const context = {
    console,
    Promise,
    Set,
    Math,
    Date,
    setTimeout,
    clearTimeout,
    fetch() { return Promise.reject(new Error("offline simulation")); },
    document: {
      getElementById() { return genericNode; },
      querySelectorAll() { return []; },
      createElement() { return Object.assign({}, genericNode); }
    },
    FormData: class {
      constructor(target) { this.target = target; }
      get(key) { return this.target[key]; }
    },
    window: {}
  };
  vm.createContext(context);
  [
    "countries.js",
    "trophies.js",
    "clubs.js",
    "third-tier-clubs.js",
    "third-tier-translations.js",
    "derbies.js",
    "events.js",
    "league-simulation.js",
    "competition-simulation.js"
  ].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(root, "data", file), "utf8"), context);
  });
  let appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
  appSource = appSource.replace(
    /\s+init\(\);\s*\}\)\(\);\s*$/,
    "\n  window.__game = { getState: function () { return state; }, onCreatePlayer: onCreatePlayer, ensureCurrentEvent: ensureCurrentEvent, handleEventChoice: handleEventChoice, handleTransferChoice: handleTransferChoice, generateTransferOptions: generateTransferOptions, getClubById: getClubById, getClubStrength: getClubStrength };\n})();"
  );
  vm.runInContext(appSource, context);
  return context.window.__game;
}

function chooseTransfer(options, strategy) {
  if (strategy === "stable") {
    const order = ["loan", "renewal", "homecoming", "return", "forced-stay", "transfer", "formal", "retire"];
    for (const type of order) {
      const index = options.findIndex((option) => option.type === type);
      if (index !== -1) return index;
    }
  }
  const active = options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.type !== "retire")
    .sort((a, b) => (b.option.club.strength || 0) - (a.option.club.strength || 0));
  return active.length ? active[0].index : 0;
}

function runCareer(strategy, seedOffset, requestedPosition) {
  const game = createGame();
  const position = requestedPosition || (strategy === "stable" ? "CM" : "ST");
  game.onCreatePlayer({
    preventDefault() {},
    target: {
      name: strategy === "stable" ? "稳健路线" : "冒险路线",
      countryCode: "CN",
      position,
      foot: "右脚",
      number: String(8 + seedOffset)
    }
  });
  const seasons = [];
  let guard = 0;
  while (!game.getState().gameOver && guard < 28) {
    game.ensureCurrentEvent();
    const stateBefore = game.getState();
    const event = stateBefore.currentEvent;
    const eventChoice = strategy === "stable"
      ? Math.min(1, event.options.length - 1)
      : 0;
    game.handleEventChoice(eventChoice);
    const summaryState = game.getState();
    const summary = summaryState.latestSummary;
    const transferIndex = chooseTransfer(summaryState.transferOptions, strategy);
    const selectedTransfer = summaryState.transferOptions[transferIndex];
    const homecomingOffers = summaryState.transferOptions.filter((option) => option.type === "homecoming");
    const homecomingAudits = homecomingOffers.map((option) => {
      const entries = summaryState.player.career.filter((entry) => entry.clubId === option.club.id);
      const appearances = entries.reduce((sum, entry) => sum + (entry.appearances || 0), 0);
      const goals = entries.reduce((sum, entry) => sum + (entry.goals || 0), 0);
      const assists = entries.reduce((sum, entry) => sum + (entry.assists || 0), 0);
      const championships = entries.reduce((sum, entry) =>
        sum + (entry.trophies || []).filter((name) => name.includes("冠军")).length, 0);
      return {
        seasons: entries.length,
        appearances,
        score: appearances + goals * 3 + assists * 2 + championships * 35
      };
    });
    seasons.push({
      position,
      age: summary.age,
      club: summary.clubName,
      clubStrength: game.getClubStrength(game.getClubById(summaryState.player.currentClubId)),
      overall: summary.overall,
      appearances: summary.appearances,
      goals: summary.goals,
      assists: summary.assists,
      leagueGoals: summary.leagueGoals,
      leagueAssists: summary.leagueAssists,
      competitionStats: summary.competitionStats,
      leagueStanding: summary.leagueStanding,
      continentalStory: summary.continentalStory,
      trophies: summary.trophies.slice(),
      nationalHonors: summary.nationalHonors.slice(),
      nationalCompetitionName: summary.nationalCompetitionName,
      achievements: summary.achievements.slice(),
      injuries: summary.injuries.slice(),
      legendStory: summary.legendStory,
      ballonDorNominated: summary.ballonDorNominated,
      memory: summary.seasonMoment,
      choiceOutcome: summaryState.lastChoiceOutcome,
      derbyNote: summary.derbyNote,
      derbyWasFeatured: summary.derbyWasFeatured,
      decision: summary.clubDecisionNote || "",
      event: event.title,
      eventId: event.id,
      offeredBigFive: summaryState.transferOptions.some((option) =>
        ["Premier League", "LALIGA EA SPORTS", "Bundesliga", "Serie A", "Ligue 1 McDonald's"].includes(option.club.league) &&
        option.club.leagueLevel === 1
      ),
      offeredStrongerClub: summaryState.transferOptions.some((option) =>
        option.club.id !== summaryState.player.currentClubId &&
        game.getClubStrength(option.club) >
          game.getClubStrength(game.getClubById(summaryState.player.currentClubId))
      ),
      homecomingAudits,
      selectedTransferType: selectedTransfer ? selectedTransfer.type : "",
      transfer: selectedTransfer ? selectedTransfer.label + " -> " + selectedTransfer.club.name : "none"
    });
    if (!summaryState.gameOver) {
      game.handleTransferChoice(transferIndex);
    }
    guard += 1;
  }
  return { player: game.getState().player, seasons };
}

function printCareer(result, label) {
  const player = result.player;
  console.log(`\n=== ${label} ===`);
  result.seasons.forEach((season) => {
    console.log(
      `${season.age} ${season.club} OVR${season.overall} ` +
      `${season.appearances}场 ${season.goals}球 ${season.assists}助 ` +
      `[${season.trophies.join(",") || "-"}] ` +
      `${season.leagueStanding.status}/${season.competitionStats.continentalName || "无欧战"} ` +
      `${season.transfer}`
    );
  });
  console.log(
    `END age=${player.age} peak=${Math.max(...player.career.map((entry) => entry.overall))} ` +
    `apps=${player.totals.appearances} goals=${player.totals.goals} assists=${player.totals.assists} ` +
    `trophies=${player.totals.trophies} clubs=${new Set(player.career.map((entry) => entry.clubName)).size}`
  );
}

if (process.argv.includes("--batch")) {
  const total = Number(process.argv[process.argv.indexOf("--batch") + 1]) || 100;
  const peaks = [];
  let totalChampionships = 0;
  let totalCareerSeasons = 0;
  let totalCareerAppearances = 0;
  let totalCareerGoals = 0;
  let totalCareerAssists = 0;
  let totalClubsRepresented = 0;
  const positions = ["GK", "CB", "LB", "RB", "CM", "CAM", "LM", "RM", "LW", "RW", "ST"];
  const positionOutput = Object.fromEntries(positions.map((position) => [
    position,
    { seasons: 0, appearances: 0, goals: 0, assists: 0 }
  ]));
  const ballonDorByPosition = Object.fromEntries(positions.map((position) => [
    position,
    { careers: 0, nominations: 0, wins: 0, winningCareers: 0 }
  ]));
  let forcedDerbiesWithoutMemory = 0;
  let falseChampionMemories = 0;
  let contradictoryContracts = 0;
  let selectedRivalTransfers = 0;
  let rivalTransferEvents = 0;
  let majorFinalEvents = 0;
  let majorFinalOutcomeContradictions = 0;
  let appearanceOverflow = 0;
  let eliteAsianSeasonsWithoutBigFiveOffer = 0;
  let worldClassSeasonsWithoutStrongerOffer = 0;
  let homecomingOffers = 0;
  let invalidHomecomingOffers = 0;
  let youngPlayerAwardAgeViolations = 0;
  let goldenBootThresholdViolations = 0;
  let continentalCompetitionMismatch = 0;
  let continentalMatchOverflow = 0;
  let domesticCupChampionMismatch = 0;
  let leagueStandingRangeViolation = 0;
  let inheritedEuropeanQualificationViolation = 0;
  let repeatedContinentalOpponentViolation = 0;
  let captainCareers = 0;
  let careersWithLegendMoment = 0;
  let titleCollapseRankViolation = 0;
  let continentalRunnerUpLabelViolation = 0;
  let injuredHighAppearanceViolation = 0;
  let ballonDorNominatedSeasons = 0;
  let ballonDorWins = 0;
  let ballonDorWinningCareers = 0;
  let nationalTournamentEvents = 0;
  let nationalTournamentEventMismatch = 0;
  let choiceMemoryContradictions = 0;
  const choiceMemoryContradictionExamples = [];
  let continentalDecisionContradictions = 0;
  let championsLeagueShootoutEvents = 0;
  let clubIdentityCareers = 0;
  let lateCareerCoronationCareers = 0;
  let lateCareerCoronationContradictions = 0;
  const repeatedContinentalOpponentExamples = [];
  const inheritedEuropeanQualificationExamples = [];
  for (let index = 0; index < total; index += 1) {
    const strategy = index % 2 === 0 ? "stable" : "ambitious";
    const simulatedPosition = positions[index % positions.length];
    const result = runCareer(strategy, index, simulatedPosition);
    ballonDorByPosition[simulatedPosition].careers += 1;
    if (result.player.everCaptain) captainCareers += 1;
    if (result.seasons.some((season) => season.legendStory)) careersWithLegendMoment += 1;
    if (result.seasons.some((season) => season.eventId.startsWith("club-identity-"))) {
      clubIdentityCareers += 1;
    }
    if (result.seasons.some((season) => season.eventId === "late-career-coronation")) {
      lateCareerCoronationCareers += 1;
    }
    if (result.seasons.some((season) => season.trophies.includes("金球奖"))) {
      ballonDorWinningCareers += 1;
      ballonDorByPosition[simulatedPosition].winningCareers += 1;
    }
    totalChampionships += result.player.totals.trophies;
    totalCareerSeasons += result.player.career.length;
    totalCareerAppearances += result.player.totals.appearances;
    totalCareerGoals += result.player.totals.goals;
    totalCareerAssists += result.player.totals.assists;
    totalClubsRepresented += new Set(result.player.career.map((entry) => entry.clubId)).size;
    peaks.push(Math.max(...result.player.career.map((entry) => entry.overall)));
    result.seasons.forEach((season, seasonIndex) => {
      const previousSeason = result.seasons[seasonIndex - 1];
      if (
        season.eventId === "late-career-coronation" &&
        season.leagueStanding.position !== 1
      ) {
        lateCareerCoronationContradictions += 1;
      }
      if (
        previousSeason &&
        season.age === previousSeason.age + 1 &&
        previousSeason.club === season.club &&
        season.competitionStats.continentalName &&
        ["欧冠", "欧联杯", "欧协联"].includes(season.competitionStats.continentalName)
      ) {
        const qualifiedByLeague = ["欧冠区", "欧冠资格赛区", "欧联区", "欧协联区"]
          .includes(previousSeason.leagueStanding.status);
        const qualifiedAsHolder = previousSeason.trophies.some((name) =>
          ["欧冠冠军", "欧联杯冠军", "欧协联冠军"].includes(name) ||
          (name.includes("杯冠军") && !name.includes("洲际杯"))
        );
        if (!qualifiedByLeague && !qualifiedAsHolder) {
          inheritedEuropeanQualificationViolation += 1;
          if (inheritedEuropeanQualificationExamples.length < 5) {
            inheritedEuropeanQualificationExamples.push({
              previous: `${previousSeason.age} ${previousSeason.club} ${previousSeason.leagueStanding.status} ${previousSeason.trophies.join("/") || "-"}`,
              current: `${season.age} ${season.club} ${season.competitionStats.continentalName}`
            });
          }
        }
      }
      homecomingOffers += season.homecomingAudits.length;
      invalidHomecomingOffers += season.homecomingAudits.filter((audit) =>
        audit.seasons < 4 || audit.appearances < 100 || audit.score < 190
      ).length;
      if (season.achievements.some((name) => name.includes("最佳新秀")) && season.age > 21) {
        youngPlayerAwardAgeViolations += 1;
      }
      if (
        season.achievements.some((name) => name.includes("金靴")) &&
        season.leagueGoals < 25
      ) {
        goldenBootThresholdViolations += 1;
      }
      const continentalTitle = season.trophies.find((name) =>
        ["欧冠冠军", "欧联杯冠军", "欧协联冠军", "亚冠冠军"].includes(name)
      );
      if (
        continentalTitle &&
        continentalTitle.replace("冠军", "") !== season.competitionStats.continentalName
      ) {
        continentalCompetitionMismatch += 1;
      }
      const continentalMaximum = season.competitionStats.continentalName === "欧协联"
        ? 15
        : season.competitionStats.continentalName === "亚冠"
          ? 13
          : 17;
      if (season.competitionStats.continentalAvailable > continentalMaximum) {
        continentalMatchOverflow += 1;
      }
      if (
        season.competitionStats.continentalOpponent &&
        season.competitionStats.continentalNotableWin &&
        season.competitionStats.continentalNotableWin.includes(season.competitionStats.continentalOpponent)
      ) {
        repeatedContinentalOpponentViolation += 1;
        if (repeatedContinentalOpponentExamples.length < 5) {
          repeatedContinentalOpponentExamples.push({
            age: season.age,
            club: season.clubName,
            stage: season.competitionStats.continentalStage,
            opponent: season.competitionStats.continentalOpponent,
            notableWin: season.competitionStats.continentalNotableWin
          });
        }
      }
      if (
        season.trophies.some((name) => name.includes("杯冠军")) &&
        season.competitionStats.domesticCupStage !== "冠军" &&
        !continentalTitle
      ) {
        domesticCupChampionMismatch += 1;
      }
      if (
        !season.leagueStanding ||
        season.leagueStanding.position < 1 ||
        season.leagueStanding.position > season.leagueStanding.teamCount ||
        season.leagueStanding.points < 0 ||
        season.leagueStanding.points > season.competitionStats.leagueAvailable * 3
      ) {
        leagueStandingRangeViolation += 1;
      }
      if (season.overall >= 80 && season.overall <= 87) {
        const output = positionOutput[season.position];
        output.seasons += 1;
        output.appearances += season.appearances;
        output.goals += season.goals;
        output.assists += season.assists;
      }
      if (season.event.includes("即将到来") && !season.derbyNote) {
        forcedDerbiesWithoutMemory += 1;
      }
      if (
        season.age <= 24 &&
        season.overall >= 88 &&
        season.appearances >= 24 &&
        ["武汉三镇", "浦和红钻", "上海海港", "上海申花", "北京国安", "利雅得新月", "利雅得胜利"].includes(season.club) &&
        !season.offeredBigFive
      ) {
        eliteAsianSeasonsWithoutBigFiveOffer += 1;
      }
      if (
        season.age <= 30 &&
        season.overall >= 90 &&
        season.appearances >= 18 &&
        season.clubStrength < 90 &&
        !season.offeredStrongerClub
      ) {
        worldClassSeasonsWithoutStrongerOffer += 1;
      }
      if (
        /没有奏效|丢掉.{0,4}积分|被淘汰|不敌|落败/.test(season.memory || "") &&
        /选择奏效|帮助球队晋级|完成.{0,6}目标|拿下关键胜利|赢得.{0,8}冠军/.test(season.choiceOutcome || "")
      ) {
        choiceMemoryContradictions += 1;
        if (choiceMemoryContradictionExamples.length < 5) {
          choiceMemoryContradictionExamples.push({
            age: season.age,
            club: season.club,
            memory: season.memory,
            choiceOutcome: season.choiceOutcome
          });
        }
      }
      if (
        /欧冠(十六强|八强|半决赛).*(成功晋级|晋级下一轮)/.test(season.memory || "") &&
        RegExp.$1 &&
        (season.continentalStory || "").includes(RegExp.$1 + "出局")
      ) {
        continentalDecisionContradictions += 1;
      }
      if (
        /欧冠(十六强|八强|半决赛).*球队就此出局/.test(season.memory || "") &&
        !(season.continentalStory || "").includes(RegExp.$1 + "出局")
      ) {
        continentalDecisionContradictions += 1;
      }
      if ((season.event || "").includes("决胜点球大战")) {
        championsLeagueShootoutEvents += 1;
      }
      if (season.memory.includes("冠军归属") && !season.trophies.some((name) => name.includes("冠军"))) {
        falseChampionMemories += 1;
      }
      if (season.memory.includes("长期占据积分榜首位") && season.leagueStanding.position !== 2) {
        titleCollapseRankViolation += 1;
      }
      const runnerUpAchievement = season.achievements.find((name) =>
        ["欧冠亚军", "欧联杯亚军", "欧协联亚军", "亚冠亚军"].includes(name)
      );
      if (
        runnerUpAchievement &&
        runnerUpAchievement.replace("亚军", "") !== season.competitionStats.continentalName
      ) {
        continentalRunnerUpLabelViolation += 1;
      }
      if (
        season.injuries.length &&
        season.appearances > (season.injuries[0].maxAppearances ||
          (season.injuries[0].severity === "major" ? 20 : 27))
      ) {
        injuredHighAppearanceViolation += 1;
      }
      if (season.ballonDorNominated) ballonDorNominatedSeasons += 1;
      if (season.ballonDorNominated) ballonDorByPosition[simulatedPosition].nominations += 1;
      if (season.trophies.includes("金球奖")) {
        ballonDorWins += 1;
        ballonDorByPosition[simulatedPosition].wins += 1;
      }
      if (season.event.includes("名单公布")) {
        nationalTournamentEvents += 1;
        const eventCompetition = season.event.replace("名单公布", "");
        if (eventCompetition !== season.nationalCompetitionName) {
          nationalTournamentEventMismatch += 1;
        }
      }
      if (season.decision.includes("没有第一时间选择留下") && season.transfer.startsWith("继续履行现有合同")) {
        contradictoryContracts += 1;
      }
      if (season.transfer.startsWith("收到死敌求购")) {
        selectedRivalTransfers += 1;
      }
      if (season.event === "转投死敌引爆舆论") {
        rivalTransferEvents += 1;
      }
      if (season.competitionStats && season.appearances > (
        season.competitionStats.leagueAvailable +
        season.competitionStats.domesticCupAvailable +
        season.competitionStats.continentalAvailable
      )) {
        appearanceOverflow += 1;
      }
      if (season.event.includes("欧冠决赛")) {
        majorFinalEvents += 1;
        const outcomes = Number(season.trophies.includes("欧冠冠军")) +
          Number(season.achievements.includes("欧冠亚军"));
        if (outcomes !== 1) majorFinalOutcomeContradictions += 1;
      }
      if (season.event.includes("世界杯决赛")) {
        majorFinalEvents += 1;
        const outcomes = Number(season.nationalHonors.includes("世界杯冠军")) +
          Number(season.achievements.includes("世界杯亚军"));
        if (outcomes !== 1) majorFinalOutcomeContradictions += 1;
      }
    });
  }
  const bands = {
    "60档及以下": peaks.filter((peak) => peak < 70).length,
    "70档": peaks.filter((peak) => peak >= 70 && peak < 80).length,
    "80档": peaks.filter((peak) => peak >= 80 && peak < 90).length,
    "90档": peaks.filter((peak) => peak >= 90).length,
    "85+": peaks.filter((peak) => peak >= 85).length,
    "95+": peaks.filter((peak) => peak >= 95).length
  };
  const outputPer30 = Object.fromEntries(Object.entries(positionOutput).map(([position, output]) => {
    const factor = output.appearances ? 30 / output.appearances : 0;
    return [position, {
      seasons: output.seasons,
      goals: Math.round(output.goals * factor * 10) / 10,
      assists: Math.round(output.assists * factor * 10) / 10
    }];
  }));
  const report = {
    total,
    averagePeak: Math.round(peaks.reduce((sum, peak) => sum + peak, 0) / total * 10) / 10,
    careerAverages: {
      championships: Math.round(totalChampionships / total * 10) / 10,
      seasons: Math.round(totalCareerSeasons / total * 10) / 10,
      appearances: Math.round(totalCareerAppearances / total),
      goals: Math.round(totalCareerGoals / total),
      assists: Math.round(totalCareerAssists / total),
      clubs: Math.round(totalClubsRepresented / total * 10) / 10,
      ballonDorWins: Math.round(ballonDorWins / total * 100) / 100,
      ballonDorWinningCareerRate: Math.round(ballonDorWinningCareers / total * 1000) / 10
    },
    ballonDorByPosition,
    bands,
    outputPer30AtOverall80To87: outputPer30,
    consistency: {
      forcedDerbiesWithoutMemory,
      falseChampionMemories,
      contradictoryContracts,
      selectedRivalTransfers,
      rivalTransferEvents,
      majorFinalEvents,
      majorFinalOutcomeContradictions,
      appearanceOverflow,
      eliteAsianSeasonsWithoutBigFiveOffer,
      worldClassSeasonsWithoutStrongerOffer,
      homecomingOffers,
      invalidHomecomingOffers,
      youngPlayerAwardAgeViolations,
      goldenBootThresholdViolations,
      continentalCompetitionMismatch,
      continentalMatchOverflow,
      domesticCupChampionMismatch,
      leagueStandingRangeViolation
      ,
      inheritedEuropeanQualificationViolation
      ,
      inheritedEuropeanQualificationExamples
      ,
      repeatedContinentalOpponentViolation
      ,
      repeatedContinentalOpponentExamples
      ,
      captainCareers
      ,
      careersWithLegendMoment
      ,
      titleCollapseRankViolation
      ,
      continentalRunnerUpLabelViolation
      ,
      injuredHighAppearanceViolation
      ,
      ballonDorNominatedSeasons
      ,
      ballonDorWins
      ,
      ballonDorWinningCareers
      ,
      nationalTournamentEvents
      ,
      nationalTournamentEventMismatch
      ,
      choiceMemoryContradictions
      ,
      choiceMemoryContradictionExamples
      ,
      continentalDecisionContradictions
      ,
      championsLeagueShootoutEvents
      ,
      clubIdentityCareers
      ,
      lateCareerCoronationCareers
      ,
      lateCareerCoronationContradictions
    }
  };
  if (process.argv.includes("--compact")) {
    console.log(JSON.stringify({
      total: report.total,
      averagePeak: report.averagePeak,
      bands: report.bands,
      careerAverages: report.careerAverages,
      ballonDorByPosition: report.ballonDorByPosition,
      consistency: {
        clubIdentityCareers: report.consistency.clubIdentityCareers,
        lateCareerCoronationCareers: report.consistency.lateCareerCoronationCareers,
        lateCareerCoronationContradictions: report.consistency.lateCareerCoronationContradictions,
        falseChampionMemories: report.consistency.falseChampionMemories
      }
    }));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
} else {
  printCareer(runCareer("stable", 0), "稳健生涯");
  printCareer(runCareer("ambitious", 1), "冒险生涯");
}
