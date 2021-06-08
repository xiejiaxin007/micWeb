<template>
  <!--1、size等于"medium"  表格大小  默认是small
  2、:isHideHandle等于"true"  表格组件 是否有展开收起 默认false
  3、:paging等于"true"  表格组件 是否有分页  默认false
  分页需要传的参数
  :limit等于"limit"（限制的条数）
  :totalCount等于"totalData" （共多少条数据）
  @pageUpdate等于"pageUpdate"（组件中点击分页时，子组件抛出当前页数，父组件中pageUpdate这个函数的参数就是子组件抛出的 page页数 从而进行请求数据，在给子组件（表格）赋值）
  4、:hasCheckBox等于"true" 表格组件  是否有多选  默认false
  5、fixedCol等于"true" 是否固定最后一列，默认是false，true固定-->
  <div class="table-box table-box-fixed" ref="tableBox">
    <div class="data-stat">
      <el-row>
        <el-col :span="10" v-if="isPage">
          第{{currentStart}}-{{currentEnd}}条，共{{totalCount}}条数据
        </el-col>
        <el-col class="filter-wrapper" :span="14" v-if="tableFilter">
          <div class="table-filter-box">
            <el-checkbox-group v-model="filterCheckList" @change="filterCheck">
              <el-checkbox label="6">只看已通过的数据</el-checkbox>
              <el-checkbox label="4,5">只看已驳回的数据</el-checkbox>
              <el-checkbox label="1,2,3">只看待审核的数据</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-wrap">
      <el-table ref="tableFixedWrap"
        border
        :data="this.tableData"
        :size="size"
        :fixed="fixedCol"
        row-class-name="row"
        cell-class-name="column"
        :highlight-current-row="true"
        :header-cell-style="tableHeaderColor"
        @row-dblclick="rowDbClick"
        @selection-change="checkChange"
      >
        <el-table-column
          v-if="hasCheckBox"
          type="selection"
          align="center"
          class-name="check-column"
          width="55"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableLabel"
          :key="index"
          min-width="150"
          :fixed="isFixed(fixedCol, index, tableLabel, item)"
          :prop="item.prop"
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
            <div v-else-if="item.prop == 'operation' && !isList">
              <div class="btn-operate-box" v-if="auditCheck(scope.row[item.prop])">
                <span class="operate-btn btn-blue" @click="tableOperate('view', scope.row['id'])">查看</span>
                <span class="operate-btn btn-green" @click="tableOperate('pass', scope.row['id'])">通过</span>
                <span class="operate-btn btn-red" @click="tableOperate('fail', scope.row['id'], scope.row)">驳回</span>
              </div>
              <div v-else>
                <span class="operate-btn btn-blue" @click="tableOperate('view', scope.row['id'])">查看</span>
              </div>
            </div>
            <div v-else-if="item.prop == 'operation' && isList">
              <span v-if="checkCancel(scope.row[item.prop])" class="operate-btn btn-blue" @click="cancelLabel(scope.row['tag_id'])">{{checkCancel(scope.row[item.prop])}}</span>
            </div>
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
    <Map v-if="this.showMap" @closeDialog="closeDialog" :project_id="it.project_id"
         :project_name="it.project_name"></Map>
  </div>
