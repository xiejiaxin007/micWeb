/**
 * @description: 上户排班相关api
 * @author: wangxue
 * @date: 2020-04-29
 */
import { axios } from '@/assets/js/http/axios';

// 排班规则初始化
const initWorkScheduleApi = '/backend-api/employee_order/yw-employee-workday/init-work-schedule';
// 代班咨询师列表
const getCoverWorkListApi = '/backend-api/employee_order/yw-employee-workday/cover-work-list';
// 排班列表
const getWorkListApi = '/backend-api/employee_order/yw-employee-workday/list';
// 出勤休息保存接口
const changeWorkRestApi = '/backend-api/employee_order/yw-employee-workday/edit-work-status';
// 休息弹窗验证接口
const checkWorkRestApi = '/backend-api/employee_order/yw-employee-workday/edit-work-popup';
// 排班规则编辑
const editWorkScheduleApi = '/backend-api/employee_order/yw-employee-workday/edit-work-schedule';

/**
 * 排班规则初始化
 * @param {Object} params 参数描述
 * @param {string} params.city_id 城市id
 * @return {Object} 数据
 */
const initWorkSchedule = (params) => axios.post(initWorkScheduleApi, params);
/**
 * 代班咨询师列表
 * @param {Object} params 参数描述
 * @param {string} params.week_day 星期几 英文
 * @param {string} params.city_id   城市id
 * @param {string} params.week 星期时间
 * @return {Object} 数据
 */
const getCoverWorkList = (params) => axios.post(getCoverWorkListApi, params);
/**
 * 获取排班管理列表
 * @param {Object} params 参数描述
 * @param {string} params.page   页码
 * @param {string} params.week   周筛选值
 * @param {string} params.city_id   城市id
 * @param {string} params.employee_id 咨询师
 * @param {string} params.manager_id 主管
 * @param {string} params.employee_grade	咨询师等级
 * @param {string} params.monday   周一
 * @param {string} params.tuesday   周二
 * @param {string} params.wednesday 周三
 * @param {string} params.thursday  周四
 * @param {string} params.friday    周五
 * @param {string} params.saturday  周六
 * @param {string} params.sunday   周日
 * @param {string} params.sort	降序-desc 升序-asc
 * @return {Object} 数据
 */
const getWorkList = (params) => axios.post(getWorkListApi, params);
/**
 * 获取排班管理列表
 * @param {Object} params 参数描述
 * @param {string} params.id   排班id
 * @param {string} params.work_status   状态1.出勤 2.休息
 * @param {string} params.work_day   周几，英文返回
 * @param {string} params.other_employee_id 代班咨询师
 * @return {Object} 数据
 */
const changeWorkRest = (params) => axios.post(changeWorkRestApi, params);
/**
 * 休息弹窗验证接口
 * @param {Object} params 参数描述
 * @param {string} params.id   排班id
 * @param {string} params.work_status   状态1.出勤 2.休息
 * @param {string} params.work_day   周几，英文返回
 * @return {Object} 数据
 */
const checkWorkRest = (params) => axios.post(checkWorkRestApi, params);

/**
 * 排班规则编辑
 * @param {Object} params 参数描述
 * @param {string} params.city_id 城市id
 * @param {string} params.explosive_value 爆单值
 * @param {string} params.monday_plan_incostomer 周一上户量
 * @param {string} params.tuesday_plan_incostomer 周二上户量
 * @param {string} params.wednesday_plan_incostomer 周三上户量
 * @param {string} params.thursday_plan_incostomer 周四上户量
 * @param {string} params.friday_plan_incostomer 周五上户量
 * @param {string} params.saturday_plan_incostomer 周六上户量
 * @param {string} params.sunday_plan_incostomer 周日上户量
 * @return {Object} 数据
 */
const editWorkSchedule = (params) => axios.post(editWorkScheduleApi, params);

const workRestApi = {
    initWorkSchedule,
    getCoverWorkList,
    getWorkList,
    changeWorkRest,
    checkWorkRest,
    editWorkSchedule
};
export default workRestApi;
