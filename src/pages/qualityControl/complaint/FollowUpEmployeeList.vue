<!--
 * @author: wangxue
 * @Date: 2020-07-13 14:17:01
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-22 15:21:30
 * @description: 客诉跟进人管理
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>客诉跟进人管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box follow-up-box">
            <div class="hd">
                <h2>客诉跟进人管理</h2>
            </div>
            <div class="bd">
                <div class="order-search">
                    <!--查询需求-->
                    <ul class="s-query">
                        <li>
                            <div class="th">ID：</div>
                            <div class="td">
                                <el-input type="text"
                                    v-model="id"
                                    clearable></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">城市：</div>
                            <div class="td">
                                <search-select-radio v-model="cityId"
                                    :clearable="true"
                                    placeholder="请选择"
                                    :apiInfo="cityApi">
                                </search-select-radio>
                            </div>
                        </li>
                        <li>
                            <div class="th">投诉类型：</div>
                            <div class="td">
                                <el-select v-model="complaintType"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in complaintTypeList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">跟进人：</div>
                            <div class="td">
                                <search-select-radio v-model="followUpEmployee"
                                    :clearable="true"
                                    placeholder="请选择"
                                    :apiInfo="employeeApi">
                                </search-select-radio>
                            </div>
                        </li>
                        <li>
                            <div class="th">在职状态：</div>
                            <div class="td">
                                <el-select v-model="status"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in statusList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">分配状态：</div>
                            <div class="td">
                                <el-select v-model="distributeStatus"
                                    placeholder="请选择"
                                    clearable>
                                    <el-option v-for="item in distributeStatusList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">暂停任务分配时间：</div>
                            <div class="td">
                                <el-date-picker v-model="distributeTime"
                                    clearable
                                    class="form-date-range-box"
                                    type="daterange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="btn-area">
                    <el-button @click="resetSearch">重置</el-button>
                    <el-button type="primary"
                        @click="searchData(1)">搜索</el-button>
                </div>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <div class="total-box">
                            第{{countRange}}条，共{{total}}条数据
                        </div>
                        <div class="total-box"
                            v-if="canCreate">
                            <el-button type="primary"
                                @click="operation('')">新增</el-button>
                        </div>
                    </div>
                    <div class="table-wrap-box">
                        <el-table ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor">
                            <el-table-column min-width="80"
                                align="center"
                                prop="id"
                                label="ID">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="city_name"
                                label="城市">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="complaint_type_text"
                                label="投诉类型">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="employee_name"
                                label="跟进人">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="employee_status"
                                label="在职状态">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="is_alloc_text"
                                label="分配状态">
                            </el-table-column>
                            <el-table-column min-width="100"
                                align="center"
                                prop="stop_time"
                                label="暂停任务分配时间">
                            </el-table-column>
                            <el-table-column min-width="150"
                                align="center"
                                fixed="right"
                                prop="actions"
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text"
                                        v-for="(item, index) in scope.row.actions"
                                        :key="index"
                                        @click="operationBtn(scope.row, item.value)">
                                        {{item.name}}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <el-pagination background
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            hide-on-single-page
                            :current-page.sync="page"
                            @current-change="searchData"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增/编辑跟进人 -->
        <el-dialog class="operation-dialog"
            :title="operationData.type === '0' ? '新增客诉跟进人': '编辑客诉跟进人'"
            :visible.sync="operationData.isShow"
            width="420px"
            center
            @close="resetForm">
            <div>
                <el-form ref="operationData"
                    :model="operationData"
                    :rules="rules"
                    label-width="100px">
                    <el-form-item label="城市："
                        prop="cityId">
                        <search-select-radio v-model="operationData.cityId"
                            placeholder="请选择"
                            :clearable="true"
                            :apiInfo="cityApi"
                            :chosenObj="operationData.cityObj">
                        </search-select-radio>
                    </el-form-item>
                    <el-form-item label="投诉类型："
                        prop="complaintType">
                        <el-select v-model="operationData.complaintType"
                            filterable
                            :clearable="true"
                            placeholder="请选择"
                            :loading="loading">
                            <el-option v-for="item in complaintTypeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跟进人："
                        prop="followUpEmployee">
                        <search-select-radio v-model="operationData.followUpEmployee"
                            placeholder="请选择"
                            :apiInfo="userApi"
                            :clearable="true"
                            :chosenObj="operationData.followUpEmployeeObj">
                        </search-select-radio>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary"
                    @click="submitForm">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 提示弹窗 -->
        <el-dialog :title="tipsDialogTitle"
            :visible.sync="tipsDialog"
            width="400px"
            center>
            <span>{{tipsDialogText}}</span>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="tipsDialog = false"
                    type="primary">我知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import complaintApi from './api/complaint';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
