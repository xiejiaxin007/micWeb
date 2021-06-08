<!--
 * @Name: 开发商管理
 * @Description: 开发商管理
 * @Author: wangxue
 * @Date: 2020-02-06
-->
<template>
    <div class="developer-add-Modify">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item
                :to="{ path: '/developer/developerManagement'}">
                开发商管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{operation==="1" ? "新增" : "编辑"}}开发商</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="v-box form-table-box">
            <div class="hd">
                <h2>{{operation==="1" ? "新增" : "编辑"}}开发商</h2>
            </div>
            <div class="bd">
                <el-form
                    ref="contractForm"
                    :model="contractForm"
                    label-width="120px"
                    :rules="rules"
                >
                    <el-form-item
                        label="品牌开发商："
                        prop="developerName"
                    >
                        <el-input
                            class="developer-input"
                            v-model="contractForm.developerName"
                            maxlength=20
                        ></el-input>
                        <span
                            v-if="developerNameTip"
                            class="developer-name-tips"
                            >开发商名称已存在请重新输入</span>
                    </el-form-item>
                    <el-form-item label="开发商logo：">
                        <div class="upload-wrap">
                            <div
                                v-if="imgList.length > 0"
                                class="image-box">
                                <i
                                    @click="imgList=[]"
                                    class="iconfont iconicon-delete" 
                                    aria-hidden="true"></i>
                                <div>
                                    <img
                                        @click="showPreview(imgList[0])"
                                        :src="imgList[0].fileURL"
                                        alt="开发商logo">
                                </div>
                            </div>
                            <div v-if="imgList.length < 1">
                                <jl-file-upload v-if="imgList.length < 1"
                                    ref="uploadImg"
                                    fileMaxSize="10mb"
                                    upID="developerLogoUpload"
                                    :ossData="signs"
                                    :isCropper="true"
                                    :ratio="[1,1]"
                                    @beforeUpdate="loading = true"
                                    @getFileURL='getFileURL'>
                                    <el-button type="primary">上传图片</el-button>
                                </jl-file-upload>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="开发商描述：">
                        <el-input
                            type="textarea"
                            v-model="contractForm.developerDesc"
                            maxlength=180
                            autosize
                            resize="none"
                        ></el-input>
                    </el-form-item>
                    <div
                        v-for="(projectDataItem, index) in contractForm.projectData"
                        :key="index"
                        class="project-area"
                    >
                        <el-form
                            ref="contractFormItem"
                            :model="projectDataItem"
                            label-width="100px"
                            :inline="true"
                        >
                            <el-form-item
                                label="楼盘名称："
                                required
                            >
                                <el-select
                                    v-model="projectDataItem.project_name"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请选择"
                                    :loading="loading"
                                    :remote-method="getProjectList"
                                >
                                    <el-option
                                        v-for="item in projectList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.text"
                                        @click.native="changeProject(item, index)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="楼盘电话：">
                                <el-input
                                    v-model="projectDataItem.project_mobile"
                                    maxlength=20
                                    @input.native="checkInput($event)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="是否购买流量："
                                required
                                class="is-purchase-flow"
                                >
                                <el-radio-group v-model="projectDataItem.is_purchase_flow">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item
                                label="账号数量："
                                required
                                class="count-box">
                                <el-input
                                    @change="vericateAccoutNum(projectDataItem, index)"
                                    v-model="projectDataItem.account_num"
                                ></el-input>
                                <span v-if="projectDataItem.use_account_num !== '-1'">现有{{projectDataItem.use_account_num}}个账号</span>
                            </el-form-item>
                            <el-button
                                type="text"
                                @click="delProject(index)"
                            >删除</el-button>
                        </el-form>
                    </div>
                    <el-form-item>
                        <el-button
                            type="text"
                            @click="addProject"
                        >新增楼盘</el-button>
                    </el-form-item>
                    <div class="btn-area">
                        <el-button
                            type="primary"
                            @click="submitForm('contractForm')"
                        >保存</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!-- 图片预览查看器 -->
        <jl-image-preview
            v-if="PhotoIsShow"
            :showViewer="PhotoIsShow"
            :urlList="previewUrl"
            @closeViewer="closeViewer">
        </jl-image-preview>
    </div>
</template>

