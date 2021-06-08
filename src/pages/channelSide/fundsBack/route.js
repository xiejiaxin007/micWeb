/*
 * @Name: 回款管理路由存放页面
 * @Description: 存放回款所有页面组件路径
 * @Author: xiejiaxin
 * @Date: 2020-04-22
 */
const Index = () => import('./Index');
const FundsConfig = () => import('./FundsConfig');
const FundsConfigInfo = () => import('./FundsConfigInfo');
const FundsConfigEdit = () => import('./FundsConfigEdit');
const FundsFollow = () => import('./FundsFollow');
const EditFollowUp = () => import('./EditFollowUp');
const FundsBackFollow = () => import('./FundsBackFollow');
const DealFollow = () => import('./DealFollow');
const Approval = () => import('./Approval');

export default {
    path: 'fundsBack',
    name: 'fundsBack',
    component: Index,
    children: [
        {
            path: 'fundsConfig',
            name: 'fundsConfig',
            component: FundsConfig,
            meta: {
                tit: '回款流程配置管理页'
            }
        },
        {
            path: 'fundsConfigEdit',
            name: 'fundsConfigEdit',
            component: FundsConfigEdit,
            meta: {
                tit: '回款流程配置页'
            }
        },
        {
            path: 'fundsConfigInfo',
            name: 'fundsConfigInfo',
            component: FundsConfigInfo,
            meta: {
                tit: '回款流程查看页'
            }
        },
        {
            path: 'fundsFollow',
            name: 'fundsFollow',
            component: FundsFollow,
            meta: {
                tit: ''
            }
        },
        {
            path: 'editFollowUp',
            name: 'editFollowUp',
            component: EditFollowUp,
            meta: {
                tit: '回款流程跟进录入'
            }
        },
        {
            path: 'fundsBackFollow',
            name: 'fundsBackFollow',
            component: FundsBackFollow,
            meta: {
                tit: '回款组跟进记录页'
            }
        },
        {
            path: 'dealFollow',
            name: 'dealFollow',
            component: DealFollow,
            meta: {
                tit: '成交单跟进记录页'
            }
        },
        {
            path: 'approval',
            name: 'approval',
            component: Approval,
            meta: {
                tit: '回款流程跟进审批页'
            }
        }
    ]
}
