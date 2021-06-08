<!--
 * @Name: 客户需求模块
 * @author: xiejiaxin
 * @Date: 2020-03-02
 -->
 <template>
 <div class="process-detail-wrapper">
     <div class="hd">您的需房需求</div>
     <div class="bd">
        <div class="material-list-box">
            <div class="customer-need-box">
                <div>
                    <table class="table">
                        <thead class="head">
                            <tr>
                                <th class="title">客户需求</th>
                                <th class="con require">填写信息</th>
                                <th class="swith">是否确认</th>
                            </tr>
                        </thead>
                        <tbody
                            class="body"
                            v-if="userRequire"
                        >
                            <tr v-if="totalPrice && userRequire.total_price">
                                <td class="title">总价预算</td>
                                <td class="con">
                                    <div class="min-item">
                                        <jl-number-input
                                            reg="number"
                                            v-model="totalPrice.value_min"
                                        ></jl-number-input>
                                        <span class="input-unit">万</span>
                                    </div>
                                    <div
                                        class="line"
                                        v-if="totalPrice ? totalPrice.isMore : false"
                                    ></div>
                                    <div
                                        class="max-item"
                                        v-if="totalPrice ? totalPrice.isMore : false">
                                        <jl-number-input
                                            reg="number"
                                            v-model="totalPrice.value_max"
                                        ></jl-number-input>
                                        <span class="input-unit">万</span>
                                    </div>
                                    <div
                                        class="unit-operate"
                                        v-if="totalPrice"
                                        @click="changeArea(totalPrice, 'value_max')"
                                    >{{checkarea(totalPrice.isMore)}}</div>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.total_price"
                                        v-model="userRequire.total_price.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                            <tr v-if="firstPrice && userRequire.first_price">
                                <td class="title">首付预算</td>
                                <td class="con">
                                    <div class="min-item">
                                        <jl-number-input
                                            reg="number"
                                            v-model="firstPrice.value_min"
                                        ></jl-number-input>
                                        <span class="input-unit">万</span>
                                    </div>
                                    <div
                                        class="line"
                                        v-if="firstPrice ? firstPrice.isMore : false"
                                    ></div>
                                    <div
                                        class="max-item"
                                        v-if="firstPrice ? firstPrice.isMore : false"
                                    >
                                        <jl-number-input
                                            reg="number"
                                            v-model="firstPrice.value_max"
                                        ></jl-number-input>
                                        <span class="input-unit">万</span>
                                    </div>
                                    <div
                                        class="unit-operate"
                                        v-if="firstPrice"
                                        @click="changeArea(firstPrice, 'value_max')"
                                    >{{checkarea(firstPrice.isMore)}}</div>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.first_price"
                                        v-model="userRequire.first_price.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                            <tr v-if="acreage && userRequire.acreage">
                                <td class="title">面积</td>
                                <td class="con">
                                    <div class="min-item area-min-item">
                                        <jl-number-input
                                            reg="number"
                                            v-model="acreage.value_min"
                                        ></jl-number-input>
                                        <span class="input-unit">平米</span>
                                    </div>
                                    <div
                                        class="line"
                                        v-if="acreage ? acreage.isMore : false"
                                    ></div>
                                    <div
                                        class="max-item area-max-item"
                                        v-if="acreage ? acreage.isMore : false">
                                        <jl-number-input
                                            reg="number"
                                            v-model="acreage.value_max"
                                        ></jl-number-input>
                                        <span class="input-unit">平米</span>
                                    </div>
                                    <div
                                        class="unit-operate area-unit-operate"
                                        v-if="acreage"
                                        @click="changeArea(acreage, 'value_max')"
                                    >{{checkarea(acreage.isMore)}}</div>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.acreage"
                                        v-model="userRequire.acreage.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                            <tr v-if="userRequire.project_type">
                                <td class="title">业态</td>
                                <td class="con">
                                    <el-radio-group v-model="userRequire.project_type.value">
                                        <el-radio
                                            :label="projectType.value"
                                            v-for="(projectType, index) in typeList"
                                            :key="'projectType' + index"
                                        >{{projectType.name}}</el-radio>
                                    </el-radio-group>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.project_type"
                                        v-model="userRequire.project_type.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                            <tr v-if="userRequire.qualifications">
                                <td class="title">购房资质</td>
                                <td class="con">
                                    <el-radio-group v-model="userRequire.qualifications.value">
                                        <el-radio
                                            :label="qualification.value"
                                            v-for="(qualification, index) in qualificationList"
                                            :key="'qualification-' + index"
                                        >{{qualification.name}}</el-radio>
                                    </el-radio-group>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.qualifications"
                                        v-model="userRequire.qualifications.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                            <tr v-if="userRequire.house_type">
                                <td class="title">户型</td>
                                <td class="con">
                                    <el-checkbox-group v-model="userRequire.house_type.value">
                                        <el-checkbox
                                            :label="houseType.value"
                                            v-for="(houseType, index) in houseTypeList"
                                            :key="'houseType-' + index"
                                        >{{houseType.name}}</el-checkbox>
                                    </el-checkbox-group>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.house_type"
                                        v-model="userRequire.house_type.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                            <tr v-if="userRequire.purchase_purpose">
                                <td class="title">购房目的</td>
                                <td class="con">
                                    <el-radio-group v-model="userRequire.purchase_purpose.value">
                                        <el-radio
                                            :label="purchase.value"
                                            v-for="(purchase, index) in purchaseList"
                                            :key="'purchase-' + index"
                                        >{{purchase.name}}</el-radio>
                                    </el-radio-group>
                                </td>
                                <td class="swith">
                                    <el-radio-group
                                        v-if="userRequire.purchase_purpose"
                                        v-model="userRequire.purchase_purpose.is_show">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
    import { commonFun } from '@/assets/js/utils/utils';
    import { mapState } from 'vuex';
    import PubSub from 'pubsub-js';
    import api from '../api/shareMaterialApi';
    import utilJs from '../js/utils/utils';
    export default {
        name: 'user-require',
        // 模块数据
        props: {
            params: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请填写手机号'));
                }
                callback();
            };
            return {
                requireForm: {
                    totalPrice: {
                        value_min: ''
                    }
                },
                rules: {
                    'totalPrice.value_min': [
                        {required: false, validator: checkPhone, trigger: 'blur'}
                    ]
                },
                // 客户需求
                userRequire: {},
                // 业态
                typeList: [],
                // 户型
                houseTypeList: [],
                // 购房目的
                purchaseList: [],
                // 购房资质
                qualificationList: [],
                // 总价
                totalPrice: {},
                // 首付
                firstPrice: {},
                // 面积
                acreage: {},
                checked: false,
                stepData: {}
            };
        },
        mounted() {
            PubSub.subscribe('draft', (msg, data) => {
                if (data.type === '5') {
                    this.draftInfo.require = this.userRequire;
                    this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
                }
            });
            this.getStepInfo();
        },
        computed: {
            ...mapState('liveRoom', ['currentStep', 'draftInfo', 'personObj', 'orderId']),
            ...mapState(['trackCommon'])
        },
        methods: {
            /**
             * 根据当前步骤条类型请求相应数据
             */
            getStepInfo() {
                // 组装请求参数
                let obj = JSON.parse(JSON.stringify(this.params));
                obj.materialsType = this.currentStep.materials_type;
                utilJs.getStepInfo(obj).then((data) => {
                    if (data && data.code === 0) {
                        let list = data.data ? data.data.list : {};
                        // 如果有草稿，则使用草稿内容
                        let isBelong = this.personObj.employee_id === this.personObj.login_employee_id;
                        if (JSON.stringify(this.draftInfo.require) !== '{}' && isBelong) {
                            let rel = list.result;
                            this.stepData = list;
                            if (rel) {
                                this.stepData.result.require = this.draftInfo.require;
                            this.getInitData('update');
                            }
                        } else {
                            this.stepData = list;
                            this.getInitData();
                        }
                    }
                });
            },
            // 点击完成按钮
            completeStep() {
                // 如果当前不是所属咨询师就进行校验
                let belongFlag = this.personObj.employee_id === this.personObj.login_employee_id;
                if (belongFlag) {
                    // 进行校验
                    this.requireValidate();
                } else {
                    this.updateUserRequire();
                }
            },
            // 客户需求表单校验
            requireValidate() {
                let sum = this.userRequire;
                let opt = 0;
                let successOpt = 0;
                // 判断是否确认按钮都已经选择
                let isConfirm = true;
                for (let i in sum) {
                    if (sum[i].is_show === '') {
                        isConfirm = false;
                        break;
                    }
                }
                // 是否按钮都已经选择的情况下，判断是否填写完整
                for (let i in sum) {
                    if (sum[i].is_show == 0) {
                        opt++
                        if (i == 'total_price' || i == 'first_price' || i == 'acreage') {
                            if (sum[i].isMore) {
                                if (sum[i].value_max != '' && sum[i].value_min != '') {
                                    successOpt++
                                }
                            } else {
                                if (sum[i].value_min != '') {
                                    successOpt++
                                }
                            }
                        } else if (sum[i].value != '') {
                            successOpt++
                        }
                    }
                }
                if (opt == successOpt && isConfirm) {
                    // 更新用户需求
                    this.updateUserRequire();
                } else {
                    this.$message.error('请与客户确认需求后进入下一环节');
                }
            },
            // 请求更新用户需求接口
            async updateUserRequire() {
                try {
                    // 合并数据，因为接口给我的被我过滤了一遍
                    let userRe = JSON.parse(JSON.stringify(this.allRequre));
                    let newRequire = Object.assign(userRe, this.userRequire);
                    let params = {
                        order_require: newRequire,
                        room_id: this.params.roomId,
                        see_project_id: this.params.seeProId
                    };
                    let result = await api.saveUserRequire(params);
                    let {data} = result;
                    if (data.code === 0) {
                        // 更新vuex
                        this.draftInfo.require = {};
                        this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
                        // 更新状态
                        this.updateStep();
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 请求开始计时和结束计时
            updateStep() {
                if (this.currentStep.status !== '3') {
                    let obj = JSON.parse(JSON.stringify(this.params));
                    obj.materialsType = this.currentStep.materials_type;
                    obj.status = '3';
                    utilJs.updateStep(obj).then((data) => {
                        if (data.code === 0) {
                            // 埋点
                            this.requireTrack();
                            // 更新状态
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
                    // 埋点
                    this.requireTrack();
                    PubSub.publish('changeCurrentStep', {type: 'next'});
                }
            },
            // 用户需求完成埋点
            requireTrack() {
                // 组装埋点
                let downPay = '';
                if (this.userRequire.first_price && this.firstPrice.isMore) {
                    downPay = this.userRequire.first_price.value_min + ',' + this.userRequire.first_price.value_max;
                } else if (this.userRequire.first_price && !this.firstPrice.isMore) {
                    downPay = this.userRequire.first_price.value_min;
                }
                let totalPay = '';
                if (this.userRequire.total_price && this.totalPrice.isMore) {
                    totalPay = this.userRequire.total_price.value_min + ',' + this.userRequire.total_price.value_max;
                } else if (this.userRequire.total_price && !this.totalPrice.isMore) {
                    totalPay = this.userRequire.total_price.value_min;
                }
                let acreagePay = '';
                if (this.userRequire.acreage && this.acreage.isMore) {
                    acreagePay = this.userRequire.acreage.value_min + ',' + this.userRequire.acreage.value_max;
                } else if (this.userRequire.acreage && !this.acreage.isMore) {
                    acreagePay = this.userRequire.acreage.value_min;
                }
                let obj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id,
                    tag_type: this.currentStep.materials_type,
                    down_payment_budget: downPay,
                    total_budget: totalPay,
                    input_proportion: acreagePay,
                    project_type: this.userRequire.project_type ? [this.userRequire.project_type.value] : [],
                    purchase_qualification: this.userRequire.qualifications ? this.userRequire.qualifications.value : '',
                    house_type: this.userRequire.house_type ? this.userRequire.house_type.value : [],
                    purchase_purpose: this.userRequire.purchase_purpose ? this.userRequire.purchase_purpose.value : ''
                };
                commonFun.setTrackNew('7201', obj);
            },
            // 点击添加范围或者是取消范围
            changeArea(para, paraMax) {
                para.isMore = !para.isMore
                this.$set(para, paraMax, '')
            },
            // 判断是添加范围还是取消范围
            checkarea(para) {
                let res = '添加范围'
                if (para) {
                    res = '取消范围'
                }
                return res
            },
            /**
             * 初始化客户需求数据
             * @param {String} type update：前端存了默认值
             */
            getInitData (type) {
                 // 客户需求
                let data = this.stepData.result;
                // this.userRequire = data.require;
                this.allRequre = JSON.parse(JSON.stringify(data.require));
                if (!data || !this.allRequre) {
                    return;
                }
                if (type !== 'update') {
                    // 组装数据，因为在准备环境选择了不展示的话，前端需要过滤掉为否的
                    let obj = {};
                    // 删除is_show为1的需要字段
                    for (let key in this.allRequre) {
                        if (!this.currentStep.time) {
                            if (this.allRequre[key].is_show !== '1') {
                                obj[key] = this.allRequre[key];
                                // 清空已经选择的是否确认选项
                                obj[key].is_show = '';
                            }
                        } else {
                            obj[key] = this.allRequre[key];
                        }
                    }
                    this.userRequire = JSON.parse(JSON.stringify(obj));
                    // 单独对首付、总价和面积处理
                    this.totalPrice = this.userRequire ? this.userRequire.total_price : '';
                    this.firstPrice = this.userRequire ? this.userRequire.first_price : '';
                    this.acreage = this.userRequire ? this.userRequire.acreage : '';
                    // 前端存储了默认值
                    if (this.userRequire.total_price) {
                        this.$set(this.totalPrice, 'isMore', true);
                        if (this.totalPrice.value_max !== '' && this.totalPrice.value_max !== null && this.totalPrice.value_min !== '' && this.totalPrice.value_min !== null && (this.totalPrice.value_max != this.totalPrice.value_min)) {
                            // 判断最大值和最小值都有值并且不是null
                            this.totalPrice.isMore = true;
                            // 统一首付和总价单位为万
                            this.totalPrice.value_min = this.totalPrice.value_min / 10000;
                            this.totalPrice.value_max = this.totalPrice.value_max / 10000;
                        } else {
                            this.totalPrice.isMore = false;
                            // 不显示范围，最大值置空
                            this.totalPrice.value_max = '';
                            if (this.totalPrice.value_min !== '' && this.totalPrice.value_min !== null) {
                                // 统一首付和总价单位为万
                                this.totalPrice.value_min = this.totalPrice.value_min / 10000;
                            }
                        }
                    }
                    if (this.userRequire.first_price) {
                        this.$set(this.firstPrice, 'isMore', true);
                        // 首付
                        if (this.firstPrice.value_max !== '' && this.firstPrice.value_max !== null && this.firstPrice.value_min !== '' && this.firstPrice.value_min !== null && (this.firstPrice.value_max != this.firstPrice.value_min)) {
                            // 判断最大值和最小值都有值并且不是null
                            this.firstPrice.isMore = true;
                            // 统一首付和总价单位为万
                            this.firstPrice.value_min = this.firstPrice.value_min / 10000;
                            this.firstPrice.value_max = this.firstPrice.value_max / 10000;
                        } else {
                            this.firstPrice.isMore = false;
                            // 不显示范围，最大值置空
                            this.firstPrice.value_max = ''
                            if (this.firstPrice.value_min !== '' && this.firstPrice.value_min !== null) {
                                // 统一首付和总价单位为万
                                this.firstPrice.value_min = this.firstPrice.value_min / 10000;
                            }
                        }
                    }
                    if (this.userRequire.acreage) {
                        this.$set(this.acreage, 'isMore', true);
                        // 面积
                        if (this.acreage.value_max !== '' && this.acreage.value_max !== null && this.acreage.value_min !== '' && this.acreage.value_min !== null && (this.acreage.value_max != this.acreage.value_min)) {
                            // 判断最大值和最小值都有值并且不是null
                            this.acreage.isMore = true
                        } else {
                            this.acreage.isMore = false
                            // 不显示范围，最大值置空
                            this.acreage.value_max = ''
                        }
                    }
                } else {
                    this.userRequire = JSON.parse(JSON.stringify(this.allRequre));
                    // 单独对首付、总价和面积处理
                    this.totalPrice = this.userRequire ? this.userRequire.total_price : '';
                    this.firstPrice = this.userRequire ? this.userRequire.first_price : '';
                    this.acreage = this.userRequire ? this.userRequire.acreage : '';
                }
                // 用户需求，判断是否展示范围值
                this.houseTypeList = data.require_default ? data.require_default.house_type : [];
                this.typeList = data.require_default ? data.require_default.require_project_type : [];
                this.purchaseList = data.require_default ? data.require_default.purchase_purpose : [];
                this.qualificationList = data.require_default ? data.require_default.qualifications : [];
            }
        },
        watch: {
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
}
.material-list-box {
    font-family: PingFangSC-Regular,PingFang SC;
    .customer-need-box {
        .table {
            width: 100%;
            background-color: #fff;
            .title {
                min-width: 119px;
                color: #888;
            }
            .con {
                min-width: 380px;
            }
            .con, .swith {
                /deep/.el-radio-group {
                    .el-radio {
                        margin-right: 16px;
                        font-weight: normal;
                        &:last-of-type {
                            margin-right: 0;
                        }
                    }
                    .el-radio__label {
                        padding-left: 8px;
                        font-size: 12px !important;
                        color: #333;
                    }
                }
                /deep/.el-checkbox-group {
                    .el-checkbox {
                        margin-right: 16px;
                        font-weight: normal;
                        &:last-of-type {
                            margin-right: 0;
                        }
                    }
                    .el-checkbox__label {
                        padding-left: 8px;
                        font-size: 12px;
                        color: #333;
                    }
                }
                > div {
                    float: left;
                }
                .line {
                    float: left;
                    height: 0;
                    width: 6px;
                    border-bottom: 1px solid #ccc;
                    margin: 15px 10px 0 0;
                }
                .min-item,
                .max-item {
                    width: 74px;
                    /deep/.el-input {
                        width: 52px;
                        float: left;
                        .el-input__inner {
                            height: 30px;
                            line-height: 30px;
                            font-size: 12px;
                            color: #333;
                            padding: 0 6px;
                            box-sizing: border-box;
                            border-radius: 0;
                            border-color: #ddd;
                        }
                    }
                    .input-unit {
                        float: left;
                        font-size: 12px;
                        color: #333;
                        line-height: 30px;
                        margin-left: 10px;
                    }
                }
                .area-min-item {
                    width: 86px;
                }
                .min-item {
                    margin-right: 10px;
                }
                .max-item {
                    margin-right: 21px;
                }
                .area-max-item {
                    width: 86px;
                    margin-right: 11px;
                }
                .unit-operate {
                    float: left;
                    margin-left: 19px;
                    line-height: 30px;
                    font-size: 12px;
                    color: #2776EF;
                    cursor: pointer;
                }
                .area-unit-operate {
                    margin-left: 6px;
                }
            }
            > .head {
                color: #3e4a59;
                background-color: #f7f8fb;
                border: 1px solid #eee;
                th {
                    height: 54px;
                    text-align: left;
                    box-sizing: border-box;
                    padding: 0 13px;
                    box-sizing: border-box;
                    font-size: 14px;
                    color: #222;
                    font-family:PingFangSC-Medium,PingFang SC;
                    border-right: 1px solid #eee;
                    &.swith {
                        min-width: 124px;
                        text-align: center;
                    }
                }
            }
            > .body {
                font-size: 12px;
                color: #333;
                border-left: 1px solid #eee;
                td {
                    box-sizing: border-box;
                    padding: 10px 13px;
                    height: 50px;
                    word-wrap: break-word;
                    word-break: break-all;
                    border-right: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                    &.swith {
                        padding: 10px 20px;
                        text-align: center;
                    }
                    &.con {
                        padding: 10px 20px;
                    }
                }
            }
            /deep/.el-radio__input.is-checked .el-radio__inner, /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
                background-color: #2776EF;
                border-color: #2776EF;
            }
        }
        // /deep/.el-switch__label--right.is-active {
        //     z-index: 1111;
        //     color: #fff !important;
        // }
        // /deep/.el-switch__label--left.is-active {
        //     z-index: 1111;
        //     color: #fff !important;
        // }
        // /deep/.el-switch__core:after {
        //     top: 2px;
        // }
        // /deep/.el-switch__label--left {
        //     position: relative;
        //     left: 46px;
        //     color: #fff;
        //     z-index: -1111;
        // }
        // /deep/.el-switch__label--right {
        //     position: relative;
        //     right: 46px;
        //     color: #fff;
        //     z-index: -1111;
        // }
        // /deep/.el-switch__core {
        //     height: 22px !important;
        //     line-height: 22px !important;
        //     width: 46px !important;
        //     border-radius: 15px !important;
        // }
    }
    /deep/.el-form--inline {
        .customer-need-box {
            .el-form-item {
                width: 100%;
                height: 100%;
                margin: 0;
                .el-form-item__content {
                    height: 100%;
                    line-height: 1;
                    width: 100%;
                    font-size: 12px;
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

