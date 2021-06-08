<template>
    <div class="el-row">
      <el-col :span="24" class="content-main">
        <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>申诉管理列表页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box">
          <div class="hd">
            <h2>搜索条件</h2>
            <el-button class="filter-link-more" type="info" v-if="isBatchBtnShow" @click="showBatchBox">批量通过</el-button>
          </div>
          <div class="bd">
            <div class="order-search">
              <!--查询需求-->
              <ul class="s-query" v-if="!isBatch">
                <li>
                  <div class="th">标记日期：</div>
                  <div class="td">
                    <el-date-picker v-model="labelDate"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    prefix-icon="date-tip-logo"
                                    :picker-options="pickerOptions"
                                    @focus="timeFocus('labelDate')"
                                    start-placeholder="请输入时间"
                                    end-placeholder="请输入时间">
                    </el-date-picker>
                  </div>
                </li>
                <li>
                  <div class="th">订单ID：</div>
                  <div class="td">
                    <el-input v-model="orderId" placeholder="请输入订单ID"></el-input>
                  </div>
                </li>
                <li>
                  <div class="th">咨询师：</div>
                  <div class="td">
                    <select-to v-model="zxsModel"
                               :role="checkRole(1)"
                               :uid="uid"
                               :curRole="curRole">
                    </select-to>
                  </div>
                </li>
                <li v-if="headerFlag">
                  <div class="th">咨询师主管：</div>
                  <div class="td">
                    <select-to v-model="zxsManaModel"
                               :role="checkRole(2)"
                               :uid="uid"
                               :curRole="curRole">
                    </select-to>
                  </div>
                </li>
                <li>
                  <div class="th">标签ID：</div>
                  <div class="td">
                    <el-input v-model="labelSeleId" placeholder="请输入标签ID"></el-input>
                  </div>
                </li>
                <li>
                  <div class="th">标签名称：</div>
                  <div class="td">
                    <el-select v-model="labelSeleName" placeholder="请选择">
                      <el-option
                        v-for="item in labelList"
                        :key="item.tag_config_id"
                        :label="item.tag_name"
                        :value="item.tag_config_id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div class="th">申诉日期：</div>
                  <div class="td">
                    <el-date-picker v-model="appealDate"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    prefix-icon="date-tip-logo"
                                    :picker-options="pickerOptions"
                                    @focus="timeFocus('appealDate')"
                                    start-placeholder="请输入时间"
                                    end-placeholder="请输入时间">
                    </el-date-picker>
                  </div>
                </li>
                <li v-if="cityFlag">
                  <div class="th">城市：</div>
                  <div class="td">
                    <el-select v-model="cityId" placeholder="请选择">
                      <el-option
                        v-for="item in cityListAppeal"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div class="th">申诉状态：</div>
                  <div class="td">
                    <el-select v-model="appealStatus" placeholder="请选择">
                      <el-option
                        v-for="item in appealStatusList"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
              </ul>
              <!--批量通过查询项-->
              <div class="batch-form-box" v-else>
                <el-form :model="batchForm" :rules="batchFormRules" ref="batchForm" class="demo-ruleForm">
                <ul class="s-query">
                  <li class="auto-column">
                    <div class="th required">请选择（申诉ID或标签ID）：</div>
                    <div class="td">
                      <el-form-item label="" prop="selectId" required>
                        <el-select v-model="batchForm.selectId" @change="labelChange" placeholder="请选择">
                          <el-option label="申诉ID" value="appeal"></el-option>
                          <el-option label="标签ID" value="tag"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </li>
                  <li class="auto-column margin-next" v-if="isTag">
                    <div class="td">
                      <el-form-item label="" prop="batchLabelName" required>
                        <el-select v-model="batchForm.batchLabelName" placeholder="请选择">
                          <el-option
                            v-for="item in labelList"
                            :key="item.tag_config_id"
                            :label="item.tag_name"
                            :value="item.tag_config_id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </li>
                  <li class="auto auto-column">
                    <div class="th required">请输入（申诉ID或标签ID）：</div>
                    <div class="td">
                      <el-form-item label="" prop="tagList" required>
                        <el-input type="textarea" v-model="batchForm.tagList" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容"></el-input>
                        <div class="form-tip-box">支持输入多个，2个申诉ID（或者标签ID）之间，支持用逗号隔开。</div>
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
              <el-button type="primary" @click="batchPass" :disabled="batchDis">批量通过</el-button>
            </div>
          </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
          <div class="bd">
            <div class="search-result">
              <table-box-appeal-fixed :tableData="tableList"
                         :paging="isPage"
                         :limit="pageLimit"
                         :totalCount="dataSum"
                         :tableLabel="tableLabel"
                         @pageUpdate="pageUpdate"
                         :fixedCol="fixedCol"
                         :hasCheckBox="hasCheckBox"
                         :tableFilter="tableFilterFlag"
                         :role="employeeName"
                         :uid="uid"
                         @tableFilterList="tableFilter"
                         @operateBtn="operateBtn"
                         :checkInit="checkInit"
                         @checkedList="checkedList"
              ></table-box-appeal-fixed>
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
      <!-- 模态框 -->
      <Modal ref="Modalchild" @resDetaildata="resDetaildata"
          :tagid="failObj.tag_id"
          :orderid="failObj.order_id"
          :appealreason="failObj.appeal_reason"
          :desc="failObj.desc"
          :appealImage="failObj.appeal ? failObj.appeal.appealImage : []"
          :appeal_id="appeal_id"/>
    </div>
