<!--
 * @author: hewei
 * @Date: 2020-11-10 11:39:22
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-20 18:18:31
 * @description: file content
-->
<template>
    <div
        v-loading.fullscreen.lock="loading"
        class="edit-config">
        <!---面包屑--->
        <el-breadcrumb
            class="bread-crumb"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/companyManage/priorityConfigList' }">
                上户优先级
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ navTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单-->
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="150px"
            class="rule-form">
            <el-form-item
                label="选择订单上户城市："
                prop="cityIds">
                <div class="box-wrap">
                    <el-select
                        filterable
                        clearable
                        class="custom-form"
                        v-model="ruleForm.cityIds"
                        placeholder="请选择">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button
                        v-show="ruleForm.cityIds"
                        class="btn-check"
                        @click="showCityPriorityConf()"
                        type="text">
                        查看该城市的优先级配置
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item
                label="选择公司："
                prop="company">
                <el-select
                    v-model="ruleForm.company"
                    class="custom-form"
                    filterable
                    clearable
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
                label="优先级："
                prop="priority">
                <jl-number-input
                    class="number-form"
                    v-model="ruleForm.priority"
                    :maxVal="1000"
                    reg="parseInt">
                </jl-number-input>
                <span class="notice-msg">提示：如果输入的优先级和已有的生效中的数据重复，那么会将生效中及后面的数据的优先级批量+1</span>
            </el-form-item>
            <el-form-item
                label="状态："
                prop="status">
                <el-radio-group v-model="ruleForm.status">
                    <el-radio
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.value">
                        {{item.name}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                required
                label="上户目标配置：">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="hour"
                        label="截止时间点"
                        min-width="150">
                        <template v-slot="{ $index }">
                            <el-select
                                v-model="tableData[$index].hour"
                                class="custom-form"
                                filterable
                                placeholder="请选择">
                                <el-option
                                    v-for="(item, idx) in dateHours"
                                    :key="idx"
                                    :label="item + '点'"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="percent"
                        label="需要达到今日上户目标的百分比"
                        min-width="150">
                        <template v-slot="{ $index }">
                            <div class="box-wrap">
                                <jl-number-input
                                    v-model="tableData[$index].percent"
                                    :maxVal="100"
                                    reg="parseInt">
                                </jl-number-input>
                                <div class="percent-unit">%</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width="100">
                        <template v-slot="{ $index }">
                            <el-button @click="handleDelete($index)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div
                    class="add-goal"
                    @click="handleAdd">
                    + 添加目标
                </div>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitForm">
                    保存
                </el-button>
            </el-form-item>
        </el-form>
        <PriorityConfigDialog
            :dialogVisible="dialogShow"
            :cityName="getCityNameById(ruleForm.cityIds)"
            :tableData="priorityConfs"
            @closeDialog="closeDialog" />
    </div>
</template>

<script>
    import api from './api/editPriorityConfig';
    import commonApi from './api/common';
    import PriorityConfigDialog from './components/PriorityConfigDialog';
    export default {
        name: 'EditPriorityConfig',
        components: {
            PriorityConfigDialog
        },
        data() {
            return {
                // 优先级配置弹窗
                dialogShow: false,
                // 已配置的优先级数据
                priorityConfs: [],
                // 加载loading
                loading: false,
                // 当前页面面包屑标题
                navTitle: "添加配置",
                // 表单对象
                ruleForm: {
                    // 公司
                    company: '',
                    // 部门
                    cityIds: '',
                    // 优先级
                    priority: '',
                    // 状态 默认生效中
                    status: '1',
                },
                // 上户目标·配置表格数据
                tableData: [],
                // 验证规则
                rules: {
                    company: [{ required: true, message: '公司没有填写', trigger: 'change' }],
                    cityIds: [{ required: true, message: '订单上户城市没有填写', trigger: 'change' }],
                    priority: [{ required: true, message: '优先级没有填写', trigger: 'blur' }],
                    status: [{ required: true, message: '状态没有填写', trigger: 'change' }]
                },
                // 所属公司下拉
                belongCompanyList: [],
                // 状态下拉
                statusList: [],
                // 业务城市下拉了
                cityList: [],
                // 24小时下拉
                dateHours: this.createHours(),
                // 防重复提交
                isReq: false
            };
        },
        created() {
            this.id = this.$route.query.id || '';
            // 如果id为空 则认为是编辑
            if (this.id !== '') {
                // 编辑时动态修改文案
                const text = '编辑配置';
                this.navTitle = text;
                document.title = text;
            }
        },
        mounted() {
            // 初始化下拉数据
            this.getCityList();
            this.getCompanyList();
            this.getConfStatus();
            // 如果有员工id 则认为是编辑 则获取员工基本信息
            if (this.id) {
                // 获取初始化信息
                this.getInitInfo();
            }
        },
        methods: {
            // 获取城市id对应得名称
            getCityNameById(id) {
                return this.cityList.find(ele => ele.id === id) && this.cityList.find(ele => ele.id === id).text;
            },
            // 生成24小时下拉数据
            createHours() {
                const len = 24;
                let hours = [];
                for (let i = 0; i < len; i++) {
                    let hour = i;
                    /* if(i < 10) {
                        hour = '0' + i;
                    } */
                    hours.push(hour + '')
                }
                return hours;
            },
            // 展示弹窗获取数据
            async showCityPriorityConf() {
                await this.getPriorityList();
                this.dialogShow = true;
            },
            // 获取公司上户配置
            async getPriorityList() {
                try {
                    const options = {
                        city_id: this.ruleForm.cityIds
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.getPriorityList(options);
                    if (code === 0) {
                        this.priorityConfs = data.list;
                    } else {
                        this.$message.error(msg)
                    }
                } catch (error) {
                    console.warn(error);
                }
            },
            // 新增数据
            handleAdd() {
                // 增加一条数据
                this.tableData.push({
                    hour: '',
                    percent: ''
                });
            },
            /**
             * @description: 删除配置
             * @param {String} index 数据索引
             * @return {undefind} 
             */
            handleDelete(index) {
                this.tableData.splice(index, 1);
            },
            // 表单提交 验证
            async submitForm() {
                try {
                    // 验证筛选表单
                    const valid = await this.$refs.ruleForm.validate();
                    // 验证上户目标配置至少有一条填写
                    const confValid = this.tableData.length > 0 && this.tableData.find(ele => ele.hour || ele.percent);
                    if (!valid) {
                        return;
                    }
                    if (!confValid) {
                        this.$message.error('上户目标配置必须至少存在一条数据！');
                        return;
                    }
                    // 验证上户目标配置时间点是否重复
                    // 取得小时组成简单数组
                    const hours = this.tableData.map(ele => ele.hour);
                    // 使用Set去重，验证初始的length和去重后length是否一致
                    const hourValid = hours.length === [...new Set(hours)].length;
                    
                    if (!hourValid) {
                        this.$message.error('上户目标配置中存在重复的数据，请检查');
                        return;
                    }
                    // 执行保存
                    this.saveInfo();
                } catch (err) {
                    console.log(err)
                }
            },
            // 数据保存
            async saveInfo() {
                try {
                    if (this.isReq) {
                        return;
                    }
                    // 请求中
                    this.isReq = true;
                    this.loading = true;
                    const form = this.ruleForm;
                    const options = {
                        id: this.id,
                        org_id: form.company,
                        city_id: form.cityIds,
                        priority: form.priority,
                        status: form.status,
                        hour_detail: this.tableData
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await api.saveConfigInfo(options);
                    this.isReq = false;
                    this.loading = false;
                    if (code === 0) {
                        this.$router.push({
                            name: 'PriorityConfigList'
                        });
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
                        data: {
                            data,
                            code
                        }
                    } = await commonApi.getAllCityData();
                    if (code === 0) {
                        this.cityList = data || [];
                    }
                    
                } catch (error) {
                    console.warn(error);
                }
            },
            async getConfStatus() {
                try {
                    const {
                        data: {
                            data
                        }
                    } = await commonApi.getCompanyCommonData({
                        // 获取配置生效状态
                        type: 'org_priority_status'
                    });
                    this.statusList = data.org_priority_status || [];
                } catch (error) {
                    console.warn(error);
                }
            },
            // 获取配置初始化信息
            async getInitInfo() {
                try {
                    this.loading = true;
                    const options = {
                        id: this.id
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await api.getInitConfInfo(options);
                    
                    if (code === 0) {
                        const conf = data.config;
                        this.ruleForm.company = conf.org_id;
                        this.ruleForm.cityIds = conf.city_id;
                        this.ruleForm.priority = conf.priority;
                        this.ruleForm.status = conf.status;
                        this.tableData = data.hour_detail;
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
                    } = await commonApi.getDepartList({
                        is_without_julive: false
                    });
                    if (code === 0) {
                        this.belongCompanyList = data || [];
                    }
                } catch (error) {
                    console.warn(error);
                }
            },
            // 修改dialog状态
            closeDialog(e) {
                this.dialogShow = e;
            }
        }
    }
</script>

<style lang="less" scoped>
    .edit-config {
        padding: 20px 30px;
        .normal-input {
            width: 200px;
        }
        .box-wrap {
            display: flex;
            align-items: center;
        }
        .btn-check{
            margin-left: 20px;
        }
        .percent-unit {
            margin-left: 10px;
        }
    }
    .rule-form {
        margin-top: 20px;
        padding: 40px 30px 20px;
        background-color: #fff;
        .number-form {
            width: 200px;
        }
        .add-goal {
            margin-top: 25px;
            line-height: 40px;
            font-size: 16px;
            text-align: center;
            border: 1px dashed #ccc;
            cursor: pointer;
        }
        .notice-msg {
            color: #909399;
        }
    }
</style>