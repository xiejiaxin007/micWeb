<!--
 * @Name: 顶部步骤控制条
 * @Description: 顶部步骤控制条
 * @Author: xiejiaxin
 * @Date: 2020-02-26
 -->
<template>
<div
    class="step-control-box"
    :class="{'pack-up': controlStatus === 2}">
    <div
        @click="changeStepControl"
        class="box-operate">
        <i class="iconfont iconxialajiantou" aria-hidden="true"></i>
        <div class="operate-text">{{controlStatus === 1 ? '收起' : '展开'}}</div>
    </div>
    <div class="box-content">
        <div class="btn-area btn-area-box">
            <div
                @click="addTEduBoard"
                class="btn">播放视频</div>
            <div
                @click="updateHouse"
                class="btn">编辑楼盘</div>
            <div
                @click="goSearchTool"
                class="btn">找房工具</div>
            <div
                v-if="orderInfoUrl"
                @click="goOrderInfo"
                class="btn">查看订单</div>
        </div>
         <div class="step-control-content">
            <div class="step-control-list">
                <div
                    v-for="(item, index) in controlList"
                    :key="item.materials_type"
                    class="step-control-item"
                    :class="{'is-doing': item.status === '2', 'is-done': item.status === '3', 'wait-doing': ((personObj.employee_id === personObj.login_employee_id) && item.status === '1' && index > 0 && !(controlList[index - 1].time)) }">
                    <div
                        @click="changeStep(item, index)"
                        class="item-step-cont">
                        <div
                            :class="{'is-chosen': currentItemIndex === index}"
                            class="item-circle">
                            <jl-icon-svg
                                v-show="item.time"
                                icon-class="svg-step-time"></jl-icon-svg>
                            <span class="time">{{item.time ? matchTime(item.time) : (item.status === '2' ? '进行中' : '未开始')}}</span>
                        </div>
                        <div class="item-text">{{item.name}}</div>
                    </div>
                    <div
                        v-if="index !== 0"
                        class="item-line"></div>
                </div>
            </div>
         </div>
    </div>
</div>
</template>

