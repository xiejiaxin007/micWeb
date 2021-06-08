/**
 * @Name: 评价cofig
 * @Description: 静态配置数据
 * @Author: zhengchao
 * @Date: 2019-12-03
*/
// 评价类型
const EVALUATE_TYPE = [
    {
        id: '2',
        text: '无意向评价'
    },
    {
        id: '1',
        text: '带看评价'
    },
    {
        id: '3',
        text: '签约服务评价'
    }
];
// 类型
const EVALUATE_SET_TYPE = [
    {
        id: '1',
        text: '标签'
    },
    {
        id: '2',
        text: '问题'
    }
];
// 答案数量
const EVALUATE_ANSWER_NUM = [
    {
        id: '2',
        text: '两项'
    },
    {
        id: '3',
        text: '三项'
    }
];
// 星级
const STAR_LEVEL = [
    {
        id: '0',
        text: '一星'
    },
    {
        id: '1',
        text: '二星'
    },
    {
        id: '3',
        text: '三星'
    },
    {
        id: '4',
        text: '四星'
    },
    {
        id: '5',
        text: '五星'
    }
];
// 是否展示
const SHOW_HIDDEN = [
    {
        id: '1',
        text: '显示'
    },
    {
        id: '2',
        text: '隐藏'
    }
];
// 带看类型
const SEE_TYPE = [

    {
        id: '3',
        text: '默认（首访加复访）'
    },
    {
        id: '1',
        text: '首访'
    },
    {
        id: '2',
        text: '复访'
    }
];
export {
    EVALUATE_TYPE,
    EVALUATE_SET_TYPE,
    STAR_LEVEL,
    SHOW_HIDDEN,
    EVALUATE_ANSWER_NUM,
    SEE_TYPE
};