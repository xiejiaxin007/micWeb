/*
 * @author: wsx
 * @Date: 2019-08-07 14:12:01
 * @description:
 */
import Vue from 'vue';
import Router from 'vue-router';
// 引入各个模块的路由
// 渠道侧
import bankRepayment from '@/pages/channelSide/bankRepayment/route';
// 楼盘管理
import houseManage from '@/pages/propertySide/houseManage/route';
// 微信托管，用于离职咨询师微信利用
import wechatCollocation from '@/pages/oldPassengerOperation/wechatCollocation/route';
// 城市开站配置
import cityConfiguration from '@/pages/propertySide/cityConfiguration/route';
// 城市费率
import rateSetting from '@/pages/rateSetting/route';
// 楼盘管理
import riskManage from '@/pages/consultor/riskManage/route';
// 老客运营，包括咨询师微信好友管理
import addressBook from '@/pages/oldPassengerOperation/addressBook/route';
// 楼盘侧-人工审核-图片审核页面
import ManualReview from '@/pages/propertySide/manualReview/route';
// 评价
import Evaluate from '@/pages/consultor/evaluate/route';
// sop模块路由
import sopRoute from '@/pages/consultor/sop/route';
// 移动端楼盘侧
import mHouseSide from '@/pages/mobile/house/route';
// 移动端咨询师侧
import mConsultorSide from '@/pages/mobile/consultor/route';
// 咨询师侧 找房工具
import searchTool from '@/pages/consultor/house/route';
// 纸质地图
import PaperMap from '@/pages/materials/paperMap/route';
// 开发商模块
import developer from '@/pages/developer/route';
// 线上工具模块路由
import onlineTools from '@/pages/consultor/onlineTools/route';
import onlineToolsP from '@/pages/consultor/onlineTools/parentRoute';
// 回款管理
import fundsBack from '@/pages/channelSide/fundsBack/route';
// 响应差任务管理
import poorResponse from '@/pages/consultor/poorResponse/route';
// 直播间模块路由
import liveRoom from '@/pages/consultor/liveRoom/route';
// 智能报备序号规则管理模块
import numberRule from '@/pages/channelSide/numberRule/route';
// 线上成交模块路由
import trade from '@/pages/consultor/trade/route';
// 二手房源路由
import developerHouse from '@/pages/developerHouse/router';
// 上户排班模块路由
import workAndRest from '@/pages/consultor/workAndRest/route';
// 虚拟号路由
import virtualNumber from '@/pages/newPlatForm/virtualNumber/router';

// 质检——客诉流程线上化
import complaint from '@/pages/qualityControl/complaint/route';
// 合同管理
import contractManage from '@/pages/channelSide/contractManage/route';
// 营销中心——提报管理
import fetchActivity from '@/pages/marketingCenter/fetchActivity/route';
// 加盟组织结构
import companyManage from '@/pages/newPlatForm/companyManage/router';
// 咨询师绩效相关路由
import consultantPerformance from '@/pages/consultor/consultantPerformance/route';

// 渠道绩效
import channelPerfor from '@/pages/channelSide/channelPerformance/route';

const Login = () => import('@/pages/Login')
const Main = () => import('@/pages/Main')
const NoPermissions = () => import('@/pages/NoPermissions')

Vue.use(Router);

let option = {
    mode: 'history',
    base: '/dist/',
    routes: [{
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                tit: '登录'
            }
        },
        {
            path: '/noPermissions',
            name: 'NoPermissions',
            component: NoPermissions,
            meta: {
                tit: '无权限'
            }
        },
        {
            path: '/',
            component: Main,
            children: [
                // sop路由
                sopRoute,
                /* 渠道侧所有路由 */
                bankRepayment,
                houseManage, // 楼盘管理路由
                /* 微信托管 */
                wechatCollocation,
                /* 城市开站配置 */
                cityConfiguration,
                /* 风控 业绩相关 */
                riskManage,
                /* 老客运营的微信好友管理所有路由 */
                addressBook,
                /* 城市费率 */
                rateSetting,
                /* 人工审核 */
                ManualReview,
                // 评价
                Evaluate,
                // 纸质地图
                PaperMap,
                // 开发商模块
                developer,
                // 线上工具路由
                onlineTools,
                // 智能报备序号规则管理模块
                numberRule,
                // 二手房源
                developerHouse,
                // 上户排班路由
                workAndRest,
                // 回款管理
                fundsBack,
                // 响应差管理
                poorResponse,
                // 线上成交
                trade,
                // 虚拟号
                virtualNumber,
                // 客诉
                complaint,
                // 合同管理
                contractManage,
                // 营销中心——提报管理
                fetchActivity,
                // 加盟组织结构
                companyManage,
                // 咨询师绩效相关
                consultantPerformance,
                // 渠道绩效
                channelPerfor
            ]
        },
        /* 找房工具 */
        searchTool,
        /* 移动端楼盘侧 */
        mHouseSide,
        /* 移动端咨询师侧 */
        mConsultorSide,
        // 直播间路由
        liveRoom,
        // 线上带看工具不需导航页面
        onlineToolsP,
    /* 支撑系统移动端页面-----------end */
    // {
    //     path: '*',
    //     redirect: '/'
    // }
    ]
}
if (process.env.NODE_ENV == 'production') {
    Object.assign(option, {
        base: "/dist"
    })
}
let router = new Router(option);

// 重写路由的push方法，避免出现报错：Navigating to current location
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject)
    }
    return originalPush.call(this, location).catch(err => err)
}
// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置网页title
    if (to.meta) {
        document.title = to.meta.tit || '';
    }
    // 区分线上和测试环境，如果是正式环境，login路由无法使用
    let environment = process.env.NODE_ENV;
    if (environment === 'production') {
        if (to.path === '/login') {
            next({
                path: '/'
            });
        } else {
            next();
        }
    } else {
        next();
    }
});
router.afterEach((to, from) => {
    window.scrollTo(0, 0);
});
export default router;
