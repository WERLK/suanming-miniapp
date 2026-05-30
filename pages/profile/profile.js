/**
 * pages/profile/profile - 个人中心
 */
var api = require('../../utils/api.js');
var auth = require('../../utils/auth.js');

Page({
  data: {
    isLoggedIn: false,
    username: '',
    email: '',
    avatar: '',
    vipLevel: 'free',
    menuItems: [
      { icon: '📜', label: '我的历史', url: '/pages/history/history' },
      { icon: '⭐', label: '我的收藏', url: '/pages/favorites/favorites' },
      { icon: '📊', label: '我的报告', url: '/pages/reports/reports' },
      { icon: '✏️', label: '编辑资料', url: '/pages/edit-profile/edit-profile' },
      { icon: '🔔', label: '通知设置', url: '/pages/notifications/notifications' },
      { icon: '🔒', label: '隐私设置', url: '/pages/privacy/privacy' },
      { icon: 'ℹ️', label: '关于我们', url: '/pages/about/about' },
      { icon: '❓', label: '帮助中心', url: '/pages/help/help' }
    ]
  },

  onLoad: function () {
    this.checkLoginState();
  },

  onShow: function () {
    this.checkLoginState();
  },

  checkLoginState: function () {
    var loggedIn = auth.isLoggedIn();
    if (loggedIn) {
      this.loadProfile();
    } else {
      this.setData({ isLoggedIn: false });
    }
  },

  loadProfile: function () {
    var self = this;
    api.get('/api/profile')
      .then(function (data) {
        if (data.success || data.username) {
          self.setData({
            isLoggedIn: true,
            username: data.username || '',
            email: data.email || '',
            avatar: data.avatar || '',
            vipLevel: data.vip_level || 'free'
          });
        }
      })
      .catch(function (err) {
        console.error('[Profile] 加载失败:', err);
        if (err.message === '未登录或登录已过期') {
          auth.handleAuthError();
        }
      });
  },

  navigateTo: function (e) {
    var url = e.currentTarget.dataset.url;
    if (!url) return;
    if (!auth.isLoggedIn()) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: url });
  },

  goToLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  doLogout: function () {
    var self = this;
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          auth.logout();
          self.setData({
            isLoggedIn: false,
            username: '',
            email: '',
            avatar: '',
            vipLevel: 'free'
          });
          wx.showToast({ title: '已退出登录', icon: 'none' });
        }
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '玄机算命',
      path: '/pages/index/index'
    };
  }
});
