<!--
 * @Name:  响应差2.0
 * @Description:  响应差2.0
 * @Author: kangxue
 * @Date: 2020-05-11
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>响应任务管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box"
            v-loading="loading">
            <div class="search-box">
                <span>来电时间：</span>
                <el-date-picker v-model="searchDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="changeSelect"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="main-title">响应客户管理</div>
            <div class="statistics-box">
                <ul class="s-query clearfix">
                    <li>处理中：{{processingCount}}</li>
                    <li>已延迟：{{delayedCount}}</li>
                    <li>正常跟进完成：{{followCount}}</li>
                    <li>延迟跟进完成：{{delayCount}}</li>
                </ul>
            </div>
            <div class="table-box">
                <el-table border
                    :data="tableList"
                    size="small"
                    row-class-name="row"
                    cell-class-name="column"
                    :highlight-current-row="true"
                    :header-cell-style="{'background': '#f8f8f8'}">
                    <el-table-column min-width="110"
                        align="center"
                        prop="city_id">
                        <template slot="header">
                            <span class="sub-title">城市</span>
                            <!-- 城市下拉搜索 -->
                            <el-select v-model="searchForm.cityId"
                                filterable
                                clearable
                                placeholder="请选择"
                                @change="changeSelect">
                                <el-option v-for="item in cityOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="130"
                        align="center"
                        prop="org_name">
                        <template slot="header">
                            <span class="sub-title">公司</span>
                            <el-select
                                clearable
                                v-model="companyVal"
                                filterable
                                remote
                                :remote-method="companyQuery"
                                @focus="focusCompany"
                                @change="changeSelect"
                                placeholder="请选择公司">
                                <el-option
                                    v-for="item in companyData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120"
                        align="center">
                        <template slot="header">
                            <span class="sub-title">订单</span>
                            <el-input v-model="searchForm.orderId"
                                placeholder="请输入"
                                @blur="changeSelect"></el-input>
                        </template>
                        <template slot-scope="scope">
                            <a :href="scope.row.order_view_url"
                                target="_blank"
                                rel="noopener noreferrer">
                                <el-button type="text"
                                    size="small">
                                    {{scope.row.order_id}}
                                </el-button>
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="客户姓名"
                        min-width="90"
                        align="center"
                        prop="user_realname">
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="order_status">
                        <template slot="header">
                            <span class="sub-title">订单状态</span>
                            <!-- 订单状态搜索 -->
                            <el-select v-model="searchForm.orderState"
                                placeholder="请选择"
                                clearable
                                @change="changeSelect">
                                <el-option v-for="item in orderStateOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="employee_id">
                        <template slot="header">
                            <span class="sub-title">所属咨询师</span>
                            <!-- 所有咨询师搜索 -->
                            <search-select-radio class="search-select"
                                v-model="searchForm.belongId"
                                placeholder="请选择"
                                :clearable="true"
                                :apiInfo="userApi"
                                @input="changeSelect"></search-select-radio>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="employee_manager_id">
                        <template slot="header">
                            <span class="sub-title">咨询主管</span>
                            <!-- 咨询师主管搜索 -->
                            <search-select-radio class="search-select"
                                v-model="searchForm.managerId"
                                placeholder="请选择"
                                :clearable="true"
                                :apiInfo="managerApi"
                                @input="changeSelect"></search-select-radio>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="see_employee">
                        <template slot="header">
                            <span class="sub-title">带看咨询师</span>
                            <!-- 所有咨询师搜索 -->
                            <search-select-radio class="search-select"
                                v-model="searchForm.bandId"
                                placeholder="请选择"
                                :clearable="true"
                                :apiInfo="userApi"
                                @input="changeSelect"></search-select-radio>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="maintion_employee">
                        <template slot="header">
                            <span class="sub-title">共同维护人</span>
                            <!-- 所有咨询师搜索 -->
                            <search-select-radio class="search-select"
                                v-model="searchForm.preserveId"
                                placeholder="请选择"
                                :clearable="true"
                                :apiInfo="userApi"
                                @input="changeSelect"></search-select-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="来电时间"
                        min-width="90"
                        align="center"
                        prop="call_begin_time">
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="follow_status">
                        <template slot="header">
                            <span class="sub-title">跟进状态</span>
                            <!-- 跟进状态搜索 -->
                            <el-select v-model="searchForm.followState"
                                placeholder="请选择"
                                clearable
                                @change="changeSelect">
                                <el-option v-for="item in followOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="110"
                        align="center"
                        prop="follow_employee_name">
                        <template slot="header">
                            <span class="sub-title">跟进人</span>
                            <!-- 根据角色获取组织下咨询师搜索 -->
                            <search-select-radio class="search-select"
                                v-model="searchForm.followId"
                                placeholder="请选择"
                                :clearable="true"
                                :apiInfo="followApi"
                                @input="changeSelect"></search-select-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进时间"
                        min-width="90"
                        align="center"
                        prop="update_datetime">
                    </el-table-column>
                    <el-table-column v-if="showOpt"
                        label="操作"
                        fixed="right"
                        min-width="120"
                        align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.update_auth"
                                @click.native.prevent="updateFollow(scope.row.id,scope.row.order_id, scope.row.user_realname, scope.row.call_begin_time, scope.row.follow_employee_id, scope.row.follow_employee_name)"
                                type="text"
                                size="small">
                                修改跟进人
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        :hide-on-single-page="true"
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
        <!-- 判断是否可休息 -->
        <el-dialog custom-class="common-dialog-wrapper"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            class="rest-dialog"
            center
            title="修改跟进人"
            width="580px">
            <div class="body-box">
                <div class="dialog-info">
                    <span>订单：{{dialogInfo.orderId}}</span>
                    <span>客户姓名：{{dialogInfo.name}}</span>
                    <span>来电时间：{{dialogInfo.time}}</span>
                </div>
                <div class="dialog-info">
                    跟进咨询师：
                    <search-select-radio class="dialog-search-select"
                        v-model="followId"
                        placeholder="请选择"
                        :apiInfo="followApi"
                        :chosenObj="chosenObj"></search-select-radio>
                    跟进咨询师会成为订单共同维护人
                </div>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <div>
                    <el-button class="cancel"
                        @click="close">取消</el-button>
                    <el-button class="confirm"
                        type="primary"
                        @click="confirmUpdate">确定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api/api';
    import commonApi from '@/api/commonApi';
    import { SearchSelectRadio } from '@/components';
    export default {
        data() {
            return {
                // 日期
                searchDate: [],
                // 城市
                cityId: '',
                // 处理中
                processingCount: '',
                // 已延迟
                delayedCount: '',
                // 正常跟进完成
                followCount: '',
                // 延迟跟进完成
                delayCount: '',
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
                // 城市下拉
                cityOptions: [],
                // 所有咨询师下拉
                userApi: {
                    api: commonApi.getStaffList,
                    params: {
                        q: '',
                        role: 'header'
                    }
                },
                // 咨询师主管下拉
                managerApi: {
                    api: commonApi.getStaffList,
                    params: {
                        q: '',
                        role: 'header_manager'
                    }
                },
                // 根据登录角色获取员工下拉接口
                followApi: {
                    api: commonApi.getStaffByLogin,
                    params: {
                        q: ''
                    }
                },
                // 订单状态数组
                orderStateOptions: [],
                // 跟进状态数组
                followOptions: [],
                // 搜索条件
                searchForm: {
                    // 城市
                    cityId: '',
                    // 订单
                    orderId: '',
                    // 订单状态
                    orderState: '',
                    // 所属咨询师
                    belongId: '',
                    // 咨询主管
                    managerId: '',
                    // 带看咨询师
                    bandId: '',
                    // 共同维护人
                    preserveId: '',
                    // 跟进状态
                    followState: '',
                    // 跟进人
                    followId: ''
                },
                // 最后一列是否展示
                showOpt: true,
                // 弹窗默认的跟进人
                chosenObj: {},
                // 弹层展示
                dialogShow: false,
                // 弹层展示信息
                dialogInfo: {},
                // 弹窗中的跟进咨询师
                followId: '',
                // 公司下拉
                companyVal: '',
                companyData: []
            };
        },
        components: {
            SearchSelectRadio
        },
        methods: {
            /**
             * @description: 公司下拉--加盟组织需求添加
             * @param {string} q 搜索内容
             * @return {type} 
             */
            async companyQuery(query) {
                try {
                    let params = {
                        q: query
                        }
                        let {
                            data: {
                            code,
                            data
                        }} = await api.getCompanyData(params);
                        if (code === 0) {
                            this.companyData = data.list;
                        }
                    }
                    catch(error) {
                        console.log(error)
                    }
            },
            // 公司获取焦点
            focusCompany() {
                this.companyQuery('');
            },
            // 下拉搜索
            changeSelect() {
                this.getList(1);
            },
            // 获取城市
            async getCityList() {
                try {
                    let params = {
                        type: 2,
                        param: 'withAll'
                    };
                    const {
                        data: { code, data }
                    } = await commonApi.getDetailCityListData(params);
                    if (code === 0) {
                        this.cityOptions = data.list;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 获取列表
             * @param {String} page 页码
             */
            async getList(page) {
                this.currentPage = page;
                try {
                    this.loading = true;
                    let params = {
                        page: this.currentPage,
                        city_id: this.searchForm.cityId,
                        order_id: this.searchForm.orderId,
                        order_status: this.searchForm.orderState,
                        employee_id: this.searchForm.belongId,
                        employee_manager_id: this.searchForm.managerId,
                        follow_status: this.searchForm.followState,
                        follow_employee_id: this.searchForm.followId,
                        see_employee_id: this.searchForm.bandId,
                        maintain_employee_id: this.searchForm.preserveId,
                        call_begin_time_min: this.searchDate ? this.searchDate[0] : '',
                        call_begin_time_max: this.searchDate ? this.searchDate[1] : '',
                        org_id: this.companyVal
                    };
                    const {
                        data: { code, data }
                    } = await api.getTaskList(params);
                    if (code === 0) {
                        // 统计数据
                        this.processingCount = data.statisticsData.prossing;
                        this.delayedCount = data.statisticsData.delay;
                        this.followCount = data.statisticsData.complate_normal;
                        this.delayCount = data.statisticsData.complate_delay;
                        // 表格筛选的下拉选项
                        this.orderStateOptions = data.statusList;
                        this.followOptions = data.followStatusList;
                        // 表格数据
                        this.tableList = data.list;
                        this.totalNum = data.total ? parseInt(data.total) : 0;
                        this.showOpt = data.update_role_auth;
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 表格翻页
             * @param {Object} para 页码
             */
            pageChange(para) {
                this.getList(para);
            },
            /**
             * 修改跟进人
             * @param {String} id 任务ID
             * @param {String} orderId 订单ID
             * @param {String} name 客户姓名
             * @param {String} time 来电时间
             * @param {String} followId  跟进人id
             * @param {String} followName 跟进人名字
             */
            updateFollow(id, orderId, name, time, followId, followName) {
                this.dialogInfo = {
                    id: id,
                    orderId: orderId,
                    name: name,
                    time: time
                };
                this.followId = followId;
                this.chosenObj = {
                    value: followId,
                    name: followName
                };
                this.dialogShow = true;
            },
            // 弹层关闭
            close() {
                this.dialogShow = false;
            },
            // 弹窗点击确定修改跟进人
            async confirmUpdate() {
                if (!this.followId) {
                    this.$message.error('请选择跟进咨询师');
                    return false;
                } else {
                    try {
                        let params = {
                            id: this.dialogInfo.id,
                            employee_id: this.followId
                        };
                        const {
                            data: { code, msg }
                        } = await api.saveFollow(params);
                        if (code === 0) {
                            this.dialogShow = false;
                            this.getList(1);
                        } else {
                            this.$message.error(msg);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        },
        created() {
            // 获取列表
            this.getCityList();
            this.getList(1);
        }
    };
</script>

<style lang="less" scoped>
.v-box {
    background: #fff;
    padding: 20px;
    .main-title {
        font-weight: bold;
        font-size: 16px;
        padding-bottom: 20px;
    }
    .search-box {
        float: right;
        .s-query li {
            .th {
                width: auto;
            }
            .td {
                padding-right: 20px;
                .el-select {
                    width: 100%;
                }
            }
        }
    }
    .statistics-box {
        background: #f8f8f8;
        padding: 10px 0 10px 20px;
        border: 1px solid #eee;
        margin: 20px 0;
        .s-query {
            li {
                width: auto;
                padding-right: 50px;
                margin: 0;
                &.pull-right {
                    float: right;
                }
            }
        }
    }
    .table-box {
        .sub-title {
            line-height: 1.4;
            padding: 5px 0;
        }
        /deep/ .el-input,
        /deep/ .el-select {
            display: block;
            padding-left: 0;
            padding-right: 0;
        }
        .search-select {
            display: block;
            padding: 0;
            /deep/ .el-input {
                padding-left: 0;
                padding-right: 0;
            }
        }
    }
    .pagination {
        text-align: center;
        margin-top: 10px;
    }
    .el-range-input {
        background: transparent;
    }
}
.dialog-info {
    margin-bottom: 20px;
    span {
        display: inline-block;
        padding-right: 20px;
    }
}
.dialog-search-select {
    display: inline-block;
}
</style>