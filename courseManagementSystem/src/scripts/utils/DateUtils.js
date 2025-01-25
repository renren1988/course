// src/scripts/utils/DateUtils.js
export class DateUtils {
  static formatDate(date, separator = '-') {
    // 强化类型检查
    if (!date || !(date instanceof Date) || isNaN(date)) {
      console.error('无效日期:', date);
      return this._getFallbackDate(separator);
    }
    
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${separator}${month}${separator}${day}`;
    } catch (error) {
      console.error('日期格式化失败:', error);
      return this._getFallbackDate(separator);
    }
  }

  static _getFallbackDate(separator) {
    const d = new Date();
    return `${d.getFullYear()}${separator}${String(d.getMonth()+1).padStart(2,'0')}${separator}${String(d.getDate()).padStart(2,'0')}`;
  }

  static getWeekRange(baseDate = new Date()) {
    // 确保基准日期有效
    let validDate;
    if (baseDate instanceof Date && !isNaN(baseDate)) {
      validDate = baseDate;
    } else {
      console.warn('收到无效基准日期，使用当前日期替代:', baseDate);
      validDate = new Date();
    }

    // 克隆日期对象避免污染原值
    const start = new Date(validDate);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // 周一作为周首日
    
    // 生成周日期数组
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });

    return {
      start: days[0],
      end: days[6],
      days
    };
  }
}