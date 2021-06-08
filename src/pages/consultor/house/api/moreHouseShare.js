import {
    axios
} from '@/assets/js/http/axios'

// 删除周边配套api
const assort = '/backend-api/bk-map/perform-tasks';


/**
 * 删除周边配套数据路线
 * @param {Object} option 参数描述
 * @param {int} option.type 接口类型
 * @param {int} option.id	配套id
 * @param {int} option.employee_id	咨询师ID
 * @param {int} option.project_id	楼盘ID
 * @param {int} option.order_id    订单ID
 * @return {Object} 多个下拉数组
 */
const delAroundAssort = (option) => axios.post(assort, option)


export default {
    delAroundAssort
};
