// src/scripts/modules/ScheduleManager.js
export class ScheduleManager {
  constructor() {
    this._loadFromStorage();
  }

  // 数据加载
  _loadFromStorage() {
    this.schedule = JSON.parse(localStorage.getItem('schedule') || '{}');
    this.teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    this.groups = JSON.parse(localStorage.getItem('groups') || '[]');

    const savedDate = localStorage.getItem('currentDate');

    // 有效日期检查
    if (savedDate) {
      const parsedDate = new Date(savedDate);
      this._currentDate = isNaN(parsedDate) ? new Date() : parsedDate;
    } else {
      this._currentDate = new Date(); // 默认当前日期
    }

    // 强制存储有效日期
    this._save('currentDate');
  }
  _save(type) {
    if (type === 'currentDate') {
      localStorage.setItem(type, this._currentDate.toISOString());
    } else {
      localStorage.setItem(type, JSON.stringify(this[type]));
    }
  }



  // 添加课程
  addSchedule({ day, time, teachers, groups, location, className }) {
    const date = this._calculateDate(day);
    const key = `${date}-${time}`;

    if (!this.schedule[key]) {
      this.schedule[key] = [];
    }

    this.schedule[key].push({
      teachers,
      groups,
      location,
      className,
      created: new Date().toISOString()
    });

    this._save('schedule');
    return true;
  }

  // 删除课程
  removeSchedule(key, index) {
    if (this.schedule[key]?.[index]) {
      this.schedule[key].splice(index, 1);
      if (this.schedule[key].length === 0) {
        delete this.schedule[key];
      }
      this._save('schedule');
      return true;
    }
    return false;
  }

  addTeacher(name) {
    if (!this.teachers.includes(name)) {
      this.teachers.push(name);
      this._save('teachers');
      this._notifyUpdate();
      return true;
    }
    return false;
  }

  removeTeacher(name) {
    this.teachers = this.teachers.filter(t => t !== name);
    this._save('teachers');
  }

  // 学生组管理
  addGroup(name) {
    if (!this.groups.includes(name)) {
      console.log(name);
      this.groups.push(name);
      this._save('groups');
      this._notifyUpdate();
      return true;
    }
    return false;
  }

  removeGroup(name) {
    this.groups = this.groups.filter(g => g !== name);
    this._save('groups');
  }

  _observers = [];
  
  subscribe(observer) {
    this._observers.push(observer);
  }
  
  _notifyUpdate() {
    this._observers.forEach(obs => obs());
  }

  // 日期计算
  _calculateDate(day) {
    const date = new Date(this.currentDate);
    const currentDay = date.getDay() || 7; // 周日转为7
    date.setDate(date.getDate() + (day - currentDay));
    return date.toISOString().split('T')[0];
  }

  // 保存到本地存储
  _save(type) {
    localStorage.setItem(type, JSON.stringify(this[type]));
  }
}
