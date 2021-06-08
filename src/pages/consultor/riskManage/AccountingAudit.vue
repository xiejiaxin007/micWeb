<template>
  <div class="el-row account-audit-box" ref='AnimalBook'>
    <el-col :span="24" class="content-main">
      <!--面包屑-->
      <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/performance/performanceRiskList'}">业绩核算风控管理</el-breadcrumb-item>
        <el-breadcrumb-item>审核页面</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="v-box record-box">
        <div class="hd">
          <h2>订单&lt;{{`${orderId}`}}&gt;在&lt;{{editTime}}&gt;修改&lt;{{editType}}&gt;审核</h2>
        </div>
        <div class="bd">
          <ul class="modyfy-list clearfix">
            <li class="modify-item enter" v-if=stracelist.input>
              <div class="circle">录入</div>
              <div class='time'>{{stracelist.input.datetime}}</div>
              <ul class="plan-item">
                <li v-for="(person, index) in stracelist.input.list" :key="index+'enter'">
                  <div class="th">{{person.label}}：</div>
                  <div class="td">{{person.value}}</div>
                </li>
              </ul>
            </li>
            <li class="modify-item modify" v-for="(editIt, index) in stracelist.edit" :key="index+'edit'">
              <div class="circle">修改</div>
              <div class='time' v-if="editIt">{{editIt.datetime}}</div>
              <ul class="plan-item">
                <li>
                  <div class="th">修改人：</div>
                  <div class="td">{{editIt.editor}}</div>
                </li>
                <li>
                  <div class="th">修改类型：</div>
                  <div class="td">{{editIt.edit_type}}</div>
                </li>
                <li>
                  <div class="th">修改内容：</div>
                  <div class="td"><span class='delete'>{{editIt.edit_content.old}}</span>->{{editIt.edit_content.new}}</div>
                </li>
              </ul>
            </li>
            <li class="modify-item" v-for="(audit, index) in stracelist.audit" :class="{'director': audit.audit_role == 1,'audit': audit.audit_role == 2}" :key=index>
              <div class="circle" :class="{'active' : stracelist.audit.length==index+1}"><span>{{audit.audit_role == 1 ? '主管审核' : '质检审核'}}</span></div>
              <div class='time' v-if=audit>{{audit.datetime}}</div>
              <ul class="plan-item">
                <li>
                  <div class="th">审核人：</div>
                  <div class="td">{{audit.auditor}}</div>
                </li>
                <li>
                  <div class="th">审核状态：</div>
                  <div class="td point-red">{{audit.status}}</div>
                </li>
                <li>
                  <div class="th">{{audit.audit_role == 1 ? '主管备注：' : '审核结果：'}}</div>
                  <div class="td">{{audit.remark}}</div>
                </li>
              </ul>
            </li>
          </ul>
          <div class="modify-record">
            <div class="modify-before">
              <div v-if="modifyDetail.old && modifyDetail.old.length>0">
                <div class="modify-box before-box" v-for="(oldItem, index) in modifyDetail.old" :key=index>
                  <div class='box-hd'>修改前{{oldItem.edit_type}}：{{oldItem.employee}}<span v-if="oldItem.on_work == '1'">（已离职）</span>在{{oldItem.datetime}}的信息：</div>
                  <div class='box-bd'>
                    <div class="box">
                      <div class="title">与客户的通话记录：</div>
                      <div class="info" v-if="oldItem.call && oldItem.call.length>0">
                        <div class="call-item" v-for="(call,it) in oldItem.call" :key="it+'call'">
                          <div class="desc" v-if="call.type == 1">{{call.call_time}} 咨询师{{call.caller}} 打给客户 {{call.called}}</div>
                          <div class="desc" v-else>{{call.call_time}} 客户{{call.caller}} 打给咨询师 {{call.called}}</div>
                          <div class="desc">通话时长：{{sTransHs(call.call_duration)}}</div>
                          <audio
                          @play="controlAudio($event)"
                          class='audio-tag'
                          preload
                          controls
                          muted
                          :src="call.url"></audio>
                        </div>
                      </div>
                      <div v-else>未检测到与客户的通话记录</div>
                    </div>
                    <div class="box">
                      <div class="title">与客户的短信记录：</div>
                      <div class="info" v-if="oldItem.sms && oldItem.sms.length>0">
                        <div class="note-item" v-for="(sms,it) in oldItem.sms" :key="it+'sms'">
                          <div class='desc' v-if="sms.type == 1">{{sms.transfer_time}}咨询师{{sms.sender}}给客户{{sms.receiver}}发送</div>
                          <div class='desc' v-else>{{sms.transfer_time}}客户{{sms.sender}}给咨询师{{sms.receiver}}发送</div>
                          <div class='desc'>{{sms.content}}</div>
                        </div>
                      </div>
                      <div class="info" v-else>未检测到与客户的短信记录</div>
                    </div>
                    <div class="box" v-if="oldItem.hasOwnProperty('didi')">
                      <div class="title">打车单明细：</div>
                      <div class="info" v-if="oldItem.didi.length>0">
                        <div class="car-item" v-for="(diItem,it) in oldItem.didi" :key="it+'didi'">
                          <div class='desc'>{{diItem.start_name}}——{{diItem.end_name}}</div>
                          <div class='desc'>{{diItem.begin_charge_time}}   {{diItem.actual_price}}元</div>
                          <div class='desc'>打车单{{diItem.start_name}}/{{diItem.end_name}}是否经过带看楼盘？  <span class="result">{{diItem.is_pass == '1' ? '是' : '否'}}</span></div>
                        </div>
                      </div>
                      <div class="info" v-else>未检测到咨询师的打车记录</div>
                    </div>
                    <div class="box" v-if="oldItem.hasOwnProperty('gps') ">
                      <div v-if="oldItem.gps.length>0">
                        <div class="title" v-for="(gpsItem,it) in oldItem.gps" :key="it+'gps'">
                        GPS打点是否经过{{gpsItem.name}}？ <span class="result">{{gpsItem.is_pass == '1' ? '是' : '否'}}</span></div>
                      </div>
                      <div class="info" v-else>
                        未检测到GPS记录
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modify-after">
              <div v-if="modifyDetail.new && modifyDetail.new.length>0">
                <div class="modify-box after-box" v-for="(newItem, index) in modifyDetail.new" :key=index>
                  <div class='box-hd point-red'>修改后{{newItem.edit_type}}：{{newItem.employee}}在{{newItem.datetime}}的信息：</div>
                  <div class='box-bd'>
                    <div class="box">
                      <div class="title">与客户的通话记录：</div>
                      <div class="info" v-if="newItem.call && newItem.call.length>0">
                        <div class="call-item" v-for="(call,it) in newItem.call" :key="it+'call'">
                          <div class="desc" v-if="call.type == 1">{{call.call_time}} 咨询师{{call.caller}} 打给客户 {{call.called}}</div>
                          <div class="desc" v-else>{{call.call_time}} 客户{{call.caller}} 打给咨询师 {{call.called}}</div>
                          <div class="desc">通话时长：{{sTransHs(call.call_duration)}}</div>
                          <audio
                          @play="controlAudio($event)"
                          class='audio-tag'
                          preload
                          controls
                          muted
                          :src="call.url"></audio>
                        </div>
                      </div>
                      <div v-else>未检测到与客户的通话记录</div>
                    </div>
                    <div class="box">
                      <div class="title">与客户的短信记录：</div>
                      <div class="info" v-if="newItem.sms && newItem.sms.length>0">
                        <div class="note-item" v-for="(sms,it) in newItem.sms" :key="it+'sms'">
                          <div class='desc' v-if="sms.type == 1">{{sms.transfer_time}}咨询师{{sms.sender}}给客户{{sms.receiver}}发送</div>
                          <div class='desc' v-else>{{sms.transfer_time}}客户{{sms.sender}}给咨询师{{sms.receiver}}发送</div>
                          <div class='desc'>{{sms.content}}</div>
                        </div>
                      </div>
                      <div class="info" v-else>未检测到与客户的短信记录</div>
                    </div>
                    <div class="box" v-if="newItem.hasOwnProperty('didi')">
                      <div class="title">打车单明细：</div>
                      <div class="info" v-if="newItem.didi.length>0">
                        <div class="car-item" v-for="(diItem,it) in newItem.didi" :key="it+'didi'">
                          <div class='desc'>{{diItem.start_name}}——{{diItem.end_name}}</div>
                          <div class='desc'>{{diItem.begin_charge_time}}   {{diItem.actual_price}}元</div>
                          <div class='desc'>打车单{{diItem.start_name}}/{{diItem.end_name}}是否经过带看楼盘？  <span class="result">{{diItem.is_pass == '1' ? '是' : '否'}}</span></div>
                        </div>
                      </div>
                      <div class="info"  v-else>未检测到咨询师的打车记录</div>
                    </div>
                    <div class="box" v-if="newItem.hasOwnProperty('gps')">
                      <div v-if="newItem.gps.length>0">
                        <div class="title" v-for="(gpsItem,it) in newItem.gps" :key="it+'gps'">
                        GPS打点是否经过{{gpsItem.name}}？ <span class="result">{{gpsItem.is_pass == '1' ? '是' : '否'}}</span></div>
                      </div>
                      <div class="info" v-else>
                        未检测到GPS记录
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='edit-btn-area'>
            <div v-if="button.type == 'service'">
              <el-button type="primary" @click="openAdmin('2')">排除嫌疑</el-button>
              <el-button type="danger" @click="openAdmin('1')">确认嫌疑</el-button>
            </div>
            <div v-if="button.type == 'service_edit'">
              <el-button type="warning" @click="openAdmin()">修改</el-button>
            </div>
            <div v-if="button.type == 'manager'">
              <el-button type="primary" @click="openQua('2')">没问题</el-button>
              <el-button type="danger" @click="openQua('1')">需要质检审核</el-button>
            </div>
            <div v-if="button.type == 'manager_edit'">
              <el-button type="warning" @click="openQua('1')">修改</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <!-- 嫌疑弹窗 -->
    <el-dialog
      class="violations"
      :visible.sync="serveVisible"
      width="400px">
      <div class='line title'>
        本次修改记录是否存在违规行为：
      </div>
      <div class='line'>
        <el-radio-group v-model="suspicion.cause">
          <el-radio :label="'1'">确认嫌疑</el-radio>
          <el-radio :label="'2'">排除嫌疑</el-radio>
        </el-radio-group>
      </div>
      <div v-if="suspicion.cause==1">
        <div class='line'>
          <el-radio-group v-model="suspicion.line">
            <el-radio :label="'4'">红线</el-radio>
            <el-radio :label="'2'">橙线</el-radio>
            <el-radio :label="'3'">黄线</el-radio>
          </el-radio-group>
        </div>
        <div class='line'>
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
            <el-form-item
            label="处理结果"
            prop="cause"
            :rules="[
              { required: true, message: '请输入处理结果', trigger: ['blur', 'change'] }
            ]">
              <el-input type="textarea" v-model="ruleForm.cause" autocomplete="off" maxlength="200"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class='line' v-else>
        <div class="th">备注：</div>
        <div class='td'>
          <el-input type="textarea" v-model="suspicion.remark" autocomplete="off" maxlength="200"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 质检弹窗 -->
    <el-dialog
      class="violations"
      :visible.sync="qualityVisible"
      width="400px">
      <div class='line title'>
        本次修改记录是否存在违规行为：
      </div>
      <div class='line'>
        <el-radio-group v-model="director.cause">
          <el-radio :label="'1'">需要质检确认</el-radio>
          <el-radio :label="'2'" :disabled="hasDirRule">没问题</el-radio>
        </el-radio-group>
      </div>
      <div v-if="hasDirRule && director.cause == '1'">
        <div class='line'>
          <el-form :model="directorRule" ref="directorRule" label-width="80px">
            <el-form-item
            label="备注"
            prop="cause"
            :rules="[
              { required: true, message: '请输入备注', trigger: ['blur', 'change'] }
            ]">
              <el-input type="textarea" v-model="directorRule.cause" autocomplete="off" maxlength="200"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class='line' v-else>
        <div class="th">备注：</div>
        <div class='td'>
          <el-input type="textarea" v-model="director.remark" autocomplete="off" maxlength="200"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDirector('directorRule')">取 消</el-button>
        <el-button type="primary" @click="submitDirector('directorRule')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import performanceApi from './api/riskManageApi'
