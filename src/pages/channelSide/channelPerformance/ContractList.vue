<!--
 * @author: hewei
 * @Date: 2021-05-10 16:46:43
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 11:46:28
 * @description: 合同列表页
-->
<template>
    <div class="contract-list">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>合同列表页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单搜索部分-->
        <el-form
            :model="contractForm"
            ref="contractForm"
            class="contract-form"
            size="medium"
            label-width="114px"
            :inline="true"
        >
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
                        v-for="item in cityOps"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="projectId"
                label="楼盘ID:"
            >
                <jl-number-input
                    v-model="contractForm.projectId"
                    reg="number"
                    size="medium"
                >
                </jl-number-input>
            </el-form-item>
            <el-form-item
                prop="projectName"
                label="楼盘名称："
            >
                <search-select-radio
                    v-model="contractForm.projectName"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oProject"
                >
                </search-select-radio>
            </el-form-item>
            <el-form-item
                prop="contractId"
                label="合同ID:"
            >
                <jl-number-input
                    v-model="contractForm.contractId"
                    reg="number"
                    size="medium"
                >
                </jl-number-input>
            </el-form-item>
            <el-form-item
                prop="cooperater"
                label="合作方："
            >
                <search-select-radio
                    v-model="contractForm.cooperater"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oCooperater"
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
                prop="signType"
                label="直签类型："
            >
                <el-select
                    clearable
                    v-model="contractForm.signType"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in signTypeOps"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="contractCreater"
                label="合同创建人："
            >
                <search-select-radio
                    v-model="contractForm.contractCreater"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oCreater"
                >
                </search-select-radio>
            </el-form-item>
            <el-form-item
                prop="contractFollower"
                label="合同跟进人："
            >
                <search-select-radio
                    v-model="contractForm.contractFollower"
                    clearable
                    placeholder="请选择"
                    :apiInfo="oContractFollower"
                >
                </search-select-radio>
            </el-form-item>
            <el-form-item
                prop="startTime"
                label="合同开始时间："
            >
                <el-date-picker
                    v-model="contractForm.startTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item
                prop="endTime"
                label="合同结束时间："
            >
                <el-date-picker
                    v-model="contractForm.endTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item
                prop="transferSignStatus"
                label="转直签状态："
            >
                <el-select
                    clearable
                    v-model="contractForm.transferSignStatus"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in signStatusOps"
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
                    @click="searchListInfo()"
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
                        v-if="showEditFollowerStatus"
                        @click="editContractFollower"
                    >
                        批量修改合同跟进人
                    </el-button>
                </template>
                <template #table>
                    <el-table
                        ref="contractTable"
                        v-loading="tableLoading"
                        border
                        :data="tableList"
                        @selection-change="selectChange"
                        @sort-change="sortChange"
                        size="small"
                        :highlight-current-row="true"
                        :header-cell-style="{backgroundColor: '#f9f9f9', color: '#333'}"
                    >
                        <el-table-column
                            fixed="left"
                            type="selection"
                            align="center"
                            width="70"
                            v-if="showEditFollowerStatus"
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
                            prop="create_employee"
                            label="合同创建人"
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
                            sortable="custom"
                            align="center"
                            width="120"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contract_end_datetime"
                            sortable="custom"
                            label="合同结束时间"
                            align="center"
                            width="120"
                        >
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="110px"
                            fixed="right"
                            align="center"
                        >
                            <template #default="{row}">
                                <el-button
                                    v-if="row.can_apply === 1"
                                    @click="applyTurnSign(row.id)"
                                    size="small"
                                    type="text"
                                >
                                    申请转直签
                                </el-button>
                                <el-button
                                    v-if="row.can_see_detail === 1"
                                    @click="turnToPage(row.id)"
                                    type="text"
                                    size="small"
                                    class="btn-last"
                                >
                                    转直签详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

            </table-pagination>
        </div>
        <!--修改合同跟进人弹窗-->
        <change-employee-dialog
            :visible.sync="employeeDialogVisible"
            title="批量修改合同跟进人"
            label="新的跟进人"
            @confirm="handleChangeFollower"
            :apiInfo="oFollower"
        />
        <!--申请转直签弹窗-->
        <turn-sign-dialog
            :visible.sync="signDialogVisible"
            :id="contractId"
            @confirm="turnSignConfirm"
        />
    </div>
