<!--
 * @author: wangshuaixue
 * @Date: 2020-03-25 10:26:40
 * @description: 开发商订单规则管理
 -->
<template>
    <div
        v-loading="pageLoading"
        element-loading-text="拼命加载中"
        class="rule-manage-box">
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/developer/developerManagement', query:{active:'4'}}">
                开发商管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>开发商订单分配规则管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            ref="ruleForm"
            :model="ruleForm"
        >
            <ul>
                <li class="item-content">
                    <div class="title required">开发商：</div>
                    <div class="container">
                        <el-form-item
                            prop="devloper"
                            :rules="{required: true, message: '请选择开发商', trigger: 'change'}"
                        >
                            <el-select
                                v-model="ruleForm.devloper"
                                filterable
                                placeholder="请选择"
                                :remote-method="searchProject"
                            >
                                <el-option
                                    v-for="item in developList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                    @click.native="affirmOption(item, 1)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </li>
                <li class="item-content">
                    <div class="title required">楼盘：</div>
                    <div class="container">
                        <el-form-item
                            prop="projectName"
                            :rules="{required: true, message: '请选择楼盘', trigger: 'change'}"
                        >
                            <el-select
                                v-model="ruleForm.projectName"
                                multiple
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请选择"
                                :loading="loading"
                                @remove-tag="removeTag"
                                :remote-method="searchProject"
                            >
                                <el-option
                                    v-for="item in projectArr"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                    @click.native="affirmOption(item, 2)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </li>
                <li class="item-content btm-second">
                    <div class="title">分配留电口：</div>
                    <div class="container">
                        <el-select
                            v-model="phoneInner"
                            filterable
                            multiple
                            remote
                            placeholder="请选择"
                            :remote-method="getOptypeList"
                        >
                            <el-option
                                v-for="item in optypeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value + ''"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item-content btm-second">
                    <div class="title">分配渠道：</div>
                    <div class="container">
                        <el-select
                            v-model="channel"
                            filterable
                            multiple
                            remote
                            placeholder="请选择"
                            :remote-method="getChannel"
                        >
                            <el-option
                                v-for="item in channelList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value + ''"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item-content order-wrap">
                    <div class="title required">订单分配给开发商比例：</div>
                    <div class="container">
                        <el-form-item
                            prop="kfsScale"
                            :rules="{required: true, validator: verifyKfsScale, trigger: 'blur'}"
                        >
                            <div class="kfs-scale">
                                <jl-number-input
                                    :maxVal="100"
                                    maxlength="3"
                                    reg="number"
                                    v-model="ruleForm.kfsScale"
                                ></jl-number-input>
                            </div>
                            % <span>（只能填写1-100之间5的倍数）</span>
                            <div class="jl-scale">
                                分配给居理比例
                                {{100 - parseInt(ruleForm.kfsScale)}}%
                            </div>
                        </el-form-item>
                    </div>
                </li>
                <li class="item-content">
                    <div class="title">是否开启：</div>
                    <div class="container">
                        <el-radio
                            v-model="isOpen"
                            label="1"
                        >是</el-radio>
                        <el-radio
                            v-model="isOpen"
                            label="2"
                        >否</el-radio>
                    </div>
                </li>
            </ul>
        </el-form>
        <div class="btn-area">
            <el-button @click="skipList">取消</el-button>
            <el-button
                type="primary"
                @click="saveData"
            >保存</el-button>
        </div>
    </div>
</template>

