window.EVENTS = [
  {
    id: "coach-role-shift",
    title: "主教练想重新定义你的角色",
    text: "教练组认为你的技术和视野足够出色，想让你在未来一个赛季尝试更靠中的区域。",
    maxAge: 27,
    options: [
      { label: "接受位置调整", description: "成长更全面，但需要适应。", effects: { overall: 2, coachRelation: 10, reputation: 4, fitness: -3, happiness: -2 } },
      { label: "坚持原位置", description: "维持熟悉的踢法。", effects: { overall: 0, coachRelation: -6, reputation: 0, happiness: 2 } },
      { label: "要求转会", description: "可能更快离开，但会伤害更衣室关系。", effects: { overall: -1, coachRelation: -14, reputation: -2, transferInterest: 15, happiness: -4 } }
    ]
  },
  {
    id: "extra-training",
    title: "休赛期额外训练计划",
    text: "体能教练给你安排了激进的个人强化课程，成功的话能力会明显提升。",
    options: [
      { label: "全力投入", description: "冒着疲劳风险冲成长。", effects: { overall: 3, fitness: -8, reputation: 2 } },
      { label: "适度训练", description: "稳健成长。", effects: { overall: 1, fitness: -2, happiness: 1 } },
      { label: "优先休息", description: "状态更轻松，但进步有限。", effects: { overall: 0, fitness: 6, happiness: 4 } }
    ]
  },
  {
    id: "captain-trust",
    title: "更衣室开始信任你",
    text: "老队长公开称赞了你的职业态度，球队内部有人认为你已经具备领袖气质。",
    maxAge: 27,
    options: [
      { label: "主动承担责任", description: "提升声望，也会加重压力。", effects: { reputation: 8, coachRelation: 6, happiness: -1 } },
      { label: "低调继续踢", description: "稳定推进。", effects: { reputation: 3, happiness: 2 } },
      { label: "把注意力放在数据", description: "追求个人表现。", effects: { overall: 1, reputation: 2, coachRelation: -2 } }
    ]
  },
  {
    id: "minor-injury",
    title: "训练中出现伤情",
    text: "你在冲刺训练中拉伤了肌肉，队医建议谨慎安排未来阶段的负荷。",
    options: [
      { label: "保守恢复", description: "减少风险，影响出场。", effects: { fitness: -10, overall: -1, happiness: -2 } },
      { label: "咬牙坚持", description: "可能拖慢恢复，但能争主力。", effects: { fitness: -16, reputation: 3, overall: 1 } },
      { label: "申请轮休", description: "教练不一定满意。", effects: { fitness: -6, coachRelation: -5, happiness: 2 } }
    ]
  },
  {
    id: "mentor",
    title: "老将愿意带你",
    text: "队里经验最丰富的老将愿意在训练后单独辅导你，提高阅读比赛的能力。",
    options: [
      { label: "每天留下加练", description: "成长和关系都不错。", effects: { overall: 2, coachRelation: 4, reputation: 2, fitness: -3 } },
      { label: "偶尔请教", description: "收获有限但稳妥。", effects: { overall: 1, happiness: 1 } },
      { label: "专注个人节奏", description: "减少消耗。", effects: { fitness: 3, coachRelation: -2 } }
    ]
  },
  {
    id: "veteran-leader",
    title: "你开始带年轻人了",
    text: "随着资历增长，教练组希望你在训练和更衣室里多带一带年轻球员。",
    options: [
      { label: "主动传帮带", description: "威望可能上升，但会分走一些精力。", effects: { reputation: 6, coachRelation: 6, happiness: 1, fitness: -2 } },
      { label: "只在场上示范", description: "保持平衡。", effects: { reputation: 2, coachRelation: 2 } },
      { label: "专注自己状态", description: "减少额外消耗，但会被认为不够担当。", effects: { fitness: 2, coachRelation: -4, reputation: -1 } }
    ]
  },
  {
    id: "media-hype",
    title: "媒体开始炒作你的未来",
    text: "多家媒体把你列入潜力榜，外界热度上升，但也让每场比赛的关注度更高。",
    maxAge: 25,
    options: [
      { label: "高调回应", description: "声望飙升，也更容易被盯上。", effects: { reputation: 10, happiness: 1, coachRelation: -2 } },
      { label: "保持冷静", description: "职业形象稳定。", effects: { reputation: 5, coachRelation: 2 } },
      { label: "拒绝采访", description: "减少干扰。", effects: { fitness: 2, reputation: -1, happiness: 1 } }
    ]
  },
  {
    id: "tactical-fit",
    title: "球队战术升级",
    text: "新体系非常依赖无球跑动和高强度回追，你的适应能力会直接影响出场顺位。",
    options: [
      { label: "主动适配新战术", description: "有望抢到首发。", effects: { overall: 2, coachRelation: 8, fitness: -5 } },
      { label: "慢慢适应", description: "表现中规中矩。", effects: { overall: 0, happiness: 1 } },
      { label: "公开表达不满", description: "保留个性，但代价明显。", effects: { coachRelation: -12, happiness: -3, transferInterest: 10 } }
    ]
  },
  {
    id: "commercial",
    title: "品牌合作找上门",
    text: "一家运动品牌想签你做地区代言人，商业价值会提升，但赛外事务也会变多。",
    options: [
      { label: "接受合作", description: "身价和声望上涨。", effects: { reputation: 7, value: 80000, happiness: 2 } },
      { label: "只签短约", description: "平衡商业和比赛。", effects: { reputation: 3, value: 30000 } },
      { label: "专注足球", description: "不分心。", effects: { fitness: 3, coachRelation: 2 } }
    ]
  },
  {
    id: "big-match",
    title: "你被安排首发踢关键大战",
    text: "这是一次证明自己的好机会，踢得好可能直接改写你在球队的定位。",
    options: [
      { label: "全力争胜", description: "高风险高回报。", effects: { overall: 2, reputation: 6, fitness: -4 } },
      { label: "稳健执行战术", description: "适合保底表现。", effects: { coachRelation: 5, reputation: 2 } },
      { label: "请求替补待命", description: "避免压力但错失舞台。", effects: { happiness: -2, reputation: -4, fitness: 2 } }
    ]
  },
  {
    id: "locker-conflict",
    title: "更衣室出现矛盾",
    text: "两位队友训练中起了冲突，教练希望你站出来协调局面。",
    options: [
      { label: "出面调解", description: "声望提升。", effects: { reputation: 6, coachRelation: 5, happiness: -1 } },
      { label: "保持中立", description: "避免卷入。", effects: { happiness: 1 } },
      { label: "站队好友", description: "短期舒服，长期有隐患。", effects: { happiness: 2, coachRelation: -6, reputation: -2 } }
    ]
  },
  {
    id: "starting-competition",
    title: "主力位置迎来直接竞争",
    text: "俱乐部在你的同一位置引进了新球员，教练明确表示首发要由训练和比赛表现决定。",
    options: [
      { label: "正面竞争", description: "用表现争取位置。", effects: { overall: 1, coachRelation: 4, fitness: -5, happiness: -1 } },
      { label: "接受轮换", description: "保持状态，等待机会。", effects: { fitness: 2, coachRelation: 2, reputation: -1 } },
      { label: "寻求离队", description: "提前寻找稳定出场环境。", effects: { transferInterest: 12, coachRelation: -5, happiness: 2 } }
    ]
  },
  {
    id: "fixture-congestion",
    title: "密集赛程考验身体状态",
    text: "联赛、杯赛和国家队比赛连续到来，医疗组提醒你必须管理比赛负荷。",
    options: [
      { label: "坚持全部出战", description: "保证出场，但伤病风险更高。", effects: { reputation: 3, fitness: -10, coachRelation: 3 } },
      { label: "主动轮休", description: "保护身体状态。", effects: { fitness: 5, reputation: -1, coachRelation: 1 } },
      { label: "减少训练负荷", description: "在比赛和恢复间折中。", effects: { fitness: 1, overall: -1, happiness: 1 } }
    ]
  },
  {
    id: "contract-role",
    title: "新合同中的球队定位",
    text: "俱乐部愿意讨论待遇，但希望先明确你接下来是核心、轮换还是经验型球员。",
    minAge: 22,
    options: [
      { label: "要求核心地位", description: "回报更高，失败代价也更大。", effects: { reputation: 4, coachRelation: -3, happiness: 2 } },
      { label: "接受竞争上岗", description: "保留空间，用表现说话。", effects: { coachRelation: 4, happiness: 1 } },
      { label: "暂缓续约谈判", description: "观察市场上的其他机会。", effects: { transferInterest: 9, coachRelation: -2 } }
    ]
  },
  {
    id: "form-slump",
    title: "连续低迷引发外界质疑",
    text: "几场比赛的处理都不够理想，媒体开始讨论你是否应该失去首发位置。",
    options: [
      { label: "增加针对性训练", description: "争取尽快找回节奏。", effects: { overall: 1, fitness: -6, coachRelation: 3 } },
      { label: "减少冒险处理", description: "先恢复比赛稳定性。", effects: { reputation: -1, coachRelation: 2, happiness: 1 } },
      { label: "坚持原有踢法", description: "相信状态会自然回来。", effects: { happiness: 2, coachRelation: -3, reputation: -2 } }
    ]
  },
  {
    id: "national-team-call",
    title: "国家队征召打乱俱乐部节奏",
    text: "长途旅行和国家队比赛压缩了恢复时间，俱乐部希望你谨慎分配精力。",
    options: [
      { label: "国家队全力以赴", description: "争取国际赛场地位。", effects: { reputation: 4, fitness: -8, coachRelation: -2 } },
      { label: "控制比赛负荷", description: "兼顾俱乐部和国家队。", effects: { fitness: -2, reputation: 1, coachRelation: 2 } },
      { label: "申请暂不征召", description: "优先保障俱乐部状态。", effects: { fitness: 5, reputation: -3, coachRelation: 3 } }
    ]
  },
  {
    id: "veteran-body-management",
    title: "身体管理成为赛季重点",
    text: "恢复速度已不如年轻时期，团队建议重新安排训练、出场和休息节奏。",
    minAge: 28,
    options: [
      { label: "科学轮换", description: "减少消耗，延长稳定期。", effects: { fitness: 6, coachRelation: 3, reputation: -1 } },
      { label: "关键比赛优先", description: "把状态留给重要舞台。", effects: { fitness: 1, reputation: 3, happiness: 1 } },
      { label: "维持全部负荷", description: "不接受角色下降。", effects: { reputation: 2, fitness: -10, coachRelation: -2 } }
    ]
  }
];
