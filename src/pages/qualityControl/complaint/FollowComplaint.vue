<!--
 * @author: kangxue
 * @Date: 2020-07-14 18:45:52
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-22 15:20:09
 * @description: 跟进查看客诉问题
-->
<template>
    <div class="container-box"
        v-loading="loading">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/complaint/complaintList' }">客诉问题管理</el-breadcrumb-item>
            <el-breadcrumb-item>跟进查看客诉问题</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box form-box">
            <div class="main-title">跟进查看客诉问题</div>
            <el-form ref="form"
                :model="form"
                :rules="rules"
                class="my-form"
                label-width="150px">
                <el-form-item label="投诉类型">
                    {{initData.complaint_type_text}}
                </el-form-item>
                <el-form-item label="订单ID">
                    {{initData.order_id}}
                </el-form-item>
                <el-form-item label="城市">
                    {{initData.city_id_text}}
                </el-form-item>
                <el-form-item label="客户姓名">
                    {{initData.user_realname}}
                </el-form-item>
                <el-form-item label="客户电话">
                    {{initData.user_mobile}}
                </el-form-item>
                <el-form-item label="客户投诉时间">
                    {{initData.complaint_time}}
                </el-form-item>
                <el-form-item label="客诉来源">
                    {{initData.complaint_source_text}}
                </el-form-item>
                <template v-if="initData.can_edit_reason">
                    <el-form-item label="投诉对象及原因"
                        prop="reason"
                        class="form-item-margin">
                        <el-cascader v-model="form.reason"
                            class="reason-width"
                            :options="reasonOptions"
                            separator=" > "
                            :props="{ checkStrictly: true, label: 'name' }"
                            clearable></el-cascader>
                    </el-form-item>
                    <el-form-item v-if="checkComplainType"
                        label="是否万单问题"
                        prop="isOrderQuestion"
                        class="form-item-margin">
                        <el-select v-model="form.isOrderQuestion"
                            placeholder="请选择是否万单问题">
                            <el-option v-for="item in questionOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="投诉对象">
                        {{initData.complaint_category_text}}
                    </el-form-item>
                    <el-form-item label="一级原因">
                        {{initData.one_cause_text || ''}}
                    </el-form-item>
                    <el-form-item label="二级原因">
                        {{initData.two_cause_text || ''}}
                    </el-form-item>
                    <el-form-item label="三级原因">
                        {{initData.three_cause_text || ''}}
                    </el-form-item>
                    <el-form-item label="是否万单问题"
                        v-if="checkComplainType">
                        {{initData.is_many_order_text}}
                    </el-form-item>
                </template>
                <el-form-item label="客户反馈内容">
                    {{initData.complaint_desc}}
                </el-form-item>
                <!-- 投诉类型选择是以下这几项：投诉、售后、更换咨询师、客户异议、修改评价 时展示 -->
                <template v-if="checkComplainType">
                    <el-form-item label="咨询师">
                        {{initData.employee_id_text}}
                    </el-form-item>
                    <el-form-item label="绩效责任上级">
                        {{initData.adjust_leader_id_text}}
                    </el-form-item>
                    <el-form-item label="要求联系时间">
                        {{initData.request_contact_time}}
                    </el-form-item>
                </template>
                <el-form-item label="转交部门">
                    {{initData.transfer_department_text}}
                </el-form-item>
                <el-form-item label="转交人员">
                    {{initData.transferor_text}}
                </el-form-item>
                <el-form-item label="订单状态">
                    {{initData.order_status_text}}
                </el-form-item>
                <template v-if="initData.can_edit_suggestion">
                    <el-form-item label="服管处理建议"
                        prop="suggest"
                        class="form-item-margin">
                        <el-input type="textarea"
                            placeholder="请输入服管处理建议，最多300字，超出无法输入"
                            v-model="form.suggest"
                            maxlength="300"
                            rows="3"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item v-if="initData.show_suggestion"
                        label="服管处理建议">
                        {{initData.service_handle_desc}}
                    </el-form-item>
                </template>
                <el-form-item label="客诉材料">
                    <show-material v-if="initData.file"
                        :imgList="initData.file.pic"
                        imgUrl="file_path_full"
                        :audioList="initData.file.audio"
                        audioUrl="file_path_full"></show-material>
                </el-form-item>
            </el-form>
        </div>
        <!-- 跟进详情 -->
        <follow-list ref="followList"
            :followId="id"></follow-list>
        <!-- 操作 -->
        <btn-opts ref="btnOpts"
            :btns="initData.buttons"
            :options="formOptions"
            :formInfo="form"
            :updateTime="initData.update_datetime"
            @saveSuggest="saveSuggest"
            @reload="reload"></btn-opts>
    </div>
</template>

