/*
 * @author: hewei
 * @Date: 2020-09-21 17:00:56
 * @LastEditors: hewei
 * @LastEditTime: 2020-09-21 18:48:28
 * @description: 新建人员编辑api
 */

  
import { axios } from '@/assets/js/http/axios';

// 新增员工接口
const creatEmployeeApi = '/backend-api/org/employee/create';

// 员工基本信息接口
const employeeBaseInfoApi = '/backend-api/org/employee/info';


/**
 * 获取公司上户目标列表数据
 * @param {String} params.org_id 公司id
 * @param {String} params.mobile 月份
 * @param {Array} params.city_id 城市id数组
 * @param {Number} params.depart_id 部门ID
 * @param {Array} params.post_id 岗位ID
 * @return {Promise} promise对象
 */
const creatEmployee = params => axios.post(creatEmployeeApi, params);

/**
 * 获取公司上户目标列表数据
 * @param {Array} params.id 员工id
 * @return {Promise} promise对象
 */
const getEmployeeBaseInfo = params => axios.get(employeeBaseInfoApi, {params});


export default {
    creatEmployee,
    getEmployeeBaseInfo
}