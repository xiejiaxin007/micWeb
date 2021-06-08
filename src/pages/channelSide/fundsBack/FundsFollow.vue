<!--
 * @Name: 回款跟进
 * @Description: 回款待跟进和跟进列表
 * @Author: xiejiaxin
 * @Date: 2020-04-22
 -->
<template>
    <div class="developer-management-box">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>回款流程跟进</el-breadcrumb-item>
        </el-breadcrumb>
        <!--标签分页-->
        <div class="tabBox">
            <div class="tab-title">
                <div class="title-content">回款流程跟进</div>
                <div class="title-tip"
                    @click="goHref">目前剩余{{constract.num}}份合同，用印审批已超过30天尚未完成合同归档或合同作废；剩余{{constract.contract_num}}份电子合同，待我方盖章，请及时处理~</div>
            </div>
            <el-tabs
                @tab-click="tabClick"
                v-model="tabName">
                <el-tab-pane
                    label="跟进列表"
                    name="list"
                    :lazy="true">
                    <follow-list @getTitInfo="getTitInfo"></follow-list>
                </el-tab-pane>
                <el-tab-pane
                    label="待跟进列表"
                    name="waitList"
                    :lazy="true">
                    <stay-follow-list @getTitInfo="getTitInfo"></stay-follow-list>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import FollowList from './components/FollowList.vue';
import StayFollowList from './components/StayFollowList.vue';
export default {
    name: 'funds-follow',
    data() {
        return {
            // 剩余合同数量
            constract: {
                // 合同数
                num: '',
                // 跳转url
                url: '',
                // 电子合同数
                contract_num: ''
            },
            // tab选项
            tabName: this.$route.query.tab ? this.$route.query.tab : 'list'
        }
    },
    components: {
        FollowList,
        StayFollowList
    },
    mounted() {
        // 设置title
        if (this.tabName === 'list') {
            document.title = '跟进列表';
        } else {
            document.title = '待跟进列表';
        }
    },
    methods: {
        /**
         * 点击tab标签
         * @param {Object} tab 点击的tab对象
         */
        tabClick(tab) {
            // this.$router.push({
            //     query: merge(this.$route.query, {
            //         tab: tab.name
            //     })
            // });

            // 设置title
            if (tab.name === 'list') {
                document.title = '跟进列表';
            } else {
                document.title = '待跟进列表';
            }
        },
        /**
         * @description: 获取公共顶部title
         * @param {Object} val 顶部数据对象 
         */
        getTitInfo(val) {
            const { num, url, contract_num } = val;
            this.constract.num = num || 0;
            this.constract.url = url;
            this.constract.contract_num = contract_num || 0;
        },
        // 跳转页面
        goHref() {
            if (this.constract.url) {
                let opener = window.open(this.constract.url, '_blank');
                opener.opener = null;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.developer-management-box {
    padding: 0 30px;
    .tabBox {
        .tab-title {
            overflow: hidden;
            padding-top: 20px;
            box-sizing: border-box;
            .title-content {
                float: left;
                padding-left: 20px;
                box-sizing: border-box;
                font-size: 20px;
                font-weight: 500;
            }
            .title-tip {
                overflow: hidden;
                text-align: center;
                font-size: 20px;
                color: #ff0000;
                cursor: pointer;
            }
        }
        background: #fff;
        margin-bottom: 20px;
        /deep/ .el-tabs__nav {
            left: 20px;
            bottom: 0;
        }
        /deep/ .el-tabs__item {
            font-size: 16px;
        }
        /deep/ .el-tabs__header {
            margin: 0;
            padding-top: 10px;
        }
    }
}
</style>
