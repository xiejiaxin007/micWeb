<!--
 * @Name: 邀请销售弹窗
 * @Description: 邀请销售弹窗
 * @Author: xiejiaxin
 * @Date: 2020-02-28
 -->
<template>
<div class="invite-saler-dialog">
    <el-dialog
        custom-class="live-dialog-wrapper process-detail-wrapper"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="show"
        :show-close="false"
        width="520px"
        center>
        <div
            slot="title"
            class="dialog-header">
            线上看房邀请
        </div>
        <div class="dialog-body-box">
            <div class="send-msg-txt">
                复制链接发送给客户，客户可以通过居理买房网app进入直播间开始看房
                <span
                    class="btn btn-copy"
                    v-clipboard:copy="copyUrl"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">复制邀请链接</span>
            </div>
            <!-- 填写手机号 -->
            <div class="choose-house">
                <el-form
                    :model="phoneForm"
                    :rules="rules"
                    class="share-form-box"
                    :inline="true"
                    ref="phoneForm">
                    <el-form-item
                        label="销售手机号"
                        prop="phoneInput"
                        label-width="78px"
                        class="float-layout-box">
                        <jl-number-input
                            placeholder="请输入手机号"
                            reg="int"
                            maxlength="11"
                            v-model="phoneForm.phoneInput"></jl-number-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="phone-form-tip">
                <jl-icon-svg icon-class="svg-warn"></jl-icon-svg>
                <span class="tip-content">添加销售手机号，系统将会给该手机号发送邀请链接</span>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="sendNow">邀请</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {commonFun} from '@/assets/js/utils/utils';
import liveRoomApi from '../api/liveRoomApi';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);
export default {
    name: "invite-saler-dialog",
    props: {
        // 弹窗展示标志
        show: {
            type: Boolean,
            default: false
        },
        // 请求参数
        params: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 供复制的app进入房间的url
        copyUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        // 校验手机号
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写手机号'));
            }
            if (!commonFun.verifyTelNum(value)) {
                return callback(new Error('请填写正确手机号'));
            }
            callback();
        };
        return {
            // 手机号输入值form
            phoneForm: {
                phoneInput: ''
            },
            // 手机号校验对象
            rules: {
                phoneInput: [
                    { required: true, validator: checkPhone, trigger: 'blur' }
                ]
            },
            // 重复提交标志
            isSubmiting: false
        }
    },
    mounted() {
    },
    methods: {
        //  复制成功
        onCopy() {
            this.$message.success('复制成功')
        },
        // 复制失败
        onError() {
            this.$message.error('复制失败');
        },
        // 邀请
        async invatation() {
            let params = {
                room_id: this.params.roomId,
                type: '1',
                user_id: this.phoneForm.phoneInput
            }
            try {
                const {
                    data
                } = await liveRoomApi.invitation(params);
                return data;
            } catch (err) {
                console.log(err)
            }
        },
        // 关闭弹窗
        close() {
            // 情况输入框
            this.phoneForm.phoneInput = '';
            // 校验重置
            this.$refs.phoneForm.resetFields();
            this.$emit('checkShow', false);
        },
        // 立即发送
        sendNow() {
            // 避免重复提交
            if (!this.isSubmiting) {
                this.isSubmiting = true;
                // 重置
                this.$refs['phoneForm'].validate((valid) => {
                    if (valid) {
                        this.invatation().then((data) => {
                            if (data.code === 0) {
                                this.$message({
                                    message: '邀请短信已发送',
                                    type: 'success'
                                });
                                this.$emit('sendStauts', true);
                                this.close();
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                            this.isSubmiting = false;
                        }).catch(() => {
                            this.isSubmiting = false;
                        });
                    } else {
                        // 正在提交按钮置为false
                        this.isSubmiting = false;
                        return false;
                    }
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.process-detail-wrapper{
    height: 100%;
    color: #222;
    /deep/.el-dialog__footer{
        margin-top: 11px;
    }
    .send-msg-txt {
        color: #333;
        font-size: 16px;
        line-height: 22px;
        .btn-copy {
            padding: 0;
            margin-left: 5px;
            border: none;
            font-size: 14px;
            color: #2776ef;
        }
    }
    .choose-house {
        margin-top: 20px;
        height: 38px;
        .share-form-box {
            /deep/ .el-input__inner {
                border-radius: 4px;
            }
        }
    }
    .phone-form-tip {
        margin-top: 24px;
        font-size: 0;
        .svg-icon {
            margin-right: 8px;
            font-size: 14px;
            display: inline-block;
            vertical-align: middle;
        }
        .tip-content {
            line-height: 17px;
            font-size: 12px;
            color: #f19548;
            vertical-align: middle;
        }
    }
}
</style>
<style lang="less">
.invite-saler-dialog{
    .process-detail-wrapper{
        .el-dialog__footer{
            margin-top: 24px;
        }
    }
}
</style>
