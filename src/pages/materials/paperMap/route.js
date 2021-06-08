const PaperIndex = () => import('./PaperIndex.vue');
// 纸质地图页面
const CutoutIndex = () => import('./CutoutIndex.vue');
// 纸质地图列表
const CutoutList = () => import('./CutoutList.vue');
export default {
    path: '/paper',
    name: 'paperIndex',
    component: PaperIndex,
    children: [
        {
            path: 'cutoutIndex',
            name: 'cutoutIndex',
            component: CutoutIndex,
            meta: {
                tit: '纸质地图',
                header: 'hide',
                footer: 'hide',
                menu: 'hide'
            }
        },
        {
            path: 'cutoutList',
            name: 'CutoutList',
            component: CutoutList,
            meta: {
                tit: '纸质地图列表页'
            }
        }
    ]
}
