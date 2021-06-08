/**
 * @description: 开发商模块相关api
 * @author: wangxue
 * @date: 2020-02-05
 */
import { axios } from '@/assets/js/http/axios';

// 获取开发商列表
const developerListApi = '/backend-api/kfs-developer/developer-list';
// 删除开发商
const delDeveloperApi = '/backend-api/kfs-developer/del-developer';
// 导入开发商
const importDeveloperApi = '/backend-api/kfs-developer/import-developer';
// 楼盘下拉获取楼盘列表
const projectListApi = '/backend-api/kfs-developer/get-project-list';
// 新增开发商接口
const addDeveloperAPi = '/backend-api/kfs-developer/add-developer';
// 编辑开发商接口
const editDeveloperAPi = '/backend-api/kfs-developer/edit-developer';
// 编辑开发商初始化信息
const initDeveloperDataApi = '/backend-api/kfs-developer/init-developer-data';
// 开发商人员列表
const developerEmployeeListApi = '/backend-api/kfs-developer/developer-employee-list';
// 删除开发商人员
const delEmployeeApi = '/backend-api/kfs-developer/delete-developer-employee';
// 下拉搜索开发商
const developerSelectListApi = '/backend-api/select2/select2/get-developer-select';
// 增加开发商人员
const addDeveloperEmployeeApi = '/backend-api/kfs-developer/add-developer-employee';
// 编辑开发商人员初始化
const editInitDeveloperEmployeeApi = '/backend-api/kfs-developer/init-developer-employee';
// 编辑开发商人员
const editDeveloperEmployeeApi = '/backend-api/kfs-developer/edit-developer-employee';
// 重置密码
const resetPasswordApi = '/backend-api/kfs-developer/reset-password';
// 导入开发商人员
const importDeveloperEmployeeApi = '/backend-api/kfs-developer/import-developer-employee';
// 恢复开发商
const recoveryDeveloperApi = '/backend-api/kfs-developer/recovery-developer';
// 恢复员工
const recoveryEmployeeApi = '/backend-api/kfs-developer/recovery-employee';

// 以下开发商余额管理

// 开发商余额管理列表数据
const balanceListApi = '/backend-api/kfs_dsp/kfs-balance/get-account-amount-list';
// 充值接口
const rechargeApi = '/backend-api/kfs_dsp/kfs-balance/add-recharge-record';
// 退款接口
const refundApi = '/backend-api/kfs_dsp/kfs-balance/add-refund-record';
// 校验退款信息
const checkRefundInfo = '/backend-api/kfs_dsp/kfs-balance/check-refund-info';
// 开发商余额详情
const balanceDetailApi = '/backend-api/kfs_dsp/kfs-balance/get-balance-detail-list';
// 删除开发商余额记录
const delBalanceApi = '/backend-api/kfs_dsp/kfs-balance/del-record';
// 获取所有开发商列表
const getDeveloperInfoListApi = '/backend-api/kfs_dsp/kfs-balance/get-developer-info-list';
// 获取所有绑定的项目列表
const getProjectListApi = '/backend-api/kfs_dsp/kfs-balance/get-project-list';

/**
 * 获取开发商列表
 * @param {Object} params 参数描述
 * @param {string} params.page 页码
 * @param {string} params.developer_name 开发商名称
 * @param {string} params.developer_id 开发商id
 * @param {string} params.project_name 楼盘名称
 * @param {string} params.export 是否导出
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=439&childGroupID=444&apiID=2631&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const developerList = (params) => axios.get(developerListApi, params);
/**
 * 删除开发商
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2667&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const delDeveloper = (params) => axios.post(delDeveloperApi, params);
/**
 * 导入开发商
 * @param {Object} params 参数描述
 * @param {string} params.file_data excel数据流
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2662&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
const importDeveloper = (params) => axios.post(importDeveloperApi, params);
/**
 * 导入开发商人员
 * @param {Object} params 参数描述
 * @param {string} params.source excel数据流
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=447&apiID=2637&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
const importDeveloperEmployee = (params) => axios.post(importDeveloperEmployeeApi, params);
/**
 * 楼盘下拉获取楼盘列表
 * @param {Object} params 参数描述
 * @param {string} params.name 楼盘名称 非必填
 * @param {string} params.developer_id 开发商id(不填查全部) 非必填
 * @param {array} params.not_in_id 过滤楼盘id 非必填
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2642&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
const projectList = (params) => axios.post(projectListApi, params);
/**
 * 新增开发商接口
 * @param {Object} params 参数描述
 * @param {string} params.developer_name 开发商名称
 * @param {string} params.developer_logo 开发商logo
 * @param {string} params.developer_desc 开发商描述
 * @param {array} params.project_data 楼盘数组
 * @param {string} params.project_data[0].project_id 楼盘id
 * @param {string} params.project_data[0].project_mobile 楼盘电话
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2663&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
const addDeveloper = (params) => axios.post(addDeveloperAPi, params);
/**
 * 编辑开发商接口
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * @param {string} params.developer_logo 开发商logo
 * @param {string} params.developer_desc 开发商描述
 * @param {array} params.project_data 楼盘数组
 * @param {string} params.project_data[0].project_id 楼盘id
 * @param {string} params.project_data[0].project_mobile 楼盘电话
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2663&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
const editDeveloper = (params) => axios.post(editDeveloperAPi, params);
/**
 * 编辑开发商初始化信息
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2665&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
const initDeveloperData = (params) => axios.post(initDeveloperDataApi, params);
/**
 * 获取开发商人员列表
 * @param {Object} params 参数描述
 * @param {string} params.page 页码
 * @param {string} params.developer_name 开发商名称
 * @param {string} params.employee_name 人员名称
 * @param {string} params.project_name 楼盘名称
 * @param {string} params.mobile 手机号
 * @param {string} params.auth 权限
 * @param {string} params.export 是否导出
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=439&childGroupID=444&apiID=2631&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const developerEmployeeList = (params) => axios.get(developerEmployeeListApi, params);
/**
 * 删除开发商人员
 * @param {Object} params 参数描述
 * @param {string} params.id 员工id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=447&apiID=2644&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const delEmployee = (params) => axios.post(delEmployeeApi, params);
/**
 * 下拉搜索开发商
 * @param {Object} params 参数描述
 * @param {string} params.q 下拉搜索参数
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2639&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const developerSelectList = (params) => axios.get(developerSelectListApi, params);
/**
 * 增加开发商人员
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * @param {Array} params.project_id 楼盘数组
 * @param {string} params.employee_name 员工姓名
 * @param {string} params.auth 角色权限
 * @param {string} params.mobile 手机号
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2634&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const addDeveloperEmployee = (params) => axios.post(addDeveloperEmployeeApi, params);
/**
 * 编辑开发商人员初始化
 * @param {Object} params 参数描述
 * @param {string} params.id 员工id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=447&apiID=2673&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const editInitDeveloperEmployee = (params) => axios.get(editInitDeveloperEmployeeApi, params);
/**
 * 编辑开发商人员
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * @param {Array} params.project_id 楼盘数组
 * @param {string} params.employee_name 员工姓名
 * @param {string} params.auth 角色权限
 * @param {string} params.mobile 手机号
 * @param {string} params.id 员工id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=447&apiID=2638&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const editDeveloperEmployee = (params) => axios.post(editDeveloperEmployeeApi, params);
/**
 * 重置密码
 * @param {Object} params 参数描述
 * @param {string} params.id 员工id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=447&apiID=2636&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 列表数据
 */
