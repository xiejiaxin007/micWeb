/**
 * @file 路由文件
 * @description 线上认购列表路由
 * @author hewei
 * @createDate 2020-05-08
 */
const TradeIndex = () => import('./TradeIndex');
const SubscribeList = () => import('./SubscribeList');

export default {
  path: 'dealOnline',
  name: 'DealOnline',
  component: TradeIndex,
  children: [
    {
      path: 'subscribeList',
      name: 'SubscribeList',
      component: SubscribeList,
      meta: {
        tit: '线上认购列表'
      }
    }
  ]
}
