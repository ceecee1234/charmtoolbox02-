// ===== 魅力工具箱 - 主应用模块 =====
// 所有中文内容均使用字符串包裹

import { TOOLS_DATA, getAllTools, isHot, searchTools, getToolById } from "./tools/toolsData.js";
import { 
  menstrualTracker, 
  tarotCard, 
  todayOutfit, 
  mbtiTest, 
  zodiacMatch, 
  richLadyTest, 
  loveLetterGenerator 
} from "./tools/goldenTools.js";
import { utils } from "./utils/helpers.js";
import { dateUtils } from "./utils/date.js";
import { generators } from "./utils/generators.js";
import { validators } from "./utils/validators.js";
import { storage, tracker } from "./utils/storage.js";
import { showToast } from "./templates/templates.js";

// ===== 全局工具管理器 =====
const App = {
  currentTab: "home",
  currentTool: null,
  quizState: {},
  tools: {},
  
  // 初始化应用
  init() {
    this.bindEvents();
    this.renderTabs();
    this.renderHotTools();
    this.renderAllTools();
    this.initGoldenTools();
    this.initToolHandlers();
  },
  
  // 绑定事件
  bindEvents() {
    // Tab切换
    document.addEventListener("click", (e) => {
      if (e.target.closest(".tab-btn")) {
        const tabId = e.target.closest(".tab-btn").dataset.tab;
        if (tabId) this.switchTab(tabId);
      }
    });
    
    // 工具卡片点击
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".tool-card");
      if (card) {
        const toolId = parseInt(card.dataset.toolId);
        this.openToolModal(toolId);
      }
    });
    
    // 黄金工具卡片点击
    document.addEventListener("click", (e) => {
      const goldenCard = e.target.closest(".golden-card");
      if (goldenCard) {
        const toolId = goldenCard.dataset.toolId;
        this.openGoldenTool(toolId);
      }
    });
    
    // 搜索
    document.addEventListener("input", utils.debounce((e) => {
      if (e.target.id === "searchInput") {
        this.handleSearch(e.target.value);
      }
    }, 300));
    
    // Modal关闭
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        this.closeModal();
      }
      if (e.target.classList.contains("modal-close-btn")) {
        this.closeModal();
      }
    });
    
    // ESC关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
    
    // 导航链接
    document.addEventListener("click", (e) => {
      if (e.target.closest(".nav-links a")) {
        const link = e.target.closest(".nav-links a");
        if (link.hash) {
          e.preventDefault();
          const target = document.querySelector(link.hash);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  },
  
  // 切换Tab
  switchTab(tabId) {
    this.currentTab = tabId;
    
    // 更新Tab按钮状态
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    
    // 更新内容显示
    document.querySelectorAll(".tab-content").forEach(content => {
      content.classList.toggle("active", content.id === "tab-" + tabId);
    });
    
    // 滚动到顶部
    utils.scrollToTop();
  },
  
  // 渲染Tab系统
  renderTabs() {
    const container = document.getElementById("tabsContainer");
    if (!container) return;
    
    const tabs = [
      { id: "home", name: "首页", icon: "🏠" },
      { id: "hot", name: "🔥 热门", icon: "🔥" },
      { id: "beauty", name: "💄 美容", icon: "💄" },
      { id: "fashion", name: "👗 穿搭", icon: "👗" },
      { id: "fitness", name: "💪 减肥", icon: "💪" },
      { id: "love", name: "💕 恋爱", icon: "💕" },
      { id: "astrology", name: "⭐ 星座", icon: "⭐" },
      { id: "health", name: "👶 健康", icon: "👶" },
      { id: "fun", name: "🎮 趣味", icon: "🎮" }
    ];
    
    container.innerHTML = `
      <div class="tabs-header">
        ${tabs.map(tab => `
          <button class="tab-btn ${tab.id === "home" ? "active" : ""}" data-tab="${tab.id}">
            <span class="tab-icon">${tab.icon}</span>
            <span>${tab.name}</span>
          </button>
        `).join("")}
      </div>
      <div class="tab-content active" id="tab-home"></div>
      <div class="tab-content" id="tab-hot"></div>
      <div class="tab-content" id="tab-beauty"></div>
      <div class="tab-content" id="tab-fashion"></div>
      <div class="tab-content" id="tab-fitness"></div>
      <div class="tab-content" id="tab-love"></div>
      <div class="tab-content" id="tab-astrology"></div>
      <div class="tab-content" id="tab-health"></div>
      <div class="tab-content" id="tab-fun"></div>
    `;
  },
  
  // 渲染爆火工具
  renderHotTools() {
    const container = document.getElementById("tab-hot");
    if (!container) return;
    
    const hotIds = TOOLS_DATA.hotTools;
    const allTools = getAllTools();
    const hotTools = hotIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);
    
    container.innerHTML = `
      <div class="section">
        <div class="section-header">
          <h2>🔥 爆火工具精选 <span class="hot-badge">HOT</span></h2>
        </div>
        <div class="tool-grid">
          ${hotTools.map(tool => this.renderToolCard(tool)).join("")}
        </div>
      </div>
    `;
  },
  
  // 渲染所有工具
  renderAllTools() {
    // 按分类渲染到各Tab
    TOOLS_DATA.categories.forEach(cat => {
      const container = document.getElementById("tab-" + cat.id);
      if (container) {
        container.innerHTML = `
          <div class="section">
            <div class="section-header">
              <h2>${cat.icon} ${cat.name}</h2>
              <span style="color:var(--text-muted);font-size:14px;">${cat.tools.length}个工具</span>
            </div>
            <div class="tool-grid">
              ${cat.tools.map(tool => this.renderToolCard(tool)).join("")}
            </div>
          </div>
        `;
      }
    });
    
    // 首页渲染7大黄金工具
    const homeContainer = document.getElementById("tab-home");
    if (homeContainer) {
      homeContainer.innerHTML = `
        <div class="section">
          <div class="section-header">
            <h2>✨ 7大黄金互动工具</h2>
          </div>
          <div class="golden-tools">
            ${this.renderGoldenCard(81, "📅", "经期记录", "智能周期管理，预测排卵期和安全期")}
            ${this.renderGoldenCard(74, "🃏", "塔罗抽牌", "每日塔罗占卜，3D翻牌动画")}
            ${this.renderGoldenCard(22, "👗", "今日穿什么", "根据场景天气智能穿搭推荐")}
            ${this.renderGoldenCard(95, "🧠", "MBTI测试", "8道精选题，测出你的性格类型")}
            ${this.renderGoldenCard(72, "♊", "星座配对", "144种组合，精准缘分分析")}
            ${this.renderGoldenCard(96, "💰", "富婆指数", "5道趣味题，测你的搞钱潜力")}
            ${this.renderGoldenCard(63, "💌", "情书生成", "AI写作，多种语气一键复制")}
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            <h2>💄 美容护肤</h2>
            <button class="btn-secondary" onclick="App.switchTab('beauty')">查看全部 →</button>
          </div>
          <div class="tool-grid">
            ${TOOLS_DATA.categories[0].tools.slice(0, 6).map(t => this.renderToolCard(t)).join("")}
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            <h2>👗 穿搭工具</h2>
            <button class="btn-secondary" onclick="App.switchTab('fashion')">查看全部 →</button>
          </div>
          <div class="tool-grid">
            ${TOOLS_DATA.categories[1].tools.slice(0, 6).map(t => this.renderToolCard(t)).join("")}
          </div>
        </div>
      `;
    }
  },
  
  // 渲染工具卡片
  renderToolCard(tool) {
    return `
      <div class="tool-card" data-tool-id="${tool.id}">
        ${tool.hot ? '<span class="hot-tag">🔥</span>' : ""}
        <div class="card-icon">${tool.icon}</div>
        <div class="card-name">${tool.name}</div>
        <div class="card-desc">${tool.desc}</div>
        <div class="card-footer">
          ${(tool.features || []).slice(0, 2).map(f => `<span class="feature-tag">${f}</span>`).join("")}
        </div>
      </div>
    `;
  },
  
  // 渲染黄金工具卡片
  renderGoldenCard(id, icon, name, desc) {
    return `
      <div class="golden-card" data-tool-id="${id}">
        <div class="card-icon">${icon}</div>
        <div class="card-name">${name}</div>
        <div class="card-desc">${desc}</div>
        <button class="btn-generate" style="margin-top:16px;padding:12px 24px;font-size:14px;">
          立即体验 →
        </button>
      </div>
    `;
  },
  
  // 初始化黄金工具
  initGoldenTools() {
    // 注册全局工具处理器
    window.AITools = {};
    window.Calculators = {};
    window.QuizTools = {};
    window.Trackers = {};
    
    // 经期记录
    this.initMenstrualTracker();
    
    // 塔罗抽牌
    this.initTarotCard();
    
    // 今日穿搭
    this.initTodayOutfit();
    
    // MBTI测试
    this.initMBTITest();
    
    // 星座配对
    this.initZodiacMatch();
    
    // 富婆指数
    this.initRichLadyTest();
    
    // 情书生成
    this.initLoveLetterGenerator();
  },
  
  // 经期记录工具
  initMenstrualTracker() {
    const toolId = 81;
    window.Trackers["经期记录"] = {
      checkIn() {
        const lastDate = document.getElementById("menstrual-last-date").value;
        const cycleLength = parseInt(document.getElementById("menstrual-cycle").value) || 28;
        const periodLength = parseInt(document.getElementById("menstrual-period").value) || 5;
        
        if (!lastDate) {
          showToast("请选择上一次经期开始日期", "error");
          return;
        }
        
        const result = menstrualTracker.calculate({
          lastDate: lastDate,
          cycleLength: cycleLength,
          periodLength: periodLength
        });
        
        menstrualTracker.save({ lastDate, cycleLength, periodLength });
        
        document.getElementById("menstrual-result").style.display = "block";
        document.getElementById("menstrual-result-content").innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="result-item">
              <div class="result-label">📅 下次经期</div>
              <div class="result-value">${result.nextPeriod}</div>
            </div>
            <div class="result-item">
              <div class="result-label">🥚 排卵日</div>
              <div class="result-value">${result.ovulation}</div>
            </div>
            <div class="result-item">
              <div class="result-label">💕 受孕窗口</div>
              <div class="result-value">${result.fertileWindow.start} - ${result.fertileWindow.end}</div>
            </div>
            <div class="result-item">
              <div class="result-label">📆 周期天数</div>
              <div class="result-value">${result.cycleDays}天</div>
            </div>
          </div>
          <div style="margin-top:20px;padding:16px;background:rgba(255,117,143,0.08);border-radius:12px;">
            <div style="font-weight:600;margin-bottom:8px;">🌸 卵泡期建议</div>
            <p style="font-size:14px;color:var(--text-light);">${result.follicularTips}</p>
          </div>
          <div style="margin-top:12px;padding:16px;background:rgba(162,155,254,0.08);border-radius:12px;">
            <div style="font-weight:600;margin-bottom:8px;">🌺 黄体期建议</div>
            <p style="font-size:14px;color:var(--text-light);">${result.lutealTips}</p>
          </div>
        `;
        
        showToast("计算完成！", "success");
        App.updateTrackerStats(81);
      },
      
      reset() {
        document.getElementById("menstrual-last-date").value = "";
        document.getElementById("menstrual-cycle").value = "28";
        document.getElementById("menstrual-period").value = "5";
        document.getElementById("menstrual-result").style.display = "none";
      }
    };
  },
  
  // 塔罗抽牌工具
  initTarotCard() {
    window.AITools["塔罗抽牌"] = {
      result: null,
      
      async generate() {
        const btn = document.querySelector("[data-tool='tarot'] .btn-generate");
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner" style="width:20px;height:20px;"></span> 抽取中...';
        
        // 模拟加载
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const result = tarotCard.getDailyReading();
        this.result = result;
        
        const container = document.getElementById("tarot-result");
        container.style.display = "block";
        
        // 3D翻牌动画
        const cardEl = document.getElementById("tarot-card-display");
        cardEl.innerHTML = `
          <div class="tarot-card-3d">
            <div class="card-front ${result.isReversed ? "reversed" : ""}">
              <div class="card-symbol">${result.card.name}</div>
              <div class="card-svg">${this.getCardSVG(result.card.id)}</div>
              <div class="card-meaning">${result.meaning}</div>
            </div>
          </div>
        `;
        
        document.getElementById("tarot-detail-content").innerHTML = `
          <div class="tarot-detail-grid">
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-label">日期</span>
              <span class="detail-value">${result.date}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🔄</span>
              <span class="detail-label">位置</span>
              <span class="detail-value">${result.position}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">💫</span>
              <span class="detail-label">元素</span>
              <span class="detail-value">${result.element}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎨</span>
              <span class="detail-label">幸运色</span>
              <span class="detail-value" style="color:${result.luckyColor}">${result.luckyColor}</span>
            </div>
          </div>
          <div class="daily-message">
            <div class="message-icon">💬</div>
            <div class="message-text">${result.dailyMessage}</div>
          </div>
          <div class="card-advice">
            <div class="advice-icon">✨</div>
            <div class="advice-text">${result.advice}</div>
          </div>
        `;
        
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon">🔄</span> 再抽一张';
        showToast("抽牌完成，塔罗指引已揭晓！", "success");
      },
      
      getCardSVG(id) {
        const svgs = [
          '<svg viewBox="0 0 100 140" class="card-svg-inner"><circle cx="50" cy="50" r="35" fill="none" stroke="#a29bfe" stroke-width="2"/><text x="50" y="55" text-anchor="middle" fill="#a29bfe" font-size="12">0</text></svg>',
          '<svg viewBox="0 0 100 140" class="card-svg-inner"><polygon points="50,10 90,90 10,90" fill="none" stroke="#ff758f" stroke-width="2"/><circle cx="50" cy="60" r="15" fill="none" stroke="#ff758f" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 100 140" class="card-svg-inner"><circle cx="50" cy="45" r="25" fill="none" stroke="#a29bfe" stroke-width="2"/><path d="M30,80 Q50,100 70,80" fill="none" stroke="#a29bfe" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 100 140" class="card-svg-inner"><ellipse cx="50" cy="50" rx="30" ry="40" fill="none" stroke="#ff758f" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#ff758f" opacity="0.3"/></svg>'
        ];
        return svgs[id % svgs.length];
      },
      
      copy() {
        if (!this.result) return;
        const text = `${this.result.card.name} (${this.result.position})\n\n含义：${this.result.meaning}\n\n建议：${this.result.advice}`;
        utils.copyText(text).then(() => showToast("复制成功！", "success"));
      },
      
      share() {
        if (!this.result) return;
        const text = `今天的塔罗牌：${this.result.card.name} (${this.result.position})\n含义：${this.result.meaning}\n来自魅力工具箱`;
        if (navigator.share) {
          navigator.share({ title: "塔罗占卜", text: text });
        } else {
          utils.copyText(text).then(() => showToast("已复制到剪贴板！", "success"));
        }
      },
      
      reset() {
        document.getElementById("tarot-result").style.display = "none";
        document.getElementById("tarot-card-display").innerHTML = "";
        document.getElementById("tarot-detail-content").innerHTML = "";
      }
    };
  },
  
  // 今日穿搭工具
  initTodayOutfit() {
    window.AITools["今日穿什么"] = {
      generate() {
        const scenario = document.getElementById("outfit-scenario")?.value || "casual";
        const temp = parseInt(document.getElementById("outfit-temp")?.value) || 22;
        
        const result = todayOutfit.generate({ scenario, temp });
        
        document.getElementById("outfit-result").style.display = "block";
        document.getElementById("outfit-result-content").innerHTML = `
          <div class="outfit-header">
            <div class="outfit-scenario">${result.scenario}</div>
            <div class="outfit-style">${result.style}风格</div>
          </div>
          <div class="outfit-colors">
            <div class="colors-label">推荐配色</div>
            <div class="color-swatches">
              ${result.colors.map(c => `<div class="color-swatch" style="background:${c}"></div>`).join("")}
            </div>
          </div>
          <div class="outfit-items">
            <div class="items-label">单品搭配</div>
            <div class="items-list">
              ${result.items.map(item => `<span class="item-tag">${item}</span>`).join("")}
            </div>
          </div>
          <div class="outfit-tips">
            <div class="tips-icon">💡</div>
            <div class="tips-text">${result.tempAdvice}</div>
          </div>
          <div class="weather-note">
            <div class="weather-icon">🌤️</div>
            <div class="weather-text">${result.weatherTips}</div>
          </div>
        `;
        
        showToast("穿搭方案已生成！", "success");
      },
      
      reset() {
        document.getElementById("outfit-result").style.display = "none";
      }
    };
  },
  
  // MBTI测试工具
  initMBTITest() {
    const toolId = 95;
    this.quizState[toolId] = {
      currentQuestion: 0,
      answers: [],
      questions: mbtiTest.questions
    };
    
    window.QuizTools["MBTI测试"] = {
      getState() {
        return App.quizState[toolId];
      },
      
      nextQuestion() {
        const state = this.getState();
        const totalQuestions = state.questions.length;
        
        // 获取当前答案
        const selectedInput = document.querySelector(`input[name="quiz-q-${state.currentQuestion}"]:checked`);
        if (selectedInput) {
          state.answers[state.currentQuestion] = selectedInput.value;
        }
        
        // 下一题
        if (state.currentQuestion < totalQuestions - 1) {
          state.currentQuestion++;
          this.showQuestion(state.currentQuestion);
          this.updateProgress(state.currentQuestion, totalQuestions);
        } else {
          // 完成测试
          this.showResult();
        }
        
        // 更新按钮文字
        const btn = document.getElementById("btn-quiz-action");
        if (state.currentQuestion === totalQuestions - 1) {
          btn.innerHTML = '<span>查看结果</span><span class="btn-icon">🎯</span>';
        }
      },
      
      showQuestion(index) {
        document.querySelectorAll(".quiz-question").forEach((q, i) => {
          q.classList.toggle("active", i === index);
        });
        
        // 高亮选中项
        document.querySelectorAll(".quiz-option").forEach(opt => {
          opt.classList.remove("selected");
          if (parseInt(opt.dataset.index) === index && opt.dataset.value === this.getState().answers[index]) {
            opt.classList.add("selected");
          }
        });
      },
      
      updateProgress(current, total) {
        const percent = ((current + 1) / total) * 100;
        const progressBar = document.getElementById("quiz-progress-bar");
        const progressText = document.getElementById("quiz-progress-text");
        if (progressBar) progressBar.style.width = percent + "%";
        if (progressText) progressText.textContent = `${current + 1}/${total}`;
      },
      
      showResult() {
        const state = this.getState();
        const result = mbtiTest.calculate(state.answers);
        mbtiTest.saveResult(result);
        
        document.querySelector(".quiz-container").style.display = "none";
        document.getElementById("quiz-progress").style.display = "none";
        
        const resultContainer = document.getElementById("quiz-result");
        resultContainer.style.display = "block";
        
        resultContainer.innerHTML = `
          <div class="mbti-result">
            <div class="mbti-type">${result.type}</div>
            <div class="mbti-name">${result.name}</div>
            <div class="mbti-traits">
              ${result.traits.map(t => `<span class="trait-tag">${t}</span>`).join("")}
            </div>
          </div>
          <div class="mbti-detail">
            <div class="detail-section">
              <div class="detail-title">💼 适合职业</div>
              <div class="detail-content">
                ${result.career.map(c => `<span class="career-tag">${c}</span>`).join("")}
              </div>
            </div>
            <div class="detail-section">
              <div class="detail-title">💰 副业推荐</div>
              <div class="detail-content">
                ${result.sideHustle.map(s => `<span class="side-hustle-tag">${s}</span>`).join("")}
              </div>
            </div>
          </div>
          <button class="btn-secondary" onclick="App.resetQuiz('MBTI测试')" style="margin-top:20px;">
            重新测试
          </button>
        `;
        
        document.getElementById("btn-quiz-action").style.display = "none";
        showToast("测试完成！发现你的性格类型！", "success");
      },
      
      reset() {
        App.resetQuiz("MBTI测试");
      }
    };
  },
  
  // 星座配对工具
  initZodiacMatch() {
    window.Calculators["星座配对"] = {
      calculate() {
        const sign1 = document.getElementById("zodiac-1").value;
        const sign2 = document.getElementById("zodiac-2").value;
        
        if (!sign1 || !sign2) {
          showToast("请选择两个星座", "error");
          return;
        }
        
        const result = zodiacMatch.calculate(sign1, sign2);
        
        document.getElementById("zodiac-result").style.display = "block";
        document.getElementById("zodiac-result-content").innerHTML = `
          <div class="match-header">
            <div class="sign-box">
              <div class="sign-symbol">${result.sign1?.symbol || "♈"}</div>
              <div class="sign-name">${sign1}</div>
            </div>
            <div class="match-heart">❤️</div>
            <div class="sign-box">
              <div class="sign-symbol">${result.sign2?.symbol || "♉"}</div>
              <div class="sign-name">${sign2}</div>
            </div>
          </div>
          <div class="match-score">
            <div class="score-value">${result.score}</div>
            <div class="score-label">匹配度</div>
            <div class="score-stars">${"⭐".repeat(result.stars)}${"☆".repeat(5 - result.stars)}</div>
          </div>
          <div class="match-desc">${result.desc}</div>
          <div class="match-advice">
            <div class="advice-icon">💕</div>
            <div class="advice-text">${result.advice}</div>
          </div>
        `;
        
        showToast("配对分析完成！", "success");
      },
      
      reset() {
        document.getElementById("zodiac-result").style.display = "none";
      }
    };
  },
  
  // 富婆指数测试
  initRichLadyTest() {
    const toolId = 96;
    this.quizState[toolId] = {
      currentQuestion: 0,
      answers: [],
      questions: richLadyTest.questions
    };
    
    window.QuizTools["富婆指数测试"] = {
      getState() {
        return App.quizState[toolId];
      },
      
      nextQuestion() {
        const state = this.getState();
        const totalQuestions = state.questions.length;
        
        const selectedInput = document.querySelector(`input[name="rich-q-${state.currentQuestion}"]:checked`);
        if (selectedInput) {
          state.answers[state.currentQuestion] = parseInt(selectedInput.value);
        }
        
        if (state.currentQuestion < totalQuestions - 1) {
          state.currentQuestion++;
          this.showQuestion(state.currentQuestion);
          this.updateProgress(state.currentQuestion, totalQuestions);
        } else {
          this.showResult();
        }
        
        const btn = document.getElementById("btn-rich-action");
        if (state.currentQuestion === totalQuestions - 1) {
          btn.innerHTML = '<span>查看结果</span><span class="btn-icon">💰</span>';
        }
      },
      
      showQuestion(index) {
        document.querySelectorAll(".rich-question").forEach((q, i) => {
          q.classList.toggle("active", i === index);
        });
      },
      
      updateProgress(current, total) {
        const percent = ((current + 1) / total) * 100;
        const progressBar = document.getElementById("rich-progress-bar");
        const progressText = document.getElementById("rich-progress-text");
        if (progressBar) progressBar.style.width = percent + "%";
        if (progressText) progressText.textContent = `${current + 1}/${total}`;
      },
      
      showResult() {
        const state = this.getState();
        const result = richLadyTest.calculate(state.answers);
        const plan = richLadyTest.getPlan(result);
        
        document.querySelector(".rich-quiz-container").style.display = "none";
        document.getElementById("rich-progress").style.display = "none";
        
        const resultContainer = document.getElementById("rich-result");
        resultContainer.style.display = "block";
        
        resultContainer.innerHTML = `
          <div class="rich-result">
            <div class="rich-avatar">${result.avatar}</div>
            <div class="rich-title">${result.title}</div>
            <div class="rich-score">${result.score}分</div>
            <div class="rich-percent">超越 ${result.percent}% 的人</div>
          </div>
          <div class="rich-desc">${result.desc}</div>
          <div class="rich-tips">
            <div class="tips-title">💡 变富建议</div>
            ${result.tips.map(t => `<div class="tip-item">${t}</div>`).join("")}
          </div>
          <div class="rich-plan">
            <div class="plan-title">📋 创富计划</div>
            ${plan.map(p => `
              <div class="plan-item">
                <span class="plan-step">${p.step}</span>
                <div class="plan-content">
                  <div class="plan-action">${p.action}</div>
                  <div class="plan-detail">${p.detail}</div>
                </div>
              </div>
            `).join("")}
          </div>
          <button class="btn-secondary" onclick="App.resetQuiz('富婆指数测试')" style="margin-top:20px;">
            重新测试
          </button>
        `;
        
        document.getElementById("btn-rich-action").style.display = "none";
        showToast("测试完成！你的富婆潜力已揭晓！", "success");
      },
      
      reset() {
        App.resetQuiz("富婆指数测试");
      }
    };
  },
  
  // 情书生成器
  initLoveLetterGenerator() {
    window.AITools["情书生成"] = {
      result: null,
      
      async generate() {
        const hisName = document.getElementById("letter-name").value || "亲爱的";
        const herName = document.getElementById("letter-sender").value || "我";
        const tone = document.getElementById("letter-tone").value;
        const memory = document.getElementById("letter-memory").value;
        
        const btn = document.querySelector("[data-tool='letter'] .btn-generate");
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner" style="width:20px;height:20px;"></span> 书写中...';
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const result = loveLetterGenerator.generate({
          tone: tone,
          hisName: hisName,
          herName: herName,
          memory: memory,
          length: "medium"
        });
        
        this.result = result;
        
        document.getElementById("letter-result").style.display = "block";
        document.getElementById("letter-content").innerHTML = `
          <div class="letter-paper">
            <pre class="letter-text">${result.letter}</pre>
          </div>
          <div class="letter-meta">
            <span class="meta-tag">语气：${result.tone}</span>
            <span class="meta-tag">风格：${result.style}</span>
          </div>
        `;
        
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon">✨</span> 再写一封';
        showToast("情书已生成！", "success");
      },
      
      copy() {
        if (!this.result) return;
        utils.copyText(this.result.letter).then(() => showToast("复制成功！快去发送吧～", "success"));
      },
      
      share() {
        if (!this.result) return;
        if (navigator.share) {
          navigator.share({ title: "蜜语情书", text: this.result.letter });
        } else {
          utils.copyText(this.result.letter).then(() => showToast("已复制！", "success"));
        }
      },
      
      reset() {
        document.getElementById("letter-result").style.display = "none";
        document.getElementById("letter-name").value = "";
        document.getElementById("letter-sender").value = "";
        document.getElementById("letter-memory").value = "";
      }
    };
  },
  
  // 重置测试
  resetQuiz(toolName) {
    if (toolName === "MBTI测试") {
      this.quizState[95] = {
        currentQuestion: 0,
        answers: [],
        questions: mbtiTest.questions
      };
      document.querySelector(".quiz-container").style.display = "block";
      document.getElementById("quiz-progress").style.display = "flex";
      document.getElementById("quiz-result").style.display = "none";
      document.getElementById("btn-quiz-action").style.display = "flex";
      document.getElementById("btn-quiz-action").innerHTML = '<span>下一题</span><span class="btn-icon">→</span>';
      window.QuizTools["MBTI测试"].showQuestion(0);
      window.QuizTools["MBTI测试"].updateProgress(0, mbtiTest.questions.length);
    } else if (toolName === "富婆指数测试") {
      this.quizState[96] = {
        currentQuestion: 0,
        answers: [],
        questions: richLadyTest.questions
      };
      document.querySelector(".rich-quiz-container").style.display = "block";
      document.getElementById("rich-progress").style.display = "flex";
      document.getElementById("rich-result").style.display = "none";
      document.getElementById("btn-rich-action").style.display = "flex";
      document.getElementById("btn-rich-action").innerHTML = '<span>下一题</span><span class="btn-icon">→</span>';
    }
  },
  
  // 更新打卡统计
  updateTrackerStats(toolId) {
    const stats = tracker.getStats(toolId);
    const totalEl = document.getElementById("tracker-total");
    const streakEl = document.getElementById("tracker-streak");
    if (totalEl) totalEl.textContent = stats.total;
    if (streakEl) streakEl.textContent = stats.streak;
  },
  
  // 初始化工具处理器
  initToolHandlers() {
    // 黄金工具处理器
    this.toolHandlers = {
      81: () => this.renderMenstrualTracker(),
      74: () => this.renderTarotCard(),
      22: () => this.renderTodayOutfit(),
      95: () => this.renderMBTITest(),
      72: () => this.renderZodiacMatch(),
      96: () => this.renderRichLadyTest(),
      63: () => this.renderLoveLetterGenerator()
    };
  },
  
  // 打开黄金工具
  openGoldenTool(toolId) {
    const handlers = {
      81: () => this.renderMenstrualTracker(),
      74: () => this.renderTarotCard(),
      22: () => this.renderTodayOutfit(),
      95: () => this.renderMBTITest(),
      72: () => this.renderZodiacMatch(),
      96: () => this.renderRichLadyTest(),
      63: () => this.renderLoveLetterGenerator()
    };
    
    const handler = handlers[toolId];
    if (handler) {
      handler();
      this.openModal();
    }
  },
  
  // 打开工具弹窗
  openToolModal(toolId) {
    const tool = getToolById(toolId);
    if (!tool) return;
    
    this.currentTool = tool;
    
    // 检查是否是黄金工具
    const goldenToolIds = [81, 74, 22, 95, 72, 96, 63];
    if (goldenToolIds.includes(toolId)) {
      this.openGoldenTool(toolId);
      return;
    }
    
    // 普通工具显示信息
    this.openModal();
    document.getElementById("modal-tool-content").innerHTML = `
      <div class="modal-tool-header">
        <div class="modal-tool-icon">${tool.icon}</div>
        <h2 class="modal-tool-title">${tool.name}</h2>
        <p class="modal-tool-desc">${tool.desc}</p>
      </div>
      <div class="modal-tool-features">
        <h3>✨ 功能特点</h3>
        <ul>
          ${(tool.features || []).map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>
      <div class="modal-tool-status">
        <span class="status-badge ${tool.hot ? "hot" : "new"}">
          ${tool.hot ? "🔥 热门工具" : "✨ 精选工具"}
        </span>
        <span class="category-badge">${tool.category}</span>
      </div>
      <p style="text-align:center;color:var(--text-muted);margin-top:20px;font-size:13px;">
        该工具正在开发中，敬请期待！
      </p>
    `;
  },
  
  // 渲染经期记录
  renderMenstrualTracker() {
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="tracker" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">📅</div>
          <h2 class="tool-title">经期记录助手</h2>
          <p class="tool-desc">智能周期管理，精准预测排卵期和安全期</p>
        </div>
        
        <div class="tracker-stats">
          <div class="stat-card">
            <div class="stat-value" id="tracker-total">0</div>
            <div class="stat-label">总记录</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="tracker-streak">0</div>
            <div class="stat-label">连续打卡</div>
          </div>
        </div>
        
        <div class="tracker-form">
          <div class="tracker-field">
            <label>上一次经期开始日期</label>
            <input type="date" id="menstrual-last-date" value="">
          </div>
          <div class="tracker-field">
            <label>周期长度（天）</label>
            <input type="number" id="menstrual-cycle" value="28" min="20" max="45">
          </div>
          <div class="tracker-field">
            <label>经期持续天数</label>
            <input type="number" id="menstrual-period" value="5" min="2" max="15">
          </div>
          <button class="btn-checkin" onclick="window.Trackers['经期记录'].checkIn()">
            <span class="btn-icon">🔢</span>
            <span>计算</span>
          </button>
        </div>
        
        <div class="tracker-result" id="menstrual-result" style="display:none;">
          <div class="result-header">
            <span class="result-icon">📊</span>
            <span>计算结果</span>
          </div>
          <div class="result-content" id="menstrual-result-content"></div>
        </div>
      </div>
    `;
    
    this.updateTrackerStats(81);
  },
  
  // 渲染塔罗抽牌
  renderTarotCard() {
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="tarot" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">🃏</div>
          <h2 class="tool-title">塔罗每日抽牌</h2>
          <p class="tool-desc">每日抽取一张大阿卡那牌，获得专属指引</p>
        </div>
        
        <div class="tool-actions" style="margin-bottom:24px;">
          <button class="btn-generate" onclick="window.AITools['塔罗抽牌'].generate()">
            <span class="btn-icon">🔮</span>
            <span>抽取今日塔罗牌</span>
          </button>
        </div>
        
        <div class="tool-result" id="tarot-result" style="display:none;">
          <div class="result-header">
            <span class="result-icon">🎉</span>
            <span>抽牌结果</span>
          </div>
          <div id="tarot-card-display" style="text-align:center;margin:20px 0;"></div>
          <div id="tarot-detail-content"></div>
          <div class="result-actions">
            <button class="btn-copy" onclick="window.AITools['塔罗抽牌'].copy()">
              <span>📋</span> 复制
            </button>
            <button class="btn-share" onclick="window.AITools['塔罗抽牌'].share()">
              <span>🔗</span> 分享
            </button>
          </div>
        </div>
      </div>
      
      <style>
        .tarot-card-3d {
          perspective: 1000px;
          margin: 20px auto;
        }
        .card-front {
          background: linear-gradient(135deg, #2C3E50, #4CA1AF);
          color: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          animation: cardFlip 0.6s ease;
        }
        .card-front.reversed {
          background: linear-gradient(135deg, #4CA1AF, #2C3E50);
        }
        @keyframes cardFlip {
          0% { transform: rotateY(180deg); opacity: 0; }
          100% { transform: rotateY(0); opacity: 1; }
        }
        .card-symbol { font-size: 14px; margin-bottom: 10px; opacity: 0.8; }
        .card-svg-inner { width: 80px; height: 100px; margin: 10px auto; }
        .card-meaning { font-size: 16px; margin-top: 15px; line-height: 1.6; }
        .tarot-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
        .detail-item { background: rgba(255,117,143,0.08); padding: 12px; border-radius: 8px; text-align: center; }
        .detail-icon { font-size: 20px; display: block; margin-bottom: 4px; }
        .detail-label { font-size: 11px; color: var(--text-muted); }
        .detail-value { font-size: 14px; font-weight: 600; display: block; margin-top: 4px; }
        .daily-message, .card-advice { padding: 16px; border-radius: 12px; margin-top: 12px; }
        .daily-message { background: rgba(162,155,254,0.1); }
        .message-icon, .advice-icon { font-size: 18px; margin-bottom: 8px; }
        .message-text, .advice-text { font-size: 14px; line-height: 1.6; color: var(--text); }
        .card-advice { background: rgba(255,117,143,0.08); }
      </style>
    `;
  },
  
  // 渲染今日穿搭
  renderTodayOutfit() {
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="outfit" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">👗</div>
          <h2 class="tool-title">今日穿什么</h2>
          <p class="tool-desc">根据场景和温度，智能推荐每日穿搭</p>
        </div>
        
        <div class="tool-inputs">
          <div class="input-group">
            <label>穿搭场景</label>
            <select id="outfit-scenario">
              <option value="casual">日常出行</option>
              <option value="work">职场通勤</option>
              <option value="date">约会休闲</option>
              <option value="party">派对聚会</option>
            </select>
          </div>
          <div class="input-group">
            <label>今日温度 (°C)</label>
            <input type="number" id="outfit-temp" value="22" min="-20" max="45">
          </div>
        </div>
        
        <div class="tool-actions">
          <button class="btn-generate" onclick="window.AITools['今日穿什么'].generate()">
            <span class="btn-icon">👗</span>
            <span>生成穿搭</span>
          </button>
        </div>
        
        <div class="tool-result" id="outfit-result" style="display:none;">
          <div class="result-header">
            <span class="result-icon">👗</span>
            <span>穿搭推荐</span>
          </div>
          <div class="result-content" id="outfit-result-content"></div>
        </div>
      </div>
      
      <style>
        .outfit-header { text-align: center; margin-bottom: 20px; }
        .outfit-scenario { font-size: 14px; color: var(--primary); font-weight: 600; }
        .outfit-style { font-size: 20px; font-weight: 700; color: var(--text); margin-top: 4px; }
        .outfit-colors { margin-bottom: 20px; }
        .colors-label, .items-label, .tips-title { font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
        .color-swatches { display: flex; gap: 10px; justify-content: center; }
        .color-swatch { width: 50px; height: 50px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .items-list { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .item-tag { background: rgba(162,155,254,0.15); color: var(--secondary); padding: 8px 16px; border-radius: 20px; font-size: 13px; }
        .outfit-tips, .weather-note { padding: 16px; border-radius: 12px; margin-top: 16px; display: flex; gap: 12px; align-items: flex-start; }
        .outfit-tips { background: rgba(255,117,143,0.08); }
        .tips-icon, .weather-icon { font-size: 20px; flex-shrink: 0; }
        .tips-text, .weather-text { font-size: 14px; line-height: 1.6; }
        .weather-note { background: rgba(162,155,254,0.08); }
      </style>
    `;
  },
  
  // 渲染MBTI测试
  renderMBTITest() {
    const questions = mbtiTest.questions;
    
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="mbti" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">🧠</div>
          <h2 class="tool-title">MBTI性格测试</h2>
          <p class="tool-desc">8道精选题，测出你的性格类型和职业倾向</p>
        </div>
        
        <div class="quiz-progress" id="quiz-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="quiz-progress-bar" style="width:12.5%;"></div>
          </div>
          <span class="progress-text" id="quiz-progress-text">1/${questions.length}</span>
        </div>
        
        <div class="quiz-container" id="quiz-container">
          ${questions.map((q, qi) => `
            <div class="quiz-question ${qi === 0 ? "active" : ""}" data-question="${qi}">
              <div class="question-number">问题 ${qi + 1}/${questions.length}</div>
              <h3 class="question-text">${q.question}</h3>
              <div class="question-options">
                ${q.options.map((opt, oi) => `
                  <label class="quiz-option ${qi === 0 && oi === 0 ? "selected" : ""}" data-index="${qi}" data-value="${opt.value}">
                    <input type="radio" name="quiz-q-${qi}" value="${opt.value}" ${qi === 0 && oi === 0 ? "checked" : ""}>
                    <span class="option-marker">${String.fromCharCode(65 + oi)}</span>
                    <span class="option-text">${opt.text}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        
        <div class="quiz-result" id="quiz-result" style="display:none;"></div>
        
        <div class="tool-actions">
          <button class="btn-quiz" id="btn-quiz-action" onclick="window.QuizTools['MBTI测试'].nextQuestion()">
            <span>下一题</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
      
      <style>
        .mbti-result { text-align: center; padding: 24px; background: linear-gradient(135deg, rgba(255,117,143,0.1), rgba(162,155,254,0.1)); border-radius: 16px; margin-bottom: 20px; }
        .mbti-type { font-size: 48px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .mbti-name { font-size: 24px; font-weight: 700; color: var(--text); margin: 8px 0; }
        .mbti-traits { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
        .trait-tag { background: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; color: var(--primary); }
        .mbti-detail { display: grid; gap: 16px; }
        .detail-section { background: rgba(255,255,255,0.5); padding: 16px; border-radius: 12px; }
        .detail-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: var(--text); }
        .detail-content { display: flex; gap: 8px; flex-wrap: wrap; }
        .career-tag, .side-hustle-tag { background: rgba(162,155,254,0.15); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: var(--secondary); }
      </style>
    `;
  },
  
  // 渲染星座配对
  renderZodiacMatch() {
    const signs = zodiacMatch.signs;
    
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="zodiac" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">♊</div>
          <h2 class="tool-title">星座缘分配对</h2>
          <p class="tool-desc">144种星座组合，精准分析你们的缘分</p>
        </div>
        
        <div class="calc-fields">
          <div class="calc-field">
            <label>你的星座</label>
            <select id="zodiac-1">
              ${signs.map(s => `<option value="${s.name}">${s.symbol} ${s.name}</option>`).join("")}
            </select>
          </div>
          <div class="calc-field">
            <label>TA的星座</label>
            <select id="zodiac-2">
              ${signs.map(s => `<option value="${s.name}">${s.symbol} ${s.name}</option>`).join("")}
            </select>
          </div>
        </div>
        
        <div class="tool-actions">
          <button class="btn-calculate" onclick="window.Calculators['星座配对'].calculate()">
            <span class="btn-icon">💕</span>
            <span>开始配对</span>
          </button>
        </div>
        
        <div class="calc-result" id="zodiac-result" style="display:none;">
          <div class="result-header">
            <span class="result-icon">💘</span>
            <span>配对结果</span>
          </div>
          <div class="result-content" id="zodiac-result-content"></div>
        </div>
      </div>
      
      <style>
        .match-header { display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 24px; }
        .sign-box { text-align: center; }
        .sign-symbol { font-size: 48px; margin-bottom: 8px; }
        .sign-name { font-size: 14px; color: var(--text-light); }
        .match-heart { font-size: 32px; animation: pulse 1s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .match-score { text-align: center; margin-bottom: 20px; }
        .score-value { font-size: 56px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .score-label { font-size: 14px; color: var(--text-muted); }
        .score-stars { font-size: 20px; margin-top: 8px; }
        .match-desc { text-align: center; padding: 16px; background: rgba(255,117,143,0.08); border-radius: 12px; font-size: 14px; line-height: 1.6; margin-bottom: 16px; }
        .match-advice { padding: 16px; background: rgba(162,155,254,0.08); border-radius: 12px; display: flex; gap: 12px; }
        .advice-icon { font-size: 20px; flex-shrink: 0; }
        .advice-text { font-size: 14px; line-height: 1.6; }
      </style>
    `;
  },
  
  // 渲染富婆指数测试
  renderRichLadyTest() {
    const questions = richLadyTest.questions;
    
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="rich" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">💰</div>
          <h2 class="tool-title">富婆指数测试</h2>
          <p class="tool-desc">5道趣味题，测测你的搞钱潜力</p>
        </div>
        
        <div class="quiz-progress" id="rich-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="rich-progress-bar" style="width:20%;"></div>
          </div>
          <span class="progress-text" id="rich-progress-text">1/${questions.length}</span>
        </div>
        
        <div class="rich-quiz-container" id="rich-quiz-container">
          ${questions.map((q, qi) => `
            <div class="rich-question quiz-question ${qi === 0 ? "active" : ""}" data-question="${qi}">
              <div class="question-number">问题 ${qi + 1}/${questions.length}</div>
              <h3 class="question-text">${q.question}</h3>
              <div class="question-options">
                ${q.options.map((opt, oi) => `
                  <label class="quiz-option ${qi === 0 && oi === 0 ? "selected" : ""}" data-index="${qi}" data-value="${opt.value}">
                    <input type="radio" name="rich-q-${qi}" value="${opt.value}" ${qi === 0 && oi === 0 ? "checked" : ""}>
                    <span class="option-marker">${String.fromCharCode(65 + oi)}</span>
                    <span class="option-text">${opt.text}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        
        <div class="quiz-result" id="rich-result" style="display:none;"></div>
        
        <div class="tool-actions">
          <button class="btn-quiz" id="btn-rich-action" onclick="window.QuizTools['富婆指数测试'].nextQuestion()">
            <span>下一题</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
      
      <style>
        .rich-result { text-align: center; padding: 24px; background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(232,180,184,0.1)); border-radius: 16px; margin-bottom: 20px; }
        .rich-avatar { font-size: 64px; margin-bottom: 12px; }
        .rich-title { font-size: 24px; font-weight: 700; color: var(--text); }
        .rich-score { font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #f1c40f, #e8b4b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 8px 0; }
        .rich-percent { font-size: 14px; color: var(--text-muted); }
        .rich-desc { padding: 16px; background: rgba(255,255,255,0.5); border-radius: 12px; font-size: 14px; line-height: 1.6; margin-bottom: 16px; }
        .rich-tips, .rich-plan { margin-bottom: 16px; }
        .tips-title, .plan-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--text); }
        .tip-item { padding: 8px 12px; background: rgba(255,215,0,0.08); border-radius: 8px; font-size: 13px; margin-bottom: 8px; }
        .plan-item { display: flex; gap: 12px; padding: 12px; background: rgba(255,255,255,0.5); border-radius: 10px; margin-bottom: 8px; }
        .plan-step { width: 28px; height: 28px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .plan-action { font-size: 14px; font-weight: 600; color: var(--text); }
        .plan-detail { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
      </style>
    `;
  },
  
  // 渲染情书生成器
  renderLoveLetterGenerator() {
    document.getElementById("modal-tool-content").innerHTML = `
      <div data-tool="letter" class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">💌</div>
          <h2 class="tool-title">蜜语情书生成器</h2>
          <p class="tool-desc">AI写作，多种语气可选，一键复制</p>
        </div>
        
        <div class="tool-inputs">
          <div class="input-group">
            <label>称呼（TA的名字）</label>
            <input type="text" id="letter-name" placeholder="亲爱的">
          </div>
          <div class="input-group">
            <label>你的署名</label>
            <input type="text" id="letter-sender" placeholder="爱你的我">
          </div>
          <div class="input-group">
            <label>语气风格</label>
            <select id="letter-tone">
              <option value="sweet">💕 甜蜜型</option>
              <option value="elegant">📜 文艺型</option>
              <option value="playful">😜 俏皮型</option>
              <option value="passionate">❤️ 深情型</option>
            </select>
          </div>
          <div class="input-group">
            <label>特别的回忆（可选）</label>
            <textarea id="letter-memory" placeholder="写下你们之间特别的回忆..." rows="2"></textarea>
          </div>
        </div>
        
        <div class="tool-actions">
          <button class="btn-generate" onclick="window.AITools['情书生成'].generate()">
            <span class="btn-icon">💌</span>
            <span>生成情书</span>
          </button>
        </div>
        
        <div class="tool-result" id="letter-result" style="display:none;">
          <div class="result-header">
            <span class="result-icon">💝</span>
            <span>情书内容</span>
          </div>
          <div id="letter-content"></div>
          <div class="result-actions">
            <button class="btn-copy" onclick="window.AITools['情书生成'].copy()">
              <span>📋</span> 一键复制
            </button>
            <button class="btn-share" onclick="window.AITools['情书生成'].share()">
              <span>🔗</span> 分享
            </button>
          </div>
        </div>
      </div>
      
      <style>
        .letter-paper { background: linear-gradient(to bottom, #fff9f0, #fff5eb); padding: 24px; border-radius: 8px; border: 1px solid #f5e6d3; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .letter-text { font-family: 'Georgia', serif; font-size: 14px; line-height: 2; color: #4a4a4a; white-space: pre-wrap; margin: 0; }
        .letter-meta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .meta-tag { background: rgba(255,117,143,0.1); color: var(--primary); padding: 6px 14px; border-radius: 20px; font-size: 12px; }
      </style>
    `;
  },
  
  // 打开Modal
  openModal() {
    document.getElementById("toolModal").classList.add("open");
    document.body.style.overflow = "hidden";
  },
  
  // 关闭Modal
  closeModal() {
    document.getElementById("toolModal").classList.remove("open");
    document.body.style.overflow = "";
    this.currentTool = null;
  },
  
  // 搜索处理
  handleSearch(query) {
    const container = document.getElementById("tab-home");
    if (!container) return;
    
    const q = query.toLowerCase().trim();
    
    if (!q) {
      this.renderAllTools();
      return;
    }
    
    const results = searchTools(q);
    
    container.innerHTML = `
      <div class="section">
        <div class="section-header">
          <h2>🔍 搜索结果</h2>
          <span style="color:var(--text-muted);font-size:14px;">找到 ${results.length} 个相关工具</span>
        </div>
        ${results.length > 0 ? `
          <div class="tool-grid">
            ${results.map(tool => this.renderToolCard(tool)).join("")}
          </div>
        ` : `
          <div style="text-align:center;padding:60px 20px;">
            <div style="font-size:64px;margin-bottom:16px;">🔍</div>
            <h3 style="font-size:20px;margin-bottom:8px;">没有找到相关工具</h3>
            <p style="color:var(--text-light);">试试搜索：颜值、穿搭、减肥、星座、MBTI...</p>
          </div>
        `}
      </div>
    `;
  }
};

// 导出应用
export default App;
