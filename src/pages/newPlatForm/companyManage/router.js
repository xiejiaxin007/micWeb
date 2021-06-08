/*
 * @author: hewei
 * @Date: 2020-11-10 11:36:10
 * @LastEditors: hewei
 * @LastEditTime: 2020-11-24 10:06:18
 * @description: file content
 */
/**
 * 加盟组织路由
 */

// 加盟组织结构基础页面
const CompanyManageIndex = () => import('./CompanyManageIndex');
const CompanyManageList = () => import('./CompanyManageList');
const PeopleList = () => import('./PeopleList');
const AddEmployee = () => import('./AddEmployee');
const CompanySaleGoalList = () => import('./CompanySaleGoalList');
const AddSaleGoal = () => import('./AddSaleGoal');
// 上户优先级配置列表
const PriorityConfigList = () => import('./PriorityConfigList');
// 上户优先级配置添加、编辑
const EditPriorityConfig = () => import('./EditPriorityConfig')
// 跨公司订单转移
const TransferOrder = () => import('./TransferOrder');

export default {
    path: '/companyManage',
    name: 'companyManageIndex',
    component: CompanyManageIndex,
    children: [
        {
            path: 'companyManageList',
            name: 'CompanyManageList',
            component: CompanyManageList,
            meta: {
                tit: '加盟公司列表'
            }
        },
        {
            path: 'peopleList',
            name: 'peopleList',
            component: PeopleList,
            meta: {
                tit: '人员列表'
            }
        },
        {
            path: 'addEmployee',
            name: 'AddEmployee',
            component: AddEmployee,
            meta: {
                tit: '新建人员'
            }
        },
        {
            path: 'companySaleGoalList',
            name: 'CompanySaleGoalList',
            component: CompanySaleGoalList,
            meta: {
                tit: '公司上户目标'
            }
        },
        {
            path: 'addSaleGoal',
            name: 'AddSaleGoal',
            component: AddSaleGoal,
            meta: {
                tit: '添加上户目标'
            }
        },
        {
            path: 'priorityConfigList',
            name: 'PriorityConfigList',
            component: PriorityConfigList,
            meta: {
                tit: '上户优先级'
            }
        },
        {
            path: 'editPriorityConfig',
            name: 'EditPriorityConfig',
            component: EditPriorityConfig,
            meta: {
                tit: '添加配置'
            }
        },
        {
            path: 'transferOrder',
            name: 'TransferOrder',
            component: TransferOrder,
            meta: {
                tit: '跨公司转移订单'
            }
        }
    ]
};