const path = require("path");

global.window = {};
require(path.resolve(__dirname, "../data/clubs.js"));

const clubs = window.CLUBS;
const endpoint = "https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=";

async function auditClub(club) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(endpoint + encodeURIComponent(club.name), {
      signal: controller.signal
    });
    const payload = response.ok ? await response.json() : null;
    const teams = payload && payload.teams || [];
    const match = teams.find((team) =>
      (!team.strSport || team.strSport === "Soccer") &&
      Boolean(team.strBadge || team.strTeamBadge)
    );
    return { club, found: Boolean(match) };
  } catch {
    return { club, found: false };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const results = [];
  for (let index = 0; index < clubs.length; index += 12) {
    const batch = clubs.slice(index, index + 12);
    results.push(...await Promise.all(batch.map(auditClub)));
  }

  const leagues = {};
  results.forEach(({ club, found }) => {
    leagues[club.league] ||= { total: 0, found: 0, missing: [] };
    leagues[club.league].total += 1;
    if (found) {
      leagues[club.league].found += 1;
    } else {
      leagues[club.league].missing.push(`${club.id}:${club.name}`);
    }
  });
  console.log(JSON.stringify(leagues, null, 2));
}

main();