<script>
import api from '../api/shareMaterialApi';
import apiRoom from "../api/liveRoomApi";
import PubSub from 'pubsub-js';
import { mapState } from 'vuex';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: "step-control",
    props: {
        // 请求参数
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    computed: {
        ...mapState('liveRoom', ['currentStep', 'orderId', 'personObj', 'screenSharing']),
        ...mapState(['trackCommon'])
    },
    data() {
        return {
            // 步骤条的数组对象 1：未开始 2:正在进行中 3:已完成
            controlList: [],
            // 当前选中的步骤条
            currentItemIndex: 0,
            // 步骤条展开收起状态，1：展开，2:收起
            controlStatus: 1,
            startWatch: true,
            // 找房工具url
            goSearchToolUrl: '',
            // 订单详情url
            orderInfoUrl: ''
        }
    },
    mounted() {
        // 初始化步骤条
        this.initStepToolBar();
    },
    methods: {
        /**
         * 匹配时间，将小数点转换为冒号
         * @param {String} val 时间
         */
        matchTime(val) {
            let rel = '';
            if (val) {
                rel = val.toString().replace(/\./g, ':');
            }
            return rel;
        },
        // 步骤条数据监听
        watchStep() {
            if (this.personObj.employee_id !== this.personObj.login_employee_id) {
                // 当前登录人是非所属咨询师，则只能进行查看，不能进行操作
                PubSub.subscribe('changeCurrentStep', (msg, data) => {
                    let obj = {};
                    if (this.currentStep.currentIndex < (this.controlList.length - 1)) {
                        this.currentItemIndex = this.currentStep.currentIndex + 1;
                        obj = this.controlList[this.currentItemIndex];
                        obj.currentIndex = this.currentItemIndex;
                        this.$store.dispatch('liveRoom/get_current_step', obj);
                    }
                });
            } else {
                PubSub.subscribe('changeCurrentStep', (msg, data) => {
                    let obj = {};
                    if (data.type === 'next') {
                        if (data.update) {
                            // 更新当前刚刚完成的步骤，第一次完成步骤
                            let nowIndex = data.data.currentIndex;
                            this.$set(this.controlList, nowIndex, data.data);
                            // this.controlList[nowIndex] = data.data;
                            if (nowIndex < (this.controlList.length - 1)) {
                                // 下一步的状态设置成2
                                nowIndex++;
                                this.$set(this.controlList[nowIndex], 'status', '2');
                                // this.controlList[nowIndex].status = '2';
                            }
                            this.getCurrentStepMethod();
                        } else {
                            // 已经完成的步骤，点击下一步
                            // 埋点
                            this.completeTrack();
                            // 下一步且不是最后一步
                            if (this.currentStep.currentIndex < (this.controlList.length - 1)) {
                                this.currentItemIndex = this.currentStep.currentIndex + 1;
                                obj = this.controlList[this.currentItemIndex];
                                obj.currentIndex = this.currentItemIndex;
                                this.$store.dispatch('liveRoom/get_current_step', obj);
                            }
                            // 检查是否是在共享状态
                            this.checkShare();
                        }
                    } else if (data.type === 'update') {
                        // 单纯更新状态为正在进行中（因为完成一步后，可能下一步的状态是1，也就是未开始）
                        // this.controlList[data.data.currentIndex] = data.data;
                        this.$set(this.controlList, data.data.currentIndex, data.data);
                        this.$store.dispatch('liveRoom/get_current_step', data.data);
                    } else if (data.type === 'last') {
                        // 更新当前刚刚完成的步骤，第一次完成步骤
                        if (data.update) {
                            // this.controlList[data.data.currentIndex] = data.data;
                            this.$set(this.controlList, data.data.currentIndex, data.data);
                        } else {
                            // 最后一步埋点
                            this.completeTrack();
                        }
                        // 最后一步完成，打开分享模块
                        let stepData = {
                            materials_type: '9',
                            status: '3'
                        };
                        this.$store.dispatch('liveRoom/get_current_step', stepData);
                    } else if (data.type === 'pre') {
                        let preData = this.controlList[this.controlList.length - 1];
                        this.$store.dispatch('liveRoom/get_current_step', preData);
                    }
                });
            }
        },
        // 用户需求埋点，已经完成的状态下
        completeTrack() {
            if (this.currentStep.materials_type !== '5') {
                let saInfo = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id,
                    tag_type: this.currentStep.materials_type
                };
                commonFun.setTrackNew('7201', saInfo);
            }
        },
        // 检测是否是在共享状态
        checkShare() {
            // 判断当前是不是需要共享屏幕，如果当前是所属咨询师并且没有打开共享，则提示
            let belongFlag = this.personObj.employee_id === this.personObj.login_employee_id;
            if (belongFlag && !this.screenSharing) {
                this.$message({
                    message: '请在屏幕共享状态下完成线上带看',
                    type: 'error',
                    duration: 0,
                    showClose: true
                });
            }
        },
        // 点击找房工具
        goSearchTool() {
            this.doTrack('7213');
            window.open(this.goSearchToolUrl, "_blank");
        },
        // 点击订单详情跳转
        goOrderInfo() {
            this.doTrack('7241');
            window.open(this.orderInfoUrl, "_blank");
        },
        // 初始化步骤条
        async initStepToolBar(type) {
            // 加载loading
            this.loading = this.$loading({
                lock: true,
                text: '正在加载',
                spinner: 'el-icon-loading',
                customClass: 'loading-default-box',
                background: 'rgba(255, 255, 255, 0.8)'
            });
            try {
                let params = {
                    room_id: this.params.roomId
                };
                let result = await api.initStepBar(params);
                let {data} = result;
                if (data.code === 0) {
                    this.apiOrderId = data.data.other_info ? data.data.other_info.order_id : '';
                    let personObj = {
                        employee_id: data.data.other_info ? data.data.other_info.employee_id : '',
                        login_employee_id: data.data.other_info ? data.data.other_info.login_employee_id : ''
                    };
                    // 获取当前的user_id
                    this.userId = data.data.other_info ? data.data.other_info.live_user_id : ''
                    // 赋值带看ID
                    this.seeProId = data.data.other_info ? data.data.other_info.see_project_id : '';
                    // 暴露给父组件
                    this.$emit('getSeeId', this.seeProId);
                    // 保存当前所属人和登录人ID
                    this.$store.dispatch('liveRoom/set_person_obj', personObj);
                    // 保存order_id
                    this.$store.dispatch('liveRoom/set_order_id', this.apiOrderId);
                    // 带看ID
                    // 浏览事件埋点
                    let obj = {
                        order_id: this.apiOrderId,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrackNew('7190', obj);
                    // 步骤条数据监听
                    this.watchStep();
                    // 找房工具url
                    this.goSearchToolUrl = data.data.other_info ? data.data.other_info.map_url : '';
                    // 订单详情url
                    this.orderInfoUrl = data.data.other_info ? data.data.other_info.order_view_url : '';
                    this.startWatch = false;
                    this.controlList = data.data.controlList ? data.data.controlList : [];
                    // 获取当前进行的步骤
                    this.getCurrentStepMethod();
                }
                // 关闭加载loading
                this.loading.close();
            } catch (error) {
                console.log(error);
                // 关闭加载loading
                this.loading.close();
            }
        },
        // 添加白板
        async addTEduBoard() {
            // 加载loading
            this.loading = this.$loading({
                lock: true,
                text: '正在加载',
                spinner: 'el-icon-loading',
                customClass: 'loading-default-box',
                background: 'rgba(255, 255, 255, 0.8)'
            });
            try {
                let params = {
                    room_id: this.params.roomId,
                    user_id: this.userId
                }
                let result = await apiRoom.judageMaster(params);
                let {data} = result;
                if (data.code === 0) {
                    if (data.data.is_master) {
                        // 打开白板
                        this.$emit('showVideoDialog', true);
                    } else {
                        this.$message({
                            message: '无法操作',
                            type: 'warning'
                        });
                    }
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    });
                }
                // 关闭加载loading
                this.loading.close();
            } catch (error) {
                console.log(error);
                // 关闭加载loading
                this.loading.close();
            }
        },
        // 点击修改楼盘按钮
        updateHouse() {
            if (this.personObj.employee_id === this.personObj.login_employee_id) {
                // 埋点
                this.doTrack('7204');
                this.$emit('startUpdateHouse', true);
            } else {
                this.$message({
                    message: '无法操作',
                    type: 'warning'
                });
            }
        },
        /**
         * 统一埋点
         * @param {String} trackId 埋点ID
         */
        doTrack(trackId) {
            // 埋点
            let obj = {
                order_id: this.apiOrderId,
                adviser_id: this.trackCommon.info.login_employee_id,
                tag_type: this.currentStep.materials_type
            };
            commonFun.setTrackNew(trackId, obj);
        },
        // 展开和收起步骤条
        changeStepControl() {
            if (this.controlStatus === 1) {
                this.controlStatus = 2;
                this.doTrack('7243');
            } else {
                this.controlStatus = 1;
                this.doTrack('7242');
            }
        },
        // 获取进入页面时候进入到的步骤索引
        getCurrentStepMethod() {
            let obj = {};
            let isHas = this.controlList.find((item, index, arr) => {
                this.currentItemIndex = index;
                return item.status === '2';
            });
            if (isHas) {
                obj = isHas;
            } else {
                let updateObj = this.controlList.find((item, index, arr) => {
                    this.currentItemIndex = index;
                    return item.status === '1';
                });
                if (updateObj) {
                    obj = updateObj;
                }
            }
            if (JSON.stringify(obj) !== '{}') {
                obj.currentIndex = this.currentItemIndex;
                // 为true，表示页面刷新或者是第一次进入，需要在子组件进行监听
                obj.isMounted = true;
                this.$store.dispatch('liveRoom/get_current_step', obj);
                // 通知保存
                PubSub.publish('draft', {
                    type: obj.materials_type
                });
            } else {
                obj = this.controlList[0];
                this.currentItemIndex = 0;
                obj.currentIndex = 0;
            }
        },
        /**
         * 切换步骤
         * @param {Object} item 选中步骤的数据对象
         * @param {Number} paraIndex 选中步骤的索引
         */
        changeStep(item, paraIndex) {
            // 保存一份切换之前的
            this.currentType = JSON.parse(JSON.stringify(this.currentStep)).materials_type;
            // 如果选中的不是自己，才有想用操作
            if (paraIndex !== this.currentItemIndex) {
                if (this.personObj.employee_id !== this.personObj.login_employee_id) {
                    // 非所属咨询师，可以查看任意步骤
                    // 埋点
                    let obj = {
                        adviser_id: this.trackCommon.info.login_employee_id,
                        tag_type: item.materials_type
                    };
                    commonFun.setTrackNew('7203', obj);
                    // 请求接口
                    this.getStepInfo(item, paraIndex);
                    this.currentItemIndex = paraIndex;
                } else {
                    // 未完成步骤的只能一步一步按顺序进入
                    // 当前选中项不是第一个并且选中项的前面一个步骤已经完成，则可以进入该步骤
                    if ((paraIndex > 0 && this.controlList[paraIndex - 1].time) || paraIndex === 0) {
                        // 通知保存
                        PubSub.publish('draft', {
                            type: this.currentType
                        });
                        // 埋点
                        let obj = {
                            adviser_id: this.trackCommon.info.login_employee_id,
                            tag_type: item.materials_type
                        };
                        commonFun.setTrackNew('7203', obj);
                        // 请求接口
                        this.getStepInfo(item, paraIndex);
                        this.currentItemIndex = paraIndex;
                    }
                }
            }
        },
        /**
         * 切换步骤进行数据请求
         * @param {Object} item 选中步骤的数据对象
         * @param {Number} index 选中步骤的索引
         */
        getStepInfo(item, index) {
            item.currentIndex = index;
            // 设置成false后，不需要进行监听
            // item.isMounted = false;
            this.$store.dispatch('liveRoom/get_current_step', item);
            // this.$emit('getCurrentStep', item);
        }
    }
};
</script>

