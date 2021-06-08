/*
 * @author: hewei
 * @Date: 2021-05-14 14:27:02
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-18 10:55:36
 * @description: file content
 */

import {
    axios
} from '@/assets/js/http/axios';

// 合作楼盘历史记录列表初始化接口
const cooperateListInitApi = '/backend-api/expand/project-co/list-init';

// 合作楼盘历史记录列表接口
const cooperateListApi = '/backend-api/expand/project-co/list';







/**
 * @description: 获取转直签详情信息
 * @param {string} params.id	合同ID
 */
const cooperateListInit = () => axios.get(cooperateListInitApi);

/**
 * @description: 获取合作楼盘历史记录列表信息
 * @param {string} params.page	页码
 * @param {string} params.perPage	每页多少条
 * @param {string} params.project_id	楼盘id
 * @param {string} params.cooperate_type	合作方式
 * @param {string} params.follow_employee_id	合同跟进人
 * @param {string} params.record_month_start	记录开始月份
 * @param {string} params.record_month_end	记录结束月份
 * @param {string} params.mark_new	标记新增
 */
const getCooperateList = (params) => axios.get(cooperateListApi, { params });



export default {
    cooperateListInit,
    getCooperateList
}