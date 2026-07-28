(function () {
  window.INJURY_TYPES = [
    { id: "minor_knock", name: "轻微碰撞", severity: "minor", minWeeks: 1, maxWeeks: 2, weight: 22, recurrenceRisk: 0.02, fitnessPenalty: 5, attributes: [] },
    { id: "muscle_strain", name: "肌肉拉伤", severity: "minor", minWeeks: 1, maxWeeks: 4, weight: 24, recurrenceRisk: 0.08, fitnessPenalty: 10, attributes: ["pace"] },
    { id: "ankle_sprain", name: "脚踝扭伤", severity: "moderate", minWeeks: 3, maxWeeks: 7, weight: 17, recurrenceRisk: 0.11, fitnessPenalty: 16, attributes: ["pace", "dribbling"] },
    { id: "hamstring", name: "腿筋受伤", severity: "moderate", minWeeks: 4, maxWeeks: 9, weight: 16, recurrenceRisk: 0.17, fitnessPenalty: 20, attributes: ["pace", "workRate"] },
    { id: "shoulder", name: "肩部损伤", severity: "moderate", minWeeks: 4, maxWeeks: 10, weight: 8, recurrenceRisk: 0.1, fitnessPenalty: 17, attributes: ["strength", "reflexes"] },
    { id: "knee", name: "膝关节损伤", severity: "serious", minWeeks: 10, maxWeeks: 22, weight: 8, recurrenceRisk: 0.22, fitnessPenalty: 28, attributes: ["pace", "strength"] },
    { id: "fracture", name: "骨折", severity: "serious", minWeeks: 12, maxWeeks: 28, weight: 4, recurrenceRisk: 0.12, fitnessPenalty: 34, attributes: ["strength"] },
    { id: "acl", name: "前十字韧带撕裂", severity: "major", minWeeks: 30, maxWeeks: 48, weight: 1.7, recurrenceRisk: 0.28, fitnessPenalty: 44, attributes: ["pace", "strength"] },
    { id: "achilles", name: "跟腱断裂", severity: "major", minWeeks: 38, maxWeeks: 58, weight: 0.8, recurrenceRisk: 0.25, fitnessPenalty: 48, attributes: ["pace", "workRate"] }
  ];

  window.INJURY_ARCHETYPE_MULTIPLIERS = {
    ironman: 0.65,
    resilient: 0.82,
    normal: 1,
    fragile: 1.22,
    chronic: 1.42
  };
})();
