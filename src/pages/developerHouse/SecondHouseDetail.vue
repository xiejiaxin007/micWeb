<!--
    @name: 二手房源详情页
    @description: 二手房源详情页
    @author: 贺伟
    @date: 2020-04-23
-->
<template>
    <div class="house-detail-wrap" v-if="showPage">
        <div class="main-detail">
            <div class="top-nav" :style="topNavStyle">
                <!---面包屑--->
                <el-breadcrumb class="bread-crumb" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">
                        <i class="iconfont iconicon_zhoubianjiaotongx" aria-hidden="true"></i>
                        首页
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>二手房源</el-breadcrumb-item>
                    <el-breadcrumb-item>房源详情</el-breadcrumb-item>
                </el-breadcrumb>
                <!---模块导航--->
                <ul class="module-list module-nav">
                    <li
                        :class="{'nav-item': true, active: moduleIndex === idx}"
                        v-for="(item, idx) in moduleNames"
                        :key="idx"
                        @click="changeModule(idx)">
                        {{item}}
                    </li>
                </ul>
            </div>
            <!---小区常用信息--->
            <panel :title="mainInfo.title" ref="modules1">
                <div class="community-info">
                    <div class="info-hd">
                        <item-cell
                            title="所在城区："
                            :content="getAreaBissness"
                            className="info-item" />
                        <item-cell
                            title="房源编号："
                            :content="mainInfo.id"
                            className="info-item" />
                        <item-cell
                            title="房屋信息："
                            :content="mainInfo.house_info"
                            className="info-item" />
                        <item-cell
                            title=""
                            default-text=""
                            className="info-item" />
                    </div>
                    <div class="info-bd">
                        <div class="img-box" @click="viewPhoto(mainInfo.index_url)">
                            <img v-if="mainInfo.index_url" class="img-community" :src="mainInfo.index_url" alt="小区图片">
                            <img v-else  class="img-community" src="../../assets/images/defalut-bg.png" alt="小区图片">
                        </div>
                        <ul class="info-box">
                            <item-cell
                                title="总价："
                                :content="Number(mainInfo.total_price) && `${(mainInfo.total_price / 10000).toFixed(2)}万`"
                                className="info-item" />
                            <item-cell
                                title="单价："
                                :content="Number(mainInfo.unit_price) && `${mainInfo.unit_price} 元/㎡`"
                                className="info-item" />
                            <item-cell
                                title="房态："
                                :content="mainInfo.sales_text"
                                className="info-item" />
                            <item-cell
                                title="维护人："
                                :content="mainInfo.maintain_text"
                                className="info-item" />
                            <item-cell
                                title="户型："
                                :content="mainInfo.room_type_text"
                                className="info-item" />
                            <item-cell
                                title="面积："
                                :content="Number(mainInfo.build_acreage) && `${mainInfo.build_acreage}㎡`"
                                className="info-item" />
                            <item-cell
                                title="朝向："
                                :content="mainInfo.house_orientations"
                                className="info-item" />
                            <item-cell
                                title="楼层："
                                :content="`${mainInfo.height_type_text}/${mainInfo.total_floor_num}层`"
                                className="info-item" />
                            <item-cell
                                title="套内面积："
                                :content="Number(mainInfo.inside_acreage) && `${mainInfo.inside_acreage}㎡`"
                                className="info-item" />
                            <item-cell
                                title="挂牌时间："
                                :content="mainInfo.listing_date"
                                className="info-item" />
                            <item-cell
                                title="备件信息："
                                :content="mainInfo.is_certificate "
                                @click="changeModule(6)"
                                className="info-item" />
                            <item-cell
                                title="房源标题："
                                :content="mainInfo.title"
                                className="info-item long" />
                            <item-cell
                                title="房源标签："
                                :content="mainInfo.house_tags"
                                className="info-item long" />
                        </ul>
                    </div>
                </div>
            </panel>
            <!---经纪人点评--->
            <panel title="经纪人点评" ref="modules2">
                <ul class="comment-info">
                    <item-cell
                        title="核心卖点："
                        :content="agentCommentInfo.sell_point"
                        className="text-wrap"
                    />
                    <item-cell
                        title="小区介绍："
                        :content="agentCommentInfo.village_desc"
                        className="text-wrap"
                    />
                    <item-cell
                        title="户型介绍："
                        :content="agentCommentInfo.house_desc"
                        className="text-wrap"
                    />
                    <item-cell
                        title="周边配套："
                        :content="agentCommentInfo.near_matching"
                        className="text-wrap"
                    />
                </ul>
            </panel>
            <!---价格信息--->
            <panel title="价格信息" ref="modules3">
                <ul class="price-info">
                    <item-cell
                        title="是否唯一："
                        :content="priceInfo.is_only_text"
                        className="info-item" />
                    <item-cell
                        title="付款要求："
                        :content="priceInfo.payment"
                        className="info-item" />
                    <item-cell
                        title="是否限购："
                        :content="priceInfo.is_limit_pay_text"
                        className="info-item" />
                    <item-cell
                        title="原购价格："
                        :content="Number(priceInfo.original_price) && `${(priceInfo.original_price / 10000).toFixed(2)} 万`"
                        className="info-item" />
                    <item-cell
                        title="是否提供原始税票："
                        :content="priceInfo.is_receipt_text"
                        className="info-item" />
                    <item-cell
                        title="产证年限："
                        :content="priceInfo.house_year_text"
                        className="info-item" />
                </ul>
            </panel>
            <!---业主信息--->
            <panel title="业主信息" ref="modules4">
                <ul class="homeowner-info">
                    <item-cell
                        title="业主姓名："
                        :content="ownerInfo.name"
                        className="info-item" />
                    <item-cell
                        title="手机号码："
                        :content="ownerInfo.mobile"
                        className="info-item" />
                    <item-cell
                        title="微信号："
                        :content="ownerInfo.wechat_number"
                        className="info-item" />
                    <item-cell
                        title="座机号："
                        :content="ownerInfo.telephone"
                        className="info-item" />
                    <item-cell
                        title="婚姻状况："
                        :content="ownerInfo.marital_status_text"
                        className="info-item" />
                    <item-cell
                        title="手机号码2："
                        :content="ownerInfo.second_mobile"
                        className="info-item" />
                    <item-cell
                        title="售房原因："
                        :content="ownerInfo.selling_house_reasons"
                        className="info-item" />
                    <item-cell
                        title="户型改造情况："
                        :content="ownerInfo.house_type_transformation"
                        className="info-item" />
                    <item-cell
                        title="抵押情况："
                        :content="ownerInfo.mortgage_situation"
                        className="info-item" />
                    <item-cell
                        title="期望出售周期："
                        :content="ownerInfo.selling_cycle"
                        className="info-item" />
                    <item-cell
                        title="产权是否共有："
                        :content="ownerInfo.is_common_owership"
                        className="info-item" />
                    <item-cell
                        title=""
                        default-text=""
                        className="info-item" />
                    <item-cell
                        title="联系人姓名："
                        :content="ownerInfo.contact_name"
                        className="info-item" />
                    <item-cell
                        title="联系人号码："
                        :content="ownerInfo.contact_mobile"
                        className="info-item" />
                    <item-cell
                        title="联系人是否为业主："
                        :content="ownerInfo.is_owner_text"
                        className="info-item" />

                </ul>
            </panel>
            <!---特色信息--->
            <panel title="特色信息" ref="modules5">
                <div class="feature-info">
                    <item-cell
                        title="学区名额："
                        :content="specialInfo.school_quota"
                        className="info-item" />
                    <item-cell
                        title="装修情况："
                        :content="specialInfo.decoration_status_text"
                        className="info-item" />
                    <item-cell
                        title="有无车位："
                        :content="specialInfo.is_parking_text"
                        className="info-item" />
                    <item-cell
                        title="交房时间："
                        :content="specialInfo.living_date_text"
                        className="info-item" />
                    <item-cell
                        title="房屋格局："
                        :content="specialInfo.house_pattern"
                        className="info-item" />
                    <item-cell
                        title="装修日期："
                        :content="specialInfo.decoration_date_text"
                        className="info-item" />
                    <item-cell
                        title="赠送情况："
                        :content="specialInfo.presentation"
                        className="info-item" />
                    <item-cell
                        title="有无户口："
                        :content="specialInfo.is_household_text"
                        className="info-item" />
                </div>
            </panel>
            <!---基础信息--->
            <panel title="基础信息" ref="modules6">
                <div class="base-info">
                    <div class="community info">
                        <div class="title">小区信息</div>
                        <div class="content" v-if="baseInfo.village_info">
                            <item-cell
                                title="所在城区："
                                :content="baseInfo.village_info.district_text"
                                className="info-item" />
                            <item-cell
                                title="所属商圈："
                                :content="baseInfo.village_info.trade_area_text"
                                className="info-item" />
                            <item-cell
                                title="物业费："
                                :content="Number(baseInfo.village_info.property_fee) && `${baseInfo.village_info.property_fee} 元/月*平`"
                                className="info-item" />
                        </div>
                    </div>
                    <div class="building info">
                        <div class="title">建筑信息</div>
                        <div class="content" v-if="baseInfo.construction_info">
                            <item-cell
                                title="交易权属："
                                :content="baseInfo.construction_info.trading_ownership_text"
                                className="info-item" />
                            <item-cell
                                title="建筑结构："
                                :content="baseInfo.construction_info.building_structure_text"
                                className="info-item" />
                            <item-cell
                                title="产权年限："
                                :content="Number(baseInfo.construction_info.property_years) && `${baseInfo.construction_info.property_years} 年`"
                                className="info-item" />
                            <item-cell
                                title="梯户比例："
                                :content="baseInfo.construction_info.ladder_ratio"
                                className="info-item" />
                            <item-cell
                                title="房屋用途："
                                :content="baseInfo.construction_info.house_type_text"
                                className="info-item" />
                            <item-cell
                                title="建筑类型："
                                :content="baseInfo.construction_info.building_type_text"
                                className="info-item" />
                            <item-cell
                                title="建成年代："
                                :content="Number(baseInfo.construction_info.completion_age) && `${baseInfo.construction_info.completion_age} 年`"
                                className="info-item" />
                            <item-cell
                                title="凶宅信息："
                                :content="baseInfo.construction_info.house_information"
                                className="info-item" />
                            <item-cell
                                title="嫌恶设施："
                                :content="baseInfo.construction_info.loathing_settings"
                                className="info-item" />
                            <item-cell
                                title="有无电梯："
                                :content="baseInfo.construction_info.elevator_text"
                                className="info-item" />
                            <item-cell
                                title="开发公司："
                                :content="baseInfo.construction_info.developer_company"
                                className="info-item" />
                        </div>
                    </div>
                    <div class="life info">
                        <div class="title">生活信息</div>
                        <div class="content" v-if="baseInfo.life_info">
                            <item-cell
                                title="供暖类型："
                                :content="baseInfo.life_info.heating_type_text"
                                className="info-item" />
                            <item-cell
                                title="用电类型："
                                :content="baseInfo.life_info.power_type_text"
                                className="info-item" />
                            <item-cell
                                title="用水类型："
                                :content="baseInfo.life_info.water_type_text"
                                className="info-item" />
                            <item-cell
                                title="停车服务费："
                                :content="Number(baseInfo.life_info.parking_fee) && `${baseInfo.life_info.parking_fee} 元/月/位`"
                                className="info-item" />
                            <item-cell
                                title="供暖费用："
                                :content="Number(baseInfo.life_info.heating_cost) && `${baseInfo.life_info.heating_cost} 元/采暖季/㎡`"
                                className="info-item" />
                            <item-cell
                                title="车位比："
                                :content="baseInfo.life_info.parking_ratio"
                                className="info-item" />
                            <item-cell
                                title="地上车位数："
                                :content="Number(baseInfo.life_info.ground_passengers_num) && `${baseInfo.life_info.ground_passengers_num}个`"
                                className="info-item" />
                            <item-cell
                                title="地下车位数："
                                :content="Number(baseInfo.life_info.unground_passengers_num) && `${baseInfo.life_info.unground_passengers_num}个`"
                                className="info-item" />
                            <item-cell
                                title="是否有中水："
                                :content="baseInfo.life_info.is_reclaimed_water_text"
                                className="info-item" />
                            <item-cell
                                title="是否有热水："
                                :content="baseInfo.life_info.is_hot_water_text"
                                className="info-item" />
                            <item-cell
                                title="是否有燃气："
                                :content="baseInfo.life_info.is_gas_text"
                                className="info-item" />
                            <item-cell
                                title="小区幼儿园："
                                :content="baseInfo.life_info.is_nursery_school_text"
                                className="info-item" />
                            <item-cell
                                title="中水费："
                                :content="Number(baseInfo.life_info.reclaimed_water_fee) && `${baseInfo.life_info.reclaimed_water_fee} 元/吨`"
                                className="info-item" />
                            <item-cell
                                title="热水费："
                                :content="Number(baseInfo.life_info.hot_water_fee) && `${baseInfo.life_info.hot_water_fee} 元/吨`"
                                className="info-item" />
                            <item-cell
                                title="燃气费："
                                :content="Number(baseInfo.life_info.gas_fee) && `${baseInfo.life_info.gas_fee} 元/m³`"
                                className="info-item" />
                        </div>
                    </div>
                </div>
            </panel>
            <!---证件信息--->
            <panel title="证件信息" ref="modules7">
                <div class="certificate-info">
                    <item-cell
                        title="委托书："
                        :content="certificateInfo.letter_attorney && certificateInfo.letter_attorney.length > 0 ? '已上传' : '未上传'"
                        className="info-item" />
                    <item-cell
                        title="房产证："
                        :content="certificateInfo.certificate && certificateInfo.certificate.length > 0 ? '已上传' : '未上传'"
                        className="info-item" />
                </div>
            </panel>
            <!---视频信息--->
            <panel title="视频信息" ref="modules8">
                <div class="video-info">
                    <div class="info-item video">
                        <div class="label">视频：</div>
                        <div class="content">
                            <custom-video
                                v-if="videoInfo.source && videoInfo.source.file_url"
                                class="video"
                                :video-src="videoInfo.source && videoInfo.source.file_url"
                                :preview-img-url="videoInfo.video_header_url"
                            />
                        </div>
                    </div>
                    <div class="info-item prev-img">
                        <div class="label">视频首图：</div>
                        <div class="content img-box" @click="viewPhoto(videoInfo.video_header_url)">
                            <img v-if="videoInfo.video_header_url" class="img-preview" :src="videoInfo.video_header_url" alt="视频首图">
                        </div>
                    </div>
                </div>
            </panel>
            <!---图片信息--->
            <panel title="图片信息" ref="modules9">
                <ul class="img-info">
                    <li class="type-list" v-for="(item, index) in imgInfo" :key="index">
                        <div class="label">{{item.name}}：</div>
                        <div class="content scroll-wrap" ref="wrapper">
                            <ul class="img-wrap">
                                <li
                                    :class="{'img-item': true, 'is-first': item.is_index === '1'}"
                                    @click="previewPhoto(index, idx)"
                                    v-for="(imgs, idx) in item.values"
                                    :key="idx">
                                    <img :src="imgs.url" alt="室内图">
                                </li>
                            </ul>
                            <div class="prev arrow-box" @click="scrollBy(index, 'prev')" v-show="showScrollPrev[index]">
                                <i class="arrow-icon el-icon-arrow-left" aria-hidden="true"></i>
                            </div>
                            <div class="next arrow-box" @click="scrollBy(index, 'next')" v-show="showScrollNext[index]">
                                <i class="arrow-icon el-icon-arrow-right" aria-hidden="true"></i>
                            </div>
                        </div>
                    </li>
                </ul>
            </panel>
        </div>
        <photo-brower
            :photos="imgInfo"
            :slide-idx="curIdx"
            :simple-url="simpleUrl"
            :visible.sync="dialogVisible" />
    </div>
