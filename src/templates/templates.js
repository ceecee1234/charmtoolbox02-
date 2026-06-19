// ===== 交互模板组件库 =====
// 所有中文内容均使用字符串包裹

import { utils } from "../utils/helpers.js";
import { loading } from "../utils/helpers.js";
import { errors } from "../utils/helpers.js";

// ===== 模板1: AI生成器 =====
export function renderAIGenerator(config) {
  const { 
    title, 
    icon, 
    description,
    inputs = [],
    generateFn,
    templates = [],
    placeholder = "请输入你的想法..."
  } = config;

  return `
    <div class="tool-container" data-tool="ai_generator">
      <div class="tool-header">
        <div class="tool-icon">${icon}</div>
        <h2 class="tool-title">${title}</h2>
        <p class="tool-desc">${description}</p>
      </div>
      
      <div class="tool-inputs">
        ${inputs.map(function(input, i) {
          return `
            <div class="input-group">
              <label for="ai-input-${i}">${input.label}</label>
              ${input.type === "textarea" 
                ? `<textarea id="ai-input-${i}" placeholder="${input.placeholder || ""}" rows="3"></textarea>`
                : `<input type="${input.type || "text"}" id="ai-input-${i}" placeholder="${input.placeholder || ""}" ${input.min ? 'min="' + input.min + '"' : ""} ${input.max ? 'max="' + input.max + '"' : ""}>`
              }
            </div>
          `;
        }).join("")}
        
        <div class="input-group">
          <textarea id="ai-main-input" placeholder="${placeholder}" rows="4"></textarea>
        </div>
      </div>
      
      <div class="tool-actions">
        <button class="btn-generate" onclick="window.AITools['${title}'].generate()">
          <span class="btn-icon">✨</span>
          <span>生成结果</span>
        </button>
        <button class="btn-reset" onclick="window.AITools['${title}'].reset()">
          <span>重置</span>
        </button>
      </div>
      
      <div class="tool-result" id="ai-result-${title.replace(/\s/g, "-")}" style="display:none;">
        <div class="result-header">
          <span class="result-icon">🎉</span>
          <span>生成结果</span>
        </div>
        <div class="result-content" id="ai-result-content"></div>
        <div class="result-actions">
          <button class="btn-copy" onclick="window.AITools['${title}'].copy()">
            <span>📋</span> 复制
          </button>
          <button class="btn-share" onclick="window.AITools['${title}'].share()">
            <span>🔗</span> 分享
          </button>
        </div>
      </div>
      
      <div class="tool-loading" id="ai-loading-${title.replace(/\s/g, "-")}" style="display:none;">
        <div class="loading-spinner"></div>
        <p>正在生成中...</p>
      </div>
    </div>
  `;
}

// ===== 模板2: 计算器 =====
export function renderCalculator(config) {
  const {
    title,
    icon,
    description,
    fields = [],
    calculateFn,
    resultTemplate
  } = config;

  const fieldsHTML = fields.map(function(field, i) {
    let inputHTML = "";
    switch(field.type) {
      case "select":
        inputHTML = `
          <select id="calc-field-${i}">
            ${field.options.map(function(opt) {
              return `<option value="${opt.value}">${opt.label}</option>`;
            }).join("")}
          </select>
        `;
        break;
      case "radio":
        inputHTML = field.options.map(function(opt) {
          return `
            <label class="radio-label">
              <input type="radio" name="calc-radio-${i}" value="${opt.value}">
              <span>${opt.label}</span>
            </label>
          `;
        }).join("");
        break;
      case "range":
        inputHTML = `
          <input type="range" id="calc-field-${i}" min="${field.min}" max="${field.max}" value="${field.default || field.min}">
          <span class="range-value" id="calc-range-val-${i}">${field.default || field.min}</span>
        `;
        break;
      default:
        inputHTML = `
          <input type="${field.type || "number"}" id="calc-field-${i}" 
            placeholder="${field.placeholder || ""}"
            ${field.min !== undefined ? 'min="' + field.min + '"' : ""}
            ${field.max !== undefined ? 'max="' + field.max + '"' : ""}>
        `;
    }
    return `
      <div class="calc-field">
        <label>${field.label}</label>
        ${inputHTML}
        ${field.unit ? `<span class="field-unit">${field.unit}</span>` : ""}
      </div>
    `;
  }).join("");

  return `
    <div class="tool-container" data-tool="calculator">
      <div class="tool-header">
        <div class="tool-icon">${icon}</div>
        <h2 class="tool-title">${title}</h2>
        <p class="tool-desc">${description}</p>
      </div>
      
      <div class="calc-fields">
        ${fieldsHTML}
      </div>
      
      <div class="tool-actions">
        <button class="btn-calculate" onclick="window.Calculators['${title}'].calculate()">
          <span class="btn-icon">🔢</span>
          <span>开始计算</span>
        </button>
      </div>
      
      <div class="calc-result" id="calc-result-${title.replace(/\s/g, "-")}" style="display:none;">
        <div class="result-header">
          <span class="result-icon">📊</span>
          <span>计算结果</span>
        </div>
        <div class="result-content" id="calc-result-content"></div>
      </div>
    </div>
  `;
}

