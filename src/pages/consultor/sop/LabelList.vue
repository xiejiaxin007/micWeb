<template>
    <div class="el-row">
      <el-col :span="24" class="content-main">
        <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item :to="{path:'/labelHome'}">标签管理首页</el-breadcrumb-item>
          <el-breadcrumb-item>【{{tag_name}}】标签管理列表页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box">
          <div class="hd">
            <h2>【{{tag_name}}】标签管理页面</h2>
            <el-button class="filter-link-more" type="info" v-if="isCancelFlag" @click="showBatchBox">批量取消</el-button>
          </div>
          <div class="bd">
            <div class="order-search">
              <!--查询需求-->
              <ul class="s-query" v-if="!isBatch">
                <li v-for="(formItem, index) in formList" :key="index">
                  <div class="th">{{formItem.name}}：</div>
                  <div :class="{'td fixHeight': formItem.formEle.toString() === 'time', 'td': formItem.formEle.toString() !== 'time'}">
                    <!--精确输入-->
                    <el-input v-if="formItem.formEle.toString() === 'input'" v-model="formItem.model" :placeholder="formItem.placeholder"></el-input>
                    <!--下拉框-->
                    <el-select v-else-if="formItem.formEle.toString() === 'select'" v-model="formItem.model" :placeholder="formItem.placeholder">
                      <el-option
                        v-for="item in formItem.options"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <!--时间段选择-->
                    <el-date-picker v-else-if="formItem.formEle.toString() === 'time'"
                                    v-model="formItem.model"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    prefix-icon="date-tip-logo"
                                    :picker-options="pickerOptions"
                                    @focus="timeFocus(formItem)"
                                    :start-placeholder="formItem.placeholder"
                                    :end-placeholder="formItem.placeholder">
                    </el-date-picker>
                    <!--selectTo-->
                    <select-to v-else-if="formItem.formEle.toString() === 'selectTo'"
                               v-model="formItem.model"
                               :role="checkRole(formItem.id)"
                               :uid="uid"
                               :curRole="curRole">
                    </select-to>
                  </div>
                </li>
              </ul>
              <!--批量通过查询项-->
              <div class="batch-form-box" v-else>
                <el-form :model="batchForm" :rules="batchFormRules" ref="batchForm" class="demo-ruleForm">
                  <ul class="s-query">
                    <li class="auto-column">
                      <div class="th required">请选择（标签ID）：</div>
                      <div class="td">
                        <el-form-item label="" prop="selectId" required>
                          <el-select v-model="batchForm.selectId" @change="labelChange" placeholder="请选择">
                            <el-option label="标签ID" value="tag"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </li>
                    <li class="auto auto-column">
                      <div class="th required">请输入（标签ID）：</div>
                      <div class="td">
                        <el-form-item label="" prop="tagList" required>
                          <el-input type="textarea" v-model="batchForm.tagList" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容"></el-input>
                          <div class="form-tip-box">支持输入多个，2个签ID之间，支持用逗号隔开。</div>
                        </el-form-item>
                      </div>
                    </li>
                  </ul>
                </el-form>
              </div>
            </div>
            <div class="btn-area" v-if="!isBatch">
              <el-button @click="resetSearch">重置</el-button>
              <el-button type="primary" @click="doSearch(1)">搜索</el-button>
            </div>
            <div class="btn-area batch-btn-area" v-else>
              <el-button type="primary" @click="batchResult">查看结果</el-button>
              <el-button type="primary" @click="batchPass" :disabled="batchDis">批量取消</el-button>
            </div>
          </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
          <div class="bd">
            <div class="search-result">
              <table-box-fixed :tableData="tableList"
                               :paging="isPage"
                               :limit="pageLimit"
                               :totalCount="dataSum"
                               :tableLabel="tableLabel"
                               @pageUpdate="pageUpdate"
                               :fixedCol="fixedCol"
                               :hasCheckBox="hasCheckBox"
                               :tableFilter="false"
                               :role="employeeName"
                               :uid="uid"
                               @tableFilterList="tableFilter"
                               :checkInit="checkInit"
                               @checkedList="checkedList"
                               :isList="true"
                               @cancelLabel="cancelLabel"
              ></table-box-fixed>
            </div>
          </div>
        </div>
      </el-col>
      <!--通过弹窗-->
      <el-dialog
        title="提示"
        :visible.sync="passDialog"
        width="30%">
        <div>{{tipText}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passDialog = false">取 消</el-button>
          <el-button type="primary" @click="passBtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { TableBox, TableBoxFixed } from './components'
import { SelectTo } from '@/components'
import {ConfigSearch} from './config/labelConfig'
import { mapState } from 'vuex'
export default {
  name: 'label-list',
  data () {
    return {
      fixedCol: true,
      input1: '',
      formList: [], // 动态筛选项组合
      zxsList: [], // 咨询师数组
      zxsLeadList: [], // 咨询师主管数组
      tableList: [], // 表格内容
      configPara: {}, // 配置项组装参数
      tablePara: {}, // 表格请求参数
      tag_config_id: this.$route.query.tag_config_id, // 路由传递的标签ID
      tag_name: this.$route.query.tag_name, // 标签名字
      pageLimit: 20, // 每页多少条
      dataSum: 0, // 一共多少条
      isPage: true, // 是否分页
      tableLabel: [], // 表头
      tableData: [], // 表格数据
      isBatch: false, // 是否展示批量操作
      searchType: '1', // 当前筛选的表格类型，1代表正常，2代表批量申诉，只有点击查看结果时变为批量
      batchDis: true, // 批量通过按钮是否禁用
      isOperate: true, // 操作列是否固定
      checkInit: false, // 触发全部选中
      isCancelFlag: false, // 是否展示批量取消按钮
      labelList: [], // 标签列表
      hasCheckBox: false, // 是否多选
      isTag: false, // 批量筛选时候选中标签ID，进行二次筛选
      cancelIds: [], // 取消标签合集
      repeatCacel: true, // 取消重复提交
      batchCacel: true, // 批量重复提交
      tipText: '您是想一键通过这00个标签（或订单）的申诉吗？系统会记录您的审核日志，请谨慎操作。', // 通过弹窗文案提示
      batchForm: { // 批量表单
        selectId: '', // 批量选择搜索项
        batchLabelName: '', // 批量选择的标签ID
        tagList: '' // 查询的ID组合值
      },
      passDialog: false, // 申诉通过弹窗
      batchFormRules: {}, // 批量表单规则
      batchPassNum: {waitNum: 0, allNum: 0}, // 记录批量通过中各项的状态，wait为正常标签
      status: [], // 表格筛选项
      page: 1, // 当前页数
      curRole: '', // 当前角色
      pickerOptions: {}
    }
  },
  components: {
    SelectTo,
    TableBox,
    TableBoxFixed
  },
  created () {
    if (this.employeeName.role) {
      // 上一个页面跳转过来时候进行配置
      // 配置筛选项，如果角色是role的话，需要根据post岗位来进行区分
      this.curRole = this.employeeName.role
      if (this.employeeName.role === 'admin' && this.employeeName.jobs === '全国') {
        this.formList = ConfigSearch.getConfig('city_config', this.$route.query.tag_config_id)
      } else {
        this.formList = ConfigSearch.getConfig(this.employeeName.role, this.$route.query.tag_config_id)
      }
      // 是否展示批量取消
      if (this.employeeName.role === 'admin-sop' || this.employeeName.role === 'service_product') {
        this.isCancelFlag = true
      } else {
        this.isCancelFlag = false
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 默认搜索表格
      this.doSearch(this.page)
      this.curRole = this.employeeName.role
      this.getLabel()
    })
  },
  computed: {
    ...mapState({
      employeeName: state => state.employeeName,
      uid: state => state.uid
    })
  },
  methods: {
    // 时间控件获取焦点事件
    timeFocus (para) {
      para.model = []
    },
    // 判断咨询师还是咨询师主管，咨询师为1，主管为2
    checkRole (para) {
      let result = para === 'employee_id' ? 1 : 2
      return result
    },
    // 获取分页点击参数
    pageUpdate (para) {
      this.page = para
      this.doSearch(para)
    },
    // 批量操作选择标签ID
    labelChange (para) {
      // 选中标签ID
      if (para === 'tag') {
        this.isTag = true
      } else {
        this.isTag = false
      }
    },
    // 重置搜索项
    resetSearch () {
      // 重置form表单
      for (let i = 0; i < this.formList.length; i++) {
        this.formList[i].model = ''
      }
      this.doSearch(1)
    },
    // 点击批量通过按钮
    showBatchBox () {
      // 切换批量操作的筛选操作
      this.isBatch = !this.isBatch
      // 如果当前切换成正常搜索，则type变为1，打开分页
      if (!this.isBatch) {
        this.searchType = '1'
        this.isPage = true
        // 禁用批量通过按钮
        this.batchDis = true
        // 清空之前的筛选
        this.batchForm.selectId = ''
        this.batchForm.batchLabelName = ''
        this.batchForm.tagList = ''
        this.hasCheckBox = false
        // 固定列
        // this.isOperate = true
        // 请求正常表格
        this.doSearch(1)
      }
    },
    // 选择项发生变化
    checkedList (para) {
      // 先清空选中项
      this.cancelIds = []
      if (this.searchType !== '1') {
        this.batchPassNum.waitNum = 0
        this.batchPassNum.allNum = para.length
        para.forEach(row => {
          // 如果状态是正常
          if (row.operation.toString() === '0') {
            this.batchPassNum.waitNum++
            // 去重
            if (this.cancelIds.indexOf(row.tag_id) === -1) {
              this.cancelIds.push(row.tag_id)
            }
          }
        })
      }
    },
    // 通过弹窗的确认按钮
    passBtn () {
      if (this.cancelIds.length > 0) {
        if (this.batchCacel) {
          this.batchCacel = false
          // 进行请求
          let params = {
            tag_id: this.cancelIds.length > 0 ? this.cancelIds.join(',') : '',
            tag_config_id: this.$route.query.tag_config_id
          }
          this.axios.post('/backend-api/bk-api-tag-manage/list-cancel-tag', params).then((res) => {
            if (res.data.code === 0) {
              // 关闭弹窗
              this.passDialog = false
              this.doSearch(1)
              alert('操作成功')
              this.batchCacel = true
            }
          }).catch((err) => {
            this.batchCacel = true
            console.log(err)
          })
        }
      } else {
        this.passDialog = false
      }
    },
    // 点击查看结果
    batchResult () {
      // 如果当前切换成正常搜索，则type变为1，分页关闭
      this.searchType = '2'
      // 查看结果默认重新选择第一页
      this.page = 1
      this.$refs['batchForm'].validate((valid) => {
        if (valid) {
          // 去掉分页
          this.isPage = false
          // 开启批量通过按钮
          this.batchDis = false
          // 取消固定列
          // this.isOperate = false
          this.doSearch(1)
        } else {
          return false
        }
      })
    },
    // 单独取消
    cancelLabel (para) {
      if (this.repeatCacel) {
        this.repeatCacel = false
        let params = {
          tag_config_id: this.$route.query.tag_config_id,
          tag_id: para
        }
        this.axios.post('/backend-api/bk-api-tag-manage/list-cancel-tag', params).then((res) => {
          if (res.data.code === 0) {
            this.doSearch(this.page)
            this.repeatCacel = true
          }
        }).catch((err) => {
          this.repeatCacel = true
          console.log(err)
        })
      }
    },
    // 批量通过按钮
    batchPass () {
      // 动态给弹窗文案赋值
      if (this.batchPassNum.waitNum === this.batchPassNum.allNum) {
        this.tipText = '您选择' + this.batchPassNum.allNum + '个标签，其中' + this.batchPassNum.allNum + '个均为正常标记的标签。您确定是取消这' + this.batchPassNum.allNum + '个标签吗？PS：执行取消后，不可重新标记；请谨慎。'
      } else if (this.batchPassNum.waitNum < this.batchPassNum.allNum && this.batchPassNum.waitNum === 0) {
        this.tipText = '您选择' + this.batchPassNum.allNum + '个标签，其中' + this.batchPassNum.waitNum + '个为正常标签，' + (this.batchPassNum.allNum - this.batchPassNum.waitNum) + '个为取消标签。PS：执行取消后，不可重新标记；请谨慎。'
      } else if (this.batchPassNum.waitNum < this.batchPassNum.allNum && this.batchPassNum.waitNum > 0) {
        this.tipText = '您选择' + this.batchPassNum.allNum + '个标签，其中' + this.batchPassNum.waitNum + '个为正常标签，' + (this.batchPassNum.allNum - this.batchPassNum.waitNum) + '个为取消标签。您确定是取消这' + this.batchPassNum.waitNum + '个标签吗？PS：执行取消后，不可重新标记；请谨慎。'
      }
      this.passDialog = true
    },
    // 获取标签名字
    getLabel () {
      this.axios.post('/backend-api/bk-api-tag-manage/tags-down-list', this.tablePara).then((res) => {
        if (res.data.code === 0) {
          this.labelList = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击表格通过按钮
    passAlone (para) {
      let params = {
        appeal_id: para,
        auditor: this.uid
      }
      this.axios.post('/backend-api/bk-api-tag-manage/exam-passed', params).then((res) => {
        if (res.data.code === 0) {
          this.doSearch(this.page)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 筛选表格监听
    tableFilter (para) {
      this.status = para.join(',')
      this.doSearch(this.page)
    },
    // 点击搜索进行数据筛选
    doSearch (pagePara) {
      if (this.searchType === '1') {
        // 如果是直接点击搜索按钮，那page一定是1
        this.tablePara = {
          order_id: '',
          tag_id: '',
          employee_id: '',
          employee_leader_id: '',
          is_cancel: '',
          city_id: '',
          create_datetime_min: '',
          create_datetime_max: '',
          distribute_datetime_min: '',
          distribute_datetime_max: '',
          tag_config_id: this.tag_config_id,
          cancel_type: '',
          page: parseInt(pagePara)
        }
        // 组装请求参数
        for (let i = 0; i < this.formList.length; i++) {
          if (this.formList[i].formEle === 'time') {
            // 如果是时间筛选项，需要特殊处理，起止时间放在了一个数组，需要拆分一下
            this.tablePara[this.formList[i].id + '_min'] = this.formList[i].model ? this.formList[i].model[0] : ''
            this.tablePara[this.formList[i].id + '_max'] = this.formList[i].model ? this.formList[i].model[1] : ''
          } else {
            this.tablePara[this.formList[i].id] = this.formList[i].model
          }
        }
      } else {
        this.tablePara = {
          order_id: '',
          tag_id: this.batchForm.tagList.replace(/，/ig, ','),
          employee_id: '',
          employee_leader_id: '',
          is_cancel: '',
          city_id: '',
          create_datetime_min: '',
          create_datetime_max: '',
          distribute_datetime_min: '',
          distribute_datetime_max: '',
          tag_config_id: this.tag_config_id,
          cancel_type: ''
        }
      }
      this.checkInit = false
      this.axios.get('/backend-api/bk-api-tag-manage/list', {params: this.tablePara}).then((res) => {
        if (res.data.code === 0) {
          if (this.searchType === '1') {
            this.dataSum = parseInt(res.data.data.total)
            this.tableLabel = res.data.data.fields
          } else {
            // 触发全部选中
            this.checkInit = true
            let titleList = res.data.data.fields
            titleList.splice(titleList.length - 1, 1)
            this.tableLabel = titleList
            this.hasCheckBox = true
          }
          this.tableList = res.data.data.list
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  watch: {
    // 刷新时候重新配置筛选项
    employeeName: {
      deep: true,
      handler: function (val) {
        this.curRole = this.employeeName.role
        // 配置筛选项，如果角色是role的话，需要根据post岗位来进行区分
        if (this.employeeName.role === 'admin' && this.employeeName.jobs === '全国') {
          this.formList = ConfigSearch.getConfig('admin_product', this.$route.query.tag_config_id)
        } else {
          this.formList = ConfigSearch.getConfig(this.employeeName.role, this.$route.query.tag_config_id)
        }
        // 是否展示批量取消
        if (this.employeeName.role === 'admin-sop' || this.employeeName.role === 'service_product') {
          this.isCancelFlag = true
        } else {
          this.isCancelFlag = false
        }
      }
    }
  }
}
</script>

<style scoped>
  .content-main{
    padding: 0 15px;
  }
  .form-table-box{
    background-color: #fff;
  }
  .form-table-box .filter-link-more{
    float: right;
    padding: 9px 20px;
    margin-top: 6px;
  }
  .order-search{
    overflow: hidden;
  }
  .order-search >>> .el-date-editor, .order-search >>> .el-select{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
  }
  .order-search >>> .el-select >>> .el-input{
    height: 40px;
  }
  .order-search >>> .el-range-input{
    background-color: #fff;
    font-size: 12px;
    line-height: 32px;
  }
  .order-search >>> .el-date-editor .el-range-separator{
    font-size: 12px;
  }
  .order-search .fixHeight{
    height: 40px;
  }
  .order-search >>> .el-date-editor .date-tip-logo{
    display: none;
  }
  .order-search > .s-query > li .td{
    height: 40px;
  }
  .s-query > li.long-column{
    width: 360px;
  }
  .s-query > li.margin-next{
    margin-left: 20px;
  }
  .form-tip-box{
    color: #999;
  }
  .form-table-box .batch-btn-area{
    text-align: right;
  }
  .batch-form-box >>> .el-form-item{
    margin-bottom: 0;
  }
</style>
