/*
 * @Name: 编辑自动分组页
 * @Author: wangshuaixue
 * @Date: 2019-11-13
 */

import {
    axios
} from '@/assets/js/http/axios';

// 初始化分组配置
const initializeApi = '/backend-api/we-chat-manage/init-group-config';
// 自动分组配置保存
const autoGroupSaveApi = '/backend-api/we-chat-manage/group-config-save';

/**
 * @description: 分组启停配置
 * @param {Object} params 参数
 * @param {string} params.id 配置id
 * @return: {promise}
 */
const getinitialize = (params) => axios.get(initializeApi, {params})

/**
 * @description: 获取自动分组配置列表
 * @param {Object} params 参数
 * @param {string} params.title 名称
 * @param {array}  params.key_words 关键词
 * @param {string} params.group_type	分组类型
 * @param {string} params.priority	优先级
 * @param {string} params.is_open	是否启用 1-启用 2-停用
 * @return: {promise}
 */
const autoGroupSave = (params) => axios.post(autoGroupSaveApi, params);

export default {
    getinitialize,
    autoGroupSave
};
