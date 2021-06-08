import {axios} from '@/assets/js/http/axios';

const performanceManageList = '/backend-api/bk-api-adjust-risk/list'; // 风控管理列表页表格搜索API
const riskInitialize = '/backend-api/bk-api-adjust-risk/initialize'; // 风控管理页选项初始化内容
const riskInitDetail = '/backend-api/bk-api-adjust-risk/detail'; // 业绩核算风控详细页初始化
const riskAudit = '/backend-api/bk-api-adjust-risk/audit'; // 业绩核算风控详细页初始化
const complainList = '/backend-api/complaint/list'; // 获取用户投诉数据
// 新增用户投诉
const complaintCreate = '/backend-api/complaint/add-complaint';
// 查询处理进度
const complaintDetail = '/backend-api/complaint/complaint-handling';
// 更新处理进度
const complaintUpdate = '/backend-api/complaint/update-complaint-handling';

/**
 * 获取业绩风控列表
 *
 * @param {Object} option 参数描述
 * @param {string} option.order_id 订单ID
 * @param {string} option.business_type 业务类型[1带看 2草签 3网签]
 * @param {string} option.business_id 业务ID
 * @param {string} option.order_employee_id 订单所属咨询师
 * @param {string} option.creator 修改人
 * @param {string} option.order_leader_id 咨询师主管
 * @param {string} option.business_datetime_min 业务发生时间开始
 * @param {string} option.business_datetime_max 业务发生时间结束
 * @param {string} option.create_datetime_min 修改时间开始
 * @param {string} option.create_datetime_max 修改时间结束
 * @param {string} option.audit_status 审核状态
 * @param {string} option.risk_type 修改类型[1带看人 2邀约人 3签约服务人]
 * @param {string} option.warn_level 处理结果[1没问题 2橙线 3黄线 4红线]
 * @param {string} option.cause_type 嫌疑原因
 * @param {string} option.page 分页当前页数
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2045&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E4%B8%9A%E7%BB%A9%E6%A0%B8%E7%AE%97%E9%A3%8E%E6%8E%A7&projectID=152
 * @return {Object} 风控表格数据
 */
const getPerformanceManageList = (params) => axios.get(performanceManageList, {params: params});

/**
 * 获取风控列表form表单数据（带看类型、业务类型、审核状态、处理结果、嫌疑原因）
 *
 * @param {Object} 参数：无
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2043&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E4%B8%9A%E7%BB%A9%E6%A0%B8%E7%AE%97%E9%A3%8E%E6%8E%A7&projectID=152
 * @return {Object} form表单下拉（带看类型、业务类型、审核状态、处理结果、嫌疑原因）
 */
const getRiskInitialize = () => axios.post(riskInitialize);

/**
 * 业绩核算风控详细页
 * @param {Object} params 参数描述
 * @param {string} params.risk_id 风控id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2048&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E4%B8%9A%E7%BB%A9%E6%A0%B8%E7%AE%97%E9%A3%8E%E6%8E%A7&projectID=152
 * @return {Object} 风控详情数据
 */
const getRiskInitDetail = (params) => axios.post(riskInitDetail, params);

/**
 * 业绩核算风控-审核接口
 * @param {Object} params 参数描述
 * @param {string} params.risk_id 风控id
 * @param {string} params.is_suspicion 主管/需要之间审核、没问题 管理员/确认嫌疑、排除嫌疑
 * @param {string} params.warn_level 红黄线
 * @param {string} params.remark 备注
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2046&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E4%B8%9A%E7%BB%A9%E6%A0%B8%E7%AE%97%E9%A3%8E%E6%8E%A7&projectID=152
 * @return {Object}  空
 */
const getRiskAudit = (params) => axios.post(riskAudit, params);
/**
 * 获取投诉管理数据（列表数据+页面部分权限）
 *
 * @param {Object} params 参数描述
 * @param {string} params.order_id 订单ID
 * @param {string} params.page 分页当前页数
 * @param {string} params.title 标题
 * @param {string} params.employee_name 被举报员工
 * @param {string} params.customer_name 举报人姓名
 * @param {string} params.customer_mobile 举报人联系方式
 * @param {string} params.complaint_time_start 问题发生开始时间
 * @param {string} params.complaint_time_end 问题发生结束时间
 * @param {string} params.handle_status 处理进度
 * @param {array} params.complaint_channel 举报途径[1有限举报 2电话举报 3信涵举报 4线上举报]
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2221&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E7%94%A8%E6%88%B7%E4%BE%A7%E9%A3%8E%E9%99%A9&projectID=164
 * @return {Object} 列表数据+页面部分权限
 */
const getComplaintList = (params) => axios.get(complainList, {params: params});

/**
 * 投诉管理-新建投诉
 * @param {Object} params 参数描述
 * @param {string} params.complaint_channel 举报途径
 * @param {string} params.title 标题
 * @param {string} params.city_id 所在城市
 * @param {string} params.employee_name 被举报员工
 * @param {string} params.participant 参与人
 * @param {string} params.insider 知情者
 * @param {string} params.complaint_time 问题发生时间
 * @param {string} params.content 问题描述
 * @param {string} params.investigation_proposal 调查建议
 * @param {Object} params.voucher_arr 上传凭证
 * @param {array} params.voucher_arr.img 图片
 * @param {array} params.voucher_arr.audio 视频
 * @param {string} params.customer_name 举报人姓名
 * @param {string} params.customer_mobile 举报人手机号
 * @param {string} params.customer_email 举报人邮箱
 * @param {string} params.customer_qq 举报人QQ
 * @param {string} params.customer_wechat 举报人微信
 * @param {string} params.order_id 订单id
 * @param {string} params.handle_result 处理结果
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2224&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E7%94%A8%E6%88%B7%E4%BE%A7%E9%A3%8E%E9%99%A9&projectID=164
 * @return {Object}  空
 */
const addComplaint = (params) => axios.post(complaintCreate, params);

/**
 * 投诉管理-获取投诉详情
 * @param {Object} params 参数描述
 * @param {string} params.id 投诉id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2222&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E7%94%A8%E6%88%B7%E4%BE%A7%E9%A3%8E%E9%99%A9&projectID=164
 * @return {Object}  投诉详情
 */
const getComplaintDetail = (params) => axios.post(complaintDetail, params);

/**
 * 投诉管理-新建投诉
 * @param {Object} params 参数描述
 * @param {string} params.id 投诉id
 * @param {string} params.handle_result 处理结果
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2223&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E7%94%A8%E6%88%B7%E4%BE%A7%E9%A3%8E%E9%99%A9&projectID=164
 * @return {Object}  空
 */
const updateComplaint = (params) => axios.post(complaintUpdate, params);

const riskManageApi = {
  getPerformanceManageList: getPerformanceManageList,
  getRiskInitialize: getRiskInitialize,
  getRiskInitDetail: getRiskInitDetail,
  getRiskAudit: getRiskAudit,
  getComplaintList: getComplaintList,
  addComplaint: addComplaint,
  getComplaintDetail: getComplaintDetail,
  updateComplaint: updateComplaint
};
export default riskManageApi;
