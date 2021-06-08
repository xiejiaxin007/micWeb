/*
 * @author: kangxue
 * @Date: 2020-08-12 10:42:56
 * @LastEditors: kangxue
 * @LastEditTime: 2020-08-20 13:53:29
 * @description: 结佣单据标准版1.0
 */ 
const Index = () => import('./Index');
const CommissionList = () => import('./CommissionList');
const CommissionInfo = () => import('./CommissionInfo');
const CommissionEditIn = () => import('./CommissionEditIn');
const CommissionBillsDetail = () => import('./CommissionBillsDetail');

export default {
    path: 'contract',
    name: 'contract',
    component: Index,
    children: [
        {
            path: 'commissionList',
            name: 'commissionList',
            component: CommissionList,
            meta: {
                tit: '结佣单据标准管理'
            }
        },
        {
            path: 'commissionInfo',
            name: 'commissionInfo',
            component: CommissionInfo,
            meta: {
                tit: '结佣单据标准详情页'
            }
        },
        {
            path: 'commissionHistory',
            name: 'commissionHistory',
            component: CommissionInfo,
            meta: {
                tit: '结佣单据标准详情历史页'
            }
        },
        {
            path: 'commissionEditIn',
            name: 'commissionEditIn',
            component: CommissionEditIn,
            meta: {
                tit: '结佣单据标准录入页'
            }
        },
        {
            path: 'commissionBillsDetail',
            name: 'commissionBillsDetail',
            component: CommissionBillsDetail,
            meta: {
                tit: '结佣单据详情页'
            }
        }
    ]
}
