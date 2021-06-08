<!--
 * @Name: 回款流程查看页
 * @Description: 回款流程查看页
 * @Author: kangxue
 * @Date: 2020-04-23
-->
<template>
    <div class="container-box">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/fundsBack/fundsConfig' }">回款流程配置管理页</el-breadcrumb-item>
            <el-breadcrumb-item>回款流程查看页</el-breadcrumb-item>
        </el-breadcrumb>
        <div
            class="view-box"
            v-loading="loading"
        >
            <div class="sub-title">回款流程查看页</div>
            <div>回款流程ID：{{info.id}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回款流程：{{info.process_name}}</div>
            <div class="red">提示：成交单「1-核对业绩」的开始时间=min（单笔预测回款达到回款子条件的时间，网签时间加上30天）</div>
            <el-table
                border
                :data="info.list"
                size="small"
                row-class-name="row"
                cell-class-name="column"
                :highlight-current-row="true"
                :header-cell-style="{'background': '#f8f8f8'}"
            >
                <el-table-column
                    min-width="60"
                    prop="stage_type"
                    label="序号"
                    align="left"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    prop="stage_name"
                    label="阶段"
                    align="left"
                ></el-table-column>
                <el-table-column
                    prop="stage_action"
                    min-width="150"
                    label="阶段动作"
                    align="left"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    prop="is_open_text"
                    align="left"
                >
                    <template slot="header">
                        <span class="red">*</span>是否有此阶段
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="60"
                    align="left"
                >
                    <template slot="header">
                        <span class="red">*</span>阶段跟进结束周期
                    </template>
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_open === '1' && scope.row.date_type === '1'">{{scope.row.fixed_date_type_text}}，{{scope.row.fixed_date_text}}</div>
                        <div v-if="scope.row.is_open === '1' && scope.row.date_type === '2'">{{scope.row.fixed_date_text}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="100"
                    label="此阶段核心对接人"
                    align="left"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_open === '1'">{{scope.row.contacter.name}}</div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="sub-title">当前匹配以下合同</div>
            <el-table
                border
                :data="info.contract_list"
                size="small"
                row-class-name="row"
                cell-class-name="column"
                :highlight-current-row="true"
                :header-cell-style="{'background': '#f8f8f8'}"
            >
                <el-table-column
                    min-width="60"
                    prop="city_name"
                    label="地理城市"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    prop="project_name"
                    label="楼盘"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="100"
                    prop="contract_name"
                    label="合同名称"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    label="签约单ID"
                    align="center"
                >
                    <template slot-scope="scope">
                        <a
                            v-if="scope.row.ex_sign_id.value !== '0'"
                            class="a-link"
                            :href="scope.row.ex_sign_id.url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{scope.row.ex_sign_id.value}}
                        </a>
                        <span v-else>{{scope.row.ex_sign_id.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="60"
                    prop="partner_name"
                    label="合作方"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    prop="cooperate_type"
                    label="合作方式"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    prop="contract_id"
                    label="合同ID"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="60"
                    label="合同分类ID"
                    align="center"
                >
                    <template slot-scope="scope">
                        <a
                            v-if="scope.row.contract_cat_id.value !== '0'"
                            class="a-link"
                            :href="scope.row.contract_cat_id.url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{scope.row.contract_cat_id.value}}
                        </a>
                        <span v-else>{{scope.row.ex_sign_id.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="70"
                    prop="contract_begin_datetime"
                    label="合同开始时间"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="70"
                    prop="contract_end_datetime"
                    label="合同结束时间"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="70"
                    prop="contract_condition"
                    label="合同分类条件"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="70"
                    prop="back_money_people"
                    label="回款负责人"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="50"
                    prop="is_relation_deal"
                    label="合同分类是否关联成交单"
                    align="center"
                ></el-table-column>
                <el-table-column
                    min-width="100"
                    prop="partners_info"
                    label="合作方主体"
                    align="center"
                ></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import api from './api/followApi';
    export default {
        data() {
            return {
                // 回款流程信息
                info: {},
                // 回款流程ID
                id: '',
                // 数据加载
                loading: false
            };
        },
        methods: {
            // 初始化数据
            async initData() {
                try {
                    this.loading = true;
                    let params = {
                        id: this.id
                    };
                    const {
                        data: { code, msg, data }
                    } = await api.getFundsBackInfo(params);
                    if (code === 0) {
                        this.info = data;
                    } else {
                        this.$message(msg);
                    }
                    this.loading = false;
                } catch (err) {
                    console.log(err);
                }
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            this.initData();
        }
    };
</script>

<style scoped lang="less">
.container-box {
    padding: 0 30px;
}
.view-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 0 20px 20px;
    .sub-title {
        font-weight: bold;
        font-size: 16px;
        padding: 20px 0 10px 0;
    }
    .red {
        color: #f00;
        padding: 10px 0;
    }
    .a-link {
        color: #409eff;
        font-weight: normal;
        text-decoration: underline;
    }
}
</style>
