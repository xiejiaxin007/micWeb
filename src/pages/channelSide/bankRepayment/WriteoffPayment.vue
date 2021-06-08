<!--
  * @file 银行回款信息页面
  * @author --贺伟
  * @updateTime 2019.10.31
 -->
<template>
    <div class="el-row payment-check">
        <el-col :span="24" class="main-info">
            <!--面包屑-->
            <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/payment/paymentInformation'}">银行回款信息</el-breadcrumb-item>
                <el-breadcrumb-item>回款核销</el-breadcrumb-item>
            </el-breadcrumb>
            <!--待核销回款信息-->
            <wait-check :tableData="waitCheckData"></wait-check>
            <!--历史核销记录展示 分为是否财务角色-->
            <div v-if="isFinanceRole">
                <div class="history" v-show="isShowHistory">
                    <div class="v-box">
                        <div class="hd">
                            <h2 class="line">历史核销记录</h2>
                        </div>
                        <div class="bd">
                            <!--无需审核表格-->
                            <div class="un-need" v-show="historyUncheck.length > 0">
                                <div class="clear" v-show="isFreeAll">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="releaseMoney('2')"
                                    >
                                        批量释放
                                    </el-button>
                                </div>
                                <el-table
                                    :data="historyUncheck"
                                    border
                                    style="width:100%"
                                >
                                    <template v-for="(item, index) in historyHeader">
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-if="item.prop === 'deal_id'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                <a class="link" :href="scope.row.deal_url" target="_blank">
                                                    {{scope.row.deal_id}}
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-else-if="item.prop === 'actual_money'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                {{scope.row.actual_money | currency}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            v-else
                                            :key="index"
                                            :prop="item.prop"
                                            :width="item.width"
                                            :label="item.label"
                                            align="center"
                                        >
                                        </el-table-column>
                                    </template>
                                    <el-table-column
                                        :resizable="false"
                                        label="操作"
                                        width="200"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <a :href="backUrl" target="_blank" v-show="scope.row.show_back_fee">
                                                <el-button
                                                    size="mini"
                                                    type="danger"
                                                >退款
                                                </el-button>
                                            </a>
                                            <el-button v-show="scope.row.show_free"
                                                       type="primary"
                                                       size="mini"
                                                       @click="releaseMoney('1', scope.$index)"
                                            >释放金额
                                            </el-button>
                                            <!--新增驳回按钮 hewei 10.31-->
                                            <el-button
                                                size="mini"
                                                type="danger"
                                                v-show="scope.row.show_reject"
                                                @click="handleReject(scope.$index)"
                                            >驳回</el-button>
                                            <el-button
                                                size="mini"
                                                type="danger"
                                                v-show="scope.row.show_reject_reason"
                                                @click="showReason(scope.row.reject_reason)"
                                            >驳回理由
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="sub-check" v-show="isShowDiff === '1' || isShowDiff === '2'">
                                    <el-button
                                        v-show="isShowDiff === '1'"
                                        type="primary"
                                        size="mini"
                                        @click="handleDiff('1')"
                                    >
                                        差额入库
                                    </el-button>
                                    <el-button
                                        v-show="isShowDiff === '2'"
                                        type="primary"
                                        size="mini"
                                        @click="handleDiff('2')"
                                    >
                                        取消差额入库
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="history" v-show="isShowHistory">
                    <div class="v-box">
                        <div class="hd">
                            <h2 class="line">历史核销记录</h2>
                        </div>
                        <div class="bd">
                            <!--无需审核表格-->
                            <div class="un-need" v-show="historyUncheck.length > 0">
                                <div class="clear" v-show="isFreeAll">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="releaseMoney('2')"
                                    >
                                        批量释放
                                    </el-button>
                                </div>
                                <el-table
                                    :data="historyUncheck"
                                    border
                                    style="width:100%"
                                >
                                    <template v-for="(item, index) in historyHeader">
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-if="item.prop === 'deal_id'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                <a class="link" :href="scope.row.deal_url" target="_blank">
                                                    {{scope.row.deal_id}}
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-else-if="item.prop === 'actual_money'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                {{scope.row.actual_money | currency}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            v-else
                                            :key="index"
                                            :prop="item.prop"
                                            :width="item.width"
                                            :label="item.label"
                                            align="center"
                                        >
                                        </el-table-column>
                                    </template>
                                    <el-table-column
                                        :resizable="false"
                                        label="操作"
                                        width="200"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <a :href="backUrl" target="_blank" v-show="scope.row.show_back_fee">
                                                <el-button
                                                    size="mini"
                                                    type="danger"
                                                >退款
                                                </el-button>
                                            </a>
                                            <el-button v-show="scope.row.show_free"
                                                       type="primary"
                                                       size="mini"
                                                       @click="releaseMoney('1', scope.$index)"
                                            >释放金额
                                            </el-button>
                                            <el-button
                                                size="mini"
                                                type="danger"
                                                v-show="scope.row.show_reject_reason"
                                                @click="showReason(scope.row.reject_reason)"
                                            >驳回理由
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="sub-check" v-show="isShowDiff === '1' || isShowDiff === '2'">
                                    <el-button
                                        v-show="isShowDiff === '1'"
                                        type="primary"
                                        size="mini"
                                        @click="handleDiff('1')"
                                    >
                                        差额入库
                                    </el-button>
                                    <el-button
                                        v-show="isShowDiff === '2'"
                                        type="primary"
                                        size="mini"
                                        @click="handleDiff('2')"
                                    >
                                        取消差额入库
                                    </el-button>
                                </div>
                            </div>
                            <!--需要审核表格 渠道操作表-->
                            <div class="need" v-show="historyCheck.length > 0">
                                <div class="clear">
                                    <el-button
                                        v-show="isRevertAll"
                                        type="primary"
                                        size="mini"
                                        @click="revertSub('2')"
                                    >
                                        批量撤回
                                    </el-button>
                                    <!--释放审批批量撤回按钮-->
                                    <el-button
                                        v-show="showReleaseRevoll"
                                        type="primary"
                                        size="mini"
                                        @click="recall('','2')"
                                    >
                                        批量撤回
                                    </el-button>
                                </div>
                                <el-table
                                    :data="historyCheck"
                                    border
                                    style="width:100%"
                                >
                                    <template v-for="(item, index) in historyHeader">
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-if="item.prop === 'deal_id'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                <a class="link" :href="scope.row.deal_url" target="_blank">
                                                    {{scope.row.deal_id}}
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-else-if="item.prop === 'actual_money'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                {{scope.row.actual_money | currency}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            v-else
                                            :key="index"
                                            :prop="item.prop"
                                            :width="item.width"
                                            :label="item.label"
                                            align="center"
                                        >
                                        </el-table-column>
                                    </template>
                                    <el-table-column
                                        :resizable="false"
                                        label="操作"
                                        width="170"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <!--新增状态为释放审批中的撤回-->
                                            <el-button v-show="scope.row.show_revoke || scope.row.show_release_revoke"
                                                type="primary"
                                                size="mini"
                                                @click="recall(scope.row)"
                                            >撤回提交
                                            </el-button>
                                            <el-button
                                                v-show="scope.row.show_edit"
                                                type="primary"
                                                size="mini"
                                                @click="editCheck(scope.row)"
                                            >修改
                                            </el-button>
                                            <el-button v-show="scope.row.show_delete"
                                                       size="mini" @click="deleteSub(scope.row)"
                                                       type="danger"
                                            >删除
                                            </el-button>
                                            <el-button
                                                size="mini"
                                                type="danger"
                                                v-show="scope.row.show_reject_reason"
                                                @click="showReason(scope.row.reject_reason)"
                                            >驳回理由
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="sub-check">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        v-show="isShowFile"
                                        @click="seeFile"
                                    >
                                        查看附件
                                    </el-button>
                                    <el-button
                                        v-show="isShowProof"
                                        type="primary"
                                        size="mini"
                                        @click="seeProof"
                                    >
                                        查看凭证
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--财务审核的展示-->
            <div v-if="isFinanceRole">
                <finance-table
                    :batch-ids="batchIds"
                    v-show="financeData.data.length > 0"
                    @see-file="seeFile"
                    @check-success="getWaitData"
                    v-model="financeData"
                    ref="financeTable"
                >
                </finance-table>
            </div>
            <!--核销的回款详情-->
            <div class="is-check" v-show="isShowCheck">
                <div class="v-box">
                    <div class="hd">
                        <h2 class="line">核销的回款详情</h2>
                    </div>
                    <div class="bd">
                        <!--需要审核表格-->
                        <div class="check-tb" v-show="checkDetailData.length > 0">
                            <div class="clear" v-show="checkDetailData.length > 1">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="clearData('1')"
                                >
                                    批量清除
                                </el-button>
                            </div>
                            <div class="tb-w">
                                <el-table
                                    :data="checkDetailData"
                                    border
                                    style="width: 100%">
                                    <template
                                        v-for="(item, index) in checkHeader"
                                    >
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-if="item.prop === 'deal_id'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                <a class="link" :href="scope.row.deal_url" target="_blank">
                                                    {{scope.row.deal_id}}
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-else-if="item.prop === 'actual_money'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                {{scope.row.actual_money | currency}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            v-else
                                            :key="index"
                                            :prop="item.prop"
                                            :width="item.width"
                                            :label="item.label"
                                            align="center"
                                        >
                                        </el-table-column>
                                    </template>
                                    <el-table-column
                                        :resizable="false"
                                        label="操作"
                                        width="130"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="editData(scope.row)"
                                            >修改
                                            </el-button>
                                            <el-button
                                                size="mini"
                                                type="danger"
                                                @click="clearData('1', scope.$index)"
                                            >删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="sub-check">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="submitFinancer"
                                    >
                                        提交到财务审核
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <!--不需要审核的表格数据-->
                        <div class="uncheck-tb" v-show="unCheckDetailData.length > 0">
                            <div class="clear" v-show="unCheckDetailData.length > 1">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="clearData('2')"
                                >
                                    批量清除
                                </el-button>
                            </div>
                            <div class="tb-w">
                                <el-table
                                    :data="unCheckDetailData"
                                    border
                                    style="width: 100%">
                                    <template
                                        v-for="(item, index) in checkHeader"
                                    >
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-if="item.prop === 'deal_id'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                <a class="link" :href="scope.row.deal_url" target="_blank">
                                                    {{scope.row.deal_id}}
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            :key="index"
                                            v-else-if="item.prop === 'actual_money'"
                                            align="center"
                                            :label="item.label"
                                        >
                                            <template slot-scope="scope">
                                                {{scope.row.actual_money | currency}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :resizable="false"
                                            v-else
                                            :key="index"
                                            :prop="item.prop"
                                            :width="item.width"
                                            :label="item.label"
                                            align="center"
                                        >
                                        </el-table-column>
                                    </template>
                                    <el-table-column
                                        :resizable="false"
                                        label="操作"
                                        width="130"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="editData(scope.row)"
                                            >修改
                                            </el-button>
                                            <el-button
                                                size="mini"
                                                type="danger"
                                                @click="clearData('2', scope.$index)"
                                            >删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="sub-check">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="finishCheck"
                                    >
                                        完成核销
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--搜索条件-->
            <div class="search-box">
                <div class="v-box">
                    <div class="hd">
                        <h2>搜索条件</h2>
                    </div>
                    <div class="bd">
                        <ul class="s-query">
                            <li>
                                <div class="th">城市：</div>
                                <div class="td">
                                    <el-select v-model="form.city" :filterable="isCanChoose" placeholder="请选择">
                                        <el-option
                                            v-for="item in dataOption.city"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">
                                    成交单ID：
                                </div>
                                <div class="td">
                                    <el-input v-model="form.dealId"></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="th">
                                    客户名称：
                                </div>
                                <div class="td">
                                    <el-input v-model="form.name"></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="th">
                                    楼盘名称：
                                </div>
                                <div class="td">
                                    <el-select
                                        v-model="form.building"
                                        filterable
                                        clearable
                                        remote
                                        :remote-method="getRemoteBuild"
                                    >
                                        <el-option
                                            v-for="item in dataOption.buildings"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="w-auto">
                                <div class="th">网签日期：</div>
                                <div class="td">
                                    <el-date-picker
                                        v-model="form.netTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </div>
                            </li>
                            <li class="w-auto">
                                <div class="th">草签日期：</div>
                                <div class="td">
                                    <el-date-picker
                                        v-model="form.draftTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </div>
                            </li>
                            <li class="w-auto">
                                <div class="th">认购日期：</div>
                                <div class="td">
                                    <el-date-picker
                                        v-model="form.buyTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </div>
                            </li>
                            <li class="w-auto">
                                <div class="th">排号日期：</div>
                                <div class="td">
                                    <el-date-picker
                                        v-model="form.rankTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </div>
                            </li>
                            <li>
                                <div class="th">
                                    回款负责人：
                                </div>
                                <div class="td">
                                    <el-select
                                        v-model="form.people"
                                        filterable
                                        clearable
                                        remote
                                        :remote-method="getRemotePeople"
                                    >
                                        <el-option
                                            v-for="item in dataOption.people"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                        <div class="btn-area">
                            <button class="btn btn-reset" @click="resetSearch">重置</button>
                            <button class="btn btn-search" @click="searchData">搜索</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add" v-if="isShowOption">
                <el-button :disabled="isShowTip" @click="handleTopDialog">操作</el-button>
            </div>
            <!--展示表格-->
            <div class="define-tb-wrap">
                <table class="define-table" v-show="listData.length > 0 || topTable.length > 0">
                    <thead>
                    <th class="w-80" v-if="isShowOption">选择</th>
                    <th class="w-80">城市</th>
                    <th class="w-100">成交ID</th>
                    <th class="w-120">成交楼盘</th>
                    <th class="w-100">成交客户姓名</th>
                    <th class="w-120">
                        合同主体
                    </th>
                    <th class="w-100">回款负责人</th>
                    <th>结佣类型</th>
                    <th class="w-200">
                        <div class="w-200">
                            合同预测阶段
                        </div>
                    </th>
                    <th class="w-100">合同预测金额</th>
                    <th class="w-100">剩余回款金额</th>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in topTable" :key="index + 'top'">
                        <td class="w-80" v-if="isShowOption">
                            <div style="width: 80px">
                                <span :class="{'fake-check': true, 'selected': item.check}" @click="handleTop('2',index,item)">
                                <i v-show="item.check" class="el-icon-check" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                        <td class="w-80">
                            <div class="w-80">
                                {{item.city_name}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                <a class="link" :href="item.deal_url" target="_blank">
                                    {{item.deal_id}}
                                </a>
                            </div>
                        </td>
                        <td class="w-120">
                            <div class="w-120">
                                {{item.project_name}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.username}}
                            </div>
                        </td>
                        <td class="w-120">
                            <div class="w-120">
                                {{item.partner_contract_name}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.payback_employee}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.commission_type_text}}
                            </div>
                        </td>
                        <td class="w-200">
                            <div class="w-200">
                                {{item.content}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.pre_paid_money | currency}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.unverified_money | currency}}
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(item, index) in listData" :key="index">
                        <td class="w-80" v-if="isShowOption">
                            <div class="w-80">
                                <span :class="{'fake-check': true, 'selected': item.check}" @click="handleTop('1',index,item)">
                                <i v-show="item.check" class="el-icon-check" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                        <td class="w-80">
                            <div class="w-80">
                                {{item.city_name}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                <a class="link" :href="item.deal_url" target="_blank">
                                    {{item.deal_id}}
                                </a>
                            </div>
                        </td>
                        <td class="w-120">
                            <div class="w-120">
                                {{item.project_name}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.username}}
                            </div>
                        </td>
                        <td class="w-120">
                            <div class="w-120">
                                {{item.partner_contract_name}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.payback_employee}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.commission_type_text}}
                            </div>
                        </td>
                        <td class="w-200">
                            <div class="w-200">
                                {{item.content}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.pre_paid_money | currency}}
                            </div>
                        </td>
                        <td class="w-100">
                            <div class="w-100">
                                {{item.unverified_money | currency}}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--分页按钮展示-->
            <div class="page-btn">
                <button class="btn" v-show="page > 1" @click="prevPage">上一页</button>
                <button class="btn" v-show="page < totalPage" @click="nextPage">下一页</button>
            </div>
        </el-col>
        <!--置顶数据弹窗-->
        <top-dialog :show-top-dialog="showTopDialog"
                    :title-msg="titleMsg" :top-table="dialogData"
                    :edit-tag="editTag"
                    @delete-top="removeTop"
                    @close-dia="closeTopDia"
                    @sub-dia="subTopDia"
                    @success-history="historySuccess"
        >
        </top-dialog>
        <!--上传图片-->
        <upload-voucher ref="upload" :check-data="checkDetailData" @uploaded="uploadSuccess"></upload-voucher>
        <!--显示驳回理由弹窗-->
        <el-dialog :visible.sync="rejectReason" width="450px" class="reason-dia">
            <h2 slot="title" class="line">驳回理由</h2>
            <div class="reject-content">
                <div class="fl">
                    驳回理由：
                </div>
                <div class="reason-content">
                    {{reasonStr}}
                </div>
            </div>
        </el-dialog>
        <!--查看附件弹窗-->
        <check-file ref="file" :file-list="fileList" :host="host"></check-file>
        <!--释放金额弹窗-->
        <el-dialog width="600px" class="reject"
                   :visible.sync="releaseDialog"
                   :before-close="beforeRelease"
                   :close-on-click-modal="!showLoading"
        >
            <h2 slot="title" class="line">释放金额审批：</h2>
            <div class="reject-body">
                <p>
                    {{release.title}}
                </p>
                <ul class="s-query" v-loading="showLoading">
                    <li>
                        <div class="th required">释放原因：</div>
                        <div class="td">
                            <textarea class="text-area" placeholder="最多300字，不能为空" maxlength="300" v-model.trim="release.reason"></textarea>
                        </div>
                    </li>
                    <li>
                        <div class="th">上传附件：</div>
                        <div class="td">
                            <jl-file-upload
                                ref="upload"
                                fileMaxSize="5mb"
                                fileType="doc,docx,pdf,ppt,pptx,xlsx,xls,jpg,png,jpeg"
                                upID="fileUpload"
                                :isMulti="true"
                                :limit="10 - aliyunArr.length"
                                :ossData="ossData"
                                @getFileURL='getFileURL'>
                                <i class="el-icon-upload" aria-hidden="true"></i>
                            </jl-file-upload>
                            <!--文件展示列表-->
                            <div class="list">
                                <div class="list-item" v-for="(item, index) in aliyunArr" :key="index">
                                    <span class="name">
                                        {{item.name}}
                                    </span>
                                    <span class="delete" @click="deleteFile(index)">删除</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area reject-btn" slot="footer">
                <el-button class="btn close-reject" :disabled="showLoading" @click="releaseDialog = false">取消
                </el-button>
                <el-button
                    class="btn submit-reject"
                    @click="submitRelease"
                    :disabled="release.reason === '' || showLoading">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!--完成核销弹窗-->
        <el-dialog width="450px" class="reject"
                   :visible.sync="checkDialog"
                   :show-close="false"
        >
            <h2 slot="title" class="line">核销提示</h2>
            <div class="reject-body">
                {{checkMsg}}
            </div>
            <div class="btn-area reject-btn" slot="footer">
                <el-button class="btn close-reject" @click="checkDialog = false">取消</el-button>
                <el-button class="btn submit-reject" @click="goNewPage">前往更改流水信息</el-button>
            </div>
        </el-dialog>
        <!--驳回弹窗-->
        <reject-dialog
            :dialog-visible.sync="rejectDialogShow"
            :refuse-title="rejectTitle"
            :can-close="closeModal"
            @handleConfirm="submitRefuse"
        />
    </div>
