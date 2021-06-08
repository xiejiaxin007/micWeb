<!--
  * @file 银行回款信息页面
  * @author xiebin
  * @updateTime 2019.10.16 
 -->
<template>
    <div class="payment-information">
        <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>银行回款信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box">
            <div class="hd">
                <h2 class="line">搜索条件</h2>
            </div>
            <div class="bd">
                <ul class="s-query search">
                    <li>
                        <div class="th">银行名称：</div>
                        <div class="td">
                            <el-select v-model="seach_options.bank_type" placeholder="请选择">
                                <el-option
                                    v-for="item in bank_list"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">银行流水号：</div>
                        <div class="td">
                            <el-input
                                v-model.trim="seach_options.bank_flow_number"
                                placeholder="请输入内容"
                            ></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">付款公司：</div>
                        <div class="td">
                            <el-input
                                v-model.trim="seach_options.payment_company"
                                placeholder="请输入内容"
                            ></el-input>
                        </div>
                    </li>
                    <li class="w-auto">
                        <div class="th">到账时间：</div>
                        <div class="td">
                            <el-date-picker
                                v-model="arrival_time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </div>
                    </li>
                    <li class="w-auto">
                        <div class="th">核销时间：</div>
                        <div class="td">
                            <el-date-picker
                                v-model="verify_time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">公司名称：</div>
                        <div class="td">
                            <el-select
                                v-model.trim="seach_options.gathering_company_name"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="selectSeachCompanyName"
                                :loading="loading"
                                @change="getChangeVal($event, 'companyName')"
                            >
                                <el-option
                                    v-for="it in seach_options.gathering_company_options"
                                    :key="it.id"
                                    :label="it.text"
                                    :value="it.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">核销状态：</div>
                        <div class="td">
                            <el-select v-model="seach_options.verify_status" placeholder="请选择">
                                <el-option
                                    v-for="item in verify_list"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款类型：</div>
                        <div class="td">
                            <el-select v-model="seach_options.payback_type" placeholder="请选择">
                                <el-option
                                    v-for="item in payback_list"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">城市ID：</div>
                        <div class="td">
                            <el-select
								v-model="cityListId"
								placeholder="请选择">
                                <el-option
                                    v-for="item in cityListData"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">成交ID：</div>
                        <div class="td">
                            <jl-number-input
                                v-model.trim="seach_options.dealId"
                                reg="number"
                                placeholder="精确搜索"
                            ></jl-number-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">公司账户名称：</div>
                        <div class="td">
                            <el-select
                                v-model.trim="conpanyNumberVal"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入公司账号"
                                :remote-method="getCompanyNumber"
                                @change="getChangeVal($event,'companyNumber')">
                                <el-option
                                    v-for="item in conpanyNumberList"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.text"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">到账金额：</div>
                        <div class="td">
                            <jl-number-input
                                :value="arrvialMoney"
                                reg="twoNum"
                                @input.native="updateRateVal"
                                placeholder="请输入到账金额" />
                        </div>
                    </li>
                    <li class="w-auto">
                        <div class="th"></div>
                        <div class="td">
                            <el-checkbox v-model="see_self">只看自己的核销记录</el-checkbox>
                            <el-checkbox v-model="see_has_refund">只看有退款的</el-checkbox>
                            <el-checkbox v-model="cityIsBare">城市为空</el-checkbox>
                        </div>
                    </li>
                </ul>
                <div class="btn-area">
                    <button class="btn btn-reset" @click="reset">重置</button>
                    <button class="btn btn-search" @click="search(1)">搜索</button>
                </div>
            </div>
        </div>
        <div class="v-box">
            <div class="hd">
                <div class="add-information" v-if="is_show_add === 1">
                    <button class="btn" @click="addCashShow">新增</button>
                </div>
                <p
                    class="table-tit">
                    本月回款{{current_month_money}}元，本周回款{{current_week_money}}元，当日回款{{current_day_money}}元
                    <el-button type="text" @click="payBackDetail">回款统计详情</el-button>
                </p>
            </div>
            <div class="bd">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column
                        prop="bank_name"
                        label="银行名称"
                        width="180"
                        :resizable="false"
                        align="center"
                    ></el-table-column>
                    <!-- 后台更改 -->
                    <el-table-column
                        prop="city_id_name"
                        label="城市"
                        width="120"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="id"
                        label="流水id"
                        width="180"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="bank_flow_number"
                        label="银行流水号"
                        width="220"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="payment_company"
                        label="付款公司"
                        width="180"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="payment_account"
                        label="付款账户"
                        width="220"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="gathering_company_name"
                        label="公司名称"
                        width="220"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="gathering_company_account"
                        label="公司账户名称"
                        width="220"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="arrival_time"
                        label="到账时间"
                        width="200"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column label="到账金额" width="150" align="center" :resizable="false">
                        <template slot-scope="scope">{{scope.row.arrival_money | currency}}</template>
                    </el-table-column>
                    <el-table-column label="退款金额" width="150" align="center" :resizable="false">
                        <template slot-scope="scope">{{scope.row.refund_money | currency}}</template>
                    </el-table-column>
                    <el-table-column label="净收入" width="150" align="center" :resizable="false">
                        <template slot-scope="scope">{{scope.row.net_income | currency}}</template>
                    </el-table-column>
                    <el-table-column label="已核销金额" width="150" align="center" :resizable="false">
                        <template slot-scope="scope">{{scope.row.verified_money | currency}}</template>
                    </el-table-column>
                    <el-table-column label="待核销金额" width="150" align="center" :resizable="false">
                        <template slot-scope="scope">{{scope.row.unverified_money | currency}}</template>
                    </el-table-column>
                    <el-table-column label="差额入库" width="150" align="center" :resizable="false">
                        <template slot-scope="scope">{{scope.row.margin_money | currency}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="verify_status_str"
                        label="核销状态"
                        width="150"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="verify_time"
                        label="核销时间"
                        width="180"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        prop="payback_type_str"
                        label="回款类型"
                        width="150"
                        align="center"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column
                        min-width="250"
                        label="操作"
                        align="center"
                        fixed="right"
                        :resizable="false"
                    >
                        <template slot-scope="scope">
                            <span
                                @click="refund(scope)"
                                class="operation delet"
                                v-if="scope.row.refund_show_status === 1"
                            >退款</span>
                            <span
                                @click="writeOff(scope)"
                                class="operation"
                                v-if="scope.row.verify_show_status === 1"
                            >核销回款</span>
                            <span
                                @click="editCash(scope)"
                                class="operation"
                                v-if="scope.row.edit_cash_show_status === 1"
                            >修改现金流</span>
                            <span
                                @click="seeWriteOff(scope)"
                                class="operation"
                                v-if="scope.row.verify_show_status === 2"
                            >查看核销</span>
                            <span
                                @click="jumpBankFlow(scope)"
                                class="operation"
                                v-if="scope.row.edit_btn_show_status === 1"
                            >修改</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page" v-if="pages.pageTotal * 1 > 0">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="pages.pageTotal * 1"
                        :page-size="pages.defaultPageSize * 1"
                        :current-page="pages.indexPage * 1"
                        @current-change="pageChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="is_add_dialog"
            width="650px"
            class="add-bank"
            @close="closeAddBank"
        >
            <h2 slot="title" class="line">{{add_bank_dialog_title}}</h2>
            <ul class="s-query">
                <li>
                    <div class="th">银行名称：</div>
                    <div class="td">
                        <el-input v-model.trim="add_bank_options.bank_name" placeholder="请输入内容"></el-input>
                    </div>
                </li>
                <li>
                    <div class="th">银行流水号：</div>
                    <div class="td">
                        <el-input
                            v-model.trim="add_bank_options.bank_flow_number"
                            placeholder="请输入内容"
                        ></el-input>
                    </div>
                </li>
                <li>
                    <div class="th">付款账号：</div>
                    <div class="td">
                        <el-input
                            v-model.trim="add_bank_options.payment_account"
                            placeholder="请输入内容"
                        ></el-input>
                    </div>
                </li>
                <li>
                    <div class="th">付款公司：</div>
                    <div class="td">
                        <el-input
                            v-model.trim="add_bank_options.payment_company"
                            placeholder="请输入内容"
                        ></el-input>
                    </div>
                </li>
                <li>
                    <div class="th required">公司名称：</div>
                    <div class="td">
                        <el-select
                            v-model.trim="add_bank_options.gathering_company_name"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="selectCompanyName"
                            :loading="loading"
                            @change="changeCompanyName"
                            @focus="focusCompanyName"
                        >
                            <el-option
                                v-for="it in add_bank_options.gathering_company_name_options"
                                :key="it.id"
                                :label="it.text"
                                :value="it.id"
                            ></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <div class="th required">公司账户：</div>
                    <div class="td">
                        <el-select
                            v-model.trim="add_bank_options.gathering_company_account"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="selectCompanyAccount"
                            :loading="loading"
                            :disabled="add_bank_options.gathering_company_name === ''"
                            @focus="focusCompanyAccount"
                        >
                            <el-option
                                v-for="it in add_bank_options.gathering_company_account_options"
                                :key="it.id"
                                :label="it.text"
                                :value="it.id"
                            ></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <div class="th required">到账时间：</div>
                    <div class="td">
                        <el-date-picker
                            v-model="add_bank_options.arrival_time"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </div>
                </li>
                <li>
                    <div class="th required">到账金额（元）：</div>
                    <div class="td">
                        <el-input
                            v-model.trim="add_bank_options.arrival_money"
                            @input="inputMoney(add_bank_options.arrival_money)"
                            placeholder="请输入数字"
                        ></el-input>
                    </div>
                </li>
            </ul>
            <div class="btn-area" slot="footer">
                <button class="btn cancel" @click="is_add_dialog = false">取消</button>
                <el-button
                    class="btn confirm"
                    :disabled="is_add_btn_disabled"
                    @click="confirmAddCash"
                >确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            width="740px"
            class="add-cash"
            :visible.sync="is_addcash_dialog"
            @close="closeAddCash"
        >
            <h2 slot="title" class="line">{{dialogText}}</h2>
            <div class="dialog_body">
                <ul class="s-query">
                    <li>
                        <div class="th required">城市：</div>
                        <div class="td">
                            <el-select v-model="formCash.city" filterable placeholder="请选择">
                                <el-option
                                    v-for="item in cityOptions"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div v-if="roleFlag === 1">
                    <ul class="s-query" v-for="(item, index) in formCash.subject" :key="index">
                        <li class="w-280">
                            <div class="th required">{{index + 1}}、二级科目编码：</div>
                            <div class="td">
                                <el-select
                                    v-model.trim="item.code"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="selectCode"
                                    :loading="loading"
                                    @focus="focusCode(index)"
                                >
                                    <el-option
                                        v-for="it in item.codeOptions"
                                        :key="it.id"
                                        :label="it.text"
                                        :value="it.id"
                                    ></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="w-240">
                            <div class="th required">金额（元）：</div>
                            <div class="td">
                                <el-input
                                    v-model="item.money"
                                    placeholder="请输入内容"
                                    @input="inputSubjectMoney(index,item.money)"
                                ></el-input>
                            </div>
                        </li>
                        <li class="w-auto">
                            <span
                                class="color-red"
                                v-if="formCash.subject.length > 1"
                                @click="deleteSubject(index)"
                            >删除</span>
                            <span
                                class="color-blue"
                                v-if="index === formCash.subject.length - 1 && formCash.subject.length !== 10"
                                @click="addSubject"
                            >添加一行</span>
                        </li>
                    </ul>
                </div>
                <div class="channel-role" v-if="roleFlag === 2">
                    <el-radio
                        v-model="formCash.radioVal"
                        label="10">
                        应收回款 (有成交单)
                    </el-radio>
                    <el-radio
                        v-model="formCash.radioVal"
                        label="20">
                        预收回款 (无成交单)
                    </el-radio>
                </div>
                
                <ul class="s-query">
                    <li class="w-100vw">
                        <div class="th">摘要：</div>
                        <div class="td">
                            <textarea
                                class="text-area"
                                maxlength="300"
                                v-model.trim="formCash.abstract"
                            ></textarea>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area wirite-off" slot="footer" v-if="!updateCashFlow">
                <div v-if="roleFlag === 2">
                    <el-button
                        class="btn next-write-off"
                        :disabled="is_addcash_btn_disabled"
                        @click="nextWriteOff"
                    >加入现金流，下次核销</el-button>
                    <el-button
                        class="btn go-write-off"
                        :disabled="is_addcash_btn_disabled"
                        @click="nextWriteOff('go')"
                    >加入现金流，去核销</el-button>
                    <button
                        class="btn cancel-write-off"
                        @click="is_addcash_dialog = false">
                        取消
                    </button>
                </div>
                <div v-if="roleFlag === 1">
                    <el-button
                        class="btn go-write-off"
                        :disabled="is_addcash_btn_disabled"
                        @click="nextWriteOff"
                    >加入现金流</el-button>
                    <button
                        class="btn cancel-write-off"
                        @click="is_addcash_dialog = false">
                        取消
                    </button>
                </div>
            </div>
            <div class="btn-area wirite-off" slot="footer" v-else>
                <el-button
                    class="btn go-write-off"
                    :disabled="is_addcash_btn_disabled"
                    @click="nextWriteOff"
                >确定</el-button>
                <button class="btn cancel-write-off" @click="is_addcash_dialog = false">取消</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import paymentInformationApi from '../../../api/bankRepaymentApi/paymentInformation';
export default {
    name: "payment-information",
    data() {
        return {
            tableData: [], // table数据
            current_month_money: "", // 本月回款
            current_week_money: "", // 本周回款
            current_day_money: "", // 当时回款
            is_show_add: 2, // 新增按钮 1展示 2不展示
            pages: {
                // 分页设置
                defaultPageSize: 0, // 每页条数
                indexPage: 1, // 当前页数
                pageTotal: 0 // 总条数
            },
            bank_list: [], // 银行名称列表
            verify_list: [], // 核销状态列表
            payback_list: [], // 回款类型列表
            verify_time: [], // 核销时间
            arrival_time: [], // 到账时间
            seach_options: {
                bank_type: "", // 银行类型
                bank_flow_number: "", // 银行流水号
                payment_company: "", // 付款公司
                arrival_time_begin: "", // 到账开始时间（年-月-日）
                arrival_time_end: "", // 	到账结束时间（年-月-日)
                verify_time_begin: "", // 核销开始时间（年-月-日）
                verify_time_end: "", // 核销结束时间（年-月-日）
                gathering_company_name: "", // 公司名称
                gathering_company_options: [], // 公司名称列表
                verify_status: "", // 核销状态
                payback_type: "", // 回款类型
                // 成交ID
                dealId: ''
            },
            see_self: false, // 是否只看自己的核销记录
            see_has_refund: false, // 是否只看有退款的
            is_add_dialog: false, // 是否展示新增弹窗
            is_add_btn_disabled: true, // 新增弹窗确定按钮是否可点击
            add_bank_options: {
                id: "",
                bank_name: "", // 银行名称
                bank_flow_number: "", // 银行流水号
                payment_account: "", // 付款账号
                payment_company: "", // 付款公司
                gathering_company_name: "", // 公司名称
                gathering_company_name_options: [], // 公司名称列表
                gathering_company_account: "", // 公司账号
                gathering_company_account_options: [], // 公司账号列表
                arrival_time: "", // 到账时间
                arrival_money: "" // 到账金额
            },
            add_bank_dialog_title: "", // 弹窗标题
            cityOptions: [], // 城市下拉列表
            loading: false,
            codeIndex: "", // 二级科目索引
            is_addcash_dialog: false, // 是否展示加入现金流弹窗
            is_addcash_btn_disabled: true, // 加入现金流弹窗按钮是否可点击
            formCash: {
                id: "",
                city: "", // 选择城市的id
                subject: [
                    {
                        codeOptions: [], // 对应二级科目列表
                        code: "", // 二级科目id
                        money: "", // 二级科目金额
                        id: "" // 现金流id
                    }
                ],
                // 现金流单选框val
                radioVal: '10',
                abstract: "" // 摘要
            },
            pay_url: "", // 付款审批页面url
            code_options: [], // 二级科目列表
            delete_cash: [], // 修改现金流需要删除的数据
            flag: true,
            addCashAccount: {
                options: [],
                id: ""
            },
            // url上获取到的id值
            urlId: '',
            // 修改核销回款时间
            updateTime: '',
            // 获取城市列表数据
            cityListData: [],
            cityListId: '',
            // 城市是否为空
            cityIsBare: false,
            // 公司账号val
            conpanyNumberVal: '',
            // 公司账号列表
            conpanyNumberList: [],
            // 到账金额val
            arrvialMoney: '',
            // 渠道/财务角色判断
            roleFlag: '',
            // 修改现金流时确定按钮是否展示
            updateCashFlow: false,
            // 弹窗文案变化修改
            dialogText: '添加到现金流'
        };
    },
    mounted () {
        // 获取城市列表
        this.getCityList();
        // 获取历史保存的搜索条件
        this.getHistorySearchParam();
    },
    methods: {
        /**
         * 银企直联v1.1迭代
         * @author xiebin
         * @updateTime 2019.10.16
         */
        // 获取城市列表
        async getCityList() {
            let params = {
                type: '2',
                param: 'noAll'
            }
            try {
                let result = await paymentInformationApi.getDetailCityListData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 城市列表赋值
                    this.cityListData = data.data;
                }
            }catch(error) {
                console.log(error);
            }
        },
        /**
         * 获取公司账号
         * @param {string} 输入的公司账号val
         */
        async getCompanyNumber(numberVal) {
            if (numberVal !== "") {
                let params = {
                    q: numberVal
                }
                try {
                    let result = await paymentInformationApi.getCompanyNumberData(params);
                    let { data } = result;
                    if (data.code === 0) {
                        // 公司账号列表赋值
                       this.conpanyNumberList = data.data;
                    }
                }catch(error) {
                    console.log(error);
                }
            }
        },
        /**
         * 获取公司名称/公司账号输入框改变之后的值
         * @params changeId 改变之后值的ID
         * @params companyName 区分是公司名称还是公司账号
         */
        getChangeVal(changeId,companyName) {
                if (companyName === 'companyName') {
                    this.changeVal = this.seach_options.gathering_company_options.find(value => value.id === changeId);
                } else if (companyName === 'companyNumber') {
                    this.changeNumberVal = this.conpanyNumberList.find(value => value.id === changeId);
                }
        },
        // 获取历史保存的搜索记录
        getHistorySearchParam() {
            let searchParam = localStorage.getItem('searchListData') ? JSON.parse(localStorage.getItem('searchListData')) : {};
            // 获取银行名称
            this.seach_options.bank_type = searchParam.bankType;
            // 获取银行流水号
            this.seach_options.bank_flow_number = searchParam.bankFlowNumber;
            // 获取付款公司
            this.seach_options.payment_company = searchParam.paymentCompany;
            // 成交ID
            this.seach_options.dealId = searchParam.dealId;
            // 到账时间
            this.arrival_time = searchParam.arrivalTime;
            // 核销时间
            this.verify_time = searchParam.verifyTime;
            // 获取公司名称
            if (searchParam.gatheringCompanyName) {
                this.seach_options.gathering_company_options.push(searchParam.gatheringCompanyName);
                this.changeVal = searchParam.gatheringCompanyName;
                this.seach_options.gathering_company_name = searchParam.gatheringCompanyName.id;
            }
            // 获取公司账号
            if (searchParam.campanyNum) {
                this.conpanyNumberList.push(searchParam.campanyNum);
                this.changeNumberVal = searchParam.campanyNum
                this.conpanyNumberVal = searchParam.campanyNum.text;
            }
            // 获取核销状态
            this.seach_options.verify_status = searchParam.verifyStatus;
            // 回款类型
            this.seach_options.payback_type = searchParam.paybackType;
            // 城市ID
            this.cityListId = searchParam.cityId;
            // 是否只看自己的核销记录
            this.see_self = searchParam.seeSelf;
            // 是否只看有退款的
            this.see_has_refund = searchParam.seeHasRefund;
            // 城市是否为空
            this.cityIsBare = searchParam.cityIsBare;
            // 获取到账金额
            this.arrvialMoney = searchParam.arrvialMoney;
            // 调取搜索方法
            this.search(1);
        },
        /**
         * 更新到账金额的val
         * @params [Object] e event事件 
         */
        updateRateVal(e) {
            this.arrvialMoney = e.target.value;
        },
        /**
         * 跳转到修改银行流水页面
         * @params [Object] scope 当前行的值
         */
        jumpBankFlow(scope) {
            this.$router.push({
                path: '/payment/updateBankFlow',
                query: {flowId: scope.row.id}
            });
        },
        // 回款统计详情页面跳转
        payBackDetail() {
            this.$router.push({ path: '/payment/payBackDetail' });
        },
        /**
         * END
         */
        // 加入现金流弹窗关闭
        closeAddCash() {
            this.codeIndex = "";
            this.formCash.city = "";
            this.formCash.abstract = "";
            this.formCash.subject = [
                {
                    codeOptions: [],
                    code: "",
                    money: "",
                    id: ""
                }
            ];
            this.is_addcash_btn_disabled = true;
        },
        // 加入现金流，下次核销
        nextWriteOff(type) {
            let postData = {
                id: this.formCash.id,
                city_id: this.formCash.city,
                abstract: this.formCash.abstract,
                update_datetime_validate: this.updateTime,
                // 财务/渠道角色判断值
                role_flag: this.roleFlag,
                receipt_type: this.formCash.radioVal
            };
            let arr = [];
            for (let i = 0; i < this.formCash.subject.length; i++) {
                let obj = {
                    id: this.formCash.subject[i].id,
                    class_id: this.formCash.subject[i].code,
                    actual_money: this.formCash.subject[i].money
                };
                arr.push(obj);
            }

            postData.cash_data = arr;
            let deleteArr = [];
            for (let i = 0; i < this.delete_cash.length; i++) {
                let obj = {
                    id: this.delete_cash[i].id,
                    class_id: this.delete_cash[i].code,
                    actual_money: this.delete_cash[i].money
                };
                deleteArr.push(obj);
            }
            postData.delete_cash = deleteArr;
            if (this.flag) {
                this.flag = false;
                this.axios
                    .post(
                        "/backend-api/expand/ex-bank-flow/edit-cash-flow",
                        postData
                    )
                    .then(res => {
                        this.flag = true;
                        if (res.status === 200 && res.data.code === 0) {
                            this.is_addcash_dialog = false;
                            if (type === "go") {
                                this.$router.push({
                                    path: "/payment/writeoffPayment",
                                    query: { flowId: this.formCash.id }
                                });
                            } else {
                                this.search(); // 刷新数据
                            }
                        } else {
                            alert(res.data.msg);
                        }
                    });
            }
        },
        focusCode(ind) {
            this.codeIndex = ind;
        },
        changeCompanyName() {
            this.add_bank_options.gathering_company_account = "";
            this.add_bank_options.gathering_company_account_options = [];
            this.add_bank_options.gathering_company_account_options = this.addCashAccount.options;
            this.add_bank_options.gathering_company_account_options = this.addCashAccount.id;
        },
        // 远程搜索公司名称
        selectCompanyName(q) {
            if (q !== "") {
                this.loading = true;
                let params = {
                    q: q
                };
                this.axios
                    .get("/backend-api/select2/bank/get-company-name", {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.status === 200) {
                            this.add_bank_options.gathering_company_name_options =
                                res.data.data;
                        }
                    });
            }
        },
        focusCompanyName() {
            this.axios
                .get("/backend-api/select2/bank/get-company-name")
                .then(res => {
                    if (res.status === 200) {
                        this.add_bank_options.gathering_company_name_options =
                            res.data.data;
                    }
                });
        },
        // 远程搜索公司名称
        selectSeachCompanyName(q) {
            if (q !== "") {
                this.loading = true;
                let params = {
                    q: q
                };
                this.axios
                    .get("/backend-api/select2/bank/get-company-name", {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.status === 200) {
                            this.seach_options.gathering_company_options =
                                res.data.data;
                        }
                    });
            }
        },
        // 远程搜索公司账号
        selectCompanyAccount(q) {
            if (q !== "") {
                this.loading = true;
                let params = {
                    q: q,
                    companyId: this.add_bank_options.gathering_company_name
                };
                this.axios
                    .get("/backend-api/select2/bank/get-account-number", {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.status === 200) {
                            this.add_bank_options.gathering_company_account_options =
                                res.data.data;
                        }
                    });
            }
        },
        // 焦点事件公司账号
        focusCompanyAccount() {
            let params = {
                q: "",
                companyId: this.add_bank_options.gathering_company_name
            };
            this.axios
                .get("/backend-api/select2/bank/get-account-number", { params })
                .then(res => {
                    if (res.status === 200) {
                        this.add_bank_options.gathering_company_account_options =
                            res.data.data;
                    }
                });
        },
        // 二级科目远程搜索
        selectCode(q) {
            if (q !== "") {
                this.loading = true;
                let params = {
                    q: q
                };
                this.axios
                    .get(
                        "/backend-api/select2/select2/get-second-level-sn-name",
                        { params }
                    )
                    .then(res => {
                        this.loading = false;
                        if (res.status === 200) {
                            this.formCash.subject[this.codeIndex].codeOptions =
                                res.data;
                        }
                    });
            }
        },
        // 二级科目编码金额
        inputSubjectMoney(ind, para) {
            this.formCash.subject[ind].money = this.regularAmount(para);
        },
        // 二级科目编码添加一行
        addSubject(ind) {
            let obj = {
                codeOptions: [],
                code: "",
                money: "",
                id: ""
            };
            if (this.formCash.subject.length < 10) {
                this.formCash.subject.push(obj);
            }
        },
        // 二级科目编码删除
        deleteSubject(ind) {
            let a = this.formCash.subject.splice(ind, 1);
            this.delete_cash.push(a[0]);
        },
        // 正则金额
        regularAmount(para) {
            let str = para.replace(/[^\d.]/g, "");
            str = str.replace(/\.{2,}/g, "");
            str = str
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".");
            return str.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
        },
        inputMoney(para) {
            this.add_bank_options.arrival_money = this.regularAmount(para);
        },
        // 新增弹窗确定事件
        confirmAddCash() {
            let postData = {
                id: this.add_bank_options.id,
                bank_name: this.add_bank_options.bank_name,
                bank_flow_number: this.add_bank_options.bank_flow_number,
                payment_account: this.add_bank_options.payment_account,
                payment_company: this.add_bank_options.payment_company,
                cw_company_config_id: this.add_bank_options
                    .gathering_company_name,
                cw_accounts_id: this.add_bank_options.gathering_company_account,
                arrival_time: this.add_bank_options.arrival_time
                    ? this.add_bank_options.arrival_time
                    : "",
                arrival_money: this.add_bank_options.arrival_money
            };
            if (this.flag) {
                this.flag = false;
                this.axios
                    .post("/backend-api/expand/ex-bank-flow/edit", postData)
                    .then(res => {
                        this.flag = true;
                        if (res.status === 200 && res.data.code === 0) {
                            this.is_add_dialog = false;
                            this.search(); // 刷新数据
                        } else {
                            alert(res.data.msg);
                        }
                    });
            }
        },
        // 新增弹窗关闭回调
        closeAddBank() {
            this.arrival_time = "";
            for (let k in this.add_bank_options) {
                this.add_bank_options[k] = "";
            }
        },
        // 新增回款
        addCashShow() {
            this.add_bank_dialog_title = "手动添加银行回款";
            this.axios
                .get("/backend-api/select2/bank/get-last-flow-data")
                .then(res => {
                    if (res.status === 200 && res.data.code === 0) {
                        // 公司账号
                        let resData = res.data.data;
                        let accountsObj = {
                            id: resData.cw_accounts_id,
                            text: resData.gathering_company_account
                        };
                        // 暂存公司账户数据
                        this.addCashAccount.options = [];
                        this.addCashAccount.options.push(accountsObj);
                        this.addCashAccount.id = resData.cw_accounts_id;
                        this.add_bank_options.gathering_company_account_options = [];
                        this.add_bank_options.gathering_company_account_options.push(
                            accountsObj
                        );
                        this.add_bank_options.gathering_company_account =
                            resData.cw_accounts_id;
                        // 公司名称
                        let companyName = {
                            id: resData.cw_company_config_id,
                            text: resData.gathering_company_name
                        };
                        this.add_bank_options.gathering_company_name_options = [];
                        this.add_bank_options.gathering_company_name_options.push(
                            companyName
                        );
                        this.add_bank_options.gathering_company_name =
                            resData.cw_company_config_id;

                        this.add_bank_options.id = "";
                        this.add_bank_options.bank_name = resData.bank_name;
                        this.add_bank_options.bank_flow_number =
                            resData.bank_flow_number;
                        this.add_bank_options.payment_account =
                            resData.payment_account;
                        this.add_bank_options.payment_company =
                            resData.payment_company;
                        this.add_bank_options.arrival_money =
                            resData.arrival_money;
                        this.add_bank_options.arrival_time =
                            resData.arrival_time;
                    }
                });
            this.is_add_dialog = true;
        },
        // 核销回款
        writeOff(sc) {
            if (sc.row.jump_verify_page * 1 === 1) {
                // 跳转页面
                this.$router.push({
                    path: "/payment/writeoffPayment",
                    query: { flowId: sc.row.id }
                });
                // window.open(routerUrl.href, "_blank");
            } else {
                this.updateCashFlow = false;
                this.formCash.id = sc.row.id;
                if (sc.row.city_id * 1 !== -2) {
                    this.formCash.city = sc.row.city_id;
                } else {
                    this.formCash.city = "";
                }
                // 添加弹窗修改
                let params = {
                    id: sc.row.id
                };
                this.axios
                    .get("/backend-api/expand/ex-bank-flow/edit-cash-flow", {
                        params
                    })
                    .then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            this.is_addcash_dialog = true;
                            this.dialogText = '添加到现金流'
                            this.formCash.subject = [];
                            let obj = {
                                codeOptions: '',
                                code: '',
                                money: sc.row.arrival_money,
                                id: ''
                            };
                            this.formCash.subject.push(obj);
                            let resData = res.data.data;
                            this.updateTime = resData.update_datetime_validate;
                            this.roleFlag = resData.role_flag;
                        } else {
                            alert(res.data.msg)
                        }
                    });
            }
        },
        // 修改
        editOrder(sc) {
            // 公司账号
            let accountsObj = {
                id: sc.row.cw_accounts_id,
                text: sc.row.gathering_company_account
            };
            // 暂存公司账户数据
            this.addCashAccount.options = [];
            this.addCashAccount.options.push(accountsObj);
            this.addCashAccount.id = sc.row.cw_accounts_id;
            this.add_bank_options.gathering_company_account_options = [];
            this.add_bank_options.gathering_company_account_options.push(
                accountsObj
            );
            this.add_bank_options.gathering_company_account =
                sc.row.cw_accounts_id;
            // 公司名称
            let companyName = {
                id: sc.row.cw_company_config_id,
                text: sc.row.gathering_company_name
            };
            this.add_bank_options.gathering_company_name_options = [];
            this.add_bank_options.gathering_company_name_options.push(
                companyName
            );
            this.add_bank_options.gathering_company_name =
                sc.row.cw_company_config_id;
            this.add_bank_options.id = sc.row.id;
            this.add_bank_options.bank_name = sc.row.bank_name;
            this.add_bank_options.bank_flow_number = sc.row.bank_flow_number;
            this.add_bank_options.payment_account = sc.row.payment_account;
            this.add_bank_options.payment_company = sc.row.payment_company;
            this.add_bank_options.arrival_money = sc.row.arrival_money;
            this.add_bank_options.arrival_time = sc.row.arrival_time;
            this.add_bank_dialog_title = "修改银行回款";
            this.is_add_dialog = true;
        },
        // 删除
        deleteOrder(sc) {
            let params = {
                id: sc.row.id
            };
            let str = `您是想把${sc.row.arrival_time} ${sc.row.payment_company}到账的${sc.row.arrival_money} 删除吗？`;
            this.$confirm(str, "删除订单", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(() => {
                    this.axios
                        .get("/backend-api/expand/ex-bank-flow/delete", {
                            params
                        })
                        .then(res => {
                            if (res.status === 200 && res.data.code === 0) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.search();
                            }
                        });
                })
                .catch(() => {});
        },
        // 修改现金流
        editCash(sc) {
            this.updateCashFlow = true;
            this.dialogText = '修改现金流'
            let params = {
                id: sc.row.id
            };
            this.axios
                .get("/backend-api/expand/ex-bank-flow/edit-cash-flow", {
                    params
                })
                .then(res => {
                    if (res.status === 200 && res.data.code === 0) {
                        let _data = res.data.data;
                        // 获取时间校验
                        this.updateTime = _data.update_datetime_validate;                    
                        // 获取角色判断值
                        this.roleFlag = _data.role_flag;
                        this.is_addcash_dialog = true;
                        this.formCash.id = _data.id;
                        this.formCash.city = _data.city_id;
                        this.formCash.abstract = _data.abstract;
                        this.formCash.subject = [];
                        this.formCash.radioVal = _data.receipt_type.toString();
                        for (let i = 0; i < _data.cash_data.length; i++) {
                            // let codeOptions = {

                            // }
                            let obj = {
                                codeOptions: this.code_options,
                                code: _data.cash_data[i].class_id,
                                money: _data.cash_data[i].actual_money,
                                id: _data.cash_data[i].id
                            };
                            this.formCash.subject.push(obj);
                        }
                    } else {
                            alert(res.data.msg)
                    }
                });
        },
        // 退款
        refund(sc) {
            window.open(this.pay_url, "_blank");
        },
        // 查看核销
        seeWriteOff(sc) {
            // 跳转页面
            let routerUrl = this.$router.resolve({
                path: "/payment/writeoffPayment",
                query: { flowId: sc.row.id }
            });
            window.open(routerUrl.href, "_blank");
        },
        /**
         * 搜索事件
         * @params page [Number] 页数
         */
        search(page) {
            // 保存当前的搜索条件
            let searchParams = {
                // 银行类型
                bankType: this.seach_options.bank_type,
                // 银行流水号
                bankFlowNumber: this.seach_options.bank_flow_number,
                // 付款公司
                paymentCompany: this.seach_options.payment_company,
                // 到账开始时间（年-月-日）
                arrivalTime: this.arrival_time || [],
                // 核销开始时间（年-月-日）
                verifyTime: this.verify_time || [],
                // 公司名称
                gatheringCompanyName: this.changeVal,
                // 核销状态
                verifyStatus: this.seach_options.verify_status,
                // 回款类型
                paybackType: this.seach_options.payback_type,
                // 城市ID
                cityId: this.cityListId,
                // 公司账号
                campanyNum: this.changeNumberVal,
                // 是否只看自己的核销记录
                seeSelf: this.see_self,
                // 是否只看有退款的
                seeHasRefund: this.see_has_refund,
                // 城市是否为空
                cityIsBare: this.cityIsBare,
                // 到账金额
                arrvialMoney: this.arrvialMoney,
                // 成交ID
                dealId: this.seach_options.dealId
            }
            localStorage.setItem('searchListData', JSON.stringify(searchParams));
            this.arrival_time = this.arrival_time || [];
            this.verify_time = this.verify_time || [];
            let seachOptions = {
                bank_type: this.seach_options.bank_type,
                bank_flow_number: this.seach_options.bank_flow_number,
                payment_company: this.seach_options.payment_company,
                arrival_time_begin: this.arrival_time[0]
                    ? this.arrival_time[0]
                    : "",
                arrival_time_end: this.arrival_time[1]
                    ? this.arrival_time[1]
                    : "",
                verify_time_begin: this.verify_time[0]
                    ? this.verify_time[0]
                    : "",
                verify_time_end: this.verify_time[1] ? this.verify_time[1] : "",
                cw_company_config_id: this.seach_options.gathering_company_name,
                verify_status: this.seach_options.verify_status,
                payback_type: this.seach_options.payback_type,
                see_self: this.see_self ? 1 : 2,
                see_has_refund: this.see_has_refund ? 1 : 2,
                page: page || this.pages.indexPage,
                // 城市ID
                city_id: this.cityListId,
                // 公司账号名称
                gathering_company_account: this.conpanyNumberVal,
                // 城市是否为空
                see_city_is_empty: this.cityIsBare ? 1 : 2,
                // 到账金额
                arrival_money: this.arrvialMoney,
                // 成交ID
                deal_id: this.seach_options.dealId
            };
            this.initData(seachOptions);
        },
        // 初始化条件
        reset() {
            this.verify_time = [];
            this.arrival_time = [];
            this.see_self = false;
            this.see_has_refund = false;
            this.pages.indexPage = 1;
            for (let k in this.seach_options) {
                this.seach_options[k] = "";
            }
            this.seach_options.gathering_company_options = [];
            // 清空新添加的输入框的值
            this.cityListId = "";
            // 城市是否为空
            this.cityIsBare = false;
            // 公司账号val
            this.conpanyNumberVal = '';
            // 到账金额val
            this.arrvialMoney = '';
            localStorage.removeItem('searchListData');
            this.initData();
        },
        // 页面改变事件
        pageChange(indexPage) {
            this.pages.indexPage = indexPage;
            this.search();
        },
        // 拉取表格数据
        initData(params) {
            let getData = params || {};
            getData.id = this.urlId ? this.urlId : "";
            this.axios
                .get("/backend-api/expand/ex-bank-flow/index", {
                    params: getData
                })
                .then(res => {
                    if (res.status === 200 && res.data.code === 0) {
                        let _data = res.data.data;
                        this.tableData = _data.list;
                        this.current_month_money = _data.current_month_money;
                        this.current_week_money = _data.current_week_money;
                        this.current_day_money = _data.current_day_money;
                        this.is_show_add = _data.add_bank_flow_show_status;
                        this.pages = _data.pages;
                        this.pay_url = _data.pay_url;
                    }
                });
        },
        // 获取城市
        getCity() {
            let params = {
                type: "2"
            };
            this.axios
                .get("/backend-api/select2/bank/get-city-dropdown-list", {
                    params: params
                })
                .then(res => {
                    if (res.data.code === 0) {
                        this.cityOptions = res.data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    created() {
        this.urlId = this.$route.query.id;
        this.initData();
        this.getCity();
        // 获取下拉列表
        this.axios
            .get("/backend-api/expand/ex-bank-flow/constants")
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    this.bank_list = res.data.data.bank_type;
                    this.verify_list = res.data.data.verify_status;
                    this.payback_list = res.data.data.payback_type;
                }
            });
        this.axios
            .get("/backend-api/select2/select2/get-second-level-sn-name")
            .then(res => {
                if (res.status === 200) {
                    this.code_options = res.data;
                }
            });
    },
    watch: {
        add_bank_options: {
            handler: function(newval) {
                if (
                    newval.arrival_money * 1 > 0 &&
                    newval.gathering_company_name !== "" &&
                    newval.gathering_company_account !== "" &&
                    (newval.arrival_time !== "" || newval.arrival_time !== null)
                ) {
                    this.is_add_btn_disabled = false;
                } else {
                    this.is_add_btn_disabled = true;
                }
            },
            deep: true
        },
        formCash: {
            handler: function(newval) {
                this.is_addcash_btn_disabled = false;
                if (this.roleFlag === 2 && newval.city !== '') {
                    this.is_addcash_btn_disabled = false;
                } else {
                    let sub = newval.subject;
                    for (let i = 0; i < sub.length; i++) {
                        if (sub[i].code === "" || sub[i].money === "") {
                            this.is_addcash_btn_disabled = true;
                            break;
                        }
                    }
                    if (newval.city === "") {
                        this.is_addcash_btn_disabled = true;
                    }
                }
                
            },
            deep: true
        }
    }
};
</script>


