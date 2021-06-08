<!--
    @name: 虚拟号详情页
    @description: 虚拟号绑定明细详情页
    @author: 贺伟
    @date: 2020-06-17
-->

<template>
    <div class="subscribe-list">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>虚拟号管理</el-breadcrumb-item>
            <el-breadcrumb-item>虚拟号绑定明细</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单搜索部分-->
        <el-form
            :model="dealForm"
            ref="dealForm"
            class="deal-form"
            label-width="140px"
            :inline="true">
            <el-form-item
                prop="city"
                label="虚拟号归属城市：">
                <el-select
                    clearable
                    v-model="dealForm.city"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.cityOptions"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="virtualNumType"
                label="虚拟号类型：">
                <el-select
                    clearable
                    v-model="dealForm.virtualNumType"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.virtualNumTypeOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="virtualNum"
                label="虚拟号号码:">
                <el-input
                    v-model="dealForm.virtualNum"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="user"
                label="使用业务方：">
                <el-select
                    clearable
                    v-model="dealForm.user"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.userOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="aBindNum"
                label="A侧绑定号码:">
                <el-input
                    v-model="dealForm.aBindNum"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="bBindNum"
                label="B侧绑定号码:">
                <el-input
                    v-model="dealForm.bBindNum"
                    placeholder="精确搜索">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="bindStatus"
                label="绑定状态：">
                <el-select
                    clearable
                    v-model="dealForm.bindStatus"
                    placeholder="请选择">
                    <el-option
                        v-for="item in selectObj.bindStatusOps"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="form-item-center">
                <el-button
                    @click="resetForm">
                    重置
                </el-button>
                <el-button
                    type="primary"
                    @click="getDataByOptions()">
                    搜索
                </el-button>
            </el-form-item>
        </el-form>
        <!--表格部分开始-->
        <div class="table-list-wrap">
            <div class="table-top-box">
            </div>
            <el-table
                class="subscribe-table"
                :data="tableData"
                v-loading="loading"
                stripe
                border
                >
                <el-table-column
                    prop="city_name"
                    label="虚拟号归属城市">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="虚拟号类型">
                </el-table-column>
                <el-table-column
                    prop="user_type"

                    label="使用业务方">
                </el-table-column>
                <el-table-column
                    prop="phone"

                    label="虚拟号号码">
                </el-table-column>
                <el-table-column
                    prop="a_phone"

                    label="A侧绑定号码">
                </el-table-column>
                <el-table-column
                    prop="b_phone"

                    label="B侧绑定号码">
                </el-table-column>
                <el-table-column
                    prop="status_text"

                    label="绑定状态">
                </el-table-column>
                <el-table-column
                    prop="bind_datetime"

                    label="绑定时间">
                </el-table-column>
                <el-table-column
                    prop="unbind_datetime"

                    label="解绑时间">
                </el-table-column>
                <el-table-column
                    prop="operateOptions"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status == 1"
                            type="text"
                            size="medium"
                            @click="confirmUnbind(scope.row.id)">
                            解绑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                class="page-wrap"
                :current-page.sync="pages.currentPage"
                :page-size="pages.pageSize"
                hide-on-single-page
                background
                layout="prev, pager, next, jumper"
                :total="pages.total"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import reqApi from './api/virtualBindDetail';
import commonApi from './api/commonApi';

