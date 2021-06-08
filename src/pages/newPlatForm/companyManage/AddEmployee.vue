<!--
 * @author: hewei
 * @Date: 2020-09-17 10:18:13
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 18:15:06
 * @description: file content
-->
<template>
    <div class="add-employee" v-loading.fullscreen.lock="loading">
        <!---面包屑--->
        <el-breadcrumb
            class="bread-crumb"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/companyManage/peopleList' }">
                人员列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ navTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单-->
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="96px"
            class="rule-form">
            <el-form-item
                label="所属公司："
                prop="company">
                <el-select
                    v-model="ruleForm.company"
                    filterable
                    @change="changeCompany"
                    placeholder="请选择">
                    <el-option
                        v-for="item in belongCompanyList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="姓名："
                prop="name">
                <el-input
                    placeholder="请输入"
                    maxlength="10"
                    v-model="ruleForm.name"
                    class="normal-input"></el-input>
            </el-form-item>
            <el-form-item
                label="手机号："
                prop="tel">
                <el-input
                    class="normal-input"
                    placeholder="请输入"
                    type="tel"
                    maxlength="11"
                    v-model="ruleForm.tel"></el-input>
            </el-form-item>
            <el-form-item
                label="部门："
                prop="department">
                <el-select
                    v-model="ruleForm.department"
                    placeholder="请选择">
                    <el-option
                        v-for="item in departmentList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="岗位："
                prop="job">
                <el-select
                    v-model="ruleForm.job"
                    placeholder="请选择">
                    <el-option
                        v-for="item in jobList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitForm">
                    保存
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from './api/peopleEdit';
import commonApi from './api/common';
export default {
    name: "AddEmployee",
    data() {
        return {
            // 加载loading
            loading: false,
            // 当前页面面包屑标题
            navTitle: "新建人员",
            // 表单对象
            ruleForm: {
                // 公司
                company: '',
                // 员工姓名
                name: '',
                // 手机
                tel: '',
                // 部门
                department: '',
                // 岗位
                job: ''
                //cityIds: []
            },
            // 验证规则
            rules: {
                company: [{ required: true, message: '所属公司没有填写完成', trigger: 'change' }],
                name: [{ required: true, message: '姓名没有填写完成', trigger: 'blur' }],
                tel: [
                    { required: true, message: '手机号没有填写完成', trigger: 'blur' },
                    { pattern: /^\d{11}$/, message: '手机号格式错误，请检查', trigger: ['blur', 'change'] }
                ],
                department: [{ required: true, message: '所属公司没有填写完成', trigger: 'change' }],
                job: [{ required: true, message: '所属公司没有填写完成', trigger: 'change' }]
                //cityIds: [{ required: true, message: '所属公司没有填写完成', trigger: 'change' }],
            },
            // 所属公司下拉
            belongCompanyList: [],
            // 部门下拉
            departmentList: [],
            // 岗位下拉了
            jobList: []
            // 业务城市下拉了
            // cityList: []
        };
    },
    created() {
        this.employeeId = this.$route.query.id || '';
        // 如果employeeId为空 则认为是编辑
        if (this.employeeId !== '') {
            // 编辑时动态修改文案
            const text = '编辑人员';
            this.navTitle = text;
            document.title = text;
        }
    },
    mounted() {
        // 初始化下拉数据
        // this.getCityList();
        this.getCompanyList();
        this.getJobsList();
        
        // 如果有员工id 则认为是编辑 则获取员工基本信息
        if (this.employeeId) {
            // 获取员工基本信息
            this.getEmployeeById();
        }
    },
    methods: {
        /**
         * @description: 切换公司 重新获取下面的部门
         * @param {String} val 公司id
         * @return {undefind} 
         */
        changeCompany(val) {
            // 切换公司情况部门
            this.ruleForm.department = '';
            this.getDepartListById(val);
        },
        // 表单提交 验证
        async submitForm() {
            try {
                const valid = await this.$refs.ruleForm.validate();
                if (valid) {
                    // 执行保存
                    this.saveInfo();
                }
            } catch (err) {
                // this.$message.error('请检查必填信息是否填写完整！')
                console.log(err)
            }
        },
        // 数据保存
        async saveInfo() {
            try {
                this.loading = true;
                const form = this.ruleForm;
                const options = {
                    id: this.employeeId,
                    org_id: form.company,
                    employee_name: form.name,
                    mobile: form.tel,
                    depart_id: form.department,
                    post_id: form.job
                };
                const {
                    data: {
                        code,
                        msg
                    }
                } = await api.creatEmployee(options);
                this.loading = false;
                if (code === 0) {
                    this.$router.push('/companyManage/peopleList');
                } else {
                    this.$message.error(msg);
                }
            } catch (error) {
                console.warn(error);
                this.loading = false;
            }
        },
        // 获取下拉城市
        async getCityList() {
            try {
                const {
                    data
                } = await commonApi.getOrderCitys();
                this.cityList = data || [];
            } catch (error) {
                console.warn(error);
            }
        },
        // 获取员工基本信息
        async getEmployeeById() {
            try {
                this.loading = true;
                const options = {
                    id: this.employeeId
                };
                const {
                    data: {
                        code,
                        data
                    }
                } = await api.getEmployeeBaseInfo(options);
                
                if (code === 0) {
                    this.ruleForm.company = data.org_id;
                    this.ruleForm.name = data.name;
                    this.ruleForm.tel = data.mobile;
                    this.ruleForm.department = data.depart_id;
                    this.ruleForm.job = data.post_id;
                    // this.ruleForm.cityIds = data.city_id || [];
                    // 根据公司id获取公司下的员工
                    await this.getDepartListById(data.org_id);
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            } catch (error) {
                this.loading = false;
                console.warn(error);
            }
        },
        // 获取公司下拉
        async getCompanyList() {
            try {
                const {
                    data: {
                        code,
                        data
                    }
                } = await commonApi.getDepartList();
                if (code === 0) {
                    this.belongCompanyList = data || [];
                }
            } catch (error) {
                console.warn(error);
            }
        },
        /**
         * @description: 获取部门下拉
         * @param {String} id 公司id 
         * @return {type} 
         */
        async getDepartListById(id) {
            try {
                const ops = {
                    org_id: id || this.employeeId
                };
                const {
                    data: {
                        code,
                        data
                    }
                } = await commonApi.getOrgDepartList(ops);
                if (code === 0) {
                    this.departmentList = data || [];
                }
            } catch (error) {
                console.warn(error);
            }
        },
        // 获取岗位下拉
        async getJobsList() {
            try {
                const {
                    data: {
                        code,
                        data
                    }
                } = await commonApi.getJobs();
                if (code === 0) {
                    this.jobList = data || [];
                }
            } catch (error) {
                console.warn(error);
            }
        }
    }
};
</script>

<style lang="less" scoped>
    .add-employee {
        padding: 20px 30px;
        .normal-input {
            width: 200px;
        }
    }
    .rule-form {
        margin-top: 20px;
        padding: 40px 30px 20px;
        background-color: #fff;
    }
</style>
