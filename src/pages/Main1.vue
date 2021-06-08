<template>
  <div :class="$route.meta.footer !== 'hide' ? 'menu-warper' : ''">
    <PageHeader v-if="$route.meta.header !== 'hide'"/>
    <div class="menu-container strickTop" v-if="$route.meta.menu !== 'hide'">
      <backend-menu :class="{'backend-menu-box fixTop': isFixed, 'backend-menu-box': !isFixed}" @getHeight="getHeight" ref="backMenu"></backend-menu>
    </div>
    <router-view class="main-center" ref="mainView"/>
    <PageFooter class="footer" v-if="$route.meta.footer !== 'hide'"/>
  </div>
</template>
<script>
import {BackendMenu, PageFooter, PageHeader} from '@/components'
import { commonFun } from '../assets/js/utils/utils'
export default {
  name: 'main-page',
  data () {
    return {
      headHeight: '60', // 头部高度，由于长期不变化，不用动态获取
      isFixed: false, // 是否固定导航标志位初始化
      fixedPadding: 0, // 导航固定时候动态获取的导航高度
      msg: '',
    }
  },
  components: {BackendMenu, PageFooter, PageHeader},
  mounted () {
    if (!(CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky'))) {
      // 支持 sticky
      window.addEventListener('scroll', commonFun.highThottle(this.fixMenu, this, 100, 50))
    }
  },
  methods: {
    // 固定导航位置
    fixMenu () {
      // 获取中间内容模块，此处用ref获取paddingTop不成功
      let centerDiv = document.getElementsByClassName('main-center')[0]
      // 获取页面滚动高度
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= this.headHeight) {
        // 滚动高度大于头部的高度
        centerDiv.style.paddingTop = this.fixedPadding
        this.isFixed = true
      } else {
        centerDiv.style.paddingTop = 0
        this.isFixed = false
      }
    },
    // 获取动态导航的高度
    getHeight (para) {
      this.fixedPadding = para + 'px'
    }
  }
}
</script>

<style scoped>
  .menu-warper{
    min-height: 100%;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 116px;
  }
  .backend-menu-box{
    width: 100%;
  }
  .strickTop{
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 99;
  }
  .fixTop{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .main-center{
    min-height: 100%;
  }
</style>
