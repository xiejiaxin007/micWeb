<template>
<div class="con-dialog-wrap">
    <!-- 线上看房相关弹窗 -->
    <div class="online-dialog">
        <!-- 线上看房提醒 -->
        <el-dialog
            :visible="invitationShow"
            width="520px"
            :close-on-press-escape="false"
            :show-close="false"
            :before-close="cancelInvitation"
            center>
            <div
                slot="title"
                class="dialog-header">
                线上看房邀请
            </div>
            <div class="dialog-body">
                <div class="content-text">
                    复制链接发送给客户，客户可以通过居理买房网app进入直播间开始看房
                    <el-button
                        type="text"
                        v-clipboard:copy="shareUrl"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">复制邀请链接</el-button>
                </div>
                <div class="mini-qrcode">
                    <img :src="miniProgramQrcode" alt="小程序二维码">
                </div>
                <div class="radio-area">
                    <el-radio
                        v-model="employeeType"
                        label="1">销售</el-radio>
                    <el-radio
                        v-model="employeeType"
                        label="2">咨询师或咨询主管</el-radio>
                </div>
                <div v-if="employeeType==='1'">
                    <div class="input-box">
                        <div class="th">手机号</div>
                        <div class="td">
                            <el-input
                                v-model="phone"
                                :class="{'tip-border' : wrongTipsPhone}"
                                placeholder="请输入手机号"></el-input>
                            <div class="wrong-tips">{{wrongTipsPhone}}</div>
                        </div>
                    </div>
                    <div class="tips">
                        <jl-icon-svg icon-class="online-dialog-tips"></jl-icon-svg>
                        <span>添加销售手机号，系统将会给该手机号发送邀请链接</span>
                    </div>
                </div>
                <div v-if="employeeType==='2'">
                    <div class="input-box">
                        <div class="th">员工姓名：</div>
                        <div class="td">
                            <el-select
                                class="select-box"
                                :class="{'tip-border' : wrongTipsName}"
                                v-model="userId"
                                filterable
                                remote
                                :remote-method="getEmployeeList"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in employeeList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <div class="wrong-tips">{{wrongTipsName}}</div>
                        </div>
                    </div>
                    <div class="tips">
                        <jl-icon-svg icon-class="online-dialog-tips"></jl-icon-svg>
                        <span>邀请居理咨询师或主管进入房间一起线上带看</span>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    class="cancel"
                    @click="cancelInvitation">取消</el-button>
                <el-button
                    class="confirm"
                    @click="invatation">邀请</el-button>
            </span>
        </el-dialog>
        <!-- 关闭直播间提示 -->
        <el-dialog
            :visible.sync="closeRoom"
            width="430px"
            :close-on-press-escape="false"
            :show-close="false"
            center>
            <div
                slot="title"
                class="dialog-header">
                提示
            </div>
            <div class="dialog-body">
                <div class="content-txt">
                    是否关闭直播间？关闭直播间后将结束视频看房，离开直播间则仅你一人退出
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    class="cancel"
                    @click="leaveRoomFun">离开直播间</el-button>
                <el-button
                    class="confirm"
                    @click="closeRoomFun">关闭直播间</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>

