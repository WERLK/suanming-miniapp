/**
 * wechat-banner.js - 微信 Banner 广告商
 *
 * 用于页面底部/信息流中的横幅广告
 * 需要在微信小程序后台创建 Banner 广告位
 */

function WechatBannerAd(options) {
  this.name = 'wechat-banner';
  this.adUnitId = (options && options.adUnitId) || 'adunit-xxxxxxxxxxxxx';
  this.ad = null;
}

WechatBannerAd.prototype.isAvailable = function () {
  return typeof wx !== 'undefined' && typeof wx.createBannerAd === 'function';
};

WechatBannerAd.prototype._ensureAd = function () {
  if (this.ad) return;
  try {
    this.ad = wx.createBannerAd({
      adUnitId: this.adUnitId,
      adIntervals: 30,       // 自动刷新间隔（秒）
      style: {
        left: 0,
        top: 0,
        width: 375           // 逻辑像素宽度
      }
    });

    var self = this;
    this.ad.onLoad(function () {
      console.log('[微信Banner] 广告加载成功');
    });

    this.ad.onError(function (err) {
      console.error('[微信Banner] 广告错误:', err.errCode, err.errMsg);
    });

    this.ad.onResize(function (res) {
      // Banner 加载后会自动调整高度
      if (self._onResizeCallback) {
        self._onResizeCallback(res);
      }
    });
  } catch (err) {
    console.error('[微信Banner] 创建广告实例失败:', err);
  }
};

WechatBannerAd.prototype.onResize = function (callback) {
  this._onResizeCallback = callback;
};

WechatBannerAd.prototype.show = function () {
  var self = this;
  this._ensureAd();

  return new Promise(function (resolve) {
    if (!self.ad) {
      resolve({ success: false, isEnded: false });
      return;
    }
    self.ad.show()
      .then(function () {
        resolve({ success: true, isEnded: true });
      })
      .catch(function () {
        resolve({ success: false, isEnded: false });
      });
  });
};

WechatBannerAd.prototype.hide = function () {
  if (this.ad) {
    try { this.ad.hide(); } catch (e) {}
  }
};

WechatBannerAd.prototype.preload = function () {
  return Promise.resolve(); // Banner 广告由微信自动预加载
};

WechatBannerAd.prototype.destroy = function () {
  if (this.ad) {
    try {
      this.ad.destroy();
    } catch (e) {}
    this.ad = null;
  }
};

WechatBannerAd.prototype.getAd = function () {
  this._ensureAd();
  return this.ad;
};

module.exports = {
  WechatBannerAd: WechatBannerAd
};