export default {
  name: 'account-audit',
  data () {
    return {
      qualitySubmit: false, // 质检提交中
      serveSubmit: false, // 服务管理员提交中
      qualityVisible: false, // 咨询主管
      hasDirRule: false, // 咨询主管修改
      director: { // 主管
        cause: '', // 1、需要质检确认 2、没问题
        remark: '' // 备注
      },
      directorRule: {
        cause: ''
      },
      suspicion: { // 服务管理员角色
        cause: '', // 1、确认嫌疑 2、排除嫌疑
        line: '', // 2橙线 3黄线 4红线
        remark: ''
      }, // 嫌疑处理
      ruleForm: { // 确认嫌疑必填字段
        cause: ''
      },
      serveVisible: false, // 服务管理员弹窗
      stracelist: {}, // 订单列表
      orderId: '',
      editTime: '', // 修改时间
      editType: '', // 修改类型
      modifyDetail: [], // 修改详情
      button: {
        type: '',
        is_suspicion: '',
        warn_level: '',
        remark: ''
      } // 按钮状态
    }
  },
  mounted () {
    // 参数
    this.query = this.$route.query
    // 风控id
    this.riskId = this.query.risk_id
    this.getInitData()
  },
  methods: {
    // 计算分钟 s 转换 mm:ss
    sTransHs (s) {
      // 算法：将秒数除以60，然后下舍入，既得到分钟数
      var h
      h = Math.floor(s / 60)
      // 计算秒
      // 算法：取得秒%60的余数，既得到秒数
      s = s % 60
      // 将变量转换为字符串
      h += ''
      s += ''
      // 如果只有一位数，前面增加一个0
      h = (h.length == 1) ? '0' + h : h
      s = (s.length == 1) ? '0' + s : s
      return h + ':' + s
    },
    // 控制音频 只播放当前一个
    controlAudio (para) {
      var audios = document.getElementsByTagName("audio")
      for (let i = 0; i < audios.length; i++) {
        if (para.target != audios[i]) { // 除当前点击外音频暂停播放
          audios[i].pause()
        }
      }
    },
    // 打开质检弹窗
    openQua (para) {
      if (para) {
       this.director.cause = para
      }
      this.qualityVisible = true
      this.qualitySubmit = false
    },
    // 打开总管理员弹窗
    openAdmin (para) {
      // 嫌疑处理
      if (para) {
        this.suspicion.cause = para
      }
      this.serveVisible = true
      this.serveSubmit = false
    },
    // 质检弹窗取消
    resetDirector (formName) {
      //  增加判断  如果当前是确认嫌疑则重置否则不重置
      if (this.director.cause == '1' && this.hasDirRule) {
        this.$refs[formName].resetFields()
      }
      this.qualityVisible = false
    },
    // 质检确认
    submitDirector (formName) {
      if (this.qualitySubmit) {
        return
      }
      if (!this.qualitySubmit) {
        this.qualitySubmit = true
      }
      // 修改为需要质检确认 需做必填校验
      if (this.director.cause == '1' && this.hasDirRule) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitQuality()
          } else {
            return false
          }
        })
      } else {
        this.submitQuality()
      }
    },
    // 总管理员弹窗取消
    resetForm (formName) {
      //  增加判断  如果当前是确认嫌疑则重置否则不重置
      if (this.suspicion.cause == '1') {
        this.$refs[formName].resetFields()
      }
      this.serveVisible = false
    },
    // 总管理员确认
    submitForm (formName) {
      if (this.serveSubmit) {
        return
      }
      if (!this.serveSubmit) {
        this.serveSubmit = true
      }
      // 根据当前选择状态 判断是否校验必填  ==========  确认嫌疑时判断
      if (this.suspicion.cause == '1') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitAudit()
          } else {
            return false
          }
        })
      } else {
        this.submitAudit()
      }
    },
    async submitQuality () {
      let remark = this.director.cause == '1' && this.hasDirRule ? this.directorRule.cause : this.director.remark
      let params = {
        risk_id: this.riskId,
        is_suspicion: this.director.cause,
        remark: remark
      }
      try {
        let {data} = await performanceApi.getRiskAudit(params)
        if (data.code == 0) {
          this.qualityVisible = false
          this.getInitData()
        } else {
          alert(data.msg)
          this.qualityVisible = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async submitAudit () {
      // 判断当前状态和选中项 对参数进行处理
      let line = this.suspicion.cause == '1' ? this.suspicion.line : ''
      let remark = this.suspicion.cause == '1' ? this.ruleForm.cause : this.suspicion.remark
      let params = {
        risk_id: this.riskId,
        is_suspicion: this.suspicion.cause,
        remark: remark
      }
      if (this.suspicion.cause == '1') {
        params.warn_level = line
      }
      try {
        let {data} = await performanceApi.getRiskAudit(params)
        if (data.code == 0) {
          this.serveVisible = false
          this.getInitData()
        } else {
          alert(data.msg)
          this.serveVisible = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getInitData () {
      var params = {
        risk_id: this.query.risk_id
      }
      try {
        let result = await performanceApi.getRiskInitDetail(params)
        let {data} = result
        if (data.code == 0) {
          this.stracelist = data.data.strace
          this.riskId = data.data.risk_id
          this.orderId = data.data.order_id
          this.editTime = data.data.edit_time
          this.editType = data.data.edit_type
          this.modifyDetail = data.data.detail
          this.button = data.data.button
          // 清空数据
          this.hasDirRule = false
          this.director.cause = ''
          this.director.remark = ''
          this.directorRule.cause = ''
          this.suspicion.cause = ''
          this.suspicion.line = '2'
          this.suspicion.remark = ''
          this.ruleForm.cause = ''
          if (this.button.type == 'manager_edit') { // 主管修改
            this.hasDirRule = true
            this.director.cause = this.button.is_suspicion + ''
            this.directorRule.cause = this.button.remark
          }
          if (this.button.type == 'service_edit') { // 服务管理员修改
            this.suspicion.cause = this.button.is_suspicion + ''
            this.suspicion.line = this.button.warn_level + '' == '' ? '2' : this.button.warn_level + ''
            this.suspicion.remark = this.button.is_suspicion == '2' ? this.button.remark : ''
            this.ruleForm.cause = this.button.is_suspicion == '1' ? this.button.remark : ''
          }
        } else {
          alert(data.msg)
        }
        // 将滚动条恢复到顶部
        window.scrollTo(top)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.account-audit-box{
  padding: 0 15px;
}
audio:focus {
  outline: none;
}
.record-box{
  .point-red{
    color: #ff5c47;
  }
  .modyfy-list{
    padding: 30px 0 15px 0;
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    .modify-item{
      border-top: 1px solid #eee;
      font-size: 14px;
      min-width: 300px;
      max-width: 400px;
      text-align: center;
      position: relative;
      display:inline-block;
      vertical-align:top;
      &:last-child{
        .plan-item{
          margin-right: 0;
        }
      }
      &.enter{
        .plan-item,.circle{
          border: 1px solid #0ad487;
        }
      }
      &.modify{
        .plan-item,.circle{
          border: 1px solid #2e9ae2;
        }
      }
      &.director{
        .plan-item,.circle{
          border: 1px solid #fe974a;
        }
        .active{
          background: #fe974a;
          color: #fff;
        }
      }
      &.audit{
        .plan-item,.circle{
          border: 1px solid #ff4958;
        }
        .active{
          background: #ff4958;
          color: #fff;
        }
      }
      .time{
        position: absolute;
        line-height: 10px;
        top: 26px;
        text-align: center;
        left: 50%;
        margin-left: -75px;
      }
      .circle{
        display: inline-block;
        position: absolute;
        top: -22px;
        left: 50%;
        margin-left: -25px;
        background: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #3da6ff;
        line-height: 40px;
        text-align: center;
        font-size: 13px;
        span{
          display: inline-block;
          width: 30px;
          white-space: normal;
          line-height: 16px;
          margin-top: 4px;
        }
      }
      .plan-item{
        box-sizing: border-box;
        margin:45px 20px 0 0;
        padding: 10px;
        li{
          font-size: 14px;
          line-height: 22px;
          overflow: hidden;
          .th{
            color: #77808a;
            float: left;
            width: 70px;
            text-align: right;
            overflow: hidden;
          }
          .td{
            overflow: hidden;
            zoom: 1;
            text-align: left;
            white-space: normal;
            .delete{
              text-decoration: line-through;
            }
          }
        }
      }
    }
  }
  .modify-record{
    padding: 0 10px;
    overflow: hidden;
    .modify-before{
      float: left;
      border-right: 1px solid #eee;
      width: 46%;
      padding-right: 3%;
      margin-right: 3%;
      padding-bottom: 2000px;
      margin-bottom: -2000px;
      min-height: 1px;
    }
    .modify-after{
      float: left;
      width: 47%;
      min-height: 1px;
      padding-bottom: 2000px;
      margin-bottom: -2000px;
    }
    .modify-box{
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      &.before-box{
        background-color: #f4f6f9;
        border: 1px dashed #ddd;
      }
      &.after-box{
        background-color: #fef1ed;
        border: 1px dashed #ff5c47;
        .box-bd{
          .box{
            border: 1px solid #ff5c47;
          }
        }
      }
      .box-hd{
        font-size: 14px;
        font-weight: bold;
      }
      .box-bd{
        margin-top: 10px;
        .box{
          font-size: 13px;
          border-radius: 5px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          padding: 5px;
          &:last-child{
            margin-bottom: 0;
          }
        }
        .title{
          font-weight: bold;
        }
        .info{
          margin-top: 5px;
        }
        .audio-tag{
          width: 100%;
          margin-top: 10px;
          display: block;
        }
        .desc{
          padding: 5px 10px 0;
        }
        .result{
          float: right;
          margin-right: 10px;
        }
      }
    }
  }
  .edit-btn-area{
    margin-top: 20px;
    text-align: center;
  }
}
.violations{
  /deep/.el-dialog{
    .el-dialog__header{
      display: none;
    }
    .el-form-item{
      margin-bottom: 0;
    }
    .el-dialog__footer{
      text-align: center;
    }
    .el-dialog__body{
      .line{
        margin:0 0 15px 20px;
        &.title{
          font-size: 16px;
          font-weight: bold;
          margin-left: 10px;
        }
        .el-form-item__content{
          overflow: inherit;
        }
        .th{
          float: left;
          width: 45px;
          text-align: right;
        }
        .td{
          overflow: hidden;
          zoom: 1;
          text-align: left;
          white-space: normal;
        }
      }
    }
  }
}
</style>
