<!--
 * @author: wangxue
 * @Date: 2020-07-10 14:17:01
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 17:19:53
 * @description: 客诉问题管理页面
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>客诉问题管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box complain-list-box">
            <div class="hd">
                <h2>客诉问题管理</h2>
            </div>
            <div class="bd">
                <div class="order-search">
                    <!--查询需求-->
                    <ul class="s-query">
                        <li>
                            <div class="th">ID：</div>
                            <div class="td">
                                <el-input type="text"
                                    v-model="id"
                                    clearable></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">客户投诉时间：</div>
                            <div class="td">
                                <el-date-picker v-model="complaintStartTime"
                                    clearable
                                    class="form-date-range-box"
                                    type="daterange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </li>
                        <li>
                            <div class="th">处理结束时间：</div>
                            <div class="td">
                                <el-date-picker v-model="complaintEndTime"
                                    clearable
                                    class="form-date-range-box"
                                    type="daterange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </li>
                        <li>
                            <div class="th">投诉类型：</div>
                            <div class="td">
                                <el-select v-model="complaintType"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in complaintTypeList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">订单ID：</div>
                            <div class="td">
                                <el-input type="text"
                                    v-model="orderId"
                                    clearable></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">客户姓名：</div>
                            <div class="td">
                                <el-input type="text"
                                    v-model="customerName"
                                    clearable></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">客户电话：</div>
                            <div class="td">
                                <el-input type="text"
                                    v-model="customerPhone"
                                    clearable></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">咨询师：</div>
                            <div class="td">
                                <search-select-radio v-model="employeeId"
                                    :clearable="true"
                                    placeholder="请选择"
                                    :apiInfo="userApi">
                                </search-select-radio>
                            </div>
                        </li>
                        <li>
                            <div class="th">绩效责任上级：</div>
                            <div class="td">
                                <search-select-radio v-model="managerId"
                                    :clearable="true"
                                    placeholder="请选择"
                                    :apiInfo="userApi">
                                </search-select-radio>
                            </div>
                        </li>
                        <li>
                            <div class="th">城市：</div>
                            <div class="td">
                                <search-select-radio v-model="cityId"
                                    :clearable="true"
                                    placeholder="请选择"
                                    :apiInfo="cityApi">
                                </search-select-radio>
                            </div>
                        </li>
                        <li>
                            <div class="th">红黄线影响：</div>
                            <div class="td">
                                <el-select v-model="redYellowLine"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in redYellowLineList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">客诉来源：</div>
                            <div class="td">
                                <el-select v-model="complaintSource"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in complaintSourceList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">投诉原因：</div>
                            <div class="td">
                                <el-cascader v-model="complaintCause"
                                    class="reason-width"
                                    :options="complaintCauseList"
                                    separator=" > "
                                    :props="{ checkStrictly: true, label: 'name' }"
                                    clearable></el-cascader>
                            </div>
                        </li>
                        <li>
                            <div class="th">绩效影响：</div>
                            <div class="td">
                                <el-select v-model="performanceImpact"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in performanceImpactList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">当前处理人：</div>
                            <div class="td">
                                <search-select-radio v-model="currentHandle"
                                    :clearable="true"
                                    placeholder="请选择"
                                    :apiInfo="userApi">
                                </search-select-radio>
                            </div>
                        </li>
                        <li>
                            <div class="th">延迟情况：</div>
                            <div class="td">
                                <el-select v-model="delayStatus"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in delayStatusList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">是否万单问题：</div>
                            <div class="td">
                                <el-select v-model="isWandan"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in isWandanList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">客诉状态：</div>
                            <div class="td">
                                <el-select v-model="complaintStatus"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in complaintStatusList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
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
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <div class="total-box">
                            第{{countRange}}条，共{{total}}条数据
                        </div>
                        <div class="total-box">
                            <a :href="templateUrl"
                                class="el-button el-button--primary btn-link"
                                v-if="canImport">下载模板</a>
                            <el-upload
                                v-if="canImport"
                                ref="uploadBtn"
                                class="upload-file"
                                action
                                :http-request="beforeUpdata"
                                :show-file-list="false">
                                <el-button type="primary">导入客诉原因</el-button>
                            </el-upload>
                            <el-button type="primary"
                                @click="exportFile">导出</el-button>
                            <el-button type="primary"
                                v-if="canCreate"
                                @click="operation('/complaint/addComplaint')">新增</el-button>
                        </div>
                    </div>
                    <div class="table-wrap-box">
                        <el-table ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor">
                            <el-table-column min-width="80"
                                align="center"
                                prop="id"
                                label="ID">
                            </el-table-column>
                            <el-table-column min-width="150"
                                align="center"
                                prop="complaint_time"
                                label="客户投诉时间">
                            </el-table-column>
                            <el-table-column min-width="150"
                                align="center"
                                prop="complete_time"
                                label="处理结束时间">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="complaint_type"
                                label="投诉类型">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="order_id"
                                label="订单ID">
                                <template slot-scope="scope">
                                    <div class="blue-url"
                                        @click="toNewPage(scope.row.order_url)">
                                        {{scope.row.order_id}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="order_status"
                                label="订单状态">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="user_realname"
                                label="客户姓名">
                            </el-table-column>
                            <el-table-column min-width="120"
                                align="center"
                                prop="user_mobile"
                                label="客户电话">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="employee_name"
                                label="咨询师">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="adjust_leader_name"
                                label="绩效责任上级">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="city_name"
                                label="城市">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="red_yellow_influence"
                                label="红黄线影响">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="complaint_source"
                                label="客诉来源">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="complaint_category"
                                label="投诉对象">
                            </el-table-column>
                            <el-table-column min-width="80"
                                align="center"
                                prop="one_cause"
                                label="一级原因">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="two_cause"
                                label="二级原因">
                            </el-table-column>
                            <el-table-column min-width="150"
                                align="center"
                                prop="three_cause"
                                label="三级原因">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="adjust_influence"
                                label="绩效影响">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="follow_employee"
                                label="当前处理人">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="delay_info"
                                label="延迟情况">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="follow_result"
                                label="处理结果">
                                <template slot-scope="scope">
                                    <el-popover placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.follow_result">
                                        <div slot="reference"
                                            class="refuse-res">{{scope.row.follow_result}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="is_many_order"
                                label="是否万单问题">
                            </el-table-column>
                            <el-table-column min-width="120"
                                align="center"
                                prop="complaint_progress"
                                label="客诉状态">
                            </el-table-column>
                            <el-table-column min-width="150"
                                align="center"
                                fixed="right"
                                prop="operate"
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text"
                                        v-for="(item, index) in scope.row.actions"
                                        :key="index"
                                        @click="operationBtn(scope.row, item.value)">
                                        {{item.name}}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <el-pagination background
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            hide-on-single-page
                            :current-page.sync="page"
                            @current-change="searchData"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 变更跟进人 -->
        <el-dialog class="operation-dialog"
            title="变更跟进人"
            :visible.sync="operationData.isShow"
            width="420px"
            center>
            <el-form ref="operationData"
                :model="operationData"
                label-width="120px">
                <el-form-item label="变更后跟进人"
                    :rules="[{ required: true, validator: checkRes, trigger: ['blur', 'change']}]"
                    prop="currentHandle">
                    <search-select-radio v-model="operationData.currentHandle"
                        placeholder="请选择"
                        :apiInfo="userOnApi"
                        :chosenObj="operationData.currentHandleObj">
                    </search-select-radio>
                </el-form-item>
            </el-form>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="operationData.isShow = false">取 消</el-button>
                <el-button type="primary"
                    @click="submitForm">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import complaintApi from './api/complaint';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
import moment from 'moment';
export default {
    name: 'complain-list',
    components: {
        SearchSelectRadio
    },
    data() {
        return {
            // loading
            loading: false,
            // 任务id
            id: '',
            // 客诉产生时间
            complaintStartTime: [],
            // 处理结束时间
            complaintEndTime: [],
            // 投诉类型
            complaintType: '',
            // 订单ID：
            orderId: '',
            // 订单状态
            // orderStatus: '',
            // 客户姓名：
            customerName: '',
            // 客户电话：
            customerPhone: '',
            // 咨询师：
            employeeId: '',
            // 绩效责任上级：
            managerId: '',
            // 城市：
            cityId: '',
            // 红黄线影响：
            redYellowLine: '',
            // 客诉来源：
            complaintSource: '',
            // 投诉原因：
            complaintCause: '',
            // 绩效影响：
            performanceImpact: '',
            // 当前处理人：
            currentHandle: '',
            // 延迟情况：
            delayStatus: '',
            // 是否万单问题：
            isWandan: '',
            // 客诉状态：
            complaintStatus: '',
            // 投诉类型下拉
            complaintTypeList: [],
            // 订单状态下拉
            // orderStatusList: [],
            // 红黄线下拉
            redYellowLineList: [],
            // 客诉来源下拉
            complaintSourceList: [],
            // 延迟情况下拉
            delayStatusList: [],
            // 客诉状态下拉
            complaintStatusList: [],
            // 是否万单下拉
            isWandanList: [],
            // 绩效影响下拉
            performanceImpactList: [],
            // 投诉原因下拉
            complaintCauseList: [],
            // 每页数量
            pageSize: 20,
            // 页码
            page: 1,
            // 数据总量
            total: 0,
            // 表格数据
            tableList: [],
            // 城市远程下拉
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll',
                    all_text: '全国'
                }
            },
            // 咨询师，绩效责任上级，获取所有在职离职的人
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all',
                    status: '-1'
                }
            },
            // 变更跟进人，获取所有在职的人
            userOnApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all',
                    status: '1'
                }
            },
            // 变更跟进人弹窗数据
            operationData: {
                isShow: false,
                currentHandle: '',
                // 复制保存一份 与改变的做对比
                currentHandleCopy: '',
                currentHandleObj: {}
            },
            // 防止重复提交
            flag: true,
            // 变更跟进人初始进入不校验
            initDialog: false,
            // 是否可以创建
            canCreate: false,
            // 是否可以下载模板和导入原因
            canImport: false,
            // 模板下载链接
            templateUrl: ''
        };
    },
    created() {
        // 获取公共下拉
        this.getCommonOptions();
        // 初始化数据
        this.searchData(1);
    },
    methods: {
        // 获取公共下拉
        async getCommonOptions() {
            try {
                const {
                    data: { code, data }
                } = await complaintApi.commonOptions();
                if (code === 0) {
                    this.complaintTypeList = data.complaint_type;
                    this.redYellowLineList = data.red_yellow_line;
                    this.complaintSourceList = data.complaint_source;
                    this.delayStatusList = data.delay_status;
                    this.complaintStatusList = data.complaint_status;
                    this.isWandanList = data.is_wandan;
                    this.isWandanList.push({
                        name: '无',
                        value: '0'
                    });
                    this.performanceImpactList = data.performance_impact;
                    this.complaintCauseList = data.complaint_cause;
                    // this.orderStatusList = data.order_status;
                }
            } catch (error) {}
        },
        /**
         * 点击搜索
         * @params [string] page 页码
         */
        async searchData(page) {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            if (page) {
                this.page = page;
            }
            this.flag = false;
            this.loading = true;
            // 客诉产生时间 默认最近一年
            let lastYearData = moment().subtract(1, 'years').startOf('date').format('X');
            let todayData = moment().startOf('date').format('X');
            this.complaintStartTime = this.complaintStartTime ? this.complaintStartTime : [];
            this.complaintEndTime = this.complaintEndTime ? this.complaintEndTime : [];
            try {
                let params = {
                    id: this.id,
                    complaint_time_min: this.complaintStartTime[0] ? this.complaintStartTime[0] / 1000 : lastYearData,
                    complaint_time_max: this.complaintStartTime[1] ? this.complaintStartTime[1] / 1000 : todayData,
                    complete_time_min: this.complaintEndTime[0] ? this.complaintEndTime[0] / 1000 : '',
                    complete_time_max: this.complaintEndTime[1] ? this.complaintEndTime[1] / 1000 : '',
                    complaint_type: this.complaintType,
                    order_id: this.orderId,
                    user_realname: this.customerName,
                    user_mobile: this.customerPhone,
                    employee_id: this.employeeId,
                    adjust_leader_id: this.managerId,
                    city_id: this.cityId,
                    red_yellow_influence: this.redYellowLine,
                    complaint_source: this.complaintSource,
                    complaint_category: this.complaintCause[0] ? this.complaintCause[0] : '',
                    one_cause: this.complaintCause[1] ? this.complaintCause[1] : '',
                    two_cause: this.complaintCause[2] ? this.complaintCause[2] : '',
                    three_cause: this.complaintCause[3] ? this.complaintCause[3] : '',
                    adjust_influence: this.performanceImpact,
                    follow_employee: this.currentHandle,
                    delay_info: this.delayStatus,
                    is_many_order: this.isWandan,
                    complaint_progress: this.complaintStatus,
                    // order_status: this.orderStatus,
                    page: this.page
                };
                let {
                    data: { code, msg, data }
                } = await complaintApi.ywComplaintsList(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.total = Number(data.totalCount);
                    this.canCreate = data.can_create;
                    this.canImport = data.can_import;
                    this.templateUrl = data.import_template_url;
                } else {
                    this.$message(msg);
                }
                this.loading = false;
                this.flag = true;
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        // 点击重置
        resetSearch() {
            this.id = '';
            this.complaintStartTime = [];
            this.complaintEndTime = [];
            this.complaintType = '';
            this.orderId = '';
            // this.orderStatus = '';
            this.customerName = '';
            this.customerPhone = '';
            this.employeeId = '';
            this.managerId = '';
            this.cityId = '';
            this.redYellowLine = '';
            this.complaintCause = '';
            this.performanceImpact = '';
            this.currentHandle = '';
            this.delayStatus = '';
            this.isWandan = '';
            this.complaintStatus = '';
            this.complaintSource = '';
            this.searchData(1);
        },
        /**
         * 导入文件前校验
         * @param {Object} file 文件
         */
        beforeUpdata(file) {
            // 文件大小限制
            let isLt20M = file.file.size / 1024 / 1024 <= 20;
            let excelfileExtend = '.xlsx、.xls、.XLSX、.XLS'
            let fileExtend = file.file.name
                .substring(file.file.name.lastIndexOf('.'))
                .toLowerCase();
            if (excelfileExtend.indexOf(fileExtend) === -1) {
                this.$message.error(`只能上传${excelfileExtend}格式文件！`);
                return;
            } else if (!isLt20M) {
                this.$message.error('文件大小不超过20M！');
                return;
            }
            // 转换excel文件
            let fileR = new FileReader();
            fileR.readAsDataURL(file.file);
            fileR.onload = () => {
                let excelBase64Str = fileR.result;
                this.importExcelFile(excelBase64Str);
            };
        },
        /**
         * 导入文件
         * @param {string} excelBase64Str excel数据流
         */
        async importExcelFile(excelBase64Str) {
            excelBase64Str = excelBase64Str.substring(excelBase64Str.indexOf(',') + 1);
            try {
                let params = {
                    file_data: excelBase64Str
                };
                let { data } = await complaintApi.importReason(params);
                if (data.code === 0) {
                    this.$message(data.msg);
                } else {
                    this.$message.error(data.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 导出文件
        exportFile() {
            if (this.total > 6000) {
                this.$message('最多可导出6000条数据，请注意筛选数据结果数量，分批导出');
                return;
            }
            let lastYearData = moment().subtract(1, 'years').startOf('date').format('X');
            let todayData = moment().startOf('date').format('X');
            this.complaintStartTime = this.complaintStartTime ? this.complaintStartTime : [];
            this.complaintEndTime = this.complaintEndTime ? this.complaintEndTime : [];
            try {
                let params = {
                    id: this.id,
                    complaint_time_min: this.complaintStartTime[0] ? this.complaintStartTime[0] / 1000 : lastYearData,
                    complaint_time_max: this.complaintStartTime[1] ? this.complaintStartTime[1] / 1000 : todayData,
                    complete_time_min: this.complaintEndTime[0] ? this.complaintEndTime[0] / 1000 : '',
                    complete_time_max: this.complaintEndTime[1] ? this.complaintEndTime[1] / 1000 : '',
                    complaint_type: this.complaintType,
                    order_id: this.orderId,
                    user_realname: this.customerName,
                    user_mobile: this.customerPhone,
                    employee_id: this.employeeId,
                    adjust_leader_id: this.managerId,
                    city_id: this.cityId,
                    red_yellow_influence: this.redYellowLine,
                    complaint_source: this.complaintSource,
                    complaint_category: this.complaintCause[0] ? this.complaintCause[0] : '',
                    one_cause: this.complaintCause[1] ? this.complaintCause[1] : '',
                    two_cause: this.complaintCause[2] ? this.complaintCause[2] : '',
                    three_cause: this.complaintCause[3] ? this.complaintCause[3] : '',
                    adjust_influence: this.performanceImpact,
                    follow_employee: this.currentHandle,
                    delay_info: this.delayStatus,
                    is_many_order: this.isWandan,
                    complaint_progress: this.complaintStatus,
                    // order_status: this.orderStatus,
                    page: this.page,
                    export: '1'
                };
                let url = '/backend-api/employee_order/yw-complaints/list?';
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
         * 点击新建/编辑 跟进跳转页面
         * @params [Object] path 跳转路径
         * @params [Object] id 操作id
         */
        operation(path, id) {
            let routeData = this.$router.resolve({
                path,
                query: {
                    id
                }
            });
            this.toNewPage(routeData.href);
        },
        /**
         * 表格内跳转
         * @params [string] url 跳转链接
         */
        toNewPage(url) {
            let newOpen = window.open(url);
            newOpen.opener = null;
        },
        // 变更跟进人保存
        submitForm() {
            this.$refs['operationData'].validate(async valid => {
                if (valid) {
                    let params = {
                        id: this.operationData.id,
                        employee_id: this.operationData.currentHandle
                    };
                    try {
                        let {
                            data: { code, msg }
                        } = await complaintApi.changeEmployee(params);
                        if (code === 0) {
                            this.operationData.isShow = false;
                            this.searchData(this.page);
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    return false;
                }
            });
        },
        /**
         * 验证方法
         * @params [object] rule 规则
         * @params [string] value 校验值
         * @params [fuction] callback 回调函数
         */
        checkRes(rule, value, callback) {
            if (value && value === this.operationData.currentHandleCopy && this.initDialog) {
                return callback(new Error('变更后的跟进人不允许为当前跟进人'));
            }
            this.initDialog = true;
            callback();
        },
        /**
         * 点击操作按钮
         * @params [Object] rowData 操作行数据
         * @params [Object] type 操作按钮
         */
        operationBtn(rowData, type) {
            switch (type) {
                // 点击编辑
                case 'edit':
                    this.operation('/complaint/editComplaint', rowData.id);
                    break;
                // 点击跟进查看
                case 'show':
                    this.operation('/complaint/followComplaint', rowData.id);
                    break;
                // 变更跟进人
                case 'change_employee':
                    this.operationData.isShow = true;
                    this.operationData.id = rowData.id;
                    this.operationData.currentHandle = rowData.follow_employee_id;
                    this.operationData.currentHandleCopy = rowData.follow_employee_id;
                    this.initDialog = false;
                    this.operationData.currentHandleObj = {
                        name: rowData.follow_employee,
                        value: rowData.follow_employee_id
                    };
                    break;
            }
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        }
    },
    computed: {
        // 计算当前是第几条数据
        countRange() {
            let start = (this.page-1) * this.pageSize + 1;
            let end = this.page * this.pageSize > this.total ? this.total : this.page * this.pageSize;
            return `${start}-${end}`;
        }
    }
};
</script>

<style scoped>
.order-search {
    overflow: hidden;
}
.order-search >>> .el-date-editor,
.order-search >>> .el-select {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}
.order-search >>> .el-select >>> .el-input {
    height: 40px;
}
.order-search >>> .el-range-input {
    background-color: #fff;
    font-size: 12px;
    line-height: 32px;
}
.order-search >>> .el-date-editor .el-range-separator {
    font-size: 12px;
}
.order-search >>> .el-range-editor.el-input__inner {
    padding: 3px 6px;
}
.order-search >>> .el-date-editor .el-range__close-icon {
    font-size: 12px;
    width: 22px;
}
.order-search .fixHeight {
    height: 40px;
}
.order-search >>> .el-date-editor .date-tip-logo {
    display: none;
}
.form-table-box .filter-link-more {
    float: right;
    padding: 9px 20px;
    margin-top: 6px;
}
.order-search > .s-query > li .td {
    height: 40px;
}
.s-query > li.long-column {
    width: 360px;
}
.s-query > li.margin-next {
    margin-left: 20px;
}
.pagination >>> .el-pagination.is-background .btn-next,
.pagination >>> .el-pagination.is-background .btn-prev {
    background-color: #fff;
}
.pagination >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #409eff;
    color: #fff;
}
.table-wrap-new >>> .el-table__header .el-table-column--selection .cell .el-checkbox {
    font-size: 12px;
}
.table-wrap-new >>> .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    color: rgb(51, 51, 51);
    content: '全选';
    font-size: 12px;
    margin-left: 6px;
    font-weight: 500;
}
</style>
<style lang="less" scoped>
.refuse-res {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.complain-list-box {
    padding: 0;
    .hd {
        padding-left: 20px;
    }
}
.form-table-box {
    padding-top: 20px;
    .s-query {
        & > li {
            width: 334px;
        }
    }
    .data-stat {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        margin-bottom: 10px;
    }
}
.blue-url {
    color: #409eff;
    cursor: pointer;
}
.pagination {
    text-align: center;
    margin: 25px 0 10px;
}
.upload-file {
    display: inline-block;
    margin-right: 10px;
}
.btn-link {
    float: left;
    margin-right: 10px;
}
</style>