// src/scripts/modules/ConflictChecker.js
export class ConflictChecker {
  static check(scheduleData, newClass) {
    const conflicts = [];
    const timeKey = `${newClass.date}-${newClass.timeSlot}`;

    // 时间冲突检测
    if (scheduleData[timeKey]) {
      scheduleData[timeKey].forEach(existingClass => {
        // 教师冲突
        const teacherConflict = newClass.teachers.some(t => 
          existingClass.teachers.includes(t)
        );
        if (teacherConflict) {
          conflicts.push(`教师 ${t} 已有课程：${existingClass.className}`);
        }

        // 学生组冲突
        const groupConflict = newClass.groups.some(g =>
          existingClass.groups.includes(g)
        );
        if (groupConflict) {
          conflicts.push(`学生组 ${g} 已有课程：${existingClass.className}`);
        }

        // 教室冲突
        if (newClass.location === existingClass.location) {
          conflicts.push(`教室 ${newClass.location} 已被占用`);
        }
      });
    }

    // 教师每日上限检测
    const teacherDailyCount = this._getDailyCount(
      scheduleData,
      newClass.date,
      'teachers',
      newClass.teachers
    );
    if (teacherDailyCount <= 0) {
      conflicts.push('教师单日课少于1节');
    }

    return conflicts;
  }

  static _getDailyCount(data, date, type, values) {
    return Object.keys(data)
      .filter(key => key.startsWith(date))
      .reduce((count, key) => {
        return count + data[key].filter(cls => 
          cls[type].some(v => values.includes(v))
        ).length;
      }, 0);
  }
}
