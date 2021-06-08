(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2671dc70"],{"334b":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r("23f7"),n={getDepartList:function(e){return a.axios.post("/backend-api/select2/select2/get-org-list",e)},getOrderCitys:function(e){return a.axios.post("/backend-api/select2/select2/get-all-city",e)},getOrgDepartList:function(e){return a.axios.get("/backend-api/select2/select2/get-org-depart-list",{params:e})},getJobs:function(e){return a.axios.get("/backend-api/select2/select2/get-org-post-list",{params:e})},getAllCityData:function(e){return a.axios.post("/backend-api/select2/select2/get-all-city-code",e)},getCompanyCommonData:function(e){return a.axios.post("/backend-api/org/org/common-select",e)}};t.default=n},3357:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r("23f7"),n={creatEmployee:function(e){return a.axios.post("/backend-api/org/employee/create",e)},getEmployeeBaseInfo:function(e){return a.axios.get("/backend-api/org/employee/info",{params:e})}};t.default=n},"42f7":function(e,t,r){"use strict";var a=r("4ea4");r("b0c0"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,r("96cf");var n=a(r("1da1")),o=a(r("3357")),l=a(r("334b")),s={name:"AddEmployee",data:function(){return{loading:!1,navTitle:"新建人员",ruleForm:{company:"",name:"",tel:"",department:"",job:""},rules:{company:[{required:!0,message:"所属公司没有填写完成",trigger:"change"}],name:[{required:!0,message:"姓名没有填写完成",trigger:"blur"}],tel:[{required:!0,message:"手机号没有填写完成",trigger:"blur"},{pattern:/^\d{11}$/,message:"手机号格式错误，请检查",trigger:["blur","change"]}],department:[{required:!0,message:"所属公司没有填写完成",trigger:"change"}],job:[{required:!0,message:"所属公司没有填写完成",trigger:"change"}]},belongCompanyList:[],departmentList:[],jobList:[]}},created:function(){if(this.employeeId=this.$route.query.id||"",""!==this.employeeId){this.navTitle="编辑人员",document.title="编辑人员"}},mounted:function(){this.getCompanyList(),this.getJobsList(),this.employeeId&&this.getEmployeeById()},methods:{changeCompany:function(e){this.ruleForm.department="",this.getDepartListById(e)},submitForm:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$refs.ruleForm.validate();case 3:t.sent&&e.saveInfo(),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))()},saveInfo:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var r,a,n,l,s,i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.loading=!0,r=e.ruleForm,a={id:e.employeeId,org_id:r.company,employee_name:r.name,mobile:r.tel,depart_id:r.department,post_id:r.job},t.next=6,o.default.creatEmployee(a);case 6:n=t.sent,l=n.data,s=l.code,i=l.msg,e.loading=!1,0===s?e.$router.push("/companyManage/peopleList"):e.$message.error(i),t.next=18;break;case 14:t.prev=14,t.t0=t.catch(0),console.warn(t.t0),e.loading=!1;case 18:case"end":return t.stop()}}),t,null,[[0,14]])})))()},getCityList:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var r,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,l.default.getOrderCitys();case 3:r=t.sent,a=r.data,e.cityList=a||[],t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),console.warn(t.t0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})))()},getEmployeeById:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var r,a,n,l,s;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.loading=!0,r={id:e.employeeId},t.next=5,o.default.getEmployeeBaseInfo(r);case 5:if(a=t.sent,n=a.data,l=n.code,s=n.data,0!==l){t.next=20;break}return e.ruleForm.company=s.org_id,e.ruleForm.name=s.name,e.ruleForm.tel=s.mobile,e.ruleForm.department=s.depart_id,e.ruleForm.job=s.post_id,t.next=17,e.getDepartListById(s.org_id);case 17:e.loading=!1,t.next=21;break;case 20:e.loading=!1;case 21:t.next=27;break;case 23:t.prev=23,t.t0=t.catch(0),e.loading=!1,console.warn(t.t0);case 27:case"end":return t.stop()}}),t,null,[[0,23]])})))()},getCompanyList:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var r,a,n,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,l.default.getDepartList();case 3:r=t.sent,a=r.data,n=a.code,o=a.data,0===n&&(e.belongCompanyList=o||[]),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),console.warn(t.t0);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})))()},getDepartListById:function(e){var t=this;return(0,n.default)(regeneratorRuntime.mark((function r(){var a,n,o,s,i;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,a={org_id:e||t.employeeId},r.next=4,l.default.getOrgDepartList(a);case 4:n=r.sent,o=n.data,s=o.code,i=o.data,0===s&&(t.departmentList=i||[]),r.next=14;break;case 11:r.prev=11,r.t0=r.catch(0),console.warn(r.t0);case 14:case"end":return r.stop()}}),r,null,[[0,11]])})))()},getJobsList:function(){var e=this;return(0,n.default)(regeneratorRuntime.mark((function t(){var r,a,n,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,l.default.getJobs();case 3:r=t.sent,a=r.data,n=a.code,o=a.data,0===n&&(e.jobList=o||[]),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),console.warn(t.t0);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})))()}}};t.default=s},"4bb4":function(e,t,r){"use strict";r.r(t);var a=r("84c0"),n=r("a22c");for(var o in n)["default"].indexOf(o)<0&&function(e){r.d(t,e,(function(){return n[e]}))}(o);r("d03f");var l=r("2877"),s=Object(l.a)(n.default,a.a,a.b,!1,null,"27d6cdc4",null);t.default=s.exports},"7f32":function(e,t,r){var a=r("c6ce");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);(0,r("499e").default)("00cc477f",a,!0,{sourceMap:!1,shadowMode:!1})},"84c0":function(e,t,r){"use strict";r.d(t,"a",(function(){return a})),r.d(t,"b",(function(){return n}));var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],staticClass:"add-employee"},[r("el-breadcrumb",{staticClass:"bread-crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[r("el-breadcrumb-item",[r("a",{attrs:{href:"/"}},[e._v("首页")])]),r("el-breadcrumb-item",[e._v("加盟商管理")]),r("el-breadcrumb-item",{attrs:{to:{path:"/companyManage/peopleList"}}},[e._v(" 人员列表 ")]),r("el-breadcrumb-item",[e._v(e._s(e.navTitle))])],1),r("el-form",{ref:"ruleForm",staticClass:"rule-form",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"96px"}},[r("el-form-item",{attrs:{label:"所属公司：",prop:"company"}},[r("el-select",{attrs:{filterable:"",placeholder:"请选择"},on:{change:e.changeCompany},model:{value:e.ruleForm.company,callback:function(t){e.$set(e.ruleForm,"company",t)},expression:"ruleForm.company"}},e._l(e.belongCompanyList,(function(e){return r("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1),r("el-form-item",{attrs:{label:"姓名：",prop:"name"}},[r("el-input",{staticClass:"normal-input",attrs:{placeholder:"请输入",maxlength:"10"},model:{value:e.ruleForm.name,callback:function(t){e.$set(e.ruleForm,"name",t)},expression:"ruleForm.name"}})],1),r("el-form-item",{attrs:{label:"手机号：",prop:"tel"}},[r("el-input",{staticClass:"normal-input",attrs:{placeholder:"请输入",type:"tel",maxlength:"11"},model:{value:e.ruleForm.tel,callback:function(t){e.$set(e.ruleForm,"tel",t)},expression:"ruleForm.tel"}})],1),r("el-form-item",{attrs:{label:"部门：",prop:"department"}},[r("el-select",{attrs:{placeholder:"请选择"},model:{value:e.ruleForm.department,callback:function(t){e.$set(e.ruleForm,"department",t)},expression:"ruleForm.department"}},e._l(e.departmentList,(function(e){return r("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1),r("el-form-item",{attrs:{label:"岗位：",prop:"job"}},[r("el-select",{attrs:{placeholder:"请选择"},model:{value:e.ruleForm.job,callback:function(t){e.$set(e.ruleForm,"job",t)},expression:"ruleForm.job"}},e._l(e.jobList,(function(e){return r("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})})),1)],1),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v(" 保存 ")])],1)],1)],1)},n=[]},a22c:function(e,t,r){"use strict";r.r(t);var a=r("42f7"),n=r.n(a);for(var o in a)["default"].indexOf(o)<0&&function(e){r.d(t,e,(function(){return a[e]}))}(o);t.default=n.a},c6ce:function(e,t,r){(t=r("24fb")(!1)).push([e.i,".add-employee[data-v-27d6cdc4]{padding:20px 30px}.add-employee .normal-input[data-v-27d6cdc4]{width:200px}.rule-form[data-v-27d6cdc4]{margin-top:20px;padding:40px 30px 20px;background-color:#fff}",""]),e.exports=t},d03f:function(e,t,r){"use strict";r("7f32")}}]);