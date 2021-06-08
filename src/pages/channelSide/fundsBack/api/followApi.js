/*
 * @Name: 跟进相关api
 * @Description: 跟进相关api
 * @Author: xiejiaixn
 * @Date: 2020-04-22
 */

import {
    axios
} from '@/assets/js/http/axios';

// 回款流程配置管理页
const getFundsBackListApi = '/backend-api/expand/ex-money-back-config/list';
// 新增流程配置接口
const addFundsBackApi = '/backend-api/expand/ex-money-back-config/add-config';
// 编辑流程配置接口
const editFundsBackApi = '/backend-api/expand/ex-money-back-config/edit-config';
// 回款流程编辑初始化接口
const initEditFundsBackApi = '/backend-api/expand/ex-money-back-config/edit-init';
// 回款流程查看初始化接口
const getFundsBackInfoApi = '/backend-api/expand/ex-money-back-config/view-init';
// 删除回款流程接口
const delFundsBackApi = '/backend-api/expand/ex-money-back-config/del-config';
// 初始化待跟进列表筛选项下拉api
const stayFollowInitApi = '/backend-api/expand/ex-money-back-group/init';
// 初始化待跟进列表api
const stayFollowTbApi = '/backend-api/expand/ex-money-back-group/to-be-assoc-list';
// 手动标记开始业绩确认api
const markConfrimApi = '/backend-api/expand/ex-money-back-group/add-group';
// 获取回款组跟进初始化接口
const initFollowApi = '/backend-api/expand/ex-money-back-group/init-follow';
// 获取成交单或者回款组的合同预测列表
const followedForecastListApi = '/backend-api/expand/ex-money-back-group/followed-forecast-list';
// 跟进详情页获取合同预测列表
const getForecastListApi = '/backend-api/expand/ex-money-back-group/get-forecast';
// 跟进流程录入保存接口
const addFollowApi = '/backend-api/expand/ex-money-back-group/add-follow';
// 初始化跟进列表api
const followTbApi = '/backend-api/expand/ex-money-back-group/list';
// 跟进列表合并跟进api
const mergeFollowApi = '/backend-api/expand/ex-money-back-group/merge';
// 获取回款组跟进详情接口
const followDetailApi = '/backend-api/expand/ex-money-back-group/follow-detail';
// 主管审核跟进接口
const followAuditApi = '/backend-api/expand/ex-money-back-group/follow-audit';
// 回款组详情接口
const getGroupDetailApi = '/backend-api/expand/ex-money-back-group/group-detail';
// 成交单详情接口
const getDealDetailApi = '/backend-api/expand/ex-money-back-group/deal-detail';
// 删除回款组api
const delGroupApi = '/backend-api/expand/ex-money-back-group/cancel';
// 恢复回款组api
const resumeGroupApi = '/backend-api/expand/ex-money-back-group/recovery';


/**
 * @description: 删除回款组
 * @param {string} options.group_id	回款组id
 * @param {string} options.cancel_reason  删除原因
 */
const delGroup = (options) => axios.post(delGroupApi, options);

/**
 * @description: 恢复回款组
 * @param {string} options.group_id	回款组id
 * @param {string} options.recovery_reason	恢复原因
 */
const resumeGroup = (options) => axios.post(resumeGroupApi, options);

/**
 * @description: 回款流程配置管理页
 * @param {string} options.id	回款流程id
 * @param {string} options.process_name	回款流程
 * @param {string} options.creator	创建者
 * @param {string} options.is_relation_contract	是否关联合同 1.是 2.否
 * @param {string} options.is_relation_deal	是否关联成交单 1.是 2.否
 * @param {string} options.relation_project	关联楼盘
 * @param {string} options.page	页码
 */
const getFundsBackList = (options) => axios.post(getFundsBackListApi, options);

/**
 * @description: 新增流程配置接口
 * @param {string} options.process_name	回款流程名称
 * @param {string} options.is_default	是否是默认
 * @param {array} options.data_list
 * @param {string} options.data_list.stage_id	阶段id
 * @param {string} options.data_list.stage_type	阶段类型
 * @param {string} options.data_list.is_open	是否有此阶段   （1.是 2.否）
 * @param {string} options.data_list.date_type	日期类型   （1.固定日期 2.固定天数）
 * @param {string} options.data_list.fixed_date_type	固定日期单位  （1.当月 2.下月 3.当周 4.下周 5.工作日 6.自然日）
 * @param {string} options.data_list.fixed_date	固定日期  （月存几号 ，周存周几 天数存几天）
 * @param {string} options.data_list.contacter	对接人
 */
const addFundsBack = (options) => axios.post(addFundsBackApi, options);

/**
 * @description: 编辑流程配置接口
 * @param {string} options.id	回款流程id
 * @param {string} options.process_name	回款流程名称
 * @param {string} options.is_default	是否是默认
 * @param {array} options.data_list
 * @param {string} options.data_list.stage_id	阶段id
 * @param {string} options.data_list.stage_type	阶段类型
 * @param {string} options.data_list.is_open	是否有此阶段
 * @param {string} options.data_list.date_type	日期类型
 * @param {string} options.data_list.fixed_date_type	固定日期单位
 * @param {string} options.data_list.fixed_date	固定日期
 * @param {string} options.data_list.contacter	对接人
 */
const editFundsBack = (options) => axios.post(editFundsBackApi, options);

/**
 * @description: 回款流程编辑初始化接口
 * @param {string} options.id	回款流程id
 */
