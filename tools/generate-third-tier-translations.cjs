const fs = require("fs");
const https = require("https");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "data", "clubs.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "data", "third-tier-clubs.js"), "utf8"), context);

const clubs = context.window.CLUBS.filter(
  (club) => club.leagueLevel === 3 && club.nameZh === club.name
);
const names = clubs.map((club) => club.name);

function request(params, attempt) {
  const query = new URLSearchParams(Object.assign({
    action: "query",
    format: "json"
  }, params));
  const url = "https://en.wikipedia.org/w/api.php?" + query;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "FootballCareerSimulator/1.0" } }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => {
        if (response.statusCode === 429 && (attempt || 0) < 5) {
          const delay = Math.max(1000, Number(response.headers["retry-after"] || 1) * 1000);
          setTimeout(() => {
            request(params, (attempt || 0) + 1).then(resolve, reject);
          }, delay);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error("Wikipedia API " + response.statusCode));
          return;
        }
        resolve(JSON.parse(body));
      });
    }).on("error", reject);
  });
}

function requestBatch(batch) {
  return request({
    prop: "langlinks",
    lllang: "zh",
    lllimit: "1",
    redirects: "1",
    titles: batch.join("|")
  });
}

async function searchTitle(name) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const result = await request({
    list: "search",
    srsearch: name + " football club",
    srnamespace: "0",
    srlimit: "1"
  });
  const match = result.query && result.query.search && result.query.search[0];
  return match ? match.title : "";
}

async function mapWithConcurrency(items, limit, callback) {
  const result = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      result[index] = await callback(items[index]);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return result;
}

function stripClubSuffix(name) {
  return name
    .replace(/\s+\((?:football club|men)\)$/i, "")
    .replace(/\s+(?:F\.?C\.?|A\.?F\.?C\.?|Calcio)$/i, "")
    .trim();
}

(async function generate() {
  const translations = {};
  for (let index = 0; index < names.length; index += 40) {
    const batch = names.slice(index, index + 40);
    const result = await requestBatch(batch);
    const redirects = {};
    (result.query.redirects || []).forEach((item) => {
      redirects[item.to.toLowerCase()] = item.from;
    });
    Object.values(result.query.pages || {}).forEach((page) => {
      const link = page.langlinks && page.langlinks[0];
      if (!link) return;
      const originalName = redirects[page.title.toLowerCase()] || page.title;
      translations[originalName] = stripClubSuffix(link["*"]);
    });
  }

  const missing = names.filter((name) => !translations[name]);
  const searchedTitles = await mapWithConcurrency(missing, 1, searchTitle);
  const titleToNames = {};
  searchedTitles.forEach((title, index) => {
    if (!title) return;
    (titleToNames[title] ||= []).push(missing[index]);
  });
  const titles = Object.keys(titleToNames);
  for (let index = 0; index < titles.length; index += 40) {
    const result = await requestBatch(titles.slice(index, index + 40));
    Object.values(result.query.pages || {}).forEach((page) => {
      const link = page.langlinks && page.langlinks[0];
      if (!link) return;
      (titleToNames[page.title] || []).forEach((name) => {
        translations[name] = stripClubSuffix(link["*"]);
      });
    });
  }

  const lines = Object.keys(translations).sort().map((name) => {
    return "    " + JSON.stringify(name) + ": " + JSON.stringify(translations[name]);
  });
  const output = [
    "(function () {",
    "  var names = {",
    lines.join(",\n"),
    "  };",
    "  (window.CLUBS || []).forEach(function (club) {",
    "    if (club.leagueLevel === 3 && names[club.name]) club.nameZh = names[club.name];",
    "  });",
    "})();",
    ""
  ].join("\n");
  fs.writeFileSync(path.join(root, "data", "third-tier-translations.js"), output);
  process.stdout.write(JSON.stringify({
    requested: names.length,
    translated: Object.keys(translations).length
  }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
