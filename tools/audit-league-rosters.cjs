const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
[
  "clubs.js",
  "third-tier-clubs.js",
  "third-tier-translations.js",
  "league-rosters.js"
].forEach((file) => {
  vm.runInContext(fs.readFileSync(path.join(root, "data", file), "utf8"), context);
});

const expected = {
  "Premier League": 20, "EFL Championship": 24, "EFL League One": 24,
  "LALIGA EA SPORTS": 20, "LALIGA HYPERMOTION": 22, "Primera Federación": 20,
  "Bundesliga": 18, "2. Bundesliga": 18, "3. Liga": 20,
  "Serie A": 20, "Serie BKT": 20, "Serie C": 20,
  "Ligue 1 McDonald's": 18, "Ligue 2 BKT": 18, "Championnat National": 16,
  "J1 League": 20, "J2 League": 20, "J3 League": 20,
  "K League 1": 12, "K League 2": 14, "K3 League": 15,
  "Chinese Super League": 16, "China League One": 16, "China League Two": 16,
  "Saudi Pro League": 18, "Saudi First Division": 18,
  "Thai League 1": 16, "Thai League 2": 18,
  "Malaysia Super League": 13, "Malaysia A1 Semi-Pro League": 16
};

const report = Object.entries(expected).map(([league, teamCount]) => {
  const stored = context.window.CLUBS.filter((club) => club.league === league).length;
  const roster = context.window.LEAGUE_ROSTERS[league];
  const effective = roster ? roster.length : Math.min(stored, teamCount);
  return { league, expected: teamCount, stored, effective, ok: effective === teamCount };
});

console.log(JSON.stringify(report, null, 2));
if (report.some((row) => !row.ok)) process.exitCode = 1;
