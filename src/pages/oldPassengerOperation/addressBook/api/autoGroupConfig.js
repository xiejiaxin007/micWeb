/*
 * @Name: 微信好友自动分组配置页
 * @Author: wangshuaixue
 * @Date: 2019-11-13
 */

import {
    axios
} from '@/assets/js/http/axios';

// 分组启停配置api
const startEndApi = '/backend-api/we-chat-manage/group-status-config';
// 自动分组配置列表
const autoGroupListApi = '/backend-api/we-chat-manage/group-config-list';

/**
 * @description: 分组启停配置
 * @param {Object} params 参数
 * @param {string} params.id 配置id
 * @param {string} params.is_open 启停状态（1-启用 2-停用）
 * @return: {promise}
 */
const groupStartEnd = (params) => axios.post(startEndApi, params);

/**
 * @description: 获取自动分组配置列表
 * @param {Object} params 参数
 * @param {string} params.group_name 分组名称
 * @param {string} params.key_word	关键词
 * @param {string} params.group	分组
 * @param {string} params.is_open	是否启用（1.启用 2.停用）
 * @param {string} params.priority	优先级
 * @param {string} params.creator	创建人
 * @return: {promise}
 */
const getAutoGroupList = (params) => axios.post(autoGroupListApi, params);

export default {
    groupStartEnd,
    getAutoGroupList
};
