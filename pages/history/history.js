var api = require('../../utils/api.js');
Page({
  data: { historyList: [], loading: true },
  onLoad: function () { this.loadHistory(); },
  onPullDownRefresh: function () { this.loadHistory().then(function () { wx.stopPullDownRefresh(); }); },
  loadHistory: function () {
    var self = this;
    this.setData({ loading: true });
    return api.get('/api/divination-history').then(function (data) {
      var list = data.records || data.history || (Array.isArray(data) ? data : []);
      self.setData({ historyList: list, loading: false });
    }).catch(function () {
      self.setData({ historyList: [], loading: false });
    });
  },
  onItemTap: function (e) { wx.showToast({ title: '详情功能开发中', icon: 'none' }); }
});