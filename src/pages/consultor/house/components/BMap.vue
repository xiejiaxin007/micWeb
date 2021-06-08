<!--
 * @Name: 地图组件
 * @Description: 地图组件
 * @Author: xueshuai
 * @Date: 2019-09-24 17:22:34
 * @Editors: xueshuai
 -->
<template>
<div class="map-wrap" v-loading="loading" element-loading-text="通勤搜索需要经过大量的计算才能给您呈现精确的结果，请稍等">
    <div id="map"></div>
    <div class="cricle-layer" v-show="cricleLayer"></div>
    <div class="blc" v-if="blc" :style="{'width':blcW}">{{blc}}</div>
    <div class="bmap-total" @click="handleTotalClick" v-show="!cricleLayer">
        <span>共筛选出</span>
        <span class="total-num">{{total}}个</span>
        <span>楼盘</span>
    </div>
    <!-- <div class="test">{{zoom}}</div> -->
</div>
</template>

<script>
/* eslint-disable */
import {
    mapState
} from "vuex";
import {
    trackAxios
} from "@/assets/js/http/axios";
import {
    commonFun
} from "@/assets/js/utils/utils";
import api from '../api/searchToolShare';
import PubSub from "pubsub-js";
import cursor from "../images/cursor_c.png";
import commuting from "../images/commuting-site.png";
import start from "../images/start.png";
import end from "../images/end.png";
import transfer from "../images/transfer_ico.png";
import path from "../config/path";
import loadMap from '@/assets/js/utils/map.js';
export default {
    name: "bmaps",
    props: ["controlData", "setMap", "otherFilter", "cityInfo", "houseType","room_id","see_project_id", "isRealCity"],
    data() {
        return {
            // 公交/地铁回显 开始
            overLayId: "", // 所清除的覆盖物标识
            marker: {
                // 标识
                origin: {
                    lng: "", // 起始位置经度
                    lat: "" // 起始位置维度
                },
                destination: {
                    lng: "", // 结束位置经度
                    lat: "" // 结束位置维度
                }
            },
            markStart: "", // 起点图标
            markEnd: "", // 终点图标
            transferList: [], // 换乘站
            subOverLay: "", //地铁线路
            subNewOerLay: "", // 支线线路 ，上海
            transitLines: new Map(), // 交通线
            // 公交/地铁回显 结束
            map: null, // 地图实例
            lastTime: "", // 最后一次请求type 4 findBuild 接口的时间戳
            districtTime: "", //最后一次请求type 2 findBuild 接口的时间戳
            districtList: new Map(), // 区域列表Map对象
            zoom: 13, // 地图缩放层级
            allNewHouse: new Map(), // 筛选条件下所有楼盘列表（每次条件变更后会清空，重新赋值）
            commutingFlag: false, //通勤模式开关
            circleFlag: false, //画圈找房开关
            commutingPoint: null, // 通勤模式标记通勤坐标 关闭通勤会变为null {lng:num,lat:num}
            curHouse: "", // 鼠标当前滑过那个楼盘的id
            CurHouseMark: null, //当前选中楼盘标签label对象
            CurHouseLabel: null, //当前选中楼盘标签label对象
            CurHouseID: "", //当前选中楼盘ID
            curPoint: null, // 鼠标标记点 point对象
            commutingMark: null, // 通勤标注
            commutingLabel: null, // 通勤标签
            filter: {
                total_price_min: "", //最大总价
                total_price_max: "", //最小总价
                offer_price_min: "", //最小单价
                offer_price_max: "", //最大单价
                down_pay_min: "", //最小首付
                down_pay_max: "", //最大首付
                down_pay_ratio: "30", //首付比例
                acreage_min: "", //最小面积
                acreage_max: "", //最大面积
                room_type: "", //户型
                project_type: "", //业态
                is_cooperate: "", //合作盘 1 合作 不选不填
                // 筛选外联楼盘 『0』为不限制 『1』为筛选外联楼盘
                is_outreach: "0",
                subway_line: "", //地铁
                // 地铁所在城市
                subway_city_id: "",
                open_time: "", //开盘时间
                status: "2", // 非售罄状态 2 不选不填
                project_tese: "", //特色
                is_tab: "2" //仅显示标记盘 1是 2否
            },
            lastComType: "", // 上一次通勤交通方式 用于清空同一交通方式下的缓存
            lastComTime: "", // 上一次通勤选择时间
            lastId: "", // 上一次通勤选择区域ID
            lastName: "", // 上一次通勤选择区域name
            loading: false, // 通勤模式接口等待loading
            cricleLayer: false, // 画圈模式遮罩层控制显示开关
            cricleStart: null, // 画圈模式储存鼠标down那个点的位置
            cricleEnd: null, // 画圈模式储存鼠标up后那个点的位置
            cricleLine: null, // 画圈模式折线对象
            criclePolygon: null, // 画圈模式多边形覆盖物对象
            esfMark: [], // 二手房标注
            esfLabel: [], // 二手房标签
            ndMark: [], // 拿地信息标注
            ndLabel: [], // 拿地信息标签
            curCircumLabel: null, // 当前选中周边标签（用于点击右侧周边 回显）
            commutingType: "0", //(0,默认公交 5.公交 6.驾车 7.骑行)
            circumFlag: false, // 周边 模式开关
            circumMark: [], // 周边标注
            circumLabel: [], // 周边标签
            cesfMarker: [], // 周边二手房标注
            cesfLabel: [], // 周边二手房标签
            blcW: "102px", //比例尺width
            cursorSignState: false, // 鼠标标记模式状态开关
            surround_type: "学校", // 当前周边 类别 默认学校
            total: 0, // 楼盘统计数量
            curCommutingId: "", // 通勤模式下选择区域后 区域ID
            sectionCircle: [], // 板块圆形覆盖物集合
            sectionLabel: [], // 板块标签覆盖物集合
            mapView: [], // 地图缩放视野ne/sw Point集合
            styleId: "a590b3be691fc413180e308bf77c2317" // 个性化地图配置ID
        };
    },
    created() {
        this.otherFilter.forEach(item => {
            if (item.name == "筛选非售罄盘") {
                if (item.state) {
                    this.filter.status = "2";
                } else {
                    this.filter.status = "";
                }
            } else if (item.name == "居理专属楼盘") {
                if (item.state) {
                    this.filter.is_cooperate = "1";
                } else {
                    this.filter.is_cooperate = "";
                }
            } else if (item.name == "仅展示标记盘") {
                if (item.state) {
                    this.filter.is_tab = "1";
                } else {
                    this.filter.is_tab = "2";
                }
            }
        });
        this.handleFilter(this.controlData, {
            init: true
        });
    },
    computed: {
        // 区域气泡开关
        districtState() {
            return this.setMap[0].state;
        },
        //二手房开关
        esfFlag() {
            return this.setMap[1].state;
        },
        //拿地信息开关
        ndFlag() {
            return this.setMap[2].state;
        },
        order_id() {
            return this.$route.query.order_id;
        },
        blc() {
            let blc;
            switch (this.zoom) {
                case 9:
                    blc = "25公里";
                    this.blcW = "64px";
                    break;
                case 10:
                    blc = "20公里";
                    this.blcW = "102px";
                    break;
                case 11:
                    blc = "10公里";
                    this.blcW = "102px";
                    break;
                case 12:
                    blc = "5公里";
                    this.blcW = "102px";
                    break;
                case 13:
                    blc = "2公里";
                    this.blcW = "82px";
                    break;
                case 14:
                    blc = "1公里";
                    this.blcW = "82px";
                    break;
                case 15:
                    blc = "500米";
                    this.blcW = "82px";
                    break;
                case 16:
                    blc = "200米";
                    this.blcW = "66px";
                    break;
                case 17:
                    blc = "100米";
                    this.blcW = "66px";
                    break;
                case 18:
                    blc = "50米";
                    this.blcW = "66px";
                    break;
                case 19:
                    blc = "20米";
                    this.blcW = "52px";
                    break;
                default:
                    blc = "10公里";
                    this.blcW = "102px";
                    break;
            }
            return blc;
        },
        moreInfo() {
            return {
                screen_height: commonFun.ScreenHeight(),
                screen_width: commonFun.ScreenWidth(),
                device_type: commonFun.getDevice().device,
                os: commonFun.getOS().os,
                os_version: commonFun.getOS().os_version,
                browser: commonFun.getBrowse().browser,
                browser_version: commonFun.getBrowse().browser_version
            };
        },
        ...mapState({
            trackBase(state) {
                return {
                    ini_params: Object.assign({}, state.trackMessages, this.moreInfo)
                };
            }
        })
    },
    mounted() {
        // 确保加载完成才实例化地图
        loadMap.loadMap().then(() => {
            // 实例化地图
            this.map = new BMap.Map("map", {
                minZoom: 9,
                maxZoom: 18,
                enableMapClick: false
            });
            this.init();
        });
        // 回显开始
        let _this = this;
        PubSub.subscribe("locPath", function (msg, data) {
            let start = data.driveRoute[0].path.split(";")[0].split(",");
            let endArr = data.driveRoute[data.driveRoute.length - 1].path.split(";");
            let end = endArr[endArr.length - 1].split(",");
            _this.marker.origin.lng = start[0] - 0;
            _this.marker.origin.lat = start[1] - 0;
            _this.marker.destination.lng = end[0] - 0;
            _this.marker.destination.lat = end[1] - 0;
            _this.mPath({
                startEnd: _this.marker,
                pointsArr: data.driveRoute,
                type: data.type,
                transfer: data.transfer
            });
        });
        PubSub.subscribe("closeTab", function (msg, data) {
            _this.clearOverLay();
        });
        // 地铁线交互
        this.getTransitLine();
        // 回显结束
        // 关闭右侧楼盘
        PubSub.subscribe("closePage", (msg, data) => {
            this.clearOverLay();
            this.map.removeOverlay(_this.CurHouseMark);
            this.map.removeOverlay(_this.CurHouseLabel);
            this.curPoint = null;
            this.CurHouseMark = null;
            this.CurHouseLabel = null;
            this.circumFlag = false;
            this.map.removeOverlay(_this.curCircumLabel);
        });
        // 周边切换其他
        PubSub.subscribe("tabAround", (msg, data) => {
            this.clearAround();
            this.circumFlag = false;
        });
        // 绘制周边配套
        PubSub.subscribe("drawAroundList", (msg, data) => {
            this.circumFlag = true;
            this.clearAround();
            data.forEach(item => {
                item.list.forEach(i => {
                    this.addCircumOrEsf(i, "circum");
                });
            });
        });
        // 绘制周边二手房
        PubSub.subscribe("drawCesfList", (msg, data) => {
            this.clearAround();
            data.forEach(item => {
                this.addCircumOrEsf(item, "cesf");
            });
        });
        // 标记周边
        PubSub.subscribe("signAround", (msg, data) => {
            this.addCircumOrEsfLabel(data, "circum", true);
        });
        // 标记二手房
        PubSub.subscribe("signCesf", (msg, data) => {
            this.addCircumOrEsfLabel(data, "cesf", true);
        });
        // 右侧详情当前tab
        PubSub.subscribe("surroundType", (msg, data) => {
            this.surround_type = data;
        });
        /**
         * 定位当前楼盘位置
         * @param data[Object] 例：{lng:120.12312312,lat,43.324567} or BMap.Point对象
         *  */
        PubSub.subscribe("location", (msg, data) => {
            if (data instanceof BMap.Point) {
                this.map.centerAndZoom(data, 16);
            } else {
                let point = new BMap.Point(parseFloat(data.lng), parseFloat(data.lat));
                this.map.centerAndZoom(point, 16);
            }
        });
    },
    methods: {
        _track(id, obj) {
            let res = this.trackBase;
            if (obj) {
                res = Object.assign({}, obj, res);
            }
            let resData = {
                extrack_arr: res,
                track_id: id
            };
            // 请求埋点接口
            trackAxios.post(
                this.$store.state.backendApi + "/send-data/index",
                resData
            );
        },
        // 公交/地铁回显 开始
        //test 北京市天安门 经度：lng:116.38, 纬度：lat:39.9   北京市东城区 lng: 116.42, lat:39.93
        mPath(para) {
            if (this.transferList.length > 0) {
                this.transferList.forEach(item => {
                    this.map.removeOverlay(item);
                });
                this.transferList = [];
            }
            let point = {
                start: new BMap.Point(
                    para.startEnd.origin.lng,
                    para.startEnd.origin.lat
                ),
                end: new BMap.Point(
                    para.startEnd.destination.lng,
                    para.startEnd.destination.lat
                )
            };
            let icon = {
                start: new BMap.Icon(start, new BMap.Size(40, 40), {
                    imageOffset: new BMap.Size(10, 0),
                    imageSize: new BMap.Size(20, 33)
                }),
                end: new BMap.Icon(end, new BMap.Size(40, 40), {
                    imageOffset: new BMap.Size(10, 0), // 图片偏移。
                    imageSize: new BMap.Size(20, 32)
                }),
                transfer: new BMap.Icon(transfer, new BMap.Size(16, 16), {
                    anchor: new BMap.Size(8, 8), // 图片偏移。
                    imageSize: new BMap.Size(16, 16)
                })
            };
            let points = para.pointsArr;
            let allPathArr = [];
            let allPath = "";
            for (let i = 0; i < points.length; i++) {
                allPathArr.push(points[i].path);
            }
            allPath = allPathArr.join(";");
            let viewPortArr = allPath.split(";");
            let finalArr = [];
            for (let k = 0; k < viewPortArr.length; k++) {
                let small = viewPortArr[k].split(",");
                let smallLng = small[0] - 0;
                let smallLat = small[1] - 0;
                let pointL = new BMap.Point(smallLng, smallLat);
                finalArr.push(pointL);
            }
            if (this.overLayId && this.markStart && this.markEnd) {
                this.overLayId.setPath(finalArr);
                this.markStart.setPosition(point.start);
                this.markEnd.setPosition(point.end);
            } else {
                this.markStart = new BMap.Marker(point.start, {
                    enableMassClear: false,
                    icon: icon.start
                });
                this.markEnd = new BMap.Marker(point.end, {
                    enableMassClear: false,
                    icon: icon.end
                });
                this.overLayId = new BMap.Polyline(finalArr, {
                    strokeColor: "#33A1FF",
                    strokeWeight: 4,
                    strokeOpacity: 1,
                    strokeStyle: "solid",
                    enableMassClear: false
                });
            }
            // 给公交标记换乘点
            if (para.type === 1 && para.transfer) {
                for (let i = 0; i < para.transfer.length; i++) {
                    let markers = new BMap.Point(
                        para.transfer[i].lng,
                        para.transfer[i].lat
                    );
                    let transferMark = new BMap.Marker(markers, {
                        enableMassClear: false,
                        icon: icon.transfer
                    });
                    this.map.addOverlay(transferMark);
                    this.transferList.push(transferMark);
                }
            }
            this.map.setViewport(finalArr);
            this.map.addOverlay(this.overLayId);
            this.map.addOverlay(this.markStart);
            this.map.addOverlay(this.markEnd);
        },
        clearOverLay() {
            // 清空画的上个路线
            this.map.removeOverlay(this.overLayId);
            this.map.removeOverlay(this.markStart);
            this.map.removeOverlay(this.markEnd);
            if (this.transferList.length > 0) {
                this.transferList.forEach(item => {
                    this.map.removeOverlay(item);
                });
                this.transferList = [];
            }
        },
        subPath(city, route) {
            // 参数，城市，线路
            let _this = this;
            _this.map.removeOverlay(this.subOverLay);
            _this.map.removeOverlay(this.subNewOerLay);
            this.subNewOerLay = "";
            this.subOverLay = "";
            let busUtil = new BMap.BusLineSearch(city, {
                onGetBusListComplete: function (result) {
                    if (result) {
                        let fstLine = result.getBusListItem(0); //获取第一个公交列表显示到map上
                        busUtil.getBusLine(fstLine);
                    }
                },
                onGetBusLineComplete: function (busline) {
                    let pathPoints = busline.getPath();
                    let addPath = "";
                    let addArr = [];
                    if (city === "上海") {
                        switch (route) {
                            case "5号线":
                                addPath = path.fiveLine;
                                break;
                            case "10号线":
                                addPath = path.tenLine;
                                break;
                            case "11号线":
                                addPath = path.elevenLine;
                                break;
                            default:
                                addPath = "";
                        }
                        if (addPath) {
                            addPath = addPath.split(";");
                            for (let i = 0; i < addPath.length; i++) {
                                let small = addPath[i].split(",");
                                let point = new BMap.Point(small[0] - 0, small[1] - 0);
                                addArr.push(point);
                            }
                            _this.subNewOerLay = new BMap.Polyline(addArr, {
                                strokeColor: "#D00236",
                                strokeWeight: 6,
                                strokeOpacity: 1,
                                strokeStyle: "solid",
                                enableMassClear: false
                            });
                            _this.map.addOverlay(_this.subNewOerLay);
                        }
                    }
                    _this.subOverLay = new BMap.Polyline(pathPoints, {
                        strokeColor: "#D00236",
                        strokeWeight: 6,
                        strokeOpacity: 1,
                        strokeStyle: "solid",
                        enableMassClear: false
                    });
                    if (addArr.length !== 0) {
                        _this.map.setViewport(pathPoints.concat(addArr));
                    } else {
                        _this.map.setViewport(pathPoints);
                    }
                    _this.map.addOverlay(_this.subOverLay);
                }
            });
            busUtil.getBusList(route);
        },
        clearSubOver() {
            this.map.removeOverlay(this.subOverLay);
            this.map.removeOverlay(this.subNewOerLay);
            this.subOverLay = "";
            this.subNewOerLay = "";
        },
        // 请求交通线路
        getTransitLine() {
            this.transitLines.forEach(item => {
                this.map.removeOverlay(item.line);
                this.map.removeOverlay(item.card);
            });
            this.transitLines.clear();
            let opt = {
                order_id: this.order_id,
                type: "14",
                city_id: this.cityInfo.currentCityId.split(",")
            }
            this.axios
                .post("/backend-api/bk-map/perform-tasks", opt)
                .then(res => {
                    if (res.status == 200 && res.data.code == 0) {
                        if (res.data.data.length > 0) {
                            res.data.data.forEach((item, index) => {
                                this.transitLines.set("line" + index, this.addLine(item));
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        addLine(item) {
            let linePoints = item.path.split(";");
            let lineArr = [];
            for (let i = 0; i < linePoints.length; i++) {
                let small = linePoints[i].split(",");
                lineArr.push(new BMap.Point(small[0] - 0, small[1] - 0));
            }
            let line = new BMap.Polyline(lineArr, {
                strokeColor: "#3E4254",
                strokeWeight: 4,
                strokeOpacity: 1,
                strokeStyle: "dashed",
                enableMassClear: false
            });
            this.map.addOverlay(line);
            item.line = line;
            item.card = null;
            let timer;
            line.addEventListener("mouseover", e => {
                if (
                    event.target.nodeName === "svg" ||
                    event.target.nodeName === "path"
                ) {
                    item.line.setStrokeColor("#D00236");
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        this.addLineCard(item, e.point);
                    }, 500);
                }
            });
            line.addEventListener("mouseout", () => {
                clearTimeout(timer);
                item.line.setStrokeColor("#3E4254");
                if (item.card) {
                    item.card.hide();
                }
            });
            return item;
        },
        addLineCard(item, point) {
            if (this.districtList.size > 0) {
                // 处理label边缘地带会出现俩个卡片的情况
                this.districtList.forEach(item => {
                    if (item.card) {
                        item.card.hide();
                    }
                });
            }
            this.transitLines.forEach(item => {
                if (item.card) {
                    item.card.hide();
                }
            });
            if (item.card) {
                item.card.setPosition(point);
                item.card.show();
            } else {
                let content = `
                <div class="line-wrap">
                <div class="bg">
                    <div class="head">${item.title}</div>
                    <div class="status-box">
                    在售 <span class="sale">(${item.projectNum}) 套</span>
                    <span class="type">${item.traffic_type}</span>
                    <span class="status">${item.status}</span>
                    </div>
                    <div class="des">
                    ${item.desc}
                    </div>
                </div>
                </div>
                `;
                item.card = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -22),
                    enableMassClear: false
                });
                item.card.setStyle({
                    backgroundColor: "transparent",
                    border: "none",
                    zIndex: 999
                });
                item.card.setZIndex(999);
                this.map.addOverlay(item.card);
            }
        },
        // 公交/地铁回显 结束
        // 初始化地图
        init() {
            this.map.centerAndZoom(this.cityInfo.currentCity, 13);
            this.map.enableScrollWheelZoom(); // 开启滚轮缩放
            this.map.addEventListener("zoomend", () => {
                this.zoom = this.map.getZoom();
                this.findBuild();
                this.getDistrict();
                if (this.zoom >= 14 && !this.circumFlag) {
                    this.getesf();
                    this.getNd();
                } else {
                    this.clearEsf();
                    this.clearNd();
                }
            });
            // this.map.addEventListener("tilesloaded", () => {
            //   try {
            //     this.map.setMapStyleV2({
            //       styleId: this.styleId
            //     });
            //   } catch (error) {
            //     console.log("加载配套地图失败，自动切换百度地图");
            //     this.$emit("upMapPattern");
            //   }
            // });
            this.map.addEventListener("moveend", () => {
                this.findBuild();
                if (this.zoom >= 14 && !this.circumFlag) {
                    this.getesf();
                    this.getNd();
                }
            });
            this.map.addEventListener("load", () => {
                this.getSection();
                let pointArr = [];
                document
                    .querySelector(".cricle-layer")
                    .addEventListener("mousedown", e => {
                        this.cricleStart = this.pixelToPoint(e.pageX, e.pageY);
                        pointArr.push(this.cricleStart);
                    });
                document
                    .querySelector(".cricle-layer")
                    .addEventListener("mousemove", e => {
                        e.preventDefault();
                        if (this.cricleLine) {
                            this.cricleLine.show();
                        }
                        if (this.criclePolygon) {
                            this.criclePolygon.show();
                        }
                        if (this.cricleStart) {
                            pointArr.push(this.pixelToPoint(e.pageX, e.pageY));
                            this.cricleLine.setPath(pointArr);
                        }
                    });
                document
                    .querySelector(".cricle-layer")
                    .addEventListener("mouseup", e => {
                        if (pointArr.length <= 2) {
                            pointArr = [];
                            this.cricleStart = null;
                            return false;
                        }
                        this.cricleEnd = this.pixelToPoint(e.pageX, e.pageY);
                        pointArr.push(this.pixelToPoint(e.pageX, e.pageY));
                        this.criclePolygon.setPath(pointArr);
                        this.findBuild("cricle");
                        this.cricleStart = null;
                        this.map.setViewport(pointArr, -2);
                        pointArr = [];
                        this.cricleLayer = false;
                        this.$emit("drawFinish");
                    });
            });
            this.map.setDefaultCursor("default");
        },
        // 添加区域气泡
        addDistrictMark(obj) {
            if (obj.map_zoom) {
                obj.map_zoom = Math.ceil(obj.map_zoom);
            }
            if (obj.coordinate) {
                let arr = obj.coordinate.split(",");
                obj.lng = parseFloat(arr[0]);
                obj.lat = parseFloat(arr[1]);
            } else {
                return false;
            }
            let point = new BMap.Point(obj.lng, obj.lat);
            let content = `
            <div class="districtMark ${obj.isTab == "1" ? "like" : ""}"  data-id="${
                obj.district_id
            }">
                <p>${obj.distract_name}</p>
                <p>${obj.project_num}个筛选盘</p>
                <p>均${
                obj.average_current_rate == "0" ||
                obj.average_current_rate == "" ||
                obj.average_current_rate == null
                    ? "价待定"
                    : obj.average_current_rate + "元/㎡"
                }</p>
            </div>`;
            let opt = {
                position: point,
                offset: new BMap.Size(-46, -46)
            };
            let label = new BMap.Label(content, opt);
            label.setStyle({
                backgroundColor: "transparent",
                border: "none",
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                zIndex: 1
            });
            label.setZIndex(1);
            this.map.addOverlay(label);
            obj.label = label;
            let boundary = new BMap.Boundary();
            // let pointArr = [];
            let newName = null;
            if (obj.distract_name === "新区") {
                newName = "虎丘区";
            } else if (obj.distract_name === "姑苏") {
                newName = "姑苏区";
            }
            boundary.get(
                obj.city_name +
                "市" +
                (newName ? newName : obj.distract_name),
                e => {
                    let count = e.boundaries.length; // 行政区域的点有多少个
                    if (count === 0) {
                        return false;
                    }
                    let boundaryArr = [];
                    e.boundaries.forEach(item => {
                        let ply = new BMap.Polygon(item, {
                            strokeWeight: 3,
                            fillColor: "#33A1FF",
                            strokeStyle: "dashed",
                            strokeOpacity: 1,
                            strokeColor: "#33A1FF",
                            fillOpacity: 0.15
                        });
                        ply.hide();
                        this.map.addOverlay(ply);
                        boundaryArr.push(ply);
                    });
                    obj.boundaryArr = boundaryArr;
                }
            );
            obj.card = null;
            if (this.zoom <= 13) {
                label.show();
            } else {
                label.hide();
            }
            let t;
            // 区域气泡鼠标滑过事件
            label.addEventListener("mouseover", () => {
                label.setStyle({
                    zIndex: 10
                });
                if (obj.boundaryArr) {
                    obj.boundaryArr.forEach(item => {
                        item.show();
                    });
                }
                clearTimeout(t);
                t = setTimeout(() => {
                    if (this.zoom > 13) {
                        return false;
                    }
                    this.addDistrictCard(obj, point);
                }, 500);
            });
            label.addEventListener("click", () => {
                this._track("3901");
                if (obj.points) {
                    let ne = new BMap.Point(
                        parseFloat(obj.points.maxLng),
                        parseFloat(obj.points.maxLat)
                    );
                    let sw = new BMap.Point(
                        parseFloat(obj.points.minLng),
                        parseFloat(obj.points.minLat)
                    );
                    this.map.setViewport([ne, sw], -1);
                    if (this.zoom <= 13) {
                        this.map.setZoom(14);
                    }
                } else {
                    this.map.centerAndZoom(point, obj.map_zoom);
                }
            });
            // 区域气泡鼠标滑出事件
            label.addEventListener("mouseout", () => {
                label.setStyle({
                    zIndex: 1
                });
                if (obj.boundaryArr) {
                    obj.boundaryArr.forEach(item => {
                        item.hide();
                    });
                }
                clearTimeout(t);
            });
            return obj;
        },
        // 添加或显示区域卡片
        addDistrictCard(item, point) {
            this._track("3900");
            if (this.transitLines.size > 0) {
                this.transitLines.forEach(item => {
                    if (item.card) {
                        item.card.hide();
                    }
                });
            }
            this.districtList.forEach(item => {
                if (item.card) {
                    item.card.hide();
                }
            });
            if (item.card) {
                item.card.show();
            } else {
                let div = document.createElement("div");
                div.className = "districtCard";
                div.innerHTML = `
                <div class="before" data-click="before"></div>
                <div class="bg">
                <div class="tit">${item.distract_name}</div>
                    <div class="part-tit-t">区域整体房价情况</div>
                    <div class="con">在售新盘单价：${
                        item.new_current_rate
                    } 元/㎡</div>
                    <div class="con">在售二手房单价：${
                        item.second_current_rate
                    } 元/㎡</div>
                    <div class="part-tit-b">当前筛选条件下共${item.project_num}个盘 ${
                item.house_num
                } 个户型</div>
                    <div class="con">面积范围：${item.acreage}㎡</div>
                    <div class="con">单价范围：${
                        item.rata == "0" || item.rata == "" || item.rata == null
                        ? "待定"
                        : item.rata + "元/㎡"
                    }</div>
                    <div class="con">总价范围：${
                        item.price == "0" || item.price == "" || item.price == null
                        ? "待定"
                        : item.price + "万"
                    }</div>
                    <a href="javascript:;" data-click="lookShare" data-id="${
                        item.district_id
                    }">查看&分享区域解读</a>
                    </div>
                `;
                item.card = new BMap.Label(div.outerHTML, {
                    position: point,
                    offset: new BMap.Size(70, -42)
                });
                let card = item.card;
                card.setStyle({
                    backgroundColor: "transparent",
                    border: "none"
                });
                card.setZIndex(11);
                // 区域卡片点击事件
                card.addEventListener("click", event => {
                    let target = event.domEvent.target;
                    if (target.nodeName === "A") {
                        if (target.dataset.click === "lookShare") {
                            // 点击区域卡片查看分享
                            this.lookShare(item.distract_name, item.district_id);
                            card.hide();
                        }
                    }
                    if (target.dataset.click === "before") {
                        this._track("3901");
                        // 点击区域气泡遮罩
                        if (item.points) {
                            let ne = new BMap.Point(
                                parseFloat(item.points.maxLng),
                                parseFloat(item.points.maxLat)
                            );
                            let sw = new BMap.Point(
                                parseFloat(item.points.minLng),
                                parseFloat(item.points.minLat)
                            );
                            this.map.setViewport([ne, sw], -1);
                            if (this.zoom <= 13) {
                                this.map.setZoom(14);
                            }
                        } else {
                            this.map.centerAndZoom(point, item.map_zoom);
                        }
                    }
                });
                // 区域卡片鼠标滑过事件
                card.addEventListener("mouseover", () => {
                    if (item.boundaryArr) {
                        item.boundaryArr.forEach(i => {
                            i.show();
                        });
                    }
                    if (item.label) {
                        item.label.setStyle({
                            zIndex: 10
                        });
                    }
                    card.show();
                });
                // 区域卡片鼠标离开事件
                card.addEventListener("mouseout", () => {
                    card.hide();
                    if (item.boundaryArr) {
                        item.boundaryArr.forEach(i => {
                            i.hide();
                        });
                    }
                    if (item.label) {
                        item.label.setStyle({
                            zIndex: 1
                        });
                    }
                });
                this.map.addOverlay(card);
            }
        },
        // 点击区域卡片内 查看分享按钮
        lookShare(name, id) {
            PubSub.publish("openArticle", {
                distract_name: name,
                district_id: id
            });
        },
        // 放大操作
        mapZoomIn() {
            this.map.zoomIn();
        },
        // 缩小操作
        mapZoomOut() {
            this.map.zoomOut();
        },
        // 显示所有区域气泡
        showDistrictLabel() {
            this.districtList.forEach(item => {
                if (item.label) {
                    item.label.show();
                }
            });
        },
        // 隐藏所有区域气泡和卡片
        hideDistrictLabel() {
            this.districtList.forEach(item => {
                if (item) {
                    item.label.hide();
                    if (item.card) {
                        item.card.hide();
                    }
                }
            });
        },
        /**
         * 地图添加楼盘圆点
         * com 通勤交通方式 驾车/公交
         * type 'sign' 为选中楼盘
         * state 为通过楼盘搜索添加标记楼盘
         */
        addHouseMark(obj, com, type, state) {
            if (obj.is_tab == 1) {
                obj.isTab = true;
                obj.noClear = true;
            }
            if (obj.is_cooperate == "1") {
                obj.isCooperate = true;
            }
            if (obj.project_id) {
                obj.id = obj.project_id;
            }
            if (obj.current_rate) {
                obj.unitPrice = obj.current_rate;
            }
            let point = new BMap.Point(obj.lng, obj.lat);

            let mark;
            obj.sellState = ""; // 业态、售罄状态
            obj.text = "";
            // 先判断售罄状态 3为售罄
            if (obj.status == "3") {
                obj.sellState = "sellOut";
                if (obj.project_type) {
                    switch (parseInt(obj.project_type)) {
                        case 1:
                            obj.text = "住宅";
                            break;
                        case 2:
                            obj.text = "别墅";
                            break;
                        case 3:
                            obj.text = "商办";
                            break;
                        case 55:
                            obj.text = "商铺";
                            break;
                        case 58:
                            obj.text = "写字";
                            break;
                        case 100:
                            obj.text = "限竞";
                            break;
                        case 110:
                            obj.text = "公寓";
                            break;
                        default:
                            if (obj.project_type_text) {
                                obj.text = obj.project_type_text.slice(0, 2);
                            } else {
                                obj.text = "";
                            }
                            break;
                    }
                }
            } else {
                // 不售罄状态 再判断业态
                // 1 => '住宅', 2 => '别墅', 3 => '商办', 55 => '商铺', 58 => '写字', 100=>'限竞', 110=>'公寓'
                if (obj.project_type) {
                    switch (parseInt(obj.project_type)) {
                        case 1:
                            obj.sellState = "zz";
                            obj.text = "住宅";
                            break;
                        case 2:
                            obj.sellState = "bs";
                            obj.text = "别墅";
                            break;
                        case 3:
                            obj.sellState = "orther";
                            obj.text = "商办";
                            break;
                        case 55:
                            obj.sellState = "orther";
                            obj.text = "商铺";
                            break;
                        case 58:
                            obj.sellState = "orther";
                            obj.text = "写字";
                            break;
                        case 100:
                            obj.sellState = "xj";
                            obj.text = "限竞";
                            break;
                        case 110:
                            obj.sellState = "orther";
                            obj.text = "公寓";
                            break;
                        default:
                            obj.sellState = "orther";
                            if (obj.project_type_text) {
                                obj.text = obj.project_type_text.slice(0, 2);
                            } else {
                                obj.text = "";
                            }
                            break;
                    }
                }
            }
            let cooperate = "";
            let outreach ="";
            //is_cooperate 1 为合作 2 为非合作
            if (obj.isCooperate) {
                cooperate = "cooperate";
            } else {
                cooperate = "";
                // 外联楼盘样式
                outreach = obj.is_outreach === "1" ? "outreach" : "";
            }
            
            let tabState = "";
            // 判断标记状态
            if (obj.isTab) {
                tabState = "like";
            }
            let signState = "";
            if (type === "sign") {
                signState = "sign";
            }
            let markHover = "";
            if (
                !type &&
                (this.zoom <= 13 || this.commutingFlag) &&
                !this.circleFlag &&
                !obj.little &&
                !obj.noClear &&
                !com
            ) {
                markHover = "markHover";
            }
            let content = `<div class="houseMark house-${obj.id} ${obj.sellState} ${cooperate} ${outreach} ${tabState} ${signState} ${markHover}"></div>`;
            if (type === "sign") {
                mark = new BMap.Label(content, {
                    offset: new BMap.Size(-8, -8),
                    position: point,
                    enableMassClear: false
                });
                mark.setZIndex(9);
                this.curPoint = point;
                this.map.removeOverlay(this.CurHouseMark);
                this.CurHouseMark = mark;
            } else {
                mark = new BMap.Label(content, {
                    offset: new BMap.Size(-8, -8),
                    position: point
                });
                mark.setZIndex(1);
            }
            mark.setStyle({
                border: "none",
                backgroundColor: "transparent"
            });
            if (type === "sign") {
                obj.curLabel = this.addHouseLabel(obj, point, com, type, state);
            } else {
                obj.label = this.addHouseLabel(obj, point, com, type, state);
            }
            let t;
            if (
                !type &&
                (this.zoom <= 13 || this.commutingFlag) &&
                !this.circleFlag &&
                !obj.little &&
                !obj.noClear &&
                !com
            ) {
                mark.addEventListener("mouseover", e => {
                    clearTimeout(t);
                    mark.setStyle({
                        zIndex: 9
                    });
                    t = setTimeout(() => {
                        this.allNewHouse.forEach(item => {
                            item.label.hide();
                        });
                        obj.label.show();
                    }, 500);
                });
                mark.addEventListener("mouseout", () => {
                    clearTimeout(t);
                    mark.setStyle({
                        zIndex: 1
                    });
                });
            }
            this.map.addOverlay(mark);
            if (type === "sign") {
                obj.curMark = mark;
            } else {
                obj.mark = mark;
            }
            if (
                this.zoom <= 13 &&
                !obj.noClear &&
                !this.circleFlag &&
                !obj.little &&
                !com
            ) {
                if (obj.label) {
                    obj.label.hide();
                }
            }
            if (type === "sign") {
                if (obj.label) {
                    obj.label.show();
                }
                if (!state) {
                    this.map.centerAndZoom(point, 17);
                }
            }
            return obj;
        },
        // 楼盘标签
        addHouseLabel(item, point, com, type, state) {
            let c = "";
            let cooper = "";
            if (item.isTab) {
                c = "like";
            }
            if (item.isCooperate) {
                cooper = "(合作)";
            }
            let content;
            if (com) {
                item.com = com;
            }
            if (com) {
                content = `
                <div class="house-label house-${item.id} ${item.sellState} ${c}">
                    <span class="house-type">${item.text}</span>
                    <span class="sign-ico"></span>
                    <span class="house-name">${item.name}</span>
                    <span class="unit-price">${com}${item.duration}分钟</span>
                </div>`;
            } else {
                content = `
                <div class="house-label house-${item.id} ${item.sellState} ${c} ${
                    type === "sign" ? "select" : ""
                    }">
                    <span class="house-type">${item.text}</span>
                    <span class="sign-ico"></span>
                    <span class="house-name">${item.name}</span>
                    <span class="unit-price">${
                    item.unitPrice == "0" ||
                    item.unitPrice == "" ||
                    item.unitPrice == null
                        ? "待定"
                        : item.unitPrice + "元/㎡"
                    }</span>
                </div>`;
            }
            let label;
            if (type === "sign") {
                label = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -48),
                    enableMassClear: false
                });
                label.sign = true;
                label.setZIndex(9);
                this.map.removeOverlay(this.CurHouseLabel);
                this.CurHouseLabel = label;

                if (!state) {
                    let _obj = {
                        tab: "iframInfo",
                        house: {
                            projectId: item.id,
                            name: item.name,
                            addr: "",
                            lng: item.lng,
                            lat: item.lat
                        },
                        abbreviationName: item.abbreviation,
                        cityId: item.city_id,
                        cityName: item.city_name,
                        doorType: "",
                        villageUrl: item.village_url,
                        isReal: this.isRealCity
                    };
                    PubSub.publish("openTabInfo", _obj);
                }
            } else {
                label = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -48)
                });
                label.setZIndex(2);
            }
            label.setStyle({
                border: "none",
                backgroundColor: "transparent",
                transform: "translate(-50%, 0px)"
            });

            let t;
            label.addEventListener("mouseover", () => {
                label.show();
                this.curHouse = item.id;
                label.setStyle({
                    zIndex: 10
                });
                clearTimeout(t);
                t = setTimeout(() => {
                    this.addHouseCard(item, point);
                }, 500);
            });
            if (!type) {
                label.addEventListener("mouseout", () => {
                    clearTimeout(t);
                    this.curHouse = "";
                    label.setStyle({
                        zIndex: 2
                    });
                    if (
                        this.zoom <= 13 &&
                        !item.noClear &&
                        !this.circleFlag &&
                        !item.little &&
                        !com
                    ) {
                        label.hide();
                    }
                });
            }
            label.addEventListener("click", async () => {
                this.addCurHouseMark(item, true);
                try {
                    let _obj = {
                        tab: "iframInfo",
                        house: {
                            projectId: item.id,
                            name: item.name,
                            addr: "",
                            lng: item.lng,
                            lat: item.lat
                        },
                        abbreviationName: item.abbreviation,
                        cityId: item.city_id,
                        cityName: item.city_name,
                        doorType: "",
                        villageUrl: '',
                        isReal: this.isRealCity
                    };
                    if (!this.isRealCity) {
                        let result = await api.getSingleHouseInfo({
                            project_id: item.id
                        });
                        let {data} = result;
                        _obj.villageUrl = data.data ? data.data.village_url : '';
                    }
                    PubSub.publish("openTabInfo", _obj);
                } catch (error) {
                    console.log(error);
                }
            });
            this.map.addOverlay(label);
            return label;
        },
        // 区域气泡开关
        districtBubble(bool) {
            if (bool) {
                if (this.zoom <= 13) {
                    this.map.clearOverlays();
                    this.getDistrict();
                }
            } else {
                if (this.zoom <= 13) {
                    this.findBuild();
                }
            }
        },
        // 创建楼盘卡片
        addHouseCard(item, point) {
            // 请求单个楼盘详情接口
            this.getProjectInfo(item, point);
        },
        // 获取当前地图四个角经纬度
        getRect() {
            let b = this.map.getBounds();
            let sw = b.getSouthWest();
            let ne = b.getNorthEast();
            return {
                minLng: sw ? sw.lng : "",
                maxLng: ne ? ne.lng : "",
                minLat: sw ? sw.lat : "",
                maxLat: ne ? ne.lat : ""
            };
        },
        // 筛选楼盘接口
        findBuild(type) {
            // 区域气泡开启状态下不走接口
            if (
                (this.districtState && this.zoom <= 13 && !type) ||
                this.commutingFlag ||
                (this.circleFlag && !type) ||
                this.circumFlag
            ) {
                return false;
            }
            this.allNewHouse.clear();
            let bround;
            if (type === "cricle") {
                bround = this.getCricleRect();
            } else {
                bround = this.getRect();
            }
            this.lastTime = new Date().getTime();
            let opt = {
                order_id: this.order_id,
                type: "4",
                zoom: this.zoom,
                city_id: this.cityInfo.currentCityId.split(","),
                minLng: bround.minLng,
                maxLng: bround.maxLng,
                minLat: bround.minLat,
                maxLat: bround.maxLat,
                request_time: this.lastTime,
                room_id: this.room_id,
                see_project_id: this.see_project_id
            };
            Object.assign(opt, this.filter);
            if (this.circleFlag) {
                opt.findType = "1";
            }
            this.axios.post("/backend-api/bk-map/find-building", opt).then(res => {
                if (res && res.status == 200) {
                    if (res.data.data.request_time != this.lastTime) {
                        return false;
                    }
                    // 画圈找房模式和鼠标标记状态不处理
                    if (this.cricleLayer || this.cursorSignState) {
                        return false;
                    }
                    // 周边模式不处理
                    if (this.circumFlag) {
                        return false;
                    }
                    if (this.districtState && this.zoom <= 13 && !type) {
                        return false;
                    }
                    this.map.clearOverlays();
                    if (res.data.data.list.length > 0) {
                        let num = 0;
                        res.data.data.list.forEach(item => {
                            let obj = {
                                id: item.project_id,
                                name: item.name,
                                lng: parseFloat(item.lng),
                                lat: parseFloat(item.lat),
                                unitPrice: item.current_rate,
                                status: item.status,
                                isTab: item.isTab == 1 ? true : false,
                                isCooperate: item.is_cooperate == "1" ? true : false,
                                is_outreach: item.is_outreach,
                                project_type: item.project_type,
                                project_type_text: item.project_type_text,
                                abbreviation: item.abbreviation,
                                city_id: item.city_id,
                                city_name: item.city_name
                            };
                            let point = new BMap.Point(obj.lng, obj.lat);
                            if (type === "cricle") {
                                if (this.isPointInPolygon(point, this.criclePolygon)) {
                                    this.allNewHouse.set(
                                        "build_" + obj.id,
                                        this.addHouseMark(obj)
                                    );
                                    num++;
                                }
                            } else {
                                if (res.data.data.list.length <= 100) {
                                    // 1.3 需求更改小于多少显示楼盘标签阀值
                                    obj.little = true;
                                }
                                this.allNewHouse.set("build_" + obj.id, this.addHouseMark(obj));
                            }
                        });
                        if (type === "cricle") {
                            this.total = num;
                            // this.$emit("houseTotal", num);
                        } else {
                            // this.$emit("houseTotal", res.data.data.total);
                            this.total = res.data.data.total;
                            if (res.data.data.points) {
                                let obj = res.data.data.points;
                                let ne = new BMap.Point(
                                    parseFloat(obj.maxLng),
                                    parseFloat(obj.maxLat)
                                );
                                let sw = new BMap.Point(
                                    parseFloat(obj.minLng),
                                    parseFloat(obj.minLat)
                                );
                                this.mapView = [ne, sw];
                            } else {
                                this.mapView = [];
                            }
                        }
                    } else {
                        // this.$emit("houseTotal", res.data.data.total);
                        this.total = res.data.data.total;
                    }
                }
            });
        },
        // 搜索楼盘名称
        searchBuild(item) {
            let _obj = {
                id: item.project_id,
                name: item.name,
                lng: parseFloat(item.lng),
                lat: parseFloat(item.lat),
                unitPrice: item.current_rate,
                status: item.status,
                isTab: item.is_tab == 1 ? true : false,
                isCooperate: item.is_cooperate == "1" ? true : false,
                // 外联楼盘
                is_outreach: item.is_outreach,
                project_type: item.project_type,
                project_type_text: item.project_type_text,
                abbreviation: item.abbreviation,
                city_id: item.city_id,
                city_name: item.city_name
            };
            this.closeCommuting();
            this.addHouseMark(_obj, false, "sign");
        },
        // 区域气泡和区域卡片接口
        getDistrict() {
            if (
                this.zoom > 13 ||
                this.commutingFlag ||
                this.circleFlag ||
                this.circumFlag
            ) {
                return false;
            }
            if (!this.districtState) {
                return false;
            }
            let bround = this.getRect();
            if (!bround.minLng) {
                return false;
            }
            this.map.clearOverlays();
            this.districtTime = new Date().getTime();
            this.districtList.forEach(item => {
                this.map.removeOverlay(item.label);
                this.map.removeOverlay(item.card);
            });
            this.districtList.clear(); //清空区域气泡map对象
            let opt = {
                order_id: this.order_id,
                type: "2",
                zoom: this.zoom,
                minLng: bround.minLng,
                maxLng: bround.maxLng,
                minLat: bround.minLat,
                maxLat: bround.maxLat,
                city_id: this.cityInfo.currentCityId.split(","),
                request_time: this.districtTime,
                room_id: this.room_id,
                see_project_id: this.see_project_id
            };
            Object.assign(opt, this.filter);
            this.axios.post("/backend-api/bk-map/find-building", opt).then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    if (this.districtTime != res.data.data.request_time) {
                        return false;
                    }
                    if (this.cursorSignState || this.circleFlag) {
                        return false;
                    }
                    if (res.data.data.list.length > 0) {
                        res.data.data.list.forEach(item => {
                            this.districtList.set(
                                "district_" + item.district_id,
                                this.addDistrictMark(item)
                            );
                        });
                        // this.$emit("houseTotal", res.data.data.total);
                        this.total = res.data.data.total;
                    } else {
                        // this.$emit("houseTotal", res.data.data.total);
                        this.total = res.data.data.total;
                    }
                    if (res.data.data.tab_list.length > 0) {
                        res.data.data.tab_list.forEach(item => {
                            this.allNewHouse.set(
                                "build_" + item.project_id,
                                this.addHouseMark(item)
                            );
                        });
                    }
                    if (res.data.data.points) {
                        let obj = res.data.data.points;
                        let ne = new BMap.Point(
                            parseFloat(obj.maxLng),
                            parseFloat(obj.maxLat)
                        );
                        let sw = new BMap.Point(
                            parseFloat(obj.minLng),
                            parseFloat(obj.minLat)
                        );
                        this.mapView = [ne, sw];
                    } else {
                        this.mapView = [];
                    }
                }
            });
        },
        // 清空二手房覆盖物
        clearEsf() {
            this.esfMark.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.esfMark = [];
            this.esfLabel.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.esfLabel = [];
        },
        // 请求二手房数据接口
        getesf() {
            if (this.zoom < 14) {
                return false;
            }
            // 解决BUG 22203
            // if (this.commutingFlag || this.circleFlag) {
            //   return false;
            // }
            if (this.esfFlag) {
                let b = this.getRect();
                let param = {
                    city_id: this.cityInfo.currentCityId.split(","),
                    minLng: b.minLng,
                    maxLng: b.maxLng,
                    minLat: b.minLat,
                    maxLat: b.maxLat
                }
                this.axios
                    .post(`/backend-api/bk-map/get-esf`, param)
                    .then(res => {
                        this.clearEsf();
                        if (res.status == 200 && res.data.code == 0) {
                            let rs = res.data.data;
                            if (this.zoom < 14 || !this.esfFlag) {
                                return false;
                            }
                            if (Object.keys(rs).length > 0) {
                                rs.forEach(item => {
                                    this.addCircumOrEsf(item, "esf");
                                });
                            }
                        }
                    })
                    .catch(() => {
                        this.clearEsf();
                    });
            }
        },
        // 清空拿地覆盖物
        clearNd() {
            this.ndMark.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.ndMark = [];
            this.ndLabel.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.ndLabel = [];
        },
        // 拿地信息接口
        getNd() {
            if (this.zoom < 14) {
                return false;
            }
            // 解决BUG 22203
            // if (this.commutingFlag || this.circleFlag) {
            //   return false;
            // }
            if (this.ndFlag) {
                let b = this.getRect();
                let param = {
                    city_id: this.cityInfo.currentCityId.split(","),
                    minLng: b.minLng,
                    maxLng: b.maxLng,
                    minLat: b.minLat,
                    maxLat: b.maxLat
                }
                this.axios
                    .post(`/backend-api/bk-map/get-lots-info`, param)
                    .then(res => {
                        this.clearNd();
                        if (res.status == 200 && res.data.code == 0) {
                            let rs = res.data.data;
                            if (this.zoom < 14 || !this.ndFlag) {
                                return false;
                            }
                            if (Object.keys(rs).length > 0) {
                                rs.forEach(item => {
                                    this.addCircumOrEsf(item, "nd");
                                });
                            }
                        }
                    })
                    .catch(() => {
                        this.clearNd();
                    });
            }
        },
        /**
         * 周边配套、二手房 mark
         * obj{community_name,lat,lng,price,}
         * 找房工具 1.1 拿地 type = 'nd'
         */
        addCircumOrEsf(obj, type, state) {
            if (obj.coordinate_ax) {
                obj.lng = obj.coordinate_ax;
            }
            if (obj.coordinate_ay) {
                obj.lat = obj.coordinate_ay;
            }
            let point = new BMap.Point(parseFloat(obj.lng), parseFloat(obj.lat));
            let content;
            let marker;
            if (type === "esf") {
                content = `
                <div class="esf-marker"></div>
                `;
                marker = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(-8, -16),
                    enableMassClear: false
                });
            } else if (type === "circum") {
                content = `
                <div class="circum-marker"></div>
                `;
                marker = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(-8, -16),
                    enableMassClear: false
                });
            } else if (type === "cesf") {
                content = `
                <div class="circum-marker"></div>
                `;
                marker = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(-8, -16),
                    enableMassClear: false
                });
            } else if (type === "nd") {
                content = `
                <div class="nd-marker"></div>
                `;
                marker = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(-8, -16),
                    enableMassClear: false
                });
                marker.setZIndex(1);
            }
            if (marker) {
                let label;
                marker.addEventListener("mouseover", () => {
                    label = this.addCircumOrEsfLabel(obj, type);
                    this._track("3921", {
                        surround_type: this.surround_type
                    });
                    this.map.addOverlay(label);
                });
                marker.addEventListener("mouseout", () => {
                    this.map.removeOverlay(label);
                });
                marker.setStyle({
                    border: "none",
                    zIndex: 0,
                    backgroundColor: "transparent"
                });
                if (type === "esf") {
                    this.esfMark.push(marker);
                } else if (type === "circum") {
                    this.circumMark.push(marker);
                } else if (type === "cesf") {
                    this.cesfMarker.push(marker);
                } else if (type === "nd") {
                    this.ndMark.push(marker);
                }
                this.map.addOverlay(marker);
            }
        },
        /**
         * 周边配套、二手房 label
         * obj{community_name,lat,lng,price}
         */
        addCircumOrEsfLabel(obj, type, state) {
            let point = new BMap.Point(parseFloat(obj.lng), parseFloat(obj.lat));
            let name = obj.community_name ? obj.community_name : "";
            let price = obj.price && obj.price != "0" ? obj.price + "元/㎡" : "";
            let cname = obj.name ? obj.name : "";
            let cesfname = obj.communityName ? obj.communityName : "";
            let esfTime = obj.build_year ? obj.build_year + "年建成" : "";
            let ndname = obj.s_parcel_name ? obj.s_parcel_name : "";
            let ndprice = obj.f_closing_floor_price ?
                obj.f_closing_floor_price + "元/㎡" :
                "";
            let dis = obj.dis ? obj.dis : "";
            let ndType = obj.s_conforming ? obj.s_conforming : "";
            let content;
            let label;
            if (type === "esf") {
                content = `
                <div class="bmap-label esf-label"><p><span class="label-name">${name}</span></p><p><span>${price}</span><span>${esfTime}</span></p></div>
                `;
                label = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -64),
                    enableMassClear: false
                });
            } else if (type === "circum") {
                content = `
                <div class="bmap-label circum-label"><p><span class="label-name">${cname}</span> <span>${dis}米</span></p></div>
                `;
                label = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -52),
                    enableMassClear: false
                });
            } else if (type === "cesf") {
                content = `
                <div class="bmap-label cesf-label"><p><span class="label-name">${cesfname}</span></p><p><span>${price}</span><span>${esfTime}</span></p></div>
                `;
                label = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -64),
                    enableMassClear: false
                });
            } else if (type === "nd") {
                content = `
                <div class="bmap-label nd-label"><p><span class="label-name">${ndname}</span></p><p><span>${ndprice}</span><span>${ndType}</span></p></div>
                `;
                label = new BMap.Label(content, {
                    position: point,
                    offset: new BMap.Size(0, -64),
                    enableMassClear: false
                });
            }
            if (label) {
                label.setStyle({
                    border: "none",
                    backgroundColor: "transparent"
                });
                label.setZIndex(99);
                if (!state) {
                    this.esfLabel.push(label);
                } else {
                    this.map.removeOverlay(this.curCircumLabel);
                    this.curCircumLabel = label;
                }
                this.map.addOverlay(label);
            }
            return label;
        },
        // 添加当前选中楼盘mark + label
        // type false为搜索标记楼盘 true为楼盘卡片添加
        addCurHouseMark(obj, type) {
            if (type) {
                this.addHouseMark(obj, false, "sign", type);
            } else {
                this.addHouseMark(obj, false, "sign");
            }
        },
        /**
         * 获取楼盘详情
         */
        getProjectInfo(label, point) {
            if (
                this.allNewHouse.get("build_" + label.id) &&
                this.allNewHouse.get("build_" + label.id).card
            ) {
                this.allNewHouse.get("build_" + label.id).card.show();
                this._track("3904");
                return false;
            }
            let opt = {
                project_id: label.id
            };
            if (this.commutingFlag) {
                if (this.commutingPoint) {
                    opt.lat = this.commutingPoint.lat;
                    opt.lng = this.commutingPoint.lng;
                    opt.tripType = this.commutingType;
                }
            }

            let card = {
                is_sign: label.isTab
            };
            // 状态，1: 未售  2:在售  3:售罄 4:待售
            switch (label.status) {
                case "1":
                    card.status = "未售";
                    break;
                case "2":
                    card.status = "在售";
                    break;
                case "3":
                    card.status = "售罄";
                    break;
                case "4":
                    card.status = "待售";
                    break;
                default:
                    card.status = "--";
                    break;
            }
            this.axios.post("/backend-api/bk-map/get-project-info", opt).then(res => {
                if (res.status == 200) {
                    if (res.data.data) {
                        card.id = res.data.data.project_id;
                        card.name = res.data.data.name;
                        card.line = res.data.data.subway_line;
                        card.station = res.data.data.subway_station;
                        card.is_cooperate = res.data.data.is_cooperate;
                        card.unitPrice = res.data.data.current_rate;
                        card.juli = res.data.data.juli;
                        card.type = res.data.data.project_type;
                        card.city_id = res.data.data.city_id;
                        // 城市缩写
                        card.abbreviation = res.data.data.abbreviation;
                        // 城市名
                        card.city_name = res.data.data.city_name;
                        card.village_url = res.data.data.village_url;
                        if (this.commutingFlag) {
                            card.duration = res.data.data.duration;
                        }
                        if (res.data.data.houseType.length > 0) {
                            let html = "";
                            res.data.data.houseType.forEach(item => {
                                let isHas = false;
                                if (this.controlData[2].condition.length > 0) {
                                    this.controlData[2].condition.forEach(t => {
                                        if (t.text === item.room_type && t.state) {
                                            isHas = true;
                                        }
                                    });
                                }
                                let t = "";
                                if (isHas) {
                                    t = `<span data-id="${
                                        card.id
                                    }" data-click="houseType" data-name="${
                                        card.name
                                    }" data-type="${this.houseTypeID(
                                        item.room_type
                                    )}" class="active">${item.room_type} (${item.cnt})</span>`;
                                } else {
                                    t = `<span data-id="${
                                        card.id
                                    }" data-click="houseType" data-name="${
                                        card.name
                                    }" data-type="${this.houseTypeID(item.room_type)}">${
                                        item.room_type
                                    } (${item.cnt})</span>`;
                                }
                                html += t;
                            });
                            card.houseType = html;
                        }
                        let t;
                        if (this.commutingType == "0") {
                            t = "公交";
                        } else if (this.commutingType == "6") {
                            t = "驾车";
                        }
                        let content = `
                        <div class="house-card">
                            <div class="card-bd">
                            <div class="card-type">
                                <span>${card.type}</span>
                                <span>${card.status}</span>
                                <a href="javascript:;" data-click="report">报错</a>
                            </div>
                            <div class="card-subway">
                                <span>${
                                card.line
                                    ? "距" +
                                    card.station +
                                    "（" +
                                    card.line +
                                    "）" +
                                    card.juli +
                                    "m"
                                    : ""
                                }</span>
                            </div>
                            <div class="card-info">
                                <span class="bus-time">${
                                card.duration ? t + card.duration + "分钟" : ""
                                }</span>
                            </div>
                            <div class="house-type-wrap">
                                ${card.houseType ? card.houseType : ""}
                            </div>
                            </div>
                            <div class="card-hd">
                            <a data-click="sign" data-id="${card.id}" data-state='${
                        card.is_sign ? 2 : 1
                        }' href="javascript:;" class="sign-btn ${
                        card.is_sign ? "signed" : ""
                        }">${card.is_sign ? "取消" : "标记"}</a>
                            <a href="javascript:;" data-click="contrast" data-id="${
                                card.id
                            }" class="contrast" >加入对比</a>
                            <a href="javascript:;" data-click="share" data-id="${
                                card.id
                            }" class="share-btn">分享楼盘</a>
                            </div>
                            <div class="house-label card-label house-${label.id} ${
                        label.isTab ? "like" : ""
                        } select">
                            <span class="house-type">${label.text}</span>
                            <span class="sign-ico"></span>
                            <span class="house-name">${label.name}</span>
                            <span class="unit-price">${
                                label.unitPrice == "0" ||
                                label.unitPrice == "" ||
                                label.unitPrice == null
                                ? "待定"
                                : label.unitPrice + "元/㎡"
                            }</span>
                            </div>
                        </div>
                        `;
                        let _card = new BMap.Label(content, {
                            position: point,
                            offset: new BMap.Size(0, -16)
                        });
                        _card.setStyle({
                            border: "none",
                            backgroundColor: "transparent",
                            transform: "translate(-50%, -100%)"
                        });
                        _card.setZIndex(11);
                        _card.addEventListener("mouseover", () => {
                            _card.show();
                        });
                        _card.addEventListener("mouseout", () => {
                            _card.hide();
                        });
                        _card.addEventListener("click", event => {
                            let target = event.domEvent.target;
                            let _obj = {
                                tab: "iframInfo",
                                house: {
                                    projectId: label.id,
                                    name: label.name,
                                    addr: "",
                                    lng: label.lng,
                                    lat: label.lat
                                },
                                abbreviationName: card.abbreviation,
                                cityId: card.city_id,
                                cityName: card.city_name,
                                doorType: target.dataset.type ? target.dataset.type : "",
                                villageUrl: card.village_url,
                                isReal: this.isRealCity
                            };
                            if (target.dataset.click === "sign") {
                                let obj = {
                                    type: "1",
                                    projectId: target.dataset.id,
                                    order_id: this.order_id,
                                    city_id: card.city_id
                                };
                                if (target.dataset.state == "1") {
                                    obj.tabType = "1";
                                } else {
                                    obj.tabType = "2";
                                }
                                this.axios
                                    .post("/backend-api/bk-map/perform-tasks", obj)
                                    .then(res => {
                                        if (res.data.code == 0) {
                                            if (res.data.msg === "标记成功") {
                                                target.dataset.state = "2";
                                                target.innerHTML = "取消";
                                                target.className = "sign-btn signed";
                                                label.isTab = true;
                                                document
                                                    .querySelectorAll(`.house-${label.id}`)
                                                    .forEach(item => {
                                                        item.classList.add("like");
                                                    });
                                                // document.querySelector(`.house-${label.id}`).classList.add('like');
                                                this._track("3905");
                                            } else if (res.data.msg === "取消成功") {
                                                target.dataset.state = "1";
                                                target.innerHTML = "标记";
                                                target.className = "sign-btn";
                                                label.isTab = false;
                                                document
                                                    .querySelectorAll(`.house-${label.id}`)
                                                    .forEach(item => {
                                                        item.classList.remove("like");
                                                        if (label.status === "3") {
                                                            item.classList.add("no");
                                                        }
                                                    });
                                            }
                                        } else if (res.data.code == 1002) {
                                            if (res.data.msg === "此楼盘已经标记过了") {
                                                this.$message({
                                                    message: "此楼盘已标记过了",
                                                    type: "warning",
                                                    duration: 3000
                                                });
                                            }
                                        }
                                    });
                            } else if (target.dataset.click === "contrast") {
                                this._track("3906");
                                PubSub.publish("openContrastModal", {
                                    id: label.id,
                                    name: label.name,
                                    type: "3"
                                });
                            } else if (target.dataset.click === "share") {
                                this._track("3908");
                                let routeData = this.$router.resolve({
                                    path: `/singleHouseShare`,
                                    query: {
                                        // 当前楼盘的城市ID
                                        city_id: card.city_id,
                                        // 当前楼盘的城市name
                                        city_name: card.city_name,
                                        // 当前选择城市ID {String} 例：'2000001,2000003'
                                        currentCityId: this.cityInfo.currentCityId,
                                        // 当前选择城市name {String} 例：'北京,廊坊'
                                        currentCity: this.cityInfo.currentCity,
                                        // 订单ID
                                        order_id: this.$route.query.order_id,
                                        // 楼盘ID
                                        project_id: card.id
                                    }
                                });
                                window.open(routeData.href, "_blank");
                                // PubSub.publish("singleHouseInfo", {
                                //   project_id: label.id,
                                //   project_name: label.name
                                // });
                            } else if (target.dataset.click === "houseType") {
                                _obj.tab = "door";
                                this._track("3910");
                                PubSub.publish("openTabInfo", _obj);
                                this.addCurHouseMark(label, true);
                                this.circumFlag = false;
                            } else if (target.dataset.click === "report") {
                                PubSub.publish("openReportModal", {
                                    name: label.name,
                                    city_id: card.city_id
                                });
                            } else {
                                this._track("3909");
                                PubSub.publish("openTabInfo", _obj);
                                this.addCurHouseMark(label, true);
                            }
                        });
                        if (label.id != this.curHouse) {
                            return false;
                        }
                        if (
                            this.allNewHouse.get("build_" + card.id) &&
                            this.allNewHouse.get("build_" + card.id).card
                        ) {
                            this.allNewHouse.get("build_" + card.id).card.show();
                        } else {
                            if (this.allNewHouse.get("build_" + card.id)) {
                                this.allNewHouse.get("build_" + card.id).card = _card;
                                this.map.addOverlay(_card);
                            } else {
                                this.map.addOverlay(_card);
                            }
                        }
                        this._track("3904");
                    }
                }
            });
        },
        // 开启通勤找房模式
        openCommuting(pointObj) {
            if (this.circleFlag) {
                this.closeCricle(true);
                this.$emit("recoverCircleDef");
            }
            this.commutingFlag = true;
            if (this.districtState) {
                // 如果打开区域气泡则 删除区域气泡覆盖物
                this.districtList.forEach(item => {
                    this.map.removeOverlay(item.label);
                    if (item.card) {
                        this.map.removeOverlay(item.card);
                    }
                });
            }
            this.map.clearOverlays();
            if (pointObj) {
                // 通过地址搜索进入
                let point = new BMap.Point(
                    parseFloat(pointObj.lng),
                    parseFloat(pointObj.lat)
                );
                this.addCommutingMark(point, true);
            } else {
                // 点击鼠标标记进入,切换鼠标状态
                this.cursorSignState = true;
                this.map.setDefaultCursor("url(" + cursor + ") 20 36,default");
                this.map.addEventListener("click", this.cursorFuc);
            }
        },
        // 添加通勤找房标注
        // bool true为通勤地址进入 false 为鼠标标记
        addCommutingMark(point, bool) {
            if (this.commutingMark) {
                this.map.removeOverlay(this.commutingMark);
                this.commutingMark = null;
            }
            if (this.commutingLabel) {
                this.map.removeOverlay(this.commutingLabel);
                this.commutingLabel = null;
            }
            let ico = new BMap.Icon(commuting, new BMap.Size(37, 48));
            let m = new BMap.Marker(point, {
                icon: ico,
                offset: new BMap.Size(0, -10),
                enableMassClear: false
            });
            let con = `
            <div class="commuting-label"><span>选择区域后开始通勤找房</span></div>
            `;
            let label = new BMap.Label(con, {
                position: point,
                offset: new BMap.Size(-76, -77),
                enableMassClear: false
            });
            label.setZIndex(2);
            label.setStyle({
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer"
            });
            if (bool) {
                this.map.setCenter(point);
                label.addEventListener("click", () => {
                    // console.log('打开区域下拉列表')
                    this.$emit("openArea");
                });
            }
            this.$emit("addPoint");
            this.commutingPoint = point;
            this.commutingMark = m;
            this.commutingLabel = label;
            this.map.addOverlay(label);
            this.map.addOverlay(m);
            this.$emit("openArea");
        },
        /** 选择区域后开始通勤找房
         *  id 区域ID
         *  type 交通方式
         *  通勤时间 单位分钟
         */
        startCommuting(id, name, type, time) {
            if (!this.commutingPoint) {
                return false;
            }
            if (!id) {
                this.$message({
                    message: "选择区域后开始通勤找房",
                    type: "warning",
                    duration: 2000
                });
                return false;
            } else {
                this.curCommutingId = id;
                this.commutingLabel.hide();
            }
            let _type = "";
            let _time = "";
            if (type == "公交") {
                _type = "1";
                this.commutingType = "0";
            } else if (type == "驾车") {
                _type = "2";
                this.commutingType = "6";
            }
            if (time) {
                let arr = time.split("分钟");
                _time = arr[0];
            }
            let mustOpt = {
                order_id: this.order_id,
                city_id: this.cityInfo.currentCityId.split(","),
                type: "1",
                startLng: this.commutingPoint.lng,
                startLat: this.commutingPoint.lat,
                district_id: id,
                trafficType: _type, // 公交 1 驾车 2
                trafficMinute: _time,
                room_id: this.room_id,
                see_project_id: this.see_project_id
            };
            // 处理BUG 22200
            // if (type != this.lastComType) {
            //   this.clearAllnew();
            // }
            this.clearAllnew();
            if (
                type === this.lastComType &&
                id === this.lastId &&
                name === this.lastName &&
                time === this.lastComTime
            ) {
                this.clearAllnew();
            }
            Object.assign(mustOpt, this.filter);
            this.loading = true;
            this.lastComType = type;
            this.lastComTime = time;
            this.lastId = id;
            this.lastName = name;
            this.axios
                .post("/backend-api/bk-map/find-building", mustOpt)
                .then(res => {
                    if (res.data.data.list.length > 0) {
                        let view = [];
                        res.data.data.list.forEach(item => {
                            let obj = {
                                id: item.project_id,
                                name: item.name,
                                lng: parseFloat(item.lng),
                                lat: parseFloat(item.lat),
                                unitPrice: item.current_rate,
                                status: item.status,
                                isTab: item.isTab == 1 ? true : false,
                                isCooperate: item.is_cooperate == "1" ? true : false,
                                duration: item.duration,
                                distance: item.distance,
                                project_type: item.project_type,
                                project_type_text: item.project_type_text
                            };
                            view.push(new BMap.Point(obj.lng, obj.lat));
                            this.allNewHouse.set(
                                "build_" + obj.id,
                                this.addHouseMark(obj, type)
                            );
                        });
                        // this.$emit("houseTotal", res.data.data.length);
                        this.total = res.data.data.total;
                        this.map.setViewport(view, {
                            zoomFactor: -1
                        });
                    } else {
                        // this.$emit("houseTotal", 0);
                        this.total = 0;
                    }
                })
                .then(() => {
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        // 关闭通勤模式
        closeCommuting(circum) {
            this.curCommutingId = "";
            this.closeCursor();
            this.commutingPoint = null;
            this.map.removeOverlay(this.commutingMark);
            this.map.removeOverlay(this.commutingLabel);
            this.map.clearOverlays();
            this.allNewHouse.clear();
            this.commutingFlag = false;
            this.$emit("recoverComDef");
            if (!circum) {
                this.findBuild();
                this.getDistrict();
                this.getesf();
                this.getNd();
            }
        },
        // 关闭鼠标标记
        closeCursor(nores) {
            this.cursorSignState = false;
            this.map.setDefaultCursor("default");
            this.map.removeEventListener("click", this.cursorFuc);
            if (!this.commutingPoint && !nores) {
                this.commutingFlag = false;
                this.findBuild();
                this.getDistrict();
            }
        },
        // 地图拾取坐标方法
        cursorFuc(e) {
            let isHas = this.isHasClass("commuting-label");
            if (isHas) {
                // console.log('打开区域下拉列表')
                this.$emit("openArea");
            } else {
                this.addCommutingMark(e.point);
            }
        },
        // 判断点击冒泡DOM 是否有这个class
        isHasClass(c) {
            let path = event.path || (event.composedPath && event.composedPath());
            let isHas = false;
            path.forEach(item => {
                if (item.classList && item.classList.contains(c)) {
                    isHas = true;
                }
            });
            return isHas;
        },
        // 户型文字转ID
        houseTypeID(text) {
            let id = "";
            this.houseType.forEach(item => {
                if (item.text === text) {
                    id = item.id;
                }
            });
            return id;
        },
        // 地图小于等于13 时 显示楼盘小圆点
        showDot() {
            this.allNewHouse.forEach(item => {
                if (item.label && !item.label.sign) {
                    item.label.hide();
                }
            });
        },
        // 地图大于13时显示楼盘标签
        showDotLabel() {
            this.allNewHouse.forEach(item => {
                if (item.label) {
                    item.label.show();
                }
            });
        },
        // 清除新房覆盖物 Map对象
        clearAllnew() {
            this.allNewHouse.forEach(item => {
                if (item.mark) {
                    this.map.removeOverlay(item.mark);
                }
                if (item.label) {
                    this.map.removeOverlay(item.label);
                }
            });
            this.allNewHouse.clear();
        },
        // 设置地图类型 0 配套 1 百度 2 卫星
        setMapType(n) {
            switch (n) {
                case 0:
                    this.map.setMapStyleV2({
                        styleId: this.styleId
                    });
                    break;
                case 1:
                    this.map.setMapStyleV2({
                        styleJson: []
                    });
                    this.map.setMapType(BMAP_NORMAL_MAP);
                    break;
                case 2:
                    this.map.setMapStyleV2({
                        styleJson: []
                    });
                    this.map.setMapType(BMAP_HYBRID_MAP);
                    break;
                default:
                    this.map.setMapType(BMAP_NORMAL_MAP);
                    break;
            }
        },
        // 开启画圈找房模式
        openCricle() {
            if (this.commutingFlag) {
                this.closeCommuting(true);
            }
            this.circleFlag = true;
            this.cricleLayer = true;
            this.map.clearOverlays();
            this.cricleLine = new BMap.Polyline([], {
                strokeWeight: 5,
                strokeColor: "#33A1FF",
                enableMassClear: false
            });
            this.criclePolygon = new BMap.Polygon([], {
                strokeWeight: 5,
                fillColor: "#33A1FF",
                strokeOpacity: 1,
                strokeColor: "#33A1FF",
                fillOpacity: 0.2,
                enableMassClear: false
            });
            this.map.addOverlay(this.cricleLine);
            this.map.addOverlay(this.criclePolygon);
        },
        // 重绘画圈找房
        redraw() {
            this.map.removeOverlay(this.cricleLine);
            this.map.removeOverlay(this.criclePolygon);
            this.cricleStart = null;
            this.cricleEnd = null;
            this.cricleLine = null;
            this.criclePolygon = null;
            this.openCricle();
        },
        // 关闭画圈找房
        closeCricle(circum) {
            if (!this.circleFlag) {
                return false;
            }
            this.map.removeOverlay(this.cricleLine);
            this.map.removeOverlay(this.criclePolygon);
            this.circleFlag = false;
            this.cricleLayer = false;
            this.cricleStart = null;
            this.cricleEnd = null;
            this.cricleLine = null;
            this.criclePolygon = null;
            this.map.clearOverlays();
            if (!circum) {
                this.findBuild();
                this.getDistrict();
                this.getesf();
                this.getNd();
            }
        },
        // 鼠标event 转化 BMap point 对象
        pixelToPoint(x, y) {
            return this.map.pixelToPoint({
                x: x - 140,
                y: y
            });
        },
        // 画圈找房 获取画圈范围的矩形四个点经纬
        getCricleRect() {
            let b = this.criclePolygon.getBounds();
            let sw = b.getSouthWest();
            let ne = b.getNorthEast();
            return {
                minLng: sw ? sw.lng : "",
                maxLng: ne ? ne.lng : "",
                minLat: sw ? sw.lat : "",
                maxLat: ne ? ne.lat : ""
            };
        },
        isPointInRect(point, bounds) {
            //检查类型是否正确
            if (!(point instanceof BMap.Point) || !(bounds instanceof BMap.Bounds)) {
                return false;
            }
            var sw = bounds.getSouthWest(); //西南脚点
            var ne = bounds.getNorthEast(); //东北脚点
            return (
                point.lng >= sw.lng &&
                point.lng <= ne.lng &&
                point.lat >= sw.lat &&
                point.lat <= ne.lat
            );
        },
        // 判断楼盘位置是否在画圈找房范围内
        isPointInPolygon(point, polygon) {
            //检查类型
            if (
                !(point instanceof BMap.Point) ||
                !(polygon instanceof BMap.Polygon)
            ) {
                return false;
            }

            //首先判断点是否在多边形的外包矩形内，如果在，则进一步判断，否则返回false
            var polygonBounds = polygon.getBounds();
            if (!this.isPointInRect(point, polygonBounds)) {
                return false;
            }

            var pts = polygon.getPath(); //获取多边形点
            var N = pts.length;
            var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
            var intersectCount = 0; //cross points count of x
            var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
            var p1, p2; //neighbour bound vertices
            var p = point; //测试点

            p1 = pts[0]; //left vertex
            for (var i = 1; i <= N; ++i) {
                //check all rays
                if (p.equals(p1)) {
                    return boundOrVertex; //p is an vertex
                }

                p2 = pts[i % N]; //right vertex
                if (
                    p.lat < Math.min(p1.lat, p2.lat) ||
                    p.lat > Math.max(p1.lat, p2.lat)
                ) {
                    //ray is outside of our interests
                    p1 = p2;
                    continue; //next ray left point
                }

                if (
                    p.lat > Math.min(p1.lat, p2.lat) &&
                    p.lat < Math.max(p1.lat, p2.lat)
                ) {
                    //ray is crossing over by the algorithm (common part of)
                    if (p.lng <= Math.max(p1.lng, p2.lng)) {
                        //x is before of ray
                        if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {
                            //overlies on a horizontal ray
                            return boundOrVertex;
                        }

                        if (p1.lng == p2.lng) {
                            //ray is vertical
                            if (p1.lng == p.lng) {
                                //overlies on a vertical ray
                                return boundOrVertex;
                            } else {
                                //before ray
                                ++intersectCount;
                            }
                        } else {
                            //cross point on the left side
                            var xinters =
                                ((p.lat - p1.lat) * (p2.lng - p1.lng)) / (p2.lat - p1.lat) +
                                p1.lng; //cross point of lng
                            if (Math.abs(p.lng - xinters) < precision) {
                                //overlies on a ray
                                return boundOrVertex;
                            }

                            if (p.lng < xinters) {
                                //before ray
                                ++intersectCount;
                            }
                        }
                    }
                } else {
                    //special case when ray is crossing through the vertex
                    if (p.lat == p2.lat && p.lng <= p2.lng) {
                        //p crossing over p2
                        var p3 = pts[(i + 1) % N]; //next vertex
                        if (
                            p.lat >= Math.min(p1.lat, p3.lat) &&
                            p.lat <= Math.max(p1.lat, p3.lat)
                        ) {
                            //p.lat lies between p1.lat & p3.lat
                            ++intersectCount;
                        } else {
                            intersectCount += 2;
                        }
                    }
                }
                p1 = p2; //next ray left point
            }
            // if-else写法改为return 写法  
            // false=偶数在多边形外   true=奇数在多边形内
            return intersectCount % 2 != 0;
        },
        //清空周边
        clearAround() {
            this.circumMark.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.circumLabel.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.cesfMarker.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.cesfMarker.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.map.removeOverlay(this.curCircumLabel);
        },
        // 点击楼盘统计
        handleTotalClick() {
            this._track("4171");
            if (this.circleFlag && this.cricleLayer) {
                console.log("画圈未画圈");
                return false;
            }
            if (this.commutingFlag && !this.curCommutingId) {
                console.log("通勤未通勤");
                return false;
            }
            if (this.circumFlag) {
                return false;
            }
            if (this.circleFlag || this.commutingFlag) {
                let arr = [];
                this.allNewHouse.forEach(item => {
                    arr.push(new BMap.Point(parseFloat(item.lng), parseFloat(item.lat)));
                });
                this.map.setViewport(arr, {
                    zoomFactor: -1
                });
            } else {
                if (this.mapView.length) {
                    this.map.setViewport(this.mapView, -1);
                } else {
                    this.map.centerAndZoom(this.cityInfo.currentCity.split(",")[0], 12);
                }
            }
        },
        // 清除板块覆盖物
        clearSection() {
            this.sectionCircle.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.sectionCircle = [];
            this.sectionLabel.forEach(item => {
                this.map.removeOverlay(item);
            });
            this.sectionLabel = [];
        },
        // 获取城市板块
        getSection() {
            this.clearSection();
            this.axios
                .post(`/backend-api/bk-map/get-plate`, {
                    city_id: this.cityInfo.currentCityId.split(",")
                })
                .then(res => {
                    if (res.data.code == 0 && Object.keys(res.data.data).length > 0) {
                        res.data.data.forEach(item => {
                            let point = new BMap.Point(
                                parseFloat(item.core_lng),
                                parseFloat(item.core_lat)
                            );
                            this.sectionCircle.push(
                                this.addSectionCircle(point, parseFloat(item.distance))
                            );
                            this.sectionLabel.push(
                                this.addSectionLabel(point, item.plate_name)
                            );
                        });
                    }
                });
        },
        // 地图添加板块圆形
        addSectionCircle(point, radius) {
            let opts = {
                enableMassClear: false,
                strokeColor: "#ff8800",
                fillColor: "#ff8800",
                strokeStyle: "solid",
                strokeWeight: "4",
                fillOpacity: "0.1",
                enableClicking: false
            };
            let circle = new BMap.Circle(point, radius, opts);
            if (this.zoom < 14) {
                circle.hide();
            }
            this.map.addOverlay(circle);
            return circle;
        },
        // 地图添加板块标签
        addSectionLabel(point, name) {
            let content = `
            <div class="sectionLabel">
                <span>${name}</span>
            </div>
            `;
            let label = new BMap.Label(content, {
                position: point,
                offset: new BMap.Size(0, -32),
                enableMassClear: false
            });
            label.setStyle({
                backgroundColor: "transparent",
                border: "none"
            });
            if (this.zoom < 14) {
                label.hide();
            }
            this.map.addOverlay(label);
            return label;
        },
        // 显示板块
        showSection() {
            this.sectionCircle.forEach(item => {
                item.show();
            });
            this.sectionLabel.forEach(item => {
                item.show();
            });
        },
        // 隐藏板块
        hideSection() {
            this.sectionCircle.forEach(item => {
                item.hide();
            });
            this.sectionLabel.forEach(item => {
                item.hide();
            });
        },
        /**
         * @description: 处理父组件传进来筛选条件
         * @param {Array} arr 整个接收的父组件筛选条件对象数组 
         * @param {Object} opt[init] opt.init 默认不是初始化使用，初始化使用须init = true
         * @return: void
         */
        handleFilter(arr, opt) {
            let defaultOpt = {
                init: false
            }
            if (opt) {
                Object.assign(defaultOpt, opt);
            }
            arr.forEach(item => {
                if (item.name == "价格") {
                    if (item.condition.length > 0) {
                        item.condition.forEach(i => {
                            if (i && i.name == "总价") {
                                if (i.state) {
                                    this.filter.total_price_min = i.min;
                                    this.filter.total_price_max = i.max;
                                } else {
                                    this.filter.total_price_min = "";
                                    this.filter.total_price_max = "";
                                }
                            } else if (i && i.name == "单价") {
                                if (i.state) {
                                    this.filter.offer_price_min = i.min;
                                    this.filter.offer_price_max = i.max;
                                } else {
                                    this.filter.offer_price_min = "";
                                    this.filter.offer_price_max = "";
                                }
                            } else if (i && i.name == "首付") {
                                if (i.state) {
                                    this.filter.down_pay_min = i.min;
                                    this.filter.down_pay_max = i.max;
                                    this.filter.down_pay_ratio = i.ratio;
                                } else {
                                    this.filter.down_pay_min = "";
                                    this.filter.down_pay_max = "";
                                    this.filter.down_pay_ratio = "30";
                                }
                            }
                        });
                    } else {
                        this.filter.total_price_min = "";
                        this.filter.total_price_max = "";
                        this.filter.offer_price_min = "";
                        this.filter.offer_price_max = "";
                        this.filter.down_pay_min = "";
                        this.filter.down_pay_max = "";
                        this.filter.down_pay_ratio = "30";
                    }
                } else if (item.name == "面积") {
                    if (item.condition.length > 0) {
                        if (item.condition[0].state) {
                            this.filter.acreage_min = item.condition[0].min;
                            this.filter.acreage_max = item.condition[0].max;
                        } else {
                            this.filter.acreage_min = "";
                            this.filter.acreage_max = "";
                        }
                    } else {
                        this.filter.acreage_min = "";
                        this.filter.acreage_max = "";
                    }
                } else if (item.name == "户型" || item.name == "户型&朝向") {
                    if (item.condition.length > 0) {
                        let t = "";
                        item.condition.forEach(i => {
                            if (i.state && i.text != "不限") {
                                if (t) {
                                    t = t + "," + i.id;
                                } else {
                                    t = i.id;
                                }
                            }
                        });
                        this.filter.room_type = t;
                    } else {
                        this.filter.room_type = "";
                    }
                    this.handleSearch(item.conditionMore, 'orientation');
                } else if (item.name == "业态") {
                    if (item.condition.length > 0) {
                        let t = "";
                        item.condition.forEach(i => {
                            if (i.state) {
                                if (t) {
                                    t = t + "," + i.id;
                                } else {
                                    t = i.id;
                                }
                            }
                        });
                        this.filter.project_type = t;
                    } else {
                        this.filter.project_type = "";
                    }
                } else if (item.name == "特色") {
                    if (item.condition.length > 0) {
                        let t = "";
                        item.condition.forEach(i => {
                            if (i.state && i.text != "不限") {
                                if (t) {
                                    t = t + "," + i.id;
                                } else {
                                    t = i.id;
                                }
                            }
                        });
                        this.filter.project_tese = t;
                    } else {
                        this.filter.project_tese = "";
                    }
                } else if (item.name == "地铁线") {
                    if (item.condition.length > 0) {
                        if (item.condition[0].state && item.condition[0].text != "不限") {
                            this.filter.subway_line = item.condition[0].text;
                            this.filter.subway_city_id = item.condition[0].city_id;
                            this.filter.subway_city_name = item.condition[0].city_name;
                        } else {
                            this.filter.subway_line = "";
                            this.filter.subway_city_id = "";
                            this.filter.subway_city_name = "";
                            if (!defaultOpt.init) {
                                this.clearSubOver();
                            }
                        }
                    } else {
                        this.filter.subway_line = "";
                        this.filter.subway_city_id = "";
                        if (!defaultOpt.init) {
                            this.clearSubOver();
                        }
                    }
                } else if (item.name == "开盘") {
                    if (item.condition.length > 0) {
                        if (item.condition[0].state && item.condition[0].text != "不限") {
                            this.filter.open_time = item.condition[0].id;
                        } else {
                            this.filter.open_time = "";
                        }
                    } else {
                        this.filter.open_time = "";
                    }
                } else if (item.key === "distri") {
                    this.handleSearch(item.condition, 'district_id');
                } else if (item.key === "uniDecorate") {
                    this.handleSearch(item.condition, 'house_year');
                    this.handleSearch(item.conditionMore, 'decoration_status');
                } else if (item.key === "floor") {
                    this.handleSearch(item.condition, 'height_type');
                    this.handleSearch(item.conditionMore, 'total_floor_num');
                    this.handleSearch(item.conditionTri, 'elevator');
                }
            })
        },
        /**
         * @description: 处理筛选条件公共方法
         * @param {Array} arr 要处理的数组
         * @param {String} key 搜索的参数
         */
        handleSearch(arr, key) {
            if (arr && arr.length > 0) {
                let t = "";
                arr.forEach(i => {
                    if (i.state) {
                        if (t) {
                            t = t + "," + i.id;
                        } else {
                            t = i.id;
                        }
                    }
                });
                this.filter[key] = t;
            } else {
                this.filter[key] = "";
            }
        }
    },
    watch: {
        //监听地铁选择
        filter: {
            handler: function (val, old) {
                if (val.subway_line == "") {
                    this.clearSubOver();
                } else {
                    if (this.circleFlag) {
                        this.closeCricle();
                        this.$emit("recoverCircleDef");
                    }
                    if (this.commutingFlag) {
                        this.closeCommuting();
                        this.$emit("recoverComDef");
                    }
                    this.subPath(val.subway_city_name, val.subway_line);
                }
            },
            deep: true
        },
        // 监听城市切换cityInfo
        cityInfo: {
            handler: function (val, old) {
                this.clearSubOver();
                this.clearSection();
                this.map.centerAndZoom(val.currentCity.split(",")[0], 11);
                this.getSection();
                if (this.circleFlag) {
                    this.closeCricle();
                    this.$emit("recoverCircleDef");
                }
                if (this.commutingFlag) {
                    this.closeCommuting();
                    this.$emit("recoverComDef");
                }
                this.getDistrict();
                this.findBuild();
                // 获取交通线
                this.getTransitLine();
            },
            deep: true
        },
        // 监听区域开关状态
        districtState(newval) {
            if (this.circleFlag || this.commutingFlag) {
                return false;
            }
            this.districtBubble(newval);
        },
        controlData: {
            handler: function (newval) {
                this.handleFilter(newval);
                this.getDistrict();
                this.findBuild();
                if (this.commutingFlag) {
                    this.startCommuting(
                        this.lastId,
                        this.lastName,
                        this.lastComType,
                        this.lastComTime
                    );
                }
                if (this.circleFlag) {
                    this.findBuild("cricle");
                }
            },
            deep: true
        },
        otherFilter: {
            handler: function (newval) {
                newval.forEach(item => {
                    if (item.name === "筛选非售罄盘") {
                        if (item.state) {
                            this.filter.status = "2";
                        } else {
                            this.filter.status = "";
                        }
                    } else if (item.name === "居理专属楼盘") {
                        if (item.state) {
                            this.filter.is_cooperate = "1";
                        } else {
                            this.filter.is_cooperate = "";
                        }
                    } else if (item.name === "筛选外联楼盘") {
                        if (item.state) {
                            this.filter.is_outreach = "1";
                        } else {
                            this.filter.is_outreach = "0";
                        }
                    } else if (item.name === "仅展示标记盘") {
                        if (item.state) {
                            this.filter.is_tab = "1";
                        } else {
                            this.filter.is_tab = "2";
                        }
                    }
                });
                this.getDistrict();
                this.findBuild();
                if (this.commutingFlag) {
                    this.startCommuting(
                        this.lastId,
                        this.lastName,
                        this.lastComType,
                        this.lastComTime
                    );
                }
                if (this.circleFlag) {
                    this.findBuild("cricle");
                }
            },
            deep: true
        },
        // 监听缩放 控制楼盘标签小圆点 标签的显示
        zoom(newval) {
            newval <= 13 ? this.hideSection() : this.showSection();
            if (!this.commutingFlag || !this.circleFlag) {
                // 通勤模式或者画圈模式下 不处理zoom变化
                return false;
            }
            if (newval <= 13) {
                this.showDot();
                this.hideSection();
            } else {
                this.showDotLabel();
                this.showSection();
            }
        },
        // 监听二手房开关
        esfFlag(newval) {
            if (newval) {
                this.getesf();
            } else {
                this.clearEsf();
            }
        },
        // 监听拿地信息开关
        ndFlag(newval) {
            if (newval) {
                this.getNd();
            } else {
                this.clearNd();
            }
        },
        // 监听周边和通勤打开状态
        circumFlag(newval) {
            if (!newval) {
                this.clearAround();
                this.findBuild();
                this.getDistrict();
                this.getesf();
                this.getNd();
            } else {
                this.map.clearOverlays();
                this.clearEsf(); // 打开周边清除二手房
                this.clearNd(); // 打开周边清除拿地信息
                this.map.centerAndZoom(this.curPoint, 16);
                if (this.circleFlag) {
                    this.closeCricle(true);
                    this.clearAround();
                    this.$emit("recoverCircleDef");
                }
                if (this.commutingFlag) {
                    this.clearAround();
                    this.closeCommuting(true);
                    this.$emit("recoverComDef");
                }
            }
        },
        cricleLayer(newval) {
            if (newval) {
                this.$emit("btnControl", false);
            } else {
                this.$emit("btnControl", true);
            }
        }
    }
};
</script>

<style lang="less">
// 公交/地铁回显 开始
.line-wrap {
    position: relative;
    width: 265px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
    transform: translate(-50%, -100%);
    border-radius: 4px;

    .bg {
        position: relative;
        z-index: 200;
        padding: 20px;
        background-color: #fff;
    }

    .head {
        font-size: 18px;
        color: #3e4254;
        margin-bottom: 8px;
    }

    .status-box {
        font-size: 14px;
        color: #333;
        margin-bottom: 12px;

        span {
            display: inline-block;
            padding: 0 7px;
            line-height: 1;
            border-right: 1px solid #e6e6e6;
        }

        .sale {
            padding-left: 0;
            padding-right: 10px;
        }

        .status {
            border-right: 0 none;
            color: #6ac073;
        }
    }

    .des {
        font-size: 14px;
        line-height: 24px;
        white-space: initial;
        word-break: break-all;
    }

    &::after {
        content: "";
        position: absolute;
        width: 28px;
        height: 28px;
        bottom: -14px;
        left: 50%;
        margin-left: -14px;
        transform: rotate(45deg);
        background: #fff;
        box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
        z-index: 1;
    }
}

// 公交/地铁回显 结束
.map-wrap,
#map {
    width: 100%;
    height: 100%;
}

