/*
 * @Name: 带看工具 api接口文件
 * @Description: 带看工具 api接口文件
 * @Author: xiejiaixn
 * @Date: 2020-02-26
 */

import {
    axios
} from '@/assets/js/http/axios';
// 初始化带看工具进度条api
const initStepBarApi = '/backend-api/live/init-tool-progress-bar';
// 初始化每个步骤内容api
const getStepInfoApi = '/backend-api/live/init-tool';
// 更新带看工具进度api
const updateLookProgressApi = '/backend-api/live/update-tool-progress';
// 更新楼盘信息api
const updateHouseListApi = '/backend-api/live/edit-tool-project';
// 更新用户需求api
const saveUserRequireApi = '/backend-api/live/save-live-order-require';
// 更新总结api
const updateSummaryApi = '/backend-api/live/save-summary';
// 短信分享api
const senMsgApi = '/backend-api/live/send-share-sms';
// 邀请销售api
const inviteConsulorApi = '/backend-api/live/see-project-invitation';


/**
 * @description: 初始化步骤条
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间ID
 */
const initStepBar = (options) => axios.post(initStepBarApi, options);

/**
 * @description: 初始化某个步骤的内容
 * @param {string} options.materials_type 步骤的类型
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间ID
 */
const getStepInfoByType = (options) => axios.post(getStepInfoApi, options);

/**
 * @description: 更新带看工具进度(点击完成按钮)
 * @param {string} options.materials_type 步骤类型
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间id
 * @param {string} options.project_id 当前楼盘ID（项目介绍时候传，非必填）
 * @param {string} options.status 步骤状态
 */
const updateLookProgress = (options) => axios.post(updateLookProgressApi, options);

/**
 * @description: 更新楼盘信息api
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间ID
 * @param {Array} options.project_arr 楼盘信息ID {
        "project_id":1
    }
 */
const updateHouseList = (options) => axios.post(updateHouseListApi, options);

/**
 * @description: 更新用户需求
 * @param {string} options.see_project_id 带看ID
 * @param {Object} options.order_require 用户需求
 * @param {string} options.room_id 房间ID
 */
const saveUserRequire = (options) => axios.post(saveUserRequireApi, options);

/**
 * @description: 短信分享
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间ID
 * @param {Array} options.summary_arr 总结数据
 */
const updateSummary = (options) => axios.post(updateSummaryApi, options);

/**
 * @description: 短信分享
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间ID
 * @param {Array} options.user_mobile 手机号
 */
const senMsg = (options) => axios.post(senMsgApi, options);

/**
 * @description: 邀请销售
 * @param {string} options.see_project_id 带看ID
 * @param {string} options.room_id 房间ID
 * @param {Array} options.project_id 楼盘ID
 */
const inviteConsulor = (options) => axios.post(inviteConsulorApi, options);

export default {
    initStepBar,
    getStepInfoByType,
    updateLookProgress,
    updateHouseList,
    saveUserRequire,
    updateSummary,
    senMsg,
    inviteConsulor
};
