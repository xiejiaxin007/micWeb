
<!--
    @name: 驳回弹窗
    @description: 财务审核页面历史表和操作表驳回公用弹窗
    @author: 贺伟
    @date: 2019-10-30
-->
<template>
    <el-dialog
        width="600px"
        class="reject-wrap"
        :visible.sync="dialogVisib"
        :before-close="beforeClose"
        @closed="closed"
    >
        <h2
            slot="title"
            class="line"
        >驳回原因：</h2>
        <div class="reject-body">
            <p>{{ refuseTitle }}</p>
            <ul class="s-query">
                <li>
                    <div class="th required">驳回理由：</div>
                    <div class="td">
                        <textarea
                            class="textarea"
                            maxlength="300"
                            placeholder="最多300字，不能为空"
                            v-model.trim="refuseReason"
                        ></textarea>
                    </div>
                </li>
            </ul>
        </div>
        <div
            class="btn-area reject-btn"
            slot="footer"
        >
            <el-button
                class="btn close-reject"
                :disabled="!canClose"
                @click="dialogVisib = false"
            >取消</el-button>
            <el-button
                class="btn submit-reject"
                @click="handleConfirm"
                :disabled="refuseReason === ''"
            >确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'RejectDialog',
        props: {
            // 弹窗的显示隐藏状态
            dialogVisible: {
                type: Boolean,
                default: false
            },
            // 弹窗提示文字内容
            refuseTitle: {
                type: String,
                default: ''
            },
            // 是否能关闭弹窗
            canClose: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                // 驳回原因
                refuseReason: '',
                // 弹窗展示隐藏状态
                dialogVisib: this.dialogVisible
            };
        },
        methods: {
            // 点击确定事件处理
            handleConfirm() {
                this.$emit('handleConfirm', this.refuseReason);
            },
            /**
             * 弹窗关闭前的回调
             * @param {Function} done 用于关闭弹窗的函数
             */
            beforeClose(done) {
                if (!this.canClose) {
                    this.$message('数据处理中，请稍后...');
                    return;
                }
                done();
            },
            // 关闭动画结束时的回调
            closed() {
                this.dialogVisib = false;
                this.refuseReason = '';
                // 更新父组件弹窗显示隐藏的值
                this.$emit('update:dialogVisible', false);
            }
        },
        watch: {
            dialogVisible(newVal) {
                this.dialogVisib = newVal;
            }
        }
    };
</script>

<style lang="less" scoped>
.reject-wrap {
    .el-dialog__header {
        > .line {
            border-bottom: 1px solid #edeff0;
            height: 46px;
            line-height: 46px;
            position: relative;
            padding-left: 14px;
            margin-bottom: 10px;
            &:before {
                position: absolute;
                left: 0;
                top: 10px;
                content: '';
                width: 6px;
                height: 24px;
                background-color: steelblue;
            }
        }
    }
    /deep/ .el-dialog__body {
        padding: 0 20px;
    }
    .reject-body {
        overflow: hidden;
        .textarea {
            height: 120px;
            width: 100%;
            -webkit-appearance: none;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            outline: 0;
            padding: 10px 15px;
            &:focus {
                border-color: #409eff;
                outline: 0;
            }
        }
        .s-query {
            margin-top: 15px;
            > li {
                float: none;
                width: auto;
                margin: 0;
                .th {
                    width: auto;
                }
            }
        }
    }
    .reject-btn {
        position: relative;
        text-align: right;
        .close-reject {
            color: #333;
            border: 1px solid #333;
            margin-right: 15px;
        }
        .submit-reject {
            background: #337ab7;
            color: #fff;
            border: 1px solid #337ab7;
            margin-left: 15px;
        }
    }
}
</style>