(function (root) {
  "use strict";

  var PROFILES = {
    "Premier League": { matches: 38, avgGoalsPerMatch: 2.82, basePpm: 1.38, relegationCount: 3, europeanPlaces: 7 },
    "LALIGA EA SPORTS": { matches: 38, avgGoalsPerMatch: 2.62, basePpm: 1.38, relegationCount: 3, europeanPlaces: 7 },
    "Bundesliga": { matches: 34, avgGoalsPerMatch: 3.08, basePpm: 1.45, relegationCount: 2, europeanPlaces: 6 },
    "Serie A": { matches: 38, avgGoalsPerMatch: 2.64, basePpm: 1.38, relegationCount: 3, europeanPlaces: 6 },
    "Ligue 1 McDonald's": { matches: 34, avgGoalsPerMatch: 2.78, basePpm: 1.38, relegationCount: 2, europeanPlaces: 6 }
  };

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function normalRandom() {
    var first = Math.max(Math.random(), 0.000001);
    var second = Math.random();
    return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
  }

  function randomBetween(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function generateSeasonSwing() {
    var roll = Math.random();
    var direction = Math.random() < 0.5 ? -1 : 1;
    if (roll < 0.025) {
      return { value: direction * randomBetween(7, 11), type: direction > 0 ? "奇迹赛季" : "崩盘赛季" };
    }
    if (roll < 0.14) {
      return { value: direction * randomBetween(3, 6), type: direction > 0 ? "超预期" : "低迷" };
    }
    return { value: normalRandom() * 2.15, type: "正常" };
  }

  function getProfile(leagueId, teams, requestedMatches) {
    var configured = PROFILES[leagueId] || {};
    var teamCount = Math.max(2, teams.length);
    return {
      matches: Number(requestedMatches) || configured.matches || Math.max(2, (teamCount - 1) * 2),
      avgGoalsPerMatch: configured.avgGoalsPerMatch || 2.65,
      basePpm: configured.basePpm || 1.36,
      relegationCount: configured.relegationCount || Math.min(3, Math.max(1, Math.floor(teamCount / 7))),
      europeanPlaces: configured.europeanPlaces || 0
    };
  }

  function getClubStrength(club) {
    var dynamic = Number(club.dynamicStrength);
    return Number.isFinite(dynamic) ? dynamic : Number(club.strength || 70);
  }

  function calculatePlayerImpact(player, club, seasonStats) {
    if (!player) return { total: 0, attack: 0, defense: 0 };
    var appearances = Number(seasonStats && seasonStats.appearances || 0);
    var available = Number(seasonStats && seasonStats.leagueAvailable || 34);
    var participation = clamp(appearances / Math.max(1, available), 0, 1);
    var fitness = clamp(Number(player.status && player.status.fitness || 75) / 100, 0.45, 1);
    var relative = (Number(player.overall || 70) - getClubStrength(club)) * 0.12;
    var contribution = clamp(
      (Number(seasonStats && seasonStats.goals || 0) * 0.045) +
      (Number(seasonStats && seasonStats.assists || 0) * 0.035),
      0,
      1.8
    );
    var total = clamp(relative * participation * fitness + contribution, -2.5, 4);
    var position = player.position || "CM";
    var weights = position === "GK" ? [0, 1] :
      position === "CB" ? [0.15, 0.85] :
      position === "LB" || position === "RB" ? [0.35, 0.65] :
      position === "CM" ? [0.55, 0.45] :
      position === "CAM" ? [0.8, 0.2] :
      position === "LM" || position === "RM" || position === "LW" || position === "RW" ? [0.85, 0.15] :
      [1, 0];
    return { total: total, attack: total * weights[0], defense: total * weights[1] };
  }

  function calculateSeasonPower(options) {
    var club = options.club;
    var seasonYear = Number(options.seasonYear || 2026);
    var elapsed = Math.max(0, seasonYear - 2026);
    var priorWeight = Math.max(0, 0.18 - elapsed * 0.015);
    var current = getClubStrength(club);
    var historic = Number(club.initialStrength || club.strength || current);
    var finance = clamp(Number(club.budget || club.salary || 50) / 100 - 0.5, -0.6, 0.8);
    var form = clamp(Number(club.dynamicForm || 0), -5, 5) * 0.35;
    var squad = clamp(Number(club.squadQuality || current) - current, -3, 3) * 0.25;
    var playerImpact = options.isPlayerClub
      ? calculatePlayerImpact(options.player, club, options.seasonStats)
      : { total: 0, attack: 0, defense: 0 };
    var seasonSwing = generateSeasonSwing();
    return {
      total: current * (1 - priorWeight) + historic * priorWeight + finance + form + squad +
        playerImpact.total + Number(options.seasonPowerBonus || 0) + seasonSwing.value,
      playerImpact: playerImpact,
      seasonType: seasonSwing.type
    };
  }

  function generateRecordFromTargetPoints(options) {
    var matches = options.matches;
    var target = clamp(Math.round(options.targetPoints), 3, matches * 3 - 1);
    var best = null;
    for (var draws = 0; draws <= Math.min(matches, 16); draws += 1) {
      var wins = Math.round((target - draws) / 3);
      if (wins < 0 || wins + draws > matches) continue;
      var points = wins * 3 + draws;
      var score = Math.abs(points - target) + Math.abs(draws - matches * 0.24) * 0.025;
      if (!best || score < best.score) {
        best = { wins: wins, draws: draws, losses: matches - wins - draws, points: points, score: score };
      }
    }
    return { wins: best.wins, draws: best.draws, losses: best.losses, points: best.points };
  }

  function simulateFullLeagueSeason(options) {
    var seenTeamIds = {};
    var teams = (options.teams || []).filter(function (club) {
      if (!club || !club.id || seenTeamIds[club.id]) return false;
      seenTeamIds[club.id] = true;
      return true;
    });
    if (teams.length < 2) throw new Error("simulateFullLeagueSeason requires at least two teams");
    var profile = getProfile(options.leagueId, teams, options.matches);
    var powers = teams.map(function (club) {
      var calculated = calculateSeasonPower({
        club: club,
        player: options.player,
        isPlayerClub: club.id === options.playerClubId,
        seasonStats: options.seasonStats,
        seasonPowerBonus: club.id === options.playerClubId ? options.playerClubPowerBonus : 0,
        seasonYear: options.seasonYear
      });
      return {
        club: club,
        power: calculated.total,
        playerImpact: calculated.playerImpact,
        seasonType: calculated.seasonType
      };
    });
    var averagePower = powers.reduce(function (sum, item) { return sum + item.power; }, 0) / powers.length;
    var provisional = powers.map(function (item) {
      var powerDifference = item.power - averagePower;
      var expectedPpm = clamp(
        profile.basePpm + powerDifference * 0.03 + Math.max(0, powerDifference) * 0.018,
        0.72,
        2.48
      );
      var pointsNoise = normalRandom() * (profile.matches >= 38 ? 5.6 : 4.9);
      if (Math.random() < 0.09) {
        pointsNoise += (Math.random() < 0.5 ? -1 : 1) * randomBetween(4, 9);
      }
      var targetPoints = profile.matches * expectedPpm + pointsNoise;
      var record = generateRecordFromTargetPoints({
        matches: profile.matches,
        targetPoints: clamp(targetPoints, 12, profile.matches * 2.62),
        teamStrength: item.power,
        leagueProfile: profile
      });
      var attackDelta = (item.power - averagePower) * 0.7 + item.playerImpact.attack * 2.2;
      var defenseDelta = (item.power - averagePower) * 0.62 + item.playerImpact.defense * 2.1;
      var teamGoals = profile.matches * profile.avgGoalsPerMatch / 2;
      var goalsFor = Math.max(18, Math.round(teamGoals + attackDelta + (record.wins - record.losses) * 0.72 + normalRandom() * 4));
      var goalsAgainst = Math.max(16, Math.round(teamGoals - defenseDelta - (record.wins - record.losses) * 0.55 + normalRandom() * 4));
      return {
        clubId: item.club.id,
        clubName: item.club.nameZh || item.club.name,
        played: profile.matches,
        wins: record.wins,
        draws: record.draws,
        losses: record.losses,
        goalsFor: goalsFor,
        goalsAgainst: goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: record.points,
        seasonType: item.seasonType,
        tieBreaker: Math.random()
      };
    });
    provisional.sort(function (first, second) {
      return second.points - first.points ||
        second.goalDifference - first.goalDifference ||
        second.goalsFor - first.goalsFor ||
        second.tieBreaker - first.tieBreaker;
    });
    provisional.forEach(function (row, index) {
      row.position = index + 1;
      delete row.tieBreaker;
    });
    var champion = provisional[0];
    var playerRow = provisional.find(function (row) { return row.clubId === options.playerClubId; });
    return {
      leagueId: options.leagueId,
      seasonYear: options.seasonYear,
      table: provisional,
      championId: champion.clubId,
      europeanQualifiedIds: provisional.slice(0, Math.min(profile.europeanPlaces, provisional.length)).map(function (row) { return row.clubId; }),
      relegatedIds: provisional.slice(-Math.min(profile.relegationCount, provisional.length - 1)).map(function (row) { return row.clubId; }),
      playerClubPosition: playerRow ? playerRow.position : 0,
      playerClubPoints: playerRow ? playerRow.points : 0
    };
  }

  function evolveClubStrength(club, row, tableLength) {
    var expected = 1 + (96 - getClubStrength(club)) / 51 * Math.max(1, tableLength - 1);
    var overPerformance = expected - row.position;
    var change = clamp(overPerformance * 0.12 + normalRandom() * 0.65, -2, 2);
    var leagueMean = 72;
    club.dynamicStrength = clamp((getClubStrength(club) + change) * 0.97 + leagueMean * 0.03, 45, 96);
    return club.dynamicStrength;
  }

  function forceClubChampion(result, clubId) {
    var row = result.table.find(function (item) { return item.clubId === clubId; });
    if (!row || row.position === 1) return result;
    var leadingPoints = result.table[0].points;
    var record = generateRecordFromTargetPoints({
      matches: row.played,
      targetPoints: Math.min(row.played * 3 - 1, leadingPoints + 2)
    });
    while (record.points <= leadingPoints && record.wins + record.draws < row.played) {
      record = generateRecordFromTargetPoints({
        matches: row.played,
        targetPoints: Math.min(row.played * 3 - 1, record.points + 1)
      });
      if (record.points >= row.played * 3 - 1) break;
    }
    row.wins = record.wins;
    row.draws = record.draws;
    row.losses = record.losses;
    row.points = record.points;
    row.goalsFor = Math.max(row.goalsFor, result.table[0].goalsFor + 1);
    row.goalsAgainst = Math.min(row.goalsAgainst, Math.max(16, row.goalsFor - 1));
    row.goalDifference = row.goalsFor - row.goalsAgainst;
    result.table.sort(function (first, second) {
      return second.points - first.points ||
        second.goalDifference - first.goalDifference ||
        second.goalsFor - first.goalsFor;
    });
    result.table.forEach(function (item, index) { item.position = index + 1; });
    result.championId = result.table[0].clubId;
    result.playerClubPosition = row.position;
    result.playerClubPoints = row.points;
    return result;
  }

  root.LeagueSimulation = {
    PROFILES: PROFILES,
    calculateSeasonPower: calculateSeasonPower,
    calculatePlayerImpact: calculatePlayerImpact,
    generateRecordFromTargetPoints: generateRecordFromTargetPoints,
    simulateFullLeagueSeason: simulateFullLeagueSeason,
    forceClubChampion: forceClubChampion,
    evolveClubStrength: evolveClubStrength
  };
})(typeof window !== "undefined" ? window : globalThis);
