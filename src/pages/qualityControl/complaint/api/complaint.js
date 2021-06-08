/**
 * @description: 客诉需求相关api
 * @author: wangxue
 * @date: 2020-07-14
 */
import {
    axios
} from '@/assets/js/http/axios';

// 客诉选项公共接口
const commonOptionsApi = '/backend-api/complaint/common-options';
// 获取转交人，咨询师，绩效责任上级
const getTransferInfoApi = '/backend-api/employee_order/yw-complaints/get-transfer-info';
// 根据咨询师获取绩效责任上级
const getAdjustLeaderInfoApi = '/backend-api/employee_order/yw-complaints/get-adjust-leader-info';
// 客诉问题详情&编辑初始化
const getComplaintDetailApi = '/backend-api/employee_order/yw-complaints/detail';
// 客诉问题跟进详情
const getFollowDetailApi = '/backend-api/employee_order/yw-complaints/follow-detail';
// 新建报错客诉任务
const addComplaintApi = '/backend-api/employee_order/yw-complaints/create-complaint';
// 编辑保存客诉任务
const editComplaintApi = '/backend-api/employee_order/yw-complaints/update-complaint';
// 咨询部跟进 客诉处理表单保存  识别value:5
const saveHeadFollowApi = '/backend-api/employee_order/yw-complaints/head-follow';
// 楼盘任务跟进；  楼盘反馈表单保存   识别value:6
const saveProjectFollowApi = '/backend-api/employee_order/yw-complaints/project-follow';
// 品控服管二次跟进，录入绩效处理结果；绩效红黄线表单保存  识别value:8
const saveResultFollowApi = '/backend-api/employee_order/yw-complaints/result-follow';
// 咨询部申诉  申诉表单保存  识别value:9
const saveAppealFollowApi = '/backend-api/employee_order/yw-complaints/complaint';
// 服管处理建议 识别value:7
const saveSuggestionApi = '/backend-api/employee_order/yw-complaints/suggestion';
// 驳回任务
const rejectTaskApi = '/backend-api/employee_order/yw-complaints/reject-task';
// 确认无误/确认收到/撤销申诉/关闭任务
const commonFollowApi = '/backend-api/employee_order/yw-complaints/common-follow';

// 客诉跟进人列表
const complaintEmployeeListApi = '/backend-api/employee_order/yw-complaint-employee/list';
// 客诉跟进人下拉
const getComplaintEmployeeApi = '/backend-api/select2/select2/get-complaint-employee';
// 新增/编辑客诉跟进人
const complaintEmployeeSaveApi = '/backend-api/employee_order/yw-complaint-employee/save';
// 删除客诉跟进人
const complaintEmployeeDeleteApi = '/backend-api/employee_order/yw-complaint-employee/delete';
// 开启/暂停任务
const complaintEmployeeChangeAllocApi = '/backend-api/employee_order/yw-complaint-employee/change-alloc';
// 客诉问题列表
const ywComplaintsListApi = '/backend-api/employee_order/yw-complaints/list';
// 变更跟进人
const changeEmployeeApi = '/backend-api/employee_order/yw-complaints/change-employee';
// 客诉-导入投诉对象&原因api
const importReasonApi = '/backend-api/employee_order/yw-complaints/import-category';

/**
 * 变更跟进人
 * @param {Object} params 参数描述
 * @param {string} params.id 记录id
 * @param {string} params.employee_id 咨询师id
 * @return {Object}
 */
const changeEmployee = (params) => axios.post(changeEmployeeApi, params);

/**
 * 客诉问题列表
 * @param {Object} params 参数描述
 * @param {string} params.complaint_time_min 投诉时间
 * @param {string} params.complaint_time_max 投诉时间
 * @param {string} params.complete_time_min 完成时间
 * @param {string} params.complete_time_max 完成时间
 * @param {string} params.complaint_type 投诉类型
 * @param {string} params.order_id 订单id
 * @param {string} params.user_realname 用户名
 * @param {string} params.user_mobile 手机号
 * @param {string} params.employee_id 咨询师
 * @param {string} params.adjust_leader_id	绩效上级
 * @param {string} params.city_id	城市id
 * @param {string} params.red_yellow_influence	红黄线影响
 * @param {string} params.complaint_source	客诉来源
 * @param {string} params.complaint_category	投诉对象
 * @param {string} params.one_cause	一级原因
 * @param {string} params.two_cause	二级原因
 * @param {string} params.three_cause	三级原因
 * @param {string} params.adjust_influence	绩效影响
 * @param {string} params.follow_employee	当前处理人
 * @param {string} params.delay_info	延迟情况
 * @param {string} params.is_many_order	是否万单
 * @param {string} params.complaint_progress	客诉状态
 * @param {string} params.order_status	订单状态
 * @param {string} params.page 页码
 * @return {Object}
 */
