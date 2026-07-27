const fs = require("fs");
const path = require("path");

global.window = {};
require(path.resolve(__dirname, "../data/clubs.js"));

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const overrideBlock = appSource.match(
  /var CLUB_BADGE_OVERRIDES = \{([\s\S]*?)\n  \};/
);
const fixedBadgeIds = new Set();

if (overrideBlock) {
  const entryPattern = /^\s*(?:"([^"]+)"|([a-zA-Z0-9_-]+)):\s*"https?:\/\/[^"]+"/gm;
  let match;
  while ((match = entryPattern.exec(overrideBlock[1]))) {
    fixedBadgeIds.add(match[1] || match[2]);
  }
}

const topFiveLeagues = new Set([
  "Premier League",
  "LALIGA EA SPORTS",
  "Bundesliga",
  "Serie A",
  "Ligue 1 McDonald's"
]);

const report = {};
window.CLUBS
  .filter((club) => topFiveLeagues.has(club.league))
  .forEach((club) => {
    report[club.league] ||= { total: 0, fixed: 0, missing: [] };
    report[club.league].total += 1;
    if (fixedBadgeIds.has(club.id)) {
      report[club.league].fixed += 1;
    } else {
      report[club.league].missing.push(`${club.id}:${club.name}`);
    }
  });

const missingTotal = Object.values(report)
  .reduce((sum, league) => sum + league.missing.length, 0);

console.log(JSON.stringify({
  leagues: report,
  total: Object.values(report).reduce((sum, league) => sum + league.total, 0),
  fixed: Object.values(report).reduce((sum, league) => sum + league.fixed, 0),
  missing: missingTotal
}, null, 2));

process.exitCode = missingTotal ? 1 : 0;
