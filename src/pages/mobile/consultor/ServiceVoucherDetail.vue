<!--
    @name:服务确认单
    @description: 服务确认信息页
    @author: wangshuaixue
    @date: 2019-10-18
-->
<template>
    <div
        :class="`voucher-detail-container ${loading ? 'loading-wrap' : ''}`"
        v-loading="loading"
        element-loading-text="正在加载中">
        <div class="header-box">
            <span>
                居理买房网服务确认单
            </span>
        </div>
        <div class="content-box"
             ref="transBlob">
            <div class="text-box">
                <div class="hd">一、确认服务</div>
                <div>
                    用户接受居理买房网咨询师提供的楼盘推荐与信息咨询服务
                </div>
            </div>
            <div class="text-box">
                <div class="hd">二、居理承诺</div>
                <div>
                    红黄线管理：居理买房网对于员工有严格的管理要求，明确规定咨询师不能欺骗客户，不能对客户隐瞒实际情况，否则将面临辞退风险，确保客户体验到的是优质服务。
                </div>
                <div>
                    客户隐私保障：居理买房网绝不会泄漏客户个人信息，坚决保护客户隐私。
                </div>
                <div>
                    客户0骚扰：居理买房网绝不会违背客户意愿、不顾客户体验频繁骚扰用户，在遵从与客户意愿的前提下进行服务。
                </div>
                <div>
                    坚持客户第一：居理买房网所有服务均以客户需求和体验出发，绝不恶意引导客户选择或购买不适合的项目。
                </div>
                <div>
                    以上承诺均欢迎用户监督，如遇违背以上承诺的居理行为，欢迎提建议甚至投诉。
                </div>
            </div>
            <div class="text-box">
                <div class="hd">三、温馨提示</div>
                <div>
                    房产市场受国家政策、供需关系、金融市场等的影响，具备一定不可预判性，可能对您的购房决策产生影响。同时，政府的规划以官网为准，即使官网信息也存在调整的可能性，请您随时关注，以平常心对待。
                </div>
                <div>
                    买房通常为“一房一价”，房屋价格会随房地产市场的变化而波动，后期房价的涨落属于正常情况，请您不要慌张。
                </div>
                <div>
                    房源会随时变动，如果遇到合适房源可尽快决定，以免错过优质房源。但购房是大事，需要综合考虑各方因素，请与家人充分沟通后再做选择。
                </div>
                <div>
                    在重要的购房节点——认购和签约环节中，通常情况购房定金是不予退还的，除非不可抗性因素，所以在与房地产商签订认购书前，需要谨慎考虑再做决定。（出现过少数客户由于主、客观因素无法继续购房，导致定金损失的情况。）
                </div>
                <div>
                    在购房过程中可能遇到相关人员，为促成交易提供一些非法帮助，请不要轻信他人并时刻牢记遵纪守法，资金财产才能得到保障。
                </div>
                <div>
                    购房过程中，相关人员提供的贷款建议（商贷、公积金、组合贷）仅供参考，建议根据自身情况选择合适的贷款方式，减少不必要的购房成本。
                </div>
                <div>
                    如与房地产商发生购房纠纷，居理作为第三方服务平台，将坚定地站在客户立场，竭尽全力协助客户去处理相关事宜，但无法直接参与房产交易，所以更重要的是需要当事人积极主动去维权，以乐观的心态面对，理智地解决问题。
                </div>
                <div>
                    如果上述内容咨询师已讲述清楚，为帮助我们对咨询师进行监督和管理，请您确认无误后再签字
                </div>
            </div>
        </div>
        <div class="coty-dom"></div>
        <div class="btn-login">
            <span @click="skipUserSign">
                邀请客户签字确认
            </span>
        </div>
    </div>
</template>

<script>
import 'lib-flexible';
import html2canvas from 'html2canvas';
import dataStorage from '@/assets/js/utils/dataStorage';

export default {
    name: 'service-voucher-detail',
    data() {
        return {
            // 页面加载
            loading: false
        };
    },
    methods: {
        // 跳转到客户签字页面
        skipUserSign() {
            this.loading = true;
            let h = this.$refs.transBlob.clientHeight;
            var content = document.querySelector('.content-box');
            var copyDom = content.cloneNode(true);
            copyDom.className += ' voucher-detail-copy-dom'
            copyDom.style.height = (h-100)+'px';
            copyDom.style.position = "absolute";
            copyDom.style.backgroundColor = 'white';
            copyDom.style.zIndex = '-1';
            document.body.appendChild(copyDom);

            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            setTimeout(()=>{
                html2canvas(document.querySelector('.voucher-detail-copy-dom')).then((canvas) => {
                    dataStorage.setStorage('affirm', canvas.toDataURL('image/png'))
                    document.body.removeChild(copyDom);
                    this.$router.push({path: 'userSign'});
                    this.loading = false;
                });
            },100)
        }
    }
};
</script>


<style lang="less">
@white_color: #fff;
@bule_color: #33a1ff;
@gray_color: #3e4a59;
.voucher-detail-copy-dom {
    padding: 0 0.533333rem 0;
    background-color: #fff;
    .text-box {
        margin-bottom: 0.533333rem;
        > div {
            font-family: PingFangSC-Regular;
            font-size: 0.373333rem;
            text-align: justify;
            color: @gray_color;
        }
        .hd {
            font-size: 0.4rem;
            margin-bottom: 0.266667rem;
            font-family: PingFangSC-Medium;
            font-weight: bold;
        }
    }
}
</style>
<style lang="less" scoped>
@white_color: #fff;
@bule_color: #33a1ff;
@gray_color: #3e4a59;

.voucher-detail-container {
    background-color: @white_color;
    &.loading-wrap{
        height: 100%;
        overflow: hidden;
    }
    .header-box {
        position: fixed;
        text-align: center;
        background-color: @bule_color;
        width: 100%;
        height: 0.9rem;
        color: @white_color;
        padding-top: 0.266667rem;
        font-size: 0.48rem;
        z-index: 1;
        .iconfont {
            position: absolute;
            left: 0.533333rem;
            font-size: 0.6rem;
        }
    }
    .content-box {
        padding: 1.6rem 0.533333rem 1.5rem;
        // padding: 0 0.533333rem 0;
        background-color: #fff;
        .text-box {
            margin-bottom: 0.533333rem;
            > div {
                font-family: PingFangSC-Regular;
                font-size: 0.373333rem;
                text-align: justify;
                color: @gray_color;
            }
            .hd {
                font-size: 0.4rem;
                margin-bottom: 0.266667rem;
                font-family: PingFangSC-Medium;
                font-weight: bold;
            }
        }
    }
}
.btn-login {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0.266667rem 1.333333rem;
    background: @white_color;
    box-shadow: 0 -2px 4px 0 rgba(222, 222, 222, 0.5);
    > span {
        display: inline-block;
        height: 1.173333rem;
        line-height: 1.23rem;
        width: 100%;
        border-radius: 1.333333rem;
        background-color: @bule_color;
        text-align: center;
        font-size: 0.426667rem;
        color: @white_color;
    }
}
</style>
