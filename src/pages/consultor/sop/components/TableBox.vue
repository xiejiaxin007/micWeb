<template>
  <!--1、size等于"medium"  表格大小  默认是small
  2、:isHideHandle等于"true"  表格组件 是否有展开收起 默认false
  3、:paging等于"true"  表格组件 是否有分页  默认false
  分页需要传的参数
  :limit等于"limit"（限制的条数）
  :totalCount等于"totalData" （共多少条数据）
  @pageUpdate等于"pageUpdate"（组件中点击分页时，子组件抛出当前页数，父组件中pageUpdate这个函数的参数就是子组件抛出的 page页数 从而进行请求数据，在给子组件（表格）赋值）
  4、:hasCheckBox等于"true" 表格组件  是否有多选  默认false-->
  <div class="table-box no-fixed">
    <div class="data-stat" v-if="isPage">
      <el-row>
        <el-col :span="24">
          第{{currentStart}}-{{currentEnd}}条，共{{totalCount}}条数据
        </el-col>
      </el-row>
    </div>
    <div class="check-all" v-if="hasCheckBox">
      <label >
        <input type="checkbox" ref="flagCheck" @click="checkAll($event)">
        全选
      </label>
    </div>
    <div class="table-wrap ">
      <el-table
        border
        :data="this.tableData"
        :size="size"
        row-class-name="row"
        cell-class-name="column"
        :highlight-current-row="true"
        :header-cell-style="tableHeaderColor"
      >
        <el-table-column
          v-for="(item, index) in tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.name">
          <template slot-scope="scope">
              <span v-if="hasCheckBox">
                <input type="checkbox" @click="examineCheck($event)" v-if="item.isCheck">
              </span>
            <a class="skip" :href="scope.row[item.prop].url"  target="_blank"  v-if="item.is_url == 1 && is_obj(scope.row[item.prop]) && item.is_track == 1" @click="addPoint(scope.row[item.prop].track_id)">{{scope.row[item.prop].val}}</a>
            <a class="skip" :href="scope.row[item.prop].url"  target="_blank"  v-else-if="item.is_url == 1 && is_obj(scope.row[item.prop])">{{scope.row[item.prop].val}}</a>
            <span v-else-if="item.prop == 'left' && item.is_url == 0">{{scope.row[item.prop].val}}</span>
            <span v-else-if="item.prop == 'project'">
              <span @click="changeState(item)" v-for="(item, index) in scope.row[item.prop]" class="house-item" :key="index">
                {{item.project_name}}
              </span>
            </span>
            <span v-else-if="item.prop == 'appeal'">
              <span class='no-arrow' v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && scope.row[item.prop] === null && scope.row.operation.toString() === '0'  && roleObj.role === 'header'" :class="changeFontColor(scope.row[item.prop])">未申诉</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && scope.row[item.prop] === null && scope.row.operation.toString() === '1'  && roleObj.role === 'header'" :class="changeFontColor(scope.row[item.prop])" @click="popDialog(scope.row, scope.row['tag_id'], '', scope.row.tag_config_id)">申诉</span>
              <span
                v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '4' : false) && scope.row.operation.toString() === '0'" 
                :class="changeFontColor(scope.row[item.prop])"
                @click="turnPage(scope.row['appeal_id'])">
                    主管驳回
              </span>
              <span
                v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '4' : false) && scope.row.operation.toString() === '1'"
                :class="changeFontColor(scope.row[item.prop])"
                @click="popDialog(scope.row, scope.row['tag_id'], 'header', scope.row.tag_config_id)">
                主管驳回
              </span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '3' : false)" :class="changeFontColor(scope.row[item.prop])" @click="turnPage(scope.row['appeal_id'])">审批中</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '1' : false)" :class="changeFontColor(scope.row[item.prop])" @click="turnPage(scope.row['appeal_id'])">审核中</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '6' : false)" :class="changeFontColor(scope.row[item.prop])" @click="turnPage(scope.row['appeal_id'])">已通过</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '5' : false)" :class="changeFontColor(scope.row[item.prop])" @click="turnPage(scope.row['appeal_id'])">已驳回</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '2' : false)" :class="changeFontColor(scope.row[item.prop])" @click="turnPage(scope.row['appeal_id'])">待审批</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '7' : false)" :class="changeFontColor(scope.row[item.prop])" @click="turnPage(scope.row['appeal_id'])">已失效</span>
              <span v-if="tagConfig.model_value!='YwOrderBusinessTags_400' && (scope.row[item.prop] ? scope.row[item.prop].toString() === '0' : false)"></span>
              <!--首电质检不合格标签单独处理-->
              <span v-if="tagConfig.model_value=='YwOrderBusinessTags_400'" :class="changeFontColor('check')" @click="turnDetail(scope.row)">查看</span>
            </span>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="tab-last-tr" v-if="this.isHander && this.tableData.length > 2">
        <div class="edit"  @click="hideTable($event)" v-if="isOpen"><span class="text">收起</span><span class="iconfont icontop-triangle"></span></div>
        <div class="edit" @click="controlTable($event)" v-else><span class="text">展开</span><span class="iconfont icon-xialajiantou"></span></div>
      </div>
    </div>
    <div class="pagination" v-if="isPage">
      <el-pagination
        v-if="isPage"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="pageChange"
        :total="totalSum">
      </el-pagination>
    </div>
    <appeal-dialog v-if="appealShow" :manaReason="reason" :uid="uid" :tagId="tagId" :configId="tagConfigIdOne" :tbItem="tbItem" @closeAppeal="closeAppeal"></appeal-dialog>
    <Map v-if="this.showMap" @closeDialog="closeDialog" :project_id="it.project_id" :project_name="it.project_name"></Map>
  </div>
