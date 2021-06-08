<!--
 * @Name: 回款跟进记录页表格
 * @Description: 回款跟进记录组件，表格展示
 * @Author: kangxue
 * @Date: 2020-04-26
-->
<template>
    <div v-loading="loading">
        <el-table border
            :data="tableList"
            size="small"
            show-summary
            :summary-method="getSummaries"
            row-class-name="row"
            cell-class-name="column"
            :highlight-current-row="true"
            :header-cell-style="{'background': '#f8f8f8'}">
            <el-table-column align="center"
                min-width="80"
                prop="city_name"
                fixed
                label="地理城市">
            </el-table-column>
            <el-table-column align="center"
                min-width="80"
                fixed
                label="成交ID">
                <template slot-scope="scope">
                    <div @click="turnToNewPage(scope.row.deal_url)"
                        class="turn-to-page">{{scope.row.deal_id}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center"
                min-width="100"
                prop="project_name"
                fixed
                label="楼盘名称">
            </el-table-column>
            <el-table-column align="center"
                min-width="80"
                prop="username"
                fixed
                label="成交客户姓名">
            </el-table-column>
            <el-table-column align="center"
                min-width="90"
                prop="deal_step"
                label="成交单进度">
            </el-table-column>
            <el-table-column align="center"
                min-width="90"
                prop="subscribe_datetime"
                label="认购日期">
            </el-table-column>
            <el-table-column align="center"
                min-width="90"
                prop="grass_datetime"
                label="草签日期">
            </el-table-column>
            <el-table-column align="center"
                min-width="90"
                prop="sign_datetime"
                label="网签日期">
            </el-table-column>
            <el-table-column align="center"
                min-width="80"
                prop="cooperate_type"
                label="合作方式">
            </el-table-column>
            <el-table-column align="center"
                min-width="100"
                prop="commission_type"
                label="回款类型">
            </el-table-column>
            <el-table-column align="center"
                min-width="240"
                prop="forecast_content"
                label="单笔合同预测子条件">
            </el-table-column>
            <el-table-column align="center"
                min-width="80"
                prop="pre_paid_money"
                label="单笔合同预测金额">
            </el-table-column>
            <el-table-column align="center"
                min-width="80"
                prop="unfollowed_money"
                label="单笔剩余回款金额">
            </el-table-column>
            <el-table-column align="center"
                min-width="80"
                prop="follow_money"
                label="本次跟进金额">
            </el-table-column>
            <el-table-column align="center"
                v-if="type === '1'"
                min-width="80"
                label="回款组ID">
                <template slot-scope="scope">
                    <span class="a-link"
                        @click="toGroupDetail(scope.row.group_id)">{{scope.row.group_id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                v-if="type === '1'"
                min-width="80"
                prop="money_back_group_step"
                label="当前阶段">
            </el-table-column>
            <el-table-column align="center"
                v-if="type === '2'"
                min-width="160"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                        size="small"
                        @click="showDetail(scope.row.deal_id)">查看此次成交单跟进记录</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api from '../api/followApi';
    export default {
        props: {
            // id
            id: {
                type: String,
                default: ''
            },
            // 1.获取成交单维度的，2.回款组维度
            type: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                // 加载
                loading: false,
                // 表格数据
                tableList: [],
                // 单笔合同预测总金额
                prePaidTotal: '',
                // 单笔剩余回款总金额
                unfollowedTotal: '',
                // 本次跟进总金额
                followedTotal: ''
            };
        },
        methods: {
            // 初始化回款跟进记录表格数据
            async initData() {
                try {
                    this.loading = true;
                    let params = {
                        id: this.id,
                        type: this.type
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.followedForecastList(params);
                    if (code === 0) {
                        this.tableList = data.list;
                        this.prePaidTotal = data.pre_paid_total;
                        this.unfollowedTotal = data.unfollowed_total;
                        this.followedTotal = data.followed_total;
                        // 导出表格数据表示成交单的个数字段，用于父组件进行判断
                        this.$emit('getListLength', data.deal_num);
                        this.loading = false;
                    } else {
                        this.$message(msg);
                        this.loading = false;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 跳转到成交单详情跟进记录
             * @param {string} id 成交单id
             */
            showDetail(id) {
                // 查看流程配置页面
                let routeData = this.$router.resolve({
                    path: '/fundsBack/dealFollow',
                    query: {
                        id: id
                    }
                });
                let newOpen = window.open(routeData.href, '_blank');
                newOpen.opener = null;
            },
            /**
             * 跳转到回款组详情跟进记录
             * @param {string} id 回款组id
             */
            toGroupDetail(id) {
                // 查看流程配置页面
                let routeData = this.$router.resolve({
                    path: '/fundsBack/fundsBackFollow',
                    query: {
                        id: id
                    }
                });
                let newOpen = window.open(routeData.href, '_blank');
                newOpen.opener = null;
            },
            // 合计
            getSummaries(param) {
                const { columns } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总计';
                        return;
                    }
                    if (column.property === 'pre_paid_money') {
                        sums[index] = this.prePaidTotal;
                    }
                    if (column.property === 'unfollowed_money') {
                        sums[index] = this.unfollowedTotal;
                    }
                    if (column.property === 'follow_money') {
                        sums[index] = this.followedTotal;
                    }
                });
                return sums;
            },
            /**
             * @description: 点击表格跳转
             * @param {String} url 跳转链接
             */
            turnToNewPage(url) {
                let newOpen = window.open(url);
                newOpen.opener = null;
            }
        },
        mounted() {
            this.initData();
        }
    };
</script>

<style scoped lang="less">
.a-link {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
}
.turn-to-page {
    display: inline-block;
    color: #46aaff;
    cursor: pointer;
}
</style>