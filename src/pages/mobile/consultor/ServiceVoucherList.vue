<!--
    @name: 确认单列表页
    @description: 未关联确认单和已关联确认单列表
    @author: wangshuaixue
    @date: 2019-10-18
-->
<template>
    <div 
        :class="`voucher-container ${currHasData ? 'bg-white' : ''}`"
        v-loading="loading">
        <div class="tab-content">
            <!-- 头部切换 -->
            <div class="tab-navbar">
                <span class="relevance">
                    <span 
                        :class="{'active': !showTypeFlag}"
                        @click="changeShowType(false)">未关联</span>
                    <span
                        :class="{'active': showTypeFlag}"
                        @click="changeShowType(true)">已关联</span>
                </span>
                <span class="check-user"
                      @click="changeUser">切换账号</span>
            </div>
            <!-- 已关联 -->
            <div class="tab-card relevance"
                 v-if="showTypeFlag">
                <!-- 有数据 -->
                <div v-if="relevanceData.length>0">
                    <div 
                        class="card-info"
                        v-for="(item, index) in relevanceData"
                        :key="index">
                        <div class="info-desc">
                            <div class="affrim-id info-item">
                                <div class="th">订单ID：</div>
                                <div class="td">{{item.order_id}}</div>
                            </div>
                            <div class="info-item">
                                <div class="th">签字时间</div>
                                <div class="td">{{item.confirm_date}}</div>
                            </div>
                            <div class="info-item">
                                <div class="th">关联操作人</div>
                                <div class="td">{{item.bind_employee}}</div>
                            </div>
                            <div class="info-item">
                                <div class="th">关联时间</div>
                                <div class="td">{{item.bind_date}}</div>
                            </div>
                        </div>
                        <div class="info-img">
                            <img 
                                :src="item.confirm_url"
                                alt="签名" />
                        </div>
                    </div>
                </div>
                <!-- 无数据 -->
                <div 
                    class="not-data"
                    v-else>
                    <div class="content-con">
                        <img 
                            src="./images/img-not-data.png"
                            alt="无数据提示图" />
                        <div>该页面是用于帮带看等暂时无法关联订单的场景，后续可在录入带看时关联</div>
                        <div>如果是正常带看请直接到订单详情页中添加</div>
                    </div>
                </div>
            </div>
            <!-- 未关联 -->
            <div class="tab-card not-relevance"
                 v-else>
                <!-- 有数据 -->
                <div v-if="notRelevanceData.length>0">
                    <div 
                        class="card-info"
                        v-for="(item, index) in notRelevanceData"
                        :key="index">
                        <div class="info-desc">
                            <div class="affrim-id info-item">
                                <div class="th">确认单ID：</div>
                                <div class="td">{{item.confirm_id}}</div>
                            </div>
                            <div class="info-item">
                                <div class="td">{{item.confirm_date}}</div>
                            </div>
                            <div 
                                class="info-item"
                                v-if="!item.have_audio" key="1">
                                <div 
                                    class="vedio"
                                    :id="item.id">点击上传录音</div>
                            </div>
                            <div 
                                class="info-item"
                                v-else key="2">
                                <div class="vedio uploaded">已上传录音</div>
                            </div>
                        </div>
                        <div class="info-img">
                            <img 
                                :src="item.confirm_url"
                                alt="签名" />
                        </div>
                    </div>
                </div>
                <!-- 无数据 -->
                <div 
                    class="not-data"
                    v-else>
                    <div class="content-con">
                        <img 
                            src="./images/img-not-data.png"
                            alt="无数据提示图" />
                        <div>该页面是用于帮带看等暂时无法关联订单的场景，后续可在录入带看时关联</div>
                        <div>如果是正常带看请直接到订单详情页中添加</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-wrap">
            <span @click="addService">＋新增服务确认单</span>
        </div>
        <toast 
            :msg="toastMsg"
            :toastShow="toastShow"></toast>
    </div>
</template>