</template>
<script>
import Map from './Map.vue'
import AppealDialog from './AppealDialog'
import { mapState } from 'vuex'
export default {
  props: {
    // 表格信息
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表头信息
    tableLabel: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 尺寸 small/medium
    size: {
      default: 'small'
    },
    // 是否展示分页
    paging: {
      type: Boolean,
      default: false
    },
    // 参数  默认返回分页和条数
    limit: {
      type: Number,
      default: 10
    },
    // 表格总数据的条数
    totalCount: {
      type: Number
    },
    // 是否有展开收起操作 默认不展示
    isHideHandle: {
      type: Boolean,
      default: false
    },
    // 是多选表格
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    // 标签配置ID
    tagConfigId: {
      default: 0
    },
    uid: {
      default: ''
    },
    tagConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      tagConfigIdOne: 0,
      reason: '',
      tagId: 0, // 标签ID
      appealShow: false,
      // page
      pageSize: '',
      currentPage: 1,
      leftPage: '',
      currentStart: '',
      currentEnd: '',
      pageNum: '',
      isOpen: false,
      tbItem: {}, // 点击表格某一行数据
      isPage: '',
      totalSum: '', // 总条数
      isHander: false, // 是否显示展开收起
      roleObj: {}, // 当前角色
      tableLabelCon: [], // 表头数据
      showMap: false, // 展示地图弹窗
      it: {} // 经纬度数据
    }
  },
  computed: {
    ...mapState({
      employeeName: state => state.employeeName
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.initItem()
      this.getTableData()
      this.initialize()
      this.roleObj = this.employeeName
      this.tagConfigIdOne = this.tagConfigId
    })
  },
  // 解决更新组件数据后设置 状态问题
  updated () {
    this.$nextTick(() => {
      this.getTableData()
      this.initialize()
      this.isHander = this.isHideHandle
    })
  },
  methods: {
    // 首电质检不合格标签单独跳页面
    turnDetail (para) {
      if (this.roleObj.role === 'header_manager') {
        window.open(para.managerUrl)
      } else {
        window.open(para.url)
      }
    },
    // 打开申诉弹窗
    popDialog (para, paraIndex, paraVa, tagConfigId) {
      if (tagConfigId) {
        this.tagConfigIdOne = tagConfigId
      }
      if (paraVa !== '') {
        // 请求接口获取主管驳回一件
        let params = {
          appeal_id: para.appeal_id
        }
        this.axios.post('/backend-api/bk-api-tag-manage/get-reject-reason', params).then((res) => {
          if (res.data.code === 0) {
            this.reason = res.data.data.reason
            this.tagId = paraIndex
            this.tbItem = para
            this.appealShow = true
            if (tagConfigId) {
              this.tagId = paraIndex.split('-')[1]
            }
          }
        }).catch(function (err) {
          console.log(err)
        })
      } else {
        this.tagId = paraIndex
        this.tbItem = para
        this.appealShow = true
        if (tagConfigId) {
          this.tagId = paraIndex.split('-')[1]
        }
      }
    },
    closeAppeal (para) {
      this.appealShow = para.close
      if (para.close === false && para.isUpdate) {
        // 收起表格
        this.isOpen = false
        // 刷新表格
        this.$emit('freshTb')
      }
    },
    closeDialog (val) {
      this.showMap = val
    },
    // 控制地图 弹窗 展示
    changeState (val) {
      this.showMap = true
      this.it = val
      return val
    },
    // 添加埋点
    addPoint (trackId) {
      this.$emit('transPoint', trackId)
    },
    // 跳转到详情页
    turnPage (para) {
      this.$router.push({path: '/sopDetail', query: {appeal_id: para}})
    },
    // 初始化标识
    initItem () {
      this.pageSize = this.limit
      this.isPage = this.paging
      this.totalSum = this.totalCount
      this.isHander = this.isHideHandle
      this.tableLabelCon = this.tableLabel
    },
    // 修改table header的背景色
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #f9f9f9;color: #333;'
      }
    },
    is_obj: function (val) {
      return Object.prototype.toString.call(val) === '[object Object]'
    },
    // 初始化多选框
    initCheckbox () {
      if (this.hasCheckBox) {
        let boxObj = {name: '', prop: 'checkbox', isCheck: true}
        this.tableLabelCon = this.tableLabel
        this.tableLabelCon.unshift(boxObj)
      }
    },
    // 初始化展示两行表格
    initialize () {
      var edits = []
      var elems = []
      if (this.isHideHandle) {
        if (!this.isOpen) {
          edits = document.querySelectorAll('.table-wrap')
          for (var j = 0; j < edits.length; j++) {
            elems = edits[j].querySelectorAll('.row')
            for (var i = 0; i < elems.length; i++) {
              if (i !== 0 && i !== 1) {
                elems[i].style.display = 'none'
              }
            }
          }
        }
      }
    },
    // 收起表格
    hideTable (param) {
      let trs = param.currentTarget.parentElement.previousElementSibling.querySelectorAll('.el-table__row')
      for (let i = 0; i < trs.length; i++) {
        if (i !== 0 && i !== 1) {
          trs[i].style.display = 'none'
        }
      }
      this.isOpen = false
    },
    // 展开表格
    controlTable (param) {
      let trs = param.currentTarget.parentElement.previousElementSibling.querySelectorAll('.el-table__row')
      for (let i = 0; i < trs.length; i++) {
        trs[i].style.display = 'table-row'
      }
      this.isOpen = true
    },
    // 点击 多选框
    checkAll (para) {
      let checkList = para.target.parentElement.parentElement.nextElementSibling.querySelectorAll('.table-wrap input')
      if (this.$refs.flagCheck.checked) {
        for (let i = 0; i < checkList.length; i++) {
          checkList[i].checked = true
        }
      } else {
        for (let i = 0; i < checkList.length; i++) {
          checkList[i].checked = false
        }
      }
    },
    // 点击全选
    examineCheck (para) {
      let checkList = para.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll('input')
      for (var j = 0; j < checkList.length; j++) {
        if (!checkList[j].checked) {
          break
        }
      }
      if (j === checkList.length) {
        this.$refs.flagCheck.checked = true
      } else {
        this.$refs.flagCheck.checked = false
      }
    },
    // 表格翻页
    pageChange (page) {
      this.$emit('pageUpdate', page)
      // 自定义抛出事件给  父组件  父组件中根据页码来请求表格数据  目的：降低耦合度
      this.currentPage = page
      if (this.leftPage === 0) {
        this.currentStart = (this.currentPage - 1) * this.pageSize + 1
        this.currentEnd = this.currentPage * this.pageSize
      } else {
        if (this.currentPage === this.pageNum) {
          // 最后一页
          this.currentStart = (this.currentPage - 1) * this.pageSize + 1
          this.currentEnd = (this.currentStart - 1) + this.leftPage
        } else {
          // 不是最后一页
          this.currentStart = (this.currentPage - 1) * this.pageSize + 1
          this.currentEnd = this.currentPage * this.pageSize
        }
      }
    },
    // 表格数据处理
    getTableData () {
      var _this = this
      if (_this.totalSum !== 0) {
        _this.pageNum = Math.ceil(_this.totalSum / _this.pageSize) // 计算一共多少页
        _this.leftPage = parseInt(_this.totalSum % _this.pageSize) // 计算最后一页剩余多少条数据，可能为0，也可能为其他值
        if (_this.pageNum === 1) {
          // 如果只有一页的数据
          _this.currentStart = 1
          _this.currentEnd = _this.totalSum
        } else {
          if (_this.currentPage === 1) {
            // 多页数据时，第一页显示
            _this.currentStart = 1
            _this.currentEnd = _this.pageSize
          }
        }
      } else {
        _this.totalSum = 0 // 总数据条数为0
        _this.currentStart = 0 // 从第几条开始为0
        _this.currentEnd = 0 // 到第几条为0
        _this.currentPage = 1 // 重置默认值
        _this.isPage = false // 没有数据，隐藏分页
      }
    },
    // 动态修改文案颜色
    changeFontColor (para) {
      let result
      if (para === '4' || para === '5') {
        result = 'pop-dialog-fail'
      } else if (para === '6') {
        result = 'pop-dialog-pass'
      } else if (para === '7') {
        result = 'pop-dialog-unValid'
      } else {
        result = 'pop-dialog-box'
      }
      return result
    }
  },
  components: {Map, AppealDialog},
  watch: {
    // 深度监视 数据总条数
    totalCount: {
      deep: true,
      handler: function (val) {
        this.totalSum = this.totalCount
        this.getTableData()
        this.initItem()
      }
    },
    // 监听当前角色
    employeeName: {
      deep: true,
      handler: function (val) {
        this.roleObj = this.employeeName
      }
    }
  }
}
</script>

