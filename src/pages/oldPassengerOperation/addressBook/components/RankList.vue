<!--
 * @Name: 任务列表组件
 * @Description: 该文件描述
 * @Author: baiyunfei
 * @Date: 2019-09-24 18:18:03
 * @upDate: 2019-11-20 16:48:03
 * @Editors: baiyunfei, zhengchao
 -->
<template>
    <div class="rank-list-component">
        <div class="rank-list-title">当前任务</div>
        <div class="rank-list-main">
            <ul>
                <li
                    :key="index"
                    v-for="(item,index) in  rankList"
                    @click="goGroup(index, item)"
                    :class="[ isActive === index ? 'active' : '' ]">
                    <span>{{item.label}}</span>
                    <span
                        v-if="parseInt(item.num) > 9999"
                        class="badge more">9999+</span>
                    <span
                        v-else-if="parseInt(item.num) <= 9999 && parseInt(item.num) > 0"
                        class="badge"
                        :class="{'more': parseInt(item.num) > 100}">{{item.num}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 任务列表
            rankList: [{
                    label: "待分组好友",
                    num: "0"
                },
                {
                    label: "待绑定客户",
                    num: "0"
                }
            ],
            // 自组件数据
            data: [],
            // 任务列表高亮展示
            isActive: ""
        };
    },
    props: {
        // 父组件传递的数据
        dataObj: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    mounted() {},

    methods: {
        /**
         * @description: 任务列表点击
         * @param index{ number } 列表的索引值
         * @return:
         */
        goGroup(index) {
            // 如果已经选中，则不用进行跳转
            if (this.isActive === index) {
                return;
            }
            let url;
            this.isActive = index;
            index === 0 ? (url = "/weChatAddressBook/pendingGroup") : (url = "/weChatAddressBook/toBound");
            this.$router.push(url);
        },
        // 处理后端返回的数值
        initData() {
            this.rankList[0].num = this.data.no_group || 0;
            this.rankList[1].num = this.data.no_bind || 0;
        },
        // init 页面
        initPage() {
            if (this.$route.path === "/weChatAddressBook/toBound") {
                this.isActive = 1;
            } else if (this.$route.path === "/weChatAddressBook/pendingGroup") {
                this.isActive = 0;
            }
            this.$emit("objTitle", this.rankList[this.isActive]);
        }
    },
    watch: {
        // 检测父组件传递的数据
        dataObj(val) {
            this.data = val;
            this.initData();
            this.initPage();
        }
    }
};
</script>

<style lang="less" scoped>
.rank-list-component {
    width: 320px;
    border-radius: 2px;
    background: #fff;

    .rank-list-title {
        font-weight: bold;
        font-size: 16px;
        line-height: 56px;
        text-indent: 20px;
        border-bottom: 1px solid #e6eaee;
        color: #333;
    }

    .rank-list-main {
        margin-top: 9px;
        padding-bottom: 10px;

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            line-height: 38px;
            font-size: 14px;
            color: #333;
            cursor: pointer;

            &.active {
                background: rgba(46, 154, 226, 0.1);
                color: #2e9ae2;
            }

            .badge {
                font-size: 12px;
                min-width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                color: #fff;
                background: #ff4958;
                &.more{
                    width: auto;
                    padding: 0 8px;
                    border-radius: 50px;
                }
            }
        }
    }
}
</style>
