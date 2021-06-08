/**
 * 虚拟号列表路由
 */

// 虚拟号基础页面
const VirtualNumberIndex = () => import('./VirtualNumberIndex');
//  虚拟号库存列表
const VirtualNumStock = () => import('./VirtualNumStock');
//  添加虚拟号
const VirtualAddNum = () => import('./VirtualAddNum');
//  虚拟号明细列表
const VirtualBindDetail = () => import('./VirtualNumBindDetail');

export default {
    path: '/virtualNum',
    name: 'virtualNumberIndex',
    component: VirtualNumberIndex,
    children: [
        {
            path: 'virtualNumStock',
            name: 'VirtualNumStock',
            component: VirtualNumStock,
            meta: {
                tit: '虚拟号库存'
            }
        },
        {
            path: 'virtualAddNum',
            name: 'VirtualAddNum',
            component: VirtualAddNum,
            meta: {
                tit: '添加虚拟号'
            }
        },
        {
            path: 'virtualBindDetail',
            name: 'virtualBindDetail',
            component: VirtualBindDetail,
            meta: {
                tit: '虚拟号绑定明细'
            }
        }
    ]
};