# ✨ 魅力工具箱 - Charm Toolbox

> 专为女性打造的 **100款** 在线工具平台
> 免费 · 无需下载 · 即开即用

![Version](https://img.shields.io/badge/version-1.0.0-pink)
![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 功能特色

- 💄 **美容护肤**（20款）— 皮肤检测、成分查询、AI护肤方案
- 👗 **穿搭工具**（20款）— AI穿搭推荐、身材分析、虚拟试衣
- 💪 **减肥瘦身**（15款）— BMI计算、饮食记录、AI营养师
- 💕 **恋爱娱乐**（15款）— 恋爱匹配、情书生成、情感树洞
- ⭐ **星座塔罗**（10款）— 运势查询、星盘分析、塔罗占卜
- 👶 **母婴女性健康**（10款）— 经期记录、孕期计算、育儿工具
- 🎮 **趣味测试**（10款）— 颜值评分、MBTI、富婆指数

## 🚀 快速部署

### 方式一：Cloudflare Pages（推荐 · 免费）

1. Fork 或下载本仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Workers & Pages** → **Pages** → **Connect to Git**
4. 选择本仓库
5. Framework preset 选 **None**
6. Build output directory 填 **/**
7. 点击 **Deploy**，1分钟上线！

### 方式二：Vercel / Netlify

同样支持直接导入 GitHub 仓库，零配置部署。

## 🛠️ 自定义修改

| 文件 | 说明 |
|------|------|
| `index.html` | 主页面 |
| `css/style.css` | 样式（粉色主题，可改配色） |
| `js/data.js` | 工具数据（添加/修改工具） |
| `pages/guide.html` | 部署教程 |
| `pages/money.html` | 赚钱攻略 |
| `pages/blog.html` | 博客页面 |
| `pages/links.html` | 友情链接 |

### 修改主题色

编辑 `css/style.css` 的 `:root` 变量：

```css
--primary: #e84393;   /* 主色（粉红） */
--secondary: #a29bfe; /* 辅色（紫色） */
```

### 添加工具

编辑 `js/data.js`，在对应分类的 `tools` 数组中添加：

```js
{ id: 101, name: '工具名', icon: '✨', desc: '简短描述', hot: false, features: ['功能1', '功能2'] }
```

## 💎 赚钱方式

1. **Google AdSense** — 展示广告，流量变现
2. **联盟营销** — 推荐美妆/服饰产品赚佣金
3. **AI会员订阅** — 高级功能付费
4. **数字产品销售** — 电子书/课程/模板
5. **品牌合作** — 广告投放/内容合作

详见 [赚钱攻略](pages/money.html)

## 📦 项目结构

```
charm-toolbox/
├── index.html            # 主页面
├── 404.html              # 404页面
├── robots.txt            # 搜索引擎配置
├── sitemap.xml           # 网站地图
├── _redirects            # Cloudflare重定向
├── css/
│   └── style.css         # 样式文件
├── js/
│   └── data.js           # 工具数据
├── images/               # 图片目录
├── pages/
│   ├── guide.html        # 部署教程
│   ├── money.html        # 赚钱攻略
│   ├── blog.html         # 博客
│   └── links.html        # 友情链接
└── README.md             # 本文件
```

## 📈 推广建议

- **小红书** — 发"100个免费女性工具"笔记
- **微信** — 分享给好友/朋友圈
- **微博** — 带话题 #女性工具# #免费工具#
- **Facebook/Pinterest** — 海外女性社群
- **知乎** — 回答相关问题植入链接

## 🤝 友链申请

欢迎交换友链！发邮件至：hello@example.com

## 📄 许可证

MIT License © 2026 Charm Toolbox