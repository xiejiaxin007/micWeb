<!--
 * @Name: 待绑定好友页面
 * @Description: 待绑定好友页面
 * @Author: baiyunfei
 * @Date: 2019-09-25 15:36:14
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
                <span class="address-title-tips">所有的客户都需要绑定订单，请点击「绑定到订单」将客户绑定到订单中，任务未完成系统会一直提示哦~</span>
            </div>
            <div class="friend-list-table">
                <div class="bound-button">
                    <el-button
                        @click="batchSaveOrder()"
                        :disabled="hasOrder"
                        type="primary">一键绑定</el-button>
                    <span>批量提交已绑定的订单</span>
                </div>
            </div>
            <div
                v-loading="listLoading"
                class="bound-list">
                <ul>
                    <li
                        v-for="(item, index) in tableData"
                        :key="index">
                        <div class="bound-user-info">
                            <div class="bound-user-avatar">
                                <img 
                                v-if="item.avatar" 
                                :src="item.avatar" 
                                alt ="微信头像"
                                />
                                <img 
                                    v-else 
                                    src="../../../assets/images/img-user-avatar.png"
                                    alt ="微信头像"
                                     />
                            </div>
                            <div class="bound-user-identi">
                                <div class="bound-user-name">{{item.nickname}}</div>
                                <div 
                                 v-if="role === 'header'"
                                 class="bound-user-account">{{item.wx_num}}</div>
                            </div>
                        </div>
                        <div
                            v-if="role === 'header'"
                            class="bound-order-info">
                            <span>选择绑定订单</span>
                            <el-select
                                @change="selectOrder(item.orderId,item,index)"
                                v-model="item.orderId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="搜索客户姓名、手机、订单"
                                :clearable="true"
                                @clear="clearOrder(index)"
                                :remote-method="(query) => remoteOrderMethod(query,item, index)"
                                :loading="orderLoading">
                                <el-option
                                    v-for="(obj, index) in item.orderOption"
                                    :key="index"
                                    :label="obj.text"
                                    :value="obj.id"></el-option>
                            </el-select>
                            <i class="icon-caret-bottom" aria-hidden="true"></i>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="page-pagination">
                <el-pagination
                    v-if="total > 20"
                    :page-size="20"
                    @current-change="pageChangeFn"
                    background
                    layout="prev, pager, next"
                    :total="total"></el-pagination>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import addressBookListApi from "./api/addressListApi";
import toBoundApi from "./api/toBoundApi";
import ConsultantInfo from "./components/ConsultantInformation";
import FriendGroup from "./components/PepoleGroupList";
import RankList from "./components/RankList";
export default {
    name: "AddressBookList",
    data() {
        return {
            // 列表标题
            titleObj: {},
            // 列表数据
            tableData: [],
            // 当前分页
            currentPage: 1,
            // 总客户数
            total: 0,
            // 咨询师信息数据
            consultantInfoData: {},
            // 待完成任务列表数据
            rankListData: {},
            // 好友分组数据
            groupData: [],
            // 判断是否可以一件绑定
            hasOrder: true,
            // 批量绑定订单提交数据
            boundOrderList: [],
            // 请求数据的loading
            listLoading: false,
            // 请求订单的loading数据
            orderLoading:false,
        };
    },
    mounted() {
        this.getWechatInfo();
        this.getBoundList();
    },
    methods: {
        /**
         * @description: 子组件传递过来的title信息
         * @param {object } obj 当前行传递的数据
         * @return:
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
        // 获取待绑定客户
        async getBoundList() {
            this.listLoading = !this.listLoading;
            try {
                let params = {
                    employee_id: this.uid,
                    page: this.currentPage
                };
                let result = await toBoundApi.bindTodoList(params);
                if (result.data.code === 0) {
                    this.listLoading = !this.listLoading;
                    this.tableData = result.data.data.list;
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
         * @description: 分页筛选
         * @param {string}page 当前椰树
         */
        pageChangeFn(page) {
            this.currentPage = page;
            this.getBoundList();
        },
        /**
         * @description: 订单搜索
         * @param {string}query 搜索文字
         * @param {object}obj 当前绑定订单的对象
         */
        async remoteOrderMethod(query, obj, index) {
            this.orderLoading = !this.orderLoading;
            try {
                let params = {
                    search_value: query
                };
                let result = await addressBookListApi.getOrderSearch(params);
                if (result.data.code === 0) {
                    this.orderLoading = !this.orderLoading;
                    this.$set(obj, "orderOption", result.data.data);
                }else{
                    this.orderLoading = !this.orderLoading;
                }
            } catch (error) {
                this.orderLoading = !this.orderLoading;
                console.log(error);
            }
        },
        /**
         * @description: 选择绑定的订单
         * @param {number}value 订单选中的值
         * @param {object}obj 当前行的对象
         * @param {number}index 当前行的索引
         */
        selectOrder(value, obj, index) {
            let data = {
                order_id: obj.orderId,
                wx_id: obj.wx_id,
                group_id: obj.group_id
            };
            this.boundOrderList[index] = data;
            if (this.boundOrderList.length) {
                this.hasOrder = false;
            }
        },
        /**
         * @description: 删除绑定的订单
         * @param {number} index 当前行索引 
         */
        clearOrder(index){
            this.boundOrderList.splice(index,1);
            let arr = this.boundOrderList.filter(obj => obj);
            if (arr.length == 0) {
                this.hasOrder = true;
            }
        },
        // 批量保存绑定订单
        async batchSaveOrder() {
            this.listLoading = !this.listLoading;
            this.boundOrderList = this.boundOrderList.filter(obj => obj);
            try {
                let params = {
                    employee_id: this.uid,
                    order_data: this.boundOrderList,
                };
                let result = await toBoundApi.batchBindPromise(params);
                if (result.data.code === 0) {
                    if (
                        result.data.data.list.error_data &&
                        result.data.data.list.error_data.length
                    ) {
                        this.$message.error(
                            `${result.data.data.list.error_data.join(
                                ","
                            )}绑定失败！`
                        );
                    } else {
                        this.$message.success("绑定成功！");
                    }
                    this.getBoundList();
                    this.getWechatInfo();
                    this.boundOrderList = [];
                    this.hasOrder = true;
                    this.listLoading = !this.listLoading;
                } else {
                    this.listLoading = !this.listLoading;
                    this.$message.error(result.data.msg);
                }
            } catch (err) {
                this.listLoading = !this.listLoading;
                console.log(err);
            }
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
                // 获取咨询师下拉
                this.getWechatInfo();
                this.getBoundList();
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
/deep/ .el-input__suffix{
    right: 20px;
}
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

            .friend-list-table {
                .bound-button {
                    display: flex;
                    align-items: center;
                    margin-bottom: 32px;

                    button {
                        width: 98px;
                        height: 32px;
                        font-size: 14px;
                        padding-top: 0;
                        padding-bottom: 0;
                        line-height: 30px;
                    }

                    >span {
                        margin-left: 20px;
                        font-size: 14px;
                        color: #a9bacf;
                    }
                }
            }
        }

        .bound-list {
            li {
                margin-bottom: 20px;
                display: flex;
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
            position: relative;

            >span {
                font-size: 14px;
                line-height: 24px;
                margin-right: 10px;
                color: #666;
            }

            .el-select {
                width: 300px;
            }

            .icon-caret-bottom {
                font-size: 12px;
                position: absolute;
                right: 10px;
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
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active{
    background: #2E9AE2;
 }
.el-table--border th {
    background: #f4f6f9;
}
</style>
