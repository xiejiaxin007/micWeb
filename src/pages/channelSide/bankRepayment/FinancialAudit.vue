<!--
  * @file 银行回款信息页面
  * @author --贺伟
  * @updateTime 2019.10.23
 -->
<template>
    <div
        class="financial-audit"
        v-loading="loadloading"
    >
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>财务审核列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box">
            <div class="hd">
                <h2 class="line">搜索条件</h2>
            </div>
            <div class="bd">
                <ul class="s-query search">
                    <li>
                        <div class="th">审批ID：</div>
                        <div class="td">
                            <el-input
                                v-model.trim="searchData.verify_batch_id"
                                placeholder="请输入内容"
                                @input="inputNumber(searchData.verify_batch_id, 'verify_batch_id')"
                            ></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">核销编号：</div>
                        <div class="td">
                            <el-input
                                v-model.trim="searchData.write_num"
                                placeholder="请输入内容"
                            ></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">成交ID：</div>
                        <div class="td">
                            <el-input
                                v-model.trim="searchData.deal_id"
                                placeholder="请输入内容"
                                @input="inputNumber(searchData.deal_id, 'deal_id')"
                            ></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">城市：</div>
                        <div class="td">
                            <el-select
                                v-model="searchData.city_id"
                                filterable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in cityOptions"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">回款负责人：</div>
                        <div class="td">
                            <el-select
                                v-model.trim="searchData.payback_employee_id"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="selectPayback"
                                :loading="loading"
                                @change="val => changeHandle(val, 'payback_employee_options', 'payback_employee_text')"
                            >
                                <el-option
                                    v-for="it in searchData.payback_employee_options"
                                    :key="it.id"
                                    :label="it.text"
                                    :value="it.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">申请人：</div>
                        <div class="td">
                            <el-select
                                v-model.trim="searchData.apply_employee_id"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="selectApply"
                                :loading="loading"
                                @change="val => changeHandle(val, 'apply_employee_options', 'apply_employee_text')"
                            >
                                <el-option
                                    v-for="it in searchData.apply_employee_options"
                                    :key="it.id"
                                    :label="it.text"
                                    :value="it.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="w-auto">
                        <div class="th">提交时间：</div>
                        <div class="td">
                            <el-date-picker
                                v-model="searchData.apply_datetime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </div>
                    </li>
                    <li>
                        <div class="th">客户名称：</div>
                        <div class="td">
                            <el-input
                                v-model.trim="searchData.user_name"
                                placeholder="请输入内容"
                            ></el-input>
                        </div>
                    </li>
                    <li>
                        <div class="th">楼盘名称：</div>
                        <div class="td">
                            <el-select
                                v-model.trim="searchData.project_id"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="selectProject"
                                :loading="loading"
                                @change="val => changeHandle(val, 'project_options', 'project_text')"
                            >
                                <el-option
                                    v-for="it in searchData.project_options"
                                    :key="it.id"
                                    :label="it.text"
                                    :value="it.id"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li>
                        <div class="th">财务审批状态：</div>
                        <div class="td">
                            <el-select
                                v-model="searchData.verify_status"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in reviewOptions"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="w-auto">
                        <div class="th"></div>
                        <div class="td">
                            <el-checkbox-group v-model="searchData.review_status">
                                <el-checkbox label="0">等待审核</el-checkbox>
                                <el-checkbox label="1">审核通过</el-checkbox>
                                <el-checkbox label="2">审核驳回</el-checkbox>
                                <el-checkbox label="6">释放审批</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </li>
                </ul>
                <div class="btn-area">
                    <button
                        class="btn btn-reset"
                        @click="reset"
                    >重置</button>
                    <button
                        class="btn btn-search"
                        @click="search(1)"
                    >搜索</button>
                </div>
            </div>
        </div>
        <div class="v-box">
            <div class="bd audit-list">
                <table
                    class="audit-table"
                    border="0"
                >
                    <thead>
                        <th>
                            <div class="w-100">审批ID</div>
                        </th>
                        <th>
                            <table>
                                <thead>
                                    <th>
                                        <div class="w-100">城市</div>
                                    </th>
                                    <th>
                                        <div class="w-100">成交ID</div>
                                    </th>
                                    <th>
                                        <div
                                            class="w-150"
                                            style="padding: 0px;"
                                        >付款公司</div>
                                    </th>
                                    <th>
                                        <div
                                            class="w-150"
                                            style="padding: 0px;"
                                        >开票主体</div>
                                    </th>
                                    <th>
                                        <div
                                            class="w-120"
                                            style="padding: 0px;"
                                        >开票金额</div>
                                    </th>
                                    <th>
                                        <div class="w-120">银行流水号</div>
                                    </th>
                                    <th>
                                        <div class="w-150">实际回款日期</div>
                                    </th>
                                    <th>
                                        <div class="w-120">实际回款金额</div>
                                    </th>
                                    <th>
                                        <div class="w-120">回款负责人</div>
                                    </th>
                                    <th>
                                        <div class="w-150">提交时间</div>
                                    </th>
                                    <th>
                                        <div class="w-100">财务审核状态</div>
                                    </th>
                                    <th>
                                        <div class="w-200">操作</div>
                                    </th>
                                </thead>
                            </table>
                        </th>
                    </thead>
                    <tbody v-if="tableData.length > 0">
                        <tr
                            v-for="(items,index) in tableData"
                            :key="index"
                        >
                            <td>
                                <div class="w-100">{{items.verify_batch_id}}</div>
                            </td>
                            <td>
                                <table>
                                    <tbody>
                                        <tr
                                            v-for="(item,i) in items.list_info"
                                            :key="i"
                                        >
                                            <td>
                                                <div class="w-100">{{item.city_name}}</div>
                                            </td>
                                            <td>
                                                <div class="w-100">{{item.deal_id}}</div>
                                            </td>
                                            <td>
                                                <div
                                                    class="w-150"
                                                    style="padding: 0px;"
                                                >{{item.payment_company}}</div>
                                            </td>
                                            <td>
                                                <!-- 开票主体 -->
                                                <div
                                                    class="w-150"
                                                    style="padding: 0px;"
                                                >
                                                    <ul class="audit-invoice">
                                                        <li
                                                            v-for="(value,ind) in item.invoice_list"
                                                            :key="ind"
                                                        >{{value.begin_title}}</li>
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    class="w-120"
                                                    style="padding: 0px;"
                                                >
                                                    <ul class="audit-invoice">
                                                        <li
                                                            v-for="(value,ind) in item.invoice_list"
                                                            :key="ind"
                                                        >{{value.money | currency}}</li>
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                <!-- 银行流水号 -->
                                                <div class="w-120">
                                                    <span
                                                        class="jump"
                                                        @click="jumpFlow(item.bank_flow_id, item.verify_batch_id)"
                                                    >{{item.bank_flow_id}}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="w-150">{{item.actual_datetime}}</div>
                                            </td>
                                            <td>
                                                <div class="w-120">{{item.actual_money | currency}}</div>
                                            </td>
                                            <!-- 负责人 -->
                                            <td>
                                                <div class="w-120">{{item.payback_employee.join('，')}}</div>
                                            </td>
                                            <td>
                                                <div class="w-150">{{item.create_datetime}}</div>
                                            </td>
                                            <!-- 财务审核状态 -->
                                            <td>
                                                <div class="w-100">
                                                    <span v-if="item.verify_status * 1 === 0">等待提交</span>
                                                    <span v-else-if="item.verify_status * 1 === 1">等待审核</span>
                                                    <span v-else-if="item.verify_status * 1 === 2">审核通过</span>
                                                    <span v-else-if="item.verify_status * 1 === 3">无需审核</span>
                                                    <span v-else-if="item.verify_status * 1 === 4">审核驳回</span>
                                                    <span v-else-if="item.verify_status * 1 === 5">释放通过</span>
                                                    <span v-else-if="item.verify_status * 1 === 6">释放审批</span>
                                                    <span v-else-if="item.verify_status * 1 === 7">释放驳回</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="w-100">
                                                    <span
                                                        class="operation"
                                                        v-if="item.show_pass"
                                                        @click="adopt(item, 'odd')"
                                                    >通过</span>
                                                    <span
                                                        class="operation delete"
                                                        @click="singleReject(item, 'odd')"
                                                        v-if="item.show_reject"
                                                    >驳回</span>
                                                    <span
                                                        class="operation delete"
                                                        @click="reasonReject(item.reject_reason)"
                                                        v-if="item.show_reject_reason"
                                                    >驳回理由</span>
                                                </div>
                                            </td>
                                            <td
                                                v-if="i === 0"
                                                :rowspan="items.list_info.length"
                                                style="border-bottom: none"
                                            >
                                                <div class="w-100 all">
                                                    <span
                                                        class="operation"
                                                        v-if="items.show_see_vouch"
                                                        @click="seeProof(items)"
                                                    >查看凭证</span>
                                                    <span
                                                        class="operation"
                                                        v-if="items.show_see_attach"
                                                        @click="seeFile(items)"
                                                    >查看附件</span>
                                                    <span
                                                        class="operation"
                                                        v-if="items.show_batch_pass"
                                                        @click="adopt(items, 'all')"
                                                    >全部通过</span>
                                                    <span
                                                        class="operation delete"
                                                        @click="singleReject(items, 'all')"
                                                        v-if="items.show_batch_reject"
                                                    >全部驳回</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="18">
                                <div class="noData">暂无数据</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                class="page"
                v-if="pages.pageTotal * 1 > 0"
            >
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
        <el-dialog
            width="600px"
            class="reject"
            :visible.sync="is_reject_dialog"
            @close="closeReject"
        >
            <h2
                slot="title"
                class="line"
            >{{reject.title}}</h2>
            <div class="reject-body">
                <p>{{reject.text}}</p>
                <ul class="s-query">
                    <li>
                        <div class="th required">驳回理由：</div>
                        <div class="td">
                            <textarea
                                class="text-area"
                                maxlength="300"
                                v-model.trim="reject.reason"
                            ></textarea>
                        </div>
                    </li>
                </ul>
            </div>
            <div
                class="btn-area reject-btn"
                slot="footer"
            >
                <el-button
                    class="btn close-reject"
                    @click="is_reject_dialog = false"
                >取消</el-button>
                <el-button
                    class="btn submit-reject"
                    @click="submitReject"
                    :disabled="reject.reason === ''"
                >确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            width="450px"
            class="reject reason"
            :visible.sync="reasonRejectDialog.dialog"
        >
            <h2
                slot="title"
                class="line"
            >驳回原因</h2>
            <div class="reject-body">
                <ul class="s-query">
                    <li>
                        <div class="th">驳回理由：</div>
                        <div class="td">{{reasonRejectDialog.text}}</div>
                    </li>
                </ul>
            </div>
        </el-dialog>
        <!--查看附件弹窗-->
        <check-file
            ref="file"
            :file-list="fileList"
            :host="host"
        ></check-file>
    </div>
