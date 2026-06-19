// ===== 7大黄金互动工具完整实现 =====
// 所有中文内容均使用字符串包裹

import { storage, tracker } from "../utils/storage.js";
import { dateUtils } from "../utils/date.js";
import { generators } from "../utils/generators.js";

// ===== 1. 经期记录助手 =====
export const menstrualTracker = {
  id: 81,
  name: "经期记录",
  icon: "📅",

  // 计算月经周期
  calculate(data) {
    const { lastDate, cycleLength = 28, periodLength = 5 } = data;
    if (!lastDate) return null;

    const last = new Date(lastDate);
    const cycle = parseInt(cycleLength) || 28;
    const period = parseInt(periodLength) || 5;

    // 下一次经期开始
    const nextPeriod = new Date(last);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);

    // 排卵日（下次经期前14天）
    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14);

    // 安全期计算
    const follicularStart = new Date(last);
    follicularStart.setDate(follicularStart.getDate() + period + 1);

    const lutealEnd = new Date(nextPeriod);
    lutealEnd.setDate(lutealEnd.getDate() - 1);

    // 受孕窗口（排卵日前5天到后1天）
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    return {
      nextPeriod: dateUtils.formatDate(nextPeriod, "YYYY年MM月DD日"),
      ovulation: dateUtils.formatDate(ovulation, "YYYY年MM月DD日"),
      fertileWindow: {
        start: dateUtils.formatDate(fertileStart, "MM月DD日"),
        end: dateUtils.formatDate(fertileEnd, "MM月DD日")
      },
      follicularTips: "卵泡期是护肤的黄金期，建议加强保湿和美白护理。",
      lutealTips: "黄体期皮肤可能敏感，注意防晒和舒缓护理，避免刺激性产品。",
      cycleDays: cycle,
      periodDays: period
    };
  },

  // 保存记录
  save(data) {
    const key = "menstrual_data";
    storage.set(key, Object.assign({}, data, { updatedAt: Date.now() }));
  },

  // 获取记录
  get() {
    return storage.get("menstrual_data", null);
  },

  // 获取历史记录
  getHistory() {
    return tracker.get(81, 30);
  },

  // 添加打卡
  addCheckIn(notes) {
    return tracker.add(81, {
      type: "checkin",
      notes: notes,
      date: dateUtils.getToday()
    });
  }
};

