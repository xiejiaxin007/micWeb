<!--
 * @Name: 项目介绍组件
 * @Description: 项目介绍组件
 * @Author: xiejiaxin
 * @Date: 2020-02-28
 -->
<template>
<div class="area-wrapper">
    <div class="area-show-box">
        <div class="area-show">
            <div class="show-header">
                <div class="header-item">
                    <div class="item-name">{{name}}</div>
                    <div
                        v-show="houseType === 'vr' && vrOption.length > 0"
                        class="item-select">
                        <el-select
                            popper-class="house-type-popper"
                            v-model="chosenVr"
                            @change="changeVr"
                            placeholder="请选择">
                            <el-option
                                v-for="(item, index) in vrOption"
                                :key="index"
                                :label="item.title"
                                :value="item.vr_url">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="header-tab">
                    <span
                        v-show="vrShow"
                        @click="changeMeta('vr')"
                        :class="{'btn is-chosen': houseType === 'vr', 'btn': houseType !== 'vr'}">VR看房</span>
                    <span
                        @click="changeMeta('house')"
                        :class="{'btn is-chosen': houseType === 'house', 'btn': houseType !== 'house'}">楼盘材料</span>
                    <span
                        @click="inviteSaler"
                        class="btn btn-invite">邀请销售</span>
                </div>
            </div>
            <div class="show-content">
                <iframe
                    v-if="src"
                    :src="houseType === 'vr' ? src : `//vip.ow365.cn/?i=20811&draw=2&ssl=1&furl=${src}`"
                    width="100%"
                    height="100%"
                    id="house-frame"
                    class="ppt-iframe">
                </iframe>
                <div
                    v-else
                    class="no-resource">
                    <div class="no-resource-box">
                        <img
                            class="no-resource-pic"
                            src="../images/bg-default-house.png"
                            alt="没有资源">
                        <div class="no-resource-tip">暂无带看楼盘</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="area-bottom">
        <span
            v-show="areaList.length > 1"
            @click="trunTo('last')"
            class="btn btn-turn">返回上个项目</span>
        <span
            v-show="areaList.length > 1 && currentIndex !== (areaList.length - 1)"
            @click="trunTo('next')"
            class="btn btn-turn">进入下个项目</span>
        <span
            @click="completeStep"
            v-show="(areaList.length > 0 && currentIndex === (areaList.length - 1)) || areaList.length === 0"
            class="btn btn-step-complete">完成</span>
    </div>
    <invite-saler-dialog
        @sendStauts="sendStauts"
        @checkShow="checkShow"
        :params="params"
        :copyUrl="copyUrl"
        :show="inviteDialog"></invite-saler-dialog>
    <invite-dialog
        :roomId="params.roomId"
        @closeInviteDialog="closeInviteDialog"
        :isShow="inviteDialogShow">
    </invite-dialog>
</div>
</template>

