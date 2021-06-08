<!--
 * @Author: xie bin
 * @Date: 2020-09-17 09:45:41
 * @LastEditTime: 2021-03-18 18:15:43
 * @LastEditors: kangxue
 * @Description: 人员列表
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/PeopleList.vue
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
            <el-breadcrumb-item>人员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-box">
            <el-form
                :inline="true"
                :model="peopleFrom"
                ref="peopleForm">
                <el-form-item
                    label="人员ID："
                    prop="peopleId">
                    <el-input
                        v-model="peopleFrom.peopleId"
                        placeholder="请输入公司ID">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="公司："
                    prop="companyVal">
                    <el-select
                        v-model="peopleFrom.companyVal"
                        placeholder="请选择公司"
                        filterable
                        clearable
                        @focus="getCompanyListSelData">
                        <el-option
                            v-for="item in peopleFrom.companyData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="人员姓名："
                    prop="peopleName">
                    <el-input
                        v-model="peopleFrom.peopleName"
                        placeholder="请输入人员姓名">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="工号："
                    prop="jobNumber">
                    <el-input
                        v-model="peopleFrom.jobNumber"
                        placeholder="请输入工号">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="岗位："
                    prop="jobVal">
                    <el-select
                        v-model="peopleFrom.jobVal"
                        placeholder="请选择岗位"
                        clearable>
                        <el-option
                            v-for="item in peopleFrom.jobDataList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="手机号："
                    prop="phoneNum">
                    <el-input
                        v-model="peopleFrom.phoneNum"
                        placeholder="请输入手机号">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="状态："
                    prop="peopleStatus">
                    <el-select
                        v-model="peopleFrom.peopleStatus"
                        placeholder="状态"
                        clearable>
                        <el-option
                            v-for="item in peopleFrom.peopleData"
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
                <el-button @click="resetForm('peopleForm')">重置</el-button>
            </div>
            <div class="table-box">
                <el-button
                    type="primary"
                    @click="addPeople">
                    +添加人员
                </el-button>
                <el-table
                    :data="peopleTableData"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="人员ID">
                    </el-table-column>
                    <el-table-column
                        prop="team_name"
                        label="公司">
                    </el-table-column>
                    <el-table-column
                        prop="employee_name"
                        label="人员姓名">
                    </el-table-column>
                    <el-table-column
                        prop="job_number"
                        label="工号">
                    </el-table-column>
                    <el-table-column
                        prop="post_name"
                        label="岗位">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="手机号">
                    </el-table-column>
                    <el-table-column
                        prop="status_desc"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="editorPeople(scope.row.id)">
                                编辑
                            </el-button>
                            <el-button
                                v-show="scope.row.status == '1'"
                                type="text"
                                size="small"
                                @click="getPeopleOpenApi(scope.row.id, scope.row.status)">
                                关闭
                            </el-button>
                            <el-button
                                v-show="scope.row.status == '0'"
                                type="text"
                                size="small"
                                @click="getPeopleOpenApi(scope.row.id, scope.row.status)">
                                开启
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
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
import peopleListApi from './api/peopleList'
export default {
    data() {
        return {
            // 人员表单
            peopleFrom: {
                // 人员ID 
                peopleId: '',
                // 人员姓名
                peopleName: '',
                // 公司
                companyVal: '',
                companyData: [],
                // 工号
                jobNumber: '',
                // 岗位
                jobVal: '',
                jobDataList: [],
                // 手机号
                phoneNum: '',
                // 人员状态
                peopleStatus: '',
                peopleData: []
            },
            // 人员表格
            peopleTableData: [],
            // loading
            loading: false,
            // 分页
            pagination: {
                total: 0,
                currentPage: 1,
                pageSize: 20
            },
        }
    },
    mounted() {
        // 公司下拉接口
       this.getCompanyListSelData();
        // 岗位下拉接口
       this.getCompanyJobSelData();
        // 公共接口
       this.getCommonAPi();
        // 公司列表接口
       this.getPeopleListApi();
    },
    methods: {
        // 公共接口
        async getCommonAPi() {
            try {
                let params = {
                    type: ['employee_status']
                }
                let { data: {
                    code,
                    data
                } } = await peopleListApi.getCompanyCommonData(params);
                console.log(data)
                if (code === 0) {
                    // 人员状态
                    this.peopleFrom.peopleData = data.employee_status;
                    this.peopleFrom.peopleData.unshift({
                        name: '全部',
                        value: ''
                    });
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 公司下拉接口
        async getCompanyListSelData() {
            try {
                let params = {
                    q: ''
                }
                let { data: {
                    code,
                    data
                } } = await peopleListApi.getCompanyListData(params);
                console.log(data)
                if (code === 0) {
                    // 公司下拉
                    this.peopleFrom.companyData = data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 岗位下拉接口
        async getCompanyJobSelData() {
            try {
                let { data: {
                    code,
                    data
                } } = await peopleListApi.getCompanyJobData();
                console.log(data)
                if (code === 0) {
                    // 岗位状态
                    this.peopleFrom.jobDataList = data;
                    this.peopleFrom.jobDataList.unshift({
                        name: '全部',
                        value: ''
                    });
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取人员列表接口
        async getPeopleListApi() {
            try {
                this.loading = true;
                let params = {
                    id: this.peopleFrom.peopleId,
                    org_id: this.peopleFrom.companyVal,
                    u_name: this.peopleFrom.peopleName,
                    job_number: this.peopleFrom.jobNumber,
                    post_id: this.peopleFrom.jobVal,
                    mobile: this.peopleFrom.phoneNum,
                    status: this.peopleFrom.peopleStatus,
                    page: this.pagination.currentPage,
                    page_size: this.pagination.pageSize
                }
                let { data: {
                    code,
                    data
                } } = await peopleListApi.getPeopleListData(params);
                if (code === 0) {
                    this.peopleTableData = data.list;
                    this.pagination.total = data.total_num;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            }
            catch(error) {
                this.loading = false;
                console.log(error);
            }
        },
        /**
         * @description: 公司列表禁用&开启接口
         * @param {Number} status 当前状态
         * @return {type} 
         */
        async getPeopleOpenApi(peopleId, status) {
            try {
                let params = {
                    id: peopleId,
                    status: status == '1' ? '0' : '1'
                }
                let { data: {
                    code,
                    msg
                } } = await peopleListApi.getPeopleOpenData(params);
                if (code === 0) {
                    this.getPeopleListApi();
                } else {
                    this.$message(msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 页码发生改变的时候
         * @param {Number} val 当前的页码
         * @return {type} 
         */
        pageChange(val) {
            this.pagination.currentPage = val;
            this.getPeopleListApi();
        },
        // 搜索
        searchQuery() {
            this.pagination.currentPage = 1;
            this.getPeopleListApi();
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.pagination.currentPage = 1;
            // 获取公司列表接口
            this.getPeopleListApi();
        },
        // 添加人员
        addPeople() {
            this.$router.push({
                path: '/companyManage/addEmployee'
            })
        },
        // 编辑人员
        editorPeople(peopleId) {
            this.$router.push({
                path: '/companyManage/addEmployee',
                query: {
                    id: peopleId
                }
            })
        }
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
        .table-box {
            /deep/ .el-button {
                margin: 20px 10px 20px 0;
            }
        }
        .pagination {
            text-align: center;
            margin-top: 20px;
        }
    }
}
</style>