<script>
import {
    commonFun
} from '@/assets/js/utils/utils';
import commonApi from '@/api/commonApi';
import liveRoomApi from '../api/liveRoomApi';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);
import { mapState } from 'vuex';
export default {
    data() {
        return {
            // 人员类型
            employeeType: '1',
            // 员工列表
            employeeList: '',
            // 员工id
            userId: '',
            // 销售手机号
            phone: '',
            // 手机号错误提示
            wrongTipsPhone: '',
            // 员工提示
            wrongTipsName: '',
            closeRoom: false
        };
    },
    props: {
        // 线上看房邀请是否展示
        invitationShow: {
            type: Boolean,
            default: false
        },
        // 房间id
        roomId: {
            type: String,
            default: ''
        },
        // 关闭直播间
        // closeRoom: {
        //     type: Boolean,
        //     default: false
        // },
        // 城市id
        cityId: {
            type: String,
            default: ''
        },
        // 分享链接
        shareUrl: {
            type: String,
            default: ''
        }
    },
    mounted() {
        // 获取员工下拉列表
        this.getEmployeeList();
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
        // 取消看房
        cancelInvitation() {
            this.$emit("cancelInvitation");
            this.wrongTipsPhone = '';
            this.wrongTipsName = '';
            this.phone = '';
            this.userId = '';
        },
        // 邀请
        async invatation() {
            let params = {
                room_id: this.roomId,
                type: this.employeeType
            }
            if (this.employeeType === '1') {
                if (this.phone === '') {
                    this.wrongTipsPhone = '手机号不可为空';
                    return;
                } else if (!commonFun.verifyTelNum(this.phone)) {
                    this.wrongTipsPhone = '手机号不正确，请重新输入';
                    return;
                }
                params.user_id = this.phone;
            } else {
                if (this.userId === '') {
                    this.wrongTipsName = '请选择员工姓名';
                    return;
                }
                params.user_id = this.userId;
            }
            try {
                const {
                    data
                } = await liveRoomApi.invitation(params);
                this.$message(data.msg);
                this.cancelInvitation();
            } catch (err) {
                console.log(err)
            }
        },
        /**
         * @description: 获取员工下拉
         * @param {String} q 搜索内容
         * @return: Promise
         */
        async getEmployeeList(q) {
            let params = {
                q
            }
            try {
                const {
                    data
                } = await commonApi.getPageEmployee(params);
                if (data.code === 0) {
                    this.employeeList = data.data.list;
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 关闭直播间
        closeRoomFun() {
            this.$emit("closeRoomFun");
        },
        // 离开直播间
        leaveRoomFun() {
            this.$emit("leaveRoomFun");
        }
    },
    computed: {
        ...mapState('liveRoom', ['miniProgramQrcode'])
    }
};
</script>
<style lang="less" scoped>
/deep/.online-dialog {
    .el-dialog {
        margin: 0!important;
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
    }
    .el-dialog__header {
        padding: 30px 0 24px;
        border: none;

        .dialog-header {
            height: 32px;
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #222;
            line-height: 32px;
        }
    }

    .el-dialog__body {
        padding: 0 24px;

        .content-text {
            height: 44px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333;
            line-height: 22px;

            .el-button {
                color: #2776EF;
                padding: 0;
                margin-left: 5px;
            }
        }
        .content-txt {
            height:40px;
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:#3E4254;
            line-height:20px;
        }
        .mini-qrcode {
            text-align: center;
            margin-top: 10px;
            img {
                width: 160px;
                height: 160px;
            }
        }
        .radio-area {
            margin: 10px 0;
            height: 16px;
            line-height: 16px;
            .el-radio {
                height: 16px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333;
                line-height: 16px;
                margin-right: 30px;

                .el-radio__label {
                    height: 16px;
                    line-height: 16px;
                    padding-left: 8px;
                }
                &.is-checked {
                    .el-radio__inner {
                        border-color: #2776EF;
                        background: #2776EF;
                    }
                    .el-radio__label {
                        color: #2776EF;
                    }
                }
            }
        }

        .input-box {
            margin-bottom: 20px;
            height: 38px;

            .th {
                float: left;
                height: 38px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #222;
                line-height: 38px;
                margin-right: 10px;
            }

            .td {
                float: left;
                .tip-border {
                    .el-input__inner {
                        border: 1px solid #F64A4A;
                    }
                    &.select-box {
                       .el-input__inner {
                            border: 1px solid #F64A4A;
                        } 
                    }
                }
                .el-input__inner {
                    width: 420px;
                    height: 38px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding-left: 12px;
                    color: #222;
                }
                .select-box {
                    .el-input__inner {
                        width: 392px;
                        height: 38px;
                        border: 1px solid #ccc;
                    }
                }

                .el-input__icon {
                    line-height: 30px;
                }

                .wrong-tips {
                    height: 14px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #F64A4A;
                    line-height: 14px;
                    margin-top: 2px;
                }
            }
        }

        .tips {
            height: 17px;
            line-height: 17px;
            .svg-icon {
                font-size: 12px;
                line-height: 17px;
                height: 17px;
                margin-right: 3px;
                vertical-align: middle;
            }

            span {
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FF8800;
                line-height: 17px;
            }
        }
    }

    .el-dialog__footer {
        padding: 10px 0 30px;

        .el-button {
            height: 40px;
            border-radius: 4px;
            padding: 8px 30px;
            border: none;

            &.confirm {
                background: #2776EF;
                color: #fff;
            }
            &.cancel {
                color: #222;
                margin-right: 14px;
                border:1px solid #ddd;
            }
            span {
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                line-height: 22px;
            }
        }
    }
}
</style>