</template>

<script>
    import Panel from './components/Panel';
    import ItemCell from './components/ItemCell';
    import Bscroll from 'better-scroll';
    import PhotoBrower from './components/PhotoBrowerDialog';
    import CustomVideo from './components/CustomVideo';
    import api from './api/secondHouseDetail';
    const modules = ['常用信息', '经纪人点评', '价格信息', '业主信息', '特色信息', '基础信息', '证件信息', '视频信息', '图片信息'];
    export default {
        name: 'SecondHouseDetail',
        components: {
            Panel,
            ItemCell,
            PhotoBrower,
            CustomVideo
        },
        data() {
            return {
                // 模块名称信息
                moduleNames: modules,
                // 当前模块索引
                moduleIndex: 0,
                // 图片浏览弹窗
                dialogVisible: false,
                // 浏览图册图片所在索引数组 标识第几个图册的第几张图
                curIdx: [0, 0],
                // 浏览单张大图的url
                simpleUrl: '',
                // 是否显示左滑箭头
                showScrollPrev: [false, false, false, false],
                // 是否显示右滑箭头
                showScrollNext: [false, false, false, false],
                mainInfo: {},
                agentCommentInfo: {},
                priceInfo: {},
                ownerInfo: {},
                specialInfo: {},
                baseInfo: {},
                certificateInfo: {},
                videoInfo: {},
                imgInfo: [],
                showPage: false,
                // 顶部栏动态样式
                topNavStyle: {}
            }
        },
        created() {
            this.getHouseDetailInfo();
        },
        computed: {
            // 拼接城区字段
            getAreaBissness() {
                const info = this.mainInfo;
                if (JSON.stringify(info) === '{}') {
                    return '';
                }
                return info.trade_area_text ? `${info.district_text}-${info.trade_area_text}` : info.district_text;
            }
        },
        methods: {
            // 初始化相册better-scroll
            initPhotoScroll() {
                // 初始化图册所在scroll实例
                const photosLens = this.imgInfo.length;
                for (let i = 0; i < photosLens; i++) {
                    this['scroll' + i] = new Bscroll(this.$refs.wrapper[i], {
                        scrollX: true,
                        probeType: 2
                    });
                    const { scrollerWidth, wrapperWidth } = this['scroll' + i];
                    if (scrollerWidth > wrapperWidth) {
                        this.showScrollNext.splice(i, 1, true);
                    }
                    this['scroll' + i].on('scroll', () => {
                        this.scrollEnd(i)
                    });
                }
            },
            // 初始化模块的offsetTop值
            initModuleTops() {
                // 获取模块对应的 offsetTop  将值存到数组中
                this.offsetTops = modules.map((ele, idx) => {
                    const element = this.$refs['modules' + (idx + 1)].$el;
                    const offsetTop = element.offsetTop;
                    return offsetTop;
                })
            },
            // 根据房源id获取房源详情数据信息
            async getHouseDetailInfo() {
                try {
                    const options = {
                        house_id: this.$route.query.houseId || 33
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await api.getHouseDetailData(options);
                    if (code === 0) {
                        this.mainInfo = data.main_info;
                        this.agentCommentInfo = data.agent_comment_info;
                        this.priceInfo = data.price_info;
                        this.ownerInfo = data.owner_info;
                        this.specialInfo = data.special_info;
                        this.baseInfo = data.base_info;
                        this.certificateInfo = data.certificate_info;
                        this.videoInfo = data.video_info;
                        this.imgInfo = data.img_info;
                        this.showPage = true;
                        // 页面渲染后初始化相关模块
                        this.$nextTick(() => {
                            this.initPhotoScroll();
                            this.initModuleTops();
                            window.addEventListener('scroll', this.handleScroll);
                            // 动态获取导航栏高度
                            this.topNavStyle = {
                                top: `${document.querySelector('.menu-container').clientHeight}px`
                            };
                        });
                    } else {
                        this.showPage = false;
                    }
                } catch (error) {
                    this.showPage = false;
                    console.log(error);
                }
            },
            /**
             * 切换顶部模块
             * @param {Boolean} index 点击的模块索引
             */
            changeModule(index) {
                this.moduleIndex = index;
                const ele = this.$refs['modules' + (index + 1)].$el;
                this.scrollToEle(ele);
            },
            /**
             * 浏览大图
             * @param {Number} index 图册所在索引
             * @param {Number} imgIndex 图片所在图册的索引
             */
            previewPhoto(index, imgIndex) {
                this.simpleUrl = '';
                this.curIdx = [index, imgIndex];
                this.dialogVisible = true;
            },
            /**
             * 查看大图
             * @param {String} url 图片地址
             */
            viewPhoto(url) {
                if (!url) {
                    return;
                }
                this.simpleUrl = url;
                this.dialogVisible = true;
            },
            /**
             * 滚动
             */
            scrollBy(idx, direction) {
                if (direction === 'prev') {
                    this['scroll' + idx].scrollBy(80, 0, 300);
                } else if (direction === 'next') {
                    this['scroll' + idx].scrollBy(-80, 0, 300);
                }
            },
            scrollEnd(idx) {
                const {
                    startX,
                    maxScrollX
                } = this['scroll' + idx];
                if (startX < 0) {
                    !this.showScrollPrev[idx] && this.showScrollPrev.splice(idx, 1, true);
                } else {
                    this.showScrollPrev[idx] && this.showScrollPrev.splice(idx, 1, false);
                }
                if (Math.abs(startX) >= Math.abs(maxScrollX)) {
                   this.showScrollNext[idx] && this.showScrollNext.splice(idx, 1, false);
                } else {
                    !this.showScrollNext[idx] && this.showScrollNext.splice(idx, 1, true);
                }
            },
            // 滚动监听
            handleScroll({target}) {
                const scrollTop = target.documentElement.scrollTop + 208;
                // 匹配的范围
                const range = 40;
                const maxTop = scrollTop + range;
                const minTop = scrollTop - range;
                // 如果当前的滚动值在对应的加减40的范围内 则顶部对应的模块选中
                this.offsetTops.find((top, index) => {
                    if (top <= maxTop && top >= minTop) {
                        // 选中顶部对应的模块
                        this.moduleIndex = index;
                        return true;
                    }
                });
            },
            // 滚动到对应模块
            scrollToEle(ele) {
                const offsetTop = ele.offsetTop;
                // 需要滚动的至为对应的top减去顶部的值
                const actualTop = offsetTop - 208;
                document.documentElement.scrollTop = actualTop;
            }
        }
    }
</script>

<style lang="less" scoped>
    @theme-blue: #00C0EB;
    .house-detail-wrap {
        padding: 0 104px;
        background-color: #f0f4f9;
        font-size: 14px;
        * {
            box-sizing: border-box;
        }
    }
    .top-nav {
        position: sticky;
        //top: 113px;
        z-index: 3;
        background-color: #f0f4f9;
    }
    .el-breadcrumb.bread-crumb {
        padding: 10px 0;
        .iconicon_zhoubianjiaotongx {
            font-size: 14px;
        }
        /deep/ .el-breadcrumb__inner {
            color: #bcbcbc;
            font-weight: normal;
        }
        /deep/ .el-breadcrumb__separator {
            margin: 0;
        }
    }
    .module-nav {
        display: flex;
        padding-bottom: 16px;
        /* position: sticky;
        top: 112px;
        z-index: 3; */
        background-color: #f0f4f9;
    }
    .panel-wrap {
        margin-bottom: 16px;
    }
    .nav-item {
        position: relative;
        flex: 1;
        text-align: center;
        background-color: #fff;
        border-radius: 4px;
        height: 40px;
        line-height: 40px;
        color: #d1d2db;
        cursor: pointer;
        &.active {
            background-color: @theme-blue;
            color: #fff;
            &::after {
                content: '';
                position: absolute;
                bottom: -16px;
                left: 50%;
                margin-left: -8px;
                z-index: 2;
                width: 0;
                height: 0;
                border-width: 8px;
                border-style: solid;
                border-color: transparent;
                border-top-color: @theme-blue;
            }
        }
        &:hover {
            opacity: 0.8;
        }
        &:not(:last-child) {
            margin-right: 10px;
        }
    }
    .community-info {
        padding: 0 24px;
        .info-hd {
            display: flex;
            margin-bottom: 16px;
            .info-item {
                flex: 1;
            }
        }
        .info-bd {
            display: flex;
        }
        .img-box {
            width: 254px;
            height: 190px;
            border-radius: 4px;
            overflow: hidden;
        }
        .img-community {
            width: 100%;
            height: 100%;
            cursor: pointer;
            object-fit: cover;
        }
        .info-box {
            flex: 1;
            margin: 0 4px 0 6px;
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;
            .info-item {
                width: calc(25% - 10px);
                margin-left: 10px;
                height:40px;
                background-color: #f6f8fc;
                border-radius: 2px;
                padding: 10px;
                &.long {
                    width: calc(50% - 10px);
                }
                /* .label {
                    font-weight: bold;
                    color: #424242;
                    line-height: 20px;
                }
                .text {
                    color: #797979;
                    line-height: 20px;
                    margin-left: 9px;
                } */
            }
        }
    }
    .comment-info {
        padding: 0 24px;
        .text-wrap {
            /deep/ .cell-content{
                white-space: inherit;
            }
            &:not(:last-child) {
                margin-bottom: 16px;
            }
        }
    }
    .price-info, .homeowner-info, .feature-info, .certificate-info {
        padding: 0 24px;
        margin-bottom: -16px;
        display: flex;
        flex-wrap: wrap;
        .info-item {
            width: 25%;
            padding-right: 10px;
            margin-bottom: 16px;
        }
    }
    .base-info {
        padding: 0 24px;
        margin-bottom: -14px;
        .info {
            margin-bottom: 14px;
            .title {
                color: #d1d2db;
                font-weight: bold;
            }
            .content {
                display: flex;
                flex-wrap: wrap;
            }
            .info-item {
                width: 25%;
                padding-right: 10px;
                margin-top: 16px;
            }
        }
    }
    .video-info {
        padding: 0 24px;
        display: flex;
        .info-item {
            display: flex;
            margin-right: 30px;
        }
        .content {
            width: 160px;
            height: 90px;
            border-radius: 4px;
            overflow: hidden;
            margin-left: 22px;
            &.img-box {
                cursor: pointer;
            }
            .img-preview, .video {
                width: 100%;
                height: 100%;
            }
        }
    }
    .img-info {
        padding: 0 24px;
        .type-list {
            display: flex;
            &:not(:last-child) {
                margin-bottom: 24px;
            }
            .label {
                width: 74px;
                font-size: 14px;
                color: #424242;
                font-weight: bold;
            }
            .content {
                position: relative;
                margin-left: 8px;
                width: calc(100% - 56px);
                overflow: hidden;
               .img-wrap {
                   // display: flex;
                   white-space: nowrap;
                   display: inline-block;
                   font-size: 0;
                   -webkit-text-size-adjust: none;
               }
               .arrow-box {
                    position: absolute;
                    top: 38px;
                    width: 24px;
                    height: 44px;
                    background-color: rgba(0,0,0,.4);
                    text-align: center;
                    z-index: 3;
                    cursor: pointer;
                    &:hover {
                        background-color: rgba(0,0,0,.8);
                    }
                    &.prev {
                        border-radius:0 4px 4px 0px;
                        left: 0;
                    }
                    &.next {
                        border-radius:4px 0px 0px 4px;
                        right: 0;
                    }
                    .arrow-icon {
                        font-size: 12px;
                        font-weight: bold;
                        color: #fff;
                        line-height: 44px;
                    }
               }
            }
            .img-item {
                position: relative;
                width: 160px;
                height: 120px;
                border-radius: 4px;
                overflow: hidden;
                display: inline-block;
                font-size: 14px;
                cursor: pointer;
                &.is-first::before {
                    content: '首图';
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                    width: 44px;
                    height: 24px;
                    background:@theme-blue;
                    border-radius:4px 0px 4px 0px;
                    font-size: 12px;
                    font-weight: bold;
                    color: #fff;
                    line-height: 24px;
                    text-align: center;
                }
                &:not(:first-child) {
                    margin-left: 24px;
                }
                > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
</style>
