/*
 * @Name: 微信好友管理API
 * @Description: 微信好友管理API
 * @Author: baiyunfei
 * @Date: 2019-09-27 10:35:22
 * @Editors: baiyunfei, zhengchao
 */
import {
    axios
} from '@/assets/js/http/axios';
// 获取微信用户信息URL
const weChatInfoUrl = '/backend-api/we-chat-manage/wechat-info';
// 同步微信联系人
const weChatAddressUrl = '/backend-api/order-common-api/weixin-push-app-message';
// 获取咨询师微信联系人URL
const weChartSearch = '/backend-api/order-common-api/weixin-get-employee-contact';

// 获取微信分组列表URL
const weChatAddressList = '/backend-api/we-chat-manage/wx-group-list';
// 获取微信全部分组检索URL
const getSearchGroup = '/backend-api/we-chat-manage/wx-search-all-group';
// 订单下拉搜索接口URL
const orderSearchUrl = '/backend-api/select2/select2/get-order-id-list';
// 单个绑定订单URL
const boundUrl = '/backend-api/order-common-api/weixin-save';
// 保存修改分组接口
const saveGroupUrl = '/backend-api/we-chat-manage/update-group';
// 保存修改订单接口
const saveChangeOrderUrl = '/backend-api/order-common-api/edit-order-wechat';
// 删除绑定订单接口
const deleteBindOrderUrl = '/backend-api/order-common-api/delete-order-wechat';


/**
 * 导出
 * @param {Object} params 参数
 * @param {string} params.employee_id	咨询师ID
 * @return {Promise}
 */
const getWechatInfo = (params) => axios.post(weChatInfoUrl, params);

/**
 * @description: 同步微信联系人
 * @return: {Promise}
 */
const syncWechat = () => axios.post(weChatAddressUrl);

/**
 * @description: 获取微信分组列表
 * @param {Object} params 参数
 * @param {string} params.group	分组值
 * @param {string} params.group_id 分组id
 * @param {string} params.employee_i 咨询师id
 * @param {string} params.nike_name	微信昵称
 * @param {string} params.wx_id	微信号
 * @param {string} params.order_id	订单id
 * @param {string} params.page	分页
 * @return: {Promise}
 */
const getAddressList = (params) => axios.post(weChatAddressList, params);

/**
 * @description: 微信全部分组检索接口
 * @param {Object} params 参数
 * @param {string} params.employee_id 咨询师id
 * @param {string} params.nike_name 咨询师昵称
 * @return: {Promise}
 */
const getSearchGroupPromise = (params) => axios.post(getSearchGroup, params);

/**
 * @description: 获取订单搜索接口
 * @param {Object} params 参数
 * @param {string} params.search_value 搜索值
 * @param {string} params.city_id 城市id
 * @return: {Promise}
 */
const getOrderSearch = (params) => axios.get(orderSearchUrl, {
    params: params
});
/**
 * @description: 单个绑定订单接口
 * @param {Object} params 参数
 * @param {string} params.order_id 	订单id
 * @param {string} params.wx_num 微信号
 * @param {string} params.employee_id 	咨询师id
 *  @return: {Promise}
 */
const boundOrder = (params) => axios.post(boundUrl, params);
/**
 * @description: 单个保存分组接口
 * @param {Object} params 参数
 * @param {string} params.group_id 分组id
 * @param {string} params.group_type 分组类型
 * @param {string} params.employee_id 咨询师id
 * @return: {Promise}
 */
const saveEditorGroup = (params) => axios.post(saveGroupUrl, params);
/**
 * @description:  保存修改绑定订单
 * @param {Object} params 参数
 * @param {string} params.order_wechat_id 绑定关系id(由列表页下发)
 * @param {string} params.change_to 修改以后的订单id
 * @param {string} params.reason 修改原因
 * @param {Array} params.img 图片
 * @return: {Promise}
 */
const saveChangeOrder = (parmas) => axios.post(saveChangeOrderUrl, parmas);

/**
 * @description:  删除绑定订单
 * @param {Object} params 参数
 * @param {string} params.order_wechat_id 绑定关系id(由列表页下发)
 * @param {string} params.reason 修改原因
 * @param {Array} params.img 图片
 * @return: {Promise}
 */
const deleteBindOrder = (parmas) => axios.post(deleteBindOrderUrl, parmas);

export default {
    getWechatInfo,
    syncWechat,
    getAddressList,
    getSearchGroupPromise,
    getOrderSearch,
    boundOrder,
    saveEditorGroup,
    saveChangeOrder,
    deleteBindOrder
};
