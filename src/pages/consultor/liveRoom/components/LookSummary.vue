<!--
 * @Name: 线上带看总结组件
 * @Description: 线上带看总结组件
 * @Author: xiejiaxin
 * @Date: 2020-02-29
 -->
<template>
<div class="process-detail-wrapper">
    <div class="hd">线上带看总结</div>
    <div class="bd">
        <div class="project-container">
            <!-- 区域 -->
            <div
                v-for="item in summaryArr"
                :key="item.summary_type"
                class="project-wrap">
                <div
                    v-if="item.summary_arr.length > 0"
                    class="pro-title">{{item.summary_name}}</div>
                <ul class="house-info-wrap">
                    <li
                        v-for="subItem in item.summary_arr"
                        :key="subItem.object_id"
                        class="house-box">
                        <div class="info-header">
                            <span class="item">
                                <span class="name">{{subItem.object_name}}</span>
                            </span>
                        </div>
                        <div class="info">
                            <div class="area-txt share-form-box">
                                <el-input
                                    :autosize="{ minRows: 4}"
                                    type="textarea"
                                    maxlength="3000"
                                    v-model.trim="subItem.summary"
                                    placeholder="字数在50-100字范围效果会更好哦"
                                ></el-input>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="area-bottom">
        <span
            @click="saveSummary"
            class="btn btn-step-complete">分享给客户</span>
    </div>
</div>
</template>

<script>
import utilJs from '../js/utils/utils';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
import api from '../api/shareMaterialApi';
export default {
    name: "look-summary",
    data() {
        return {
            // 带看楼盘选择
            lookHouseInput: '',
            // 总结数组
            summaryArr: []
        }
    },
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
        ...mapState('liveRoom', ['currentStep', 'lookHouseList', 'draftInfo', 'personObj'])
    },
    mounted() {
        PubSub.subscribe('draft', (msg, data) => {
            if (data.type === '8') {
                this.draftInfo.summary = this.summaryArr;
                this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
            }
        });
        this.getModuleData();
    },
    methods: {
        // 请求模块数据
        getModuleData() {
            let isBelong = this.personObj.employee_id === this.personObj.login_employee_id;
            if (this.draftInfo.summary.length > 0 && isBelong) {
                this.summaryArr = this.draftInfo.summary;
            } else {
                // 组装请求参数
                let obj = JSON.parse(JSON.stringify(this.params));
                obj.materialsType = this.currentStep.materials_type;
                utilJs.getStepInfo(obj).then((data) => {
                    if (data.code === 0 && data.data) {
                        let list = data.data ? data.data.list : {};
                        this.summaryArr = list ? list.result : [];
                    }
                });
            }
        },
        // 保存总结
        async saveSummary() {
            try {
                // 组装保存数组
                let arr = [];
                this.summaryArr.forEach((item) => {
                    item.summary_arr.forEach((subItem) => {
                        arr.push(subItem);
                    });
                });
                let params = {
                    see_project_id: this.params.seeProId,
                    room_id: this.params.roomId,
                    summary_arr: arr
                };
                let result = await api.updateSummary(params);
                let {data} = result;
                if (data.code === 0) {
                    // 更新vuex
                    this.draftInfo.summary = [];
                    this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
                    this.completeStep();
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
                                type: 'last',
                                update: true,
                                data: step
                            });
                        // }
                    }
                });
            } else {
                PubSub.publish('changeCurrentStep', {type: 'last'});
            }
        }
    },
    watch: {
        // 监听传入数据
        'currentStep.materials_type': {
            handler: function (val, oldval) {
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
    .project-container {
        padding: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        border-radius: 4px;
        background-color: #f4f5f9;
        .project-wrap {
            color: #333;
            font-size: 14px;
            padding-top: 20px;
            &:first-of-type {
                padding-top: 0;
            }
            .pro-title {
                line-height: 26px;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 14px;
                font-family: PingFangSC-Medium,PingFang SC;
            }
            /deep/.el-textarea__inner {
                color: #666;
                resize: none;
                border-radius: 4px;
            }
            .house-info-wrap {
                .house-box {
                    background-color: #fff;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .area-txt {
                        overflow: hidden;
                        zoom: 1;
                        .el-textarea {
                            border-radius: 4px;
                            box-sizing: border-box;
                        }
                    }
                    .info-header {
                        padding: 16px 0 12px 20px;
                        box-sizing: border-box;
                        .item {
                            .name {
                                line-height: 20px;
                                color: #333;
                                font-size: 14px;
                                font-family: PingFangSC-Medium,PingFang SC;
                            }
                        }
                    }
                    .info {
                        padding: 14px 20px;
                        box-sizing: border-box;
                        border-top: 1px solid #eee;
                        /deep/.el-textarea__inner {
                            border: none;
                            padding: 0;
                            font-size: 14px;
                            line-height: 20px;
                        }
                        > span {
                            display: inline-block;
                        }
                    }
                }
            }
        }
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
