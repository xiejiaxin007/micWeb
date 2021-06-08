<!--
 * @author: kangxue
 * @Date: 2020-07-16 11:28:54
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-30 11:15:48
 * @description: 按钮操作
-->
<template>
    <div class="follow-opt-box">
        <!-- 咨询部跟进 客诉处理表单  识别value:5 -->
        <complaint-form v-if="showForm('5')"
            ref="complaintForm"
            :formInfo="editForm"
            :updateTime="updateTime"
            @save="saveBack"></complaint-form>
        <!-- 楼盘任务跟进；  楼盘反馈表单   识别value:6 -->
        <feed-back-form v-if="showForm('6')"
            ref="feedBackForm"
            :formInfo="editForm"
            :updateTime="updateTime"
            @save="saveBack"></feed-back-form>
        <!-- 品控服管二次跟进，录入绩效处理结果；绩效红黄线表单  识别value:8 -->
        <performance-form v-if="showForm('8')"
            ref="performanceForm"
            :performanceOptions="options.performance"
            :lineOptions="options.readLine"
            :formInfo="editForm"
            :updateTime="updateTime"
            @save="saveBack"></performance-form>
        <!-- 咨询部申诉  申诉表单  识别value:9  要点击申诉按钮才展示 -->
        <appeal-form v-if="showForm('9') && isAppeal"
            ref="appealForm"
            :formInfo="editForm"
            :updateTime="updateTime"
            @save="saveBack"></appeal-form>
        <!-- 操作按钮 -->
        <div class="fix-buttons">
            <!-- 新建编辑的保存按钮组 -->
            <router-link v-if="isEdit"
                :to="{ path: '/complaint/complaintList' }">
                <el-button>取消</el-button>
            </router-link>
            <el-button v-if="isEdit"
                type="primary"
                @click="save">保存</el-button>
            <!-- 跟进表单操作的按钮 -->
            <template v-if="followBtns && followBtns.length > 0">
                <span v-for="item in followBtns"
                    :key="item.value">
                    <router-link :to="{ path: '/complaint/complaintList' }">
                        <el-button>取消</el-button>
                    </router-link>
                    <el-button type="primary"
                        @click="handleClick(item.value)">保存</el-button>
                </span>
            </template>
            <!-- 申诉按钮，比较特殊，点击后才出表单 -->
            <template v-if="showForm('9')">
                <el-button type="danger"
                    v-if="!isAppeal"
                    @click="isAppeal = true">申诉</el-button>
                <span v-else>
                    <el-button type="primary"
                        @click="handleClick('9')">保存</el-button>
                </span>
            </template>
            <!-- 直接操作的按钮 -->
            <template v-if="optBtns && optBtns.length > 0">
                <el-button v-for="item in optBtns"
                    :key="item.value"
                    :type="checkBtnColor(item.value)"
                    @click="handleClick(item.value)">{{item.name}}</el-button>
            </template>
        </div>
        <!-- 关闭任务，确认无误弹窗 -->
        <confirm-dialog :title="dialog.title"
            :content="dialog.content"
            :confirmBtn="dialog.confirmBtn"
            :visible="dialog.visible"
            @cancel="dialog.visible = false"
            @confirm="confirmCloseTask"></confirm-dialog>
        <!-- 驳回弹窗 -->
        <reject-dialog title="驳回客诉问题"
            :visible="rejectVisible"
            @close="rejectVisible = false"
            @confirm="confirmReject"></reject-dialog>
        <!-- 任务变更提示弹窗 -->
        <alert-dialog
            :visible.sync="updateMsgVisible"
            confirmBtn="我知道了"
            @confirm="reload">
            <div>任务已发生变更，关闭弹窗后会刷新任务，请确认任务后再次跟进，刷新后当前已跟进的信息无法保存！</div>
        </alert-dialog>
    </div>
</template>

