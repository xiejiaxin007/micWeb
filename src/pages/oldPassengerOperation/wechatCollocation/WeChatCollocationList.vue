<template>
  <div class="collocation-wrap">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-nav">
      <el-breadcrumb-item>
        <a href="/">首页</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>微信托管</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索表单-->
    <div class="collocation-form-wrap">
      <el-form
        :inline="true"
        :model="collocationForm"
        ref="collocationForm"
        :label-position="labelPosition"
        label-width="96px"
        class="collocation-form"
      >
        <el-form-item prop="city_id" label="城市：">
          <el-select
            v-model="collocationForm.city_id"
            @visible-change="setCityInfo"
            filterable
            placeholder="请选择城市"
          >
            <el-option v-for="item in cityData" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="employee_id" label="离职咨询师：">
          <el-select
            v-model="collocationForm.employee_id"
            filterable
            @visible-change="getleaveCounselor"
            placeholder="请输入离职咨询师关键字"
          >
            <el-option
              v-for="item in counselorData"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="wechat" label="托管微信名：">
          <el-input v-model="collocationForm.wechat" placeholder="请输入微信名"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="托管状态：">
          <el-select v-model="collocationForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="times" label="托管时间：">
          <el-date-picker
            v-model="collocationForm.times"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <div class="divider"></div>
        <el-form-item class="form-item-center">
          <el-button @click="resetForm('collocationForm')">重置</el-button>
          <el-button type="primary" @click="getCollocationListInfo">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--托管列表-->
    <div class="collocation-list">
      <div :class="['collocation-list-topbar', role ? '': 'flex-end']">
        <div class="table-describe" v-if='role'>
          当前共 {{collocationDescriptions.curTotal}} 个托管微信，
          <!-- 托管微信有 {{collocationDescriptions.curCustom}}个上户。 -->
          当前可托管微信{{collocationDescriptions.curEnableNum}}个，共可托管{{collocationDescriptions.enableTotal}}个
          <el-button class="btn-add" type="text" @click="dialogConf.adjustConfVis = true">新增配置</el-button>
        </div>
        <el-button class="btn-right" type="success" @click="addWxCollocation">+ 新增微信托管</el-button>
      </div>
      <div class="collocation-list-table">
        <el-table
          :data="collocationTableData"
          border
          style="width: 100%"
          :cell-style="setCellStyle"
        >
          <el-table-column prop="city_name" label="城市" align="center" min-width="80"></el-table-column>
          <el-table-column prop="employee_name" label="离职咨询师" align="center" min-width="140"></el-table-column>
          <el-table-column prop="employee_mobile" label="咨询师手机" align="center" min-width="140"></el-table-column>
          <el-table-column prop="wechat" label="托管微信" align="center" min-width="160"></el-table-column>
          <el-table-column prop="friend_number" label="好友个数" align="center" min-width="80"></el-table-column>
          <el-table-column prop="consult_number" label="咨询人数" align="center" min-width="80"></el-table-column>
          <el-table-column prop="status" label="托管状态" align="center" min-width="100"></el-table-column>
          <el-table-column prop="datetime" label="托管日期" align="center" min-width="160"></el-table-column>
          <el-table-column prop="handover" label="交接人" align="center" min-width="160"></el-table-column>
          <el-table-column fixed="right" align="left" label="操作" min-width="180">
            <template slot-scope="scope" v-if="scope.row.status !== '未托管'">
              <el-button @click="handoverWechat(scope.row)" type="text" size="medium">交接</el-button>
              <span class="split-ico">|</span>
              <el-button
                type="text"
                size="medium"
                v-if="scope.row.status === '托管中'"
                @click="editCollocation(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="medium"
                v-if="scope.row.status === '离线中'"
                @click="reLogin(scope.row)"
              >重新登录</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pages"
          background
          :hide-on-single-page="true"
          layout="prev, pager, next"
          :page-size="pages.pageSize"
          :page-count="pages.pageCount">
        </el-pagination>
      </div>
    </div>
    <!--交接微信弹窗-->
    <el-dialog
      class="w-dialog"
      title="提示"
      :visible.sync="dialogConf.handoverWechatVis"
      width="600px"
      center
    >
      <div class="content-wrap">
        <label class="dialog-form-label">选择咨询师：</label>
        <el-select
          v-model="dialogConf.handover"
          remote
          filterable
          :remote-method="getWorkCounselor"
          :loading="loading"
          placeholder="选择咨询师">
          <el-option
            v-for="item in handoverCounselors"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConf.handoverWechatVis = false">取 消</el-button>
        <el-button type="primary" @click="commitHandover" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
      </span>
    </el-dialog>
    <!--调整托管配置弹窗-->
    <el-dialog
      class="w-dialog"
      title="提示"
      :visible.sync="dialogConf.adjustConfVis"
      width="600px"
      center
    >
      <div class="content-wrap">
        <label class="dialog-form-label">输入微信可托管数量：</label>
        <el-input v-model.number="dialogConf.collocationNum" placeholder="输入微信可托管数量"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConf.adjustConfVis = false">取 消</el-button>
        <el-button type="primary" @click="commitConf">提交</el-button>
      </span>
    </el-dialog>
    <!--微信二维码登录托管弹窗-->
    <LoginDialog
      :entryType="entryType"
      :isVisible="wxDialogVisible"
      :employeeId="employeeId"
      :wxId="wxId"
      @wxDialogClose="wxDialogClose"
      @updateTable="getCollocationListInfo"
    />
  </div>
