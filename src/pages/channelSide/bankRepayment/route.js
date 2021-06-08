/*
 * 楼盘侧路由
* */
const PaymentIndex = () => import('./PaymentIndex')
const PaymentInformation = () => import('./PaymentInformation')
const WriteoffPayment = () => import('./WriteoffPayment')
const ShowVoucher = () => import('./ShowVoucher')
const FinancialAudit = () => import('./FinancialAudit')
// 修改银行流水
const UpdateBankFlow = () => import('./UpdateBankFlow');
// 回款统计详情
const PayBackDetail = () => import('./PayBackDetail');
const ContractClassifyConfigList = () => import('./ContractClassifyConfigList');
const EditConfig = () => import('./EditConfig');
export default {
    path: 'payment',
    name: 'paymentIndex',
    component: PaymentIndex,
    children: [
        {
            path: 'paymentInformation',
            name: 'paymentInformation',
            component: PaymentInformation,
            meta: {
                tit: '银行回款信息'
            }
        },
        {
            path: 'writeoffPayment',
            name: 'writeoffPayment',
            component: WriteoffPayment,
            meta: {
                tit: '核销回款页面'
            }
        },
        {
            path: 'financialAudit',
            name: 'financialAudit',
            component: FinancialAudit,
            meta: {
                tit: '财务审核页面'
            }
        },
        {
            path: 'showVoucher',
            name: 'showVoucher',
            component: ShowVoucher,
            meta: {
                tit: '显示凭证'
            }
        },
        {
            path: 'updateBankFlow',
            name: 'updateBankFlow',
            component: UpdateBankFlow,
            meta: {
                tit: '修改银行流水'
            }
        },
        {
            path: 'payBackDetail',
            name: 'payBackDetail',
            component: PayBackDetail,
            meta: {
                tit: '回款统计详情'
            }
        },
        {
            path: 'contractClassifyConfigList',
            name: 'contractClassifyConfigList',
            component: ContractClassifyConfigList,
            meta: {
                tit: '合同分类条件配置列表'
            }
        },
        {
            path: 'editConfig',
            name: 'editConfig',
            component: EditConfig,
            meta: {
                tit: '新增'
            }
        }
    ]
}
