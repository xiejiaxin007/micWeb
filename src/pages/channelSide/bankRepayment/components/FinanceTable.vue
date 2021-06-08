<!--
  * @file 银行回款信息页面
  * @author --贺伟
  * @updateTime 2019.10.23
 -->
<template>
    <div class="finance">
        <el-table
            :data="financeData.data"
            border
            style="width:100%"
        >
            <el-table-column
                :resizable="false"
                prop="show_number"
                width="100px"
                label="核销编号"
                align="center"
            ></el-table-column>
            <el-table-column
                :resizable="false"
                prop="city_name"
                width="60px"
                label="城市"
                align="center"
            ></el-table-column>
            <el-table-column
                :resizable="false"
                prop="deal_id"
                label="成交ID"
                align="center"
            ></el-table-column>
            <el-table-column
                :resizable="false"
                label="开票主体"
                align="center"
            >
                <template slot-scope="scope">
                    <ul class="define">
                        <li
                            v-for="(item, index) in scope.row.company"
                            :key="index"
                        >{{ item }}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column
                :resizable="false"
                label="开票金额"
                align="center"
            >
                <template slot-scope="scope">
                    <ul class="define">
                        <li
                            v-for="(item, index) in scope.row.money"
                            :key="index"
                        >{{ item | currency }}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="pre_paid_content"
                label="合同预测阶段"
                width="250px"
                align="center"
            ></el-table-column>
            <el-table-column
                :resizable="false"
                label="合同预测金额"
                width="250px"
                align="center"
            >
                <template slot-scope="scope">{{ scope.row.pre_paid_money | currency }}</template>
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="actual_datetime"
                label=" 实际回款日期"
                align="center"
            ></el-table-column>
            <el-table-column
                :resizable="false"
                label="实际回款金额"
                align="center"
            >
                <template slot-scope="scope">{{ scope.row.actual_money | currency }}</template>
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="verify_status_text"
                label="财务审核状态"
                align="center"
            ></el-table-column>
            <el-table-column
                :resizable="false"
                label="操作"
                width="130"
                align="center"
            >
                <template slot-scope="scope">
                    <el-button
                        v-show="!scope.row.checkPass"
                        :disabled="scope.row.passDisable"
                        type="primary"
                        size="mini"
                        @click="handlePass('1', scope.row)"
                    >通过</el-button>
                    <el-button
                        v-show="!scope.row.checkReject"
                        :disabled="scope.row.rejectDisable"
                        size="mini"
                        @click="handleReject('1', scope.$index)"
                        type="danger"
                    >驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="btns-w">
            <el-button
                v-show="financeData.showFile"
                type="primary"
                size="mini"
                @click="seeFile"
            >查看附件</el-button>
            <el-button
                type="primary"
                size="mini"
                @click="seeProof"
            >显示凭证</el-button>
            <el-button
                :disabled="allPass"
                size="mini"
                type="success"
                @click="handlePass('2')"
            >全部通过</el-button>
            <el-button
                :disabled="allReject"
                size="mini"
                type="danger"
                @click="handleReject('2')"
            >全部驳回</el-button>
        </div>
        <!--驳回原因弹窗-->
        <reject-dialog
            :dialog-visible.sync="refuseDialog"
            :refuse-title="refuseTitle"
            :can-close="closeModal"
            @handleConfirm="submitRefuse"
        />
    </div>
</template>

