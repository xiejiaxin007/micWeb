<template>
    <div class="wait-check">
        <div class="v-box">
            <div class="hd">
                <h2 class="line">待核销的回款信息</h2>
            </div>
            <div class="bd">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        prop="bank_name"
                        label="银行名称"
                    >
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        prop="bank_flow_number"
                        label="银行流水"
                    >
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        prop="payment_account"
                        label="付款账户">
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        prop="payment_company"
                        label="付款公司">
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        prop="gathering_company_account"
                        label="公司账户">
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="220px"
                        prop="gathering_company_name"
                        label="公司名称">
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        prop="arrival_time"
                        width="200px"
                        label="到账时间">
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        label="到账金额">
                        <template slot-scope="scope">
                            {{scope.row.arrival_money | currency}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        label="退款金额">
                        <template slot-scope="scope">
                            {{scope.row.refund_money | currency}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        label="已核销金额">
                        <template slot-scope="scope">
                            {{scope.row.verified_money | currency}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        label="待核销金额">
                        <template slot-scope="scope">
                            {{scope.row.unverified_money | currency}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        align="center"
                        width="150px"
                        label="差额入库">
                        <template slot-scope="scope">
                            {{scope.row.margin_money | currency}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "WaitCheck",
        data () {
            return {}
        },
        props: {
            tableData: Array
        }
    }
</script>

<style lang="less" scoped>
    .wait-check {
        margin-bottom: 20px;
       /deep/ .el-table th.gutter{
            display: table-cell !important;
        }
        /deep/ .el-table colgroup.gutter {
            display: table-cell !important;
        }
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
</style>
