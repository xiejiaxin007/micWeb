/*
 * @Name: 直播间路由文件
 * @Description: 存放直播间所有页面组件路径
 * @Author: xiejiaxin
 * @Date: 2020-02-16
 */
const LiveRoomIndex = () => import('./LiveRoomIndex.vue');
const LiveRoomShare = () => import('./LiveRoomShare.vue');
export default {
	path: '/',
    name: 'liveRoomIndex',
    component: LiveRoomIndex,
    children: [
        {
            path: '/liveRoom',
            name: 'liveRoom',
            component: LiveRoomShare,
            meta: {
                tit: '视频看房'
            }
        }
    ]
}