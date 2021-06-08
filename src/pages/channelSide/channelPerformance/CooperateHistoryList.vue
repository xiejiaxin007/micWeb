<!--
 * @author: hewei
 * @Date: 2021-05-14 09:36:34
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 17:13:51
 * @description: 合作楼盘历史记录列表页面
-->
<template>
    <div class="cooperate-history-list">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>合作楼盘历史记录</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单搜索部分-->
        <el-form
            :model="contractForm"
            ref="contractForm"
            class="contract-form"
            size="small"
            label-width="114px"
            :inline="true"
        >
            <el-form-item
                prop="monthRange"
                label="记录月份："
            >
                <el-date-picker
                    v-model="contractForm.monthRange"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    value-format="yyyy-MM"
                    @change="valArr => dateChange(valArr, 3)"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item
                prop="projectId"
                label="楼盘名称："
            >
                <search-select-radio
                    v-model="contractForm.projectId"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oProject"
                >
                </search-select-radio>
            </el-form-item>

            <el-form-item
                prop="cooperateType"
                label="合作方式："
            >
                <el-select
                    clearable
                    v-model="contractForm.cooperateType"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in cooperateTypeOps"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item
                prop="contractFollower"
                label="合同跟进人："
            >
                <search-select-radio
                    v-model="contractForm.contractFollower"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oCreater"
                >
                </search-select-radio>
            </el-form-item>
            <el-form-item
                prop="markNew"
                label="标记新增："
            >
                <el-select
                    clearable
                    v-model="contractForm.markNew"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in markNewOps"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="form-item-center">
                <el-button @click="resetForm">
                    重置
                </el-button>
                <el-button
                    type="primary"
                    @click="getDataByOptions(getContractTableInfo)"
                >
                    搜索
                </el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrap-new">
            <table-pagination
                :total="pages.total"
                :page="pages.curPage"
                @pageChange="pageChange"
            >
                <template #btns>
                    <el-button
                        type="primary"
                        size="small"
                        v-if="canExportStatus"
                        @click="exportExcel"
                    >
                        导出新增楼盘数据
                    </el-button>
                </template>
                <template #table>
                    <el-table
                        ref="contractTable"
                        v-loading="tableLoading"
                        border
                        :data="tableList"
                        size="small"
                        :highlight-current-row="true"
                        :header-cell-style="{backgroundColor: '#f9f9f9', color: '#333'}"
                    >
                        <el-table-column
                            prop="record_date"
                            label="记录日期"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="city_name"
                            label="地理城市"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="project_id"
                            label="楼盘ID"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="project_name"
                            label="楼盘名称"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="合同ID"
                            class-name="more-info-td"
                            width="110px"
                            align="center"
                        >
                            <template #default="{ row }">
                                <a
                                    class="a-link"
                                    :href="row.contract_url"
                                >{{row.id}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="合作方"
                            prop="partner"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="合作方式"
                            prop="cooperate_type"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="direct_sign_type"
                            label="直签类型"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="follow_employee"
                            label="合同跟进人"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contract_begin_datetime"
                            label="合同开始时间"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contract_end_datetime"
                            label="合同结束时间"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contract_file_time"
                            label="合同归档时间"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="total_platform_sign_days"
                            label="累计天数（平台）"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="total_direct_sign_days"
                            label="累计天数（直签）"
                            align="center"
                        >
                        </el-table-column>
                    </el-table>
                </template>

            </table-pagination>
        </div>
        <export-dialog
            title="导出新增楼盘数据"
            :visible.sync="showExport"
            :data-range-ops="rangeData"
            :range-val="rangeVal"
            :city-val="approveDialog.cityVal"
            :city-ops="approveDialog.cityOps"
            hasDimension
            @changeDimension="changeDimension"
            @confirmExport="confirmExport"
            @cancelExport="clearExportDlg"
        />
    </div>
</template>

<script>
    import globalApi from '@/api/commonApi';
    import cApi from './api/common';
    import api from './api/cooperateHistory';
    import ExportDialog from './components/ExportDialog';
    import qs from 'qs';
    import { dateChange, getDataByOptions } from './utils/exportList';
    import { SearchSelectRadio, TablePagination } from '@/components';
    export default {
        name: 'CooperateHistoryList',
        components: {
            ExportDialog,
            SearchSelectRadio,
            TablePagination,
        },
        data() {
            return {
                // 筛选表单数据
                contractForm: {
                    monthRange: [],
                    // 楼盘名称
                    projectId: '',
                    // 合作方式
                    cooperateType: '',
                    // 合同跟进人：
                    contractFollower: '',
                    // 转直签状态
                    markNew: '',
                },
                // 合作方式
                cooperateTypeOps: [],

                // 标记新增
                markNewOps: [],
                // 分页
                pages: {
                    curPage: 1,
                    pageSize: 20,
                    total: 0,
                },
                // 	是否可以编辑跟进人
                canExportStatus: false,
                tableLoading: false,
                // 表格数据
                tableList: [],
                // 弹窗显示隐藏
                showExport: false,
                // 导出弹窗字段
                approveDialog: {
                    cityVal: [],
                    rangeVal: [],
                    rangeMonthVal: [],
                    cityOps: [],
                    dataRangeOps: [],
                    dataRangeMonth: [],
                },
                // 数据类型1是月份2是季度
                dimensionType: 1,
            };
        },
        computed: {
            // 数据范围
            rangeData() {
                return this.dimensionType === 1 ? this.approveDialog.dataRangeMonth : this.approveDialog.dataRangeOps;
            },
            rangeVal() {
                return this.dimensionType === 1 ? this.approveDialog.rangeMonthVal : this.approveDialog.rangeVal;
            },
        },
        created() {
            // 楼盘远程组件参数
            this.oProject = {
                api: cApi.getProjectAndType,
                params: {
                    q: '',
                },
            };
            // 合同创建人远程组件参数
            this.oCreater = {
                api: globalApi.getStaffList,
                params: {
                    q: '',
                    status: 0,
                    role: 'all',
                },
            };
        },
        mounted() {
            this.getInitInfo();
        },
        methods: {
            // 时间插件change处理函数
            dateChange,
            // 数据校验整合
            getDataByOptions,
            changeDimension(val) {
                this.dimensionType = val;
            },
            /**
             * 导出方法
             * @param {Array} param.cityId 城市id集合
             * @param {Array} param.dataRange 范围值集合
             * @param {String} param.dataDimension 类型是月份还是季度
             */
            async confirmExport({ cityId, dataDimension, dataRange }) {
                const newData = {
                    city: cityId.join(','),
                };
                // 月份
                if (dataDimension === 1) {
                    newData.month = dataRange.join(',');
                } else {
                    // 季度
                    newData.quater = dataRange.join(',');
                }
                const base = '/backend-api/expand/project-co/export';
                const exportUrl = `${base}?${qs.stringify(newData)}`;
                location.href = exportUrl;
                this.showExport = false;
                this.clearExportDlg();
            },
            // 获取初始化信息
            async getInitInfo() {
                try {
                    let {
                        data: { code, data, msg },
                    } = await api.cooperateListInit();
                    if (code === 0) {
                        this.backupInitData = data;
                        // 合作方式
                        this.cooperateTypeOps = Object.freeze(data.cooperate_type);
                        // 标记新增
                        this.markNewOps = Object.freeze(data.mark_new);
                        // 城市
                        this.approveDialog.cityOps = Object.freeze(data.city_list);
                        this.approveDialog.cityVal = data.default_city;
                        this.approveDialog.dataRangeOps = Object.freeze(data.quater);
                        this.approveDialog.rangeVal = data.default_quater;
                        this.approveDialog.dataRangeMonth = Object.freeze(data.month);
                        this.approveDialog.rangeMonthVal = data.default_month;
                        // 是否可导出
                        this.canExportStatus = data.can_export === 1;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取表格信息
            async getContractTableInfo() {
                try {
                    this.tableLoading = true;
                    const { contractForm, pages } = this;
                    const params = {
                        page: pages.curPage,
                        'per-page': pages.pageSize,
                        project_id: contractForm.projectId,
                        cooperate_type: contractForm.cooperateType,
                        follow_employee_id: contractForm.contractFollower,
                        record_month_start: contractForm.monthRange[0],
                        record_month_end: contractForm.monthRange[1],
                        mark_new: contractForm.markNew,
                    };
                    let {
                        data: { code, data, msg },
                    } = await api.getCooperateList(params);
                    this.tableLoading = false;
                    if (code === 0) {
                        this.tableList = data.list;
                        this.pages.total = data.total;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.tableLoading = false;
                    console.log(error);
                }
            },
            /**
             * @description 页码改变 获取最新数据
             * @param {Number} page 页码
             */
            pageChange(page) {
                this.pages.curPage = page;
                this.getContractTableInfo();
            },
            // 重置表单
            resetForm() {
                this.$refs.contractForm.resetFields();
                this.tableList = [];
                this.pages.total = 0;
                this.pages.curPage = 1;
            },
            // 导出表格
            exportExcel() {
                this.resetExportDlg();
                this.showExport = true;
            },
            // 重置导出弹窗
            resetExportDlg() {
                const data = this.backupInitData;
                this.approveDialog.cityVal = data.default_city;
                this.approveDialog.rangeVal = data.default_quater;
                this.approveDialog.rangeMonthVal = data.default_month;
            },
            // 清除弹窗值
            clearExportDlg() {
                this.approveDialog.cityVal = [];
                // 时间范围下拉数据
                this.approveDialog.rangeVal = [];
            },
        },
    };
</script>

<style lang="less" scoped>
/deep/ .el-table th.gutter {
    display: table-cell !important;
}
.a-link {
    color: #409eff;
}
.cooperate-history-list {
    padding: 0 30px;
}
.bread-nav {
    padding: 20px 0;
}
.contract-form {
    background-color: #fff;
    padding: 20px 0 10px;
    /deep/ .el-input {
        width: 200px;
    }
    .form-item-center {
        display: block;
        //margin-bottom: 0;
        text-align: center;
    }
    /deep/ .el-range-input {
        background-color: #fff;
    }
}
.table-wrap-new {
    margin-top: 10px;
}
.table-tools {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.pagination {
    margin: 20px auto;
}
</style>