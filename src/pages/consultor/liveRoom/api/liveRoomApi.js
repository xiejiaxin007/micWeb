/*
 * @Name: 视频看房 api接口文件
 * @Description: 视频看房 api接口文件
 * @Author: xueshuai
 * @Date: 2020-02-16 14:14:29
 * @Editors: xueshuai
 */

import {
    axios
} from '@/assets/js/http/axios';
// 视频看房页面初始化api
const liveRoomInitApi = '/backend-api/live/init';
// 报错备注
const saveReamrkApi = '/backend-api/live/save-note';
// 上报进出房间
const checkUserApi = '/backend-api/live/check-user';
// 用户信息
const userInfoApi = '/backend-api/live/user-info';
// 判断是否为主持人
const judageMasterApi = '/backend-api/live/is-master';
// 邀请
const invitationApi = '/backend-api/live/invitation';
// 解散
const dissolveApi = '/backend-api/live/dissolve-room';
// 移除用户
const removerUserApi = '/backend-api/live/remove-user';
// 获取视频列表
const getVideoListApi = '/backend-api/live/project-video';





/**
 * @description: 视频看房页面初始化
 * @param {string} options.room_id 房间ID
 */
const liveRoomInit = (options) => axios.get(liveRoomInitApi, {
    params: options
});
/**
 * @description: 保存备注
 * @param {string} options.room_id 房间ID
 * @param {string} options.note 备注内容
 */
const saveReamrk = (options) => axios.post(saveReamrkApi, options);

/**
 * @description: 进出房间上报
 * @param {string} options.room_id 房间ID
 * @param {string} options.user_id 用户ID
 * @param {string} options.action 动作 1=>进入  2=>离开
 */
const checkUser = (options) => axios.post(checkUserApi, options);

/**
 * @description: 获取用户信息
 * @param {string} options.room_id 房间ID
 * @param {string} options.user_id 用户ID
 * @param {string} options.user_list 用户在线列表
 * @return: 
 */
const getUserInfo = (options) => axios.post(userInfoApi, options);

/**
 * @description: 判断是否为主持人
 * @param {string} options.room_id 房间ID
 * @param {string} options.user_id 用户ID
 * @return: 
 */
const judageMaster = (options) => axios.post(judageMasterApi, options);

/**
 * @description: 邀请
 * @param {string} options.room_id 房间ID
 * @param {string} options.user_id 用户ID
 * @return: 
 */
const invitation = (options) => axios.post(invitationApi, options);

/**
 * @description: 解散房间
 * @param {string} options.room_id 房间ID
 * @return: 
 */
const dissolve = (options) => axios.post(dissolveApi, options);

/**
 * @description: 移除用户
 * @param {string} options.room_id 房间ID
 * @param {string} options.user_id 用户ID
 * @return: 
 */
const removerUser = (options) => axios.post(removerUserApi, options);

/**
 * @description: 获取视频列表
 * @param {string} options.room_id 房间ID
 * @param {string} options.q 查询参数
 * @return: 
 */
const getVideoList = (options) => axios.post(getVideoListApi, options);

export default {
    liveRoomInit,
    saveReamrk,
    checkUser,
    getUserInfo,
    judageMaster,
    invitation,
    dissolve,
    removerUser,
    getVideoList
};
