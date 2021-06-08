<!--
 * @Name: 开发商订单分配规则管理
 * @Description: 开发商订单分配规则管理
 * @Author: wangxue
 * @Date: 2020-03-25
-->
<template>
    <div class="alloc-rule-tab">
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="bd">
                <div class="order-search">
                    <!--查询需求-->
                    <ul class="s-query clearfix">
                        <li>
                            <div class="th">楼盘：</div>
                            <div class="td">
                                <el-input
                                    v-model="projectName"
                                    placeholder="请输入内容"
                                    clearable
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">开发商：</div>
                            <div class="td">
                                <el-input
                                    v-model="developerName"
                                    placeholder="请输入内容"
                                    clearable
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">是否开启：</div>
                            <div class="td">
                                <el-select
                                    v-model="isOpen"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in radioList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">更新时间：</div>
                            <div class="td">
                                <el-date-picker
                                    v-model="updateTime"
                                    clearable
                                    :default-time="['00:00:00', '23:59:59']"
                                    class="form-date-range-box"
                                    type="datetimerange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                >
                                </el-date-picker>
                            </div>
                        </li>
                        <li>
                            <div class="th">楼盘ID：</div>
                            <div class="td">
                                <el-input
                                    clearable
                                    v-model="projectId"
                                    placeholder="请输入内容"
                                >
                                </el-input>
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
                            <el-col :span="12">
                                <p class="total-num">当前条件下共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area">
                                    <el-button
                                        type="primary"
                                        @click="operationRule('0')"
                                    >新增规则</el-button>
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
                                prop="developer_name"
                                label="开发商"
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
                                min-width="80"
                                prop="port_name"
                                label="分配留电口"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="channel_name"
                                label="分配渠道"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="is_open_text"
                                label="是否开启"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="developer_rate"
                                label="分配给开发商比例"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
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
                                        @click="operationRule(scope.row.id)"
                                    >编辑</el-button>
                                    <el-button
                                        type="text"
                                        size="medium"
                                        class="delete-txt"
                                        @click="deleteDialogShow(scope.row.id)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                v-if="totalNum-pageSize > 0"
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="searchData"
                                :total="totalNum"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 删除/恢复开发商人员弹窗 -->
        <el-dialog
            title="系统提示"
            :visible.sync="deleteDialog"
            width="400px"
            center
        >
            <span>点击删除即可删除本条数据</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="deleteRule"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import allocRuleApi from '../api/allocRuleApi';
export default {
    name: 'alloc-rule',
    data() {
        return {
            // 开发商名称
            developerName: '',
            // 楼盘名称
            projectName: '',
            // 楼盘ID
            projectId: '',
            // 是否开启
            isOpen: '',
            // 更新时间
            updateTime: '',
            // 当前页面
            currentPage: 1,
            // 数据总数
            totalNum: 0,
            // 表格数据
            tableList: [],
            // 下拉列表「是，否」
            radioList: [
                {
                    value: '1',
                    name: '是'
                },
                {
                    value: '2',
                    name: '否'
                }
            ],
            // 点击删除弹窗
            deleteDialog: false,
            // 删除的规则id
            delRuleId: '',
            // 搜索loading
            loading: false,
            // 每页显示数据
            pageSize: 20,
            // 防止重复提交
            flag: true
        };
    },
    created () {
        // 获取初始数据
        this.searchData(1);
    },
    methods: {
        /**
         * 新增/编辑规则
         * @params [string] projectName 楼盘名称
         */
        operationRule(id) {
            this.$router.push({
                path: '/developer/orderRuleManage',
                query: {
                    id
                }
            });
        },
        /**
         * 点击搜索
         * @params [string] page 页码
         */
        async searchData(page) {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            this.flag = false;
            try {
                this.loading = true;
                if (page) {
                    this.currentPage = page;
                }
                let params = {
                    page: this.currentPage,
                    project_name: this.projectName,
                    developer_name: this.developerName,
                    project_id: this.projectId,
                    update_datetime_min: this.updateTime
                        ? this.updateTime[0] / 1000
                        : '',
                    update_datetime_max: this.updateTime
                        ? this.updateTime[1] / 1000
                        : '',
                    is_open: this.isOpen
                };
                let { data } = await allocRuleApi.allocList(params);
                if (data.code === 0) {
                    this.tableList = data.data.list;
                    this.totalNum = data.data.totalCount
                        ? parseInt(data.data.totalCount)
                        : '0';
                    this.loading = false;
                    this.flag = true;
                } else {
                    this.$message(data.msg);
                    this.flag = true;
                }
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        // 点击重置
        resetSearch() {
            this.developerName = '';
            this.projectName = '';
            this.projectId = '';
            this.isOpen = '';
            this.updateTime = '';
            this.searchData(1);
        },
        /**
         * 点击删除出现确认删除弹窗
         * @param {string} id 规则id
         */
        deleteDialogShow(id) {
            this.delRuleId = id;
            this.deleteDialog = true;
        },
        // 确认删除数据
        async deleteRule() {
            // 请求数据
            try {
                let params = {
                    id: this.delRuleId
                };
                const {
                    data: { code, msg }
                } = await allocRuleApi.delRule(params);
                if (code === 0) {
                    // 删除成功
                    this.$message(msg);
                    this.searchData();
                } else {
                    this.$message(msg);
                }
            } catch (err) {
                console.log(err);
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
.alloc-rule-tab {
    /deep/.search-wrap {
        padding-top: 20px;
        .el-date-editor {
            width: 100%;
            height: 40px;
            box-sizing: border-box;
            .el-range-separator {
                font-size: 12px;
            }
            .date-tip-logo {
                display: none;
            }
        }
        .el-range-input {
            background-color: #fff;
            font-size: 12px;
            line-height: 32px;
        }
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
    .delete-txt {
        color: #f64a4a;
    }
    /deep/.kfs-operation-dialog {
        .el-dialog {
            overflow: hidden;
        }
    }
}
</style>
