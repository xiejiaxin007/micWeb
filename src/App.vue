<template>
    <div id="app">
        <div :class="$route.meta.footer !== 'hide' ? 'menu-warper' : ''">
            <PageHeader v-if="$route.meta.header !== 'hide'" />
            <div class="menu-container strickTop"
                v-if="$route.meta.menu !== 'hide'">
                <backend-menu :class="{'backend-menu-box fixTop': isFixed, 'backend-menu-box': !isFixed}"
                    @getHeight="getHeight"
                    ref="backMenu"></backend-menu>
            </div>
            <router-view class="main-center"
                ref="mainView" />
            <div id="sub-building-only"></div>
            <PageFooter class="footer"
                v-if="$route.meta.footer !== 'hide'" />
        </div>
        <el-dialog title="提示"
            :visible.sync="netTimeOut"
            :close-on-click-modal="modalClose"
            :show-close="modalClose"
            width="30%">
            <span>当前网络开小差了，请刷新重试~</span>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary"
                    @click="fresh">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 接口请求次数限制提示弹窗 -->
        <el-dialog title="提示"
            :visible.sync="xhrTimeOutDialog"
            :close-on-click-modal="modalClose"
            :show-close="modalClose"
            width="30%">
            <span>{{xhrTimeOut.msg}}</span>
            <span slot="footer"
                class="dialog-footer">
                <el-button type="primary"
                    @click="xhrTimeOutDialog = false">知道了</el-button>
            </span>
        </el-dialog>
        <CommonDialog />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialog from './components/CommonDialog.vue';
import { BackendMenu, PageFooter, PageHeader } from '@/components';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'App',
    data() {
        return {
            // 弹窗
            modalClose: false,
            // 限制接口请求次数弹窗标志
            xhrTimeOutDialog: false,
            headHeight: '60', // 头部高度，由于长期不变化，不用动态获取
            isFixed: false, // 是否固定导航标志位初始化
            fixedPadding: 0, // 导航固定时候动态获取的导航高度
            msg: '',
        };
    },
    created() {
        // 请求公共埋点接口
        this.$store.dispatch('getTrackCommon');
    },
    components: { CommonDialog, BackendMenu, PageFooter, PageHeader },
    computed: {
        ...mapState({
            netTimeOut: (state) => state.netTimeOut,
            xhrTimeOut: (state) => state.xhrTimeOut,
        }),
    },
    mounted() {
        if (!(CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky'))) {
            // 支持 sticky
            window.addEventListener('scroll', commonFun.highThottle(this.fixMenu, this, 100, 50));
        }
    },
    methods: {
        // 固定导航位置
        fixMenu() {
            // 获取中间内容模块，此处用ref获取paddingTop不成功
            let centerDiv = document.getElementsByClassName('main-center')[0];
            // 获取页面滚动高度
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop >= this.headHeight) {
                // 滚动高度大于头部的高度
                centerDiv.style.paddingTop = this.fixedPadding;
                this.isFixed = true;
            } else {
                centerDiv.style.paddingTop = 0;
                this.isFixed = false;
            }
        },
        // 获取动态导航的高度
        getHeight(para) {
            this.fixedPadding = para + 'px';
        },
        close() {
            this.$store.dispatch('net_timeout', false);
        },
        fresh() {
            // 刷新页面
            window.location.reload();
        },
    },
    watch: {
        // 接口请求次数超过后，显示弹窗
        xhrTimeOut: {
            handler: function (val, oldval) {
                if (!this.xhrTimeOutDialog) {
                    this.xhrTimeOutDialog = true;
                }
            },
            deep: true,
        },
    },
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
}
.tangram-suggestion-main {
    z-index: 99;
}
.menu-warper {
    min-height: 100%;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 116px;
}
.backend-menu-box {
    width: 100%;
}
.strickTop {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 99;
}
.fixTop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}
.main-center {
    min-height: 100%;
}
</style>
