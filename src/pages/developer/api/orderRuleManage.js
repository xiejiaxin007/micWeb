/*
 * @author: wangshuaixue
 * @Date: 2020-03-26 16:09:13
 * @description:
 */
import { axios } from '@/assets/js/http/axios';

// 获取规则初始化
const ruleListApi = '/backend-api/kfs-order-rule/get-rule';
// 分配留电口
const optypeApi = '/backend-api/select2/select2/get-all-optype-dropdown-list';
// 分配渠道
const channelApi = '/backend-api/select2/select2/get-channel-dropdown-list';
// 开发商规则保存
const ruleSave = '/backend-api/kfs-order-rule/save';

/**
 * 获取规则初始化
 * @param {Object} params 参数描述
 * @param {string} params.id 规则id
 * @return {Object} 列表数据
 */
const ruleInit = (params) => axios.post(ruleListApi, params);

/**
 * 获取留电口下拉
 * @param {Object} params 参数描述
 * @param {string} params.id 规则id
 * @return {Object} 列表数据
 */
const getOptype = (params) => axios.get(optypeApi, {params: params});

/**
 * 获取分配渠道下拉
 * @param {Object} params 参数描述
 * @param {string} params.id 规则id
 * @return {Object} 列表数据
 */
const getChannel = (params) => axios.get(channelApi, {params: params});

/**
 * 保存规则
 * @param {Object} params 参数描述
 * @param {string} params.id 规则id
 * @param {string} params.developer_id 开发商ID
 * @param {string} params.project_ids 楼盘id
 * @param {string} params.port_ids 留点口id
 * @param {string} params.channel_ids 分配渠道id
 * @param {string} params.developer_rate 开发商分配比例
 * @param {string} params.is_open 是否开启 1开启 2关闭
 * @return {Object} promise
 */
const saveRule = (params) => axios.post(ruleSave, params);


const orderRuleManage = {
    ruleInit,
    getOptype,
    getChannel,
    saveRule
};
export default orderRuleManage;