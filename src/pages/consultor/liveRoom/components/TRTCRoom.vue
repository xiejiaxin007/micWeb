<!--
 * @Name: 直播间总页面
 * @Description: 直播间总页面
 * @Author: xueshuai
 * @Date: 2020-02-16
 -->
<template>
<div class="trtc-room-wrap">
    <div
        class="live-room-box"
        v-if="(roomUserList.length || totalUser >= 0) && flag">
        <div class="room">
            <div
                class="room-R"
                :class="{'live-end' : liveEnd}">
                <div
                    class="live-L"
                    :class="{'busy-state':curUser.user_state != 0 || curUser.camera_state === 'off' || curUser.stream_share,'sharing': curUser.stream_share}">
                    <div class="live-operat-wrap">

                        <div class="operat-bar">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                v-for="(item,index) in operatBarList"
                                :content="item.name"
                                :key="index"
                                placement="top">
                                <div
                                    class="operat-box"
                                    v-show="item.show">
                                    <div
                                        class="btn-box"
                                        @click="handleOperat(item)">
                                        <jl-icon-svg
                                            :class="item.state? item.icon + '-' + item.state : item.icon"
                                            :icon-class="item.state? item.icon + '-' + item.state : item.icon" />
                                    </div>

                                </div>
                            </el-tooltip>
                        </div>
                        <div
                            class="hangup-box"
                            v-if="!showBoard">
                            <div
                                class="hangup-btn"
                                @click="hangup">
                                <span>挂断{{hangupTime > 0 && isMaster ? "(" + hangupTime +"S)" : ""}}</span>

                            </div>
                        </div>

                    </div>
                </div>
                <div class="live-R">
                    <div class="live-box-info">
                        <span>人数：{{onlineUsers}}/9</span>
                        <span>{{continueTime}}</span>
                    </div>
                    <div class="list-tips">为保证客户体验，请注意掌握节奏哦</div>
                    <ul class="list-wrap">
                        <li
                            class="list-box"
                            :class="{'list-box-layer':(item.camera_state === 'off' || item.user_state != 0) && !item.stream_share ,'active':curUserID === item.user_id}"
                            v-for="(item,index) in roomUserListSort"
                            :key="index">
                            <div class="list-info">
                                <div
                                    @click="switchUser(item)"
                                    class="enlarge-item">
                                    <jl-icon-svg icon-class="svg-enlarge"></jl-icon-svg>
                                </div>
                                <div class="list-info-detail">
                                    <span>{{item.name ? item.name : item.user_id}}</span>
                                    <span class="tell-box">{{item.tell}}</span>
                                </div>
                            </div>
                            <div class="list-state">
                                <div class="list-state-L">
                                    <jl-icon-svg :icon-class="'micro' + '-' + item.micro_state" />
                                    <div
                                        class="delete-btn"
                                        v-if="item.user_state === 0"
                                        @click.stop="removeUser(item.user_id)">
                                        <jl-icon-svg icon-class="delete" />
                                        <span>删除</span>
                                    </div>
                                </div>
                                <div class="list-state-R">
                                    <span>{{userState(item.user_state)}}</span>
                                    <span class="list-state-icon" :class="'list-state-' + item.user_state"></span>
                                </div>
                            </div>
                            <div
                                class="bg-img"
                                :class="{'default': !item.user_img}"
                                v-if="item.camera_state === 'off' || item.user_state != 0 || item.isEnlarge">
                                <img :src="item.user_img ? item.user_img : (judgeRole(item.user_id) === 'zxs'? list_default_zxs : list_default_kh)" alt="" srcset="">
                            </div>
                            <div
                                class="list-video-box"
                                :id="'live-video-' + item.user_id"
                                :class="'bg-list-'+ judgeRole(item.user_id)">
                            </div>
                            <div
                                class="list-share-box"
                                v-show="item.stream_share"
                                :id="'live-share-' + item.user_id"></div>
                            <div class="list-state-layer">
                                <span v-if="item.camera_state === 'off' &&  item.user_state === 0">摄像头已关闭</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    class="end-tip"
                    v-if="liveEnd">
                    <span>线上看房已结束，共{{totalUser >= 0 ? totalUser : participate}}人参与，共视频{{totalMin}}分钟</span>
                    <div
                        class="reJoin"
                        v-if="!isMaster"
                        @click="reload">重新进入</div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog
        :visible="showBoard"
        width="780px"
        :show-close="false"
        :close-on-click-moda="false"
        :close-on-press-escape="false"
        top="0"
        custom-class="board-wrap">
        <div
            class="board-hd"
            v-if="isMaster">
            <span>选择视频</span>
            <el-select
                class="select-video-inp"
                v-model="curSelectVideo"
                filterable
                remote
                clearable
                @change="handleSelectVideo"
                placeholder="请选择视频"
                :remote-method="searhVideo">
                <el-option
                    v-for="item in videoList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.url">
                </el-option>
            </el-select>
            <div
                class="finish-btn"
                @click="finishVideo">结束视频</div>
        </div>
        <div
            class="board-bd"
            id="board-con">
        </div>
    </el-dialog>
    <!-- 用户列表放大弹窗 -->
    <el-dialog
        custom-class="user-enlarge-wrapper"
        :close-on-press-escape="false"
        :visible="streamShow"
        :before-close="closeEnlarge"
        :show-close="false"
        width="780px"
        center>
        <div class="dialog-body-box">
            <div :class="`${(curUser.camera_state === 'off' || curUser.user_state != 0) ? 'enlarge-header-box back-reset' : 'enlarge-header-box'}`">
                <div
                    @click="closeEnlarge"
                    class="close-dialog">
                    <jl-icon-svg icon-class="svg-shrink"></jl-icon-svg>
                </div>
                <div class="header-name">
                    <span>{{curUser.name ? curUser.name : curUser.user_id}}</span>
                    <span class="tell-box">{{curUser.tell}}</span>
                </div>
            </div>
            <div class="enlarge-body-box">
                <div
                    class="live-dialog"
                    :class="{'busy-state':curUser.user_state != 0 || curUser.camera_state === 'off' || curUser.stream_share,'sharing': curUser.stream_share}">
                    <div
                        class="bg-img dialog-bg-img"
                        :class="{'default': !curUser.user_img}"
                        v-if="curUser.camera_state === 'off' || curUser.user_state != 0">
                        <img :src="curUser.user_img ? curUser.user_img : (judgeRole(curUser.user_id) === 'zxs'? live_default_zxs : live_default_kh)" alt="" srcset="">
                    </div>
                    <div
                        class="live-box"
                        id="live-video">
                    </div>
                    <div
                        v-if="curUser.user_state != 0"
                        class="live-state-layer">
                        <div class="live-state">{{userState(curUser.user_state)}}</div>
                    </div>
                    <div
                        v-if="curUser.camera_state === 'off' && curUser.user_state == 0"
                        class="live-state-layer">
                        <div class="live-state">摄像头已关闭</div>
                    </div>
                </div>
            </div>
            <div :class="`${(curUser.camera_state === 'off' || curUser.user_state != 0) ? 'enlarge-footer-box back-reset' : 'enlarge-footer-box'}`">
                <div class="mic-state-box">
                    <jl-icon-svg :icon-class="'micro' + '-' + curUser.micro_state" />
                </div>
                <div class="state-box">
                    <span>{{userState(curUser.user_state)}}</span>
                    <span class="list-state-icon" :class="'list-state-' + curUser.user_state"></span>
                </div>
            </div>
        </div>
    </el-dialog>
    <online-invatation-dialog
        ref="dialog"
        :invitationShow="invitationShow"
        @leaveRoomFun="leaveRoomFun"
        @closeRoomFun="closeRoomFun"
        @cancelInvitation="invitationShow=false"
        :roomId="roomId"
        :cityId="cityId"
        :shareUrl="shareUrl"></online-invatation-dialog>
</div>
</template>

