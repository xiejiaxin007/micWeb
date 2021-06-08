<!--
 * @author: kangxue
 * @Date: 2021-04-12 18:33:30
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-20 10:34:53
 * @description: 黄色提示文案
-->
<template>
    <div class="voucher-info">
        <div class="warn-msg el-alert">
            <i class="el-alert__icon el-icon-warning-outline"></i>
            <div class="el-alert__content"><span class="el-alert__title">{{msg}}</span></div>
        </div>
    </div>
</template>

<script>
const msgList = {
    30: '未上传报备截图',
    39: '未找到报备记录',
    31: '未上传带看确认单',
    32: '未上传到访水印照片',
    34: '未上传缴费凭证',
    35: '未上传证明材料',
    36: '未上传标准的业绩确认单',
    37: '',
    38: '未标记回访情况',
};
export default {
    props: {
        // 模块id
        modalKey: {
            type: [String, Number],
            default: '',
        },
    },
    computed: {
        msg() {
            let key = this.modalKey + '';
            return msgList[key] || '该模块暂无信息';
        },
    },
};
</script>

<style lang="less" scoped>
.warn-msg {
    color: #e6a23c;
    padding-left: 0;
    .el-alert__title {
        font-size: 14px;
        line-height: normal;
    }
}
</style>
