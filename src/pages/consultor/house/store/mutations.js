import {
    GET_ARTICLE_INFO,
    GET_COMMU
} from './mutation-types';

export default {
    // 更新找房工具文章页楼盘信息
    [GET_ARTICLE_INFO] (state, data) {
        state.articleProInfo = data
    },
    // 更新搜索的通勤地址---找房工具地图页面右侧
    [GET_COMMU] (state, data) {
        state.commuLoc = data
    }
}