<script>
// 引入TRTC JS-SDK
import TRTC from "trtc-js-sdk";
import api from "../api/liveRoomApi";
// 引入Video.js 用于互动白板
import videojs from "video.js";
window.videojs = videojs;
// 引入互动白板
import TEduBoard from '../js/TEduBoard.min.js';
// 引入TIM
import TIM from "tim-js-sdk";
window.TIM = TIM;
import {
    mapState
} from 'vuex';
// 咨询师默认大图
import live_default_zxs from "../images/bg-default-zxs.png";
// 咨询师默认列表图
import list_default_zxs from "../images/bg-default-list-zxs.png";
// 用户默认大图
import live_default_kh from "../images/bg-default-kh.png";
// 用户默认列表图
import list_default_kh from "../images/bg-default-list-kh.png";
// 引入弹窗
import OnlineInvatationDialog from "./OnlineInvatationDialog";
// 公共方法
import {
    commonFun
} from '@/assets/js/utils/utils';
export default {
    name: "live-room",
    data() {
        return {
            // 用户列表放大弹窗展示
            streamShow: false,
            // 默认图
            list_default_zxs: list_default_zxs,
            live_default_zxs: live_default_zxs,
            list_default_kh: list_default_kh,
            live_default_kh: live_default_kh,
            // 本地Client对象
            localClient: null,
            // 屏幕分享client
            shareClient: null,
            // 白板用户音视频client（仅主持人）
            boradClient: null,
            // 白板流
            boardStream: null,
            // 白板用户签名
            boardUserSig: "",
            // 房间ID
            roomId: "",
            // 本地音视频流
            localStream: null,
            localStream2: null,
            // 客户最新需求
            clientDemand: {},
            // 客户信息
            clientInfo: {},
            operatBarList: [{
                    icon: "screen-share",
                    name: "屏幕共享",
                    active: "off",
                    show: true
                },
                {
                    icon: "open-draw",
                    name: "打开画板",
                    show: false
                },
                {
                    icon: "sign",
                    name: "标记",
                    show: false
                },
                {
                    icon: "sign-clear",
                    name: "清除",
                    show: false
                },
                {
                    icon: "micro",
                    name: "静音",
                    state: "on",
                    show: true
                },
                {
                    icon: "camera",
                    name: "关闭摄像头",
                    state: "on",
                    show: true
                },
                {
                    icon: "invite",
                    name: "邀请",
                    show: true
                }
            ],
            // 房间参与人员列表
            // user_state 用户状态 0=>在线 1=>离线 2=>呼叫中 3=>未接听 4=>已拒绝
            roomUserList: [],
            // 当前大窗显示用户
            curUserID: "",
            // 备注信息
            remarkCon: "",
            // 直播持续时长
            roomStartTime: 0,
            // 本地userid
            localUserID: "",
            // appid
            sdkAppId: "",
            // 城市id
            cityId: "",
            // 用户签名
            userSig: "",
            // 屏幕分享uesrID 签名
            shareSig: "",
            // 屏幕分享uesrID
            shareUserID: "",
            // 屏幕共享 发布stream对象
            localStream3: null,
            // 远程共享集合
            remoteShareList: [],
            // 屏幕分享状态
            sharing: false,
            nowDateTime: 0,
            // 持续时长计算
            continueTimeFun: null,
            // 持续时长
            continueTime: "",
            // 挂断60秒判断
            hangupFlag: false,
            // 挂断60秒方法
            hangupFun: null,
            // 挂断时间设置 60秒
            hangupTime: 60,
            // 初始化是否未主持人
            isMaster: false,
            // 直播结束
            liveEnd: false,
            // 结束直播间 共计多少分钟
            totalMin: 0,
            // 轮询定时
            pollFun: null,
            // 邀请弹窗
            invitationShow: false,
            // 关闭直播间提示弹窗
            closeRoom: false,
            // 分享链接
            shareUrl: '',
            // 房间结束后再展示
            totalUser: -1,
            // 进入房间权限
            flag: true,
            // 连接状态
            curState: "",
            // 是否是房间所属咨询师
            room_creator: false,
            // 订单ID
            order_id: "",
            // 互动白板 实例对象
            TEduBoard: null,
            // IM 实例对象
            tim: null,
            // IM 配置信息
            timInfo: null,
            // IM 状态  0=>未初始化 1=>create完成，未ready 2=>已ready，未登录 3=>已登录，未进群 4=>已进群
            timStatus: "",
            // IM 群组ID
            classId: "",
            // 互动白板 实例化参数
            TEduBoard_options: {
                // 是否允许涂鸦
                drawEnable: false,
                // TEduBoardContentFitMode: "TEDU_BOARD_CONTENT_FIT_MODE_CENTER_COVER",
                // ratio: "16:9",
            },
            // 白板弹窗 显示/隐藏
            showBoard: false,
            // 白板内当前选择视频
            curSelectVideo: "",
            // 白板视频列表
            videoList: [],
            //当前用户状态
            STATUS_UNINIT: 0,
            STATUS_INITED: 1,
            status: 0,
            // 当前播放视频文件ID
            curBoardFid: ""
        }
    },
    beforeCreate() {
        // 判断生产环境非https 自动切换为https
        if (window.location.protocol != "https:" && process.env.NODE_ENV === "production") {
            window.location.protocol = "https:";
        }
    },
    created() {
        // 检测浏览器支持情况
        this.check();
    },
    mounted() {
        this.init();
        // 挂断60秒
        this.hangupFun = setInterval(() => {
            if (this.hangupTime > 0) {
                this.hangupTime--;
            } else {
                this.hangupFlag = true;
                clearInterval(this.hangupFun);
            }
        }, 1000);
        // 轮询上报
        this.pollFun = setInterval(() => {
            this.pollReported();
        }, 5000)
    },
    computed: {
        ...mapState('liveRoom', ['currentStep']),
        ...mapState(['trackCommon']),
        // 在线人数
        onlineUsers() {
            let online = 0;
            this.roomUserList.forEach(item => {
                if (item.user_state === 0 || item.user_state === 2) {
                    online++;
                }
            });
            return online;
        },
        // 当前用户
        curUser() {
            let obj = {};
            this.roomUserList.forEach(item => {
                if (item.user_id == this.curUserID) {
                    obj = item;
                }
            });
            return obj;
        },
        // 当前房间内用户 Map 对象
        roomUserMap() {
            let map = new Map();
            this.roomUserList.forEach(item => {
                map.set(item.user_id, item);
            });
            return map;
        },
        // 参与人数
        participate() {
            let i = 0;
            this.roomUserList.forEach(item => {
                if (item.user_state === 0 || item.user_state === 1) {
                    i++;
                }
            })
            return i;
        },
        // 按照 user_state 用户状态 0=>在线 1=>离线 2=>呼叫中 3=>未接听 4=>已拒绝 排序
        roomUserListSort() {
            let sortArr = this.roomUserList.sort((a, b) => {
                return a.user_state - b.user_state;
            });
            return [...new Set(sortArr)];
        }

    },
    methods: {
        // 关闭放大弹窗
        closeEnlarge() {
            this.streamShow = false;
            let obj = this.roomUserList.find(item => {
                return item.user_id === this.curUser.user_id;
            });
            if (obj) {
                obj.stream_list = this.localStream2;
                if (obj.stream_list && obj.stream_list.hasVideo()) {
                    if (this.localStream2) {
                        this.localStream2.stop();
                        this.localStream2 = null;
                    }
                    obj.stream_list.play('live-video-' + obj.user_id);
                }
                obj.isEnlarge = false;
            } else {
                // if (this.localStream2) {
                //     this.localStream2.stop();
                //     this.localStream2 = null;
                // }
            }
            console.warn(obj)
            // if (this.localStream2) {
            //     this.localStream2.stop();
            // }
        },
        /**
         * @description: 页面初始化
         */
        init() {
            this.roomId = this.$route.query.room_id;
            api.liveRoomInit({
                room_id: this.roomId
            }).then(res => {
                if (res.data.code === 0) {
                    this.localUserID = res.data.data.user_id;
                    if (res.data.data.room_status === 4) {
                        this.totalMin = res.data.data.video_time;
                        this.totalUser = res.data.data.user_count;
                        this.isMaster = true;
                        this.liveEnd = true;
                        this.clearInter();
                        return;
                    } else {
                        this.reportedAction(this.localUserID, "1").then(result => {
                            if (result.data.code === 1) {
                                this.$message.error(result.data.msg);
                                this.flag = false;
                                this.clearInter();
                                return;
                            }
                        })
                    }
                    this.timInfo = res.data.data.im_info ? res.data.data.im_info : null;
                    this.classId = res.data.data.im_info ? res.data.data.im_info.groupId : "";
                    this.order_id = res.data.data.order_id;
                    this.sdkAppId = res.data.data.appid;
                    this.userSig = res.data.data.userSign;
                    this.shareSig = res.data.data.shareUserSign;
                    this.shareUserID = res.data.data.share_user_id;
                    this.roomStartTime = res.data.data.room_create_datetime;
                    this.isMaster = res.data.data.master;
                    this.room_creator = res.data.data.room_creator;
                    this.shareUrl = res.data.data.share_url;
                    this.current_time = res.data.data.current_time;
                    this.cityId = res.data.data.city_ids.length ? res.data.data.city_ids.join(',') : '';
                    // 获取小程序二维码
                    this.$store.commit('liveRoom/set_mini_program_qrcode', res.data.data.mini_program_qrcode);
                    this.continueTimeFun = setInterval(() => {
                        let difValue = (this.current_time - this.roomStartTime) * 1000;
                        let base = difValue;
                        let hour = Math.floor(difValue / 1000 / 60 / 60); //小时
                        hour = (Array(2).join(0) + hour).slice(-2);
                        difValue = difValue % (1000 * 60 * 60);
                        let min = Math.floor(difValue / 1000 / 60); //分钟
                        min = (Array(2).join(0) + min).slice(-2);
                        difValue = difValue % (1000 * 60);
                        let second = Math.floor(difValue / 1000);
                        second = (Array(2).join(0) + second).slice(-2);
                        this.continueTime = hour + ":" + min + ":" + second;
                        let min2 = Math.floor(base / 1000 / 60); //分钟
                        this.totalMin = min2;
                        this.current_time++;
                    }, 1000)

                    this.localClient = TRTC.createClient({
                        mode: 'videoCall', // 实时通话模式
                        sdkAppId: res.data.data.appid,
                        userId: res.data.data.user_id,
                        userSig: res.data.data.userSign
                    });
                    this.listenRemoteStream();
                    this.joinRoom(this.roomId).then(() => {
                        let obj = {
                            name: this.localUserID,
                            tell: "",
                            micro_state: "on",
                            camera_state: "on",
                            user_state: 0,
                            user_img: "",
                            user_id: this.localUserID,
                            stream_list: null,
                            stream_share: null
                        }
                        if (res.data.data.white_board_user) {
                            this.boradUserId = res.data.data.white_board_user.user_id;
                            this.boardUserSig = res.data.data.white_board_user.userSign;
                        }
                        if (res.data.data.white_board) {
                            this.TEduBoard_options.classId = parseInt(res.data.data.white_board.classId);
                            this.TEduBoard_options.sdkAppId = parseInt(res.data.data.white_board.sdkAppId);
                            this.TEduBoard_options.userId = res.data.data.white_board.userId;
                            this.TEduBoard_options.userSig = res.data.data.white_board.userSig;
                            this.TEduBoard_options.id = "board-con";
                        }

                        // 用户进入后房间建立TIM实例
                        this.initTim();
                        // 上报进入房间动作
                        this.reportedAction(this.localUserID, "1");
                        res.data.data.user_list.forEach(item => {
                            if (item.user_id === this.localUserID) {
                                obj.user_img = item.avatar;
                                obj.name = item.user_name ? item.user_name : "";
                            }
                        })
                        this.roomUserList.push(obj);
                        this.updateUserList(res.data.data.user_list);
                        this.$nextTick(() => {
                            this.createLocalStream();
                        })
                    })
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        /**
         * @description: 初始化 IM
         * @return: 
         */
        initTim() {
            if (this.timInfo) {
                try {
                    this.tim = TIM.create({
                        SDKAppID: parseInt(this.timInfo.sdkAppid)
                    })
                    this.timStatus = 1;
                    this.initTimEvent();
                } catch (error) {
                    console.log(error);
                }

            }
        },
        /**
         * @description: 登录IM
         * @return: 
         */
        timLogin() {
            if (!this.classId || (this.timInfo && !this.timInfo.userId)) {
                this.$message.error("IM初始化失败，无法使用此功能，请刷新处理");
                return;
            }
            this.tim.login({
                userID: this.timInfo.userId,
                userSig: this.timInfo.userSign
            }).then(imResponse => {
                this.timStatus = 3;
                console.log("IM登录成功", imResponse.data); // 登录成功
                if (imResponse.data.repeatLogin === true) {
                    // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
                    console.log(imResponse.data.errorInfo);
                    this.$nextTick(() => {
                        this.initBoard();
                    })
                }

            }).catch(function (imError) {
                console.warn('login error:', imError); // 登录失败的相关信息
            });
        },
        /**
         * @description: 监听IM EVENT
         * @return: 
         */
        initTimEvent() {
            if (!this.tim) return;
            let onReady = () => {
                this.timStatus = 2;
                console.log("IM----------SDK进入 ready 状态");
                this.$nextTick(() => {
                    this.initBoard();
                })
            }
            this.tim.on(TIM.EVENT.SDK_READY, onReady);
            let notReady = () => {
                console.log("IM----------SDK没有进入 ready 状态，其他api无法使用");
            }
            this.tim.on(TIM.EVENT.SDK_NOT_READY, notReady);
            let onError = (event) => {
                console.error(event.data.code, event.data.message)
                // event.data.code - 错误码
                // event.data.message - 错误信息
            }
            this.tim.on(TIM.EVENT.ERROR, onError);
            let onReceived = (event) => {
                console.log("群组接收到消息", event)
                let messages = event.data;
                messages.forEach((message) => {
                    // 群组消息
                    if (message.conversationType === TIM.TYPES.CONV_GROUP) {
                        if (message.to === this.classId) { // 如果是当前群组
                            console.log("接收到消息为当前群组");
                            let elements = message.getElements();
                            if (elements.length) {
                                elements.forEach((element) => {
                                    if (element.type === 'TIMCustomElem') {
                                        console.log("接收到消息为自定义消息");
                                        if (element.content.extension === 'TXWhiteBoardExt') {
                                            console.log("接收到消息为互动白板消息");
                                            if (message.from != this.timInfo.userId) {
                                                console.log("互动白板同步消息由他人发出");
                                                this.TEduBoard.addSyncData(JSON.parse(element.content.data));
                                                console.log("互动白板处理接收到消息");
                                            }
                                        }
                                    }
                                });
                            }
                        } else {
                            // 其他群组消息忽略
                        }
                    }
                });
            }
            this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, onReceived)
        },
        /**
         * @description: 打开播放弹窗(仅主持人)
         * @return: 
         */
        openVideoDialog() {
            this.showBoard = true;
            this.isMaster = true;
            this.stopScreenShare();
            this.searhVideo();
        },
        /**
         * @description: 被动弹出播放视频弹窗（非主持人）
         * @return: 
         */
        openBoard() {
            this.isMaster = false;
            this.showBoard = true;
            this.timLogin();
        },
        /**
         * @description: 初始化白板
         * @return: 
         */
        initBoard() {
            if (!this.isMaster) {
                this.TEduBoard_options.dataSyncEnable = false;
            } else {
                this.TEduBoard_options.dataSyncEnable = true;
            }
            // 初始化白板前确保先加入群组
            this.tim.joinGroup({
                groupID: this.classId,
                type: TIM.TYPES.GRP_PUBLIC
            }).then(imResponse => {
                switch (imResponse.data.status) {
                    case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
                        break;
                    case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
                        this.timStatus = 4;
                        this.TEduBoard = new TEduBoard(this.TEduBoard_options);
                        this.initBoardEvent();
                        console.log("加入群组成功", imResponse.data.group); // 加入的群组资料
                        break;
                    case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
                        this.timStatus = 4;
                        console.log("已经在群中")
                        this.TEduBoard = new TEduBoard(this.TEduBoard_options);
                        this.initBoardEvent();
                        break;
                    default:
                        break;
                }
            }).catch(function (imError) {
                console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
            });
        },
        /**
         * @description: 白板弹窗内搜索视频列表
         * @param {string} query 搜索内容 
         * @return: 
         */
        searhVideo(query) {
            api.getVideoList({
                room_id: this.roomId,
                q: query
            }).then(res => {
                if (res.data.code === 0) {
                    this.videoList = res.data.data.list;
                }
            })
        },
        /**
         * @description: 点击视频列表下拉(主持人权限)
         * @param {string} item 选中项value
         * @return: 
         */
        handleSelectVideo(item) {
            if (item) {
                if (this.TEduBoard) {
                    // 已经初始化
                    if (this.status === this.STATUS_INITED) {                      
                        this.TEduBoard.deleteFile();
                        this.TEduBoard.addVideoFile(item);
                    }
                } else {
                    this.timLogin();
                }
            }

        },
        /**
         * @description: 关闭视频弹窗
         * @return: 
         */
        finishVideo() {
            this.showBoard = false;
            this.curSelectVideo = "";
            if (this.boradClient) {
                this.boradClient.unpublish(this.boardStream).then(() => {
                    this.boradClient.leave();
                    this.boardStream = null;
                    this.boradClient = null;
                    console.log("互动client用户离开房间");
                });

            }
            if (this.TEduBoard) {
                this.TEduBoard.pauseVideo();
                this.TEduBoard.reset();
                setTimeout(() => {
                    this.TEduBoard.destroy();
                    this.TEduBoard = null
                }, 200)
            }
            this.startScreenShare();
            // this.showBoard = false;
        },
        /**
         * @description: 关闭视频播放弹窗
         * @return: 
         */
        closeBoard() {
            this.showBoard = false;
            if (this.TEduBoard) {
                setTimeout(() => {
                    this.TEduBoard.destroy();
                    this.TEduBoard = null
                }, 200)
            }
        },
        /**
         * @description: 监听白板事件
         * @return: 
         */
        initBoardEvent() {
            let teduBoard = this.TEduBoard;
            // 白板错误回调
            teduBoard.on(TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
                console.error('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
            });
            // 白板警告回调
            teduBoard.on(TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
                console.warn('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
            });
            // 白板初始化回调
            teduBoard.on(TEduBoard.EVENT.TEB_INIT, () => {
                console.log('======================:  ', 'TEB_INIT');
                this.status = this.STATUS_INITED;
            });
            // 同步历史数据完成回调
            teduBoard.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
                console.log('======================:  ', 'TEB_HISTROYDATA_SYNCCOMPLETED');
                if (this.isMaster) {
                    this.TEduBoard.addVideoFile(this.curSelectVideo);
                    this.TEduBoard.showVideoControl(true);
                    this.TEduBoard.setSyncVideoStatusEnable(true);
                    // this.TEduBoard.startSyncVideoStatus();

                    this.boardStream = TRTC.createStream({
                        audio: true, // 采集麦克风
                        video: false, // 采集摄像头
                        userId: this.boradUserId
                    })
                    this.boardStream.initialize().then(() => {
                        this.boradClient = TRTC.createClient({
                            mode: 'videoCall',
                            sdkAppId: this.sdkAppId,
                            userId: this.boradUserId,
                            userSig: this.boardUserSig
                        })
                        this.boradClient.setDefaultMuteRemoteStreams(true);

                        this.boradClient.join({
                            roomId: this.roomId
                        }).then(() => {
                            this.boradClient.publish(this.boardStream).then(() => {
                                this.boardStream.muteAudio();
                                // 本地流发布成功
                                console.log("白板流发布成功")
                                if (this.TEduBoard) {
                                    let curBoard = this.TEduBoard.getCurrentBoard();
                                    this.TEduBoard.gotoBoard(curBoard);
                                }
                            });
                            console.log("互动白板client进入房间");
                        })
                    })

                } else {
                    this.TEduBoard.showVideoControl(false);
                    this.TEduBoard.setSyncVideoStatusEnable(false);
                }
            });
            // 新增白板
            teduBoard.on(TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
                console.log('======================:  ', 'TEB_ADDBOARD', 'boardIds:', boardIds, ' fid:', fid);
            });
            // 视频状态变更
            teduBoard.on(TEduBoard.EVENT.TEB_VIDEO_STATUS_CHANGED, (videoStatus) => {
                console.log('======================:  ', 'TEB_VIDEO_STATUS_CHANGED', 'videoStatus:', videoStatus);
                if (videoStatus.status >= 3 && this.isMaster && videoStatus.fileId != this.curBoardFid) {
                    this.curBoardFid = videoStatus.fileId;
                    this.TEduBoard.startSyncVideoStatus();
                }
                if (videoStatus.status === 3 && this.isMaster) {
                    this.TEduBoard.board.videoPlayer.volume(0.1);
                }
            });
            // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
            teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
                console.log('======================:  ', 'TEB_SYNCDATA');
                let message = this.tim.createCustomMessage({
                    to: this.classId,
                    conversationType: TIM.TYPES.CONV_GROUP,
                    payload: {
                        data: JSON.stringify(data),
                        description: '',
                        extension: 'TXWhiteBoardExt'
                    }
                })
                console.log("要发送的消息", message)
                this.tim.sendMessage(message, {
                    onlineUserOnly: true,
                    offlinePushInfo: {
                        disablePush: true
                    }
                }).then(() => {
                    // 同步成功
                    console.log("同步成功", data)
                }, () => {
                    // 同步失败
                    console.log("同步失败", data)
                });

            });
        },
        /**
         * @description: 停止屏幕共享
         * @return: 
         */
        stopScreenShare() {
            if (this.remoteShareList.length) {
                this.remoteShareList.forEach(item => {
                    api.removerUser({
                        room_id: this.roomId,
                        user_id: "share_" + item
                    }).then(res => {
                        if (res.data.code === 0) {
                            if (item == this.localUserID && this.localStream3) {
                                this.localStream3.close();
                                this.shareClient = null;
                                this.localStream3 = null
                            }
                        }
                    })
                })

            }
        },
        /**
         * @description: 轮询上报用户在线信息 5s
         * @param {type} 
         * @return: 
         */
        pollReported() {
            let onlineList = [];
            this.roomUserList.forEach(item => {
                if (item.user_state === 0) {
                    onlineList.push(item.user_id);
                }
            })
            let shareList = this.remoteShareList.map(item => {
                return "share_" + item;
            });
            onlineList = onlineList.concat(shareList);
            api.getUserInfo({
                room_id: this.roomId,
                user_id: [],
                user_list: onlineList
            }).then(res => {
                if (res && res.data && res.data.code === 0) {
                    this.updateUserList(res.data.data)
                }
            });
            this.updateMutedState()
        },
        /**
         * @description: 刷新页面
         * @param {type} 
         * @return: 
         */
        reload() {
            window.location.reload();
        },
        /**
         * @description: 进入房间
         * @param {number} roomid 房间ID
         * @return: Promise
         */
        joinRoom(roomid) {
            if (!this.localClient) return;
            return this.localClient.join({
                roomId: roomid
            })
        },
        /**
         * @description: 用户状态 状态码转文字描述
         * @param {number} code 状态码
         * @return {string} 状态文字描述: 
         */
        userState(code) {
            switch (code) {
                case 0:
                    return "在线";
                    break;
                case 1:
                    return "已离线";
                    break;
                case 2:
                    return "呼叫中";
                    break;
                case 3:
                    return "未接听";
                    break;
                case 4:
                    return "已拒绝";
                    break;
                default:
                    return "未知"
                    break;
            }
        },
        /**
         * @description: 根据userID判断角色
         * @param {string} 
         * @return: "zxs" or "kh"
         */
        judgeRole(userID) {
            if (!userID) return;
            let r = userID.split("_")[0];
            if (r === "employee") {
                return "zxs"
            } else {
                return "kh"
            }
        },
        /**
         * @description: 切换当前用户
         * @param {objetc} 用户对象
         */
        switchUser(user) {
            this.curUserID = user.user_id;
            // 如果是共享屏幕流，则不需要放大
            if (!user.stream_share) {
                // 打开放大流弹窗
                this.streamShow = true;
                // 小窗口修改为展示头像
                user.isEnlarge = true;
                this.$nextTick(() => {
                    console.warn(user)
                    if (user.stream_list && user.stream_list.hasVideo()) {
                        if (this.localStream2) {
                            this.localStream2.stop();
                            this.localStream2 = null;
                        }
                        this.localStream2 = user.stream_list;
                        user.stream_list.stop();
                        this.localStream2.play('live-video');
                        // this.localStream2 = null;
                        // this.localStream2 = TRTC.createStream({
                        //     audio: false, // 采集麦克风
                        //     video: true, // 采集摄像头
                        //     userId: this.localUserID
                        // });
                        // this.localStream2.setVideoProfile({
                        //     width: user.stream_list.getVideoTrack().getSettings().width,
                        //     height: user.stream_list.getVideoTrack().getSettings().height,
                        //     frameRate: 30,
                        //     bitrate: 1000
                        // });
                        // this.localStream2.initialize().then(() => {
                        //     this.localStream2.replaceTrack(videoTrack).then(() => {
                        //         // 切换分辨率后尝试播放
                        //         this.localStream2.play('live-video');
                        //     }).catch(error => {
                        //         console.log(error);
                        //     })
                        // }).catch(error => {
                        //     console.log(error);
                        // })
                    } else {
                        // this.localStream2 = user.stream_list;
                    }
                });
            }
        },
        /**
         * @description: 更新用户列表信息
         * @param {type} 
         * @return: 
         */
        updateUserList(userList) {
            if (!Object.keys(userList).length) return;
            userList.forEach(item => {
                let flag = true;
                this.roomUserList.forEach(i => {
                    if (i.user_id === item.user_id) {
                        if (i.user_state != 0) {
                            // 存在此用户，且用户当前状态不是在线,更新状态（可能是呼叫中、未接听、已拒绝）
                            i.user_state = item.status - 1;
                        }
                        flag = false;
                    }
                });
                if (flag && item.status != 1) {
                    if (this.roomUserMap.has(item.user_id)) {
                        return;
                    }
                    this.roomUserList.push({
                        name: item.user_name ? item.user_name : "",
                        tell: this.judgeRole(item.user_id) != "zxs" ? (item.mobile ? item.mobile : "") : "",
                        micro_state: "off",
                        camera_state: "off",
                        user_state: item.status - 1,
                        user_img: item.avatar,
                        user_id: item.user_id,
                        stream_list: null,
                        stream_share: null
                    })
                }
                // 将用户列表保存到vuex中
                this.$store.commit('liveRoom/set_room_list', this.roomUserList);
            })
        },
        /**
         * @description: 操作栏按钮方法集合
         * @param {object} iconObj 按钮对象
         */
        handleOperat(iconObj) {
            if (!this.localStream) {
                return;
            }
            // 埋点
            let obj = {
                order_id: this.order_id,
                tag_type: this.currentStep.materials_type,
                tab_id: "",
                adviser_id: this.trackCommon.info.login_employee_id
            };
            switch (iconObj.icon) {
                // 开启屏幕共享/新的共享操作
                case "screen-share":
                    obj.tab_id = "1";
                    if (iconObj.active === "off") {
                        this.startScreenShare();
                    } else {
                        if (this.sharing) {
                            if (this.localStream3) {
                                // 在已经有共享流的情况下，再次发起共享，需要先把之前的共享用户退出，再进入，否则小程序端会出现黑屏的问题
                                this.localStream3.close();
                                this.roomUserList.forEach(item => {
                                    if (item.user_id === this.localUserID) {
                                        item.stream_share = null;
                                    }
                                });
                                this.remoteShareList.forEach((item, index) => {
                                    if (item === this.localUserID) {
                                        this.remoteShareList.splice(index, 1);
                                    }
                                });
                                this.shareClient.leave();
                                this.sharing = false;
                                this.startScreenShare();
                            }
                        } else {
                            this.startScreenShare();
                        }
                        // iconObj.active = "off";
                        // iconObj.name = "屏幕共享";
                    }
                    break;
                    // 打开画板
                case "open-draw":
                    obj.tab_id = "2";
                    window.open("https://witeboard.com/", "_blank");
                    break;
                    // 标记
                case "sign":
                    obj.tab_id = "3";
                    if (this.sharing) {
                        // console.log(this.localStream3.getVideoFrame());
                    } else {
                        this.$message("请打开屏幕共享");
                    }
                    break;
                    // 清除标记
                case "sign-clear":
                    obj.tab_id = "4";
                    break;
                    // 打开/关闭麦克风
                case "micro":
                    obj.tab_id = "5";
                    if (iconObj.state === "on") {
                        iconObj.state = "off";
                        iconObj.name = "取消静音";
                        this.roomUserList.forEach(item => {
                            if (item.user_id === this.localUserID) {
                                item.micro_state = "off";
                            }
                        });
                        this.localStream.muteAudio();
                    } else {
                        iconObj.state = "on";
                        iconObj.name = "静音";
                        this.roomUserList.forEach(item => {
                            if (item.user_id === this.localUserID) {
                                item.micro_state = "on";
                            }
                        });
                        if (this.removeAudioFlag) {
                            // 新建一个音频流
                            const localAudioStream = TRTC.createStream({ audio: true, video: false });
                            localAudioStream.initialize().then(() => {
                                console.warn('local audio stream init success');
                                this.localStream.replaceTrack(localAudioStream.getAudioTrack()).then(() => {
                                    console.log('add audio call success');
                                });
                                this.removeAudioFlag = false;
                            });
                        } else {
                            this.localStream.unmuteAudio();
                        }
                    }
                    break;
                    // 打开/关闭摄像头
                case "camera":
                    obj.tab_id = "6";
                    if (iconObj.state === "on") {
                        iconObj.state = "off";
                        iconObj.name = "开启摄像头"
                        this.roomUserList.forEach(item => {
                            if (item.user_id === this.localUserID) {
                                item.camera_state = "off";
                            }
                        });
                        this.localStream.muteVideo();
                    } else {
                        iconObj.state = "on";
                        iconObj.name = "关闭摄像头";
                        let nowItem = null;
                        this.roomUserList.forEach(item => {
                            if (item.user_id === this.localUserID) {
                                item.camera_state = "on";
                                nowItem = item;
                            }
                        });
                        this.localStream.unmuteVideo();
                        // 判断如果是放大之前没有视频流，放大之后再打开视频流，需要手动play一下
                        setTimeout(() => {
                            if (nowItem && nowItem.isEnlarge && nowItem.stream_list && nowItem.stream_list.hasVideo()) {
                                nowItem.stream_list.stop();
                                this.localStream2.play('live-video');
                            }
                        })
                    }
                    break;
                    // 邀请按钮
                case "invite":
                    obj.tab_id = "7";
                    if (this.onlineUsers >= 9) {
                        this.$message.error("房间在线人数最大9人");
                        this.invitationShow = false;
                    } else {
                        this.invitationShow = true;
                    }
                    break;
                default:
                    console.log("操作错误");
                    break;
            }
            commonFun.setTrackNew("7202", obj);
        },
        /**
         * @description: 浏览器是否支持判断
         * @param {type} 
         * @return: 
         */
        check() {
            TRTC.checkSystemRequirements().then((result) => {
                if (!result) {
                    this.$message.error("您的浏览器不支持视频直播间");
                }
            });
        },
        // 检查音频设备
        checkAudio() {
            let p = new Promise((resolve, reject) => {
                navigator.mediaDevices.getUserMedia({
                    audio: true
                }).then(() => {
                    resolve(true);
                }).catch(error => {
                    console.log(error);
                    reject(new Error('audio'));
                });
            });
            return p;
        },
        // 检查视频设备
        checkVideo() {
            let p = new Promise((resolve, reject) => {
                navigator.mediaDevices.getUserMedia({
                    video: true
                }).then(() => {
                    resolve(true);
                }).catch(error => {
                    console.log(error);
                    reject(new Error('video'));
                });
            });
            return p;
        },
        /**
         * @description: 封装采集本地音视频方法
         * @param {Boolean} audioFlag 采集音频
         * @param {Boolean} videoFlag 采集视频
         */
        async createLocalStreamMethod(audioFlag, videoFlag) {
            try {
                // 如果设备是正常的，直接默认打开摄像头和麦克风
                this.localStream = TRTC.createStream({
                    audio: audioFlag, // 采集麦克风
                    video: videoFlag, // 采集摄像头
                    userId: this.localUserID
                });
                // 监听本地流的变化--拔出耳机会出现audio is stopped
                this.localStream.on('player-state-changed', event => {
                    if (event.type === 'audio' && event.state === 'STOPPED') {
                        // 移除音频--拔掉耳机
                        this.removeAudioFlag = true;
                        // 本地流操作icon修改为静音
                        let obj = this.operatBarList.find(item => {
                            return item.icon === 'micro'
                        });
                        if (obj.state === 'on') {
                            obj.state = "off";
                            obj.name = "取消静音";
                            this.roomUserList.forEach(item => {
                                if (item.user_id === this.localUserID) {
                                    item.micro_state = "off";
                                }
                            });
                            // 提示已经静音
                            this.$message({
                                message: '当前处于静音状态',
                                type: 'warning'
                            });
                        }
                    }
                });
                await this.localStream.initialize();
                // let videoTrack = this.localStream.getVideoTrack();
                this.localClient.publish(this.localStream).then(() => {
                    // 本地流发布成功
                    console.log("本地流发布成功")
                });
                this.localStream.play('live-video-' + this.localUserID).then(() => {
                    // 房间所属咨询师自动打开屏幕共享
                    if (this.room_creator && !this.sharing) {
                        this.startScreenShare();
                    }
                }).catch(error => {
                    console.log(error)
                });
                this.roomUserList.forEach(item => {
                    if (item.user_id === this.localUserID) {
                        item.stream_list = this.localStream;
                    }
                });
            } catch (error) {
                console.warn("采集本地音视频流失败", error.name);
                // 本地流初始化失败
                switch (error.name) {
                    case 'NotFoundError':
                        this.$message.error("没有找到可用摄像头/麦克风");
                        break;
                    case 'NotAllowedError':
                        this.$message.error("请授权摄像头/麦克风访问权限，否则无法进行音视频通话");
                        break;
                    case 'NotReadableError':
                        this.$message.error("暂时无法访问摄像头/麦克风，请确保当前没有其他应用请求访问摄像头/麦克风，并重试。");
                        break;
                    case 'AbortError':
                        this.$message.error("由于某些未知原因导致设备无法被使用");
                        break;
                    default:
                        console.error(error);
                        break;
                }
            }
        },
        /**
         * @description: 采集本地音视频
         * @param {type} 
         * @return: 
         */
        async createLocalStream() {
            // 检查设备
            let audioFlag = '-1';
            let videoFlag = '-1';
            let list = await navigator.mediaDevices.enumerateDevices();
            if (list.length > 0) {
                try {
                    await this.checkAudio();
                    audioFlag = 'canUse';
                } catch (error) {
                    console.log(error);
                    audioFlag = 'noUse';
                }
                try {
                    await this.checkVideo();
                    videoFlag = 'canUse';
                } catch (error) {
                    console.log(error);
                    videoFlag = 'noUse';
                }
                console.warn(audioFlag, videoFlag)
                if (audioFlag === '-1' && videoFlag === '-1') {
                    // 一直pending
                    this.$message.error("请授权摄像头/麦克风访问权限，否则无法进行音视频通话");
                } else if (videoFlag === 'canUse' || audioFlag === 'canUse') {
                    let auFlag = (audioFlag === 'canUse');
                    let viFlag = (videoFlag === 'canUse');
                    this.createLocalStreamMethod(auFlag, viFlag);
                } else {
                    this.$message.error("没有找到可用摄像头/麦克风");
                }
            } else {
                this.$message.error("没有找到可用摄像头/麦克风");
            }
        },
        /**
         * @description: 监听远端流加入
         * @param {type} 
         * @return: 
         */
        listenRemoteStream() {
            this.localClient.on('stream-added', event => {
                let remoteStream = event.stream;
                let remoteUserId = remoteStream.getUserId();
                // 本地发布的远端流 不再订阅
                if (remoteUserId.indexOf(this.localUserID) > -1) return;
                this.localClient.subscribe(remoteStream);
                console.log("远端流加入-------" + remoteUserId)
                let nowItem = null;
                this.roomUserList.forEach(item => {
                    if (remoteUserId === item.user_id) {
                        item.camera_state = "on";
                        nowItem = item;
                    }
                })
                // 判断当前打开摄像头是否是已经放大的状态，如果是需要手动play一下
                setTimeout(() => {
                    if (nowItem && nowItem.isEnlarge && nowItem.stream_list && nowItem.stream_list.hasVideo()) {
                        if (this.localStream2) {
                            this.localStream2.stop();
                            this.localStream2 = null;
                        }
                        this.localStream2 = nowItem.stream_list;
                        nowItem.stream_list.stop();
                        this.localStream2.play('live-video');
                    }
                });
            })
            this.localClient.on('stream-updated', event => {
                let remoteStream = event.stream;
                let remoteUserId = remoteStream.getUserId();
                // if (remoteUserId === this.curUserID && remoteStream.getMediaStream().getVideoTracks().length) {
                //     this.switchUser(this.curUser);
                // }
                console.log("远端流更新-------" + remoteUserId);
            });
            this.localClient.on('stream-subscribed', event => {
                let remoteStream = event.stream;
                let remoteUserId = remoteStream.getUserId();
                if (remoteUserId.indexOf("board") > -1) return;
                this.handleRemote(remoteUserId, remoteStream);
                console.log("远端流已订阅-------" + remoteUserId)
            });
            this.localClient.on('mute-audio', event => {
                let userId = event.userId;
                this.roomUserList.forEach(item => {
                    if (userId === item.user_id) {
                        item.micro_state = "off";
                    }
                })
            });
            this.localClient.on('unmute-audio', event => {
                let userId = event.userId;
                this.roomUserList.forEach(item => {
                    if (userId === item.user_id) {
                        item.micro_state = "on";
                    }
                })
            });
            this.localClient.on('mute-video', event => {
                let userId = event.userId;
                this.roomUserList.forEach(item => {
                    if (userId === item.user_id) {
                        item.camera_state = "off";
                    }
                })
            });
            this.localClient.on('unmute-video', event => {
                let userId = event.userId;
                let nowItem = null;
                this.roomUserList.forEach(item => {
                    if (userId === item.user_id) {
                        item.camera_state = "on";
                        nowItem = item;
                    }
                })
                // 判断当前打开摄像头是否是已经放大的状态，如果是需要手动play一下
                setTimeout(() => {
                    if (nowItem && nowItem.isEnlarge && nowItem.stream_list && nowItem.stream_list.hasVideo()) {
                        if (this.localStream2) {
                            this.localStream2.stop();
                            this.localStream2 = null;
                        }
                        this.localStream2 = nowItem.stream_list;
                        nowItem.stream_list.stop();
                        this.localStream2.play('live-video');
                    }
                });
            });
            this.localClient.on('stream-removed', event => {
                let remoteStream = event.stream;
                let remoteUserId = remoteStream.getUserId();
                if (remoteUserId.indexOf("share") > -1) return;
                this.roomUserList.forEach(item => {
                    if (item.user_id === remoteUserId) {
                        item.user_state = 1;
                        item.camera_state = "off";
                        item.micro_state = "off";
                        item.stream_list = null;
                        item.stream_share = null;
                    }
                });
            });
            this.localClient.on('connection-state-changed', event => {
                const prevState = event.prevState;
                const curState = event.state;
                switch (curState) {
                    case "DISCONNECTED":
                        this.curState = "连接断开";
                        this.$message.error("连接断开")
                        break;
                    case "CONNECTING":
                        this.curState = "正在连接中";
                        this.$message("正在连接中");
                        break;
                    case "RECONNECTING":
                        this.curState = "自动重连中";
                        this.$message("自动重连中");
                        break;
                    case "CONNECTED":
                        this.curState = "已连接";
                        this.$message({
                            message: '已连接',
                            type: 'success'
                        })
                        break;
                    default:
                        break;
                }
                console.log(prevState, curState)

            });
            this.localClient.on('error', error => {
                const errorCode = error.getCode();
                // 请根据错误码列表(https://cloud.tencent.com/document/product/647/34342)查看错误类型。
                console.error("客户端异常。错误码：" + errorCode);
                this.localClient.leave();
                if (this.shareClient) {
                    this.shareClient.leave();
                }
                this.$confirm('已离开直播间，是否刷新页面重新加入该直播间?', '客户端异常', {
                    confirmButtonText: '刷新',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.reload();
                }).catch(() => {
                    this.$message("客户端异常会影响部分直播间功能");
                });
            });
            this.localClient.on('peer-join', event => {
                const userId = event.userId;
                if (!userId) return;
                console.log("peer-join---------" + userId);
                if (userId && userId.indexOf("board") > -1) {
                    if (!this.boradClient) {
                        this.openBoard();
                    }
                    return;
                }
                this.reportedAction(userId, "1");
                let name = ""
                if (this.roomUserMap.has(userId)) {
                    this.roomUserList.forEach(item => {
                        if (item.user_id === userId) {
                            name = item.name ? item.name : item.tell;
                        }
                    })
                } else {
                    // 获取用户信息
                    api.getUserInfo({
                        room_id: this.roomId,
                        user_id: [userId]
                    }).then(res => {
                        if (res.data.code === 0) {
                            if (Object.keys(res.data.data).length) {
                                name = res.data.data[0].user_name ? res.data.data[0].user_name : res.data.data[0].mobile;
                            }
                        }
                    })
                }
                if (name) {
                    this.$message(name + "进入房间");
                }
            });
            this.localClient.on('peer-leave', event => {
                const userId = event.userId;
                console.log("peer-leave---------" + userId);
                if (userId.indexOf("board") > -1) {
                    if (!this.boradClient) {
                        this.closeBoard();
                    }
                    return;
                }
                let isShare = false;
                this.reportedAction(userId, "2");
                // 是否开启屏幕共享
                if (userId.indexOf("share") > -1) {
                    // userID = userID.split("share_")[1];
                    isShare = true;
                }
                if (isShare) {
                    let _userId = userId.split("share_")[1];
                    if (_userId != this.localUserID) {
                        this.roomUserList.forEach(item => {
                            if (item.user_id === _userId) {
                                if (item.stream_share) {
                                    item.stream_share.stop();
                                    item.stream_share = null;
                                }
                            }
                        });
                    }
                    this.remoteShareList.forEach((item, index) => {
                        if (item === _userId) {
                            this.remoteShareList.splice(index, 1);
                        }
                    });
                }
                let name = ""
                if (this.roomUserMap.has(userId)) {
                    this.roomUserList.forEach(item => {
                        if (item.user_id === userId) {
                            name = item.name ? item.name : item.tell;
                            item.user_state = 1;
                            if (item.stream_list) {
                                item.stream_list.stop();
                                item.stream_list = null;
                            }
                        }
                    })
                } else {
                    // 获取用户信息
                    api.getUserInfo({
                        room_id: this.roomId,
                        user_id: [userId]
                    }).then(res => {
                        if (res.data.code === 0) {
                            if (Object.keys(res.data.data).length) {
                                name = res.data.data[0].user_name ? res.data.data[0].user_name : res.data.data[0].mobile;
                            }
                        }
                    })
                }
                if (name) {
                    this.$message(name + "离开房间");
                }
            });
            this.localClient.on('client-banned', error => {
                console.info("房间被解散");
                this.$message.error("房间被解散");
                if (this.$refs["dialog"]) {
                    this.$refs["dialog"].closeRoom = false;
                }
                this.invitationShow = false;
                this.clearInter();
                this.liveEnd = true;
                this.isMaster = true;
                this.localClient.unpublish(this.localStream).then(() => {
                    this.closeCamera()
                }).catch((error) => {
                    console.log(error);
                })
            });

        },
        /**
         * @description: 加入房间处理
         * @param {string} userID 用户ID 
         * @return: 
         */
        handleRemote(userID, stream) {
            // 用户列表是否包含
            let has = false;
            let isShare = false;
            let hasItem = null;
            let remoteMutedState = this.localClient.getRemoteMutedState();

            // 是否开启屏幕共享
            if (userID.indexOf("share") > -1) {
                userID = userID.split("share_")[1];
                isShare = true;
            }

            this.roomUserList.forEach(item => {
                if (item.user_id === userID) {
                    has = true;
                    hasItem = item;
                }
            })
            let obj = {
                name: userID,
                tell: "",
                micro_state: "on",
                camera_state: "on",
                user_state: 0,
                user_img: "",
                user_id: userID,
                stream_list: null,
                stream_share: null
            }
            if (!has) {
                if (isShare) {
                    obj.stream_share = stream;
                } else {
                    obj.stream_list = stream;
                }
                remoteMutedState.forEach(item => {
                    if (item.userId === userID) {
                        obj.camera_state = item.videoMuted ? "off" : "on";
                        obj.micro_state = item.audioMuted ? "off" : "on";
                    }
                })
                // 获取用户信息
                api.getUserInfo({
                    room_id: this.roomId,
                    user_id: [userID]
                }).then(res => {
                    if (res.data.code === 0) {
                        if (Object.keys(res.data.data).length) {
                            obj.name = res.data.data[0].user_name ? res.data.data[0].user_name : "";
                            obj.tell = this.judgeRole(res.data.data[0].user_id) != "zxs" ? res.data.data[0].mobile : "";
                        }
                    }
                    // 因为异步的问题，会出现共享流和主流分别进入的时候，list里面还没push进去，导致共享流和主流分成了两个item展示，所以这个地方需要再次判断一下是否可以push
                    let hasMain = this.roomUserList.findIndex((item) => {
                        return item.user_id === userID;
                    });
                    if (isShare) {
                        // 当前是共享流，需要找一下是否已经有主流在list中
                        if (hasMain !== -1) {
                            this.roomUserList[hasMain].stream_share = stream;
                        } else {
                            this.roomUserList.push(obj);
                            this.$nextTick(() => {
                                this.remoteShareList.push(userID);
                            });
                        }
                    } else {
                        // 当前是主流，需要找一下是否已经有对应的共享流在list中
                        if (hasMain !== -1) {
                            this.roomUserList[hasMain].stream_list = stream;
                        } else {
                            this.roomUserList.push(obj);
                        }
                    }
                    this.$nextTick(() => {
                        // this.createLocalStream();
                        if (isShare) {
                            this.remoteShareList.push(userID);
                            this.$nextTick(() => {
                                if (userID === this.localUserID) {
                                    this.sharing = true;
                                    this.localStream3.play("live-share-" + userID);
                                } else {
                                    stream.play("live-share-" + userID);
                                    this.$message(obj.name + "正在进行屏幕共享");
                                }
                            })
                        } else {
                            stream.play("live-video-" + userID).then(() => {
                                // if (userID === this.curUserID) {
                                //     this.switchUser(this.curUser);
                                // }
                            }).catch(error => {
                                console.log(error)
                            })

                        }
                    })
                })
            } else {
                hasItem.user_state = 0;
                if (isShare) {
                    if (hasItem.stream_share) {
                        hasItem.stream_share.stop();
                        hasItem.stream_share = null;
                    }
                    hasItem.stream_share = stream;
                } else {
                    if (hasItem.stream_list) {
                        hasItem.stream_list.stop();
                        hasItem.stream_list = null;
                    }
                    hasItem.stream_list = stream;
                }
                remoteMutedState.forEach(item => {
                    if (item.userId === userID) {
                        hasItem.camera_state = item.videoMuted ? "off" : "on";
                        hasItem.micro_state = item.audioMuted ? "off" : "on";
                    }
                });
                this.$nextTick(() => {
                    // this.createLocalStream();
                    if (isShare) {
                        this.remoteShareList.push(userID);
                        this.$nextTick(() => {
                            if (userID === this.localUserID) {
                                this.sharing = true;
                                this.localStream3.play("live-share-" + userID)
                            } else {
                                stream.play("live-share-" + userID);
                                this.$message(hasItem.name + "正在进行屏幕共享");
                            }
                        })
                    } else {
                        let videoDom = document.getElementById("live-video-" + userID);
                        if (videoDom && videoDom.hasChildNodes()) {
                            while (videoDom.hasChildNodes()) {
                                videoDom.removeChild(videoDom.firstChild);
                            }
                        }
                        stream.play("live-video-" + userID).then(() => {
                            // if (userID === this.curUserID) {
                            //     this.switchUser(this.curUser);
                            // }
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                })
            }

            this.reportedAction(this.localUserID, "1");
        },
        /**
         * @description: 上报进入事件
         * @param {string} uesrID 用户ID
         * @param {string} action 行为 1 进入 2 离开
         * @return: 
         */
        reportedAction(uesrID, _action) {
            // 上报进入房间动作
            return api.checkUser({
                room_id: this.roomId,
                user_id: uesrID,
                action: _action
            })
        },
        /**
         * @description: 更新远端流 摄像头/静态 状态
         */
        updateMutedState() {
            if (!this.localClient) return;
            let remoteMutedState = this.localClient.getRemoteMutedState();
            remoteMutedState.forEach(item => {
                this.roomUserList.forEach(user => {
                    if (item.userId === user.user_id) {
                        if (user.stream_list) {
                            if (user.stream_list.getMediaStream().getVideoTracks().length) {
                                user.camera_state = item.videoMuted ? "off" : "on";
                            } else {
                                user.camera_state = "off";
                            }

                        } else {
                            user.camera_state = "off";
                        }
                        user.micro_state = item.audioMuted ? "off" : "on";
                    }
                })

            })
        },
        /**
         * @description: 打开屏幕分享
         * @param {type} 
         * @return: 
         */
        startScreenShare() {
            if (navigator.userAgent.indexOf('Chrome') == -1) {
                this.$message.error("您的浏览器不支持屏幕分享功能，请使用谷歌浏览器 Chrome72 以上版本！");
                return
            }
            if (!TRTC.isScreenShareSupported() || navigator.userAgent.indexOf('Chrome') == -1) {
                this.$message.error("您的浏览器版本不支持屏幕分享功能，请使用谷歌浏览器 Chrome72 以上版本！");
                return;
            }

            try {
                // 创建屏幕分享流
                this.localStream3 = TRTC.createStream({
                    audio: false,
                    screen: true,
                    userId: this.localUserID
                });
                this.localStream3.initialize().then(() => {
                    this.shareClient = TRTC.createClient({
                        mode: 'videoCall',
                        sdkAppId: this.sdkAppId,
                        userId: this.shareUserID,
                        userSig: this.shareSig
                    })
                    this.shareClient.setDefaultMuteRemoteStreams(true);
                    this.shareClient.join({
                        roomId: this.roomId
                    }).then(() => {
                        // screencast stream init success
                        this.shareClient.publish(this.localStream3).then(() => {
                            this.remoteShareList.push(this.localUserID);
                            this.$nextTick(() => {
                                this.localStream3.play("live-share-" + this.localUserID).then(() => {
                                    this.roomUserList.forEach(item => {
                                        if (item.user_id === this.localUserID) {
                                            item.stream_share = this.localStream3;
                                            // if (this.curUserID === this.localUserID) {
                                            //     this.switchUser(this.curUser);
                                            // }
                                        }
                                    })
                                    this.sharing = true;
                                }).catch(error => {
                                    console.log(error);
                                });
                            })
                        });
                        this.localStream3.on('screen-sharing-stopped', event => {
                            this.sharing = false;
                            // this.operatBarList[0].name = "屏幕共享";
                            // this.operatBarList[0].active = "off";
                            this.localStream3.stop();
                            this.roomUserList.forEach(item => {
                                if (item.user_id === this.localUserID) {
                                    item.stream_share = null;

                                }
                            });

                            this.remoteShareList.forEach((item, index) => {
                                if (item === this.localUserID) {
                                    this.remoteShareList.splice(index, 1);
                                }
                            });
                            this.shareClient.leave();
                        });
                    });
                }).catch((error) => {
                    if (error.name == 'NotAllowedError') {
                        this.$message.error("请授权浏览器屏幕录制权限，否则无法进行屏幕分享");
                    } else {
                        console.error(error);
                        this.$message.error("请确认是否授权浏览器屏幕录制权限，否则无法进行屏幕分享");
                    }
                });
            } catch (error) {
                if (error.name == 'NotAllowedError') {
                    this.$message.error("请授权浏览器屏幕录制权限，否则无法进行屏幕分享");
                } else {
                    console.error(error);
                }
            }
        },
        /**
         * @description: 挂断操作
         * @param {type} 
         * @return: 
         */
        hangup() {
            if (this.isMaster && !this.hangupFlag) return;
            api.judageMaster({
                room_id: this.roomId,
                user_id: this.localUserID,
            }).then(res => {
                if (res.data.code === 0) {
                    if (res.data.data.is_master) {
                        if (this.$refs["dialog"]) {
                            this.$refs["dialog"].closeRoom = true;
                        }
                        this.isMaster = true;
                    } else {
                        this.liveEnd = true;
                        this.isMaster = false;
                        // 不是主持人 直接离开
                        this.localClient.unpublish(this.localStream).then(() => {
                            this.closeCamera();
                        })
                        this.reportedAction(this.localUserID, "2");
                    }
                    this.clearInter();
                }
            })
        },
        /**
         * @description: 挂断弹窗离开按钮
         * @param {type} 
         * @return: 
         */
        leaveRoomFun() {
            this.liveEnd = true;
            this.clearInter();
            this.isMaster = false;
            this.leaveRoom();
            if (this.$refs["dialog"]) {
                this.$refs["dialog"].closeRoom = false;
            }
        },
        /**
         * @description: 挂断弹窗关闭按钮
         * @param {type} 
         * @return: 
         */
        closeRoomFun() {
            this.localClient.unpublish(this.localStream).then(() => {
                this.closeCamera(true);
            }).catch((error) => {
                console.log(error);
            });
            api.dissolve({
                room_id: this.roomId
            }).then(() => {
                this.liveEnd = true;
                this.isMaster = true;
                this.clearInter();
                if (this.$refs["dialog"]) {
                    this.$refs["dialog"].closeRoom = false;
                }
            })
        },
        leaveRoom() {
            this.localClient.unpublish(this.localStream).then(() => {
                this.closeCamera();
            })
            this.reportedAction(this.localUserID, "2");
        },
        /**
         * @description: 关闭摄像头
         * @param {bool} not_leave 是否clent离开 默认离开
         * @return: 
         */
        closeCamera(not_leave) {
            // 关闭视频通话
            try {
                if (this.localStream) {
                    let videoTrack = this.localStream.getVideoTrack();
                    if (videoTrack) {
                        this.localStream.removeTrack(videoTrack).then(() => {
                            // 关闭摄像头
                            videoTrack.stop();
                        });
                    }
                }

                if (this.localStream3) {
                    this.shareClient.unpublish(this.localStream3).then(() => {
                        this.localStream3.close();
                        this.shareClient.leave();
                        this.sharing = false;
                    });
                }
                if (!not_leave) {
                    this.localClient.leave();
                }
            } catch (error) {
                console.log(error);
            }

        },
        /**
         * @description: 清除页面内定时
         */
        clearInter() {
            // 清除定时
            if (this.pollFun) {
                clearInterval(this.pollFun);
                this.pollFun = null;
            }
            if (this.hangupFun) {
                clearInterval(this.hangupFun);
                this.hangupFun = null;
            }
            if (this.continueTimeFun) {
                clearInterval(this.continueTimeFun);
                this.continueTimeFun = null;
            }
        },
        /**
         * @description: 删除用户
         * @param {string} id 被删除用户的id
         * @return: 
         */
        removeUser(id) {
            api.judageMaster({
                room_id: this.roomId,
                user_id: this.localUserID,
            }).then(res => {
                if (res.data.code === 0) {
                    if (res.data.data.is_master) {
                        this.isMaster = true;
                        api.removerUser({
                            room_id: this.roomId,
                            user_id: id
                        }).then((res) => {
                            if (res.data.code === 0) {
                                this.$message.success("操作成功");
                            } else {
                                this.$message.error("操作失败");
                            }
                        });
                    } else {
                        this.isMaster = false;
                        this.$message("无权限，请联系主持人操作");
                    }
                }
            });

        }
    },
    watch: {
        // 屏幕共享状态变更
        sharing(newval) {
            this.$store.dispatch('liveRoom/set_screen_share', newval);
            if (newval) {
                this.operatBarList[0].active = "on";
                this.operatBarList[0].name = "新的共享";
                this.operatBarList[1].show = true;
            } else {
                this.operatBarList[0].active = "off";
                this.operatBarList[0].name = "屏幕共享";
                this.operatBarList[1].show = false;
            }
        },
        // 打开or关闭播放视频弹窗
        showBoard(newval) {
            if (newval) {
                this.operatBarList = this.operatBarList.map((item, index) => {
                    if ([4, 5, 6].indexOf(index) > -1) {
                        item.show = true;
                    } else {
                        item.show = false;
                    }
                    return item;
                })
            } else {
                this.operatBarList = this.operatBarList.map((item, index) => {
                    if ([1, 2, 3].indexOf(index) > -1) {
                        item.show = false;
                    } else {
                        item.show = true;
                    }
                    return item;
                })
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        // 离开路由时候清除定时
        this.clearInter();
        next();
    },
    components: {
        OnlineInvatationDialog
    }
}
</script>

<style lang="less" scoped>
/*方法用户弹窗样式----end*/
.trtc-room-wrap {
    font-family: "PingFangSC", "Microsoft YaHei", "微软雅黑";
    width: 100%;
    height: 100%;

    * {
        box-sizing: border-box;
    }
}

.live-room-box {
    height: 100%;
    background: #121F2C;
}

.room {
    display: flex;
    height: 100%;
}

.room-R {
    display: flex;
    flex: 1;
    height: 100%;
    // border-radius: 8px;
    overflow: hidden;
    // margin-left: 10px;
    box-sizing: border-box;
    background: #1a2733;
    user-select: none;
}

.live-R {
    display: flex;
    flex-direction: column;
    width: 220px;
    height: 100%;
    padding: 10px;
    background: #3F4951;

    &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
    }
}

.list-wrap {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    margin-top: 12px;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
    }
}

.live-box-info {
    height: 30px;
    line-height: 30px;
    text-align: center;
    width: 192px;
    margin: 0 auto;
    border-radius: 15px;
    font-size: 12px;
    background: rgba(216, 216, 216, 0.4);
    color: #FFF;

    &>span:nth-child(1) {
        margin-right: 12px;
    }
}

.list-tips {
    margin-top: 6px;
    line-height: 17px;
    font-size: 12px;
    color: #FFF;
}

.list-box {
    width: 200px;
    height: 130px;
    position: relative;
    margin-bottom: 10px;

    &.active {
        border: 1px solid #F19548;
        cursor: default;

        // &::after {
        //     position: absolute;
        //     top: 50%;
        //     left: -14px;
        //     border: 6px solid transparent;
        //     transform: translate(0, -50%);
        //     border-right: 6px solid #FF5D23;
        //     content: ""
        // }
    }

    &:last-child {
        margin-bottom: 0;
    }

    .list-info {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        padding: 10px 10px 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
        z-index: 99;

        .enlarge-item {
            float: right;
            margin-left: 10px;
            cursor: pointer;

            .svg-icon {
                font-size: 18px;
            }
        }

        .list-info-detail {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #fff;

            .tell-box {
                margin-left: 5px;
            }
        }

        span {
            font-size: 14px;
            line-height: 20px;
            color: #FFF;
            user-select: none;
        }
    }

    .list-state {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 42px;
        padding: 0 10px 10px;
        color: #FFF;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
        z-index: 99;

        svg {
            width: 18px;
            height: 18px;
        }

        .list-state-L {
            display: flex;
            align-items: center;

            .delete-btn {
                margin-left: 26px;
                display: flex;
                align-items: center;

                span {
                    margin-left: 5px;
                    font-size: 14px;
                    line-height: 20PX;
                    color: #FFF;
                }
            }
        }

        .list-state-R {
            display: flex;
            align-items: center;
            font-size: 0;
            white-space: nowrap;

            span {
                font-size: 14px;
                margin-left: 5px;
                user-select: none;
            }

            .list-state-icon {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #13DD39;
            }

            .list-state-0 {
                background: #13DD39;
            }

            .list-state-1 {
                background: #B6B8BA;
            }

            .list-state-2 {
                background: #13DD39;
            }

            .list-state-3 {
                background: #F2BF43;
            }

            .list-state-4 {
                background: #F8463E;
            }
        }
    }

    .list-video-box {
        width: 100%;
        height: 100%;
        overflow: hidden;

        /deep/video {
            object-fit: contain !important;
        }

        &.bg-list-zxs {
            background: url("../images/bg-default-list-zxs.png") no-repeat center;
            background-size: cover;
        }

        &.bg-list-kh {
            background: url("../images/bg-default-list-kh.png") no-repeat center;
            background-size: cover;
        }
    }

    .list-share-box {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 10;
    }

    .list-state-layer {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9;

        span {
            position: absolute;
            font-size: 16px;
            line-height: 22px;
            left: 50%;
            top: 50%;
            color: #FFF;
            transform: translate(-50%, -50%);
            user-select: none;
        }
    }

    &.list-box-layer {

        .list-info,
        .list-state {
            background: transparent;
        }

        .list-state-layer {
            display: block;
        }
    }
}

.live-L {
    flex: 1;
    height: 100%;
    // position: relative;
}

.live-dialog {
    flex: 1;
    height: 100%;
    position: relative;
}

.live-box {
    width: 100%;
    height: 100%;

    /deep/video {
        object-fit: contain !important;
    }
}

.live-share {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;

    /deep/video {
        object-fit: contain !important;
    }

}

.bg-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: rgba(18, 31, 44, 0.8);
    }

    &.default {
        img {
            object-fit: cover;
        }
    }
}
.dialog-bg-img {
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: rgba(18, 31, 44, 0.8);
    }

    &.default {
        img {
            object-fit: cover;
        }
    }
}

