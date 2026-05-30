/**
 * auth.js - 微信小程序认证管理
 * JWT Token 存储、验证、登录/注册/登出
 */

var api = require('./api.js');
var storage = require('./storage.js');

var TOKEN_KEY = 'token';
var USER_KEY = 'userInfo';

/**
 * 用户登录
 * @param {string} username - 用户名/手机号/邮箱
 * @param {string} password - 密码
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
function login(username, password) {
  return api.post('/api/login', {
    username: username,
    password: password
  }, { showLoading: true, loadingTitle: '登录中...' }).then(function (data) {
    if (data && data.success) {
      // 存储 token
      storage.set(TOKEN_KEY, data.token);
      // 存储用户信息
      if (data.user) {
        storage.set(USER_KEY, data.user);
      }
      // 更新全局状态
      var app = getApp();
      if (app) {
        app.globalData.userToken = data.token;
        app.globalData.userInfo = data.user || null;
      }
      return { success: true, user: data.user };
    } else {
      return { success: false, message: (data && data.message) || '登录失败' };
    }
  }).catch(function (err) {
    return { success: false, message: err.message || '登录请求失败' };
  });
}

/**
 * 用户注册
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {string} email - 邮箱（可选）
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
function register(username, password, email) {
  var body = {
    username: username,
    password: password
  };
  if (email) body.email = email;

  return api.post('/api/register', body, {
    showLoading: true,
    loadingTitle: '注册中...'
  }).then(function (data) {
    if (data && data.success) {
      storage.set(TOKEN_KEY, data.token);
      if (data.user) {
        storage.set(USER_KEY, data.user);
      }
      var app = getApp();
      if (app) {
        app.globalData.userToken = data.token;
        app.globalData.userInfo = data.user || null;
      }
      return { success: true, user: data.user };
    } else {
      return { success: false, message: (data && data.message) || '注册失败' };
    }
  }).catch(function (err) {
    return { success: false, message: err.message || '注册请求失败' };
  });
}

/**
 * 登出
 */
function logout() {
  // 尝试通知后端（非关键操作，忽略失败）
  api.post('/api/logout', {}, { showLoading: false }).catch(function () {});

  // 清除本地存储
  storage.remove(TOKEN_KEY);
  storage.remove(USER_KEY);

  // 清除全局状态
  var app = getApp();
  if (app) {
    app.globalData.userToken = null;
    app.globalData.userInfo = null;
    app.globalData.vipStatus = null;
  }

  // 跳转到登录页
  wx.reLaunch({ url: '/pages/login/login' });
}

/**
 * 获取当前 Token
 * @returns {string|null}
 */
function getToken() {
  var token = storage.get(TOKEN_KEY, null);
  if (!token) return null;

  // 检查 JWT 是否过期
  if (isTokenExpired(token)) {
    // Token 过期，清除
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
    return null;
  }

  return token;
}

/**
 * 解析 JWT Token 获取 payload
 */
function parseJWT(token) {
  try {
    var parts = token.split('.');
    if (parts.length !== 3) return null;
    var payload = parts[1];
    // Base64 URL decode
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) payload += '=';
    var decoded = wx.base64ToArrayBuffer(payload);
    // ArrayBuffer 转 string
    var bytes = new Uint8Array(decoded);
    var str = '';
    for (var i = 0; i < bytes.length; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return JSON.parse(decodeURIComponent(escape(str)));
  } catch (e) {
    return null;
  }
}

/**
 * 检查 JWT Token 是否过期
 */
function isTokenExpired(token) {
  var payload = parseJWT(token);
  if (!payload || !payload.exp) return false;
  // exp 是秒级时间戳
  return payload.exp * 1000 < Date.now();
}

/**
 * 是否已登录
 * @returns {boolean}
 */
function isLoggedIn() {
  var token = getToken();
  return !!token;
}

/**
 * 获取用户信息
 * @returns {object|null}
 */
function getUserInfo() {
  return storage.get(USER_KEY, null);
}

/**
 * 处理认证错误（401 响应时调用）
 */
function handleAuthError() {
  storage.remove(TOKEN_KEY);
  storage.remove(USER_KEY);

  var app = getApp();
  if (app) {
    app.globalData.userToken = null;
    app.globalData.userInfo = null;
    app.globalData.vipStatus = null;
  }

  // 检查是否已经在登录页
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1];
  if (currentPage && currentPage.route === 'pages/login/login') return;

  wx.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 1500 });
  setTimeout(function () {
    wx.reLaunch({ url: '/pages/login/login' });
  }, 1500);
}

/**
 * 更新本地用户信息
 */
function updateUserInfo(userInfo) {
  storage.set(USER_KEY, userInfo);
  var app = getApp();
  if (app && app.globalData) {
    app.globalData.userInfo = userInfo;
  }
}

module.exports = {
  login: login,
  register: register,
  logout: logout,
  getToken: getToken,
  isLoggedIn: isLoggedIn,
  getUserInfo: getUserInfo,
  handleAuthError: handleAuthError,
  updateUserInfo: updateUserInfo,
  parseJWT: parseJWT
};
