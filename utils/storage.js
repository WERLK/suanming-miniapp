/**
 * storage.js - 微信小程序持久化存储封装
 * 对 wx.setStorageSync / wx.getStorageSync 的增强：
 * - 自动 JSON 序列化/反序列化
 * - 错误边界处理
 * - 默认值支持
 * - 存储空间信息查询
 */

var PREFIX = 'suanming_'; // key 前缀避免冲突

/**
 * 获取存储值
 * @param {string} key
 * @param {*} defaultValue - 默认值
 * @returns {*}
 */
function get(key, defaultValue) {
  try {
    var value = wx.getStorageSync(PREFIX + key);
    if (value === '' || value === undefined || value === null) {
      return defaultValue !== undefined ? defaultValue : null;
    }
    return value;
  } catch (err) {
    console.warn('[Storage] 读取失败:', key, err.message);
    return defaultValue !== undefined ? defaultValue : null;
  }
}

/**
 * 设置存储值
 * @param {string} key
 * @param {*} value
 */
function set(key, value) {
  try {
    wx.setStorageSync(PREFIX + key, value);
  } catch (err) {
    console.error('[Storage] 写入失败:', key, err.message);
    // 如果是存储空间不足，尝试清理
    if (err.errMsg && err.errMsg.indexOf('limit') > -1) {
      tryClearOldest();
      // 重试
      try {
        wx.setStorageSync(PREFIX + key, value);
      } catch (retryErr) {
        console.error('[Storage] 重试写入仍然失败:', key, retryErr.message);
      }
    }
  }
}

/**
 * 移除存储值
 * @param {string} key
 */
function remove(key) {
  try {
    wx.removeStorageSync(PREFIX + key);
  } catch (err) {
    console.warn('[Storage] 删除失败:', key, err.message);
  }
}

/**
 * 清除所有本应用存储
 */
function clear() {
  try {
    var info = wx.getStorageInfoSync();
    var keys = info.keys || [];
    keys.forEach(function (k) {
      if (k.indexOf(PREFIX) === 0) {
        wx.removeStorageSync(k);
      }
    });
  } catch (err) {
    console.error('[Storage] 清除失败:', err.message);
  }
}

/**
 * 获取存储信息
 * @returns {{keys: array, currentSize: number, limitSize: number}}
 */
function getInfo() {
  try {
    var info = wx.getStorageInfoSync();
    var ourKeys = (info.keys || []).filter(function (k) {
      return k.indexOf(PREFIX) === 0;
    });
    return {
      keys: ourKeys,
      currentSize: info.currentSize || 0,
      limitSize: info.limitSize || 10240
    };
  } catch (err) {
    return {
      keys: [],
      currentSize: 0,
      limitSize: 10240
    };
  }
}

/**
 * 移除最早的存储项（空间不足时）
 */
function tryClearOldest() {
  try {
    var info = wx.getStorageInfoSync();
    var ourKeys = (info.keys || []).filter(function (k) {
      return k.indexOf(PREFIX) === 0;
    });
    if (ourKeys.length === 0) return;
    // 移除第一个
    wx.removeStorageSync(ourKeys[0]);
  } catch (e) {}
}

/**
 * 直接操作（不带前缀，用于读取系统存储）
 */
function rawGet(key, defaultValue) {
  try {
    var value = wx.getStorageSync(key);
    if (value === '' || value === undefined || value === null) {
      return defaultValue !== undefined ? defaultValue : null;
    }
    return value;
  } catch (err) {
    return defaultValue !== undefined ? defaultValue : null;
  }
}

function rawSet(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (err) {
    console.error('[Storage] 原始写入失败:', key, err.message);
  }
}

module.exports = {
  get: get,
  set: set,
  remove: remove,
  clear: clear,
  getInfo: getInfo,
  rawGet: rawGet,
  rawSet: rawSet
};
