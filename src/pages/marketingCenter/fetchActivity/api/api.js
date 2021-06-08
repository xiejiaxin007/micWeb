/*
 * @author: kangxue
 * @Date: 2020-09-03 19:32:49
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-09-11 18:36:56
 * @description: 提报接口管理
 */

import { axios } from '@/assets/js/http/axios';
// 获取提报列表
const getReportListApi = '/backend-api/submission/submission-manage/submission-list';
// 提报管理导入模板
const importReportApi = '/backend-api/submission/submission-manage/excel-template';
// 终止提报
const stopReportApi = '/backend-api/submission/submission-manage/stop-submission';
// 根据提报类型获取相信信息表单
const getFormByTypeApi = '/backend-api/submission/submission-manage/init-submission';
// 创建提报
const addSubmissionApi = '/backend-api/submission/submission-manage/create-submission';
// 活动列表查询api
const activityListApi = '/backend-api/submission/submission-manage/activity-list';
// 提报活动审核API
const auditActivityApi = '/backend-api/submission/submission-manage/activity-audit';
// 删除活动API
const deleteActivityApi = '/backend-api/submission/submission-manage/activity-delete';
// 修改活动分API
const updateScoreApi = '/backend-api/submission/submission-manage/activity-edit-score';
// 提报活动初始化API
const activityInitApi = '/backend-api/submission/submission-manage/activity-init';
// 创建活动API
const createActivityApi = '/backend-api/submission/submission-manage/activity-save';


/**
* 创建活动
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
* @param {string} option.submission_id  活动id
* @param {string} option.project_id	楼盘id
* @param {string} option.project_level  楼盘等级
* @param {string} option.is_julive	是否居理专属
* @param {string} option.promotion_type  优惠类型
* @param {string} option.house_resource	房源范围
* @param {string} option.house_resource_text  自定义房源范围
* @param {string} option.promotion_category	优惠方式
* @param {string} option.promotion_desc  优惠描述
* @param {string} option.unit	优惠单位
* @param {string} option.has_more_promotion  是否额外优惠
* @param {string} option.more_promotion  额外优惠
* @param {string} option.more_promotion_desc	额外优惠补充
* @param {string} option.start_time  活动开始时间
* @param {string} option.end_time	活动结束时间
* @param {Array}  option.special_house  特价房
* @param {string} option.special_house.id	特价房ID
* @param {string} option.special_house.room_num  特价房房号
* @param {string} option.special_house.area	特价房面积
* @param {string} option.special_house.total_price  特价房总价
* @param {string} option.special_house.special_price  优惠价格
*/

const createActivity = (params) => axios.post(createActivityApi, params);

/**
* 提报活动初始化
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
* @param {string} option.app_id		活动id
*/
const activityInit = (params) => axios.post(activityInitApi, params);

/**
* 修改活动分
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
* @param {string} option.app_id		活动id
*/
const updateScore = (params) => axios.post(updateScoreApi, params);
/**
* 删除活动
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
* @param {string} option.app_id		活动id
*/
const deleteActivity = (params) => axios.post(deleteActivityApi, params);
/**
* 活动列表查询
* @param {Object} option 参数描述
* @param {string} option.page	分页
* @param {string} option.submission_type	提报类型
* @param {string} option.submission_id	提报id
* @param {string} option.city_id	提报城市
* @param {string} option.promotion_type	优惠类型
* @param {string} option.promotion_status	优惠状态
* @param {string} option.creator	填写人
* @param {string} option.project_level	楼盘等级
* @param {string} option.project_id	楼盘id
* @param {string} option.start_time	楼盘活动时间
* @param {string} option.end_time	楼盘活动时间
* @param {string} option.audit_status	审核状态
* @param {string} option.is_julive	专属优惠
*/
const getActivityList = (params) => axios.post(activityListApi, params);
/**
* 提报活动审核
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
* @param {string} option.action	 pass:审核通过 reject:审核驳回
* @param {string} option.id		活动id
* @param {string} option.reason	驳回原因
*/
const auditActivity = (params) => axios.post(auditActivityApi, params);
/**
* 获取提报列表
* @param {Object} option 参数描述
* @param {string} option.page	分页
* @param {string} option.submission_type	提报类型（后端接口都需要的参数 有就传 没有后端会自己取值）
* @param {string} option.promotion_type	  优惠类型
* @param {string} option.start_time	提报开始时间
* @param {string} option.end_time	提报结束时间
* @param {Array} option.city_ids	提报城市
* @param {string} option.submission_status	提报状态
*/
const getReportList = (params) => axios.post(getReportListApi, params);
/**
* 提报管理导入模板
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
* @param {string} option.file_data	excel数据流
*/
const importReport = (params) => axios.post(importReportApi, params);
/**
* 终止提报
* @param {Object} option 参数描述
* @param {string} option.id	提报id
* @param {string} option.submission_type	提报类型
*/
const stopReport = (params) => axios.post(stopReportApi, params);
/**
* 根据提报类型获取相信信息表单
* @param {Object} option 参数描述
* @param {string} option.submission_type	提报类型
*/
const getFormByType = (params) => axios.post(getFormByTypeApi, params);
/**
* 创建提报
* @param {Object} option 参数描述
* @param {string} option.name	提报名称
* @param {string} option.desc	提报描述
* @param {string} option.type	提报类型
* @param {string} option.submission_citys	提报城市
* @param {string} option.start_time	提报开始时间
* @param {string} option.end_time	提报结束时间
* @param {string} option.manager	负责人
* @param {string} option.config_field	动态参数(初始化返回什么样就怎么样提交回去)
*/
const addSubmission = (params) => axios.post(addSubmissionApi, params);


export default {
    getReportList,
    importReport,
    stopReport,
    getFormByType,
    addSubmission,
    getActivityList,
    auditActivity,
    deleteActivity,
    updateScore,
    activityInit,
    createActivity
};
