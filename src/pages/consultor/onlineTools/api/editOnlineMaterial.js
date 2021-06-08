/*
 * @author: wangsx
 * @Date: 2020-03-04 13:31:42
 * @description: 编辑材料页面
 */
import {
    axios
} from '@/assets/js/http/axios'

// 编辑材料初始化
const initListApi = '/backend-api/online-see-project/get-material';
// 下拉楼盘api
const projectApi = '/backend-api/online-see-project/get-only-project-list';
// 城市列表api
const cityApi = '/backend-api/select2/select2/get-city-group-list-select2';
// 区域列表api
const districtApi = '/backend-api/online-see-project/get-only-district-list';
// 区域列表api
const saveMaterialApi = '/backend-api/online-see-project/save-material';

/**
 * 编辑材料初始化
 * @param {Object} params 参数描述
 * @param {int} params.id 材料自增ID
 * @return {Object}
 */
const getInitList = (params) => axios.get(initListApi, {params: params})

/**
 * 获取楼盘下拉
 * @param {Object} params 参数描述
 * @param {int} params.city_id 城市ID
 * @param {int} params.project_id 当前材料的楼盘ID
 * @param {string} params.q	搜索值
 * @return {Object}
 */
const getProject = (params) => axios.get(projectApi, {params: params})

/**
 * 获取区域下拉
 * @param {Object} params 参数描述
 * @param {int} params.city_id 城市ID
 * @param {int} params.district_id 当前材料的区域ID
 * @param {string} params.q	搜索值
 * @return {Object}
 */
const getDistrict = (params) => axios.get(districtApi, {params: params})


/**
 * 获取城市下拉
 * @return {Object}
 */
const getCityList = () => axios.post(cityApi)

/**
 * 保存材料
 * @param {Object} params 参数描述
 * @param {int} params.city_id 城市ID
 * @param {int} params.district_id 当前材料的区域ID
 * @param {string} params.title	材料名称
 * @param {string} params.object_type	材料类型
 * @param {string} params.object_id	 对象ID( 区域id、楼盘id)
 * @param {string} params.object_url	材料地址 半路径
 * @return {Object}
 */
const saveMaterial = (params) => axios.post(saveMaterialApi, params)


export default {
    getInitList,
    getProject,
    getCityList,
    getDistrict,
    saveMaterial
};

