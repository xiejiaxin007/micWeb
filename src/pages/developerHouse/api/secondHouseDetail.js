/**
 * @name: 二手房源详情页APi
 * @description: 二手房源详情页api
 * @author: 贺伟
 * @date: 2020-04-27
 */

import { axios } from '@/assets/js/http/axios';

// 受否关联合同api接口
const houseDetailApi = '/backend-api/house/xpt-house/detail';


/**
 * 获取筛选项接口
 * @param {String} house_id 房源id
 * @return {Object<promis>} promise对象
 */
const getHouseDetailData = (params) => axios.post(houseDetailApi, params);

export default {
    getHouseDetailData
};