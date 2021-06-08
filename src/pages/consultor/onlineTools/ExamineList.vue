<!--
 * @Name: 线上带看审核
 * @Description: 线上带看审核
 * @Author: wangxue
 * @Date: 2020-2-24
 -->
<template>
    <div class="examine-box">
        <div class="el-row">
            <el-col
                :span="24"
                class="content-main"
            >
                <el-breadcrumb
                    class="bread-crumb-box"
                    separator-class="el-icon-arrow-right"
                >
                    <el-breadcrumb-item>
                        <a href="/">首页</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>线上带看审核</el-breadcrumb-item>
                </el-breadcrumb>
                <!--搜索区域-->
                <div class="v-box form-table-box">
                    <div class="hd">
                        <h2>线上带看审核</h2>
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
                                            filterable
                                            placeholder="请选择"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in cityList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">带看咨询师：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="employeeId"
                                            filterable
                                            placeholder="请选择"
                                            remote
                                            :remote-method="getEmployeeList"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in employeeList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li v-if="this.trackCommon.info.role === 'admin'">
                                    <div class="th">咨询主管：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="employeeManager"
                                            filterable
                                            placeholder="请选择"
                                            remote
                                            :remote-method="getEmployeeManagerList"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in employeeManagerList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">订单号：</div>
                                    <div class="td">
                                        <el-input
                                            v-model="orderId"
                                            type="text"
                                            clearable
                                        ></el-input>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">审核状态：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="examineState"
                                            filterable
                                            placeholder="请选择"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in examineStateList"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">带看Id：</div>
                                    <div class="td">
                                        <el-input
                                            type="text"
                                            v-model="leadOnlineId"
                                            clearable
                                        ></el-input>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">带看时间：</div>
                                    <div class="td">
                                        <el-date-picker
                                            v-model="leadOnlineTime"
                                            clearable
                                            :default-time="['00:00:00', '23:59:59']"
                                            class="form-date-range-box"
                                            type="datetimerange"
                                            value-format="timestamp"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                        >
                                        </el-date-picker>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="btn-area">
                            <el-button @click="resetSearch">重置</el-button>
                            <el-button
                                type="primary"
                                @click="doSearch(1)"
                            >搜索</el-button>
                        </div>
                    </div>
                </div>
                <!--表格展示区域-->
                <div class="v-box form-table-box examine-table-box">
                    <div class="bd">
                        <div class="search-result">
                            <div class="data-stat">
                                <el-row>
                                    <el-col :span="10">
                                        当前共有{{total}}条数据
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="table-wrap-box">
                                <el-table
                                    ref="tableFixedWrap"
                                    border
                                    :data="tableList"
                                    v-loading="tbLoading"
                                    size="small"
                                    row-class-name="row"
                                    cell-class-name="column"
                                    :highlight-current-row="true"
                                    :header-cell-style="tableHeaderColor"
                                >
                                    <el-table-column
                                        min-width="80"
                                        prop="city_name"
                                        label="城市"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="80"
                                        prop="see_employee_realname"
                                        label="带看咨询师"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="80"
                                        prop="see_employee_leader_realname"
                                        label="咨询主管"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="80"
                                        prop="order_id"
                                        label="订单"
                                    >
                                        <template slot-scope="scope">
                                            <a
                                                :href= scope.row.order_detail_url
                                                target="_blank"
                                                class="order-id-box"
                                            >{{scope.row.order_id}}
                                            </a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        min-width="80"
                                        prop="see_project_id"
                                        label="带看"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="projects"
                                        label="带看楼盘顺序"
                                    >
                                        <template slot-scope="scope">
                                            <div class="projects">
                                                <p
                                                    v-for="(project, index) in scope.row.projects"
                                                    :key="index">
                                                    {{index+1}}. {{project}}
                                                </p>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        min-width="120"
                                        prop="plan_real_begin_datetime"
                                        label="带看时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="80"
                                        prop="audit_result_str"
                                        label="审核状态"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="100"
                                        prop="operate"
                                        label="操作"
                                    >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="text"
                                                size="medium"
                                                @click="examineFun(scope.row)"
                                            >审核</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="pagination">
                                <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    :page-size="pageLimit"
                                    hide-on-single-page
                                    :current-page.sync="page"
                                    @current-change="pageChange"
                                    :total="total"
                                >
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </div>
        <!-- 线上带看审核弹窗 -->
        <el-dialog
            title="线上带看审核"
            :visible.sync="examineDialog"
            width="420px"
            center
        >
            <div class="dialog-body">
                <el-radio
                    v-model="pass"
                    label="2"
                >审核通过</el-radio>
                <el-radio
                    v-model="pass"
                    label="3"
                >审核不通过</el-radio>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="examineDialog=false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmExamine"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import onlineToolsApi from './api/onlineToolsApi';
    import { mapState } from 'vuex';
    import {
        getCity,
        getPageEmployee
    } from '@/api/commonApi';
    export default {
        name: 'examine',
        data() {
            return {
                // 城市
                cityId: '',
                // 城市列表
                cityList: [],
                // 咨询师id
                employeeId: '',
                // 咨询师列表
                employeeList: [],
                // 咨询主管
                employeeManager: '',
                // 咨询主管列表
                employeeManagerList: [],
                // 订单id
                orderId: '',
                // 审核状态
                examineState: '',
                // 审核状态列表
                examineStateList: [],
                // 带看id
                leadOnlineId: '',
                // 带看时间
                leadOnlineTime: [],
                // 表格总条数
                total: 0,
                // 表格数据
                tableList: [],
                // 当前页数
                page: 1,
                // 每页数据条数
                pageLimit: 20,
                // 表格加载loading
                tbLoading: false,
                // 审核弹窗
                examineDialog: false,
                // 审核通过/不通过
                pass: '',
                // 操作行数据
                opearationObj: ''
            };
        },
        created() {
            // 获取城市下拉
            this.getCityList();
            this.doSearch(1);
            console.log(this.trackCommon.info.role)
        },
        methods: {
            // 获取城市下拉
            async getCityList() {
                let params = {};
                try {
                    let { data } = await getCity(params);
                    if (data.code === 0) {
                        this.cityList = data.data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * @description: 获取咨询师下拉
             * @param {String} q 搜索内容
             * @return: Promise
             */
            async getEmployeeList(q) {
                let params = {
                    q,
                    role: 'header',
                    status: '1'
                };
                let obj = this.trackCommon.info;
                // 如果是咨询师主管，能看到自己组内咨询师数据
                if (obj.role === 'header_manager') {
                    params.header_manager_id = obj.login_employee_id;
                } else if (this.postNum === '4') {
                    // 城市经理可看到自己城市的咨询师
                    params.city_id = obj.city_id;
                }
                try {
                    const { data } = await getPageEmployee(params);
                    if (data.code === 0) {
                        this.employeeList = data.data.list;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 获取咨询师主管下拉
            async getEmployeeManagerList(q) {
                let params = {
                    q: q,
                    role: 'header_manager',
                    status: '1'
                };
                if (this.postNum === '4') {
                    // 城市经理可看到自己城市的咨询师
                    params.city_id = this.trackCommon.info.city_id;
                }
                try {
                    let { data } = await getPageEmployee(params);
                    if (data.code === 0) {
                        this.employeeManagerList = data.data.list;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 重置搜索项
            resetSearch() {
                // 重置form表单
                this.cityId = '';
                this.employeeId = '';
                this.employeeManager = '';
                this.orderId = '';
                this.examineState = '';
                this.leadOnlineId = '';
                this.leadOnlineTime = [];
                // 重新请求
                this.doSearch(1);
            },
            /**
             * 点击搜索进行数据筛选
             * @param {Number} pagePara 当前点击的第几页
             */
            async doSearch(pagePara) {
                this.page = pagePara ? parseInt(pagePara) : this.page;
                // 设置loading
                this.tbLoading = true;
                let params = {
                    page: this.page,
                    page_size: this.pageLimit,
                    city_id: this.cityId,
                    see_employee_id: this.employeeId,
                    see_employee_leader_id: this.employeeManager,
                    order_id: this.orderId,
                    see_project_id: this.leadOnlineId,
                    see_project_time_start:
                        this.leadOnlineTime.length > 0
                            ? this.leadOnlineTime[0] / 1000
                            : '',
                    see_project_time_end:
                        this.leadOnlineTime.length > 1
                            ? this.leadOnlineTime[1] / 1000
                            : '',
                    status: this.examineState
                };
                try {
                    let { data } = await onlineToolsApi.auditList(params);
                    if (data.code === 0) {
                        // 关闭loading
                        this.tbLoading = false;
                        this.total = parseInt(data.data.total_records);
                        this.tableList = data.data.list;
                        this.examineStateList = data.data.audit_status;
                    } else {
                        // 关闭loading
                        this.tbLoading = false;
                    }
                } catch (error) {
                    console.log(error);
                    // 关闭loading
                    this.tbLoading = false;
                }
            },
            /**
             * 点击审核
             * @param {Object} row 操作行
             */
            async examineFun(row) {
                this.examineDialog = true;
                this.opearationObj = row;
                this.pass = row.audit_result;
            },
            /**
             * 审核确认
             * @param {Object} id 列表记录id
             */
            async confirmExamine() {
                // 设置loading
                this.tbLoading = true;
                let params = {
                    id: this.opearationObj.id,
                    pass: this.pass
                };
                try {
                    let { data } = await onlineToolsApi.doAudit(params);
                    if (data.code === 0) {
                        // 关闭loading
                        this.examineDialog = false;
                        this.$message(data.msg);
                        this.tbLoading = false;
                        this.doSearch();
                    } else {
                        // 关闭loading
                        this.tbLoading = false;
                        this.$message(data.msg);
                    }
                } catch (error) {
                    console.log(error);
                    // 关闭loading
                    this.tbLoading = false;
                }
            },
            /**
             * 表格翻页
             * @param {Number} page 当前点击的第几页
             */
            pageChange(page) {
                // 分页请求
                this.doSearch(page);
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #f9f9f9;color: #333;';
                }
            }
        },
        computed: {
            // ...mapState(['trackCommon'])
            ...mapState({
                trackCommon: state => state.trackCommon,
                postNum: state => state.postNum
            })
        },
        watch: {
            // 监听postNum可区分admin是否为城市经理，若postNum是4则是城市经理
            postNum: {
                handler: function (val, oldval) {
                    // 获取咨询师下拉
                    this.getEmployeeList();
                    // 获取咨询师主管下拉
                    this.getEmployeeManagerList();
                },
                deep: true
            }
        }
    };
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
.data-stat {
    overflow: hidden;
    padding: 10px 0 20px;
    font-size: 14px;
}
.projects {
    text-align: left;
}
</style>
<style lang="less" scoped>
.examine-box {
    padding: 0 20px 30px;
}
.examine-table-box {
    /deep/.el-table {
        th {
            .cell {
                font-size: 14px;
                color: #333;
                text-align: center;
                font-weight: normal;
            }
        }
        td {
            .cell {
                font-size: 14px;
                color: #333;
                text-align: center;
                font-weight: normal;
            }
        }
        .order-id-box {
            color: #409EFF;
        }
    }
    .pagination {
        text-align: center;
        padding: 20px 0;
        background: #fff;
    }
}
</style>
