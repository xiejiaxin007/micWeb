/*
 * @Name: 未分组页面接口
 * @Description: 未分组页面接口
 * @Author: baiyunfei
 * @Date: 2019-09-29 14:51:39
 * @Editors: baiyunfei
 */

import {
    axios
} from '@/assets/js/http/axios';


// 获取为分组接口URL
const getTodoUrl = '/backend-api/we-chat-manage/group-todo';
// 批量保存分组URL
const batchSaveUrl = '/backend-api/we-chat-manage/batch-bind-group';

/**
 * @description: 获取为分组接口
 * @param {Object} params 参数
 * @param {string} params.employee_id 咨询师id
 * @param {string} params.page 页码
 * @param {string} params.page_size 分页大小
 * @return: {promise}
 */
const getTodoGroup = (params) => axios.post(getTodoUrl, params);
/**
 * @description: 批量保存分组接口
 * @param {Object} params 参数
 * @param {string} params.employee_id 咨询师id
 * @param {Array} params.group_data 分组数据
 * @param {string} params.group_data.group_id 分组数据
 * @param {string} params.group_data.group_type 分组类型
 * @return: 
 */
const saveGroupPromise = (params) => axios.post(batchSaveUrl, params);

export default {
    getTodoGroup,
    saveGroupPromise
};
