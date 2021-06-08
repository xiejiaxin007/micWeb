/**
 * 开发商路由
 */

 // 开发商基础页
const DeveloperIndex = () => import('./DeveloperIndex')
// 开发商页面
const DeveloperManagement = () => import('./DeveloperManagement')
// 增加或修改开发商
const DeveloperAddModify = () => import('./DeveloperAddModify')
// 余额详情页
const DetailBalance = () => import('./DetailBalance')
// 开发商订单规则管理
const OrderRuleManage = () => import('./OrderRuleManage')
export default {
    path: '/developer',
    name: 'developerIndex',
    component: DeveloperIndex,
    children: [
        {
            path: 'developerManagement',
            name: 'DeveloperManagement',
            component: DeveloperManagement,
            meta: {
                tit: '开发商管理'
            }
        },
        {
            path: 'developerAddModify',
            name: 'DeveloperAddModify',
            component: DeveloperAddModify,
            meta: {
                tit: '编辑开发商'
            }
        },
        {
            path: 'detailBalance',
            name: 'DetailBalance',
            component: DetailBalance,
            meta: {
                tit: '开发商余额详情'
            }
        },
        {
            path: 'orderRuleManage',
            name: 'OrderRuleManage',
            component: OrderRuleManage,
            meta: {
                tit: '订单规则管理'
            }
        }
    ]
}
