/*
 * @author: hewei
 * @Date: 2021-05-14 17:03:51
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-18 10:54:41
 * @description: file content
 */

import {
    axios
} from '@/assets/js/http/axios';

// 成交单回款历史记录页初始化接口
const exPaymentRecordInitApi = '/backend-api/expand/ex-payment-record/init';

// 成交单回款历史记录页初列表接口
const exPaymentRecordListApi = '/backend-api/expand/ex-payment-record/index';




/**
 * @description: 获取转直签详情信息
 */
const getExPaymentRecordInit = () => axios.get(exPaymentRecordInitApi);

/**
 * @description: 获取合作楼盘历史记录列表信息
 * @param {string} params.page	页码
 * @param {string} params.perPage	每页多少条
 * @param {string} params.time_min	记录月份最小
 * @param {string} params.time_max	记录月份最大
 * @param {string} params.city_id	地理城市id
 * @param {string} params.expand	所属拓展
 * @param {string} params.resident	所属驻场
 * @param {string} params.cooperate_type 合作方式 1直签 2平台 3战略
 */
const getExPaymentRecordList = (params) => axios.get(exPaymentRecordListApi, { params });



export default {
    getExPaymentRecordInit,
    getExPaymentRecordList
}