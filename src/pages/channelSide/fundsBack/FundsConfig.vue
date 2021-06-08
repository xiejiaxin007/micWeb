<!--
 * @Name: 回款流程配置管理页
 * @Description: 回款流程配置管理页
 * @Author: kangxue
 * @Date: 2020-04-23
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>回款流程配置管理页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="order-search">
                <!--查询搜索-->
                <ul class="s-query clearfix">
                    <li>
                        <div class="th">回款流程ID：</div>
                        <div class="td">
                            <el-input v-model="fundsId"
                                placeholder="请输入">
                            </el-input>
                        </div>
                    </li>
                    <li class="long-li">
                        <div class="th">回款流程：</div>
                        <div class="td">
                            <el-input v-model="fundsName"
                                placeholder="请输入">
                            </el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">创建人：</div>
                        <div class="td">
                            <search-select-radio v-model="userId"
                                placeholder="请选择"
                                :apiInfo="userApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">是否关联合同：</div>
                        <div class="td">
                            <el-select v-model="isContract">
                                <el-option v-for="opt in options"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">是否关联成交单：</div>
                        <div class="td">
                            <el-select v-model="isDeal">
                                <el-option v-for="opt in options"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">关联楼盘：</div>
                        <div class="td">
                            <search-select-radio v-model="houseId"
                                placeholder="请选择"
                                :apiInfo="houseApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">标准流程：</div>
                        <div class="td">
                            <el-select v-model="isStandard">
                                <el-option v-for="opt in options"
                                    :key="opt.value"
                                    :label="opt.name"
                                    :value="opt.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area">
                <el-button @click="resetSearch">重置</el-button>
                <el-button type="primary"
                    @click="searchData(1)">搜索</el-button>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="12">
                                <p class="total-num">当前条件下共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area">
                                    <a :href="contractUrl"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <el-button type="primary">直达合同列表页</el-button>
                                    </a>
                                    <el-button type="primary"
                                        @click="addFundsBack">新增回款流程</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-box">
                        <el-table border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="{'background': '#f8f8f8'}">
                            <el-table-column min-width="60"
                                prop="id"
                                label="回款流程ID"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="process_name"
                                label="回款流程"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="is_relation_contract"
                                label="是否关联合同"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="is_relation_deal"
                                label="是否关联成交单"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="creator"
                                label="创建人"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="60"
                                prop="is_default"
                                label="标准流程"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="create_datetime"
                                label="创建时间"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="80"
                                prop="updator"
                                label="更新人"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                prop="update_datetime"
                                label="更新时间"
                                align="center">
                            </el-table-column>
                            <el-table-column min-width="100"
                                label="操作"
                                align="center">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.oprera.view_auth"
                                        type="text"
                                        size="small"
                                        @click="showDetail(scope.row.id)">查看</el-button>
                                    <el-button v-if="scope.row.oprera.update_auth"
                                        type="text"
                                        size="small"
                                        @click="editFundsBack(scope.row.id)">修改</el-button>
                                    <el-button v-if="scope.row.oprera.delete_auth"
                                        type="text"
                                        class="del-btn"
                                        size="small"
                                        @click="delFundsBack(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination v-if="totalNum-pageSize>0"
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :total="totalNum">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="提示"
            :visible.sync="dialogVisible"
            width="400px">
            <span>确定删除回款流程ID：{{currentId}}</span>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api/followApi';
    import commonApi from '@/api/commonApi';
    import { SearchSelectRadio } from '@/components';
    export default {
        components: {
            SearchSelectRadio
        },
        data() {
            return {
                // 回款流程ID
                fundsId: '',
                // 回款流程名称
                fundsName: '',
                // 创建人
                userId: '',
                // 是否关联合同
                isContract: '',
                // 是否关联成交单
                isDeal: '',
                // 关联楼盘ID
                houseId: '',
                // 是否是标准流程
                isStandard: '',
                // 楼盘下拉api
                houseApi: {
                    api: commonApi.getHouseList,
                    params: {
                        q: ''
                    }
                },
                // 创建人下拉
                userApi: {
                    api: commonApi.getStaff,
                    params: {
                        q: ''
                    }
                },
                // 是否的下拉值
                options: [
                    { value: '1', name: '是' },
                    { value: '2', name: '否' }
                ],
                // 当前页面
                currentPage: 1,
                // 数据总数
                totalNum: 0,
                // 表格数据
                tableList: [],
                // 表格loading
                loading: false,
                // 每页显示数据
                pageSize: 20,
                // 防止重复提交
                flag: true,
                // 合同列表页链接
                contractUrl: '',
                // 要删除的回款流程id
                currentId: '',
                // 删除弹层展示
                dialogVisible: false
            };
        },
        mounted() {
            // 获取初始数据
            this.searchData(1);
        },
        methods: {
            /**
             * 点击搜索
             * @param {string} page 页码
             */
            async searchData(page) {
                // 防止重复提交
                if (!this.flag) return;
                if (page) {
                    this.currentPage = page;
                }
                this.flag = false;
                try {
                    this.loading = true;
                    let params = {
                        page: this.currentPage,
                        id: this.fundsId,
                        process_name: this.fundsName,
                        creator: this.userId,
                        is_relation_contract: this.isContract,
                        is_relation_deal: this.isDeal,
                        relation_project: this.houseId,
                        is_default: this.isStandard
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.getFundsBackList(params);
                    if (code === 0) {
                        this.tableList = data.list;
                        this.totalNum = data.total ? parseInt(data.total) : 0;
                        this.contractUrl = data.contract_url;
                        this.loading = false;
                        this.flag = true;
                    } else {
                        this.flag = true;
                        this.$message(msg);
                        this.loading = false;
                    }
                } catch (err) {
                    this.flag = true;
                    console.log(err);
                }
            },
            // 点击重置
            resetSearch() {
                this.fundsId = '';
                this.fundsName = '';
                this.userId = '';
                this.isContract = '';
                this.isDeal = '';
                this.houseId = '';
                this.isStandard = '';
                this.searchData(1);
            },
            // 新增回款流程配置
            addFundsBack() {
                this.$router.push({
                    path: '/fundsBack/fundsConfigEdit'
                });
            },
            /**
             * 编辑回款流程配置
             * @param {string} id 回款流程ID
             */
            editFundsBack(id) {
                this.$router.push({
                    path: '/fundsBack/fundsConfigEdit',
                    query: {
                        id: id
                    }
                });
            },
            /**
             * 查看回款流程配置详情
             * @param {string} id 回款流程ID
             */
            showDetail(id) {
                this.$router.push({
                    path: '/fundsBack/fundsConfigInfo',
                    query: {
                        id: id
                    }
                });
            },
            /**
             * 删除款流程配置
             * @param {string} id 回款流程ID
             */
            delFundsBack(id) {
                this.currentId = id;
                this.dialogVisible = true;
            },
            // 确定删除回款流程
            async confirmDel() {
                try {
                    let params = {
                        id: this.currentId
                    };
                    const {
                        data: { code, msg }
                    } = await api.delFundsBack(params);
                    if (code === 0) {
                        this.dialogVisible = false;
                        this.$message({
                            message: msg,
                            type: 'success'
                        });
                        this.searchData(1);
                    } else {
                        this.$message(msg);
                        this.dialogVisible = false;
                    }
                } catch (err) {
                    console.log(err);
                    this.dialogVisible = false;
                }
            },
            // 表格翻页
            pageChange() {
                this.searchData();
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

<style lang="less" scoped>
.container-box {
    padding: 0 30px;
    .s-query {
        li {
            width: 25%;
            &.long-li {
                width: 50%;
            }
        }
    }
    .order-search {
        padding-top: 20px;
    }
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
        }
        .operation-area {
            text-align: right;
        }
    }
    .del-btn {
        color: #f00;
    }
    .pagination{
        text-align: center;
        margin-top: 10px;
    }
}
</style>
