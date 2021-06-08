/**
 * 业绩相关路由
 */
const Performance = () => import('./PerformanceIndex')
const AccountingAudit = () => import('./AccountingAudit')
const PerformanceRiskList = () => import('./PerformanceRiskList')
const ComplainList = () => import('./ComplainList')
const Complain = () => import('./Complain')
export default {
  path: 'performance',
  name: 'performance',
  component: Performance,
  children: [
    {
      path: 'accountAudit',
      name: 'AccountAudit',
      component: AccountingAudit,
      meta: {
        tit: '业绩核算风控审核页面'
      }
    },
    {
      path: 'performanceRiskList',
      name: 'PerformanceRiskList',
      component: PerformanceRiskList,
      meta: {
        tit: '业绩核算风控管理'
      }
    },
    {
      path: 'complainList',
      name: 'ComplainList',
      component: ComplainList,
      meta: {
        tit: '投诉管理'
      }
    },
    {
      path: 'complain',
      name: 'Complain',
      component: Complain,
      meta: {
        tit: '新增投诉'
      }
    }
  ]
}
