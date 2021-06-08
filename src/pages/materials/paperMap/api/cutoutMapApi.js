/*
 * @author: zhidl
 * @Date: 2019-12-18 14:21:24
 * @description: 纸质地图api
 */
import {
    axios
} from '@/assets/js/http/axios';

// 获取地图名称
const getMapNameApi = '/backend-api/paper-map/init-add-map';
// 初始化地图
const initMapApi = '/backend-api/paper-map/set-project-init';
// 修改地图名称
const editMapNameApi = '/backend-api/paper-map/edit-map-name';
// 初始化重叠楼盘租
const initNearApi = '/backend-api/paper-map/near-project-init';
// 保存地图数据
const saveMapApi = '/backend-api/paper-map/save-project-init';
/**
 * @description: 初始化地图
 * @param {object} params 参数
 * @param {string} params.map_id 地图id
 * @param {string} params.project_type 业态
 * @param {string} params.status 1: 未售 2:在售 3:售罄 4:待售
 * @param {string} params.is_cooperate 1.合作 2.非合作
 * @param {string} params.offer_price_min 最小单价
 * @param {string} params.offer_price_max 最大单价
 * @param {string} params.undetermined_offer_price 待定单价
 * @param {string} params.price_min 最小总价
 * @param {string} params.price_max 最大总价
 * @param {string} params.undetermined_price 待定总价
 * @param {string} params.show_project_type 1.不展示业态 2.展示
 * @param {string} params.show_price 1.不展示价格 2.展示单价 3.展示总价
 * @param {string} params.show_acreage 1.不展示面积 2.展示
 * @param {string} params.min_lat 最小纬度
 * @param {string} params.max_lat 最大纬度
 * @param {string} params.min_lng 最小经度
 * @param {string} params.max_lng 最大经度
 */
const initMap = (params) => axios.post(initMapApi, params);

/**
 * @description: 修改地图名称
 * @param {object} params 参数
 * @param {string} params.map_id 地图id
 * @param {string} params.map_name 地图名称
 */
const editMapName = (params) => axios.post(editMapNameApi, params);

/**
 * @description: 初始化重叠楼盘组
 * @param {object} params 参数
 * @param {string} params.map_id 地图id
 * @param {string} params.project_type 业态
 * @param {string} params.status 1: 未售 2:在售 3:售罄 4:待售
 * @param {string} params.is_cooperate 1.合作 2.非合作
 * @param {string} params.offer_price_min 最小单价
 * @param {string} params.offer_price_max 最大单价
 * @param {string} params.undetermined_offer_price 待定单价
 * @param {string} params.price_min 最小总价
 * @param {string} params.price_max 最大总价
 * @param {string} params.undetermined_price 待定总价
 * @param {string} params.show_project_type 1.不展示业态 2.展示
 * @param {string} params.show_price 1.不展示价格 2.展示单价 3.展示总价
 * @param {string} params.show_acreage 1.不展示面积 2.展示
 */
const initNear = (params) => axios.post(initNearApi, params);

/**
 * @description: 保存地图数据
 * @param {object} params 参数
 * @param {string} params.map_id 地图id
 * @param {string} params.project_type 业态
 * @param {string} params.status 1: 未售 2:在售 3:售罄 4:待售
 * @param {string} params.is_cooperate 1.合作 2.非合作
 * @param {string} params.offer_price_min 最小单价
 * @param {string} params.offer_price_max 最大单价
 * @param {string} params.undetermined_offer_price 待定单价
 * @param {string} params.price_min 最小总价
 * @param {string} params.price_max 最大总价
 * @param {string} params.undetermined_price 待定总价
 * @param {string} params.show_project_type 1.不展示业态 2.展示
 * @param {string} params.show_price 1.不展示价格 2.展示单价 3.展示总价
 * @param {string} params.show_acreage 1.不展示面积 2.展示
 * @param {array}  params.move_project_data 挪动的楼盘数据
 * @param {string}  params.move_project_data[].project_id 楼盘id
 * @param {string}  params.move_project_data[].lat 最新纬度
 * @param {string}  params.move_project_data[].lng 最新经度
 */
const saveMap = (params) => axios.post(saveMapApi, params);

/**
 * @description: 获取地图名称
 * @param {object} params 参数
 * @param {string} params.map_id 地图id
 */
const getMapName = (params) => axios.post(getMapNameApi, params);

export const cutoutIndex = {
    getMapName,
    initMap,
    editMapName,
    initNear,
    saveMap
}
