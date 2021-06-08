<!--
 * @author: kangxue
 * @Date: 2021-04-13 15:19:11
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-16 09:49:43
 * @description: 咨询师App报备记录
-->
<template>
    <div class="voucher-con">
        <div class="voucher-title">咨询师App报备记录
            <el-tooltip placement="top">
                <div slot="content">
                    认购、网签客户电话在认购时间前，在成交楼盘产生的报备信息
                </div>
                <i class="el-icon-question"
                    aria-hidden="true"></i>
            </el-tooltip>
        </div>
        <div class="voucher-info"
            v-if="info.detail">
            <div class="el-alert">
                <i class="el-alert__icon"
                    :class="info.detail.is_agreement === '1' ? 'el-icon-circle-check' : 'el-icon-circle-close'"></i>
                <div class="el-alert__content"><span class="el-alert__title">认购电话、网签电话{{info.detail.is_agreement === '1' ? '' : '不'}}一致</span></div>
            </div>
            <div>认购电话，共找到{{info.detail.subscribe_num}}条报备记录
                <a :href="info.detail.subscribe_report_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pad-l">
                    <el-button type="text">查看详情</el-button>
                </a>
            </div>
            <div v-if="info.detail.is_agreement === '2'">网签电话，共找到{{info.detail.sign_num}}条报备记录
                <a :href="info.detail.sign_report_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pad-l">
                    <el-button type="text">查看详情</el-button>
                </a>
            </div>
        </div>
        <!-- 没有数据展示黄色文字 -->
        <warn-msg v-else
            :modalKey="info.key"></warn-msg>
    </div>
</template>

<script>
import WarnMsg from './WarnMsg';
export default {
    name: 'ReportRecord',
    components: {
        WarnMsg,
    },
    props: {
        // 展示信息
        info: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
};
</script>

<style lang="less" scoped>
.voucher-con {
    .el-alert {
        padding-left: 0;
        .el-alert__title {
            font-size: 14px;
            line-height: normal;
        }
    }
    .el-icon-circle-check {
        color: #67c23a;
    }
    .el-icon-circle-close {
        color: #f56c6c;
    }
    .pad-l {
        padding-left: 20px;
    }
}
.voucher-title {
    color: #555;
    font-weight: bold;
    padding-bottom: 10px;
}
</style>
