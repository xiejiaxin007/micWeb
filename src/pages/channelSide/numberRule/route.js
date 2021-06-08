/*
 * @Name: 智能报备2.0——报备序号规则
 * @Description: 智能报备2.0——报备序号规则
 * @Author: kangxue
 * @Date: 2020-4-17
 */

const NumberRuleIndex = () => import('./NumberRuleIndex');
const NumberRuleList = () => import('./NumberRuleList');
const NumberRuleInfo = () => import('./NumberRuleInfo');
const EditNumberRule = () => import('./EditNumberRule');
export default {
    path: '/numberRule',
    name: 'NumberRuleIndex',
    component: NumberRuleIndex,
    children: [
        {
            path: 'numberRuleList',
            name: 'NumberRuleList',
            component: NumberRuleList,
            meta: {
                tit: '报备序号规则列表'
            }
        },
        {
            path: 'numberRuleInfo',
            name: 'NumberRuleInfo',
            component: NumberRuleInfo,
            meta: {
                tit: '报备序号规则详情'
            }
        },
        {
            path: 'editNumberRule',
            name: 'EditNumberRule',
            component: EditNumberRule,
            meta: {
                tit: '编辑报备序号规则'
            }
        }
    ]
}
