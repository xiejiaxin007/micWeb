<!--
 * @Name: 回款跟进tab组件
 * @Description: 跟进列表tab展示
 * @Author: xiejiaxin
 * @Date: 2020-04-22
 -->
<template>
    <div class="follow-list-wrapper">
        <div class="form-wrapper">
            <div class="order-search">
                <!--查询需求-->
                <ul class="s-query">
                    <li>
                        <div class="th">回款组ID：</div>
                        <div class="td">
                            <el-input
                                v-model="fundsId"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">地理城市：</div>
                        <div class="td">
                            <el-select
                                v-model="cityId"
                                filterable
                                placeholder="请选择">
                                <el-option
                                    v-for="item in cityList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款类型：</div>
                        <div class="td">
                            <el-select
                                v-model="fundsType"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in fundsTypeList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">合作方式：</div>
                        <div class="td">
                            <el-select
                                v-model="operateType"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in operateTypeList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">合作方：</div>
                        <div class="td">
                            <search-select-radio
                                v-model="operateId"
                                placeholder="请选择"
                                :apiInfo="operateIdApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">楼盘名称：</div>
                        <div class="td">
                            <search-select-radio
                                v-model="houseId"
                                placeholder="请选择"
                                :apiInfo="houseApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">成交ID：</div>
                        <div class="td">
                            <el-input
                                v-model="dealId"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">客户姓名：</div>
                        <div class="td">
                            <el-input
                                v-model="customerName"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款负责人：</div>
                        <div class="td">
                            <search-select-radio
                                v-model="principalID"
                                placeholder="请选择"
                                :apiInfo="principalApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">预计回款日期：</div>
                        <div class="td">
                            <el-date-picker
                                v-model="predictTime"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">最新跟进人：</div>
                        <div class="td">
                            <search-select-radio
                                v-model="newFollowStaff"
                                placeholder="请选择"
                                :apiInfo="principalApi"></search-select-radio>
                        </div>
                    </li>
                    <li>
                        <div class="th">当前主管：</div>
                        <div class="td">
                            <el-select
                                v-model="manaStaff"
                                filterable
                                placeholder="请选择">
                                <el-option
                                    v-for="item in manaStaffList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款流程ID：</div>
                        <div class="td">
                            <el-input
                                v-model="processId"
                                placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">展示范围：</div>
                        <div class="td">
                            <el-select
                                v-model="showRangeId"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in showRangeList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">审核状态：</div>
                        <div class="td">
                            <el-select
                                v-model="checkId"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in checkList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="auto">
                        <div class="th">当前阶段：</div>
                        <div class="td">
                            <el-checkbox-group v-model="currentProcess">
                                <el-checkbox
                                    v-for="item in processList"
                                    :key="item.id"
                                    :label="item.id">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area">
                <el-button @click="resetSearch">重置</el-button>
                <el-button
                    type="primary"
                    @click="doSearch(1)">搜索</el-button>
            </div>
        </div>
        <div class="v-box form-table-box">
            <div class="table-operate-box">
                <div class="opreate-box">
                    <div
                        @click="clickTip"
                        class="opreate-tip">哪些回款组可以合并后一起跟进？</div>
                    <el-button
                        @click="markConfirm"
                        type="primary">合并</el-button>
                </div>
                <div
                    v-show="totalNum > 0"
                    class="discribe-box">
                    <div class="page-statistics">第{{currentStart}}-{{currentEnd}}条，共{{totalNum}}条数据</div>
                    <div class="money-statistics">今日至本周末预计回款{{todayToWeek}}元，今日至本月底预计回款{{todayToMonth}}元，本月预计回款{{monthMoney}}元，本月实际回款{{monthActualMoney}}元</div>
                </div>
            </div>
            <div class="bd">
                <div class="search-result">
                    <div class="table-wrap-new">
                        <el-table
                            ref="followTable"
                            v-loading="tbLoading"
                            border
                            :data="tableList"
                            @selection-change="selectChange"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor">
                            <el-table-column
                                fixed="left"
                                type="selection"
                                align="center"
                                width="70">
                            </el-table-column>
                            <el-table-column
                                fixed="left"
                                prop="id"
                                label="回款组ID"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="city_name"
                                label="地理城市"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="plan_pay_datetime"
                                label="预计回款日期"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="follow_datetime"
                                label="最新跟进时间"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="cw_supplier_name"
                                label="合作方主体"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.cw_supplier_name">
                                        <div slot="reference">{{scope.row.cw_supplier_name}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="跟进总金额"
                                prop="follow_money"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="project_name"
                                label="楼盘名称"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.project_name">
                                        <div slot="reference">{{scope.row.project_name}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="客户姓名"
                                prop="username"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.username">
                                        <div slot="reference">{{scope.row.username}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="deal_num"
                                label="成交单数"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                label="回款负责人"
                                prop="payback_employee"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.payback_employee">
                                        <div slot="reference">{{scope.row.payback_employee}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="follow_employee_id"
                                label="最新跟进人"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="leader_name"
                                class-name="more-info-td"
                                width="110px"
                                label="当前主管"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                label="回款流程ID"
                                prop="ex_money_back_config_id"
                                align="center">
                                <template slot-scope="scope">
                                    <div
                                        @click="turnToPage(scope.row, 'configDetail')"
                                        class="turn-to-page">{{scope.row.ex_money_back_config_id}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="当前阶段"
                                prop="stage_type_name"
                                align="center">
                                <template slot-scope="scope">
                                    <div :class="changeColor(scope.row.stage_type_id)">{{scope.row.stage_type_name}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="pay_datetime"
                                label="实际付款日期"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                label="回款类型"
                                prop="commission_type"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="cooperate_type"
                                label="合作方式"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.cooperate_type">
                                        <div slot="reference">{{scope.row.cooperate_type}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="cooperate"
                                label="合作方"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.cooperate">
                                        <div slot="reference">{{scope.row.cooperate}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="deal_id"
                                label="成交ID"
                                class-name="more-info-td"
                                width="110px"
                                align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.deal_id">
                                        <div slot="reference">{{scope.row.deal_id}}</div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="110px"
                                fixed="right"
                                align="center">
                                <template slot-scope="scope">
                                    <div
                                        v-if="scope.row.is_audit"
                                        @click="turnToPage(scope.row, 'opreate')"
                                        class="turn-to-page stage-orange">审核</div>
                                    <div
                                        v-if="scope.row.is_follow"
                                        @click="turnToPage(scope.row, 'opreate')"
                                        class="turn-to-page">跟进</div>
                                    <div
                                        @click="turnToPage(scope.row, 'detail')"
                                        class="turn-to-page">查看</div>
                                    <div
                                        v-if="scope.row.is_cancel"
                                        @click="turnToPage(scope.row, 'del')"
                                        class="turn-to-page">删除</div>
                                    <div
                                        v-if="scope.row.is_recovery"
                                        @click="turnToPage(scope.row, 'resume')"
                                        class="turn-to-page stage-green">恢复</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :hide-on-single-page="totalNum <= 0"
                                :total="totalNum">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 描述弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="infoShow"
            class="info-dialog"
            width="520px"
            center>
            <div class="dialog-tip">
                <p class="tip-tit">当回款组同时满足以下4点，即可勾选合并</p>
                <p class="tip-info first-info">1. 合作方主体一致</p>
                <p class="tip-info">2. 回款流程一致（回款流程ID相同）</p>
                <p class="tip-info">3. 当前阶段一致，且不等于8-付款完成</p>
                <p class="tip-info">4. 回款类型不等于前置电商</p>
                <div class="top-seperate">
                    <p>回款组合并后，相关数据将同步至最近一次跟进的回款组中</p>
                    <p>预计回款时间，取已合并的回款组中最小的预计回款时间</p>
                </div>
                <p class="top-seperate">赶快去使用合并后的快捷跟进吧~</p>
            </div>
        </el-dialog>
        <!-- 合并弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="combineShow"
            class="info-dialog"
            width="520px"
            center>
            <div class="dialog-tip">
                <div class="combine-tip">已选中{{dealList ? dealList.length : 0}}个回款组，合并至回款组ID：{{dealList ? (dealList.length > 0 ? dealList[0].id : 0) : 0}}中统一跟进</div>
            </div>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="combineShow = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="comfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除弹窗 -->
        <el-dialog
            :visible.sync="delShow"
            class="common-dialog"
            :show-close="false"
            :close-on-click-modal="false"
            width="520px"
            center>
            <div class="dialog-box">
                <ul class="s-query">
                    <li class="auto">
                        <div class="th">回款组ID：</div>
                        <div class="td">{{groupId}}</div>
                    </li>
                    <li class="auto vertical">
                        <el-form
                            label-width="86px"
                            label-position="top"
                            :model="delRuleForm"
                            :rules="delRules"
                            ref="delRuleForm">
                            <el-form-item
                                label="删除原因："
                                prop="input">
                                <el-input
                                    maxlength="200"
                                    v-model="delRuleForm.input"
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入内容">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </li>
                </ul>
            </div>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="closeDel('del')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmDel('del')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 恢复弹窗 -->
        <el-dialog
            :visible.sync="resumeShow"
            class="common-dialog"
            :show-close="false"
            :close-on-click-modal="false"
            width="520px"
            center>
            <div class="dialog-box">
                <ul class="s-query">
                    <li class="auto">
                        <div class="th">回款组ID：</div>
                        <div class="td">{{groupId}}</div>
                    </li>
                    <li class="auto vertical">
                        <el-form
                            label-width="86px"
                            label-position="top"
                            :model="resumeRuleForm"
                            :rules="resumeRules"
                            ref="resumeRuleForm">
                            <el-form-item
                                label="恢复原因："
                                prop="input">
                                <el-input
                                    maxlength="200"
                                    v-model="resumeRuleForm.input"
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入内容">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </li>
                </ul>
            </div>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="closeDel('resume')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmDel('resume')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '../api/followApi.js';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
const dialogRule = {
    input: [
        { required: true, message: '原因必填', trigger: 'blur' },
        { max: 200, message: '不能超过200字', trigger: 'blur' }
    ]
};
export default {
    name: 'follow-list',
    data() {
        return {
            // 表格选中的回款组ID
            groupId: '',
            // 删除表单
            delRuleForm: {
                // 删除原因
                input: ''
            },
            // 删除校验
            delRules: dialogRule,
            // 恢复表单
            resumeRuleForm: {
                // 删除原因
                input: ''
            },
            // 恢复校验
            resumeRules: dialogRule,
            // 恢复弹窗标识
            delShow: false,
            // 恢复弹窗标识
            resumeShow: false,
            // 审核状态选中
            checkId: '',
            // 审核状态下拉
            checkList: [],
            // 展示范围选中
            showRangeId: 2,
            // 展示范围
            showRangeList: [],
            // 回款组ID
            fundsId: this.$route.query.id ? this.$route.query.id : '',
            // 地理城市ID
            cityId: '',
            // 地理城市下拉
            cityList: [],
            // 回款类型
            fundsType: '',
            // 回款类型下拉
            fundsTypeList: [],
            // 合作方式
            operateType: '',
            // 合作方式下拉
            operateTypeList: [],
            // 合作方
            operateId: '',
            // 合作方下拉api
            operateIdApi: {
                api: commonApi.getCooperate,
                params: {
                    q: ''
                }
            },
            // 楼盘ID
            houseId: '',
            // 楼盘下拉api
            houseApi: {
                api: commonApi.getHouseList,
                params: {
                    q: ''
                }
            },
            // 成交单ID
            dealId: '',
            // 客户姓名
            customerName: '',
            // 回款负责人
            principalID: '',
            // 回款负责人下拉
            principalApi: {
                api: commonApi.getStaff,
                params: {
                    q: ''
                }
            },
            // 预计回款时间
            predictTime: '',
            // 最新跟进人
            newFollowStaff: '',
            // 当前主管
            manaStaff: '',
            // 当前主管下拉
            manaStaffList: [],
            // 回款流程ID
            processId: '',
            // 表格数据
            tableList: [],
            // 当前阶段
            currentProcess: [1, 2, 3, 4, 5, 6, 7],
            // 阶段下拉
            processList: [],
            // 表格总数
            totalNum: 0,
            // 页码
            currentPage: 1,
            // 每页显示数据
            pageSize: 20,
            // 当前在第几页
            page: 1,
            // 描述弹窗开关
            infoShow: false,
            // 表格loading
            tbLoading: false,
            // 今日到本周的金额
            todayToWeek: 0,
            // 今日到本月的金额
            todayToMonth: 0,
            // 本月预计回款金额
            monthMoney: 0,
            // 本月实际回款金额
            monthActualMoney: 0,
            // 合并弹窗展示
            combineShow: false,
            // 选中的回款组
            dealList: [],
            // 是否正在提交标志
            isSumbit: false
        }
    },
    created() {
        // 获取初始化下拉
        this.initFormData();
        // 获取城市下拉
        this.getCity();
        // 获取主管下拉
        this.getManager();
        // 获取表格数据
        this.doSearch(this.page);
    },
    computed: {
        // 计算表格当前页的开始
        currentStart() {
            return (this.page - 1) * this.pageSize + 1;
        },
        // 计算表格当前页的结束
        currentEnd() {
            return Math.min(this.totalNum, this.page * this.pageSize);
        }
    },
    components: {
        SearchSelectRadio
    },
    methods: {
        /**
         * @description: 弹窗的取消按钮
         * @param {String} type 弹窗类型 del--删除弹窗  resume--恢复弹窗
         */
        closeDel(type) {
            this[`${type}Show`] = false;
            this.$refs[`${type}RuleForm`].resetFields();
        },
        /**
         * @description: 确认弹窗
         * @param {String} type 弹窗类型 del--删除弹窗  resume--恢复弹窗
         */
        confirmDel(type) {
            this.$refs[`${type}RuleForm`].validate((valid) => {
                if (valid) {
                    this.comfirmPop(type);
                } else {
                    console.log(type + '-error submit!!');
                    return false;
                }
            });
        },
        /**
         * @description: 删除或者恢复操作确认
         * @param {String} type 弹窗类型 del--删除弹窗  resume--恢复弹窗
         */
        async comfirmPop(type) {
            if (!this.isSumbit) {
                this.isSumbit = true;
                try {
                    let params = {};
                    let result = {};
                    // 区分是删除还是恢复
                    if (type === 'del') {
                        params.group_id = this.groupId;
                        params.cancel_reason = this.delRuleForm.input;
                        result = await api.delGroup(params);
                    } else {
                        params.group_id = this.groupId;
                        params.recovery_reason = this.resumeRuleForm.input;
                        result = await api.resumeGroup(params);
                    }
                    const {
                        data: { code, msg }
                    } = result;
                    if (code === 0) {
                        this.closeDel(type);
                        this.doSearch(this.page);
                    } else {
                        this.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                    this.isSumbit = false;
                } catch (error) {
                    this.isSumbit = false;
                    console.log(error);
                }
            }
        },
        /**
         * @description: 跟进ID切换颜色
         * @param {String} val 阶段ID
         */
        changeColor(val) {
            // 默认是橙色
            let rel;
            switch (val) {
                case '1': rel = 'stage-black';
                    break;
                case '2':
                case '3':
                case '4':
                    rel = 'stage-red';
                    break;
                case '5':
                case '6':
                case '7':
                    rel = 'stage-orange';
                    break;
                case '8': rel = 'stage-green';
                    break;
                default: rel = 'stage-orange';
            }
            return rel;
        },
        /**
         * @description: 点击表格跳转
         * @param {Object} val 点击行对象
         * @param {String} type 跳转类型 opreate--操作行跳转（前端页面），detail--查看跟进记录页面，configDetail--回款流程配置查看页面，del--删除弹窗，resume--打开恢复弹窗
         */
        turnToPage(val, type) {
            let routeData = {};
            // 赋值回款组ID用于弹窗
            this.groupId = val.id;
            switch (type) {
                case 'configDetail':
                    // 查看流程配置页面
                    {
                        routeData = this.$router.resolve({
                            path: '/fundsBack/fundsConfigInfo',
                            query: {
                                id: val.ex_money_back_config_id
                            }
                        });
                        let newOpen = window.open(routeData.href, "_blank");
                        newOpen.opener = null;
                    }
                    break;
                case 'opreate':
                    {
                        routeData = this.doOperate(val);
                        let newOpen = window.open(routeData.href, "_blank");
                        newOpen.opener = null;
                    }
                    break;
                case 'detail':
                    // 查看跟进记录页面
                    {
                        routeData = this.$router.resolve({
                            path: '/fundsBack/fundsBackFollow',
                            query: {
                                id: val.id
                            }
                        });
                        let newOpen = window.open(routeData.href, "_blank");
                        newOpen.opener = null;
                    }
                    break;
                case 'del': this.delShow = true;
                    break;
                case 'resume': this.resumeShow = true;
                    break;
            }
        },
        /**
         * @description: 处理type为operate的点击
         * @param {Object} val 点击行对象
         * @return {Object} 路由对象
         */
        doOperate(val) {
            let routeData = {};
            if (!val.follow_id) {
                // 跟进页面
                routeData = this.$router.resolve({
                    path: '/fundsBack/editFollowUp',
                    query: {
                        groupId: val.id,
                        commissionType: val.commission_type_id
                    }
                });
            } else {
                // 审核页面
                routeData = this.$router.resolve({
                    path: '/fundsBack/approval',
                    query: {
                        groupId: val.id,
                        followId: val.follow_id
                    }
                });
            }
            return routeData;
        },
        /**
         * @description: 切换表格选中
         * @param {Array} val 选中的行
         */
        selectChange(val) {
            this.dealList = val;
            this.dealList.sort((i1, i2) => {
                return (parseInt(i2.id) - parseInt(i1.id));
            });
        },
        // 确定合并
        async comfirm() {
            if (!this.isSumbit) {
                this.isSumbit = true;
                try {
                    // 组合合同预测ID数组
                    let ids = [];
                    this.dealList.map((item) => {
                        ids.push(item.id);
                    });
                    let params = {
                        group_id: ids.join(',')
                    };
                    let result = await api.mergeFollow(params);
                    let {code, msg} = result.data;
                    if (code === 0) {
                        this.$refs.followTable.clearSelection();
                        this.combineShow = false;
                        // 跟新列表
                        this.doSearch(this.page);
                    } else {
                        this.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                    this.isSumbit = false;
                } catch (error) {
                    this.isSumbit = false;
                    console.log(error);
                }
            }
        },
        // 合并
        markConfirm() {
            if (this.dealList.length > 0) {
                this.combineShow = true;
            } else {
                this.$message({
                    message: '请选择回款组',
                    type: 'warning'
                });
            }
        },
        // 点击描述，弹出弹窗
        clickTip() {
            this.infoShow = true;
        },
        // 重置
        resetSearch() {
            this.fundsId = '';
            this.cityId = '';
            this.dealId = '';
            this.houseId = '';
            this.customerName = '';
            this.currentProcess = [1, 2, 3, 4, 5, 6, 7];
            this.operateType = '';
            this.fundsType = '';
            this.principalID = '';
            this.processId = '';
            this.page = 1;
            this.operateId = '';
            this.predictTime = '';
            this.newFollowStaff = '';
            this.manaStaff = '';
            this.showRangeId = 2;
            this.checkId = '';
            // 重新搜索
            this.doSearch(this.page);
        },
        /**
         * @description: 获取表格数据
         * @param {string} page 页码
         */
        async doSearch(page) {
            if (!this.tbLoading) {
                this.tbLoading = true;
                try {
                    let params = {
                        id: this.fundsId,
                        city_id: this.cityId,
                        commission_type: this.fundsType,
                        cooperate_type: this.operateType,
                        partner_id: this.operateId,
                        project_id: this.houseId,
                        deal_id: this.dealId,
                        user_name: this.customerName,
                        payback_employee_id: this.principalID,
                        plan_pay_datetime: this.predictTime,
                        follow_employee_id: this.newFollowStaff,
                        ex_money_back_config_id: this.processId,
                        leader_id: this.manaStaff,
                        stage_type: this.currentProcess,
                        cancel_status: this.showRangeId,
                        audit_status: this.checkId,
                        page: page,
                        limit: this.pageSize
                    };
                    let result = await api.followTb(params);
                    let {data, code} = result.data;
                    if (code === 0) {
                        this.tableList = data ? data.list : [];
                        this.totalNum = data ? parseInt(data.total) : 0;
                        this.todayToWeek = data ? data.today_week_money : 0;
                        this.todayToMonth = data ? data.today_month_money : 0;
                        this.monthMoney = data ? data.month_money : 0;
                        this.monthActualMoney = data ? data.month_pay_money : 0;
                        // 把公共title传递给父组件
                        let titleInfo = data ? data.show_text : {};
                        this.$emit('getTitInfo', titleInfo);
                    }
                    this.tbLoading = false;
                } catch (error) {
                    this.tbLoading = false;
                    console.log(error);
                }
            }
        },
        // 获取城市下拉
        async getCity() {
            try {
                let params = {
                    type: 2,
                    param: 'withAll'
                };
                let result = await commonApi.getDetailCityListData(params);
                let {data, code} = result.data;
                if (code === 0) {
                    this.cityList = data ? data.list : [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取主管下拉
        async getManager() {
            try {
                let params = {
                    q: '',
                    role: 'project_charger,channel_charger,bd_manager'
                };
                let result = await commonApi.managerStaff(params);
                let {data, code} = result.data;
                if (code === 0) {
                    this.manaStaffList = Array.isArray(data) ? data : [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取初始化下拉
        async initFormData() {
            try {
                let result = await api.stayFollowInit();
                let {data, code} = result.data;
                if (code === 0) {
                    // 配置阶段下拉
                    this.processList = data ? data.stage_type : [];
                    // 合作方式
                    this.operateTypeList = data ? data.cooperate_type : [];
                    // 回款类型
                    this.fundsTypeList = data ? data.commission_type : [];
                    // 展示范围
                    this.showRangeList = data ? data.cancel_status : [];
                    // 审核状态
                    this.checkList = data ? data.audit_status : [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 修改table header的背景色
         * @param {Object} row 行数据
         * @param {Object} column 列数据
         * @param {Number} rowIndex 行号
         * @param {Number} columnIndex 列号
         */
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        },
        /**
         * 表格翻页
         * @param {Number} page 当前点击的第几页
         */
        pageChange(page) {
            this.page = page;
            // 分页请求
            this.doSearch(page);
        }
    }
};
</script>
<style scoped>
    .order-search{
        overflow: hidden;
    }
    .order-search >>> .el-date-editor, .order-search >>> .el-select{
        width: 100%;
        height: 40px;
        box-sizing: border-box;
    }
    .order-search >>> .el-select >>> .el-input{
        height: 40px;
    }
    .order-search >>> .el-range-input{
        background-color: #fff;
        font-size: 12px;
        line-height: 32px;
    }
    .order-search >>> .el-date-editor .el-range-separator{
        font-size: 12px;
    }
    .order-search >>> .el-range-editor.el-input__inner {
        padding: 3px 6px;
    }
    .order-search >>> .el-date-editor .el-range__close-icon {
        font-size: 12px;
        width: 22px;
    }
    .order-search .fixHeight{
        height: 40px;
    }
    .order-search >>> .el-date-editor .date-tip-logo{
        display: none;
    }
    .form-table-box .filter-link-more{
        float: right;
        padding: 9px 20px;
        margin-top: 6px;
    }
    .order-search > .s-query > li .td{
        height: 40px;
    }
    .s-query > li.long-column{
        width: 360px;
    }
    .s-query > li.margin-next{
        margin-left: 20px;
    }
    .pagination >>> .el-pagination.is-background .el-pager li {
        background-color: #fff;
    }
    .pagination >>> .el-pagination.is-background .btn-next, .pagination >>> .el-pagination.is-background .btn-prev {
        background-color: #fff;
    }
    .pagination >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #409eff;
        color: #fff;
    }
    .table-wrap-new >>> .el-table__header .el-table-column--selection .cell .el-checkbox {
        font-size: 12px;
    }
    .table-wrap-new >>> .el-table__header .el-table-column--selection .cell .el-checkbox:after {
        color: rgb(51, 51, 51);
        content: "全选";
        font-size: 12px;
        margin-left: 6px;
        font-weight: 500;
    }
</style>
<style lang="less" scoped>
.pagination {
    text-align: center;
    margin: 25px 0 10px;
}
.common-dialog {
    .dialog-box {
        .s-query {
            overflow: hidden;
            & > li {
                margin-bottom: 0;
                &.vertical {
                    .th {
                        float: none;
                    }
                }
                .th {
                    width: 86px;
                    text-align: left;
                }
            }
        }
    }
}
.follow-list-wrapper {
    margin-top: 20px;
    .s-query {
        & > li {
            width: 334px;
            &.auto {
                width: 100%;
            }
        }
        /deep/ .el-checkbox {
            font-weight: 400;
        }
    }
    .v-box {
        background-color: #eef3f6;
        margin-bottom: 0;
        padding: 0 0 10px;
    }
    .table-operate-box {
        padding-top: 20px;
        font-size: 14px;
        overflow: hidden;
        .opreate-box {
            float: right;
            .opreate-tip {
                float: left;
                line-height: 32px;
                margin-right: 20px;
                color: #ff0000;
                text-decoration: underline;
                cursor: pointer;
            }
            /deep/.el-button {
                padding: 8px 20px;
            }
        }
        .discribe-box {
            overflow: hidden;
            padding-right: 20px;
            line-height: 32px;
            .page-statistics {
                float: left;
                margin-right: 20px;
                font-weight: 500;
            }
            .money-statistics {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
            }
        }
    }
}
.table-wrap-new {
    /deep/.el-table {
        th {
            &.more-info-td {
                width: 110px;
                .cell {
                    width: 110px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
        td {
            &.more-info-td {
                width: 110px;
                .cell {
                    width: 110px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    /*修改element-ui默认样式，这个样式原本作用于td，但是被继承过来了*/
                    visibility: visible;
                }
            }
        }
    }
    .turn-to-page {
        display: inline-block;
        margin-right: 4px;
        color: #46aaff;
        cursor: pointer;
        &:last-of-type {
            margin-right: 0;
        }
    }
    .stage-black {
        color: #000;
    }
    .stage-orange {
        color: rgb(255, 102, 0);
    }
    .stage-red {
        color: rgb(255, 0, 0);
    }
    .stage-green {
        color: rgb(51, 153, 102);
    }
}
</style>
