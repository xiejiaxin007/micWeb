<!--
 * @author: kangxue
 * @Date: 2020-07-10 14:17:01
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-30 11:10:47
 * @description: 新建客诉问题
-->
<template>
    <div class="container-box"
        v-loading="loading">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/complaint/complaintList' }">客诉问题管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name === 'editComplaint' ? '编辑' : '新增'}}客诉问题</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box form-box">
            <div class="main-title">{{$route.name === 'editComplaint' ? '编辑' : '新增'}}客诉问题</div>
            <el-form ref="form"
                :model="form"
                :rules="rules"
                label-width="150px">
                <el-form-item label="投诉类型"
                    prop="complainType">
                    <el-select v-model="form.complainType"
                        placeholder="请选择投诉类型"
                        :disabled="$route.name === 'editComplaint'"
                        @change="changeComplainType">
                        <el-option v-for="item in complainTypeArr"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item ref="orderId"
                    :class="checkComplainType ? 'is-required' : ''"
                    label="订单ID"
                    prop="orderId">
                    <el-input class="input-width"
                        placeholder="请输入订单ID"
                        v-model="form.orderId"
                        @change="getConsultor"
                        @input.native="fixOrderId($event)"></el-input>
                </el-form-item>
                <el-form-item label="城市"
                    prop="city">
                    <!-- 没有使用@input方式是因为编辑初始化赋值会触发方法进而获取咨询师绩效上级等值覆盖 -->
                    <search-select-radio v-model="form.city"
                        class="input-width"
                        placeholder="请选择城市"
                        :apiInfo="cityApi"
                        :chosenObj="chosenCity"
                        @getOption="changeCity"></search-select-radio>
                </el-form-item>
                <el-form-item label="客户姓名"
                    prop="name">
                    <el-input class="input-width"
                        placeholder="请输入客户姓名"
                        v-model="form.name"
                        maxlength="60"></el-input>
                </el-form-item>
                <el-form-item label="客户电话"
                    prop="phone">
                    <el-input class="input-width"
                        placeholder="请输入客户电话"
                        v-model="form.phone"
                        maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="客户投诉时间"
                    prop="complainTime">
                    <el-date-picker v-model="form.complainTime"
                        type="date"
                        placeholder="选择客户投诉时间"
                        value-format="timestamp"
                        :picker-options="pickerOptionsBefore">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="客诉来源"
                    prop="source">
                    <el-select v-model="form.source"
                        placeholder="请选择客诉来源">
                        <el-option v-for="item in sourceOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="投诉对象及原因"
                    prop="reason">
                    <el-cascader v-model="form.reason"
                        placeholder="请选择投诉对象及原因"
                        class="reason-width"
                        :options="reasonOptions"
                        separator=" > "
                        :props="{ checkStrictly: true, label: 'name' }"
                        clearable></el-cascader>
                </el-form-item>
                <el-form-item v-if="checkComplainType"
                    label="是否万单问题"
                    prop="isOrderQuestion">
                    <el-select v-model="form.isOrderQuestion"
                        placeholder="请选择是否万单问题">
                        <el-option v-for="item in questionOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户反馈内容"
                    prop="feedback">
                    <el-input type="textarea"
                        placeholder="请输入客户反馈内容，最多300字，超出无法输入"
                        v-model="form.feedback"
                        maxlength="300"
                        rows="3"></el-input>
                </el-form-item>
                <!-- 投诉类型选择是以下这几项：投诉、售后、更换咨询师、客户异议、修改评价 时展示 -->
                <el-form-item v-if="checkComplainType"
                    label="咨询师"
                    prop="consultor">
                    <search-select-radio v-model="form.consultor"
                        class="input-width"
                        placeholder="请选择咨询师"
                        :apiInfo="userApi"
                        :chosenObj="chosenConsultor"
                        @getOption="changeConsultor"></search-select-radio>
                </el-form-item>
                <el-form-item v-if="checkComplainType"
                    label="绩效责任上级"
                    prop="dutySuper">
                    <search-select-radio v-model="form.dutySuper"
                        class="input-width"
                        placeholder="请选择绩效责任上级"
                        :apiInfo="userApi"
                        :chosenObj="chosenDutySuper"></search-select-radio>
                </el-form-item>
                <el-form-item v-if="checkComplainType"
                    label="要求联系时间"
                    prop="contactTime">
                    <el-date-picker v-model="form.contactTime"
                        type="datetime"
                        placeholder="选择要求联系时间"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptionsAfter">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="转交人员"
                    prop="deliver">
                    <el-select v-model="form.deliver"
                        disabled>
                        <el-option v-for="item in deliverOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isQuality"
                    label="服管处理建议"
                    prop="suggest"
                    class="form-item-margin">
                    <el-input type="textarea"
                        placeholder="请输入服管处理建议，最多300字，超出无法输入"
                        v-model="form.suggest"
                        maxlength="300"
                        rows="3"></el-input>
                </el-form-item>
                <el-form-item label="客诉材料"
                    prop="material"
                    class="is-required"
                    ref="material">
                    <upload-material :imgList="form.imgList"
                        :audioList="form.audioList"
                        @getMaterial="getMaterial"></upload-material>
                </el-form-item>
            </el-form>
        </div>
        <!-- 编辑展示跟进详情 -->
        <follow-list v-if="id"
            :followId="id"></follow-list>
        <!-- 操作按钮 -->
        <btn-opts ref="btnOpts"
            :btns="initButtons"
            :isEdit="true"
            :options="formOptions"
            @save="save('0')"
            @reload="reload"></btn-opts>
        <!-- 二次确认弹层 -->
        <confirm-dialog :content="dialog.content"
            confirmBtn="继续"
            :visible="dialog.visible"
            @cancel="cancelAlert"
            @confirm="confirmAlert"></confirm-dialog>
        <!-- 当前创建任务时，自动选中的转交人，在保存之前操作了暂定任务跟进，提示 -->
        <alert-dialog
            :visible.sync="alertVisible"
            confirmBtn="我知道了"
            @confirm="getDeliver(1)">
            <div>当前选择的转交人已暂停任务分配，无法正常创建任务，系统将重新为您获取转交人！</div>
        </alert-dialog>
    </div>
