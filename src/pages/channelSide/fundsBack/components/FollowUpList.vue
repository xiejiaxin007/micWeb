<!--
 * @Name: 回款跟进内table组件
 * @Description: 回款跟进内table组件
 * @Author: wangxue
 * @Date: 2020-04-23
 -->
<template>
    <div class="follow-up-list-wrapper">
        <!-- 表格内容 -->
        <div class="table-wrap-new">
            <el-table ref="tableFixedWrap"
                border
                :data="tableList"
                v-loading="loading"
                size="small"
                show-summary
                :summary-method="getSummaries"
                row-class-name="row"
                cell-class-name="column"
                :highlight-current-row="true"
                :header-cell-style="tableHeaderColor">
                <el-table-column min-width="80"
                    prop="city_name"
                    label="地理城市"
                    fixed
                    align="center">
                </el-table-column>
                <el-table-column min-width="100"
                    prop="deal_id"
                    label="成交ID"
                    fixed
                    align="center">
                    <template slot-scope="scope">
                        <div @click="turnToNewPage(scope.row.deal_url)"
                            class="turn-to-page">{{scope.row.deal_id}}</div>
                    </template>
                </el-table-column>
                <el-table-column min-width="180"
                    prop="project_name"
                    label="楼盘名称"
                    fixed
                    align="center">
                </el-table-column>
                <el-table-column min-width="100"
                    prop="username"
                    label="成交客户姓名"
                    fixed
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="deal_step"
                    label="成交单进度"
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="subscribe_datetime"
                    label="认购日期"
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="grass_datetime"
                    label="草签日期"
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="sign_datetime"
                    label="网签日期"
                    align="center">
                </el-table-column>
                <el-table-column min-width="100"
                    prop="cooperate_type"
                    label="合作方式"
                    align="center">
                </el-table-column>
                <el-table-column min-width="100"
                    prop="commission_type"
                    label="回款类型"
                    align="center">
                </el-table-column>
                <el-table-column min-width="300"
                    prop="forecast_content"
                    label="单笔合同预测子条件"
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="pre_paid_money"
                    label="单笔合同预测金额"
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="unfollowed_money"
                    label="单笔剩余回款金额"
                    align="center">
                </el-table-column>
                <el-table-column min-width="120"
                    prop="follow_money"
                    label="本次跟进金额"
                    align="center">
                    <template slot-scope="scope">
                        <jl-number-input v-if="pageType==='1' && (currentStage === '1' || currentStage === '2')"
                            v-model="tableList[scope.$index].follow_money"
                            @input.native="followUpFun(scope.$index, scope.row)"
                            reg="twoNum" />
                        <span v-else>{{scope.row.follow_money}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="pageType==='1'"
                    fixed="right"
                    min-width="80"
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                            size="medium"
                            :disabled="tableList.length <= 1"
                            @click="moveOut(scope.$index, scope.row.id)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import followApi from '../api/followApi';
    import { commonFun } from '@/assets/js/utils/utils';
    export default {
        name: 'follow-up-list',
        props: {
            // 列表类型 1.获取成交单维度的，2.回款组维度
            typeList: {
                type: String,
                default: ''
            },
            // id
            id: {
                type: String,
                default: ''
            },
            // 页面类型 1:跟进页面 2:审核页面
            pageType: {
                type: String,
                default: ''
            },
            // 当前阶段
            currentStage: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                loading: '',
                // 表格内容
                tableList: [],
                // 移除列表
                moveList: [],
                // 单笔合同预测总金额
                prePaidTotal: '',
                // 单笔剩余回款总金额
                unfollowedTotal: '',
                // 本次跟进总金额
                followedTotal: '',
                // 本次跟进金额输入是否正确
                followMoneyTotalFlag: true
            };
        },
        created() {
            // 获取列表
            this.getFollowedForecastList();
        },
        methods: {
            /**
             * 输入本次跟进金额
             * @param {String} index 下标
             * @param {String} row 操作行数据
             */
            followUpFun(index, row) {
                if (row.follow_money - row.unfollowed_money > 0) {
                    this.$message('本次跟进金额不能大于单笔剩余回款金额');
                    this.tableList[index].follow_money = row.unfollowed_money;
                }
                // 本次跟进金额合计
                let followedTotalTemp = this.tableList.reduce((prev, curr) => {
                    return prev + Number(curr.follow_money);
                }, 0);
                this.followedTotal = parseFloat(followedTotalTemp).toFixed(2);
                // 本次跟进金额合计大于剩余跟进金额合计
                if (this.followedTotal - this.unfollowedTotal > 0) {
                    this.$message('本次跟进金额合计不能大于' + this.unfollowedTotal);
                    this.followMoneyTotalFlag = false;
                } else {
                    this.followMoneyTotalFlag = true;
                }
            },
            // 合计
            getSummaries(param) {
                const { columns } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
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
            // 初始化列表数据
            async getFollowedForecastList() {
                try {
                    let obj;
                    if (this.pageType === '2') {
                        obj = await followApi.getForecastList({
                            follow_id: this.id
                        });
                    } else {
                        let params = {
                            type: this.typeList,
                            id: this.id
                        };
                        obj = await followApi.followedForecastList(params);
                    }
                    let { data } = obj;
                    if (data.code === 0) {
                        this.tableList = data.data.list;
                        this.prePaidTotal = data.data.pre_paid_total;
                        this.unfollowedTotal = data.data.unfollowed_total;
                        this.followedTotal = data.data.followed_total;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * @description: 点击表格跳转
             * @param {String} url 跳转链接
             */
            turnToNewPage(url) {
                let newOpen = window.open(url);
                newOpen.opener = null;
            },
            /**
             * 移除操作
             * @param {String} index 移除下标
             * @param {String} id 移除id
             * @return
             */
            moveOut(index, id) {
                this.moveList.push(id);
                this.tableList.splice(index, 1);
                this.computedSum();
            },
            // 计算合计
            computedSum () {
                let newTableList = commonFun.deepClone(this.tableList);
                // 根据unique_id 去重
                for (var i = 0; i < newTableList.length; i++) {
                    for (var j = i + 1; j < newTableList.length; j++) {
                        if (newTableList[i].unique_id === newTableList[j].unique_id) {
                            newTableList.splice(j, 1);
                            j--;
                        }
                    }
                }
                // 重新计算合计
                // 单笔合同预测总金额
                let newPrePaidTotal = 0;
                // 单笔剩余回款总金额
                let newUnfollowedTotal = 0;
                newTableList.forEach(item => {
                    newPrePaidTotal = newPrePaidTotal + Number(item.pre_paid_money);
                    newUnfollowedTotal = newUnfollowedTotal + Number(item.unfollowed_money);
                });
                let newFollowedTotal = this.tableList.reduce((prev, curr) => {
                    return prev + Number(curr.follow_money);
                }, 0);
                this.followedTotal = parseFloat(newFollowedTotal).toFixed(2);
                this.prePaidTotal = newPrePaidTotal;
                this.unfollowedTotal = newUnfollowedTotal;
            },
            // 获取移除列表
            getRemoveList() {
                return this.moveList ? this.moveList.join(',') : '';
            },
            // 获取修改金额列表
            getMoneyList() {
                let moneyArr = [];
                this.tableList.forEach(item => {
                    moneyArr.push({
                        id: item.id,
                        value: item.follow_money
                    });
                });
                return moneyArr;
            },
            // 获取修改金额列表（详细，带表格所有字段，与三个总结）
            getMoneyDetailList() {
                let moneyArr = [];
                this.tableList.forEach(item => {
                    let obj = Object.assign({}, item);
                    obj.value = obj.follow_money;
                    moneyArr.push(obj);
                });
                let detailList = {
                    list: moneyArr,
                    pre_paid_total: this.prePaidTotal,
                    unfollowed_total: this.unfollowedTotal,
                    followed_total: this.followedTotal
                };
                return detailList;
            },
            // 获取本次金额修改是否正常
            getFollowMoneyTotalFlag() {
                return this.followMoneyTotalFlag;
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #f9f9f9;color: #333;';
                }
            }
        }
    };
</script>
<style scoped>
.turn-to-page {
    display: inline-block;
    color: #46aaff;
    cursor: pointer;
}
</style>
