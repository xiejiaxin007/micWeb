<!--
 * @author: kangxue
 * @Date: 2020-08-20 13:51:57
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-21 13:36:14
 * @description: 结佣单据详情
-->
<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item><a :href="info.prev_url"
                    target="_blank"
                    rel="noopener noreferrer">回款管理页</a></el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.meta.tit}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="view-box">
            <el-button v-if="info.can_see"
                class="router-link"
                @click="toLink(info.bill_id)"
                type="primary">查看单据标准</el-button>
            <el-button v-if="info.can_download"
                class="router-link"
                @click="downLoad"
                type="primary">下载全部</el-button>
            <div class="main-title">{{$route.meta.tit}}</div>
            <div v-loading="loading">
                <div class="info-cell">成交单ID：{{id}}
                    <a :href="info.deal_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="pad-l">
                        <el-button type="text">查看成交详情</el-button>
                    </a>
                </div>
                <!-- 报备凭证 -->
                <template v-if="reportRecord || reportScreenShot">
                    <div class="info-cell">报备凭证</div>
                    <div class="voucher-box">
                        <!-- 咨询师App报备记录 -->
                        <report-record v-if="reportRecord"
                            :info="reportRecord"></report-record>
                        <!-- 报备截图 -->
                        <voucher-module v-if="reportScreenShot"
                            title="报备截图"
                            :info="reportScreenShot"
                            :imgDomain="imgDomain"
                            @showPreview="showPreview"
                            @updateReport="updateReport"
                            @rejectReport="rejectReport"
                            @passReport="passReport"></voucher-module>
                    </div>
                </template>
                <!-- 带看凭证 -->
                <template v-if="lookVoucher">
                    <div class="info-cell">带看凭证</div>
                    <div class="voucher-box">
                        <!-- 带看确认单， 到访水印照片-->
                        <voucher-module :title="item.title"
                            :info="item"
                            v-for="item in lookVoucher"
                            :key="item.key"
                            :imgDomain="imgDomain"
                            @showPreview="showPreview"></voucher-module>
                    </div>
                </template>
                <!-- 交易凭证 -->
                <template v-if="dealVoucher || feeVoucher || proveMaterials">
                    <div class="info-cell">交易凭证</div>
                    <div class="voucher-box">
                        <!-- 交易合同【3301=排行，3302=认购，3303=草签，3304=网签】-->
                        <template v-if="dealVoucher">
                            <voucher-module :title="item.title"
                                :info="item"
                                v-for="item in dealVoucher"
                                :key="item.key"
                                :imgDomain="imgDomain"
                                @showPreview="showPreview"></voucher-module>
                        </template>
                        <!-- 缴费凭证 -->
                        <voucher-module v-if="feeVoucher"
                            title="缴费凭证"
                            :info="feeVoucher"
                            :imgDomain="imgDomain"
                            @showPreview="showPreview"></voucher-module>
                        <!-- 证明材料 -->
                        <voucher-module v-if="proveMaterials"
                            title="证明材料"
                            :info="proveMaterials"
                            :imgDomain="imgDomain"
                            @showPreview="showPreview"></voucher-module>
                    </div>
                </template>
                <!-- 业绩凭证 -->
                <template v-if="accountCheck || commissionContract || customersVisit">
                    <div class="info-cell">业绩凭证</div>
                    <div class="voucher-box">
                        <!-- 业绩确认单-->
                        <voucher-module v-if="accountCheck"
                            title="业绩确认单"
                            :info="accountCheck"
                            :imgDomain="imgDomain"
                            @showPreview="showPreview"></voucher-module>
                        <!-- 结佣合同 -->
                        <div class="voucher-con"
                            v-if="commissionContract">
                            <div class="voucher-title">结佣合同</div>
                            <div class="voucher-info"
                                v-if="commissionContract.detail">
                                <div class="time-info">合同ID：{{commissionContract.detail.contract_id}}</div>
                                <div class="time-info">合同进度：
                                    <a :href="commissionContract.detail.url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-blue">{{commissionContract.detail.contract_status}}</a>
                                </div>
                            </div>
                        </div>
                        <!-- 客户回访----S---- -->
                        <div class="voucher-con"
                            v-if="customersVisit">
                            <div class="operate-btn">
                                <el-button v-if="customersVisit.can_edit"
                                    type="primary"
                                    size="small"
                                    @click="auditVisit(key, index)">修改</el-button>
                            </div>
                            <div class="voucher-title">客户回访</div>
                            <div class="voucher-info"
                                v-if="customersVisit.detail">
                                <div class="time-info">回访进度：
                                    <span v-if="customersVisit.detail.is_return_visit === 1"
                                        class="text-success">通过</span>
                                    <span v-if="customersVisit.detail.is_return_visit === 2"
                                        class="text-danger">不通过</span>
                                </div>
                                <div v-if="customersVisit.detail.is_return_visit === 2"
                                    class="time-info">不通过原因：{{customersVisit.detail.return_visit_reason}}</div>
                                <div class="time-info">最新修改：{{customersVisit.detail.return_visit_datetime}}，{{customersVisit.detail.return_visit_creator}}</div>
                            </div>
                            <warn-msg v-else
                                :modalKey="38"></warn-msg>
                        </div>
                        <!-- 客户回访----E---- -->
                    </div>
                </template>
                <!-- 有效性审核记录 -->
                <div class="check-info audit-info"
                    v-if="validityData">
                    <div class="audit-title">有效性审核记录</div>
                    <!-- 0=未审核   1=有效   2=无效  3=待定 -->
                    <div>
                        <span class="check-item">成交有效性：{{validityData.audit_status_name}}</span>
                        <span class="check-item"
                            v-if="validityData.audit_status !== '0'">审核人：{{validityData.auditor || '---'}}</span>
                        <span class="check-item"
                            v-if="validityData.audit_status !== '0'">审核时间：{{validityData.audit_datetime}}</span>
                    </div>
                    <!-- 无效，待定展示此字段 -->
                    <div v-if="validityData.audit_status === '2' || validityData.audit_status === '3'">
                        <div class="margin-b">原因：{{validityData.reason}}</div>
                        <div>备注：{{validityData.remarks}}</div>
                    </div>
                </div>
                <!-- 单据抽查记录 -->
                <div class="check-info"
                    v-if="spotCheck && spotCheck.is_bill_check">
                    <div>
                        <span class="check-item">抽查时间：{{spotCheck.bill_check_datetime}}</span>
                        <span class="check-item">抽查人：{{spotCheck.bill_check_creator || '---'}}</span>
                        <span class="check-item">抽查结果：{{spotCheck.is_bill_check === 1 ? '通过' : '驳回'}}</span>
                    </div>
                    <div v-if="spotCheck.is_bill_check === 2">驳回原因：{{spotCheck.bill_check_reason}}</div>
                </div>
                <div class="text-center">
                    <el-button type="primary"
                        v-if="spotCheck && spotCheck.can_check"
                        @click="billCheck">单据抽查</el-button>
                    <el-button type="primary"
                        v-if="info.can_availability === '1'"
                        @click="validVisible = true">审核有效性</el-button>
                </div>
            </div>
        </div>
        <!-- 报备截图驳回弹窗 -->
        <reject-dialog title="驳回"
            :visible="rejectVisible"
            :maxLength="100"
            @close="rejectVisible = false"
            @confirm="(reason) => checkReport(2, reason)"></reject-dialog>
        <!-- 单据抽查弹窗 ，客户回访弹窗-->
        <audit-dialog :title="auditDialog.title"
            :visible="auditDialog.visible"
            :label="auditDialog.label"
            :radioGroup="auditDialog.radioGroup"
            :rejectId="auditDialog.rejectId"
            :maxLength="auditDialog.maxLength"
            @close="auditDialog.visible = false"
            @confirm="confirmSave"></audit-dialog>
        <!-- 修改报备截图 -->
        <upload-img-dialog title="报备截图"
            :visible="updateVisible"
            :limit="5"
            :imgList="imgList"
            ref="uploadImgDialog"
            @close="updateVisible = false"
            @getImgs="getImgs"></upload-img-dialog>
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="photoIsShow"
            :showViewer="photoIsShow"
            :currentIndex="currentIndex"
            :urlList="previewUrl"
            @closeViewer="closeViewer">
        </jl-image-preview>
        <!-- 审核有效性弹窗 -->
        <audit-valid-dialog :visible="validVisible"
            :info="validOptions"
            @close="validVisible = false"
            @confirm="confirmValid"></audit-valid-dialog>
    </div>
