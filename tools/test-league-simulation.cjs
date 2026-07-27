const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { Math, console };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "data", "league-simulation.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "data", "competition-simulation.js"), "utf8"), context);

const simulation = context.LeagueSimulation;
const competitionSimulation = context.CompetitionSimulation;

function makeTeams(prefix, count) {
  return Array.from({ length: count }, (_, index) => ({
    id: prefix + "-" + (index + 1),
    name: prefix + " " + (index + 1),
    nameZh: prefix + " " + (index + 1),
    strength: Math.round(92 - index * (37 / Math.max(1, count - 1))),
    initialStrength: Math.round(92 - index * (37 / Math.max(1, count - 1))),
    budget: Math.round(92 - index * 2)
  }));
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function standardDeviation(values) {
  const mean = average(values);
  return Math.sqrt(average(values.map((value) => Math.pow(value - mean, 2))));
}

function validateSeason(result) {
  const errors = [];
  const ids = new Set();
  result.table.forEach((row, index) => {
    if (ids.has(row.clubId)) errors.push("重复球队 " + row.clubId);
    ids.add(row.clubId);
    if (row.wins + row.draws + row.losses !== row.played) errors.push("场次错误 " + row.clubId);
    if (row.points !== row.wins * 3 + row.draws) errors.push("积分错误 " + row.clubId);
    if (row.goalDifference !== row.goalsFor - row.goalsAgainst) errors.push("净胜球错误 " + row.clubId);
    if (row.points > 110 || row.points < 5) errors.push("异常积分 " + row.clubId);
    if (index > 0) {
      const previous = result.table[index - 1];
      const ordered = previous.points > row.points ||
        (previous.points === row.points && previous.goalDifference > row.goalDifference) ||
        (previous.points === row.points && previous.goalDifference === row.goalDifference &&
          previous.goalsFor >= row.goalsFor);
      if (!ordered) errors.push("排序错误 " + row.clubId);
    }
  });
  if (result.championId !== result.table[0].clubId) errors.push("冠军不是第一名");
  return errors;
}

function runLeague(label, leagueId, teamCount, seasons) {
  const championPoints = [];
  const fourthPoints = [];
  const relegationLines = [];
  const goalsPerMatch = [];
  const champions = {};
  const positions = {};
  let abnormal = 0;
  let firstFailure = null;
  let playerPointDifference = [];
  for (let season = 0; season < seasons; season += 1) {
    const teams = makeTeams(label, teamCount);
    const base = simulation.simulateFullLeagueSeason({
      leagueId,
      teams,
      playerClubId: teams[8].id,
      seasonYear: 2026 + season % 20
    });
    const influenced = simulation.simulateFullLeagueSeason({
      leagueId,
      teams,
      playerClubId: teams[8].id,
      player: { overall: 90, position: "CM", status: { fitness: 90 } },
      seasonStats: { appearances: 34, leagueAvailable: 38, goals: 12, assists: 16 },
      seasonYear: 2026 + season % 20
    });
    const errors = validateSeason(base);
    if (errors.length) {
      abnormal += 1;
      if (!firstFailure) firstFailure = { season, errors, table: base.table };
    }
    championPoints.push(base.table[0].points);
    fourthPoints.push(base.table[Math.min(3, base.table.length - 1)].points);
    relegationLines.push(base.table[Math.max(0, base.table.length - 3)].points);
    goalsPerMatch.push(base.table.reduce((sum, row) => sum + row.goalsFor, 0) / (teamCount * base.table[0].played / 2));
    champions[base.championId] = (champions[base.championId] || 0) + 1;
    base.table.forEach((row) => {
      positions[row.clubId] = (positions[row.clubId] || 0) + row.position;
    });
    playerPointDifference.push(influenced.playerClubPoints - base.playerClubPoints);
  }
  return {
    competition: label,
    seasons,
    championPointsMean: Number(average(championPoints).toFixed(2)),
    championPointsStd: Number(standardDeviation(championPoints).toFixed(2)),
    fourthPlacePointsMean: Number(average(fourthPoints).toFixed(2)),
    relegationLineMean: Number(average(relegationLines).toFixed(2)),
    goalsPerMatch: Number(average(goalsPerMatch).toFixed(2)),
    playerImpactPointsMean: Number(average(playerPointDifference).toFixed(2)),
    championDistribution: champions,
    averagePositions: Object.fromEntries(Object.entries(positions).map(([id, total]) => [id, Number((total / seasons).toFixed(2))])),
    abnormalSeasons: abnormal,
    firstFailure
  };
}

const results = [
  runLeague("英超", "Premier League", 20, 1000),
  runLeague("德甲", "Bundesliga", 18, 1000)
];

const europeanClubs = makeTeams("欧冠球队", 36);
let europeanAbnormal = 0;
const europeanChampions = {};
for (let season = 0; season < 1000; season += 1) {
  const result = competitionSimulation.simulateKnockoutCompetition({
    competition: "UCL",
    clubs: europeanClubs,
    participantCount: 16
  });
  if (!result || !result.participantIds.includes(result.championId)) europeanAbnormal += 1;
  europeanChampions[result.championId] = (europeanChampions[result.championId] || 0) + 1;
}

const forcedTeams = makeTeams("特殊事件", 20);
const forcedSeason = simulation.simulateFullLeagueSeason({
  leagueId: "Premier League",
  teams: forcedTeams,
  playerClubId: forcedTeams[15].id,
  seasonYear: 2032
});
simulation.forceClubChampion(forcedSeason, forcedTeams[15].id);
const forcedErrors = validateSeason(forcedSeason);
if (forcedSeason.championId !== forcedTeams[15].id) forcedErrors.push("特殊事件未兑现冠军");

const output = {
  leagues: results,
  europe: {
    competition: "欧冠",
    seasons: 1000,
    abnormalSeasons: europeanAbnormal,
    championDistribution: europeanChampions
  },
  forcedChampionEvent: {
    championId: forcedSeason.championId,
    points: forcedSeason.table[0].points,
    errors: forcedErrors
  }
};
console.log(JSON.stringify(output, null, 2));
if (
  results.some((result) => result.abnormalSeasons > 0) ||
  europeanAbnormal ||
  forcedErrors.length
) process.exitCode = 1;
