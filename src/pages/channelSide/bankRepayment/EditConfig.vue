<!--
    @name: 合同分类配置新增
    @description: 合同分类条件配置列表新增/编辑页面
    @author: 贺伟
    @date: 2019-11-06
-->
<template>
    <div class="edit-config">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item
                :to="{ path: '/payment/contractClassifyConfigList'}">
                合同分类条件配置列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{breabcrubName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :model="confForm"
            label-width="140px"
            ref="confForm"
            label-position="right"
            class="conf-form">
            <el-form-item
                class="form-item"
                label="合同分类条件名称"
                prop="name"
                :rules="nameRule">
                <el-input
                    v-model="confForm.name"
                    clearable
                    :maxlength="10">
                </el-input>
                <div class="warning-msg indent">
                    <i class="el-icon-question" 
                        aria-hidden="true"></i>
                    合同是按照何种条件进行分类的，请高度总结下分类的名称！名称最多录入10个汉字！
                    如：合同是按照客户社保是否在某地的有无来进行分类的，则可命名为“客户社保归属地”。
                </div>
            </el-form-item>
            <el-form-item
                v-for="(item, index) in confForm.options"
                :key="index"
                :label="'选项值' + (index + 1)"
                :prop="'options.' + index + '.value'"
                :rules="optionRule">
                <el-input
                    :maxlength="20"
                    clearable
                    v-model="item.value">
                </el-input>
                <el-button
                    class="btn-del"
                    type="text"
                    size="medium"
                    @click="delOption(index)">
                    删除
                </el-button>
                <div
                    v-if="index === 0"
                    class="warning-msg">
                    <i class="el-icon-question"
                        aria-hidden="true"></i>
                    此分类条件下有开发商时如何分类的，请总结分类依次添加！选项值必须简单易懂易于区分，
                    字数最多可输入20个汉字。如：开发商时按照客户户口是否在某某本地进行分类，选项值可添加2个：“户口在某某”，“户口不在某某”
                </div>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    size="medium"
                    @click="addMoreOption">
                    增加更多选项值
                </el-button>
            </el-form-item>
            <el-form-item
                label="适用城市"
                prop="citys"
                class="two-level"
                :rules="cityRule"
                required>
                <el-select
                    v-model="confForm.citys"
                    multiple
                    filterable
                    clearable
                    ref="bandSlt"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in cityOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <div class="warning-msg indent">
                    <i class="el-icon-question"
                        aria-hidden="true"></i>
                    该分类条件适用于那些楼盘的城市！
                </div>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleCancle">取消</el-button>
                <el-button
                    type="primary"
                    @click="saveConfig('confForm')">
                    保存
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import reqApi from '@/api/bankRepaymentApi/constractConfig';
    export default {
        name: 'EditConfig',
        data() {
            return {
                // 面包屑文字
                breabcrubName: '新增',
                // form表单绑定对象
                confForm: {
                    // 合同分类名称
                    name: '',
                    // 选项
                    options: [
                        { value: '' },
                        { value: '' },
                        { value: '' }
                    ],
                    // 适用城市
                    citys: []
                },
                // 城市选项列表数据
                cityOps: [],
                // 合同分类名称验证规则
                nameRule: {required: true, message: '此项为必填项！', trigger: 'blur'},
                // 选项值验证规则
                optionRule: [
                    { required: true, message: '此项为必填项！', trigger: 'blur' },
                    { max: 20, message: '最多输入20个汉字', trigger: 'blur' }
                ],
                // 城市校验规则
                cityRule: [
                    { required: true, message: '此项为必填项！', trigger: 'change' }
                ]
            }
        },
        created() {
            // 获取当前条件id
            this.id = this.$route.query.id;
            // 初始化已选中的城市数组
            this.suitCityArrSelect = [];
            // 初始化已保存的选项组
            this.conditionOptionsArrSelect = [];
            this.getApplyCity();
            if (this.id !== '') {
                // 赋值面包屑导航文字
                this.breabcrubName = '编辑';
                document.title = '编辑'
                this.getConditionCategoryInfo();
            }
        },
        methods: {
            // 获取分类条件设置数据
            async getConditionCategoryInfo() {
                try {
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await reqApi.getConditionCategoryData(this.id);
                    if (code === 0) {
                        const formData = this.confForm;
                        // 保存后台传回的时间戳
                        this.updateDatetimeCheck = data.update_datetime_check;
                        formData.name = data.category_name;
                        // 遍历数据保存默认id
                        this.confForm.citys = data.suitCityArrSelect.map(ele => {
                            this.suitCityArrSelect.push({
                                id: ele.id,
                                value: ele.city_id
                            });
                            return ele.city_id;
                        });
                        // 将默认的选项数据置为空
                        this.confForm.options = [];
                        data.conditionOptionsArrSelect.forEach(ele => {
                            this.conditionOptionsArrSelect.push({
                                id: ele.id,
                                value: ele.option_name
                            });
                            this.confForm.options.push({
                                value: ele.option_name,
                                id: ele.id
                            });
                        });
                    } else {
                        this.$message(msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 获取需要保存的数据
            getSaveData() {
                // 选项数据
                const conditionOptionsArr = this.confForm.options.map((ele, index) => {
                    let options = {
                        option_name: ele.value.trim(),
                        id: ele.id || ''
                    };
                    return options;
                });
                // 城市数据
                let suitCityArr = this.confForm.citys.map((ele, idx) => {
                    let option = {
                        id: '',
                        city_id: ele
                    };
                    // 遍历数组 如果选中的值包含初始化保存的值，则将初始化的id赋值进去
                    if (this.suitCityArrSelect && this.suitCityArrSelect.find(item => item.value === ele.value) !== undefined) {
                        option.id = this.suitCityArrSelect[idx].id;
                    }
                    return option;
                });
                // 将组装好的数据返回
                return {
                    id: this.id,
                    category_name: this.confForm.name.trim(),
                    conditionOptionsArr,
                    suitCityArr,
                    update_datetime_check: this.updateDatetimeCheck
                };
            },
            // 保存套件分类数据
            async saveConditionCategoryInfo() {
                try {
                    const options = this.getSaveData();
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await reqApi.setConditionCategoryData(options);
                    if (code === 0) {
                        this.$message(msg);
                        // 返回到列表页
                        this.$router.push('/payment/contractClassifyConfigList');
                    } else {
                        this.$message(msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 增加更多选项值
            addMoreOption() {
                if (this.confForm.options.length >= 20) {
                    this.$message.warning('系统限制最多可添加20个选项值，如有问题请联系产品！');
                    return;
                }
                this.confForm.options.push({
                    value: ''
                });
            },
            /**
             * 根据索引删除对应的选项值
             * @param {Number} idx 所要删除选项的索引值
             */
            delOption(idx) {
                if (this.confForm.options.length <= 1) {
                    this.$alert('选项值至少存在一个', '提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                this.confForm.options.splice(idx, 1);
            },
            // 获取适用城市
            async getApplyCity() {
                try {
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await reqApi.getCitys();
                    if (code === 0) {
                        this.cityOps = data;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 保存配置
             * @param {String} formName 表单ref绑定的名称
             */
            saveConfig(formName) {
                // 信息校验
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const {
                            isRepeat,
                            repeatIdxArr
                        } = this.validOpsValue();
                        // 如果有重复
                        if (isRepeat) {
                            // 组装提示的数据
                            const messages = repeatIdxArr.map(items => {
                                return items.map(ele => {
                                   return `选项值${ele + 1}`;
                                }).join('、');
                            }).join('，');
                            this.$message({
                                message: `${messages}存在重复，请修改后保存！`,
                                duration: 5000
                            });
                            return;
                        }
                        this.saveConditionCategoryInfo();
                    } else {
                        this.$message.error('请完善必填项后提交！');
                        return false;
                    }
                });
            },
            // 选项值唯一性
            validOpsValue() {
                // 获取去除空格后选项值数组
                const valArr = this.confForm.options.map(ele => ele.value.trim());
                // 定义保存重复数据的数组 此为二维数组 每一类重复push进去一个数组
                let repeatArr = [];
                let repeatVals = [];
                for (let i = 0; i < valArr.length; i++) {
                    const ele = valArr[i];
                    // 如果数组已经有了当前的值说明已经是属于重复的了，此时跳过改条数据检查，进入下一个循环
                    if (repeatVals.includes(ele)) {
                        continue;
                    }
                    // 定义某个值重复的数组
                    let curRepeat = [i];
                    for (let j = i + 1; j < valArr.length; j++) {
                        const item = valArr[j];
                        if (ele === item) {
                            curRepeat.push(j);
                            repeatVals.push(ele);
                        }
                    }
                    // 如果数组大于1说明存在重复值则推入
                    if (curRepeat.length > 1) {
                        repeatArr.push(curRepeat);
                    }
                }
                return {
                    isRepeat: repeatArr.length > 0,
                    repeatIdxArr: repeatArr
                };
            },
            // 取消事件处理
            handleCancle() {
                this.$confirm('是否放弃编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push('/payment/contractClassifyConfigList');
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .edit-config {
        padding: 20px 30px 0;
        .conf-form{
            margin-top: 20px;
            padding: 15px 20px;
            background-color: #fff;
            .btn-del{
                height: 40px;
                margin-left: 10px;
                color: #ff0000;
            }
        }
        /deep/ .el-form-item__content {
            display: flex;
            .el-input{
                width: 300px;
            }
        }
        .warning-msg {
            display: flex;
            flex: 1;
            line-height: 26px;
            margin-left: 25px;
            color: #e6a23c;
            &.indent{
                margin-left: 65px;
            }
            .el-icon-question{
                font-size: 18px;
                margin-top: 5px;
                margin-right: 6px;
                color: #e89b28;
            }
        }
    }
</style>