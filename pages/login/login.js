/**
 * pages/login/login - 登录页
 */
var auth = require('../../utils/auth.js');

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onUsernameInput: function (e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput: function (e) {
    this.setData({ password: e.detail.value });
  },

  doLogin: function () {
    var self = this;
    var username = this.data.username.trim();
    var password = this.data.password;

    if (!username) {
      wx.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    auth.login(username, password)
      .then(function (result) {
        self.setData({ loading: false });
        if (result.success) {
          wx.showToast({ title: '登录成功', icon: 'success' });
          setTimeout(function () {
            wx.switchTab({ url: '/pages/index/index' });
          }, 800);
        } else {
          wx.showToast({ title: result.message || '登录失败', icon: 'none' });
        }
      })
      .catch(function (err) {
        self.setData({ loading: false });
        wx.showToast({ title: err.message || '登录失败', icon: 'none' });
      });
  },

  goToRegister: function () {
    wx.navigateTo({ url: '/pages/register/register' });
  },

  goToForgotPassword: function () {
    wx.showToast({ title: '请联系客服重置密码', icon: 'none' });
  }
});
