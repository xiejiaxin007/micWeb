<!--
 * @Description: 微信聊天记录
 * @Author: xiejiaxin
 * @Date: 2019-10-08
 -->
 <template>
    <div class="el-row">
        <el-col
            :span="24"
            class="content-main">
            <!--面包屑-->
            <el-breadcrumb
                class="bread-crumb-box"
                separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>
                    <a href="/">首页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/weChatAddressBook/wxFriendList' }">微信好友管理</el-breadcrumb-item>
                <el-breadcrumb-item>聊天内容</el-breadcrumb-item>
            </el-breadcrumb>
            <!--聊天内容-->
            <div class="wx-content-box">
                <div class="wx-content-title">
                    <div class="wx-title-operate">
                        <div class="operate-date-box">
                            <div class="box-title">聊天时间：</div>
                            <div class="box-content">
                                <el-date-picker
                                    v-model="wxchatDate"
                                    type="daterange"
                                    @change="changeDate"
                                    prefix-icon="iconfont iconshijian"
                                    range-separator="至"
                                    start-placeholder="聊天开始时间"
                                    end-placeholder="聊天结束时间">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="operate-out-box">
                            <div class="box-title">共{{wechatInfo.total_count}}条聊天数据</div>
                            <div class="box-content">
                                <el-button @click="exportContent">导&nbsp;出</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="wx-title-discribe">
                        <span class="discribe-info">咨询师&lt;{{wechatInfo.employee_name}}&gt;与客户&lt;{{nikeName}}&gt;的聊天记录</span>
                        <span>（最新更新：{{wechatInfo.update_datetime}}）</span>
                    </div>
                </div>
                <div
                    class="wx-content-list-box"
                    v-loading="contentLoading">
                    <ul
                        class="wx-content-list"
                        v-if="contentList.length > 0"
                        v-infinite-scroll="load"
                        infinite-scroll-immediate="false"
                        infinite-scroll-disabled="disabled">
                        <!-- is_send：0是客户，1是咨询师 -->
                        <li
                            v-for="(wxItem, wxIndex) in contentList"
                            :key="'wxContent-' + wxIndex"
                            :class="{'list-item-left': wxItem.is_send == 0, 'list-item-right': wxItem.is_send == 1}">
                            <div class="item-box">
                                <div class="item-pic">
                                    <img
                                        v-if="wxItem.is_send == 0"
                                        :src="wechatInfo.user_head"
                                        @error="imgError($event, 0)"
                                        alt="客户微信头像">
                                     <img
                                        v-if="wxItem.is_send == 1"
                                        :src="wechatInfo.employee_head"
                                        @error="imgError($event, 1)"
                                        alt="咨询师微信头像">
                                </div>
                                <!-- 图片 -->
                                <div
                                    class="item-content item-content-img"
                                    v-if="wxItem.type == 3">
                                    <div class="content-box">
                                        <el-image
                                            :src="wxItem.content"
                                            alt="聊天图片"
                                            :preview-src-list="[wxItem.content]">
                                            <div slot="error" class="image-slot">
                                                <img
                                                    src="../../../assets/images/img-middle-default.png"
                                                    alt="图片加载失败">
                                            </div>
                                        </el-image>
                                    </div>
                                </div>
                                <!-- 文本 -->
                                <div
                                    class="item-content"
                                    v-else>
                                    <div class="content-box">{{wxItem.content}}</div>
                                </div>
                                <div class="item-content-time">{{wxItem.send_datetime}}</div>
                            </div>
                        </li>
                    </ul>
                    <div
                        class="no-message-box"
                        v-else>
                        <img
                            src="../images/img-insert-photo.png"
                            alt="消息列表为空">
                    </div>
                    <p
                        class="content-tip-box"
                        v-if="scrollLoading">加载中...</p>
                    <p
                        class="content-tip-box"
                        v-if="noMore">没有更多了</p>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
