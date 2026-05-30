/**
 * pages/register/register - 注册页
 */
var auth = require('../../utils/auth.js');

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    loading: false
  },

  onInput: function (e) {
    var field = e.currentTarget.dataset.field;
    var data = {};
    data[field] = e.detail.value;
    this.setData(data);
  },

  doRegister: function () {
    var self = this;
    var username = this.data.username.trim();
    var password = this.data.password;
    var confirmPassword = this.data.confirmPassword;
    var email = this.data.email.trim();

    if (!username) { wx.showToast({ title: '请输入用户名', icon: 'none' }); return; }
    if (username.length < 3) { wx.showToast({ title: '用户名至少3个字符', icon: 'none' }); return; }
    if (!password) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }
    if (password.length < 6) { wx.showToast({ title: '密码至少6个字符', icon: 'none' }); return; }
    if (password !== confirmPassword) { wx.showToast({ title: '两次密码不一致', icon: 'none' }); return; }

    this.setData({ loading: true });

    auth.register(username, password, email)
      .then(function (result) {
        self.setData({ loading: false });
        if (result.success) {
          wx.showToast({ title: '注册成功，请登录', icon: 'success' });
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        } else {
          wx.showToast({ title: result.message || '注册失败', icon: 'none' });
        }
      })
      .catch(function (err) {
        self.setData({ loading: false });
        wx.showToast({ title: err.message || '注册失败', icon: 'none' });
      });
  },

  goToLogin: function () {
    wx.navigateBack();
  }
});
