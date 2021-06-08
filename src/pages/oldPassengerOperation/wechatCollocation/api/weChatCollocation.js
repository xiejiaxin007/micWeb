import {axios} from '@/assets/js/http/axios'

const NotCltAndDimissionCounselorUrl = '/backend-api/select2/select2/get-employee-for-wechat' // 未托管的离职咨询师
const weChatQrcodeUrl = '/backend-api/wechat-trusteeship/wechat-login' // 获取托管微信二维码
const employeeLoginInfoUrl = '/backend-api/wechat-trusteeship/login-again' // 获取托管中离职咨询师托管信息
const loginCheckUrl = '/backend-api/wechat-trusteeship/login-polling' // 轮询登陆状态接口
const weChatListUrl = '/backend-api/wechat-trusteeship/list' // 托管微信列表
const CollocationCountUrl = '/backend-api/wechat-trusteeship/config-num' // 配置微信托管数量
const handoverUrl = '/backend-api/wechat-trusteeship/handover' // 托管微信交接
const logoutUrl = '/backend-api/wechat-trusteeship/logout'

// 获取城市信息接口，参数type 城市类型（如需全国请传1）
export const getCity = (type) => axios.get(cityUrl, {params: {city_type: type}})

// 获取微信二维码 参数employeeId为咨询师id
export const getWechatQrcode = (employeeId, time) => axios.post(weChatQrcodeUrl, {employee_id: employeeId, time})

// 获取登陆状态 参数employeeId为咨询师id
export const getLoginStatus = (employeeId) => axios.post(loginCheckUrl, {employee_id: employeeId})

// 获取托管中离职咨询师托管信息 参数employeeId为咨询师id
export const employeeLoginInfo = (employeeId, wxId) => axios.post(employeeLoginInfoUrl, {employee_id: employeeId, wx_id: wxId})

// 获取未托管的离职咨询师 参数name为搜索咨询师姓名
export const getNotColloCounselor = (name) => axios.get(NotCltAndDimissionCounselorUrl, {params: {q: name}})

// 获取微信托管列表 参数options为一个对象集合 参考接口文档
export const getCollocationList = (options) => axios.post(weChatListUrl, options)

// 配置微信托管数量 参数count为托管数量
export const setCollocationCount = (count) => axios.post(CollocationCountUrl, {num: count})

// 交接托管微信 collocationId:托管id  employeeId:交接咨询师
export const handoverWechatById = (collocationId, employeeId) => axios.post(handoverUrl, {id: collocationId, employee_id: employeeId})

// 获取微信二维码 参数为对象options 咨询师id或者token (对于已登录的穿employee_id,对于未登录的穿token)
export const logoutWechat = (options) => axios.post(logoutUrl, options)
