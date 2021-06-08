/*
 * @Name: 老客运营路由
 * @Description: 老客运营路由出口
 * @Author: baiyunfei
 * @Date: 2019-09-24 15:37:15
 * @Editors: baiyunfei
 */
const ToBound = () => import('./ToBound.vue');
const PendingGroup = () => import('./PendingGroupe.vue');
const AddressBookList = () => import('./AddressBookList.vue');
const AddressBook = () => import('./AddressBookIndex');
const WxChatContent = () => import('./WxChatContent.vue');
const WxFriendList = () => import('./WxFriendList.vue');
// 微信好友自动分组配置页
const AutoGroupConfig = () => import('./AutoGroupConfig.vue');
// 编辑自动分组页
const EditAutoGroup = () => import('./EditAutoGroup.vue');
export default {
    path: 'weChatAddressBook',
    name: 'weChatAddressBook',
    component: AddressBook,
    children: [{
            path: 'addressBookList',
            name: 'AddressBookList',
            component: AddressBookList,
            meta: {
                tit: '微信好友列表'
            }
        },
        {
            path: 'pendingGroup',
            name: 'PendingGroup',
            component: PendingGroup,
            meta: {
                tit: '待分组好友'
            }
        },
        {
            path: 'toBound',
            name: 'ToBound',
            component: ToBound,
            meta: {
                tit: '待绑定好友'
            }
        },
        {
            path: 'wxFriendList',
            name: 'wxFriendList',
            component: WxFriendList,
            meta: {
                tit: '微信好友管理列表'
            }
        },
        {
            path: 'wxChatContent',
            name: 'wxChatContent',
            component: WxChatContent,
            meta: {
                tit: '聊天内容'
            }
        },
        {
            path: 'autoGroupConfig',
            name: 'autoGroupConfig',
            component: AutoGroupConfig,
            meta: {
                tit: '微信好友自动分组配置页'
            }
        },
        {
            path: 'editAutoGroup',
            name: 'editAutoGroup',
            component: EditAutoGroup,
            meta: {
                tit: '编辑自动分组页'
            }
        }
    ]
}
