// ===== 通用辅助函数 =====
export const utils = {
  debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle(fn, delay = 300) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  },

  deepClone(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch (e) { return obj; }
  },

  formatNum(num, decimals = 1) {
    if (typeof num !== "number" || isNaN(num)) return "0";
    return num.toFixed(decimals);
  },

  copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0;";
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve(result);
  },

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export const errors = {
  _errors: {},
  set(key, msg) { this._errors[key] = msg; this._update(); },
  clear(key) { delete this._errors[key]; this._update(); },
  clearAll() { this._errors = {}; this._update(); },
  has() { return Object.keys(this._errors).length > 0; },
  get(key) { return this._errors[key] || null; },
  _update() {
    window.dispatchEvent(new CustomEvent("errorUpdate", { detail: { errors: this._errors } }));
  }
};

export const loading = {
  _states: {},
  start(key = "default") { this._states[key] = true; this._update(); },
  end(key = "default") { this._states[key] = false; this._update(); },
  is(key = "default") { return !!this._states[key]; },
  _update() {
    window.dispatchEvent(new CustomEvent("loadingUpdate", { detail: { states: this._states } }));
  }
};

export default utils;
