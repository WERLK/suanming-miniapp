Component({
  properties: {
    name: { type: String, value: '' },
    icon: { type: String, value: '🔮' },
    desc: { type: String, value: '' },
    colorClass: { type: String, value: '' },
    sizeClass: { type: String, value: '' },
    isNew: { type: Boolean, value: false },
    moduleFile: { type: String, value: '' },
    moduleName: { type: String, value: '' }
  },
  methods: {
    onTap: function () {
      var moduleFile = this.properties.moduleFile || '';
      var moduleName = this.properties.moduleName || this.properties.name || '';

      if (!moduleFile && !moduleName) return;

      // 跳转到模块详情页
      var url = '/pages/module/module';
      if (moduleFile) {
        url += '?file=' + encodeURIComponent(moduleFile);
      }
      if (moduleName) {
        url += (url.indexOf('?') > -1 ? '&' : '?') + 'name=' + encodeURIComponent(moduleName);
      }

      wx.navigateTo({ url: url });
    }
  }
});
