/*
 * @author: kangxue
 * @Date: 2020-07-10 14:10:15
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-15 13:59:34
 * @description: 客诉流程线上化的路由配置文件
 */
const Index = () => import('./Index');
const ComplaintList = () => import('./ComplaintList');
const AddComplaint = () => import('./AddComplaint');
const FollowComplaint = () => import('./FollowComplaint');
const FollowUpEmployeeList = () => import('./FollowUpEmployeeList');

export default {
    path: 'complaint',
    name: 'complaint',
    component: Index,
    children: [
        {
            path: 'complaintList',
            name: 'complaintList',
            component: ComplaintList,
            meta: {
                tit: '客诉问题管理'
            }
        },
        {
            path: 'addComplaint',
            name: 'addComplaint',
            component: AddComplaint,
            meta: {
                tit: '新建客诉问题'
            }
        },
        {
            path: 'editComplaint',
            name: 'editComplaint',
            component: AddComplaint,
            meta: {
                tit: '编辑客诉问题'
            }
        },
        {
            path: 'followComplaint',
            name: 'followComplaint',
            component: FollowComplaint,
            meta: {
                tit: '跟进查看客诉问题'
            }
        },
        {
            path: 'followUpEmployeeList',
            name: 'followUpEmployeeList',
            component: FollowUpEmployeeList,
            meta: {
                tit: '客诉跟进人管理'
            }
        }
    ]
}
