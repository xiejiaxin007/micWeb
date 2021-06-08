
<!--
 * @author: hewei
 * @Date: 2021-05-14 17:34:01
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-24 11:35:02
 * @description: 修改人员组件弹窗
-->
<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisble"
        @close="cancel"
        :close-on-click-modal="false"
        width="600px"
        center
    >
        <el-form
            :model="forms"
            ref="auditForm"
            label-width="100px"
        >
            <el-form-item
                prop="user"
                :label="label"
                :rules="[{ required: true, message: `请选择${label}` , trigger: 'change' }]"
            >
                <search-select-radio
                    v-model="forms.user"
                    clearable
                    placeholder="请选择"
                    v-bind="$attrs"
                >
                </search-select-radio>
            </el-form-item>
        </el-form>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="cancel">取消</el-button>
            <el-button
                type="primary"
                @click="confirm"
            >确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { SearchSelectRadio } from '@/components';
    export default {
        name: 'ChangeEmployeeDialog',
        components: {
            SearchSelectRadio,
        },
        inheritAttrs: false,
        props: {
            // 弹窗标题
            title: {
                type: String,
                default: '提示',
            },
            // 是否展示弹窗
            visible: {
                type: Boolean,
                default: false,
            },
            // 标签名文案
            label: {
                type: String,
                default: '请选择',
            },
        },
        data() {
            return {
                // 弹窗展示
                dialogVisble: this.visible,
                // 表单
                forms: {
                    user: '',
                },
            };
        },
        watch: {
            /**
             * @description 监听是否展示弹窗
             * @param {String} newVal 新值
             */
            visible(newVal) {
                this.dialogVisble = newVal;
            },
        },
        methods: {
            // 关闭弹窗时重置表单
            cancel() {
                this.$refs.auditForm.resetFields();
                this.$emit('close');
                this.$emit('update:visible', false);
            },
            // 确认
            confirm() {
                this.$refs.auditForm.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    this.$emit('confirm', { ...this.forms });
                });
            },
        },
    };
</script>
