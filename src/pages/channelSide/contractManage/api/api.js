/*
 * @Name: 合同管理api
 * @Description: 合同管理api
 * @Author: xiejiaxin
 * @Date: 2020-08-12
 */

import {
    axios
} from '@/assets/js/http/axios';

// 单据标准初始化api
const initStandardApi = '/backend-api/expand/ex-commission-bill/init-create';
// 更新单据标准api
const updateStandardApi = '/backend-api/expand/ex-commission-bill/update';
// 获取单据下拉api
const getStandardListApi = '/backend-api/expand/ex-commission-bill/get-bill-select2-list';
// 创建单据标准api
const createStandardApi = '/backend-api/expand/ex-commission-bill/create';
// 单据列表
const getStandardDataApi = '/backend-api/expand/ex-commission-bill/list';
// 删除单据
const deleteStandardApi = '/backend-api/expand/ex-commission-bill/delete';
// 单据标准详情页、编辑初始化、复制初始化
const getStandardInfoApi = '/backend-api/expand/ex-commission-bill/detail';
// 历史单据初始化
const getStandardHistoryInfoApi = '/backend-api/expand/ex-commission-bill/history-detail';
// 成交单结佣结佣单据详情-详情接口
const getDealDetailApi = '/backend-api/expand/ex-commission-bill/deal-detail';
// 成交单结佣单据详情-报备凭证修改接口
const updateReportApi = '/backend-api/expand/ex-commission-bill/deal-detail-report-upload';
// 成交单结佣单据详情-报备凭证审核接口
const auditReportApi = '/backend-api/expand/ex-commission-bill/deal-detail-report-audit';
// 成交单结佣单据详情-客户回访接口
const customRevisitApi = '/backend-api/expand/ex-commission-bill/deal-detail-return-visit';
// 成交单结佣单据详情-单据抽查接口
const checkDealApi = '/backend-api/expand/ex-commission-bill/deal-detail-check';
// 成交单结佣单据详情-审核有效性
const auditAvailabilityApi = '/backend-api/expand/ex-commission-bill/audit-availability';
// 成交单结佣单据详情-审核有效性初始化
const initAuditAvailabilityApi = '/backend-api/expand/ex-commission-bill/init-audit-availability';

/**
 * @description: 录入单据标准初始化
 */
const initStandard = (params) => axios.get(initStandardApi, {
    params
});

/**
 * @description: 更新单据标准
 * @param {string} params.id 单据id
 * @param {string} params.bill_name	单据名称
 * @param {string} params.list	标准列表
 * @param {string} params.list.X 1-报备凭证，2-带看凭证，3-交易凭证，4-业绩凭证
 * @param {string} params.list.cat_child_type 子类报备类型
 * @param {string} params.list.cat_child_name	子类报备名称
 * @param {string} params.list.cat_child_desc 报备类型描述
 * @param {string} params.list.is_check 是否选中（1.是 2.否）
 * @param {string} params.list.file_list 图片文件
 */
const updateStandard = (params) => axios.post(updateStandardApi, params);

/**
 * @description: 获取单据下拉
 * @param {string} params.q 搜索输入的内容
 */
const getStandardList = (params) => axios.post(getStandardListApi, params);

/**
 * @description: 创建单据标准
 * @param {string} params.bill_name	单据名称
 * @param {string} params.list	标准列表
 * @param {string} params.list.X 1-报备凭证，2-带看凭证，3-交易凭证，4-业绩凭证
 * @param {string} params.list.cat_child_type 子类报备类型
 * @param {string} params.list.cat_child_name	子类报备名称
 * @param {string} params.list.cat_child_desc 报备类型描述
 * @param {string} params.list.is_check 是否选中（1.是 2.否）
 * @param {string} params.list.file_list 图片文件
 */
const createStandard = (params) => axios.post(createStandardApi, params);
/**
 * @description: 获取单据列表
 * @param {string} params.id	单据id
 * @param {string} params.bill_name	单据名称
 * @param {string} params.creator	创建人
 * @param {string} params.contract_id	合同id
 * @param {string} params.city_id	城市id
 */
const getStandardData = (params) => axios.post(getStandardDataApi, params);
/**
 * @description: 删除单据标准
 * @param {string} params.bill_id	单据id
 */
const deleteStandard = (params) => axios.post(deleteStandardApi, params);
/**
 * @description: 单据标准详情页、编辑初始化、复制初始化
 * @param {string} params.bill_id   单据id
 */
const getStandardInfo = (params) => axios.post(getStandardInfoApi, params);
/**
 * @description: 历史单据初始化
 * @param {string} params.history_id   单据历史id
 */
const getStandardHistoryInfo = (params) => axios.post(getStandardHistoryInfoApi, params);
/**
 * @description: 成交单结佣结佣单据详情-详情接口
 * @param {string} params.deal_id	成交单id
 */
const getDealDetail = (params) => axios.post(getDealDetailApi, params);
/**
 * @description: 成交单结佣单据详情-报备凭证修改接口
 * @param {string} params.deal_id   成交单id
 * @param {Array} params.file_list	图片list 半链接数组
 */
const updateReport = (params) => axios.post(updateReportApi, params);
/**
 * @description: 成交单结佣单据详情-报备凭证审核接口
 * @param {string} params.deal_id   成交单id
 * @param {string} params.status	状态 1通过 2驳回
 * @param {string} params.reject_reason	驳回原因
 */
const auditReport = (params) => axios.post(auditReportApi, params);
/**
 * @description: 成交单结佣单据详情-客户回访接口
 * @param {string} params.deal_id   成交单id
 * @param {string} params.status	状态 1通过 2驳回
 * @param {string} params.reject_reason	驳回原因
 */
const customRevisit = (params) => axios.post(customRevisitApi, params);
/**
 * @description: 成交单结佣单据详情-单据抽查接口
 * @param {string} params.deal_id   成交单id
 * @param {string} params.status	状态 1通过 2驳回
 * @param {string} params.reject_reason	驳回原因
 */
const checkDeal = (params) => axios.post(checkDealApi, params);

/**
 * @description: 成交单结佣单据详情-审核有效性
 * @param {string} params.deal_id	成交单id
 * @param {string} params.result	审核结果   1=有效   2=无效  3=待定
 * @param {string} params.wait_reason	待定原因逗号隔开
 * @param {string} params.invalid_reason	无效原因逗号隔开
 * @param {string} params.remarks	备注
 */
const auditAvailability = (params) => axios.post(auditAvailabilityApi, params);
// 成交单结佣单据详情-审核有效性初始化
const initAuditAvailability = () => axios.get(initAuditAvailabilityApi);

export default {
    initStandard,
    updateStandard,
    getStandardList,
    createStandard,
    getStandardData,
    deleteStandard,
    getStandardInfo,
    getStandardHistoryInfo,
    getDealDetail,
    updateReport,
    auditReport,
    customRevisit,
    checkDeal,
    auditAvailability,
    initAuditAvailability
};
