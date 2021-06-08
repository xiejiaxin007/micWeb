/*
 * @Name: 线上工具模块
 * @Description: 存放线上工具不需要导航栏页面组件路径
 * @Author: xiejiaxin
 * @Date: 2020-2-22
 */
const OnlineToolParIndex = () => import('./OnlineToolParIndex.vue');
const TakeLookList = () => import('./TakeLookList.vue');
const MaterialPrepare = () => import('./MaterialPrepare.vue');

export default {
	path: '/',
    name: 'OnlineToolParIndex',
    component: OnlineToolParIndex,
    children: [
        {
            path: 'takeLookList',
            name: 'takeLookList',
            component: TakeLookList,
            meta: {
                tit: '线上带看准备清单'
            }
        },
        {
            path: 'materialPrepare',
            name: 'materialPrepare',
            component: MaterialPrepare,
            meta: {
                tit: '带看材料准备'
            }
        }
    ]
}