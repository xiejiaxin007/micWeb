/**
 * @description: 开发商模块相关api
 * @author: wangxue
 * @date: 2020-02-05
 */
import { axios } from '@/assets/js/http/axios';

// 初始化列表
const initListApi = '/backend-api/online-see-quality/list';
// 获取开发商列表
const qualityConfigApi = '/backend-api/online-see-quality/config';
// 删除质检
const delQualityApi = '/backend-api/online-see-quality/del';
// 新增质检
const addQualityApi = '/backend-api/online-see-quality/add';
// 批量导入
const importApi = '/backend-api/online-see-quality/import';
// 获取员工列表
const userList = '/backend-api/employee/get-employee-dropdown-list';


/**
 * 获取开发商列表
 * @param {Object} params 参数描述
 * @param {string} params.page 页码
 * @param {string} params.order_id 订单id
 * @param {string} params.employee_id 咨询师id
 * @param {string} params.see_project_id 带看id
 * @param {string} params.city_id 城市id
 * @param {string} params.sop_tag sop标签
 * @param {string} params.operator 操作人
 * @param {string} params.see_time 带看时间
 * @param {string} params.quality_time 质检时间
 * @param {string} params.page_size 多少条数据一分页
 * @param {string} params.is_export 是否导出
 * @return {Object} 列表数据
 */
const initList = (params) => axios.get(initListApi, params);

/**
 * 质检列表配置信息
 * @return {Object} 配置数据
 */
const qualityConfig = (params) => axios.get(qualityConfigApi);

/**
 * 删除质检
 * @param {string} params.id 质检id
 */
const delQuality = (params) => axios.get(delQualityApi, params);

/**
 * 删除质检
 * @param {string} params.see_project_id 带看id
 * @param {string} params.see_score 带看分数
 * @param {string} params.sop_tag 带看标签
 * @param {string} params.time 质检时间
 */
const addQuality = (params) => axios.post(addQualityApi, params);

/**
 * 批量导入
 * @param {string} params.file_data base64文件
 */
const batchImport = (params) => axios.post(importApi, params);

/**
 * 批量导入
 * @param {string} params.q 输入内容
 * @param {string} params.list 返回数据格式是否有list包含 0否1是
 */
const getUserList = (params) => axios.get(userList, params);

const onlineQuality = {
    initList,
    qualityConfig,
    delQuality,
    addQuality,
    batchImport,
    getUserList
};
export default onlineQuality;
