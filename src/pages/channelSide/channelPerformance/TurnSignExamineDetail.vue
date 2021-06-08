<!--
 * @author: hewei
 * @Date: 2021-05-13 10:39:04
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 14:09:18
 * @description: 转直签审批详情页
-->
<template>
    <div class="turn-sign-detail">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item to="/channelPerfor/contractList">
                合同列表页
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                转直签审批详情页
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="part apply-content">
            <h3 class="title">申请内容</h3>
            <div class="box-wrap">
                <div class="content-list">
                    <ul class="base-info">
                        <li class="item">
                            <label class="label">合同ID：</label>
                            <a
                                :href="detailInfo.contract_url"
                                class="a-link"
                            >{{detailInfo.id}}</a>
                        </li>
                        <li class="item">
                            <label class="label">申请人：</label>
                            <span class="content">{{detailInfo.apply_employee}}</span>
                        </li>
                        <li class="item">
                            <label class="label">直签类型：</label>
                            <span class="content">{{detailInfo.direct_sign_type}}</span>
                        </li>
                        <li class="item">
                            <label class="label">楼盘ID：</label>
                            <span class="content">{{detailInfo.project_id}}</span>
                        </li>
                        <li class="item">
                            <label class="label">楼盘名称：</label>
                            <span class="content">{{detailInfo.project_name}}</span>
                        </li>
                    </ul>
                </div>
                <div class="certify-file">
                    <div class="certify-notice">证明材料要求：
                        <div v-html="detailInfo.direct_sign_type_tip_text"></div>
                    </div>
                    <div class="certify-file-show">
                        <label class="label">证明材料：</label>
                        <file-preview :file-list="fileList" />
                    </div>
                </div>
                <div class="apply-reason">
                    <label class="label">申请理由：</label>
                    <pre class="reason-content">{{detailInfo.apply_reason}}</pre>
                </div>
            </div>
        </div>
        <div class="part examine-content">
            <h3 class="title">审批流</h3>
            <div class="box-wrap">
                <ul class="examine-box">
                    <li
                        class="examine-item"
                        v-for="item in approvalFlow"
                        :key="item.status_value + item.level"
                    >
                        <label class="ex-title">第{{item.level}}级</label>
                        <div class="exmine-content">
                            <div>
                                <span
                                    class="status"
                                    :style="getStyle(item.status_value)"
                                >{{item.status}}</span>，
                                <span class="info">{{item.approver}} {{item.operate_datetime && ',' + item.operate_datetime}}</span>
                                <div class="rmark">{{getApproveText(item.status_value,item.remarks)}} {{item.remarks}}</div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div
                    class="back-box"
                    v-if="back.approval_status"
                >
                    <span class="info">{{back.approval_status}},{{back.operator}} {{back.operating_time && ',' + back.operating_time}}</span>
                    <div class="rmark">撤销原因： {{back.approval_note}}</div>
                </div>
            </div>

        </div>
        <div class="detail-footer">
            <el-button
                v-if="btnAuth.can_reject === 1"
                type="danger"
                size="small"
                @click="handleApprove(true, '驳回原因', '1')"
            >驳回</el-button>
            <el-button
                v-if="btnAuth.can_pass === 1"
                type="primary"
                size="small"
                @click="handleApprove(false, '备注', '2')"
            >通过</el-button>
            <el-button
                v-if="btnAuth.can_revoke === 1"
                type="warning"
                size="small"
                @click="handleApprove(true, '撤销原因', '3')"
            >撤销</el-button>
            <el-button
                v-if="btnAuth.can_add_approver === 1"
                type="primary"
                size="small"
                @click="dialogVisible = true"
            >增加一级审批人</el-button>
        </div>
        <!--审核弹窗-->
        <RejectDialog
            :label="approveDialog.text"
            :title="approveDialog.text"
            :maxLength="200"
            :visible="approveDialog.rejectShow"
            :is-required="approveDialog.required"
            @confirm="rejectConfrim"
            @close="rejectClose"
        />
        <change-employee-dialog
            :visible.sync="dialogVisible"
            title="增加一级审批人"
            label="新的审批人"
            :apiInfo="oFollower"
            @confirm="handleChangeApprover"
        />

    </div>
