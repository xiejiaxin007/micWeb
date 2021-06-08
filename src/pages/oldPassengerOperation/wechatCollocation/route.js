/*
 * 微信托管路由
* */
const WechatIndex = () => import('./WechatIndex')
const WeChatMessage = () => import('./WeChatMessage')
const WeChatCollocationList = () => import('./WeChatCollocationList')

export default {
  path: 'wechat',
  name: 'wechatIndex',
  component: WechatIndex,
  children: [
    {
      path: 'weChatMessage',
      name: 'WeChatMessage',
      component: WeChatMessage,
      meta: {
        tit: '消息管理列表'
      }
    },
    {
      path: 'weChatCollocationList',
      name: 'WeChatCollocationList',
      component: WeChatCollocationList,
      meta: {
        tit: '微信托管列表'
      }
    }
  ]
}
