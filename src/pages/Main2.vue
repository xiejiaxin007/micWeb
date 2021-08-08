<template>
  <router-view class="main-center" ref="mainView"/>
</template>
<script>
export default {
  name: 'main-page',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .main-center{
    min-height: 100%;
  }
</style>
