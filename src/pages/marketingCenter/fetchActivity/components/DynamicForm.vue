<template>
    <el-form :model="detailForm"
        :rules="detailRules"
        label-width="120px"
        ref="detailForm">
        <el-form-item v-for="item in initForm"
            :key="item.field_name"
            :prop="item.field_name"
            :label="item.field_label">
            <el-input v-if="item.field_type === 'text'"
                :placeholder="'请输入'+item.field_label"
                v-model="detailForm[item.field_name]"></el-input>
            <el-input-number v-else-if="item.field_type === 'number'"
                :placeholder="'请输入'+item.field_label"
                v-model="detailForm[item.field_name]"></el-input-number>
            <el-date-picker v-else-if="item.field_type === 'datetime'"
                v-model="detailForm[item.field_name]"
                type="datetime"
                value-format="timestamp"
                :placeholder="'请选择'+item.field_label">
            </el-date-picker>
            <el-input v-else-if="item.field_type === 'textarea'"
                v-model="detailForm[item.field_name]"
                type="textarea"
                :placeholder="'请输入'+item.field_label"
                :autosize="{ minRows: 3}"
                resize="none"></el-input>
            <el-checkbox-group v-else-if="item.field_type === 'multi'"
                v-model="detailForm[item.field_name]">
                <el-checkbox v-for="check in item.type_value"
                    :label="check.value"
                    :key="check.value">{{check.name}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-form>
</template>

<script>
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'dynamic-form',
    props: {
        // 初始表单数据
        initForm: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            // 详细信息表单
            detailForm: {},
            // 表单验证
            detailRules: {}
        };
    },
    watch: {
        initForm: {
            handler(val) {
                this.setRules(val);
            },
            immediate: true
        }
    },
    methods: {
        /**
         * @description: 设置表单验证规则，设置表单初始值
         * @param {Array} form  初始表单的数组
         * @return {type}
         */
        setRules(form) {
            if (form.length > 0) {
                // 不同表单触发方法不一样
                const triggerList = {
                    number: {
                        trigger: 'change',
                        text: '请输入'
                    },
                    text: {
                        trigger: 'blur',
                        text: '请输入'
                    },
                    textarea: {
                        trigger: 'blur',
                        text: '请输入'
                    },
                    multi: {
                        trigger: 'change',
                        text: '请选择'
                    },
                    datetime: {
                        trigger: 'change',
                        text: '请选择'
                    }
                };
                for (var i = 0; i < form.length; i++) {
                    // 是否必填
                    let isRequired = form[i].is_required;
                    // 正则表达式
                    let reg = form[i].regex;
                    // 表单项的label中文名
                    let name = form[i].field_label;
                    // 表单项的key值，英文
                    let key = form[i].field_name;
                    // 表单项的类型，比如text,number，multi等
                    let type = form[i].field_type;
                    let arr = [];
                    // 如果必填，加必填规则
                    if (isRequired) {
                        arr.push({ required: true, message: triggerList[type].text + name, trigger: triggerList[type].trigger });
                    }
                    // 如果有正则，加正则校验
                    if (reg) {
                        arr.push({ pattern: eval(reg), message: '请输入正确的' + name, trigger: triggerList[type].trigger });
                    }
                    // 设置表单的校验规则
                    this.$set(this.detailRules, key, arr);
                    // 设置表单的初始项
                    this.$set(this.detailForm, key, form[i].field_value);
                    // 初始进来不校验，不加这一句的话，上面detailForm的赋值就会触发部分校验了
                    this.$nextTick(() => {
                        this.resetForm();
                    });
                }
            }
        },
        // 重置表单
        resetForm() {
            this.$refs.detailForm.resetFields();
        },
        // 校验表单并返回父组件
        validateForm() {
            this.$refs['detailForm'].validate(valid => {
                if (valid) {
                    let formInfo = this.getResultForm();
                    this.$emit('getFormInfo', formInfo);
                } else {
                    this.$emit('getFormInfo', false);
                }
            });
        },
        // 获取表单结果
        getResultForm() {
            let form = commonFun.deepClone(this.initForm);
            for (var i = 0; i < form.length; i++) {
                let key = form[i].field_name;
                if (form[i].field_type === 'datetime') {
                    form[i].field_value = this.detailForm[key] / 1000;
                } else {
                    form[i].field_value = this.detailForm[key];
                }
            }
            return form;
        }
    }
};
</script>

<style lang="less" scoped>
</style>