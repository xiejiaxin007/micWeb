<!--
 * @author: xiejiaxin
 * @Date: 2020-09-04 15:51:29
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 18:08:56
 * @description: 新增楼盘弹窗
-->
<template>
    <el-dialog :title="title"
        :visible.sync="dialogVisble"
        @close="cancel"
        :close-on-click-modal="false"
        v-loading="loading"
        width="850px"
        center>
        <div class="form-content"
            ref="formContent">
            <el-form :model="houseForm"
                :rules="houseRules"
                label-width="120px"
                class="house-form-box"
                ref="houseForm">
                <!-- 根据楼盘ID获取楼盘信息 -->
                <div class="house-info-box">
                    <el-form-item prop="id"
                        class="house"
                        label="楼盘ID">
                        <el-select v-model="houseForm.id"
                            filterable
                            remote
                            :remote-method="remoteHouseId"
                            :houseLoading="houseLoading"
                            placeholder="请选择楼盘ID">
                            <el-option v-for="item in houseIdList"
                                :key="item.value"
                                :label="item.name"
                                @click.native="changeHouseId(item)"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="house-info"
                        v-if="houseInfo">
                        <span>{{houseInfo.name}}</span>
                        <span>{{houseInfo.type}}</span>
                    </div>
                </div>
                <el-form-item prop="level"
                    label="楼盘等级输入">
                    <el-select v-model="houseForm.level"
                        placeholder="请选择楼盘等级">
                        <el-option v-for="item in config.project_level"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="exclusive"
                    label="是否居理专属">
                    <el-radio-group v-model="houseForm.exclusive">
                        <el-radio v-for="item in config.is_julive_promotion"
                            :key="item.value"
                            :label="item.value">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="type"
                    label="优惠类型选择">
                    <el-select v-model="houseForm.type"
                        @change="changeType"
                        placeholder="请选择优惠类型">
                        <el-option v-for="item in config.promotion_config"
                            :key="item.value"
                            @click.native="changeAddition(item)"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="rule-box">
                    <div class="th">提报规则</div>
                    <div class="td">{{activityInfo.submission_rule}}</div>
                </div>
                <!-- 优惠信息录入 -->
                <div class="rule-box">
                    <div class="th required">优惠信息录入</div>
                    <div class="td">
                        <div class="preferential-box">
                            <div class="house-info-box"
                                v-if="houseForm.type !== '4'">
                                <!-- 优惠类型为4（特价）时候不展示 -->
                                <el-form-item prop="houseRange"
                                    ref="houseRange"
                                    label="房源范围">
                                    <el-select v-model="houseForm.houseRange"
                                        :disabled="!houseForm.type"
                                        placeholder="请选择房源范围">
                                        <el-option v-for="item in preferentialConfig.house_resource"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 房源范围选择10（指定房源）的时候展示 -->
                                <el-form-item prop="houseNum"
                                    class="house-info-right"
                                    ref="houseNum"
                                    label-width="0"
                                    v-if="houseForm.houseRange === '10'"
                                    label="">
                                    <div>
                                        <el-input v-model="houseForm.houseNum"></el-input>号楼
                                    </div>
                                </el-form-item>
                            </div>
                            <!-- 优惠类型不为4（特价）展示 -->
                            <el-form-item prop="preferential"
                                v-if="houseForm.type !== '4'"
                                ref="preferential"
                                label="优惠方式">
                                <el-select v-model="houseForm.preferential"
                                    :disabled="!houseForm.type"
                                    placeholder="请选择优惠方式">
                                    <el-option v-for="item in preferentialConfig.promotion_category"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="discribe"
                                class="fix-width-input"
                                ref="discribe"
                                label="优惠描述">
                                <!-- 优惠类型不为4（特价）展示 -->
                                <el-input v-model="houseForm.discribe"
                                    v-if="houseForm.type !== '4'"
                                    :disabled="!houseForm.type"
                                    maxlength="8"
                                    placeholder="请输入优惠描述"></el-input>
                                <!-- 优惠类型为4（特价）展示成数字输入框 -->
                                <jl-number-input
                                    reg="int"
                                    v-else
                                    maxlength="8"
                                    :disabled="!houseForm.type"
                                    v-model="houseForm.discribe"></jl-number-input>
                            </el-form-item>
                            <!-- 优惠类型1（买赠）展示 -->
                            <el-form-item prop="unit"
                                v-if="houseForm.type !== '1'"
                                ref="unit"
                                label="单位">
                                <el-select v-model="houseForm.unit"
                                    :disabled="!houseForm.type"
                                    placeholder="请选择单位">
                                    <el-option v-for="item in preferentialConfig.unit"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="house-info-box">
                                <el-form-item prop="additional"
                                    ref="additional"
                                    label="是否额外优惠">
                                    <el-radio-group v-model="houseForm.additional"
                                        :disabled="!houseForm.type"
                                        class="sort-radio">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="2">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 是否额外优惠选择了是 -->
                                <div class="additional-box"
                                    v-if="houseForm.additional === '1'">
                                    <div class="house-info-box">
                                        <el-form-item prop="additionalId"
                                            ref="additionalId"
                                            label-width="80px"
                                            label="额外优惠">
                                            <el-select v-model="houseForm.additionalId"
                                                class="sort-input"
                                                placeholder="请选择">
                                                <el-option v-for="item in preferentialConfig.more_promotion"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="additionalCon"
                                            label-width="60px"
                                            ref="additionalCon"
                                            label="补充">
                                            <el-input v-model="houseForm.additionalCon"
                                                class="sort-input"
                                                maxlength="8"
                                                placeholder="请输入补充信息"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-form-item prop="dateTime"
                    label="楼盘活动时间">
                    <el-date-picker v-model="houseForm.dateTime"
                        type="datetimerange"
                        value-format="timestamp"
                        range-separator="至"
                        :default-time="['00:00:00', '23:59:59']"
                        @change="changeDate"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="hasSpecialHouse"
                    v-if="houseForm.type === '4'"
                    ref="hasSpecialHouse"
                    label-width="150px"
                    label="是否填写特价房房号">
                    <el-radio-group v-model="houseForm.hasSpecialHouse"
                        @change="changeSpecial">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 优惠类型是特价，并且 是否填写特价房房号 选择了是 -->
                <div class="rule-box"
                    v-if="houseForm.type === '4' && houseForm.hasSpecialHouse === '1'">
                    <div class="th required">特价房信息</div>
                    <div class="td">
                        <div class="special-house-box">
                            <el-table
                                :data="houseForm.specialHouseList">
                                <el-table-column
                                    prop="roomNum"
                                    label="特价房">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="`specialHouseList.${scope.$index}.room_num`"
                                            label-width="0"
                                            :rules="[{ required: true, message: '', trigger: 'blur' }]"
                                            label="">
                                            <el-input v-model.trim="scope.row.room_num"
                                                class="sort-input"></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="area"
                                    label="面积">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="`specialHouseList.${scope.$index}.area`"
                                            label-width="0"
                                            :rules="[{ required: true, message: '', trigger: 'blur' }]"
                                            label="">
                                            <jl-number-input
                                                reg="fourNum"
                                                class="sort-input"
                                                v-model.trim="scope.row.area"></jl-number-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="totalPrice"
                                    label="原总价(万元)">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="`specialHouseList.${scope.$index}.total_price`"
                                            label-width="0"
                                            :rules="[{ required: true, message: '', trigger: 'blur' }]"
                                            label="">
                                            <jl-number-input
                                                reg="fourNum"
                                                class="sort-input"
                                                v-model.trim="scope.row.total_price"></jl-number-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="specialPrice"
                                    label="特价(万元)">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="`specialHouseList.${scope.$index}.special_price`"
                                            :rules="[{ required: true, message: '', trigger: 'blur' }]"
                                            label-width="0"
                                            label="">
                                            <jl-number-input
                                                reg="fourNum"
                                                class="sort-input"
                                                v-model.trim="scope.row.special_price"></jl-number-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作">
                                    <template slot-scope="scope">
                                        <span class="btn-delete"
                                            @click="delHouse(scope.$index)">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="tb-operate">
                            <el-button type="primary"
                                size="mini"
                                @click="addHouse">新增特价房</el-button>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
        <div slot="footer"
            class="dialog-footer">
            <el-button type="primary"
                @click="confirm">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import api from '../api/api';
