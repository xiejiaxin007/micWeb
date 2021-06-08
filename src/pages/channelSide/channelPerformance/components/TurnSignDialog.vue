<!--
 * @author: hewei
 * @Date: 2021-05-12 11:11:41
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 11:28:34
 * @description: file content
-->
<template>
    <div class="turn-sign-wrap">
        <el-dialog
            title="申请转直签"
            :visible.sync="dialogVisble"
            @close="cancel"
            :close-on-click-modal="false"
            width="800px"
            :show-close="false"
            center
        >
            <el-form
                ref="signForm"
                :model="signForm"
                label-width="100px"
                :rules="rules"
            >
                <el-form-item
                    prop="signType"
                    label="直签类型："
                >
                    <template>
                        <el-radio-group v-model="signForm.signType">
                            <el-radio
                                v-for="item in signTypeList"
                                :key="item.value"
                                :label="item.value"
                            >
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                        <div
                            class="msg-notice"
                            v-html="signNotice"
                        >
                        </div>
                    </template>
                </el-form-item>
                <el-form-item
                    prop="files"
                    label="证明材料："
                >
                    <file-upload-preview
                        fileMaxSize="5mb"
                        upID="certifyFiles"
                        isMulti
                        :maxUpCount="10"
                        fileType="jpg,jpeg,png,pdf"
                        :fileList="fileList"
                        @fileChange="fileChange"
                    >
                    </file-upload-preview>
                </el-form-item>
                <el-form-item
                    prop="reason"
                    label="申请理由："
                >
                    <el-input
                        type="textarea"
                        :maxlength="400"
                        :rows="4"
                        placeholder="不超过400字"
                        v-model="signForm.reason"
                    ></el-input>
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
    </div>
</template>

<script>
    import FileUploadPreview from '@/components/FileUploadPreview';
    import api from '../api/contractList';
    export default {
        name: 'TrunSignDialog',
        components: {
            FileUploadPreview,
        },
        props: {
            // 是否展示弹窗
            visible: {
                type: Boolean,
                default: false,
            },
            // 合同id
            id: {
                type: [String, Number],
                default: '',
            },
        },
        data() {
            return {
                // 表单对象
                signForm: {
                    signType: '',
                    reason: '',
                    files: '',
                },
                // 弹窗展示
                dialogVisble: this.visible,
                // 规则
                rules: {
                    signType: [{ required: true, message: '请选择直签类型', trigger: 'change' }],
                    reason: [{ required: true, message: '请填写申请理由', trigger: 'change' }],
                    files: [{ required: true, message: '请上传证明材料', trigger: 'change' }],
                },
                //
                signTypeList: [],
                fileList: [],
            };
        },
        computed: {
            // 转直签文案
            signNotice() {
                const item = this.signTypeList.find(ele => ele.value === this.signForm.signType) || '';
                return item && item.tip_text;
            },
        },
        watch: {
            visible(newVal) {
                this.dialogVisble = newVal;
                this.getTurnSignInit();
            },
        },
        methods: {
            async confirm() {
                try {
                    // 校验必填
                    const valid = await this.$refs.signForm.validate();
                    if (!valid) {
                        return;
                    }
                    this.saveTurnSignInfo();
                } catch (error) {
                    console.log(error);
                }
            },
            // 取消方法
            cancel() {
                this.clearData();
                this.$emit('update:visible', false);
                this.$emit('cancle');
            },
            /**
             * @description 文件改变事件处理
             * @param {Array} oFile 文件数组对象
             */
            fileChange(oFile) {
                // 获取文件总数量
                const fileLen = oFile.length;
                // 给files赋值
                this.signForm.files = fileLen === 0 ? '' : oFile;
                // 触发校验
                this.$refs.signForm.validateField('files');
            },
            // 转直签初始化
            async getTurnSignInit() {
                try {
                    let {
                        data: { code, data, msg },
                    } = await api.getApplyTurnSignInitInfo({ id: this.id });
                    if (code === 0) {
                        // 直签类型
                        this.signTypeList = data.direct_sign_type;
                        // 原因
                        this.signForm.reason = data.apply_reason;
                        // 存储一份原因
                        this.reasonBack = data.apply_reason;
                        // 文件
                        this.fileList = data.file_list;
                        this.signForm.files = data.file_list;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 保存转直签
            async saveTurnSignInfo() {
                try {
                    if (this.hasReq) {
                        return;
                    }
                    this.hasReq = true;
                    const params = {
                        contract_id: this.id,
                        direct_sign_type: this.signForm.signType,
                        file_list: this.signForm.files || [],
                        apply_reason: this.signForm.reason,
                    };
                    let {
                        data: { code, msg },
                    } = await api.saveApplyTurnSign(params);
                    this.hasReq = false;
                    if (code === 0) {
                        // 直签类型
                        this.$message.success('操作成功');
                        this.$emit('confirm');
                    } else {
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.hasReq = false;
                    console.log(error);
                }
            },
            // 清空数据方法
            clearData() {
                // 重置弹窗数据
                this.$refs.signForm.resetFields();
                this.fileList = [];
                // 赋值默认值
                this.signForm.reason = this.reasonBack;
            },
        },
    };
</script>

<style lang="less" scoped>
.msg-notice {
    color: #f56c6c;
    line-height: 1.5;
}
</style>