/**
 * @description: 开发商分配规则相关api
 * @author: wangxue
 * @date: 2020-03-25
 */
import { axios } from '@/assets/js/http/axios';

// 开发商规则列表
const allocListApi = '/backend-api/kfs-order-rule/list';
// 删除配置
const delRuleApi = '/backend-api/kfs-order-rule/delete-rule';

/**
 * 开发商规则列表
 * @param {Object} params 参数描述
 * @param {string} params.page 页码
 * @param {string} params.developer_name 开发商名称
 * @param {string} params.project_name 楼盘名称
 * @param {string} params.update_datetime_min 最小更新时间
 * @param {string} params.update_datetime_max 最大更新时间
 * @param {string} params.project_id 楼盘id
 * @param {string} params.is_open 是否开启 1开启 2关闭
 * @return {Object} 列表数据
 */
const allocList = (params) => axios.post(allocListApi, params);
/**
 * 删除配置
 * @param {Object} params 参数描述
 * @param {string} params.id 规则id
 * @return {Object}
 */
const delRule = (params) => axios.post(delRuleApi, params);


const allocRuleApi = {
    allocList,
    delRule
};
export default allocRuleApi;
