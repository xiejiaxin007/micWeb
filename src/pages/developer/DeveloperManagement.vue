
<!--
 * @Name: 开发商管理模块
 * @Description: 开发商管理模块
 * @Author: wangxue
 * @Date: 2020-02-05
-->
<template>
    <div class="developer-management-box">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>开发商管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--标签分页-->
        <div class="tabBox">
            <el-tabs v-model="activeName">
                <el-tab-pane
                    label="开发商管理"
                    name="first"
                    v-if="role !== 'operation_manager' && role !== 'operation_specialist'"
                    :lazy="true"
                >
                    <kfs-management-tab></kfs-management-tab>
                </el-tab-pane>
                <el-tab-pane
                    label="开发商人员管理"
                    name="second"
                    v-if="role !== 'operation_manager' && role !== 'operation_specialist'"
                    :lazy="true"
                >
                    <kfs-personal></kfs-personal>
                </el-tab-pane>
                <el-tab-pane
                    label="开发商余额管理"
                    name="third"
                    v-if="role !== 'operation_manager' && role !== 'operation_specialist'"
                    :lazy="true"
                >
                    <kfs-balance></kfs-balance>
                </el-tab-pane>
                <el-tab-pane
                    label="开发商订单分配规则管理"
                    name="fourth"
                    :lazy="true"
                >
                    <alloc-rule></alloc-rule>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import KfsManagementTab from './components/KfsManagementTab';
    import KfsPersonal from './components/KfsPersonal';
    import KfsBalance from './components/KfsBalance';
    import AllocRule from './components/AllocRule';
    import { mapState } from 'vuex';
    export default {
        name: 'developerManagement',
        data() {
            return {
                activeName: 'first',
                active: this.$route.query.active
            };
        },
        components: {
            KfsManagementTab,
            KfsPersonal,
            KfsBalance,
            AllocRule
        },
        created() {
            if (this.active === '1') {
                this.activeName = 'first';
            } else if (this.active === '2') {
                this.activeName = 'second';
            } else if (this.active === '3') {
                this.activeName = 'third';
            } else if (this.active === '4' || this.role === 'operation_manager' || this.role === 'operation_specialist') {
                this.activeName = 'fourth';
            }
        },
        methods: {},
        computed: {
            // 权限： 如果是运营主管和运营专员只展示分配规则管理
            ...mapState({
                 role: state => state.trackCommon.info.role
            })
        },
        watch: {
            // 权限： 如果是运营主管和运营专员只展示分配规则管理
            role: {
                deep: true,
                handler(val) {
                    if (val === 'operation_manager' || val === 'operation_specialist') {
                        this.activeName = 'fourth';
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.developer-management-box {
    padding: 0 30px;
    .tabBox {
        background: #fff;
        margin-bottom: 20px;
        /deep/ .el-tabs__nav {
            left: 45px;
            bottom: 0;
        }
        /deep/ .el-tabs__item {
            font-size: 16px;
        }
        /deep/ .el-tabs__header {
            margin: 0;
            padding-top: 15px;
        }
    }
}
</style>
