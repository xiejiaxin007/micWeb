<!--
 * @Author: xie bin
 * @Date: 2020-11-10 11:09:38
 * @LastEditTime: 2021-01-20 18:19:11
 * @LastEditors: kangxue
 * @Description: 优先级配置列表
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/PriorityConfigList.vue
-->
<template>
<div
    class="virtual-box"
    v-loading.fullscreen.lock="loading">
    <!---面包屑--->
        <el-breadcrumb class="bread-crumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item>上户优先级</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-box">
            <el-form
                :inline="true"
                :model="priorityFrom"
                ref="priorityFrom">
                <el-form-item
                    label="公司："
                    prop="companyVal">
                    <el-select
                        v-model="priorityFrom.companyVal"
                        placeholder="请选择公司"
                        clearable
                        filterable>
                        <el-option
                            v-for="item in priorityFrom.companyData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="城市："
                    prop="cityVal">
                    <el-select
                        v-model="priorityFrom.cityVal"
                        placeholder="请选择城市"
                        clearable
                        filterable>
                        <el-option
                            v-for="item in priorityFrom.cityData"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="状态："
                    prop="companyStatusVal">
                    <el-select
                        v-model="priorityFrom.companyStatusVal"
                        placeholder="请选择状态"
                        clearable>
                        <el-option
                            v-for="item in priorityFrom.companyStatusData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 搜索按钮 -->
            <div class="btn-box">
                <el-button
                    type="primary"
                    @click="searchQuery">
                    搜索
                </el-button>
                <el-button @click="resetForm('priorityFrom')">重置</el-button>
            </div>
            <div class="add-config-box">
                <el-button
                    type="primary"
                    @click="addCofigPage">
                    + 添加配置
                </el-button>
            </div>
            <div class="table-box">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="priority"
                        label="优先级">
                    </el-table-column>
                    <el-table-column
                        prop="org_name"
                        label="公司名称">
                    </el-table-column>
                    <el-table-column
                        prop="city_name"
                        label="订单上户城市">
                    </el-table-column>
                    <el-table-column
                        prop="status_name"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="editorPage(scope.row.id)">
                                编辑
                            </el-button>
                            <el-button
                                v-show="scope.row.status == '1'"
                                type="text"
                                size="small"
                                @click="closeOrderInfo(scope.row.status, scope.row.id)">
                                关闭
                            </el-button>
                            <el-button
                                v-show="scope.row.status == '2'"
                                type="text"
                                size="small"
                                @click="editorPage(scope.row.id)">
                                开启
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    hide-on-single-page
                    layout="prev, pager, next"
                    :total="pagination.total"
                    :page-size="pagination.pageSize"
                    :current-page="pagination.currentPage"
                    @current-change="pageChange">
                </el-pagination>
            </div>
        </div>
</div>
</template>

<script>
import commonApi from './api/common';
import priorityApi from './api/companyManageList';
export default {
    name: 'PriorityConfigList',
    data() {
        return {
            // 公司表单
            priorityFrom: {
                // 公司val
                companyVal: '',
                companyData: [],
                // 城市val
                cityVal: '',
                cityData: [],
                // 公司状态
                companyStatusVal: '',
                companyStatusData: []
            },
            // 表格数据
            tableData: [
                {
                    "id":"1",
                    "city_id":"2",
                    "org_id":"48",
                    "priority":"1",
                    "status":"1",
                    "status_name":"1",
                    "city_name":"北京",
                    "org_name":"居理科技"
                }
            ],
            // 分页
            pagination: {
                total: 0,
                currentPage: 1,
                pageSize: 20
            },
            // loading
            loading: false,
        }
    },
    mounted() {
        // 公共接口
        this.getCommonAPi();
        // 获取城市下拉
        this.getCityData();
        // 获取公司下拉
        this.getCompanyData();
        // 获取优先级配置列表
        this.getPriorityListApi();
    },
    methods: {
        // 公共接口
        async getCommonAPi() {
            try {
                let params = {
                    type: ['org_priority_status']
                }
                let { data: {
                    code,
                    data
                } } = await priorityApi.getCompanyCommonData(params);
                console.log(data)
                if (code === 0) {
                    // 公司状态
                    this.priorityFrom.companyStatusData = data.org_priority_status;
                    this.priorityFrom.companyStatusData.unshift({
                        name: '全部',
                        value: ''
                    });
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取城市下拉
        async getCityData() {
            try {
                let params = {
                    q: ''
                }
                let {data: {
                    data,
                    code
                }} = await commonApi.getAllCityData(params);
                if (code === 0) {
                    // 获取城市下拉
                    this.priorityFrom.cityData = data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取公司下拉
        async getCompanyData() {
            try {
                let params = {
                    q: '',
                    is_without_julive: false
                }
                let {data: {
                    data,
                    code
                }} = await commonApi.getDepartList(params);
                if (code === 0) {
                    // 获取城市下拉
                    this.priorityFrom.companyData = data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 搜索
        searchQuery() {
            this.pagination.currentPage = 1;
            this.getPriorityListApi();
        },
        // 获取优先级配置列表
        async getPriorityListApi () {
            try {
                this.loading = true;
                let params = {
                    org_id: this.priorityFrom.companyVal,
                    city_id: this.priorityFrom.cityVal,
                    status: this.priorityFrom.companyStatusVal,
                    page: this.pagination.currentPage,
                    page_size: this.pagination.pageSize
                }
                let { data: {
                    code,
                    data,
                    msg
                } } = await priorityApi.getPriorityListData(params);
                    console.log(data, code);
                if (code === 0) {
                    this.tableData = data.list;
                    this.pagination.total = data.total_num;
                    this.loading = false;
                } else {
                    this.$message(msg);
                    this.loading = false;
                }
            }
            catch(error) {
                console.log(error);
                this.loading = false;
            }
        },
        /**
         * @description: 关闭订单城市按钮
         * @param {string} status 当前城市的状态
         * @param {string} id 当前配置的id
         * @return {*}
         */
        async closeOrderInfo(status, id) {
            try {
                let params = {
                    id,
                    status
                }
                let { data: {
                    code
                } } = await priorityApi.closeCityOrderData(params);
                if (code === 0 ) {
                    this.$message('关闭成功!');
                    this.getPriorityListApi();
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 编辑跳转
         * @param {string} id 当前配置的id
         * @return {*}
         */
        editorPage(id) {
            this.$router.push({
                path: '/companyManage/editPriorityConfig',
                query: {
                    id: id
                }
            })
        },
        addCofigPage() {
            this.$router.push({
                path: '/companyManage/editPriorityConfig'
            })
        },
        /**
         * @description: 页码发生改变的时候
         * @param {Number} val 当前的页码
         * @return {type} 
         */
        pageChange(val) {
            this.pagination.currentPage = val;
            this.getPriorityListApi();
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.pagination.currentPage = 1;
            this.getPriorityListApi();
        },
    }
}
</script>

<style lang="less" scoped>
.virtual-box {
    padding: 20px 50px;
    box-sizing: border-box;
    .content-box {
        background: #fff;
        padding: 20px 20px;
        margin-top: 20px;
        /deep/ .el-form-item {
            margin-right: 30px;
        }
        .btn-box {
            text-align: center;
        }
        /deep/ .el-pagination {
            margin-top: 20px;
            text-align: center;
        }
        .table-box {
            margin-top: 20px;
        }
    }
}
</style>