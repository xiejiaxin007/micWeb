<!--
 * @Name: 回款流程编辑页
 * @Description: 回款流程编辑页
 * @Author: kangxue
 * @Date: 2020-04-23
-->
<template>
    <div class="edit-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/fundsBack/fundsConfig' }">回款流程配置管理页</el-breadcrumb-item>
            <el-breadcrumb-item>回款流程配置页</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="form-box"
            v-loading="loading">
            <div class="main-title">回款流程配置页</div>
            <el-form ref="form"
                :model="form"
                :rules="rules"
                label-width="80px">
                <el-form-item label="回款流程"
                    prop="name">
                    <el-input v-model="form.name"
                        maxlength="30"
                        placeholder="给回款流程命名，方便查找及匹配到合同。比如：北京万科开发商的回款流程"></el-input>
                </el-form-item>
                <el-form-item label="标准流程"
                    v-if="id">
                    <el-input class="input-width"
                        disabled
                        :value="id === '1' ? '是' : '否'"></el-input>
                </el-form-item>
                <div class="red tips">提示：成交单「1-核对业绩」的开始时间=min（单笔预测回款达到回款子条件的时间，网签时间加上30天）</div>
                <el-table border
                    :data="list"
                    size="small"
                    row-class-name="row"
                    cell-class-name="column"
                    :highlight-current-row="true"
                    :header-cell-style="{'background': '#f8f8f8'}">
                    <el-table-column min-width="50"
                        prop="stage_type"
                        label="序号"
                        align="left"></el-table-column>
                    <el-table-column min-width="50"
                        prop="stage_name"
                        label="阶段"
                        align="left"></el-table-column>
                    <el-table-column prop="stage_action"
                        min-width="220"
                        label="阶段动作"
                        align="left"></el-table-column>
                    <el-table-column min-width="100"
                        align="left">
                        <template slot="header">
                            <span class="red">*</span>是否有此阶段
                        </template>
                        <template slot-scope="scope">
                            <div v-if="scope.row.stage_type === '1' || scope.row.stage_type === '2' || scope.row.stage_type === '7'">
                                是
                            </div>
                            <div v-else>
                                <el-radio-group v-model="form[scope.row.stage_type].isOpen">
                                    <el-radio :label="item.value"
                                        v-for="item in initSelect.is_open_list"
                                        :key="item.value">{{item.name}}</el-radio>
                                </el-radio-group>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        align="left">
                        <template slot="header">
                            <span class="red">*</span>阶段跟进结束周期
                        </template>
                        <template slot-scope="scope">
                            <el-radio-group v-model="form[scope.row.stage_type].dateType"
                                v-show="form[scope.row.stage_type].isOpen === '1'"
                                @change="changeDate(scope.row.stage_type)"
                                class="radio-select-list">
                                <div class="radio-item">
                                    <el-radio :label="'1'">
                                        固定日期
                                    </el-radio>
                                    <el-select v-model="form[scope.row.stage_type].fixedDateType1"
                                        size="small"
                                        :disabled="form[scope.row.stage_type].dateType === '2'"
                                        placeholder="请选择"
                                        @change="changeFixDate(scope.row.stage_type)">
                                        <el-option v-for="item in initSelect.fixed_date_type_list"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form[scope.row.stage_type].fixedDate1"
                                        v-show="form[scope.row.stage_type].fixedDateType1 === '1' || form[scope.row.stage_type].fixedDateType1 === '2'"
                                        :disabled="form[scope.row.stage_type].dateType === '2'"
                                        size="small"
                                        placeholder="请选择">
                                        <el-option v-for="item in 31"
                                            :key="item"
                                            :label="item+'号'"
                                            :value="item+''">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form[scope.row.stage_type].fixedDate1"
                                        v-show="form[scope.row.stage_type].fixedDateType1 === '3' || form[scope.row.stage_type].fixedDateType1 === '4'"
                                        :disabled="form[scope.row.stage_type].dateType === '2'"
                                        size="small"
                                        placeholder="请选择">
                                        <el-option v-for="item in initSelect.week_list"
                                            :key="item.value"
                                            :label="'周'+item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="radio-item">
                                    <el-radio :label="'2'">
                                        固定天数
                                    </el-radio>
                                    <jl-number-input maxlength="3"
                                        reg="int"
                                        minVal="1"
                                        maxVal="720"
                                        :disabled="form[scope.row.stage_type].dateType === '1'"
                                        size="small"
                                        v-model="form[scope.row.stage_type].fixedDate2"
                                        placeholder="请输入">
                                    </jl-number-input>
                                    <el-select v-model="form[scope.row.stage_type].fixedDateType2"
                                        size="small"
                                        :disabled="form[scope.row.stage_type].dateType === '1'"
                                        placeholder="请选择">
                                        <el-option v-for="item in initSelect.fixed_day_list"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-radio-group>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120"
                        align="left">
                        <template slot="header">
                            此阶段核心对接人
                            <a class="a-link"
                                :href="addPartnerUrl"
                                target="_blank">找不到人去添加</a>
                        </template>
                        <template slot-scope="scope">
                            <search-select-radio v-show="form[scope.row.stage_type].isOpen === '1'"
                                placeholder="请选择对接人"
                                v-model="form[scope.row.stage_type].user"
                                :apiInfo="userApi"
                                :chosenObj="form[scope.row.stage_type].contacter">
                            </search-select-radio>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="btns-box">
                    <router-link to="/fundsBack/fundsConfig">
                        <el-button>取消</el-button>
                    </router-link>
                    <el-button type="primary"
                        @click="save">提交</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from './api/followApi';
    import commonApi from '@/api/commonApi';
    import { SearchSelectRadio } from '@/components';
    export default {
        components: {
            SearchSelectRadio
        },
        data() {
            return {
                // 编辑ID，创建无id
                id: this.$route.query.id,
                // 加载
                loading: false,
                // 表单
                form: {
                    // 回款流程名称
                    name: '',
                    '1': {},
                    '2': {},
                    '3': {},
                    '4': {},
                    '5': {},
                    '6': {},
                    '7': {}
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: '请输入回款流程名称',
                            trigger: 'blur'
                        }
                    ]
                },
                // 初始化下拉列表
                initSelect: {},
                // 配置列表
                list: [],
                // 核心对接人下拉api配置
                userApi: {
                    api: commonApi.getPartner,
                    method: 'get',
                    params: {
                        q: ''
                    }
                },
                // 添加对接人链接
                addPartnerUrl: '',
                // 重复提交
                flag: true
            };
        },
        methods: {
            // 初始化数据
            async initData() {
                try {
                    this.loading = true;
                    let params = {
                        id: this.id || ''
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.initEditFundsBack(params);
                    if (code === 0) {
                        this.list = data.list;
                        this.initSelect = data.init_select;
                        this.addPartnerUrl = data.add_partner_url;
                        this.setFormData(data.process_name, data.list);
                        this.loading = false;
                    } else {
                        this.$message(msg);
                        this.loading = false;
                    }
                } catch (err) {}
            },
            /**
             * 重组form表单数据
             * @param {String} name 回款流程名称
             * @param {Array} list 回款流程列表
             */
            setFormData(name, list) {
                if (this.id) {
                    this.form.name = name;
                    for (var i = 0; i < list.length; i++) {
                        let key = list[i].stage_type;
                        this.form[key] = {
                            stageId: list[i].stage_id,
                            stageType: list[i].stage_type,
                            isOpen: list[i].is_open,
                            // 固定日期，固定天数
                            dateType: list[i].date_type,
                            // 固定日期：1.当月 2.下月 3.当周 4.下周
                            fixedDateType1:
                                list[i].date_type === '1'
                                    ? list[i].fixed_date_type
                                    : '',
                            // 固定天数： 5.工作日 6.自然日
                            fixedDateType2:
                                list[i].date_type === '2'
                                    ? list[i].fixed_date_type
                                    : '',
                            // 固定日期：月存几号 ，周存周几
                            fixedDate1:
                                list[i].date_type === '1' ? list[i].fixed_date : '',
                            // 固定天数：天数存几天
                            fixedDate2:
                                list[i].date_type === '2' ? list[i].fixed_date : '',
                            // 核心对接人
                            user: list[i].contacter ? list[i].contacter.value : '',
                            contacter: list[i].contacter || {}
                        };
                    }
                } else {
                    for (var j = 0; j < list.length; j++) {
                        let key = list[j].stage_type;
                        this.form[key] = {
                            stageId: list[j].stage_id,
                            stageType: list[j].stage_type,
                            isOpen: list[j].is_open,
                            dateType: list[j].date_type,
                            fixedDateType1: '',
                            fixedDateType2: '5',
                            fixedDate1: '',
                            fixedDate2: '',
                            user: '',
                            contacter: {}
                        };
                    }
                }
            },
            /**
             * 固定日期/固定天数选择，另一个清空不能填写
             * @param {string} key 回款流程阶段id
             */
            changeDate(key) {
                let dataType = this.form[key].dateType;
                if (dataType === '1') {
                    // 选择固定日期，固定天数清空
                    this.form[key].fixedDateType2 = '';
                    this.form[key].fixedDate2 = '';
                } else {
                    // 选择固定天数，固定日期清空
                    this.form[key].fixedDateType1 = '';
                    this.form[key].fixedDate1 = '';
                    this.form[key].fixedDateType2 = '5';
                }
            },
            /**
             * 固定日期选择，切换时后面的几号，周几都清空
             * @param {string} key 回款流程阶段id
             */
            changeFixDate(key) {
                this.form[key].fixedDate1 = '';
            },
            // 获取保存的params数据
            getParamsInfo() {
                let params = {
                    process_name: this.form.name
                };
                let arr = [];
                for (var i in this.form) {
                    if (i !== 'name') {
                        let obj = {
                            stage_id: this.form[i].stageId,
                            stage_type: this.form[i].stageType,
                            is_open: this.form[i].isOpen,
                            contacter: this.form[i].user || 0
                        };
                        if (this.form[i].isOpen === '1') {
                            if (this.form[i].dateType === '1') {
                                // 固定日期判断必填
                                if (
                                    !this.form[i].fixedDateType1 ||
                                    !this.form[i].fixedDate1
                                ) {
                                    this.$message.error(
                                        '必填字段填写完整，否则无法保存'
                                    );
                                    return false;
                                }
                            } else if (this.form[i].dateType === '2') {
                                // 固定天数判断必填
                                if (
                                    !this.form[i].fixedDateType2 ||
                                    !this.form[i].fixedDate2
                                ) {
                                    this.$message.error(
                                        '必填字段填写完整，否则无法保存'
                                    );
                                    return false;
                                }
                            }
                            obj.date_type = this.form[i].dateType;
                            obj.fixed_date_type =
                                this.form[i].dateType === '1'
                                    ? this.form[i].fixedDateType1
                                    : this.form[i].fixedDateType2;
                            obj.fixed_date =
                                this.form[i].dateType === '1'
                                    ? this.form[i].fixedDate1
                                    : this.form[i].fixedDate2;
                        } else {
                            obj.date_type = '';
                            obj.fixed_date_type = '';
                            obj.fixed_date = '';
                        }
                        arr.push(obj);
                    }
                }
                params.data_list = arr;
                return params;
            },
            // 提交保存
            save() {
                this.$refs['form'].validate(async valid => {
                    if (valid) {
                        let params = this.getParamsInfo();
                        if (!params) {
                            return false;
                        }
                        if (!this.flag) return;
                        this.flag = false;
                        try {
                            let returnMsg;
                            if (this.id) {
                                params.id = this.id;
                                returnMsg = await api.editFundsBack(params);
                            } else {
                                returnMsg = await api.addFundsBack(params);
                            }
                            let {
                                data: { code, msg, data }
                            } = returnMsg;
                            if (code === 0) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.flag = true;
                                this.$router.push({
                                    path: '/fundsBack/fundsConfigInfo',
                                    query: {
                                        id: data.id
                                    }
                                });
                            } else {
                                this.$message.error(msg);
                                this.flag = true;
                            }
                        } catch (err) {
                            this.flag = true;
                        }
                    } else {
                        console.log('error submit!!');
                        this.flag = true;
                        return false;
                    }
                });
            }
        },
        mounted() {
            this.initData();
        }
    };
</script>

<style scoped lang="less">
.edit-box {
    padding: 0 30px;
    .form-box {
        background: #fff;
        padding: 20px;
        .main-title {
            font-weight: bold;
            font-size: 16px;
            padding-bottom: 20px;
        }
        .input-width {
            width: 200px;
        }
        .red {
            color: #f00;
        }
        .tips {
            padding-bottom: 20px;
        }
        .radio-select-list {
            .el-select,
            .el-input {
                width: 100px;
                margin-right: 10px;
            }
            .radio-item {
                .el-radio {
                    margin-right: 10px;
                }
                &:first-child {
                    margin-bottom: 8px;
                }
            }
            .number-input-box {
                display: inline-block;
                width: 100px;
                margin-right: 10px;
            }
        }
        .a-link {
            color: #409eff;
            font-weight: normal;
            text-decoration: underline;
        }
        .btns-box {
            margin-top: 20px;
            text-align: center;
            a {
                display: inline-block;
                margin-right: 20px;
            }
        }
    }
}
</style>
