<!--
 * @author: hewei
 * @Date: 2020-11-24 10:01:46
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-20 18:20:08
 * @description: file content
-->
<template>
    <div
        class="order-transfer"
        v-loading.fullscreen.lock="loading">
        <!---面包屑--->
        <el-breadcrumb
            class="bread-crumb"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>加盟商管理</el-breadcrumb-item>
            <el-breadcrumb-item>跨公司转移订单</el-breadcrumb-item>
        </el-breadcrumb>
        <!--表单-->
        <el-form
            :model="saleForm"
            ref="saleForm"
            :rules="rules"
            label-position="right"
            label-width="180px"
            class="sale-form">
            <el-form-item
                label="选择公司："
                prop="companyId">
                <el-select
                    filterable
                    clearable
                    remote
                    v-model="saleForm.companyId"
                    @change="id => changeCompany(id, 'from')"
                    :remote-method="q => getCompanyList(q, 'from')"
                    placeholder="请选择">
                    <el-option
                        v-for="item in companyList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="选择咨询师："
                prop="consultorId">
                <el-select
                    filterable
                    clearable
                    remote
                    :remote-method="(q) => getConsultorInfo(q, 'from')"
                    v-model="saleForm.consultorId"
                    placeholder="请选择">
                    <el-option
                        v-for="item in consultList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="选择订单状态："
                prop="orderStatus">
                <el-checkbox-group v-model="saleForm.orderStatus">
                    <el-checkbox
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.value">
                        {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item
                label="接受订单的公司："
                prop="acceptCompanyId">
                <el-select
                    filterable
                    clearable
                    remote
                    :remote-method="q => getCompanyList(q, 'to')"
                    v-model="saleForm.acceptCompanyId"
                    @change="id => changeCompany(id, 'to')"
                    placeholder="请选择">
                    <el-option
                        v-for="item in toCompanyList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="选择接受订单的咨询师："
                prop="acceptConsultorId">
                <el-select
                    filterable
                    clearable
                    remote
                    :remote-method="(q) => getConsultorInfo(q, 'to')"
                    v-model="saleForm.acceptConsultorId"
                    placeholder="请选择">
                    <el-option
                        v-for="item in toConsultList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btn-box">
                <el-button
                    type="primary"
                    @click="onSubmit">确定转移以上订单</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import api from './api/transferOrder';
    import comApi from '@/api/commonApi';
    import commonApi from './api/common';
    export default {
        name: 'TransferOrder',
        data() {
            return {
                 // 加载loading
                loading: false,
                // 表单对象
                saleForm: {
                    // 公司
                    companyId: '',
                    // 咨询师
                    consultorId: '',
                    // 订单状态
                    orderStatus: [],
                    // 接受订单公司
                    acceptCompanyId: '',
                    // 接受订单的咨询师
                    acceptConsultorId: '',
                },
                // 验证规则
                rules: {
                    companyId: [{ required: true, message: '公司没有填写', trigger: 'change' }],
                    consultorId: [{ required: true, message: '咨询师没有填写', trigger: 'change' }],
                    orderStatus: [{ type: 'array', required: true, message: '订单状态没有填写', trigger: 'change' }],
                    acceptCompanyId: [{ required: true, message: '接受订单的公司没有填写', trigger: 'change' }],
                    acceptConsultorId: [{ required: true, message: '接受订单的咨询师没有填写', trigger: 'change' }]
                },
                // 咨询师下拉
                consultList: [],
                // 接受订单的咨询师下拉
                toConsultList: [],
                // 公司下拉
                companyList: [],
                // 接收公司下拉
                toCompanyList: [],
                // 状态下拉
                statusList: [],
                // 提交步骤状态标识 默认是第一步开始
                step: 1
            }
        },
        mounted() {
            // 初始化下拉数据
            this.getStatusList();
            this.getCompanyList();
            //this.getConsultorList();
        },
        methods: {
            /**
             * 公司切换获取对应员工下拉
             * @param {String} companyId 公司id
             */
            changeCompany(id, type) {
                if (type === 'from') {
                    this.saleForm.consultorId = '';
                    this.consultList = [];
                } else if (type === 'to') {
                    this.saleForm.acceptConsultorId = '';
                    this.toConsultList = [];
                }

                if(id === '') {
                    return;
                }

                this.getConsultorList(type, id);
            },
            // 提交处理
            async onSubmit() {
                try {
                    // 校验必填字段
                    const valid = await this.$refs.saleForm.validate();
                    if (!valid) {
                        return;
                    }
                    // 验证转移的公司和接受公司不能重复
                    if (this.saleForm.companyId === this.saleForm.acceptCompanyId) {
                        this.$message.warning('不能选择相同的公司');
                        return;
                    }
                    // 执行提交方法
                    this.saveData()
                } catch (error) {
                    console.warn(error);
                }
                
            },
            async saveData() {
                try {
                    if (this.loading) {
                        return;
                    }

                    this.loading = true;
                    
                    const form = this.saleForm;
                    const options = {
                        from_org: form.companyId,
                        from_employee_id: form.consultorId,
                        to_org: form.acceptCompanyId,
                        to_employee_id: form.acceptConsultorId,
                        order_status: form.orderStatus,
                        step: this.step
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.creattTransferOrder(options);
                    this.loading = false;
                    // 第一次提交通过后二次确认警告弹窗
                    if (code === 5002) {
                        this.showMessageBox(1, data.list);
                    } else if (code === 4) {
                        // 第二步提交验证通过 弹窗提示信息
                        this.showMessageBox(2, data.list);
                    } else {
                        // 其他报错信息
                        this.$message.error(msg);
                    }
                } catch (error) {
                    this.loading = false;
                    console.warn(error);
                }
            },
            /**
             * 拼接确认订单转移提示信息
             * @param {Number} step 第几部操作
             * @param {Object} data 返回的信息数据对象
             */
            showMessageBox(step, oInfo) {
                if (!step || !oInfo) {
                    return;
                }

                const orderCount = oInfo.order_num;
                const fromCompany = oInfo.from_org_name;
                const toCompany = oInfo.to_org_name;
                const fromConsultor = oInfo.from_employee_name;
                const toConsultor = oInfo.to_employee_name;

                const message = [
                    `<div>
                        <div class="title">共计${orderCount}个订单,转移信息如下：</div>
                        <div style="margin-left:20px">
                            <div>公司：【${fromCompany}】转移到【${toCompany}】</div>
                            <div>咨询师：【${fromConsultor}】转移到【${toConsultor}】</div>
                        </div>
                    </div>`,
                    `<div>
                        <div>共计${orderCount}个订单，已经转移成功，从咨询师${fromConsultor}转移给了咨询师${toConsultor}</div>
                    </div>`
                ];
                const titles = ['确认订单转移信息', '转移成功'];

                this.$confirm(message[step-1], titles[step-1], {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: step === 1,
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    if(step > 1) {
                        this.step = 1;
                        window.location.reload();
                        return;
                    }
                    // 点击确认提交操作
                    this.step++;
                    this.saveData();
                }).catch(() => {
                    this.step = 1;
                    console.log('已取消操作');        
                });
            },
            // 获取订单状态下拉
            async getStatusList() {
                try {
                    this.loading = true;
                    const {
                        data: {
                            data
                        }
                    } = await commonApi.getCompanyCommonData({
                        // 获取配置生效状态
                        type: 'transfer_order_status'
                    });
                    this.loading = false;
                    this.statusList = data.transfer_order_status || [];
                } catch (error) {
                    this.loading = false;
                    console.warn(error);
                }
            },
            // 获取公司下拉
            async getCompanyList(q, type) {
                try {
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getDepartList({
                        is_without_julive: false,
                        q
                    });
                    if (code === 0) {
                        if (type === 'from') {
                            this.companyList = data;
                        } else if (type === 'to') {
                            this.toCompanyList = data;
                        } else {
                            this.companyList = data;
                            this.toCompanyList = data;
                        }
                    }
                } catch (error) {
                    console.warn(error);
                }
            },
            getConsultorInfo(q, type) {
                let id = '';
                if (type === 'from') {
                    id = this.saleForm.companyId;
                } else if (type === 'to') {
                    id = this.saleForm.acceptCompanyId;
                }
                this.getConsultorList(type, id, q);
            },
            // 获取咨询师下拉
            async getConsultorList(type, id, q = '') {
                try {
                    const {
                        data: {
                            data
                        }
                    } = await comApi.getStaffList({
                        // 获取配置生效状态
                        org_id: id,
                        role: 'header',
                        status: 1,
                        q
                    });

                    if (type === 'from') {
                        this.consultList = data.list;
                    } else if (type === 'to') {
                        this.toConsultList = data.list;
                    }
                } catch (error) {
                    console.warn(error);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.order-transfer {
    padding: 20px 30px;
    background-color: #fff;
}
.sale-form {
    margin-top: 20px;
    padding: 40px 10px 10px;
    background-color: #fff;
}
</style>