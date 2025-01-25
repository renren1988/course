// src/scripts/modules/UIManager.js
import { DateUtils } from '../utils/DateUtils.js';
import { ConflictChecker } from './ConflictChecker.js';

export class UIManager {
  constructor(scheduleManager) {
    this.sm = scheduleManager;
    this.sm.subscribe(() => {
      this._renderTeacherList();
      this._renderGroupList();
    });
    this.selectedTeachers = new Set();
    this.selectedGroups = new Set();
  }

  init() {
    this._handlePrevWeek = this._handlePrevWeek.bind(this);
    this._handleNextWeek = this._handleNextWeek.bind(this);
    this._bindManagementEvents();
    this._renderTeacherList();
    this._renderGroupList();
    this._loadData();    
    this._bindEvents();
    this._initDateLabels();
    this._updateAll();
  }

  _bindManagementEvents() {
    // 添加教师
    const addTeacherBtn = document.getElementById('addTeacherBtn');
    if (!addTeacherBtn) {
      console.error('addTeacherBtn not found');
      return;
    }
    addTeacherBtn.addEventListener('click', () => {
      const name = document.getElementById('newTeacherName').value.trim();
      if (name == '') {
        alert('请输入教师姓名');
        return;
      }
      let isnotexist = this.sm.addTeacher(name);
      if (!isnotexist) {
        alert('该教师已经存在');
        return;
      }
      this._renderTeacherList();
      document.getElementById('newTeacherName').value = '';
    });

    // 删除教师
    document.getElementById('teacherManageList').addEventListener('click', e => {
      if (e.target.classList.contains('delete-btn')) {
        const teacher = e.target.closest('.manage-item').dataset.teacher;
        this.sm.removeTeacher(teacher);
        this._renderTeacherList();
      }
    });

    // 添加学生组
    document.getElementById('addGroupBtn').addEventListener('click', () => {
      const newGroupName = document.getElementById('newGroupName').value.trim();
      if (newGroupName == '') {
        alert('请输入学生组姓名');
        return;
      }
      let isnotexist = this.sm.addGroup(newGroupName);
      if (!isnotexist) {
        alert('该学生组已经存在');
        return;
      }
      console.log('添加成功');
      this._renderGroupList();
      document.getElementById('newGroupName').value = '';
    });

    // 删除学生组
    document.getElementById('groupManageList').addEventListener('click', e => {
      if (e.target.classList.contains('delete-btn')) {
        const group = e.target.closest('.manage-item').dataset.group;
        this.sm.removeGroup(group);
        this._renderGroupList();
      }
    });
  }

  // 渲染添加新教师时的教师列表
  _renderTeacherList() {
    const container = document.getElementById('teacherManageList');
    container.innerHTML = this.sm.teachers.map(teacher => `
      <div class="manage-item" data-teacher="${teacher}">
        <span>${teacher}</span>
        <button class="delete-btn">删除</button>
      </div>
    `).join('');
  }

  //渲染排课时的教师列表

  _toggleTeacherSelection(element) {
    const teacher = element.dataset.teacher;
    element.classList.toggle('selected');

    if (this.selectedTeachers.has(teacher)) {
      this.selectedTeachers.delete(teacher);
    } else {
      this.selectedTeachers.add(teacher);
    }

    console.log('当前选择教师:', Array.from(this.selectedTeachers));
  }

  // 渲染学生组列表
  _renderGroupList() {
    const container = document.getElementById('groupManageList');
    container.innerHTML = this.sm.groups.map(group => `
      <div class="manage-item" data-group="${group}">
        <span>${group}</span>
        <button class="delete-btn">删除</button>
      </div>
    `).join('');
  }

  _toggleGroupSelection(element) {
    const group = element.dataset.group;
    element.classList.toggle('selected');

    if (this.selectedGroups.has(group)) {
      this.selectedGroups.delete(group);
    }
    console.log('当前选择学生组:', Array.from(this.selectedGroups));
  }

