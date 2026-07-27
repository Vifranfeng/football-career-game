(function () {
  var app = document.getElementById("app");
  var clubBadgeCache = {};
  var clubBadgeRequests = {};
  var CLUB_BADGE_CACHE_PREFIX = "football-career-badge:";
  var CLUB_BADGE_SEARCH_ALIASES = {
    "Inter Milan": "Internazionale",
    "Atletico de Madrid": "Atletico Madrid",
    "Bayern Munich": "Bayern Munchen",
    "Paris Saint-Germain": "Paris SG",
    "Sporting CP": "Sporting Lisbon",
    "Manchester United": "Man United",
    "Manchester City": "Man City"
  };
  var LEAGUE_MATCH_COUNTS = {
    "Premier League": 38,
    "EFL Championship": 46,
    "EFL League One": 46,
    "LALIGA EA SPORTS": 38,
    "LALIGA HYPERMOTION": 42,
    "Primera Federación": 38,
    "Bundesliga": 34,
    "2. Bundesliga": 34,
    "3. Liga": 38,
    "Serie A": 38,
    "Serie BKT": 38,
    "Serie C": 38,
    "Ligue 1 McDonald's": 34,
    "Ligue 2 BKT": 34,
    "Championnat National": 30,
    "J1 League": 38,
    "J2 League": 38,
    "J3 League": 38,
    "K League 1": 38,
    "K League 2": 36,
    "K3 League": 28,
    "Chinese Super League": 30,
    "China League One": 30,
    "China League Two": 30,
    "Saudi Pro League": 34,
    "Saudi First Division": 34,
    "Saudi Second Division": 30,
    "Thai League 1": 30,
    "Thai League 2": 34,
    "Malaysia Super League": 24,
    "Malaysia A1 Semi-Pro League": 30
  };
  var LEAGUE_TEAM_COUNTS = {
    "Premier League": 20,
    "EFL Championship": 24,
    "EFL League One": 24,
    "LALIGA EA SPORTS": 20,
    "LALIGA HYPERMOTION": 22,
    "Primera Federación": 20,
    "Bundesliga": 18,
    "2. Bundesliga": 18,
    "3. Liga": 20,
    "Serie A": 20,
    "Serie BKT": 20,
    "Serie C": 20,
    "Ligue 1 McDonald's": 18,
    "Ligue 2 BKT": 18,
    "Championnat National": 16,
    "J1 League": 20,
    "J2 League": 20,
    "J3 League": 20,
    "K League 1": 12,
    "K League 2": 14,
    "K3 League": 15,
    "Chinese Super League": 16,
    "China League One": 16,
    "China League Two": 16,
    "Saudi Pro League": 18,
    "Saudi First Division": 18,
    "Saudi Second Division": 16,
    "Thai League 1": 16,
    "Thai League 2": 18,
    "Malaysia Super League": 13,
    "Malaysia A1 Semi-Pro League": 16
  };
  var PROMOTION_LEAGUE_MAP = {
    "EFL Championship": "Premier League",
    "EFL League One": "EFL Championship",
    "LALIGA HYPERMOTION": "LALIGA EA SPORTS",
    "Primera Federación": "LALIGA HYPERMOTION",
    "2. Bundesliga": "Bundesliga",
    "3. Liga": "2. Bundesliga",
    "Serie BKT": "Serie A",
    "Serie C": "Serie BKT",
    "Ligue 2 BKT": "Ligue 1 McDonald's",
    "Championnat National": "Ligue 2 BKT",
    "J2 League": "J1 League",
    "J3 League": "J2 League",
    "K League 2": "K League 1",
    "K3 League": "K League 2",
    "China League One": "Chinese Super League",
    "China League Two": "China League One",
    "Saudi First Division": "Saudi Pro League",
    "Saudi Second Division": "Saudi First Division",
    "Thai League 2": "Thai League 1",
    "Malaysia A1 Semi-Pro League": "Malaysia Super League"
  };
  var RELEGATION_LEAGUE_MAP = {
    "Premier League": "EFL Championship",
    "EFL Championship": "EFL League One",
    "LALIGA EA SPORTS": "LALIGA HYPERMOTION",
    "LALIGA HYPERMOTION": "Primera Federación",
    "Bundesliga": "2. Bundesliga",
    "2. Bundesliga": "3. Liga",
    "Serie A": "Serie BKT",
    "Serie BKT": "Serie C",
    "Ligue 1 McDonald's": "Ligue 2 BKT",
    "Ligue 2 BKT": "Championnat National",
    "J1 League": "J2 League",
    "J2 League": "J3 League",
    "K League 1": "K League 2",
    "K League 2": "K3 League",
    "Chinese Super League": "China League One",
    "China League One": "China League Two",
    "Saudi Pro League": "Saudi First Division",
    "Saudi First Division": "Saudi Second Division",
    "Thai League 1": "Thai League 2",
    "Malaysia Super League": "Malaysia A1 Semi-Pro League"
  };
  var POSITIONS = [
    { value: "GK", label: "GK 门将" },
    { value: "CB", label: "CB 中后卫" },
    { value: "LB", label: "LB 边后卫" },
    { value: "RB", label: "RB 边后卫" },
    { value: "CM", label: "CM 中场" },
    { value: "CAM", label: "CAM 前腰" },
    { value: "LM", label: "LM 边前卫" },
    { value: "RM", label: "RM 边前卫" },
    { value: "LW", label: "LW 边锋" },
    { value: "RW", label: "RW 边锋" },
    { value: "ST", label: "ST 中锋" }
  ];
  var STARTING_LEAGUES = [
    { key: "asia", label: "亚洲联赛起步" },
    { key: "second", label: "欧洲次级联赛起步" },
    { key: "ladder", label: "五大联赛练级队起步" },
    { key: "big5", label: "五大联赛强队起步" }
  ];
  var PLAYER_ORIGINS = [
    "校园足球出身",
    "街头足球出身",
    "体校体系出身",
    "地方青少年联赛出身",
    "留洋少年出身",
    "职业梯队早期选材"
  ];
  var POSITION_RATES = {
    GK: { goal: 0.0005, assist: 0.012 },
    CB: { goal: 0.035, assist: 0.025 },
    LB: { goal: 0.1, assist: 0.12 },
    RB: { goal: 0.1, assist: 0.12 },
    CM: { goal: 0.1, assist: 0.13 },
    CAM: { goal: 0.27, assist: 0.15 },
    LM: { goal: 0.16, assist: 0.18 },
    RM: { goal: 0.16, assist: 0.18 },
    LW: { goal: 0.25, assist: 0.18 },
    RW: { goal: 0.25, assist: 0.18 },
    ST: { goal: 0.32, assist: 0.18 }
  };
  var CLUB_STYLE_OVERRIDES = {
    mancity: { name: "高位压迫 / 控球渗透", chances: 1.18, press: 1.12, setPieces: 1.02, fullbackAssists: 0.92, forwardAssists: 1.18 },
    arsenal: { name: "控球推进 / 定位球强攻", chances: 1.12, press: 1.08, setPieces: 1.32, fullbackAssists: 1.06, forwardAssists: 1.08 },
    liverpool: { name: "高位压迫 / 快速纵深", chances: 1.16, press: 1.16, setPieces: 1.12, fullbackAssists: 1.25, forwardAssists: 1.08 },
    manutd: { name: "快速转换 / 边路冲击", chances: 1.02, press: 1.02, setPieces: 1.05, fullbackAssists: 1.08, forwardAssists: 1.02 },
    "london-blue": { name: "高位压迫 / 控球推进", chances: 1.08, press: 1.12, setPieces: 1.2, fullbackAssists: 1.12, forwardAssists: 1.06 },
    newcastle: { name: "高强度压迫 / 边路推进", chances: 1.06, press: 1.14, setPieces: 1.16, fullbackAssists: 1.12, forwardAssists: 0.98 },
    tottenham: { name: "高位防线 / 快速进攻", chances: 1.1, press: 1.1, setPieces: 0.96, fullbackAssists: 1.15, forwardAssists: 1.04 },
    "madrid-royal": { name: "控球调度 / 纵向突击", chances: 1.18, press: 1.04, setPieces: 1.08, fullbackAssists: 1.08, forwardAssists: 1.1 },
    barcelona: { name: "控球主导 / 肋部渗透", chances: 1.15, press: 1.08, setPieces: 0.94, fullbackAssists: 1.08, forwardAssists: 1.2 },
    atletico: { name: "紧凑防守 / 直接反击", chances: 0.98, press: 1.05, setPieces: 1.2, fullbackAssists: 0.98, forwardAssists: 0.96 },
    "munich-red": { name: "高位压迫 / 边中结合", chances: 1.18, press: 1.16, setPieces: 1.06, fullbackAssists: 1.18, forwardAssists: 1.06 },
    dortmund: { name: "青春风暴 / 快速转换", chances: 1.11, press: 1.1, setPieces: 0.98, fullbackAssists: 1.1, forwardAssists: 1.06 },
    leverkusen: { name: "三中卫推进 / 翼卫主导", chances: 1.12, press: 1.08, setPieces: 1.06, fullbackAssists: 1.32, forwardAssists: 1.08 },
    inter: { name: "三中卫体系 / 翼卫推进", chances: 1.1, press: 1.02, setPieces: 1.14, fullbackAssists: 1.34, forwardAssists: 1.08 },
    juventus: { name: "稳守控制 / 伺机推进", chances: 0.99, press: 0.98, setPieces: 1.12, fullbackAssists: 1.02, forwardAssists: 0.98 },
    "milan-night": { name: "快速转换 / 左路冲击", chances: 1.06, press: 1.04, setPieces: 1.04, fullbackAssists: 1.14, forwardAssists: 1.02 },
    "paris-lumiere": { name: "高位压迫 / 巨星进攻", chances: 1.18, press: 1.15, setPieces: 0.98, fullbackAssists: 1.08, forwardAssists: 1.15 }
  };
  var CLUB_LEAGUE_PRIORS = {
    "madrid-royal": { expected: 1.8, volatility: 1, normalMax: 3, shockChance: 0.025, shockMax: 7 },
    barcelona: { expected: 2, volatility: 1, normalMax: 4, shockChance: 0.04, shockMax: 8 },
    atletico: { expected: 3.2, volatility: 1.5, normalMax: 6, shockChance: 0.06, shockMax: 10 },
    "munich-red": { expected: 1.5, volatility: 1, normalMax: 3, shockChance: 0.035, shockMax: 7 },
    leverkusen: { expected: 3, volatility: 2, normalMax: 7, shockChance: 0.08, shockMax: 11 },
    dortmund: { expected: 4, volatility: 2.5, normalMax: 8, shockChance: 0.1, shockMax: 12 },
    "paris-lumiere": { expected: 1.4, volatility: 1, normalMax: 3, shockChance: 0.025, shockMax: 6 },
    inter: { expected: 2.2, volatility: 1.5, normalMax: 5, shockChance: 0.05, shockMax: 8 },
    juventus: { expected: 4, volatility: 2, normalMax: 7, shockChance: 0.08, shockMax: 11 },
    "milan-night": { expected: 4.5, volatility: 2.5, normalMax: 8, shockChance: 0.1, shockMax: 12 },
    arsenal: { expected: 2.5, volatility: 1.5, normalMax: 5, shockChance: 0.06, shockMax: 9 },
    liverpool: { expected: 2.8, volatility: 2, normalMax: 6, shockChance: 0.07, shockMax: 10 },
    mancity: { expected: 2.2, volatility: 2, normalMax: 6, shockChance: 0.06, shockMax: 10 },
    manutd: { expected: 6.5, volatility: 3.5, normalMax: 12, shockChance: 0.14, shockMax: 16 },
    "london-blue": { expected: 5.5, volatility: 3, normalMax: 11, shockChance: 0.12, shockMax: 15 },
    tottenham: { expected: 6, volatility: 3, normalMax: 11, shockChance: 0.12, shockMax: 15 }
  };
  var CLUB_TITLE_PROFILES = {
    "paris-lumiere": 0.68,
    "munich-red": 0.56,
    "madrid-royal": 0.44,
    barcelona: 0.4,
    mancity: 0.36,
    inter: 0.3,
    liverpool: 0.25,
    juventus: 0.24,
    arsenal: 0.2,
    "milan-night": 0.18,
    "london-blue": 0.16,
    atletico: 0.15,
    leverkusen: 0.14,
    manutd: 0.12
  };
  var CLUB_BADGE_OVERRIDES = {
    "paris-lumiere": "https://crests.football-data.org/524.png",
    "blackpool-l1": "https://r2.thesportsdb.com/images/media/team/badge/utywru1448754934.png",
    "reading-l1": "https://r2.thesportsdb.com/images/media/team/badge/tprvtu1448811527.png",
    "huddersfield-l1": "https://r2.thesportsdb.com/images/media/team/badge/y11fin1677527513.png",
    "barnsley-l1": "https://r2.thesportsdb.com/images/media/team/badge/glbmdm1781719675.png",
    "murcia-rfef": "https://r2.thesportsdb.com/images/media/team/badge/zoo96h1747995489.png",
    "nastic-rfef": "https://r2.thesportsdb.com/images/media/team/badge/tpytry1447591259.png",
    "lugo-rfef": "https://r2.thesportsdb.com/images/media/team/badge/iwnbbw1616444140.png",
    "sabadell-rfef": "https://r2.thesportsdb.com/images/media/team/badge/21mapu1690094066.png",
    "hansa-3liga": "https://r2.thesportsdb.com/images/media/team/badge/g96u1z1660300651.png",
    "aachen-3liga": "https://r2.thesportsdb.com/images/media/team/badge/hcbovz1726533617.png",
    "duisburg-3liga": "https://r2.thesportsdb.com/images/media/team/badge/16m3st1677552500.png",
    "catania-seriec": "https://r2.thesportsdb.com/images/media/team/badge/mov8wk1677499346.png",
    "perugia-seriec": "https://r2.thesportsdb.com/images/media/team/badge/7e4l2k1603811720.png",
    "crotone-seriec": "https://r2.thesportsdb.com/images/media/team/badge/u7d49h1677257238.png",
    "ternana-seriec": "https://r2.thesportsdb.com/images/media/team/badge/1ohbvo1754608758.png",
    "sochaux-national": "https://r2.thesportsdb.com/images/media/team/badge/ymsdjh1766618296.png",
    "dijon-national": "https://r2.thesportsdb.com/images/media/team/badge/viin5f1547898121.png",
    "rouen-national": "https://r2.thesportsdb.com/images/media/team/badge/6m1fwf1690606286.png",
    "valenciennes-national": "https://www.thesportsdb.com/images/media/team/badge/guirg71784504305.png",
    "dalian-kewei-c2": "https://r2.thesportsdb.com/images/media/team/badge/tu9jt11773419457.png",
    "lanzhou-longyuan-c2": "https://r2.thesportsdb.com/images/media/team/badge/9mwt3z1740761964.png",
    "shenzhen-2028-c2": "https://r2.thesportsdb.com/images/media/team/badge/hkpf1s1737320216.png",
    "chengdu-b-c2": "https://r2.thesportsdb.com/images/media/team/badge/e693gt1737321270.png",
    "gifu-j3": "https://r2.thesportsdb.com/images/media/team/badge/6omgdc1590074208.png",
    "nagano-j3": "https://www.thesportsdb.com/images/media/team/badge/e21v6l1782756856.png",
    "tottori-j3": "https://r2.thesportsdb.com/images/media/team/badge/c6w78x1617289656.png",
    "fukushima-j3": "https://r2.thesportsdb.com/images/media/team/badge/arv5gu1617289649.png",
    "gimhae-k3": "https://r2.thesportsdb.com/images/media/team/badge/hhi8821771815980.png",
    "gyeongju-k3": "https://r2.thesportsdb.com/images/media/team/badge/csmz091747852775.png"
  };
  var EUROPEAN_QUALIFICATION_RULES = {
    "Premier League": { championsLeague: 5, europaLeague: 6, conferenceLeague: 7, cupWinner: "欧联杯" },
    "LALIGA EA SPORTS": { championsLeague: 5, europaLeague: 6, conferenceLeague: 7, cupWinner: "欧联杯" },
    "Bundesliga": { championsLeague: 4, europaLeague: 5, conferenceLeague: 6, cupWinner: "欧联杯" },
    "Serie A": { championsLeague: 4, europaLeague: 5, conferenceLeague: 6, cupWinner: "欧联杯" },
    "Ligue 1 McDonald's": { championsLeague: 3, championsLeagueQualifying: 4, europaLeague: 5, conferenceLeague: 6, cupWinner: "欧联杯" }
  };
  var LEAGUE_POINTS_PROFILES = {
    "Premier League": { top: 2.34, middle: 1.38, bottom: 0.82 },
    "LALIGA EA SPORTS": { top: 2.36, middle: 1.34, bottom: 0.79 },
    "Bundesliga": { top: 2.29, middle: 1.36, bottom: 0.82 },
    "Serie A": { top: 2.28, middle: 1.34, bottom: 0.79 },
    "Ligue 1 McDonald's": { top: 2.35, middle: 1.31, bottom: 0.76 }
  };
  var POSITION_SKILL_BASES = {
    GK: { dribbling: 42, offBall: 44, workRate: 58, passing: 56, finishing: 32, defending: 72 },
    CB: { dribbling: 46, offBall: 50, workRate: 66, passing: 58, finishing: 38, defending: 76 },
    LB: { dribbling: 58, offBall: 60, workRate: 72, passing: 60, finishing: 42, defending: 66 },
    RB: { dribbling: 58, offBall: 60, workRate: 72, passing: 60, finishing: 42, defending: 66 },
    CM: { dribbling: 62, offBall: 64, workRate: 68, passing: 74, finishing: 52, defending: 58 },
    CAM: { dribbling: 76, offBall: 72, workRate: 62, passing: 76, finishing: 68, defending: 42 },
    LM: { dribbling: 72, offBall: 66, workRate: 64, passing: 64, finishing: 58, defending: 44 },
    RM: { dribbling: 72, offBall: 66, workRate: 64, passing: 64, finishing: 58, defending: 44 },
    LW: { dribbling: 78, offBall: 64, workRate: 58, passing: 60, finishing: 68, defending: 36 },
    RW: { dribbling: 78, offBall: 64, workRate: 58, passing: 60, finishing: 68, defending: 36 },
    ST: { dribbling: 68, offBall: 74, workRate: 58, passing: 48, finishing: 80, defending: 30 }
  };
  var POSITION_OVR_WEIGHTS = {
    GK: { reflexes: 0.32, defending: 0.2, aerial: 0.14, passing: 0.12, vision: 0.08, strength: 0.08, workRate: 0.06 },
    CB: { defending: 0.31, strength: 0.18, aerial: 0.16, pace: 0.1, passing: 0.09, workRate: 0.09, vision: 0.04, dribbling: 0.03 },
    LB: { defending: 0.2, pace: 0.18, workRate: 0.15, passing: 0.14, dribbling: 0.12, vision: 0.08, strength: 0.07, offBall: 0.06 },
    RB: { defending: 0.2, pace: 0.18, workRate: 0.15, passing: 0.14, dribbling: 0.12, vision: 0.08, strength: 0.07, offBall: 0.06 },
    CM: { passing: 0.2, vision: 0.17, workRate: 0.14, dribbling: 0.12, defending: 0.11, offBall: 0.09, strength: 0.07, pace: 0.05, finishing: 0.05 },
    CAM: { dribbling: 0.2, vision: 0.18, passing: 0.17, offBall: 0.14, finishing: 0.13, pace: 0.08, workRate: 0.05, strength: 0.03, defending: 0.02 },
    LM: { pace: 0.18, dribbling: 0.18, passing: 0.15, vision: 0.12, offBall: 0.12, workRate: 0.1, finishing: 0.09, defending: 0.03, strength: 0.03 },
    RM: { pace: 0.18, dribbling: 0.18, passing: 0.15, vision: 0.12, offBall: 0.12, workRate: 0.1, finishing: 0.09, defending: 0.03, strength: 0.03 },
    LW: { pace: 0.2, dribbling: 0.2, finishing: 0.17, offBall: 0.14, passing: 0.1, vision: 0.08, workRate: 0.05, strength: 0.04, defending: 0.02 },
    RW: { pace: 0.2, dribbling: 0.2, finishing: 0.17, offBall: 0.14, passing: 0.1, vision: 0.08, workRate: 0.05, strength: 0.04, defending: 0.02 },
    ST: { finishing: 0.25, offBall: 0.2, pace: 0.14, strength: 0.12, aerial: 0.1, dribbling: 0.08, workRate: 0.05, passing: 0.04, vision: 0.02 }
  };
  var POSITION_CAREER_CURVES = {
    GK: { peakStart: 28, peakEnd: 34, hardDecline: 37 },
    CB: { peakStart: 27, peakEnd: 32, hardDecline: 35 },
    LB: { peakStart: 25, peakEnd: 30, hardDecline: 33 },
    RB: { peakStart: 25, peakEnd: 30, hardDecline: 33 },
    CM: { peakStart: 27, peakEnd: 32, hardDecline: 35 },
    CAM: { peakStart: 25, peakEnd: 30, hardDecline: 33 },
    LM: { peakStart: 24, peakEnd: 29, hardDecline: 32 },
    RM: { peakStart: 24, peakEnd: 29, hardDecline: 32 },
    LW: { peakStart: 24, peakEnd: 29, hardDecline: 32 },
    RW: { peakStart: 24, peakEnd: 29, hardDecline: 32 },
    ST: { peakStart: 25, peakEnd: 30, hardDecline: 34 }
  };
  var CLUB_IDENTITY_EVENTS = {
    "madrid-royal": { title: "伯纳乌要求又一次欧战逆转", text: "主场从不接受提前认输，球队准备在淘汰赛落后局面中持续压上。", labels: ["接管最后二十分钟", "坚持控制风险", "把决胜交给整体"] },
    liverpool: { title: "安菲尔德等待一场逆转", text: "首回合劣势让所有人都在谈论主场之夜，开场强度将决定比赛是否还有悬念。", labels: ["从开场发动围攻", "耐心追回差距", "优先避免再次丢球"] },
    manutd: { title: "老特拉福德要求战斗到补时", text: "球队在关键战末段仍然落后，更衣室希望有人把永不放弃变成真正的场上行动。", labels: ["带队持续压上", "等待最后一次机会", "保持阵型不失控"] },
    barcelona: { title: "教练组重申控球传统", text: "球队希望在压力最大的比赛里仍由传球、站位和青训体系主导节奏。", labels: ["主动成为传控枢纽", "增加纵向冒险", "服从既定位置纪律"] },
    "munich-red": { title: "更衣室只接受冠军标准", text: "国内争冠进入冲刺期，任何松懈都会被视为不符合球队长期形成的胜者要求。", labels: ["公开承担争冠责任", "用训练提高强度", "拒绝额外口号"] },
    arsenal: { title: "争冠冲刺再次考验心态", text: "积分优势正在缩小，接下来的强强对话会决定球队能否把长期领先真正换成奖杯。", labels: ["主动稳定更衣室", "把压力转成进攻", "淡化冠军讨论"] },
    mancity: { title: "末轮争冠进入最后时刻", text: "冠军归属可能在最后一轮甚至最后几分钟改变，球队必须持续寻找进球。", labels: ["推动全队继续进攻", "控制比赛等待机会", "保护当前赛果"] },
    "milan-night": { title: "圣西罗期待重返欧洲之巅", text: "俱乐部的欧战传统让普通晋级远远不够，淘汰赛压力已经传到更衣室。", labels: ["承担欧战核心职责", "先重建防守秩序", "拒绝活在历史中"] },
    inter: { title: "三中卫体系迎来终极考验", text: "强敌准备针对翼卫身后发动冲击，教练组需要全队在纪律与主动性之间作出选择。", labels: ["强化整体协防", "主动提高压迫线", "坚持原有部署"] },
    juventus: { title: "一球优势进入守成阶段", text: "球队需要决定是继续依靠防守传统，还是主动寻找终结比赛的第二球。", labels: ["领导防线守住优势", "推动阵型向前", "维持攻守平衡"] },
    "london-blue": { title: "杯赛之路再次成为赛季出口", text: "联赛起伏让杯赛成为挽救赛季的关键，更衣室必须适应高压淘汰赛。", labels: ["主动承担杯赛压力", "接受务实踢法", "优先保证联赛"] },
    "paris-lumiere": { title: "巴黎只缺少欧洲最高奖杯", text: "国内成绩已经无法满足外界，所有评价都将集中在欧冠淘汰赛。", labels: ["接受欧冠成败标准", "要求团队分担压力", "专注自己的职责"] }
  };
  var POSITION_GROUP_LABELS = {
    GK: "门将",
    DEF: "后场",
    MID: "中场",
    WIDE: "边路",
    ST: "锋线"
  };
  var LEAGUE_NAME_ZH = {
    "Premier League": "英超",
    "EFL Championship": "英冠",
    "EFL League One": "英甲",
    "LALIGA EA SPORTS": "西甲",
    "LALIGA HYPERMOTION": "西乙",
    "Primera Federación": "西协甲",
    "Bundesliga": "德甲",
    "2. Bundesliga": "德乙",
    "3. Liga": "德丙",
    "Serie A": "意甲",
    "Serie BKT": "意乙",
    "Serie C": "意丙",
    "Ligue 1 McDonald's": "法甲",
    "Ligue 2 BKT": "法乙",
    "Championnat National": "法丙",
    "J1 League": "日职联",
    "J2 League": "日职乙",
    "J3 League": "日职丙",
    "K League 1": "韩K1联",
    "K League 2": "韩K2联",
    "K3 League": "韩国K3联赛",
    "Chinese Super League": "中超",
    "China League One": "中甲",
    "China League Two": "中乙",
    "Saudi Pro League": "沙特联",
    "Saudi First Division": "沙特甲",
    "Saudi Second Division": "沙特乙",
    "Thai League 1": "泰超",
    "Thai League 2": "泰甲",
    "Malaysia Super League": "马来超",
    "Malaysia A1 Semi-Pro League": "马来西亚A1联赛"
  };
  var CLUB_NAME_ZH = {
    arsenal: "阿森纳",
    liverpool: "利物浦",
    manutd: "曼联",
    mancity: "曼城",
    tottenham: "热刺",
    newcastle: "纽卡斯尔联",
    villa: "阿斯顿维拉",
    "london-blue": "切尔西",
    brighton: "布莱顿",
    brentford: "布伦特福德",
    everton: "埃弗顿",
    southampton: "南安普顿",
    watford: "沃特福德",
    birmingham: "伯明翰城",
    wrexham: "雷克瑟姆",
    bolton: "博尔顿",
    sunderland: "桑德兰",
    middlesbrough: "米德尔斯堡",
    westbrom: "西布朗",
    norwich: "诺维奇",
    millwall: "米尔沃尔",
    derbycounty: "德比郡",
    deportivo: "拉科鲁尼亚",
    malaga: "马拉加",
    gijon: "希洪竞技",
    oviedo: "皇家奥维耶多",
    cadiz: "加的斯",
    granada: "格拉纳达",
    almeria: "阿尔梅里亚",
    eibar: "埃瓦尔",
    valladolid: "巴拉多利德",
    laspalmas: "拉斯帕尔马斯",
    leganes: "莱加内斯",
    tenerife: "特内里费",
    "sevilla-sol": "塞维利亚",
    betis: "皇家贝蒂斯",
    villarreal: "比利亚雷亚尔",
    atletico: "马德里竞技",
    barcelona: "巴塞罗那",
    espanyol: "西班牙人",
    "madrid-royal": "皇家马德里",
    hamburg: "汉堡",
    hertha: "柏林赫塔",
    hannover: "汉诺威96",
    wolfsburg2: "沃尔夫斯堡",
    heidenheim2: "海登海姆",
    stpauli2: "圣保利",
    darmstadt: "达姆施塔特",
    kaiserslautern: "凯泽斯劳滕",
    nurnberg: "纽伦堡",
    bochum2: "波鸿",
    karlsruhe: "卡尔斯鲁厄",
    dresden: "德累斯顿迪纳摩",
    kiel2: "荷尔斯泰因基尔",
    bielefeld: "比勒费尔德",
    magdeburg: "马格德堡",
    braunschweig: "不伦瑞克",
    furth: "菲尔特",
    cottbus: "科特布斯能源",
    osnabruck: "奥斯纳布吕克",
    "berlin-wall": "斯图加特",
    frankfurt: "法兰克福",
    dortmund: "多特蒙德",
    leverkusen: "勒沃库森",
    schalke: "沙尔克04",
    "munich-red": "拜仁慕尼黑",
    palermo: "巴勒莫",
    spezia: "斯佩齐亚",
    bari: "巴里",
    sampdoria: "桑普多利亚",
    pisa2: "比萨",
    modena: "摩德纳",
    cesena: "切塞纳",
    cremonese2: "克雷莫内塞",
    empoli2: "恩波利",
    catanzaro: "卡坦扎罗",
    "turin-bulls": "都灵",
    fiorentina: "佛罗伦萨",
    roma: "罗马",
    "milan-night": "AC米兰",
    inter: "国际米兰",
    juventus: "尤文图斯",
    guingamp: "甘冈",
    amiens: "亚眠",
    troyes: "特鲁瓦",
    ajaccio: "阿雅克肖",
    clermont: "克莱蒙",
    grenoble: "格勒诺布尔",
    laval: "拉瓦勒",
    pau: "波城",
    rodez: "罗德兹",
    nancy: "南锡",
    redstar: "红星",
    reims2: "兰斯",
    montpellier2: "蒙彼利埃",
    "lyon-river": "里昂",
    "saint-etienne": "圣埃蒂安",
    "marseille-wave": "马赛",
    monaco: "摩纳哥",
    lille: "里尔",
    "paris-lumiere": "巴黎圣日耳曼",
    "tokyo-storm": "FC东京",
    tokyoverdy: "东京绿茵",
    gamba: "大阪钢巴",
    cerezo: "大阪樱花",
    kashima: "鹿岛鹿角",
    yokohama: "横滨水手",
    kawasaki: "川崎前锋",
    urawa: "浦和红钻",
    vegalta: "仙台七夕",
    jubilo: "磐田喜悦",
    "seoul-dragon": "首尔FC",
    pohang: "浦项制铁",
    jeonbuk: "全北现代",
    ulsan: "蔚山HD",
    suwonblue: "水原三星蓝翼",
    busan: "釜山偶像",
    shanghaiport: "上海海港",
    shenhua: "上海申花",
    guoan: "北京国安",
    taishan: "山东泰山",
    chengdu: "成都蓉城",
    tianjin: "天津津门虎",
    zhejiang: "浙江队",
    wuhan: "武汉三镇",
    henan: "河南队",
    qingdaowc: "青岛西海岸",
    qingdao: "青岛海牛",
    changchun: "长春亚泰",
    shenzhen: "深圳鹏城",
    meizhou: "梅州客家",
    dalian: "大连英博",
    yunnan: "云南玉昆",
    liaoning: "辽宁铁人",
    chongqing: "重庆铜梁龙",
    guangdonggz: "广东广州豹",
    yanbian: "延边龙鼎",
    shijiazhuang: "石家庄功夫",
    suzhou: "苏州东吴",
    guangxi: "广西平果",
    nanjing: "南京城市",
    foshan: "佛山南狮",
    jiading: "上海嘉定汇龙",
    daliankun: "大连鲲城",
    shaanxiunion: "陕西联合",
    qingdaored: "青岛红狮",
    heilongjiang: "黑龙江冰城",
    shenzhenjunior: "深圳青年人",
    dingnan: "定南赣联",
    buriram: "武里南联",
    bgpathum: "巴吞联",
    jdt: "柔佛DT",
    hilal: "利雅得新月",
    nassr: "利雅得胜利",
    ittihad: "吉达联合",
    ahli: "吉达国民",
    shabab: "利雅得青年人",
    qadsiah: "卡迪西亚",
    ettifaq: "达曼协作",
    taawoun: "布赖代合作",
    neom: "尼奥姆",
    fateh: "哈萨征服",
    fayha: "费哈",
    khaleej: "海湾",
    riyadh: "利雅得体育",
    hazem: "哈森姆",
    kholood: "胡卢德",
    abha: "艾卜哈",
    faisaly: "费萨里",
    diriyah: "德拉伊耶",
    damac: "达马克"
  };

  var state = {
    screen: "create",
    player: null,
    currentEvent: null,
    round: 0,
    latestSummary: null,
    transferOptions: [],
    lastChoiceLabel: "",
    lastChoiceOutcome: "",
    lastChoiceResultType: "neutral",
    gameOver: false,
    clubForms: {},
    clubEconomics: {},
    clubLeagueOrigins: {}
  };

  function init() {
    render();
  }

  function render() {
    if (state.screen === "create") {
      renderCreateScreen();
      return;
    }

    if (!state.player) {
      state.screen = "create";
      renderCreateScreen();
      return;
    }

    if (state.screen === "event") {
      renderEventScreen();
      return;
    }

    if (state.screen === "summary") {
      renderSummaryScreenV2();
      return;
    }

    if (state.screen === "retirement") {
      renderRetirementScreen();
    }
  }

  function buildClubBadge(club, extraClass) {
    if (!club) {
      return '<span class="club-api-badge club-api-badge-fallback">?</span>';
    }
    return '<span class="club-api-badge ' + (extraClass || "") + '" data-club-badge="' +
      club.id + '"><span class="club-api-fallback">' + club.shortName + "</span></span>";
  }

  function hydrateClubBadges() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-club-badge]"));
    var uniqueClubIds = unique(nodes.map(function (node) {
      return node.getAttribute("data-club-badge");
    }));
    uniqueClubIds.forEach(function (clubId) {
      loadClubBadge(clubId).then(function (badgeUrl) {
        if (!badgeUrl) return;
        Array.prototype.forEach.call(document.querySelectorAll('[data-club-badge="' + clubId + '"]'), function (node) {
          if (node.querySelector("img")) return;
          var image = document.createElement("img");
          image.src = badgeUrl;
          image.alt = getClubDisplayName(getClubById(clubId)) + " 队徽";
          image.loading = "lazy";
          image.addEventListener("error", function () {
            image.remove();
            node.classList.remove("club-api-badge-loaded");
            delete clubBadgeCache[clubId];
            removePersistentClubBadge(clubId);
          });
          node.appendChild(image);
          node.classList.add("club-api-badge-loaded");
        });
      });
    });
  }

  function loadClubBadge(clubId) {
    if (Object.prototype.hasOwnProperty.call(clubBadgeCache, clubId)) {
      return Promise.resolve(clubBadgeCache[clubId]);
    }
    if (clubBadgeRequests[clubId]) {
      return clubBadgeRequests[clubId];
    }
    var club = getClubById(clubId);
    if (!club) {
      return Promise.resolve("");
    }
    var fallbackBadge = buildFallbackClubBadge(club);
    if (CLUB_BADGE_OVERRIDES[clubId]) {
      clubBadgeCache[clubId] = CLUB_BADGE_OVERRIDES[clubId];
      return Promise.resolve(CLUB_BADGE_OVERRIDES[clubId]);
    }
    var persistedBadge = getPersistentClubBadge(clubId);
    if (persistedBadge) {
      clubBadgeCache[clubId] = persistedBadge;
      return Promise.resolve(persistedBadge);
    }
    if (typeof fetch !== "function") {
      return Promise.resolve(fallbackBadge);
    }
    var searchNames = unique([
      club.apiName || club.name,
      CLUB_BADGE_SEARCH_ALIASES[club.name]
    ].filter(Boolean));
    clubBadgeRequests[clubId] = searchClubBadgeTerms(searchNames, club)
      .then(function (badgeUrl) {
        if (badgeUrl) {
          clubBadgeCache[clubId] = badgeUrl;
          persistClubBadge(clubId, badgeUrl);
          return badgeUrl;
        }
        return fallbackBadge;
      })
      .catch(function () {
        return fallbackBadge;
      })
      .then(function (result) {
        delete clubBadgeRequests[clubId];
        return result;
      });
    return clubBadgeRequests[clubId];
  }

  function searchClubBadgeTerms(searchNames, club) {
    var index = 0;
    function next() {
      if (index >= searchNames.length) return Promise.resolve("");
      var searchName = searchNames[index++];
      var endpoint = "https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=" +
        encodeURIComponent(searchName);
      return fetch(endpoint)
        .then(function (response) {
          if (!response.ok) throw new Error("badge-api-" + response.status);
          return response.json();
        })
        .then(function (payload) {
          var teams = (payload && payload.teams) || [];
          var footballTeams = teams.filter(function (team) {
            return !team.strSport || team.strSport === "Soccer";
          });
          var normalizedTerms = searchNames.concat([club.name]).map(normalizeClubSearchName);
          var match = footballTeams.find(function (team) {
            return normalizedTerms.indexOf(normalizeClubSearchName(team.strTeam)) !== -1;
          });
          var badgeUrl = match && (match.strBadge || match.strTeamBadge);
          return badgeUrl || next();
        })
        .catch(function () {
          return next();
        });
    }
    return next();
  }

  function normalizeClubSearchName(name) {
    return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function getPersistentClubBadge(clubId) {
    try {
      return window.localStorage ? window.localStorage.getItem(CLUB_BADGE_CACHE_PREFIX + clubId) || "" : "";
    } catch (error) {
      return "";
    }
  }

  function persistClubBadge(clubId, badgeUrl) {
    if (!/^https?:\/\//.test(badgeUrl)) return;
    try {
      if (window.localStorage) window.localStorage.setItem(CLUB_BADGE_CACHE_PREFIX + clubId, badgeUrl);
    } catch (error) {
      // Resource caching is optional; the game remains fully playable without it.
    }
  }

  function removePersistentClubBadge(clubId) {
    try {
      if (window.localStorage) window.localStorage.removeItem(CLUB_BADGE_CACHE_PREFIX + clubId);
    } catch (error) {
      // Ignore unavailable storage.
    }
  }

  function renderCreateScreen() {
    var countriesOptions = window.COUNTRIES.map(function (country) {
      return '<option value="' + country.code + '">' + country.flag + " " + country.name + "</option>";
    }).join("");

    var positionOptions = POSITIONS.map(function (position) {
      return '<option value="' + position.value + '">' + position.label + "</option>";
    }).join("");

    app.innerHTML =
      '<section class="screen">' +
      '<div class="hero">' +
      '  <div class="brand"><span class="brand-mark">⚽</span><span>球途 Chronicle</span></div>' +
      '  <h1 class="hero-title">手机网页足球生涯模拟器</h1>' +
      '  <p class="hero-copy">从 16 岁开始，每次推进一年。做选择、踢比赛、拿奖杯，直到退役后回看整条生涯时间线。</p>' +
      '</div>' +
      '<div class="panel">' +
      '  <h2 class="section-title">创建球员</h2>' +
      '  <p class="section-copy">当前版本不保存进度，刷新或关闭网页后会重新开始。</p>' +
      '  <form id="create-form" class="form-grid">' +
      '    <label class="field"><span class="field-label">姓名</span><input name="name" maxlength="12" placeholder="例如：姚锋" value="姚锋" required></label>' +
      '    <label class="field"><span class="field-label">国籍</span><select name="countryCode">' + countriesOptions + "</select></label>" +
      '    <label class="field"><span class="field-label">位置</span><select name="position">' + positionOptions + "</select></label>" +
      '    <label class="field"><span class="field-label">惯用脚</span><select name="foot"><option value="右脚">右脚</option><option value="左脚">左脚</option></select></label>' +
      '    <label class="field"><span class="field-label">球衣号码</span><input name="number" type="number" min="1" max="99" value="34" required></label>' +
      '    <div class="actions">' +
      '      <button class="btn btn-primary" type="submit">开启生涯</button>' +
      '    </div>' +
      '  </form>' +
      '</div>' +
      '<p class="footer-note">建议单局时长 3 到 8 分钟。开局路线、青训和起步俱乐部都会随机生成，生涯会按年推进。</p>' +
      '</section>';

    document.getElementById("create-form").addEventListener("submit", onCreatePlayer);
  }

  function renderEventScreen() {
    ensureCurrentEvent();
    var player = state.player;
    var club = getClubById(player.currentClubId);
    var eventHtml = state.currentEvent.options.map(function (option, index) {
      return (
        '<button class="option-card btn btn-ghost" data-option-index="' + index + '">' +
        '  <div class="option-title">' + option.label + "</div>" +
        "</button>"
      );
    }).join("");

    app.innerHTML =
      '<section class="screen">' +
      buildHeroHeader(player, club) +
      '<div class="panel">' +
      '  <div class="topline">' +
      '    <div><div class="badge">第 ' + (state.round + 1) + ' 赛季</div><h2 class="section-title">' + state.currentEvent.title + "</h2></div>" +
      '    <div class="age-badge">' + player.age + " 岁</div>" +
      "  </div>" +
      '  <p class="event-copy">' + state.currentEvent.text + "</p>" +
      '  <div class="transfer-list">' + eventHtml + "</div>" +
      "</div>" +
      "</section>";

    Array.prototype.forEach.call(document.querySelectorAll("[data-option-index]"), function (button) {
      button.addEventListener("click", function () {
        handleEventChoice(Number(button.getAttribute("data-option-index")));
      });
    });
    hydrateClubBadges();
  }

  function renderSummaryScreen() {
    var player = state.player;
    var summary = state.latestSummary;
    var transferHtml = state.transferOptions.map(function (option, index) {
      return (
        '<button class="option-card btn btn-ghost" data-transfer-index="' + index + '">' +
        '  <div class="transfer-option-header"><div class="transfer-option-copy"><div class="option-title">' + option.label + '</div><div class="transfer-option-team"><div class="club-code-badge">' + option.club.shortName + '</div><div class="transfer-option-team-name"><strong>' + option.club.name + '</strong><span>' + option.club.league + '</span></div></div></div></div>' +
        '    <span class="impact-pill">实力 ' + option.club.strength + "</span>" +
        '    <span class="impact-pill">青训 ' + option.club.youthChance + "</span>" +
        "  </div>" +
        "</button>"
      );
    }).join("");

    app.innerHTML =
      '<section class="screen">' +
      '<div class="panel">' +
      '  <div class="timeline-header"><div><div class="badge">年度结算</div><h2 class="section-title">' + summary.age + " 岁 | " + summary.clubName + "</h2></div><div class=\"rating-badge " + getOverallClass(summary.overall) + '\">' + summary.overall + "</div></div>" +
      '  <div class="record-grid">' +
      buildMiniStat("出场", summary.appearances) +
      buildMiniStat("进球", summary.goals) +
      buildMiniStat("助攻", summary.assists) +
      buildMiniStat("球队贡献", summary.teamContribution || 0) +
      buildMiniStat("成长", signed(summary.growth)) +
      buildMiniStat("身价", formatMoney(summary.value)) +
      buildMiniStat("声望", player.status.reputation) +
      "  </div>" +
      buildSeasonBadgeRow(summary) +
      '  <p class="section-copy">关键选择：' + state.lastChoiceLabel + "</p>" +
      "</div>" +
      '<div class="panel">' +
      '  <h3 class="section-title">下一步</h3>' +
      '  <p class="section-copy">每次结算后都可以续约、去实力相近的队，或者挑战更强的俱乐部。</p>' +
      '  <div class="transfer-list">' + transferHtml + "</div>" +
      "</div>" +
      "</section>";

    Array.prototype.forEach.call(document.querySelectorAll("[data-transfer-index]"), function (button) {
      button.addEventListener("click", function () {
        handleTransferChoice(Number(button.getAttribute("data-transfer-index")));
      });
      });
  }

  function buildFallbackClubBadge(club) {
    var seed = String(club.id || "").split("").reduce(function (sum, char) {
      return sum + char.charCodeAt(0);
    }, 0);
    var hue = seed % 360;
    var label = String(club.shortName || "?").slice(0, 4).replace(/[<>&"']/g, "");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
      '<path d="M12 10h72v43c0 19-14 29-36 37C26 82 12 72 12 53z" fill="hsl(' + hue + ' 62% 40%)" stroke="white" stroke-width="5"/>' +
      '<path d="M20 20h56v30c0 14-10 22-28 29-18-7-28-15-28-29z" fill="hsl(' + ((hue + 35) % 360) + ' 70% 25%)"/>' +
      '<text x="48" y="53" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="800">' + label + '</text></svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function renderSummaryScreenV2() {
    var player = state.player;
    var summary = state.latestSummary;
    var transferHtml = state.transferOptions.map(function (option, index) {
      return (
        '<button class="option-card btn btn-ghost" data-transfer-index="' + index + '">' +
        '  <div class="transfer-option-header"><div class="transfer-option-copy"><div class="option-title">' + option.label + '</div><div class="transfer-option-team">' + buildClubBadge(option.club, "club-code-badge") + '<div class="transfer-option-team-name"><strong>' + getClubDisplayName(option.club) + '</strong><span>' + getLeagueDisplayName(option.club.league) + '</span></div></div><div class="offer-club-record"><span>' + option.clubSnapshot.league + '</span><span>' + option.clubSnapshot.cup + '</span><span>' + option.clubSnapshot.continental + '</span></div><div class="offer-meta"><span class="impact-pill">' + option.stageLabel + '</span><span class="impact-pill">' + option.roleLabel + '</span><span class="impact-pill">' + option.playtimeLabel + '</span><span class="impact-pill">' + option.salaryLabel + '</span>' + (option.feeLabel ? '<span class="impact-pill">' + option.feeLabel + '</span>' : '') + '</div></div></div>' +
        "</button>"
      );
    }).join("");

    app.innerHTML =
      '<section class="screen">' +
      '<div class="panel">' +
      '  <div class="timeline-header"><div><div class="badge">年度结算</div><h2 class="section-title">' + summary.age + " 岁 | " + summary.clubName + "</h2></div><div class=\"rating-badge " + getOverallClass(summary.overall) + '\">' + summary.overall + "</div></div>" +
      '  <div class="record-grid">' +
      buildMiniStat("出场", summary.appearances) +
      buildMiniStat("进球", summary.goals) +
      buildMiniStat("助攻", summary.assists) +
      buildMiniStat("成长", signed(summary.growth)) +
      buildMiniStat("身价", formatMoney(summary.value)) +
      buildMiniStat("声望", player.status.reputation) +
      buildMiniStat("国家队出场", summary.nationalCaps ? (summary.nationalCaps + " 场") : "未入选") +
      buildMiniStat("国家队进球", summary.nationalGoals || 0) +
      buildMiniStat("国家队助攻", summary.nationalAssists || 0) +
      "  </div>" +
      buildCompetitionBreakdown(summary) +
      (summary.leagueTable && summary.leagueTable.length
        ? '<button class="btn btn-ghost league-table-button" id="open-league-table">查看积分榜</button>'
        : "") +
      buildSeasonBadgeRow(summary) +
      (summary.transferNote ? '  <p class="section-copy">' + summary.transferNote + "</p>" : "") +
      (summary.rejectedOfferNote ? '  <p class="section-copy rejected-offer-note">' + summary.rejectedOfferNote + "</p>" : "") +
      '  <h3 class="summary-subtitle">全年总评</h3>' +
      '  <p class="section-copy season-review">' + buildAnnualReview(summary, player) + "</p>" +
      buildPositionContributionNote(summary) +
      (summary.clubDecisionNote ? '  <p class="section-copy">' + summary.clubDecisionNote + "</p>" : "") +
      '  <p class="choice-result"><strong>关键选择：</strong>' + state.lastChoiceLabel + ' · ' + state.lastChoiceOutcome + "</p>" +
      "</div>" +
      '<div class="panel">' +
      '  <h3 class="section-title">下一步</h3>' +
      '  <p class="section-copy">每次结算后，市场都会给出续约、租借邀请或正式求购，你需要决定下一站。</p>' +
      '  <div class="transfer-list">' + transferHtml + "</div>" +
      "</div>" +
      "</section>";

    Array.prototype.forEach.call(document.querySelectorAll("[data-transfer-index]"), function (button) {
      button.addEventListener("click", function () {
        handleTransferChoice(Number(button.getAttribute("data-transfer-index")));
      });
    });
    var leagueTableButton = document.getElementById("open-league-table");
    if (leagueTableButton) {
      leagueTableButton.addEventListener("click", function () {
        showLeagueTable(summary);
      });
    }
    hydrateClubBadges();
  }

  function showLeagueTable(summary) {
    var table = summary.leagueTable || [];
    if (!table.length) return;
    var existing = document.getElementById("league-table-layer");
    if (existing) existing.remove();
    var rows = table.map(function (row) {
      return '<tr class="' + (row.clubId === summary.clubId ? "is-player-club" : "") + '">' +
        "<td>" + row.position + "</td><td>" + row.clubName + "</td><td>" + row.played +
        "</td><td>" + row.wins + "</td><td>" + row.draws + "</td><td>" + row.losses +
        "</td><td>" + signed(row.goalDifference) + "</td><td><strong>" + row.points + "</strong></td></tr>";
    }).join("");
    var layer = document.createElement("div");
    layer.id = "league-table-layer";
    layer.className = "league-table-layer";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.innerHTML =
      '<div class="league-table-dialog"><div class="league-table-heading"><div><span>完整积分榜</span><h3>' +
      getLeagueDisplayName(getClubById(summary.clubId).league) +
      '</h3></div><button class="league-table-close" type="button" aria-label="关闭">×</button></div>' +
      '<div class="league-table-scroll"><table><thead><tr><th>排名</th><th>球队</th><th>场</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr></thead><tbody>' +
      rows + "</tbody></table></div></div>";
    document.body.appendChild(layer);
    function close() {
      layer.remove();
      document.removeEventListener("keydown", onKeydown);
    }
    function onKeydown(event) {
      if (event.key === "Escape") close();
    }
    layer.querySelector(".league-table-close").addEventListener("click", close);
    layer.addEventListener("click", function (event) {
      if (event.target === layer) close();
    });
    document.addEventListener("keydown", onKeydown);
  }

  function renderRetirementScreen() {
    var player = state.player;
    var clubsVisited = unique(player.career.map(function (entry) { return entry.clubName; })).length;
    var allHonors = flatten(player.career.map(function (entry) { return entry.trophies; })).concat(player.nationalTeam.honors || []);
    var honors = unique(allHonors);
    var championshipCount = allHonors.filter(isCompetitionChampionship).length;
    var topChampionshipCount = allHonors.filter(isTopLevelChampionship).length;
    var careerVerdicts = buildCareerVerdicts(player, championshipCount, topChampionshipCount);
    var honorCounts = allHonors.reduce(function (counts, name) {
      counts[name] = (counts[name] || 0) + 1;
      return counts;
    }, {});
    var lastEntry = player.career[player.career.length - 1] || {
      clubName: "未知球队",
      overall: player.overall,
      value: player.value
    };
    var careerRowsHtml = player.career.map(function (entry) {
      return (
        '<article class="career-row">' +
        '  <div class="career-age-pill">' + entry.age + "</div>" +
        '  <div class="career-club-cell"><div class="career-club-main"><div class="career-club-heading">' + buildClubBadge(getClubById(entry.clubId), "career-club-badge") + '<div><strong>' + entry.clubName + '</strong><span>' + entry.clubShortName + " · " + entry.position + "</span></div></div></div>" +
        (entry.trophies.length ? '<div class="career-row-trophies">' + entry.trophies.map(function (name) { return '<span>' + findTrophyIcon(name) + "</span>"; }).join("") + "</div>" : "") +
        "  </div>" +
        '  <div class="career-stat-badge ' + getOverallClass(entry.overall) + '">' + entry.overall + "</div>" +
        '  <div class="career-stat-cell">' + entry.appearances + "</div>" +
        '  <div class="career-stat-cell">' + entry.goals + "</div>" +
        '  <div class="career-stat-cell">' + entry.assists + "</div>" +
        "</article>" +
        (entry.seasonMoment ? '<p class="career-row-note">' + entry.seasonMoment + "</p>" : (entry.derbyNote ? '<p class="career-row-note">' + entry.derbyNote + "</p>" : ""))
      );
    }).join("");
    var nationalRowHtml =
      '<article class="career-row career-row-national">' +
      '  <div class="career-age-pill">' + player.flag + "</div>" +
      '  <div class="career-club-cell"><div class="career-club-main"><strong>' + player.country + '</strong><span>国家队生涯</span></div>' +
      ((player.nationalTeam.honors || []).length ? '<div class="career-row-trophies">' + player.nationalTeam.honors.map(function (name) { return '<span>' + findTrophyIcon(name) + "</span>"; }).join("") + "</div>" : "") +
      "  </div>" +
      '  <div class="career-stat-badge rating-silver">NT</div>' +
      '  <div class="career-stat-cell">' + player.nationalTeam.caps + "</div>" +
      '  <div class="career-stat-cell">' + player.nationalTeam.goals + "</div>" +
      '  <div class="career-stat-cell">' + player.nationalTeam.assists + "</div>" +
      "</article>";

    app.innerHTML =
      '<section class="screen">' +
      '<div class="career-finish-card">' +
      '  <div class="career-finish-ovr"><small>OVR</small><div class="career-finish-ovr-number">' + lastEntry.overall + "</div></div>" +
      '  <div class="career-finish-main">' +
      '    <div class="career-finish-topline"><div class="career-finish-tags"><span class="badge">' + player.flag + " " + player.country + '</span><span class="badge">#' + player.number + " " + player.position + '</span></div><div class="career-finish-age">AGE ' + player.retirementAge + "</div></div>" +
      '    <h1 class="career-finish-name">' + player.name + "</h1>" +
      '    <div class="career-finish-club">' + lastEntry.clubName + "</div>" +
      '    <div class="career-finish-value">VALUE ' + formatMoney(lastEntry.value) + "</div>" +
      "  </div>" +
      "</div>" +
      '<div class="career-verdict-bar">' + careerVerdicts.map(function (verdict) {
        return '<span class="career-verdict-pill' +
          (verdict.tier === "super" ? " career-verdict-super" : "") +
          (verdict.tier === "negative" ? " career-verdict-negative" : "") +
          '"><b>' + verdict.icon + '</b><span><strong>' +
          verdict.name + '</strong><small>' + verdict.description + "</small></span></span>";
      }).join("") + "</div>" +
      '<div class="career-summary-block">' +
      '  <div class="summary-grid">' +
      buildSummaryCard("总出场", player.totals.appearances) +
      buildSummaryCard("总进球", player.totals.goals) +
      buildSummaryCard("总助攻", player.totals.assists) +
      buildSummaryCard("顶级冠军", topChampionshipCount) +
      buildSummaryCard("国家队出场", player.nationalTeam.caps) +
      buildSummaryCard("效力球队", clubsVisited) +
      buildSummaryCard("生涯最高 OVR", getPeakOverall(player.career)) +
      "  </div>" +
      '  <div class="summary-card retirement-honors"><h3 class="section-title">生涯荣誉</h3><div class="honors-list">' + (honors.length ? honors.map(function (name) { return '<span class="trophy-pill retirement-trophy-pill">' + findTrophyIcon(name) + '<span>' + name + (honorCounts[name] > 1 ? " ×" + honorCounts[name] : "") + "</span></span>"; }).join("") : '<span class="muted">没有记录到奖杯</span>') + "</div></div>" +
      "</div>" +
      '<div class="career-ledger panel">' +
      '  <div class="career-ledger-head"><span>年龄</span><span>俱乐部</span><span>OVR</span><span>出场</span><span>进球</span><span>助攻</span></div>' +
      '  <div class="career-ledger-body">' + careerRowsHtml + nationalRowHtml + "</div>" +
      "</div>" +
      '<div class="actions"><button class="btn btn-primary" id="restart-game">再玩一次</button></div>' +
      "</section>";

    document.getElementById("restart-game").addEventListener("click", restartGame);
    hydrateClubBadges();
    showRetirementCelebration(player, honors, topChampionshipCount);
  }

  function buildCareerVerdicts(player, championshipCount, topChampionshipCount) {
    var clubEntries = {};
    player.career.forEach(function (entry) {
      clubEntries[entry.clubId] = clubEntries[entry.clubId] || {
        seasons: 0,
        appearances: 0,
        goals: 0,
        assists: 0,
        championships: 0
      };
      clubEntries[entry.clubId].seasons += 1;
      clubEntries[entry.clubId].appearances += entry.appearances || 0;
      clubEntries[entry.clubId].goals += entry.goals || 0;
      clubEntries[entry.clubId].assists += entry.assists || 0;
      clubEntries[entry.clubId].championships += (entry.trophies || []).filter(isCompetitionChampionship).length;
    });
    var clubIds = Object.keys(clubEntries);
    var longestStay = clubIds.reduce(function (best, clubId) {
      return !best || clubEntries[clubId].seasons > best.seasons
        ? Object.assign({ clubId: clubId }, clubEntries[clubId])
        : best;
    }, null);
    var formalTransferCount = (player.transferHistory || []).length;
    var countriesVisited = unique(clubIds.map(function (clubId) {
      var club = getClubById(clubId);
      return club && club.country;
    }).filter(Boolean));
    var shortStays = clubIds.filter(function (clubId) {
      return clubEntries[clubId].seasons <= 2;
    }).length;
    var isJourneyman =
      clubIds.length >= 9 &&
      formalTransferCount >= 8 &&
      countriesVisited.length >= 4 &&
      shortStays >= 4;
    var peakOverall = getPeakOverall(player.career);
    var verdicts = [];
    var careerTrophies = player.career.reduce(function (all, entry) {
      return all.concat(entry.trophies || []).concat(entry.nationalHonors || []);
    }, []);
    var trophyCount = function (name) {
      return careerTrophies.filter(function (trophy) { return trophy === name; }).length;
    };
    var domesticCupPattern = /足总杯冠军|国王杯冠军|德国杯冠军|意大利杯冠军|法国杯冠军|足协杯冠军|天皇杯冠军|韩国足总杯冠军|沙王冠冠军/;
    var domesticCupCount = careerTrophies.filter(function (name) {
      return domesticCupPattern.test(name);
    }).length;
    var fourthPlaceCount = player.career.filter(function (entry) {
      return entry.leagueStanding && entry.leagueStanding.position === 4;
    }).length;
    var runnerUpCount = player.career.reduce(function (sum, entry) {
      return sum + (entry.leagueStanding && entry.leagueStanding.position === 2 ? 1 : 0) +
        (entry.achievements || []).filter(function (name) { return /亚军/.test(name); }).length;
    }, 0);
    var comebackCount = player.career.filter(function (entry) {
      return /逆转|翻盘|让二追三/.test((entry.seasonMoment || "") + (entry.legendStory || "") + (entry.keyMatchStory || ""));
    }).length;
    var lateWinnerCount = player.career.filter(function (entry) {
      return /绝杀|补时/.test((entry.seasonMoment || "") + (entry.legendStory || "") + (entry.keyMatchStory || ""));
    }).length;
    var penaltyMissCount = player.career.filter(function (entry) {
      return /点球踢飞|罚失点球/.test((entry.seasonMoment || "") + (entry.keyMatchStory || ""));
    }).length;
    var injurySeasons = player.career.filter(function (entry) {
      return entry.injuries && entry.injuries.length;
    }).length;
    var ironSeasons = player.career.filter(function (entry) {
      return entry.appearances >= 40 && (!entry.injuries || !entry.injuries.length);
    }).length;
    var careerCleanSheets = player.career.reduce(function (sum, entry) {
      return sum + (entry.cleanSheets || 0);
    }, 0);
    var primaryClubShare = longestStay && player.totals.appearances
      ? longestStay.appearances / player.totals.appearances
      : 0;
    var isOneClubCareer =
      longestStay &&
      longestStay.seasons >= 10 &&
      longestStay.appearances >= 260 &&
      primaryClubShare >= 0.68 &&
      formalTransferCount <= 3;
    var careerScoringRate = player.totals.appearances
      ? player.totals.goals / player.totals.appearances
      : 0;
    var careerAssistRate = player.totals.appearances
      ? player.totals.assists / player.totals.appearances
      : 0;
    var careerContributionRate = player.totals.appearances
      ? (player.totals.goals + player.totals.assists) / player.totals.appearances
      : 0;
    var careerHonors = flatten(player.career.map(function (entry) {
      return entry.trophies || [];
    }));
    var ballonDorWins = careerHonors.filter(function (name) {
      return name === "金球奖";
    }).length;
    var championsLeagueWins = careerHonors.filter(function (name) {
      return name === "欧冠冠军";
    }).length;
    var europeanTopFlightSeasons = player.career.filter(function (entry) {
      var careerClub = getClubById(entry.clubId);
      return careerClub &&
        careerClub.region === "欧洲" &&
        careerClub.leagueLevel === 1;
    }).length;
    var injurySeasons = player.career.filter(function (entry) {
      return (entry.injuries || []).length > 0;
    }).length;
    var majorInjurySeasons = player.career.filter(function (entry) {
      return (entry.injuries || []).some(function (injury) {
        return injury.severity === "major";
      });
    }).length;
    var ballonDorNominations = player.career.filter(function (entry) {
      return entry.ballonDorNominated;
    }).length;
    var isHistoricScoringMachine =
      player.totals.appearances >= 400 &&
      careerScoringRate >= 1;

    if (isHistoricScoringMachine) {
      verdicts.push({
        icon: "✦",
        name: "历史级进球机器",
        description: "漫长生涯仍保持场均 " + careerScoringRate.toFixed(2) + " 球",
        tier: "super"
      });
    }
    if (
      player.totals.appearances >= 400 &&
      player.totals.assists >= 260 &&
      careerAssistRate >= 0.48
    ) {
      verdicts.push({
        icon: "◇",
        name: "历史级助攻艺术家",
        description: "漫长生涯场均送出 " + careerAssistRate.toFixed(2) + " 次助攻",
        tier: "super"
      });
    }
    if (player.totals.appearances >= 400 && careerContributionRate >= 1.25) {
      verdicts.push({
        icon: "⚡",
        name: "全能进攻之神",
        description: "生涯场均直接参与 " + careerContributionRate.toFixed(2) + " 球",
        tier: "super"
      });
    }
    if (ballonDorWins >= 3) {
      verdicts.push({
        icon: "◈",
        name: "金球王朝",
        description: "三次以上赢得金球奖，长期统治世界足坛",
        tier: "super"
      });
    }
    if (championsLeagueWins >= 5) {
      verdicts.push({
        icon: "♚",
        name: "欧冠之王",
        description: "至少五次登上欧洲俱乐部赛事最高领奖台",
        tier: "super"
      });
    }
    if (championshipCount >= 20) {
      verdicts.push({
        icon: "♛",
        name: "王朝缔造者",
        description: "二十座赛事冠军构成了一个完整统治时代",
        tier: "super"
      });
    }
    if (
      isOneClubCareer &&
      longestStay.seasons >= 15 &&
      longestStay.appearances >= 500
    ) {
      verdicts.push({
        icon: "◆",
        name: "永恒队魂",
        description: "十五年以上以同一俱乐部为生涯绝对主线",
        tier: "super"
      });
    }
    if (
      player.nationalTeam.caps >= 120 &&
      (
        player.nationalTeam.goals >= 70 ||
        (player.nationalTeam.honors || []).indexOf("世界杯冠军") !== -1
      )
    ) {
      verdicts.push({
        icon: "✹",
        name: "国家图腾",
        description: "国家队百场以上并留下历史级贡献",
        tier: "super"
      });
    }
    if (
      championsLeagueWins === 0 &&
      europeanTopFlightSeasons >= 8 &&
      peakOverall >= 88 &&
      (
        ballonDorWins >= 1 ||
        topChampionshipCount >= 4 ||
        championshipCount >= 8
      )
    ) {
      verdicts.push({
        icon: "♙",
        name: "欧冠终身遗憾",
        description: "耳朵去哪了",
        tier: "negative"
      });
    }
    if (majorInjurySeasons >= 3 || injurySeasons >= 6) {
      verdicts.push({
        icon: "✚",
        name: "伤病缠身",
        description: "反复伤病多次打断状态与生涯节奏",
        tier: "negative"
      });
    }
    if ((player.initialPotential || 0) >= 92 && peakOverall < 84) {
      verdicts.push({
        icon: "↓",
        name: "天才陨落",
        description: "曾被视为顶级天才，却始终未能兑现预期",
        tier: "negative"
      });
    }
    if (
      player.totals.appearances >= 450 &&
      peakOverall >= 84 &&
      topChampionshipCount === 0
    ) {
      verdicts.push({
        icon: "∅",
        name: "顶级冠军遗憾",
        description: "拥有出色能力与漫长生涯，却始终缺少最高级别冠军",
        tier: "negative"
      });
    }
    if (ballonDorNominations >= 3 && ballonDorWins === 0) {
      verdicts.push({
        icon: "◇",
        name: "金球遗珠",
        description: "多次进入金球奖候选，却始终没能最终捧杯",
        tier: "negative"
      });
    }
    if (
      formalTransferCount >= 10 &&
      (!longestStay || longestStay.seasons <= 3) &&
      championshipCount <= 2
    ) {
      verdicts.push({
        icon: "↯",
        name: "漂泊失意",
        description: "频繁辗转多支球队，却没能真正找到归属",
        tier: "negative"
      });
    }

    if (trophyCount("足总杯冠军") >= 3) {
      verdicts.push({
        icon: "☕",
        name: "保温杯收集者",
        description: "至少三次捧起足总杯，杯赛保温工作十分稳定"
      });
    }
    if (fourthPlaceCount >= 4) {
      verdicts.push({
        icon: "④",
        name: "争四狂魔",
        description: "四次以上把联赛第四名收入囊中"
      });
    }
    if (runnerUpCount >= 5) {
      verdicts.push({
        icon: "Ⅱ",
        name: "银牌收藏家",
        description: "至少五次距离冠军只差最后一步",
        tier: "negative"
      });
    }
    if (trophyCount("欧联杯冠军") >= 3) {
      verdicts.push({
        icon: "▽",
        name: "欧联批发商",
        description: "三次以上拿下欧联杯，周四夜晚格外熟悉"
      });
    }
    if (domesticCupCount >= 6) {
      verdicts.push({
        icon: "DNA",
        name: "杯赛DNA",
        description: "六座以上国内杯赛冠军证明淘汰赛血统"
      });
    }
    if (comebackCount >= 4) {
      verdicts.push({
        icon: "↻",
        name: "逆风局专家",
        description: "多次参与翻盘和逆转，落后才像真正开始"
      });
    }
    if (lateWinnerCount >= 4) {
      verdicts.push({
        icon: "90+",
        name: "绝杀说明书",
        description: "补时与绝杀反复成为生涯关键词"
      });
    }
    if (careerCleanSheets >= 180) {
      verdicts.push({
        icon: "▰",
        name: "门前卷帘门",
        description: "生涯完成至少一百八十次零封"
      });
    }
    if (ironSeasons >= 8) {
      verdicts.push({
        icon: "∞",
        name: "铁人模式",
        description: "至少八个赛季健康出场四十次以上"
      });
    }
    if (injurySeasons >= 6) {
      verdicts.push({
        icon: "✚",
        name: "玻璃属性拉满",
        description: "六个以上赛季受到伤病影响",
        tier: "negative"
      });
    }
    if (penaltyMissCount >= 2) {
      verdicts.push({
        icon: "×",
        name: "十二码恐惧症",
        description: "关键点球不止一次飞向看台",
        tier: "negative"
      });
    }

    if (isOneClubCareer) {
      verdicts.push({ icon: "◆", name: "一人一城", description: "绝大多数职业生涯都奉献给同一支俱乐部" });
    } else if (longestStay && longestStay.seasons >= 8 && longestStay.appearances >= 220) {
      verdicts.push({
        icon: "♜",
        name: "俱乐部传奇",
        description: "为同一支球队长期出场并留下深刻印记"
      });
    } else if (isJourneyman) {
      verdicts.push({ icon: "↗", name: "足坛浪子", description: "频繁转会并在多个国家留下足迹" });
    }
    if (championshipCount >= 10) {
      verdicts.push({ icon: "♛", name: "冠军收藏家", description: "职业生涯赢得至少十座赛事冠军" });
    }
    if (championshipCount >= 15) {
      verdicts.push({ icon: "♚", name: "荣誉收割机", description: "至少十五座冠军见证了漫长统治期" });
    }
    if (!isHistoricScoringMachine) {
      if (player.totals.goals >= 500) {
        verdicts.push({ icon: "⚽", name: "进球如麻", description: "俱乐部生涯攻入至少五百球" });
      } else if (player.totals.goals >= 300) {
        verdicts.push({ icon: "◎", name: "禁区杀手", description: "俱乐部生涯攻入至少三百球" });
      }
    }
    if (player.totals.assists >= 250) {
      verdicts.push({ icon: "↝", name: "助攻大师", description: "至少送出二百五十次俱乐部助攻" });
    }
    if (player.totals.appearances >= 700) {
      verdicts.push({ icon: "∞", name: "铁人传奇", description: "俱乐部正式比赛出场达到七百场" });
    }
    if (player.nationalTeam.caps >= 100) {
      verdicts.push({ icon: "旗", name: "国家队常青树", description: "为国家队出场达到一百次" });
    }
    var europeanTitles = flatten(player.career.map(function (entry) {
      return entry.trophies || [];
    })).filter(function (name) {
      return /欧冠冠军|欧联杯冠军|欧协联冠军/.test(name);
    }).length;
    if (europeanTitles >= 4) {
      verdicts.push({ icon: "♜", name: "欧战之王", description: "至少四次登上欧洲俱乐部赛事之巅" });
    }
    if ((player.nationalTeam.honors || []).indexOf("世界杯冠军") !== -1) {
      verdicts.push({ icon: "◎", name: "国家英雄", description: "帮助国家队登上世界之巅" });
    }
    if (peakOverall >= 95) {
      verdicts.push({ icon: "★", name: "时代巨星", description: "巅峰能力进入历史级别" });
    } else if (peakOverall >= 90) {
      verdicts.push({ icon: "✦", name: "世界级球星", description: "巅峰时期跻身世界顶尖行列" });
    }
    if (player.everCaptain) {
      verdicts.push({ icon: "C", name: "领袖袖标", description: "曾以队长身份承担球队责任" });
    }
    if (!verdicts.length) {
      if (peakOverall < 60) {
        verdicts.push({
          icon: "↓",
          name: "职业联赛边缘人",
          description: "实力始终没有达到稳定立足职业联赛的标准",
          tier: "negative"
        });
      } else if (peakOverall < 70) {
        verdicts.push({
          icon: "·",
          name: "实力平平",
          description: "拥有过职业比赛经历，但整体表现和上限都较为有限",
          tier: "negative"
        });
      } else if (peakOverall < 82) {
        verdicts.push({
          icon: "●",
          name: "中规中矩",
          description: "完成了一段稳定但并不耀眼的职业生涯"
        });
      } else {
        verdicts.push({
          icon: "●",
          name: "职业典范",
          description: "长期保持可靠表现，完整走过了一段值得回望的职业生涯"
        });
      }
    }
    return verdicts.slice(0, 9);
  }

  function showRetirementCelebration(player, honors, championshipCount) {
    if (player.retirementEffectShown || !app || typeof app.insertAdjacentHTML !== "function") return;
    player.retirementEffectShown = true;
    var peakOverall = getPeakOverall(player.career);
    var featuredHonor = honors.find(function (name) {
      return /世界杯冠军|欧冠冠军|金球奖|世界俱乐部冠军/.test(name);
    }) || honors[0] || "职业生涯完整落幕";
    var forcedByMarket = Boolean(player.forcedRetirementReason);
    var retirementTitle = forcedByMarket ? "无人问津" : "传奇谢幕";
    var retirementSummary = forcedByMarket
      ? player.forcedRetirementReason
      : "最高 OVR " + peakOverall + " · " + championshipCount + " 座冠军 · " + featuredHonor;
    var retirementCardClass = forcedByMarket
      ? "result-fx-card result-fx-failure retirement-fx-card"
      : "result-fx-card result-fx-achievement result-fx-legend retirement-fx-card";
    var retirementIcon = forcedByMarket
      ? '<div class="result-fx-down"><i>↓</i><i>×</i><i>↓</i></div>'
      : '<div class="achievement-fx-star">★<b></b><b></b><b></b></div>';
    app.insertAdjacentHTML(
      "beforeend",
      '<div class="season-result-fx result-fx-persistent retirement-result-fx" id="retirement-result-fx" role="button" tabindex="0" aria-label="关闭生涯谢幕">' +
      '  <div class="season-result-fx-stack">' +
      '    <div class="' + retirementCardClass + '">' +
      retirementIcon +
      '      <strong>' + retirementTitle + '</strong><span>' + retirementSummary + "</span>" +
      "    </div>" +
      '    <p class="result-fx-dismiss">点击任意位置查看完整生涯</p>' +
      "  </div>" +
      "</div>"
    );
    var layer = document.getElementById("retirement-result-fx");
    if (!layer) return;
    var dismissed = false;
    function dismissRetirementCelebration() {
      if (dismissed) return;
      dismissed = true;
      layer.classList.add("result-fx-leaving");
      setTimeout(function () {
        if (layer && typeof layer.remove === "function") layer.remove();
      }, 300);
    }
    layer.addEventListener("click", dismissRetirementCelebration);
    layer.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault();
        dismissRetirementCelebration();
      }
    });
    layer.focus();
  }

  function onCreatePlayer(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var country = getCountryByCode(formData.get("countryCode"));
    var position = formData.get("position");
    var startLeague = pickOne(STARTING_LEAGUES);
    var clubs = getStartingClubs(startLeague.key);
    var shuffledClubs = clubs.slice().sort(function () {
      return Math.random() - 0.5;
    });
    var startingClub = pickOne(shuffledClubs.slice(0, Math.min(10, shuffledClubs.length)));
    var academyClub = pickAcademyClub(clubs, startingClub);
    var playerOrigin = pickOne(PLAYER_ORIGINS);
    var baseOverall = 49 + randomInt(0, 8);
    var player = {
      name: String(formData.get("name") || "新秀").trim(),
      country: country.name,
      countryCode: country.code,
      flag: country.flag,
      number: Number(formData.get("number") || 34),
      position: position,
      dominantFoot: formData.get("foot"),
      age: 16,
      seasonYear: 2026,
      retirementAge: 38,
      startPath: startLeague.label,
      overall: baseOverall,
      potential: generateInitialPotential(baseOverall, academyClub, playerOrigin),
      initialPotential: 0,
      peakPotential: 0,
      potentialHistory: [],
      eventHistory: [],
      eventLastSeenSeason: {},
      developmentMomentum: 0,
      value: 0,
      origin: playerOrigin,
      profile: generatePlayerProfile(position, formData.get("foot"), baseOverall),
      academy: getClubDisplayName(academyClub),
      academyClubId: academyClub.id,
      currentClubId: startingClub.id,
      currentClubStartAge: 16,
      contractUntilAge: randomInt(19, 21),
      parentClubId: null,
      loanReturnAge: null,
      lastTransfer: null,
      transferHistory: [],
      homecomingUsed: false,
      isCaptain: false,
      everCaptain: false,
      captainSinceAge: null,
      clubIdentityEventsSeen: [],
      lateCareerCoronationSeen: false,
      roleTransitionAttempts: 0,
      roleTransitionCompleted: false,
      careerCurveBonus: 0,
      loyaltyMilestonesSeen: [],
      pendingSeasonInjury: null,
      status: {
        fitness: randomInt(82, 94),
        happiness: randomInt(68, 82),
        reputation: randomInt(8, 16),
        coachRelation: randomInt(44, 58),
        transferInterest: 0
      },
      currentSalary: 0,
      totals: {
        appearances: 0,
        goals: 0,
        assists: 0,
        trophies: 0
      },
      nationalTeam: {
        caps: 0,
        goals: 0,
        assists: 0,
        honors: []
      },
      career: []
    };

    player.initialPotential = player.potential;
    player.peakPotential = player.potential;
    player.value = calculateMarketValue(player, startingClub, null);
    player.currentSalary = calculateSalaryValue(player, startingClub, "renewal");

    state.player = player;
    state.screen = "event";
    state.round = 0;
    state.latestSummary = null;
    state.transferOptions = [];
    state.currentEvent = null;
    state.gameOver = false;
    state.clubForms = {};
    state.clubEconomics = {};
    state.lastChoiceOutcome = "";
    state.lastChoiceResultType = "neutral";
    render();
  }

  function handleEventChoice(optionIndex) {
    var event = state.currentEvent;
    var option = event.options[optionIndex];
    var dynamicResolution = resolveEventChoice(state.player, event, option);
    if (event.id === "career-role-transition") {
      state.player.roleTransitionAttempts = (state.player.roleTransitionAttempts || 0) + 1;
    }
    state.player.eventHistory = state.player.eventHistory || [];
    state.player.eventHistory.push(event.id);
    state.player.eventHistory = state.player.eventHistory.slice(-5);
    state.player.eventLastSeenSeason = state.player.eventLastSeenSeason || {};
    state.player.eventLastSeenSeason[event.id] = state.player.seasonYear;
    state.player.pendingSeasonInjury = buildInjuryRecord(event, option, dynamicResolution);
    if (dynamicResolution.competitionOutcome) {
      state.player.pendingCompetitionOutcome = dynamicResolution.competitionOutcome;
    }
    if (dynamicResolution.majorMatchStory) {
      state.player.pendingMajorMatchStory = dynamicResolution.majorMatchStory;
    }
    if (dynamicResolution.competitionImpact) {
      state.player.pendingSeasonCompetitionImpact = dynamicResolution.competitionImpact;
    }
    if (event.id.indexOf("derby-prep-") === 0) {
      state.player.pendingDerbyId = event.id.replace("derby-prep-", "");
      var derbyPrepOutcome = classifyChoiceEffect(
        dynamicResolution.note,
        dynamicResolution.effects,
        dynamicResolution
      );
      if (derbyPrepOutcome === "failure") {
        state.player.pendingDerbyResolution = {
          outcome: "failure",
          source: "derby-prep"
        };
      }
    }
    if (event.id === "rival-transfer-backlash" && option.label === "用德比表现回应") {
      state.player.pendingDerbyId = state.player.lastTransfer && state.player.lastTransfer.rivalryId || "";
      state.player.pendingDerbyResolution = {
        outcome: classifyChoiceEffect(
          dynamicResolution.note,
          dynamicResolution.effects,
          dynamicResolution
        ),
        source: "rival-transfer",
        note: dynamicResolution.note
      };
    }
    if (event.id === "club-loyalty-milestone") {
      state.player.loyaltyMilestonesSeen = state.player.loyaltyMilestonesSeen || [];
      state.player.loyaltyMilestonesSeen.push(event.loyaltyMilestone);
      state.player.loyaltyMilestonesSeen = unique(state.player.loyaltyMilestonesSeen);
    }
    if (event.id === "captain-appointment" && option.label === "正式接过队长袖标") {
      state.player.isCaptain = true;
      state.player.everCaptain = true;
      state.player.captainSinceAge = state.player.age;
      dynamicResolution.note = "你正式成为球队队长。从现在开始，关键比赛和更衣室事件会把你视为第一责任人。";
    }
    if (event.id === "captain-crisis") {
      dynamicResolution.effects.reputation += option.label === "公开保护队友" ? 1 : 0;
      dynamicResolution.note = "队长身份让你的选择影响了整个更衣室，后续比赛会检验这次处理是否有效。";
    }
    if (event.id.indexOf("captain-scrutiny-") === 0) {
      state.player.lastCaptainScrutinySeason = state.player.seasonYear;
    }
    if (event.id.indexOf("club-identity-") === 0) {
      state.player.clubIdentityEventsSeen = state.player.clubIdentityEventsSeen || [];
      state.player.clubIdentityEventsSeen.push(event.id.replace("club-identity-", ""));
      state.player.clubIdentityEventsSeen = unique(state.player.clubIdentityEventsSeen);
      dynamicResolution.note = "你的决定回应了这家俱乐部长期形成的比赛传统，也提高了关键阶段对你的要求。";
    }
    if (event.id === "late-career-coronation") {
      state.player.lateCareerCoronationSeen = true;
    }
    if (event.id.indexOf("national-tournament-") === 0) {
      var nationalProfile = getEffectivePlayerProfile(state.player);
      var nationalPlanBonus;
      if (option.label === "承担国家队核心职责") {
        nationalPlanBonus = averageSkills([
          nationalProfile.dribbling,
          nationalProfile.passing,
          nationalProfile.finishing
        ]) >= 76 ? 5 : -3;
      } else if (option.label === "服从国家队整体战术") {
        nationalPlanBonus = averageSkills([
          nationalProfile.workRate,
          nationalProfile.offBall,
          nationalProfile.defending
        ]) >= 70 ? 4 : 0;
      } else {
        nationalPlanBonus = averageSkills([
          nationalProfile.pace,
          nationalProfile.offBall,
          nationalProfile.finishing
        ]) >= 72 ? 4 : -1;
      }
      state.player.pendingNationalTournamentPlan = {
        competitionName: event.competitionName,
        label: option.label,
        bonus: nationalPlanBonus
      };
      dynamicResolution.note = nationalPlanBonus > 0
        ? "国家队教练组接受了你的方案，这套职责与你的能力特点较为匹配。"
        : nationalPlanBonus < 0
          ? "国家队采用了你的方案，但你的能力特点暂时无法完全支撑这项职责。"
          : "国家队保留了你的方案，最终效果将由赛事表现决定。";
    }
    if (
      option.label === "寻求离队" ||
      option.label === "寻求更高舞台" ||
      option.label === "要求转会" ||
      option.label === "听取其他球队机会"
    ) {
      state.player.pendingForcedDeparture = true;
      state.player.pendingAmbitiousDeparture = option.label === "寻求更高舞台";
    }
    applyEffects(state.player, dynamicResolution.effects);
    if (dynamicResolution.positionChange) {
      applyCareerRoleTransition(
        state.player,
        dynamicResolution.positionChange,
        dynamicResolution.transitionType
      );
    }
    state.lastChoiceLabel = option.label;
    state.lastChoiceResultType = dynamicResolution.resultType || "neutral";
    var summary = simulatePhase(state.player);
    state.lastChoiceOutcome = buildChoiceOutcome(event, option, summary, dynamicResolution.note);
    if (shouldForceMarketRetirement(state.player)) {
      state.player.retirementAge = state.player.age;
      state.player.forcedRetirementReason = "年龄和竞技水平已经无法满足职业联赛要求，转会市场没有俱乐部愿意提供新合同。";
      state.latestSummary = summary;
      state.transferOptions = [];
      state.currentEvent = null;
      state.screen = "retirement";
      state.gameOver = true;
      render();
      return;
    }
    state.latestSummary = summary;
    state.transferOptions = generateTransferOptions(state.player, summary);
    state.currentEvent = null;
    state.screen = "summary";
    render();
    showSeasonResultEffects(summary, dynamicResolution);
  }

  function shouldForceMarketRetirement(player) {
    return player.age >= 27 && player.overall < 58;
  }

  function showSeasonResultEffects(summary, dynamicResolution) {
    if (!app || typeof app.insertAdjacentHTML !== "function") return;

    var honors = (summary.trophies || []).concat(summary.nationalHonors || []).slice(0, 2);
    var story = [
      summary.seasonMoment,
      summary.legendStory,
      summary.specialSeasonStory,
      summary.derbyNote,
      state.lastChoiceOutcome
    ].filter(Boolean).join(" ");
    var hasGoalSpectacle = /帽子戏法|梅开二度|大四喜|独中五元|五球|主宰.{0,8}(比赛|决赛|德比)|绝杀|连[进入].{0,3}[三四五]球/.test(story);
    var hasRivalSabotage = /死敌退出冠军争夺|狙击死敌夺冠|让死敌退出争冠|粉碎.{0,8}争冠希望/.test(story);
    var hasRelegation = (summary.achievements || []).indexOf("联赛降级") !== -1;
    var failureText = (dynamicResolution && dynamicResolution.note || "") + " " + state.lastChoiceOutcome;
    var effects = dynamicResolution && dynamicResolution.effects || {};
    var choiceResult = classifyChoiceEffect(failureText, effects, dynamicResolution);
    var choiceFailed = choiceResult === "failure";
    var choiceSucceeded = choiceResult === "success";
    var choiceMixed = choiceResult === "mixed";
    var majorAchievement = (summary.achievements || []).find(function (name) {
      return /三冠王|世界冠军|世界俱乐部冠军|世界最佳球员|纪录|传奇/.test(name);
    });
    var hasLegendMoment = Boolean(summary.legendStory || majorAchievement === "传奇时刻");
    var hasBallonDorControversy = Boolean(summary.ballonDorControversy);
    var hasRefereeScandal = Boolean(summary.refereeScandal);
    var dynastyMoments = summary.dynastyMoments || [];
    var hasDynastyMoment = dynastyMoments.length > 0;
    var injury = summary.injuries && summary.injuries[0];
    var majorGrowth = summary.growth >= 3;
    var reputationSurge = summary.reputationChange >= 6;
    var neutralPerformance = !choiceFailed && !choiceSucceeded &&
      /表现平平|中规中矩|没有完全接管|有限时间|有限的场上任务/.test(story);

    if (
      !honors.length &&
      !hasGoalSpectacle &&
      !hasRivalSabotage &&
      !hasRelegation &&
      !choiceFailed &&
      !choiceSucceeded &&
      !choiceMixed &&
      !majorAchievement &&
      !hasBallonDorControversy &&
      !hasRefereeScandal &&
      !hasDynastyMoment &&
      !injury &&
      !majorGrowth &&
      !reputationSurge &&
      !neutralPerformance
    ) return;

    var cards = honors.map(function (name, index) {
      var isChampionship = name.indexOf("冠军") !== -1;
      return (
        '<div class="result-fx-card ' + (isChampionship ? "result-fx-trophy" : "result-fx-award") + '" style="--fx-order:' + index + '">' +
        '  <div class="result-fx-icon">' + findTrophyIcon(name) + "</div>" +
        '  <strong>' + (isChampionship ? "夺冠" : "个人荣誉") + '</strong><span>' + name + "</span>" +
        "</div>"
      );
    });

    if (hasRivalSabotage) {
      cards.unshift(
        '<div class="result-fx-card result-fx-devil" style="--fx-order:0">' +
        '  <div class="devil-fx-icon"><span>😈</span><i>✦</i><i>✦</i><i>✦</i></div>' +
        '  <strong>狙击死敌</strong><span>你亲手粉碎了对手的争冠希望</span>' +
        "</div>"
      );
    }

    if (hasBallonDorControversy) {
      cards.unshift(
        '<div class="result-fx-card result-fx-failure result-fx-ballon-controversy" style="--fx-order:0">' +
        '  <div class="result-fx-down"><i>!</i><i>!</i><i>!</i></div>' +
        '  <strong>金球争议</strong><span>' + summary.ballonDorControversy + "</span>" +
        "</div>"
      );
    }

    if (hasRefereeScandal) {
      cards.unshift(
        '<div class="result-fx-card result-fx-failure" style="--fx-order:0">' +
        '  <div class="result-fx-down"><i>!</i><i>VAR</i><i>!</i></div>' +
        '  <strong>判罚惨案</strong><span>' + summary.refereeScandal + "</span>" +
        "</div>"
      );
    }

    dynastyMoments.forEach(function (moment) {
      cards.unshift(
        '<div class="result-fx-card result-fx-achievement result-fx-legend result-fx-dynasty" style="--fx-order:0">' +
        '  <div class="achievement-fx-star">' + moment.icon + '<b></b><b></b><b></b></div>' +
        '  <strong>' + moment.name + '</strong><span>' + moment.text + "</span>" +
        "</div>"
      );
    });

    if (hasRelegation) {
      cards.unshift(
        '<div class="result-fx-card result-fx-failure result-fx-relegation" style="--fx-order:0">' +
        '  <div class="result-fx-down"><i>↓</i><i>↓</i><i>↓</i></div>' +
        '  <strong>联赛降级</strong><span>球队跌入次级联赛，赛季以重大挫折告终</span>' +
        "</div>"
      );
    }

    if (hasGoalSpectacle) {
      cards.push(
        '<div class="result-fx-card result-fx-goal" style="--fx-order:' + cards.length + '">' +
        '  <div class="goal-fx-scene"><div class="goal-fx-net"></div><div class="goal-fx-ball">⚽</div></div>' +
        '  <strong>关键表现</strong><span>' + getGoalEffectLabel(story) + "</span>" +
        "</div>"
      );
    }

    if (choiceFailed) {
      cards.push(
        '<div class="result-fx-card result-fx-failure" style="--fx-order:' + cards.length + '">' +
        '  <div class="result-fx-down"><i>↓</i><i>↓</i><i>↓</i></div>' +
        '  <strong>选择受挫</strong><span>这次决定付出了代价</span>' +
        "</div>"
      );
    } else if (choiceSucceeded) {
      cards.push(
        '<div class="result-fx-card result-fx-success" style="--fx-order:' + cards.length + '">' +
        '  <div class="result-fx-up"><i>↑</i><i>↑</i><i>↑</i></div>' +
        '  <strong>选择成功</strong><span>你的决定收到了积极回报</span>' +
        "</div>"
      );
    } else if (choiceMixed) {
      cards.push(
        '<div class="result-fx-card result-fx-neutral" style="--fx-order:' + cards.length + '">' +
        '  <div class="neutral-fx-mark">±</div>' +
        '  <strong>有得有失</strong><span>决定带来回报，也让你付出了代价</span>' +
        "</div>"
      );
    } else if (neutralPerformance) {
      cards.push(
        '<div class="result-fx-card result-fx-neutral" style="--fx-order:' + cards.length + '">' +
        '  <div class="neutral-fx-mark">≈</div>' +
        '  <strong>表现平平</strong><span>完成任务，但没有左右比赛</span>' +
        "</div>"
      );
    }

    if (majorAchievement) {
      cards.push(
        '<div class="result-fx-card result-fx-achievement' + (hasLegendMoment ? " result-fx-legend" : "") +
        '" style="--fx-order:' + cards.length + '">' +
        '  <div class="achievement-fx-star">★<b></b><b></b><b></b></div>' +
        '  <strong>' + (hasLegendMoment ? "传奇时刻" : "伟大成就") + '</strong><span>' +
        (hasLegendMoment && summary.legendStory ? summary.legendStory : majorAchievement) + "</span>" +
        "</div>"
      );
    } else if (injury) {
      cards.push(
        '<div class="result-fx-card result-fx-injury" style="--fx-order:' + cards.length + '">' +
        '  <div class="injury-fx-cross">✚</div>' +
        '  <strong>伤病警报</strong><span>' + injury.label + "</span>" +
        "</div>"
      );
    } else if (majorGrowth) {
      cards.push(
        '<div class="result-fx-card result-fx-growth" style="--fx-order:' + cards.length + '">' +
        '  <div class="growth-fx-bars"><i></i><i></i><i></i><i></i></div>' +
        '  <strong>能力突破</strong><span>本赛季 OVR +' + summary.growth + "</span>" +
        "</div>"
      );
    } else if (reputationSurge) {
      cards.push(
        '<div class="result-fx-card result-fx-spotlight" style="--fx-order:' + cards.length + '">' +
        '  <div class="spotlight-fx-icon">✦</div>' +
        '  <strong>声名鹊起</strong><span>外界关注度快速上升</span>' +
        "</div>"
      );
    }

    if (hasLegendMoment && cards.length > 4) {
      var legendCard = cards.pop();
      cards = cards.slice(0, 3).concat(legendCard);
    } else {
      cards = cards.slice(0, 4);
    }

    var requiresDismiss = hasRivalSabotage || hasLegendMoment || hasRelegation ||
      hasBallonDorControversy || hasRefereeScandal || hasDynastyMoment;
    var dismissLabel = hasDynastyMoment
      ? "关闭王朝时刻提示"
      : hasBallonDorControversy
      ? "关闭金球争议提示"
      : hasRefereeScandal
      ? "关闭判罚争议提示"
      : hasRelegation
      ? "关闭联赛降级提示"
      : hasLegendMoment ? "关闭传奇时刻提示" : "关闭狙击死敌提示";

    app.insertAdjacentHTML(
      "beforeend",
      '<div class="season-result-fx' + (requiresDismiss ? " result-fx-persistent" : "") +
      '" id="season-result-fx"' + (requiresDismiss
        ? ' role="button" tabindex="0" aria-label="' + dismissLabel + '"'
        : ' aria-hidden="true"') + ">" +
      '<div class="season-result-fx-stack">' + cards.join("") +
      (requiresDismiss ? '<p class="result-fx-dismiss">点击任意位置继续</p>' : "") +
      "</div></div>"
    );

    if (requiresDismiss) {
      var persistentLayer = document.getElementById("season-result-fx");
      if (!persistentLayer) return;
      var persistentDismissed = false;
      function dismissPersistentResult() {
        if (persistentDismissed) return;
        persistentDismissed = true;
        persistentLayer.classList.add("result-fx-leaving");
        setTimeout(function () {
          if (persistentLayer && typeof persistentLayer.remove === "function") persistentLayer.remove();
        }, 300);
      }
      persistentLayer.addEventListener("click", dismissPersistentResult);
      persistentLayer.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
          event.preventDefault();
          dismissPersistentResult();
        }
      });
      persistentLayer.focus();
      return;
    }

    var displayedTextLength = honors.join("").length +
      (hasGoalSpectacle ? getGoalEffectLabel(story).length : 0) +
      (majorAchievement || "").length +
      (injury ? injury.label.length : 0);
    var visibleDuration = 620 + cards.length * 90 + Math.min(360, displayedTextLength * 7);
    setTimeout(function () {
      var layer = document.getElementById("season-result-fx");
      if (layer && layer.classList) layer.classList.add("result-fx-leaving");
    }, visibleDuration);
    setTimeout(function () {
      var layer = document.getElementById("season-result-fx");
      if (layer && typeof layer.remove === "function") layer.remove();
    }, visibleDuration + 300);
  }

  function classifyChoiceEffect(text, effects, dynamicResolution) {
    var resultText = text || "";
    if (
      dynamicResolution &&
      /^(success|failure|mixed|neutral)$/.test(dynamicResolution.resultType || "")
    ) {
      return dynamicResolution.resultType;
    }
    var explicitFailure =
      /没有成功|未能|没能|没有换来|没有奏效|不敌|被淘汰|落败|失败|失误|不适应|受挫|伤情反复|伤势反复|失去首发|失去位置|状态下滑|影响力.{0,4}(下降|受限)|声望.{0,6}(下降|下滑|受损)|遭遇重创|受到打击|舆论反噬|舆论.{0,6}(争议|质疑|施压|发酵)|代价.{0,8}(更大|过大|明显|超出)|恢复.{0,6}(打乱|受影响)|逼得太紧|心理包袱|更加尖锐|更不满意|更不耐烦|表现没有完全接住|没交出足够|没有完全跟上|卷进.{0,10}(情绪|矛盾)|消耗得不轻|受到.{0,6}消耗|关系.{0,6}(恶化|裂痕)|更衣室.{0,8}(矛盾|裂痕|怀疑)|引发.{0,8}(矛盾|不满|质疑)|公开质疑|长期休战|明显透支|没有完全接受|不完全买账|没有真正消失|没有完全兑现|无法完全支撑|很吃力|显得有些自私|观感变差/.test(resultText);
    var explicitSuccess =
      /取得成功|决定.{0,6}奏效|赢得.{0,10}冠军|帮助球队晋级|成功|顶住|认可|满意|回应|适应效果很好|提升|稳住|兑现|接纳|得到控制|获得耐心|压住了伤病|避免了当众崩盘|赢得.{0,8}(支持|信任)|更加团结|评价迅速转好|取得正面效果|顺利/.test(resultText);

    if (dynamicResolution && dynamicResolution.competitionOutcome) {
      if (!dynamicResolution.competitionOutcome.won) {
        return "failure";
      }
      return explicitFailure ? "mixed" : "success";
    }
    if (explicitFailure && explicitSuccess) {
      return "mixed";
    }

    var weights = {
      overall: 3,
      reputation: 1,
      coachRelation: 1,
      happiness: 0.7,
      fitness: 0.45,
      transferInterest: 0.25
    };
    var netEffect = Object.keys(weights).reduce(function (sum, key) {
      return sum + (effects[key] || 0) * weights[key];
    }, 0);

    if (explicitFailure) {
      return "failure";
    }
    if (explicitSuccess && netEffect >= -1) {
      return "success";
    }
    if (netEffect <= -3) {
      return "failure";
    }
    if (netEffect >= 3) {
      return "success";
    }
    return "neutral";
  }

  function getGoalEffectLabel(story) {
    if (/九分钟.{0,4}五球|短短.{0,8}五球/.test(story)) return "超神五球";
    if (story.indexOf("独中五元") !== -1) return "独中五元";
    if (story.indexOf("大四喜") !== -1) return "大四喜";
    if (story.indexOf("帽子戏法") !== -1) return "帽子戏法";
    if (story.indexOf("梅开二度") !== -1) return "梅开二度";
    if (story.indexOf("绝杀") !== -1) return "关键绝杀";
    return "主宰比赛";
  }

  function buildInjuryRecord(event, option, dynamicResolution) {
    var injuryIds = ["minor-injury", "unexpected-injury", "unexpected-major-injury"];
    if (injuryIds.indexOf(event.id) === -1) {
      return null;
    }

    var note = dynamicResolution.note || "";
    if (note.indexOf("反复") !== -1) {
      return { label: "伤病复发", severity: "major", availabilityFactor: 0.46, maxAppearances: 18, detail: note };
    }
    if (event.id === "unexpected-major-injury") {
      return {
        label: option.label === "缩短恢复期提前复出" ? "重伤后冒险复出" : "严重伤病",
        severity: "major",
        availabilityFactor: option.label === "缩短恢复期提前复出" ? 0.62 : 0.48,
        maxAppearances: option.label === "缩短恢复期提前复出" ? 22 : 19,
        detail: note || "严重伤情影响了这一年的出场和竞技状态。"
      };
    }
    var playedThrough = option.label === "咬牙坚持" || option.label === "缩短恢复期提前复出";
    var fullRecovery = option.label === "完整接受康复治疗";
    return {
      label: playedThrough ? "带伤比赛" : "伤病休战",
      severity: "minor",
      availabilityFactor: playedThrough ? 0.84 : fullRecovery ? 0.68 : 0.74,
      maxAppearances: playedThrough ? 30 : fullRecovery ? 24 : 27,
      detail: note || "伤病影响了这一年的训练和比赛安排。"
    };
  }

  function handleTransferChoice(optionIndex) {
    var option = state.transferOptions[optionIndex];
    if (option.type === "retire") {
      state.player.retirementAge = state.player.age;
      state.player.status.happiness = clamp(state.player.status.happiness + 4, 20, 100);
      state.transferOptions = [];
      state.latestSummary = null;
      state.screen = "retirement";
      state.gameOver = true;
      render();
      return;
    }
    var previousClub = getClubById(state.player.currentClubId);
    var transferCollapse = getTransferCollapse(state.player, previousClub, option);
    if (transferCollapse) {
      state.player.status.happiness = clamp(state.player.status.happiness - 4, 20, 100);
      state.player.status.reputation = applyReputationChange(state.player, previousClub, -1);
      state.player.blockedTransferClubIds = state.player.blockedTransferClubIds || [];
      state.player.blockedTransferClubIds.push(option.club.id);
      state.player.blockedTransferClubIds = unique(state.player.blockedTransferClubIds);
      state.transferOptions.splice(optionIndex, 1);
      if (state.latestSummary) {
        state.latestSummary.transferNote = transferCollapse.note + " 你可以继续考虑其他报价。";
      }
      if (!state.transferOptions.length && state.latestSummary) {
        state.transferOptions = generateTransferOptions(state.player, state.latestSummary);
      }
      state.screen = "summary";
      state.gameOver = false;
      render();
      showTransferCollapseEffect(option.club, transferCollapse);
      return;
    }

    if (option.type === "loan") {
      state.player.parentClubId = state.player.currentClubId;
      state.player.loanReturnAge = state.player.age + 1;
    } else if (option.type === "return") {
      state.player.parentClubId = null;
      state.player.loanReturnAge = null;
    } else if (option.type !== "renewal" && option.type !== "forced-stay") {
      state.player.parentClubId = null;
      state.player.loanReturnAge = null;
    }

    if (option.type === "formal" || option.type === "transfer" || option.type === "homecoming") {
      state.player.lastTransfer = {
        fromClubId: previousClub.id,
        toClubId: option.club.id,
        fee: option.transferFee,
        valueAtTransfer: state.player.value,
        age: state.player.age,
        seasonYear: state.player.seasonYear + 1,
        pressureEventSeen: false,
        rivalryEventSeen: false,
        rivalryId: option.rivalryId || (getDerbyBetweenClubs(previousClub.id, option.club.id) || {}).id || ""
      };
      state.player.transferHistory.push(state.player.lastTransfer);
      state.player.currentClubStartAge = state.player.age + 1;
      state.player.contractUntilAge = state.player.age +
        (state.player.age >= 33 ? randomInt(2, 3) : randomInt(4, 5));
      if (option.type === "homecoming") {
        state.player.homecomingUsed = true;
      }
      state.player.isCaptain = false;
      state.player.captainSinceAge = null;
    } else if (option.type === "return") {
      state.player.currentClubStartAge = state.player.age + 1;
    } else if (option.type === "renewal") {
      state.player.contractUntilAge = state.player.age +
        (state.player.age >= 34 ? randomInt(1, 2) : randomInt(3, 5));
    }

    if (option.club.id === previousClub.id && state.latestSummary) {
      applyPlayerClubLeagueTransition(state.player, previousClub, state.latestSummary);
    } else if (option.club.id !== previousClub.id) {
      state.player.nextContinentalCompetition = getIncomingClubEuropeanCompetition(option.club);
    }
    state.player.currentClubId = option.club.id;
    state.player.pendingForcedDeparture = false;
    state.player.pendingAmbitiousDeparture = false;
    state.player.blockedTransferClubIds = [];
    state.player.currentSalary = option.salaryValue || state.player.currentSalary;
    state.player.status.coachRelation = option.club.id !== previousClub.id
      ? clamp(52 + option.coachDelta + Math.round((state.player.status.reputation - 50) * 0.08), 32, 76)
      : clamp(state.player.status.coachRelation + option.coachDelta, 15, 95);
    state.player.status.happiness = clamp(state.player.status.happiness + option.happinessDelta, 20, 100);
    state.player.age += 1;
    state.player.seasonYear += 1;
    state.round += 1;
    state.transferOptions = [];
    state.latestSummary = null;

    if (state.player.age > state.player.retirementAge) {
      state.player.age = state.player.retirementAge;
      state.screen = "retirement";
      state.gameOver = true;
    } else {
      state.screen = "event";
    }

    render();
  }

  function getIncomingClubEuropeanCompetition(club) {
    if (!club || club.region !== "欧洲" || club.leagueLevel !== 1) return "";
    var strength = getClubStrength(club);
    var standing = simulateLeagueStanding(club, strength, strength + randomInt(-6, 6));
    if (standing.status === "欧冠区" || standing.status === "欧冠资格赛区") return "欧冠";
    if (standing.status === "欧联区") return "欧联杯";
    if (standing.status === "欧协联区") return "欧协联";
    return "";
  }

  function applyPlayerClubLeagueTransition(player, club, summary) {
    var standing = summary.leagueStanding;
    if (!standing) return;
    var nextLeague = "";
    var transitionType = "";
    if (club.leagueLevel >= 2 && standing.position <= 2 && PROMOTION_LEAGUE_MAP[club.league]) {
      nextLeague = PROMOTION_LEAGUE_MAP[club.league];
      transitionType = "promotion";
    } else if (club.leagueLevel <= 2 && standing.status === "降级区" && RELEGATION_LEAGUE_MAP[club.league]) {
      nextLeague = RELEGATION_LEAGUE_MAP[club.league];
      transitionType = "relegation";
    }
    if (!nextLeague) {
      var continentalQualification = getContinentalQualificationFromSeason(club, summary);
      if (continentalQualification) {
        var previousContinentalCompetition = summary.competitionStats &&
          summary.competitionStats.continentalName || "";
        player.nextContinentalCompetition = continentalQualification;
        player.pendingSeasonTransition = previousContinentalCompetition !== continentalQualification
          ? {
              type: "european-qualification",
              clubId: club.id,
              competition: continentalQualification,
              previousCompetition: previousContinentalCompetition
            }
          : null;
      } else {
        player.nextContinentalCompetition = "";
        player.pendingSeasonTransition = null;
      }
      return;
    }

    state.clubLeagueOrigins = state.clubLeagueOrigins || {};
    if (!state.clubLeagueOrigins[club.id]) {
      state.clubLeagueOrigins[club.id] = {
        league: club.league,
        leagueLevel: club.leagueLevel
      };
    }
    var previousLeague = club.league;
    club.league = nextLeague;
    club.leagueLevel = clamp(
      club.leagueLevel + (transitionType === "promotion" ? -1 : 1),
      1,
      3
    );
    player.pendingSeasonTransition = {
      type: transitionType,
      clubId: club.id,
      previousLeague: previousLeague,
      nextLeague: nextLeague
    };
  }

  function getTransferCollapse(player, sellingClub, option) {
    if (option.forcedDeparture || (option.type !== "formal" && option.type !== "transfer")) {
      return null;
    }

    var collapseChance = 0.015;
    if (option.transferFee >= 100000000) collapseChance += 0.015;
    if (player.status.fitness < 58) collapseChance += 0.04;
    if (getDerbyBetweenClubs(sellingClub.id, option.club.id)) collapseChance += 0.015;
    if (Math.random() >= collapseChance) {
      return null;
    }

    var reasons = player.status.fitness < 58
      ? [
        "签约前体检发现了潜在伤病风险，买方最终停止交易。",
        "医疗报告没有得到双方认可，转会在签字前被叫停。"
      ]
      : [
        "两家俱乐部未能就付款结构和附加条款达成一致，交易在最后阶段破裂。",
        getClubDisplayName(sellingClub) + " 在截止日前临时提高要价，买方拒绝继续追加报价。",
        "注册文件没能在截止时间前全部完成，这笔转会最终宣告失败。"
      ];
    var reason = pickOne(reasons);
    return {
      reason: reason,
      note: "转会插曲：你原本已经同意加盟 " + getClubDisplayName(option.club) + "，但" + reason
    };
  }

  function showTransferCollapseEffect(targetClub, collapse) {
    if (!app || typeof app.insertAdjacentHTML !== "function") return;
    app.insertAdjacentHTML(
      "beforeend",
      '<div class="season-result-fx transfer-collapse-layer" id="transfer-collapse-fx" role="button" tabindex="0" aria-label="关闭交易叫停提示">' +
      '  <div class="season-result-fx-stack">' +
      '    <div class="result-fx-card result-fx-collapse">' +
      '      <div class="collapse-fx-icon"><i></i><span>×</span></div>' +
      '      <strong>交易叫停</strong><span>加盟 ' + getClubDisplayName(targetClub) + ' 的转会未能完成</span>' +
      '    </div>' +
      '    <p class="collapse-fx-reason">' + collapse.reason + "</p>" +
      '    <p class="collapse-fx-dismiss">点击任意位置关闭</p>' +
      "  </div>" +
      "</div>"
    );
    var layer = document.getElementById("transfer-collapse-fx");
    if (!layer) return;
    function dismissCollapseEffect() {
      layer.classList.add("result-fx-leaving");
      setTimeout(function () {
        if (layer && typeof layer.remove === "function") layer.remove();
      }, 300);
    }
    layer.addEventListener("click", dismissCollapseEffect);
    layer.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault();
        dismissCollapseEffect();
      }
    });
    layer.focus();
  }

  function simulatePhase(player) {
    var club = getClubById(player.currentClubId);
    refreshContinentalQualificationFromCareer(player, club);
    var clubStrength = getClubStrength(club);
    var playingChance = calculatePlayingChance(player, club);
    var competitionStats = simulateCompetitionAppearances(player, club, playingChance);
    var appearances = competitionStats.total;
    var stats = simulateStats(player, appearances, competitionStats);
    var potentialResult = evolvePlayerPotential(player, club, stats);
    var plannedGrowth = calculateOverallChange(player);
    var seasonOutlook = simulateClubSeasonOutlook(player, club, stats, competitionStats);
    var trophies = simulateTrophies(player, club, stats, seasonOutlook);
    var refereeScandal = buildRefereeScandalMoment(player, club, competitionStats);
    if (refereeScandal) {
      applyEffects(player, refereeScandal.effects);
    }
    var ballonDorControversy = buildBallonDorControversy(player, club, stats, trophies, seasonOutlook);
    var derbyResult = simulateDerbyMoment(player, club, stats);
    var nationalSummary = simulateNationalTeamSeason(player);
    var dynastyMoments = buildDynastyMoments(player, club, trophies, nationalSummary);
    var legendStory = buildSingleMatchScoringStory(player, club, stats) ||
      buildUniversalLegendStory(player, club, stats, trophies, seasonOutlook, nationalSummary);
    var seasonMoment = generateSeasonMoment(player, club, stats, trophies, derbyResult, nationalSummary, seasonOutlook, legendStory, ballonDorControversy, dynastyMoments);
    if (refereeScandal) {
      seasonMoment = refereeScandal.text;
    }
    var defeatContext = buildSeasonDefeatReason(player, club, stats, competitionStats, seasonOutlook);
    var seasonAchievements = getSeasonAchievements(player, club, stats, trophies, nationalSummary, legendStory, seasonOutlook, ballonDorControversy);
    seasonAchievements = unique(seasonAchievements.concat(dynastyMoments.map(function (moment) {
      return moment.name;
    })));

    var growth = applyProfileDevelopment(player, plannedGrowth);
    player.value = calculateMarketValue(player, club, stats);
    var reputationChange = calculateSeasonReputationChange(player, club, stats, trophies, derbyResult);
    var statusFeedback = updateAdaptivePlayerStatus(
      player,
      club,
      stats,
      trophies,
      derbyResult,
      seasonOutlook,
      reputationChange
    );
    player.status.fitness = clamp(player.status.fitness + randomInt(-8, 6), 42, 100);

    player.totals.appearances += stats.appearances;
    player.totals.goals += stats.goals;
    player.totals.assists += stats.assists;
    player.totals.trophies += trophies.filter(isCompetitionChampionship).length +
      nationalSummary.honors.filter(isCompetitionChampionship).length;
    player.nationalTeam.caps += nationalSummary.caps;
    player.nationalTeam.goals += nationalSummary.goals;
    player.nationalTeam.assists += nationalSummary.assists;
    player.nationalTeam.honors = unique(player.nationalTeam.honors.concat(nationalSummary.honors));

    var entry = {
      age: player.age,
      seasonYear: player.seasonYear,
      clubName: getClubDisplayName(club),
      clubShortName: club.shortName,
      clubId: club.id,
      clubStrength: clubStrength,
      overall: player.overall,
      appearances: stats.appearances,
      goals: stats.goals,
      assists: stats.assists,
      teamContribution: stats.teamContribution,
      cleanSheets: stats.cleanSheets,
      penaltySaves: stats.penaltySaves,
      headedGoals: stats.headedGoals,
      setPieceGoals: stats.setPieceGoals,
      leagueGoals: stats.leagueGoals,
      leagueAssists: stats.leagueAssists,
      competitionStats: competitionStats,
      leagueStanding: seasonOutlook.leagueStanding,
      leagueTable: seasonOutlook.leagueSimulation ? seasonOutlook.leagueSimulation.table : [],
      leagueOutcomeStory: buildLeagueOutcomeStory(club, seasonOutlook.leagueStanding),
      titleDroughtStory: buildDynamicTitleDroughtStory(player, club, seasonOutlook.leagueStanding, competitionStats),
      domesticCupStory: buildDomesticCupStory(club, competitionStats),
      continentalStory: buildContinentalCampaignStory(competitionStats),
      defeatReason: defeatContext ? defeatContext.text : "",
      defeatReasonSource: defeatContext ? defeatContext.source : "",
      trophies: trophies,
      achievements: seasonAchievements,
      ballonDorNominated: Boolean(player.pendingBallonDorNomination),
      ballonDorControversy: ballonDorControversy,
      refereeScandal: refereeScandal ? refereeScandal.text : "",
      dynastyMoments: dynastyMoments,
      injuries: player.pendingSeasonInjury ? [player.pendingSeasonInjury] : [],
      potential: player.potential,
      potentialChange: potentialResult.change,
      developmentNote: potentialResult.note,
      growth: growth,
      reputationChange: statusFeedback.reputationChange,
      statusFeedback: statusFeedback,
      value: player.value,
      position: player.position,
      derbyNote: derbyResult.note,
      derbyImportance: derbyResult.reputationDelta,
      derbyWasFeatured: derbyResult.forced,
      derbyOutcomeText: deriveDerbyOutcomeText(derbyResult),
      seasonMoment: seasonMoment,
      nationalCaps: nationalSummary.caps,
      nationalCompetitionName: nationalSummary.competitionName,
      nationalGoals: nationalSummary.goals,
      nationalAssists: nationalSummary.assists,
      nationalHonors: nationalSummary.honors,
      transferNote: buildTransferSeasonNote(player, club),
      specialSeasonStory: seasonOutlook.specialStory || "",
      legendStory: legendStory || ""
    };
    entry.keyMatchStory = player.pendingMajorMatchStory || "";

    player.career.push(entry);
    player.pendingSeasonInjury = null;
    player.pendingBallonDorNomination = false;
    player.pendingCompetitionOutcome = null;
    player.pendingMajorMatchStory = "";
    player.pendingSeasonCompetitionImpact = null;
    player.pendingDerbyChoiceBonus = 0;
    player.pendingTransferCollapse = "";
    if (window.LeagueSimulation && seasonOutlook.leagueSimulation) {
      seasonOutlook.leagueSimulation.table.forEach(function (row) {
        var simulatedClub = getClubById(row.clubId);
        if (simulatedClub) {
          window.LeagueSimulation.evolveClubStrength(
            simulatedClub,
            row,
            seasonOutlook.leagueSimulation.table.length
          );
        }
      });
    }
    evolveClubLandscape(club.id, entry);
    return entry;
  }

  function refreshContinentalQualificationFromCareer(player, club) {
    if (!club || club.region !== "欧洲") return;
    var previousEntries = (player.career || []).filter(function (entry) {
      return entry.clubId === club.id && entry.age === player.age - 1;
    });
    if (!previousEntries.length) return;
    var previous = previousEntries[previousEntries.length - 1];
    player.nextContinentalCompetition = getContinentalQualificationFromSeason(club, previous);
  }

  function getContinentalQualificationFromSeason(club, summary) {
    if (!club || club.region !== "欧洲" || !summary) return "";
    var trophies = summary.trophies || [];
    var status = summary.leagueStanding && summary.leagueStanding.status;
    var competitionNames = getCompetitionNames(club);

    if (trophies.indexOf("欧冠冠军") !== -1 || trophies.indexOf("欧联杯冠军") !== -1) {
      return "欧冠";
    }
    if (status === "欧冠区" || status === "欧冠资格赛区") {
      return "欧冠";
    }
    if (trophies.indexOf("欧协联冠军") !== -1 || status === "欧联区") {
      return "欧联杯";
    }
    if (trophies.indexOf(competitionNames.domesticCup) !== -1) {
      return "欧联杯";
    }
    return status === "欧协联区" ? "欧协联" : "";
  }

  function generateTransferOptions(player, summary) {
    var currentClub = getClubById(player.currentClubId);
    var forcedDeparture = Boolean(player.pendingForcedDeparture);
    var currentClubStrength = getClubStrength(currentClub);
    var transferScore = player.overall * 0.5 + player.status.reputation * 0.2 + summary.goals * 0.6 + summary.assists * 0.4 + player.status.transferInterest * 0.3;
    var renewalChance = clamp((player.status.coachRelation + summary.appearances - 22 + currentClub.youthChance * 0.15) / 100, 0.2, 0.88);
    var similarOfferChance = clamp((summary.appearances + player.status.reputation * 0.35 + player.overall - currentClubStrength + 24) / 100, 0.18, 0.82);
    var formalOfferChance = clamp((transferScore - 42) / 55, 0.12, 0.84);
    var yearsAtCurrentClub = player.age - (player.currentClubStartAge || 16);
    var contractYearsRemaining = Math.max(0, (player.contractUntilAge || player.age) - player.age);
    var renewalWindowOpen = contractYearsRemaining <= 1;
    var adaptingAfterTransfer = player.lastTransfer &&
      player.lastTransfer.toClubId === currentClub.id &&
      yearsAtCurrentClub < 2;
    var hasEuropeanExperience = (player.career || []).some(function (season) {
      var careerClub = getClubById(season.clubId);
      return careerClub && careerClub.region === "欧洲";
    });
    var firstMoveFromAsia = currentClub.region === "亚洲" && !hasEuropeanExperience;
    if (adaptingAfterTransfer) {
      similarOfferChance *= 0.18;
      formalOfferChance *= 0.15;
    }

    var eligibleDestinations = window.CLUBS.filter(function (club) {
      return club.id !== currentClub.id &&
        getClubDisplayName(club) !== getClubDisplayName(currentClub) &&
        (player.blockedTransferClubIds || []).indexOf(club.id) === -1 &&
        canFormerClubMakeOffer(player, club, summary) &&
        canClubApproachPlayer(player, currentClub, club, summary);
    });

    var similar = eligibleDestinations.filter(function (club) {
      return Math.abs(getClubStrength(club) - player.overall) <= 12;
    });

    var stronger = eligibleDestinations.filter(function (club) {
      var clubStrength = getClubStrength(club);
      return clubStrength > currentClubStrength && clubStrength <= Math.min(96, player.overall + 16);
    });

    var options = [];
    var seenClubIds = {};
    var hasRenewalOffer = false;
    var hasDevelopmentLoan = false;
    var hasForcedStay = false;
    var rejectedOffers = [];
    function pushUniqueOption(option) {
      if (!option || !option.club || seenClubIds[option.club.id]) {
        return;
      }
      var enriched = enrichOfferTerms(option, player);
      option.roleLabel = enriched.roleLabel;
      option.playtimeLabel = enriched.playtimeLabel;
      option.salaryLabel = enriched.salaryLabel;
      option.salaryValue = enriched.salaryValue;
      option.transferFee = enriched.transferFee;
      option.feeLabel = enriched.feeLabel;
      option.stageLabel = getLeagueStageLabel(option.club);
      option.clubSnapshot = buildOfferClubSnapshot(option.club, currentClub, summary);
      if (option.marketBreakthrough) {
        option.transferFee = Math.min(option.transferFee, Math.round(getClubTransferBudget(option.club) * 0.82));
        option.feeLabel = "转会费 " + formatMoney(option.transferFee);
      }
      if (option.worldClassPursuit) {
        var worldClassBudget = getClubTransferBudget(option.club);
        var worldClassFloor = roundTransferAmount(player.value * 0.9);
        option.transferFee = Math.min(
          worldClassBudget * 0.92,
          Math.max(option.transferFee, worldClassFloor)
        );
        option.transferFee = roundTransferAmount(option.transferFee);
        option.feeLabel = "转会费 " + formatMoney(option.transferFee);
      }
      if (forcedDeparture && option.club.id !== currentClub.id) {
        option.forcedDeparture = true;
      }
      if (
        !forcedDeparture &&
        !option.marketBreakthrough &&
        !option.worldClassPursuit &&
        (option.type === "formal" || option.type === "transfer") &&
        option.transferFee > getClubTransferBudget(option.club)
      ) {
        seenClubIds[option.club.id] = true;
        return;
      }
      if (!forcedDeparture && !option.marketBreakthrough && !option.worldClassPursuit && (option.type === "formal" || option.type === "transfer")) {
        var minimumAcceptedFee = getMinimumAcceptedTransferFee(player, currentClub, option.club, summary);
        if (option.transferFee < minimumAcceptedFee) {
          seenClubIds[option.club.id] = true;
          rejectedOffers.push(
            getClubDisplayName(option.club) + " 报价 " + formatMoney(option.transferFee) +
            "，但 " + getClubDisplayName(currentClub) + " 对你的最低估值为 " +
            formatMoney(minimumAcceptedFee) + "，因此直接回绝。"
          );
          return;
        }
      }
      seenClubIds[option.club.id] = true;
      options.push(option);
    }

    if (player.parentClubId && player.loanReturnAge === player.age) {
      var parentClub = getClubById(player.parentClubId);
      if (parentClub) {
        pushUniqueOption({
          label: "租借期满回归母队",
          description: "你的租借期已经结束，" + getClubDisplayName(parentClub) + " 决定先把你召回观察。",
          club: parentClub,
          coachDelta: 1,
          happinessDelta: 0,
          type: "return"
        });
        summary.clubDecisionNote = "租借期已经结束，你将先回到 " + getClubDisplayName(parentClub) + " 接受新赛季评估。";
        return options;
      }
    }

    var homecomingClub = findHomecomingClub(player, currentClub);
    var chineseReturn =
      player.countryCode === "CN" &&
      currentClub.league !== "Chinese Super League";
    var homecomingMinimumAge = chineseReturn ? 33 : 35;
    var homecomingMinimumReputation = chineseReturn ? 55 : 75;
    var homecomingChance = chineseReturn
      ? clamp(
          0.48 +
          (player.age - 33) * 0.1 +
          Math.max(0, player.status.reputation - 55) * 0.006,
          0.48,
          0.9
        )
      : clamp(
          0.03 +
          Math.max(0, player.status.reputation - 75) * 0.002 +
          Math.max(0, player.age - 35) * 0.012,
          0.03,
          0.14
        );
    if (
      !forcedDeparture &&
      homecomingClub &&
      !player.homecomingUsed &&
      player.age >= homecomingMinimumAge &&
      player.status.reputation >= homecomingMinimumReputation &&
      Math.random() < homecomingChance
    ) {
      var homecomingContribution = getFormerClubContribution(player, homecomingClub.id);
      pushUniqueOption({
        label: chineseReturn
          ? "收到正式求购"
          : "功勋旧主邀请你回归",
        description: chineseReturn
          ? getClubDisplayName(homecomingClub) + " 向你送上了一份正式报价。"
          : getClubDisplayName(homecomingClub) + " 记得你此前 " +
            homecomingContribution.seasons + " 个赛季、" +
            homecomingContribution.appearances + " 次出场和 " +
            homecomingContribution.championships + " 座冠军的贡献，希望你以经验领袖身份回归。",
        club: homecomingClub,
        coachDelta: chineseReturn ? -2 : 8,
        happinessDelta: chineseReturn ? 2 : 8,
        type: chineseReturn ? "formal" : "homecoming"
      });
    }

    var rivalTargets = getDirectRivalClubs(currentClub.id).filter(function (club) {
      return eligibleDestinations.some(function (candidate) { return candidate.id === club.id; });
    });
    if (
      rivalTargets.length &&
      player.age <= 33 &&
      player.status.reputation >= 28 &&
      Math.random() < 0.12
    ) {
      var rivalTarget = pickOne(rivalTargets);
      var rivalry = getDerbyBetweenClubs(currentClub.id, rivalTarget.id);
      pushUniqueOption({
        label: "收到死敌求购",
        description: getClubDisplayName(rivalTarget) + " 正式提出报价。转投同城或传统死敌会带来更大的比赛舞台，也必然激怒 " + getClubDisplayName(currentClub) + " 球迷。",
        club: rivalTarget,
        coachDelta: 2,
        happinessDelta: -2,
        type: "formal",
        rivalryId: rivalry && rivalry.id
      });
    }

    var keepInterest = player.status.coachRelation + summary.appearances * 0.35 + player.overall - currentClubStrength + currentClub.youthChance * 0.08;
    var seasonOutput = summary.goals + summary.assists;
    var establishedCoreSeason =
      player.age <= 33 &&
      player.overall >= currentClubStrength - 1 &&
      summary.appearances >= 26 &&
      player.status.reputation >= 68 &&
      (
        player.status.coachRelation >= 45 ||
        player.overall >= currentClubStrength + 5
      );
    var historicCoreSeason =
      (summary.trophies || []).indexOf("金球奖") !== -1 ||
      summary.goals >= 40 ||
      seasonOutput >= 55 ||
      (
        player.overall >= 88 &&
        player.status.reputation >= 88 &&
        summary.appearances >= 30 &&
        seasonOutput >= (
          ["GK", "CB"].indexOf(player.position) !== -1 ? 2 :
          ["LB", "RB"].indexOf(player.position) !== -1 ? 10 :
          player.position === "CM" ? 18 : 28
        )
      );
    var proactiveRenewalWindow =
      contractYearsRemaining <= (historicCoreSeason ? 3 : 2) &&
      (historicCoreSeason || establishedCoreSeason);
    var renewalEligible =
      (player.age <= 21 || player.overall >= currentClubStrength - 10) &&
      (player.age < 33 || (player.overall >= currentClubStrength - 8 && summary.appearances >= 15)) &&
      (player.age < 36 || (player.overall >= currentClubStrength - 6 && summary.appearances >= 18));
    if (
      !forcedDeparture &&
      (renewalWindowOpen || proactiveRenewalWindow) &&
      (historicCoreSeason || establishedCoreSeason || renewalEligible) &&
      (
        historicCoreSeason ||
        establishedCoreSeason ||
        (
          (keepInterest >= 58 || (player.age <= 22 && currentClub.youthChance >= 72)) &&
          Math.random() < renewalChance
        )
      )
    ) {
      hasRenewalOffer = true;
      pushUniqueOption({
        label: "收到续约报价",
        description: historicCoreSeason || establishedCoreSeason
          ? getClubDisplayName(currentClub) + " 将你视为不可替代的核心，已经主动送上续约合同。"
          : getRenewalOfferDescription(currentClub, player),
        club: currentClub,
        coachDelta: historicCoreSeason || establishedCoreSeason ? 9 : 6,
        happinessDelta: historicCoreSeason || establishedCoreSeason ? 5 : 3,
        type: "renewal"
      });
    }

    if (!forcedDeparture && contractYearsRemaining > 1 && !hasRenewalOffer) {
      hasForcedStay = true;
      pushUniqueOption({
        label: "继续履行现有合同",
        description: "你与 " + getClubDisplayName(currentClub) + " 的合同还有 " +
          contractYearsRemaining + " 年。球队会根据表现调整你的定位，但不会在加盟后立即放弃你。",
        club: currentClub,
        coachDelta: 0,
        happinessDelta: 0,
        type: "forced-stay",
        contractYearsRemaining: contractYearsRemaining
      });
    }

    var worldClassMarketSeason =
      player.age <= 30 &&
      player.overall >= 90 &&
      summary.appearances >= 18;
    var eliteMarketSeason =
      player.age <= 29 &&
      (
        worldClassMarketSeason ||
        (
          player.overall >= 84 &&
          hasStrongMarketSeason(player, currentClub, summary) &&
          player.status.reputation >= 62
        )
      );
    var eliteMarketPool = eligibleDestinations.filter(function (club) {
      var strength = getClubStrength(club);
      var canFundWorldClassMove = !worldClassMarketSeason ||
        getClubTransferBudget(club) >= player.value * 0.9;
      return club.region === "欧洲" &&
        club.leagueLevel === 1 &&
        (!worldClassMarketSeason || club.band === "豪门" || strength >= 88) &&
        (!firstMoveFromAsia || player.overall >= 90 || (club.band !== "豪门" && strength <= 87)) &&
        strength >= (worldClassMarketSeason ? currentClubStrength : currentClubStrength - 4) &&
        strength <= player.overall + 9 &&
        canFundWorldClassMove &&
        !seenClubIds[club.id];
    }).sort(function (a, b) {
      var strengthFitA = Math.abs(getClubStrength(a) - player.overall);
      var strengthFitB = Math.abs(getClubStrength(b) - player.overall);
      return strengthFitA - getClubTransferBudget(a) / 60000000 -
        (strengthFitB - getClubTransferBudget(b) / 60000000);
    });

    if (eliteMarketSeason && eliteMarketPool.length) {
      var desiredExternalOffers = player.overall >= 88 ? 3 : 2;
      for (
        var eliteMarketIndex = 0;
        eliteMarketIndex < Math.min(10, eliteMarketPool.length) &&
        options.filter(function (option) { return option.club.id !== currentClub.id; }).length < desiredExternalOffers;
        eliteMarketIndex += 1
      ) {
        pushUniqueOption({
          label: eliteMarketPool[eliteMarketIndex].band === "豪门" ? "收到豪门正式求购" : "收到正式求购",
          description: buildTransferOfferDescription(eliteMarketPool[eliteMarketIndex], "formal"),
          club: eliteMarketPool[eliteMarketIndex],
          coachDelta: -6,
          happinessDelta: 1,
          type: "formal",
          worldClassPursuit: worldClassMarketSeason
        });
      }
    }

    if (forcedDeparture && player.pendingAmbitiousDeparture) {
      var ambitiousPool = window.CLUBS.filter(function (club) {
        var strength = getClubStrength(club);
        return club.id !== currentClub.id &&
          club.region === currentClub.region &&
          club.leagueLevel === 1 &&
          !isSaudiClub(club) &&
          strength >= currentClubStrength + 3 &&
          strength <= player.overall + 7 &&
          !seenClubIds[club.id] &&
          (player.blockedTransferClubIds || []).indexOf(club.id) === -1;
      }).sort(function (a, b) {
        return getClubStrength(b) + (b.reputation || 0) * 0.08 -
          (getClubStrength(a) + (a.reputation || 0) * 0.08);
      });
      ambitiousPool.slice(0, 2).forEach(function (club) {
        pushUniqueOption({
          label: club.band === "豪门" ? "收到豪门正式求购" : "收到更高舞台报价",
          description: buildTransferOfferDescription(club, "formal"),
          club: club,
          coachDelta: -5,
          happinessDelta: 4,
          type: "formal",
          forcedDeparture: true
        });
      });
    }

    var europeanBreakthroughPool = eligibleDestinations.filter(function (club) {
      return isBigFiveTopFlight(club) &&
        (player.overall >= 90 || club.band !== "豪门") &&
        (player.overall >= 88 || getClubStrength(club) <= 85) &&
        getClubStrength(club) <= player.overall + 9 &&
        !seenClubIds[club.id];
    }).sort(function (a, b) {
      var fitA = Math.abs(getClubStrength(a) - player.overall) + (a.band === "豪门" ? 8 : a.band === "强队" ? 2 : 0);
      var fitB = Math.abs(getClubStrength(b) - player.overall) + (b.band === "豪门" ? 8 : b.band === "强队" ? 2 : 0);
      return fitA - fitB;
    });
    var deservesEuropeanBreakthrough =
      currentClub.region === "亚洲" &&
      player.age <= 24 &&
      summary.appearances >= 24 &&
      player.overall >= 82 &&
      (summary.goals + summary.assists >= 8 || player.overall >= 86);
    if (deservesEuropeanBreakthrough && !europeanBreakthroughPool.length) {
      europeanBreakthroughPool = window.CLUBS.filter(function (club) {
        return club.id !== currentClub.id &&
          isBigFiveTopFlight(club) &&
          club.band !== "豪门" &&
          getClubStrength(club) <= player.overall + 9 &&
          (player.blockedTransferClubIds || []).indexOf(club.id) === -1;
      }).sort(function (a, b) {
        return Math.abs(getClubStrength(a) - player.overall) -
          Math.abs(getClubStrength(b) - player.overall);
      });
    }
    var breakthroughChance = player.overall >= 88 ? 1 :
      clamp(0.58 + (player.overall - 82) * 0.065, 0.58, 0.94);

    if (deservesEuropeanBreakthrough && europeanBreakthroughPool.length && Math.random() < breakthroughChance) {
      for (
        var europeanIndex = 0;
        europeanIndex < Math.min(12, europeanBreakthroughPool.length) &&
        !options.some(function (option) { return isBigFiveTopFlight(option.club); });
        europeanIndex += 1
      ) {
        pushUniqueOption({
          label: "收到五大联赛正式求购",
          description: buildTransferOfferDescription(europeanBreakthroughPool[europeanIndex], "formal"),
          club: europeanBreakthroughPool[europeanIndex],
          coachDelta: -6,
          happinessDelta: 2,
          type: "formal",
          marketBreakthrough: true
        });
      }
    }

    var regionalSimilar = similar.filter(function (club) {
      return club.region === currentClub.region || club.leagueLevel === currentClub.leagueLevel;
    });
    var similarPool = regionalSimilar.length ? regionalSimilar : similar;
    var availableSimilarPool = (similarPool.length ? similarPool : eligibleDestinations).filter(function (club) {
      return !seenClubIds[club.id];
    });
    var needsDevelopmentLoan = !player.parentClubId &&
      player.age <= 23 &&
      player.overall <= 78 &&
      currentClubStrength - player.overall >= 5 &&
      summary.appearances < 18 &&
      contractYearsRemaining > 1;
    var developmentLoanPool = availableSimilarPool.filter(function (club) {
      var destinationStrength = getClubStrength(club);
      return !isSaudiClub(club) &&
        !getDerbyBetweenClubs(currentClub.id, club.id) &&
        club.region === currentClub.region &&
        destinationStrength <= currentClubStrength - 4 &&
        Math.abs(destinationStrength - player.overall) <= 8;
    }).sort(function (a, b) {
      var aFit = Math.abs(getClubStrength(a) - player.overall) - a.youthChance * 0.025;
      var bFit = Math.abs(getClubStrength(b) - player.overall) - b.youthChance * 0.025;
      return aFit - bFit;
    });
    var developmentLoanClub = developmentLoanPool.length
      ? pickOne(developmentLoanPool.slice(0, Math.min(4, developmentLoanPool.length)))
      : null;

    if (needsDevelopmentLoan && developmentLoanClub) {
      hasDevelopmentLoan = true;
      pushUniqueOption({
        label: "母队安排外租练级",
        description: getClubDisplayName(currentClub) + " 暂时无法保证你的出场时间，但不会直接放弃合同，准备把你租借到 " +
          getClubDisplayName(developmentLoanClub) + " 获得稳定比赛锻炼。",
        club: developmentLoanClub,
        coachDelta: 2,
        happinessDelta: 2,
        type: "loan"
      });
    }

    var remainingSimilarPool = availableSimilarPool.filter(function (club) {
      return !seenClubIds[club.id];
    });
    var similarClub = remainingSimilarPool.length ? pickOne(remainingSimilarPool) : null;
    var ordinaryLoanPool = remainingSimilarPool.filter(function (club) {
      return !isSaudiClub(club) &&
        !getDerbyBetweenClubs(currentClub.id, club.id) &&
        getClubStrength(club) <= currentClubStrength - 4 &&
        Math.abs(getClubStrength(club) - player.overall) <= 8;
    });
    var ordinaryLoanClub = ordinaryLoanPool.length ? pickOne(ordinaryLoanPool) : null;
    var ordinaryLoanEligible =
      player.age <= 22 &&
      player.overall <= 77 &&
      currentClubStrength - player.overall >= 5 &&
      summary.appearances < 20;
    if (!hasDevelopmentLoan && ordinaryLoanClub && ordinaryLoanEligible && Math.random() < similarOfferChance) {
      pushUniqueOption({
        label: "收到租借邀请",
        description: getClubDisplayName(ordinaryLoanClub) + " 想以租借方式带你过去，先让你稳定获得比赛时间。",
        club: ordinaryLoanClub,
        coachDelta: -2,
        happinessDelta: 1,
        type: "loan"
      });
    } else if (similarClub && Math.random() < similarOfferChance + 0.12) {
      pushUniqueOption({
        label: isSaudiClub(similarClub) ? "收到高薪邀请" : "收到转会接触",
        description: buildTransferOfferDescription(similarClub, "transfer"),
        club: similarClub,
        coachDelta: -2,
        happinessDelta: 1,
        type: "transfer"
      });
    }

    var fallbackStrongerPool = stronger.filter(function (club) { return !seenClubIds[club.id]; }).slice(0, 4);
    var strongerClub = stronger.sort(function (a, b) { return getClubStrength(a) - getClubStrength(b); }).find(function (club) {
      if (seenClubIds[club.id]) {
        return false;
      }
      return transferScore >= getTransferPull(club) - 10;
    }) || (fallbackStrongerPool.length ? pickOne(fallbackStrongerPool) : null);

    if (strongerClub && Math.random() < formalOfferChance) {
      pushUniqueOption({
        label: isSaudiClub(strongerClub) ? "收到沙特高薪报价" : "收到正式求购",
        description: buildTransferOfferDescription(strongerClub, "formal"),
        club: strongerClub,
        coachDelta: -8,
        happinessDelta: -2,
        type: "formal"
      });
    }

    if (!options.length && (!adaptingAfterTransfer || forcedDeparture)) {
      var fallbackDestinations = eligibleDestinations.filter(function (club) {
        return !seenClubIds[club.id] &&
          !isSaudiClub(club) &&
          getClubStrength(club) <= player.overall + 8;
      }).sort(function (a, b) {
        return Math.abs(getClubStrength(a) - player.overall) - Math.abs(getClubStrength(b) - player.overall);
      });

      for (var fallbackIndex = 0; fallbackIndex < Math.min(6, fallbackDestinations.length) && !options.length; fallbackIndex += 1) {
        var fallbackClub = fallbackDestinations[fallbackIndex];
        pushUniqueOption({
          label: "收到转会报价",
          description: getClubDisplayName(fallbackClub) + " 愿意接手你的合同，并提供重新争取比赛位置的机会。",
          club: fallbackClub,
          coachDelta: -2,
          happinessDelta: 0,
          type: "transfer"
        });
      }
    }

    if (forcedDeparture && !options.length) {
      var forcedExitPool = window.CLUBS.filter(function (club) {
        return club.id !== currentClub.id &&
          getClubDisplayName(club) !== getClubDisplayName(currentClub) &&
          getClubStrength(club) <= player.overall + 10 &&
          !isSaudiClub(club);
      }).sort(function (a, b) {
        var regionPenaltyA = a.region === currentClub.region ? 0 : 8;
        var regionPenaltyB = b.region === currentClub.region ? 0 : 8;
        return Math.abs(getClubStrength(a) - player.overall) + regionPenaltyA -
          (Math.abs(getClubStrength(b) - player.overall) + regionPenaltyB);
      });
      if (forcedExitPool.length) {
        pushUniqueOption({
          label: "挂牌后收到报价",
          description: getClubDisplayName(currentClub) + " 接受了你的离队要求，并降低要价与 " +
            getClubDisplayName(forcedExitPool[0]) + " 达成转会方案。",
          club: forcedExitPool[0],
          coachDelta: -2,
          happinessDelta: 3,
          type: "transfer",
          forcedDeparture: true
        });
      }
    }

    if (!options.length && !forcedDeparture) {
      hasForcedStay = true;
      pushUniqueOption({
        label: "继续履行现有合同",
        description: "你与 " + getClubDisplayName(currentClub) + " 的现有合同仍然有效。本赛季俱乐部没有开启续约谈判，你将按原合同继续效力。",
        club: currentClub,
        coachDelta: -1,
        happinessDelta: -2,
        type: "forced-stay"
      });
    }

    summary.clubDecisionNote = forcedDeparture
      ? getClubDisplayName(currentClub) + " 已接受你的离队申请，本次市场不会再提供续约或留队选项。"
      : hasDevelopmentLoan
      ? getClubDisplayName(currentClub) + " 仍然保留你的长期计划，但现阶段队内竞争过强，因此主动为你安排外租并要求保证比赛时间。"
      : hasForcedStay
        ? ""
        : buildClubDecisionNote(currentClub, player, summary, keepInterest, hasRenewalOffer);
    summary.rejectedOfferNote = rejectedOffers.length
      ? "转会动态：" + rejectedOffers.slice(0, 2).join(" ")
      : "";

    var finalOptions = options.slice(0, 3);
    var breakthroughOffer = deservesEuropeanBreakthrough
      ? options.find(function (option) { return isBigFiveTopFlight(option.club); })
      : null;
    if (
      breakthroughOffer &&
      !finalOptions.some(function (option) { return option.club.id === breakthroughOffer.club.id; })
    ) {
      if (finalOptions.length >= 3) {
        finalOptions[2] = breakthroughOffer;
      } else {
        finalOptions.push(breakthroughOffer);
      }
    }
    var retirementContext = player.age >= 34 &&
      (summary.growth <= -2 || (summary.injuries && summary.injuries.length) || player.status.fitness < 58);
    if (!forcedDeparture && (player.age >= 35 || retirementContext)) {
      var retirementOption = {
        label: player.age >= 36 ? "宣布赛季后退役" : "认真考虑退役",
        description: player.age >= 36
          ? "结束职业球员生涯，以自己的方式告别赛场并回顾全部经历。"
          : "身体、家庭和下一阶段人生都需要权衡；选择后将立即结束球员生涯。",
        club: currentClub,
        coachDelta: 0,
        happinessDelta: 4,
        type: "retire",
        roleLabel: "生涯决定",
        playtimeLabel: "立即退役",
        salaryLabel: "告别赛场",
        transferFee: 0,
        feeLabel: "",
        stageLabel: "个人选择",
        clubSnapshot: buildOfferClubSnapshot(currentClub, currentClub, summary)
      };
      if (finalOptions.length >= 3) {
        finalOptions[2] = retirementOption;
      } else {
        finalOptions.push(retirementOption);
      }
    }
    return finalOptions;
  }

  function findHomecomingClub(player, currentClub) {
    var chineseHomeClubs = player.countryCode === "CN" &&
      currentClub.league !== "Chinese Super League"
      ? window.CLUBS.filter(function (club) {
          return club.id !== currentClub.id &&
            club.league === "Chinese Super League";
        })
      : [];
    if (chineseHomeClubs.length) {
      chineseHomeClubs.sort(function (a, b) {
        var aFit = Math.abs(getClubStrength(a) - player.overall) - a.reputation * 0.05;
        var bFit = Math.abs(getClubStrength(b) - player.overall) - b.reputation * 0.05;
        return aFit - bFit;
      });
      return pickOne(chineseHomeClubs.slice(0, Math.min(4, chineseHomeClubs.length)));
    }

    var formerClubContributions = (player.career || []).reduce(function (clubs, entry) {
      if (!entry.clubId || entry.clubId === currentClub.id) {
        return clubs;
      }
      if (!clubs[entry.clubId]) {
        clubs[entry.clubId] = {
          clubId: entry.clubId,
          seasons: 0,
          appearances: 0,
          goals: 0,
          assists: 0,
          championships: 0
        };
      }
      var contribution = clubs[entry.clubId];
      contribution.seasons += 1;
      contribution.appearances += entry.appearances || 0;
      contribution.goals += entry.goals || 0;
      contribution.assists += entry.assists || 0;
      contribution.championships += (entry.trophies || []).filter(isCompetitionChampionship).length;
      return clubs;
    }, {});

    var eligibleFormerClubs = Object.keys(formerClubContributions).map(function (clubId) {
      var contribution = formerClubContributions[clubId];
      contribution.club = getClubById(clubId);
      contribution.score =
        contribution.appearances +
        contribution.goals * 3 +
        contribution.assists * 2 +
        contribution.championships * 35;
      return contribution;
    }).filter(function (contribution) {
      return contribution.club &&
        contribution.seasons >= 4 &&
        contribution.appearances >= 100 &&
        contribution.score >= 190;
    });

    if (!eligibleFormerClubs.length) {
      return null;
    }
    eligibleFormerClubs.sort(function (a, b) {
      return b.score - a.score || b.seasons - a.seasons;
    });
    return Math.random() < 0.72
      ? eligibleFormerClubs[0].club
      : pickOne(eligibleFormerClubs.slice(0, Math.min(3, eligibleFormerClubs.length))).club;
  }

  function getFormerClubContribution(player, clubId) {
    return (player.career || []).reduce(function (contribution, entry) {
      if (entry.clubId !== clubId) {
        return contribution;
      }
      contribution.seasons += 1;
      contribution.appearances += entry.appearances || 0;
      contribution.goals += entry.goals || 0;
      contribution.assists += entry.assists || 0;
      contribution.championships += (entry.trophies || []).filter(isCompetitionChampionship).length;
      return contribution;
    }, {
      seasons: 0,
      appearances: 0,
      goals: 0,
      assists: 0,
      championships: 0
    });
  }

  function isBigFiveTopFlight(club) {
    return club.leagueLevel === 1 && [
      "Premier League",
      "LALIGA EA SPORTS",
      "Bundesliga",
      "Serie A",
      "Ligue 1 McDonald's"
    ].indexOf(club.league) !== -1;
  }

  function isSaudiClub(club) {
    return club && club.league === "Saudi Pro League";
  }

  function hasStrongMarketSeason(player, club, summary) {
    if (!summary || summary.appearances < 26) {
      return false;
    }
    var output = summary.goals + summary.assists;
    var strengthGap = player.overall - getClubStrength(club);

    if (player.position === "GK" || player.position === "CB") {
      return player.overall >= 84 && strengthGap >= -3;
    }
    if (player.position === "LB" || player.position === "RB") {
      return output >= 6 || (player.overall >= 86 && strengthGap >= -3);
    }
    if (player.position === "CM") {
      return output >= 9 || (player.overall >= 86 && strengthGap >= -3);
    }
    if (player.position === "CAM") {
      return output >= 15;
    }
    if (player.position === "LM" || player.position === "RM") {
      return output >= 13;
    }
    return output >= 18;
  }

  function canClubApproachPlayer(player, currentClub, destinationClub, summary) {
    if (destinationClub.id === currentClub.id) {
      return false;
    }
    var recentOutput = summary ? summary.goals + summary.assists : 0;
    var recentStrongSeason = summary && (
      hasStrongMarketSeason(player, currentClub, summary) ||
      (
        summary.appearances >= 24 &&
        ["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(player.position) === -1
      )
    );
    var currentStrength = getClubStrength(currentClub);
    var destinationStrength = getClubStrength(destinationClub);
    var worldClassCandidate =
      player.age <= 30 &&
      player.overall >= 90 &&
      summary &&
      summary.appearances >= 18;

    if (player.age >= 25 && destinationStrength > currentStrength + 1) {
      var readyForStepUp = worldClassCandidate || (recentStrongSeason &&
        player.overall >= destinationStrength - 2 &&
        player.status.reputation >= 70);
      var readyForEliteClub = worldClassCandidate || destinationClub.band !== "豪门" ||
        (player.overall >= destinationStrength - 1 && player.status.reputation >= 78);
      if (!readyForStepUp || !readyForEliteClub) {
        return false;
      }
    }

    if (
      currentClub.league === "Chinese Super League" &&
      player.age >= 25 &&
      destinationClub.country !== "中国"
    ) {
      return false;
    }

    if (destinationClub.region === "欧洲" && currentClub.region === "亚洲") {
      if (player.age >= 25) {
        return false;
      }
      if (currentClub.league === "Chinese Super League") {
        if (isBigFiveTopFlight(destinationClub)) {
          var exceptionalChineseLeaguePlayer =
            player.age >= 22 &&
            player.age <= 24 &&
            player.overall >= 86 &&
            recentStrongSeason &&
            (player.overall >= 88 || player.status.reputation >= 55 || player.nationalTeam.caps >= 3);
          if (player.age > 24 || !recentStrongSeason || (player.age > 21 && !exceptionalChineseLeaguePlayer)) {
            return false;
          }
          if (destinationClub.band === "豪门") {
            return player.overall >= (player.age > 21 ? 89 : 80) &&
              player.status.reputation >= (player.age > 21 ? 72 : 65) &&
              player.nationalTeam.caps >= 5 &&
              player.overall >= getClubStrength(destinationClub) - (player.age > 21 ? 5 : 9);
          }
          if (player.age > 21) {
            return player.overall >= 86 &&
              (player.overall >= 88 || (player.status.reputation >= 55 && player.nationalTeam.caps >= 3)) &&
              player.overall >= getClubStrength(destinationClub) - 7;
          }
          return player.overall >= 76 &&
            player.status.reputation >= 50 &&
            player.nationalTeam.caps >= 3 &&
            player.overall >= getClubStrength(destinationClub) - 10;
        }
        return player.age <= 22 &&
          player.overall >= 70 &&
          player.status.reputation >= 40 &&
          recentStrongSeason;
      }
      if (isBigFiveTopFlight(destinationClub)) {
        var exceptionalAt24 = player.age === 24 &&
          player.overall >= 84 &&
          recentStrongSeason &&
          (player.status.reputation >= 55 || player.nationalTeam.caps >= 3);
        var eliteYoungProspect = player.age <= 23 &&
          player.overall >= 82 &&
          recentStrongSeason;
        return (player.age <= 23 || exceptionalAt24) &&
          player.overall >= 72 &&
          (player.status.reputation >= 40 || eliteYoungProspect) &&
          player.overall >= getClubStrength(destinationClub) - 11;
      }
      return player.age <= 23 &&
        player.overall >= 67 &&
        player.status.reputation >= 30;
    }

    if (
      currentClub.league === "Saudi Pro League" &&
      destinationClub.region === "欧洲" &&
      player.age >= 26
    ) {
      return false;
    }

    if (isSaudiClub(destinationClub)) {
      if (currentClub.league === "Saudi Pro League") {
        return true;
      }

      var targetStrength = getClubStrength(destinationClub);

      if (currentClub.region === "亚洲") {
        var asianStar = player.overall >= 78 &&
          player.status.reputation >= 72 &&
          player.nationalTeam.caps >= 8 &&
          recentStrongSeason;
        var asianSuperstar = player.overall >= 82 &&
          player.status.reputation >= 68 &&
          player.nationalTeam.caps >= 5;
        return (asianStar || asianSuperstar) && player.overall >= targetStrength - 7;
      }

      var establishedEuropean = player.overall >= 77 &&
        player.status.reputation >= 68 &&
        (player.nationalTeam.caps >= 5 || recentStrongSeason);
      var veteranName = player.age >= 29 &&
        player.overall >= 75 &&
        player.status.reputation >= 78;
      return (establishedEuropean || veteranName) && player.overall >= targetStrength - 8;
    }

    return true;
  }

  function getLeagueStageLabel(club) {
    if (isBigFiveTopFlight(club)) {
      return "五大联赛舞台";
    }
    if (isSaudiClub(club)) {
      return "高薪邀约";
    }
    if (club.region === "欧洲") {
      return club.leagueLevel >= 3
        ? "欧洲第三级联赛"
        : club.leagueLevel === 2
        ? "欧洲次级联赛"
        : "欧洲联赛";
    }
    return getLeagueDisplayName(club.league);
  }

  function getReputationGrowthScale(club) {
    if (isBigFiveTopFlight(club)) {
      return 1;
    }
    if (club.region === "欧洲") {
      return club.leagueLevel === 2 ? 0.62 : 0.75;
    }
    if (isSaudiClub(club)) {
      return 0.68;
    }
    if (club.league === "Chinese Super League") {
      return 0.32;
    }
    if (club.league === "China League One") {
      return 0.2;
    }
    if (club.league === "J1 League" || club.league === "K League 1") {
      return 0.42;
    }
    return 0.36;
  }

  function getReputationCeiling(player, club) {
    var baseCeiling = 62;
    if (isBigFiveTopFlight(club)) {
      baseCeiling = 99;
    } else if (club.region === "欧洲") {
      baseCeiling = club.leagueLevel >= 3 ? 64 : club.leagueLevel === 2 ? 74 : 82;
    } else if (isSaudiClub(club)) {
      baseCeiling = 84;
    } else if (club.league === "Chinese Super League") {
      baseCeiling = 58;
    } else if (club.league === "China League One") {
      baseCeiling = 50;
    } else if (club.league === "J1 League" || club.league === "K League 1") {
      baseCeiling = 64;
    }

    var internationalBonus = Math.min(7, Math.floor((player.nationalTeam.caps || 0) / 4));
    var honorBonus = Math.min(8, (player.nationalTeam.honors || []).length * 3);
    var ceiling = clamp(baseCeiling + internationalBonus + honorBonus, 20, 99);
    if (player.age <= 18) {
      ceiling = Math.min(ceiling, 78 + honorBonus);
    } else if (player.age <= 20) {
      ceiling = Math.min(ceiling, 88 + Math.min(4, honorBonus));
    } else if (player.age <= 22) {
      ceiling = Math.min(ceiling, 95 + Math.min(2, honorBonus));
    }
    var abilityCeiling = player.overall < 70 ? 58 :
      player.overall < 75 ? 68 :
      player.overall < 80 ? 78 :
      player.overall < 85 ? 88 :
      player.overall < 90 ? 95 : 99;
    ceiling = Math.min(ceiling, abilityCeiling + Math.min(3, honorBonus));
    return clamp(ceiling, 20, 99);
  }

  function applyReputationChange(player, club, change) {
    var current = player.status.reputation;
    if (change <= 0) {
      return clamp(current + change, 1, 99);
    }
    var ceiling = Math.max(current, getReputationCeiling(player, club));
    return clamp(current + change, 1, ceiling);
  }

  function getTrophyReputationValue(trophyName, club) {
    if (trophyName === "世界杯冠军") return 9;
    if (trophyName === "金球奖") return 8;
    if (trophyName === "欧冠冠军") return 7;
    if (trophyName === "欧联杯冠军" || trophyName === "洲际杯冠军") return 5;
    if (trophyName.indexOf("金靴") !== -1 || trophyName.indexOf("助攻王") !== -1) return isBigFiveTopFlight(club) ? 5 : 2;
    if (trophyName.indexOf("冠军") !== -1) return isBigFiveTopFlight(club) ? 4 : club.region === "欧洲" ? 2 : 1;
    return 0;
  }

  function calculateSeasonReputationChange(player, club, stats, trophies, derbyResult) {
    var group = getPositionGroup(player.position);
    var output = stats.goals + stats.assists;
    var performanceValue = stats.appearances >= 30 ? 1 : stats.appearances < 10 ? -2 : 0;

    if (group === "ST" || group === "WIDE") {
      performanceValue += output >= 25 ? 5 : output >= 15 ? 3 : output >= 8 ? 1 : 0;
    } else if (group === "MID") {
      performanceValue += output >= 18 ? 4 : output >= 10 ? 2 : output >= 5 ? 1 : 0;
    } else {
      performanceValue += stats.appearances >= 34 ? 2 : stats.appearances >= 24 ? 1 : 0;
    }

    var trophyValue = trophies.reduce(function (sum, trophyName) {
      return sum + getTrophyReputationValue(trophyName, club);
    }, 0);
    var participationFactor = stats.appearances < 10 ? 0.15 : stats.appearances < 20 ? 0.45 : stats.appearances < 28 ? 0.75 : 1;
    trophyValue *= participationFactor;
    var scale = getReputationGrowthScale(club);
    var positiveDerbyValue = Math.max(0, derbyResult.reputationDelta) * scale;
    var negativeDerbyValue = Math.min(0, derbyResult.reputationDelta);
    return Math.round((Math.max(0, performanceValue) + trophyValue) * scale + positiveDerbyValue + negativeDerbyValue + Math.min(0, performanceValue));
  }

  function getAdaptiveStatusImpact(player) {
    var happiness = player.status.happiness;
    var coachRelation = player.status.coachRelation;
    var reputation = player.status.reputation;
    var happinessFactor = (happiness - 60) / 40;
    var coachFactor = (coachRelation - 60) / 40;
    var reputationFactor = (reputation - 50) / 50;
    var pressure = Math.max(0, (reputation - 74) / 25);
    var supportDeficit = clamp((64 - (happiness + coachRelation) / 2) / 34, 0, 1);
    var pressurePenalty = pressure * supportDeficit;

    return {
      playingChance: happinessFactor * 0.045 + coachFactor * 0.11 +
        Math.max(0, reputationFactor) * 0.025 - pressurePenalty * 0.09,
      performanceMultiplier: clamp(
        1 + happinessFactor * 0.07 + coachFactor * 0.055 +
        Math.max(0, reputationFactor) * 0.025 - pressurePenalty * 0.11,
        0.8,
        1.13
      )
    };
  }

  function getExpectedSeasonOutput(player, appearances) {
    var outputPer30 = {
      GK: 0,
      CB: 2,
      FB: 5,
      MID: 10,
      WIDE: 16,
      ST: 19
    };
    return outputPer30[getPositionGroup(player.position)] * appearances / 30;
  }

  function applyAdaptiveStatusDelta(current, delta, minimum, maximum) {
    var adjusted = delta;
    if (current >= 90 && adjusted > 0) adjusted *= 0.35;
    else if (current >= 80 && adjusted > 0) adjusted *= 0.65;
    if (current <= 20 && adjusted < 0) adjusted *= 0.35;
    else if (current <= 32 && adjusted < 0) adjusted *= 0.65;
    return clamp(Math.round(current + adjusted), minimum, maximum);
  }

  function updateAdaptivePlayerStatus(player, club, stats, trophies, derbyResult, seasonOutlook, reputationChange) {
    var previous = {
      happiness: player.status.happiness,
      reputation: player.status.reputation,
      coachRelation: player.status.coachRelation
    };
    var injury = player.pendingSeasonInjury;
    var expectedOutput = getExpectedSeasonOutput(player, stats.appearances);
    var output = stats.goals + stats.assists;
    var performanceRatio = expectedOutput > 0
      ? output / expectedOutput
      : stats.appearances / Math.max(18, getClubStrength(club) - player.overall + 25);
    var expectedAppearances = clamp(25 + (player.overall - getClubStrength(club)) * 1.1, 10, 36);
    var playingTimeGap = stats.appearances - expectedAppearances;
    var performanceDelta = performanceRatio >= 1.35 ? 3 :
      performanceRatio >= 1.05 ? 1 :
      performanceRatio < 0.5 && stats.appearances >= 12 ? -3 :
      performanceRatio < 0.75 && stats.appearances >= 12 ? -1 : 0;
    var playingDelta = playingTimeGap >= 6 ? 3 : playingTimeGap >= 0 ? 1 :
      playingTimeGap <= -12 ? -5 : playingTimeGap <= -6 ? -3 : -1;
    var titleCount = trophies.filter(isCompetitionChampionship).length;
    var teamDelta = titleCount ? Math.min(4, titleCount + 1) :
      seasonOutlook && seasonOutlook.leagueStanding && seasonOutlook.leagueStanding.status === "降级区" ? -3 : 0;
    var marketSalary = calculateSalaryValue(player, club, "renewal");
    var salaryRatio = (player.currentSalary || marketSalary) / marketSalary;
    var salaryHappiness = salaryRatio < 0.68 ? -4 : salaryRatio < 0.82 ? -2 :
      salaryRatio >= 1.15 ? 1 : 0;
    var wagePressure = salaryRatio >= 1.35 && performanceRatio < 0.8 ? -2 : 0;
    var injuryHappiness = injury ? (injury.severity === "major" ? -5 : -2) : 0;
    var injuryCoach = injury && injury.severity === "major" ? -1 : 0;
    var derbyHappiness = derbyResult ? derbyResult.happinessDelta : 0;

    var happinessDelta = playingDelta + performanceDelta + teamDelta +
      salaryHappiness + injuryHappiness + derbyHappiness;
    var coachDelta = Math.round(playingDelta * 0.7 + performanceDelta * 1.2) +
      wagePressure + injuryCoach;
    var finalReputationDelta = reputationChange + performanceDelta + wagePressure;

    // Happiness and trust are short-term states, so extreme values slowly move back toward a sustainable range.
    if (previous.happiness > 86) happinessDelta -= 1;
    if (previous.happiness < 34) happinessDelta += 1;
    if (previous.coachRelation > 88) coachDelta -= 1;
    if (previous.coachRelation < 34) coachDelta += 1;

    player.status.happiness = applyAdaptiveStatusDelta(previous.happiness, happinessDelta, 10, 99);
    player.status.coachRelation = applyAdaptiveStatusDelta(previous.coachRelation, coachDelta, 10, 99);
    player.status.reputation = applyReputationChange(player, club, finalReputationDelta);
    player.status.transferInterest = clamp(
      player.status.transferInterest +
      (playingDelta < 0 ? Math.abs(playingDelta) * 2 : -2) +
      (salaryHappiness < 0 ? Math.abs(salaryHappiness) * 2 : 0) +
      randomInt(-3, 4),
      0,
      50
    );

    return {
      happinessChange: player.status.happiness - previous.happiness,
      reputationChange: player.status.reputation - previous.reputation,
      coachRelationChange: player.status.coachRelation - previous.coachRelation,
      performanceRatio: Math.round(performanceRatio * 100) / 100,
      salaryRatio: Math.round(salaryRatio * 100) / 100
    };
  }

  function buildTransferOfferDescription(club, offerType) {
    var clubName = getClubDisplayName(club);
    if (isSaudiClub(club)) {
      return clubName + " 希望用明显高于当前水平的薪资吸引你加盟，竞技平台并非五大联赛，但经济待遇非常优厚。";
    }
    if (isBigFiveTopFlight(club)) {
      return clubName + (offerType === "formal" ? " 已经送上正式报价" : " 正在与你接触") + "，这是进入欧洲最高竞技舞台的机会，竞争和淘汰压力也会显著提高。";
    }
    return clubName + (offerType === "formal" ? " 已经送上正式报价，想直接签下你。" : " 对你很感兴趣，愿意提供更稳定的定位。");
  }

  function getRenewalOfferDescription(club, player) {
    var clubName = getClubDisplayName(club);
    if (isBelowEliteStarterStandard(player, club)) {
      return clubName + " 愿意保留你作为阵容替补，但现阶段不会承诺稳定首发或核心职责。";
    }
    if (player.age <= 22) {
      return clubName + " 仍然看好你的成长空间，希望继续培养并留下你。";
    }
    if (player.age <= 29) {
      return clubName + " 认可你的即战力，希望你继续参与主力位置竞争。";
    }
    if (player.age <= 34) {
      return clubName + " 认可你的比赛经验和稳定性，希望继续保留你的球队角色。";
    }
    return clubName + " 评估了你的身体状态和更衣室价值，愿意提供一份短期续约合同。";
  }

  function buildClubDecisionNote(currentClub, player, summary, keepInterest, hasRenewalOffer) {
    if (hasRenewalOffer) {
      return "";
    }
    if ((player.contractUntilAge || player.age) - player.age > 1) {
      return "";
    }

    var currentClubStrength = getClubStrength(currentClub);
    var reasons = [];
    if (summary.appearances < 18) {
      reasons.push("这一季你的出场时间偏少，教练组没有完全建立长期信任");
    }
    if (player.overall + 4 < currentClubStrength) {
      reasons.push("俱乐部认为你现阶段的即战力还不足以匹配当前竞争强度");
    }
    if (player.status.coachRelation < 55) {
      reasons.push("你和教练组的默契一般，管理层对继续押注比较犹豫");
    }
    if (player.age <= 21 && currentClub.youthChance < 60) {
      reasons.push("这支队现在更看重即战力，给年轻球员耐心的空间有限");
    }
    if (summary.goals + summary.assists <= 3 && (player.position === "ST" || player.position === "LW" || player.position === "RW" || player.position === "LM" || player.position === "RM" || player.position === "CAM")) {
      reasons.push(player.age >= 28
        ? "你的直接数据没有拉开差距，主队高层希望把位置留给状态更好的球员"
        : "你的直接数据没有拉开差距，主队高层担心继续培养回报偏慢");
    }
    if (keepInterest < 54) {
      reasons.push(player.age >= 28
        ? "管理层判断你的年龄、状态和球队下一阶段计划并不完全重合"
        : "管理层判断你的发展曲线和球队下一阶段计划并不完全重合");
    }
    if (!reasons.length) {
      reasons.push("俱乐部内部更倾向把名额和薪资留给更成熟或更符合战术计划的人选");
    }

    return getClubDisplayName(currentClub) + " 没有第一时间选择留下你。";
  }

  function enrichOfferTerms(option, player) {
    var club = option.club;
    var strengthGap = getClubStrength(club) - player.overall;
    var roleLabel = "轮换角色";
    var playtimeLabel = "出场 18-28";
    var salaryValue = calculateSalaryValue(player, club, option.type);
    var transferFee = 0;
    var feeLabel = "";

    if (option.type === "renewal") {
      if (isBelowEliteStarterStandard(player, club)) {
        roleLabel = "替补球员";
        playtimeLabel = "出场 10-20";
      } else {
        roleLabel = player.age >= 35
          ? (player.status.coachRelation >= 72 ? "更衣室领袖" : "经验轮换")
          : player.age >= 28
            ? (player.status.coachRelation >= 72 ? "核心主力" : "稳定轮换")
            : player.age >= 23
              ? (player.overall >= getClubStrength(club) - 2 ? "核心主力" : "主力竞争")
              : (player.status.coachRelation >= 72 ? "核心培养" : "稳定轮换");
        playtimeLabel = player.status.coachRelation >= 72 ? "出场 26-36" : "出场 20-30";
      }
      salaryValue *= 1.02;
    } else if (option.type === "loan") {
      roleLabel = "外租练级";
      playtimeLabel = "出场 24-34";
      salaryValue *= 0.78;
    } else if (option.type === "formal") {
      if (strengthGap >= 8) {
        roleLabel = "替补冲击";
        playtimeLabel = "出场 12-22";
      } else if (strengthGap >= 3) {
        roleLabel = "重要轮换";
        playtimeLabel = "出场 18-28";
      } else {
        roleLabel = "主力竞争";
        playtimeLabel = "出场 24-34";
      }
      salaryValue *= 1.12;
      transferFee = calculateTransferFee(player, club, 1.12);
    } else if (option.type === "transfer") {
      roleLabel = "主力竞争";
      playtimeLabel = "出场 22-32";
      transferFee = calculateTransferFee(player, club, 0.96);
    } else if (option.type === "homecoming") {
      roleLabel = player.status.reputation >= 86 ? "功勋核心" : "经验领袖";
      playtimeLabel = player.age >= 35 ? "出场 16-26" : "出场 22-32";
      salaryValue *= 0.82;
      transferFee = roundTransferAmount(Math.min(player.value * 0.35, getClubTransferBudget(club) * 0.28));
      feeLabel = transferFee ? "象征性转会费 " + formatMoney(transferFee) : "自由转会";
    } else if (option.type === "return") {
      roleLabel = "归队观察";
      playtimeLabel = "出场 10-22";
      salaryValue *= 0.95;
    } else if (option.type === "forced-stay") {
      roleLabel = "合同期内留队";
      playtimeLabel = "出场 12-24";
      salaryValue *= 0.9;
    }

    return {
      roleLabel: roleLabel,
      playtimeLabel: playtimeLabel,
      salaryValue: Math.max(120000, Math.round(salaryValue)),
      salaryLabel: "年薪 " + formatMoney(Math.max(120000, salaryValue)),
      transferFee: transferFee,
      feeLabel: feeLabel || (transferFee ? "转会费 " + formatMoney(transferFee) : "")
    };
  }

  function calculateSalaryValue(player, club, offerType) {
    var salary = Math.round(
      (club.salaryLevel * 0.8 + player.overall * 0.55 + player.status.reputation * 0.2) * 6000
    );
    if (isSaudiClub(club) && offerType !== "loan") {
      salary *= player.status.reputation >= 75 ? 2.8 : 2.2;
    }
    return Math.max(120000, Math.round(salary));
  }

  function buildOfferClubSnapshot(club, currentClub, summary) {
    if (club.id === currentClub.id && summary && summary.leagueStanding) {
      var currentCup = summary.competitionStats && summary.competitionStats.domesticCupStage || "未参赛";
      var currentEurope = summary.competitionStats && summary.competitionStats.continentalName
        ? summary.competitionStats.continentalName +
          (summary.competitionStats.continentalStage || "")
        : "无欧战";
      return {
        league: getLeagueDisplayName(club.league) + "第 " + summary.leagueStanding.position + " 名",
        cup: getCompetitionNames(club).domesticCup.replace("冠军", "") + currentCup,
        continental: currentEurope
      };
    }

    var strength = getClubStrength(club);
    var teamCount = LEAGUE_TEAM_COUNTS[club.league] || 20;
    var position = getOfferLeaguePosition(club, summary, teamCount);
    var cupRoll = strength + randomInt(-12, 10);
    var cupStage = cupRoll >= 94 ? "冠军" :
      cupRoll >= 87 ? "四强" :
      cupRoll >= 79 ? "八强" :
      cupRoll >= 70 ? "十六强" : "早早出局";
    var continental = "无欧战";

    if (club.region === "欧洲" && club.leagueLevel === 1) {
      var qualification = getEuropeanQualificationStatus(club, position, false);
      var competition = qualification === "欧冠区" || qualification === "欧冠资格赛区"
        ? "欧冠"
        : qualification === "欧联区"
          ? "欧联杯"
          : qualification === "欧协联区" ? "欧协联" : "";
      if (competition) {
        var europeanRoll = strength + randomInt(-10, 9);
        var europeanStage = europeanRoll >= 94 ? "冠军" :
          europeanRoll >= 88 ? "四强" :
          europeanRoll >= 81 ? "八强" : "联赛阶段";
        continental = competition + europeanStage;
      }
    } else if (
      club.leagueLevel === 1 &&
      (club.region === "亚洲" || isSaudiClub(club)) &&
      position <= 4
    ) {
      continental = "亚冠" + (strength >= 88 ? "四强" : strength >= 80 ? "八强" : "小组赛");
    }
    return {
      league: getLeagueDisplayName(club.league) + "第 " + position + " 名",
      cup: getCompetitionNames(club).domesticCup.replace("冠军", "") + cupStage,
      continental: continental
    };
  }

  function calculateTransferFee(player, buyingClub, offerMultiplier) {
    var sellingClub = getClubById(player.currentClubId);
    var potentialGap = Math.max(0, player.potential - player.overall);
    var buyerPremium = 0.96 + getFinancialPower(buyingClub) * 0.0015;
    var sellerLeverage = sellingClub ? 0.95 + getTransferPull(sellingClub) * 0.002 : 1;
    var sellerFinanceFactor = sellingClub ? 0.95 + getFinancialPower(sellingClub) * 0.0012 : 1;
    var youthPremium = player.age <= 21 ? 1.14 : player.age <= 24 ? 1.07 : player.age >= 31 ? 0.82 : 1;
    var potentialPremium = 1 + Math.min(0.18, potentialGap * 0.009);
    var competitionPremium = 1 + Math.min(0.1, player.status.transferInterest * 0.0018);
    var leaguePremium = buyingClub.league === "Premier League" ? 1.12 : isSaudiClub(buyingClub) ? 1.18 : 1;
    var estimatedFee = player.value *
      buyerPremium *
      sellerLeverage *
      sellerFinanceFactor *
      youthPremium *
      potentialPremium *
      competitionPremium *
      leaguePremium *
      offerMultiplier *
      randomBetween(0.92, 1.08);
    var maximumMultiplier =
      player.age <= 21 ? 2.2 :
      player.age <= 24 ? 1.9 :
      player.age <= 30 ? 1.65 :
      player.age <= 33 ? 1.4 : 1.15;
    if (potentialGap >= 10) maximumMultiplier += 0.15;
    if (sellingClub && getDerbyBetweenClubs(sellingClub.id, buyingClub.id)) maximumMultiplier += 0.2;
    if (isSaudiClub(buyingClub)) maximumMultiplier += 0.25;
    var maximumFee = player.value * maximumMultiplier;
    return clamp(
      roundTransferAmount(Math.min(estimatedFee, maximumFee)),
      100000,
      250000000
    );
  }

  function getMinimumAcceptedTransferFee(player, sellingClub, buyingClub, summary) {
    if (!sellingClub || !summary) {
      return roundTransferAmount(player.value * 0.72);
    }

    var sellingStrength = getClubStrength(sellingClub);
    var corePlayer = player.overall >= sellingStrength - 2 &&
      summary.appearances >= 28 &&
      (player.status.reputation >= 72 || player.status.coachRelation >= 70);
    var indispensable = corePlayer &&
      player.overall >= sellingStrength &&
      summary.appearances >= 36 &&
      player.status.reputation >= 82;
    var multiplier = corePlayer ? 1.32 : 0.76;

    if (indispensable) multiplier += 0.28;
    if (corePlayer && getFinancialPower(sellingClub) >= 80) multiplier += 0.14;
    if (player.age >= 31) multiplier -= 0.22;
    if (player.age >= 34) multiplier -= 0.2;
    if (player.status.happiness <= 38) multiplier -= 0.18;

    return clamp(roundTransferAmount(player.value * Math.max(0.58, multiplier)), 100000, 250000000);
  }

  function calculateMarketValue(player, club, stats) {
    var overallBase = 100000 * Math.pow(1.2, player.overall - 50);
    var ageMultiplier =
      player.age <= 18 ? 0.72 :
      player.age <= 21 ? 1 :
      player.age <= 24 ? 1.12 :
      player.age <= 27 ? 1.04 :
      player.age <= 29 ? 0.9 :
      player.age <= 31 ? 0.7 :
      player.age <= 33 ? 0.5 :
      player.age <= 35 ? 0.32 : 0.18;
    var potentialGap = Math.max(0, player.potential - player.overall);
    var potentialMultiplier = 1 + Math.min(0.55, potentialGap * (player.age <= 21 ? 0.035 : 0.022));
    var reputationMultiplier = 0.78 + player.status.reputation * 0.0048;
    var leagueMultiplier = getLeagueMarketMultiplier(club);
    var positionMultiplier =
      player.position === "ST" ? 1.12 :
      ["LW", "RW", "LM", "RM"].indexOf(player.position) !== -1 ? 1.08 :
      player.position === "CAM" ? 1.08 :
      player.position === "CM" ? 1 :
      player.position === "LB" || player.position === "RB" ? 0.94 :
      player.position === "CB" ? 0.92 : 0.82;
    var performanceMultiplier = 1;

    if (stats) {
      var output = stats.goals + stats.assists;
      performanceMultiplier += stats.appearances >= 30 ? 0.06 : stats.appearances < 12 ? -0.14 : 0;
      if (["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(player.position) !== -1) {
        performanceMultiplier += output >= 25 ? 0.16 : output >= 15 ? 0.09 : output < 5 ? -0.08 : 0;
      } else if (player.position === "CM" || player.position === "CAM") {
        performanceMultiplier += output >= 15 ? 0.11 : output >= 8 ? 0.05 : 0;
      }
    }
    if (player.pendingSeasonInjury) {
      performanceMultiplier -= player.pendingSeasonInjury.severity === "major" ? 0.2 : 0.08;
    }

    var marketValue = overallBase *
      ageMultiplier *
      potentialMultiplier *
      reputationMultiplier *
      leagueMultiplier *
      positionMultiplier *
      clamp(performanceMultiplier, 0.58, 1.3) *
      randomBetween(0.96, 1.04);
    return clamp(roundTransferAmount(marketValue), 80000, 220000000);
  }

  function getLeagueMarketMultiplier(club) {
    if (club.league === "Premier League") return 1.22;
    if (isBigFiveTopFlight(club)) return 1.04;
    if (club.region === "欧洲" && club.leagueLevel >= 3) return 0.42;
    if (club.region === "欧洲" && club.leagueLevel === 2) return 0.58;
    if (club.region === "欧洲") return 0.76;
    if (isSaudiClub(club)) return 0.72;
    if (club.league === "Chinese Super League") return 0.28;
    if (club.league === "China League One") return 0.18;
    if (club.league === "J1 League" || club.league === "K League 1") return 0.38;
    return 0.32;
  }

  function roundTransferAmount(value) {
    var step = value >= 50000000 ? 500000 : value >= 10000000 ? 250000 : value >= 1000000 ? 100000 : 10000;
    return Math.round(value / step) * step;
  }

  function getClubTransferBudget(club) {
    var financialPower = getFinancialPower(club);
    var normalizedFinance = clamp((financialPower - 32) / 67, 0, 1);
    var budget = 4000000 + Math.pow(normalizedFinance, 2) * 280000000;
    if (club.league === "Premier League") {
      budget *= 1.16;
    }
    if (isSaudiClub(club)) {
      budget *= club.band === "豪门" ? 1.35 : 1.08;
    }
    if (club.leagueLevel >= 3) {
      budget *= 0.42;
    } else if (club.leagueLevel === 2) {
      budget *= 0.62;
    }
    return roundTransferAmount(budget);
  }

  function ensureCurrentEvent() {
    if (!state.currentEvent) {
      refreshContinentalQualificationFromCareer(
        state.player,
        getClubById(state.player.currentClubId)
      );
      var contextEvent = buildContextEvent(state.player);
      var contextEventIsPriority = contextEvent &&
        (contextEvent.id === "captain-appointment" ||
         contextEvent.id === "captain-crisis" ||
         contextEvent.id.indexOf("captain-scrutiny-") === 0 ||
         contextEvent.id === "outgrown-current-club" ||
         contextEvent.id === "late-career-coronation" ||
         contextEvent.id === "career-role-transition" ||
         contextEvent.id.indexOf("club-identity-") === 0 ||
         contextEvent.id === "champions-league-key-match" ||
         contextEvent.id === "champions-league-penalty-shootout");
      var selectedEvent = contextEvent && (contextEventIsPriority || Math.random() < 0.58)
        ? contextEvent
        : pickOne(getEligibleEvents(state.player));
      state.currentEvent = selectedEvent && selectedEvent.id === "big-match"
        ? buildSpecificBigMatchEvent(state.player, selectedEvent)
        : selectedEvent;
    }
  }

  function buildSpecificBigMatchEvent(player, baseEvent) {
    var club = getClubById(player.currentClubId);
    var derby = getRelevantDerby(club.id);
    var opponent = null;
    var matchName = "";

    if (derby && Math.random() < 0.58) {
      var rivalId = derby.clubs.find(function (clubId) {
        return clubId !== club.id;
      });
      opponent = getClubById(rivalId);
      matchName = derby.name;
    }
    if (!opponent) {
      opponent = pickLeagueOpponent(club);
      var strength = getClubStrength(club);
      if (club.region === "欧洲" && strength >= 84) {
        matchName = club.league + "争冠关键战";
      } else if (club.region === "欧洲" && strength >= 76) {
        matchName = club.league + "欧战资格关键战";
      } else if (strength <= 70) {
        matchName = club.league + "保级关键战";
      } else {
        matchName = club.league + "排名关键战";
      }
    }

    var fixture = getClubDisplayName(club) + " vs " + getClubDisplayName(opponent);
    return {
      id: baseEvent.id,
      title: matchName + "：" + fixture,
      text: "你将在 " + matchName + " 中代表 " + getClubDisplayName(club) + " 首发迎战 " +
        getClubDisplayName(opponent) + "。这场比赛可能直接影响球队的赛季目标和你在队内的定位。",
      matchLabel: matchName + "（" + fixture + "）",
      opponentClubId: opponent.id,
      options: baseEvent.options
    };
  }

  function getEligibleEvents(player) {
    var eventHistory = player.eventHistory || [];
    var recentEvents = eventHistory.slice(-3);
    var eligible = window.EVENTS.filter(function (event) {
      if (player.position === "GK" && event.id === "coach-role-shift") {
        return false;
      }
      if (event.id === "mentor") {
        return player.age <= 23;
      }
      if (event.id === "veteran-leader") {
        var lastVeteranSeason = (player.eventLastSeenSeason || {})[event.id] || 0;
        return player.age >= 25 &&
          (!lastVeteranSeason || player.seasonYear - lastVeteranSeason >= 6);
      }
      if (event.maxAge && player.age > event.maxAge) {
        return false;
      }
      if (event.minAge && player.age < event.minAge) {
        return false;
      }
      if (event.id === "fixture-congestion") {
        var lastSeenSeason = (player.eventLastSeenSeason || {})[event.id] || 0;
        var hasPlayedContinentalFootball = (player.career || []).some(function (season) {
          return Boolean(
            season.competitionStats &&
            season.competitionStats.continentalName
          );
        });
        var hasHeavyCalendar = Boolean(player.nextContinentalCompetition) ||
          getNationalCompetitionName(player.countryCode, player.seasonYear) !== "国家队比赛";
        return !lastSeenSeason &&
          !hasPlayedContinentalFootball &&
          hasHeavyCalendar &&
          Math.random() < 0.24;
      }
      return recentEvents.indexOf(event.id) === -1;
    });
    return eligible.length ? eligible : window.EVENTS;
  }

  function buildContextEvent(player) {
    var seasonTransitionEvent = buildSeasonTransitionEvent(player);
    if (seasonTransitionEvent) {
      return seasonTransitionEvent;
    }

    var majorFinalEvent = buildMajorFinalEvent(player);
    if (majorFinalEvent) {
      return majorFinalEvent;
    }

    var lateCareerCoronationEvent = buildLateCareerCoronationEvent(player);
    if (lateCareerCoronationEvent) {
      return lateCareerCoronationEvent;
    }

    var outgrownClubEvent = buildOutgrownCurrentClubEvent(player);
    if (outgrownClubEvent) {
      return outgrownClubEvent;
    }

    var roleTransitionEvent = buildCareerRoleTransitionEvent(player);
    if (roleTransitionEvent) {
      return roleTransitionEvent;
    }

    var nationalTournamentEvent = buildNationalTournamentEvent(player);
    if (nationalTournamentEvent && Math.random() < 0.48) {
      return nationalTournamentEvent;
    }

    var championsLeagueShootout = buildChampionsLeaguePenaltyShootoutEvent(player);
    if (championsLeagueShootout) {
      return championsLeagueShootout;
    }

    var championsLeagueKeyMatch = buildChampionsLeagueKeyMatchEvent(player);
    if (championsLeagueKeyMatch) {
      return championsLeagueKeyMatch;
    }

    var rivalTransferEvent = buildRivalTransferEvent(player);
    if (rivalTransferEvent) {
      return rivalTransferEvent;
    }

    var transferPressureEvent = buildTransferPressureEvent(player);
    if (transferPressureEvent) {
      return transferPressureEvent;
    }

    var captainEvent = buildCaptainEvent(player);
    if (captainEvent) {
      return captainEvent;
    }

    var clubIdentityEvent = buildClubIdentityEvent(player);
    if (clubIdentityEvent) {
      return clubIdentityEvent;
    }

    var loyaltyEvent = buildClubLoyaltyEvent(player);
    if (loyaltyEvent) {
      return loyaltyEvent;
    }

    var offFieldEvent = buildOffFieldPressureEvent(player);
    if (offFieldEvent) {
      return offFieldEvent;
    }

    var injuryEvent = buildUnexpectedInjuryEvent(player);
    if (injuryEvent) {
      return injuryEvent;
    }

    var positionEvent = buildPositionEvent(player);
    if (positionEvent && Math.random() > 0.78) {
      return positionEvent;
    }

    var club = getClubById(player.currentClubId);
    var derby = getRelevantDerby(club.id);

    if (derby && Math.random() > 0.55) {
      var rivalId = derby.clubs.find(function (clubId) {
        return clubId !== club.id;
      });
      var rivalClub = getClubById(rivalId);

      if (!rivalClub) {
        return null;
      }

      return {
        id: "derby-prep-" + derby.id,
        title: derby.name + " 即将到来",
        text: "你所在的 " + getClubDisplayName(club) + " 将在未来阶段迎来对 " + getClubDisplayName(rivalClub) + " 的焦点对决。球迷和媒体都在盯着这场比赛。",
        options: [
          { label: "主动扛起压力", description: "提前进入德比模式。", effects: { reputation: 6, coachRelation: 3, fitness: -4, happiness: 1 } },
          { label: "专注训练细节", description: "稳扎稳打，优先做足准备。", effects: { overall: 1, coachRelation: 4, fitness: -2 } },
          { label: "给媒体降温", description: "避免外界过度放大。", effects: { happiness: 2, reputation: 1, coachRelation: 1 } }
        ]
      };
    }

    return null;
  }

  function buildNationalTournamentEvent(player) {
    var competitionName = getNationalCompetitionName(player.countryCode, player.seasonYear);
    var estimatedCallupScore =
      player.overall * 0.45 +
      player.status.reputation * 0.4 +
      Math.max(0, player.age - 18) * 0.4;
    if (
      competitionName === "国家队比赛" ||
      player.age < 18 ||
      estimatedCallupScore < 50
    ) {
      return null;
    }
    var isWorldCup = competitionName === "世界杯";
    return {
      id: "national-tournament-" + player.seasonYear + "-" + competitionName,
      competitionName: competitionName,
      title: isWorldCup ? "世界杯预选赛进入决定阶段" : competitionName + "名单公布",
      text: isWorldCup
        ? "国家队正在争取世界杯正赛资格。教练组需要确定你在预选赛和可能到来的正赛中承担什么职责，这次选择会影响出线机会。"
        : "你进入了国家队的" + competitionName + "名单。教练组正在确定你在淘汰赛阶段的职责，这次选择会直接影响球队的比赛方式和晋级前景。",
      options: [
        { label: "承担国家队核心职责", effects: { reputation: 3, fitness: -5, happiness: 2 } },
        { label: "服从国家队整体战术", effects: { coachRelation: 2, fitness: -3, reputation: 1 } },
        { label: "担任改变比赛的后手", effects: { fitness: -1, happiness: 1, reputation: 1 } }
      ]
    };
  }

  function buildOutgrownCurrentClubEvent(player) {
    var club = getClubById(player.currentClubId);
    var strengthGap = player.overall - getClubStrength(club);
    var recentlyTransferred = player.lastTransfer &&
      player.lastTransfer.toClubId === club.id &&
      player.lastTransfer.seasonYear >= player.seasonYear - 1;
    if (
      player.age < 19 ||
      player.age > 30 ||
      club.band === "豪门" ||
      strengthGap < 8 ||
      recentlyTransferred ||
      player.pendingForcedDeparture ||
      Math.random() > clamp(0.48 + strengthGap * 0.035, 0.58, 0.88)
    ) {
      return null;
    }
    return {
      id: "outgrown-current-club",
      title: "你的水平已经超出球队现有平台",
      text: "你目前的能力明显高于 " + getClubDisplayName(club) +
        " 的阵容平均水平。经纪团队认为，现在是决定继续带领球队，还是主动追求更高舞台的时候。",
      options: [
        { label: "寻求更高舞台", effects: { transferInterest: 18, reputation: 2, coachRelation: -6, happiness: 3 } },
        { label: "继续带领球队前进", effects: { reputation: 3, coachRelation: 5, happiness: 2 } },
        { label: "再观察一个赛季", effects: { transferInterest: 4, coachRelation: 1 } }
      ]
    };
  }

  function buildCaptainEvent(player) {
    var club = getClubById(player.currentClubId);
    var seasonsAtClub = Math.max(0, player.age - (player.currentClubStartAge || player.age));
    var recentClubSeasons = (player.career || []).filter(function (season) {
      return season.clubId === club.id;
    }).slice(-4);
    var recentAppearances = recentClubSeasons.reduce(function (sum, season) {
      return sum + season.appearances;
    }, 0);
    var captainChance = clamp(
      0.34 +
      Math.max(0, seasonsAtClub - 2) * 0.1 +
      Math.max(0, player.status.reputation - 58) * 0.006 +
      Math.max(0, recentAppearances - 45) * 0.002,
      0.3,
      0.86
    );
    if (
      !player.isCaptain &&
      player.age >= 20 &&
      seasonsAtClub >= 2 &&
      player.status.reputation >= 52 &&
      player.status.coachRelation >= 52 &&
      player.overall >= getClubStrength(club) - 8 &&
      recentAppearances >= 36 &&
      Math.random() < captainChance
    ) {
      return {
        id: "captain-appointment",
        title: "俱乐部准备把队长袖标交给你",
        text: "教练组和更衣室投票都把你列在最前面。接受袖标后，关键失利、年轻球员成长和内部矛盾都会首先要求你回应。",
        options: [
          { label: "正式接过队长袖标", effects: { reputation: 4, coachRelation: 4, happiness: 2, fitness: -2 } },
          { label: "先担任副队长", effects: { reputation: 2, coachRelation: 3, happiness: 1 } },
          { label: "拒绝担任队长", effects: { happiness: 2, coachRelation: -2, reputation: -1 } }
        ]
      };
    }
    var lastCaptainScrutiny = player.lastCaptainScrutinySeason || 0;
    if (
      player.isCaptain &&
      (!lastCaptainScrutiny || player.seasonYear - lastCaptainScrutiny >= 5) &&
      Math.random() < 0.14
    ) {
      var scrutinyType = pickOne(["fans", "teammates", "media"]);
      if (scrutinyType === "fans") {
        return {
          id: "captain-scrutiny-fans",
          title: "球迷开始质疑队长袖标",
          text: "球队连续丢分后，看台上出现了针对你的嘘声。部分球迷认为你的表现和态度不足以代表俱乐部。",
          options: [
            { label: "赛后主动面对球迷", effects: { reputation: 3, happiness: -2, fitness: -2 } },
            { label: "用下一场表现回应", effects: { reputation: 2, fitness: -5, coachRelation: 1 } },
            { label: "拒绝回应看台压力", effects: { happiness: 2, reputation: -3 } }
          ]
        };
      }
      if (scrutinyType === "teammates") {
        return {
          id: "captain-scrutiny-teammates",
          title: "队友并不完全服从你的领导",
          text: "几名主力认为你在更衣室拥有过多话语权，训练中的分歧已经开始影响球队气氛。",
          options: [
            { label: "私下听取队友意见", effects: { happiness: 3, coachRelation: 2, reputation: -1 } },
            { label: "坚持队长应有标准", effects: { reputation: 2, coachRelation: 3, happiness: -3 } },
            { label: "让主教练出面处理", effects: { coachRelation: 4, reputation: -2, happiness: -1 } }
          ]
        };
      }
      return {
        id: "captain-scrutiny-media",
        title: "记者公开质疑你的领袖能力",
        text: "发布会上，记者连续追问你是否只在顺境中像一名队长，并把近期失利归因于球队缺少真正的领导者。",
        options: [
          { label: "公开承担全部责任", effects: { reputation: 3, happiness: -3, fitness: -2 } },
          { label: "强调责任属于全队", effects: { happiness: 2, reputation: -1, coachRelation: 1 } },
          { label: "直接反驳记者质疑", effects: { reputation: 2, coachRelation: -2, happiness: -1 } }
        ]
      };
    }
    return null;
  }

  function buildClubIdentityEvent(player) {
    var club = getClubById(player.currentClubId);
    var identity = CLUB_IDENTITY_EVENTS[club.id] || buildGenericClubIdentity(club);
    var yearsAtClub = Math.max(0, player.age - (player.currentClubStartAge || player.age));
    if (
      !identity ||
      (player.clubIdentityEventsSeen || []).length > 0 ||
      player.age < 20 ||
      yearsAtClub < 1 ||
      player.overall < getClubStrength(club) - 8 ||
      player.status.reputation < 48 ||
      Math.random() >= clamp(0.028 + yearsAtClub * 0.006, 0.035, 0.06)
    ) {
      return null;
    }
    return {
      id: "club-identity-" + club.id,
      title: identity.title,
      text: identity.text,
      options: [
        { label: identity.labels[0], effects: { reputation: 4, coachRelation: 3, fitness: -5 } },
        { label: identity.labels[1], effects: { coachRelation: 3, fitness: -2, happiness: 1 } },
        { label: identity.labels[2], effects: { happiness: 2, reputation: -1 } }
      ]
    };
  }

  function buildGenericClubIdentity(club) {
    if (!club || (club.band !== "豪门" && club.band !== "强队")) return null;
    var clubName = getClubDisplayName(club);
    if (club.league === "Bundesliga") {
      return {
        title: clubName + " 要求把高强度足球坚持到底",
        text: "俱乐部传统要求球队主动压迫、快速推进，并在争冠阶段承受更高的比赛强度。",
        labels: ["带动全队持续压迫", "控制体能分配", "坚持自己的比赛节奏"]
      };
    }
    if (club.league === "Serie A") {
      return {
        title: clubName + " 的战术纪律迎来关键考验",
        text: "教练组希望球队在重大比赛中保持结构，同时找到打破僵局的主动变化。",
        labels: ["承担战术核心职责", "优先稳住比赛结构", "要求增加进攻自由"]
      };
    }
    return {
      title: clubName + " 的豪门标准压向更衣室",
      text: "联赛与欧战目标同时进入关键阶段，俱乐部要求核心球员用表现回应长期形成的冠军标准。",
      labels: ["主动承担豪门责任", "用稳定表现回应", "拒绝额外制造压力"]
    };
  }

  function buildLateCareerCoronationEvent(player) {
    var club = getClubById(player.currentClubId);
    if (
      player.lateCareerCoronationSeen ||
      player.age < 32 ||
      player.age > 36 ||
      !club ||
      club.band !== "豪门" ||
      club.leagueLevel !== 1 ||
      player.overall < Math.max(82, getClubStrength(club) - 5) ||
      player.status.reputation < 80 ||
      Math.random() >= 0.035
    ) {
      return null;
    }
    return {
      id: "late-career-coronation",
      title: "暮年封王的最后冲刺",
      text: getClubDisplayName(club) + " 将争冠主动权交到你手中。外界认为这可能是你以核心身份赢得联赛的最后机会。",
      options: [
        { label: "接管争冠冲刺", effects: { reputation: 5, fitness: -6, happiness: 4 } },
        { label: "用经验稳定全队", effects: { coachRelation: 5, fitness: -3, reputation: 3 } },
        { label: "把最后一程交给团队", effects: { happiness: 3, coachRelation: 3, reputation: 2 } }
      ]
    };
  }

  function buildCareerRoleTransitionEvent(player) {
    var eligiblePositions = ["LW", "RW", "LM", "RM", "CAM", "ST"];
    if (
      eligiblePositions.indexOf(player.position) === -1 ||
      player.roleTransitionCompleted ||
      (player.roleTransitionAttempts || 0) >= 2 ||
      player.age < 27 ||
      player.age > 33 ||
      player.overall < 76 ||
      Math.random() >= 0.09
    ) {
      return null;
    }
    var options;
    if (["LW", "RW", "LM", "RM"].indexOf(player.position) !== -1) {
      options = [
        { label: "转型内切得分核心", targetPosition: "ST", transitionType: "scorer", effects: { fitness: -4, coachRelation: 2 } },
        { label: "转型前场组织核心", targetPosition: "CAM", transitionType: "creator", effects: { fitness: -3, coachRelation: 2 } },
        { label: "继续保持边路爆点", targetPosition: player.position, transitionType: "retain", effects: { fitness: -2, happiness: 1 } }
      ];
    } else if (player.position === "CAM") {
      options = [
        { label: "前移成为影锋", targetPosition: "ST", transitionType: "scorer", effects: { fitness: -4, coachRelation: 2 } },
        { label: "后撤成为组织核心", targetPosition: "CM", transitionType: "creator", effects: { fitness: -3, coachRelation: 3 } },
        { label: "继续担任自由前腰", targetPosition: "CAM", transitionType: "retain", effects: { fitness: -2, happiness: 1 } }
      ];
    } else {
      options = [
        { label: "回撤串联球队进攻", targetPosition: "CAM", transitionType: "creator", effects: { fitness: -3, coachRelation: 3 } },
        { label: "转为经验型禁区终结者", targetPosition: "ST", transitionType: "scorer", effects: { fitness: -3, coachRelation: 2 } },
        { label: "继续依靠速度冲击防线", targetPosition: "ST", transitionType: "retain", effects: { fitness: -4, happiness: 1 } }
      ];
    }
    return {
      id: "career-role-transition",
      title: "教练组提出生涯转型方案",
      text: "随着身体特点和比赛经验发生变化，教练组希望重新设计你的职责。成功转型可能延长巅峰，但改造也存在失败风险。",
      options: options
    };
  }

  function buildSeasonTransitionEvent(player) {
    var collapseArc = player.pendingCollapseArc;
    if (collapseArc && player.seasonYear >= collapseArc.nextSeasonYear) {
      player.pendingCollapseArc = null;
      player.pendingSeasonTransition = null;
      return {
        id: "catastrophic-defeat-aftermath-" + player.seasonYear,
        title: "欧冠惨案的余震仍未结束",
        text: "那场大比分失利已经过去数月，但更衣室、球迷和媒体仍在追问球队会就此沉沦，还是把耻辱变成反弹起点。",
        options: [
          { label: "推动全队彻底复盘", effects: { fitness: -3, coachRelation: 2 } },
          { label: "公开承担惨败责任", effects: { reputation: 1, happiness: -2 } },
          { label: "从身体和训练重建", effects: { fitness: 2, coachRelation: 1 } }
        ]
      };
    }
    var transition = player.pendingSeasonTransition;
    if (!transition) return null;
    player.pendingSeasonTransition = null;
    var club = getClubById(transition.clubId);
    if (!club || club.id !== player.currentClubId) return null;
    if (transition.type === "european-qualification") {
      var matchingEuropeanSeasons = (player.career || []).filter(function (season) {
        return season.clubId === club.id &&
          season.competitionStats &&
          season.competitionStats.continentalName === transition.competition;
      });
      var repeatedStableQualification =
        transition.previousCompetition === transition.competition ||
        matchingEuropeanSeasons.length >= 2;
      if (repeatedStableQualification) {
        return null;
      }
      var firstEuropeanCampaign = !transition.previousCompetition;
      var upgradedToChampionsLeague =
        transition.competition === "欧冠" && transition.previousCompetition &&
        transition.previousCompetition !== "欧冠";
      return {
        id: "season-transition-europe-" + player.seasonYear,
        title: firstEuropeanCampaign
          ? "首次进入欧洲赛场"
          : upgradedToChampionsLeague
            ? "欧战舞台升级为欧冠"
            : "欧战目标发生变化",
        text: getClubDisplayName(club) + " 获得了" + transition.competition + "资格。" +
          (firstEuropeanCampaign
            ? "这是你首次随队征战欧洲赛事。"
            : "相比上赛季，球队面对的欧战强度和目标都发生了变化。"),
        options: [
          { label: "主动承担双线重任", effects: { reputation: 2, fitness: -4, coachRelation: 2 } },
          { label: "接受合理轮换", effects: { fitness: 2, coachRelation: 2 } },
          { label: "优先保证联赛状态", effects: { fitness: 1, reputation: -1 } }
        ]
      };
    }
    if (transition.type === "promotion") {
      return {
        id: "season-transition-promotion-" + player.seasonYear,
        title: "升级后的第一个赛季",
        text: getClubDisplayName(club) + " 已从 " + getLeagueDisplayName(transition.previousLeague) +
          " 升入 " + getLeagueDisplayName(transition.nextLeague) +
          "。比赛强度、保级压力和阵容竞争都会明显提高。",
        options: [
          { label: "主动适应更高强度", effects: { fitness: -3, coachRelation: 3, reputation: 1 } },
          { label: "先确保稳定出场", effects: { happiness: 2, coachRelation: 1 } },
          { label: "把目标定在站稳脚跟", effects: { fitness: 1, happiness: 1 } }
        ]
      };
    }
    return {
      id: "season-transition-relegation-" + player.seasonYear,
      title: "降级后的重建抉择",
      text: getClubDisplayName(club) + " 已降入 " + getLeagueDisplayName(transition.nextLeague) +
        "。俱乐部希望尽快升级，但预算、阵容和更衣室都面临调整。",
      options: [
        { label: "留下帮助球队重返顶级联赛", effects: { reputation: 2, coachRelation: 4, happiness: 1 } },
        { label: "要求核心地位", effects: { reputation: 1, coachRelation: -2, happiness: 2 } },
        { label: "寻求离队", effects: { happiness: 2, coachRelation: -5, transferInterest: 8 } }
      ]
    };
  }

  function buildClubLoyaltyEvent(player) {
    var club = getClubById(player.currentClubId);
    var yearsAtClub = player.age - (player.currentClubStartAge || 16);
    var seen = player.loyaltyMilestonesSeen || [];
    var milestones = [16, 12, 10, 8, 5];
    var milestone = milestones.find(function (years) {
      return yearsAtClub >= years && seen.indexOf(years) === -1;
    });
    if (!milestone || Math.random() > 0.72) {
      return null;
    }

    var clubName = getClubDisplayName(club);
    var title;
    var text;
    var options;
    if (milestone >= 16) {
      title = "一人一城的生涯来到历史节点";
      text = "你已经连续为 " + clubName + " 效力 " + yearsAtClub +
        " 年。看台开始用传奇标准评价你，俱乐部也准备讨论退役前的最终角色。";
      options = [
        { label: "承诺在这里结束生涯", effects: { reputation: 6, coachRelation: 5, happiness: 6 } },
        { label: "继续一年一年决定", effects: { coachRelation: 2, happiness: 2 } },
        { label: "保留最后一次冒险", effects: { transferInterest: 8, happiness: 2, reputation: -1 } }
      ];
    } else if (milestone >= 12) {
      title = "俱乐部准备授予你功勋地位";
      text = "连续 " + yearsAtClub + " 年身披 " + clubName +
        " 球衣后，你已经成为更衣室历史的一部分。管理层希望确认你接下来承担的责任。";
      options = [
        { label: "接受功勋领袖职责", effects: { reputation: 5, coachRelation: 5, happiness: 3, fitness: -2 } },
        { label: "只专注自己的比赛", effects: { fitness: 2, coachRelation: -1 } },
        { label: "开始考虑新的生活", effects: { transferInterest: 7, happiness: 2 } }
      ];
    } else if (milestone >= 10) {
      title = "十年坚守写成一人一城";
      text = "你已经连续为 " + clubName + " 效力 " + yearsAtClub +
        " 年。十年间的出场和贡献让球迷开始把你的名字与这座城市绑定在一起。";
      options = [
        { label: "继续守护这座城市", effects: { reputation: 5, coachRelation: 4, happiness: 4 } },
        { label: "把忠诚留在球场上", effects: { coachRelation: 3, fitness: -2, reputation: 2 } },
        { label: "不排除未来新挑战", effects: { transferInterest: 6, happiness: 1, reputation: -2 } }
      ];
    } else if (milestone >= 8) {
      title = "队长袖标与长期责任摆在面前";
      text = "你已经在 " + clubName + " 度过 " + yearsAtClub +
        " 个赛季。队友熟悉你的习惯，球迷也期待你在困难时期站出来。";
      options = [
        { label: "主动承担队长责任", effects: { reputation: 4, coachRelation: 4, happiness: 1, fitness: -2 } },
        { label: "用场上表现带队", effects: { overall: 1, coachRelation: 2, fitness: -3 } },
        { label: "拒绝额外责任", effects: { happiness: 2, reputation: -2, coachRelation: -2 } }
      ];
    } else {
      title = "多年坚守让你成为熟悉的面孔";
      text = "这是你连续效力 " + clubName + " 的第 " + yearsAtClub +
        " 年。俱乐部准备公开确认你的长期价值，媒体也在询问你是否愿意继续留下。";
      options = [
        { label: "公开表达忠诚", effects: { reputation: 3, coachRelation: 3, happiness: 2 } },
        { label: "保持务实不作承诺", effects: { coachRelation: 1, happiness: 1 } },
        { label: "听取其他球队机会", effects: { transferInterest: 6, coachRelation: -2 } }
      ];
    }

    return {
      id: "club-loyalty-milestone",
      loyaltyMilestone: milestone,
      yearsAtClub: yearsAtClub,
      title: title,
      text: text,
      options: options
    };
  }

  function buildMajorFinalEvent(player) {
    var club = getClubById(player.currentClubId);
    var clubStrength = getClubStrength(club);
    var nationalStrength = getNationalTeamStrength(player.countryCode);

    if (
      isWorldCupYear(player.seasonYear) &&
      didCountryQualifyForWorldCup(player, null) &&
      player.overall >= 84 &&
      player.status.reputation >= 72 &&
      nationalStrength + Math.max(0, player.overall - 84) * 0.22 >= 84 &&
      Math.random() < 0.16
    ) {
      return {
        id: "world-cup-final-decision",
        title: "世界杯决赛前的最后决定",
        text: "国家队距离世界冠军只剩一场比赛。教练组准备根据你的选择调整决赛职责，但任何冒险都可能让球队以亚军结束征程。",
        options: [
          { label: "主动要求成为核心", description: "承担最多球权和关键回合，成功与失败都会被永久记住。", effects: { reputation: 3, fitness: -6, happiness: -2 } },
          { label: "严格执行决赛计划", description: "降低个人冒险，把胜负交给整体纪律。", effects: { coachRelation: 3, fitness: -4 } },
          { label: "保留体力等待决胜时刻", description: "前段减少消耗，争取在比赛末段改变结果。", effects: { fitness: -2, reputation: -1 } }
        ]
      };
    }

    if (
      club.region === "欧洲" &&
      club.leagueLevel === 1 &&
      player.nextContinentalCompetition === "欧冠" &&
      clubStrength >= 89 &&
      player.overall >= clubStrength - 7 &&
      player.overall >= 82 &&
      player.status.reputation >= 66 &&
      Math.random() < 0.11
    ) {
      var finalOpponent = pickEuropeanOpponent(club.id, 86);
      return {
        id: "champions-league-final-decision",
        title: "欧冠决赛进入最后备战",
        opponentClubId: finalOpponent && finalOpponent.id,
        text: getClubDisplayName(club) + " 已经闯入欧冠决赛，对手是 " + getClubDisplayName(finalOpponent) + "。教练组把一项可能改变冠军归属的任务交给你，执行成功才能举起大耳朵杯。",
        options: [
          { label: "主动接管关键回合", description: "用个人能力冲击比赛，但失误会直接暴露在最高舞台。", effects: { reputation: 3, fitness: -5, happiness: -1 } },
          { label: "完全服从战术安排", description: "依靠整体体系争胜，个人表现不会是唯一重点。", effects: { coachRelation: 4, fitness: -3 } },
          { label: "申请担任替补奇兵", description: "等待体能下降后的决胜窗口，也可能等不到机会。", effects: { reputation: -1, fitness: -1, happiness: 1 } }
        ]
      };
    }

    return null;
  }

  function buildChampionsLeagueKeyMatchEvent(player) {
    var club = getClubById(player.currentClubId);
    var clubStrength = getClubStrength(club);
    if (
      club.region !== "欧洲" ||
      club.leagueLevel !== 1 ||
      player.nextContinentalCompetition !== "欧冠" ||
      clubStrength < 85 ||
      player.overall < clubStrength - 8 ||
      player.status.reputation < 58 ||
      Math.random() >= 0.26
    ) {
      return null;
    }

    var opponent = pickEuropeanOpponent(club.id, 82);
    if (!opponent) return null;
    var stage = Math.random() < 0.42 ? "欧冠八强战" : "欧冠半决赛";
    return {
      id: "champions-league-key-match",
      title: stage + "迎来强敌",
      opponentClubId: opponent.id,
      stage: stage,
      text: getClubDisplayName(club) + " 将在 " + stage + " 对阵 " + getClubDisplayName(opponent) + "。这场比赛可能决定整个欧冠赛季，教练组需要你选择比赛方式。",
      options: [
        { label: "持续冲击对手禁区", description: "制造更多混乱和判罚机会，但也可能引发争议。", effects: { fitness: -5, reputation: 2 } },
        { label: "耐心控制比赛节奏", description: "减少失误，等待真正有把握的进攻窗口。", effects: { coachRelation: 3, fitness: -3 } },
        { label: "收缩阵型伺机反击", description: "主动让出球权，把胜负押在少数反击机会上。", effects: { coachRelation: 1, reputation: -1, fitness: -2 } }
      ]
    };
  }

  function buildChampionsLeaguePenaltyShootoutEvent(player) {
    var club = getClubById(player.currentClubId);
    var clubStrength = getClubStrength(club);
    if (
      club.region !== "欧洲" ||
      club.leagueLevel !== 1 ||
      player.nextContinentalCompetition !== "欧冠" ||
      clubStrength < 82 ||
      player.overall < clubStrength - 9 ||
      player.status.reputation < 52 ||
      Math.random() >= 0.22
    ) {
      return null;
    }
    var opponent = pickEuropeanOpponent(club.id, 82);
    if (!opponent) return null;
    var stage = Math.random() < 0.58 ? "十六强" : "八强";
    return {
      id: "champions-league-penalty-shootout",
      title: "欧冠" + stage + "进入决胜点球大战",
      stage: stage,
      opponentClubId: opponent.id,
      text: getClubDisplayName(club) + " 与 " + getClubDisplayName(opponent) +
        " 在两回合后仍未分胜负。点球大战即将开始，你的选择可能直接决定谁能晋级。",
      options: player.position === "GK"
        ? [
            { label: "提前研究主罚方向", effects: { coachRelation: 2, fitness: -2 } },
            { label: "延迟移动等待出脚", effects: { reputation: 1, fitness: -3 } },
            { label: "依靠直觉主动出击", effects: { reputation: 2, happiness: -1 } }
          ]
        : [
            { label: "主动主罚第一点", effects: { reputation: 2, fitness: -2 } },
            { label: "要求主罚第五点", effects: { reputation: 3, happiness: -2 } },
            { label: "不主动进入前五顺位", effects: { reputation: -2, happiness: 1 } }
          ]
    };
  }

  function pickEuropeanOpponent(excludedClubId, minimumStrength, additionalExcludedIds) {
    var excludedIds = [excludedClubId].concat(additionalExcludedIds || []);
    var playerClub = getClubById(excludedClubId);
    var alreadyFacedSameAssociation = (additionalExcludedIds || []).some(function (clubId) {
      var facedClub = getClubById(clubId);
      return playerClub && facedClub && facedClub.country === playerClub.country;
    });
    var candidates = window.CLUBS.filter(function (club) {
      return excludedIds.indexOf(club.id) === -1 &&
        club.region === "欧洲" &&
        club.leagueLevel === 1 &&
        (!playerClub || club.country !== playerClub.country || !alreadyFacedSameAssociation) &&
        getClubStrength(club) >= minimumStrength;
    });
    return candidates.length ? pickOne(candidates) : null;
  }

  function pickLeagueOpponent(club) {
    var candidates = window.CLUBS.filter(function (candidate) {
      return candidate.id !== club.id && candidate.league === club.league;
    });
    return candidates.length ? pickOne(candidates) : club;
  }

  function getNationalTeamStrength(countryCode) {
    var strengths = {
      BR: 92,
      AR: 92,
      FR: 92,
      DE: 89,
      ES: 91,
      "GB-ENG": 90,
      PT: 88,
      NL: 88,
      JP: 81,
      KR: 80,
      US: 79,
      CN: 68
    };
    return strengths[countryCode] || 76;
  }

  function getWorldCupCountryProfile(countryCode) {
    var profiles = {
      BR: { qualify: 0.995, expectation: 4, identity: "五星巴西", history: "五次夺冠且从未缺席世界杯" },
      AR: { qualify: 0.98, expectation: 4, identity: "卫冕传统强国", history: "三次夺冠，淘汰赛表现决定评价" },
      FR: { qualify: 0.96, expectation: 4, identity: "争冠热门", history: "近代多次进入决赛，阵容目标始终是冠军" },
      DE: { qualify: 0.95, expectation: 3, identity: "四星德国", history: "四次夺冠，但近届小组赛表现提高了复兴压力" },
      ES: { qualify: 0.95, expectation: 3, identity: "技术流强国", history: "拥有冠军历史，至少进入淘汰赛才算交代" },
      "GB-ENG": { qualify: 0.94, expectation: 3, identity: "英格兰黄金阵容", history: "长期承受大赛争冠期待" },
      PT: { qualify: 0.9, expectation: 2, identity: "欧洲劲旅", history: "具备冲击四强的实力，但世界杯尚未夺冠" },
      NL: { qualify: 0.88, expectation: 2, identity: "无冕强队", history: "三次世界杯亚军让深度淘汰赛成为评价标准" },
      JP: { qualify: 0.94, expectation: 1, identity: "亚洲稳定力量", history: "多次进入十六强，目标是首次突破八强门槛" },
      KR: { qualify: 0.92, expectation: 1, identity: "亚洲大赛常客", history: "2002 年四强是历史高点，稳定出线仍有分量" },
      US: { qualify: 0.82, expectation: 1, identity: "北美重要力量", history: "出线是基本目标，进入八强会显著提升评价" },
      CN: { qualify: 0.16, expectation: 0, identity: "冲击世界杯的挑战者", history: "仅在 2002 年进入过世界杯正赛" }
    };
    return profiles[countryCode] || {
      qualify: 0.42,
      expectation: 0,
      identity: "世界杯挑战者",
      history: "进入正赛本身就是重要突破"
    };
  }

  function didCountryQualifyForWorldCup(player, tournamentPlan) {
    player.worldCupQualificationByYear = player.worldCupQualificationByYear || {};
    if (typeof player.worldCupQualificationByYear[player.seasonYear] === "boolean") {
      return player.worldCupQualificationByYear[player.seasonYear];
    }
    var confirmed2026Qualifiers = [
      "JP", "KR", "BR", "AR", "FR", "DE", "ES", "GB-ENG", "PT", "NL", "US"
    ];
    if (player.seasonYear === 2026) {
      player.worldCupQualificationByYear[player.seasonYear] =
        confirmed2026Qualifiers.indexOf(player.countryCode) !== -1;
      return player.worldCupQualificationByYear[player.seasonYear];
    }
    var profile = getWorldCupCountryProfile(player.countryCode);
    var playerLift =
      Math.max(0, player.overall - getNationalTeamStrength(player.countryCode)) * 0.006 +
      Math.max(0, player.status.reputation - 65) * 0.0015 +
      (tournamentPlan ? Math.max(-0.04, tournamentPlan.bonus * 0.008) : 0);
    player.worldCupQualificationByYear[player.seasonYear] =
      Math.random() < clamp(profile.qualify + playerLift, 0.06, 0.995);
    return player.worldCupQualificationByYear[player.seasonYear];
  }

  function buildWorldCupCountryComment(player, stage, qualified) {
    var profile = getWorldCupCountryProfile(player.countryCode);
    var countryName = getCountryByCode(player.countryCode).name;
    if (!qualified) {
      if (profile.expectation >= 3) {
        return countryName + " 意外止步世界杯预选赛。对于" + profile.identity +
          "而言，这是足以引发全面反思的失败。";
      }
      if (profile.expectation >= 1) {
        return countryName + " 未能通过世界杯预选赛，错过了原本有机会争取的正赛席位。";
      }
      return countryName + " 再次止步世界杯预选赛。球队仍未完成重返正赛的长期目标。";
    }
    var stageValues = { "小组赛出局": 0, "十六强": 1, "八强": 2, "四强": 3, "亚军": 4, "冠军": 5 };
    var achieved = stageValues[stage] || 0;
    var expectation = profile.expectation;
    if (stage === "冠军") {
      return countryName + " 赢得世界杯冠军。" + profile.history + "，这次登顶仍将被写入国家足球史。";
    }
    if (achieved >= expectation + 2) {
      return countryName + " 在世界杯闯入" + stage + "，远超赛前预期，创造了国家队历史级突破。";
    }
    if (achieved >= expectation) {
      return countryName + " 在世界杯止步" + stage + "，整体达到这支球队基于历史与实力形成的赛事预期。";
    }
    if (profile.expectation >= 3) {
      return countryName + " 在世界杯止步" + stage + "。对于" + profile.identity +
        "而言，这样的结果明显低于争冠期待。";
    }
    return countryName + " 在世界杯止步" + stage + "，未能达到赛前设定的突破目标。";
  }

  function buildRivalTransferEvent(player) {
    var transfer = player.lastTransfer;
    if (
      !transfer ||
      transfer.rivalryEventSeen ||
      !transfer.rivalryId ||
      transfer.toClubId !== player.currentClubId ||
      transfer.seasonYear !== player.seasonYear
    ) {
      return null;
    }

    transfer.rivalryEventSeen = true;
    transfer.pressureEventSeen = true;
    var fromClub = getClubById(transfer.fromClubId);
    var toClub = getClubById(transfer.toClubId);
    var rivalry = (window.DERBIES || []).find(function (item) {
      return item.id === transfer.rivalryId;
    });
    if (!fromClub || !toClub || !rivalry) {
      return null;
    }

    return {
      id: "rival-transfer-backlash",
      title: "转投死敌引爆舆论",
      text: "你从 " + getClubDisplayName(fromClub) + " 转投 " + getClubDisplayName(toClub) + "。这笔跨越“" + rivalry.name + "”界线的交易引发巨大争议，老东家球迷指责你背叛，新俱乐部球迷也要求你立刻证明忠诚。",
      options: [
        { label: "解释这是职业决定", description: "尝试安抚老东家球迷，但双方未必接受。", effects: { reputation: -2, happiness: -2, coachRelation: 1 } },
        { label: "用德比表现回应", description: "把所有压力押在下一场直接对话上。", effects: { reputation: 2, fitness: -4, happiness: -2 } },
        { label: "保持沉默专注训练", description: "不参与口水战，但舆论会自行发酵。", effects: { reputation: -3, coachRelation: 2, happiness: 1 } }
      ]
    };
  }

  function buildTransferPressureEvent(player) {
    var transfer = player.lastTransfer;
    if (!transfer || transfer.pressureEventSeen || transfer.toClubId !== player.currentClubId || transfer.seasonYear !== player.seasonYear) {
      return null;
    }

    transfer.pressureEventSeen = true;
    var feeRatio = transfer.fee / Math.max(1, transfer.valueAtTransfer);
    var highPressure = feeRatio >= 1.45 || transfer.fee >= 50000000;
    var eventChance = highPressure ? 0.72 : 0.28;
    if (Math.random() > eventChance) {
      return null;
    }

    return {
      id: "transfer-fee-pressure",
      title: highPressure ? "高额转会费带来巨大压力" : "新援需要证明自己的价值",
      text: getClubDisplayName(getClubById(transfer.toClubId)) + " 为你支付了 " + formatMoney(transfer.fee) + "。媒体把每一次失误都和这笔费用联系起来，俱乐部也希望尽快看到回报。",
      options: [
        { label: "主动承担核心责任", description: "成功会迅速站稳脚跟，失败则会放大质疑。", effects: { reputation: 4, coachRelation: 3, fitness: -4, happiness: -2 } },
        { label: "先适应新的环境", description: "降低短期压力，但需要接受轮换。", effects: { coachRelation: 2, reputation: -1, happiness: 1 } },
        { label: "公开反击转会费质疑", description: "维护自信，也可能激化舆论。", effects: { reputation: 2, coachRelation: -3, happiness: -1 } }
      ]
    };
  }

  function buildOffFieldPressureEvent(player) {
    var eventChance = 0.14 +
      (player.status.happiness < 50 ? 0.05 : 0) +
      (player.status.coachRelation < 48 ? 0.04 : 0) +
      (player.status.reputation >= 82 ? 0.025 : 0);
    if (Math.random() >= eventChance) {
      return null;
    }

    var lastSeen = player.eventLastSeenSeason || {};
    var candidates = [
      {
        id: "dressing-room-friction",
        title: "更衣室矛盾逐渐公开",
        text: "连续几场比赛的分工争议让队内气氛变得紧张，有队友认为你获得了过多球权和关注，教练组要求尽快平息分歧。",
        options: [
          { label: "私下与队友沟通", effects: { happiness: 2, coachRelation: 2, reputation: -1, fitness: -1 } },
          { label: "公开维护自己的位置", effects: { reputation: 2, happiness: -3, coachRelation: -2 } },
          { label: "主动让出部分职责", effects: { happiness: 3, coachRelation: 3, reputation: -2 } }
        ]
      },
      {
        id: "media-pressure-cycle",
        title: "舆论风向突然转冷",
        text: "媒体连续放大你的失误，社交平台上的讨论也开始影响训练氛围。一次不恰当的回应可能让风波继续升级。",
        options: [
          { label: "接受采访正面回应", effects: { reputation: 3, happiness: -2, fitness: -2 } },
          { label: "暂停发声专注比赛", effects: { coachRelation: 2, happiness: 1, reputation: -1 } },
          { label: "用公开训练回应质疑", effects: { reputation: 2, coachRelation: 2, fitness: -5 } }
        ]
      },
      {
        id: "transfer-rumor-storm",
        title: "转会绯闻扰乱赛季节奏",
        text: "多家媒体把你与其他俱乐部联系起来，传闻尚未得到证实，却已经让球迷、队友和管理层开始猜测你的未来。",
        options: [
          { label: "公开承诺留队", effects: { reputation: 2, happiness: 1, coachRelation: 3, transferInterest: -4 } },
          { label: "保留未来可能性", effects: { transferInterest: 7, reputation: 1, coachRelation: -3, happiness: -1 } },
          { label: "交给经纪团队处理", effects: { transferInterest: 3, happiness: 2, reputation: -2, coachRelation: -1 } }
        ]
      }
    ].filter(function (event) {
      return !lastSeen[event.id] || player.seasonYear - lastSeen[event.id] >= 4;
    });

    return candidates.length ? pickOne(candidates) : null;
  }

  function buildUnexpectedInjuryEvent(player) {
    var workloadRisk = player.status.fitness < 65 ? 0.08 : player.status.fitness < 78 ? 0.035 : 0;
    var ageRisk = player.age >= 31 ? 0.035 : player.age >= 28 ? 0.015 : 0;
    var injuryChance = 0.035 + workloadRisk + ageRisk;
    if (Math.random() > injuryChance) {
      return null;
    }

    var severe = Math.random() < 0.22;

    return {
      id: severe ? "unexpected-major-injury" : "unexpected-injury",
      title: severe ? "意外重伤打乱赛季计划" : "突发伤病迫使你停下来",
      text: severe
        ? "一次并不激烈的对抗中，你意外遭遇严重伤情。队医认为仓促复出可能留下长期隐患。"
        : "你在训练或比赛中突然感到不适，检查结果意味着必须重新安排接下来的训练和出场负荷。",
      options: [
        { label: "完整接受康复治疗", description: "缺席时间更长，但能降低后遗症风险。", effects: { fitness: severe ? -22 : -12, overall: severe ? -1 : 0, happiness: -3, coachRelation: 2 } },
        { label: "缩短恢复期提前复出", description: "可能赶上关键比赛，也可能伤情反复。", effects: { fitness: severe ? -30 : -18, reputation: 2, coachRelation: 1, happiness: -2 } },
        { label: "调整踢法保护身体", description: "减少消耗，但短期表现上限会下降。", effects: { fitness: severe ? -16 : -8, overall: -1, happiness: 1 } }
      ]
    };
  }

  function buildTransferSeasonNote(player, club) {
    if (player.pendingTransferCollapse) {
      return player.pendingTransferCollapse;
    }
    var transfer = player.lastTransfer;
    if (!transfer || transfer.toClubId !== club.id || transfer.seasonYear !== player.seasonYear) {
      return "";
    }
    var rivalry = transfer.rivalryId && (window.DERBIES || []).find(function (item) {
      return item.id === transfer.rivalryId;
    });
    if (rivalry) {
      return "赛季背景：你跨越 " + rivalry.name + " 的对立阵营加盟 " + getClubDisplayName(club) + "，这次转会让每场表现都承受额外审视。";
    }
    return "赛季背景：" + getClubDisplayName(club) + " 以 " + formatMoney(transfer.fee) + " 签下了你，这笔投入也提高了外界对你首个赛季的要求。";
  }

  function buildPositionEvent(player) {
    if (player.age >= 28) {
      return null;
    }
    return buildArchetypeTrainingEvent(player);
  }

  function getPositionArchetypes(position) {
    if (position === "GK") {
      return [
        { name: "门线扑救型", skills: ["defending", "reflexes"], text: "依靠反应、站位和近距离扑救保护球门。" },
        { name: "门卫型门将", skills: ["offBall", "pace", "workRate"], text: "站位更靠前，主动控制高位防线身后的空间。" },
        { name: "出球型门将", skills: ["passing", "vision", "workRate"], text: "参与后场组织，用短传和长传破解逼抢。" },
        { name: "高空控制型门将", skills: ["aerial", "strength", "reflexes"], text: "主动处理传中和高球，依靠覆盖范围控制禁区。" }
      ];
    }
    if (position === "CB") {
      return [
        { name: "制空中卫", skills: ["defending", "aerial", "strength"], text: "重视对抗、头球和禁区保护。" },
        { name: "出球中卫", skills: ["passing", "vision", "dribbling"], text: "承担带球推进和穿透防线的向前传球。" },
        { name: "上抢中卫", skills: ["defending", "offBall", "pace"], text: "提前预判并主动离开防线完成拦截。" },
        { name: "拖后保护型", skills: ["offBall", "pace", "defending"], text: "控制身后空间，为主动上抢的队友补位。" }
      ];
    }
    if (position === "LB" || position === "RB") {
      return [
        { name: "防守边卫", skills: ["defending", "pace", "workRate"], text: "优先限制边锋并保护防线外侧。" },
        { name: "进攻翼卫", skills: ["pace", "workRate", "passing"], text: "通过套边、下底和传中持续提供宽度。" },
        { name: "内收边卫", skills: ["passing", "vision", "offBall"], text: "持球时进入中场，帮助球队建立人数优势。" },
        { name: "边路推进型", skills: ["dribbling", "pace", "workRate"], text: "依靠带球和连续前插推进进攻。" }
      ];
    }
    if (position === "CM") {
      return [
        { name: "防守型六号位", skills: ["defending", "offBall", "strength"], text: "保护中路、封锁传球路线并维持阵型。" },
        { name: "拖后组织核心", skills: ["passing", "vision", "offBall"], text: "在较深位置控制节奏并完成长短传调度。" },
        { name: "全能八号位", skills: ["workRate", "passing", "defending"], text: "覆盖两个禁区，同时参与进攻和防守。" },
        { name: "前场组织核心", skills: ["passing", "vision", "dribbling"], text: "在防线之间接球，为队友创造最后一传。" }
      ];
    }
    if (position === "CAM") {
      return [
        { name: "古典前腰", skills: ["passing", "vision", "dribbling"], text: "在前场自由区域接球，用最后一传控制进攻。" },
        { name: "影子前锋", skills: ["offBall", "finishing", "dribbling"], text: "从中场后插上进入禁区，直接完成终结。" },
        { name: "持球核心", skills: ["dribbling", "passing", "workRate"], text: "频繁持球推进，吸引防守后制造机会。" },
        { name: "压迫型前腰", skills: ["workRate", "offBall", "strength"], text: "从前场发起逼抢，同时承担连接与冲击职责。" }
      ];
    }
    if (position === "LM" || position === "RM" || position === "LW" || position === "RW") {
      return [
        { name: "爆点边锋", skills: ["dribbling", "pace", "workRate"], text: "利用一对一突破制造局部优势。" },
        { name: "内切得分手", skills: ["dribbling", "finishing", "offBall"], text: "从边路进入禁区，直接攻击球门。" },
        { name: "传中型边锋", skills: ["passing", "vision", "workRate"], text: "保持宽度，通过传中和倒三角创造机会。" },
        { name: "无球冲刺型", skills: ["offBall", "pace", "finishing"], text: "攻击边后卫身后并在弱侧包抄终结。" }
      ];
    }
    return [
      { name: "禁区终结者", skills: ["finishing", "offBall", "reflexes"], text: "减少无效触球，专注抢点和快速终结。" },
      { name: "支点中锋", skills: ["strength", "aerial", "passing"], text: "背身护球、争抢高球并为队友做球。" },
      { name: "反越位前锋", skills: ["offBall", "pace", "finishing"], text: "观察防线移动，用启动时机攻击身后。" },
      { name: "回撤组织型前锋", skills: ["passing", "vision", "dribbling"], text: "离开禁区接应，带动边锋插入中路。" },
      { name: "全能前锋", skills: ["finishing", "strength", "workRate"], text: "兼顾对抗、压迫、做球和终结。" }
    ];
  }

  function buildArchetypeTrainingEvent(player) {
    var archetypes = getPositionArchetypes(player.position);
    var currentStyle = getPrimaryArchetype(player);
    var trainingTargets = archetypes.filter(function (archetype) {
      return archetype.name !== currentStyle.name;
    });
    var selected = trainingTargets.sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 2);

    return {
      id: "archetype-training",
      title: "教练组希望你开发新的比赛特点",
      text: "你目前更接近“" + currentStyle.name + "”。教练组认为球队体系需要你增加其他职责，但专项改造并不保证成功。",
      options: [
        { label: "训练" + selected[0].name, description: selected[0].text, targetArchetype: selected[0], effects: { fitness: -4, coachRelation: 3 } },
        { label: "训练" + selected[1].name, description: selected[1].text, targetArchetype: selected[1], effects: { fitness: -4, coachRelation: 3 } },
        { label: "强化现有特点", description: "继续打磨“" + currentStyle.name + "”，成长更稳但比赛方式不会明显改变。", targetArchetype: currentStyle, reinforce: true, effects: { fitness: -2, coachRelation: 1 } }
      ]
    };
  }

  function getArchetypeScore(player, archetype) {
    var profile = player.profile || {};
    var score = averageSkills(archetype.skills.map(function (skill) {
      return profile[skill] || 50;
    }));
    var footRole = getFootednessRole(player);
    if (footRole === "inverted-wide" && archetype.name === "内切得分手") score += 6;
    if (footRole === "natural-wide" && archetype.name === "传中型边锋") score += 6;
    if (footRole === "inverted-fullback" && archetype.name === "内收边卫") score += 5;
    if (footRole === "natural-fullback" && archetype.name === "进攻翼卫") score += 5;
    if (player.position === "CB" && player.dominantFoot === "左脚" && archetype.name === "出球中卫") score += 3;
    return score;
  }

  function getFootednessRole(player) {
    var position = player.position;
    var isLeftPosition = position === "LW" || position === "LM" || position === "LB";
    var isRightPosition = position === "RW" || position === "RM" || position === "RB";
    if (!isLeftPosition && !isRightPosition) return "central";
    var naturalSide =
      (isLeftPosition && player.dominantFoot === "左脚") ||
      (isRightPosition && player.dominantFoot === "右脚");
    if (position === "LB" || position === "RB") {
      return naturalSide ? "natural-fullback" : "inverted-fullback";
    }
    return naturalSide ? "natural-wide" : "inverted-wide";
  }

  function getPrimaryArchetype(player) {
    return getPositionArchetypes(player.position).sort(function (a, b) {
      return getArchetypeScore(player, b) - getArchetypeScore(player, a);
    })[0];
  }

  function buildLegacyPositionEvent(player) {
    var group = getPositionGroup(player.position);

    if (group === "GK") {
      return {
        id: "position-gk-command",
        title: "防线需要你的指挥",
        text: "教练组希望你更多参与出球和禁区指挥，这会直接影响你在门将位置上的定位。",
        options: [
          { label: "主动扩大活动范围", description: "有机会提升门前存在感，也可能出错。", effects: { coachRelation: 5, reputation: 3, fitness: -2 } },
          { label: "先稳住基本功", description: "保守但更稳。", effects: { overall: 1, happiness: 1 } },
          { label: "坚持传统门线风格", description: "减少冒险，但上限会受影响。", effects: { coachRelation: -4, happiness: 1 } }
        ]
      };
    }

    if (group === "DEF") {
      return {
        id: "position-def-line",
        title: "防线要不要整体前压",
        text: "球队想把后防线提得更高，你的回追、对抗和预判会被频繁放大。",
        options: [
          { label: "主动顶上去", description: "适合吃高压体系红利。", effects: { reputation: 4, coachRelation: 5, fitness: -3 } },
          { label: "维持平衡站位", description: "先求少犯错。", effects: { overall: 1, happiness: 1 } },
          { label: "建议回收防线", description: "也许更适合你，但教练未必喜欢。", effects: { coachRelation: -5, happiness: 1 } }
        ]
      };
    }

    if (group === "MID") {
      return {
        id: "position-mid-tempo",
        title: "中场节奏准备交给你",
        text: "比赛开始更多从你脚下组织，失误和调度质量都会比以往更受关注。",
        options: [
          { label: "主动要球控节奏", description: "踢好了会很涨身价。", effects: { reputation: 4, coachRelation: 4, fitness: -2 } },
          { label: "逐步接管比赛", description: "稳住节奏，少冒风险。", effects: { overall: 1, happiness: 1 } },
          { label: "减少持球风险", description: "降低失误，但存在感会下降。", effects: { coachRelation: -3, reputation: -1, happiness: 1 } }
        ]
      };
    }

    if (group === "WIDE") {
      return {
        id: "position-wide-isolation",
        title: "边路要你一对一爆点",
        text: "球队希望你在边路更多单挑制造突破口，这种踢法会把你的特点与短板都放大。",
        options: [
          { label: "主动多打单挑", description: "突破成功会迅速涨势。", effects: { reputation: 5, happiness: 1, fitness: -3 } },
          { label: "传跑结合为主", description: "比较均衡。", effects: { overall: 1, coachRelation: 2 } },
          { label: "减少冒险突破", description: "失误会少，但威胁感可能下降。", effects: { coachRelation: -2, reputation: -1, happiness: 1 } }
        ]
      };
    }

    return {
      id: "position-st-box",
      title: "禁区终结压力来到你身上",
      text: "教练要求你更多留在危险区域完成最后一击，跑位和终结会决定你能否稳住主力位置。",
      options: [
        { label: "主动抢点吃饼", description: "适合门前嗅觉强的前锋。", effects: { reputation: 5, coachRelation: 4, fitness: -2 } },
        { label: "兼顾回撤做球", description: "更全面，但会分散火力。", effects: { overall: 1, happiness: 1 } },
        { label: "继续自由活动", description: "保持习惯，但教练可能不满意。", effects: { coachRelation: -4, happiness: 1 } }
      ]
    };
  }

  function calculatePlayingChance(player, club) {
    var abilityDifference = player.overall - getClubStrength(club);
    var statusImpact = getAdaptiveStatusImpact(player);
    var footRole = getFootednessRole(player);
    var chance = 0.48 + abilityDifference * 0.022 +
      player.status.coachRelation * 0.0015 +
      player.status.fitness * 0.001 +
      statusImpact.playingChance;
    if (footRole === "natural-wide" || footRole === "natural-fullback") {
      chance += 0.018;
    } else if (
      footRole === "inverted-wide" &&
      ["内切得分手", "持球核心"].indexOf(getPrimaryArchetype(player).name) !== -1
    ) {
      chance += 0.015;
    } else if (
      footRole === "inverted-fullback" &&
      getPrimaryArchetype(player).name !== "内收边卫"
    ) {
      chance -= 0.022;
    }
    if (player.age <= 20) {
      chance += club.youthChance * 0.001;
    }
    if (player.isCaptain) {
      chance += 0.05;
    }
    if (isBelowEliteStarterStandard(player, club)) {
      chance = Math.min(chance, player.overall >= 80 ? 0.3 : 0.24);
    }
    return clamp(chance, 0.08, 0.95);
  }

  function isBelowEliteStarterStandard(player, club) {
    return player.age >= 25 &&
      player.overall < 83 &&
      club.band === "豪门" &&
      isBigFiveTopFlight(club);
  }

  function getClubTacticalStyle(club) {
    if (!club) {
      return { name: "均衡推进", chances: 1, press: 1, setPieces: 1, fullbackAssists: 1, forwardAssists: 1 };
    }
    if (CLUB_STYLE_OVERRIDES[club.id]) {
      return CLUB_STYLE_OVERRIDES[club.id];
    }

    var selector = club.id.split("").reduce(function (total, character) {
      return total + character.charCodeAt(0);
    }, 0) % 5;
    var styles = [
      { name: "稳守反击", chances: 0.92, press: 0.94, setPieces: 1.15, fullbackAssists: 0.94, forwardAssists: 0.92 },
      { name: "边路推进 / 传中", chances: 1.02, press: 1, setPieces: 1.08, fullbackAssists: 1.24, forwardAssists: 0.96 },
      { name: "控球组织 / 短传渗透", chances: 1.06, press: 1.04, setPieces: 0.94, fullbackAssists: 1.06, forwardAssists: 1.2 },
      { name: "高位压迫 / 快速转换", chances: 1.08, press: 1.12, setPieces: 1, fullbackAssists: 1.08, forwardAssists: 1.04 },
      { name: "身体对抗 / 定位球", chances: 0.97, press: 1.02, setPieces: 1.28, fullbackAssists: 1, forwardAssists: 0.94 }
    ];
    var style = Object.assign({}, styles[selector]);
    var strengthFactor = clamp((getClubStrength(club) - 72) / 100, -0.08, 0.12);
    style.chances = clamp(style.chances + strengthFactor, 0.82, 1.2);
    return style;
  }

  function samplePoisson(lambda) {
    lambda = Math.max(0, lambda);
    if (lambda > 18) {
      return samplePoisson(lambda / 2) + samplePoisson(lambda / 2);
    }
    var limit = Math.exp(-lambda);
    var product = 1;
    var count = 0;
    do {
      count += 1;
      product *= Math.random();
    } while (product > limit);
    return count - 1;
  }

  function simulateCompetitionAppearances(player, club, playingChance) {
    var clubStrength = getClubStrength(club);
    var competitionImpact = player.pendingSeasonCompetitionImpact || {};
    var leagueMatches = LEAGUE_MATCH_COUNTS[club.league] || (club.leagueLevel === 2 ? 38 : 34);
    var domesticCupCampaign = simulateDomesticCupCampaign(club, clubStrength);
    var cupMatches = domesticCupCampaign.matches;
    var finalDecision = player.pendingCompetitionOutcome;
    var continentalCampaign = simulateContinentalCampaign(
      player,
      club,
      clubStrength + (competitionImpact.continentalStrength || 0),
      finalDecision,
      competitionImpact
    );
    completeCompetitionWorldResults(club, domesticCupCampaign, continentalCampaign);
    var continentalMatches = continentalCampaign.matches;

    var leagueApps = clamp(Math.round(leagueMatches * playingChance), 0, leagueMatches);
    var cupApps = clamp(Math.round(cupMatches * clamp(playingChance + 0.08, 0.12, 0.98)), 0, cupMatches);
    var continentalApps = clamp(
      Math.round(continentalMatches * clamp(playingChance + 0.04, 0.1, 0.98)),
      0,
      continentalMatches
    );
    var injury = player.pendingSeasonInjury;
    if (injury) {
      var availabilityFactor = injury.availabilityFactor ||
        (injury.severity === "major" ? 0.5 : 0.76);
      leagueApps = Math.round(leagueApps * availabilityFactor);
      cupApps = Math.round(cupApps * availabilityFactor);
      continentalApps = Math.round(continentalApps * availabilityFactor);
      var injuryAppearanceCap = injury.maxAppearances ||
        (injury.severity === "major" ? 20 : 27);
      while (leagueApps + cupApps + continentalApps > injuryAppearanceCap) {
        if (leagueApps >= cupApps && leagueApps >= continentalApps && leagueApps > 0) {
          leagueApps -= 1;
        } else if (continentalApps >= cupApps && continentalApps > 0) {
          continentalApps -= 1;
        } else if (cupApps > 0) {
          cupApps -= 1;
        } else {
          break;
        }
      }
    }

    return {
      league: leagueApps,
      leagueAvailable: leagueMatches,
      domesticCup: cupApps,
      domesticCupAvailable: cupMatches,
      domesticCupStage: domesticCupCampaign.stage,
      domesticCupOpponent: domesticCupCampaign.opponent,
      domesticCupWinner: domesticCupCampaign.winner,
      continental: continentalApps,
      continentalAvailable: continentalMatches,
      continentalName: continentalCampaign.name,
      continentalStage: continentalCampaign.stage,
      continentalOpponent: continentalCampaign.opponent,
      continentalScore: continentalCampaign.score,
      continentalNotableWin: continentalCampaign.notableWin,
      continentalLeaguePosition: continentalCampaign.leaguePosition,
      continentalChampion: continentalCampaign.champion,
      continentalRunnerUp: continentalCampaign.runnerUp,
      continentalWorldResult: continentalCampaign.worldResult || null,
      domesticCupWorldResult: domesticCupCampaign.worldResult || null,
      injuryMatchesMissed: injury
        ? Math.max(1, Math.round((leagueMatches + cupMatches + continentalMatches) * (1 - (injury.availabilityFactor || 0.76))))
        : 0,
      total: Math.max(1, leagueApps + cupApps + continentalApps)
    };
  }

  function simulateDomesticCupCampaign(club, clubStrength) {
    var roundNames = club.league === "Serie A"
      ? ["十六强", "八强", "半决赛首回合", "半决赛次回合", "决赛"]
      : club.league === "LALIGA EA SPORTS"
        ? ["第三轮", "十六强", "八强", "半决赛首回合", "半决赛次回合", "决赛"]
        : ["第三轮", "第四轮", "第五轮", "八强", "半决赛", "决赛"];
    var campaign = { matches: 0, stage: "", opponent: "", winner: false };
    for (var roundIndex = 0; roundIndex < roundNames.length; roundIndex += 1) {
      var stage = roundNames[roundIndex];
      campaign.matches += 1;
      var opponent = pickLeagueOpponent(club);
      var opponentStrength = opponent ? getClubStrength(opponent) : clubStrength;
      var isSecondSemiLeg = stage === "半决赛次回合";
      var chance = clamp(
        0.55 + (clubStrength - opponentStrength) * 0.024 - roundIndex * 0.018,
        0.16,
        0.88
      );
      if (!isSecondSemiLeg && Math.random() >= chance) {
        campaign.stage = stage + "出局";
        campaign.opponent = opponent ? getClubDisplayName(opponent) : "";
        return campaign;
      }
      if (isSecondSemiLeg && Math.random() >= clamp(chance + 0.08, 0.2, 0.9)) {
        campaign.stage = "半决赛出局";
        campaign.opponent = opponent ? getClubDisplayName(opponent) : "";
        return campaign;
      }
    }
    campaign.stage = "冠军";
    campaign.winner = true;
    return campaign;
  }

  function simulateContinentalCampaign(player, club, clubStrength, finalDecision, competitionImpact) {
    var campaign = {
      name: "",
      matches: 0,
      stage: "",
      opponent: "",
      score: "",
      notableWin: "",
      leaguePosition: 0,
      champion: "",
      runnerUp: false
    };
    var facedOpponentIds = [];
    var forcedShootout = competitionImpact &&
      competitionImpact.shootoutStage &&
      typeof competitionImpact.shootoutAdvanced === "boolean"
        ? competitionImpact
        : null;
    var reservedFinalOpponentId = finalDecision &&
      finalDecision.type === "champions-league" &&
      finalDecision.opponentClubId || "";
    if (reservedFinalOpponentId) {
      facedOpponentIds.push(reservedFinalOpponentId);
    }
    if (forcedShootout && forcedShootout.opponentClubId) {
      facedOpponentIds.push(forcedShootout.opponentClubId);
    }
    var qualifiedCompetition = player.nextContinentalCompetition || "";
    player.nextContinentalCompetition = "";
    if (finalDecision && finalDecision.type === "champions-league") {
      campaign.name = "欧冠";
    } else if (qualifiedCompetition && club.region === "欧洲") {
      campaign.name = qualifiedCompetition;
    } else if (
      club.region === "欧洲" &&
      club.leagueLevel === 1 &&
      (!player.career || !player.career.length)
    ) {
      campaign.name = getIncomingClubEuropeanCompetition(club);
      if (!campaign.name) return campaign;
    } else if (
      club.region === "亚洲" &&
      club.leagueLevel === 1 &&
      clubStrength >= 69 &&
      Math.random() < 0.48
    ) {
      campaign.name = "亚冠";
    } else {
      return campaign;
    }

    if (campaign.name === "亚冠") {
      return simulateAsianContinentalCampaign(campaign, club, clubStrength);
    }

    var leagueMatches = campaign.name === "欧协联" ? 6 : 8;
    campaign.matches = leagueMatches;
    campaign.leaguePosition = clamp(
      Math.round(25 - (clubStrength - 76) * 0.9 + randomInt(-8, 8)),
      1,
      36
    );
    if (forcedShootout) {
      campaign.leaguePosition = Math.min(campaign.leaguePosition, 8);
    }
    if (finalDecision && finalDecision.type === "champions-league") {
      campaign.leaguePosition = Math.min(campaign.leaguePosition, 8);
    }
    if (campaign.leaguePosition >= 25) {
      campaign.stage = "联赛阶段出局";
      return campaign;
    }

    if (campaign.leaguePosition >= 9) {
      campaign.matches += 2;
      var playoffOpponent = pickEuropeanOpponent(club.id, campaign.name === "欧冠" ? 78 : 72, facedOpponentIds);
      if (playoffOpponent) facedOpponentIds.push(playoffOpponent.id);
      if (!winsContinentalTie(clubStrength, playoffOpponent, -2)) {
        campaign.stage = "淘汰赛附加赛出局";
        campaign.opponent = playoffOpponent ? getClubDisplayName(playoffOpponent) : "";
        campaign.score = buildContinentalScore(false, true);
        return campaign;
      }
      campaign.notableWin = buildContinentalWinText(campaign.name, "淘汰赛附加赛", playoffOpponent, true);
    }

    var rounds = [
      { stage: "十六强", matches: 2, minimumStrength: campaign.name === "欧冠" ? 81 : 75, difficulty: 0 },
      { stage: "八强", matches: 2, minimumStrength: campaign.name === "欧冠" ? 84 : 78, difficulty: 2 },
      { stage: "半决赛", matches: 2, minimumStrength: campaign.name === "欧冠" ? 86 : 80, difficulty: 4 },
      { stage: "决赛", matches: 1, minimumStrength: campaign.name === "欧冠" ? 88 : 82, difficulty: 5 }
    ];
    for (var roundIndex = 0; roundIndex < rounds.length; roundIndex += 1) {
      var round = rounds[roundIndex];
      campaign.matches += round.matches;
      var opponent = round.stage === "决赛" && reservedFinalOpponentId
        ? getClubById(reservedFinalOpponentId)
        : forcedShootout && round.stage === forcedShootout.shootoutStage
          ? getClubById(forcedShootout.opponentClubId)
        : pickEuropeanOpponent(club.id, round.minimumStrength, facedOpponentIds);
      if (opponent && facedOpponentIds.indexOf(opponent.id) === -1) {
        facedOpponentIds.push(opponent.id);
      }
      var shootoutRoundIndex = forcedShootout
        ? rounds.findIndex(function (item) { return item.stage === forcedShootout.shootoutStage; })
        : -1;
      var won = forcedShootout && roundIndex < shootoutRoundIndex
        ? true
        : finalDecision && finalDecision.type === "champions-league" && round.stage !== "决赛"
          ? true
        : forcedShootout && round.stage === forcedShootout.shootoutStage
          ? forcedShootout.shootoutAdvanced
          : finalDecision && finalDecision.type === "champions-league" && round.stage === "决赛"
            ? finalDecision.won
            : winsContinentalTie(clubStrength, opponent, round.difficulty);
      if (!won) {
        campaign.stage = round.stage === "决赛" ? "决赛失利" : round.stage + "出局";
        campaign.opponent = opponent ? getClubDisplayName(opponent) : "";
        campaign.score = buildContinentalScore(false, round.matches === 2);
        campaign.runnerUp = round.stage === "决赛";
        return campaign;
      }
      campaign.notableWin = buildContinentalWinText(campaign.name, round.stage, opponent, round.matches === 2);
    }
    campaign.stage = "冠军";
    campaign.champion = campaign.name + "冠军";
    return campaign;
  }

  function simulateAsianContinentalCampaign(campaign, club, clubStrength) {
    var facedOpponentIds = [];
    campaign.matches = 8;
    campaign.leaguePosition = clamp(
      Math.round(9 - (clubStrength - 70) * 0.35 + randomInt(-3, 4)),
      1,
      12
    );
    if (campaign.leaguePosition > 8) {
      campaign.stage = "联赛阶段出局";
      return campaign;
    }
    var rounds = [
      { stage: "十六强", matches: 2, difficulty: 0 },
      { stage: "八强", matches: 1, difficulty: 2 },
      { stage: "半决赛", matches: 1, difficulty: 3 },
      { stage: "决赛", matches: 1, difficulty: 4 }
    ];
    for (var roundIndex = 0; roundIndex < rounds.length; roundIndex += 1) {
      var round = rounds[roundIndex];
      campaign.matches += round.matches;
      var opponent = pickAsianOpponent(club.id, Math.max(68, clubStrength - 8), facedOpponentIds);
      if (opponent) facedOpponentIds.push(opponent.id);
      if (!winsContinentalTie(clubStrength, opponent, round.difficulty)) {
        campaign.stage = round.stage === "决赛" ? "决赛失利" : round.stage + "出局";
        campaign.opponent = opponent ? getClubDisplayName(opponent) : "";
        campaign.score = buildContinentalScore(false, round.matches === 2);
        campaign.runnerUp = round.stage === "决赛";
        return campaign;
      }
      campaign.notableWin = buildContinentalWinText(campaign.name, round.stage, opponent, round.matches === 2);
    }
    campaign.stage = "冠军";
    campaign.champion = "亚冠冠军";
    return campaign;
  }

  function winsContinentalTie(clubStrength, opponent, difficulty) {
    var opponentStrength = opponent ? getClubStrength(opponent) : clubStrength;
    var chance = clamp(0.52 + (clubStrength - opponentStrength) * 0.025 - difficulty * 0.018, 0.12, 0.88);
    return Math.random() < chance;
  }

  function buildContinentalWinText(competitionName, stage, opponent, twoLegged) {
    var score = buildContinentalScore(true, twoLegged);
    return opponent
      ? competitionName + stage + score + "战胜 " + getClubDisplayName(opponent)
      : competitionName + stage + "成功晋级";
  }

  function getOfferLeaguePosition(club, summary, teamCount) {
    if (summary && window.LeagueSimulation) {
      var currentLeagueRow = (summary.leagueTable || []).find(function (row) {
        return row.clubId === club.id;
      });
      if (currentLeagueRow) return currentLeagueRow.position;
      summary.offerLeagueTables = summary.offerLeagueTables || {};
      if (!summary.offerLeagueTables[club.league]) {
        var roster = window.LEAGUE_ROSTERS && window.LEAGUE_ROSTERS[club.league];
        var teams = roster && roster.length
          ? roster.slice()
          : window.CLUBS.filter(function (candidate) {
              return candidate.league === club.league;
            });
        if (teams.length >= 2) {
          summary.offerLeagueTables[club.league] =
            window.LeagueSimulation.simulateFullLeagueSeason({
              leagueId: club.league,
              teams: teams,
              playerClubId: "",
              seasonYear: summary.seasonYear,
              matches: LEAGUE_MATCH_COUNTS[club.league]
            }).table;
        }
      }
      var row = (summary.offerLeagueTables[club.league] || []).find(function (item) {
        return item.clubId === club.id;
      });
      if (row) return row.position;
    }
    var prior = CLUB_LEAGUE_PRIORS[club.id];
    var expectedPosition = prior
      ? prior.expected
      : Math.round(1 + (92 - getClubStrength(club)) * (club.leagueLevel === 1 ? 0.55 : 0.72));
    return Math.round(clamp(expectedPosition + randomInt(-2, 2), 1, teamCount));
  }

  function completeCompetitionWorldResults(club, domesticCupCampaign, continentalCampaign) {
    if (!window.CompetitionSimulation) return;
    var sameCountry = window.CLUBS.filter(function (candidate) {
      return candidate.country === club.country;
    });
    if (!domesticCupCampaign.winner && sameCountry.length >= 2) {
      domesticCupCampaign.worldResult = window.CompetitionSimulation.simulateKnockoutCompetition({
        competition: getCompetitionNames(club).domesticCup.replace("冠军", ""),
        clubs: sameCountry,
        excludedIds: [club.id],
        participantCount: 16
      });
    }
    if (!continentalCampaign.name || continentalCampaign.champion) return;
    var region = club.region;
    var continentalClubs = window.CLUBS.filter(function (candidate) {
      return candidate.region === region && candidate.leagueLevel === 1;
    });
    continentalCampaign.worldResult = window.CompetitionSimulation.simulateKnockoutCompetition({
      competition: continentalCampaign.name,
      clubs: continentalClubs,
      excludedIds: [club.id],
      participantCount: 16
    });
  }

  function buildContinentalScore(won, twoLegged) {
    var winningScores = twoLegged
      ? ["以总比分 2 比 1 ", "以总比分 3 比 2 ", "以总比分 4 比 2 ", "在总比分战平后通过点球大战 "]
      : ["以 1 比 0 ", "以 2 比 1 ", "以 3 比 1 ", "在点球大战中 "];
    var losingScores = twoLegged
      ? ["以总比分 1 比 2 负于 ", "以总比分 2 比 3 负于 ", "以总比分 2 比 4 负于 ", "在总比分战平后点球大战惜败于 "]
      : ["以 0 比 1 负于 ", "以 1 比 2 负于 ", "以 1 比 3 负于 ", "在点球大战中惜败于 "];
    return pickOne(won ? winningScores : losingScores);
  }

  function pickAsianOpponent(excludedClubId, minimumStrength, additionalExcludedIds) {
    var excludedIds = [excludedClubId].concat(additionalExcludedIds || []);
    var candidates = window.CLUBS.filter(function (club) {
      return excludedIds.indexOf(club.id) === -1 &&
        club.region === "亚洲" &&
        club.leagueLevel === 1 &&
        getClubStrength(club) >= minimumStrength;
    });
    return candidates.length ? pickOne(candidates) : null;
  }

  function simulateStats(player, appearances, competitionStats) {
    var rate = POSITION_RATES[player.position];
    var club = getClubById(player.currentClubId);
    var style = getClubTacticalStyle(club);
    var profile = getEffectivePlayerProfile(player);
    var archetype = getPrimaryArchetype(player).name;
    var eliteOutputGrowth = 1 + Math.max(0, player.overall - 80) * 0.018;
    var overallFactor =
      Math.pow(player.overall / 78, 1.25) *
      eliteOutputGrowth *
      getLeagueRelativeOutputFactor(player, club);
    var goalRate = rate.goal;
    var assistRate = rate.assist;
    var isFullback = player.position === "LB" || player.position === "RB";
    var isCenterback = player.position === "CB";
    var isForward = ["ST", "LW", "RW"].indexOf(player.position) !== -1;
    var goalSkill = (profile.finishing || 50) * 0.58 +
      (profile.offBall || 50) * 0.27 +
      (profile.aerial || 50) * 0.15;
    var assistSkill = (profile.passing || 50) * 0.46 +
      (profile.vision || 50) * 0.39 +
      (profile.dribbling || 50) * 0.15;
    var goalSkillFactor = clamp(0.34 + Math.pow(goalSkill / 70, 2) * 0.66, 0.42, 1.68);
    var assistSkillFactor = clamp(0.34 + Math.pow(assistSkill / 70, 2) * 0.66, 0.42, 1.68);
    var archetypeModifiers = getArchetypeOutputModifiers(archetype);
    var statusPerformanceMultiplier = getAdaptiveStatusImpact(player).performanceMultiplier;
    var footRole = getFootednessRole(player);

    goalRate *= goalSkillFactor * archetypeModifiers.goal * statusPerformanceMultiplier;
    assistRate *= assistSkillFactor * archetypeModifiers.assist * statusPerformanceMultiplier;
    if (footRole === "inverted-wide") {
      goalRate *= 1.14;
      assistRate *= 0.94;
    } else if (footRole === "natural-wide") {
      goalRate *= 0.95;
      assistRate *= 1.15;
    } else if (footRole === "natural-fullback") {
      assistRate *= 1.1;
    } else if (footRole === "inverted-fullback") {
      goalRate *= 1.04;
      assistRate *= 0.97;
    }
    if (player.position === "CB" && player.dominantFoot === "左脚") {
      assistRate *= 1.06;
    }

    if (isCenterback) {
      goalRate *= style.setPieces * (0.52 + (profile.aerial || 55) / 110);
      if ((profile.aerial || 0) >= 78 && Math.random() < 0.045) {
        goalRate *= randomBetween(1.7, 2.5);
      }
    }
    if (isFullback) {
      assistRate *= style.fullbackAssists * (0.68 + (profile.workRate || 60) / 205);
    }
    if (isForward) {
      assistRate *= style.forwardAssists;
    }

    var goalSeasonVariance = randomBetween(0.86, 1.14);
    var assistSeasonVariance = randomBetween(0.84, 1.17);
    if (goalSkill >= 82 && Math.random() < 0.012) goalSeasonVariance *= randomBetween(1.18, 1.32);
    if (assistSkill >= 82 && Math.random() < 0.025) assistSeasonVariance *= randomBetween(1.3, 1.5);
    var goalCeiling = getSeasonGoalCeiling(player, appearances, goalSkill);
    var goalLambda = Math.min(
      goalCeiling * 0.92,
      appearances * goalRate * overallFactor * style.chances * goalSeasonVariance
    );
    var assistLambda = appearances * assistRate * overallFactor * style.chances * assistSeasonVariance;
    var goals = Math.min(goalCeiling, samplePoisson(goalLambda));
    var assists = Math.min(appearances, samplePoisson(assistLambda));
    var contribution = simulatePositionContribution(
      player,
      club,
      appearances,
      goals,
      assists,
      profile,
      style
    );
    var goalSplit = allocateCompetitionOutput(goals, competitionStats);
    var assistSplit = allocateCompetitionOutput(assists, competitionStats);
    return {
      appearances: appearances,
      goals: goals,
      assists: assists,
      teamContribution: contribution.score,
      cleanSheets: contribution.cleanSheets,
      penaltySaves: contribution.penaltySaves,
      headedGoals: contribution.headedGoals,
      setPieceGoals: contribution.setPieceGoals,
      leagueGoals: goalSplit.league,
      domesticCupGoals: goalSplit.domesticCup,
      continentalGoals: goalSplit.continental,
      leagueAssists: assistSplit.league,
      domesticCupAssists: assistSplit.domesticCup,
      continentalAssists: assistSplit.continental
    };
  }

  function simulatePositionContribution(player, club, appearances, goals, assists, profile, style) {
    var defensivePosition = ["GK", "CB", "LB", "RB"].indexOf(player.position) !== -1;
    var cleanSheets = 0;
    var penaltySaves = 0;
    var headedGoals = 0;
    var setPieceGoals = 0;
    if (defensivePosition) {
      var cleanSheetRate = clamp(
        0.2 +
        (getClubStrength(club) - 70) * 0.009 +
        (player.overall - getClubStrength(club)) * 0.006,
        0.12,
        0.52
      );
      cleanSheets = Math.min(appearances, samplePoisson(appearances * cleanSheetRate));
    }
    if (player.position === "GK") {
      penaltySaves = Math.min(
        6,
        samplePoisson(appearances * (0.025 + Math.max(0, (profile.reflexes || 60) - 70) * 0.0015))
      );
    } else if (player.position === "CB") {
      headedGoals = Math.min(goals, Math.round(goals * randomBetween(0.55, 0.85)));
      setPieceGoals = Math.min(goals, Math.max(headedGoals, Math.round(goals * style.setPieces * 0.68)));
    } else if (player.position === "LB" || player.position === "RB") {
      headedGoals = Math.min(goals, Math.round(goals * randomBetween(0.18, 0.42)));
      setPieceGoals = Math.min(goals, Math.round(goals * style.setPieces * randomBetween(0.25, 0.5)));
    }
    var score;
    if (player.position === "GK") {
      score = 34 + appearances * 0.45 + cleanSheets * 1.25 + penaltySaves * 4.5 +
        Math.max(0, player.overall - 75) * 0.7;
    } else if (defensivePosition) {
      score = 30 + appearances * 0.34 + cleanSheets * 0.72 + goals * 2.4 +
        assists * 1.8 + headedGoals * 2 + setPieceGoals * 1.4 +
        Math.max(0, player.overall - 75) * 0.55;
    } else {
      score = 28 + appearances * 0.28 + goals * 1.8 + assists * 1.55 +
        Math.max(0, player.overall - 75) * 0.5;
    }
    return {
      score: clamp(Math.round(score), 20, 99),
      cleanSheets: cleanSheets,
      penaltySaves: penaltySaves,
      headedGoals: headedGoals,
      setPieceGoals: setPieceGoals
    };
  }

  function getSeasonGoalCeiling(player, appearances, goalSkill) {
    var baseRates = {
      GK: 0.025,
      CB: 0.16,
      LB: 0.23,
      RB: 0.23,
      CM: 0.38,
      CAM: 0.7,
      LM: 0.56,
      RM: 0.56,
      LW: 0.8,
      RW: 0.8,
      ST: 0.98
    };
    var eliteWeights = {
      GK: 0,
      CB: 0.18,
      LB: 0.24,
      RB: 0.24,
      CM: 0.42,
      CAM: 0.78,
      LM: 0.72,
      RM: 0.72,
      LW: 0.92,
      RW: 0.92,
      ST: 1
    };
    var absoluteCaps = {
      GK: 3,
      CB: 18,
      LB: 24,
      RB: 24,
      CM: 34,
      CAM: 54,
      LM: 48,
      RM: 48,
      LW: 66,
      RW: 66,
      ST: 75
    };
    var baseRate = baseRates[player.position] || 0.5;
    var eliteBonus = Math.max(0, player.overall - 86) * 0.012 *
      (eliteWeights[player.position] || 0.5);
    var ceilingRate = baseRate + eliteBonus;
    var isEliteAttacker = ["ST", "LW", "RW"].indexOf(player.position) !== -1 &&
      player.overall >= 93 &&
      goalSkill >= 88;

    // Record-breaking scoring seasons remain possible, but should feel exceptional.
    if (isEliteAttacker && Math.random() < 0.012) {
      ceilingRate *= randomBetween(1.18, 1.3);
    }

    return Math.max(
      player.position === "GK" ? 1 : 2,
      Math.min(absoluteCaps[player.position] || 45, Math.round(appearances * ceilingRate))
    );
  }

  function allocateCompetitionOutput(total, competitionStats) {
    var result = { league: 0, domesticCup: 0, continental: 0 };
    if (!competitionStats || total <= 0) {
      return result;
    }
    var weights = [
      { key: "league", value: competitionStats.league },
      { key: "domesticCup", value: competitionStats.domesticCup * 0.94 },
      { key: "continental", value: competitionStats.continental * 0.97 }
    ];
    var totalWeight = weights.reduce(function (sum, item) {
      return sum + item.value;
    }, 0);
    if (totalWeight <= 0) {
      return result;
    }
    for (var outputIndex = 0; outputIndex < total; outputIndex += 1) {
      var roll = Math.random() * totalWeight;
      for (var weightIndex = 0; weightIndex < weights.length; weightIndex += 1) {
        roll -= weights[weightIndex].value;
        if (roll <= 0) {
          result[weights[weightIndex].key] += 1;
          break;
        }
      }
    }
    return result;
  }

  function getArchetypeOutputModifiers(archetype) {
    var modifiers = {
      "出球型门将": { goal: 1, assist: 1.7 },
      "制空中卫": { goal: 1.55, assist: 0.8 },
      "出球中卫": { goal: 0.85, assist: 1.65 },
      "防守边卫": { goal: 0.62, assist: 0.68 },
      "进攻翼卫": { goal: 1.08, assist: 1.55 },
      "内收边卫": { goal: 0.82, assist: 1.25 },
      "边路推进型": { goal: 1.05, assist: 1.3 },
      "防守型六号位": { goal: 0.55, assist: 0.62 },
      "拖后组织核心": { goal: 0.72, assist: 1.28 },
      "全能八号位": { goal: 1.12, assist: 1.08 },
      "前场组织核心": { goal: 1.22, assist: 1.42 },
      "古典前腰": { goal: 0.9, assist: 1.48 },
      "影子前锋": { goal: 1.48, assist: 0.82 },
      "持球核心": { goal: 1.08, assist: 1.25 },
      "压迫型前腰": { goal: 1.02, assist: 0.92 },
      "爆点边锋": { goal: 1.1, assist: 1.12 },
      "内切得分手": { goal: 1.5, assist: 0.78 },
      "传中型边锋": { goal: 0.68, assist: 1.52 },
      "无球冲刺型": { goal: 1.4, assist: 0.76 },
      "禁区终结者": { goal: 1.38, assist: 0.62 },
      "支点中锋": { goal: 0.98, assist: 1.35 },
      "反越位前锋": { goal: 1.26, assist: 0.7 },
      "回撤组织型前锋": { goal: 0.7, assist: 1.62 },
      "全能前锋": { goal: 1.1, assist: 1.08 }
    };
    return modifiers[archetype] || { goal: 1, assist: 1 };
  }

  function getEffectivePlayerProfile(player) {
    var source = player.profile || {};
    var overallAdjustment = (player.overall - 70) * 0.62;
    var effective = {};
    [
      "dribbling", "offBall", "workRate", "passing", "finishing", "defending",
      "pace", "strength", "aerial", "vision", "reflexes"
    ].forEach(function (skill) {
      effective[skill] = clamp((source[skill] || 50) + overallAdjustment, 25, 96);
    });
    return effective;
  }

  function getLeagueRelativeOutputFactor(player, club) {
    var benchmark;
    if (club.league === "China League One") {
      benchmark = 61;
    } else if (club.league === "Chinese Super League") {
      benchmark = 67;
    } else if (club.leagueLevel >= 3) {
      benchmark = club.region === "欧洲" ? 55 : 51;
    } else if (club.leagueLevel === 2) {
      benchmark = 67;
    } else if (isBigFiveTopFlight(club)) {
      benchmark = 83;
    } else if (club.region === "欧洲") {
      benchmark = 76;
    } else if (isSaudiClub(club)) {
      benchmark = 77;
    } else if (club.region === "亚洲") {
      benchmark = 72;
    } else {
      benchmark = 74;
    }
    var relativeGap = player.overall - benchmark;
    var gapWeight =
      club.league === "Chinese Super League" || club.league === "China League One"
        ? 0.035
        : club.leagueLevel >= 3 ? 0.045 : club.leagueLevel === 2 ? 0.032 : 0.027;
    return clamp(1 + relativeGap * gapWeight, club.leagueLevel >= 3 ? 0.72 : 0.68, club.leagueLevel >= 3 ? 1.72 : 1.46);
  }

  function simulateInternationalStats(player, appearances) {
    var rate = POSITION_RATES[player.position];
    var profile = getEffectivePlayerProfile(player);
    var modifiers = getArchetypeOutputModifiers(getPrimaryArchetype(player).name);
    var goalSkill = (profile.finishing || 50) * 0.58 +
      (profile.offBall || 50) * 0.27 +
      (profile.aerial || 50) * 0.15;
    var assistSkill = (profile.passing || 50) * 0.46 +
      (profile.vision || 50) * 0.39 +
      (profile.dribbling || 50) * 0.15;
    var internationalEliteGrowth = 1 + Math.max(0, player.overall - 82) * 0.014;
    var overallFactor = Math.pow(player.overall / 82, 1.65) * internationalEliteGrowth;
    var goalFactor = clamp(0.34 + Math.pow(goalSkill / 70, 2) * 0.66, 0.42, 1.68);
    var assistFactor = clamp(0.34 + Math.pow(assistSkill / 70, 2) * 0.66, 0.42, 1.68);
    var footRole = getFootednessRole(player);
    var footGoalFactor = footRole === "inverted-wide" ? 1.12 :
      footRole === "natural-wide" ? 0.96 : 1;
    var footAssistFactor = footRole === "natural-wide" ? 1.13 :
      footRole === "inverted-wide" ? 0.95 :
      footRole === "natural-fullback" ? 1.08 : 1;
    return {
      goals: Math.min(
        appearances * 2,
        samplePoisson(appearances * rate.goal * overallFactor * goalFactor * modifiers.goal * footGoalFactor * randomBetween(0.82, 1.18))
      ),
      assists: Math.min(
        appearances,
        samplePoisson(appearances * rate.assist * overallFactor * assistFactor * modifiers.assist * footAssistFactor * randomBetween(0.82, 1.18))
      )
    };
  }

  function generateInitialPotential(baseOverall, academyClub, origin) {
    var roll = randomInt(1, 100);
    var potential;
    if (roll <= 5) potential = Math.max(baseOverall + 10, randomInt(65, 69));
    else if (roll <= 20) potential = Math.max(baseOverall + 14, randomInt(72, 79));
    else if (roll <= 60) potential = randomInt(80, 84);
    else if (roll <= 82) potential = randomInt(85, 89);
    else if (roll <= 94) potential = randomInt(90, 94);
    else potential = randomInt(95, 98);

    var academyScore = academyClub
      ? academyClub.reputation * 0.4 +
        academyClub.strength * 0.35 +
        academyClub.youthChance * 0.25
      : 60;
    if (academyScore >= 82) {
      potential += randomInt(0, 2);
    } else if (academyScore >= 72) {
      potential += randomInt(0, 1);
    } else if (academyScore <= 58 && randomInt(1, 100) <= 28) {
      potential -= 1;
    }
    if (origin === "职业梯队早期选材") {
      potential += 1;
    } else if (origin === "留洋少年出身" && randomInt(1, 100) <= 65) {
      potential += 1;
    } else if (
      (origin === "校园足球出身" || origin === "街头足球出身") &&
      randomInt(1, 100) <= 18
    ) {
      potential += randomInt(1, 3);
    }
    potential += 2;
    return clamp(potential, Math.max(65, baseOverall + 10), 99);
  }

  function evolvePlayerPotential(player, club, stats) {
    var previous = player.potential;
    var profile = player.profile || {};
    var workRate = profile.workRate || 55;
    var change = randomInt(-1, 1);
    var injury = player.pendingSeasonInjury;
    var momentum = player.developmentMomentum || 0;
    var isLateBloomCandidate = previous <= 83 && player.age >= 21 && player.age <= 28;
    var strongEnvironment = stats.appearances >= 25 &&
      player.status.coachRelation >= 58 &&
      player.status.happiness >= 55;

    if (player.age <= 19 && stats.appearances >= 20 && player.status.coachRelation >= 62) {
      change += randomInt(0, 2);
    }
    if (stats.appearances < 12) {
      if (player.age > 20 || randomInt(1, 100) <= 45) {
        change -= player.age <= 20 ? randomInt(0, 1) : randomInt(1, 2);
      }
    }
    if (player.status.happiness < 42 || player.status.coachRelation < 38) {
      change -= randomInt(1, 3);
    }
    if (injury && injury.severity === "major") {
      change -= randomInt(2, 5);
    } else if (injury) {
      change -= randomInt(0, 2);
    }

    if (momentum >= 2 && workRate >= 66 && strongEnvironment) {
      change += randomInt(1, 3);
    } else if (momentum <= -2) {
      change -= randomInt(1, 3);
    }

    if (
      isLateBloomCandidate &&
      strongEnvironment &&
      workRate >= 68 &&
      randomInt(1, 100) <= 28
    ) {
      change += randomInt(3, 6);
    }

    if (
      previous >= 91 &&
      (stats.appearances < 18 || player.status.happiness < 50 || player.status.coachRelation < 48) &&
      randomInt(1, 100) <= 55
    ) {
      change -= randomInt(2, 5);
    } else if (previous >= 94 && randomInt(1, 100) <= 14) {
      change -= randomInt(1, 3);
    }

    if (player.age >= 25 && previous - player.overall >= 12 && stats.appearances < 20) {
      change -= randomInt(1, 3);
    }
    if (
      (player.initialPotential || 0) >= 95 &&
      player.age <= 24 &&
      stats.appearances >= 18 &&
      player.status.coachRelation >= 50 &&
      !injury &&
      player.status.happiness >= 50
    ) {
      change = Math.max(0, change);
    }
    if (player.age >= 29) {
      change = Math.min(change, 0);
    }

    change = clamp(change, -6, 6);
    player.potential = clamp(previous + change, Math.max(60, player.overall), 99);
    change = player.potential - previous;
    player.peakPotential = Math.max(player.peakPotential || player.potential, player.potential);
    player.potentialHistory = player.potentialHistory || [];
    player.potentialHistory.push({
      age: player.age,
      value: player.potential,
      change: change
    });
    player.developmentMomentum = momentum > 0 ? Math.max(0, momentum - 1) : momentum < 0 ? Math.min(0, momentum + 1) : 0;

    return {
      change: change,
      note: buildPotentialDevelopmentNote(player, previous, change, stats)
    };
  }

  function buildPotentialDevelopmentNote(player, previous, change, stats) {
    if ((player.initialPotential || 0) >= 92 && previous > 85 && player.potential <= 85) {
      return "发展观察：你曾是万众瞩目的顶级天才，但多年起伏后，外界已经把你重新评价为一名普通职业球员。";
    }
    if ((player.initialPotential || 99) <= 82 && previous < 88 && player.potential >= 88) {
      return "发展观察：早年几乎没人看好你，如今持续进步已经完成大器晚成式的逆转，球探承认最初判断错了。";
    }
    if (
      (player.initialPotential || player.potential) <= 85 &&
      previous - player.initialPotential < 6 &&
      player.potential - player.initialPotential >= 6 &&
      (player.profile.workRate || 0) >= 68
    ) {
      return "发展观察：你没有惊人的先天天赋，却靠多年高强度训练把自己提升到了可靠的职业水准。";
    }
    if (previous >= 91 && change <= -3) {
      return "发展观察：曾经围绕你的天才光环正在消退，球探认为早期预测可能过于乐观。";
    }
    if (previous <= 83 && player.age >= 21 && change >= 3) {
      return "发展观察：你展现出明显的大器晚成迹象，过去并不看好你的球探开始重新评估上限。";
    }
    if (change >= 3 && (player.profile.workRate || 0) >= 68) {
      return "发展观察：持续训练和稳定比赛带来了超出预期的进步，你的长期上限被重新调高。";
    }
    if (change >= 2) {
      return "发展观察：这一年的适应和表现好于预期，俱乐部内部上调了对你未来的判断。";
    }
    if (change <= -3 && player.pendingSeasonInjury) {
      return "发展观察：伤病打断了关键成长阶段，球探对你能否完全兑现原有天赋产生了疑问。";
    }
    if (change <= -2 && stats.appearances < 18) {
      return "发展观察：长期缺少比赛让成长速度停滞，原本被看好的发展空间正在缩小。";
    }
    if (change <= -2) {
      return "发展观察：这个赛季没有兑现外界期待，你的长期评价出现明显下调。";
    }
    return "";
  }

  function describePotentialOutlook(player) {
    var gap = player.potential - player.overall;
    var recent = player.potentialHistory && player.potentialHistory.length
      ? player.potentialHistory[player.potentialHistory.length - 1].change
      : 0;
    if (recent >= 3) return "快速上升";
    if (recent <= -3) return "明显下滑";
    if (gap >= 30) return "备受期待";
    if (gap >= 18) return "仍有空间";
    if (gap >= 8) return "稳步发展";
    if (gap >= 3) return "接近定型";
    return "上限受限";
  }

  function calculateOverallChange(player) {
    var growth = 0;
    var curve = getPlayerCareerCurve(player);
    if (player.age < 19) {
      growth = randomInt(4, 5);
    } else if (player.age < 22) {
      growth = randomInt(3, 4);
    } else if (player.age < curve.peakStart) {
      growth = player.age < 25 ? randomInt(1, 3) : randomInt(0, 2);
    } else if (player.age <= curve.peakEnd) {
      growth = randomInt(0, 1);
    } else if (player.age < curve.hardDecline) {
      growth = randomInt(-1, 1);
    } else if (player.age < curve.hardDecline + 2) {
      growth = randomInt(-2, 0);
    } else {
      growth = randomInt(-3, -1);
    }

    if (player.status.fitness < 50) {
      growth -= randomInt(1, 2);
    }
    if (player.status.coachRelation > 75) {
      growth += 1;
    }
    if (player.status.happiness < 45) {
      growth -= 1;
    }
    if (
      player.age < curve.peakStart &&
      player.status.fitness >= 55 &&
      player.status.happiness >= 45
    ) {
      growth = Math.max(0, growth);
    }
    var potentialGap = player.potential - player.overall;
    if (
      player.age < 25 &&
      potentialGap >= 8 &&
      player.status.fitness >= 65 &&
      player.status.happiness >= 50 &&
      randomInt(1, 100) <= (
        player.potential >= 95 ? 96 :
        player.potential >= 90 ? 88 :
        35
      )
    ) {
      growth += player.potential >= 95 ? 4 : 1;
    }
    if (
      player.age >= 25 &&
      player.age <= 28 &&
      player.potential >= 90 &&
      potentialGap >= 2 &&
      player.status.fitness >= 60 &&
      player.status.happiness >= 48 &&
      randomInt(1, 100) <= (player.potential >= 95 ? 94 : 72)
    ) {
      growth += player.potential >= 95 ? 2 : 1;
    }
    if (
      player.age >= 22 &&
      player.age <= 27 &&
      player.overall < 80 &&
      player.potential >= 80 &&
      player.status.fitness >= 58 &&
      randomInt(1, 100) <= 82
    ) {
      growth = Math.max(growth, 1);
    }
    if (
      player.age >= 22 &&
      player.age <= 28 &&
      player.overall < 84 &&
      player.potential >= 84 &&
      potentialGap >= 2 &&
      player.status.fitness >= 58 &&
      player.status.happiness >= 42 &&
      randomInt(1, 100) <= 88
    ) {
      growth = Math.max(growth, 1);
    }
    if (
      player.age >= 23 &&
      player.age <= 29 &&
      player.potential >= 88 &&
      potentialGap >= 6 &&
      player.status.fitness >= 60 &&
      player.status.happiness >= 48 &&
      randomInt(1, 100) <= 62
    ) {
      growth += 1;
    }
    if (potentialGap <= 0) {
      growth = Math.min(growth, 0);
    } else if (potentialGap < 5) {
      growth = Math.min(growth, 1);
    }
    if (player.overall + growth > player.potential) {
      growth = player.potential - player.overall;
    }
    return growth;
  }

  function getPlayerCareerCurve(player) {
    var base = POSITION_CAREER_CURVES[player.position] || POSITION_CAREER_CURVES.CM;
    var bonus = player.careerCurveBonus || 0;
    return {
      peakStart: base.peakStart,
      peakEnd: base.peakEnd + bonus,
      hardDecline: base.hardDecline + bonus
    };
  }

  function simulateTrophies(player, club, stats, seasonOutlook) {
    var pool = [];
    var competitionNames = getCompetitionNames(club);

    if (seasonOutlook.leagueChampion) {
      pool.push(competitionNames.leagueTitle);
    }
    if (seasonOutlook.domesticCupWinner) {
      pool.push(competitionNames.domesticCup);
    }
    if (seasonOutlook.continentalChampion) {
      pool.push(seasonOutlook.continentalChampion);
    }
    if (seasonOutlook.worldChampion) {
      pool.push("世俱杯冠军");
    }
    var goldenBootLine = getGoldenBootThreshold(club) + randomInt(-1, 3);
    if (
      stats.leagueGoals >= goldenBootLine &&
      (player.position === "ST" || player.position === "LW" || player.position === "RW" || player.position === "CAM")
    ) {
      pool.push(competitionNames.goldenBoot);
    }
    if (
      stats.leagueAssists >= 14 &&
      (player.position === "CM" || player.position === "CAM" || player.position === "LM" || player.position === "RM")
    ) {
      pool.push(competitionNames.assistAward);
    }
    var alreadyWonBestYoungPlayer = player.career.some(function (entry) {
      return entry.trophies.indexOf("最佳新秀") !== -1;
    });
    if (
      player.age <= 20 &&
      !alreadyWonBestYoungPlayer &&
      qualifiesForBestYoungPlayer(player, stats) &&
      Math.random() < getBestYoungPlayerChance(player, stats)
    ) {
      pool.push("最佳新秀");
    }
    if (
      qualifiesForSeasonBestXI(player, stats, seasonOutlook) &&
      Math.random() < getSeasonBestXIChance(player, stats)
    ) {
      pool.push("赛季最佳阵容");
    }
    var ballonDorQualified = qualifiesForBallonDor(player, stats, seasonOutlook);
    player.pendingBallonDorNomination = ballonDorQualified;
    if (
      ballonDorQualified &&
      Math.random() < getBallonDorChance(player, stats, seasonOutlook)
    ) {
      pool.push("金球奖");
    }
    var seasonHonors = unique(pool);
    return seasonHonors;
  }

  function qualifiesForBestYoungPlayer(player, stats) {
    var output = stats.goals + stats.assists;
    if (player.position === "ST" || player.position === "LW" || player.position === "RW") {
      return player.overall >= 75 && stats.appearances >= 24 && output >= 11;
    }
    if (player.position === "LM" || player.position === "RM") {
      return player.overall >= 75 && stats.appearances >= 26 && output >= 9;
    }
    if (player.position === "CM") {
      return player.overall >= 76 && stats.appearances >= 28 && output >= 7;
    }
    if (player.position === "CAM") {
      return player.overall >= 76 && stats.appearances >= 25 && output >= 12;
    }
    if (player.position === "LB" || player.position === "RB") {
      return player.overall >= 77 && stats.appearances >= 30 && stats.assists >= 4;
    }
    if (player.position === "CB") {
      return player.overall >= 78 && stats.appearances >= 30;
    }
    return player.overall >= 79 && stats.appearances >= 30;
  }

  function getGoldenBootThreshold(club) {
    var thresholds = {
      "Premier League": 26,
      "LALIGA EA SPORTS": 26,
      "Bundesliga": 26,
      "Serie A": 26,
      "Ligue 1 McDonald's": 26,
      "EFL Championship": 22,
      "LALIGA HYPERMOTION": 20,
      "2. Bundesliga": 20,
      "Serie BKT": 19,
      "Ligue 2 BKT": 19,
      "Chinese Super League": 18,
      "China League One": 16,
      "J1 League": 18,
      "K League 1": 17,
      "Saudi Pro League": 20
    };
    return thresholds[club.league] || 19;
  }

  function qualifiesForSeasonBestXI(player, stats, seasonOutlook) {
    var output = stats.goals + stats.assists;
    var titleBonus = seasonOutlook &&
      (seasonOutlook.leagueChampion || seasonOutlook.continentalChampion) ? 2 : 0;

    if (player.status.reputation < 58) return false;
    if (player.position === "GK") {
      return stats.appearances >= 30 && player.overall >= 84;
    }
    if (player.position === "CB") {
      return stats.appearances >= 29 && player.overall >= 83;
    }
    if (player.position === "LB" || player.position === "RB") {
      return stats.appearances >= 28 && player.overall >= 82 &&
        output >= 6 - titleBonus;
    }
    if (player.position === "CM") {
      return stats.appearances >= 27 && player.overall >= 83 &&
        output >= 8 - titleBonus;
    }
    if (player.position === "CAM") {
      return stats.appearances >= 25 && player.overall >= 83 &&
        output >= 14 - titleBonus;
    }
    if (player.position === "LM" || player.position === "RM") {
      return stats.appearances >= 26 && player.overall >= 82 &&
        output >= 11 - titleBonus;
    }
    if (player.position === "LW" || player.position === "RW") {
      return stats.appearances >= 25 && player.overall >= 83 &&
        output >= 15 - titleBonus;
    }
    return stats.appearances >= 24 && player.overall >= 83 &&
      output >= 17 - titleBonus;
  }

  function getSeasonBestXIChance(player, stats) {
    var output = stats.goals + stats.assists;
    return clamp(
      0.24 +
      (player.overall - 82) * 0.035 +
      Math.max(0, stats.appearances - 26) * 0.008 +
      output * 0.006,
      0.24,
      0.72
    );
  }

  function qualifiesForBallonDor(player, stats, seasonOutlook) {
    var output = stats.goals + stats.assists;
    var wonChampionsLeague = seasonOutlook &&
      seasonOutlook.continentalChampion === "欧冠冠军";
    var wonLeague = seasonOutlook && seasonOutlook.leagueChampion;
    var eliteDouble = wonChampionsLeague && wonLeague;
    var exceptionalDoubleSeason =
      eliteDouble &&
      player.overall >= 84 &&
      (
        output >= 24 ||
        (["LB", "RB"].indexOf(player.position) !== -1 && output >= 10) ||
        (["CB", "GK"].indexOf(player.position) !== -1 && player.overall >= 88)
      );
    if (
      player.status.reputation < 78 ||
      stats.appearances < 24 ||
      (player.overall < 88 && !exceptionalDoubleSeason)
    ) {
      return false;
    }
    var majorChampion = seasonOutlook &&
      (seasonOutlook.continentalChampion === "欧冠冠军" ||
       seasonOutlook.leagueChampion ||
       seasonOutlook.worldChampion);
    var eliteDefensiveChampion = seasonOutlook &&
      (seasonOutlook.continentalChampion === "欧冠冠军" ||
       seasonOutlook.worldChampion);

    if (player.position === "ST" || player.position === "LW" || player.position === "RW") {
      return output >= 30 || (majorChampion && output >= 23);
    }
    if (player.position === "CAM") {
      return output >= 24 || (majorChampion && output >= 19);
    }
    if (player.position === "LM" || player.position === "RM" || player.position === "CM") {
      return output >= 20 || (majorChampion && output >= 14);
    }
    if (player.position === "LB" || player.position === "RB") {
      return majorChampion &&
        player.overall >= 88 &&
        (output >= 8 || eliteDefensiveChampion) &&
        stats.teamContribution >= 76;
    }
    return player.overall >= 89 &&
      stats.appearances >= 28 &&
      majorChampion &&
      stats.teamContribution >= 78 &&
      (eliteDefensiveChampion || player.status.reputation >= 90);
  }

  function getBallonDorChance(player, stats, seasonOutlook) {
    var output = stats.goals + stats.assists;
    var majorChampion = seasonOutlook &&
      (seasonOutlook.continentalChampion === "欧冠冠军" ||
       seasonOutlook.leagueChampion ||
       seasonOutlook.worldChampion);
    var eliteDouble = seasonOutlook &&
      seasonOutlook.leagueChampion &&
      seasonOutlook.continentalChampion === "欧冠冠军";
    var previousSeason = player.career && player.career.length
      ? player.career[player.career.length - 1]
      : null;
    var mediaNarrativeBonus =
      Math.max(-0.1, (player.status.reputation - 82) * 0.009) +
      (previousSeason && previousSeason.ballonDorControversy ? 0.1 : 0) +
      (previousSeason && previousSeason.ballonDorNominated ? 0.04 : 0);
    var fairPlayBonus = clamp(
      (player.status.coachRelation - 55) * 0.0025 +
      (player.status.happiness - 55) * 0.0015,
      -0.14,
      0.14
    );
    var defensiveAwardCase =
      ["GK", "CB", "LB", "RB"].indexOf(player.position) !== -1 &&
      majorChampion &&
      player.overall >= 89;
    var chance =
      0.22 +
      Math.max(0, player.overall - 88) * 0.055 +
      Math.max(0, player.status.reputation - 78) * 0.006 +
      Math.max(0, output - 18) * 0.008 +
      (majorChampion ? 0.1 : 0) +
      (eliteDouble ? 0.18 : 0) +
      mediaNarrativeBonus +
      fairPlayBonus +
      (defensiveAwardCase ? 0.12 : 0) +
      Math.max(0, (stats.teamContribution || 70) - 78) * 0.008;
    if (eliteDouble && output >= 24 && player.status.reputation >= 88) {
      chance = Math.max(chance, 0.72);
    }
    return clamp(chance, 0.08, 0.86);
  }

  function buildRefereeScandalMoment(player, club, competitionStats) {
    if (
      player.refereeScandalSeen ||
      !competitionStats ||
      competitionStats.continentalName !== "欧冠" ||
      competitionStats.continental < 4 ||
      Math.random() >= 0.06
    ) {
      return null;
    }

    var opponent = pickEuropeanOpponent(club.id, 82);
    if (!opponent) return null;

    player.refereeScandalSeen = true;
    var benefited = Math.random() < 0.28;
    var fixture = getClubDisplayName(club) + " 对阵 " + getClubDisplayName(opponent);
    return {
      text: benefited
        ? fixture + " 的欧冠淘汰赛出现连续争议判罚，球队在巨大质疑声中改变了比赛走势。这一夜多年后仍被对手球迷反复提起。"
        : fixture + " 的欧冠淘汰赛被连续争议判罚彻底改变，这一夜成为俱乐部历史上的判罚惨案。",
      effects: benefited
        ? { reputation: -3, happiness: -2, coachRelation: 1 }
        : { reputation: 1, happiness: -7, fitness: -3 }
    };
  }

  function buildBallonDorControversy(player, club, stats, trophies, seasonOutlook) {
    var previousControversies = (player.career || []).filter(function (season) {
      return Boolean(season.ballonDorControversy);
    });
    if (
      !player.pendingBallonDorNomination ||
      trophies.indexOf("金球奖") !== -1 ||
      stats.appearances < 30 ||
      previousControversies.length >= 2
    ) {
      return "";
    }
    if (
      previousControversies.length &&
      player.age - previousControversies[previousControversies.length - 1].age < 4
    ) {
      return "";
    }
    var output = stats.goals + stats.assists;
    var majorTitleBonus =
      (seasonOutlook.continentalChampion === "欧冠冠军" ? 7 : 0) +
      (seasonOutlook.leagueChampion ? 3 : 0) +
      (seasonOutlook.worldChampion ? 2 : 0);
    var robberyScore =
      player.overall +
      Math.min(18, output * 0.22) +
      majorTitleBonus;
    if (
      robberyScore < 105 &&
      !(player.overall >= 93 && stats.goals >= 35 && output >= 55)
    ) {
      return "";
    }
    var controversyChance = previousControversies.length ? 0.18 : 0.34;
    if (player.overall >= 94 && output >= 60) {
      controversyChance += 0.08;
    }
    if (Math.random() >= controversyChance) {
      return "";
    }
    var rivalClubs = window.CLUBS.filter(function (candidate) {
      return candidate.id !== club.id &&
        candidate.band === "豪门" &&
        candidate.leagueLevel === 1;
    }).sort(function (a, b) {
      return (b.reputation || 0) - (a.reputation || 0);
    }).slice(0, 10);
    var winnerClub = rivalClubs.length ? pickOne(rivalClubs) : club;
    return "评奖夜爆出巨大争议：" + getClubDisplayName(winnerClub) +
      " 的头号球星最终捧走金球奖。多家媒体认为你的赛季表现明显更有说服力，直言对方从你手里“偷走”了金球。";
  }

  function buildDynastyMoments(player, club, trophies, nationalSummary) {
    var moments = [];
    var competitionNames = getCompetitionNames(club);
    var leagueTitle = competitionNames.leagueTitle;
    var previousLeagueWins = getConsecutiveClubTrophyWins(player, club.id, leagueTitle);
    var previousChampionsLeagueWins = getConsecutiveClubTrophyWins(player, club.id, "欧冠冠军");

    if (trophies.indexOf(leagueTitle) !== -1 && previousLeagueWins >= 1) {
      var leagueStreak = previousLeagueWins + 1;
      moments.push({
        name: leagueStreak >= 3 ? "联赛王朝·" + leagueStreak + "连冠" : "联赛卫冕",
        icon: "♛",
        text: getClubDisplayName(club) + " 连续第 " + leagueStreak + " 个赛季赢得" +
          leagueTitle + "，你们已经建立起国内赛场的统治周期。"
      });
    }
    if (trophies.indexOf("欧冠冠军") !== -1 && previousChampionsLeagueWins >= 1) {
      var championsLeagueStreak = previousChampionsLeagueWins + 1;
      moments.push({
        name: championsLeagueStreak >= 3 ? "欧冠王朝·" + championsLeagueStreak + "连冠" : "欧冠卫冕",
        icon: "♚",
        text: getClubDisplayName(club) + " 连续第 " + championsLeagueStreak +
          " 次登上欧洲之巅，这支球队正在定义一个欧冠时代。"
      });
    }
    if (
      nationalSummary.honors.indexOf("世界杯冠军") !== -1 &&
      didWinPreviousNationalTournament(player, "世界杯", "世界杯冠军")
    ) {
      moments.push({
        name: "世界杯卫冕",
        icon: "🌍",
        text: player.country + " 连续两届赢得世界杯，你作为两次夺冠阵容的一员完成了足坛最罕见的国家队王朝。"
      });
    }
    return moments;
  }

  function didWinPreviousNationalTournament(player, competitionName, honorName) {
    for (var i = player.career.length - 1; i >= 0; i -= 1) {
      var entry = player.career[i];
      if (entry.nationalCompetitionName !== competitionName) continue;
      return (entry.nationalHonors || []).indexOf(honorName) !== -1;
    }
    return false;
  }

  function getBestYoungPlayerChance(player, stats) {
    var output = stats.goals + stats.assists;
    var candidateScore =
      (player.overall - 74) * 0.035 +
      Math.max(0, stats.appearances - 24) * 0.008 +
      output * 0.008;
    return clamp(0.12 + candidateScore, 0.12, 0.52);
  }

  function isCompetitionChampionship(name) {
    return typeof name === "string" && name.indexOf("冠军") !== -1;
  }

  function isTopLevelChampionship(name) {
    if (!isCompetitionChampionship(name)) return false;
    return /世界杯冠军|欧洲杯冠军|亚洲杯冠军|美洲杯冠军|非洲杯冠军|中北美金杯赛冠军|大洋洲国家杯冠军|欧冠冠军|亚冠冠军|世俱杯冠军|洲际杯冠军|英超冠军|西甲冠军|德甲冠军|意甲冠军|法甲冠军|中超冠军|J1联赛冠军|K1联赛冠军|沙特联冠军|泰超冠军|马来超冠军/.test(name);
  }

  function canFormerClubMakeOffer(player, club, summary) {
    var departures = (player.transferHistory || []).filter(function (transfer) {
      return transfer.fromClubId === club.id;
    });
    if (!departures.length) {
      return true;
    }

    var latestDeparture = departures.reduce(function (latest, transfer) {
      return !latest || transfer.seasonYear > latest.seasonYear ? transfer : latest;
    }, null);
    var seasonsSinceDeparture = player.seasonYear - latestDeparture.seasonYear;
    if (seasonsSinceDeparture < 4) {
      return false;
    }

    var clubStrength = getClubStrength(club);
    var sportingCase =
      player.status.reputation >= 72 &&
      summary.appearances >= 24 &&
      player.overall >= clubStrength - 4;
    return sportingCase && Math.random() < 0.08;
  }

  function getSeasonAchievements(player, club, stats, trophies, nationalSummary, legendStory, seasonOutlook, ballonDorControversy) {
    var competitionNames = getCompetitionNames(club);
    var wonLeague = trophies.indexOf(competitionNames.leagueTitle) !== -1;
    var wonDomesticCup = trophies.indexOf(competitionNames.domesticCup) !== -1;
    var wonChampionsLeague = trophies.indexOf("欧冠冠军") !== -1;
    var achievements = [];
    var leagueStanding = seasonOutlook && seasonOutlook.leagueStanding;

    if (club.leagueLevel === 1 && wonLeague && wonDomesticCup && wonChampionsLeague) {
      achievements.push("三冠王");
    }
    if (leagueStanding && club.leagueLevel >= 2 && leagueStanding.position <= 2) {
      achievements.push("直接升级");
    } else if (leagueStanding && club.leagueLevel === 2 && leagueStanding.status === "升级附加赛区") {
      achievements.push("升级附加赛资格");
    }
    if (leagueStanding && leagueStanding.status === "降级区") {
      achievements.push("联赛降级");
    }
    if (nationalSummary.honors.indexOf("世界杯冠军") !== -1) {
      achievements.push("世界冠军");
    }
    if (nationalSummary.runnerUp) {
      achievements.push((nationalSummary.competitionName || "国家队赛事") + "亚军");
    }
    if (seasonOutlook && seasonOutlook.continentalRunnerUp) {
      achievements.push((seasonOutlook.continentalRunnerUpName || "洲际赛事") + "亚军");
    }
    if (trophies.indexOf("世俱杯冠军") !== -1) {
      achievements.push("世界俱乐部冠军");
    }
    if (stats.goals >= 40) {
      achievements.push("单季40球");
    }
    if (
      stats.assists >= 27 ||
      (stats.assists >= 24 && stats.appearances <= 40)
    ) {
      achievements.push("助攻纪录级赛季");
    } else if (stats.assists >= 18) {
      achievements.push("助攻大师");
    }
    if (["CB", "LB", "RB"].indexOf(player.position) !== -1 && stats.goals >= 8) {
      achievements.push("后卫进球纪录");
    }
    if (stats.appearances >= 41) {
      achievements.push("全勤铁人");
    }
    if (trophies.indexOf("金球奖") !== -1) {
      achievements.push("世界最佳球员");
    } else if (ballonDorControversy) {
      achievements.push("金球争议");
    } else if (player.pendingBallonDorNomination) {
      achievements.push("金球奖候选");
    }
    if (legendStory) {
      achievements.push("传奇时刻");
      if (/九分钟.{0,4}五球|短短.{0,8}五球/.test(legendStory)) {
        achievements.push("超神五球");
      } else if (legendStory.indexOf("独中五元") !== -1) {
        achievements.push("独中五元");
      } else if (legendStory.indexOf("大四喜") !== -1) {
        achievements.push("大四喜");
      }
    }
    return achievements;
  }

  function simulateClubSeasonOutlook(player, club, stats, competitionStats) {
    var clubStrength = getClubStrength(club);
    var participation = clamp(stats.appearances / 32, 0.2, 1);
    var playerImpact = clamp((player.overall - clubStrength) * 0.12, -1.5, 2.5) * participation;
    var teamPower = clubStrength + playerImpact;
    var competitionImpact = player.pendingSeasonCompetitionImpact || {};
    var rosterTeams = window.LEAGUE_ROSTERS && window.LEAGUE_ROSTERS[club.league];
    var leagueTeams = rosterTeams && rosterTeams.length
      ? rosterTeams.slice()
      : window.CLUBS.filter(function (candidate) {
          return candidate.league === club.league;
        });
    if (!leagueTeams.some(function (candidate) { return candidate.id === club.id; })) {
      leagueTeams[leagueTeams.length - 1] = club;
    }
    var configuredTeamCount = LEAGUE_TEAM_COUNTS[club.league] || leagueTeams.length;
    if (leagueTeams.length > configuredTeamCount) {
      leagueTeams = leagueTeams.filter(function (candidate) {
        return candidate.id !== club.id;
      }).sort(function (first, second) {
        return Math.abs(getClubStrength(first) - clubStrength) -
          Math.abs(getClubStrength(second) - clubStrength);
      }).slice(0, Math.max(1, configuredTeamCount - 1));
      leagueTeams.push(club);
    }
    var fullLeagueSeason = window.LeagueSimulation && leagueTeams.length >= 2
      ? window.LeagueSimulation.simulateFullLeagueSeason({
          leagueId: club.league,
          teams: leagueTeams,
          player: player,
          playerClubId: club.id,
          seasonYear: player.seasonYear,
          matches: LEAGUE_MATCH_COUNTS[club.league],
          seasonStats: {
            appearances: competitionStats ? competitionStats.league : stats.appearances,
            leagueAvailable: competitionStats ? competitionStats.leagueAvailable : 34,
            goals: stats.leagueGoals,
            assists: stats.leagueAssists
          },
          playerClubPowerBonus: clamp((competitionImpact.leaguePoints || 0) * 0.28, -1.5, 2.5)
        })
      : null;
    if (
      fullLeagueSeason &&
      competitionImpact.forceLeagueChampion &&
      window.LeagueSimulation.forceClubChampion
    ) {
      window.LeagueSimulation.forceClubChampion(fullLeagueSeason, club.id);
    }
    if (fullLeagueSeason) {
      fullLeagueSeason.table.forEach(function (row) {
        var tableClub = getClubById(row.clubId) ||
          leagueTeams.find(function (candidate) { return candidate.id === row.clubId; });
        if (tableClub) row.clubName = getClubDisplayName(tableClub);
      });
    }
    var playerLeagueRow = fullLeagueSeason && fullLeagueSeason.table.find(function (row) {
      return row.clubId === club.id;
    });
    var leagueStanding = playerLeagueRow
      ? {
          position: playerLeagueRow.position,
          points: playerLeagueRow.points,
          teamCount: fullLeagueSeason.table.length,
          status: getLeagueStandingStatus(club, playerLeagueRow.position, fullLeagueSeason.table.length),
          played: playerLeagueRow.played,
          wins: playerLeagueRow.wins,
          draws: playerLeagueRow.draws,
          losses: playerLeagueRow.losses,
          goalsFor: playerLeagueRow.goalsFor,
          goalsAgainst: playerLeagueRow.goalsAgainst,
          goalDifference: playerLeagueRow.goalDifference
        }
      : simulateLeagueStanding(club, teamPower, teamPower + randomInt(-12, 12));
    var leagueChampion = leagueStanding.position === 1;
    var topFinish = club.leagueLevel === 1
      ? leagueStanding.position <= Math.min(6, leagueStanding.teamCount)
      : leagueStanding.position <= Math.min(6, leagueStanding.teamCount);
    var domesticCupWinner = competitionStats ? competitionStats.domesticCupWinner : false;
    if (club.region === "欧洲" && club.leagueLevel === 1) {
      leagueStanding.status = getEuropeanQualificationStatus(
        club,
        leagueStanding.position,
        domesticCupWinner
      ) || (
        leagueStanding.position <= Math.ceil(leagueStanding.teamCount / 2)
          ? "联赛上半区"
          : "联赛下半区"
      );
    }
    var continentalChampion = competitionStats ? competitionStats.continentalChampion : "";
    var worldChampion = false;
    var specialStory = "";
    var continentalRunnerUp = competitionStats ? competitionStats.continentalRunnerUp : false;
    var continentalRunnerUpName = continentalRunnerUp && competitionStats
      ? competitionStats.continentalName
      : "";
    var finalDecision = player.pendingCompetitionOutcome;

    if (finalDecision && finalDecision.type === "champions-league") {
      continentalChampion = finalDecision.won ? "欧冠冠军" : "";
      continentalRunnerUp = !finalDecision.won;
      specialStory = finalDecision.story;
    }

    if (
      leagueChampion &&
      domesticCupWinner &&
      continentalChampion === "欧冠冠军"
    ) {
      var trebleConfirmationChance = teamPower >= 92 ? 0.1 : teamPower >= 88 ? 0.035 : 0.008;
      if (Math.random() > trebleConfirmationChance) {
        domesticCupWinner = false;
      }
    }

    if ((continentalChampion === "欧冠冠军" || continentalChampion === "亚冠冠军") && teamPower >= 92 && randomInt(0, 100) > 74) {
      worldChampion = true;
    }

    if (
      leagueChampion &&
      domesticCupWinner &&
      continentalChampion === "欧冠冠军" &&
      club.band !== "豪门"
    ) {
      specialStory = getClubDisplayName(club) + " 完成了赛季开始前几乎无人敢想的三冠王。联赛、国内杯赛和欧冠同时到手，这次奇迹彻底改写了俱乐部的历史地位。";
    } else if (
      leagueChampion &&
      club.region === "欧洲" &&
      club.leagueLevel === 1 &&
      club.band === "练级队" &&
      club.strength <= 76
    ) {
      specialStory = "你所在的 " + getClubDisplayName(club) + " 完成了震惊足坛的黑马夺冠，赛季开始前几乎没有人相信这一切会发生。";
    } else if (
      leagueChampion &&
      club.region === "欧洲" &&
      club.leagueLevel === 1 &&
      club.band === "强队" &&
      club.strength <= 82 &&
      randomInt(1, 1000) <= 260
    ) {
      specialStory = getClubDisplayName(club) + " 击败多支传统豪门夺得联赛冠军，这座意外而珍贵的奖杯改变了俱乐部历史。";
    } else if (
      !leagueChampion &&
      leagueStanding.position === 2 &&
      club.region === "欧洲" &&
      club.leagueLevel === 1 &&
      (club.band === "豪门" || teamPower >= 90) &&
      randomInt(1, 1000) <= 180
    ) {
      specialStory = getClubDisplayName(club) + " 曾长期占据积分榜首位，却在冲刺阶段连续失分，最终被竞争对手完成逆转。";
    }

    if (finalDecision && finalDecision.type === "champions-league") {
      specialStory = finalDecision.story;
    }

    return {
      leagueChampion: leagueChampion,
      leagueStanding: leagueStanding,
      leagueSimulation: fullLeagueSeason,
      topFinish: topFinish,
      domesticCupWinner: domesticCupWinner,
      continentalChampion: continentalChampion,
      continentalRunnerUp: continentalRunnerUp,
      continentalRunnerUpName: continentalRunnerUpName,
      worldChampion: worldChampion,
      specialStory: specialStory
    };
  }

  function buildDynamicTitleDroughtStory(player, club, leagueStanding, competitionStats) {
    if (!leagueStanding || leagueStanding.position === 1 || club.leagueLevel !== 1) return "";
    var titleProfile = CLUB_TITLE_PROFILES[club.id] || 0;
    if (!titleProfile && club.band !== "豪门") return "";
    var form = ensureClubForm(club);
    var economy = ensureClubEconomy(club);
    var board = getBoardStability(club);
    var clubName = getClubDisplayName(club);
    var reasons = [];

    if (economy <= -3) {
      reasons.push(
        clubName + " 的引援预算和薪资空间受到限制，关键位置没有得到足够补强，争冠阵容的厚度明显不足。",
        clubName + " 在转会市场上难以完成首要目标，替补席与主要竞争对手的差距在赛季后半程被放大。"
      );
    }
    if (board < 60) {
      reasons.push(
        clubName + " 的管理层目标反复变化，教练组难以建立长期稳定的比赛框架。",
        clubName + " 经历了管理层与教练团队的磨合，阵容规划缺少连续性，赛季中多次被迫调整方向。"
      );
    }
    if (form <= -4) {
      reasons.push(
        clubName + " 在赛季中段陷入持续低迷，面对密集赛程时连续丢分，最终失去了追赶空间。",
        clubName + " 的状态起伏贯穿整个赛季，强强对话偶有亮点，却没能稳定拿下必须赢的比赛。"
      );
    }
    if ((player.pendingSeasonInjury && player.pendingSeasonInjury.matchesMissed >= 8) ||
        player.status.fitness < 58) {
      reasons.push(
        clubName + " 遭遇了关键球员伤停和体能问题，主力框架被频繁打乱，收官阶段的稳定性受到影响。",
        clubName + " 的伤病名单一度过长，轮换阵容承担了超出预期的比赛量，争冠节奏因此中断。"
      );
    }
    if (competitionStats && competitionStats.continental >= 10) {
      reasons.push(
        clubName + " 在欧战中投入了大量精力，阵容深度不足以长期承受多线高强度消耗。",
        clubName + " 的欧战征程拉长了赛程，联赛关键阶段的轮换效果没有达到预期。"
      );
    }
    if (leagueStanding.position <= 3) {
      reasons.push(
        clubName + " 始终留在争冠集团，但收官阶段的直接对话没能把握住机会，冠军最终旁落。",
        clubName + " 将悬念维持到了赛季后段，只是几场本应拿下的比赛丢分，最终与冠军擦肩而过。"
      );
    } else if (leagueStanding.position <= 6) {
      reasons.push(
        clubName + " 的主力阵容仍具竞争力，但攻守转换和轮换质量不够稳定，未能持续留在争冠集团。",
        clubName + " 在强队身上拿到过关键分数，却频繁在中下游球队面前失手，排名因此停滞。"
      );
    } else {
      reasons.push(
        clubName + " 经历了明显的低谷赛季，阵容更新与新体系磨合同时进行，早早退出冠军竞争。",
        clubName + " 的核心框架出现老化和伤停，年轻球员尚未完全接班，赛季表现远低于预期。"
      );
    }
    var recentLines = (player.career || []).slice(-5).map(function (season) {
      return season.titleDroughtStory;
    }).filter(Boolean);
    var freshReasons = reasons.filter(function (reason) {
      return recentLines.indexOf(reason) === -1;
    });
    return pickOne(freshReasons.length ? freshReasons : reasons);
  }

  function buildTitleDroughtStory(club, leagueStanding) {
    if (!leagueStanding || leagueStanding.position === 1 || club.leagueLevel !== 1) return "";
    var titleProfile = CLUB_TITLE_PROFILES[club.id] || 0;
    if (!titleProfile && club.band !== "豪门") return "";
    var form = ensureClubForm(club);
    var economy = ensureClubEconomy(club);
    var board = getBoardStability(club);
    var clubName = getClubDisplayName(club);

    if (economy <= -4) {
      return clubName + " 的阵容补强受到财务空间限制，替补深度不足让球队在争冠后程持续失分。";
    }
    if (board < 60 || form <= -5) {
      return clubName + " 正处于管理层和战术重建期，频繁调整让球队始终没有形成稳定的争冠节奏。";
    }
    if (leagueStanding.position <= 3) {
      return clubName + " 一直留在争冠集团，但强强对话和收官阶段的失分让冠军再次旁落。";
    }
    if (leagueStanding.position <= 6) {
      return clubName + " 的主力阵容仍有竞争力，但伤停、轮换深度和攻守失衡拖累了漫长联赛。";
    }
    return clubName + " 经历了明显的低谷赛季，阵容老化与新体系磨合令球队早早退出冠军竞争。";
  }

  function simulateLeagueStanding(club, teamPower, leagueRoll) {
    var matches = LEAGUE_MATCH_COUNTS[club.league] || (club.leagueLevel === 2 ? 38 : 34);
    var teamCount = LEAGUE_TEAM_COUNTS[club.league] || Math.max(12, Math.round(matches / 2) + 1);
    var pointsPerMatch = clamp(
      1.28 + (teamPower - 75) * 0.034 + (leagueRoll - teamPower) * 0.018,
      0.55,
      2.55
    );
    var points = clamp(Math.round(matches * pointsPerMatch), 12, matches * 3);
    var powerPosition = clamp(
      Math.round(1 + (2.48 - pointsPerMatch) / 1.92 * (teamCount - 1)),
      1,
      teamCount
    );
    var prior = CLUB_LEAGUE_PRIORS[club.id];
    var position = powerPosition;
    if (prior && club.leagueLevel === 1) {
      position = Math.round(
        prior.expected * 0.62 +
        powerPosition * 0.38 +
        (Math.random() * 2 - 1) * prior.volatility
      );
      if (Math.random() < prior.shockChance) {
        position = randomInt(Math.max(prior.normalMax + 1, position), prior.shockMax);
      } else {
        position = Math.min(position, prior.normalMax);
      }
      position = clamp(position, 1, teamCount);
      var historicTitleChance = CLUB_TITLE_PROFILES[club.id] || 0;
      if (historicTitleChance && position <= 3) {
        var formAdjustment = ensureClubForm(club) * 0.025;
        var economyAdjustment = ensureClubEconomy(club) * 0.012;
        if (Math.random() < clamp(historicTitleChance + formAdjustment + economyAdjustment, 0.04, 0.82)) {
          position = 1;
        }
      }
      pointsPerMatch = clamp(
        2.42 - ((position - 1) / Math.max(1, teamCount - 1)) * 1.62 + (Math.random() * 0.12 - 0.06),
        0.62,
        2.55
      );
      points = clamp(Math.round(matches * pointsPerMatch), 12, matches * 3);
    }
    var pointsProfile = LEAGUE_POINTS_PROFILES[club.league];
    if (pointsProfile && club.leagueLevel === 1) {
      var rankRatio = (position - 1) / Math.max(1, teamCount - 1);
      var profiledPpm = rankRatio <= 0.5
        ? pointsProfile.top + (pointsProfile.middle - pointsProfile.top) * (rankRatio / 0.5)
        : pointsProfile.middle + (pointsProfile.bottom - pointsProfile.middle) * ((rankRatio - 0.5) / 0.5);
      points = clamp(
        Math.round(matches * (profiledPpm + (Math.random() * 0.1 - 0.05))),
        12,
        matches * 3
      );
    }
    var status = getLeagueStandingStatus(club, position, teamCount);
    return {
      position: position,
      points: points,
      teamCount: teamCount,
      status: status
    };
  }

  function getLeagueStandingStatus(club, position, teamCount) {
    if (position === 1) return club.leagueLevel >= 2 ? "联赛冠军并直接升级" : "联赛冠军";
    if (club.leagueLevel >= 3) {
      if (position <= 2) return "直接升级";
      if (position <= 6) return "升级附加赛区";
      if (position > teamCount - 3) return "保级成功";
      return position <= Math.ceil(teamCount / 2) ? "联赛上半区" : "联赛下半区";
    }
    if (club.leagueLevel === 2) {
      if (position <= 2) return "直接升级";
      if (position <= (club.league === "EFL Championship" ? 6 : 3)) return "升级附加赛区";
      if (position > teamCount - 3) return "降级区";
      return "联赛中游";
    }
    if (club.region === "欧洲") {
      var qualificationStatus = getEuropeanQualificationStatus(club, position, false);
      if (qualificationStatus) return qualificationStatus;
      if (club.league === "Bundesliga" && position === 16) return "保级附加赛";
      if (position > teamCount - (club.league === "Bundesliga" ? 2 : 3)) return "降级区";
      return position <= Math.ceil(teamCount / 2) ? "联赛上半区" : "联赛下半区";
    }
    if (position <= 3) return "洲际赛事资格区";
    if (position > teamCount - 2) return "降级区";
    return position <= Math.ceil(teamCount / 2) ? "联赛上半区" : "联赛下半区";
  }

  function getEuropeanQualificationStatus(club, position, domesticCupWinner) {
    var rules = EUROPEAN_QUALIFICATION_RULES[club.league];
    if (!rules) return "";
    if (position <= rules.championsLeague) return "欧冠区";
    if (rules.championsLeagueQualifying && position === rules.championsLeagueQualifying) {
      return "欧冠资格赛区";
    }
    if (domesticCupWinner) return rules.cupWinner === "欧联杯" ? "欧联区" : "欧协联区";
    if (position === rules.europaLeague) return "欧联区";
    if (position === rules.conferenceLeague) return "欧协联区";
    return "";
  }

  function buildLegacyLegendStory(player, club, stats, trophies, seasonOutlook) {
    var combinedOutput = stats.goals + stats.assists;
    var championsLeagueWin = trophies.indexOf("欧冠冠军") !== -1;
    var ballonDorWin = trophies.indexOf("金球奖") !== -1;

    if (
      (player.position === "ST" || player.position === "LW" || player.position === "RW") &&
      stats.goals >= 38 &&
      combinedOutput >= 50 &&
      randomInt(1, 1000) <= 12
    ) {
      return "你交出了足以载入纪录册的夸张火力，整整一年都在用进球把外界的想象力往上抬。";
    }

    if (
      !ballonDorWin &&
      player.overall >= 91 &&
      player.status.reputation >= 85 &&
      combinedOutput >= 32 &&
      randomInt(1, 1000) <= 14
    ) {
      return "你交出了金球级别的赛季答卷，却在评奖夜意外落选，媒体为此吵了很久。";
    }

    if (
      club.id === "madrid-royal" &&
      championsLeagueWin &&
      getConsecutiveClubTrophyWins(player, club.id, "欧冠冠军") >= 2 &&
      randomInt(1, 1000) <= 18
    ) {
      return "你亲历了欧冠王朝的延续，连续站上欧洲之巅，这支球队已经开始定义一个时代。";
    }

    if (
      club.id === "liverpool" &&
      championsLeagueWin &&
      randomInt(1, 1000) <= 18
    ) {
      return "你所在的 " + getClubDisplayName(club) + " 在欧战决赛绝境中完成惊天逆转，更衣室赛后彻底陷入狂欢。";
    }

    if (
      club.id === "london-blue" &&
      seasonOutlook.topFinish &&
      !championsLeagueWin &&
      player.status.reputation >= 72 &&
      randomInt(1, 1000) <= 16
    ) {
      return "你经历了一场充满争议判罚的欧战淘汰赛，终场后球员、教练和媒体都在质疑比赛结果。";
    }

    if (
      trophies.length === 0 &&
      combinedOutput >= 28 &&
      player.status.reputation >= 76 &&
      randomInt(1, 1000) <= 20
    ) {
      return "你度过了一个极为悲情的赛季，个人数据耀眼，却仍与所有冠军和最高舞台的掌声擦肩而过。";
    }

    return "";
  }

  function buildSingleMatchScoringStory(player, club, stats) {
    if (
      ["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(player.position) === -1 ||
      stats.appearances < 18
    ) {
      return "";
    }
    var profile = getEffectivePlayerProfile(player);
    var scoringAbility =
      profile.finishing * 0.58 +
      profile.offBall * 0.27 +
      player.overall * 0.15;
    var opponent = pickLeagueOpponent(club);
    var fixture = getLeagueDisplayName(club.league) + "对阵 " +
      (opponent ? getClubDisplayName(opponent) : "同级别劲敌");
    var fiveGoalChance = clamp(
      0.004 +
      Math.max(0, stats.goals - 24) * 0.0018 +
      Math.max(0, scoringAbility - 85) * 0.0015,
      0.004,
      0.04
    );
    if (
      stats.goals >= 24 &&
      scoringAbility >= 84 &&
      Math.random() < fiveGoalChance
    ) {
      if (
        player.overall >= 89 &&
        stats.goals >= 30 &&
        Math.random() < 0.22
      ) {
        return fixture + "，你替补登场后在短短九分钟内连入五球，" +
          "用一场几乎无法复制的超神表演彻底击溃对手。";
      }
      return fixture + "，你独中五元，以五种不同方式完成终结，" +
        "这场比赛成为整个赛季最不可思议的个人演出。";
    }
    var fourGoalChance = clamp(
      0.012 +
      Math.max(0, stats.goals - 18) * 0.0035 +
      Math.max(0, scoringAbility - 82) * 0.002,
      0.012,
      0.11
    );
    if (
      stats.goals >= 18 &&
      scoringAbility >= 80 &&
      Math.random() < fourGoalChance
    ) {
      return fixture + "，你上演大四喜，四次洞穿球门直接把一场焦点战变成了个人表演。";
    }
    return "";
  }

  function buildUniversalLegendStory(player, club, stats, trophies, seasonOutlook, nationalSummary) {
    var combinedOutput = stats.goals + stats.assists;
    var isAttacker = ["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(player.position) !== -1;
    var isDefender = ["CB", "LB", "RB"].indexOf(player.position) !== -1;
    var championsLeagueWin = trophies.indexOf("欧冠冠军") !== -1;
    var ballonDorWin = trophies.indexOf("金球奖") !== -1;
    var leagueChampion = seasonOutlook && seasonOutlook.leagueChampion;
    var nationalHonors = nationalSummary ? nationalSummary.honors : [];
    var worldCupWin = nationalHonors.indexOf("世界杯冠军") !== -1;
    var candidates = [];

    function addStory(condition, chance, text) {
      if (condition && randomInt(1, 1000) <= chance) {
        candidates.push(text);
      }
    }

    addStory(
      player.age <= 20 &&
      nationalSummary &&
      nationalSummary.competitionName === "世界杯" &&
      (nationalSummary.goals >= 4 || worldCupWin) &&
      player.status.reputation >= 55,
      42,
      "你在世界杯上一炮而红：年纪轻轻就在淘汰赛撕开强敌防线，一夜之间从新星变成全球焦点。"
    );
    addStory(
      isAttacker && stats.goals >= 38 && combinedOutput >= 50,
      34,
      "你交出了历史级的夸张火力，进球、助攻和关键战表现让整个足坛开始讨论纪录还能被推到多高。"
    );
    addStory(
      isAttacker && stats.goals >= 28 && championsLeagueWin && player.status.reputation >= 78,
      38,
      "你走出了一条巨星封王轨迹：淘汰赛连续破门，并在欧冠决赛贡献决定性进球，亲手把奖杯带回俱乐部。"
    );
    addStory(
      championsLeagueWin && combinedOutput >= 18 && player.status.reputation >= 72,
      32,
      "球队在欧冠决赛一度陷入绝境，你参与导演了史诗级逆转。这场比赛从此成为俱乐部历史反复播放的经典。"
    );
    addStory(
      championsLeagueWin &&
      getConsecutiveClubTrophyWins(player, club.id, "欧冠冠军") >= 2 &&
      player.status.reputation >= 80,
      34,
      "你成为欧冠王朝的核心人物，连续多个赛季登上欧洲之巅，外界开始用一个时代来定义你和这支球队。"
    );
    addStory(
      ballonDorWin && player.age <= 23 && combinedOutput >= 30,
      38,
      "你以超乎年龄的统治力赢得金球奖，成为足坛新旧时代交替的标志，所有豪门都开始围绕你的未来制定计划。"
    );
    addStory(
      leagueChampion && stats.goals >= 22 && player.status.reputation >= 70,
      34,
      "争冠最后阶段你连续进球，在决定冠军归属的收官战完成绝杀，硬生生把一度旁落的联赛冠军抢了回来。"
    );
    addStory(
      isAttacker && stats.goals >= 30 && stats.appearances <= 30,
      30,
      "你完成了近乎场均一球的爆发赛季，有限的出场时间反而让每次触球都显得危险，对手开始专门改变防守站位来限制你。"
    );
    addStory(
      (player.position === "CM" || player.position === "CAM") &&
      stats.assists >= 16 &&
      player.status.reputation >= 72,
      34,
      "你踢出了大师级中场赛季，多次在强强对话中送出穿透整条防线的传球，成为球队真正的节拍器。"
    );
    addStory(
      isDefender &&
      stats.appearances >= 30 &&
      trophies.length >= 2 &&
      player.status.reputation >= 68,
      32,
      "你以防线领袖身份完成双冠赛季，几次门线解围和决赛封堵被球迷视为与进球同等重要的冠军瞬间。"
    );
    addStory(
      player.position === "GK" &&
      stats.appearances >= 28 &&
      championsLeagueWin,
      38,
      "你在欧冠淘汰赛连续扑出必进球，并在决赛点球大战完成决定性扑救，门将第一次成为整座城市庆典的主角。"
    );
    addStory(
      worldCupWin &&
      nationalSummary &&
      nationalSummary.goals >= 3 &&
      player.status.reputation >= 70,
      38,
      "你在世界杯淘汰赛连续贡献关键表现，并在决赛留下决定性瞬间，从国家队主力一跃成为全民英雄。"
    );
    addStory(
      player.status.fitness < 58 &&
      stats.appearances >= 20 &&
      combinedOutput >= 16,
      28,
      "伤病几乎毁掉了你的赛季，但复出后的第一场关键战你便直接决定胜负，这次回归被媒体称为奇迹般的重生。"
    );
    addStory(
      stats.appearances < 20 &&
      combinedOutput >= 12 &&
      trophies.length >= 1,
      30,
      "你大部分时间只能等待机会，却在最重要的决赛替补登场后完成绝杀，从边缘人瞬间变成冠军英雄。"
    );

    return candidates.length && Math.random() < 0.82 ? pickOne(candidates) : "";
  }

  function getLeagueChampionThreshold(club) {
    var threshold = club.leagueLevel === 1 ? 96 : 90;
    var leagueDifficulty = {
      "Premier League": 4,
      "Serie A": 3,
      "LALIGA EA SPORTS": 2,
      "Bundesliga": 2,
      "Ligue 1 McDonald's": 0
    };
    threshold += leagueDifficulty[club.league] || 0;

    if (club.region === "欧洲" && club.leagueLevel === 1) {
      if (club.band !== "豪门") {
        threshold += 4;
      }
      if (club.strength <= 80) {
        threshold += 2;
      }
      if (club.reputation <= 80) {
        threshold += 1;
      }
    }

    if (club.region === "亚洲" && club.leagueLevel === 1 && club.band !== "豪门") {
      threshold += 1;
    }

    return threshold;
  }

  function getCompetitionNames(club) {
    var leagueLabel = getLeagueDisplayName(club.league);
    var leagueTitles = {
      "Premier League": "英超冠军",
      "EFL Championship": "英冠冠军",
      "EFL League One": "英甲冠军",
      "LALIGA EA SPORTS": "西甲冠军",
      "LALIGA HYPERMOTION": "西乙冠军",
      "Primera Federación": "西协甲冠军",
      "Bundesliga": "德甲冠军",
      "2. Bundesliga": "德乙冠军",
      "3. Liga": "德丙冠军",
      "Serie A": "意甲冠军",
      "Serie BKT": "意乙冠军",
      "Serie C": "意丙冠军",
      "Ligue 1 McDonald's": "法甲冠军",
      "Ligue 2 BKT": "法乙冠军",
      "Championnat National": "法丙冠军",
      "J1 League": "日职联冠军",
      "J2 League": "日职乙冠军",
      "J3 League": "日职丙冠军",
      "K League 1": "韩K1联冠军",
      "K League 2": "韩K2联冠军",
      "K3 League": "韩国K3联赛冠军",
      "Chinese Super League": "中超冠军",
      "China League One": "中甲冠军",
      "China League Two": "中乙冠军",
      "Saudi Pro League": "沙特联冠军",
      "Saudi First Division": "沙特甲冠军",
      "Saudi Second Division": "沙特乙冠军",
      "Thai League 1": "泰超冠军",
      "Thai League 2": "泰甲冠军",
      "Malaysia Super League": "马来超冠军",
      "Malaysia A1 Semi-Pro League": "马来西亚A1联赛冠军"
    };
    var domesticCups = {
      "Premier League": "足总杯冠军",
      "EFL Championship": "联赛杯冠军",
      "LALIGA EA SPORTS": "国王杯冠军",
      "LALIGA HYPERMOTION": "国王杯冠军",
      "Bundesliga": "德国杯冠军",
      "2. Bundesliga": "德国杯冠军",
      "Serie A": "意大利杯冠军",
      "Serie BKT": "意大利杯冠军",
      "Ligue 1 McDonald's": "法国杯冠军",
      "Ligue 2 BKT": "法国杯冠军",
      "J1 League": "天皇杯冠军",
      "J2 League": "天皇杯冠军",
      "K League 1": "韩国杯冠军",
      "K League 2": "韩国杯冠军",
      "Chinese Super League": "足协杯冠军",
      "China League One": "足协杯冠军",
      "Saudi Pro League": "国王杯冠军",
      "Saudi First Division": "国王杯冠军",
      "Thai League 1": "泰国足总杯冠军",
      "Thai League 2": "泰国足总杯冠军",
      "Malaysia Super League": "马来西亚杯冠军",
      "Malaysia A1 Semi-Pro League": "马来西亚足总杯冠军"
    };
    return {
      leagueTitle: leagueTitles[club.league] || "联赛冠军",
      domesticCup: domesticCups[club.league] || "国内杯冠军",
      goldenBoot: leagueLabel + "金靴",
      assistAward: leagueLabel + "助攻王"
    };
  }

  function generateSeasonMoment(player, club, stats, trophies, derbyResult, nationalSummary, seasonOutlook, legendStory, ballonDorControversy, dynastyMoments) {
    var clubName = getClubDisplayName(club);
    var championshipTrophies = trophies.filter(function (name) {
      return name.indexOf("冠军") !== -1;
    });
    if (nationalSummary && nationalSummary.finalStory) {
      return nationalSummary.finalStory;
    }
    if (player.pendingMajorMatchStory) {
      return player.pendingMajorMatchStory;
    }
    if (ballonDorControversy) {
      return ballonDorControversy;
    }
    if (dynastyMoments && dynastyMoments.length) {
      return dynastyMoments[0].text;
    }
    if (seasonOutlook && seasonOutlook.specialStory && seasonOutlook.specialStory.indexOf("三冠王") !== -1) {
      return seasonOutlook.specialStory;
    }
    if (legendStory) {
      return legendStory;
    }
    if (
      player.pendingBallonDorNomination &&
      trophies.indexOf("金球奖") === -1
    ) {
      return "你进入了金球奖最终候选名单，但在评选中与奖杯擦肩而过。这次落选让下一年的每场关键比赛都多了一层证明意味。";
    }
    if (seasonOutlook && seasonOutlook.specialStory) {
      return seasonOutlook.specialStory;
    }
    if (nationalSummary && nationalSummary.honors.indexOf("世界杯冠军") !== -1) {
      return pickFreshSeasonLine(player, [
        "你随国家队登上了世界杯之巅，这一年注定会被整代球迷记住。",
        "世界杯决赛终场哨响时，你站在了世界最高领奖台上，整个赛季因此拥有了完全不同的意义。",
        "国家队最终捧起世界杯，你在最高级别舞台完成了职业生涯最重要的一次证明。"
      ]);
    }
    if (nationalSummary && nationalSummary.honors.length) {
      return pickFreshSeasonLine(player, [
        "你在" + nationalSummary.competitionName + "上留下了印记，国际赛场的资历开始快速累积。",
        "俱乐部赛季结束后，你又随国家队在" + nationalSummary.competitionName + "走到最后，声望开始越过联赛边界。",
        nationalSummary.competitionName + "成为这一年的另一条主线，你在国家队承担的责任明显增加。"
      ]);
    }
    if (derbyResult.note && derbyResult.reputationDelta >= 5) {
      return pickFreshSeasonLine(player, [
        derbyResult.note + "，这场胜利成为你本赛季最有分量的代表作。",
        derbyResult.note + "，赛后媒体把你列为这轮焦点战的决定性人物。",
        derbyResult.note + "，这次关键表现明显改变了外界对你赛季表现的评价。",
        derbyResult.note + "，主场球迷在赛季结束后仍反复谈起那个夜晚。",
        derbyResult.note + "，你在最高压力下交出的表现为整个赛季留下了清晰注脚。",
        derbyResult.note + "，这场比赛让你在队内和球迷心中的位置发生了变化。"
      ]);
    }
    if (derbyResult.note && derbyResult.reputationDelta < 0) {
      return derbyResult.note + "，这也成了外界反复提起的赛季阴影。";
    }
    if (derbyResult.note && derbyResult.forced) {
      return derbyResult.note + "，这是赛季最受关注的一场较量。";
    }
    var scoringProfile = getEffectivePlayerProfile(player);
    var scoringAbility =
      scoringProfile.finishing * 0.58 +
      scoringProfile.offBall * 0.27 +
      player.overall * 0.15;
    var hatTrickChance = clamp(
      0.04 +
      Math.max(0, stats.goals - 8) * 0.009 +
      Math.max(0, scoringAbility - 74) * 0.007,
      0.04,
      0.42
    );
    if (
      ["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(player.position) !== -1 &&
      stats.goals >= 10 &&
      Math.random() < hatTrickChance
    ) {
      var hatTrickOpponent = pickLeagueOpponent(club);
      var leagueMatchLabel = championshipTrophies.indexOf(getCompetitionNames(club).leagueTitle) !== -1
        ? getLeagueDisplayName(club.league) + "争冠关键战"
        : getLeagueDisplayName(club.league) + "焦点战";
      return leagueMatchLabel + "对阵 " + getClubDisplayName(hatTrickOpponent) +
        "，你完成帽子戏法，三次不同方式的终结直接决定了比赛结果。";
    }
    var braceChance = clamp(
      0.12 +
      Math.max(0, stats.goals - 6) * 0.012 +
      Math.max(0, scoringAbility - 72) * 0.008,
      0.12,
      0.62
    );
    if (
      ["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(player.position) !== -1 &&
      stats.goals >= 7 &&
      championshipTrophies.length &&
      Math.random() < braceChance
    ) {
      var keyMatch = getChampionshipMatchContext(club, championshipTrophies);
      return pickFreshSeasonLine(player, [
        keyMatch.stage + "对阵 " + keyMatch.opponent + "，你梅开二度，帮助 " + clubName + " 赢下比赛并捧起" + keyMatch.trophy + "。",
        keyMatch.stage + "面对 " + keyMatch.opponent + "，你连续完成两次致命终结，成为 " + clubName + " 夺得" + keyMatch.trophy + "的关键人物。",
        clubName + " 在" + keyMatch.stage + "对阵 " + keyMatch.opponent + "时一度陷入僵局，你用两粒进球改变了冠军归属。"
      ]);
    }
    if (player.position === "GK") {
      if (trophies.length) {
        return pickFreshSeasonLine(player, [
          "争冠阶段你多次守住微弱领先，" + clubName + " 最终捧杯离不开门前的稳定。",
          "你在几场淘汰赛中完成关键扑救，球队的冠军之路因此没有提前结束。",
          "赛季后半段你的失误明显减少，防线敢于前压，" + clubName + " 也顺势把优势兑现成奖杯。",
          "决赛中你顶住了对手最猛烈的一段攻势，终场哨响后队友第一时间冲向了你。",
          "这一年的冠军并不只属于进球者，你对禁区的控制和关键扑救同样改变了结果。",
          "在最需要门将站出来的时候，你连续化解险情，帮助 " + clubName + " 把冠军留到最后。"
        ]);
      }
      if (stats.appearances < 18) {
        return pickFreshSeasonLine(player, [
          "门将位置竞争一直很激烈，你还没有完全坐稳主力。",
          "整个赛季你只能零散获得机会，几次不错的扑救仍不足以改变教练的排序。",
          "杯赛和轮换场次是你主要的舞台，主力门将的位置暂时依旧稳固。",
          "你在替补席等待了很久，有限出场中的一次失误又让竞争变得更加困难。",
          "教练组认可你的训练状态，但在门将这个容错率极低的位置上，他们没有贸然换人。"
        ]);
      }
      return pickFreshSeasonLine(player, [
        "你开始更主动地指挥防线，许多危险在射门形成前就被提前化解。",
        "这一年没有太多夸张扑救，但你的站位和处理高球让后防明显安定下来。",
        "你逐渐适应了球队的出球要求，几次穿过逼抢的传球直接发动了反击。",
        "赛季中段曾连续出现低级失误，好在你及时调整，最终保住了主力位置。",
        "面对单刀时的判断比过去成熟许多，门线之外的活动范围也开始扩大。",
        "你的扑救数据并不耀眼，但稳定出勤和禁区控制让教练组越来越信任你。",
        "高位防线给你留下了大片身后空间，你在出击成功与冒险失误之间经历了明显起伏。",
        "几场零封让你赢得认可，但定位球防守中的犹豫仍是下一阶段必须解决的问题。"
      ]);
    }
    if (player.position === "CB" || player.position === "LB" || player.position === "RB") {
      if (trophies.length) {
        return pickFreshSeasonLine(player, [
          "你在防线里的存在感提升明显，回追和对抗成了冠军赛季的重要支撑。",
          "争冠冲刺期球队多次一球小胜，你在最后阶段的封堵和解围保住了这些积分。",
          "决赛里你几乎没有给对方核心留下空间，防守表现成为夺冠后的重要话题。",
          "球队进攻赢得了掌声，而你和后防队友用稳定表现守住了奖杯。",
          "你在高位防线中承担了大量身后保护任务，" + clubName + " 因此敢于持续压迫对手。"
        ]);
      }
      return pickFreshSeasonLine(player, [
        "你在防守细节里慢慢成长，很多价值没有直接出现在进球和助攻栏。",
        "这一年你对上抢时机的判断更加成熟，但面对速度型对手时仍有几次狼狈回追。",
        "你逐渐敢于从后场向前传球，球队的第一次进攻经常从你脚下开始。",
        "稳定出场让你和防线队友形成默契，协防质量比赛季初提高了不少。",
        "几次关键失误让你受到批评，不过教练组没有因此放弃对你的使用。",
        "你在强强对话中经受住了连续冲击，证明自己能够适应更高节奏。",
        "边路往返消耗了大量体能，你的传中有所进步，防守落位却偶尔受到影响。",
        "这一季你更多承担保守职责，个人数据有限，但球队很少从你这一侧被轻易打穿。"
      ]);
    }
    if (player.position === "CM" || player.position === "CAM") {
      if (stats.assists >= 10) {
        return pickFreshSeasonLine(player, [
          "你逐渐把比赛节奏抓在脚下，中场梳理和最后一传成了赛季亮点。",
          "多次穿透防线的传球让你成为球队主要机会来源，助攻数字只是影响力的一部分。",
          "你在中路不断改变进攻方向，对手很难完全切断 " + clubName + " 的推进。",
          "强强对话中你没有回避拿球，几次关键直塞直接决定了比赛结果。",
          "这一年你兼顾节奏控制与禁区前创造，逐渐成为进攻体系不可替代的一环。"
        ]);
      }
      return pickFreshSeasonLine(player, [
        "你在中场的传导和覆盖持续累积，比赛理解比纸面数据成长得更快。",
        "这一季你的任务更多是保护防线和维持阵型，因此很少出现在数据榜上。",
        "你开始学会在压力下转身向前，但面对高强度逼抢时仍有丢失球权的问题。",
        "教练让你承担更深的位置，进攻数据下降，组织阶段的触球却明显增加。",
        "你跑遍两个禁区，在攻防转换中提供了稳定连接，赛季末体能也接近极限。",
        "几场比赛里你控制住了节奏，也有一些时候因为过于保守错过向前传球的窗口。",
        "中场竞争让你的出场角色不断变化，从首发组织到替补防守都留下了记录。"
      ]);
    }
    if (player.position === "LM" || player.position === "RM" || player.position === "LW" || player.position === "RW") {
      if (stats.goals + stats.assists >= 18) {
        return pickFreshSeasonLine(player, [
          "你在边路的一对一和最后处理越来越有威胁，多场比赛靠个人突破打开局面。",
          "对手开始安排两人限制你，但你仍能通过内切和传中持续制造进球。",
          "你把速度优势稳定转化成数据，成为 " + clubName + " 最直接的纵深来源。",
          "弱侧包抄为你带来不少进球，边锋身份不再意味着只能负责创造机会。",
          "这一季你在突破、传中和终结之间找到了平衡，进攻影响力达到新的高度。"
        ]);
      }
      return pickFreshSeasonLine(player, [
        "你在边路反复试探自己的上限，突破选择和传中时机仍在继续打磨。",
        "速度让你能够轻易进入危险区域，但最后一下处理浪费了不少机会。",
        "面对密集防守时你经常被迫回传，如何在狭小空间创造优势成了新课题。",
        "你承担了更多回防任务，进攻数据有所牺牲，但球队边路结构更加稳定。",
        "赛季中段的一段连续助攻让你短暂坐稳主力，随后状态波动又带来了轮换。",
        "教练要求你更多无球冲刺，你制造了空间，却没有总能在数据上得到回报。",
        "左右边路的多次换位丰富了比赛方式，也让你经历了一段明显的适应期。"
      ]);
    }
    if (player.position === "ST") {
      if (stats.goals >= 10) {
        return pickFreshSeasonLine(player, [
          "你在禁区里的嗅觉更成熟了，抓机会的效率开始稳定提升。",
          "你不需要大量触球就能完成进球，逐渐成为防线最不愿意放松盯防的人。",
          "背身做球和门前终结同时进步，" + clubName + " 的进攻有了明确支点。",
          "连续几轮破门让你坐稳主力中锋，低迷期也没有持续太久。",
          "你对防线身后空间的利用更加聪明，多粒进球来自精确的启动时机。",
          "这一季并非每场都有机会，但你把有限的射门转化成了足够有分量的进球。"
        ]);
      }
      return pickFreshSeasonLine(player, [
        "你还在寻找更适合自己的门前节奏，跑位和支点作用都没有完全成形。",
        "进球荒持续了很长一段时间，你开始更多回撤，希望通过参与组织找回状态。",
        "你在对抗中能够保护住球，却很少及时出现在真正危险的终结区域。",
        "几次单刀未进成为赛季遗憾，教练组也开始尝试其他锋线组合。",
        "数据并不突出，但你的压迫和牵制为边路队友创造了不少空间。",
        "替补登场时你曾完成关键进球，不过整体表现还不足以长期占据首发。",
        "这一年你在支点与抢点两种职责间反复切换，始终没能找到最舒服的方式。"
      ]);
    }
    if (stats.goals >= 15) {
      return "这一年你的终结效率明显提升，多场比赛靠个人火力改写了走势。";
    }
    if (stats.assists >= 12) {
      return "你在进攻组织上存在感很强，多次送出决定比赛的最后一传。";
    }
    if (stats.appearances < 15) {
      return "这一年你始终没能稳定进入轮换，关键节点上机会偏少。";
    }
    if (player.status.fitness < 55) {
      return "密集赛程拖累了状态，你在赛季后段明显有些跟不上强度。";
    }
    return "这一年没有绝对封神的瞬间，但你在稳定累积自己的职业履历。";
  }

  function getChampionshipMatchContext(club, championshipTrophies) {
    var competitionNames = getCompetitionNames(club);
    var trophy = championshipTrophies[0];
    var opponent;
    var stage;

    if (championshipTrophies.indexOf("欧冠冠军") !== -1) {
      trophy = "欧冠冠军";
      stage = "欧冠决赛";
      opponent = pickEuropeanOpponent(club.id, 84);
    } else if (championshipTrophies.indexOf("欧联杯冠军") !== -1) {
      trophy = "欧联杯冠军";
      stage = "欧联杯决赛";
      opponent = pickEuropeanOpponent(club.id, 78);
    } else if (championshipTrophies.indexOf("欧协联冠军") !== -1) {
      trophy = "欧协联冠军";
      stage = "欧协联决赛";
      opponent = pickEuropeanOpponent(club.id, 74);
    } else if (championshipTrophies.indexOf("亚冠冠军") !== -1) {
      trophy = "亚冠冠军";
      stage = "亚冠决赛";
      opponent = pickLeagueOpponent(club);
    } else if (championshipTrophies.indexOf(competitionNames.domesticCup) !== -1) {
      trophy = competitionNames.domesticCup;
      stage = competitionNames.domesticCup.replace("冠军", "") + "决赛";
      opponent = pickLeagueOpponent(club);
    } else {
      trophy = competitionNames.leagueTitle;
      stage = getLeagueDisplayName(club.league) + "争冠关键战";
      opponent = pickLeagueOpponent(club);
    }

    return {
      trophy: trophy,
      stage: stage,
      opponent: opponent ? getClubDisplayName(opponent) : "同级别劲敌"
    };
  }

  function pickFreshSeasonLine(player, lines) {
    var recentLines = (player.career || []).slice(-4).map(function (entry) {
      return entry.seasonMoment;
    });
    var freshLines = lines.filter(function (line) {
      return recentLines.indexOf(line) === -1;
    });
    return pickOne(freshLines.length ? freshLines : lines);
  }

  function simulateNationalTeamSeason(player) {
    var callupScore = player.overall * 0.45 + player.status.reputation * 0.4 + Math.max(0, player.age - 18) * 0.4;
    var caps = 0;
    var goals = 0;
    var assists = 0;
    var honors = [];
    var competitionName = getNationalCompetitionName(player.countryCode, player.seasonYear);
    var confederation = getCountryConfederation(player.countryCode);
    var finalDecision = player.pendingCompetitionOutcome;
    var tournamentPlan = player.pendingNationalTournamentPlan &&
      player.pendingNationalTournamentPlan.competitionName === competitionName
        ? player.pendingNationalTournamentPlan
        : null;
    if (tournamentPlan) {
      callupScore += tournamentPlan.bonus;
    }

    if (finalDecision && finalDecision.type === "world-cup") {
      caps = 8;
      var finalStats = simulateInternationalStats(player, caps);
      goals = finalStats.goals;
      assists = finalStats.assists;
      if (finalDecision.won) {
        honors.push("世界杯冠军");
      }
      return {
        caps: caps,
        goals: goals,
        assists: assists,
        honors: honors,
        competitionName: "世界杯",
        runnerUp: !finalDecision.won,
        qualified: true,
        finalStory: finalDecision.story + " " +
          buildWorldCupCountryComment(player, finalDecision.won ? "冠军" : "亚军", true)
      };
    }

    if (callupScore < 52) {
      player.pendingNationalTournamentPlan = null;
      return { caps: 0, goals: 0, assists: 0, honors: [], competitionName: competitionName, runnerUp: false, finalStory: "" };
    }

    caps = clamp(Math.round((callupScore - 48) / 6) + randomInt(0, 3), 1, 14);
    var internationalStats = simulateInternationalStats(player, caps);
    goals = internationalStats.goals;
    assists = internationalStats.assists;

    var runnerUp = false;
    var finalStory = "";
    if (competitionName !== "国家队比赛") {
      var worldCupQualified = competitionName !== "世界杯" ||
        didCountryQualifyForWorldCup(player, tournamentPlan);
      if (!worldCupQualified) {
        caps = clamp(caps, 3, 8);
        var qualifierStats = simulateInternationalStats(player, caps);
        player.pendingNationalTournamentPlan = null;
        return {
          caps: caps,
          goals: qualifierStats.goals,
          assists: qualifierStats.assists,
          honors: [],
          competitionName: "世界杯预选赛",
          runnerUp: false,
          qualified: false,
          finalStory: buildWorldCupCountryComment(player, "", false)
        };
      }
      var tournamentScore =
        getNationalTeamStrength(player.countryCode) * 0.56 +
        player.overall * 0.26 +
        callupScore * 0.18 +
        (tournamentPlan ? tournamentPlan.bonus * 2.4 : 0) +
        randomBetween(-8, 8);
      var championThreshold = competitionName === "世界杯" ? 88 :
        confederation === "UEFA" || confederation === "CONMEBOL" ? 84 : 80;
      var stage = tournamentScore >= championThreshold ? "冠军" :
        tournamentScore >= championThreshold - 3 ? "亚军" :
        tournamentScore >= championThreshold - 7 ? "四强" :
        tournamentScore >= championThreshold - 12 ? "八强" :
        tournamentScore >= championThreshold - 17 ? "十六强" : "小组赛出局";
      if (stage === "冠军") {
        honors.push(competitionName + "冠军");
      }
      runnerUp = stage === "亚军";
      var planText = tournamentPlan ? "你选择“" + tournamentPlan.label + "”后，" : "";
      finalStory = competitionName === "世界杯"
        ? planText + buildWorldCupCountryComment(player, stage, true)
        : stage === "冠军"
          ? planText + "国家队一路赢下关键淘汰赛，最终捧起" + competitionName + "。"
          : planText + "国家队在" + competitionName + "止步" + stage + "。";
    }
    player.pendingNationalTournamentPlan = null;

    return {
      caps: caps,
      goals: goals,
      assists: assists,
      honors: honors,
      competitionName: competitionName,
      runnerUp: runnerUp,
      qualified: true,
      finalStory: finalStory
    };
  }

  function getNationalCompetitionName(countryCode, year) {
    var confederation = getCountryConfederation(countryCode);
    if (isWorldCupYear(year)) {
      return "世界杯";
    }
    if (confederation === "UEFA" && isEuroYear(year)) {
      return "欧洲杯";
    }
    if (confederation === "AFC" && isAsianCupYear(year)) {
      return "亚洲杯";
    }
    if (confederation === "CONMEBOL" && isCopaAmericaYear(year)) {
      return "美洲杯";
    }
    if (confederation === "CAF" && isAfconYear(year)) {
      return "非洲杯";
    }
    if (confederation === "CONCACAF" && isGoldCupYear(year)) {
      return "中北美金杯赛";
    }
    if (confederation === "OFC" && isOceaniaCupYear(year)) {
      return "大洋洲国家杯";
    }
    return "国家队比赛";
  }

  function isWorldCupYear(year) {
    return year >= 2026 && (year - 2026) % 4 === 0;
  }

  function isEuroYear(year) {
    return year >= 2028 && (year - 2028) % 4 === 0;
  }

  function isAsianCupYear(year) {
    return year >= 2027 && (year - 2027) % 4 === 0;
  }

  function isCopaAmericaYear(year) {
    return year >= 2028 && (year - 2028) % 4 === 0;
  }

  function isAfconYear(year) {
    return year >= 2027 && (year - 2027) % 2 === 0;
  }

  function isGoldCupYear(year) {
    return year >= 2027 && (year - 2027) % 2 === 0;
  }

  function isOceaniaCupYear(year) {
    return year >= 2028 && (year - 2028) % 4 === 0;
  }

  function getCountryConfederation(code) {
    var country = getCountryByCode(code);
    return country.confederation || inferConfederation(code);
  }

  function inferConfederation(code) {
    if (["FR", "DE", "ES", "IT", "PT", "NL", "BE", "HR", "RS", "CH", "AT", "DK", "SE", "NO", "PL", "GB-ENG", "GB-SCT", "GB-WAL"].indexOf(code) !== -1) {
      return "UEFA";
    }
    if (["CN", "JP", "KR", "SA", "IR", "QA", "AU", "UZ", "AE", "IQ", "OM", "TH", "MY", "VN", "ID"].indexOf(code) !== -1) {
      return "AFC";
    }
    if (["AR", "BR", "UY", "CL", "CO", "PE", "EC", "PY", "BO", "VE"].indexOf(code) !== -1) {
      return "CONMEBOL";
    }
    if (["MA", "DZ", "TN", "EG", "SN", "CI", "GH", "NG", "CM", "ZA"].indexOf(code) !== -1) {
      return "CAF";
    }
    if (["US", "MX", "CA", "CR", "HN", "PA", "JM"].indexOf(code) !== -1) {
      return "CONCACAF";
    }
    if (["NZ"].indexOf(code) !== -1) {
      return "OFC";
    }
    return "AFC";
  }

  function simulateDerbyMoment(player, club, stats) {
    var forcedDerbyId = player.pendingDerbyId || "";
    var forcedDerby = Boolean(forcedDerbyId);
    var forcedResolution = player.pendingDerbyResolution || null;
    var derbyChoiceBonus = player.pendingDerbyChoiceBonus || 0;
    var derby = forcedDerby
      ? (window.DERBIES || []).find(function (item) { return item.id === forcedDerbyId; })
      : getRelevantDerby(club.id);
    player.pendingDerbyId = "";
    player.pendingDerbyResolution = null;

    if (!derby || (!forcedDerby && Math.random() < 0.45)) {
      return {
        reputationDelta: 0,
        happinessDelta: 0,
        note: "",
        forced: false
      };
    }

    if (
      (forcedResolution && forcedResolution.outcome === "failure") ||
      (forcedDerby && derbyChoiceBonus < 0)
    ) {
      var failedDerbyNote = forcedResolution && forcedResolution.source === "rival-transfer"
        ? derby.name + " 中你没能用表现平息转会争议，比赛结束后两边球迷的质疑反而更加尖锐"
        : derby.name + " 中你背负了过多压力，关键阶段没能发挥出正常水平";
      return {
        reputationDelta: forcedResolution && forcedResolution.source === "rival-transfer" ? -6 : -3,
        happinessDelta: forcedResolution && forcedResolution.source === "rival-transfer" ? -4 : -2,
        note: failedDerbyNote,
        forced: true
      };
    }

    if (forcedResolution && forcedResolution.outcome === "success") {
      return {
        reputationDelta: derby.reputationBonus,
        happinessDelta: derby.happinessBonus,
        note: derby.name + " 中你用关键表现回应了赛前争议，帮助新东家赢得了这场死敌对决",
        forced: true
      };
    }

    var clubStrength = getClubStrength(club);
    var abilityGap = player.overall - clubStrength;
    var attackingOutput = stats.goals + stats.assists;
    var seasonImpact = ["ST", "LW", "RW", "LM", "RM", "CM", "CAM"].indexOf(player.position) !== -1
      ? clamp(attackingOutput / 8, 0, 3)
      : clamp(stats.appearances / 18, 0, 2);
    var contributionScore =
      3.8 +
      abilityGap * 0.16 +
      clamp((stats.appearances - 18) / 10, -1.2, 1.4) +
      seasonImpact +
      player.status.reputation * 0.015 +
      derbyChoiceBonus +
      randomBetween(-1.8, 1.8);
    var eligibleToDominate =
      (player.overall >= clubStrength - 4 && stats.appearances >= 18) ||
      (player.overall >= clubStrength - 7 && attackingOutput >= 18);

    if (!eligibleToDominate) {
      contributionScore = Math.min(contributionScore, 5.8);
    }

    if (contributionScore >= 7.2 && eligibleToDominate) {
      var derbyGoals = stats.goals >= 2 && Math.random() < 0.12 ? 2 :
        stats.goals >= 1 && Math.random() < 0.32 ? 1 : 0;
      var starHeadlines = [
        derby.name + " 中你主导了关键阶段，赛后成为全城讨论的焦点"
      ];
      var rivalClubId = derby.clubs.find(function (clubId) { return clubId !== club.id; });
      var rivalClub = getClubById(rivalClubId);
      if (rivalClub && Math.random() < 0.1) {
        starHeadlines.push(
          derby.name + " 中你帮助 " + getClubDisplayName(club) + " 击败 " +
          getClubDisplayName(rivalClub) + "，这场失利直接让死敌退出冠军争夺"
        );
      }
      if (derbyGoals === 2) {
        starHeadlines.push(derby.name + " 中梅开二度，彻底点燃了看台气氛");
      } else if (derbyGoals === 1) {
        starHeadlines.push(derby.name + " 里打入关键一球，赛后全城都在谈论你");
      }
      if (stats.assists >= 2) {
        starHeadlines.push(derby.name + " 中连续制造杀机，你的传球改变了比赛");
      }
      if (player.position === "GK") {
        starHeadlines.push(derby.name + " 中你多次完成关键扑救，守住了球队的希望");
      } else if (["CB", "LB", "RB"].indexOf(player.position) !== -1) {
        starHeadlines.push(derby.name + " 中你用关键封堵和对抗稳住了防线");
      }
      var starHeadline = pickOne(starHeadlines);
      return {
        reputationDelta: derby.reputationBonus,
        happinessDelta: derby.happinessBonus,
        note: starHeadline,
        forced: forcedDerby
      };
    }

    if (contributionScore <= 2.5) {
      var slumpHeadline = pickOne([
        derby.name + " 中错失绝佳机会，赛后评分相当难看",
        derby.name + " 里一次处理失误直接引爆了外界批评",
        derby.name + " 中没能扛住压力，关键回合的判断备受质疑"
      ]);
      return {
        reputationDelta: -3,
        happinessDelta: -2,
        note: slumpHeadline,
        forced: forcedDerby
      };
    }

    var steadyHeadlines = stats.appearances < 20
      ? [
        derby.name + " 中你只获得有限时间，主要任务是适应比赛强度",
        derby.name + " 里你以轮换身份登场，没有成为比赛的决定者",
        derby.name + " 中教练没有交给你核心职责，你完成了有限的场上任务"
      ]
      : [
        derby.name + " 中稳定完成任务，没有让比赛彻底失控",
        derby.name + " 里表现中规中矩，算是把压力稳稳接住了",
        derby.name + " 上没有完全接管比赛，但基本守住了自己的位置"
      ];
    var steadyHeadline = pickOne(steadyHeadlines);
    return {
      reputationDelta: 2,
      happinessDelta: 1,
      note: steadyHeadline,
      forced: forcedDerby
    };
  }

  function deriveDerbyOutcomeText(derbyResult) {
    if (!derbyResult || !derbyResult.note) {
      return "";
    }
    if (derbyResult.reputationDelta >= 5) {
      return "德比战中你一战成名，声望明显上涨。";
    }
    if (derbyResult.reputationDelta < 0) {
      return "德比战没能扛住压力，声望有所下滑，外界质疑也开始变多。";
    }
    return "德比战发挥中规中矩，没有彻底改变外界对你的判断。";
  }

  function generatePlayerProfile(position, dominantFoot, baseOverall) {
    var base = POSITION_SKILL_BASES[position] || POSITION_SKILL_BASES.CM;
    var profile = {
      dribbling: clamp(base.dribbling + randomInt(-8, 8), 35, 92),
      offBall: clamp(base.offBall + randomInt(-8, 8), 35, 92),
      workRate: clamp(base.workRate + randomInt(-8, 8), 35, 92),
      passing: clamp(base.passing + randomInt(-8, 8), 35, 92),
      finishing: clamp(base.finishing + randomInt(-8, 8), 30, 92),
      defending: clamp(base.defending + randomInt(-8, 8), 28, 92),
      pace: clamp(Math.round((base.dribbling + base.offBall) / 2) + randomInt(-9, 9), 32, 92),
      strength: clamp(Math.round((base.defending + base.workRate) / 2) + randomInt(-9, 9), 32, 92),
      aerial: clamp(Math.round((base.defending + base.finishing) / 2) + randomInt(-9, 9), 30, 92),
      vision: clamp(Math.round((base.passing + base.offBall) / 2) + randomInt(-8, 8), 32, 92),
      reflexes: clamp((position === "GK" ? base.defending + 8 : base.finishing) + randomInt(-7, 7), 30, 94)
    };

    var isWide = ["LW", "RW", "LM", "RM"].indexOf(position) !== -1;
    var isFullback = position === "LB" || position === "RB";
    var isLeftPosition = position === "LW" || position === "LM" || position === "LB";
    var naturalSide =
      (isLeftPosition && dominantFoot === "左脚") ||
      (!isLeftPosition && dominantFoot === "右脚");
    if (isWide && naturalSide) {
      profile.passing = clamp(profile.passing + 2, 35, 92);
      profile.workRate = clamp(profile.workRate + 1, 35, 92);
    } else if (isWide) {
      profile.finishing = clamp(profile.finishing + 2, 30, 92);
      profile.offBall = clamp(profile.offBall + 1, 35, 92);
    }
    if (isFullback && naturalSide) {
      profile.passing = clamp(profile.passing + 2, 35, 92);
    } else if (isFullback) {
      profile.vision = clamp(profile.vision + 2, 32, 92);
      profile.dribbling = clamp(profile.dribbling + 1, 35, 92);
    }
    if (position === "CB" && dominantFoot === "左脚") {
      profile.passing = clamp(profile.passing + 1, 35, 92);
      profile.vision = clamp(profile.vision + 1, 32, 92);
    }

    if (baseOverall <= 54) {
      profile.workRate = clamp(profile.workRate + 2, 35, 92);
    }

    return normalizeProfileToOverall(profile, position, baseOverall);
  }

  function calculateProfileOverall(position, profile) {
    var weights = POSITION_OVR_WEIGHTS[position] || POSITION_OVR_WEIGHTS.CM;
    var weighted = Object.keys(weights).reduce(function (sum, skill) {
      return sum + (profile[skill] || 40) * weights[skill];
    }, 0);
    var eliteRelevantSkills = Object.keys(weights).filter(function (skill) {
      return weights[skill] >= 0.1 && (profile[skill] || 0) >= 86;
    }).length;
    var roleModifier = eliteRelevantSkills >= 4 ? 2 : eliteRelevantSkills >= 2 ? 1 : 0;
    return clamp(Math.round(weighted + roleModifier), 40, 99);
  }

  function normalizeProfileToOverall(profile, position, targetOverall) {
    var normalized = Object.assign({}, profile);
    var attempts = 0;
    while (calculateProfileOverall(position, normalized) !== targetOverall && attempts < 8) {
      var difference = targetOverall - calculateProfileOverall(position, normalized);
      Object.keys(normalized).forEach(function (skill) {
        normalized[skill] = clamp(normalized[skill] + difference, 25, 96);
      });
      attempts += 1;
    }
    return normalized;
  }

  function applyProfileDevelopment(player, requestedChange) {
    if (!requestedChange) {
      player.overall = calculateProfileOverall(player.position, player.profile);
      return 0;
    }
    var previousOverall = player.overall;
    var weights = POSITION_OVR_WEIGHTS[player.position] || POSITION_OVR_WEIGHTS.CM;
    var curve = getPlayerCareerCurve(player);
    var relevantSkills = Object.keys(weights);
    relevantSkills.forEach(function (skill) {
      var skillChange = requestedChange;
      var isPhysicalSkill = ["pace", "workRate", "strength", "reflexes"].indexOf(skill) !== -1;
      var isExperienceSkill = ["passing", "vision", "defending", "offBall", "aerial"].indexOf(skill) !== -1;
      if (requestedChange < 0 && player.age > curve.peakEnd) {
        if (isExperienceSkill) {
          skillChange += 1;
        }
        if (isPhysicalSkill && player.age >= curve.hardDecline) {
          skillChange -= 1;
        }
        if (
          skill === "pace" &&
          ["LB", "RB", "LM", "RM", "LW", "RW"].indexOf(player.position) !== -1 &&
          player.age >= curve.hardDecline + 2
        ) {
          skillChange -= 1;
        }
      }
      player.profile[skill] = clamp(
        (player.profile[skill] || 45) + skillChange,
        25,
        99
      );
    });
    var recalculated = calculateProfileOverall(player.position, player.profile);
    player.overall = clamp(
      requestedChange > 0
        ? Math.min(recalculated, player.potential)
        : recalculated,
      40,
      99
    );
    return player.overall - previousOverall;
  }

  function applyCareerRoleTransition(player, targetPosition, transitionType) {
    var previousOverall = player.overall;
    var previousPosition = player.position;
    var skillBoosts = transitionType === "creator"
      ? { passing: 3, vision: 3, dribbling: 1, offBall: 1 }
      : { finishing: 3, offBall: 3, strength: 1, passing: 1 };
    Object.keys(skillBoosts).forEach(function (skill) {
      player.profile[skill] = clamp((player.profile[skill] || 45) + skillBoosts[skill], 25, 99);
    });
    if (transitionType !== "retain") {
      player.profile.pace = clamp((player.profile.pace || 45) - 1, 25, 99);
    }
    player.position = targetPosition;
    var weights = POSITION_OVR_WEIGHTS[targetPosition] || POSITION_OVR_WEIGHTS.CM;
    var recalculated = calculateProfileOverall(targetPosition, player.profile);
    var adjustment = clamp(previousOverall - recalculated, -3, 3);
    Object.keys(weights).forEach(function (skill) {
      player.profile[skill] = clamp((player.profile[skill] || 45) + adjustment, 25, 99);
    });
    player.overall = clamp(calculateProfileOverall(targetPosition, player.profile), previousOverall - 1, previousOverall + 1);
    player.potential = Math.max(player.potential, player.overall);
    player.roleTransitionCompleted = true;
    player.careerCurveBonus = transitionType === "creator" ? 2 : 1;
    player.lastRoleTransition = {
      age: player.age,
      from: previousPosition,
      to: targetPosition,
      type: transitionType
    };
  }

  function cloneEffects(effects) {
    return {
      overall: effects.overall || 0,
      reputation: effects.reputation || 0,
      fitness: effects.fitness || 0,
      coachRelation: effects.coachRelation || 0,
      happiness: effects.happiness || 0,
      transferInterest: effects.transferInterest || 0,
      value: effects.value || 0
    };
  }

  function averageSkills(values) {
    return Math.round(values.reduce(function (sum, value) {
      return sum + value;
    }, 0) / values.length);
  }

  function resolveEventChoice(player, event, option) {
    var effects = cloneEffects(option.effects || {});
    var note = "";
    var competitionOutcome = null;
    var majorMatchStory = "";
    var competitionImpact = null;
    var positionChange = "";
    var transitionType = "";
    var profile = player.profile || generatePlayerProfile(player.position, player.dominantFoot, player.overall);

    if (event.id === "career-role-transition") {
      var transitionSkills = option.transitionType === "creator"
        ? [profile.passing, profile.vision, profile.dribbling]
        : option.transitionType === "scorer"
          ? [profile.finishing, profile.offBall, profile.dribbling]
          : [profile.pace, profile.dribbling, profile.workRate];
      var transitionScore = averageSkills(transitionSkills) +
        Math.round(player.status.coachRelation * 0.08) +
        randomInt(-9, 8);
      if (option.transitionType === "retain") {
        player.roleTransitionCompleted = true;
        player.careerCurveBonus = 0;
        note = "你决定保留原有位置和比赛方式，短期最稳定，但身体下滑后需要承担更明显的速度损失。";
      } else if (transitionScore >= 76) {
        positionChange = option.targetPosition;
        transitionType = option.transitionType;
        effects.reputation += 2;
        effects.coachRelation += 2;
        note = "转型取得成功。你的技术结构适应了新职责，比赛经验也将帮助你延长巅峰平台期。";
      } else {
        effects.fitness -= 2;
        effects.happiness -= 2;
        effects.coachRelation -= 1;
        note = "这次转型没有成功。新职责与你现有能力结构并不匹配，强行改造还短暂打乱了比赛节奏。";
      }
    }

    if (event.id === "late-career-coronation") {
      competitionImpact = {
        forceLeagueChampion: true,
        leaguePoints: 8,
        source: "暮年封王"
      };
      majorMatchStory = "争冠收官阶段，你以老将核心的方式稳住全队，帮助 " +
        getClubDisplayName(getClubById(player.currentClubId)) +
        " 最终登顶联赛，完成了一次真正的暮年封王。";
      note = "你把经验和最后的巅峰状态全部投入争冠，赛季最终以联赛冠军收尾。";
    }

    if (event.id === "club-loyalty-milestone") {
      var loyaltyClubName = getClubDisplayName(getClubById(player.currentClubId));
      if (/承诺|忠诚/.test(option.label)) {
        note = "你公开确认了对 " + loyaltyClubName + " 的忠诚，主场球迷用更高规格的掌声回应了你。";
      } else if (/队长责任|功勋领袖/.test(option.label)) {
        if (player.status.reputation >= 62 || player.status.coachRelation >= 68) {
          effects.reputation += 2;
          effects.coachRelation += 2;
          note = "你接过了更衣室责任，并在困难阶段稳住球队，" + loyaltyClubName + " 开始真正把你视为功勋领袖。";
        } else {
          effects.happiness -= 2;
          effects.coachRelation -= 1;
          note = "你愿意承担责任，但当前影响力还不足以服众，袖标带来的压力暂时大于回报。";
        }
      } else if (/场上表现带队|专注自己的比赛/.test(option.label)) {
        note = "你没有依赖资历要求特殊待遇，而是继续用训练和比赛维持自己在 " + loyaltyClubName + " 的位置。";
      } else if (/一年一年|务实不作承诺/.test(option.label)) {
        note = "你没有给出长期承诺，双方仍保持信任，但未来会根据竞技状态逐年决定。";
      } else if (/机会|冒险|新的生活/.test(option.label)) {
        note = "你承认自己愿意听取新的可能，" + loyaltyClubName + " 尊重你的贡献，但也开始准备没有你的未来。";
      } else {
        note = "长期效力带来的责任发生了变化，你与 " + loyaltyClubName + " 的关系进入新的阶段。";
      }
    }

    if (event.id === "champions-league-final-decision" || event.id === "world-cup-final-decision") {
      var isWorldCupFinal = event.id === "world-cup-final-decision";
      var teamStrength = isWorldCupFinal
        ? getNationalTeamStrength(player.countryCode)
        : getClubStrength(getClubById(player.currentClubId));
      var roleFit;
      var optionBonus = 0;

      if (option.label === "主动要求成为核心" || option.label === "主动接管关键回合") {
        roleFit = averageSkills([profile.dribbling, profile.finishing, profile.passing]);
        optionBonus = roleFit >= 76 ? 4 : roleFit <= 60 ? -5 : 0;
      } else if (option.label === "严格执行决赛计划" || option.label === "完全服从战术安排") {
        roleFit = averageSkills([profile.workRate, profile.offBall, profile.defending]);
        optionBonus = roleFit >= 72 ? 3 : -1;
      } else {
        roleFit = averageSkills([profile.offBall, profile.finishing, profile.pace]);
        optionBonus = roleFit >= 74 ? 3 : -3;
      }

      var finalScore = teamStrength * 0.52 + player.overall * 0.3 + roleFit * 0.18 +
        optionBonus + randomBetween(-10, 10);
      var winThreshold = isWorldCupFinal ? 84 : 85;
      var wonFinal = finalScore >= winThreshold;
      var competitionLabel = isWorldCupFinal ? "世界杯" : "欧冠";
      var finalOpponent = event.opponentClubId && getClubById(event.opponentClubId);
      var opponentText = finalOpponent ? getClubDisplayName(finalOpponent) : "决赛对手";

      if (wonFinal) {
        effects.reputation += isWorldCupFinal ? 10 : 8;
        effects.happiness += 8;
        effects.coachRelation += 4;
        note = "你的决定在决赛中奏效，球队击败 " + opponentText + " 并赢得" + competitionLabel + "冠军。";
      } else {
        effects.reputation -= optionBonus < 0 ? 5 : 2;
        effects.happiness -= 7;
        note = "决赛计划没有换来最后胜利，球队不敌 " + opponentText + "，以" + competitionLabel + "亚军结束赛季。";
      }

      competitionOutcome = {
        type: isWorldCupFinal ? "world-cup" : "champions-league",
        won: wonFinal,
        competition: competitionLabel,
        opponentClubId: finalOpponent && finalOpponent.id || "",
        story: note
      };
    }

    if (event.id === "champions-league-key-match") {
      var opponent = getClubById(event.opponentClubId);
      var opponentName = getClubDisplayName(opponent);
      var tacticalFit;
      var tacticalBonus = 0;
      if (option.label === "持续冲击对手禁区") {
        tacticalFit = averageSkills([profile.dribbling, profile.finishing, profile.offBall]);
        tacticalBonus = tacticalFit >= 74 ? 3 : -3;
      } else if (option.label === "耐心控制比赛节奏") {
        tacticalFit = averageSkills([profile.passing, profile.vision, profile.workRate]);
        tacticalBonus = tacticalFit >= 72 ? 3 : -2;
      } else {
        tacticalFit = averageSkills([profile.pace, profile.offBall, profile.finishing]);
        tacticalBonus = tacticalFit >= 73 ? 2 : -3;
      }

      var matchScore = (getClubStrength(getClubById(player.currentClubId)) - getClubStrength(opponent)) * 0.48 +
        (player.overall - 82) * 0.2 + (tacticalFit - 68) * 0.16 +
        tacticalBonus + randomBetween(-7, 7);
      var advanced = matchScore >= 0;
      var collapseChance = clamp(
        0.06 + Math.max(0, -matchScore - 2) * 0.025,
        0.06,
        0.22
      );
      var catastrophicDefeat = !advanced && Math.random() < collapseChance;

      if (catastrophicDefeat) {
        var collapseScore = pickOne(["0:5", "1:6", "2:7", "2:8"]);
        effects.reputation -= randomInt(7, 11);
        effects.happiness -= randomInt(8, 13);
        effects.coachRelation -= randomInt(5, 8);
        effects.fitness -= randomInt(3, 7);
        player.developmentMomentum = Math.min(-2, player.developmentMomentum || 0);
        player.pendingCollapseArc = {
          nextSeasonYear: player.seasonYear + 1,
          opponentClubId: event.opponentClubId
        };
        note = event.stage + "面对 " + opponentName + "，球队从上半场开始全面失控，最终以 " +
          collapseScore + " 遭遇欧冠惨案。防线、战术和更衣室都受到重创，这场失利成为俱乐部多年难以摆脱的伤痕。";
      } else if (advanced && option.label === "持续冲击对手禁区" && Math.random() < 0.24) {
        effects.reputation -= 4;
        effects.happiness += 2;
        note = event.stage + "面对 " + opponentName + "，你在补时阶段制造争议点球并帮助球队晋级；胜利保住了，但判罚在赛后引发巨大争论。";
      } else if (advanced) {
        effects.reputation += 4;
        effects.coachRelation += 2;
        note = event.stage + "面对 " + opponentName + "，你的选择成功限制了对手并帮助球队晋级下一轮。";
      } else {
        effects.reputation -= 3;
        effects.happiness -= 3;
        note = event.stage + "面对 " + opponentName + "，比赛计划未能奏效，球队被淘汰出局。";
      }
      majorMatchStory = note;
      competitionImpact = {
        leaguePoints: 0,
        continentalStrength: advanced ? 4 : catastrophicDefeat ? -5 : 0,
        shootoutStage: event.stage.replace("欧冠", "").replace("战", ""),
        shootoutAdvanced: advanced,
        opponentClubId: event.opponentClubId,
        source: catastrophicDefeat ? "欧冠惨案" : event.stage + "对阵" + opponentName
      };
    }

    if (event.id === "champions-league-penalty-shootout") {
      var shootoutOpponent = getClubById(event.opponentClubId);
      var shootoutOpponentName = getClubDisplayName(shootoutOpponent);
      var shootoutSkill;
      var shootoutBonus = 0;
      if (player.position === "GK") {
        shootoutSkill = averageSkills([profile.reflexes, profile.vision, profile.workRate]);
        if (option.label === "提前研究主罚方向") {
          shootoutBonus = profile.vision >= 72 ? 5 : 1;
        } else if (option.label === "延迟移动等待出脚") {
          shootoutBonus = profile.reflexes >= 76 ? 5 : -2;
        } else {
          shootoutBonus = profile.reflexes >= 82 ? 3 : -4;
        }
      } else {
        shootoutSkill = averageSkills([profile.finishing, profile.workRate, profile.offBall]);
        if (option.label === "主动主罚第一点") {
          shootoutBonus = shootoutSkill >= 72 ? 4 : -2;
        } else if (option.label === "要求主罚第五点") {
          shootoutBonus = shootoutSkill >= 78 && player.status.reputation >= 68 ? 6 : -4;
        } else {
          shootoutBonus = -2;
        }
      }
      var playerTakesPenalty = player.position !== "GK" &&
        option.label !== "不主动进入前五顺位";
      // Each kick receives a fresh hidden probability and ignores player ratings.
      var penaltyWindow = randomBetween(0.48, 0.94);
      var playerScoredPenalty = !playerTakesPenalty || Math.random() < penaltyWindow;
      var shootoutScore =
        (getClubStrength(getClubById(player.currentClubId)) - getClubStrength(shootoutOpponent)) * 0.35 +
        (shootoutSkill - 68) * 0.18 +
        shootoutBonus +
        (playerTakesPenalty ? (playerScoredPenalty ? 2 : -5) : 0) +
        randomBetween(-6, 6);
      var shootoutAdvanced = shootoutScore >= 0;
      if (playerTakesPenalty && !playerScoredPenalty && shootoutAdvanced) {
        effects.reputation -= 2;
        effects.happiness -= 2;
        note = "欧冠" + event.stage + "对阵 " + shootoutOpponentName +
          " 的点球大战中，你把点球踢飞了；好在队友和门将随后救回局面，球队仍然惊险晋级。";
      } else if (playerTakesPenalty && !playerScoredPenalty) {
        effects.reputation -= 6;
        effects.happiness -= 7;
        note = "欧冠" + event.stage + "对阵 " + shootoutOpponentName +
          " 的点球大战中，你把点球踢飞，球队最终被淘汰，这次罚失成为赛后舆论的焦点。";
      } else if (shootoutAdvanced) {
        effects.reputation += 5;
        effects.happiness += 4;
        note = playerTakesPenalty
          ? "欧冠" + event.stage + "对阵 " + shootoutOpponentName +
            " 的点球大战中，你罚进自己的点球，球队最终顶住压力成功晋级。"
          : "欧冠" + event.stage + "对阵 " + shootoutOpponentName +
            " 的点球大战中，你的选择帮助球队顶住压力并成功晋级。";
      } else {
        effects.reputation -= option.label === "不主动进入前五顺位" ? 2 : 4;
        effects.happiness -= 5;
        note = playerTakesPenalty
          ? "欧冠" + event.stage + "对阵 " + shootoutOpponentName +
            " 的点球大战中，你罚进了自己的点球，但球队仍在后续轮次落败出局。"
          : "欧冠" + event.stage + "对阵 " + shootoutOpponentName +
            " 的点球大战中，你的选择没能换来晋级，球队就此出局。";
      }
      majorMatchStory = note;
      competitionImpact = {
        leaguePoints: 0,
        continentalStrength: shootoutAdvanced ? 2 : 0,
        shootoutStage: event.stage,
        shootoutAdvanced: shootoutAdvanced,
        opponentClubId: event.opponentClubId,
        source: "欧冠" + event.stage + "点球大战"
      };
    }

    if (event.id === "big-match") {
      var bigMatchClub = getClubById(player.currentClubId);
      var bigMatchOpponent = getClubById(event.opponentClubId);
      var bigMatchOpponentName = getClubDisplayName(bigMatchOpponent);
      var bigMatchFit;
      if (/全力|主动|压上|冲击/.test(option.label)) {
        bigMatchFit = averageSkills([profile.dribbling, profile.finishing, profile.offBall]);
      } else if (/稳健|执行|控制|纪律/.test(option.label)) {
        bigMatchFit = averageSkills([profile.passing, profile.workRate, profile.defending]);
      } else {
        bigMatchFit = averageSkills([profile.pace, profile.workRate, profile.offBall]);
      }
      var bigMatchScore =
        (getClubStrength(bigMatchClub) - getClubStrength(bigMatchOpponent)) * 0.3 +
        (player.overall - getClubStrength(bigMatchClub)) * 0.2 +
        (bigMatchFit - 68) * 0.12 +
        randomBetween(-5, 5);
      var wonBigMatch = bigMatchScore >= 0;
      var bigMatchLabel = event.matchLabel || "联赛关键战";
      competitionImpact = {
        leaguePoints: wonBigMatch ? 3 : 0,
        continentalStrength: 0,
        source: bigMatchLabel
      };
      if (wonBigMatch) {
        effects.reputation += 3;
        effects.coachRelation += 2;
        note = bigMatchLabel + "面对 " + bigMatchOpponentName + "，你的方案帮助球队拿下关键胜利。";
      } else {
        effects.reputation -= 2;
        effects.happiness -= 2;
        note = bigMatchLabel + "面对 " + bigMatchOpponentName + "，你的选择没有奏效，球队丢掉了重要积分。";
      }
      majorMatchStory = note;
    }

    if (event.id === "archetype-training" && option.targetArchetype) {
      var target = option.targetArchetype;
      var fitScore = getArchetypeScore(player, target);
      var agePenalty = Math.max(0, player.age - 27) * 1.4;
      var fitnessBonus = (player.status.fitness - 65) * 0.18;
      var successScore = fitScore + fitnessBonus - agePenalty + randomInt(-16, 16);

      if (option.reinforce) {
        target.skills.forEach(function (skill) {
          profile[skill] = clamp((profile[skill] || 50) + randomInt(1, 3), 30, 99);
        });
        effects.overall += fitScore >= 72 ? 1 : 0;
        effects.reputation += 1;
        player.developmentMomentum = clamp((player.developmentMomentum || 0) + 1, -4, 4);
        note = "你没有改变自己的比赛方式，而是把“" + target.name + "”打磨得更加稳定。";
      } else if (successScore >= 70) {
        target.skills.forEach(function (skill) {
          profile[skill] = clamp((profile[skill] || 50) + randomInt(3, 6), 30, 99);
        });
        effects.overall += 1;
        effects.coachRelation += 3;
        effects.reputation += 2;
        player.developmentMomentum = clamp((player.developmentMomentum || 0) + 2, -4, 4);
        note = "专项训练取得成功，你开始能够在比赛中稳定承担“" + target.name + "”的职责。";
      } else if (successScore >= 57) {
        target.skills.forEach(function (skill) {
          profile[skill] = clamp((profile[skill] || 50) + randomInt(1, 3), 30, 99);
        });
        effects.happiness -= 1;
        player.developmentMomentum = clamp((player.developmentMomentum || 0) + 1, -4, 4);
        note = "你掌握了一部分“" + target.name + "”所需能力，但暂时还无法在高强度比赛中稳定运用。";
      } else {
        effects.overall -= 1;
        effects.coachRelation -= 3;
        effects.happiness -= 3;
        effects.fitness -= 3;
        player.developmentMomentum = clamp((player.developmentMomentum || 0) - 2, -4, 4);
        note = "这次改造没有成功。你的基础能力与“" + target.name + "”要求差距较大，强行适应还影响了原有比赛节奏。";
      }
    }

    if (event.id === "tactical-fit") {
      var tacticalFit = averageSkills([profile.offBall, profile.workRate, profile.passing]);

      if (option.label === "主动适配新战术") {
        if (tacticalFit >= 72) {
          effects.overall += 1;
          effects.coachRelation += 2;
          effects.reputation += 2;
          note = "你的无球跑动和战术执行本来就不错，这次适配效果很好。";
        } else if (tacticalFit <= 56) {
          effects.overall -= 2;
          effects.happiness -= 2;
          effects.coachRelation -= 2;
          note = "你的技术特点更偏个人持球，这套强调无球跑动的踢法让你适应得很吃力。";
        } else {
          note = "你基本跟上了新战术节奏，但还谈不上完全适配。";
        }
      }

      if (option.label === "慢慢适应") {
        if (tacticalFit >= 72) {
          effects.coachRelation += 2;
          note = "虽然没有激进表态，但你的能力结构本来就适合这套体系。";
        } else if (tacticalFit <= 56) {
          effects.overall -= 1;
          effects.reputation -= 1;
          note = "你对无球体系的消化速度偏慢，短期内位置还是会受影响。";
        } else {
          note = "你选择了更稳妥的方式，适应过程比较平缓。";
        }
      }

      if (option.label === "公开表达不满") {
        if (tacticalFit <= 56) {
          effects.happiness += 1;
          note = "从你的能力特点看，这次不满并不是毫无道理。";
        } else {
          effects.coachRelation -= 2;
          note = "其实你有能力踢这套体系，公开抱怨反而让教练更不满意。";
        }
      }
    }

    if (event.id === "coach-role-shift") {
      var goalkeeperRoleShift = player.position === "GK";
      var roleFit = goalkeeperRoleShift
        ? averageSkills([profile.reflexes, profile.defending, profile.passing, profile.aerial])
        : averageSkills([profile.passing, profile.offBall, profile.dribbling]);

      if (option.label === "接受位置调整") {
        if (roleFit >= 72) {
          effects.overall += 1;
          note = goalkeeperRoleShift
            ? "你的反应、站位和出球能力能够支撑新的门将职责。"
            : "你的视野和衔接能力不错，换位后的成长空间被放大了。";
        } else if (roleFit <= 56) {
          effects.overall -= 1;
          effects.happiness -= 1;
          note = goalkeeperRoleShift
            ? "新的门将职责超出了你目前的出击和出球能力，适应过程并不顺利。"
            : "你更像单点爆破型球员，角色调整让你一开始踢得别扭。";
        } else {
          note = "你能勉强完成新角色要求，但适应期还是带来了一些消耗。";
        }
      }

      if (option.label === "坚持原位置") {
        if (roleFit >= 70) {
          effects.coachRelation -= 2;
          note = "其实你有能力胜任调整后的角色，这次坚持显得有些保守。";
        } else {
          effects.happiness += 1;
          note = "从能力结构看，你留在熟悉区域确实更容易保住基本盘。";
        }
      }

      if (option.label === "要求转会") {
        if (roleFit <= 55 && Math.random() > 0.38) {
          effects.transferInterest += 8;
          note = "球队也知道这次调整并不适合你，转会请求反而让市场更快动了起来。";
        } else {
          effects.reputation -= 1;
          note = "你还没踢出足够硬的表现，过早闹转会只会让管理层更不耐烦。";
        }
      }
    }

    if (event.id === "extra-training") {
      var trainingFit = averageSkills([profile.workRate, profile.offBall, profile.defending]);

      if (option.label === "全力投入") {
        if (trainingFit >= 72 && Math.random() > 0.34) {
          effects.overall += 1;
          effects.reputation += 1;
          player.developmentMomentum = clamp((player.developmentMomentum || 0) + 2, -4, 4);
          note = "这次加练真的把你的状态推高了一档，教练组也看到了变化。";
        } else {
          effects.fitness -= 3;
          player.developmentMomentum = clamp((player.developmentMomentum || 0) - 1, -4, 4);
          effects.happiness -= 1;
          note = "训练负荷比预期还猛，你的身体恢复明显受到了影响。";
        }
      }

      if (option.label === "优先休息") {
        if (player.status.fitness <= 60) {
          effects.fitness += 2;
          note = "你确实需要这一口气，休息让状态回升得更明显。";
        } else {
          effects.reputation -= 1;
          note = "外界觉得你在别人冲刺时选择了保守，这多少影响了评价。";
        }
      }
    }

    if (event.id === "captain-trust") {
      var leaderFit = averageSkills([profile.workRate, profile.passing, profile.offBall]) + Math.round(player.status.reputation * 0.15);

      if (option.label === "主动承担责任") {
        if (leaderFit >= 78 && Math.random() > 0.28) {
          effects.reputation += 3;
          effects.coachRelation += 2;
          note = "你成功扛住了更衣室里的期待，队友和教练都更认可你了。";
        } else {
          effects.happiness -= 2;
          effects.coachRelation -= 2;
          effects.reputation -= 3;
          note = "你试图承担更多责任，但表现没完全跟上，外界反而开始放大你的问题。";
        }
      }

      if (option.label === "把注意力放在数据") {
        if (Math.random() > 0.55) {
          effects.reputation += 2;
          note = "你确实把数据刷出来了，但更衣室里有人觉得你太在意个人表现。";
        } else {
          effects.coachRelation -= 2;
          effects.happiness -= 1;
          note = "你把重心放在个人表现上，却没交出足够亮眼的数据，反而显得有些自私。";
        }
      }
    }

    if (event.id === "veteran-leader") {
      var veteranFit = averageSkills([profile.passing, profile.workRate, profile.offBall]) + Math.round(player.status.coachRelation * 0.12);

      if (option.label === "主动传帮带") {
        if (veteranFit >= 74 && Math.random() > 0.3) {
          effects.reputation += 2;
          effects.coachRelation += 2;
          note = "你成功把经验传给了年轻人，更衣室里的分量也更重了。";
        } else {
          effects.fitness -= 1;
          effects.happiness -= 1;
          note = "你花了不少精力照顾年轻人，但自己状态反而被拖住了。";
        }
      }

      if (option.label === "专注自己状态") {
        if (veteranFit >= 76) {
          effects.reputation -= 2;
          note = "以你现在的资历，大家原本期待你站出来带队，你的冷处理让观感变差了。";
        } else {
          note = "你把精力留给了自己，至少短期内比赛状态不至于继续下滑。";
        }
      }
    }

    if (event.id === "media-hype") {
      var spotlightFit = averageSkills([profile.dribbling, profile.offBall, profile.workRate]) + Math.round(player.status.reputation * 0.1);

      if (option.label === "高调回应") {
        if (spotlightFit >= 72 && Math.random() > 0.35) {
          effects.reputation += 3;
          note = "你成功把热度转成了关注度，市场和媒体都开始更认真地看待你。";
        } else {
          effects.coachRelation -= 2;
          effects.happiness -= 1;
          note = "你把话说得很满，但之后的表现没有完全接住，舆论反噬来得很快。";
        }
      }

      if (option.label === "拒绝采访") {
        if (spotlightFit <= 58) {
          effects.fitness += 1;
          note = "暂时躲开聚光灯对你是好事，你把杂音隔绝在了训练场外。";
        } else {
          effects.reputation -= 1;
          note = "你原本有机会借这波热度再往上冲一截，过于封闭多少有点可惜。";
        }
      }
    }

    if (event.id === "locker-conflict") {
      var harmonyFit = averageSkills([profile.workRate, profile.passing, profile.offBall]) + Math.round(player.status.coachRelation * 0.12);

      if (option.label === "出面调解") {
        if (harmonyFit >= 72 && Math.random() > 0.32) {
          effects.reputation += 2;
          effects.coachRelation += 2;
          note = "你把更衣室情绪稳住了，这种处理让教练组开始更信任你。";
        } else {
          effects.happiness -= 2;
          note = "你卷进了队友之间的情绪拉扯，自己也被这件事消耗得不轻。";
        }
      }

      if (option.label === "站队好友") {
        if (Math.random() > 0.62) {
          effects.happiness += 1;
          note = "短期内你和好友的关系确实更近了，但更衣室裂痕并没有真正消失。";
        } else {
          effects.coachRelation -= 2;
          effects.reputation -= 1;
          note = "你明显站边的做法引发了更多小团体情绪，教练组对此非常警惕。";
        }
      }
    }

    if (event.id === "minor-injury") {
      if (option.label === "咬牙坚持") {
        if (player.status.fitness >= 72 && Math.random() > 0.4) {
          effects.reputation += 1;
          note = "你勉强撑住了出场需求，短期内确实赢得了些认可。";
        } else {
          effects.overall -= 1;
          effects.fitness -= 3;
          note = "带伤硬顶的代价比预想更大，恢复节奏被彻底打乱了。";
        }
      }

      if (option.label === "申请轮休") {
        if (player.status.fitness <= 62) {
          effects.coachRelation += 1;
          note = "这次轮休决定反而显得理性，队医和教练都接受了你的恢复安排。";
        } else {
          effects.coachRelation -= 1;
          note = "从外界视角看，你的伤情没有严重到必须退出，这让教练有些失望。";
        }
      }
    }

    if (event.id.indexOf("derby-prep-") === 0) {
      var derbyFit = averageSkills([profile.dribbling, profile.finishing, profile.workRate]);

      if (option.label === "主动扛起压力") {
        if (derbyFit >= 72 && Math.random() > 0.36) {
          effects.reputation += 2;
          effects.coachRelation += 1;
          note = "你提前进入对抗状态，赛前气势确实被你带起来了。";
          player.pendingDerbyChoiceBonus = 1.5;
          competitionImpact = { leaguePoints: 2, continentalStrength: 0, source: "德比大战" };
        } else {
          effects.happiness -= 2;
          effects.fitness -= 1;
          note = "你把自己逼得太紧，比赛还没踢就已经背上了不小的心理包袱。";
          player.pendingDerbyChoiceBonus = -1.2;
          competitionImpact = { leaguePoints: 0, continentalStrength: 0, source: "德比大战" };
        }
      } else if (option.label === "专注训练细节") {
        player.pendingDerbyChoiceBonus = 0.8;
        competitionImpact = { leaguePoints: 1, continentalStrength: 0, source: "德比大战" };
      }

      if (option.label === "给媒体降温") {
        if (Math.random() > 0.58) {
          effects.happiness += 1;
          note = "你成功把外界情绪压下去一些，至少更衣室没有被彻底带偏。";
        } else {
          effects.reputation -= 1;
          note = "你的表态被解读成缺少锐气，球迷并不完全买账。";
        }
      }
    }

    if (event.id === "rival-transfer-backlash") {
      var rivalryComposure = averageSkills([profile.workRate, profile.offBall, profile.passing]) +
        Math.round(player.status.reputation * 0.12);
      if (option.label === "解释这是职业决定") {
        if (player.status.reputation >= 68 && Math.random() > 0.42) {
          effects.reputation += 2;
          effects.happiness += 1;
          note = "你的解释让部分球迷冷静下来，但老东家看台仍不会轻易原谅这次转会。";
        } else {
          effects.reputation -= 3;
          effects.happiness -= 2;
          note = "采访被截取成争议标题，两边球迷都不满意，你的公众声望继续下滑。";
        }
      } else if (option.label === "用德比表现回应") {
        if (rivalryComposure + randomInt(-12, 12) >= 72) {
          effects.reputation += 5;
          effects.coachRelation += 2;
          note = "你顶住敌意并在直接对话中交出关键表现，新东家的球迷开始真正接纳你。";
        } else {
          effects.reputation -= 8;
          effects.happiness -= 4;
          effects.coachRelation -= 2;
          note = "你在死敌对决中没能兑现豪言，旧主球迷嘲讽、新东家球迷质疑，声望遭遇重创。";
        }
      } else if (option.label === "保持沉默专注训练") {
        if (Math.random() > 0.58) {
          effects.coachRelation += 2;
          note = "你没有参与口水战，训练态度获得教练认可，但老东家球迷的敌意依旧存在。";
        } else {
          effects.reputation -= 2;
          note = "沉默被媒体解读为默认背叛指控，舆论持续发酵，你的声望进一步受损。";
        }
      }
    }

    if (event.id === "transfer-fee-pressure") {
      var adaptation = averageSkills([profile.workRate, profile.offBall, profile.passing]);
      if (option.label === "主动承担核心责任") {
        if (adaptation + randomInt(-12, 12) >= 68) {
          effects.reputation += 5;
          effects.coachRelation += 3;
          effects.happiness += 2;
          note = "你很快用关键表现回应了高额转会费，外界开始把这笔交易视为值得的投入。";
        } else {
          effects.reputation -= 7;
          effects.coachRelation -= 5;
          effects.happiness -= 5;
          effects.overall -= 1;
          note = "你没能迅速适应新环境，连续低迷表现让转会费成为每场比赛后都会被提起的话题。";
        }
      } else if (option.label === "先适应新的环境") {
        if (player.status.coachRelation >= 60 || Math.random() > 0.42) {
          effects.overall += 1;
          effects.coachRelation += 2;
          note = "教练组给了你足够耐心，你逐渐理解了新体系，压力也开始下降。";
        } else {
          effects.reputation -= 3;
          effects.happiness -= 2;
          note = "适应期比预想中更长，你逐渐失去首发位置，媒体开始质疑俱乐部为何支付如此高的费用。";
        }
      } else if (option.label === "公开反击转会费质疑") {
        if (player.status.reputation >= 78 && Math.random() > 0.35) {
          effects.reputation += 3;
          effects.happiness += 2;
          note = "你的强硬回应激发了斗志，随后几场比赛的表现让批评声暂时安静下来。";
        } else {
          effects.reputation -= 5;
          effects.coachRelation -= 3;
          effects.happiness -= 3;
          note = "公开回应没有换来好表现，舆论反而变得更加尖锐，俱乐部也对你的处理方式感到不满。";
        }
      }
    }

    if (event.id === "unexpected-injury" || event.id === "unexpected-major-injury") {
      var isMajorInjury = event.id === "unexpected-major-injury";
      if (option.label === "完整接受康复治疗") {
        if (Math.random() > 0.22) {
          effects.fitness += isMajorInjury ? 8 : 5;
          effects.happiness += 2;
          note = "漫长恢复影响了出场，但伤势最终得到控制，没有留下明显后遗症。";
        } else {
          effects.overall -= 1;
          effects.fitness -= 4;
          note = "恢复过程出现反复，你错过了更多比赛，竞技状态也受到了一些长期影响。";
        }
      } else if (option.label === "缩短恢复期提前复出") {
        if (Math.random() > (isMajorInjury ? 0.72 : 0.55)) {
          effects.reputation += 4;
          effects.fitness += 8;
          note = "你冒险赶上了关键比赛，并用表现暂时压住了伤病和外界的担忧。";
        } else {
          effects.fitness -= isMajorInjury ? 12 : 8;
          effects.overall -= isMajorInjury ? 2 : 1;
          effects.reputation -= 2;
          effects.happiness -= 3;
          note = "提前复出导致伤情反复，你不得不再次长期休战，身体状态和球队位置都受到打击。";
        }
      } else if (option.label === "调整踢法保护身体") {
        if (profile.offBall + profile.passing >= 130) {
          effects.overall += 1;
          effects.fitness += 4;
          note = "你依靠阅读比赛和处理球方式减少了身体消耗，新踢法逐渐稳定下来。";
        } else {
          effects.reputation -= 2;
          effects.coachRelation -= 2;
          note = "新的踢法没有完全掩盖身体限制，你在场上的影响力明显下降。";
        }
      }
    }

    if (event.id.indexOf("catastrophic-defeat-aftermath-") === 0) {
      var reboundChance =
        option.label === "推动全队彻底复盘" ? 0.56 :
        option.label === "从身体和训练重建" ? 0.52 : 0.48;
      reboundChance += (player.status.coachRelation - 55) * 0.002;
      reboundChance += (player.status.happiness - 55) * 0.0015;
      if (Math.random() < clamp(reboundChance, 0.34, 0.68)) {
        effects.reputation += 4;
        effects.happiness += 5;
        effects.coachRelation += 3;
        effects.fitness += 3;
        player.developmentMomentum = Math.max(3, player.developmentMomentum || 0);
        note = "球队没有被惨案击垮。复盘和训练重新凝聚了更衣室，耻辱开始转化为触底反弹的动力。";
      } else {
        effects.reputation -= 4;
        effects.happiness -= 6;
        effects.coachRelation -= 4;
        effects.fitness -= 3;
        player.potential = Math.max(player.overall, player.potential - randomInt(1, 3));
        player.developmentMomentum = Math.min(-3, player.developmentMomentum || 0);
        note = "惨败的裂痕没有愈合。更衣室互相怀疑，舆论持续施压，球队和你的发展都进入一段沉沦期。";
      }
    }

    var initialResultType = classifyChoiceEffect(note, effects, {
      competitionOutcome: competitionOutcome
    });
    var alreadyFailed = initialResultType === "failure";
    var hasResolvedHighStakesOutcome = Boolean(
      competitionOutcome ||
      competitionImpact ||
      positionChange ||
      initialResultType !== "neutral"
    );
    if (!alreadyFailed && !hasResolvedHighStakesOutcome) {
      var riskChance = 0.18;
      if (/主动|公开|强行|全力|提前|承担|要求|反击/.test(option.label)) {
        riskChance += 0.12;
      }
      if (player.status.fitness < 60) riskChance += 0.07;
      if (player.status.happiness < 45) riskChance += 0.06;
      if (player.status.coachRelation < 42) riskChance += 0.06;
      if (Math.random() < clamp(riskChance, 0.16, 0.48)) {
        effects.overall = Math.min(0, effects.overall);
        var setbackType = pickOne(["media", "locker-room", "physical", "sporting"]);
        if (setbackType === "media") {
          effects.reputation = Math.min(-randomInt(4, 8), effects.reputation);
          effects.happiness = Math.min(-randomInt(2, 5), effects.happiness);
          effects.transferInterest = Math.max(2, effects.transferInterest);
          note = "计划没有按预想推进，失误被媒体持续放大，舆论争议让你的声望和心态明显受损。";
        } else if (setbackType === "locker-room") {
          effects.coachRelation = Math.min(-randomInt(4, 7), effects.coachRelation);
          effects.happiness = Math.min(-randomInt(4, 7), effects.happiness);
          effects.reputation = Math.min(-2, effects.reputation);
          note = "这次决定引发更衣室矛盾，部分队友公开质疑你的处理方式，教练组也不得不介入。";
        } else if (setbackType === "physical") {
          effects.fitness = Math.min(-randomInt(6, 12), effects.fitness);
          effects.happiness = Math.min(-randomInt(2, 4), effects.happiness);
          effects.reputation = Math.min(-1, effects.reputation);
          note = "你为执行决定付出了超出预期的身体代价，恢复节奏被打乱，随后一段时间的状态明显波动。";
        } else {
          effects.reputation = Math.min(-randomInt(3, 6), effects.reputation);
          effects.coachRelation = Math.min(-randomInt(2, 5), effects.coachRelation);
          effects.fitness = Math.min(-randomInt(2, 6), effects.fitness);
          note = "事情的发展偏离原定方向，场上效果没有兑现承诺，教练组和外界同时降低了评价。";
        }
      } else if (Math.random() < 0.12) {
        var positiveAftermath = pickOne(["support", "unity", "momentum"]);
        if (positiveAftermath === "support") {
          effects.reputation += randomInt(2, 5);
          effects.happiness += randomInt(1, 3);
          note = "这次处理意外赢得球迷和媒体支持，外界评价迅速转好。";
        } else if (positiveAftermath === "unity") {
          effects.coachRelation += randomInt(2, 5);
          effects.happiness += randomInt(2, 4);
          note = "你的处理方式让更衣室更加团结，队友和教练组都提高了对你的信任。";
        } else {
          effects.fitness += randomInt(2, 5);
          effects.reputation += randomInt(1, 3);
          note = "决定执行得比预期顺利，连续的正面反馈让你的竞技状态进一步提升。";
        }
      }
    }
    if (
      !alreadyFailed &&
      hasResolvedHighStakesOutcome &&
      Math.random() < 0.14
    ) {
      var secondaryCost = pickOne(["media", "locker-room", "physical"]);
      if (secondaryCost === "media") {
        effects.reputation -= randomInt(2, 5);
        effects.happiness -= randomInt(1, 3);
        note += " 不过赛后的言论引发舆论争议，外界并没有完全接受你的处理方式。";
      } else if (secondaryCost === "locker-room") {
        effects.coachRelation -= randomInt(2, 4);
        effects.happiness -= randomInt(2, 5);
        note += " 不过队内对责任和球权分配产生分歧，更衣室关系因此出现裂痕。";
      } else {
        effects.fitness -= randomInt(5, 10);
        note += " 不过这次决定造成明显透支，后续恢复和出场节奏都会受到影响。";
      }
    }

    var finalResultType = classifyChoiceEffect(note, effects, {
      competitionOutcome: competitionOutcome
    });
    return {
      effects: effects,
      note: note,
      resultType: finalResultType,
      competitionOutcome: competitionOutcome,
      majorMatchStory: majorMatchStory,
      competitionImpact: competitionImpact,
      positionChange: positionChange,
      transitionType: transitionType
    };
  }

  function applyEffects(player, effects) {
    if (effects.overall) {
      applyProfileDevelopment(player, effects.overall);
    }
    if (effects.reputation) {
      player.status.reputation = applyReputationChange(player, getClubById(player.currentClubId), effects.reputation);
    }
    if (effects.fitness) {
      player.status.fitness = clamp(player.status.fitness + effects.fitness, 30, 100);
    }
    if (effects.coachRelation) {
      player.status.coachRelation = clamp(player.status.coachRelation + effects.coachRelation, 1, 100);
    }
    if (effects.happiness) {
      player.status.happiness = clamp(player.status.happiness + effects.happiness, 1, 100);
    }
    if (effects.transferInterest) {
      player.status.transferInterest = clamp(player.status.transferInterest + effects.transferInterest, 0, 60);
    }
    if (effects.value) {
      player.value = Math.max(100000, player.value + effects.value);
    }
  }

  function buildHeroHeader(player, club) {
    return (
      '<div class="panel player-card">' +
      '  <div class="overall-card"><small>OVR</small><div class="overall-number">' + player.overall + "</div></div>" +
      '  <div>' +
      '    <div class="topline"><div><div class="badge">' + player.flag + " " + player.country + '</div><h2 class="section-title">' + player.name + '</h2></div><div class="age-badge">' + player.age + " 岁</div></div>" +
      '    <div class="overview-grid">' +
      buildStatCard("位置", player.position + " · " + player.dominantFoot) +
      buildStatCard("号码", "#" + player.number) +
      buildStatCard("俱乐部", '<span class="stat-club-value">' + buildClubBadge(club, "stat-club-badge") + "<span>" + getClubDisplayName(club) + "</span></span>") +
      buildStatCard("联赛", getLeagueDisplayName(club.league)) +
      buildStatCard("打法", describePlayerStyle(player)) +
      buildStatCard("比赛徽章", getPlayerPlayStyles(player).join(" / ") || "暂无") +
      (player.isCaptain ? buildStatCard("身份", "球队队长") : "") +
      buildStatCard("球队战术", getClubTacticalStyle(club).name) +
      buildStatCard("出身", player.origin) +
      buildStatCard("青训", player.academy) +
      buildStatCard("身价", formatMoney(player.value)) +
      "    </div>" +
      "  </div>" +
      "</div>"
    );
  }

  function buildStatCard(label, value) {
    return '<div class="stat-card"><div class="stat-label">' + label + '</div><div class="stat-value">' + value + "</div></div>";
  }

  function buildMiniStat(label, value) {
    return '<div class="stat-card"><div class="stat-label">' + label + '</div><div class="stat-value">' + value + "</div></div>";
  }

  function buildSummaryCard(label, value) {
    return '<div class="summary-card"><div class="stat-label">' + label + '</div><div class="stat-value">' + value + "</div></div>";
  }

  function buildPositionContributionNote(summary) {
    if (summary.position === "GK") {
      return '<p class="section-copy season-review"><strong>门将贡献：</strong>' +
        (summary.cleanSheets || 0) + " 次零封，" +
        (summary.penaltySaves || 0) + " 次扑出点球。关键扑救和禁区控制共同构成了你的赛季评价。</p>";
    }
    if (["CB", "LB", "RB"].indexOf(summary.position) !== -1) {
      return '<p class="section-copy season-review"><strong>防守贡献：</strong>参与 ' +
        (summary.cleanSheets || 0) + " 场零封，打入 " +
        (summary.headedGoals || 0) + " 粒头球，其中 " +
        (summary.setPieceGoals || 0) + " 球来自定位球进攻。</p>";
    }
    return "";
  }

  function renderTrophyPill(name) {
    return '<span class="trophy-pill">' + findTrophyIcon(name) + " " + name + "</span>";
  }

  function buildSeasonBadgeRow(summary) {
    var badges = (summary.trophies || []).map(renderTrophyPill);
    (summary.nationalHonors || []).forEach(function (name) {
      badges.push('<span class="trophy-pill national-trophy-pill">' + findTrophyIcon(name) + " " + name + "</span>");
    });
    (summary.achievements || []).forEach(function (name) {
      if (name === "联赛降级") {
        badges.push('<span class="negative-achievement-pill">↓ 联赛降级</span>');
      } else {
        badges.push('<span class="trophy-pill achievement-pill">★ ' + name + "</span>");
      }
    });
    (summary.injuries || []).forEach(function (injury) {
      badges.push('<span class="injury-pill injury-' + injury.severity + '" title="' + injury.detail + '">✚ ' + injury.label + "</span>");
    });

    if (badges.length) {
      return '<div class="trophy-row">' + badges.join("") + "</div>";
    }
    return '<div class="empty-state">这一年没有收获冠军，也没有遭遇需要记录的伤病。</div>';
  }

  function buildCompetitionBreakdown(summary) {
    var competitionStats = summary.competitionStats;
    if (!competitionStats) return "";
    var parts = [
      "联赛 " + competitionStats.league + "/" + competitionStats.leagueAvailable,
      "国内杯 " + competitionStats.domesticCup + "/" + competitionStats.domesticCupAvailable
    ];
    if (competitionStats.continentalAvailable) {
      parts.push(
        competitionStats.continentalName + " " +
        competitionStats.continental + "/" + competitionStats.continentalAvailable
      );
    }
    if (competitionStats.injuryMatchesMissed) {
      parts.push("伤缺 " + competitionStats.injuryMatchesMissed + " 场");
    }
    var europeanResult = competitionStats.continentalWorldResult;
    if (europeanResult) {
      var championClub = getClubById(europeanResult.championId);
      var runnerUpClub = getClubById(europeanResult.runnerUpId);
      parts.push(
        competitionStats.continentalName + "冠军：" +
        (championClub ? getClubDisplayName(championClub) : "待定") +
        (runnerUpClub ? " · 决赛 " + europeanResult.finalScore + " " + getClubDisplayName(runnerUpClub) : "")
      );
    }
    var standing = summary.leagueStanding;
    var standingText = standing
      ? "联赛第 " + standing.position + "/" + standing.teamCount + " 名 · " +
        standing.points + " 分 · " + standing.status
      : "";
    var recordText = standing && typeof standing.wins === "number"
      ? standing.played + " 场 " + standing.wins + "胜" + standing.draws + "平" +
        standing.losses + "负 · 进" + standing.goalsFor + "球 / 失" + standing.goalsAgainst + "球"
      : "";
    return '<div class="competition-breakdown">' +
      (standingText ? '<span>赛季排名</span><b>' + standingText + '</b>' : '') +
      (recordText ? '<b>' + recordText + '</b>' : '') +
      '<span>出场构成</span>' + parts.map(function (part) {
      return "<b>" + part + "</b>";
    }).join("") + "</div>";
  }

  function buildContinentalCampaignStory(competitionStats) {
    if (!competitionStats || !competitionStats.continentalName) return "";
    var competitionName = competitionStats.continentalName;
    if (competitionStats.continentalStage === "冠军") {
      return competitionStats.continentalNotableWin || ("你随队赢得了" + competitionName + "冠军。");
    }
    if (competitionStats.continentalOpponent) {
      return competitionName + "征程止步" +
        competitionStats.continentalStage.replace("出局", "").replace("失利", "") + "，你们" +
        (competitionStats.continentalScore || "负于 ") +
        competitionStats.continentalOpponent + "；" +
        (competitionStats.continentalNotableWin
          ? "此前曾在" + competitionStats.continentalNotableWin.replace(competitionName, "") + "。"
          : "这场失利结束了本赛季的欧战征程。");
    }
    if (competitionStats.continentalLeaguePosition) {
      return competitionName + "联赛阶段排名第 " +
        competitionStats.continentalLeaguePosition + "，" +
        competitionStats.continentalStage + "。";
    }
    return competitionName + competitionStats.continentalStage + "。";
  }

  function buildDomesticCupStory(club, competitionStats) {
    if (!competitionStats || !competitionStats.domesticCupStage) return "";
    var cupName = getCompetitionNames(club).domesticCup.replace("冠军", "");
    if (competitionStats.domesticCupStage === "冠军") {
      return getClubDisplayName(club) + " 赢得" + cupName + "冠军。";
    }
    return cupName + competitionStats.domesticCupStage +
      (competitionStats.domesticCupOpponent
        ? "，负于 " + competitionStats.domesticCupOpponent + "。"
        : "。");
  }

  function buildSeasonDefeatReason(player, club, stats, competitionStats, seasonOutlook) {
    if (!competitionStats || !seasonOutlook) return "";

    var competition = "";
    var stage = "";
    var opponentName = "";
    var continentalStage = competitionStats.continentalStage || "";
    var domesticStage = competitionStats.domesticCupStage || "";
    var importantContinentalExit =
      competitionStats.continentalName &&
      /十六强出局|八强出局|半决赛出局|决赛失利/.test(continentalStage);
    var importantDomesticExit = /半决赛出局|决赛失利/.test(domesticStage);

    if (importantContinentalExit) {
      competition = competitionStats.continentalName;
      stage = continentalStage;
      opponentName = competitionStats.continentalOpponent || "对手";
    } else if (importantDomesticExit) {
      competition = getCompetitionNames(club).domesticCup.replace("冠军", "");
      stage = domesticStage;
      opponentName = competitionStats.domesticCupOpponent || "对手";
    } else if (
      seasonOutlook.leagueStanding &&
      seasonOutlook.leagueStanding.position === 2
    ) {
      competition = getLeagueDisplayName(club.league);
      stage = "争冠冲刺";
      var leagueOpponent = pickLeagueOpponent(club);
      opponentName = leagueOpponent ? getClubDisplayName(leagueOpponent) : "争冠对手";
    } else {
      return null;
    }

    var playerWasKey = player.overall >= getClubStrength(club) - 3 && stats.appearances >= 22;
    var reasons = [
      "扳平球在补时阶段被 VAR 判定越位，" + getClubDisplayName(club) + " 最终没能改写结果。",
      "球队在最后时刻被 " + opponentName + " 完成绝杀，整季努力停在了终场哨前。",
      opponentName + " 的门将打出超神表现，连续化解必进球，让比赛始终无法被扳回来。",
      "一次争议判罚改变了比赛走势，" + getClubDisplayName(club) + " 在持续围攻中仍未能追回比分。",
      "球队领先后没能控制住节奏，" + opponentName + " 在下半场完成逆转。",
      "决胜点球大战中球队罚失关键点球，最终以最残酷的方式告别赛事。"
    ];

    if (player.position === "GK") {
      reasons.push(
        "你完成了多次关键扑救，但防线在最后一次定位球中漏人，球队仍被 " + opponentName + " 淘汰。"
      );
    } else if (["CB", "LB", "RB"].indexOf(player.position) !== -1) {
      reasons.push(
        "球队大部分时间守住了压力，却在一次定位球二点争抢中失位，被 " + opponentName + " 抓住唯一机会。"
      );
    } else if (playerWasKey) {
      reasons.push(
        "你创造出了足够多的机会，但全队临门一脚连续失准，" + opponentName + " 将微弱优势守到了最后。"
      );
    }

    return {
      source: importantContinentalExit
        ? "continental"
        : importantDomesticExit
        ? "domestic"
        : "league",
      text: competition + stage + "的转折点在于：" + pickOne(reasons)
    };
  }

  function buildLeagueOutcomeStory(club, standing) {
    if (!standing) return "";
    var leagueName = getLeagueDisplayName(club.league);
    if (standing.position === 1) {
      return getClubDisplayName(club) + " 以 " + standing.points + " 分夺得" + leagueName + "冠军。";
    }
    if (standing.status === "直接升级") {
      return getClubDisplayName(club) + " 以联赛第 " + standing.position + " 名直接升级。";
    }
    if (standing.status === "升级附加赛区") {
      return getClubDisplayName(club) + " 获得升级附加赛资格，赛季仍要经过最后考验。";
    }
    if (standing.status === "降级区") {
      return getClubDisplayName(club) + " 仅列第 " + standing.position + " 名，赛季结束后降级。";
    }
    if (standing.status === "保级附加赛") {
      return getClubDisplayName(club) + " 落入保级附加赛，需要为顶级联赛席位再战两场。";
    }
    if (standing.status.indexOf("欧") === 0) {
      return getClubDisplayName(club) + " 排名第 " + standing.position + "，获得" + standing.status + "资格。";
    }
    return "";
  }

  function buildAnnualReview(summary, player) {
    var output = summary.goals + summary.assists;
    var performance = summary.appearances >= 34 ? "你是球队全年稳定的主力选择" :
      summary.appearances >= 22 ? "你在轮换阵容中拥有较为稳定的位置" :
      "你仍处于边缘轮换，连续比赛机会不多";
    var production;
    if (["ST", "LW", "RW", "LM", "RM", "CAM"].indexOf(summary.position) !== -1) {
      production = output >= 25 ? "，进攻影响力达到核心级别" :
        output >= 12 ? "，进攻端已经能够稳定提供帮助" :
        "，进攻影响力暂时有限";
    } else if (summary.position === "CM" || summary.position === "CAM") {
      production = output >= 15 ? "，中场创造力非常突出" :
        output >= 7 ? "，攻防连接较为稳定" :
        "，主要职责仍是执行球队战术";
    } else {
      production = summary.goals >= 6 ? "，同时贡献了罕见的后场得分产量" :
        "，主要价值来自防守、覆盖和体系执行";
    }
    var importantMemory = getImportantSeasonMemory(summary);
    var campaignReview = [
      summary.leagueOutcomeStory,
      summary.defeatReasonSource === "league" ? summary.defeatReason : "",
      summary.titleDroughtStory,
      summary.domesticCupStory,
      summary.defeatReasonSource === "domestic" ? summary.defeatReason : "",
      summary.continentalStory,
      summary.defeatReasonSource === "continental" ? summary.defeatReason : ""
    ].filter(Boolean).join(" ");
    return performance + production + "。" +
      (campaignReview ? '<span class="important-memory"><strong>赛季进程：</strong>' + campaignReview + "</span>" : "") +
      (importantMemory ? '<span class="important-memory"><strong>年度记忆：</strong>' + importantMemory + "</span>" : "");
  }

  function getImportantSeasonMemory(summary) {
    if (summary.keyMatchStory) {
      return summary.keyMatchStory;
    }
    if (summary.derbyWasFeatured && summary.derbyNote) {
      return summary.derbyNote + "。";
    }
    if (summary.legendStory) {
      return summary.legendStory;
    }
    if (summary.specialSeasonStory) {
      return summary.specialSeasonStory;
    }
    if (summary.nationalHonors && summary.nationalHonors.length) {
      return summary.seasonMoment;
    }
    if (summary.derbyNote && (summary.derbyWasFeatured || Math.abs(summary.derbyImportance || 0) >= 3)) {
      return summary.derbyNote + "。";
    }

    var majorTrophies = (summary.trophies || []).filter(function (name) {
      return name.indexOf("冠军") !== -1 ||
        name === "金球奖" ||
        name.indexOf("金靴") !== -1 ||
        name.indexOf("助攻王") !== -1;
    });
    if (majorTrophies.length) {
      return summary.seasonMoment;
    }

    var majorAchievements = (summary.achievements || []).filter(function (name) {
      return name === "单季40球" ||
        name === "助攻纪录级赛季" ||
        name === "后卫进球纪录" ||
        name === "世界最佳球员" ||
        name === "传奇时刻";
    });
    if (majorAchievements.length) {
      return summary.seasonMoment;
    }

    var majorInjury = (summary.injuries || []).find(function (injury) {
      return injury.severity === "major";
    });
    if (majorInjury) {
      return majorInjury.detail;
    }
    return "";
  }

  function formatEffects(effects) {
    return Object.keys(effects).map(function (key) {
      var value = effects[key];
      var display = effectLabel(key) + " " + signed(value);
      return '<span class="impact-pill ' + (value >= 0 ? "impact-up" : "impact-down") + '">' + display + "</span>";
    }).join("");
  }

  function effectLabel(key) {
    var labels = {
      overall: "OVR",
      reputation: "声望",
      fitness: "体能",
      coachRelation: "关系",
      happiness: "心情",
      transferInterest: "转会",
      value: "身价"
    };
    return labels[key] || key;
  }

  function getClubDisplayName(club) {
    return club.nameZh || CLUB_NAME_ZH[club.id] || club.name;
  }

  function getLeagueDisplayName(leagueName) {
    return LEAGUE_NAME_ZH[leagueName] || leagueName;
  }

  function buildChoiceOutcome(event, option, summary, dynamicNote) {
    var effects = option.effects || {};
    if (dynamicNote) {
      return dynamicNote;
    }
    if (effects.overall > 0) return "训练取得了正面效果。";
    if (effects.overall < 0) return "适应过程并不顺利。";
    if (effects.coachRelation > 0) return "你的处理方式得到了教练认可。";
    if (effects.reputation > 0) return "这次决定提高了外界评价。";
    if (effects.fitness < 0) return "选择带来了额外身体消耗。";
    if (effects.happiness > 0) return "你的心态因此更加稳定。";
    return "影响暂时没有完全显现。";
  }

  function describePlayerStyle(player) {
    if (!player.profile) {
      return "风格未定";
    }
    var archetypes = getPositionArchetypes(player.position).sort(function (a, b) {
      return getArchetypeScore(player, b) - getArchetypeScore(player, a);
    });
    var footRole = getFootednessRole(player);
    var footLabel = footRole === "inverted-wide" ? "逆足内切" :
      footRole === "natural-wide" ? "顺足拉边" :
      footRole === "inverted-fullback" ? "逆足内收" :
      footRole === "natural-fullback" ? "顺足套边" : "";
    return archetypes[0].name + " / " + (footLabel || archetypes[1].name);
  }

  function getPlayerPlayStyles(player) {
    var profile = player.profile || {};
    var styles = [];
    if (profile.passing >= 84 && profile.vision >= 84) styles.push("精准直塞");
    if (profile.dribbling >= 85 && profile.pace >= 80) styles.push("技术盘带");
    if (profile.finishing >= 86 && profile.offBall >= 84) styles.push("禁区终结");
    if (profile.defending >= 85 && profile.strength >= 80) styles.push("拦截屏障");
    if (profile.aerial >= 85 && profile.strength >= 80) styles.push("制空强点");
    if (profile.workRate >= 87) styles.push("不懈奔跑");
    if (player.position === "GK" && profile.reflexes >= 85) styles.push("神速反应");
    if (player.position === "GK" && profile.passing >= 82 && profile.vision >= 78) styles.push("门将出球");
    return styles.slice(0, 3);
  }

  function getPositionGroup(position) {
    if (position === "GK") {
      return "GK";
    }
    if (position === "CB" || position === "LB" || position === "RB") {
      return "DEF";
    }
    if (position === "CM" || position === "CAM") {
      return "MID";
    }
    if (position === "LM" || position === "RM" || position === "LW" || position === "RW") {
      return "WIDE";
    }
    return "ST";
  }

  function getOverallClass(overall) {
    if (overall >= 95) return "rating-elite";
    if (overall >= 90) return "rating-world-class";
    if (overall >= 80) return "rating-gold";
    if (overall >= 70) return "rating-silver";
    return "rating-bronze";
  }

  function getPeakOverall(career) {
    return career.reduce(function (maxValue, entry) {
      return Math.max(maxValue, entry.overall);
    }, 0);
  }

  function getConsecutiveClubTrophyWins(player, clubId, trophyName) {
    var targetClub = getClubById(clubId);
    var targetName = targetClub ? getClubDisplayName(targetClub) : "";
    var streak = 0;

    for (var i = player.career.length - 1; i >= 0; i -= 1) {
      var entry = player.career[i];
      if (entry.clubName !== targetName) {
        break;
      }
      if (entry.trophies.indexOf(trophyName) === -1) {
        break;
      }
      streak += 1;
    }

    return streak;
  }

  function getBandProfile(club) {
    if (club.band === "豪门") {
      return { min: Math.max(club.leagueLevel === 1 ? 76 : 70, club.strength - 12), max: Math.min(99, club.strength + 5), volatility: 5 };
    }
    if (club.band === "强队") {
      return { min: Math.max(club.leagueLevel === 1 ? 66 : 60, club.strength - 9), max: Math.min(92, club.strength + 6), volatility: 6 };
    }
    return { min: Math.max(club.leagueLevel === 1 ? 54 : 50, club.strength - 8), max: Math.min(86, club.strength + 7), volatility: 7 };
  }

  function getTransferPull(club) {
    if (typeof club.transferPower === "number") {
      return clamp(club.transferPower, 45, 99);
    }
    var bandBoost = club.band === "豪门" ? 8 : club.band === "强队" ? 4 : 0;
    return clamp(Math.round(club.reputation * 0.55 + club.salaryLevel * 0.35 + bandBoost), 45, 99);
  }

  function getFinancialPower(club) {
    var economyModifier = ensureClubEconomy(club);
    var baseFinance = 0;
    if (typeof club.finance === "number") {
      baseFinance = club.finance;
    } else {
      var leagueBonus = club.leagueLevel === 1 ? 4 : 0;
      baseFinance = Math.round(club.salaryLevel * 0.7 + club.reputation * 0.2 + leagueBonus);
    }
    return clamp(baseFinance + economyModifier, 32, 99);
  }

  function ensureClubEconomy(club) {
    state.clubEconomics = state.clubEconomics || {};
    if (!state.clubEconomics[club.id] && state.clubEconomics[club.id] !== 0) {
      state.clubEconomics[club.id] = randomInt(-2, 2);
    }
    return state.clubEconomics[club.id];
  }

  function getBoardStability(club) {
    if (typeof club.board === "number") {
      return clamp(club.board, 42, 96);
    }
    var youthComponent = Math.round(club.youthChance * 0.35);
    var reputationComponent = Math.round(club.reputation * 0.3);
    var bandBoost = club.band === "豪门" ? 12 : club.band === "强队" ? 6 : 0;
    return clamp(youthComponent + reputationComponent + bandBoost, 42, 96);
  }

  function ensureClubForm(club) {
    if (!state.clubForms[club.id] && state.clubForms[club.id] !== 0) {
      state.clubForms[club.id] = randomInt(-2, 2);
    }
    return state.clubForms[club.id];
  }

  function getClubStrength(club) {
    var profile = getBandProfile(club);
    var transferPull = getTransferPull(club);
    var financialPower = getFinancialPower(club);
    var boardStability = getBoardStability(club);
    var baseStrength = Math.round(clamp(club.strength * 0.48 + transferPull * 0.2 + financialPower * 0.18 + boardStability * 0.14, profile.min, profile.max));
    var currentForm = ensureClubForm(club);
    return clamp(baseStrength + currentForm, profile.min, profile.max);
  }

  function evolveClubForm(club, playerClubId, summary) {
    var profile = getBandProfile(club);
    var currentForm = ensureClubForm(club);
    var transferPull = getTransferPull(club);
    var financialPower = getFinancialPower(club);
    var boardStability = getBoardStability(club);
    var drift = randomInt(-profile.volatility, profile.volatility);
    var meanReversion = currentForm > 0 ? -1 : currentForm < 0 ? 1 : 0;
    var prestigeRecovery = transferPull >= 84 && currentForm < 0 ? 1 : 0;
    var financialRecovery = financialPower >= 78 && currentForm < -1 ? 1 : 0;
    var stabilityBoost = boardStability >= 76 && currentForm < -2 ? 1 : 0;
    var boardShock = boardStability < 58 && Math.random() > 0.7 ? -1 : 0;
    var playerImpact = 0;
    var economyChange = randomInt(-2, 2);

    if (club.id === playerClubId && summary) {
      playerImpact += summary.trophies.length * 2;
      playerImpact += summary.growth >= 3 ? 1 : 0;
      playerImpact += summary.goals >= 12 || summary.assists >= 10 ? 1 : 0;
      playerImpact -= summary.appearances < 14 ? 1 : 0;
      economyChange += summary.trophies.length >= 2 ? 2 : summary.trophies.length ? 1 : -1;
    }

    if (currentForm >= 4) {
      economyChange += 1;
    } else if (currentForm <= -4) {
      economyChange -= 1;
    }
    if (club.reputation >= 88 && ensureClubEconomy(club) < -3) {
      economyChange += 1;
    }
    if (boardStability < 55 && Math.random() < 0.18) {
      economyChange -= 2;
    }

    state.clubForms[club.id] = clamp(currentForm + drift + meanReversion + prestigeRecovery + financialRecovery + stabilityBoost + boardShock + playerImpact, -12, 10);
    state.clubEconomics[club.id] = clamp(ensureClubEconomy(club) + economyChange, -14, 12);
  }

  function evolveClubLandscape(playerClubId, summary) {
    window.CLUBS.forEach(function (club) {
      evolveClubForm(club, playerClubId, summary);
    });
  }

  function getClubById(clubId) {
    return window.CLUBS.find(function (club) { return club.id === clubId; });
  }

  function getCountryByCode(code) {
    return window.COUNTRIES.find(function (country) { return country.code === code; }) || window.COUNTRIES[0];
  }

  function getRelevantDerby(clubId) {
    var rivalries = (window.DERBIES || []).filter(function (derby) {
      return derby.clubs.indexOf(clubId) !== -1;
    });
    if (!rivalries.length) {
      return null;
    }
    var weightedRivalries = [];
    rivalries.forEach(function (derby) {
      var weight = derby.priority || 1;
      for (var i = 0; i < weight; i += 1) {
        weightedRivalries.push(derby);
      }
    });
    return pickOne(weightedRivalries);
  }

  function getDerbyBetweenClubs(firstClubId, secondClubId) {
    return (window.DERBIES || []).find(function (derby) {
      return derby.clubs.indexOf(firstClubId) !== -1 &&
        derby.clubs.indexOf(secondClubId) !== -1;
    }) || null;
  }

  function getDirectRivalClubs(clubId) {
    var rivalIds = [];
    (window.DERBIES || []).forEach(function (derby) {
      if (derby.clubs.indexOf(clubId) === -1) return;
      derby.clubs.forEach(function (rivalId) {
        if (rivalId !== clubId && rivalIds.indexOf(rivalId) === -1) {
          rivalIds.push(rivalId);
        }
      });
    });
    return rivalIds.map(getClubById).filter(Boolean);
  }

  function getStartingClubs(startKey) {
    if (startKey === "asia") {
      return window.CLUBS.filter(function (club) {
        return club.region === "亚洲" && club.strength <= 76;
      });
    }

    if (startKey === "second") {
      return window.CLUBS.filter(function (club) {
        return club.region === "欧洲" && club.leagueLevel === 2;
      });
    }

    if (startKey === "ladder") {
      return window.CLUBS.filter(function (club) {
        return club.region === "欧洲" && club.leagueLevel === 1 && club.band !== "豪门" && club.strength <= 82;
      });
    }

    return window.CLUBS.filter(function (club) {
      return club.region === "欧洲" && club.leagueLevel === 1 && club.band !== "练级队";
    });
  }

  function pickAcademyClub(clubPool, currentClub) {
    var academyPool = clubPool.filter(function (club) {
      return club.id !== currentClub.id && Math.abs(club.strength - currentClub.strength) <= 10;
    });
    return pickOne(academyPool.length ? academyPool : clubPool);
  }

  function findTrophyIcon(name) {
    var trophyImage = getTrophyImage(name);
    if (trophyImage) {
      var visualClass = name === "世界杯冠军"
        ? " trophy-visual-compact trophy-visual-world-cup"
        : name === "足总杯冠军"
        ? " trophy-visual-compact"
        : "";
      return '<span class="trophy-visual' + visualClass + '"><span class="trophy-visual-fallback">🏆</span><img src="' +
        trophyImage + '" alt="' + name + '" loading="lazy" onload="this.previousElementSibling.style.display=\'none\'" onerror="this.style.display=\'none\'"></span>';
    }
    var match = window.TROPHIES.find(function (trophy) { return trophy.name === name; });
    if (match) return match.icon;
    if (name === "世界杯冠军") return "🌍";
    if (name === "世俱杯冠军") return "🌐";
    if (name.indexOf("欧冠") !== -1) return "🏆";
    if (name.indexOf("欧联") !== -1 || name.indexOf("欧协联") !== -1 || name.indexOf("亚冠") !== -1) return "🌐";
    if (name.indexOf("金球") !== -1) return "🥇";
    if (name.indexOf("金靴") !== -1) return "👟";
    if (name.indexOf("助攻") !== -1) return "🎯";
    if (name.indexOf("最佳") !== -1) return "⭐";
    if (name.indexOf("冠军") !== -1) return "🏆";
    return "🏅";
  }

  function getTrophyImage(name) {
    if (name.indexOf("金靴") !== -1) {
      return "assets/trophies/golden-boot.svg";
    }
    if (name === "欧冠冠军") {
      return "assets/trophies/champions-league.svg";
    }
    if (name === "欧联杯冠军") {
      return "assets/trophies/europa-league.svg";
    }
    if (name === "世界杯冠军") {
      return "assets/trophies/world-cup.svg";
    }
    if (/英超冠军|西甲冠军|德甲冠军|意甲冠军|法甲冠军|中超冠军|J1联赛冠军|K1联赛冠军|沙特联冠军|泰超冠军|马来超冠军/.test(name)) {
      return "assets/trophies/league-trophy.svg";
    }
    if (/足总杯冠军|国王杯冠军|德国杯冠军|意大利杯冠军|法国杯冠军|足协杯冠军|天皇杯冠军|沙王冠冠军/.test(name)) {
      return "assets/trophies/domestic-cup.svg";
    }
    if (name === "金球奖") {
      return "assets/trophies/ballon-dor.svg";
    }
    if (/亚洲杯冠军|欧洲杯冠军|美洲杯冠军|非洲杯冠军|中北美金杯赛冠军|大洋洲国家杯冠军|亚冠冠军/.test(name)) {
      return "assets/trophies/continental-cup.svg";
    }
    if (name === "世俱杯冠军") {
      return "assets/trophies/club-world-cup.svg";
    }
    return "";
  }

  function restartGame() {
    Object.keys(state.clubLeagueOrigins || {}).forEach(function (clubId) {
      var club = getClubById(clubId);
      var origin = state.clubLeagueOrigins[clubId];
      if (club && origin) {
        club.league = origin.league;
        club.leagueLevel = origin.leagueLevel;
      }
    });
    state = {
      screen: "create",
      player: null,
      currentEvent: null,
      round: 0,
      latestSummary: null,
      transferOptions: [],
      lastChoiceLabel: "",
      lastChoiceOutcome: "",
      lastChoiceResultType: "neutral",
      gameOver: false,
      clubForms: {},
      clubEconomics: {},
      clubLeagueOrigins: {}
    };
    render();
  }

  function formatMoney(value) {
    if (value >= 100000000) {
      return (value / 100000000).toFixed(1) + " 亿";
    }
    if (value >= 10000) {
      return Math.round(value / 10000) + " 万";
    }
    return String(value);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pickOne(list) {
    return list[randomInt(0, list.length - 1)];
  }

  function unique(list) {
    return Array.from(new Set(list));
  }

  function flatten(list) {
    return [].concat.apply([], list);
  }

  function signed(value) {
    return value > 0 ? "+" + value : String(value);
  }

  init();
})();
