Page({
  data: { appName: '玄机算命', version: '1.0.0', icp: '粤ICP备XXXXXX号', gaBeian: '', features: ['八字排盘·紫微斗数·塔罗牌阵','AI智能分析·大数据联网','星座生肖·风水堪舆·姓名测试','每日运势·黄道吉日·周公解梦','会员系统·积分兑换·幸运转盘'] },
  onLoad: function () { var api = require('../../utils/api.js'); var s = this; api.get('/api/version', null, { showLoading: false }).then(function (d) { if (d && d.version) s.setData({ version: d.version }); }).catch(function () {}); }
});