import commonApi from '@/api/commonApi';
import { SearchSelectRadio } from '@/components';
export default {
    name: 'add-house-dialog',
    components: {
        SearchSelectRadio
    },
    props: {
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 提报规则
        activityInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 弹窗类型 add--新增，edit--编辑
        dialogType: {
            type: String,
            default: 'add'
        },
        // 活动ID
        appId: {
            type: String | Number,
            default: ''
        },
        // 弹窗标题
        title: {
            type: String,
            default: '新增楼盘信息'
        },
        // 提报城市
        cities: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
            if (newVal) {
                // 初始化
                this.init();
            }
        }
    },
    data() {
        // 校验日期
        let validateDate = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('请选择楼盘活动时间'));
            } else {
                callback();
            }
        };
        return {
            // 楼盘ID筛选下拉loading
            houseLoading: false,
            // 楼盘ID下拉
            houseIdList: [],
            // 下拉配置对象
            config: {},
            // 楼盘信息
            houseInfo: {
                name: '',
                type: ''
            },
            // 加载
            loading: false,
            // 弹窗展示
            dialogVisble: this.visible,
            // 基础信息表单
            houseForm: {
                // 楼盘ID
                id: '',
                // 楼盘等级
                level: '',
                // 专属
                exclusive: '2',
                // 优惠类型
                type: '',
                // 房源范围
                houseRange: '',
                // 几号楼
                houseNum: '',
                // 优惠方式
                preferential: '',
                // 优惠描述
                discribe: '',
                // 单位
                unit: '',
                // 是否额外优惠
                additional: '2',
                // 额外优惠
                additionalId: '',
                // 补充信息
                additionalCon: '',
                // 楼盘活动时间
                dateTime: [],
                // 是否填写特价房房号
                hasSpecialHouse: '',
                // 特价房信息
                specialHouseList: []
            },
            // 优惠信息录入配置
            preferentialConfig: {},
            // 基础信息表单验证规则
            houseRules: {
                // 楼盘ID
                id: [{ required: true, message: '请输入楼盘ID', trigger: 'blur' }],
                // 楼盘等级
                level: [{ required: true, message: '请选择楼盘等级', trigger: 'change' }],
                // 专属
                exclusive: [{ required: true, message: '请选择是否居理专属', trigger: 'change' }],
                // 优惠类型
                type: [{ required: true, message: '请选择优惠类型', trigger: 'change' }],
                // 楼盘活动时间
                dateTime: [{ required: true, validator: validateDate, message: '请选择楼盘活动时间', trigger: 'blur' }],
                // 房源范围
                houseRange: [{ required: true, message: '请选择房源范围', trigger: 'change' }],
                // 几号楼
                houseNum: [{ required: true, message: '请输入', trigger: 'blur' }],
                // 优惠方式
                preferential: [{ required: true, message: '请选择优惠方式', trigger: 'change' }],
                // 优惠描述
                discribe: [{ required: true, message: '请输入优惠描述', trigger: 'blur' }],
                // 单位
                unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
                // 额外优惠
                additionalId: [{ required: true, message: '请选择是否额外优惠', trigger: 'change' }],
                // 补充信息
                additionalCon: [{ required: true, message: '请输入补充信息', trigger: 'blur' }],
                // 是否额外优惠
                additional: [{ required: true, message: '请选择额外优惠', trigger: 'change' }],
                // 是否填写特价房房号
                hasSpecialHouse: [{ required: true, message: '请选择是否填写特价房房号', trigger: 'change' }]
            },
            // 提报类型
            type: this.$route.query.type,
            // 提报ID
            id: this.$route.query.id,
            // 重复提交标志
            flag: true
        };
    },
    methods: {
        /**
         * @description: 切换楼盘ID
         * @param {Object} val 选中项数据对象
         */  
        changeHouseId(val) {
            this.houseInfo.name = val.project_info ? val.project_info.name : '';
            this.houseInfo.type = val.project_info ? val.project_info.project_type_text : '';
        },
        /**
         * 远程搜索
         * @param {String} query 关键字
         * @return {Promise}
         */
        async remoteHouseId(query) {
            try {
                let params = {
                    project_id: query,
                    city_id: this.cities
                };
                const {
                    data: { code, msg, data }
                } = await commonApi.getHouseIdList(params);
                if (code === 0) {
                    this.houseIdList = data ? data.list : []; 
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 切换优惠类型
         * @param {String} val 选中的优惠类型
         */
        changeType(val) {
            // 清空依赖优惠类型的表单
            this.$refs['houseRange'] && this.$refs['houseRange'].resetField();
            this.$refs['preferential'] && this.$refs['preferential'].resetField();
            this.$refs['discribe'] && this.$refs['discribe'].resetField();
            this.$refs['unit'] && this.$refs['unit'].resetField();
            this.$refs['houseNum'] && this.$refs['houseNum'].resetField();
            this.$refs['additional'] && this.$refs['additional'].resetField();
            this.$refs['additionalId'] && this.$refs['additionalId'].resetField();
            this.$refs['additionalCon'] && this.$refs['additionalCon'].resetField();
            this.$refs['hasSpecialHouse'] && this.$refs['hasSpecialHouse'].resetField();
            this.houseForm.specialHouseList = [];
        },
        /**
         * @description: 修改是否填写特价房
         * @param {String} val 选中值，如果选择是，下面会出现特价房信息，弹窗滚动条滑动到最底部，否则看不出来有新增内容
         */
        changeSpecial(val) {
            if (val === '1') {
                let dom = this.$refs.formContent;
                let scrollHeight = dom.scrollHeight;
                let cliHeight = dom.clientHeight;
                if (dom.scrollHeight > cliHeight) {
                    dom.scrollTop = scrollHeight;
                }
            }
        },
        /**
         * @description: 删除特价房
         * @param {index} 删除项的索引
         */
        delHouse(index) {
            this.houseForm.specialHouseList.splice(index, 1);
        },
        // 新增特价房
        addHouse() {
            let houseObj = {
                id: '',
                room_num: '',
                area: '',
                special_price: '',
                total_price: ''
            }
            this.houseForm.specialHouseList.push(houseObj);
        },
        /**
         * @description: 初始化字段
         * @param {type} 
         * @return {type} 
         */
        async init() {
            try {
                this.loading = true;
                let params = {
                    submission_type: this.type,
                    submission_id: this.id
                };
                if (this.dialogType === 'edit') {
                    params.app_id = this.appId
                }
                const {
                    data: { code, msg, data }
                } = await api.activityInit(params);
                if (code === 0) {
                    this.config = data.config ? data.config : {};
                    // 初始化赋值
                    const { detail } = data;
                    if (JSON.stringify(detail) !== '{}') {
                        this.houseForm.id = detail.project_id;
                        this.houseForm.level = detail.project_level || '';
                        this.houseForm.exclusive = detail.is_julive ? detail.is_julive : '2';
                        this.houseForm.type = detail.promotion_type || '';
                        // 优惠类型有默认值，需要手动给优惠信息下拉赋值
                        if (this.houseForm.type) {
                            this.getPreferentialInfo(this.houseForm.type);
                        }
                        this.houseForm.houseRange = detail.house_resource || '';
                        this.houseForm.houseNum = detail.house_resource_text;
                        this.houseForm.preferential = detail.promotion_category || '';
                        this.houseForm.discribe = detail.promotion_desc;
                        this.houseForm.unit = detail.unit || '';
                        this.houseForm.additional = detail.has_more_promotion || '2';
                        this.houseForm.additionalId = detail.more_promotion || '';
                        this.houseForm.additionalCon = detail.more_promotion_desc;
                        this.houseForm.dateTime = [detail.start_time * 1000, detail.end_time * 1000];
                        this.houseForm.hasSpecialHouse = detail.is_special_house || '';
                        this.houseForm.specialHouseList = detail.special_house ? detail.special_house : [];
                        this.houseInfo.name = detail.project_name || '';
                        this.houseInfo.type = detail.project_type || '';
                    }
                    if (this.dialogType === 'add') {
                        // 如果是新增，需要给楼盘活动时间默认值
                        let startTime = this.activityInfo.activity_time_start ? this.activityInfo.activity_time_start : '';
                        let endTime = this.activityInfo.activity_time_end ? this.activityInfo.activity_time_end : '';
                        this.houseForm.dateTime = [new Date(startTime), new Date(endTime)];

                    }
                    // 滚动条滚动到上面
                    this.scrollInit();
                } else {
                    this.$message.error(msg);
                }
                this.loading = false;
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        // 滚动条滚动到顶部
        scrollInit() {
            let dom = this.$refs.formContent;
            dom.scrollTop = 0;
        },
        /**
         * @description: 根据优惠类型ID查找优惠信息下拉
         * @param {String} val 优惠类型下拉选中 
         */
        getPreferentialInfo(val) {
            this.preferentialConfig = this.config.promotion_config[val] ? this.config.promotion_config[val].child : {};
        },
        /**
         * @description: 修改优惠类型
         * @param {Object} val 选中的项
         */
        changeAddition(val) {
            if (val.value === '4') {
                // 优惠类型是特价，清空优惠描述字段，修改为数字输入框
                this.houseForm.discribe = '';
            }
            // 联动修改优惠信息下拉
            this.preferentialConfig = val.child;
        },
        // 关闭弹窗时重置表单
        cancel() {
            this.$refs.houseForm.resetFields();
            this.dialogVisble = false;
            this.houseInfo.name = '';
            this.houseInfo.type = '';
            this.$emit('update:visible', false);
        },
        /**
         * @description: 日期修改，判断如果清空，则赋值为空数组，防止提交时候报错
         * @param {Arrary || Object} val
         */
        changeDate(val) {
            if (!val) {
                this.search.date = [];
            }
        },
        // 提交
        async submitData() {
            if (!this.flag) return;
            // 判断如果如果有房号，需要校验输入的优惠描述是跟特价房数量一直，如果不一致抛出错误
            if (this.houseForm.type === '4' && this.houseForm.hasSpecialHouse === '1' && this.houseForm.discribe != this.houseForm.specialHouseList.length) {
                this.$message.warning('单位数量与特价房数量不符');
                return;
            }
            this.flag = false;
            try {
                this.loading = true;
                let params = {
                    submission_type: this.type,
                    submission_id: this.id,
                    id: this.appId,
                    project_id: this.houseForm.id,
                    project_level: this.houseForm.level,
                    is_julive: this.houseForm.exclusive,
                    promotion_type: this.houseForm.type,
                    house_resource: this.houseForm.houseRange,
                    house_resource_text: this.houseForm.houseNum,
                    promotion_category: this.houseForm.preferential,
                    promotion_desc: this.houseForm.discribe,
                    unit: this.houseForm.unit,
                    has_more_promotion: this.houseForm.additional,
                    more_promotion: this.houseForm.additionalId,
                    more_promotion_desc: this.houseForm.additionalCon,
                    start_time: this.houseForm.dateTime.length > 0 ? this.houseForm.dateTime[0] / 1000 : '',
                    end_time: this.houseForm.dateTime.length > 1 ? this.houseForm.dateTime[1] / 1000 : '',
                    is_special_house: this.houseForm.hasSpecialHouse,
                    special_house: this.houseForm.specialHouseList
                };
                const {
                    data: { code, msg }
                } = await api.createActivity(params);
                if (code === 0) {
                    // 关闭弹窗
                    this.cancel();
                    this.$emit('success');
                } else {
                    this.$message.error(msg);
                }
                this.flag = true;
                this.loading = false;
            } catch (err) {
                this.loading = false;
                this.flag = true;
                console.log(err);
            }
        },
        async checkWords() {
            let str = '优惠描述$' + this.houseForm.discribe + '|||' + '指定楼号$' + this.houseForm.houseNum + '|||' + '额外优惠补充$' + this.houseForm.additionalCon ;
            try {
                let params = {
                    str,
                    project_id: this.houseForm.id,
                    // 是不是新建楼盘，直接传2=不是新建楼盘
                    is_create_project: 2
                };
                let result = await commonApi.checkSensitiveWordsData(params);
                let { data } = result;
                if (data.code === 200) {
                    return true;
                } else {
                    this.$message(data.msg);
                    return false;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 提交
        confirm() {
            this.$refs['houseForm'].validate((valid) => {
                if (valid) {
                    // 敏感词校验
                    this.checkWords().then((res) => {
                        // 提交数据
                        if (res) {
                            this.submitData();
                        }
                    });
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.special-house-box {
    /deep/.el-table {
        th {
            padding: 0;
        }
        td {
            padding: 8px 0;
        }
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
.form-content {
    .sort-input {
        width: 80px;
        /deep/.el-input {
            width: 100%;
        }
    }
}
.btn-delete {
    color: #ff0000;
    cursor: pointer;
}
.form-content {
    max-height: 500px;
    overflow: auto;
    padding-right: 20px;
    /deep/.el-range-editor {
        .el-range-input {
            background-color: transparent;
        }
    }
    .bottom-form-item {
        margin-bottom: 0;
    }
}
.house-form-box {
    .house {
        float: left;
        width: 300px;
    }
}
.house-info-box {
    display: flex;
    .house-info {
        line-height: 40px;
        & > span {
            margin-left: 30px;
        }
        /deep/.el-input {
            width: 120px;
            margin: 0 6px 0 20px;
        }
    }
    .house-info-right {
        margin-left: 20px;
        /deep/.el-input {
            width: 120px;
        }
    }
}
.preferential-box {
    border: 1px dashed #ddd;
    padding-top: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    /deep/.el-select {
        width: 190px;
    }
    /deep/.el-input {
        width: 190px;
    }
    .sort-input {
        width: 130px;
        /deep/.el-input {
            width: 100%;
        }
    }
    .sort-radio {
        .el-radio {
            margin-right: 16px;
        }
    }
}
.rule-box {
    line-height: 40px;
    margin-bottom: 22px;
    overflow: hidden;
    .th {
        width: 120px;
        text-align: right;
        float: left;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        &.required {
            &::before {
                content: '*';
                color: #f56c6c;
                margin-right: 4px;
            }
        }
    }
    .td {
        overflow: hidden;
    }
}
</style>