const initEditFundsBack = (options) => axios.post(initEditFundsBackApi, options);

/**
 * @description: 回款流程查看初始化接口
 * @param {string} options.id	回款流程id
 */
const getFundsBackInfo = (options) => axios.post(getFundsBackInfoApi, options);

/**
 * @description: 删除回款流程接口
 * @param {string} options.id	回款流程id
 */
const delFundsBack = (options) => axios.post(delFundsBackApi, options);

/**
 * @description: 初始化待跟进列表筛选项下拉
 * @param {string} params.see_project_id 带看ID
 * @param {string} params.room_id 房间ID
 */
const stayFollowInit = (params) => axios.get(stayFollowInitApi, {params});

/**
 * @description: 初始化待跟进列表
 * @param {string} params.city_id 跟进城市ID
 * @param {string} params.deal_id 成交单ID
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.user_name 客户姓名
 * @param {string} params.deal_step 成交单进度
 * @param {string} params.cooperate_type 合作方式
 * @param {string} params.commission_type 回款类型
 * @param {string} params.payback_employee_id 回款负责人
 * @param {string} params.cw_supplier_id 合作方主体
 * @param {string} params.ex_money_back_config_id 回款流程
 * @param {string} params.page 页码
 * @param {string} params.limit 每页条数
 */
const stayFollowTb = (params) => axios.get(stayFollowTbApi, {params});

/**
 * @description: 手动标记开始业绩确认
 * @param {string} params.forecast_id 要标记的组
 */
const markConfrim = (params) => axios.get(markConfrimApi, {params});
/**
 * @description: 获取回款组跟进初始化接口
 * @param {string} options.group_id 组id
 */
const initFollow = (options) => axios.post(initFollowApi, options);
/**
 * @description: 获取成交单或者回款组的合同预测列表
 * @param {string} options.type 1.获取成交单维度的，2.回款组维度
 * @param {string} options.id 成交单id，回款组id
 */
const followedForecastList = (params) => axios.get(followedForecastListApi, {params});
/**
 * @description: 跟进详情页获取合同预测列表
 * @param {string} options.follow_id 跟进id
 */
const getForecastList = (params) => axios.post(getForecastListApi, params);
/**
 * @description: 跟进流程录入保存接口
 * @param {string} params.group_id 回款组ID
 * @param {string} params.follow_datetime 实际跟进时间
 * @param {string} params.plan_pay_datetime 预计回款时间
 * @param {string} params.employee_id 本次跟进人
 * @param {string} params.follow_text 跟进说明
 * @param {string} params.next_follow_datetime 下次跟进时间
 * @param {string} params.start_stage_type 当前阶段
 * @param {string} params.back_stage_type 回退的阶段
 * @param {string} params.target_stage_type 目标阶段，最后选择是的阶段
 * @param {string} params.file 跟进凭证 1图片 2文件
 * @param {string} params.stage_type_list 阶段模块
 * @param {string} params.money 本次跟进金额
 * @param {string} params.move 移除id
 */
const addFollow = (options) => axios.post(addFollowApi, options, {
    headers: {
        'Content-Type': 'application/json'
    }
});
/**
 * @description: 获取回款组跟进详情接口
 * @param {string} options.follow_id 跟进id
 */
const followDetail = (options) => axios.post(followDetailApi, options);
/**
 * @description: 主管审核跟进接口
 * @param {string} params.follow_id 跟进id
 * @param {string} params.audit_status 跟进审核状态 1.待审核2.审核通过3.审核驳回
 * @param {string} params.reject_text 驳回理由
 */
const followAudit = (options) => axios.post(followAuditApi, options);

/**
 * @description: 初始化待跟进列表
 * @param {string} params.id 回款组ID
 * @param {string} params.city_id 跟进城市ID
 * @param {string} params.commission_type 回款类型
 * @param {string} params.cooperate_type 合作方式
 * @param {string} params.partner_id 合作方
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.deal_id 成交单ID
 * @param {string} params.user_name 客户姓名
 * @param {string} params.payback_employee_id 回款负责人
 * @param {string} params.plan_pay_datetime 预计回款时间
 * @param {string} params.follow_employee_id 最新跟进人
 * @param {string} params.ex_money_back_config_id 回款流程IDleader_id
 * @param {string} params.leader_id 当前主管
 * @param {string} params.stage_type 当前阶段
 * @param {string} params.page 页码
 * @param {string} params.limit 每页条数
 */
const followTb = (params) => axios.post(followTbApi, params);

/**
 * @description: 跟进列表合并跟进
 * @param {string} options.group_id 回款组ID，逗号分割
 */
const mergeFollow = (options) => axios.post(mergeFollowApi, options);

/**
 * @description: 回款组详情接口
 * @param {string} options.group_id 回款组ID
 */
const getGroupDetail = (options) => axios.post(getGroupDetailApi, options);

/**
 * @description: 成交单详情接口
 * @param {string} options.deal_id 成交单id
 */
const getDealDetail = (options) => axios.post(getDealDetailApi, options);

export default {
    getFundsBackList,
    addFundsBack,
    editFundsBack,
    initEditFundsBack,
    getFundsBackInfo,
    delFundsBack,
    stayFollowInit,
    stayFollowTb,
    markConfrim,
    initFollow,
    followedForecastList,
    getForecastList,
    addFollow,
    followTb,
    mergeFollow,
    followDetail,
    followAudit,
    getGroupDetail,
    getDealDetail,
    delGroup,
    resumeGroup
};
