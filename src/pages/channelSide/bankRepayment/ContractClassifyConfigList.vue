<!--
    @name: 合同分类配置列表页
    @description: 合同分类条件配置列表
    @author: 贺伟
    @date: 2019-11-06
-->
<template>
    <div class="contract-config-list">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>合同分类条件配置列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单搜索部分-->
        <el-form
            :model="contractForm"
            ref="contractForm"
            class="list-form"
            :inline="true">
            <el-form-item
                prop="name"
                label="合同分类条件名称:">
                <el-input
                    v-model="contractForm.name"
                    placeholder="请输入">
                </el-input>
            </el-form-item>
            <el-form-item
                prop="cityId"
                label="适用城市：">
                <el-select
                    v-model="contractForm.cityId"
                    filterable
                    clearable
                    remote
                    :remote-method="getApplyCity"
                    placeholder="请选择城市">
                    <el-option
                        v-for="item in cityData"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="isRelavite"
                label="是否关联合同：">
                <el-select
                    clearable
                    v-model="contractForm.isRelavite"
                    placeholder="请选择">
                    <el-option
                        v-for="item in relations"
                        :key="item.key"
                        :label="item.text"
                        :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="form-item-center">
                <el-button
                    @click="resetForm('contractForm')">
                    重置
                </el-button>
                <el-button
                    type="primary"
                    @click="getContrastListInfo">
                    搜索
                </el-button>
            </el-form-item>
        </el-form>
        <!--表格部分开始-->
        <div class="table-list-wrap">
            <div class="table-top-box">
                <div class="page-size-box">
                    共
                    <span class="focus">{{pages.total}}</span>
                    条，
                    <template>
                        第 {{getStartCount}} - {{getEndCount}} 条数据
                    </template>
                </div>
                <el-button
                    type="primary"
                    size="medium"
                    @click="editConfigList('')">
                    新增
                </el-button>
            </div>
            <el-table
                class="constract-table"
                :data="tableData"
                v-loading="loading"
                stripe
                border
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="条件ID">
                </el-table-column>
                <el-table-column
                    prop="category_name"
                    label="合同分类条件名称">
                </el-table-column>
                <el-table-column
                    prop="conditionOptionsArr"
                    label="选项值">
                    <template slot-scope="scope">
                        <div
                            v-for="(item, idx) in scope.row.conditionOptionsArr"
                            :key="idx">
                            {{item}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="suitCityArr"
                    label="适用城市"
                    width="200">
                    <template slot-scope="scope">
                        {{scope.row.suitCityArr.join(',')}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="is_relation_contract"
                    label="是否关联合同">
                </el-table-column>
                <el-table-column
                    prop="updator_datetime"
                    label="操作记录">
                    <template slot-scope="scope">
                        <div
                            v-for="(item, idx) in scope.row.updator_datetime"
                            :key="idx">
                            {{item}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operateOptions"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="medium"
                            @click="editConfigList(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button
                            type="text"
                            size="medium"
                            @click="delectListConfirm(scope.row.id)">
                            删除
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
    import reqApi from '@/api/bankRepaymentApi/constractConfig';
    export default {
        name: 'ContractCOnfigList',
        data() {
            return {
                // 表单字段对象
                contractForm: {
                    // 合同分类名称
                    name: '',
                    // 适用城市
                    cityId: '',
                    // 是否关联合同
                    isRelavite: ''
                },
                // 搜索loadidng
                loading: false,
                // 合同分类条件select2下来数据
                contractList: [],
                // 使用城市下拉数据
                cityData: [],
                // 是否关联合同下拉
                relations: [],
                // 渲染表格的数据
                tableData: [],
                // 分页数据对象
                pages: {
                    // 总条数
                    total: 0,
                    // 每页条数
                    pageSize: 20,
                    // 当前页
                    currentPage: 1
                }
            }
        },
        created() {
            this.pageInit();
        },
        computed: {
            // 当前页开始条数
            getStartCount() {
                return this.pages.total > 0 ? (this.pages.currentPage - 1) * this.pages.pageSize + 1 : 0;
            },
            // 当前页结束条数
            getEndCount() {
                return this.pages.currentPage * this.pages.pageSize < this.pages.total ? this.pages.currentPage * this.pages.pageSize : this.pages.total;
            }
        },
        methods: {
            // 页面初始化方法
            pageInit() {
                // 获取城市
                this.getApplyCity('');
                // 获取是否关联合同
                this.getIsrelationContract();
                // 获取列表数据
                this.getContrastListInfo();
            },
            /**
             * 获取适用城市
             * @param {String} query 查询参数
             */
            async getApplyCity(query) {
                try {
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await reqApi.getCitys(query);
                    if (code === 0) {
                        this.cityData = data;
                    } else {
                        this.$message.error(msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 获取是否关联合同下拉数据
            async getIsrelationContract() {
                try {
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await reqApi.getIsrelationContractData();
                    if (code === 0) {
                        this.relations = data;
                    } else {
                        this.$message(msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 表单重置
             * @param {String} formName 表单ref绑定的名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getContrastListInfo();
            },
            // 根据搜索条件获取列表信息
            async getContrastListInfo() {
                try {
                    this.loading = true;
                    const formData = this.contractForm;
                    const options = {
                        category_name: formData.name,
                        city_id: formData.cityId,
                        is_relation_contract: formData.isRelavite,
                        pageIndex: this.pages.currentPage - 1
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await reqApi.getConstractList(options);
                    this.loading = false;
                    if (code === 0) {
                        const {list, pages} = data;
                        this.tableData = list;
                        this.pages.total = parseInt(pages.totalCount);
                    } else {
                        this.$message(msg);
                    }
                } catch (err) {
                    console.log(err);
                    this.loading = false;
                }
            },
            /**
             * 新增/编辑配置列表
             * @param {String} id 分类条件id
             */
            editConfigList(id) {
                this.$router.push({
                    path: '/payment/editConfig',
                    query: { id }
                });
            },
            /**
             * 删除数据弹窗提示确认
             * @param {String} id 分类条件id
             */
            delectListConfirm(id) {
                this.$confirm('一旦删除则数据无法恢复，请确认是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delectList(id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /**
             * 删除数据
             * @param {String} id 分类条件id
             */
            async delectList(id) {
                try {
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await reqApi.deleteConstractCategory(id);
                    this.$message(msg);
                    if (code === 0) {
                        this.getContrastListInfo();
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 页码切换获取数据
            handleCurrentChange() {
                this.getContrastListInfo();
            }
        }
    };
</script>

<style lang="less" scoped>
    @color-white: #fff;
    .contract-config-list {
        padding: 20px 30px 0;
        .list-form {
            margin-top: 20px;
            padding: 15px 20px;
            background-color: @color-white;
            .form-item-center {
                width: 100%;
                margin-bottom: 0;
                text-align: center;
            }
        }
        .table-list-wrap {
            background-color: @color-white;
            margin-top: 15px;
            padding: 15px;
        }
        .table-top-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .page-size-box {
            color: #409eff;
        }
        .constract-table {
            margin: 15px 0;
        }
        .page-wrap {
            margin: 25px 0 10px;
        }
    }
</style>