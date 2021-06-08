<!--
  * @file 银行回款信息页面
  * @author --贺伟
  * @updateTime 2019.10.23
 -->
<template>
    <div class="dialog-box">
        <el-dialog
            class="top-box"
            width="850px"
            :visible.sync="isShow"
            @close="closeDia"
            @closed="flag = true"
        >
            <h2
                slot="title"
                class="line"
            >{{titleMsg}}</h2>
            <div class="dialog_body">
                <div class="list">
                    <div
                        class="item"
                        v-for="(item, index) in topTable"
                        :key="index"
                    >
                        <div class="sort">
                            {{index + 1}}
                        </div>
                        <div
                            class="remove"
                            v-show="editTag !== 'edit' && editTag !== 'editHistory'"
                            @click="removeTop(index)"
                        >
                            移除该项
                        </div>
                        <div class="content">
                            <ul class="s-query">
                                <li class="w-auto">
                                    <div class="th">成交单ID：</div>
                                    <div class="td">{{item.deal_id}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">客户名称：</div>
                                    <div class="td">{{item.username}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">楼盘名称：</div>
                                    <div class="td">{{item.project_name}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">城市：</div>
                                    <div class="td">{{item.city_name}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">合同预测金额：</div>
                                    <div class="td">{{item.pre_paid_money}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">已核销金额：</div>
                                    <div class="td">{{item.verified_money}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">剩余回款金额：</div>
                                    <div class="td">{{item.unverified_money}}</div>
                                </li>
                                <li class="all-width">
                                    <div class="th">合同预测阶段：</div>
                                    <div class="td">{{item.content}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th">实际回款日期：</div>
                                    <div class="td">{{item.arrival_time}}</div>
                                </li>
                                <li class="w-auto">
                                    <div class="th required">实际回款金额：</div>
                                    <div class="td">
                                        <el-input
                                            v-model="item.iptVal"
                                            :disabled="item.business_type.toString() === '2'"
                                            @input="inputMoney(item.iptVal, index)"
                                            @blur="verify(item.iptVal, index)"
                                            placeholder="请输入回款金额"
                                        ></el-input>
                                        <p
                                            class="error-tip"
                                            v-show="item.showTip"
                                        >实际回款金额不能为0</p>
                                        <p
                                            class="error-tip"
                                            v-show="item.rangeTip"
                                        >您输入的金额已经大于回款金额了，请核实</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="btn-area"
                slot="footer"
            >
                <button
                    class="btn cancel"
                    @click="isShow = false"
                >取消</button>
                <button
                    class="btn confirm"
                    @click="generateTable"
                >确定</button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'TopDialog',
        data() {
            return {
                flowId: '',
                isShow: false,
                isCanSub: 'yes', // 是否确定提交
                generateData: [], // 传回父元素的数据
                flag: true // 防止重复提交
            };
        },
        props: {
            titleMsg: {
                // 标题
                type: String,
                default: ''
            },
            showTopDialog: {
                // 是否展示弹窗
                type: Boolean,
                default: false
            },
            topTable: {
                // 数据
                type: Array,
                default: function() {
                    return [];
                }
            },
            editTag: {
                type: String,
                default: ''
            }
        },
        methods: {
            removeTop(index) {
                this.$emit('delete-top', index);
            },
            closeDia() {
                this.isCanSub = 'yes';
                this.$emit('close-dia', false);
            },
            // 正则金额
            regularAmount(para) {
                let str = para.replace(/[^\d.]/g, '');
                str = str.replace(/\.{2,}/g, '');
                str = str
                    .replace('.', '$#$')
                    .replace(/\./g, '')
                    .replace('$#$', '.');
                return str.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            },
            inputMoney(para, index) {
                this.topTable[index].iptVal = this.regularAmount(para);
            },
            generateTable() {
                this.isCanSub = 'yes';
                // 校验非空输入框
                for (let i = 0; i < this.topTable.length; i++) {
                    if (this.topTable[i].iptVal === '') {
                        this.isCanSub = 'no';
                        this.$message({
                            message: '实际回款金额输入框不能为空',
                            type: 'warning'
                        });
                        break;
                    }
                }
                this.topTable.forEach(item => {
                    if (item.showTip || item.rangeTip) {
                        this.isCanSub = 'no';
                    }
                });
                if (this.isCanSub === 'yes' && this.editTag !== 'editHistory') {
                    this.generateData = this.topTable;
                    let dataArr = [];
                    this.generateData.forEach(item => {
                        let obj = {
                            business_id: item.business_id,
                            business_type: item.business_type,
                            actual_money: item.iptVal,
                            deal_id: item.deal_id,
                            num: item.num
                        };
                        dataArr.push(obj);
                    });
                    let params = {
                        flow_id: this.flowId,
                        payment_data: dataArr
                    };
                    if (this.flag) {
                        this.flag = false;
                        this.axios
                            .post('/backend-api/expand/ex-bank-flow/check-payment', params)
                            .then(res => {
                                // 等弹窗关闭动画后再置为false
                                this.flag = true;
                                if (res.data.code === 0) {
                                    let reData = res.data.data;
                                    reData.need_audit.forEach((item, index) => {
                                        this.generateData.forEach((item1, index1) => {
                                            if (item.business_id === item1.business_id && item.deal_id === item1.deal_id) {
                                                let organized = Object.assign({}, item1, item);
                                                reData.need_audit[index] = organized;
                                            }
                                        });
                                    });
                                    reData.not_audit.forEach((item, index) => {
                                        this.generateData.forEach(item1 => {
                                            if (item.business_id === item1.business_id && item.deal_id === item1.deal_id) {
                                                let organized = Object.assign({}, item1, item);
                                                reData.not_audit[index] = organized;
                                            }
                                        });
                                    });
                                    this.$emit('sub-dia', false, true, reData, this.editTag);
                                } else {
                                    alert(res.data.msg);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                } else if (this.isCanSub === 'yes' && this.editTag === 'editHistory') {
                    let params = {
                        business_id: this.topTable[0].business_id,
                        business_type: this.topTable[0].business_type
                    };
                    if (this.flag) {
                        this.flag = false;
                        this.axios.post('/backend-api/expand/ex-bank-flow/delete-payment', params).then(res => {
                            this.flag = true;
                            if (res.data.code === 0) {
                                let changedMoney = this.topTable[0].iptVal;
                                // business_type=1 的转换为forecast_id
                                if (this.topTable[0].business_type.toString() === '1') {
                                    this.topTable[0].business_id = this.topTable[0].forecast_id;
                                    // business_type为1的设置为3
                                    this.topTable[0].business_type = '3';
                                }
                                // 处理合同预测阶段 实际回款日期字段不一致问题
                                this.topTable[0].content = this.topTable[0].pre_paid_content; // 合同预测阶段
                                this.topTable[0].arrival_time = this.topTable[0].actual_datetime; // 实际回款日期
                                this.$emit('success-history', this.topTable[0], changedMoney);
                            } else {
                                alert(res.data.msg);
                            }
                        });
                    }
                }
            },
            verify(para1, index) {
                if (para1 !== '') {
                    para1 = para1 * 1;
                    if (para1 === 0) {
                        this.topTable[index].showTip = true;
                        this.topTable[index].rangeTip = false;
                    } else if (para1 > this.topTable[index].unverified_money) {
                        this.topTable[index].rangeTip = true;
                        this.topTable[index].showTip = false;
                    } else {
                        // 合法输入值
                        this.topTable[index].rangeTip = false;
                        this.topTable[index].showTip = false;
                    }
                } else {
                    this.topTable[index].rangeTip = false;
                    this.topTable[index].showTip = false;
                }
            }
        },
        created() {
            this.flowId = this.$route.query.flowId;
        },
        watch: {
            showTopDialog: {
                handler: function(val, old) {
                    this.isShow = val;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.dialog-box {
    .line {
        position: relative;
        padding-left: 14px;
        margin-bottom: 10px;
    }
    .line:before {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        width: 6px;
        height: 24px;
        background-color: steelblue;
    }
    .s-query {
        overflow: hidden;
        > li.w-auto {
            width: auto;
        }
    }
    /deep/ .top-box {
        h2 {
            padding-bottom: 10px;
            border-bottom: 1px solid #edeff0;
        }
        .line {
            margin-bottom: 0;
        }
        .el-dialog__header {
            padding-bottom: 0;
        }
        .el-dialog__body {
            padding: 0 20px;
            min-height: 200px;
            max-height: 500px;
            overflow: auto;
        }
        .btn-area {
            text-align: center;
            .cancel {
                color: #333;
                border: 1px solid #333;
                margin-right: 10px;
                cursor: pointer;
            }
            .confirm {
                background: #337ab7;
                color: #fff;
                border: 1px solid #337ab7;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
    .list {
        .item {
            position: relative;
            min-height: 174px;
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
        }
        .sort {
            float: left;
            width: 100px;
            text-align: center;
            color: #333;
            line-height: 174px;
        }
        .remove {
            float: right;
            font-size: 16px;
            color: #1662b3;
            cursor: pointer;
        }
        .content {
            overflow: hidden;
            .w-auto {
                margin-right: 20px;
                margin-bottom: 0;
                line-height: 34px;
            }
            .all-width {
                width: 100%;
                margin-bottom: 0;
            }
            .th {
                width: auto;
                height: 34px;
                line-height: 2;
            }
            .td {
                line-height: 2;
            }
            /deep/ .el-input {
                width: auto;
                height: 34px;
                .el-input__inner {
                    height: 34px;
                    line-height: 34px;
                }
            }
        }
    }
    .error-tip {
        color: #f56c6c;
    }
}
</style>
