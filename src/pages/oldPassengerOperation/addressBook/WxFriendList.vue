<!--
 * @Description: 微信好友管理列表
 * @Author: xiejiaxin
 * @Date: 2019-10-08
 -->
<template>
    <div class="el-row">
        <el-col
            :span="24"
            class="content-main">
            <el-breadcrumb
                class="bread-crumb-box"
                separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>
                    <a href="/">首页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item>微信好友管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--搜索区域--> 
            <div class="v-box form-table-box">
                <div class="hd">
                    <h2>微信好友管理</h2>
                </div>
                <div class="bd">
                    <div class="order-search">
                        <!--查询需求-->
                        <ul class="s-query">
                            <li>
                                <div class="th">城市：</div>
                                <div class="td">
                                    <el-select
                                        v-model="cityId"
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in cityList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">咨询师：</div>
                                <div class="td">
                                    <el-select
                                        v-model="zxsModel"
                                        filterable
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in zxsList"
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
                                    <el-select
                                        v-model="zxsLeadModel"
                                        filterable
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in zxsLeadList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">咨询经理：</div>
                                <div class="td">
                                    <el-select
                                        v-model="zxsManaModel"
                                        filterable
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in zxsManaList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">是否完成分组：</div>
                                <div class="td">
                                    <el-select
                                        v-model="isFinishGroup"
                                        placeholder="请选择">
                                        <el-option
                                            label="请选择"
                                            value=""></el-option>
                                        <el-option
                                            label="是"
                                            value="1"></el-option>
                                        <el-option
                                            label="否"
                                            value="0"></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">是否完成绑定：</div>
                                <div class="td">
                                    <el-select
                                        v-model="isFinishBind"
                                        placeholder="请选择">
                                        <el-option
                                            label="请选择"
                                            value=""></el-option>
                                        <el-option
                                            label="是"
                                            value="1"></el-option>
                                        <el-option
                                            label="否"
                                            value="0"></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">公司：</div>
                                <div class="td">
                                    <el-select
                                        clearable
                                        v-model="companyVal"
                                        filterable
                                        remote
                                        :remote-method="companyQuery"
                                        @focus="focusCompany"
                                        placeholder="请选择公司">
                                        <el-option
                                            v-for="item in companyData"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
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
            </div>
            <!--表格展示区域-->
            <div class="v-box form-table-box wx-list-table">
                <div class="bd">
                    <div class="search-result">
                        <div class="data-stat">
                            <el-row>
                                <el-col :span="10">
                                    第{{currentStart}}-{{currentEnd}}条，共{{dataSum}}条数据
                                </el-col>
                            </el-row>
                        </div>
                        <div class="table-wrap">
                            <el-table ref="tableFixedWrap"
                                border
                                :data="tableList"
                                v-loading="tbLoading"
                                size="small"
                                row-class-name="row"
                                cell-class-name="column"
                                :highlight-current-row="true"
                                :header-cell-style="tableHeaderColor">
                                    <el-table-column
                                        min-width="150"
                                        prop="city"
                                        label="城市">
                                    </el-table-column>
                                    <el-table-column
                                    prop="org_name"
                                    width="170"
                                    label="公司">
                                </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="employee_name"
                                        label="咨询师">
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="employee_leader"
                                        label="咨询主管">
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="employee_manager"
                                        label="咨询经理">
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="friend_count"
                                        label="好友">
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="is_finish_group"
                                        label="是否完成分组">
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="is_finish_bind"
                                        label="是否完成绑定">
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="operate"
                                        label="操作">
                                        <template slot-scope="scope">
                                            <span
                                                class="opereate-cell"
                                                @click="turnToCheck(scope.row)">查看好友</span>
                                        </template>
                                    </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination" v-if="isPage">
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                :page-size="pageLimit"
                                :current-page.sync="page"
                                @current-change="pageChange"
                                :total="dataSum">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
