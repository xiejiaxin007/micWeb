<!--
 * @Name: 带看材料清单
 * @author: wangshuaixue
 * @Date: 2020-02-26 19:24:18
 * @description:
 -->
 <template>
    <div
        v-loading="isLoading"
        element-loading-text="拼命加载中"
        class="material-list-box">
        <div class="customer-box">
            <div class="module-title">
                <div class="name">带看客户：共{{ruleForm.customerInfo.length + 1}}人参与线上带看</div>
                <div
                    class="add-info"
                    @click="addUser">+添加用户</div>
            </div>
            <div class="module-content">
                <ul class="customer-info fixed-custom">
                    <li class="cus-item">
                        <span class="name">客户姓名</span>
                        <span class="content">{{orderUser.user_realname}}</span>
                    </li>
                    <li class="cus-item">
                        <span class="name">客户性别</span>
                        <span class="content">{{orderUser.sex}}</span>
                    </li>
                    <li class="cus-item">
                        <span class="name">客户手机</span>
                        <span class="content">{{orderUser.user_mobile}}</span>
                    </li>
                </ul>
                <el-form
                    ref="ruleForm"
                    :model="ruleForm">
                    <ul
                        class="customer-info"
                        v-for="(cust, index) in ruleForm.customerInfo"
                        :key="index">
                        <li class="cus-item">
                            <span class="name">客户姓名</span>
                            <span class="content">
                                <el-input
                                    placeholder="请输入姓名"
                                    v-model="cust.customer_name">
                                </el-input>
                            </span>
                        </li>
                        <li class="cus-item">
                            <span class="name">客户性别</span>
                            <span class="content">
                                <el-select
                                    v-model="cust.sex"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in sexList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id+''">
                                    </el-option>
                                </el-select>
                            </span>
                        </li>
                        <li class="cus-item">
                            <span class="name require">客户手机</span>
                            <span class="content">
                                <el-form-item
                                    :prop="`customerInfo.${index}.customer_mobile`"
                                    :rules="{required: true, validator: checkPhone, trigger: 'blur'}">
                                     <jl-number-input
                                        maxlength="20"
                                        reg="number"
                                        v-model="cust.customer_mobile"
                                    ></jl-number-input>
                                </el-form-item>
                            </span>
                        </li>
                        <li
                            class="operation"
                            @click="deleteCusInfo(index)">
                            删除
                        </li>
                    </ul>
                </el-form>
            </div>
        </div>
        <div class="house-box">
            <div class="module-title">
                <div class="name">带看楼盘：共带看{{ruleForm.projectList.length}}个楼盘</div>
                <div
                    @click="addProject"
                    class="add-info">+添加带看楼盘</div>
                </div>
                <div class="module-content">
                    <el-form
                        :model="seeInfo"
                        ref="seeInfo">
                        <div class="take-look-info">
                            <div class="info-item">
                                <div class="name">带看时间</div>
                                <span class="content">
                                    <el-date-picker
                                        prop="plan_real_begin_datetime"
                                        :rules="{required: true, message: '选择带看时间', trigger: 'change'}"
                                        v-model="seeInfo.plan_real_begin_datetime"
                                        type="datetime"
                                        value-format="timestamp"
                                        :picker-options="pickerOptions"
                                        placeholder="选择带看时间">
                                    </el-date-picker>
                                </span>
                            </div>
                            <div class="info-item">
                                <div class="name">邀约人</div>
                                <span class="content">
                                    <el-autocomplete
                                        v-model="seeInfo.invitation_employee_realname"
                                        :fetch-suggestions="searchEmployee"
                                        placeholder="请输入邀约人搜索"
                                        @select="((qs)=>{affirmPerson(qs, '1')})"
                                    ></el-autocomplete>
                                </span>
                            </div>
                            <div class="info-item">
                                <div class="name">带看人</div>
                                <span class="content">
                                    <el-autocomplete
                                        v-model="seeInfo.see_employee_realname"
                                        :fetch-suggestions="searchEmployee"
                                        placeholder="请输入带看人搜索"
                                        @select="((qs)=>{affirmPerson(qs, '2')})"
                                    ></el-autocomplete>
                                </span>
                            </div>
                            <div class="info-item">
                                <div class="name require">预计带看时长</div>
                                <span class="content duration">
                                    <el-form-item
                                        prop="duration"
                                        :rules="{required: true, message: '请填写带看时长', trigger: 'blur'}">
                                        <jl-number-input
                                            @blur="changeDuration"
                                            reg="number"
                                            v-model="seeInfo.duration"
                                        ></jl-number-input>
                                        <span class="unit">分钟</span>
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                    </el-form>
                <div class="take-house-hint">
                    <i class="el-icon-warning" 
                        aria-hidden="true"></i> 请确认带看顺序，带看楼盘顺序会给主管发送提醒哦～
                </div>
                <div class="take-house-list">
                    <div class="take-house">
                        <el-form
                            :model="ruleForm"
                            ref="ruleForm">
                            <ul
                                class="house-info"
                                v-for="(project, index) in ruleForm.projectList"
                                :key="index">
                                <li class="info-wrap">
                                    <div class="name">
                                        {{`${index == 0 ? '(主推)' : ''}带看楼盘${index + 1}`}}
                                    </div>
                                    <div class="content">
                                        <el-form-item
                                            :prop="`projectList.${index}.project_name`"
                                            :rules="{required: true, message: '请选择带看楼盘', trigger: 'change'}">
                                                <el-autocomplete
                                                    v-model="project.project_name"
                                                    :fetch-suggestions="((qs, cb)=>{searchProject(qs, cb, index)})"
                                                    placeholder="请输入楼盘名搜索"
                                                    @select="((qs)=>{affirmProject(qs, index)})"
                                                ></el-autocomplete>
                                        </el-form-item>
                                    </div>
                                </li>
                                <li class="info-wrap">
                                    <div class="name">销售信息</div>
                                    <div class="content">
                                        <el-input
                                            maxlength="10"
                                            placeholder="请输入内容"
                                            v-model="project.sales_name">
                                        </el-input>
                                    </div>
                                </li>
                                <li
                                    class="info-wrap">
                                    <div class="name">销售手机</div>
                                    <div class="content">
                                        <el-form-item
                                            :prop="`projectList.${index}.sales_phone`"
                                            :rules="{required: false, validator: verifySalePhone, trigger: 'blur'}">
                                            <jl-number-input
                                                maxlength='20'
                                                reg="number"
                                                v-model="project.sales_phone"
                                            ></jl-number-input>
                                        </el-form-item>
                                    </div>
                                    <div
                                        v-show="ruleForm.projectList.length !== 1"
                                        class="edit-wrap">
                                        <span
                                            @click="delProject(index)"
                                            class="delete">删除</span>
                                        <span>带看顺序：</span>
                                        <span
                                            @click="moveOrder('up', index)"
                                            :class="`${index !== 0 ? 'hint-color' : 'not-arrow'}`">上移</span>
                                        <span> | </span>
                                        <span
                                            @click="moveOrder('down', index)"
                                            :class="`${(index+1) !== ruleForm.projectList.length ? 'hint-color' : 'not-arrow'}`">下移</span>
                                    </div>
                                </li>
                            </ul>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="customer-need-box">
            <div class="module-title">
                <div class="name">客户需求</div>
            </div>
            <div>
                <table class="table">
                    <thead class="head">
                        <tr>
                            <th class="title">客户需求</th>
                            <th class="con require">填写信息</th>
                            <th class="swith">设置展示</th>
                        </tr>
                    </thead>
                    <tbody
                        class="body"
                        v-if="userRequire"
                    >
                        <tr>
                            <td class="title">总价预算</td>
                            <td
                                class="con"
                                v-if="totalPrice"
                            >
                                <div class="min-item">
                                    <jl-number-input
                                        @blur="changeClient(1)"
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
                                        @blur="changeClient(1)"
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
                                <el-switch
                                    v-if="userRequire.total_price"
                                    @change="setShow(userRequire.total_price.is_show, 1)"
                                    v-model="userRequire.total_price.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="title">首付预算</td>
                            <td
                                class="con"
                                v-if="firstPrice"
                            >
                                <div class="min-item">
                                    <jl-number-input
                                        @blur="changeClient(2)"
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
                                        @blur="changeClient(2)"
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
                                <el-switch
                                    v-if="userRequire.first_price"
                                    @change="setShow(userRequire.first_price.is_show, 2)"
                                    v-model="userRequire.first_price.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="title">面积</td>
                            <td
                                class="con"
                                v-if="acreage"
                            >
                                <div class="min-item">
                                    <jl-number-input
                                        @blur="changeClient(3)"
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
                                    class="max-item"
                                    v-if="acreage ? acreage.isMore : false">
                                    <jl-number-input
                                        @blur="changeClient(3)"
                                        reg="number"
                                        v-model="acreage.value_max"
                                    ></jl-number-input>
                                    <span class="input-unit">平米</span>
                                </div>
                                <div
                                    class="unit-operate"
                                    v-if="acreage"
                                    @click="changeArea(acreage, 'value_max')"
                                >{{checkarea(acreage.isMore)}}</div>
                            </td>
                            <td class="swith">
                                <el-switch
                                    v-if="userRequire.acreage"
                                    @change="setShow(userRequire.acreage.is_show, 3)"
                                    v-model="userRequire.acreage.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="title">业态</td>
                            <td
                                class="con"
                                v-if="userRequire.project_type"
                            >
                                <el-radio-group
                                    @change="changeClient(4)"
                                    v-model="userRequire.project_type.value">
                                    <el-radio
                                        :label="projectType.value"
                                        v-for="(projectType, index) in typeList"
                                        :key="'projectType' + index"
                                    >{{projectType.name}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td class="swith">
                                <el-switch
                                    v-if="userRequire.project_type"
                                    @change="setShow(userRequire.project_type.is_show, 4)"
                                    v-model="userRequire.project_type.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="title">购房资质</td>
                            <td
                                class="con"
                                v-if="userRequire.qualifications"
                            >
                                <el-radio-group
                                    @change="changeClient(5)"
                                    v-model="userRequire.qualifications.value">
                                    <el-radio
                                        :label="qualification.value"
                                        v-for="(qualification, index) in qualificationList"
                                        :key="'qualification-' + index"
                                    >{{qualification.name}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td class="swith">
                                <el-switch
                                    v-if="userRequire.qualifications"
                                    @change="setShow(userRequire.qualifications.is_show, 5)"
                                    v-model="userRequire.qualifications.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="title">户型</td>
                            <td
                                class="con"
                                v-if="userRequire.house_type"
                            >
                                <el-checkbox-group
                                    @change="changeClient(6)"
                                    v-model="userRequire.house_type.value">
                                    <el-checkbox
                                        :label="houseType.value"
                                        v-for="(houseType, index) in houseTypeList"
                                        :key="'houseType-' + index"
                                    >{{houseType.name}}</el-checkbox>
                                </el-checkbox-group>
                            </td>
                            <td class="swith">
                                <el-switch
                                    v-if="userRequire.house_type"
                                    @change="setShow(userRequire.house_type.is_show, 6)"
                                    v-model="userRequire.house_type.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="title">购房目的</td>
                            <td
                                class="con"
                                v-if="userRequire.purchase_purpose"
                            >
                                <el-radio-group
                                    @change="changeClient(7)"
                                    v-model="userRequire.purchase_purpose.value">
                                    <el-radio
                                        :label="purchase.value"
                                        v-for="(purchase, index) in purchaseList"
                                        :key="'purchase-' + index"
                                    >{{purchase.name}}</el-radio>
                                </el-radio-group>
                            </td>
                            <td class="swith">
                                <el-switch
                                    v-if="userRequire.purchase_purpose"
                                    @change="setShow(userRequire.purchase_purpose.is_show, 7)"
                                    v-model="userRequire.purchase_purpose.is_show"
                                    active-text="是"
                                    inactive-text="否"
                                    active-color="#2776EF"
                                    inactive-color="#abb0b5"
                                    active-value="0"
                                    inactive-value="1"
                                ></el-switch>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="small-box-item">
            <div>
                <div class="module-title">
                    <div class="name">找房工具</div>
                </div>
                <div class="module-content">
                    请根据客户需求和带看楼盘，提前准备好找房工具设置，提前标记带看楼盘已保证带看中顺畅使用
                </div>
            </div>
            <div>
                <div class="module-title">
                    <div class="name">网速自测</div>
                </div>
                <div class="module-content speed-wrap">
                    <div class="text-desc">
                        <div>预估您的宽带为 <span class="speed">{{ajaxSpeed}}KB/S</span></div>
                        <div>请确保带看过程中网络正常</div>
                    </div>
                    <div
                        @click="getMoreAjaxSpeed(imgOnline2)"
                        class="speed-btn">
                        测试网速
                    </div>
                </div>
            </div>
            <div>
                <div class="module-title">
                    <div class="name">线上带看准备内容确认</div>
                </div>
                <div class="module-content online-affirm">
                    <div class="affirm-item">
                        <span class="require">您是否穿着正装？</span>
                        <el-checkbox v-model="seeInfo.is_dress">我已确认</el-checkbox>
                    </div>
                    <div class="affirm-item">
                        <span class="require">您是否有安静无杂音的线上带看环境？</span>
                        <el-checkbox v-model="seeInfo.is_quiet">我已确认</el-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="save-wrap">
            <div
                @click="saveListvify"
                class="save-inner">
                保存，去准备带看材料
            </div>
        </div>
    </div>
</template>

<script>
    import api from './api/onlineaList';
    import commonApi from '@/api/commonApi';
    import {commonFun} from '@/assets/js/utils/utils';
    import { mapState } from 'vuex';
    export default {
        name: 'takeLookList',
        data() {
            return {
                // z正在加载标识
                isLoading: false,
                // 防止重复提交
                lock: false,
                // 用户需求状态
                requireState: false,
                // 是否第一次加载
                isFir: true,
                // 当前预览图片url
                previewUrl: [],
                // 是否展示大图预览
                PhotoIsShow: false,
                // 凭证上传图片阿里云路径
                voucherDir: 'online_contact_voucher',
                // 带看信息
                seeInfo: {},
                // 搜索楼盘列表
                projectArr: [],
                // 用户信息
                orderUser: {},
                // 请求次数
                times: 3,
                // 网速
                ajaxSpeed: '0',
                // 测试图片
                imgOnline2: '/dist/static/img/img-testspeed2.5279367.png',
                // 客户需求
                userRequire: {},
                // 业态
                typeList: [],
                // 户型
                houseTypeList: [],
                // 总价
                totalPrice: {},
                // 首付
                firstPrice: {},
                // 面积
                acreage: {},
                ruleForm: {
                    // 客户信息
                    customerInfo: [],
                    // 楼盘列表
                    projectList: []
                },
                checked: false,
                // 客户手机
                cusPhone: '222',
                // 客户名字
                cusName: '',
                // 客户性别
                sex: 1,
                // 性别列表
                sexList: [
                    {
                        id: 1,
                        text: '男'
                    },
                    {
                        id: 2,
                        text: '女'
                    }
                ],
                messageFlag: ''
            };
        },
        created() {
            this.seeId = this.$route.query.see_id;
            this.orderId = this.$route.query.order_id;
            this.pickerOptions = {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
            this.getInitData().then(() => {
                // 页面浏览埋点
                this.pageView();
                this.isFir = false;
            });
            // 修改带看楼盘数据索引
            this.currProIndex = '';
        },
        computed: {
            ...mapState(['trackCommon']),
            // 带看楼盘变动索引
            seeProjectIndex() {
                return '';
            },
            // 选中带看楼盘id
            checkProject() {
                let ids = [];
                this.ruleForm.projectList.forEach((pro, index) => {
                    ids.push(pro)
                })
                return ids;
            }
        },
        methods: {
            // 带看时长埋点
            changeDuration() {
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id,
                    predict_see_time: this.seeInfo.duration
                };
                commonFun.setTrack(
                    '7253',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            // 页面浏览埋点
            pageView() {
                // 埋点
                let obj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrackNew(7580, obj);
            },
            // 校验用户需求
            verifyUser() {
                var sum = this.userRequire;
                let opt = 0;
                let successOpt = 0;
                for (let i in sum) {
                    if (sum[i].is_show == 0) {
                        opt++;
                        if (i == 'total_price' || i == 'first_price' || i == 'acreage') {
                            if (sum[i].isMore) {
                                if (sum[i].value_max != '' && sum[i].value_min != '') {
                                    successOpt++;
                                }
                            } else {
                                if (sum[i].value_min != '') {
                                    successOpt++;
                                }
                            }
                        } else if (sum[i].value != '') {
                            successOpt++;
                        }
                    }
                }
                return opt == successOpt;
            },
            /**
             * 设置展示
             * @param {object} para 当前选中内容
             * @param {string} type 1 邀约人 2 带看人
             */
            setShow(isShow, type) {
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id,
                    tab_id: type,
                    is_show: isShow
                };
                commonFun.setTrack(
                    '7261',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            /**
             * 修改客户需求
             * @param {string} type 修改哪个字段1-7分别对应总价-购房目的
             */
            changeClient(type) {
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                // 总价无区间
                if (type === 1 && !this.totalPrice.isMore) {
                    paraObj.total_budget = this.totalPrice.value_min;
                } else if (type === 1 && this.totalPrice.isMore) {
                    // 总价有区间
                    paraObj.input_total_price = `${this.totalPrice.value_min},${this.totalPrice.value_max}`;
                } else if (type === 2 && !this.firstPrice.isMore) {
                    // 单价无区间
                    paraObj.down_payment_budget = parseInt(this.firstPrice.value_min);
                } else if (type === 2 && this.firstPrice.isMore) {
                    // 单价有区间
                    paraObj.input_downpay = `${this.firstPrice.value_min},${this.firstPrice.value_max}`;
                } else if (type === 3 && !this.acreage.isMore) {
                    // 面积无区间
                    paraObj.proportion = [0];
                    paraObj.proportion[0] = this.acreage.value_min;
                } else if (type === 3 && this.acreage.isMore) {
                    // 面积有区间
                    paraObj.input_proportion = `${this.acreage.value_min},${this.acreage.value_max}`;
                } else if (type === 4) {
                    // 业态
                    paraObj.project_type = [0];
                    paraObj.project_type[0] = this.userRequire.project_type.value;
                } else if (type === 5) {
                    // 购房资质
                    paraObj.purchase_qualification = this.userRequire.qualifications.value
                } else if (type === 6) {
                    // 户型
                    paraObj.house_type = this.userRequire.house_type.value;
                } else if (type === 7) {
                    // 购房目的
                    paraObj.purchase_purpose = this.userRequire.purchase_purpose.value
                }
                commonFun.setTrack(
                    '7260',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            /**
             * 删除凭证图片
             * @param {object} para 当前选中内容
             * @param {string} type 1 邀约人 2 带看人
             */
            affirmPerson(para, type) {
                if (type == 1) {
                    this.seeInfo.invitation_employee_id = para.id;
                    this.seeInfo.invitation_employee_realname = para.text;
                } else {
                    this.seeInfo.see_employee_id = para.id;
                    this.seeInfo.see_employee_realname = para.text;
                }
                this.seeInfo.duration = '';
            },
            // 上传凭证
            upVovher(e) {
                // e.preventDefault();
                console.log('111')
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7259',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            /**
             * 删除凭证图片
             * @param {string} index 当前楼盘索引
             */
            delVercherImg (index) {
                this.ruleForm.projectList[index].img = [];
                let obj = this.ruleForm.projectList[index];
                this.$set(this.ruleForm.projectList, index, obj)
            },
            /**
             * 上传凭证成功
             * @param {string} index 当前楼盘索引
             */
            uploadSuccess (index) {
                this.$set(this.ruleForm.projectList, index, this.ruleForm.projectList[index])
            },
            /**
             * 打开大图预览
             * @param {string} url 预览大图的url
             */
            showPreview(url) {
                this.previewUrl[0] = url;
                this.PhotoIsShow = true;
            },
            // 关闭大图预览
            closeViewer() {
                this.PhotoIsShow = false;
                this.previewUrl = [];
            },
            /**
             * 校验销售手机号码
             * @param {string} rule 校验规则
             * @param {string} value 校验的手机号
             * @param {string} callback 回调函数
             */
            verifySalePhone (rule, value, callback) {
                if (value !== '' && !commonFun.verifyTelNum(value)) {
                    return callback(new Error('请填写正确手机号'));
                }
                callback();
            },
            checkPhone (rule, value, callback) {
                if (value == '') {
                    return callback(new Error('请填写手机号'));
                }
                if (!commonFun.verifyTelNum(value)) {
                    return callback(new Error('请填写正确手机号'));
                }
                callback();
            },
            // 点击保存请求前的接口校验
            async saveListvify () {
                try {
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrack(
                        '7264',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                    // 处理带看楼盘的信息
                    this.ruleForm.projectList.forEach((p) => {
                        p.online_contact_voucher = p.img && p.img.length > 0 ? p.img[0].name : '';
                    });
                    // 校验线上带看准备确认
                    if (!this.seeInfo.is_dress || !this.seeInfo.is_quiet) {
                        this.$message({
                            message: '线上带看准备内容确认为必填',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    }
                    let validf = false;
                    let valids = false;
                    // 带看客户和带看楼盘校验
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            validf = true;
                        }
                    });
                    this.$refs.seeInfo.validate((valid) => {
                        if (valid) {
                            valids = true;
                        }
                    });
                    if (!validf || !valids) {
                        this.$message({
                            message: '请完善信息',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    }
                    // 校验客户需求信息
                    let flag = this.verifyUser();
                    if (!flag) {
                        this.$message({
                            message: '请完善客户需求信息',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    }
                    // 校验通过
                    this.saveData();
                } catch (err) {
                    console.log(err)
                }
            },
            // 保存数据接口
            async saveData() {
                console.log('保存', this.lock)
                try {
                    if (this.lock) {
                        return false;
                    }
                    // 处理带看信息
                    let baseSeeInfo = JSON.parse(JSON.stringify(this.seeInfo));
                    baseSeeInfo.is_dress = baseSeeInfo.is_dress ? '1' : '2';
                    baseSeeInfo.is_quiet = baseSeeInfo.is_dress ? '1' : '2';
                    baseSeeInfo.plan_real_begin_datetime = baseSeeInfo.plan_real_begin_datetime / 1000;
                    // 处理带看楼盘多余字段
                    let seePro = this.ruleForm.projectList.map((p) => {
                        return {
                            project_id: p.project_id,
                            project_name: p.project_name,
                            sales_name: p.sales_name,
                            sales_phone: p.sales_phone,
                            online_contact_voucher: p.online_contact_voucher
                        }
                    })
                    let params = {
                        customer_info: this.ruleForm.customerInfo,
                        customer_cnt: this.ruleForm.customerInfo.length,
                        order_user: this.orderUser,
                        see_project_list: seePro,
                        see_project_list_cnt: this.ruleForm.projectList.length,
                        see_info: baseSeeInfo,
                        order_require: this.userRequire,
                        order_id: this.orderId,
                        see_id: this.seeId
                    }
                    this.lock = true;
                    let { data } = await api.saveSeeList(params);
                    if (data.code === 0) {
                        this.lock = false;
                        // 跳转
                        this.$router.push({path: '/materialPrepare', query: {see_project_id: this.seeId}});
                    } else {
                        this.lock = false;
                        alert(data.msg);
                    }
                } catch (err) {
                    this.lock = false;
                    console.log(err)
                }
            },
            /**
             * 移动楼盘顺序
             * @param {string} type 上移/下移
             * @param {string} projectId 楼盘id
             */
            moveOrder(type, index) {
                // 获取当前楼盘索引
                if (type === 'up' && index === 0 || type === 'down' && index === this.ruleForm.projectList.length - 1) {
                    return;
                }
                if (type === 'up' && index > 0) {
                    this.ruleForm.projectList[index] = this.ruleForm.projectList.splice(index - 1, 1, this.ruleForm.projectList[index])[0];
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrack(
                        '7254',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                } else if (type === 'down' && index !== this.ruleForm.projectList.length - 1) {
                    this.ruleForm.projectList[index] = this.ruleForm.projectList.splice(index + 1, 1, this.ruleForm.projectList[index])[0];
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrack(
                        '7255',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                }
            },
            // 删除楼盘
            delProject(index) {
                this.ruleForm.projectList.splice(index, 1);
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7257',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            async searchEmployee(val, cb) {
                let params = {
                    q: val
                }
                var list = [{}]
                let { data } = await api.getEmployee(params);
                if (data.code === 0) {
                    this.projectArr = data.data.list;
                    for (let i of data.data.list) {
                        i.value = i.text; // 将想要展示的数据作为value
                    }
                    list = data.data.list;
                    cb(list);
                } else {
                    let arr = [];
                    cb(arr);
                }
            },
            // 确认楼盘
            affirmProject (para, i) {
                let obj = {
                    project_id: para.id,
                    project_name: para.text,
                    sales_name: '',
                    sales_phone: '',
                    online_contact_voucher: ''
                }
                this.$set(this.ruleForm.projectList, i, obj);
            },
            // 请求带看楼盘列表
            async searchProject (val, cb, index) {
                let ids = this.ruleForm.projectList.map((v) => {
                    return v.project_id;
                })
                ids = Array.from(new Set(ids));
                let params = {
                    not_in_id: ids,
                    name: val
                };
                // 隐藏历史记录模块
                var list = [{}]
                let { data } = await commonApi.projectList(params);
                if (data.code === 0) {
                    this.projectArr = data.data.list;
                    for (let i of data.data.list) {
                        i.value = i.text; // 将想要展示的数据作为value
                    }
                    list = data.data.list;
                    cb(list);
                } else {
                    let arr = [];
                    cb(arr);
                }
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
            // 添加带看楼盘
            addProject () {
                let obj = {
                    project_id: '',
                    project_name: '',
                    sales_name: '',
                    sales_phone: '',
                    online_contact_voucher: ''
                };
                try {
                    if (this.ruleForm.projectList.length > 9) {
                        this.$message({
                            message: '最多添加10个带看楼盘',
                            duration: 1000,
                            type: 'warning'
                        });
                    } else {
                        this.$set(this.ruleForm.projectList, this.ruleForm.projectList.length, obj)
                    }
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrack(
                        '7252',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                } catch (err) {
                    console.log(err);
                }
            },
            // 添加客户
            addUser () {
                let obj = {
                    customer_name: "",
                    sex: "",
                    customer_mobile: ""
                };
                if (this.ruleForm.customerInfo.length === 4) {
                    // 超过5条的时候提示最多添加5条
                    this.$message({
                        message: '最多添加5个客户',
                        duration: 1000,
                        type: 'warning'
                    });
                } else {
                    this.ruleForm.customerInfo.push(obj)
                }
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7250',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            // ajax多次测速
            getSpeedByAjax: function(fn, img, time) {
                time = time || 1;
                var startTime, endTime, fileSize;
                var count = time;
                var _this = this;
                function measureBWSimple() {
                    var xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            if (!fileSize) {
                                fileSize = xhr.responseText.length;
                            }
                            count--;
                            if (count <= 0) {
                                _this.messageFlag.close();
                                endTime = Date.now();
                                // 因为多次建立连接，时长增加了，所以下面要乘以请求次数，再除以时间差
                                var speed =
                                    (fileSize * time) /
                                    ((endTime - startTime) / 1000) /
                                    1024;
                                fn && fn(Math.floor(speed));
                            }
                        }
                    };
                    xhr.open('GET', img + '?cach=' + Math.random(), true);
                    xhr.send();
                }
                startTime = Date.now();
                for (var x = time; x > 0; x--) {
                    measureBWSimple();
                }
            },
            getMoreAjaxSpeed: function(img) {
                this.messageFlag = this.$message({
                    message: '网速测试中',
                    duration: 0,
                    type: 'success'
                });
                this.getSpeedByAjax(
                    speed => {
                        this.ajaxSpeed = speed;
                    },
                    img,
                    this.times
                );
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7214',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            // 初始化带看清单数据
            async getInitData () {
                this.isLoading = true;
                let params = {
                    see_id: this.seeId,
                    order_id: this.orderId
                }
                try {
                    let { data } = await api.getInitList(params);
                    if (data.code == 0) {
                        this.isLoading = false;
                        // 带看信息
                        this.seeInfo = data.data.see_info;
                        if (this.seeInfo.is_dress == 1) {
                            this.seeInfo.is_dress = true;
                        } else {
                            this.seeInfo.is_dress = false;
                        }
                        if (this.seeInfo.is_quiet == 1) {
                            this.seeInfo.is_quiet = true;
                        } else {
                            this.seeInfo.is_quiet = false;
                        }
                        this.seeInfo.plan_real_begin_datetime = this.seeInfo.plan_real_begin_datetime * 1000;
                        // 订单用户
                        this.orderUser = data.data.order_user;
                        // 客户信息
                        this.ruleForm.customerInfo = data.data.customer_info;
                        // 带看楼盘
                        data.data.see_project_list.forEach((v) => {
                            if (v.online_contact_voucher != '') {
                                v.img = [
                                    {
                                        url: '',
                                        name: ''
                                    }
                                ];
                                // 半路径
                                v.img[0].name = `${v.online_contact_voucher.split('.com/')[1]}`;
                                // 全路径
                                v.img[0].url = `${v.online_contact_voucher}`;
                                v.isUpload = true;
                            }
                        })
                        this.ruleForm.projectList = data.data.see_project_list;
                        // 客户需求
                        this.userRequire = data.data.order_require;
                        // 用户需求，判断是否展示范围值
                        this.houseTypeList = data.data.require_default.house_type;
                        this.typeList = data.data.require_default.require_project_type;
                        this.purchaseList = data.data.require_default.purchase_purpose
                        this.qualificationList = data.data.require_default.qualifications;
                        this.totalPrice = this.userRequire.total_price;
                        this.firstPrice = this.userRequire.first_price;
                        this.acreage = this.userRequire.acreage;
                        this.firstPrice.value_max = this.firstPrice.value_max / 10000;
                        this.firstPrice.value_min = this.firstPrice.value_min / 10000;
                        this.totalPrice.value_max = this.totalPrice.value_max / 10000;
                        this.totalPrice.value_min = this.totalPrice.value_min / 10000;
                        this.$set(this.totalPrice, 'isMore', true);
                        this.$set(this.firstPrice, 'isMore', true);
                        this.$set(this.acreage, 'isMore', true);
                        if (this.totalPrice.value_max !== '' && this.totalPrice.value_max !== null && this.totalPrice.value_min !== '' && this.totalPrice.value_min !== null && (this.totalPrice.value_max != this.totalPrice.value_min)) {
                            // 判断最大值和最小值都有值并且不是null
                            this.totalPrice.isMore = true
                        } else {
                            this.totalPrice.isMore = false
                            // 不显示范围，最大值置空
                            this.totalPrice.value_max = ''
                        }
                        // 首付
                        if (this.firstPrice.value_max !== '' && this.firstPrice.value_max !== null && this.firstPrice.value_min !== '' && this.firstPrice.value_min !== null && (this.firstPrice.value_max != this.firstPrice.value_min)) {
                            // 判断最大值和最小值都有值并且不是null
                            this.firstPrice.isMore = true
                        } else {
                            this.firstPrice.isMore = false
                            // 不显示范围，最大值置空
                            this.firstPrice.value_max = ''
                        }
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
                } catch (error) {
                    this.isLoading = false;
                    console.log(error);
                }
            },
            /**
             * 删除客户信息
             * @param {Number} index 当前信息索引
             */
            deleteCusInfo (index) {
                this.ruleForm.customerInfo.splice(index, 1);
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7251',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            }
        },
        watch: {
            // 带看时间
            'seeInfo.plan_real_begin_datetime': {
                handler: function(val, oldval) {
                    if (this.isFir) {
                        return;
                    }
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id,
                        see_time: this.seeInfo.plan_real_begin_datetime / 1000
                    };
                    commonFun.setTrack(
                        '7253',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                },
                deep: true
            },
            // 邀约人id
            'seeInfo.invitation_employee_id': {
                handler: function(val, oldval) {
                    if (this.isFir) {
                        return;
                    }
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id,
                        invite_adviser_id: this.seeInfo.invitation_employee_id
                    };
                    commonFun.setTrack(
                        '7253',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                },
                deep: true
            },
            // 带看人id
            'seeInfo.see_employee_id': {
                handler: function(val, oldval) {
                    if (this.isFir) {
                        return;
                    }
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id,
                        see_adviser_id: this.seeInfo.see_employee_id
                    };
                    commonFun.setTrack(
                        '7253',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                },
                deep: true
            },
            //  带看过程是否穿正装
            'seeInfo.is_dress': {
                handler: function(val, oldval) {
                    if (this.isFir) {
                        return;
                    }
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id,
                        is_affirm: val ? 0 : 1,
                        tab_id: 1
                    };
                    commonFun.setTrack(
                        '7263',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                },
                deep: true
            },
            // 带看过程是否安静
            'seeInfo.is_quiet': {
                handler: function(val, oldval) {
                    if (this.isFir) {
                        return;
                    }
                    // 埋点
                    let paraObj = {
                        order_id: this.orderId,
                        adviser_id: this.trackCommon.info.login_employee_id,
                        is_affirm: val ? 0 : 1,
                        tab_id: 2
                    };
                    commonFun.setTrack(
                        '7263',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                },
                deep: true
            }
        }
    };
</script>

<style lang="less" scoped>
.material-list-box {
    height: 100%;
    overflow-y: auto;
    padding: 0 20px;
    background-color: #EFF3F6;
    .require {
        &::before {
            content: "*";
            color: #F64A4A;
        }
    }
    .small-box-item {
        display: flex;
        font-size: 14px;
        >div {
            flex: 1;
            margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
        }
        .affirm-item {
            display: flex;
            justify-content: space-between;
            &:first-child {
                margin-bottom: 8px;
            }
            /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
                background-color: #2776EF;
                border-color: #2776EF;
            }
            /deep/.el-checkbox__label {
                color: #222;
            }
        }
        .speed {
            color: #2776EF;
        }
        .speed-wrap {
            display: flex;
            justify-content: space-between;
            .speed-btn {
                cursor: pointer;
                flex-shrink: 0;
                font-size: 16px;
                margin-left: 68px;
                color: #fff;
                width: 124px;
                height: 38px;
                line-height: 38px;
                border-radius: 4px;
                text-align: center;
                background-color: #2776EF;
            }
        }
    }
    .save-wrap {
        display: flex;
        justify-content: center;
        padding: 30px 0;
        .save-inner {
            cursor: pointer;
            font-size: 16px;
            width:384px;
            height:40px;
            line-height: 40px;
            color: #fff;
            background:#2776EF;
            border-radius:4px;
            text-align: center;
        }
    }
    .module-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 0 18px;
        color: #222;
        .name {
            font-weight: bold;
            font-size: 24px;
            line-height: 34px;
        }
        .add-info {
            cursor: pointer;
            width: 118px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #fff;
            border-radius: 2px;
            text-align: center;
            background-color: #0AD487;
        }
    }
    .module-content {
        background-color: #fff;
        padding: 30px 20px;
        border-radius: 2px;
        color: #222;
        /deep/.el-input__inner {
            width: 170px;
            height: 38px;
            line-height: 38px;
            color: #333;
            padding: 0 12px;
        }
        /deep/.el-input--prefix .el-input__inner {
            padding-left: 30px;
        }
        /deep/.el-date-editor .el-input__inner, /deep/.el-date-editor.el-input {
            width: 180px;
        }
        /deep/.el-input__suffix {
            display: none;
        }
        /deep/.el-form-item__content {
            margin-left: 0!important;
        }
    }
    .customer-info {
        display: flex;
        font-size: 14px;
        margin-top: 20px;
        &.fixed-custom {
            margin-top: 0;
            .cus-item {
                height: 20px;
                line-height: 20px;
            }
        }
        .cus-item {
            display: flex;
            width: 245px;
            right: 30px;
            margin-right: 30px;
            height: 38px;
            line-height: 38px;
            &:last-child {
                margin-right: 0;
            }
            .name {
                margin-right: 12px;
            }
        }
        .operation {
            cursor: pointer;
            line-height: 38px;
            color: #F64A4A;
        }
    }
    .house-box {
        .take-look-info {
            display: flex;
            padding-bottom: 20px;
            margin-bottom: 12px;
            border-bottom: 1px solid #EDEEEF;
            .info-item {
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                display: flex;
                margin-right: 30px;
                &:last-child {
                    margin-right: 0;
                }
                .name {
                    margin-right: 12px;
                }
                .duration {
                    position: relative;
                    /deep/.el-input__inner {
                        padding-right: 45px;
                    }
                    .unit {
                        position: absolute;
                        bottom: 0;
                        right: 12px;
                    }
                }
            }
        }
        .take-house-hint {
            font-size: 12px;
            color: #F19548;
            > i {
                font-size: 14px;
                position: relative;
                top: 1px;
            }
        }
        .take-house-list {
            font-size: 14px;
            ul {
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .edit-wrap {
                margin-left: 24px;
                color: #77808A;
            }
            .not-arrow {
                cursor: not-allowed;
            }
            .hint-color {
                cursor: pointer;
                color: #2776EF;
            }
            .delete {
                cursor: pointer;
                color: #F64A4A;
                margin-right: 24px;
            }
            .house-info {
                display: flex;
                margin-bottom: 20px;
                &:first-child {
                    margin-top: 12px;
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .voucher {
                position: absolute;
                top: 48px;
            }
            .voucher-wrap {
                font-size: 12px;
                display: flex;
                background-color: #E3F6FE;
                height: 52px;
                line-height: 52px;
                padding: 0 10px;
                /deep/.image-list {
                    display: none;
                }
                /deep/.el-button--primary {
                    padding: 0;
                    color: #2776EF;
                    background-color: transparent;
                    border: none;
                }
                .img-warp {
                    width: 40px;
                    height: 40px;
                    position: relative;
                    margin: 6px 5px 0 0 ;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    i {
                        position: absolute;
                        font-size: 14px;
                        right: -7px;
                        top: -5px;
                    }
                }
            }
            .error-voucher {
                border: 1px solid #F64A4A;
            }
            .err-hint-color {
                color: #F64A4A;
                font-size: 12px;
                line-height: 14px;
                margin-top: 5px;
            }
            .info-wrap {
                display: flex;
                height: 38px;;
                line-height: 38px;
                margin-right: 30px;
                &:first-child {
                    .name {
                        width: 103px;
                        text-align: right;
                    }
                }
                &:last-child {
                    margin-right: 0;
                }
            }
            .has-verify {
                position: relative;
                height: 100px;
                min-width: 330px;
            }
            .name {
                margin-right: 12px;
            }
        }
    }
    .customer-need-box {
        .table {
            width: 100%;
            background-color: #fff;
            .title {
                min-width: 150px;
            }
            .con {
                min-width: 300px;
                /deep/.el-radio-group {
                    .el-radio {
                        font-weight: normal;
                    }
                    .el-radio__label {
                        font-size: 12px !important;
                        color: #222;
                    }
                }
                /deep/.el-checkbox-group {
                    .el-checkbox {
                        font-weight: normal;
                    }
                    .el-checkbox__label {
                        font-size: 12px;
                        color: #222;
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
                    width: 85px;
                    /deep/.el-input {
                        width: 52px;
                        float: left;
                        .el-input__inner {
                            height: 30px;
                            line-height: 30px;
                            font-size: 12px;
                            color: #222;
                            padding: 0 6px;
                            box-sizing: border-box;
                            border-radius: 0;
                        }
                    }
                    .input-unit {
                        float: left;
                        font-size: 12px;
                        color: #222;
                        line-height: 30px;
                        margin-left: 6px;
                    }
                }
                .min-item {
                    margin-right: 10px;
                }
                .unit-operate {
                    float: left;
                    margin-left: 22px;
                    line-height: 30px;
                    font-size: 12px;
                    color: #2776EF;
                    cursor: pointer;
                }
            }
            > .head {
                color: #222;
                border: 1px solid #f3f6f9;
                th {
                    font-size: 16px;
                    height: 50px;
                    text-align: left;
                    box-sizing: border-box;
                    padding: 10px 20px;
                    &.swith {
                        min-width: 150px;
                        text-align: center;
                    }
                }
            }
            > .body {
                font-size: 14px;
                color: #77808a;
                border-left: 1px solid #f3f6f9;
                td {
                    box-sizing: border-box;
                    padding: 10px 20px;
                    height: 50px;
                    word-wrap: break-word;
                    word-break: break-all;
                    border-right: 1px solid #f3f6f9;
                    border-bottom: 1px solid #f3f6f9;
                    &.swith {
                        text-align: center;
                    }
                }
            }
            /deep/.el-radio__input.is-checked .el-radio__inner, /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
                background-color: #2776EF;
                border-color: #2776EF;
            }
        }
        /deep/.el-switch__label--right.is-active {
            z-index: 1111;
            color: #fff !important;
        }
        /deep/.el-switch__label--left.is-active {
            z-index: 1111;
            color: #fff !important;
        }
        /deep/.el-switch__core:after {
            top: 2px;
        }
        /deep/.el-switch__label--left {
            position: relative;
            left: 46px;
            color: #fff;
            z-index: -1111;
        }
        /deep/.el-switch__label--right {
            position: relative;
            right: 46px;
            color: #fff;
            z-index: -1111;
        }
        /deep/.el-switch__core {
            height: 22px !important;
            line-height: 22px !important;
            width: 46px !important;
            border-radius: 15px !important;
        }
    }
}
</style>

