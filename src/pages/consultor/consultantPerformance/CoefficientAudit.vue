<!--
 * @author: xiejiaxin
 * @Date: 2021-05-14 11:36:14
 * @LastEditors: xie bin
 * @LastEditTime: 2021-05-25 14:28:40
 * @description: 积分提点审核页面
-->
<template>
    <div class="auto-group-wrap">
        <!--面包屑-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>提点积分审核列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索项 -->
        <div class="fiflter-box">
            <el-tabs
                v-model="activeName"
                type="border-card"
                @tab-click="tabsClick">
                <el-tab-pane
                    v-if="tabsIsShow.pointsReviewIsShow"
                    label="积分审核"
                    name="pintsReviewAudit">
                    <points-review-audit :cityData="cityData"></points-review-audit>
                </el-tab-pane>
                <el-tab-pane
                    v-if="tabsIsShow.mentionPointIsShow"
                    label="提点审核"
                    name="mentionPointAudit">
                    <mention-point-audit
                        v-if="isShow"
                        :cityData="cityData">
                    </mention-point-audit>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import MentionPointAudit from './MentionPointAudit';
import PointsReviewAudit from './PointsReviewAudit';
import commonApi from '../../../api/commonApi';
import { mapState } from "vuex";
export default {
    name: 'CoefficientAudit',
    components: {
        MentionPointAudit,
        PointsReviewAudit
    },
    data() {
        return {
            activeName: 'pintsReviewAudit',
            isShow: false,
            cityData: []
        }
    },
    computed: {
        ...mapState({
            // 获取通用配置信息
            userInfo: state => state.userInfo
        }),
        tabsIsShow: {
            get() {
                let roleVal = this.userInfo.role;
                let obj = {};
                if (roleVal === 'header' || roleVal === 'header_manager' || roleVal === 'admin') {
                    obj =  {
                        mentionPointIsShow: true,
                        pointsReviewIsShow: true
                    }
                } else if (roleVal === 'business_charger' || roleVal === 'bd_specialist'){
                    obj =  {
                        pointsReviewIsShow: true
                    }
                }
                return obj;
            }
        }
    },
    mounted() {
        this.getCitySelect();
    },
    methods: {
        tabsClick() {
            if (this.activeName === 'mentionPointAudit') {
                this.isShow = true;
            }
        },
        // 获取城市下拉
        async getCitySelect() {
            try {
                let params = {
                    type: '2',
                    param: 'withAll'
                }
                const { 
                    data: {
                        code,
                        data
                    }
                } = await commonApi.getDetailCityListData(params);
                if (code === 0) {
                    this.cityData = Object.freeze(data.list);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
    }
};
</script>

<style lang="less" scoped>
.auto-group-wrap {
    padding: 0 20px;
    box-sizing: border-box;
    .fiflter-box {
        /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
            color: #333;
        }
        /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
            color: #333;
            font-size: 16px;
        }
    }
    /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
}
</style>
