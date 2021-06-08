<!--
 * @Name: 开发商人员管理
 * @Description: 开发商人员管理
 * @Author: wangxue
 * @Date: 2020-02-07
-->
<template>
    <div class="ksf-personal-tab">
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="bd">
                <div class="order-search">
                    <!--查询需求-->
                    <ul class="s-query clearfix">
                        <li>
                            <div class="th">楼盘：</div>
                            <div class="td">
                                <el-input
                                    v-model="projectName"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">开发商：</div>
                            <div class="td">
                                <el-input
                                    v-model="developerName"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">员工姓名：</div>
                            <div class="td">
                                <el-input
                                    v-model="employeeName"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">手机号：</div>
                            <div class="td">
                                <el-input
                                    v-model="mobile"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">角色权限：</div>
                            <div class="td">
                                <el-select
                                    v-model="auth"
                                    filterable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in authList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">楼盘ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="projectId"
                                    placeholder="请输入内容"
                                >
                                </el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">状态：</div>
                            <div class="td">
                                <el-select
                                    v-model="state"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in stateList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">员工ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="employeeId"
                                    placeholder="请输入内容"
                                >
                                </el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">是否接单：</div>
                            <div class="td">
                                <el-select
                                    v-model="canAlloc"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in radioList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">是否居理咨询师：</div>
                            <div class="td">
                                <el-select
                                    v-model="isConsultant"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in radioList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    >
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
                        @click="searchData(1)"
                    >搜索</el-button>
                </div>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box personal-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="12">
                                <p class="total-num">当前条件下共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area">
                                    <el-button
                                        type="primary"
                                        @click="downloadTemplate"
                                    >下载模版</el-button>
                                    <el-button
                                        type="primary"
                                        @click="exportFile"
                                    >导出</el-button>
                                    <el-upload
                                        ref="uploadBtn"
                                        class="upload-file"
                                        action
                                        :http-request="beforeUpdata"
                                        :show-file-list="false"
                                    >
                                        <el-button size="primary">批量导入
                                        </el-button>
                                    </el-upload>
                                    <el-button
                                        type="primary"
                                        @click="operationDialog(1)"
                                    >新增人员</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-wrap">
                        <el-table
                            ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor"
                        >
                            <el-table-column
                                min-width="60"
                                prop="id"
                                label="员工ID"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="developer_name"
                                label="开发商"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="150"
                                prop="project_name"
                                label="楼盘名称"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="employee_name"
                                label="员工姓名"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="mobile"
                                label="手机号"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="auth"
                                label="角色权限"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="can_alloc"
                                label="是否接单"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="is_consultant"
                                label="是否居理咨询师"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="status_name"
                                label="状态"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                label="操作"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="medium"
                                        :disabled="scope.row.status === '0'"
                                        @click="operationDialog(0, scope.row.id)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="scope.row.status === '1'"
                                        type="text"
                                        size="medium"
                                        class="delete-txt"
                                        @click="deleteDialogShow(scope.row.id, '1')"
                                    >删除</el-button>
                                    <el-button
                                        v-else
                                        type="text"
                                        size="medium"
                                        @click="deleteDialogShow(scope.row.id, '2')"
                                    >恢复</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                v-if="totalNum-pageSize>0"
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :total="totalNum"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 删除/恢复开发商人员弹窗 -->
        <el-dialog
            title="系统提示"
            :visible.sync="deleteDialog"
            width="400px"
            center
        >
            <span>{{deleteDialogText}}</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="deleteEmployee"
                >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增开发商人员弹窗 -->
        <el-dialog
            class="kfs-operation-dialog"
            title="开发商人员管理"
            :visible.sync="operationData.isShow"
            width="520px"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="resetForm('operationData')"
        >
            <div class="operation-employee-dialog">
                <el-form
                    ref="operationData"
                    :model="operationData"
                    :rules="rules"
                    label-width="150px"
                    class="operation-dialog"
                >
                    <el-form-item
                        label="开发商："
                        prop="developerId"
                    >
                        <el-select
                            v-model="operationData.developerId"
                            filterable
                            collapse-tags
                            remote
                            reserve-keyword
                            placeholder="请选择"
                            :loading="loading"
                            :remote-method="getDeveloperList"
                        >
                            <el-option
                                v-for="item in developerList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="员工姓名："
                        prop="employeeName"
                    >
                        <el-input
                            v-model="operationData.employeeName"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="楼盘："
                        prop="projectList"
                    >
                        <el-select
                            v-model="operationData.projectList"
                            filterable
                            remote
                            multiple
                            reserve-keyword
                            :multiple-limit="multipleLimit"
                            placeholder="请选择"
                            :loading="loading"
                            :remote-method="getProjectList"
                            @remove-tag="removeProjectTag"
                        >
                            <el-option
                                v-for="item in projectList"
                                :key="item.id"
                                :label="item.text"
                                :value="item.text"
                                @click.native="clickProject(item)"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="手机号："
                        prop="mobile"
                    >
                        <el-input
                            :class="[operationData.isAddDialog?'':'mobile-input']"
                            v-model="operationData.mobile"
                        ></el-input>
                        <el-button
                            v-if="!operationData.isAddDialog"
                            type="text"
                            @click="resetPassword"
                        >重置密码</el-button>
                    </el-form-item>
                    <el-form-item
                        label="角色权限："
                        prop="auth"
                    >
                        <el-select
                            v-model="operationData.auth"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in authList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="是否接单："
                        required
                    >
                        <el-select
                            v-model="operationData.canAlloc"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in radioList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="是否居理咨询师："
                        required
                    >
                        <el-select
                            v-model="operationData.isConsultant"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in radioList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="resetForm('operationData')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('operationData')"
                >提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import developerApi from '../api/developerApi';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'ksf-personal',
    data() {
        var verifyTelNum = (rule, value, callback) => {
            if (!commonFun.verifyTelNum(value) && value !== '') {
                return callback(new Error('手机号格式错误'));
            }
            callback();
        };
        return {
            // 开发商名称
            developerName: '',
            // 楼盘名称
            projectName: '',
            // 员工姓名
            employeeName: '',
            // 手机号
            mobile: '',
            // 角色权限
            auth: '',
            // 楼盘ID
            projectId: '',
            // 员工ID
            employeeId: '',
            // 状态
            state: '',
            // 状态列表
            stateList: [],
            // 当前页面
            currentPage: 1,
            // 是否导出
            export: '1',
            // 数据总数
            totalNum: '0',
            // 表格数据
            tableList: [],
            // 权限列表
            authList: [],
            // 是否接单
            canAlloc: '',
            // 是否咨询师
            isConsultant: '',
            radioList: [
                {
                    value: '1',
                    name: '是'
                },
                {
                    value: '2',
                    name: '否'
                }
            ],
            // 点击删除弹窗
            deleteDialog: false,
            // 弹窗提示内容
            deleteDialogText: '',
            // 操作 删除/恢复
            operationIsDelete: '',
            // 操作员工id
            operationEmployeeId: '',
            // 搜索loading
            loading: false,
            // 每页显示数据
            pageSize: 20,
            // 开发商人员操作弹窗数据
            operationData: {
                isShow: false,
                isAddDialog: false,
                developerId: '',
                employeeId: '',
                employeeName: '',
                projectList: [], // 选中楼盘name数组
                projectIdList: [], // 选中楼盘对象数组
                mobile: '',
                auth: '',
                canAlloc: '', // 是否接单
                isConsultant: '' // 是否居理咨询师
            },
            // 楼盘多选限制数量
            multipleLimit: 20,
            // 开发商下拉列表
            developerList: [],
            // 楼盘下拉列表
            projectList: [],
            rules: {
                developerId: [
                    {
                        message: '请选择开发商名称',
                        required: true,
                        trigger: 'change'
                    }
                ],
                employeeName: [
                    {
                        message: '请输入员工姓名',
                        required: true,
                        trigger: 'blur'
                    }
                ],
                projectList: [
                    {
                        message: '请选择对应楼盘',
                        required: true,
                        trigger: 'change'
                    }
                ],
                mobile: [
                    {
                        message: '请输入正确手机号',
                        required: true,
                        trigger: 'blur'
                    },
                    {
                        validator: verifyTelNum,
                        trigger: 'blur'
                    }
                ],
                auth: [
                    {
                        message: '请选择角色权限',
                        required: true,
                        trigger: 'change'
                    }
                ]
            },
            // 防止重复提交
            flag: true
        };
    },
    mounted() {
        // 获取初始数据
        this.searchData(1);
        // 获取开发商列表
        this.getDeveloperList();
    },
    methods: {
        /**
         * 移除弹窗里已选中楼盘
         * @params [string] projectName 楼盘名称
         */
        removeProjectTag(projectName) {
            let valIndex = this.operationData.projectIdList.findIndex((item, index) => {
                return item.text == projectName
            })
            this.operationData.projectIdList.splice(valIndex, 1);
        },
        /**
         * 点击弹窗里下拉列表（option）
         * @params [Object] project 楼盘数据
         * @params [string] project.id 楼盘id
         * @params [string] project.text 楼盘名称
         */
        clickProject(project) {
            let flag = false;
            this.operationData.projectIdList.forEach((item, index) => {
                if (item.text === project.text) {
                    this.operationData.projectIdList.splice(index, 1);
                    flag = true;
                }
            })
            if (!flag) {
                this.operationData.projectIdList.push(project);
            }
        },
        /**
         * 点击搜索
         * @params [string] page 页码
         */
        async searchData(page) {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            this.flag = false;
            try {
                this.loading = true;
                if (page) {
                    this.currentPage = page
                }
                let params = {
                    page: this.currentPage,
                    developer_name: this.developerName,
                    employee_name: this.employeeName,
                    mobile: this.mobile,
                    auth: this.auth,
                    project_name: this.projectName,
                    project_id: this.projectId,
                    status: this.state,
                    employee_id: this.employeeId,
                    can_alloc: this.canAlloc,
                    is_consultant: this.isConsultant,
                    export: '0'
                };
                let { data } = await developerApi.developerEmployeeList({params});
                if (data.code === 0) {
                    this.tableList = data.data.list;
                    this.authList = data.data.auth;
                    this.stateList = data.data.status;
                    this.totalNum = data.data.total ? parseInt(data.data.total) : '0';
                    this.loading = false;
                    this.flag = true;
                } else {
                    this.$message(data.msg);
                    this.flag = true;
                }
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        // 点击重置
        resetSearch() {
            this.developerName = '';
            this.projectName = '';
            this.employeeName = '';
            this.mobile = '';
            this.auth = '';
            this.projectId = '';
            this.employeeId = '';
            this.canAlloc = '';
            this.isConsultant = '';
            this.state = '';
            this.searchData(1);
        },
        /**
         * 远程搜索开发商
         * @params [string] q 搜索内容
         */
        async getDeveloperList(q) {
            this.loading = true;
            try {
                let params = {
                    q
                };
                let { data } = await developerApi.developerSelectList({params});
                if (data.code === 0) {
                    this.developerList = data.list;
                    this.loading = false;
                } else {
                    this.$message(data.msg);
                    this.loading = false;
                }
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        /**
         * 楼盘下拉
         * @params [string] q 搜索内容
         */
        async getProjectList(q) {
            if (!this.operationData.developerId) {
                this.$message('请先选择开发商');
                return;
            }
            this.loading = true;
            try {
                let params = {
                    name: q,
                    developer_id: this.operationData.developerId
                };
                let { data } = await developerApi.projectList(params);
                if (data.code === 0) {
                    this.projectList = data.data.list;
                    this.loading = false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 弹窗显示
         * @param {string} employeeId 员工id
         * @param {string} isAdd 类型 0编辑/1新增
         */
        operationDialog(isAdd, employeeId) {
            this.operationData.isShow = true;
            if (isAdd) {
                // 弹窗是新增弹窗
                this.operationData.developerId = '';
                this.operationData.employeeId = '';
                this.operationData.employeeName = '';
                this.operationData.projectList = [];
                this.operationData.projectIdList = [];
                this.operationData.mobile = '';
                this.operationData.auth = '';
                this.operationData.canAlloc = '1';
                this.operationData.isConsultant = '2';
                this.operationData.isAddDialog = true;
            } else {
                // 弹窗是编辑弹窗
                this.operationData.isAddDialog = false;
                this.operationEmployeeId = employeeId;
                this.initEditData();
            }
        },
        // 编辑弹窗初始化数据
        async initEditData() {
            this.loading = true;
            try {
                let params = {
                    id: this.operationEmployeeId
                };
                const { data } = await developerApi.editInitDeveloperEmployee(
                    {params}
                );
                if (data.code === 0) {
                    this.operationData.employeeId = data.data.id;
                    this.operationData.developerId = data.data.developer ? data.data.developer.value : '';
                    this.operationData.employeeName = data.data.employee_name;
                    this.operationData.mobile = data.data.mobile;
                    this.operationData.auth = data.data.auth;
                    this.operationData.canAlloc = String(data.data.can_alloc);
                    this.operationData.isConsultant = String(data.data.is_consultant);
                    let projects = [];
                    this.operationData.projectIdList = [];
                    data.data.projects.forEach((item, index) => {
                        projects.push(item.name);
                        this.operationData.projectIdList.push({
                            id: item.value,
                            text: item.name
                        })
                    });
                    this.operationData.projectList = projects;
                    this.loading = false;
                    // 初始获取楼盘下拉列表
                    this.getProjectList();
                } else {
                    this.$message(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 保存按钮 增加或编辑人员提交数据
         * @param {Object} formName 表单数据
         */
        submitForm(formName) {
            // 防止重复提交
            if (!this.flag) return;
            this.flag = false;
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    // 将选中的楼盘列表转换为楼盘id列表
                    let projectListParams = [];
                    this.operationData.projectIdList.forEach((item) => {
                        this.operationData.projectList.forEach((item2) => {
                            if (item.text === item2) {
                                projectListParams.push(item.id);
                            }
                        });
                    });
                    try {
                        let params = {
                            developer_id: this.operationData.developerId,
                            project_id: projectListParams,
                            employee_name: this.operationData.employeeName,
                            auth: this.operationData.auth,
                            mobile: this.operationData.mobile,
                            can_alloc: this.operationData.canAlloc,
                            is_consultant: this.operationData.isConsultant
                        };
                        // 增加弹窗页面
                        if (this.operationData.isAddDialog) {
                            const {
                                data: { code, msg }
                            } = await developerApi.addDeveloperEmployee(params);
                            if (code === 0) {
                                this.$message(msg);
                                this.operationData.isShow = false;
                                this.resetSearch();
                                this.flag = true;
                                this.searchData()
                            } else {
                                this.$message(msg);
                                this.flag = true;
                            }
                        } else {
                            // 编辑弹窗页面
                            params.id = this.operationData.employeeId;
                            const {
                                data: { code, msg }
                            } = await developerApi.editDeveloperEmployee(
                                params
                            );
                            if (code === 0) {
                                this.$message(msg);
                                this.operationData.isShow = false;
                                this.resetSearch();
                                this.flag = true;
                                this.searchData()
                            } else {
                                this.$message(msg);
                                this.flag = true;
                            }
                        }
                        // 获取开发商列表
                        this.getDeveloperList();
                    } catch (err) {
                        this.flag = true;
                        console.log(err);
                    }
                } else {
                    this.flag = true;
                    return false;
                }
            });
        },
        /**
         * 重置数据
         * @param {Object} formName 表单数据
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.operationData.isShow = false;
            // 获取开发商列表
            this.getDeveloperList();
        },
        /**
         * 点击删除/恢复出现确认删除弹窗
         * @param {string} employeeId 员工id
         * @param {string} is_delete 1是删除 2是恢复
         */
        deleteDialogShow(employeeId, is_delete) {
            if (is_delete === '1') {
                this.deleteDialogText = '点击删除即可删除本条数据';
            } else {
                this.deleteDialogText = '点击恢复即可恢复本条数据';
            }
            this.operationEmployeeId = employeeId;
            this.operationIsDelete = is_delete;
            this.deleteDialog = true;
        },
        // 确认删除/恢复数据
        async deleteEmployee() {
            // 请求数据
            try {
                let params = {
                    id: this.operationEmployeeId
                };
                if (this.operationIsDelete === '1') {
                    // 删除员工
                    const { data: { code, msg } } = await developerApi.delEmployee(params);
                    if (code === 0) {
                        // 删除成功
                        this.$message(msg);
                        this.searchData();
                    } else {
                        this.$message(msg);
                    }
                } else {
                    // 恢复员工
                    const { data: { code, msg } } = await developerApi.recoveryEmployee({
                        employee_id: this.operationEmployeeId
                    });
                    if (code === 0) {
                        // 恢复成功
                        this.$message(msg);
                        this.searchData();
                    } else {
                        this.$message(msg);
                    }
                }
            } catch (err) {
                console.log(err);
            }
            this.deleteDialog = false;
        },
        // 重置密码
        async resetPassword() {
            try {
                let params = {
                    id: this.operationData.employeeId
                };
                const {
                    data: { msg }
                } = await developerApi.resetPassword(params);
                this.$message(msg);
            } catch (err) {
                console.log(err);
            }
        },
        // 表格翻页
        pageChange() {
            this.searchData();
        },
        // 点击下载模版
        downloadTemplate() {
            window.location.href = 'https://comjia-1.oss-cn-beijing.aliyuncs.com/developer/template/1585205957hZPJXDpersonal.xlsx';
        },
        // 导出文件
        async exportFile() {
            try {
                let params = {
                    page: this.currentPage,
                    developer_name: this.developerName,
                    employee_name: this.employeeName,
                    mobile: this.mobile,
                    auth: this.auth,
                    project_name: this.projectName,
                    project_id: this.projectId,
                    status: this.state,
                    employee_id: this.employeeId,
                    can_alloc: this.canAlloc,
                    is_consultant: this.isConsultant,
                    export: '1'
                };
                let url = '/backend-api/kfs-developer/developer-employee-list?';
                Object.keys(params).map((item, i) => {
                    if (i !== 0) {
                        url += '&' + item + '=' + params[item];
                    } else {
                        url += item + '=' + params[item];
                    }
                });
                window.location.href = url;
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 导入文件前校验
         * @param {Object} file 文件
         */
        beforeUpdata(file) {
            // 文件大小限制
            let isLt20M = file.file.size / 1024 / 1024 <= 20;
            let excelfileExtend = '.xlsx、.xls、.csv、.CSV、.XLSX、.XLS'
            let fileExtend = file.file.name
                .substring(file.file.name.lastIndexOf('.'))
                .toLowerCase();
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
                    source: excelBase64Str
                };
                let { data } = await developerApi.importDeveloperEmployee(params);
                if (data.code === 0) {
                    this.$message(data.msg);
                } else {
                    this.$message.error(data.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        }
    },
    watch: {
        // 监听弹窗里开发商id
        'operationData.developerId': {
            handler: function (val, oldval) {
                // 获取开发商下楼盘数据
                if (val) {
                    this.getProjectList()
                }
                if (oldval) {
                    this.operationData.projectList = [];
                }
                if (oldval != '' && val != oldval) {
                    this.operationData.projectIdList = [];
                }
            },
            deep: true
        }
  }
};
</script>

<style lang="less" scoped>
.ksf-personal-tab {
    .search-wrap {
        padding-top: 20px;
    }
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
        }
        .operation-area {
            float: right;
            .upload-file {
                display: inline-block;
            }
        }
    }
    .pagination {
        text-align: center;
        margin: 25px 0 10px;
    }
    .el-select {
        width: 100%;
    }
    .delete-txt {
        color: #f64a4a;
    }
    .mobile-input {
        width: 250px;
    }
    /deep/.kfs-operation-dialog {
        .el-dialog {
            overflow: hidden;
        }
    }
    .personal-table-box {
        .table-wrap {
            /deep/.el-table {
                th, td {
                    min-width: 0!important;
                }
            }
        }
    }
}
</style>
