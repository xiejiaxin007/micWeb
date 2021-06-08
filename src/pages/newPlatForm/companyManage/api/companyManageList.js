/*
 * @Author: xie bin
 * @Date: 2020-09-21 10:15:20
 * @LastEditTime: 2021-01-20 18:20:56
 * @LastEditors: kangxue
 * @Description: 公司列表api
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/api/companyManageList.js
 */

import {
    axios
} from '@/assets/js/http/axios';

// 公司相关公共接口api
const getCompanyCommonApi = '/backend-api/org/org/common-select';

// 公司列表接口api
const getCompanyListApi = '/backend-api/org/org/list';

// 公司列表禁用&开启接口api
const getCompanyOpenApi = '/backend-api/org/org/status-change';

// 获取公司信息接口api
const getCompanyInfoApi = '/backend-api/org/org/info';

// 编辑&添加保存公司信息接口api
const saveCompanyInfoApi = '/backend-api/org/org/create';

// 获取请提醒接口接口api
const getRemindDialogValApi = '/backend-api/select2/select2/alert-limit-list';

// 加盟v1.1
// 获取优先级列表api
const getPriorityListApi = '/backend-api/org/alloc-priority-config/get-list';

// 关闭城市订单api
const closeCityOrderApi = '/backend-api/org/alloc-priority-config/switch-state';


/**
 * 公司相关公共接口
 * @param {Object} params 参数
 * @param {array} type	查询的参数
 * @return {Promise}
 */
const getCompanyCommonData = params => axios.post(getCompanyCommonApi, params);

/**
 * @description: 公司列表接口
 * @return: {Promise}
 */
const getCompanyListData = params => axios.get(getCompanyListApi, {params});

/**
 * @description: 公司列表启用&禁用接口
 * @return: {Promise}
 */
const getCompanyOpenData = params => axios.post(getCompanyOpenApi, params);

/**
 * @description: 公司信息获取接口
 * @return: {Promise}
 */
const getCompanyInfoData = params => axios.get(getCompanyInfoApi, {params});

/**
 * @description: 公司信息获取接口
 * @return: {Promise}
 */
const saveCompanyInfoData = params => axios.post(saveCompanyInfoApi, params);

/**
 * @description: 公司信息获取接口
 * @return: {Promise}
 */
const getRemindDialogValData = () => axios.get(getRemindDialogValApi);

// 加盟v1.1
/**
 * @description: 获取配置有限列表接口
 * @return: {Promise}
 */
const getPriorityListData = (params) => axios.post(getPriorityListApi, params);

/**
 * @description: 关闭城市订单接口
 * @return: {Promise}
 */
const closeCityOrderData = (params) => axios.post(closeCityOrderApi, params);


export default {
    getCompanyCommonData,
    getCompanyListData,
    getCompanyOpenData,
    getCompanyInfoData,
    saveCompanyInfoData,
    getRemindDialogValData,
    getPriorityListData,
    closeCityOrderData
};
