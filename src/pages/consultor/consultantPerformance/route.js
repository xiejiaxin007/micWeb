/*
 * @author: xiejiaxin
 * @Date: 2021-05-14 11:36:14
 * @LastEditors: xie bin
 * @LastEditTime: 2021-05-14 11:46:30
 * @description: 咨询师绩效相关页面
 */
// 父级路由
const Index = () => import('./Index.vue')
// 
const CoefficientAudit = () => import('./CoefficientAudit.vue')
export default {
    path: 'consultantPerformance',
    name: 'ConsultantPerformance',
    component: Index,
    children: [
		{
			path: 'coefficientAudit',
			name: 'CoefficientAudit',
			component: CoefficientAudit,
			meta: {
			tit: '提点积分审核列表'
			}
		}
    ]
}