// ===== 2. 塔罗每日抽牌 =====
export const tarotCard = {
  id: 74,
  name: "塔罗抽牌",
  icon: "🃏",

  // 大阿卡那牌数据
  cards: [
    { id: 0, name: "愚者", image: "The Fool", meaning: "新的开始、自由、纯真", advice: "保持开放的心态，勇敢迈出第一步，相信直觉。", element: "风" },
    { id: 1, name: "魔术师", image: "The Magician", meaning: "创造力、技能、意志力", advice: "善用你的才能和资源，将想法转化为现实。", element: "风" },
    { id: 2, name: "女祭司", image: "The High Priestess", meaning: "直觉、神秘、内在声音", advice: "倾听内心的声音，相信自己的直觉。", element: "水" },
    { id: 3, name: "女皇", image: "The Empress", meaning: "丰盛、创造力、母亲", advice: "拥抱生活的美好，享受创造的喜悦。", element: "地" },
    { id: 4, name: "皇帝", image: "The Emperor", meaning: "权威、结构、领导力", advice: "建立秩序和结构，用智慧领导。", element: "火" },
    { id: 5, name: "教皇", image: "The Hierophant", meaning: "传统、精神指导、信仰", advice: "寻求传统的智慧，找到精神归属。", element: "风" },
    { id: 6, name: "恋人", image: "The Lovers", meaning: "爱情、选择、和谐", advice: "跟随心的指引，在关系中找到平衡。", element: "风" },
    { id: 7, name: "战车", image: "The Chariot", meaning: "意志力、胜利、控制", advice: "坚定信念，克服障碍，向目标前进。", element: "水" },
    { id: 8, name: "力量", image: "Strength", meaning: "勇气、耐心、内在力量", advice: "用温柔的力量战胜困难，展现你的韧性。", element: "火" },
    { id: 9, name: "隐士", image: "The Hermit", meaning: "内省、孤独、指引", advice: "给自己一些独处的时间，向内寻找答案。", element: "水" },
    { id: 10, name: "命运之轮", image: "Wheel of Fortune", meaning: "命运、转变、循环", advice: "接受生活的变化，顺其自然，把握机遇。", element: "火" },
    { id: 11, name: "正义", image: "Justice", meaning: "公正、真相、因果", advice: "保持诚实和公正，你的选择会带来相应的结果。", element: "风" },
    { id: 12, name: "倒吊人", image: "The Hanged Man", meaning: "暂停、牺牲、视角转换", advice: "有时候需要放下执念，从不同角度看问题。", element: "水" },
    { id: 13, name: "死神", image: "Death", meaning: "结束、转变、重生", advice: "放下过去，迎接新的开始，转变即成长。", element: "水" },
    { id: 14, name: "节制", image: "Temperance", meaning: "平衡、耐心、中庸", advice: "找到内心的平衡点，温和地调整生活方式。", element: "风" },
    { id: 15, name: "恶魔", image: "The Devil", meaning: "束缚、物质、欲望", advice: "审视自己的执念，摆脱不必要的束缚。", element: "地" },
    { id: 16, name: "塔", image: "The Tower", meaning: "突变、启示、解放", advice: "打破旧有的框架，新的真相将带来解脱。", element: "火" },
    { id: 17, name: "星星", image: "The Star", meaning: "希望、灵感、宁静", advice: "保持希望和信念，光明就在前方。", element: "风" },
    { id: 18, name: "月亮", image: "The Moon", meaning: "幻觉、恐惧、潜意识", advice: "面对内心的恐惧，相信直觉会指引方向。", element: "水" },
    { id: 19, name: "太阳", image: "The Sun", meaning: "快乐、成功、活力", advice: "拥抱阳光，保持乐观，享受生活的喜悦。", element: "火" },
    { id: 20, name: "审判", image: "Judgement", meaning: "觉醒、复兴、宽恕", advice: "原谅自己和他人，迎接灵魂的觉醒。", element: "火" },
    { id: 21, name: "世界", image: "The World", meaning: "完成、成就、整合", advice: "你已完成了一段旅程，为自己的成长庆祝。", element: "地" }
  ],

  // 抽取今日卡牌
  draw() {
    const today = dateUtils.getToday();
    const seed = generators.getDateSeed(today);
    const index = generators.seededRandom(seed) * this.cards.length;
    const cardIndex = Math.floor(index);
    const isReversed = generators.seededRandom(seed + 1) > 0.5;
    const card = this.cards[cardIndex];

    return {
      card: card,
      isReversed: isReversed,
      meaning: isReversed ? "（逆位）" + this.getReversedMeaning(card.name) : card.meaning,
      advice: isReversed ? this.getReversedAdvice(card.name) : card.advice,
      element: card.element,
      date: today,
      position: isReversed ? "逆位" : "正位"
    };
  },

  getReversedMeaning(name) {
    const reversed = {
      "愚者": "鲁莽、犹豫不决",
      "魔术师": "缺乏技巧、计划失败",
      "女祭司": "秘密、隐藏的信息",
      "女皇": "依赖、创作瓶颈",
      "皇帝": "缺乏自律、暴政",
      "教皇": "反对传统、孤独",
      "恋人": "失衡、不和谐",
      "战车": "失控、失去方向",
      "力量": "自我怀疑、软弱",
      "隐士": "孤立、孤独",
      "命运之轮": "坏运、阻碍",
      "正义": "不公正、偏见",
      "倒吊人": "抗拒改变、牺牲无果",
      "死神": "抗拒结束、停滞",
      "节制": "失衡、极端",
      "恶魔": "释放、自由",
      "塔": "延迟、预防",
      "星星": "绝望、失落",
      "月亮": "清晰、克服恐惧",
      "太阳": "阴郁、悲伤",
      "审判": "自责、拒绝觉醒",
      "世界": "未完成、拖延"
    };
    return reversed[name] || "需要更多内省";
  },

  getReversedAdvice(name) {
    const advice = {
      "愚者": "在行动前多思考，避免冲动决定。",
      "魔术师": "检查是否有遗漏的资源和技能。",
      "女祭司": "尝试用更理性的方式看待问题。",
      "力量": "相信自己，你比想象中更强大。"
    };
    return advice[name] || "保持耐心，问题终将明朗。";
  },

  // 获取今日解读
  getDailyReading() {
    const result = this.draw();
    const dayOfWeek = dateUtils.getWeekday();
    
    return {
      ...result,
      dailyMessage: this.getDailyMessage(result),
      luckyColor: this.getLuckyColor(result.card.id),
      luckyNumber: this.getLuckyNumber(result.card.id),
      compatibleSign: this.getCompatibleSign(result.card.id)
    };
  },

  getDailyMessage(result) {
    const messages = {
      0: "今天的你适合尝试新事物，勇敢迈出第一步吧！",
      1: "发挥你的创造力，将想法变成现实。",
      2: "今天适合静心思考，倾听内心的声音。",
      3: "今天运势极佳，享受生活的美好吧！",
      4: "今天需要展现你的领导力，果断决策。",
      5: "今天的你适合学习新知识，寻找指导。",
      6: "今天在感情和人际关系上有好消息。",
      7: "今天适合挑战自我，突破极限。",
      8: "用温柔的力量解决难题，展现你的韧性。",
      9: "今天适合独处，向内寻找答案。",
      10: "今天的你将迎来好运的转折点！",
      11: "保持公正和诚实，正义会站在你这边。",
      12: "有时候暂停一下，会有更好的发现。",
      13: "放下过去，迎接新的开始。",
      14: "今天需要找到内心的平衡点。",
      15: "审视自己的执念，寻求真正的自由。",
      16: "打破旧有的框架，新的可能正在展开。",
      17: "保持希望和信念，光明就在前方。",
      18: "勇敢面对内心的恐惧，你会被指引。",
      19: "今天阳光明媚，享受快乐的时光吧！",
      20: "今天适合反思和总结，迎接新的自己。",
      21: "恭喜你，这是一段旅程的完美完成！"
    };
    return messages[result.card.id] || "今天充满可能，保持开放的心态。";
  },

  getLuckyColor(id) {
    const colors = ["#FFB6C1", "#DDA0DD", "#87CEEB", "#98FB98", "#F0E68C", "#FFA07A", "#B0E0E6", "#D8BFD8", "#FFDAB9", "#E6E6FA", "#F5F5DC", "#FFE4E1"];
    return colors[id % colors.length];
  },

  getLuckyNumber(id) {
    return ((id + 1) * 3) % 49 + 1;
  },

  getCompatibleSign(id) {
    const signs = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];
    return signs[id % 12];
  }
};