import { getCity, getEmployee, getEmployeeLeader, getZxsWx } from '@/api/commonApi';
import api from './api/wechatRecordApi'
import { mapState } from 'vuex';
export default {
    name: 'wx-friend-list',
    data () {
        return {
            // 咨询师
            zxsModel: '',
            // 咨询师主管
            zxsManaModel: '',
            // 咨询师经理
            zxsLeadModel: '',
            // 工作微信
            workWxModel: '',
            // 当前页的开始
            currentStart: '',
            // 当前页的结束
            currentEnd: '',
            // 是否完成分组
            isFinishGroup: null,
            // 是否完成绑定
            isFinishBind: null,
            // 城市
            cityId: '',
            // 咨询师数组
            zxsList: [],
            // 咨询师主管数组
            zxsLeadList: [],
            // 咨询师经理数组
            zxsManaList: [],
            // 工作微信下拉数组
            workWxList: [],
            // 表格内容
            tableList: [],
            // 每页多少条
            pageLimit: 20,
            // 一共多少条
            dataSum: 0,
            // 是否分页
            isPage: false,
            // 表头
            tableLabel: [],
            // 当前页数
            page: 1,
            // 表格加载loading
            tbLoading: false,
            // 当前角色
            curRole: '',
            // 城市下拉
            cityList: [],
            // 公司下拉
            companyVal: '',
            companyData: []
        }
    },
    created () {
        // 获取城市下拉
        this.getCityList();
        // 获取咨询师下拉
        this.getEmployeeList();
        // 获取咨询师主管下拉
        this.getEmployeeLeaderList();
        // 获取咨询师经理下拉
        this.getEmployeeManaList();
        // 获取咨询师工作微信号
        // this.getWorkWxList();
    },
    mounted () {
        this.$nextTick(() => {
            // 默认搜索表格
            this.doSearch(this.page);
            this.curRole = this.employeeName.role;
        })
    },
    computed: {
        ...mapState({
            employeeName: state => state.employeeName,
            uid: state => state.uid
        })
    },
    methods: {
        /**
         * @description: 公司下拉--加盟组织需求添加
         * @param {string} q 搜索内容
         * @return {type} 
         */
        async companyQuery(query) {
            try {
                let params = {
                    q: query
                    }
                    let {
                        data: {
                        code,
                        data
                    }} = await api.getCompanyData(params);
                    if (code === 0) {
                        this.companyData = data.list;
                    }
                }
                catch(error) {
                    console.log(error)
                }
        },
        // 公司获取焦点
        focusCompany() {
            this.companyQuery('');
        },
        /**
         * 查看好友点击
         * @param {Object} para 点击的当前行数据对象
         */
        turnToCheck(para) {
            this.$router.push({
                path: '/weChatAddressBook/addressBookList',
                query: {
                    value: 1,
                    uid: para.employee_id
                }
            })
        },
        // 表格数据处理
        getTableData() {
            if (this.dataSum !== 0) {
                this.isPage = true;
                // 计算一共多少页
                this.pageNum = Math.ceil(this.dataSum / this.pageLimit);
                // 计算最后一页剩余多少条数据，可能为0，也可能为其他值
                this.leftPage = parseInt(this.dataSum % this.pageLimit);
                if (this.pageNum === 1) {
                    // 如果只有一页的数据
                    this.currentStart = 1;
                    this.currentEnd = this.dataSum;
                } else {
                    if (this.page === 1) {
                        // 多页数据时，第一页显示
                        this.currentStart = 1;
                        this.currentEnd = this.pageLimit;
                    }
                }
            } else {
                // 总数据条数为0
                this.dataSum = 0;
                // 从第几条开始为0
                this.currentStart = 0;
                // 到第几条为0
                this.currentEnd = 0;
                // 重置默认值
                this.page = 1;
                // 没有数据，隐藏分页
                this.isPage = false;
            }
        },
        /**
         * 表格翻页
         * @param {Number} page 当前点击的第几页
         */
        pageChange(page) {
            // 分页请求
            this.pageUpdate(page);
            if (this.leftPage === 0) {
                this.currentStart = (this.page - 1) * this.pageLimit + 1;
                this.currentEnd = this.page * this.pageLimit;
            } else {
                if (this.page === this.pageNum) {
                    // 最后一页
                    this.currentStart = (this.page - 1) * this.pageLimit + 1;
                    this.currentEnd = (this.currentStart - 1) + this.leftPage;
                } else {
                    // 不是最后一页
                    this.currentStart = (this.page - 1) * this.pageLimit + 1;
                    this.currentEnd = this.page * this.pageLimit;
                }
            }
        },
        // 获取城市下拉
        async getCityList() {
            try {
                // 如果包含‘全国’下拉项，传字符串1
                let result = await getCity('1');
                let { data } = result;
                if (data.code === 0) {
                    // 确认是否是数组格式
                    if (Array.isArray(data.data)) {
                        this.cityList = data.data;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取咨询师下拉 getEmployeeManaList
        async getEmployeeList() {
            try {
                let params = {
                    q: '',
                    header_manager_id: '',
                    city_id: '',
                    department_id: '',
                    role: 'header',
                    status: '1'
                };
                let result = await getEmployee(params);
                let { data } = result;
                if (data.code === 0) {
                    // 确认是否是数组格式
                    if (Array.isArray(data.data)) {
                        this.zxsList = data.data;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取咨询师主管下拉
        async getEmployeeLeaderList() {
            try {
                let params = {
                    q: '',
                    city_id: ''
                };
                let result = await getEmployeeLeader(params);
                let { data } = result;
                if (data.code === 0) {
                    // 确认是否是数组格式
                    if (Array.isArray(data.data)) {
                        this.zxsLeadList = data.data;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取咨询师经理
        async getEmployeeManaList() {
            try {
                let params = {
                    q: '',
                    header_manager_id: '',
                    city_id: '',
                    department_id: '',
                    role: 'admin',
                    status: '1'
                };
                let result = await getEmployee(params);
                let { data } = result;
                if (data.code === 0) {
                    // 确认是否是数组格式
                    if (Array.isArray(data.data)) {
                        this.zxsManaList = data.data;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取咨询师工作微信
        async getWorkWxList() {
            try {
                let params = {
                    q: ''
                };
                let result = await getZxsWx(params);
                let { data } = result;
                if (data.code === 0) {
                    if (Array.isArray(data.list)) {
                        this.workWxList = data.list;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 获取分页点击参数
         * @param {Number} para 当前点击的第几页
         */
        pageUpdate (para) {
            this.page = para;
            this.doSearch(para);
        },
        // 重置搜索项
        resetSearch () {
            // 重置form表单
            this.zxsModel = '';
            this.zxsManaModel = '';
            this.zxsLeadModel = '';
            this.cityId = '';
            this.workWxModel = '';
            this.isFinishGroup = null;
            this.isFinishBind = null;
            // 重新请求
            this.doSearch(1);
        },
        // 修改table header的背景色
        tableHeaderColor ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        },
        /**
         * 点击搜索进行数据筛选
         * @param {Number} pagePara 当前点击的第几页
         */
        async doSearch(pagePara) {
            // 设置loading
            this.tbLoading = true;
            // 如果是直接点击搜索按钮，那page一定是1
            let params = {
                city_id: this.cityId,
                employee_id: this.zxsModel,
                employee_leader_id: this.zxsLeadModel,
                employee_manager_id: this.zxsManaModel,
                employee_wx_id: this.workWxModel,
                is_finish_group: this.isFinishGroup,
                is_finish_bind: this.isFinishBind,
                page: parseInt(pagePara),
                org_id: this.companyVal
            }
            try {
                let result = await api.getWechatFriendList(params);
                let { data } = result;
                if (data.code === 0) {
                    // 关闭loading
                    this.tbLoading = false;
                    this.dataSum = parseInt(data.data.total);
                    this.tableList = data.data.list;
                    // 计算分页
                    this.getTableData();
                } else {
                    // 关闭loading
                    this.tbLoading = false;
                }
            } catch (error) {
                console.log(error);
                // 关闭loading
                this.tbLoading = false;
            }
        }
    }
}
</script>

<style scoped>
.content-main {
    padding: 0 15px;
}
.form-table-box {
    background-color: #fff;
}
.order-search {
    overflow: hidden;
}
.order-search >>> .el-date-editor,
.order-search >>> .el-select {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}
.order-search >>> .el-select >>> .el-input {
    height: 40px;
}
.order-search >>> .el-range-input {
    background-color: #fff;
    font-size: 12px;
    line-height: 32px;
}
.order-search >>> .el-date-editor .el-range-separator {
    font-size: 12px;
}
.order-search .fixHeight {
    height: 40px;
}
.order-search >>> .el-date-editor .date-tip-logo {
    display: none;
}
.form-table-box .filter-link-more {
    float: right;
    padding: 9px 20px;
    margin-top: 6px;
}
.order-search > .s-query > li .td {
    height: 40px;
}
.s-query > li.long-column {
    width: 360px;
}
.s-query > li.margin-next {
    margin-left: 20px;
}
.form-tip-box {
    color: #999;
}
.form-table-box .batch-btn-area {
    text-align: right;
}
.batch-form-box >>> .el-form-item {
    margin-bottom: 0;
}
.data-stat{
    overflow: hidden;
    padding: 10px 0 20px;
    font-size: 14px;
}
</style>
<style lang="less" scoped>
.wx-list-table{
    /deep/.el-table{
        th{
            .cell{
                font-size: 14px;
                color: #333;
                text-align: center;
                font-weight: normal;
            }
        }
        td{
            .cell{
                font-size: 14px;
                color: #333;
                text-align: center;
                font-weight: normal;
            }
        }
        .opereate-cell{
            color: #2e9ae2;
            cursor: pointer;
        }
    }
    .pagination{
        text-align: center;
        padding: 20px 0;
        background: #fff;
    }
}
</style>
