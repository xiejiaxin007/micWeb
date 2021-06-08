<template>
  <transition name="fade">
    <div class="toast-box" v-if="showFlag">
      <div>{{msg}}</div>
    </div>
  </transition>
</template>

<script>
import 'lib-flexible';
export default {
  name: 'toast',
  props: ['msg', 'toastShow'],
  data () {
    return {
      showFlag: false
    }
  },
  mounted () {
    this.showFlag = this.toastShow
  },
  watch: {
    toastShow: {
      handler: function (val, oldval) {
        this.showFlag = this.toastShow
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
  .toast-box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    padding: 0.133rem 0.18rem 0.16rem;
    box-sizing: border-box;
    color: #fff;
    border-radius: 5px;
    z-index: 4;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
