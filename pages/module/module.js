var api = require('../../utils/api.js');
var fortune = require('../../utils/fortune.js');
var auth = require('../../utils/auth.js');

Page({
  data: {
    moduleName: '算命模块',
    moduleFile: '',
    loading: false,
    hasResult: false,
    result: null,
    errorMsg: '',
    isFavorite: false,
    // 八字专用参数
    showBaziForm: false,
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '0',
    gender: 'male',
    calendar: 'solar',
    // 通用参数（姓名、问题等）
    showGenericForm: false,
    genericInput: '',
    genericLabel: '',
    // 图片上传参数
    showImageForm: false,
    imagePath: '',
    // 参数配置映射
    paramConfigs: {
      bazi: { type: 'bazi' },
      ziwei: { type: 'bazi' },
      heyun: { type: 'bazi' },
      xingming: { type: 'generic', label: '请输入姓名', placeholder: '姓名' },
      zhougong: { type: 'generic', label: '请输入梦境', placeholder: '描述你的梦境...' },
      mianxiang: { type: 'image', label: '上传面相照片' },
      shouxiang: { type: 'image', label: '上传手相照片' },
      zhouyi: { type: 'generic', label: '请输入占卜问题', placeholder: '你想问什么？' }
    },
    genderOptions: ['保密', '男', '女'],
    genderIndex: 1,
    hourOptions: ['0(子时)', '1(丑时)', '2(丑时)', '3(寅时)', '4(寅时)', '5(卯时)', '6(卯时)', '7(辰时)', '8(辰时)', '9(巳时)', '10(巳时)', '11(午时)', '12(午时)', '13(未时)', '14(未时)', '15(申时)', '16(申时)', '17(酉时)', '18(酉时)', '19(戌时)', '20(戌时)', '21(亥时)', '22(亥时)', '23(子时)'],
    hourIndex: 0
  },

  onLoad: function (options) {
    var name = options.name || '';
    var file = options.file || '';

    if (name) {
      wx.setNavigationBarTitle({ title: name });
      this.setData({ moduleName: name });
    }

    if (file) {
      this.setData({ moduleFile: file });
      this.setupFormForModule(file);
    }
  },

  onShareAppMessage: function () {
    return { title: '玄机算命 - ' + this.data.moduleName, path: '/pages/module/module?file=' + this.data.moduleFile + '&name=' + this.data.moduleName };
  },

  setupFormForModule: function (file) {
    var config = this.data.paramConfigs[file];
    if (config) {
      switch (config.type) {
        case 'bazi':
          this.setData({ showBaziForm: true });
          break;
        case 'generic':
          this.setData({ showGenericForm: true, genericLabel: config.label, genericInput: '' });
          break;
        case 'image':
          this.setData({ showImageForm: true });
          break;
      }
    } else {
      // 默认显示通用输入
      this.setData({ showGenericForm: true, genericLabel: '请输入相关参数', genericInput: '' });
    }
  },

  // === 输入事件 ===
  onYearInput: function (e) { this.setData({ birthYear: e.detail.value }); },
  onMonthInput: function (e) { this.setData({ birthMonth: e.detail.value }); },
  onDayInput: function (e) { this.setData({ birthDay: e.detail.value }); },
  onHourInput: function (e) { this.setData({ birthHour: e.detail.value }); },
  onGenderChange: function (e) { this.setData({ genderIndex: e.detail.value, gender: e.detail.value === 0 ? '' : (e.detail.value === 1 ? 'male' : 'female') }); },
  onGenericInput: function (e) { this.setData({ genericInput: e.detail.value }); },

  onHourPickerChange: function (e) {
    this.setData({ hourIndex: e.detail.value, birthHour: String(e.detail.value) });
  },

  onGenderPickerChange: function (e) {
    this.setData({ genderIndex: e.detail.value, gender: e.detail.value === 0 ? '' : (e.detail.value === 1 ? 'male' : 'female') });
  },

  onChooseImage: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        self.setData({ imagePath: res.tempFilePaths[0] });
      }
    });
  },

  // === 测算 ===
  onCalculate: function () {
    var params = this.buildParams();
    if (!params) return;

    var self = this;
    this.setData({ loading: true, hasResult: false, errorMsg: '' });

    // 图片上传特殊处理
    if (this.data.showImageForm && this.data.imagePath) {
      this.doImageAnalyze();
      return;
    }

    fortune.getFortuneResult(this.data.moduleFile, params).then(function (data) {
      self.setData({ loading: false, hasResult: true, result: data });
      // 保存历史
      var summary = self.extractSummary(data);
      fortune.saveHistory(self.data.moduleName, self.data.moduleFile, summary);
    }).catch(function (err) {
      self.setData({ loading: false, errorMsg: err.message || '测算失败，请重试' });
    });
  },

  doImageAnalyze: function () {
    var self = this;
    api.uploadFile('/api/image-analyze', this.data.imagePath, {
      module: this.data.moduleFile
    }).then(function (data) {
      self.setData({ loading: false, hasResult: true, result: data });
    }).catch(function (err) {
      self.setData({ loading: false, errorMsg: err.message || '图片分析失败' });
    });
  },

  buildParams: function () {
    var file = this.data.moduleFile;

    if (this.data.showBaziForm) {
      var year = this.data.birthYear.trim();
      var month = this.data.birthMonth.trim();
      var day = this.data.birthDay.trim();
      if (!year || !month || !day) {
        wx.showToast({ title: '请填写完整的出生日期', icon: 'none' }); return null;
      }
      return {
        year: parseInt(year), month: parseInt(month), day: parseInt(day),
        hour: parseInt(this.data.birthHour) || 0,
        gender: this.data.gender || 'male',
        calendar: this.data.calendar
      };
    }

    if (this.data.showGenericForm && this.data.genericInput.trim()) {
      return { query: this.data.genericInput.trim() };
    }

    // 默认：无参数，POST 空对象
    return {};
  },

  extractSummary: function (data) {
    if (!data) return '';
    if (typeof data === 'string') return data.substring(0, 200);
    return (data.result || data.summary || data.message || JSON.stringify(data).substring(0, 200));
  },

  // === 收藏 ===
  onToggleFavorite: function () {
    if (!auth.isLoggedIn()) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    var self = this;
    fortune.toggleFavorite(this.data.moduleName, this.data.moduleFile).then(function (r) {
      if (r.favorited !== undefined) {
        self.setData({ isFavorite: r.favorited });
        wx.showToast({ title: r.message || (r ? '已收藏' : '已取消'), icon: 'none' });
      }
    }).catch(function () {});
  },

  // === 分享 ===
  onShareResult: function () {
    wx.showToast({ title: '请使用右上角分享', icon: 'none' });
  }
});
