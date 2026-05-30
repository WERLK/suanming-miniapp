/**
 * wechat-rewarded-video.js - 微信激励视频广告商
 *
 * 使用微信原生 wx.createRewardedVideoAd() API
 * 需要在小程序后台「流量主 → 广告管理」创建激励视频广告位
 * 获取 adUnitId 后替换下面的占位值
 */

function WechatRewardedVideoAd(options) {
  this.name = 'wechat-rewarded-video';
  this.adUnitId = (options && options.adUnitId) || 'adunit-xxxxxxxxxxxxx';
  this.ad = null;
  this.isLoaded = false;
  this.isShowing = false;
}

/**
 * 当前环境是否支持激励视频广告
 */
WechatRewardedVideoAd.prototype.isAvailable = function () {
  return typeof wx !== 'undefined' && typeof wx.createRewardedVideoAd === 'function';
};

/**
 * 创建广告实例（单例，内部调用）
 */
WechatRewardedVideoAd.prototype._ensureAd = function () {
  if (this.ad) return;
  try {
    this.ad = wx.createRewardedVideoAd({
      adUnitId: this.adUnitId
    });
    var self = this;

    this.ad.onLoad(function () {
      console.log('[微信激励视频] 广告加载成功');
      self.isLoaded = true;
    });

    this.ad.onError(function (err) {
      console.error('[微信激励视频] 广告错误:', err.errCode, err.errMsg);
      self.isLoaded = false;
    });

    this.ad.onClose(function (res) {
      self.isShowing = false;
      if (self._closeCallback) {
        self._closeCallback(res);
        self._closeCallback = null;
      }
    });
  } catch (err) {
    console.error('[微信激励视频] 创建广告实例失败:', err);
  }
};

/**
 * 展示广告
 * @returns {Promise<{success: boolean, isEnded: boolean}>}
 */
WechatRewardedVideoAd.prototype.show = function () {
  var self = this;
  this._ensureAd();

  return new Promise(function (resolve, reject) {
    if (!self.ad) {
      reject(new Error('广告实例创建失败'));
      return;
    }

    if (self.isShowing) {
      reject(new Error('广告正在展示中'));
      return;
    }

    // 注册关闭回调
    self._closeCallback = function (res) {
      if (res && res.isEnded) {
        // 用户看完广告，发放奖励
        resolve({ success: true, isEnded: true });
      } else {
        // 用户提前关闭，不发奖励
        resolve({ success: true, isEnded: false });
      }
    };

    self.isShowing = true;

    self.ad.show()
      .catch(function () {
        // 展示失败，尝试先加载
        self.ad.load()
          .then(function () {
            return self.ad.show();
          })
          .catch(function (err) {
            self.isShowing = false;
            self._closeCallback = null;
            reject(err);
          });
      });
  });
};

/**
 * 预加载广告素材
 */
WechatRewardedVideoAd.prototype.preload = function () {
  var self = this;
  this._ensureAd();

  return new Promise(function (resolve, reject) {
    if (!self.ad) {
      resolve(); // 广告实例不存在认为是预加载完成（降级）
      return;
    }

    self.ad.load()
      .then(function () {
        console.log('[微信激励视频] 预加载成功');
        resolve();
      })
      .catch(function (err) {
        console.warn('[微信激励视频] 预加载失败:', err);
        resolve(); // 即使失败也不阻塞流程
      });
  });
};

/**
 * 销毁广告实例
 */
WechatRewardedVideoAd.prototype.destroy = function () {
  if (this.ad) {
    try {
      this.ad.destroy();
    } catch (e) {}
    this.ad = null;
    this.isLoaded = false;
    this.isShowing = false;
  }
};

module.exports = {
  WechatRewardedVideoAd: WechatRewardedVideoAd
};
