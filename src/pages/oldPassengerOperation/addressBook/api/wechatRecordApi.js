/*
 * @Description: 老客运营--微信好友管理--聊天页面api
 * @Author: xiejiaxin
 * @Date: 2019-10-08
 */
import {axios} from '@/assets/js/http/axios';

// 聊天页面API和导出API
const wechatRecordApi = '/backend-api/we-chat-manage/chat-record';
// 微信好友管理列表api
const wechatFriendListApi = '/backend-api/we-chat-manage/wechat-list';
// 公司下拉URL
const getConpanyApi = '/backend-api/select2/select2/get-auth-org-list';

/**
 * 获取聊天记录
 * @param {Object} option 参数
 * @param {string} option.employee_id	咨询师ID
 * @param {string} option.talker 聊天微信ID
 * @param {string} option.chat_start_datetime 开始时间
 * @param {string} option.chat_end_datetime 结束时间
 * @return {Promise}
 */
/**
 * 导出
 * @param {Object} option 参数
 * @param {string} option.employee_id	咨询师ID
 * @param {string} option.talker 聊天微信ID
 * @param {string} option.export 导出标识，如果有就代表导出
 * @param {string} option.chat_start_datetime 开始时间
 * @param {string} option.chat_end_datetime 结束时间
 * @return {Promise}
 */
const getWechatRecord = (option) => axios.get(wechatRecordApi, {params: option});

/**
 * 获取微信好友管理列表
 * @param {Object} option 参数
 * @param {string} option.city	城市
 * @param {string} option.employee_name 咨询师
 * @param {string} option.employee_leader 咨询师主管
 * @param {string} option.employee_manager 咨询经理
 * @param {string} option.employee_wx_id 工作微信
 * @param {string} option.friend_count 好友
 * @param {string} option.is_finish_group 是否完成分组
 * @param {string} option.is_finish_bind 是否完成绑定
 * @return {Promise}
 */
const getWechatFriendList = (option) => axios.post(wechatFriendListApi, option);

/**
 * 公司下拉
 * @param {Object} params 搜索条件对象
 * @param {String} params.q 搜索内容
 */
const getCompanyData = (params) => axios.get(getConpanyApi, {params});

export default {
  getWechatRecord,
  getWechatFriendList,
  getCompanyData
};
