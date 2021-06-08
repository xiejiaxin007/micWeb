

const ServiceVoucherList = () => import('./ServiceVoucherList');
const ServiceVoucherDetail = () => import('./ServiceVoucherDetail');
const MobileLogin = () => import('./MobileLogin');
const UserSign = () => import('./UserSign');
const consultorIndex = () => import('./consultorIndex')
export default {
    path: '/',
    name: 'consultorIndex',
    component: consultorIndex,
    children: [
        {
            path: '/mobileLogin',
            name: 'mobileLogin',
            component: MobileLogin,
            meta: {
              tit: '钉钉登录页'
            }
        },
        {
            path: '/serviceVoucherList',
            name: 'serviceVoucherList',
            component: ServiceVoucherList,
            meta: {
                tit: '服务确认单'
            }
        },
        {
            path: '/serviceVoucherDetail',
            name: 'serviceVoucherDetail',
            component: ServiceVoucherDetail,
            meta: {
                tit: '服务确认单'
            }
        },
        {
            path: '/userSign',
            name: 'userSign',
            component: UserSign,
            meta: {
                tit: '用户签字'
            }
        }
    ]
  }