<style lang="less" scoped>
.payment-information {
    /deep/ .el-table th.gutter {
        display: table-cell !important;
    }
    /deep/ .el-table colgroup.gutter {
        display: table-cell !important;
    }
    padding: 0 20px;
    .channel-role {
        padding-left: 51px;
        margin: 20px 0;
        box-sizing: border-box;
    }
    .line {
        position: relative;
        padding-left: 14px;
        margin-bottom: 10px;
    }
    .line:before {
        position: absolute;
        left: 0;
        top: 10px;
        content: "";
        width: 6px;
        height: 24px;
        background-color: steelblue;
    }
    /deep/ input {
        background: none;
    }
    button {
        background: #fff;
    }
    .search {
        overflow: hidden;
        > li {
            height: 42px;
            width: 330px;
        }
        > li.w-auto {
            width: auto;
        }
    }
    .operation {
        display: inline-block;
        font-size: 12px;
        cursor: pointer;
        padding: 0 6px;
        margin-bottom: 5px;
        border-radius: 4px;
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
    }
    .operation.delet {
        color: #fff;
        background-color: #f56c6c;
        border-color: #f56c6c;
    }
    .btn-area {
        .btn-reset {
            color: #333;
            border: 1px solid #333;
            margin-right: 15px;
            cursor: pointer;
        }
        .btn-search {
            background: #337ab7;
            color: #fff;
            border: 1px solid #337ab7;
            margin-left: 15px;
            cursor: pointer;
        }
    }
    .v-box {
        .table-tit {
            overflow: hidden;
            font-size: 14px;
            line-height: 46px;
        }
        .add-information {
            float: right;
            margin-right: 25px;
            position: relative;
            top: 5px;
            button {
                color: #333;
                border: 1px solid #333;
                margin-right: 15px;
                cursor: pointer;
            }
        }
    }
    .page {
        margin-top: 20px;
        text-align: center;
        /deep/ .el-pagination {
            display: inline-block;
        }
    }
    /deep/ .add-bank {
        .el-select {
            width: 100%;
        }
        .btn-area {
            text-align: right;
            .cancel {
                color: #333;
                border: 1px solid #333;
                margin-right: 10px;
                cursor: pointer;
            }
            .confirm {
                background: #337ab7;
                color: #fff;
                border: 1px solid #337ab7;
                margin-left: 10px;
            }
        }
        .el-dialog__header {
            > h2 {
                border-bottom: 1px solid #edeff0;
                height: 46px;
                line-height: 46px;
            }
        }
        .el-dialog__body {
            padding: 10px 50px;
            > .s-query {
                overflow: hidden;
                li {
                    float: none;
                    width: auto;
                    .th {
                        width: 130px;
                        margin-right: 15px;
                    }
                }
                .el-date-editor.el-input {
                    width: 100%;
                }
            }
        }
    }
    /deep/ .add-cash {
        .el-dialog__header {
            > h2 {
                border-bottom: 1px solid #edeff0;
                height: 46px;
                line-height: 46px;
            }
        }
        .el-dialog__body {
            padding-top: 0;
            padding-bottom: 0;
            max-height: 500px;
            overflow: auto;
        }
        .dialog_body {
            .s-query {
                overflow: hidden;
                li + li {
                    margin-left: 15px;
                }
                li {
                    .th {
                        width: auto;
                    }
                    > span {
                        display: inline-block;
                        margin: 0 5px;
                        cursor: pointer;
                    }
                    .color-blue {
                        color: #337ab7;
                    }
                    .color-red {
                        color: red;
                    }
                    .td {
                        textarea {
                            height: 120px;
                        }
                    }
                }
                li.w-240 {
                    width: 240px;
                }
                li.w-280 {
                    width: 280px;
                }
                li.w-auto {
                    width: auto;
                }
                li.w-100vw {
                    width: 100%;
                }
            }
        }
        .wirite-off {
            position: relative;
            text-align: right;
            .next-write-off {
                color: #333;
                border: 1px solid #333;
                margin-right: 15px;
            }
            .go-write-off {
                background: #337ab7;
                color: #fff;
                border: 1px solid #337ab7;
                margin-left: 15px;
            }
            .cancel-write-off {
                position: absolute;
                left: 0;
                color: #333;
                border: 1px solid #333;
                margin-right: 15px;
                cursor: pointer;
            }
        }
        .text-area {
            -webkit-appearance: none;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding: 0 15px;
            -webkit-transition: border-color 0.2s
                cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            width: 100%;
        }
        .text-area:focus {
            border-color: #409eff;
            outline: 0;
        }
    }
}
</style>
