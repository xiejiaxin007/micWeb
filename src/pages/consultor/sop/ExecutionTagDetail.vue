<template>
    <div class="execution-tag-list">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>标签说明页</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box form-table-box">
            <div class="hd">
                <h2>执行力标签详情</h2>
            </div>
            <div class="bd">
                <div class="data-stat">
                    <el-row>
                        <el-col :span="12">
                            <p class="total-num">当前共有{{totalNum}}个加分标签</p>
                        </el-col>
                    </el-row>
                </div>
                <div class="table-wrap">
                    <el-table ref="tableFixedWrap"
                        border
                        :data="tableData"
                        size="small"
                        row-class-name="row"
                        cell-class-name="column"
                        :highlight-current-row="true"
                        :header-cell-style="tableHeaderColor">
                        <el-table-column min-width="100"
                            prop="tag_name"
                            label="标签名称"
                            align="center">
                        </el-table-column>
                        <el-table-column min-width="180"
                            prop="rule"
                            label="标签规则"
                            align="center">
                        </el-table-column>
                        <el-table-column min-width="80"
                            prop="first_score"
                            label="分值"
                            align="center">
                        </el-table-column>
                        <el-table-column min-width="100"
                            prop="effect_datetime"
                            label="开始时间"
                            align="center">
                        </el-table-column>
                        <el-table-column min-width="60"
                            prop="floatation_ratio"
                            label="上浮分数"
                            align="center">
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :current-page.sync="page"
                            @current-change="initData"
                            :hide-on-single-page="totalNum <= 0"
                            :total="totalNum">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import apiObj from './api/sop';
    export default {
        name: 'executiontagDetail',
        data() {
            return {
                // 一页多少条数据
                pageSize: 20,
                // 页码
                page: 1,
                // 总数据
                totalNum: 0,
                // 表格数据
                tableData: []
            };
        },
        created() {
            // 初始化数据
            this.initData(1);
        },
        methods: {
            /**
             * 初始化数据
             * @param {string} page 页码
             */
            async initData(page) {
                let params = {
                    page
                };
                try {
                    const {
                        data: { data, msg, code }
                    } = await apiObj.getIncreaseTagList(params);
                    if (code === 0) {
                        this.tableData = data.list;
                        this.totalNum = Number(data.total);
                    } else {
                        this.$message(msg);
                    }
                } catch (err) {
                    console.log(err);
                }
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
<style scoped lang='less'>
.execution-tag-list {
    padding: 0 30px;
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
            font-size: 14px;
        }
    }
    .pagination {
        margin-top: 10px;
        text-align: center;
    }
}
</style>