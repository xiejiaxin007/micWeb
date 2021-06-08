<!--
 * @author: kangxue
 * @Date: 2020-09-03 19:33:31
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-24 11:30:13
 * @description: 提报管理列表
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>提报管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="main-title">提报管理</div>
            <div class="order-search">
                <!--查询搜索-->
                <ul class="s-query clearfix">
                    <li>
                        <div class="th">提报城市：</div>
                        <div class="td">
                            <select-city v-model="search.city"
                                filterable
                                class="select-city"
                                :showMore="false"></select-city>
                        </div>
                    </li>
                    <li class="long-width">
                        <div class="th">提报开始时间：</div>
                        <div class="td">
                            <el-date-picker v-model="search.date"
                                type="daterange"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">优惠类型：</div>
                        <div class="td">
                            <el-select v-model="search.discountsType"
                                clearable
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
                        <div class="th">提报状态：</div>
                        <div class="td">
                            <el-select v-model="search.status"
                                clearable
                                placeholder="请选择提报状态">
                                <el-option v-for="item in statusList"
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
                                    <el-upload v-if="leadInAuth"
                                        ref="uploadBtn"
                                        class="upload-file"
                                        action
                                        :http-request="beforeUpdata"
                                        :show-file-list="false">
                                        <el-button type="primary">导入模板</el-button>
                                    </el-upload>
                                    <el-button type="primary"
                                        v-if="createAuth"
                                        @click="add">新增</el-button>
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
                            :header-cell-style="tableHeaderColor">
                            <el-table-column min-width="60"
                                prop="id"
                                label="提报ID"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="150"
                                prop="name"
                                label="提报名称"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover placement="top"
                                        width="300"
                                        trigger="hover"
                                        :content="scope.row.name">
                                        <div class="tooltip-text"
                                            slot="reference">{{scope.row.name}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200"
                                prop="submission_citys"
                                label="提报城市"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover placement="top"
                                        width="300"
                                        trigger="hover"
                                        :content="scope.row.submission_citys | arrayToString">
                                        <div class="tooltip-text"
                                            slot="reference">{{scope.row.submission_citys | arrayToString}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="promotion_type"
                                label="优惠类型"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.promotion_type | arrayToString}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="170"
                                label="提报时间"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.start_time}}-{{scope.row.end_time}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="manager"
                                label="负责人"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="target_value"
                                label="完成进度"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.submission_num}}/{{scope.row.target_value}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="submission_status"
                                label="提报状态"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                label="操作"
                                align="center">
                                <template slot-scope="scope">
                                    <div class="btn-list">
                                        <el-button type="text"
                                            v-if="scope.row.stop_button_auth"
                                            size="small"
                                            @click="stop(scope.row.id, scope.row.submission_type)">终止</el-button>
                                        <router-link :to="{ path: '/activity/activityList', query: { id: scope.row.id, type: scope.row.submission_type }}"
                                            v-if="scope.row.view_button_auth">
                                            <el-button type="text"
                                                size="small">查看</el-button>
                                        </router-link>
                                    </div>
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
            </div>
        </div>
        <!-- 二次确认弹层 -->
        <confirm-dialog content="终止后不可恢复，提报内容作废，请谨慎操作！"
            confirmBtn="确认终止"
            :visible="stopVisible"
            @cancel="stopVisible = false"
            @confirm="confirmAlert"></confirm-dialog>
        <!-- 新增提报 -->
        <add-report-dialog :visible="addVisible"
            :report-type-list="reportTypeList"
            @cancel="addVisible = false"
            @confirm="confirmAdd"></add-report-dialog>
    </div>
</template>

<script>
import api from './api/api';
import commonApi from '@/api/commonApi';
import { ConfirmDialog } from '@/components';
import AddReportDialog from './components/AddReport';
import SelectCity from '@/components/SelectCity';
export default {
    name: 'report-list',
    components: {
        ConfirmDialog,
        AddReportDialog,
        SelectCity
    },
    data() {
        return {
            // 搜索字段
            search: {
                // 提报城市
                city: [],
                // 提报时间
                date: [],
                // 优惠类型
                discountsType: '',
                // 提报状态
                status: ''
            },
            // 城市列表
            cityList: [],
            // 优惠类型下拉
            discountsTypeList: [],
            // 提报状态下拉
            statusList: [],
            // 提报类型下拉
            reportTypeList: [],
            // 城市远程下拉
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll,noAll'
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
            // 要终止的提报的ID
            currentId: '',
            // 要终止的提报的类型
            currentType: '',
            // 终止弹层展示
            stopVisible: false,
            // 创建权限
            createAuth: true,
            // 导入权限
            leadInAuth: true,
            // 新增提报弹窗
            addVisible: false
        };
    },
    mounted() {
        // 获取初始数据
        this.searchData(1);
    },
    filters: {
        /**
         * @description: 数组改为字符串展示
         * @param {Array} val  要展示的数组
         * @return {type}
         */
        arrayToString(val) {
            let obj = '';
            if (val && val.length > 0) {
                obj = val.join('，');
            }
            return obj;
        }
    },
    methods: {
        /**
         * 点击搜索
         * @param {string} page 页码
         */
        async searchData(page) {
            // 一天的毫秒数
            const milliscond = 24 * 60 * 60 * 1000;
            // 如果没有时间参数，就默认返回最近半年
            if (this.search.date.length === 0) {
                let date = new Date();
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                this.$set(this.search.date, '0', date.getTime() - milliscond * 90);
                this.$set(this.search.date, '1', date.getTime() + milliscond * 90);
            }
            if (this.search.date.length > 0 && (this.search.date[1] - this.search.date[0]) / milliscond > 180) {
                this.$message.error('最多可搜索180天的提报时间的数据');
                return false;
            }
            if (page) {
                this.currentPage = page;
            }
            try {
                this.loading = true;
                let params = {
                    page: this.currentPage,
                    city_ids: this.search.city,
                    promotion_type: this.search.discountsType,
                    start_time: this.search.date.length > 0 ? this.search.date[0] / 1000 : '',
                    // 结尾时间加23:59:59
                    end_time: this.search.date.length > 0 ? (this.search.date[1] + milliscond - 1000) / 1000 : '',
                    submission_status: this.search.status
                };
                const {
                    data: { code, msg, data }
                } = await api.getReportList(params);
                if (code === 0) {
                    this.tableList = data.data;
                    this.totalNum = data.total_num ? parseInt(data.total_num) : '0';
                    this.loading = false;
                    this.leadInAuth = data.import_excel_btn;
                    this.createAuth = data.add_submission_btn;
                    if (page === 1) {
                        this.statusList = data.config.submission_status;
                        this.reportTypeList = data.config.submission_type;
                        this.discountsTypeList = data.config.promotion_type;
                    }
                } else {
                    this.$message.error(msg);
                    this.loading = false;
                }
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        // 点击重置
        resetSearch() {
            this.search = {
                city: '',
                date: [],
                discountsType: '',
                status: ''
            };
            this.searchData(1);
        },
        // 表格翻页
        pageChange() {
            this.searchData();
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        },
        // 新增
        add() {
            this.addVisible = true;
        },
        // 新增提报后返回父组件，更新列表
        confirmAdd() {
            this.addVisible = false;
            this.searchData(1);
        },
        /**
         * 导入文件前校验
         * @param {Object} file 文件
         */
        beforeUpdata(file) {
            // 文件大小限制
            let isLt20M = file.file.size / 1024 / 1024 <= 20;
            let excelfileExtend = '.xlsx';
            let fileExtend = file.file.name.substring(file.file.name.lastIndexOf('.')).toLowerCase();
            if (excelfileExtend.indexOf(fileExtend) === -1) {
                this.$message.error(`只能上传${excelfileExtend}格式文件！`);
                return;
            } else if (!isLt20M) {
                this.$message.error('文件大小不超过20M！');
                return;
            }
            // 转换excel文件
            let fileR = new FileReader();
            fileR.readAsDataURL(file.file);
            fileR.onload = () => {
                let excelBase64Str = fileR.result;
                this.importExcelFile(excelBase64Str);
            };
        },
        /**
         * 批量导入文件
         * @param {string} excelBase64Str excel数据流
         */
        async importExcelFile(excelBase64Str) {
            excelBase64Str = excelBase64Str.substring(excelBase64Str.indexOf(',') + 1);
            try {
                let params = {
                    file_data: excelBase64Str
                };
                let { data } = await api.importReport(params);
                if (data.code === 0) {
                    this.$message(data.msg);
                    this.searchData(1);
                } else {
                    this.$message.error(data.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 终止提报
         * @param {string} id   提报ID
         * @param {string} type   提报类型
         * @return {type}
         */
        stop(id, type) {
            this.currentId = id;
            this.currentType = type;
            this.stopVisible = true;
        },
        // 二次确认弹窗点击继续
        async confirmAlert() {
            try {
                let params = {
                    id: this.currentId,
                    submission_type: this.currentType
                };
                const {
                    data: { code, msg }
                } = await api.stopReport(params);
                if (code === 0) {
                    this.stopVisible = false;
                    this.$message({
                        message: '终止成功',
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
.main-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.container-box {
    .s-query {
        li.long-width {
            width: 500px;
        }
    }
    .select-city {
        width: 100%;
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
            .upload-file {
                display: inline-block;
                margin-right: 20px;
            }
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
</style>
