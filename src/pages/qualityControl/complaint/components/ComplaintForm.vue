<!--
 * @author: kangxue
 * @Date: 2020-07-16 15:19:01
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-28 15:46:23
 * @description: 咨询部跟进 客诉处理表单  识别value:5
-->
<template>
    <el-form ref="form"
        :model="form"
        :rules="rules"
        label-width="150px">
        <el-form-item label="客诉处理详情"
            prop="result">
            <el-input type="textarea"
                placeholder="请输入客诉处理详情，最多300字，超出无法输入"
                v-model="form.result"
                maxlength="300"
                rows="3"></el-input>
        </el-form-item>
        <el-form-item label="客诉材料"
            prop="material"
            class="is-required"
            ref="material">
            <upload-material @getMaterial="getMaterial"></upload-material>
        </el-form-item>
    </el-form>
</template>

<script>
import api from '../api/complaint';
import UploadMaterial from './UploadMaterial';
export default {
    name: 'ComplaintForm',
    components: {
        UploadMaterial
    },
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
        let fileRequired = (rule, value, callback) => {
            if (this.form.imgList.length === 0 && this.form.audioList.length === 0) {
                callback(new Error());
            } else {
                callback();
            }
        };
        return {
            form: {
                // 处理结果
                result: '',
                // 客诉材料-图片
                imgList: [],
                // 客诉材料-音频
                audioList: []
            },
            rules: {
                // 处理结果
                result: [{ required: true, message: '处理结果不能为空', trigger: 'blur' }],
                material: [{ validator: fileRequired, message: '客诉材料不能为空，最少上传附件或录音其中一种' }]
            },
            // 是否重复提交
            isSubmit: false
        };
    },
    methods: {
        /**
         * @description: 上传客诉材料组件返回的已上传的客诉材料
         * @param {Object}  客诉材料对象
         * @return:
         */
        getMaterial(list) {
            this.form.imgList = list.imgList;
            this.form.audioList = list.audioList;
            this.$refs.form.validateField('material');
        },
        // 拼接要提交的客诉材料
        getFileInfo() {
            let imgArr = this.form.imgList.map(function(item) {
                return item.file_path;
            });
            let audioArr = this.form.audioList.map(function(item) {
                return item.file_path;
            });
            return {
                pic: imgArr,
                audio: audioArr
            };
        },
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
                            detail: this.form.result,
                            file: this.getFileInfo(),
                            yw_complaints: this.formInfo
                        };
                        const {
                            data: { code, msg, data }
                        } = await api.saveHeadFollow(params);
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

