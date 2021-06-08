<template>
    <div class="table-list-wrap">
        <div class="panel-title">
            共{{allTotal}}条数据
        </div>
        <el-table
            class="table-list"
            :data="tableData"
            stripe
            @sort-change="sortChange"
            style="width: 100%">
            <el-table-column
                prop="index_url"
                label="房源首图"
                >
                <template slot-scope="scope">
                    <img v-if="scope.row.index_url !== ''" class="table-img" :src="scope.row.index_url" alt="default"/>
                    <img v-else class="table-img" src="../../assets/images/defalut-bg.png" alt="default"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="village_name"
                label="小区名称"
                >
                <template slot-scope="scope">
                    <div class="village-info">
                        <div class="title">{{scope.row.village_name}}</div>
                        <div class="area-business">{{scope.row.district_name}}{{scope.row.trade_area_name == '' ? '' : '-'}}{{ scope.row.trade_area_name}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="room"
                label="户型"
                sortable="custom"
                >
                <template slot-scope="scope">
                    <div class="house-type">
                        {{scope.row.room.value}} - {{scope.row.hall.value}} - {{scope.row.kitchen.value}} - {{scope.row.toilet.value}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="build_acreage"
                label="面积"
                sortable="custom"
                >
                <template slot-scope="scope">
                    <div class="house-area" v-show="scope.row.build_acreage.value != '0'">
                        {{scope.row.build_acreage.value}} {{scope.row.build_acreage.unit}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="unit_price"
                label="单价"
                sortable="custom"
                >
                <template slot-scope="scope">
                    <div
                        class="unit-price"
                        v-show="scope.row.unit_price.value != '0.00'">
                        {{scope.row.unit_price.value}} {{scope.row.unit_price.unit}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="total_price"
                label="总价"
                sortable="custom"
                >
                <template slot-scope="scope">
                    <div
                        class="total-price"
                        v-show="scope.row.total_price.value != '0'">
                        {{scope.row.total_price.value}} {{scope.row.total_price.unit}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="total_floor_num"
                label="楼层"
                sortable="custom"
                >
                <template slot-scope="scope">
                    <div class="floor-num">
                        {{scope.row.height_type}} / {{scope.row.total_floor_num}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="orientations"
                label="朝向"
                >
                <template slot-scope="scope">
                    <div class="orientations">
                        {{scope.row.orientations.map(ele => ele.orientations).join('、')}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="create_datetime"
                label="挂牌"
                sortable="custom"
                >
                <template slot-scope="scope">
                    <div class="create-datetime">
                        {{scope.row.create_datetime || ''}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="maintain_name"
                label="维护人"
                
                >
                <template slot-scope="scope">
                    <div class="maintain-name">
                        <div
                            class="name"
                            v-if="scope.row.maintain_name !== ''">
                            <el-tooltip :content="`${scope.row.maintain_name}(${scope.row.store_name}-${scope.row.maintain_mobile})`" placement="bottom">
                            <p>{{scope.row.maintain_name}}({{scope.row.store_name}}{{scope.row.store_name == '' || scope.row.maintain_mobile == '' ? '' : '-'}}{{scope.row.maintain_mobile}})</p>
                            </el-tooltip>
                        </div>
                        <div class="operate-btn-box">
                            <button
                                class="btn btn-primary check-detail"
                                @click="gotoDetail(scope.row.id)">
                                查看详情
                            </button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-box">
            <el-pagination
                background
                :page-size="pages.size"
                prev-text="上一页"
                next-text="下一页"
                layout="prev, pager, next"
                :total="pages.total"
                :current-page.sync="pages.curPage"
                @current-change="pageChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HouseTable',
        props: {
            // 表格数据
            tableDataList: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            // 排序数据
            sortDataList: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            // 排序数据
            currentPage: {
                type: Number,
                default: 0
            },
        },
        watch: {
            // 搜索条件
            'tableDataList': function(val) {
                console.log(val);
                this.tableDataInit(val);
            },
            // 搜索条件
            'currentPage': function(val) {
                console.log(val);
                this.pages.curPage = 1;
                this.$emit('pageListChange', 1);
            },
        },
        data() {
            return {
                tableData: [],
                pages: {
                    // 总条数
                    total: 100,
                    // 每页条数
                    size: 20,
                    // 当前页
                    curPage: 1
                },
                allTotal: 0
            }
        },
        computed: {
            
        },
        mounted() {
            console.log(this.pages.curPage);
            this.tableDataInit(this.tableDataList);
        },
        methods: {
            // 初始化数据
            tableDataInit(item) {
                this.tableData = item.house_list;
                this.allTotal = item.house_total;
                if (item.house_total > 5000) {
                    this.pages.total = 5000;
                } else {
                    this.pages.total = item.house_total;
                }
            },
            // 当分页改变的时候
            pageChange(e) {
                this.$emit('pageListChange', e);
            },
            // 跳转到详情
            gotoDetail(houseId) {
                this.$router.push({
                    path: '/secondHouse/secondHouseDetail',
                    query: {
                        houseId
                    }
                })
            },
            /**
             * 排序规则
             * @param {String} item 正序还是倒序
             * @param {String} val 当前点击的列的值
             */
            orderMthods(item,val) {
                if (item == 'ascending') {
                    this.$emit('sortTableList',[val, '+']);
                } else if (item == 'descending') {
                    this.$emit('sortTableList',[val,'-']);
                } else {
                    this.$emit('sortTableList',[])
                }
            },
            /**
             * 排序
             * @param {Object} e 当前点击列的值
             */
            sortChange(e) {
                console.log(e)
                console.log(this.sortDataList)
                // 户型
                if (e.prop == 'room') {
                    this.orderMthods(e.order, this.sortDataList.value[0].value);
                }
                // 面积
                else if (e.prop == 'build_acreage') {
                    this.orderMthods(e.order, this.sortDataList.value[1].value);
                }
                // 单价
                else if (e.prop == 'unit_price') {
                    this.orderMthods(e.order, this.sortDataList.value[2].value);
                }
                // 总价
                else if (e.prop == 'total_price') {
                    this.orderMthods(e.order, this.sortDataList.value[3].value);
                }
                // 楼层
                else if (e.prop == 'total_floor_num') {
                    this.orderMthods(e.order, this.sortDataList.value[4].value);
                }
                // 楼层
                else if (e.prop == 'create_datetime') {
                    this.orderMthods(e.order, this.sortDataList.value[5].value);
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .table-list-wrap {
        background-color: #fff;
        border-radius: 8px;
        padding: 24px 24px 24px 0; 
        box-sizing: border-box;
        .panel-title {
            position: relative;
            overflow: hidden;
            font-size: 16px;
            font-weight: bold;
            color: #424242;
            display: flex;
            align-items: center;
            margin-bottom: 14px;
            padding-left: 16px;
            height: 22px;
            line-height: 22px;
            &::before {
                content: "";
                position: absolute;
                bottom: 4px;
                left: 0;
                background-color: #00c0eb;
                width: 4px;
                height: 14px;
                border-radius: 0 2px 2px 0;
            }
        }
        /deep/ .el-table {
            padding-left: 24px;
            color: #424242;
            .title {
                font-family:PingFangSC-Medium,PingFang SC;
                font-weight: bold;
            }
            .area-business {
                margin-top: 32px;
            }
        }
        /deep/ .el-table__header {
            background-color: #f1f4fb;
            th {
                background-color: #f1f4fb;
                padding: 8px 0;
                > .cell {
                    font-size: 12px;
                    color: #424242;
                    height: 32px;
                    line-height:32px;
                }
                
            }
        }
        /deep/ .el-table .ascending .sort-caret.ascending {
            border-bottom-color: #00C0EB;
        }
        /deep/ .el-table .descending .sort-caret.descending{
            border-top-color: #00C0EB;
        }
        /deep/ .el-table__body {
            td {
                padding: 16px 0;
                border: 0;
            }
            .cell {
                > div {
                    height: 72px;
                }
            }
            tr.el-table__row--striped td {
                // background-color: #fafafa;
                border: 0px;
            }
        }
        /deep/ .el-table__body tr:hover > td{
            background-color:#F1F4FB !important;
        }
        .table-img {
            width: 96px;
            height: 72px;
            border-radius: 4px;
        }
        .maintain-name {
            position: relative;
            padding-right: 26px;
            .name {
                width: 100%;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
        .operate-btn-box {
            display: flex;
            position: absolute;
            right: 16px;
            bottom: 0;
        }
        .btn {
            line-height: 16px;
            font-size: 12px;
            border-radius: 2px;
            padding: 3px 12px;
            &.btn-primary {
                background-color: #00c0eb;
                color: #fff;
            }
            &.check-detail {
                margin-right: 16px;
            }
        }
        .page-box {
            text-align: center;
            margin-top: 24px;
            /deep/ .el-pagination {
                
                .btn-prev, .btn-next {
                    padding: 0 14px;
                    color: #424242;
                }
                .el-pager li:not(.disabled) {
                    &.active {
                        background-color: #00c0eb;
                    }
                    &:hover {
                        color: #00c0eb;
                    }
                }
                
                .el li {
                    color: #424242;
                }
            }
        }
    }
</style>