export default {
    name: 'follow-up-employee-list',
    components: {
        SearchSelectRadio
    },
    data() {
        return {
            loading: false,
            id: '',
            // 城市
            cityId: '',
            // 城市列表
            cityList: [],
            // 投诉类型
            complaintType: '',
            // 投诉类型列表
            complaintTypeList: [],
            // 跟进人
            followUpEmployee: '',
            // 跟进人列表
            followUpEmployeeList: [],
            // 在职状态
            status: '',
            // 在职状态列表
            statusList: [],
            // 分配状态
            distributeStatus: '',
            // 分配状态列表
            distributeStatusList: [],
            // 暂停任务分配时间
            distributeTime: [],
            // 表格数据
            tableList: [],
            // 每页数量
            pageSize: 20,
            // 页码
            page: 1,
            // 数据总量
            total: 0,
            // 是否可以创建
            canCreate: false,
            // 新增/编辑弹窗数据
            operationData: {
                // 是否显示
                isShow: false,
                id: '',
                // 弹窗类型 0新增 1编辑
                type: '0',
                cityId: '',
                // 城市
                cityObj: {},
                // 投诉类型
                complaintType: '',
                // 跟进人
                followUpEmployee: '',
                // 选中跟进人
                followUpEmployeeObj: {}
            },
            // 验证规则
            rules: {
                cityId: [
                    {
                        required: true,
                        message: '城市不能为空',
                        trigger: 'blur'
                    }
                ],
                complaintType: [
                    {
                        required: true,
                        message: '投诉类型不能为空',
                        trigger: 'blur'
                    }
                ],
                followUpEmployee: [
                    {
                        required: true,
                        message: '跟进人不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            // 提示弹窗
            tipsDialog: false,
            // 提示弹窗标题
            tipsDialogTitle: '',
            // 提示弹窗内容
            tipsDialogText: '',
            // 防止重复提交
            flag: true,
            // 城市远程下拉
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll',
                    all_text: '全国'
                }
            },
            // 列表内跟进人下拉
            employeeApi: {
                api: complaintApi.getComplaintEmployee,
                params: {
                    q: ''
                }
            },
            // 跟进人下拉 所以在职的人
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all',
                    status: '1'
                }
            }
        };
    },
    created() {
        // 搜索数据
        this.searchData(1);
    },
    methods: {
        /**
         * 点击搜索
         * @params [string] page 页码
         */
        async searchData(page) {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            if (page) {
                this.page = page;
            }
            this.flag = false;
            this.loading = true;
            try {
                this.distributeTime = this.distributeTime ? this.distributeTime : [];
                let params = {
                    id: this.id,
                    city_id: this.cityId,
                    complaint_type: this.complaintType,
                    employee_id: this.followUpEmployee,
                    is_alloc: this.distributeStatus,
                    stop_time_min: this.distributeTime[0] ? this.distributeTime[0] / 1000 : '',
                    stop_time_max: this.distributeTime[1] ? this.distributeTime[1] / 1000 : '',
                    employee_status: this.status,
                    page
                };
                let {
                    data: { code, msg, data }
                } = await complaintApi.complaintEmployeeList(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.complaintTypeList = data.complaint_type_list;
                    this.statusList = data.employee_status_list;
                    this.distributeStatusList = data.is_alloc_list;
                    this.total = Number(data.totalCount);
                    this.canCreate = data.can_create;
                } else {
                    this.$message(msg);
                }
                this.loading = false;
                this.flag = true;
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        // 点击重置
        resetSearch() {
            this.id = '';
            this.cityId = '';
            this.complaintType = '';
            this.followUpEmployee = '';
            this.status = '';
            this.distributeStatus = '';
            this.distributeTime = '';
            this.searchData(1);
        },
        // 表格翻页
        // pageChange(page) {
        //     this.searchData(page);
        // },
        /**
         * 点击操作按钮
         * @params [Object] rowData 操作行数据
         * @params [Object] type 操作按钮
         */
        operationBtn(rowData, type) {
            switch (type) {
                // 点击编辑
                case 'edit':
                    this.operation(rowData);
                    break;
                // 点击删除
                case 'delete':
                    this.deleteFun(rowData);
                    break;
                // 点击暂停/开启任务权限
                case 'pause':
                case 'open':
                    this.operateDistrubution(rowData);
                    break;
            }
        },
        /**
         * 点击操作按钮
         * @params [Object] rowData 操作行数据
         */
        operation(rowData) {
            this.operationData.isShow = true;
            // 编辑
            if (rowData) {
                this.operationData.type = '1';
                this.operationData.id = rowData.id;
                this.operationData.cityId = rowData.city_id;
                this.operationData.followUpEmployee = rowData.employee_id;
                this.operationData.cityObj = {
                    value: rowData.city_id,
                    name: rowData.city_name
                };
                this.operationData.followUpEmployeeObj = {
                    value: rowData.employee_id,
                    name: rowData.employee_name
                };
                this.operationData.complaintType = rowData.complaint_type;
            } else {
                this.operationData.type = '0';
            }
        },
        // 新增/编辑内点击取消
        resetForm() {
            this.operationData.isShow = false;
            this.$refs['operationData'].resetFields();
            this.operationData.cityId = '';
            this.operationData.complaintType = '';
            this.operationData.followUpEmployee = '';
        },
        // 新增/编辑内点击保存
        submitForm() {
            if (!this.flag) return;
            this.flag = false;
            this.$refs['operationData'].validate(async valid => {
                if (valid) {
                    let params = {
                        city_id: this.operationData.cityId,
                        complaint_type: this.operationData.complaintType,
                        employee_id: this.operationData.followUpEmployee
                    };
                    // 如果是编辑 需求传入id
                    if (this.operationData.type === '1') {
                        params.id = this.operationData.id;
                    }
                    try {
                        let {
                            data: { code, msg }
                        } = await complaintApi.complaintEmployeeSave(params);
                        this.flag = true;
                        if (code === 0) {
                            this.operationData.isShow = false;
                            this.searchData(1);
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        } else {
                            this.tipsDialog = true;
                            this.tipsDialogText = msg;
                            this.tipsDialogTitle = '提示';
                        }
                    } catch (error) {
                        console.log(error);
                        this.flag = true;
                    }
                } else {
                    return false;
                }
            });
        },
        /**
         * 点击删除
         * @params [Object] rowData 操作行数据
         */
        async deleteFun(rowData) {
            let params = {
                id: rowData.id
            };
            try {
                const {
                    data: { code, msg }
                } = await complaintApi.complaintEmployeeDelete(params);
                if (code === 0) {
                    this.$message(msg);
                    this.searchData(this.page);
                } else {
                    this.tipsDialog = true;
                    this.tipsDialogText = msg;
                    this.tipsDialogTitle = '删除跟进人';
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 暂停/开启业务分配
         * @params [Object] rowData 操作行数据
         */
        async operateDistrubution(rowData) {
            let params = {
                id: rowData.id,
                is_alloc: rowData.is_alloc === '1' ? '2' : '1'
            };
            try {
                const {
                    data: { code, msg }
                } = await complaintApi.complaintEmployeeChangeAlloc(params);
                if (code === 0) {
                    this.$message({
                        type: 'success',
                        message: msg
                    });
                    this.searchData(this.page);
                } else {
                    this.tipsDialog = true;
                    this.tipsDialogText = msg;
                    this.tipsDialogTitle = '暂停任务分配';
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        }
    },
    computed: {
        // 计算当前是第几条数据
        countRange() {
            let start = (this.page-1) * this.pageSize + 1;
            let end = this.page * this.pageSize > this.total ? this.total : this.page * this.pageSize;
            return `${start}-${end}`;
        }
    }
};
</script>

<style scoped>
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
.order-search >>> .el-range-editor.el-input__inner {
    padding: 3px 6px;
}
.order-search >>> .el-date-editor .el-range__close-icon {
    font-size: 12px;
    width: 22px;
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
.pagination >>> .el-pagination.is-background .btn-next,
.pagination >>> .el-pagination.is-background .btn-prev {
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
    content: '全选';
    font-size: 12px;
    margin-left: 6px;
    font-weight: 500;
}
</style>
<style lang="less" scoped>
.follow-up-box {
    padding: 0;
    .hd {
        padding-left: 20px;
    }
}
.form-table-box {
    padding-top: 20px;
    .s-query {
        & > li {
            width: 334px;
        }
    }
    .data-stat {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        margin-bottom: 10px;
    }
    .pagination {
        text-align: center;
        margin: 25px 0 10px;
    }
}
</style>