</template>

<script>
import { TableBox, TableBoxAppealFixed, Modal } from './components'
import {SelectTo} from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'label-list',
  data () {
    return {
      fixedCol: true, // 是否固定列
      labelDate: [], // 标记日期
      orderId: '', // 订单ID
      zxsModel: '', // 咨询师
      zxsManaModel: '', // 咨询师主管
      labelSeleId: '', // 标签ID
      labelSeleName: '', // 标签名称
      appealDate: [], // 申诉日期
      cityId: '', // 城市
      formList: [], // 动态筛选项组合
      zxsList: [], // 咨询师数组
      zxsLeadList: [], // 咨询师主管数组
      tableList: [], // 表格内容
      configPara: {}, // 配置项组装参数
      tablePara: {}, // 表格请求参数
      tableFilterFlag: true, // 表格筛选项
      pageLimit: 20, // 每页多少条
      dataSum: 0, // 一共多少条
      isPage: true, // 是否分页
      tableLabel: [], // 表头
      isBatchBtnShow: false, // 是否展示批量审批按钮
      tableData: [], // 表格数据
      page: 1, // 当前页数
      curRole: '', // 当前角色
      hasCheckBox: false, // 是否多选
      headerFlag: false, // 咨询师主管角色标志
      cityFlag: false, // 城市展示标志
      labelList: [], // 标签列表
      isBatch: false, // 是否展示批量操作
      checkInit: false, // 触发全部选中
      isOperate: true, // 操作列是否固定
      isTag: false, // 批量筛选时候选中标签ID，进行二次筛选
      searchType: '1', // 当前筛选的表格类型，1代表正常，2代表批量申诉，只有点击查看结果时变为批量
      batchDis: true, // 批量通过按钮是否禁用
      passDialog: false, // 申诉通过弹窗
      appealId: [], // 批量申诉列表id
      tbRef: '',
      failObj: {}, // 驳回弹窗内容
      appeal_id: '', // 申诉Id
      batchPassNum: {waitNum: 0, allNum: 0}, // 记录批量通过中各项的状态
      tipText: '您是想一键通过这00个标签（或订单）的申诉吗？系统会记录您的审核日志，请谨慎操作。', // 通过弹窗文案提示
      status: [], // 表格筛选项
      repeatSub: true, // 是否可以提交
      batchSub: true, // 批量重复提交
      batchForm: { // 批量表单
        selectId: '', // 批量选择搜索项
        batchLabelName: '', // 批量选择的标签ID
        tagList: '' // 查询的ID组合值
      },
      appealStatusList: [], // 申诉状态下拉
      appealStatus: '', // 申诉状态
      cityListAppeal: [], // 城市下拉
      batchFormRules: {}, // 批量表单规则
      pickerOptions: {}
    }
  },
  components: {
    SelectTo,
    TableBox,
    TableBoxAppealFixed,
    Modal
  },
  created () {
    if (this.employeeName.role) {
      // 配置筛选项，如果角色是role的话，需要根据post岗位来进行区分
      this.curRole = this.employeeName.role
      // 可以有城市筛选
      if (this.employeeName.role === 'admin' || this.employeeName.role === 'admin-sop' || this.employeeName.role === 'brand_administration' || this.employeeName.role === 'brand_commissioner' || this.employeeName.role === 'brand_manager' || this.employeeName.role === 'service_product') {
        this.cityFlag = true
        let params = {
          city_type: '1'
        }
        this.axios.get('/backend-api/select2/select2/get-city-list-select2', {params: params}).then((res) => {
          if (res.data.code === 0) {
            this.cityListAppeal = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.cityFlag = false
      }
      // 如果是咨询师主管，则不展示咨询师主管的表单选项
      if (this.employeeName.role === 'header_manager') {
        this.headerFlag = false
      } else {
        this.headerFlag = true
      }
      // 批量通过按钮
      if (this.employeeName.role === 'header_manager' || this.employeeName.role === 'brand_administration' || this.employeeName.role === 'brand_commissioner' || this.employeeName.role === 'brand_manager') {
        this.isBatchBtnShow = true
      } else {
        this.isBatchBtnShow = false
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 默认搜索表格
      this.doSearch(this.page)
      this.curRole = this.employeeName.role
      this.getLabel()
      // 获取申诉下拉
      this.getAppealList()
    })
  },
  computed: {
    ...mapState({
      employeeName: state => state.employeeName,
      uid: state => state.uid,
      cityList: state => state.cityList
    })
  },
  methods: {
    // 获取申诉下拉
    getAppealList () {
      this.axios.post('/backend-api/bk-api-tag-manage/get-appeal-status').then((res) => {
        if (res.data.code === 0) {
          this.appealStatusList = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 时间控件获取焦点事件
    timeFocus (para) {
      if (para === 'labelDate') {
        this.labelDate = []
      } else if (para === 'appealDate') {
        this.appealDate = []
      }
    },
    // 判断咨询师还是咨询师主管，咨询师为1，主管为2
    checkRole (para) {
      let result = parseInt(para)
      return result
    },
    // 获取分页点击参数
    pageUpdate (para) {
      this.page = para
      this.doSearch(para)
    },
    // 重置搜索项
    resetSearch () {
      // 重置form表单
      this.labelDate = []
      this.orderId = ''
      this.zxsModel = ''
      this.zxsManaModel = ''
      this.labelSeleId = ''
      this.labelSeleName = ''
      this.appealDate = []
      this.cityId = ''
      this.appealStatus = ''
      // 重新请求
      this.doSearch(1)
    },
    // 点击搜索进行数据筛选
    doSearch (pagePara) {
      // 如果是直接点击搜索按钮，那page一定是1
      if (this.searchType === '1') {
        this.tablePara = {
          tab_datetime_start: this.labelDate ? this.labelDate[0] : '',
          tab_datetime_end: (this.labelDate && Array.isArray(this.labelDate) && this.labelDate.length > 1) ? this.labelDate[1] : '',
          order_id: this.orderId,
          tag_id: this.labelSeleId,
          tag_config_id: this.labelSeleName,
          employee_id: this.zxsModel,
          employee_leader_id: this.zxsManaModel,
          employee_city_id: this.cityId,
          status: this.status,
          create_datetime_start: this.appealDate ? this.appealDate[0] : '',
          create_datetime_end: (this.appealDate && Array.isArray(this.appealDate) && this.appealDate.length > 1) ? this.appealDate[1] : '',
          appeal_status: this.appealStatus,
          page: parseInt(pagePara)
        }
      } else {
        this.tablePara = {
          batch_type: this.batchForm.selectId,
          tag_config_id: this.batchForm.batchLabelName,
          batch_ids: this.batchForm.tagList.replace(/，/ig, ',')
        }
      }
      // 调起表格组件的监听事件
      this.checkInit = false
      this.axios.post('/backend-api/bk-api-tag-manage/appeal-list', this.tablePara).then((res) => {
        if (res.data.code === 0) {
          if (this.searchType === '1') {
            this.dataSum = parseInt(res.data.data.count)
            this.tableLabel = res.data.data.title
            this.tableFilterFlag = true
          } else {
            this.checkInit = true
            let titleList = res.data.data.title
            titleList.splice(titleList.length - 1, 1)
            this.tableLabel = titleList
            this.hasCheckBox = true
            this.tableFilterFlag = false
          }
          this.tableList = res.data.data.list
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 驳回成功后刷新表格
    resDetaildata () {
      this.doSearch(this.page)
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
        this.tableFilterFlag = true
        // 请求正常表格
        this.doSearch(1)
      }
    },
    // 批量操作选择标签ID
    labelChange (para) {
      // 选中标签ID
      if (para === 'tag') {
        this.isTag = true
      } else {
        this.isTag = false
        this.batchForm.batchLabelName = ''
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
          this.doSearch(1)
        } else {
          return false
        }
      })
    },
    // 表格内操作
    operateBtn (para) {
      switch (para.operateId.toString()) {
        case 'view': {
          let routeData = this.$router.resolve({path: '/sopDetail', query: {appeal_id: para.appealId}})
          window.open(routeData.href, '_blank')
        }
          break
        case 'pass': this.passAlone(para.appealId)
          break
        case 'fail': this.failBtn(para.appealId)
          break
      }
    },
    // 驳回按钮
    failBtn (para) {
      this.appeal_id = para
      let params = {
        appeal_id: para
      }
      this.axios.post('/backend-api/bk-api-tag-manage/reject-pop', params).then((res) => {
        if (res.data.code === 0) {
          this.failObj = res.data.data
          this.$refs.Modalchild.openModal()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击表格通过按钮
    passAlone (para) {
      if (this.repeatSub) {
        let params = {
          appeal_id: para,
          auditor: this.uid
        }
        this.repeatSub = false
        this.axios.post('/backend-api/bk-api-tag-manage/exam-passed', params).then((res) => {
          if (res.data.code === 0) {
            this.doSearch(this.page)
            this.repeatSub = true
          }
        }).catch((err) => {
          this.repeatSub = true
          console.log(err)
        })
      }
    },
    // 筛选表格监听
    tableFilter (para) {
      this.status = para.join(',')
      this.doSearch(this.page)
    },
    // 通过弹窗的确认按钮
    passBtn () {
      if (this.appealId.length > 0) {
        if (this.batchSub) {
          this.batchSub = false
          // 进行请求
          let params = {
            appeal_id: this.appealId.length > 0 ? this.appealId.join(',') : '',
            auditor: this.uid
          }
          this.axios.post('/backend-api/bk-api-tag-manage/exam-passed', params).then((res) => {
            if (res.data.code === 0) {
              // 关闭弹窗
              this.passDialog = false
              this.doSearch(1)
              alert('操作成功')
              this.batchSub = true
            }
          }).catch((err) => {
            this.batchSub = true
            console.log(err)
          })
        }
      } else {
        this.passDialog = false
      }
    },
    // 选择项发生变化
    checkedList (para) {
      // 先清空选中项
      this.appealId = []
      if (this.searchType !== '1') {
        this.batchPassNum.waitNum = 0
        this.batchPassNum.allNum = para.length
        para.forEach(row => {
          // 如果状态是申诉中（包括审核中、审批中、待审核）
          if (this.employeeName.role === 'header_manager') {
            if (row.operation === '1') {
              this.batchPassNum.waitNum++
              // 去重
              if (this.appealId.indexOf(row.id) === -1) {
                this.appealId.push(row.id)
              }
            }
          } else if (this.employeeName.role === 'brand_administration' || this.employeeName.role === 'brand_commissioner' || this.employeeName.role === 'brand_manager') {
            if (row.operation === '3') {
              this.batchPassNum.waitNum++
              // 去重
              if (this.appealId.indexOf(row.id) === -1) {
                this.appealId.push(row.id)
              }
            }
          }
        })
      }
    },
    // 批量通过按钮
    batchPass () {
      let waitFlag
      if (this.employeeName.role === 'header_manager') {
        waitFlag = '审核'
      } else {
        waitFlag = '审批'
      }
      // 动态给弹窗文案赋值
      if (this.batchPassNum.waitNum === this.batchPassNum.allNum) {
        this.tipText = '您是想一键通过这' + this.batchPassNum.allNum + '个标签ID（或申诉ID）的申诉吗？系统会记录您的' + waitFlag + '日志，请谨慎操作。'
      } else if (this.batchPassNum.waitNum < this.batchPassNum.allNum && this.batchPassNum.waitNum === 0) {
        this.tipText = '您一共输入' + this.batchPassNum.allNum + '个标签ID（或申诉ID）；系统未检测到其中需要' + waitFlag + '的订单（标签），无法执行审核通过。'
      } else if (this.batchPassNum.waitNum < this.batchPassNum.allNum && this.batchPassNum.waitNum > 0) {
        this.tipText = '您一共输入' + this.batchPassNum.allNum + '个标签ID（或申诉ID）；系统检测到' + (this.batchPassNum.allNum - this.batchPassNum.waitNum) + '个申诉状态不是‘' + waitFlag + '中’，无法执行' + waitFlag + '通过；您需要对其他订单（标签）进行' + waitFlag + '通过吗？系统会记录您的' + waitFlag + '日志，请谨慎操作。'
      }
      this.passDialog = true
    }
  },
  watch: {
    // 刷新时候重新配置筛选项
    employeeName: {
      deep: true,
      handler: function (val) {
        this.curRole = this.employeeName.role
        // 配置筛选项，如果角色是role的话，brand_commissioner\brand_manager
        if (this.employeeName.role === 'admin' || this.employeeName.role === 'admin-sop' || this.employeeName.role === 'brand_administration' || this.employeeName.role === 'brand_commissioner' || this.employeeName.role === 'brand_manager' || this.employeeName.role === 'service_product') {
          this.cityFlag = true
          let params = {
            city_type: '1'
          }
          this.axios.get('/backend-api/select2/select2/get-city-list-select2', {params: params}).then((res) => {
            if (res.data.code === 0) {
              this.cityListAppeal = res.data.data
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.cityFlag = false
        }
        // 如果是咨询师主管，则不展示咨询师主管的表单选项
        if (this.employeeName.role === 'header_manager') {
          this.headerFlag = false
        } else {
          this.headerFlag = true
        }
        // 批量通过按钮
        if (this.employeeName.role === 'header_manager' || this.employeeName.role === 'brand_administration' || this.employeeName.role === 'brand_commissioner' || this.employeeName.role === 'brand_manager') {
          this.isBatchBtnShow = true
        } else {
          this.isBatchBtnShow = false
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
  .form-table-box .filter-link-more{
    float: right;
    padding: 9px 20px;
    margin-top: 6px;
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