</template>
<script>
import Map from './Map.vue'
import Modal from './Modal.vue'
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
    // 是否固定最后一列
    fixedCol: {
      default: false
    },
    // 表格筛选项
    tableFilter: {
      default: false
    },
    // 删除最后一列
    isOperate: {
      default: true
    },
    // 角色
    role: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 操作人
    uid: {
      default: ''
    },
    // 是否是列表页，最后固定那一列展示方式不同
    isList: {
      type: Boolean,
      default: false
    },
    // 是否全选
    checkInit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // page
      pageSize: '',
      currentPage: 1,
      leftPage: '',
      currentStart: '',
      currentEnd: '',
      pageNum: '',
      isOpen: false,
      isPage: '',
      totalSum: '', // 总条数
      isHander: false, // 是否显示展开收起
      tableDataCon: [], // 表格数据
      tableLabelCon: [], // 表头数据
      showMap: false, // 展示地图弹窗
      it: {}, // 经纬度数据
      mostWidth: 1260,
      checkList: [], // 表格多选项
      appealId: '', // 当前要申诉的ID
      filterCheckList: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initItem()
      this.getTableData()
      this.initialize()
      // this.initCheckbox()
      this.calculateTb()
    })
  },
  // 解决更新组件数据后设置 状态问题
  updated () {
    this.$nextTick(() => {
      this.getTableData()
      this.initialize()
      this.calculateTb()
      this.isHander = this.isHideHandle
    })
  },
  methods: {
    // 动态计算表格宽度
    calculateTb () {
      let box = document.getElementsByClassName('table-wrap')[0]
      box.style.width = this.$refs.tableBox.clientWidth + 'px'
      this.mostWidth = this.$refs.tableFixedWrap.$el.clientWidth / 150
    },
    // 双击表格
    rowDbClick (row) {
      this.$refs.tableFixedWrap.toggleRowSelection(row)
    },
    // 选中多选框
    checkChange (val) {
      this.checkList = val
      this.$emit('checkedList', val)
    },
    // 关闭申诉弹窗
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
    // 初始化标识
    initItem () {
      this.pageSize = this.limit
      this.isPage = this.paging
      this.totalSum = this.totalCount
      this.isHander = this.isHideHandle
      this.tableDataCon = this.tableData
    },
    // 修改table header的背景色
    tableHeaderColor ({row, column, rowIndex, columnIndex}) {
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
    // 如果是标签列表页
    checkCancel (para) {
      // 如果是sop和服满则不展示取消标签
      if (this.role.role === 'admin-sop' || this.role.role === 'service_product') {
        if (para.toString() === '0') {
          return '取消标签'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    // 固定列转换
    isFixed (para, paraIndex, paraArr, paraItem) {
      let result
      // 如果表格总列数小于一屏最多列数，不用出现固定
      if (paraArr.length > this.mostWidth && paraItem.prop === 'operation') {
        if (para) {
          if (paraIndex < (paraArr.length - 1)) {
            result = false
          } else if (paraIndex === (paraArr.length - 1)) {
            // 如果是最后一列，固定
            result = 'right'
          }
        } else {
          result = false
        }
      } else {
        result = false
      }
      return result
    },
    // 操作按钮
    auditCheck (para) {
      let result
      if (this.role.role) {
        // 咨询师主管有通过驳回按钮
        if (this.role.role === 'header_manager' && para === '1') {
          result = true
        } else if ((this.role.role === 'brand_commissioner' && para === '3') || (this.role.role === 'brand_administration' && para === '3') || (this.role.role === 'brand_manager' && para === '3')) {
          result = true
        } else {
          result = false
        }
      }
      return result
    },
    // 点击操作按钮
    tableOperate (para, paraId, paraItem) {
      this.appealId = paraId
      // 将表格操作暴露在表格外
      this.$emit('operateBtn', {appealId: this.appealId, operateId: para, item: paraItem})
    },
    // 点击单独取消
    cancelLabel (para) {
      // 将表格操作暴露在表格外
      this.$emit('cancelLabel', para)
    },
    // 表格外筛选
    filterCheck (para) {
      this.$emit('tableFilterList', para)
    }
  },
  components: {Map, Modal},
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
    // 监听分页
    paging: {
      deep: true,
      handler: function (val) {
        this.isPage = this.paging
      }
    },
    // 监听全部选中
    checkInit: {
      deep: true,
      handler: function (val) {
        if (this.checkInit) {
          setTimeout(() => {
            this.tableData.forEach(row => {
              this.$refs.tableFixedWrap.toggleRowSelection(row)
              // 是否是要调用全选暴露出去的方法
              // this.$emit('checkedList', this.tableData)
            })
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .table-box input{
    -webkit-appearance: checkbox;
  }
  .table-wrap >>> .el-table thead,.table-wrap > .tab-last-tr{
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
    overflow: hidden;
    padding: 10px 0 20px;
    font-size: 14px;
  }
  .house-item {
    color: #2e9ae1;
    cursor: pointer;
  }
  .filter-wrapper{
    float: right;
    text-align: right;
  }
  .btn-operate-box{
    font-size: 0;
  }
  .operate-btn{
    position: relative;
    padding: 0 10px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
  }
  .operate-btn:first-of-type:before{
    display: none;
  }
  .operate-btn:before{
    content: '|';
    position: absolute;
    top: 0;
    left: -2px;
    margin-top: -5px;
    color: #aaa;
  }
  .btn-blue{
    color: #2e9ae1;
  }
  .btn-red{
    color: #ff0000;
  }
  .btn-green{
    color: #009900;
  }
  .table-box-fixed .table-wrap {
    width: 1260px;
    margin: 0 auto;
    border-right: 1px solid #eBeef5;
  }
  .table-box-fixed .table-wrap >>> .el-table {
    width: 100%;
    overflow-x: auto;
  }
  /* 2019-8-26 */
  .table-box-fixed  .table-wrap >>> .el-table td.check-column, .table-box-fixed >>> .el-table tr th.check-column {
    min-width: 50px ;
  }
  .table-box-fixed  .table-wrap >>> .el-table td, .table-box-fixed >>> .el-table th {
    min-width: 150px !important;
  }
  .table-box-fixed  .table-wrap >>> .el-table td div{
    word-break: break-word;
  }
  .table-box-fixed .table-wrap >>> .el-table--border::after, .table-box-fixed >>> .el-table--group::after {
    width: 0;
    height: 0
  }

  .table-box-fixed .table-wrap >>> .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: initial;
  }

  .table-box-fixed .table-wrap >>> .el-table__header-wrapper th {
    text-align: center;
  }
</style>
