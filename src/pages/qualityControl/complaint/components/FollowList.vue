<!--
 * @author: kangxue
 * @Date: 2020-07-15 10:55:59
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-24 10:45:50
 * @description: 跟进详情的操作节点列表展示
-->
<template>
    <div class="v-box" v-if="list && list.length > 0">
        <div class="main-title">客诉跟进</div>
        <div class="follow-list">
            <el-timeline>
                <el-timeline-item v-for="(item, index) in list"
                    :key="index"
                    :timestamp="item.group"
                    placement="top">
                    <ul class="follow-content">
                        <li v-for="(x, y) in item.data"
                            :key="y">
                            <div class="list-title">{{x.name}}：</div>
                            <div class="list-content"
                                v-if="x.type === '1'">{{x.value}}</div>
                            <div class="list-content"
                                v-if="x.type === '2'">
                                <show-material :imgList="x.value.pic"
                                    :audioList="x.value.audio"></show-material>
                            </div>
                        </li>
                    </ul>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
import ShowMaterial from './ShowMaterial';
import api from '../api/complaint';
export default {
    name: 'FollowList',
    props: {
        // 客诉ID
        followId: {
            type: String,
            default: ''
        }
    },
    components: {
        ShowMaterial
    },
    data() {
        return {
            list: []
        };
    },
    mounted() {
        if (this.followId) {
            this.getFollowList();
        }
    },
    methods: {
        async getFollowList() {
            try {
                const {
                    data: { code, msg, data }
                } = await api.getFollowDetail({
                    id: this.followId
                });
                if (code === 0) {
                    this.list = data;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.follow-content {
    li {
        height: auto;
        overflow: hidden;
        .list-title {
            text-align: right;
            vertical-align: middle;
            float: left;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 125px;
        }
        .list-content {
            margin-left: 125px;
            line-height: 40px;
        }
    }
}
</style>