<script>
    import developApi from './api/developerApi';
    import ruleApi from './api/orderRuleManage';
    export default {
        name: 'order-rule-manage',
        data() {
            return {
                // 页面加载
                pageLoading: false,
                // 第一次加载
                firstLoading: true,
                // 是否开启
                isOpen: '1',
                // 规则id
                id: '',
                // 加载数据
                loading: false,
                // 分配渠道
                channel: [],
                // 留电口
                phoneInner: [],
                // 楼盘列表
                projectArr: [],
                // 选中楼盘
                checkProject: [],
                ruleForm: {
                    // 开发商
                    devloper: '',
                    // 楼盘
                    projectName: [],
                    // 开发商订单分配比例
                    kfsScale: 50
                },
                // 留电口列表
                optypeList: [],
                // 开发商列表
                developList: [],
                // 分配渠道列表
                channelList: []
            };
        },
        created() {
            this.id = this.$route.query.id || '0';
            // 留电口默认下拉内容
            this.optyBaseList = [];
            // 分配渠道默认下拉内容
            this.channelBaseList = [];
            this.initData();
            // 新增规则请求数据
            if (this.id == 0) {
                this.getOptypeList('');
                this.getChannel('');
                this.getDevlop();
                this.searchProject('');
            }
        },
        methods: {
            /**
             * 校验分配比例必须是5的倍数
             * @param {string} rule 校验规则
             * @param {string} value 校验的数值
             * @param {string} callback 回调函数
             */
            verifyKfsScale(rule, value, callback) {
                if (value === '') {
                    return callback(new Error('请填写订单分配给开发商比例'));
                } else if (parseInt(value) % 5 !== 0) {
                    return callback(new Error('只能填写1-100之间5的倍数'));
                }
                callback();
            },
            /**
             * 获取开发商列表
             * @param {string} q 搜索内容
             */
            async getDevlop(q) {
                try {
                    let params = {
                        q: q
                    };
                    let { data } = await developApi.developerSelectList({ params: params });
                    if (data.code === 0) {
                        this.developList = data.list;
                    }
                } catch (err) {
                    console.log(err)
                }
            },
            /**
             * 根据value判断数组之间是否有包含关系
             * @param {array}} baseArr 需要判断是否被包含的数组
             * @param {array}} arr 总数组
             */
            isInclude(baseArr, arr) {
                var itemAry = [];
                baseArr.forEach(function(p1) {
                    let index = arr.findIndex((it) => {
                        return it.value == p1.value;
                    })
                    if (index != -1) {
                        itemAry.push(p1)
                    }
                })
                return itemAry.length == baseArr.length;
            },
            /**
             * 获取开发商列表
             * @param {获取分配渠道下拉} q 搜索内容
             */
            async getChannel(val) {
                try {
                    let params = {
                        q: val
                    };
                    let { data } = await ruleApi.getChannel(params);
                    this.channelList = data.data.list;
                    if (!this.isInclude(this.channelBaseList, data.data.list)) {
                        this.channelList = this.channelBaseList.concat(data.data.list);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 获取留电口下拉
             * @param {获取分配渠道下拉} q 搜索内容
             */
            async getOptypeList(q) {
                try {
                    let params = {
                        q: q,
                        rule_id: this.id,
                        developer_id: this.ruleForm.devloper,
                        project_id: this.ruleForm.projectName.join(',')
                    };
                    let { data } = await ruleApi.getOptype(params);
                    if (data.code === 0) {
                        this.optypeList = data.data.list;
                        if (!this.isInclude(this.optyBaseList, data.data.list)) {
                            this.optypeList = this.optyBaseList.concat(data.data.list);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 跳转
            skipList() {
                this.$router.push({
                    path: '/developer/developerManagement',
                    query: { active: '4' }
                });
            },
            // 保存数据
            async saveData() {
                try {
                    this.$refs.ruleForm.validate(valid => {
                        if (!valid) {
                            return false;
                        }
                    });
                    if (this.phoneInner.length < 1 && this.channel.length < 1) {
                        this.$message({
                            duration: 3000,
                            showClose: true,
                            message: '留电口、渠道必填一项',
                            type: 'error'
                        });
                        return false;
                    }
                    let params = {
                        id: this.id,
                        developer_id: this.ruleForm.devloper,
                        project_ids: this.ruleForm.projectName.join(','),
                        // 留电口
                        port_ids: this.phoneInner.join(','),
                        // 渠道分配
                        channel_ids: this.channel.join(','),
                        // 分配比例
                        developer_rate: parseInt(this.ruleForm.kfsScale),
                        // 是否开启 1开启 2关闭
                        is_open: this.isOpen
                    };
                    let { data } = await ruleApi.saveRule(params);
                    if (data.code === 0) {
                        this.$router.push({
                            path: '/developer/developerManagement',
                            query: { active: '4' }
                        });
                    } else {
                        alert(data.msg)
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 初始化数据
            async initData() {
                try {
                    if (this.id == 0) {
                        this.$nextTick(() => {
                            // 第一次加载
                            this.firstLoading = false;
                        })
                        return false;
                    }
                    // 页面加载
                    this.pageLoading = true;
                    let params = {
                        id: this.id
                    };
                    let { data } = await ruleApi.ruleInit(params);
                    if (data.code === 0) {
                        this.ruleForm.devloper = data.data.developer.value + '';
                        // 楼盘
                        this.ruleForm.projectName = data.data.projects.map(item => {
                            return item.value;
                        });
                        // 留电口
                        this.phoneInner = data.data.ports.map(item => {
                            return item.value + '';
                        });
                        // 留电口下拉
                        this.optyBaseList = data.data.ports.map(item => {
                            let obj = {
                                value: item.value + '',
                                name: item.name
                            }
                            return obj;
                        });
                        // 渠道
                        this.channel = data.data.channels.map(item => {
                            return item.value + '';
                        });
                        // 分配默认下拉
                        this.channelList = data.data.channels.map(item => {
                            let obj = {
                                value: item.value + '',
                                name: item.name
                            }
                            return obj;
                        });
                        // 是否开启
                        this.isOpen = data.data.is_open + '';
                        // 开发商分配
                        this.ruleForm.kfsScale = data.data.developer_rate;
                        // 请求留电口
                        this.getOptypeList('');
                        this.getChannel();
                        this.getDevlop();
                        // 获取楼盘列表
                        this.searchProject('');
                        this.$nextTick(() => {
                            // 第一次加载
                            this.firstLoading = false;
                            this.pageLoading = false;
                        })
                    }
                } catch (err) {
                    this.pageLoading = false;
                    console.log(err);
                }
            },
            /**
             * 移除选中项
             * @param {Object} para 当前移除项
             * @return {Promise}
             */
            removeTag(para) {
                let valIndex = this.checkProject.findIndex((item, index) => {
                    return item.id == para;
                });
                this.checkProject.splice(valIndex, 1);
            },
            /**
             * 确认选项
             * @param {Object} para 当前选中项
             * @param {String} type 类型 1开发商 2楼盘
             * @return {Promise}
             */
            affirmOption(para, type) {
                if (type === 1) {
                    this.ruleForm.devloper = para.value;
                } else if (type === 2) {
                    this.checkProject.push(para);
                }
            },
            /**
             * 请求带看楼盘列表
             * @param {Object} val 当前输入内容
             * @return {Promise}
             */
            async searchProject(val) {
                this.loading = true;
                let params = {
                    name: val,
                    developer_id: this.ruleForm.devloper
                };
                // 隐藏历史记录模块
                let { data } = await developApi.projectList(params);
                if (data.code === 0) {
                    this.projectArr = data.data.list;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            }
        },
        watch: {
            //  监听开发商修改
            'ruleForm.devloper': {
                handler: function (val) {
                    if (!this.firstLoading) {
                        this.ruleForm.projectName = [];
                        this.phoneInner = [];
                        this.channel = [];
                        this.searchProject('');
                    }
                },
                deep: true
            },
            //  监听楼盘修改
            'ruleForm.projectName': {
                handler: function (val) {
                    if (!this.firstLoading) {
                        this.getOptypeList('');
                    }
                },
                deep: true
            }
        }
    };
</script>

<style lang="less" scoped>
.rule-manage-box {
    padding: 0 20px;
    .required {
        &::before {
            content: "*";
            color: #f64a4a;
        }
    }
    .item-content {
        display: flex;
        font-size: 14px;
        min-height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        &.order-wrap {
            height: 40px;
            padding-bottom: 20px;
        }
        &.btm-second {
            padding-bottom: 20px;
        }
        &:last-child {
            margin-bottom: 0;
        }
        .title {
            min-width: 100px;
        }
        /deep/.el-radio {
            line-height: 40px;
        }
        .container,
        /deep/.el-form-item__content {
            display: flex;
        }
        /deep/.number-input-box {
            width: 80px;
        }
        /deep/.el-select {
            width: 500px;
        }
        .jl-scale {
            margin-left: 15px;
        }
    }
}
</style>
