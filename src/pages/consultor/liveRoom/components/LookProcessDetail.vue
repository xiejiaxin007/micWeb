<!--
 * @Name: 带看流程介绍
 * @Description: 带看流程介绍组件
 * @Author: xiejiaxin
 * @Date: 2020-02-27
 -->
<template>
<div class="share-form-box process-detail-wrapper">
    <div class="hd">编辑带看楼盘</div>
    <div class="bd">
        <!-- 带看时长 -->
        <div
            v-if="stepData ? (stepData.time ? (stepData.time.hour || stepData.time.minute) : false) : false"
            class="look-time-box">
            <div class="th">预计带看时长：</div>
            <div class="td">
                <span
                    v-if="stepData.time.hour"
                    class="time">{{stepData.time.hour}}</span>
                <span
                    v-if="stepData.time.hour"
                    class="txt">小时</span>
                <span
                    v-if="stepData.time.minute"
                    class="time">{{stepData.time.minute}}</span>
                <span
                    v-if="stepData.time.minute"
                    class="txt">分钟</span>
            </div>
        </div>
        <!-- 选择楼盘 -->
        <div class="look-time-box choose-house">
            <div class="th">添加带看楼盘：</div>
            <div class="td">
                <search-select-radio
                    v-model="lookHouseInput"
                    placeholder="请选择楼盘"
                    :isSlot="isSlot"
                    :isBlurByChange="isBlurByChange"
                    :isDisabled="houseList ? houseList.length === 10 : false"
                    @getOption="getOption"
                    :apiInfo="houseApi"></search-select-radio>
            </div>
        </div>
        <!-- 楼盘数据 -->
        <div
            v-if="houseList ? houseList.length > 0 : false"
            class="house-list-box">
            <div
                v-for="(house, index) in houseList"
                :key="house.id"
                class="house-item">
                <div
                    v-if="houseList.length > 1"
                    class="item-operate">
                    <span
                        @click="delHouse(index, house)"
                        class="operate-btn del-btn">删除</span>
                    <span
                        @click="moveHouse('up', index)"
                        class="operate-btn move-btn"
                        :class="{'is-disabled': index === 0}">上移</span>
                    <span
                        @click="moveHouse('down', index)"
                        class="operate-btn move-btn"
                        :class="{'is-disabled': index === (houseList.length - 1)}">下移</span>
                </div>
                <div class="item-house-name">{{index + 1}}、{{house.name}}</div>
            </div>
        </div>
    </div>
    <div class="area-bottom">
        <span
            @click="completeStep"
            class="btn btn-step-complete">完成</span>
    </div>
</div>
</template>

