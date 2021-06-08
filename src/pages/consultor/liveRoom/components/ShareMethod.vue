<!--
 * @Name: 分享组件
 * @Description: 分享组件
 * @Author: xiejiaxin
 * @Date: 2020-02-27
 -->
<template>
<div class="process-detail-wrapper share-wrapper">
    <div class="hd">选择分享方式</div>
    <div class="bd">
        <div class="share-box">
            <div class="share-method-box share-form-box">
                <el-radio-group
                    @change="changeChosen"
                    v-model="metarialChoose">
                    <el-radio label="1">短信分享</el-radio>
                    <el-radio label="2">微信分享</el-radio>
                </el-radio-group>
            </div>
            <div
                v-show="metarialChoose == 2"
                class="share-wx-box">
                <div class="code-pic">
                    <div
                        v-if="codePic"
                        class="qrcode-box"
                        id="qrcode"
                        ref="qrcode">
                    </div>
                     <img
                        v-else
                        src="../../../../assets/images/img-middle-default.png"
                        alt="二维码加载失败">
                </div>
                <div class="btn-area">
                    <el-button
                        @click="updateAgain"
                        class="btn-custom"
                        type="primary">再次编辑</el-button>
                </div>
            </div>
            <div
                v-show="metarialChoose == 1"
                class="share-msg-box">
                <div class="msg-box share-form-box">
                    <div class="msg-phone">资料将通过短信发送给：{{phone}}</div>
                    <div class="add-phone-box">
                        <el-form
                            :model="phoneForm"
                            :rules="rules"
                            class="share-form-box"
                            :inline="true"
                            ref="phoneForm">
                            <el-form-item
                                label="添加发送手机号："
                                prop="phoneInput"
                                label-width="112px"
                                class="float-layout-box">
                                <jl-number-input
                                    placeholder="请输入手机号"
                                    reg="int"
                                    maxlength="11"
                                    v-model="phoneForm.phoneInput"></jl-number-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="btn-area">
                        <el-button
                            class="btn-custom"
                            @click="updateAgain"
                            type="primary">再次编辑</el-button>
                        <el-button
                            class="btn-custom btn-send"
                            @click="sendNow"
                            type="primary">立即发送</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import QRCode from 'qrcodejs2';
