const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = {
  console,
  Math,
  window: {},
  document: {
    getElementById() {
      return {
        innerHTML: "",
        addEventListener() {},
        querySelector() { return null; },
        classList: { add() {} }
      };
    },
    querySelectorAll() { return []; },
    createElement() { return {}; }
  },
  FormData: class {},
  setTimeout,
  clearTimeout,
  fetch() { return Promise.reject(new Error("offline")); }
};
vm.createContext(context);

[
  "countries.js", "trophies.js", "clubs.js", "third-tier-clubs.js",
  "third-tier-translations.js", "league-rosters.js", "derbies.js",
  "events.js", "injuries.js", "league-simulation.js", "competition-simulation.js"
].forEach((file) => {
  vm.runInContext(fs.readFileSync(path.join(root, "data", file), "utf8"), context);
});

let source = fs.readFileSync(path.join(root, "app.js"), "utf8");
source = source.replace(
  /\s+init\(\);\s*\}\)\(\);\s*$/,
  `
  window.__injuryTest = {
    normalize: normalizePlayerInjuryData,
    prepare: prepareSeasonInjury,
    finalize: finalizeSeasonInjury
  };
})();`
);
vm.runInContext(source, context);

const api = context.window.__injuryTest;
const club = context.window.CLUBS.find((item) => item.league === "Premier League");
const seasons = 10000;
const results = {
  injured: 0,
  totalWeeks: 0,
  bySeverity: { minor: 0, moderate: 0, serious: 0, major: 0 },
  over30: { total: 0, injured: 0 },
  durability: {
    low: { total: 0, injured: 0 },
    normal: { total: 0, injured: 0 },
    high: { total: 0, injured: 0 }
  },
  invalidWeeks: 0,
  carryOver: 0,
  permanentLoss: 0
};

function makePlayer(index) {
  const durability = index % 3 === 0 ? 48 : index % 3 === 1 ? 70 : 90;
  return {
    age: 18 + (index % 20),
    seasonYear: 2026 + (index % 20),
    overall: 78,
    potential: 86,
    position: ["GK", "CB", "LB", "CM", "CAM", "LW", "ST"][index % 7],
    currentClubId: club.id,
    nextContinentalCompetition: index % 4 === 0 ? "欧冠" : "",
    profile: {
      pace: 78, strength: 76, workRate: 78, reflexes: 75,
      dribbling: 76, passing: 76, vision: 76, finishing: 72,
      offBall: 75, defending: 70, aerial: 72
    },
    status: {
      fitness: 45 + (index % 51),
      happiness: 65,
      reputation: 60,
      coachRelation: 60
    },
    talents: { durability, recovery: 70 },
    durability,
    injuryProneness: 100 - durability,
    injuryArchetype: index % 100 === 0 ? "chronic" : "normal",
    injuryHistory: [],
    injury: null,
    matchSharpness: 100,
    medicalCondition: 100,
    healthySeasonStreak: 0
  };
}

for (let index = 0; index < seasons; index += 1) {
  const player = makePlayer(index);
  api.normalize(player);
  api.prepare(player, club);
  const group = player.durability <= 55 ? "low" : player.durability >= 85 ? "high" : "normal";
  results.durability[group].total += 1;
  if (player.age >= 30) results.over30.total += 1;
  if (player.pendingSeasonInjury) {
    const injury = player.pendingSeasonInjury;
    results.injured += 1;
    results.durability[group].injured += 1;
    if (player.age >= 30) results.over30.injured += 1;
    results.bySeverity[injury.severity] += 1;
    results.totalWeeks += injury.weeksOut || injury.totalWeeks || 0;
    results.permanentLoss += injury.permanentLoss || 0;
    if ((injury.weeksOut || 0) < 0 || (injury.weeksOut || 0) > 64) results.invalidWeeks += 1;
    api.finalize(player);
    if (player.injury.active) results.carryOver += 1;
  }
}

const percentage = (value, total) => total ? Number((value * 100 / total).toFixed(2)) : 0;
console.log(JSON.stringify({
  seasons,
  injuryRate: percentage(results.injured, seasons),
  severityShare: Object.fromEntries(
    Object.entries(results.bySeverity).map(([key, value]) => [key, percentage(value, results.injured)])
  ),
  averageWeeks: results.injured ? Number((results.totalWeeks / results.injured).toFixed(2)) : 0,
  over30InjuryRate: percentage(results.over30.injured, results.over30.total),
  durabilityRates: Object.fromEntries(
    Object.entries(results.durability).map(([key, value]) => [key, percentage(value.injured, value.total)])
  ),
  averagePermanentLoss: results.injured
    ? Number((results.permanentLoss / results.injured).toFixed(3))
    : 0,
  carryOverSeasons: results.carryOver,
  invalidWeeks: results.invalidWeeks
}, null, 2));
