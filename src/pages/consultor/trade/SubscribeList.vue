<!--
 * @Author: xie bin
 * @Date: 2020-07-16 21:14:29
 * @LastEditTime: 2021-01-26 15:33:19
 * @LastEditors: kangxue
 * @Description: 订单认购列表
 * @FilePath: /webapp_backend/src/pages/consultor/trade/SubscribeList.vue
-->

<template>
    <div class="subscribe-list">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>线上认购列表页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单搜索部分-->
        <el-form
            :model="dealForm"
            ref="dealForm"
            class="deal-form"
            size="small"
            label-width="120px"
            :inline="true">
            <el-form-item
                prop="orderId"
                label="订单ID:">
                <el-input
                    v-model="dealForm.orderId"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="subscribeId"
                label="线上认购ID:">
                <el-input
                    v-model="dealForm.subscribeId"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="reservationId"
                label="线上订房ID:">
                <el-input
                    v-model="dealForm.reservationId"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="city"
                label="城市：">
                <el-select
                    clearable
                    v-model="dealForm.city"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.cityOptions"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="projectName"
                label="楼盘名称：">
                <el-select
                    v-model="dealForm.projectName"
                    filterable
                    clearable>
                    <el-option
                        v-for="item in selectObj.projectNames"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="customerName"
                label="客户姓名:">
                <el-input
                    v-model="dealForm.customerName"
                    placeholder="模糊检索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="customerTel"
                label="客户电话:">
                <el-input
                    v-model="dealForm.customerTel"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="customerTag"
                label="客户标记：">
                <el-select
                    clearable
                    v-model="dealForm.customerTag"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.customerTagOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="isEmployee"
                label="是否是居理员工：">
                <el-select
                    clearable
                    v-model="dealForm.isEmployee"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.employeeOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="subscribeSource"
                label="认购单来源：">
                <el-select
                    clearable
                    v-model="dealForm.subscribeSource"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.sourceOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="counselor"
                label="咨询师：">
                <el-select
                    v-model="dealForm.counselor"
                    filterable
                    clearable
                    remote
                    :remote-method="(q) => getCounselorOps('counselorOps', q)">
                    <el-option
                        v-for="item in selectObj.counselorOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="responsibleBusiness"
                label="负责商务：">
                <el-select
                    v-model="dealForm.responsibleBusiness"
                    filterable
                    clearable
                    remote
                    :remote-method="(q) => getCounselorOps('businessOps', q)"
                    placeholder="">
                    <el-option
                        v-for="item in selectObj.businessOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="subscribeFundStatus"
                label="认购金状态：">
                <el-select
                    clearable
                    v-model="dealForm.subscribeFundStatus"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.fundStatusOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="subscribeConstractStatus"
                label="认购合同状态：">
                <el-select
                    clearable
                    v-model="dealForm.subscribeConstractStatus"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.constractStatusOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="payType"
                label="支付方式：">
                <el-select
                    clearable
                    v-model="dealForm.payType"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.payTypeOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="companyVal"
                label="公司：">
                <el-select
                    clearable
                    v-model="dealForm.companyVal"
                    filterable
                    remote
                    :remote-method="companyQuery"
                    @focus="focusCompany"
                    placeholder="请选择公司">
                    <el-option
                        v-for="item in dealForm.companyData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="paymentTime"
                label="认购金支付时间：">
                <el-date-picker
                    v-model="dealForm.paymentTime"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item
                prop="isMyCheck">
                <el-checkbox
                    v-model="dealForm.isMyCheck"
                    label="仅筛选需要我审核的订单">
                </el-checkbox>
            </el-form-item>
            <el-form-item class="form-item-center">
                <el-button
                    @click="resetForm">
                    重置
                </el-button>
                <el-button
                    type="primary"
                    @click="getDataByOptions()">
                    搜索
                </el-button>
            </el-form-item>
        </el-form>
        <!--表格部分开始-->
        <div class="table-list-wrap">
            <div class="table-top-box">
                <div class="page-size-box">
                    当前筛选出
                    <span class="focus">{{pages.total}}</span>
                        个认购单，共
                    <template>
                        {{searchNum}}个认购单
                    </template>
                </div>
                <el-button
                    type="primary"
                    size="small"
                    v-if="tableData.length > 0"
                    @click="exportTable">
                    导出
                </el-button>
            </div>
            <el-table
                class="subscribe-table"
                :data="tableData"
                v-loading="loading"
                stripe
                border
                style="width: 100%">
                <el-table-column
                    prop="order_id"
                    width="120"
                    label="订单ID">
                </el-table-column>
                <el-table-column
                    prop="id"
                    width="120"
                    label="线上认购ID">
                </el-table-column>
                <el-table-column
                    prop="booking_id"
                    width="120"
                    label="线上订房ID">
                    <template slot-scope="scope">
                        {{Number(scope.row.booking_id) === 0 ? '' : scope.row.booking_id}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="city_name"
                    width="80"
                    label="城市">
                </el-table-column>
                <el-table-column
                    prop="org_name"
                    width="170"
                    label="公司">
                </el-table-column>
                <el-table-column
                    prop="project_name"
                    width="120"
                    label="楼盘名称">
                </el-table-column>
                <el-table-column
                    prop="user_name"
                    width="120"
                    label="客户姓名">
                </el-table-column>
                <el-table-column
                    prop="deal_source"
                    width="120"
                    label="客户标记">
                </el-table-column>
                <el-table-column
                    prop="is_julive_employee"
                    width="120"
                    label="是否是居理员工">
                </el-table-column>
                <el-table-column
                    prop="deal_type"
                    width="100"
                    label="认购单来源">
                </el-table-column>
                <el-table-column
                    prop="user_phone"
                    width="120"
                    label="客户电话">
                </el-table-column>
                <el-table-column
                    prop="num"
                    width="120"
                    label="房号">
                </el-table-column>
                <el-table-column
                    prop="intention_money"
                    width="120"
                    label="认购金应付/元">
                </el-table-column>
                <el-table-column
                    prop="payback_money"
                    width="120"
                    label="认购金已退/元">
                </el-table-column>
                <el-table-column
                    prop="pay_type"
                    width="120"
                    label="支付方式">
                </el-table-column>
                <el-table-column
                    prop="pay_time"
                    width="120"
                    label="认购金支付时间">
                </el-table-column>
                <el-table-column
                    prop="refund_time"
                    width="120"
                    label="认购金退款时间">
                </el-table-column>
                <el-table-column
                    prop="employee_name"
                    width="120"
                    label="咨询师">
                </el-table-column>
                <el-table-column
                    prop="bd_employee_name"
                    width="120"
                    show-overflow-tooltip
                    label="负责商务">
                </el-table-column>
                <el-table-column
                    prop="sales"
                    width="120"
                    label="销售">
                </el-table-column>
                <el-table-column
                    prop="notice_name"
                    width="120"
                    label="盖章人">
                </el-table-column>
                <el-table-column
                    prop="pay_status"
                    width="100"
                    label="认购金状态">
                </el-table-column>
                <el-table-column
                    prop="contract_status"
                    width="120"
                    label="认购合同状态">
                </el-table-column>
                <el-table-column
                    prop="audit_employee"
                    width="120"
                    label="最新审核人">
                </el-table-column>
                <el-table-column
                    prop="operateOptions"
                    fixed="right"
                    width="180"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.is_audit"
                            type="text"
                            size="medium"
                            @click="paymentApproval(scope.row)">
                            付款审核
                        </el-button>
                        <el-button
                            type="text"
                            size="medium"
                            v-if="scope.row.pdf_url">
                            <a class="el-button--text"
                                :href="scope.row.pdf_url"
                                target="_blank">
                                签署链接
                            </a>
                        </el-button>
                        <el-button
                            type="text"
                            size="medium"
                            v-if="scope.row.detail_url">
                            <a
                                class="el-button--text"
                                :href="scope.row.detail_url"
                                target="_blank">
                                查看详情
                            </a>
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
                layout="prev, pager, next, jumper"
                :total="pages.total"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <!--付款审批弹窗-->
        <el-dialog
            title="付款审核"
            center
            :visible.sync="dialogFormVisible">
            <el-form
                :model="checkForm"
                size="small">
                <el-form-item
                    label="楼盘名称：">
                    {{checkForm.projectName}}
                </el-form-item>
                <el-form-item
                    label="客户姓名：">
                    {{checkForm.customerName}}
                </el-form-item>
                <el-form-item
                    label="支付认购金：">
                    {{checkForm.payNum}}
                </el-form-item>
                <el-form-item label="认购金是否到账：">
                    <el-radio-group v-model="checkForm.status">
                        <el-radio
                            v-for="item in collectionStatus"
                            :key="item.id"
                            :label="item.id">{{item.text}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-show="checkForm.status === 1"
                    label="认购金支付时间">
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptionsBefore"
                        v-model="checkForm.date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <div class="msg-alert">请确保！！！此结果与开发商确认无误，才能提交！！!</div>
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button
                    @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmCheck"
                    :loading="isDoing">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import reqApi from './api/subscribeList';
import commonApi from '@/api/commonApi';
export default {
    name: 'SubscribeList',
    data() {
        return {
            // 表单对象
            dealForm: {
                // 订单id
                orderId: '',
                // 线上认购ID
                subscribeId: '',
                // 线上订房id
                reservationId: '',
                // 城市
                city: '',
                // 楼盘名称
                projectName: '',
                // 成交状态
                dealStatus: '',
                // 客户姓名
                customerName: '',
                // 客户电话
                customerTel: '',
                // 客户标记
                customerTag: '',
                // 是否是居理员工
                isEmployee: '',
                // 认购单来源
                subscribeSource: '',
                // 认购金支付时间
                paymentTime: [],
                // 咨询师
                counselor: '',
                // 负责商务
                responsibleBusiness: '',
                // 认购金状态
                subscribeFundStatus: '',
                // 认购合同状态
                subscribeConstractStatus: '',
                // 仅筛选我需要审核的订单
                isMyCheck: false,
                // 支付方式
                payType: '',
                // 公司下拉
                companyVal: '',
                companyData: []
            },
            // 下拉对象
            selectObj: {
                // 城市
                cityOptions: [],
                // 楼盘名称
                projectNames: [],
                // 客户标记
                customerTagOps: [],
                // 居理员工
                employeeOps: [],
                // 认购来源
                sourceOps: [],
                // 咨询师
                counselorOps: [],
                // 负责商务
                businessOps: [],
                // 认购金状态
                fundStatusOps: [],
                // 认购合同状态
                constractStatusOps: [],
                // 支付方式
                payTypeOps: []
            },
            // table加载loading
            loading: false,
            // 表格数据
            tableData: [],
            // 分页数据
            pages: {
                // 每页条数
                pageSize: 20,
                // 当前页
                currentPage: 1,
                // 总条数
                total: 0
            },
            // 搜索筛选出的条数
            searchNum: 0,
            // 弹窗显示隐藏状态
            dialogFormVisible: false,
            // 审批弹窗表单数据
            checkForm: {
                projectName: '',
                customerName: '',
                payNum: '',
                status: '',
                date: ''
            },
            // 开发商收款状态
            collectionStatus: [],
            // 是否在请求中，防止重复触发
            isDoing: false,
            // 可选择今天及之前的日期
            pickerOptionsBefore: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }
        }
    },
    created() {
        // 初始化获取id 赋值到线上认购id
        this.dealForm.subscribeId = this.$route.query.id || '';
        //  初始化下拉数据
        this.initSelectOps();
        // 初始化全国经营城市
        this.getCityOps();
        // 获取初始化数据
        this.getDataByOptions();
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
                    }} = await reqApi.getCompanyData(params);
                    if (code === 0) {
                        console.log(data)
                        this.dealForm.companyData = data.list;
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
        // 初始化下拉数据
        async initSelectOps() {
            try {
                const {
                    data: {
                        code,
                        data,
                        msg
                    }
                } = await reqApi.getInitOptions();
                if (code === 0) {
                    // 楼盘名称
                    this.selectObj.projectNames = data.project;
                    // 客户标记
                    this.selectObj.customerTagOps = data.deal_source;
                    // 是否是居理员工
                    this.selectObj.employeeOps = data.is_julive_employee;
                    // 认购来源
                    this.selectObj.sourceOps = data.creator_type;
                    // 认购金状态
                    this.selectObj.fundStatusOps = data.pay_status;
                    // 认购金合同状态
                    this.selectObj.constractStatusOps = data.sign_status;
                    // 支付方式
                    this.selectObj.payTypeOps = data.pay_type;
                    // 开发商收款状态
                    this.collectionStatus = data.developer;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取城市下拉
        async getCityOps() {
            try {
                const {
                    data: {
                        code,
                        data,
                        msg
                    }
                } = await commonApi.getAllCityNew();
                if (code === 0) {
                    this.selectObj.cityOptions = data || [];
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 获取咨询师 / 负责商务 下拉
         * @param {String} tag 标识是咨询师还是商务
         * @param {String} q 查询关键字
         * @return {Promise} Promise 对象
         */
        async getCounselorOps(tag, q) {
            try {
                const {
                    data: {
                        code,
                        data,
                        msg
                    }
                } = await commonApi.getAllEmployee({q});
                if (code === 0) {
                    this.selectObj[tag] = data || [];
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 根据搜索条件搜索
        async getDataByOptions(isExport = '') {
            const opsData = this.dealForm;
            // 组装筛选的数据
            const options = {
                page: this.pages.currentPage,
                order_id: opsData.orderId,
                // 认购ID
                id: opsData.subscribeId,
                // 订单id
                booking_id: opsData.reservationId,
                city_id: opsData.city,
                project_id: opsData.projectName,
                // 成交状态
                sign_status: opsData.dealStatus,
                user_name: opsData.customerName,
                user_phone: opsData.customerTel,
                // 客户标记
                deal_source: opsData.customerTag,
                is_julive_employee: opsData.isEmployee,
                // 认购单来源
                deal_type: opsData.subscribeSource,
                pay_time_min: opsData.paymentTime[0],
                pay_time_max: opsData.paymentTime[1],
                employee_id: opsData.counselor,
                // 商务id
                bd_employee_id: opsData.responsibleBusiness,
                // 认购状态
                pay_status: opsData.subscribeFundStatus,
                // 支付方式
                pay_type: opsData.payType,
                // 合同状态
                contract_status: opsData.subscribeConstractStatus,
                // 仅筛选我审核的 1勾选 0未勾选
                only_audit: Number(opsData.isMyCheck),
                is_export: isExport,
                // 公司id
                org_id: this.dealForm.companyVal
            };
            try {
                if (isExport === '1') {
                    const {
                        data,
                        headers
                    } = await reqApi.getSubcribeList(options, {
                        // 解决导出文件乱码问题
                        responseType: 'blob'
                    });
                    // 从headers获取后台传输的文件名
                    const fileName = headers['content-disposition'].split(';')[1].split('=')[1];
                    this.downloadXls(data, fileName);
                } else {
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await reqApi.getSubcribeList(options);
                    if (code === 0) {
                        this.tableData = data.list;
                        this.searchNum = data.total;
                        this.pages.total = Number(data.search_num);
                    } else {
                        this.$message.error(msg);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 文件xls下载
         * @param {Blob} blob Blob对象
         * @param {String} fileName 导出的文件名
         */
        downloadXls(blob, fileName) {
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            // 清楚数据
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        // 页码改变加载数据
        handleCurrentChange(page) {
            this.pages.currentPage = page;
            this.getDataByOptions();
        },
        // 重置搜索数据
        resetForm() {
            // 重置表单
            this.$refs.dealForm.resetFields();
            // 重新搜索
            this.getDataByOptions();
        },
        // 导出表格
        exportTable() {
            this.getDataByOptions('1');
        },
        /**
         * 付款审批 将数据带入 显示弹窗
         * @param {Object} item 表格行数据对象
         */
        paymentApproval(item) {
            // 清空认购金是否到账选项
            this.checkForm.status = '';
            this.checkForm.projectName = item.project_name || '';
            this.checkForm.customerName = item.user_name || '';
            this.checkForm.payNum = item.intention_money && `${item.intention_money}元`;
            this.dialogFormVisible = true;
            // 将当前点击数据的id存储到this上
            this.subcribeId = item.id;
        },
        // 点击确认确认审核
        async confirmCheck() {
            try {
                if (this.isDoing) {
                    return;
                }
                if (this.checkForm.status === '') {
                    this.$message.warning('未选择是否到账，不能提交！');
                    return;
                }
                this.isDoing = true;
                const options = {
                    id: this.subcribeId,
                    is_pay: this.checkForm.status,
                    pay_datetime: this.checkForm.date
                };
                const {
                    data: {
                        code,
                        msg
                    }
                } = await reqApi.subcribePayAudit(options);
                this.isDoing = false;
                if (code === 0) {
                    this.dialogFormVisible = false;
                    // 审核成功后重新刷新数据
                    this.getDataByOptions();
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                this.isDoing = false;
                this.dialogFormVisible = false;
                console.log(err);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .subscribe-list {
        padding: 20px 30px 0;
    }
    .deal-form {
        margin-top: 20px;
        padding: 15px 20px;
        background-color: #fff;
        .form-item-center {
            width: 100%;
            margin-bottom: 0;
            text-align: center;
        }
        /deep/.el-form-item {
            .el-input {
                width: 140px;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
            .el-range-input {
                background-color: #fff;
            }
            .el-form-item__label {
                font-size: 12px;
            }
        }
    }
    .table-list-wrap {
        background-color: #fff;
        margin-top: 15px;
        padding: 15px;
    }
    .table-top-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .page-size-box {
        color: #409eff;
    }
    .constract-table {
        margin: 15px 0;
    }
    .page-wrap {
        margin: 25px 0 10px;
    }
    .msg-alert {
        padding: 0 10px;
        color: #f56c6c;
    }
</style>
