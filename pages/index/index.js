/**
 * pages/index/index - 首页
 * 展示工具网格、快速入口、精选模块
 */
const app = getApp();
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    quickAccess: [
      { name: '八字排盘', icon: '☯️', path: 'bazi', hot: true },
      { name: '紫微斗数', icon: '⭐', path: 'ziwei', hot: true },
      { name: '合婚配对', icon: '💑', path: 'heyun' },
      { name: '生肖运势', icon: '🐉', path: 'shengxiao' }
    ],
    featuredModules: [
      { name: '姓名测试', icon: '📝', path: 'xingming' },
      { name: '塔罗牌占卜', icon: '🃏', path: 'tarot' },
      { name: '风水堪舆', icon: '🏠', path: 'fengshui' },
      { name: '周公解梦', icon: '💤', path: 'zhougong' },
      { name: '黄道吉日', icon: '📅', path: 'huangli' },
      { name: '流年解星', icon: '🌟', path: 'jiexing' },
      { name: '财神方位', icon: '💰', path: 'caishen' }
    ],
    isLoggedIn: false,
    userInfo: null
  },

  onLoad: function () {
    this.checkLoginState();
  },

  onShow: function () {
    this.checkLoginState();
  },

  checkLoginState: function () {
    var loggedIn = auth.isLoggedIn();
    var userInfo = loggedIn ? auth.getUserInfo() : null;
    this.setData({ isLoggedIn: loggedIn, userInfo: userInfo });
  },

  /**
   * 导航到算命模块
   */
  navigateToModule: function (e) {
    var path = e.currentTarget.dataset.path;
    if (!path) return;
    wx.navigateTo({
      url: '/pages/module/module?type=' + path
    });
  },

  /**
   * 导航到页面
   */
  navigateTo: function (e) {
    var url = e.currentTarget.dataset.url;
    if (!url) return;
    if (url === '/pages/vip/vip' || url === '/pages/profile/profile') {
      wx.switchTab({ url: url });
    } else {
      wx.navigateTo({ url: url });
    }
  },

  onShareAppMessage: function () {
    return {
      title: '玄机算命 - 探索命运的秘密',
      path: '/pages/index/index'
    };
  }
});
