<!--
 * @Author: xiebin
 * @Date: 2020-06-17 10:24:29
 * @LastEditTime: 2020-06-24 16:15:14
 * @LastEditors: xie bin
 * @Description: 虚拟号库存
 * @FilePath: /webapp_backend/src/pages/newPlatForm/virtualNumber/VirtualNumStock.vue
--> 
<template>
    <div class="virtual-box">
        <!---面包屑--->
        <el-breadcrumb class="bread-crumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>虚拟号管理</el-breadcrumb-item>
            <el-breadcrumb-item>虚拟号库存</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-box">
        <!-- 筛选项 -->
            <div class="fiflter-box">
                <el-form
                    :inline="true"
                    :model="formInline"
                    ref="formInline"
                    class="demo-form-inline">
                    <el-form-item
                        label="虚拟号归属城市:"
                        prop="getCityVal">
                        <el-select
                            v-model="formInline.getCityVal"
                            filterable
                            placeholder="请选择城市">
                            <el-option
                                v-for="(item, index) in getCityData"
                                :key="index"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="虚拟号类型:"
                        prop="virtualType">
                        <el-select
                            v-model="formInline.virtualType"
                            placeholder="请选择类型">
                            <el-option
                                v-for="(item, index) in virtualNumTypeData"
                                :key="index"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="虚拟号号码:"
                        prop="virtualNumber">
                        <el-input
                            v-model="formInline.virtualNumber"
                            placeholder="请输入虚拟号">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="占用状态:"
                        prop="isUseStatus">
                        <el-select
                            v-model="formInline.isUseStatus"
                            placeholder="请选择占用状态">
                            <el-option
                                v-for="(item, index) in isUseData"
                                :key="index"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="serach-box">
                    <el-button
                        type="primary"
                        @click="getvirtualListInfo">
                        搜索
                    </el-button>
                    <el-button
                        type="default"
                        @click="resetForm('formInline')">
                        重置
                    </el-button>
                </div>
            </div>
            <!-- 表格 -->
            <div class="table-box">
                <el-button
                    class="btn-add"
                    type="primary"
                    @click="addVirtualNum">
                    + 添加虚拟号
                </el-button>
                <el-table
                    :data="virtualTableData.list"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="city_name"
                        label="虚拟号归属城市">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="虚拟号类型">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="虚拟号号码">
                    </el-table-column>
                    <el-table-column
                        prop="is_use_text"
                        label="占用状态">
                    </el-table-column>
                    <el-table-column
                        prop="use_num"
                        label="绑定情况">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                v-show="scope.row.is_use == '1'"
                                type="text"
                                @click="viewBindDetail(scope.row.phone)">
                                查看绑定明细
                            </el-button>
                            <el-button
                                v-show="scope.row.is_use == '2'"
                                type="text"
                                @click="deleteVirtualNumInfo(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="virtualTableData.totalNum"
                    :page-size="20"
                    :current-page.sync="currenPage"
                    @current-change="currentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import commonApi from './api/commonApi';
import virtualNumApi from './api/virtualNumStock';
export default {
    data() {
        return {
            formInline: {
                // 占用状态
                isUseStatus: '',
                // 虚拟号类型
                virtualType: '',
                // 虚拟号号码
                virtualNumber: '',
                // 城市下拉val
                getCityVal: '',
            },
            // 城市下拉数据
            getCityData: [],
            // 虚拟号类型数据
            virtualNumTypeData: [],
            // 占用状态数据
            isUseData: [],
            // 表格数据
            virtualTableData:{
                list: [],
                totalNum: 1,
            },
            // 当前页
            currenPage: 1
        }
    },
    mounted() {
        // 获取全部虚拟城市
        this.getAllCityList();
        // 获取通用下拉配置
        this.getGeneralSelConfig();
        // 虚拟号列表初始化
        this.getvirtualListInfo();
    },
    methods: {
        /**
         * @description: 当分页改变的时候
         * @param {number} page 当前页
         * @return: 
         */
        currentChange(page) {
            this.currenPage = page;
            this.getvirtualListInfo();
        },
        // 获取虚拟号列表
        async getvirtualListInfo () {
            try {
                let params = {
                    city_id: this.formInline.getCityVal,
                    type: this.formInline.virtualType,
                    phone: this.formInline.virtualNumber,
                    is_use: this.formInline.isUseStatus,
                    page: this.currenPage
                }
                let { data } = await virtualNumApi.getvirtualListData(params);
                console.log(data)
                if (data.code === 0) {
                    this.virtualTableData.list = data.data.list;
                    this.virtualTableData.totalNum = Number(data.data.total_count);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 删除虚拟号
        async deleteVirtualNumInfo (virtualId) {
            try {
                let params = {
                    id: virtualId,
                }
                let { data } = await virtualNumApi.deleteVirtualNumData(params);
                console.log(data)
                if (data.code === 0) {
                    this.getvirtualListInfo();
                    this.$message('删除成功');
                }
                else {
                    this.$message(data.msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取全部虚拟城市
        async getAllCityList() {
            try {
                let params = {
                    type: '2'
                }
                let { data } = await virtualNumApi.getCityListData(params);
                console.log(data);
                if (data.code === 0) {
                    this.getCityData = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取通用下拉配置
        async getGeneralSelConfig() {
            try {
                let params = {
                    type: [1,2,3]
                }
                let { data } = await commonApi.getConfigListData(params);
                console.log(data);
                if (data.code === 0) {
                    this.virtualNumTypeData = data.data.virtual_type;
                    this.isUseData = data.data.use_type;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 添加虚拟号
        addVirtualNum() {
            this.$router.push({
                path: '/virtualNum/virtualAddNum'
            })
        },
        // 查看绑定明细
        viewBindDetail(phone) {
            this.$router.push({
                path: '/virtualNum/virtualBindDetail',
                query: {
                    phone
                }
            })
        },
        /**
         * @description: 重置
         * @param {string} formName ref 
         * @return: 
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
            // 重置搜索接口
            this.currenPage = 1;
            this.getvirtualListInfo();
        }
    }
}
</script>

<style lang="less" scoped>
.virtual-box {
    padding: 20px 50px;
    box-sizing: border-box;
    .content-box {
        background: #fff;
        padding: 20px 20px;
        margin-top: 30px;
        .fiflter-box {
            margin-bottom: 30px;
            .serach-box {
                text-align: center;
                margin-top: 30px;
            }
            /deep/ .el-form-item {
                margin-right: 50px;
            }
        }
        .table-box {
            .btn-add {
                margin-bottom: 20px;
            }
            /deep/ .el-pagination {
                text-align: center;
                margin-top: 20px;
            }
        }
    }
}
</style>