
<!--
 * @author: kangxue
 * @Date: 2020-04-17
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-01 18:29:02
 * @description: 智能报备2.0列表
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>序号规则列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="main-title">序号规则列表页</div>
            <div class="order-search">
                <!--查询搜索-->
                <ul class="s-query clearfix">
                    <li>
                        <div class="th">序号ID：</div>
                        <div class="td">
                            <jl-number-input v-model="ruleId"
                                reg="int"
                                placeholder="请输入内容" />
                        </div>
                    </li>
                    <li>
                        <div class="th">序号名称：</div>
                        <div class="td">
                            <el-input v-model="ruleName"
                                placeholder="请输入内容">
                            </el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">关联楼盘：</div>
                        <div class="td">
                            <search-select-radio v-model="projectId"
                                placeholder="请选择"
                                :apiInfo="houseApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">更新人：</div>
                        <div class="td">
                            <search-select-radio v-model="updateUser"
                                placeholder="请选择"
                                :apiInfo="userApi"></search-select-radio>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area">
                <el-button @click="resetSearch">重置</el-button>
                <el-button type="primary"
                    @click="searchData(1)">搜索</el-button>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="12">
                                <p class="total-num">当前共有{{totalNum}}个规则</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area">
                                    <el-button type="primary"
                                        @click="addRule">新增报备序号规则</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-wrap">
                        <el-table ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor">
                            <el-table-column min-width="60"
                                prop="id"
                                label="序号ID"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="name"
                                label="序号名称"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="200"
                                prop="project_name"
                                label="关联楼盘"
                                class-name="more-info-td"
                                align="center">
                                <template slot-scope="scope">
                                    <div class="project-name"
                                        :title="scope.row.project_name">{{scope.row.project_name}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="creator_name"
                                label="创建人"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="150"
                                prop="uptator_name"
                                label="更新人"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="update_datetime"
                                label="更新时间"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                label="操作"
                                align="center">
                                <template slot-scope="scope">
                                    <el-button type="text"
                                        size="medium"
                                        v-if="!scope.row.project_name"
                                        :disabled="scope.row.is_delete==='2'"
                                        @click="editRule(scope.row.id)">编辑</el-button>
                                    <el-button type="text"
                                        size="medium"
                                        @click="showDetail(scope.row.id)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination v-if="totalNum-pageSize>0"
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :total="totalNum">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ruleApi from './api/ruleApi';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
export default {
    name: 'number-rule-list',
    components: {
        SearchSelectRadio
    },
    data() {
        return {
            // 序号ID
            ruleId: '',
            // 序号名称
            ruleName: '',
            // 关联楼盘ID
            projectId: '',
            // 楼盘下拉api
            houseApi: {
                api: commonApi.getHouseList,
                params: {
                    q: ''
                }
            },
            // 更新人
            updateUser: '',
            // 更新人下拉api
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all'
                }
            },
            // 当前页面
            currentPage: 1,
            // 数据总数
            totalNum: 0,
            // 表格数据
            tableList: [],
            // 表格loading
            loading: false,
            // 每页显示数据
            pageSize: 20,
            // 防止重复提交
            flag: true
        };
    },
    mounted() {
        // 获取初始数据
        this.searchData(1);
    },
    methods: {
        /**
         * 点击搜索
         * @param {string} page 页码
         */
        async searchData(page) {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            if (page) {
                this.currentPage = page;
            }
            this.flag = false;
            try {
                this.loading = true;
                let params = {
                    page: this.currentPage,
                    id: this.ruleId,
                    name: this.ruleName,
                    project_id: this.projectId,
                    updator: this.updateUser
                };
                const {
                    data: { code, msg, data }
                } = await ruleApi.getNumberRuleList(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.totalNum = data.total ? parseInt(data.total) : '0';
                    this.loading = false;
                    this.flag = true;
                } else {
                    this.flag = true;
                    this.$message(msg);
                    this.loading = false;
                }
            } catch (err) {
                this.flag = true;
                console.log(err);
            }
        },
        // 点击重置
        resetSearch() {
            this.ruleId = '';
            this.ruleName = '';
            this.projectId = '';
            this.updateUser = '';
            this.searchData(1);
        },
        // 新增报备规则
        addRule() {
            let routeData = this.$router.resolve({
                path: '/numberRule/editNumberRule'
            });
            let newOpen = window.open(routeData.href, '_blank');
            newOpen.opener = null;
        },
        /**
         * 编辑报备规则
         * @param {string} id 序号ID
         */
        editRule(id) {
            let routeData = this.$router.resolve({
                path: '/numberRule/editNumberRule',
                query: {
                    id: id
                }
            });
            let newOpen = window.open(routeData.href, '_blank');
            newOpen.opener = null;
        },
        /**
         * 查看报备规则详情
         * @param {string} id 序号ID
         */
        showDetail(id) {
            let routeData = this.$router.resolve({
                path: '/numberRule/numberRuleInfo',
                query: {
                    id: id
                }
            });
            let newOpen = window.open(routeData.href, '_blank');
            newOpen.opener = null;
        },
        // 表格翻页
        pageChange() {
            this.searchData();
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
.container-box {
    .s-query {
        li {
            width: 25%;
        }
    }
    .form-table-box {
        padding-top: 20px;
    }
    .project-name {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
        }
        .operation-area {
            text-align: right;
        }
    }
}
.pagination {
    text-align: center;
    padding-top: 10px;
}
</style>
