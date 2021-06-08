/*
 * @Name: 直播间公共方法
 * @Description: 直播间公共方法
 * @Author: xiejiaxin
 * @Date: 2020-3-4
 */
import api from '../../api/shareMaterialApi';
import store from '@/store';
import { Message, Loading } from 'element-ui';
import { commonFun } from '@/assets/js/utils/utils';
export default{
    /**
     * 根据当前步骤条类型请求相应数据
     * @param {Object} params
     * @param {String} params.materialsType 步骤类型
     * @param {String} params.seeProId 带看ID
     * @param {String} params.roomId roomID
     * @param {Boolean} params.noLoading 是否需要loading，因为弹窗也调用这个方法，弹窗不需要loading，否则会出现样式重叠
     */
    async getStepInfo(params) {
        let loading = null;
        if (!params.noLoading) {
            loading = Loading.service({
                lock: true,
                text: '正在加载',
                spinner: 'el-icon-loading',
                customClass: 'loading-default-box',
                background: 'rgba(255, 255, 255, 0.8)'
            });
        }
        let param = {
            materials_type: params.materialsType,
            see_project_id: params.seeProId,
            room_id: params.roomId
        }
        try {
            let result = await api.getStepInfoByType(param);
            let {data} = result;
            if (!params.noLoading) {
                loading.close();
            }
            return data;
        } catch (error) {
            console.log(error);
            if (!params.noLoading) {
                loading.close();
            }
        }
    },
    /**
     * 请求开始计时和结束计时
     * @param {Object} params
     * @param {String} params.materialsType 步骤类型
     * @param {String} params.seeProId 带看ID
     * @param {String} params.roomId roomID
     * @param {String} params.status 步骤状态 2：正在进行，即开始计时，3：完成，即结束计时
     */
    async updateStep(params) {
        // 当前如果是所属咨询师，并且屏幕共享状态是false，则需要提示咨询师分享屏幕
        let belongFlag = store.state.liveRoom.personObj.employee_id === store.state.liveRoom.personObj.login_employee_id;
        if (belongFlag && !store.state.liveRoom.screenSharing) {
            Message({
                message: '请在屏幕共享状态下完成线上带看',
                type: 'error',
                duration: 0,
                showClose: true
            });
        }
        let loading = Loading.service({
            lock: true,
            text: '正在加载',
            spinner: 'el-icon-loading',
            customClass: 'loading-default-box',
            background: 'rgba(255, 255, 255, 0.8)'
        });
        try {
            let param = {
                materials_type: params.materialsType,
                see_project_id: params.seeProId,
                room_id: params.roomId,
                status: params.status
            };
            let result = await api.updateLookProgress(param);
            let {data} = result;
            if (data.code === 0) {
                // 埋点
                let obj = {
                    order_id: store.state.liveRoom.orderId,
                    adviser_id: store.state.trackCommon.info.login_employee_id,
                    tag_type: params.materialsType
                };
                if (params.materialsType !== '5') {
                    commonFun.setTrackNew('7201', obj);
                }
            }
            loading.close();
            return data;
        } catch (error) {
            loading.close();
            console.log(error);
        }
    }
};