// ===== 3. 今日穿什么 =====
export const todayOutfit = {
  id: 22,
  name: "今日穿什么",
  icon: "❓",

  // 穿搭场景数据
  scenarios: {
    work: {
      name: "职场通勤",
      styles: [
        { name: "优雅干练", colors: ["#2C3E50", "#34495E", "#7F8C8D"], items: ["西装外套", "衬衫", "烟管裤", "尖头高跟鞋"] },
        { name: "知性气质", colors: ["#8E44AD", "#9B59B6", "#D7BDE2"], items: ["针织开衫", "半身裙", "裸靴"] },
        { name: "简约高级", colors: ["#1ABC9C", "#16A085", "#A3E4D7"], items: ["西装裤", "真丝衬衫", "乐福鞋"] }
      ]
    },
    date: {
      name: "约会休闲",
      styles: [
        { name: "甜美浪漫", colors: ["#FF69B4", "#FFB6C1", "#FFC0CB"], items: ["碎花裙", "小高跟鞋", "手提包"] },
        { name: "优雅法式", colors: ["#E74C3C", "#C0392B", "#F5B7B1"], items: ["茶歇裙", "草编包", "玛丽珍鞋"] },
        { name: "清新自然", colors: ["#82E0AA", "#ABEBC6", "#D5F5E3"], items: ["连衣裙", "小白鞋", "草帽"] }
      ]
    },
    casual: {
      name: "日常出行",
      styles: [
        { name: "舒适休闲", colors: ["#3498DB", "#2980B9", "#AED6F1"], items: ["T恤", "牛仔裤", "运动鞋"] },
        { name: "文艺清新", colors: ["#F39C12", "#F5B041", "#FCF3CF"], items: ["衬衫裙", "帆布包", "平底鞋"] },
        { name: "街头时尚", colors: ["#2C3E50", "#34495E", "#ECF0F1"], items: ["卫衣", "休闲裤", "老爹鞋"] }
      ]
    },
    party: {
      name: "派对聚会",
      styles: [
        { name: "闪耀全场", colors: ["#FFD700", "#F1C40F", "#FCF3CF"], items: ["亮片裙", "高跟鞋", "手拿包"] },
        { name: "优雅神秘", colors: ["#2C3E50", "#8E44AD", "#BB8FCE"], items: ["小黑裙", "丝绒外套", "精致耳环"] },
        { name: "活力四射", colors: ["#E74C3C", "#FF6B6B", "#FADBD8"], items: ["彩色礼服", "时尚配饰", "亮面高跟鞋"] }
      ]
    }
  },

  // 温度建议
  tempAdvice: {
    cold: { range: "<10°C", tips: "建议叠穿：打底衫+毛衣+大衣，配围巾和保暖靴。", colors: ["#8B4513", "#A0522D", "#DEB887"] },
    cool: { range: "10-18°C", tips: "适合穿针织衫、风衣，配一条丝巾更优雅。", colors: ["#DEB887", "#F5DEB3", "#FAFAD2"] },
    mild: { range: "18-24°C", tips: "轻薄的衬衫或卫衣，搭配牛仔裤刚刚好。", colors: ["#98FB98", "#90EE90", "#ADFF2F"] },
    warm: { range: "24-28°C", tips: "穿舒适的T恤或连衣裙，记得做好防晒！", colors: ["#87CEEB", "#B0E0E6", "#E0FFFF"] },
    hot: { range: ">28°C", tips: "轻薄透气的衣物是首选，建议浅色系更凉爽。", colors: ["#FFFFFF", "#F0FFFF", "#FFFAF0"] }
  },

  // 获取温度区间
  getTempZone(temp) {
    if (temp < 10) return "cold";
    if (temp < 18) return "cool";
    if (temp < 24) return "mild";
    if (temp < 28) return "warm";
    return "hot";
  },

  // 生成今日穿搭
  generate(params) {
    const { scenario = "casual", temp = 22 } = params;
    const scenarioData = this.scenarios[scenario] || this.scenarios.casual;
    const tempZone = this.getTempZone(temp);
    const tempData = this.tempAdvice[tempZone];

    // 根据日期种子随机选择
    const seed = generators.getDateSeed() + scenario.charCodeAt(0);
    const styleIndex = Math.floor(generators.seededRandom(seed) * scenarioData.styles.length);
    const selectedStyle = scenarioData.styles[styleIndex];

    // 合并颜色
    const allColors = [...selectedStyle.colors, ...tempData.colors];
    const uniqueColors = [...new Set(allColors)];

    return {
      scenario: scenarioData.name,
      style: selectedStyle.name,
      colors: uniqueColors.slice(0, 3),
      items: selectedStyle.items,
      tempAdvice: tempData.tips,
      weatherTips: this.getWeatherTips(temp),
      colorHex: uniqueColors[Math.floor(generators.seededRandom(seed + 1) * uniqueColors.length)]
    };
  },

  getWeatherTips(temp) {
    if (temp < 10) return "天气寒冷，记得穿暖和，多喝热水！";
    if (temp < 18) return "早晚温差大，建议带件外套。";
    if (temp < 24) return "天气舒适，适合户外活动。";
    if (temp < 28) return "天气较热，注意防暑降温。";
    return "高温预警，注意防晒和补水！";
  },

  // 颜色推荐
  colorPalettes: [
    { name: "莫兰迪粉", hex: "#E8B4B8" },
    { name: "雾霾蓝", hex: "#8EADC1" },
    { name: "牛油果绿", hex: "#C5D5A5" },
    { name: "奶茶色", hex: "#D4A574" },
    { name: "香芋紫", hex: "#B8A9C9" },
    { name: "焦糖色", hex: "#C68E17" }
  ],

  getRandomPalette() {
    const index = generators.getDailyIndex(this.colorPalettes.length);
    return this.colorPalettes[index];
  }
};

