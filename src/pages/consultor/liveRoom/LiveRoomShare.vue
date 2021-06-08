<!--
 * @Name: 直播间总页面
 * @Description: 直播间总页面以及共享屏幕
 * @Author: xiejiaxin
 * @Date: 2020-02-26
 -->
<template>
<div class="live-room-wrap">
    <div class="live-room-header-controls">
        <step-control
            :params="params"
            @getSeeId="getSeeId"
            @showVideoDialog="showVideoDialog"
            @startUpdateHouse="startUpdateHouse"></step-control>
    </div>
    <div class="live-room-content">
        <trtc-room ref="trtcRoom"></trtc-room>
        <div class="live-room-materials-box">
                <!-- 个人介绍、公司介绍、市场介绍 -->
            <div
                v-if="currentStep.materials_type === '1' || currentStep.materials_type === '3' || currentStep.materials_type === '4'"
                class="materials-preview">
                <div class="ppt-box">
                    <show-ppt
                        :params="params"
                        :type="currentStep.materials_type"
                        :src="src"></show-ppt>
                </div>
            </div>
            <!-- 带看流程介绍 -->
            <div
                v-if="currentStep.materials_type === '2'"
                class="operate-in-time-box">
                <div class="operate-show-box">
                    <look-process-detail :params="params"></look-process-detail>
                </div>
            </div>
            <!-- 用户需求模块 -->
            <div
                v-if="currentStep.materials_type === '5'"
                class="operate-in-time-box">
                <div class="operate-show-box">
                    <user-require :params="params"></user-require>
                </div>
            </div>
            <!-- 区域介绍 -->
            <div
                class="introduce-box"
                v-if="currentStep.materials_type === '6'">
                <area-show :params="params"></area-show>
            </div>
            <!-- 项目介绍 -->
            <div
                class="introduce-box"
                v-if="currentStep.materials_type === '7'">
                <house-show :params="params"></house-show>
            </div>
            <!-- 总结模块 -->
            <div
                v-if="currentStep.materials_type === '8'"
                class="operate-in-time-box">
                <div class="operate-show-box">
                    <look-summary :params="params"></look-summary>
                </div>
            </div>
            <!-- 分享模块 -->
            <div
                v-if="currentStep.materials_type === '9'"
                class="operate-in-time-box">
                <div class="operate-show-box">
                    <share-method
                        :params="params"
                        :shareData="shareData"></share-method>
                </div>
            </div>
        </div>
    </div>
    <!-- 编辑楼盘弹窗 -->
    <look-house-dialog
        @checkShow="checkShow"
        :params="params"
        :show="updateHouseDialog"></look-house-dialog>
</div>
</template>

<script>
import api from './api/shareMaterialApi';
import utilJs from './js/utils/utils';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
import {
    StepControl,
    ShowPpt,
    LookProcessDetail,
    LookHouseDialog,
    ShareMethod,
    AreaShow,
    HouseShow,
    LookSummary,
    TrtcRoom,
    UserRequire
} from './components';
import './css/form.less';
import './css/dialog.less';
import './css/reset.less';
export default {
    name: "live-room-share",
    data() {
        return {
            // 请求接口数据
            params: {
                seeProId: '',
                roomId: this.$route.query.room_id,
                materialsType: ''
            },
            // 分享模块数据
            shareData: {},
            // 模块初始化数据
            stepData: {},
            // 步骤条数据
            controlList: [],
            // 二维码链接
            codePic: '',
            // 修改楼盘弹窗开关
            updateHouseDialog: false,
            src: ''
            // src: 'https://view.officeapps.live.com/op/view.aspx?src=http://comjia-1.oss-cn-beijing.aliyuncs.com/developer/20200221/20200221020121_jfym.pptx'
        }
    },
    components: {
        StepControl,
        ShowPpt,
        LookProcessDetail,
        LookHouseDialog,
        ShareMethod,
        AreaShow,
        HouseShow,
        LookSummary,
        TrtcRoom,
        UserRequire
    },
    computed: {
        ...mapState('liveRoom', ['currentStep', 'personObj'])
    },
    methods: {
        /**
         * 提醒打开白板
         * @param {Boolean} val 是否打开白板
         */
        showVideoDialog(val) {
            this.$refs.trtcRoom.openVideoDialog();
        },
        /**
         * 获取带看ID
         * @param {String} val 带看ID
         */
        getSeeId(val) {
            this.params.seeProId = val;
        },
        /**
         * 触发修改楼盘弹窗
         * @param {Boolean} val 触发值
         */
        startUpdateHouse(val) {
            this.updateHouseDialog = val;
        },
        /**
         * 修改弹窗开关
         * @param {Boolean} val 弹窗开关修改值
         */
        checkShow(val) {
            this.updateHouseDialog = val;
        },
        /**
         * 请求开始计时和结束计时
         * @param {String} type start：开始计时，如果不传，则需要更新步骤条
         */
        async updateStep(type) {
            try {
                let params = {
                    materials_type: this.currentStep.materials_type,
                    see_project_id: this.params.seeProId,
                    room_id: this.params.roomId,
                    status: '2'
                };
                let result = await api.updateLookProgress(params);
                let {data} = result;
                if (data.code === 0) {
                    if (this.currentStep.status !== '2') {
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
        /**
         * 获取当前点击的步骤条内容，请求相应数据
         * @param {Object} stepItem 选中步骤的数据对象
         */
        getCurrentStep(stepItem) {
            let item = JSON.parse(JSON.stringify(stepItem));
            // type为9，表示当前已经进入最后分享环节
            if (item.materials_type !== '9') {
                if (this.personObj.employee_id === this.personObj.login_employee_id && item.materials_type !== '7') {
                    // 开始计时
                    if (item.status !== '3') {
                        item.status = '2';
                        this.updateStep('start');
                    }
                }
            } else {
                if (JSON.stringify(this.shareData) === '{}') {
                    // 当前已经进入分享环节，请求分享数据，数据不会变，就请求一次即可
                    this.getModuleData();
                }
            }
        },
        // 请求模块数据
        getModuleData() {
            // 组装请求参数
            let obj = this.params;
            obj.materialsType = this.currentStep.materials_type;
            utilJs.getStepInfo(obj).then((data) => {
                if (data.code === 0 && data.data) {
                    let list = data.data ? data.data.list : {};
                    this.shareData = list;
                }
            });
        }
    },
    watch: {
        // 监听传入数据
        currentStep: {
            handler: function (val, oldval) {
                this.getCurrentStep(val);
            },
            deep: true
        }
    }
}
</script>

<style lang="less" scoped>
.live-room-wrap{
    height: 100%;
    flex-flow: column;
    display:flex;
}
.live-room-content{
    flex: 1;
    position: relative;
    background-color: #1a2733;
}
.xueshuai-box {
    height: 100%;
}
.live-room-user-list{
    float: right;
    width: 220px;
    background: rgba(18, 31, 44, 0.8);
    height: 100%;
}
.live-room-materials-box{
    position: absolute;
    right: 220px;
    top: 0;
    left: 0;
    bottom: 40px;
    flex-flow: column;
    display:flex;
}
.materials-preview{
    flex: 1;
    overflow: auto;
    .ppt-box{
        height: 100%;
    }
}
.introduce-box {
    height: 100%;
}
.materials-bottom{
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
        background: url('./images/bg-division.png') no-repeat;
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
    .step-complete{
        background-color: #39d18e;
        color: #fff;
    }
}
.operate-in-time-box{
    flex: 1;
    overflow-y: auto;
    background-color: #fff;
    .operate-show-box{
        width: 626px;
        margin: 40px auto 0;
    }
}
</style>