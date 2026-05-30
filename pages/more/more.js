/**
 * pages/more/more - 更多功能（分类浏览）
 */
var data = require('../../data/module-list.js');

Page({
  data: {
    categories: [],
    searchKeyword: ''
  },

  onLoad: function () {
    this.setData({
      categories: data.categories || []
    });
  },

  onShow: function () {
    // 如果有搜索词，清空以显示全部
    if (this.data.searchKeyword) {
      this.setData({ searchKeyword: '' });
    }
  },

  /**
   * 搜索输入
   */
  onSearchInput: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  /**
   * 清除搜索
   */
  onClearSearch: function () {
    this.setData({ searchKeyword: '' });
  },

  /**
   * 模块被选中，跳转
   */
  onModuleSelect: function (e) {
    var module = e.detail;
    var targetPath = module.path || module.file || '';
    if (!targetPath) return;

    wx.navigateTo({
      url: '/pages/module/module?type=' + targetPath
    });
  },

  /**
   * 判断分类是否匹配搜索（在 WXML 中通过 wx:if 使用）
   */
  categoryMatchesSearch: function (category) {
    var kw = this.data.searchKeyword.trim().toLowerCase();
    if (!kw) return true;
    if (category.title.toLowerCase().indexOf(kw) >= 0) return true;
    if (category.modules && category.modules.some(function (m) {
      return m.name.toLowerCase().indexOf(kw) >= 0;
    })) return true;
    return false;
  },

  onShareAppMessage: function () {
    return {
      title: '玄机算命 - 221种算命工具任你选',
      path: '/pages/more/more'
    };
  }
});
