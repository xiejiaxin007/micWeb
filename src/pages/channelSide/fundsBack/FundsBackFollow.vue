<!--
 * @Name: 回款流程跟进
 * @Description: 回款组跟进记录页
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
            <div class="v-box-title">
                <div class="main-title">{{$route.meta.tit}}</div>
                <el-button type="primary"
                    v-if="canExport === 1"
                    @click="exportData"
                    size="medium">导出业绩确认明细</el-button>
            </div>
            <div class="info-box">
                <div class="funds-id">回款组ID：{{groupId}}</div>
                <table>
                    <tr>
                        <td>当前阶段：{{step}}</td>
                        <td>{{stepId === 8 ? '实际付款日期' : '预计回款日期'}}：{{backTime}}</td>
                    </tr>
                    <tr>
                        <td>下次跟进时间：{{followTime}}</td>
                        <td>跟进人：{{followUser}}</td>
                    </tr>
                </table>
            </div>
            <div class="table-box">
                <follow-detail-table
                    :id="$route.query.id"
                    @getListLength="getListLength"
                    type="2"
                ></follow-detail-table>
            </div>
            <!-- 回款跟进记录 -->
            <div v-loading="loading">
                <follow-time-list :list="activities"></follow-time-list>
            </div>
        </div>
        <!-- 选择业绩确认弹窗 -->
        <el-dialog title="选择业绩确认模板"
            :visible="tempVisble"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            width="550px"
            center>
            <div class="form-box">
                <div class="th">模板：</div>
                <div class="td">
                    <el-radio-group v-model="tempVal">
                        <el-radio v-for="item in exportList"
                            :key="item.value"
                            :label="item.value">{{item.name}}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <el-button
                    @click="tempVisble = false">取消</el-button>
                <el-button type="primary"
                    @click="confirm">确认</el-button>
            </span>
        </el-dialog>
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
                // 选择业绩确认模板
                tempVal: '1',
                // 成交单id
                id: '',
                // 加载
                loading: false,
                // 回款组id
                groupId: '',
                // 当前阶段
                step: '',
                // 阶段ID
                stepId: '',
                // 预计回款日期
                backTime: '',
                // 下次跟进时间
                followTime: '',
                // 跟进人
                followUser: '',
                // 跟进记录时间线
                activities: [],
                // 是否可以导出
                canExport: 2,
                // 选择业绩确认模板弹窗
                tempVisble: false,
                // 业绩确认模板选项数组
                exportList: []
            };
        },
        methods: {
            // 点击确认选择模板弹窗
            async confirm() {
                window.location.href = `/backend-api/expand/ex-money-back-group/follow-export?group_id=${this.groupId}&export_type=${this.tempVal}`;
                this.tempVisble = false;
            },
            // 获取成交单子组件数据条数
            getListLength(num) {
                this.tbListLen = num;
            },
            // 导出业绩确认明细
            async exportData() {
                // 超过500个成交单
                if (this.tbListLen > 500) {
                    this.$message.warning('不能超过500个成交单');
                    return false;
                }
                // 提前先把选项置为平台默认值
                this.tempVal = '1';
                this.tempVisble = true;
            },
            // 初始化回款跟进记录数据，时间线数据
            async initData() {
                try {
                    this.loading = true;
                    let params = {
                        group_id: this.id
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.getGroupDetail(params);
                    if (code === 0) {
                        this.activities = data.follow_list;
                        this.groupId = data.group_id;
                        this.step = data.stage_type_name;
                        this.stepId = data.stage_type_id;
                        this.backTime = data.pay_time;
                        this.followTime = data.next_follow_datetime;
                        this.followUser = data.follow_employee_id;
                        this.canExport = data.can_export;
                        this.exportList = Object.freeze(data.export_list) || [];
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
    .v-box-title {
        display: flex;
        .main-title {
            flex: 1;
        }
    }
}
.form-box {
    line-height: 32px;
    .th {
        float: left;
        width: 60px;
        text-align: right;
    }
    .td {
        overflow: hidden;
        padding-left: 10px;
        box-sizing: border-box;
    }
}
</style>