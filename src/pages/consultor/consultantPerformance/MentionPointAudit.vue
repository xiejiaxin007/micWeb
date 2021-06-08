<!--
 * @Author: xie bin
 * @Date: 2021-05-14 14:09:17
 * @LastEditTime: 2021-05-27 17:51:29
 * @LastEditors: xie bin
 * @Description: 提点审核页面
 * @FilePath: /webapp_backend/src/pages/consultor/consultantPerformance/MentionPointAudit.vue
-->
<template>
    <div
        class="filter-box"
        v-loading.fullscreen.lock="loading">
        <el-form
            :inline="true"
            :model="mentionForm"
            ref="formRef"
            class="demo-form-inline">
            <el-form-item
                label="订单id："
                prop="order_id">
                <jl-number-input
                    v-model="mentionForm.order_id"
                    reg="number"
                    clearable
                    placeholder="请输入订单id">
                </jl-number-input>
            </el-form-item>
            <el-form-item
                label="成交单id："
                prop="deal_id">
                <jl-number-input
                    v-model="mentionForm.deal_id"
                    reg="number"
                    placeholder="请输入成交单id">
                </jl-number-input>
            </el-form-item>
            <el-form-item
                label="认购id："
                prop="business_id">
                <jl-number-input
                    v-model="mentionForm.business_id"
                    reg="number"
                    placeholder="请输入认购id">
                </jl-number-input>
            </el-form-item>
            <el-form-item
                prop="auditor"
                label="审核人：">
                <search-select-radio
                    v-model="mentionForm.auditor"
                    placeholder="请选择审核人"
                    clearable
                    :apiInfo="userApi">
                </search-select-radio>
            </el-form-item>
            <el-form-item
                label="审核状态："
                prop="audit_status">
                <el-select
                    v-model="mentionForm.audit_status"
                    clearable>
                    <el-option
                        v-for="item in audtitStatusData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="所属咨询师："
                prop="employee_id">
                <search-select-radio
                    v-model="mentionForm.employee_id"
                    placeholder="请选择所属咨询师"
                    clearable
                    :apiInfo="userApi">
                </search-select-radio>
            </el-form-item>
            <el-form-item
                label="客户意向城市："
                prop="order_city_id">
                <el-select
                    v-model="mentionForm.order_city_id"
                    clearable
                    filterable>
                    <el-option
                        v-for="item in cityData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="提交时间："
                prop="submitTime">
                <el-date-picker
                    v-model="mentionForm.submitTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    :clearable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item
                label="审核时间："
                prop="auditTime">
                <el-date-picker
                    v-model="mentionForm.auditTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    :clearable="false">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div class="serach-btn-box">
            <el-button
                @click="resetForm('formRef')"
                size="medium">
                重置
            </el-button>
            <el-button
                type="primary"
                size="medium"
                @click="searchMethod">
                搜索
            </el-button>
        </div>
        <div class="table-box">
            <span class="total-text">共{{pagenation.totalNum}}条记录</span>
            <el-checkbox
                v-show="checkBoxIsShow"
                v-model="checkboxVal"
                true-label="1"
                false-label="0"
                @change="searchListData">
                只看需要我审核的
            </el-checkbox>
            <el-table
                :data="tableData"
                style="width: 100%"
                :show-header="false"
                class="table-data-style"
                :row-class-name="tableRowClassName">
                <el-table-column>
                    <template #default="{ row }">
                        <p>订单id：{{row.order_id || '—'}}</p>
                        <p>成交单id：{{row.deal_id || '—'}}</p>
                        <p>认购id：{{row.business_id || '—'}}</p>
                        <p class="last-line">
                            审核状态：
                            <span
                                :class="auditButtonText(row) && auditButtonText(row).className"
                                class="text-box">
                                {{auditButtonText(row) && auditButtonText(row).text}}
                            </span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <p>客户意向城市：{{row.order_city_id || '—'}}</p>
                        <el-tooltip
                            :content="row.project_name"
                            placement="top-start"
                            effect="light">
                        <p>楼盘：{{row.project_name || '—'}}</p>
                        </el-tooltip>
                        <p>房号：{{row.house_number || '—'}}</p>
                        <p class="last-line">审核人：{{row.auditor || '—'}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <p>所属咨询师：{{row.employee_name || '—'}}</p>
                        <p>房屋总价：{{row.subscribed_amount || '—'}}</p>
                        <p>认购日期：{{row.subscribe_datetime || '—'}}</p>
                        <p class="last-line">提交时间：{{row.submit_time || '—'}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <p>认购状态：{{row.status || '—'}}</p>
                        <p>成交类型：{{row.subscribe_type || '—'}}</p>
                        <p class="last-line-audit">审核时间：{{row.audit_time || '—'}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <div class="photo-box">
                            <div class="photo-review-box">
                                <el-image
                                    class="image-review"
                                    fit="fill"
                                    :src="row.subscribe_thumb"
                                    alt="认购单证明"
                                    :preview-src-list="row.subscribe_img"
                                    lazy>
                                    <div slot="error" class="image-slot">无</div>
                                </el-image>
                                <span class="demonstration">认购单</span>
                                <p class="demonstration">共{{row.subscribe_img.length}}张照片</p>
                            </div>
                            <div class="photo-review-box">
                                <el-image
                                    class="image-review"
                                    fit="fill"
                                    :src="row.water_thumb"
                                    alt="认购单证明"
                                    :preview-src-list="row.water_img"
                                    lazy>
                                    <div slot="error" class="image-slot">无</div>
                                </el-image>
                                <span class="demonstration">到访水印</span>
                                <p class="demonstration">共{{row.water_img.length}}张照片</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <el-button
                            class="btn-audit-history"
                            size="mini"
                            @click="auditHistoryDialog(row)">
                            审核记录
                        </el-button>
                        <div
                            :class="row.audit_status !== '10' ? 'operating-show' : ''"
                            class="operating-box">
                            <el-button
                                v-show="row.audit_auth && row.audit_status === '10'"
                                class="btn-audit-pass"
                                type="primary"
                                size="mini"
                                @click="auditResolveMethod(row.id, '1', '1')">
                                通过
                            </el-button>
                            <el-button
                                v-show="row.audit_auth && row.audit_status === '10'"
                                class="btn-audit-reject"
                                type="danger"
                                size="mini"
                                @click="auditResolveMethod(row.id, '1', '2')">
                                驳回
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                :page-size="pagenation.pageSize"
                layout="prev, pager, next"
                :current-page="pagenation.currentPage"
                :total="pagenation.totalNum"
                @current-change="pageChange"
                hide-on-single-page>
            </el-pagination>
        </div>
        <!-- 驳回弹窗 -->
        <reject-dialog
            title="驳回"
            :visible="rejectVisible"
            :maxLength="200"
            @close="rejectVisible = false"
            @confirm="reason => confirmReject('1', '2', reason)">
        </reject-dialog>
        <!-- 审核记录 -->
        <audit-history-table
            title="提点审核记录"
            :visible="auditVisible"
            :auditHistoryArr="auditHistoryData"
            @close="auditVisible = false">
        </audit-history-table>
    </div>
</template>

<script>
import { pickerOptions } from './config/config';
import api from './api/auditApi';
import commonApi from '../../../api/commonApi';
import { SearchSelectRadio, RejectDialog } from '@/components';
import AuditHistoryTable from './components/AuditHistoryTable';
export default {
    name: "mention-point-audit",
    components: {
        SearchSelectRadio,
        RejectDialog,
        AuditHistoryTable
    },
    props: {
        cityData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            mentionForm: {
                // 订单id
                order_id: '',
                // 成交单id
                deal_id: '',
                // 认购id
                business_id: '',
                // 提交时间
                submitTime: [],
                // 审核时间
                auditTime: [],
                // 审核人
                auditor: '',
                // 咨询师id
                employee_id: '',
                // 审核状态
                audit_status: '',
                // 只看需要我审核的
                need_leader_audit: 0,
                // 客户意向城市
                order_city_id: ''
            },
            // 审核状态下拉
            audtitStatusData: [],
            // 日期选择框快捷选项
            pickerOptions,
            // 表格数据
            tableData: [],
            // 多选框的值
            checkboxVal: '',
            // 用户下拉
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all'
                }
            },
            // loading
            loading: false,
            // 分页
            pagenation: {
                totalNum: 0,
                currentPage: 1,
                pageSize:20
            },
            // 驳回弹窗
            rejectVisible: false,
            // 审核记录弹窗
            auditVisible: false,
            // 审核记录表格数据
            auditHistoryData: [],
            // 复选框是否展示
            checkBoxIsShow: false,
            // 重复提交标志
            isSubmiting: false
        }
    },
    mounted() {
        this.searchListData();
    },
    methods: {
        /**
         * @description: 审核记录弹窗
         * @param {string} id 任务id
         */
        async auditHistoryDialog({id}) {
            this.auditVisible = true;
            this.auditHistoryData = [];
            try {
                let params = {
                    id
                }
                const {
                    data: {
                        data,
                        code
                    }
                } = await api.auditHistoryData(params);
                if (code === 0) {
                    this.auditHistoryData = data.list;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 审核状态名称&样式
         * @param {string} type 审核状态
         * @param {string} text 审核名称
         * @return {object}  
         */
        auditButtonText({audit_status, audit_status_name}) {
            let auditData;
            if (audit_status === '10') {
                auditData = {
                    className: 'pending-review',
                    text: audit_status_name
                }
            } else if (audit_status === '20') {
                auditData = {
                    className: 'reject-review',
                    text: audit_status_name
                }
            } else if (audit_status === '30') {
                auditData = {
                    className: 'resolve-review',
                    text: audit_status_name
                }
            }
            return auditData;
        },
        /**
         * @description: 审核通过
         * @param {string} id 任务id
         * @param {string} type 审核类型  1是提点 2是积分
         * @param {string} status 审核状态  1是通过 2是驳回
         */
        async auditResolveMethod(id, type, status) {
            try {
                if (status === '1') {
                    this.$confirm('确定要审核通过吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        callback: action => {
                            if (action === 'confirm') {
                                this.commonAuditInteface(id, type, status)
                            }
                        }
                    }) 
                } else {
                    this.rejectVisible = true;
                    this.tableRowId = id;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 点击驳回弹窗确定
         * @param {string} type 审核类型  1 是提点  2 是积分
         * @param {string} status 审核状态 1 是通过 2 是驳回
         * @param {string | Object} reason 原因|在商务驳回的时候是一个对象
         */   
        confirmReject(type, status, reason) {
            this.commonAuditInteface(this.tableRowId, type, status, reason)
        },
        /**
         * @description: 审核接口
         * @param {string} id 任务id
         * @param {string} type 审核类型  1是提点 2是积分
         * @param {string} status 审核状态  1是通过 2是驳回
         * @param {string} reason 原因
         */
        async commonAuditInteface(id, type, status, reason='') {
            // 判断重复提交
            if (this.isSubmiting) {
                return false;
            }
            this.isSubmiting = true;
            try {
                let params = {
                    id,
                    result: status,
                    type
                };
                if (status === '2') {
                    params.reason = reason;
                }
                const { 
                    data: {
                        code,
                        msg
                    }
                } = await api.coommonAuditData(params);
                if (code === 0) {
                    this.$message.success(msg);
                    if (status === '2') {
                        this.rejectVisible = false;
                    }
                    // 调用列表接口
                    this.searchListData();
                    this.isSubmiting = false;
                } else {
                    this.$message.warning(msg);
                    this.isSubmiting = false;
                }
            }
            catch(error) {
                console.log(error);
                this.isSubmiting = false;
            }
        },
        // 点击搜索按钮
        searchMethod() {
            this.pagenation.currentPage = 1;
            // 调用列表接口
            this.searchListData();
        },
        // 搜索列表接口
        async searchListData() {
            try {
                this.loading = true;
                // 审核时间
                this.mentionForm.audit_start_time = this.mentionForm.auditTime[0];
                this.mentionForm.audit_end_time = this.mentionForm.auditTime[1];
                // 提交时间
                this.mentionForm.submit_start_time = this.mentionForm.submitTime[0];
                this.mentionForm.submit_end_time = this.mentionForm.submitTime[1];
                // 只需要我审核的
                this.mentionForm.need_leader_audit = this.checkboxVal;
                // 页码
                this.mentionForm.page = this.pagenation.currentPage;
                this.mentionForm.page_size = this.pagenation.pageSize;
                let params= this.mentionForm;
                const { data: {
                    data,
                    code,
                    msg
                } } = await api.commissionListData(params);
                if (code === 0) {
                    this.tableData = data.list;
                    // 分页赋值
                    this.pagenation.totalNum = Number(data.total);
                    // 审核状态下拉赋值
                    this.audtitStatusData = Object.freeze(data.status_list);
                    // 只看我审核的复选是否展示
                    this.checkBoxIsShow = data.is_leader_audit;
                    this.loading = false;
                } else {
                    this.$message.warning(msg);
                    this.loading = false;
                }
            }
            catch(error) {
                this.loading = false;
                console.log(error)
            }
        },
        /**
         * @description: 页码发生改变的时候
         * @param {number} val 当前页码
         */
        pageChange(val) {
            this.pagenation.currentPage = val;
            this.searchListData();
        },
        /**
         * @description: 重置表单
         * @param {string} formName 表单ref
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.pagenation.currentPage = 1;
            this.searchListData();
        },
        // 表格行样式
        tableRowClassName({rowIndex}) {
            if (rowIndex%1 == 0) {
                return 'table-row-style';
            }
            return '';
        }
    }
}
</script>

<style lang="less" scoped>
.filter-box{
    /deep/ .el-form-item {
        margin-right: 30px;
    }
    /deep/ .el-form-item__label {
        span {
            position: relative;
            .el-icon-question {
                position: absolute;
                top: -5px;
                right: 12px;
                font-size: 10px;
            }
        }
    }
    /deep/ .el-range-input {
        background: #fff;
    }
    .serach-btn-box {
        text-align: center;
    }
    .total-text {
        font-size: 14px;
        margin-right: 15px;
        font-weight: 400;
    }
    
    /deep/ .table-data-style {
        .image-slot {
            height: 100%;
            text-align: center;
            line-height: 100px;
            color: #999;
        }
        .table-row-style {
            background: #f2f6fc;
        }
        margin-top: 20px;
        .last-line {
            margin-top: 20px;
        }
        td, th.is-leaf{
            border-bottom: 20px solid #fff !important;
        }
        .last-line-audit {
            margin-top: 43px;
        }
        .photo-box {
            display: flex;
            .photo-review-box {
                display: flex;
                flex-direction: column;
                margin-right: 10px;
                .demonstration {
                    text-align: center;
                    margin-top: 4px;
                }
            }
            /deep/ .el-image_error {
                background: #eff0f3;                
            }
        }
        .btn-audit-history {
            margin-left: 42px;
            
        }
        .operating-box {
            margin-top: 64px;            
        }
        .operating-show {
            margin-left: 55px;
        }
        p {
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .text-box {
            width: 100px;
            height: 50px;
            padding: 10px;
            box-sizing: border-box;
        }
        .pending-review {
            background: #FDF6EC;
            color: #E6A23C;
        }
        .reject-review {
            background: #FEF0F0;
            color: #F78989;
        }
        .resolve-review {
            background: #F0F9E8;
            color: #85CE61;
        }
        .image-review {
            width: 100px;
            height: 100px;
        }
    }
    /deep/ .el-pagination {
        text-align: center;
        margin-top: 15px;
    }
}
</style>