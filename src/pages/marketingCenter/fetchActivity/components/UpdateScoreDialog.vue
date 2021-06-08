<!--
 * @author: xiejiaxin
 * @Date: 2020-09-08 23:22:14
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-10 14:47:18
 * @description: 修改活动分
-->
<template>
    <el-dialog title="修改活动分"
        :visible.sync="dialogVisble"
        @close="cancel"
        :close-on-click-modal="false"
        width="550px"
        center>
        <div class="house-info-box">
            <ul class="s-query">
                <li>
                    <div class="th">楼盘ID：</div>
                    <div class="td">{{info.project_id}}</div>
                </li>
                <li>
                    <div class="th">优惠类型：</div>
                    <div class="td">{{info.promotion_type}}</div>
                </li>
                <li class="auto">
                    <div class="th">楼盘名称：</div>
                    <div class="td">{{info.project_name}}</div>
                </li>
                <li class="auto">
                    <div class="th">优惠信息：</div>
                    <div class="td">{{info.promotion_desc}}</div>
                </li>
            </ul>
        </div>
        <el-form :model="auditForm"
            :rules="formRules"
            class="form-box"
            label-width="80px"
            ref="auditForm">
            <el-form-item prop="score"
                label="活动分">
                <el-input-number v-model="auditForm.score"
                    :min="0"
                    :max="1000"
                    label="修改活动分"></el-input-number>
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
    name: 'update-score-dialog',
    props: {
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 楼盘信息
        info: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
            if (newVal) {
                this.auditForm.id = this.info.id;
                this.auditForm.score = this.info.score;
            }
        },
    },
    data() {
        return {
            // 弹窗展示
            dialogVisble: this.visible,
            // 表单
            auditForm: {
                // 活动分
                score: this.info.score,
                // 活动ID
                id: this.info.id
            },
            // 表单验证规则
            formRules: {
                score: [{ required: true, message: '请输入活动分', trigger: 'blur' }]
            }
        };
    },
    methods: {
        // 关闭弹窗时重置表单
        cancel() {
            this.$refs.auditForm.clearValidate();
            this.$emit('close');
        },
        // 点击确认修改活动分
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
<style lang="less" scoped>
.house-info-box {
    .s-query {
        & > li {
            width: 180px;
            margin-bottom: 0;
            line-height: 30px;
            &:last-of-type {
                margin-bottom: 20px;
            }
            .th {
                width: 80px;
                height: 30px;
                line-height: 30px;
            }
            &.auto {
                width: 100%;
            }
        }
    }
}
.form-box {
    /deep/.el-form-item {
        margin-bottom: 0;
    }
}
</style>