export default {
    name: 'SubscribeList',
    data() {
        return {
            // 表单对象
            dealForm: {
                // 绑定ID
                bindId: '',
                // 城市
                city: '',
                // 虚拟号类型
                virtualNumType: '',
                // 虚拟号
                virtualNum: '',
                // 使用业务方
                user: '',
                // A侧绑定号码
                aBindNum: '',
                // B侧绑定号码
                bBindNum: '',
                // 绑定状态
                bindStatus: ''
            },
            // 下拉对象
            selectObj: {
                // 虚拟号归属城市数据
                cityOptions: [],
                // 虚拟号类型下拉数据
                virtualNumTypeOps: [],
                // 使用方下拉
                userOps: [],
                // 居理员工
                bindStatusOps: []
            },
            // table加载loading
            loading: false,
            // 表格数据
            tableData: [],
            // 分页数据
            pages: {
                // 每页条数
                pageSize: 20,
                // 当前页
                currentPage: 1,
                // 总条数
                total: 0
            },
            // 是否在请求中，防止重复触发
            isDoing: false
        }
    },
    created() {
        //  初始化下拉数据
        this.initSelectOps();
        // 初始化全国经营城市
        this.getCityOps();
    },
    mounted() {
        this.dealForm.virtualNum = this.$route.query.phone || '';
        // 获取初始化数据
        this.getDataByOptions();
    },
    methods: {
        // 初始化下拉数据
        async initSelectOps() {
            try {
                const configArr = [1, 2, 3, 4];
                const {
                    data: {
                        code,
                        data,
                        msg
                    }
                } = await commonApi.getConfigListData({type: configArr});
                if (code === 0) {
                    // 客户标记
                    this.selectObj.virtualNumTypeOps = data.virtual_type;
                    // 是否是居理员工
                    this.selectObj.userOps = data.user_type;
                    // 认购来源
                    this.selectObj.bindStatusOps = data.bind_status;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取城市下拉
        async getCityOps() {
            try {
                const {
                    data: {
                        code,
                        data,
                        msg
                    }
                } = await commonApi.getCityListData();
                if (code === 0) {
                    // 虚拟号归属城市数据
                    this.selectObj.cityOptions = data;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 根据搜索条件搜索
        async getDataByOptions() {
            this.loading = true;
            const opsData = this.dealForm;
            // 组装筛选的数据
            const options = {
                page: this.pages.currentPage,
                page_size: this.pages.pageSize,
                city_id: opsData.city,
                // 虚拟号类型
                type: opsData.virtualNumType,
                // 业务方类型b
                user_type: opsData.user,
                // 虚拟号
                phone: opsData.virtualNum,
                // A侧号码
                a_phone: opsData.aBindNum,
                b_phone: opsData.bBindNum,
                status: opsData.bindStatus
            };
            try {
                const {
                    data: {
                        code,
                        data,
                        msg
                    }
                } = await reqApi.getBindDetailData(options);
                this.loading = false;
                if (code === 0) {
                    this.tableData = data.list;
                    this.pages.total = Number(data.total_count);
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        // 解绑确认
        confirmUnbind(id) {
            this.$confirm('是否确认解绑?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.unbindDetail(id);
            }).catch((err) => {
                console.log(err)
            });
        },
        /**
         * 解绑数据
         * @param {String} id 绑定id
         */
        async unbindDetail(id) {
            try {
                const {
                    data: {
                        code,
                        msg
                    }
                } = await reqApi.unbindVirtualDetail({id});
                this.$message.error(msg);
                if (code === 0) {
                    // 解绑成功 更新表格数据
                    this.getDataByOptions();
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 页码改变加载数据
        handleCurrentChange(page) {
            this.pages.currentPage = page;
            this.getDataByOptions();
        },
        // 重置搜索数据
        resetForm() {
            // 重置表单
            this.$refs.dealForm.resetFields();
            debugger
            // 重新搜索
            this.getDataByOptions();
        }
    }
}
</script>
<style lang="less" scoped>
    .subscribe-list {
        padding: 20px 30px 0;
    }
    .deal-form {
        margin-top: 20px;
        padding: 15px 20px;
        background-color: #fff;
        .form-item-center {
            width: 100%;
            margin-bottom: 0;
            text-align: center;
        }
        /deep/.el-form-item {
            .el-input {
                width: 140px;
            }
            .el-range-input {
                background-color: #fff;
            }
        }
    }
    .table-list-wrap {
        background-color: #fff;
        margin-top: 15px;
        padding: 15px;
    }
    .table-top-box {
        overflow: hidden;
        padding-bottom: 10px;
        .add-btn {
            float: right;
        }
    }
    .page-wrap {
        margin: 25px 0 10px;
    }
</style>
