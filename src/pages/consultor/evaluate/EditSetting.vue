<!--
 * @Name: 编辑评价配置页
 * @Description: 编辑评价配置页
 * @Author: zhengchao
 * @Date: 2019-12-03
 -->
<template>
    <div class="edit-auto-group">
        <!--面包屑-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/evaluate/settingList' }">评价配置页</el-breadcrumb-item>
            <el-breadcrumb-item>{{pageTitle}}评价标签</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 评价配置 -->
        <div class="v-box group-config">
            <div class="hd">
                <h2>{{pageTitle}}评价标签{{oldTagName}}</h2>
            </div>
            <div class="bd">
                <el-form :model="evaluateForm"
                    ref="evaluateForm"
                    :rules="rules"
                    label-width="152px">
                    <el-form-item label="评价："
                        prop="evaluateType">
                        <el-radio-group v-model="evaluateForm.evaluateType"
                            @change="changeType">
                            <el-radio v-for="(item, index) in evaluateTypeOpts"
                                :key="`radio-${index}`"
                                :label="item.id"
                                :disabled="canEdit">{{item.text}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类型："
                        prop="type">
                        <el-radio-group v-model="evaluateForm.type"
                            @change="typeChange">
                            <el-radio v-for="(item, index) in typeOpts"
                                :key="`radio-${index}`"
                                :label="item.id"
                                :disabled="canEdit">{{item.text}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="evaluateForm.type === '2'"
                        label="答案数量："
                        prop="answerNum">
                        <el-radio-group v-model="evaluateForm.answerNum"
                            @change="answerChange">
                            <el-radio v-for="(item, index) in answerNumOpts"
                                :key="`radio-${index}`"
                                :label="item.id"
                                :disabled="canEdit">{{item.text}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="evaluateForm.type === '2' && evaluateForm.evaluateType === '1'"
                        label="带看类型："
                        prop="seeType">
                        <el-radio-group v-model="evaluateForm.seeType">
                            <el-radio v-for="(item, index) in seeTypeOpts"
                                :key="`radio-${index}`"
                                :label="item.id">{{item.text}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="evaluateForm.type === '2' && evaluateForm.evaluateType === '1'"
                        label="城市："
                        prop="city">
                        <select-city v-model="evaluateForm.city"
                            filterable
                            :showMore="true"
                            class="city-select"></select-city>
                    </el-form-item>
                    <el-form-item label="星级："
                        prop="stars">
                        <el-checkbox :label="0"
                            v-model="allStar"
                            @change="allStarChange">
                            全部星级
                        </el-checkbox>
                        <el-checkbox-group v-model="evaluateForm.stars">
                            <el-checkbox v-for="(channel, index) in starOpts"
                                :key="`channel-${index}`"
                                :label="channel.id">
                                {{channel.text}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="evaluateForm.type === '2' ?'问题文案：' : '文案：'"
                        prop="title">
                        <el-input v-model.trim="evaluateForm.title"
                            :placeholder="'请输入文案'"
                            :maxlength="evaluateForm.type === '2' ? '40' : '10'"></el-input>
                    </el-form-item>
                    <!-- 问题子选项 -->
                    <template v-if="evaluateForm.type === '2'">
                        <div class="auto">
                            <div class="th required">答案：</div>
                            <div class="td">
                                <div class="flex-box ansower-box">
                                    <div class="flex-start">
                                        <span class="label-tit">正向</span>
                                        <div class="label-icon-wrap">
                                            <img src="./images/img-yesv.png"
                                                alt="正向答案" />
                                        </div>
                                    </div>
                                    <div class="flex-center">
                                        <span class="label-tit">文案</span>
                                        <el-form-item label=""
                                            label-width="0"
                                            ref="yesItem"
                                            prop="yesText"
                                            :rules="{ required: true, validator: answerInput, trigger: 'blur' }">
                                            <el-input v-model.trim="evaluateForm.yesText"
                                                :placeholder="'请输入正向文案'"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="flex-end">
                                        <el-select filterable
                                            clearable
                                            v-model="evaluateForm.yesTagId"
                                            placeholder="请选择关联标签">
                                            <el-option v-for="item in options"
                                                :key="item.tag_config_id"
                                                :label="`${item.tag_name}${item.tag_config_id === '0' ? '' : '_' + item.tag_config_id}`"
                                                :value="item.tag_config_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="flex-box ansower-box"
                                    v-if="evaluateForm.answerNum === '3'">
                                    <div class="flex-start">
                                        <span class="label-tit">中间</span>
                                        <div class="label-icon-wrap">
                                            <img src="./images/img-middle.png"
                                                alt="中间答案" />
                                        </div>
                                    </div>
                                    <div class="flex-center">
                                        <span class="label-tit">文案</span>
                                        <el-form-item label=""
                                            label-width="0"
                                            ref="middleItem"
                                            prop="middleText"
                                            :rules="{ required: true, validator: answerInput, trigger: 'blur' }">
                                            <el-input v-model.trim="evaluateForm.middleText"
                                                :placeholder="'请输入中间文案'"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="flex-end">
                                        <el-select filterable
                                            clearable
                                            v-model="evaluateForm.middleId"
                                            placeholder="请选择关联标签">
                                            <el-option v-for="item in options"
                                                :key="item.tag_config_id"
                                                :label="`${item.tag_name}${item.tag_config_id === '0' ? '' : '_' + item.tag_config_id}`"
                                                :value="item.tag_config_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="flex-box ansower-box">
                                    <div class="flex-start">
                                        <span class="label-tit">负向</span>
                                        <div class="label-icon-wrap">
                                            <img src="./images/img-nov.png"
                                                alt="负向答案" />
                                        </div>
                                    </div>
                                    <div class="flex-center">
                                        <span class="label-tit">文案</span>
                                        <el-form-item label=""
                                            label-width="0"
                                            prop="noText"
                                            ref="noItem"
                                            :rules="{ required: true, validator: answerInput, trigger: 'blur' }">
                                            <el-input v-model.trim="evaluateForm.noText"
                                                :placeholder="'请输入负向文案'"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="flex-end">
                                        <el-select v-model="evaluateForm.noTagId"
                                            clearable
                                            filterable
                                            placeholder="请选择关联标签">
                                            <el-option v-for="item in options"
                                                :key="item.tag_config_id"
                                                :label="`${item.tag_name}${item.tag_config_id === '0' ? '' : '_' + item.tag_config_id}`"
                                                :value="item.tag_config_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-form-item label="图片："
                            prop="imgShow">
                            <el-radio-group v-model="evaluateForm.imgShow">
                                <el-radio :label="1">无图</el-radio>
                                <el-radio :label="2">有图</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="evaluateForm.imgShow === 2"
                            label="图片预览："
                            prop="imgUrl">
                            <div class="img-wrap"
                                v-if="imgSrc !== ''">
                                <i class="btn-close"
                                    @click="delImg"
                                    aria-hidden="true">
                                    -
                                </i>
                                <div class="img">
                                    <img alt="预览图片"
                                        :src="imgSrc" />
                                </div>
                            </div>
                            <jl-file-upload v-else
                                ref="uploadBtn"
                                upID="uploadBtn"
                                fileType="png,jpg,jpeg,gif"
                                fileMaxSize="10mb"
                                :ossData="ossData"
                                :isCropper="true"
                                :ratio="[1,1]"
                                @beforeUpdate="loading = true"
                                @getFileURL="getFileURL">
                                <el-button size="small"
                                    plain>
                                    <i class="el-icon-upload"
                                        aria-hidden="true"></i>点击上传
                                </el-button>
                            </jl-file-upload>
                        </el-form-item>
                    </template>
                    <!-- 标签子选项 -->
                    <el-form-item v-else
                        label="排序："
                        prop="level">
                        <jl-number-input
                            v-model.trim="evaluateForm.level"
                            reg="parseInt"
                            placeholder="请输入排序数字"
                        ></jl-number-input>
                    </el-form-item>
                    <el-form-item label="是否显示："
                        prop="isShow">
                        <el-radio-group v-model="evaluateForm.isShow">
                            <el-radio v-for="(item, index) in showOpts"
                                :key="`radio-${index}`"
                                :label="item.id">{{item.text}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn-area">
                <el-button type="primary"
                    @click="saveConfig">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { EVALUATE_TYPE, EVALUATE_SET_TYPE, STAR_LEVEL, SHOW_HIDDEN, EVALUATE_ANSWER_NUM, SEE_TYPE } from './config/dataConfig';
import apiObj from './api/evaluate';
import { mapState } from 'vuex';
import { getSign } from '@/api/commonApi';
import SelectCity from '@/components/SelectCity';
export default {
    name: 'editSetting',
    components: {
        SelectCity
    },
    data() {
        let validateTitle = (rule, value, callback) => {
            if (value) {
                if (this.evaluateForm.type === '2') {
                    // 文案是问题类型
                    if (value.length > 40) {
                        callback(new Error('请控制在40个字内'));
                    }
                } else if (this.evaluateForm.type === '1') {
                    // 文案是标签类型
                    if (value.length > 10) {
                        callback(new Error('请控制在10个字内'));
                    }
                }
            }
            callback();
        };
        return {
            // 表单项
            evaluateForm: {
                // 评价类型
                evaluateType: '',
                // 配置类型
                type: '',
                // 答案个数
                answerNum: '2',
                // 带看类型
                seeType: '3',
                // 城市
                city: [],
                // 星级
                stars: [],
                // 文案（问题文案）
                title: '',
                // 正向答案
                yesText: '',
                // 负向答案
                noText: '',
                // 中间答案
                middleText: '',
                // 配置标签正向
                yesTagId: '',
                // 配置标签负向
                noTagId: '',
                // 中间标签
                middleId: '',
                // 是否有图
                imgShow: 1,
                // 图的url
                imgUrl: '',
                // 排序
                level: '',
                // 是否展示 1展示 2隐藏
                isShow: '1'
            },
            // 表单规则
            rules: Object.freeze({
                evaluateType: [{ required: true, message: '评价类型至少选择一项', trigger: 'change' }],
                type: [{ required: true, message: '配置类型至少选择一项', trigger: 'change' }],
                answerNum: [{ required: true, message: '答案数量不能为空', trigger: 'change' }],
                seeType: [{ required: true, message: '请选择带看类型', trigger: 'change' }],
                city: [{ type: 'array', required: true, message: '请选择城市', trigger: 'change' }],
                stars: [{ type: 'array', required: true, message: '至少选择一个星级', trigger: 'change' }],
                title: [
                    { required: true, message: '请输入文案', trigger: 'change' },
                    { validator: validateTitle, trigger: 'blur' }
                ],
                level: [{ required: true, message: '请输入排序', trigger: 'change' }],
                imgUrl: [{ required: true, message: '请选择图片', trigger: 'change' }]
            }),
            // 评价类型筛选项
            evaluateTypeOpts: Object.freeze(EVALUATE_TYPE),
            // 配置类型筛选项
            typeOpts: Object.freeze(EVALUATE_SET_TYPE),
            // 星级筛选项
            starOpts: Object.freeze(STAR_LEVEL),
            // 是否展示
            showOpts: Object.freeze(SHOW_HIDDEN),
            // 答案数量选择
            answerNumOpts: Object.freeze(EVALUATE_ANSWER_NUM),
            // 带看类型选择
            seeTypeOpts: Object.freeze(SEE_TYPE),
            // 问题答案标签下拉列表
            options: [],
            // 配置id
            configId: '0',
            // 图片预览路径/base64
            imgSrc: '',
            // 标签标题
            oldTagName: '',
            // 请求阿里地址返回的数据
            ossData: {},
            loading: false,
            // 是否正在提交标志
            isSubmit: false
        };
    },
    created() {
        this.getSignCode();
        // 如果用户权限是 总管理员；
        if (this.role === 'admin') {
            this.pageInit();
        }
    },
    computed: {
        ...mapState({
            // 权限： 总管理员
            role: state => state.role
        }),
        // 页面标题 新增/编辑
        pageTitle() {
            return this.configId !== '0' ? '编辑' : '新增';
        },
        // 答案校验数量
        answerRule() {
            return this.evaluateForm.answerNum === '3' ? 4 : 8;
        },
        // 判断当前项是否可编辑
        canEdit() {
            return this.configId !== '0';
        },
        // 选中所有星星
        allStar() {
            return this.evaluateForm.stars.length >= 5;
        }
    },
    methods: {
        /**
         * @description: 修改问题数量选项
         * @param {String} val 选项值
         */
        answerChange(val) {
            this.$refs['yesItem'] && this.$refs['yesItem'].resetField();
            this.$refs['middleItem'] && this.$refs['middleItem'].resetField();
            this.$refs['noItem'] && this.$refs['noItem'].resetField();
        },
        /**
         * 获取输入内容改变方法
         * @param {Object} rule 校验规则
         * @param {string} value 值
         * @param {Funcion} callback 回调函数
         */
        answerInput(rule, value, callback) {
            if (value.replace(/\s+/g, '')) {
                if (value.length <= this.answerRule) {
                    callback();
                } else {
                    callback(new Error(`最多输入${this.answerRule}个字`));
                }
            } else {
                switch (rule.field) {
                    case 'yesText':
                        callback(new Error('请输入正向答案文案'));
                        break;
                    case 'noText':
                        callback(new Error('请输入负向答案文案'));
                        break;
                    case 'middleText':
                        callback(new Error('请输入中间答案文案'));
                        break;
                }
            }
        },
        /**
         * 获取文件
         * @param {String} fileList 文件列表
         * @param {String} type 类型
         * @return
         */
        getFileURL(fileList, type) {
            // 关闭加载loading
            this.loading = false;
            // 如果返回文件列表长度为0
            if (fileList.length === 0) {
                this.$message('上传失败,请重新上传');
                return;
            } else {
                this.imgSrc = fileList[0].fileURL;
                this.evaluateForm.imgUrl = fileList[0].upURL;
            }
            this.$refs.evaluateForm.clearValidate(['imgUrl']);
        },
        // 获取阿里云上传签名
        async getSignCode() {
            let params = {
                cate: this.uploadUrl
            };
            try {
                let { data } = await getSign(params);
                if (data.code === 0) {
                    this.ossData = data.data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 页面初始化处理
        pageInit() {
            // 配置id
            this.configId = this.$route.query.setId;
            // 判断是编辑时查询配置详情
            if (this.configId !== '0') {
                this.initData();
            }
            // 获取与答案关联标签下拉菜单
            this.initTagOpts();
        },
        // 保存配置数据
        saveConfig() {
            try {
                this.$refs['evaluateForm'].validate(async valid => {
                    if (valid) {
                        if (this.isSubmit) {
                            return false;
                        }
                        this.isSubmit = true;
                        // 提交的数据 进行赋值
                        let upData = {
                            type: this.evaluateForm.evaluateType,
                            name: this.evaluateForm.title,
                            grade_levels: this.evaluateForm.stars.join(','),
                            is_show: this.evaluateForm.isShow,
                            sort: this.evaluateForm.level,
                            config_type: this.evaluateForm.type,
                            img_url: this.evaluateForm.imgShow === 1 ? '' : this.evaluateForm.imgUrl,
                            answer_number: this.evaluateForm.answerNum,
                            yes_text: this.evaluateForm.yesText,
                            no_text: this.evaluateForm.noText,
                            middle_text: this.evaluateForm.middleText,
                            yes_tag_config_id: this.evaluateForm.yesTagId === '0' ? '' : this.evaluateForm.yesTagId,
                            no_tag_config_id: this.evaluateForm.noTagId === '0' ? '' : this.evaluateForm.noTagId,
                            middle_tag_config_id: this.evaluateForm.middleId === '0' ? '' : this.evaluateForm.middleId,
                            customer_type: this.evaluateForm.seeType,
                            city_id: this.evaluateForm.city
                        };
                        if (this.configId !== '0') {
                            upData.id = this.configId;
                        }
                        let { data } = await apiObj.evaluateSettingSub(upData);
                        if (data.code === 0) {
                            this.$router.push({ path: '/evaluate/settingList' });
                        }
                        this.isSubmit = false;
                    }
                });
            } catch (error) {
                this.isSubmit = false;
                console.log(error);
            }
        },
        // 初始化数据
        async initData() {
            try {
                let params = {
                    id: this.configId
                };
                let { data } = await apiObj.getEvaluateSettingDetail(params);
                if (data.code === 0) {
                    let apiData = data.data;
                    // 标签类型：1带看评价 2无意向评价
                    this.evaluateForm.evaluateType = apiData.type;
                    // 配置类型 1标签 2问题
                    this.evaluateForm.type = apiData.config_type;
                    // 标题 标签名称
                    this.evaluateForm.title = apiData.name;
                    this.oldTagName = `：${apiData.name}`;
                    // 城市
                    this.evaluateForm.city = apiData.city_id || [];
                    // 星级 0非常不满意 1不满意 3一般 4满意 5非常满意
                    this.evaluateForm.stars = apiData.grade_levels === '' ? [] : apiData.grade_levels.split(',');
                    // 是否默认显示：1显示 2隐藏
                    this.evaluateForm.isShow = apiData.is_show;
                    // 排序
                    this.evaluateForm.level = Number(apiData.sort);
                    // 图片
                    this.evaluateForm.imgUrl = apiData.img_url;
                    if (apiData.img_url === '') {
                        this.evaluateForm.imgShow = 1;
                        this.imgSrc = '';
                    } else {
                        this.evaluateForm.imgShow = 2;
                        // 有完整路径的时候，预览图片显示完整url
                        this.imgSrc = apiData.host_img_url;
                    }
                    // 答案数量
                    this.evaluateForm.answerNum = apiData.answer_number;
                    // 正向文案
                    this.evaluateForm.yesText = apiData.yes_text;
                    // 负向文案
                    this.evaluateForm.noText = apiData.no_text;
                    // 中间文案
                    this.evaluateForm.middleText = apiData.middle_text;
                    // 正向标签配置id
                    this.evaluateForm.yesTagId = apiData.yes_tag_config_id === '0' ? '' : apiData.yes_tag_config_id;
                    // 负向标签配置id
                    this.evaluateForm.noTagId = apiData.no_tag_config_id === '0' ? '' : apiData.no_tag_config_id;
                    // 中间标签配置
                    this.evaluateForm.middleId = apiData.middle_tag_config_id === '0' ? '' : apiData.middle_tag_config_id;
                    // 带看类型
                    this.evaluateForm.seeType = apiData.customer_type || '3';
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 初始化与答案相关联标签下拉菜单数据
        async initTagOpts() {
            let { data } = await apiObj.selectTag();
            if (data.code === 0) {
                this.options = data.data;
            }
        },
        // 配置类型修改 表单变化
        typeChange() {
            this.$refs.evaluateForm.clearValidate();
            this.evaluateForm.city = [];
        },
        // 评价切换
        changeType() {
            this.evaluateForm.city = [];
        },
        /**
         * @description: 全部星级 选中/取消选中事件
         * @param {string} val 选中状态
         */
        allStarChange(val) {
            this.evaluateForm.stars = val ? ['0', '1', '3', '4', '5'] : [];
        },
        // 删除图片
        delImg() {
            this.imgSrc = '';
            this.evaluateForm.imgUrl = '';
        }
    },
    watch: {
        // role 是异步调取的，所以监听role的改变
        role: {
            handler: function(val, oldval) {
                // 总管理员 页面初始化
                if (val === 'admin') {
                    this.pageInit();
                } else {
                    // 非总管理员跳转权限页面
                    this.$router.push({ path: '/noPermissions' });
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.city-select {
    width: 100%;
}
.edit-auto-group {
    padding: 0 20px 30px;
}
.auto {
    color: #666;
    line-height: 40px;
    width: 100%;
    clear: both;
    font-size: 14px;
    .th {
        float: left;
        width: 140px;
        padding-right: 12px;
        text-align: right;
        height: 40px;
        overflow: hidden;
    }
    .td {
        overflow: hidden;
    }
    .td {
        /deep/.el-input {
            float: none;
            width: 300px;
        }
        .flex-box {
            display: flex;
            .flex-start {
                padding-right: 20px;
            }
            .flex-center {
                padding-right: 20px;
            }
            .label-tit {
                margin-right: 10px;
            }
        }
        .ansower-box {
            margin-bottom: 20px;
            /deep/ .el-form-item {
                display: inline-block;
            }
        }
        .label-icon-wrap {
            width: 23px;
            height: 23px;
            overflow: hidden;
            vertical-align: -6px;
            display: inline-block;
            img {
                width: 100%;
            }
        }
    }
}
.img-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    .btn-close {
        background-color: #f00;
        display: block;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        font-size: 19px;
        font-weight: bold;
        position: absolute;
        cursor: pointer;
        right: 0;
        top: 0;
    }
    img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: fill;
    }
}
</style>
