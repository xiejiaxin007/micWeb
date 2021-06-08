<template>
  <div class="jumbotron">
      <el-breadcrumb class="jl-breadcrumb-detail" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:'/appealManage'}" v-if="this.$store.state.role !== 'header'">申诉管理列表</el-breadcrumb-item>
        <el-breadcrumb-item>SOP申诉详情页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="jl-detail-content">
        <div class="jl-detail-head">
          <div class="jl-detail-title">
            <h3><span class="jl-zx-name">{{this.username}}</span>订单的申诉详情页面</h3>
            <div class="jl-btn-group" v-if="this.$store.state.role == 'header_manager'">
              <el-button type="primary" size="small" @click="returnback" v-if="this.appeal_type === 2">撤回</el-button>
              <el-button type="success" size="small" @click="pass" v-if="this.appeal_type === 1">通过</el-button>
              <el-button type="danger" size="small" @click="openModal" v-if="this.appeal_type === 1">驳回</el-button>
            </div>
            <div class="jl-btn-group" v-if="this.$store.state.role == 'brand_manager' || this.$store.state.role == 'brand_administration' || this.$store.state.role == 'brand_commissioner'">
              <el-button type="primary" size="small" @click="returnback" v-if="this.appeal_type === 2">撤回</el-button>
              <el-button type="success" size="small" @click="pass" v-if="this.appeal_type === 3">通过</el-button>
              <el-button type="danger" size="small" @click="openModal" v-if="this.appeal_type === 3">驳回</el-button>
            </div>
            <div class="jl-btn-group" v-else-if="this.$store.state.role == 'header' || this.$store.state.role == 'admin'" >
              <el-button type="primary" size="small" @click="returnback" v-if="!this.appeal_type === 2">撤回</el-button>
            </div>
          </div>
          <div class="jl-targ-items">
            <ul class="items">
              <li>标签ID：<span>{{this.tag_id}}</span></li>
              <li>标签名称：<span>{{this.tag_name}}</span></li>
              <li>扣除分数：<span>{{this.deduct_score}}</span></li>
              <li>标记状态：<span>{{this.tag_status}}</span></li>
              <li>申诉状态：<span>{{this.appeal_status}}</span></li>
            </ul>
          </div>
        </div>
        <div class="jl-detail-items">
          <ol class="list-col-warp">
            <li class="list-col">
              <div class="list-empty-block">
              <i class="iconfont iconshezhi" aria-hidden="true"></i>
              <div class="list-col-block clearx">
                <ul class="list-one">
                  <li v-for="(item, index) in detailGroup" :key="index" v-if="item.prop === 'project' ">
                    <div class="detail-diff" v-if="item.is_url == 0">
                      <span>{{item.name}}:</span>
                      <span v-for="(items, index) in detailTarg" :key="index">
                        {{items[item.prop].val}}</span>
                    </div>
                    <div class="detail-diff" v-else-if="item.is_url == 1">
                      <span v-show="item.name !== '扣分' ">{{item.name}}:</span>
                      <span v-for="(items, index) in detailTarg" :key="index" v-show="item.name !== '扣分' ">
                        {{items[item.prop].val}}
                      </span>
                    </div>
                    <div class="detail-diff" v-else>
                      <span v-show="item.name !== '扣分' ">{{item.name}}:</span>
                      <span v-for="(items, index) in detailTarg" :key="index" v-show="item.name !== '扣分'">
                        <span v-for="(list, index) in items[item.prop]" :key="index">{{list.project_name}}</span>
                      </span>
                    </div>
                  </li>
                  <li v-else>
                    <div class="detail-diff" v-if="item.is_url == 0">
                      <span>{{item.name}}:</span>
                      <span v-for="(items, index) in detailTarg" :key="index">
                        {{items[item.prop].val}}</span>
                    </div>
                    <div class="detail-diff" v-else-if="item.is_url == 1">
                      <span v-show="item.name !== '扣分' ">{{item.name}}:</span>
                      <span v-for="(items, index) in detailTarg" :key="index" v-show="item.name !== '扣分' ">
                        {{items[item.prop].val}}
                      </span>
                    </div>
                    <div class="detail-diff" v-else>
                      <span v-show="item.name !== '扣分' ">{{item.name}}:</span>
                      <span v-for="(items, index) in detailTarg" :key="index" v-show="item.name !== '扣分'">
                        {{items[item.prop]}}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              </div>
            </li>
            <li class="list-col">
              <div class="list-empty-block">
              <i class="iconfont iconrenyuan" aria-hidden="true"></i>
              <div class="list-col-block clearx thumbnail">
                <ul>
                  <li><span>发起申诉时间：</span><span>{{this.detailAppeal.create_datetime}}</span></li>
                  <li><span>发起申诉原因：</span><span>{{this.detailAppeal.appeal_reason}}</span></li>
                  <li><span>申诉凭证：</span>
                    <div class="img-group">
                      <a :href='items' target="_blank" v-for="(items, index) in appealImage.slice(0,3)" :key="index">
                        <img :src="items" alt="图片">
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              </div>
            </li>
            <li class="list-col">
              <div class="list-empty-block" v-if="this.detailList.auditor">
              <i class="iconfont iconyonghuzu" aria-hidden="true"></i>
              <div class="list-col-block clearx">
                <ul>
                  <li><span>审核申诉时间：</span><span>{{this.detailList.update_datetime}}</span></li>
                  <li><span>审核主管信息：</span><span>{{this.detailList.auditor}}</span></li>
                  <li><span>主管审核结果：</span>
                    <span :class="this.detailList.audit_status === 1 ? 'pass' : 'reject' ">{{this.detailList.result}}</span>
                  </li>
                  <li v-if="this.detailList.audit_status === 2"><span>主管驳回意见：</span><span>{{this.detailList.reject_reason}}</span></li>
                </ul>
              </div>
              </div>
            </li>
            <li class="list-col">
              <div class="list-empty-block" v-if="this.detailObj.auditor">
                <i class="iconfont iconmoshubang" aria-hidden="true"></i>
                <div class="list-col-block clearx">
                  <ul>
                    <li><span>申诉审批时间：</span><span>{{this.detailObj.update_datetime}}</span></li>
                    <li><span>审批管理员：</span><span>{{this.detailObj.auditor}}</span></li>
                    <li><span>主管审核结果：</span>
                      <span :class="this.detailObj.audit_status === 2 ? 'reject' : 'pass' ">{{this.detailObj.result}}</span>
                    </li>
                    <li v-if="this.detailObj.audit_status === 2"><span>标签状态：</span>
                      <span :class="this.detailObj.audit_status === 2 ? 'reject' : 'pass' ">{{this.detailObj.tag_status}}</span>
                    </li>
                    <li v-if="this.detailObj.audit_status === 2">驳回意见：<span>{{this.detailObj.reject_reason}}</span></li>
                  </ul>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <!-- 模态框 -->
      <Modal ref="Modalchild" @resDetaildata="resDetaildata"
      :tagid="tag_id"
      :orderid="order_id"
      :appealreason="appeal_reason"
      :desc="desc" :appealImage="appealImage" :appeal_id="this.$route.query.appeal_id"/>
  </div>
