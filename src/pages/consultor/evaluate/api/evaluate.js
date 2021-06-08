/**
 * @description: 评价配置相关api
 * @author: zhengchao
 * @date: 2019-12-03
 */
import { axios } from '@/assets/js/http/axios';
// 获取评价配置列表
const evaluateSettingListApi = '/backend-api/comment/index';
// 新建/修改评价标签配置
const evaluateSettingSubApi = '/backend-api/comment/update';
// 评价标签配置详情
const evaluateSettingDetailApi = '/backend-api/comment/detail';
// 标签下拉接口
const selectTagApi = '/backend-api/bk-api-tag-manage/tags-down-list';

/**
 * 获取评价配置列表
 *
 * @param {Object} params 参数描述
 * @param {string} params.type 标签类型：1带看评价2无意向评价
 * @param {string} params.name 名称
 * @param {string} params.grade_levels 所属星级
 * @param {string} params.is_show 是否默认显示：1显示2隐藏
 * @param {string} params.sort 排序
 * @param {string} params.config_type 配置类型 1标签 2问题
 * @param {string} params.page 页码
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2405&projectName=%E8%AF%84%E4%BB%B73.2&projectID=174
 * @return {Object} 列表数据
 */
const evaluateSettingList = (params) => axios.post(evaluateSettingListApi, params);
/**
 * 新增/修改评价标签配置
 *
 * @param {Object} params 参数描述
 * @param {Object} params 参数描述
 * @param {string} params.type 标签类型：1带看评价2无意向评价
 * @param {string} params.name 名称
 * @param {string} params.grade_levels 所属星级
 * @param {string} params.is_show 是否默认显示：1显示2隐藏
 * @param {string} params.sort 排序
 * @param {string} params.config_type 配置类型 1标签 2问题
 * @param {string} params.img_url 图片路径
 * @param {string} params.yes_text 正向文案
 * @param {string} params.no_text 负向文案
 * @param {string} params.yes_tag_config_id 正向标签配置id
 * @param {string} params.no_tag_config_id 负向标签配置id
 * @param {string} params.middle_text 中间文案
 * @param {string} params.middle_tag_config_id 中间标签配置id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2407&projectName=%E8%AF%84%E4%BB%B73.2&projectID=174
 * @return {Object}
 */
const evaluateSettingSub = (params) => axios.post(evaluateSettingSubApi, params);
/**
 * 评价标签配置详情
 * @param {Object} params 参数描述
 * @param {string} params.id 配置id
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2406&projectName=%E8%AF%84%E4%BB%B73.2&projectID=174
 * @return {Object}  配置详情
 */
const getEvaluateSettingDetail = (params) => axios.post(evaluateSettingDetailApi, params);
/**
 * 评价标签配置详情
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=1165&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E6%A0%87%E7%AD%BE%E4%BC%98%E5%8C%96&projectID=74
 * @return {Object} 下拉标签
 */
const selectTag = () => axios.post(selectTagApi);

const evaluate = {
    evaluateSettingList,
    evaluateSettingSub,
    getEvaluateSettingDetail,
    selectTag
};
export default evaluate;
