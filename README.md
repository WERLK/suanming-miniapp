# 玄机算命 - 微信小程序

基于微信原生框架开发的玄机算命网小程序版本，连接现有 Flask 后端 API。

## 项目规模

| 维度 | 数量 |
|------|------|
| 总文件 | 103 个 |
| 页面 | 15 个（4 TabBar + 11 子页面） |
| 组件 | 5 个（广告弹窗、转盘、工具卡片、会员徽章、分类折叠） |
| 广告插件 | 3 个（微信激励视频 + Banner + 百度预留） |
| 算命模块 | 20 分类 204 工具 |
| 后端改动 | 零 |

## 技术栈

- **框架**: 微信原生 (WXML / WXSS / JS)
- **主题**: 暗色系 (#0f0c29 bg, #ffd700 accent)
- **API**: wx.request 封装 → https://xuanjisuanming.top
- **认证**: JWT Token 透传，wx.storage 持久化

## 多广告商架构

支持可插拔广告商插件，按优先级调度：

```
AdManager
├── wechat-rewarded-video (优先级 1)
├── baidu-ad              (优先级 2)
└── fallback              (降级倒计时)
```

后续添加新广告商只需：
1. 在 `ad-providers/` 创建实现文件
2. 在 `app.js` 中 `manager.register()`

## 快速开始

1. 导入微信开发者工具
2. 修改 `project.config.json` → `appid` 为你的 AppID
3. 修改 `app.js` → 替换 `adunit-xxxxxxxxxxxxx` 为真实广告位 ID
4. 开始调试预览

## 目录结构

```
suanming-miniapp/
├── app.js, app.json, app.wxss     # 入口、配置、全局样式
├── project.config.json             # 项目配置
├── utils/                          # 工具模块
│   ├── api.js                      # wx.request 封装
│   ├── auth.js                     # 认证管理
│   ├── ad-manager.js               # 多广告商管理器
│   ├── fortune.js                  # 算命 API
│   └── storage.js                  # 存储工具
├── ad-providers/                   # 广告商插件
├── components/                     # UI 组件
│   ├── ad-modal/                   # 广告弹窗
│   ├── wheel-canvas/               # Canvas 转盘
│   ├── fortune-card/               # 工具卡片
│   ├── vip-badge/                  # 会员徽章
│   └── category-section/           # 分类折叠
├── pages/                          # 页面
│   ├── index, more, vip, profile   # TabBar
│   ├── login, register             # 登录注册
│   └── history, favorites, ...     # 子页面
└── data/module-list.js             # 204 模块数据
```

## 后端 API 兼容

所有 API 端点与现有 Flask 后端完全兼容，无需任何修改。小程序使用 `wx.request` 替代 `fetch`，自动注入 JWT Token，自动处理 401 认证过期。
