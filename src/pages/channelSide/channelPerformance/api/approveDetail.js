/*
 * @author: hewei
 * @Date: 2021-05-13 11:28:42
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-13 11:39:17
 * @description: file content
 */

import {
    axios
} from '@/assets/js/http/axios';

// 转直签审批详情接口
const directSignApprvalDetailApi = '/backend-api/expand/ex-contract/direct-sign-apprval-detail';

// 转直签审核接口
const directApprovalApi = '/backend-api/expand/ex-contract/direct-sign-approval';

// 撤销审批接口
const revokeApi = '/backend-api/expand/ex-contract/revoke';

// 增加一级审批人接口
const addFirstLevelApproverApi = '/backend-api/expand/ex-contract/add-approver';







/**
 * @description: 获取转直签详情信息
 * @param {string} params.id	合同ID
 */
const getApprvalDetail = (params) => axios.get(directSignApprvalDetailApi, { params });

/**
 * @description: 转直签审核接口
 * @param {string} options.approval_status	审批状态（1通过2驳回）
 * @param {string} options.approval_id	审批id
 * @param {string} options.remarks	备注
 */
const approvalDirectSign = (options) => axios.post(directApprovalApi, options);

/**
 * @description: 撤销审批
 * @param {string} options.approval_id	审批ID
 * @param {string} options.remarks	备注
 */
const revokeApproval = (options) => axios.post(revokeApi, options);

/**
 * @description: 增加一级审批人
 * @param {string} options.approval_id	审批ID
 * @param {string} options.employee_id	审批人id
 */
const addFirstLevelApprover = (options) => axios.post(addFirstLevelApproverApi, options);



export default {
    getApprvalDetail,
    approvalDirectSign,
    revokeApproval,
    addFirstLevelApprover
}