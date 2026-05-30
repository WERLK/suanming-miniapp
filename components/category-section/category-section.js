Component({
  properties: {
    title: { type: String, value: '' },
    icon: { type: String, value: '📦' },
    modules: { type: Array, value: [] }
  },
  data: {
    expanded: false
  },
  methods: {
    onToggle: function () {
      this.setData({ expanded: !this.data.expanded });
    }
  }
});