.live-operat-wrap {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 450px;
    height: 40px;
    box-sizing: border-box;
    z-index: 9999;

    .operat-bar {
        display: flex;
        padding-left: 24px;

        .operat-box {
            text-align: center;
            width: 68px;
            margin-right: 24px;

            .btn-box {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 30px;
                border-radius: 17px;
                background: transparent;
                cursor: pointer;

                svg {
                    width: 24px;
                    height: 24px;
                }

                &:hover {
                    background: rgba(216, 216, 216, 0.6);
                }

                &:active {
                    background: rgba(18, 31, 44, 0.8);
                }
            }
        }
    }

    .hangup-box {
        min-width: 68px;
        text-align: center;

        .hangup-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 30px;
            padding: 0 12px;
            line-height: 30px;
            box-sizing: border-box;
            border-radius: 17px;
            background: #FF4636;
            cursor: pointer;

            span {
                font-size: 12px;
                white-space: nowrap;
                color: #FFF;
                user-select: none;
            }
        }

    }
}

.live-state {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 148px;
    height: 56px;
    line-height: 56px;
    font-size: 22px;
    text-align: center;
    border-radius: 38px;
    margin-left: -74px;
    margin-top: -28px;
    background: rgba(216, 216, 216, 0.4);
    color: #FFF;
    z-index: 12;
    cursor: default;
    user-select: none;
}