// ===== 4. MBTI极速测试 =====
export const mbtiTest = {
  id: 95,
  name: "MBTI测试",
  icon: "🧠",

  // 8道精选题目
  questions: [
    {
      id: 1,
      question: "社交场合中，你通常是？",
      options: [
        { text: "主动和陌生人搭话", value: "E" },
        { text: "等待别人来认识你", value: "I" }
      ]
    },
    {
      id: 2,
      question: "获取信息时，你更依赖？",
      options: [
        { text: "实际经验和观察", value: "S" },
        { text: "第六感和想象", value: "N" }
      ]
    },
    {
      id: 3,
      question: "做决定时，你更看重？",
      options: [
        { text: "逻辑和客观分析", value: "T" },
        { text: "情感和他人感受", value: "F" }
      ]
    },
    {
      id: 4,
      question: "你的生活态度是？",
      options: [
        { text: "随机应变，灵活安排", value: "P" },
        { text: "提前计划，有条不紊", value: "J" }
      ]
    },
    {
      id: 5,
      question: "周末时光，你更喜欢？",
      options: [
        { text: "和朋友一起出去玩", value: "E" },
        { text: "一个人安静地休息", value: "I" }
      ]
    },
    {
      id: 6,
      question: "面对问题时，你习惯？",
      options: [
        { text: "关注具体细节", value: "S" },
        { text: "思考各种可能性", value: "N" }
      ]
    },
    {
      id: 7,
      question: "在团队中，你扮演的角色是？",
      options: [
        { text: "理性分析者", value: "T" },
        { text: "和谐促进者", value: "F" }
      ]
    },
    {
      id: 8,
      question: "你对"搞钱"的态度是？",
      options: [
        { text: "愿意冒险追求高回报", value: "N" },
        { text: "稳健投资，稳扎稳打", value: "S" }
      ]
    }
  ],

  // MBTI类型数据
  types: {
    "INTJ": { name: "建筑师", traits: ["独立思考", "战略家", "追求完美"], career: ["金融分析师", "管理咨询", "创业"], sideHustle: ["知识付费", "投资理财", "咨询顾问"] },
    "INTP": { name: "逻辑学家", traits: ["理性分析", "创新思维", "求知欲强"], career: ["科研人员", "数据分析师", "IT专家"], sideHustle: ["编程外包", "在线课程", "技术博客"] },
    "ENTJ": { name: "指挥官", traits: ["领导力强", "决策果断", "目标导向"], career: ["企业高管", "律师", "投资人"], sideHustle: ["企业培训", "管理咨询", "项目外包"] },
    "ENTP": { name: "辩论家", traits: ["善于交际", "创新无限", "机智敏捷"], career: ["创业者", "营销策划", "媒体人"], sideHustle: ["自媒体", "营销咨询", "活动策划"] },
    "INFJ": { name: "提倡者", traits: ["理想主义", "洞察力强", "富有同情心"], career: ["心理咨询师", "作家", "教育培训"], sideHustle: ["心理咨询", "内容创作", "个人品牌"] },
    "INFP": { name: "调停者", traits: ["浪漫主义", "创意无限", "价值观驱动"], career: ["设计师", "作家", "社工"], sideHustle: ["艺术创作", "手工艺品", "内容写作"] },
    "ENFJ": { name: "主人公", traits: ["魅力四射", "富有感染力", "天生的领导者"], career: ["管理培训", "人力资源", "市场营销"], sideHustle: ["演讲培训", "个人品牌", "社群运营"] },
    "ENFP": { name: "竞选者", traits: ["热情洋溢", "创意十足", "社交达人"], career: ["创意策划", "公关传媒", "旅游策划"], sideHustle: ["自媒体", "活动策划", "旅游博主"] },
    "ISTJ": { name: "物流师", traits: ["务实可靠", "有责任感", "注重细节"], career: ["会计", "审计", "行政管理"], sideHustle: ["财务代理", "代账服务", "档案管理"] },
    "ISFJ": { name: "守护者", traits: ["温暖体贴", "勤恳务实", "忠诚可靠"], career: ["护理", "行政", "客户服务"], sideHustle: ["家政服务", "手工烘焙", "母婴护理"] },
    "ESTJ": { name: "总经理", traits: ["执行高效", "组织能力强", "注重规则"], career: ["企业管理", "金融", "政府机构"], sideHustle: ["项目管理", "企业培训", "猎头服务"] },
    "ESFJ": { name: "执政官", traits: ["热心助人", "善于交际", "重视和谐"], career: ["教师", "护士", "人力资源"], sideHustle: ["教育培训", "母婴服务", "活动主持"] },
    "ISTP": { name: "鉴赏家", traits: ["动手能力强", "逻辑清晰", "灵活变通"], career: ["工程师", "技术专家", "体育相关"], sideHustle: ["技术维修", "汽车改装", "摄影摄像"] },
    "ISFP": { name: "探险家", traits: ["艺术气质", "随和自由", "审美出众"], career: ["设计师", "摄影师", "手工艺人"], sideHustle: ["手工艺术", "摄影约拍", "插画设计"] },
    "ESTP": { name: "企业家", traits: ["行动力强", "善于谈判", "务实主义"], career: ["销售", "金融", "企业家"], sideHustle: ["电商带货", "代购服务", "资源整合"] },
    "ESFP": { name: "表演者", traits: ["活泼开朗", "魅力十足", "享受当下"], career: ["演艺", "主持", "销售"], sideHustle: ["直播带货", "活动主持", "网红经济"] }
  },

  // 计算MBTI类型
  calculate(answers) {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    answers.forEach(function(answer, index) {
      if (answer) {
        var q = this.questions[index];
        var option = q.options.find(function(o) { return o.value === answer; });
        if (option) counts[option.value]++;
      }
    }.bind(this));

    var type = "";
    type += counts.E >= counts.I ? "E" : "I";
    type += counts.S >= counts.N ? "S" : "N";
    type += counts.T >= counts.F ? "T" : "F";
    type += counts.J >= counts.P ? "J" : "P";

    return this.types[type] ? {
      type: type,
      ...this.types[type]
    } : {
      type: "INFJ",
      name: "提倡者",
      traits: ["理想主义", "洞察力强", "富有同情心"],
      career: ["心理咨询师", "作家", "教育培训"],
      sideHustle: ["心理咨询", "内容创作", "个人品牌"]
    };
  },

  // 保存测试结果
  saveResult(result) {
    storage.set("mbti_result", {
      type: result.type,
      name: result.name,
      savedAt: Date.now()
    });
    return result;
  },

  // 获取历史结果
  getResult() {
    return storage.get("mbti_result", null);
  }
};

