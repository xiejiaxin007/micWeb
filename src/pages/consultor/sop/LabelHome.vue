<template>
  <div class="jl-content">
      <el-breadcrumb class="jl-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item>标签管理首页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="jl-plane">
        <dl class="jl-plane-contact" v-for="(items, index) in concatItem" :key="items.id">
          <dt class="jl-panle-btn" :class="classmap[index % 4]">
            <i class="iconfont" :class="classfont[index % 4]" aria-hidden="true"></i>{{items.name}}</dt>
          <dd>
            <a href="javascript:void(0)" v-for="item in items.list"
              :key="item.id" v-show="item.is_hidden != 1"
              @click="handelClick(item.id, item.tag_name)">{{item.tag_name}}</a>
          </dd>
        </dl>
      </div>
  </div>
</template>
<script>
export default {
  name: 'LabelHome',
  data () {
    return {
      concatItem: [] // 类别数组
    }
  },
  components: {},
  created () {
    this.classfont = ['iconshijian', 'iconicon_look', 'iconicon_subscri', 'iconicon_other']
    this.classmap = ['jl-panle-denger', 'jl-panle-scuess', 'jl-panle-primer', 'jl-panle-default']
    this.getHomedata()
  },
  methods: {
    handelClick (id, name) {
      this.$router.push({
        path: '/labelList',
        query: {
          tag_config_id: id,
          tag_name: name
        }
      })
    },
    getHomedata () {
      this.axios.post('/backend-api/bk-api-tag-manage/index').then((res) => {
        if (res.data.code === 0) {
          this.concatItem = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.jl-content{
  width: auto;
  margin: auto;
}
.jl-plane{
  background-color: #fff;
  padding-top: 30px;
  box-sizing: border-box;
}
.jl-plane dl{
  padding-left: 20px;
  font-size: 0;
  min-height: 72px;
}
.jl-plane dl:nth-child(2n){
  background-color: rgba(247, 247, 247, .71);
  padding-top: 20px;
  margin-bottom: 20px;
}
.jl-plane dl:last-child{
  margin-bottom: 0;
}
.jl-plane .jl-panle-btn{
  border-radius: 4px;
  width: 99px;
  height: 52px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 52px;
  font-weight: 700;
  float: left;
}
.jl-plane .jl-panle-denger{
  background-color: #FE974A;
}
.jl-plane .jl-panle-denger + dd a:hover, .jl-plane .jl-panle-denger + dd a.active{
  background-color: #FFF7EC;
  border-bottom: solid 3px #FE974A;
}
.jl-plane .jl-panle-scuess{
  background-color:#00d980;
}
.jl-plane .jl-panle-scuess + dd a:hover,.jl-plane .jl-panle-scuess + dd .lookactive{
  background-color:#ECFCF6;
  border-bottom: solid 3px #00d980;
}
.jl-plane .jl-panle-primer{
  background-color:#009be8;
}
.jl-plane .jl-panle-primer + dd a:hover, .jl-plane .jl-panle-primer + dd .subscractive{
  background-color:#ECF9FF ;
  border-bottom: solid 3px #009be8;
}
.jl-plane .jl-panle-default{
  background-color:#8d8d8d;
}
.jl-plane .jl-panle-default + dd a:hover, .jl-plane .jl-panle-default + dd .otheractive{
  background-color:#F3F6F9;
  border-bottom: solid 3px #8d8d8d;
}
.jl-plane .jl-plane-contact dt > .icon-time,
.jl-plane .jl-plane-look dt > .icon-look,
.jl-plane .jl-plane-look dt > .icon-other,
.jl-plane .jl-plane-look dt > .icon-subscr
{
  margin-right: 6px;
  font-weight: 600;
  font-size: 14px;
}
.jl-plane .jl-plane-look dt > .icon-timeend{
  font-size: 16px;
}
.jl-plane dd{
  margin-left: 119px;
}
.jl-plane dd a{
  background: #fff;
  box-shadow: 0 5px 15px 0 rgba(56,62,68,0.13);
  border-radius: 5px;
  height: 52px;
  line-height: 52px;
  font-size: 14px;
  font-weight: 700;
  min-width: 140px;
  padding: 0 8px;
  box-sizing: border-box;
  text-decoration: none;
  color: #333;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.jl-breadcrumb{
  padding-left: 20px;
  height: 57px;
  line-height: 57px;
}
.jl-breadcrumb >>> .el-breadcrumb__inner.is-link{
  font-style: normal;
}
.jl-plane dd a:last-child{
  margin-right: 0;
}
.icon-concat{
  font-size: 18px;
}
.el-breadcrumb__inner a{
  font-weight: normal;
}
.el-breadcrumb__inner a:hover, .el-breadcrumb__inner.is-link:hover{
  color: #354052;
}
</style>
