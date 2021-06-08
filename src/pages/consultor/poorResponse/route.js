/*
 * @Name: 响应差2.0路由存放页面
 * @Description: 存放响应差2.0所有页面组件路径
 * @Author: kangxue
 * @Date: 2020-05-11
 */
const Index = () => import('./Index');
const PoorResponseManage = () => import('./PoorResponseManage');
export default {
    path: 'poorResponse',
    name: 'poorResponse',
    component: Index,
    children: [{
        path: 'poorResponseManage',
        name: 'PoorResponseManage',
        component: PoorResponseManage,
        meta: {
            tit: '响应任务管理'
        }
    }]
}