// ===== 5. 星座缘分配对 =====
export const zodiacMatch = {
  id: 72,
  name: "星座配对",
  icon: "♊",

  // 十二星座数据
  signs: [
    { id: 1, name: "白羊座", symbol: "♈", element: "火", dates: "3.21-4.19" },
    { id: 2, name: "金牛座", symbol: "♉", element: "地", dates: "4.20-5.20" },
    { id: 3, name: "双子座", symbol: "♊", element: "风", dates: "5.21-6.21" },
    { id: 4, name: "巨蟹座", symbol: "♋", element: "水", dates: "6.22-7.22" },
    { id: 5, name: "狮子座", symbol: "♌", element: "火", dates: "7.23-8.22" },
    { id: 6, name: "处女座", symbol: "♍", element: "地", dates: "8.23-9.22" },
    { id: 7, name: "天秤座", symbol: "♎", element: "风", dates: "9.23-10.23" },
    { id: 8, name: "天蝎座", symbol: "♏", element: "水", dates: "10.24-11.22" },
    { id: 9, name: "射手座", symbol: "♐", element: "火", dates: "11.23-12.21" },
    { id: 10, name: "摩羯座", symbol: "♑", element: "地", dates: "12.22-1.19" },
    { id: 11, name: "水瓶座", symbol: "♒", element: "风", dates: "1.20-2.18" },
    { id: 12, name: "双鱼座", symbol: "♓", element: "水", dates: "2.19-3.20" }
  ],

  // 144种组合匹配度（简化版算法）
  compatibility: {
    "1-1": { score: 65, desc: "两个火象星座，热情但容易冲突。" }, // 白羊-白羊
    "1-2": { score: 75, desc: "金牛的稳定能平衡白羊的冲动。" },
    "1-3": { score: 90, desc: "风火相生，创意无限，玩不腻的组合！" },
    "1-4": { score: 70, desc: "白羊的主动与巨蟹的温柔互补。" },
    "1-5": { score: 85, desc: "两个王者的碰撞，需要互相尊重。" },
    "1-6": { score: 60, desc: "白羊的粗心需要处女来弥补。" },
    "1-7": { score: 80, desc: "社交高手组合，人缘超好！" },
    "1-8": { score: 75, desc: "火星入旺，与天蝎有强烈化学反应。" },
    "1-9": { score: 95, desc: "火象三杰之一，一起冒险超开心！" },
    "1-10": { score: 55, desc: "白羊的冲动可能让摩羯看不惯。" },
    "1-11": { score: 78, desc: "创意组合，但需要时间磨合。" },
    "1-12": { score: 72, desc: "浪漫组合，小心陷入感情漩涡。" },
    "2-2": { score: 85, desc: "两个金牛，踏实稳重，默契十足。" },
    "2-3": { score: 70, desc: "变动星座与固定星座，需要互相适应。" },
    "2-4": { score: 90, desc: "都是务实派，共同打造温馨家园。" },
    "2-5": { score: 75, desc: "狮子欣赏金牛的品味，金牛欣赏狮子的自信。" },
    "2-6": { score: 88, desc: "土象组合，价值观相似，非常合拍！" },
    "2-7": { score: 72, desc: "天秤的社交可能让金牛有点不安。" },
    "2-8": { score: 80, desc: "隐秘的吸引力，情感深刻。" },
    "2-9": { score: 55, desc: "一个爱玩一个爱稳定，需要妥协。" },
    "2-10": { score: 95, desc: "土象同盟，踏实可靠，共同奋斗！" },
    "2-11": { score: 65, desc: "金牛的传统与水瓶的创新有冲突。" },
    "2-12": { score: 78, desc: "双鱼的理解力让金牛感到被爱。" },
    "3-3": { score: 80, desc: "两个话痨，永远不无聊！" },
    "3-4": { score: 75, desc: "双子需要学会理解巨蟹的敏感。" },
    "3-5": { score: 82, desc: "都是爱玩的星座，社交圈广泛。" },
    "3-6": { score: 72, desc: "双子的善变与处女的挑剔有摩擦。" },
    "3-7": { score: 95, desc: "双子和天秤，风象双杰，超级合拍！" },
    "3-8": { score: 70, desc: "天蝎的神秘感吸引双子。" },
    "3-9": { score: 85, desc: "射手和双子，射手和双子，旅行和冒险的好伙伴！" },
    "3-10": { score: 65, desc: "变动星座需要摩羯给予方向感。" },
    "3-11": { score: 88, desc: "都是思想活跃的星座，理念契合。" },
    "3-12": { score: 78, desc: "双子的理性与双鱼的感性互补。" },
    "4-4": { score: 90, desc: "两个最恋家的星座，情感深厚。" },
    "4-5": { score: 78, desc: "狮子的光芒照亮巨蟹的内心。" },
    "4-6": { score: 85, desc: "都是阴性星座，注重细节和情感。" },
    "4-7": { score: 72, desc: "天秤欣赏巨蟹的温柔，巨蟹需要安全感。" },
    "4-8": { score: 92, desc: "水象组合，情感共鸣极强，命中注定！" },
    "4-9": { score: 65, desc: "射手爱自由，巨蟹需要归属感。" },
    "4-10": { score: 80, desc: "都重视家庭，价值观一致。" },
    "4-11": { score: 70, desc: "需要理解和尊重彼此的差异。" },
    "4-12": { score: 95, desc: "水象双鱼，都是感性和浪漫的。" },
    "5-5": { score: 85, desc: "两个狮子，互相欣赏但需要学会谦让。" },
    "5-6": { score: 70, desc: "狮子需要处女的细心，处女需要狮子的阳光。" },
    "5-7": { score: 88, desc: "都是社交达人，走到哪都是焦点。" },
    "5-8": { score: 72, desc: "狮子与天蝎，强势对决又互相吸引。" },
    "5-9": { score: 90, desc: "火象三杰，热情开朗，共同冒险！" },
    "5-10": { score: 75, desc: "狮子欣赏摩羯的成就，摩羯欣赏狮子的魅力。" },
    "5-11": { score: 80, desc: "创意组合，一起创造精彩！" },
    "5-12": { score: 78, desc: "狮子保护双鱼，双鱼崇拜狮子。" },
    "6-6": { score: 95, desc: "两个处女，完美主义的结合，默契十足！" },
    "6-7": { score: 75, desc: "天秤的优雅与处女的实用互补。" },
    "6-8": { score: 80, desc: "都很细腻，互相理解对方的需求。" },
    "6-9": { score: 60, desc: "一个爱整洁一个爱自由，需要磨合。" },
    "6-10": { score: 92, desc: "土象同盟，务实稳重，共同奋斗！" },
    "6-11": { score: 72, desc: "创新的水瓶可能让处女觉得不切实际。" },
    "6-12": { score: 85, desc: "双鱼的理解力让处女感到被包容。" },
    "7-7": { score: 90, desc: "两个天秤，审美一致，品味相投！" },
    "7-8": { score: 78, desc: "天秤与天蝎，吸引与挑战并存。" },
    "7-9": { score: 85, desc: "都是爱玩的星座，社交生活丰富。" },
    "7-10": { score: 82, desc: "风与土的结合，需要互相学习。" },
    "7-11": { score: 95, desc: "风象组合，理念一致，默契满分！" },
    "7-12": { score: 88, desc: "天秤与双鱼，浪漫满分，情感丰富。" },
    "8-8": { score: 90, desc: "两个天蝎，深沉而专一的爱情。" },
    "8-9": { score: 70, desc: "射手可能让天蝎感到不安全感。" },
    "8-10": { score: 85, desc: "都很有毅力，共同目标导向。" },
    "8-11": { score: 75, desc: "水瓶的理性可能让天蝎觉得冷漠。" },
    "8-12": { score: 95, desc: "水象双鱼，灵魂伴侣的组合！" },
    "9-9": { score: 90, desc: "两个射手，冒险精神和乐观主义。" },
    "9-10": { score: 75, desc: "射手需要自由，摩羯需要稳定。" },
    "9-11": { score: 85, desc: "都是思想自由的星座，理念相通。" },
    "9-12": { score: 80, desc: "射手与双鱼，一个现实一个梦幻。" },
    "10-10": { score: 95, desc: "两个摩羯，野心勃勃，共同成就事业！" },
    "10-11": { score: 70, desc: "传统的摩羯与创新的水瓶有代沟。" },
    "10-12": { score: 75, desc: "务实的摩羯能理解双鱼的梦想。" },
    "11-11": { score: 92, desc: "两个水瓶，创新的思想家组合！" },
    "11-12": { score: 82, desc: "风与水的结合，理性与感性并存。" },
    "12-12": { score: 90, desc: "两个双鱼，梦幻般的爱情故事。" }
  },

  // 获取星座ID
  getSignId(signName) {
    const sign = this.signs.find(function(s) { return s.name === signName; });
    return sign ? sign.id : 1;
  },

  // 计算匹配度
  calculate(sign1, sign2) {
    const id1 = this.getSignId(sign1);
    const id2 = this.getSignId(sign2);
    const key = Math.min(id1, id2) + "-" + Math.max(id1, id2);
    
    const compat = this.compatibility[key] || { score: 70, desc: "缘分天注定，相爱就是最好的答案。" };
    const stars = Math.ceil(compat.score / 20);

    return {
      score: compat.score,
      stars: stars,
      desc: compat.desc,
      sign1: this.signs.find(function(s) { return s.name === sign1; }),
      sign2: this.signs.find(function(s) { return s.name === sign2; }),
      advice: this.getAdvice(compat.score, sign1, sign2)
    };
  },

  getAdvice(score, sign1, sign2) {
    if (score >= 90) return "你们是天作之合！珍惜这份缘分，相互扶持，共同成长。";
    if (score >= 80) return "非常般配的一对！多沟通多理解，爱情会更甜蜜。";
    if (score >= 70) return "缘分不错，需要用心经营。保持新鲜感，多制造浪漫回忆。";
    if (score >= 60) return "有些差异是正常的。学会欣赏对方的不同，爱情需要包容。";
    return "虽然有挑战，但真爱无敌！用真心和智慧去经营，一定能修成正果。";
  },

  // 根据日期获取星座
  getSignByDate(month, day) {
    const dates = [[3, 21, 1], [4, 20, 2], [5, 21, 3], [6, 22, 4], [7, 23, 5], [8, 23, 6], 
                   [9, 23, 7], [10, 24, 8], [11, 23, 9], [12, 22, 10], [1, 20, 11], [2, 19, 12]];
    for (var i = 0; i < dates.length; i++) {
      if (month === dates[i][0] && day >= dates[i][1]) return dates[i][2];
      if (month === dates[i][0] - 1 || (month === 12 && dates[i][0] === 1)) {
        if (month === 12 && day >= 22) return 10;
        if (month === 1 && day <= 19) return 10;
      }
    }
    // Default fallback
    var signIndex = month - 1;
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) signIndex = 0;
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) signIndex = 1;
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) signIndex = 2;
    else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) signIndex = 3;
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) signIndex = 4;
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) signIndex = 5;
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) signIndex = 6;
    else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) signIndex = 7;
    else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) signIndex = 8;
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) signIndex = 9;
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) signIndex = 10;
    else signIndex = 11;
    return this.signs[signIndex].name;
  }
};

