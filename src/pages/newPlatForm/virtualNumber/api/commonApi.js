/*
 * @Author: xiebin
 * @Date: 2020-06-17 14:45:33
 * @LastEditTime: 2020-06-17 14:53:37
 * @LastEditors:xiebin
 * @Description: 公共api
 * @FilePath: /webapp_backend/src/pages/newPlatForm/virtualNumber/api/commonApi.js
 */

import { axios } from '@/assets/js/http/axios';
// 获取虚拟号通用接口
const getConfigListApi = '/backend-api/virtual-phone/common-select';

// 获取全部虚拟城市
const getCityListApi = '/backend-api/common/get-all-city-list';

/**
 * 获取费率数据列表信息
 * 1 虚拟号类型 2 虚拟号占用状态
 * @param {Object} params 接口类型参数
 * @return {Promise} promise对象
 */
const getConfigListData = params => axios.post(getConfigListApi, params);

/**
 * 获取全部虚拟城市
 * 1 全国 2 全部
 * @param {Object} params 接口类型参数
 * @param {Object} params.type 类型
 * @return {Promise} promise对象
 */
const getCityListData = params => axios.get(getCityListApi, {params});

export default {
    getConfigListData,
    getCityListData
}
