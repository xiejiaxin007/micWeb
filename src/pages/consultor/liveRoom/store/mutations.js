import {
    GET_CURRENT_STEP,
    SET_HOUSE_LIST,
    SET_SCREEN_SHARE,
    SET_OEDER_ID,
    SET_PERSON_OBJ,
    SET_DRAFT_INFO,
    SET_ROOM_LIST,
    SET_MINI_PROGRAM_QRCODE
} from './mutation-types';

export default {
    // 获取当前步骤对象
    [GET_CURRENT_STEP] (state, data) {
        state.currentStep = data;
    },
    // 获取修改楼盘
    [SET_HOUSE_LIST] (state, data) {
        state.lookHouseList = data;
    },
    // 修改共享屏幕状态
    [SET_SCREEN_SHARE] (state, data) {
        state.screenSharing = data;
    },
    // 保存订单ID
    [SET_OEDER_ID] (state, data) {
        state.orderId = data;
    },
    // 设置使用咨询师
    [SET_PERSON_OBJ] (state, data) {
        state.personObj = data;
    },
    // 保存草稿
    [SET_DRAFT_INFO] (state, data) {
        state.draftInfo = data;
    },
    // 保存直播间用户列表
    [SET_ROOM_LIST](state, data) {
        state.roomList = data;
    },
    // 保存小程序二维码
    [SET_MINI_PROGRAM_QRCODE](state, data) {
        state.miniProgramQrcode = data;
    }
}
