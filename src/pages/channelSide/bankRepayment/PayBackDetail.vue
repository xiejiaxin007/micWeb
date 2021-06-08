<!--
  * @file 回款统计详情
  * @author xiebin
  * @updateTime 2019.10.17
 -->
<template>
    <div class="payment-information">
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item to='/payment/paymentInformation'>银行回款详情</el-breadcrumb-item>
            <el-breadcrumb-item>回款统计详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="bank-flow-box">
            <div class="serach-box">
                <el-form
                :inline="true"
                :model="payBackForm"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm">
                    <el-form-item label="选择日期:">
                        <el-date-picker
                            v-model="payBackForm.monthDateVal"
                            type="month"
                            placeholder="选择日期"
                            format="yyyy-MM"
                            value-format="yyyy-MM">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择城市:">
                        <el-select
                            v-model="payBackForm.cityVal"
                            placeholder="请选择">
                            <el-option
                                v-for="item in cityListData"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="btn-style">
                    <el-button @click="reset">重置</el-button>
                    <el-button
                        type="primary"
                        @click="searchTableList">
                        搜索
                    </el-button>
                </div>
            </div>
            <el-table
                :data="payBackData"
                border
                style="width: 100%">
                <el-table-column
                    prop="city_name"
                    label="城市"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="verified_amount"
                    label="已核销金额"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="hanged_amount"
                    label="已挂靠金额"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="target_amount"
                    label="目标金额(万元)"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="目标完成率"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.target_finished_percent === '-' ? 0 : scope.row.target_finished_percent}}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center">
                    <!-- 自定义表头 -->
                    <template
                        slot="header"
                        slot-scope="scope" >
                        <el-button
                            type="text"
                            @click="complateScahe"
                            v-if="textIsShow">
                            完成进度( &darr; )
                        </el-button>
                        <el-button
                            type="text"
                            @click="complateScahe"
                            v-else>
                            完成进度( &uarr; )
                        </el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-progress
                            :text-inside="true"
                            :stroke-width="26"
                            :percentage="scope.row.target_finished_percent === '-' ? 0 : (Number(scope.row.target_finished_percent) > 100 ? 100 : (Number(scope.row.target_finished_percent)))">
                        </el-progress>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import paymentInformationApi from '../../../api/bankRepaymentApi/paymentInformation';
export default {
    data() {
        return {
            // 回款数据
            payBackData: [],
            // 回款表单
            payBackForm: {
                // 日期val
                monthDateVal: '',
                // 城市val
                cityVal: ''
            },
            // 城市列表数据
            cityListData: [],
            // 详情请求url
            detailUrl: '',
            // 完成进度文案切换
            textIsShow: false
        }
    },
    mounted() {
        // 调用城市列表方法
        this.getCityList();
        // 调用获取详情请求url
        this.getDetailUrlInfo();
    },
    methods: {
        // 完成进度点击
        complateScahe() {
            let params;
            this.textIsShow = !this.textIsShow;
            console.log(this.textIsShow)
            if (this.textIsShow) {
                params = {
                   date: this.payBackForm.monthDateVal,
                   city_id: this.payBackForm.cityVal,
                   sort: '2'
               }
            } else {
                params = {
                   date: this.payBackForm.monthDateVal,
                   city_id: this.payBackForm.cityVal,
                   sort: '1'
               }
            }
            // // 调取列表数据
            this.getTableData(params)
        },
        // 获取城市列表
        async getCityList() {
            let params = {
                type: '2',
                param: 'withAll'
            }
            try {
                let result = await paymentInformationApi.getDetailCityListData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 城市列表赋值
                    this.cityListData = data.data;
                }
            }catch(error) {
                console.log(error);
            }
        },
        // 获取详情api
        async getDetailUrlInfo() { 
            try {
                let result = await paymentInformationApi.getPayBackDetailUrlData();
                let { data } = result;
                if (data.code === 0) {
                    // 城市列表赋值
                    this.detailUrl = data.data.url;
                    // 调用表格数据方法
                    this.getTableData();
                }
            }catch(error) {
                console.log(error);
            }
        },
        /**
         * 获取表格数据
         * @params [Object] params 搜索条件
         * @params [string] params.date  日期
         * @params [string] params.city_id  城市id
         */
        async getTableData(params) { 
            try {
                let result;
                if (params) {
                    result = await paymentInformationApi.getPayBackDetailData(this.detailUrl, params);
                }else {
                    result = await paymentInformationApi.getPayBackDetailData(this.detailUrl);
                }
                let { data } = result;
                if (data.code === 0) {
                    // 城市列表赋值
                    this.payBackData = data.data.list;
                    console.log(this.payBackData)
                }
            }catch(error) {
                console.log(error);
            }
        },
        // 搜索事件
        searchTableList() {            
            let params = {
                date: this.payBackForm.monthDateVal,
                city_id: this.payBackForm.cityVal
            }
            // 调取列表数据
            this.getTableData(params)
        },
        // 重置搜索条件
        reset() {
            this.payBackForm = {
                // 日期val
                monthDateVal: '',
                // 城市val
                cityVal: ''
            };
            // 调取列表数据
            this.getTableData();
        }
    }
}
</script>

<style lang="less" scoped>
.payment-information {
    padding: 0 20px;
    box-sizing: border-box;
    .bank-flow-box {
        width: 100%;
        min-height: 100px;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
        .btn-style {
            width: 100%;
            margin: 20px auto 50px;
            text-align: center;
            /deep/ .el-button {
                width: 120px;
            }
        }
    }
}
</style>