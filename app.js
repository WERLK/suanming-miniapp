// 玄机算命 - 微信小程序入口
// 应用生命周期：初始化广告管理器、加载用户状态、预加载广告

App({
  globalData: {
    // API 基础地址
    apiBase: 'https://xuanjisuanming.top',
    // 用户信息
    userInfo: null,
    userToken: null,
    // 会员状态
    vipStatus: null,
    // 广告管理器实例（在 onLaunch 中初始化）
    adManager: null,
    // 系统信息
    systemInfo: null
  },

  onLaunch(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    console.log('[App] 启动，系统信息:', systemInfo.platform, systemInfo.version);

    // 恢复登录状态
    this.initAuth();

    // 初始化广告管理器（延迟加载，避免阻塞启动）
    setTimeout(() => {
      this.initAdManager();
    }, 500);
  },

  onShow(options) {
    console.log('[App] 显示', options.scene);
    // 每次切回前台时刷新广告管理器状态
    if (this.globalData.adManager) {
      this.globalData.adManager.refreshStatus();
    }
  },

  /**
   * 恢复登录状态
   */
  initAuth() {
    try {
      const token = wx.getStorageSync('token');
      if (token) {
        this.globalData.userToken = token;
        console.log('[App] 已恢复登录状态');

        // 后台验证 token 有效性
        this.checkTokenValidity(token);
      }
    } catch (err) {
      console.warn('[App] 读取 token 失败:', err);
    }
  },

  /**
   * 验证 token 是否仍然有效
   */
  checkTokenValidity(token) {
    wx.request({
      url: this.globalData.apiBase + '/api/vip/status',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.success) {
          this.globalData.vipStatus = res.data;
          console.log('[App] Token 有效，VIP 状态已加载');
        }
      },
      fail: (err) => {
        console.warn('[App] Token 验证失败:', err);
      }
    });
  },

  /**
   * 初始化多广告商管理器
   */
  initAdManager() {
    try {
      const AdManager = require('./utils/ad-manager.js');
      const WechatRewardedVideoAd = require('./ad-providers/wechat-rewarded-video.js');
      const BaiduMiniProgramAd = require('./ad-providers/baidu-ad.js');

      const manager = new AdManager.AdManager();

      // 注册微信激励视频广告（占位 adUnitId，用户需替换）
      // 在小程序后台「流量主 → 广告管理」创建广告位后获取 adUnitId
      const wechatAd = new WechatRewardedVideoAd.WechatRewardedVideoAd({
        adUnitId: 'adunit-xxxxxxxxxxxxx' // TODO: 替换为真实广告位ID
      });
      manager.register('wechat-rewarded', wechatAd, 1); // 优先级 1（最高）

      // 注册百度广告商（预留）
      const baiduAd = new BaiduMiniProgramAd.BaiduMiniProgramAd();
      manager.register('baidu-ad', baiduAd, 2); // 优先级 2

      // 预加载所有可用广告
      manager.preloadAll().then(() => {
        console.log('[App] 所有广告商预加载完成');
      });

      this.globalData.adManager = manager;
      console.log('[App] 广告管理器初始化完成');
    } catch (err) {
      console.error('[App] 广告管理器初始化失败:', err);
    }
  }
});
