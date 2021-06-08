import {axios} from '@/assets/js/http/axios'
// 获取城市群地铁线接口
const citySubWay = '/backend-api/bk-map/get-city-sub-way';

const multifunctionApi = '/backend-api/bk-map/perform-tasks' // 获取通用下拉信息、通勤搜索、删除公交站点、删除自定义户型、删除自定义户型

const getCityApi = '/backend-api/select2/select2/get-province-dropdown-list2' // 获取城市

// 获取单个楼盘的户型数据接口
const singleHouseApi = '/backend-api/bk-map/get-all-house-detail';

// 保存楼盘对比数据
const saveHouseContrast = '/backend-api/bk-map/add-contrast-house';

// 获取楼盘对比详情数据
const getHouseContrastInfoApi = '/backend-api/bk-map/get-contrast-detail';

// 楼盘对比-删除户型/删除楼盘
const deleteHouseApi = '/backend-api/bk-map/perform-tasks';

// 楼盘对比初始化
const initHouseConstrastInfoApi = '/backend-api/bk-map/house-contrast-detail';

// 获取楼盘下拉接口
const houseOptionsApi = '/backend-api/select2/select2/get-projects';

// 获取楼盘对比数量
const contrastCountApi = '/backend-api/bk-map/get-contrast-num';

const getNewCommuApi = '/backend-api/bk-map/get-commute-info' // 获取通勤地址时长、路径
// 同步微信
const uploadWxInfoApi = '/backend-api/bk-map/weixin-push-app-message';

// 新增微信联系人
const addWxApi = '/backend-api/bk-map/weixin-save';

// 立即发送短信
const sendMsgApi = '/backend-api/bk-map/save-share-sms';

// 文章分享接口
const articleShareApi = '/backend-api/bk-map/share-article';

// 获取咨询师微信联系人
const employeeContactApi = '/backend-api/bk-map/weixin-get-employee-contact';

// 文章内容初始化接口
const articleContentApi = '/backend-api/bk-map/init-article';

// 搜索楼盘接口
const searchHouseApi = '/backend-api/select2/select2/get-projects';

// 文章新增楼盘初始化信息
const initHouseApi = '/backend-api/bk-map/project-info';

// 城市群下拉
const cityGroupApi = '/backend-api/bk-map/get-all-city-group';

// 城市群楼盘下拉
const houseGroupApi = '/backend-api/select2/select2/get-city-group-project-list';
// 地图里面获取单个楼盘信息api
const getSingleHouseInfoApi = '/backend-api/bk-map/get-project-info';


/**
 * 地图里面获取单个楼盘信息
 * @param {Object} option 参数描述
 * @param {array} option.project_id 楼盘ID
 */
const getSingleHouseInfo = (option) => axios.post(getSingleHouseInfoApi, option)

/**
 * 获取城市群地铁线
 * @param {Object} option 参数描述
 * @param {array} option.city_id 城市ID
 * @return {Object} 多个下拉数组
 */
const getCitySubWay = (option) => axios.post(citySubWay, option)


/**
 * 获取通用下拉信息、通勤搜索、删除公交站点、删除自定义户型、删除自定义户型
 * @param {Object} option 参数描述
 * @param {string} option.type 后台用于区分接口功能的，在此处为3
 * @param {string} option.order_id 订单ID
 * @param {string} option.endLng 终点lng
 * @param {string} option.endLat 终点lat
 * @param {string} option.startLng 起点lng
 * @param {string} option.startLat 起点lat
 * @return {Object} 通勤路径所有点
 */
/**
 * 删除公交站点、删除自定义户型、删除自定义户型（依次type、内容ID）
 * @param {Object} option 参数描述
 * @param {string} option.type 后台用于区分接口功能的，在此处为11、10、9
 * @param {string} option.order_id 订单ID
 * @param {string} option.project_id 楼盘ID
 * @param {string} option.traffic_id（交通ID）、house_id（户型ID）、tag_id（标签ID）
 * @param {string=} option.share_id 分享ID（可选）
 * @return {Object} 成功消息
 */
/**
 * 获取通用下拉信息
 * @param {Object} option 参数描述
 * @param {string} option.type 后台用于区分接口功能的，在此处为19
 * @param {string} option.order_id 订单ID
 * @param {string} option.city_id 城市ID
 * @return {Object} 多个下拉数组
 */
const multiApi = (params) => axios.post(multifunctionApi, params)

/**
 * 获取城市信息
 * @param {string} type 为2，表示获取城市
 * @return {Object} 城市下拉数组
 */
const getCity = (type) => axios.get(getCityApi, {params: {type: type}})

/**
 * 获取单楼盘的户型数据信息
 * @param {string} order_id 订单id
 * @param {string} project_id 楼盘id
 * @return {Promise} 城市下拉数组
 */
const getHouseTypeInfo = (order_id, project_id) => axios.post(singleHouseApi, {order_id, project_id});



/**
 * 保存楼盘户型对比数据
 * @param {string} options.order_id 订单id
 * @param {string} options.project_id 楼盘id
 * @param {Array} options.select_data 选中的户型
 * @param {Array} options.project_id 新增加的户型
 * @return {Promise} 成功失败
 */
const setHouseConstrastInfo = (options) => axios.post(saveHouseContrast, options);

