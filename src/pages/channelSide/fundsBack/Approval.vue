<!--
 * @Name: 回款流程跟进——审批中的页面
 * @Description: 回款流程跟进——审批中的页面
 * @Author: wangxue
 * @Date: 2020-04-24
-->
<template>
    <div class="follow-up-approval-box">
        <div class="el-row">
            <el-col :span="24"
                class="content-main">
                <!-- 面包屑 -->
                <el-breadcrumb class="bread-crumb-box"
                    separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>
                        <a href="/">首页</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>回款流程跟进</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="content-box">
                    <!-- 回款组 -->
                    <div class="group-table-box">
                        <div class="hd">
                            <h2>回款流程跟进</h2>
                        </div>
                        <div class="bd">
                            <div class="table-title">
                                <ul class="current-page-data clearfix">
                                    <li>
                                        <div class="th">跟进阶段：</div>
                                        <div class="td">{{initData.stage_type}}</div>
                                    </li>
                                    <li>
                                        <div class="th">回款跟进ID：</div>
                                        <div class="td">{{initData.follow_id}}</div>
                                    </li>
                                    <li>
                                        <div class="th">回款组ID：</div>
                                        <div class="td">{{groupId}}</div>
                                    </li>
                                </ul>
                                <ul class="follow-time-data clearfix">
                                    <li>
                                        <div class="th">实际跟进时间：</div>
                                        <div class="td">{{initData.follow_datetime}}</div>
                                    </li>
                                    <li>
                                        <div class="th">预计回款时间：</div>
                                        <div class="td">{{initData.plan_pay_datetime}}</div>
                                    </li>
                                    <li>
                                        <div class="th">跟进人：</div>
                                        <div class="td">{{initData.employee_name}}</div>
                                    </li>
                                </ul>
                            </div>
                            <!-- 表格内容 -->
                            <follow-up-list ref="followUpList"
                                :typeList="type"
                                :id="followId"
                                pageType="2">
                            </follow-up-list>
                            <!-- 跟进记录 -->
                            <div class="follow-content-wrap">
                                <ul class="follow-content">
                                    <!-- 1 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_1">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单业绩是否确认：</div>
                                            <div class="td">{{followUpData.stage_type_1.follow_result === '1' ? "是" : "否"}}</div>
                                        </div>
                                        <div class="follow-item-middle fl">
                                            <div class="th">{{followUpData.stage_type_1.follow_result === '1' ? '业绩确认完成日期：' : '预计业绩确认完成日期：'}}</div>
                                            <div class="td">{{followUpData.stage_type_1.business_datetime}}</div>
                                        </div>
                                        <div class="follow-item-right fl"
                                            v-if="followUpData.stage_type_1.file_type !== '0'">
                                            <div class="th">业绩确认完成的凭证（上传的凭证）：</div>
                                            <div class="td">{{followUpData.stage_type_1.file_type==='1' ? '标准：业绩确认单' : '非标准：微信聊天记录等'}}</div>
                                        </div>
                                        <div class="follow-item-right fl all"
                                                v-if="followUpData.stage_type_1.img_list && followUpData.stage_type_1.img_list.length > 0">
                                            <div class="th">业绩确认单：</div>
                                            <div class="td">
                                                <div class="file-show-box">
                                                    <!-- 文件展示 -->
                                                    <ul class="file-list">
                                                        <li v-for="(item, index) in stageImgList"
                                                            :key="index">
                                                            <a :href="OSSView + item.file_url"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                class="preview-file">{{item.file_name}}</a>
                                                        </li>
                                                    </ul>
                                                    <!-- 图片展示 -->
                                                    <ul class="img-list clearfix">
                                                        <li v-for="(item, index) in stageFileList"
                                                            :key="index">
                                                            <div class="img-item-box">
                                                                <img :src="item.file_url"
                                                                    alt="图片凭证"
                                                                    @click="showPreview(item.file_url)">
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <!-- 2 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_2">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单是否完成「佣金核对」：</div>
                                            <div class="td">{{followUpData.stage_type_2.follow_result === '1' ? "是" : "否"}}</div>
                                        </div>
                                        <div class="follow-item-middle fl">
                                            <div class="th">{{followUpData.stage_type_2.follow_result === '1' ? '佣金核对完成日期：' : '预计佣金核对完成日期：'}}</div>
                                            <div class="td">{{followUpData.stage_type_2.business_datetime}}</div>
                                        </div>
                                        <div class="follow-item-right fl">
                                            <div class="th">佣金核对完成的凭证（上传的凭证）：</div>
                                            <div class="td">{{followUpData.stage_type_2.file_type==='1' ? '标准：对账单' : '非标准：微信聊天记录等'}}</div>
                                        </div>
                                    </li>
                                    <!-- 3 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_3">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单「结佣材料」是否准备齐全，且提交至合作方：</div>
                                            <div class="td">{{followUpData.stage_type_3.follow_result === '1' ? "是" : "否"}}</div>
                                        </div>
                                        <div class="follow-item-middle fl">
                                            <div class="th">{{followUpData.stage_type_3.follow_result === '1' ? '「结佣材料」准备齐全日期：' : '「结佣材料」预计准备齐全日期：'}}</div>
                                            <div class="td">{{followUpData.stage_type_3.business_datetime}}</div>
                                        </div>
                                    </li>
                                    <!-- 4 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_4">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单「结佣材料」：</div>
                                            <div class="td">{{followUpData.stage_type_4.follow_result | stageType4}}</div>
                                        </div>
                                        <div class="follow-item-middle fl"
                                            v-if="followUpData.stage_type_4.follow_result !== '3'">
                                            <div class="th">{{followUpData.stage_type_4.follow_result === '1' ? '合作方「结佣材料」审核通过日期：' : '合作方「结佣材料」预计审核通过日期：'}}</div>
                                            <div class="td">{{followUpData.stage_type_4.business_datetime}}</div>
                                        </div>
                                        <div class="follow-item-right fl"
                                            v-if="followUpData.stage_type_4.follow_result === '3'">
                                            <div class="th">原因：</div>
                                            <div class="td">{{followUpData.stage_type_4.follow_reason}}</div>
                                        </div>
                                    </li>
                                    <!-- 5 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_5">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单「发票」进度：</div>
                                            <div class="td">{{followUpData.stage_type_5.follow_result | stageType5}}</div>
                                        </div>
                                        <div class="follow-item-middle fl"
                                            v-if="followUpData.stage_type_5.follow_result !== '2'">
                                            <div class="th">{{followUpData.stage_type_5.follow_result | stageType5TimeTitle}}</div>
                                            <div class="td">{{followUpData.stage_type_5.business_datetime}}</div>
                                        </div>
                                        <div class="follow-item-right fl"
                                            v-if="followUpData.stage_type_5.follow_result > 3">
                                            <div class="th">原因：</div>
                                            <div class="td">{{followUpData.stage_type_5.follow_reason}}</div>
                                        </div>
                                    </li>
                                    <!-- 6 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_6">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单「付款审批」：</div>
                                            <div class="td">{{followUpData.stage_type_6.follow_result | stageType6}}</div>
                                        </div>
                                        <div class="follow-item-middle fl"
                                            v-if="followUpData.stage_type_6.follow_result !== '3'">
                                            <div class="th">{{followUpData.stage_type_6.follow_result === '1' ? '合作方「付款审批」通过日期：' : '合作方「付款审批」预计通过日期：'}}</div>
                                            <div class="td">{{followUpData.stage_type_6.business_datetime}}</div>
                                        </div>
                                        <div class="follow-item-right fl"
                                            v-if="followUpData.stage_type_6.follow_result === '3'">
                                            <div class="th">原因：</div>
                                            <div class="td">{{followUpData.stage_type_6.follow_reason}}</div>
                                        </div>
                                    </li>
                                    <!-- 7 -->
                                    <li class="follow-item clearfix"
                                        v-if="followUpData.stage_type_7">
                                        <div class="follow-item-left fl">
                                            <div class="th">以上成交单「付款进度」：</div>
                                            <div class="td">{{followUpData.stage_type_7.follow_result | stageType7}}</div>
                                        </div>
                                        <div class="follow-item-middle fl">
                                            <div class="th">{{followUpData.stage_type_7.follow_result === '1' ? '实际付款日期：' : '预计付款日期：'}}</div>
                                            <div class="td">{{followUpData.stage_type_7.business_datetime}}</div>
                                        </div>
                                        <div class="follow-item-right fl"
                                            v-if="followUpData.stage_type_7.follow_result === '3'">
                                            <div class="th">原因：</div>
                                            <div class="td">{{followUpData.stage_type_7.follow_reason}}</div>
                                        </div>
                                    </li>
                                    <!-- 重置阶段 -->
                                    <li class="follow-item clearfix"
                                        v-if="initData.back_stage_type">
                                        <div class="follow-item-left fl">
                                            <div class="th">重置回哪个阶段：</div>
                                            <div class="td">{{initData.back_stage_type}}</div>
                                        </div>
                                    </li>
                                    <!-- 凭证 -->
                                    <li class="follow-item clearfix">
                                        <div class="th">本次跟进凭证：</div>
                                        <div class="td">
                                            <div class="file-show-box"
                                                v-if="initData.file">
                                                <!-- 文件展示 -->
                                                <ul class="file-list">
                                                    <template v-for="(item, index) in initData.file">
                                                        <li v-if="item.file_type==='2'"
                                                            :key="index">
                                                            <a :href="OSSView + item.file_url"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                class="preview-file">{{item.file_name}}</a>
                                                        </li>
                                                    </template>
                                                </ul>
                                                <!-- 图片展示 -->
                                                <ul class="img-list clearfix">
                                                    <template v-for="(item, index) in initData.file">
                                                        <li v-if="item.file_type==='1'"
                                                            :key="index">
                                                            <div class="img-item-box">
                                                                <img :src="item.file_url"
                                                                    alt="图片凭证"
                                                                    @click="showPreview(item.file_url)">
                                                            </div>
                                                        </li>
                                                    </template>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="follow-item clearfix">
                                        <div class="th">跟进说明：</div>
                                        <div class="td">{{initData.follow_text}}</div>
                                    </li>
                                    <li class="follow-item clearfix">
                                        <div class="th">下次跟进时间：</div>
                                        <div class="td">{{initData.next_follow_datetime}}</div>
                                    </li>
                                    <li class="follow-item clearfix">
                                        <div class="th">跟进人：</div>
                                        <div class="td">{{initData.next_employee_name}}</div>
                                    </li>
                                </ul>
                            </div>
                            <!-- 审批按钮 -->
                            <div class="approval-btn-box"
                                v-if="!initData.audit_employee_name && initData.leader_id === loginId">
                                <el-button @click="rejectDialog = true">驳回</el-button>
                                <el-button type="primary"
                                    @click="approvalRes('2')">通过</el-button>
                            </div>
                            <!-- 审批结果 -->
                            <div class="table-title"
                                v-else>
                                <ul class="clearfix">
                                    <li>
                                        <div class="th">审批时间：</div>
                                        <div class="td">{{initData.audit_datetime}}</div>
                                    </li>
                                    <li>
                                        <div class="th">审批结果：</div>
                                        <div class="td">{{initData.audit_status}}</div>
                                    </li>
                                    <li>
                                        <div class="th">审批人：</div>
                                        <div class="td">{{initData.audit_employee_name}}</div>
                                    </li>
                                </ul>
                                <ul v-if="initData.reject_text !== '0'"
                                    class="reject-text clearfix">
                                    <li>
                                        <div class="th">驳回原因：</div>
                                        <div class="td">{{initData.reject_text}}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </div>
        <reject-dialog title="驳回原因"
            :visible="rejectDialog"
            :maxLength="200"
            @close="rejectDialog = false"
            @confirm="(reason) => approvalRes('3', reason)"></reject-dialog>
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="photoIsShow"
            :showViewer="photoIsShow"
            :urlList="previewUrl"
            @closeViewer="closeViewer">
        </jl-image-preview>
    </div>
