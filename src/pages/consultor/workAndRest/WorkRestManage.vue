<!--
 * @Name: 上户排班管理页1.0
 * @Description: 上户排班管理页1.0
 * @Author: kangxue
 * @Date: 2020-04-28
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>排班管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box"
            v-loading="loading">
            <div class="main-title">排班管理</div>
            <div class="search-box">
                <ul class="s-query clearfix">
                    <li>
                        <div class="th">日期：</div>
                        <div class="td">
                            <el-select v-model="searchDate"
                                @change="changeSelect(1)">
                                <el-option v-for="opt in dateOptions"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li v-if="cityList.length > 0">
                        <div class="th">城市：</div>
                        <div class="td">
                            <el-select v-model="cityId"
                                filterable
                                placeholder="请选择"
                                @change="changeSelect(2)">
                                <el-option v-for="opt in cityList"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="statistics-box">
                <ul class="s-query clearfix">
                    <li>计划上户量：{{planCount}}单</li>
                    <li>实际上户量：{{actualCount}}单</li>
                    <li>爆单值：{{beyondCount}}</li>
                    <li>当前出勤人数：{{attendanceCount}}</li>
                    <li class="pull-right"
                        v-show="countDown > 0">倒计时：{{countDownInfo}}</li>
                    <li class="pull-right"
                        v-if="btnState !== '0'">
                        <el-button type="primary"
                            @click="showRuleDialog">{{btnState === '1' ? '录入' : '编辑'}}下周排班规则</el-button>
                    </li>
                </ul>
            </div>
            <div class="table-box">
                <div class="table-count">共有{{totalNum}}名员工</div>
                <el-table border
                    :data="tableList"
                    size="small"
                    row-class-name="row"
                    cell-class-name="column"
                    :highlight-current-row="true"
                    @sort-change="tableSort"
                    :header-cell-style="{'background': '#f8f8f8'}">
                    <el-table-column v-for="item in headerList"
                        :key='item.value'
                        :prop="item.value"
                        :min-width="tableProp[item.value] || '150'"
                        :sortable="item.value === 'incustomer_quota' ? 'custom' : false"
                        align="center">
                        <template slot="header">
                            <span class="sub-title">{{item.name}}</span>
                            <!-- 员工咨询师搜索 -->
                            <search-select-radio class="search-select"
                                v-if="item.value === 'employee_name'"
                                v-model="searchForm.staffId"
                                placeholder="请选择"
                                :clearable="true"
                                :apiInfo="userApi"
                                @input="changeSelect"></search-select-radio>
                            <!-- 咨询师主管搜索 -->
                            <search-select-radio class="search-select"
                                v-if="item.value === 'employee_manager_name'"
                                v-model="searchForm.managerId"
                                placeholder="请选择"
                                :apiInfo="managerApi"
                                :clearable="true"
                                @input="changeSelect"></search-select-radio>
                            <!-- 咨询师等级搜索 -->
                            <el-select v-model="searchForm.level"
                                v-if="item.value === 'employee_grade'"
                                class="search-select"
                                placeholder="请选择"
                                clearable
                                @change="changeSelect">
                                <el-option v-for="opt in levelOptions"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                            <!-- 周一至周日的状态搜索 -->
                            <el-select v-model="searchForm[item.value]"
                                v-if="isWeekDay(item.value)"
                                class="search-select"
                                placeholder="请选择"
                                @change="changeSelect"
                                clearable>
                                <el-option v-for="opt in stateOptions"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                        </template>
                        <template slot-scope="scope">
                            <!-- 周一至周日 -->
                            <div v-if="isWeekDay(item.value)"
                                class="change-state-box">
                                <div v-if="!scope.row[item.value].can_operate">{{scope.row[item.value].status_str}}</div>
                                <div v-else>
                                    <div class="selected-info"
                                        @click="focusSelect(item.value, scope.row.id)"
                                        :title="scope.row[item.value].status_str">{{scope.row[item.value].status_str}}</div>
                                    <el-select v-model="scope.row[item.value].status"
                                        placeholder="请选择"
                                        @change="changeState(scope.row.id, scope.row[item.value].status, item.value, scope.$index, scope.row.employee_id, scope.row[item.value].real_status)"
                                        :automatic-dropdown="true"
                                        :ref="'select-'+item.value+'-'+scope.row.id">
                                        <el-option v-for="opt in singleStateOptions"
                                            :key="opt.value"
                                            :label="opt.name"
                                            :value="opt.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 其他列展示 -->
                            <div v-else
                                :class="item.value === 'plan_everyday_incustomer' && parseInt(scope.row[item.value]) > parseInt(beyondCount) ? 'red-color' : ''">{{scope.row[item.value]}}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination v-if="totalNum-pageSize>0"
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
        <!-- 录入下周排班规则 -->
        <edit-next-week :workScheduleShow="workScheduleShow"
            :cityId="cityId"
            @closeScheduleDialog="closeScheduleDialog">
        </edit-next-week>
        <!-- 判断是否可休息 -->
        <el-dialog custom-class="common-dialog-wrapper"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            class="rest-dialog"
            center
            width="600px">
            <div slot="title"
                class="dialog-header">
                提示
            </div>
            <div class="body-box">
                <div class="err-msg">{{errMsg}}</div>
                <div v-if="popupType && popupType !== '3' && popupType !== '4'">
                    <div class="is-leave-box">
                        咨询师是否请假？
                        <el-radio-group v-model="isLeave">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="2">否</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="rest-box"
                        v-if="isLeave === '1'">
                        <div v-if="popupType === '2' && surplusOrderNum !== '0'">临时请假，当日分配任务未完成，剩余{{surplusOrderNum}}单，请协调其他咨询师代班</div>
                        <div class="work-select-box"
                            v-if="popupType === '1' || popupType === '5' || (popupType === '2' && surplusOrderNum !== '0')">
                            请选择代班咨询师
                            <el-select v-model="coverWorker"
                                filterable
                                placeholder="请选择">
                                <el-option v-for="item in coverList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <ul class="err-info-ul"
                            v-if="popupType === '1' || popupType === '5' || (popupType === '2' && surplusOrderNum !== '0')">
                            <li>请假可能会导致城市发生爆单，请协调其他咨询师代班；</li>
                            <li>代班咨询师将被设置为出勤，遵守开上户规则判断，请与代班咨询师达成一致；</li>
                        </ul>
                        <div v-if="popupType === '2' && surplusOrderNum === '0'">
                            临时请假，当日分配任务已完成
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <div v-if="popupType === '3'">
                    <el-button class="confirm"
                        type="primary"
                        @click="close">确定</el-button>
                </div>
                <div v-else>
                    <el-button class="cancel"
                        @click="close">取消</el-button>
                    <el-button class="confirm"
                        type="primary"
                        @click="saveRest">确定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api/workRestApi';
    import commonApi from '@/api/commonApi';
    import { SearchSelectRadio } from '@/components';
    import EditNextWeek from './components/EditNextWeek';
    import { mapState } from 'vuex';
    import { commonFun } from '@/assets/js/utils/utils';
    export default {
        data() {
            return {
                // 排班规则弹窗显示
                workScheduleShow: false,
                // 日期下拉
                dateOptions: [],
                // 日期
                searchDate: '',
                // 城市下拉
                cityList: [],
                // 城市
                cityId: '',
                // 计划上户量
                planCount: '',
                // 实际上户量
                actualCount: '',
                // 爆单值
                beyondCount: '',
                // 当前出勤人数
                attendanceCount: '',
                // 按钮状态  0没权限  1是录入 2是编辑
                btnState: '0',
                // 倒计时剩余时间，单位秒
                countDown: 0,
                // 时
                hourTime: 0,
                // 分
                minuteTime: 0,
                // 秒
                secondTime: 0,
                // 倒计时方法
                time: null,
                // 当前页面
                currentPage: 1,
                // 数据总数
                totalNum: 0,
                // 表格头
                headerList: [],
                // 表格数据
                tableList: [],
                // 表格loading
                loading: false,
                // 每页显示数据
                pageSize: 20,
                // 员工下拉
                userApi: {
                    api: commonApi.getStaffList,
                    params: {
                        q: '',
                        role: 'header'
                    }
                },
                // 主管下拉
                managerApi: {
                    api: commonApi.getStaffList,
                    params: {
                        q: '',
                        role: 'header_manager'
                    }
                },
                // 搜索条件
                searchForm: {
                    // 员工姓名
                    staffId: '',
                    // 主管姓名
                    managerId: '',
                    // 咨询师等级
                    level: '',
                    // 周一——周日
                    monday: '',
                    tuesday: '',
                    wednesday: '',
                    thursday: '',
                    friday: '',
                    saturday: '',
                    sunday: ''
                },
                // 咨询师等级数组
                levelOptions: [],
                // 搜索出勤状态数组，4个值
                stateOptions: [],
                // 切换用的出勤状态数组，只有出勤与休息
                singleStateOptions: [],
                // 上户配额排序  降序-desc 升序-asc
                sort: '',
                // 弹层展示
                dialogShow: false,
                // 错误提示类型，不同错误类型弹窗内容不同
                popupType: '',
                // 剩余单数
                surplusOrderNum: '',
                // 埋点需要的字段，对应不同弹窗，大致与popupType类似
                windowType: '',
                // 失败信息
                errMsg: '',
                // 是否请假
                isLeave: '1',
                // 代班咨询师
                coverWorker: '',
                // 代班咨询师下拉列表
                coverList: [],
                // 保存出勤休息状态要提交的参数
                saveParams: {},
                // 当前要设置的是哪一行的值的索引，设置失败后，select的值要重置，设置成功直接更新列表
                currentIndex: null,
                // 切换状态时咨询师ID  埋点所需
                currentEmployeeId: '',
                // 切换状态前的真实状态 1=出勤，2=休息，3=请假，4=代班  埋点所需
                currentRealStatus: '',
                // 表格列字段，用于宽度设定
                tableProp: {
                    employee_name: '120',
                    employee_manager_name: '120',
                    employee_grade: '100',
                    incustomer_quota: '100',
                    today_real_incostomer: '60',
                    work_days: '60',
                    plan_everyday_incustomer: '70',
                    monday: '100',
                    tuesday: '100',
                    wednesday: '100',
                    thursday: '100',
                    friday: '100',
                    saturday: '100',
                    sunday: '100'
                }
            };
        },
        components: {
            EditNextWeek,
            SearchSelectRadio
        },
        computed: {
            // 拼接时分秒展示倒计时信息
            countDownInfo: function() {
                let h = this.hourTime < 10 ? '0' + this.hourTime : this.hourTime;
                let m = this.minuteTime < 10 ? '0' + this.minuteTime : this.minuteTime;
                let s = this.secondTime < 10 ? '0' + this.secondTime : this.secondTime;
                return h + ':' + m + ':' + s;
            },
            ...mapState(['trackCommon', 'role'])
        },
        methods: {
            // 录入/编辑排班规则
            showRuleDialog() {
                this.workScheduleShow = true;
                // 进行埋点
                commonFun.setTrack(
                    '8151',
                    this.trackCommon.info,
                    {
                        tab_title: this.btnState
                    },
                    this.trackCommon.backendApi
                );
            },
            /**
             * 关闭排班规则弹窗
             * @param {Boolean} res 是否录入/编辑成功
             */
            closeScheduleDialog(res) {
                this.workScheduleShow = false;
                if (res) {
                    // 初始化数据
                    this.getList(1);
                }
            },
            // 是周一到周日这几项
            isWeekDay(val) {
                return val === 'monday' || val === 'tuesday' || val === 'wednesday' || val === 'thursday' || val === 'friday' || val === 'saturday' || val === 'sunday';
            },
            // 日期，城市，员工，主管，等级，周几下拉搜索
            changeSelect(type) {
                if (type) {
                    // 进行埋点
                    commonFun.setTrack(
                        '8150',
                        this.trackCommon.info,
                        {
                            filter_type: type
                        },
                        this.trackCommon.backendApi
                    );
                }
                this.getList(1);
            },
            /**
             * 获取列表
             * @param {String} page 页码
             */
            async getList(page) {
                clearInterval(this.time);
                this.currentPage = page;
                try {
                    this.loading = true;
                    let cityId = this.cityId === '' ? '' : this.role === 'admin' ? this.cityId : '';
                    let params = {
                        page: this.currentPage,
                        week: this.searchDate,
                        city_id: cityId,
                        employee_id: this.searchForm.staffId,
                        manager_id: this.searchForm.managerId,
                        employee_grade: this.searchForm.level,
                        monday: this.searchForm.monday,
                        tuesday: this.searchForm.tuesday,
                        wednesday: this.searchForm.wednesday,
                        thursday: this.searchForm.thursday,
                        friday: this.searchForm.friday,
                        saturday: this.searchForm.saturday,
                        sunday: this.searchForm.sunday,
                        sort: this.sort
                    };
                    const {
                        data: { code, data }
                    } = await api.getWorkList(params);
                    if (code === 0) {
                        // 总筛选赋值
                        this.dateOptions = data.filter.week;
                        this.searchDate = data.filter.default_week;
                        this.cityList = data.filter.city;
                        this.cityId = data.filter.default_city;
                        // 统计数据
                        this.planCount = data.schedule.plan_incostome;
                        this.actualCount = data.schedule.real_incostome;
                        this.beyondCount = data.schedule.explosive_value;
                        this.attendanceCount = data.schedule.work_employee_count;
                        this.countDown = data.schedule.countdown;
                        this.btnState = data.schedule.btn_type;
                        // 根据秒数计算初始时分秒的值
                        this.formatSeconds();
                        // 开始倒计时
                        this.time = setInterval(() => {
                            this.runDown();
                        }, 1000);
                        // 表格筛选的下拉选项
                        this.stateOptions = data.filter.status_config;
                        this.levelOptions = data.filter.employee_grade_config;
                        this.singleStateOptions = data.filter.operation_item;
                        // 表格数据
                        this.headerList = data.list.title;
                        this.tableList = data.list.list;
                        this.totalNum = data.list.total_records ? parseInt(data.list.total_records) : 0;
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 表格翻页
             * @param {Object} para 页码
             */
            pageChange(para) {
                this.getList(para);
            },
            /**
             * 表格按照上户配额排序
             * @param {Object} column 列
             * @param {string} prop 属性值
             * @param {string} order 排序 'ascending', 'descending', undefined
             */
            tableSort({ column, prop, order }) {
                if (order === 'ascending') {
                    this.sort = 'asc';
                } else if (order === 'descending') {
                    this.sort = 'desc';
                } else {
                    this.sort = '';
                }
                this.getList(1);
            },
            /**
             * 点击触发下拉
             * @param {Object} week 当前星期 为了组成唯一的ref
             * @param {string} id 排班id 为了组成唯一的ref
             */
            focusSelect(week, id) {
                let selectRef = 'select-' + week + '-' + id;
                this.$refs[selectRef][0].focus();
            },
            /**
             * 表格操作——出勤休息切换
             * @param {String} id 排班id
             * @param {String} status 状态 1.出勤 2.休息
             * @param {String} week 周几
             * @param {String} index 列表索引，用于取消后重置状态
             * @param {String} employeeId 咨询师ID  埋点所需
             * @param {String} realStatus 真实状态 1=出勤，2=休息，3=请假，4=代班  埋点所需
             */
            changeState(id, status, week, index, employeeId, realStatus) {
                this.saveParams = {
                    id: id,
                    work_status: status,
                    work_day: week
                };
                this.currentIndex = index;
                this.currentEmployeeId = employeeId;
                this.currentRealStatus = realStatus;
                if (status === '2') {
                    // 设置为休息，需要检验是否可休息，不同状态返回不同弹层
                    this.checkRest();
                } else {
                    // 直接设置为出勤
                    this.saveStatus();
                }
            },
            // 获取代班咨询师下拉
            async getCoverOptions() {
                try {
                    let params = {
                        city_id: this.cityId,
                        week_day: this.saveParams.work_day,
                        week: this.searchDate
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.getCoverWorkList(params);
                    if (code === 0) {
                        this.coverList = data.list || [];
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 校验是否可以休息，弹出不同弹层内容
            async checkRest() {
                try {
                    const {
                        data: { code, msg, data }
                    } = await api.checkWorkRest(this.saveParams);
                    if (code === 0) {
                        this.popupType = data.popupType;
                        this.surplusOrderNum = data.surplusOrderNum;
                        if (data.popupType === '0') {
                            this.saveStatus();
                        } else {
                            switch (this.popupType) {
                                case '1':
                                    this.getCoverOptions();
                                    this.errMsg = '设置失败，出勤天数不符合出勤规则';
                                    this.windowType = '1';
                                    break;
                                case '2':
                                    this.getCoverOptions();
                                    this.errMsg = '设置失败，出勤天数不符合出勤规则';
                                    this.windowType = data.surplusOrderNum === '0' ? '3' : '2';
                                    break;
                                case '3':
                                    this.errMsg = '设置失败，当日可休息人数已满！若需要休息请协调其他人出勤';
                                    this.windowType = '4';
                                    break;
                                case '4':
                                    this.errMsg = '设置后咨询师预计每日上户量会大于最大承接量，确认要设置为休息吗？';
                                    this.windowType = '5';
                                    break;
                                case '5':
                                    this.getCoverOptions();
                                    this.errMsg = '设置失败，高老咨询师可休息两天名额已满！';
                                    this.windowType = '6';
                                    break;
                                default:
                                    this.errMsg = '';
                                    break;
                            }
                            this.isLeave = '1';
                            this.coverWorker = '';
                            this.dialogShow = true;
                            commonFun.setTrack(
                                '8157',
                                this.trackCommon.info,
                                {
                                    window_type: this.windowType
                                },
                                this.trackCommon.backendApi
                            );
                        }
                    } else {
                        this.$message.error(msg);
                        this.resetWeekStatus();
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 弹层关闭
            close() {
                this.dialogShow = false;
                this.resetWeekStatus();
            },
            // 弹窗点击确定休息
            saveRest() {
                if (this.popupType === '4') {
                    // 第5个弹窗直接设置为休息
                    this.saveStatus();
                } else if (this.popupType === '1' || this.popupType === '2' || this.popupType === '5') {
                    if (this.isLeave === '2') {
                        // 不需要请假
                        this.close();
                    } else {
                        // 第三个弹窗不需要判断代班咨询师
                        if (this.popupType === '2' && this.surplusOrderNum === '0') {
                            this.saveStatus();
                        } else {
                            // 第1，2，6个弹层需要判断是否填了代班咨询师
                            if (!this.coverWorker) {
                                this.$message.error('请选择代班咨询师');
                                return false;
                            } else {
                                this.saveStatus(this.coverWorker);
                            }
                        }
                    }
                }
            },
            /**
             * 保存出勤休息的状态
             * @param {String} employeeId 代班咨询师ID
             */
            async saveStatus(employeeId) {
                try {
                    if (employeeId) {
                        this.saveParams.other_employee_id = employeeId;
                    }
                    const {
                        data: { code, msg, data }
                    } = await api.changeWorkRest(this.saveParams);
                    if (code === 0) {
                        commonFun.setTrack(
                            '8155',
                            this.trackCommon.info,
                            {
                                adviser_id: this.currentEmployeeId,
                                status_before_change: this.currentRealStatus,
                                status_after_change: data.work_status,
                                week: this.saveParams.work_day
                            },
                            this.trackCommon.backendApi
                        );
                        this.dialogShow = false;
                        this.getList(1);
                    } else {
                        this.$message.error(msg);
                        this.resetWeekStatus(this.saveParams.work_status);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 切换出勤状态时遇到取消或者请求错误等情况，重置下拉状态
             * @param {String} status 切换保存失败时请求的状态
             */
            resetWeekStatus(status) {
                let week = this.saveParams.work_day;
                if (status && status === '1') {
                    // 保存为出勤时出错，状态设置为休息
                    this.tableList[this.currentIndex][week].status = '2';
                } else {
                    // 检验休息等其他错误时，重置状态未出勤
                    this.tableList[this.currentIndex][week].status = '1';
                }
            },
            // 倒计时秒数转为信息 时分秒展示
            formatSeconds() {
                if (this.countDown <= 0) {
                    return false;
                }
                this.secondTime = parseInt(this.countDown); // 秒
                if (this.secondTime > 60) {
                    // 获取分钟，除以60取整数，得到整数分钟
                    this.minuteTime = parseInt(this.secondTime / 60);
                    // 获取秒数，秒数取佘，得到整数秒数
                    this.secondTime = parseInt(this.secondTime % 60);
                    // 如果分钟大于60，将分钟转换成小时
                    if (this.minuteTime > 60) {
                        // 获取小时，获取分钟除以60，得到整数小时
                        this.hourTime = parseInt(this.minuteTime / 60);
                        // 获取小时后取佘的分，获取分钟除以60取佘的分
                        this.minuteTime = parseInt(this.minuteTime % 60);
                    }
                }
            },
            // 倒计时
            runDown() {
                --this.countDown;
                --this.secondTime;
                if (this.secondTime < 0) {
                    --this.minuteTime;
                    this.secondTime = 59;
                }
                if (this.minuteTime < 0) {
                    --this.hourTime;
                    this.minuteTime = 59;
                }
                if (this.hourTime < 0) {
                    this.secondTime = 0;
                    this.minuteTime = 0;
                    this.hourTime = 0;
                }
                if (this.countDown < 0) {
                    clearInterval(this.time);
                }
            }
        },
        created() {
            // 获取列表
            this.getList(1).then(() => {
                commonFun.setTrack('8154', this.trackCommon.info, {}, this.trackCommon.backendApi);
            });
        }
    };
</script>

<style lang="less" scoped>
.v-box {
    background: #fff;
    padding: 20px;
    .main-title {
        font-weight: bold;
        font-size: 16px;
        padding-bottom: 20px;
    }
    .search-box {
        .s-query li {
            .th {
                width: auto;
            }
            .td {
                padding-right: 20px;
                .el-select {
                    width: 100%;
                }
            }
        }
    }
    .statistics-box {
        background: #f8f8f8;
        padding: 10px 0 10px 20px;
        border: 1px solid #eee;
        margin-bottom: 20px;
        .s-query {
            li {
                width: auto;
                padding-right: 50px;
                margin: 0;
                &.pull-right {
                    float: right;
                }
            }
        }
    }
    .table-box {
        .table-count {
            margin-bottom: 10px;
        }
        .sub-title {
            line-height: 1.4;
            padding: 5px 0;
        }
        .red-color {
            color: red;
        }
        .search-select {
            display: block;
            padding: 0;
            /deep/ .el-input {
                padding-left: 0;
                padding-right: 0;
            }
            /deep/ .el-select {
                padding-left: 0;
                padding-right: 0;
                display: block;
            }
        }
    }
    .pagination {
        text-align: center;
        margin-top: 10px;
    }
    .change-state-box {
        position: relative;
        .selected-info {
            position: absolute;
            z-index: 1;
            background: #fff;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            max-height: 38px;
            line-height: 20px;
            left: 2px;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            text-align: left;
            padding-left: 5px;
            font-size: 12px;
            cursor: pointer;
        }
    }
}
.rest-dialog {
    .body-box {
        .err-msg {
            text-align: center;
            padding-bottom: 20px;
            margin-top: -10px;
        }
        .is-leave-box {
            padding-bottom: 20px;
        }
        .work-select-box {
            padding-top: 10px;
        }
        .err-info-ul {
            padding-left: 20px;
            padding-top: 20px;
            margin-bottom: 20px;
            li {
                list-style: decimal;
            }
        }
    }
}
</style>