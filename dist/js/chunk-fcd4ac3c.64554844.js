(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-fcd4ac3c"],{"00810":function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return i}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"examine-box"},[a("div",{staticClass:"el-row"},[a("el-col",{staticClass:"content-main",attrs:{span:24}},[a("el-breadcrumb",{staticClass:"bread-crumb-box",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[a("a",{attrs:{href:"/"}},[e._v("首页")])]),a("el-breadcrumb-item",[e._v("线上带看审核")])],1),a("div",{staticClass:"v-box form-table-box"},[a("div",{staticClass:"hd"},[a("h2",[e._v("线上带看审核")])]),a("div",{staticClass:"bd"},[a("div",{staticClass:"order-search"},[a("ul",{staticClass:"s-query"},[a("li",[a("div",{staticClass:"th"},[e._v("城市：")]),a("div",{staticClass:"td"},[a("el-select",{attrs:{filterable:"",placeholder:"请选择",clearable:""},model:{value:e.cityId,callback:function(t){e.cityId=t},expression:"cityId"}},e._l(e.cityList,(function(e){return a("el-option",{key:e.id,attrs:{label:e.text,value:e.id}})})),1)],1)]),a("li",[a("div",{staticClass:"th"},[e._v("带看咨询师：")]),a("div",{staticClass:"td"},[a("el-select",{attrs:{filterable:"",placeholder:"请选择",remote:"","remote-method":e.getEmployeeList,clearable:""},model:{value:e.employeeId,callback:function(t){e.employeeId=t},expression:"employeeId"}},e._l(e.employeeList,(function(e){return a("el-option",{key:e.id,attrs:{label:e.text,value:e.id}})})),1)],1)]),"admin"===this.trackCommon.info.role?a("li",[a("div",{staticClass:"th"},[e._v("咨询主管：")]),a("div",{staticClass:"td"},[a("el-select",{attrs:{filterable:"",placeholder:"请选择",remote:"","remote-method":e.getEmployeeManagerList,clearable:""},model:{value:e.employeeManager,callback:function(t){e.employeeManager=t},expression:"employeeManager"}},e._l(e.employeeManagerList,(function(e){return a("el-option",{key:e.id,attrs:{label:e.text,value:e.id}})})),1)],1)]):e._e(),a("li",[a("div",{staticClass:"th"},[e._v("订单号：")]),a("div",{staticClass:"td"},[a("el-input",{attrs:{type:"text",clearable:""},model:{value:e.orderId,callback:function(t){e.orderId=t},expression:"orderId"}})],1)]),a("li",[a("div",{staticClass:"th"},[e._v("审核状态：")]),a("div",{staticClass:"td"},[a("el-select",{attrs:{filterable:"",placeholder:"请选择",clearable:""},model:{value:e.examineState,callback:function(t){e.examineState=t},expression:"examineState"}},e._l(e.examineStateList,(function(e){return a("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1)]),a("li",[a("div",{staticClass:"th"},[e._v("带看Id：")]),a("div",{staticClass:"td"},[a("el-input",{attrs:{type:"text",clearable:""},model:{value:e.leadOnlineId,callback:function(t){e.leadOnlineId=t},expression:"leadOnlineId"}})],1)]),a("li",[a("div",{staticClass:"th"},[e._v("带看时间：")]),a("div",{staticClass:"td"},[a("el-date-picker",{staticClass:"form-date-range-box",attrs:{clearable:"","default-time":["00:00:00","23:59:59"],type:"datetimerange","value-format":"timestamp","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.leadOnlineTime,callback:function(t){e.leadOnlineTime=t},expression:"leadOnlineTime"}})],1)])])]),a("div",{staticClass:"btn-area"},[a("el-button",{on:{click:e.resetSearch}},[e._v("重置")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.doSearch(1)}}},[e._v("搜索")])],1)])]),a("div",{staticClass:"v-box form-table-box examine-table-box"},[a("div",{staticClass:"bd"},[a("div",{staticClass:"search-result"},[a("div",{staticClass:"data-stat"},[a("el-row",[a("el-col",{attrs:{span:10}},[e._v(" 当前共有"+e._s(e.total)+"条数据 ")])],1)],1),a("div",{staticClass:"table-wrap-box"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tbLoading,expression:"tbLoading"}],ref:"tableFixedWrap",attrs:{border:"",data:e.tableList,size:"small","row-class-name":"row","cell-class-name":"column","highlight-current-row":!0,"header-cell-style":e.tableHeaderColor}},[a("el-table-column",{attrs:{"min-width":"80",prop:"city_name",label:"城市"}}),a("el-table-column",{attrs:{"min-width":"80",prop:"see_employee_realname",label:"带看咨询师"}}),a("el-table-column",{attrs:{"min-width":"80",prop:"see_employee_leader_realname",label:"咨询主管"}}),a("el-table-column",{attrs:{"min-width":"80",prop:"order_id",label:"订单"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("a",{staticClass:"order-id-box",attrs:{href:t.row.order_detail_url,target:"_blank"}},[e._v(e._s(t.row.order_id)+" ")])]}}])}),a("el-table-column",{attrs:{"min-width":"80",prop:"see_project_id",label:"带看"}}),a("el-table-column",{attrs:{"min-width":"150",prop:"projects",label:"带看楼盘顺序"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"projects"},e._l(t.row.projects,(function(t,r){return a("p",{key:r},[e._v(" "+e._s(r+1)+". "+e._s(t)+" ")])})),0)]}}])}),a("el-table-column",{attrs:{"min-width":"120",prop:"plan_real_begin_datetime",label:"带看时间"}}),a("el-table-column",{attrs:{"min-width":"80",prop:"audit_result_str",label:"审核状态"}}),a("el-table-column",{attrs:{"min-width":"100",prop:"operate",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(a){return e.examineFun(t.row)}}},[e._v("审核")])]}}])})],1)],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next","page-size":e.pageLimit,"hide-on-single-page":"","current-page":e.page,total:e.total},on:{"update:currentPage":function(t){e.page=t},"update:current-page":function(t){e.page=t},"current-change":e.pageChange}})],1)])])])],1)],1),a("el-dialog",{attrs:{title:"线上带看审核",visible:e.examineDialog,width:"420px",center:""},on:{"update:visible":function(t){e.examineDialog=t}}},[a("div",{staticClass:"dialog-body"},[a("el-radio",{attrs:{label:"2"},model:{value:e.pass,callback:function(t){e.pass=t},expression:"pass"}},[e._v("审核通过")]),a("el-radio",{attrs:{label:"3"},model:{value:e.pass,callback:function(t){e.pass=t},expression:"pass"}},[e._v("审核不通过")])],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.examineDialog=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.confirmExamine}},[e._v("确 定")])],1)])],1)},i=[]},"171b":function(e,t,a){"use strict";a.r(t);var r=a("00810"),i=a("77ad");for(var n in i)["default"].indexOf(n)<0&&function(e){a.d(t,e,(function(){return i[e]}))}(n);a("f418"),a("fffd");var o=a("2877"),l=Object(o.a)(i.default,r.a,r.b,!1,null,"35f9e1dc",null);t.default=l.exports},"2c36":function(e,t,a){var r=a("9bf0");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,a("499e").default)("66147530",r,!0,{sourceMap:!1,shadowMode:!1})},3854:function(e,t,a){"use strict";var r=a("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=r(a("5530"));a("96cf");var n=r(a("1da1")),o=r(a("6511")),l=a("2f62"),s=a("f946"),d={name:"examine",data:function(){return{cityId:"",cityList:[],employeeId:"",employeeList:[],employeeManager:"",employeeManagerList:[],orderId:"",examineState:"",examineStateList:[],leadOnlineId:"",leadOnlineTime:[],total:0,tableList:[],page:1,pageLimit:20,tbLoading:!1,examineDialog:!1,pass:"",opearationObj:""}},created:function(){this.getCityList(),this.doSearch(1),console.log(this.trackCommon.info.role)},methods:{getCityList:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var a,r,i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a={},t.prev=1,t.next=4,(0,s.getCity)(a);case 4:r=t.sent,0===(i=r.data).code&&(e.cityList=i.data),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(1),console.log(t.t0);case 12:case"end":return t.stop()}}),t,null,[[1,9]])})))()},getEmployeeList:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,i,n,o;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return r={q:e,role:"header",status:"1"},"header_manager"===(i=t.trackCommon.info).role?r.header_manager_id=i.login_employee_id:"4"===t.postNum&&(r.city_id=i.city_id),a.prev=3,a.next=6,(0,s.getPageEmployee)(r);case 6:n=a.sent,0===(o=n.data).code&&(t.employeeList=o.data.list),a.next=14;break;case 11:a.prev=11,a.t0=a.catch(3),console.log(a.t0);case 14:case"end":return a.stop()}}),a,null,[[3,11]])})))()},getEmployeeManagerList:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,i,n;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return r={q:e,role:"header_manager",status:"1"},"4"===t.postNum&&(r.city_id=t.trackCommon.info.city_id),a.prev=2,a.next=5,(0,s.getPageEmployee)(r);case 5:i=a.sent,0===(n=i.data).code&&(t.employeeManagerList=n.data.list),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(2),console.log(a.t0);case 13:case"end":return a.stop()}}),a,null,[[2,10]])})))()},resetSearch:function(){this.cityId="",this.employeeId="",this.employeeManager="",this.orderId="",this.examineState="",this.leadOnlineId="",this.leadOnlineTime=[],this.doSearch(1)},doSearch:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var r,i,n;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return t.page=e?parseInt(e):t.page,t.tbLoading=!0,r={page:t.page,page_size:t.pageLimit,city_id:t.cityId,see_employee_id:t.employeeId,see_employee_leader_id:t.employeeManager,order_id:t.orderId,see_project_id:t.leadOnlineId,see_project_time_start:t.leadOnlineTime.length>0?t.leadOnlineTime[0]/1e3:"",see_project_time_end:t.leadOnlineTime.length>1?t.leadOnlineTime[1]/1e3:"",status:t.examineState},a.prev=3,a.next=6,o.default.auditList(r);case 6:i=a.sent,0===(n=i.data).code?(t.tbLoading=!1,t.total=parseInt(n.data.total_records),t.tableList=n.data.list,t.examineStateList=n.data.audit_status):t.tbLoading=!1,a.next=15;break;case 11:a.prev=11,a.t0=a.catch(3),console.log(a.t0),t.tbLoading=!1;case 15:case"end":return a.stop()}}),a,null,[[3,11]])})))()},examineFun:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:t.examineDialog=!0,t.opearationObj=e,t.pass=e.audit_result;case 3:case"end":return a.stop()}}),a)})))()},confirmExamine:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var a,r,i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.tbLoading=!0,a={id:e.opearationObj.id,pass:e.pass},t.prev=2,t.next=5,o.default.doAudit(a);case 5:r=t.sent,0===(i=r.data).code?(e.examineDialog=!1,e.$message(i.msg),e.tbLoading=!1,e.doSearch()):(e.tbLoading=!1,e.$message(i.msg)),t.next=14;break;case 10:t.prev=10,t.t0=t.catch(2),console.log(t.t0),e.tbLoading=!1;case 14:case"end":return t.stop()}}),t,null,[[2,10]])})))()},pageChange:function(e){this.doSearch(e)},tableHeaderColor:function(e){e.row,e.column;var t=e.rowIndex;e.columnIndex;if(0===t)return"background-color: #f9f9f9;color: #333;"}},computed:(0,i.default)({},(0,l.mapState)({trackCommon:function(e){return e.trackCommon},postNum:function(e){return e.postNum}})),watch:{postNum:{handler:function(e,t){this.getEmployeeList(),this.getEmployeeManagerList()},deep:!0}}};t.default=d},3965:function(e,t,a){(t=a("24fb")(!1)).push([e.i,".examine-box[data-v-35f9e1dc]{padding:0 20px 30px}.examine-table-box[data-v-35f9e1dc] .el-table td .cell,.examine-table-box[data-v-35f9e1dc] .el-table th .cell{font-size:14px;color:#333;text-align:center;font-weight:400}.examine-table-box[data-v-35f9e1dc] .el-table .order-id-box{color:#409eff}.examine-table-box .pagination[data-v-35f9e1dc]{text-align:center;padding:20px 0;background:#fff}",""]),e.exports=t},6511:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("23f7"),i={prepareMaterial:function(e){return r.axios.post("/backend-api/live/preparation-materials",e)},updateMaterials:function(e){return r.axios.post("/backend-api/live/update-materials",e)},auditList:function(e){return r.axios.post("/backend-api/online-see-project/audit-list",e)},doAudit:function(e){return r.axios.post("/backend-api/online-see-project/do-audit",e)},areaList:function(e){return r.axios.get("/backend-api/online-see-project/get-only-district-list",{params:e})},getMaterialList:function(e){return r.axios.post("/backend-api/online-see-project/get-material-list",e)},saveReadStatus:function(e){return r.axios.post("/backend-api/live/save-read-status",e)},delMaterial:function(e){return r.axios.post("/backend-api/online-see-project/del-material",e)}};t.default=i},"77ad":function(e,t,a){"use strict";a.r(t);var r=a("3854"),i=a.n(r);for(var n in r)["default"].indexOf(n)<0&&function(e){a.d(t,e,(function(){return r[e]}))}(n);t.default=i.a},"9bf0":function(e,t,a){(t=a("24fb")(!1)).push([e.i,".content-main[data-v-35f9e1dc]{padding:0 15px}.form-table-box[data-v-35f9e1dc]{background-color:#fff}.order-search[data-v-35f9e1dc]{overflow:hidden}.order-search[data-v-35f9e1dc] .el-date-editor,.order-search[data-v-35f9e1dc] .el-select{width:100%;height:40px;-webkit-box-sizing:border-box;box-sizing:border-box}.order-search[data-v-35f9e1dc] .el-select>>>.el-input{height:40px}.order-search[data-v-35f9e1dc] .el-range-input{background-color:#fff;font-size:12px;line-height:32px}.order-search[data-v-35f9e1dc] .el-date-editor .el-range-separator{font-size:12px}.order-search .fixHeight[data-v-35f9e1dc]{height:40px}.order-search[data-v-35f9e1dc] .el-date-editor .date-tip-logo{display:none}.form-table-box .filter-link-more[data-v-35f9e1dc]{float:right;padding:9px 20px;margin-top:6px}.order-search>.s-query>li .td[data-v-35f9e1dc]{height:40px}.s-query>li.long-column[data-v-35f9e1dc]{width:360px}.s-query>li.margin-next[data-v-35f9e1dc]{margin-left:20px}.form-tip-box[data-v-35f9e1dc]{color:#999}.form-table-box .batch-btn-area[data-v-35f9e1dc]{text-align:right}.batch-form-box[data-v-35f9e1dc] .el-form-item{margin-bottom:0}.data-stat[data-v-35f9e1dc]{overflow:hidden;padding:10px 0 20px;font-size:14px}.projects[data-v-35f9e1dc]{text-align:left}",""]),e.exports=t},c05e:function(e,t,a){var r=a("3965");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,a("499e").default)("0995d1a9",r,!0,{sourceMap:!1,shadowMode:!1})},f418:function(e,t,a){"use strict";a("2c36")},fffd:function(e,t,a){"use strict";a("c05e")}}]);