</template>
<script>
    import CheckFile from './components/CheckFile';
    import storage from '@/assets/js/utils/dataStorage';
    // 定义远程搜索需要匹配默认值的表单项字段对应关系,统一管理
    // key为下拉项数组  val为数组  第一位为选项id， 第二位为对应文本key
    const oRemote = {
        // 申请人
        apply_employee_options: ['apply_employee_id', 'apply_employee_text'],
        // 回款人
        payback_employee_options: ['payback_employee_id', 'payback_employee_text'],
        // 楼盘
        project_options: ['project_id', 'project_text']
    };
    export default {
        name: 'financial-audit',
        data() {
            return {
                loadloading: true,
                fileList: [], // 查看附件数据
                host: '', // 域名
                releaseReason: '', // 释放原因
                loading: false,
                is_reject_dialog: false,
                reject: {
                    title: '', // 驳回标题
                    text: '', // 驳回提示语内容
                    reason: '' // 驳回理由
                },
                // 财务审批状态列表
                reviewOptions: [],
                cityOptions: [], // 城市下拉列表
                searchData: {
                    verify_batch_id: '', // 审批ID
                    write_num: '', // 核销编号
                    deal_id: '', // 成交ID
                    city_id: '', // 城市ID
                    payback_employee_id: '', // 回款负责人ID
                    // 回款负责人对应文本
                    payback_employee_text: '',
                    payback_employee_options: [], // 回款负责人列表
                    apply_employee_id: '', // 申请人ID
                    // 申请人对应文本
                    apply_employee_text: '',
                    apply_employee_options: [], // 申请人列表
                    apply_datetime: [], // 申请时间
                    user_name: '', // 	客户名称
                    project_id: '', // 楼盘ID
                    // 楼盘名称文本
                    project_text: '',
                    project_options: [], // 楼盘下拉列表
                    // 审核状态 0等待 1通过 2驳回 6 释放审批  默认选中等待审核和释放审批
                    review_status: ['0', '6'],
                    verify_status: '', // 财务审批状态,
                    // 付款公司
                    payment_company: ''
                },
                pages: {
                    // 分页设置
                    defaultPageSize: 10, // 每页条数
                    indexPage: 1, // 当前页数
                    pageTotal: 0 // 总条数
                },
                // 列表数据
                tableData: [],
                // 驳回数据
                postRejectData: {},
                // 查看驳回理由弹窗状态及文案
                reasonRejectDialog: {
                    dialog: false,
                    text: ''
                },
                flowId: '' // query获取路由id
            };
        },
        methods: {
            /**
             * select选中 触发change事件
             * @param {String} val 选中的值
             * @param {String} arrKey 所要匹配数组对应的key
             * @param {string} textKey 所要保存的文本值对应的key
             */
            changeHandle(val, arrKey, textKey) {
                const text = this.getTextById(val, this.searchData[arrKey]);
                // 存储id对应文本
                this.searchData[textKey] = text;
            },
            /**
             * 根据id匹配对应文本
             * @param {String} id 字段ID
             * @param {Array} arr 要匹配的数组
             * @return {String} 匹配到的文本值
             */
            getTextById(id, arr) {
                const index = arr.findIndex(ele => ele.id === id);
                return arr[index].text;
            },
            // 驳回理由弹窗
            reasonReject(msg) {
                this.reasonRejectDialog.dialog = true;
                this.reasonRejectDialog.text = msg;
            },
            /**
             * @param {para}  value 值
             * @param {key}  searchData 的key值
             * @description: 数字输入框
             */
            inputNumber(para, key) {
                this.searchData[key] = para.replace(/[^0-9]/g, '');
            },
            jumpFlow(flowId, batchId) {
                // 新页面打开核销记录
                const { href } = this.$router.resolve({
                    path: '/payment/writeoffPayment',
                    query: {
                        flowId,
                        batchId
                    }
                });
                window.open(href, '_blank');
            },
            // 查看附件
            seeFile(items) {
                this.axios
                    .get('/backend-api/select2/select2/get-file-domain')
                    .then(res => {
                        if (res.data.code === 0) {
                            this.host = res.data.data.url;
                        }
                    });
                let params = {
                    id: items.list_info[0].bank_flow_id
                };
                this.axios
                    .get('/backend-api/expand/ex-bank-flow/get-attachment', {
                        params: params
                    })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.fileList = res.data.data.attach_list;
                            this.$refs.file.openDialog();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 查看凭证
            seeProof(items) {
                let routeData = this.$router.resolve({
                    path: '/payment/showVoucher',
                    query: {
                        flowId: items.list_info[0].bank_flow_id,
                        batchId: items.verify_batch_id
                    }
                });
                window.open(routeData.href, '_blank');
            },
            // 远程搜索楼盘名称
            selectProject(q) {
                if (q !== '') {
                    this.loading = true;
                    let params = {
                        q: q
                    };
                    this.axios
                        .get('/backend-api/common/get-project-list', { params })
                        .then(res => {
                            this.loading = false;
                            if (res.status === 200) {
                                this.searchData.project_options = res.data.data;
                            }
                        });
                }
            },
            // 远程搜索负责人
            selectPayback(q) {
                if (q !== '') {
                    this.loading = true;
                    let params = {
                        q: q
                    };
                    this.axios
                        .get('/backend-api/employee/get-employee-dropdown-list', {
                            params
                        })
                        .then(res => {
                            this.loading = false;
                            if (res.status === 200) {
                                this.searchData.payback_employee_options =
                                    res.data.data;
                            }
                        });
                }
            },
            // 远程搜索申请人
            selectApply(q) {
                if (q !== '') {
                    this.loading = true;
                    let params = {
                        q: q
                    };
                    this.axios
                        .get('/backend-api/employee/get-employee-dropdown-list', {
                            params
                        })
                        .then(res => {
                            this.loading = false;
                            if (res.status === 200) {
                                this.searchData.apply_employee_options =
                                    res.data.data;
                            }
                        });
                }
            },
            // 取消驳回
            closeReject() {
                this.reject.title = '';
                this.reject.text = '';
                this.reject.reason = '';
            },
            // 确定驳回
            submitReject() {
                this.postRejectData.reason = this.reject.reason;
                this.axios
                    .post(
                        '/backend-api/expand/ex-bank-flow/finance-reject',
                        this.postRejectData
                    )
                    .then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            this.is_reject_dialog = false;
                            this.search();
                        }
                    });
            },
            /**
             * @param {item} object 每一项参数
             * @param {type} string odd 单个通过 all全部通过
             * @description: 通过事件
             */
            adopt(item, type) {
                let postData = {};
                if (type === 'odd') {
                    postData = {
                        id: item.bank_flow_id,
                        list: [
                            {
                                business_type: item.business_type,
                                id: item.business_id,
                                deal_id: item.deal_id,
                                verify_status: item.verify_status
                            }
                        ]
                    };
                } else {
                    postData = {
                        id: item.list_info[0].bank_flow_id,
                        list: []
                    };
                    for (let i = 0; i < item.list_info.length; i++) {
                        if (item.list_info[i].verify_status * 1 !== 4) {
                            let obj = {
                                business_type: item.list_info[i].business_type,
                                id: item.list_info[i].business_id,
                                deal_id: item.list_info[i].deal_id,
                                verify_status: item.list_info[i].verify_status
                            };
                            postData.list.push(obj);
                        }
                    }
                }
                this.axios
                    .post('/backend-api/expand/ex-bank-flow/finance-pass', postData)
                    .then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            this.search();
                        }
                    });
            },
            // 调用驳回弹窗
            singleReject(item, type) {
                this.is_reject_dialog = true;
                if (type === 'all') {
                    this.reject.title = '驳回弹窗（整笔）';
                    this.reject.text = `
              您确定要对审批ID：${item.verify_batch_id} 操作 审核驳回吗？若想驳回申请，请填写驳回理由。
            `;
                } else {
                    this.reject.title = '驳回弹窗（单笔）';
                    if (item.business_type + '' === '2') {
                        this.reject.text = `
              您确定要对成交单ID：${item.deal_id}的核销记录（核销ID：${item.write_number}；实际回款金额：${item.actual_money}元） 操作释放金额吗？若释放金额，请您填写释放原因。`;
                    } else {
                        if (item.num === '') {
                            this.reject.text = `
                  您确定要对成交单ID：${item.deal_id}的核销记录（核销ID：${item.write_number}；实际回款金额：${item.actual_money}元） 操作释放金额吗？若释放金额，请您填写释放原因。
                `;
                        } else {
                            this.reject.text = `
                  您确定要对成交单ID：${item.deal_id}的第${item.num}合同预测的核销记录（核销ID：${item.write_number}；实际回款金额：${item.actual_money}元）操作 审核驳回吗？若想驳回申请，请填写驳回理由。
                `;
                        }
                    }
                }
                let postData = {};
                if (type === 'odd') {
                    postData = {
                        id: item.bank_flow_id,
                        list: [
                            {
                                business_type: item.business_type,
                                id: item.business_id,
                                deal_id: item.deal_id,
                                verify_status: item.verify_status
                            }
                        ]
                    };
                } else {
                    postData = {
                        id: item.list_info[0].bank_flow_id,
                        list: []
                    };
                    for (let i = 0; i < item.list_info.length; i++) {
                        let obj = {
                            business_type: item.list_info[i].business_type,
                            id: item.list_info[i].business_id,
                            deal_id: item.list_info[i].deal_id,
                            verify_status: item.list_info[i].verify_status
                        };
                        postData.list.push(obj);
                    }
                }
                this.postRejectData = postData;
            },
            // 分页改变事件
            pageChange(indexPage) {
                this.pages.indexPage = indexPage;
                this.search();
            },
            // 获取城市
            getCity() {
                let params = {
                    type: '2'
                };
                this.axios
                    .get('/backend-api/select2/bank/get-city-dropdown-list', {
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
            },
            // 重置数据
            reset() {
                storage.setStorSimple('financeSearch', '');
                this.pages.indexPage = 1;
                for (let k in this.searchData) {
                    this.searchData[k] = '';
                }
                this.searchData.review_status = [];
                this.initData();
            },
            // 将本地数据赋值到默认搜索项
            setDefaultValue() {
                const searchCondition = storage.getStorage('financeSearch');
                if (searchCondition) {
                    searchCondition.apply_datetime = [searchCondition.apply_datetime_start, searchCondition.apply_datetime_end];
                    // 遍历对应关系对象 对三个远程搜索赋值
                    Object.keys(oRemote).forEach(ele => {
                        const listObj = {
                            id: searchCondition[oRemote[ele][0]],
                            text: searchCondition[oRemote[ele][1]]
                        };
                        this.searchData[ele].push(listObj);
                    });
                    Object.assign(this.searchData, searchCondition);
                }
            },
            // 搜素数据
            search(page) {
                let seachOptions = {
                    verify_batch_id: this.searchData.verify_batch_id,
                    write_num: this.searchData.write_num,
                    deal_id: this.searchData.deal_id,
                    city_id: this.searchData.city_id,
                    payback_employee_id: this.searchData.payback_employee_id,
                    apply_employee_id: this.searchData.apply_employee_id,
                    apply_datetime_start: this.searchData.apply_datetime[0]
                        ? this.searchData.apply_datetime[0]
                        : '',
                    apply_datetime_end: this.searchData.apply_datetime[1]
                        ? this.searchData.apply_datetime[1]
                        : '',
                    user_name: this.searchData.user_name,
                    project_id: this.searchData.project_id,
                    review_status: this.searchData.review_status,
                    verify_status: this.searchData.verify_status,
                    page: page || this.pages.indexPage
                };
                this.initData(seachOptions);
                // 存储三个远程搜索id对应的文本值
                const res = this.searchData;
                const localData = {...seachOptions};
                // 回款负责人对应文本
                localData.payback_employee_text = res.payback_employee_text;
                // 申请人对应文本
                localData.apply_employee_text = res.apply_employee_text;
                // 楼盘名称文本
                localData.project_text = res.project_text;
                // 将搜索结果存储在本地
                storage.setStorSimple('financeSearch', localData);
            },
            // 初始化数据
            initData(params) {
                this.loadloading = true;
                let getData = params || {
                    page: 1
                };
                getData.id = this.flowId ? this.flowId : '';
                this.axios
                    .post(
                        '/backend-api/expand/ex-bank-flow/finance-audit-list',
                        getData
                    )
                    .then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            this.loadloading = false;
                            this.tableData = res.data.data.grid_data
                                ? res.data.data.grid_data
                                : [];
                            this.pages.pageTotal = res.data.data.total_count * 1;
                            this.pages.defaultPageSize =
                                res.data.data.page_size * 1;
                            this.pages.indexPage = res.data.data.page * 1;
                        }
                    });
            }
        },
        created() {
            this.flowId = this.$route.query.id;
            this.getCity();
            this.setDefaultValue();
            // this.initData()
            this.search(1);
            let params = {
                type: '1'
            };
            this.axios
                .get('/backend-api/expand/ex-bank-flow/constants', { params })
                .then(res => {
                    if (res.data.code === 0) {
                        this.reviewOptions = res.data.data.finance_verify_status;
                    }
                });
            // this.selectApply(' ');
        },
        components: { CheckFile }
    };