const resetPassword = (params) => axios.post(resetPasswordApi, params);
/**
 * 开发商余额管理列表数据
 * @param {Object} params 参数描述
 * @param {string} params.page 页码
 * @param {string} params.page_size 1页的条数
 * @param {string} params.export export 参数为1 则导出，其他 非导出
 * @param {string} params.developer_id 开发商id
 * @param {string} params.project_id 楼盘id
 * @param {string} params.developer_like_id 模糊开发商id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2730&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const balanceList = (params) => axios.get(balanceListApi, {params});
/**
 * 充值接口
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * @param {string} params.project_id 楼盘id
 * @param {string} params.op_date 充值日期
 * @param {string} params.op_amount 充值金额
 * @param {string} params.rebate 返点
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2733&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const recharge = (params) => axios.post(rechargeApi, params);
/**
 * 退款接口
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * @param {string} params.project_id 楼盘id
 * @param {string} params.op_date 退款日期
 * @param {string} params.op_amount 退款金额
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2735&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const refund = (params) => axios.post(refundApi, params);
/**
 * 校验退款信息
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 开发商id
 * @param {string} params.project_id 楼盘id
 * @param {string} params.op_date 操作日期
 * @param {string} params.op_amount 操作金额
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2736&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const checkRefundInfoApi = (params) => axios.post(checkRefundInfo, params);
/**
 * 开发商余额详情
 * @param {Object} params 参数描述
 * @param {string} params.developer_id 楼盘id
 * @param {string} params.page 页码
 * @param {string} params.page_size 1页的条数
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2732&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const balanceDetail = (params) => axios.get(balanceDetailApi, {params});
/**
 * 删除开发商余额记录
 * @param {Object} params 参数描述
 * @param {string} params.id 主键id
 * @param {string} params.source 类型 1 充值 2退款
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2737&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const delBalance = (params) => axios.post(delBalanceApi, params);
/**
 * 获取所有开发商列表
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2738&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const getDeveloperInfoList = () => axios.post(getDeveloperInfoListApi);
/**
 * 获取所有绑定的项目列表
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2729&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%99%BA%E8%83%BD%E8%8E%B7%E5%AE%A2&projectID=194
 * @return {Object} 列表数据
 */
const getProjectList = (params) => axios.post(getProjectListApi, params);
/**
 * 恢复开发商
 * @param {string} params.developer_id 开发商id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2915&projectName=开发商系统-支撑系统后台&projectID=182
 * @return {Object} 列表数据
 */
const recoveryDeveloper = (params) => axios.post(recoveryDeveloperApi, params);
/**
 * 恢复人员
 * @param {string} params.employee_id 员工ID
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2914&projectName=开发商系统-支撑系统后台&projectID=182
 * @return {Object} 列表数据
 */
const recoveryEmployee = (params) => axios.post(recoveryEmployeeApi, params);

const developerApi = {
    developerList,
    delDeveloper,
    importDeveloper,
    projectList,
    addDeveloper,
    initDeveloperData,
    editDeveloper,
    developerEmployeeList,
    delEmployee,
    developerSelectList,
    addDeveloperEmployee,
    editInitDeveloperEmployee,
    editDeveloperEmployee,
    resetPassword,
    importDeveloperEmployee,
    balanceList,
    recharge,
    refund,
    checkRefundInfoApi,
    balanceDetail,
    delBalance,
    getDeveloperInfoList,
    getProjectList,
    recoveryDeveloper,
    recoveryEmployee
};
export default developerApi;
