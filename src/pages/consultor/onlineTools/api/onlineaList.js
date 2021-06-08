import {
    axios
} from '@/assets/js/http/axios'

// 带看清单初始化
const initListApi = '/backend-api/online-see-project/init-list';
// 验证销售手机号
const verifyPhoneApi = '/backend-api/online-see-project/check-sys-number-talking';
// 邀约人、带看人
const employeeApi = '/backend-api/select2/select2/get-alloc-employee-list';
// 带看清单保存
const saveSeeListApi = '/backend-api/online-see-project/online-see-save';

/**
 * 带看材料准备初始化
 * @param {Object} params 参数描述
 * @param {int} params.see_id 带看id
 * @param {int} params.order_id 订单id
 * @return {Object}
 */
const getInitList = (params) => axios.post(initListApi, params)

/**
 * 校验销售手机号
 * @param {Object} params 参数描述
 * @param {int} params.see_id 带看id
 * @param {int} params.sales_phone 销售电话
 * @return {Object}
 */
const getVerifyPhone = (params) => axios.post(verifyPhoneApi, params)

/**
 * 获取邀约人、带看人
 * @param {Object} params 参数描述
 * @param {int} params.see_id 带看id
 * @param {int} params.sales_phone 销售电话
 * @return {Object}
 */
const getEmployee = (params) => axios.get(employeeApi, {params: params})

/**
 * 保存清单
 * @param {Object} params 保存列表信息
 * @return {Object}
 */
const saveSeeList = (params) => axios.post(saveSeeListApi, params)


export default {
    getInitList,
    getVerifyPhone,
    getEmployee,
    saveSeeList
};
