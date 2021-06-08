<!--
    @name: 消息管理列表
    @description: 2020-07-20 核实此页面已废弃 
-->
<template>
    <div class="wechatParent">
        <!--面包屑-->
        <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 消息框 -->
        <div class="messageBorder">
            <!-- 顶部栏目 -->
            <div class="topColum">
                <!-- 左边搜索栏 -->
                <div class="titleLeft">
                    <p class="titleMsg">选择托管微信</p>
                    <el-autocomplete
                    v-model="searchVal"
                    prefix-icon="el-icon-search"
                    placeholder="搜索离职咨询师"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                    ></el-autocomplete>
                </div>
                <!-- 离职咨询师列表 -->
                <div class="counselorList">
                    <div class="counselor" :class="{checkedCounselor: index === counselorIsActive}" v-for="(item, index) in filterCounselorList(this.counselorList)" :key="index" @click="counselorInfo(index, item.wxId, item.employeeId, item.employeeName,item.headImg, item.trusteeshipStatus, item.trusteeshipId)">
                        <p>
                            <img :src="isHeadImgSpace(item.headImg)" width="46" height="46" alt="图片" />
                        </p>
                        <span>{{item.employeeName}}</span>
                        <strong v-show="msgNumIsshow(item.msgNum)">{{item.msgNum}}</strong>
                    </div>
                    <i class="iconfont" v-show="isButtonShow" @click="clickUnfold" aria-hidden="true">&#xe626;</i>
                </div>
            </div>
            <!-- 折叠展开页面 -->
            <div class="openCounselorList" :class="{transitionHeight:isUnfold}">
                <div class="counselorList">
                    <div class="counselor" v-for="(item, index) in counselorList" :key="index" @click="openListSplit(index, item.wxId, item.employeeId, item.employeeName,item.headImg,item.trusteeshipStatus, item.trusteeshipId)">
                        <p>
                            <img :src="isHeadImgSpace(item.headImg)" width="46" height="46" alt="图片" />
                        </p>
                        <span>{{item.employeeName}}</span>
                        <strong v-show="msgNumIsshow(item.msgNum)">{{item.msgNum}}</strong>
                    </div>
                    <i class="iconfont" @click="clickUnfold" aria-hidden="true">&#xe626;</i>
                </div>
            </div>
            <!-- 左边栏目 -->
            <div class="leftColum">
                <!-- tab切换 -->
                <div class="tabLeft">
                    <div class="headPortrait">
                        <p>
                            <img :src="isHeadImgSpace(counselorImg)" alt="图片" >
                        </p>
                        <span class="nickName">{{employeeNames}}</span>
                        <a>{{jobNumbers}}</a>
                    </div>
                    <div class="tabs">
                        <div class="messageList" :class="{isCheckTabs: index === tabsIsActive}" v-for="(item, index) in tabsButtonArr" :key="index" @click="checkTabs(index)">
                            <i class="iconfont" :class="item.icon" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div class="newMessage">
                    <div class="messageSerach">
                        <h3>{{tabsText}}</h3>
                        <el-autocomplete
                        v-model="messageVal"
                        :fetch-suggestions="querySearchAsync1"
                        @select="handleSelect1"
                        prefix-icon="el-icon-search"
                        placeholder="搜索微信昵称"
                        ></el-autocomplete>
                    </div>
                    <div class="friendsMessage">
                        <!-- 消息列表 -->
                        <ul v-show="msgListIsShow">
                            <li :class="{checkedMsg: index === checkedMsgActive}" v-for="(item, index) in messageList" :key="index" @click="msgTabs(index,item)">
                                <div class="content">
                                    <p class="headPhoto"><img :src="isHeadImgSpace(item.headImg)" width="46" height="46" alt="图片" /></p>
                                    <strong :class="counselorStatus"></strong>
                                    <div class="messageContent">
                                        <span class="nickName">{{item.nickName}}</span>
                                        <span class="getMsgTime">{{item.noticeTime}}</span>
                                        <span class="newMsg">{{item.lastMsg.indexOf('↵') > 0 ? item.lastMsg.substr(0, item.lastMsg.indexOf('↵')) : item.lastMsg}}</span>
                                        <strong v-show="msgNumIsshow(item.msgNum)">{{item.msgNum}}</strong>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <!-- 好友列表 -->
                        <ul v-show="msgFrinendsList">
                            <li :class="{checkedMsg: index === friendActive}" v-for="(item, index) in firendsList" :key="index" @click="crateWechatBox(item)">
                                <div class="content">
                                    <p class="headPhoto"><img :src="isHeadImgSpace(item.headImg)" width="46" height="46" alt="图片" /></p>
                                    <strong :class="counselorStatus"></strong>
                                    <span class="friendName">{{item.nickName}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 右边栏目 -->
            <div class="rightColum">
                <!-- 聊天好友信息 -->
                <div class="presentFriends" v-if="chatContentIsShow === false">
                    <span>{{chatContentFriendInfo.friendNickName}}</span>
                    <strong :class="counselorState"></strong>
                    <span class="collocationCon">{{counselorContent}}</span>
                </div>
                <!-- 第一次进入页面未选中展示样式 -->
                <div class="firstLogin" v-if="chatContentIsShow === true">
                    <img src="../images/img-insert-photo.png" alt="首次进入展示图片">
                    <p>选择客户开始聊天吧~</p>
                </div>
                <!-- 聊天内容框展示 -->
                <div class="wechatBox" v-if="chatContentIsShow === false">
                    <!-- 加载标识 -->
                    <p
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)">
                    </p>
                    <!-- 聊天内容框 -->
                    <div class="chatMessageBox" @scroll="scrollTopLoading">
                        <div :class="item.sendType === '1' ? 'rightMessageBox' : 'leftMessageBox'" v-for="(item, index) in messageContent" :key="index">
                            <span class="suerName" v-show="item.sendType === '1' ? true : false">{{item.nickName}}</span>
                            <p class="headPhoto"><img :src="isHeadImgSpace(item.headImg)" width="46" height="46" alt="图片" /></p>
                            <div class="timeContentBox">
                                <div :class="item.sendType === '1' ? 'rightMessage' : 'leftMessage'">
                                    <a v-if="item.contentType !== '6'">{{item.content}}</a>
                                    <img class="contentImg" v-else :src="item.content" alt="图片" />
                                </div>
                                <i class="iconfont iconupload_fail" aria-hidden="true" v-show="item.sendStaus === '2' || sendFailIsShow === true ? true : false"></i>
                                <span>{{item.noticeTime}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 内容发送框 -->
                    <div class="chatSendMessageBox">
                        <!-- 图片发送框 -->
                        <div class="sendPhotoBox">
                            <i class="iconfont iconupload_input" id="sendPhotoMsg" aria-hidden="true"></i>
                        </div>
                        <!-- 文字发送框 -->
                        <div class="sendContentBxo">
                            <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea"
                            class="contentIpt"
                            @keyup.native="listen($event)">
                            </el-input>
                            <el-button type="primary" size="small" :class="textarea === '' ? 'sendButton' : ''" :disabled="textarea === '' ? true : false"  @click="sendMessageContent">发送</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import { setTimeout, clearTimeout } from 'timers'
import { pollingNewMsg, getCounselorList, getChatContent, getChatContentInfo, getMessageFriendList, getFrinendsListInfo, sendMessageApi, getchatMessageFriendINfoApi, crateWechatBoxApi } from './api/weChatMessage.js'
import moment from 'moment'
window.mOxie = window.moxie = require('../../../../static/lib/uploads/moxie.js')
require('../../../../static/lib/uploads/plupload.dev')
export default {
    name: 'WeChatMessage',
    data () {
        return {
            // 是否展开折叠面板
            isUnfold: false,
            // 点击折叠按钮是否显示
            isButtonShow: true,
            // 咨询师列表选中样式
            counselorIsActive: 0,
            // 首次进入页面的值
            firstGoToPage: 0,
            // 咨询师姓名
            employeeName: '',
            // 咨询师头像
            counselorImg: '',
            // 消息数量是否显示
            // msgNumIsshowIndextrue: true,
            // 当前选中的微信Id
            presentWxid: '',
            // 当前选中的咨询师ID
            employeeId: '',
            // 消息和通讯录tabs切换按钮
            tabsButtonArr: [
                {
                    icon: 'iconxiaoxihei'
                },
                {
                    icon: 'iconline_list'
                }
            ],
            // 好友列表显示
            msgFrinendsList: false,
            // tabs切换文案
            tabsText: '消息列表',
            // 消息列表tabs active切换
            tabsIsActive: 0,
            // 消息列表页 active切换
            checkedMsgActive: -1,
            // 通讯录当前选中状态切换
            friendActive: 0,
            // 消息列表和通讯录列表切换
            msgListIsShow: true,
            // 发送消息的咨询师微信ID
            sendMessageId: '',
            //托管Id
            trusteeshipId: '',
            // 发送消息的好友微信ID
            senMessageFriendId: '',
            // 聊天内容框和首次进入提示框切换
            chatContentIsShow: '',
            // loading图标是否显示
            loading: false,
            // 发送消息输入框
            textarea: '',
            // 发送消息的咨询师姓名
            senMsgNickName: '',
            // 发送消息的咨询师头像
            senHeadImg: '',
            //咨询师列表
            counselorList: [],
            //消息列表
            messageList: [],
            // 聊天内容
            messageContent: [],
            // 好友列表
            firendsList: [],
            // 发送失败按钮是否显示
            sendFailIsShow: false,
            // 聊天内容框的好友信息
            chatContentFriendInfo: {},
            // 轮询清除
            clearTimeId: null,
            //请求的页码
            pageNum: 1,
            // 搜索
            restaurants: [],
            // 搜索框model值
            searchVal: '',
            timeout:  null,
            // 消息搜索
            messageVal: '',
            // 是否是好友列表搜索
            isFriendSearch: '',
            // 图片发送
            uploader: {},
            signs: {},
            imgUrl: '',
            clickCounIndex: '',
            itemList: '',
            // 托管状态
            trusteeshipStatus: '',
        }
    },
    watch: {
        messageList(newval, oldval) {
            return newval
        },
        messageContent(newval, oldval) {
            return newval
        },
        counselorList(newval, oldval) {
            return newval
        },
        deep: true
    },
    computed: {
        // 聊天内容框托管状态属性
        counselorState: function () {
            let status = this.chatContentFriendInfo.trusteeshipStatus
            if(status) {
                return this.counselorRadiusState(status) ? this.counselorRadiusState(status).className : ''
            }
        },
        //好友列表状态
        counselorStatus: function () {
            let status = this.trusteeshipStatus
            if(status) {
                return this.counselorRadiusState(status) ? this.counselorRadiusState(status).className : ''
            }
        },
        counselorContent: function () {
            let status = this.chatContentFriendInfo.trusteeshipStatus
            if(status) {
                return this.counselorRadiusState(status) ? this.counselorRadiusState(status).textContent : ''
            }
        },
        // 左边tab栏咨询师姓名、工号分割
        employeeNames: function () {
            if (this.employeeName.indexOf('_') > -1) {
                return this.employeeName.split('_')[0]
            }
        },
        jobNumbers: function () {
            if (this.employeeName.indexOf('_') > -1) {
                return this.employeeName.split('_')[1]
            }
        }
    },
    mounted () {
        this.getSign()
        this.chatContentIsShow = true
        // 离职咨询师列表获取
        this.getCounselorList()
        // 接口轮询      
        // this.getPollingNewMsg(true)
    },
    methods: {
        // 新消息轮询接口
         getPollingNewMsg (isClearTime) {
            if (isClearTime === false) {
                this.clearTimer()
            }else {
               this.clearTimeId = setTimeout(async () => {
                   try {
                       let result = await pollingNewMsg()
                       let { data } = result
                       if (data.code === 0) {
                           // 轮询到微信号有新消息再次调用咨询师列表更新
                           this.getCounselorList(data.data)
                           this.getPollingNewMsg(true)
                       }else {
                           this.getPollingNewMsg(true)
                       }
                   } catch(error) {
                       this.getPollingNewMsg(true)
                       console.log('轮询重连中.....')
                   }
                },2000)
            }
        },
        clearTimer() {   //清除最近的100个定时器，如果只清除最后一个，会出现bug
            let end = this.clearTimeId
            let start = end - 100 > 0 ? end - 100 : 0;
            for (let i = start; i <= end; i++) {
                clearTimeout(i)
            }
        },
        // 离职咨询师折叠列表展开/收缩
        clickUnfold () {
            this.isUnfold = !this.isUnfold
            this.isButtonShow = !this.isButtonShow
        },
        // 离职咨询师列表获取
        async getCounselorList (newWxidArr) {
            let result = await getCounselorList()
            let { data } = result
            if (data.code === 0) {
                this.counselorList = [...data.data]
                // 首次进入页面获取第一位咨询师的消息列表
                if (this.firstGoToPage === 0) {
                    // 首次进入页面第一位咨询师微信号id赋值
                    let wechatId = data.data[0].wxId
                    this.getMessageFriendsList(wechatId)
                    
                    // 咨询师头像
                    this.counselorImg = data.data[0].headImg
                    // 咨询师姓名
                    this.employeeName = data.data[0].employeeName
                    // 获取当前点击的咨询师微信ID
                    this.presentWxid = data.data[0].wxId
                    // 获取当前点击的咨询师ID
                    this.employeeId = data.data[0].employeeId
                    this.trusteeshipId = data.data[0].trusteeshipId
                    this.trusteeshipStatus = data.data[0].trusteeshipStatus
                }
                if(this.counselorList.length <= 4) {
                    this.isButtonShow = false
                } else {
                    this.isButtonShow = true
                }
                // 遍历轮询传进来的新消息微信数组，调取当前选中的咨询师的消息列表
                if(newWxidArr) {
                    newWxidArr.map(counselor => {
                        if (counselor.wxId === this.presentWxid) {
                            this.getMessageFriendsList(this.presentWxid, 'pullMsg')
                        }
                    })
                }
            }
        },
        // 咨询师头像为空时展示
        isHeadImgSpace (headImg) {
            return headImg === '' ? require('../../../assets/images/img-count-photo.png') : headImg
        },
        // 点击切换咨询师获取消息列表
        counselorInfo (index, presentWxid, employeeId, employeeName, headImg, trusteeshipStatus, trusteeshipId) {
            // 切换咨询师初始化为第一次进入
            this.firstGoToPage = 0
            this.counselorIsActive = index
            this.checkedMsgActive = -1
            // 获取当前点击的咨询师微信ID
            this.presentWxid = presentWxid
            // 获取当前点击的咨询师ID
            this.employeeId = employeeId
            //获取当前的托管ID
            this.trusteeshipId = trusteeshipId
            // 调用当前点击咨询师的消息列表
            this.getMessageFriendsList(presentWxid)
            this.trusteeshipStatus = trusteeshipStatus
            // 咨询师头像
            this.counselorImg = headImg
            // 咨询师姓名
            if (employeeName !== undefined) {
                this.employeeName = employeeName
            }
            // 当好友列表显示时，切换获取好友列表
            if (this.msgFrinendsList === true) {
                this.getFriendsList()
            }
        },
        clickCountoFirst (index) {
            // 切换咨询师初始化为第一次进入
            this.firstGoToPage = 0
            // 将当前点击的咨询师放到顶部栏目第一位
            let sliceList = this.counselorList.slice(index,index+1)
            this.counselorList.splice(index, 1)
            this.counselorList.unshift(sliceList[0])
            this.filterCounselorList(this.counselorList)
        },
        // 点击展开咨询师列表获取点击当前的咨询师
        openListSplit (index, presentWxid, employeeId, employeeName, headImg, trusteeshipStatus, trusteeshipId) {
            // 点击收起折叠面板
            this.isUnfold = false
            this.isButtonShow = true
            this.counselorIsActive = 0
            this.clickCounIndex = index
            this.clickCountoFirst(index)
            // 咨询师头像
            this.counselorImg = headImg
            // 咨询师姓名
            this.employeeName = employeeName
            // 获取当前点击的咨询师微信ID
            this.presentWxid = presentWxid
            // 获取当前点击的咨询师ID
            this.employeeId = employeeId
            this.trusteeshipId = trusteeshipId
            // 调用当前点击咨询师的消息列表
            this.getMessageFriendsList(presentWxid)
            this.trusteeshipStatus = trusteeshipStatus
            // 当好友列表显示时，切换获取好友列表
            if (this.msgFrinendsList === true) {
                this.getFriendsList()
            }
        },
        // 消息列表页tabs样式切换
        checkTabs (index) {
            this.tabsIsActive = index
            if (index === 0) {
                this.msgListIsShow = true
                this.msgFrinendsList = false
                this.getMessageFriendsList(this.presentWxid)
                this.tabsText = '消息列表'
                this.isFriendSearch = ''
            } else if (index === 1) {
                // 清空搜索框的值
                // this.messageVal = ''
                this.isFriendSearch = 'frined'
                this.getFriendsList()
                this.msgListIsShow = false
                this.msgFrinendsList = true
                this.tabsText = '联系人'
            }
        },
        // 消息列表内容切换
        msgTabs (index,item,clickGetMsg) {
            this.checkedMsgActive = index
            this.itemList = item
            // 显示聊天内容框
            this.chatContentIsShow = false  
            this.$nextTick(() => {
                this.getMessageFriendsList(item.wxId,'pullMsg')
                this.initPlupload()
                if(clickGetMsg !== false) {                                  
                    // 切换时清空值
                    this.messageContent = []
                    this.pageNum = 0
                    // 获取聊天内容,值为false为不是点击触发的获取
                    this.getChatContentList(item.wxId,item.friendWxId,1,true,false)
                    // 发送消息的微信ID和好友ID赋值
                    this.sendMessageId = item.wxId
                    this.senMessageFriendId = item.friendWxId
                    // 获取聊天框的好友信息及托管状态
                    this.getChatFrendsInfo(item.wxId)
                    if(this.chatContentIsShow === false) {
                        this.msgNumIsshow(0)
                    }
                }
            })
        },
        // 获取消息列表
        async getMessageFriendsList (wechatId, pullMsg, friendsId) {
            let params = {
                wxId: wechatId
            }
            let result = await getMessageFriendList(params)
            let { data } = result
            if (data.code === 0) {
                if(data.msg === '该微信无对话数据'){
                    this.messageList = []
                } else {
                    this.$nextTick(() => {
                        this.firstGoToPage = 0
                        if(this.firstGoToPage === 1) {
                            this.msgTabs(this.checkedMsgActive,this.itemList,false)
                            let index = this.counselorList.findIndex(a => a.employeeId === this.employeeId)
                            this.clickCountoFirst(index)
                        }
                        this.firstGoToPage = 1
                        this.messageList = [...data.data]
                        if (friendsId) {
                            let index = this.messageList.findIndex(a => a.friendWxId === friendsId)
                            this.msgTabs(index)
                        }
                        if (this.chatContentIsShow === false && pullMsg === 'pullMsg') {
                            this.getChatContentList(this.sendMessageId, this.senMessageFriendId,1, true, false)
                        }
                    })
                }
            } else {
                this.messageList = []
            }
        },
        // 消息数量是否显示
        msgNumIsshow (msgNum) {
            return msgNum > '0';
        },
        // 获取好友列表
        async getFriendsList () {
            let params = {
                wxId: this.presentWxid,
                trusteeshipId: this.trusteeshipId,
                name: '',
            }
            let result = await getFrinendsListInfo(params)
            let { data } = result
            this.firendsList = data.data
        },
        // 点击好友生成聊天框
        async crateWechatBox ({ wxId, friendWxId, nickName, headImg }) {
            let params = {
                wxId: wxId,
                friendWxId: friendWxId,
                nickName: nickName,
                headImg: headImg
            }
            let result = await crateWechatBoxApi(params)
            let { data } = result
            if (data.code === 0) {
                
                this.$nextTick(() => {
                    this.tabsIsActive = 0
                    this.msgListIsShow = true
                    this.msgFrinendsList = false
                    this.getMessageFriendsList(wxId, 'asd',friendWxId)
                    this.msgListIsShow = true
                // 清空搜索框的值
                // this.messageVal = ''
                // 显示聊天内容框
                this.chatContentIsShow = false
                this.messageContent = []
                // 调用聊天内容
                this.getChatContentList(wxId,friendWxId)
                // 获取聊天框的好友信息及托管状态
                this.senMessageFriendId = friendWxId
                this.getChatFrendsInfo(wxId)
                })
                
            }           
        },
        // 获取聊天内容框的好友信息
        async getChatMsgContInfo () {
            let params = {
                wxId: this.wechatId
            }
            await getChatContentInfo(params)
        },
        // 获取聊天内容列表
        async getChatContentList (wxid,friendWxId,page = 1,isConcat = true, isclickGet = undefined) {
            let params = {
                wxId: wxid,
                friendWxId: friendWxId,
                page: page
            }
            let result = await getChatContent(params)
            let { data } = result
            if (data.code === 0) {
                if(data.msg === '无聊天记录') {
                    // 正在加载效果取消
                    this.loading = false
                }else {
                    this.$nextTick(() => {
                        if(isclickGet === false) {
                            this.getMessageFriendsList(wxid)
                            this.getCounselorList()
                        }                       
                        data.data.reverse()
                        this.messageContent.unshift(...data.data)
                        this.senMsgNickName = data.data[0].nickName
                        this.senHeadImg = data.data[0].headImg
                        this.messageContent = this.unique(this.messageContent)
                        // 向上滚动加载滚动条保持不变
                        if(isConcat !== false && this.chatContentIsShow === false) {
                            // 滚动条到底部 接口调通后需要放到接口请求里
                            this.scrollKeepBottom()
                        }
                    })
                }
                // 正在加载效果取消
                this.loading = false
            }else {
                this.messageContent = []
                // 正在加载效果取消
                this.loading = false
            }
        },
        // 对象数组去重
        unique(songs) {
            let result = {};
            let finalResult = [];
            for (let i = 0; i < songs.length; i++) {
                result[songs[i].id] = songs[i];
            }
            for (let item in result) {
                finalResult.push(result[item]);
            }
            return finalResult;
        },
        // 获取聊天框的好友信息及托管状态
        async getChatFrendsInfo (wxId) {
            let params = {
                wxId: wxId,
                friendWxId: this.senMessageFriendId,
                trusteeshipId: this.trusteeshipId
            }
            let result = await getchatMessageFriendINfoApi(params)
            let { data } = result
            if (data.code === 0) {
                this.chatContentFriendInfo = data.data
                this.trusteeshipStatus = data.data.trusteeshipStatus
            }
        },
        // 滚动条滚动到顶部获取新消息
        scrollTopLoading (e) {
            if(e.target.scrollTop === 0) {
                this.loading = true
                this.pageNum += 1
                this.getChatContentList(this.sendMessageId,this.senMessageFriendId,this.pageNum,false)
            }
        },
        listen (event) {
            if (event.keyCode === 13) {
                this.sendMessageContent() // 发送文本
                event.preventDefault() // 阻止浏览器默认换行操作
                return false
            }
        },
        // 点击发送消息
        async sendMessageContent () {
            let spaceReg = /\s\S+|S+\s|\S/
            if (spaceReg.test(this.textarea) === false || this.textarea === '') {
                return false
            }
            let params = {
                wxId: this.sendMessageId,
                friendWxId: this.senMessageFriendId,
                content: this.textarea,
                img: ''
            }
            let result = await sendMessageApi(params)
            let { data } = result
            if (data.code === 0) {
                this.$nextTick(() => {
                    // this.messageContent.push(sendCon)
                    // this.messageContent[this.messageContent.length-1].senIconIsShow = false
                    this.textarea = ''
                    this.scrollKeepBottom()
                    this.getChatContentList(this.sendMessageId,this.senMessageFriendId)
                })
            } 
            // else {
            //     this.$nextTick(() => {
            //         this.messageContent.push(sendCon)
            //         this.messageContent[this.messageContent.length-1].senIconIsShow = true
            //         this.textarea = ''
            //         this.scrollKeepBottom()
            // })
            // }
        },
        // 咨询师搜索
        async querySearchAsync(queryString, cb) {
            let params = {
                name: queryString
            }
            let result = await getCounselorList(params)
            let { data } = result
            if (data.code === 0) {
                    data.data.map((state) => {
                        return state.value = state.employeeName
                    })
                    this.timeout = setTimeout(() => {
                    cb(data.data);
                    }, 3000 * Math.random())
            } else if (data.code === 1002) {
                if(data.msg === '无托管咨询师数据'){
                    data.data = [{value: '未找到结果'}]
                    this.timeout = setTimeout(() => {
                        cb(data.data);
                    }, 3000 * Math.random())
                }
            }
        },
        handleSelect(item) {
            if (item.value === "未找到结果") {
                this.searchVal = ''
                return 
            } else {
                let index = this.counselorList.findIndex(a => a.employeeName === item.employeeName)
                this.openListSplit(index, item.wxId, item.employeeId, item.employeeName, item.headImg, item.trusteeshipStatus)
            }
        },
        // 消息列表搜索
        async querySearchAsync1(queryString, cb) {
            let result
            if (this.isFriendSearch === 'frined') {
                let params = {
                    wxId: this.presentWxid,
                    trusteeshipId: this.trusteeshipId,
                    name: queryString
                }
                result = await getFrinendsListInfo(params)
            } else {
                let params = {
                    wxId: this.presentWxid,
                    name: queryString
                }
                result = await getMessageFriendList(params)
            }
            if (result) {
                let { data } = result
                if (data.code === 0) {
                    if(data.msg === '该微信无对话数据' || data.msg === '未找到好友信息'){
                        data.data = [{value: '未找到结果'}]
                        this.timeout = setTimeout(() => {
                            cb(data.data);
                        }, 3000 * Math.random())
                    } else {
                        data.data.map((state) => {
                        return state.value = state.nickName
                    })
                    this.timeout = setTimeout(() => {
                    cb(data.data);
                    }, 3000 * Math.random())
                    }
                    
                }
            }
        },
        handleSelect1(item) {
            if (item.value === "未找到结果") {
                this.messageVal = ''
                return 
            } else if (this.isFriendSearch === 'frined') {
                this.crateWechatBox(item)
            } else {
                let index = this.messageList.findIndex(a => a.friendWxId === item.friendWxId)
                this.msgTabs(index, item)
            }
            // 清空搜索框的值
            this.messageVal = ''
        },
        // 请求oss上传设置参数
        getSign () {
            let params = {
                cate: 'sop_web'
            }
            this.axios.post('/backend-api/bk-api-upload/get-upload-sign', params).then((res) => {
                if (res.data.code === 0) {
                this.signs = res.data.data
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        // 图片发送
        initPlupload () {
            // http://comjia-1.oss-cn-beijing.aliyuncs.com/sop_web/icon-@2x.png
            let that = this
            var maxSize = '10mb'
            // 定义 plupload 对象
            function setUploadParam (up, filename, ret) {
                // filename = filename.replace(/\s*/g,"");
                filename = filename.substr(filename.lastIndexOf('.'))
                let keyName = that.signs.dir + moment().format('X') + filename
                let newMultipartParams = {
                key: keyName,
                policy: that.signs.policy,
                OSSAccessKeyId: that.signs.accessid,
                success_action_status: 200, // 默认是 204
                signature: that.signs.signature
                }
                up.setOption({
                'url': that.signs.host,
                'multipart_params': newMultipartParams
                })
                up.start()
                return keyName
            }
            that.uploader = new plupload.Uploader({
            multi_selection: false, // 禁止多文件上传
            browse_button: 'sendPhotoMsg', // 触发文件上传的按钮 id（传入的参数）
            url: that.signs.host, // 服务器的地址，与提供的阿里云的地址一致
            filters: {
                mime_types: [
                    {
                    title: 'Image files',
                    extensions: 'jpg,png,svg,gif,jpeg' // 允许上传的文件类型
                    }
                ],
                max_file_size: maxSize, // 允许上传的最大尺寸
                prevent_duplicates: false // 不允许上传重复文件
            },
            init: {
                // 上传初始化
                // PostInit: function () {
                //     setUploadParam(that.uploader, '', false)
                // },
                // 文件添加到上传队列后
                FilesAdded: function (up, files) {
                    that.imgUrl = setUploadParam(that.uploader, files[0].name, false)
                },
                FileUploaded: function (up, file, info) {
                    // file 里可以得到压缩率
                    if (info.status === 200) {
                        let sendCon = {
                            sendType: '1',
                            nickName: that.senMsgNickName,
                            headImg: that.senHeadImg,
                            content: that.signs.host + '/' + that.imgUrl,
                            contentType: '6',
                            noticeTime: that.momentDate(new Date().getTime()),
                            senIconIsShow: false
                        }
                        if(that.trusteeshipStatus > '1'){
                            that.messageContent.push(sendCon)
                            that.messageContent[that.messageContent.length-1].senIconIsShow = true
                            if(that.messageContent[that.messageContent.length-1].senIconIsShow === true) {
                                that.sendFailIsShow = true
                            }
                            that.scrollKeepBottom()
                        } else {
                            that.messageContent.push(sendCon)
                            that.scrollKeepBottom()
                        }                      
                        let params = {
                            wxId: that.sendMessageId,
                            friendWxId: that.senMessageFriendId,
                            img: that.signs.host + '/' + that.imgUrl
                        }
                        sendMessageApi(params)
                        .then((data) => {
                            if (data.data.code === 0) {
                                that.messageContent=[]
                                that.$nextTick(() => {
                                    that.getChatContentList(that.sendMessageId,that.senMessageFriendId)
                                    that.textarea = ''
                                    that.scrollKeepBottom()
                                })
                            } else {
                                that.$nextTick(() => {
                                    that.textarea = ''
                                    that.scrollKeepBottom()
                                })
                            }
                        })
                    } else if (info.status === 203) {
                        alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response)
                    } else {
                        alert(info.respose)
                    }
                },
                BeforeUpload: function (up, file) {
                  setUploadParam(that.uploader, file.name)
                },
                // 错误信息
                Error: function (up, err) {
                    if (err.code === -600) {
                    alert('图片大小不能超过' + maxSize)
                    } else if (err.code === -601) {
                    alert('文件类型不正确')
                    } else if (err.code === -602) {
                    alert('已上传过')
                    } else {
                    alert(err)
                    }
                }
            }
        })
        that.uploader.init()
        },
        // 过滤顶部托管中的咨询师列表
        filterCounselorList (conList) {
            return conList.slice(0,4)
        },
        // 托管状态圆点颜色
        counselorRadiusState (state) {
            if (state) {
                if(state === 1 || state === '1') {
                    return {
                        className: 'collocationStates',
                        textContent: '托管中'
                    }
                } else if (state === 2 || state === '2') {
                    return {
                        className: 'unmanagedState',
                        textContent: '未托管'
                    }
                } else if(state === 3 || state === '3'){
                    return {
                        className: 'leaverState',
                        textContent: '离线中'
                    }
                }
            }
        },
        // 让滚动条保持在最底部
        scrollKeepBottom () {
            setTimeout(()=>{
                    let oDiv = document.querySelector('.chatMessageBox')
                    oDiv.scrollTop = oDiv.scrollHeight
            },100)
        },
        momentDate (date) {
            return moment(date).format('YYYY年MM月DD日 HH:mm:ss')
        },
    },
    beforeDestroy () {
        this.clearTimer()
        this.getPollingNewMsg(false)
    },
}
</script>

<style scoped>
.wechatParent {
    width: 100%;
    padding: 0 0 50px 40px;
    box-sizing: border-box;
}
.messageBorder {
    width: 1348px;
    height: 700px;
    position: relative;
    left: 50%;
    margin-left: -695px;
}
/* 顶部栏目 */
.topColum {
    width: 100%;
    height: 70px;
    background: #77808A;
    font-family: PingFangSC-Regular;
    display: flex;
}
/* 左边title、搜索框样式 */
.titleLeft {
    width: 361px;
    height: 70px;
    margin-left: 20px;
}
.titleMsg {
    width: 96px;
    height: 70px;
    font-size: 16px;
    line-height: 70px;
    color: #ffffff;
    float: left;
}
.titleLeft >>> .el-input, .messageSerach >>> .el-input {
    width: 249px;
    height: 48px;
    float: left;
    margin: 12px 0 19px 16px;
    line-height: 48px;
}
.titleLeft >>> .el-input__inner, .messageSerach >>> .el-input__inner {
    border-radius: 24px;
    height:48px;
    padding-left: 64px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: #bbb;
    border: 0;
}
.titleLeft >>> .el-input__inner {
    height: 38px;
}
.messageSerach >>> .el-input__inner {
    background: #F4F6F9;
}
.messageSerach >>> .el-icon-search:before, .titleLeft >>> .el-icon-search:before {
    font-size: 18px;
    font-weight: bold;
    margin-left: 30px;
}
.messageSerach >>> .el-input__icon, .titleLeft >>> .el-input__icon {
    line-height: 46px;
}
/* 离职咨询师列表 */
.counselorList {
    flex: 1;
    padding: 16px 20px 20px 0;
    box-sizing: border-box;
}
.counselor{
    height: 38px;
    background: #ffffff;
    border-radius: 43px;
    padding-right: 10px;
    box-sizing: border-box;
    display: inline-flex;
    margin-left: 40px;
    cursor: pointer;
}
.counselor span {
    width: 88.27px;
    line-height: 46px;
}
.checkedCounselor {
    background: #3E4A59;
}
.checkedCounselor span {
    color: #fff !important;
}
/* 头像框 */
.counselor p, .headPortrait p, .friendsMessage ul li .headPhoto, .leftMessageBox .headPhoto, .rightMessageBox .headPhoto {
    width: 38px;
    height: 38px;
    border-radius: 100%;;
    margin-right: 10.7px;
    overflow: hidden;
    text-align: center;
}
/* 头像裁剪 */
.counselor p img, .headPortrait p img {
    width: 100%;
    height: 100%;
    display: inherit;
}
.counselor span {
    color: #181C2F;
    line-height: 38px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    max-width: 88.27px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.counselor b, .messageContent b {
    background: #FF4958;
    border-radius: 100px;
    margin-left: 6px;
    min-width: 18px;
    text-align: center;
    padding: 0 3px;
    box-sizing: border-box;
    height: 18px;
    color: #fff;
    margin-top: 14px;
    font-family: PingFangSC-Medium;
}
.counselor b {
    margin-top: 9px;
}
.counselorList .iconfont {
    font-size: 20px;
    color: #fff;
    float: right;
    margin-top: 10px;
    cursor: pointer;
}
/* 折叠展开页面 */
.openCounselorList {
    position: absolute;
    width: 1348px;
    height: 0px;
    background: #77808A;
    top: 70px;
    transition: height 3s;
    -moz-transition: height 3s; /* Firefox 4 */
    -webkit-transition: all 3s; /* Safari and Chrome */
    -o-transition: height 3s; /* Opera */
    display: none;
    z-index: 8;
}
.openCounselorList:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
    background: #fff;
}
.transitionHeight {
    height: auto;
    display: block;
}
.transitionHeight .iconfont {
    transform: rotate(180deg);
    position: absolute;
    bottom: 19px;
    right: 20px;
}
.transitionHeight .counselorList {
    padding: 0 0 22px 0;
    margin: -5px 0 0 -20px;
}
.transitionHeight .counselor {
    margin-top: 25px;
    margin-left: 50px;
}
/* 左边栏目 */
.leftColum {
    width: 418px;
    height: 614px;
    background: #fff;
    float: left
}
/* 左边tabs切换栏目 */
.tabLeft {
    width: 77px;
    height: 100%;
    border: 1px solid #F4F6F9;
    float: left;
}
.headPortrait {
    width: 100%;
    height: 156px;
    padding: 30px 16px;
    box-sizing: border-box;
}
.headPortrait p {
    margin: 0 0 10px 0;
}
.headPortrait span, .headPortrait a {
    display: block;
    width: 42px;
    height: 18px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
/* tabs切换 */
.tabs .messageList {
    width: 78px;
    height: 78px;
    text-align: center;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.tabs .iconfont {
    font-size: 26px;
    color: #666;
    margin: auto;
}
/* tabs选中状态 */
.isCheckTabs {
    background: #2E9AE2;
}
.isCheckTabs .iconfont {
    color: #fff;
}
/* 消息列表 */
.newMessage {
    width: 338px;
    height: 614px;
    float: left;
}
/* 搜索框 */
.messageSerach {
    width: 100%;
    height: 150px;
    padding: 30px 0 30px 30px;
    box-sizing: border-box;
}
.messageSerach >>> .el-input {
    margin: 20px 0 0 0;
}
.messageSerach >>> .el-input__inner {
    width: 272px;
}
/* 好友消息列表 */
.friendsMessage {
    width: 100%;
    height: 464px;
    background: #fff;
    overflow-y: auto;
}
/* 用户信息 */
.presentFriends {
    width: 100%;
    height: 62px;
    background: #F7F8F9;
    line-height: 62px;
    display: inline-flex;
}
.presentFriends div:nth-child(1) {
    display: inline-flex;
}
.presentFriends span:nth-child(1) {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #181C2F;
    margin-left: 30px;
}
/* 托管状态圆点 */
.collocationStates, .leaverState, .unmanagedState {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    border: 2px solid #fff;
    background: #34D859;
    margin: 25px 8px 0 8px;
}
/* 离线托管状态颜色 */
.leaverState {
    background: #bbbbbb;
}
/* 未托管状态颜色 */
.unmanagedState {
    background: #FF4958;
}
.presentFriends .collocationCon {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    margin-top: 1px;
}
/* 未选中样式 */
.friendsMessage ul li {
    width: 100%;
    height: 60px;
    background: #fff;
    padding: 12px 30px;
    box-sizing: border-box;
    cursor: pointer;
}
/* 选中当前样式 */
.checkedMsg {
    width: 100%;
    height: 60px;
    background: #F7F8F9 !important;
    box-shadow: inset 3px 0 0 0 #33A1FF;
    padding: 12px 30px;
    box-sizing: border-box;
}
.friendsMessage .content {
    display: inline-flex;
    position: relative;
}
.friendsMessage ul li .headPhoto  {
    background: #181C2F;
}
.content .collocationStates, .content .leaverState, .content .unmanagedState {
    margin:0;
    position: absolute;
    top: 0;
    left: 28px;
}
.friendsMessage .messageContent {
    width: 210px;
    height: 22px;
    position: relative;
}
.messageContent .nickName, .friendName {
    float: left;
    font-size: 16px;
    color: #181C2F;
}
.messageContent .nickName, .headPortrait .nickName {
    max-width: 100px;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.friendsMessage .messageContent .getMsgTime {
    font-size: 12px;
    color: #999999;
    float: right;
    margin-right: -19px;
}
.messageContent .newMsg, .shortNewMsg {
    max-width: 210px;
    width: 195px;   /*获取数据后修改*/
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #BBBBBB;
}

.messageContent b {
    display: inline-block;
    margin-top: 4px;
    margin-left: 10px;
    position: absolute;
    right: 0;
    top: 18px;
}
/* 通讯录列表 用户名 */
.friendName {
    margin-top: 14px;
}
/* 右边栏目 */
.rightColum {
    width: 930px;
    height: 614px;
    float: left;
    background: #fff;
    border-left: 1px solid #F4F6F9;
    box-sizing: border-box;
}
/* 首次进入未选中插画 */
.firstLogin {
    width: 100%;
    height: 548px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.firstLogin p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #77808A;
    margin-top: 30px;
}
/* 聊天内容框 */
.wechatBox {
    width: 100%;
    height: 552px;
    display: flex;
    flex-direction: column;
}
.chatMessageBox {
    width: 100%;
    height: 400px;
    background: #F7F8F9;
    overflow-y: auto;
}
/* 左边聊天内容 */
/* 清除浮动 */
.leftMessageBox:after, .rightMessageBox:after, .timeContentBox:after {
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0;
}
/* 左右聊天内容框 */
.rightMessageBox, .leftMessageBox {
    box-sizing: border-box;
    position: relative;
}
.rightMessageBox {
    margin-bottom: 20px;
}
.rightMessageBox .suerName, .leftMessageBox .suerName {
    top: -24px;
}
.contentImg {
    max-width: 100%;
}
.rightMessageBox .headPhoto{
    float: right;
    margin: 0 30px 56px 0;
}
.leftMessageBox .headPhoto {
    float: left;
    margin: 0 0 56px 30px;
}
.leftMessage, .rightMessage {
    margin-left: 20px;
	max-width: 480px;
	background: #fff;
    color: #fff;
	position: relative;
	-moz-border-radius: 12px;
	-webkit-border-radius: 12px;
	border-radius: 4px;

    box-sizing: border-box;
    font-size: 14px;
    word-break: break-word;
}
.rightMessage a {
    float: left;
    color: #fff;
    padding: 12px;
    text-decoration: none;
}
.leftMessage a {
    float: left;
    color: #333;
    padding: 12px;
    text-decoration: none;
}
.leftMessage {
    float: left;
    margin-bottom: 56px;
    color: #333
}
.rightMessage {
    float: right;
    margin: 0 20px 56px 0;
    background: #2E9AE2;
}
.leftMessage:before {
	content: "";
	width: 0;
	height: 0;
	right: 100%;
	top: 15px;
	position: absolute;
	border: 2px solid transparent;
	border-right: 4px solid #ffffff;
	/* 这边有一些改动 */
}
.rightMessage:before {
	content: "";
	width: 0;
	height: 0;
	left: 100%;
	top: 15px;
	position: absolute;
	border: 2px solid transparent;
	border-left: 4px solid #33A1FF;
	/* 这边有一些改动 */
}
.rightMessageBox span, .leftMessageBox span {
    position: absolute;
    right: 95px;
    bottom: 30px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #BBBBBB;
}
.leftMessageBox span {
    bottom: 30px;
    left: 95px;
}
.timeContentBox {
    position: relative;
}
/* 发送失败icon */
.rightMessageBox .iconfont{
    float: right;
    margin: 15px 15px 0 0;
    color: #FF4958;
}
.leftMessageBox .iconfont {
    float: left;
    margin: 15px 0 0 15px;
    color: #FF4958;
}
/* 发送内容框 */
.chatSendMessageBox {
    width: 100%;
    height: 160px;
    background: #fff;
}
.sendPhotoBox {
    width: 100%;
    height: 37.5px;
    border-bottom: 1px solid #F4F6F9;
    line-height: 37.5px;
}
.sendPhotoBox .iconfont {
    font-size: 18px;
    margin-left: 30px;
    cursor: pointer;
}
.sendContentBxo >>> .el-textarea__inner {
    width: 100%;
    height: 70px;
    border: 0px;
    resize: none;
}
.sendContentBxo >>> .el-button--small {
    float: right;
    margin-right: 32px;
    background:#2E9AE2;
    margin-bottom: 30px;
    width: 72px;
}
.sendButton {
    background: #2E9AE2;
    opacity: .3;
}
</style>
