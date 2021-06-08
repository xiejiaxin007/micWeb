<!--
    @name: panel面版
    @description: panel面版UI组件, 复用模块样式
    @author: 贺伟
    @date: 2020-04-23
-->
<template>
    <div class="panel-wrap">
        <div class="panel-title">
            {{title}}
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'SecondHouseDetail',
        props: {
            // 面板标题
            title: {
                type: String,
                default: '信息'
            }
        }
    }
</script>

<style lang="less" scoped>
    .panel-wrap {
        background-color: #fff;
        border-radius: 8px;
        padding: 14px 0 24px;
        .panel-title {
            position: relative;
            overflow: hidden;
            font-size: 18px;
            font-weight: bold;
            color: #424242;
            line-height: 25px;
            margin-bottom: 15px;
            padding-left: 16px;
            &::before {
                content: "";
                position: absolute;
                bottom: 6px;
                left: 0;
                background-color: #00c0eb;
                width: 4px;
                height: 14px;
                border-radius: 0 2px 2px 0;
            }
        }
    }
</style>
