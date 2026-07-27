(function (root) {
  "use strict";

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function strength(club) {
    return Number(club.dynamicStrength || club.strength || 70);
  }

  function weightedWinner(first, second) {
    var chance = clamp(0.5 + (strength(first) - strength(second)) * 0.025, 0.14, 0.86);
    return Math.random() < chance ? first : second;
  }

  function buildScore(winner, loser) {
    var gap = Math.abs(strength(winner) - strength(loser));
    var winnerGoals = gap >= 10 && Math.random() < 0.3 ? 3 : Math.random() < 0.62 ? 2 : 1;
    var loserGoals = winnerGoals === 1 ? 0 : Math.random() < 0.58 ? winnerGoals - 1 : 0;
    return winnerGoals + "-" + loserGoals;
  }

  function sampleWeighted(clubs, count) {
    var pool = clubs.slice();
    var selected = [];
    while (pool.length && selected.length < count) {
      var total = pool.reduce(function (sum, club) { return sum + Math.max(1, strength(club) - 48); }, 0);
      var roll = Math.random() * total;
      var index = 0;
      for (; index < pool.length; index += 1) {
        roll -= Math.max(1, strength(pool[index]) - 48);
        if (roll <= 0) break;
      }
      selected.push(pool.splice(Math.min(index, pool.length - 1), 1)[0]);
    }
    return selected;
  }

  function simulateKnockoutCompetition(options) {
    var excluded = options.excludedIds || [];
    var eligible = (options.clubs || []).filter(function (club) {
      return excluded.indexOf(club.id) === -1;
    });
    var participants = sampleWeighted(eligible, Math.min(options.participantCount || 16, eligible.length));
    if (participants.length < 2) return null;
    var participantIds = participants.map(function (club) { return club.id; });
    var semifinalists = [];
    var round = participants.slice();
    while (round.length > 2) {
      var next = [];
      for (var index = 0; index < round.length - 1; index += 2) {
        next.push(weightedWinner(round[index], round[index + 1]));
      }
      if (round.length % 2) next.push(round[round.length - 1]);
      round = next;
      if (round.length <= 4) semifinalists = round.map(function (club) { return club.id; });
    }
    var champion = weightedWinner(round[0], round[1]);
    var runnerUp = champion.id === round[0].id ? round[1] : round[0];
    return {
      competition: options.competition,
      participantIds: participantIds,
      championId: champion.id,
      runnerUpId: runnerUp.id,
      semifinalists: semifinalists,
      finalScore: buildScore(champion, runnerUp)
    };
  }

  root.CompetitionSimulation = {
    simulateKnockoutCompetition: simulateKnockoutCompetition
  };
})(typeof window !== "undefined" ? window : globalThis);
