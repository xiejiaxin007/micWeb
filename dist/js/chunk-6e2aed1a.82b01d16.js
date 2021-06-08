(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6e2aed1a"],{2532:function(e,a,t){"use strict";var r=t("23e7"),n=t("5a34"),o=t("1d80");r({target:"String",proto:!0,forced:!t("ab13")("includes")},{includes:function(e){return!!~String(o(this)).indexOf(n(e),arguments.length>1?arguments[1]:void 0)}})},"276a":function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var r=t("23f7"),n={getBankFlowData:function(e){return r.axios.get("/backend-api/expand/ex-bank-flow/edit",{params:e})},getCompanyNumberData:function(e){return r.axios.get("/backend-api/select2/bank/get-account-number",{params:e})},saveBankFlowData:function(e){return r.axios.post("/backend-api/expand/ex-bank-flow/edit",e)},getCompanyNameData:function(e){return r.axios.get("/backend-api/select2/bank/get-company-name",{params:e})}};a.default=n},"32a0":function(e,a,t){"use strict";t.d(a,"a",(function(){return r})),t.d(a,"b",(function(){return n}));var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"payment-information"},[t("el-breadcrumb",{staticClass:"bread-crumb-box",attrs:{"separator-class":"el-icon-arrow-right"}},[t("el-breadcrumb-item",[t("a",{attrs:{href:"/"}},[e._v("首页")])]),t("el-breadcrumb-item",{attrs:{to:"/payment/paymentInformation"}},[e._v("银行回款详情")]),t("el-breadcrumb-item",[e._v("修改银行流水")])],1),t("div",{staticClass:"bank-flow-box"},[t("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[t("el-form-item",{attrs:{label:"银行名称："}},[t("el-input",{attrs:{placeholder:"请输入银行名称",disabled:e.isDisabledAttr("bank_name")},model:{value:e.ruleForm.bankName,callback:function(a){e.$set(e.ruleForm,"bankName",a)},expression:"ruleForm.bankName"}})],1),t("el-form-item",{attrs:{label:"银行流水号："}},[t("el-input",{attrs:{placeholder:"请输入银行流水号",disabled:e.isDisabledAttr("bank_flow_number")},model:{value:e.ruleForm.bankFlowNum,callback:function(a){e.$set(e.ruleForm,"bankFlowNum",a)},expression:"ruleForm.bankFlowNum"}})],1),t("el-form-item",{attrs:{label:"付款账号："}},[t("el-input",{attrs:{placeholder:"请输入付款账号",disabled:e.isDisabledAttr("payment_account")},model:{value:e.ruleForm.payNumberID,callback:function(a){e.$set(e.ruleForm,"payNumberID",a)},expression:"ruleForm.payNumberID"}})],1),t("el-form-item",{attrs:{label:"付款公司："}},[t("el-input",{attrs:{placeholder:"请输入付款公司",disabled:e.isDisabledAttr("payment_company")},model:{value:e.ruleForm.payCompanyName,callback:function(a){e.$set(e.ruleForm,"payCompanyName",a)},expression:"ruleForm.payCompanyName"}})],1),t("el-form-item",{attrs:{label:"公司名称：",prop:"companyNameVal"}},[t("el-select",{attrs:{filterable:"",remote:"","reserve-keyword":"",placeholder:"请输入公司名称","remote-method":e.selectCompanyName,loading:e.loading,disabled:e.isDisabledAttr("cw_company_config_id")},on:{focus:e.selectCompanyName},model:{value:e.ruleForm.companyNameVal,callback:function(a){e.$set(e.ruleForm,"companyNameVal","string"==typeof a?a.trim():a)},expression:"ruleForm.companyNameVal"}},e._l(e.companyNameOptions,(function(e){return t("el-option",{key:e.id,attrs:{label:e.text,value:e.id}})})),1)],1),t("el-form-item",{attrs:{label:"公司账号：",prop:"companyNumberVal"}},[t("el-select",{attrs:{filterable:"",remote:"","reserve-keyword":"",placeholder:"请输入公司账号","remote-method":e.selectCompanyAccount,loading:e.loading,disabled:!e.ruleForm.companyNameVal||!!e.isDisabledAttr("cw_accounts_id")},on:{focus:e.selectCompanyAccount},model:{value:e.ruleForm.companyNumberVal,callback:function(a){e.$set(e.ruleForm,"companyNumberVal","string"==typeof a?a.trim():a)},expression:"ruleForm.companyNumberVal"}},e._l(e.companyNumberOpations,(function(e){return t("el-option",{key:e.id,attrs:{label:e.text,value:e.id}})})),1)],1),t("el-form-item",{attrs:{label:"到账时间：",prop:"arrivalTime"}},[t("el-date-picker",{attrs:{type:"datetime",format:"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期时间","value-format":"yyyy-MM-dd HH:mm:ss",disabled:e.isDisabledAttr("arrival_time")},model:{value:e.ruleForm.arrivalTime,callback:function(a){e.$set(e.ruleForm,"arrivalTime",a)},expression:"ruleForm.arrivalTime"}})],1),t("el-form-item",{attrs:{label:"到账金额：",prop:"arrivalMoney"}},[t("el-input",{attrs:{placeholder:"请输入到账金额",disabled:e.isDisabledAttr("arrival_money")},model:{value:e.ruleForm.arrivalMoney,callback:function(a){e.$set(e.ruleForm,"arrivalMoney",a)},expression:"ruleForm.arrivalMoney"}})],1),t("el-form-item",{staticClass:"btn-list"},[t("el-button",{on:{click:e.cancel}},[e._v("取消")]),t("el-button",{attrs:{type:"primary"},on:{click:function(a){return e.submitForm("ruleForm")}}},[e._v(" 保存 ")])],1)],1)],1)],1)},n=[]},"583b":function(e,a,t){var r=t("ad92");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,t("499e").default)("b3a58974",r,!0,{sourceMap:!1,shadowMode:!1})},"5a34":function(e,a,t){var r=t("44e7");e.exports=function(e){if(r(e))throw TypeError("The method doesn't accept regular expressions");return e}},ab13:function(e,a,t){var r=t("b622")("match");e.exports=function(e){var a=/./;try{"/./"[e](a)}catch(t){try{return a[r]=!1,"/./"[e](a)}catch(e){}}return!1}},ad92:function(e,a,t){(a=t("24fb")(!1)).push([e.i,".payment-information[data-v-99d42d1c]{padding:0 20px;-webkit-box-sizing:border-box;box-sizing:border-box}.payment-information .bank-flow-box[data-v-99d42d1c]{width:100%;min-height:100px;background:#fff;padding:20px;-webkit-box-sizing:border-box;box-sizing:border-box}.payment-information .bank-flow-box[data-v-99d42d1c] .el-date-editor,.payment-information .bank-flow-box[data-v-99d42d1c] .el-select{width:100%}.payment-information .btn-list[data-v-99d42d1c]{text-align:center;margin-top:20px}.payment-information .btn-list[data-v-99d42d1c] .el-button{width:120px}",""]),e.exports=a},afc5:function(e,a,t){"use strict";t.r(a);var r=t("bc82"),n=t.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){t.d(a,e,(function(){return r[e]}))}(o);a.default=n.a},bc82:function(e,a,t){"use strict";var r=t("4ea4");t("caad"),t("2532"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n=r(t("53ca"));t("96cf");var o=r(t("1da1")),i=r(t("276a")),l={data:function(){return{companyNameOptions:[],companyNumberOpations:[],loading:!1,formListData:{},isDisabledData:[],ruleForm:{bankName:"",bankFlowNum:"",payNumberID:"",payCompanyName:"",companyNameVal:"",companyNumberVal:"",arrivalTime:"",arrivalMoney:""},rules:{companyNameVal:[{required:!0,message:"请输入公司名称",trigger:"blur"}],companyNumberVal:[{required:!0,message:"请输入公司账号",trigger:"blur"}],arrivalTime:[{required:!0,message:"请输入到账时间",trigger:"blur"}],arrivalMoney:[{required:!0,message:"请输入到账金额",trigger:"blur"}]}}},mounted:function(){this.getBankFlowInfo()},methods:{submitForm:function(e){var a=this;this.$refs[e].validate(function(){var e=(0,o.default)(regeneratorRuntime.mark((function e(t){var r,n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=15;break}return r={id:a.$route.query.flowId,bank_name:a.ruleForm.bankName,bank_flow_number:a.ruleForm.bankFlowNum,payment_account:a.ruleForm.payNumberID,payment_company:a.ruleForm.payCompanyName,cw_company_config_id:a.ruleForm.companyNameVal,cw_accounts_id:a.ruleForm.companyNumberVal,arrival_time:a.ruleForm.arrivalTime,arrival_money:a.ruleForm.arrivalMoney},e.prev=2,e.next=5,i.default.saveBankFlowData(r);case 5:n=e.sent,0===(o=n.data).code?(a.$message({message:"保存成功",type:"success"}),setTimeout((function(){a.$router.push({path:"/payment/paymentInformation"})}),1e3)):alert(o.msg),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),console.log(e.t0);case 13:e.next=16;break;case 15:return e.abrupt("return",!1);case 16:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(a){return e.apply(this,arguments)}}())},getBankFlowInfo:function(){var e=this;return(0,o.default)(regeneratorRuntime.mark((function a(){var t,r,n;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return t={id:e.$route.query.flowId},a.prev=1,a.next=4,i.default.getBankFlowData(t);case 4:r=a.sent,0===(n=r.data).code?(e.formListData=n.data,e.isDisabledData=e.formListData.can_edit_field,e.ruleForm.bankName=e.formListData.bank_name,e.ruleForm.bankFlowNum=e.formListData.bank_flow_number,e.ruleForm.payNumberID=e.formListData.payment_account,e.ruleForm.payCompanyName=e.formListData.payment_company,e.companyNameOptions.push(e.assignObject(e.formListData.cw_company_config_id,e.formListData.cw_company_config_id_str)),e.companyNameOptions&&(e.ruleForm.companyNameVal=e.companyNameOptions[0].id),e.companyNumberOpations.push(e.assignObject(e.formListData.cw_accounts_id,e.formListData.cw_accounts_id_str)),e.companyNumberOpations&&(e.ruleForm.companyNumberVal=e.companyNumberOpations[0].id),e.ruleForm.arrivalTime=e.formListData.arrival_time,e.ruleForm.arrivalMoney=e.formListData.arrival_money):alert(n.msg),a.next=12;break;case 9:a.prev=9,a.t0=a.catch(1),console.log(a.t0);case 12:case"end":return a.stop()}}),a,null,[[1,9]])})))()},assignObject:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return{id:e,text:a}},isDisabledAttr:function(e){if(this.isDisabledData.length>0)return!this.isDisabledData.includes(e)},cancel:function(){this.$router.push({path:"/payment/paymentInformation"})},selectCompanyAccount:function(e){var a=this;return(0,o.default)(regeneratorRuntime.mark((function t(){var r,o,l;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return""!==e&&"object"!==(0,n.default)(e)?(a.loading=!0,r={q:e,companyId:a.ruleForm.companyNameVal}):(a.loading=!0,r={q:"",companyId:a.ruleForm.companyNameVal}),t.prev=1,t.next=4,i.default.getCompanyNumberData(r);case 4:o=t.sent,0===(l=o.data).code?(a.loading=!1,a.companyNumberOpations=l.data):(a.loading=!1,alert(l.msg)),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(1),a.loading=!1,console.log(t.t0);case 13:case"end":return t.stop()}}),t,null,[[1,9]])})))()},selectCompanyName:function(e){var a=this;return(0,o.default)(regeneratorRuntime.mark((function t(){var r,o,l;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return""!==e&&"object"!==(0,n.default)(e)?(a.loading=!0,r={q:e}):(a.loading=!0,r={q:""}),t.prev=1,t.next=4,i.default.getCompanyNameData(r);case 4:o=t.sent,0===(l=o.data).code?(a.loading=!1,a.companyNameOptions=l.data):(a.loading=!1,alert(l.msg)),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(1),a.loading=!1,console.log(t.t0);case 13:case"end":return t.stop()}}),t,null,[[1,9]])})))()}}};a.default=l},caad:function(e,a,t){"use strict";var r=t("23e7"),n=t("4d64").includes,o=t("44d2");r({target:"Array",proto:!0,forced:!t("ae40")("indexOf",{ACCESSORS:!0,1:0})},{includes:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}}),o("includes")},eb64:function(e,a,t){"use strict";t("583b")},f0ab:function(e,a,t){"use strict";t.r(a);var r=t("32a0"),n=t("afc5");for(var o in n)["default"].indexOf(o)<0&&function(e){t.d(a,e,(function(){return n[e]}))}(o);t("eb64");var i=t("2877"),l=Object(i.a)(n.default,r.a,r.b,!1,null,"99d42d1c",null);a.default=l.exports}}]);