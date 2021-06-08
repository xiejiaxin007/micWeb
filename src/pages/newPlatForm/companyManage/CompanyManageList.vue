<!--
 * @Author: xie bin
 * @Date: 2020-09-17 09:45:41
 * @LastEditTime: 2021-01-29 09:39:35
 * @LastEditors: xiejiaxin
 * @Description: 加盟公司列表
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/CompanyManageList.vue
-->
<template>
    <div
        class="virtual-box"
        v-loading.fullscreen.lock="loading">
        <!---面包屑--->
        <el-breadcrumb class="bread-crumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item>公司列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-box">
            <el-form
                :inline="true"
                :model="companyFrom"
                ref="companyForm">
                <el-form-item
                    label="公司ID："
                    prop="companyId">
                    <el-input
                        v-model="companyFrom.companyId"
                        placeholder="请输入公司ID">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="公司名称："
                    prop="companyName">
                    <el-input
                        v-model="companyFrom.companyName"
                        placeholder="请输入公司名称">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="状态："
                    prop="companyStatusVal">
                    <el-select
                        v-model="companyFrom.companyStatusVal"
                        placeholder="状态"
                        clearable>
                        <el-option
                            v-for="item in companyFrom.companyData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 搜索按钮 -->
            <div class="btn-box">
                <el-button
                    type="primary"
                    @click="searchQuery">
                    搜索
                </el-button>
                <el-button @click="resetForm('companyForm')">重置</el-button>
            </div>
            <div class="table-box">
                <el-button
                    type="primary"
                    @click="addCompany">
                    +添加公司
                </el-button>
                <el-table
                    :data="companyTableData"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="公司ID">
                    </el-table-column>
                    <el-table-column
                        prop="team_name"
                        label="公司名称">
                    </el-table-column>
                    <el-table-column
                        prop="status_desc"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="editorPage(scope.row.id)">
                                编辑
                            </el-button>
                            <el-button
                                v-show="scope.row.status_button == '1'"
                                type="text"
                                size="small"
                                @click="getCompanyOpenApi(scope.row.id, scope.row.status_button)">
                                关闭
                            </el-button>
                            <el-button
                                v-show="scope.row.status_button == '2'"
                                type="text"
                                size="small"
                                @click="getCompanyOpenApi(scope.row.id, scope.row.status_button)">
                                开启
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    hide-on-single-page
                    layout="prev, pager, next"
                    :total="pagination.total"
                    :page-size="pagination.pageSize"
                    :current-page="pagination.currentPage"
                    @current-change="pageChange">
                </el-pagination>
            </div>
        </div>
        <!-- 添加&编辑公司 -->
        <div class="add-company-box">
            <el-dialog
                v-loading.fullscreen.lock="dialogLoading"
                :title="titleText"
                :visible.sync="dialogFormVisible">
                <el-form
                    :model="dialogForm"
                    :rules="dialogFormRules"
                    ref="dialogFormRuleForm">
                    <el-form-item
                        label="公司名称:"
                        prop="companyNameVal"
                        label-width="150px">
                    <el-input
                        v-model="dialogForm.companyNameVal"
                        placeholder="请输入公司名称"
                        maxlength="30">
                    </el-input>
                    </el-form-item>
                    <el-form-item
                        label="加盟公司类型:"
                        prop="companyTypeVal"
                        label-width="150px">
                        <el-select
                            v-model="dialogForm.companyTypeVal"
                            placeholder="请选择加盟公司类型"
                            clearable>
                            <el-option
                                v-for="item in dialogForm.companyTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="城市:"
                        prop="cityVal"
                        label-width="150px">
                        <el-select
                            v-model="dialogForm.cityVal"
                            placeholder="请选择城市"
                            filterable
                            clearable>
                            <el-option
                                v-for="item in dialogForm.cityData"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="微信数据上传:"
                        prop="wechatIsUploadVal"
                        label-width="150px">
                        <el-select
                            v-model="dialogForm.wechatIsUploadVal"
                            placeholder="请选择是否上传微信数据"
                            clearable>
                            <el-option
                                v-for="item in dialogForm.wechatIsUploadData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        prop="remindDialogVal"
                        label="选择需要的强提醒框:"
                        label-width="150px">
                        <el-select
                            v-model="dialogForm.remindDialogVal"
                            placeholder="请选择强提醒框"
                            class="no-shake-select"
                            multiple>
                            <el-option
                                v-for="item in dialogForm.remindDialogData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="选择协作的公司:"
                        prop="cooperateOrgVal"
                        label-width="150px">
                        <el-select
                            v-model="dialogForm.cooperateOrgVal"
                            placeholder="请选择协作公司"
                            filterable
                            clearable
                            multiple>
                            <el-option
                                v-for="item in dialogForm.cooperateOrgData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="saveData('dialogFormRuleForm')">
                        保 存
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import companyApi from './api/companyManageList';
import commonApi from './api/common';
export default {
    data() {
        return {
            // 公司表单
            companyFrom: {
                // 公司ID 
                companyId: '',
                // 公司名称
                companyName: '',
                // 公司状态
                companyStatusVal: '',
                companyData: []
            },
            // 公司表格
            companyTableData: [],
            // loading
            loading: false,
            // 分页
            pagination: {
                total: 0,
                currentPage: 1,
                pageSize: 20
            },
            // 添加&编辑公司弹窗
            dialogFormVisible: false,
            // 弹窗文案
            titleText: '添加公司',
            // 弹窗表单
            dialogForm: {
                // 公司名称
                companyNameVal: '',
                // 微信数据是否上传
                wechatIsUploadVal: '2',
                wechatIsUploadData: [],
                // 强提醒框
                remindDialogVal: '',
                remindDialogData: [],
                // 城市
                cityVal: '',
                cityData: [],
                // 协作公司
                cooperateOrgVal: [],
                cooperateOrgData: [],
                // 加盟公司类型
                companyTypeVal: '',
                companyTypeData: []
            },
            // 弹窗的loading
            dialogLoading: false,
            // 校验规则
            dialogFormRules: {
                // 公司名称
                companyNameVal: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                // 公司名称
                wechatIsUploadVal: [
                    { required: true, message: '请选择是否上传微信数据', trigger: 'change' }
                ],
                // 城市
                cityVal: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                // 加盟公司类型
                companyTypeVal: [
                    { required: true, message: '请选择加盟公司类型', trigger: 'change' }
                ],
            }
        }
    },
    mounted() {
        // 公共接口
        this.getCommonAPi();
        // 获取公司列表接口
        this.getCompanyListApi();
        // 获取城市下拉
        this.getCityData();
    },
    methods: {
        // 公共接口
        async getCommonAPi() {
            try {
                let params = {
                    type: ['org_status', 'wx_data_upload', 'org_join_type']
                }
                let { data: {
                    code,
                    data
                } } = await companyApi.getCompanyCommonData(params);
                if (code === 0) {
                    // 公司状态
                    this.companyFrom.companyData = data.org_status;
                    this.companyFrom.companyData.unshift({
                        name: '全部',
                        value: ''
                    });
                    // 微信数据是否上传
                    this.dialogForm.wechatIsUploadData = data.wx_data_upload;
                    // 加盟公司类型
                    this.dialogForm.companyTypeData = data.org_join_type;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取公司下拉
        async getCompanySelData() {
            try {
                let params = {
                    q: '',
                    is_without_julive: false
                };
                let { 
                    data: {
                        data,
                        code,
                        msg
                    }
                } = await commonApi.getDepartList(params);
                if (code === 0 ) {
                    this.dialogForm.cooperateOrgData = data;
                } else {
                    this.$message(msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取城市下拉
        async getCityData() {
            try {
                let params = {
                    q: ''
                }
                let {data: {
                    data,
                    code
                }} = await commonApi.getAllCityData(params);
                if (code === 0) {
                    // 获取城市下拉
                    this.dialogForm.cityData = data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取强提醒弹窗
        async getRemindDialogData() {
            try {
                let { data: {
                    code,
                    data
                } } = await companyApi.getRemindDialogValData();
                console.log(data)
                if (code === 0) {
                    // 微信数据是否上传
                    this.dialogForm.remindDialogData = data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取公司列表接口
        async getCompanyListApi() {
            try {
                this.loading = true;
                let params = {
                    id: this.companyFrom.companyId,
                    team_name: this.companyFrom.companyName,
                    status: this.companyFrom.companyStatusVal,
                    page: this.pagination.currentPage,
                    limit: this.pagination.pageSize
                }
                let { data: {
                    code,
                    data
                } } = await companyApi.getCompanyListData(params);
                if (code === 0) {
                    this.companyTableData = data.list;
                    this.pagination.total = data.total_count;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            }
            catch(error) {
                this.loading = false;
                console.log(error);
            }
        },
        /**
         * @description: 公司列表禁用&开启接口
         * @param {Number} status 当前状态
         * @return {type} 
         */
        async getCompanyOpenApi(companyId, status) {
            try {
                let params = {
                    id: companyId,
                    type: status == '1' ? 'close' : 'open'
                }
                let { data: {
                    code,
                    msg
                } } = await companyApi.getCompanyOpenData(params);
                if (code === 0) {
                    this.getCompanyListApi();
                } else {
                    this.$message(msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 页码发生改变的时候
         * @param {Number} val 当前的页码
         * @return {type} 
         */
        pageChange(val) {
            this.pagination.currentPage = val;
            this.getCompanyListApi();
        },
        // 搜索
        searchQuery() {
            this.pagination.currentPage = 1;
            this.getCompanyListApi();
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.pagination.currentPage = 1;
            // 获取公司列表接口
            this.getCompanyListApi();
        },
        // 弹窗表单重置
        resetDialogForm(formName) {
            this.$refs[formName].resetFields();
        },
        /**
         * @description: 点击编辑的时候
         * @param {string} companyId 公司id
         * @return {type} 
         */
        async editorPage(companyId) {
            this.dialogFormVisible = true;
            // 公司id
            this.companyId = companyId;
            this.titleText = '编辑公司';
            // 获取强提醒弹窗
            this.getRemindDialogData();
            // 获取协作公司下拉
            this.getCompanySelData();
            try {
                let params = {
                    id: companyId,
                }
                let { data: {
                    code,
                    data,
                    msg
                } } = await companyApi.getCompanyInfoData(params);
                if (code === 0) {
                    console.log(data)
                    // 微信数据是否上传
                    this.dialogForm.wechatIsUploadVal = data.is_wechat;
                    // 公司名称
                    this.dialogForm.companyNameVal = data.team_name;
                    // 强提醒弹窗
                    this.dialogForm.remindDialogVal = data.alert_limit;
                    // 城市
                    this.dialogForm.cityVal = data.city_id;
                    // 协作公司
                    this.dialogForm.cooperateOrgVal = data.help_org_id;
                    // 协作公司
                    this.dialogForm.companyTypeVal = data.join_type;
                } else {
                    this.$message(msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 保存
        saveData(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    try {
                        this.dialogLoading = true;
                        let params = {
                            org_name: this.dialogForm.companyNameVal,
                            is_wechat: this.dialogForm.wechatIsUploadVal,
                            alert_limit: this.dialogForm.remindDialogVal,
                            city_id: this.dialogForm.cityVal,
                            id: this.companyId || '',
                            help_org_id: this.dialogForm.cooperateOrgVal,
                            join_type: this.dialogForm.companyTypeVal
                        }
                        let {
                             data: {
                                code,
                                msg
                            }
                        } = await companyApi.saveCompanyInfoData(params);
                        if (code === 0) {
                            // loading关闭
                            this.dialogLoading = false;
                            // 弹窗关闭
                            this.dialogFormVisible = false;
                            // 调用列表接口
                            this.getCompanyListApi();
                        } else {
                            this.$message(msg);
                            // loading关闭
                            this.dialogLoading = false;
                        }
                    }
                    catch(error) {
                        // loading关闭
                        this.dialogLoading = false;
                        console.log(error);
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加公司
        addCompany() {
            // 获取强提醒弹窗
            this.getRemindDialogData();
            // 获取公司下拉
            this.getCompanySelData();
            this.dialogFormVisible = true;
            this.titleText = '添加公司';
            // 公司id清空
            this.companyId = '';
            this.$nextTick(() => {
                this.resetDialogForm('dialogFormRuleForm');
            })
        }
    }
}
</script>

<style lang="less" scoped>
.virtual-box {
    padding: 20px 50px;
    box-sizing: border-box;
    .content-box {
        background: #fff;
        padding: 20px 20px;
        margin-top: 20px;
        /deep/ .el-form-item {
            margin-right: 30px;
        }
        .btn-box {
            text-align: center;
        }
        .table-box {
            /deep/ .el-button {
                margin: 20px 10px 20px 0 ;
            }
        }
        .pagination {
            text-align: center;
            margin-top: 20px;
        }
        /deep/ .el-button {
            margin-right: 10px;
        }
    }
    .add-company-box {
        /deep/ .el-dialog {
            width: 600px;
            .el-input {
                width: 350px;
            }
            .dialog-footer {
                text-align: center;
            }
        }
    }
}
</style>