<script>
import ComplaintForm from './ComplaintForm';
import FeedBackForm from './FeedBackForm';
import PerformanceForm from './PerformanceForm';
import AppealForm from './AppealForm';
import { AlertDialog, ConfirmDialog, RejectDialog } from '@/components';
import api from '../api/complaint';
export default {
    name: 'BtnOpts',
    components: {
        ComplaintForm,
        FeedBackForm,
        PerformanceForm,
        AppealForm,
        ConfirmDialog,
        RejectDialog,
        AlertDialog
    },
    props: {
        // 按钮组
        btns: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 是否是新建编辑页
        isEdit: {
            type: Boolean,
            default: false
        },
        // 表单中需要的静态下拉
        options: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 表单中需要编辑提交的数据：投诉对象及原因，是否万单
        formInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 客诉上一次更新时间，校验是否变更使用
        updateTime: {
            type: String,
            default: ''
        }
    },
    computed: {
        // 筛选出要保存表单的按钮，这些按钮需要展示取消+保存两个按钮
        followBtns: function() {
            let arr = ['5', '6', '7', '8'];
            return this.btns.filter(function(item) {
                return arr.indexOf(item.value) !== -1;
            });
        },
        // 筛选出可以直接操作的表单
        optBtns: function() {
            let arr = ['5', '6', '7', '8', '9'];
            return this.btns.filter(function(item) {
                return arr.indexOf(item.value) === -1;
            });
        },
        // 当前展示的按钮的值组成的数组
        activeBtns: function() {
            return this.btns.map(function(item) {
                return item.value;
            });
        },
        // 获取要保存的投诉对象运营，是否万单数据
        editForm: function() {
            return {
                complaint_category: this.formInfo.reason[0] || '',
                one_cause: this.formInfo.reason[1] || '',
                two_cause: this.formInfo.reason[2] || '',
                three_cause: this.formInfo.reason[3] || '',
                is_many_order: this.formInfo.isOrderQuestion
            };
        }
    },
    data() {
        return {
            // 是否点击申诉按钮
            isAppeal: false,
            // 客诉ID
            id: this.$route.query.id,
            // 确认弹窗参数
            dialog: {
                visible: false,
                title: '',
                content: '',
                confirmBtn: '',
                type: ''
            },
            // 驳回弹窗
            rejectVisible: false,
            // 驳回类型，buttons返回的value值
            rejectType: '',
            // 任务变更提示弹窗
            updateMsgVisible: false
        };
    },
    methods: {
        // 新建编辑客诉任务保存按钮
        save() {
            this.$emit('save', true);
        },
        /**
         * @description: 是否展示跟进表单
         * @param {string} type   表单在按钮中对应的value值
         * @return:
         */
        showForm(type) {
            return this.activeBtns.indexOf(type) !== -1;
        },
        /**
         * @description: 按钮展示颜色  驳回、关闭任务展示红色按钮
         * @param {string} type   表单在按钮中对应的value值
         * @return:
         */
        checkBtnColor(type) {
            let arr = ['1', '2', '3', '4', '13'];
            return arr.indexOf(type) !== -1 ? 'danger' : 'primary';
        },
        /**
         * @description: 按钮点击事件
         * @description: 1=>业务任务驳回  2=>品控服管任务驳回   3=>咨询部任务驳回（总体来说就是编辑时出现的驳回）
         * @description: 4=>关闭任务   10=>确认无误   11=>确认收到  14=>撤销申诉   13=>品控服管驳回咨询部处理结果
         * @description: 表单操作后端传回跟进按钮，实际展示取消+保存 5=>客诉处理表单  6=>楼盘反馈表单  8=>绩效红黄线  9=>申诉
         * @description:   7=>服管处理  编辑客诉任务上的服管
         * @param {string} type   按钮识别id
         * @return:
         */
        handleClick(type) {
            switch (type) {
                // 驳回
                case '1':
                case '2':
                case '3':
                case '13':
                    this.rejectVisible = true;
                    this.rejectType = type;
                    break;
                // 关闭任务
                case '4':
                    this.dialog = {
                        visible: true,
                        title: '关闭任务',
                        content: '您确认要关闭此任务吗？任务关闭后，无法重新开启，只能重新新建客诉任务！',
                        confirmBtn: '关闭',
                        type: type
                    };
                    break;
                // 确认无误
                case '10':
                    this.dialog = {
                        visible: true,
                        title: '提示',
                        content: '确认无误后，无法再针对品控绩效处理结果发起申诉，请谨慎操作',
                        confirmBtn: '继续确认',
                        type: type
                    };
                    break;
                case '11':
                case '14':
                    this.handleFollow(type);
                    break;
                // 客诉处理表单    咨询部跟进
                case '5':
                    this.$refs.complaintForm.validateForm(this.id, type);
                    break;
                // 楼盘反馈表单    楼盘任务跟进
                case '6':
                    this.$refs.feedBackForm.validateForm(this.id, type);
                    break;
                // 服管处理保存    品控、服管跟进，录入服管处理建议
                case '7':
                    this.$emit('saveSuggest', true);
                    break;
                // 绩效红黄线表单   品控服管二次跟进，录入绩效处理结果
                case '8':
                    this.$refs.performanceForm.validateForm(this.id, type);
                    break;
                //  申诉表单     咨询部申诉
                case '9':
                    this.$refs.appealForm.validateForm(this.id, type);
                    break;
            }
        },
        // 确定 => 关闭任务/确认无误
        confirmCloseTask() {
            this.handleFollow(this.dialog.type);
        },
        /**
         * @description: 确定驳回
         * @param {String} reason  驳回原因
         * @return:
         */
        async confirmReject(reason) {
            try {
                let params = {
                    complaints_id: this.id,
                    follow_type: this.rejectType,
                    update_datetime: this.updateTime,
                    reason: reason,
                    yw_complaints: this.editForm
                };
                const {
                    data: { code, msg, data }
                } = await api.rejectTask(params);
                this.rejectVisible = false;
                this.saveBack({ code, msg, data }, this.rejectType, '该任务已驳回成功，请悉知');
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description:  确认无误/确认收到/撤销申诉/关闭任务
         * @param {string} type   buttons带的value值
         * @return:
         */
        async handleFollow(type) {
            try {
                let params = {
                    complaints_id: this.id,
                    follow_type: type,
                    update_datetime: this.updateTime
                };
                const {
                    data: { code, msg, data }
                } = await api.commonFollow(params);
                let successMsg = type === '4' ? '任务关闭成功' : '';
                if (type === '4' || type === '10') {
                    this.dialog.visible = false;
                }
                this.saveBack({ code, msg, data }, type, successMsg);
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 跟进操作返回结果处理，因为多个跟进操作结果都有任务变更的判断，所以返回父组件统一处理
         * @param {Object} { code, msg, data }   请求接口返回的数据
         * @param {String} type  跟进按钮识别
         * @param {String} successMsg  成功提示信息
         * @return:
         */
        saveBack({ code, msg, data }, type, successMsg) {
            if (code === 0) {
                // 需要更新任务跟进页
                this.$message({
                    message: successMsg || msg,
                    type: 'success'
                });
                // 编辑页面的关闭驳回按钮操作了都是进入跟进页
                if (this.isEdit) {
                    this.$router.push({
                        path: '/complaint/followComplaint',
                        query: {
                            id: this.id
                        }
                    });
                } else {
                    this.$emit('reload', true);
                }
            } else if (code === -2) {
                this.handleTaskUpdate();
            } else {
                this.$message.error(msg);
            }
        },
        // 展示任务变更提示弹窗
        handleTaskUpdate() {
            this.updateMsgVisible = true;
        },
        // 点击关闭弹窗，刷新任务详情页，停留在任务编辑页面
        reload() {
            this.updateMsgVisible = false;
            this.$emit('reload', true);
        }
    }
};
</script>

<style lang="less" scoped>
.follow-opt-box {
    background: #fff;
    margin-top: -20px;
    margin-bottom: 20px;
    .fix-buttons {
        text-align: center;
        background: #fff;
        padding: 10px;
        .el-button {
            margin: 0 20px;
        }
    }
}
</style>