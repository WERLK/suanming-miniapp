Component({
  properties: {
    title: { type: String, value: '' },
    modules: { type: Array, value: [] },
    defaultExpanded: { type: Boolean, value: false }
  },
  data: {
    expanded: false
  },
  lifetimes: {
    attached: function () {
      this.setData({ expanded: this.properties.defaultExpanded });
    }
  },
  methods: {
    toggle: function () {
      this.setData({ expanded: !this.data.expanded });
    },
    onModuleTap: function (e) {
      var module = e.currentTarget.dataset.module;
      this.triggerEvent('select', module);
    }
  }
});
