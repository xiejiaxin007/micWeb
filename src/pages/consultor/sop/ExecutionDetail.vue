<template>
    <div class="execution-container">
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>执行力详情页</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box rules-wrap"
            v-if="headData && headData.is_show == 1">
            <div class="hd">
                <h2>
                    <span class="iconfont icongantanhao-yuankuang"></span>
                    {{headData.year}}年{{headData.month}}月执行力绩效的公告</h2>
            </div>
            <div class="bd">
                <div class="bd-con-show">
                    <div
						class="conclude"
                        v-if="headData.sop_edition === '2'">
                        <div class="txt">
                            {{headData.year}}年{{headData.month}}月，您的执行力绩效得分为{{headData.score}}分，城市排名为{{headData.ranking > 0 ? headData.ranking : '暂无排名'}}，占资金池比例为{{headData.ratio}}%
                        </div>
                    </div>
                    <div class="conclude"
                        v-else>
                        <div class="txt"
                            v-if="headData.ratio == 0">{{headData.year}}年{{headData.month}}月，您的执行力绩效得分为：0分</div>
                        <div class="txt"
                            v-else>{{headData.year}}年{{headData.month}}月，您的执行力绩效得分为：{{headData.score}}分（全国执行力绩效排名前20%的分数线 = {{headData.score_line}}）；<span v-if="headData.ratio > 100">恭喜您，进入优秀行列。</span> 感谢您的认真工作和付出，本月执行力绩效将按照{{headData.ratio}}%发放。</div>
                    </div>
                    <div class="drop-down-box"
                        @click="compRules">
                        <span class="text">执行力绩效发放比例计算规则</span>
                        <span class="iconfont icontop-triangle"
                            v-if="hideCompRules"></span>
                        <span class="iconfont icon-xialajiantou"
                            v-else></span>
                    </div>
                </div>
                <div class="bd-con-hide"
                    v-if="hideCompRules"
                    ref="ruleWrap">
                    <div class="bd-con-hide-tit">
                        <h3>执行力绩效发放比例计算规则</h3>
                    </div>
                    <div class="bd-con-hide-body"
                        v-if="!sop2">
                        <ul class="s-query">
                            <li class="auto ">
                                <span class="txt">1、当执行力得分 大于 全国执行力绩效排名前20%的分数线（且在本月上半月完成培训），本执行力绩效将按照120%发放。</span>
                            </li>
                            <li class="auto ">
                                <span class="txt">2、当执行力得分 大于 全国执行力绩效排名前20%的分数线（且在本月下半月完成培训），本执行力绩效将按照100%发放。</span>
                            </li>
                            <li class="auto ">
                                <span class="txt">3、当执行力得分 小于 全国执行力绩效排名前20%的分数线，本月执行力绩效将按照&lt;分数/2000&gt;发放。 </span> </li>
                        </ul>
                        <ul class="s-query">
                            <li class="auto ">
                                <span class="txt txt-title">PS：其他细节说明</span>
                            </li>
                            <li class="auto ">
                                <span class="txt">1)、全国执行力绩效排名前20%的排名是按照不包含培训期学员计算的。</span>
                            </li>
                            <li class="auto ">
                                <span class="txt">2)、执行力得分为“0”时，发放比例=“0/2000”=0%。</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bd-con-hide-body"
                        v-if="sop2">
                        <ul class="s-query">
                            <li class="auto ">
                                <span class="txt">1、执行力分数由加分和减分组成，代表咨询师当月的执行力表现情况；执行力的综合得分=基础分数（折算出勤）+加分项得分-减分项得分。</span>
                            </li>
                            <li class="auto ">
                                <span class="txt">2、根据综合得分，在核算城市内进行排名，根据排名高低，折算占资金池比例，最终发放金额=占资金池比例*资金池。</span>
                            </li>
                            <li class="auto ">
                                <span class="txt">3、排名靠前的三位咨询师，会额外发放奖金，根据城市配置情况发放。 </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="v-box">
            <div class="hd">
                <h2>执行力详情</h2>
                <div class="tip"
                    v-if="sop2">基础分为1500分，最终得分=基础分*全勤度+加分标签分数-减分标签分数；咨询师在月底结算时，根据最终得分计算城市排名，计算最终奖金</div>
                <div class="tip"
                    v-else>总分2000分，当被打上执行力不合格标签，会依据业务发生时间所在月的相应的标签规则扣分，本月得分=2000-标签创建时间在本月的标签扣分</div>
            </div>
            <div class="bd">
                <div class="conclude">
                    <ul class="s-query">
                        <li v-if="sop2 && top3[0]">
                            当前城市第一名: {{top3[0].employee_name}} 得分
                            <span>{{top3[0].score}}</span>
                        </li>
                        <li v-if="sop2 && top3[1]">
                            第二名:{{top3[1].employee_name}} 得分
                            <span>{{top3[1].score}}</span>
                        </li>
                        <li v-if="sop2 && top3[2]">
                            第三名:{{top3[2].employee_name}} 得分
                            <span>{{top3[2].score}}</span>
                        </li>
                        <li class="auto"></li>
                        <li>
                            本月得分:
                            <span class="red"
                                v-if="score">{{score}}</span>
                        </li>
                        <li v-if="!sop2">
                            <span v-if="empName">{{empName}}</span>打败了<span class="red"
                                v-if="rate">{{rate}}%</span> 的咨询师；
                        </li>
                        <li>
                            当前城市排名:<span class="blue"
                                v-if="rank > 0">第{{rank}}名</span>
                            <span class="blue"
                                v-else>暂无排名</span>
                        </li>
                        <li v-if="sop2 && isShowBonus === 1">
                            预计本月奖金: <span>{{bonus}}</span>元
                        </li>
                        <li class="auto warn"
                            v-if="sop2 && increaseTagList.length > 0">
                            <div class="warn-left">
                                <div class="td">当前加分标签共
                                    <span v-if="increaseTagList[0]">【{{increaseTagList[0].tag_name}}】</span>
                                    <span v-if="increaseTagList[1]">【{{increaseTagList[1].tag_name}}】</span>
                                    <span v-if="increaseTagList[2]">【{{increaseTagList[2].tag_name}}】</span>
                                    <el-button type="text"
                                        @click="toTagDetail">点击查看更多</el-button>
                                </div>
                            </div>
                        </li>
                        <li class="auto warn">
                            <div class="warn-left">
                                <div class="th required"></div>
                                <div class="td">如果发现执行力标签出现错误，请先进行核实，确认后将标签ID反馈给主管，并由主管统一反馈申诉</div>
                            </div>
                            <div class="warn-right">
                                <div class="block">
                                    <el-date-picker v-model="checkTargetData"
                                        type="month"
                                        @change="reloadData"
                                        :picker-options="pickerOptions"
                                        placeholder="选择月">
                                    </el-date-picker>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="execution-con"
            v-if="resultData">
            <div class="v-box">
                <div class="hd">
                    <h2 v-if="sop2">标签记录详情</h2>
                    <h2 v-else>违规记录详情</h2>
                    <div class="tip tip-black"
                        v-if="sop2">第{{currentStart}}-{{currentEnd}}条标签记录，共{{totalSum}}条标签记录</div>
                    <div class="tip tip-black"
                        v-else>第{{currentStart}}-{{currentEnd}}条违规标签记录，共{{totalSum}}条违规标签记录</div>

                </div>
                <div class="bd">
                    <div class="tag-tips">进行SOP标签申诉时，请核对扣分详情，扣分为0的标签ID无需申诉，仅申诉有扣分的标签即可</div>
                    <div class="tag-container">
                        <div class="tag-con-item">
                            <div class="tag-wrap">
                                <div class="tag-name">
                                    <button class="btn tag-btn tg-it balance-tag">差额</button>
                                    <span class="tg-it">标签业务发生时间不在当月的，举例：2018-10-2补录带看时判断不符合规则打带看迟到标签，实际带看时间是2018-09-30，即业务发生时间应该为2018-9-30</span>
                                </div>
                            </div>
                            <tableBox :uid="empId"
                                @freshTb="freshTb"
                                @transPoint="transPoint"
                                :tableData="balance.list"
                                :tableLabel="balance.title"
                                :isHideHandle="true"></tableBox>
                        </div>
                        <div class="tag-con-item"
                            v-for="(tag, index) in tagList"
                            :key="index"
                            v-if="tagList.length > 0">
                            <div class="tag-wrap">
                                <div class="tag-name">
                                    <button class="btn tag-btn tg-it"
                                        @mouseenter="conShowDesc($event,tag.tag_config.model_value,tag.tag_config.track_id)"
                                        @mouseout="conHideDesc($event,tag.tag_config.model_value)">{{tag.tag_config.tag_name}}</button>
                                    <span class="tg-it red"
                                        v-if="tag.tag_config.model_value=='YwOrderBusinessTags_241'">注：如因通话时长少于20秒被打标签，如符合正常情况，系统会在每天晚上凌晨跑数据取消标签</span>
                                    <div class="describe-box">
                                        <i class="arrow" aria-hidden="true"></i>
                                        <ul class="s-query">
                                            <li>
                                                <div class="th required">标签规则</div>
                                            </li>
                                            <li>
                                                {{tag.tag_config.desc}}
                                            </li>
                                            <li v-if="sop2 && tag.scores.tag_type === 1">
                                                <div class="th required">扣分规则</div>
                                                <div class="td">阶梯式扣分，每上升一个阶梯，单次扣分增加{{tag.tag_config.floatation_ratio}}，依次类推</div>
                                            </li>
                                        </ul>
                                        <table class="popTable"
                                            v-if="sop2 && tag.scores.tag_type === 1">
                                            <tbody>
                                                <tr class="tbHead">
                                                    <td>错误次数</td>
                                                    <td v-for="(item, index) in countPopMark(tag.tag_config.protect_num, tag.tag_config.step_range, tag.tag_config.first_score, tag.tag_config.floatation_ratio).titData"
                                                        :key="index">{{item}}</td>
                                                </tr>
                                                <tr>
                                                    <td>扣除分数</td>
                                                    <td v-for="(item, index) in countPopMark(tag.tag_config.protect_num, tag.tag_config.step_range, tag.tag_config.first_score, tag.tag_config.floatation_ratio).tdData"
                                                        :key="index">{{item}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <ul class="record-data">
                                    <li>
                                        {{sop2 ? '次数：' : '违规次数：'}}
                                        <span class="red">{{tag.scores.count}}次</span>
                                    </li>
                                    <li>
                                        {{sop2 ? '分数：' : '扣除分数：'}}
                                        <span class="red">{{tag.scores.score}}分</span>
                                    </li>
                                    <li v-if="sop2">
                                        标签类型：
                                        <span class="red">{{tag.scores.tag_type === 1 ? '减分标签' : '加分标签'}}</span>
                                    </li>
                                </ul>
                            </div>
                            <tableBox @transPoint="transPoint"
                                @freshTb="freshTb"
                                :uid="empId"
                                :tagConfig="tag.tag_config"
                                :tagConfigId="tag.tag_config.id"
                                :tableData="dispose(tag.list)"
                                :tableLabel="tag.title"
                                :isHideHandle="true"></tableBox>
                        </div>
                    </div>
                    <div class="pagination"
                        v-if="totalSum !==0 ">
                        <el-pagination background
                            layout="prev, pager, next"
                            :page-size="pageSize"
                            :current-page.sync="currentPage"
                            @current-change="pageChange"
                            :total="totalSum">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { commonFun } from '@/assets/js/utils/utils';
    import { TableBox, Map } from './components';
    export default {
        name: 'executionDetail',
        data() {
            return {
                currentPage: 1, // 当前页
                leftPage: 0, // 整除外的数据
                pageNum: 0, // 页数
                pageSize: 10, // 一页多少条数据
                checkTargetData: '', // 选择日期
                totalSum: 0, // 共多少条数据
                currentStart: 0, // 当前从多少条开始
                currentEnd: 0, // 当前页多少结束
                pickerOptions: {
                    // 日期选择 不能选当月以后
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                hideCompRules: false, // 默认不展开计算规则
                parseTime: '', // 转换后的time
                score: '', // 本月得分
                rank: '', // 排名
                rate: '', // 打败率
                employee_id: '', // 咨询师id
                page: 1, // 页数 默认第一页
                tagList: [], // 标签列表
                balance: {}, // 差额
                headData: {}, // 头部数据
                empId: '', // 咨询师id
                empName: '', // 咨询师名称
                resultData: true,
                sop2: false, // 是否配置新规则
                top3: [], // 前三名
                bonus: '', // 预计本月奖金
                isShowBonus: '', // 是否展示预计奖金 1展示 2不展示
                increaseTagList: []
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.initPara();
            });
        },
        methods: {
            // 查看更多加分标签
            toTagDetail() {
                this.$router.push({
                    path: 'executionTagDetail'
                });
            },
            dispose(para) {
                let arr = [];
                if (Array.isArray(para)) {
                    arr = para;
                } else if (Array.isArray(para) === false && para !== 'undefined') {
                    for (let index in para) {
                        arr.push(para[index]);
                    }
                }
                return arr;
            },
            initPara() {
                if (this.$route.query.employee_id) {
                    this.empId = this.$route.query.employee_id;
                } else {
                    this.empId = this.uid;
                }
                if (this.$route.query.time) {
                    this.checkTargetData = new Date(this.$route.query.time);
                } else {
                    // 默认是当前月份
                    this.checkTargetData = new Date();
                }
                this.filterData();
                this.getData();
            },
            // 计算悬浮层表格数据
            countPopMark(a, b, c, d) {
                // a:保护次数 b:阶梯范围 c:初始扣分 d:上浮等差
                let obj = {};
                let titData = [];
                let tdData = [];
                if (a === 0) {
                    for (let i = 0; i < 4; i++) {
                        let it = (i * b === 0 ? 1 : i * b + 1) + '-' + b * (i + 1);
                        let bt = '每次扣' + (c + d * i) + '分';
                        titData.push(it);
                        tdData.push(bt);
                    }
                } else {
                    for (let i = 0; i < 4; i++) {
                        let it;
                        let bt;
                        i === 0 ? (it = 0 + '-' + a) : (it = a + b * (i - 1) + 1 + '-' + (a + b * i));
                        i === 0 ? (bt = '不扣分') : (bt = '每次扣' + (c + d * (i - 1)) + '分');
                        titData.push(it);
                        tdData.push(bt);
                    }
                }
                obj = {
                    titData: titData,
                    tdData: tdData
                };
                return obj;
            },
            // 悬浮层收起文案
            conHideDesc(para, model, trakid) {
                let descBox = para.currentTarget.parentElement.querySelector('.describe-box');
                descBox.style.display = 'none';
            },
            // 悬浮层展开文案
            conShowDesc(para, model, trakid) {
                let descBox = para.currentTarget.parentElement.querySelector('.describe-box');
                descBox.style.display = 'block';
                commonFun.setTrackMenu(trakid, {});
            },
            // 刷新表格
            freshTb() {
                this.getData();
            },
            // 查看执行力详情绩效规则
            compRules() {
                if (!this.hideCompRules) {
                    this.hideCompRules = true;
                } else {
                    this.hideCompRules = false;
                }
            },
            // 转换时间
            filterData() {
                var d = new Date(this.checkTargetData);
                var parseData = d.getFullYear() + '-' + (d.getMonth() + 1);
                this.parseTime = parseData;
                // 将转换好的数据 发送给后台  具体格式 看他们需要什么  这里请求切换月份后的数据 格式为2019-3
            },
            // 切换时间 重新请求数据
            reloadData() {
                this.filterData();
                this.getData();
            },
            // 请求数据
            getData() {
                var params = {
                    time: this.parseTime,
                    page: this.currentPage,
                    employee_id: this.empId
                };
                this.axios
                    .post('/backend-api/bk-api-tag-manage/view', params)
                    .then(res => {
                        if (res.data.code === 0) {
                            let resData = res.data.data;
                            if (JSON.stringify(resData) == '{}') {
                                this.resultData = false;
                                return;
                            } else {
                                this.resultData = true;
                            }
                            this.score = resData.score;
                            this.rank = resData.rank;
                            this.rate = resData.rate;
                            this.empName = resData.employee_name;
                            this.totalSum = resData.counts;
                            // 先置空 防止缓存
                            this.tagList = [];
                            this.tagList = resData.detail;
                            this.balance = resData.other_detail;
                            this.headData = resData.ratios;
                            this.sop2 = resData.sop2;
                            this.top3 = resData.top3;
                            this.bonus = resData.bonus;
                            this.isShowBonus = resData.is_show_bonus;
                            this.increaseTagList = resData.increase_tag_list;
                            // 更新表格信息
                            this.getTableData();
                            // 计算悬浮层中表格数据
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            // 点击分页
            pageChange(page) {
                this.currentPage = page;
                if (this.leftPage === 0) {
                    this.currentStart = (this.currentPage - 1) * this.pageSize + 1;
                    this.currentEnd = this.currentPage * this.pageSize;
                } else {
                    if (this.currentPage === this.pageNum) {
                        // 最后一页
                        this.currentStart = (this.currentPage - 1) * this.pageSize + 1;
                        this.currentEnd = this.currentStart - 1 + this.leftPage;
                    } else {
                        // 不是最后一页
                        this.currentStart = (this.currentPage - 1) * this.pageSize + 1;
                        this.currentEnd = this.currentPage * this.pageSize;
                    }
                }
                this.getData();
            },
            // 表格数据处理
            getTableData() {
                var _this = this;
                if (_this.totalSum !== 0) {
                    _this.pageNum = Math.ceil(_this.totalSum / _this.pageSize); // 计算一共多少页
                    _this.leftPage = parseInt(_this.totalSum % _this.pageSize); // 计算最后一页剩余多少条数据，可能为0，也可能为其他值
                    if (_this.pageNum === 1) {
                        // 如果只有一页的数据
                        _this.currentStart = 1;
                        _this.currentEnd = _this.totalSum;
                    } else {
                        if (_this.currentPage === 1) {
                            // 多页数据时，第一页显示
                            _this.currentStart = 1;
                            _this.currentEnd = _this.pageSize;
                        }
                    }
                } else {
                    _this.totalSum = 0; // 总数据条数为0
                    _this.currentStart = 0; // 从第几条开始为0
                    _this.currentEnd = 0; // 到第几条为0
                    _this.currentPage = 1; // 重置默认值
                    _this.isPage = false; // 没有数据，隐藏分页
                }
            },
            // 接收表格传出的track_id
            transPoint(track) {
                commonFun.setTrackMenu(track, {});
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #f9f9f9;color: #333;';
                }
            }
        },
        components: { TableBox, Map },
        computed: {
            ...mapState(['trackInfos', 'uid'])
        }
    };
</script>

<style scoped>
.execution-container {
    padding: 0 15px;
}
.execution-container .tip {
    float: left;
    font-size: 12px;
    color: #ff0000;
    line-height: 46px;
    margin-left: 10px;
}
.execution-container .tip-black {
    color: #3a3a3a;
}
.execution-container .red {
    color: #ff0000;
}
.execution-container .blue {
    color: #2297f0;
}
.tag-con-item {
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
}
.tag-wrap,
.tag-name {
    margin-bottom: 20px;
}
.tag-name {
    position: relative;
    min-height: 34px;
}
.describe-box {
    position: absolute;
    left: 0;
    top: 45px;
    z-index: 20;
    width: 450px;
    border: 1px solid #ddd;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 4px 0 rgba(153, 153, 153, 0.62);
    box-shadow: 0 2px 4px 0 rgba(153, 153, 153, 0.62);
    padding: 26px 20px 21px 20px;
    display: none;
}
.describe-box .arrow:before {
    content: '';
    border: 6px solid transparent;
    border-bottom-color: #ddd;
    position: absolute;
    left: 50px;
    top: 7px;
    margin-top: -20px;
}
.describe-box .arrow:after {
    content: '';
    border: 6px solid transparent;
    border-bottom-color: white;
    position: absolute;
    top: 7px;
    left: 50px;
    margin-top: -19px;
}
.describe-box li {
    width: auto;
    line-height: 24px;
    float: none;
    overflow: hidden;
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
}
.describe-box .th {
    height: auto;
    width: auto;
    font-size: 16px;
    color: #151515;
    line-height: 25px;
    margin-right: 10px;
}
.describe-box .td {
    font-size: 12px;
    color: #666666;
    line-height: 26px;
    margin-left: 10px;
}
.tag-name > .tg-it {
    float: left;
}
.tag-name > span.tg-it {
    margin-left: 20px;
    line-height: 34px;
}
.tag-btn {
    border: 1px solid #2297f0;
    border-radius: 4px;
    font-size: 14px;
    color: #2297f0;
    background-color: transparent;
}
.record-data {
    overflow: hidden;
}
.record-data li {
    float: left;
    margin-right: 20px;
}
.conclude {
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 14px;
}
.conclude li {
    width: auto;
    float: left;
    margin-right: 50px;
    margin-bottom: 0;
}
.conclude li.auto {
    width: 100%;
    clear: both;
}
.conclude .warn-left {
    float: left;
}
.conclude .warn-right {
    float: right;
}
.conclude .th {
    width: auto;
}
.rules-wrap .icongantanhao-yuankuang {
    color: #fe974a;
    font-size: 23px;
    position: relative;
    top: 2px;
}
.execution-container .drop-down-box {
    float: right;
    margin-bottom: 10px;
    color: #2e9ae1;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    vertical-align: middle;
}
.bd-con-show {
    overflow: hidden;
}
.bd-con-hide-tit {
    padding: 15px 0;
    border-top: 1px solid #ccc;
}
.bd-con-hide-tit > h3 {
    font-size: 15px;
    margin: 10px 0;
    color: #2e9ae1;
}
.bd-con-hide-tit > h3:before {
    content: '';
    display: inline-block;
    height: 14px;
    width: 3px;
    margin-right: 5px;
    vertical-align: bottom;
    background-color: #2e9ae1;
}
.bd-con-hide-body .s-query .txt {
    font-size: 14px;
    color: #666;
}
.tag-container {
    padding-bottom: 20px;
}
.pagination {
    text-align: center;
    padding-bottom: 20px;
    background: #fff;
}
.table td {
    border: none;
}
.execution-container .popTable {
    width: 100%;
    margin-bottom: 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    color: #888888;
}
.execution-container .popTable td {
    padding: 2px 5px;
    border: 1px solid #ddd;
}
.popTable .tbHead {
    text-align: center;
    background-color: #f9f9f9;
}
.balance-tag {
    color: #333;
    border-color: #ccc;
}
</style>