<script>
    import RejectDialog from './RejectDialog';
    import apiObj from '@/api/bankRepaymentApi/writeOffPayment';
    export default {
        name: 'FinanceTable',
        components: {
            RejectDialog
        },
        data() {
            return {
                flowId: '',
                allPass: false,
                allReject: false,
                refuseDialog: false, // 驳回弹窗
                // refuseReason: '', // 驳回原因
                refuseTitle: '', // 驳回标题
                refuseType: '', // 单个还是批量驳回
                index: '', // 单个数据索引
                closeModal: true, // 是否可关闭弹窗
                canAllPass: true, // 是否可以全部通过
                callAllReject: true // 是否可以全部驳回
            };
        },
        model: {
            prop: 'financeData',
            event: 'input'
        },
        props: {
            financeData: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            batchIds: {
                type: String,
                default: ''
            }
        },
        methods: {
            handlePass(type, para) {
                // type 1 单个通过  2 批量
                let count = 0;
                let compareCount = 0;
                this.allPass = true;
                this.allReject = true;
                if (type === '1') {
                    let data = [
                        {
                            business_type: para.business_type,
                            id: para.business_id,
                            deal_id: para.deal_id,
                            verify_status: para.verify_status
                        }
                    ];
                    let params = {
                        id: this.flowId,
                        list: data
                    };
                    para.passDisable = true;
                    para.rejectDisable = true;
                    count++;
                    // 判断是等待审核还是释放审批状态
                    this.axios
                        .post('/backend-api/expand/ex-bank-flow/finance-pass', params)
                        .then(res => {
                            compareCount++;
                            if (count === compareCount) {
                                // 单条点击都有返回值的时候判断全部是否可点击
                                this.allPass = false;
                                this.allReject = false;
                            }
                            para.passDisable = false;
                            para.rejectDisable = false;
                            if (res.data.code === 0) {
                                this.$set(para, 'checkPass', true);
                                if (para.verify_status.toString() === '1') {
                                    this.$set(para, 'verify_status', '2');
                                    this.$set(para, 'verify_status_text', '审核通过');
                                } else if (para.verify_status.toString() === '6') {
                                    this.$set(para, 'verify_status', '5');
                                    this.$set(para, 'verify_status_text', '释放通过');
                                }
                                // 发送事件更流水
                                this.$emit('check-success');
                            } else {
                                alert(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (type === '2') {
                    this.handleMultiOpt();
                    if (!this.canAllPass) {
                        // 提示不能全部操作
                        this.$message({
                            message: '当前无待审核的核销记录',
                            duration: 2000,
                            type: 'warning',
                            onClose: () => {
                                this.allPass = false;
                                this.allReject = false;
                            }
                        });
                    } else {
                        let dataArr = [];
                        // 全部通过，不能操作已经驳回的数据和单个已经通过的数据，全部驳回可以操作已经通过的数据
                        this.financeData.data.forEach(item => {
                            if (item.verify_status.toString() === '1' || item.verify_status.toString() === '6') {
                                item.passDisable = true;
                                item.rejectDisable = true;
                                let obj = {
                                    business_type: item.business_type,
                                    id: item.business_id,
                                    deal_id: item.deal_id,
                                    verify_status: item.verify_status
                                };
                                dataArr.push(obj);
                            }
                        });
                        let params = {
                            id: this.flowId,
                            list: dataArr
                        };
                        this.axios
                            .post('/backend-api/expand/ex-bank-flow/finance-pass', params)
                            .then(res => {
                                this.allPass = false;
                                this.allReject = false;
                                this.financeData.data.forEach(item => {
                                    if (item.verify_status.toString() === '1' || item.verify_status.toString() === '6') {
                                        item.passDisable = false;
                                        item.rejectDisable = false;
                                    }
                                });
                                if (res.data.code === 0) {
                                    this.financeData.data.forEach(item => {
                                        if (item.verify_status.toString() === '1') {
                                            this.$set(item, 'checkPass', true);
                                            this.$set(item, 'verify_status', '2');
                                            this.$set(item, 'verify_status_text', '审核通过');
                                        } else if (item.verify_status.toString() === '6') {
                                            this.$set(item, 'checkPass', true);
                                            this.$set(item, 'verify_status', '5');
                                            this.$set(item, 'verify_status_text', '释放通过');
                                        }
                                    });
                                    // 发送事件更流水
                                    this.$emit('check-success');
                                } else {
                                    alert(res.data.msg);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }
            },
            /**
             * 组装驳回弹窗的文字内容
             * @param {Object} options 单条数据对象
             * @return {String} 最终生成的文本内容
             */
            createdRejectTitle(options) {
                if (options.business_type.toString() === '2') {
                    return `您确定要对成交单ID：${options.deal_id}的
                        核销记录（核销ID：${options.show_number}；实际回款金额：${options.actual_money}元） 操作释放金额吗？
                        若释放金额，请您填写释放原因。`;
                } else {
                    return options.num === ''
                        ? `您确定要对成交单ID：${options.deal_id}的
                            核销记录（核销ID：${options.show_number}；实际回款金额：${options.actual_money}元） 操作审核驳回吗？
                            若想驳回申请，请您填写驳回理由。`
                        : `您确定要对成交单ID：${options.deal_id}的第${options.num}笔
                            合同预测的核销记录（核销ID：${options.show_number}；实际回款金额：${options.actual_money}元） 操作审核驳回吗？
                            若想驳回申请，请您填写驳回理由。`;
                }
            },
            handleReject(type, index) {
                // type 1 单个驳回  2 批量
                // this.refuseReason = '';
                this.refuseType = type;
                this.index = index;
                if (type === '1') {
                    this.refuseDialog = true;
                    let para = this.financeData.data[index];
                    this.refuseTitle = this.createdRejectTitle(para);
                } else if (type === '2') {
                    this.handleMultiOpt();
                    if (!this.callAllReject) {
                        this.refuseDialog = false;
                        this.allReject = true;
                        this.allPass = true;
                        // 提示不能全部驳回操作
                        this.$message({
                            message: '当前无可驳回的核销记录',
                            duration: 2000,
                            type: 'warning',
                            onClose: () => {
                                this.allReject = false;
                                this.allPass = false;
                            }
                        });
                    } else {
                        this.refuseDialog = true;
                        this.refuseTitle =
                            '您确定要将当前页面页面审核状态为‘等待审核’、‘审核通过’、’释放审核’、’释放审核通过’的申请全部操作驳回吗？' +
                            '如果想驳回申请，请填写驳回理由！';
                    }
                }
            },
            seeProof() {
                let routeData = this.$router.resolve({
                    path: '/payment/showVoucher',
                    query: {
                        flowId: this.flowId,
                        batchId: this.batchIds
                    }
                });
                window.open(routeData.href, '_blank');
            },
            seeFile() {
                this.$emit('see-file');
            },
            /**
             * 单个驳回
             * @param {Object} updateObj 需要更新数据的所在对象
             * @param {Object} options 驳回所要提交的服务端的参数对象
             * @return {Object<Promise>} 成功失败的promise
             */
            async singleReject(updateObj, options) {
                try {
                    const { data: {code, msg} } = await apiObj.updateRejectData(options);
                    // 置为可关闭
                    this.closeModal = true;
                    if (code === 0) {
                        this.$set(updateObj, 'checkPass', true);
                        this.$set(updateObj, 'checkReject', true);
                        if (updateObj.verify_status.toString() === '1') {
                            this.$set(updateObj, 'verify_status', '4');
                            this.$set(updateObj, 'verify_status_text', '审核驳回');
                        } else if (updateObj.verify_status.toString() === '6') {
                            this.$set(updateObj, 'verify_status', '7');
                            this.$set(updateObj, 'verify_status_text', '释放驳回');
                        }
                        // 关闭弹窗
                        this.refuseDialog = false;
                        // 发送事件更流水
                        this.$emit('check-success');
                        return Promise.resolve(true);
                    } else {
                        this.$message(msg);
                        return Promise.reject(msg);
                    }
                } catch (error) {
                    console.log(error);
                    return Promise.reject(error);
                }
            },
            /**
             * 点击确定按钮提交驳回
             * @param {String} reason 驳回原因
             */
            submitRefuse(reason) {
                this.closeModal = false;
                // 单个驳回
                if (this.refuseType === '1') {
                    let obj = this.financeData.data[this.index];
                    let data = [
                        {
                            business_type: obj.business_type,
                            id: obj.business_id,
                            deal_id: obj.deal_id,
                            verify_status: obj.verify_status
                        }
                    ];
                    let params = {
                        id: this.flowId,
                        list: data,
                        reason
                    };
                    this.singleReject(obj, params);
                } else if (this.refuseType === '2') {
                    let dataArr = [];
                    // 全部驳回不包含单条已经驳回的数据
                    this.financeData.data.forEach(item => {
                        if (item.verify_status.toString() !== '4' && item.verify_status.toString() !== '7') {
                            let obj = {
                                business_type: item.business_type,
                                id: item.business_id,
                                deal_id: item.deal_id,
                                verify_status: item.verify_status
                            };
                            dataArr.push(obj);
                        }
                    });
                    let params = {
                        id: this.flowId,
                        list: dataArr,
                        reason
                    };
                    // 如果list无数据则不进行请求
                    if (params.list.length === 0) {
                        return;
                    }
                    this.axios
                        .post('/backend-api/expand/ex-bank-flow/finance-reject', params)
                        .then(res => {
                            this.closeModal = true;
                            if (res.data.code === 0) {
                                this.financeData.data.forEach(item => {
                                    if (item.verify_status.toString() === '1' || item.verify_status.toString() === '2') {
                                        this.$set(item, 'checkPass', true);
                                        this.$set(item, 'checkReject', true);
                                        this.$set(item, 'verify_status', '4');
                                        this.$set(item, 'verify_status_text', '审核驳回');
                                    } else if (item.verify_status.toString() === '6' || item.verify_status.toString() === '5') {
                                        this.$set(item, 'checkPass', true);
                                        this.$set(item, 'checkReject', true);
                                        this.$set(item, 'verify_status', '7');
                                        this.$set(item, 'verify_status_text', '释放驳回');
                                    }
                                });
                                // 关闭驳回弹窗
                                this.refuseDialog = false;
                                // 发送事件更流水
                                this.$emit('check-success');
                            } else {
                                alert(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            handleMultiOpt() {
                let waitArr = [];
                let waitPassArr = [];
                let releaseArr = [];
                let releasePassArr = [];
                this.financeData.data.forEach(item => {
                    if (item.verify_status.toString() === '1') {
                        // 等待审核的数据
                        waitArr.push(item);
                    } else if (item.verify_status.toString() === '6') {
                        // 释放审核数据
                        releaseArr.push(item);
                    } else if (item.verify_status.toString() === '2') {
                        // 审核通过
                        waitPassArr.push(item);
                    } else if (item.verify_status.toString() === '5') {
                        // 释放通过
                        releasePassArr.push(item);
                    }
                });
                if (waitArr.length === 0 && releaseArr.length === 0) {
                    // 全部通过不能操作
                    this.canAllPass = false;
                } else {
                    // 可以操作全部通过
                    this.canAllPass = true;
                }
                if (waitArr.length || releaseArr.length || waitPassArr.length || releasePassArr.length) {
                    // 全部驳回可以操作
                    this.callAllReject = true;
                } else {
                    this.callAllReject = false;
                }
            }
        },
        created() {
            this.flowId = this.$route.query.flowId;
        }
    };
</script>

<style lang="less" scoped>
.finance {
    /deep/ .el-table .cell,
    .el-table th div {
        padding: 0;
    }
    /deep/ .el-table td {
        padding: 8px 0;
    }
    .define {
        li {
            border-bottom: 1px solid #ebeef5;
            line-height: 30px;
        }
        li:last-child {
            border-bottom: 0 none;
        }
    }
    .btns-w {
        margin-top: 20px;
        text-align: right;
        margin-bottom: 20px;
    }
    .line {
        position: relative;
        padding-left: 14px;
        margin-bottom: 10px;
    }
    .line:before {
        position: absolute;
        left: 0;
        top: 10px;
        content: '';
        width: 6px;
        height: 24px;
        background-color: steelblue;
    }
}
</style>
