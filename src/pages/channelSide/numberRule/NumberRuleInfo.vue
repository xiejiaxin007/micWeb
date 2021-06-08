<!--
 * @author: kangxue
 * @Date: 2020-04-17
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-20 16:15:49
 * @description: 智能报备2.0查看
-->
<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/numberRule/numberRuleList' }">序号规则列表</el-breadcrumb-item>
            <el-breadcrumb-item>序号规则信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="view-box">
            <router-link class="router-link"
                v-if="!info.project_name"
                :to="{path: '/numberRule/editNumberRule', query: {id: id}}">
                <el-button type="primary">编辑</el-button>
            </router-link>
            <div class="main-title">序号规则详情页</div>
            <table v-loading="loading">
                <tr>
                    <td>序号ID：</td>
                    <td>{{info.id}}</td>
                </tr>
                <tr>
                    <td>关联楼盘：</td>
                    <td>{{info.project_name || '暂未关联楼盘'}}</td>
                </tr>
                <tr>
                    <td>序号名称：</td>
                    <td>{{info.name}}</td>
                </tr>
                <tr>
                    <td>累计频率：</td>
                    <td>{{info.rate_type_name}}</td>
                </tr>
                <tr v-if="info.rate_type === '4'">
                    <td>开始日期：</td>
                    <td>{{info.start_datetime}}</td>
                </tr>
                <tbody v-if="info.rate_type !== '5'">
                    <tr>
                        <td>序号格式：</td>
                        <td>{{info.number_type_name}}</td>
                    </tr>
                    <tr>
                        <td>初次累计的开始值：</td>
                        <td>{{info.init_value}}</td>
                    </tr>
                    <tr>
                        <td class="w-200">以后每次重新累计的开始值：</td>
                        <td>{{info.again_value}}</td>
                    </tr>
                    <tr>
                        <td>累计范围：</td>
                        <td>{{info.range_type_name}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import ruleApi from './api/ruleApi';
export default {
    data() {
        return {
            // 序号规则信息
            info: {},
            id: '',
            loading: false
        };
    },
    methods: {
        // 初始化数据
        async initData() {
            try {
                this.loading = true;
                let params = {
                    id: this.id
                };
                const {
                    data: { code, msg, data }
                } = await ruleApi.getNumberRuleInfo(params);
                if (code === 0) {
                    this.info = data;
                    this.loading = false;
                } else {
                    this.$message.error(msg);
                    this.loading = false;
                }
            } catch (err) {}
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.initData();
    }
};
</script>

<style scoped lang="less">
.view-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 20px;
    .router-link {
        float: right;
        margin-top: -10px;
    }
    table {
        td {
            padding: 5px;
            font-size: 14px;
            &:first-child {
                text-align: right;
                color: #888;
            }
        }
        .w-200 {
            width: 200px;
        }
    }
}
</style>