</script>


<style lang="less" scoped>
.financial-audit {
    padding: 0 20px;
    .line {
        position: relative;
        padding-left: 14px;
        margin-bottom: 10px;
    }
    .line:before {
        position: absolute;
        left: 0;
        top: 10px;
        content: '';
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
        }
        > li.w-auto {
            width: auto;
        }
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
    }
    .page {
        margin-top: 20px;
        text-align: center;
        /deep/ .el-pagination {
            display: inline-block;
        }
    }
    .audit-list {
        overflow: auto;
        .noData {
            text-align: center;
            line-height: 45px;
            font-size: 14px;
        }
    }
    .audit-table {
        border: 1px solid #ebeef5;
        td,
        th {
            border: 1px solid #ebeef5;
            > div {
                font-size: 14px;
                word-break: break-all;
                padding: 0 8px;
                .jump {
                    color: #1662b3;
                    border-bottom: 1px solid #1662b3;
                    cursor: pointer;
                }
            }
        }
        th {
            > div {
                padding: 15px 8px;
            }
        }
        td > div,
        th > div {
            text-align: center;
        }
        th > table {
            th {
                border-top: none;
                border-bottom: none;
            }
            th:first-child {
                border-left: none;
            }
            th:last-child {
                border-right: none;
            }
        }
        td > table {
            tr:hover {
                background: #f5f7fa;
            }
            tr:first-child td:last-child {
                background: #fff;
            }
            tr {
                &:first-child td {
                    border-top: none;
                }
                &:last-child td {
                    border-bottom: none;
                }
                td:first-child {
                    border-left: none;
                }
                td:last-child {
                    border-right: none;
                }
            }
        }
        .w-150 {
            width: 150px;
        }
        .w-200 {
            width: 200px;
        }
        .w-100 {
            width: 100px;
        }
        .w-120 {
            width: 120px;
        }
        .all {
            .operation {
                display: block;
                width: 75px;
                margin: 10px auto;
            }
        }
        .operation {
            display: inline-block;
            font-size: 12px;
            cursor: pointer;
            padding: 3px 6px;
            border-radius: 4px;
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
        }
        .operation.delete {
            background-color: #f56c6c;
            border-color: #f56c6c;
        }
        .audit-invoice {
            > li + li {
                border-top: 1px solid #ddd;
            }
            > li {
                padding: 8px 0;
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
            overflow: hidden;
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
                border: 1px solid #333;
                margin-right: 15px;
                color: #333;
            }
            .submit-reject {
                border: 1px solid #337ab7;
                margin-left: 15px;
                background: #337ab7;
                color: #fff;
            }
        }
    }
    /deep/ .reason {
        .line {
            margin-bottom: 0;
        }
        .el-dialog__header {
            padding-bottom: 0;
        }
        .reject-body .s-query {
            margin-top: 0;
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
    /deep/ .reason-dia .el-dialog__body,
    /deep/ .file .el-dialog__body {
        padding: 0 20px 10px;
    }
    /deep/ .file,
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
    .file {
        .s-query {
            max-height: 500px;
            overflow: auto;
        }
        li {
            margin-bottom: 0;
        }
        .sub-li {
            overflow: hidden;
        }
        .down-load a {
            color: #1662b3;
            margin-left: 10px;
            text-decoration: underline;
        }
        .item {
            overflow: hidden;
            .sub-item {
                float: left;
                margin-left: 10px;
            }
        }
    }
}
</style>
