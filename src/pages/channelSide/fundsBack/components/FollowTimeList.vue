<!--
 * @Name: 回款跟进记录组件，时间线展示
 * @Description: 回款跟进记录组件，时间线展示
 * @Author: kangxue
 * @Date: 2020-04-26
-->
<template>
    <div>
        <div class="main-title">回款跟进记录</div>
        <div class="step-box">
            <el-timeline>
                <el-timeline-item
                    v-for="(item, index) in list"
                    :key="index"
                >
                    <ul class="follow-step">
                        <li class="follow-time">跟进时间：{{item.create_datetime}}</li>
                        <li class="follow-id">跟进ID：{{item.follow_id}}</li>
                        <li class="funds-ids">回款组ID：<span @click="toFollow(item.group_Id)">{{item.group_Id}}</span></li>
                        <li class="follow-step">跟进阶段：{{item.stage_type}}</li>
                        <li class="follow-user">跟进人：{{item.employee_name}}</li>
                        <li class="check-result">审核结果：{{item.audit_status}}</li>
                        <li class="show-detail">
                            <span @click="showDetail(item.group_Id, item.follow_id)">查看跟进详情</span>
                        </li>
                    </ul>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            // 数据列表
            list: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                
            };
        },
        methods: {
            /**
             * 跳转到回款组跟进记录页
             * @param {string} id 回款组id
             */
            toFollow(id) {
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
            /**
             * 跳转到跟进审批页
             * @param {string} groupId 回款组id
             * @param {string} followId 跟进id
             */
            showDetail(groupId, followId) {
                // 查看流程配置页面
                let routeData = this.$router.resolve({
                    path: '/fundsBack/approval',
                    query: {
                        followId: followId,
                        groupId: groupId
                    }
                });
                let newOpen = window.open(routeData.href, '_blank');
                newOpen.opener = null;
            }
        }
    };
</script>

<style lang="less" scoped>
.main-title {
    font-weight: bold;
    font-size: 16px;
    padding-bottom: 20px;
}
.follow-step {
    li {
        display: inline-block;
        padding-right: 10px;
    }
    .follow-time {
        width: 210px;
    }
    .follow-id {
        width: 100px;
    }
    .funds-ids {
        width: 110px;
    }
    .follow-step {
        width: 170px;
    }
    .follow-user {
        width: 180px;
    }
    .check-result {
        width: 150px;
    }
    span {
        color: #409eff;
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>