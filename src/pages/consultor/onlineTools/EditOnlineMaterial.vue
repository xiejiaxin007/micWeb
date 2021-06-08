<!--
 * @Name: 编辑带看材料
 * @Description: 线上带看材料管理页
 * @Author: wangshuaixue
 * @Date: 2020-2-23
 -->
<template>
    <div class="edit-material-box">
        <div class="el-row">
            <el-col
                :span="24"
                class="content-main"
            >
                <el-breadcrumb
                    class="bread-crumb-box"
                    separator-class="el-icon-arrow-right"
                >
                    <el-breadcrumb-item>
                        <a href="/">首页</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>带看材料管理页</el-breadcrumb-item>
                </el-breadcrumb>
                <!--搜索区域-->
                <div class="v-box form-table-box">
                    <div class="hd">
                        <h2>带看材料管理页</h2>
                    </div>
                    <div class="bd">
                        <ul>
                            <li class="fromItem">
                                <div class="bd-title">分类：</div>
                                <div class="bd-content">
                                    <!-- // 类型（2.公司介绍、3.市场介绍、4.区域介绍、5.楼盘介绍、6.视频材料） -->
                                    <el-radio
                                        :disabled="isEditFlag"
                                        v-model="materialsType"
                                        label="4">区域介绍</el-radio>
                                    <el-radio
                                        :disabled="isEditFlag"
                                        v-model="materialsType"
                                        label="2">公司介绍</el-radio>
                                    <el-radio
                                        :disabled="isEditFlag"
                                        v-model="materialsType"
                                        label="3">市场介绍</el-radio>
                                    <el-radio
                                        :disabled="isEditFlag"
                                        v-model="materialsType"
                                        label="5">楼盘介绍</el-radio>
                                    <el-radio
                                        :disabled="isEditFlag"
                                        v-model="materialsType"
                                        label="6">视频材料</el-radio>
                                </div>
                            </li>
                            <li class="fromItem">
                                <div class="bd-title">城市：</div>
                                <div class="bd-content">
                                    <el-select
                                        v-model="cityObj.id"
                                        @change="changeCity"
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in cityList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id+''">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="fromItem fromTit">
                                <div class="bd-title">标题：</div>
                                <div class="bd-content textarea-wrap">
                                    <el-input
                                        maxlength="100"
                                        resize="none"
                                        type="textarea"
                                        :rows="2"
                                        placeholder="请输入内容"
                                        v-model="title">
                                    </el-input>
                                </div>
                            </li>
                            <li
                                v-show="materialsType == 4"
                                class="fromItem">
                                <div class="bd-title">区域：</div>
                                <div class="bd-content">
                                    <el-select v-model="areaId" placeholder="请选择">
                                        <el-option
                                            v-for="item in districtList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id+''">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li
                                v-if="materialsType == 5 || materialsType == 6"
                                class="fromItem">
                                <div class="bd-title">楼盘：</div>
                                <div class="bd-content">
                                    <el-autocomplete
                                        v-model="project.text"
                                        :fetch-suggestions="searchProject"
                                        placeholder="请输入楼盘名搜索"
                                        @select="affirmProject">
                                    </el-autocomplete>
                                </div>
                            </li>
                            <li
                                v-if="materialsType != 6"
                                class="ppt-material">
                                <div class="bd-title">PPT材料：</div>
                                <div class="bd-content ppt-preview">
                                    <iframe
                                        v-if="materials.path"
                                        :src="`//vip.ow365.cn/?i=20811&ssl=1&furl=${materials.path}`"
                                        width='100%'
                                        height='100%'
                                        class="ppt-iframe"
                                        frameborder='1'>
                                    </iframe>
                                    <div
                                        v-else
                                        class="ppt-blank-box">
                                            <div class="ppt-blank">
                                                <img
                                                    src="./images/img-ppt-blank.png"
                                                    alt="未上传ppt"
                                                />
                                                <p>暂无ppt文件，请上传ppt</p>
                                            </div>
                                        </div>
                                </div>
                                <div class="upload-ppt-wrap">
                                    <span class="upload-ppt">
                                        <jl-file-upload
                                            ref="fileUp"
                                            fileType="ppt,pptx"
                                            fileMaxSize="1000mb"
                                            upID="uploadNum"
                                            :isProgress="true"
                                            :ossData="ossData"
                                            @getProgress='getProgress'
                                            @beforeUpdate='beforeUpdate'
                                            @getFileURL='uploadSuccess'
                                        >上传ppt</jl-file-upload>
                                    </span>
                                </div>
                            </li>
                            <li
                                class="video-material-box"
                                v-if="materialsType == 6">
                                <div class="video-box">
                                    <div class="video-operate">
                                        <div :class="`${videoFull ? 'btn-upload-video disabled' : 'btn-upload-video'}`">
                                            <jl-file-upload
                                                ref="fileUp"
                                                fileType="mp4"
                                                fileMaxSize="1024mb"
                                                upID="up-video"
                                                :isProgress="true"
                                                :ossData="ossData"
                                                @getProgress="getProgress"
                                                @beforeUpdate="beforeUpdate"
                                                @getFileURL="uploadVideoSuccess">
                                                上传视频
                                            </jl-file-upload>
                                            <div
                                                v-show="videoFull"
                                                class="mask"></div>
                                        </div>
                                        <div class="video-tip">最多上传15个，可以调整播放顺序</div>
                                    </div>
                                    <el-form
                                        ref="videoForm"
                                        :model="videoForm"
                                        label-width="0">
                                        <el-table
                                            border
                                            :data="videoForm.videoList"
                                            :highlight-current-row="true"
                                            :header-cell-style="tableHeaderColor">
                                            <el-table-column
                                                prop="title"
                                                label="标题">
                                                <template slot-scope="scope">
                                                    <el-form-item
                                                        :prop="'videoList.' + scope.$index + '.title'"
                                                        :rules="[
                                                            {
                                                                required: true,
                                                                message: '请输入标题',
                                                                trigger: 'blur'
                                                            }
                                                        ]"
                                                        label="">
                                                        <el-input
                                                            maxlength="50"
                                                            :rows="2"
                                                            resize="none"
                                                            type="textarea"
                                                            placeholder="请输入视频标题"
                                                            v-model="scope.row.title"></el-input>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="视频">
                                                <template slot-scope="scope">
                                                    <div class="img-box">
                                                        <a :href="scope.row.url_full" target="_blank">
                                                            <img
                                                                src="./images/img-video-take.png"
                                                                alt="视频占位图">
                                                        </a>
                                                        <img
                                                            @click="delVideo(scope.$index)"
                                                            class="btn-del"
                                                            src="../../../assets/images/deleteImg.png"
                                                            alt="删除按钮">
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="调整展示顺序">
                                                <template slot-scope="scope">
                                                    <div class="control">
                                                        <span
                                                            :class="`move-up ${scope.$index === 0 ? 'not-allowed' : ''}`"
                                                            @click="moveOrder('up', scope.$index)">
                                                            上移
                                                        </span>
                                                        <span
                                                            :class="`move-down ${scope.$index ===  (videoForm.videoList ? videoForm.videoList.length - 1 : 0) ? 'not-allowed' : ''}`"
                                                            @click="moveOrder('down', scope.$index)">
                                                            下移
                                                        </span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-form>
                                </div>
                            </li>
                        </ul>
                        <div class="save-wrap">
                            <span
                                @click="saveMaterial"
                                class="submit">保存</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </div>
        <div
            class="upload-progress-box"
            v-show='uploadProgressShow'>
            <div class="upload-progress">
                <el-progress :percentage="uploadProgress"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import api from './api/editOnlineMaterial';
    import { getSign } from '@/api/commonApi';
    export default {
        name: 'editOnlineMaterial',
        data() {
            return {
                // ppt是否加载中
                messageFlag: false,
                // 是否第一次切换城市
                isFir: true,
                // 城市列表
                cityList: [],
                // 区域列表
                districtList: [],
                // 分类
                materialsType: '',
                uploadNum: moment().format('YYYYMMDDhhmmss'),
                // 公司介绍
                company: false,
                // 市场介绍
                market: false,
                // 区域
                areaId: '',
                // 标题
                title: '',
                // 城市
                cityObj: {
                    id: '',
                    name: ''
                },
                // 材料
                materials: {
                    // 全路径
                    path: '',
                    // 半路径
                    semipath: ''
                },
                // 楼盘
                project: {
                    id: '',
                    text: ''
                },
                // 楼盘下拉列表
                projectArr: [],
                // 防止重复提交
                lock: false,
                // 请求阿里地址返回的数据
                ossData: {},
                // 进度条
                uploadProgress: 0,
                // 进度条是否显示
                uploadProgressShow: false,
                // 上传阿里云地址
                uploadUrl: 'onlineTools',
                // 是否是编辑状态
                isEditFlag: false,
                // 表格表单
                videoForm: {
                    videoList: []
                }
            };
        },
        created() {
            this.materialId = this.$route.query.id;
            this.getInitData().then(() => {
                this.isFir = false;
                this.getCityData();
                this.getDisData();
                this.getSignCode();
            });
        },
        computed: {
            videoFull() {
                return this.videoForm.videoList.length >= 15;
            }
        },
        methods: {
            /**
             * 删除视频
             * @param {number} val 要删除的视频索引
             */
            delVideo(val) {
                if (this.videoForm.videoList.length === 1) {
                    this.$message({
                        message: '至少上传一个视频',
                        duration: 1000,
                        type: 'warning'
                    });
                    return;
                }
                this.videoForm.videoList.splice(val, 1);
            },
            /**
             * 切换城市选项
             * @param {string} val 城市选项
             */
            changeCity(val) {
                // 切换城市的时候，清空已选楼盘
                this.project.text = '';
                this.project.id = '';
            },
             /**
             * 移动视频顺序
             * @param {string} type 上移/下移
             * @param {number} index 当前选择行的索引
             */
            moveOrder(type, index) {
                if (type === 'up' && index === 0 || type === 'down' && index === this.videoForm.videoList.length - 1) {
                    return;
                }
                if (type === 'up' && index > 0) {
                    this.videoForm.videoList[index] = this.videoForm.videoList.splice(index - 1, 1, this.videoForm.videoList[index])[0];
                } else if (type === 'down' && index !== this.videoForm.videoList.length - 1) {
                    this.videoForm.videoList[index] = this.videoForm.videoList.splice(index + 1, 1, this.videoForm.videoList[index])[0];
                }
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #f9f9f9;color: #333;';
                }
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
            // 上传之前
            beforeUpdate() {
                // 打开进度条
                this.uploadProgressShow = true;
            },
            /**
             * 获取上传进度条
             * @param {String} file 文件上传状态
             * @return
             */
            getProgress(file) {
                this.uploadProgress = file.percent;
            },
            // 验证视频表单
            submitForm(formName) {
                let rel = true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        rel = true;
                    } else {
                        rel = false;
                        return false;
                    }
                });
                return rel;
            },
            // 保存材料
            async saveMaterial() {
                if (this.lock) {
                    return false;
                }
                try {
                    let id = '';
                    if (this.materialsType == 4) {
                        id = this.areaId;
                    } else if (this.materialsType == 5 || this.materialsType == 6) {
                        id = this.project.id;
                    }
                    if (this.materialsType == '') {
                        this.$message({
                            message: '分类为必选',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if (this.cityObj.id == '') {
                        this.$message({
                            message: '城市为必填',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if (this.title == '') {
                        this.$message({
                            message: '标题为必填',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if (this.materialsType != 6 && this.materials.path == '') {
                        this.$message({
                            message: 'PPT材料为必填',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if (this.materialsType == 4 && id == '') {
                        this.$message({
                            message: '区域为必填',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if ((this.materialsType == 5 || this.materialsType == 6) && id == '') {
                        this.$message({
                            message: '楼盘为必填',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if (this.materialsType == 6 && this.videoForm.videoList.length === 0) {
                        this.$message({
                            message: '至少上传一个视频',
                            duration: 1000,
                            type: 'warning'
                        });
                        return false;
                    } else if (this.materialsType == 6 && !this.submitForm('videoForm')) {
                        // 如果分类是视频，则需要校验表单
                        return false;
                    }
                    this.lock = true;
                    let params = {
                        // 0 为新增 有值就修改
                        id: this.materialId,
                        city_id: this.cityObj.id,
                        title: this.title,
                        object_type: this.materialsType,
                        // 类型（2.公司介绍、3.市场介绍、4.区域介绍、5.楼盘介绍、6.视频材料）
                        object_id: id,
                        object_url: this.materials.semipath,
                        video_list: this.videoForm.videoList
                    }
                    let { data } = await api.saveMaterial(params);
                    if (data.code === 0) {
                        // 跳转
                        this.$router.push({path: '/onlinetools/materialManage'})
                    } else {
                        // 信息重复
                        this.$message({
                            message: data.msg,
                            duration: 1000,
                            type: 'warning'
                        })
                    }
                    setTimeout(() => {
                        this.lock = false;
                    }, 1000)
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取区域列表
            async getDisData() {
                try {
                    let params = {
                        city_id: this.cityObj.id,
                        district_id: this.areaId
                    }
                    let { data } = await api.getDistrict(params);
                    if (data.code === 0) {
                        this.districtList = data.data.list;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取城市列表
            async getCityData () {
                try {
                    let { data } = await api.getCityList();
                    if (data.code === 0) {
                        this.cityList = data.data;
                        let index = this.cityList.findIndex((it) => {
                            return it.id == 0;
                        });

                        if ((this.materialsType == 4 || this.materialsType == 5) && index > -1) {
                            this.cityList.splice(index, 1);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 请求带看楼盘列表
            async searchProject (val, cb) {
                if (this.cityObj.id == '') {
                    this.$message({
                        message: '城市为必选项',
                        duration: 2000,
                        type: 'error'
                    })
                    return false;
                }
                let params = {
                    city_id: this.cityObj.id,
                    project_id: this.project.id, // 编辑时需要传入
                    q: val
                }
                // 隐藏历史记录模块
                var list = [{}]
                let { data } = await api.getProject(params);
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
            affirmProject (para) {
                this.project.id = para.id;
                this.project.text = para.text;
            },
            /**
             * 上传video视频，需要新增一行表格
             * @param {String} fileData 文件路径
             * @return
             */
            uploadVideoSuccess(fileData) {
                // 上传成功新增一行视频数据
                let obj = {
                    id: '0',
                    title: '',
                    url: fileData[0].upURL
                }
                this.videoForm.videoList.push(obj);
                // 关闭进度条
                this.uploadProgressShow = false;
                this.uploadProgress = 0;
            },
            /**
             * 上传ppt完成
             * @param {String} fileData 文件路径
             * @return
             */
            uploadSuccess (fileData) {
                this.materials = {
                    // 全路径
                    path: fileData[0].fileURL,
                    // 半路径
                    semipath: fileData[0].upURL
                }
                // 关闭进度条
                this.uploadProgressShow = false;
                this.uploadProgress = 0;
            },
            // 初始化数据
            async getInitData () {
                // 加载loading
                this.loading = this.$loading({
                    lock: true,
                    text: '正在加载',
                    spinner: 'el-icon-loading',
                    customClass: 'loading-default-box',
                    background: 'rgba(255, 255, 255, 0.8)'
                });
                let params = {
                    id: this.materialId
                };
                try {
                    let { data } = await api.getInitList(params);
                    if (data.code === 0) {
                        this.cityObj.id = data.data.city_id;
                        this.materialsType = data.data.object_type;
                        // <!-- // 类型（2.公司介绍、3.市场介绍、4.区域介绍、5.楼盘介绍、6.视频材料） -->
                        if (this.materialsType == 4) {
                            this.areaId = data.data.object_id;
                        } else if (this.materialsType == 5 || this.materialsType == 6) {
                            this.project.id = data.data.object_id;
                            this.project.text = data.data.object_name;
                            console.log(this.project)
                        }
                        this.title = data.data.title;
                        // ppt
                        this.materials.path = data.data.url;
                        this.materials.semipath = data.data.object_url;
                        // 分类有值即是编辑，当页面是编辑状态的时候，禁止切换分类
                        this.isEditFlag = (this.materialsType !== '' && this.materialsType !== null && this.materialsType !== undefined && this.materialsType != 0);
                        this.videoForm.videoList = data.data ? data.data.video_list : [];
                        // if (this.materialsType == 6 && this.videoForm.videoList.length >= 15) {
                        //     this.videoFull = true;
                        // }
                    }
                    // 关闭加载loading
                    this.loading.close();
                } catch (error) {
                    console.log(error);
                    this.loading.close();
                }
            }
        },
        watch: {
            materialsType: {
                handler: function(val, oldval) {
                    let index = this.cityList.findIndex((it) => {
                        return it.id == 0;
                    });
                    // <!-- // 类型（2.公司介绍、3.市场介绍、4.区域介绍、5.楼盘介绍、6.视频材料） -->
                    // 在公司介绍和市场介绍时有全国选项
                    if (val == 2 || val == 3) {
                        if (index == -1) {
                            this.cityList.unshift({
                                id: 0,
                                text: '全国'
                            });
                        }
                    } else {
                        if (index > -1) {
                            this.cityList.splice(index, 1);
                        }
                    }
                    // 如果当前城市为全国，但是分类中没有全国的话置空处理
                    if ((val == 4 || val == 5) && this.cityObj.id == 0) {
                        this.cityObj.id = '';
                    }
                },
                deep: true
            },
            cityObj: {
                handler: function(val, oldval) {
                    // 除第一次切换区域不置空
                    if (!this.isFir) {
                        this.areaId = '';
                    }
                    if (this.materialsType == 4) {
                        this.getDisData();
                    }
                },
                deep: true
            }
        }
    };
</script>

<style lang="less" scoped>
.edit-material-box {
    padding: 0 20px;
    .video-material-box {
        margin-bottom: 50px;
    }
    .video-box {
        .img-box {
            position: relative;
            width: 300px;
            margin: 10px 10px 0 0;
            a {
                display: block;
                width: 100%;
                & > img {
                    width: 100%;
                    border-radius: 4px;
                }
            }
            .btn-del {
                position: absolute;
                width: 20px;
                top: -8px;
                right: -8px;
                cursor: pointer;
                background-color: #fff;
                border-radius: 50%;
            }
        }
        .control {
            display: inline-block;
            text-align: center;
            .move-up,
            .move-down {
                display: block;
                width: 44px;
                float: left;
                height: 14px;
                line-height: 14px;
                text-align: center;
                color: #3da6ff;
                cursor: pointer;
            }
            .move-up {
                border-right: 1px solid #f3f6f9;
            }
            .not-allowed {
                color: rgba(62, 66, 84, 0.3);
                cursor: not-allowed;
            }
        }
        .video-operate {
            margin: 20px 0 15px 0;
        }
        .btn-upload-video {
            position: relative;
            display: inline-block;
            cursor: pointer;
            /deep/.upload-box {
                font-size: 16px;
                background-color: #3da6ff;
                color: #fff;
                width: 132px;
                height: 38px;
                line-height: 38px;
                text-align: center;
                border-radius: 4px;
            }
            .mask {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: transparent;
                z-index: 1;
            }
        }
        .disabled {
            cursor: not-allowed;
            /deep/.upload-box {
                background-color: #a0cfff;
                border-color: #a0cfff;
            }
        }
        .video-tip {
            margin-left: 10px;
            display: inline-block;
            line-height: 38px;
            font-size: 15px;
        }
    }
    .fromItem {
        display: flex;
        height: 34px;
        line-height: 34px;
        margin-bottom: 10px;
        /deep/.el-input__inner, /deep/.el-input__icon{
            height: 34px;
            line-height: 34px;
        }
        .textarea-wrap {
            width: 300px;
        }
        &.fromTit {
            height: auto;
        }
    }
    .bd-title {
        font-size: 16px;
        margin-right: 20px;
        font-weight: bold;
    }
    .upload-ppt-wrap {
        margin-top: 20px;
        text-align: right;
    }
    .ppt-material {
        /deep/.el-icon-loading {
            z-index: 90;
        }
        .ppt-preview {
            height: 500px;
            width: 100%;
            margin-top: 10px;
        }
        .ppt-blank-box {
            height: 500px;
            background-color: #eff3f6;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            .ppt-blank {
                text-align: center;
            }
            img {
                margin-bottom: 20px;
            }
            p {
                height: 20px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #77808a;
                line-height: 20px;
            }
        }
        .upload-ppt {
            cursor: pointer;
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
            /deep/.file-up-wrap {
                font-size: 16px;
                background-color: #fff;
                color: #222;
                padding: 0;
                border: none;
            }
        }
    }
    .save-wrap {
        text-align: center;
        .submit {
            display: inline-block;
            background-color: #3da6ff;
            color: #fff;
            font-size: 16px;
            width: 132px;
            height: 38px;
            line-height: 38px;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
.upload-progress-box {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    .upload-progress{
        width: 400px;
        height: 20px;
    }
}
</style>
