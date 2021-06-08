<template>
  <el-dialog title="微信托管" :visible.sync="compVisile" @open="openThisDialog" @close="closeThisDialog" width="600px" center>
    <div class="dialog-wrap">
      <!--弹窗顶部部分开开始-->
      <div class="dialog-form" v-if="entryType !=='3'">
        <label class="dialog-form-label">离职咨询师：</label>
        <el-select
          v-model="counselorForm.value"
          filterable
          remote
          :disabled="selectorActive"
          :remote-method="getCounselor"
          :loading="loading"
          @change="counselorChange"
          placeholder="请输入要托管的离职咨询师的姓名">
          <el-option v-for="item in counselors" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </div>
      <ul class="counselor-msg-offline" v-if="entryType ==='3'">
        <li class="counselor-msg-item">
          离职咨询师：
          <span class="span">{{ employeeInfo.employeeName}}</span>
        </li>
        <li class="counselor-msg-item">
          托管状态为：
          <span class="span">{{ getTextByValue(employeeInfo.trusteeshipStatus)}}</span>
        </li>
        <li class="counselor-msg-item">
          微 &nbsp;&nbsp;&nbsp;信&nbsp;&nbsp;&nbsp; 号：
          <span class="span">{{ employeeInfo.wxId}}</span>
        </li>
      </ul>
      <!--弹窗二维码或登录成功信息-->
      <div class="qrcode" id="qrcode" ref="qrcode" v-if="qrCodeShow" v-loading="qrcodeLoading">
      </div>
      <div class="login-success" v-else>
        <div class="login-msg">
          <span class="iconfont iconcode_success"></span>
          <span class="msg-desc">已经登录成功!</span>
        </div>
        <div class="counselor-msg">
          <p class="p">
            离职咨询师：
            <span class="span">{{ employeeInfo.employeeName}}</span>
          </p>
          <p class="p">
            微信号：
            <span class="span">{{ employeeInfo.wxId}}</span>
          </p>
        </div>
      </div>
      <!--信息提示-->
      <div class="msg">
        <el-button type="text" @click="refreshQrcode" :disabled="qrDisable" v-loading.fullscreen.lock="fullscreenLoading" v-if="textMsgShow">刷新二维码重新登录</el-button>
        <div class="msg-des" v-html="qrMessage" v-else>
        </div>
      </div>
    </div>
    <el-button class="cancle-btn" slot="footer" @click="closeThisDialog">取消</el-button>
  </el-dialog>
</template>

