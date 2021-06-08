/**
 * @description: 服务确认单相关api
 * @author: wangshuaixue
 * @date: 2019-10-18
 */
import {axios} from '@/assets/js/http/axios';

// 服务单未绑定确认单列表
const unBindList = '/backend-api/service-confirm/un-bind-list';
// 服务单已绑定确认单列表
const bindList = '/backend-api/service-confirm/bind-list';
// 服务单已绑定确认单列表
const videoRelation = '/backend-api/service-confirm/video-relation';
// 新增服务单签名
const confirmSign = '/backend-api/service-confirm/confirm-create';


/**
 * 获取未绑定确认单列表
 *
 * @param {string} params 参数描述 当前页数
 * @return {Object} 未绑定确认单列表数据
 */
const getUnBindList = (params) => axios.post(unBindList, params);


/**
 * 获取已绑定确认单列表
 *
 * @param {string} params 参数描述 当前页数
 * @return {Object} 已绑定确认单列表数据
 */
const getBindList = (params) => axios.post(bindList, params);


/**
 * 添加确认单录音
 *
 * @param {object} params 参数描述
 * @param {string} params.url 参数描述 录音地址
 * @param {string} params.confirm_id 参数描述 确认单id
 * @return promise
 */
const setVideoRelation = (params) => axios.post(videoRelation, params);



/**
 * 添加确认单签名
 *
 * @param {object} params 参数描述
 * @param {string} params.url 参数描述 	签字图片地址
 * @return promise
 */
const setConfirmSign = (params) => axios.post(confirmSign, params);


const serviceVoucher = {
    getUnBindList,
    getBindList,
    setVideoRelation,
    setConfirmSign
};
export default serviceVoucher;