<script>
import { SearchSelectRadio } from '@/components';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
import api from '../api/shareMaterialApi';
import utilJs from '../js/utils/utils';
import { commonFun } from '@/assets/js/utils/utils';
import commonApi from '@/api/commonApi';
export default {
    name: "look-process-detail",
    props: {
        // 模块数据
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            // 是否需要失去焦点
            isBlurByChange: false,
            // 记录当前已经选中的楼盘ID数组
            chosenHouseList: [],
            // 带看楼盘选择
            lookHouseInput: '',
            // 远程下拉框的自定义icon
            isSlot: {
                icon: 'svg-search-input'
            },
            // 带看楼盘下拉请求配置
            houseApi: {
                api: commonApi.getHouseOrder,
                params: {
                    q: '',
                    from: 'liveOrder',
                    not_in: []
                }
            },
            stepData: {},
            // 楼盘列表
            houseList: []
        }
    },
    components: {
        SearchSelectRadio
    },
    mounted() {
        PubSub.subscribe('draft', (msg, data) => {
            if (data.type === '2') {
                this.draftInfo.processDetail = this.houseList;
                this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
            }
        });
        // 获取楼盘数组
        this.getStepInfo();
    },
    computed: {
        ...mapState('liveRoom', ['currentStep', 'lookHouseList', 'draftInfo', 'orderId', 'personObj']),
        ...mapState(['trackCommon'])
    },
    methods: {
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
        // 根据当前步骤条类型请求相应数据
        getStepInfo() {
            // 如果有草稿，则使用草稿内容，并且当前登录人是所属咨询师，非所属咨询师需要实时请求
            let isBelong = this.personObj.employee_id === this.personObj.login_employee_id;
            if (this.draftInfo.processDetail.length > 0 && isBelong) {
                this.houseList = this.draftInfo.processDetail;
                // 将默认选好的楼盘ID添加到过滤对象中，第一次下拉时候就应该过滤掉
                this.houseList.forEach((item, index, arr) => {
                    this.houseApi.params.not_in.push(item.value);
                });
            } else {
                // 组装请求参数
                let obj = JSON.parse(JSON.stringify(this.params));
                obj.materialsType = this.currentStep.materials_type;
                utilJs.getStepInfo(obj).then((data) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data ? data.data.list : {};
                        this.stepData = list;
                        this.houseList = this.stepData ? this.stepData.result : [];
                        // 将默认选好的楼盘ID添加到过滤对象中，第一次下拉时候就应该过滤掉
                        this.houseList.forEach((item, index, arr) => {
                            this.houseApi.params.not_in.push(item.value);
                        });
                    }
                });
            }
        },
        // 点击完成按钮
        completeStep() {
            // 更新状态
            this.updateProcessDetail();
        },
        // 流程介绍保存
        async updateProcessDetail() {
            try {
                let projectArr = [];
                this.houseList.forEach((item, index, arr) => {
                    let obj = {
                        project_id: item.value
                    };
                    projectArr.push(obj);
                });
                // 组装保存数组
                let params = {
                    see_project_id: this.params.seeProId,
                    room_id: this.params.roomId,
                    project_arr: projectArr
                };
                let result = await api.updateHouseList(params);
                let {data} = result;
                if (data.code === 0) {
                    this.draftInfo.processDetail = [];
                    this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
                    // 更新状态
                    this.updateStep();
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 请求开始计时和结束计时
        updateStep(type) {
            if (this.currentStep.status !== '3') {
                let obj = JSON.parse(JSON.stringify(this.params));
                obj.materialsType = this.currentStep.materials_type;
                obj.status = '3';
                utilJs.updateStep(obj).then((data) => {
                    if (data.code === 0) {
                        // if (!this.currentStep.time) {
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
         * 选择楼盘下拉内容，并新增到楼盘列表中
         * @param {Object} item 选中楼盘数据对象
         */
        getOption(item) {
            this.houseList.push(item);
            // 把选中项加入选中楼盘数组中，请求下拉时候传递给后台
            this.houseApi.params.not_in.push(item.value);
            // 清空输入
            this.lookHouseInput = '';
            this.isBlurByChange = !this.isBlurByChange;
        },
        /**
         * 删除楼盘
         * @param {Number} paraIndex 选中楼盘的索引
         * @param {Object} item 选中楼盘数据对象
         */
        delHouse(paraIndex, item) {
            this.houseList.splice(paraIndex, 1);
            // 把选中的楼盘ID删除
            let isHas = this.houseApi.params.not_in.findIndex((house) => {
                return house === item.value;
            });
            if (isHas !== -1) {
                this.houseApi.params.not_in.splice(isHas, 1);
                // 埋点
                this.doTrack('7217');
            }
        },
        /**
         * 移动楼盘
         * @param {String} type 上移下移标志 up：上移，down：下移
         * @param {Number} index 选中楼盘的索引
         */
        moveHouse(type, index) {
            // 第一个上移和最后一个下移，点击无效
            if ((type === 'up' && index === 0) || (type === 'down' && index === this.houseList.length - 1)) {
                return;
            }
            if (type === 'up' && index > 0) {
                this.houseList[index] = this.houseList.splice(index - 1, 1, this.houseList[index])[0];
                // 埋点
                this.doTrack('7215');
            } else if (type === 'down' && index !== this.houseList.length - 1) {
                this.houseList[index] = this.houseList.splice(index + 1, 1, this.houseList[index])[0];
                // 埋点
                this.doTrack('7216');
            }
        }
    },
    watch: {
        // 监听传入数据，这么写是为了防止改变status的时候重新渲染
        'currentStep.materials_type': {
            handler: function (val, oldval) {
                this.getStepInfo();
            },
            deep: true
        },
        // 监听选中楼盘
        lookHouseList: {
            handler: function (val, oldval) {
                this.getStepInfo();
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.process-detail-wrapper{
    height: 100%;
    color: #222;
    .hd {
        position: relative;
        line-height: 25px;
        text-indent: 10px;
        color: #222;
        font-size: 18px;
        font-family: PingFangSC-Medium,PingFang SC;
        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            width: 4px;
            height: 18px;
            background-color: #ff4636;
            border-radius: 2px;
        }
    }
    .bd {
        margin-top: 20px;
    }
    .look-time-box {
        overflow: hidden;
        padding-left: 3px;
        box-sizing: border-box;
        .th {
            float: left;
            width: 98px;
            line-height: 20px;
            font-size: 14px;
        }
        .td {
            overflow: hidden;
            font-size: 0;
            &>span {
                display: inline-block;
                font-size: 14px;
                margin-right: 4px;
                line-height: 20px;
                &:last-of-type {
                    margin-right: 0;
                }
                &.time {
                    min-width: 20px;
                    padding: 0 2px;
                    box-sizing: border-box;
                    height: 20px;
                    border-radius: 2px;
                    text-align: center;
                    background-color: #3e4a59;
                    color: #fff;
                }
                &.txt {
                    color: #888;
                }
            }
        }
    }
    .choose-house {
        margin-top: 20px;
        .th {
            line-height: 38px;
        }
        .td {
            font-size: 14px;
        }
    }
}
/*楼盘列表样式*/
.house-list-box {
    max-height: 348px;
    overflow-y: auto;
    margin-top: 20px;
    border: 1px solid #eee;
    border-radius: 2px;
    .house-item {
        height: 50px;
        line-height: 50px;
        padding: 0 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        &:last-of-type {
            border-bottom: none;
        }
    }
    .item-operate {
        float: right;
        margin-left: 12px;
        padding-top: 15px;
        box-sizing: border-box;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        &>span {
            position: relative;
            padding: 0 6px;
            box-sizing: border-box;
            cursor: pointer;
            &::after {
                content: '';
                position: absolute;
                height: 14px;
                top: 2px;
                right: 0;
                width: 1px;
                background-color: #eee;
            }
            &:last-of-type {
                padding-right: 0;
                &::after {
                    display: none;
                }
            }
            &:first-of-type {
                padding-left: 0;
            }
        }
        .move-btn {
            color: #2776ef;
        }
        .del-btn {
            color: #f64a4a;
        }
        .is-disabled {
            color: #eee;
            cursor: not-allowed;
        }
    }
    .item-house-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        font-family: PingFangSC-Medium,PingFang SC;
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
</style>