</template>

<script>
import LoginDialog from './components/WechatLoginDialog'
import { collocationStatus, collocationConfAccess } from './config/config' // 托管状态
import { getCity, getEmployee } from '@/api/commonApi'
import {
  getCollocationList,
  setCollocationCount,
  handoverWechatById
} from './api/weChatCollocation'
import { mapState } from 'vuex'
export default {
  name: 'WeChatCollocationList',
  components: {
    LoginDialog
  },
  data () {
    return {
      entryType: '1', // 微信弹窗类型
      employeeId: '', // 传给wx弹窗的员工id
      wxId: '',
      loading: false, // 搜索框loading
      fullscreenLoading: false, // 全屏loading
      wxDialogVisible: false, // 微信扫码弹窗显示状态
      labelPosition: 'right', // 表单右对齐
      collocationForm: { // form表单数据
        city_id: '',
        employee_id: '',
        wechat: '',
        status: '',
        times: ''
      },
      cityData: [], // 城市数据
      counselorData: [], // 咨询师数据
      statusData: collocationStatus, // 托管状态
      collocationDescriptions: {
        curTotal: 0, // 当前托管的微信数
        // curCustom: 2, // 托管中上户数
        curEnableNum: 0, // 当前还可托管微信数
        enableTotal: 0 // 共可托管微信数
      },
      collocationTableData: [],
      pages: {
        // 分页数据
        currentPage: 0, // 传值从0开始
        pageSize: 20, // 每页条数
        pageCount: 1 // 页数
      },
      dialogConf: {
        handoverWechatVis: false, // 交接微信弹窗显示隐藏
        handover: '', // 交接微信弹窗默认值
        adjustConfVis: false, // 调整配置弹窗显示隐藏
        collocationNum: '' // 调整配置默认值
      },
      handoverCounselors: [] // 交接微信选择咨询师数据
    }
  },
  computed: {
    ...mapState({
      uid: state => state.uid,
      // 权限：admin总管理员  super_admin超级管理员 可编辑，其他角色不可见
      role: state => collocationConfAccess.includes(state.role)
    })
  },
  created () {
    this.getCollocationListInfo()
  },
  methods: {
    // 获取托管列表信息
    getCollocationListInfo () {
      let options = {
        time_min: '',
        time_max: '',
        page: this.pages.currentPage,
        pageSize: this.pages.pageSize
      }
      const timeArr = this.collocationForm.times
      if (Array.isArray(timeArr)) {
        [options.time_min, options.time_max] = timeArr
      }
      Object.assign(options, this.collocationForm)
      delete options.times
      getCollocationList(options) // 查询托管列表
        .then(({ data }) => {
          if (data.code === 0) {
            const datas = data.data
            this.collocationTableData = datas.data
            this.collocationDescriptions.curTotal = datas.tg_count // 当前托管
            this.collocationDescriptions.curEnableNum = datas.tg_config - datas.tg_used // 还可托管
            this.collocationDescriptions.enableTotal = datas.tg_config // 配置的总共可托管数量
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 翻页
    curPageChange (curNum) {
      this.pages.currentPage = curNum - 1
      this.getCollocationListInfo()
    },
    // 获取城市信息
    setCityInfo (val) {
      if (!val) return
      const OUTTIME = 86400000 // 过期时间24*60*60*1000; 1天时间
      let cityinfo = this.getStorage('citys')
      if (cityinfo) {
        cityinfo = JSON.parse(cityinfo)
        const newTime = new Date().getTime()
        // 如果大于过期时间 或者切换用户登陆 则重新请求
        if (newTime - cityinfo.now > OUTTIME || this.uid !== Number(cityinfo.uid)) {
          this.getCityInfo()
        } else {
          this.cityData = cityinfo.oData
        }
      } else {
        // 获取最新城市信息
        this.getCityInfo()
      }
    },
    // 请求城市接口信息
    getCityInfo () {
      getCity()
        .then(res => {
          if (res.data.code === 0) {
            this.cityData = res.data.data
            this.dataStorage('citys', res.data.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 设置本地存储数据进行数据缓存 data: storageKey:本地存储的key
    dataStorage (storageKey, data) {
      if (!data || !storageKey) {
        return
      }
      const now = new Date().getTime() // 记录存储数据最新时间
      const storage = {
        now,
        uid: this.uid, // 当前用户id
        oData: data
      }
      const storageStr = JSON.stringify(storage)
      localStorage.setItem(storageKey, storageStr)
    },
    getStorage (key) { // 根据key获取localStorage对应值
      if (!key) return
      return localStorage.getItem(key)
    },
    // 获取在职咨询师
    getWorkCounselor (val) {
      this.loading = true
      const oEmployee = {
        q: val,
        role: 'header',
        status: 10 // 在职咨询师
      }
      getEmployee(oEmployee) // 获取员工信息公共接口
        .then(({ data }) => {
          if (data.code === 0) {
            this.handoverCounselors = data.data
            this.loading = false
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    // 获取离职咨询师下拉
    getleaveCounselor (val) {
      if (!val) return
      const oEmployee = {
        role: 'header',
        status: 0
      }
      getEmployee(oEmployee) // 获取员工信息公共接口
        .then(({ data }) => {
          if (data.code === 0) {
            this.counselorData = data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getCollocationListInfo() // 重置后重新获取列表数据
    },
    // 设置托管状态颜色
    setCellStyle ({ row, column, rowIndex, columnIndex }) {
      const correspondColor = {
        // 颜色和状态对应关系
        '托管中': '#36AE46',
        '未托管': '#FF4958',
        '离线中': '#BBBBBB'
      }
      if (columnIndex === 6) {
        return {
          color: correspondColor[row.status]
        }
      }
    },
    // 新增微信托管
    addWxCollocation () {
      this.entryType = '1'
      this.employeeId = ''
      this.wxDialogVisible = true
    },
    // 关闭微信弹窗
    wxDialogClose (val) {
      this.wxDialogVisible = val
    },
    // 微信交接
    handoverWechat (row) {
      this.dialogConf.handoverWechatVis = true
      this.tabItemId = row.id // 记录将要交接的托管id
    },
    // 提交微信交接
    commitHandover () {
      if (!this.dialogConf.handover) {
        this.$message({
          message: '交接人不可为空',
          type: 'warning'
        })
        return
      }
      const employeeId = this.dialogConf.handover
      const tabItemId = this.tabItemId
      this.fullscreenLoading = true
      handoverWechatById(tabItemId, employeeId)
        .then(({ data }) => {
          this.fullscreenLoading = false
          this.dialogConf.handoverWechatVis = false
          if (data.code === 0) {
            this.$message({
              message: data.msg,
              type: 'success'
            })
            this.getCollocationListInfo() // 交接成功更新托管列表
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          console.log(err)
        })
    },
    // 新增配置
    commitConf () {
      const newVal = this.dialogConf.collocationNum
      setCollocationCount(newVal)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$message({
              message: data.msg,
              type: 'success'
            })
            this.getCollocationListInfo() // 成功之后刷新列表数据
            this.dialogConf.adjustConfVis = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑托管微信
    editCollocation (row) {
      this.employeeId = row.employee_id
      this.wxId = row.wechat_id
      this.entryType = '2'
      this.wxDialogVisible = true
    },
    // 离线重新登录
    reLogin (row) {
      this.employeeId = row.employee_id
      this.wxId = row.wechat_id
      this.entryType = '3'
      this.wxDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.collocation-wrap {
  width: 100%;
  padding: 0 30px;
  margin: 0 auto;
  box-sizing: border-box;
  .bread-nav {
    padding: 20px 0;
  }
  .el-dialog__wrapper{
    background-color: inherit;
  }
  .collocation-form-wrap {
    background-color: #fff;
    padding: 20px 0px;
    .divider{
      width: 98%;
      height: 0;
      margin: 24px auto;
      border-bottom: 1px solid #dcdfe6;
    }
    /deep/ .el-form-item {
      margin-right: 28px;
      &.form-item-center {
        text-align: center;
        width: 100%;
        margin-bottom: 0;
      }
      .el-form-item__label {
        color: #333;
        padding: 0 8px 0 0;
      }
      .el-input,
      .el-range-editor {
        width: 320px;
        height: 40px;
      }
      .el-range-input {
        background-color: #fff;
      }
      .el-button {
        width: 96px;
        height: 40px;
      }
    }
  }
  .collocation-list {
    margin-bottom: 20px;

    .collocation-list-topbar {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 20px;
      margin-bottom: 19px;
      &.flex-end{
        justify-content: flex-end;
      }
      .table-describe {
        color: #666;
        .btn-add {
          margin-left: 19px;
        }
      }
      .el-button.btn-right {
        width: 128px;
        height: 36px;
        padding: 8px 15px;
        font-size: 14px;
      }
    }
    .collocation-list-table {
      background-color: #fff;
      padding: 21px;
      .split-ico {
        color: #ddd;
      }
      .pages{
        margin: 20px auto 0;
        text-align: center;
      }
      /deep/ .el-table th.gutter{ // 解决某些电脑缩放导致的表头错位
        display: table-cell!important;
      }
    }
  }
  .w-dialog {
    .content-wrap {
      text-align: center;
      /deep/ .el-input {
        width: 386px;
        height: 36px;
        .el-input__inner {
          line-height: 36px;
          height: 36px;
        }
      }
    }
    .dialog-footer {
      .el-button {
        width: 230px;
        height: 50px;
      }
    }
  }
}
</style>
