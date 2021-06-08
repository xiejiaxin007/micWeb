<template>
    <div class="map-container">
        <div id="cutout-map"></div>
        <div class="ceng">
            {{zoom}}
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import html2canvas from 'html2canvas';
    import Canvg from 'canvg';
    import { cutoutIndex } from '../api/cutoutMapApi';
    export default {
        name: 'cutout-bmap',
        props: {
            // 过滤条件
            filters: {
                type: Object,
                default: function() {
                    return {
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
                    };
                }
            },
            // 定位经纬度 楼盘id
            location: {
                type: Object,
                default: function() {
                    return {
                        id: '',
                        lng: '',
                        lat: ''
                    };
                }
            },
            // 展示第几步
            showPage: {
                type: String,
                default: function() {
                    return '1';
                }
            },
            // 首次加载右侧
            isInit: {
                type: Boolean,
                default: function() {
                    return false;
                }
            }
        },
        data() {
            return {
                // 地图实例
                map: null,
                zoom: 14,
                city: '上海',
                // 楼盘列表 mark
                allNewHouse: new Map(),
                // 移动后的数据
                moveData: new Map(),
                // 地图id
                mapId: '',
                // 城市名字
                cityName: '',
                // 渲染最后一次时间戳
                randerTime: '',
                // 存储地图偏移量
                storageMapOffset: {
                    x: 0,
                    y: 0
                },
                // 是否开启拖拽
                isMove: false,
                // 首次加载地图的东北角
                ne: null,
                // 判断地图覆盖物是否渲染完成
                num: 0,
                // 定位点id
                locationId: '',
                // 正在导出
                isExport: false,
                // 保存重复提交
                saveFlag: true,
                // 判断是否最后一次的请求渲染
                isInitMark: false
            };
        },
        created() {
            this.mapId = this.$route.query.mapId;
            this.cityName = this.$route.query.cityName;
        },
        mounted() {
            this.map = new BMap.Map('cutout-map', {
                minZoom: 9,
                maxZoom: 18,
                enableMapClick: false
            });
            // 暴露方法，告诉父组件加载完成
            this.$emit('load');
            this.init();
        },
        methods: {
            // 初始化显示地图
            init() {
                this.map.centerAndZoom(this.cityName, this.zoom);
                // 禁止改变层级
                this.map.disableScrollWheelZoom();
                this.map.disableDoubleClickZoom();
                // 初始化获取地图东北角位置
                this.map.addEventListener('tilesloaded', () => {
                    // 每次拖拽都会产生新的东北角
                    let ne = this.map.getBounds().getNorthEast();
                    let oldPx = this.map.pointToPixel(this.ne);
                    let newPx = this.map.pointToPixel(ne);
                    this.storageMapOffset.x = oldPx.x - newPx.x;
                    this.storageMapOffset.y = oldPx.y - newPx.y;
                    if (!this.isExport && this.isInit) {
                        this.initMark(this.getRect());
                    }
                });
                this.map.addEventListener('zoomend', () => {
                    this.zoom = this.map.getZoom();
                    // 首次加载的东北角
                    this.ne = this.map.getBounds().getNorthEast();
                });
            },
            /**
             * @description: 初始化楼盘 筛选楼盘
             * @param {objetc} rect 可视区域四个点坐标
             * @param {func} fn 回调函数
             */
            async initMark(rect, fn) {
                try {
                    // let rect = this.getRect();
                    // 清空本地缓存数据
                    let filters = this.filters;
                    // 请求时间戳
                    let moveTime = new Date().getTime();
                    this.randerTime = moveTime;
                    let params = {
                        map_id: this.mapId,
                        min_lat: rect.minLat,
                        max_lat: rect.maxLat,
                        min_lng: rect.minLng,
                        max_lng: rect.maxLng,
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
                        show_acreage: filters.showAcreage,
                        move_time: moveTime
                    };
                    // 控制相应mapload
                    let { data } = await cutoutIndex.initMap(params);
                    this.isInitMark = this.randerTime + '' === data.data.searchData.move_time;
                    if (data.code === 0 && this.randerTime + '' === data.data.searchData.move_time) {
                        this.num = data.data.projectData.length;
                        // 清除覆盖物 存储数据
                        this.map.clearOverlays();
                        this.allNewHouse.clear();
                        data.data.projectData.forEach(item => {
                            let obj = {
                                id: item.project_id,
                                name: item.name,
                                status: item.status,
                                projectType: item.project_type,
                                acreageMin: item.acreage_min,
                                acreageMax: item.acreage_max,
                                priceMin: item.price_min,
                                priceMax: item.price_max,
                                offerPrice: item.offer_price,
                                showProjectType: item.show_project_type,
                                showPrice: item.show_price,
                                showAcreage: item.show_acreage
                            };
                            // 判断是否移动过
                            if (item.old_lng && item.old_lat) {
                                obj.lng = parseFloat(item.old_lng);
                                obj.lat = parseFloat(item.old_lat);
                                obj.newlng = parseFloat(item.lng);
                                obj.newlat = parseFloat(item.lat);
                            } else {
                                obj.lng = parseFloat(item.lng);
                                obj.lat = parseFloat(item.lat);
                                obj.newlng = '';
                                obj.newlat = '';
                            }
                            // 如果有移动后的数据渲染移动后的， 无则渲染原有数据
                            if (this.moveData.has('build_' + obj.id)) {
                                let moveObj = this.moveData.get('build_' + obj.id);
                                this.allNewHouse.set('build_' + obj.id, this.addMark(moveObj, fn));
                            } else {
                                this.allNewHouse.set('build_' + obj.id, this.addMark(obj, fn));
                            }
                        });
                        if (!data.data.projectData.length) {
                            this.allNewHouse.set('build_', this.addMark({}, fn));
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            // 获取当前地图四个角经纬度
            getRect() {
                let b = this.map.getBounds();
                let sw = b.getSouthWest();
                let ne = b.getNorthEast();
                return {
                    minLng: sw ? sw.lng : '',
                    maxLng: ne ? ne.lng : '',
                    minLat: sw ? sw.lat : '',
                    maxLat: ne ? ne.lat : ''
                };
            },
            /**
             * @description:
             * @param {object} obj 组装楼盘数据
             * @param {function} fn 回调函数
             */
            addMark(obj, fn) {
                let isNew = false;
                // 判断是否为拖拽之后的
                if (obj.newlng && obj.newlat) {
                    isNew = true;
                    // Polyline
                    this.addPolyline(obj);
                }
                let point = new BMap.Point(obj.lng, obj.lat);
                let newPoint = new BMap.Point(obj.newlng, obj.newlat);
                // 处理价格展示
                let price = '';
                if (obj.showPrice === '2') {
                    if (obj.offerPrice === '') {
                        price = '待定';
                    } else {
                        price = (obj.offerPrice / 10000).toFixed(2) + '万/㎡';
                    }
                } else if (obj.showPrice === '3') {
                    if (obj.priceMin * 1 === 0 && obj.priceMax * 1 === 0) {
                        price = '待定';
                    } else if (obj.priceMin === obj.priceMax) {
                        price = `${parseInt(obj.priceMin / 10000)}万`;
                    } else {
                        price = `${parseInt(obj.priceMin / 10000)} - ${parseInt(obj.priceMax / 10000)}万`;
                    }
                }
                let projectType = '';
                switch (obj.projectType) {
                    case '1':
                        projectType = '宅';
                        break;
                    case '2':
                        projectType = '墅';
                        break;
                    case '3':
                    case '55':
                        projectType = '商';
                        break;
                    default:
                        projectType = '商';
                        break;
                }
                // 控制业态 面积 价格展示
                let showProjectType = obj.showProjectType === '1' ? 'hide' : 'show';
                let showPrice = obj.showPrice === '1' ? 'hide' : 'show';
                let showAcreage = obj.showAcreage === '1' ? 'hide' : 'show';
                // 定位点高亮
                let location = this.locationId === obj.id ? 'location' : '';
                let content = `
                            <div class="houseMark ${isNew ? 'newHouse' : 'oldHouse'} houseMark${obj.status} ${location}">
                                <div class="mark-container">
                                    <div class="house-flex ${obj.showProjectType === '1' ? '' : 'max-name'}">
                                        <span class="house-name">
                                            ${obj.name}
                                        </span>
                                        <span class="house-ye ${showProjectType}">
                                            ${projectType}
                                        </span>
                                    </div>
                                    <div class="house-info ${showPrice === 'hide' && showAcreage === 'hide' ? 'hide' : ''}">
                                        <span class="house-acreage ${showAcreage}">
                                            ${obj.acreageMin ? parseInt(obj.acreageMin) : '0'}
                                            -
                                            ${obj.acreageMax ? parseInt(obj.acreageMax) : '0'}㎡
                                        </span>
                                        <span class="house-price ${showPrice}">
                                            ${price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                             `;
                let mark = new BMap.Label(content, {
                    offset: new BMap.Size(-6, -6),
                    position: isNew ? newPoint : point
                });
                mark.setStyle({
                    border: 'none',
                    backgroundColor: 'transparent'
                });
                if (this.locationId === obj.id) {
                    mark.setZIndex(99);
                } else {
                    mark.setZIndex(9);
                }
                obj.mark = mark;
                this.map.addOverlay(obj.mark);
                if (isNew) {
                    // 拖拽后的原点
                    let spotContent = `<div class="houseMark houseMark${obj.status} ${location}"></div>`;
                    let spotMark = new BMap.Label(spotContent, {
                        offset: new BMap.Size(-6, -6),
                        position: point
                    });
                    spotMark.setStyle({
                        border: 'none',
                        backgroundColor: 'transparent'
                    });
                    spotMark.setZIndex(8);
                    this.map.addOverlay(spotMark);
                    obj.spotMark = spotMark;
                }
                this.num--;
                // 判断覆盖物加载完毕 回调导出地图
                if ((this.num === 0 || this.num == -1) && fn) {
                    setTimeout(() => {
                        fn();
                    }, 200);
                }
                // 拖拽事件
                obj.mark.addEventListener('mousedown', e => {
                    let tLeft,
                        tTop,
                        stop = false;
                    // 判断为第二步可以拖拽
                    if (!this.isMove) {
                        return;
                    }
                    stop = true;
                    this.map.disableDragging();
                    // 递归获取支持的外层元素
                    let ele = this.getElement(e.domEvent.target, 'houseMark');
                    let moveElemRect = ele.getBoundingClientRect();
                    // 鼠标按下时和选中元素的坐标偏移:x坐标
                    tLeft = e.clientX - moveElemRect.left;
                    // 鼠标按下时和选中元素的坐标偏移:y坐标
                    tTop = e.clientY - moveElemRect.top;
                    document.onmousemove = event => {
                        if (stop) {
                            let moveX = event.clientX - tLeft,
                                moveY = event.clientY - tTop;
                            obj.mark.setStyle({
                                left: moveX - this.storageMapOffset.x + 'px',
                                top: moveY - this.storageMapOffset.y + 'px'
                            });
                            // 移动后的经纬度
                            let Point = this.map.pixelToPoint({
                                x: moveX,
                                y: moveY
                            });
                            obj.newlng = Point.lng;
                            obj.newlat = Point.lat;
                        }
                    };
                    document.onmouseup = () => {
                        if (stop) {
                            if (obj.mark) {
                                this.map.removeOverlay(obj.mark);
                            }
                            if (obj.spotMark) {
                                this.map.removeOverlay(obj.spotMark);
                            }
                            // 缓存移动后 无保存后台的数据
                            this.moveData.set('build_' + obj.id, this.addMark(obj));
                            // this.allNewHouse.set('build_' + obj.id, this.addMark(obj));
                            // this.saveMove(obj);
                        }
                        stop = false;
                        // 开启地图拖拽
                        this.map.enableDragging();
                        obj.mark.removeEventListener('mousedown');
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                });
                return obj;
            },
            /**
             * @description: 注册polyline 移动后的连接线
             * @param {object} obj 组装楼盘obj对象
             */
            addPolyline(obj) {
                if (obj.polyLine) {
                    this.map.removeOverlay(obj.polyLine);
                }
                if (obj.newlng) {
                    let oldPoint = new BMap.Point(obj.lng, obj.lat);
                    let newPoint = new BMap.Point(obj.newlng, obj.newlat);
                    let color = '';
                    if (obj.status === '1' || obj.status === '4') {
                        // 蓝色
                        color = '#3497FC';
                    } else if (obj.status === '2') {
                        // 绿色
                        color = '#00CE7F';
                    } else if (obj.status === '3') {
                        // 灰色
                        color = '#7E8A98';
                    }
                    let polyLine = new BMap.Polyline([oldPoint, newPoint], {
                        strokeWeight: 3,
                        strokeColor: color,
                        strokeStyle: 'dashed'
                    });
                    obj.polyLine = polyLine;
                    this.map.addOverlay(polyLine);
                }
            },
            // 保存地图存储数据
            async saveMove() {
                try {
                    let filters = this.filters;
                    let arr = [];
                    // 移动后的经纬度
                    this.moveData.forEach(v => {
                        let obj = {
                            project_id: v.id,
                            lat: v.newlat,
                            lng: v.newlng
                        };
                        arr.push(obj);
                    });
                    let params = {
                        map_id: this.mapId,
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
                        show_acreage: filters.showAcreage,
                        move_project_data: arr
                    };
                    if (this.saveFlag) {
                        this.saveFlag = false;
                        let { data } = await cutoutIndex.saveMap(params);
                        this.saveFlag = true;
                        if (data.code === 0) {
                            this.moveData.clear();
                            return true;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            /** 根据class获取指定的元素
             * @param {element} ele 点击事件的节点
             * @param {string} cla 指定class名字
             */
            getElement(ele, cla) {
                if (ele.classList && Array.from(ele.classList).includes(cla)) {
                    return ele;
                } else {
                    return this.getElement(ele.parentElement, cla);
                }
            },
            exportMap() {
                this.locationId = '';
                this.start(this.cityName);
            },
            // svg转换成canvas
            async svgToCanvas(fn) {
                try {
                    let map = document.getElementById('cutout-map');
                    // 复制一个svgDom
                    let svg = map.querySelector('svg').cloneNode(true);
                    let parentNode = map.querySelector('svg').parentNode;

                    // 移除原有canvas
                    let removeCancas = parentNode.querySelector('canvas');
                    if (removeCancas) {
                        parentNode.removeChild(removeCancas);
                    }
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    svg.style.left = '0px';
                    svg.style.top = '0px';
                    svg.removeAttribute('x');
                    svg.removeAttribute('y');
                    svg.setAttribute('viewBox',`${-svg.style.width.split('px')[0]/2} ${-svg.style.height.split('px')[0]/2} ${svg.style.width.split('px')[0]} ${svg.style.height.split('px')[0]}`);
                    const v = await Canvg.fromString(ctx, svg.outerHTML.trim());
                    await v.start();
                    canvas.style.position = 'absolute';
                    canvas.style.left = `${-svg.style.width.split('px')[0]/2}px`;
                    canvas.style.top = `${-svg.style.height.split('px')[0]/2}px`;
                    parentNode.appendChild(canvas);
                    fn();
                    
                } catch (e) {
                    console.log(e);
                }
            },
            /**
             * @description: 导出地图
             * @param {string} city 城市名字
             * @param {number} xY 导出图片的宽高
             */
            start(city, xY) {
                this.$emit('mapLoadEvent', {
                    status: true,
                    text: '正在导出，请稍等！'
                });
                let _this = this;
                this.isExport = true;
                let map_wrap = document.querySelector('.map-container');
                let map = document.getElementById('cutout-map');
                let img_list = map.children[0].children[2].firstElementChild.getElementsByTagName('img');
                for (let item of img_list) {
                    item.setAttribute('crossorigin', 'anonymous');
                }
                let map_vue = map_wrap.__vue__.map;
                let _zoom;
                let x_y;
                let boundary = new BMap.Boundary();
                boundary.get(city, result => {
                    let boundaryPoints = '';
                    boundaryPoints = result.boundaries.join(';');
                    let p = new BMap.Polygon(boundaryPoints);
                    let bounds = p.getBounds();
                    let sw = bounds.getSouthWest();
                    let ne = bounds.getNorthEast();
                    // 当前城市最大的
                    let rect = {
                        minLng: sw ? sw.lng : '',
                        maxLng: ne ? ne.lng : '',
                        minLat: sw ? sw.lat : '',
                        maxLat: ne ? ne.lat : ''
                    };
                    let sw_px = map_vue.pointToPixel(sw);
                    let ne_px = map_vue.pointToPixel(ne);
                    let w = ne_px.x - sw_px.x;
                    let h = sw_px.y - ne_px.y;
                    let center_point = map_vue.pixelToPoint({
                        x: sw_px.x + w / 2,
                        y: ne_px.y + h / 2
                    });
                    x_y = w > h ? w : h;
                    if (xY) {
                        x_y = xY;
                    } else {
                        x_y = x_y > 15384 ? 15384 : x_y;
                        // x_y = 8000;
                    }
                    map.style.width = x_y + 'px';
                    map.style.height = x_y + 'px';
                    // 先加载覆盖物， 覆盖物全部加载完成导出地图
                    let isLoaded = false;
                    map_vue.addEventListener('tilesloaded', () => {
                        isLoaded = true;
                        // _this.initMark(
                        //     {
                        //         minLng: '',
                        //         maxLng: '',
                        //         minLat: '',
                        //         maxLat: ''
                        //     },
                        //     () => {
                        //         if (_this.isInitMark) {
                        //             this.svgToCanvas(() => {
                        //                 setTimeout(() => {
                        //                     this.$nextTick(() => {
                        //                         map_load();
                        //                     });
                        //                 }, 3000);
                        //             });
                        //         }
                        //     }
                        // );
                    });

                    setTimeout(() => {
                        map_vue.setCenter(center_point);
                    }, 200);
                    _this.initMark(rect, () => {
                        setTimeout(() => {
                            map_vue.setCenter(center_point);
                            this.svgToCanvas(() => {
                                setTimeout(() => {
                                    this.$nextTick(() => {
                                        if (isLoaded) {
                                            map_load();
                                        } else {
                                            map_vue.addEventListener('tilesloaded', map_load);
                                        }
                                    });
                                }, 3000);
                            });
                        }, 200);
                    });
                });

                function map_load() {
                    html2canvas(map, {
                        allowTaint: true,
                        useCORS: true,
                        scale: 1
                    }).then(canvas => {
                        map_vue.removeEventListener('tilesloaded', map_load);
                        _zoom = map_vue.getZoom();
                        let imgUrl = canvas.toDataURL();
                        // map_vue.reset();
                        // _this.map.centerAndZoom(this.cityName, this.zoom);
                        _this.storageMapOffset.x = 0;
                        _this.storageMapOffset.y = 0;
                        downloadFile(city + '|' + 'Z_' + _zoom + '|' + x_y + '*' + x_y + '|' + new Date().getTime() + '.jpeg', imgUrl);
                        window.location.reload();
                    });
                }

                //下载
                function downloadFile(fileName, content) {
                    let aLink = document.createElement('a');
                    let blob = base64ToBlob(content); //new Blob([content]);
                    let evt = document.createEvent('HTMLEvents');
                    evt.initEvent('click', true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                    aLink.download = fileName;
                    aLink.href = URL.createObjectURL(blob);
                    // aLink.dispatchEvent(evt);
                    //aLink.click()
                    aLink.dispatchEvent(
                        new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        })
                    ); //兼容火狐

                    _this.$emit('mapLoadEvent', {
                        status: false,
                        text: '正在加载，请稍等！'
                    });
                }
                //base64转blob
                function base64ToBlob(code) {
                    try {
                        let parts = code.split(';base64,');
                        let contentType = parts[0].split(':')[1];
                        let raw = window.atob(parts[1]);
                        let rawLength = raw.length;

                        let uInt8Array = new Uint8Array(rawLength);

                        for (let i = 0; i < rawLength; ++i) {
                            uInt8Array[i] = raw.charCodeAt(i);
                        }
                        return new Blob([uInt8Array], {
                            type: contentType
                        });
                    } catch (e) {
                        // 解析canvas失败，继续递减导出
                        return _this.start(_this.cityName, x_y - 500);
                    }
                }
            },
            // 设置定位
            setLocation() {
                let val = this.location;
                if (val.lng !== '' && val.lat !== '') {
                    this.locationId = val.id;
                    let point = new BMap.Point(parseFloat(val.lng), parseFloat(val.lat));
                    // 判断是否有移动后的新点
                    let houseItem;
                    if (this.allNewHouse.has('build_' + val.id)) {
                        houseItem = this.allNewHouse.get('build_' + val.id);
                        if (houseItem.newlng && houseItem.newlat) {
                            point = new BMap.Point(parseFloat(houseItem.newlng), parseFloat(houseItem.newlat));
                        }
                    }
                    this.map.setViewport({
                        center: point,
                        zoom: 14
                    });

                    this.initMark(this.getRect(), () => {
                        setTimeout(() => {
                            let map = document.getElementById('cutout-map');
                            let locatList = map.querySelectorAll('.location');
                            for (let i = 0; i < locatList.length; i++) {
                                let classVal = locatList[i].getAttribute('class');
                                classVal = classVal.replace('location', '');
                                locatList[i].setAttribute('class', classVal);
                                this.locationId = '';
                            }
                        }, 3500);
                    });
                }
            }
        },
        watch: {
            // 监听判读 是否可以移动
            showPage: function(val) {
                if (val === '3') {
                    this.isMove = true;
                } else {
                    this.isMove = false;
                }
            },
            // 监听右侧接口是否请求完毕
            isInit: function(val) {
                if (val) {
                    this.initMark(this.getRect());
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.map-container,
#cutout-map {
    position: relative;
    width: 100%;
    height: 100%;
}

.map-container {
    .ceng {
        position: fixed;
        z-index: 99;
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        text-align: center;
        line-height: 50px;
        left: 50px;
        bottom: 30px;
        font-weight: 600;
        font-size: 20px;
    }

    /deep/ .houseMark {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(0, 206, 127, 0.6);
        border: 1px solid rgba(0, 206, 127, 1);

        .mark-container {
            position: relative;
            padding: 6px 10px;
            background: #00ce7f;
            // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
            box-sizing: border-box;
            max-width: 174px;
            transform: translate(-50%, -100%);
            top: -8px;
            left: 50%;
            display: inline-block;
            border-radius: 4px;

            &::after {
                display: inline-block;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid #00ce7f;
                border-bottom: 6px solid transparent;
                content: '';
                width: 0;
                height: 0;
                position: absolute;
                left: 50%;
                top: 100%;
                transform: translateX(-50%);
            }

            .house-flex {
                display: flex;
                align-items: center;
            }
            .max-name {
                width: 129px;
                .house-name {
                    width: auto;
                    max-width: 96px;
                }
            }
            .house-ye {
                width: 17px;
                height: 17px;
                font-size: 12px;
                color: #00ce7f;
                background: #fff;
                text-align: center;
                margin-left: 6px;
                border-radius: 2px;
                position: relative;

                &::after {
                    display: inline-block;
                    border-left: 6px solid transparent;
                    border-right: 6px solid #fff;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    content: '';
                    width: 0;
                    height: 0;
                    position: absolute;
                    left: -9px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                &.hide{
                    display: none;
                }
            }

            .house-name {
                display: inline-block;
                width: 96px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #fff;
                font-size: 12px;
                border-radius: 4px;
            }

            .house-info {
                color: #fff;
                &.hide{
                    display: none;
                }
                .house-acreage {
                    display: inline-block;
                    width: 75px;
                }
                .house-price {
                    display: inline-block;
                    width: 75px;
                }
                .hide{
                    display: none;
                }
            }
        }

        // 未售 -- 蓝色
        &.houseMark1,
        &.houseMark4 {
            background: rgba(51, 161, 255, 0.6);
            border: 1px solid rgba(51, 161, 255, 1);

            .mark-container {
                background: #3497fc;

                // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
                &::after {
                    border-top: 6px solid #3497fc;
                }

                .house-ye {
                    color: #3497fc;
                }
            }
        }

        // 在售 -- 绿色
        // &.houseMark2 {
        // }
        // 售罄 -- 灰色
        &.houseMark3 {
            background: rgba(126, 138, 152, 0.6);
            border: 1px solid rgba(126, 138, 152, 1);

            .mark-container {
                background: #7e8a98;

                // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
                &::after {
                    border-top: 6px solid #7e8a98;
                }

                .house-ye {
                    color: #7e8a98;
                }
            }
        }
    }

    /deep/ .houseMark.newHouse {
        background-color: transparent;
        border: none;

        .mark-container {
            &::after {
                box-shadow: none;
            }
        }

        &.location {
            background-color: transparent;
            border: none;
        }
    }

    /deep/ .houseMark.location {
        background: rgba(255, 92, 71, 0.6);
        border: 1px solid rgba(255, 92, 71, 1);

        .mark-container {
            background: #ff5c47;

            &::after {
                border-top: 6px solid #ff5c47;
            }

            .house-ye {
                color: #ff5c47;
            }
        }
    }
}
</style>
