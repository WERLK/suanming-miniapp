/**
 * ad-modal 组件 - 广告弹窗
 *
 * 用法：
 * <ad-modal id="adModal" bind:reward="onAdReward"></ad-modal>
 * this.selectComponent('#adModal').show()
 */

Component({
  properties: {
    // 广告模式：'native' | 'fallback'
    mode: {
      type: String,
      value: 'fallback'
    },
    // 倒计时秒数
    countdownSeconds: {
      type: Number,
      value: 5
    }
  },

  data: {
    visible: false,
    progressPercent: 0,
    progressText: '准备中...',
    rewardReady: false,
    rewardBtnText: '请先观看广告 (0/5秒)',
    fallbackText: '广告加载中，请稍候...',
    currentSeconds: 0,
    _timer: null
  },

  lifetimes: {
    detached: function () {
      this.stopCountdown();
    }
  },

  methods: {
    /**
     * 显示广告弹窗
     * @param {string} mode - 'native' | 'fallback'
     */
    show: function (mode) {
      mode = mode || this.data.mode;
      this.stopCountdown();
      this.setData({
        visible: true,
        mode: mode,
        progressPercent: 0,
        rewardReady: false,
        currentSeconds: 0,
        rewardBtnText: '请先观看广告 (0/' + this.data.countdownSeconds + '秒)',
        fallbackText: mode === 'fallback' ? '模拟广告播放中，请等待...' : ''
      });

      // 降级模式：自动开始倒计时
      if (mode === 'fallback') {
        this.startCountdown();
      }

      this.triggerEvent('show');
    },

    /**
     * 开始倒计时
     */
    startCountdown: function () {
      var self = this;
      var total = this.data.countdownSeconds;
      var current = 0;

      this.stopCountdown();

      this.setData({
        currentSeconds: 0,
        progressPercent: 0,
        rewardReady: false,
        rewardBtnText: '请先观看广告 (0/' + total + '秒)'
      });

      this.data._timer = setInterval(function () {
        current++;
        var percent = Math.round((current / total) * 100);

        self.setData({
          currentSeconds: current,
          progressPercent: percent,
          progressText: current + '/' + total + ' 秒',
          rewardBtnText: '请先观看广告 (' + current + '/' + total + '秒)'
        });

        if (current >= total) {
          self.stopCountdown();
          self.setData({
            rewardReady: true,
            rewardBtnText: '🎁 领取奖励',
            progressText: '观看完成！',
            fallbackText: '广告观看完成，请点击领取奖励'
          });
          self.triggerEvent('ready');
        }
      }, 1000);
    },

    /**
     * 手动标记广告完成（原生广告回调时使用）
     */
    markCompleted: function () {
      this.stopCountdown();
      this.setData({
        progressPercent: 100,
        rewardReady: true,
        rewardBtnText: '🎁 领取奖励',
        progressText: '观看完成！',
        currentSeconds: this.data.countdownSeconds
      });
      this.triggerEvent('ready');
    },

    /**
     * 停止倒计时
     */
    stopCountdown: function () {
      if (this.data._timer) {
        clearInterval(this.data._timer);
        this.data._timer = null;
      }
    },

    /**
     * 用户点击领取奖励
     */
    onClaimReward: function () {
      if (!this.data.rewardReady) return;

      this.setData({ visible: false });
      this.stopCountdown();
      this.triggerEvent('reward', { completed: true });
    },

    /**
     * 关闭弹窗（用户主动关闭，可能未看完）
     */
    onClose: function () {
      if (this.data.rewardReady) return; // 已看完不能关闭
      this.setData({ visible: false });
      this.stopCountdown();
      this.triggerEvent('close', { completed: false });
    },

    /**
     * 阻止底层滚动
     */
    noop: function () {}
  }
});
