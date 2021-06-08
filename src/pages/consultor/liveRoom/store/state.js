export default {
    // 直播间带看当前步骤对象
    currentStep: {
        // 步骤类型
        materials_type: '1',
        // 当前步骤在数组中的索引
        currentIndex: 0,
        status: '1'
    },
    // 选中楼盘数组
    lookHouseList: [],
    // 屏幕分享状态
    screenSharing: false,
    // 订单ID
    orderId: '',
    // 所属咨询师和咨询师对象
    personObj: {},
    // 草稿内容
    draftInfo: {
        // 流程草稿
        processDetail: [],
        // 客户需求
        require: {},
        // 总结
        summary: []
    },
    // 直播间用户列表
    roomList: [],
    // 小程序二维码
    miniProgramQrcode: ''
}