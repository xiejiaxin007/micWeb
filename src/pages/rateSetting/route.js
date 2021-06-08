/*
 * 城市开站路由配置
* */
const RateIndex = () => import('./RateIndex')
const RateSettingList = () => import('./RateSettingList')
const RateEditSetting = () => import('./RateEditSetting')

export default {
  path: 'rate',
  name: 'rateIndex',
  component: RateIndex,
  children: [
    {
      path: 'rateSettingList',
      name: 'rateSettingList',
      component: RateSettingList,
      meta: {
        tit: '目标费率配置列表'
      }
    },
    {
      path: 'rateEditSetting',
      name: 'rateEditSetting',
      component: RateEditSetting,
      meta: {
        tit: '目标费率配置编辑'
      }
    }
  ]
}

