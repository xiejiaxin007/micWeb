/**
 * @description: 响应差相关api
 * @author: kangxue
 * @date: 2020-05-13
 */
import { axios } from '@/assets/js/http/axios';

// 响应差任务列表
const getTaskListApi = '/backend-api/employee_order/yw-sys-number-talk-task/list';
// 修改跟进人保存接口
const saveFollowApi = '/backend-api/employee_order/yw-sys-number-talk-task/edit-follow-employee';
// 公司下拉URL
const getConpanyApi = '/backend-api/select2/select2/get-auth-org-list';

/**
 * 获取响应差任务列表
 * @param {Object} params 参数描述
 * @param {string} params.page   页码
 * @param {string} params.city_id   城市id
 * @param {string} params.order_id   订单id
 * @param {string} params.user_realname   用户姓名
 * @param {string} params.order_status   订单状态
 * @param {string} params.employee_id 咨询师
 * @param {string} params.employee_manager_id 主管
 * @param {string} params.follow_status   跟进状态
 * @param {string} params.follow_employee_id   跟进咨询师
 * @param {string} params.see_employee_id    带看咨询师
 * @param {string} params.maintain_employee_id  共同维护人
 * @param {string} params.call_begin_time_min  来电时间
 * @param {string} params.call_begin_time_max  来电时间
 * @return {Object} 数据
 */
const getTaskList = (params) => axios.post(getTaskListApi, params);
/**
 * 修改跟进人保存接口
 * @param {Object} params 参数描述
 * @param {string} params.id   任务id
 * @param {string} params.employee_id   跟进人
 * @return {Object} 数据
 */
const saveFollow = (params) => axios.post(saveFollowApi, params);

/**
 * 公司下拉
 * @param {Object} params 搜索条件对象
 * @param {String} params.q 搜索内容
 */
const getCompanyData = (params) => axios.get(getConpanyApi, {params});


const api = {
    getTaskList,
    saveFollow,
    getCompanyData
};
export default api;
