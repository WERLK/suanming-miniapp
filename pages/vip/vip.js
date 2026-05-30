var api = require('../../utils/api.js');
var auth = require('../../utils/auth.js');

Page({
  data: {
    vipStatus: {
      level: 'free',
      remainingCount: 3,
      totalEarned: 0,
      checkinToday: false,
      points: 0,
      wheelSpins: 5
    },
    benefits: [
      { icon: '📊', text: '详细命理报告' },
      { icon: '🤖', text: 'AI深度分析' },
      { icon: '📈', text: '运势趋势图' },
      { icon: '♾️', text: '无限算命次数' },
      { icon: '🎁', text: '专属签到奖励' },
      { icon: '🎰', text: '幸运转盘' }
    ],
    redeemOptions: [
      { name: '免广卡x1', cost: 20, type: 'ad_free_1' },
      { name: '3小时 VIP', cost: 50, type: 'vip_3h' },
      { name: '24小时 VIP', cost: 200, type: 'vip_24h' },
      { name: '永久会员', cost: 500, type: 'vip_permanent' }
    ],
    showAdModal: false,
    adMode: 'fallback',
    checkingIn: false,
    spinning: false
  },

  onLoad: function () {
    if (!auth.isLoggedIn()) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
    this.loadVIPStatus();
  },

  onShow: function () {
    if (!auth.isLoggedIn()) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
  },

  onShareAppMessage: function () {
    return { title: '玄机算命 - 开启你的命运之旅', path: '/pages/vip/vip' };
  },

  loadVIPStatus: function () {
    var self = this;
    api.get('/api/vip/status', null, { showLoading: false }).then(function (data) {
      if (data && data.success) {
        self.setData({
          vipStatus: {
            level: data.level || 'free',
            remainingCount: data.remaining_count || 3,
            totalEarned: data.total_earned || 0,
            checkinToday: data.checkin_today || false,
            points: data.points || 0,
            wheelSpins: data.wheel_spins || 5,
            expiresAt: data.expires_at || '',
            maxCount: data.max_count || 3
          }
        });
      }
    }).catch(function () {});
  },

  doCheckin: function () {
    if (this.data.checkingIn) return;
    var self = this;
    this.setData({ checkingIn: true });

    api.post('/api/vip/checkin', {}, { showLoading: true, loadingTitle: '签到中...' }).then(function (data) {
      wx.showToast({ title: '✅ ' + (data.message || '签到成功！'), icon: 'none' });
      self.loadVIPStatus();
    }).catch(function (err) {
      wx.showToast({ title: err.message || '签到失败', icon: 'none' });
    }).finally(function () {
      self.setData({ checkingIn: false });
    });
  },

  watchAd: function () {
    this.setData({ showAdModal: true, adMode: 'fallback' });
    var adModal = this.selectComponent('#adModal');
    if (adModal) {
      adModal.show('fallback');
    }
  },

  onAdReward: function () {
    var self = this;
    api.post('/api/vip/watch-ad', {}, { showLoading: true, loadingTitle: '领取中...' }).then(function (data) {
      if (data && data.success) {
        wx.showToast({ title: '🎉 ' + (data.message || '获得奖励！'), icon: 'none' });
      }
      self.loadVIPStatus();
    }).catch(function (err) {
      wx.showToast({ title: err.message || '领取失败', icon: 'none' });
    }).finally(function () {
      self.setData({ showAdModal: false });
    });
  },

  onAdClose: function () {
    this.setData({ showAdModal: false });
  },

  onWheelComplete: function (e) {
    var self = this;
    var prizeIndex = e.detail.index;
    api.post('/api/vip/wheel', { prize_index: prizeIndex }, { showLoading: true, loadingTitle: '领取中...' }).then(function (data) {
      if (data && data.success) {
        wx.showToast({ title: '✅ 奖励已发放', icon: 'none' });
      }
      self.loadVIPStatus();
    }).catch(function () {
      self.loadVIPStatus();
    });
  },

  doRedeem: function (e) {
    var type = e.currentTarget.dataset.type;
    var name = e.currentTarget.dataset.name;
    var cost = parseInt(e.currentTarget.dataset.cost);

    wx.showModal({
      title: '确认兑换',
      content: '确定使用 ' + cost + ' 积分兑换「' + name + '」？',
      success: function (modalRes) {
        if (!modalRes.confirm) return;
        api.post('/api/vip/redeem', { type: type }, { showLoading: true, loadingTitle: '兑换中...' }).then(function (data) {
          if (data && data.success) {
            wx.showToast({ title: '✅ ' + (data.message || '兑换成功！'), icon: 'none' });
            self.loadVIPStatus();
          } else {
            wx.showToast({ title: data.message || '积分不足', icon: 'none' });
          }
        }).catch(function (err) {
          wx.showToast({ title: err.message || '兑换失败', icon: 'none' });
        });
      }
    });
  },

  onVIPUpgrade: function () {
    wx.showToast({ title: 'VIP 升级功能即将开放', icon: 'none' });
  }
});
