/**
 * 评价路由
 */

// 评价主页
const EvaluateIndex = () => import('./EvaluateIndex')
// 评价配置
const SettingList = () => import('./SettingList')
// 编辑配置
const EditSetting = () => import('./EditSetting')
export default {
    path: 'evaluate',
    name: 'Evaluate',
    component: EvaluateIndex,
    children: [
      {
        path: 'settingList',
        name: 'SettingList',
        component: SettingList,
        meta: {
          tit: '评价配置'
        }
      },
      {
        path: 'editSetting',
        name: 'EditSetting',
        component: EditSetting,
        meta: {
          tit: '编辑配置'
        }
      }
    ]
}
