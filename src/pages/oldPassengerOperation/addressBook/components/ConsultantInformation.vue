<!--
 * @Name: 咨询师信息
 * @Description: 咨询师信息组件
 * @Author: baiyunfei
 * @Date: 2019-09-24 16:45:00
 * @Editors: baiyunfei
 -->
<template>
    <div class="consultant-information">
        <div class="information-status">
            <div
                v-if="data.status ==='100'"
                class="status-info">
                <i class="icon-success" aria-hidden="true"></i>
                <span>数据上传正常</span>
            </div>
            <div
                v-else
                class="status-info">
                <i class="el-icon-warning" aria-hidden="true"></i>
                <span>数据上传失败</span>
            </div>
            <div class="update-time">上次更新 {{data.update_datetime}}</div>
        </div>
        <div class="consultant-info">
            <img class="consultant-avatar"
                :src="data.head_img"
                alt="咨询师头像"
                />
            <div class="consultant-name">{{data.nike_name}}</div>
            <div class="consultant-wx">{{data.wx_number}}</div>
        </div>
        <div
            @click="syscWechatFun()"
            v-if="role === 'header'"
            class="update-button">更新微信数据</div>
        <el-dialog
            custom-class="consultant-dialog"
            :visible.sync="centerDialogVisible"
            width="437px"
            :show-close="showClose"
            center>
            <div
                class="consultant-dialog-title"
                slot="title">
                <i class="el-icon-warning" aria-hidden="true"></i>
                <span>上传微信数据提示</span>
            </div>
            <p>请【打开自研手机的推送消息】，打开后数据即可立即上传</p>
            <p>您也可以打开「咨询师APP」的「订单详情」点击「上传微信数据」手动上传</p>
            <p class="consultant-dialog-tips">上传有2分钟的延迟请耐心等待</p>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    mapState
} from "vuex";
import defultImg from '../../../../assets/images/img-user-avatar.png';
import addressBookListApi from "../api/addressListApi";
export default {
    data() {
        return {
            // 上传微信提示弹窗
            centerDialogVisible: false,
            // 隐藏弹窗关闭按钮
            showClose: false,
            // 展示数据
            data: {
                head_img: defultImg,
                nike_name: '微信昵称',
                wx_number: '微信账号'
            }
        };
    },
    props: {
        // 父组件传递给自组件的数据
        dataObj: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    watch: {
        dataObj(val) {
            this.data = val;
        }
    },
    methods: {
        /**
         * @description: 同步微信好友列表
         * @param {type}
         * @return:
         */
        async syscWechatFun() {
            this.centerDialogVisible = !this.centerDialogVisible;
            try {
                await addressBookListApi.syncWechat();
            } catch (error) {}
        }
    },
    computed: {
        ...mapState({
            uid: state => {
                if (state.role === "header") {
                    return state.uid;
                } else {
                    return localStorage.getItem("headerUid");
                }
            },
            // 权限： 咨询师主管 需要传咨询师主管id
            role: state => {
                return state.role;
            }
        })
    },
};
</script>

<style lang="less" scoped>
/deep/ .consultant-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;

    >.el-dialog__body {
        padding-top: 10px;
        padding-bottom: 10px;
        overflow: auto;
        color: #666666;

        p {
            margin-bottom: 12px;
            font-size: 14px;
            color: #666;
        }

        .consultant-dialog-tips {
            font-size: 12px;
            color: #ff4958;
        }
    }

    .dialog-footer {
        button {
            height: 65px;
            height: 32px;
            padding-top: 0;
            padding-bottom: 0;
            line-height: 32px;
        }
    }
}

.consultant-information {
    width: 320px;
    height: 246px;
    border-radius: 4px;
    background: #fff;

    .information-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        .status-info {
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;

            i {
                font-size: 12px;
                line-height: 20px;
                margin-right: 6px;
                color: #52c41a;

                &.el-icon-warning {
                    font-size: 16px;
                    color: #ff4958;
                }
            }
        }

        .update-time {
            font-size: 12px;
            color: #a9bacf;
        }
    }

    .consultant-info {
        text-align: center;

        .consultant-avatar {
            width: 60px;
            height: 60px;
            margin: 0 auto 10px;
            border-radius: 100%;
        }

        .consultant-name {
            max-width: 280px;
            margin: 0 auto;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 4px;
            line-height: 22px;
            color: #333333;
        }

        .consultant-wx {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 10px;
            color: #77808a;
        }
    }

    .update-button {
        width: 120px;
        height: 40px;
        margin: 0 auto 10px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
        color: #ffffff;
        background: #2e9ae2;
        cursor: pointer;
    }

    .consultant-tips {
        text-align: center;
        font-size: 12px;
        color: #ff4958;
        cursor: pointer;
    }
}

.consultant-dialog-title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top:12px;
    color: rgba(0, 0, 0, 0.85);

    i {
        margin-right: 14px;
        font-size: 23px;
        color: #ff4958;
    }
}
</style>