<style scoped>
  .table-box input{
    -webkit-appearance: checkbox;
  }
  .table-wrap .el-table thead,.table-wrap>.tab-last-tr{
    background-color: #f9f9f9;
    overflow: hidden;
  }
  .tab-last-tr .edit{
    float: right;
    padding: 10px;
    color: #2e9ae1;
    cursor: pointer;
  }
  .tab-last-tr .edit .iconfont{
    margin-left: 5px;
  }
  .table-wrap .skip{
    text-decoration: none;
    color: #2e9ae1;
  }
  .pagination{
    text-align: center;
    padding: 20px 0;
    background: #fff;
  }
  .data-stat{
    padding: 10px 0;
    font-size: 14px;
  }
  .house-item {
    color: #2e9ae1;
    cursor: pointer;
  }
  .pop-dialog-box{
    cursor: pointer;
    color: #2e9ae1;
  }
  .no-arrow{
    cursor: default;
  }
  .pop-dialog-pass{
    cursor: pointer;
    color: #009900;
  }
  .pop-dialog-unValid{
    cursor: pointer;
    color: #999;
  }
  .pop-dialog-fail{
    cursor: pointer;
    color: #ff0000;
  }
  .table-wrap{
    width: 100%;
  }
  .table-wrap >>> .el-table{
    width: 100%;
    overflow-x: auto;
  }
  .no-fixed .table-wrap >>> .el-table__body-wrapper,.no-fixed .table-wrap >>> .el-table__footer-wrapper, .no-fixed .table-wrap >>> .el-table__header-wrapper{
    overflow: visible;
  }
  /* 2019-8-26 */
  .table-wrap >>> .el-table td, .table-wrap >>> .el-table th{
    min-width: 150px;
  }
  .table-wrap >>> .el-table td div{
    word-break: break-word;
  }
  .table-wrap >>> .el-table--border::after,.table-wrap >>> .el-table--group::after{
    width:0;
    height:0
  }
  .table-wrap >>> .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x: initial;
  }
  .table-wrap >>> .el-table__header-wrapper th{
    text-align: center;
  }
</style>