<script>
import api from './api/complaint';
import FollowList from './components/FollowList';
import ShowMaterial from './components/ShowMaterial';
import BtnOpts from './components/BtnOpts';
// 投诉类型【投诉、售后、更换咨询师、客户异议、修改评价】组成的数组
const typeArr = ['1', '2', '3', '4', '5'];
export default {
    components: {
        FollowList,
        ShowMaterial,
        BtnOpts
    },
    data() {
        return {
            // 客诉ID
            id: this.$route.query.id,
            // 初始数据
            initData: {},
            // 表单数据
            form: {
                // 是否万单问题
                isOrderQuestion: '',
                // 投诉对象及原因
                reason: [],
                // 服管处理建议
                suggest: ''
            },
            // 表单验证规则
            rules: {
                // 是否万单问题  投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时必填
                isOrderQuestion: [{ required: true, message: '是否万单问题不能为空', trigger: 'change' }],
                // 服管处理建议
                suggest: [{ required: true, message: '服管处理建议不能为空', trigger: 'blur' }]
            },
            // 加载
            loading: false,
            // 投诉对象及原因下拉列表
            reasonOptions: [],
            // 是否万单问题下拉列表
            questionOptions: [],
            // 是否重复提交
            isSubmit: false,
            // 按钮操作的表单中需要的下拉数据
            formOptions: {}
        };
    },
    mounted() {
        this.getOptions();
        this.getInitData();
    },
    computed: {
        /**
         * @description: 验证投诉类型选择是否是以下这几项：投诉、售后、更换咨询师、客户异议、修改评价
         * @return: 是这几项是返回true（展示是否万单，咨询师，绩效责任上级，要求联系时间），不是这几项时返回false
         */
        checkComplainType: function() {
            return this.initData.complaint_type && typeArr.indexOf(this.initData.complaint_type) !== -1;
        }
    },
    methods: {
        // 获取静态下拉数据
        async getOptions() {
            try {
                const {
                    data: { code, msg, data }
                } = await api.commonOptions();
                if (code === 0) {
                    this.reasonOptions = data.complaint_cause;
                    this.questionOptions = data.is_wandan;
                    this.formOptions = {
                        performance: data.performance_impact,
                        readLine: data.red_yellow_line
                    };
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 初始化数据
        async getInitData() {
            try {
                this.loading = true;
                const {
                    data: { code, msg, data }
                } = await api.getComplaintDetail({
                    id: this.id,
                    type: 1
                });
                if (code === 0) {
                    this.initData = data;
                    this.form.isOrderQuestion = data.is_many_order;
                    this.form.reason = this.getReasonArr(data);
                    this.form.suggest = data.service_handle_desc || '';
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        /**
         * @description: 获取投诉对象一二三级原因拼接成数组
         * @param {Object}  data  数据
         * @return: 拼接的数组
         */
        getReasonArr(data) {
            let reason = [];
            if (data.complaint_category) {
                reason.push(data.complaint_category);
            }
            if (data.one_cause) {
                reason.push(data.one_cause);
            }
            if (data.two_cause) {
                reason.push(data.two_cause);
            }
            if (data.three_cause) {
                reason.push(data.three_cause);
            }
            return reason;
        },
        // 保存服管处理建议问题
        saveSuggest() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    try {
                        const suggestType = '7';
                        let params = {
                            complaints_id: this.id,
                            follow_type: suggestType,
                            update_datetime: this.initData.update_datetime,
                            yw_complaints: {
                                complaint_category: this.form.reason[0] || '',
                                one_cause: this.form.reason[1] || '',
                                two_cause: this.form.reason[2] || '',
                                three_cause: this.form.reason[3] || '',
                                is_many_order: this.form.isOrderQuestion,
                                service_handle_desc: this.form.suggest
                            }
                        };
                        const {
                            data: { code, msg, data }
                        } = await api.saveSuggestion(params);
                        this.$refs.btnOpts.saveBack({ code, msg, data }, suggestType, '保存成功');
                        this.isSubmit = false;
                    } catch (err) {
                        this.isSubmit = false;
                    }
                }
            });
        },
        // 更新页面   跟进按钮操作时，如果提示任务变更了，需要更新页面
        reload() {
            this.getInitData();
            this.$refs.followList.getFollowList();
        }
    }
};
</script>

<style lang="less" scoped>
.v-box {
    padding-top: 20px;
    .my-form {
        .el-form-item {
            margin-bottom: 0px;
            &.form-item-margin {
                margin: 10px 0 20px;
            }
        }
        .reason-width {
            width: 100%;
        }
    }
}
.fix-buttons {
    // position: fixed;
    left: 30px;
    right: 30px;
    bottom: 0;
    z-index: 100;
    padding: 10px;
    background: #fff;
    text-align: center;
    margin-top: -20px;
    margin-bottom: 20px;
    .el-button {
        margin: 0 20px;
    }
}
</style>