const ywComplaintsList = (params) => axios.get(ywComplaintsListApi, {params});
/**
 * 客诉选项公共接口
 * @param {Object} params 参数描述
 * @return {Object}
 */
const commonOptions = () => axios.post(commonOptionsApi);
/**
 * 删除客诉跟进人
 * @param {Object} params 参数描述
 * @param {string} params.id 记录id
 * @return {Object}
 */
const complaintEmployeeDelete = (params) => axios.post(complaintEmployeeDeleteApi, params);
/**
 * 开启/暂停任务
 * @param {Object} params 参数描述
 * @param {string} params.id 记录id
 * @param {string} params.is_alloc 分配状态 1开启 2暂停
 * @return {Object}
 */
const complaintEmployeeChangeAlloc = (params) => axios.post(complaintEmployeeChangeAllocApi, params);
/**
 * 获取转交人，咨询师，绩效责任上级
 * @param {Object} params 参数描述
 * @param {string} params.complaint_type 投诉类型
 * @param {string} params.city_id 城市ID
 * @param {string} params.order_id 订单ID
 * @return {Object}
 */
const getTransferInfo = (params) => axios.post(getTransferInfoApi, params);
/**
 * 根据咨询师获取绩效责任上级
 * @param {Object} params 参数描述
 * @param {string} params.employee_id 员工id
 * @return {Object}
 */
const getAdjustLeaderInfo = (params) => axios.post(getAdjustLeaderInfoApi, params);
/**
 * 客诉问题详情&编辑初始化
 * @param {Object} params 参数描述
 * @param {string} params.id 客诉id
 * @param {string} params.type 1-查看 2-编辑
 * @return {Object}
 */
const getComplaintDetail = (params) => axios.post(getComplaintDetailApi, params);
/**
 * 客诉问题跟进详情
 * @param {Object} params 参数描述
 * @param {string} params.id 客诉id
 * @return {Object}
 */
const getFollowDetail = (params) => axios.post(getFollowDetailApi, params);
/**
 * 新建客诉任务
 * @param {Object} params 参数描述
 * @param {string} params.complaint_type	客诉类型
 * @param {string} params.force	是否二次确认 1:否 0:是	   打断提示用的
 * @param {string} params.city_id	城市id
 * @param {string} params.user_realname	  用户姓名
 * @param {string} params.user_mobile	用户手机号
 * @param {string} params.complaint_time	投诉时间
 * @param {string} params.complaint_source	客诉来源
 * @param {string} params.complaint_desc	客户反馈内容
 * @param {string} params.service_handle_desc  服管处理建议
 * @param {string} params.order_id	订单id
 * @param {string} params.is_many_order	是否万单（1.是 2.否）
 * @param {string} params.employee_id	咨询师id
 * @param {string} params.adjust_leader_id	绩效责任上级
 * @param {string} params.request_contact_time	要求联系时间
 * @param {string} params.complaint_category	投诉对象
 * @param {string} params.one_cause	一级原因
 * @param {string} params.two_cause	二级原因
 * @param {string} params.three_cause	三级原因
 * @param {string} params.business_id	转交人配置id
 * @param {string} params.transferor	转交人
 * @param {Object} params.complaint_file	客诉文件
 * @param {Array} params.complaint_file.img_arr	图片文件  半路径图片地址
 * @param {Array} params.complaint_file.voice_arr	音频文件 半路径图片地址
 * @return {Object}
 */