<style lang="less" scoped>
.step-control-box{
    height: 92px;
    background-color: #121f2c;
    padding: 0 20px;
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.5s;
}
.box-operate{
    float: right;
    width: auto;
    margin: 22px 0 0 20px;
    text-align: center;
    cursor: pointer;
    transition: 0.5s;
    .svg-icon{
        margin-bottom: 6px;
        font-size: 14px;
        color: #fff;
    }
    .iconxialajiantou {
        display: inline-block;
        margin-bottom: 2px;
        transform: rotate(180deg);
        font-size: 20px;
        color: #fff;
        transition: 0.5s;
        font-weight: bold;
    }
    .operate-text{
        line-height: 20px;
        font-size: 14px;
        color: #fff;
    }
}
.pack-up{
    height: 40px;
    .btn-area{
        display: none;
    }
    .step-control-content{
        display: none;
    }
    .box-operate{
        margin-top: 8px;
        .iconxialajiantou {
            margin-bottom: 0;
            transform: rotate(0);
            vertical-align: middle;
        }
        .operate-text{
            display: inline-block;
            margin-left: 5px;
            vertical-align: middle;
        }
    }
}
.box-content{
    overflow: hidden;
}
.btn-area {
    float: right;
    margin: 26px 0 0 50px;
    text-align: right;
    transition: 0.5s;
    .btn {
        width: 92px;
        padding: 12px 0 11px;
        margin-left: 10px;
        background: rgba(216, 216, 216, 0.4);
        box-sizing: border-box;
        text-align: center;
        border: none;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        &:first-of-type{
            margin-left: 0;
        }
    }
}
.btn-area-box {
    font-size: 0;
    .btn {
        width: 72px;
        padding: 11px 0;
    }
}
.step-control-content{
    overflow: hidden;
    transition: 0.5s;
}
.step-control-list{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .step-control-item{
        flex: 1;
        &:first-of-type{
            flex: 0;
        }
        .item-step-cont{
            float: right;
            width: 68px;
            text-align: center;
            cursor: pointer;
            .item-circle{
                overflow: hidden;
                height: 24px;
                margin-bottom: 8px;
                line-height: 23px;
                border-radius: 12px;
                font-size: 14px;
                color: #fff;
                text-align: center;
                background-color: #888;
                .svg-icon{
                    display: inline-block;
                    font-size: 12px;
                }
                .time {
                    vertical-align: middle;
                }
            }
            .is-chosen {
                border-radius: 14px;
            }
            .item-text{
                font-size: 14px;
                color: #fff;
                font-family: PingFangSC-Medium, PingFang SC;
            }
        }
        .item-line{
            overflow: hidden;
            height: 2px;
            margin-top: 12px;
            background-color: #888;
        }
    }
    .is-doing{
        .item-step-cont{
            .item-circle{
                background-color: #ff4636;
                .time{
                    word-break: break-all;
                    color: #fff;
                    vertical-align: middle;
                }
            }
            .item-text{
                color: #ff4636;
            }
        }
        .item-line{
            background-color: #ff4636;
        }
    }
    .is-chosen {
        border: 1px solid #fff;
        border-radius: 14px;
    }
    .is-done{
        .item-step-cont{
            .item-circle{
                background-color: #2776ef;
                .time{
                    word-break: break-all;
                    color: #fff;
                    vertical-align: middle;
                }
            }
            .item-text{
                color: #2776ef;
            }
        }
        .item-line{
            background-color: #2776ef;
        }
    }
    .wait-doing{
        .item-step-cont{
            cursor: not-allowed;
        }
    }
}
</style>