</template>

<script>
import api from './api/api';
import { RejectDialog, AuditDialog } from '@/components';
import { UploadImgDialog, VoucherModule, WarnMsg, AuditValidDialog, ReportRecord } from './components';
export default {
    components: {
        RejectDialog,
        AuditDialog,
        UploadImgDialog,
        VoucherModule,
        WarnMsg,
        AuditValidDialog,
        ReportRecord,
    },
    data() {
        return {
            // 图片域名
            imgDomain: '',
            // 抽查信息
            spotCheck: {},
            // 审核有效性信息
            validityData: {},
            // 结佣标准详情其他信息
            info: {},
            // 报备截图
            reportScreenShot: {},
            // 咨询师APP报备记录
            reportRecord: {},
            // 带看凭证大模块
            lookVoucher: {},
            // 34=缴费凭证
            feeVoucher: {},
            // 35=证明材料
            proveMaterials: {},
            // 交易合同
            dealVoucher: {},
            // 对账单子模块
            accountCheck: {},
            // 结佣合同子模块
            commissionContract: {},
            // 客户回访子模块
            customersVisit: {},
            // 单据标准ID
            id: '',
            loading: false,
            // 报备截图的图片
            imgList: [],
            // 修改报备截图弹窗
            updateVisible: false,
            // 驳回弹窗
            rejectVisible: false,
            // 审核弹窗，单据抽查弹窗信息
            auditDialog: {
                // 识别是审核弹窗还是单据抽查弹窗
                id: '',
                visible: false,
                // 弹窗标题
                title: '',
                // 审核表单名
                label: '',
                // 审核的radio选择
                radioGroup: [],
                // 驳回的id，用以展示驳回原因
                rejectId: '',
                // 驳回原因字数
                maxLength: 100,
            },
            // 大图展示标志
            photoIsShow: false,
            // 图片预览的url
            previewUrl: [],
            // 大图预览开始的索引
            currentIndex: 0,
            // 审核结果，原因等数据，传给弹窗组件
            validOptions: {},
            // 审核有效性弹窗会否展示
            validVisible: false,
            // 重复提交
            isSubmit: false,
        };
    },
    methods: {
        /**
         * @description: 是否是全路径，包含http:// 或者https://是全路径图片，目前主要是带看确认单有全连接
         * @param {string} img  图片路径
         * @return {boolean}
         */
        isFullImg(img) {
            let reg = /^(http|https):\/\/([\w.]+\/?)\S*$/;
            return reg.test(img);
        },
        /**
         * @description: 图片预览
         * @param {String} previewUrl 预览图片url
         * @param {Number} index 当前选中的是哪一项
         */
        showPreview({ previewUrl, index }) {
            this.photoIsShow = true;
            // 给每一个图片加上域名
            let imgArr = previewUrl.map((v) => {
                return this.isFullImg(v) ? v : this.imgDomain + v;
            });
            this.previewUrl = imgArr;
            this.currentIndex = index;
        },
        // 关闭大图预览
        closeViewer() {
            this.photoIsShow = false;
            this.previewUrl = [];
        },
        downLoad() {
            window.location.href = '/backend-api/expand/ex-commission-bill/download-deal-bill-img?deal_id=' + this.id;
        },
        /**
         * @description: 跳转到查看单据标准页
         * @param {string} id   单据标准ID
         * @return {type}
         */
        toLink(id) {
            let routeData = this.$router.resolve({
                path: '/contract/commissionInfo',
                query: { id: id },
            });
            let newOpen = window.open(routeData.href, '_blank');
            newOpen.opener = null;
        },
        // 初始化数据
        async initData() {
            try {
                this.loading = true;
                const {
                    data: { code, msg, data },
                } = await api.getDealDetail({
                    deal_id: this.id,
                });
                if (code === 0) {
                    let { img_domain, spot_check, availability_data, list, ...info } = data;
                    // 图片域名
                    this.imgDomain = img_domain;
                    // 抽查信息
                    this.spotCheck = spot_check;
                    // 审核有效性记录
                    this.validityData = availability_data;
                    // 其他权限等信息
                    this.info = info;
                    // 1=报备凭证，
                    // 30=报备截图
                    this.reportScreenShot = list['1'].detail_list && list['1'].detail_list['30'] ? list['1'].detail_list['30'] : '';
                    // 39=咨询师App报备记录
                    this.reportRecord = list['1'].detail_list && list['1'].detail_list['39'] ? list['1'].detail_list['39'] : '';
                    // 2=带看凭证， 31=带看确认单  32=到访水印照片
                    this.lookVoucher = list['2'].detail_list ? list['2'].detail_list : '';
                    // 3=交易凭证
                    let { 34: feeVoucher, 35: proveMaterials, ...dealVoucher } = list['3'].detail_list;
                    // 34=缴费凭证
                    this.feeVoucher = feeVoucher;
                    // 35=证明材料
                    this.proveMaterials = proveMaterials;
                    // 33=交易合同【3301=排号，3302=认购，3303=草签，3304=网签】
                    this.dealVoucher = dealVoucher || '';
                    // 4=业绩凭证
                    // 36=业绩确认单
                    this.accountCheck = list['4'].detail_list && list['4'].detail_list['36'] ? list['4'].detail_list['36'] : '';
                    // 37=结佣合同
                    this.commissionContract = list['4'].detail_list && list['4'].detail_list['37'] ? list['4'].detail_list['37'] : '';
                    // 38=客户回访
                    this.customersVisit = list['4'].detail_list && list['4'].detail_list['38'] ? list['4'].detail_list['38'] : '';
                    // 审核有效性静态数据
                    if (info.can_availability === '1') {
                        this.auditValidity();
                    }
                } else {
                    this.$message.error(msg);
                }
                this.loading = false;
            } catch (err) {
                this.loading = false;
            }
        },
        /**
         * @description: 修改报备截图
         * @param {Array} detail  报备截图的详情数据
         */
        updateReport(detail) {
            let imgList = [];
            if (detail) {
                imgList = detail.file_list;
            }
            if (imgList && imgList.length > 0) {
                this.imgList = imgList.map((item) => {
                    return {
                        file_path: item,
                        file_path_full: this.isFullImg(item) ? item : this.imgDomain + item,
                    };
                });
            }
            this.updateVisible = true;
        },
        /**
         * @description: 修改报备截图后获取图片
         * @param {Object}  图片数组
         * @return:
         */
        async getImgs(list) {
            let imgList = list.map(function (item) {
                return item.file_path;
            });
            try {
                let params = {
                    deal_id: this.id,
                    file_list: imgList,
                };
                const {
                    data: { code, msg, data },
                } = await api.updateReport(params);
                if (code === 0) {
                    this.updateVisible = false;
                    this.updateModal('修改成功', data);
                    this.$refs.uploadImgDialog.setSubmit();
                } else {
                    this.$message.error(msg);
                    this.$refs.uploadImgDialog.setSubmit();
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 驳回报备凭证
        rejectReport() {
            this.rejectVisible = true;
        },
        // 通过报备凭证
        passReport() {
            this.checkReport(1);
        },
        /**
         * @description: 审核报备凭证
         * @param {Number} status  1=通过 2=驳回
         * @param {String} reason  驳回原因
         * @return {type}
         */
        async checkReport(status, reason) {
            try {
                let params = {
                    deal_id: this.id,
                    status: status,
                };
                if (reason) {
                    params.reject_reason = reason;
                }
                const {
                    data: { code, msg, data },
                } = await api.auditReport(params);
                if (code === 0) {
                    if (status === 1) {
                        this.updateModal('审核通过', data);
                    } else {
                        this.rejectVisible = false;
                        this.updateModal('驳回成功', data);
                    }
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 报备截图的修改，驳回，通过操作后提示信息+更新模块
         * @param {String}  msg  提示信息
         * @param {Object}  data  返回的模块信息
         * @return {type}
         */
        updateModal(msg, data) {
            this.$message({
                message: msg,
                type: 'success',
            });
            this.$set(this, 'reportScreenShot', data);
        },
        // 客户回访修改，保存成功后局部更新
        auditVisit() {
            this.auditDialog = {
                id: 'visit',
                visible: true,
                title: '客户回访',
                label: '审核结果',
                radioGroup: [
                    { value: 1, name: '通过' },
                    { value: 2, name: '不通过' },
                ],
                maxLength: 100,
                rejectId: 2,
            };
        },
        // 单据抽查
        billCheck() {
            this.auditDialog = {
                id: 'check',
                visible: true,
                title: '单据抽查',
                label: '单据全部达标',
                radioGroup: [
                    { value: 1, name: '通过' },
                    { value: 2, name: '驳回' },
                ],
                maxLength: 200,
                rejectId: 2,
            };
        },
        /**
         * @description: 单据抽查、客户回访弹窗点击保存
         * @param {Object}  formInfo   表单选择返回的数据
         */
        confirmSave(formInfo) {
            let params = {
                deal_id: this.id,
                status: formInfo.audit,
                reject_reason: formInfo.reason,
            };
            // 单据抽查保存
            if (this.auditDialog.id === 'check') {
                this.checkDeal(params);
            } else {
                this.customRevisit(params);
            }
        },
        /**
         * @description: 单据抽查保存接口
         * @param {Object} params 保存参数
         * @return {type}
         */
        async checkDeal(params) {
            try {
                const {
                    data: { code, msg, data },
                } = await api.checkDeal(params);
                if (code === 0) {
                    this.auditDialog.visible = false;
                    this.spotCheck = data;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 客户回访保存接口
         * @param {Object} params 保存参数
         * @return {type}
         */
        async customRevisit(params) {
            try {
                const {
                    data: { code, msg, data },
                } = await api.customRevisit(params);
                if (code === 0) {
                    this.auditDialog.visible = false;
                    this.$message({
                        message: '审核成功',
                        type: 'success',
                    });
                    this.$set(this, 'customersVisit', data);
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 审核有效性下拉
        async auditValidity() {
            // 获取待定原因，无效原因的数据
            try {
                const {
                    data: { code, msg, data },
                } = await api.initAuditAvailability();
                if (code === 0) {
                    this.validOptions = data;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 确定审核有效性
         * @param {Object}  auditForm   审核有效性表数据
         */
        async confirmValid(auditForm) {
            if (this.isSubmit) {
                return false;
            }
            this.isSubmit = true;
            try {
                let params = {
                    deal_id: this.id,
                    ...auditForm,
                };
                const {
                    data: { code, msg, data },
                } = await api.auditAvailability(params);
                if (code === 0) {
                    this.$message({
                        message: '审核成功',
                        type: 'success',
                    });
                    this.validVisible = false;
                    this.validityData = data.availability_data;
                    this.info.can_availability = data.can_availability;
                    this.isSubmit = false;
                } else {
                    this.$message.error(msg);
                    this.isSubmit = false;
                }
            } catch (err) {
                this.isSubmit = false;
                console.log(err);
            }
        },
    },
    mounted() {
        this.id = this.$route.query.id;
        this.initData();
    },
};
</script>

<style scoped lang="less">
.main-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.view-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 20px;
    font-size: 14px;
    .s-query {
        overflow: hidden;
    }
    .router-link {
        float: right;
        margin-top: -10px;
        margin-left: 10px;
    }
    .info-cell {
        font-weight: bold;
        margin: 10px 0;
    }
    .voucher-box {
        border: 2px dashed #eee;
        padding: 0 10px;
        display: flex;
        flex-wrap: wrap;
        .voucher-con {
            flex: 1;
            max-width: 33%;
            min-width: 33%;
            padding-right: 20px;
            box-sizing: border-box;
            padding: 15px 10px;
            .voucher-title {
                color: #555;
                font-weight: bold;
                padding-bottom: 10px;
            }
            .voucher-info {
                clear: both;
                padding-top: 5px;
            }
            .operate-btn {
                float: right;
                margin-top: -5px;
            }
            .voucher-imgs {
                display: flex;
                flex-wrap: wrap;
                li {
                    height: 80px;
                    width: 20%;
                    overflow: hidden;
                    padding: 5px;
                    box-sizing: border-box;
                    img {
                        border: 1px solid #eee;
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
            }
            .time-info {
                color: #666;
                padding-bottom: 5px;
                word-break: break-all;
                span {
                    padding-right: 20px;
                }
            }
        }
    }
}
.text-success {
    color: #67c23a;
}
.text-danger {
    color: #f56c6c;
}
.text-blue {
    color: #409eff;
    text-decoration: underline;
}
.check-info {
    padding: 20px 0 10px;
    .check-item {
        display: inline-block;
        padding-right: 50px;
        padding-bottom: 10px;
    }
    * {
        word-break: break-all;
    }
}
.text-center {
    text-align: center;
    margin-top: 20px;
}
.pad-l {
    padding-left: 20px;
}
.margin-b {
    margin-bottom: 10px;
}
.audit-info {
    padding-left: 20px;
    .audit-title {
        font-weight: bold;
        padding: 10px 0;
        margin-left: -20px;
    }
}
</style>