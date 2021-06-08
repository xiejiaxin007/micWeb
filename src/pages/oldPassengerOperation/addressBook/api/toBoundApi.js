/*
 * @Name: 待绑定客户api
 * @Description: 待绑定客户api
 * @Author: baiyunfei
 * @Date: 2019-09-30 11:12:13
 * @Editors: baiyunfei
 */

import {
    axios
} from '@/assets/js/http/axios'

// 待绑定订单URL
const bindTodoUrl = '/backend-api/we-chat-manage/bind-todo';
// 批量绑定订单URL
const batchBindURl = '/backend-api/order-common-api/batch-bind-order';


/**
 * @description: 待绑定订单API
 * @param {Object}  params 参数
 * @param {String}  params.employee_id 咨询师id
 * @param {String}  params.page 页码
 * @param {String}  params.page_size 分页大小
 * @return: {promise}
 */
const bindTodoList = (params) => axios.post(bindTodoUrl, params);
/**
 * @description: 批量绑定订单接口
 * @param {Object} params 参数
 * @param {string} params.employee_id 咨询师id
 * @param {Array} params.order_data 订单数据
 * @param {string} params.order_data.order_id 分组数据
 * @param {string} params.order_data.wx_id 微信号
 * @return: 
 */
const batchBindPromise = (params) => axios.post(batchBindURl, params);

export default {
    bindTodoList,
    batchBindPromise
};
