import {axios} from '@/assets/js/http/axios'

const pollingNewMsgUrl = '/backend-api/wechat-trusteeship/polling-get-msg'// 新消息轮询接口
const getCounselorListUrl = '/backend-api/wechat-trusteeship/get-trusteeship-wx'// 获取咨询师列表接口
const getChatContentUrl = '/backend-api/wechat-trusteeship/get-msg'// 获取聊天内容
const getChatContUserInfoUrl = '/backend-api/wechat-trusteeship/get-wechat-info'// 获取聊天窗口好友信息
const getFriendsMessageListUrl = '/backend-api/wechat-trusteeship/get-notice-list'// 获取消息列表
const getFrinendsListUrl = '/backend-api/wechat-trusteeship/get-friend'// 获取好友列表
const sendMessageUrl = '/backend-api/wechat-trusteeship/send-msg'// 发送消息
const getchatMessageFriendINfoUrl = '/backend-api/wechat-trusteeship/get-wechat-info'// 获取聊天内容框的好友托管状态及信息
const crateWechatBoxUrl = '/backend-api/wechat-trusteeship/set-in-notice'// 点击好友生成聊天对话框

// 新消息轮询接口
export const pollingNewMsg = () => axios.post(pollingNewMsgUrl)
// 获取咨询师列表接口
export const getCounselorList = (params) => axios.post(getCounselorListUrl, params)
// 获取聊天内容
export const getChatContent = (params) => axios.post(getChatContentUrl, params)
// 获取聊天窗口好友信息
export const getChatContentInfo = (params) => axios.post(getChatContUserInfoUrl, params)
// 获取消息列表
export const getMessageFriendList = (params) => axios.post(getFriendsMessageListUrl, params)
// 获取好友列表
export const getFrinendsListInfo = (params) => axios.post(getFrinendsListUrl, params)
// 发送消息
export const sendMessageApi = (params) => axios.post(sendMessageUrl, params)
// 获取聊天内容框的好友托管状态及信息
export const getchatMessageFriendINfoApi = (params) => axios.post(getchatMessageFriendINfoUrl, params)
// 点击好友生成聊天对话框
export const crateWechatBoxApi = (params) => axios.post(crateWechatBoxUrl, params)
