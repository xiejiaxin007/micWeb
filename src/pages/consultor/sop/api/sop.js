/**
 * @description: sop相关接口
 * @author: wangxue
 * @date: 2020-06-11
 */
import { axios } from '@/assets/js/http/axios';

// 加分标签列表
const getIncreaseTagListApi = '/backend-api/bk-api-tag-manage/get-increase-tag-list';


/**
 * 加分标签列表
 * @param {Object} params 参数描述
 * @param {string} params.page 页码
 * @return {Object} 列表数据
 */
const getIncreaseTagList = (params) => axios.post(getIncreaseTagListApi, params);


const sop = {
    getIncreaseTagList
};
export default sop;