// ===== 模板3: 趣味测试/占卜 =====
export function renderQuizDivination(config) {
  const {
    title,
    icon,
    description,
    questions = [],
    calculateFn,
    resultFn
  } = config;

  const questionsHTML = questions.map(function(q, qi) {
    const optionsHTML = q.options.map(function(opt, oi) {
      return `
        <label class="quiz-option" data-index="${qi}" data-value="${opt.value}">
          <input type="radio" name="quiz-q-${qi}" value="${opt.value}" ${qi === 0 && oi === 0 ? "checked" : ""}>
          <span class="option-marker">${String.fromCharCode(65 + oi)}</span>
          <span class="option-text">${opt.text}</span>
        </label>
      `;
    }).join("");

    return `
      <div class="quiz-question" data-question="${qi}">
        <div class="question-number">问题 ${qi + 1}/${questions.length}</div>
        <h3 class="question-text">${q.question}</h3>
        <div class="question-options">${optionsHTML}</div>
      </div>
    `;
  }).join("");

  return `
    <div class="tool-container" data-tool="quiz_divination">
      <div class="tool-header">
        <div class="tool-icon">${icon}</div>
        <h2 class="tool-title">${title}</h2>
        <p class="tool-desc">${description}</p>
      </div>
      
      <div class="quiz-progress" id="quiz-progress">
        <div class="progress-bar" id="quiz-progress-bar"></div>
        <span class="progress-text" id="quiz-progress-text">1/${questions.length}</span>
      </div>
      
      <div class="quiz-container" id="quiz-container">
        ${questionsHTML}
      </div>
      
      <div class="quiz-result" id="quiz-result" style="display:none;">
        <div class="result-header">
          <span class="result-icon">🎯</span>
          <span>测试结果</span>
        </div>
        <div class="result-content" id="quiz-result-content"></div>
      </div>
      
      <div class="tool-actions">
        <button class="btn-quiz" id="btn-quiz-action" onclick="window.QuizTools['${title}'].nextQuestion()">
          <span>下一题</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  `;
}

// ===== 模板4: 打卡记录 =====
export function renderTracker(config) {
  const {
    title,
    icon,
    description,
    fields = [],
    saveFn,
    historyFn
  } = config;

  const fieldsHTML = fields.map(function(field, i) {
    return `
      <div class="tracker-field">
        <label for="tracker-field-${i}">${field.label}</label>
        ${field.type === "select" 
          ? `<select id="tracker-field-${i}">${field.options.map(function(o) {
              return `<option value="${o.value}">${o.label}</option>`;
            }).join("")}</select>`
          : `<input type="${field.type || "text"}" id="tracker-field-${i}" 
              placeholder="${field.placeholder || ""}"
              ${field.min ? 'min="' + field.min + '"' : ""}
              ${field.max ? 'max="' + field.max + '"' : ""}>`
        }
      </div>
    `;
  }).join("");

  return `
    <div class="tool-container" data-tool="tracker">
      <div class="tool-header">
        <div class="tool-icon">${icon}</div>
        <h2 class="tool-title">${title}</h2>
        <p class="tool-desc">${description}</p>
      </div>
      
      <div class="tracker-stats" id="tracker-stats">
        <div class="stat-card">
          <div class="stat-value" id="tracker-total">0</div>
          <div class="stat-label">总打卡</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="tracker-streak">0</div>
          <div class="stat-label">连续天数</div>
        </div>
      </div>
      
      <div class="tracker-form">
        ${fieldsHTML}
        <button class="btn-checkin" onclick="window.Trackers['${title}'].checkIn()">
          <span class="btn-icon">✓</span>
          <span>打卡</span>
        </button>
      </div>
      
      <div class="tracker-history" id="tracker-history">
        <h3 class="history-title">📝 打卡记录</h3>
        <div class="history-list" id="history-list">
          <p class="empty-state">暂无打卡记录，开始你的第一次打卡吧！</p>
        </div>
      </div>
    </div>
  `;
}

// ===== 卡片渲染模板 =====
export function renderToolCard(tool, options = {}) {
  const { showCategory = false } = options;
  
  return `
    <div class="tool-card" data-tool-id="${tool.id}" data-tool-type="${tool.type || "default"}">
      ${tool.hot ? '<span class="hot-tag">🔥</span>' : ""}
      <div class="card-icon">${tool.icon}</div>
      <div class="card-name">${tool.name}</div>
      <div class="card-desc">${tool.desc}</div>
      ${showCategory ? `<div class="card-category">${tool.catIcon || ""} ${tool.category || ""}</div>` : ""}
      <div class="card-footer">
        ${(tool.features || []).slice(0, 2).map(function(f) {
          return `<span class="feature-tag">${f}</span>`;
        }).join("")}
      </div>
    </div>
  `;
}

// ===== Toast 提示组件 =====
export function showToast(message, type = "success", duration = 3000) {
  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <span class="toast-message">${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // 动画
  requestAnimationFrame(function() {
    toast.classList.add("show");
  });
  
  setTimeout(function() {
    toast.classList.remove("show");
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

export default {
  renderAIGenerator,
  renderCalculator,
  renderQuizDivination,
  renderTracker,
  renderToolCard,
  showToast
};
