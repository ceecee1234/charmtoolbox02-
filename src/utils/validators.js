// ===== 输入验证器模块 =====
export const validators = {
  required(value, fieldName = "字段") {
    if (value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "")) {
      return { valid: false, message: fieldName + "不能为空" };
    }
    return { valid: true };
  },

  number(value, fieldName = "数值") {
    if (value === null || value === undefined || value === "") {
      return { valid: false, message: fieldName + "不能为空" };
    }
    const num = Number(value);
    if (isNaN(num)) return { valid: false, message: fieldName + "必须是有效数字" };
    return { valid: true, value: num };
  },

  range(value, min, max, fieldName = "数值") {
    const result = this.number(value, fieldName);
    if (!result.valid) return result;
    if (result.value < min || result.value > max) {
      return { valid: false, message: fieldName + "必须在" + min + "到" + max + "之间" };
    }
    return result;
  },

  positiveInt(value, fieldName = "数值") {
    const result = this.number(value, fieldName);
    if (!result.valid) return result;
    if (!Number.isInteger(result.value) || result.value <= 0) {
      return { valid: false, message: fieldName + "必须是正整数" };
    }
    return result;
  },

  phone(value) {
    if (!value) return { valid: false, message: "手机号不能为空" };
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return { valid: false, message: "请输入有效的手机号码" };
    }
    return { valid: true };
  },

  email(value) {
    if (!value) return { valid: false, message: "邮箱不能为空" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { valid: false, message: "请输入有效的邮箱地址" };
    }
    return { valid: true };
  },

  height(value) { return this.range(value, 50, 250, "身高"); },
  weight(value) { return this.range(value, 20, 300, "体重"); },
  age(value) { return this.range(value, 1, 150, "年龄"); },
  bmi(value) { return this.range(value, 10, 60, "BMI"); },
  bodyFat(value) { return this.range(value, 1, 60, "体脂率"); },

  date(value, fieldName = "日期") {
    if (!value) return { valid: false, message: fieldName + "不能为空" };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { valid: false, message: "请输入有效的" + fieldName };
    return { valid: true, value: d };
  },

  name(value) {
    if (!value) return { valid: false, message: "姓名不能为空" };
    if (value.length < 2 || value.length > 20) {
      return { valid: false, message: "姓名长度必须在2-20个字符之间" };
    }
    return { valid: true };
  },

  validate(data, rules) {
    const errors = {};
    for (const [field, rule] of Object.entries(rules)) {
      const result = rule(data[field]);
      if (!result.valid) errors[field] = result.message;
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }
};

export const healthCalc = {
  calcBMI(weight, height) {
    const h = height / 100;
    return weight / (h * h);
  },

  getBMICategory(bmi) {
    if (bmi < 18.5) return { category: "偏瘦", color: "#3498db", advice: "建议适当增重，保持营养均衡" };
    if (bmi < 24) return { category: "正常", color: "#27ae60", advice: "继续保持健康的生活方式" };
    if (bmi < 28) return { category: "偏胖", color: "#f39c12", advice: "建议适当控制饮食，加强运动" };
    return { category: "肥胖", color: "#e74c3c", advice: "建议咨询医生，制定科学的减重计划" };
  },

  calcBodyFat(weight, height, age, gender) {
    const bmi = this.calcBMI(weight, height);
    if (gender === "male") return (1.20 * bmi) + (0.23 * age) - 16.2;
    return (1.20 * bmi) + (0.23 * age) - 5.4;
  },

  getBodyFatCategory(fat, gender) {
    if (gender === "male") {
      if (fat < 10) return { category: "过低", color: "#3498db" };
      if (fat < 20) return { category: "标准", color: "#27ae60" };
      if (fat < 25) return { category: "偏高", color: "#f39c12" };
      return { category: "过高", color: "#e74c3c" };
    } else {
      if (fat < 18) return { category: "过低", color: "#3498db" };
      if (fat < 28) return { category: "标准", color: "#27ae60" };
      if (fat < 33) return { category: "偏高", color: "#f39c12" };
      return { category: "过高", color: "#e74c3c" };
    }
  },

  calcBMR(weight, height, age, gender) {
    if (gender === "male") return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  },

  calcDailyCalories(bmr, activityLevel = 1.2) {
    return Math.round(bmr * activityLevel);
  }
};

export default validators;
