<!--
 * @Name: 带看材料准备
 * @Description: 带看材料准备
 * @Author: wangxue
 * @Date: 2020-2-26
 -->
<template>
    <div class="material-prepare">
        <!--左侧步骤条-->
        <div class="left-wrapper option">
            <div class="left-title">带看物料</div>
            <div class="swiper-class">
                <div class="shop_box">
                    <ul class="content">
                        <!--状态：左侧未完成和未完成，右侧未是否选中-->
                        <li
                            v-for="(menu, index) in allData"
                            :key="index"
                            :class="{'active':menu.is_read==='1'}"
                        >
                            <img
                                class="step-ok"
                                src="./images/icon_step_ok.png"
                                alt="状态完成"
                                v-if="menu.is_read==='1'"
                            />
                            <div :class="{'step-cont step-cont-active': currentIndex===index, 'step-cont': currentIndex !== index}">
                                <div
                                    :class="{'step-box step-box-active': currentIndex===index, 'step-box': currentIndex !== index}"
                                    @click="selectContent(index, menu)"
                                >{{menu.materials_name}}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--右侧内容-->
        <div class="right-wrapper">
            <div class="right-content">
                <ul>
                    <li
                        class="module-content"
                        v-for="(moduleItem, moduleIndex) in allData"
                        :key="moduleIndex"
                        v-show="moduleIndex===currentIndex"
                    >
                        <!-- 右侧前三个模块 -->
                        <div
                            class="module-onetwothree"
                            v-if="moduleIndex===0 || moduleIndex===1 || moduleIndex===2"
                        >
                            <div class="title-box">
                                {{moduleItem.materials_name}}
                            </div>
                            <!-- 右侧ppt部分 -->
                            <div class="right-content-wrap">
                                <iframe
                                    v-if='moduleItem.list && moduleItem.list[0].complete_url'
                                    :src=officePPT+moduleItem.list[0].complete_url
                                    width='100%'
                                    height='517'
                                >
                                </iframe>
                                <div
                                    v-else
                                    class="ppt-blank-box"
                                >
                                    <div class="ppt-blank">
                                        <img
                                            src="./images/img-ppt-blank.png"
                                            alt="未上传ppt"
                                        />
                                        <p>暂无ppt文件，请上传ppt</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 右侧后两个模块 -->
                        <div
                            class="module-fourfive"
                            v-else
                        >
                            <div class="title-box">
                                <ul class="clearfix">
                                    <li
                                        v-for="(menuItem, menuIndex) in moduleItem.list"
                                        :key="menuIndex+'title'"
                                        @click="moduleMenu(moduleIndex, menuIndex)"
                                    >
                                        <div :class="{'active-title': (moduleIndex===3 &&currentAreaIndex===menuIndex) || (moduleIndex===4 &&currentProjectIndex===menuIndex) }">{{menuItem.object_name}}</div>
                                    </li>
                                </ul>
                            </div>
                            <div class="right-content-wrap">
                                <ul>
                                    <li
                                        v-for="(contentItem, contentIndex) in moduleItem.list"
                                        :key="contentIndex+''"
                                        v-show="(moduleIndex===3 &&currentAreaIndex===contentIndex) || (moduleIndex===4 &&currentProjectIndex===contentIndex)"
                                    >
                                        <iframe
                                            v-if='contentItem.complete_url'
                                            :src=officePPT+contentItem.complete_url
                                            width='100%'
                                            height='517'
                                        >
                                        </iframe>
                                        <div
                                            v-else
                                            class="ppt-blank-box"
                                        >
                                            <div class="ppt-blank">
                                                <img
                                                    src="./images/img-ppt-blank.png"
                                                    alt="未上传ppt"
                                                />
                                                <p>暂无ppt文件，请上传ppt</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
                <!-- 上传ppt按钮 -->
                <div class="btn-area">
                    <jl-file-upload
                        class="btn-box"
                        ref="fileUpload"
                        fileType="ppt,pptx"
                        fileMaxSize="1000mb"
                        upID="onlineToolsPrepare"
                        :isProgress="true"
                        :ossData="ossData"
                        @getProgress='getProgress'
                        @beforeUpdate='beforeUpdate'
                        @getFileURL='uploadPPT'
                    >上传ppt</jl-file-upload>
                    <el-button
                        v-if="btnDownloadShow"
                        type="primary"
                        @click="downloadPPT"
                        class="btn-box btn-download">
                        下载
                    </el-button>
                </div>
            </div>
            <!--上一步下一步按钮-->
            <div class="step-btn-area">
                <div class="step-area">
                    <span
                        :class="{'step-btn unactive': currentIndex === 0, 'step-btn': !(currentIndex === 0)}"
                        @click="stepToStep(0)"
                    >上一步</span>
                    <span
                        class='step-btn'
                        @click="stepToStep(1)"
                    >{{currentIndex === this.allData.length - 1 ? "完成" : "下一步"}}</span>
                </div>
            </div>
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
    import onlineToolsApi from './api/onlineToolsApi';
    import { commonFun } from '@/assets/js/utils/utils';
    import { getSign } from '@/api/commonApi';
    import { mapState } from 'vuex';
    export default {
        name: 'material-prepare',
        data() {
            return {
                // 当前显示步骤
                currentIndex: 0,
                // 区域模块索引
                currentAreaIndex: 0,
                // 楼盘模块索引
                currentProjectIndex: 0,
                // 页面初始化数据
                allData: [],
                // 365预览ppt半路径
                officePPT: '//vip.ow365.cn/?i=20811&ssl=1&furl=',
                // 订单id
                orderId: '',
                // 带看id
                seeProjectId: this.$route.query.see_project_id,
                // 下载按钮是否显示
                btnDownloadShow: 0,
                loading: '',
                // 请求阿里地址返回的数据
                ossData: {},
                // 进度条
                uploadProgress: 0,
                // 进度条是否显示
                uploadProgressShow: false,
                // 上传阿里云地址
                uploadUrl: 'onlineTools'
            };
        },
        computed: {
            ...mapState(['trackCommon'])
        },
        mounted() {
            // 初始化数据
            this.initData();
            this.getSignCode();
        },
        methods: {
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
            // 下载按钮是否显示
            downloadBtnShow () {
                let url = '';
                if (this.currentIndex === 3) {
                    url = this.allData[3].list[this.currentAreaIndex].complete_url;
                } else if (this.currentIndex === 4) {
                    url = this.allData[4].list[this.currentProjectIndex].complete_url;
                } else {
                    url = this.allData[this.currentIndex].list[0].complete_url;
                }
                this.btnDownloadShow = url ? 1 : 0;
            },
            // 页面浏览埋点
            setTrackPage() {
                // 埋点
                let paraObj = {
                    order_id: this.orderId,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7177',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            // 点击上一步 下一步
            stepToStep(para) {
                if (para === 0 && this.currentIndex !== 0) {
                    // 点击上一步
                    // 进行埋点
                    let paraObj = {
                        order_id: this.orderId,
                        tag_type: this.allData[this.currentIndex].materials_type,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrack(
                        '7179',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                    --this.currentIndex;
                    if (this.allData[this.currentIndex].is_read === '2') {
                        // 标记已读状态
                        this.readState();
                        this.allData[this.currentIndex].is_read = '1';
                    }
                } else if (
                    para === 1 &&
                    this.currentIndex < this.allData.length
                ) {
                    // 点击下一步
                    // 如果是完成 则跳转到订单详情
                    if (this.currentIndex === this.allData.length - 1) {
                        window.location.href = `/index.php?r=yw-follow-up%2Findex&order_id=${this.orderId}`;
                        return;
                    }
                    // 进行埋点
                    let paraObj = {
                        order_id: this.orderId,
                        tag_type: this.allData[this.currentIndex].materials_type,
                        adviser_id: this.trackCommon.info.login_employee_id
                    };
                    commonFun.setTrack(
                        '7180',
                        this.trackCommon.info,
                        paraObj,
                        this.trackCommon.backendApi
                    );
                    ++this.currentIndex;
                    if (this.allData[this.currentIndex].is_read === '2') {
                        // 标记已读状态
                        this.readState();
                        this.allData[this.currentIndex].is_read = '1';
                    }
                }
                // 判断下载按钮是否显示
                this.downloadBtnShow();
            },
            // 上传之前
            beforeUpdate() {
                // 打开进度条
                this.uploadProgressShow = true;
            },
            // 获取上传进度条
            getProgress(file) {
                this.uploadProgress = file.percent;
                if (file.percent === 100) {
                    console.log(file);
                }
            },
            /**
             * 上传ppt
             * @param {String} fileData 文件路径
             * @return
             */
            async uploadPPT(fileData) {
                // 进行埋点
                let paraObj = {
                    order_id: this.orderId,
                    tag_type: this.allData[this.currentIndex].materials_type,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7182',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
                // 接口参数
                let params = {
                    materials_type: this.allData[this.currentIndex].materials_type,
                    see_project_id: this.seeProjectId,
                    url: fileData[0] ? fileData[0].upURL : ''
                };
                if (this.currentIndex === 3) {
                    this.allData[3].list[this.currentAreaIndex].complete_url = fileData[0].fileURL;
                    params.object_id = this.allData[3].list[this.currentAreaIndex].object_id;
                } else if (this.currentIndex === 4) {
                    this.allData[4].list[this.currentProjectIndex].complete_url = fileData[0].fileURL;
                    params.object_id = this.allData[4].list[this.currentProjectIndex].object_id;
                } else {
                    this.allData[this.currentIndex].list[0].complete_url = fileData[0].fileURL;
                }
                try {
                    let { data } = await onlineToolsApi.updateMaterials(params);
                    if (data.code === 0) {
                        this.$message(data.msg);
                    } else {
                        this.$message(data.msg)
                    }
                    // 关闭进度条
                    this.uploadProgressShow = false;
                    this.uploadProgress = 0;
                } catch (err) {
                    console.log(err)
                }
            },
            // 点击下载按钮
            downloadPPT() {
                let url = '';
                if (this.currentIndex === 3) {
                    url = this.allData[3].list[this.currentAreaIndex].complete_url;
                } else if (this.currentIndex === 4) {
                    url = this.allData[4].list[this.currentProjectIndex].complete_url;
                } else {
                    url = this.allData[this.currentIndex].list[0].complete_url;
                }
                window.location.href = url;
                // 进行埋点
                let paraObj = {
                    order_id: this.orderId,
                    tag_type: this.allData[this.currentIndex].materials_type,
                    adviser_id: this.trackCommon.info.login_employee_id
                };
                commonFun.setTrack(
                    '7181',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            /**
             * 点击四五模块菜单
             * @param {String} moduleMenu 模块索引
             * @param {String} menuIndex 模块内菜单索引
             * @return
             */
            moduleMenu(moduleMenu, menuIndex) {
                // 区域模块
                if (moduleMenu === 3) {
                    this.currentAreaIndex = menuIndex;
                } else {
                    // 楼盘模块
                    this.currentProjectIndex = menuIndex;
                }
                // 判断下载按钮是否显示
                this.downloadBtnShow();
            },
            // 点击左侧步骤
            selectContent(index, menu) {
                this.currentIndex = index;
                if (this.allData[index].is_read === '2') {
                    // 标记已读状态
                    this.readState();
                    this.allData[index].is_read = '1';
                }
                // 判断下载按钮是否显示
                this.downloadBtnShow();
                // 进行埋点
                let paraObj = {
                    order_id: this.orderId,
                    tag_type: this.allData[this.currentIndex].materials_type
                };
                commonFun.setTrack(
                    '7240',
                    this.trackCommon.info,
                    paraObj,
                    this.trackCommon.backendApi
                );
            },
            // 请求接口标记已读未读状态
            async readState() {
                let params = {
                    see_project_id: this.seeProjectId,
                    materials_type: this.allData[this.currentIndex].materials_type
                };
                try {
                    await onlineToolsApi.saveReadStatus(params);
                } catch (error) {
                    console.log(error);
                }
            },
            // 初始化数据
            async initData() {
                let params = {
                    see_project_id: this.seeProjectId
                };
                try {
                    let { data } = await onlineToolsApi.prepareMaterial(params);
                    if (data.code === 0) {
                        this.allData = data.data.result;
                        this.orderId = data.data.order_id;
                        // 如果第一模块未读，则标记已读状态
                        if (this.allData[0].is_read === '2') {
                            this.allData[0].is_read = '1';
                            this.readState();
                        }
                        // 判断下载按钮是否显示
                        this.downloadBtnShow();
                        // 页面浏览埋点
                        this.setTrackPage();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
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
    .upload-progress{
        width: 400px;
        height: 20px;
    }
}
.material-prepare {
    height: 100%;
    background-color: #fff;
}
.left-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 216px;
    height: 100%;
    padding-top: 30px;
    box-sizing: border-box;
    border-right: 2px dashed #e6e6e6;
    background-color: #fff;
}
.left-title {
    width: 169px;
    height: 53px;
    line-height: 53px;
    text-align: center;
    background: #2776ef;
    font-size: 18px;
    color: #fff;
    border-radius: 0px 100px 100px 0px;
    font-weight: bold;
}
.swiper-class {
    position: relative;
    margin-left: 40px;
}
.shop_box {
    width: 100%;
    white-space: nowrap;
}
.shop_box .content > li {
    position: relative;
    height: 60px;
    font-size: 14px;
    text-align: center;
    border-left: 2px dashed #e6e6e6;
}
.shop_box .content > li.active {
    border-color: #2776ef;
}
.shop_box .content > li:before {
    content: '';
    display: inline-block;
    position: absolute;
    left: -7px;
    bottom: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #e6e6e6;
}
.shop_box .content > li .step-ok {
    position: absolute;
    left: -7px;
    bottom: 0;
    width: 12px;
    height: 12px;
}
.content > li .step-cont {
    position: relative;
    margin-left: 14px;
    color: #333;
}
.content > li .step-cont-active:after {
    content: '';
    position: absolute;
    right: -2px;
    top: 39px;
    width: 0;
    border-width: 14px;
    border-style: solid;
    border-color: transparent #e6e6e6 transparent transparent; /* transparent 设置边框颜色透明 */
}
.content > li .step-box {
    position: absolute;
    left: 0;
    top: 30px;
    width: 103px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
}
.content > li .step-box-active {
    position: absolute;
    left: 0;
    top: 30px;
    width: 103px;
    height: 50px;
    background-color: #f3f6f9;
    line-height: 50px;
    text-align: center;
    color: #2776EF;
    font-size: 14px;
    font-weight: bold;
    z-index: 2;
}
.content > li .step-box-active:before {
    content: '';
    position: absolute;
    left: -12px;
    top: 18px;
    width: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent #f3f6f9 transparent transparent;
}
.right-wrapper {
    height: 100%;
    margin-left: 216px;
    background-color: #fff;
    position: relative;
}
.right-content {
    height: 100%;
    overflow-y: auto;
    padding: 0 30px 0 29px;
    box-sizing: border-box;
    background-color: #fff;
}
.module-onetwothree {
    .title-box {
        height: 86px;
        line-height: 86px;
        width: 56px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222;
    }
}

.module-fourfive {
    .title-box {
        padding: 30px 0 23px;
        li {
            margin: 0 10px 7px 0;
            height: 27px;
            float: left;
            cursor: pointer;
            div {
                padding: 0 10px;
                line-height: 27px;
                color: #222;
                font-size: 14px;
                &.active-title {
                    background: #2776ef;
                    border-radius: 2px;
                    color: #fff;
                }
            }
        }
    }
}
.ppt-blank-box {
    width: 100%;
    height: 487px;
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
        width: 100px;
    }
    p {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888;
        line-height: 20px;
    }
}
/deep/.btn-area {
    margin-top: 30px;
    padding-bottom: 26px;
    height: 38px;
    .btn-box, label {
        float: right;
        margin-left: 20px;
        width: 132px;
        height: 38px;
        background: #0ad487;
        border-radius: 4px;
        border: none;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #fff;
        line-height: 38px;
        padding: 0;
        cursor: pointer;
    }
    .btn-download {
        background: #2776EF;
    }
}
.step-btn-area {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 3;
    .step-area {
        width: 113px;
        height: 30px;
        background: #fff;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
        border-radius: 15px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222;
        line-height: 24px;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        cursor: pointer;
        .step-btn {
            flex: 1;
            color: #222;
            text-align: center;
            height: 24px;
            margin: 3px 0;
            &:first-of-type {
                border-right: 1px dashed #e6e6e6;
            }
            &:hover {
                color: #2776EF;
            }
        }
        .unactive {
            color: #888;
            cursor: not-allowed;
            &:hover {
                color: #888;
            }
        }
    }
}
</style>
