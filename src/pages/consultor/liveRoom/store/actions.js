import {
    GET_CURRENT_STEP,
    SET_HOUSE_LIST,
    SET_SCREEN_SHARE,
    SET_OEDER_ID,
    SET_PERSON_OBJ,
    SET_DRAFT_INFO
} from './mutation-types';

export default {
    // 获取步骤对象
    get_current_step ({commit}, data) {
        commit(GET_CURRENT_STEP, data)
    },
    // 获取改变楼盘
    set_house_list({commit}, data) {
        commit(SET_HOUSE_LIST, data)
    },
    // 改变屏幕分享状态
    set_screen_share({commit}, data) {
        commit(SET_SCREEN_SHARE, data)
    },
    // 修改订单ID
    set_order_id({commit}, data) {
        commit(SET_OEDER_ID, data)
    },
    // 设置使用对象
    set_person_obj({commit}, data) {
        commit(SET_PERSON_OBJ, data)
    },
    // 保存草稿
    set_draft_info({commit}, data) {
        commit(SET_DRAFT_INFO, data)
    }
}