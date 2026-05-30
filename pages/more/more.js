Page({
  data: {
    categories: []
  },

  onLoad: function () {
    this.setData({ categories: this.buildCategories() });
  },

  onShareAppMessage: function () {
    return { title: '玄机算命 - 全部算命工具', path: '/pages/more/more' };
  },

  buildCategories: function () {
    return [
      { title: '八字命理', icon: '📅', modules: [
        { name: '八字排盘', file: 'bazi', desc: '生辰八字详解' },
        { name: '周易占卜', file: 'zhouyi', desc: '六十四卦推演' },
        { name: '六爻预测', file: 'liuya', desc: '三枚铜钱起卦' },
        { name: '五行分析', file: 'wuxing', desc: '五行强弱解析' },
        { name: '十神详批', file: 'shishen', desc: '十神格局分析' },
        { name: '大运推算', file: 'dayun', desc: '十年大运流转' },
        { name: '流年详批', file: 'liunian', desc: '流年吉凶预测' }
      ]},
      { title: '紫微斗数', icon: '⭐', modules: [
        { name: '紫微斗数', file: 'ziwei', desc: '十二宫排盘' },
        { name: '解星推运', file: 'jiexing', desc: '星宿格局推演' },
        { name: '命盘解读', file: 'mingpan', desc: '命盘详细分析' }
      ]},
      { title: '生肖运势', icon: '🐲', modules: [
        { name: '生肖运势', file: 'shengxiao', desc: '十二生肖运程' },
        { name: '本命年', file: 'benmingnian', desc: '本命年吉凶' }
      ]},
      { title: '星座占星', icon: '♈', modules: [
        { name: '星座运势', file: 'xingzuo', desc: '十二星座运程' },
        { name: '二十八宿', file: 'eryiba', desc: '星宿推运' },
        { name: '河图洛书', file: 'hetu', desc: '古法推演' }
      ]},
      { title: '风水堪舆', icon: '🏠', modules: [
        { name: '风水堪舆', file: 'fengshui', desc: '居家风水分析' },
        { name: '财神方位', file: 'caishen', desc: '每日财位查询' },
        { name: '吉凶方位', file: 'jixiong', desc: '方位吉凶' }
      ]},
      { title: '姓名测试', icon: '📝', modules: [
        { name: '姓名测试', file: 'xingming', desc: '三才五格评分' },
        { name: '命理打分', file: 'mingli', desc: '综合评分' },
        { name: '号码吉凶', file: 'haoma', desc: '手机号分析' }
      ]},
      { title: '塔罗牌阵', icon: '🃏', modules: [
        { name: '塔罗占卜', file: 'tarot', desc: '在线抽牌' },
        { name: '爱情牌阵', file: 'aiqing', desc: '情感运势' },
        { name: '事业牌阵', file: 'shiye', desc: '职业分析' },
        { name: '财运牌阵', file: 'caiyun', desc: '财富运势' }
      ]},
      { title: '周公解梦', icon: '💤', modules: [
        { name: '周公解梦', file: 'zhougong', desc: '梦境解析' },
        { name: '梦境分析', file: 'mengjing', desc: '寓意详解' },
        { name: '预兆梦', file: 'yumeng', desc: '吉凶预兆' }
      ]},
      { title: '黄道吉日', icon: '📅', modules: [
        { name: '黄历查询', file: 'huangli', desc: '每日黄历' },
        { name: '节日查询', file: 'jieri', desc: '传统节日' },
        { name: '择日择吉', file: 'zeri', desc: '吉日选择' }
      ]},
      { title: '面相手相', icon: '🔍', modules: [
        { name: '面相分析', file: 'mianxiang', desc: '五官吉凶' },
        { name: '手相解析', file: 'shouxiang', desc: '掌纹解读' },
        { name: '相术大全', file: 'xiangshu', desc: '传统相术' }
      ]},
      { title: '择日择吉', icon: '📆', modules: [
        { name: '婚礼择日', file: 'hunli', desc: '嫁娶吉日' },
        { name: '出行择日', file: 'chuxing', desc: '出行宜忌' },
        { name: '开业择日', file: 'kaiye', desc: '开业吉时' }
      ]},
      { title: '六爻八卦', icon: '☯', modules: [
        { name: '六爻预测', file: 'liuyao', desc: '铜钱占卜' },
        { name: '八卦推演', file: 'bagua', desc: '卦象解析' },
        { name: '奇门遁甲', file: 'qimen', desc: '时空格局' }
      ]},
      { title: '奇门遁甲', icon: '🔑', modules: [
        { name: '奇门格局', file: 'qimen2', desc: '时空推演' },
        { name: '遁甲分析', file: 'dunjia', desc: '策略布局' }
      ]},
      { title: '合婚配对', icon: '💑', modules: [
        { name: '合婚配对', file: 'heyun', desc: '八字合婚' },
        { name: '婚姻分析', file: 'hunyin', desc: '婚姻质量' },
        { name: '配对指数', file: 'peidui', desc: '契合度分析' }
      ]},
      { title: '流年运势', icon: '🔮', modules: [
        { name: '流年运势', file: 'liunian2', desc: '年度运势' },
        { name: '岁破化解', file: 'suipo', desc: '冲煞化解' }
      ]},
      { title: '财运事业', icon: '💰', modules: [
        { name: '财运分析', file: 'caiyun2', desc: '财运指数' },
        { name: '事业运', file: 'shiye2', desc: '职业发展' },
        { name: '投资运', file: 'touzi', desc: '投资运势' }
      ]},
      { title: '健康养生', icon: '💪', modules: [
        { name: '健康运', file: 'jiankang', desc: '身体状况' },
        { name: '养生建议', file: 'yangsheng', desc: '养生指导' }
      ]},
      { title: '姓名配对', icon: '❤️', modules: [
        { name: '姓名配对', file: 'peidui2', desc: '缘分测试' },
        { name: '爱情测试', file: 'aiqing2', desc: '情感分析' }
      ]},
      { title: '祈福开运', icon: '🙏', modules: [
        { name: '祈福开运', file: 'qifu', desc: '开运祈福' },
        { name: '拜忏祈福', file: 'baiqian', desc: '消灾祈福' },
        { name: '许愿灵签', file: 'xuyuan', desc: '心愿祈求' }
      ]},
      { title: '灵签占卜', icon: '🎋', modules: [
        { name: '灵签占卜', file: 'lingqian', desc: '抽签解签' },
        { name: '观音灵签', file: 'guanyin', desc: '观音赐签' },
        { name: '签语解读', file: 'qianyu', desc: '签文详解' }
      ]},
      { title: '数据分析', icon: '📊', modules: [
        { name: '运势数据', file: 'data1', desc: '数据分析', isNew: true },
        { name: '运势趋势', file: 'data2', desc: '趋势查看', isNew: true }
      ]},
      { title: '图片上传', icon: '📷', modules: [
        { name: '图片测算', file: 'img1', desc: '上传分析', isNew: true },
        { name: 'AI识别', file: 'img2', desc: '智能识别', isNew: true }
      ]}
    ];
  }
});