</template>

<script>
    import apiObj from '@/api/bankRepaymentApi/writeOffPayment';
    import RejectDialog from './components/RejectDialog';
    import WaitCheck from './components/WaitCheck'
    import TopDialog from './components/TopDialog'
    import UploadVoucher from './components/UploadVoucher'
    import FinanceTable from './components/FinanceTable'
    import CheckFile from './components/CheckFile'
    import { getSign } from '@/api/commonApi';
    export default {
        name: 'writeoff-payment',
        data () {
            return {
                // 驳回弹窗的显隐状态
                rejectDialogShow: false,
                // 弹窗标题内容
                rejectTitle: '',
                // 是否可关闭弹窗
                closeModal: true,
                flowId: '', // 流水id
                defaultCity: '', // 城市默认值
                isCanChoose: false, // 城市是否可选
                waitCheckData: [], // 待核销表格数据
                isFinanceRole: false, // 是否是财务角色
                financeData: { // 财务数据
                    data: [],
                    showFile: false
                },
                form: { // 搜索条件
                    city: '',
                    dealId: '', // 成交单id
                    name: '', // 客户名称
                    building: '', // 楼盘名称
                    netTime: '', // 网签日期
                    draftTime: '', // 草签日期
                    buyTime: '', // 认购日期
                    rankTime: '', // 排号日期
                    people: '' // 回款负责人
                },
                dataOption: {
                    city: [], // 城市数据
                    buildings: [], // 楼盘
                    people: []// 回款负责人
                },
                listData: [], // 数据表格展示数据
                page: 1, // 数据表格，默认请求第一页
                totalPage: 0, // 一共多少页
                isShowOption: false, // 是否展示操作按钮
                isShowHead: true, // 是否展示非置顶表格表头
                topTable: [], // 置顶数据表格
                isShowTip: false, // 置顶数据选择大于5个的提示
                showTopDialog: false, // 置顶弹窗出现标识
                dialogData: [], // 弹窗数据
                titleMsg: '添加回款信息', // 弹窗标题
                editTag: '', // 是否是编辑数据
                checkDetailData: [], // 待核销回款详情需要审核
                unCheckDetailData: [], // 待核销回款详情不需要审核
                checkHeader: [ // 待核销回款详情组织header数据
                    {
                        prop: 'city_name',
                        width: '80',
                        label: '城市'
                    },
                    {
                        prop: 'deal_id',
                        label: '成交id'
                    },
                    {
                        prop: 'project_name',
                        width: '150',
                        label: '楼盘名称'
                    },
                    {
                        prop: 'username',
                        label: '客户名称'
                    },
                    {
                        prop: 'partner_contract_name',
                        width: '200',
                        label: '合同主体'
                    },
                    {
                        prop: 'content',
                        width: '200',
                        label: '合同预测阶段'
                    },
                    {
                        prop: 'arrival_time',
                        width: '160',
                        label: '实际回款日期'
                    },
                    {
                        prop: 'actual_money',
                        label: '实际回款金额'
                    },
                    {
                        prop: 'verify_status_text',
                        label: '财务审核状态'
                    }
                ],
                isShowCheck: false, // 是否展示详情
                isShowHistory: false, // 是否有历史核销
                historyHeader: [ // 历史模块表头
                    {prop: 'show_number', label: '核销编号', width: '100'},
                    {
                        prop: 'city_name',
                        width: '80',
                        label: '城市'
                    },
                    {
                        prop: 'deal_id',
                        label: '成交id'
                    },
                    {
                        prop: 'project_name',
                        width: '150',
                        label: '楼盘名称'
                    },
                    {
                        prop: 'username',
                        label: '客户名称'
                    },
                    {
                        prop: 'partner_contract_name',
                        width: '200',
                        label: '合同主体'
                    },
                    {
                        prop: 'pre_paid_content',
                        width: '200',
                        label: '合同预测阶段'
                    },
                    {
                        prop: 'actual_datetime',
                        width: '160',
                        label: '实际回款日期'
                    },
                    {
                        prop: 'actual_money',
                        label: '实际回款金额'
                    },
                    {
                        prop: 'verify_status_text',
                        label: '财务审核状态'
                    }
                ],
                historyUncheck: [], // 历史无需审核数据
                backUrl: '', // 退款页面链接
                historyCheck: [], // 历史需要审核的数据
                isFreeAll: false, // 是否批量释放金额
                isShowDiff: '', // 是否展示差额入库
                isRevertAll: false, // 批量撤回标识
                isShowFile: false, // 查看附件
                isShowProof: false, // 查看凭证标识
                // 是否展示渠道批量撤回按钮
                showReleaseRevoll: false,
                flag: true, // 防止多次点击
                rejectReason: false, // 驳回理由弹窗
                reasonStr: '', // 原因描述
                fileDialog: false, // 附件弹窗
                releaseDialog: false, // 释放金额弹窗
                release: { // 释放金额弹窗填写数据
                    title: '', // 标题
                    reason: '', // 原因
                    files: [] // 上传的附件
                },
                releaseType: '', // 单个或者批量释放
                releaseIndex: '', // 释放数据索引
                aliyunArr: [], // 记录上传阿里云成功的数组
                showLoading: false, // 上传等待标识
                fileList: [], // 查看附件数据
                host: '', // 域名
                checkDialog: false, // 完成核销提示弹窗
                checkMsg: '', // 核销提示文字
                checkUrl: '', // 前往的链接,
                // 多审批id 只有渠道角色跳转凭证页面需要传此值
                batchIds: '',
                // 请求阿里地址返回的数据
                ossData: {}
            }
        },
        methods: {
            // 获取阿里云上传签名
            async getSignCode() {
                let params = {
                    cate: 'uploadVoucher'
                };
                try {
                    let { data } = await getSign(params);
                    if (data.code === 0) {
                        this.ossData = data.data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 撤回提交处理
             * @param {Object} row 表格单行数据对象
             * @param {String} type 是否为批量撤回 如果是批量撤回为 ‘2’
             */
            recall(row, type) {
                // 如果是批量撤回
                if (type === '2') {
                    this.batchRecall();
                    return;
                }
                // 如果是释放审批中则调用释放审批撤回
                if (row.verify_status === '6') {
                    // 如果是等待审核调用之前的撤回
                    this.confirmRecall(row);
                } else if (row.verify_status === '1') {
                    this.revertSub('1', row);
                }
            },
            /**
             * 撤回确认confirm弹窗
             * @param {Object} para 表格单行数据对象
             */
            confirmRecall(para) {
                this.$confirm(`您确定要撤回核销编号：${para.show_number} 的审核申请吗？`, '提示', {})
                    .then(() => {
                    let data = [
                        {
                            business_type: para.business_type,
                            id: para.business_id,
                            deal_id: para.deal_id,
                            verify_status: para.verify_status
                        }
                    ];
                    this.releaseRecall(this.flowId, data);
                });
            },
            // 批量撤回确认confirm弹窗
            batchRecall() {
                this.$confirm('您确定要批量撤回审核申请吗？', '提示', {}).then(() => {
                    let data = [];
                    this.historyCheck.forEach((item) => {
                        const obj = {
                            business_type: item.business_type,
                            id: item.business_id,
                            deal_id: item.deal_id,
                            verify_status: item.verify_status
                        };
                        if (item.show_release_revoke) {
                            data.push(obj);
                        }
                    });
                    this.releaseRecall(this.flowId, data);
                });
            },
            /**
             * 释放审批撤回
             * @param {String} id 数据行流水id
             * @param {Array} data 需要穿戴服务端的数据对象数组
             */
            async releaseRecall(id, data) {
                try {
                    const { data: {code, msg} } = await apiObj.updateReleaseRecallData(id, data);
                    if (code === 0) {
                        // 将数据加回到需要审核的表格中去  更新历史数据   更改财务审核状态
                        this.getWaitData()
                        this.getHistory()
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 点击确定按钮提交驳回
             * @param {String} reason 驳回原因
             */
            submitRefuse(reason) {
                this.closeModal = false;
                // 单个驳回
                let obj = this.historyUncheck[this.index];
                let data = [
                    {
                        business_type: obj.business_type,
                        id: obj.business_id,
                        deal_id: obj.deal_id,
                        verify_status: obj.verify_status
                    }
                ];
                let params = {
                    id: this.flowId,
                    list: data,
                    reason
                };
                // 调用驳回方法 返回成功失败
                const status = this.$refs.financeTable.singleReject(obj, params);
                // 如果调用成功则关闭弹窗
                status.then(res => {
                    if (res === true) {
                        this.rejectDialogShow = false;
                        // 重新调用接口刷新数据
                        this.getHistory();
                        this.getWaitData();
                    } else {
                        this.$message(res);
                    }
                });
            },
            /**
             * 点击驳回显示驳回弹窗
             * @param {Number} index 数据行所在索引
             */
            handleReject(index) {
                this.index = index;
                let para = this.historyUncheck[index];
                this.rejectTitle = this.$refs.financeTable.createdRejectTitle(para);
                this.rejectDialogShow = true;
            },
            // 获取待审核数据
            getWaitData (resolve) {
                let params = {
                    flow_id: this.flowId
                }
                this.axios.get('/backend-api/expand/ex-bank-flow/get-flow-info', {params: params}).then(res => {
                    if (res.data.code === 0) {
                        this.waitCheckData = res.data.data.info
                        this.isFinanceRole = res.data.data.is_finance_role
                        if (resolve) {
                            resolve(this.isFinanceRole)
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 获取历史审核的数据
            getHistory () {
                let params = {
                    flow_id: this.flowId
                }
                this.axios.get('/backend-api/expand/ex-bank-flow/get-history-payment', {params: params}).then((res) => {
                    if (res.data.code === 0) {
                        this.historyUncheck = res.data.data.not_audit_data
                        this.historyCheck = res.data.data.need_audit_data
                        this.backUrl = res.data.data.back_fee_url
                        this.isFreeAll = res.data.data.show_batch_free
                        this.isShowDiff = (res.data.data.show_diff_money).toString()
                        this.isRevertAll = res.data.data.show_batch_revoke
                        this.isShowProof = res.data.data.show_see_vouch
                        this.isShowFile = res.data.data.show_see_attach // 附件
                        // 是否展示批量撤回
                        this.showReleaseRevoll = res.data.data.show_batch_release_revoke;
                        // 存储batchIds
                        this.batchIds = res.data.data.batch_id;
                        this.historyUncheck.forEach((item) => {
                            this.handleStatus(item)
                        })
                        this.historyCheck.forEach((item) => {
                            this.handleStatus(item)
                        })
                    }
                    // 是否是财务角色判断各种状态
                    if (this.isFinanceRole) {
                        if (this.historyUncheck.length > 0) {
                            this.isShowHistory = true
                        } else {
                            this.isShowHistory = false
                        }
                    } else {
                        if (this.historyUncheck.length > 0 || this.historyCheck.length > 0) {
                            this.isShowHistory = true
                        } else {
                            this.isShowHistory = false
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            handleStatus (para) {
                switch (para.verify_status.toString()) {
                    case '0':
                        this.$set(para, 'verify_status_text', '等待提交')
                        break
                    case '1':
                        this.$set(para, 'verify_status_text', '等待审核')
                        break
                    case '2':
                        this.$set(para, 'verify_status_text', '审核通过')
                        break
                    case '3':
                        this.$set(para, 'verify_status_text', '无需审核')
                        break
                    case '4':
                        this.$set(para, 'verify_status_text', '审核驳回')
                        break
                    case '5':
                        this.$set(para, 'verify_status_text', '释放通过')
                        break
                    case '6':
                        this.$set(para, 'verify_status_text', '释放审批')
                        break
                    case '7':
                        this.$set(para, 'verify_status_text', '释放驳回')
                        break
                    case '9':
                        this.$set(para, 'verify_status_text', '已退款')
                        break
                }
            },
            // 获取城市
            getCity () {
                let params = {
                    type: '2'
                }
                return this.axios.get('/backend-api/select2/bank/get-city-dropdown-list', {params: params})
            },
            // 远程搜索楼盘
            getRemoteBuild (query) {
                let params = {
                    city_id: this.form.city,
                    q: query
                }
                this.axios.get('/backend-api/common/get-project-list', {params: params}).then((res) => {
                    if (res.data.code === 0) {
                        this.dataOption.buildings = res.data.data
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 远程搜索负责人
            getRemotePeople (query) {
                let params = {
                    q: query
                }
                this.axios.get('/backend-api/employee/get-employee-dropdown-list', {params: params}).then((res) => {
                    if (res.data.code === 0) {
                        this.dataOption.people = res.data.data
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 搜索
            searchData () {
                this.page = 1
                this.getListData()
            },
            // 重置搜索条件
            resetSearch () {
                // 重置如果没有默认选项，全部清空
                if (this.defaultCity === '-2') {
                    for (let k in this.form) {
                        this.form[k] = ''
                    }
                } else {
                    for (let k in this.form) {
                        if (k !== 'city') {
                            this.form[k] = ''
                        }
                    }
                }
                this.page = 1
                this.getListData()
            },
            // 获取展示表格
            async getListData (isInit) {
                let cityData = []
                if (isInit === 'init') {
                    let result = await this.getCity()
                    let {data} = result
                    if (data.code === 0) {
                        cityData = data.data
                    }
                }
                let params = {
                    page: this.page,
                    flow_id: this.flowId,
                    deal_id: this.form.dealId,
                    username: this.form.name,
                    project_id: this.form.building,
                    sign_start_datetime: this.form.netTime ? this.form.netTime[0] : '',
                    sign_end_datetime: this.form.netTime ? this.form.netTime[1] : '',
                    grass_start_datetime: this.form.draftTime ? this.form.draftTime[0] : '',
                    grass_end_datetime: this.form.draftTime ? this.form.draftTime[1] : '',
                    subscribe_start_datetime: this.form.buyTime ? this.form.buyTime[0] : '',
                    subscribe_end_datetime: this.form.buyTime ? this.form.buyTime[1] : '',
                    paihao_start_datetime: this.form.rankTime ? this.form.rankTime[0] : '',
                    paihao_end_datetime: this.form.rankTime ? this.form.rankTime[1] : '',
                    payback_employee_id: this.form.people
                }
                if (this.isCanChoose) {
                    params.city_id = this.form.city
                }
                this.axios.post('/backend-api/expand/ex-bank-flow/get-payment-list', params).then((res) => {
                    if (res.data.code === 0) {
                        this.isShowOption = res.data.data.show_add_btn // 是否展示操作按钮
                        this.totalPage = res.data.data.total_page - 0 // 预防返回非数字类型
                        if (isInit === 'init') {
                            this.defaultCity = res.data.data.city_id.toString()
                            if (this.defaultCity === '-2') {
                                // 没有默认值
                                this.isCanChoose = true
                                this.form.city = ''
                                this.dataOption.city = cityData
                            } else {
                                this.form.city = this.defaultCity
                                if (this.defaultCity === '-1') {
                                    this.isCanChoose = true
                                    this.dataOption.city = cityData
                                } else {
                                    this.isCanChoose = false
                                    for (let i = 0; i < cityData.length; i++) {
                                        if (this.defaultCity === cityData[i].id) {
                                            let obj = {
                                                id: cityData[i].id,
                                                text: cityData[i].text
                                            }
                                            this.dataOption.city.push(obj)
                                            break
                                        }
                                    }
                                }
                            }
                        }
                        let datas = res.data.data.grid_data
                        // 判断有无置顶数据，如果有对应删除相同的数据
                        if (this.topTable.length !== 0 || this.checkDetailData.length !== 0 || this.unCheckDetailData.length !== 0) {
                            let compareArr = [...this.topTable, ...this.checkDetailData, ...this.unCheckDetailData]
                            compareArr.forEach((item, index) => {
                                datas.forEach((item1, index1) => {
                                    if (item.deal_id === item1.deal_id && item.business_id === item1.business_id) {
                                        datas.splice(index1, 1)
                                    }
                                })
                            })
                        }
                        datas.forEach((item, index) => {
                            item.check = false
                            item.payback_employee = item.payback_employee.join(',')
                            this.handleType(item)
                        })
                        this.listData = datas
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 处理结佣类型函数
            handleType (para) {
                switch (para.commission_type.toString()) {
                    case '1':
                        this.$set(para, 'commission_type_text', '前置电商')
                        break
                    case '2':
                        this.$set(para, 'commission_type_text', '后置返费')
                        break
                    case '3':
                        this.$set(para, 'commission_type_text', '成交奖')
                        break
                    case '4':
                        this.$set(para, 'commission_type_text', '合同外收入')
                        break
                }
            },
            // 处理置顶
            handleTop (type, index, data) {
                // type 1 搜索表格操作  2 置顶表格操作  index 当前数据的索引 data 数据
                if (type === '1' && !this.isShowTip) {
                    if (this.topTable.length > 5 || this.topTable.length === 5) {
                        // 提示不能选择
                        this.isShowTip = true
                        this.$message({
                            message: '最多只能固定5条数据哦，请先点击‘操作’，填写‘实际回款’后，可以在继续选中数据行。',
                            type: 'warning',
                            onClose: () => {
                                this.listData[index].check = false
                                this.isShowTip = false
                            }
                        })
                    } else {
                        this.listData[index].check = true
                        this.listData.splice(index, 1)
                        this.topTable.push(data)
                    }
                } else if (type === '2') {
                    data.check = false
                    this.topTable.splice(index, 1)
                }
            },
            // 下一页
            nextPage () {
                this.page++
                if (this.page > this.totalPage) {
                    this.page = this.totalPage
                }
                this.getListData()
            },
            prevPage () {
                this.page--
                if (this.page <= 0) {
                    this.page = 1
                }
                this.getListData()
            },
            handleTopDialog () {
                if (this.topTable.length === 0) {
                    this.$message({
                        message: '请先选择置顶数据后，才能进行操作哦！',
                        type: 'warning'
                    })
                }
                if (this.topTable.length <= 5 && this.topTable.length !== 0) {
                    // 设置置顶数据字段标识 iptVal 绑定弹窗里面input值
                    this.topTable.forEach((item) => {
                        this.$set(item, 'iptVal', item.unverified_money)
                        this.$set(item, 'showTip', false)
                        this.$set(item, 'rangeTip', false)
                    })
                    this.editTag = '' // 清除编辑标识
                    this.dialogData = this.topTable
                    this.showTopDialog = true
                }
            },
            closeTopDia (para) {
                this.showTopDialog = para
                setTimeout(() => {
                    this.editTag = ''
                }, 200)
            },
            subTopDia (para, isClear, data, editTag) {
                this.showTopDialog = para
                if (editTag !== 'edit') {
                    data.need_audit.forEach((item) => {
                        item.check = false
                        this.handleStatus(item)
                        this.checkDetailData.push(item)
                    })
                    data.not_audit.forEach((item) => {
                        item.check = false
                        this.handleStatus(item)
                        this.unCheckDetailData.push(item)
                    })
                } else {
                    this.checkDetailData.forEach((item, index) => {
                        if (item.business_id === data.need_audit[0].business_id && item.deal_id === data.need_audit[0].deal_id) {
                            this.$set(this.checkDetailData, index, data.need_audit[0])
                        }
                    })
                    this.unCheckDetailData.forEach((item, index) => {
                        if (item.business_id === data.not_audit[0].business_id && item.deal_id === data.not_audit[0].deal_id) {
                            this.$set(this.unCheckDetailData, index, data.not_audit[0])
                        }
                    })
                }
                this.isShowCheck = true
                if (isClear) {
                    this.editTag = ''
                    this.topTable = []
                    this.dialogData = []
                }
            },
            // 移除该项
            removeTop (index) {
                this.dialogData[index].check = false
                this.dialogData.splice(index, 1)
                if (this.dialogData.length === 0) {
                    this.showTopDialog = false
                }
            },
            clearData (type, index) {
                // 批量/单个清除 1 需要审核的数据  2 不需要审核
                if (index !== undefined) {
                    this.$confirm('您确定要删除？', '提示', {}).then(() => {
                        if (type === '1') {
                            this.checkDetailData.splice(index, 1)
                        } else if (type === '2') {
                            this.unCheckDetailData.splice(index, 1)
                        }
                        if (this.checkDetailData.length === 0 && this.unCheckDetailData.length === 0) {
                            this.isShowCheck = false
                        }
                    }).catch(action => {
                    })
                } else {
                    this.$confirm('您确定要批量清除您刚选择的合同预测吗？', '提示', {}).then(() => {
                        if (type === '1') {
                            this.checkDetailData.splice(0, this.checkDetailData.length)
                        } else if (type === '2') {
                            this.unCheckDetailData.splice(0, this.unCheckDetailData.length)
                        }
                        if (this.checkDetailData.length === 0 && this.unCheckDetailData.length === 0) {
                            this.isShowCheck = false
                        }
                    }).catch(action => {
                    })
                }
            },
            editData (data) {
                // 编辑实际回款金额 设置数据中的实际回款金额 = 剩余回款金额
                this.titleMsg = '修改回款信息'
                this.editTag = 'edit'
                data.showTip = false
                data.rangeTip = false
                this.showTopDialog = true
                this.$set(data, 'iptVal', data.actual_money)
                this.$set(this.dialogData, 0, data)
            },
            // 提交到财务审核
            submitFinancer () {
                this.$refs.upload.showVoucher()
            },
            // 上传成功
            uploadSuccess () {
                // 重新请求历史，待审核数据模块, 清空详情需要审核表格
                this.checkDetailData = []
                this.getHistory()
                this.getWaitData()
                if (this.checkDetailData.length === 0 && this.unCheckDetailData.length === 0) {
                    this.isShowCheck = false
                }
            },
            // 完成核销
            finishCheck () {
                let dataArr = []
                this.unCheckDetailData.forEach((item) => {
                    let obj = {
                        business_type: item.business_type,
                        business_id: item.business_id,
                        forecast_step: item.step,
                        forecast_num: item.num,
                        forecast_step_num: item.step_num,
                        actual_money: item.actual_money.toString(),
                        deal_id: item.deal_id
                    }
                    dataArr.push(obj)
                })
                let params = {
                    bank_flow_id: this.flowId,
                    data: dataArr
                }
                if (this.flag) {
                    this.flag = false
                    this.axios.post('/backend-api/expand/ex-bank-flow/finish-verify', params).then((res) => {
                        this.flag = true
                        if (res.data.code === 0) {
                            // 清除无需审核数据
                            this.unCheckDetailData = []
                            this.getHistory()
                            this.getWaitData()
                            if (this.checkDetailData.length === 0 && this.unCheckDetailData.length === 0) {
                                this.isShowCheck = false
                            }
                        } else if (res.data.code === 10) {
                            this.checkDialog = true
                            this.checkMsg = res.data.msg
                            this.checkUrl = res.data.data.redirect_url
                        } else {
                            alert(res.data.msg)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            },
            // 撤回提交 单个或者批量
            revertSub (type, para) {
                // type 1 单个撤回  2 批量
                if (type === '1') {
                    this.$confirm(`您确定要撤回核销编号：${para.show_number} 的审核申请吗？`, '提示', {}).then(() => {
                        let data = [
                            {
                                business_type: para.business_type,
                                id: para.business_id,
                                deal_id: para.deal_id,
                                verify_status: para.verify_status
                            }
                        ]
                        let params = {
                            id: this.flowId,
                            list: data
                        }
                        this.axios.post('/backend-api/expand/ex-bank-flow/recall-submit', params).then((res) => {
                            if (res.data.code === 0) {
                                // 将数据加回到需要审核的表格中去  更新历史数据   更改财务审核状态
                                this.$set(para, 'iptVal', para.actual_money)
                                this.$set(para, 'verify_status', '0')
                                this.$set(para, 'verify_status_text', '等待提交')
                                this.$set(para, 'showTip', false)
                                this.$set(para, 'rangeTip', false)
                                // 处理合同预测阶段 实际回款日期字段不一致问题
                                para.content = para.pre_paid_content // 合同预测阶段
                                para.arrival_time = para.actual_datetime // 实际回款日期
                                // 剩余回款金额替换
                                para.unverified_money = res.data.data.business_info[0].unverified_money
                                // business_type为1的要换成forecast_id
                                if (para.business_type.toString() === '1') {
                                    para.business_id = para.forecast_id
                                    // 设置business_type值设置为3
                                    para.business_type = '3'
                                }
                                this.checkDetailData.push(para)
                                if (this.checkDetailData.length > 0 || this.unCheckDetailData.length > 0) {
                                    this.isShowCheck = true
                                }
                                this.getWaitData()
                                this.getHistory()
                            } else {
                                this.$message(res.data.msg);
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch(action => {
                    })
                } else if (type === '2') {
                    this.$confirm('您确定要批量撤回审核申请吗？', '提示', {}).then(() => {
                        let data = []
                        this.historyCheck.forEach((item) => {
                            let obj = {
                                business_type: item.business_type,
                                id: item.business_id,
                                deal_id: item.deal_id,
                                verify_status: item.verify_status
                            }
                            // 只传为true的字段
                            if (item.show_revoke) {
                                data.push(obj)
                            }
                        })
                        let params = {
                            id: this.flowId,
                            list: data
                        }
                        // 如果list无数据则不进行请求
                        if (params.list.length === 0) {
                            return;
                        }
                        this.axios.post('/backend-api/expand/ex-bank-flow/recall-submit', params).then((res) => {
                            if (res.data.code === 0) {
                                // 将数据加回到需要审核的表格中去  更新历史数据   更改财务审核状态
                                this.historyCheck.forEach((item, index) => {
                                    this.$set(item, 'iptVal', item.actual_money)
                                    this.$set(item, 'verify_status', '0')
                                    this.$set(item, 'verify_status_text', '等待提交')
                                    this.$set(item, 'showTip', false)
                                    this.$set(item, 'rangeTip', false)
                                    item.content = item.pre_paid_content // 合同预测阶段
                                    item.arrival_time = item.actual_datetime // 实际回款日期
                                    // 处理剩余回款金额
                                    const businessInfo = res.data.data.business_info;
                                    // 遍历返回的数组，确认是否为对应的数据之后再赋值
                                    businessInfo.forEach(ele => {
                                        if (item.business_id == ele.business_id && item.business_type == ele.business_type) {
                                            item.unverified_money = ele.unverified_money;
                                            this.checkDetailData.push(item);
                                        }
                                    });
                                    if (item.business_type.toString() === '1') {
                                        item.business_id = item.forecast_id
                                        item.business_type = '3'
                                    }
                                    // this.checkDetailData.push(item)
                                })
                                if (this.checkDetailData.length > 0 || this.unCheckDetailData.length > 0) {
                                    this.isShowCheck = true
                                }
                                this.getWaitData()
                                this.getHistory()
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch(action => {
                    })
                }
            },
            // 删除审核
            deleteSub (para) {
                this.$confirm(`您确定要删除核销编号：${para.show_number} 的审核申请吗？`, '提示', {}).then(() => {
                    let params = {
                        business_id: para.business_id,
                        business_type: para.business_type
                    }
                    this.axios.post('/backend-api/expand/ex-bank-flow/delete-payment', params).then((res) => {
                        if (res.data.code === 0) {
                            this.getHistory()
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch(action => {
                })
            },
            // 修改核销
            editCheck (para) {
                this.titleMsg = '修改回款信息'
                this.$set(para, 'showTip', false)
                this.$set(para, 'rangeTip', false)
                // 修改合同预测和实际回款日期字段不一致问题
                this.$set(para, 'content', para.pre_paid_content)
                this.$set(para, 'arrival_time', para.actual_datetime)
                this.showTopDialog = true
                this.editTag = 'editHistory'
                // 重新绑定iptVal 防止手动修改输入框，不提交，值不一致问题
                this.$set(para, 'iptVal', para.actual_money)
                this.$set(this.dialogData, 0, para)
            },
            // 修改核销成功
            historySuccess (para, changedMoney) {
                this.editTag = ''
                this.showTopDialog = false
                this.getHistory()
                // 数据回到审核详情 并设置审核状态和输入框的默认值
                if (changedMoney !== '') {
                    para.iptVal = changedMoney
                    para.actual_money = changedMoney
                }
                this.$set(para, 'verify_status', '0')
                this.$set(para, 'verify_status_text', '等待提交')
                this.checkDetailData.push(para)
                if (this.checkDetailData.length > 0) {
                    this.isShowCheck = true
                }
            },
            // 释放金额
            releaseMoney (type, index) {
                // type 1 单个释放  2 批量
                this.releaseDialog = true
                this.showLoading = false
                this.release.reason = ''
                this.aliyunArr = []
                this.releaseType = type
                this.releaseIndex = index
                let para = this.historyUncheck[index]
                if (type === '1') {
                    if (para.business_type.toString() === '2') {
                        this.release.title = `您确定要对成交单ID：${para.deal_id}的
                        核销记录（核销ID：${para.show_number}；实际回款金额：${para.actual_money}元） 操作释放金额吗？
                        若释放金额，请您填写释放原因。`
                    } else {
                        this.release.title = para.num === '' ? `您确定要对成交单ID：${para.deal_id}的
                        核销记录（核销ID：${para.show_number}；实际回款金额：${para.actual_money}元） 操作释放金额吗？
                        若释放金额，请您填写释放原因。` : `您确定要对成交单ID：${para.deal_id}的第${para.num}笔
                        合同预测的核销记录（核销ID：${para.show_number}；实际回款金额：${para.actual_money}元） 操作释放金额吗？
                        若释放金额，请您填写释放原因。`
                    }
                } else if (type === '2') {
                    this.release.title = '您确定要当前银行流水中所有已核销的金额吗？若您想操作"释放金额" 请您填写释放原因。'
                }
            },
            // 差额入库
            handleDiff (type) {
                let params = {
                    id: this.flowId,
                    type: type
                }
                this.axios.post('/backend-api/expand/ex-bank-flow/edit-margin', params).then((res) => {
                    if (res.data.code === 0) {
                        // 更新流水数据
                        this.getWaitData()
                        if (type === '1') {
                            this.isShowDiff = '2'
                        } else {
                            this.isShowDiff = '1'
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 查看凭证
            seeProof () {
                let routeData = this.$router.resolve({
                    path: "/payment/showVoucher",
                    query: {
                        flowId: this.flowId,
                        batchId: this.batchIds
                    }
                })
                window.open(routeData.href, '_blank')
            },
            // 查看驳回原因
            showReason (reason) {
                this.rejectReason = true
                this.reasonStr = reason
            },
            // 查看附件
            seeFile () {
                new Promise((resolve, reject) => {
                    this.axios.get('/backend-api/select2/select2/get-file-domain').then(res => {
                        if (res.data.code === 0) {
                            this.host = res.data.data.url
                            resolve()
                        }
                    })
                }).then(() => {
                    let params = {
                        id: this.flowId
                    }
                    this.axios.get('/backend-api/expand/ex-bank-flow/get-attachment', {params: params}).then((res) => {
                        if (res.data.code === 0) {
                            this.fileList = res.data.data.attach_list
                            this.$refs.file.openDialog()
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 关闭释放金额弹窗验证
            beforeRelease (done) {
                if (!this.showLoading) {
                    done()
                }
            },
            // 提交释放金额
            async submitRelease () {
                try {
                    this.showLoading = true;
                    let params = null;
                    // 根据类型判断构造的数据
                    if (this.releaseType === '1') {
                        // 单个释放
                        params = this.structureData(1);
                    } else if (this.releaseType === '2') {
                        // 批量释放
                        params = this.structureData(2);
                    }
                    // 如果list无数据则不进行请求
                    if (params.list.length === 0) {
                        return;
                    }
                    // 附件上传改为非必填项后 保存需要调用接口
                    // 如果没有附件，则直接请求后台保存
                    if (this.aliyunArr.length <= 0) {
                        this.releaseApprove(params);
                        return;
                    }
                    // 重新给附件字段赋值
                    params.attach_list = this.aliyunArr;
                    this.releaseApprove(params);
                } catch (err) {
                    console.log(err);
                    this.showLoading = false;
                }
            },
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @return
             */
            getFileURL(fileList) {
                // 关闭加载loading
                this.loading = false;
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                fileList.forEach(imgItem => {
                    if (this.aliyunArr.find(ele => ele.name === imgItem.originName)) {
                        this.$message('已过滤掉重复文件');
                    } else {
                        let obj = {
                            size: parseInt(imgItem.size / 1024),
                            path: imgItem.upURL,
                            fileURL: imgItem.fileURL,
                            name: imgItem.originName,
                            extension: imgItem.extension,
                            type: '2'
                        };
                        this.aliyunArr.push(obj);
                    }
                })
            },
            // 删除文件
            deleteFile (index) {
                this.aliyunArr.splice(index, 1)
            },
            // 前往修改流水信息
            goNewPage () {
                this.checkDialog = false
                window.open(this.checkUrl, '_blank')
            },
            /**
             * 释放金额审批请求
             * @param {Object} options 释放金额接口接收的对象参数
             */
            releaseApprove(options) {
                this.axios.post('/backend-api/expand/ex-bank-flow/release-money', options).then((res) => {
                    this.showLoading = false;
                    if (res.data.code === 0) {
                        this.releaseDialog = false;
                        // 更新历史
                        this.getHistory();
                    } else if (res.data.code === 1) {
                        // 弹出错误提示信息
                        this.$message(res.data.msg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            /**
             * 释放金额审批数据组装
             * @param {Number} type 是否是单个审批
             * @return {Object} 构造后的参数
             */
            structureData(type) {
                // 定义像后腰传递的表数据数组
                let data = [];
                let params = {};
                // 如果是单个释放 则取对应的list
                if (type === 1) {
                    this.historyUncheck = [this.historyUncheck[this.releaseIndex]];
                }
                this.historyUncheck.forEach((item) => {
                    let obj = {
                        business_type: item.business_type,
                        id: item.business_id,
                        deal_id: item.deal_id,
                        verify_status: item.verify_status
                    }
                    // 只传释放金额字段为ture的
                    if (item.show_free) {
                        data.push(obj);
                    }
                });
                if (data.length <= 0) {
                    this.$message('当前没有可以批量释放的数据');
                    return;
                }
                params = {
                    id: this.flowId,
                    list: data,
                    attach_list: this.aliyunArr,
                    reason: this.release.reason
                };
                return params;
            }
        },
        components: {
            WaitCheck,
            TopDialog,
            UploadVoucher,
            FinanceTable,
            CheckFile,
            RejectDialog
        },
        created () {
            this.flowId = this.$route.query.flowId
            this.batchId = this.$route.query.batchId;
            new Promise((resolve, reject) => {
                this.getWaitData(resolve)
            }).then((para) => {
                if (para) {
                    // 请求财务模块
                    let params = {
                        flow_id: this.flowId
                    }
                    this.axios.get('/backend-api/expand/ex-bank-flow/get-finance-payment', {params: params}).then((res) => {
                        if (res.data.code === 0) {
                            let resData = res.data.data.grid_data
                            resData.forEach((item) => {
                                let company = []
                                let money = []
                                item.invoice_list.forEach((item1) => {
                                    company.push(item1.begin_title)
                                    money.push(item1.money)
                                })
                                item.company = company
                                item.money = money
                                item.checkPass = false
                                item.checkReject = false
                                item.passDisable = false
                                item.rejectDisable = false
                                this.handleStatus(item)
                            })
                            let obj = {
                                data: resData,
                                showFile: res.data.data.show_see_attach
                            }
                            this.financeData = obj
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
            this.getHistory()
            this.getListData('init')
            this.getRemoteBuild()
            this.getRemotePeople()
            this.getSignCode();
        }
    }
</script>

<style lang="less" scoped>
    .payment-check {
        padding: 0 20px 20px;
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
        /deep/ .reset-border {
            border-top: 0 none;
        }
        .add button {
            background-color: transparent;
        }
        /deep/ .el-button--default {
            border: 1px solid #333;
            color: #333;
        }
        input[type="checkbox"] {
            -webkit-appearance: checkbox;
            width: 16px;
            height: 16px;
        }
        .s-query {
            overflow: hidden;
            > li.w-auto {
                width: auto;
            }
        }
        .btn-reset {
            color: #333;
            border: 1px solid #333;
            margin-right: 15px;
            cursor: pointer;
        }
        .btn-search {
            background: #333;
            color: #fff;
            border: 1px solid #333;
            margin-left: 15px;
            cursor: pointer;
        }
        .add {
            text-align: right;
            padding-right: 20px;
            margin-bottom: 20px;
            .btn {
                background-color: transparent;
                border: 1px solid #333;
            }
        }
        .link {
            color: blue;
            text-decoration: underline;
        }
        .page-btn {
            padding-right: 20px;
            text-align: right;
        }
        /deep/ .display-tb {
            margin-bottom: 20px;
        }
        .page-btn .btn {
            background-color: #1662b3;
            border: 1px solid #1662b3;
            color: #fff;
        }
        .page-btn .btn:first-child {
            margin-right: 20px;
        }
        .fake-check {
            position: relative;
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 2px;
            border: 1px solid #ccc;
        }
        .selected {
            background-color: #409eff;
            border: 1px solid #409eff;
        }
        .el-icon-check {
            position: absolute;
            left: 0;
            top: 0;
            color: #fff;
            font-size: 16px;
        }
        .is-check {
            .check-tb {
                margin-bottom: 20px;
            }
        }
        .clear {
            text-align: right;
            font-size: 16px;
            color: blue;
            cursor: pointer;
            margin-bottom: 10px;
        }
        .sub-check {
            text-align: right;
            font-size: 16px;
            color: blue;
            margin-top: 10px;
            span {
                cursor: pointer;
            }
        }
        .un-need {
            margin-bottom: 20px;
        }
        /deep/ .el-button + .el-button {
            margin-left: 0;
        }
        /deep/ .el-button--mini, .el-button--mini.is-round {
            padding: 6px;
        }
        .define-table {
            margin-bottom: 20px;
            min-width: 100%;
            tr {
                background-color: #FFF;
            }
            thead {
                background-color: #fff;
            }
            td, th {
                > div {
                    padding: 0 10px;
                    margin: 0 auto;
                    word-break: break-all;
                }
                text-align: center;
                font-size: 14px;
                border: 1px solid #EBEEF5;
                padding: 12px 0;
                min-width: 0;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
            }
        }
        .define-tb-wrap {
            max-width: 100%;
            overflow-x: auto;
            .w-80 {
                width: 80px;
            }
            .w-100 {
                width: 100px;
            }
            .w-120 {
                width: 120px;
            }
            .w-200 {
                width: 200px;
            }
        }
        .search-box .s-query > li {
            height: 41px;
        }
        .reason-dia .reason-content {
            overflow: hidden;
            word-break: break-all;
        }
        .reason-dia .reject-content {
            overflow: hidden;
        }
        /deep/ .reason-dia .el-dialog__body {
            padding: 0 20px 10px;
        }
        /deep/ .reason-dia {
            .el-dialog__header {
                padding-bottom: 0;
                > h2 {
                    border-bottom: 1px solid #edeff0;
                    height: 46px;
                    line-height: 46px;
                }
            }
        }
        /deep/ .reject {
            .el-dialog__header {
                > h2 {
                    border-bottom: 1px solid #edeff0;
                    height: 46px;
                    line-height: 46px;
                }
            }
            .el-dialog__body {
                padding: 0 20px;
            }
            .reject-body {
                max-height: 500px;
                overflow: auto;
                textarea {
                    height: 120px;
                    width: 100%;
                }
                .s-query {
                    margin-top: 15px;
                    > li {
                        float: none;
                        width: auto;
                        margin: 0;
                        .th {
                            width: auto;
                        }
                    }
                }
            }
            .reject-btn {
                position: relative;
                text-align: right;
                .close-reject {
                    color: #333;
                    border: 1px solid #333;
                    margin-right: 15px;
                }
                .submit-reject {
                    background: #337ab7;
                    color: #fff;
                    border: 1px solid #337ab7;
                    margin-left: 15px;
                }
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
            -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            width: 100%;
        }
        .text-area:focus {
            border-color: #409eff;
            outline: 0;
        }
        .reject {
            .el-icon-upload {
                font-size: 30px;
            }
            .list-item {
                line-height: 30px;
                .delete {
                    color: #409eff;
                    cursor: pointer;
                }
            }
        }
    }
</style>
