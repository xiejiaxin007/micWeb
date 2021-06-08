<!--
 * @Name: 开发商余额详情页
 * @Description: 开发商余额详情页
 * @Author: wangxue
 * @Date: 2020-02-11
-->
<template>
    <div class="detail-balance">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/developer/developerManagement', query:{active:'3'}}">
                开发商管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>开发商余额详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!--开发商信息区域-->
        <div class="ksf-msg-box">
            <div class="ksf-msg">
                <ul class="ksf-content">
                    <li>
                        <div class="th">开发商ID：</div>
                        <div class="td">
                            {{developerId}}
                        </div>
                    </li>
                    <li>
                        <div class="th">品牌开发商：</div>
                        <div class="td">
                            {{developerName}}
                        </div>
                    </li>
                    <li>
                        <div class="th">楼盘名称：</div>
                        <div class="td">
                            {{projectName}}
                        </div>
                    </li>
                    <li>
                        <div class="th">账户余额：</div>
                        <div class="td">
                            {{accountMoney}}
                        </div>
                    </li>
                    <li>
                        <div class="th">可退金额（已扣除返点）</div>
                        <div class="td">
                            {{canRefund}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--充值详情-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="table-wrap">
                        <el-table
                            ref="tableFixedWrap"
                            border
                            :data="tableList"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor"
                        >
                            <el-table-column
                                min-width="120"
                                prop="op_date"
                                label="日期"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="source"
                                label="类型"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.source=='1'? '充值' : '退款'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="120"
                                prop="op_amount"
                                label="金额"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                label="返点"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <div>{{scope.row.rebate}}
                                        <span v-if="scope.row.rebate!='-'">%</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="120"
                                prop="updator"
                                label="更新人"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="150"
                                prop="update_datetime"
                                label="更新时间"
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
                                        @click="deleteDialogShow(scope.row)"
                                    >删除</el-button>
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
        <!-- 删除开发商弹窗 -->
        <el-dialog
            title="系统提示"
            :visible.sync="deleteDialog"
            width="30%"
            center
        >
            <span>是否删除此数据</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmDelete"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import developerApi from './api/developerApi';
    export default {
        name: 'detailBalance',
        data() {
            return {
                // loading
                loading: false,
                // 开发商id
                developerId: this.$route.query.developerId,
                // 开发商名称
                developerName: this.$route.query.developerName,
                // 项目id
                projectId: this.$route.query.projectId,
                // 楼盘名称
                projectName: this.$route.query.projectName,
                // 账户余额
                accountMoney: '0',
                // 可退金额
                canRefund: '0',
                // 表格数据
                tableList: [],
                // 表格总数
                totalNum: 0,
                // 页码
                currentPage: 1,
                // 每页显示数据
                pageSize: 20,
                // 删除弹窗
                deleteDialog: false,
                // 删除数据id
                operationId: ''
            };
        },
        mounted() {
            // 初始化页面
            this.initData();
        },
        methods: {
            // 页面初始化信息
            async initData() {
                this.loading = true;
                try {
                    let params = {
                        developer_id: this.developerId,
                        project_id: this.projectId,
                        page: this.currentPage,
                        page_size: this.pageSize
                    };
                    let { data } = await developerApi.balanceDetail(params);
                    if (data.code === 0) {
                        this.accountMoney = data.data.header.account_balance_amount;
                        this.canRefund = data.data.header.returnable_amount;
                        this.tableList = data.data.list;
                        this.totalNum = parseInt(data.data.total);
                        this.loading = false;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 表格翻页
            pageChange() {
                this.initData();
            },
            /**
             * 删除楼盘
             * @params [string] row 行数据
             */
            deleteDialogShow(row) {
                this.deleteDialog = true;
                this.operationId = row.id;
                this.operationSource = row.source;
            },
            // 确定删除
            async confirmDelete() {
                this.loading = true;
                try {
                    let params = {
                        id: this.operationId,
                        source: this.operationSource
                    };
                    let { data } = await developerApi.delBalance(params);
                    if (data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.initData();
                        this.loading = false;
                    } else {
                        this.$message(data.msg);
                        this.loading = false;
                    }
                } catch (err) {
                    console.log(err);
                    this.loading = false;
                }
                this.deleteDialog = false;
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
.detail-balance {
    padding: 0 30px;
    .ksf-msg-box {
        background: #fff;
        margin-bottom: 20px;
        .ksf-content {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            padding: 0 20px;
            li {
                height: 40px;
                font-size: 14px;
                color: #666;
                line-height: 40px;
                .th {
                    float: left;
                    font-weight: bold;
                }
                .td {
                    float: left;
                }
            }
        }
    }
    .pagination {
        text-align: center;
        margin: 25px 0 10px;
    }
}
</style>
