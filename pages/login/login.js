var auth = require('../../utils/auth.js');
var api = require('../../utils/api.js');

Page({
  data: {
    username: '',
    password: '',
    rememberMe: true,
    loggingIn: false
  },

  onLoad: function () {
    // 已登录则跳转首页
    if (auth.isLoggedIn()) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  onUsernameInput: function (e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput: function (e) {
    this.setData({ password: e.detail.value });
  },

  onRememberChange: function () {
    this.setData({ rememberMe: !this.data.rememberMe });
  },

  onLogin: function () {
    var self = this;
    var username = this.data.username.trim();
    var password = this.data.password;

    if (!username) { wx.showToast({ title: '请输入用户名', icon: 'none' }); return; }
    if (!password) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }
    if (password.length < 6) { wx.showToast({ title: '密码至少6位', icon: 'none' }); return; }

    this.setData({ loggingIn: true });

    auth.login(username, password).then(function (result) {
      if (result.success) {
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(function () {
          wx.switchTab({ url: '/pages/index/index' });
        }, 1000);
      } else {
        wx.showToast({ title: result.message || '登录失败', icon: 'none' });
      }
    }).catch(function (err) {
      wx.showToast({ title: err.message || '网络错误', icon: 'none' });
    }).finally(function () {
      self.setData({ loggingIn: false });
    });
  },

  onGoRegister: function () {
    wx.redirectTo({ url: '/pages/register/register' });
  }
});
