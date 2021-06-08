<!--
  * @file 修改银行流水
  * @author xiebin
  * @updateTime 2019.10.17
 -->
<template>
    <div class="payment-information">
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item to='/payment/paymentInformation'>银行回款详情</el-breadcrumb-item>
            <el-breadcrumb-item>修改银行流水</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="bank-flow-box">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="银行名称：">
                    <el-input
                        v-model="ruleForm.bankName"
                        placeholder="请输入银行名称"
                        :disabled="isDisabledAttr('bank_name')">
                    </el-input>
                </el-form-item>
                <el-form-item label="银行流水号：">
                    <el-input
                        v-model="ruleForm.bankFlowNum"
                        placeholder="请输入银行流水号"
                        :disabled="isDisabledAttr('bank_flow_number')">
                    </el-input>
                </el-form-item>
                <el-form-item label="付款账号：">
                    <el-input
                        v-model="ruleForm.payNumberID"
                        placeholder="请输入付款账号"
                        :disabled="isDisabledAttr('payment_account')">
                    </el-input>
                </el-form-item>
                <el-form-item label="付款公司：">
                    <el-input
                        v-model="ruleForm.payCompanyName"
                        placeholder="请输入付款公司"
                        :disabled="isDisabledAttr('payment_company')">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="公司名称："
                    prop="companyNameVal">
                    <el-select
                        v-model.trim="ruleForm.companyNameVal"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入公司名称"
                        :remote-method="selectCompanyName"
                        :loading="loading"
                        @focus="selectCompanyName"
                        :disabled="isDisabledAttr('cw_company_config_id')">
                        <el-option
                            v-for="it in companyNameOptions"
                            :key="it.id"
                            :label="it.text"
                            :value="it.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="公司账号："
                    prop="companyNumberVal">
                    <el-select
                        v-model.trim="ruleForm.companyNumberVal"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入公司账号"
                        :remote-method="selectCompanyAccount"
                        :loading="loading"
                        :disabled="ruleForm.companyNameVal ? (isDisabledAttr('cw_accounts_id') ? true : false) : true"
                        @focus="selectCompanyAccount">
                        <el-option
                            v-for="it in companyNumberOpations"
                            :key="it.id"
                            :label="it.text"
                            :value="it.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                label="到账时间："
                prop="arrivalTime">
                    <el-date-picker
                        v-model="ruleForm.arrivalTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="isDisabledAttr('arrival_time')">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="到账金额："
                    prop="arrivalMoney">
                    <el-input
                        v-model="ruleForm.arrivalMoney"
                        placeholder="请输入到账金额"
                        :disabled="isDisabledAttr('arrival_money')">
                    </el-input>
                </el-form-item>
                <el-form-item class="btn-list">
                    <el-button @click="cancel">取消</el-button>
                    <el-button
                        type="primary"
                        @click="submitForm('ruleForm')">
                        保存
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import updateBankFlowApi from '../../../api/bankRepaymentApi/updateBankFlow';
export default {
    data() {
        return {
            // 公司名称列表
            companyNameOptions: [],
            // 公司账号列表
            companyNumberOpations: [],
            // loading是否显示
            loading: false,
            // 表单数据
            formListData: {},
            // 是否禁用表单输入框
            isDisabledData: [],
            ruleForm: {
                // 银行名称
                bankName: '',
                // 银行流水号
                bankFlowNum: '',
                // 付款账号
                payNumberID: '',
                // 付款公司
                payCompanyName: '',
                // 公司名称
                companyNameVal: '',
                // 公司账号
                companyNumberVal: '',
                // 到账时间
                arrivalTime: '',
                // 到账金额
                arrivalMoney: ''
            },
            rules: {
                companyNameVal: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ],
                companyNumberVal: [
                    { required: true, message: '请输入公司账号', trigger: 'blur' },
                ],
                arrivalTime: [
                    { required: true, message: '请输入到账时间', trigger: 'blur' },
                ],
                arrivalMoney: [
                    { required: true, message: '请输入到账金额', trigger: 'blur' },
                ],
            }
        }
    },
    mounted() {
        // 调用获取银行流水方法
        this.getBankFlowInfo();
    },
    methods: {
        /**
         * 保存信息
         * @params [string] formName 表单名称
         */
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let params = {
                        id: this.$route.query.flowId,
                        // 银行名称
                        bank_name: this.ruleForm.bankName,
                        // 银行流水号
                        bank_flow_number: this.ruleForm.bankFlowNum,
                        // 付款账号
                        payment_account: this.ruleForm.payNumberID,
                        // 付款公司
                        payment_company: this.ruleForm.payCompanyName,
                        // 公司名称
                        cw_company_config_id: this.ruleForm.companyNameVal,
                        // 公司账号
                        cw_accounts_id: this.ruleForm.companyNumberVal,
                        // 到账时间
                        arrival_time: this.ruleForm.arrivalTime,
                        // 到账金额
                        arrival_money: this.ruleForm.arrivalMoney
                    };
                    try {
                        let result = await updateBankFlowApi.saveBankFlowData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            setTimeout(()=>{
                                this.$router.push({
                                    path: '/payment/paymentInformation'
                                });
                            },1000)
                        }else {
                            alert(data.msg);
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                } else {
                    return false;
                }
            });
        },
        // 获取银行流水信息
        async getBankFlowInfo() {
            let params = {
                id: this.$route.query.flowId
            };
            try {
                let result = await updateBankFlowApi.getBankFlowData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.formListData = data.data;
                    // 是否禁用表单输入框
                    this.isDisabledData = this.formListData.can_edit_field;
                    // 银行名称
                    this.ruleForm.bankName = this.formListData.bank_name;
                    // 银行流水号
                    this.ruleForm.bankFlowNum = this.formListData.bank_flow_number;
                    // 付款账号
                    this.ruleForm.payNumberID = this.formListData.payment_account;
                    // 付款公司
                    this.ruleForm.payCompanyName = this.formListData.payment_company;
                    // 公司名称
                    this.companyNameOptions.push(this.assignObject(this.formListData.cw_company_config_id,this.formListData.cw_company_config_id_str));
                    if (this.companyNameOptions) {
                        this.ruleForm.companyNameVal = this.companyNameOptions[0].id;
                    }
                    // 公司账号
                    this.companyNumberOpations.push(this.assignObject(this.formListData.cw_accounts_id,this.formListData.cw_accounts_id_str));
                    if (this.companyNumberOpations) {
                        this.ruleForm.companyNumberVal = this.companyNumberOpations[0].id;
                    }
                    // 到账时间
                    this.ruleForm.arrivalTime = this.formListData.arrival_time;
                    // 到账金额
                    this.ruleForm.arrivalMoney = this.formListData.arrival_money;
                } else {
                    alert(data.msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        
        /**
         * 合并form表单数据返回的下拉框id和text
         * @params [string] id 接口返回的id
         * @params [string] text 接口返回的text
         * @return [object] 合并后的对象
         */
        assignObject(id = '', text = '') {
            return {
                id,
                text
            }
        },
        /**
         * 是否禁用表单输入框
         * @params [string] disabledText 禁用标识字符
         * @retun [boolean] 是否禁用
         */
        isDisabledAttr(disabledText) {
            if(this.isDisabledData.length > 0) {
                return !this.isDisabledData.includes(disabledText);
            }
        },
        // 取消保存
        cancel() {
            this.$router.push({
                path: '/payment/paymentInformation'
            });
        },
        /**
         * 远程搜索公司账号
         * @parmas [object] q 输入框的值 
         */
        async selectCompanyAccount(q) {
            let params;
            if (q !== "" && typeof(q) !== 'object') {
                this.loading = true;
                params = {
                    q: q,
                    companyId: this.ruleForm.companyNameVal
                };
            } else {
                this.loading = true;
                params = {
                    q: '',
                    companyId: this.ruleForm.companyNameVal
                };
            }
            try {
                let result = await updateBankFlowApi.getCompanyNumberData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.loading = false;
                    this.companyNumberOpations = data.data;
                } else {
                    this.loading = false;
                    alert (data.msg);
                }
            }
            catch(error) {
                this.loading = false;
                console.log(error);
            }
        },
        /**
         * 远程搜索公司名称
         * @parmas [object] q 输入框的值 
         */
        async selectCompanyName(q) {
            let params;
            if (q !== "" && typeof(q) !== 'object') {
                this.loading = true;
                params = {
                    q: q
                };
            } else {
                this.loading = true;
                params = {
                    q: ''
                };
            }
            try {
                let result = await updateBankFlowApi.getCompanyNameData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.loading = false;
                    this.companyNameOptions = data.data;
                } else {
                    this.loading = false;
                    alert (data.msg);
                }
            }
            catch(error) {
                this.loading = false;
                console.log(error);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.payment-information {
    padding: 0 20px;
    box-sizing: border-box;
    .bank-flow-box {
        width: 100%;
        min-height: 100px;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
        /deep/ .el-select, /deep/ .el-date-editor {
            width:100%;
        }
    }
    .btn-list {
        text-align: center;
        margin-top: 20px;
        /deep/ .el-button {
            width: 120px;
        }
    }
}
</style>