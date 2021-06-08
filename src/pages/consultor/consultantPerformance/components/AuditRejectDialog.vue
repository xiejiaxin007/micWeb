<!--
 * @author: kangxue
 * @Date: 2020-09-03 23:22:14
 * @LastEditors: xie bin
 * @LastEditTime: 2021-05-25 10:53:12
 * @description: 审核弹窗；都是一个单选按钮加驳回原因的弹窗，所以统一一个组件
-->
<template>
    <el-dialog :title="title"
        :visible.sync="dialogVisble"
        @close="cancel"
        :close-on-click-modal="false"
        width="650px"
        center>
        <slot/>
        <el-form :model="auditForm"
            label-width="120px"
            ref="auditForm">
            <el-form-item prop="audit"
                :label="label"
                :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                <el-checkbox-group v-model="auditForm.audit">
                    <el-checkbox v-for="item in checkboxGroup"
                        :key="item.value"
                        :label="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="reason"
                label="其他原因:"
                :rules="[{ required: isRequired, message: '驳回原因不能为空', trigger: 'blur' }]">
                <el-input type="textarea"
                    :placeholder="'请填写驳回原因，最多'+maxLength+'字，超出无法输入'"
                    :maxlength="maxLength"
                    :autosize="{ minRows: 5, maxRows: 10}"
                    resize="none"
                    v-model="auditForm.reason"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer"
            class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary"
                @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'audit-dialog',
    props: {
        // 弹窗标题
        title: {
            type: String,
            default: ''
        },
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 驳回原因限制字数
        maxLength: {
            type: Number,
            default: 300
        },
        // 审核单选框的文本值
        label: {
            type: String,
            default: '审核结果'
        },
        // 单选框组
        checkboxGroup: {
            type: Array,
            default: () => []
        },
        // 驳回原因是否必填
        isRequired: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // 弹窗展示
            dialogVisble: this.visible,
            // 表单
            auditForm: {
                // 审核
                audit: [],
                // 驳回原因
                reason: ''
            }
        };
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
        }
    },
    methods: {
        // 关闭弹窗时重置表单
        cancel() {
            this.$refs.auditForm.resetFields();
            this.$emit('close');
        },
        confirm() {
            this.$refs.auditForm.validate(async valid => {
                if (valid) {
                    this.$emit('confirm', this.auditForm);
                }
            });
        }
    }
};
</script>