<script>
import InviteSalerDialog from './InviteSalerDialog';
import InviteDialog from './InviteDialog';
import api from '../api/shareMaterialApi';
import utilJs from '../js/utils/utils';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: "house-show",
    props: {
        // 初始化数据
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    computed: {
        ...mapState('liveRoom', ['currentStep', 'lookHouseList', 'personObj', 'screenSharing', 'orderId', 'roomList']),
        ...mapState(['trackCommon']),
        vrShow() {
            let arr = this.areaList[this.currentIndex] ? this.areaList[this.currentIndex].project_vr : false;
            let result = arr ? this.areaList[this.currentIndex].project_vr.length > 0 : false;
            return result;
        }
    },
    data() {
        return {
            // 当前选中的vr
            chosenVr: '',
            // 邀请弹窗
            inviteDialog: false,
            // 当前进入到哪个区域
            currentIndex: 0,
            // 当前正在预览的是哪个材料 vr：VR看房 house：楼盘材料
            houseType: 'house',
            // vr户型下拉
            vrOption: [],
            // 区域ppt数组
            areaList: [],
            // 复制链接，app的进入房间url
            copyUrl: '',
            // 嵌入iframe的ppt路径
            src: '',
            // 项目名称
            name: '',
            // 邀请弹窗
            inviteDialogShow: false
        }
    },
    components: {
        InviteSalerDialog,
        InviteDialog
    },
    mounted() {
        // 组件初始化
        this.getModuleData();
    },
    methods: {
        closeInviteDialog() {
            this.inviteDialogShow = false;
        },
        /**
         * 统一埋点
         * @param {String} trackId 埋点ID
         */
        doTrack(trackId) {
            // 埋点
            let obj = {
                order_id: this.orderId,
                adviser_id: this.trackCommon.info.login_employee_id
            };
            commonFun.setTrackNew(trackId, obj);
        },
        // 请求模块数据
        getModuleData() {
            // 组装请求参数
            let obj = JSON.parse(JSON.stringify(this.params));
            obj.materialsType = this.currentStep.materials_type;
            // 请求模块数据
            utilJs.getStepInfo(obj).then((data) => {
                if (data && data.code === 0 && data.data) {
                    let list = data.data ? data.data.list : {};
                    this.areaList = list ? list.result : [];
                    this.copyUrl = list.invent_url;
                    // 给ppt赋值
                    if (this.areaList.length > 0) {
                        this.src = this.areaList[this.currentIndex].complete_url;
                        this.name = this.areaList[this.currentIndex].object_name;
                    }
                    // 请求步骤条更新接口
                    if (this.currentStep.status !== '3') {
                        this.updateHouseStep();
                    }
                }
            });
        },
        // 请求开始计时
        async updateHouseStep() {
            try {
                let params = {
                    materials_type: '7',
                    see_project_id: this.params.seeProId,
                    room_id: this.params.roomId,
                    project_id: this.areaList[this.currentIndex] ? this.areaList[this.currentIndex].object_id : '',
                    status: '2'
                };
                let result = await api.updateLookProgress(params);
                let {data} = result;
                if (data.code === 0) {
                    if (this.currentStep.status !== '2' && this.currentStep.materials_type === '7') {
                        let obj = JSON.parse(JSON.stringify(this.currentStep));
                        obj.status = '2';
                        // 同步到组件中
                        PubSub.publish('changeCurrentStep', {
                            type: 'update',
                            data: obj
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 点击完成按钮
        completeStep() {
            if (this.currentStep.status !== '3') {
                let obj = JSON.parse(JSON.stringify(this.params));
                obj.materialsType = this.currentStep.materials_type;
                obj.status = '3';
                utilJs.updateStep(obj).then((data) => {
                    if (data.code === 0) {
                        // if (!this.currentStep.time) {
                            // 第一次进行操作
                            let step = JSON.parse(JSON.stringify(this.currentStep));
                            step.time = data.data.time;
                            step.status = '3';
                            PubSub.publish('changeCurrentStep', {
                                type: 'next',
                                update: true,
                                data: step
                            });
                        // }
                    }
                });
            } else {
                PubSub.publish('changeCurrentStep', {type: 'next'});
            }
        },
        /**
         * 修改弹窗开关
         * @param {Boolean} val 弹窗开关修改值
         */
        checkShow(val) {
            this.inviteDialog = val;
            // 埋点
            this.doTrack('7226');
        },
        /**
         * 修改户型下拉框
         * @param {String} val 选中值
         */
        changeVr(val) {
            this.src = val;
        },
        /**
         * 获取短信发送状态
         * @param {String} val 发送状态
         */
        sendStauts(val) {
            if (val) {
                this.areaList[this.currentIndex].is_send = '1';
                // 埋点
                this.doTrack('7225');
            }
        },
        /**
         * @description: 2020.4.17-(判断在线的用户信息列表里面是否已经有app端进入)
         * @param {Array} roomUserList 直播间用户列表
         * @return {Boolean} rel 是否能够邀请销售
         */
        getCanVisit(roomUserList) {
            let rel = false;
            if (roomUserList.length > 0) {
                let index = roomUserList.findIndex((item) => {
                    return (item.user_state === 0 && item.user_id && item.user_id.indexOf('customer_') === 0);
                });
                if (index !== -1) {
                    rel = true;
                }
            }
            return rel;
        },
        // 邀请销售
        inviteSaler() {
            this.inviteDialogShow = true;
            // 埋点
            this.doTrack('7223');
            // if (this.getCanVisit(this.roomList)) {
            //     this.inviteDialogShow = true;
            //     // 埋点
            //     this.doTrack('7223');
            // } else {
            //     this.$message({
            //         message: '客户进入后重试',
            //         type: 'warning'
            //     });
            // }
        },
        /**
         * 当前项目下切换材料类型
         * @param {String} type vr：vr看房  house：楼盘材料
         */
        changeMeta(type) {
            this.houseType = type;
            let obj = {
                order_id: this.orderId,
                adviser_id: this.trackCommon.info.login_employee_id,
                tab_id: ''
            };
            if (type === 'vr') {
                this.src = this.areaList[this.currentIndex].project_vr[0].vr_url;
                this.name = this.areaList[this.currentIndex].object_name;
                this.vrOption = this.areaList[this.currentIndex].project_vr;
                this.chosenVr = this.vrOption[0].vr_url;
                obj.tab_id = '2';
            } else if (type === 'house') {
                this.src = this.areaList[this.currentIndex].complete_url;
                this.name = this.areaList[this.currentIndex].object_name;
                obj.tab_id = '1';
            }
            commonFun.setTrackNew('7235', obj);
        },
        /**
         * 切换项目
         * @param {String} type last：上一个  next：下一个
         */
        trunTo(type) {
            if (type === 'last' && this.currentIndex === 0) {
                this.$message({
                    message: '已经是第一个了',
                    type: 'warning'
                });
            } else if (type === 'last') {
                this.currentIndex--;
                // 恢复撑选中楼盘资料
                this.houseType = 'house';
                this.src = this.areaList[this.currentIndex].complete_url;
                this.name = this.areaList[this.currentIndex].object_name;
                // 埋点
                this.doTrack('7229');
            } else if (type === 'next') {
                this.currentIndex++;
                // 恢复选中楼盘资料
                this.houseType = 'house';
                this.src = this.areaList[this.currentIndex].complete_url;
                this.name = this.areaList[this.currentIndex].object_name;
                // 请求步骤条更新接口
                if (this.currentStep.status !== '3') {
                    this.updateHouseStep();
                }
                // 埋点
                this.doTrack('7233');
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
            }
        }
    },
    watch: {
        // 监听传入数据
        'currentStep.materials_type': {
            handler: function (val, oldval) {
                // 组件初始化
                this.getModuleData();
            },
            deep: true
        },
        // 监听选中楼盘
        lookHouseList: {
            handler: function (val, oldval) {
                this.getModuleData();
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.area-wrapper {
    height: 100%;
    flex-flow: column;
    display: flex;
    background-color: #fff;
    overflow: hidden;
    .area-show-box {
        flex: 1;
        .area-show {
            flex-flow: column;
            display: flex;
            height: 100%;
        }
        .show-header {
            display: flex;
            width: 100%;
            height: 40px;
            line-height: 40px;
            padding: 0 10px 0 20px;
            box-sizing: border-box;
            background-color: #1a2733;
            .header-tab {
                font-size: 0;
                &>span {
                    width: 68px;
                    height: 24px;
                    line-height: 24px;
                    padding: 0;
                    margin-left: 10px;
                    background:rgba(216, 216, 216, 0.4);
                    border-radius: 2px;
                    font-size: 12px;
                    color: #fff;
                    border: none;
                    &.is-chosen {
                        background-color: #2776ef;
                    }
                }
            }
            .header-item {
                flex: 1;
                font-size: 0;
                .item-name {
                    display: inline-block;
                    font-size: 16px;
                    color: #fff;
                    font-family: PingFangSC-Medium,PingFang SC;
                }
                .item-select {
                    display: inline-block;
                    margin-left: 10px;
                    font-size: 12px;
                    /deep/.el-select {
                        width: 156px;
                        .el-input__inner {
                            height: 24px;
                            line-height: 24px;
                            padding: 0 8px;
                            color: #fff;
                            border-radius: 2px;
                            background: rgba(18,31,44,0.8);
                            font-size: 12px;
                            border: 1px solid rgba(216,216,216,0.8);
                        }
                    }
                }
            }
        }
        .show-content {
            flex: 1;
        }
    }
    .ppt-iframe {
        border: none;
    }
    .no-resource {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .no-resource-pic {
            width: 275px;
            height: 200px;
        }
        .no-resource-tip {
            margin-top: 24px;
            line-height: 28px;
            color: #888;
            font-size: 20px;
            text-align: center;
        }
    }
    .area-bottom{
        position: absolute;
        right: 0;
        bottom: -40px;
        height: 40px;
        width: 269px;
        padding-right: 5px;
        box-sizing: border-box;
        background-color: #1a2733;
        text-align: right;
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 6px;
            bottom: 6px;
            width: 1px;
            background: url('../images/bg-division.png') no-repeat;
            background-size: 100%;
        }
        .btn{
            width: 104px;
            height: 30px;
            line-height: 30px;
            padding: 0;
            margin: 5px 0 0 10px;
            text-align: center;
            border: none;
            border-radius: 15px;
            font-size: 14px;
        }
        .btn-step-complete{
            background-color: #39d18e;
            color: #fff;
        }
        .btn-turn {
            background-color: #fff;
            color: #3e4254;
        }
    }
}
</style>