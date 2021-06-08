<template>
    <div
        class="couout-container"
        v-loading="loading"
        :element-loading-text="loadText"
    >
        <!-- 遮罩层 -->
        <div class="left-wrap">
            <Map
                v-if="showMap"
                ref="map"
                :filters="filters"
                :location="location"
                :showPage="showPage"
                :isInit="isInit"
                @mapLoadEvent="mapLoad"
                @load="loadSuccess"
            />
        </div>
        <div class="right-wrap">
            <!-- 右侧操作栏 -->
            <div
                class="page-one"
                v-if="showPage === '1'"
            >
                <div class="page-row">
                    <h2>
                        地图名称
                    </h2>
                    <el-input
                        v-model.trim="mapName"
                        placeholder="请输入地图名称，最多30字"
                        maxlength="30"
                        class="ipt-name"
                        @blur="editMapName"
                        @keyup.enter.native="enterIpt($event)"
                    ></el-input>
                </div>
                <div class="page-row">
                    <h2>
                        编辑地图
                    </h2>
                    <p>
                        在下载前，建议先对地图进行编辑
                    </p>
                    <button
                        class="btn btn-editMap"
                        @click="jumpPage('2')"
                    >
                        编辑地图
                    </button>
                </div>
                <div class="page-row">
                    <h2>
                        下载地图
                    </h2>
                    <p>
                        下载前请先保证你使用
                        <span>谷歌浏览器</span>
                        打开当前页面，且你的电脑性能满足以下条件：
                    </p>
                    <ul class="tips-list">
                        <li>
                            性能要求：内存大于4G
                        </li>
                        <li>
                            开始下载后，请保持页面打开，且不要进行其他操作，等待下载完成，下载时间会根据电脑性能的不同而不同
                        </li>
                    </ul>
                    <button
                        class="btn btn-editMap"
                        @click="exportMapImg"
                    >
                        开始下载地图
                    </button>
                </div>
            </div>
            <div
                class="page-two"
                v-if="showPage === '2'"
            >
                <div class="edit-step">
                    <div>
                        <span class="bg">
                            第1/2步
                        </span>
                        <h2>
                            设置楼盘
                        </h2>
                    </div>
                    <div class="operate">
                        <span
                            class="sign-edit"
                            @click="jumpPage('1')"
                        >
                            退出编辑
                        </span>
                        <span
                            class="next-edit"
                            @click="jumpPage('3')"
                        >
                            下一步
                        </span>
                    </div>
                </div>
                <div class="page-row">
                    <h2>
                        筛选你要展示的楼盘
                    </h2>
                    <ul class="screen">
                        <li>
                            <div class="th">
                                业态
                            </div>
                            <div class="td">
                                <span
                                    :class="filters.projectType.length > 0 ? 'limit' : 'no-limit'"
                                    @click="noLimit('projectType')"
                                >
                                    不限
                                </span>
                                <el-checkbox-group
                                    v-model="filters.projectType"
                                    class="check-box"
                                    @change="randerMark"
                                >
                                    <el-checkbox label="1">住宅</el-checkbox>
                                    <el-checkbox label="3">商住</el-checkbox>
                                    <el-checkbox label="2">别墅</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </li>
                        <li>
                            <div class="th">
                                销售状态
                            </div>
                            <div class="td">
                                <span
                                    :class="filters.status.length > 0 ? 'limit' : 'no-limit'"
                                    @click="noLimit('status')"
                                >
                                    不限
                                </span>
                                <el-checkbox-group
                                    v-model="filters.status"
                                    class="check-box"
                                    @change="randerMark"
                                >
                                    <el-checkbox label="2">在售</el-checkbox>
                                    <el-checkbox label="4">待售</el-checkbox>
                                    <el-checkbox label="3">售罄</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </li>
                        <li>
                            <div class="th">
                                合作状态
                            </div>
                            <div class="td">
                                <span
                                    :class="filters.isCooperate.length > 0 ? 'limit' : 'no-limit'"
                                    @click="noLimit('isCooperate')"
                                >
                                    不限
                                </span>
                                <el-checkbox-group
                                    v-model="filters.isCooperate"
                                    class="check-box"
                                    @change="randerMark"
                                >
                                    <el-checkbox label="1">合作</el-checkbox>
                                    <el-checkbox label="2">非合作</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </li>
                        <li>
                            <div class="th">
                                单价
                            </div>
                            <div class="td posi-relative">
                                <div v-if="filters.offerPrice.isEdit">
                                    <el-input
                                        v-model="filters.offerPrice.min"
                                        class="ipt-min"
                                        @input="inputNum(filters.offerPrice.min, 'offerPrice', 'min')"
                                    ></el-input>
                                    -
                                    <el-input
                                        v-model="filters.offerPrice.max"
                                        class="ipt-min"
                                        @input="inputNum(filters.offerPrice.max, 'offerPrice', 'max')"
                                    ></el-input>
                                    元/㎡
                                </div>
                                <div
                                    v-else
                                    class="show-text"
                                >
                                    {{filters.offerPrice.min * 1 === 0 ? '0' : filters.offerPrice.min}} -
                                    {{filters.offerPrice.max * 1 === 0 ? '不限' : filters.offerPrice.max + '元/㎡'}}
                                </div>
                                <el-checkbox
                                    v-model="filters.offerPrice.undetermined"
                                    class="be-pending"
                                    @change="randerMark"
                                >
                                    筛选结果需要包含单价待定的楼盘
                                </el-checkbox>
                                <span
                                    class="edit-ok"
                                    v-if="filters.offerPrice.isEdit"
                                    @click="okPrice('offerPrice', false)"
                                >
                                    确定
                                </span>
                                <span
                                    class="edit-ok"
                                    v-else
                                    @click="okPrice('offerPrice', true)"
                                >
                                    编辑
                                </span>
                            </div>
                        </li>
                        <li>
                            <div class="th">
                                总价
                            </div>
                            <div class="td posi-relative">
                                <div v-if="filters.price.isEdit">
                                    <el-input
                                        v-model="filters.price.min"
                                        class="ipt-min"
                                        @input="inputNum(filters.price.min, 'price', 'min')"
                                    ></el-input>
                                    -
                                    <el-input
                                        v-model="filters.price.max"
                                        class="ipt-min"
                                        @input="inputNum(filters.price.max, 'price', 'max')"
                                    ></el-input>
                                    万元
                                </div>
                                <div
                                    v-else
                                    class="show-text"
                                >
                                    {{filters.price.min * 1 === 0 ? '0' : filters.price.min}} -
                                    {{filters.price.max * 1 === 0 ? '不限' : filters.price.max + '万元'}}
                                </div>
                                <el-checkbox
                                    v-model="filters.price.undetermined"
                                    class="be-pending"
                                    @change="randerMark"
                                >
                                    筛选结果需要包含总价待定的楼盘
                                </el-checkbox>
                                <span
                                    class="edit-ok"
                                    v-if="filters.price.isEdit"
                                    @click="okPrice('price', false)"
                                >
                                    确定
                                </span>
                                <span
                                    class="edit-ok"
                                    v-else
                                    @click="okPrice('price', true)"
                                >
                                    编辑
                                </span>
                            </div>
                        </li>
                    </ul>
                    <p class="tips-foot">
                        有遇到楼盘信息不准确的情况，请反馈给城市运营同学更改，更改后第二天即可生效
                    </p>
                </div>
                <div class="page-row">
                    <h2>
                        设置每个楼盘要展示的信息
                    </h2>
                    <p class="tips-foot">
                        提示：信息越少，地图展示约清晰，越不容易造成标签重叠
                    </p>
                    <ul class="screen screen-show">
                        <li>
                            <div class="th">
                                业态
                            </div>
                            <div class="td">
                                <el-radio-group
                                    v-model="filters.showProjectType"
                                    class="check-radio"
                                    @change="randerMark"
                                >
                                    <el-radio label="1">不展示</el-radio>
                                    <el-radio label="2">展示</el-radio>
                                </el-radio-group>
                            </div>
                        </li>
                        <li>
                            <div class="th">
                                面积
                            </div>
                            <div class="td">
                                <el-radio-group
                                    v-model="filters.showAcreage"
                                    class="check-radio"
                                    @change="randerMark"
                                >
                                    <el-radio label="1">不展示</el-radio>
                                    <el-radio label="2">展示</el-radio>
                                </el-radio-group>
                            </div>
                        </li>
                        <li>
                            <div class="th">
                                价格
                            </div>
                            <div class="td">
                                <el-radio-group
                                    v-model="filters.showPrice"
                                    class="check-radio"
                                    @change="randerMark"
                                >
                                    <el-radio label="1">不展示</el-radio>
                                    <el-radio label="2">展示单价</el-radio>
                                    <el-radio label="3">展示总价</el-radio>
                                </el-radio-group>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                class="page-three"
                v-if="showPage === '3'"
            >
                <div class="edit-step">
                    <div>
                        <span class="bg">
                            第2/2步
                        </span>
                        <h2>
                            判断重叠楼盘
                        </h2>
                    </div>
                    <div class="operate">
                        <span
                            class="sign-edit next-edit"
                            @click="jumpPage('2')"
                        >
                            上一步
                        </span>
                        <span
                            class="next-edit"
                            @click="submitMove"
                        >
                            保存
                        </span>
                    </div>
                </div>
                <div class="page-row flex mb-25">
                    <h2>
                        请在地图中拖拽下列重叠楼盘
                    </h2>
                </div>
                <div
                    class="handle-items"
                    v-for="(items, index) in nearData"
                    :key="index"
                >
                    <div class="flex">
                        <h3>
                            重复楼盘组{{index + 1}}
                        </h3>
                    </div>
                    <ul>
                        <li
                            v-for="(item, idx) in items"
                            :key="idx"
                        >
                            <div class="text">
                                {{item.name}}
                            </div>
                            <div class="control">
                                <span
                                    class="location"
                                    @click="mapLocation(item)"
                                >
                                    定位
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Map from './components/CutoutBMap';
    import { cutoutIndex } from './api/cutoutMapApi';
    import { commonFun } from '@/assets/js/utils/utils';
    import loadMap from '@/assets/js/utils/map.js';
    export default {
        name: 'cutout-index',
        data() {
            return {
                showMap: false,
                // 地图名称
                mapName: '',
                // 备份地图名称
                cloneMapName: '',
                // 初始化load
                loading: true,
                loadText: '正在加载，请稍等！',
                // 过滤条件
                filters: {
                    // 业态
                    projectType: [],
                    // 销售状态
                    status: [],
                    // 合作状态
                    isCooperate: [],
                    // 单价
                    offerPrice: {
                        min: '',
                        max: '',
                        undetermined: true,
                        isEdit: false
                    },
                    // 总价
                    price: {
                        min: '',
                        max: '',
                        undetermined: true,
                        isEdit: false
                    },
                    // 业态展示
                    showProjectType: '',
                    // 价格展示
                    showPrice: '',
                    // 面积展示
                    showAcreage: ''
                },
                // 步数
                showPage: '1',
                // 重叠楼盘
                nearData: [],
                // 定位位置
                location: {
                    id: '',
                    lng: '',
                    lat: ''
                },
                // 初始化值之后再渲染楼盘
                isInit: false
            };
        },
        components: {
            Map
        },
        mounted() {
            loadMap.loadMap().then(() => {
                this.showMap = true;
                this.jumpPage('1');
            });
            this.$store.dispatch('getTrackCommon');
        },
        methods: {
            // 地图组件加载完成
            loadSuccess() {
                if (this.showPage === '1') {
                    // 无保存取原有筛选条件
                    this.getMapName();
                }
            },
            // 导出地图
            exportMapImg() {
                // 埋点拓展字段
                let paraObj = {
                    city: this.$route.query.cityName,
                    map_id: this.$route.query.mapId
                };
                // 埋点请求
                commonFun.setTrack('6065', this.$store.state.trackCommon.info, paraObj, this.$store.state.trackCommon.backendApi);
                this.$refs.map.exportMap();
            },
            /**
             * @description: 定位
             * @param {object} item 楼盘经纬度
             */
            mapLocation(item) {
                this.location.id = item.project_id;
                this.location.lng = item.lng;
                this.location.lat = item.lat;
                this.$refs.map.setLocation();
            },
            /**
             * @description: 地图load
             * @param {object} load 加载状态
             * @param {boolean} load.status 布尔
             * @param {string} load.text 加载文字
             */
            mapLoad(load) {
                this.loading = load.status;
                this.loadText = load.text;
            },
            /**
             * @description: 不限点击事件
             * @param {string} key filters的key
             */
            noLimit(key) {
                if (this.filters[key].length) {
                    this.filters[key] = [];
                    this.randerMark();
                }
            },
            /**
             * @description: 确定单价总价
             * @param {string} key 单价 总价对应key
             * @param {boolean} type 是否编辑状态
             */
            okPrice(key, type) {
                this.filters[key].isEdit = type;
                if (!type) {
                    this.randerMark();
                }
            },
            /** 控制右侧模块显示隐藏
             * @param {string} type '1' '2' '3'   控制当前页
             */
            async jumpPage(type) {
                this.showPage = type;
                if (this.showPage === '3') {
                    let filters = this.filters;
                    this.loading = true;
                    let params = {
                        map_id: this.$route.query.mapId,
                        project_type: filters.projectType + '',
                        status: filters.status + '',
                        is_cooperate: filters.isCooperate + '',
                        offer_price_min: filters.offerPrice.min,
                        offer_price_max: filters.offerPrice.max,
                        undetermined_offer_price: filters.offerPrice.undetermined ? '1' : '2',
                        price_min: filters.price.min * 10000,
                        price_max: filters.price.max * 10000,
                        undetermined_price: filters.price.undetermined ? '1' : '2',
                        show_project_type: filters.showProjectType,
                        show_price: filters.showPrice,
                        show_acreage: filters.showAcreage
                    };
                    try {
                        let { data } = await cutoutIndex.initNear(params);
                        this.loading = false;
                        if (data.code === 0) {
                            this.nearData = data.data.result;
                        }
                    } catch (e) {}
                } else if (this.showPage === '1') {
                    // 无保存取原有筛选条件
                    this.getMapName();
                }
            },
            // 保存数据
            submitMove() {
                new Promise(resolve => {
                    resolve(this.$refs.map.saveMove());
                }).then(res => {
                    if (res) {
                        this.jumpPage('1');
                    }
                });
            },
            // 动态渲染覆盖物
            randerMark() {
                this.$refs.map.initMark(this.$refs.map.getRect());
            },
            // 获取地图名称
            async getMapName() {
                try {
                    if (!this.$refs.map) {
                        return false;
                    }
                    let rect = this.$refs.map.getRect();
                    let params = {
                        map_id: this.$route.query.mapId,
                        min_lat: rect.minLat,
                        max_lat: rect.maxLat,
                        min_lng: rect.minLng,
                        max_lng: rect.maxLng
                    };
                    this.isInit = false;
                    let { data } = await cutoutIndex.getMapName(params);
                    if (data.code === 0) {
                        this.mapName = data.data.map_name;
                        this.cloneMapName = data.data.map_name;
                        let searchData = data.data.searchData;
                        this.filters.projectType = searchData.project_type;
                        this.filters.status = searchData.status;
                        this.filters.isCooperate = searchData.is_cooperate;
                        this.filters.offerPrice.min = searchData.offer_price_min;
                        this.filters.offerPrice.max = searchData.offer_price_max;
                        if (searchData.undetermined_offer_price === '1') {
                            this.filters.offerPrice.undetermined = true;
                        } else {
                            this.filters.offerPrice.undetermined = false;
                        }
                        this.filters.price.min = searchData.price_min / 10000;
                        this.filters.price.max = searchData.price_max / 10000;
                        if (searchData.undetermined_price === '1') {
                            this.filters.price.undetermined = true;
                        } else {
                            this.filters.price.undetermined = false;
                        }
                        this.filters.showProjectType = searchData.show_project_type;
                        this.filters.showPrice = searchData.show_price;
                        this.filters.showAcreage = searchData.show_acreage;
                        this.isInit = true;
                    }
                    this.loading = false;
                } catch (e) {
                    this.loading = false;
                    console.log(e);
                }
            },
            // 修改地图名称
            async editMapName() {
                if (this.mapName !== '' && this.mapName !== this.cloneMapName) {
                    let params = {
                        map_id: this.$route.query.mapId,
                        map_name: this.mapName
                    };
                    try {
                        await cutoutIndex.editMapName(params);
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            /**
             * @description: input回车 失去焦点
             * @param {object} event 事件对象
             */
            enterIpt(event) {
                event.target.blur();
            },
            /**
             * @description: 限制输入正整数
             * @param {string} para 输入框实时输入值
             * @param {string} key  data名称
             * @param {string} type min max
             */
            inputNum(para, key, type) {
                this.filters[key][type] = para.replace(/[^0-9]/g, '');
            }
        }
    };
</script>

<style lang="less" scoped>
.couout-container {
    height: 100vh;
    .add-shadow {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.3);
        z-index: 66;
    }
    .left-wrap {
        float: left;
        height: 100vh;
        width: calc(100% - 375px);
        overflow: hidden;
    }
    .right-wrap {
        height: 100%;
        width: 375px;
        background: #fff;
        overflow: auto;
        padding: 10px 24px;
        box-sizing: border-box;
        box-shadow: -10px 0px 20px 0px rgba(152, 152, 152, 0.1);
    }
}
.right-wrap {
    .page-row {
        margin-top: 40px;
        > h2 {
            font-size: 18px;
            color: #001a4a;
            margin-bottom: 16px;
            position: relative;
            &::before {
                content: '';
                background: url('./images/bg-titile-tiao.png');
                background-size: cover;
                width: 4px;
                height: 21px;
                position: absolute;
                left: -24px;
                top: 2px;
                z-index: 5;
            }
        }
        /deep/ .ipt-name .el-input__inner {
            border-radius: unset;
        }
        /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
            border: 1px solid #dcdfe6;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
            border: 1px solid #409eff;
        }
        > p {
            color: #3e4254;
            font-size: 14px;
            span {
                color: #ff5c47;
            }
        }
        .btn-editMap {
            padding: 0;
            color: #fff;
            background: #33a1ff;
            border: 1px solid #33a1ff;
            box-sizing: border-box;
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            margin-top: 16px;
        }
        .tips-list li {
            list-style: disc;
            list-style-position: inside;
            font-size: 14px;
            color: #3e4254;
            line-height: 20px;
            margin-top: 8px;
        }
        .screen {
            li {
                font-size: 14px;
                margin-bottom: 10px;
                display: flex;
                .th {
                    width: 56px;
                    line-height: 26px;
                    color: #3e4254;
                    margin-right: 16px;
                    text-align-last: justify;
                    font-weight: bold;
                }
                .td {
                    flex: 1;
                    .no-limit {
                        display: inline-block;
                        width: 58px;
                        padding: 3px 0;
                        background: #33a1ff;
                        color: #fff;
                        text-align: center;
                        margin-right: 12px;
                        cursor: pointer;
                        border-radius: 2px;
                    }
                    .limit {
                        display: inline-block;
                        width: 58px;
                        padding: 3px 0;
                        background: #f4f6f9;
                        color: #3e4254;
                        text-align: center;
                        margin-right: 12px;
                        cursor: pointer;
                        border-radius: 2px;
                    }
                    /deep/ .check-box {
                        display: inline-block;
                        position: relative;
                        top: 1px;
                        .el-checkbox {
                            margin-right: 10px;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                        .el-checkbox__label {
                            padding-left: 4px;
                        }
                    }
                    /deep/ .ipt-min {
                        display: inline-block;
                        width: auto;
                        .el-input__inner {
                            width: 63px;
                            height: 26px;
                            padding: 0;
                            font-size: 14px;
                            border-radius: 0;
                            text-align: center;
                        }
                    }
                    /deep/ .be-pending {
                        margin-top: 10px;
                        .el-checkbox__label {
                            font-size: 12px;
                            color: #3e4254;
                        }
                    }
                }
                .posi-relative {
                    position: relative;
                    .show-text {
                        height: 26px;
                        line-height: 26px;
                    }
                    .edit-ok {
                        position: absolute;
                        top: 1px;
                        right: 0;
                        color: #33a1ff;
                        cursor: pointer;
                    }
                }
            }
        }
        .screen-show {
            margin-top: 20px;
            li {
                margin-bottom: 16px;
                .td {
                    /deep/ .check-radio {
                        .el-radio {
                            margin-right: 16px;
                            margin-top: 4px;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                        .el-radio__label {
                            padding-left: 3px;
                            font-weight: normal;
                        }
                    }
                }
            }
        }
        .tips-foot {
            font-size: 12px;
            color: #3e4254;
            line-height: 17px;
            margin-top: 6px;
        }
    }
    .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 28px;
        h3 {
            color: #3e4254;
            font-size: 14px;
            font-weight: bold;
        }
    }
    .handle-items {
        padding-top: 15.5px;
        border-top: 1px dashed #e3e3e3;
        > ul {
            margin: 15px 0;
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .text {
                    font-size: 14px;
                    width: 258px;
                    color: #3e4254;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .control {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    width: 40px;
                    .location {
                        color: #33a1ff;
                        font-size: 14px;
                        display: inline-block;
                        cursor: pointer;
                    }
                }
            }
            li + li {
                margin-top: 8px;
            }
            li.hide-house {
                .text {
                    color: #abb0b5;
                }
            }
        }
    }
    .edit-step {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        height: 34px;
        .bg {
            background: url('./images/bg-step.png');
            background-size: cover;
            width: 78px;
            height: 34px;
            line-height: 34px;
            color: #fff;
            display: inline-block;
            position: relative;
            left: -24px;
            top: -3px;
            text-align: center;
        }
        span {
            font-size: 14px;
        }
        h2 {
            display: inline-block;
            font-size: 24px;
            color: #333;
            margin-left: -20px;
        }
        .operate {
            display: flex;
            align-items: center;
        }
        .sign-edit {
            color: #ff5c47;
            padding-right: 16px;
            cursor: pointer;
        }
        .next-edit {
            color: #3497fc;
            cursor: pointer;
        }
    }
    /deep/.el-checkbox__label {
        color: #3e4254;
        font-weight: normal;
    }
    .page-three .mb-25 {
        margin-bottom: 25px;
    }
}
</style>