const addComplaint = (params) => axios.post(addComplaintApi, params);
/**
 * 编辑保存客诉任务
 * @param {Object} params 参数描述
 * @param {string} params.id 客诉id
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {string} params.force	是否二次确认 1:否 0:是	   打断提示用的
 * @param {string} params.city_id	城市id
 * @param {string} params.user_realname	  用户姓名
 * @param {string} params.user_mobile	用户手机号
 * @param {string} params.complaint_time	投诉时间
 * @param {string} params.complaint_source	客诉来源
 * @param {string} params.complaint_desc	客户反馈内容
 * @param {string} params.service_handle_desc  服管处理建议
 * @param {string} params.order_id	订单id
 * @param {string} params.is_many_order	是否万单（1.是 2.否）
 * @param {string} params.employee_id	咨询师id
 * @param {string} params.adjust_leader_id	绩效责任上级
 * @param {string} params.request_contact_time	要求联系时间
 * @param {string} params.complaint_category	投诉对象
 * @param {string} params.one_cause	一级原因
 * @param {string} params.two_cause	二级原因
 * @param {string} params.three_cause	三级原因
 * @param {string} params.business_id	转交人配置id
 * @param {string} params.transferor	转交人
 * @param {Object} params.complaint_file	客诉文件
 * @param {Array} params.complaint_file.img_arr	图片文件  半路径图片地址
 * @param {Array} params.complaint_file.voice_arr	音频文件 半路径图片地址
 * @return {Object}
 */
const editComplaint = (params) => axios.post(editComplaintApi, params);

/**
 * 咨询部跟进 客诉处理表单保存  识别value:5
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {string} params.detail	客诉处理详情
 * @param {Object} params.file	客诉文件
 * @param {Array} params.file.pic	图片文件  半路径图片地址
 * @param {Array} params.file.audio	音频文件 半路径图片地址
 * @param {Object} params.yw_complaints	 客诉表单要保存的值
 * @param {Object} params.yw_complaints.complaint_category	 投诉对象
 * @param {Object} params.yw_complaints.one_cause	 一级原因
 * @param {Object} params.yw_complaints.two_cause	 二级原因
 * @param {Object} params.yw_complaints.three_cause	 三级原因
 * @param {Object} params.yw_complaints.is_many_order	 是否万单
 * @return {Object}
 */
const saveHeadFollow = (params) => axios.post(saveHeadFollowApi, params);

/**
 * 楼盘任务跟进；  楼盘反馈表单保存   识别value:6
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {string} params.exact 反馈是否准确 1-是 2-否
 * @param {string} params.complete 处理是否完成 1-是 2-否
 * @param {string} params.detail	处理结果
 * @param {Object} params.yw_complaints	 客诉表单要保存的值
 * @param {Object} params.yw_complaints.complaint_category	 投诉对象
 * @param {Object} params.yw_complaints.one_cause	 一级原因
 * @param {Object} params.yw_complaints.two_cause	 二级原因
 * @param {Object} params.yw_complaints.three_cause	 三级原因
 * @param {Object} params.yw_complaints.is_many_order	 是否万单
 * @return {Object}
 */
const saveProjectFollow = (params) => axios.post(saveProjectFollowApi, params);

/**
 * 品控服管二次跟进，录入绩效处理结果；绩效红黄线表单保存  识别value:8
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {string} params.adjust	绩效影响
 * @param {string} params.warning	红黄线影响
 * @param {string} params.detail	处理结果
 * @param {Object} params.yw_complaints	 客诉表单要保存的值
 * @param {Object} params.yw_complaints.complaint_category	 投诉对象
 * @param {Object} params.yw_complaints.one_cause	 一级原因
 * @param {Object} params.yw_complaints.two_cause	 二级原因
 * @param {Object} params.yw_complaints.three_cause	 三级原因
 * @param {Object} params.yw_complaints.is_many_order	 是否万单
 * @return {Object}
 */
const saveResultFollow = (params) => axios.post(saveResultFollowApi, params);