</template>

<script>
    import api from './api/approveDetail';
    import globalApi from '@/api/commonApi';
    import RejectDialog from '@/components/RejectDialog';
    import ChangeEmployeeDialog from './components/ChangeEmployeeDialog';
    import FilePreview from '@/components/FilePreview';
    export default {
        name: 'TurnExamineDetail',
        components: {
            RejectDialog,
            ChangeEmployeeDialog,
            FilePreview,
        },
        data() {
            return {
                // 详情信息
                detailInfo: {
                    id: '',
                    contract_url: '',
                    direct_sign_type: '',
                    project_id: '',
                    project_name: '',
                    direct_sign_type_tip_text: '',
                    apply_reason: '',
                },
                // 按钮权限
                btnAuth: {
                    // 驳回
                    can_reject: '',
                    // 通过
                    can_pass: '',
                    // 增加审批人
                    can_add_approver: '',
                    // 撤销
                    can_revoke: '',
                },
                // 审批流
                approvalFlow: [],
                // 文件列表
                fileList: [],
                // 增加一级审批人弹窗
                dialogVisible: false,
                // 审批弹窗
                approveDialog: {
                    // 审批弹窗是否展示
                    rejectShow: false,
                    // 是否需要校验必填
                    required: true,
                    text: '',
                },
                // 撤回状态相关字段 展示再审批流下方
                back: {
                    approval_status: '',
                    approval_note: '',
                    operating_time: '',
                    operator: '',
                },
            };
        },
        created() {
            // 增加审批人远程对象
            this.oFollower = {
                api: globalApi.getStaffList,
                params: {
                    q: '',
                    status: '1',
                    role: 'all',
                },
            };
            this.contractId = this.$route.query.id || '';
        },
        mounted() {
            this.getDetailInfo();
        },
        methods: {
            /**
             * @description 跟进状态计算样式
             * @param {String} status 审核状态
             */
            getStyle(status) {
                const textMap = {
                    // 正在审批
                    1: '#303133',
                    // 通过
                    2: '#67C23A',
                    // 驳回
                    3: '#f56c6c',
                    // 撤销
                    4: '#e6a23c',
                    // 等待审批
                    5: '#909399',
                };
                return {
                    color: textMap[status],
                };
            },
            /**
             * @description 跟进状态获取审核文本方法
             * @param {String} status 审核状态
             * @param {String} val 审核文案
             */
            getApproveText(status, val) {
                const textMap = {
                    // 正在审批
                    1: '',
                    // 通过
                    2: val && '备注：',
                    // 驳回
                    3: '驳回原因：',
                    // 撤销
                    4: '撤销原因：',
                    // 等待审批
                    5: '',
                };
                return textMap[status];
            },
            // 点击审批按钮逻辑处理
            handleApprove(isRequire, text, status) {
                this.approveDialog.required = isRequire;
                this.approveDialog.text = text;
                this.approveDialog.rejectShow = true;
                this.curDialogStatus = status;
            },
            // 获取详情信息
            async getDetailInfo() {
                try {
                    const params = {
                        id: this.contractId,
                    };
                    let {
                        data: { code, data, msg },
                    } = await api.getApprvalDetail(params);
                    if (code === 0) {
                        const {
                            file_list,
                            approval_flow,
                            approval_id,
                            can_reject,
                            can_pass,
                            can_add_approver,
                            can_revoke,
                            approval_status,
                            operating_time,
                            operator,
                            approval_note,
                            ...detailInfo
                        } = data;
                        this.detailInfo = detailInfo;
                        this.fileList = file_list.map(ele => {
                            return {
                                ...ele,
                                // 半链接
                                file_url: `${ele.file_domain}${ele.file_url.startsWith('/') ? ele.file_url : '/' + ele.file_url}`,
                            };
                        });
                        this.approvalFlow = approval_flow;
                        this.btnAuth = {
                            can_reject,
                            can_pass,
                            can_add_approver,
                            can_revoke,
                        };
                        // 审批id
                        this.approvalId = approval_id;
                        this.back = {
                            approval_status,
                            approval_note,
                            operating_time,
                            operator,
                        };
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * @description 审核弹窗确认
             * @param {String} reason 原因
             */
            rejectConfrim(reason) {
                this.approveDialog.rejectShow = false;
                const params = {
                    approval_id: this.approvalId || '',
                    remarks: reason,
                };
                const status = this.curDialogStatus;
                // 撤销原因
                if (status === '3') {
                    this.approveRevoke(params);
                    // 驳回和通过
                } else if (status === '1' || status === '2') {
                    params.status = status === '1' ? 2 : 1;
                    this.updateApproveInfo(params);
                }
            },
            // 审批弹窗关闭方法
            rejectClose() {
                this.approveDialog.rejectShow = false;
            },
            /**
             * @description 审批方法
             * @param {Object} params 数据对象
             */
            async updateApproveInfo(params) {
                try {
                    if (this.hasReq) {
                        return;
                    }
                    this.hasReq = true;
                    let {
                        data: { code, msg },
                    } = await api.approvalDirectSign(params);
                    this.hasReq = false;
                    if (code === 0) {
                        this.$message.success('操作成功');
                        // 刷新详情信息
                        this.getDetailInfo();
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.hasReq = false;
                    console.log(error);
                }
            },
            /**
             * @description 撤销方法
             * @param {Object} params 数据对象
             */
            async approveRevoke(params) {
                try {
                    if (this.hasReq) {
                        return;
                    }
                    this.hasReq = true;
                    let {
                        data: { code, msg },
                    } = await api.revokeApproval(params);
                    this.hasReq = false;
                    if (code === 0) {
                        // 刷新详情信息
                        this.$message.success('操作成功');
                        // 刷新详情信息
                        this.getDetailInfo();
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.hasReq = false;
                    console.log(error);
                }
            },
            /**
             * @description 增加一级审批人
             * @param {Object} data 数据对象
             */
            async handleChangeApprover(data) {
                try {
                    if (this.hasReq) {
                        return;
                    }
                    this.hasReq = true;
                    const params = {
                        employee_id: data.user,
                        approval_id: this.approvalId,
                    };
                    let {
                        data: { code, msg },
                    } = await api.addFirstLevelApprover(params);
                    this.hasReq = false;
                    if (code === 0) {
                        // 成功后刷新当前页信息
                        this.$message.success('操作成功');
                        this.getDetailInfo();
                        this.dialogVisible = false;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.hasReq = false;
                    console.log(error);
                }
            },
        },
    };
</script>

<style lang="less" scoped>
.turn-sign-detail {
    padding: 0 30px;
    background-color: #fff;
    font-size: 14px;
}
.bread-nav {
    padding: 20px 0 10px;
}
.a-link {
    color: #409eff;
}
.part {
    margin-top: 15px;
    .title {
        padding: 10px 0;
        font-size: 16px;
        font-weight: bold;
    }
    .box-wrap {
        padding: 0 20px;
    }
}
.apply-content {
    .base-info {
        display: flex;
        .item {
            flex: 1;
        }
        .label {
            color: rgba(0, 0, 0, 0.85);
            line-height: 1.5;
        }
        .content {
            color: rgba(0, 0, 0, 0.65);
            line-height: 1.5;
        }
    }
}
.certify-file {
    margin-top: 15px;
    .certify-notice {
        color: #f56c6c;
    }
    .certify-file-show {
        margin-top: 15px;
        display: flex;
    }
}
.apply-reason {
    margin-top: 25px;
    display: flex;
    .reason-content {
        flex: 1;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
    }
}
.examine-box {
    .examine-item {
        display: flex;
        padding: 10px 0;
    }
    .ex-title {
        margin-right: 25px;
    }
    .exmine-content {
        flex: 1;
    }
}
.rmark {
    word-break: break-all;
    margin-top: 10px;
}
.back-box {
    padding-left: 60px;
    line-height: 1.8;
}
.detail-footer {
    padding: 20px 0;
    text-align: center;
}
</style>