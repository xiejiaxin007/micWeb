/*
 * @Name: 线上工具模块
 * @Description: 存放线上工具所有页面组件路径
 * @Author: xiejiaxin
 * @Date: 2020-2-22
 */
const OnlineToolsIndex = () => import('./OnlineToolsIndex.vue');
const MaterialManage = () => import('./MaterialManage.vue');
const ExamineList = () => import('./ExamineList.vue');
const EditOnlineMaterial = () => import('./EditOnlineMaterial.vue');


export default {
	path: '/onlineTools',
    name: 'onlineToolsIndex',
    component: OnlineToolsIndex,
    children: [
        {
            path: 'materialManage',
            name: 'materialManage',
            component: MaterialManage,
            meta: {
                tit: '线上带看材料管理'
            }
        },
        {
            path: 'examineList',
            name: 'examineList',
            component: ExamineList,
            meta: {
                tit: '线上带看审核'
            }
        },
        {
            path: 'editOnlineMaterial',
            name: 'editOnlineMaterial',
            component: EditOnlineMaterial,
            meta: {
                tit: '编辑线上带看材料'
            }
        }
    ]
}