import api from './api/wechatRecordApi'
import moment from 'moment';
import errorCounImg from '../../../assets/images/img-count-photo.png';
import errorClientImg from '../../../assets/images/img-friends-photo.png';
export default {
    name: 'wx-chat-content',
    data () {
        return {
            // 聊天日期
            wxchatDate: [],
            // 聊天内容数组
            contentList: [],
            // 新添加的消息
            contentListAdd: ['1'],
            // 聊天信息
            wechatInfo: {},
            // 当前第几页
            page: 1,
            // 滚动加载loading
            scrollLoading: false,
            // 页面初始化loading
            contentLoading: true,
            // 客户微信昵称
            nikeName: this.$route.query.nike_name,
            // 客户微信ID
            nikeId: this.$route.query.wx_id,
            // 咨询师ID
            uid: this.$route.query.uid
        }
    },
    computed: {
        noMore () {
            return this.contentListAdd.length === 0 && this.page !== 1;
        },
        disabled () {
            return this.scrollLoading || this.noMore;
        }
    },
    created() {
        // 时间默认选中最近三个月的日期
        let startDate = new Date();
        this.wxchatDate[1] = startDate;
        let endDate = new Date(moment().subtract(3, 'months').valueOf());
        this.wxchatDate[0] = endDate;
        // 请求第一页聊天消息
        this.getContent(1);
    },
    methods: {
        // 无限滚动方法
        load() {
            this.scrollLoading = true;
            setTimeout(() => {
                this.page += 1;
                this.getContent(this.page);
            }, 2000);
        },
        /**
         * 获取聊天内容
         * @param {Number} page 请求页数
         * @param {Number} type 是否清空聊天数据数组，1为清空，2为不清空
         */
        async getContent(page, type) {
            // 判断如果有uid，再进行请求
            if (this.uid) {
                let startDate = moment(this.wxchatDate[0].getTime()).format('YYYY-MM-DD');
                let endDate = moment(this.wxchatDate[1].getTime()).format('YYYY-MM-DD');
                try {
                    let params = {
                        employee_id: this.uid,
                        talker: this.nikeId,
                        chat_start_datetime: startDate,
                        chat_end_datetime: endDate,
                        page: page
                    };
                    let result = await api.getWechatRecord(params);
                    let { data } = result;
                    if (data.code === 0) {
                        this.scrollLoading = false;
                        this.contentListAdd = data.data.list;
                        // type为1的时候，表示从头开始请求
                        if (type === 1) {
                            this.contentList = [];
                        }
                        this.contentList = this.contentList.concat(this.contentListAdd);
                        this.wechatInfo = data.data.info;
                        // 关闭页面初始化loading
                        this.contentLoading = false;
                    } else {
                        // 关闭页面初始化loading
                        this.contentLoading = false;
                    }
                } catch (error) {
                    console.log(error);
                    // 关闭页面初始化loading
                    this.contentLoading = false;
                }
            } else {
                this.contentLoading = false;
            }
        },
        // 导出
        async exportContent() {
            let startDate = moment(this.wxchatDate[0].getTime()).format('YYYY-MM-DD');
            let endDate = moment(this.wxchatDate[1].getTime()).format('YYYY-MM-DD');
            try {
                let params = {
                    employee_id: this.uid,
                    talker: this.nikeId,
                    chat_start_datetime: startDate,
                    chat_end_datetime: endDate,
                    export: '1',
                    page: this.page
                };
                await api.getWechatRecord(params);
                let url = '/backend-api/we-chat-manage/chat-record?'
                Object.keys(params).map((item, i) => {
                    if (i !== 0) {
                        url += '&' + item + '=' + params[item];
                    } else {
                        url += item + '=' + params[item];
                    }
                });
                window.location.href = url;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 头像加载失败方法
         * @param {Object} e 事件对象
         * @param {Number} type 判断是咨询师还是客户，3：客户，2：咨询师
         */
        imgError(e, type) {
            let el = e || window.event;
            if (type === 1) {
                el.target.src = errorCounImg;
            } else {
                el.target.src = errorClientImg;
            }
            el.target.error = null;
        },
        /**
         * 修改日期搜索
         * @param {Object} para 修改后的日期数组
         */
        changeDate(para) {
            // 重新搜索聊天记录
            this.contentLoading = true;
            // 筛选时间需要清空聊天记录
            this.contentList = [];
            // 重置分页进行请求
            this.page = 1;
            this.getContent(1, 1);
        }
    }
}
</script>

<style lang="less" scoped>
.wx-content-box{
    background-color: #fff;
    .wx-content-list-box{
        overflow: auto;
        position: relative;
        padding: 30px 30px 0 30px;
        box-sizing: border-box;
        background-color: #f7f8f9;
        height: 526px;
        .no-message-box{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .wx-content-list{
            &>li{
                width: 100%;
                margin-bottom: 30px;
                .item-box{
                    overflow: hidden;
                }
                .item-pic{
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background-color: #fff;
                    &>img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .item-content{
                    max-width: 480px;
                    padding: 11px 12px;
                    box-sizing: border-box;
                    background-color: #fff;
                    border-radius: 4px;
                    .content-box{
                        font-size: 14px;
                        color: #333;
                        line-height: 20px;
                        word-wrap: break-word;
                        word-break: break-word;
                        /deep/.el-image{
                            .el-image-viewer__close{
                                color: #fff;
                            }
                            .el-image-viewer__img{
                                width: 50%;
                            }
                        }
                    }
                    audio{
                        width: 300px;
                        height: 30px;
                    }
                }
                .item-content-time{
                    width: 100%;
                    font-size: 12px;
                    color: #bbb;
                }
                &.list-item-left{
                    .item-pic{
                        float: left;
                    }
                    .item-content{
                        float: left;
                        margin-left: 10px;
                        position: relative;
                        &::before{
                            content: '';
                            position: absolute;
                            top: 17px;
                            left: -8px;
                            width: 0;
                            height: 0;
                            border-top: 4px solid transparent;
                            border-bottom: 4px solid transparent;
                            border-left: 4px solid transparent;
                            border-right: 4px solid #fff;
                        }
                    }
                    .item-content-img{
                        background-color: transparent;
                        padding: 0;
                        &::before{
                            content: '';
                            display: none;
                        }
                        img{
                            width: 100%;
                        }
                    }
                    .item-content-time{
                        float: left;
                        margin: 6px 0 0 52px;
                    }
                }
                &.list-item-right{
                    .item-pic{
                        float: right;
                    }
                    .item-content{
                        float: right;
                        margin-right: 10px;
                        background-color: #2e9ae2;
                        position: relative;
                        &::before{
                            content: '';
                            position: absolute;
                            top: 17px;
                            right: -8px;
                            width: 0;
                            height: 0;
                            border-top: 4px solid transparent;
                            border-bottom: 4px solid transparent;
                            border-left: 4px solid #33a1ff;
                            border-right: 4px solid transparent;
                        }
                        .content-box{
                            color: #fff;
                        }
                    }
                    .item-content-img{
                        background-color: transparent;
                        padding: 0;
                        &::before{
                            content: '';
                            display: none;
                        }
                        img{
                            width: 100%;
                        }
                    }
                    .item-content-time{
                        float: right;
                        margin: 6px 52px 0 0;
                        text-align: right;
                    }
                }
            }
        }
    }
    .wx-content-title{
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        line-height: 60px;
        background-color: #77808a;
        color: #fff;
        overflow: hidden;
        .wx-title-operate{
            float: right;
            height: 60px;
            .operate-date-box{
                float: left;
                .box-title{
                    font-size: 14px;
                }
            }
            .operate-out-box{
                float: right;
                margin: 0 4px 0 100px;
            }
            .box-title{
                float: left;
                width: auto;
            }
            .box-content{
                overflow: hidden;
                padding-left: 10px;
                box-sizing: border-box;
                /deep/.el-date-editor{
                    .el-range-input{
                        background-color: #fff;
                        width: 42%;
                    }
                    .el-range__close-icon{
                        display: none;
                    }
                    .iconshijian{
                        font-size: 16px;
                        color: #666;
                        height: auto;
                    }
                }
                /deep/.el-input__inner{
                    width: 260px;
                    margin-top: 10px;
                }
                /deep/.el-button--default{
                    width: 98px;
                }
            }
        }
        .wx-title-discribe{
            overflow: hidden;
            .discribe-info{
                font-size: 16px;
                margin-right: 10px;
            }
        }
    }
    .content-tip-box{
        text-align: center;
        font-size: 14px;
        padding-bottom: 20px;
    }
}
</style>