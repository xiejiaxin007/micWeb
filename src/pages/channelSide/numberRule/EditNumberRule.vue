<!--
 * @author: kangxue
 * @Date: 2020-04-17
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-06 09:41:28
 * @description: 智能报备2.0新增编辑
-->
<template>
    <div class="edit-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/numberRule/numberRuleList' }">序号规则列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{id ? '编辑' : '新增'}}序号规则</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="form-box">
            <div class="main-title">{{id ? '编辑' : '新增'}}序号规则</div>
            <el-form ref="form"
                :model="form"
                :rules="rules"
                v-loading="loading"
                label-width="200px">
                <el-form-item label="序号名称"
                    prop="name">
                    <el-input class="input-width"
                        v-model="form.name"
                        maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="累计频率"
                    prop="rateType">
                    <el-select v-model="form.rateType"
                        placeholder="请选择累计频率">
                        <el-option v-for="item in rateTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.rateType === '4'"
                    label="开始日期"
                    prop="startDate">
                    <el-date-picker type="date"
                        placeholder="选择日期"
                        v-model="form.startDate"
                        value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="form.rateType && form.rateType !== '5'"
                    label="序号格式"
                    prop="numberType">
                    <el-select v-model="form.numberType"
                        placeholder="请选择序号格式">
                        <el-option label="1，2，3，……99"
                            value="1"></el-option>
                        <el-option label="01，02，03，……99"
                            value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.rateType && form.rateType !== '5'"
                    label="初次累计的开始值"
                    prop="initValue">
                    <el-input-number v-model="form.initValue"
                        :min="1"
                        :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item v-if="form.rateType && form.rateType !== '5'"
                    label="以后每次重新累计的开始值"
                    prop="againValue">
                    <el-input-number v-model="form.againValue"
                        :min="1"
                        :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item v-if="form.rateType && form.rateType !== '5'"
                    label="累计范围"
                    prop="rangeType">
                    <el-select v-model="form.rangeType"
                        placeholder="请选择累计范围">
                        <el-option label="首访"
                            value="1"></el-option>
                        <el-option label="首访+复访"
                            value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <router-link class="router-link"
                        :to="{path: '/numberRule/numberRuleList'}">
                        <el-button>取消</el-button>
                    </router-link>
                    <el-button type="primary"
                        @click="save">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import ruleApi from './api/ruleApi';
export default {
    data() {
        return {
            // 编辑ID，创建无id
            id: this.$route.query.id,
            // 累计频率数组 1.按天 2.按周 3.按月 4.从某天开始累计 5.手动统计
            rateTypeList: [
                { value: '1', name: '按天' },
                { value: '2', name: '按周' },
                { value: '3', name: '按月' },
                { value: '4', name: '从某天开始累计' },
                { value: '5', name: '手动统计' }
            ],
            form: {
                // 序号名称
                name: '',
                // 累计频率
                rateType: '',
                // 开始日期
                startDate: '',
                // 序号格式
                numberType: '',
                // 初次累计的开始值
                initValue: '',
                // 以后每次重新累计的开始值
                againValue: '',
                // 累计范围
                rangeType: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入序号名称',
                        trigger: 'blur'
                    }
                ],
                rateType: [
                    {
                        required: true,
                        message: '请选择累计频率',
                        trigger: 'change'
                    }
                ],
                startDate: [
                    {
                        required: true,
                        message: '请选择开始日期',
                        trigger: 'change'
                    }
                ],
                numberType: [
                    {
                        required: true,
                        message: '请选择序号格式',
                        trigger: 'change'
                    }
                ],
                initValue: [
                    {
                        required: true,
                        message: '请输入初次累计的开始值',
                        trigger: 'blur'
                    }
                ],
                againValue: [
                    {
                        required: true,
                        message: '请输入以后每次重新累计的开始值',
                        trigger: 'blur'
                    }
                ],
                rangeType: [
                    {
                        required: true,
                        message: '请选择累计范围',
                        trigger: 'change'
                    }
                ]
            },
            loading: false,
            // 是否重复提交
            isSubmit: false
        };
    },
    methods: {
        // 初始化数据
        async initData() {
            try {
                this.loading = true;
                const {
                    data: { code, msg, data }
                } = await ruleApi.getNumberRuleInfo({
                    id: this.id
                });
                if (code === 0) {
                    if (data.project_name) {
                        this.$message.error('当前序号规则已关联楼盘，不可编辑');
                        this.$router.push({
                            path: '/numberRule/numberRuleList'
                        });
                    }
                    this.form = {
                        name: data.name,
                        rateType: data.rate_type,
                        startDate: data.start_datetime,
                        numberType: data.number_type,
                        initValue: data.init_value,
                        againValue: data.again_value,
                        rangeType: data.range_type
                    };
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        save() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    try {
                        let params = {
                            name: this.form.name,
                            rate_type: this.form.rateType
                        };
                        if (this.form.rateType === '4') {
                            params.start_datetime = this.form.startDate;
                        }
                        if (this.form.rateType !== '5') {
                            params.number_type = this.form.numberType;
                            params.init_value = this.form.initValue;
                            params.again_value = this.form.againValue;
                            params.range_type = this.form.rangeType;
                        }
                        if (this.id) {
                            params.number_id = this.id;
                        }
                        const {
                            data: { code, msg, data }
                        } = await ruleApi.saveNumberRuleInfo(params);
                        if (code === 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.$router.push({
                                path: '/numberRule/numberRuleInfo',
                                query: {
                                    id: data.id || this.id
                                }
                            });
                            this.isSubmit = false;
                        } else {
                            this.$message.error(msg);
                            this.isSubmit = false;
                        }
                    } catch (err) {
                        this.isSubmit = false;
                    }
                }
            });
        }
    },
    mounted() {
        if (this.id) {
            this.initData();
        }
    }
};
</script>

<style scoped lang="less">
.form-box {
    background: #fff;
    padding: 20px 0 20px 20px;
    margin-bottom: 20px;
    .input-width {
        width: 350px;
    }
    .el-form-item:last-child {
        margin: 0;
    }
}
</style>