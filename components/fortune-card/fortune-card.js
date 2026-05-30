Component({
  properties: {
    name: { type: String, value: '' },
    icon: { type: String, value: '🔮' },
    path: { type: String, value: '' },
    isNew: { type: Boolean, value: false },
    isHot: { type: Boolean, value: false },
    category: { type: String, value: '' }
  },
  methods: {
    onTap: function () {
      this.triggerEvent('navigate', {
        name: this.properties.name,
        path: this.properties.path,
        category: this.properties.category
      });
    }
  }
});
