(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2367c1a8"],{1348:function(t,a,e){"use strict";e.r(a);var s=e("5374"),i=e("d06c");for(var o in i)["default"].indexOf(o)<0&&function(t){e.d(a,t,(function(){return i[t]}))}(o);e("4de49");var n=e("2877"),r=Object(n.a)(i.default,s.a,s.b,!1,null,"36df2190",null);a.default=r.exports},"475e":function(t,a,e){var s=e("8d7c");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);(0,e("499e").default)("3c5357d2",s,!0,{sourceMap:!1,shadowMode:!1})},"4de49":function(t,a,e){"use strict";e("475e")},5374:function(t,a,e){"use strict";e.d(a,"a",(function(){return s})),e.d(a,"b",(function(){return i}));var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"execution-container"},[e("el-breadcrumb",{staticClass:"bread-crumb-box",attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",[e("a",{attrs:{href:"/"}},[t._v("首页")])]),e("el-breadcrumb-item",[t._v("执行力详情页")])],1),t.headData&&1==t.headData.is_show?e("div",{staticClass:"v-box rules-wrap"},[e("div",{staticClass:"hd"},[e("h2",[e("span",{staticClass:"iconfont icongantanhao-yuankuang"}),t._v(" "+t._s(t.headData.year)+"年"+t._s(t.headData.month)+"月执行力绩效的公告")])]),e("div",{staticClass:"bd"},[e("div",{staticClass:"bd-con-show"},["2"===t.headData.sop_edition?e("div",{staticClass:"conclude"},[e("div",{staticClass:"txt"},[t._v(" "+t._s(t.headData.year)+"年"+t._s(t.headData.month)+"月，您的执行力绩效得分为"+t._s(t.headData.score)+"分，城市排名为"+t._s(t.headData.ranking>0?t.headData.ranking:"暂无排名")+"，占资金池比例为"+t._s(t.headData.ratio)+"% ")])]):e("div",{staticClass:"conclude"},[0==t.headData.ratio?e("div",{staticClass:"txt"},[t._v(t._s(t.headData.year)+"年"+t._s(t.headData.month)+"月，您的执行力绩效得分为：0分")]):e("div",{staticClass:"txt"},[t._v(t._s(t.headData.year)+"年"+t._s(t.headData.month)+"月，您的执行力绩效得分为："+t._s(t.headData.score)+"分（全国执行力绩效排名前20%的分数线 = "+t._s(t.headData.score_line)+"）；"),t.headData.ratio>100?e("span",[t._v("恭喜您，进入优秀行列。")]):t._e(),t._v(" 感谢您的认真工作和付出，本月执行力绩效将按照"+t._s(t.headData.ratio)+"%发放。")])]),e("div",{staticClass:"drop-down-box",on:{click:t.compRules}},[e("span",{staticClass:"text"},[t._v("执行力绩效发放比例计算规则")]),t.hideCompRules?e("span",{staticClass:"iconfont icontop-triangle"}):e("span",{staticClass:"iconfont icon-xialajiantou"})])]),t.hideCompRules?e("div",{ref:"ruleWrap",staticClass:"bd-con-hide"},[t._m(0),t.sop2?t._e():e("div",{staticClass:"bd-con-hide-body"},[t._m(1),t._m(2)]),t.sop2?e("div",{staticClass:"bd-con-hide-body"},[t._m(3)]):t._e()]):t._e()])]):t._e(),e("div",{staticClass:"v-box"},[e("div",{staticClass:"hd"},[e("h2",[t._v("执行力详情")]),t.sop2?e("div",{staticClass:"tip"},[t._v("基础分为1500分，最终得分=基础分*全勤度+加分标签分数-减分标签分数；咨询师在月底结算时，根据最终得分计算城市排名，计算最终奖金")]):e("div",{staticClass:"tip"},[t._v("总分2000分，当被打上执行力不合格标签，会依据业务发生时间所在月的相应的标签规则扣分，本月得分=2000-标签创建时间在本月的标签扣分")])]),e("div",{staticClass:"bd"},[e("div",{staticClass:"conclude"},[e("ul",{staticClass:"s-query"},[t.sop2&&t.top3[0]?e("li",[t._v(" 当前城市第一名: "+t._s(t.top3[0].employee_name)+" 得分 "),e("span",[t._v(t._s(t.top3[0].score))])]):t._e(),t.sop2&&t.top3[1]?e("li",[t._v(" 第二名:"+t._s(t.top3[1].employee_name)+" 得分 "),e("span",[t._v(t._s(t.top3[1].score))])]):t._e(),t.sop2&&t.top3[2]?e("li",[t._v(" 第三名:"+t._s(t.top3[2].employee_name)+" 得分 "),e("span",[t._v(t._s(t.top3[2].score))])]):t._e(),e("li",{staticClass:"auto"}),e("li",[t._v(" 本月得分: "),t.score?e("span",{staticClass:"red"},[t._v(t._s(t.score))]):t._e()]),t.sop2?t._e():e("li",[t.empName?e("span",[t._v(t._s(t.empName))]):t._e(),t._v("打败了"),t.rate?e("span",{staticClass:"red"},[t._v(t._s(t.rate)+"%")]):t._e(),t._v(" 的咨询师； ")]),e("li",[t._v(" 当前城市排名:"),t.rank>0?e("span",{staticClass:"blue"},[t._v("第"+t._s(t.rank)+"名")]):e("span",{staticClass:"blue"},[t._v("暂无排名")])]),t.sop2&&1===t.isShowBonus?e("li",[t._v(" 预计本月奖金: "),e("span",[t._v(t._s(t.bonus))]),t._v("元 ")]):t._e(),t.sop2&&t.increaseTagList.length>0?e("li",{staticClass:"auto warn"},[e("div",{staticClass:"warn-left"},[e("div",{staticClass:"td"},[t._v("当前加分标签共 "),t.increaseTagList[0]?e("span",[t._v("【"+t._s(t.increaseTagList[0].tag_name)+"】")]):t._e(),t.increaseTagList[1]?e("span",[t._v("【"+t._s(t.increaseTagList[1].tag_name)+"】")]):t._e(),t.increaseTagList[2]?e("span",[t._v("【"+t._s(t.increaseTagList[2].tag_name)+"】")]):t._e(),e("el-button",{attrs:{type:"text"},on:{click:t.toTagDetail}},[t._v("点击查看更多")])],1)])]):t._e(),e("li",{staticClass:"auto warn"},[t._m(4),e("div",{staticClass:"warn-right"},[e("div",{staticClass:"block"},[e("el-date-picker",{attrs:{type:"month","picker-options":t.pickerOptions,placeholder:"选择月"},on:{change:t.reloadData},model:{value:t.checkTargetData,callback:function(a){t.checkTargetData=a},expression:"checkTargetData"}})],1)])])])])])]),t.resultData?e("div",{staticClass:"execution-con"},[e("div",{staticClass:"v-box"},[e("div",{staticClass:"hd"},[t.sop2?e("h2",[t._v("标签记录详情")]):e("h2",[t._v("违规记录详情")]),t.sop2?e("div",{staticClass:"tip tip-black"},[t._v("第"+t._s(t.currentStart)+"-"+t._s(t.currentEnd)+"条标签记录，共"+t._s(t.totalSum)+"条标签记录")]):e("div",{staticClass:"tip tip-black"},[t._v("第"+t._s(t.currentStart)+"-"+t._s(t.currentEnd)+"条违规标签记录，共"+t._s(t.totalSum)+"条违规标签记录")])]),e("div",{staticClass:"bd"},[e("div",{staticClass:"tag-tips"},[t._v("进行SOP标签申诉时，请核对扣分详情，扣分为0的标签ID无需申诉，仅申诉有扣分的标签即可")]),e("div",{staticClass:"tag-container"},[e("div",{staticClass:"tag-con-item"},[t._m(5),e("tableBox",{attrs:{uid:t.empId,tableData:t.balance.list,tableLabel:t.balance.title,isHideHandle:!0},on:{freshTb:t.freshTb,transPoint:t.transPoint}})],1),t._l(t.tagList,(function(a,s){return t.tagList.length>0?e("div",{key:s,staticClass:"tag-con-item"},[e("div",{staticClass:"tag-wrap"},[e("div",{staticClass:"tag-name"},[e("button",{staticClass:"btn tag-btn tg-it",on:{mouseenter:function(e){return t.conShowDesc(e,a.tag_config.model_value,a.tag_config.track_id)},mouseout:function(e){return t.conHideDesc(e,a.tag_config.model_value)}}},[t._v(t._s(a.tag_config.tag_name))]),"YwOrderBusinessTags_241"==a.tag_config.model_value?e("span",{staticClass:"tg-it red"},[t._v("注：如因通话时长少于20秒被打标签，如符合正常情况，系统会在每天晚上凌晨跑数据取消标签")]):t._e(),e("div",{staticClass:"describe-box"},[e("i",{staticClass:"arrow",attrs:{"aria-hidden":"true"}}),e("ul",{staticClass:"s-query"},[t._m(6,!0),e("li",[t._v(" "+t._s(a.tag_config.desc)+" ")]),t.sop2&&1===a.scores.tag_type?e("li",[e("div",{staticClass:"th required"},[t._v("扣分规则")]),e("div",{staticClass:"td"},[t._v("阶梯式扣分，每上升一个阶梯，单次扣分增加"+t._s(a.tag_config.floatation_ratio)+"，依次类推")])]):t._e()]),t.sop2&&1===a.scores.tag_type?e("table",{staticClass:"popTable"},[e("tbody",[e("tr",{staticClass:"tbHead"},[e("td",[t._v("错误次数")]),t._l(t.countPopMark(a.tag_config.protect_num,a.tag_config.step_range,a.tag_config.first_score,a.tag_config.floatation_ratio).titData,(function(a,s){return e("td",{key:s},[t._v(t._s(a))])}))],2),e("tr",[e("td",[t._v("扣除分数")]),t._l(t.countPopMark(a.tag_config.protect_num,a.tag_config.step_range,a.tag_config.first_score,a.tag_config.floatation_ratio).tdData,(function(a,s){return e("td",{key:s},[t._v(t._s(a))])}))],2)])]):t._e()])]),e("ul",{staticClass:"record-data"},[e("li",[t._v(" "+t._s(t.sop2?"次数：":"违规次数：")+" "),e("span",{staticClass:"red"},[t._v(t._s(a.scores.count)+"次")])]),e("li",[t._v(" "+t._s(t.sop2?"分数：":"扣除分数：")+" "),e("span",{staticClass:"red"},[t._v(t._s(a.scores.score)+"分")])]),t.sop2?e("li",[t._v(" 标签类型： "),e("span",{staticClass:"red"},[t._v(t._s(1===a.scores.tag_type?"减分标签":"加分标签"))])]):t._e()])]),e("tableBox",{attrs:{uid:t.empId,tagConfig:a.tag_config,tagConfigId:a.tag_config.id,tableData:t.dispose(a.list),tableLabel:a.title,isHideHandle:!0},on:{transPoint:t.transPoint,freshTb:t.freshTb}})],1):t._e()}))],2),0!==t.totalSum?e("div",{staticClass:"pagination"},[e("el-pagination",{attrs:{background:"",layout:"prev, pager, next","page-size":t.pageSize,"current-page":t.currentPage,total:t.totalSum},on:{"update:currentPage":function(a){t.currentPage=a},"update:current-page":function(a){t.currentPage=a},"current-change":t.pageChange}})],1):t._e()])])]):t._e()],1)},i=[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"bd-con-hide-tit"},[a("h3",[this._v("执行力绩效发放比例计算规则")])])},function(){var t=this.$createElement,a=this._self._c||t;return a("ul",{staticClass:"s-query"},[a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("1、当执行力得分 大于 全国执行力绩效排名前20%的分数线（且在本月上半月完成培训），本执行力绩效将按照120%发放。")])]),a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("2、当执行力得分 大于 全国执行力绩效排名前20%的分数线（且在本月下半月完成培训），本执行力绩效将按照100%发放。")])]),a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("3、当执行力得分 小于 全国执行力绩效排名前20%的分数线，本月执行力绩效将按照<分数/2000>发放。 ")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("ul",{staticClass:"s-query"},[a("li",{staticClass:"auto "},[a("span",{staticClass:"txt txt-title"},[this._v("PS：其他细节说明")])]),a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("1)、全国执行力绩效排名前20%的排名是按照不包含培训期学员计算的。")])]),a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("2)、执行力得分为“0”时，发放比例=“0/2000”=0%。")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("ul",{staticClass:"s-query"},[a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("1、执行力分数由加分和减分组成，代表咨询师当月的执行力表现情况；执行力的综合得分=基础分数（折算出勤）+加分项得分-减分项得分。")])]),a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("2、根据综合得分，在核算城市内进行排名，根据排名高低，折算占资金池比例，最终发放金额=占资金池比例*资金池。")])]),a("li",{staticClass:"auto "},[a("span",{staticClass:"txt"},[this._v("3、排名靠前的三位咨询师，会额外发放奖金，根据城市配置情况发放。 ")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"warn-left"},[a("div",{staticClass:"th required"}),a("div",{staticClass:"td"},[this._v("如果发现执行力标签出现错误，请先进行核实，确认后将标签ID反馈给主管，并由主管统一反馈申诉")])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"tag-wrap"},[a("div",{staticClass:"tag-name"},[a("button",{staticClass:"btn tag-btn tg-it balance-tag"},[this._v("差额")]),a("span",{staticClass:"tg-it"},[this._v("标签业务发生时间不在当月的，举例：2018-10-2补录带看时判断不符合规则打带看迟到标签，实际带看时间是2018-09-30，即业务发生时间应该为2018-9-30")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("li",[a("div",{staticClass:"th required"},[this._v("标签规则")])])}]},5419:function(t,a,e){"use strict";var s=e("4ea4");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var i=s(e("5530")),o=e("2f62"),n=e("7223"),r=e("0475"),c={name:"executionDetail",data:function(){return{currentPage:1,leftPage:0,pageNum:0,pageSize:10,checkTargetData:"",totalSum:0,currentStart:0,currentEnd:0,pickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}},hideCompRules:!1,parseTime:"",score:"",rank:"",rate:"",employee_id:"",page:1,tagList:[],balance:{},headData:{},empId:"",empName:"",resultData:!0,sop2:!1,top3:[],bonus:"",isShowBonus:"",increaseTagList:[]}},mounted:function(){var t=this;this.$nextTick((function(){t.initPara()}))},methods:{toTagDetail:function(){this.$router.push({path:"executionTagDetail"})},dispose:function(t){var a=[];if(Array.isArray(t))a=t;else if(!1===Array.isArray(t)&&"undefined"!==t)for(var e in t)a.push(t[e]);return a},initPara:function(){this.$route.query.employee_id?this.empId=this.$route.query.employee_id:this.empId=this.uid,this.$route.query.time?this.checkTargetData=new Date(this.$route.query.time):this.checkTargetData=new Date,this.filterData(),this.getData()},countPopMark:function(t,a,e,s){var i=[],o=[];if(0===t)for(var n=0;n<4;n++){var r=(n*a==0?1:n*a+1)+"-"+a*(n+1),c="每次扣"+(e+s*n)+"分";i.push(r),o.push(c)}else for(var d=0;d<4;d++){var l=void 0,u=void 0;l=0===d?"0-"+t:t+a*(d-1)+1+"-"+(t+a*d),u=0===d?"不扣分":"每次扣"+(e+s*(d-1))+"分",i.push(l),o.push(u)}return{titData:i,tdData:o}},conHideDesc:function(t,a,e){t.currentTarget.parentElement.querySelector(".describe-box").style.display="none"},conShowDesc:function(t,a,e){t.currentTarget.parentElement.querySelector(".describe-box").style.display="block",n.commonFun.setTrackMenu(e,{})},freshTb:function(){this.getData()},compRules:function(){this.hideCompRules?this.hideCompRules=!1:this.hideCompRules=!0},filterData:function(){var t=new Date(this.checkTargetData),a=t.getFullYear()+"-"+(t.getMonth()+1);this.parseTime=a},reloadData:function(){this.filterData(),this.getData()},getData:function(){var t=this,a={time:this.parseTime,page:this.currentPage,employee_id:this.empId};this.axios.post("/backend-api/bk-api-tag-manage/view",a).then((function(a){if(0===a.data.code){var e=a.data.data;if("{}"==JSON.stringify(e))return void(t.resultData=!1);t.resultData=!0,t.score=e.score,t.rank=e.rank,t.rate=e.rate,t.empName=e.employee_name,t.totalSum=e.counts,t.tagList=[],t.tagList=e.detail,t.balance=e.other_detail,t.headData=e.ratios,t.sop2=e.sop2,t.top3=e.top3,t.bonus=e.bonus,t.isShowBonus=e.is_show_bonus,t.increaseTagList=e.increase_tag_list,t.getTableData()}})).catch((function(t){console.log(t)}))},pageChange:function(t){this.currentPage=t,0===this.leftPage?(this.currentStart=(this.currentPage-1)*this.pageSize+1,this.currentEnd=this.currentPage*this.pageSize):this.currentPage===this.pageNum?(this.currentStart=(this.currentPage-1)*this.pageSize+1,this.currentEnd=this.currentStart-1+this.leftPage):(this.currentStart=(this.currentPage-1)*this.pageSize+1,this.currentEnd=this.currentPage*this.pageSize),this.getData()},getTableData:function(){0!==this.totalSum?(this.pageNum=Math.ceil(this.totalSum/this.pageSize),this.leftPage=parseInt(this.totalSum%this.pageSize),1===this.pageNum?(this.currentStart=1,this.currentEnd=this.totalSum):1===this.currentPage&&(this.currentStart=1,this.currentEnd=this.pageSize)):(this.totalSum=0,this.currentStart=0,this.currentEnd=0,this.currentPage=1,this.isPage=!1)},transPoint:function(t){n.commonFun.setTrackMenu(t,{})},tableHeaderColor:function(t){t.row,t.column;var a=t.rowIndex;t.columnIndex;if(0===a)return"background-color: #f9f9f9;color: #333;"}},components:{TableBox:r.TableBox,Map:r.Map},computed:(0,i.default)({},(0,o.mapState)(["trackInfos","uid"]))};a.default=c},"8d7c":function(t,a,e){(a=e("24fb")(!1)).push([t.i,'.execution-container[data-v-36df2190]{padding:0 15px}.execution-container .tip[data-v-36df2190]{float:left;font-size:12px;color:red;line-height:46px;margin-left:10px}.execution-container .tip-black[data-v-36df2190]{color:#3a3a3a}.execution-container .red[data-v-36df2190]{color:red}.execution-container .blue[data-v-36df2190]{color:#2297f0}.tag-con-item[data-v-36df2190]{padding:20px 0;border-bottom:1px solid #ddd}.tag-name[data-v-36df2190],.tag-wrap[data-v-36df2190]{margin-bottom:20px}.tag-name[data-v-36df2190]{position:relative;min-height:34px}.describe-box[data-v-36df2190]{position:absolute;left:0;top:45px;z-index:20;width:450px;border:1px solid #ddd;background-color:#fff;-webkit-box-shadow:0 2px 4px 0 hsla(0,0%,60%,.62);box-shadow:0 2px 4px 0 hsla(0,0%,60%,.62);padding:26px 20px 21px 20px;display:none}.describe-box .arrow[data-v-36df2190]:before{content:"";border:6px solid transparent;border-bottom-color:#ddd;position:absolute;left:50px;top:7px;margin-top:-20px}.describe-box .arrow[data-v-36df2190]:after{content:"";border:6px solid transparent;border-bottom-color:#fff;position:absolute;top:7px;left:50px;margin-top:-19px}.describe-box li[data-v-36df2190]{width:auto;line-height:24px;float:none;overflow:hidden;font-size:14px;color:#666;margin-bottom:10px}.describe-box .th[data-v-36df2190]{height:auto;width:auto;font-size:16px;color:#151515;line-height:25px;margin-right:10px}.describe-box .td[data-v-36df2190]{font-size:12px;color:#666;line-height:26px;margin-left:10px}.tag-name>.tg-it[data-v-36df2190]{float:left}.tag-name>span.tg-it[data-v-36df2190]{margin-left:20px;line-height:34px}.tag-btn[data-v-36df2190]{border:1px solid #2297f0;border-radius:4px;font-size:14px;color:#2297f0;background-color:transparent}.record-data[data-v-36df2190]{overflow:hidden}.record-data li[data-v-36df2190]{float:left;margin-right:20px}.conclude[data-v-36df2190]{padding-top:20px;padding-bottom:20px;font-size:14px}.conclude li[data-v-36df2190]{width:auto;float:left;margin-right:50px;margin-bottom:0}.conclude li.auto[data-v-36df2190]{width:100%;clear:both}.conclude .warn-left[data-v-36df2190]{float:left}.conclude .warn-right[data-v-36df2190]{float:right}.conclude .th[data-v-36df2190]{width:auto}.rules-wrap .icongantanhao-yuankuang[data-v-36df2190]{color:#fe974a;font-size:23px;position:relative;top:2px}.execution-container .drop-down-box[data-v-36df2190]{float:right;margin-bottom:10px;color:#2e9ae1;cursor:pointer;font-size:14px;font-weight:700;vertical-align:middle}.bd-con-show[data-v-36df2190]{overflow:hidden}.bd-con-hide-tit[data-v-36df2190]{padding:15px 0;border-top:1px solid #ccc}.bd-con-hide-tit>h3[data-v-36df2190]{font-size:15px;margin:10px 0;color:#2e9ae1}.bd-con-hide-tit>h3[data-v-36df2190]:before{content:"";display:inline-block;height:14px;width:3px;margin-right:5px;vertical-align:bottom;background-color:#2e9ae1}.bd-con-hide-body .s-query .txt[data-v-36df2190]{font-size:14px;color:#666}.pagination[data-v-36df2190],.tag-container[data-v-36df2190]{padding-bottom:20px}.pagination[data-v-36df2190]{text-align:center;background:#fff}.table td[data-v-36df2190]{border:none}.execution-container .popTable[data-v-36df2190]{width:100%;margin-bottom:0;border-top:1px solid #ddd;border-bottom:1px solid #ddd;font-size:14px;color:#888}.execution-container .popTable td[data-v-36df2190]{padding:2px 5px;border:1px solid #ddd}.popTable .tbHead[data-v-36df2190]{text-align:center;background-color:#f9f9f9}.balance-tag[data-v-36df2190]{color:#333;border-color:#ccc}',""]),t.exports=a},d06c:function(t,a,e){"use strict";e.r(a);var s=e("5419"),i=e.n(s);for(var o in s)["default"].indexOf(o)<0&&function(t){e.d(a,t,(function(){return s[t]}))}(o);a.default=i.a}}]);