Component({
  properties: {
    level: { type: String, value: 'free' },
    small: { type: Boolean, value: false }
  },
  data: {
    levelText: '免费用户',
    levelColor: '#888'
  },
  observers: {
    'level': function (val) {
      var text = '免费用户', color = '#888';
      if (val === 'basic') { text = '基础会员'; color = '#ffd700'; }
      else if (val === 'permanent') { text = '永久会员'; color = '#e056fd'; }
      this.setData({ levelText: text, levelColor: color });
    }
  }
});
