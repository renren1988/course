// src/scripts/services/StorageService.js
export class StorageService {
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('存储失败:', error);
      return false;
    }
  }

  static load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (error) {
      console.error('读取失败:', error);
      return null;
    }
  }

  static clear(key) {
    localStorage.removeItem(key);
  }
}
