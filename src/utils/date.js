// ===== 日期时间工具模块 =====
export const dateUtils = {
  formatDate(date, fmt = "YYYY-MM-DD") {
    try {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hour = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      const sec = String(d.getSeconds()).padStart(2, "0");
      return fmt
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day)
        .replace("HH", hour)
        .replace("mm", min)
        .replace("ss", sec);
    } catch (e) {
      return "";
    }
  },

  getToday() {
    return this.formatDate(new Date(), "YYYY-MM-DD");
  },

  getDaysDiff(d1, d2) {
    try {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      const diff = Math.abs(date2 - date1);
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 0;
    }
  },

  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  getWeekday(date = new Date()) {
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    try {
      const d = date instanceof Date ? date : new Date(date);
      return weekdays[d.getDay()];
    } catch (e) {
      return "";
    }
  },

  getMonthName(date = new Date()) {
    const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    try {
      const d = date instanceof Date ? date : new Date(date);
      return months[d.getMonth()];
    } catch (e) {
      return "";
    }
  },

  getLunarDate() {
    // Simplified lunar date (for display purposes)
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  }
};

export default dateUtils;
