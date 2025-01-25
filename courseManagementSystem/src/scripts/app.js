// src/scripts/app.js
import { ScheduleManager } from './modules/ScheduleManager.js';
import { UIManager } from './modules/UIManager.js';
import { StorageService } from './services/StorageService.js';

// 初始化核心模块
const scheduleManager = new ScheduleManager();
const uiManager = new UIManager(scheduleManager);  // 创建实例
// 初始化UI系统
uiManager.init(); 

// 全局事件绑定
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-class')) {
    const key = e.target.dataset.key;
    const index = parseInt(e.target.dataset.index);
    if (scheduleManager.removeSchedule(key, index)) {
      UIManager.updateScheduleTable();
    }
  }
});