<script>
    import developerApi from './api/developerApi';
    import commonApi from '@/api/commonApi';
    export default {
        name: 'developerAddModify',
        data() {
            return {
                // 表单数据
                contractForm: {
                    developerName: '',
                    developerLogo: '',
                    developerDesc: '',
                    projectData: [
                        {
                            project_id: '',
                            project_name: '',
                            project_mobile: '',
                            is_purchase_flow: '2',
                            account_num: '5',
                            use_account_num: '-1'
                        }
                    ]
                },
                // 楼盘列表
                projectList: [],
                // loading
                loading: false,
                // 楼盘输入框内容
                projectInput: '',
                // 路由参数，增加or编辑 1增加 0编辑
                operation: this.$route.query.operation,
                // 路由参数，developer_id
                developerId: this.$route.query.developerId,
                rules: {
                    developerName: [
                        {
                            message: '请填写开发商名称',
                            required: true,
                            trigger: 'change'
                        }
                    ]
                },
                // 防止重复提交
                flag: true,
                // 编辑页面初始化图片
                imgList: [],
                // 开发商logo初始状态
                imglogoOrigin: '',
                // 开发商名称已存在提示
                developerNameTip: false,
                // oss上传设置参数
                signs: {},
                // 图片预览
                PhotoIsShow: false
            };
        },
        mounted() {
            // 编辑页面
            if (this.operation === '0') {
                this.editInitData();
            } else {
                // 新增开发商页面 获取楼盘列表
                this.getProjectList();
            }
            this.getSign();
        },
        methods: {
            // 上传之前
            beforeUpdate() {
                this.loading = this.$loading({
                    lock: true,
                    text: '请求中，请稍后',
                    spinner: 'el-icon-loading',
                    customClass: 'loading-default-box',
                    background: 'rgba(255, 255, 255, 0.8)'
                });
            },
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @return
             */
            getFileURL(fileList) {
                // 关闭加载loading
                this.loading = false;
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                this.imgList = fileList;
            },
            /**
             * 打开大图预览
             * @param {string} url 预览大图的url
             */
            showPreview(url) {
                this.previewUrl = [url.url];
                this.PhotoIsShow = true;
            },
            // 关闭大图预览
            closeViewer() {
                this.PhotoIsShow = false;
                this.previewUrl = [];
            },
            // 请求oss上传设置参数
            async getSign() {
                let params = {
                    cate: 'developer/logo'
                }
                try {
                    const { data } = await commonApi.getSign(params);
                    if (data.code === 0) {
                        this.signs = data.data;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            vericateAccoutNum (row, index) {
                this.contractForm.projectData[index].account_num = row.account_num.replace(/[^\d]/g, '')
                if (row.account_num - row.use_account_num < 0) {
                    this.$message(`${this.contractForm.projectData[index].project_name}楼盘现有账号大于输入账号，请删除人员后处理`);
                }
            },
            // 编辑页面初始化信息
            async editInitData() {
                this.loading = true;
                try {
                    let params = {
                        developer_id: this.developerId
                    };
                    let { data } = await developerApi.initDeveloperData(params);
                    if (data.code === 0) {
                        this.developerId = data.data.developer_id;
                        this.contractForm.developerName = data.data.developer_name;
                        this.contractForm.developerLogo = data.data.developer_logo;
                        this.contractForm.developerDesc = data.data.developer_desc;
                        this.contractForm.projectData = data.data.project_list;
                        if (this.contractForm.developerLogo) {
                            this.imgList.push({
                                fileURL: this.contractForm.developerLogo
                            })
                            // 初始保存logo
                            this.imglogoOrigin = data.data.developer_logo;
                        }
                        this.loading = false;
                        // 获取楼盘列表
                        this.getProjectList();
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 点击新增楼盘
            addProject() {
                if (this.contractForm.projectData.length >= 500) {
                    this.$message('最多只能输入500个');
                    return;
                }
                if (!this.contractForm.projectData.slice(-1)[0].project_name) {
                    this.$message('上面填完在新增哦');
                    return;
                }
                this.contractForm.projectData.push({
                    project_id: '',
                    project_name: '',
                    project_mobile: '',
                    is_purchase_flow: '2',
                    use_account_num: '-1',
                    account_num: '5'
                });
            },
            /**
             * 删除楼盘
             * @params [string] index 楼盘下标
             */
            delProject(index) {
                if (this.contractForm.projectData.length > 1) {
                    this.contractForm.projectData.splice(index, 1);
                } else {
                    this.$message('至少保留一个楼盘');
                }
            },
            /**
             * 保存信息
             * @params [string] formName 表单名称
             */
            submitForm(formName) {
                if (!this.contractForm.projectData[0].project_id) {
                    this.$message('请至少关联一个楼盘');
                    return;
                }
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        this.loading = true;
                        // 防止重复提交
                        if (!this.flag) return
                        this.flag = false;
                        try {
                            let projectDataList = [];
                            this.contractForm.projectData.forEach((item, index) => {
                                if (item.project_id) {
                                    projectDataList.push({
                                        project_id: item.project_id,
                                        project_mobile: item.project_mobile,
                                        is_purchase_flow: item.is_purchase_flow,
                                        account_num: item.account_num
                                    });
                                }
                            });
                            let params = {
                                developer_logo: this.imgList[0] ? this.imgList[0].upURL : '',
                                developer_desc: this.contractForm.developerDesc,
                                project_data: projectDataList
                            };
                            if (this.imgList.length !== 0 && this.imglogoOrigin === this.imgList[0].fileURL) {
                                delete params.developer_logo
                            }
                            //  如果是编辑页面
                            if (this.operation === '0') {
                                params.developer_id = this.developerId;
                                params.developer_name = this.contractForm.developerName;
                                let {data} = await developerApi.editDeveloper(params);
                                if (data.code === 0) {
                                    this.$message(data.msg);
                                    this.loading = false;
                                    this.flag = true;
                                    this.$router.push('developerManagement');
                                } else {
                                    this.$message(data.msg);
                                    this.loading = false;
                                    this.flag = true;
                                }
                            } else {
                                // 新增页面
                                params.developer_name = this.contractForm.developerName;
                                let {data} = await developerApi.addDeveloper(params);
                                if (data.code === 0) {
                                    this.$message(data.msg);
                                    this.loading = false;
                                    this.flag = true;
                                    this.$router.push('developerManagement');
                                } else {
                                    this.$message(data.msg);
                                    this.loading = false;
                                    this.flag = true;
                                }
                            }
                        } catch (err) {
                            this.flag = true;
                            console.log(err);
                        }
                    } else {
                        return false;
                    }
                });
            },
            /**
             * 楼盘电话校验
             * @params [string] ev 校验内容
             */
            checkInput(ev) {
                ev.target.value = ev.target.value.replace(/[^()（）+-\d*#]/g, '');
            },
            /**
             * 远程搜索楼盘
             * @params [string] q 搜索内容
             */
            async getProjectList(q) {
                this.loading = true;
                this.projectInput = q;
                try {
                    let projectIdList = [];
                    this.contractForm.projectData.forEach((item, index) => {
                        projectIdList.push(item.project_id);
                    });
                    let params = {
                        name: q,
                        developer_id: '',
                        not_in_id: projectIdList
                    };
                    let { data } = await developerApi.projectList(params);
                    if (data.code === 0) {
                        this.projectList = data.data.list;
                        this.loading = false;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 楼盘下拉框点击option事件
             * @params [Object] project 已选中楼盘
             * @params [String] index 第几个下拉框
             */
            changeProject(project, index) {
                this.contractForm.projectData[index].project_id = project.id;
                this.getProjectList('');
            }
        }
    };
</script>

<style lang="less" scoped>
.developer-add-Modify {
    padding: 0 30px;
    .el-form {
        /deep/ textarea {
            width: 504px;
            min-height: 40px!important;
            padding: 9px 15px;
        }
        .developer-input {
            width: 504px;
        }
        .btn-area {
            text-align: center;
        }
        .developer-name-tips {
            color: #f00;
        }
        /deep/.project-area {
            .is-purchase-flow {
                .el-form-item__label {
                    width: 150px!important;
                }
            }
            .el-button {
                margin-left: 10px;
            }
            .count-box {
                .el-form-item__content {
                    .el-input {
                        width: 40px;
                        margin-right: 10px;
                        .el-input__inner {
                            padding: 0 5px;
                        }
                    }
                }
            }
        }
    }
    /deep/ .image-upload-wrap .image-list {
        padding: 0;
    }
    .image-box{
        width: 100px;
        height: 100px;
        border: 1px solid #eee;
        position: relative;
        img {
            max-width: 100%;
            max-height: 100%;
            position: absolute;
        }
        i {
            position: absolute;
            top: -8px;
            right: -8px;
            font-size: 16px;
            line-height: 16px;
            cursor: pointer;
            z-index:1;
        }
    }
}
</style>
