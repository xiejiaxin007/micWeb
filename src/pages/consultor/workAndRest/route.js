/*
 * @Name: 上户排班路由存放页面
 * @Description: 存放上户排班所有页面组件路径
 * @Author: kangxue
 * @Date: 2020-04-28
 */
const Index = () => import('./Index');
const WorkRestManage = () => import('./WorkRestManage');
export default {
    path: 'workRest',
    name: 'workRest',
    component: Index,
    children: [
        {
            path: 'workRestManage',
            name: 'workRestManage',
            component: WorkRestManage,
            meta: {
                tit: '排班管理'
            }
        }
    ]
}