</template>

<script>
    import api from './api/contractList';
    import cApi from './api/common';
    import globalApi from '@/api/commonApi';
    import ChangeEmployeeDialog from './components/ChangeEmployeeDialog';
    import TurnSignDialog from './components/TurnSignDialog';
    import { SearchSelectRadio, TablePagination } from '@/components';
    export default {
        name: 'ContractList',
        components: {
            ChangeEmployeeDialog,
            TurnSignDialog,
            SearchSelectRadio,
            TablePagination,
        },
        data() {
            return {
                // 筛选表单数据
                contractForm: {
                    // 城市ID
                    cityId: '',
                    // 楼盘ID-1
                    projectId: '',
                    // 楼盘ID-2
                    projectName: '',
                    // 合同ID
                    contractId: '',
                    // 合作方
                    cooperater: '',
                    // 合作方式
                    cooperateType: '',
                    // 直签类型：
                    signType: '',
                    // 合同创建人：
                    contractCreater: '',
                    // 合同跟进人：
                    contractFollower: '',
                    // 合同开始时间
                    startTime: '',
                    // 合同结束时间
                    endTime: '',
                    // 转直签状态
                    transferSignStatus: '',
                },
                // 城市下拉数据
                cityOps: [],
                // 合作方式
                cooperateTypeOps: [],
                // 直签类型
                signTypeOps: [],
                // 直签状态
                signStatusOps: [],
                // 分页
                pages: {
                    curPage: 1,
                    pageSize: 20,
                    total: 0,
                },
                // 	是否可以编辑跟进人
                showEditFollowerStatus: false,
                tableLoading: false,
                // 表格数据
                tableList: [],
                // 已勾选的表格数据
                hasSelection: [],
                // 批量修改合同跟进人弹窗
                employeeDialogVisible: false,
                // 申请转直签弹窗状态
                signDialogVisible: false,
                // 合同id
                contractId: '',
            };
        },
        created() {
            this.getInitRemoteObj();
        },
        mounted() {
            this.getInitInfo();
            this.getContractTableInfo();
        },
        methods: {
            // 初始化远程组件参数对象
            getInitRemoteObj() {
                // 修改跟进人
                this.oFollower = {
                    api: globalApi.getStaffList,
                    params: {
                        q: '',
                        status: '1',
                        role: 'estate_expand',
                    },
                };
                // 楼盘远程组件参数
                this.oProject = {
                    api: cApi.getProjectAndType,
                    params: {
                        q: '',
                        city_id: 0,
                    },
                };
                // 合作方远程组件参数
                this.oCooperater = {
                    api: cApi.getSupplierList,
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
                // 合同跟进人远程组件参数
                this.oContractFollower = {
                    api: globalApi.getStaffList,
                    params: {
                        q: '',
                        status: 0,
                        role: 'all',
                    },
                };
            },
            /**
             * @description 排序事件处理
             * @param {String} prop 排序的字段
             * @param {String} order 排序：倒叙/正序
             */
            sortChange({ prop, order }) {
                const orderMap = {
                    // 正序
                    ascending: '1',
                    // 倒叙
                    descending: '2',
                    null: '',
                };
                const fieldMap = {
                    contract_begin_datetime: '1',
                    contract_end_datetime: '2',
                };
                // 获取字段排序值
                const fieldOrder = orderMap[order];
                this.getContractTableInfo(fieldMap[prop], fieldOrder);
            },
            // 搜索时重置页码为初始页码
            searchListInfo() {
                this.pages.curPage = 1;
                this.getContractTableInfo();
            },
            /**
             * @description 跳转合同详情页面
             * @param {String} id 合同id
             */
            turnToPage(id) {
                this.$router.push({
                    name: 'ApproveDetail',
                    query: {
                        id,
                    },
                });
            },
            // 获取初始化信息
            async getInitInfo() {
                try {
                    let {
                        data: { code, data, msg },
                    } = await api.getContractInit();
                    if (code === 0) {
                        this.cityOps = Object.freeze(data.city);
                        // 直签类型
                        this.signTypeOps = Object.freeze(data.direct_sign_type);
                        // 转直签状态
                        this.signStatusOps = Object.freeze(data.turn_direct_sign_status);
                        // 合作方式
                        this.cooperateTypeOps = Object.freeze(data.co_way);
                        // 是否可编辑跟进人
                        this.showEditFollowerStatus = data.can_edit_follow_employee === 1;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * @description 获取合同列表信息
             * @param {String} orderField 字段
             * @param {String} order 字段 1正序 2倒叙
             */
            async getContractTableInfo(orderField = '', order = '') {
                try {
                    this.tableLoading = true;
                    const { contractForm: forms, pages } = this;
                    const params = {
                        page: pages.curPage,
                        'per-page': pages.pageSize,
                        city_id: forms.cityId,
                        project_id: forms.projectId,
                        project_id_by_name: forms.projectName,
                        id: forms.contractId,
                        partner_id: forms.cooperater,
                        cooperate_type: forms.cooperateType,
                        direct_sign_type: forms.signType,
                        creator: forms.contractCreater,
                        follow_employee_id: forms.contractFollower,
                        contract_begin_datetime: forms.startTime,
                        contract_end_datetime: forms.endTime,
                        turn_direct_sign_status: forms.transferSignStatus,
                        order_field: orderField,
                        order,
                    };
                    let {
                        data: { code, data, msg },
                    } = await api.getContractList(params);
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
             * @description 多选事件
             * @param {Array} selection 选中的那一列数据对象
             */
            selectChange(selection) {
                this.hasSelection = selection;
            },
            // 批量修改合同跟进人
            editContractFollower() {
                if (this.hasSelection.length === 0) {
                    this.$message.warning('请选择合同');
                    return;
                }
                this.employeeDialogVisible = true;
            },
            /**
             * @description 修改合同跟进人成功后处理
             * @param {Object} data 数据对象
             */
            async handleChangeFollower(data) {
                try {
                    if (this.hasReq) {
                        return;
                    }
                    this.hasReq = true;
                    const params = {
                        employee_id: data.user,
                        id: this.hasSelection.map(ele => ele.id),
                    };
                    let {
                        data: { code, msg },
                    } = await api.updateFollowEmployeeInfo(params);
                    this.hasReq = false;
                    if (code === 0) {
                        // 成功后刷新当前页信息
                        this.$message.success('操作成功');
                        this.getContractTableInfo();
                        this.employeeDialogVisible = false;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.hasReq = false;
                    console.log(error);
                }
            },
            // 申请转直签
            applyTurnSign(id) {
                this.signDialogVisible = true;
                this.contractId = id;
            },
            /**
             * @description 页码改变 获取最新数据
             * @param {Number} page 页码
             */
            pageChange(page) {
                this.pages.curPage = page;
                this.getContractTableInfo();
            },
            // 重置
            resetForm() {
                this.pages.curPage = 1;
                this.$refs.contractForm.resetFields();
                this.pages.curPage = 1;
                this.getContractTableInfo();
            },
            // 转直签确认
            turnSignConfirm() {
                this.signDialogVisible = false;
                // 刷新数据
                this.getContractTableInfo();
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
.contract-list {
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
}
.table-wrap-new {
    margin-top: 10px;
}
.btn-last {
    margin-left: 0;
}
</style>