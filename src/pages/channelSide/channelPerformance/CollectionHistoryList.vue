<!--
 * @author: hewei
 * @Date: 2021-05-14 16:06:07
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 11:45:42
 * @description: 成交单回款历史记录列表页面
-->
<template>
    <div class="collection-history-list">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>成交单回款历史记录</el-breadcrumb-item>
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
                prop="cityId"
                label="地理城市："
            >
                <el-select
                    clearable
                    v-model="contractForm.cityId"
                    filterable
                >
                    <el-option
                        v-for="item in cityList"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="belongBD"
                label="所属拓展："
            >
                <search-select-radio
                    v-model="contractForm.belongBD"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oBelongResident"
                >
                </search-select-radio>
            </el-form-item>

            <el-form-item
                prop="belongResident"
                label="所属驻场："
            >
                <search-select-radio
                    v-model="contractForm.belongResident"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oBelongResident"
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
                        导出长账龄数据
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
                            prop="create_datetime"
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
                            prop="deal_id"
                            label="成交ID"
                            align="center"
                        >
                            <template #default="{ row }">
                                <a
                                    class="a-link"
                                    :href="row.deal_url"
                                >{{row.deal_id}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sign_datetime"
                            label="网签日期"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contract_id"
                            label="合同ID"
                            class-name="more-info-td"
                            width="110px"
                            align="center"
                        >
                            <template #default="{ row }">
                                <a
                                    class="a-link"
                                    :href="row.contract_url"
                                >{{row.contract_id}}</a>
                            </template>
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
                            prop="expand"
                            label="所属拓展"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="resident"
                            label="所属驻场"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="forecast_payment_total"
                            label="合同预测总金额"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="reviewed_actual_money"
                            label="已回款金额"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="no_payment_money"
                            label="未回款金额"
                            align="center"
                        >
                        </el-table-column>
                    </el-table>
                </template>
            </table-pagination>
        </div>
        <export-dialog
            title="导出长账龄数据"
            :visible.sync="showExport"
            :data-range-ops="approveDialog.dataRangeOps"
            :range-val="approveDialog.rangeVal"
            :city-val="approveDialog.cityVal"
            :city-ops="approveDialog.cityOps"
            @confirmExport="confirmExport"
            @cancelExport="clearExportDlg"
        />
    </div>
</template>

<script>
    import globalApi from '@/api/commonApi';
    import cApi from './api/common';
    import api from './api/collectionHistory';
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
                    // 城市
                    cityId: '',
                    // 所属拓展
                    belongBD: '',
                    // 所属驻场
                    belongResident: '',
                    // 合作方式
                    cooperateType: '',
                },
                // 合作方式
                cooperateTypeOps: [],

                // 分页
                pages: {
                    curPage: 1,
                    total: 0,
                },
                // 	是否可以编辑跟进人
                canExportStatus: false,
                tableLoading: false,
                // 表格数据
                tableList: [],
                // 城市下拉
                cityList: [],
                // 导出弹窗展示隐藏状态
                showExport: false,
                // 导出弹窗相关字段
                approveDialog: {
                    // 弹窗城市默认值
                    cityVal: [],
                    // 范围默认值
                    rangeVal: [],
                    // 城市下拉对象
                    cityOps: [],
                    // 范围下拉对象
                    dataRangeOps: [],
                },
            };
        },
        created() {
            // 所属拓展远程组件参数
            // 所属驻场远程组件参数
            this.oBelongResident = {
                api: globalApi.getStaffList,
                params: {
                    q: '',
                    status: 0,
                    role: 'all',
                },
            };
        },
        mounted() {
            // 获取初始化信息
            this.getInitInfo();
            // 获取城市下拉信息
            this.getCityListInfo();
        },
        methods: {
            // 日期变化公共方法
            dateChange,
            // 搜索前校验
            getDataByOptions,
            /**
             * 导出方法
             * @param {Array} param.cityId 城市id集合
             * @param {Array} param.dataRange 范围值集合
             */
            async confirmExport({ cityId, dataRange }) {
                const newData = {
                    city_id: cityId.join(','),
                    business_datetime: dataRange.join(','),
                };
                const base = '/backend-api/expand/ex-payment-record/export';
                const exportUrl = `${base}?${qs.stringify(newData)}`;
                this.showExport = false;
                this.clearExportDlg();
                location.href = exportUrl;
            },
            // 获取初始化信息
            async getInitInfo() {
                try {
                    let {
                        data: { code, data, msg },
                    } = await api.getExPaymentRecordInit();
                    if (code === 0) {
                        // 存储一份数据
                        this.backupInitData = { ...data };
                        // 合作方式
                        this.cooperateTypeOps = Object.freeze(data.cooperate_type);

                        // 城市下拉数据
                        this.approveDialog.cityOps = Object.freeze(data.city_list);
                        this.approveDialog.cityVal = data.city_id;
                        // 时间范围下拉数据
                        this.approveDialog.dataRangeOps = Object.freeze(data.month);
                        this.approveDialog.rangeVal = data.business_datetime;
                        // 是否可导出
                        this.canExportStatus = data.is_export == 1;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 重置导出弹窗数据
            resetExportDlg() {
                const data = this.backupInitData;
                this.approveDialog.cityVal = data.city_id;
                this.approveDialog.rangeVal = data.business_datetime;
            },
            // 清空导出弹窗数据
            clearExportDlg() {
                this.approveDialog.cityVal = [];
                // 时间范围下拉数据
                this.approveDialog.rangeVal = [];
            },
            // 获取城市下拉数据
            async getCityListInfo() {
                try {
                    const params = {
                        type: 2,
                        param: 'withAll',
                    };
                    let {
                        data: { code, data, msg },
                    } = await cApi.getCityList(params);
                    if (code === 0) {
                        this.cityList = Object.freeze(data);
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
                        city_id: contractForm.cityId,
                        time_min: contractForm.monthRange[0],
                        time_max: contractForm.monthRange[1],
                        expand: contractForm.belongBD,
                        resident: contractForm.belongResident,
                        cooperate_type: contractForm.cooperateType,
                    };
                    let {
                        data: { code, data, msg },
                    } = await api.getExPaymentRecordList(params);
                    this.tableLoading = false;
                    if (code === 0) {
                        this.tableList = data.list;
                        this.pages.total = +data.count;
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
.collection-history-list {
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