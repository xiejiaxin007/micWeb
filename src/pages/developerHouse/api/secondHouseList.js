/**
 * @description 二手房源列表api
 * @author xiebin
 * @time 2020.4.26
 */
import { axios } from '@/assets/js/http/axios';

// 获取筛选项api接口
const getFilterListApi = '/backend-api/house/xpt-house/assigned';
// 维护人下拉api接口
const getMaintainListApi = '/backend-api/house/xpt-house/user-list';
// 小区下拉api接口
const getPlatListApi = '/backend-api/house/xpt-house/village-list';
// 搜索api接口
const getsearchListApi = '/backend-api/house/xpt-house/search';


/**
 * 获取筛选项接口
 * @param {String} city_id 城市id
 * @return {Object<promis>} promise对象
 */
const getFilterListData = (params) => axios.post(getFilterListApi, params);

/**
 * 维护人下拉接口
 * @param {String} q 
 * @return {Object<promis>} promise对象
 */
const getMaintainListData = (params) => axios.post(getMaintainListApi, params);

/**
 * 小区下拉接口
 * @param {String} q 
 * @return {Object<promis>} promise对象
 */
const getPlatListData = (params) => axios.post(getPlatListApi, params);

/**
 * 搜索列表接口
 * @param {Object} filter 搜索条件 
 * @param {String} page 页码 
 * @param {String} village 小区 
 * @param {String} maintain 维护人 
 * @param {Array} sort 排序
 * @return {Object<promis>} promise对象
 */
const getsearchListData = (params) => axios.post(getsearchListApi, params);

export default {
    getFilterListData,
    getMaintainListData,
    getPlatListData,
    getsearchListData
};