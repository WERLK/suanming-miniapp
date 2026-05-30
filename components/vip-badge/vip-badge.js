Component({
  properties: {
    level: {
      type: String,
      value: 'free',
      observer: '_updateLevel'
    },
    remainingCount: {
      type: Number,
      value: 3
    },
    maxCount: {
      type: Number,
      value: 3
    },
    expiresAt: {
      type: String,
      value: ''
    },
    showProgress: {
      type: Boolean,
      value: true
    }
  },

  data: {
    levelName: '免费用户',
    levelIcon: '👤',
    levelClass: 'level-free',
    progressPercent: 0,
    expiresText: ''
  },

  lifetimes: {
    attached: function () {
      this._updateLevel(this.properties.level);
    }
  },

  methods: {
    _updateLevel: function (level) {
      var data = {};
      switch (level) {
        case 'permanent':
          data = { levelName: '永久会员', levelIcon: '👑', levelClass: 'level-permanent' };
          break;
        case 'basic':
          data = { levelName: '基础会员', levelIcon: '⭐', levelClass: 'level-basic' };
          break;
        default:
          data = { levelName: '免费用户', levelIcon: '👤', levelClass: 'level-free' };
      }

      // 进度
      var remaining = this.properties.remainingCount || 0;
      var max = this.properties.maxCount || 3;
      data.progressPercent = max > 0 ? Math.round((remaining / max) * 100) : 0;

      // 到期时间
      if (level !== 'free' && level !== 'permanent' && this.properties.expiresAt) {
        data.expiresText = '到期: ' + this.properties.expiresAt;
      } else if (level === 'permanent') {
        data.expiresText = '永久有效';
      } else {
        data.expiresText = '';
      }

      this.setData(data);
    }
  }
});
