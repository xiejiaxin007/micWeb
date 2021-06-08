// 投诉处理进度
const COMPLAIN_PROGRESS = [
    {
        id: 1,
        text: '未处理'
    },
    {
        id: 2,
        text: '已处理'
    }
]
// 举报途径
const COMPLAIN_CHANNELS = [
    {
        id: 1,
        text: '邮箱举报'
    },
    {
        id: 2,
        text: '电话举报'
    },
    {
        id: 3,
        text: '信涵举报'
    }
]
const COMPLAIN_CHANNELS_INCLUD_ONLINE = [
    {
        id: 1,
        text: '邮箱举报'
    },
    {
        id: 2,
        text: '电话举报'
    },
    {
        id: 3,
        text: '信涵举报'
    },
    {
        id: 4,
        text: '线上举报'
    }
]
const DataConfig = {
    COMPLAIN_PROGRESS: COMPLAIN_PROGRESS,
    COMPLAIN_CHANNELS: COMPLAIN_CHANNELS,
    COMPLAIN_CHANNELS_INCLUD_ONLINE:COMPLAIN_CHANNELS_INCLUD_ONLINE,
    // 获取相应config
    getConfig(dataKeys=[]) {
        let config = {};
        dataKeys.forEach((val)=>{
            config[val.toUpperCase()] = this[val.toUpperCase()]?this[val.toUpperCase()]:[]
        });
        return config;
    }
}
export {COMPLAIN_PROGRESS, COMPLAIN_CHANNELS, COMPLAIN_CHANNELS_INCLUD_ONLINE, DataConfig}