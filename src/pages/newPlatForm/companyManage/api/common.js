/*
 * @Author: hewei
 * @Date: 2020-09-18
 * @LastEditTime: 2020-11-11 11:35:51
 * @LastEditors: hewei
 * @Description: 公共api
 */

import { axios } from '@/assets/js/http/axios';

// 公司下拉接口
const getDepartListApi = '/backend-api/select2/select2/get-org-list';

// 获取接受订单城市接口
const getOrderCityApi = '/backend-api/select2/select2/get-all-city';

// 全部城市下拉
const getAllCityApi = '/backend-api/select2/select2/get-all-city-code';

// 部门下拉接口
const getOrgDepartApi = '/backend-api/select2/select2/get-org-depart-list';

// 岗位下拉接口
const getOrgPostApi = '/backend-api/select2/select2/get-org-post-list';

// 公司相关公共接口api
const getCompanyCommonApi = '/backend-api/org/org/common-select';

/**
 * 获取公司下拉
 * @param {Object} params.q 公司名称
 * @return {Promise} promise对象
 */
const getDepartList = params => axios.post(getDepartListApi, params);

/**
 * 获取订单城市下拉
 * @param {Object} params.q 公司名称
 * @return {Promise} promise对象
 */
const getOrderCitys = params => axios.post(getOrderCityApi, params);

/**
 * 获取城市下拉
 * @param {Object} params.q 城市名称
 * @return {Promise} promise对象
 */
const getAllCityData = params => axios.post(getAllCityApi, params);

/**
 * 获取部门下拉
 * @param {Object} params.org_id 公司id
 * @param {Object} params.q 搜索部门名称
 * @return {Promise} promise对象
 */
const getOrgDepartList = params => axios.get(getOrgDepartApi, {params});

/**
 * 获取岗位下拉
 * @return {Promise} promise对象
 */
const getJobs = params => axios.get(getOrgPostApi, {params});

/**
 * 公司相关公共接口
 * @param {Object} params 参数
 * @param {array} type	查询的参数
 * @return {Promise}
 */
const getCompanyCommonData = params => axios.post(getCompanyCommonApi, params);

export default {
    getDepartList,
    getOrderCitys,
    getOrgDepartList,
    getJobs,
    getAllCityData,
    getCompanyCommonData
}