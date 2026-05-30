var auth = require('../../utils/auth.js');

Page({
  data: {
    username: '', password: '', password2: '', email: '', registering: false
  },
  onInput: function (e) { var d = {}; d[e.currentTarget.dataset.field] = e.detail.value; this.setData(d); },
  onRegister: function () {
    var self = this;
    if (!this.data.username.trim()) { wx.showToast({ title: '请输入用户名', icon: 'none' }); return; }
    if (!this.data.password || this.data.password.length < 6) { wx.showToast({ title: '密码至少6位', icon: 'none' }); return; }
    if (this.data.password !== this.data.password2) { wx.showToast({ title: '两次密码不一致', icon: 'none' }); return; }
    this.setData({ registering: true });
    auth.register(this.data.username.trim(), this.data.password, this.data.email.trim()).then(function (r) {
      if (r.success) { wx.showToast({ title: '注册成功', icon: 'success' }); setTimeout(function () { wx.switchTab({ url: '/pages/index/index' }); }, 1000); }
      else { wx.showToast({ title: r.message || '注册失败', icon: 'none' }); }
    }).catch(function (e) { wx.showToast({ title: e.message || '网络错误', icon: 'none' }); }).finally(function () { self.setData({ registering: false }); });
  },
  onGoLogin: function () { wx.redirectTo({ url: '/pages/login/login' }); }
});
