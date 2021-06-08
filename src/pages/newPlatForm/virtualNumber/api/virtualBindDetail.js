
import { axios } from '@/assets/js/http/axios';
// 绑定明细接口
const bindDetailViewApi = '/backend-api/virtual-phone/bind-view';

// 解绑接口
const unbindDatailApi = '/backend-api/virtual-phone/unbind';

/**
 * 获取绑定明细
 * @param {Object} params.city_id 城市id
 * @param {Object} params.type 虚拟号类型
 * @param {Object} params.user_type 业务方类型
 * @param {Object} params.phone A侧号码
 * @param {Object} params.a_phone A侧号码
 * @param {Object} params.b_phone B侧号码
 * @param {Object} params.page 当前页
 * @return {Promise} promise对象
 */
const getBindDetailData = params => axios.get(bindDetailViewApi, {params});

/**
 * 解绑接口
 * @param {Object} params.id 明细记录id
 * @return {Promise} promise对象
 */
const unbindVirtualDetail = params => axios.post(unbindDatailApi, params);

export default {
    getBindDetailData,
    unbindVirtualDetail
}