// ===== 6. 富婆指数趣味测试 =====
export const richLadyTest = {
  id: 96,
  name: "富婆指数测试",
  icon: "💰",

  // 5道趣味题目
  questions: [
    {
      id: 1,
      question: "中了100万彩票，你第一反应是？",
      options: [
        { text: "辞职！开始创业当老板", value: 10 },
        { text: "买房投资，稳健理财", value: 8 },
        { text: "存起来，继续上班", value: 5 },
        { text: "先旅行花掉再说", value: 2 }
      ]
    },
    {
      id: 2,
      question: "你的消费习惯是？",
      options: [
        { text: "只买贵的，品质第一", value: 3 },
        { text: "该省省该花花，理性消费", value: 10 },
        { text: "便宜货凑合用", value: 5 },
        { text: "月光族，从不存钱", value: 1 }
      ]
    },
    {
      id: 3,
      question: "听说一个投资机会，回报率50%，你会？",
      options: [
        { text: "谨慎考察后再决定", value: 10 },
        { text: "小额试试水", value: 6 },
        { text: "全投梭哈！", value: 3 },
        { text: "太假了，不相信", value: 8 }
      ]
    },
    {
      id: 4,
      question: "副业赚钱你会选择？",
      options: [
        { text: "开网店/直播带货", value: 10 },
        { text: "做自媒体/写文章", value: 8 },
        { text: "兼职打工", value: 5 },
        { text: "靠彩票做梦", value: 2 }
      ]
    },
    {
      id: 5,
      question: "你认为财富最重要的是？",
      options: [
        { text: "持续学习和赚钱能力", value: 10 },
        { text: "人脉和资源整合", value: 8 },
        { text: "运气和时机", value: 5 },
        { text: "省钱和存钱", value: 6 }
      ]
    }
  ],

  // 富婆类型
  types: [
    {
      range: [40, 50],
      title: "搞钱大女主",
      avatar: "👑",
      desc: "你有着敏锐的商业嗅觉和超强的执行力！不仅是省钱高手，更是赚钱天才。未来的你一定能实现财富自由！",
      tips: ["继续保持你的理财习惯", "可以考虑投资自己", "拓展高质量人脉圈"]
    },
    {
      range: [30, 39],
      title: "精致小富婆",
      avatar: "💎",
      desc: "你懂得享受生活，也知道如何理财。虽然没有大富大贵，但小日子过得精致又惬意，是真正的人生赢家！",
      tips: ["增加被动收入来源", "学习更多投资知识", "建立自己的品牌"]
    },
    {
      range: [20, 29],
      title: "潜力小财女",
      avatar: "🌟",
      desc: "你有着不错的理财观念，只是还需要一些实战经验。别急，财富需要慢慢积累，你的潜力无限！",
      tips: ["培养储蓄习惯", "从小额投资开始", "多学习财务知识"]
    },
    {
      range: [0, 19],
      title: "佛系小白",
      avatar: "🌸",
      desc: "你对金钱比较佛系，觉得够花就好。其实你只是还没找到赚钱的动力和目标！从现在开始学习理财也不晚~",
      tips: ["先从记账开始", "设定存钱目标", "培养赚钱思维"]
    }
  ],

  // 计算结果
  calculate(answers) {
    var total = 0;
    answers.forEach(function(score) {
      if (typeof score === "number") total += score;
    });

    var result = this.types.find(function(t) {
      return total >= t.range[0] && total <= t.range[1];
    }) || this.types[3];

    return {
      score: total,
      ...result,
      percent: Math.min(Math.round(total / 50 * 100), 100)
    };
  },

  // 获取创富计划
  getPlan(result) {
    const plans = {
      "搞钱大女主": [
        { step: "1", action: "配置全球资产组合", detail: "股票+债券+房产+黄金分散投资" },
        { step: "2", action: "创立个人品牌", detail: "利用影响力打造被动收入" },
        { step: "3", action: "投资区块链和新兴领域", detail: "适度配置高风险高回报项目" }
      ],
      "精致小富婆": [
        { step: "1", action: "建立应急基金", detail: "存够3-6个月生活费" },
        { step: "2", action: "开启副业收入", detail: "发展一项能持续变现的技能" },
        { step: "3", action: "学习基金投资", detail: "定投指数基金获取稳定收益" }
      ],
      "潜力小财女": [
        { step: "1", action: "学会记账和预算", detail: "清楚每一分钱的花向" },
        { step: "2", action: "每月强制储蓄20%", detail: "先存后花，积少成多" },
        { step: "3", action: "培养一项硬技能", detail: "写作、设计、编程都可以" }
      ],
      "佛系小白": [
        { step: "1", action: "下载记账软件", detail: "坚持记录一个月收支" },
        { step: "2", action: "设定一个小目标", detail: "比如存下第一个1万块" },
        { step: "3", action: "减少不必要的消费", detail: "少喝奶茶，多自己做饭" }
      ]
    };
    return plans[result.title] || plans["佛系小白"];
  }
};