</template>

<script>
    import { RejectDialog } from '@/components';
    import followApi from './api/followApi';
    import FollowUpList from './components/FollowUpList';
    import { mapState } from 'vuex';
    export default {
        name: 'follow-up-approval',
        components: {
            FollowUpList,
            RejectDialog
        },
        data() {
            return {
                // 跟进id
                followId: this.$route.query.followId,
                // 回款组id
                groupId: this.$route.query.groupId,
                // 表格类型 1是单个 2是回款组
                type: '2',
                // 初始化数据
                initData: {},
                // 阶段数据
                followUpData: {},
                // 驳回弹窗
                rejectDialog: false,
                // 图片预览
                photoIsShow: false,
                // 图片预览的url
                previewUrl: [],
                loading: '',
                // 重复提交
                isSubmit: true,
                // 当前登录人
                loginId: ''
            };
        },
        mounted() {
            // 初始化数据
            this.init();
        },
        methods: {
            /**
             * 图片预览
             * @param {String} previewUrl 预览图片url
             * @return
             */
            showPreview(previewUrl) {
                this.photoIsShow = true;
                this.previewUrl = [previewUrl];
            },
            // 关闭大图预览
            closeViewer() {
                this.photoIsShow = false;
                this.previewUrl = [];
            },
            // 初始化数据
            async init() {
                this.beforeRequest();
                let params = {
                    follow_id: this.followId
                };
                try {
                    let { data } = await followApi.followDetail(params);
                    if (data.code === 0) {
                        this.initData = data.data;
                        this.followUpData = data.data.stage_type_list;
                    }
                    this.loading.close();
                } catch (error) {
                    console.log(error);
                    this.loading.close();
                }
            },
            /**
             * 审批
             * @param {String} type 审批结果
             * @param {String} reason 驳回原因
             * @return
             */
            async approvalRes(type, reason) {
                // 重复提交
                if (this.isSubmit) {
                    this.isSubmit = false;
                    let params = {
                        follow_id: this.followId,
                        audit_status: type,
                        reject_text: reason
                    };
                    try {
                        let { data } = await followApi.followAudit(params);
                        if (data.code === 0) {
                            this.init();
                        }
                        this.$message(data.msg);
                        this.isSubmit = true;
                        // 如果是驳回 把弹窗关掉
                        if (type === '3') {
                            this.rejectDialog = false;
                        }
                    } catch (error) {
                        console.log(error);
                        this.isSubmit = true;
                    }
                }
            },
            // loading
            beforeRequest() {
                this.loading = this.$loading({
                    lock: true,
                    text: '请求中，请稍后',
                    spinner: 'el-icon-loading',
                    customClass: 'loading-default-box',
                    background: 'rgba(255, 255, 255, 0.8)'
                });
            }
        },
        computed: {
            ...mapState({
                uid: state => state.userInfo.uid
            }),
            // 业绩确认阶段图片
            stageImgList() {
                let arr = this.followUpData.stage_type_1.img_list.filter(item => item.file_type === '2')
                return arr;
            },
            // 业绩确认文件
            stageFileList() {
                let arr = this.followUpData.stage_type_1.img_list.filter(item => item.file_type === '1')
                return arr;
            }
        },
        filters: {
            stageType4(value) {
                let val = '';
                switch (value) {
                    case '1':
                        val = '合作方审核通过，材料没问题';
                        break;
                    case '2':
                        val = '合作方审核中';
                        break;
                    case '3':
                        val = '合作审核不通过，材料有问题';
                        break;
                }
                return val;
            },
            stageType5(value) {
                let val = '';
                switch (value) {
                    case '1':
                        val = '已开票，对方已经收到';
                        break;
                    case '2':
                        val = '无需开票';
                        break;
                    case '3':
                        val = '已开票，已邮寄';
                        break;
                    case '4':
                        val = '已开票，未邮寄';
                        break;
                    case '5':
                        val = '开票审批已提交，待开票';
                        break;
                    case '6':
                        val = '开票审批未提交';
                        break;
                }
                return val;
            },
            stageType5TimeTitle(value) {
                let val = '';
                switch (value) {
                    case '1':
                        val = '合作方收到「发票」日期：';
                        break;
                    case '3':
                    case '4':
                        val = '预计收到发票日期：';
                        break;
                    case '5':
                    case '6':
                        val = '预计开票日期：';
                        break;
                }
                return val;
            },
            stageType6(value) {
                let val = '';
                switch (value) {
                    case '1':
                        val = '合作方审批通过';
                        break;
                    case '2':
                        val = '合作方审批中';
                        break;
                    case '3':
                        val = '合作方审批不通过';
                        break;
                }
                return val;
            },
            stageType7(value) {
                let val = '';
                switch (value) {
                    case '1':
                        val = '已完成全部付款';
                        break;
                    case '2':
                        val = '等待付款';
                        break;
                    case '3':
                        val = '付款失败';
                        break;
                }
                return val;
            }
        },
        watch: {
            // 监听当前登录人信息
            uid: {
                deep: true,
                handler: function(val) {
                    this.loginId = String(val);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.follow-up-approval-box {
    padding: 0 30px 50px;
    .content-box {
        background: #fff;
        h2 {
            line-height: 50px;
            padding-left: 10px;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }
        .group-table-box {
            .bd {
                padding: 0 30px 30px;
            }
        }
        li {
            line-height: 40px;
            font-size: 14px;
            .th {
                float: left;
            }
            .td {
                float: left;
            }
        }
    }
}
.table-title {
    .current-page-data {
        font-weight: bold;
    }
    li {
        float: left;
        height: 40px;
        line-height: 40px;
        margin-right: 50px;
    }
    .reject-text {
        li {
            height: auto;
            line-height: 20px;
        }
        .td {
            width: 800px;
        }
    }
}
.file-show-box {
    .file-list {
        .preview-file {
            color: #00f;
            text-decoration: underline;
            margin: 0 10px;
        }
    }
    .img-list {
        margin-top: 16px;
        li {
            float: left;
            width: 100px;
            height: 130px;
            text-align: center;
            margin-right: 12px;
            .img-item-box {
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #eee;
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }
}
.reason-tips {
    height: 30px;
    line-height: 30px;
    float: right;
    color: #aaa;
}
.approval-btn-box {
    text-align: center;
    padding-bottom: 30px;
}
.follow-content-wrap {
    margin: 20px 0;
    .th {
        font-weight: bold;
    }
    .follow-item {
        margin-bottom: 20px;
        .follow-item-left {
            width: 450px;
        }
        .follow-item-middle {
            width: 450px;
        }
        .fl {
            float: left;
        }
        .all {
            width: 100%;
        }
    }
}
</style>
