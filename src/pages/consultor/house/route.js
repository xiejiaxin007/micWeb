/*
 * @Name: 找房工具路由文件
 * @Description: 存放找房工具所有页面组件路径
 * @Author: wangshuaixue
 * @Date: 2019-12-19
 */
const ScreenPage = () => import(/* webpackChunkName: "ScreenPage" */'./ScreenPage');
const SingleHouseShare = () => import(/* webpackChunkName: "SingleHouseShare" */'./SingleHouseShare');
const MoreHouseShare = () => import(/* webpackChunkName: "MoreHouseShare" */'./MoreHouseShare');
const ChooseHouseContrast = () => import('./ChooseHouseContrast');
const HouseContrasts = () => import('./HouseContrast');
const HousePurchaseKnowledge = () => import('./HousePurchaseKnowledge');
const SearchToolIndex = () => import('./SearchToolIndex.vue');
export default {
	path: '/',
    name: 'searchToolIndex',
    component: SearchToolIndex,
    children: [
        {
            path: '/screenPage',
            name: 'screenPage',
            component: ScreenPage,
            meta: {
                tit: '地图找房'
            }
        },
        {
            path: '/singleHouseShare',
            name: 'singleHouseShare',
            component: SingleHouseShare,
            meta: {
                tit: '单楼盘分享'
            }
        },
        {
            path: '/moreHouseShare',
            name: 'moreHouseShare',
            component: MoreHouseShare,
            meta: {
                tit: '多楼盘分享'
            }
        },
        {
            path: '/chooseHouseContrast',
            name: 'chooseHouseContrast',
            component: ChooseHouseContrast,
            meta: {
                tit: '选择楼盘对比'
            }
        },
        {
            path: '/houseContrasts',
            name: 'houseContrasts',
            component: HouseContrasts,
            meta: {
                tit: '楼盘对比'
            }
        },
        {
            path: '/housePurchaseKnowledge',
            name: 'housePurchaseKnowledge',
            component: HousePurchaseKnowledge,
            meta: {
                tit: '购房知识'
            }
        }
    ]
}