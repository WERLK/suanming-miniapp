/**
 * pages/vip/vip - 会员中心
 * 签到、看广告、幸运转盘、积分兑换
 */
var app = getApp();
var api = require('../../utils/api.js');
var auth = require('../../utils/auth.js');

Page({
  data: {
    vipLevel: 'free',
    points: 0,
    dailyUses: 0,
    maxDailyUses: 3,
    vipExpiry: '',
    spinsLeft: 5,
    checkinDone: true,
    checkinPoints: 0,
    showAdModal: false,
    adTitle: '看广告获取 VIP 时长',
    adTip: '观看广告即可领取奖励',
    wheelSegments: [
      { label: '10积分', color: '#2d1b4e', prize: 'points_10' },
      { label: '免广卡x1', color: '#1a2a4e', prize: 'ad_card_1' },
      { label: 'VIP 1h', color: '#2d1b4e', prize: 'vip_1h' },
      { label: '谢谢参与', color: '#1a2a4e', prize: 'none' },
      { label: '30积分', color: '#2d1b4e', prize: 'points_30' },
      { label: '免广卡x3', color: '#1a2a4e', prize: 'ad_card_3' },
      { label: 'VIP 6h', color: '#2d1b4e', prize: 'vip_6h' },
      { label: '永久会员', color: '#4a2a00', prize: 'permanent' }
    ],
    redeemOptions: [
      { label: '免广卡x1', cost: 20, type: 'ad_1', icon: '🎫' },
      { label: 'VIP 3小时', cost: 50, type: 'vip_3h', icon: '⏱️' },
      { label: 'VIP 24小时', cost: 200, type: 'vip_24h', icon: '📅' },
      { label: '永久会员', cost: 500, type: 'permanent', icon: '👑' }
    ]
  },

  onLoad: function () {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.switchTab({ url: '/pages/index/index' });
      return;
    }
    this.loadVIPStatus();
  },

  onShow: function () {
    if (auth.isLoggedIn()) {
      this.loadVIPStatus();
    }
  },

  /**
   * 加载 VIP 状态
   */
  loadVIPStatus: function () {
    var self = this;
    api.get('/api/vip/status')
      .then(function (data) {
        if (!data.success) return;
        self.setData({
          vipLevel: data.level || 'free',
          points: data.points || 0,
          dailyUses: data.daily_uses || 0,
          maxDailyUses: data.max_daily_uses || 3,
          vipExpiry: data.vip_expiry || '',
          spinsLeft: data.spins_left || 0,
          checkinDone: data.checkin_done || false,
          checkinPoints: data.checkin_points || 0
        });
      })
      .catch(function (err) {
        console.error('[VIP] 加载状态失败:', err);
        if (err.message === '未登录或登录已过期') {
          auth.handleAuthError();
        }
      });
  },

  /**
   * 签到
   */
  doCheckin: function () {
    var self = this;
    wx.showLoading({ title: '签到中...' });
    api.post('/api/vip/checkin')
      .then(function (data) {
        wx.hideLoading();
        if (data.success) {
          wx.showToast({ title: '✅ ' + (data.message || '签到成功'), icon: 'none' });
          self.loadVIPStatus();
        } else {
          wx.showToast({ title: data.message || '签到失败', icon: 'none' });
        }
      })
      .catch(function (err) {
        wx.hideLoading();
        wx.showToast({ title: err.message || '签到失败', icon: 'none' });
        if (err.message === '未登录或登录已过期') auth.handleAuthError();
      });
  },

  /**
   * 看广告获取 VIP
   */
  watchAdForVIP: function () {
    var self = this;
    try {
      this.setData({ showAdModal: true });

      var adManager = app.globalData.adManager;
      if (adManager) {
        adManager.show({
          onStart: function () {
            console.log('[VIP] 广告开始展示');
          },
          onProgress: function (info) {
            console.log('[VIP] 广告进度:', info.current, '/', info.total);
          }
        }).then(function (result) {
          if (result.success && result.isEnded) {
            self.claimAdReward();
          } else if (!result.isEnded) {
            wx.showToast({ title: '请完整观看广告', icon: 'none' });
            self.setData({ showAdModal: false });
          }
        }).catch(function () {
          self.setData({ showAdModal: false });
        });
      }
    } catch (e) {
      console.error('[VIP] 广告加载失败:', e);
      wx.showToast({ title: '广告加载失败，请稍后再试', icon: 'none' });
      self.setData({ showAdModal: false });
    }
  },

  /**
   * 领取广告奖励
   */
  claimAdReward: function () {
    var self = this;
    wx.showLoading({ title: '领取中...' });
    api.post('/api/vip/watch-ad')
      .then(function (data) {
        wx.hideLoading();
        self.setData({ showAdModal: false });
        if (data.success) {
          wx.showToast({ title: '✅ ' + (data.message || '领取成功'), icon: 'none' });
          self.loadVIPStatus();
        } else {
          wx.showToast({ title: data.message || '领取失败', icon: 'none' });
        }
      })
      .catch(function (err) {
        wx.hideLoading();
        self.setData({ showAdModal: false });
        wx.showToast({ title: err.message || '领取失败', icon: 'none' });
        if (err.message === '未登录或登录已过期') auth.handleAuthError();
      });
  },

  closeAdModal: function () {
    this.setData({ showAdModal: false });
  },

  /**
   * 转盘抽奖
   */
  spinWheel: function () {
    var self = this;
    if (this.data.spinsLeft <= 0) {
      wx.showToast({ title: '今日抽奖次数已用完', icon: 'none' });
      return;
    }

    var wheel = this.selectComponent('#vipWheel');
    if (wheel) {
      wheel.spinWheel();
    }
  },

  onWheelSpinEnd: function (e) {
    var self = this;
    var prize = e.detail.prize;
    wx.showLoading({ title: '领取中...' });
    api.post('/api/vip/wheel')
      .then(function (data) {
        wx.hideLoading();
        if (data.success) {
          wx.showModal({
            title: '🎉 恭喜中奖',
            content: '获得: ' + (prize.label || data.prize),
            showCancel: false
          });
          self.loadVIPStatus();
        } else {
          wx.showToast({ title: data.message || '领取失败', icon: 'none' });
        }
      })
      .catch(function (err) {
        wx.hideLoading();
        wx.showToast({ title: err.message || '领取失败', icon: 'none' });
        if (err.message === '未登录或登录已过期') auth.handleAuthError();
      });
  },

  /**
   * 积分兑换
   */
  doRedeem: function (e) {
    var self = this;
    var type = e.currentTarget.dataset.type;
    var cost = e.currentTarget.dataset.cost;
    var label = e.currentTarget.dataset.label;

    if (self.data.points < cost) {
      wx.showToast({ title: '积分不足', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认兑换',
      content: '使用 ' + cost + ' 积分兑换 ' + label + '？',
      success: function (res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '兑换中...' });
        api.post('/api/vip/redeem', { type: type })
          .then(function (data) {
            wx.hideLoading();
            if (data.success) {
              wx.showToast({ title: '✅ ' + (data.message || '兑换成功'), icon: 'none' });
              self.loadVIPStatus();
            } else {
              wx.showToast({ title: data.message || '兑换失败', icon: 'none' });
            }
          })
          .catch(function (err) {
            wx.hideLoading();
            wx.showToast({ title: err.message || '兑换失败', icon: 'none' });
            if (err.message === '未登录或登录已过期') auth.handleAuthError();
          });
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '玄机算命 - 会员中心',
      path: '/pages/vip/vip'
    };
  }
});
