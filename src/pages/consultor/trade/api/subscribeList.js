/**
 * @file api文件
 * @description 线上认购请求api
 * @author hewei
 * @createDate 2020-05-11
 */

import { axios } from '@/assets/js/http/axios';

// 线上认购列表页面下拉初始化接口
const initSelectApi = '/backend-api/yw-online-subscribe/init-index';

// 线上认购列表
const subcribeListApi = '/backend-api/yw-online-subscribe/index';

// 付款审核接口
const payAuditApi = '/backend-api/yw-online-subscribe/pay-audit';

// 公司下拉URL
const getConpanyApi = '/backend-api/select2/select2/get-auth-org-list';


/**
 * 根据搜索条件获取对应的筛选列表
 * @param {Object} params 搜索条件对象
 */
const getInitOptions = () => axios.post(initSelectApi);

/**
 * 根据搜索条件获取对应的筛选列表
 * 参数较多，参考ams:http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=3363&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E7%BA%BF%E4%B8%8A%E6%88%90%E4%BA%A4&projectID=221
 * @param {Object} params 搜索条件对象
 */
const getSubcribeList = (params, headers) => axios.post(subcribeListApi, params, headers);

/**
 * 付款审核
 * @param {Object} params 搜索条件对象
 * @param {String} params.id 认购id
 * @param {String} params.is_pay 认购金是否到账
 * @param {String} params.pay_datetime 支付时间
 */
const subcribePayAudit = (params) => axios.post(payAuditApi, params);

/**
 * 公司下拉
 * @param {Object} params 搜索条件对象
 * @param {String} params.q 搜索内容
 */
const getCompanyData = (params) => axios.get(getConpanyApi, {params});


export default {
    getSubcribeList,
    getInitOptions,
    subcribePayAudit,
    getCompanyData
}