<!--
    @name: 购房知识新页面
    @description: 移植原来购房知识弹窗
    @author: hewei
    @date: 2019-09-11
-->

<template>
    <div
        class="jl-slider-content"
        v-loading="articleLoading"
    >
        <div class="jl-slider-l">
            <div class="jl-slider-header">
                <h4 class="jl-slider-title">文章列表</h4>
                <div class="city-select">
                    <label class="label">城市：</label>
                    <el-select
                        class="select"
                        v-model="cityValue"
                        placeholder="请选择"
                        @change="cityChange"
                    >
                        <el-option
                            v-for="item in cityOptions"
                            :key="item.cityValue"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="jl-menus">
                <ul class="slider-items"
                    ref="silderItem">
                    <div class="slider-items-box">
                        <li
                            :class="{'active first-menu-active': currenChosen.classIndex === index}"
                            v-for="(articleItems, index) in articleList"
                            :key="'article-' + index"
                            @click="selectMenu('classIndex', index)"
                        >
                            <span
                                v-if="currenChosen.classIndex === index"
                                class="iconfont iconicon_chosen"
                            ></span>
                            <span
                                v-else
                                class="iconfont iconcheck"
                            ></span>
                            <span>{{articleItems.name}}</span>
                            <span class="iconfont iconjiantou jl-arrow"></span>
                        </li>
                    </div>
                </ul>
                <!-- 二级菜单 -->
                <div class="slide-menu">
                    <div class="slide-menu-box">
                        <div
                            class="slider-items-chilren"
                            v-for="(subDist, subIndex) in (articleList[currenChosen.classIndex] ? articleList[currenChosen.classIndex].list: [])"
                            :key="'artiSub-' + subIndex"
                            @click="selectMenu('subIndex', subIndex)"
                        >
                            <div :class="{'items': !(currenChosen.subIndex === subIndex), 'items items-active': currenChosen.subIndex === subIndex}">
                                <h3>
                                    <span
                                        v-if="currenChosen.subIndex === subIndex"
                                        class="iconfont iconicon_chosen"
                                    ></span>
                                    <span
                                        v-else
                                        class="iconfont iconcheck"
                                    ></span>
                                    <span class="sub-tit">{{subDist.title}}</span>
                                    <div
                                        class="new-box"
                                        v-if="subDist.new"
                                    >
                                        <img
                                            src="./images/icon-new.png"
                                            alt="new文章图片"
                                        >
                                    </div>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="jl-slider-r"
            v-loading="contentLoading"
        >
            <div class="jl-slider-title">
                <span class="slider-title">{{currentContent.title ? currentContent.title : ''}}</span>
                <el-button
                    class="share"
                    @click="shareModal(currentArticle)"
                    type="primary"
                >分享</el-button>
            </div>
            <!-- 文章详情 -->
            <div class="scroll-area">
                <div class="jl-artcel-details">
                    <!-- 视频区 -->
                    <div
                        class="video-wrapper"
                        v-if="playerOptions.sources[0].src"
                    >
                        <div class="video-title">{{currentContent.video_name}}</div>
                        <div
                            class="video-box"
                            :class="{'video-replay-box': isReplay}"
                        >
                            <div
                                class="video-modal"
                                v-show="videoModal"
                            ></div>
                            <div
                                v-if="videoErrorFlag"
                                class="error-box"
                            >视频播放错误</div>
                            <div
                                class="replay-box"
                                @click="replayVideo"
                            >
                                <img
                                    src="./images/icon-replay.png"
                                    alt="重播"
                                >
                                <span class="replay-btn">重播</span>
                            </div>
                            <div class="play-duration-box">{{videoDuration}}</div>
                            <video
                                class="video-js vjs-default-skin vjs-big-play-centered"
                                :class="{'error-video': videoErrorFlag}"
                                webkit-playsinline
                                playsinline
                                x5-video-player-type="h5"
                                ref="videoPlayer"
                            >
                                您的浏览器不支持 video 标签
                            </video>
                        </div>
                    </div>
                    <!-- 图文区 -->
                    <div
                        class="pic-text-box"
                        v-html="currentContent.content"
                        v-if="currentContent.content"
                    >
                        <!-- 富文本 v-html -->
                    </div>
                    <div class="shadow-box"></div>
                    <!-- 楼盘区 -->
                    <div class="recommend-box">
                        <!-- tabbar -->
                        <div class="tab-recom-bar">
                            <div :class="`tab-item ${recommendHouse==='1' ? 'active' : ''}`">
                                <el-radio
                                    v-model="recommendHouse"
                                    label="1"
                                >
                                    推荐楼盘
                                </el-radio>
                            </div>
                            <div :class="`tab-item ${recommendHouse==='2' ? 'active' : ''}`">
                                <el-radio
                                    v-model="recommendHouse"
                                    label="2"
                                >不推荐楼盘</el-radio>
                            </div>
                        </div>
                        <!-- 推荐 楼盘列表 -->
                        <div
                            class="house-list"
                            v-if="recommendHouse === '1'"
                        >
                            <div class="hd">为您推荐楼盘</div>
                            <div class="desc">
                                基于以上的信息，我帮您匹配了几个适合您的楼盘，您这边可以了解一下，如果有感兴趣的楼盘，可以随时联系我，我帮您对比分析一下楼盘的优劣势：
                            </div>
                            <div
                                class="add-house"
                                @click="resetChooseHouse"
                            >
                                ＋新增推荐楼盘
                            </div>
                            <div class="card-wrap">
                                <div
                                    class="card-item"
                                    v-for="(project, index) in projectInfos"
                                    :key="index"
                                >
                                    <div class="card-info">
                                        <div class="img-wrap">
                                            <img
                                                :src="project.img"
                                                alt="楼盘图"
                                            >
                                        </div>
                                        <div class="card-desc">
                                            <div
                                                class="sell-status sall-ing"
                                                v-if="project.status == 2"
                                            >在售</div>
                                            <div
                                                class="sell-status sall-out"
                                                v-if="project.status == 3"
                                            >售罄</div>
                                            <div
                                                class="sell-status no-sall"
                                                v-if="project.status == 4"
                                            >待售</div>
                                            <div class="hd">{{project.name}}</div>
                                            <div class="price">
                                                <span class="square-price">{{project.current_rate}}元/m²</span>
                                                <span>{{project.acreage_min}}-{{project.acreage_max}}m²</span>
                                            </div>
                                            <div class="address">
                                                {{project.address}}
                                            </div>
                                            <div class="tag-wrap">
                                                <span
                                                    class="tag"
                                                    v-for="(tag, tagInd) in project.tag"
                                                    :key="tagInd"
                                                >{{tag}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-cause">
                                        <div class="hd">推荐理由</div>
                                        <div class="bd">
                                            <el-input
                                                maxlength="200"
                                                :id="`input${index}`"
                                                resize=none
                                                :readonly="!project.isEdit"
                                                type="textarea"
                                                :autosize="{ minRows: 3, maxRows: 4}"
                                                v-model="project.project_desc"
                                            >
                                            </el-input>
                                        </div>
                                    </div>
                                    <div class="edit-bar clearfloat">
                                        <span @click="editProject('delete', index)">删除</span>
                                        <span @click="editProject('edit', index)">{{project.isEdit ? '确认' : '编辑'}}</span>
                                        <span @click="editProject('down', index)">下移</span>
                                        <span @click="editProject('up', index)">上移</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 微信分享弹窗 -->
        <el-dialog
            title="选择分享方式"
            width="450px"
            class="dialog-share"
            :visible.sync="isModelshow"
            center
        >
            <div class="dialog-body">
                <div class="selector">
                    <el-radio
                        v-model="radioVal"
                        label="1"
                    >短信分享</el-radio>
                    <el-radio
                        v-model="radioVal"
                        label="2"
                    >微信分享</el-radio>
                </div>
                <div
                    class="wx-share"
                    v-if="radioVal === '2'"
                >
                    <div class="introduce">
                        <h5 class="introduce-msg">{{getWechatFriends}}</h5>
                        <el-button
                            type="text"
                            v-if="isShowBindBtn"
                            @click="showWechatBind"
                        >点击绑定微信</el-button>
                    </div>
                    <div
                        class="input-box"
                        v-if="wechatBindShow && hasbinded.length < 5"
                    >
                        客户微信：
                        <el-select
                            v-model="wechatVal"
                            filterable
                            placeholder="请输入微信号"
                            remote
                            :remote-method="getEmployeeContactInfo"
                            :loading="loading"
                        >

                            <el-option
                                v-for="item in wechatData"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-button
                            type="text"
                            class="bind-wx"
                            @click="bindWechat"
                        >绑定</el-button>
                        <el-button
                            class="btn-warn"
                            type="text"
                            @click="wechatBindShow = false"
                        >删除</el-button>
                    </div>
                    <div class="msg-warn">
                        <i class="iconfont icongantanhao-yuankuang" 
                            aria-hidden="true"></i>
                        <span>请将资料通过微信发送给绑定客户，即可完成发送资料的任务</span>
                    </div>
                    <div class="qr-code">
                        <img
                            class="img-code"
                            :src="codeUrl || ''"
                            alt="分享二维码"
                        >
                    </div>
                </div>
                <div
                    class="sms-share"
                    v-if="radioVal === '1'"
                >
                    <p class="title">资料将通过短信发送给：{{initPhone}}</p>
                    <div class="input-box">
                        添加其他手机号：
                        <input
                            type="text"
                            v-model="smsVal"
                            class="sms-input"
                            placeholder="请输入手机号"
                        >
                    </div>
                    <div class="msg-warn">
                        <i class="iconfont icongantanhao-yuankuang" 
                            aria-hidden="true"></i>
                        <span>微信分享的小程序，客户的打开率高50倍哟~</span>
                    </div>
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    class="btn-close"
                    @click="closeCodemodal"
                    v-if="radioVal === '2'"
                >关闭</el-button>
                <el-button
                    type="primary"
                    class="btn-close"
                    @click="smsShareHandle"
                    v-else
                >立即发送</el-button>
            </span>
        </el-dialog>
        <!-- 删除楼盘 -->
        <el-dialog
            title="提醒"
            class="hint-dialog"
            :visible.sync="deleteHouseShow"
            width="450px"
        >
            <div class="dialog-body">
                确定要删除{{projectInfos[deleteIndex] ? projectInfos[deleteIndex].name : ''}}楼盘？
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteHouseShow = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="deleteCurrent(deleteIndex, 1)"
                >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加楼盘 -->
        <el-dialog
            class="add-pro-dialog"
            :visible.sync="contralProject"
            width="496px"
        >
            <div
                slot="title"
                class="dialog-header"
            >
                新增推荐楼盘
                <span
                    class="iconfont iconclose_dialog"
                    @click="contralProject = false"
                ></span>
            </div>
            <div class="dialog-body">
                <div class="top-con">
                    <div class="add-house">
                        <div class="name">新增楼盘</div>
                        <div class="opt search-house">
                            <img
                                src="./images/search.png"
                                alt="搜索楼盘"
                            />
                            <el-autocomplete
                                :disabled="projectInfosTwo.length === 10"
                                v-model="buildName"
                                :fetch-suggestions="searchHouse"
                                :placeholder="houseHolder"
                                @select="affirmHouse"
                            ></el-autocomplete>
                        </div>
                    </div>
                </div>
                <div class="project-wrap">
                    <div
                        class="project-info"
                        v-for="(project, index) in projectInfosTwo"
                        :key="index"
                    >
                        <span class="house-name">{{index+1}}、{{project.name}}</span>
                        <span
                            class="delete"
                            @click="deleteCurrent(index, 2)"
                        >删除</span>
                    </div>
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    class="cancle"
                    @click="recommHouse(1)"
                >取 消</el-button>
                <el-button
                    class="affrim"
                    type="primary"
                    @click="recommHouse(2)"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { commonFun } from '@/assets/js/utils/utils';
import { trackAxios } from '@/assets/js/http/axios';
import { mapState } from 'vuex';
import shareApi from './api/searchToolShare';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import defultImg from './images/door_take.png';
const {
    shareArticle,
    getEmployeeContact,
    sendMsg,
    addWxContact,
    getArticleContent,
    getHouseList,
    getInitHouse
} = shareApi;
export default {
    data() {
        return {
            // 已请求的楼盘信息
            totalProInfo: [],
            // 弹窗中选择楼盘
            projectInfosTwo: [],
            // 楼盘提示文案
            houseHolder: '输入楼盘名搜索',
            // 搜索楼盘禁止点击
            projectState: true,
            // 楼盘名
            buildName: '',
            // 新增楼盘弹窗
            contralProject: false,
            // 删除楼盘名
            deleteIndex: '',
            // 删除楼盘弹窗
            deleteHouseShow: false,
            // 推荐楼盘信息
            projectInfos: {},
            // 当前选中内容
            currentContent: {},
            // 当前选中文章信息
            currentArticle: {},
            // 是否推荐楼盘 1推荐 2不推荐
            recommendHouse: '1',
            // 城市下拉框选项数据
            cityOptions: [],
            // 城市下拉框的值
            cityValue: '',
            loading: false,
            isModelshow: false,
            wechatBindShow: false,
            radioVal: '2',
            // 微信号绑定值
            wechatVal: '',
            // 手机号
            smsVal: '',
            // 默认手机号
            initPhone: '',
            // 微信好友列表数据
            wechatData: [],
            // 已绑定的微信
            hasbinded: [],
            articleLoading: false, // 文章请求时候loading
            articleList: [], // 文章列表
            // 是否是在拖动中
            isDraging: false,
            player: null,
            fullscreenFlag: false,
            // 是否是暂停状态（该状态用于自定义暂停状态，即需要埋点的状态）
            isPaused: true,
            // 是否是重播等待状态
            isReplay: false,
            // video参数
            playerOptions: {
                // 是否自动播放
                autoplay: false,
                // 是否静音
                muted: false,
                // 是否有控制条
                controls: true,
                // 语言
                language: 'en',
                // 是否展示当前时间
                currentTimeDisplay: false,
                // 视频资源
                sources: [
                    {
                        src: ''
                    }
                ],
                controlBar: {
                    // 是否有全屏按钮
                    fullscreenToggle: true,
                    // 剩余播放时长
                    remainingTimeDisplay: true
                },
                // 视频头图
                poster: ''
            },
            // 视频时长
            videoDuration: '',
            // video的蒙层出现标识
            videoModal: true,
            // 视频加载错误标识
            videoErrorFlag: false,
            currenChosen: {
                classIndex: 0,
                subIndex: 0
            }, // 当前选中的一级目录
            currenList: {}, // 当前第一级对象
            codeUrl: '', // 二维码链接
            // 文章内容loading
            contentLoading: false,
            mapChosen: {} // 点击地图里面的区域
        };
    },
    created() {
        // 初始化获取地图区域参数
        this.mapChosen = {
            distract_name: this.$route.query.distract_name,
            district_id: this.$route.query.district_id
        };
        // 初始化城市和订单参数
        this.cityId = this.$route.query.city_id;
        this.orderId = this.$route.query.order_id;
        this.cityName = this.$route.query.city_name;
    },
    mounted() {
        // 初始化赋值
        this.getData(this.cityId.split(',')[0]);
        this.createCityInfo();
        // 初始化默认值
        this.cityValue = this.cityId.split(',')[0];
        this.$nextTick(() => {
            // 图片加载不出来
            document.addEventListener('error', function (e) {
                var elem = e.target;
                if (elem.tagName.toLowerCase() === 'img') {
                    elem.src = defultImg;
                    elem.error = null;
                }
            }, true);
        });
    },
    computed: {
        ...mapState(['trackMessages', 'backendApi']),
        getWechatFriends() {
            return this.hasbinded.length === 0 ? '该订单暂未绑定微信' : `该订单绑定的微信名称为：${this.hasbinded.join()}`;
        },
        isShowBindBtn() {
            return this.hasbinded.length < 5;
        }
    },
    methods: {
        // 打开选择楼盘弹窗
        resetChooseHouse() {
            this.contralProject = true;
        },
        /**
         * 关闭新增推荐楼盘
         * @param {Number} type 确认2 / 取消1
         */
        recommHouse(type) {
            // 确定
            if (type === 2) {
                this.projectInfos = commonFun.deepClone(this.projectInfosTwo);
            }
            this.contralProject = false;
        },
        /**
         * 搜索楼盘
         * @param {String} val 输入楼盘名称
         * @param {Function} cb 返回下拉列表的回调函数
         */
        async searchHouse(val, cb) {
            try {
                if (val) {
                    // 隐藏历史记录模块
                    var list = [{}];
                    let params = {
                        projectName: val,
                        cityId: this.cityId,
                        order_id: this.$route.query.order_id
                    };
                    let { data } = await getHouseList(params);
                    if (data.code === 0) {
                        // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
                        for (let i of data.data) {
                            i.value = i.name; // 将想要展示的数据作为value
                        }
                        list = data.data;
                        cb(list);
                    }
                } else {
                    let plainArr = [];
                    cb(plainArr);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 选中楼盘
         * @param {Obkect} val 选中楼盘对象
         */
        async affirmHouse(val) {
            try {
                let params = {
                    article_id: this.currentArticle.id,
                    project_id: val.project_id
                };
                let { data } = await getInitHouse(params);
                if (data.code === 0) {
                    let isFind = this.projectInfosTwo.findIndex((item, index) => {
                        return item.id == val.project_id;
                    });
                    if (data.data.list && data.data.list.length > 0 && isFind === -1) {
                        this.projectInfosTwo.push(data.data.list[0]);
                    }
                    this.buildName = '';
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 删除楼盘
         * @param {String} type 删除type  1楼盘列表中删除 2添加楼盘弹窗删除
         * @param {Number} index 当前删除楼盘的索引
         */
        deleteCurrent(index, type) {
            if (type === 1) {
                let eleIndex = this.projectInfos.findIndex((ele, ind) => {
                    return index === ind;
                });
                let currInfo = this.projectInfos[eleIndex];
                let baseInd = this.projectInfosTwo.findIndex((ele, ind) => {
                    return currInfo.id === ele.id;
                })
                if (baseInd > -1) {
                    this.projectInfosTwo.splice(baseInd, 1);
                }
                this.projectInfos.splice(index, 1);
            } else {
                this.projectInfosTwo.splice(index, 1);
            }
            this.deleteHouseShow = false;
        },
        // 生成城市列表数
        createCityInfo() {
            if (!this.cityId || !this.cityName) {
                this.$message('城市id或名称不可为空');
                return;
            }
            const cityId = this.cityId.split(',');
            const cityName = this.cityName.split(',');
            this.cityOptions = cityId.map((ele, idx) => {
                return {
                    value: ele,
                    label: cityName[idx]
                };
            });
        },
        baseCode(para) {
            let Base64 = require('js-base64').Base64;
            return Base64.decode(para);
        },
        /**
         * 根据城市获取数据
         * @param {String} id 城市id字符串
         */
        getData(id) {
            // 添加动画
            this.articleLoading = true;
            let params = {
                city_id: id.split(',')
            };
            this.axios
                .post('/backend-api/bk-map/get-article', params)
                .then(res => {
                    if (res.data.code === 0) {
                        // 组装数据
                        this.articleList = [];
                        let arr = res.data.data;
                        let currenArr = [];
                        // 判断是否有选中区域
                        let disId = this.mapChosen ? this.mapChosen.district_id : '';
                        // 给默认选中对象赋值
                        if (disId) {
                            // 确保下面区域无匹配的时候默认选中第一个
                            this.currenChosen = {
                                classIndex: 0,
                                subIndex: 0
                            };
                            // 记录当前区域所在一级数组的索引
                            let areaIndex = 0;
                            arr.map(item => {
                                if (item.cate_id != '20') {
                                    currenArr.push(item);
                                } else {
                                    let obj;
                                    let itemArr = item.list;
                                    // 赋值索引
                                    areaIndex = i;
                                    itemArr.map((subItem, index) => {
                                        if (disId.toString() === subItem.district_id) {
                                            this.currenChosen = {
                                                classIndex: parseInt(index) + areaIndex,
                                                subIndex: 0
                                            };
                                            // 滚动到可是区域
                                            this.$nextTick(() => {
                                                let dom = document.getElementsByClassName('first-menu-active');
                                                if (dom.length > 0) {
                                                    let scroll = dom[0].offsetTop;
                                                    this.$refs.silderItem.scrollTop = scroll;
                                                }
                                            });
                                        }
                                        obj = {
                                            name: subItem.district_name,
                                            list: subItem.arr
                                        };
                                        currenArr.push(obj);
                                    });
                                }
                            });
                        } else {
                            this.currenChosen = {
                                classIndex: 0,
                                subIndex: 0
                            };
                            arr.map(item => {
                                if (item.cate_id != '20') {
                                    currenArr.push(item);
                                } else {
                                    let obj;
                                    let itemArr = item.list;
                                    itemArr.map(subItem => {
                                        obj = {
                                            name: subItem.district_name,
                                            list: subItem.arr
                                        };
                                        currenArr.push(obj);
                                    });
                                }
                            });
                        }
                        this.articleList = currenArr;
                        // 添加动画
                        this.articleLoading = false;
                    }
                })
                .catch(err => {
                    // 添加动画
                    this.articleLoading = false;
                    console.log(err);
                });
        },
        // 初始化video
        async initVideo() {
            if (!this.player) {
                this.player = await videojs(
                    this.$refs.videoPlayer,
                    this.playerOptions,
                    function onPlayerReady() { }
                );
                // 暂停
                this.player.on('pause', this.onPlayerPause);
                // 播放
                this.player.on('play', this.onPlayerPlay);
                // 拖动进度条完成
                this.player.on('seeked', this.onSeeked);
                // 播放完成
                this.player.on('ended', this.onPlayerEnded);
                // 视频准备就绪
                this.player.on('canplay', this.onPlayerCanplay);
                // 视频播放出错
                this.player.on('error', this.videoError);
                // 视频触发交互
                this.player.on('useractive', this.onUserActive);
                // 视频界面关闭交互
                this.player.on('userinactive', this.onInUserActive);
            }
            this.player.reset();
            this.player.poster(this.currentContent.video_pic || '');
            this.player.src(this.playerOptions.sources[0].src);
            this.player.load();
            // 去掉错误提示
            this.videoErrorFlag = false;
            // 时间设置为0
            this.player.currentTime(0);
            this.player.pause();
            this.isReplay = false;
        },
        // 视频错误提示
        videoError() {
            this.player.errorDisplay.close();
            // 展示错误信息
            this.videoErrorFlag = true;
            this.player.poster('');
        },
        // 视频界面关闭交互
        onInUserActive() {
            this.videoModal = false;
        },
        // 视频触发交互
        onUserActive() {
            this.videoModal = true;
        },
        // 点击重播按钮
        replayVideo() {
            this.isReplay = false;
            // 正在重播标识
            this.isReplaying = true;
            // 由于重播按钮点击后，在播放方法中会触发isPaused置为false，导致拖动onseek事件触发，从而无法触发播放埋点，所以此处手动给isPaused标识设置为true
            this.isPaused = true;
            this.player.play();
            // 关闭蒙层
            this.videoModal = false;
        },
        // 拖动事件
        onSeeked() {
            // 判断如果是暂停之后再拖动，则不用设置拖动中标识
            if (!this.isPaused) {
                this.isDraging = true;
            } else {
                if (this.isReplaying) {
                    // 完成了重播
                    this.isReplaying = false;
                    this.isPaused = false;
                }
            }
        },
        // 加载后播放（包括拖动后播放）
        onPlayerPlay() {
            // 错误提示
            this.videoErrorFlag = false;
            if (!this.isDraging) {
                if (!this.isReplaying) {
                    // 设置成当前未被暂停
                    this.isPaused = false;
                }
            } else {
                this.isDraging = false;
            }
        },
        // 视频暂停
        onPlayerPause() {
            // seeking判断是否是拖动引起的暂停，如果是true，则表示正在拖动中引起暂停
            if (!this.player.seeking()) {
                // 如果相等则是播放结束后触发的暂停
                if (this.player.duration() !== this.player.currentTime()) {
                    this.isDraging = false;
                    // 已暂停
                    this.isPaused = true;
                }
            }
        },
        // 视频播放完成
        onPlayerEnded(player) {
            // 退出全屏并且暂停
            if (this.player.isFullscreen()) {
                this.player.exitFullscreen();
                this.player.pause();
            }
            // 去掉播放按钮
            this.isReplay = true;
            let time = this.player.duration();
            if (time > 0) {
                this.videoDuration = time.toFixed(2);
            }
            // 加上蒙层
            this.videoModal = true;
        },
        // 是否可以播放
        onPlayerCanplay() {
            let time = this.player.duration();
            // 判断当前时长大于0
            if (time > 0) {
                this.videoDuration = time.toFixed(2);
            }
		},
        /**
         * 编辑楼盘卡片
         * @param {String} type 操作类型 删除delete 编辑edit 上移up 下移down
         * @param {Number} index 当前删除楼盘的索引
         */
        editProject(type, index) {
            if (type === 'delete') {
                this.deleteHouseShow = true;
                this.deleteIndex = index;
            } else if (type === 'edit') {
                // 给当前元素添加或去除只读属性
                let flag = !this.projectInfos[index].isEdit;
                this.$set(this.projectInfos[index], 'isEdit', flag);

                // 如果是是可以编辑的 自动获取焦点
                if (this.projectInfos[index].isEdit) {
                    let it = `input${index}`;
                    document.getElementById(it).focus();
                }
            } else if (type === 'up' && index > 0) {
                this.projectInfos[index] = this.projectInfos.splice(index - 1, 1, this.projectInfos[index])[0];
            } else if (type === 'down' && index !== this.projectInfos.length - 1) {
                this.projectInfos[index] = this.projectInfos.splice(index + 1, 1, this.projectInfos[index])[0];
            }
        },
        /**
         * 获取文章内容
         * @param {String} id 文章id
         */
        async getArticleInit(id) {
            try {
                // 打开loading
                this.contentLoading = true;
                let params = {
                    id: id
                };
                let result = await getArticleContent(params);
                let { data } = result;
                if (data.code === 0) {
                    this.currentContent = data.data;
                    // 推荐楼盘
                    data.data.project_info.forEach(ele => {
                        this.$set(ele, 'isEdit', false);
                    });
                    let findInd = this.totalProInfo.findIndex(ele => {
                        return ele.id === id;
                    });
                    if (findInd < 0) {
                        this.projectInfos = data.data.project_info ? commonFun.deepClone(data.data.project_info) : [];
                        this.projectInfosTwo = data.data.project_info ? commonFun.deepClone(data.data.project_info) : [];
                    } else {
                        this.projectInfos = commonFun.deepClone(this.totalProInfo[findInd].project_info);
                        this.projectInfosTwo = commonFun.deepClone(this.totalProInfo[findInd].project_info);
                    }
                    // 如果有楼盘 就默认推荐 否则默认不推荐
                    this.recommendHouse = this.projectInfos.length > 0 ? '1' : '2';
                    this.playerOptions.poster = this.currentContent.video_pic || '';
                    this.playerOptions.sources[0].src = this.currentContent.video_url || '';
                    this.$nextTick(() => {
                        if (this.playerOptions.sources[0].src) {
                            this.initVideo();
                        }
                    });
                    // 关闭loading
                    this.contentLoading = false;
                } else {
                    // 关闭loading
                    this.contentLoading = false;
                }
            } catch (err) {
                console.log(err);
                // 关闭loading
                this.contentLoading = false;
            }
        },
        // 点击列表
        selectMenu(paraName, paraIndex) {
            // 切换前存储start
            let curr = this.articleList.length > 0 && this.articleList[this.currenChosen.classIndex].list[this.currenChosen.subIndex]
                ? this.articleList[this.currenChosen.classIndex].list[this.currenChosen.subIndex] : {};
            let project = {
                id: curr.id,
                project_info: this.projectInfos && this.projectInfos.length > 0 ? this.projectInfos : []
            };
            let findInd = this.totalProInfo.findIndex(ele => {
                return ele.id === curr.id;
            });
            if (findInd < 0) {
                this.totalProInfo.push(project);
            } else {
                this.totalProInfo[findInd] = project;
            }
            this.$store.dispatch('house/get_article_info', this.totalProInfo);
            // 存储end

            if (paraName === 'classIndex') {
                this.firActive = paraIndex;
            }
            // 一级不相等的时候
            if (
                paraIndex !== this.currenChosen[paraName] &&
                paraName === 'classIndex'
            ) {
                this.currenChosen[paraName] = paraIndex;
                // 把第二级变为第一个
                this.currenChosen.subIndex = 0;
            } else {
                this.currenChosen[paraName] = paraIndex;
            }
        },
        // 埋点方法
        trackMethod(paraObj, trackId) {
            // 组装埋点数据
            let moreInfo = {
                screen_height: commonFun.ScreenHeight(),
                screen_width: commonFun.ScreenWidth(),
                device_type: commonFun.getDevice().device,
                os: commonFun.getOS().os,
                os_version: commonFun.getOS().os_version,
                browser: commonFun.getBrowse().browser,
                browser_version: commonFun.getBrowse().browser_version
            };
            let trackAll = Object.assign({}, moreInfo, this.trackMessages);
            let ex = { ini_params: trackAll };
            let trackExtr = Object.assign({}, paraObj, ex);
            let trackData = {
                extrack_arr: trackExtr,
                track_id: trackId
            };
            // 请求埋点接口
            trackAxios
                .post(this.backendApi + '/send-data/index', trackData)
                .then(res => {
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 点击绑定微信后展示绑定表单
        showWechatBind() {
            this.wechatBindShow = true;
        },
        // 绑定微信
        async bindWechat() {
            try {
                const wechateAccount = this.wechatVal;
                if (!wechateAccount) {
                    this.$message('绑定微信不可为空');
                    return;
                }
                // 第三个参数为固定参数7
                const {
                    data: { msg }
                } = await addWxContact(this.orderId, wechateAccount, '7');
                this.$message(msg);
            } catch (error) {
                console.log(error);
            }
        },
        // 分享按钮
        shareModal(para) {
            // 清除保存的数据
            this.totalProInfo = [];
            this.$store.dispatch('house/get_article_info', this.totalProInfo);
            this.isModelshow = true;
            let projectInfo = [];
            if (this.projectInfos.length > 0 && this.recommendHouse === '1') {
                this.projectInfos.forEach(item => {
                    let obj = {
                        project_id: item.id,
                        project_desc: item.project_desc
                    };
                    projectInfo.push(obj);
                });
            }
            let params = {
                article_id: para.id,
                order_id: this.orderId,
                category_id: para.category_id,
                share_type: '2',
                project: projectInfo
            };
            this.axios
                .post('/backend-api/bk-map/share-article', params)
                .then(({ data: { code, data } }) => {
                    if (code === 0) {
                        this.codeUrl = data.data.url;
                        this.hasbinded = data.data.user_wechat || [];
                        this.shareId = data.data.share_id;
                        this.initPhone = data.data.user_mobile;
                        // 埋点
                        let trackObj = {
                            share_type: '文章'
                        };
                        this.trackMethod(trackObj, '3917');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 获取微信联系人
        async getEmployeeContactInfo(val) {
            try {
                this.loading = true;
                const options = {
                    order_id: this.orderId,
                    q: val
                };
                const { data: { code, msg, data } } = await getEmployeeContact(options);
                if (code === 0) {
                    this.loading = false;
                    this.wechatData = JSON.stringify(data) === '{}' ? [] : data.list;
                } else {
                    this.$message(msg);
                }
            } catch (error) {
                console.log(err);
            }
        },
        // 短信分享按钮点击
        async smsShareHandle() {
            try {
                if (this.smsVal && !commonFun.verifyTelNum(this.smsVal)) {
                    this.$message('请输入正确的手机号');
                    return;
                }
                const options = {
                    order_id: this.orderId,
                    share_id: this.shareId,
                    user_mobile: this.smsVal,
                    share_type: '3'
                };
                const { data: { code, msg } } = await sendMsg(options);
                if (code === 0) {
                    this.$message('发送成功');
                    this.closeCodemodal();
                } else {
                    this.$message(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 关闭弹窗
        closeCodemodal() {
            this.isModelshow = false;
        },
        /**
         * 切换城市change事件
         * @param {String} val 回调值为选中的值
         */
        cityChange(val) {
            // 城市切换重新获取城市信息
            this.getData(val);
        }
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose();
        }
    },
    watch: {
        projectInfosTwo: {
            handler: function (val, oldval) {
                if (val.length === 10) {
                    this.houseHolder = '最多选择十个楼盘';
                } else {
                    this.houseHolder = '输入楼盘名搜索';
                }
            },
            deep: true
        },
        articleList: {
            handler: function (val, oldval) {
                let arr = val;
                this.currentArticle =
                    arr[this.currenChosen.classIndex].list[
                    this.currenChosen.subIndex
                    ];
            },
            deep: true
        },
        currenChosen: {
            handler: function (val, oldval) {
                this.currentArticle =
                    this.articleList.length > 0 && this.articleList[this.currenChosen.classIndex].list
                    [this.currenChosen.subIndex] ? this.articleList[this.currenChosen.classIndex].list[this.currenChosen.subIndex]
                        : {};
                if (JSON.stringify(this.currentArticle) !== '{}') {
                    this.getArticleInit(this.currentArticle.id);
                } else {
                    // 清空内容
                    this.currentContent = {};
                    // 默认不推荐
                    this.recommendHouse = '2';
                    // 清空楼盘信息
                    this.projectInfos = [];
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
@height: 65px;
@lineheight: 44px;
// 富文本img控制
.pic-text-box {
    img {
        width: 100% !important;
        margin: 5px 0;
    }
}
// 删除楼盘弹窗
.hint-dialog,
.add-pro-dialog {
    /deep/ .el-dialog {
        border-radius: 8px;
        .dialog-header {
            position: relative;
            font-size: 18px;
            font-family: PingFangSC-Medium;
            color: #3e4254;
            .iconclose_dialog {
                position: absolute;
                left: 0;
                top: -10px;
            }
        }
        .el-dialog__body {
            color: #3e4254;
        }
        .el-dialog__headerbtn {
            display: none;
        }
        .el-dialog__header {
            padding-top: 30px;
            padding-bottom: 0;
            text-align: center;
        }
        .el-dialog__footer {
            padding-top: 0;
            text-align: center;
        }
    }
}
.add-pro-dialog {
    /deep/ .el-dialog {
        .el-dialog__body {
            padding: 30px;
        }
        .top-con {
            overflow: hidden;
            margin-bottom: 20px;
            .add-house {
                float: left;
                .name {
                    color: #333;
                    margin-right: 4px;
                }
            }
            .add-house {
                overflow: hidden;
                .name {
                    float: left;
                    line-height: 40px;
                }
                .search-house {
                    float: right;
                    position: relative;
                    width: 375px;
                    img {
                        position: absolute;
                        left: 10px;
                        top: 12px;
                        width: 14px;
                        height: 14px;
                        z-index: 3;
                    }
                    .el-input__inner {
                        padding-left: 30px;
                    }
                    .el-autocomplete {
                        width: 100%;
                    }
                }
            }
        }
        .project-wrap {
            height: 265px;
            overflow-y: auto;
            .project-info {
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
                .house-name {
                    display: inline-block;
                    color: #3e4254;
                    font-size: 14px;
                    max-width: 400px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    font-weight: bold;
                    margin-right: 6px;
                }
                .delete {
                    position: relative;
                    top: -5px;
                    font-size: 12px;
                    color: #ff5c47;
                    cursor: pointer;
                }
            }
        }
        .dialog-footer {
            width: 280px;
            margin: auto;
            .el-button {
                width: 130px;
                font-size: 16px;
                text-align: center;
                border-radius: 4px;
                border: none;
                &.cancle {
                    color: #77808a;
                    background: #e6e6e6;
                }
                &.affrim {
                    color: #fff;
                    background: #33a1ff;
                }
            }
        }
    }
}
.pl {
    padding-left: 20px;
}
.border-b {
    border-bottom: dashed 1px #e6e6e6;
}

.fadeInleft-enter,
.fadeInleft-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
.fadeInleft-enter-active,
.fadeInleft-leave-active {
    transition: 0.25s cubic-bezier(0, 0, 1, 1);
}
.mask {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
}
.jl-slider-content {
    height: 100%;
    background-color: #fff;
    display: flex;
    .madel-container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        .madel-head {
            text-align: right;
        }
        .madel {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 406px;
            height: 420px;
            z-index: 4;
            background: #fff;
            margin-top: -210px;
            margin-left: -203px;
            box-sizing: border-box;
            border-radius: 7px;
            padding: 15px;
            .el-button {
                width: 130px;
            }
            img {
                width: 218px;
                height: 218px;
                display: block;
                margin: auto;
            }
            p {
                line-height: 22px;
                color: #abb0b5;
                font-size: 14px;
                margin-top: 20px;
                margin-bottom: 25px;
            }
            .closebtn {
                display: block;
                margin: auto;
            }
        }
    }
    .jl-slider-l,
    .jl-slider-r {
        height:100%;
        background-color: #fff;
    }
    .jl-slider-l {
        flex: 5;
        .jl-slider-header {
            width: 100%;
            box-sizing: border-box;
            .city-select {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 12px 30px;
                margin-bottom: 16px;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
                border-top: 1px solid #f5f7f8;
            }
            .select {
                flex: 1;
            }
            .label {
                margin-right: 6px;
            }
        }
        .jl-slider-title {
            height: @height;
            font-size: 18px;
            font-weight: bold;
            line-height: @height;
            padding-left: 30px;
        }
        .slider-items {
            flex: 8;
            border-right: dashed 1px #e6e6e6;
            height: 100%;
            overflow-y: auto;
        }
        .slider-items li {
            height: @lineheight;
            font-size: 14px;
            color: #3e4254;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            position: relative;
            padding-left: 55px;
            .iconicon_chosen,
            .iconcheck {
                position: absolute;
                left: 30px;
                font-size: 14px;
                &.iconcheck {
                    font-size: 13px;
                    color: #e6e6e6;
                    left: 30px;
                }
            }
            &:hover {
                background: #ecf0f1;
                .jl-arrow {
                    color: #475261;
                }
            }
            .jl-arrow {
                font-size: 12px;
                margin-right: 13px;
                color: #cdcdcd;
            }
            span:nth-child(2) {
                width: 90px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .slider-items li.active {
            background: #33a1ff;
            color: #fff;
            .jl-arrow {
                color: #fff;
            }
            .iconicon_chosen {
                color: #fff;
            }
        }
        .jl-menus {
            height: calc(100% - 146px);
            position: relative;
            display: flex;
            .iconicon_chosen {
                color: #33a1ff;
            }
        }
        .slide-menu {
            flex: 15;
            overflow-y: auto;
            height: 100%;
            .slide-menu-box {
                padding-bottom: 56px;
                .items {
                    overflow: hidden;
                    cursor: default;
                    &:hover {
                        background: rgba(236, 240, 241, 0.5);
                    }
                    h3 {
                        font-size: 14px;
                        color: #333;
                        font-weight: normal;
                        height: @lineheight;
                        line-height: @lineheight;
                        position: relative;
                        .border-b();
                        padding-left: 55px;
                        .iconicon_chosen,
                        .iconcheck {
                            position: absolute;
                            left: 30px;
                            top: 0;
                            font-size: 14px;
                            &.iconcheck {
                                font-size: 13px;
                                color: #e6e6e6;
                                left: 30px;
                            }
                        }
                        .sub-tit {
                            display: inline-block;
                            vertical-align: middle;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            max-width: 177px;
                        }
                        .new-box {
                            display: inline-block;
                            vertical-align: middle;
                            position: relative;
                            margin-left: 6px;
                            width: 32px;
                            height: 16px;
                            & > img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
                .items-active {
                    background: rgba(236, 240, 241, 0.5);
                    h3 {
                        .sub-tit {
                            color: #33a1ff;
                            font-weight: bold;
                        }
                        .iconicon_chosen {
                            color: #33a1ff;
                        }
                    }
                }
            }
        }
    }
    .jl-slider-r {
        flex: 8;
        border-left: dashed 1px #e6e6e6;
        .scroll-area {
            height: 100vh;
            overflow: auto;
            .jl-artcel-details {
                box-sizing: border-box;
                padding: 24px 0 121px;
                > div {
                    box-sizing: border-box;
                    background-color: #fff;
                    padding: 0 40px 24px;
                }
                .video-wrapper {
                    padding-bottom: 15px;
                }
                .pic-text-box {
                    padding-bottom: 15px;
                }
                .shadow-box {
                    height: 10px;
                    background-color: #f6f6f6;
                    padding-bottom: 0;
                }
                .recommend-box {
                    box-sizing: border-box;
                    padding-top: 24px;
                    .tab-recom-bar {
                        overflow: hidden;
                        display: flex;
                        justify-content: center;
                        margin-bottom: 24px;
                        .tab-item {
                            height: 32px;
                            text-align: center;
                            line-height: 34px;
                            border-radius: 4px;
                            float: left;
                            margin-right: 20px;
                            background-color: #f9f9f9;
                            /deep/.el-radio {
                                padding: 0 15px;
                                .el-radio__label {
                                    padding-left: 6px;
                                }
                            }
                            &.active {
                                background: rgba(51, 161, 255, 0.1);
                            }
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                    .house-list {
                        font-size: 14px;
                        .hd {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }
                        .desc {
                            text-align: justify;
                            line-height: 24px;
                            margin-bottom: 24px;
                        }
                        .add-house {
                            font-size: 16px;
                            text-align: center;
                            color: #33a1ff;
                            line-height: 30px;
                            width: 100%;
                            height: 28px;
                            border: 1px solid #e2e2e2;
                            margin-bottom: 10px;
                            cursor: pointer;
                        }
                        .card-wrap {
                            .card-item {
                                padding: 30px 0;
                                border-bottom: 1px solid #ecf0f4;
                                &:last-child {
                                    border: none;
                                }
                                .card-info {
                                    overflow: hidden;
                                    margin-bottom: 20px;
                                    .img-wrap {
                                        width: 224px;
                                        height: 168px;
                                        float: left;
                                        margin-right: 16px;
                                        border-radius: 4px;
                                        overflow: hidden;
                                        img {
                                            width: 100%;
                                            height: 100%;
                                        }
                                    }
                                    .card-desc {
                                        margin-left: 110px;
                                        font-size: 14px;
                                        position: relative;
                                        > div {
                                            &:last-child {
                                                margin-bottom: 0;
                                            }
                                        }
                                        .sell-status {
                                            position: absolute;
                                            right: 0;
                                            top: 0;
                                            padding: 1px 8px;
                                            transform: scale(0.9);
                                            border-radius: 2px;
                                            &.sall-out {
                                                color: #7e8c8f;
                                                background-color: #f0f4f5;
                                            }
                                            &.sall-ing {
                                                color: #0ad487;
                                                background-color: #e1fbf3;
                                            }
                                            &.no-sall {
                                                color: #47b3e3;
                                                background-color: #effbfe;
                                            }
                                        }
                                        .hd {
                                            width: 390px;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            font-size: 20px;
                                            margin-bottom: 6px;
                                        }
                                        .price {
                                            white-space: nowrap;
                                            margin-bottom: 8px;
                                            .square-price {
                                                color: #fa5f35;
                                                font-weight: bold;
                                                margin-right: 10px;
                                            }
                                            > span {
                                                &:last-child {
                                                    color: #77808a;
                                                }
                                            }
                                        }
                                        .address {
                                            color: #77808a;
                                            max-width: 600px;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            white-space: nowrap;
                                            margin-bottom: 11px;
                                        }
                                        .tag-wrap {
                                            position: relative;
                                            left: -2px;
                                            .tag {
                                                font-size: 12px;
                                                display: inline-block;
                                                float: left;
                                                margin-right: 8px;
                                                padding: 1px 8px;
                                                background-color: #f3f6f9;
                                                color: #77808a;
                                            }
                                        }
                                    }
                                }
                                .card-cause {
                                    box-sizing: border-box;
                                    padding: 20px 20px 12px;
                                    background-color: #f4f8f9;
                                    border-radius: 4px;
                                    position: relative;
                                    margin-bottom: 14px;
                                    &::before {
                                        border-left: 10px solid transparent;
                                        border-right: 10px solid transparent;
                                        border-bottom: 10px solid #f4f8f9;
                                        content: '';
                                        position: absolute;
                                        width: 0;
                                        top: -10px;
                                        left: 40px;
                                    }
                                    .hd {
                                        margin-bottom: 10px;
                                        font-family: PingFangSC-Medium;
                                        font-size: 16px;
                                        line-height: 22px;
                                    }
                                    .bd {
                                        /deep/.el-textarea__inner {
                                            height: 44px;
                                            padding: 0 2px 5px;
                                            border: none;
                                            background-color: transparent;
                                            font-size: 14px;
                                            line-height: 20px;
                                        }
                                    }
                                }
                                .edit-bar {
                                    > span {
                                        float: right;
                                        font-size: 14px;
                                        padding: 3px 15px;
                                        border: 1px solid #77808a;
                                        border-radius: 14px;
                                        margin-left: 8px;
                                        cursor: pointer;
                                    }
                                }
                                .hd {
                                    font-size: 16px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .jl-slider-title {
            height: @height;
            line-height: @height;
            text-align: center;
            font-size: 16px;
            overflow: hidden;
            padding: 0 40px;
            box-shadow: 1px 2px 2px 0px rgba(146, 146, 146, 0.1);
            position: relative;
            .slider-title {
                display: inline-block;
                color: #333;
                width: 400px;
                font-size: 26px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .share {
                padding: 6px 10px;
                font-size: 16px;
                float: right;
                margin-top: 17px;
                border-radius: 2px;
                box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
                width: 52px;
                height: 30px;
            }
        }
        .jl-artcel-details {
            padding: 20px 20px 121px 20px;
            box-sizing: border-box;
            p {
                font-size: 12px;
                color: #333;
                line-height: 24px;
            }
            img {
                width: 100%;
            }
        }
    }
}
/* 视频模块 */
.video-wrapper {
    background-color: #fff;
    .video-title {
        font-size: 16px;
        color: #3e4a59;
    }
    .video-box {
        position: relative;
        overflow: hidden;
        width: 690px;
        height: 390px;
        border-radius: 4px;
        margin-top: 20px;
        .video-modal {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 2;
            background: rgba(0, 0, 0, 0.1);
        }
        .play-duration-box {
            display: none;
            position: absolute;
            bottom: 10px;
            right: 11px;
            line-height: 18px;
            z-index: 3;
            color: #fff;
        }
        .replay-box {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;
            & > img {
                width: 32px;
                height: 32px;
            }
            .replay-btn {
                display: block;
                width: 100%;
                margin-top: 5px;
                font-size: 14px;
                line-height: 18px;
                text-align: center;
                color: #fff;
            }
        }
        .error-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px;
            color: #fff;
            z-index: 3;
        }
        /deep/.video-js {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background: #000;
            .vjs-progress-holder {
                z-index: 3;
                height: 2px;
            }
            .vjs-play-progress {
                z-index: 3;
                &::before {
                    font-size: 12px;
                }
            }
            .vjs-control-bar {
                height: 24px;
                margin-bottom: 6px;
                padding: 0 10px;
                box-sizing: border-box;
                background-color: transparent;
                z-index: 3;
                .vjs-icon-placeholder {
                    &::before {
                        font-size: 22px;
                        line-height: 24px;
                    }
                }
                .vjs-play-control {
                    width: 24px;
                    order: 1;
                }
                .vjs-time-control {
                    display: block;
                }
                .vjs-time-divider,
                .vjs-picture-in-picture-control,
                .vjs-remaining-time,
                .vjs-volume-panel-horizontal {
                    display: none;
                }
                .vjs-current-time {
                    order: 1;
                    padding: 0 5px 0 7px;
                    line-height: 24px;
                    font-size: 14px;
                }
                .vjs-progress-control {
                    order: 2;
                }
                .vjs-duration {
                    order: 3;
                    padding: 0 7px 0 5px;
                    line-height: 24px;
                    font-size: 14px;
                }
                .vjs-fullscreen-control {
                    width: 24px;
                    order: 4;
                }
            }
            .vjs-big-play-button {
                margin: 0;
                transform: translate(-50%, -50%);
                border: none;
                background-color: transparent;
                font-size: 35px;
                z-index: 3;
            }
            .vjs-poster {
                background-color: #fff;
            }
        }
        /deep/.vjs-fullscreen {
            .vjs-control-bar {
                background-color: rgba(43, 51, 63, 0.7);
            }
        }
        /deep/.vjs-user-active {
            background: #000;
        }
    }
    .video-replay-box {
        .replay-box {
            display: inline-block;
        }
        .play-duration-box {
            display: inline-block;
        }
        /deep/.video-js {
            .vjs-big-play-button {
                display: none;
            }
            .vjs-control-bar {
                display: none;
            }
        }
    }
}
.dialog-share {
    font-size: 14px;
    /deep/ .el-dialog__header {
        padding-top: 30px;
        .el-dialog__title {
            font-weight: bold;
            color: #3e4254;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #4c4c4c;
            font-size: 20px;
            font-weight: bold;
        }
    }
    /deep/ el-input__inner {
        width: 230px;
    }
    /deep/ .el-dialog__body {
        padding-bottom: 10px;
    }
    .dialog-body {
        min-height: 300px;
        overflow-y: auto;
    }
    .selector {
        margin-bottom: 22px;
        margin-top: 10px;
    }
    .introduce {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .introduce-msg {
        font-size: 14px;
        margin-right: 20px;
        font-weight: normal;
    }
    .input-box {
        margin-top: 15px;
        /deep/ .el-input__inner {
            width: 230px;
        }
    }
    .sms-input {
        width: 220px;
        height: 20px;
        line-height: 20px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        background-color: #fff;
    }
    .msg-warn {
        margin: 4px 0;
        color: #ff5c47;
        font-size: 12px;
    }
    .btn-warn {
        color: #ff5c47;
        font-size: 12px;
    }
    .bind-wx {
        font-size: 12px;
        margin-left: 6px;
    }
    .qr-code {
        margin: 30px auto 10px;
        width: 150px;
        height: 150px;
        background-color: #ccc;
    }
    .img-code {
        width: 100%;
        height: 100%;
    }
    .btn-close {
        width: 132px;
        height: 38px;
    }
}
</style>
<style scoped>
.jl-artcel-details {
    padding: 20px 20px 65px 20px;
    box-sizing: border-box;
}
.jl-artcel-details >>> p {
    font-size: 12px;
    color: #333;
    line-height: 24px;
}
.jl-artcel-details >>> img {
    width: 100%;
}
</style>