.districtMark {
    box-sizing: border-box;
    width: 92px;
    height: 92px;
    padding: 18px 0;
    background-image: linear-gradient(-180deg,
            rgba(98, 207, 255, 0.9) 0%,
            rgba(51, 161, 255, 0.9) 100%);
    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
    transition: all 0.2s ease-in;

    p {
        font-size: 12px;
        color: #ffffff;
        text-align: center;
        line-height: 17px;
        margin-top: 4px;

        &:nth-child(1) {
            font-weight: bold;
            margin-top: 0;
        }
    }

    &.like {
        background-image: linear-gradient(-180deg,
                rgba(255, 149, 125, 0.9) 0%,
                rgba(255, 92, 71, 0.9) 100%);
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);

        &:hover {
            background-image: linear-gradient(-180deg,
                    rgba(255, 189, 0, 0.9) 0%,
                    rgba(255, 136, 0, 0.9) 100%);
        }
    }

    &:hover {
        background-image: linear-gradient(-180deg,
                rgba(255, 189, 0, 0.9) 0%,
                rgba(255, 136, 0, 0.9) 100%);
    }
}

.districtCard {
    width: 285px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
    border-radius: 4px;
    position: relative;

    .bg {
        padding: 20px;
        background: #ffffff;
        position: relative;
        z-index: 2;
    }

    .tit {
        font-size: 18px;
        line-height: 25px;
        color: #3e4254;
    }

    .part-tit-t {
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        margin: 10px 0;
        color: #3e4254;
    }

    .part-tit-b {
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        margin: 20px 0 10px;
        color: #3e4254;
    }

    .con {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 10px;
        color: #333333;
        white-space: pre-wrap;
    }

    a {
        display: block;
        width: 143px;
        height: 32px;
        line-height: 32px;
        margin: 20px auto 0;
        border: 1px solid #33a1ff;
        border-radius: 4px;
        font-size: 14px;
        color: #3497fc;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
    }

    .before {
        position: absolute;
        top: -3px;
        left: -115px;
        width: 115px;
        height: 92px;
        border-top-left-radius: 92px;
        border-bottom-left-radius: 92px;
        background: transparent;
        z-index: 1;
    }

    &::after {
        content: "";
        position: absolute;
        width: 28px;
        height: 28px;
        top: 30px;
        left: -11px;
        transform: rotate(45deg);
        background: #ffffff;
        box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
}

.house-label {
    position: relative;
    display: inline-block;
    padding: 0 10px 0 0;
    height: 30px;
    line-height: 30px;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-size: 0;
    color: #3e4254;
    cursor: pointer;
    transition: all 0.2s ease-in;

    &::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        transform: rotate(45deg) translate(-5px, 0);
        bottom: -9px;
        left: 50%;
        background: #ffffff;
        transition: all 0.2s ease-in;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        z-index: 0;
    }

    span {
        display: inline-block;
        white-space: nowrap;
        vertical-align: top;
        font-size: 12px;
        background: #ffffff;
        position: relative;
        z-index: 1;
        transition: all 0.2s ease-in;
    }

    .house-type {
        background: #71a0a5;
        padding: 0 8px;
        margin-right: 8px;
        border-radius: 4px 0 0 4px;
        color: #ffffff;
        transition: all 0.2s ease-in;
    }

    .sign-ico {
        display: none;
        height: 30px;
        width: 24px;
        background: url("../images/label_tab.png") no-repeat left;
        background-size: 70%;
    }

    .house-name {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .unit-price {
        padding-left: 6px;
    }

    &.zz {
        .house-type {
            background: #33a1ff;
        }
    }

    &.bs {
        .house-type {
            background: #905858;
        }
    }

    &.orther {
        .house-type {
            background: #71a0a5;
        }
    }

    &.xj {
        .house-type {
            background: #f7b633;
        }
    }

    &.sellOut {
        .house-type {
            background: #abb0b5;
        }
    }

    &.like {
        .house-type {
            background: #ff5c47;
        }

        .sign-ico {
            display: inline-block;
        }
    }

    &.select {
        color: #ffffff;
        background: #ff8800;

        span {
            color: #ffffff;
            background: #ff8800;
        }

        .house-type {
            position: relative;
            background: #ff8800;

            &::after {
                content: "";
                position: absolute;
                height: 14px;
                border-left: 1px dashed #ffffff;
                top: 8px;
                right: 0;
            }
        }

        .sign-ico {
            background: url("../images/sign-ico.png") no-repeat left;
            background-size: 70%;
        }

        &::after {
            background: #ff8800;
        }
    }

    &:hover {
        color: #ffffff;
        background: #ff8800;

        span {
            color: #ffffff;
            background: #ff8800;
        }

        .house-type {
            position: relative;
            background: #ff8800;

            &::after {
                content: "";
                position: absolute;
                height: 14px;
                border-left: 1px dashed #ffffff;
                top: 8px;
                right: 0;
            }
        }

        .sign-ico {
            background: url("../images/sign-ico.png") no-repeat left;
            background-size: 70%;
        }

        &::after {
            background: #ff8800;
        }
    }
}

.house-card {
    width: 265px;
    padding-top: 12px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
    border-radius: 4px;
    position: relative;

    // &::after {
    //   content: "";
    //   position: absolute;
    //   width: 12px;
    //   height: 12px;
    //   bottom: -10px;
    //   left: 50%;
    //   transform: rotate(45deg) translate(-50%, 0);
    //   background: #ffffff;
    //   box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
    //   z-index: 0;
    // }
    .card-hd {
        display: flex;
        margin: 0 20px;
        justify-content: space-between;
        align-items: center;
        height: 42px;
        border-top: 1px dashed #e6e6e6;

        a {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #3e4254;
            transition: all 0.2s ease-in;
        }

        .sign-btn {
            padding-left: 22px;
            background: url("../images/card-sign.png") no-repeat left;
            background-size: 16px;

            &:hover {
                color: #33a1ff;
            }

            &.signed {
                background: url("../images/card-signed.png") no-repeat left;
                background-size: 16px;
            }
        }

        .contrast {
            padding-left: 22px;
            background: url("../images/icon-contrast.png") no-repeat left;
            background-size: 16px;

            &:hover {
                color: #33a1ff;
            }
        }

        .share-btn {
            padding-left: 22px;
            background: url("../images/header-share.png") no-repeat left;
            background-size: 16px;

            &:hover {
                color: #33a1ff;
            }
        }
    }

    .card-bd {
        padding: 0 20px;
        overflow: hidden;

        .card-type {
            margin-bottom: 8px;
            position: relative;

            span {
                display: inline-block;
                position: relative;
                margin-right: 14px;
                line-height: 20px;
                font-size: 14px;
                color: #333333;

                &::after {
                    content: "";
                    position: absolute;
                    height: 12px;
                    top: 4px;
                    right: -8px;
                    border-right: 1px dashed #e6e6e6;
                }
                &:nth-child(2) {
                    margin-right: 0;

                    &::after {
                        border-right: none;
                    }
                }
            }

            a {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(0, -50%);
                font-size: 14px;
                font-weight: bold;
                line-height: 20px;
                color: #ff5c47;
            }
        }

        .card-subway {
            line-height: 20px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #333333;
            white-space: initial;
        }

        .card-info {
            line-height: 20px;
            margin-bottom: 8px;
        }

        .house-type-wrap {
            overflow: hidden;
            margin-bottom: 8px;

            span {
                float: left;
                box-sizing: border-box;
                margin-right: 10px;
                margin-bottom: 8px;
                min-width: 68px;
                padding: 0 3px 0 6px;
                white-space: nowrap;
                line-height: 22px;
                border: 1px solid #e6e6e6;
                font-size: 12px;
                color: #77808a;
                cursor: pointer;
                transition: all 0.2s ease-in;

                &:nth-child(3) {
                    margin-right: 0;
                }

                &.active {
                    position: relative;

                    &::after {
                        content: "";
                        position: absolute;
                        border: 4px solid transparent;
                        border-bottom: 4px solid #ff5c47;
                        transform: rotate(45deg);
                        top: -3px;
                        right: -3px;
                    }
                }

                &:hover {
                    color: #33a1ff;
                }
            }
        }
    }
}

.commuting-label {
    position: relative;
    box-sizing: border-box;
    width: 152px;
    text-align: center;
    line-height: 30px;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    font-size: 12px;
    color: #3e4254;

    span {
        display: inline-block;
        position: relative;
        line-height: 30px;
        background: #ffffff;
        z-index: 10;
    }

    &::after {
        content: "";
        position: absolute;
        width: 11px;
        height: 11px;
        bottom: -5px;
        left: 50%;
        margin-left: -6px;
        transform: rotate(45deg);
        background: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        z-index: 1;
    }
}

.cricle-layer {
    position: absolute;
    top: 58px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0);
    z-index: 6;
    cursor: url("../images/cursor_s.png"), auto;
}

