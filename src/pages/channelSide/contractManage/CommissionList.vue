<!--
 * @author: kangxue
 * @Date: 2020-04-17
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-28 14:16:06
 * @description: 结佣单据标准1.0列表
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>结佣单据标准管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="main-title">结佣单据标准管理</div>
            <div class="order-search">
                <!--查询搜索-->
                <ul class="s-query clearfix">
                    <li>
                        <div class="th">单据标准ID：</div>
                        <div class="td">
                            <jl-number-input v-model="standardId"
                                reg="int"
                                placeholder="请输入单据标准ID" />
                        </div>
                    </li>
                    <li class="long-width">
                        <div class="th">单据标准：</div>
                        <div class="td">
                            <el-input v-model="standardName"
                                placeholder="请输入单据标准">
                            </el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">创建人：</div>
                        <div class="td">
                            <search-select-radio v-model="creator"
                                placeholder="请选择"
                                clearable
                                :apiInfo="userApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">关联合同ID：</div>
                        <div class="td">
                            <jl-number-input v-model="contractId"
                                reg="int"
                                placeholder="请输入关联合同ID" />
                        </div>
                    </li>
                    <li>
                        <div class="th">地理城市：</div>
                        <div class="td">
                            <search-select-radio v-model="cityId"
                                :clearable="true"
                                placeholder="请选择"
                                :apiInfo="cityApi">
                            </search-select-radio>
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
                                <p class="total-num"><span v-if="totalNum > 0">第{{countRange}}条，</span>共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area"
                                    v-if="createAuth">
                                    <router-link to="/contract/commissionEditIn">
                                        <el-button type="primary">新增单据标准</el-button>
                                    </router-link>
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
                                label="单据标准ID"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="200"
                                prop="bill_name"
                                label="结佣单据标准"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="city_name"
                                label="地理城市"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="150"
                                prop="uptator_name"
                                label="关联合同ID"
                                align="center">
                                <template slot-scope="scope">
                                    <el-button type="text"
                                        size="small"
                                        @click="toUrl(scope.row.contract_url)">{{scope.row.contract_id}}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="creator"
                                label="创建人"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="create_datetime"
                                label="创建时间"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                label="操作"
                                align="center">
                                <template slot-scope="scope">
                                    <div class="btn-list">
                                    <router-link :to="{ path: '/contract/commissionInfo', query: { id: scope.row.id }}"
                                        v-if="scope.row.actions.view_auth">
                                        <el-button type="text"
                                            size="small">查看</el-button>
                                    </router-link>
                                    <router-link :to="{ path: '/contract/commissionEditIn', query: { id: scope.row.id }}"
                                        v-if="scope.row.actions.edit_auth">
                                        <el-button type="text"
                                            size="small">编辑</el-button>
                                    </router-link>
                                    <el-button v-if="scope.row.actions.delete_auth"
                                        type="text"
                                        size="small"
                                        @click="deleteInfo(scope.row.id)">删除</el-button>
                                    </div>
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
        <!-- 删除 -->
        <el-dialog title="提示"
            center
            :visible.sync="dialogVisible"
            width="400px">
            <div class="center">确认删除单据标准ID：{{currentId}}</div>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from './api/api';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
export default {
    name: 'commission-list',
    components: {
        SearchSelectRadio
    },
    data() {
        return {
            // 结佣单据标准ID
            standardId: '',
            // 结佣单据标准
            standardName: '',
            // 创建人
            creator: '',
            // 创建人人下拉api
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all',
                    status: '-1'
                }
            },
            // 关联合同ID
            contractId: '',
            // 城市ID
            cityId: '',
            // 城市远程下拉
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll,noAll'
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
            flag: true,
            // 要删除的单据标准ID
            currentId: '',
            // 删除弹层展示
            dialogVisible: false,
            // 创建权限
            createAuth: true
        };
    },
    mounted() {
        // 获取初始数据
        this.searchData(1);
    },
    computed: {
        // 第多少条
        countRange: function() {
            let prev = this.currentPage > 1 ? (this.currentPage - 1) * this.pageSize : 1;
            let next = prev + this.pageSize - 1;
            next = next < this.totalNum ? next : this.totalNum;
            return prev + '-' + next;
        }
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
                    id: this.standardId,
                    bill_name: this.standardName,
                    contract_id: this.contractId,
                    city_id: this.cityId,
                    creator: this.creator
                };
                const {
                    data: { code, msg, data }
                } = await api.getStandardData(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.totalNum = data.totalCount ? parseInt(data.totalCount) : '0';
                    this.pageSize = data.pageSize;
                    this.loading = false;
                    this.flag = true;
                    this.createAuth = data.create_auth;
                } else {
                    this.flag = true;
                    this.$message(msg);
                    this.loading = false;
                }
            } catch (err) {
                this.loading = false;
                this.flag = true;
                console.log(err);
            }
        },
        // 点击重置
        resetSearch() {
            this.standardId = '';
            this.standardName = '';
            this.creator = '';
            this.contractId = '';
            this.cityId = '';
            this.searchData(1);
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
        },
        // 合同跳转新页面
        toUrl(url) {
            let toLink = window.open(url, '_target');
            toLink.opener = null;
        },
        /**
         * 删除单据标准
         * @param {string} id 单据标准ID
         */
        deleteInfo(id) {
            this.currentId = id;
            this.dialogVisible = true;
        },
        // 确定删除回款流程
        async confirmDel() {
            try {
                let params = {
                    bill_id: this.currentId
                };
                const {
                    data: { code, msg }
                } = await api.deleteStandard(params);
                if (code === 0) {
                    this.dialogVisible = false;
                    this.$message({
                        message: msg,
                        type: 'success'
                    });
                    this.searchData(1);
                } else {
                    this.$message(msg);
                    this.dialogVisible = false;
                }
            } catch (err) {
                console.log(err);
                this.dialogVisible = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.main-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.container-box {
    .s-query {
        li {
            width: 25%;
            &.long-width {
                width: 50%;
            }
        }
    }
    .form-table-box {
        padding-top: 20px;
    }
    .btn-list {
        button {
            margin: 0 5px;
        }
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
.center {
    text-align: center;
}
</style>
