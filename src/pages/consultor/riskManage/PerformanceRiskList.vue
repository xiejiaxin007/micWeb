<template>
  <div class="el-row" v-loading.fullscreen.lock="contentLoading">
      <el-col :span="24" class="content-main">
        <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>服务管理员业务管理</el-breadcrumb-item>
          <el-breadcrumb-item>业绩核算风控管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box">
          <div class="hd">
            <h2>业绩核算风控管理</h2>
          </div>
          <div class="bd">
            <div class="order-search">
              <!--查询需求-->
              <ul class="s-query">
                <li>
                  <div class="th">订单ID：</div>
                  <div class="td">
                    <el-input v-model="orderId"></el-input>
                  </div>
                </li>
                <li>
                  <div class="th">业务类型：</div>
                  <div class="td">
                    <el-select v-model="businessType">
                      <el-option
                        v-for="item in businessTypeList"
                        :key="'businessType-' + item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div class="th">业务ID：</div>
                  <div class="td">
                    <el-input v-model="businessId"></el-input>
                  </div>
                </li>
                <li>
                  <div class="th">订单所属咨询师：</div>
                  <div class="td">
                    <el-select v-model="orderEmployeeId" filterable>
                      <el-option
                        v-for="item in allEmployeeList"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div class="th">修改人：</div>
                  <div class="td">
                    <el-select v-model="creator" filterable>
                      <el-option
                        v-for="item in allEmployeeList"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div class="th">咨询师主管：</div>
                  <div class="td">
                    <el-select v-model="orderLeaderId" filterable>
                      <el-option
                        v-for="item in employeeLeaderList"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div class="th">业务发生时间：</div>
                  <div class="td">
                    <el-date-picker v-model="businessTypeOccur"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    prefix-icon="date-tip-logo"
                                    :picker-options="occurOptions">
                    </el-date-picker>
                  </div>
                </li>
                <li>
                  <div class="th">业务修改时间：</div>
                  <div class="td">
                    <el-date-picker v-model="businessTypeUpdate"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    prefix-icon="date-tip-logo"
                                    :picker-options="updateOptions">
                    </el-date-picker>
                  </div>
                </li>
                <li class="auto margin-scale" v-if="auditStatusList ? auditStatusList.length > 0 : false">
                    <div class="th">审核状态：</div>
                    <div class="td">
                      <el-checkbox-group v-model="auditStatus">
                        <el-checkbox v-for="(audit, index) in auditStatusList" :key="'audit-' + index" :label="audit.value">{{audit.name}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                </li>
                <li class="auto margin-scale">
                    <div class="th">修改内容：</div>
                    <div class="td">
                      <el-checkbox-group v-model="updateContent">
                        <el-checkbox label="1">带看人</el-checkbox>
                        <el-checkbox label="2">邀约人</el-checkbox>
                        <el-checkbox label="3">签约服务人</el-checkbox>
                      </el-checkbox-group>
                    </div>
                </li>
                <li class="auto margin-scale" v-if="warnLevelList ? warnLevelList.length > 0 : false">
                    <div class="th">处理结果：</div>
                    <div class="td">
                      <el-checkbox-group v-model="warnLevel">
                        <el-checkbox v-for="(result, index) in warnLevelList" :key="'result-' + index" :label="result.value">{{result.name}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                </li>
                <li class="auto margin-scale" v-if="causeTypeList ? causeTypeList.length > 0 : false">
                    <div class="th">嫌疑原因：</div>
                    <div class="td">
                      <el-checkbox-group v-model="causeType">
                        <el-checkbox v-for="(cause, index) in causeTypeList" :key="'cause-' + index" :label="cause.value">{{cause.name}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                </li>
              </ul>
            </div>
            <div class="btn-area">
              <el-button @click="resetSearch">重置</el-button>
              <el-button type="primary" @click="tableSearch(1)">搜索</el-button>
            </div>
          </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
          <div class="bd">
            <div class="search-result">
              <jl-fixed-ordinary-table :tableData="tableList"
                         :paging="true"
                         :limit="limit"
                         :totalCount="dataSum"
                         :tableLabel="tableLabel"
                         @pageUpdate="pageUpdate"
                         :fixedCol="true"
              ></jl-fixed-ordinary-table>
            </div>
          </div>
        </div>
      </el-col>
    </div>
</template>

<script>
import performanceApi from './api/riskManageApi'
import { getEmployee } from '@/api/commonApi'
import { commonFun } from '@/assets/js/utils/utils'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  name: 'PerformanceRiskList',
  data () {
    return {
      orderId: '', // 订单ID
      businessType: '', // 业务类型
      businessTypeList: [], // 业务类型下拉
      businessId: '', // 业务ID
      orderEmployeeId: '', // 所属咨询师
      creator: '', // 修改人
      orderLeaderId: '', // 咨询师主管
      employeeLeaderList: [], // 咨询师主管下拉
      allEmployeeList: [], // 所有咨询师
      updateContent: [], // 修改内容选中
      warnLevel: [], // 处理结果绑定
      warnLevelList: [], // 处理结果下拉
      auditStatus: [], // 审核状态选中
      auditStatusList: [], // 审核状态下拉
      causeType: [], // 嫌疑原因绑定
      causeTypeList: [], // 嫌疑原因下拉
      businessTypeOccur: [], // 业务发生时间绑定
      occurOptions: {}, // 发生时间参数
      businessTypeUpdate: [], // 业务修改时间绑定
      updateOptions: {}, // 修改时间参数
      tableList: [], // 表格数据
      dataSum: 0, // 一共多少条数据
      limit: 20, // 表格每页多少条数据
      tableLabel: [], // 表头数据
      contentLoading: true, // 页面加载loading
      page: 1, // 当前第几页
      ownZxs: '' // 订单所属咨询师
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 业务修改时间设置默认值为最近两个月
      const end = moment().format('YYYY-MM-DD')
      const start = moment().subtract(2, 'months').format('YYYY-MM-DD')
      this.businessTypeUpdate = [start, end]
      // 获取咨询师下拉
      this.getEmployeeList()
      // 获取下拉项
      this.getSearchForm()
      // 表格数据初始化
      this.tableSearch(this.page).then(() => {
        // 关闭表格loading
        this.contentLoading = false
      }).catch((error) => {
        // 关闭表格loading
        this.contentLoading = false
        console.log(error)
      })
    })
  },
  methods: {
    // 获取分页点击参数
    pageUpdate (para) {
      this.page = para
      this.tableSearch(this.page)
    },
    // 获取下拉项
    async getSearchForm () {
      try {
        let result = await performanceApi.getRiskInitialize()
        let {data} = result
        // 业务类型下拉
        if (data.code === 0) {
          this.businessTypeList = data.data ? data.data.business_type : []
          this.auditStatusList = data.data ? data.data.audit_status : []
          this.warnLevelList = data.data ? data.data.warn_level : []
          this.causeTypeList = data.data ? data.data.cause_type : []
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取表格数据
    async tableSearch (paraPage) {
      let params = {
        order_id: this.orderId,
        business_type: this.businessType,
        business_id: this.businessId,
        order_employee_id: this.orderEmployeeId,
        creator: this.creator,
        order_leader_id: this.orderLeaderId,
        business_datetime_min: this.businessTypeOccur ? this.businessTypeOccur[0] : '',
        business_datetime_max: this.businessTypeOccur ? this.businessTypeOccur[1] : '',
        create_datetime_min: this.businessTypeUpdate ? this.businessTypeUpdate[0] : '',
        create_datetime_max: this.businessTypeUpdate ? this.businessTypeUpdate[1] : '',
        audit_status: this.auditStatus,
        risk_type: this.updateContent,
        warn_level: this.warnLevel,
        cause_type: this.causeType,
        page: paraPage
      }
      // 给表格组件赋值
      try {
        let result = await performanceApi.getPerformanceManageList(params)
        let {data} = result
        if (data.code === 0) {
          this.tableList = data.data ? data.data.list : []
          this.tableLabel = data.data ? data.data.fields : []
          this.limit = data.data ? data.data.pageSize : 20
          this.dataSum = commonFun.matchFigure(data.data ? data.data.total : 0) ? parseInt(data.data.total) : 0
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 置空事件
    resetSearch () {
      this.orderId = ''
      this.businessType = ''
      this.businessId = ''
      this.orderEmployeeId = ''
      this.creator = ''
      this.orderLeaderId = ''
      this.businessTypeOccur = []
      this.businessTypeUpdate = []
      this.auditStatus = []
      this.updateContent = []
      this.warnLevel = []
      this.causeType = []
      this.page = 1
      this.tableSearch(this.page)
    },
    // 获取对应咨询师下拉
    async getEmployeeList () {
      let params = {
        q: ''
      }
      if (this.role == 'header_manager') {
        params.header_manager_id = this.uid
      } else {
        params.role = 'all'
      }
      let param = {
        q: '',
        role: 'header_manager'
      }
      if (this.role == 'header_manager') {
        param.header_manager_id = this.uid
      }
      try {
        // 非关联请求，不需要等待一个一个请求
        let allRel = getEmployee(params)
        let leaderRel = getEmployee(param)
        let result = await allRel
        let {data} = result
        let results = await leaderRel
        // 给所有咨询师下拉赋值
        if (data.code === 0) {
          this.allEmployeeList = data.data
        }
        // 给咨询师主管下拉赋值
        if (results.data.code === 0) {
          this.employeeLeaderList = results.data ? results.data.data : []
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    ...mapState({
      uid: state => state.uid,
      // 权限： 咨询师主管 需要传咨询师主管id
      role: state => state.role
    })
  },
  watch: {
    // 监听vuex中的权限数有值时
    role: {
      handler: function (val, oldval) {
        // 获取咨询师下拉
        this.getEmployeeList()
      },
      deep: true
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
  .form-table-box .order-search > .s-query > li .td{
    min-height: 40px;
  }
  .order-search{
    overflow: hidden;
  }
  .order-search >>> .el-date-editor, .order-search >>> .el-select{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
  }
  .order-search >>> .el-select .el-input{
    height: 40px;
  }
   .order-search >>> .el-select .el-input__inner{
     height: 40px!important;
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
  .order-search >>> .el-checkbox{
    font-weight: normal;
  }
  .order-search .s-query > li.margin-scale{
    margin-bottom: 0;
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
