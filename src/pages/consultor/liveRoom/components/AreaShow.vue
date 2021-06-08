<!--
 * @Name: 区域介绍组件
 * @Description: 区域介绍组件
 * @Author: xiejiaxin
 * @Date: 2020-02-28
 -->
<template>
<div class="area-wrapper">
    <div class="area-show-box">
        <div
            v-if="areaList.length > 0"
            class="area-show">
            <div class="show-header">
                <div class="header-item">{{name}}</div>
            </div>
            <div class="show-content">
                <iframe
                    v-if="url"
                    :src="`//vip.ow365.cn/?i=20811&draw=2&ssl=1&furl=${url}`"
                    width="100%"
                    height="100%"
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
        <div
            v-else
            class="no-resource">
            <div class="no-resource-box">
                <img
                    class="no-resource-pic"
                    src="../images/bg-default-area.png"
                    alt="没有资源">
                <div class="no-resource-tip">暂无区域分析</div>
            </div>
        </div>
    </div>
    <div class="area-bottom">
        <span
            v-show="areaList.length > 1"
            @click="trunTo('last')"
            class="btn btn-turn">返回上个区域</span>
        <span
            v-show="areaList.length > 1 && currentIndex !== (areaList.length - 1)"
            @click="trunTo('next')"
            class="btn btn-turn">进入下个区域</span>
        <span
            @click="completeStep"
            v-show="(areaList.length > 0 && currentIndex === (areaList.length - 1)) || (areaList.length === 0)"
            class="btn btn-step-complete">完成</span>
    </div>
</div>
</template>

<script>
import utilJs from '../js/utils/utils';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: "area-show",
    props: {
        // 初始化数据
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            // 当前进入到哪个区域
            currentIndex: 0,
            // 区域ppt数组
            areaList: [],
            // 嵌入iframe的ppt路径
            url: '',
            // 当前的区域
            name: ''
        }
    },
    computed: {
        ...mapState('liveRoom', ['currentStep', 'lookHouseList', 'personObj', 'screenSharing', 'orderId']),
        ...mapState(['trackCommon'])
    },
    mounted() {
        // 组件初始化
        this.getModuleData();
    },
    methods: {
        // 请求模块数据
        getModuleData() {
            // 组装请求参数
            let obj = JSON.parse(JSON.stringify(this.params));
            obj.materialsType = this.currentStep.materials_type;
            utilJs.getStepInfo(obj).then((data) => {
                if (data && data.code === 0 && data.data) {
                    let list = data.data ? data.data.list : {};
                    this.areaList = list ? list.result : [];
                    // 给ppt赋值
                    if (this.areaList.length > 0) {
                        this.url = this.areaList[this.currentIndex].complete_url;
                        this.name = this.areaList[this.currentIndex].object_name;
                    }
                }
            });
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
        /**
         * 切换区域
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
                this.url = this.areaList[this.currentIndex].complete_url;
                this.name = this.areaList[this.currentIndex].object_name;
                // 埋点
                this.doTrack('7245');
            } else if (type === 'next') {
                this.currentIndex++;
                this.url = this.areaList[this.currentIndex].complete_url;
                this.name = this.areaList[this.currentIndex].object_name;
                // 埋点
                this.doTrack('7246');
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
            width: 100%;
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            box-sizing: border-box;
            background-color: #1a2733;
            .header-item {
                font-size: 16px;
                color: #fff;
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
