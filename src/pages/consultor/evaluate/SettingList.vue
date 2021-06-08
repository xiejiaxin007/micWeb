<!--
 * @Name: 评价配置页
 * @Description: 呈现添加的评价的标签和问题页面
 * @Author: zhengchao
 * @Date: 2019-12-03
 -->
<template>
    <div class="auto-group-wrap">
        <!--面包屑-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>评价配置页</el-breadcrumb-item>
        </el-breadcrumb >
        <!-- 主要部分 -->
        <div class="v-box group-config">
            <div class="hd">
            <h2>评价配置页</h2>
            </div>
            <div class="bd">
                <div class="table-top-wrap">
                    <div
                        class="page-num"
                        v-if="total !== 0">
                        第{{tableRowInfo.start}}-{{tableRowInfo.end}}条数据，共{{total}}条数据
                    </div>
                    <div
                        class="page-num"
                        v-else>
                        没有符合条件的数据
                    </div>
                    <div class="add-config">
                        <el-button
                            type="primary"
                            @click="goEdit('0')">
                            新增
                        </el-button>
                    </div>
                </div>
                <!-- 列表 -->
                <el-table
                    v-loading="loading"
                    border
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        label="ID"
                        width="80">
                        <template slot-scope="scope">
                            <div v-if="scope.$index !== 0">
                                {{scope.row.id}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="group"
                        label="评价类型"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-select
                                    clearable
                                    @change="searchDataChange"
                                    v-model="params.type"
                                    placeholder="请选择"
                                    size="mini">
                                    <el-option
                                        v-for="item in evaluateTypeOpts"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>{{scope.row.type}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="is_open"
                        label="配置类型"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-select
                                    @change="searchDataChange"
                                    v-model="params.configType"
                                    placeholder="请选择"
                                    size="mini"
                                    clearable>
                                    <el-option
                                        v-for="item in typeOpts"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>{{scope.row.config_type}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="is_open"
                        label="星级"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-select
                                    @change="searchDataChange"
                                    v-model="params.gradeLevels"
                                    placeholder="请选择"
                                    size="mini"
                                    clearable>
                                    <el-option
                                        v-for="item in starOpts"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>{{scope.row.grade_levels}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="creator"
                        label="文案"
                        min-width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-input
                                    clearable
                                    class="width-full"
                                    v-model="params.name"
                                    size="mini"
                                    @change="searchDataChange"
                                    placeholder="输入文案搜索"/>
                            </div>
                            <div v-else>{{scope.row.name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="is_open"
                        label="显示/隐藏"
                        min-width="50">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-select
                                    clearable
                                    @change="searchDataChange"
                                    v-model="params.isShow"
                                    placeholder="请选择"
                                    size="mini">
                                    <el-option
                                        v-for="item in showOpts"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>{{scope.row.is_show}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="update_auth"
                        label="操作"
                        min-width="100">
                        <template slot-scope="scope">
                            <div
                                class="edit-color"
                                v-if="scope.$index !== 0">
                                <span @click="goEdit(scope.row.id)">
                                    编辑
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    :hide-on-single-page="true"
                    class="pagination"
                    layout="prev, pager, next"
                    :page-size="limit"
                    :current-page.sync="currentPage"
                    @current-change="pageChange"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { EVALUATE_TYPE, EVALUATE_SET_TYPE, STAR_LEVEL, SHOW_HIDDEN } from './config/dataConfig'
import apiObj from './api/evaluate';
import { mapState } from 'vuex';
export default {
    name: 'evaluateSettingList',
    data() {
        return {
            // 加载
            loading: false,
            // 弹窗状态
            dialogStatus: false,
            // 弹窗中是否要启动
            openStatus: {},
            // 评价类型筛选项
            evaluateTypeOpts: EVALUATE_TYPE,
            // 配置类型筛选项
            typeOpts: EVALUATE_SET_TYPE,
            // 星级筛选项
            starOpts: STAR_LEVEL,
            // 是否展示
            showOpts: SHOW_HIDDEN,
            // 列表搜索条件
            params: {
                // 标签类型：1带看评价2无意向评价
                type: '',
                // 名称
                name: '',
                // 所属星级
                gradeLevels: '',
                // 是否默认显示：1显示2隐藏
                isShow: '',
                // 配置类型 1标签 2问题
                configType: ''
            },
            // 表格数据
            tableData: [],
            // 当前页数
            currentPage: 1,
            // 每页条数
            limit: 20,
            // 总条数
            total: 0
        }
    },
    created () {
        this.loading = true;
        // 权限是超级管理员
        if (this.role === 'admin') {
            // 初始化请求数据
            this.searchEvaluateList();
        }
    },
    computed: {
        ...mapState({
            // 权限： 总管理员
            role: state => state.role
        }),
        // 计算表格数据条数相关信息
        tableRowInfo() {
            return {
                start: (this.currentPage - 1) * this.limit + 1,
                end: Math.min(this.total, (this.currentPage - 1) * this.limit + this.limit)
            };
        }
    },
    methods: {
        // 搜索配置页列表数据
        pageChange() {
            this.searchEvaluateList();
        },
        // 列表搜索条件变更
        searchDataChange() {
            this.currentPage = 1;
            this.searchEvaluateList();
        },
        // 搜索配置页列表
        async searchEvaluateList() {
            try {
                this.loading = true;
                let tempData = this.params;
                let params = {
                    type: tempData.type,
                    name: tempData.name,
                    grade_levels: tempData.gradeLevels,
                    is_show: tempData.isShow,
                    config_type: tempData.configType,
                    page: this.currentPage
                };
                let { data } = await apiObj.evaluateSettingList(params);
                if (data.code === 0) {
                    // 赋值表格数据
                    this.tableData = data.data.list ? data.data.list : [];
                    // 添加一行空内容用来处理搜索项
                    this.tableData.unshift({});
                    // 处理总条数
                    this.total = (data.data.total && Number(data.data.total)) || 0;
                }
                // 关闭loading
                this.loading = false;
            } catch (error) {
                console.log(error);
                // 关闭loading
                this.loading = false;
            }
        },
        /**
         * @description: 前往编辑页面
         * @param {string} id 标签id
         */
        goEdit(id) {
            this.$router.push({
                path: '/evaluate/editSetting',
                query: {
                    setId: id
                }
            });
        }
    },
    watch: {
        // role 是异步调取的，所以监听role的改变
        role: {
            handler: function (val, oldval) {
                // 总管理员权限时加载列表
                if (val === 'admin') {
                    // 初始化请求数据
                    this.searchEvaluateList();
                } else {
                    // 非总管理员跳转权限页面
                    this.$router.push({path: '/noPermissions'});
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.auto-group-wrap {
    padding: 0 20px 30px;
    /deep/.start-dialog {
        .el-dialog__header {
            text-align: center;
            span {
                font-size: 18px;
            }
            .el-dialog__headerbtn {
                display: none;
            }
        }
        .el-dialog__body {
            padding: 20px 20px;
        }
        .el-dialog__footer {
            text-align: center;
        }
    }
    /deep/.el-table {
        th, td {
            text-align: center;
        }
        .edit-color {
            cursor: pointer;
            color: #409eff;
        }
    }
    .table-top-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .add-config {
        text-align: right;
        margin-bottom: 10px;
    }
    .pagination {
        margin-top: 10px;
        text-align: center;
    }
    .width-full {
        width: 100%;
    }
}

</style>
