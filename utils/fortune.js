/**
 * fortune.js - 算命 API 封装
 * 提供模块列表、算命结果、历史记录、收藏、报告等功能
 */

var api = require('./api.js');
var auth = require('./auth.js');

/**
 * 获取模块分类列表
 * @returns {Promise<array>} 返回 categories 数组
 */
function getModuleList() {
  return api.get('/api/fortune/categories', null, {
    showLoading: true,
    loadingTitle: '加载模块...'
  }).then(function (data) {
    if (data && data.categories) return data.categories;
    // 兼容直接返回数组的情况
    if (Array.isArray(data)) return data;
    return [];
  }).catch(function () {
    return [];
  });
}

/**
 * 通用算命结果获取
 * @param {string} endpoint - API 端点（如 'bazi', 'shengxiao'）
 * @param {object} params - 请求参数
 * @returns {Promise<object>}
 */
function getFortuneResult(endpoint, params) {
  return api.post('/api/fortune/' + endpoint, params || {}, {
    showLoading: true,
    loadingTitle: '正在联网获取算数据...'
  });
}

/**
 * 获取八字排盘结果
 * @param {object} params - {year, month, day, hour, gender, calendar}
 * @returns {Promise<object>}
 */
function getBaziResult(params) {
  return api.post('/api/fortune/bazi', params, {
    showLoading: true,
    loadingTitle: '正在排盘分析...'
  });
}

/**
 * 获取紫微斗数结果
 */
function getZiweiResult(params) {
  return api.post('/api/fortune/ziwei', params, {
    showLoading: true,
    loadingTitle: '正在推演紫微...'
  });
}

/**
 * 获取生肖运势
 */
function getShengxiaoResult(params) {
  return api.post('/api/fortune/shengxiao', params, {
    showLoading: true,
    loadingTitle: '正在查询运势...'
  });
}

/**
 * 获取星座运势
 */
function getXingzuoResult(params) {
  return api.post('/api/fortune/xingzuo/daily', params, {
    showLoading: true,
    loadingTitle: '正在获取星座运势...'
  });
}

/**
 * 保存算命历史记录
 * @param {string} moduleName - 模块名称
 * @param {string} moduleFile - 模块文件名
 * @param {string} resultSummary - 结果摘要
 */
function saveHistory(moduleName, moduleFile, resultSummary) {
  if (!auth.isLoggedIn()) return Promise.resolve();

  return api.post('/api/divination-history', {
    module_name: moduleName,
    module_file: moduleFile,
    result_summary: resultSummary
  }, { showLoading: false }).catch(function () {
    // 静默失败，不影响用户体验
  });
}

/**
 * 获取算命历史记录
 * @param {number} page - 页码（从1开始）
 * @param {number} pageSize - 每页数量
 * @returns {Promise<{items: array, total: number, page: number}>}
 */
function getHistory(page, pageSize) {
  page = page || 1;
  pageSize = pageSize || 20;
  return api.get('/api/divination-history', {
    page: page,
    page_size: pageSize
  }, { showLoading: true, loadingTitle: '加载历史...' });
}

/**
 * 切换收藏状态
 * @param {string} moduleName - 模块名称
 * @param {string} moduleFile - 模块文件名
 * @returns {Promise<{favorited: boolean, message: string}>}
 */
function toggleFavorite(moduleName, moduleFile) {
  return api.post('/api/favorites', {
    module_name: moduleName,
    module_file: moduleFile
  }, { showLoading: false }).then(function (data) {
    if (data && data.success !== undefined) {
      return { favorited: data.favorited || data.success, message: data.message };
    }
    return { favorited: false, message: '操作失败' };
  });
}

/**
 * 获取收藏列表
 * @returns {Promise<object>}
 */
function getFavorites() {
  return api.get('/api/favorites', null, {
    showLoading: true,
    loadingTitle: '加载收藏...'
  });
}

/**
 * 获取报告列表
 * @returns {Promise<object>}
 */
function getReports() {
  return api.get('/api/reports', null, {
    showLoading: true,
    loadingTitle: '加载报告...'
  });
}

/**
 * 获取分享列表
 */
function getShares() {
  return api.get('/api/shares', null, {
    showLoading: true,
    loadingTitle: '加载分享...'
  });
}

/**
 * 获取通知设置
 */
function getNotificationSettings() {
  return api.get('/api/notifications/settings', null, {
    showLoading: false
  });
}

/**
 * 更新通知设置
 */
function updateNotificationSettings(settings) {
  return api.post('/api/notifications/settings', settings, {
    showLoading: false
  });
}

/**
 * 获取隐私设置
 */
function getPrivacySettings() {
  return api.get('/api/privacy/settings', null, {
    showLoading: false
  });
}

/**
 * 更新隐私设置
 */
function updatePrivacySettings(settings) {
  return api.post('/api/privacy/settings', settings, {
    showLoading: false
  });
}

/**
 * 获取应用版本信息
 */
function getVersion() {
  return api.get('/api/version', null, {
    showLoading: false
  });
}

module.exports = {
  getModuleList: getModuleList,
  getFortuneResult: getFortuneResult,
  getBaziResult: getBaziResult,
  getZiweiResult: getZiweiResult,
  getShengxiaoResult: getShengxiaoResult,
  getXingzuoResult: getXingzuoResult,
  saveHistory: saveHistory,
  getHistory: getHistory,
  toggleFavorite: toggleFavorite,
  getFavorites: getFavorites,
  getReports: getReports,
  getShares: getShares,
  getNotificationSettings: getNotificationSettings,
  updateNotificationSettings: updateNotificationSettings,
  getPrivacySettings: getPrivacySettings,
  updatePrivacySettings: updatePrivacySettings,
  getVersion: getVersion
};
