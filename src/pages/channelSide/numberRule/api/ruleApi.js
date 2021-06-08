/**
 * @name: 智能报备2.0序号规则
 * @description: 智能报备2.0序号规则
 * @author: 康雪
 * @date: 2020-4-17
 */
import { axios } from '@/assets/js/http/axios';
// 获取序号规则列表
const getNumberRuleListApi = '/backend-api/report-config/list';
// 获取序号规则详情
const getNumberRuleInfoApi = '/backend-api/report-config/view';
// 添加/编辑序号规则
const saveNumberRuleInfoApi = '/backend-api/report-config/create';

/**
* 获取序号规则列表
* @param {Object} option 参数描述
* @param {string} option.id	序号id
* @param {string} option.name	序号名称
* @param {string} option.project_id	楼盘id
* @param {string} option.updator	更新人
*/
const getNumberRuleList = (params) => axios.post(getNumberRuleListApi, params);
/**
* 获取序号规则详情
* @param {Object} option 参数描述
* @param {string} option.id	序号id
*/
const getNumberRuleInfo = (params) => axios.post(getNumberRuleInfoApi, params);
/**
* 添加/编辑序号规则
* @param {Object} option 参数描述
* @param {string} option.number_id	序号id
* @param {string} option.name	序号名称
* @param {string} option.rate_type	累计频率 1.按天 2.按周 3.按月 4.从某天开始累计 5.手动统计
* @param {string} option.start_datetime	开始时间
* @param {string} option.number_type	序号格式 1：1,2,3 2: 01,02,03
* @param {string} option.range_type	累计范围 1.首访 2.首访+复访
* @param {string} option.init_value	初始累计开始值
* @param {string} option.again_value	以后每次重新累计的开始
*/
const saveNumberRuleInfo = (params) => axios.post(saveNumberRuleInfoApi, params);


export default {
    getNumberRuleList,
    getNumberRuleInfo,
    saveNumberRuleInfo
};