/**
 * 删除推荐户型
 * @param {string} options.type 类型
 * @param {string} options.house_id 户型id
 * @param {string} options.employee_id 用户id
 * @param {string} options.project_id 楼盘id
 * @param {Array} options.order_id 订单id
 * @param {Array} options.share_id 分享id  非必填项
 * @return {Promise} 成功失败
 */
const deleteRecommendHouse = (options) => axios.post(deleteHouseApi, options);

/**
 * 获取选择楼盘对比详情数据
 * @param {string} order_id 订单id
 * @return {Promise}
 */
const getHouseContrastInfo = (order_id) => axios.post(getHouseContrastInfoApi, {order_id});

/**
 * 获取楼盘下拉
 * @param {string} options.projectName 楼盘名称
 * @param {string} options.cityId 城市id
 * @param {string} options.order_id 订单id
 * @return {Promise}
 */
const getHouseOptions = (options) => axios.get(houseOptionsApi, {params: options});


/**
 * 获取楼盘对比数量
 * @param {string} order_id 订单id
 * @return {Promise}
 */
const getContrastCount = (order_id) => axios.post(contrastCountApi, {order_id});

/**
 * 同步微信联系人
 * @return {Promise}
 */
const uploadWxMsg = () => axios.post(uploadWxInfoApi);

/**
 * 获取通勤信息
 * @param {Object} option 参数描述
 * @param {String} option.project_id 楼盘ID
 * @param {String} option.commute_lat 目的地经纬度
 * @param {String} option.commute_lat 目的地经纬度
 * @param {Number} option.share_id 分享ID（非必填）
 * @param {Number} option.sort_id 排序ID（非必填）
 * @return {Promise} 符合条件的通勤地址信息
 */
const getCommuApi = (params) => axios.post(getNewCommuApi, params)

/**
 * 新增微信联系人
 * @param {string} order_id 订单id
 * @param {Array} wx_num 微信号数组
 * @param {String} source 写死来源，找房工具为7
 * @return {Promise}
 */
const addWxContact = (order_id, wx_num, source) => axios.post(addWxApi, {order_id, wx_num, source});

/**
 * 立即发送短信
 * @param {Object} option 参数描述
 * @param {String} option.order_id 订单ID
 * @param {String} option.share_id 分享
 * @param {String} option.user_mobile 要发送的手机号
 * @param {Number} option.share_type 分享类型[1单楼盘 2从楼盘 3文章]
 * @return {Promise}sendMsgApi
 */
const sendMsg = (option) => axios.post(sendMsgApi, option);

/**
 * 文章分享，返回小程序二维码
 * @param {Object} option 参数描述
 * @param {String} option.article_id 文章id
 * @param {String} option.order_id 订单ID
 * @param {String} option.category_id 分类id
 * @param {Number} option.share_type 分享类型1.预览2.分享
 * @return {Promise}
 */
const shareArticle = (option) => axios.post(articleShareApi, option);

/**
 * 获取咨询师微信联系人
 * @param {Object} option 参数描述
 * @param {String} option.exclude 数组，不需要包含在结果里的微信号
 * @param {String} option.order_id 订单id
 * @param {String} option.q 搜索关键字
 * @return {Promise}
 */
const getEmployeeContact = (option) => axios.post(employeeContactApi, option);

/**
 * 获取文章内容
 * @param {string} options.url 文章id
 * @return {Promise}
 */
const getArticleContent = (options) => axios.get(articleContentApi, {params: options});


/**
 * 获取楼盘列表 模糊搜索
 * @param {string} options.projectName  楼盘名
 * @param {string} options.cityId  城市id
 * @param {string} options.order_id  订单id
 * @return {Promise}
 */
const getHouseList = (options) => axios.get(searchHouseApi, {params: options});


/**
 * 文章新增楼盘初始化楼盘信息
 * @param {Object} option 参数描述
 * @param {String} option.exclude 数组，不需要包含在结果里的微信号
 * @param {String} option.order_id 订单id
 * @param {String} option.q 搜索关键字
 * @return {Promise}
 */
const getInitHouse = (option) => axios.post(initHouseApi, option);

/**
 * 获取城市群下拉数据
 * @return {Promise}
 */
const getCityGroupApi = () => axios.get(cityGroupApi);

/**
 * 获取城市群楼盘下拉
 * @param {Object} option 参数描述
 * @param {String} option.q 输入搜索的内容
 * @param {String} option.city_id 城市id
 * @param {String} option.for 固定值： frontend
 * @return {Promise}
 */
const getHouseGroupApi = (option) => axios.get(houseGroupApi, {params: option});

export default {
  multiApi: multiApi,
  getCity: getCity,
  getCommuApi: getCommuApi,
  uploadWxMsg: uploadWxMsg,
  sendMsg: sendMsg,
  addWxContact: addWxContact,
  getHouseTypeInfo: getHouseTypeInfo,
  setHouseConstrastInfo: setHouseConstrastInfo,
  deleteRecommendHouse: deleteRecommendHouse,
  getHouseContrastInfo: getHouseContrastInfo,
  getHouseOptions: getHouseOptions,
  getContrastCount: getContrastCount,
  shareArticle,
  getEmployeeContact,
  getCitySubWay,
  getArticleContent,
  getHouseList,
  getInitHouse,
  getCityGroupApi,
  getHouseGroupApi,
  getSingleHouseInfo
};
