<!--
 * @Name: 待分组好友页面
 * @Description: 待分组好友页面
 * @Author: baiyunfei
 * @Date: 2019-09-25 15:32:43
 * @Editors: baiyunfei
 -->
<template>
    <div class="address-list-cantainer">
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
                    <rank-list
                        @objTitle="objTitleFn"
                        :dataObj="rankListData"></rank-list>
                </div>
                <friend-group
                    :dataObj="groupData"
                    @objTitle="objTitleFn"></friend-group>
            </div>
            <div class="address-list">
                <div class="address-list-title">
                    <span class="address-group-name">{{titleObj.label}}（{{titleObj.num}}个）</span>
                    <span class="address-title-tips">需要分组的微信好友，请点击「编辑分组」对好友进行分类，任务未完成系统会一直提示哦~</span>
                    <div class="batch-button-group">
                        <el-button
                            v-show="!isBatch && role === 'header'"
                            @click="batchButton()"
                            class="batch-button"
                            type="primary">批量操作</el-button>
                        <el-button
                            class="cancle-button"
                            v-show="isBatch"
                            @click="cancleBatch"
                            plain>取消</el-button>
                        <el-button
                            :disabled="hasGroup"
                            class="save-button"
                            v-show="isBatch"
                            @click="batchSaveGroup"
                            type="primary">保存</el-button>
                    </div>
                </div>
                <div
                    v-loading="listLoading"
                    class="bound-list">
                    <ul v-if="!isBatch">
                        <li
                            v-for="(obj,index) in tableObj"
                            :key="index">
                            <div class="bound-user-info">
                                <div class="bound-user-avatar">
                                    <img 
                                    v-if="obj.avatar" 
                                    :src="obj.avatar" 
                                    alt="微信头像" />
                                    <img 
                                        v-else 
                                        src="../../../assets/images/img-user-avatar.png" 
                                        alt="微信头像" />
                                </div>
                                <div class="bound-user-identi">
                                    <div class="bound-user-name">{{obj.nickname}}</div>
                                    <div
                                        v-if="role ==='header'"
                                        class="bound-user-account">{{obj.wx_num}}</div>
                                </div>
                            </div>
                            <div class="bound-order-info">
                                <el-button
                                    v-if="role === 'header'"
                                    @click="editorGroup(obj)"
                                    plain>编辑分组</el-button>
                                <el-button
                                    v-if="role === 'header'"
                                    @click="bindingOrder(obj)"
                                    type="primary"
                                    plain>绑定到订单</el-button>
                            </div>
                        </li>
                    </ul>
                    <ul v-else>
                        <li
                            v-for="(obj,index) in tableObj"
                            :key="index">
                            <div class="bound-user-info">
                                <div class="bound-user-avatar">
                                    <img 
                                        v-if="obj.avatar" 
                                        :src="obj.avatar" 
                                        alt="微信头像" />
                                    <img 
                                        v-else 
                                        src="../../../assets/images/img-user-avatar.png" 
                                        alt="微信头像" />
                                </div>
                                <div class="bound-user-identi">
                                    <div class="bound-user-name">{{obj.nickname}}</div>
                                    <div v-if="role === 'header'" class="bound-user-account">{{obj.wx_num}}</div>
                                </div>
                            </div>
                            <div class="bound-order-info">
                                <el-radio-group
                                    @change="changeRadio(obj.groupName,obj,index)"
                                    v-model="obj.groupName">
                                    <el-radio
                                        v-show="item.is_show"
                                        :key="i"
                                        v-for="(item,i) in groupData"
                                        :label="item.value">{{item.name}}</el-radio>
                                </el-radio-group>
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    v-if="total > 20"
                    class="page-pagination">
                    <el-pagination
                        :page-size="20"
                        @current-change="pageChangeFn"
                        :current-page="currentPage"
                        background
                        layout="prev, pager, next"
                        :total="total"></el-pagination>
                </div>
            </div>
        </div>
        <!-- 编辑分组弹窗 -->
        <el-dialog
            custom-class="editor-dialog"
            :visible.sync="editorDialogVisible"
            :show-close="false"
            width="460px">
            <div
                slot="title"
                class="editor-dialog-title">编辑分组<i @click="editorDialogVisible = !editorDialogVisible" class="icon-close" aria-hidden="true"></i></div>
            <div class="friend-user-info">
                <div class="user-avatar">
                    <img 
                    v-if="editorData.avatar" 
                    :src="editorData.avatar" 
                    alt="微信头像" />
                    <img 
                    v-else 
                    src="../../../assets/images/img-user-avatar.png" 
                    alt="微信头像" />
                </div>
                <div class="user-info">
                    <div class="user-name">{{editorData.nickname}}</div>
                    <div class="user-account">{{editorData.wx_num}}</div>
                </div>
            </div>
            <div class="group-list">
                <el-radio-group v-model="editorData.groupName">
                    <el-radio
                        v-show="obj.is_show"
                        :key="index"
                        v-for="(obj,index) in groupData"
                        :label="obj.value">{{obj.name}}</el-radio>
                </el-radio-group>
            </div>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button @click="editorDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="saveEditorGroup">保 存</el-button>
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
                    <img 
                    v-if="!bindData.avatar" 
                    src="../../../assets/images/img-user-avatar.png" 
                    alt="微信头像" />
                    <img 
                    v-else 
                    :src="bindData.avatar" 
                    alt="微信头像" />
                </div>
                <div class="user-info">
                    <div class="user-name">{{bindData.nickname}}</div>
                    <div class="user-account">{{bindData.wx_num}}</div>
                </div>
            </div>
            <div class="user-group">
                <span class="dialog-label">分组：</span>
                <span>客户</span>
            </div>
            <div class="order-select">
                <span class="dialog-label">选择客户订单：</span>
                <el-select
                    v-model="orderBunder"
                    filterable
                    remote
                    :clearable="true"
                    reserve-keyword
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
                    @click="boundOrderFn(bindData.wx_id, bindData.group_id)">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    mapState
} from "vuex";
import addressBookListApi from "./api/addressListApi";
import pendingGroupApi from "./api/pendingGroupApi";
import ConsultantInfo from "./components/ConsultantInformation";
import FriendGroup from "./components/PepoleGroupList";
import RankList from "./components/RankList";
export default {
    name: "addressBookList",
    data() {
        return {
            // 编辑弹窗
            editorDialogVisible: false,
            // 绑定弹窗
            boundDialogVisible: false,
            // 是否批量操作
            isBatch: false,
            // 列表标题
            titleObj: {},
            //未分组数据
            tableObj: [],
            // 未分组数据总数
            total: 0,
            // 未分组分页
            currentPage: 1,
            // 咨询师信息数据
            consultantInfoData: {},
            // 待完成任务列表数据
            rankListData: {},
            // 好友分组数据
            groupData: [],
            // 编辑分组数据
            editorData: {},
            // 绑定订单分组数据
            bindData: {},
            // 订单model
            orderBunder: "",
            // 搜索订单下拉数据
            orderOption: [],
            // 订单下拉loading
            orderLoading: false,
            // 批量分组数据
            batchGroupData: [],
            // 列表loading
            listLoading: false,
            // 是否有分组
            hasGroup:true
        };
    },
    mounted() {
        this.getWechatInfo();
        this.getPendingList();
    },
    methods: {
        /**
         * @description: 子组件传递过来的title信息
         * @param {object} obj 子组件传递的数据
         */
        objTitleFn(obj) {
            this.titleObj = obj;
        },
        // 获取咨询师微信信息
        async getWechatInfo() {
            try {
                let params = {
                    employee_id: this.uid
                };
                let result = await addressBookListApi.getWechatInfo(params);
                if (result.data.code === 0) {
                    this.consultantInfoData = result.data.data.info || {};
                    this.rankListData = result.data.data.task || {};
                    this.groupData = result.data.data.friend || [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取未分组列表接口
        async getPendingList() {
            this.listLoading = !this.listLoading;
            try {
                let params = {
                    employee_id: this.uid,
                    page: this.currentPage
                };
                let result = await pendingGroupApi.getTodoGroup(params);
                if (result.data.code === 0) {
                    this.listLoading = !this.listLoading;
                    this.tableObj = result.data.data.list;
                    this.total = Number(result.data.data.total);
                } else {
                    this.listLoading = !this.listLoading;
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                this.listLoading = !this.listLoading;
                console.log(error);
            }
        },
        /**
         * @description: 分页方法
         * @param {number} page 当前分页
         */
        pageChangeFn(page) {
            this.currentPage = page;
            this.getPendingList();
        },
        /**
         * @description:编辑分组
         * @param {object}  obj 编辑行数据
         */
        editorGroup(obj) {
            this.editorData.groupName = "";
            this.editorData = obj;
            this.editorDialogVisible = !this.editorDialogVisible;
        },
        // 保存修改的分组
        async saveEditorGroup() {
            if (!this.editorData.groupName) {
                this.$message.error("请选择分组类型！");
                return false;
            }
            try {
                let params = {
                    group_id: this.editorData.group_id,
                    group_type: this.editorData.groupName,
                    employee_id: this.uid
                };
                let result = await addressBookListApi.saveEditorGroup(params);
                if (result.data.code === 0) {
                    this.editorDialogVisible = !this.editorDialogVisible;
                    this.$message.success("修改成功！");
                    this.getPendingList();
                    this.getWechatInfo();
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 点击绑定订单
         * @param {object}  row 数据
         */
        bindingOrder(obj) {
            this.boundDialogVisible = !this.boundDialogVisible;
            this.bindData = obj;
        },
        /**
         * @description: 订单搜索
         * @param {String}query 搜索内容
         * @param {boolen}bool 是否为绑定订单的对订单搜索
         */
        async remoteOrderMethod(query, bool) {
            try {
                let params = {
                    search_value: query
                };
                this.orderLoading = !this.orderLoading;
                let result = await addressBookListApi.getOrderSearch(params);
                if (result.data.code === 0) {
                    if (bool) {
                        this.orderLoading = !this.orderLoading;
                        this.editorOrderOptions = result.data.data;
                    } else {
                        this.orderLoading = !this.orderLoading;
                        this.orderOption = result.data.data;
                    }
                }else{
                    this.orderLoading = !this.orderLoading;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 绑定订单点击保存
         * @param {string} wxId 绑定当前row的微信ID
         * @param {string} groupId 绑定当前row的数据id
         */
        async boundOrderFn(wxId, groupId) {
            try {
                let params = {
                    order_id: this.orderBunder,
                    wx_id: wxId,
                    employee_id: this.uid
                };
                if (this.orderBunder == "") {
                    this.$message.error("请选择客户订单！");
                    return false;
                }
                let result = await addressBookListApi.boundOrder(params);
                if (result.data.code === 0) {
                    this.boundDialogVisible = !this.boundDialogVisible;
                    this.$message.success("绑定成功！");
                    this.getPendingList();
                    this.getWechatInfo();
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 点击批量分组
        batchButton() {
            this.getPendingList();
            this.isBatch = !this.isBatch;
        },
        /**
         * @description: 批量分组radio切换
         * @param {number} value 当前选中的分组
         * @param {object} obj row 当前选中行的数据
         * @param {number}  index 当前选中行的索引
         * @return:
         */
        changeRadio(value, obj, index) {
            let data = {
                group_id: obj.group_id,
                group_type: obj.groupName
            };
            this.batchGroupData[index] = data;
            if(this.batchGroupData.length){
                this.hasGroup = false;
            }
        },
        // 批量保存分组
        async batchSaveGroup() {
            this.listLoading = !this.listLoading;
            this.batchGroupData = this.batchGroupData.filter(obj => obj);
            try {
                let params = {
                    employee_id: this.uid,
                    group_data: this.batchGroupData
                };
                let result = await pendingGroupApi.saveGroupPromise(params);
                if (result.data.code === 0) {
                    this.$message.success("批量分组成功！");
                    this.getPendingList();
                    this.getWechatInfo();
                    this.hasGroup = true;
                    this.listLoading = !this.listLoading;
                    this.isBatch = !this.isBatch;
                    
                } else {
                    this.listLoading = !this.listLoading;
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                this.listLoading = !this.listLoading;
                console.log(error);
            }
        },
        // 关闭批量操作
        cancleBatch() {
            this.batchGroupData = [];
            this.hasGroup = true;
            this.isBatch = !this.isBatch;
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
        })
    },
    watch: {
        // 监听vuex中的权限数有值时
        uid: {
            handler: function (val, oldval) {
                // 获取咨询师信息
                this.getWechatInfo();
                // 获取未分组列表
                this.getPendingList();
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

                .batch-button-group {
                    margin-left: auto;
                }

                .batch-button {
                    width: 98px;
                    height: 32px;
                    padding: 0;
                    line-height: 30px;
                    background: #2e9ae2;
                }

                .cancle-button,
                .save-button {
                    padding: 0;
                    width: 54px;
                    height: 32px;
                    line-height: 30px;
                }

                .save-button {
                    background: #2e9ae2;
                }
            }

            .address-list-search {
                margin-bottom: 20px;
            }

            .bound-list {
                li {
                    display: flex;
                    margin-bottom: 20px;
                }
            }

            .bound-user-info {
                width: 348px;
                display: flex;
                align-items: center;
                margin-right: 50px;

                .bound-user-avatar {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;

                    img {
                        border-radius: 4px;
                        width: 100%;
                    }
                }

                .bound-user-identi {
                    .bound-user-name {
                        font-size: 16px;
                        font-weight: bold;
                        color: #333;
                    }

                    .bound-user-account {
                        font-size: 16px;
                        color: #333;
                    }
                }
            }

            .bound-order-info {
                display: flex;
                align-items: center;

                button {
                    padding: 0;
                    text-align: center;
                    width: 98px;
                    height: 40px;
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

.el-table--border th {
    background: #f4f6f9;
}
</style>
