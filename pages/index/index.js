var api = require('../../utils/api.js');

Page({
  data: {
    heroTitle: '玄机算命',
    heroSubtitle: '探索命运奥秘 · AI智能分析 · 专业命理推算',
    appVersion: '1.0.0',

    quickTools: [
      { icon: '📅', name: '八字排盘', file: 'bazi', desc: '生辰八字详解' },
      { icon: '⭐', name: '紫微斗数', file: 'ziwei', desc: '十二宫推算' },
      { icon: '💑', name: '合婚配对', file: 'heyun', desc: '缘分测试' },
      { icon: '🐲', name: '生肖运势', file: 'shengxiao', desc: '流年运势' }
    ],

    featuredModules: [
      { icon: '📝', name: '姓名测试', file: 'xingming', desc: '三才五格分析' },
      { icon: '🃏', name: '塔罗牌', file: 'tarot', desc: '在线抽牌占卜' },
      { icon: '🏠', name: '风水堪舆', file: 'fengshui', desc: '居家风水' },
      { icon: '💤', name: '周公解梦', file: 'zhougong', desc: '梦境解析' },
      { icon: '📅', name: '黄道吉日', file: 'huangli', desc: '择日查询' },
      { icon: '🔮', name: '流年解星', file: 'jiexing', desc: '星宿推演' },
      { icon: '💰', name: '财神方位', file: 'caishen', desc: '每日财运' }
    ],

    knowledgeCards: [
      { title: '八字入门', desc: '了解天干地支、五行相生相克，掌握基础命理知识' },
      { title: '紫微斗数', desc: '十二宫详解，从命宫到福德宫，全面了解运势轨迹' },
      { title: '使用指南', desc: '快速上手，学会使用各项算命工具，获取最准结果' }
    ]
  },

  onLoad: function () {
    this.loadVersion();
  },

  onShareAppMessage: function () {
    return {
      title: '玄机算命 - 专业在线算命平台',
      path: '/pages/index/index'
    };
  },

  loadVersion: function () {
    var self = this;
    api.get('/api/version', null, { showLoading: false }).then(function (data) {
      if (data && data.version) {
        self.setData({ appVersion: data.version });
      }
    }).catch(function () {});
  },

  onTapModule: function (e) {
    var file = e.currentTarget.dataset.file;
    var name = e.currentTarget.dataset.name;
    if (!file) return;
    wx.navigateTo({
      url: '/pages/module/module?file=' + encodeURIComponent(file) + '&name=' + encodeURIComponent(name || '')
    });
  },

  onTapBazi: function () {
    wx.navigateTo({
      url: '/pages/module/module?file=bazi&name=八字排盘'
    });
  },

  onTapMore: function () {
    wx.switchTab({ url: '/pages/more/more' });
  },

  onTapKnowledge: function (e) {
    wx.showToast({ title: '即将开放', icon: 'none' });
  }
});
