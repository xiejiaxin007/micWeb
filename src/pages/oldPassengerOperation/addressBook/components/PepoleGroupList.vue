<!--
 * @Name: 微信好友分组列表
 * @Description: 微信好友分组列表
 * @Author: baiyunfei
 * @Date: 2019-09-24 17:04:20
 * @Editors: baiyunfei
 -->
<template>
    <div class="friend-group-list">
        <div class="friend-title">微信好友</div>
        <div class="friend-search">
            <i class="icon-search" aria-hidden="true"></i>
            <el-select
                @change="groupChange"
                v-model="groupId"
                filterable
                remote
                reserve-keyword
                :clearable="true"
                @clear="goList(groupData[0])"
                placeholder="搜索微信昵称或微信号"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                    v-for="item in options"
                    :key="item.group_id"
                    :label="item.nike_name"
                    :value="item.group_id"></el-option>
            </el-select>
        </div>
        <div class="group-tips">当前分组</div>
        <span
            :class="[ active === '0' ? 'active group-list-title' :'group-list-title' ]"
            @click="goList(groupData[0])">全部好友（{{groupData[0].num}}人）</span>
        <div class="group-list">
            <ul>
                <li
                    v-show="index > 0"
                    @click="goList(obj)"
                    v-for="(obj, index) in groupData"
                    :key="index"
                    :class="[ active === obj.value ? 'active' :'' ]">
                    <span class="group-name">{{obj.name}}（{{obj.num}}人）</span>
                    <i :class="[ active === obj.value ? 'icon-right' :'icon-bottom-right' ]" aria-hidden="true"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {
    mapState
} from "vuex";
import addressBookListApi from "../api/addressListApi";

export default {
    data() {
        return {
            // 微信接口请求信息
            wxApiInfo: {},
            // 客户微信默认值
            wechatVals: [{
                id: ""
            }],
            // 选中的分组id
            groupId: "",
            // 远程搜索loading
            loading: false,
            // 搜索框默认喧嚣
            options: [],
            // 分组列表高亮项
            active: "",
            // 分组列表数据
            groupData: [{
                num: ""
            }]
        };
    },
    mounted() {},
    props: {
        // 父组件传递自组件需要的数据
        dataObj: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        // init 高亮分组
        initGroup() {
            let resultArr = this.groupData.filter((ele, index, arr) => {
                return ele.name == "待分组好友";
            });
            this.goList(resultArr[0]);
        },
        /**
         * @description: 微信好友远程搜索
         * @param {string} query输入的文本
         * @param {bool} bool需要设置默认的选中的选项
         * @return:
         */
        async remoteMethod(query, bool) {
            try {
                if (query == '') {
                    return;
                }
                let params = {
                    employee_id: this.uid,
                    nike_name: query
                };
                this.loading = true;
                let result = await addressBookListApi.getSearchGroupPromise(
                    params
                );
                if (result.data.code === 0) {
                    this.loading = false;
                    this.options = result.data.data;
                    if (bool) {
                        this.groupId = this.$route.query.searchKey;
                    }
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * @description: 点击跳转
         * @param {boolen}  bool是否为点击搜索的跳转
         * @param {object}  obj跳转需要的数据
         * @return:
         */
        goList(obj, bool) {
            // 如果已经高亮了，则表示不用跳转
            if (!bool && this.active === obj.value) {
                return;
            }
            this.active = obj.value;
            this.$emit("objTitle", obj, true);
            if (!bool) {
                if (obj.searchKey) {
                    this.$router.push(
                        `/weChatAddressBook/addressBookList?value=${this.active}&&searchKey=${obj.searchKey}&&searchLabel=${obj.searchLabel}`
                    );
                } else {
                    this.groupId = "";
                    this.$router.push(
                        `/weChatAddressBook/addressBookList?value=${this.active}`
                    );
                }
            }
        },
        // 初始化组件
        initPage() {
            if (
                this.$route.path === "/weChatAddressBook/addressBookList" &&
                this.$route.query.value
            ) {
                let resultArr = this.groupData.filter((ele, index, arr) => {
                    return ele.value == this.$route.query.value;
                });
                this.active = resultArr[0].value;
                this.$emit("objTitle", resultArr[0]);
                if (this.$route.query.searchKey) {
                    this.remoteMethod(this.$route.query.searchLabel, true);
                } else {
                    this.groupId = "";
                }
            } else if (
                this.$route.path === "/weChatAddressBook/addressBookList" &&
                !this.$route.query.value
            ) {
                this.initGroup();
            }
        },
        /**
         * @description: 下拉选择
         * @param {type}
         * @return:
         */
        groupChange(value) {
            let resultArr = this.options.filter((ele, index, arr) => {
                return ele.group_id === value;
            });
            let obj = {
                value: resultArr[0].group_type,
                name: resultArr[0].group_name,
                group_id: resultArr[0].group_id,
                searchKey: value,
                searchLabel: resultArr[0].nike_name
            };
            this.goList(obj, true);
        }
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
        dataObj(val) {
            this.groupData = val;
            this.initPage();
        }
    }
};
</script>

<style lang="less" scoped>
.friend-group-list {
    width: 320px;
    min-height: 385px;
    border-radius: 4px;
    background: #fff;

    /deep/.el-input__suffix{
        right: 32px;
    }

    .friend-title {
        font-size: 16px;
        line-height: 56px;
        font-weight: bold;
        text-indent: 20px;
        border-bottom: 1px solid #e6eaee;
        margin-bottom: 16px;
        color: #333;
    }

    .friend-search {
        position: relative;
        padding: 0 20px;
        margin-bottom: 16px;

        .icon-search {
            position: absolute;
            z-index: 10;
            right: 30px;
            top: 8px;
            font-size: 24px;
            color: #3e4a59;
        }

        /deep/ .el-select {
            width: 100%;
        }
    }

    .group-tips {
        font-size: 14px;
        font-weight: bold;
        text-indent: 20px;
        margin-bottom: 10px;
        color: #333;
    }

    .group-list-title {
        display: inline-block;
        margin-left: 20px;
        padding-bottom: 3px;
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #333;
        border-bottom: 1px solid #333;
        cursor: pointer;

        &.active {
            color: #2e9ae2;
            border-bottom: 1px solid #2e9ae2;
        }
    }

    .group-list {
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            line-height: 38px;
            font-size: 14px;
            color: #333;
            cursor: pointer;

            i {
                font-size: 12px;
                color: #a9bacf;
            }

            &.active {
                color: #2e9ae2;
                background: rgba(46, 154, 226, 0.1);

                i {
                    color: #2e9ae2;
                }
            }
        }
    }
}
</style>
