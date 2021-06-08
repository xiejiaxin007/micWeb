/*
 * @author: zhidl
 * @Date: 2019-12-18 14:21:24
 * @description: 纸质地图api
 */
import {
    axios
} from '@/assets/js/http/axios';


// 新增地图
const addMapApi = '/backend-api/paper-map/add-map';
// 删除地图
const deleteMapApi = '/backend-api/paper-map/delete-map';
// 地图列表
const mapListApi = '/backend-api/paper-map/get-map-list';
// 获取核算城市
const getAdjustCitysApi = '/backend-api/paper-map/get-adjust-citys';



/**
 * @description: 新增地图
 * @param {object} params 参数
 * @param {string} params.city_id 核算城市id
 */
const addMap = (params) => axios.post(addMapApi, params);

/**
 * @description: 删除地图
 * @param {object} params 参数
 * @param {string} params.map_id 地图id
 */
const deleteMap = (params) => axios.post(deleteMapApi, params);

/**
 * @description: 地图列表
 * @param {object} params 参数
 * @param {string} params.page 页码
 */
const mapList = (params) => axios.post(mapListApi, params);

/**
 * @description: 获取核算城市
 */
const getAdjustCitys = () => axios.post(getAdjustCitysApi);


export const cutoutList = {
    addMap,
    deleteMap,
    mapList,
    getAdjustCitys
}