/**
 * 咨询部申诉  申诉表单保存  识别value:9
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {string} params.reason	原因
 * @param {string} params.expect	申诉期望
 * @param {Object} params.file	客诉文件
 * @param {Array} params.file.pic	图片文件  半路径图片地址
 * @param {Array} params.file.audio	音频文件 半路径图片地址
 * @param {Object} params.yw_complaints	 客诉表单要保存的值
 * @param {Object} params.yw_complaints.complaint_category	 投诉对象
 * @param {Object} params.yw_complaints.one_cause	 一级原因
 * @param {Object} params.yw_complaints.two_cause	 二级原因
 * @param {Object} params.yw_complaints.three_cause	 三级原因
 * @param {Object} params.yw_complaints.is_many_order	 是否万单
 * @return {Object}
 */
const saveAppealFollow = (params) => axios.post(saveAppealFollowApi, params);

/**
 * 服管处理建议 识别value:7
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {Object} params.yw_complaints	 客诉表单要保存的值
 * @param {Object} params.yw_complaints.complaint_category	 投诉对象
 * @param {Object} params.yw_complaints.one_cause	 一级原因
 * @param {Object} params.yw_complaints.two_cause	 二级原因
 * @param {Object} params.yw_complaints.three_cause	 三级原因
 * @param {Object} params.yw_complaints.is_many_order	 是否万单
 * @param {Object} params.yw_complaints.service_handle_desc	服管处理建议
 * @return {Object}
 */
const saveSuggestion = (params) => axios.post(saveSuggestionApi, params);
/**
 * 驳回任务
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @param {string} params.reason	原因
 * @param {Object} params.yw_complaints	 客诉表单要保存的值
 * @param {Object} params.yw_complaints.complaint_category	 投诉对象
 * @param {Object} params.yw_complaints.one_cause	 一级原因
 * @param {Object} params.yw_complaints.two_cause	 二级原因
 * @param {Object} params.yw_complaints.three_cause	 三级原因
 * @param {Object} params.yw_complaints.is_many_order	 是否万单
 * @return {Object}
 */
const rejectTask = (params) => axios.post(rejectTaskApi, params);
/**
 * 确认无误/确认收到/撤销申诉/关闭任务
 * @param {Object} params 参数描述
 * @param {string} params.complaints_id 客诉id
 * @param {string} params.follow_type 返回button对应的value
 * @param {string} params.update_datetime 客诉上一次更新时间，校验是否变更使用
 * @return {Object}
 */
const commonFollow = (params) => axios.post(commonFollowApi, params);


/**
 * 客诉跟进人列表
 * @param {Object} params 参数描述
 * @param {string} params.city_id 城市
 * @param {string} params.complaint_type 投诉类型
 * @param {string} params.employee_id 跟进人
 * @param {string} params.is_alloc 分配状态
 * @param {string} params.stop_time_min 暂停时间
 * @param {string} params.stop_time_max 暂停时间
 * @param {string} params.employee_status 在职状态
 * @param {string} params.page 页码
 * @return {Object}
 */
const complaintEmployeeList = (params) => axios.post(complaintEmployeeListApi, params);

/**
 * 客诉跟进人下拉
 * @param {Object} params 参数描述
 * @param {string} params.q 搜索参数
 * @return {Object}
 */
const getComplaintEmployee = (params) => axios.post(getComplaintEmployeeApi, params);

/**
 * 新增/编辑客诉跟进人
 * @param {Object} params 参数描述
 * @param {string} params.city_id 城市id
 * @param {string} params.complaint_type 投诉类型
 * @param {string} params.employee_id 跟进人id
 * @return {Object}
 */
const complaintEmployeeSave = (params) => axios.post(complaintEmployeeSaveApi, params);

/**
 * 客诉-导入投诉对象&原因
 * @param {Object} params 参数描述
 * @param {string} params.file_data 文件流，base64
 */
const importReason = (params) => axios.post(importReasonApi, params);

export default {
    commonOptions,
    getTransferInfo,
    getAdjustLeaderInfo,
    getComplaintDetail,
    getFollowDetail,
    addComplaint,
    editComplaint,
    saveHeadFollow,
    saveProjectFollow,
    saveResultFollow,
    saveAppealFollow,
    saveSuggestion,
    rejectTask,
    commonFollow,
    complaintEmployeeList,
    getComplaintEmployee,
    complaintEmployeeSave,
    complaintEmployeeDelete,
    complaintEmployeeChangeAlloc,
    ywComplaintsList,
    changeEmployee,
    importReason
};
