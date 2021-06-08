/*
 * @Author: xie bin
 * @Date: 2020-09-21 10:15:20
 * @LastEditTime: 2021-01-20 18:21:15
 * @LastEditors: kangxue
 * @Description: 人员列表api
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/api/peopleList.js
 */

import {
    axios
} from '@/assets/js/http/axios';

// 公司相关公共接口api
const getCompanyCommonApi = '/backend-api/org/org/common-select';

// 获取公司接口api
const getCompanyListApi = '/backend-api/select2/select2/get-org-list';

// 岗位接口api
const getCompanyJobApi = '/backend-api/select2/select2/get-org-post-list';

// 人员列表禁用&开启接口api
const getPeopleOpenApi = '/backend-api/org/employee/status-change';

// 获取人员列表接口api
const getPeopleListApi = '/backend-api/org/employee/list';



/*
 * 公司相关公共接口
 * @param {Object} params 参数
 * @param {array} type	查询的参数
 * @return {Promise}
 */
const getCompanyCommonData = params => axios.post(getCompanyCommonApi, params);


/**
 * 公司下拉接口
 * @param {Object} params 参数
 * @return {Promise}
 */
const getCompanyListData = params => axios.post(getCompanyListApi, params);

/**
 * 岗位下拉接口
 * @param {Object} params 参数
 * @return {Promise}
 */
const getCompanyJobData = () => axios.get(getCompanyJobApi);

/**
 * 人员列表接口
 * @param {Object} params 参数
 * @return {Promise}
 */
const getPeopleListData = params => axios.post(getPeopleListApi, params);

/**
 * 人员列表禁用&开启接口
 * @param {Object} params 参数
 * @param {string} params.id	人员ID
 * @param {string} params.status	当前状态
 * @return {Promise}
 */
const getPeopleOpenData = params => axios.post(getPeopleOpenApi, params);



export default {
    getCompanyCommonData,
    getCompanyListData,
    getCompanyJobData,
    getPeopleListData,
    getPeopleOpenData
};
