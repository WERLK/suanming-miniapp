/**
 * api.js - WeChat Mini Program API 请求封装
 * 替代 Web 端的 fetch()，自动注入 JWT Token、处理 401、显示 Loading
 */

var API_BASE = 'https://xuanjisuanming.top';

/**
 * 内部请求方法
 */
function request(url, options) {
  var app = getApp();
  var token = wx.getStorageSync('token') || '';
  var showLoading = options.showLoading !== false;
  var loadingTitle = options.loadingTitle || '加载中...';

  if (showLoading) {
    wx.showLoading({ title: loadingTitle, mask: true });
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: API_BASE + url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      timeout: options.timeout || 15000,
      success: function (res) {
        if (showLoading) wx.hideLoading();

        if (res.statusCode === 401) {
          handleAuthError();
          reject(new Error('未登录或登录已过期'));
          return;
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          var msg = (res.data && res.data.message) || ('请求失败，状态码: ' + res.statusCode);
          reject(new Error(msg));
        }
      },
      fail: function (err) {
        if (showLoading) wx.hideLoading();
        var msg = '网络请求失败';
        if (err.errMsg) msg = err.errMsg;
        reject(new Error(msg));
      }
    });
  });
}

/**
 * GET 请求
 */
function get(url, data, options) {
  options = options || {};
  options.method = 'GET';
  options.data = data || undefined;
  return request(url, options);
}

/**
 * POST 请求
 */
function post(url, data, options) {
  options = options || {};
  options.method = 'POST';
  options.data = data || {};
  return request(url, options);
}

/**
 * PUT 请求
 */
function put(url, data, options) {
  options = options || {};
  options.method = 'PUT';
  options.data = data || {};
  return request(url, options);
}

/**
 * DELETE 请求
 */
function del(url, data, options) {
  options = options || {};
  options.method = 'DELETE';
  options.data = data || undefined;
  return request(url, options);
}

/**
 * 文件上传
 */
function uploadFile(url, filePath, formData, options) {
  options = options || {};
  var token = wx.getStorageSync('token') || '';
  var showLoading = options.showLoading !== false;

  if (showLoading) {
    wx.showLoading({ title: '上传中...', mask: true });
  }

  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: API_BASE + url,
      filePath: filePath,
      name: 'file',
      formData: formData || {},
      header: {
        'Authorization': token ? 'Bearer ' + token : ''
      },
      success: function (res) {
        if (showLoading) wx.hideLoading();
        if (res.statusCode === 401) {
          handleAuthError();
          reject(new Error('未登录或登录已过期'));
          return;
        }
        try {
          resolve(JSON.parse(res.data));
        } catch (e) {
          reject(new Error('响应数据解析失败'));
        }
      },
      fail: function (err) {
        if (showLoading) wx.hideLoading();
        reject(err);
      }
    });
  });
}

/**
 * 处理认证错误：清除 token 并跳转登录
 */
function handleAuthError() {
  try {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  } catch (e) {}

  // 获取当前页面栈
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1];
  var currentRoute = currentPage ? currentPage.route : '';

  // 避免重复跳转
  if (currentRoute === 'pages/login/login') return;

  wx.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 2000 });
  setTimeout(function () {
    wx.reLaunch({ url: '/pages/login/login' });
  }, 2000);
}

module.exports = {
  API_BASE: API_BASE,
  get: get,
  post: post,
  put: put,
  del: del,
  uploadFile: uploadFile,
  request: request
};
