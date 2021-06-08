<!--
    @name: 登录页面
    @description: 用户登录
    @author: wangshuaixue
    @date: 2019-10-18
-->
<template>
    <div class="login-container">
        <div class="content-container">
            <div class="top-title">
                <img 
                    src="./images/img-oval-login.png"
                    alt="登录图片">
                <span>请登录</span>
            </div>
            <div class="account-wrap">
                <div class="number">
                    <el-input 
                        placeholder="请输入账号"
                        v-model="userNumber">
                        <i 
                            slot="prefix"
                            class="icon-account" 
                            aria-hidden="true"></i>
                    </el-input>
                </div>
                <div class="password">
                    <el-input
                            placeholder="请输入密码"
                            v-model="userPassWord">
                        <i 
                            slot="prefix"
                            class="icon-password" 
                            aria-hidden="true"></i>
                    </el-input>
                </div>
                <div :class="`error-hint ${isError ? '' : 'hidden'}`">
                    {{errMsg}}
                </div>
            </div>
            <div 
                :class="`btn-login ${currHasContent ? '' : 'not-content'}`"
                @click="submitLogin">
                登录
            </div>
        </div>
        <div 
            class="bg-bottom"
            v-show="hidShow">
            <img 
                src="./images/bg-login.png"
                alt="底部背景图">
        </div>
    </div>
</template>

<script>
import 'lib-flexible';
import commonApi from '@/api/commonApi';
const { userLogin } = commonApi;
export default {
    name: 'mobeil-login',
    data() {
        return {
            // 错误提示信息
            errMsg: '',
            // 用户账号
            userNumber: '',
            // 用户密码
            userPassWord: '',
            // 错误提示
            isError: false,
            // 默认屏幕高度
            docmHeight: document.documentElement.clientHeight,
            // 实时屏幕高度
            showHeight: document.documentElement.clientHeight,
            // 显示或者隐藏footer
            hidShow: true
        };
    },
    watch: {
        showHeight: function() {
            if (this.docmHeight > this.showHeight) {
                this.hidShow = false;
            } else {
                this.hidShow = true;
            }
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight;
            })();
        };
    },
    methods: {
        // 提交登录
        async submitLogin() {
            try {
                if (this.userNumber==='' || this.userPassWord==='') {
                    return;
                }
                let params = {
                    job_number: this.userNumber,
                    password: this.userPassWord,
                    allow_role: 'header_manager'
                };
                const { data } = await userLogin(params);
                if (data.code === 0) {
                    // 跳转到服务单列表页
                    this.$router.push({ path: 'serviceVoucherList' });
                    this.isError = false;
                } else if (data.code === 1101) {
                    this.errMsg = data.msg;
                    this.isError = true;
                }
            } catch (err) {
                console.log(err);
            }
        }
    },
    computed: {
        // 当前输入框中是否有值
        currHasContent() {
            let falg = false;
            if (this.userNumber !== '' || this.userPassWord !== '') {
                falg = true;
            }
            return falg;
        }
    }
};
</script>

<style lang="less" scoped>
@white_color: #fff;
@bule_color: #33a1ff;
@bule_deep_color: #0681ea;
@text_deep_color: #333;
@border-color: #f2f2f2;
@error_color: #ff4958;
@not_content_color: #70bdff;

.login-container {
    background-color: @white_color;
    height: 100%;
    position: relative;
    overflow: hidden;
    color: @text_deep_color;
    .content-container {
        padding: 0 1.333rem;
        margin-top: 2.666667rem;
        .top-title {
            margin-bottom: 1.066667rem;
            > img {
                width: 1.466667rem;
                height: 0.4rem;
            }
            > span {
                display: block;
                margin-top: 0.266667rem;
                font-size: 0.64rem;
            }
        }
        .account-wrap {
            .number {
                margin-bottom: 0.533333rem;
            }
            .error-hint {
                color: @error_color;
                margin: 5px 0 0 0.8rem;
                height: 0.453333rem;
                &.hidden {
                    color: transparent;
                }
            }
            /deep/.el-input {
                .el-input__inner {
                    border: none;
                    border-bottom: 2px solid @border-color;
                    border-radius: 0;
                    font-size: 0.373333rem;
                    color: @text_deep_color;
                    &:focus {
                        border-color: @border-color;
                    }
                }
                .el-input__prefix {
                    line-height: 1rem;
                    font-size: 0.48rem;
                }
            }
        }
        .btn-login {
            height: 1.173333rem;
            line-height: 1.23rem;
            width: 100%;
            border-radius: 1.333333rem;
            background-color: @bule_color;
            margin-top: 1.06rem;
            text-align: center;
            font-size: 0.426667rem;
            color: @white_color;
            &.not-content{
                background-color: @not_content_color;
            }
            &:active {
                background-color: @bule_deep_color;
            }
        }
    }
    .bg-bottom {
        position: absolute;
        bottom: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