.esf-marker {
    width: 16px;
    height: 16px;
    background: url("../images/esf-ico.png") no-repeat center;
    background-size: contain;

    &:hover {
        background: url("../images/esf-hover-ico.png") no-repeat center;
        background-size: contain;
    }
}

.circum-marker {
    width: 16px;
    height: 16px;
    background: url("../images/circum-ico.png") no-repeat center;
    background-size: contain;
}

.nd-marker {
    width: 16px;
    height: 16px;
    background: url("../images/nd-ico.png") no-repeat center;
    background-size: contain;

    &:hover {
        background: url("../images/nd-hover-ico.png") no-repeat center;
        background-size: contain;
    }
}

.bmap-label {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    transform: translate(-50%, 0);
    font-size: 12px;
    color: #fff;
    box-sizing: border-box;
    padding: 0 10px;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        transform: rotate(45deg);
        width: 12px;
        height: 12px;
        bottom: -2px;
        left: 50%;
        margin-left: -6px;
    }

    p {
        position: relative;
        z-index: 2;
        text-align: center;
        line-height: 30px;
    }

    &.esf-label {
        background: #13c2c2;
        padding: 6px 10px;

        p {
            text-align: left;
            line-height: 12px;
            margin-bottom: 6px;
            background: #13c2c2;

            &:last-child {
                margin-bottom: 0;

                span {
                    margin-right: 6px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }

        &::after {
            background: #13c2c2;
        }
    }

    &.cesf-label {
        background: #ffb300;
        padding: 6px 10px;

        p {
            text-align: left;
            line-height: 12px;
            margin-bottom: 6px;
            background: #ffb300;

            &:last-child {
                margin-bottom: 0;

                span {
                    margin-right: 6px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }

        &::after {
            background: #ffb300;
        }
    }

    &.circum-label {
        background: #ffb300;

        p {
            background: #ffb300;
        }

        &::after {
            background: #ffb300;
        }
    }

    &.nd-label {
        padding: 6px 10px;
        background: #af921c;

        p {
            text-align: left;
            line-height: 12px;
            margin-bottom: 6px;
            background: #af921c;

            &:last-child {
                margin-bottom: 0;

                span {
                    margin-right: 6px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }

        &::after {
            background: #af921c;
        }
    }
}

.blc {
    position: absolute;
    left: 236px;
    bottom: 20px;
    width: 63px;
    line-height: 20px;
    font-size: 12px;
    color: #333333;
    text-align: center;
    border-bottom: 3px solid #333333;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 6px;
        width: 1px;
        background: #333333;
    }

    &::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        height: 6px;
        width: 1px;
        background: #333333;
    }
}

.test {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 400px;
    bottom: 10px;
    border-radius: 50%;
    background: red;
    font-size: 24px;
    line-height: 50px;
    color: #fff;
    text-align: center;
    font-weight: bold;
}

.bmap-total {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 10px;
    border-radius: 22px;
    padding: 6px 20px 7px;
    font-size: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.2s ease-in;
    cursor: pointer;

    span {
        display: inline-block;
        line-height: 20px;
        font-size: 14px;
        color: #ffffff;
        vertical-align: middle;

        &.total-num {
            font-size: 18px;
            font-weight: bold;
            color: #ff8800;
            margin: 0 5px;
        }
    }
}

.sectionLabel {
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    transform: translate(-50%, 0);

    span {
        display: block;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        background: #ffffff;
        position: relative;
        z-index: 1;
        font-size: 12px;
        color: #ff8800;
    }

    &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        bottom: -2px;
        left: 50%;
        margin-left: -5px;
        background: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        transform: rotate(45deg);
        z-index: 0;
    }
}

.houseMark {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;

    &.zz {
        background-color: rgba(51, 161, 255, 0.6);
        border: 1px solid #33a1ff;
    }

    &.bs {
        background-color: rgba(144, 88, 88, 0.6);
        border: 1px solid #905858;
    }

    &.orther {
        background-color: rgba(113, 160, 165, 0.6);
        border: 1px solid #71a0a5;
    }

    &.xj {
        background-color: rgba(247, 182, 51, 0.6);
        border: 1px solid #f7b633;
    }

    &.sellOut {
        background-color: rgba(171, 176, 181, 0.6);
        border: 1px solid #e6e6e6;
    }

    &.like {
        background-color: rgba(255, 92, 71, 0.8);
        border: 1px solid #ff5c47;
    }

    &.sign {
        background-color: rgba(255, 136, 0, 0.8);
        border: 1px solid #ff8800;
    }

    &.cooperate {
        background-image: url("../images/icon_logo.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 88%;
    }

    &.outreach {
        background-image: url("../images/icon-outreach.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 12px;
    }
}

.markHover {
    transition: all 0.2s ease-in;

    &:hover {
        background-color: rgba(255, 136, 0, 0.8);
        border: 1px solid #ff8800;
    }
}

.card-label {
    width: 100%;
    text-align: center;
    border-radius: 0 0 4px 4px;
}
</style>
