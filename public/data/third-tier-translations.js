(function () {
  var names = {
    "Bilbao Athletic": "毕尔巴鄂竞技俱乐部",
    "Chateauroux": "沙托鲁足球俱乐部",
    "Jeonbuk Hyundai Motors N": "全北現代汽車足球俱樂部",
    "Kunming City": "昆明市",
    "Racing de Ferrol": "費羅爾競賽會",
    "Ravenna": "拉韦纳",
    "Trento": "特伦托",
    "Vicenza": "维琴察足球俱乐部"
  };
  (window.CLUBS || []).forEach(function (club) {
    if (club.leagueLevel === 3 && names[club.name]) club.nameZh = names[club.name];
  });
})();
