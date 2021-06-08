<!--
 * @author: kangxue
 * @Date: 2020-07-14 14:39:14
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-28 15:46:01
 * @description: 楼盘任务跟进；  楼盘反馈表单   识别value:6
-->
<template>
    <el-form ref="form"
        :model="form"
        :rules="rules"
        label-width="150px">
        <el-form-item label="反馈是否准确"
            prop="isRight">
            <el-select v-model="form.isRight"
                placeholder="请选择">
                <el-option v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="是否处理完成"
            prop="isFinished">
            <el-select v-model="form.isFinished"
                placeholder="请选择">
                <el-option v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="处理结果"
            prop="result">
            <el-input type="textarea"
                placeholder="请输入处理结果，最多300字，超出无法输入"
                v-model="form.result"
                maxlength="300"
                rows="3"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import api from '../api/complaint';
export default {
    name: 'FeedBackForm',
    props: {
        // 表单中需要编辑提交的数据：投诉对象及原因，是否万单
        formInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 客诉上一次更新时间，校验是否变更使用
        updateTime: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            options: [
                { name: '是', value: '1' },
                { name: '否', value: '2' }
            ],
            form: {
                // 反馈是否准确
                isRight: '',
                // 是否处理完毕
                isFinished: '',
                // 处理结果
                result: ''
            },
            rules: {
                // 反馈是否准确
                isRight: [{ required: true, message: '反馈是否准确不能为空', trigger: 'change' }],
                // 是否处理完毕
                isFinished: [{ required: true, message: '是否处理完毕不能为空', trigger: 'change' }],
                // 处理结果
                result: [{ required: true, message: '处理结果不能为空', trigger: 'blur' }]
            },
            // 是否重复提交
            isSubmit: false
        };
    },
    methods: {
        /**
         * @description: 保存表单
         * @param {String}  id  客诉id
         * @param {String}  type  按钮识别id，识别表单
         * @return:
         */
        validateForm(id, type) {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    try {
                        let params = {
                            complaints_id: id,
                            follow_type: type,
                            update_datetime: this.updateTime,
                            exact: this.form.isRight,
                            complete: this.form.isFinished,
                            detail: this.form.result,
                            yw_complaints: this.formInfo
                        };
                        const {
                            data: { code, msg, data }
                        } = await api.saveProjectFollow(params);
                        // 因为多个跟进操作结果都有任务变更的判断，所以返回父组件统一处理
                        this.$emit('save', {code, msg, data}, type, '保存成功');
                        this.isSubmit = false;
                    } catch (err) {
                        console.log(err);
                        this.isSubmit = false;
                    }
                }
            });
        }
    }
};
</script>
