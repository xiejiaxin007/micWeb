/*
 * @Author: hewei
 * @Date: 2020-09-18
 * @LastEditTime: 2020-09-21 16:48:13
 * @LastEditors: hewei
 * @Description: 上户目标列表和编辑api
 */

 
import { axios } from '@/assets/js/http/axios';

// 公司上户目标列表接口
const orgReceiveOrderListApi = '/backend-api/org/org-receive-order/list';

// 公司上户目标初始化接口
const initGoalInfoApi = '/backend-api/org/org-receive-order/init-info';

// 公司上户目标保存接口
const saveGoalInfoApi = '/backend-api/org/org-receive-order/save';

/**
 * 获取公司上户目标列表数据
 * @param {String} params.org_id 公司id
 * @param {String} params.month 月份
 * @param {String} params.city_id 城市
 * @param {Number} params.page 页码
 * @param {Nunber} params.page_size 每页几条（不传默认20）
 * @return {Promise} promise对象
 */
const getOrgReceiveOrderList = params => axios.post(orgReceiveOrderListApi, params);

/**
 * 公司上户目标初始化
 * @param {Object} params.id 目标id
 * @return {Promise} promise对象
 */
const getInitGoalInfo = params => axios.post(initGoalInfoApi, params);

// 公司上户目标上户目标月份切换 接口
const changeMonthInfoApi = '/backend-api/org/org-receive-order/init-custom-month-info';

/**
 * 获取公司上户目标列表数据
 * @param {String} params.id 目标id（编辑时必传）
 * @param {String} params.org_id 公司id
 * @param {String} params.month 月份
 * @param {String} params.city_id 城市
 * @param {Number} params.total_target_value 月上户总量
 * @param {Array} params.day_value_list 日上户量信息
 * @return {Promise} promise对象
 */
const saveGoalInfo = params => axios.post(saveGoalInfoApi, params);

/**
 * 上户目标月份切换
 * @param {Object} params.id 上户目标id
 * @param {Object} params.month 月份 2020-10
 * @return {Promise} promise对象
 */
const changeMonthInfo = params => axios.post(changeMonthInfoApi, params);


export default {
    getOrgReceiveOrderList,
    getInitGoalInfo,
    saveGoalInfo,
    changeMonthInfo
}