<!--
 * @Name: 展示ppt组件
 * @Description: 展示ppt组件
 * @Author: xiejiaxin
 * @Date: 2020-02-26
 -->
<template>
<div class="ppt-wrapper">
    <iframe
        v-if="JSON.stringify(stepData) !== '{}' ? stepData.complete_url : false"
        :src="`//vip.ow365.cn/?i=20811&draw=2&ssl=1&furl=${stepData.complete_url}`"
        width='100%'
        height='100%'
        class="ppt-iframe"
        frameborder='1'>
    </iframe>
    <div
        v-else
        class="no-resource">
        <div class="no-resource-box">
            <img
                class="no-resource-pic"
                :src="imgSrc"
                alt="没有资源">
            <div class="no-resource-tip">{{defaultTxt}}</div>
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
import personalImg from '../images/bg-default-personal.png';
import marketImg from '../images/bg-default-market.png';
import companyImg from '../images/bg-default-company.png';
import { mapState } from 'vuex';
import PubSub from 'pubsub-js';
import utilJs from '../js/utils/utils';
export default {
    name: "show-ppt",
    props: {
        // ppt数据
        params: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // ppt的所说，personal：个人、company：公司、 market：市场
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            stepData: {},
            // 默认占位图片路径
            imgSrc: '',
            // 默认展示文案
            defaultTxt: ''
        }
    },
    computed: {
        ...mapState('liveRoom', ['currentStep'])
    },
    mounted() {
        this.imgSrc = this.matchImg(this.type);
        this.defaultTxt = this.matchTxt(this.type);
        this.getStepInfo();
    },
    methods: {
        // 根据当前步骤条类型请求相应数据
        getStepInfo() {
            // 组装请求参数
            let obj = JSON.parse(JSON.stringify(this.params));
            obj.materialsType = this.currentStep.materials_type;
            utilJs.getStepInfo(obj).then((data) => {
                if (data.code === 0 && data.data) {
                    let list = data.data ? data.data.list : {};
                    this.stepData = list.result.length > 0 ? list.result[0] : {};
                }
            });
        },
        // 点击完成按钮
        completeStep() {
            // 更新状态
            this.updateStep();
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
         * 根据传入的type值来匹配默认占位图
         * @param {Number} type 出入的步骤类型
         */
        matchImg(type) {
            let rel = '';
            switch (type) {
                case 1: rel = personalImg;
                    break;
                case 3: rel = companyImg;
                    break;
                case 4: rel = marketImg;
                    break;
                default: rel = personalImg;
                    break;
            }
            return rel;
        },
        /**
         * 根据传入的type值来匹配默认文案
         * @param {Number} type 出入的步骤类型
         */
        matchTxt(type) {
            let rel = '';
            switch (type) {
                case 1: rel = '暂无个人介绍';
                    break;
                case 3: rel = '暂无公司介绍';
                    break;
                case 4: rel = '暂无市场分析';
                    break;
                default: rel = '暂无介绍';
                    break;
            }
            return rel;
        }
    },
    watch: {
        // 监听传入类型
        type: {
            handler: function (val, oldval) {
                this.imgSrc = this.matchImg(this.type);
                this.defaultTxt = this.matchTxt(this.type);
            },
            deep: true
        },
        // 监听传入数据
        'currentStep.materials_type': {
            handler: function (val, oldval) {
                this.getStepInfo();
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.ppt-wrapper{
    height: 100%;
    background-color: #fff;
    .ppt-iframe{
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
