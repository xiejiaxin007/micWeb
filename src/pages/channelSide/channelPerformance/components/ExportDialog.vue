<!--
 * @author: hewei
 * @Date: 2021-05-14 17:34:01
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 17:13:23
 * @description: 导出弹窗组件 
-->
<template>
    <div class="export-dialog-wrap">
        <el-dialog
            :visible.sync="dialogVisble"
            @close="cancel"
            :close-on-click-modal="false"
            width="800px"
            :title="title"
            center
        >
            <el-form
                ref="signForm"
                :model="forms"
                label-width="100px"
                :rules="rules"
            >
                <el-form-item
                    prop="cityId"
                    label="楼盘城市："
                >
                    <el-select
                        clearable
                        v-model="forms.cityId"
                        multiple
                        filterable
                    >
                        <el-option
                            v-for="item in cityOps"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="dataDimension"
                    label="数据维度："
                    v-if="$attrs.hasDimension !== undefined"
                >
                    <el-radio-group
                        v-model="forms.dataDimension"
                        @change="(val) => $emit('changeDimension', val)"
                    >
                        <el-radio
                            v-for="item in dataDimensionOps"
                            :key="item.value"
                            :label="item.value"
                        >
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>

                </el-form-item>
                <el-form-item
                    prop="dataRange"
                    label="数据范围："
                >
                    <el-select
                        clearable
                        v-model="forms.dataRange"
                        filterable
                        multiple
                    >
                        <el-option
                            v-for="item in dataRangeOps"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
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
    export default {
        name: 'ExportDialog',
        inheritAttrs: false,
        props: {
            // title
            title: {
                type: String,
                default: '提示',
            },
            // 城市默认值
            cityVal: {
                type: Array,
                default: () => [],
            },
            rangeVal: {
                type: Array,
                default: () => [],
            },
            // 是否展示弹窗
            visible: {
                type: Boolean,
                default: false,
            },
            //  城市下拉
            cityOps: {
                type: Array,
                default: () => [],
            },
            // 数据范围
            dataRangeOps: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                // 表单信息
                forms: {
                    cityId: [],
                    // 数据维度
                    dataDimension: 1,
                    dataRange: [],
                },
                // 类型下拉
                dataDimensionOps: Object.freeze([
                    { value: 1, name: '月份' },
                    { value: 2, name: '季度' },
                ]),
                // 弹窗展示
                dialogVisble: this.visible,
                // 验证规则
                rules: {
                    cityId: [{ required: true, message: '请选择楼盘城市', trigger: 'change' }],
                    dataRange: [{ type: 'array', required: true, message: '请选择数据范围', trigger: 'change' }],
                },
            };
        },
        watch: {
            // 弹窗显示隐藏
            visible(val) {
                this.dialogVisble = val;
            },
            // 城市值
            cityVal(newVal) {
                this.forms.cityId = newVal;
            },
            // 范围值
            rangeVal(newVal) {
                this.forms.dataRange = newVal;
            },
        },
        methods: {
            // 确定方法
            async confirm() {
                try {
                    // 校验必填
                    const valid = await this.$refs.signForm.validate();
                    if (!valid) {
                        return;
                    }
                    this.$emit('confirmExport', { ...this.forms });
                    // 重置状态
                    setTimeout(() => {
                        this.forms.dataDimension = 1;
                    });
                } catch (error) {
                    console.log(error);
                }
            },
            // 取消方法
            cancel() {
                this.dialogVisble = false;
                // 重置状态
                this.forms.dataDimension = 1;
                this.$emit('cancelExport');
                this.$emit('update:visible', false);
                this.$emit('changeDimension', 1);
            },
        },
    };
</script>

<style lang="less" scoped>
.el-select {
    width: 600px;
}
</style>