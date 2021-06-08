<!--
    @name: 单元格组件
    @description:单个单元格组件 用来展示标题和对应内容
    @author: 贺伟
    @date: 2020-04-23
-->
<template>
    <div :class="['cell-wrap', className]" @click="$emit('click')">
        <span class="cell-label">{{title}}</span>
        <el-tooltip
            :disabled="disabled"
            :content="content.toString()">
            <span class="cell-content" ref="content">{{formatContent}}</span>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: 'ItemCell',
        props: {
            // 单元标题
            title: {
                type: String,
                default: '标题：'
            },
            // 单元内容
            content: {
                type: [String, Number],
                default: ''
            },
            // 类名
            className: {
               type: String,
               default: ''
            },
            // 数据为空时默认值
            defaultText: {
                type: String,
                default: '暂无'
            }
        },
        data() {
            return {
                disabled: true
            }
        },
        computed: {
            // 处理文本 如果是0或空则展示默认文案
            formatContent() {
                if (isNaN(this.content)) {
                    return this.content;
                }
                return Number(this.content) || this.defaultText;
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initTips();
            });
        },
        updated() {
            this.$nextTick(() => {
                this.initTips();
            });
        },
        methods: {
            initTips() {
                const {
                    clientWidth,
                    scrollWidth
                } = this.$refs.content;
                if (clientWidth < scrollWidth) {
                   this.disabled = false;
                }
            }
        }
    }
</script>

<style lang="less">
    // 添加覆盖element tooltip全局的样式，修复tips文字过长溢出问题（由于tips在app同级，故采取全局覆盖）
    .el-tooltip__popper {
        max-width: 80%;
    }
</style>
<style lang="less" scoped>
    .cell-wrap {
        display: flex;
        overflow: hidden;
        .cell-label {
            font-size: 14px;
            font-weight: bold;
            color: #424242;
            line-height: 20px;
        }
        .cell-content {
            flex: 1;
            font-size: 14px;
            color: #797979;
            line-height: 20px;
            margin-left: 9px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
