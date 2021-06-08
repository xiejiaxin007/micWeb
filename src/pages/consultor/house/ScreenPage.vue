<!--
    @name: 北斗计划地图父级页面
    @description: 包括地图组件、详情、悬浮层，左侧筛选使用中文匹配，不要随意修改
    @author: wangshuaixue
    @date: 2019
-->
<template>
    <div class="search-container">
        <div class="left-wrap">
            <div
                class="left-shadow"
                v-if="shadowOpen"
                @click="editShadow"
            ></div>
            <div class="left-inner">
                <div class="filter-box check-city">
                    <div class="choice-city">
                        <div
                            class="choice-city-inner"
                            @click="checkCityPop">
                            <img
                                class="local-city"
                                src="./images/local-city.png"
                                alt="城市坐标"/>
                            <span class="city-name-con">
                                {{cityCon.currentCityVirName.split(',').join('/')}}
                            </span>
                            <img
                                :class="`pull-city ${unfoldCity ? 'trans-img' : '' }`"
                                src="./images/icon-pull-down.png"
                                alt="城市下拉"/>
                        </div>
                    </div>
                    <div
                        class="city-group-list"
                        v-show="unfoldCity">
                        <ul class="major-con">
                            <li
                                v-for="(item, index) in cityTotal"
                                :key="index+'main'"
                                :class="`${item.scrollFlag ? 'current-major-active' : ''}`"
                                class="major-city">
                                <span
                                    :title="item.text"
                                    class="check-btn">
                                    <el-checkbox
                                        v-model="item.state"
                                        @change="changeCityId(item, item.id, 0)"
                                    >{{item.text}}</el-checkbox>
                                    <span
                                        class="check-aff-city"
                                        @click="item.isOpen = !item.isOpen">
                                        <img
                                            v-if="!item.isOpen && item.sub && item.sub.length>0"
                                            src="./images/icon-strong-down.png"
                                            alt="副城展开"/>
                                        <img
                                            v-if="item.isOpen && item.sub && item.sub.length>0"
                                            src="./images/icon-strong-up.png"
                                            alt="副城收起"/>
                                    </span>
                                </span>
                                <ul
                                    v-show="item.sub && item.sub.length>0 && item.isOpen"
                                    class="subsidiary-con">
                                    <li
                                        v-for="(subCity, subInd) in item.sub"
                                        :key="subInd+'sub'"
                                        class="sub-city">
                                        <span class="check-btn">
                                            <el-checkbox
                                                v-model="subCity.state"
                                                @change="changeCityId(subCity, item.id, 1)"
                                            >{{subCity.text}}</el-checkbox>
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeCityPop(0)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="closeCityPop(1)"
                            >确定</span>
                        </div>
                    </div>
                </div>
                <div
                    :class="'filter-box filter-block'+index"
                    v-for="(item, index) in controlData"
                    :key="index"
                    @click="showPop(item, index, $event)"
                >
                    {{item.name}}
                    <span
                        class="hasOpt"
                        v-if="item.condition.length > 0 || (item.conditionMore && item.conditionMore.length > 0) || (item.conditionTri && item.conditionTri.length > 0)"
                    ></span>
                    <img
                        class="look-right"
                        v-if="currentIndex === index"
                        src="./images/pitch-on.png"
                        alt="图片"
                    />
                    <img
                        class="look-right"
                        src="./images/no-pitch.png"
                        alt="图片"
                        v-else
                    />
                    <!--价格-->
                    <div
                        class="card option0"
                        @click="cardClick($event)"
                    >
                        <div class="options">
                            <div class="option-it">
                                <span class="tit">总价：</span>
                                <span class="input-wrap">
                                    <span>
                                        <el-input
                                            @input.native="changeCode"
                                            placeholder="最低"
                                            v-model="price.sumPrice.min"
                                        ></el-input>万元
                                    </span>
                                    <span class="division"></span>
                                    <span>
                                        <el-input
                                            @input.native="changeCode"
                                            placeholder="最高"
                                            v-model="price.sumPrice.max"
                                        ></el-input>万元
                                    </span>
                                </span>
                            </div>
                            <div class="option-it">
                                <span class="tit">单价：</span>
                                <span class="input-wrap">
                                    <span>
                                        <el-input
                                            @input.native="changeCode"
                                            placeholder="最低"
                                            v-model="price.unitPrice.min"
                                        ></el-input>元/m²
                                    </span>
                                    <span class="division"></span>
                                    <span>
                                        <el-input
                                            @input.native="changeCode"
                                            placeholder="最高"
                                            v-model="price.unitPrice.max"
                                        ></el-input>元/m²
                                    </span>
                                </span>
                            </div>
                            <div class="option-it">
                                <span class="tit">首付：</span>
                                <span class="input-wrap">
                                    <div class="select-fir">
                                        <el-select v-model="price.firstPay.ratio">
                                            <el-option
                                                v-for="item in firstPayOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <span>
                                        <el-input
                                            @input.native="changeCode"
                                            placeholder="最低"
                                            v-model="price.firstPay.min"
                                        ></el-input>万元
                                    </span>
                                    <span class="division"></span>
                                    <span>
                                        <el-input
                                            @input.native="changeCode"
                                            placeholder="最高"
                                            v-model="price.firstPay.max"
                                        ></el-input>万元
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(0)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(0)"
                            >确定</span>
                        </div>
                    </div>
                    <!--面积-->
                    <div
                        class="card option1"
                        @click="cardClick($event)"
                    >
                        <div class="options">
                            <div class="option-it">
                                <span class="input-wrap">
                                    <span>
                                        <jl-number-input
                                            v-model="area.min"
                                            class="el-input"
                                            placeholder="最小"
                                            reg='twoNum'/>m²
                                    </span>
                                    <span class="division"></span>
                                    <span>
                                        <jl-number-input
                                            v-model="area.max"
                                            class="el-input"
                                            placeholder="最大"
                                            reg='twoNum'/>m²
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(1)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(1)"
                            >确定</span>
                        </div>
                    </div>
                    <!--户型-->
                    <div
                        v-if="realCityFlag"
                        class="card option2"
                        @click="cardClick($event)">
                        <div class="options">
                            <div
                                class="opt-tab"
                                v-for="(item, index) in houseType"
                                @click="addHouseType(item)"
                                :key="index"
                            >
                                <span :class="item.state === false ? 'state' : 'state active'"></span>
                                <span class="hosue">{{item.text}}</span>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(2)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(2)"
                            >确定</span>
                        </div>
                    </div>
                    <div
                        v-else
                        class="card option2 option-change"
                        @click="cardClick($event)">
                        <div class="options">
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>户型</span>
                                    <span v-if="hxChosen > 0">（{{hxChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in houseType"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>朝向</span>
                                    <span v-if="directChosen > 0">（{{directChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in directType"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(2)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(2)"
                            >确定</span>
                        </div>
                    </div>
                    <!--业态-->
                    <div
                        class="card option3"
                        @click="cardClick($event)"
                    >
                        <div class="options">
                            <div
                                class="opt-tab"
                                v-for="(item, index) in projectType"
                                @click="addHouseType(item)"
                                :key="index"
                            >
                                <span :class="item.state === false ? 'state' : 'state active'"></span>
                                <span class="hosue">{{item.text}}</span>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(3)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(3)"
                            >确定</span>
                        </div>
                    </div>
                    <!--特色-->
                    <div
                        class="card option4"
                        @click="cardClick($event)"
                    >
                        <div class="options">
                            <div
                                class="opt-tab"
                                v-for="(item, index) in projectTese"
                                @click="addHouseType(item)"
                                :key="index"
                            >
                                <span :class="item.state === false ? 'state' : 'state active'"></span>
                                <span class="hosue">{{item.text}}</span>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(4)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(4)"
                            >确定</span>
                        </div>
                    </div>
                    <!--地铁线-->
                    <div
                        class="card option5"
                        @click="cardClick($event)"
                    >
                        <div class="options" v-if="subwayListData.length>0">
                            <div
                                class="opt-wrap"
                                v-for="(item, index) in subwayListData"
                                :key="index"
                            >
                                <div class="name-wrap">
                                    <span class="city-name">{{item.city_name}}</span>
                                </div>
                                <div
                                    class="opt-tab"
                                    v-for="(subItem, sunIndex) in item.subway"
                                    @click="singleCheck(subItem, 0, item.city_name)"
                                    :key="sunIndex+'sub'">
                                    <span :class="subItem.state ? 'hosue active' : 'hosue'">{{subItem.child_show_text}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="options txt-hint" v-else>
                            当前城市无地铁
                        </div>
                    </div>
                    <!--开盘-->
                    <div
                        class="card option6"
                        @click="cardClick($event)"
                    >
                        <div class="options">
                            <div
                                class="opt-tab"
                                v-for="(item, index) in openTimeType"
                                @click="singleCheck(item, 1)"
                                :key="index"
                            >
                                <span :class="item.state === false ? 'hosue' : 'hosue active'">{{item.text}}</span>
                            </div>
                        </div>
                    </div>
                    <!--区域-->
                    <div
                        class="card option7"
                        @click="cardClick($event)">
                        <div class="options">
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>区域</span>
                                    <span v-if="areaTypeChosen > 0">（{{areaTypeChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in areaType"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(7)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(7)"
                            >确定</span>
                        </div>
                    </div>
                    <!--产证唯一&装修-->
                    <div
                        class="card option8"
                        @click="cardClick($event)">
                        <div class="options">
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>产证唯一</span>
                                    <span v-if="houseChosen > 0">（{{houseChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in houseYear"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>装修</span>
                                    <span v-if="decorateChosen > 0">（{{decorateChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in decoreateType"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(8)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(8)"
                            >确定</span>
                        </div>
                    </div>
                    <!--楼层&电梯-->
                    <div
                        class="card option9"
                        @click="cardClick($event)">
                        <div class="options">
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>房源楼层</span>
                                    <span v-if="floorChosen > 0">（{{floorChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in floorNum"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="option-item-box">
                                <div class="option-item-hd">
                                    <span>楼栋总楼层</span>
                                    <span v-if="totalFloorChosen > 0">（{{totalFloorChosen}}个）</span>
                                </div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in totalFloorNum"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="option-item-box">
                                <div class="option-item-hd">电梯</div>
                                <ul class="option-item-bd">
                                    <li
                                        class="opt-tab"
                                        v-for="(item, index) in floorType"
                                        @click="addHouseType(item)"
                                        :key="index">
                                        <span :class="item.state === false ? 'state' : 'state active'"></span>
                                        <span class="hosue">{{item.text}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="handle">
                            <span
                                class="cancel"
                                @click="closeAllFilter(9)"
                            >取消</span>
                            <span
                                class="affirm"
                                @click="addFilter(9)"
                            >确定</span>
                        </div>
                    </div>
                </div>
                <div class="condition-box other-filter">
                    <div class="bd">
                        <span
                            :class="item.state === false ? 'houses' : 'houses checkBg'"
                            v-for="(item, index) in otherFilter"
                            :key="index"
                            @click="addHouseType(item, 1)"
                        >{{item.name}}</span>
                    </div>
                </div>
                <div class="condition-box map-set">
                    <div class="hd">地图设置：</div>
                    <div class="bd">
                        <span
                            :class="item.state === false ? 'houses' : 'houses checkBg' "
                            v-for="(item, index) in setMap"
                            :key="index"
                            @click="addHouseType(item, 2)"
                        >
                            <img
                                class="mulyiple"
                                src="./images/mulyiple-no.png"
                                alt="图片"
                                v-if="item.state === false"
                            />
                            <img
                                class="mulyiple"
                                src="./images/checkbox-yes.png"
                                alt="图片"
                                v-else
                            />
                            {{item.name}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="left-opt">
                <div class="opt-con">
                    <div
                        class="filt-option-wrap"
                        v-for="(item, index) in controlData"
                        :key="index">
                        <div>
                            <div
                                class="filt-option"
                                v-for="(it, index) in item.condition"
                                :key="index">
                                <div
                                    :class="it.state === true ? 'opt-in' : 'opt-in hide-opt'"
                                    @click="singleCheck(it, 2)"
                                    v-if="it && it.id!=''">
                                    <div class="option" v-if="item.name == '地铁线'">{{`${it.city_name} -- ${it.text}`}}</div>
                                    <div class="option" v-else>{{it.text}}</div>
                                    <img
                                        src="./images/show.png"
                                        alt="图片"
                                        v-if="it.state === true"
                                    />
                                    <img
                                        src="./images/hide-filt.png"
                                        alt="图片"
                                        v-else
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-if="item.key === 'hx' || item.key === 'uniDecorate' || item.key === 'floor'">
                            <div
                                class="filt-option"
                                v-for="(it, index) in item.conditionMore"
                                :key="index">
                                <div
                                    :class="it.state === true ? 'opt-in' : 'opt-in hide-opt'"
                                    @click="singleCheck(it, 2)"
                                    v-if="it && it.id!=''">
                                    <div class="option">{{it.text}}</div>
                                    <img
                                        src="./images/show.png"
                                        alt="图片"
                                        v-if="it.state === true"
                                    />
                                    <img
                                        src="./images/hide-filt.png"
                                        alt="图片"
                                        v-else
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-if="item.key === 'floor'">
                            <div
                                class="filt-option"
                                v-for="(it, index) in item.conditionTri"
                                :key="index">
                                <div
                                    :class="it.state === true ? 'opt-in' : 'opt-in hide-opt'"
                                    @click="singleCheck(it, 2)"
                                    v-if="it && it.id!=''">
                                    <div class="option">{{it.text}}</div>
                                    <img
                                        src="./images/show.png"
                                        alt="图片"
                                        v-if="it.state === true"
                                    />
                                    <img
                                        src="./images/hide-filt.png"
                                        alt="图片"
                                        v-else
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-wrap">
            <div class="head-bar">
                <div class="head-inner">
                    <div class="opt search-house">
                        <img src="./images/search.png" 
                            alt="图片"/>
                        <el-autocomplete
                            v-model="buildName"
                            :fetch-suggestions="searchHouse"
                            placeholder="输入楼盘名搜索"
                            @select="affirmHouse"
                        ></el-autocomplete>
                    </div>
                    <div
                        class="screen-add"
                        v-show="commutType === false">
                        <div class="tit">按通勤筛选：</div>
                        <div class="opt search-house">
                            <!--百度地图的搜索-->
                            <div id="fake"></div>
                            <el-input
                                placeholder="搜索通勤地点"
                                id="searchHou"
                                v-model="commutOpts.site.name"
                                @focus="iptFocus"
                            ></el-input>
                        </div>
                        <div>或</div>
                        <div
                            class="opt txt"
                            @click="upCommutType(0, 0)"
                            v-if="signPoint === false"
                        >
                            <img src="./images/local_icon.png" 
                                alt="图片" />
                            鼠标标记地点
                        </div>
                        <div
                            class="opt txt mouse-sign"
                            @click="upCommutType(0, 0)"
                            v-else
                        >
                            <img src="./images/check-sign.png"
                                alt="图片" />
                            关闭鼠标标记
                        </div>
                        <div class="tit">自定义范围筛选：</div>
                        <div
                            class="opt txt"
                            @click="customTagChange($event, 1)"
                            v-if="customTag === false"
                        >
                            <img src="./images/black-pen.png"
                                alt="图片" />
                            画圈找房
                        </div>
                        <div
                            class="opt txt active"
                            @click="customTagChange($event, 2)"
                            v-else
                        >
                            <img src="./images/write-pen.png"
                                alt="图片" />
                            关闭画圈找房
                        </div>
                    </div>
                    <div
                        class="screen-add"
                        v-show="commutType === true"
                    >
                        <div
                            class="opt trip-wrap trip-type"
                            @click="choice($event,0)"
                        >
                            <span class="trip-opt active">公交地铁</span>
                            <span class="trip-opt">驾车</span>
                        </div>
                        <div class="opt check-city">
                            <el-select
                                v-model="commutOpts.targetDistrictId"
                                ref="changeArea"
                                placeholder="选择区域"
                                @change="checkCommutCity"
                            >
                                <el-option
                                    v-for="item in districtTotal"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                        <div
                            class="opt trip-wrap trip-time"
                            @click="choice($event,1)"
                        >
                            <span class="trip-opt">15分钟</span>
                            <span class="trip-opt">30分钟</span>
                            <span class="trip-opt">45分钟</span>
                            <span class="trip-opt active">60分钟</span>
                            <span class="trip-opt">90分钟</span>
                            <span class="trip-opt">120分钟</span>
                        </div>
                        <div
                            class="opt reset"
                            @click="upCommutType(1)"
                        >关闭或重新选址</div>
                    </div>
                    <div
                        class="demand"
                        v-if="clientNeed === false"
                    >
                        <span class="light-txt">{{clientName}}</span>
                        <span class="light-txt">{{clientPhone}}</span>
                        <span
                            class="exchange"
                            @click="hideClient"
                        >
                            展开需求
                            <i class="iconfont iconxialajiantou"
                                aria-hidden="true"></i>
                        </span>
                    </div>
                    <div
                        class="demand"
                        v-else
                    >
                        <span class="light-txt">{{clientName}}</span>
                        <span class="light-txt">{{clientPhone}}</span>
                        <span
                            class="exchange"
                            @click="hideClient"
                        >
                            收起需求
                            <i class="iconfont iconshangjiantou"
                                aria-hidden="true"></i>
                        </span>
                        <div class="list">
                            <div class="list-inner">
                                <div
                                    class="opt-need"
                                    v-for="(item, index) in clientNeedDesc"
                                    :key="index"
                                >
                                    <div class="th">{{item.title}}</div>
                                    <div class="td">{{item.value}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="opt txt order-detail"
                        @click="goOrderDetail"
                    >进入订单详情</div>
                    <div
                        class="redraw"
                        v-if="isRedraw === true"
                        @click="redraw"
                    >
                        <img src="./images/redraw_pen.png"
                            alt="图片" />
                        重画
                    </div>
                </div>
            </div>
            <div class="foot-bar">
                <div
                    class="cutline"
                    v-if="control"
                >
                    <div
                        class="desc"
                        v-if="mapPattern == true"
                    >
                        <span class="th">图例：</span>
                        <span class="td">
                            <span class="item">
                                <i class="school" aria-hidden="true"></i>学校
                            </span>
                            <span class="item">
                                <i class="shop" aria-hidden="true"></i>购物
                            </span>
                            <span class="item">
                                <i class="hospital" aria-hidden="true"></i>医疗
                            </span>
                        </span>
                    </div>
                    <div
                        class="map-tab shadow-box"
                        @click="choice($event,2)"
                    >
                        <span class="map-opt mat">配套地图</span>
                        <span class="map-opt baidu active">百度地图</span>
                    </div>
                </div>
            </div>
            <div class="right-bar">
                <slide-info-page
                    :openFlag="openFlag"
                    @closeSidePage="closeSidePage"
                ></slide-info-page>
                <div
                    class="right-pos shadow-box"
                    v-if="control"
                    ref="rigPos"
                >
                    <div
                        class="edit add"
                        @click="changeTier(0)"
                    >
                        <img src="./images/icon-add.png"
                            alt="图片" />
                    </div>
                    <div
                        class="edit less"
                        @click="changeTier(1)"
                    >
                        <img src="./images/less-icon.png"
                            alt="图片" />
                    </div>
                </div>
                <div
                    class="right-btn-wrap"
                    v-if="control"
                >
                    <div
                        :class="['rig-btn', 'enter-into', 'shadow-box']"
                        @click="openFloorModel"
                    >
                        楼盘对比
                        <span
                            class="contrast"
                            v-if="projectCount != 0"
                        >{{projectCount}}</span>
                    </div>
                    <div
                        class="rig-btn share-data shadow-box"
                        @click="openMadel"
                    >购房知识</div>
                </div>
            </div>
            <b-maps
                ref="map"
                v-if="isShowMap"
                :room_id="room_id"
                :see_project_id="see_project_id"
                :houseType="this.houseType"
                :controlData="controlData"
                :setMap="setMap"
                :otherFilter="otherFilter"
                :cityInfo="cityCon"
                :isRealCity="realCityFlag"
                @upMapPattern="upMapPattern"
                @addPoint="addPoint"
                @drawFinish="drawFinish"
                @recoverComDef="recoverComDef"
                @recoverCircleDef="recoverCircleDef"
                @btnControl="btnControl"
                @openArea="openArea"
            ></b-maps>
        </div>
        <SlideBar
            ref="children"
            :cityInfo="cityCon"
        />
        <ContrastMadel @opneHouseDialog="opneHouseDialog" />
        <house-type-dialog
            :title="title"
            ref="houseDialog"
            :cityInfo="cityCon"
            :isRealCity="realCityFlag"
            @dataUpdate="dataUpdate"
        />
        <ReportMadel :cityInfo="cityCon" />
        <div
            class="add-shadow"
            v-if="!notEligible"
        ></div>
        <choose-house-bar
            ref="houseContrastBar"
            :isRealCity="realCityFlag"
            :cityInfo="cityCon"
            @dataUpdateNum="dataUpdate" />
    </div>
</template>

<script>
    /* eslint-disable */
    import BMaps from "./components/BMap";
    import { commonFun } from "@/assets/js/utils/utils";
    import { trackAxios } from "@/assets/js/http/axios";
    import ContrastMadel from "./components/ContrastMadel.vue";
    import HouseTypeDialog from "./components/HouseTypeDialog.vue";
    import ReportMadel from "./components/ReportMadel.vue";
    import ChooseHouseBar from "./components/ChooseHouseBar.vue";
    import { SlideInfoPage, SlideBar } from "./components";
    import PubSub from "pubsub-js";
    import { mapState, mapActions } from "vuex";
    import searchToolsApi from "./api/searchToolShare";
    import loadMap from '@/assets/js/utils/map.js';
    import dataStorage from "@/assets/js/utils/dataStorage";
    const {
        getCitySubWay,
        multiApi,
        getContrastCount
    } = searchToolsApi;
    export default {
        data() {
            return {
                // 筛选项滚动高度
                citySrollTop: 0,
                // 地铁线是否请求完毕
                subWayFlag: false,
                // 备份城市状态
                cityTotalBase: [],
                // 添加城市
                checkCityCon:[], 
                // 选择城市备份数据
                checkCityConBase: [],
                // 选择城市弹窗
                unfoldCity: false,
                // 楼盘对比数量
                projectCount: 0,
                title: "",
                notEligible: false,
                backendApiBase: "", // 埋点api
                control: true, // 底部地图类型以及显示
                shadowOpen: false, // 筛选项的遮罩
                isRedraw: false, // 是否展示重画
                signPoint: false, // 鼠标标记状态
                customTag: false, // 画圈找房状态
                checkAddress: {
                    name: "",
                    point: {}
                },
                restaurants: [], // 远程搜索数据
                commutOpts: {
                    // 通勤地址参数
                    targetDistrictId: "", // 区域id
                    targetCity: "", // 区域
                    site: {
                        name: "", // 搜索地点
                        lng: "", // 经度
                        lat: "" // 纬度
                    },
                    trip: "公交", // 出行方式
                    tripTime: "60分钟" // 出行时间
                },
                commutType: false, // 通勤模式
                clientNeed: false, // 用户需求模块  默认不展开
                buildName: "", // 搜索楼盘名
                cityId: "", // 城市id
                cityCon: {
                    currentCity: "", // 当前城市
                    currentCityId: "", // 当前城市id
                    currentCityVirName: '' // 真实名称对应的虚拟名称，用于展示
                },
                cityTotal: [], // 城市信息
                districtTotal: [], // 区域信息
                currentIndex: "", // 当前点击的index
                controlData: [
                    // 筛选信息数组 // 根据该数组来遍历外层数据展示
                    {
                        name: "价格",
                        condition: [],
                        key: 'price'
                    },
                    {
                        name: "面积",
                        condition: [],
                        key: 'area'
                    },
                    {
                        name: "户型",
                        condition: [],
                        conditionMore: [],
                        key: 'hx'
                    },
                    {
                        name: "业态",
                        condition: [],
                        key: 'houseType'
                    },
                    {
                        name: "特色",
                        condition: [],
                        key: 'ts'
                    },
                    {
                        name: "地铁线",
                        condition: [],
                        key: 'line'
                    },
                    {
                        name: "开盘",
                        condition: [],
                        key: 'open'
                    }
                ],
                otherFilter: [
                    // 其他筛选
                    {
                        name: "筛选非售罄盘",
                        state: true
                    },
                    {
                        name: "居理专属楼盘",
                        state: false
                    },
                    {
                        name: "筛选外联楼盘",
                        state: false
                    },
                    {
                        name: "仅展示标记盘",
                        state: false
                    }
                ],
                setMap: [
                    // 地图设置
                    {
                        name: "区域气泡",
                        state: false
                    },
                    {
                        name: "二手房",
                        state: false
                    },
                    {
                        name: "拿地信息",
                        state: false
                    }
                ],
                firstPayOptions: [
                    // 首付比例
                    {
                        label: "10%",
                        value: 10
                    },
                    {
                        label: "15%",
                        value: 15
                    },
                    {
                        label: "20%",
                        value: 20
                    },
                    {
                        label: "25%",
                        value: 25
                    },
                    {
                        label: "30%",
                        value: 30
                    },
                    {
                        label: "35%",
                        value: 35
                    },
                    {
                        label: "40%",
                        value: 40
                    },
                    {
                        label: "45%",
                        value: 45
                    },
                    {
                        label: "50%",
                        value: 50
                    },
                    {
                        label: "55%",
                        value: 55
                    },
                    {
                        label: "60%",
                        value: 60
                    },
                    {
                        label: "65%",
                        value: 65
                    },
                    {
                        label: "70%",
                        value: 70
                    },
                    {
                        label: "75%",
                        value: 75
                    },
                    {
                        label: "80%",
                        value: 80
                    },
                    {
                        label: "85%",
                        value: 85
                    },
                    {
                        label: "90%",
                        value: 90
                    },
                    {
                        label: "95%",
                        value: 95
                    }
                ],
                price: {
                    // 价格 这个自己用
                    sumPrice: {
                        name: "总价",
                        min: "", // 最低多少
                        max: "" // 最高多少
                    },
                    unitPrice: {
                        name: "单价",
                        min: "", // 最低多少
                        max: "" // 最高多少
                    },
                    firstPay: {
                        name: "首付",
                        ratio: 30, // 首付比例
                        min: "", // 最低多少
                        max: "" // 最高多少
                    }
                },
                priceBase: "", // 价格备份
                area: {
                    // 面积
                    min: "",
                    max: ""
                },
                areaBase: {}, // 面积备份
                houseType: [], // 户型
                houseTypeBase: [], // 户型备份
                projectType: [], // 业态
                projectTypeBase: [], // 业态备份
                projectTese: [], // 特色
                projectTeseBase: [], // 特色备份
                // 朝向
                directType: [],
                // 朝向备份
                directTypeBase: [],
                // 电梯
                floorType: [],
                // 电梯备份
                floorTypeBase: [],
                // 装修
                decoreateType: [],
                // 装修备份
                decoreateTypeBase: [],
                // 楼层
                floorNum: [],
                // 楼层备份
                floorNumBase: [],
                // 总楼层
                totalFloorNum: [],
                // 总楼层备份
                totalFloorNumBase: [],
                // 产证唯一
                houseYear: [],
                // 产证唯一备份
                houseYearBase: [],
                // 区域
                areaType: [],
                // 区域备份
                areaTypeBase: [],
                subwayList: [], // 地铁线
                openTimeType: [], // 开盘
                popFlag: false, // 弹窗开关
                openFlag: false, // 打开右侧tab详情标志
                mapcon: {},
                ac: {},
                clientName: "", // 用户名
                clientPhone: "", // 用户手机号
                clientNeedDesc: [], // 用户需求
                isShowMap: false, // 地图组件
                mapPattern: false, // 地图类型
                trackMessage: {}, //  埋点信息
                userNeedHouseType: [], // 用户需求中的楼盘类型
                userNeedProjectType: [], // 用户需求中业态信息
                firstGet: false, //  第一次获取筛选项
                // 是否是真实城市
                realCityFlag: true,
                orderDtailUrl: "" // 订单详情页地址，
            };
        },
        mounted() {
            this.room_id = this.$route.query.room_id ? this.$route.query.room_id : 0;
            this.see_project_id = this.$route.query.see_project_id ? this.$route.query.see_project_id : 0;
            this.orderId = this.$route.query.order_id;
            this.$nextTick(() => {
                // 确保加载完成才实例化地图
                loadMap.loadMap().then(() => {
                    this.setSearch();
                    this.getUserNeed();
                });
                this.getHouseContrastNum();
            });
            window.localStorage.removeItem("moreHouseInfo");
            // 接收地图组件传过来的值
            PubSub.subscribe("addCompare", (msg, data) => {
                this.getHouseContrastNum();
            });
            window.addEventListener("message", this.receiveMessage, false);
            // 初始化时缓存下拉等数据 过期时间七天
            const timeout = 24 * 60 * 60 * 1000 * 7;
            if (!dataStorage.getStorage("houseBaseInfo") || !dataStorage.isFresh("houseBaseInfo", timeout)) {
                this.getFloorCommonInfo();
            }
        },
        methods: {
            // 获取城市群地铁线
            async getCityGroupSubWay() {
                try {
                    this.subWayFlag = false;
                    let params = {
                        city_id: this.cityCon.currentCityId.split(",")
                    };
                    const { data } = await getCitySubWay(params);
                    if (data.code === 0) {
                        data.data.list.forEach((city, ciInd) => {
                            if (city && city.subway.length > 0) {
                                city.subway.forEach((subitem) => {
                                    subitem.state = false;
                                });
                            }
                        });
                        this.subwayList = data.data.list;
                        this.subWayFlag = this.subwayList.length > 0 ? true : false;
                    } else {
                        this.subwayList = [];
                        this.subWayFlag = false;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 切换城市弹窗是否展示
            checkCityPop() {
                this.unfoldCity = !this.unfoldCity;
                if (this.unfoldCity) {
                    this.$nextTick(() => {
                        // 自动定位
                        // 选中主城的top值
                        this.citySrollTop = document.querySelector('.current-major-active') ? document.querySelector('.current-major-active').offsetTop - 4 : 0;
                        document.getElementsByClassName('major-con')[0].scrollTop = this.citySrollTop;
                    });
                }
            },
            /**
             * 修改下拉框选中的选中的城市
             * @param {object} item 城市 
             * @param {string} majorId 主城id
             * @param {string} type 类型 0主城/1副城
             */
            changeCityId(item, majorId, type) {
                // 如果当前选的主城id不在已选数组内、那么清空已有数据、清空已选状态
                let notFilArr = this.checkCityCon.filter((checkItem) => {
                    return checkItem.majorId != majorId;
                });
                if (notFilArr.length > 0) {
                    this.checkCityCon = [];
                    let arr = this.cityTotal;
                    arr.forEach((cityItem, ctIndex) => {
                        if ((item.id == cityItem.id) && item.state && (type == 0)) {
                            cityItem.state = true;
                            cityItem.scrollFlag = true;
                        } else {
                            cityItem.state = false;
                            cityItem.scrollFlag = false;
                        }
                        if (cityItem.sub.length > 0) {
                            let num = 0;
                            cityItem.sub.forEach((subCity) => {
                                if ((item.id == subCity.id) && item.state && (type == 1) && (cityItem.id == majorId)) {
                                    subCity.state = true;
                                    num++;
                                } else {
                                    subCity.state = false;
                                }
                            });
                            if (num > 0 && !cityItem.scrollFlag) {
                                cityItem.scrollFlag = true;
                            }
                        }
                    });
                    this.cityTotal = this.deepCopy(arr);

                }
                if (item.state) {
                    this.checkCityCon.push({
                        id: item.id,
                        majorId: majorId,
                        type: item.type,
                        text: item.text,
                        isRealCity: item.is_real_city,
                        realCityName: item.real_text
                    });
                } else {
                    this.checkCityCon.forEach((city, index) => {
                        if (item.id == city.id) {
                            this.checkCityCon.splice(index, 1);
                        }
                    });
                }
            },
            /**
             * 确认选择城市
             * @param string type 城市 0取消/1确定
             */
            closeCityPop(type) {
                // 取消重置已选择的  
                if (type === 0) {
                    this.checkCityCon = this.deepCopy(this.checkCityConBase);
                    this.cityTotal = this.deepCopy(this.cityTotalBase);
                    // 选中主城的top值
                    this.citySrollTop = document.querySelector('.current-major-active') ? document.querySelector('.current-major-active').offsetTop-4 : 0;
                } else {  // 确定更新数据
                    // 选中主城的top值
                    this.citySrollTop = document.querySelector('.current-major-active') ? document.querySelector('.current-major-active').offsetTop-4 : 0;
                    if (this.checkCityCon.length == 0) {
                        this.$message({
                            message: '至少选择一个城市',
                            type: 'error',
                            duration: 3000
                        });
                        return false;
                    }
                    /**
                     * date：2020.5.7
                     * updater：xiejiaxin
                     * 新增虚拟城市判断，跟产品确认，虚拟城市只能是主城，所以如果选中数组个数为1的时候才可能是虚拟城市
                     */
                    if (this.checkCityCon.length === 1 && !this.checkCityCon[0].isRealCity) {
                        // 判断是否是虚拟城市
                        this.realCityFlag = false;
                    } else {
                        this.realCityFlag = true;
                    }
                    let cityids = [];
                    let cityNames = [];
                    let cityVirNames = [];
                    this.checkCityCon.forEach((city, index) => {
                        cityids.push(city.id);
                        cityNames.push(city.realCityName);
                        cityVirNames.push(city.text);
                    });
                    this.checkCityConBase = this.deepCopy(this.checkCityCon);
                        
                    // 修改城市
                    this.cityCon.currentCity = cityNames.join(',');
                    this.cityCon.currentCityId = cityids.join(',');
                    // 地图使用真实名称，但是展示只能使用虚拟名称，所以单独保存一份虚拟名称
                    this.cityCon.currentCityVirName = cityVirNames.join(',');
                    this.changeCity(cityids);
                    this.getDistrict(this.cityCon.currentCityId);
                    this.cityTotalBase = this.deepCopy(this.cityTotal);
                }
                document.getElementsByClassName('major-con')[0].scrollTop = this.citySrollTop;
                this.getCityGroupSubWay();
                this.unfoldCity = false;
            },
            // 监听地图上鼠标打点
            addPoint() {
                this.commutOpts.site.name = "";
                this.commutType = true;
            },
            // 获取区 getDistrict
            getDistrict(id) {
                let params = {
                    type: 3, // type3 请求区
                    city_id: id
                };
                this.axios
                    .get(
                        "/backend-api/select2/select2/get-province-dropdown-list2",
                        { params: params }
                    )
                    .then(res => {
                        let result = res.data;
                        if (result.code === 0) {
                            this.districtTotal = result.data;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取用户需求
            getUserNeed() {
                let params = {
                    order_id: this.orderId
                };
                this.axios
                    .post("/backend-api/bk-map/get-user-require", params)
                    .then(res => {
                        let result = res.data;
                        if (result.code === 0) {
                            let Data = result.data;
                            this.notEligible = Data.ab_type;
                            this.cityCon.currentCityId =
                                Data.user_require.city_id + "";
                            this.realCityId = Data.user_require.real_city_id + "";
                            this.cityId = Data.user_require.city_id + "";
                            this.userCity = Data.user_require.city_id + "";
                            this.cityCon.currentCity = Data.user_require.real_city_name;
                            this.cityCon.currentCityVirName = Data.user_require.city_name;
                            this.orderDtailUrl = Data.order_follow_url;
                            // 默认进入页面判断是否是虚拟城市
                            if (this.cityCon.currentCityId !== this.realCityId) {
                                this.realCityFlag = false;
                            } else {
                                this.realCityFlag = true;
                            }
                            // 获取区域
                            this.getDistrict(this.cityCon.currentCityId);
                            // 初始化地图设置
                            if (Data.map_check.area_bubble == 1) {
                                // 区域气泡
                                this.$set(this.setMap, 0, {
                                    name: "区域气泡",
                                    state: true
                                });
                            } else if (Data.map_check.area_bubble == 2) {
                                this.$set(this.setMap, 0, {
                                    name: "区域气泡",
                                    state: false
                                });
                            }
                            if (Data.map_check.second_house == 1) {
                                // 二手房
                                this.$set(this.setMap, 1, {
                                    name: "二手房",
                                    state: true
                                });
                            } else if (Data.map_check.second_house == 2) {
                                this.$set(this.setMap, 1, {
                                    name: "二手房",
                                    state: false
                                });
                            }
                            if (Data.map_check.lots_info == 1) {
                                // 拿地信息
                                this.$set(this.setMap, 2, {
                                    name: "拿地信息",
                                    state: true
                                });
                            } else if (Data.map_check.lots_info == 2) {
                                this.$set(this.setMap, 2, {
                                    name: "拿地信息",
                                    state: false
                                });
                            }
                            // 获取埋点信息
                            this.backendApiBase = Data.www_backend_api;
                            this.$store.dispatch(
                                "get_backend_api",
                                this.backendApiBase
                            );
                            this.trackMessage = Data.track_common_property;
                            this.$store.dispatch(
                                "get_trackmessages",
                                this.trackMessage
                            );
                            this.$store.dispatch("get_cityinfo", {
                                cityId: this.cityCon.currentCityId,
                                cityName: this.cityCon.currentCity,
                            });
                            this.clientNeedDesc = Data.require_desc;
                            this.filterClientInfo();
                            if (Data.user_require.acreage_min != "") {
                                this.area.min = Data.user_require.acreage_min + "";
                            }
                            if (Data.user_require.acreage_max != "") {
                                this.area.max = Data.user_require.acreage_max + "";
                            }
                            this.addFilter(1, true);
                            if (Data.user_require.total_price_min != "") {
                                this.price.sumPrice.min =
                                    Data.user_require.total_price_min + "";
                            }
                            if (Data.user_require.total_price_max != "") {
                                this.price.sumPrice.max =
                                    Data.user_require.total_price_max + "";
                            }
                            if (Data.user_require.unit_price_min != "") {
                                this.price.unitPrice.min =
                                    Data.user_require.unit_price_min + "";
                            }
                            if (Data.user_require.unit_price_max != "") {
                                this.price.unitPrice.max =
                                    Data.user_require.unit_price_max + "";
                            }
                            this.addFilter(0, true);
                            if (Data.user_require.house_type.length > 0) {
                                this.userNeedHouseType =
                                    Data.user_require.house_type;
                            }
                            if (Data.user_require.project_type.length > 0) {
                                this.userNeedProjectType =
                                    Data.user_require.project_type;
                            }
                            this.setSearch();
                            // 控制地图展示
                            this.isShowMap = true;
                        }
                    })
                    .then(() => {
                        this.firstGet = true;
                        // 浏览页面埋点
                        if (this.$route.query.order_id) {
                            this.track("3892", {
                                order_id: this.$route.query.order_id
                            });
                        }
                        this.getCondition();
                        this.getCity();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 缩放地图
            changeTier(type) {
                if (type === 0) {
                    // +
                    this.$refs.map.mapZoomIn();
                    // 地图缩放埋点
                    this.track("3903", { zoom_type: "放大" });
                }
                if (type === 1) {
                    // -
                    this.$refs.map.mapZoomOut();
                    this.track("3903", { zoom_type: "缩小" });
                }
            },
            // 搜索楼盘
            searchHouse(val, cb) {
                if (val) {
                    // 历史楼盘
                    this.houseState = false;
                    // 隐藏历史记录模块
                    var list = [{}];
                    let params = {
                        projectName: val,
                        cityId: this.cityCon.currentCityId,
                        order_id: this.orderId
                    };
                    this.axios
                        .get("/backend-api/select2/select2/get-projects", {
                            params: params
                        })
                        .then(res => {
                            let result = res.data;
                            if (result.code === 0) {
                                // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
                                for (let i of result.data) {
                                    i.value = i.name; // 将想要展示的数据作为value
                                }
                                list = result.data;
                                cb(list);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    // 显示历史记录
                    cb([]);
                    this.houseState = true;
                }
            },
            // 百度搜索地址
            setSearch() {
                this.mapcon = new BMap.Map("fake");
                let citys = this.cityCon.currentCity.split(',')
                // 建立一个自动完成的对象
                this.ac = new BMap.Autocomplete({
                    input: "searchHou",
                    location: citys[0]
                });
                let myValue;
                // 鼠标点击下拉列表后的事件
                this.ac.addEventListener("onconfirm", e => {
                    if (e && e.preventDefault) {
                        e.preventDefault();
                    } else {
                        let _value = e.item.value;
                        myValue =
                            _value.province +
                            _value.city +
                            _value.district +
                            _value.street +
                            _value.business;
                        this.setPlace(myValue);
                        this.commutOpts.site.name = myValue;
                        // 点击推荐地址
                        this.track("3896");
                    }
                });
            },
            // 地址搜索
            addressSearch(address, lat, lng) {
                let params = {
                    order_id: this.$route.query.order_id,
                    type: "2",
                    addressType: "2",
                    address: address,
                    lat: lat,
                    lng: lng
                };
                this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 匹配经纬度
            setPlace(para) {
                let _this = this;
                function myFun() {
                    let pp = local.getResults().getPoi(0) ? local.getResults().getPoi(0).point : {};
                    _this.commutOpts.site.lng = pp.lng;
                    _this.commutOpts.site.lat = pp.lat;
                    _this.$refs.map.openCommuting(_this.commutOpts.site);
                    PubSub.publish("closeCurrenPage");
                    // 上报地址
                    _this.addressSearch(para, pp.lat, pp.lng);
                }
                let local = new BMap.LocalSearch(_this.mapcon, {
                    onSearchComplete: myFun
                });
                local.search(para);
            },
            // 搜索楼盘名
            affirmHouse(val) {
                // 点击搜索楼盘结果
                this.track("3895");
                this.$refs.map.searchBuild(val);
                // 关闭画圈找房
                if (this.customTag == true) {
                    this.customTag = false;
                    this.$refs.map.closeCricle();
                }
                // 关闭鼠标找房模式
                this.commutType = false;
                if (this.signPoint == true) {
                    this.signPoint = false;
                    this.$refs.map.closeCursor();
                }
            },
            // 画圈找房数据
            customTagChange(e, type) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
                // 点击画圈找房
                if (type === 1) {
                    // 点击画圈找房
                    this.track("3899");
                    PubSub.publish("closeCurrenPage");
                    this.customTag = true;
                    this.$refs.map.openCricle();
                    // 关闭鼠标找房模式
                    this.$refs.map.closeCursor(true);
                    this.signPoint = false;
                }
                // 点击关闭画圈找房
                if (type === 2) {
                    this.isRedraw = false;
                    this.customTag = false;
                    this.$refs.map.closeCricle();
                }
            },
            // 更新通勤情况
            upCommutType(type, edit) {
                // 点击鼠标标记
                if (type === 0 || edit === 0) {
                    // 点击鼠标标记埋点
                    this.track("3897");
                    if (this.signPoint === false) {
                        // 点击鼠标标记 关闭画圈找房  关闭重画
                        this.customTag = false;
                        this.isRedraw = false;
                        PubSub.publish("closeCurrenPage");
                        this.$refs.map.openCommuting();
                        this.signPoint = !this.signPoint;
                    } else {
                        this.customTag = false;
                        // 关闭鼠标样式
                        this.signPoint = !this.signPoint;
                        this.$refs.map.closeCursor();
                        PubSub.publish("closeCurrenPage");
                    }
                }
                // 关闭通勤找房
                if (type === 1) {
                    // 把上次选择的区域置空
                    this.commutOpts.targetDistrictId = "";
                    this.$refs.map.closeCommuting();
                    this.signPoint = false;
                    this.commutType = false;
                }
            },
            // 选择通勤方式以及时间
            choice (event, type) {
                if (type === 0) {
                    let its = document.querySelectorAll('.trip-type .trip-opt')
                    for (let i = 0; i < its.length; i++) {
                    its[i].className = 'trip-opt'
                    }
                    event.target.className += ' active'
                    this.commutOpts.trip = event.target.textContent

                    let id = this.commutOpts.targetDistrictId
                    let disName = this.filterName(id)
                    this.$refs.map.startCommuting(id, disName, this.commutOpts.trip, this.commutOpts.tripTime)
                }
                if (type === 1) {
                    let its = document.querySelectorAll('.trip-time .trip-opt')
                    for (let i = 0; i < its.length; i++) {
                    its[i].className = 'trip-opt'
                    }
                    event.target.className += ' active'
                    this.commutOpts.tripTime = event.target.textContent

                    let id = this.commutOpts.targetDistrictId
                    let disName = this.filterName(id)
                    this.$refs.map.startCommuting(id, disName, this.commutOpts.trip, this.commutOpts.tripTime)
                }
                // 选择地图类型  调用地图组件内方法
                if (type === 2) {
                    let its = document.querySelectorAll('.cutline .map-tab .map-opt')
                    for (let i = 0; i < its.length; i++) {
                    its[i].className = 'map-opt'
                    }
                    event.target.className += ' active'
                    // 设置地图类型 0 配套 1 百度
                    let type
                    if (event.target.textContent == '配套地图') {
                    this.mapPattern = true
                    type = 0
                    this.track('3902', { map_type: '配套' })
                    } else if (event.target.textContent == '百度地图') {
                    this.mapPattern = false
                    type = 1
                    this.track('3902', { map_type: '普通' })
                    }
                    this.$refs.map.setMapType(type)
                }
            },
            //
            receiveMessage(msg) {
                if (msg.data.type !== "1") {
                    return;
                }
                // 跟新对比数据
                if (msg.data.msg === "updateHouseCount") {
                    this.dataUpdate();
                }
            },
            // 保存完更新数据
            dataUpdate() {
                this.getHouseContrastNum();
            },
            // 获取楼盘对比数量
            async getHouseContrastNum() {
                try {
                    const { data } = await getContrastCount(this.orderId);
                    if (data.code === 0) {
                        this.projectCount = Number(data.data.project_num);
                        dataStorage.setStorage(
                            "projectIdData",
                            JSON.stringify(data.data.project_id)
                        );
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 获取楼盘公共信息 存储在本地 所有城市下拉值都一样  只有装修状态等两个字段需要根据城市区分
            async getFloorCommonInfo() {
                try {
                    const options = {
                        type: "19",
                        city_id: '2',
                        order_id: this.orderId
                    };
                    const { data } = await multiApi(options);
                    if (data.code === 0) {
                        const initInfo = data.data;
                        dataStorage.setStorage(
                            "houseBaseInfo",
                            JSON.stringify(initInfo)
                        );
                    } else {
                        this.$message(data.msg);
                    }
                    
                } catch (error) {
                    console.log(error);
                }
            },
            /** 打开新的户型选择弹窗
             * @param {String} projectId 楼盘id
             */
            opneHouseDialog(projectId, name) {
                if (this.projectCount >= 10) {
                    this.$message('最多添加十个楼盘对比');
                    return;
                }
                this.title = name;
                this.$refs.houseDialog.openDialog(projectId);
                //this.$refs.houseDialog.getHouseInfo('20392691','3');
                //this.$refs.houseDialog.getHouseInfo(this.orderId,projectId);
            },
            
            // 打开新订单详情页
            goOrderDetail() {
                let url = this.orderDtailUrl;
                window.open(url, "_blank");
                this.track("4232");
            },
            // 展开区域
            openArea() {
                this.$refs.changeArea.visible = true;
            },
            // 埋点公用方法
            track(id, obj) {
                let res = this.trackBase;
                if (obj) {
                    res = Object.assign({}, obj, res);
                }
                let resData = {
                    extrack_arr: res,
                    track_id: id
                };
                // 请求埋点接口
                let url = this.$store.state.backendApi + "/send-data/index";
                trackAxios.post(url, resData);
            },
            // 地图组件中 配套地图加载失败 主动切换到百度地图
            upMapPattern() {
                let mat = document.querySelector(".cutline .map-tab .mat");
                let it = document.querySelector(".cutline .map-tab .baidu");
                mat.className = " mat map-opt";
                it.className += " active";
                // 设置地图类型 0 配套 1 百度
                let type;
                this.mapPattern = false;
                type = 1;
                this.$refs.map.setMapType(type);
            },
            // 绑定按钮按钮是否展示  根据画圈时蒙层来决定
            btnControl(val) {
                this.control = val;
            },
            // 搜索楼盘有焦点时 关闭画圈找房模式
            iptFocus() {
                this.addState = true;
                this.customTag = false;
                this.$refs.map.closeCricle();
            },
            // 点击筛选栏
            editShadow() {
                this.shadowOpen = false;
                // 关闭选择框
                this.closeAllFilter();
            },
            // 恢复默认 关闭通勤找房
            recoverComDef() {
                // 把上次选择的区域置空
                this.commutOpts.targetDistrictId = "";
                // this.$refs.map.closeCommuting()
                this.signPoint = false;
                this.commutType = false;
            },
            recoverCircleDef() {
                this.isRedraw = false;
                this.customTag = false;
                // this.$refs.map.closeCricle()
            },
            // 监听鼠标画完
            drawFinish() {
                // 出现重画按钮
                this.isRedraw = true;
            },
            // 点击重画
            redraw() {
                PubSub.publish("closeCurrenPage");
                // 触发地图组件  清空的方法
                this.$refs.map.redraw();
                // 默认关闭重画按钮
                this.isRedraw = false;
            },
            // 用户需求
            hideClient() {
                if (!this.clientNeed) {
                    this.clientNeed = true;
                } else {
                    this.clientNeed = false;
                }
            },
            // 处理单选
            singleCheck(val, type, cityName) {
                // 地铁线
                if (type === 0) {
                    // 关闭通勤模式
                    this.commutType = false;
                    // 关闭画圈找房
                    this.customTag = false;
                    // 关闭鼠标标记
                    this.signPoint = false;
                    this.$refs.map.closeCursor();
                    // 把上次选择的区域置空
                    this.commutOpts.targetDistrictId = "";
                    this.$refs.map.closeCommuting();

                    this.controlData.forEach(item => {
                        if (item.name === "地铁线") {
                            // 遍历地铁线 除当前外 其他都置为false
                            let busWayLine = [];
                            this.subwayList.forEach((city) => {
                                if (city && city.subway.length > 0) {
                                    city.subway.forEach((subitem) => {
                                        if (subitem.child_show_text == val.child_show_text && subitem.city_id == val.city_id) {
                                            subitem.state = true;
                                        } else {
                                            subitem.state = false;
                                        }
                                    });
                                }
                                busWayLine.push(city);
                            });
                            this.subwayList = this.deepCopy(busWayLine);
                            let obj = {
                                text: val.child_show_text,
                                city_name: cityName,
                                city_id: val.city_id,
                                state: true
                            }
                            if (obj.text == "不限") {
                                // 置空
                                item.condition = [];
                            } else {
                                this.$set(item.condition, 0, obj);
                            }
                        }
                    });
                    this.submitFilter("3893", "地铁线");
                }
                // 开盘
                if (type === 1) {
                    this.controlData.forEach(item => {
                        if (item.name === "开盘") {
                            // 遍历地铁线 除当前外 其他都置为false
                            this.openTimeType = this.upData(this.openTimeType);
                            val.state = true;
                            if (val.text == "不限") {
                                // 置空
                                item.condition = [];
                            } else {
                                this.$set(item.condition, 0, val);
                            }
                        }
                    });
                    this.submitFilter("3893", "开盘");
                }
                // 点击筛选条件
                if (type === 2) {
                    let state;
                    let name;
                    val.state = !val.state;
                    if (val.state == true) {
                        state = "打开";
                    } else {
                        state = "关闭";
                    }
                    if (val.name == "总价") {
                        name = "价格";
                    } else if (val.name == "单价") {
                        name = "价格";
                    } else if (val.name == "首付") {
                        name = "价格";
                    } else {
                        name = val.name;
                    }
                    this.submitFilterOpt("3894", name, state);
                }
                this.closeAllFilter();
            },
            // 处理多选
            addHouseType(val, type) {
                val.state = !val.state;
                let name;
                if (type == 1) {
                    if (val.name == "筛选非售罄盘") {
                        name = "仅售罄盘";
                    } else if (val.name == "居理专属楼盘") {
                        name = "仅合作盘";
                    } else if (val.name == "筛选外联楼盘") {
                        name = "仅外联盘";
                    } else if (val.name == "仅展示标记盘") {
                        name = "仅标记盘";
                    }
                    this.submitFilter("3893", name);
                } else if (type == 2) {
                    var key;
                    var status;
                    if (val.name == "二手房") {
                        key = "second_house";
                    } else if (val.name == "区域气泡") {
                        key = "area_bubble";
                    } else if (val.name == "拿地信息") {
                        key = "lots_info";
                    }
                    if (val.state) {
                        status = 1;
                    } else {
                        status = 2;
                    }
                    let postData = {
                        employee_id: this.$store.state.trackMessages
                            .login_employee_id,
                        key: key,
                        status: status
                    };
                    this.axios
                        .post("/backend-api/bk-map/set-map-check", postData)
                        .then(res => {
                            console.log(res.data);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            // 校验8个数字输入框
            changeCode() {
                this.$nextTick(() => {
                    if (this.price.sumPrice.min !== null) {
                        this.price.sumPrice.min = this.price.sumPrice.min.replace(
                            /[^\d]/g,
                            ""
                        );
                    }
                    if (this.price.sumPrice.max !== null) {
                        this.price.sumPrice.max = this.price.sumPrice.max.replace(
                            /[^\d]/g,
                            ""
                        );
                    }
                    if (this.price.firstPay.min !== null) {
                        this.price.firstPay.min = this.price.firstPay.min.replace(
                            /[^\d]/g,
                            ""
                        );
                    }
                    if (this.price.firstPay.max !== null) {
                        this.price.firstPay.max = this.price.firstPay.max.replace(
                            /[^\d]/g,
                            ""
                        );
                    }
                    if (this.price.unitPrice.min !== null) {
                        this.price.unitPrice.min = this.price.unitPrice.min.replace(
                            /[^\d]/g,
                            ""
                        );
                    }
                    if (this.price.unitPrice.max !== null) {
                        this.price.unitPrice.max = this.price.unitPrice.max.replace(
                            /[^\d]/g,
                            ""
                        );
                    }
                    if (this.area.min !== null) {
                        this.area.min = this.area.min.replace(/[^\d.]/g, '');
                        this.area.min = this.area.min.replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                        this.area.min = this.area.min.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                    }
                    if (this.area.max !== null) {
                        this.area.max = this.area.max.replace(/[^\d.]/g, '');
                        this.area.max = this.area.max.replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                        this.area.max = this.area.max.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                    }
                });
            },
            // 点击  确定 添加筛选条件
            addFilter(type, isAdd) {
                let that = this;
                let arr = [];
                let obj = {};
                let obj1;
                let obj2;
                let deArr;
                // 确认价格
                if (type === 0) {
                    for (var key in this.price) {
                        let base = this.price[key];
                        arr = [];
                        switch (base.name) {
                            case "总价":
                                obj = {};
                                if (base.min !== "" && base.max !== "") {
                                    obj.text =
                                        "总价：" +
                                        base.min +
                                        " -- " +
                                        base.max +
                                        "万元";
                                    obj.state = true;
                                    obj.min = base.min;
                                    obj.max = base.max;
                                    obj.name = "总价";
                                } else if (base.min === "" && base.max !== "") {
                                    obj.text =
                                        "总价：" + 0 + " -- " + base.max + "万元";
                                    obj.state = true;
                                    obj.min = base.min;
                                    obj.max = base.max;
                                    obj.name = "总价";
                                } else if (base.min !== "" && base.max === "") {
                                    obj.text = "总价：" + base.min + " -- 不限 万元";
                                    obj.state = true;
                                    obj.min = base.min;
                                    obj.max = base.max;
                                    obj.name = "总价";
                                }
                                break;
                            case "单价":
                                obj1 = {};
                                if (base.min !== "" && base.max !== "") {
                                    obj1.text =
                                        "单价：" +
                                        base.min +
                                        " -- " +
                                        base.max +
                                        "元/㎡";
                                    obj1.state = true;
                                    obj1.min = base.min;
                                    obj1.max = base.max;
                                    obj1.name = "单价";
                                } else if (base.min === "" && base.max !== "") {
                                    obj1.text =
                                        "单价：" + 0 + " -- " + base.max + "元/㎡";
                                    obj1.state = true;
                                    obj1.min = base.min;
                                    obj1.max = base.max;
                                    obj1.name = "单价";
                                } else if (base.min !== "" && base.max === "") {
                                    obj1.text =
                                        "单价：" + base.min + " -- 不限 元/㎡";
                                    obj1.state = true;
                                    obj1.min = base.min;
                                    obj1.max = base.max;
                                    obj1.name = "单价";
                                }
                                break;
                            case "首付":
                                obj2 = {};
                                if (base.min !== "" && base.max !== "") {
                                    obj2.text =
                                        "首付：" +
                                        base.min +
                                        " -- " +
                                        base.max +
                                        "万元";
                                    obj2.ratio = that.price.firstPay.ratio;
                                    obj2.state = true;
                                    obj2.min = base.min;
                                    obj2.max = base.max;
                                    obj2.name = "首付";
                                } else if (base.min === "" && base.max !== "") {
                                    obj2.text =
                                        "首付：" + 0 + " -- " + base.max + "万元";
                                    obj2.ratio = that.price.firstPay.ratio;
                                    obj2.state = true;
                                    obj2.min = base.min;
                                    obj2.max = base.max;
                                    obj2.name = "首付";
                                } else if (base.min !== "" && base.max === "") {
                                    obj2.text =
                                        "首付：" + base.min + " -- 不限 万元";
                                    obj2.ratio = that.price.firstPay.ratio;
                                    obj2.state = true;
                                    obj2.min = base.min;
                                    obj2.max = base.max;
                                    obj2.name = "首付";
                                }
                                break;
                        }
                        if (JSON.stringify(obj) !== "{}") {
                            arr.push(obj);
                        }
                        if (JSON.stringify(obj1) !== "{}") {
                            arr.push(obj1);
                        }
                        if (JSON.stringify(obj2) !== "{}") {
                            arr.push(obj2);
                        }
                        this.controlData[type].condition = arr;
                    }
                    this.priceBase = this.deepCopy(this.price);
                    if (!isAdd) {
                        this.submitFilter("3893", "价格");
                    }
                }
                // 确认面积
                if (type === 1) {
                    if (that.area.min !== "" && that.area.max !== "") {
                        obj.text =
                            "面积：" + that.area.min + " -- " + that.area.max + "㎡";
                        obj.min = that.area.min;
                        obj.max = that.area.max;
                        obj.name = "面积";
                        obj.state = true;
                    } else if (that.area.min === "" && that.area.max !== "") {
                        obj.text = "面积：" + 0 + " -- " + that.area.max + "㎡";
                        obj.min = that.area.min;
                        obj.max = that.area.max;
                        obj.name = "面积";
                        obj.state = true;
                    } else if (that.area.min !== "" && that.area.max === "") {
                        obj.text = "面积：" + that.area.min + " -- 不限 ㎡";
                        obj.min = that.area.min;
                        obj.max = that.area.max;
                        obj.name = "面积";
                        obj.state = true;
                    }
                    if (JSON.stringify(obj) !== "{}") {
                        arr.push(obj);
                    }
                    this.controlData[type].condition = arr;
                    this.areaBase = this.deepCopy(this.area);
                    if (!isAdd) {
                        this.submitFilter("3893", "面积");
                    }
                }
                // 户型
                if (type === 2) {
                    let directArr = [];
                    let base = this.houseType;
                    // 添加户型 需要组装id 和 状态
                    arr = base.filter(item => {
                        if (item.text != "不限") {
                            return item.state === true;
                        }
                    });
                    this.controlData[type].condition = this.deepCopy(arr);
                    // 是否是虚拟城市
                    if (!this.realCityFlag) {
                        let bases = this.directType;
                        directArr = bases.filter(item => {
                            return item.state === true;
                        });
                        this.controlData[type].conditionMore = this.deepCopy(directArr);
                        this.directTypeBase = this.deepCopy(this.directType);
                    }
                    this.houseTypeBase = this.deepCopy(this.houseType);
                    if (!isAdd) {
                        this.submitFilter("3893", "户型");
                    }
                }
                // 业态
                if (type === 3) {
                    let base = this.projectType;
                    // 添加户型 需要组装id 和 状态
                    arr = base.filter(item => {
                        return item.state === true;
                    });
                    this.controlData[type].condition = this.deepCopy(arr);
                    this.projectTypeBase = this.deepCopy(this.projectType);
                    if (!isAdd) {
                        this.submitFilter("3893", "业态");
                    }
                }
                // 特色
                if (type === 4) {
                    let base = this.projectTese;
                    // 添加户型 需要组装id 和 状态
                    arr = base.filter(item => {
                        if (item.text != "不限") {
                            return item.state === true;
                        }
                    });
                    this.controlData[type].condition = this.deepCopy(arr);
                    this.projectTeseBase = this.deepCopy(this.projectTese);
                    this.submitFilter("3893", "特色");
                }
                // 区域
                if (type === 7) {
                    let base = this.areaType;
                    arr = base.filter(item => {
                        return item.state === true;
                    });
                    this.controlData[type].condition = this.deepCopy(arr);
                    this.areaTypeBase = this.deepCopy(this.areaType);
                }
                // 产证唯一&装修
                if (type === 8) {
                    let base = this.houseYear;
                    let deBase = this.decoreateType;
                    arr = base.filter(item => {
                        return item.state === true;
                    });
                    deArr = deBase.filter(item => {
                        return item.state === true;
                    });
                    this.controlData[type].condition = this.deepCopy(arr);
                    this.houseYearBase = this.deepCopy(this.houseYear);
                    this.controlData[type].conditionMore = this.deepCopy(deArr);
                    this.decoreateTypeBase = this.deepCopy(this.decoreateType);
                }
                // 楼层&电梯
                if (type === 9) {
                    let moreArr = [];
                    let floorBase = this.floorType;
                    let base = this.floorNum;
                    let deBase = this.totalFloorNum;
                    arr = base.filter(item => {
                        return item.state === true;
                    });
                    deArr = deBase.filter(item => {
                        return item.state === true;
                    });
                    moreArr = floorBase.filter(item => {
                        return item.state === true;
                    });
                    this.controlData[type].condition = this.deepCopy(arr);
                    this.floorNumBase = this.deepCopy(this.floorNum);
                    this.controlData[type].conditionMore = this.deepCopy(deArr);
                    this.totalFloorNumBase = this.deepCopy(this.totalFloorNum);
                    this.controlData[type].conditionTri = this.deepCopy(moreArr);
                    this.floorTypeBase = this.deepCopy(this.floorType);
                }
                // 关闭选择框
                this.closeAllFilter();
                this.shadowOpen = false;
                // this.setSearch();
                // 控制地图展示
                // this.isShowMap = true;
            },
            filterClientInfo() {
                let arr = this.clientNeedDesc;
                arr.forEach(item => {
                    if (item.title == "客户名") {
                        this.clientName = item.value;
                    }
                    if (item.title == "手机号") {
                        this.clientPhone = item.value;
                    }
                });
            },
            filtration(sum, arr) {
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < sum.length; j++) {
                        if (arr[i].id == sum[j].id) {
                            sum[j].state = true;
                        }
                    }
                }
                return sum;
            },
            // 选择通勤城市 选择区域后开始计算
            checkCommutCity(id) {
                // 通勤模式下选择区域
                this.track("3898");
                let disName = this.filterName(id);
                this.$refs.map.startCommuting(
                    id,
                    disName,
                    this.commutOpts.trip,
                    this.commutOpts.tripTime
                );
                this.$refs.map.closeCursor();
            },
            filterName(id) {
                let disName = "";
                // 拿这个城市id 去处理通勤
                let base = this.districtTotal;
                let arr = base.filter(item => {
                    return item.id == id;
                });
                if (arr.length > 0) {
                    disName = arr[0].text;
                }
                return disName;
            },
            // 切换城市
            changeCity(id) {
                // 切换城市重新缓存数据
                //this.getFloorCommonInfo();
                this.firstGet = false;
                this.cityId = id;
                this.$store.dispatch("get_cityinfo", {
                    cityId: this.cityCon.currentCityId,
                    cityName: this.cityCon.currentCity
                });
                PubSub.publish("closeCurrenPage");
                this.getCondition();
                this.setSearch();
                // 关闭画圈找房
                if (this.customTag == true) {
                    this.customTag = false;
                    this.$refs.map.closeCricle();
                }
                // 关闭鼠标找房模式
                this.commutType = false;
                if (this.signPoint == true) {
                    this.signPoint = false;
                    this.$refs.map.closeCursor();
                }
                // 清空筛选项
                this.controlData[2].condition = [];
                this.controlData[3].condition = [];
                this.controlData[4].condition = [];
                this.controlData[5].condition = [];
                this.controlData[6].condition = [];
            },
            // 关闭右侧详情
            closeSidePage(val) {
                let dom = document.querySelector(".right-wrap .right-bar");
                let btn = document.querySelector(".right-wrap .right-btn-wrap");
                let redraw = document.querySelector(".head-bar .redraw");
                if (val == false) {
                    dom.style.width = "0px";
                    if (this.$refs.rigPos) {
                        this.$refs.rigPos.style.right = "6px";
                    }
                    if (btn) {
                        btn.style.right = "0px";
                    }
                    if (redraw) {
                        redraw.style.right = "20px";
                    }
                }
                if (val == true) {
                    dom.style.width = "350px";
                    if (this.$refs.rigPos) {
                        this.$refs.rigPos.style.right = "356px";
                    }
                    if (btn) {
                        btn.style.right = "350px";
                    }
                    if (redraw) {
                        redraw.style.right = "370px";
                    }
                }
            },
            // 右侧悬浮筛选项
            submitFilterOpt(id, text, state) {
                // 埋点信息 提交筛选条件
                let moreInfo = {
                    screen_height: commonFun.ScreenHeight(),
                    screen_width: commonFun.ScreenWidth(),
                    device_type: commonFun.getDevice().device,
                    os: commonFun.getOS().os,
                    os_version: commonFun.getOS().os_version,
                    browser: commonFun.getBrowse().browser,
                    browser_version: commonFun.getBrowse().browser_version
                };
                let trackAll = Object.assign(
                    {},
                    moreInfo,
                    this.$store.state.trackMessages
                );
                let trackData = {
                    extrack_arr: {
                        open_type: state,
                        filter_type: text,
                        ini_params: trackAll
                    },
                    track_id: id
                };
                // 请求埋点接口
                let url = this.$store.state.backendApi + "/send-data/index";
                trackAxios
                    .post(url, trackData)
                    .then(res => {
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 提交筛选埋点
            submitFilter(id, text) {
                // 埋点信息 提交筛选条件
                let moreInfo = {
                    screen_height: commonFun.ScreenHeight(),
                    screen_width: commonFun.ScreenWidth(),
                    device_type: commonFun.getDevice().device,
                    os: commonFun.getOS().os,
                    os_version: commonFun.getOS().os_version,
                    browser: commonFun.getBrowse().browser,
                    browser_version: commonFun.getBrowse().browser_version
                };
                let trackAll = Object.assign(
                    {},
                    moreInfo,
                    this.$store.state.trackMessages
                );
                let trackData = {
                    extrack_arr: {
                        filter_type: text,
                        ini_params: trackAll
                    },
                    track_id: id
                };
                // 请求埋点接口
                let url = this.$store.state.backendApi + "/send-data/index";
                trackAxios
                    .post(url, trackData)
                    .then(res => {
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            deepCopy(obj) {
                var result = Array.isArray(obj) ? [] : {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === "object") {
                            result[key] = this.deepCopy(obj[key]);
                        } else {
                            result[key] = obj[key];
                        }
                    }
                }
                return result;
            },
            // 点击取消 关闭当前弹窗
            closeAllFilter(type) {
                // 清空当前弹框中输入框的值
                if (type === 0) {
                    this.price = this.deepCopy(this.priceBase);
                }
                if (type === 1) {
                    this.area = this.deepCopy(this.areaBase);
                }
                if (type === 2) {
                    if (this.houseTypeBase.length > 0) {
                        this.houseType = this.deepCopy(this.houseTypeBase);
                    }
                    if (!this.realCityFlag && this.directTypeBase.length > 0) {
                        this.directType = this.deepCopy(this.directTypeBase);
                    }
                }
                if (type === 3) {
                    if (this.projectTypeBase.length > 0) {
                        this.projectType = this.deepCopy(this.projectTypeBase);
                    }
                }
                if (type === 4) {
                    if (this.projectTeseBase.length > 0) {
                        this.projectTese = this.deepCopy(this.projectTeseBase);
                    }
                }
                if (type === 7) {
                    if (this.areaTypeBase.length > 0) {
                        this.areaType = this.deepCopy(this.areaTypeBase);
                    }
                }
                if (type === 8) {
                    if (this.houseYearBase.length > 0) {
                        this.houseYear = this.deepCopy(this.houseYearBase);
                    }
                    if (this.decoreateTypeBase.length > 0) {
                        this.decoreateType = this.deepCopy(this.decoreateTypeBase);
                    }
                }
                if (type === 9) {
                    if (this.floorTypeBase.length > 0) {
                        this.floorType = this.deepCopy(this.floorTypeBase);
                    }
                    if (this.floorNumBase.length > 0) {
                        this.floorNum = this.deepCopy(this.floorNumBase);
                    }
                    if (this.totalFloorNumBase.length > 0) {
                        this.totalFloorNum = this.deepCopy(this.totalFloorNumBase);
                    }
                }
                let cards = document.querySelectorAll(".left-inner .card");
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i]) {
                        cards[i].style.display = "none";
                    }
                }
                this.currentIndex = "";
                this.popFlag = false;
                this.shadowOpen = false;
            },
            // 点击卡片 处理禁止继承父元素的点击事件
            cardClick(e) {
                if (e && e.stopPropagation) {
                    // 非IE
                    e.stopPropagation();
                } else {
                    // IE
                    window.event.cancelBubble = true;
                }
            },
            // 用来展示选项相对应的弹窗
            showPop(para, index, event) {
                this.currentIndex = index;
                // 标签卡片循环一遍都隐藏  只有当前点击的展开
                let cards = document.querySelectorAll(".left-inner .card");
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i]) {
                        cards[i].style.display = "none";
                    }
                }
                // 显示当前的pop弹窗
                let divDom = ".option" + index;
                if (event.target.querySelector(divDom)) {
                    event.target.querySelector(divDom).style.display = "block";
                }
                this.shadowOpen = true;
            },
            // 显示分享弹窗
            openMadel() {
                this.track("3915");
                this.$refs.children.closeModel();
                //window.open(`/dist/housePurchaseKnowledge?city_id=${this.city_id}&order_id=${this.orderId}`);
            },
            // 显示楼盘对比弹窗
            openFloorModel() {
                this.track("3913");
                // 去掉默认贷款内容的请求
                //this.$refs.floor.getSearch(1)
                this.$refs.houseContrastBar.openModel();
                // 打开链接时将需要传递的数据放入本地进行存储
                localStorage.setItem(
                    "controlData",
                    JSON.stringify(this.controlData)
                );
                /* window.open(
                    `/dist/chooseHouseContrast?order_id=${this.orderId}&city_id=${this.city_id}`
                ); */
            },
            // 获取筛选条件
            getCondition() {
                let city = this.cityId;
                let params = {
                    order_id: this.orderId,
                    city_id: city
                };
                this.axios
                    .post("/backend-api/bk-map/get-search-where", params)
                    .then(res => {
                        let result = res.data;
                        if (result.code === 0) {
                            this.houseType = this.upData(
                                result.data.house_type,
                                "户型"
                            );
                            this.directType = this.upData(
                                result.data.orientation_list,
                                "朝向"
                            );
                            this.openTimeType = this.upData(
                                result.data.open_time_type,
                                "开盘"
                            );
                            this.projectTese = this.upData(
                                result.data.project_tese,
                                "特色"
                            );
                            this.projectType = this.upData(
                                result.data.project_type,
                                "业态"
                            );
                            // 虚拟城市才会展示板块，而且虚拟城市只会是主城，所以只需要取第一个
                            this.areaType = this.upData(
                                result.data.area_list[0].areaList,
                                "区域"
                            );
                            this.houseYear = this.upData(
                                result.data.house_year,
                                "产证唯一"
                            );
                            this.decoreateType = this.upData(
                                result.data.decoration_status,
                                "装修"
                            );
                            this.totalFloorNum = this.upData(
                                result.data.total_floor_num,
                                "总楼层"
                            );
                            this.floorType = this.upData(
                                result.data.elevator_list,
                                "电梯"
                            );
                            this.floorNum = this.upData(
                                result.data.height_type,
                                "楼层"
                            );
                        }
                    })
                    .then(() => {
                        if (this.firstGet) {
                            this.projectType = this.filtration(
                                this.projectType,
                                this.userNeedProjectType
                            );
                            this.houseType = this.filtration(
                                this.houseType,
                                this.userNeedHouseType
                            );
                            this.addFilter(2, true);
                            this.addFilter(3, true);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 处理接口返回数据
            upData(arr, name) {
                if (!arr) {
                    return [];
                }
                arr.forEach(item => {
                    if (name) {
                        item.state = false;
                        item.name = name;
                    } else {
                        item.state = false;
                    }
                });
                return arr;
            },
            // 获取当前市
            getCity() {
                this.axios
                    .get(
                        "/backend-api/bk-map/get-all-city-group"
                    )
                    .then(res => {
                        let result = res.data;
                        if (result.code === 0) {
                            result.data.forEach((city, index) => {
                                // 给第一层城市添加为主城标识
                                city.type = 'major'
                                city.isOpen = true;
                                if (this.cityCon.currentCityId == city.id) {
                                    city.state = true;
                                    city.scrollFlag = true;
                                    this.checkCityCon.push({
                                        type: 'major',
                                        majorId: city.id,
                                        id: city.id,
                                        text: city.text,
                                        isRealCity: city.is_real_city,
                                        realCityName: city.real_text
                                    });
                                }
                            });
                            this.checkCityConBase = this.deepCopy(this.checkCityCon);
                            this.cityTotal = result.data;
                            this.cityTotalBase = result.data;
                            this.getCityGroupSubWay();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
        },
        computed: {
            // 选中的区域个数
            areaTypeChosen() {
                let num = [];
                if (this.areaType) {
                    num = this.areaType.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            // 户型选中个数
            hxChosen() {
                let num = [];
                if (this.houseType) {
                    num = this.houseType.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            // 选中的朝向个数
            directChosen() {
                let num = [];
                if (this.directType) {
                    num = this.directType.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            // 产权唯一选中个数
            houseChosen() {
                let num = [];
                if (this.houseYear) {
                    num = this.houseYear.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            // 装修
            decorateChosen() {
                let num = [];
                if (this.decoreateType) {
                    num = this.decoreateType.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            // 楼层
            floorChosen() {
                let num = [];
                if (this.floorNum) {
                    num = this.floorNum.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            // 总楼层
            totalFloorChosen() {
                let num = [];
                if (this.totalFloorNum) {
                    num = this.totalFloorNum.filter(item => {
                        return item.state === true;
                    });
                }
                return num.length;
            },
            subwayListData() {
                return this.subwayList;
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
                        ini_params: Object.assign(
                            {},
                            state.trackMessages,
                            this.moreInfo
                        )
                    };
                },
                city_id: state => state.cityInfo.cityId
            }),
            ...mapActions(["get_cityinfo", "get_trackmessages", "get_backend_api"])
        },
        watch: {
            //customTag
            customTag: {
                deep: true,
                handler: function(val) {
                    if (val == false) {
                        this.isRedraw = false;
                    }
                }
            },
            // 是否是真实城市监听
            realCityFlag: {
                deep: true,
                handler: function(val) {
                    if (!val) {
                        // 修改筛选项文案和展示
                        this.controlData[2].name = '户型&朝向';
                        this.controlData[2].conditionMore = [];
                        let arr = [
                            {
                                name: "区域",
                                condition: [],
                                key: 'distri'
                            },
                            {
                                name: "产证唯一&装修",
                                condition: [],
                                conditionMore: [],
                                key: 'uniDecorate'
                            },
                            {
                                name: "楼层&电梯",
                                condition: [],
                                conditionMore: [],
                                conditionTri: [],
                                key: 'floor'
                            }
                        ];
                        // 合并数组
                        this.controlData = this.controlData.concat(arr);
                    } else {
                        this.controlData[2].name = '户型';
                        this.controlData[2].conditionMore = [];
                        let arr = this.controlData.filter((item, i) => {
                            return i < 7
                        });
                        this.controlData = arr;
                    }
                }
            }
        },
        components: {
            BMaps,
            SlideBar,
            SlideInfoPage,
            ContrastMadel,
            ReportMadel,
            HouseTypeDialog,
            ChooseHouseBar
        }
    };
</script>

<style lang="less" scoped>
.option9 {
    .options {
        display: flex;
    }
    .handle {
        padding: 0 148px;
        box-sizing: border-box;
    }
}
.left-wrap {
    .left-inner {
        .filter-box {
            .option7 {
                .handle {
                    margin-top: 5px;
                }
            }
        }
    }
}
.option7 {
    .options {
        .option-item-box {
            width: auto;
            &:first-of-type {
                padding-left: 0;
            }
            .option-item-bd {
                .opt-tab {
                    width: auto;
                    margin: 0 10px 15px 0;
                    &:last-of-type {
                        margin: 0 0 15px 0;
                    }
                }
            }
        }
    }
}
.option8 {
    .options {
        display: flex;
    }
    .handle {
        padding: 0 76px;
        box-sizing: border-box;
    }
}
.option-change {
    .options {
        display: flex;
    }
    .handle {
        padding: 0 76px;
        box-sizing: border-box;
    }
}
.options {
    .option-item-box {
        flex: 1;
        width: 144px;
        border-right: 1px dotted #e6e6e6;
        padding-left: 19px;
        box-sizing: border-box;
        &:last-of-type {
            border-right: none;
        }
        &:first-of-type {
            padding-left: 12px;
        }
        .option-item-hd {
            width: 100%;
            line-height: 17px;
            margin-bottom: 12px;
            font-size: 12px;
            font-family: PingFangSC-Medium,PingFang SC;
            font-weight: 500;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #333;
            &>span {
                float: left;
            }
        }
        .option-item-bd {
            overflow: hidden;
            .opt-tab {
                width: 100%;
                margin: 0 0 10px 0;
                &:last-of-type {
                    margin-bottom: 0;
                }
                .state {
                    margin-top: 2px;
                }
            }
        }
    }
}
.search-container {
    height: 100%;
    .add-shadow {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.3);
        z-index: 66;
    }
}
#fake {
    height: 0;
}
// 城市群修改
.left-inner{
    .check-city {
        .choice-city{
            height: 36px;
            .choice-city-inner{
                overflow: hidden; 
                padding: 9px 12px;
                >span{
                    float: left;
                    display: inline-block;
                }
            }
            img{
                float: left;
                width: 16px;
                height: 16px;
                z-index: 1;
                margin-right: 6px;
            }
            .pull-city{
                width: 12px;
                height: 12px;
                margin-top: 3px;
                margin-right: 0;
            }
            .trans-img{
                transform: rotateX(-180deg);
            }
            .city-name-con{
                width: 55px;
                height: 17px;
                line-height: 17px;
                overflow: hidden;
                white-space: nowrap;
                margin-right: 5px;
                color: #3e4254;
                font-weight: bold;
            }
        }
    }
    .city-group-list{
        position: absolute;
        z-index: 2;
        background: #fff;
        width: 120px;
        overflow-x: hidden;
        border-radius: 0 0 4px 4px;
        box-shadow: 0 1px 7px 0 rgba(0,0,0,0.10);
        .major-con{
            height: 263px;
            overflow-y: auto;
            overflow-x: hidden;
            width: 140px;
            box-sizing: border-box;
            padding-top: 4px;
            /deep/ .el-checkbox__label{
                color: #3e4254;
            }
            .major-city{
                width: 140px;
                min-height: 34px;
                font-size: 14px;
                .check-aff-city{
                    float: right;
                    display: block;
                    width: 16px;
                    margin-right: 24px;
                    img{
                        width: 8px;
                        height: 8px;
                        margin-top: 11px;
                    }
                }
                >.check-btn{
                    padding-left: 12px;
                    display: block;
                    height: 34px;
                    line-height: 34px;
                    &:hover{
                        background: #f4f6f9;
                    }
                }
                .sub-city{
                    font-size: 12px;
                    >.check-btn{
                        display: block;
                        height: 32px;
                        line-height: 32px;
                        padding-left: 30px;
                        border-bottom: 1px dashed #fff;
                        border-top: 1px dashed #fff;
                        &:hover{
                            border-top: 1px dashed #e6e6e6;
                            border-bottom: 1px dashed #e6e6e6;
                        }
                        /deep/ .el-checkbox{
                            .el-checkbox__label{
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
        }
        .handle{
            height: 37px;
            line-height: 37px;
            padding: 0 12px;
            box-shadow: 0 0px 4px 0 rgba(0, 0, 0, 0.1);
            .cancel {
                color: #8d8d8d;
                float: left;
            }
            .affirm{
                color: #33a1ff;
                float: right;
            }
        }
    }
    .opt-wrap{
        overflow: hidden;
        &:first-child{
            padding-top: 0;
        }
        .name-wrap{
            margin-bottom: 10px;
        }
        .city-name{
            display: inline-block;
            height: 26px;
            line-height: 26px;
            background: #f4f6f9;
            padding: 0 15px;
            border-radius: 2px;
        }
    }
    .filter-box {
        .option5{
            .options{
                &.txt-hint{
                    padding-bottom: 20px;
                    text-align: center;
                }
            }
        }
    } 
}
.search-container .left-wrap {
    float: left;
    width: 140px;
    height: 100%;
    position: relative;
    z-index: 7;
    .left-opt {
        width: 240px;
        max-height: calc(100% - 150px);
        position: absolute;
        left: 140px;
        top: 58px;
        z-index: 2;
        overflow-x: hidden;
        overflow-y: auto;
        .opt-con {
            overflow-y: auto;
            height: 100%;
            padding-top: 3px;
        }
        .blo-box {
            overflow: hidden;
        }
        .filt-option {
            cursor: pointer;
            .opt-in {
                color: #fff;
                padding: 6px 10px;
                border-radius: 15px;
                margin-left: 6px;
                margin-bottom: 8px;
                overflow: hidden;
                display: inline-block;
                background-color: #33a1ff;
                box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.2);
                &.hide-opt {
                    background-color: #abb0b5;
                    box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.2);
                }
            }
            .option {
                overflow: hidden;
                float: left;
            }
            img {
                width: 16px;
                height: 16px;
                float: left;
                margin-left: 10px;
            }
        }
    }
}
.search-container .right-wrap {
    margin-left: 140px;
    height: 100%;
    position: relative;
    .head-bar {
        box-sizing: border-box;
        padding: 10px 16px;
        position: fixed;
        top: 0;
        left: 140px;
        width: calc(100% - 140px);
        height: 58px;
        z-index: 5;
        background-color: rgba(255, 255, 255, 0.7);
        .head-inner {
            min-width: 1300px;
            height: 38px;
            > div {
                float: left;
            }
        }
        .list {
            border-top: 1px solid #eee;
            background: #ffffff;
            box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
        }
        .opt {
            background-color: #fff;
            height: 36px;
            line-height: 36px;
            z-index: 3;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
            border-radius: 2px;
            &.mouse-sign {
                background-color: #33a1ff;
                color: #fff;
            }
            &.txt {
                box-sizing: border-box;
                padding: 0 10px;
                font-size: 14px;
                z-index: 4;
                img {
                    position: relative;
                    top: 10px;
                    width: 14px;
                    height: 14px;
                }
            }
            &.active {
                color: #fff;
                background-color: #33a1ff;
            }
        }
        .search-house {
            position: relative;
            width: 160px;
            .house-name {
                color: #666;
            }
            img {
                position: absolute;
                left: 10px;
                top: 12px;
                width: 14px;
                height: 14px;
                z-index: 3;
            }
        }
        .screen-add {
            margin: 0 16px;
            height: 36px;
            line-height: 36px;
            div {
                cursor: pointer;
                float: left;
                margin-right: 10px;
            }
            .tit {
                margin-right: 10px;
            }
            .check-city {
                width: 96px;
            }
            .reset {
                background: #ff5c47;
                color: #fff;
                padding: 0 10px;
                font-size: 14px;
            }
            .trip-wrap {
                height: 36px;
                .trip-opt {
                    padding: 10px;
                    display: block;
                    border-right: 1px dotted #eee;
                    height: 16px;
                    line-height: 16px;
                    float: left;
                    &:last-child {
                        border-right: none;
                    }
                    &:hover {
                        color: #33a1ff;
                    }
                    &.active {
                        border-right: 0;
                        background: #33a1ff;
                        color: #fff;
                    }
                }
            }
        }
        .demand {
            padding: 0 10px;
            width: 200px;
            height: 36px;
            background: #fff;
            line-height: 36px;
            /*overflow: hidden;*/
            z-index: 4;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
            border-radius: 2px;
            position: relative;
            .light-txt {
                display: inline-block;
                font-size: 14px;
                color: #33a1ff;
                white-space: nowrap;
                overflow: hidden;
                &:first-child {
                    width: 43px;
                    margin-right: 2px;
                }
                &:nth-child(2) {
                    width: 90px;
                }
            }
            .exchange {
                position:absolute;
                right: 3px;
                float: right;
                line-height: 34px;
                cursor: pointer;
            }
            .list {
                position: absolute;
                top: 36px;
                left: 0;
                z-index: 6;
                width: 200px;
                padding: 10px 10px;
                max-height: 600px;
                overflow-y: auto;
                transition: all 1s;
                .list-inner {
                    height: 100%;
                }
                .opt-need {
                    overflow: hidden;
                    line-height: 20px;
                    margin-bottom: 5px;
                    .th {
                        width: 60px;
                        float: left;
                        margin-right: 8px;
                        word-wrap: break-word;
                        word-break: break-all;
                        color: #77808a;
                    }
                    .td {
                        width: 125px;
                        float: right;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                }
            }
        }
        .order-detail {
            cursor: pointer;
            margin-left: 20px;
            font-size: 16px;
            color: #fff;
            background-color: #ff5c47;
            box-shadow: 0 2px 4px 0 rgba(255, 92, 71, 0.3);
            border-radius: 2px;
        }
        .redraw {
            cursor: pointer;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
            background: #33a1ff;
            color: #fff;
            position: absolute;
            right: 20px;
            z-index: 4;
            top: 60px;
            width: 68px;
            text-align: center;
            font-size: 14px;
            line-height: 38px;
            img {
                position: relative;
                top: 11px;
                width: 14px;
                height: 14px;
            }
        }
    }
    .list-wrap {
        .hisHouse {
            position: fixed;
            top: 60px;
            left: 156px;
            width: 160px;
            z-index: 8;
            background-color: #fff;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        }
        .hisAddress {
            position: fixed;
            top: 60px;
            left: 414px;
            width: 160px;
            z-index: 8;
            background-color: #fff;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        }
    }
    .foot-bar {
        position: fixed;
        bottom: 5px;
        z-index: 3;
        .shadow-box {
            background-color: #fff;
            height: 30px;
            line-height: 30px;
            z-index: 3;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
            border-radius: 2px;
        }
        .cutline {
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.4);
            .desc {
                overflow: hidden;
                margin-bottom: 10px;
                span {
                    display: block;
                    float: left;
                }
                .th {
                }
                .td {
                    .item {
                        margin-left: 10px;
                        i {
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            border-radius: 10px;
                            position: relative;
                            top: 3px;
                            margin-right: 2px;
                            border: 2px solid #fff;
                            &.school {
                                background-color: #87a6ff;
                            }
                            &.shop {
                                background-color: #e1ba79;
                            }
                            &.hospital {
                                background-color: #ec828d;
                            }
                        }
                    }
                }
            }
            .map-tab {
                .map-opt {
                    padding: 7px 24px;
                    display: block;
                    border-right: 1px dotted #eee;
                    height: 16px;
                    line-height: 16px;
                    float: left;
                    cursor: pointer;
                    &:hover {
                        color: #33a1ff;
                    }
                    &.active {
                        border-right: 0;
                        background: #33a1ff;
                        color: #fff;
                    }
                }
            }
        }
    }
    .right-bar {
        position: fixed;
        right: 0;
        /*right:0;*/
        bottom: 0;
        height: 632px;
        width: 0;
        z-index: 3;
        .shadow-box {
            background-color: #fff;
            height: 30px;
            line-height: 30px;
            z-index: 3;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
            border-radius: 2px;
        }
        .right-btn-wrap {
            position: absolute;
            right: -3px;
            bottom: 0;
            margin-bottom: 15px;
            .contrast {
                display: inline-block;
                position: absolute;
                left: -14px;
                top: -1px;
                width: 17px;
                height: 17px;
                line-height: 19px;
                background-color: #fff;
                border-radius: 50%;
                margin-left: 5px;
                font-size: 13px;
                color: #ff5c47;
                box-shadow: 0 2px 4px 0 rgba(255, 92, 71, 0.2);
            }
            .rig-btn {
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                color: #fff;
                float: left;
                line-height: 13px;
                width: 28px;
                padding: 7px 7px 2px 9px;
                border-radius: 50% 0 0 50%;
                text-align: center;
                margin-bottom: 6px;
                &:last-child {
                    margin-bottom: 0;
                }
                &.enter-into {
                    position: relative;
                    background-color: #ff5c47;
                    &:hover {
                        transform: scale(1.1);
                    }
                }
                &.share-data {
                    background-color: #3da6ff;
                    &:hover {
                        transform: scale(1.1);
                    }
                }
                &.share-into {
                    background: #ff8800;
                    &:hover {
                        transform: scale(1.1);
                    }
                }
            }
        }
        .right-pos {
            position: absolute;
            right: 6px;
            bottom: 160px;
            height: 60px;
            .edit {
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-bottom: 1px dotted #eee;
                line-height: 30px;
                text-align: center;
                background-color: #fff;
                &:last-child {
                    border-bottom: none;
                }
                img {
                    width: 12px;
                    height: 12px;
                    vertical-align: middle;
                }
            }
        }
    }
}
.left-opt::-webkit-scrollbar,
.demand .list::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.left-opt::-webkit-scrollbar-thumb,
.demand .list::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.2);
}
.left-inner .filter-box {
    position: relative;
    cursor: pointer;
    margin-bottom: 6px;
    box-sizing: border-box;
    padding: 9px 12px;
    background-color: #fff;
    height: 34px;
}
.left-shadow {
    position: absolute;
    width: 129px;
    height: 100%;
    z-index: 1;
}
.left-inner .condition-box {
    background-color: #fff;
    box-sizing: border-box;
    padding: 8px 12px;
    margin-bottom: 8px;
}
.left-inner .condition-box .hd {
    margin-bottom: 8px;
}
.left-inner .condition-box .bd .houses {
    display: inline-block;
    border-radius: 2px;
    color: #666;
    padding: 2px 6px;
    margin-bottom: 8px;
    cursor: pointer;
}
.left-inner .condition-box .bd .houses:last-of-type {
    margin-bottom: 0;
}
.left-inner .other-filter .bd .houses {
    background-color: #f5f5f5;
}
.left-inner .map-set .bd .houses.checkBg,
.left-inner .other-filter .bd .houses.checkBg {
    background: #33a1ff;
    color: #fff;
}
.left-inner .map-set .bd .houses {
    background-color: #ecf9ff;
}
.left-inner .map-set .mulyiple {
    width: 12px;
    height: 12px;
    margin-top: 2px;
    display: inline-block;
}
.left-inner .look-right {
    float: right;
    width: 8px;
    height: 8px;
    margin-top: 4px;
    pointer-events: none;
}
.left-inner .filter-box .card {
    display: none;
    z-index: 4;
    position: absolute;
    left: 120px;
    top: 0;
    box-sizing: border-box;
    padding: 20px 12px;
    background-color: #fff;
    box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.left-inner .filter-box .card .handle {
    font-size: 0;
    margin-top: 20px;
}
.left-inner .filter-box .option0 .handle {
    width: 234px;
}
.left-inner .filter-box .option1 .handle {
    width: 162px;
}
.left-inner .filter-box .option2 .handle,
.left-inner .filter-box .option3 .handle {
    margin-top: 5px;
    width: 102px;
}
.left-inner .filter-box .option-change .handle {
    width: 100%;
    margin-top: 20px;
}
.left-inner .filter-box .option4 .handle {
    margin-top: 5px;
    width: 230px;
}
.left-inner .filter-box .option5 {
    padding-left: 0;
    padding-right: 0;
    width: 263px;
    max-height: 368px;
    overflow-y: auto;
}
.left-inner .filter-box .option5 .options{
    padding: 0 10px;
}
.left-inner .filter-box .option6 {
    width: 110px;
}
.left-inner .filter-box .option9 {
    width: 432px;
    padding: 20px 0;
}
.left-inner .filter-box .option7 {
    width: 288px;
}
.left-inner .filter-box .option8, .left-inner .filter-box .option-change{
    width: 288px;
    padding: 20px 0;
}
.left-inner .filter-box .card .handle span {
    display: inline-block;
    font-size: 12px;
    width: 50%;
    text-align: center;
}
.left-inner .filter-box .card .handle .cancel {
    color: #8d8d8d;
}
.left-inner .filter-box .card .handle .affirm,
.total .sumNum {
    color: #33a1ff;
}
.left-inner .total {
    margin-bottom: 5px;
}
.options {
    line-height: 23px;
    overflow: hidden;
}
.options .option-it .select-fir {
    width: 154px;
    height: 22px;
    line-height: 22px;
}
.options .division {
    margin: 0 10px;
    display: inline-block;
    width: 8px;
    height: 1px;
    position: relative;
    background-color: #333;
    overflow: hidden;
    top: 12px;
}
.options .option-it {
    line-height: 23px;
    margin-bottom: 10px;
    overflow: hidden;
}
.options .option-it:last-child {
    margin-bottom: 0;
}
.options .option-it > span {
    line-height: 23px;
    display: block;
    float: left;
}
.options .option-it .tit {
    margin-right: 6px;
}
.options .opt-tab {
    float: left;
    margin: 0px 4px 15px;
}
.options .opt-tab span {
    float: left;
    height: 17px;
    line-height: 17px;
}
.options .opt-tab .state {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 6px;
    margin-top: 1px;
    -webkit-background-size: 100%;
    background-size: 100%;
    background-image: url(./images/checkbox-no.png);
}
.options .opt-tab .state.active {
    background-image: url(./images/checkbox-yes.png);
}
.options .opt-tab .hosue {
    color: #333;
    &.active {
        color: #33a1ff;
    }
}
.option4 .options .opt-tab,
.option5 .options .opt-tab {
    margin: 0 10px 15px;
}
.left-inner .filter-box .card.option5,
.left-inner .filter-box .card.option6 {
    padding-bottom: 0;
}
.left-inner .filter-box .hasOpt {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #f8643d;
    border-radius: 50%;
    position: absolute;
    right: 26px;
    top: 14px;
}
.input-wrap {
    line-height: 22px;
    overflow: hidden;
}
.input-wrap >span{
    float: left;
}
.left-inner {
    box-sizing: border-box;
    padding: 10px;
    width: 140px;
    height: 100%;
    font-size: 12px;
    color: #333;
    background: #ecf0f1;
    .check-city {
        position: relative;
        padding: 0;
    }
}
.jl-btn-success {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
.jl-btn-tab {
    position: fixed;
    top: 0;
    right: 360px;
    background-color: salmon;
    color: #fff;
    z-index: 99;
}
</style>
<style scoped>
.input-wrap span >>> .el-input {
    width: 45px;
    margin-right: 6px;
}
.input-wrap > .select-fir {
    margin-bottom: 10px;
}
.input-wrap > span > .select-fir >>> .el-input {
    width: 154px;
    height: 22px;
    line-height: 22px;
}
.input-wrap > span > .el-input >>> .el-input__inner,.input-wrap > .select-fir > .el-input >>> .el-input__inner {
    height: 22px;
    line-height: 22px;
    padding: 0 5px;
    border-radius: 0;
    font-size: 12px;
}
.input-wrap > span >>> .el-select >>> .el-input--suffix >>> .el-input__inner {
    border-radius: 0;
}
.options .option-it .select-fir >>> .el-input__inner {
    height: 22px;
    line-height: 22px;
    border-radius: 0;
}
.options .option-it .select-fir >>> .el-input__icon {
    line-height: 22px;
}
.check-city >>> .el-input--suffix .el-input__inner {
    padding-left: 34px;
    border: none;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #333;
}
.check-city >>> .el-input__icon {
    line-height: 36px;
}
.search-house > .el-autocomplete >>> .el-input__inner {
    padding-left: 30px;
    height: 36px;
    line-height: 36px;
    border: none;
    border-radius: 2px;
}
.search-house >>> .el-input__inner {
    height: 36px;
    line-height: 36px;
    border: none;
}
.screen-add .check-city >>> .el-input--suffix .el-input__inner {
    padding-left: 10px;
}
.search-container .right-wrap .screen-add .check-city .el-select {
    margin-right: 0;
}
</style>
<style>
body .tangram-suggestion .route-icon {
    background: url(./images/search.png) no-repeat left;
    background-size: 14px 14px;
}
body .tangram-suggestion-main {
    height: 300px;
    overflow-x: hidden;
}
</style>
