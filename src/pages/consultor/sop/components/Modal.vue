<template>
  <div class="jl-modal">
      <el-dialog
        title="驳回原因"
        :visible.sync="dialogVisible"
        width="45%">
        <div class="modal-content">
          <div class="tag-head">
            <span>标签ID：<span>{{this.tagid}}</span></span>
            <span>标签内容：<span>{{this.orderid}}</span></span>
          </div>
          <div class="tag-cause">标记原因：<span class="tag-cause-txt">{{this.desc}}</span></div>
          <div class="appeal-cause">
            申诉原因：<span class="appeal-cause-txt">{{this.appealreason}}</span>
            <ul class="pic-responsive">
              <li v-for="(items, index) in appealImage " :key="index"><img :src="items" alt=""/></li>
            </ul>
          </div>
          <div class="reject-cause">
            <span class="jl-return">请填写驳回原因：</span>
            <div class="txt-area">
                <div v-if="this.$store.state.role !== 'brand_manager' && this.$store.state.role !== 'brand_administration' && this.$store.state.role !== 'brand_commissioner'">
                  <button class="btn-default" :class="{btnactive: currentIndex == 0}" data-num = '1' @click="setInputval(0, $event)">咨询师手误点错了，要求驳回</button>
                  <button class="btn-default" :class="{btnactive: currentIndex == 1}" data-num = '2' @click="setInputval(1, $event)">因为不清楚规则，导致的申诉</button>
                </div>
                <el-input type="textarea" :rows="3" v-model="textarea" class="jl-text" maxlength="500"/>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submitDefine" size="small" :disabled="!this.textarea">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      textarea: '',
      currentIndex: -1,
      reject_option: ''
    }
  },
  props: ['tagid', 'orderid', 'appealreason', 'appeal_id', 'appealImage', 'desc'],
  methods: {
    openModal () {
      this.dialogVisible = true
    },
    setInputval (index, e) {
      this.currentIndex = index
      this.textarea = e.currentTarget.innerHTML
      this.reject_option = e.target.getAttribute('data-num')
    },
    submitDefine () { // 提交
      if (!this.textarea) {
        return false
      } else {
        this.axios.post('/backend-api/bk-api-tag-manage/reject', {
          appeal_id: this.appeal_id,
          auditor: this.$store.state.uid,
          reject_reason: this.textarea,
          reject_option: this.reject_option
        }).then(res => {
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.textarea = ''
          this.currentIndex = -1
          this.$emit('resDetaildata')
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
}
</script>
<style scoped>
.modal-content .btn-default{
  padding: 8px 10px;
  border:1px solid #DCDFE6;
  border-radius: 20px;
  font-size: 14px;
  background-color: #fff;
  color: #606266;
  cursor: pointer;
}
.modal-content .btnactive{
  border:solid 1px #409eff;
  color: #409eff;
}
.modal-content .purple{
  margin-top: 15px;
  margin-left: -10px;
}
.modal-content .tag-head,.modal-content .tag-cause,.modal-content .appeal-cause{
  margin-bottom: 22px;
}
.modal-content .tag-head span:first-child{margin-right: 15px;}
.modal-content .pic-responsive li{
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-right: 6px;
  margin-top: 20px;
}
.modal-content .pic-responsive li img{
  display: block;
  width: 100%;
  height: inherit;
}
.purple >>> .el-textarea__inner.boractive{
  border:solid 1px #f56c6c !important;
}
.jl-return{
  float: left;
  margin-top: 10px;
}
.txt-area{
  overflow: hidden;
}
.jl-text{
  margin-top: 20px;
}
</style>
