// ===== LocalStorage 封装模块 =====
const PREFIX = "charmbox_";

export const storage = {
  get(key, defaultVal = null) {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (item === null) return defaultVal;
      const parsed = JSON.parse(item);
      if (parsed && parsed._expires && Date.now() > parsed._expires) {
        this.remove(key);
        return defaultVal;
      }
      return parsed && parsed._value !== undefined ? parsed._value : parsed;
    } catch (e) {
      return defaultVal;
    }
  },

  set(key, value, expiresIn = null) {
    try {
      const item = { _value: value };
      if (expiresIn) item._expires = Date.now() + expiresIn;
      localStorage.setItem(PREFIX + key, JSON.stringify(item));
      return true;
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        this.clearOld();
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify({ _value: value }));
          return true;
        } catch (e2) {
          return false;
        }
      }
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(PREFIX)) localStorage.removeItem(k);
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  clearOld(maxItems = 50) {
    try {
      const records = this.getAllRecords();
      if (records.length <= maxItems) return;
      records.slice(0, records.length - maxItems).forEach(r => this.remove(r.key));
    } catch (e) { /* ignore */ }
  },

  getAllRecords() {
    try {
      const records = [];
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(PREFIX)) {
          const raw = localStorage.getItem(k);
          try {
            records.push({
              key: k.replace(PREFIX, ""),
              timestamp: JSON.parse(raw)._expires || 0
            });
          } catch (e) { /* skip */ }
        }
      });
      return records.sort((a, b) => a.timestamp - b.timestamp);
    } catch (e) {
      return [];
    }
  }
};

export const tracker = {
  add(toolId, data) {
    try {
      const key = "tracker_" + toolId;
      const records = storage.get(key, []);
      const record = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...data,
        createdAt: Date.now()
      };
      records.push(record);
      storage.set(key, records);
      return record;
    } catch (e) {
      return null;
    }
  },

  get(toolId, limit = 30) {
    try {
      const key = "tracker_" + toolId;
      const records = storage.get(key, []);
      return records.slice(-limit).reverse();
    } catch (e) {
      return [];
    }
  },

  remove(toolId, recordId) {
    try {
      const key = "tracker_" + toolId;
      const records = storage.get(key, []);
      storage.set(key, records.filter(r => r.id !== recordId));
      return true;
    } catch (e) {
      return false;
    }
  },

  getStats(toolId) {
    try {
      const records = storage.get("tracker_" + toolId, []);
      return {
        total: records.length,
        firstDate: records.length > 0 ? records[0].date : null,
        lastDate: records.length > 0 ? records[records.length - 1].date : null,
        streak: this.calcStreak(records)
      };
    } catch (e) {
      return { total: 0, firstDate: null, lastDate: null, streak: 0 };
    }
  },

  calcStreak(records) {
    if (!records || records.length === 0) return 0;
    const dates = [...new Set(records.map(r => r.date))].sort().reverse();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (dates[0] !== today && dates[0] !== yesterday) return 0;
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }
};

export default storage;
