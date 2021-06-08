/*
 * @author: hewei
 * @Date: 2020-11-11 10:45:18
 * @LastEditors: hewei
 * @LastEditTime: 2020-11-11 16:00:53
 * @description: file content
 */

 
import { axios } from '@/assets/js/http/axios';

// 配置页面初始化接口
const initConfigApi = '/backend-api/org/alloc-priority-config/init';

// 配置页面保存接口
const saveConfigApi = '/backend-api/org/alloc-priority-config/save';

// 查看城市优先级配置接口
const priorityListApi = '/backend-api/org/alloc-priority-config/get-city-priority-list';

/**
 * 公司上户目标初始化
 * @param {Object} params.id 配置id
 * @return {Promise} promise对象
 */
const getInitConfInfo = params => axios.post(initConfigApi, params);


/**
 * 配置页面保存
 * @param {String} params.id id（编辑时必传）
 * @param {String} params.org_id 公司id
 * @param {String} params.priority 优先级
 * @param {String} params.city_id 城市id
 * @param {Number} params.hour_detail 配置数据
 * @return {Promise} promise对象
 */
const saveConfigInfo = params => axios.post(saveConfigApi, params);

/**
 * 查看城市优先级配置
 * @param {Object} params.city_id 城市id
 * @return {Promise} promise对象
 */
const getPriorityList = params => axios.post(priorityListApi, params);



export default {
    getInitConfInfo,
    saveConfigInfo,
    getPriorityList
}