/*
 * @author: hewei
 * @Date: 2020-11-24 13:41:11
 * @LastEditors: hewei
 * @LastEditTime: 2020-11-24 13:45:57
 * @description: file content
 */
import { axios } from '@/assets/js/http/axios';

// 跨公司转移订单接口
const transferOrderApi = '/backend-api/org/transfer-order/create';


/**
 * 查看城市优先级配置
 * @param {Object} params.from_org 转出公司
 * @param {Object} params.from_employee_id 转出员工
 * @param {Object} params.to_org 转入公司
 * @param {Object} params.to_employee_id 转入员工
 * @param {Object} params.status 选择订单状态
 * @param {Object} params.step 提交步骤
 * @return {Promise} promise对象
 */
const creattTransferOrder = params => axios.post(transferOrderApi, params);



export default {
    creattTransferOrder
}