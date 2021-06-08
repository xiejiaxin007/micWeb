<!--
 * @Author: xie bin
 * @Date: 2021-05-14 14:09:17
 * @LastEditTime: 2021-05-27 17:52:31
 * @LastEditors: xie bin
 * @Description: 积分审核页面
 * @FilePath: /webapp_backend/src/pages/consultor/consultantPerformance/PointsReviewAudit.vue
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
                label="草签id："
                prop="grass_sign_id">
                <jl-number-input
                    v-model="mentionForm.grass_sign_id"
                    reg="number"
                    placeholder="请输入草签id">
                </jl-number-input>
            </el-form-item>
            <el-form-item
                label="网签id："
                prop="sign_id">
                <jl-number-input
                    v-model="mentionForm.sign_id"
                    reg="number"
                    placeholder="请输入网签id">
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
                prop="customer_intent_city">
                <el-select
                    v-model="mentionForm.customer_intent_city"
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
                v-if="checkBoxIsShow"
                v-model="checkboxVal"
                true-label="1"
                false-label="0"
                @change="searchListData">
                只看需要我审核的
            </el-checkbox>
            <el-table
                :data="tableData"
                :show-header="false"
                class="table-data-style"
                :row-class-name="tableRowClassName">
                <el-table-column>
                    <template #default="{ row }">
                        <span :class="row.business_type === '2' ? 'grass-status' : 'inter-status'">
                            {{row.business_type === '2' ? '草' : '网'}}
                        </span>
                        <p>订单id：{{row.order_id || '—'}}</p>
                        <p>成交单id：{{row.deal_id || '—'}}</p>
                        <p>{{row.business_type === '2' ? '草签id：' : '网签id：'}}{{row.business_id || '—'}}</p>
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
                        <p>客户意向城市：{{row.order_city_name || '—'}}</p>
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
                        <p>房屋总价：{{row.deal_money || '—'}}</p>
                        <p>{{row.business_type === '2' ? '草签日期：' : '网签日期：'}}{{row.business_datetime || '—'}}</p>
                        <p class="last-line">提交时间：{{row.submit_time || '—'}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <p>{{row.business_type === '2' ? '草签' : '网签'}}状态：{{row.status || '—'}}</p>
                        <p>成交类型：{{row.sign_type || '—'}}</p>
                        <p class="last-line-audit">审核时间：{{row.audit_time || '暂无'}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ row }">
                        <div class="photo-box">
                            <div class="photo-review-box">
                                <el-image
                                    class="image-review"
                                    fit="fill"
                                    :src="row.deal_img_cover"
                                    alt="证明材料"
                                    :preview-src-list="row.deal_img"
                                    lazy>
                                    <div slot="error" class="image-slot">无</div>
                                </el-image>
                                <span class="demonstration">{{row.business_type === '2' ? '草签单' : '网签单'}}+证明材料</span>
                                <p class="demonstration">共{{row.deal_img.length}}张照片</p>
                            </div>
                            <div class="photo-review-box">
                                <el-image
                                    class="image-review"
                                    fit="fill"
                                    :src="row.bill_img_cover"
                                    alt="到访水印照片"
                                    :preview-src-list="row.bill_img"
                                    lazy>
                                    <div slot="error" class="image-slot">无</div>
                                </el-image>
                                <span class="demonstration">到访水印照片</span>
                                <p class="demonstration">共{{row.bill_img.length}}张照片</p>
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
                                v-if="row.is_audit"
                                class="btn-audit-pass"
                                type="primary"
                                size="mini"
                                @click="auditResolveMethod(row.id, '2', '1', row.is_audit_type)">
                                通过
                            </el-button>
                            <el-button
                                v-if="row.is_audit"
                                class="btn-audit-reject"
                                type="danger"
                                size="mini"
                                @click="auditResolveMethod(row.id, '2', '2', row.is_audit_type)">
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
            title="驳回原因"
            :visible="rejectVisible"
            :maxLength="200"
            @close="rejectVisible = false"
            @confirm="reason => confirmReject('2', '2', reason)">
        </reject-dialog>
        <!-- 商务驳回弹窗 -->
        <audit-reject-dialog
            title="驳回原因"
            label="驳回理由"
            :visible="bussinesRejectVisible"
            :maxLength="200"
            :checkboxGroup="bussinessRejectList"
            @close="rejectVisible = false"
            @confirm="form => confirmReject('2', '2', form)">
        </audit-reject-dialog>
        <!-- 审核记录 -->
        <audit-history-table
            title="积分审核记录"
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
import AuditRejectDialog from './components/AuditRejectDialog';
export default {
    name: "mentionPointAudit",
    components: {
        SearchSelectRadio,
        RejectDialog,
        AuditHistoryTable,
        AuditRejectDialog
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
                // 草签id
                grass_sign_id: '',
                // 网签id
                sign_id: '',
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
                customer_intent_city: ''
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
            // 商务驳回弹窗
            bussinesRejectVisible: false,
            // 驳回理由多选
            bussinessRejectList: [],
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
         * @return {object}  
         */
        auditButtonText({audit_status}) {
            let auditData;
            if (audit_status === '10') {
                auditData = {
                    className: 'pending-review',
                    text: '待主管审核'
                }
            } else if (audit_status === '20') {
                auditData = {
                    className: 'reject-review',
                    text: '主管审核驳回'
                }
            } else if (audit_status === '30') {
                auditData = {
                    className: 'pending-review',
                    text: '待商务审核'
                }
            } else if (audit_status === '40') {
                auditData = {
                    className: 'reject-review',
                    text: '商务审核驳回'
                }
            } else if (audit_status === '50') {
                auditData = {
                    className: 'resolve-review',
                    text: '商务审核通过'
                }
            }
            return auditData
        },
        /**
         * @description: 审核通过
         * @param {string} id 任务id
         * @param {string} type 审核类型  1是提点 2是积分
         * @param {string} status 审核状态  1是通过 2是驳回
         * @param {string} auditType 审核类型  1是主管 2是商务
         */
        async auditResolveMethod(id, type, status, auditType) {
            try {
                if (status === '1') {
                    this.$confirm('确定要审核通过吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        callback: action => {
                            if (action === 'confirm') {
                                if (auditType === 1) {
                                    this.commonAuditInteface(id, type, status);
                                } else {
                                    this.bussinessAuditInteface(id, status);
                                }
                            }
                        }
                    })
                } else {
                    this.tableRowId = id;
                    this.auditType = auditType;
                    if (auditType === 1) {
                        this.rejectVisible = true;
                    } else {
                        this.bussinesRejectVisible = true;
                    }
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
            if (this.auditType === 1) {
                this.commonAuditInteface(this.tableRowId, type, status, reason)
            } else {
                this.bussinessAuditInteface(this.tableRowId, status, reason);
            }
        },
        /**
         * @description: 主管审核接口
         * @param {string} id 任务id
         * @param {string} type 审核类型  1是提点 2是积分
         * @param {string} status 审核状态  1是通过 2是驳回
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
        /**
         * @description: 商务审核接口
         * @param {string} id 任务id
         * @param {string} status 审核状态  1是通过 2是驳回
         * @param {object} form 驳回理由
         */
        async bussinessAuditInteface(id, status, form) {
            // 判断重复提交
            if (this.isSubmiting) {
                return false;
            }
            this.isSubmiting = true;
            try {
                let params = {
                    task_id: id,
                    audit_status: status,
                };
                if (status === '2') {
                    params.reject_reason_other = form.reason;
                    params.reject_reason = String(form.audit);
                }
                const { 
                    data: {
                        code,
                        msg
                    }
                } = await api.bussinessAuditData(params);
                if (code === 0) {
                    this.$message.success(msg);
                    if (status === '2') {
                        this.bussinesRejectVisible = false;
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
                this.mentionForm.audit_start_datetime = this.mentionForm.auditTime[0];
                this.mentionForm.audit_end_datetime = this.mentionForm.auditTime[1];
                // 提交时间
                this.mentionForm.submit_start_datetime = this.mentionForm.submitTime[0];
                this.mentionForm.submit_end_datetime = this.mentionForm.submitTime[1];
                // 只需要我审核的
                this.mentionForm.is_leader_audit = this.checkboxVal;
                // 页码
                this.mentionForm.page = this.pagenation.currentPage;
                this.mentionForm.page_size = this.pagenation.pageSize;
                let params= this.mentionForm;
                const { data: {
                    data,
                    code,
                    msg
                } } = await api.scoreAuditListData(params);
                if (code === 0) {
                    this.tableData = data.list;
                    // 分页赋值
                    this.pagenation.totalNum = Number(data.total);
                    // 审核状态下拉赋值
                    this.audtitStatusData = Object.freeze(data.status_list);
                    // 只看我审核的复选是否展示
                    this.checkBoxIsShow = data.is_leader_audit;
                    // 商务驳回理由
                    this.bussinessRejectList = Object.freeze(data.reject_reason_list);
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
    .table-box {
        /deep/ .table-data-style {
            overflow: inherit;
            .image-slot {
                height: 100%;
                text-align: center;
                line-height: 100px;
                color: #999;
            }
            .el-table__body-wrapper {
                overflow: inherit;
            }
            .table-row-style {
                background: #f2f6fc;
            }
            td, th.is-leaf{
                border-bottom: 20px solid #fff !important;
            }
            margin-top: 20px;
            .last-line {
                margin-top: 20px;
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
            .grass-status, .inter-status {
                width: 40px;
                height: 40px;
                border-radius: 100%;
                background: rgba(2, 151, 215, .6);
                color: #fff;
                position: absolute;
                top: -14px;
                left: -10px;
                transform: rotate(330deg);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
            }
            .inter-status {
                background: rgba(28, 169, 179, .6);
            }
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