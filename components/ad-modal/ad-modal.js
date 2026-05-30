/**
 * ad-modal 组件 - 广告观看弹窗
 *
 * 展示倒计时、广告容器占位、领取奖励按钮
 * 支持真实广告商展示 + 降级倒计时模式
 */
Component({
  properties: {
    // 是否可见
    visible: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (newVal) {
          this.startCountdown();
        } else {
          this.stopCountdown();
        }
      }
    },
    // 弹窗标题
    title: {
      type: String,
      value: '看广告获取 VIP 时长'
    },
    // 倒计时秒数
    seconds: {
      type: Number,
      value: 5
    },
    // 当前使用的广告商名称
    provider: {
      type: String,
      value: ''
    },
    // 提示文字（广告加载中/观看广告即可领取奖励）
    tipText: {
      type: String,
      value: '观看广告即可领取奖励'
    }
  },

  data: {
    countdown: 0,           // 当前倒计时（正向计数）
    counting: false,        // 是否正在计时
    canClaim: false,        // 是否可以领取奖励
    timer: null             // setInterval 句柄
  },

  lifetimes: {
    detached: function () {
      this.stopCountdown();
    }
  },

  methods: {
    /**
     * 开始倒计时（正向 0 → seconds）
     */
    startCountdown: function () {
      var self = this;

      // 先重置
      this.stopCountdown();
      this.setData({
        countdown: 0,
        counting: true,
        canClaim: false
      });

      var total = this.properties.seconds;
      var timer = setInterval(function () {
        var next = self.data.countdown + 1;
        self.setData({ countdown: next });

        if (next >= total) {
          self.setData({ counting: false, canClaim: true });
          self.stopCountdown();
        }
      }, 1000);

      this.data.timer = timer;
    },

    /**
     * 停止倒计时
     */
    stopCountdown: function () {
      if (this.data.timer) {
        clearInterval(this.data.timer);
        this.data.timer = null;
      }
    },

    /**
     * 用户点击领取奖励
     */
    onClaimTap: function () {
      if (!this.data.canClaim) return;

      // 触发领取事件，父页面处理 API 调用
      this.triggerEvent('claim');
      this.onClose();
    },

    /**
     * 用户关闭弹窗
     */
    onClose: function () {
      this.stopCountdown();
      this.setData({
        counting: false,
        countdown: 0,
        canClaim: false
      });
      this.triggerEvent('close');
    },

    /**
     * 重置所有状态
     */
    reset: function () {
      this.stopCountdown();
      this.setData({
        countdown: 0,
        counting: false,
        canClaim: false
      });
    },

    /**
     * 阻止事件冒泡（防止点击弹窗内容关闭）
     */
    noop: function () {}
  }
});
