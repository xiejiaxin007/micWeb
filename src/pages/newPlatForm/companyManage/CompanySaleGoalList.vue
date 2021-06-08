<!--
 * @author: hewei
 * @Date: 2020-09-17 10:20:54
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-20 18:17:22
 * @description: 公司上户目标列表
-->
<template>
    <div class="sale-goal">
        <!---面包屑--->
        <el-breadcrumb
            class="bread-crumb"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item>公司上户目标</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main-wrap">
            <!--form 表单-->
            <el-form
                :inline="true"
                :model="saleForm"
                ref="saleForm"
                class="sale-form">
                <el-form-item
                    label="公司："
                    prop="company">
                    <el-select
                        filterable
                        clearable
                        v-model="saleForm.company"
                        placeholder="请选择">
                        <el-option
                            v-for="item in companyList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="城市："
                    prop="cityId">
                    <el-select
                        filterable
                        clearable
                        v-model="saleForm.cityId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="选择月份："
                    prop="month">
                    <el-date-picker
                        v-model="saleForm.month"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="btn-box">
                    <el-button
                        type="primary"
                        @click="onSubmit">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
            <!--表格部分-->
            <div class="table-box">
                <div class="operate-box">
                    <el-button
                        type="primary"
                        v-loading.fullscreen.lock="loading"
                        @click="editGoal('')">
                        + 添加目标
                    </el-button>
                </div>
                <el-table
                    class="subscribe-table"
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%">
                    <el-table-column
                        v-for="(item, index) in tableCols"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label">
                    </el-table-column>
                    <el-table-column
                        width="180"
                        label="操作">
                        <template v-slot="{row}">
                            <el-button
                                type="text"
                                size="medium"
                                @click="editGoal(row.id)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination
                    class="page-wrap"
                    :current-page.sync="pages.currentPage"
                    :page-size="pages.pageSize"
                    hide-on-single-page
                    background
                    layout="prev, pager, next"
                    :total="pages.total"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
        
    </div>
</template>

<script>
    import api from './api/saleGoal';
    import commonApi from './api/common';
    // 定义表单字段
    const tableConf = [
        { label: '公司', prop: 'org_name' },
        { label: '接受订单城市', prop: 'city_name' },
        { label: '月份', prop: 'month' },
        { label: '月目标上户量', prop: 'total_target_value' }
    ];
    export default {
        name: 'CompanySaleGoalList',
        data() {
            return {
                // 加载loading
                loading: false,
                // 表单对象
                saleForm: {
                    company: '',
                    cityId: '',
                    month: ''
                },
                // 公司下拉
                companyList: [],
                // 城市下拉
                cityList: [],
                // 表格数据
                tableData: [],
                // 表格列数据
                tableCols: tableConf,
                // 分页数据
                pages: {
                    // 每页条数
                    pageSize: 20,
                    // 当前页
                    currentPage: 1,
                    // 总条数
                    total: 0
                },
            }
        },
        mounted() {
            // 获取城市下拉
            this.getCityList();
            // 获取公司下拉列表
            this.getCompanyList();
            // 获取上户列表信息
            this.getSaleGoalList();
        },
        methods: {
            // 查询
            onSubmit() {
                this.pages.currentPage = 1;
                this.getSaleGoalList();
            },
            // 获取上户列表信息
            async getSaleGoalList() {
                try {
                    this.loading = true;
                    const options = {
                        org_id: this.saleForm.company,
                        month: this.saleForm.month,
                        city_id: this.saleForm.cityId,
                        page: this.pages.currentPage,
                        page_size: this.pages.pageSize
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await api.getOrgReceiveOrderList(options);
                    this.loading = false;
                    if (code === 0) {
                        this.tableData = data.list;
                        this.pages.total = Number(data.total_num);
                    }
                } catch (error) {
                    console.warn(error);
                    this.loading = false;
                }
            },
            /**
             * @description: 页码改变加载数据
             * @param {Number} page 页码 
             * @return {undefind} undefind
             */
            handleCurrentChange(page) {
                this.pages.currentPage = page;
                this.getSaleGoalList();
            },
            // 表单重置
            resetForm() {
                this.pages.currentPage = 1;
                this.$refs.saleForm.resetFields();
                this.getSaleGoalList();
            },
            /**
             * @description: 添加上户目标
             * @param {String} id 目标id
             */
            editGoal(id) {
                this.$router.push({
                    name: 'AddSaleGoal',
                    query: { id }
                });
            },
            // 获取下拉城市
            async getCityList() {
                try {
                    const {
                        data: {
                            data
                        }
                    } = await commonApi.getAllCityData();
                    this.cityList = data || [];
                } catch (error) {
                    console.warn(error);
                }
            },
            // 获取公司下拉
            async getCompanyList() {
                try {
                    const query = {
                        is_without_julive: false,
                        q: ''
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getDepartList(query);
                    if (code === 0) {
                        this.companyList = data || [];
                    }
                } catch (error) {
                    console.warn(error);
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .sale-goal {
        padding: 20px 30px;
        .normal-input {
            width: 200px;
        }
    }
    .main-wrap {
        margin-top: 20px;
        padding: 25px 30px 20px;
        background-color: #fff;
        .table-box {
            margin-top: 10px;
        }
        .subscribe-table {
            margin-top: 15px;
        }
        .btn-box {
            display: block;
            text-align: center;
        }
    }
    .page-wrap {
        text-align: center;
        margin-top: 15px;
    }
</style>