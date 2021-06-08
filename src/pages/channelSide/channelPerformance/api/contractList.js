/*
 * @author: hewei
 * @Date: 2021-05-11 11:15:08
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-24 15:59:49
 * @description: 合同列表接口文件
 */
import {
    axios
} from '@/assets/js/http/axios';

// 合同列表初始化接口
const contractListInitApi = '/backend-api/expand/ex-contract/init';

// 合同列表查询接口
const contractListApi = '/backend-api/expand/ex-contract/list';

// 修改合同跟进人接口
const editFollowEmployeeApi = '/backend-api/expand/ex-contract/edit-follow-employee';

// 申请转直签初始化接口
const applyTurnSignInitApi = '/backend-api/expand/ex-contract/apply-turn-direct-sign-init';

// 申请转直签接口
const applyTurnSignApi = '/backend-api/expand/ex-contract/apply-turn-direct-sign';






/**
 * @description: 获取合同列表页初始化信息
 */
const getContractInit = () => axios.get(contractListInitApi);

/**
 * @description: 获取合同列表信息
 * @param {string} params.city_id	城市ID
 * .....参考地址
 * http://ams.julive.com/#/home/project/inside/api/detail?groupID=765&apiID=4276&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E6%B8%A0%E9%81%93%E4%BE%A7%E6%8E%A5%E5%8F%A32.0&projectID=217
 */
const getContractList = (params) => axios.get(contractListApi, { params });

/**
 * @description: 修改合同跟进人信息
 * @param {string} options.employee_id	跟进人Id
 * @param {string} options.id	合同id
 */
const updateFollowEmployeeInfo = (options) => axios.post(editFollowEmployeeApi, options);

/**
 * @description: 获取申请转直签初始化
 * @param {string} params.id 合同ID
 */
const getApplyTurnSignInitInfo = (params) => axios.get(applyTurnSignInitApi, { params });

/**
 * @description: 申请转直签
 * @param {string} options.id	合同id
 * @param {string} options.direct_sign_type	直签类型
 * @param {Array} options.file_list	文件列表 
 * @param {string} options.apply_reason	申请理由
 */
const saveApplyTurnSign = (options) => axios.post(applyTurnSignApi, options);


export default {
    getContractInit,
    getContractList,
    updateFollowEmployeeInfo,
    getApplyTurnSignInitInfo,
    saveApplyTurnSign
}