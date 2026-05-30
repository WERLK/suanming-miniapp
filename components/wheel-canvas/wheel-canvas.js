/**
 * wheel-canvas 组件 - 幸运转盘
 *
 * 使用 Canvas 2D API 绘制带颜色扇区和文字的转盘
 * 支持缓出动画旋转，结束后触发 spinend 事件
 */
Component({
  properties: {
    // 转盘扇区 [{label, color, prize}]
    segments: {
      type: Array,
      value: [
        { label: '10积分', color: '#2d1b4e', prize: 'points_10' },
        { label: '免广卡x1', color: '#1a2a4e', prize: 'ad_card_1' },
        { label: 'VIP 1h', color: '#2d1b4e', prize: 'vip_1h' },
        { label: '谢谢参与', color: '#1a2a4e', prize: 'none' },
        { label: '30积分', color: '#2d1b4e', prize: 'points_30' },
        { label: '免广卡x3', color: '#1a2a4e', prize: 'ad_card_3' },
        { label: 'VIP 6h', color: '#2d1b4e', prize: 'vip_6h' },
        { label: '永久会员', color: '#4a2a00', prize: 'permanent' }
      ]
    },
    // 是否禁用旋转
    disabled: {
      type: Boolean,
      value: false
    },
    // 剩余旋转次数
    spinsLeft: {
      type: Number,
      value: 0
    }
  },

  data: {
    canvasWidth: 300,
    canvasHeight: 300,
    spinning: false,
    currentAngle: 0
  },

  lifetimes: {
    attached: function () {
      // 延迟绘制，确保 canvas 节点已就绪
      var self = this;
      setTimeout(function () {
        self._drawWheel();
      }, 200);
    }
  },

  observers: {
    'segments': function () {
      if (!this.data.spinning) {
        this._drawWheel();
      }
    }
  },

  methods: {
    /**
     * 绘制转盘
     */
    _drawWheel: function () {
      var self = this;
      var query = this.createSelectorQuery();
      query.select('#wheelCanvas')
        .fields({ node: true, size: true })
        .exec(function (res) {
          if (!res || !res[0] || !res[0].node) {
            console.warn('[wheel-canvas] Canvas 节点未找到');
            return;
          }

          var canvas = res[0].node;
          var ctx = canvas.getContext('2d');
          var dpr = wx.getSystemInfoSync().pixelRatio;
          var size = 300;

          canvas.width = size * dpr;
          canvas.height = size * dpr;
          ctx.scale(dpr, dpr);

          // 清除画布
          ctx.clearRect(0, 0, size, size);

          var centerX = size / 2;
          var centerY = size / 2;
          var radius = 130;
          var segments = self.properties.segments;
          var segmentAngle = (2 * Math.PI) / segments.length;
          var angleOffset = self.data.currentAngle || 0;

          // 绘制扇区
          for (var i = 0; i < segments.length; i++) {
            var startAngle = i * segmentAngle + angleOffset;
            var endAngle = (i + 1) * segmentAngle + angleOffset;

            // 扇区填充
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segments[i].color;
            ctx.fill();

            // 扇区边框
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 绘制文字
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px sans-serif';
            ctx.fillText(segments[i].label, radius * 0.6, 4);
            ctx.restore();
          }

          // 外圈金色边框
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 4;
          ctx.stroke();

          // 外圈装饰
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // 中心圆
          ctx.beginPath();
          ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
          var centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 24);
          centerGrad.addColorStop(0, '#ffd700');
          centerGrad.addColorStop(1, '#f0a500');
          ctx.fillStyle = centerGrad;
          ctx.fill();

          // 中心文字
          ctx.fillStyle = '#1a1a2e';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('抽奖', centerX, centerY + 4);

          // 指针（顶部三角形指示器）
          ctx.beginPath();
          ctx.moveTo(centerX - 12, centerY - radius + 8);
          ctx.lineTo(centerX + 12, centerY - radius + 8);
          ctx.lineTo(centerX, centerY - radius - 12);
          ctx.closePath();
          ctx.fillStyle = '#ffd700';
          ctx.fill();
          ctx.strokeStyle = '#1a1a2e';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
    },

    /**
     * 旋转转盘
     */
    spinWheel: function () {
      var self = this;
      if (this.data.spinning || this.properties.disabled) return;

      this.setData({ spinning: true });

      // 随机目标扇区索引
      var segments = this.properties.segments;
      var targetIndex = Math.floor(Math.random() * segments.length);

      // 计算目标角度：让目标扇区对准顶部指针
      // 指针在顶部（-pi/2 方向），需要旋转使得 targetIndex 的中间对准顶部
      var segmentAngle = (2 * Math.PI) / segments.length;
      var targetAngle = (Math.PI / 2) - (targetIndex * segmentAngle + segmentAngle / 2);

      // 添加多圈旋转效果（至少 5 圈）
      var totalRotations = 5 + Math.floor(Math.random() * 3); // 5-7 圈
      var totalAngle = totalRotations * 2 * Math.PI + targetAngle;

      // 缓出动画参数
      var startTime = Date.now();
      var duration = 3000; // 3 秒
      var startAngle = this.data.currentAngle;

      // 使用 requestAnimationFrame 动画
      function animate() {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);

        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var currentAngle = startAngle + totalAngle * eased;

        self.setData({ currentAngle: currentAngle });
        self._drawWheel();

        if (progress < 1) {
          // 微信小程序不支持 requestAnimationFrame，用 setTimeout 模拟
          setTimeout(animate, 16);
        } else {
          // 动画完成
          self.setData({ spinning: false });
          self.triggerEvent('spinend', {
            index: targetIndex,
            prize: segments[targetIndex]
          });
        }
      }

      animate();
    },

    /**
     * 获取目标扇区
     */
    _getTargetSegment: function (angle) {
      var segments = this.properties.segments;
      var segmentAngle = (2 * Math.PI) / segments.length;
      // 标准化角度到 [0, 2π)
      var normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      // 指针在顶部 (-π/2)，需要转换
      var pointerAngle = (Math.PI / 2 - normalized + 2 * Math.PI) % (2 * Math.PI);
      var index = Math.floor(pointerAngle / segmentAngle);
      return segments[index];
    },

    /**
     * 用户点击旋转
     */
    onSpinTap: function () {
      if (this.data.spinning || this.properties.disabled) return;
      this.triggerEvent('spin');
    }
  }
});
