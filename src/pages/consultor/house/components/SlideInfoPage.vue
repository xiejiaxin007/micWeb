<template>
<transition name="fade">
  <div class="side-info-content" v-if="show">
    <side-page @closeSidePage="closeSidePage" :infoObj="infoObj"></side-page>
  </div>
</transition>
</template>

<script>
import SidePage from './SidePage'
import PubSub from 'pubsub-js'
export default {
  data () {
    return {
      show: false,
      infoObj: {}
    }
  },
  props: {
    openFlag: {
      type: Boolean,
      default: false
    }
  },
  components: {SidePage},
  mounted () {
    PubSub.subscribe('openTabInfo', (msg, data) => {
      this.$emit('closeSidePage', true)
      this.show = true
      this.infoObj = data
    })
    PubSub.subscribe('closeCurrenPage', (msg, data) => {
      // 父组件点击通勤模式和画圈找房时候告诉我页面关闭
      this.show = false
      this.$emit('closeSidePage', false)
    })
  },
  methods: {
    closeSidePage () {
      this.$emit('closeSidePage', false)
      this.show = false
    }
  },
  watch: {
    show: {
      handler: function (val, oldval) {
        if (!this.show) {
          // 当前不是通勤，则删除地图中已经画好的路线
          PubSub.publish('closeTab')
          // 当前不是周边，则恢复地图中的筛选内容
          PubSub.publish('tabAround')
          // 关闭右侧详情，去掉地图选中楼盘
          PubSub.publish('closePage')
        } else {
          // 关闭文章列表
          PubSub.publish('closeArticle')
          // 关闭户型对比
          PubSub.publish('closeFloor')
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped>
  .fade-enter, .fade-leave-to{
    opacity: 0;
    transform: translateX(100%);
  }
  .fade-enter-active, .fade-leave-active {
    transition: .15s cubic-bezier(0,0,1,1);
  }
  .side-info-content{
    position: fixed;
    width: 350px;
    background-color: #fff;
    right: 0;
    top: 66px;
    bottom: 0;
    z-index: 2;
    box-shadow: -10px 0 20px 0 rgba(152,152,152,0.10);
  }
</style>
