/**
 * 二手房源列表路由
 */

// 二手房源基础页面
const SecondHouseIndex = () => import('./SecondHouseIndex');
//  二手房源列表
const SecondHouseList = () => import('./SecondHouseList');
// 二手房房源详情
const SecondHouseDetail = () => import('./SecondHouseDetail');
const HouseTableList = () => import('./HouseTableList');
export default {
    path: '/secondHouse',
    name: 'SecondHouseIndex',
    component: SecondHouseIndex,
    children: [
        {
            path: 'secondHouseList',
            name: 'SecondHouseList',
            component: SecondHouseList,
            meta: {
                tit: '二手房源列表'
            }
        },
        {
            path: 'secondHouseDetail',
            name: 'secondHouseDetail',
            component: SecondHouseDetail,
            meta: {
                tit: '二手房源详情'
            }
        },
        {
            path: 'HouseTableList',
            name: 'HouseTableList',
            component: HouseTableList,
            meta: {
                tit: '二手房源详情'
            }
        }
    ]
};