  _loadData() {
    const teacherList = document.getElementById('teacherList');
    const groupList = document.getElementById('groupList');

    // 重置选择框
    teacherList.innerHTML = '';
    groupList.innerHTML = '';

    // 添加教师选项
    teachers.forEach(teacher => {
      const div = document.createElement('div');
      div.className = 'teacher-item';
      div.textContent = teacher;
      div.onclick = () => toggleTeacher(teacher, div);
      teacherList.appendChild(div);
    });
    console.log(teacherList);

    // 添加学生组选项
    groups.forEach(group => {
      const div = document.createElement('div');
      div.className = 'teacher-item';  // 复用教师选择的样式
      div.textContent = group;
      div.onclick = () => toggleGroup(group, div);
      groupList.appendChild(div);
    });
  }

  _initDateLabels() {
    const weekDays = DateUtils.getWeekRange(this.sm.currentDate).days;
    document.querySelectorAll('.date-label').forEach((label, index) => {
      label.textContent = DateUtils.formatDate(weekDays[index], '/');
    });
  }

  _updateDateLabels() {
    const weekDays = DateUtils.getWeekRange(this.sm.currentDate).days;
    document.querySelectorAll('.date-label').forEach((label, index) => {
      label.textContent = DateUtils.formatDate(weekDays[index], '/');
    });
  }

  _bindEvents() {
    //周次切换
    document.getElementById('prevWeekBtn').addEventListener('click', this._handlePrevWeek);
    document.getElementById('nextWeekBtn').addEventListener('click', this._handleNextWeek);

    // 教师选择
    document.getElementById('teacherList').addEventListener('click', e => {
      const teacher = e.target.dataset.teacher;
      if (teacher) this._toggleSelection(teacher, 'teachers', e.target);
    });

    // 学生组选择
    document.getElementById('groupList').addEventListener('click', e => {
      const group = e.target.dataset.group;
      if (group) this._toggleSelection(group, 'groups', e.target);
    });

    // 表单提交
    document.getElementById('addScheduleBtn').addEventListener('click', () => {
      const classData = this._getFormData();
      if (!classData) return;

      const conflicts = ConflictChecker.check(this.sm.schedule, classData);
      if (conflicts.length > 0) {
        this.showError('课程冲突：' + conflicts.join(','));
        return;
      }

      if (this.sm.addSchedule(classData)) {
        this.updateScheduleTable();
        this._clearForm();
      }
    });
  }

  _handlePrevWeek() {
    this.sm.currentDate = DateUtils.addDays(this.sm.currentDate, -7);
    this.updateAll();
  }

  _handleNextWeek() {
    this.sm.currentDate = DateUtils.addDays(this.sm.currentDate, 7);
    this.updateAll();
  }

  _updateAll() {
    this._updateDateLabels();
    this.updateScheduleTable();
    this._updateWeekDisplay();
  }

  updateScheduleTable() {
    const weekDays = DateUtils.getWeekRange(this.sm.currentDate).days;

    document.querySelectorAll('#scheduleBody td').forEach(td => {
      td.innerHTML = '';
      const day = td.dataset.day;
      const time = td.closest('tr').dataset.time;
      const date = DateUtils.formatDate(weekDays[day - 1]);

      (this.sm.schedule[`${date}-${time}`] || []).forEach((cls, index) => {
        const classDiv = document.createElement('div');
        classDiv.className = 'class-block';
        classDiv.innerHTML = `
          <div class="class-info">
            <div class="class-name">${cls.className}</div>
            <div class="class-teachers">${cls.teachers.join(', ')}</div>
            <div class="class-groups">${cls.groups.join(', ')}</div>
            <div class="class-location">${cls.location}</div>
          </div>
          <button class="delete-class" 
                  data-key="${date}-${time}"
                  data-index="${index}">x</button>
        `;
        td.appendChild(classDiv);
      });
    });
  }

  _updateWeekDisplay() {
    const { start, end } = DateUtils.getWeekRange(this.sm.currentDate);
    document.getElementById('currentWeek').textContent =
      `${start} 至 ${end}`;
  }
}
