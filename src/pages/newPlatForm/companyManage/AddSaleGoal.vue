<!--
 * @Author: he wei
 * @Date: 2020-09-22 18:02:19
 * @LastEditTime: 2021-04-29 15:44:33
 * @LastEditors: xie bin
 * @Description: 上户目标新增&编辑
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/AddSaleGoal.vue
-->

<template>
    <div
        v-loading.fullscreen.lock="loading"
        class="add-sale-goal">
        <!---面包屑--->
        <el-breadcrumb
            class="bread-crumb"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/companyManage/companySaleGoalList' }">
                公司上户目标
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ navTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单-->
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="180px"
            class="rule-form">
            <el-form-item
                label="选择公司："
                prop="company">
                <el-select
                    v-model="ruleForm.company"
                    class="custom-form"
                    filterable
                    placeholder="请选择活动区域"
                    @change="companyChange">
                    <el-option
                        v-for="item in companyList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="接受订单城市："
                prop="cityIds">
                <el-select
                    filterable
                    clearable
                    multiple
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
            </el-form-item>
            <el-form-item
                label="选择月份："
                prop="date">
                <el-date-picker
                    class="custom-form"
                    v-model="ruleForm.date"
                    type="month"
                    @change="changeMonthInfo"
                    :picker-options="pickerOps"
                    value-format="yyyy-MM"
                    format="yyyy年M月"
                    placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="月上户量(自动计算)：">
                {{ruleForm.date ? `${total}个` : ''}}
            </el-form-item>
            <el-form-item
                v-show="ruleForm.date"
                label="设置每日上户量：">
                <div
                    class="sale-count-box">
                    <div
                        v-for="(item, idx) in saleRules"
                        :key="idx"
                        ref="itemBox"
                        class="item-box">
                        <label class="text-date">{{item.day_time}}：</label>
                        <span
                            class="text-value"
                            v-if="item.is_disabled === '1'">{{item.target_value}}</span>
                        <jl-number-input
                            v-else
                            class="jl-input"
                            v-model="item.target_value"
                            reg="parseInt">
                        </jl-number-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item
                label="是否接受上户进度超额：">
                <el-checkbox
                    v-model="ruleForm.isDayextraVal"
                    true-label="1"
                    false-label="2">
                    接受单日上户进度超额
                </el-checkbox>
                <el-checkbox
                    v-model="ruleForm.isMonthxtraVal"
                    true-label="1"
                    false-label="2">
                    接受单月上户进度超额
                </el-checkbox>
            </el-form-item>
            <el-form-item
                prop="isOpenLimit"
                label="是否开启上户限制：">
                <el-select
                    v-model="ruleForm.isOpenLimit"
                    @change="openLimitChange">
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="ruleForm.isOpenLimit == '1' ? true : false"
                prop="isOpenLimit"
                label="咨询师上户配置：">
                <el-table
                    :data="ruleForm.userConfigData"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="单日上户量上限(个)">
                        <template slot-scope="scoped">
                            <el-form-item
                                :prop="'userConfigData.' + scoped.$index + '.day_order_limit'"
                                :rules="rules.day_order_limit">
                                <jl-number-input
                                    v-model="scoped.row.day_order_limit"
                                    minVal="0"
                                    maxVal="999"
                                    reg="parseInt">
                                </jl-number-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="单月上户量上限(个)">
                        <template slot-scope="scoped">
                            <el-form-item
                                :prop="'userConfigData.' + scoped.$index + '.month_order_limit'"
                                :rules="rules.month_order_limit">
                                <jl-number-input
                                    v-model="scoped.row.month_order_limit"
                                    minVal="0"
                                    maxVal="999"
                                    reg="parseInt">
                                </jl-number-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="适用咨询师范围">
                        <template slot-scope="scoped">
                            <p
                                style="margin-top: 10px;"
                                v-if="scoped.row.employee_id[0] == '-100'">
                                默认咨询师
                            </p>
                            <el-form-item
                                v-else
                                :prop="'userConfigData.' + scoped.$index + '.employee_id'"
                                :rules="rules.employee_id">
                                <search-select-radio
                                    v-model="scoped.row.employee_id"
                                    placeholder="请选择"
                                    :multiple="true"
                                    :chosenObj="scoped.row.employee_list"
                                    clearable
                                    @selectFocus="focusSelect"
                                    :apiInfo="userApi"></search-select-radio>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作">
                        <template slot-scope="scoped">
                            <el-button
                                v-if="scoped.row.employee_id[0] !== '-100'"
                                type="text"
                                @click="deleteItemData(scoped.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    class="btn-add-sale"
                    @click="adSaleConfig">
                    添加咨询师特殊上户配置
                </el-button>
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
    import api from './api/saleGoal';
    import commonApi from './api/common';
    import allCommonApi from '../../../api/commonApi';
    import { selectOptions } from './config/selectOptions';
    import { SearchSelectRadio } from '@/components';
    export default {
        name: 'AddSaleGoal',
        components: {
            SearchSelectRadio
        },
        data() {
            return {
                // 加载loading
                loading: false,
                // 当前页面面包屑标题
                navTitle: "添加上户目标",
                // 表单对象
                ruleForm: {
                    company: '',
                    date: '',
                    cityIds: [],
                    // 是否接受当日上户进度超额
                    isDayextraVal: '2',
                    // 是否接受当月上户进度超额
                    isMonthxtraVal: '2',
                    // 是否开启
                    isOpenLimit: '2',
                    // 咨询师配置模块
                    userConfigData: []
                },
                // 验证规则
                rules: {
                    company: [{ required: true, message: '公司没有填写完成', trigger: 'change' }],
                    date: [{ required: true, message: '月份没有填写完成', trigger: 'blur' }],
                    cityIds: [{ required: true, message: '接受订单城市没有填写完成', trigger: 'change' }],
                    isOpenLimit: [{ required: true, message: '请选择是否开启上户限制', trigger: 'change' }],
                    day_order_limit: [{ required: true, message: '当日上户量上限没有填写完成', trigger: 'blur' }],
                    month_order_limit: [{ required: true, message: '当月上户量上限没有填写完成', trigger: 'blur' }],
                    employee_id: [{ required: true, message: '适用咨询师范围没有填写完成', trigger: 'change' }],
                },
                // 所属公司下拉
                companyList: [],
                // 业务城市下拉了
                cityList: [],
                // 已配置的规则数据
                saleRules: [],
                // 日期选择器设置
                pickerOps: {
                    disabledDate: this.disabledDate
                },
                selectOptions,
                userApi: {
                    api: allCommonApi.getStaffList,
                    params: {
                        q: '',
                        org_id: '',
                        status: '1',
                        role: 'header',
                        filter_id: ''
                    }
                }
            };
        },
        computed: {
            // 计算总数
            total() {
                return this.saleRules.reduce((acc, cur) => acc + Number(cur.target_value), 0);
            }
        },
        created() {
            this.id = this.$route.query.id || '';
            if (this.id !== '') {
                const text = '编辑上户目标';
                this.navTitle = text;
                document.title = text;
            }
        },
        mounted() {
            // 初始化数据
            this.getInitInfo();
            // 获取城市下拉
            this.getCityList();
            // 获取公司下拉
            this.getCompanyList();
        },
        methods: {
            /**
             * @description: 城市下拉改变
             * @param {*} val 当前值
             * @return {*}
             */
            companyChange(val) {
                this.userApi.params.org_id = val;
            },
            openLimitChange(val) {
                if (val == '1') {
                    // 生成一个不重复的数字
                    let date = new Date();
                    let randomNum = (date.getMonth() + 1) + '' + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
                    this.ruleForm.userConfigData = [{
                        limit_sort: randomNum,
                        day_order_limit: '',
                        month_order_limit: '',
                        employee_id: ['-100']
                    }]
                } else {
                    this.ruleForm.userConfigData = [];
                }
            },
            // 下拉获取焦点
            focusSelect() {
                this.userApi.params.filter_id = '';
                this.ruleForm.userConfigData.forEach(item => {
                    this.userApi.params.filter_id += item.employee_id + ','
                });
                this.userApi.params.filter_id = this.userApi.params.filter_id.substring(0, this.userApi.params.filter_id.length - 1);
            },
            // 表单保存校验
            async submitForm() {
                try {
                    const valid = await this.$refs.ruleForm.validate();
                    const validSaleIdx = this.saleRules.findIndex(ele => ele.is_disabled === '2' && ele.target_value === '');
                    if (validSaleIdx >= 0) {
                        // 聚焦未填写的输入框
                        this.$refs.itemBox[validSaleIdx].querySelector('.el-input__inner').focus();
                        this.$message.error(`${this.saleRules[validSaleIdx].day_time}的上户目标必填`);
                    }
                    if (valid && validSaleIdx < 0) {
                        // 执行保存
                        this.saveInfo();
                    }
                } catch (err) {
                    // this.$message.error('请检查必填信息是否填写完整！')
                    console.log(err);
                }
            },
            /**
             * @description: 日期禁用
             * @param {Date} date 日期
             * @return {Boolean} 是否禁用  
             */
            disabledDate(date) {
                let year = new Date().getFullYear();
                let month = new Date().getMonth();
                // 这里取最近三个月
                let lastMonth = month + 2;
                // 获取年月转成时间戳
			    let newDate = new Date(year, lastMonth).getTime();
			    return (
			        date.getTime() < Date.now() || date.getTime() > newDate
			    );
            },
            // 保存数据
            async saveInfo() {
                try {
                    const options = {
                        id: this.id,
                        org_id: this.ruleForm.company,
                        city_id: this.ruleForm.cityIds,
                        month: this.ruleForm.date,
                        total_target_value: this.total,
                        day_value_list: this.saleRules,
                        is_order_limit: this.ruleForm.isOpenLimit,
                        is_day_extra: this.ruleForm.isDayextraVal,
                        is_month_extra: this.ruleForm.isMonthxtraVal,
                        order_limit_list: this.ruleForm.userConfigData
                    };
                    console.log(options)
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await api.saveGoalInfo(options);
                    if (code === 0) {
                        this.$router.push('/companyManage/companySaleGoalList')
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            // 添加上户配置
            adSaleConfig() {
                // 生成一个不重复的数字
                let date = new Date();
                let randomNum = (date.getMonth() + 1) + '' + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
                this.ruleForm.userConfigData.push({
                    limit_sort: randomNum,
                    month_order_limit: '',
                    employee_id: [],
                    day_order_limit: ''
                })
            },
            /**
             * @description: 删除当前上户配置
             * @param {*} index 索引
             * @return {*}
             */
            deleteItemData(index) {
                this.ruleForm.userConfigData.splice(index, 1);
            },
            /**
             * @description: 月份切换重新获取数据
             * @param {String} val 月份 
             */
            async changeMonthInfo(val) {
                try {
                    this.loading = true;
                    const opstions = {
                        id: this.id,
                        month: val
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.changeMonthInfo(opstions);
                    this.loading = false;
                    if (code === 0) {
                        this.saleRules = data || [];
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.loading = false;
                    console.warn(error);
                }
            },
            // 获取初始化数据
            async getInitInfo() {
                try {
                    this.loading = true;
                    const options = {
                        id: this.id
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.getInitGoalInfo(options);
                    this.loading = false;
                    if (code === 0) {
                        this.ruleForm.company = data.org_id.toString();
                        this.userApi.params.org_id = data.org_id.toString();
                        this.ruleForm.date = data.month;
                        this.ruleForm.cityIds = data.city_id || [];
                        this.saleRules = data.day_value_list;
                        this.ruleForm.userConfigData = data.order_limit_list || [];
                        this.ruleForm.isOpenLimit = data.is_order_limit;
                        this.ruleForm.isMonthxtraVal = data.is_month_extra;
                        this.ruleForm.isDayextraVal = data.is_day_extra;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.loading = false;
                    console.warn(error);
                }
            },
            // 获取下拉城市
            async getCityList() {
                try {
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getAllCityData();
                    if (code === 0) {
                        this.cityList = data || [];
                    }
                    
                } catch (error) {
                    console.warn(error);
                }
            },
            // 获取公司下拉
            async getCompanyList() {
                try {
                    const query = {
                        is_without_julive: false,
                        q: ''
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getDepartList(query);
                    if (code === 0) {
                        this.companyList = data || [];
                    }
                } catch (error) {
                    console.warn(error);
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .add-sale-goal {
        padding: 20px 30px;
        .normal-input {
            width: 200px;
        }
    }
    .rule-form {
        margin-top: 20px;
        padding: 30px;
        background-color: #fff;
        .custom-form {
            width: 240px;
        }
        /deep/ .cell {
            min-height: 57px;
        }
        .btn-add-sale {
            width: 100%;
            margin-top: 20px;
        }
    }
    .sale-count-box {
        display: flex;
        flex-wrap: wrap;
        .item-box {
            margin: 0 25px 15px 0;
            /deep/ .el-form-item__error {
                left: 118px;
            }
        }
        .text-value {
            display: inline-block;
            min-width: 30px;
        }
        .jl-input {
            display: inline-block;
            width: 120px;
            &.active {
                /deep/ .el-input__inner {
                    border-color: #f56c6c;
                }
            }
        }
    }
</style>