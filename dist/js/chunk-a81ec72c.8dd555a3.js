(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-a81ec72c"],{"0b52":function(e,t,a){(t=a("24fb")(!1)).push([e.i,'.rule-manage-box[data-v-1805f6e6]{padding:0 20px}.rule-manage-box .required[data-v-1805f6e6]:before{content:"*";color:#f64a4a}.rule-manage-box .item-content[data-v-1805f6e6]{display:-webkit-box;display:-ms-flexbox;display:flex;font-size:14px;min-height:40px;line-height:40px;margin-bottom:10px}.rule-manage-box .item-content.order-wrap[data-v-1805f6e6]{height:40px;padding-bottom:20px}.rule-manage-box .item-content.btm-second[data-v-1805f6e6]{padding-bottom:20px}.rule-manage-box .item-content[data-v-1805f6e6]:last-child{margin-bottom:0}.rule-manage-box .item-content .title[data-v-1805f6e6]{min-width:100px}.rule-manage-box .item-content[data-v-1805f6e6] .el-radio{line-height:40px}.rule-manage-box .item-content .container[data-v-1805f6e6],.rule-manage-box .item-content[data-v-1805f6e6] .el-form-item__content{display:-webkit-box;display:-ms-flexbox;display:flex}.rule-manage-box .item-content[data-v-1805f6e6] .number-input-box{width:80px}.rule-manage-box .item-content[data-v-1805f6e6] .el-select{width:500px}.rule-manage-box .item-content .jl-scale[data-v-1805f6e6]{margin-left:15px}',""]),e.exports=t},2721:function(e,t,a){var r=a("0b52");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,a("499e").default)("57bcaeb4",r,!0,{sourceMap:!1,shadowMode:!1})},34369:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("23f7"),n={ruleInit:function(e){return r.axios.post("/backend-api/kfs-order-rule/get-rule",e)},getOptype:function(e){return r.axios.get("/backend-api/select2/select2/get-all-optype-dropdown-list",{params:e})},getChannel:function(e){return r.axios.get("/backend-api/select2/select2/get-channel-dropdown-list",{params:e})},saveRule:function(e){return r.axios.post("/backend-api/kfs-order-rule/save",e)}};t.default=n},"3ddd":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("23f7"),n={developerList:function(e){return r.axios.get("/backend-api/kfs-developer/developer-list",e)},delDeveloper:function(e){return r.axios.post("/backend-api/kfs-developer/del-developer",e)},importDeveloper:function(e){return r.axios.post("/backend-api/kfs-developer/import-developer",e)},projectList:function(e){return r.axios.post("/backend-api/kfs-developer/get-project-list",e)},addDeveloper:function(e){return r.axios.post("/backend-api/kfs-developer/add-developer",e)},initDeveloperData:function(e){return r.axios.post("/backend-api/kfs-developer/init-developer-data",e)},editDeveloper:function(e){return r.axios.post("/backend-api/kfs-developer/edit-developer",e)},developerEmployeeList:function(e){return r.axios.get("/backend-api/kfs-developer/developer-employee-list",e)},delEmployee:function(e){return r.axios.post("/backend-api/kfs-developer/delete-developer-employee",e)},developerSelectList:function(e){return r.axios.get("/backend-api/select2/select2/get-developer-select",e)},addDeveloperEmployee:function(e){return r.axios.post("/backend-api/kfs-developer/add-developer-employee",e)},editInitDeveloperEmployee:function(e){return r.axios.get("/backend-api/kfs-developer/init-developer-employee",e)},editDeveloperEmployee:function(e){return r.axios.post("/backend-api/kfs-developer/edit-developer-employee",e)},resetPassword:function(e){return r.axios.post("/backend-api/kfs-developer/reset-password",e)},importDeveloperEmployee:function(e){return r.axios.post("/backend-api/kfs-developer/import-developer-employee",e)},balanceList:function(e){return r.axios.get("/backend-api/kfs_dsp/kfs-balance/get-account-amount-list",{params:e})},recharge:function(e){return r.axios.post("/backend-api/kfs_dsp/kfs-balance/add-recharge-record",e)},refund:function(e){return r.axios.post("/backend-api/kfs_dsp/kfs-balance/add-refund-record",e)},checkRefundInfoApi:function(e){return r.axios.post("/backend-api/kfs_dsp/kfs-balance/check-refund-info",e)},balanceDetail:function(e){return r.axios.get("/backend-api/kfs_dsp/kfs-balance/get-balance-detail-list",{params:e})},delBalance:function(e){return r.axios.post("/backend-api/kfs_dsp/kfs-balance/del-record",e)},getDeveloperInfoList:function(){return r.axios.post("/backend-api/kfs_dsp/kfs-balance/get-developer-info-list")},getProjectList:function(e){return r.axios.post("/backend-api/kfs_dsp/kfs-balance/get-project-list",e)},recoveryDeveloper:function(e){return r.axios.post("/backend-api/kfs-developer/recovery-developer",e)},recoveryEmployee:function(e){return r.axios.post("/backend-api/kfs-developer/recovery-employee",e)}};t.default=n},"4aed":function(e,t,a){"use strict";a.r(t);var r=a("51d8"),n=a.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){a.d(t,e,(function(){return r[e]}))}(o);t.default=n.a},"51c9":function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return n}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.pageLoading,expression:"pageLoading"}],staticClass:"rule-manage-box",attrs:{"element-loading-text":"拼命加载中"}},[a("el-breadcrumb",{staticClass:"bread-crumb-box",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[a("a",{attrs:{href:"/"}},[e._v("首页")])]),a("el-breadcrumb-item",{attrs:{to:{path:"/developer/developerManagement",query:{active:"4"}}}},[e._v(" 开发商管理 ")]),a("el-breadcrumb-item",[e._v("开发商订单分配规则管理")])],1),a("el-form",{ref:"ruleForm",attrs:{model:e.ruleForm}},[a("ul",[a("li",{staticClass:"item-content"},[a("div",{staticClass:"title required"},[e._v("开发商：")]),a("div",{staticClass:"container"},[a("el-form-item",{attrs:{prop:"devloper",rules:{required:!0,message:"请选择开发商",trigger:"change"}}},[a("el-select",{attrs:{filterable:"",placeholder:"请选择","remote-method":e.searchProject},model:{value:e.ruleForm.devloper,callback:function(t){e.$set(e.ruleForm,"devloper",t)},expression:"ruleForm.devloper"}},e._l(e.developList,(function(t){return a("el-option",{key:t.value,attrs:{label:t.name,value:t.value},nativeOn:{click:function(a){return e.affirmOption(t,1)}}})})),1)],1)],1)]),a("li",{staticClass:"item-content"},[a("div",{staticClass:"title required"},[e._v("楼盘：")]),a("div",{staticClass:"container"},[a("el-form-item",{attrs:{prop:"projectName",rules:{required:!0,message:"请选择楼盘",trigger:"change"}}},[a("el-select",{attrs:{multiple:"",filterable:"",remote:"","reserve-keyword":"",placeholder:"请选择",loading:e.loading,"remote-method":e.searchProject},on:{"remove-tag":e.removeTag},model:{value:e.ruleForm.projectName,callback:function(t){e.$set(e.ruleForm,"projectName",t)},expression:"ruleForm.projectName"}},e._l(e.projectArr,(function(t){return a("el-option",{key:t.id,attrs:{label:t.text,value:t.id},nativeOn:{click:function(a){return e.affirmOption(t,2)}}})})),1)],1)],1)]),a("li",{staticClass:"item-content btm-second"},[a("div",{staticClass:"title"},[e._v("分配留电口：")]),a("div",{staticClass:"container"},[a("el-select",{attrs:{filterable:"",multiple:"",remote:"",placeholder:"请选择","remote-method":e.getOptypeList},model:{value:e.phoneInner,callback:function(t){e.phoneInner=t},expression:"phoneInner"}},e._l(e.optypeList,(function(e){return a("el-option",{key:e.value,attrs:{label:e.name,value:e.value+""}})})),1)],1)]),a("li",{staticClass:"item-content btm-second"},[a("div",{staticClass:"title"},[e._v("分配渠道：")]),a("div",{staticClass:"container"},[a("el-select",{attrs:{filterable:"",multiple:"",remote:"",placeholder:"请选择","remote-method":e.getChannel},model:{value:e.channel,callback:function(t){e.channel=t},expression:"channel"}},e._l(e.channelList,(function(e){return a("el-option",{key:e.value,attrs:{label:e.name,value:e.value+""}})})),1)],1)]),a("li",{staticClass:"item-content order-wrap"},[a("div",{staticClass:"title required"},[e._v("订单分配给开发商比例：")]),a("div",{staticClass:"container"},[a("el-form-item",{attrs:{prop:"kfsScale",rules:{required:!0,validator:e.verifyKfsScale,trigger:"blur"}}},[a("div",{staticClass:"kfs-scale"},[a("jl-number-input",{attrs:{maxVal:100,maxlength:"3",reg:"number"},model:{value:e.ruleForm.kfsScale,callback:function(t){e.$set(e.ruleForm,"kfsScale",t)},expression:"ruleForm.kfsScale"}})],1),e._v(" % "),a("span",[e._v("（只能填写1-100之间5的倍数）")]),a("div",{staticClass:"jl-scale"},[e._v(" 分配给居理比例 "+e._s(100-parseInt(e.ruleForm.kfsScale))+"% ")])])],1)]),a("li",{staticClass:"item-content"},[a("div",{staticClass:"title"},[e._v("是否开启：")]),a("div",{staticClass:"container"},[a("el-radio",{attrs:{label:"1"},model:{value:e.isOpen,callback:function(t){e.isOpen=t},expression:"isOpen"}},[e._v("是")]),a("el-radio",{attrs:{label:"2"},model:{value:e.isOpen,callback:function(t){e.isOpen=t},expression:"isOpen"}},[e._v("否")])],1)])])]),a("div",{staticClass:"btn-area"},[a("el-button",{on:{click:e.skipList}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.saveData}},[e._v("保存")])],1)],1)},n=[]},"51d8":function(e,t,a){"use strict";var r=a("4ea4");a("99af"),a("c740"),a("4160"),a("a15b"),a("d81d"),a("a434"),a("b0c0"),a("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("96cf");var n=r(a("1da1")),o=r(a("3ddd")),i=r(a("34369")),l={name:"order-rule-manage",data:function(){return{pageLoading:!1,firstLoading:!0,isOpen:"1",id:"",loading:!1,channel:[],phoneInner:[],projectArr:[],checkProject:[],ruleForm:{devloper:"",projectName:[],kfsScale:50},optypeList:[],developList:[],channelList:[]}},created:function(){this.id=this.$route.query.id||"0",this.optyBaseList=[],this.channelBaseList=[],this.initData(),0==this.id&&(this.getOptypeList(""),this.getChannel(""),this.getDevlop(),this.searchProject(""))},methods:{verifyKfsScale:function(e,t,a){return""===t?a(new Error("请填写订单分配给开发商比例")):parseInt(t)%5!=0?a(new Error("只能填写1-100之间5的倍数")):void a()},getDevlop:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,n,i;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,r={q:e},a.next=4,o.default.developerSelectList({params:r});case 4:n=a.sent,0===(i=n.data).code&&(t.developList=i.list),a.next=12;break;case 9:a.prev=9,a.t0=a.catch(0),console.log(a.t0);case 12:case"end":return a.stop()}}),a,null,[[0,9]])})))()},isInclude:function(e,t){var a=[];return e.forEach((function(e){-1!=t.findIndex((function(t){return t.value==e.value}))&&a.push(e)})),a.length==e.length},getChannel:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,n,o;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,r={q:e},a.next=4,i.default.getChannel(r);case 4:n=a.sent,o=n.data,t.channelList=o.data.list,t.isInclude(t.channelBaseList,o.data.list)||(t.channelList=t.channelBaseList.concat(o.data.list)),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(0),console.log(a.t0);case 13:case"end":return a.stop()}}),a,null,[[0,10]])})))()},getOptypeList:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,n,o;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,r={q:e,rule_id:t.id,developer_id:t.ruleForm.devloper,project_id:t.ruleForm.projectName.join(",")},a.next=4,i.default.getOptype(r);case 4:n=a.sent,0===(o=n.data).code&&(t.optypeList=o.data.list,t.isInclude(t.optyBaseList,o.data.list)||(t.optypeList=t.optyBaseList.concat(o.data.list))),a.next=12;break;case 9:a.prev=9,a.t0=a.catch(0),console.log(a.t0);case 12:case"end":return a.stop()}}),a,null,[[0,9]])})))()},skipList:function(){this.$router.push({path:"/developer/developerManagement",query:{active:"4"}})},saveData:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var a,r,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,e.$refs.ruleForm.validate((function(e){if(!e)return!1})),!(e.phoneInner.length<1&&e.channel.length<1)){t.next=5;break}return e.$message({duration:3e3,showClose:!0,message:"留电口、渠道必填一项",type:"error"}),t.abrupt("return",!1);case 5:return a={id:e.id,developer_id:e.ruleForm.devloper,project_ids:e.ruleForm.projectName.join(","),port_ids:e.phoneInner.join(","),channel_ids:e.channel.join(","),developer_rate:parseInt(e.ruleForm.kfsScale),is_open:e.isOpen},t.next=8,i.default.saveRule(a);case 8:r=t.sent,0===(n=r.data).code?e.$router.push({path:"/developer/developerManagement",query:{active:"4"}}):alert(n.msg),t.next=16;break;case 13:t.prev=13,t.t0=t.catch(0),console.log(t.t0);case 16:case"end":return t.stop()}}),t,null,[[0,13]])})))()},initData:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var a,r,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,0!=e.id){t.next=4;break}return e.$nextTick((function(){e.firstLoading=!1})),t.abrupt("return",!1);case 4:return e.pageLoading=!0,a={id:e.id},t.next=8,i.default.ruleInit(a);case 8:r=t.sent,0===(n=r.data).code&&(e.ruleForm.devloper=n.data.developer.value+"",e.ruleForm.projectName=n.data.projects.map((function(e){return e.value})),e.phoneInner=n.data.ports.map((function(e){return e.value+""})),e.optyBaseList=n.data.ports.map((function(e){return{value:e.value+"",name:e.name}})),e.channel=n.data.channels.map((function(e){return e.value+""})),e.channelList=n.data.channels.map((function(e){return{value:e.value+"",name:e.name}})),e.isOpen=n.data.is_open+"",e.ruleForm.kfsScale=n.data.developer_rate,e.getOptypeList(""),e.getChannel(),e.getDevlop(),e.searchProject(""),e.$nextTick((function(){e.firstLoading=!1,e.pageLoading=!1}))),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(0),e.pageLoading=!1,console.log(t.t0);case 17:case"end":return t.stop()}}),t,null,[[0,13]])})))()},removeTag:function(e){var t=this.checkProject.findIndex((function(t,a){return t.id==e}));this.checkProject.splice(t,1)},affirmOption:function(e,t){1===t?this.ruleForm.devloper=e.value:2===t&&this.checkProject.push(e)},searchProject:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,n,i;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return t.loading=!0,r={name:e,developer_id:t.ruleForm.devloper},a.next=4,o.default.projectList(r);case 4:n=a.sent,0===(i=n.data).code?(t.projectArr=i.data.list,t.loading=!1):t.loading=!1;case 7:case"end":return a.stop()}}),a)})))()}},watch:{"ruleForm.devloper":{handler:function(e){this.firstLoading||(this.ruleForm.projectName=[],this.phoneInner=[],this.channel=[],this.searchProject(""))},deep:!0},"ruleForm.projectName":{handler:function(e){this.firstLoading||this.getOptypeList("")},deep:!0}}};t.default=l},"5b93":function(e,t,a){"use strict";a("2721")},a15b:function(e,t,a){"use strict";var r=a("23e7"),n=a("44ad"),o=a("fc6a"),i=a("a640"),l=[].join,s=n!=Object,c=i("join",",");r({target:"Array",proto:!0,forced:s||!c},{join:function(e){return l.call(o(this),void 0===e?",":e)}})},d7ab:function(e,t,a){"use strict";a.r(t);var r=a("51c9"),n=a("4aed");for(var o in n)["default"].indexOf(o)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(o);a("5b93");var i=a("2877"),l=Object(i.a)(n.default,r.a,r.b,!1,null,"1805f6e6",null);t.default=l.exports}}]);