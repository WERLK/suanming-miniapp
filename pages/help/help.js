Page({data:{faqs:[
  {q:'如何开始算命？',a:'在首页或更多页面选择您感兴趣的工具，填写必要的个人信息后点击"开始测算"即可。',expanded:false},
  {q:'八字排盘需要什么信息？',a:'需要您的出生年月日、具体时辰和性别。时辰不确定可选默认值。使用公历（阳历）日期。',expanded:false},
  {q:'如何获得VIP会员？',a:'通过每日签到、观看广告或转盘抽奖可以获得VIP时长。累计观看20次广告或使用500积分兑换永久会员。',expanded:false},
  {q:'积分如何使用？',a:'积分可通过签到和转盘获得。可在会员中心兑换免广卡、VIP时长或永久会员等多种奖励。',expanded:false},
  {q:'如何看广告？',a:'在会员中心点击"看广告"按钮，完成任务后会自动获得VIP时长奖励。',expanded:false},
  {q:'算命的准确度如何？',a:'本平台结合传统命理算法与现代AI分析技术，提供参考性结果。命理之说仅供参考，请理性对待。',expanded:false},
  {q:'收藏功能怎么用？',a:'在任意工具页面点击收藏按钮即可收藏。收藏的工具会出现在"我的收藏"中方便查找。',expanded:false},
  {q:'忘记密码怎么办？',a:'目前请联系客服或通过注册时绑定的邮箱找回。',expanded:false}
]},onToggle:function(e){var i=e.currentTarget.dataset.index;this.data.faqs[i].expanded=!this.data.faqs[i].expanded;this.setData({faqs:this.data.faqs})}});
