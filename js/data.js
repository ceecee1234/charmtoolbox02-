// ===== 魅力工具箱 - 工具数据 =====
const TOOLS_DATA = {
  categories: [
    {
      id: 'beauty',
      name: '美容护肤',
      icon: '💄',
      tools: [
        { id: 1, name: '皮肤年龄测试', icon: '🔬', desc: '上传照片分析皮肤年龄', hot: false, features: ['AI人脸识别', '年龄分析报告', '对比功能', '改善建议'] },
        { id: 2, name: '肤质检测', icon: '🧪', desc: '干性油性混合智能检测', hot: true, features: ['AI肤质分析', '油分/水分检测', '专属护理方案', '产品推荐'] },
        { id: 3, name: '痘痘分析', icon: '🔍', desc: 'AI识别痘痘类型', hot: false, features: ['痘痘类型识别', '严重程度评估', '护理建议', '产品推荐'] },
        { id: 4, name: '毛孔检测', icon: '🔎', desc: 'AI识别毛孔状况', hot: false, features: ['毛孔大小评估', '黑头检测', '改善方案', '每周对比'] },
        { id: 5, name: '黑眼圈检测', icon: '👁️', desc: 'AI分析黑眼圈类型', hot: true, features: ['类型判断', '原因分析', '改善方法', '遮瑕推荐'] },
        { id: 6, name: '法令纹分析', icon: '〰️', desc: 'AI检测法令纹深度', hot: false, features: ['深度评估', '老化程度', '护理建议', '医美参考'] },
        { id: 7, name: '护肤品成分查询', icon: '📋', desc: '成分党必备', hot: true, features: ['成分解析', '安全评级', '功效说明', '替代推荐'] },
        { id: 8, name: '美白周期计算器', icon: '📅', desc: '记录肤色变化', hot: false, features: ['肤色记录', '周期追踪', '进度图表', '产品提醒'] },
        { id: 9, name: '防晒指数推荐', icon: '☀️', desc: '根据场景推荐SPF', hot: false, features: ['场景分析', 'SPF推荐', 'PA等级', '涂抹提醒'] },
        { id: 10, name: '补水提醒', icon: '💧', desc: '定时提醒喝水护肤', hot: false, features: ['定时提醒', '饮水记录', '皮肤水分', '每日目标'] },
        { id: 11, name: '洗脸时间助手', icon: '🧼', desc: '科学洗脸习惯养成', hot: false, features: ['计时功能', '手法指导', '产品搭配', '打卡记录'] },
        { id: 12, name: '面膜打卡', icon: '🎭', desc: '连续记录面膜使用', hot: false, features: ['使用记录', '效果评价', '提醒功能', '积分系统'] },
        { id: 13, name: '化妆品保质期查询', icon: '📦', desc: '查询化妆品过期时间', hot: true, features: ['保质期查询', '开封提醒', '产品管理', '安全预警'] },
        { id: 14, name: 'AI护肤方案', icon: '🤖', desc: '个性推荐护肤方案', hot: true, features: ['肤质匹配', '预算规划', '步骤定制', '品牌推荐'] },
        { id: 15, name: '美容预算计算器', icon: '💰', desc: '统计每月美容花费', hot: false, features: ['月度统计', '分类记录', '预算提醒', '省钱建议'] },
        { id: 16, name: '护肤步骤生成器', icon: '📝', desc: '新手必备护肤流程', hot: true, features: ['早晚流程', '产品排序', '新手教程', '图文指导'] },
        { id: 17, name: '敏感肌检测', icon: '⚠️', desc: '风险评估敏感程度', hot: false, features: ['敏感程度评估', '致敏成分', '安全产品', '护理建议'] },
        { id: 18, name: '季节护肤建议', icon: '🌸', desc: '自动推荐换季护肤', hot: false, features: ['季节匹配', '换季指南', '产品切换', '常见问题'] },
        { id: 19, name: '头发护理助手', icon: '💇‍♀️', desc: '定制护发计划', hot: false, features: ['发质评估', '护理计划', '产品推荐', '造型建议'] },
        { id: 20, name: '发质检测', icon: '💁‍♀️', desc: 'AI分析发质状况', hot: true, features: ['发质分类', '损伤评估', '护理方案', '沙龙推荐'] },
      ]
    },
    {
      id: 'fashion',
      name: '穿搭工具',
      icon: '👗',
      tools: [
        { id: 21, name: 'AI穿搭推荐', icon: '🤖', desc: '智能搭配每日穿搭', hot: true, features: ['天气匹配', '场合推荐', '个人风格', '一键生成'] },
        { id: 22, name: '今日穿什么', icon: '❓', desc: '解决每天穿搭烦恼', hot: true, features: ['天气适配', '温度建议', '场合推荐', '快速决策'] },
        { id: 23, name: '衣柜管理', icon: '🗄️', desc: '管理你的衣物清单', hot: false, features: ['衣物分类', '穿搭统计', '闲置提醒', '购买建议'] },
        { id: 24, name: '穿搭预算', icon: '💰', desc: '合理规划穿搭支出', hot: false, features: ['月度预算', '消费分析', '省钱建议', '购物清单'] },
        { id: 25, name: '色彩搭配', icon: '🎨', desc: '科学色彩搭配指南', hot: true, features: ['肤色分析', '色卡推荐', '配色方案', '流行色'] },
        { id: 26, name: '身材分析', icon: '📐', desc: 'AI分析身材类型', hot: true, features: ['体型判断', '优缺点', '穿搭建议', '明星参考'] },
        { id: 27, name: '显瘦搭配', icon: '✨', desc: '显高显瘦穿搭技巧', hot: false, features: ['显瘦方案', '视觉优化', '单品推荐', '避雷指南'] },
        { id: 28, name: '职场穿搭', icon: '💼', desc: '职业场合穿搭指南', hot: false, features: ['行业匹配', '职位适配', '面试穿搭', '日常通勤'] },
        { id: 29, name: '约会穿搭', icon: '💕', desc: '约会场景穿搭推荐', hot: false, features: ['场合匹配', '风格推荐', '好感度UP', '男生视角'] },
        { id: 30, name: '旅行穿搭', icon: '✈️', desc: '旅行打包穿搭方案', hot: false, features: ['目的地匹配', '气候适配', '打包清单', '一衣多穿'] },
        { id: 31, name: '发型匹配', icon: '💇', desc: '根据脸型推荐发型', hot: true, features: ['脸型分析', '发型推荐', '长度建议', '染发参考'] },
        { id: 32, name: '包包搭配', icon: '👜', desc: '不同穿搭的包袋建议', hot: false, features: ['场合匹配', '风格搭配', '尺寸推荐', '色系搭配'] },
        { id: 33, name: '鞋子搭配', icon: '👠', desc: '鞋柜搭配建议', hot: false, features: ['场合推荐', '风格匹配', '舒适度', '流行款式'] },
        { id: 34, name: 'AI虚拟试衣', icon: '🖥️', desc: '在线试穿各种服装', hot: true, features: ['3D试衣', '尺码推荐', '风格尝试', '社交分享'] },
        { id: 35, name: '穿搭PK', icon: '⚔️', desc: '对比两套穿搭方案', hot: false, features: ['对比投票', '好友参与', '社区排行', '风格诊断'] },
        { id: 36, name: '每日OOTD', icon: '📸', desc: '记录每日穿搭', hot: false, features: ['拍照记录', '日记功能', '风格分析', '月度回顾'] },
        { id: 37, name: '穿搭评分', icon: '⭐', desc: 'AI给你的穿搭打分', hot: false, features: ['AI评分', '改进建议', '风格诊断', 'TOP穿搭'] },
        { id: 38, name: '流行趋势助手', icon: '📈', desc: '掌握最新流行趋势', hot: false, features: ['趋势追踪', '季节流行', '博主推荐', '购物链接'] },
        { id: 39, name: '衣服购买记录', icon: '🛍️', desc: '记录每件衣服信息', hot: false, features: ['购买记录', '价格追踪', '质保提醒', '闲置统计'] },
        { id: 40, name: '穿搭收藏夹', icon: '❤️', desc: '收藏你喜欢的搭配', hot: false, features: ['灵感收藏', '分类管理', '一键搭配', '社交分享'] },
      ]
    },
    {
      id: 'fitness',
      name: '减肥瘦身',
      icon: '💪',
      tools: [
        { id: 41, name: 'BMI计算', icon: '📊', desc: '科学计算身体指数', hot: false, features: ['标准BMI', '健康范围', '体重管理', '目标设定'] },
        { id: 42, name: '体脂率计算', icon: '📏', desc: '检测体脂健康水平', hot: true, features: ['体脂评估', '肌肉量', '基础代谢', '减脂建议'] },
        { id: 43, name: '热量计算', icon: '🔥', desc: '食物热量智能计算', hot: true, features: ['食物库', '热量查询', '营养分析', '每日统计'] },
        { id: 44, name: '饮食记录', icon: '🍽️', desc: '记录每日饮食摄入', hot: false, features: ['拍照记录', '营养分析', '热量统计', '饮食建议'] },
        { id: 45, name: '减肥计划', icon: '🎯', desc: '定制专属减肥方案', hot: false, features: ['目标设定', '周期计划', '进度追踪', '调整建议'] },
        { id: 46, name: '喝水提醒', icon: '🚰', desc: '智能提醒多喝水', hot: false, features: ['定时提醒', '饮水统计', '目标设定', '皮肤改善'] },
        { id: 47, name: '步数统计', icon: '👣', desc: '记录每日步数消耗', hot: false, features: ['步数记录', '卡路里消耗', '目标管理', '好友排行'] },
        { id: 48, name: '减脂食谱', icon: '🥗', desc: '科学减脂食谱推荐', hot: true, features: ['食谱库', '营养配比', '热量控制', '食材清单'] },
        { id: 49, name: '生酮助手', icon: '🥑', desc: '生酮饮食专业指导', hot: false, features: ['生酮计算', '食物查询', '状态检测', '食谱推荐'] },
        { id: 50, name: '轻断食助手', icon: '⏰', desc: '16+8断食管理', hot: false, features: ['时间管理', '断食记录', '身体反应', '效果追踪'] },
        { id: 51, name: '卡路里查询', icon: '📖', desc: '海量食物热量查询', hot: false, features: ['食物数据库', '扫码查询', '营养分析', '对比功能'] },
        { id: 52, name: '减肥打卡', icon: '📝', desc: '每日减肥打卡记录', hot: true, features: ['每日打卡', '体重记录', '心得分享', '社群互动'] },
        { id: 53, name: '运动推荐', icon: '🏋️', desc: '根据体质推荐运动', hot: false, features: ['体质匹配', '难度选择', '时间推荐', '视频指导'] },
        { id: 54, name: 'AI营养师', icon: '🥦', desc: '智能营养分析建议', hot: true, features: ['饮食分析', '营养评估', '个性化建议', '健康报告'] },
        { id: 55, name: '减肥进度图', icon: '📈', desc: '可视化减肥进度', hot: false, features: ['体重曲线', '体脂变化', '围度记录', '成就系统'] },
      ]
    },
    {
      id: 'love',
      name: '恋爱娱乐',
      icon: '💕',
      tools: [
        { id: 56, name: '恋爱匹配', icon: '💑', desc: '测试你们有多匹配', hot: true, features: ['性格匹配', '兴趣分析', '契合度评分', '爱情建议'] },
        { id: 57, name: '姓名配对', icon: '📛', desc: '姓名缘分测试', hot: false, features: ['笔画分析', '五行匹配', '缘分评分', '趣味解读'] },
        { id: 58, name: '情侣默契测试', icon: '🤝', desc: '考验你们的默契度', hot: true, features: ['双人答题', '默契评分', '有趣挑战', '关系提升'] },
        { id: 59, name: '爱情语言测试', icon: '💬', desc: '发现你的爱的语言', hot: false, features: ['五种语言', '行为分析', '沟通建议', '关系改善'] },
        { id: 60, name: 'AI恋爱顾问', icon: '🤖', desc: '智能解答情感问题', hot: true, features: ['情感分析', '问题解答', '关系建议', '24小时在线'] },
        { id: 61, name: '分手恢复助手', icon: '🌱', desc: '帮助走出分手阴影', hot: false, features: ['情绪记录', '疗愈计划', '每日鼓励', '成长日记'] },
        { id: 62, name: '表白文案生成', icon: '💌', desc: '生成浪漫表白文案', hot: false, features: ['风格选择', '场景匹配', '自定义编辑', '一键复制'] },
        { id: 63, name: '情书生成器', icon: '📜', desc: 'AI帮你写情书', hot: true, features: ['AI写作', '风格定制', '手写体', '发送建议'] },
        { id: 64, name: '恋爱聊天助手', icon: '💭', desc: '聊天话题推荐', hot: false, features: ['话题推荐', '回复建议', '聊天技巧', '破冰指南'] },
        { id: 65, name: '红娘测试', icon: '🔮', desc: '你的红娘指数', hot: false, features: ['匹配能力', '恋爱观', '推荐指数', '有趣称号'] },
        { id: 66, name: '理想型分析', icon: '⭐', desc: '分析你的理想类型', hot: false, features: ['性格画像', '外表偏好', '价值观匹配', '现实建议'] },
        { id: 67, name: '婚姻匹配', icon: '💒', desc: '婚前匹配度测试', hot: false, features: ['综合匹配', '价值观', '生活习惯', '未来规划'] },
        { id: 68, name: '恋爱风险分析', icon: '⚠️', desc: '评估感情潜在风险', hot: false, features: ['风险识别', '预警提示', '改善建议', '关系保险'] },
        { id: 69, name: '情感树洞', icon: '🌳', desc: '匿名倾诉情感心事', hot: false, features: ['匿名倾诉', '暖心回复', '情感社区', '专业建议'] },
        { id: 70, name: '桃花运测试', icon: '🌸', desc: '测测你的桃花运', hot: true, features: ['桃花指数', '运势分析', '月份预测', '脱单建议'] },
      ]
    },
    {
      id: 'astrology',
      name: '星座塔罗',
      icon: '⭐',
      tools: [
        { id: 71, name: '今日运势', icon: '🌟', desc: '查看每日星座运势', hot: true, features: ['每日运势', '综合评分', '幸运提示', '注意事项'] },
        { id: 72, name: '星座配对', icon: '♊', desc: '星座匹配度分析', hot: true, features: ['双星匹配', '性格分析', '相处建议', '缘分指数'] },
        { id: 73, name: '星盘分析', icon: '🌌', desc: '专业星盘解读', hot: false, features: ['本命盘', '行星解读', '宫位分析', '相位解析'] },
        { id: 74, name: '塔罗抽牌', icon: '🃏', desc: '在线塔罗占卜', hot: true, features: ['经典牌阵', 'AI解牌', '每日一抽', '运势指引'] },
        { id: 75, name: '幸运颜色', icon: '🎨', desc: '今日幸运颜色推荐', hot: false, features: ['星座匹配', '每日更新', '穿搭建议', '色彩能量'] },
        { id: 76, name: '幸运数字', icon: '🔢', desc: '你的专属幸运数字', hot: false, features: ['数字测算', '生日分析', '运势关联', '彩票参考'] },
        { id: 77, name: '水逆提醒', icon: '🌊', desc: '水逆期预警提示', hot: false, features: ['水逆日历', '注意事项', '星座影响', '应对指南'] },
        { id: 78, name: '每日占卜', icon: '🔮', desc: '每日一卦好运来', hot: false, features: ['多种占卜', '运势指引', '心诚则灵', '分享好运'] },
        { id: 79, name: 'AI解牌', icon: '🤖', desc: '智能塔罗牌解读', hot: true, features: ['牌意解析', '正逆位', '关联解读', '深度分析'] },
        { id: 80, name: '梦境解析', icon: '💤', desc: 'AI分析梦境含义', hot: true, features: ['梦境分析', '象征解读', '心理暗示', '记录保存'] },
      ]
    },
    {
      id: 'health',
      name: '母婴女性健康',
      icon: '👶',
      tools: [
        { id: 81, name: '经期记录', icon: '📅', desc: '智能周期管理', hot: true, features: ['周期记录', '预测提醒', '症状追踪', '健康分析'] },
        { id: 82, name: '排卵计算', icon: '🥚', desc: '精准排卵期预测', hot: false, features: ['周期分析', '排卵日', '受孕窗口', '体温记录'] },
        { id: 83, name: '孕期计算', icon: '🤰', desc: '孕期周数计算器', hot: false, features: ['孕周计算', '预产期', '胎儿发育', '妈妈变化'] },
        { id: 84, name: '宝宝身高预测', icon: '📏', desc: '预测宝宝未来身高', hot: false, features: ['遗传分析', '科学公式', '成长曲线', '营养建议'] },
        { id: 85, name: '宝宝体重参考', icon: '⚖️', desc: '标准体重对照表', hot: false, features: ['月龄对照', '百分位', '评估报告', '喂养建议'] },
        { id: 86, name: '母乳记录', icon: '🍼', desc: '哺乳时间记录', hot: false, features: ['时间记录', '量统计', '提醒功能', '数据分析'] },
        { id: 87, name: '辅食计划', icon: '🥄', desc: '宝宝辅食添加计划', hot: false, features: ['月龄匹配', '食谱推荐', '过敏预警', '营养均衡'] },
        { id: 88, name: '睡眠记录', icon: '🌙', desc: '宝宝睡眠质量追踪', hot: false, features: ['睡眠记录', '规律分析', '改善建议', '成长关联'] },
        { id: 89, name: '宝宝成长记录', icon: '📸', desc: '记录宝宝成长瞬间', hot: false, features: ['照片记录', '里程碑', '成长对比', '分享相册'] },
        { id: 90, name: '疫苗提醒', icon: '💉', desc: '疫苗接种时间提醒', hot: false, features: ['疫苗日历', '接种提醒', '注意事项', '记录管理'] },
      ]
    },
    {
      id: 'fun',
      name: '趣味测试',
      icon: '🎮',
      tools: [
        { id: 91, name: '颜值评分', icon: '🌟', desc: 'AI给你的颜值打分', hot: true, features: ['AI评分', '颜值分析', '改善建议', '趣味分享'] },
        { id: 92, name: 'AI漫画头像', icon: '🎨', desc: '生成你的漫画头像', hot: true, features: ['风格转换', '卡通化', '多种画风', '社交头像'] },
        { id: 93, name: '前世测试', icon: '🕰️', desc: '测测你的前世身份', hot: false, features: ['前世分析', '趣味故事', '性格关联', '分享好友'] },
        { id: 94, name: '性格颜色测试', icon: '🌈', desc: '你的专属性格颜色', hot: false, features: ['色彩心理', '性格画像', '人际建议', '颜色搭配'] },
        { id: 95, name: 'MBTI测试', icon: '🧠', desc: '专业人格类型测试', hot: true, features: ['完整题库', '类型分析', '职业建议', '人际关系'] },
        { id: 96, name: '富婆指数测试', icon: '💰', desc: '测测你的富婆潜力', hot: true, features: ['潜力评估', '财富分析', '搞钱建议', '趣味排行'] },
        { id: 97, name: '社交能力测试', icon: '🗣️', desc: '评估你的社交能力', hot: false, features: ['能力评分', '改善建议', '场景分析', '自信提升'] },
        { id: 98, name: '幸福指数测试', icon: '😊', desc: '你的生活幸福指数', hot: false, features: ['综合评估', '维度分析', '改善建议', '积极心理'] },
        { id: 99, name: '职业匹配测试', icon: '💼', desc: '找到适合你的职业', hot: false, features: ['性格匹配', '能力分析', '职业推荐', '发展建议'] },
        { id: 100, name: 'AI人生剧本', icon: '📖', desc: 'AI为你写人生故事', hot: true, features: ['个性化剧本', '趣味结局', '选择分支', '分享保存'] },
      ]
    }
  ],
  hotTools: [91, 2, 21, 22, 81, 95, 74, 60, 72, 58, 92, 31, 42, 52, 43, 54, 70, 80, 63, 96]
};

// ===== 检测工具序号是否在爆火列表中 =====
function isHot(toolId) {
  return TOOLS_DATA.hotTools.includes(toolId);
}

// ===== 获取所有工具（展平） =====
function getAllTools() {
  const all = [];
  TOOLS_DATA.categories.forEach(cat => {
    cat.tools.forEach(t => {
      all.push({ ...t, category: cat.name, catIcon: cat.icon });
    });
  });
  return all;
}

// ===== 搜索工具 =====
function searchTools(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getAllTools();
  return getAllTools().filter(t =>
    t.name.includes(q) || t.desc.includes(q) || t.category.includes(q)
  );
}