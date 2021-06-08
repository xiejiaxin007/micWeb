<!--
    /**
    * @file 城市费率编辑页面
    * @date 2019.9.17
    * @author xiebin
    */
 -->
<template>
    <div class="collocation-wrap">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: 'rateSettingList' }">各城市目标费率</el-breadcrumb-item>
            <el-breadcrumb-item>城市目标费率编辑页</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="rate-setting-box">
            <div class="commission-box">
                <span class="label-info">居理预期抽成：</span>
                <jl-number-input v-model="commission"
                    class="commission-input"
                    reg="twoNum"
                    :minVal="0"
                    :maxVal="100" />
                <label>%</label>
            </div>
            <el-table :data="editorInitData"
                border
                style="width: 100%">
                <el-table-column prop="show_txt"
                    label="业态"
                    align="center">
                </el-table-column>
                <el-table-column label="费率(%)"
                    align="center">
                    <template slot-scope="scope">
                        <jl-number-input :value="scope.row.rate"
                            reg="twoNum"
                            @input.native="updateRateVal(scope,$event)" />
                        <label>%</label>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer">
                <el-button @click="cancelList">取消</el-button>
                <el-button type="primary"
                    @click="saveRateInfo">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import apiArray from '../../api/rateSettingApi/RateList';
export default {
    data() {
        return {
            // 编辑页面费率列表数据
            editorInitData: [],
            // 居理预期抽成
            commission: '',
            // 重复提交
            isSubmit: false
        };
    },
    mounted() {
        // 调用初始化费率数据方法
        this.getRateInitData();
    },
    methods: {
        // 目标费率获取初始数据
        async getRateInitData() {
            try {
                let params = {
                    city_id: this.$route.query.cityId,
                    business_datetime: this.$route.query.time
                };
                const {
                    data: { code, msg, data }
                } = await apiArray.getEditRateData(params);
                if (code === 0) {
                    this.editorInitData = data.list;
                    this.commission = data.julive_expect_commission || '';
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        /**
         * 更新rate的val
         * @params [String] rate editorInitData数组里的原始值
         * @params [Object] e event事件
         */
        updateRateVal(rate, e) {
            rate.row.rate = e.target.value;
        },
        // 判断费率是否为空
        rateInputIsNull() {
            let flag = true;
            this.editorInitData.map(data => {
                if (data.rate === '') {
                    flag = false;
                }
            });
            return flag;
        },
        // 点击保存数据
        async saveRateInfo() {
            if (this.rateInputIsNull() === false) {
                this.$message.error('费率不能为空！');
                return;
            }
            let list = this.editorInitData.map(data => {
                return {
                    id: data.id,
                    rate: data.rate
                };
            });
            if (this.isSubmit) {
                return false;
            }
            this.isSubmit = true;
            try {
                let params = {
                    list: list,
                    julive_expect_commission: this.commission
                };
                const {
                    data: { code, msg }
                } = await apiArray.getSaveRateData(params);
                if (code === 0) {
                    this.isSubmit = false;
                    this.$router.push({ path: 'rateSettingList' });
                } else {
                    this.isSubmit = false;
                    this.$message.error(msg);
                }
            } catch (err) {
                this.isSubmit = false;
            }
        },
        // 返回列表页
        cancelList() {
            this.$router.push({ path: 'rateSettingList' });
        }
    }
};
</script>

<style lang="less" scoped>
.collocation-wrap {
    width: 100%;
    padding: 20px 30px 0;
    margin: 0 auto;
    box-sizing: border-box;
    .rate-setting-box {
        width: 100%;
        background: #fff;
        margin-top: 20px;
        padding: 20px 20px 20px 30px;
        box-sizing: border-box;
        .number-input-box {
            display: inline-block;
            width: 90%;
            margin-right: 5px;
        }
        .footer {
            text-align: center;
            width: 100%;
            margin-top: 20px;
            /deep/ .el-button {
                width: 150px;
            }
        }
    }
    .commission-box {
        margin-bottom: 20px;
        font-size: 14px;
        .label-info {
            font-weight: bold;
        }
        .commission-input {
            width: 200px;
        }
    }
}
</style>