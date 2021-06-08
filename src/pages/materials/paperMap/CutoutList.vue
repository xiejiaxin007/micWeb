<template>
    <div class="cutout-list">
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                纸质地图列表
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="btn-area">
            <button
                class="btn btn-addMap"
                @click="addDialog = true"
            >
                +新建地图
            </button>
        </div>
        <div class="cutout-table">
            <el-table :data="mapList">
                <el-table-column
                    prop="map_name"
                    label="地图名称"
                ></el-table-column>
                <el-table-column
                    prop="city_name"
                    label="城市"
                ></el-table-column>
                <el-table-column
                    prop="update_datetime"
                    label="楼盘数据更新时间"
                ></el-table-column>
                <el-table-column
                    prop="employee_name"
                    label="最近编辑人"
                ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                            <span
                                @click="editMap(scope)"
                                class="edit-data"
                            >
                                编辑及下载
                            </span>
                            <span
                                @click="deleteMap(scope)"
                                class="delete-data"
                            >
                                删除
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div
                class="page"
                v-if="mapList.length > 0"
            >
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pages.total"
                    :current-page.sync="pages.page"
                    :page-size="pages.pageSize"
                    @current-change="changePage"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog
            :visible.sync="addDialog"
            width="400px"
            class="add-dialog"
        >
            <div class="dialog-center">
                <h2>
                    选择城市
                </h2>
                <el-select
                    v-model="adjustCity"
                    filterable
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in cityList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <div class="btn-area">
                    <button @click="addDialog = false">取消</button>
                    <button
                        class="confirm"
                        @click="addMap"
                    >确认</button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { cutoutList } from './api/cutoutListApi';
    import { commonFun } from '@/assets/js/utils/utils';
    export default {
        data() {
            return {
                // 地图列表
                mapList: [],
                // 弹窗开关
                addDialog: false,
                // 核算城市列表
                cityList: [],
                // 核算城市id
                adjustCity: '',
                pages: {
                    // 总数
                    total: 0,
                    // 每页显示
                    pageSize: 20,
                    // 当前页
                    page: 1
                },
                // 重复创建地图
                flag: true
            };
        },
        mounted() {
            this.initList();
            this.getCity();
            this.$store.dispatch('getTrackCommon');
        },
        methods: {
            /**
             * @description: 编辑地图
             * @param {object} scope 列表单行信息
             */
            editMap(scope) {
                // 埋点拓展字段
                let paraObj = {
                    city: scope.row.city_name,
                    map_id: scope.row.id
                };
                // 埋点请求
                commonFun.setTrack('6066', this.$store.state.trackCommon.info, paraObj, this.$store.state.trackCommon.backendApi);
                this.$router.push({
                    path: '/paper/cutoutIndex',
                    query: {
                        mapId: scope.row.id,
                        cityName: scope.row.city_name
                    }
                });
            },
            /**
             * @description: 删除地图
             * @param {object} scope 列表单行信息
             */
            deleteMap(scope) {
                this.$confirm('确认要删除该地图？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        let params = {
                            map_id: scope.row.id
                        };
                        let { data } = await cutoutList.deleteMap(params);
                        if (data.code === 0) {
                            this.initList(this.pages.page);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            /**
             * @description: 分页改变
             * @param {number} page 当前分页数
             */
            changePage(page) {
                this.initList(page);
            },
            /**
             * @description: 初始化列表
             * @param {number} page 当前页码
             */
            async initList(page = 1) {
                try {
                    let params = {
                        page
                    };
                    let { data } = await cutoutList.mapList(params);
                    if (data.code === 0) {
                        this.mapList = data.data.data;
                        this.pages.total = data.data.total_count * 1;
                        this.pages.page = data.data.page * 1;
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            // 新建地图
            async addMap() {
                let params = {
                    city_id: this.adjustCity
                };
                try {
                    if (this.flag) {
                        this.flag = false;
                        let { data } = await cutoutList.addMap(params);
                        this.flag = true;
                        if (data.code === 0) {
                            this.addDialog = false;
                            this.$message({
                                message: '新建成功',
                                type: 'success'
                            });
                            // 埋点拓展字段
                            let paraObj = {
                                city: data.data.city_name,
                                map_id: data.data.map_id
                            };
                            // 埋点请求
                            commonFun.setTrack('6066', this.$store.state.trackCommon.info, paraObj, this.$store.state.trackCommon.backendApi);

                            this.$router.push({
                                path: '/paper/cutoutIndex',
                                query: {
                                    mapId: data.data.map_id,
                                    cityName: data.data.city_name
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            // 获取城市列表
            async getCity() {
                try {
                    let { data } = await cutoutList.getAdjustCitys();
                    if (data.code === 0) {
                        this.cityList = data.data.list;
                        this.adjustCity = data.data.select_data.value + '';
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.cutout-list {
    padding: 0 15px;
    .btn-area {
        text-align: left;
    }
    .btn-addMap {
        padding: 0;
        width: 130px;
        height: 44px;
        line-height: 44px;
        background: #00ce7f;
        border: 1px solid #00ce7f;
        box-sizing: border-box;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
    }
    .cutout-table {
        margin-bottom: 20px;
        .edit-data {
            display: inline-block;
            color: #33a1ff;
            cursor: pointer;
            margin-right: 40px;
        }
        .delete-data {
            color: #ff5c47;
            cursor: pointer;
            &:hover {
                color: #000;
            }
        }
        /deep/ .has-gutter {
            tr th div.cell {
                color: #3e4254;
                font-weight: bold;
            }
        }
        .page {
            padding: 20px;
            background: #fff;
            text-align: center;
            /deep/.el-pagination {
                display: inline-block;
            }
        }
    }
    /deep/ .add-dialog {
        .el-dialog__body {
            padding: 40px 0;
        }
        .el-dialog__header {
            padding: 0;
        }
        .dialog-center {
            width: 300px;
            margin: 0 auto;
            h2 {
                font-size: 22px;
                color: #3e4254;
                margin-bottom: 30px;
                text-align: center;
            }
            .el-select {
                display: block;
            }
            .btn-area {
                text-align: center;
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
                button {
                    width: 145px;
                    height: 50px;
                    line-height: 50px;
                    color: #fff;
                    background: #bbb;
                    font-size: 20px;
                    text-align: center;
                    border-radius: 2px;
                    border: none;
                    cursor: pointer;
                }
                .confirm {
                    background: #2e9ae1;
                }
            }
        }
    }
}
</style>