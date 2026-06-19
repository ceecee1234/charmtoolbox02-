// ===== 算法生成器模块 =====
export const generators = {
  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  },

  getDateSeed(dateStr = null) {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },

  shuffle(array, seed = null) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = seed !== null
        ? Math.floor(this.seededRandom(seed + i) * (i + 1))
        : Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  pick(array, count = 1, seed = null) {
    const shuffled = seed !== null ? this.shuffle(array, seed) : this.shuffle(array);
    return count === 1 ? shuffled[0] : shuffled.slice(0, count);
  },

  getDailyIndex(max, dateStr = null) {
    return Math.floor(this.seededRandom(this.getDateSeed(dateStr)) * max);
  },

  pickDaily(array, dateStr = null) {
    if (!array || array.length === 0) return null;
    return array[this.getDailyIndex(array.length, dateStr)];
  },

  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
};

export const aiSim = {
  async delay(min = 800, max = 2500) {
    return new Promise(resolve => setTimeout(resolve, min + Math.random() * (max - min)));
  },

  async generate(prompt, templates = []) {
    await this.delay();
    if (templates.length === 0) return "结果生成中，请稍候...";
    return generators.pickDaily(templates);
  },

  async score(min = 0, max = 100) {
    await this.delay(500, 1500);
    return Math.floor(min + Math.random() * (max - min + 1));
  }
};

export default generators;