// ===== 7. 蜜语情书生成器 =====
export const loveLetterGenerator = {
  id: 63,
  name: "情书生成器",
  icon: "💌",

  // 称呼模板
  addresses: ["亲爱的", "宝贝", "心肝", "小可爱", "我的唯一", "最爱的人", "梦中人", "我的最爱", "猪猪", "傻瓜"],

  // 开场白模板
  openings: [
    "当我提笔写下这封信时，窗外的月光正好洒在我的桌上，就像你的温柔照进我的心房。",
    "今天是我们相识的第{day}天，我想把这份心意写成文字，永远珍藏。",
    "在这个信息爆炸的时代，我选择用最传统的方式告诉你：我爱你。",
    "闭上眼睛，脑海里全是你的笑容。我想，是时候让你知道这份感情了。",
    "亲爱的，你可能不知道，每次看到你的消息，我的心跳都会漏掉一拍。"
  ],

  // 回忆片段
  memories: [
    "记得我们第一次约会，你穿着那条白色的裙子，美得让我移不开眼。",
    "那天你说的话，我一直记在心里，成为我每天起床的动力。",
    "你笑起来的样子，是我见过最美的风景。",
    "你总是那么体贴，在我最累的时候给我一个拥抱，真的很暖。",
    "我永远忘不了你认真工作时的样子，那份专注让我着迷。"
  ],

  // 情感表达
  expressions: [
    "我爱你，不是因为你是谁，而是因为和你在一起时，我是谁。",
    "遇见你是我这辈子最幸运的事，余生请多指教。",
    "我愿意陪你走过每一个春夏秋冬，不管贫穷还是富有。",
    "你是我心中最美的诗，每一行都写满了爱意。",
    "我想和你一起慢慢变老，看遍世间所有的风景。"
  ],

  // 结尾模板
  endings: [
    "永远爱你的人",
    "想你的人",
    "属于你的人",
    "爱你的傻瓜",
    "此生唯一"
  ],

  // 语气类型
  tones: {
    sweet: { name: "甜蜜型", prefix: "💕 ", style: "甜言蜜语，情感炽热" },
    elegant: { name: "文艺型", prefix: "📜 ", style: "文采飞扬，诗意盎然" },
    playful: { name: "俏皮型", prefix: "😜 ", style: "活泼可爱，俏皮灵动" },
    passionate: { name: "深情型", prefix: "❤️ ", style: "情深意切，感人肺腑" }
  },

  // 生成情书
  generate(params) {
    const { 
      tone = "sweet", 
      hisName = "TA", 
      herName = "我",
      memory = "",
      length = "medium"
    } = params;

    const seed = generators.getDateSeed() + tone.charCodeAt(0);
    
    // 随机选择模板
    const address = generators.pickDaily(this.addresses, dateUtils.getToday());
    const openingIndex = Math.floor(generators.seededRandom(seed) * this.openings.length);
    const opening = this.openings[openingIndex].replace("{day}", String(Math.floor(Math.random() * 365) + 1));
    
    const memoryText = memory || this.memories[Math.floor(generators.seededRandom(seed + 1) * this.memories.length)];
    const expression = this.expressions[Math.floor(generators.seededRandom(seed + 2) * this.expressions.length)];
    const ending = this.endings[Math.floor(generators.seededRandom(seed + 3) * this.endings.length)];

    const toneData = this.tones[tone] || this.tones.sweet;

    let letter = "";
    letter += toneData.prefix + hisName + "：\n\n";
    letter += "    " + opening + "\n\n";
    letter += "    " + memoryText + "\n\n";
    
    if (length === "long") {
      letter += "    还有太多太多想说的话，太多太多想和你一起做的事。\n";
      letter += "    " + expression + "\n";
      letter += "    我愿意用我的一生来证明这句话的分量。\n\n";
    } else {
      letter += "    " + expression + "\n\n";
    }
    
    letter += "    " + herName + "，遇见你真好。\n\n";
    letter += "        " + ending + "，" + herName + "\n";
    letter += "        " + dateUtils.formatDate(new Date(), "YYYY年MM月DD日");

    return {
      letter: letter,
      tone: toneData.name,
      style: toneData.style,
      preview: letter.substring(0, 50) + "..."
    };
  },

  // 获取随机语气
  getRandomTone() {
    const tones = Object.keys(this.tones);
    const index = generators.getDailyIndex(tones.length);
    return tones[index];
  }
};

// ===== 导出所有工具 =====
export default {
  menstrualTracker,
  tarotCard,
  todayOutfit,
  mbtiTest,
  zodiacMatch,
  richLadyTest,
  loveLetterGenerator
};
