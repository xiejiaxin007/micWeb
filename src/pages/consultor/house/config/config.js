/*
 * @Name: 找房工具数据配置页
 * @Author: wangshuaixue
 * @Date: 2019-12-10
 */
// 周边配置tab切换项
const AROUND_TAB_LIST = [
    {
        id: 0,
        name: '交通'
    },
    {
        id: 1,
        name: '商场'
    },
    {
        id: 2,
        name: '学校'
    },
    {
        id: 3,
        name: '医院'
    },
    {
        id: 4,
        name: '房价'
    }
];
// 多楼盘左侧步骤条
const MUCHSHARE_SWIPER = [
    {
        name: '1. 客户需求',
        isOk: false,
        isRequired: false
    },
    {
        name: '2. 楼盘价格',
        isOk: false,
        isRequired: true
    },
    {
        name: '3. 楼盘详细信息',
        isOk: false,
        isRequired: true
    },
    {
        name: '4. 通勤路线',
        isOk: true,
        isRequired: false
    },
    {
        name: '5. 周边配套',
        isOk: false,
        isRequired: true
    },
    {
        name: '6. 楼盘优劣势',
        isOk: false,
        isRequired: true
    },
    {
        name: '7. 楼盘图片',
        isOk: false,
        isRequired: false
    },
    {
        name: '8. 个人资料',
        isOk: false,
        isRequired: true
    }
]

export {
    AROUND_TAB_LIST,
    MUCHSHARE_SWIPER
};
