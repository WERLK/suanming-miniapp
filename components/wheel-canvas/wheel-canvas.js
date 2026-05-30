Component({
  properties: {
    prizes: {
      type: Array,
      value: [
        { name: '免广卡x1', color: '#2d1b69' },
        { name: '30积分', color: '#1a1a4e' },
        { name: '免广卡x3', color: '#0f3460' },
        { name: '50积分', color: '#16213e' },
        { name: '2h VIP', color: '#1a1a2e' },
        { name: '100积分', color: '#0f3460' },
        { name: '6h VIP', color: '#2d1b69' },
        { name: '200积分', color: '#1a1a4e' }
      ]
    },
    spinsRemaining: {
      type: Number,
      value: 5
    }
  },

  data: {
    spinning: false,
    canvasWidth: 300,
    centerX: 150,
    centerY: 150,
    radius: 130,
    _currentAngle: 0,
    _canvas: null,
    _ctx: null
  },

  lifetimes: {
    attached: function () {
      this._initCanvas();
    },
    ready: function () {
      // 延迟初始化确保 canvas 节点已挂载
      var self = this;
      setTimeout(function () {
        self._initCanvas();
      }, 200);
    }
  },

  methods: {
    _initCanvas: function () {
      var self = this;
      var query = this.createSelectorQuery();
      query.select('#wheelCanvas')
        .fields({ node: true, size: true })
        .exec(function (res) {
          if (!res || !res[0] || !res[0].node) return;
          var canvas = res[0].node;
          var width = res[0].width || 300;
          var height = res[0].height || 300;
          var dpr = wx.getSystemInfoSync().pixelRatio;

          canvas.width = width * dpr;
          canvas.height = height * dpr;

          var ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr);

          self.data._canvas = canvas;
          self.data._ctx = ctx;
          self.data.canvasWidth = width;
          self.data.centerX = width / 2;
          self.data.centerY = height / 2;
          self.data.radius = width / 2 - 20;

          self._drawWheel();
        });
    },

    _drawWheel: function (rotateAngle) {
      var ctx = this.data._ctx;
      if (!ctx) return;

      var prizes = this.data.prizes;
      var total = prizes.length;
      var anglePer = (2 * Math.PI) / total;
      var cx = this.data.centerX;
      var cy = this.data.centerY;
      var r = this.data.radius;
      var rotate = (rotateAngle || 0);

      ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasWidth);

      // 绘制扇区
      for (var i = 0; i < total; i++) {
        var startAngle = i * anglePer + rotate - Math.PI / 2;
        var endAngle = startAngle + anglePer;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();

        // 渐变色
        var colors = this._getSegmentColors(i, total);
        var gradient = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 扇区边框
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 扇区文字
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + anglePer / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(prizes[i].name, r * 0.65, 4);
        ctx.restore();
      }

      // 外圈金色边框
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.stroke();
    },

    _getSegmentColors: function (index, total) {
      var colorPairs = [
        ['#2d1b69', '#4a2d8f'],
        ['#1a1a4e', '#2d2d6e'],
        ['#0f3460', '#1a5080'],
        ['#16213e', '#2a3a5e'],
        ['#1a1a2e', '#2d2d50'],
        ['#2d1b69', '#3d2b80'],
        ['#0f3460', '#1a4a75'],
        ['#1a1a4e', '#2d2d65']
      ];
      return colorPairs[index % colorPairs.length];
    },

    onSpinTap: function () {
      if (this.data.spinning) return;
      if (this.data.spinsRemaining <= 0) {
        wx.showToast({ title: '今日抽奖次数已用完', icon: 'none' });
        return;
      }

      var self = this;
      this.setData({ spinning: true });

      // 随机目标索引
      var total = this.data.prizes.length;
      var targetIndex = Math.floor(Math.random() * total);

      // 计算旋转角度：至少转 5 圈 + 到达目标扇区
      var anglePer = (2 * Math.PI) / total;
      var targetAngle = (2 * Math.PI) - (targetIndex * anglePer) - (anglePer / 2);
      var totalRotation = 5 * 2 * Math.PI + targetAngle;

      // 动画参数
      var startAngle = this.data._currentAngle;
      var duration = 4000; // 4 秒
      var startTime = Date.now();
      var frameRate = 16; // ~60fps

      var animTimer = setInterval(function () {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);

        // easeOutCubic
        var ease = 1 - Math.pow(1 - progress, 3);
        var currentAngle = startAngle + totalRotation * ease;

        self.data._currentAngle = currentAngle;
        self._drawWheel(currentAngle);

        if (progress >= 1) {
          clearInterval(animTimer);
          self.setData({ spinning: false });
          var prize = self.data.prizes[targetIndex];
          wx.showToast({ title: '恭喜获得: ' + prize.name, icon: 'none', duration: 2000 });
          self.triggerEvent('spincomplete', { index: targetIndex, prize: prize });
        }
      }, frameRate);
    }
  }
});
