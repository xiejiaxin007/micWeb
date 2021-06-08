import {
    GET_ARTICLE_INFO,
    GET_COMMU
} from './mutation-types';

export default {
    // 获取找房工具文章页楼盘信息
    get_article_info ({commit}, data) {
        commit(GET_ARTICLE_INFO, data)
    },
    // 获取通勤地址
    get_commu ({commit}, data) {
        commit(GET_COMMU, data)
    }
}