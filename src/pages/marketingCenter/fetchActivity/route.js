/*
 * @author: kangxue
 * @Date: 2020-09-03 19:33:31
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-09-04 00:09:12
 * @description: 提报管理路由文件
 */
const Index = () => import('./Index');
const ReportList = () => import('./ReportList');
const ActivityList = () => import('./ActivityList.vue');

export default {
    path: 'activity',
    name: 'activity',
    component: Index,
    children: [
        {
            path: 'reportList',
            name: 'reportList',
            component: ReportList,
            meta: {
                tit: '提报管理'
            }
        },
        {
            path: 'activityList',
            name: 'activityList',
            component: ActivityList,
            meta: {
                tit: '活动管理列表'
            }
        }
    ]
}
