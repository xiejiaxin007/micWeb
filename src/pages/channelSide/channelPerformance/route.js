/*
 * @author: hewei
 * @Date: 2021-05-10 16:27:51
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-14 17:14:26
 * @description: file content
 */
const Index = () => import('./Index');
const ContractList = () => import('./ContractList');
const ApproveDetail = () => import('./TurnSignExamineDetail');
const CooperateHistory = () => import('./CooperateHistoryList');
const CollectionHistory = () => import('./CollectionHistoryList');

export default {
    path: 'channelPerfor',
    name: 'ChannelPerfor',
    component: Index,
    children: [
        {
            path: 'contractList',
            name: 'ContractList',
            component: ContractList,
            meta: {
                tit: '合同列表页'
            }
        },
        {
            path: 'approveDetail',
            name: 'ApproveDetail',
            component: ApproveDetail,
            meta: {
                tit: '转直签审批详情页'
            }
        },
        {
            path: 'cooperateHistory',
            name: 'CooperateHistory',
            component: CooperateHistory,
            meta: {
                tit: '合作楼盘历史记录'
            }
        },
        {
            path: 'collectionHistory',
            name: 'CollectionHistory',
            component: CollectionHistory,
            meta: {
                tit: '成交单回款历史记录'
            }
        }
    ]
}