<script>
import 'lib-flexible';
import moment from 'moment';
import { Toast } from '../components';
import defaultPhoto from '@/assets/images/img-small-default.png';
import serviceVoucher from './api/serviceVoucher';
import { getSign } from '@/api/commonApi';
import { commonFun } from '@/assets/js/utils/utils';
window.mOxie = window.moxie = require('../../../../static/lib/uploads/moxie.js');
require('../../../../static/lib/uploads/plupload.dev');
const { getUnBindList, getBindList, setVideoRelation } = serviceVoucher;
export default {
    name: 'service-voucher-list',
    data() {
        return {
            // 页面加载
            loading: true,
            // 录音上传状态提示
            toastMsg: '',
            // 是否提示toast
            toastShow: false,
            // 已关联数据是否有更多
            relevaHasMore: false,
            // 已关联页数
            relevaPage: 1,
            // 未关联数据是否有更多
            notRelevaHasMore: false,
            // 未关联页数
            notRelevaPage: 1,
            // 选择未关联或已关联 默认展示未关联
            showTypeFlag: false,
            // 已关联数据
            relevanceData: [],
            // 未关联数据
            notRelevanceData: [],
            // 实例化上传列表
            uploader: []
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.uploadSign();
            // 获取未关联数据
            this.getUnBindListData();
            // 获取关联数据
            this.getBindListData();
            // 图片加载不出来
            document.addEventListener(
                'error',
                function(e) {
                    var elem = e.target;
                    if (elem.tagName.toLowerCase() === 'img') {
                        elem.src = defaultPhoto;
                        elem.error = null;
                    }
                },
                true
            );
            document.addEventListener('scroll', this.handleScroll, true);
        });
    },
    methods: {
        // 获取滚动高度
        getScrollTop() {
            // 考虑到浏览器版本兼容性问题，解析方式可能会不一样
            return (
                document.documentElement.scrollTop || document.body.scrollTop
            );
        },
        // 获取一屏的高度
        getWinHeight() {
            // 浏览器可见内容高度 || 浏览器所有内容高度(考虑到浏览器版本兼容性问题，解析方式可能会不一样)
            return (
                document.documentElement.clientHeight ||
                document.body.clientHeight
            );
        },
        // 获取文档总高度
        getScrollHeight() {
            let bodyScrollHeight = 0;
            let documentScrollHeight = 0;
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight;
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight;
            }
            // 当页面内容超出浏览器可视窗口大小时，Html的高度包含body高度+margin+padding+border所以html高度可能会大于body高度
            return bodyScrollHeight - documentScrollHeight > 0
                ? bodyScrollHeight
                : documentScrollHeight;
        },
        // 滚动是否滚动到底部
        handleScroll() {
            let scrollTop = this.getScrollTop(); // 获取滚动条的高度
            let winHeight = this.getWinHeight(); // 一屏的高度
            let scrollHeight = this.getScrollHeight(); // 获取文档总高度
            // 已关联已到底部
            if (
                scrollTop >= parseInt(scrollHeight) - winHeight &&
                this.showTypeFlag &&
                this.relevaHasMore
            ) {
                this.relevaPage++;
                this.getBindListData(this.relevaPage);
            } else if (
                scrollTop >= parseInt(scrollHeight) - winHeight &&
                !this.showTypeFlag &&
                this.notRelevaHasMore
            ) {
                this.notRelevaPage++;
                this.getUnBindListData(this.notRelevaPage);
            }
        },
        // 切换账号
        changeUser() {
            this.$router.push({ path: 'mobileLogin' });
        },
        // 跳转到新增服务确认单页面
        addService() {
            this.$router.push({ path: 'serviceVoucherDetail' });
        },
        /**
         * 获取未关联数据
         * @param {string} page 参数描述 当前第几页
         * return 空
         */
        async getUnBindListData(page) {
            try {
                let params = {
                    page: page
                };
                const { data } = await getUnBindList(params);
                if (data.code === 0) {
                    this.notRelevaHasMore = data.data.hasMore;
                    // 动态实例化上传图片插件 每次都实例化新增的数据 避免重读实例化上传
                    for (let i = 0; i < data.data.list.length; i++) {
                        data.data.list[i].id =
                            moment().format('X') +
                            parseInt(Math.random() * 10000);
                        setTimeout(() => {
                            this.initPlupload(data.data.list[i].id, i);
                        });
                    }
                    this.notRelevanceData = this.notRelevanceData.concat(
                        data.data.list ? data.data.list : []
                    );
                    this.loading = false;
                }
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        /**
         * 获取已关联数据
         * @param {string} page 参数描述 当前第几页
         * return 空
         */
        async getBindListData(page) {
            try {
                let params = {
                    page: page
                };
                const { data } = await getBindList(params);
                if (data.code === 0) {
                    this.relevanceData = data.data.list ? data.data.list : [];
                    this.relevaHasMore = data.data.hasMore;
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 添加确认单录音
         * @param {string} url 参数描述 上传到阿里云的半路径
         * @param {string} id 参数描述 确认单id
         * return 空
         */
        async addVideoRel(url, id) {
            try {
                let params = {
                    confirm_id: id,
                    url: url
                };
                const { data } = await setVideoRelation(params);
                if (data.code === 0) {
                    console.log(data.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        async uploadSign() {
            try {
                let params = {
                    cate: 'Upload/confirm/audio'
                };
                const { data } = await getSign(params);
                if (data.code === 0) {
                    this.signs = data.data;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 初始化上传插件
        initPlupload(id, index) {
            // http://comjia-1.oss-cn-beijing.aliyuncs.com/sop_web/icon-@2x.png
            let that = this;
            var maxSize = '100mb';
            // 定义 plupload 对象
            function setUploadParam(up, filename, ret) {
                let fileName = '';
                if (filename && typeof filename == 'string') {
                    fileName = commonFun.trimAll(filename);
                }
                let keyName =
                    that.signs.dir +
                    moment().format('X') +
                    commonFun.random_string(6) +
                    fileName;
                let newMultipartParams = {
                    key: keyName,
                    policy: that.signs.policy,
                    OSSAccessKeyId: that.signs.accessid,
                    success_action_status: 200, // 默认是 204
                    signature: that.signs.signature
                };
                up.setOption({
                    url: that.signs.host,
                    multipart_params: newMultipartParams
                });
                up.start();
                return keyName;
            }
            that.uploader[index] = new plupload.Uploader({
                mulit_selection: false, // 禁止多文件上传
                browse_button: id, // 触发文件上传的按钮 id（传入的参数）
                url: that.signs.host, // 服务器的地址，与提供的阿里云的地址一致
                flash_swf_url: '../../../static/lib/uploads/moxie.swf',
                filters: {
                    mime_types: [
                        {
                            title: 'files',
                            extensions: 'amr,mp3,wav,mp4,m4a' // 允许上传的文件类型
                        }
                    ],
                    max_file_size: maxSize, // 允许上传的最大尺寸
                    prevent_duplicates: true // 不允许上传重复文件
                },
                init: {
                    // 文件添加到上传队列后
                    FilesAdded: function(up, files) {
                        for (let i = 0; i < that.uploader.length; i++) {
                            if (up.id === that.uploader[i].id) {
                                that.currenUpId = i;
                                break;
                            }
                        }
                        setUploadParam(up, files[0].name, false);
                    },
                    FileUploaded: function(up, file, info) {
                        // file 里可以得到压缩率
                        if (info.status === 203) {
                            alert(
                                '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' +
                                    info.response
                            );
                        } else if (info.status !== 200) {
                            alert(info.respose);
                        }
                    },
                    BeforeUpload: function(up, file) {
                        that.upFile = setUploadParam(up, file.name, true);
                    },
                    UploadComplete: function(up, file) {
                        that.toastShow = true;
                        that.toastMsg = '上传成功';
                        setTimeout(() => {
                            that.toastShow = false;
                        }, 1000);
                        // 上传成功
                        let curItem = that.notRelevanceData[that.currenUpId];
                        curItem.have_audio = true;
                        that.$set(
                            that.notRelevanceData,
                            that.currenUpId,
                            curItem
                        );
                        that.addVideoRel(
                            that.upFile,
                            that.notRelevanceData[that.currenUpId].confirm_id
                        );
                    },
                    // 错误信息
                    Error: function(up, err) {
                        if (err.code === -600) {
                            alert('图片大小不能超过' + maxSize);
                        } else if (err.code === -601) {
                            alert('文件类型不正确');
                        } else if (err.code === -602) {
                            alert('已上传过');
                        } else {
                            alert(err);
                        }
                        that.toastShow = true;
                        that.toastMsg = '上传失败请重新上传';
                        setTimeout(() => {
                            that.toastShow = false;
                        }, 1000);
                    }
                }
            });
            that.uploader[index].init();
        },
        /**
         * 切换关联
         * @param {boolean} type 选择已关联为true 未关联为false
         * return 空
         */
        changeShowType(type) {
            this.showTypeFlag = type;
        }
    },
    components: { Toast },
    computed: {
        // 当前页面背景颜色
        currHasData() {
            // 选择未关联且未关联没有数据 修改背景为白色 已关联同理
            let falg = false;
            if (
                (this.relevanceData.length === 0 && this.showTypeFlag) ||
                (this.notRelevanceData.length === 0 && !this.showTypeFlag)
            ) {
                falg = true;
            }
            return falg;
        }
    }
};
</script>

<style lang="less" scoped>
@bg_default_color: #f4f4f4;
@white_color: #fff;
@bule_color: #33a1ff;
@bg_gray: #ecf0f1;
@up_gray_color: #bcc0c4;
@gray_color: #77808a;
@gray_text_color:#3e4a59;

.voucher-container {
    background-color: @bg_default_color;
    min-height: 100%;
    &.bg-white {
        background-color: @white_color;
    }
    .tab-content {
        padding-bottom: 1.733333rem;
        .tab-navbar {
            text-align: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
            background-color: @bule_color;
            height: 1.173333rem;
            span {
                display: inline-block;
            }
            .relevance {
                display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */ 
                display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */ 
                display: -ms-flexbox; /* TWEENER - IE 10 */ 
                display: -webkit-flex; /* NEW - Chrome */ 
                display: flex; 
                justify-content: space-between;
                width: 3.733333rem;
                padding-top: 0.266667rem;
                margin: 0 auto;
                > span {
                    width: 1.36rem;
                    font-size: 0.43rem;
                    color: @white_color;
                }
                .active {
                    position: relative;
                    font-weight: bold;
                    &::after {
                        content: '';
                        display: inline-block;
                        width: 0.533333rem;
                        height: 2px;
                        border-radius: 3px;
                        position: absolute;
                        bottom: -3px;
                        left: 0.4rem;
                        background-color: @white_color;
                    }
                }
            }
            .check-user {
                position: absolute;
                color: @white_color;
                top: 0.28rem;
                right: 0.533333rem;
                font-size: 0.4rem;
            }
        }
        .tab-card {
            padding-top: 1.2rem;
            .card-info {
                margin-top: 0.266667rem;
                box-sizing: border-box;
                position: relative;
                padding: 0.533333rem;
                background: @white_color;
                .info-desc {
                    margin-right: 3.733333rem;
                    .info-item {
                        font-size: 0.373333rem;
                        overflow: hidden;
                        margin-bottom: 0.266667rem;
                        color: @gray_text_color;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .th {
                            color: @gray_color;
                            float: left;
                        }
                        .td {
                            white-space: nowrap;
                            overflow: hidden;
                            zoom: 1;
                        }
                        &.affrim-id {
                            font-family: "PingFangSC-Medium", "Microsoft YaHei";
                            font-size: 0.426667rem;
                            font-weight: bold;
                            .th{
                                color: @gray_text_color;
                            }
                        }
                        .vedio {
                            width: 2.45rem;
                            height: 0.62rem;
                            line-height: 0.65rem;
                            font-size: 0.346667rem;
                            color: @bule_color;
                            border: 1px solid @bule_color;
                            border-radius: 20px;
                            text-align: center;
                            &.uploaded {
                                pointer-events: none;
                                background-color: @bg_gray;
                                color: @up_gray_color;
                                border: 1px solid @bg_gray;
                            }
                        }
                    }
                }
                .info-img {
                    width: 3.2rem;
                    height: 2.133333rem;
                    margin-left: 3.2rem;
                    position: absolute;
                    bottom: 0.533333rem;
                    right: 0.533333rem;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .not-data {
                padding: 0 1.666667rem;
                .content-con {
                    margin-top: 3.066667rem;
                    text-align: center;
                    img {
                        width: 2.986667rem;
                        height: 2.506667rem;
                        margin-bottom: 0.533333rem;
                    }
                    div {
                        text-align: left;
                        color: @gray_color;
                        font-size: 0.373333rem;
                        line-height: 0.6rem;
                        text-align: justify;
                    }
                }
            }
        }
        .relevance{
            .th{
                text-align: left;
                width: 2.1rem;
            }
        }
    }
    .btn-wrap {
        position: fixed;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0.266667rem 1.333333rem;
        background: @white_color;
        box-shadow: 0 -2px 4px 0 rgba(222, 222, 222, 0.5);
        z-index: 1;
        span {
            display: inline-block;
            height: 1.173333rem;
            line-height: 1.23rem;
            width: 7.333333rem;
            border-radius: 1.333333rem;
            background-color: @bule_color;
            text-align: center;
            font-size: 0.426667rem;
            color: @white_color;
        }
    }
}
</style>