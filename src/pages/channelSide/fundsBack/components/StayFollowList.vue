<!--
 * @Name: 回款跟进tab组件
 * @Description: 待跟进列表tab展示
 * @Author: xiejiaxin
 * @Date: 2020-04-22
 -->
<template>
    <div class="follow-list-wrapper">
        <div class="form-wrapper">
            <div class="order-search">
                <!--查询需求-->
                <ul class="s-query">
                    <li>
                        <div class="th">地理城市：</div>
                        <div class="td">
                            <el-select
                                v-model="cityId"
                                filterable
                                placeholder="请选择">
                                <el-option
                                    v-for="item in cityList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">成交ID：</div>
                        <div class="td">
                            <el-input
                                v-model="dealId"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">楼盘名称：</div>
                        <div class="td">
                            <search-select-radio
                                v-model="houseId"
                                placeholder="请选择"
                                :apiInfo="houseApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">客户姓名：</div>
                        <div class="td">
                            <el-input
                                v-model="customerName"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">成交单进度：</div>
                        <div class="td">
                            <el-select
                                v-model="currentProcess"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in processList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">合作方式：</div>
                        <div class="td">
                            <el-select
                                v-model="operateType"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in operateTypeList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款类型：</div>
                        <div class="td">
                            <el-select
                                v-model="fundsType"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in fundsTypeList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款负责人：</div>
                        <div class="td">
                            <search-select-radio
                                v-model="principalID"
                                placeholder="请选择"
                                :apiInfo="principalApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款流程ID：</div>
                        <div class="td">
                            <el-input
                                v-model="processId"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">认购时间：</div>
                        <div class="td">
                            <el-date-picker
                                v-model="buyDate"
                                type="daterange"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">网签时间：</div>
                        <div class="td">
                            <el-date-picker
                                v-model="signDate"
                                type="daterange"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">完成回款：</div>
                        <div class="td">
                            <el-select
                                v-model="isCompleteFunds"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in isCompleteList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area">
                <el-button @click="resetSearch">重置</el-button>
                <el-button
                    type="primary"
                    @click="doSearch(1)">搜索</el-button>
            </div>
        </div>
        <div class="v-box form-table-box">
            <div class="table-operate-box">
                <div class="opreate-box">
                    <div
                        @click="clickTip"
                        class="opreate-tip">哪些成交单会转移到跟进列表？</div>
                    <el-button
                        @click="markConfirm"
                        type="primary">手动标记开始确认业绩流程</el-button>
                </div>
            </div>
            <div class="bd">
                <div class="search-result">
                    <div class="table-wrap-new">
                        <el-table
                            ref="followTable"
                            v-loading="tbLoading"
                            border
                            :data="tableList"
                            @selection-change="selectChange"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor">
                             <el-table-column
                                fixed="left"
                                type="selection"
                                align="center"
                                width="70">
                            </el-table-column>>
                            <el-table-column
                                prop="city_name"
                                label="地理城市"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                label="成交ID"
                                align="center">
                                <template slot-scope="scope">
                                    <div
                                        @click="turnToNewPage(scope.row.deal_url)"
                                        class="turn-to-page">{{scope.row.deal_id}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="project_name"
                                label="楼盘名称"
                                class-name="more-info-td"
                                width="110px"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                label="客户姓名"
                                prop="username"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="deal_step"
                                label="成交单进度"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="cooperate_type"
                                label="合作方式"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                label="回款类型"
                                prop="commission_type"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="pre_paid_money"
                                label="单笔合同预测"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                label="单笔剩余回款金额"
                                prop="unverified_money"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="contract_content"
                                label="单笔合同预测子条件"
                                class-name="more-info-long-th"
                                width="120px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.contract_content">
                                        <div slot="reference">{{scope.row.contract_content}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="回款负责人"
                                prop="payback_employee"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="cw_supplier"
                                label="合作方主体"
                                class-name="more-info-td"
                                width="110px"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                label="回款流程ID"
                                prop="ex_money_back_config_id"
                                align="center">
                                <template slot-scope="scope">
                                    <div
                                        @click="turnToPage(scope.row, 'configDetail')"
                                        class="turn-to-page">{{scope.row.ex_money_back_config_id}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                class-name="more-info-td"
                                width="110px"
                                fixed="right"
                                align="center">
                                <template slot-scope="scope">
                                    <div
                                        @click="turnToPage(scope.row, 'detail')"
                                        class="turn-to-page">回款详情</div>
                                    <div
                                        @click="turnToNewPage(scope.row.voucher_url)"
                                        class="turn-to-page">查看回款凭证</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :hide-on-single-page="totalNum <= 0"
                                :page-count="totalPage">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 描述弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="infoShow"
            class="info-dialog"
            width="520px"
            center>
            <div class="dialog-tip">
                <p class="tip-tit">当成交单的单笔合同预测回款满足以下任一条件，会转移到跟进列表</p>
                <p class="tip-info first-info">1. 达成单笔合同预测回款子条件</p>
                <p class="tip-info">2. 客户达成网签，网签时间且超过30天</p>
                <p class="tip-info">3. 手动标记开始业绩确认的流程</p>
                <div class="dialog-warn-tip">
                    <p>注意：进入跟进列表后</p>
                    <p>「1-确认业绩」需在30天内完成，「2-7」阶段需以日维度跟进录入系统~</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from '../api/followApi.js';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
import config from '@/config/config'
export default {
    name: 'stay-follow-list',
    data() {
        return {
            // 是否完成回款
            isCompleteFunds: '2',
            // 是否回款下拉
            isCompleteList: config.commonList,
            // 认购时间
            buyDate: [],
            // 网签时间
            signDate: [],
            // 地理城市ID
            cityId: '',
            // 地理城市下拉
            cityList: [],
            // 回款类型
            fundsType: '',
            // 回款类型下拉
            fundsTypeList: [],
            // 合作方式
            operateType: '',
            // 合作方式下拉
            operateTypeList: [],
            // 楼盘ID
            houseId: '',
            // 成交单ID
            dealId: '',
            // 客户姓名
            customerName: '',
            // 回款负责人
            principalID: '',
            // 回款流程ID
            processId: '',
            // 表格数据
            tableList: [],
            // 当前阶段
            currentProcess: '',
            // 阶段下拉
            processList: [],
            // 楼盘下拉api
            houseApi: {
                api: commonApi.getHouseList,
                params: {
                    q: ''
                }
            },
            // 回款负责人下拉
            principalApi: {
                api: commonApi.getStaff,
                params: {
                    q: ''
                }
            },
            // 表格总数
            totalNum: 0,
            // 页码
            currentPage: 1,
            // 每页显示数据
            pageSize: 20,
            // 成交单条数
            dealNum: 0,
            // 合同预测条数
            contractNum: 0,
            // 总页数
            totalPage: 0,
            // 当前页数
            page: 1,
            // 表格loading
            tbLoading: false,
            // 描述弹窗开关
            infoShow: false,
            // 选中的成交单
            dealList: [],
            // 是否正在提交标志
            isSumbit: false
        }
    },
    created() {
        // 获取初始化下拉
        this.initFormData();
        // 获取城市下拉
        this.getCity();
        // 获取表格数据
        this.doSearch(this.page);
    },
    components: {
        SearchSelectRadio
    },
    methods: {
        /**
         * @description: 点击表格跳转
         * @param {Object} val 点击行对象
         * @param {String} type 跳转类型 detail--查看回款详情，configDetail--回款流程配置查看页面
         */
        turnToPage(val, type) {
            let newOpen;
            if (type === 'configDetail') {
                // 查看流程配置页面
                let routeData = this.$router.resolve({
                    path: '/fundsBack/fundsConfigInfo',
                    query: {
                        id: val.ex_money_back_config_id
                    }
                });
                newOpen = window.open(routeData.href);
            } else if (type === 'detail') {
                newOpen = window.open(val.detail_url);
            }
            if(newOpen) {
                newOpen.opener = null;
            }
        },
        /**
         * @description: 点击表格跳转
         * @param {String} url 跳转链接
         */
        turnToNewPage(url) {
            let newOpen = window.open(url);
            newOpen.opener = null;
        },
        /**
         * @description: 切换表格选中
         * @param {Array} val 选中的行
         */
        selectChange(val) {
            this.dealList = val;
        },
        // 前端检查是否可以手动标记
        checkMark() {
            let rel;
            // 检查回款流程ID是否一致
            let compareDeal = this.dealList[0].ex_money_back_config_id;
            let isHas = this.dealList.some((item) => {
                return item.ex_money_back_config_id !== compareDeal;
            });
            if (isHas) {
                this.$message({
                    message: '请选择回款流程ID一致的成交单，进行手动标记开始「1-确认业绩」阶段',
                    type: 'warning'
                });
                rel = false;
            } else {
                rel = true;
            }
            return rel;
        },
        // 手动标记
        async markConfirm() {
            // 判断是否正在提交中
            if (!this.isSumbit) {
                this.isSumbit = true;
                if (this.dealList.length > 0) {
                    if (!this.checkMark()) {
                        this.isSumbit = false;
                        return;
                    }
                    try {
                        // 组合合同预测ID数组
                        let ids = [];
                        this.dealList.map((item) => {
                            ids.push(item.forecast_id);
                        });
                        let params = {
                            forecast_id: ids.join(',')
                        };
                        let result = await api.markConfrim(params);
                        let {data, code, msg} = result.data;
                        if (code === 0) {
                            this.$refs.followTable.clearSelection();
                            // 刷新表格数据
                            this.doSearch(this.page);
                            // 跳转到业绩确认页面
                            let routeData = this.$router.resolve({
                                path: '/fundsBack/editFollowUp',
                                query: {
                                    groupId: data.group_id,
                                    commissionType: data.is_front
                                }
                            });
                            let newOpen = window.open(routeData.href, "_blank");
                            newOpen.opener = null;
                        } else {
                            this.$message({
                                message: msg,
                                type: 'warning'
                            });
                        }
                        this.isSumbit = false;
                    } catch (error) {
                        this.isSumbit = false;
                        console.log(error);
                    }
                } else {
                    this.isSumbit = false;
                    this.$message({
                        message: '请选择成交单',
                        type: 'warning'
                    });
                }
            }
        },
        // 点击描述，弹出弹窗
        clickTip() {
            this.infoShow = true;
        },
        // 重置
        resetSearch() {
            this.cityId = '';
            this.dealId = '';
            this.houseId = '';
            this.customerName = '';
            this.currentProcess = '';
            this.operateType = '';
            this.fundsType = '';
            this.principalID = '';
            this.processId = '';
            this.buyDate = [];
            this.signDate = [];
            this.isCompleteFunds = '2';
            this.page = 1;
            // 重新搜索
            this.doSearch(this.page);
        },
        /**
         * @description: 获取表格数据
         * @param {string} page 页码
         */
        async doSearch(page) {
            if (!this.tbLoading) {
                this.tbLoading = true;
                try {
                    let subscribe = {
                        min: this.buyDate ? this.buyDate[0] : '',
                        max: (this.buyDate && Array.isArray(this.buyDate) && this.buyDate.length > 1) ? this.buyDate[1] : ''
                    };
                    let sign = {
                        min: this.signDate ? this.signDate[0] : '',
                        max: (this.signDate && Array.isArray(this.signDate) && this.signDate.length > 1) ? this.signDate[1] : ''
                    }
                    let params = {
                        city_id: this.cityId,
                        deal_id: this.dealId,
                        project_id: this.houseId,
                        user_name: this.customerName,
                        deal_step: this.currentProcess,
                        cooperate_type: this.operateType,
                        commission_type: this.fundsType,
                        payback_employee_id: this.principalID,
                        ex_money_back_config_id: this.processId,
                        subscribe_datetime_min: subscribe.min ? (subscribe.min / 1000) : '',
                        subscribe_datetime_max: subscribe.max ? (subscribe.max / 1000) : '',
                        sign_datetime_min: sign.min ? (sign.min / 1000) : '',
                        sign_datetime_max: sign.max ? (sign.max / 1000) : '',
                        unverified_money: this.isCompleteFunds,
                        page: page,
                        limit: this.pageSize
                    };
                    let result = await api.stayFollowTb(params);
                    let {data, code} = result.data;
                    if (code === 0) {
                        this.tableList = data ? data.list : [];
                        this.dealNum = data ? data.deal_num : 0;
                        this.contractNum = data ? data.forecast_num : 0;
                        this.totalNum = data ? parseInt(data.deal_total_num) : 0;
                        this.totalPage = data ? data.total_page : 0;
                        // 把公共title传递给父组件
                        let titleInfo = data ? data.show_text : {};
                        this.$emit('getTitInfo', titleInfo);
                    }
                    this.tbLoading = false;
                } catch (error) {
                    this.tbLoading = false;
                    console.log(error);
                }
            }
        },
        // 获取城市下拉
        async getCity() {
            try {
                let params = {
                    type: 2,
                    param: 'withAll'
                };
                let result = await commonApi.getDetailCityListData(params);
                let {data, code} = result.data;
                if (code === 0) {
                    this.cityList = data ? data.list : [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取初始化下拉
        async initFormData() {
            try {
                let result = await api.stayFollowInit();
                let {data, code} = result.data;
                if (code === 0) {
                    // 成交单进度
                    this.processList = data ? data.deal_step : [];
                    // 合作方式
                    this.operateTypeList = data ? data.cooperate_type : [];
                    // 回款类型
                    this.fundsTypeList = data ? data.commission_type : [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 修改table header的背景色
         * @param {Object} row 行数据
         * @param {Object} column 列数据
         * @param {Number} rowIndex 行号
         * @param {Number} columnIndex 列号
         */
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        },
        /**
         * 表格翻页
         * @param {Number} page 当前点击的第几页
         */
        pageChange(page) {
            this.page = page;
            // 分页请求
            this.doSearch(page);
        }
    }
};
</script>
<style scoped>
    .order-search{
        overflow: hidden;
    }
    .order-search >>> .el-date-editor, .order-search >>> .el-select{
        width: 100%;
        height: 40px;
        box-sizing: border-box;
    }
    .order-search >>> .el-date-editor {
        padding: 3px 5px;
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
    .pagination >>> .el-pagination.is-background .el-pager li {
        background-color: #fff;
    }
    .pagination >>> .el-pagination.is-background .btn-next, .pagination >>> .el-pagination.is-background .btn-prev {
        background-color: #fff;
    }
    .pagination >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #409eff;
        color: #fff;
    }
    .table-wrap-new >>> .el-table__header .el-table-column--selection .cell .el-checkbox {
        font-size: 12px;
    }
    .table-wrap-new >>> .el-table__header .el-table-column--selection .cell .el-checkbox:after {
        color: rgb(51, 51, 51);
        content: "全选";
        font-size: 12px;
        margin-left: 6px;
        font-weight: 500;
    }
</style>
<style lang="less" scoped>
.pagination {
    text-align: center;
    margin: 25px 0 10px;
}
.follow-list-wrapper {
    margin-top: 20px;
    .s-query {
        & > li {
            width: 334px;
        }
    }
    .v-box {
        background-color: #eef3f6;
        margin-bottom: 0;
        padding: 0 0 10px;
    }
    .table-operate-box {
        padding-top: 20px;
        font-size: 14px;
        overflow: hidden;
        .opreate-box {
            float: right;
            .opreate-tip {
                float: left;
                line-height: 32px;
                margin-right: 20px;
                color: #ff0000;
                text-decoration: underline;
                cursor: pointer;
            }
            /deep/.el-button {
                padding: 8px 10px;
            }
        }
        .discribe-box {
            overflow: hidden;
            padding-right: 20px;
            line-height: 32px;
            font-weight: 500;
        }
    }
}
.table-wrap-new {
    /deep/.el-table {
        th {
            &.more-info-td {
                width: 110px;
                .cell {
                    width: 110px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            &.more-info-long-th {
                width: 120px;
            }
        }
        td {
            &.more-info-td {
                width: 110px;
                .cell {
                    width: 110px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    /*修改element-ui默认样式，这个样式原本作用于td，但是被继承过来了*/
                    visibility: visible;
                }
            }
            &.more-info-long-th {
                width: 120px;
                .cell {
                    width: 120px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    /*修改element-ui默认样式，这个样式原本作用于td，但是被继承过来了*/
                    visibility: visible;
                }
            }
        }
    }
    .turn-to-page {
        display: inline-block;
        color: #46aaff;
        cursor: pointer;
    }
}
</style>
