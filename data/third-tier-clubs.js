(function () {
  var leagues = {
    "EFL League One": {
      country: "英格兰",
      region: "欧洲",
      teams: [
        "Barnsley", "Blackpool", "Bradford City", "Burton Albion",
        "Cambridge United", "Doncaster Rovers", "Huddersfield Town", "Leicester City",
        "Luton Town", "Mansfield Town", "Milton Keynes Dons", "Notts County",
        "Oxford United", "Peterborough United", "Plymouth Argyle", "Reading",
        "Sheffield Wednesday", "Stockport County", "Stevenage", "Wigan Athletic",
        "Wycombe Wanderers", "AFC Wimbledon", "Bromley", "Leyton Orient"
      ]
    },
    "Primera Federación": {
      country: "西班牙",
      region: "欧洲",
      teams: [
        "Arenas Club de Getxo", "Real Aviles Industrial", "Barakaldo CF", "Bilbao Athletic",
        "CP Cacereno", "CD Coria", "Cultural Leonesa", "Deportivo Fabril",
        "CD Extremadura", "UD Logrones", "CD Lugo", "Merida AD",
        "CD Mirandes", "UD Ourense", "SD Ponferradina", "Pontevedra CF",
        "Racing de Ferrol", "Real Union", "Unionistas de Salamanca", "Zamora CF",
        "Aguilas FC", "Algeciras CF", "Antequera CF", "FC Cartagena",
        "CE Europa", "Gimnastic de Tarragona", "Hercules CF", "SD Huesca",
        "UD Ibiza", "Real Jaen", "Juventud de Torremolinos", "Real Murcia",
        "UE Sant Andreu", "CD Teruel", "Villarreal B", "Real Zaragoza",
        "AD Alcorcon", "Atletico Madrileno", "Rayo Majadahonda", "Real Madrid Castilla"
      ]
    },
    "3. Liga": {
      country: "德国",
      region: "欧洲",
      teams: [
        "Alemannia Aachen", "MSV Duisburg", "Fortuna Dusseldorf", "Rot-Weiss Essen",
        "Fortuna Koln", "Sonnenhof Grossaspach", "TSV Havelse", "TSG Hoffenheim II",
        "FC Ingolstadt 04", "Waldhof Mannheim", "SV Meppen", "Preussen Munster",
        "Jahn Regensburg", "Hansa Rostock", "1. FC Saarbrucken", "VfB Stuttgart II",
        "SC Verl", "Viktoria Koln", "Wehen Wiesbaden", "Wurzburger Kickers"
      ]
    },
    "Serie C": {
      country: "意大利",
      region: "欧洲",
      teams: [
        "AlbinoLeffe", "Alcione Milano", "Arzignano Valchiampo", "Cittadella",
        "Dolomiti Bellunesi", "Giana Erminio", "Inter Milan U23", "Lecco",
        "Lumezzane", "Novara", "Ospitaletto", "Pergolettese",
        "Pro Patria", "Pro Vercelli", "Renate", "Trento",
        "Triestina", "Union Brescia", "Vicenza", "Virtus Verona",
        "Arezzo", "Ascoli", "Bra", "Campobasso",
        "Carpi", "Forli", "Gubbio", "Guidonia Montecelio",
        "Juventus Next Gen", "Livorno", "Perugia", "Pianese",
        "Pineto", "Pontedera", "Ravenna", "Sambenedettese",
        "Ternana", "Torres", "Vis Pesaro", "Atalanta U23",
        "Audace Cerignola", "Benevento", "Casarano", "Casertana",
        "Catania", "Cavese", "Cosenza", "Crotone",
        "Foggia", "Giugliano", "Latina", "Monopoli",
        "Picerno", "Potenza", "Salernitana", "Siracusa",
        "Sorrento", "Team Altamura", "Trapani"
      ]
    },
    "Championnat National": {
      country: "法国",
      region: "欧洲",
      teams: [
        "Sochaux", "Aubagne", "Bourg-en-Bresse Peronnas", "Dijon",
        "Villefranche Beaujolais", "Le Puy Foot", "Valenciennes", "Orleans",
        "Chateauroux", "Quevilly-Rouen", "Caen", "Stade Briochin",
        "Concarneau", "Paris 13 Atletico", "Fleury 91", "Versailles"
      ]
    },
    "China League Two": {
      country: "中国",
      region: "亚洲",
      teams: [
        "Beijing Institute of Technology", "Changchun Xidu", "Hangzhou Linping Wuyue", "Hubei Istar",
        "Jiangxi Lushan", "Lanzhou Longyuan Athletic", "Nantong Haimen Codion", "Shandong Taishan B",
        "Shanghai Port B", "Shanxi Chongde Ronghai", "Taian Tiankuang", "Wuxi Wugo",
        "Chengdu Rongcheng B", "Ganzhou Ruishi", "Guangdong Mingtu", "Guangxi Hengchen",
        "Guangxi Lanhang", "Guangzhou Dandelion Alpha", "Guizhou Zhucheng Athletic", "Kunming City",
        "Quanzhou Yassin", "Shenzhen 2028", "Wenzhou Professional", "Wuhan Three Towns B"
      ]
    },
    "J3 League": {
      country: "日本",
      region: "亚洲",
      teams: [
        "Azul Claro Numazu", "Fukushima United", "Gainare Tottori", "FC Gifu",
        "Giravanz Kitakyushu", "Kagoshima United", "Kamatamare Sanuki", "Kochi United",
        "Nara Club", "FC Osaka", "FC Ryukyu", "Tegevajaro Miyazaki",
        "Vanraure Hachinohe", "Matsumoto Yamaga", "Zweigen Kanazawa", "Nagano Parceiro",
        "SC Sagamihara", "Thespa Gunma", "Tochigi City", "Tochigi SC"
      ]
    },
    "K3 League": {
      country: "韩国",
      region: "亚洲",
      teams: [
        "Busan Transportation Corporation", "Changwon FC", "Chuncheon FC", "Daejeon Korail",
        "Gangneung Citizen", "Gyeongju KHNP", "Gimhae FC", "Jeonbuk Hyundai Motors N",
        "FC Mokpo", "Paju Citizen", "Pocheon Citizen", "Siheung Citizen",
        "Ulsan Citizen", "Yangpyeong FC", "Yeoju FC"
      ]
    }
  };

  var chineseNames = {
    "Barnsley": "巴恩斯利", "Blackpool": "布莱克浦", "Bradford City": "布拉德福德城",
    "Burton Albion": "伯顿", "Cambridge United": "剑桥联", "Doncaster Rovers": "唐卡斯特",
    "Huddersfield Town": "哈德斯菲尔德", "Leicester City": "莱斯特城", "Luton Town": "卢顿",
    "Mansfield Town": "曼斯菲尔德", "Milton Keynes Dons": "米尔顿凯恩斯",
    "Notts County": "诺茨郡", "Oxford United": "牛津联", "Peterborough United": "彼得堡联",
    "Plymouth Argyle": "普利茅斯", "Reading": "雷丁", "Sheffield Wednesday": "谢周三",
    "Stockport County": "斯托克港", "Stevenage": "斯蒂夫尼奇", "Wigan Athletic": "维冈竞技",
    "Wycombe Wanderers": "韦康比流浪者", "AFC Wimbledon": "AFC温布尔登",
    "Bromley": "布罗姆利", "Leyton Orient": "莱顿东方",
    "Real Murcia": "皇家穆尔西亚", "CD Lugo": "卢戈", "Gimnastic de Tarragona": "塔拉戈纳体操",
    "Hansa Rostock": "汉莎罗斯托克", "Rot-Weiss Essen": "红白埃森",
    "Alemannia Aachen": "亚琛", "MSV Duisburg": "杜伊斯堡",
    "Catania": "卡塔尼亚", "Perugia": "佩鲁贾", "Crotone": "克罗托内",
    "Ternana": "特尔纳纳", "Sochaux": "索肖", "Dijon": "第戎",
    "Valenciennes": "瓦朗谢讷", "Caen": "卡昂",
    "Lanzhou Longyuan Athletic": "兰州陇原竞技", "Shenzhen 2028": "深圳二零二八",
    "Chengdu Rongcheng B": "成都蓉城B队", "Shanghai Port B": "上海海港B队",
    "Shandong Taishan B": "山东泰山B队", "Wuhan Three Towns B": "武汉三镇B队",
    "FC Gifu": "FC岐阜", "Nagano Parceiro": "长野帕塞罗",
    "Gainare Tottori": "鸟取飞翔", "Fukushima United": "福岛联",
    "Gimhae FC": "金海FC", "Gyeongju KHNP": "庆州水利",
    "Siheung Citizen": "始兴市民", "Daejeon Korail": "大田铁路"
  };

  function slug(value) {
    return value.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function shortName(name) {
    var words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
    var initials = words.map(function (word) { return word.charAt(0); }).join("");
    return (initials.length >= 2 ? initials : name.slice(0, 3)).toUpperCase().slice(0, 4);
  }

  window.CLUBS = (window.CLUBS || []).filter(function (club) {
    return club.leagueLevel !== 3;
  });

  Object.keys(leagues).forEach(function (leagueName) {
    var config = leagues[leagueName];
    config.teams.forEach(function (teamName, index) {
      var strength = 52 + (index * 7 + teamName.length) % 9;
      window.CLUBS.push({
        id: slug(leagueName) + "-" + slug(teamName),
        name: teamName,
        nameZh: chineseNames[teamName] || teamName,
        shortName: shortName(teamName),
        country: config.country,
        region: config.region,
        league: leagueName,
        leagueLevel: 3,
        band: strength >= 58 ? "强队" : "练级队",
        strength: strength,
        reputation: Math.max(42, strength - 3),
        salaryLevel: Math.max(27, strength - 20),
        youthChance: Math.max(76, 91 - (strength - 52))
      });
    });
  });
})();
