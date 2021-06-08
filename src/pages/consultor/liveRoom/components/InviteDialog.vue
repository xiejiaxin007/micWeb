<!--
 * @Name: 邀请销售弹窗
 * @Description: 邀请销售弹窗
 * @Author: wangxue
 * @Date: 2020-04-07
 -->
<template>
    <div class="invite-dialog">
        <el-dialog
            custom-class="live-dialog-wrapper process-detail-wrapper"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="isShow"
            :show-close="false"
            width="520px"
            center
        >
            <div
                slot="title"
                class="dialog-header"
            >
                邀请销售
            </div>
            <div class="dialog-body-box">
                <div class="send-msg-txt">
                    将二维码分享给销售，销售即可进入线上看房
                </div>
                <div class="code-pic">
                    <img
                        :src="miniProgramQrcode ? miniProgramQrcode : ''"
                        alt="分享二维码"
                    />
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
                @click="close"
            >
                <el-button type="primary">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: 'invite-dialog',
        props: {
            // 弹窗展示标志
            isShow: {
                type: Boolean,
                default: false
            },
            // 房间id
            roomId: ''
        },
        data() {
            return {
                // 链接url
                inviteUrl: ''
            };
        },
        mounted() {
        },
        methods: {
            // 关闭弹窗
            close() {
                this.$emit('closeInviteDialog', false);
            },
            /**
             * 图片加载失败
             * @param {Object} el 事件对象
             */
            error(el) {
                // el.target.src = errorImg;
                el.target.error = null;
            }
        },
        computed: {
            ...mapState('liveRoom', ['miniProgramQrcode'])
        }
    };
</script>

<style lang="less" scoped>
.process-detail-wrapper {
    height: 100%;
    color: #222;
    .el-button {
        width: 144px;
    }
    .send-msg-txt {
        color: #333;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        margin-bottom: 40px;
    }
    .code-pic{
        display: flex;
        justify-content: center;
        img {
            width: 160px;
            height: 160px;
        }
    }
}
</style>
<style lang="less">
.invite-dialog {
    .process-detail-wrapper {
        .el-dialog__footer {
            margin-top: 40px;
        }
    }
}
</style>
