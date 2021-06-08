<!--
 * @author: kangxue
 * @Date: 2020-09-03 23:26:29
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-02-22 15:13:26
 * @description: 新增提报弹窗
-->
<template>
    <el-dialog title="新增提报"
        :visible.sync="dialogVisble"
        @close="cancel"
        v-loading="loading"
        :close-on-click-modal="false"
        width="750px"
        center>
        <div class="form-content">
            <el-form :model="basicForm"
                :rules="basicRules"
                label-width="100px"
                ref="basicForm">
                <div class="form-title">基础信息</div>
                <el-form-item prop="name"
                    label="提报名称">
                    <el-input placeholder="请输入提报名称"
                        maxlength="20"
                        v-model.trim="basicForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="description"
                    label="提报描述">
                    <el-input type="textarea"
                        placeholder="简单描述，背景描述，最多100字，超出无法输入"
                        maxlength="100"
                        :autosize="{ minRows: 3}"
                        resize="none"
                        v-model.trim="basicForm.description"></el-input>
                </el-form-item>
                <el-form-item prop="reportType"
                    label="提报类型">
                    <el-select v-model="basicForm.reportType"
                        placeholder="请选择提报类型">
                        <el-option v-for="item in reportTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="city"
                    ref="city"
                    label="提报城市">
                    <select-city v-model="basicForm.city"
                        class="select-city"
                        filterable
                        @input="getCity"
                        :showMore="true"></select-city>
                </el-form-item>
                <el-form-item prop="dateTime"
                    label="提报时间">
                    <el-date-picker v-model="basicForm.dateTime"
                        type="datetimerange"
                        value-format="timestamp"
                        :default-time="['00:00:00', '23:59:59']"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="user"
                    label="负责人">
                    <search-select-radio v-model="basicForm.user"
                        placeholder="请选择负责人"
                        clearable
                        :apiInfo="userApi"
                        :chosenObj="chosenUser"></search-select-radio>
                </el-form-item>
            </el-form>
            <div class="form-title">详细信息</div>
            <dynamic-form ref="dynamicForm"
                :initForm="initForm"
                @getFormInfo="getFormInfo"></dynamic-form>
        </div>
        <div slot="footer"
            class="dialog-footer">
            <el-button type="primary"
                @click="confirm">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import api from '../api/api';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
import SelectCity from '@/components/SelectCity';
import DynamicForm from '../components/DynamicForm';
import { mapState } from 'vuex';
export default {
    name: 'add-report-dialog',
    components: {
        SearchSelectRadio,
        SelectCity,
        DynamicForm
    },
    props: {
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 提报类型下拉数据
        reportTypeList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            // 加载
            loading: false,
            // 弹窗展示
            dialogVisble: this.visible,
            // 城市下拉
            cityList: [],
            // 提报类型下拉
            typeList: [],
            // 负责人下拉api
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all'
                }
            },
            // 初始选中的负责人就是当前登录人
            chosenUser: {},
            // 基础信息表单
            basicForm: {
                // 提报名称
                name: '',
                // 提报描述
                description: '',
                // 提报类型
                reportType: '',
                // 提报城市
                city: [],
                // 提报时间
                dateTime: [],
                // 负责人
                user: ''
            },
            // 基础信息表单验证规则
            basicRules: {
                name: [{ required: true, message: '请输入提报名称', trigger: 'blur' }],
                description: [{ required: true, message: '请输入提报描述', trigger: 'blur' }],
                reportType: [{ required: true, message: '请选择活动提报', trigger: 'change' }],
                city: [{ required: true, message: '请选择提报城市', trigger: 'blur' }],
                dateTime: [{ required: true, message: '请选择提报时间', trigger: 'change' }],
                user: [{ required: true, message: '请选择负责人', trigger: 'change' }]
            },
            // 初始表单数据
            initForm: [],
            // 提报活动详细信息
            detailForm: null,
            // 是否重复提交
            isSubmit: false
        };
    },
    computed: {
        // 获取登录人的名字和账号和工号
        ...mapState({
            uid: state => state.userInfo.uid + '',
            employeeName: state => state.userInfo.employeeName,
            jobNumber: state => state.userInfo.job_number
        })
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
            if (newVal) {
                this.getDetailForm(this.basicForm.reportType);
            }
        },
        // 监听提报类型
        reportTypeList(newVal) {
            if (newVal && newVal.length > 0) {
                this.basicForm.reportType = newVal[0].value;
            }
        },
        uid(newVal) {
            this.chosenUser = {
                value: this.uid,
                name: this.employeeName + '_' + this.jobNumber
            };
            this.basicForm.user = this.uid;
        }
    },
    methods: {
        /**
         * @description: 根据提报类型获取详情表单
         * @param {type}
         * @return {type}
         */
        async getDetailForm(type) {
            try {
                this.loading = true;
                let params = {
                    submission_type: type
                };
                const {
                    data: { code, msg, data }
                } = await api.getFormByType(params);
                if (code === 0) {
                    this.initForm = data;
                } else {
                    this.$message.error(msg);
                }
                this.loading = false;
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        /**
         * @description: 城市组件返回的值，有值的话就清楚校验
         * @param {Array} val   城市
         * @return {type}
         */
        getCity(val) {
            if (val && val.length > 0) {
                this.$refs.city.clearValidate();
            }
        },
        // 关闭弹窗时重置表单
        cancel() {
            this.$refs.basicForm.resetFields();
            this.$refs.dynamicForm.resetForm();
            this.$emit('cancel');
        },
        /**
         * @description: 获取万能表单的值
         * @param {Object}  info  表单的值
         * @return {type}
         */
        getFormInfo(info) {
            this.detailForm = info;
        },
        confirm() {
            const basicValidate = new Promise((resolve, reject) => {
                this.$refs['basicForm'].validate(valid => {
                    if (valid) {
                        resolve(this.basicForm);
                    } else {
                        reject('基础信息验证错误');
                    }
                });
            });
            const detailValidate = new Promise((resolve, reject) => {
                this.$refs.dynamicForm.validateForm();
                if (this.detailForm) {
                    resolve(this.detailForm);
                } else {
                    reject('详细信息验证错误');
                }
            });
            Promise.all([basicValidate, detailValidate])
                .then(async result => {
                    // 防止重复提交
                    if (!this.isSubmit) {
                        this.isSubmit = true;
                    }
                    try {
                        let params = {
                            name: result[0].name,
                            desc: result[0].description,
                            type: result[0].reportType,
                            start_time: result[0].dateTime[0] / 1000,
                            end_time: result[0].dateTime[1] / 1000,
                            submission_citys: result[0].city,
                            manager: result[0].user,
                            config_field: result[1]
                        };
                        const {
                            data: { code, msg }
                        } = await api.addSubmission(params);
                        if (code === 0) {
                            this.$emit('confirm');
                        } else {
                            this.$message.error(msg);
                        }
                        this.isSubmit = false;
                    } catch (err) {
                        this.isSubmit = false;
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>
<style lang="less" scoped>
.form-content {
    max-height: 500px;
    overflow: auto;
    padding-right: 20px;
}
.form-title {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
}
.select-city {
    width: 100%;
}
</style>