</template>

<script>
import { Modal } from './components'
export default {
  name: 'SopDetail',
  data () {
    return {
      username: '',
      tag_name: '',
      tag_id: '',
      order_id: '',
      appeal_reason: '',
      tag_status: '',
      deduct_score: '',
      appeal_status: '',
      appeal_type: '',
      desc: '',
      detailList: {},
      detailObj: {},
      detailAppeal: {},
      detailGroup: [],
      detailTarg: [],
      appealImage: []
    }
  },
  mounted () {
    this.resDetaildata()
  },
  components: {
    Modal
  },
  methods: {
    returnback () { // 撤回
      this.axios.post('/backend-api/bk-api-tag-manage/rollback', {
        appeal_id: this.$route.query.appeal_id,
        auditor: this.$store.state.uid
      }).then(res => {
        this.resDetaildata()
      })
    },
    openModal () { // 驳回弹窗
      this.$refs.Modalchild.openModal()
      this.axios.post('/backend-api/bk-api-tag-manage/reject-pop', {
        appeal_id: this.$route.query.appeal_id
      }).then(res => {
        this.order_id = res.data.data.order_id
        this.appeal_reason = res.data.data.appeal_reason
        this.desc = res.data.data.desc
      }).catch(err => {
        console.log(err)
      })
    },
    pass () { // 通过
      this.axios.post('/backend-api/bk-api-tag-manage/exam-passed', {
        auditor: this.$store.state.uid,
        appeal_id: this.$route.query.appeal_id
      }).then(res => {
        this.resDetaildata()
      })
    },
    resDetaildata () { // 渲染当前页面
      this.axios.post('/backend-api/bk-api-tag-manage/appeal-detail', {
        appeal_id: this.$route.query.appeal_id
      }).then(res => {
        if (res.data.code === 0) {
          const _STATE = res.data.data
          this.username = _STATE.employee_name
          this.tag_name = _STATE.tag_name
          this.tag_id = _STATE.tag_id
          this.deduct_score = _STATE.deduct_score
          this.tag_status = _STATE.tag_status
          this.appeal_status = _STATE.appeal_status
          this.detailList = _STATE.audit
          this.detailObj = _STATE.approval
          this.detailAppeal = _STATE.appeal
          this.detailGroup = _STATE.detail.title
          this.detailTarg = _STATE.detail.list
          this.appeal_type = _STATE.appeal_type
          this.appealImage = _STATE.appeal.appeal_img
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

</script>
<style scoped>
.jl-breadcrumb-detail{
  height: 57px;
  line-height: 57px;
  padding-left: 20px;
}
.el-breadcrumb__inner a{
  font-weight: normal;
}
.jl-detail-content{
  padding: 15px;
  background-color: #fff;
  margin: 0 15px 15px;
}
.jl-detail-content .clearx:after{
  display: block;
  content: '';
  clear: both;
}
.clearx{
  zoom: 1;
}
.jl-detail-title{
  border-bottom: solid 1px #ececec;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
.jl-detail-title > h3{
  font-weight: inherit;
}
.jl-detail-title h3 > .jl-zx-name {
  margin-right: 12px;
}
.jl-targ-items{
  margin-top: 25px;
}
.jl-targ-items .items{
  font-size: 0;
  width: 100%;
}
.jl-detail-items{
  margin-top: 35px;
}
.jl-targ-items .items li{
  display: inline-block;
  font-size: 14px;
  width: 20%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 25px;
}
.list-col-warp{
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.list-col-warp .list-col{
  margin-right: 20px;
  width: 24%;
}
.list-col-warp .list-col:last-child{
  margin-right: 0;
}
.thumbnail li span:first-child{
  float: left;
}
.list-col-block .list-one li:last-child{
  display: none;
}
.list-col-warp .list-col .iconfont{
  color: #fd994a;
  font-size: 26px;
  position: relative;
  top:-18px;
  left: -2px;
}
.list-empty-block{
   border-top:solid 1px #ececec;
  padding-bottom: 15px;
}
.list-col-block li .pass{
  color: green;
}
.list-col-block li .reject{
  color: red;
}
.list-col-block .img-group{
  font-size: 0;
}
.list-col-block .img-group a{
  margin-right: 5px;
  height: 65px;
  width: 65px;
  display: inline-block;
}
.list-col-block .img-group a > img{
  display: block;
  max-width: 100%;
  width: 100%;
  height: inherit;
}
.list-col-block li{
  font-size: 14px;
  margin-bottom: 18px;
  word-break: break-all;
}
.jumbotron >>> .el-dialog__header{
  border-bottom: solid 1px #DCDFE6
}
.jumbotron >>> .el-breadcrumb__inner.is-link{
  font-weight:normal;
}
</style>
