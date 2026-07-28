(function () {
  var rosters = {
    "Premier League": [
      ["Arsenal", "阿森纳"], ["Aston Villa", "阿斯顿维拉"], ["Bournemouth", "伯恩茅斯"],
      ["Brentford", "布伦特福德"], ["Brighton & Hove Albion", "布莱顿"], ["Burnley", "伯恩利"],
      ["Chelsea", "切尔西"], ["Crystal Palace", "水晶宫"], ["Everton", "埃弗顿"],
      ["Fulham", "富勒姆"], ["Leeds United", "利兹联"], ["Liverpool", "利物浦"],
      ["Manchester City", "曼城"], ["Manchester United", "曼联"], ["Newcastle United", "纽卡斯尔联"],
      ["Nottingham Forest", "诺丁汉森林"], ["Sunderland", "桑德兰"], ["Tottenham Hotspur", "热刺"],
      ["West Ham United", "西汉姆联"], ["Wolverhampton Wanderers", "狼队"]
    ],
    "LALIGA EA SPORTS": [
      ["Athletic Club", "毕尔巴鄂竞技"], ["Atletico de Madrid", "马德里竞技"], ["Osasuna", "奥萨苏纳"],
      ["Celta Vigo", "塞尔塔"], ["Deportivo Alaves", "阿拉维斯"], ["Elche", "埃尔切"],
      ["Barcelona", "巴塞罗那"], ["Getafe", "赫塔费"], ["Levante", "莱万特"],
      ["Malaga", "马拉加"], ["Racing Santander", "桑坦德竞技"], ["Rayo Vallecano", "巴列卡诺"],
      ["Deportivo La Coruna", "拉科鲁尼亚"], ["Espanyol", "西班牙人"], ["Real Betis", "皇家贝蒂斯"],
      ["Real Madrid", "皇家马德里"], ["Real Sociedad", "皇家社会"], ["Sevilla", "塞维利亚"],
      ["Valencia", "瓦伦西亚"], ["Villarreal", "比利亚雷亚尔"]
    ],
    "Bundesliga": [
      ["Augsburg", "奥格斯堡"], ["Union Berlin", "柏林联合"], ["Werder Bremen", "云达不莱梅"],
      ["Borussia Dortmund", "多特蒙德"], ["Elversberg", "埃尔沃斯贝格"], ["Eintracht Frankfurt", "法兰克福"],
      ["Freiburg", "弗赖堡"], ["Hamburger SV", "汉堡"], ["Hoffenheim", "霍芬海姆"],
      ["Koln", "科隆"], ["RB Leipzig", "RB莱比锡"], ["Bayer Leverkusen", "勒沃库森"],
      ["Mainz 05", "美因茨"], ["Borussia Monchengladbach", "门兴格拉德巴赫"], ["Bayern Munich", "拜仁慕尼黑"],
      ["Paderborn", "帕德博恩"], ["Schalke 04", "沙尔克04"], ["Stuttgart", "斯图加特"]
    ],
    "Serie A": [
      ["Atalanta", "亚特兰大"], ["Bologna", "博洛尼亚"], ["Cagliari", "卡利亚里"],
      ["Como", "科莫"], ["Fiorentina", "佛罗伦萨"], ["Frosinone", "弗罗西诺内"],
      ["Genoa", "热那亚"], ["Inter Milan", "国际米兰"], ["Juventus", "尤文图斯"],
      ["Lazio", "拉齐奥"], ["Lecce", "莱切"], ["AC Milan", "AC米兰"],
      ["Napoli", "那不勒斯"], ["Parma", "帕尔马"], ["Pisa", "比萨"],
      ["Roma", "罗马"], ["Sassuolo", "萨索洛"], ["Torino", "都灵"],
      ["Udinese", "乌迪内斯"], ["Verona", "维罗纳"]
    ],
    "Ligue 1 McDonald's": [
      ["Paris Saint-Germain", "巴黎圣日耳曼"], ["Marseille", "马赛"], ["Monaco", "摩纳哥"],
      ["Nice", "尼斯"], ["Lille", "里尔"], ["Lyon", "里昂"], ["Strasbourg", "斯特拉斯堡"],
      ["Lens", "朗斯"], ["Brest", "布雷斯特"], ["Toulouse", "图卢兹"],
      ["Auxerre", "欧塞尔"], ["Rennes", "雷恩"], ["Nantes", "南特"],
      ["Angers", "昂热"], ["Le Havre", "勒阿弗尔"], ["Metz", "梅斯"],
      ["Lorient", "洛里昂"], ["Paris FC", "巴黎FC"]
    ],
    "J1 League": [
      ["Kashima Antlers", "鹿岛鹿角"], ["Urawa Red Diamonds", "浦和红钻"], ["Kashiwa Reysol", "柏太阳神"],
      ["FC Tokyo", "FC东京"], ["Tokyo Verdy", "东京绿茵"], ["Machida Zelvia", "町田泽维亚"],
      ["Kawasaki Frontale", "川崎前锋"], ["Yokohama F. Marinos", "横滨水手"], ["Shimizu S-Pulse", "清水心跳"],
      ["Nagoya Grampus", "名古屋鲸八"], ["Kyoto Sanga", "京都不死鸟"], ["Gamba Osaka", "大阪钢巴"],
      ["Cerezo Osaka", "大阪樱花"], ["Vissel Kobe", "神户胜利船"], ["Fagiano Okayama", "冈山绿雉"],
      ["Sanfrecce Hiroshima", "广岛三箭"], ["Avispa Fukuoka", "福冈黄蜂"], ["Albirex Niigata", "新潟天鹅"],
      ["Shonan Bellmare", "湘南比马"], ["Yokohama FC", "横滨FC"]
    ],
    "K League 1": [
      ["Ulsan HD", "蔚山HD"], ["Gimcheon Sangmu", "金泉尚武"], ["Daejeon Hana Citizen", "大田韩亚市民"],
      ["Pohang Steelers", "浦项制铁"], ["Jeonbuk Hyundai Motors", "全北现代"], ["FC Seoul", "首尔FC"],
      ["Gwangju FC", "光州FC"], ["FC Anyang", "安养FC"], ["Gangwon FC", "江原FC"],
      ["Suwon FC", "水原FC"], ["Jeju SK", "济州SK"], ["Daegu FC", "大邱FC"]
    ],
    "Thai League 1": [
      ["Buriram United", "武里南联"], ["Bangkok United", "曼谷联"], ["BG Pathum United", "巴吞联"],
      ["Port FC", "泰港"], ["Muangthong United", "蒙通联"], ["Ratchaburi", "叻丕"],
      ["Chonburi", "春武里"], ["Chiangrai United", "清莱联"], ["Nakhon Ratchasima", "呵叻"],
      ["Prachuap", "巴蜀"], ["Sukhothai", "素可泰"], ["Uthai Thani", "乌泰他尼"],
      ["Lamphun Warriors", "南奔勇士"], ["Rayong", "罗勇"], ["Ayutthaya United", "大城联"],
      ["Kanchanaburi Power", "北碧动力"]
    ],
    "Malaysia Super League": [
      ["Johor Darul Ta'zim", "柔佛新山"], ["Selangor", "雪兰莪"], ["Sabah", "沙巴"],
      ["Terengganu", "登嘉楼"], ["Kuala Lumpur City", "吉隆坡城"], ["Kedah Darul Aman", "吉打"],
      ["Sri Pahang", "彭亨"], ["Negeri Sembilan", "森美兰"], ["Penang", "槟城"],
      ["Perak", "霹雳"], ["Kelantan Darul Naim", "吉兰丹达鲁纳英"], ["Kuching City", "古晋城"],
      ["PDRM", "皇家警察"]
    ]
  };

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function slug(value) {
    return normalize(value) || "club";
  }

  var CLUB_MATCH_ALIASES = {
    intermilan: ["inter"],
    atleticodemadrid: ["atleticomadrid"],
    monaco: ["asmonaco"],
    lyon: ["olympiquelyonnais"],
    brightonandhovealbion: ["brighton"],
    parissaintgermain: ["parissg"]
  };

  var CLUB_BASE_STRENGTHS = {
    arsenal: 89, liverpool: 90, manchestercity: 92, manchesterunited: 84, chelsea: 86,
    realmadrid: 93, barcelona: 91, atleticodemadrid: 87,
    bayernmunich: 93, borussiadortmund: 87, bayerleverkusen: 88, rbleipzig: 84,
    intermilan: 90, juventus: 86, acmilan: 86, napoli: 88, atalanta: 84,
    parissaintgermain: 93, marseille: 84, monaco: 84, lille: 82, lyon: 81,
    visselkobe: 78, sanfreccehiroshima: 78, kashimaantlers: 78,
    ulsanhd: 77, jeonbukhyundaimotors: 77, pohangsteelers: 76,
    buriramunited: 75, bangkokunited: 73, johordarultazim: 76, selangor: 71
  };
  var LEAGUE_CLUB_PROFILES = {
    "Premier League": { base: 77, salary: 74, reputation: 78, youth: 67, finance: 82 },
    "LALIGA EA SPORTS": { base: 76, salary: 69, reputation: 76, youth: 70, finance: 72 },
    "Bundesliga": { base: 76, salary: 68, reputation: 75, youth: 74, finance: 73 },
    "Serie A": { base: 76, salary: 68, reputation: 76, youth: 68, finance: 70 },
    "Ligue 1 McDonald's": { base: 74, salary: 63, reputation: 72, youth: 73, finance: 66 },
    "J1 League": { base: 70, salary: 52, reputation: 66, youth: 72, finance: 59 },
    "K League 1": { base: 68, salary: 48, reputation: 63, youth: 70, finance: 55 },
    "Thai League 1": { base: 64, salary: 43, reputation: 57, youth: 66, finance: 49 },
    "Malaysia Super League": { base: 62, salary: 40, reputation: 54, youth: 64, finance: 47 }
  };

  window.LEAGUE_ROSTERS = {};
  Object.keys(rosters).forEach(function (league) {
    var existing = window.CLUBS || [];
    window.LEAGUE_ROSTERS[league] = rosters[league].map(function (entry, index) {
      var key = normalize(entry[0]);
      var club = existing.find(function (candidate) {
        var candidateKey = normalize(candidate.name);
        return candidateKey === key ||
          (CLUB_MATCH_ALIASES[key] || []).indexOf(candidateKey) !== -1 ||
          candidate.nameZh === entry[1];
      });
      if (club) {
        club.nameZh = entry[1];
        return club;
      }
      var profile = LEAGUE_CLUB_PROFILES[league];
      var strength = CLUB_BASE_STRENGTHS[key] ||
        Math.max(profile.base - 7, profile.base + 2 - Math.floor(index / 4));
      club = {
        id: "club-" + slug(league) + "-" + slug(entry[0]),
        name: entry[0],
        nameZh: entry[1],
        shortName: entry[0].split(/\s+/).map(function (word) { return word[0]; }).join("").slice(0, 4).toUpperCase(),
        country: league === "J1 League" ? "日本" :
          league === "K League 1" ? "韩国" :
          league === "Thai League 1" ? "泰国" :
          league === "Malaysia Super League" ? "马来西亚" :
          league === "Serie A" ? "意大利" :
          league === "Bundesliga" ? "德国" :
          league === "LALIGA EA SPORTS" ? "西班牙" :
          league === "Ligue 1 McDonald's" ? "法国" : "英格兰",
        region: ["J1 League", "K League 1", "Thai League 1", "Malaysia Super League"].indexOf(league) !== -1 ? "亚洲" : "欧洲",
        league: league,
        leagueLevel: 1,
        band: strength >= 84 ? "豪门" : strength >= 76 ? "强队" : "练级队",
        strength: strength,
        initialStrength: strength,
        squadQuality: strength,
        reputation: Math.max(profile.reputation - 8, profile.reputation + strength - profile.base),
        salaryLevel: Math.max(36, profile.salary + strength - profile.base),
        youthChance: Math.max(42, profile.youth + profile.base - strength),
        finances: Math.max(35, profile.finance + strength - profile.base),
        boardStability: 62 + (index % 5) * 4
      };
      window.CLUBS.push(club);
      return club;
    });
  });
})();