import {commonFun} from '@/assets/js/utils/utils';
import api from '../api/shareMaterialApi';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
export default {
    name: "share-method",
    props: {
        // 分享模块数据
        shareData: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 请求参数
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    components: {
        QRCode
    },
    data() {
        // 校验手机号
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                callback();
            }
            if (!commonFun.verifyTelNum(value)) {
                return callback(new Error('请填写正确手机号'));
            }
            callback();
        };
        return {
            // 分享方式选中项
            metarialChoose: '2',
            // 手机号输入值form
            phoneForm: {
                phoneInput: ''
            },
            // 二维码路径
            codePic: '',
            // 销售默认手机号
            phone: '',
            // 手机号校验对象
            rules: {
                phoneInput: [
                    { required: false, validator: checkPhone, trigger: 'blur' }
                ]
            },
            // 重复提交标志
            isSubmiting: false
        }
    },
    mounted() {
        this.codePic = this.shareData.url;
        this.phone = this.shareData.mobile;
        // 生成二维码
        this.getQrCode();
    },
    computed: {
        ...mapState('liveRoom', ['orderId']),
        ...mapState(['trackCommon'])
    },
    methods: {
        /**
         * 统一埋点
         * @param {String} trackId 埋点ID
         */
        doTrack(trackId) {
            // 埋点
            let obj = {
                share_type: this.metarialChoose,
                order_id: this.orderId,
                adviser_id: this.trackCommon.info.login_employee_id
            };
            commonFun.setTrackNew(trackId, obj);
        },
        // 再次编辑
        updateAgain() {
            // 校验重置
            this.$refs.phoneForm.resetFields();
            // 情况输入框
            this.phoneForm.phoneInput = '';
            // 埋点
            this.doTrack('7236');
            // 跳转到总结模块
            PubSub.publish('changeCurrentStep', {type: 'pre'});
        },
        // 立即发送
        sendNow() {
            // 避免重复提交
            if (!this.isSubmiting) {
                this.isSubmiting = true;
                // 重置
                this.$refs['phoneForm'].validate((valid) => {
                    if (valid) {
                        this.sendSms().then((data) => {
                            if (data.code === 0) {
                                this.$message({
                                    message: '发送成功',
                                    type: 'success'
                                });
                                // 埋点
                            let obj = {
                                order_id: this.orderId,
                                adviser_id: this.trackCommon.info.login_employee_id
                            };
                            commonFun.setTrackNew('7237', obj);
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                            // 数据请求
                            this.isSubmiting = false;
                        }).catch(() => {
                            // 数据请求
                            this.isSubmiting = false;
                        });
                    } else {
                        // 正在提交按钮置为false
                        this.isSubmiting = false;
                        return false;
                    }
                });
            }
        },
        // 发送短信
        async sendSms() {
            try {
                let params = {
                    see_project_id: this.params.seeProId,
                    room_id: this.params.roomId,
                    user_mobile: this.phoneForm.phoneInput
                };
                let result = await api.senMsg(params);
                let {data} = result;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        // 生成二维码
        getQrCode() {
            this.$nextTick(() => {
                this.clearQrcode();
                if (this.codePic) {
                    this.qrcode = new QRCode('qrcode', {
                        text: this.codePic,
                        width: 150,
                        height: 150
                    });
                }
            });
        },
        // 清除二维码
        clearQrcode () {
            this.qrcode && this.qrcode.clear();
            if (this.$refs.qrcode) {
                this.$refs.qrcode.innerHTML = ''
            }
        },
        // 切换分享方式
        changeChosen() {}
    },
    watch: {
        shareData: {
            handler: function (val, oldval) {
                if (val.url) {
                    // 生成二维码
                    this.codePic = val.url;
                    this.getQrCode();
                    this.phone = val.mobile;
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.process-detail-wrapper{
    height: 100%;
    color: #222;
    .hd {
        position: relative;
        line-height: 25px;
        text-indent: 10px;
        color: #222;
        font-size: 18px;
        font-family: PingFangSC-Medium,PingFang SC;
        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            width: 4px;
            height: 18px;
            background-color: #ff4636;
            border-radius: 2px;
        }
    }
    .bd {
        margin-top: 20px;
        background-color: #f4f5f9;
        height: 400px;
    }
}
.share-wrapper {
    .share-box{
        padding-top: 38px;
        box-sizing: border-box;
    }
    .share-method-box {
        text-align: center;
        /deep/.el-radio-group {
            line-height: 16px;
            font-size: 14px;
        }
    }
    .share-wx-box, .share-msg-box{
        margin-top: 28px;
        color: #222;
        font-size: 14px;
    }
    .code-pic {
        width: 150px;
        height: 150px;
        margin: 0 auto;
    }
    .btn-area{
        margin-top: 30px;
        text-align: center;
        font-size: 0;
        /deep/.el-button{
            width: 144px;
            font-size: 16px;
        }
        .btn-send {
            &.el-button--primary {
                margin-left: 24px;
                background-color: #f19548;
                border-color: #f19548;
            }
        }
    }
    .msg-phone {
        line-height: 16px;
    }
    .msg-box {
        width: 370px;
        margin: 0 auto;
    }
    .add-phone-box {
        margin-top: 20px;
        overflow: hidden;
        .th {
            float: left;
            width: 122px;
            line-height: 38px;
        }
        .td {
            overflow: hidden;
        }
        /deep/.el-input {
            .el-input__inner {
                border-radius: 4px;
            }
        }
    }
}
</style>
