/*
 * @Author: xie bin
 * @Date: 2021-05-17 15:48:00
 * @LastEditTime: 2021-05-25 11:32:47
 * @LastEditors: xie bin
 * @Description: 新版绩效api
 * @FilePath: /webapp_backend/src/pages/consultor/consultantPerformance/api/auditApi.js
 */
 import { axios } from '@/assets/js/http/axios';
 // 获取提点审批列表url
 const commissionListApi = '/backend-api/performance/integral-audit/commission-list';
 
 // 获取积分审批列表url
 const scoreAuditListApi = '/backend-api/performance/integral-audit/score-list';
 
 // 审核url
 const coommonAuditApi = '/backend-api/performance/integral-audit/header-manage-audit';
 
 // 审核记录url
 const auditHistoryApi = '/backend-api/performance/integral-audit/history-list';
 
 // 商务积分审核url
 const bussinessAuditApi = '/backend-api/performance/integral-audit/business-audit';
 
 /**
  * 积分审核接口
  *
  * @param {Object} params 参数描述
  * @param {string} params.id 任务id
  * @param {string} params.type 审核类型  1是提点 2是积分
  * @param {string} params.result 审核状态  1是通过 2是驳回
  * @return {promise} 审核状态
  */
 const coommonAuditData = params => axios.post(coommonAuditApi, params);
 
 /**
  * 商务审核接口
  *
  * @param {Object} params 参数描述
  * @param {string} params.id 任务id
  * @param {string} params.type 审核类型  1是提点 2是积分
  * @param {string} params.result 审核状态  1是通过 2是驳回
  * @return {promise} 审核状态
  */
 const bussinessAuditData = params => axios.post(bussinessAuditApi, params);

 /**
  * 审核记录
  *
  * @param {Object} params 参数描述
  * @param {string} params.id 任务id
  * @return {promise} 审核状态
  */
 const auditHistoryData = params => axios.get(auditHistoryApi, {params});

 /**
  * 获取提点审批列表接口
  *
  * @param {Object} params 参数描述
  * @param {string} params.page 页码
  * @param {string} params.page_size 数据行数
  * @param {string} params.order_id 订单id
  * @param {string} params.deal_id 成交单id
  * @param {string} params.business_id 认购id
  * @param {string} params.subscribe_name 客户姓名
  * @param {string} params.auditor 审核人
  * @param {string} params.employee_id 咨询师id
  * @param {string} params.project_id 楼盘id
  * @param {string} params.audit_status 审核状态
  * @param {string} params.audit_start_time 审核时间
  * @param {string} params.audit_end_time 审核截止时间
  * @param {string} params.submit_start_time 提交时间
  * @param {string} params.submit_end_time 提交截止时间
  * @param {string} params.need_leader_audit 只看需要我审核的
  * @return {Object}
  */
 const commissionListData = (params) => axios.get(commissionListApi, {params});

 /**
  * 获取积分审批列表接口
  *
  * @param {Object} params 参数描述
  * @param {string} params.page 页码
  * @param {string} params.page_size 数据行数
  * @param {string} params.order_id 订单id
  * @param {string} params.deal_id 成交单id
  * @param {string} params.sign_id 网签id
  * @param {string} params.grass_sign_id 草签id
  * @param {string} params.subscribe_name 客户姓名
  * @param {string} params.auditor 审核人
  * @param {string} params.employee_id 咨询师id
  * @param {string} params.project_id 楼盘id
  * @param {string} params.customer_intent_city 客户意向城市
  * @param {string} params.audit_status 审核状态
  * @param {string} params.audit_start_time 审核时间
  * @param {string} params.audit_end_time 审核截止时间
  * @param {string} params.submit_start_time 提交时间
  * @param {string} params.submit_end_time 提交截止时间
  * @param {string} params.need_leader_audit 只看需要我审核的
  * @return {Object}
  */
 const scoreAuditListData = (params) => axios.get(scoreAuditListApi, {params});
 
export default {
    commissionListData,
    coommonAuditData,
    auditHistoryData,
    scoreAuditListData,
    bussinessAuditData
 };
 