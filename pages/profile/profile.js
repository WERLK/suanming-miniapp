var auth = require('../../utils/auth.js');
var api = require('../../utils/api.js');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    menuSections: [
      {
        title: '我的记录',
        items: [
          { key: 'history', icon: '📜', text: '算命历史', url: '/pages/history/history' },
          { key: 'favorites', icon: '⭐', text: '我的收藏', url: '/pages/favorites/favorites' },
          { key: 'reports', icon: '📊', text: '我的报告', url: '/pages/reports/reports' }
        ]
      },
      {
        title: '设置',
        items: [
          { key: 'edit-profile', icon: '✏️', text: '编辑资料', url: '/pages/edit-profile/edit-profile' },
          { key: 'notifications', icon: '🔔', text: '通知设置', url: '/pages/notifications/notifications' },
          { key: 'privacy', icon: '🔒', text: '隐私设置', url: '/pages/privacy/privacy' },
          { key: 'about', icon: 'ℹ️', text: '关于我们', url: '/pages/about/about' },
          { key: 'help', icon: '❓', text: '帮助中心', url: '/pages/help/help' }
        ]
      }
    ]
  },

  onLoad: function () {
    this.checkLogin();
  },

  onShow: function () {
    this.checkLogin();
  },

  onShareAppMessage: function () {
    return { title: '玄机算命 - 专业在线算命平台', path: '/pages/index/index' };
  },

  checkLogin: function () {
    var loggedIn = auth.isLoggedIn();
    this.setData({ isLoggedIn: loggedIn });

    if (loggedIn) {
      this.loadProfile();
    }
  },

  loadProfile: function () {
    var self = this;
    var storedInfo = auth.getUserInfo();
    if (storedInfo) {
      self.setData({ userInfo: storedInfo });
    }

    api.get('/api/profile', null, { showLoading: false }).then(function (data) {
      if (data && data.success) {
        var profile = data.data || data;
        self.setData({ userInfo: profile });
        auth.updateUserInfo(profile);
      }
    }).catch(function () {});
  },

  onTapMenu: function (e) {
    var url = e.currentTarget.dataset.url;
    if (!url) return;
    if (!auth.isLoggedIn()) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: url });
  },

  onTapVIP: function () {
    wx.switchTab({ url: '/pages/vip/vip' });
  },

  onTapLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  onTapLogout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          auth.logout();
        }
      }
    });
  }
});
