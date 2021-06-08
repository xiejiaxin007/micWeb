/*
 * @Author: xiebin
 * @Date: 2020-06-17 14:52:02
 * @LastEditTime: 2020-06-22 10:53:46
 * @LastEditors: xie bin
 * @Description: 虚拟号库存api
 * @FilePath: /webapp_backend/src/pages/newPlatForm/virtualNumber/api/virtualNumStock.js
 */ 

import { axios } from '@/assets/js/http/axios';
// 获取全部虚拟城市
const getCityListApi = '/backend-api/common/get-all-city-list';

// 获取虚拟号列表
const getvirtualListApi = '/backend-api/virtual-phone/list';

// 虚拟号新增
const addVirtualNumApi = '/backend-api/virtual-phone/create';

// 删除虚拟号
const deleteVirtualNumApi = '/backend-api/virtual-phone/delete';

/**
 * 获取全部虚拟城市
 * 1 全国 2 全部
 * @param {Object} params 接口类型参数
 * @param {Object} params.type 类型
 * @return {Promise} promise对象
 */
const getCityListData = params => axios.get(getCityListApi, {params});

/**
 * 获取虚拟号列表
 * @param {Object} params 接口类型参数
 * @param {Object} params.city_id 城市id
 * @param {Object} params.type 虚拟号类型
 * @param {Object} params.phone 虚拟号
 * @param {Object} params.is_use 是否占用
 * @return {Promise} promise对象
 */
const getvirtualListData = params => axios.get(getvirtualListApi, {params});

/**
 * 获取虚拟号列表
 * @param {Object} params 接口类型参数
 * @param {Object} params.city_id 城市id
 * @param {Object} params.type 虚拟号类型
 * @param {Object} params.phone 虚拟号
 * @return {Promise} promise对象
 */
const addVirtualNumData = params => axios.post(addVirtualNumApi, params);

/**
 * 删除虚拟号
 * @param {Object} params 接口类型参数
 * @param {Object} params.id 虚拟号id
 * @return {Promise} promise对象
 */
const deleteVirtualNumData = params => axios.get(deleteVirtualNumApi, {params});

export default {
    getCityListData,
    getvirtualListData,
    addVirtualNumData,
    deleteVirtualNumData
}