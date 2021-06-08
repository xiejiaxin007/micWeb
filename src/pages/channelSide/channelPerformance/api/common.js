/*
 * @author: hewei
 * @Date: 2021-05-11 11:14:34
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-24 15:58:38
 * @description: 公共接口文件
 */
import {
    axios
} from '@/assets/js/http/axios';

// 获取楼盘接口
const projectAndTypeApi = '/backend-api/common/get-project-and-type';

// 获取合作方接口
const getSupplierApi = '/backend-api/common/get-supplier';

// 城市下拉接口
const getCityListApi = '/backend-api/select2/bank/get-city-dropdown-list';



/**
 * @description: 获取楼盘信息
 * @param {string} params.q 查询关键字
 */
const getProjectAndType = params => axios.get(projectAndTypeApi, { params });

/**
 * @description: 获取合作方信息
 * @param {string} params.q 查询关键字
 */
const getSupplierList = params => axios.get(getSupplierApi, { params });

/**
 * @description: 获取城市
 * @param {string} options.type 类型
 * @param {string} options.param withAll--不带总部 noAll—没有全国 country—都有
 */
const getCityList = params => axios.get(getCityListApi, { params });

export default {
    getProjectAndType,
    getSupplierList,
    getCityList
}