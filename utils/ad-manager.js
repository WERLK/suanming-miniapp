/**
 * ad-manager.js - 多广告商可插拔管理器
 *
 * 设计原则：
 * 1. 统一接口：所有广告商实现相同的 isAvailable / show / preload / destroy
 * 2. 优先级调度：按注册时的 priority 依次尝试
 * 3. 降级兜底：无可用广告商时，使用模拟倒计时（保证功能可用）
 * 4. 单例模式：全局唯一实例
 * 5. 可扩展：后续添加广告商只需实现接口 + register()
 */

var singleton = null;

/**
 * 广告商接口定义（文档，非代码）：
 *
 * {
 *   name: string,                              // 唯一标识
 *   isAvailable: function() → boolean,         // 是否可用
 *   show: function() → Promise<{success, isEnded}>,  // 展示广告
 *   preload: function() → Promise,             // 预加载广告素材
 *   destroy: function() → void                 // 销毁广告实例
 * }
 */

/**
 * AdManager 类
 */
function AdManager() {
  this._providers = [];       // 已注册的广告商列表 [{name, provider, priority}]
  this._lastUsedProvider = null;
  this._fallbackSeconds = 5;  // 降级模式倒计时秒数
}

/**
 * 注册广告商
 * @param {string} name - 广告商唯一名称
 * @param {object} provider - 广告商实例（实现标准接口）
 * @param {number} priority - 优先级（数字越小越优先，默认 10）
 */
AdManager.prototype.register = function (name, provider, priority) {
  priority = priority || 10;
  this._providers.push({
    name: name,
    provider: provider,
    priority: priority
  });
  // 按优先级排序
  this._providers.sort(function (a, b) {
    return a.priority - b.priority;
  });
  console.log('[AdManager] 注册广告商:', name, '优先级:', priority);
};

/**
 * 展示广告（按优先级依次尝试）
 * @param {object} options - {onStart, onProgress, onEnd, onReward}
 * @returns {Promise<{success: boolean, isEnded: boolean, provider: string}>}
 */
AdManager.prototype.show = function (options) {
  var self = this;
  options = options || {};

  // 过滤出可用的广告商
  var availableProviders = this._providers.filter(function (item) {
    try {
      return item.provider.isAvailable();
    } catch (e) {
      return false;
    }
  });

  if (availableProviders.length > 0) {
    // 按优先级尝试
    return self._tryShowRealAd(availableProviders, options);
  } else {
    // 没有可用广告商 → 降级为模拟倒计时
    console.log('[AdManager] 无可用广告商，使用降级模式');
    return self._showFallback(options);
  }
};

/**
 * 尝试展示真实广告（按优先级依次尝试）
 */
AdManager.prototype._tryShowRealAd = function (providers, options) {
  var self = this;
  var index = 0;

  return new Promise(function (resolve) {
    function tryNext() {
      if (index >= providers.length) {
        // 所有广告商都失败了，降级
        console.log('[AdManager] 所有广告商展示失败，使用降级模式');
        return self._showFallback(options).then(resolve);
      }

      var item = providers[index];
      console.log('[AdManager] 尝试广告商:', item.name);

      item.provider.show()
        .then(function (result) {
          self._lastUsedProvider = item.name;
          resolve({
            success: true,
            isEnded: result.isEnded,
            provider: item.name
          });
        })
        .catch(function () {
          console.warn('[AdManager] 广告商 ' + item.name + ' 展示失败，尝试下一个');
          index++;
          tryNext();
        });
    }

    tryNext();
  });
};

/**
 * 降级模式：模拟倒计时广告
 * 前端显示 5 秒倒计时，结束后认为用户完成广告观看
 */
AdManager.prototype._showFallback = function (options) {
  var self = this;
  return new Promise(function (resolve) {
    var seconds = 0;
    var total = self._fallbackSeconds;
    var timer = null;

    timer = setInterval(function () {
      seconds++;
      if (options.onProgress) {
        options.onProgress({ current: seconds, total: total });
      }
      if (seconds >= total) {
        clearInterval(timer);
        if (options.onEnd) options.onEnd();
        resolve({
          success: true,
          isEnded: true,
          provider: 'fallback'
        });
      }
    }, 1000);

    if (options.onStart) options.onStart();
  });
};

/**
 * 预加载所有广告商素材
 */
AdManager.prototype.preloadAll = function () {
  var promises = this._providers.map(function (item) {
    try {
      return item.provider.preload();
    } catch (e) {
      return Promise.resolve();
    }
  });
  return Promise.all(promises);
};

/**
 * 刷新所有广告商状态
 * @returns {object} 各广告商状态汇总
 */
AdManager.prototype.refreshStatus = function () {
  var status = {};
  this._providers.forEach(function (item) {
    try {
      status[item.name] = item.provider.isAvailable();
    } catch (e) {
      status[item.name] = false;
    }
  });
  return status;
};

/**
 * 获取指定广告商实例
 */
AdManager.prototype.getProvider = function (name) {
  var found = this._providers.filter(function (item) {
    return item.name === name;
  });
  return found.length > 0 ? found[0].provider : null;
};

/**
 * 获取广告商状态列表（供 UI 使用）
 */
AdManager.prototype.getProvidersStatus = function () {
  return this._providers.map(function (item) {
    return {
      name: item.name,
      priority: item.priority,
      available: (function () {
        try { return item.provider.isAvailable(); } catch (e) { return false; }
      })()
    };
  });
};

/**
 * 获取单例实例
 */
function getInstance() {
  if (!singleton) {
    singleton = new AdManager();
  }
  return singleton;
}

/**
 * 重置单例（主要用于测试）
 */
function resetInstance() {
  singleton = null;
}

module.exports = {
  AdManager: AdManager,
  getInstance: getInstance,
  resetInstance: resetInstance
};