.bg-zxs {
    background: url("../images/bg-default-zxs.png") no-repeat center;
    background-size: cover;
}

.bg-kh {
    background: url("../images/bg-default-kh.png") no-repeat center;
    background-size: cover;
}

.live-end {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background: #121F2C;
    z-index: 99999;

    .live-L,
    .live-R {
        display: none;
    }
}

.end-tip {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
        font-size: 20px;
        line-height: 30px;
        color: #FFF;
    }

    .reJoin {
        margin-top: 32px;
        width: 104px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 38px;
        font-size: 14px;
        font-weight: bold;
        background: rgba(216, 216, 216, 0.4);
        color: #FFF;
        cursor: pointer;
    }

}

/deep/.board-wrap {
    top: 50%;
    margin-top: 0;
    transform: translateY(-50%);
    border-radius: 8px;

    .el-dialog__header {
        display: none;
    }

    .el-dialog__body {
        padding: 30px 24px 32px;
        border-radius: 8px;
    }

    .board-hd {
        display: flex;
        align-items: center;
        margin-bottom: 24px;

        &>span {
            font-size: 14px;
            line-height: 20px;
            color: #222222;
        }

        .select-video-inp {
            flex: 1;
            margin-left: 10px;
            margin-right: 20px;

            .el-input__inner {
                border-color: #DDDDDD;
                line-height: 38px;
                height: 38px;
                color: #222222;

                &::-webkit-input-placeholder {
                    color: #888888;
                }
            }
        }

        .finish-btn {
            width: 88px;
            height: 38px;
            margin-right: -24px;
            text-align: center;
            line-height: 38px;
            border-radius: 100px 0px 0px 100px;
            background: rgba(246, 74, 74, 0.1);
            font-size: 12px;
            color: #F64A4A;
            cursor: pointer;

            &:hover {
                background: rgba(246, 74, 74, 0.2);
            }
        }
    }

    .board-bd {
        position: relative;
        width: 100%;
        height: 412px;
        background: url("../images/img-video-take.png") no-repeat center;
        background-size: contain;

        .video-js {
            background: #000;

            .vjs-text-track-display {
                display: none;
            }
        }
    }
}
</style>
<style lang="less">
/*方法用户弹窗样式----start*/
.user-enlarge-wrapper {
    height: 507px;
    border-radius: 8px;
    overflow: hidden;

    /deep/.el-dialog__header {
        display: none;
    }

    /deep/.el-dialog__footer {
        display: none;
    }

    .dialog-body-box {
        position: relative;
        height: 100%;

        .enlarge-header-box {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 133px;
            background: linear-gradient(0, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
            z-index: 10;

            .close-dialog {
                float: right;
                margin: 27px 24px 0 0;
                cursor: pointer;

                .svg-icon {
                    font-size: 16px;
                }
            }

            .header-name {
                overflow: hidden;
                margin: 24px 0 0 24px;
                line-height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #fff;

                .tell-box {
                    margin-left: 5px;
                }
            }
        }

        .enlarge-footer-box {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 135px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
            z-index: 10;

            .mic-state-box {
                float: left;
                margin: 93px 0 0 24px;

                .svg-icon {
                    font-size: 16px;
                    color: #fff;
                }
            }

            .state-box {
                float: right;
                margin: 91px 24px 0 0;

                span {
                    line-height: 20px;
                    color: #fff;
                    font-size: 14px;
                    margin-left: 5px;
                    user-select: none;
                    vertical-align: middle;
                }

                .list-state-icon {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #13DD39;
                    vertical-align: middle;
                }

                .list-state-0 {
                    background: #13DD39;
                }

                .list-state-1 {
                    background: #B6B8BA;
                }

                .list-state-2 {
                    background: #13DD39;
                }

                .list-state-3 {
                    background: #F2BF43;
                }

                .list-state-4 {
                    background: #F8463E;
                }
            }
        }

        .back-reset {
            background: transparent;
        }

        .enlarge-body-box {
            height: 100%;
            width: 100%;

            .live-state-layer {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 6;

                .live-state {
                    background: transparent;
                    font-size: 20px;
                }
            }
        }
    }
}
</style>
