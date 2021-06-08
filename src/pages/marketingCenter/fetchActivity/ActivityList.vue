<!--
 * @author: xiejiaxin
 * @Date: 2020-09-03 24:04:00
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-20 18:07:16
 * @description: 活动管理列表
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/activity/reportList' }">提报管理</el-breadcrumb-item>
            <el-breadcrumb-item>提报详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <!-- 提报信息展示 -->
            <div class="activity-info-box">
                <h2>{{baseInfo.name}}</h2>
                <div class="activity-info-content">
                    <ul class="s-query clearfix">
                        <li>
                            <div class="th">活动时间：</div>
                            <div class="td">{{baseInfo.activity_time}}</div>
                        </li>
                        <li>
                            <div class="th">提报时间：</div>
                            <div class="td">{{baseInfo.submission_time}}</div>
                        </li>
                        <li class="auto show-more">
                            <div class="th">提报描述：</div>
                            <div class="td">
                                <div class="td-title">{{baseInfo.desc}}</div>
                                <div class="btn-show-more"
                                    v-if="baseInfo.desc && baseInfo.desc.length > 20"
                                    @click="showMoreInfo(1,'提报描述', baseInfo.desc)">查看更多描述</div>
                            </div>
                        </li>
                        <li class="auto show-more">
                            <div class="th">提报规则：</div>
                            <div class="td">
                                <div class="td-title">{{baseInfo.submission_rule}}</div>
                                <div class="btn-show-more"
                                    v-if="baseInfo.submission_rule && baseInfo.submission_rule.length > 20"
                                    @click="showMoreInfo(1,'提报规则', baseInfo.submission_rule)">查看更多规则</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="order-search">
                <!--查询搜索-->
                <ul class="s-query clearfix">
                    <li>
                        <div class="th">提报城市：</div>
                        <div class="td">
                            <search-select-radio v-model="search.city"
                                :clearable="true"
                                placeholder="请选择"
                                @input="changeCity"
                                :apiInfo="cityApi">
                            </search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">优惠类型：</div>
                        <div class="td">
                            <el-select v-model="search.discountsType"
                                filterable
                                multiple
                                placeholder="请选择优惠类型">
                                <el-option v-for="item in discountsTypeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">优惠状态：</div>
                        <div class="td">
                            <el-select v-model="search.status"
                                placeholder="请选择优惠状态">
                                <el-option v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">填写人：</div>
                        <div class="td">
                            <search-select-radio v-model="search.checkPerson"
                                :clearable="true"
                                placeholder="请选择"
                                :apiInfo="memberApi">
                            </search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">楼盘等级：</div>
                        <div class="td">
                            <el-select v-model="search.level"
                                placeholder="请选择楼盘等级">
                                <el-option v-for="item in levelList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">楼盘名称：</div>
                        <div class="td">
                            <search-select-radio v-model="search.houseName"
                                :clearable="true"
                                placeholder="请选择"
                                :apiInfo="houseApi">
                            </search-select-radio>
                        </div>
                    </li>
                    <li class="long-width">
                        <div class="th">楼盘活动时间：</div>
                        <div class="td">
                            <el-date-picker v-model="search.date"
                                type="daterange"
                                @change="changeDate"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">审核状态：</div>
                        <div class="td">
                            <el-select v-model="search.checkStatus"
                                placeholder="请选择审核状态">
                                <el-option v-for="item in checkStatusList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">专属优惠：</div>
                        <div class="td">
                            <el-select v-model="search.exclusive"
                                placeholder="请选择专属优惠">
                                <el-option v-for="item in exclusiveList"
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
                <el-button type="primary"
                    @click="searchData(1)">查询</el-button>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="12">
                                <p class="total-num">当前共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area">
                                    <el-button type="primary"
                                        v-if="createAuth"
                                        @click="updateActivity('add')">+ 新增楼盘</el-button>
                                    <el-button type="primary"
                                        @click="exportData">导出</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-wrap">
                        <el-table border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            style="width: 100%"
                            :header-cell-style="tableHeaderColor">
                            <el-table-column
                                prop="project_id"
                                :show-overflow-tooltip="true"
                                label="楼盘ID"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="project_name"
                                label="楼盘名称"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="city_name"
                                label="城市"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="is_julive"
                                label="专属优惠"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="promotion_type"
                                label="优惠类型"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="promotion_desc"
                                label="优惠描述"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover placement="top"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.promotion_desc">
                                        <div class="tooltip-text"
                                            slot="reference">{{scope.row.promotion_desc}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="special_house_count"
                                label="特价房源"
                                align="center">
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.special_house_count">无</span>
                                    <span class="btn-link"
                                        @click="getHouseInfo(scope.row)"
                                        v-else>{{scope.row.special_house_count}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="promotion_status"
                                label="优惠状态"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="audit_status"
                                label="审核状态"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="project_level"
                                label="楼盘等级"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="score"
                                label="活动分"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="creator"
                                label="填写人"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="activity_time"
                                label="楼盘活动时间"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center">
                                <template slot-scope="scope">
                                    <div class="btn-list">
                                        <el-button type="text"
                                            size="small"
                                            v-if="scope.row.edit_auth"
                                            @click="updateActivity('edit',scope.row.id)">编辑</el-button>
                                        <el-button type="text"
                                            size="small"
                                            v-if="scope.row.audit_auth"
                                            @click="audit(scope.row)">审核</el-button>
                                        <el-button type="text"
                                            size="small"
                                            v-if="scope.row.delete_auth"
                                            @click="deleteActivity(scope.row.id)">删除</el-button>
                                        <el-button type="text"
                                            size="small"
                                            v-if="scope.row.edit_score_auth"
                                            @click="updateScore(scope.row)">修改活动分</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination v-if="totalNum - pageSize > 0"
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :total="totalNum">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增楼盘弹窗 -->
        <add-house :visible.sync="addDialogVisible"
            :config="config"
            :dialogType="dialogType"
            :appId="appId"
            :title="title"
            :cities="cities"
            @success="success"
            :activityInfo="baseInfo"></add-house>
        <!-- 提示信息弹窗 -->
        <alert-dialog :title="alert.title"
            :visible.sync="alert.visible"
            width="600px">
            <!-- 提报描述展示 -->
            <div v-if="alert.key === '1'">
                {{alert.content}}
            </div>
            <!-- 特价房展示 -->
            <div class="house-info-wrapper" v-if="alert.key === '2'">
                <div class="title">{{specialHouseInfo.name}}</div>
                <ul class="content"
                    v-if="specialHouseInfo">
                    <li>活动时间：{{specialHouseInfo.date}}</li>
                    <li v-for="(item, index) in specialHouseInfo.list"
                        :key="index">特价房号：{{item.room_num}} 面积：{{item.area}} 原总价：{{item.total_price}}万 特价：{{item.special_price}}万</li>
                </ul>
            </div>
        </alert-dialog>
        <!-- 二次确认弹层——删除弹层，导出 -->
        <confirm-dialog :title="confirm.title"
            :content="confirm.content"
            :confirmBtn="confirm.confirmBtn"
            :visible="confirm.visible"
            :width="confirm.width"
            @cancel="confirm.visible = false"
            @confirm="confirmAlert"></confirm-dialog>
        <!-- 审核弹层 -->
        <audit-dialog title="审核"
            :visible="auditDialog.visible"
            :radioGroup="auditDialog.radioGroup"
            :rejectId="auditDialog.rejectId"
            :maxLength="auditDialog.maxLength"
            :isRequired="false"
            @close="auditDialog.visible = false"
            @confirm="confirmAudit">
            <ul>
                <li>楼盘ID：{{auditInfo.project_id}}</li>
                <li>楼盘名称：{{auditInfo.project_name}}</li>
                <li>优惠类型：{{auditInfo.promotion_type}}</li>
                <li>优惠信息：{{auditInfo.promotion_desc}}</li>
            </ul>
        </audit-dialog>
        <!-- 修改活动分 -->
        <update-score-dialog :visible="updateScoreDialog"
            @close="updateScoreDialog = false"
            :info="houseInfo"
            @confirm="confirmScore"></update-score-dialog>
    </div>
</template>

<script>
import api from './api/api';
import commonApi from '@/api/commonApi';
import AddHouse from './components/AddHouse.vue';
import UpdateScoreDialog from './components/UpdateScoreDialog.vue';
import { ConfirmDialog, AuditDialog, AlertDialog, SearchSelectRadio } from '@/components';
// 一天的毫秒数
const milliscond = 24 * 60 * 60 * 1000;
export default {
    name: 'activity-list',
    components: {
        ConfirmDialog,
        AuditDialog,
        AlertDialog,
        SearchSelectRadio,
        AddHouse,
        UpdateScoreDialog
    },
    data() {
        return {
            // 提报城市
            cities: [],
            // 弹窗标题
            title: '',
            // 楼盘信息
            houseInfo: {},
            // 修改活动分弹窗展示标志
            updateScoreDialog: false,
            // 基本信息
            baseInfo: {},
            // 新增弹窗展示标志
            addDialogVisible: false,
            // 搜索字段
            search: {
                // 提报城市
                city: '',
                // 提报时间
                date: [],
                // 优惠类型
                discountsType: '',
                // 提报状态
                status: '',
                // 楼盘名称
                houseName: '',
                // 楼盘等级
                level: '',
                // 专属优惠
                exclusive: '',
                // 审核状态
                checkStatus: '',
                // 填写人
                checkPerson: ''
            },
            // 专属优惠下拉
            exclusiveList: [],
            // 审核状态下拉
            checkStatusList: [],
            // 楼盘等级
            levelList: [],
            // 优惠类型下拉
            discountsTypeList: [],
            // 提报状态下拉
            statusList: [],
            // 城市远程下拉
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll,noAll'
                }
            },
            // 所有人下拉
            memberApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all'
                }
            },
            // 楼盘名称下拉
            houseApi: {
                api: commonApi.getHouseAll,
                params: {
                    q: '',
                    city_id: ''
                }
            },
            // 当前页面
            currentPage: 1,
            // 数据总数
            totalNum: 0,
            // 表格数据
            tableList: [],
            // 表格loading
            loading: false,
            // 每页显示数据
            pageSize: 20,
            // 防止重复提交
            flag: true,
            // 提示信息
            alert: {
                // 标识
                key: '',
                // 标题
                title: '',
                // 弹窗是否展示
                visible: false,
                // 信息内容
                content: ''
            },
            // 要删除的活动的ID
            currentId: '',
            // 二次确认弹层信息
            confirm: {
                // 识别是删除是导出 delete=删除   export=导出
                id: '',
                // 弹窗标题
                title: '',
                // 弹窗内容
                content: '',
                // 弹窗确认按钮的文本值
                confirmBtn: '',
                // 弹窗是否展示
                visible: false,
                // 弹窗宽度
                width: '350px'
            },
            // 审核弹窗信息
            auditDialog: {
                // 弹窗是否展示
                visible: false,
                // 审核的radio选择
                radioGroup: [],
                // 驳回的id，用以展示驳回原因
                rejectId: '',
                // 驳回原因字数
                maxLength: 100
            },
            // 审核的信息展示
            auditInfo: {
                // 要审核的ID
                id: ''
            },
            // 创建权限
            createAuth: false,
            // 下拉配置数据对象
            config: {},
            // 当前选中的活动ID
            appId: '',
            // 弹窗类型
            dialogType: 'add',
            // 房源信息展示内容
            specialHouseInfo: {
                // 特价房数组
                list: [],
                // 日期
                date: '',
                // 楼盘名字
                name: ''
            }
        };
    },
    mounted() {
        // 获取初始数据
        this.searchData(1);
    },
    methods: {
        /**
         * @description: 城市下拉修改
         * @param {String} val 选中下拉value值 
         */
        changeCity(val) {
            this.houseApi.params.city_id = val;
        },
        /**
         * @description: 查看特价房源信息
         * @param {Object} val 特价房信息数据对象 
         */
        getHouseInfo(val) {
            this.alert = {
                key: '2',
                title: '特价房源',
                visible: true,
                content: ''
            };
            // 房源信息
            this.specialHouseInfo.list = val.special_house_list;
            this.specialHouseInfo.name = val.project_name;
            this.specialHouseInfo.date = val.activity_time;
        },
        /**
         * @description: 编辑活动
         * @param {String} val edit--编辑，add--创建
         * @param {String} id 活动ID
         * @return {type} 
         */
        updateActivity(val, id) {
            this.dialogType = val;
            this.appId = id;
            this.addDialogVisible = true;
            this.title = val === 'edit' ? '编辑楼盘信息' : '新增楼盘信息';
        },
        // 楼盘创建成功函数
        success() {
            this.searchData(1);
        },
        /**
         * @description: 弹窗展示内容
         * @param {String} key 弹窗类型
         * @param {String} title 弹窗标题 
         * @param {String} content 弹窗内容 
         */
        showMoreInfo(key, title, content) {
            this.alert = {
                key: '1',
                title: title,
                visible: true,
                content: content
            };
        },
        /**
         * @description: 日期修改，判断如果清空，则赋值为空数组，防止提交时候报错
         * @param {Arrary || Object} val
         */
        changeDate(val) {
            if (!val) {
                this.search.date = [];
            }
        },
        /**
         * 点击搜索
         * @param {string} page 页码
         */
        async searchData(page) {
            // 一天的毫秒数
            // 如果没有时间参数，就默认返回最近半年
            this.updateDate();
            if (this.search.date.length > 0 && (this.search.date[1] - this.search.date[0]) / milliscond > 180) {
                this.$message.error('最多可搜索180天的提报时间的数据');
                return false;
            }
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            if (page) {
                this.currentPage = page;
            }
            this.flag = false;
            try {
                this.loading = true;
                let params = this.getParams();
                const {
                    data: { code, msg, data }
                } = await api.getActivityList(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.totalNum = data.total ? parseInt(data.total) : '0';
                    this.pageSize = data.pageSize;
                    // 赋值基本信息
                    this.baseInfo = data.submission ? data.submission : {};
                    this.cities = data.submission ? data.submission.city_ids : [];
                    this.createAuth = data.create_auth ? data.create_auth : false;
                    // 只有当前为第一页的时候才对下拉进行赋值
                    if (page === 1) {
                        this.checkStatusList = data.config.audit_status;
                        this.exclusiveList = data.config.is_julive_promotion;
                        this.discountsTypeList = data.config.promotion_type;
                        this.statusList = data.config.promotion_status;
                        this.levelList = data.config.project_level;
                        this.exclusiveList = data.config.is_julive_promotion;
                        this.config = {
                            levelList: this.levelList,
                            exclusiveList: this.exclusiveList,
                            discountsTypeList: this.discountsTypeList,
                            // 提报时间
                            reportTime: this.baseInfo.submission_time
                        };
                    }
                } else {
                    this.$message.error(msg);
                }
                this.loading = false;
                this.flag = true;
            } catch (err) {
                this.loading = false;
                this.flag = true;
                console.log(err);
            }
        },
        // 点击重置
        resetSearch() {
            this.search = {
                city: '',
                // 提报时间
                date: [],
                // 优惠类型
                discountsType: '',
                // 提报状态
                status: '',
                // 楼盘名称
                houseName: '',
                // 楼盘等级
                level: '',
                // 专属优惠
                exclusive: '',
                // 审核状态
                checkStatus: '',
                // 填写人
                checkPerson: ''
            };
            this.searchData(1);
        },
        /**
         * @description: 表格翻页
         * @param {Number} val 当前页数 
         */
        pageChange(val) {
            this.searchData(val);
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        },
        // 导出
        exportData() {
            this.confirm = {
                id: 'export',
                title: this.baseInfo.name,
                content: '导出当前全部数据',
                confirmBtn: '确认',
                visible: true,
                width: '500px'
            };
        },
        /**
         * @description: 删除提报
         * @param {string} id   提报ID
         * @return {type}
         */
        deleteActivity(id) {
            this.currentId = id;
            this.confirm = {
                id: 'delete',
                title: '提示',
                content: '删除后不可恢复，请谨慎操作！',
                confirmBtn: '确认删除',
                visible: true
            };
        },
        // 二次确认弹窗点击继续
        confirmAlert() {
            if (this.confirm.id === 'delete') {
                this.confirmDelete();
            } else if (this.confirm.id === 'export') {
                this.confirmExport();
            }
        },
        // 确认删除
        async confirmDelete() {
            if (!this.flag) return;
            this.flag = false;
            try {
                let params = {
                    app_id: this.currentId,
                    submission_type: this.$route.query.type
                };
                const {
                    data: { code, msg }
                } = await api.deleteActivity(params);
                if (code === 0) {
                    this.flag = true;
                    this.confirm.visible = false;
                    this.searchData(1);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                } else {
                    this.flag = true;
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        /**
         * @description: 获取搜索参数
         */
        getParams() {
            let params = {
                page: this.currentPage,
                submission_type: this.$route.query.type,
                submission_id: this.$route.query.id,
                city_id: this.search.city,
                promotion_type: this.search.discountsType,
                promotion_status: this.search.status,
                creator: this.search.checkPerson,
                project_level: this.search.level,
                project_id: this.search.houseName,
                start_time: this.search.date.length > 0 ? this.search.date[0] / 1000 : '',
                // 结尾时间加23:59:59
                end_time: this.search.date.length > 0 ? (this.search.date[1] + milliscond - 1000) / 1000 : '',
                audit_status: this.search.checkStatus,
                is_julive: this.search.exclusive
            }
            return params;
        },
        // 重新给日期赋值
        updateDate() {
            if (this.search.date.length === 0) {
                let date = new Date();
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                this.$set(this.search.date, '0', date.getTime() - milliscond * 90);
                this.$set(this.search.date, '1', date.getTime() + milliscond * 90);
            }
        },
        // 确认导出
        confirmExport() {
            if (this.tableList.length == 0) {
                this.$message.error('没有数据，不能导出！');
                return false;
            }
            // 如果没有时间参数，就默认返回最近半年
            this.updateDate();
            if (this.search.date.length > 0 && (this.search.date[1] - this.search.date[0]) / milliscond > 180) {
                this.$message.error('最多可导出180天的提报时间的数据');
                return false;
            }
            try {
                let params = this.getParams();
                params.export = 1;
                let url = '/backend-api/submission/submission-manage/activity-list?';
                Object.keys(params).map((item, i) => {
                    if (i !== 0) {
                        url += '&' + item + '=' + params[item];
                    } else {
                        url += item + '=' + params[item];
                    }
                });
                window.location.href = url;
                this.confirm.visible = false;
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 审核活动
         * @param {object} info  要审核的信息
         * @return {type}
         */
        audit(info) {
            this.auditInfo = info;
            this.auditDialog = {
                visible: true,
                radioGroup: [
                    { value: 1, name: '审核通过' },
                    { value: 2, name: '驳回' }
                ],
                maxLength: 100,
                rejectId: 2
            };
        },
        /**
         * @description: 修改活动分
         * @param {object} info  楼盘信息
         */
        updateScore(info) {
            this.houseInfo = info;
            this.updateScoreDialog = true;
        },
        /**
         * @description: 确定审核
         * @param {Object}  formInfo   表单选择返回的数据
         * @return {type}
         */
        async confirmAudit(formInfo) {
            if (!this.flag) return;
            this.flag = false;
            try {
                let params = {
                    submission_type: this.$route.query.type,
                    action: formInfo.audit === 1 ? 'pass' : 'reject',
                    id: this.auditInfo.id,
                    reason: formInfo.reason,
                    project_id: this.auditInfo.project_id
                };
                const {
                    data: { code, msg }
                } = await api.auditActivity(params);
                if (code === 0) {
                    this.flag = true;
                    this.auditDialog.visible = false;
                    this.$message({
                        message: '审核成功',
                        type: 'success'
                    });
                    this.searchData(1);
                } else {
                    this.flag = true;
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        /**
         * @description: 修改活动分
         * @param {Object} val 活动分数据对象 
         */  
        async confirmScore(val) {
            try {
                let params = {
                    submission_type: this.$route.query.type,
                    app_id: val.id,
                    score: val.score
                };
                const {
                    data: { code, msg }
                } = await api.updateScore(params);
                if (code === 0) {
                    this.updateScoreDialog = false;
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.searchData(1);
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        }  
    }
};
</script>

<style lang="less" scoped>
.house-info-wrapper {
    max-height: 400px;
    overflow: auto;
    .title {
        margin-bottom: 10px;
        font-weight: bold;
    }
    .content {
        & > li {
            margin-bottom: 10px;
        }
    }
}
.main-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.container-box {
    .btn-link {
        color: #409eff;
        cursor: pointer;
    }
    .s-query {
        li.long-width {
            width: 680px;
            /deep/.el-range-editor {
                width: 100%;
            }
        }
        li {
            /deep/.el-select {
                width: 100%;
            }
        }
    }
    .form-table-box {
        padding-top: 20px;
    }
    .btn-list {
        button {
            margin: 0 5px;
        }
    }
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
        }
        .operation-area {
            text-align: right;
        }
    }
}
.tooltip-text {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
.pagination {
    text-align: center;
    padding-top: 10px;
}
.center {
    text-align: center;
}
.search-wrap {
    .activity-info-box {
        margin-bottom: 40px;
        & > h2 {
            margin-bottom: 10px;
            padding-left: 59px;
            box-sizing: border-box;
        }
    }
    /deep/.el-range-editor {
        .el-range-input {
            background-color: transparent;
        }
    }
    .activity-info-content {
        .s-query {
            & > li {
                margin-bottom: 0;
                line-height: 32px;
                .th {
                    height: 32px;
                }
                .btn-show-more {
                    min-width: 94px;
                    margin-left: 10px;
                    color: #409eff;
                    cursor: pointer;
                }
            }
            .show-more {
                .td {
                    display: flex;
                }
                .td-title {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
}
</style>
