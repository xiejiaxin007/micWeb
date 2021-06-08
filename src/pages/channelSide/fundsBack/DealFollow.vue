<!--
 * @Name: 回款流程跟进
 * @Description: 成交单跟进记录页
 * @Author: kangxue
 * @Date: 2020-04-24
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>回款流程跟进</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box">
            <div class="main-title">{{$route.meta.tit}}</div>
            <div class="table-box">
                <follow-detail-table
                    :id="$route.query.id"
                    type="1"
                ></follow-detail-table>
            </div>
            <!-- 回款跟进记录 -->
            <div v-loading="loading">
                <follow-time-list :list="activities"></follow-time-list>
            </div>
        </div>
    </div>
</template>

<script>
    import api from './api/followApi';
    import FollowTimeList from './components/FollowTimeList';
    import FollowDetailTable from './components/FollowDetailTable';
    export default {
        components: {
            FollowTimeList,
            FollowDetailTable
        },
        data() {
            return {
                // 成交单id
                id: '',
                // 加载
                loading: false,
                // 跟进记录时间线
                activities: []
            };
        },
        methods: {
            // 初始化回款跟进记录数据，时间线数据
            async initData() {
                try {
                    this.loading = true;
                    let params = {
                        deal_id: this.id
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.getDealDetail(params);
                    if (code === 0) {
                        this.activities = data.follow_list;
                        this.loading = false;
                    } else {
                        this.$message(msg);
                        this.loading = false;
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            this.initData();
        }
    };
</script>

<style lang="less" scoped>
.container-box {
    padding: 0 20px;
    .v-box {
        background: #fff;
        padding: 20px;
        .main-title {
            font-weight: bold;
            font-size: 16px;
            padding-bottom: 20px;
        }
        .info-box {
            margin-bottom: 10px;
            .funds-id {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            table tr td {
                padding: 5px 30px 5px 0;
            }
        }
        .table-box {
            margin-bottom: 20px;
        }
    }
}
</style>