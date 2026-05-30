/**
 * baidu-ad.js - 百度广告商（微信小程序 WebView 方案）
 *
 * 通过后端的百度广告展示页面在小程序 WebView 中显示
 * 保留现有百度联盟广告的兼容性
 */

function BaiduMiniProgramAd(options) {
  this.name = 'baidu-ad';
  this.adPageUrl = 'https://xuanjisuanming.top/ad-bridge.html';
  this.isShowing = false;
  this._closeResolve = null;
}

/**
 * 检测百度广告是否可用
 * 在小程序中通过检测网络可达性来判断
 */
BaiduMiniProgramAd.prototype.isAvailable = function () {
  return true; // 始终返回 true，实际可用性在 show() 中检测
};

/**
 * 展示百度广告（小程序 WebView 方案）
 *
 * 打开一个临时页面，加载后端提供的广告桥接页
 * 广告观看完毕后通过 postMessage 或 URL scheme 通知小程序
 */
BaiduMiniProgramAd.prototype.show = function () {
  var self = this;

  return new Promise(function (resolve) {
    if (self.isShowing) {
      resolve({ success: false, isEnded: false });
      return;
    }

    self.isShowing = true;

    // 使用 wx.navigateTo 打开 WebView 广告页
    wx.navigateTo({
      url: '/pages/ad-bridge/ad-bridge?url=' + encodeURIComponent(self.adPageUrl),
      success: function () {
        console.log('[百度广告] 广告页面已打开');
      },
      fail: function (err) {
        console.error('[百度广告] 打开广告页面失败:', err);
        self.isShowing = false;
        resolve({ success: false, isEnded: false });
      }
    });

    // 监听广告页面返回的消息
    // 实际开发中需要通过事件总线或全局状态来接收广告完成通知
    // 这里提供一个简化实现：通过 getCurrentPages 轮询
    self._checkAdStatus(resolve);
  });
};

/**
 * 轮询检查广告状态（简化实现）
 * 更好的做法是使用 EventEmitter 或 app.globalData 传递状态
 */
BaiduMiniProgramAd.prototype._checkAdStatus = function (resolve) {
  var self = this;
  var maxChecks = 60; // 最多检查 60 秒（比广告时长多）
  var checks = 0;

  var timer = setInterval(function () {
    checks++;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];

    // 如果离开了广告页面（用户关闭了），检查是否看完
    if (!currentPage || currentPage.route !== 'pages/ad-bridge/ad-bridge') {
      clearInterval(timer);
      self.isShowing = false;

      // 从全局状态读取广告结果
      var app = getApp();
      var adResult = app && app.globalData && app.globalData._baiduAdResult;
      if (adResult) {
        app.globalData._baiduAdResult = null;
        resolve({ success: true, isEnded: adResult.isEnded });
      } else {
        resolve({ success: true, isEnded: false });
      }
      return;
    }

    if (checks >= maxChecks) {
      clearInterval(timer);
      self.isShowing = false;
      resolve({ success: false, isEnded: false });
    }
  }, 1000);
};

/**
 * 预加载（百度广告无需预加载）
 */
BaiduMiniProgramAd.prototype.preload = function () {
  return Promise.resolve();
};

/**
 * 销毁（百度广告无需管理生命周期）
 */
BaiduMiniProgramAd.prototype.destroy = function () {
  this.isShowing = false;
};

module.exports = {
  BaiduMiniProgramAd: BaiduMiniProgramAd
};
