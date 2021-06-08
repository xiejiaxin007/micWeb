<!--
 * @Name: 开发商余额管理
 * @Description: 开发商余额管理
 * @Author: wangxue
 * @Date: 2020-02-10
-->
<template>
    <div class="ksf-balance-tab">
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="bd">
                <div class="order-search">
                    <!--查询需求-->
                    <ul class="s-query clearfix">
                        <li>
                            <div class="th">品牌开发商：</div>
                            <div class="td">
                                <el-select
                                    v-model="developerId"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请选择"
                                    :loading="loading"
                                >
                                    <el-option
                                        v-for="item in developerList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">楼盘名称：</div>
                            <div class="td">
                                <el-select
                                    v-model="projectId"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请选择"
                                    :loading="loading"
                                >
                                    <el-option
                                        v-for="item in projectList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">开发商ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="kfsId"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="btn-area">
                    <el-button @click="resetSearch">重置</el-button>
                    <el-button
                        type="primary"
                        @click="searchData(1)"
                    >搜索</el-button>
                </div>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="16">
                                <p class="total-num">当前条件下共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="8">
                                <div class="operation-area">
                                    <el-button
                                        type="primary"
                                        @click="exportFile"
                                    >导出</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-wrap">
                        <el-table
                            ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor"
                        >
                            <el-table-column
                                min-width="100"
                                prop="developer_id"
                                label="开发商ID"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="developer_name"
                                label="品牌开发商"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="150"
                                prop="project_name"
                                label="楼盘名称"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="amount"
                                label="账户余额"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="120"
                                prop="returnable_amount"
                                label="可退金额(已扣除返点)"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                label="操作"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="medium"
                                        @click="toDetail(scope.row)"
                                    >查看</el-button>
                                    <el-button
                                        type="text"
                                        size="medium"
                                        @click="rechargeDialog(scope.$index,scope.row)"
                                    >充值</el-button>
                                    <el-button
                                        type="text"
                                        size="medium"
                                        @click="refundDialog(scope.$index,scope.row)"
                                    >退款</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :hide-on-single-page="totalNum <= 0"
                                :total="totalNum"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 充值弹窗 -->
        <el-dialog
            title="充值"
            :visible.sync="rechargeData.isShow"
            width="420px"
            center
            @close="resetForm('rechargeData')"
        >
            <div class="recharge-dialog">
                <el-form
                    ref="rechargeData"
                    :model="rechargeData"
                    :rules="rechargeRules"
                    label-width="110px"
                >
                    <el-form-item
                        label="开发商："
                        prop="developerName"
                    >
                        <span>{{rechargeData.rowData.developer_name}}</span>
                    </el-form-item>
                    <el-form-item
                        label="楼盘名称："
                        prop="projectName"
                    >
                        <span>{{rechargeData.rowData.project_name}}</span>
                    </el-form-item>
                    <el-form-item
                        label="充值日期："
                        prop="date"
                    >
                        <el-date-picker
                            v-model="rechargeData.date"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item
                        label="充值金额："
                        prop="money"
                    >
                        <jl-number-input
                            v-model="rechargeData.money"
                            reg='twoNum'
                        />
                    </el-form-item>
                    <el-form-item
                        label="返点比例："
                        prop="rate"
                    >
                        <el-select
                            v-model="rechargeData.rate"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in rateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="账户余额增加："
                        prop="moneyIncreace"
                    >
                        {{increase}}元
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="resetForm('rechargeData')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitRecharge('rechargeData')"
                >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 退款弹窗 -->
        <el-dialog
            title="退款"
            :visible.sync="refundData.isShow"
            width="420px"
            center
            @close="resetForm('refundData')"
        >
            <div class="refund-dialog">
                <el-form
                    ref="refundData"
                    :model="refundData"
                    :rules="refundRules"
                    label-width="110px"
                >
                    <el-form-item
                        label="开发商："
                        prop="developerName"
                    >
                        <span>{{refundData.rowData.developer_name}}</span>
                    </el-form-item>
                    <el-form-item
                        label="楼盘名称："
                        prop="projectName"
                    >
                        <span>{{refundData.rowData.project_name}}</span>
                    </el-form-item>
                    <el-form-item
                        label="退款日期："
                        prop="date"
                    >
                        <el-date-picker
                            v-model="refundData.date"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item
                        label="退款金额："
                        prop="money"
                    >
                        <jl-number-input
                            v-model="refundData.money"
                            reg='twoNum'
                        />
                    </el-form-item>
                    <el-form-item
                        label="账户余额减少："
                        prop="moneyReduce"
                    >
                        {{refundData.reduce}}元
                    </el-form-item>
                    <el-form-item
                        label="退款后账户余额"
                        prop="afterRefund"
                    >
                        {{refundData.afterRefund}}元
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="resetForm('refundData')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitRefund('refundData')"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import developerApi from '../api/developerApi';
    export default {
        name: 'kfs-balance',
        data() {
            var verifyZaro = (rule, value, callback) => {
                if (value === '0' || value === '0.') {
                    return callback(new Error('仅可输入大于0的两位小数'));
                }
                callback();
            };

            return {
                // 开发商名称
                developerId: '',
                // 楼盘名称
                projectId: '',
                // 模糊搜索开发商Id
                kfsId: '',
                // 当前页面
                currentPage: 1,
                // 数据总数
                totalNum: 0,
                // 表格数据
                tableList: [],
                // 开发商下拉列表
                developerList: [],
                // 楼盘下拉所有楼盘列表
                projectList: [],
                // 搜索loading
                loading: false,
                // 每页显示数据
                pageSize: 20,
                // 操作项在表格数据的索引 因为编辑后不请求接口，手动改变数据，使页面停留在操作的位置
                operationIndex: '',
                // 充值弹窗
                rechargeData: {
                    isShow: false,
                    rowData: {},
                    date: '',
                    money: '', // 充值金额
                    rate: '', // 返点
                    increase: '' // 账户增加
                },
                // 退款弹窗
                refundData: {
                    isShow: false,
                    rowData: {},
                    date: '',
                    money: '', // 退款金额
                    reduce: '0', // 账户减少
                    afterRefund: '' // 退款后账户金额
                },
                rateList: [
                    {
                        value: 0,
                        label: '0%'
                    },
                    {
                        value: 0.05,
                        label: '5%'
                    },
                    {
                        value: 0.1,
                        label: '10%'
                    },
                    {
                        value: 0.2,
                        label: '20%'
                    }
                ],
                // 充值表单rules
                rechargeRules: {
                    date: [
                        {
                            message: '充值日期不能为空',
                            required: true,
                            trigger: 'blur'
                        }
                    ],
                    money: [
                        {
                            message: '充值金额不能为空',
                            required: true,
                            trigger: 'blur'
                        },
                        {
                            validator: verifyZaro,
                            trigger: 'blur'
                        }
                    ],
                    rate: [
                        {
                            message: '返点不能为空',
                            required: true,
                            trigger: 'change'
                        }
                    ]
                },
                // 退款表单rules
                refundRules: {
                    date: [
                        {
                            message: '退款日期不能为空',
                            required: true,
                            trigger: 'change'
                        }
                    ],
                    money: [
                        {
                            message: '退款金额不能为空',
                            required: true,
                            trigger: 'blur'
                        },
                        {
                            validator: verifyZaro,
                            trigger: 'blur'
                        }
                    ]
                },
                // 防止重复提交
                flag: true,
                // 退款弹窗里计算减少金额节流定时器
                timer: false,
                // 日期选择器 可选日期今天及今天之前
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        watch: {
            // 监听退款弹窗里输入金额
            'refundData.money': {
                handler: function(val, oldval) {
                    if (!this.refundData.isShow) return;
                    if (val === '0' || val === '0.') return;
                    if (val - this.refundData.rowData.returnable_amount > 0) {
                        if (!this.flag) return;
                        this.flag = false;
                        this.$message({
                            message: '退款金额不能超过此账户的实际可退金额',
                            duration: 3000,
                            onClose: () => {
                                this.flag = true;
                            }
                        });
                        if (this.timer) clearTimeout(this.timer);
                        return;
                    }
                    if (this.timer) clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.getAcountReduce(val);
                    }, 1500);
                },
                deep: true
            }
        },
        computed: {
            increase() {
                let increaseMoney =
                    this.rechargeData.money * (1 + this.rechargeData.rate);
                return (Math.round(increaseMoney * 100) / 100).toFixed(2);
            }
        },
        mounted() {
            // 获取初始数据
            this.searchData(1);
            // 获取开发商下拉列表
            this.getDeveloperList('');
            // 获取楼盘下拉列表
            this.getProjectList('');
            // 获取当天日期
            this.getNowTime();
        },
        methods: {
            /**
             * 点击搜索
             * @params [string] page 页码
             */
            async searchData(page) {
                // 请求接口数据返回结果
                // 防止重复提交
                this.currentPage = page;
                if (!this.flag) return;
                this.flag = false;
                try {
                    this.loading = true;
                    let params = {
                        page: String(page),
                        page_size: this.pageSize,
                        developer_id: this.developerId,
                        project_id: this.projectId,
                        developer_like_id: this.kfsId,
                        export: '0'
                    };
                    let { data } = await developerApi.balanceList(params);
                    if (data.code === '0') {
                        this.tableList = data.data.list;
                        this.totalNum = data.data.total_count
                            ? parseInt(data.data.total_count)
                            : 0;
                        this.loading = false;
                        this.flag = true;
                    } else {
                        this.$message(data.msg);
                        this.loading = false;
                        this.flag = true;
                    }
                } catch (err) {
                    console.log(err);
                    this.flag = true;
                }
            },
            // 点击重置
            resetSearch() {
                this.developerId = '';
                this.projectId = '';
                this.kfsId = '';
                this.currentPage = 1;
                this.searchData(1);
            },
            /**
             * 远程搜索开发商
             * @params [string] q 搜索内容
             */
            async getDeveloperList(q) {
                this.loading = true;
                try {
                    let params = {
                        q
                    };
                    let { data } = await developerApi.getDeveloperInfoList({
                        params
                    });
                    if (data.code === '0') {
                        this.developerList = data.data.list;
                        this.loading = false;
                    } else {
                        this.$message(data.msg);
                        this.loading = false;
                    }
                } catch (err) {
                    this.loading = false;
                    console.log(err);
                }
            },
            /**
             * 远程搜索楼盘
             * @params [string] q 搜索内容
             */
            async getProjectList(q) {
                this.loading = true;
                try {
                    let params = {
                        name: q,
                        developer_id: '',
                        not_in_id: []
                    };
                    let { data } = await developerApi.getProjectList(params);
                    if (data.code === '0') {
                        this.projectList = data.data.list;
                        this.loading = false;
                    } else {
                        this.$message(data.msg);
                        this.loading = false;
                    }
                } catch (err) {
                    this.loading = false;
                    console.log(err);
                }
            },
            /**
             * 点击查看
             * @param {string} rowData 查看所在行数据
             */
            toDetail(rowData) {
                let query = {
                    developerId: rowData.developer_id,
                    developerName: rowData.developer_name,
                    projectId: rowData.project_id,
                    projectName: rowData.project_name
                };
                this.$router.push({
                    path: '/developer/detailBalance',
                    query
                });
            },
            /**
             * 点击充值
             * @param {string} index 表格行索引
             * @param {string} rowData 表格该行数据
             */
            rechargeDialog(index, rowData) {
                this.rechargeData.isShow = true;
                // 操作项索引
                this.operationIndex = index;
                this.rechargeData.rowData = rowData;
            },
            /**
             * 点击退款
             * @param {string} index 表格行索引
             * @param {string} rowData 表格该行数据
             */
            refundDialog(index, rowData) {
                this.refundData.isShow = true;
                // 操作项索引
                this.operationIndex = index;
                this.refundData.rowData = rowData;
                this.refundData.afterRefund = rowData.amount;
                this.refundData.reduce = '0';
            },
            // 获取当天日期
            getNowTime() {
                var now = new Date();
                var year = now.getFullYear(); // 得到年份
                var month = now.getMonth(); // 得到月份
                var date = now.getDate(); // 得到日期
                month = month + 1;
                month = month.toString().padStart(2, '0');
                date = date.toString().padStart(2, '0');
                var defaultDate = `${year}-${month}-${date}`;
                this.$set(this.refundData, 'date', defaultDate);
                this.$set(this.rechargeData, 'date', defaultDate);
            },
            /**
             * 获取余额减少
             * @param {string} val 输入的退款金额
             */
            async getAcountReduce(val) {
                try {
                    let params = {
                        developer_id: this.refundData.rowData.developer_id,
                        project_id: this.refundData.rowData.project_id,
                        op_date: this.refundData.date,
                        op_amount: val
                    };
                    const { data } = await developerApi.checkRefundInfoApi(params);
                    if (data.code === 0) {
                        this.flag = true;
                        this.loading = false;
                        this.refundData.reduce = data.data.account_reduce;
                        this.refundData.afterRefund = data.data.account_balance;
                    } else {
                        this.$message(data.msg);
                        this.loading = false;
                        this.flag = true;
                    }
                } catch (err) {
                    this.flag = true;
                    this.loading = false;
                    console.log(err);
                }
            },
            /**
             * 重置数据
             * @param {Object} formName 表单数据
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
                if (formName === 'rechargeData') {
                    this.rechargeData.isShow = false;
                } else {
                    this.refundData.isShow = false;
                }
            },
            // 导出文件
            exportFile() {
                try {
                    let params = {
                        page: String(this.currentPage),
                        page_size: this.pageSize,
                        developer_id: this.developerId,
                        project_id: this.projectId,
                        developer_like_id: this.kfsId,
                        export: '1'
                    };
                    let url =
                        '/backend-api/kfs_dsp/kfs-balance/get-account-amount-list?';
                    Object.keys(params).map((item, i) => {
                        if (i !== 0) {
                            url += '&' + item + '=' + params[item];
                        } else {
                            url += item + '=' + params[item];
                        }
                    });
                    window.location.href = url;
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 表格翻页
             * @param {Object} para 页码
             */
            pageChange(para) {
                this.searchData(para);
            },
            /**
             * 充值弹窗 保存按钮
             * @param {Object} formName 表单数据
             */
            submitRecharge(formName) {
                // 防止重复提交
                if (!this.flag) return;
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        this.flag = false;
                        this.loading = true;
                        try {
                            let params = {
                                developer_id: this.rechargeData.rowData
                                    .developer_id,
                                project_id: this.rechargeData.rowData.project_id,
                                op_date: this.rechargeData.date,
                                op_amount: this.rechargeData.money,
                                rebate: this.rechargeData.rate * 100
                            };
                            const { data } = await developerApi.recharge(params);
                            if (data.code === 0) {
                                this.$message(data.msg);
                                this.flag = true;
                                this.loading = false;
                                this.rechargeData.isShow = false;
                                // 修改成功后手动改变数据，使页面还在操作前的位置
                                let obj = this.rechargeData.rowData;
                                obj.returnable_amount = data.data.returnable_amount;
                                obj.amount = data.data.account_balance_amount;
                                this.$set(this.tableList, this.operationIndex, obj);
                            } else {
                                this.$message(msg);
                                this.loading = false;
                                this.flag = true;
                            }
                        } catch (err) {
                            this.flag = true;
                            this.loading = false;
                            console.log(err);
                        }
                    } else {
                        this.flag = true;
                        return false;
                    }
                });
            },
            /**
             * 退款弹窗 保存按钮
             * @param {Object} formName 表单数据
             */
            submitRefund(formName) {
                // 防止重复提交
                if (!this.flag) return;
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        this.flag = false;
                        this.loading = true;
                        try {
                            let params = {
                                developer_id: this.refundData.rowData.developer_id,
                                project_id: this.refundData.rowData.project_id,
                                op_date: this.refundData.date,
                                op_amount: this.refundData.money
                            };
                            const { data } = await developerApi.refund(params);
                            if (data.code === 0) {
                                this.$message(data.msg);
                                this.flag = true;
                                this.loading = false;
                                this.refundData.isShow = false;
                                // 修改成功后手动改变数据，使页面还在操作前的位置
                                let obj = this.refundData.rowData;
                                obj.returnable_amount = data.data.returnable_amount;
                                obj.amount = data.data.account_balance_amount;
                                this.$set(this.tableList, this.operationIndex, obj);
                            } else {
                                this.$message(msg);
                                this.loading = false;
                                this.flag = true;
                            }
                        } catch (err) {
                            this.flag = true;
                            this.loading = false;
                            console.log(err);
                        }
                    } else {
                        this.flag = true;
                        return false;
                    }
                });
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #f9f9f9;color: #333;';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.ksf-balance-tab {
    /deep/.el-table {
        .cell {
            font-size: 14px;
            color: #333;
        }
    }
    /deep/.el-dialog {
        .el-dialog__body {
            padding: 0 25px;
        }
        .el-form-item {
            margin-bottom: 16px;
        }
    }
    .search-wrap {
        padding-top: 20px;
    }
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
        }
        .operation-area {
            float: right;
            .upload-file {
                display: inline-block;
            }
        }
    }
    .pagination {
        text-align: center;
        margin: 25px 0 10px;
    }
    .el-select {
        width: 100%;
    }
}
</style>