</template>

<script>
import commonApi from '@/api/commonApi';
import api from './api/complaint';
import { SearchSelectRadio, AudioPlay } from '@/components';
import FollowList from './components/FollowList';
import BtnOpts from './components/BtnOpts';
import UploadMaterial from './components/UploadMaterial';
import { ConfirmDialog, AlertDialog } from '@/components';
// 投诉类型【投诉、售后、更换咨询师、客户异议、修改评价】组成的数组
const typeArr = ['1', '2', '3', '4', '5'];
export default {
    components: {
        SearchSelectRadio,
        AudioPlay,
        FollowList,
        BtnOpts,
        UploadMaterial,
        ConfirmDialog,
        AlertDialog
    },
    data() {
        // 投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时  订单ID，咨询师，绩效责任上级，要求联系时间必填
        let isRequired = (rule, value, callback) => {
            if (this.checkComplainType && value === '') {
                callback(new Error());
            } else {
                callback();
            }
        };
        // 要求联系时间要大于当前时间，点击选中有个时间差，就加了1s
        let validateTime = (rule, value, callback) => {
            if (value + 1000 <= Date.now()) {
                callback(new Error());
            } else {
                callback();
            }
        };
        // 客诉材料不能为空，最少上传附件或录音其中一种
        let fileRequired = (rule, value, callback) => {
            if (this.form.imgList.length === 0 && this.form.audioList.length === 0) {
                callback(new Error());
            } else {
                callback();
            }
        };
        return {
            // 编辑ID，创建无id
            id: this.$route.query.id,
            // 表单数据
            form: {
                // 投诉类型
                complainType: '',
                // 订单ID
                orderId: '',
                // 城市
                city: '',
                // 客户姓名
                name: '',
                // 客户电话
                phone: '',
                // 客户投诉时间
                complainTime: '',
                // 客诉来源
                source: '',
                // 投诉对象及原因
                reason: [],
                // 是否万单问题
                isOrderQuestion: '',
                // 客户反馈内容
                feedback: '',
                // 咨询师
                consultor: '',
                // 绩效责任上级
                dutySuper: '',
                // 要求联系时间
                contactTime: '',
                // 转交人员
                deliver: '',
                // 客诉材料-图片
                imgList: [],
                // 客诉材料-音频
                audioList: [],
                // 后端分配用，获取转交人时同时获取到的
                businessId: '',
                // 服管处理建议
                suggest: ''
            },
            // 表单验证规则
            rules: {
                // 投诉类型
                complainType: [{ required: true, message: '投诉类型不能为空', trigger: 'change' }],
                // 订单ID  投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时必填
                orderId: [{ validator: isRequired, message: '订单ID不能为空', trigger: 'blur' }],
                // 城市
                city: [{ required: true, message: '城市不能为空', trigger: 'change' }],
                // 客户姓名
                name: [
                    { required: true, message: '客户姓名不能为空', trigger: 'blur' },
                    { pattern: /^[A-Za-z\u4e00-\u9fa5]+$/g, message: '客户姓名只允许输入入汉字，大小写字母', trigger: 'change' }
                ],
                // 客户电话
                phone: [
                    { required: true, message: '客户电话不能为空', trigger: 'blur' },
                    { pattern: /^1\d{10}$/, message: '请输入正确客户电话', trigger: 'change' }
                ],
                // 客户投诉时间
                complainTime: [{ required: true, message: '客户投诉时间不能为空', trigger: 'change' }],
                // 客诉来源
                source: [{ required: true, message: '投诉来源不能为空', trigger: 'change' }],
                // 是否万单问题  投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时必填
                isOrderQuestion: [{ required: true, message: '是否万单问题不能为空', trigger: 'change' }],
                // 客户反馈内容
                feedback: [{ required: true, message: '客户反馈内容不能为空', trigger: 'blur' }],
                // 咨询师  投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时必填
                consultor: [{ required: true, message: '咨询师不能为空', trigger: 'change' }],
                // 绩效责任上级  投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时必填
                dutySuper: [{ required: true, message: '绩效责任上级不能为空', trigger: 'change' }],
                // 要求联系时间  投诉类型选择投诉、售后、更换咨询师、客户异议、修改评价时必填
                contactTime: [
                    { required: true, message: '要求联系时间不能为空', trigger: 'change' },
                    { validator: validateTime, message: '要求联系时间必须大于当前时间！', trigger: 'change' }
                ],
                // 转交人员
                deliver: [{ required: true, message: '转交人员不能为空', trigger: 'change' }],
                // 客诉材料
                material: [{ validator: fileRequired, message: '客诉材料不能为空，最少上传附件或录音其中一种' }],
                // 服管处理建议
                suggest: [{ required: true, message: '服管处理建议不能为空', trigger: 'blur' }]
            },
            // 投诉类型数组
            complainTypeArr: [],
            // 城市远程下拉
            cityApi: {
                api: commonApi.getDetailCityListData,
                params: {
                    q: '',
                    type: 2,
                    param: 'withAll,noAll'
                }
            },
            // 咨询师，绩效责任上级，获取所有在职离职的人
            userApi: {
                api: commonApi.getStaffList,
                params: {
                    q: '',
                    role: 'all',
                    status: -1
                }
            },
            // 选中的城市，编辑赋值时需要
            chosenCity: {},
            // 选中的咨询师
            chosenConsultor: {},
            // 选中的绩效责任上级
            chosenDutySuper: {},
            // 可选择今天及之前的日期
            pickerOptionsBefore: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            // 可选择今天及之后的日期
            pickerOptionsAfter: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            // 客诉来源下拉列表
            sourceOptions: [],
            // 投诉对象及原因下拉列表
            reasonOptions: [],
            // 是否万单问题下拉列表
            questionOptions: [],
            // 转交人员下拉列表
            deliverOptions: [],
            // 加载
            loading: false,
            // 是否重复提交
            isSubmit: false,
            // 是否是服管，编辑时使用，来决定是否展示服管的输入框
            isQuality: false,
            // 客诉上一次更新时间，校验是否变更使用，编辑保存需要
            updateTime: '',
            // 按钮操作的表单中需要的下拉数据
            formOptions: {},
            // 二次确认弹窗
            dialog: {
                visible: false,
                content: '',
                // 需要二次确认的信息数组
                alertList: [],
                // 当前是第几个提示
                index: 0
            },
            // 编辑客诉的按钮
            initButtons: [],
            // 要切换转交人的弹窗
            alertVisible: false
        };
    },
    mounted() {
        this.getOptions();
        if (this.id) {
            this.initData();
        }
    },
    computed: {
        /**
         * @description: 验证投诉类型选择是否是以下这几项：投诉、售后、更换咨询师、客户异议、修改评价
         * @return: 是这几项是返回true（展示是否万单，咨询师，绩效责任上级，要求联系时间），不是这几项时返回false
         */
        checkComplainType: function() {
            return this.form.complainType && typeArr.indexOf(this.form.complainType) !== -1;
        }
    },
    methods: {
        // 获取静态下拉数据
        async getOptions() {
            try {
                const {
                    data: { code, msg, data }
                } = await api.commonOptions();
                if (code === 0) {
                    this.complainTypeArr = data.complaint_type;
                    this.sourceOptions = data.complaint_source;
                    this.reasonOptions = data.complaint_cause;
                    this.questionOptions = data.is_wandan;
                    this.isQuality = data.is_quality;
                    this.formOptions = {
                        performance: data.performance_impact,
                        readLine: data.red_yellow_line
                    };
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 切换投诉类型，重新验证订单id是否必填；获取转交人、咨询师、绩效责任上级；没有使用监听是因为编辑初始化赋值会冲突
        changeComplainType() {
            this.$refs.form.validateField('orderId');
            // this.$refs.orderId.clearValidate();
            // 如果不是5个类型，需要清空关联字段；本身页面也不会展示这些关联字段
            if (!this.checkComplainType) {
                this.form.consultor = '';
                this.form.dutySuper = '';
                this.form.contactTime = '';
                this.form.isOrderQuestion = '';
                // 投诉类型改变，获取转交人
                this.getDeliver();
            } else {
                // 投诉类型改变，获取转交人、咨询师、绩效责任上级
                if (this.form.orderId) {
                    this.getDeliver();
                }
            }
        },
        /**
         * @description: 订单号只能输入数字
         * @param {Object}  e   $event
         * @return:
         */
        fixOrderId(e) {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
            this.form.orderId = e.target.value;
        },
        // 订单号改变获取咨询师和绩效责任上级
        getConsultor() {
            if (this.form.complainType && this.form.orderId) {
                this.getDeliver();
            }
        },
        // 获取转交人，咨询师，绩效责任上级需要三个参数：投诉类型，订单ID，城市ID
        changeCity() {
            if ((this.checkComplainType && this.form.orderId) || (this.form.complainType && !this.checkComplainType)) {
                this.getDeliver();
            }
        },
        /**
         * @description: 根据订单ID和投诉类型获取转交人，咨询师，绩效责任上级
         * @param {Number} type 1=编辑初始化加的参数，如果初始化转交人没值要请求覆盖
         * @return:
         */
        async getDeliver(type) {
            try {
                let params = {
                    complaint_type: this.form.complainType,
                    city_id: this.form.city || '-1',
                    order_id: this.form.orderId
                };
                const {
                    data: { code, msg, data }
                } = await api.getTransferInfo(params);
                if (code === 0) {
                    // 咨询师可以不需要城市参数  没有type参数才对咨询师绩效责任人进行覆盖
                    if (!type) {
                        this.chosenConsultor = data.employee || {};
                        this.form.consultor = data.employee ? data.employee.value : '';
                        this.chosenDutySuper = data.employee_adjust_leader || {};
                        this.form.dutySuper = data.employee_adjust_leader ? data.employee_adjust_leader.value : '';
                    }
                    // 转交人必须有城市参数
                    if (this.form.city) {
                        this.deliverOptions = data.transferor ? [].concat(data.transferor) : [];
                        this.form.deliver = data.transferor ? data.transferor.value : '';
                        this.form.businessId = data.transferor ? data.transferor.business_id : '';
                        if (!data.transferor) {
                            this.$message.error('此订单找不到转交人，无法进行创建，请先完善对应的客诉问题跟进人配置！');
                        }
                    }
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 根据咨询师获取绩效责任上级
        async changeConsultor() {
            try {
                let params = {
                    employee_id: this.form.consultor
                };
                const {
                    data: { code, msg, data }
                } = await api.getAdjustLeaderInfo(params);
                if (code === 0) {
                    this.form.dutySuper = data.value || '';
                    this.chosenDutySuper = data || {};
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 上传客诉材料组件返回的已上传的客诉材料
         * @param {Object}  客诉材料对象
         * @return:
         */
        getMaterial(list) {
            this.form.imgList = list.imgList;
            this.form.audioList = list.audioList;
            this.$refs.form.validateField('material');
        },
        /**
         * @description: 获取投诉对象一二三级原因拼接成数组
         * @param {Object}  data  数据
         * @return: 拼接的数组
         */
        getReasonArr(data) {
            let reason = [];
            if (data.complaint_category) {
                reason.push(data.complaint_category);
            }
            if (data.one_cause) {
                reason.push(data.one_cause);
            }
            if (data.two_cause) {
                reason.push(data.two_cause);
            }
            if (data.three_cause) {
                reason.push(data.three_cause);
            }
            return reason;
        },
        // 初始化数据
        async initData() {
            try {
                this.loading = true;
                const {
                    data: { code, msg, data }
                } = await api.getComplaintDetail({
                    id: this.id,
                    type: 2
                });
                if (code === 0) {
                    this.initButtons = data.buttons;
                    this.form = {
                        complainType: data.complaint_type,
                        orderId: data.order_id,
                        city: data.city_id,
                        name: data.user_realname,
                        phone: data.user_mobile,
                        complainTime: new Date(data.complaint_time).getTime(),
                        source: data.complaint_source,
                        reason: this.getReasonArr(data),
                        isOrderQuestion: data.is_many_order,
                        // 客户反馈内容
                        feedback: data.complaint_desc,
                        consultor: data.employee_id,
                        dutySuper: data.adjust_leader_id,
                        contactTime: new Date(data.request_contact_time).getTime(),
                        deliver: data.transferor,
                        imgList: data.file.pic,
                        audioList: data.file.audio,
                        businessId: data.business_id,
                        suggest: data.service_handle_desc
                    };
                    this.updateTime = data.update_datetime;
                    this.chosenCity = {
                        value: data.city_id,
                        name: data.city_id_text
                    };
                    this.chosenConsultor = {
                        value: data.employee_id,
                        name: data.employee_id_text
                    };
                    this.chosenDutySuper = {
                        value: data.adjust_leader_id,
                        name: data.adjust_leader_id_text
                    };
                    // 如果转交人没值，重新获取覆盖
                    if (!data.transferor) {
                        this.getDeliver(1);
                    } else {
                        this.deliverOptions = [
                            {
                                value: data.transferor,
                                name: data.transferor_text
                            }
                        ];
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        // 拼接要提交的客诉材料字段
        getMaterialParams() {
            let imgArr = this.form.imgList.map(function(item) {
                return item.file_path;
            });
            let audioArr = this.form.audioList.map(function(item) {
                return item.file_path;
            });
            return {
                img_arr: imgArr,
                voice_arr: audioArr
            };
        },
        /**
         * @description: 获取保存请求参数
         * @param {string} force 是否二次确认 1:否 0:是
         * @return:
         */
        getParams(force) {
            let params = {
                complaint_type: this.form.complainType,
                city_id: this.form.city,
                user_realname: this.form.name,
                user_mobile: this.form.phone,
                complaint_time: this.form.complainTime / 1000,
                complaint_source: this.form.source,
                complaint_desc: this.form.feedback,
                order_id: this.form.orderId,
                is_many_order: this.form.isOrderQuestion,
                employee_id: this.form.consultor,
                adjust_leader_id: this.form.dutySuper,
                request_contact_time: this.form.contactTime / 1000,
                complaint_category: this.form.reason[0] || '',
                one_cause: this.form.reason[1] || '',
                two_cause: this.form.reason[2] || '',
                three_cause: this.form.reason[3] || '',
                business_id: this.form.businessId,
                transferor: this.form.deliver,
                complaint_file: this.getMaterialParams(),
                service_handle_desc: this.form.suggest,
                force: force
            };
            if (this.$route.name === 'editComplaint') {
                params.id = this.id;
                params.update_datetime = this.updateTime;
            }
            return params;
        },
        /**
         * @description: 保存客诉问题
         * @param {string} force 是否二次确认 1:否 0:是
         * @return:
         */
        save(force) {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    let params = this.getParams(force);
                    try {
                        let editResult;
                        if (this.$route.name === 'editComplaint') {
                            editResult = await api.editComplaint(params);
                        } else {
                            editResult = await api.addComplaint(params);
                        }
                        const {
                            data: { code, msg, data }
                        } = editResult;
                        if (code === 0) {
                            this.saveSuccess(data.id);
                        } else if (code === -1) {
                            // 二次弹窗
                            this.dialog.alertList = data.msg_list;
                            this.saveConfirm();
                        } else if (code === -2) {
                            // 任务变更提示
                            this.$refs.btnOpts.handleTaskUpdate();
                        } else if (code === -3) {
                            // 要更换转交人
                            this.alertVisible = true;
                        } else {
                            this.$message.error(msg);
                        }
                        this.isSubmit = false;
                    } catch (err) {
                        this.isSubmit = false;
                    }
                }
            });
        },
        // 客诉任务保存时提示非打断性弹窗，必须全部点击继续才能重新保存
        saveConfirm() {
            this.dialog.visible = true;
            this.dialog.content = this.dialog.alertList[this.dialog.index].msg;
            this.dialog.index++;
        },
        // 二次确认弹窗点击继续
        confirmAlert() {
            if (this.dialog.index < this.dialog.alertList.length) {
                this.dialog.visible = false;
                this.saveConfirm();
            } else {
                this.save('1');
            }
        },
        // 二次确认弹窗点击取消，弹窗等信息都重置
        cancelAlert() {
            this.dialog = {
                visible: false,
                content: '',
                alertList: [],
                index: 0
            };
        },
        /**
         * @description: 保存成功跳转
         * @param {string} id  客诉任务id
         * @return:
         */
        saveSuccess(id) {
            this.$message({
                message: '保存成功',
                type: 'success'
            });
            this.$router.push({
                path: '/complaint/followComplaint',
                query: {
                    id: id || this.id
                }
            });
        },
        // 点击任务变更提示弹窗的我知道了按钮，刷新当前页，停留在当前页面
        reload() {
            if (this.id) {
                this.initData();
            }
        }
    }
};
</script>

<style lang="less" scoped>
.v-box {
    padding-top: 20px;
    .input-width {
        width: 350px;
    }
    .reason-width {
        width: 100%;
    }
}
</style>