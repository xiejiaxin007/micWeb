<!--
 * @Name: 微信好友列表
 * @Description: 微信好友列表
 * @Author: baiyunfei
 * @Date: 2019-09-24 15:39:52
 * @update: 2019-11-14
 * @Editors: baiyunfei, zhengchao
 -->
<template>
    <div
        v-loading="pageLoading"
        class="address-list-cantainer">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>微信好友管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="address-list-main">
            <div class="address-list-info">
                <consultant-info :dataObj="consultantInfoData"></consultant-info>
                <div class="rank-list">
                    <rank-list :dataObj="rankListData"></rank-list>
                </div>
                <friend-group
                    @objTitle="objTitleFn"
                    :dataObj="groupData"></friend-group>
            </div>
            <div class="address-list">
                <div class="address-list-title">
                    <span class="address-group-name">{{titleObj.name}}（{{titleObj.num}}个）</span>
                    <span
                        v-if="titleObj.value === '1'"
                        class="address-title-tips"
                        >所有的客户都需要绑定订单，请点击「绑定到订单」将客户绑定到订单中，任务未完成系统会一直提示哦~</span>
                    <span
                        v-if="titleObj.value === '5'"
                        class="address-title-tips">需要分组的微信好友，请点击「编辑分组」对好友进行分类，任务未完成系统会一直提示哦~</span>
                </div>
                <div class="address-list-search">
                    <el-form
                        :inline="true"
                        :model="searchObj"
                        class="demo-form-inline">
                        <el-form-item label="微信名称：">
                            <el-input
                                v-model="searchObj.wxName"
                                placeholder="搜索微信名称"></el-input>
                        </el-form-item>
                        <el-form-item label="微信号码：">
                            <el-input
                                v-model="searchObj.wxAccount"
                                placeholder="搜索微信号码"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定订单：">
                            <el-input
                                oninput="value=value.replace(/[^\d]/g,'')"
                                v-model="searchObj.order"
                                placeholder="搜索绑定订单"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                class="search-button"
                                type="primary"
                                @click="onSubmit">搜&nbsp;索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div
                    v-loading="tableLoading"
                    class="friend-list-table">
                    <div class="page-num">第{{(currentPage - 1) * 20 + 1}}-{{(currentPage - 1) * 20 + 20}}条数据，共{{pageTotal}}条数据</div>
                    <el-table
                        border
                        header-row-class-name="has-bg"
                        :data="tableData"
                        style="width: 100%">
                        <el-table-column
                            label="头像"
                            width="90"
                            align="center">
                            <template slot-scope="scope">
                                <img
                                    class="avatar"
                                    :src="scope.row.head_img"
                                    alt ="微信头像"
                                    />
                            </template>
                        </el-table-column>
                        <el-table-column label="微信名称">
                            <template slot-scope="scope">
                                <span v-if="scope.row.suspicion_sale === '1'">{{scope.row.nike_name}}(疑似销售)</span>
                                <span v-else>{{scope.row.nike_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="wx_num"
                            v-if="role === 'header'"
                            label="微信号"></el-table-column>
                        <el-table-column
                            label="绑定订单">
                            <template slot-scope="scope">
                                <span :class="[scope.row.bind_id === 0 ? 'no-bind' : '']">{{scope.row.order_desc}}</span>
                                <span v-if="scope.row.audit && scope.row.audit.result == '3'" class="other-tip">审核被驳回，原因：{{scope.row.audit.reason}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="分组">
                            <template slot-scope="scope">
                                <span v-if="scope.row.group_type !== '5'">{{scope.row.group_desc}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div class="button-group">
                                    <span v-if="scope.row.auth_update" class="edit-group" @click="handleEdit(scope.row)">修改分组</span>
                                    <span v-if="scope.row.auth_bind" class="bound-group" @click="handleOrder(scope.row)">绑定订单</span>
                                    <span v-if="scope.row.auth_update_order_bind" class="bound-group" @click="changeBoundOrder(scope.row)">编辑绑定</span>
                                    <span v-if="scope.row.audit && scope.row.audit.result === 1">审核中</span>
                                    <span v-if="scope.row.auth_talk_content" class="bound-group" @click="goWxChatContent(scope.row)">查看聊天记录</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div
                        v-if="parseInt(pageTotal) > 20"
                        class="page-pagination">
                        <el-pagination
                            @current-change="pageChangeFn"
                            :current-page="currentPage"
                            background
                            :page-size="20"
                            layout="prev, pager, next"
                            :total="parseInt(pageTotal)"></el-pagination>
                    </div>
                </div>
                <!-- 修改绑定到订单弹窗 -->
                <el-dialog
                    v-loading="changOrderLoading"
                    custom-class="editor-dialog"
                    :visible.sync="editorDialogVisible"
                    :show-close="false"
                    width="460px">
                    <div
                        slot="title"
                        class="editor-dialog-title">{{editTypeText}}订单绑定<i @click="editorDialogVisible = !editorDialogVisible" class="icon-close" aria-hidden="true"></i></div>
                    <div class="friend-user-info">
                        <div class="user-avatar">
                            <img
                                v-if="!editorOrderData.head_img"
                                src="../../../assets/images/img-user-avatar.png"
                                alt="微信头像" />
                            <img v-else
                                :src="editorOrderData.head_img"
                                alt="微信头像" />
                        </div>
                        <div class="user-info">
                            <div class="user-name">{{editorOrderData.nike_name}}</div>
                            <div class="user-account">{{editorOrderData.wx_num}}</div>
                            <div class="user-group order-info">
                                <span class="dialog-label">绑定订单：</span>
                                <span>{{editorOrderData.order_desc}}</span>
                            </div>
                            <div class="btn-wrap">
                                <a
                                    :class="`btn-editor ${editType === 1 ? 'active' : ''}`"
                                    @click = "editType = 1"
                                    href="javascript:void(0)">
                                    修改
                                </a>
                                <a
                                    :class="`btn-editor ${editType === 2 ? 'active' : '' }`"
                                    @click = "editType = 2"
                                    href="javascript:void(0)">
                                    删除
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        class="order-select"
                        v-show="editType === 1 && editType !==0">
                        <span class="dialog-label">{{editTypeText}}订单：</span>
                        <el-select
                            v-model="editorOrderId"
                            filterable
                            remote
                            placeholder="搜索客户姓名、手机订单"
                            :remote-method="(query)=>remoteOrderMethod(query,true)"
                            @focus="focusOrder()"
                            :loading="loading">
                            <el-option
                                v-for="item in editorOrderOptions"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id"></el-option>
                        </el-select>
                        <i class="icon-caret-bottom" aria-hidden="true"></i>
                    </div>
                    <div
                        v-show="editType !==0"
                        class="order-select">
                        <span class="dialog-label">原因说明：</span>
                        <el-input
                            type="textarea"
                            :rows="2"
                            maxlength="300"
                            :placeholder="'请说明'+editTypeText+'原因'"
                            v-model="editorOrderDes"></el-input>
                    </div>
                    <div
                        v-show="editType !==0"
                        class="order-select upload-button">
                        <span class="dialog-label">上传图片：</span>
                        <div>
                            <div v-if="imgBase.length">
                                <ul class="dialog-img-list">
                                    <li
                                        v-for="(item, index) in imgBase"
                                        :key="index">
                                        <i class="btn-close" aria-hidden="true" @click="delImg(index)">-</i>
                                        <div class="img">
                                            <img
                                            alt="订单图片"
                                            :src="item.fileURL" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <jl-file-upload
                                v-if="imgBase.length < uploadMaxLimit"
                                ref="imgUpload"
                                upID="imgUpload"
                                fileType="jpg,jpeg,png"
                                fileMaxSize="10mb"
                                :ossData="ossData"
                                :isMulti="true"
                                :limit="uploadMaxLimit - imgBase.length"
                                @beforeUpdate="loading = true"
                                @getFileURL="getFileURL">
                                <el-button
                                    size="small"
                                    plain>
                                    <i class="el-icon-upload" aria-hidden="true"></i>点击上传
                                </el-button>
                            </jl-file-upload>
                        </div>
                    </div>
                    <div
                        v-show="editType !==0"
                        class="dialog-tips">
                        注意：{{editTypeText}}绑定订单关系需要经过审核哦，审核通过后才可以{{editTypeText}}成功
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer">
                        <el-button @click="editorDialogVisible = false">取 消</el-button>
                        <el-button
                            type="primary"
                            @click="beforeSaveChangeOrder(editorOrderData)">保 存</el-button>
                    </div>
                </el-dialog>
                <!-- 绑定到订单弹窗 -->
                <el-dialog
                    custom-class="editor-dialog bound-dialog"
                    :visible.sync="boundDialogVisible"
                    :show-close="false"
                    width="460px">
                    <div
                        slot="title"
                        class="editor-dialog-title">绑定到订单<i @click="boundDialogVisible = !boundDialogVisible" class="icon-close" aria-hidden="true"></i></div>
                    <div class="friend-user-info">
                        <div class="user-avatar">
                            <img v-if="!boundData.head_img"
                            src="../../../assets/images/img-user-avatar.png"
                            alt="微信头像" />
                            <img
                                v-else
                                :src="boundData.head_img"
                                alt="微信头像" />
                        </div>
                        <div class="user-info">
                            <div class="user-name">{{boundData.nike_name}}</div>
                            <div class="user-account">{{boundData.wx_num}}</div>
                        </div>
                    </div>
                    <div class="user-group">
                        <span class="dialog-label">分类：</span>
                        <span>{{boundData.group_desc}}</span>
                    </div>
                    <div class="order-select">
                        <span class="dialog-label">选择客户订单：</span>
                        <el-select
                            v-model="orderBunder"
                            filterable
                            remote
                            reserve-keyword
                            :clearable="true"
                            placeholder="搜索客户姓名、手机、订单"
                            :remote-method="remoteOrderMethod"
                            :loading="orderLoading">
                            <el-option
                                v-for="(item,index) in orderOption"
                                :key="index"
                                :label="item.text"
                                :value="item.id"></el-option>
                        </el-select>
                        <i class="icon-caret-bottom" aria-hidden="true"></i>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer">
                        <el-button @click="boundDialogVisible = false">取 消</el-button>
                        <el-button
                            type="primary"
                            @click="boundOrderFn(boundData.wx_id, boundData.group_id)">保 存</el-button>
                    </div>
                </el-dialog>
                <!-- 编辑分组弹窗 -->
                <el-dialog
                    custom-class="editor-dialog"
                    :visible.sync="editorGroupVisible"
                    :show-close="false"
                    width="460px">
                    <div
                        slot="title"
                        class="editor-dialog-title"
                        v-if="this.dialogGroup === '5'">编辑分组 <i @click="editorGroupVisible = !editorGroupVisible" class="icon-close" aria-hidden="true"></i></div>
                    <div
                        slot="title"
                        class="editor-dialog-title"
                        v-else>修改分组 <i @click="editorGroupVisible = !editorGroupVisible" class="icon-close" aria-hidden="true"></i></div>
                    <div class="friend-user-info">
                        <div class="user-avatar">
                            <img
                                v-if="!editorGroupData.head_img"
                                src="../../../assets/images/img-user-avatar.png"
                                alt="微信头像" />
                            <img
                            v-else
                            :src="editorGroupData.head_img"
                            alt="微信头像" />
                        </div>
                        <div class="user-info">
                            <div class="user-name">{{editorGroupData.nike_name}}</div>
                            <div class="user-account">{{editorGroupData.wx_num}}</div>
                        </div>
                    </div>
                    <div class="group-list">
                        <el-radio-group v-model="dialogGroup">
                            <el-radio
                                :key="index"
                                v-for="(obj,index) in groupData"
                                v-show="obj.is_show"
                                :label="obj.value">{{obj.name}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer">
                        <el-button @click="editorGroupVisible = false">取 消</el-button>
                        <el-button
                            type="primary"
                            @click="editorGroup(editorGroupData)">保 存</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapState
} from "vuex";
import addressBookListApi from "./api/addressListApi";
import ConsultantInfo from "./components/ConsultantInformation";
import FriendGroup from "./components/PepoleGroupList";
import RankList from "./components/RankList";
import { getSign } from '@/api/commonApi';
export default {
    name: "addressBookList",
    data() {
        return {
            // 上传文件列表
            fileList: [],
            // 修改订单绑定
            editorDialogVisible: false,
            // 绑定订单弹窗
            boundDialogVisible: false,
            // 修改分组弹窗
            editorGroupVisible: false,
            // 绑定订单弹窗默认数据
            boundData: {},
            // 修改分组弹窗
            dialogGroup: "",
            // 编辑分组数据
            editorGroupData: {},
            // 修改订单绑定data
            editorOrderData: {},
            // 修改订单下拉选项
            editorOrderOptions: [],
            // 修改订单订单id
            editorOrderId: "",
            loading: false,
            // 页面loading
            pageLoading: false,
            // 修改订单原因
            editorOrderDes: "",
            // 上传图片修改订单URL
            imgBase: [],
            // search 对象
            searchObj: {
                wxName: "",
                wxAccount: "",
                order: ""
            },
            // 绑定订单单号
            orderBunder: "",
            // 订单搜索loading
            orderLoading: false,
            // 订单搜索配置项
            orderOption: [],
            // 咨询师信息数据
            consultantInfoData: {},
            // 待完成任务列表数据
            rankListData: {},
            // 好友分组类型
            groupType: "",
            // 好友分组数据
            groupData: [],
            // 列表标题
            titleObj: {
                name: "",
                num: "",
                value: ""
            },
            // 微信好友列表数据
            tableData: [],
            // 微信好友列表loading
            tableLoading: false,
            // 修改订单上传文件loading
            changOrderLoading: false,
            // 当前分页
            currentPage: 1,
            // 列表总数
            pageTotal: 0,
            // 修改绑定订单 编辑方式（1修改/2删除）
            editType: 0,
            // 上传最大上传数量
            uploadMaxLimit: 5,
            // 请求阿里地址返回的数据
            ossData: {},
        };
    },
    mounted() {
        if (this.$route.query.uid) {
            localStorage.setItem("headerUid", this.$route.query.uid);
        }
        if (this.role) {
            this.getWechatInfo();
        }
        this.getSignCode();
    },
    methods: {
        /**
         * 获取文件
         * @param {String} fileList 文件列表
         * @param {String} type 类型 
         * @return
         */
        getFileURL(fileList, type) {
            // 关闭加载loading
            this.loading = false;
            // 如果返回文件列表长度为0
            if (fileList.length === 0) {
                this.$message('上传失败,请重新上传');
                return;
            }
            fileList.forEach(imgItem => {
                if (this.imgBase.find(ele => ele.originName === imgItem.originName)) {
                    this.$message('已过滤掉重复图片');
                } else {
                    this.imgBase.push(imgItem);
                }
            })
        },
        // 获取阿里云上传签名
        async getSignCode() {
            let params = {
                cate: this.uploadUrl
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
         * @description: 点击左侧分组
         * @param {object} obj 子组件传过来的数据
         */
        objTitleFn(obj) {
            this.groupType = obj.value;
            this.titleObj.num = obj.num;
            this.pageTotal = obj.num;
            this.$nextTick(() => {
                this.getAddressListFn(obj.group_id);
            });
        },
        /**
         * @description: 订单搜索
         * @param {string} query 搜索文案
         * @param {bool} 是否为编辑订单弹窗搜索
         */
        async remoteOrderMethod(query, bool) {
            try {
                let params = {
                    search_value: query
                };
                this.orderLoading = true;
                let result = await addressBookListApi.getOrderSearch(params);
                if (result.data.code === 0) {
                    this.orderLoading = false;
                    if (bool) {
                        this.editorOrderOptions = result.data.data;
                    } else {
                        this.orderOption = result.data.data;
                    }
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取咨询师微信信息
        async getWechatInfo() {
            try {
                let params = {
                    employee_id: this.uid
                };
                this.pageLoading = !this.pageLoading;
                let result = await addressBookListApi.getWechatInfo(params);
                if (result.data.code === 0) {
                    this.consultantInfoData = result.data.data.info || {};
                    this.rankListData = result.data.data.task || {};
                    this.groupData = result.data.data.friend || [];
                    this.pageLoading = !this.pageLoading;
                } else {
                    this.$message.error(result.data.msg);
                    this.pageLoading = !this.pageLoading;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 获取微信分组好友
         * @param {String} groupId 分组id
         */
        async getAddressListFn(groupId) {
            this.pageLoading = !this.pageLoading;
            try {
                let params = {
                    group: this.groupType,
                    group_id: groupId,
                    employee_id: this.uid,
                    order_id: this.searchObj.order,
                    wx_id: this.searchObj.wxAccount,
                    nike_name: this.searchObj.wxName || this.$route.query.searchLabel,
                    page: this.currentPage
                };
                let result = await addressBookListApi.getAddressList(params);
                if (result.data.code === 0) {
                    this.tableData = result.data.data.list;
                    this.titleObj.name = result.data.data.head_info.group_name;
                    this.titleObj.value = result.data.data.head_info.group_type;
                    this.pageTotal = result.data.data.head_info.total;
                    this.pageLoading = !this.pageLoading;
                } else {
                    this.$message.error(result.data.msg);
                    this.pageLoading = !this.pageLoading;
                }
            } catch (error) {
                this.pageLoading = !this.pageLoading;
                console.log(error);
            }
        },
        /**
         * @description: 切换分页
         * @param {string }page 当前页码
         */
        pageChangeFn(page) {
            this.currentPage = page;
            this.getAddressListFn();
        },
        /**
         * @description: 绑定订单
         * @param {object}row 当前行数据
         */
        handleOrder(row) {
            this.boundData = row;
            this.orderBunder = "";
            this.boundDialogVisible = !this.boundDialogVisible;
        },
        /**
         * @description: 绑定订单
         * @param {string} wxId 微信号
         * @param {string} groupId 当前行的id
         */
        async boundOrderFn(wxId, groupId) {
            try {
                let params = {
                    order_id: this.orderBunder,
                    wx_id: wxId,
                    employee_id: this.uid,
                    group_id: groupId
                };
                if (this.orderBunder == "") {
                    this.$message.error("请选择客户订单！");
                    return false;
                }
                this.pageLoading = !this.pageLoading;
                let result = await addressBookListApi.boundOrder(params);
                if (result.data.code === 0) {
                    this.pageLoading = !this.pageLoading;
                    this.boundDialogVisible = !this.boundDialogVisible;
                    this.$message.success("绑定成功！");
                    this.getAddressListFn();
                    this.getWechatInfo();
                } else {
                    this.pageLoading = !this.pageLoading;
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description:修改分组
         * @param {object} row  当前行数据
         */
        handleEdit(row) {
            this.editorGroupData = row;
            this.dialogGroup = row.group_type;
            this.editorGroupVisible = !this.editorGroupVisible;
        },
        /**
         * @description: 保存修改分组
         * @param {object} row 当前行的数据
         */
        async editorGroup(row) {
            if (this.dialogGroup === "5") {
                this.$message.error("请选择分组类型！");
                return false;
            }
            try {
                let params = {
                    group_id: row.group_id,
                    group_type: this.dialogGroup,
                    employee_id: this.uid
                };
                this.pageLoading = !this.pageLoading;

                let result = await addressBookListApi.saveEditorGroup(params);
                if (result.data.code === 0) {
                    this.pageLoading = !this.pageLoading;
                    this.editorGroupVisible = false;
                    this.$message.success("修改成功！");
                    this.getAddressListFn();
                    this.groupData = result.data.data.group_data;
                    this.getWechatInfo();
                } else {
                    this.pageLoading = !this.pageLoading;
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 查询事件
        onSubmit() {
            this.currentPage = 1;
            this.getAddressListFn();
        },
        /**
         * @description: 修改绑定订单
         * @param {Object } row 整行数据
         */
        changeBoundOrder(row) {
            this.editorOrderData = row;
            this.editorOrderDes = "";
            this.editorDialogVisible = !this.editorDialogVisible;
        },
        // 搜索框获取焦点赋值下拉
        focusOrder() {
            if (this.editorOrderId !== "") {
                this.remoteOrderMethod(this.editorOrderId, true);
            }
        },
        /**
         * @description: 判断对订单的处理方式 修改1还是删除2
         * @param {object } row 保存订单当前行的数据
         */
        beforeSaveChangeOrder(row) {
            let type = this.editType;
            if (type === 1) {
                this.saveChangeOrder(row);
            } else if (type === 2) {
                this.deleteBindOrder(row);
            } else {
                this.editorDialogVisible = !this.editorDialogVisible;
            }
        },
        /**
         * @description: 保存修改订单绑定
         * @param {object } row 保存订单当前行的数据
         */
        async saveChangeOrder(row) {
            try {
                let imglist = [];
                this.imgBase && this.imgBase.forEach(item => {
                    imglist.push(item.upURL);
                })
                let params = {
                    order_wechat_id: row.bind_id,
                    change_to: this.editorOrderId,
                    reason: this.editorOrderDes,
                    img: imglist
                };
                if (this.editorOrderId === "") {
                    this.$message.error("修改订单id不能为空！");
                    return;
                }
                if (this.editorOrderDes === "") {
                    this.$message.error("修改原因不能为空！");
                    return;
                }
                let result = await addressBookListApi.saveChangeOrder(params);
                if (result.data.code === 0) {
                    this.editorDialogVisible = !this.editorDialogVisible;
                    this.$message.success("修改绑定已成功提交审核！");
                    this.getAddressListFn();
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 删除订单绑定
         * @param {object } row 保存订单当前行的数据
         */
        async deleteBindOrder(row) {
            try {
                let imglist = [];
                this.imgBase && this.imgBase.forEach(item => {
                    imglist.push(item.upURL);
                })
                let params = {
                    order_wechat_id: row.bind_id,
                    reason: this.editorOrderDes,
                    img: imglist
                };
                if (this.editorOrderDes === "") {
                    this.$message.error("删除原因不能为空！");
                    return;
                }
                let result = await addressBookListApi.deleteBindOrder(params);
                if (result.data.code === 0) {
                    this.editorDialogVisible = !this.editorDialogVisible;
                    this.$message.success("删除绑定订单已成功提交审核！");
                    this.getAddressListFn();
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 跳转到微信聊天页面
         * @param {object} 当前行的数据
         */
        goWxChatContent(obj) {
            this.$router.push(
                `/weChatAddressBook/wxChatContent?nike_name=${obj.nike_name}&&wx_id=${obj.wx_id}&&uid=${this.uid}`
            );
        },
        /**
         * @description: 删除文件
         * @param {number} index 删除的文件索引
         */
        delImg(index) {
            this.imgBase.splice(index, 1);
        }
    },
    components: {
        ConsultantInfo,
        FriendGroup,
        RankList
    },
    computed: {
        ...mapState({
            uid: state => {
                if (state.role === "header") {
                    return state.uid;
                } else {
                    return localStorage.getItem("headerUid");
                }
            },
            // 权限： 咨询师主管 需要传咨询师主管id
            role: state => state.role
        }),
        // 编辑订单绑定信息时 根据tab不同文案进行修改
        editTypeText() {
            let textGroup = ['编辑', '修改', '删除'];
            return textGroup[this.editType];
        }
    },
    watch: {
        // 监听vuex中的权限数有值时
        uid: {
            handler: function (val, oldval) {
                // 获取咨询师信息
                this.getWechatInfo();
            },
            deep: true
        },
        // 监听编辑弹窗关闭清空原始数据
        boundDialogVisible: {
            handler: function (val, oldval) {
                if (!val) {
                    this.orderBunder = "";
                    this.orderOption = [];
                }
            },
            deep: true
        },
        // 监听修改绑定弹窗关闭清空数据
        editorDialogVisible: {
            handler: function (val, oldval) {
                if (!val) {
                    this.imgBase = [];
                    this.editorOrderId = "";
                    // 提交按钮重置最大数量并清空上次已存文件
                    this.uploadMaxLimit = 5;
                    this.$refs.uploadBtn.clearFiles();
                    // 修改/删除tab页面初始化
                    this.editType = 0;
                }
            },
            deep: true
        },
        // 监听router
        '$route': {
            handler: function(val, oldval) {
                this.currentPage = 1;
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
@import url("./css/dialog");

.address-list-cantainer {
    .el-breadcrumb {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #354052;
    }

    .rank-list {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .address-list-main {
        display: flex;

        .address-list {
            flex: 1;
            margin-left: 20px;
            background: #fff;
            padding: 20px;

            .address-list-title {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #ddd;

                .address-group-name {
                    position: relative;
                    font-size: 16px;
                    padding: 10px 0;
                    font-weight: bold;
                    color: #333;

                    &::before {
                        content: "";
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        display: block;
                        width: 100%;
                        height: 2px;
                        background: #a9a9a9;
                    }
                }

                .address-title-tips {
                    font-size: 14px;
                    margin-left: 10px;
                    color: #a9bacf;
                }
            }

            .address-list-search {
                .search-button {
                    background: #2e9ae2;
                    border-radius: 4px;
                    width: 98px;
                    height: 38px;
                    padding: 0;
                    line-height: 38px;
                }
            }

            .friend-list-table {
                .page-num {
                    font-size: 12px;
                    line-height: 24px;
                    margin-bottom: 10px;
                    color: #333;
                }

                .avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 4px;
                    object-fit: contain;
                }

                .el-table {
                    color: #333;
                }

                .no-bind {
                    font-size: 14px;
                    color: #ff4958;
                }

                .other-tip {
                    font-size: 14px;
                    color: #ff4958;
                    display: block;
                }
                /deep/.has-bg th {
                    font-size: 14px;
                    background: #f4f6f9;
                    color: #333;
                }

                .edit-group {
                    font-size: 14px;
                    color: #ff8800;
                }

                .bound-group {
                    font-size: 14px;
                    color: #2e9ae2;
                }

                .button-group {
                    display: flex;
                    justify-content: space-around;

                    span {
                        cursor: pointer;
                    }
                }

                .page-pagination {
                    margin-top: 20px;
                    padding-top: 30px;
                    text-align: center;
                    border-top: 1px solid #f4f6f9;
                }
            }
        }
    }
}

.el-table--border th {
    background: #f4f6f9;
}
</style>
