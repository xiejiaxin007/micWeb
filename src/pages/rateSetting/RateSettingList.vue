<!--
    /**
    * @file 城市费率列表
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
            <el-breadcrumb-item>各城市目标费率</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 费率列表 -->
        <div class="rate-setting-box"
            v-loading="loading">
            <el-button type="primary"
                class="pull-right"
                @click="addQuarter">添加季度</el-button>
            <div class="order-search">
                <!--查询搜索-->
                <ul class="s-query">
                    <li>
                        <div class="th">城市：</div>
                        <div class="td">
                            <search-select-radio v-model="city"
                                placeholder="请选择"
                                @input="getRateInfoData(1)"
                                clearable
                                :apiInfo="cityApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">季度：</div>
                        <div class="td">
                            <el-select v-model="quarter"
                                placeholder="请选择"
                                clearable
                                @change="getRateInfoData(1)">
                                <el-option v-for="item in quarterList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
            </div>
            <el-table :data="rateList"
                border
                style="width: 100%">
                <el-table-column prop="city_id_name"
                    label="城市"
                    align="center">
                </el-table-column>
                <el-table-column prop="business_datetime_text"
                    label="季度"
                    align="center">
                </el-table-column>
                <el-table-column label="业态及目标费率"
                    align="center">
                    <template slot-scope="scope">
                        <p v-for="(item, index) in scope.row.project_type_and_rate"
                            :key="index">
                            {{item}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="居理预期抽成"
                    align="center">
                    <template slot-scope="scope">
                        {{scope.row.julive_expect_commission ? scope.row.julive_expect_commission + '%' : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="update_datetime_str"
                    label="更新时间"
                    align="center">
                </el-table-column>
                <el-table-column prop="updator_str"
                    label="更新人"
                    align="center">
                </el-table-column>
                <el-table-column label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                            size="mini"
                            @click="jumpEditPage(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination v-if="totalNum-pageSize>0"
                background
                :page-size="pageSize"
                layout="prev, pager, next"
                :current-page.sync="currentPage"
                @current-change="pageChange"
                :total="totalNum">
            </el-pagination>
        </div>
        <!-- 添加季度 -->
        <el-dialog title="添加季度"
            :visible.sync="dialog.visible"
            width="420px"
            center>
            季度：
            <el-select v-model="dialog.quarter"
                placeholder="请选择">
                <el-option v-for="item in dialog.quarterList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"></el-option>
            </el-select>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="dialog.visible = false">取消</el-button>
                <el-button type="primary"
                    @click="saveQuarter">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import apiArray from '../../api/rateSettingApi/RateList';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
export default {
    components: {
        SearchSelectRadio
    },
    data() {
        return {
            // 加载
            loading: false,
            // 费率数据列表
            rateList: [],
            // 当前页面
            currentPage: 1,
            // 数据总数
            totalNum: 0,
            // 每页显示数据
            pageSize: 20,
            // 搜索-城市
            city: '',
            // 城市下拉api
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll'
                }
            },
            // 搜索-季度
            quarter: '',
            // 搜索季度下拉
            quarterList: [],
            // 新增季度弹窗的数据
            dialog: {
                visible: false,
                // 初始默认的季度
                quarter: '',
                // 可选的未来的一年的季度
                quarterList: []
            }
        };
    },
    mounted() {
        this.getQuarterList()
            .then(res => {
                //resolve结果
                console.log(res);
                // 费率列表接口调用
                this.getRateInfoData();
            })
            .catch(msg => {
                this.$message.error(msg);
            });
    },
    methods: {
        // 获取季度下拉数据
        getQuarterList() {
            return new Promise(async (resolve, reject) => {
                try {
                    this.loading = true;
                    const {
                        data: { code, msg, data }
                    } = await apiArray.getQuarterList();
                    if (code === 0) {
                        this.quarterList = data.searchBusinessDatetime;
                        this.dialog.quarterList = data.addBusinessDatetime;
                        this.quarter = data.default.value;
                        this.loading = false;
                        resolve(this.quarter);
                    } else {
                        reject(msg);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        },
        // 添加季度
        addQuarter() {
            this.dialog.quarter = this.dialog.quarterList.length > 0 ? this.dialog.quarterList[0].value : '';
            this.dialog.visible = true;
        },
        // 确认保存季度
        async saveQuarter() {
            try {
                const {
                    data: { code, msg }
                } = await apiArray.saveQuarter({
                    business_datetime: this.dialog.quarter
                });
                if (code === 0) {
                    this.dialog.visible = false;
                    this.getRateInfoData(1);
                    this.getQuarterList();
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        /**
         * 获取费率列表数据请求
         * @params [number] page 当前页码
         */
        async getRateInfoData(page) {
            try {
                this.loading = true;
                if (page) {
                    this.currentPage = page;
                }
                let params = {
                    pageIndex: this.currentPage,
                    defaultPageSize: this.pageSize,
                    city_id: this.city,
                    business_datetime: this.quarter
                };
                const {
                    data: { code, msg, data }
                } = await apiArray.getRateListData(params);
                if (code === 0) {
                    this.loading = false;
                    this.rateList = data.list;
                    this.totalNum = data.count ? Number(data.count) : 0;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        // 翻页
        pageChange() {
            this.getRateInfoData();
        },
        /** 跳转到编辑页面
         *  @params row [Object] 点击当前行的数据
         */
        jumpEditPage(row) {
            this.$router.push({
                path: 'rateEditSetting',
                query: {
                    cityId: row.city_id,
                    time: row.business_datetime
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.pull-right {
    float: right;
}
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
        /deep/ .el-pagination {
            text-align: center;
            margin-top: 20px;
        }
    }
}
</style>