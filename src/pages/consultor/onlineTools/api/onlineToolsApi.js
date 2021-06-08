import {
    axios
} from '@/assets/js/http/axios'

// 带看材料准备初始化
const prepareMaterialApi = '/backend-api/live/preparation-materials';
// 更新带看材料
const updateMaterialsApi = '/backend-api/live/update-materials';
// 带看前清单-主管审核列表
const auditListApi = '/backend-api/online-see-project/audit-list';
// 带看前清单-主管审核
const doAuditApi = '/backend-api/online-see-project/do-audit';
// 材料管理-下拉区域去重
const areaListApi = '/backend-api/online-see-project/get-only-district-list';
// 材料管理列表
const getMaterialListApi = '/backend-api/online-see-project/get-material-list';
// 保存材料已读状态
const saveReadStatusApi = '/backend-api/live/save-read-status';
// 材料管理删除
const delMaterialApi = '/backend-api/online-see-project/del-material';

/**
 * 带看材料准备初始化
 * @param {Object} params 参数描述
 * @param {int} params.see_project_id 带看id
 * @return {Object}
 */
const prepareMaterial = (params) => axios.post(prepareMaterialApi, params)
/**
 * 更新带看材料
 * @param {Object} params 参数描述
 * @param {string} params.materials_type 材料类型
 * @param {string} params.see_project_id 带看id
 * @param {array} params.list 附件
 * @param {string} params.list.object_id 附属id（区域id、楼盘id）
 * @param {string} params.list.url 文件半路径
 * @return {Object}
 */
const updateMaterials = (params) => axios.post(updateMaterialsApi, params)
/**
 *带看前清单-主管审核列表
 * @param {Object} params 参数描述
 * @param {string} params.page 当前页码
 * @param {string} params.page_size 每页显示数量
 * @param {string} params.see_employee_id 带看咨询师id
 * @param {string} params.see_employee_leader_id 主管id
 * @param {string} params.order_id 订单id
 * @param {string} params.see_project_id 带看id
 * @param {string} params.see_project_time_start 带看时间
 * @param {string} params.see_project_time_end 带看时间
 * @param {string} params.status 审核状态， 1-未审核 2-通过 3-未通过
 * @return {Object}
 */
const auditList = (params) => axios.post(auditListApi, params)
/**
 * 带看前清单-主管审核
 * @param {Object} params 参数描述
 * @param {string} params.id 列表记录id
 * @param {string} params.pass 是否通过 1-通过 2不通过
 * @return {Object}
 */
const doAudit = (params) => axios.post(doAuditApi, params)
/**
 * 材料管理-下拉区域去重
 * @param {Object} params 参数描述
 * @param {string} params.city_id cityId
 * @param {string} params.district_id 当前材料的区域ID
 * @return {Object}
 */
const areaList = (params) => axios.get(areaListApi, {params})
/**
 * 材料管理列表
 * @param {Object} params 参数描述
 * @param {string} params.city_id 城市ID
 * @param {string} params.title 材料名称
 * @param {string} params.object_type 类型（2.公司介绍、3.市场介绍、4.区域介绍、5.楼盘介绍）
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.district_id 区域ID
 * @param {string} params.update_datetime_start 更新开始时间
 * @param {string} params.update_datetime_end 更新结束时间
 * @param {string} params.creator 创建人ID
 * @return {Object}
 */
const getMaterialList = (params) => axios.post(getMaterialListApi, params)
/**
 * 保存材料已读状态
 * @param {Object} params 参数描述
 * @param {string} params.see_project_id 带看id
 * @param {string} params.materials_type 材料类型
 * @return {Object}
 */
const saveReadStatus = (params) => axios.post(saveReadStatusApi, params)
/**
 * 材料管理删除
 * @param {Object} params 参数描述
 * @param {string} params.id 材料ID
 * @return {Object}
 */
const delMaterial = (params) => axios.post(delMaterialApi, params)
export default {
    prepareMaterial,
    updateMaterials,
    auditList,
    doAudit,
    areaList,
    getMaterialList,
    saveReadStatus,
    delMaterial
};
