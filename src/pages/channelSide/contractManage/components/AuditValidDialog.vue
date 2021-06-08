<!--
 * @author: kangxue
 * @Date: 2021-04-13 14:28:50
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-16 17:59:54
 * @description: 审核有效性弹窗
-->
<template>
    <el-dialog title="审核有效性"
        :visible.sync="dialogVisble"
        @close="cancel"
        :close-on-click-modal="false"
        width="800px"
        center>
        <el-form :model="auditForm"
            label-width="80px"
            ref="auditForm">
            <el-form-item prop="result"
                label="审核结果"
                :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                <el-radio-group v-model="auditForm.result">
                    <el-radio v-for="item in resultOpt"
                        :key="item.value"
                        :label="item.value">{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 无效原因 -->
            <el-form-item prop="invalid_reason"
                v-if="auditForm.result === '2'"
                label="原因"
                :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                <el-checkbox-group v-model="auditForm.invalid_reason">
                    <el-checkbox v-for="item in invalidReasonOpt"
                        :key="item.value"
                        :label="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- 待定原因 -->
            <el-form-item prop="wait_reason"
                v-if="auditForm.result === '3'"
                label="原因"
                :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                <el-checkbox-group v-model="auditForm.wait_reason">
                    <el-checkbox v-for="item in waitReasonOpt"
                        :key="item.value"
                        :label="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="remarks"
                v-if="auditForm.result !== '1'"
                label="备注">
                <el-input type="textarea"
                    placeholder="不超过500字"
                    maxlength="500"
                    :autosize="{ minRows: 5, maxRows: 10}"
                    resize="none"
                    v-model="auditForm.remarks"></el-input>
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
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false,
        },
        // 审核结果单选，原因选择的数据
        info: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
        },
    },
    computed: {
        // 待定原因列表
        waitReasonOpt() {
            return this.info.wait_reason || [];
        },
        // 无效原因列表
        invalidReasonOpt() {
            return this.info.invalid_reason || [];
        },
        // 审核结果选项
        resultOpt() {
            return this.info.result || [];
        },
    },
    data() {
        return {
            // 弹窗展示
            dialogVisble: this.visible,
            // 表单
            auditForm: {
                // 审核，默认为有效
                result: '1',
                // 无效原因
                invalid_reason: [],
                // 待定原因
                wait_reason: [],
                // 备注
                remarks: '',
            },
        };
    },
    methods: {
        // 关闭弹窗时重置表单
        cancel() {
            this.$refs.auditForm.resetFields();
            this.$emit('close');
        },
        confirm() {
            this.$refs.auditForm.validate(async (valid) => {
                if (valid) {
                    let auditForm = {
                        ...this.auditForm,
                        invalid_reason: this.auditForm.invalid_reason.join(','),
                        wait_reason: this.auditForm.wait_reason.join(','),
                    };
                    this.$emit('confirm', auditForm);
                }
            });
        },
    },
};
</script>