<script>
import {
  getNotColloCounselor,
  getWechatQrcode,
  getLoginStatus,
  employeeLoginInfo,
  logoutWechat
} from '../api/weChatCollocation'
import { collocationStatus } from '../config/config' // 托管状态
import QRCode from 'qrcodejs2'
const baseMsg = '请将要托管的微信扫描上方二维码并在手机上确认登录 <br/> 一个二维码只能托管一个微信，请确认登录成功后关闭弹窗'
const TIMEOUT = 3000
export default {
  name: 'LoginDialog',
  props: {
    employeeId: { // 员工id
      type: [Number, String],
      default: ''
    },
    wxId: { // wxid
      type: [Number, String],
      default: ''
    },
    // 1:新增 2：成功/编辑 3：重新登录
    entryType: {
      type: String,
      default: '1'
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      qrMessage: baseMsg,
      qrDisable: false,
      qrcodeLoading: false, // 二维码loading
      loading: false, // 选择框查询loading
      fullscreenLoading: false, // 全屏loading
      selectorActive: false, // 离职咨询师选择框禁用状态
      haveLoginSucess: false, // 是否已登录绑定成功
      currentVisible: this.isVisible, // 保存弹窗可见状态
      counselorForm: { // 离职咨询师选择值
        name: ''
      },
      employeeInfo: { // 离职咨询师信息
        employeeId: this.employeeId,
        wxId: '',
        employeeName: '',
        trusteeshipStatus: ''
      },
      codeUrl: '', // 二维码url
      counselors: [], // 离职未托管的咨询师,
      token: '',
      showRoloadQr: false, // 是否展示Qr
      timestamp: '' // 记录时间戳
    }
  },
  computed: {
    compVisile: {
      get () {
        return this.isVisible
      },
      set (val) {
        this.currentVisible = val
      }
    },
    qrCodeShow () { // 展示二维码框还是登录成功框
      return !this.haveLoginSucess
    },
    textMsgShow () { // 二维码下显示的文本（只有新增的时候二维码未登录时显示默认文字，否则一律显示刷新二维码按钮）
      return !(this.entryType !== '3' && !this.haveLoginSucess) || this.showRoloadQr
    }
  },
  created () { // 监听页面卸载 卸载时清楚未登录的token
    window.addEventListener('beforeunload', this.logoutQrcode)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.logoutQrcode)
  },
  methods: {
    // 退出当前二维码 页面卸载时调用，不能保证一定成功，只是减小token占用机率
    logoutQrcode () {
      if (this.token && !this.haveLoginSucess) {
        logoutWechat({token: this.token})
      }
    },
    // 托管状态转文字
    getTextByValue (val) {
      let text = ''
      collocationStatus.forEach(ele => {
        if (ele.value === val) {
          text = ele.text
        }
      })
      return text
    },
    // 微信登陆弹窗打开
    openThisDialog () {
      if (this.entryType === '1') { // 如果是新增不执行任何操作
        this.haveLoginSucess = false
        return
      }
      if (this.entryType === '2') { // 如果为编辑 禁用离职咨询师选择框禁用
        this.selectorActive = true
        this.haveLoginSucess = true // 更新登录成功状态（此时列表显示未托管中，但实际可能已经下线）
      }
      if (this.entryType === '3') { // 重新登陆
        this.haveLoginSucess = false
      }
      employeeLoginInfo(this.employeeId, this.wxId) // 通过id和wxid获取对应离职咨询师信息
        .then(({data}) => {
          if (data.code === 0) {
            this.employeeInfo = data.data
            if (this.entryType === '2') {
              this.counselorForm.value = data.data.employeeName // 将获取的咨询师信息复制到离职选择框
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据检索值获取离职咨询师列表
    getCounselor (queryVal) {
      this.loading = true
      getNotColloCounselor(queryVal)
        .then(({ data }) => {
          if (data.code === 0) {
            this.counselors = data.data
            this.loading = false
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    // 选择咨询师
    counselorChange (val) {
      this.selectorActive = true // 选择完禁用选择框
      this.qrcodeLoading = true // 加载二维码loading
      this.employeeInfo.employeeId = val // 将选择的值记录到本地
      this.getQrcodeById(val)
    },
    // 根据咨询师id获取二维码
    getQrcodeById (id) {
      this.qrcodeLoading = true
      // 开始获取二维码无论成功失败都应展示刷新二维码按钮
      this.timestamp = new Date().getTime()
      getWechatQrcode(id, this.timestamp)
        .then(({ data }) => {
          this.qrDisable = false // 接口成功后解除禁用
          this.qrcodeLoading = false // 关闭二维码获取loading
          this.selectorActive = true // 禁用选择框
          if (data.code === 0) {
            this.clearQrcode() // 获取成功后再清除一次 防止请求缓慢导致错误
            const codeUrl = data.data.url
            this.token = data.data.token // 二维码获取成功存储token
            const timestamp = Number(data.data.time)
            if (timestamp === this.timestamp) { // 如果请求的二维码url为最新二维码再生成
              this.qrcode = new QRCode('qrcode', { // 生成二维码
                text: codeUrl,
                width: 218,
                height: 218
              })
            }
            if (!(this.entryType === '1' && !this.haveLoginSucess)) { // 在非 新增未登录成功之前 都需要解除禁用
              this.selectorActive = false // 解除离职咨询师选择禁用
            }
            this.queryErrCount = 0 // 初始化登录轮询状态次数
            this.getLoginStatusContinuely(id) // 开始轮询查询登录状态
          } else if (data.code === 1002) { // 获取二维码异常
            if (!(this.entryType === '1' && !this.haveLoginSucess)) { // 在非 新增未登录成功之前 都需要解除禁用
              this.selectorActive = false // 解除离职咨询师选择禁用
            }
            this.showRoloadQr = true // 展示刷新二维码按钮
            this.$message.error(data.msg)
            if (data.msg === '没有可用token') {
              this.qrMessage = '亲，当前可用的托管账号已经用完了，如果有托管需求请即时联系产品运营同学～'
            }
          } else {
            this.$message.error(data.msg)
          }
          // qrcode.makeCode("http://naver.com"); // make another code.
        })
        .catch(err => {
          this.qrDisable = false
          this.qrcodeLoading = false // 关闭Qr loading
          console.log(err)
        })
    },
    // 刷新二维码重新登陆
    refreshQrcode () {
      this.qrDisable = true // 点击刷新二维码禁用按钮
      this.clearQrcode() // 获取新二维码之前先清除之前二维码
      if (this.haveLoginSucess) { // 如果已经登陆则退出登陆
        this.fullscreenLoading = true
        logoutWechat({employee_id: this.employeeInfo.employeeId}).then(({data}) => {
          if (data.code === 0) {
            this.haveLoginSucess = false // 登录状态置为false
            this.$emit('updateTable') // 更新表格列表数据
            // this.qrcodeLoading = true
            setTimeout(() => { // 退出token2s后再请求二维码
              this.fullscreenLoading = false // 隐藏全屏loading
              this.getQrcodeById(this.employeeInfo.employeeId) // 清除完token再获取二维码 防止网络延迟导致id丢失
            }, TIMEOUT)
          } else {
            this.fullscreenLoading = false // 隐藏全屏loading
          }
        }).catch(err => {
          this.fullscreenLoading = false // 隐藏全屏loading
          console.log(err)
        })
      } else { // 如果还未登录则判断是否有token 清楚token
        if (this.token !== '') {
          this.fullscreenLoading = true
          this.clearToken(this.employeeInfo.employeeId)
          return
        }
        this.getQrcodeById(this.employeeInfo.employeeId) // 获取二维码
      }
    },
    // 清楚上一次登录token
    clearToken (employeeId) {
      logoutWechat({token: this.token}).then(({data}) => {
        if (data.code === 0) {
          this.token = ''
          // this.qrcodeLoading = true // 再调用开始前二维码就要开始loading
          setTimeout(() => { // 退出token2s后再请求二维码
            this.fullscreenLoading = false // 隐藏全屏loading
            this.getQrcodeById(employeeId) // 清除完token再获取二维码 防止网络延迟导致id丢失
          }, TIMEOUT)
        } else {
          this.fullscreenLoading = false // 隐藏全屏loading
        }
      }).catch(err => {
        this.fullscreenLoading = false // 隐藏全屏loading
        console.log(err)
      })
    },
    // 轮询获取登录状态
    getLoginStatusContinuely (id) {
      if (!this.token) return // 如果不存在token即认为已经清楚token,需要结束轮询
      setTimeout(() => {
        if (this.queryErrCount < 10) { // 如果连续出错10次则停止轮询
          getLoginStatus(id)
            .then(({ data }) => {
              if (data.code === 0) {
                // 登录成功执行操作
                const employeeObj = data.data
                this.employeeInfo.employeeName = employeeObj.employeeName
                this.employeeInfo.wxId = employeeObj.wxId
                this.employeeInfo.employeeId = id
                this.clearQrcode()
                this.token = '' // 登录成功之后清楚token
                this.haveLoginSucess = true
                this.$emit('updateTable') // 更新表格列表数据
              } else if (data.code === 1002) {
                // 还未登录成功 继续调用该方法
                this.getLoginStatusContinuely(id)
              }
            })
            .catch(err => {
              this.queryErrCount++
              this.getLoginStatusContinuely(id)
              console.log(err)
            })
        } else {
          this.$message({
            message: '获取登录状态失败，请稍后再试',
            type: 'error'
          })
        }
      }, 2000)
    },
    // 关闭弹窗
    closeThisDialog () {
      this.$emit('wxDialogClose', false) // 关闭弹窗
      this.timestamp = '' // 关闭弹窗清空，防止之后请求的二维码重新进入
      this.selectorActive = false // 启用选择框
      this.counselorForm.value = '' // 清空已选值
      this.clearQrcode()
      this.qrcodeLoading = false // 加载二维码loading
      if (!this.haveLoginSucess) { // 当未登录时执行清楚token
        if (this.token === '') return
        logoutWechat({token: this.token}).then(({data}) => {
          if (data.code === 0) {
            this.token = '' // 此清除token成功仅清空本地token值
          }
        })
      }
      this.qrMessage = baseMsg // 恢复默认选择的文字
    },
    // 清除二维码
    clearQrcode () {
      this.qrcode && this.qrcode.clear() // clear the code.
      if (this.$refs.qrcode) {
        this.$refs.qrcode.innerHTML = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-wrap {
  box-sizing: border-box;
  .dialog-form {
    text-align: center;
    .dialog-form-label {
      color: #333;
      line-height: 36px;
    }
    /deep/ .el-input__inner {
      width: 386px;
      height: 36px;
    }
  }
  .counselor-msg-offline {
    padding-left: 40px;
    .counselor-msg-item {
      color: #333;
      line-height: 28px;
      .span {
        color: #666;
      }
    }
  }
  .qrcode {
    text-align: center;
    margin: 30px auto 10px;
    width: 218px;
    height: 218px;
    background-color: #d8d8d8;
  }
  .login-success {
    box-sizing: border-box;
    width: 480px;
    height: 220px;
    background-color: #f4f6f9;
    margin: 38px auto;
    padding: 40px 20px;
    .login-msg {
      text-align: center;
      .iconcode_success {
        font-size: 50px;
        color: #66d2b4;
        vertical-align: middle;
      }
      .msg-desc {
        font-size: 26px;
        color: #333;
        vertical-align: middle;
      }
    }
    .counselor-msg {
      margin-top: 38px;
      .p {
        color: #333;
        line-height: 28px;
        .span {
          color: #666;
        }
      }
    }
  }
  .msg {
    text-align: center;
    margin-top: 8px;
  }
}
/deep/ .el-dialog__header {
  .el-dialog__close {
    font-size: 18px;
    font-weight: bold;
    color: #222;
  }
}
.el-dialog__footer {
  .cancle-btn {
    width: 230px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
