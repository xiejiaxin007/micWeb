<template>
    <div class="house-share-box" v-loading="isLoading" element-loading-text="拼命加载中">
        <!-- 整体数据渲染错误时展示，阻止用户操作而引发js报错 -->
        <div
            v-if="pageDataError"
            class="error-fix-box"></div>
        <!--中间编辑内容区-->
        <div class="edit-wrapper option">
            <div class="center-content">
                <div class="center-content-box">
                    <!--客户需求-->
                    <div class="step-user-require step-box-wrapper" v-show="currentIndex === 0">
                        <div class="center-header">
                            <div class="header-step">1</div>
                            <div class="header-step-dis">第一步：请填写客户需求，编辑后将同步至客户需求及右侧的展示</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标志"
                                    v-if="!(swiperArr[0].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body" ref="centerShowBody">
                            <div class="body-hd">您的购房需求</div>
                            <div class="body-bd">
                                <div class="bd-tip-info">备注：为空或者设置为不展示的，将不在右侧展示</div>
                                <div class="bd-table">
                                    <ul class="like-tb-box">
                                        <li class="tb-header">
                                            <div class="tb-cell">
                                                <div class="like-th">客户需求</div>
                                                <div class="like-th-right">设置展示</div>
                                                <div class="like-td">填写信息</div>
                                            </div>
                                        </li>
                                        <!--总价预算-->
                                        <li>
                                            <div class="tb-cell">
                                                <div class="like-th">总价预算</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="totalPrice"
                                                        v-model="totalPrice.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div class="like-td-box">
                                                        <div class="input-unit-box">
                                                            <el-input
                                                                v-if="totalPrice"
                                                                type="text"
                                                                @input="intagerInput(totalPrice.value_min, 'total_price', 'value_min')"
                                                                v-model.trim="totalPrice.value_min"
                                                            ></el-input>
                                                            <span class="input-unit">万</span>
                                                        </div>
                                                        <div
                                                            class="input-unit-middle"
                                                            v-if="totalPrice ? totalPrice.isMore : false"
                                                        ></div>
                                                        <div
                                                            class="input-unit-box"
                                                            v-if="totalPrice ? totalPrice.isMore : false"
                                                        >
                                                            <el-input
                                                                type="text"
                                                                @input="intagerInput(totalPrice.value_max, 'total_price', 'value_max')"
                                                                v-model="totalPrice.value_max"
                                                            ></el-input>
                                                            <span class="input-unit">万</span>
                                                        </div>
                                                        <div
                                                            class="input-unit-operate"
                                                            v-if="totalPrice"
                                                            @click="changeArea(totalPrice, 'value_max')"
                                                        >{{checkarea(totalPrice.isMore)}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!--首付预算-->
                                        <li>
                                            <div class="tb-cell">
                                                <div class="like-th">首付预算</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="firstPrice"
                                                        v-model="firstPrice.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div class="like-td-box">
                                                        <div class="input-unit-box">
                                                            <el-input
                                                                v-if="firstPrice"
                                                                type="text"
                                                                @input="intagerInput(firstPrice.value_min, 'first_price', 'value_min')"
                                                                v-model.trim="firstPrice.value_min"
                                                            ></el-input>
                                                            <span class="input-unit">万</span>
                                                        </div>
                                                        <div
                                                            class="input-unit-middle"
                                                            v-if="firstPrice ? firstPrice.isMore : false"
                                                        ></div>
                                                        <div
                                                            class="input-unit-box"
                                                            v-if="firstPrice ? firstPrice.isMore : false"
                                                        >
                                                            <el-input
                                                                type="text"
                                                                @input="intagerInput(firstPrice.value_max, 'first_price', 'value_max')"
                                                                v-model="firstPrice.value_max"
                                                            ></el-input>
                                                            <span class="input-unit">万</span>
                                                        </div>
                                                        <div
                                                            class="input-unit-operate"
                                                            v-if="firstPrice"
                                                            @click="changeArea(firstPrice, 'value_max')"
                                                        >{{checkarea(firstPrice.isMore)}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!--面积-->
                                        <li>
                                            <div class="tb-cell tb-cell-acreage">
                                                <div class="like-th">面积</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="acreage"
                                                        v-model="acreage.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div class="like-td-box">
                                                        <div class="input-unit-box">
                                                            <el-input
                                                                v-if="acreage"
                                                                type="text"
                                                                @input="intagerInput(acreage.value_min, 'acreage', 'value_min')"
                                                                v-model.trim="acreage.value_min"
                                                            ></el-input>
                                                            <span class="input-unit">平米</span>
                                                        </div>
                                                        <div
                                                            class="input-unit-middle"
                                                            v-if="acreage ? acreage.isMore : false"
                                                        ></div>
                                                        <div
                                                            class="input-unit-box"
                                                            v-if="acreage ? acreage.isMore : false"
                                                        >
                                                            <el-input
                                                                type="text"
                                                                @input="intagerInput(acreage.value_max, 'acreage', 'value_max')"
                                                                v-model="acreage.value_max"
                                                            ></el-input>
                                                            <span class="input-unit">平米</span>
                                                        </div>
                                                        <div
                                                            class="input-unit-operate"
                                                            v-if="acreage"
                                                            @click="changeArea(acreage, 'value_max')"
                                                        >{{checkarea(acreage.isMore)}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!--业态-->
                                        <li>
                                            <div class="tb-cell">
                                                <div class="like-th">业态</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="user_require.project_type"
                                                        v-model="user_require.project_type.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div
                                                        class="like-td-box"
                                                        v-if="user_require.project_type"
                                                    >
                                                        <el-radio-group
                                                            v-model="user_require.project_type.value"
                                                        >
                                                            <el-radio
                                                                :label="projectType.value"
                                                                v-for="(projectType, index) in typeList"
                                                                :key="'projectType' + index"
                                                            >{{projectType.name}}</el-radio>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!--购房资质-->
                                        <li>
                                            <div class="tb-cell">
                                                <div class="like-th">购房资质</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="user_require.qualifications"
                                                        v-model="user_require.qualifications.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div
                                                        class="like-td-box"
                                                        v-if="user_require.qualifications"
                                                    >
                                                        <el-radio-group
                                                            v-model="user_require.qualifications.value"
                                                        >
                                                            <el-radio
                                                                :label="qualification.value"
                                                                v-for="(qualification, index) in qualificationList"
                                                                :key="'qualification-' + index"
                                                            >{{qualification.name}}</el-radio>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!--户型-->
                                        <li>
                                            <div class="tb-cell">
                                                <div class="like-th">户型</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="user_require.house_type"
                                                        v-model="user_require.house_type.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div
                                                        class="like-td-box"
                                                        v-if="user_require.house_type"
                                                    >
                                                        <el-checkbox-group
                                                            v-model="user_require.house_type.value"
                                                        >
                                                            <el-checkbox
                                                                :label="houseType.value"
                                                                v-for="(houseType, index) in houseTypeList"
                                                                :key="'houseType-' + index"
                                                            >{{houseType.name}}</el-checkbox>
                                                        </el-checkbox-group>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!--购房目的-->
                                        <li>
                                            <div class="tb-cell">
                                                <div class="like-th">购房目的</div>
                                                <div class="like-th-right">
                                                    <el-switch
                                                        v-if="user_require.purchase_purpose"
                                                        v-model="user_require.purchase_purpose.is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        inactive-value="1"
                                                    ></el-switch>
                                                </div>
                                                <div class="like-td">
                                                    <div
                                                        class="like-td-box"
                                                        v-if="user_require.purchase_purpose"
                                                    >
                                                        <el-radio-group
                                                            v-model="user_require.purchase_purpose.value"
                                                        >
                                                            <el-radio
                                                                :label="purchase.value"
                                                                v-for="(purchase, index) in purchaseList"
                                                                :key="'purchase-' + index"
                                                            >{{purchase.name}}</el-radio>
                                                        </el-radio-group>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--添加标签-->
                    <div class="step-label step-box-wrapper" v-show="currentIndex === 1">
                        <div class="center-header">
                            <div class="header-step">2</div>
                            <div class="header-step-dis">第二步：在下方自定义或选择的标签，可同步至右侧标签处</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="!(swiperArr[1].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body">
                            <div class="body-hd">推荐理由</div>
                            <div class="body-bd">
                                <p class="lable-box-title">选择你想展示的标签：</p>
                                <!--系统标签-->
                                <ul class="custom-box sys-box">
                                    <li
                                        v-for="(sysItem, sysIndex) in sysLabel"
                                        :key="'sys-' + sysIndex"
                                    >
                                        <div
                                            :class="{'custom-item custom-item-active': sysItem.is_select.toString() === '0', 'custom-item': !(sysItem.is_select.toString() === '0')}"
                                            @click="changeChosen(sysItem)"
                                        >
                                            <span class="custom-item-name">{{sysItem.name}}</span>
                                            <span class="iconfont iconicon_chosen"></span>
                                        </div>
                                    </li>
                                </ul>
                                <div class="add-input">
                                    <el-button plain @click="addLabel">+ 添加</el-button>
                                    <div class="add-label">
                                        <el-input
                                            v-model="customInput"
                                            placeholder="或输入你想自定义的标签，然后点击添加"
                                        ></el-input>
                                    </div>
                                </div>
                                <!--自定义标签-->
                                <ul class="custom-box">
                                    <li
                                        v-for="(cuItem, cusIndex) in customLabel"
                                        :key="'cus-' + cusIndex"
                                    >
                                        <div
                                            class="custom-item"
                                            v-if="cuItem.is_select.toString() === '0'"
                                        >
                                            <span class="custom-item-name">{{cuItem.name}}</span>
                                            <span
                                                class="iconfont iconicon_guanbi"
                                                @click="deleteCusLabel(cusIndex, cuItem)"
                                            ></span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--楼盘概述-->
                    <div class="step-house-dis step-box-wrapper" v-show="currentIndex === 2">
                        <div class="center-header">
                            <div class="header-step">3</div>
                            <div class="header-step-dis">第三步：请在下方空白处对楼盘进行简要描述</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="!(swiperArr[2].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body">
                            <div class="body-hd">推荐理由</div>
                            <div class="body-bd sum-up">
                                <ul class="step-label-list">
                                    <li
                                        v-for="(label, labelIndex) in labelList"
                                        :key="'labels-' + labelIndex"
                                    >{{label.name}}</li>
                                </ul>
                                <div class="house-wrap">
                                    <div class="house-detail">
                                        <div class="house-info">
                                            <div class="area-txt">
                                                <el-input
                                                    type="textarea"
                                                    rows="4"
                                                    v-model.trim="houseMessage"
                                                    placeholder="在这里输入对该楼盘的描述"
                                                ></el-input>
                                            </div>
                                        </div>
                                        <div class="rate-temp">
                                            <div class="info-each">
                                                <span class="th hou-name">咨询师点评模板：</span>
                                            </div>
                                            <div class="tmp-wrap">
                                                <div
                                                    class="temp-card shadow-box"
                                                    v-for="(opt, index) in projectReview"
                                                    :key="index"
                                                >
                                                    <div class="name">
                                                        咨询师-{{opt.employee_name}}
                                                        <span class="licks">{{opt.like_show}}个赞</span>
                                                    </div>
                                                    <div class="txt-con">
                                                        <div class="txt">{{opt.review}}</div>
                                                    </div>
                                                    <div
                                                        class="copy-btn"
                                                        v-clipboard:copy="opt.review"
                                                        v-clipboard:success="onCopy"
                                                        v-clipboard:error="onError"
                                                    >一键复制</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--楼盘参数-->
                    <div class="step-house-info step-box-wrapper" v-show="currentIndex === 3">
                        <div class="center-header">
                            <div class="header-step">4</div>
                            <div class="header-step-dis">第四步：确认并修改楼盘信息</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="!(swiperArr[3].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body">
                            <!--楼盘语音解读-->
                            <div class="center-module">
                                <div class="body-hd">楼盘语音解读</div>
                                <div class="body-bd">
                                    <div class="bd-tip-info">备注：为空或者设置为不展示的，将不在右侧展示</div>
                                    <div class="bd-table">
                                        <el-table
                                            :data="tableVoice"
                                            :border="true"
                                            style="width: 100%"
                                        >
                                            <el-table-column
                                                prop="title"
                                                class-name="cell-left"
                                                width="200"
                                                label="楼盘"
                                            >
                                                <template
                                                    slot-scope="scope"
                                                >{{scope.row.project_name}}</template>
                                            </el-table-column>
                                            <el-table-column prop="url" label="试听">
                                                <template slot-scope="scope">
                                                    <!--scope.row.url-->
                                                    <div
                                                        class="audio-box"
                                                        @click="playAudio(scope.row.url)"
                                                    >
                                                        <span
                                                            :class="{'iconfont iconbofangx': !isPlaying, 'iconfont iconzantingx': isPlaying}"
                                                        ></span>
                                                        <span class="audio-name">{{audioStatus}}</span>
                                                    </div>
                                                    <audio
                                                        id="audio"
                                                        ref="audio"
                                                        :src="scope.row.url"
                                                        style="width: 100%;display: none;"
                                                        preload
                                                        controls
                                                    ></audio>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                width="120"
                                                align="center"
                                                class-name="switch-column"
                                                label="设置展示"
                                            >
                                                <template slot-scope="scope">
                                                    <el-switch
                                                        v-model="scope.row.voice_is_show"
                                                        active-text="是"
                                                        inactive-text="否"
                                                        active-color="#33a1ff"
                                                        inactive-color="#abb0b5"
                                                        active-value="0"
                                                        :disabled="scope.row.isDisabled"
                                                        inactive-value="1"
                                                        @change="swichChange(scope.row)"
                                                    ></el-switch>
                                                    <el-button
                                                        v-if="scope.row.traffic_type + '' === '2'"
                                                        type="danger"
                                                        @click="delTraffic(scope.row)"
                                                    >删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                            <!--楼盘信息-->
                            <div class="center-module">
                                <div class="body-hd">楼盘信息</div>
                                <div class="body-bd">
                                    <div class="tab-info-box">
                                        <!--楼盘销售状态-->
                                        <ul class="tab-box">
                                            <li
                                                :class="{'active': houseStatus == status.value, 'no-after': statusIndex == index}"
                                                v-for="(status, index) in statusList"
                                                :key="'status-' + index"
                                                @click="clickTab(status, index)"
                                            >
                                                <div>{{status.name}}</div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="bd-table">
                                        <ul class="like-tb-box">
                                            <li class="tb-header">
                                                <div class="tb-cell">
                                                    <div class="like-th">客户需求</div>
                                                    <div class="like-td">填写信息</div>
                                                </div>
                                            </li>
                                            <!--单价-->
                                            <li>
                                                <div class="tb-cell">
                                                    <div class="like-th">参考单价</div>
                                                    <div class="like-td">
                                                        <div class="like-td-box">
                                                            <div class="input-unit-box">
                                                                <el-input
                                                                    type="text"
                                                                    @input="intagerInput(houseInfo.unit_price, 'unit_price', 'unit_price', 'houseInfoUnit')"
                                                                    v-model.trim="houseInfo.unit_price"
                                                                ></el-input>
                                                                <span class="input-unit">元</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <!--总价-->
                                            <li>
                                                <div class="tb-cell">
                                                    <div class="like-th">参考总价</div>
                                                    <div class="like-td">
                                                        <div class="like-td-box">
                                                            <div
                                                                class="input-unit-box"
                                                                v-if="houseInfo.total_price"
                                                            >
                                                                <el-input
                                                                    type="text"
                                                                    @input="intagerInput(houseInfo.total_price.price_min, 'total_price', 'price_min', 'houseInfo')"
                                                                    v-model.trim="houseInfo.total_price.price_min"
                                                                ></el-input>
                                                                <span class="input-unit">万</span>
                                                            </div>
                                                            <div class="input-unit-middle"></div>
                                                            <div
                                                                class="input-unit-box"
                                                                v-if="houseInfo.total_price"
                                                            >
                                                                <el-input
                                                                    type="text"
                                                                    @input="intagerInput(houseInfo.total_price.price_max, 'total_price', 'price_max', 'houseInfo')"
                                                                    v-model.trim="houseInfo.total_price.price_max"
                                                                ></el-input>
                                                                <span class="input-unit">万</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <!--装修情况-->
                                            <li>
                                                <div class="tb-cell">
                                                    <div class="like-th">装修情况</div>
                                                    <div class="like-td">
                                                        <div
                                                            class="like-td-box"
                                                            v-if="houseInfo.decorate"
                                                        >
                                                            <el-checkbox-group
                                                                v-model="houseInfo.decorate"
                                                            >
                                                                <el-checkbox
                                                                    :label="decorate.value"
                                                                    v-for="(decorate, index) in decorateList"
                                                                    :key="'decorate-' + index"
                                                                >{{decorate.name}}</el-checkbox>
                                                            </el-checkbox-group>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <!--业态-->
                                            <li>
                                                <div class="tb-cell">
                                                    <div class="like-th">业态</div>
                                                    <div class="like-td">
                                                        <div class="like-td-box">
                                                            <el-select
                                                                v-model="houseInfo.project_type"
                                                                placeholder
                                                            >
                                                                <el-option
                                                                    v-for="item in typeList"
                                                                    :key="item.value"
                                                                    :label="item.name"
                                                                    :value="item.value"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <!--物业费用-->
                                            <li>
                                                <div class="tb-cell">
                                                    <div class="like-th">物业费用</div>
                                                    <div class="like-td">
                                                        <div class="like-td-box manage-fee">
                                                            <div class="input-unit-box">
                                                                <el-input
                                                                    type="text"
                                                                    v-model.trim="houseInfo.manage_fee"
                                                                ></el-input>
                                                                <span class="input-unit">元/㎡*月</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--推荐户型-->
                    <div class="step-house step-box-wrapper" v-show="currentIndex === 4">
                        <div class="center-header">
                            <div class="header-step">5</div>
                            <div
                                class="header-step-dis"
                                v-if="Object.keys(sysHouse).length > 0"
                            >第五步：请选择你要推荐给客户的户型，并填写贷款信息</div>
                            <div class="header-step-dis" v-else>系统暂无当前楼盘户型，请手动添加要展示给客户的户型</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="!(swiperArr[4].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body-box">
                            <div class="center-body" ref="centerBody">
                                <div class="body-hd-box">
                                    <div class="body-hd">{{isRealCity ? '推荐户型' : '推荐房源'}}</div>
                                    <div class="center-body-btn" @click="addCusHouse">＋手动添加{{isRealCity ? '户型' : '房源'}}</div>
                                </div>
                                <div class="body-bd">
                                    <div class="bd-house-list">
                                        <ul class="bd-houst-list-fixed">
                                            <li
                                                class="hx-sys-box"
                                                :class="{'display-none': house.length <= 0}"
                                                ref="hxBox"
                                                v-for="(house, houseIndex) in sysHouse"
                                                :key="'houseIndex-' + houseIndex"
                                            >{{matchHx(houseIndex)}}</li>
                                            <li
                                                class="house-list-cus"
                                                v-if="cusHouse.length > 0"
                                            >我的自定义</li>
                                        </ul>
                                        <div class="bd-house-list-info">
                                            <ul
                                                class="hx-sys-box"
                                                :class="{'house-list-item': houseBox.length > 0, 'house-list-item display-none': !(houseBox.length > 0)}"
                                                ref="hxBox"
                                                v-for="(houseBox, houseKey) in sysHouse"
                                                :key="'house-' + houseKey"
                                            >
                                                <li class="house-list-title">{{matchHx(houseKey)}}</li>
                                                <li
                                                    v-for="(hxItem, hxIndex) in houseBox"
                                                    :key="'hx-' + hxIndex"
                                                    @click="chooseHx(hxItem)"
                                                    :class="{'chosenBox': hxItem.is_select + '' === '0'}"
                                                >
                                                    <div class="item-box">
                                                        <div
                                                            class="item-house-name"
                                                        >{{hxItem.name + hxItem.house_type_num}}</div>
                                                        <div class="item-house-area">
                                                            <span class="iconfont iconicon_chosen"></span>
                                                            <div
                                                                class="area-txt"
                                                            >{{hxItem.square_metre}}㎡</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <ul
                                                class="house-list-item house-list-cus"
                                                ref="hxBoxCus"
                                                v-if="cusHouse.length > 0"
                                            >
                                                <li class="house-list-title">我的自定义</li>
                                                <li
                                                    v-for="(cusHxItem, cusHxIndex) in cusHouse"
                                                    :key="'cusHx-' + cusHxIndex"
                                                    @click="chooseHx(cusHxItem)"
                                                    :class="{'chosenBox': cusHxItem.is_select + '' === '0'}"
                                                >
                                                    <div class="item-box">
                                                        <div
                                                            class="item-house-name"
                                                        >{{cusHxItem.name}}</div>
                                                        <div class="item-house-area">
                                                            <span class="iconfont iconicon_chosen"></span>
                                                            <div
                                                                class="area-txt"
                                                            >{{cusHxItem.square_metre}}㎡</div>
                                                        </div>
                                                    </div>
                                                    <div class="dele-pic-wrapper">
                                                        <span class="dele-hide"></span>
                                                        <img
                                                            src="./images/del_cell_hx.png"
                                                            alt="删除户型"
                                                            @click.stop="delHxItem(cusHxItem, cusHxIndex, $event)"
                                                        />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bd-house-list-show" v-if="houseList.length > 0">
                                <ul class="house-list-show-title">
                                    <li>居室</li>
                                    <li>户型</li>
                                    <li>面积</li>
                                    <li>总价</li>
                                    <li>状态</li>
                                    <li>户型图</li>
                                </ul>
                                <div class="house-list-show-cont">
                                    <ul
                                        class="show-cont-list"
                                        v-for="(showHx, showIndex) in houseList"
                                        :key="'show-' + showIndex"
                                    >
                                        <li class="show-input">
                                            <div class="show-cont-input show-status-drop">
                                                <el-select v-model="showHx.room_type">
                                                    <el-option
                                                    placeholder=""
                                                    v-for="item in roomTypeList"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                        </li>
                                        <li class="show-input">
                                            <div
                                                class="show-cont-tit"
                                                v-if="showHx.apartment_type + '' === '2'"
                                            >
                                                <el-input v-model="showHx.name"></el-input>
                                            </div>
                                            <div class="sys-tit" v-else>{{showHx.name}}</div>
                                        </li>
                                        <li class="show-input">
                                            <div
                                                class="show-cont-input"
                                                v-if="showHx.apartment_type + '' === '2'"
                                            >
                                                <el-input
                                                    type="text"
                                                    @input="numInput(showHx.square_metre, showIndex, 'square_metre', houseList)"
                                                    v-model.trim="showHx.square_metre"
                                                ></el-input>㎡
                                            </div>
                                            <div
                                                class="show-cont-input"
                                                v-else
                                            >{{showHx.square_metre}}㎡</div>
                                        </li>
                                        <li class="show-input">
                                            <div class="show-cont-input">
                                                <el-input
                                                    type="text"
                                                    @input="numInput(showHx.total_price, showIndex, 'total_price', houseList)"
                                                    v-model.trim="showHx.total_price"
                                                ></el-input>万
                                            </div>
                                        </li>
                                        <li class="show-input">
                                            <div class="show-cont-input show-status-drop">
                                                <el-select v-model="showHx.house_status">
                                                    <el-option
                                                    placeholder=""
                                                    v-for="item in statusList"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                        </li>
                                        <li class="show-cont-pic">
                                            <span class="pic-up-file" :id="showHx.picId">上传户型图</span>
                                            <span
                                                v-if="showHx.isPic"
                                                class="iconfont iconicon_chosen"
                                            ></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="house-loan-box">
                                <p class="loan-tip">填写贷款信息后可帮助你计算个户型的首付及月供，展示在表格中</p>
                                <div class="info-wrap">
                                    <div class="info">
                                        <span class="th">首付比例</span>
                                        <span class="td">
                                            <el-select
                                                v-model="loanObj.down_payments"
                                                @change="changePay"
                                            >
                                                <el-option
                                                    v-for="item in payList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </span>
                                    </div>
                                    <div class="info term-info">
                                        <span class="th">贷款年限</span>
                                        <span class="td">
                                            <el-select
                                                v-model="loanObj.loan_term"
                                                :disabled="loanObj.down_payments === 100"
                                            >
                                                <el-option
                                                    v-for="item in loanYearList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </span>
                                    </div>
                                    <div class="info">
                                        <span class="th">贷款利率</span>
                                        <span class="td">
                                            <el-input
                                                placeholder
                                                class="sele-unit"
                                                type="text"
                                                suffix-icon="el-icon-date"
                                                :disabled="loanObj.down_payments === 100"
                                                v-model.trim="loanObj.lending_rate"
                                                @input="loanInput(loanObj.lending_rate)"
                                            ></el-input>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--交通情况-->
                    <div class="step-traffic step-box-wrapper" v-show="currentIndex === 5">
                        <div class="center-header">
                            <div class="header-step">6</div>
                            <div class="header-step-dis">第六步：请确认楼盘周边的公交站及地铁站信息</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="!(swiperArr[5].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body traffic-center">
                            <div class="body-hd">交通情况</div>
                            <div class="hd-tip-text">小程序中每个楼盘最多只能展示 5 条交通站点</div>
                            <div class="body-bd">
                                <div class="house-wrap">
                                    <el-table :data="tableTrafficData" style="width: 100%">
                                        <el-table-column
                                            prop="name"
                                            class-name="cell-left"
                                            width="400"
                                            label="地铁站或公交站"
                                        >
                                            <template slot-scope="scope">
                                                <div
                                                    class="sys-traffic-box"
                                                    v-if="scope.row.traffic_type + '' === '1'"
                                                >
                                                    <span
                                                        class="house-name traffic-name"
                                                        v-if="scope.row.traffic_category + '' === '1'"
                                                    >公交：距{{scope.row.station_name}}公交站直线</span>
                                                    <span
                                                        class="house-name traffic-name"
                                                        v-else
                                                    >地铁：距{{scope.row.traffic_name}}{{scope.row.station_name}}站直线</span>
                                                </div>
                                                <div
                                                    class="cus-traffic-box"
                                                    v-if="scope.row.traffic_type + '' === '2'"
                                                >
                                                    <span class="select-wrap">
                                                        <el-select
                                                            v-model="scope.row.traffic_category"
                                                            @change="trafficTypeChange(scope.row)"
                                                            placeholder="类型"
                                                        >
                                                            <el-option
                                                                v-for="it in tripList"
                                                                :key="it.type"
                                                                :label="it.text"
                                                                :value="it.type"
                                                            ></el-option>
                                                        </el-select>
                                                    </span>
                                                    距
                                                    <el-input
                                                        class="traffic-bus"
                                                        v-if="scope.row.traffic_category === '2' || scope.row.traffic_category === ''"
                                                        v-model="scope.row.traffic_name"
                                                        placeholder="路线"
                                                    ></el-input>
                                                    <el-input
                                                        class="traffic-bus"
                                                        v-model="scope.row.station_name"
                                                        placeholder="站点"
                                                    ></el-input>直线
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="houseType" label="距离">
                                            <template slot-scope="scope">
                                                <span class="traffic-distance-box">
                                                    <el-input
                                                        type="text"
                                                        v-model.trim="scope.row.distance"
                                                        @input="numInput(scope.row.distance, scope.$index, 'distance', tableTrafficData)"
                                                    ></el-input>m
                                                </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设置展示">
                                            <template slot-scope="scope">
                                                <el-switch
                                                    v-if="scope.row.traffic_type + '' === '1'"
                                                    v-model="scope.row.is_show"
                                                    active-text="是"
                                                    inactive-text="否"
                                                    active-color="#33a1ff"
                                                    inactive-color="#abb0b5"
                                                    :active-value="0"
                                                    :inactive-value="1"
                                                    @change="swichChange(scope.row)"
                                                ></el-switch>
                                                <el-button
                                                    v-if="scope.row.traffic_type + '' === '2'"
                                                    type="danger"
                                                    @click="delTraffic(scope.row)"
                                                >删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="tb-operate-box">
                                        <div class="center-body-btn" @click="addTraffic">＋手动新增站点</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--通勤路线-->
                    <div class="step-commu step-box-wrapper" v-show="currentIndex === 6">
                        <div class="center-header">
                            <div class="header-step">7</div>
                            <div class="header-step-dis">第七步：填写目的地后，我们将在地图给客户展示路线及时间</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="!(swiperArr[6].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body commu-center-body">
                            <div class="center-body-row">
                                <div class="body-hd">通勤路线</div>
                                <el-button
                                    :class="{'add-address-btn': (addressArr ? addressArr.length <= 1 : true), 'add-address-forbid': !(addressArr ? addressArr.length <= 1 : true)}"
                                    @click="addEndAdr"
                                    type="success"
                                >＋新增目的地</el-button>
                                <div class="body-bd">
                                    <!-- 第一个通勤地址 -->
                                    <div class="body-bd-box">
                                        <!-- 目的地 -->
                                        <div class="end-address-wrap">
                                            <div class="end-address-box">
                                                <div class="end-address-num">1</div>
                                                <div class="end-address-tit">目的地</div>
                                            </div>
                                            <div class="body-bd-box-bd end-address-input">
                                                <el-input
                                                    v-model="addressObj.address"
                                                    ref="commuInput"
                                                    @blur="commuBlur"
                                                    id="single-share-input"
                                                    placeholder="请输入目的地"
                                                ></el-input>
                                            </div>
                                        </div>
                                        <!-- 通勤数据表格 -->
                                        <el-table
                                            v-loading="tbLoading"
											element-loading-text="正在计算通勤时长，请稍等"
                                            :header-cell-style="{background:'#f3f6f9',color:'#3e4a59'}"
                                            :data="addressTable"
                                        >
                                            <el-table-column
                                                prop="project_name"
                                                label="起始地"
                                            >
                                                <template slot-scope="scope">
                                                    <div
                                                        class="color-orange"
                                                    >{{scope.row.project_name}}</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="drive_time"
                                                label="自驾通勤时长"
                                            >
                                                <template slot-scope="scope">
                                                    <div class="scope-input-box">
                                                        <jl-number-input
                                                            reg="number"
                                                            v-model="scope.row.drive_time"
                                                        ></jl-number-input>
                                                        <span class="input-unit">分钟</span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="公共交通通勤时长">
                                                <el-table-column
                                                    prop="bus_transit_time"
                                                    label="公交/地铁/火车时长"
                                                >
                                                    <template slot="header">
                                                        <div class="header-name">公交/地铁/火车时长</div>
                                                    </template>
                                                    <template slot-scope="scope">
                                                        <div class="scope-input-box">
                                                            <jl-number-input
                                                                reg="number"
                                                                v-model="scope.row.bus_transit_time"
                                                            ></jl-number-input>
                                                            <span class="input-unit">分钟</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                    prop="bus_walk_time"
                                                >
                                                    <template slot="header" slot-scope="scope">
                                                        <div class="header-name">
                                                            <el-checkbox
                                                                v-model="isWalkCheck"
                                                                true-label="0"
                                                                false-label="1"
                                                            >步行时长</el-checkbox>
                                                        </div>
                                                    </template>
                                                    <template slot-scope="scope">
                                                        <div class="scope-input-box">
                                                            <jl-number-input
                                                                reg="number"
                                                                v-model="scope.row.bus_walk_time"
                                                            ></jl-number-input>
                                                            <span class="input-unit">分钟</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <!-- 第二个通勤地址 -->
                                    <div
                                        class="body-bd-box"
                                        v-if="addressArr ? addressArr.length > 1 : false"
                                    >
                                        <!-- 目的地 -->
                                        <div class="end-address-wrap">
                                            <div class="end-address-box">
                                                <div class="end-address-num">2</div>
                                                <div class="end-address-tit">目的地</div>
                                            </div>
                                            <div class="end-address-btn">
                                                <el-button
                                                    class="del-address-btn"
                                                    @click="delEndAdr"
                                                    type="danger"
                                                >删除</el-button>
                                            </div>
                                            <div class="body-bd-box-bd end-address-input">
                                                <el-input
                                                    v-model="addressObjSen.address"
                                                    ref="commuInputSecon"
                                                    @blur="commuBlurSecon"
                                                    id="single-share-input-secon"
                                                    placeholder="请输入目的地"
                                                ></el-input>
                                            </div>
                                        </div>
                                        <!-- 通勤数据表格 -->
                                        <el-table
                                            v-loading="tbSenLoading"
											element-loading-text="正在计算通勤时长，请稍等"
                                            :header-cell-style="{background:'#f3f6f9',color:'#3e4a59'}"
                                            :data="addressTableSecon"
                                        >
                                            <el-table-column
                                                prop="project_name"
                                                label="起始地"
                                            >
                                                <template slot-scope="scope">
                                                    <div
                                                        class="color-orange"
                                                    >{{scope.row.project_name}}</div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="drive_time"
                                                label="自驾通勤时长"
                                            >
                                                <template slot-scope="scope">
                                                    <div class="scope-input-box">
                                                        <jl-number-input
                                                            reg="number"
                                                            v-model="scope.row.drive_time"
                                                        ></jl-number-input>
                                                        <span class="input-unit">分钟</span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="公共交通通勤时长">
                                                <el-table-column
                                                    prop="bus_transit_time"
                                                    label="公交/地铁/火车时长"
                                                >
                                                    <template slot="header">
                                                        <div class="header-name">公交/地铁/火车时长</div>
                                                    </template>
                                                    <template slot-scope="scope">
                                                        <div class="scope-input-box">
                                                            <jl-number-input
                                                                reg="number"
                                                                v-model="scope.row.bus_transit_time"
                                                            ></jl-number-input>
                                                            <span class="input-unit">分钟</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                    prop="bus_walk_time"
                                                >
                                                    <template slot="header" slot-scope="scope">
                                                        <div class="header-name">
                                                            <el-checkbox
                                                                v-model="isWalkCheckSen"
                                                                true-label="0"
                                                                false-label="1"
                                                            >步行时长</el-checkbox>
                                                        </div>
                                                    </template>
                                                    <template slot-scope="scope">
                                                        <div class="scope-input-box">
                                                            <jl-number-input
                                                                reg="number"
                                                                v-model="scope.row.bus_walk_time"
                                                            ></jl-number-input>
                                                            <span class="input-unit">分钟</span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                            <div class="center-body-row esf-around-box">
                                <div class="body-hd">周边房价行情</div>
                                <div class="body-bd">
                                    <div class="body-bd-box">
                                        <div class="body-bd-box-tit">
                                            <div class="box-tit-edit">
                                                <div class="box-tit-th">编辑更新时间</div>
                                                <div class="box-tit-td">
                                                    <el-date-picker
                                                        v-model="esfTime"
                                                        type="date"
                                                        :clearable="false"
                                                        :editable="false"
                                                        format="yyyy 年 MM 月 dd 日"
                                                        placeholder="选择日期"
                                                    ></el-date-picker>
                                                </div>
                                            </div>
                                            <div class="box-tit-tip">此处为展示给客户的周边数据更新时间，您可以自行配置</div>
                                        </div>
                                        <div class="around-list-wrapper house-wrap">
                                            <ul class="around-list-box esf-around-list">
                                                <li></li>
                                                <li>最新地价</li>
                                                <li>二手房价格</li>
                                            </ul>
                                            <div class="around-list-rest">
                                                <ul class="around-list-box">
                                                    <li class="around-list-tit">价格</li>
                                                    <li>
                                                        <div class="around-list-price">
                                                            <el-input
                                                                type="text"
                                                                v-model.trim="esfData.landPrice"
                                                                @input="esfPriceInput(esfData.landPrice, 'landPrice')"
                                                            ></el-input>元/㎡
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="around-list-price">
                                                            <el-input
                                                                type="text"
                                                                v-model.trim="esfData.secondPrice"
                                                                @input="esfPriceInput(esfData.secondPrice, 'secondPrice')"
                                                            ></el-input>元/㎡
                                                        </div>
                                                    </li>
                                                </ul>
                                                <ul class="around-list-box">
                                                    <li class="around-list-tit">设置展示</li>
                                                    <li>
                                                        <div class="around-list-swich">
                                                            <el-switch
                                                                v-model="esfData.landShow"
                                                                active-text="是"
                                                                inactive-text="否"
                                                                active-color="#33a1ff"
                                                                inactive-color="#abb0b5"
                                                                :active-value="0"
                                                                :inactive-value="1"
                                                                @change="swichChange"
                                                            ></el-switch>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="around-list-swich">
                                                            <el-switch
                                                                v-model="esfData.secondShow"
                                                                active-text="是"
                                                                inactive-text="否"
                                                                active-color="#33a1ff"
                                                                inactive-color="#abb0b5"
                                                                :active-value="0"
                                                                :inactive-value="1"
                                                                @change="swichChange"
                                                            ></el-switch>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--个人资料-->
                    <div
                        class="step-user-info step-box-wrapper"
                        v-show="currentIndex === 7 && employeeInfo.id"
                    >
                        <div class="center-header">
                            <div class="header-step">8</div>
                            <div class="header-step-dis">第八步：请确认并编辑需要展示给客户的个人资料</div>
                            <div class="header-step-status">
                                <div class="header-line"></div>
                                <img
                                    src="./images/step_unSuccess.png"
                                    alt="未成功标识"
                                    v-if="employeeInfo.id && !(swiperArr[7].isOk)"
                                />
                                <img
                                    src="./images/step_success.png"
                                    alt="成功标识"
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="center-body">
                            <div class="center-body-right">
                                <div class="body-bd-box">
                                    <div class="body-bd-box-hd">微信二维码</div>
                                    <div class="body-bd-box-bd">
                                        <div class="code-img-box">
                                            <img
                                                :src="employeeInfo.wx_qrcode ? signs.host + '' + employeeInfo.wx_qrcode : qaCodeDefault"
                                                alt="咨询师二维码"
                                            />
                                        </div>
                                        <jl-file-upload
                                            upID="uploadCodeMa"
                                            :ossData="signs"
                                            @beforeUpdate="loading = true"
                                            @getFileURL="getFileURL">
                                            <div class="code-btn">上传或替换</div>
                                        </jl-file-upload>
                                    </div>
                                </div>
                            </div>
                            <div class="center-body-left">
                                <div class="body-hd">咨询师标签</div>
                                <div class="body-bd">
                                    <div class="tag-info-box">
                                        <div class="add-input">
                                            <el-button plain @click="addEmTag">+ 添加</el-button>
                                            <div class="add-label">
                                                <el-input
                                                    v-model="cusTagInput"
                                                    placeholder="或输入你想自定义的标签，然后点击添加"
                                                ></el-input>
                                            </div>
                                        </div>
                                        <ul class="custom-box">
                                            <li
                                                v-for="(emTag, emTagIndex) in employeeInfo.tag"
                                                :key="'emTagIndex-' + emTagIndex"
                                            >
                                                <div class="custom-item">
                                                    <span class="custom-item-name">{{emTag}}</span>
                                                    <span
                                                        class="iconfont iconicon_guanbi"
                                                        @click="deleteEmployeeLabel(emTagIndex, employeeInfo.tag)"
                                                    ></span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="center-body-cont">
                                <div class="body-hd body-bd-inner-hd">我的买房问答</div>
                                <div class="body-bd">
                                    <div class="body-qa-box">
                                        <el-scrollbar>
                                            <div class="body-qa-header">
                                                <div class="qa-header-search">
                                                    <div
                                                        class="search-th"
                                                        v-if="defaultQaNum ? defaultQaNum > 1 : false"
                                                    >请选择两个要展示在个人页面的问答：</div>
                                                    <div
                                                        class="search-th"
                                                        v-else-if="defaultQaNum ? defaultQaNum == 1 : false"
                                                    >您只有一个问答</div>
                                                    <div class="search-th" v-else>您当前无问答，此模块无需选择：</div>
                                                    <div class="search-chosen">
                                                        已选择
                                                        <span>{{qaSelectedList ? qaSelectedList.length : 0}}</span> 个
                                                    </div>
                                                    <div class="search-td">
                                                        <div
                                                            class="search-td-btn"
                                                            @click="searchQa"
                                                        >搜索</div>
                                                        <div class="search-input-box">
                                                            <el-input
                                                                v-model="houseNameInput"
                                                                @clear="clearInput"
                                                                placeholder="输入问题进行搜索"
                                                                :clearable="true"
                                                            ></el-input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="qa-header-default">
                                                    <ul class="header-default-box">
                                                        <li
                                                            :class="{'chosen-item': qaSele.selected == 0}"
                                                            v-for="(qaSele, index) in qaListSele"
                                                            :key="'qaSele-' + index"
                                                        >
                                                            <el-popover
                                                                placement="top"
                                                                popper-class="popper-custom"
                                                                width="260"
                                                                v-model="qaSele.show"
                                                                trigger="hover"
                                                            >
                                                                <div v-html="qaSele.answer"></div>
                                                                <div
                                                                    class="default-item"
                                                                    slot="reference"
                                                                    @mouseenter="qaSele.show = true"
                                                                    @mouseleave="qaSele.show = false"
                                                                    @click="choseItem(qaSele)"
                                                                >
                                                                    <div class="item-line">
                                                                        <span
                                                                            class="iconfont iconsuccess_all"
                                                                        ></span>
                                                                    </div>
                                                                    <div class="item-info-cont">
                                                                        <p
                                                                            class="info-cont-title"
                                                                        >{{qaSele.question}}</p>
                                                                        <p class="info-cont-tip">
                                                                            <span
                                                                                class="tip-left"
                                                                            >ID：{{qaSele.order_id}}</span>
                                                                            <span
                                                                                class="tip-right"
                                                                            >{{qaSele.questioner_nickname}}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </el-popover>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="body-qa-main">
                                                <div class="qa-main-cont">
                                                    <ul class="header-default-box">
                                                        <li
                                                            :class="{'chosen-item': qa.selected == 0}"
                                                            v-for="(qa, index) in qaList"
                                                            :key="'qa' + index"
                                                        >
                                                            <el-popover
                                                                placement="top"
                                                                popper-class="popper-custom"
                                                                width="260"
                                                                v-model="qa.show"
                                                                trigger="hover"
                                                            >
                                                                <div v-html="qa.answer"></div>
                                                                <div
                                                                    class="default-item"
                                                                    slot="reference"
                                                                    @mouseenter="qa.show = true"
                                                                    @mouseleave="qa.show = false"
                                                                    @click="choseItem(qa)"
                                                                >
                                                                    <div class="item-line">
                                                                        <span
                                                                            class="iconfont iconsuccess_all"
                                                                        ></span>
                                                                    </div>
                                                                    <div class="item-info-cont">
                                                                        <p
                                                                            class="info-cont-title"
                                                                        >{{qa.question}}</p>
                                                                        <p class="info-cont-tip">
                                                                            <span
                                                                                class="tip-left"
                                                                            >ID：{{qa.order_id}}</span>
                                                                            <span
                                                                                class="tip-right"
                                                                            >{{qa.questioner_nickname}}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </el-popover>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </el-scrollbar>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--上一步下一步按钮-->
                <div class="step-btn-area">
                    <div class="step-area">
                        <span
                            :class="{'step-btn unactive': currentIndex === 0, 'step-btn': !(currentIndex === 0)}"
                            @click="stepToStep(0)"
                        >{{btnObj.preBtn}}</span>
                        <span
                            :class="{'step-btn unactive btn-unactive': (currentIndex === (this.swiperArr.length - 1) && !shareBtn), 'step-btn': !(currentIndex === (this.swiperArr.length - 1) && !shareBtn)}"
                            @click="stepToStep(1)"
                        >{{btnObj.nextBtn}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--左侧步骤条-->
        <div class="left-wrapper option">
            <div class="left-title">编辑目录</div>
            <div class="scrollWrap swiper-class" ref="scrollWrap">
                <div class="shop_box" ref="shopBox">
                    <ul class="content" ref="scrollUl">
                        <!--状态：左侧未完成和未完成，右侧未是否选中-->
                        <li
                            v-for="(menu, index) in swiperArr"
                            ref="menuList"
                            :key="index"
                            :class="`${verifyModule && !menu.isOk? 'step-hint-box ' : ''} ${menu.isOk ? 'active ' : ''}`"
                            @click="selectContent(index, menu)"
                        >
                            <span
                                v-if="!menu.isOk && verifyModule"
                                class="step-hint step-ok">
                                <jl-icon-svg icon-class="step-not-finish">
                                </jl-icon-svg>
                            </span>
                            <img
                                class="step-ok"
                                src="./images/icon_step_ok.png"
                                alt="状态完成"
                                v-if="menu.isOk"
                            />
                            <div
                                :class="{'step-cont step-cont-active': currentIndex===index, 'step-cont': currentIndex !== index}"
                            >
                                <div
                                    :class="{'step-box step-box-active': currentIndex===index, 'step-box': currentIndex !== index}"
                                >{{menu.name}}
                                <span class="step-require" v-if="menu.isRequired">*</span>
                                </div>
                            </div>
                        </li>
                        <li class="last-li"></li>
                    </ul>
                </div>
            </div>
        </div>
        <!--分享结果页-->
        <div class="share-success-box" v-if="shareFlag">
            <div class="center-header">
                <div class="header-step">
                    <span class="iconfont iconsuccess_all"></span>
                </div>
                <div class="header-step-dis">您已完成编辑，可在右侧区域预览您的编辑效果</div>
                <div class="header-step-status">
                    <div class="header-line"></div>
                    <img src="./images/step_unSuccess.png" alt="图片" />
                </div>
            </div>
            <div class="share-body">
                <div class="share-method-box">
                    <div class="share-box-hd">
                        <h3>选择分享方式</h3>
                    </div>
                    <div class="share-box-bd">
                        <div class="share-method">
                            <el-radio
                            v-model="shareMethod"
                            label="1">短信分享
                            </el-radio>
                            <el-radio
                            v-model="shareMethod"
                            label="2">微信分享
                            </el-radio>
                        </div>
                        <div class="wx-message-method-box" v-if="shareMethod === '1'">
                            <div class="wx-message">资料将通过短信发送给：
                                <span class="bind-wx-name">{{user_mobile}}</span>
                            </div>
                            <div class="wx-message">
                                <div class="th">添加发送手机号：</div>
                                <div class="td">
                                    <el-input
                                    v-model="phoneInput"
                                    maxlength="12"
                                    placeholder="">
                                    </el-input>
                                </div>
                            </div>
                            <div class="method-tip"><i class="iconfont iconupload_fail" aria-hidden="true"></i>注释：微信分享的小程序，客户的打开率高50倍哟~</div>
                        </div>
                        <div class="wx-message-method-box" v-else>
                            <div class="wx-message" v-if="user_wechat ? user_wechat.length > 0 : false">该订单绑定的微信名称为：
                                <span>{{user_wechat ? user_wechat.join('、') : ''}}</span>
                                <span
                                class="bind-wx"
                                v-if="user_wechat ? user_wechat.length < 5 : false"
                                @click="bindWx">点击绑定微信</span>
                            </div>
                            <div class="wx-message" v-else>该订单暂未绑定微信
                                <span
                                class="bind-wx"
                                @click="bindWx">点击绑定微信</span>
                            </div>
                            <div class="method-tip"><i class="iconfont iconupload_fail" aria-hidden="true"></i>请将资料通过微信发送给绑定客户，即可完成发送资料的任务</div>
                        </div>
                    </div>
                </div>
                <div class="share-code-box">
                    <img
                        :src="codeUrl"
                        alt="分享二维码"/>
                </div>
            </div>
            <div class="share-btn-area">
                <el-button
                class="update-btn"
                type="primary"
                @click="updateShare">再次编辑</el-button>
                <el-button
                class="send-immediately"
                type="primary"
                @click="phoneSend"
                v-if="shareMethod === '1'">立即发送</el-button>
                <el-button
                class="send-article"
                @click="phoneSend(1)"
                type="primary"
                v-if="articleFlag == 'true' && shareMethod === '1'">提交并发送购房知识</el-button>
                <el-button
                class="send-article"
                @click="submitArticle"
                type="primary"
                v-if="articleFlag == 'true' && shareMethod !== '1'">提交并发送购房知识</el-button>
            </div>
        </div>
        <!--右侧预览区-->
        <div class="preview-wrapper option right-box-pre">
            <div class="right-wrapper">
                <!--置顶头部-->
                <div class="right-header">
                    <div class="share-header-box">
                        <div class="right-header-tit">小程序预览</div>
                        <div
                            :class="{'disabled-btn': (!shareBtn || !isReq), 'right-header-btn': shareBtn}"
                        >
                            <el-button type="primary" @click="singleShare">分享</el-button>
                        </div>
                        <div class="right-header-cont">实时展示左边侧的编辑信息</div>
                    </div>
                    <div class="user-info-box">
                        <div class="user-info-pic">
                            <img
                                :src="employeeInfo.avatar"
                                alt="咨询师头像"/>
                            <img
                                class="pic-icon"
                                src="./images/pic_v.png"
                                alt="头像大V"/>
                        </div>
                        <div class="user-info-op">
                            <span class="iconfont iconphone_icon"></span>
                            <span class="iconfont iconqa_code"></span>
                            <span class="iconfont iconshare_icon"></span>
                        </div>
                        <div class="user-info-cont">
                            <p
                                class="user-info-name"
                            >{{employeeInfo ? employeeInfo.employee_name : ''}}</p>
                            <p class="user-info-phone">{{employeeInfo ? employeeInfo.mobile : ''}}</p>
                        </div>
                    </div>
                </div>
                <div class="right-body">
                    <!--客户需求 swith-pre、swith-next-->
                    <div class="content-box require-box" id="0" ref="menuList">
                        <div
                            class="right-body-row scroll-line"
                            :class="{'curren-scroll-box': (currentIndex === 0 && !shareFlag)}"
                        >
                            <div class="hd">您的购房需求</div>
                            <div class="bd">
                                <div class="bd-dis">
                                    <ul class="require-list">
                                        <li
                                            v-if="totalPrice.is_show == 0 && ((totalPrice.value_min !== '' && totalPrice.value_min !== null) || (totalPrice.value_max !== '' && totalPrice.value_max !== null))"
                                        >
                                            <div class="tag-wrapper">
                                                总价{{totalPrice.value_min}}
                                                <span
                                                    v-if="(totalPrice.value_min !== '' && totalPrice.value_min !== null) && (totalPrice.value_max !== '' && totalPrice.value_max !== null)"
                                                >-</span>
                                                {{totalPrice.value_max}}万
                                            </div>
                                        </li>
                                        <li
                                            v-if="firstPrice.is_show == 0 && ((firstPrice.value_min !== '' && firstPrice.value_min !== null) || (firstPrice.value_max !== '' && firstPrice.value_max !== null))"
                                        >
                                            <div class="tag-wrapper">
                                                首付{{firstPrice.value_min}}
                                                <span
                                                    v-if="(firstPrice.value_min !== '' && firstPrice.value_min !== null) && (firstPrice.value_max !== '' && firstPrice.value_max !== null)"
                                                >-</span>
                                                {{firstPrice.value_max}}万
                                            </div>
                                        </li>
                                        <li
                                            v-if="acreage.is_show == 0 && ((acreage.value_min !== '' && acreage.value_min !== null) || (acreage.value_max !== '' && acreage.value_max !== null))"
                                        >
                                            <div class="tag-wrapper">
                                                {{acreage.value_min}}
                                                <span
                                                    v-if="(acreage.value_min !== '' && acreage.value_min !== null) && (acreage.value_max !== '' && acreage.value_max !== null)"
                                                >-</span>
                                                {{acreage.value_max}}㎡
                                            </div>
                                        </li>
                                        <li
                                            v-if="user_require.project_type ? user_require.project_type.is_show == 0 : false"
                                        >
                                            <div class="tag-wrapper" v-if="typeName">{{typeName}}</div>
                                        </li>
                                        <li
                                            v-if="user_require.qualifications ? user_require.qualifications.is_show == 0 : false"
                                        >
                                            <div
                                                class="tag-wrapper"
                                                v-if="buyQualifi"
                                            >{{buyQualifi}}</div>
                                        </li>
                                        <li
                                            v-for="(doorItem, index) in doorType"
                                            :key="'doorItem-' + index"
                                        >
                                            <div
                                                class="tag-wrapper"
                                                v-if="user_require.house_type ? user_require.house_type.is_show == 0 : false"
                                            >{{doorItem}}</div>
                                        </li>
                                        <li
                                            v-if="user_require.purchase_purpose ? user_require.purchase_purpose.is_show == 0 : false"
                                        >
                                            <div
                                                class="tag-wrapper"
                                                v-if="purchasePurpose"
                                            >{{purchasePurpose}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="right-body-title">
                            <div class="bd">
                                <div class="bd-tit txt-bold">{{first}}</div>
                            </div>
                        </div>
                    </div>
                    <!--推荐理由-->
                    <div class="content-box recommend-box" id="1" ref="menuList">
                        <div
                            class="right-body-row scroll-line"
                            :class="{'curren-scroll-box': (currentIndex === 1 && !shareFlag)}"
                        >
                            <div class="hd">
                                <p class="sub-hd">推荐理由：</p>
                            </div>
                            <div class="bd" v-if="labelList.length > 0">
                                <div class="bd-dis">
                                    <ul class="label-list">
                                        <li
                                            v-for="(label, labelIndex) in labelList"
                                            :key="'label-' + labelIndex"
                                        >{{label.name}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--楼盘描述-->
                    <div class="content-box house-introduce" id="2" ref="menuList">
                        <div
                            class="right-body-row pre-row scroll-line-white"
                            :class="{'curren-scroll-box': (currentIndex === 2 && !shareFlag)}"
                        >
                            <div class="recommen-info" v-if="houseMessage">{{houseMessage}}</div>
                        </div>
                    </div>
                    <!--楼盘参数-->
                    <div class="content-box house-info-introduce" id="3" ref="menuList">
                        <div
                            class="scroll-line house-info-inner"
                            :class="{'curren-scroll-box': (currentIndex === 3 && !shareFlag)}"
                        >
                            <div
                                class="right-body-row"
                                v-if="tableVoice[0] ? tableVoice[0].voice_is_show == 0 : false"
                            >
                                <div class="bd-cont">
                                    <div class="hd">
                                        <p class="sub-hd">咨询师解读：</p>
                                    </div>
                                    <div class="cont-con">
                                        <img
                                            src="./images/audio_pic.png"
                                            alt="播放器图片"/>
                                    </div>
                                </div>
                            </div>
                            <div class="middle-row"></div>
                            <!--楼盘信息-->
                            <div class="right-body-row">
                                <div class="hd">
                                    <div class="hd-link">查看更多信息</div>
                                    <div class="hd-txt">楼盘信息</div>
                                </div>
                                <div class="bd">
                                    <ul class="bd-info s-query">
                                        <li class="auto">
                                            <div class="th">参考单价：</div>
                                            <div class="td-right" v-if="houseStatus">
                                                <div
                                                    class="td-right-btn"
                                                    :class="{'td-right-gray': houseStatus == 3, 'td-right-green': houseStatus == 2, 'td-right-blue': houseStatus == 4}"
                                                >{{statusName}}</div>
                                            </div>
                                            <div class="td td-red" v-if="houseInfo.unit_price">
                                                <span>{{houseInfo.unit_price ? houseInfo.unit_price : ''}}</span>元/㎡
                                            </div>
                                            <div class="td td-red" v-if="!houseInfo.unit_price">
                                                <span>待定</span>
                                            </div>
                                        </li>
                                        <li class="auto">
                                            <div class="th">参考总价：</div>
                                            <div
                                                class="td td-big td-concat"
                                                v-if="(houseInfo.total_price ? houseInfo.total_price.price_min : false) || (houseInfo.total_price ? houseInfo.total_price.price_max : false)"
                                            >
                                                <div
                                                    v-if="checkIsEqual(houseInfo.total_price ? houseInfo.total_price.price_min : '', houseInfo.total_price ? houseInfo.total_price.price_max : '')"
                                                >
                                                    <span>{{houseInfo.total_price ? houseInfo.total_price.price_min : ''}}</span>
                                                    <span
                                                        v-if="checkBettwen(houseInfo.total_price)"
                                                    >-</span>
                                                    <span>{{houseInfo.total_price ? houseInfo.total_price.price_max : ''}}</span>
                                                    <span>万</span>
                                                </div>
                                                <div v-else>
                                                    <span>{{houseInfo.total_price ? houseInfo.total_price.price_min : ''}}</span>
                                                    <span>万</span>
                                                </div>
                                            </div>
                                            <div
                                                class="td td-big td-concat"
                                                v-if="(houseInfo.total_price ? !houseInfo.total_price.price_min : true) && (houseInfo.total_price ? !houseInfo.total_price.price_max : true)"
                                            >待定</div>
                                        </li>
                                        <li class="auto" v-if="decorateName">
                                            <div class="th">装修状况：</div>
                                            <div class="td">{{decorateName}}</div>
                                        </li>
                                        <li class="auto" v-if="typeHouseName">
                                            <div class="th">物业类型：</div>
                                            <div class="td">{{typeHouseName}}</div>
                                        </li>
                                        <li class="auto" v-if="houseInfo.manage_fee">
                                            <div class="th">物业费用：</div>
                                            <div class="td">{{houseInfo.manage_fee}}元/m²*月</div>
                                        </li>
                                        <li class="auto">
                                            <div class="th">楼盘地址：</div>
                                            <div class="th-link">
                                                <img
                                                    src="./images/turn_to.png"
                                                    alt="跳转到地图"
                                                />
                                            </div>
                                            <div class="td td-blue">{{houseInfo.address}}</div>
                                        </li>
                                        <li class="auto" v-if="houseInfo.developer">
                                            <div class="th">开发商：</div>
                                            <div class="td">{{houseInfo.developer}}</div>
                                        </li>
                                        <li class="auto" v-if="houseInfo.property_services">
                                            <div class="th">物业公司：</div>
                                            <div class="td">{{houseInfo.property_services}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--推荐户型-->
                    <div class="right-body-row door-introduce content-box" id="4" ref="menuList">
                        <div
                            class="scroll-line door-introduce-inner"
                            :class="{'curren-scroll-box': (currentIndex === 4 && !shareFlag)}"
                        >
                            <div class="hd">
                                <p class="sub-hd">{{isRealCity ? '推荐户型' : '推荐房源'}}：{{houseList.length}}个</p>
                                <p class="sub-icon">
                                    <span class="iconfont iconhelp_icon"></span>
                                </p>
                            </div>
                            <div class="bd">
                                <div class="slide-wrapper">
                                    <div class="swiper-box">
                                        <swiper
                                            :options="swiperOption"
                                            ref="mySwiper"
                                            v-if="houseList.length > 0"
                                        >
                                            <swiper-slide
                                                class="describe-banner"
                                                v-for="(img, imgIndex) in houseList"
                                                :key="'img-' + imgIndex"
                                            >
                                                <div class="swiper-card">
                                                    <div class="card-pic">
                                                        <img
                                                            :src="showImg(img.apartment_pic)"
                                                            alt="户型图"/>
                                                    </div>
                                                </div>
                                            </swiper-slide>
                                        </swiper>
                                        <swiper
                                            :options="swiperOption"
                                            ref="mySwiper"
                                            v-if="houseList.length === 0"
                                        >
                                            <swiper-slide class="describe-banner">
                                                <div class="swiper-card">
                                                    <div class="card-pic">
                                                        <img
                                                            src="./images/door_take.png"
                                                            alt="户型展位图"
                                                        />
                                                    </div>
                                                </div>
                                            </swiper-slide>
                                        </swiper>
                                    </div>
                                    <div class="hx-info">
                                        首付{{loanObj.down_payments}}%
                                        <span
                                            v-if="loanObj.down_payments !== 100"
                                        >贷款{{loanObj.loan_term}}年 贷款利率{{loanObj.lending_rate}}</span>：
                                    </div>
                                    <div class="hx-tb-box">
                                        <ul class="hx-list-box box-tit">
                                            <li>户型</li>
                                            <li>面积</li>
                                            <li>首付</li>
                                            <li v-if="loanObj.down_payments !== 100">月供</li>
                                            <li>总价</li>
                                        </ul>
                                        <div
                                            class="hx-list"
                                            v-if="houseList ? houseList.length > 0 : false"
                                        >
                                            <ul
                                                :class="{'hx-list-box hx-list-box-active': currentSwiper === doorIndex, 'hx-list-box': currentSwiper !== doorIndex}"
                                                v-for="(doorItem, doorIndex) in houseList"
                                                :key="'door-' + doorIndex"
                                            >
                                                <li>{{doorItem.name ? doorItem.name : '?'}}</li>
                                                <li>{{doorItem.square_metre ? doorItem.square_metre : '?'}}㎡</li>
                                                <li>{{doorItem.total_price ? ((parseInt(loanObj.down_payments) / 100) * parseFloat(doorItem.total_price)).toFixed(2) : '?'}}万</li>
                                                <li
                                                    v-if="loanObj.down_payments !== 100"
                                                >{{getMonthPay(doorItem.total_price, loanObj.down_payments, loanObj.loan_term, loanObj.lending_rate)}}元</li>
                                                <li>{{doorItem.total_price ? doorItem.total_price : '?'}}万</li>
                                            </ul>
                                            <ul
                                                class="hx-list-box hx-list-box-active"
                                                v-if="houseList.length === 0"
                                            >
                                                <li>户型1</li>
                                                <li>? ㎡</li>
                                                <li>? 万</li>
                                                <li v-if="loanObj.down_payments !== 100">? 元</li>
                                                <li>? 万</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--交通情况-->
                    <div class="right-body-row content-box traffic-row" id="5" ref="menuList">
                        <div
                            class="traffic-row-inner scroll-line"
                            :class="{'curren-scroll-box': (currentIndex === 5 && !shareFlag)}"
                        >
                            <div class="hd">交通情况</div>
                            <div class="bd bd-list">
                                <ul
                                    class="s-query"
                                    v-if="preTrafficList ? preTrafficList.length > 0 : false"
                                >
                                    <li
                                        :class="{'auto auto-column': trafficItem.is_show + '' === '0', 'auto auto-column display-none': !(trafficItem.is_show + '' === '0')}"
                                        v-for="(trafficItem, trafficIndex) in preTrafficList"
                                        :key="'trafficIndex-' + trafficIndex"
                                    >
                                        <div
                                            class="traffic-item-box"
                                            v-if="trafficItem.traffic_category + '' === '1'"
                                        >
                                            <div class="th">公交：</div>
                                            <div
                                                class="td"
                                            >距{{trafficItem.station_name}}公交站直线{{trafficItem.distance}}米</div>
                                        </div>
                                        <div class="traffic-item-box" v-else>
                                            <div class="th">地铁：</div>
                                            <div
                                                class="td"
                                            >距{{trafficItem.traffic_name}}{{trafficItem.station_name}}站直线{{trafficItem.distance}}米</div>
                                        </div>
                                    </li>
                                </ul>
                                <p
                                    class="traffic-no-tip"
                                    v-if="preTrafficList ? preTrafficList.length === 0 : true"
                                >您当前尚未设置展示站点，当前楼盘的交通模块将不会展示</p>
                            </div>
                        </div>
                    </div>
                    <!--通勤-->
                    <div
                        class="content-box commu-info-box scroll-line"
                        id="6"
                        :class="{'curren-scroll-box-wrapper': (currentIndex === 6 && !shareFlag)}"
                        ref="menuList"
                    >
                        <div
                            class="right-body-row"
                            :class="{'curren-scroll-bg': (currentIndex === 6 && !shareFlag)}"
                        >
                            <div class="hd">
                                <div class="hd-link">点击地图可查看详情</div>
                                <div class="hd-txt">通勤</div>
                            </div>
                            <div class="bd bd-list">
                                <div class="map-commu-box">
                                    <div class="tab-map-box">
                                        <div class="tab-map-item" @click="changeWay('drive')">
                                            <div class="item-pic">
                                                <img
                                                    v-if="currenMap != 'drive'"
                                                    src="./images/icon_commu.png"
                                                    alt="自驾默认"
                                                />
                                                <img
                                                    v-if="currenMap == 'drive'"
                                                    src="./images/icon_commu_active.png"
                                                    alt="自驾选中"
                                                />
                                            </div>
                                            <p
                                                :class="{'item-tit item-tit-active': currenMap == 'drive', 'item-tit': currenMap != 'drive'}"
                                            >自驾</p>
                                        </div>
                                        <div class="tab-map-item" @click="changeWay('car')">
                                            <div class="item-pic">
                                                <img
                                                    v-if="currenMap != 'car'"
                                                    src="./images/transit_icon_default.png"
                                                    alt="公交默认"
                                                />
                                                <img
                                                    v-if="currenMap == 'car'"
                                                    src="./images/transit_icon_active.png"
                                                    alt="公交选中"
                                                />
                                            </div>
                                            <p
                                                :class="{'item-tit item-tit-active': currenMap == 'car', 'item-tit': currenMap != 'car'}"
                                            >公交</p>
                                        </div>
                                    </div>
                                    <div class="map-tab">
                                        <!--firAddress为true的时候，代表第一个地址展示-->
                                        <div
                                            class="map-commu"
                                            id="map-single-share"
                                            :class="{'dispear-box': !firAddress}"
                                        ></div>
                                        <div
                                            class="map-commu"
                                            id="map-single-share-second"
                                            :class="{'dispear-box': firAddress}"
                                        ></div>
                                        <div class="map-commu-info-box" v-show="firAddress">
                                            <ul class="commu-tab">
                                                <li
                                                    class="active"
                                                    @click="changeAddress(0)"
                                                >{{(addressObj ? addressObj.address : '?') ? addressObj.address : '?'}}</li>
                                                <li
                                                    v-if="addressArr ? addressArr.length > 1 : false"
                                                    @click="changeAddress(1)"
                                                >{{(addressObjSen ? addressObjSen.address : '?') ? addressObjSen.address : '?'}}</li>
                                            </ul>
                                            <ul
                                                class="s-query commu-tab-info"
                                                v-if="currenMap == 'drive'"
                                            >
                                                <li>
                                                    <div class="th">自驾：</div>
                                                    <div class="td">
                                                        <span
                                                            class="icommu-tab-info-tit"
                                                        >{{addressTable[0] ? addressTable[0].drive_time : ''}} 分钟</span>左右
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="th">地址：</div>
                                                    <div
                                                        class="td"
                                                    >{{houseInfo.name}} > {{addressObj ? addressObj.address : ''}}</div>
                                                </li>
                                            </ul>
                                            <ul class="s-query commu-tab-info" v-else>
                                                <li>
                                                    <div class="th">公交/地铁：</div>
                                                    <div class="td" v-if="isWalkCheck == 0">
                                                        <span
                                                            class="icommu-tab-info-tit"
                                                        >{{addressTable[0] ? (parseInt(addressTable[0].bus_transit_time ? addressTable[0].bus_transit_time : 0) + parseInt(addressTable[0].bus_walk_time ? addressTable[0].bus_walk_time : 0)) : ''}} 分钟</span>左右
                                                    </div>
                                                    <div class="td" v-else>
                                                        <span
                                                            class="icommu-tab-info-tit"
                                                        >{{addressTable[0] ? addressTable[0].bus_transit_time : ''}} 分钟</span>左右
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="th">地址：</div>
                                                    <div
                                                        class="td"
                                                    >{{houseInfo.name}} > {{addressObj ? addressObj.address : ''}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="map-commu-info-box" v-show="!firAddress">
                                            <ul class="commu-tab">
                                                <li
                                                    @click="changeAddress(0)"
                                                >{{(addressObj ? addressObj.address : '?') ? addressObj.address : '?'}}</li>
                                                <li
                                                    v-if="addressArr ? addressArr.length > 1 : false"
                                                    class="active"
                                                    @click="changeAddress(1)"
                                                >{{(addressObjSen ? addressObjSen.address : '?') ? addressObjSen.address : '?'}}</li>
                                            </ul>
                                            <ul
                                                class="s-query commu-tab-info"
                                                v-if="currenMap == 'drive'"
                                            >
                                                <li>
                                                    <div class="th">自驾：</div>
                                                    <div class="td">
                                                        <span
                                                            class="icommu-tab-info-tit"
                                                        >{{addressTableSecon[0] ? addressTableSecon[0].drive_time : '?'}} 分钟</span>左右
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="th">地址：</div>
                                                    <div
                                                        class="td"
                                                    >{{houseInfo.name}} > {{addressObjSen ? addressObjSen.address : ''}}</div>
                                                </li>
                                            </ul>
                                            <ul class="s-query commu-tab-info" v-else>
                                                <li>
                                                    <div class="th">公交/地铁：</div>
                                                    <div class="td" v-if="isWalkCheckSen == 0">
                                                        <span
                                                            class="icommu-tab-info-tit"
                                                        >{{addressTableSecon[0] ? (parseInt(addressTableSecon[0].bus_transit_time ? addressTableSecon[0].bus_transit_time : 0) + parseInt(addressTableSecon[0].bus_walk_time ? addressTableSecon[0].bus_walk_time : 0)) : ''}} 分钟</span>左右
                                                    </div>
                                                    <div class="td" v-else>
                                                        <span
                                                            class="icommu-tab-info-tit"
                                                        >{{addressTableSecon[0] ? addressTableSecon[0].bus_transit_time : ''}} 分钟</span>左右
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="th">地址：</div>
                                                    <div
                                                        class="td"
                                                    >{{houseInfo.name}} > {{addressObjSen ? addressObjSen.address : ''}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="middle-row"></div>
                        <div
                            class="right-body-row esf-body-row"
                            :class="{'curren-scroll-bg': (currentIndex === 6 && !shareFlag)}"
                        >
                            <div class="hd">
                                <div class="hd-link">更新时间：{{matchDate}}</div>
                                <div class="hd-txt">周边房价详情</div>
                            </div>
                            <div class="bd around-list">
                                <ul
                                    class="s-query"
                                    v-if="checkPlan(esfData) && (esfData.landShow + '' === '0' || esfData.secondShow + '' === '0')"
                                >
                                    <li class="auto" v-if="esfData.landShow + '' === '0'">
                                        <div class="th">最新地价</div>
                                        <div class="td">{{esfData.landPrice}} 元/㎡</div>
                                    </li>
                                    <li class="auto" v-if="esfData.secondShow + '' === '0'">
                                        <div class="th">二手房价格</div>
                                        <div class="td">{{esfData.secondPrice}} 元/㎡ 左右</div>
                                    </li>
                                </ul>
                                <p
                                    v-if="!checkPlan(esfData) || (esfData.landShow + '' !== '0' && esfData.secondShow + '' !== '0')"
                                >您当前尚未设置展示价格，当前楼盘的周边价格模块将不会展示</p>
                                <div
                                    class="bd-btn"
                                    v-if="checkPlan(esfData) && esfData.landShow + '' === '0' || esfData.secondShow + '' === '0'"
                                >
                                    <span class="iconfont iconicon_dianjiliaojiegengduox"></span>点击了解更多配套/教育信息
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--个人资料-->
                    <div
                        class="content-box counse-container"
                        id="7"
                        ref="menuList"
                        v-if="employeeInfo ? employeeInfo.id : false"
                    >
                        <div
                            class="right-body-row scroll-line"
                            :class="{'curren-scroll-box-wrapper': (currentIndex === 7 && !shareFlag)}"
                        >
                            <div class="bd">
                                <div class="counselor-box">
                                    <div class="img-warp">
                                        <img
                                            class="shadow"
                                            src="./images/cur-shadow.png"
                                            alt="图片背景"
                                        />
                                        <img
                                            :src="employeeInfo.avatar"
                                            alt="咨询师图片"/>
                                        <div class="desc">
                                            <div class="left">
                                                <div
                                                    class="coun-name"
                                                >{{employeeInfo.employee_name}}</div>
                                                <div
                                                    class="graduation-school"
                                                >毕业于{{employeeInfo.academy}}</div>
                                            </div>
                                            <div class="right">戳我咨询</div>
                                        </div>
                                    </div>
                                    <ul
                                        class="serve"
                                        :class="{'curren-scroll-bg': (currentIndex === 7 && !shareFlag)}"
                                    >
                                        <li>
                                            <div class="num">
                                                {{employeeInfo.see_num}}
                                                <span>次</span>
                                            </div>
                                            <div class="text">免费带看</div>
                                        </li>
                                        <span class="line"></span>
                                        <li>
                                            <div class="num">
                                                {{employeeInfo.order_num}}
                                                <span>人</span>
                                            </div>
                                            <div class="text">服务客户</div>
                                        </li>
                                        <span class="line"></span>
                                        <li>
                                            <div class="num good" v-if="employeeInfo.high_rate">
                                                {{(employeeInfo.high_rate + '').split('%')[0]}}
                                                <span>%</span>
                                            </div>
                                            <div class="text">客户满意度</div>
                                        </li>
                                    </ul>
                                    <div
                                        class="tag-warp"
                                        :class="{'curren-scroll-bg': (currentIndex === 7 && !shareFlag)}"
                                    >
                                        <ul>
                                            <li
                                                class="item"
                                                v-for="(tag,index) in employeeInfo.tag"
                                                :key="index"
                                            >{{tag}}</li>
                                        </ul>
                                        <p>{{employeeInfo.introduce}}</p>
                                    </div>
                                </div>
                                <div
                                    class="question-box"
                                    :class="{'curren-scroll-bg': (currentIndex === 7 && !shareFlag)}"
                                >
                                    <div class="hd">我的买房问答</div>
                                    <div class="bd buy-house">
                                        <ul>
                                            <li v-for="(ques,index) in qaSelectedList" :key="index">
                                                <div v-if="ques.selected==0">
                                                    <div class="title">{{ques.question}}</div>
                                                    <div class="desc">
                                                        <span>{{ques.questioner_nickname}}</span>
                                                        <span
                                                            v-if="ques.total_price_max!='' || ques.total_price_min!=''"
                                                        >
                                                            {{ques.total_price_min}}
                                                            <span
                                                                v-if="ques.total_price_max!=='' && ques.total_price_max!==ques.total_price_min"
                                                            >-{{ques.total_price_max}}</span>预算
                                                        </span>
                                                        <span>{{ques.purchase_purpose}}</span>
                                                        <span class="time">{{ques.create_datetime}}</span>
                                                    </div>
                                                    <div class="content" v-html="ques.answer">
                                                        <span></span>
                                                        <!-- {{ques.answer}} -->
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div
                                    class="remark-box"
                                    :class="{'curren-scroll-bg': (currentIndex === 7 && !shareFlag)}"
                                    v-if="employeeInfo.comment"
                                >
                                    <div class="hd">用户点评</div>
                                    <div class="bd">
                                        <div class="user-info">
                                            <div class="avatar" v-if="employeeInfo.comment.img">
                                                <img
                                                    :src="employeeInfo.comment.img"
                                                    alt="评论图片"/>
                                            </div>
                                            <ul class="desc" v-if="employeeInfo.comment">
                                                <li class="name">{{employeeInfo.comment.user_name}}</li>
                                                <li v-if="employeeInfo.comment.datetime">
                                                    <div
                                                        class="th"
                                                    >{{employeeInfo.comment.type == 1 ? '成交时间：' : '带看时间：'}}</div>
                                                    <div
                                                        class="td"
                                                    >{{employeeInfo.comment.datetime}}</div>
                                                </li>
                                                <li
                                                    v-if="employeeInfo.comment.employee_grade && employeeInfo.comment.type!='1'"
                                                >
                                                    <div class="th">推荐星级：</div>
                                                    <div class="td">
                                                        <el-rate
                                                            v-model="employeeInfo.comment.employee_grade"
                                                            disabled
                                                            :allow-half="true"
                                                            text-color="#FFCF2B"
                                                        ></el-rate>
                                                    </div>
                                                </li>
                                                <li v-if="employeeInfo.comment.type!='1'">
                                                    <ul v-if="employeeInfo.comment.comment_labels">
                                                        <li
                                                            v-for="(tag,index) in employeeInfo.comment.comment_labels"
                                                            :key="index"
                                                        >{{tag}}</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <p>{{employeeInfo.comment.comment}}</p>
                                    </div>
                                </div>
                                <div class="btn-area">
                                    <div class="left-btn">分享名片</div>
                                    <div class="right-btn">联系咨询师</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="replenish-height" ref="replenish"></div>
                </div>
            </div>
        </div>
        <!-- 微信上传弹窗 -->
        <el-dialog
            title="上传微信数据提示"
            :visible.sync="uploadWxShow"
            custom-class="wx-upload-dialog"
            center
            :show-close="false"
        >
            <div class="wechat-dialog-con">
                <div class="wechat-dialog-tit">请打开自研手机的推送消息，打开后即可绑定客户微信了~</div>
                <div class="wechat-dialog-tip"><span class="iconfont iconupload_fail"></span> 您也可以打开【咨询师APP】的【订单详情】点击【上传微信数据】手动上传，上传有2分钟的延迟请耐心等待</div>
            </div>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    @click="uploadWxShow = false"
                >确认</el-button>
            </span>
        </el-dialog>
        <!-- 微信绑定弹窗 -->
        <el-dialog
            title="客户微信绑定信息"
            :visible.sync="bindWechatDialogShow"
            custom-class="wx-bind-dialog"
            center
            :show-close="false"
        >
            <div class="wechat-dialog-con">
                <div class="dialog-con-tit" v-if="user_wechat.length === 0">请添加客户微信号码：</div>
                <div class="dialog-con-tit" v-else>已绑定客户微信号：<span>{{user_wechat.join('、')}}</span></div>
                <ul class="dialog-input-list">
                    <li
                        v-for="(item, index) in wechatVals"
                        :key="index"
                    >
                        <div class="th">
                            客户微信
                        </div>
                        <div class="tf">
                            <el-button
                                v-if="index !== 0"
                                @click="delWechatItem(index)"
                                type="text"
                            >删除</el-button>
                        </div>
                        <div class="td">
                            <search-select-radio v-model="item.id"
                                :apiInfo="wxApiInfo"
                                :chosenObj="wxChosenList[index]"
                                :chosenList="wechatVals"
                                @getOption="(val) => getOption(val, index)"
                                :listKey="listKey">
                            </search-select-radio> 
                        </div>
                    </li>
                </ul>
                <div class="add-input-item">
                    <el-button
                        @click="addWechatItem"
                        type="text"
                    >+新增</el-button>
                    <span :class="{'beyond-limit-msg':beyondLimitHide}">（绑定次数超限）</span>
                </div>
                <ul class="dialog-upload-ul">
                    <li>
                        <div class="th"><span class="iconfont iconupload_fail"></span> 绑定微信时若找不到客户微信请点击</div>
                        <div
                        class="td upload-wx"
                        @click="uploadWxInfo">上传微信数据 </div>
                    </li>
                </ul>
                <span :class="{'error-msg':true,'is-wechat-error-hide':isMsgErrorHide}">{{wechatErrorMsg}}</span>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="cancleWechatBind">取 消</el-button>
                <el-button
                    type="primary"
                    @click="bindWechat"
                >绑 定</el-button>
            </span>
        </el-dialog>
        <!-- 浏览器缩放提醒弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="zoomDialog"
            custom-class="zoom-dialog"
            center
            width="26%">
            <div class="wechat-dialog-con">
                <div class="wechat-dialog-tit">您的页面缩放比例不正确，会影响页面的部分功能！</div>
                <div class="wechat-dialog-tip"><span class="iconfont iconupload_fail"></span> 请尝试调整浏览器的缩放比例为100%（ctrl+0或者command配合+）</div>
            </div>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    @click="zoomDialog = false"
                >确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import VueClipboard from 'vue-clipboard2'
import Vue from 'vue'
import defultImg from './images/door_take.png'
import startIcon from './images/start-one.png'
import endIcon from './images/end-one.png'
import { SearchSelectRadio } from '@/components';
import { commonFun } from '@/assets/js/utils/utils'
import api from './api/searchToolShare'
import loadMap from '@/assets/js/utils/map.js';
Vue.use(VueClipboard)
window.mOxie = window.moxie = require('../../../../static/lib/uploads/moxie.js')
let plainObj = {
    drive_time: '',
    bus_duration: '',
    bus_transit_time: '',
    bus_walk_time: '',
    start_address: '',
    start_lat: '',
    start_lng: ''
}
require('../../../../static/lib/uploads/plupload.dev')
export default {
    name: 'SingleHouseShare',
    data () {
        return {
            // 下拉key和value
            listKey: Object.freeze({
                key: 'id',
                keyWord: 'text'
            }),
            // 未完成模块强提示
            verifyModule: false,
            // 分享方式
            shareMethod: '2',
            // 绑定的微信号列表，用于展示
            user_wechat: [],
            // 是否选择了文章
            articleFlag: this.$route.query.share_article,
            // 绑定手机号
            user_mobile: '',
            // 选中的微信联系人对象数组
            wxChosenList: [
                {
                    id: ''
                }
            ],
            // 微信绑定弹窗显示标识
            bindWechatDialogShow: false,
            // 微信接口请求信息
            wxApiInfo: {},
            // 上传微信重复提交标识
            uploadWxRepeatFlag: true,
            // 绑定微信联系人重复标识
            bindWxRepeatFlag: true,
            // 发送短信重复提交标识
            sendMsgRepeatFlag: true,
            // 上传微信成功弹窗
            uploadWxShow: false,
            // 手机号输入
            phoneInput: '',
            chddecked: true,
            // 通勤表格
            addressTable: [],
            // 第二个目的地通勤表格
            addressTableSecon: [],
            // 步行时长选择，0代表选中，1代表未选中
            isWalkCheck: '0',
            // 步行选择第二个
            isWalkCheckSen: '0',
            // 第一个通勤表格loading
            tbLoading: false,
            // 第二个通勤表格loading
            tbSenLoading: false,
            // 通勤地址数组
            addressArr: [],
            isReq: true, // 提交标识
            isLoading: false, // 弹窗loading图
            nowScrollHe: '', // 当前滚动高度
            map: '', // 地图实例
            mapSecon: '',
            listHeight: [], // 右侧每个模块的高度数组
            firAddress: true, // 是否是第一个通勤地址被选中
            swiperIndex: 0, // 左侧当前选中项
            customInput: '', // 自定义标签输入框
            // 客户微信默认值
            wechatVals: [
                {
                    id: ''
                }
            ],
            // 绑定次数超限默认隐藏
            beyondLimitHide: true,
            // 客户微信绑定错误提示信息
            wechatErrorMsg: '',
            // 客户微信绑定错误提示默认隐藏
            isMsgErrorHide: true,
            tripList: [
                {
                    type: '1',
                    text: '公交'
                },
                {
                    type: '2',
                    text: '地铁'
                }
            ], // 交通类型
            customLabel: [], // 自定义标签列表
            cityId: this.$route.query.city_id, // 当前城市id
            ac: {}, // 输入框实例
            acSecon: {}, // 输入框实例第二个通勤地址
            commType: 0, // 通勤展示标志，为驾车还是地铁
            sysLabel: [], // 系统标签列表
            labelList: [], // 右侧预览展示标签
            houseMessage: '', // 楼盘描述
            first: '', // 开头语
            projectReview: [], // 咨询师点评模板
            cusHouse: {}, // 自定义户型
            sysHouse: {}, // 系统户型
            employeeInfo: {}, // 咨询师信息
            houseList: {}, // 选中户型
            testSS: '',
            houseListTake: [
                {
                    id: '',
                    name: '',
                    square_metre: '',
                    total_price: '',
                    apartment_pic: ''
                }
            ], // 无选中户型时候展示
            shareFlag: false, // 分享标志
            addressObj: {
                address: '',
                lat: '',
                lng: ''
            }, // 通勤地址
            addressObjSen: {
                address: '',
                lat: '',
                lng: ''
            }, // 通勤地址2
            loanObj: {
                down_payments: null, // 首付比例
                lending_rate: 4.9, // 贷款利率
                loan_term: null // 贷款年限
            }, // 楼盘筛选
            saveRate: 4.9, // 当前保存的利率
            payList: [
                {
                    value: 10,
                    label: '10%'
                }, {
                    value: 15,
                    label: '15%'
                }, {
                    value: 20,
                    label: '20%'
                }, {
                    value: 25,
                    label: '25%'
                }, {
                    value: 30,
                    label: '30%'
                }, {
                    value: 35,
                    label: '35%'
                }, {
                    value: 40,
                    label: '40%'
                }, {
                    value: 45,
                    label: '45%'
                }, {
                    value: 50,
                    label: '50%'
                }, {
                    value: 55,
                    label: '55%'
                }, {
                    value: 60,
                    label: '60%'
                }, {
                    value: 65,
                    label: '65%'
                }, {
                    value: 70,
                    label: '70%'
                }, {
                    value: 75,
                    label: '75%'
                }, {
                    value: 80,
                    label: '80%'
                }, {
                    value: 85,
                    label: '85%'
                }, {
                    value: 90,
                    label: '90%'
                }, {
                    value: 95,
                    label: '95%'
                }, {
                    value: 100,
                    label: '100%'
                }
            ], // 首付比例列表
            loanYearList: [], // 贷款年限列表
            preTrafficList: [], // 右侧预览公交组装内容
            preTraffic: {
                car: [],
                line: []
            }, // 右侧预览公交内容
            shareBtn: true, // 是否可以分享
            swiperOption: { // 居理流程swipper
                slidesPerView: 'auto',
                observer: true,
                observeSlideChildren: true,
                on: {
                    transitionEnd: () => {
                        let swiper = this.$refs.mySwiper.swiper
                        // 不满一屏的轮播，activeIndex是不准的，最后一个和倒数第二个的索引是相同的，需要借助isEnd参数来判断
                        if (swiper.isEnd) {
                            this.currentSwiper = swiper.slides.length - 1
                        } else {
                            this.currentSwiper = swiper.activeIndex
                        }
                    }
                }
            },
            signs: {}, // 获取的oss签名信息
            currentSwiper: 0, // swiper当前索引
            uploader: [], // 上传插件实例
            upFile: '', // 当前上传的文件路径
            tableTrafficData: [], // 公交数组
            esfData: {}, // 二手房周边表格
            audioStatus: '点击试听',
            spanOneArr: [], // 概览中表格合并
            codeUrl: defultImg, // 二维码url
            stepOneFlag: true, // 第一步是否完成标志
            carInfo: {}, // 驾车信息
            busInfo: {}, // 公交信息
            carInfoSecon: {}, // 驾车信息
            busInfoSecon: {}, // 公交信息
            marker: {
                // 标识
                origin: {
                    lng: '', // 起始位置经度
                    lat: '' // 起始位置维度
                },
                destination: {
                    lng: '', // 结束位置经度
                    lat: '' // 结束位置维度
                }
            },
            markerSecon: {
                // 标识
                origin: {
                    lng: '', // 起始位置经度
                    lat: '' // 起始位置维度
                },
                destination: {
                    lng: '', // 结束位置经度
                    lat: '' // 结束位置维度
                }
            },
            overLayId: '', // 所清除的覆盖物标识
            markStart: '', // 起点图标
            markEnd: '', // 终点图标
            overLayIdSecon: '', // 所清除的覆盖物标识
            markStartSecon: '', // 起点图标
            markEndSecon: '', // 终点图标
            trackMessages: '',
            backendApi: '',
            labelEnd: '', // 终点覆盖物
            label: '', // 起点覆盖物
            labelEndSecon: '', // 终点覆盖物
            labelSecon: '', // 起点覆盖物
            currenUpId: 0, // 当前正在上传图片的插件id
            project_id: this.$route.query.project_id, // 楼盘id
            share_id: this.$route.query.share_id, // 分享id
            houseInfo: {}, // 楼盘信息
            statusList: [], // 通用销售状态
            houseStatus: '', // 销售状态选中项
            btnObj: {
                preBtn: '上一步',
                nextBtn: '下一步'
            }, // 操作按钮对象
            // 居室下拉数组
            roomTypeList: [],
            setCommuFlag: false, // 是否点击了通勤下拉
            setCommuFlagSecon: false, // 是否点击了通勤下拉
            tableVoice: [], // 楼盘语音解读
            statusIndex: 0, // 楼盘参数详情选中的状态值的前一个
            decorateList: [], // 装修情况
            typeList: [], // 业态
            isPlaying: false, // 是否播放
            qualificationList: [], // 购房资质
            houseTypeList: [], // 户型
            purchaseList: [], // 购房目的
            esfTime: '', // 二手房周边时间
            cusTagInput: '', // 咨询师自定义标签输入框
            user_require: {}, // 用户需求内容
            totalPrice: {},
            firstPrice: {},
            acreage: {},
            qaList: [], // 咨询师问答list
            upCodeFile: '', // 上传的二维码url
            chosenItemIndex: 0, // 问题选中项
            houseNameInput: '', // 输入楼盘名称搜索问答
            qaListSele: [], // 被选中的问答
            qaSelectedList: [], // 被选中的问题数组
            defaultQaNum: 2, // 默认问答需要选中几个
            currenMap: 'drive', // 通勤默认选中自驾，drive为自驾，car为公交
            star: 4.5, // 用户点评评分
            // 提醒浏览器缩放弹窗
            zoomDialog: false,
            // 是否是真实城市
            isRealCity: false,
            // 整体数据是否渲染出错
            pageDataError: false,
            swiperArr: [
                {
                    id: 1,
                    name: '1. 客户需求',
                    isOk: false,
                    isRequired: false
                },
                {
                    id: 2,
                    name: '2. 添加标签',
                    isOk: false,
                    isRequired: true
                },
                {
                    id: 3,
                    name: '3. 楼盘描述',
                    isOk: false,
                    isRequired: true
                },
                {
                    id: 4,
                    name: '4. 楼盘参数',
                    isOk: false,
                    isRequired: true
                },
                {
                    id: 5,
                    name: '5. 推荐户型',
                    isOk: false,
                    isRequired: true
                },
                {
                    id: 6,
                    name: '6. 附近交通',
                    isOk: false,
                    isRequired: false
                },
                {
                    id: 7,
                    name: '7. 地址&价格',
                    isOk: false,
                    isRequired: false
                }
            ] // swiper数组
        }
    },
    computed: {
        // 业态名称
        typeName () {
            let resul = ''
            let projectType = this.user_require ? this.user_require.project_type.value : ''
            for (let i = 0; i < this.typeList.length; i++) {
                if (this.typeList[i].value == projectType) {
                    resul = this.typeList[i].name
                    break
                }
            }
            return resul
        },
        // 购房资质
        buyQualifi () {
            let resul = ''
            let qualificationType = this.user_require ? this.user_require.qualifications.value : ''
            for (let i = 0; i < this.qualificationList.length; i++) {
                if (this.qualificationList[i].value == qualificationType) {
                    resul = this.qualificationList[i].name
                    break
                }
            }
            return resul
        },
        // 购房目的
        purchasePurpose () {
            let resul = ''
            let purchaseType = this.user_require ? this.user_require.purchase_purpose.value : ''
            for (let i = 0; i < this.purchaseList.length; i++) {
                if (this.purchaseList[i].value == purchaseType) {
                    resul = this.purchaseList[i].name
                    break
                }
            }
            return resul
        },
        // 户型
        doorType () {
            let resul = []
            let userRequire = this.user_require.house_type ? this.user_require.house_type.value : []
            let doorType = Array.isArray(userRequire) ? userRequire : []
            for (let i = 0; i < doorType.length; i++) {
                let isHas = this.houseTypeList.findIndex((item) => {
                    return item.value == doorType[i]
                })
                if (isHas !== -1) {
                    resul.push(this.houseTypeList[isHas].name)
                }
            }
            return resul
        },
        // 装修情况
        decorateName () {
            let resul = []
            let doorType = Array.isArray(this.houseInfo.decorate) ? this.houseInfo.decorate : []
            for (let i = 0; i < doorType.length; i++) {
                let isHas = this.decorateList.findIndex((item) => {
                    return item.value == doorType[i]
                })
                if (isHas !== -1) {
                    resul.push(this.decorateList[isHas].name)
                }
            }
            return resul.join('、')
        },
        // 参数业态
        typeHouseName () {
            let resul = ''
            let projectType = this.houseInfo ? this.houseInfo.project_type : ''
            for (let i = 0; i < this.typeList.length; i++) {
                if (this.typeList[i].value == projectType) {
                    resul = this.typeList[i].name
                    break
                }
            }
            return resul
        },
        // 销售状态
        statusName () {
            let resul = ''
            let projectType = this.houseStatus
            for (let i = 0; i < this.statusList.length; i++) {
                if (this.statusList[i].value == projectType) {
                    resul = this.statusList[i].name
                    break
                }
            }
            return resul
        },
        // 显示时间
        matchDate () {
            let time
            if (this.esfTime) {
                time = moment(this.esfTime).format('YYYY-MM-DD')
            } else {
                time = ''
            }
            return time
        },
        // 事实获取当前步骤
        currentIndex () {
            if (this.nowScrollHe < 0) {
                // this.swiperIndex = 0
                return 0
            } else {
                if (this.nowScrollHe > this.listHeight[this.listHeight.length - 1]) {
                    // this.swiperIndex = this.listHeight.length - 2
                    return this.listHeight.length - 2
                } else {
                    for (let i = 0; i < this.listHeight.length; i++) {
                        let height1 = this.listHeight[i]
                        let height2 = this.listHeight[i + 1]
                        if (!height2 || (this.nowScrollHe >= height1 && this.nowScrollHe < height2)) {
                            return i
                        }
                    }
                    // this.swiperIndex = 0
                    return 0
                }
            }
        },
        swiper () {
            return this.$refs.mySwiper.swiper
        }
    },
    created () {
        this.isLoading = true;
        // oss直传
        this.getSign()
        this.qaCodeDefault = require('./images/qa_code_default.png')
    },
    mounted () {
        this.$nextTick(() => {
            // 获取通用下拉
            this.getSelectInfo()
            // 获取虚拟城市
            this.getRealCity();
            // 请求埋点数据
            this.getUser()
            // 获取城市id
            this.cityMatch()
            // 匹配贷款年限和首付比例
            this.loanMatch(this.cityId)
            // 绑定滚动事件
            let scrollBox = document.getElementsByClassName('right-body')[0]
            scrollBox.addEventListener('scroll', this.highThottle(this.menus, this, 100, 50))
            // 动态写年限
            for (let i = 1; i <= 30; i++) {
                let obj = {
                    value: i,
                    label: i + '年'
                }
                this.loanYearList.push(obj)
            }
            // 图片加载不出来
            document.addEventListener('error', function (e) {
                var elem = e.target
                if (elem.tagName.toLowerCase() === 'img') {
                    elem.src = defultImg
                    elem.error = null
                }
            }, true)
            // 判断当前浏览器是否缩放
            // this.checkZoom();
        })
        // 给最后一模块添加高度
        this.$refs.replenish.style.height = document.documentElement.clientHeight + 'px'
    },
    methods: {
        // 判断当前浏览器是否被缩放，如果发生缩放则弹窗提示
        checkZoom() {
            let zoomPixel = commonFun.getZoom();
            console.log(zoomPixel)
            if (zoomPixel !== 100) {
                // 比例如果不是100，则需要弹窗提示
                this.zoomDialog = true;
            }
        },
        // 获取虚拟城市匹配的真实城市
        async getRealCity() {
            try {
                let params = {
                    order_id: this.$route.query.order_id,
                    type: '25',
                    city_id: this.cityId
                };
                const { data } = await api.multiApi(params);
                if (data.code === 0) {
                    if (data.data.real_city_id !== '0') {
                        // 说明是虚拟城市
                        this.isRealCity = false;
                        this.swiperArr[4].name = '5. 推荐房源';
                    } else {
                        this.isRealCity = true;
                        this.swiperArr[4].name = '5. 推荐户型';
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 新增绑定微信
        addWechatItem () {
            let bindedNameLength = Array.isArray(this.user_wechat) ? this.user_wechat.length : 0;
            if (this.wechatVals.length + bindedNameLength < 5) {
                // 新增一条
                let wechatItem = { id: '' };
                this.wechatVals.push(wechatItem);
                this.wxChosenList.push(wechatItem);
            } else {
                // 超过绑定次数提示显示
                this.beyondLimitHide = false;
            }
        },
        // 点击上传微信
        async uploadWxInfo () {
            if (this.uploadWxRepeatFlag) {
                this.uploadWxRepeatFlag = false;
                try {
                    let result = await api.uploadWxMsg();
                    let {data} = result;
                    if (data.code === 0) {
                        this.uploadWxShow = true;
                        // 恢复重复提交标识
                        this.uploadWxRepeatFlag = true;
                    } else {
                        // 恢复重复提交标识
                        this.uploadWxRepeatFlag = true;
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
                } catch (error) {
                    // 恢复重复提交标识
                    this.uploadWxRepeatFlag = true;
                    console.log(error);
                }
            }
        },
        /**
         * 删除微信客户条目
         * @param {string} index 删除微信条目索引
         */
        delWechatItem (index) {
            this.wechatVals.splice(index, 1);
            this.wxChosenList.splice(index, 1);
            // 超过绑定次数提示隐藏
            if (!this.beyondLimitHide) {
                this.beyondLimitHide = true;
            }
        },
        /**
         * 获取联想下拉框选中的下拉对象
         * @param {Object} para 选中的下拉对象
         * @param {Number} index 选中的下拉索引
         */
        getOption (para, index) {
            this.wxChosenList[index] = para;
        },
        // 点击绑定按钮验证
        async bindWechat () {
            if (this.bindWxRepeatFlag) {
                this.bindWxRepeatFlag = false;
                try {
                    let isEmptyArr = this.wechatVals.filter((v) => {
                        return !(v.id);
                    });
                    // 全部都不填，校验不通过，任意填一项，校验通过
                    if (isEmptyArr.length === this.wechatVals.length) {
                        // 恢复重复提交标识
                        this.bindWxRepeatFlag = true;
                        this.$message({
                            message: '请填写客户微信',
                            type: 'error'
                        });
                        return;
                    }
                    let order_id = this.$route.query.order_id;
                    let wxNum = [];
                    let len = this.wechatVals.length;
                    for (let i = 0; i < len; i++) {
                        if (this.wechatVals[i].id) {
                            wxNum.push(this.wechatVals[i].id)
                        }
                    }
                    let result = await api.addWxContact(order_id, wxNum, '7');
                    let {data} = result;
                    if (data.code === 0) {
                        // 合并弹窗外已经存好的微信联系人
                        this.wxChosenList.map((item) => {
                            if (item.id) {
                                this.user_wechat.push(item.text);
                            }
                        });
                        // 清空弹窗内微信数组
                        this.wechatVals = [{id: ''}];
                        this.wxChosenList = [{ id: '' }];
                        this.beyondLimitHide = true;
                    } else {
                        this.$message.warning(data.msg);
                    }
                    // 恢复重复提交标识
                    this.bindWxRepeatFlag = true;
                    // 关闭弹窗
                    this.bindWechatDialogShow = false;
                } catch (error) {
                    // 恢复重复提交标识
                    this.bindWxRepeatFlag = true;
                    this.bindWechatDialogShow = false;
                    console.log(error);
                }
            }
        },
        // 取消微信绑定
        cancleWechatBind () {
            // 关闭弹窗
            this.bindWechatDialogShow = false;
            // 清空错误提示并隐藏
            this.wechatErrorMsg = "";
            this.isMsgErrorHide = true;
        },
        // 客户微信绑定信息input框聚焦，错误提示隐藏
        focusWechat () {
            this.wechatErrorMsg = "";
            this.isMsgErrorHide = true;
        },
        // 点击客户微信绑定信息按钮
        showWechatDialog () {
            // 重置input框
            this.wechatVals = [{ val: '' }];
            // 清空错误提示并隐藏
            this.wechatErrorMsg = "";
            this.isMsgErrorHide = true;
            // 展示弹窗
            this.bindWechatDialogShow = true;
        },
        // 上传微信数据事件功能模块
        uploadWechatData () {
            // 隐藏客户微信绑定信息弹窗
            this.bindWechatDialogShow = false;
            // 展示上传微信数据提示弹窗
            setTimeout(() => {
                this.uploadDialogShow = true;
            }, 200);
        },
        // 绑定微信
        bindWx () {
            this.bindWechatDialogShow = true;
            this.wxApiInfo = {
                api: api.getEmployeeContact,
                params: {
                    order_id: this.$route.query.order_id,
                    exclude: [],
                    q: ''
                }
            };
        },
        /**
         * 立即发送按钮以及发送购房知识
         * @param {Object} para 是否发送购房知识，如果是1则发送购房知识
         */
        async phoneSend (para) {
            if (this.sendMsgRepeatFlag) {
                this.sendMsgRepeatFlag = false;
                // 如果手机号输入了
                if (this.phoneInput && this.phoneInput !== 0) {
                    let result = commonFun.verifyTelNum(this.phoneInput);
                    if (!result) {
                        // 恢复重复提交标识
                        this.sendMsgRepeatFlag = true;
                        this.$message({
                            message: '手机号格式错误',
                            type: 'error'
                        });
                        return;
                    }
                }
                try {
                    // share_type--[1单楼盘 2从楼盘 3文章]
                    let params = {
                        order_id: this.$route.query.order_id,
                        share_id: this.share_id,
                        user_mobile: this.phoneInput,
                        share_type: 1
                    };
                    let result = await api.sendMsg(params);
                    let {data} = result;
                    if (data.code === 0) {
                        // 恢复重复提交标识
                        this.sendMsgRepeatFlag = true;
                        this.$message({
                            message: '短信发送成功',
                            type: 'success'
                        });
                        // 发送购房知识并且当前tab为短信分享
                        if (para === 1 && this.shareMethod === '1') {
                            this.submitArticle();
                        }
                    } else {
                        // 恢复重复提交标识
                        this.sendMsgRepeatFlag = true;
                    }
                } catch (error) {
                    // 恢复重复提交标识
                    this.sendMsgRepeatFlag = true;
                    console.log(error);
                }
            }
        },
        // 提交并发送购房知识
        submitArticle () {
            // 组装文章页面所需要的下拉内容
            this.$router.push({
                path: '/housePurchaseKnowledge',
                query: {
                    order_id: this.$route.query.order_id,
                    city_id: this.$route.query.currentCityId,
                    city_name: this.$route.query.currentCity
                }
            })
        },
        // 点击增加目的地
        addEndAdr () {
            if (this.addressArr.length > 1) {
                return;
            }
            if (this.addressArr.length <= 1) {
                let obj = {
                    address: '',
                    lng: '',
                    lat: ''
                }
                this.addressArr.push(obj);
                // 去掉loading效果
                this.tbSenLoading = false;
                this.addressTableSecon = [];
				this.addressTableSecon.push(JSON.parse(JSON.stringify(plainObj)));
				this.addressObjSen = obj;
                this.addressObjSen.unSaved = true;
                this.$nextTick(() => {
                    this.initInputSen();
                });
            }
        },
        // 删除第二个目的地
        delEndAdr () {
            // 如果是以及保存的地址，请求接口进行删除
            if (!this.addressObjSen.unSaved) {
                let params = {
                    type: 21,
                    commute_lat: this.addressObjSen.lat,
                    commute_lng: this.addressObjSen.lng,
                    share_id: this.share_id,
                    order_id: this.$route.query.order_id
                };
                this.axios.post('/backend-api/bk-map/perform-tasks', params)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.addressArr.splice(1, 1);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.addressArr.splice(1, 1);
            }
            // 清空已经填写地址
            this.addressObjSen = {
				address: '',
				lng: '',
				lat: ''
			};
            // 右侧预览地图自动选择到第一个目的地
            this.firAddress = true;
            // 画上线
            this.$nextTick(() => {
                this.lineTraffic();
            });
            this.checkAddressAndPrice();
        },
        // 判断两个值是否相等
        checkIsEqual (firPara, senPara) {
            return firPara != senPara;
        },
        // 点击播放语音
        playAudio (para) {
            let auidoPlayer = document.getElementById('audio')
            if (para) {
                if (auidoPlayer.paused) {
                    // 暂停中
                    auidoPlayer.play()
                    this.audioStatus = '取消试听'
                    this.isPlaying = true
                } else {
                    // 播放中
                    auidoPlayer.pause()
                    this.audioStatus = '点击试听'
                    this.isPlaying = false
                }
            }
        },
        // 自驾和公交切换
        changeWay (para) {
            this.currenMap = para
            this.$nextTick(() => {
                this.lineTraffic()
            })
        },
        // 切换改变通勤地址
        changeAddress (para) {
            if (para === 0) {
                this.firAddress = true
            } else {
                this.firAddress = false
            }
            this.$nextTick(() => {
                this.lineTraffic()
            })
        },
        // 清空搜索问答框
        clearInput () {
            this.searchQa()
        },
        // 楼盘名称搜索问答
        searchQa () {
            let awId = this.qaSelectedList.map((qa) => {
                return qa.answer_id
            })
            this.qaSelectedList = []
            let params = {
                keywords: this.houseNameInput,
                page: 1,
                page_size: 50,
                selected: awId
            }
            this.axios.post('/backend-api/bk-map/qa-list', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        let resData = data.data
                        if (Array.isArray(resData)) {
                            if (resData.length == 1) {
                                this.qaListSele = resData
                                this.qaList = []
                                this.qaListSele.forEach((que, index) => {
                                    if (que.selected == 0) {
                                        this.qaSelectedList.push(que)
                                    }
                                })
                            }
                            if (resData.length >= 2) {
                                this.qaListSele = resData.slice(0, 2)
                                this.qaList = resData.slice(2, resData.length)
                                this.qaListSele.forEach((que, index) => {
                                    if (que.selected == 0) {
                                        this.qaSelectedList.push(que)
                                    }
                                })
                            }
                            if (resData.length == 0) {
                                this.qaListSele = []
                                this.qaList = []
                            }
                        } else {
                            this.qaListSele = []
                            this.qaList = []
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 选择问题
        choseItem (para) {
            // 至多能选择1或2条
            let itemIndex = this.qaSelectedList ? this.qaSelectedList.length : 0
            if (itemIndex < this.defaultQaNum && para.selected == 1) {
                para.selected = 0
                // 实时记录选中值
                this.qaSelectedList.push(para)
                // 重新计算右侧各个模块高度
                setTimeout(() => {
                    this._calculateHeight()
                })
            } else if (para.selected == 0) {
                para.selected = 1
                // 删除已经选中的问题
                let finIndex = this.qaSelectedList.findIndex((item) => {
                    return item.answer_id == para.answer_id
                })
                if (finIndex != -1) {
                    this.qaSelectedList.splice(finIndex, 1)
                }
                // 重新计算右侧各个模块高度
                setTimeout(() => {
                    this._calculateHeight()
                })
            }
        },
        // 判断是否有值
        checkBettwen (para) {
            let result = false
            if (para) {
                if (para.price_max != '' && para.price_max != null && para.price_min != '' && para.price_min != null) {
                    result = true
                }
            }
            return result
        },
        // 点击添加范围或者是取消范围
        changeArea (para, paraMax) {
            para.isMore = !para.isMore
            this.$set(para, paraMax, '')
        },
        // 判断是添加范围还是取消范围
        checkarea (para) {
            let res = '添加范围'
            if (para) {
                res = '取消范围'
            }
            return res
        },
        // 点击销售状态tab
        clickTab (para, paraIndex) {
            this.houseStatus = para.value
            if (paraIndex > 0) {
                this.statusIndex = paraIndex - 1
            } else {
                this.statusIndex = ''
            }
        },
        // 获取通用下拉信息
        getSelectInfo () {
            let params = {
                type: 19,
                city_id: this.cityId,
                order_id: this.$route.query.order_id
            }
            api.multiApi(params).then(({ data }) => {
                if (data.code === 0) {
                    let resData = data.data
                    // 销售状态
                    this.statusList = resData ? resData.project_status : []
                    // 装修情况
                    this.decorateList = resData ? resData.decorate : []
                    // 业态
                    this.typeList = resData ? resData.require_project_type : []
                    // 购房资质
                    this.qualificationList = resData ? resData.qualifications : []
                    // 户型
                    this.houseTypeList = resData ? resData.house_type : []
                    // 下拉户型
                    this.roomTypeList = resData ? resData.room_type : [];
                    // 购房目的
                    this.purchaseList = resData ? resData.purchase_purpose : []
                }
            })
                .then(() => {
                    // 初始化请求
                    this.getData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 根据城市配置首付和贷款年限
        loanMatch (para) {
            if (para && para.toString() === '20000001') {
                // 上海默认首付比例是35%--20000001，天津默认贷款年限是25--20000019
                if (this.loanObj.down_payments === null) {
                    this.loanObj.down_payments = 35
                }
                if (this.loanObj.loan_term === null) {
                    this.loanObj.loan_term = 30
                }
            } else if (para && para.toString() === '20000019') {
                if (this.loanObj.loan_term === null) {
                    this.loanObj.loan_term = 25
                }
                if (this.loanObj.down_payments === null) {
                    this.loanObj.down_payments = 30
                }
            } else {
                if (this.loanObj.down_payments === null) {
                    this.loanObj.down_payments = 30
                }
                if (this.loanObj.loan_term === null) {
                    this.loanObj.loan_term = 30
                }
            }
        },
        // 修改首付比例
        changePay () {
            this.$nextTick(() => {
                this._calculateHeight()
            })
        },
        // 判断是否为空
        checkPlan (para) {
            return Object.keys(para).length > 0;
        },
        // 匹配城市名称
        cityMatch () {
            api.getCity(2).then((res) => {
                if (res.data.code === 0) {
                    let arr = res.data.data
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id === this.cityId) {
                            this.cityName = arr[i].text
                            break
                        }
                    }
                }
            })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 请求埋点数据
        getUser () {
            let params = {
                order_id: this.$route.query.order_id
            }
            this.axios.post('/backend-api/bk-map/get-user-require', params).then((res) => {
                if (res.data.code === 0) {
                    let Data = res.data.data
                    this.backendApi = Data.www_backend_api
                    this.trackMessages = Data.track_common_property
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        // 页面初始化
        getData (para) {
            // 增加loading
            this.isLoading = true
            let params = {
                order_id: this.$route.query.order_id,
                project_id: this.project_id,
                share_id: this.share_id
            }
            this.axios.post('/backend-api/bk-map/share-project-single', params).then((res) => {
                if (res.data.code === 0) {
					try {
						let resData = res.data.data
						// resData = shareData.data
						this.houseInfo = resData.project
						plainObj.project_name = this.houseInfo ? this.houseInfo.name : ''
						// 概述
						this.houseMessage = this.houseInfo ? this.houseInfo.summary : ''
						this.projectReview = resData.review
						// 语音赋值
						// let voice = this.houseInfo ? this.houseInfo.voice : {}
						let voice = this.houseInfo ? this.houseInfo.voice : {}
						if (!voice.url) {
							// 判断是否有语音，没有展示暂无语音
							this.audioStatus = '暂无语音'
							voice.isDisabled = true
							voice.voice_is_show = '1'
						} else {
							voice.isDisabled = false
						}
						// 默认赋值之前清空
						this.tableVoice = []
						this.tableVoice.push(voice)
						this.first = resData.first
						this.employeeInfo = resData.employee
						// 判断如果当前无咨询师信息，则隐藏最后一个模块和最后一个步骤
						let swiperObj = {
							id: 8,
							name: '8. 个人资料',
							isOk: false,
                            isRequired: true
						}
						let isHas = this.swiperArr.findIndex((item) => {
							return item.id === swiperObj.id
						})
						if (this.employeeInfo.id && isHas === -1) {
							this.swiperArr.push(swiperObj)
						}
						// 个人资料模块
						let qaList = this.employeeInfo ? this.employeeInfo.qa : []
						if (qaList.length > 0) {
							// 记录当前人应该选择几个问答
							if (qaList.length > 1) {
								this.defaultQaNum = 2
							} else {
								this.defaultQaNum = 1
							}
							let qaListSele = qaList.filter(item => item.selected == 0)
							// 如果超过两个，则只取前两个
							if (qaListSele.length > 2) {
								this.qaListSele = qaListSele.slice(0, 2)
								this.chosenItemIndex = 2
							} else {
								this.qaListSele = qaListSele
								this.chosenItemIndex = qaListSele.length
							}
							this.qaSelectedList = JSON.parse(JSON.stringify(this.qaListSele))
							this.qaList = qaList.filter(item => item.selected != 0)
						} else {
							this.defaultQaNum = 0
						}
						// 用户需求，判断是否展示范围值
						this.user_require = resData.user_require
						// 总价
						// 手动增加对象的isMore属性，否则监听不到
						this.totalPrice = this.user_require.total_price
						this.firstPrice = this.user_require.first_price
						this.acreage = this.user_require.acreage
						this.$set(this.totalPrice, 'isMore', true)
						this.$set(this.firstPrice, 'isMore', true)
						this.$set(this.acreage, 'isMore', true)
						if (this.totalPrice.value_max !== '' && this.totalPrice.value_max !== null && this.totalPrice.value_min !== '' && this.totalPrice.value_min !== null && (this.totalPrice.value_max != this.totalPrice.value_min)) {
							// 判断最大值和最小值都有值并且不是null
							this.totalPrice.isMore = true
						} else {
							this.totalPrice.isMore = false
							// 不显示范围，最大值置空
							this.totalPrice.value_max = ''
						}
						// 首付
						if (this.firstPrice.value_max !== '' && this.firstPrice.value_max !== null && this.firstPrice.value_min !== '' && this.firstPrice.value_min !== null && (this.firstPrice.value_max != this.firstPrice.value_min)) {
							// 判断最大值和最小值都有值并且不是null
							this.firstPrice.isMore = true
						} else {
							this.firstPrice.isMore = false
							// 不显示范围，最大值置空
							this.firstPrice.value_max = ''
						}
						// 面积
						if (this.acreage.value_max !== '' && this.acreage.value_max !== null && this.acreage.value_min !== '' && this.acreage.value_min !== null && (this.acreage.value_max != this.acreage.value_min)) {
							// 判断最大值和最小值都有值并且不是null
							this.acreage.isMore = true
						} else {
							this.acreage.isMore = false
							// 不显示范围，最大值置空
							this.acreage.value_max = ''
						}
						// 第四步楼盘参数
						this.houseStatus = resData.project.status
						// 找选中项的前一个，修改伪类的虚线
						let statusIndex = this.statusList.findIndex((v) => {
							return v.value == this.houseStatus
						})
						if (statusIndex > 0) {
							this.statusIndex = statusIndex - 1
						}
						// 标签
						this.customLabel = resData.tags ? resData.tags.customizeTags : []
						this.sysLabel = resData.tags ? resData.tags.systemTags : []
						this.labelList = resData.tags ? resData.tags.selectTags : []
						// 户型
						this.cusHouse = resData.house ? resData.house.customizeApartment : []
						// 设置总价单位为万
						this.cusHouse.map((item) => {
							item.total_price = item.total_price / 10000
						})
						this.sysHouse = resData.house ? resData.house.systemApartment : {}
						for (let key in this.sysHouse) {
							this.sysHouse[key].map((item) => {
								item.total_price = item.total_price / 10000
							})
						}
						this.houseList = resData.house ? resData.house.selectApartment : []
						// 设置总价单位为万
						this.houseList.map((item) => {
							item.total_price = item.total_price / 10000
						})
						// 首付比例有默认值
						if (resData.loan.down_payments != '') {
							this.loanObj.down_payments = resData.loan.down_payments
						}
						if (resData.loan.lending_rate != '') {
							this.loanObj.lending_rate = resData.loan.lending_rate
						}
						if (resData.loan.loan_term != '') {
							this.loanObj.loan_term = resData.loan.loan_term
						}
						// 保存当前利率，在利率输入错误时候进行替换
						// this.saveRate = this.loanObj.lending_rate
						// 交通
						this.tableTrafficData = resData.traffic
						// 给交通添加唯一标识，方便右侧预览
						this.tableTrafficData.map((item) => {
							item.traffic_id_spanTime = moment().format('X') + parseInt(Math.random() * 30)
						})
						// 组装交通右侧预览数据
						this.getPreTraffic()
						// 通勤周边
						this.esfData = resData.price[0] ? resData.price[0] : {}
						if (this.esfData.price_update_datetime) {
							// 确定时间不能为空
							this.esfTime = new Date(this.esfData.price_update_datetime * 1000)
						}
                        // 通勤地址两个
                        this.addressObj = {
                            address: '',
                            lat: '',
                            lng: ''
                        };
                        this.addressObjSen = {
                            address: '',
                            lat: '',
                            lng: ''
                        };
						if (resData.address.length > 0) {
							this.addressObj = resData.address[0]
						}
						if (resData.address.length > 1) {
							this.addressObjSen = resData.address[1]
						}
						this.addressArr = resData.address;
						if (this.addressObj.address !== '') {
							this.setCommuFlag = true;
						} else {
							this.addressTable = [];
							plainObj.drive_time = '';
							plainObj.bus_duration = '';
							plainObj.bus_transit_time = '';
							plainObj.bus_walk_time = '';
							plainObj.start_address = '';
							plainObj.start_lat = '';
							plainObj.start_lng = '';
							this.addressTable.push(plainObj);
						}
						if (this.addressObjSen.address !== '') {
							this.setCommuFlagSecon = true;
						} else {
							this.addressTableSecon = [];
							plainObj.drive_time = '';
							plainObj.bus_duration = '';
							plainObj.bus_transit_time = '';
							plainObj.bus_walk_time = '';
							plainObj.start_address = '';
							plainObj.start_lat = '';
							plainObj.start_lng = '';
							this.addressTableSecon.push(plainObj);
						}
						// 页面渲染完成
						this.$nextTick(() => {
                            // 确保加载完成才实例化地图
                            loadMap.loadMap().then(() => {
                                // 实例化地图
                                this.initMap();
                            });
							let _this = this
							let audioPlayer = document.getElementById('audio')
							// 监听语音
							audioPlayer.addEventListener('playing', () => {
								this.audioStatus = '暂停试听'
								this.isPlaying = true
							})
							audioPlayer.addEventListener('pause', () => {
								this.audioStatus = '点击试听'
								this.isPlaying = false
							})
							// 判断交通完成状态
                            this.checkTrafficOk()
							// 初始化滚动
							this._initScroll()
							// 动态给户型列表宽度赋值
                            this.setWidthHx()
                            if (para) {
                                // 防止户型计算宽度时候还没有渲染完成
                                let timeCount = 0;
                                let timerWidth = setInterval(() => {
                                    // 循环不能超过10次，超过了则不再循环
                                    if (timeCount < 10) {
                                        timeCount++;
                                        let sysBox = document.getElementsByClassName('hx-sys-box');
                                        if (sysBox.length > 0) {
                                            let count = 0;
                                            for (let i = 0; i < sysBox.length; i++) {
                                                if (sysBox[i].style.width) {
                                                    count++;
                                                }
                                            }
                                            setTimeout(() => {
                                                if (count < sysBox.length) {
                                                    this.setWidthHx()
                                                } else {
                                                    clearInterval(timerWidth);
                                                }
                                            })
                                        } else {
                                            clearInterval(timerWidth);
                                        }
                                    } else {
                                        clearInterval(timerWidth);
                                    }
                                }, 1000);
                            }
							// 关闭loading
							this._calculateHeight()
							this.isLoading = false
							// 动态实例化上传图片插件
							if (!para) {
								for (let i = 0; i < this.houseList.length; i++) {
									this.houseList[i].picId = moment().format('X') + parseInt(Math.random() * 10)
									this.houseList[i].isPic = false
									setTimeout(() => {
										this.initPlupload(this.houseList[i].picId, i)
									})
								}
							}
						})
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    this.isLoading = false;
                    // 新增页面遮罩层，阻止用户操作（这个情况一般出现在数据不正常的情况）
                    this.pageDataError = true;
                    this.$message({
                        message: res.data.msg,
                        duration: 3000,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.isLoading = false
                console.log(err)
            })
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
            this.employeeInfo.wx_qrcode = fileList[0].upURL;
        },
        // 动态给户型列表宽度赋值
        setWidthHx () {
            let ulWidth
            if (this.$refs.centerShowBody.clientWidth > 0) {
                ulWidth = (this.$refs.centerShowBody.clientWidth - 120 - 15) / 7
            } else if (this.$refs.centerBody.clientWidth > 0) {
                ulWidth = (this.$refs.centerBody.clientWidth - 120 - 15) / 7
            }
            if ((Array.isArray(this.$refs.hxBoxCus) && this.$refs.hxBoxCus.length > 0) || (!Array.isArray(this.$refs.hxBoxCus) && this.$refs.hxBoxCus)) {
                let cusBox = document.getElementsByClassName('house-list-cus')
                for (let j = 0; j < cusBox.length; j++) {
                    cusBox[j].style.width = ulWidth + 'px'
                }
            }
            if (Array.isArray(this.$refs.hxBox) && this.$refs.hxBox.length > 0) {
                let sysBox = document.getElementsByClassName('hx-sys-box');
                for (let i = 0; i < sysBox.length; i++) {
                    sysBox[i].style.width = ulWidth + 'px'
                }
            }
        },
        // 给地图画线工具切换
        lineTraffic () {
            let carInfo = JSON.stringify(this.carInfo) != '{}' ? this.carInfo.driveRoute : {}
            let busInfo = JSON.stringify(this.busInfo) != '{}' ? this.busInfo.driveRoute : {}
            let carInfoSecon = JSON.stringify(this.carInfoSecon) != '{}' ? this.carInfoSecon.driveRoute : {}
            let busInfoSecon = JSON.stringify(this.busInfoSecon) != '{}' ? this.busInfoSecon.driveRoute : {}
            if (this.currenMap == 'drive') {
                // 驾车画线
                if (this.firAddress) {
                    if (JSON.stringify(carInfo) != '{}' && this.carInfo.driveRoute.length > 0) {
                        let routeData = this.carInfo.driveRoute
                        let start = routeData[0].path.split(';')[0].split(',')
                        let endArr = routeData[routeData.length - 1].path.split(';')
                        let end = endArr[endArr.length - 1].split(',')
                        this.marker.origin.lng = start[0] - 0
                        this.marker.origin.lat = start[1] - 0
                        this.marker.destination.lng = end[0] - 0
                        this.marker.destination.lat = end[1] - 0
                        this.mPath({ startEnd: this.marker, pointsArr: routeData }, 'first', this.map, this.addressObj)
                    } else {
                        this.clearOverLay(this.map)
                    }
                } else {
                    if (JSON.stringify(carInfoSecon) != '{}' && this.carInfoSecon.driveRoute.length > 0) {
                        let routeDataSecon = this.carInfoSecon.driveRoute
                        let start = routeDataSecon[0].path.split(';')[0].split(',')
                        let endArr = routeDataSecon[routeDataSecon.length - 1].path.split(';')
                        let end = endArr[endArr.length - 1].split(',')
                        this.markerSecon.origin.lng = start[0] - 0
                        this.markerSecon.origin.lat = start[1] - 0
                        this.markerSecon.destination.lng = end[0] - 0
                        this.markerSecon.destination.lat = end[1] - 0
                        this.mPath({ startEnd: this.markerSecon, pointsArr: routeDataSecon }, 'second', this.mapSecon, this.addressObjSen)
                    } else {
                        this.clearOverLay(this.mapSecon)
                    }
                }
            } else if (this.currenMap == 'car') {
                if (this.firAddress) {
                    if (JSON.stringify(busInfo) != '{}' && this.busInfo.driveRoute.length > 0) {
                        let routeData = this.busInfo.driveRoute
                        let start = routeData[0].path.split(';')[0].split(',')
                        let endArr = routeData[routeData.length - 1].path.split(';')
                        let end = endArr[endArr.length - 1].split(',')
                        this.marker.origin.lng = start[0] - 0
                        this.marker.origin.lat = start[1] - 0
                        this.marker.destination.lng = end[0] - 0
                        this.marker.destination.lat = end[1] - 0
                        this.mPath({ startEnd: this.marker, pointsArr: routeData }, 'first', this.map, this.addressObj)
                    } else {
                        this.clearOverLay(this.map)
                    }
                } else {
                    if (JSON.stringify(busInfoSecon) != '{}' && this.busInfoSecon.driveRoute.length > 0) {
                        let routeDataSecon = this.busInfoSecon.driveRoute
                        let start = routeDataSecon[0].path.split(';')[0].split(',')
                        let endArr = routeDataSecon[routeDataSecon.length - 1].path.split(';')
                        let end = endArr[endArr.length - 1].split(',')
                        this.markerSecon.origin.lng = start[0] - 0
                        this.markerSecon.origin.lat = start[1] - 0
                        this.markerSecon.destination.lng = end[0] - 0
                        this.markerSecon.destination.lat = end[1] - 0
                        this.mPath({ startEnd: this.markerSecon, pointsArr: routeDataSecon }, 'second', this.mapSecon, this.addressObjSen)
                    } else {
                        this.clearOverLay(this.mapSecon)
                    }
                }
            }
        },
        // 初始化地图
        initMap () {
            // 根据城市名字获取中心点
            this.map = new BMap.Map('map-single-share');
            this.map.centerAndZoom(this.cityName, 11);
            if (!this.addressObj.address == '') {
                this.getCommuInfo(this.addressObj, 'first');
            }
            // 默认请求通勤
            this.initInput();
            // 初始化第二个地图
            this.mapSecon = new BMap.Map('map-single-share-second');
            this.mapSecon.centerAndZoom(this.cityName, 11);
            if (!this.addressObjSen.address == '') {
                this.getCommuInfo(this.addressObjSen, 'second');
            }
            if (this.addressArr.length > 1) {
                // 默认请求通勤
                this.initInputSen();
            }
        },
        // 通勤输入框失去焦点
        commuBlur () {
            if (!this.setCommuFlag) {
                // this.addressObj.address = ''
                this.addressObj.lng = '';
                this.addressObj.lat = '';
                this.addressTable = [];
                this.addressTable.push(JSON.parse(JSON.stringify(plainObj)));
                // 清除地图覆盖物
                this.carInfo.driveRoute = [];
                this.busInfo.driveRoute = [];
                this.lineTraffic();
            } else {
                this.setCommuFlag = false;
            }
        },
        commuBlurSecon () {
            if (!this.setCommuFlagSecon) {
                // this.addressObjSen.address = ''
                this.addressObjSen.lng = '';
                this.addressObjSen.lat = '';
                this.addressTableSecon = [];
                this.addressTableSecon.push(JSON.parse(JSON.stringify(plainObj)));
                // 清除地图覆盖物
                this.carInfoSecon.driveRoute = [];
                this.busInfoSecon.driveRoute = [];
                this.lineTraffic();
            } else {
                this.setCommuFlagSecon = false;
            }
        },
        // 初始化联想下拉框
        initInput () {
            const _this = this
            if (JSON.stringify(this.ac) != '{}') {
                this.ac.dispose();
            }
            // 建立一个自动完成的对象
            this.ac = new BMap.Autocomplete({ 'input': 'single-share-input', 'location': _this.cityName });
            if (this.addressObj.address && this.addressObj.address !== 0) {
                this.ac.setInputValue(this.addressObj.address);
            }
            let myValue;
            // 鼠标点击下拉列表后的事件
            this.ac.addEventListener('onconfirm', (e) => {
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    let _value = e.item.value;
                    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    _this.$refs.commuInput.blur();
                    // 点击了通勤下拉
                    _this.setCommuFlag = true;
                    _this.setPlace(myValue, _this.map, _this.addressObj, 'first');
                }
            })
        },
        // 初始化联想第二个下拉框
        initInputSen () {
            const _this = this
            if (JSON.stringify(this.acSecon) != '{}') {
                this.acSecon.dispose();
            }
            // 建立一个自动完成的对象
            this.acSecon = new BMap.Autocomplete({ 'input': 'single-share-input-secon', 'location': _this.cityName });
            if (this.addressObjSen.address && this.addressObjSen.address !== 0) {
                this.acSecon.setInputValue(this.addressObjSen.address);
            }
            let myValue;
            // 鼠标点击下拉列表后的事件
            this.acSecon.addEventListener('onconfirm', (e) => {
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    let _value = e.item.value;
                    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    _this.$refs.commuInputSecon.blur();
                    _this.setCommuFlagSecon = true;
                    _this.setPlace(myValue, _this.mapSecon, _this.addressObjSen, 'second');
                }
            })
        },
        // 匹配经纬度
        setPlace (para, mapPara, addressPara, paraType) {
            let _this = this
            function myFun () {
                if (!local.getResults().getPoi(0)) {
                    _this.$message({
                        message: '请输入其他地址',
                        duration: 5000,
                        type: 'warning'
                    });
                }
                let pp = local.getResults().getPoi(0) ? local.getResults().getPoi(0).point : {}
                addressPara.address = para
                addressPara.lat = pp.lat
                addressPara.lng = pp.lng
                // 计算通勤地址
                _this.getCommuInfo(addressPara, paraType)
            }
            let local = new BMap.LocalSearch(mapPara, {
                onSearchComplete: myFun
            })
            local.search(para)
        },
        /**
         * 通勤搜索
         * @param {Object} addressPara 地址对象
         * @param {String} paraType 目的地类型（first为第一个目的地，second为第二个目的地
         * @return {undefined} 无返回值
         */
        getCommuInfo (addressPara, paraType) {
            // 根据类型设置loading
            if (paraType === 'first') {
                this.tbLoading = true;
            } else if (paraType === 'second') {
                this.tbSenLoading = true;
            }
            if (addressPara.lng && addressPara.lat && this.houseInfo.lng && this.houseInfo.lat) {
                // 需要终点经纬度
                let params = {
                    project_id: this.project_id,
                    commute_lng: addressPara.lng,
                    commute_lat: addressPara.lat,
                    share_id: this.share_id
                }
                api.getCommuApi(params).then((res) => {
                    let resData = res.data.data;
                    if (res.data.code === 0) {
                        // 给通勤表格赋值
                        let obj = {
							project_name: this.houseInfo.name,
                            drive_time: resData.drive_time,
                            bus_duration: resData.bus_duration,
                            bus_transit_time: resData.bus_transit_time,
                            bus_walk_time: resData.bus_walk_time,
                            start_address: resData.start_address,
                            start_lat: resData.start_lat,
                            start_lng: resData.start_lng
                        };
                        if (paraType === 'first') {
                            this.carInfo = resData.car;
                            this.busInfo = resData.bus;
                            this.addressTable = [];
                            this.addressTable.push(obj);
                            // 赋值是否步行标识，字符串，1代表不勾选，0代表勾选
                            this.isWalkCheck = resData.is_walk_show;
                            // 去掉loading
                            this.tbLoading = false;
                            // 开始画线
                            if (this.firAddress) {
                                this.lineTraffic();
                            }
                        } else if (paraType === 'second') {
                            this.carInfoSecon = resData.car;
                            this.busInfoSecon = resData.bus;
                            this.addressTableSecon = [];
                            this.addressTableSecon.push(obj);
                            // 赋值是否步行标识，字符串，1代表不勾选，0代表勾选
                            this.isWalkCheckSen = resData.is_walk_show;
                            this.tbSenLoading = false;
                            // 开始画线
                            if (!this.firAddress) {
                                this.lineTraffic();
                            }
						}
						this.$nextTick(() => {
							// 判断地址价格步骤完成状态
							this.checkAddressAndPrice();
						})
                    } else {
                        this.tbLoading = false;
						this.tbSenLoading = false;
						this.$nextTick(() => {
							// 判断地址价格步骤完成状态
							this.checkAddressAndPrice();
						})
                    }
                }).catch((err) => {
                    this.tbLoading = false;
					this.tbSenLoading = false;
					// 判断地址价格步骤完成状态
					this.checkAddressAndPrice();
                    console.log(err);
                })
            } else {
                if (paraType === 'first') {
                    this.tbLoading = false;
                    this.addressTable = [];
                    this.addressTable.push(JSON.parse(JSON.stringify(plainObj)));
                } else if (paraType === 'second') {
                    this.tbSenLoading = false;
                    this.addressTableSecon = [];
                    this.addressTableSecon.push(JSON.parse(JSON.stringify(plainObj)));
                }
            }
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 公交/地铁回显 开始
        // test 北京市天安门 经度：lng:116.38, 纬度：lat:39.9   北京市东城区 lng: 116.42, lat:39.93
        mPath (para, paraType, paraMap, paraAddress) {
            // 清除覆盖物
            this.clearOverLay(paraMap)
            let point = {
                start: new BMap.Point(
                    para.startEnd.origin.lng,
                    para.startEnd.origin.lat
                ),
                end: new BMap.Point(
                    para.startEnd.destination.lng,
                    para.startEnd.destination.lat
                )
            }
            let icon = {
                start: new BMap.Icon(startIcon, new BMap.Size(48, 48), {
                    imageOffset: new BMap.Size(10, 0),
                    imageSize: new BMap.Size(24, 24)
                }),
                end: new BMap.Icon(endIcon, new BMap.Size(40, 40), {
                    imageOffset: new BMap.Size(10, 0), // 图片偏移。
                    imageSize: new BMap.Size(22, 34)
                })
            }
            let points = para.pointsArr
            let allPathArr = []
            let allPath = ''
            for (let i = 0; i < points.length; i++) {
                allPathArr.push(points[i].path)
            }
            allPath = allPathArr.join(';')
            let viewPortArr = allPath.split(';')
            let finalArr = []
            for (let k = 0; k < viewPortArr.length; k++) {
                let small = viewPortArr[k].split(',')
                let smallLng = small[0] - 0
                let smallLat = small[1] - 0
                let pointL = new BMap.Point(smallLng, smallLat)
                finalArr.push(pointL)
            }
            this.markStart = new BMap.Marker(point.start, {
                enableMassClear: false,
                icon: icon.start
            })
            let content = `
        <div class="bmap-label-dot">${this.houseInfo.name}</div>
        `
            this.label = new BMap.Label(content, {
                position: point.start,
                offset: new BMap.Size(0, -35),
                enableMassClear: false
            })
            this.label.setStyle({
                border: 'none',
                transform: 'translate(-50%, -50%)',
                padding: '4px 5px',
                color: '#fff',
                borderRadius: '2px',
                backgroundColor: '#47b3e3'
            })
            this.markEnd = new BMap.Marker(point.end, {
                enableMassClear: false,
                icon: icon.end
            })
            let contents = `
        <div class="bmap-label-dot">${paraAddress.address ? paraAddress.address : '?'}</div>
        `
            this.labelEnd = new BMap.Label(contents, {
                position: point.end,
                offset: new BMap.Size(0, -40),
                enableMassClear: false
            })
            this.labelEnd.setStyle({
                border: 'none',
                backgroundColor: '#fa5f35',
                padding: '4px 5px',
                color: '#fff',
                borderRadius: '2px',
                transform: 'translate(-50%, -50%)'
            })
            this.overLayId = new BMap.Polyline(finalArr, {
                strokeColor: '#47b3e3',
                strokeWeight: 4,
                strokeOpacity: 1,
                strokeStyle: 'solid',
                enableMassClear: false
            })
            paraMap.centerAndZoom(point.start, 10)
            paraMap.setViewport(finalArr)
            paraMap.addOverlay(this.overLayId)
            paraMap.addOverlay(this.markStart)
            paraMap.addOverlay(this.markEnd)
            paraMap.addOverlay(this.label)
            paraMap.addOverlay(this.labelEnd)
        },
        clearOverLay (paraMap) {
            // 清空画的上个路线
            paraMap.removeOverlay(this.overLayId)
            paraMap.removeOverlay(this.markStart)
            paraMap.removeOverlay(this.markEnd)
            paraMap.removeOverlay(this.label)
            paraMap.removeOverlay(this.labelEnd)
        },
        // 判断是否展示满意度
        checkRate (para) {
            if (para) {
                let rate = para.split('%')[0];
                return parseFloat(rate) >= 95;
            } else {
                return false
            }
        },
        // 检查哪些模块没有填写完成
        inspectModule() {
            // 提示模块
            let txt = '';
            let index = -1;
            this.swiperArr.forEach((item, i) => {
                if (!item.isOk) {
                    // 如果等于-1，说明是第一次找到未完成步骤，下一次再找到就不用赋值了
                    if (index === -1) {
                        index = i;
                    }
                    txt = `${txt}${txt === '' ? '' : '、'}${item.name}`;
                }
            });
            // 定位到第一个未成功的步骤
            if (index !== -1) {
                this.selectContent(index);
            }
            this.$message({
                message: `请完成 ${txt} 模块的填写`,
                duration: 3000,
                type: 'error'
            });
        },
        // 进行分享
        singleShare () {
            // 修改为不可点击模式下，进行未完成模块提示
            if (!this.shareBtn) {
                this.inspectModule();
                this.verifyModule = true;
                return
            }
            // 按钮是否可以点击
            if (this.shareBtn) {
                if (!this.isReq) {
                    return;
                }
                if (this.isReq) {
                    this.isReq = false;
                }
                // 增加loading
                this.isLoading = true;
                let seleTags = [];
                let seleHouse = [];
                let sortTags = [];
                let cusHxList = [];
                // 判断通勤地点
                let addressList = [];
                if (this.addressObj.address && this.addressTable[0]) {
                    this.addressTable[0].address = this.addressObj.address;
                    this.addressTable[0].lat = this.addressObj.lat;
                    this.addressTable[0].lng = this.addressObj.lng;
                    this.addressTable[0].is_walk_show = this.isWalkCheck;
                    addressList.push(this.addressTable[0]);
                }
                if (this.addressObjSen.address && this.addressTableSecon[0]) {
                    this.addressTableSecon[0].address = this.addressObjSen.address;
                    this.addressTableSecon[0].lat = this.addressObjSen.lat;
                    this.addressTableSecon[0].lng = this.addressObjSen.lng;
                    this.addressTableSecon[0].is_walk_show = this.isWalkCheckSen;
                    addressList.push(this.addressTableSecon[0]);
                }
                // 组装选中的系统标签
                this.sysLabel.map((item) => {
                    if (item.is_select.toString() === '0') {
                        seleTags.push(item);
                    }
                })
                // 组装有顺序的数组
                this.labelList.map((item, index) => {
                    item.index = index;
                    sortTags.push(item);
                })
                // 组装选中户型
                this.houseList.map((item, index) => {
                    if (item.is_select + '' === '0') {
                        // 防止改变item本身
                        let obj = { ...item };
                        obj.total_price = item.total_price * 10000;
                        obj.index = index;
                        seleHouse.push(obj);
                    }
                })
                cusHxList = this.cusHouse.map((item) => {
                    // 防止改变item本身
                    if (item.is_select.toString() == 1) {
                        let objs = { ...item }
                        objs.total_price = item.total_price * 10000;
                        return objs;
                    }
                })
                // 转换为时间戳
                let estTime = Date.parse(this.esfTime);
                // 添加时间周边详情模块的编辑时间
                this.esfData.price_update_datetime = estTime / 1000;
                // 组装咨询师信息
                let employee = {}
                let answerList = []
                employee.tags = this.employeeInfo.tag
                employee.wx_qrcode = this.employeeInfo.wx_qrcode
                for (let i = 0; i < this.qaSelectedList.length; i++) {
                    answerList.push(this.qaSelectedList[i].answer_id)
                }
                this.houseInfo.summary = this.houseMessage
                this.houseInfo.status = this.houseStatus
                employee.answer_id = answerList
                let params = {
                    project_id: this.project_id,
                    employee_id: this.employeeInfo.id,
                    order_id: this.$route.query.order_id,
                    share_id: this.share_id,
                    project: this.houseInfo,
                    tags: sortTags,
                    house: {
                        customizeApartment: cusHxList,
                        selectApartment: seleHouse
                    },
                    loan: this.loanObj,
                    traffic: this.tableTrafficData,
                    address: addressList,
                    price: [this.esfData],
                    employee: employee,
                    user_require: this.user_require
                }
                this.axios.post('/backend-api/bk-map/share-project-save', params).then((res) => {
                    if (res.data.code === 0) {
                        this.codeUrl = res.data.data.url;
                        // 分享结果
                        this.shareFlag = true;
                        this.share_id = res.data.data.share_id;
                        this.user_mobile = res.data.data.user_mobile;
                        this.user_wechat = res.data.data.user_wechat;
                        // 埋点
                        commonFun.setTrack('4163', this.trackMessages, {}, this.backendApi)
                    }
                    // 关闭loading
                    this.isLoading = false;
                }).catch((err) => {
                    // 关闭loading
                    this.isLoading = false;
                    console.log(err)
                })
            }
        },
        // 重新编辑
        updateShare () {
            // 恢复提交标识
            this.isReq = true
            // 去掉分享结果
            this.shareFlag = false
            // 再次请求
            this.getData(1)
            // 回到第一步
            this.selectContent(0)
            // 埋点
            commonFun.setTrack('4168', this.trackMessages, {}, this.backendApi)
        },
        // 点击上一步下一步
        stepToStep (para) {
            if (para === 0 && this.swiperIndex > 0) {
                // 点击上一步
                this.selectContent(parseInt(this.swiperIndex) - 1)
                // 进行埋点
                commonFun.setTrack('4158', this.trackMessages, {}, this.backendApi)
            } else if (para === 1) {
                if (this.swiperIndex === (this.swiperArr.length - 1)) {
                    // 开始分享
                    this.singleShare()
                } else if (this.swiperIndex < (this.swiperArr.length - 1)) {
                    this.selectContent(parseInt(this.swiperIndex) + 1)
                }
                // 进行埋点
                commonFun.setTrack('4159', this.trackMessages, {}, this.backendApi)
            }
        },
        // 实时判断交通是否符合完成状态
        checkTrafficOk () {
            let okFlag = true
            for (let i = 0; i < this.tableTrafficData.length; i++) {
                // 设置为展示
                if (this.tableTrafficData[i].is_show + '' === '0' && !(this.tableTrafficData[i].distance + '') && this.tableTrafficData[i].traffic_type + '' === '1') {
                    // 如果为系统，没有地铁线
                    okFlag = false
                    break
                } else if (this.tableTrafficData[i].is_show + '' === '0' && this.tableTrafficData[i].traffic_type + '' === '2') {
                    // 如果为自定义，并且为公交，则少判断一个input框
                    if (this.tableTrafficData[i].traffic_category + '' === '1' && (!(this.tableTrafficData[i].station_name + '') || !(this.tableTrafficData[i].distance + '') || !(this.tableTrafficData[i].traffic_category))) {
                        okFlag = false
                        break
                    } else if (this.tableTrafficData[i].traffic_category + '' === '2' && (!(this.tableTrafficData[i].station_name + '') || !(this.tableTrafficData[i].traffic_name + '') || !(this.tableTrafficData[i].distance + '') || !(this.tableTrafficData[i].traffic_category))) {
                        okFlag = false
                        break
                    } else if (this.tableTrafficData[i].traffic_category + '' === '') {
                        okFlag = false
                        break
                    }
                }
            }
            setTimeout(() => {
                if (okFlag === true) {
                    this.swiperArr[5].isOk = true
                } else {
                    this.swiperArr[5].isOk = false
                }
            })
        },
        // 切换交通类型
        trafficTypeChange (para) {
            if (para.traffic_category + '' === '1') {
                // 如果是公交，删除公交，并且添加到地铁
                let carIndex = this.delPreTraffic(para, this.preTraffic.line)
                if (carIndex !== null) {
                    this.preTraffic.line.splice(carIndex, 1)
                    this.preTraffic.car.push(para)
                }
            } else if (para.traffic_category + '' === '2') {
                let lineIndex = this.delPreTraffic(para, this.preTraffic.car)
                if (lineIndex !== null) {
                    this.preTraffic.car.splice(lineIndex, 1)
                    this.preTraffic.line.push(para)
                }
            }
        },
        // 组装交通右侧预览数据
        getPreTraffic () {
            // 先清空
            this.preTraffic.car = []
            this.preTraffic.line = []
            this.tableTrafficData.map((item) => {
                if (item.traffic_category + '' === '1' && item.is_show + '' === '0') {
                    // 1为公交，2为地铁，且是开关打开的交通
                    this.preTraffic.car.push(item)
                } else if (item.traffic_category + '' === '2' && item.is_show + '' === '0') {
                    this.preTraffic.line.push(item)
                }
            })
        },
        // 改变交通站点展示
        swichChange (para) {
            if (para) {
                // 有值代表是交通，为空则表示是二手房周边的开关
                if (para.is_show + '' === '0') {
                    if (this.preTraffic.car.length + this.preTraffic.line.length < 5) {
                        // 打开开关，并且右侧预览展示的交通条数小于5条
                        if (para.traffic_category + '' === '1') {
                            this.preTraffic.car.push(para)
                        } else if (para.traffic_category + '' === '2') {
                            this.preTraffic.line.push(para)
                        }
                    } else {
                        para.is_show = 1
                        this.$message({
                            message: '小程序中每个楼盘最多只能展示 5 条交通站点',
                            duration: 1000,
                            type: 'warning'
                        })
                    }
                } else if (para.is_show + '' === '1') {
                    // 关闭开关
                    if (para.traffic_category + '' === '1') {
                        let index = this.delPreTraffic(para, this.preTraffic.car)
                        if (index !== null) {
                            this.preTraffic.car.splice(index, 1)
                        }
                    } else if (para.traffic_category + '' === '2') {
                        let lineIndex = this.delPreTraffic(para, this.preTraffic.line)
                        if (lineIndex !== null) {
                            this.preTraffic.line.splice(lineIndex, 1)
                        }
                    }
                }
            }
            // 重新计算高度
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 交通关闭时候删除右侧预览
        delPreTraffic (para, paraArr) {
            let delNum = null
            for (let i = 0; i < paraArr.length; i++) {
                if (para.traffic_id_spanTime === paraArr[i].traffic_id_spanTime) {
                    // 有id，说明不是当前新增的自定义标签
                    // 系统标签或者已经保存过的自定义标签
                    delNum = i
                    break
                }
            }
            return delNum
        },
        // 删除公交站点
        delTraffic (para) {
            // 已经保存到数据库的，实时请求接口进行删除
            if (para.traffic_id) {
                let params = {
                    type: 11,
                    traffic_id: para.traffic_id,
                    project_id: this.project_id,
                    order_id: this.$route.query.order_id,
                    share_id: this.share_id
                }
                api.multiApi(params).then((res) => {
                    if (res.data.code === 0) {
                        // 判断是交通还是公交，单独删除右侧
                        if (para.traffic_category + '' === '1') {
                            this.preTraffic.car.map((v, index) => {
                                if (para.traffic_id_spanTime === v.traffic_id_spanTime) {
                                    this.preTraffic.car.splice(index, 1)
                                }
                            })
                        } else if (para.traffic_category + '' === '2') {
                            this.preTraffic.line.map((v, index) => {
                                if (para.traffic_id_spanTime === v.traffic_id_spanTime) {
                                    this.preTraffic.line.splice(index, 1)
                                }
                            })
                        }
                        let delIndex = 0
                        for (let i = 0; i < this.tableTrafficData.length; i++) {
                            if (para.traffic_id && para.traffic_id === this.tableTrafficData[i].traffic_id) {
                                // 有id，说明不是当前新增的自定义标签
                                // 系统标签或者已经保存过的自定义标签
                                delIndex = i
                                break
                            } else if (!para.traffic_id && para.timespan === this.tableTrafficData[i].timespan) {
                                // 新增的自定义标签
                                delIndex = i
                                break
                            }
                        }
                        this.tableTrafficData.splice(delIndex, 1)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                // 判断是交通还是公交，单独删除右侧
                if (para.traffic_category + '' === '1') {
                    this.preTraffic.car.map((v, index) => {
                        if (para.traffic_id_spanTime === v.traffic_id_spanTime) {
                            this.preTraffic.car.splice(index, 1)
                        }
                    })
                } else if (para.traffic_category + '' === '2') {
                    this.preTraffic.line.map((v, index) => {
                        if (para.traffic_id_spanTime === v.traffic_id_spanTime) {
                            this.preTraffic.line.splice(index, 1)
                        }
                    })
                }
                let delNum = 0
                for (let i = 0; i < this.tableTrafficData.length; i++) {
                    if (para.traffic_id && para.traffic_id === this.tableTrafficData[i].traffic_id) {
                        // 有id，说明不是当前新增的自定义标签
                        // 系统标签或者已经保存过的自定义标签
                        delNum = i
                        break
                    } else if (!para.traffic_id && para.timespan === this.tableTrafficData[i].timespan) {
                        // 新增的自定义标签
                        delNum = i
                        break
                    }
                }
                this.tableTrafficData.splice(delNum, 1)
            }
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 手动新增站点
        addTraffic () {
            if (this.preTrafficList.length < 5) {
                let timeStamp = moment().format('X') + parseInt(Math.random() * 100)
                let obj = {
                    distance: '0',
                    is_show: 0,
                    station_name: '',
                    traffic_category: '2',
                    traffic_name: '',
                    traffic_type: 2,
                    project_id: this.project_id,
                    traffic_id_spanTime: timeStamp,
                    traffic_id: 0,
                    timespan: timeStamp
                }
                // 给右侧预览增加交通
                this.preTraffic.line.push(obj)
                this.tableTrafficData.push(obj)
                setTimeout(() => {
                    this._calculateHeight()
                })
                // 埋点
                commonFun.setTrack('4167', this.trackMessages, {}, this.backendApi)
            } else {
                this.$message({
                    message: '小程序中每个楼盘最多只能展示 5 条交通站点',
                    duration: 1000,
                    type: 'warning'
                })
            }
        },
        // 请求oss上传设置参数
        getSign () {
            let params = {
                cate: 'sop_web'
            }
            this.axios.post('/backend-api/bk-api-upload/get-upload-sign', params).then((res) => {
                if (res.data.code === 0) {
                    this.signs = res.data.data
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        // 初始化上传插件
        initPlupload (id, picIndex) {
            // http://comjia-1.oss-cn-beijing.aliyuncs.com/sop_web/icon-@2x.png
            let that = this
            var maxSize = '10mb'
            // 定义 plupload 对象
            function setUploadParam (up, filename, ret) {
                let fileName = ''
                if (filename && typeof filename == 'string') {
                    fileName = commonFun.trimAll(filename)
                }
                let keyName = that.signs.dir + moment().format('X') + commonFun.random_string(6) + fileName
                let newMultipartParams = {
                    key: keyName,
                    policy: that.signs.policy,
                    OSSAccessKeyId: that.signs.accessid,
                    success_action_status: 200, // 默认是 204
                    signature: that.signs.signature
                }
                up.setOption({
                    'url': that.signs.host,
                    'multipart_params': newMultipartParams
                })
                up.start()
                return keyName
            }
            that.uploader[picIndex] = new plupload.Uploader({
                multi_selection: false, // 禁止多文件上传
                browse_button: id, // 触发文件上传的按钮 id（传入的参数）
                url: that.signs.host, // 服务器的地址，与提供的阿里云的地址一致
                flash_swf_url: '../../../../static/lib/uploads/moxie.swf',
                filters: {
                    mime_types: [
                        {
                            title: 'Image files',
                            extensions: 'jpg,png,jpeg,gif' // 允许上传的文件类型
                        }
                    ],
                    max_file_size: maxSize, // 允许上传的最大尺寸
                    prevent_duplicates: true // 不允许上传重复文件
                },
                init: {
                    // 文件添加到上传队列后
                    FilesAdded: function (up, files) {
                        for (let i = 0; i < that.uploader.length; i++) {
                            if (up.id === that.uploader[i].id) {
                                that.currenUpId = i
                                break
                            }
                        }
                        setUploadParam(up, files[0].name, false)
                    },
                    FileUploaded: function (up, file, info) {
                        // file 里可以得到压缩率
                        if (info.status === 200) {
                        } else if (info.status === 203) {
                            alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response)
                        } else {
                            alert(info.respose)
                        }
                    },
                    BeforeUpload: function (up, file) {
                        that.upFile = setUploadParam(up, file.name, true)
                    },
                    UploadComplete: function (up, file) {
                        // 上传成功后，匹配户型，赋值图片路径
                        that.houseList[that.currenUpId].apartment_pic = '/' + that.upFile
                        that.houseList[that.currenUpId].isPic = true
                        // 埋点
                        commonFun.setTrack('4165', that.trackMessages, {}, that.backendApi)
                    },
                    // 错误信息
                    Error: function (up, err) {
                        if (err.code === -600) {
                            alert('图片大小不能超过' + maxSize)
                        } else if (err.code === -601) {
                            alert('文件类型不正确')
                        } else if (err.code === -602) {
                            alert('已上传过')
                        } else {
                            alert(err)
                        }
                    }
                }
            })
            that.uploader[picIndex].init()
        },
        // 图片加载失败
        error (el) {
            el.target.src = defultImg
            el.target.error = null
        },
        // 计算月供
        getMonthPay (allPrice, fir, yearNum, tax) {
            // （总价-首付）*A*((1+A)^n/((1+A)^n-1))
            let sum
            if (tax && parseFloat(tax) > 0 && allPrice) {
                let firPay = parseFloat(allPrice) * 10000 * (parseInt(fir) / 100)
                let a = parseFloat(tax) / 12 / 100
                let n = parseInt(yearNum) * 12
                sum = (allPrice * 10000 - firPay) * a * (Math.pow((1 + a), n) / (Math.pow((1 + a), n) - 1))
                if (parseInt(sum, 10) !== sum) {
                    // 不是整数，取两位小数
                    sum = sum.toFixed(2)
                }
            } else {
                sum = '?'
            }
            return sum
        },
        // 手动添加户型
        addCusHouse () {
            let timeStamp = moment().format('X') + parseInt(Math.random() * 100)
            let obj = {
                name: '',
                is_select: '0',
                timespan: timeStamp,
                apartment_type: 2,
                apartment_pic: '',
                isPic: false,
                square_metre: '',
                total_price: '',
                room_type: '',
                house_status: '',
                picId: timeStamp
            }
            // 添加预览
            this.houseList.push(obj)
            // 添加自定义户型
            this.cusHouse.push(obj)
            // 重新计算右侧各个模块高度，有图片需要延迟一会儿
            setTimeout(() => {
                this.setWidthHx()
                this._calculateHeight()
                this.initPlupload(obj.picId, (this.houseList.length - 1))
            })
            // 埋点
            commonFun.setTrack('4164', this.trackMessages, {}, this.backendApi)
        },
        // 户型图展示
        showImg (para) {
            let imgUrl
            if (para) {
                imgUrl = this.signs.host + para
            } else {
                imgUrl = defultImg
            }

            return imgUrl
        },
        onError: function (e) {
            console.log(e)
        },
        // 复制
        onCopy: function (e) {
            this.$message({
                showClose: true,
                message: '已复制到剪切板',
                type: 'success'
            })
        },
        // 删除自定义户型
        delHxItem (para, paraIndex) {
            // 已经保存到数据库的，实时请求接口进行删除
            if (para.id) {
                let params = {
                    type: 10,
                    house_id: para.id,
                    project_id: this.project_id,
                    order_id: this.$route.query.order_id,
                    share_id: this.share_id
                }
                api.multiApi(params).then((res) => {
                    if (res.data.code === 0) {
                        this.cusHouse.splice(paraIndex, 1)
                        this.houseList.splice(this.delLabel(para, this.houseList), 1)
                        // 重新计算右侧各个模块高度，有图片需要延迟一会儿
                        setTimeout(() => {
                            this._calculateHeight()
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                this.houseList.splice(this.delLabel(para, this.houseList), 1)
                this.cusHouse.splice(paraIndex, 1)
                setTimeout(() => {
                    this._calculateHeight()
                })
            }
        },
        // 对应户型key值
        matchHx (para) {
            let str
            switch (para + '') {
                case '7': str = '开间/不限'
                    break
                case '1': str = '一居'
                    break
                case '2': str = '二居'
                    break
                case '3': str = '三居'
                    break
                case '4': str = '四居'
                    break
                case '5': str = '五居及以上'
                    break
            }
            return str
        },
        // 选中与不选中户型
        chooseHx (para) {
            if (para.is_select + '' === '0') {
                para.is_select = '1'
                // 删除右侧预览
                this.houseList.splice(this.delLabel(para, this.houseList), 1)
            } else {
                para.is_select = '0'
                // 加入户型列表之前先加上传户型图的属性
                para.isPic = false
                // 生成图片上传绑定容器的id
                para.picId = moment().format('X') + parseInt(Math.random() * 100)
                // 增加右侧预览以及中间下面模块
                this.houseList.push(para)
                setTimeout(() => {
                    this.initPlupload(para.picId, (this.houseList.length - 1))
                })
                // 埋点
                commonFun.setTrack('4166', this.trackMessages, {}, this.backendApi)
            }
            // 重新计算右侧各个模块高度，有图片需要延迟一会儿
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 删除咨询师标签
        deleteEmployeeLabel (paraIndex, para) {
            para.splice(paraIndex, 1)
            // 重新计算右侧各个模块高度
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 删除自定义标签
        deleteCusLabel (paraIndex, para) {
            // 已经保存到数据库的，实时请求接口进行删除
            if (para.id) {
                let params = {
                    type: 9,
                    tag_id: para.id,
                    project_id: this.project_id,
                    order_id: this.$route.query.order_id,
                    share_id: this.share_id
                }
                api.multiApi(params).then((res) => {
                    if (res.data.code === 0) {
                        this.customLabel.splice(paraIndex, 1)
                        // 删除自定义标签的同时删除右侧
                        this.labelList.splice(this.delLabel(para, this.labelList), 1)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                this.customLabel.splice(paraIndex, 1)
                this.labelList.splice(this.delLabel(para, this.labelList), 1)
            }
            // 重新计算右侧各个模块高度
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 添加自定义咨询师标签
        addEmTag () {
            let cusStr = this.cusTagInput + ''
            if (cusStr.trim()) {
                this.employeeInfo.tag.push(cusStr)
                this.cusTagInput = ''
            }
            // 重新计算右侧各个模块高度
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 添加自定义标签方法
        addLabel () {
            let cusStr = this.customInput + ''
            if (cusStr.trim()) {
                // 添加的自定义标签需要给一个唯一标识，方便删除，只有当前新增的自定义标签才会没有id
                let obj = {
                    name: this.customInput,
                    is_select: '0',
                    type: '2',
                    timespan: moment().format('X') + parseInt(Math.random() * 100)
                }
                // 添加到自定义标签数组
                this.customLabel.push(obj)
                // 清空input框
                this.customInput = ''
                // 添加到右侧预览数组
                this.labelList.push(obj)
                // 重新计算右侧各个模块高度
                setTimeout(() => {
                    this._calculateHeight()
                })
                // 埋点
                commonFun.setTrack('4162', this.trackMessages, {}, this.backendApi)
            }
        },
        // 选中系统标签切换
        changeChosen (para) {
            if (para.is_select.toString() === '0') {
                para.is_select = '1'
                // 删除右侧预览
                this.labelList.splice(this.delLabel(para, this.labelList), 1)
                // 埋点
                let trackObj = {
                    click_type: '1'
                }
                commonFun.setTrack('4161', this.trackMessages, trackObj, this.backendApi)
            } else {
                para.is_select = '0'
                // 增加右侧预览
                this.labelList.push(para)
                // 埋点
                let trackObj = {
                    click_type: '0'
                }
                commonFun.setTrack('4161', this.trackMessages, trackObj, this.backendApi)
            }
            // 重新计算右侧各个模块高度
            setTimeout(() => {
                this._calculateHeight()
            })
        },
        // 删除右侧预览标签
        delLabel (para, paraArr) {
            let delIndex = null
            for (let i = 0; i < paraArr.length; i++) {
                if (para.id && para.id === paraArr[i].id) {
                    // 有id，说明不是当前新增的自定义标签
                    // 系统标签或者已经保存过的自定义标签
                    delIndex = i
                    break
                } else if (!para.id && para.timespan === paraArr[i].timespan) {
                    // 新增的自定义标签
                    delIndex = i
                    break
                }
            }
            if (delIndex !== null) {
                return delIndex
            } else {
                return paraArr.length
            }
        },
        // 滚动初始化
        _initScroll () {
            if (!this.shopBoxScroll) {
                this.shopBoxScroll = new BScroll(this.$refs.shopBox, {
                    // better-scroll 会将点击事件去掉，要在这里开启，同时点击在PC 会被执行两次，要在这里控制
                    click: true,
                    scrollX: true,
                    eventPassthrough: 'vertical',
                    probeType: 3
                })
            } else {
                this.shopBoxScroll.refresh()
            }
        },
        // 判断图片是否加载成功
        imgloads (imgs, callback, sizes) { // 判断图片是否已加载完毕
            let isover = false // true加载完毕，false还有未加载的
            let add = 0 // 循环当前次数
            let size = sizes
            let jdtime = setInterval(function () {
                isover = true
                add++
                for (let i = 0; i < imgs.length; i++) {
                    if (!imgs[i].complete) { // 还有没加载的图片
                        isover = false
                    }
                }
                if (isover || add >= size) { // 加载完成，or超时
                    clearInterval(jdtime)
                    callback()
                }
            }, 50)
        },
        // 动态获取高度
        _calculateHeight () {
            // 清空高度数组
            this.listHeight = []
            let height = 0
            this.listHeight.push(height)
            let divObjs = document.getElementsByClassName('content-box')
            for (let i = 0; i < divObjs.length; i++) {
                let item = divObjs[i]
                if (i == 0 || i == 1 || i == 2 || i == 3) {
                    height += item.clientHeight
                } else {
                    height += parseInt(item.clientHeight + 10)
                }
                this.listHeight.push(height)
            }
        },
        // 滚动事件
        menus () {
            // 获取div 距离顶部高度
            // 获取页面滚动高度
            let scrollBox = document.getElementsByClassName('right-body')[0]
            // 减去上面介绍高度
            let scrollTops = scrollBox.scrollTop || document.body.scrollTop;
            let scrollTop = !isNaN(scrollTops) ? Math.ceil(scrollTops) : scrollTops;
            this.nowScrollHe = scrollTop
        },
        // 函数节流
        highThottle (fn, content, musttimes, time) {
            var start = new Date()
            var musttime = musttimes || 5000
            return function () {
                var args = arguments
                clearTimeout(fn.timer)
                var end = new Date()
                if (end - start > musttime) {
                    start = new Date()
                    clearTimeout(fn.timer)
                    fn.apply(content, args)
                } else {
                    fn.timer = setTimeout(function () {
                        start = new Date()
                        fn.apply(content, args)
                    }, time || 200)
                }
            }
        },
        // 获取样式（兼容）
        getStyle (element, attr) {
            if (element.currentStyle) {
                return element.currentStyle[attr]
            } else {
                return window.getComputedStyle(element, null)[attr]
            }
        },
        /*
        * input事件，只能输入数字，两位小数
        * para--输入框的值、paraIndex--如果是遍历出来的，当前输入框所在的索引、paraEl--当前对象的键值、paraArr--当前遍历的数组
        * */
        numInput (para, paraIndex, paraEl, paraArr) {
            paraArr[paraIndex][paraEl] = para.replace(/[^\d.]/g, '')
            paraArr[paraIndex][paraEl] = paraArr[paraIndex][paraEl].replace(/\.{2,}/g, '')
            paraArr[paraIndex][paraEl] = paraArr[paraIndex][paraEl].replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            paraArr[paraIndex][paraEl] = paraArr[paraIndex][paraEl].replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        },
        // 只能输入正整数限制
        intagerInput (para, paraName, paraType, inputType) {
            // 总价
            if (inputType == 'houseInfo') {
                this.houseInfo[paraName][paraType] = para.replace(/[^\d]/g, '')
                this.houseInfo[paraName][paraType] = this.houseInfo[paraName][paraType].replace(/^0+/g, '')
            } else if (inputType == 'houseInfoUnit') {
                // 单价
                this.houseInfo[paraName] = para.replace(/[^\d]/g, '')
                this.houseInfo[paraName] = this.houseInfo[paraName].replace(/^0+/g, '')
            } else if (inputType == 'manageFee') {
                // 物业费
                this.houseInfo[paraName] = para.replace(/[^\d.]/g, '')
                this.houseInfo[paraName] = this.houseInfo[paraName].replace(/\.{2,}/g, '')
                this.houseInfo[paraName] = this.houseInfo[paraName].replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            } else {
                this.user_require[paraName][paraType] = para.replace(/[^\d]/g, '')
                this.user_require[paraName][paraType] = this.user_require[paraName][paraType].replace(/^0+/g, '')
            }
        },
        // 贷款利率input事件
        loanInput (para) {
            this.loanObj.lending_rate = para.replace(/[^\d.]/g, '')
            this.loanObj.lending_rate = this.loanObj.lending_rate.replace(/\.{2,}/g, '')
            this.loanObj.lending_rate = this.loanObj.lending_rate.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            this.loanObj.lending_rate = this.loanObj.lending_rate.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        },
        // 周边信息
        esfPriceInput (para, paraEL) {
            this.esfData[paraEL] = para.replace(/[^\d.]/g, '')
            this.esfData[paraEL] = this.esfData[paraEL].replace(/\.{2,}/g, '')
            this.esfData[paraEL] = this.esfData[paraEL].replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            this.esfData[paraEL] = this.esfData[paraEL].replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        },
        // 点击步骤条
        selectContent (paraIndex, para) {
            // 如果是左侧导航点击，para有值
            if (para) {
                // 进行埋点
                commonFun.setTrack('4160', this.trackMessages, {}, this.backendApi)
            }
            this.swiperIndex = paraIndex
            let scrollBox = document.getElementsByClassName('right-body')[0]
            let distances = scrollBox.scrollTop || document.body.scrollTop
            let distance = !isNaN(distances) ? Math.ceil(distances) : distances;
            // 减去padding值
            let total = this.listHeight[paraIndex];
            let step = total / 50
            if (total > distance) {
                smoothDown()
            } else {
                let newTotal = distance - total
                step = newTotal / 50
                smoothUp()
            }
            function smoothDown () {
                if (distance < total) {
                    distance += step
                    // document.body.scrollTop = distance
                    scrollBox.scrollTop = distance
                    setTimeout(smoothDown, 10)
                } else {
                    // document.body.scrollTop = total
                    scrollBox.scrollTop = total
                }
            }
            function smoothUp () {
                if (distance > total) {
                    distance -= step
                    // document.body.scrollTop = distance
                    scrollBox.scrollTop = distance
                    setTimeout(smoothUp, 10)
                } else {
                    // document.body.scrollTop = total
                    scrollBox.scrollTop = total
                }
            }
        },
        // 交通实时按距离排序，暂时未用到
        sortByTraffic (arr) {
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < (arr.length - 1); j++) {
                    if (parseFloat(arr[i].distance) > parseFloat(arr[j].distance)) {
                        let t = [...arr[i]]
                        arr[i] = [...arr[j]]
                        arr[j] = t
                    }
                }
            }
        },
        /**
         * 判断目的地是否满足校验
         * @param {String} paraType 目的地类型（哪个目的地）
         * @return {Boolean} 是否满足校验
         */
        checkCommu (paraType) {
            let result = false;
            if (paraType === 'first') {
                if (!this.addressTable[0] && this.addressObj.address != '') {
                    return true;
                }
                if (this.addressObj.address != '') {
                    // 地址不为空
					if (this.addressTable[0].drive_time != '' && this.addressTable[0].bus_transit_time != ''
					&& this.addressTable[0].bus_walk_time != '' && this.isWalkCheck == 0) {
						// 如果第一个目的地存在并且自驾、公交、步行checkbox选中所以步行输入框都不为空
						result = true;
					} else if (this.addressTable[0].drive_time != '' && this.addressTable[0].bus_transit_time != ''
					&& this.isWalkCheck == 1) {
						// 如果第一个目的地存在并且自驾、公交、步行checkbox不选中
						result = true;
					}
                } else {
					// 地址为空
					result = true;
				}
            } else if (paraType === 'second') {
                if (!this.addressTableSecon[0] && this.addressObjSen.address != '') {
                    return true;
                }
                if (this.addressObjSen.address != '') {
                    // 地址不为空
					if (this.addressTableSecon[0].drive_time != '' && this.addressTableSecon[0].bus_transit_time != ''
					&& this.addressTableSecon[0].bus_walk_time != '' && this.isWalkCheckSen == 0) {
						// 如果第一个目的地存在并且自驾、公交、步行checkbox选中所以步行输入框都不为空
						result = true;
					} else if (this.addressTableSecon[0].drive_time != '' && this.addressTableSecon[0].bus_transit_time != ''
					&& this.isWalkCheckSen == 1) {
						// 如果第一个目的地存在并且自驾、公交、步行checkbox不选中
						result = true;
					}
                } else {
					// 地址为空
					result = true;
				}
			}
            return result;
        },
        // 周报房价情况完成标识
        checkAround () {
            let result = false;
            if (this.esfData.landShow + '' === '0' && this.esfData.secondShow + '' === '0') {
                if ((this.esfData.landPrice + '') && (this.esfData.secondPrice + '')) {
                    result = true;
                }
            } else if (this.esfData.landShow + '' === '0' && (this.esfData.secondShow + '' !== '0')) {
                if (this.esfData.landPrice + '') {
                    result = true;
                }
            } else if ((this.esfData.landShow + '' !== '0') && this.esfData.secondShow + '' === '0') {
                if (this.esfData.secondPrice + '') {
                    result = true;
                }
            } else {
                result = true;
            }
            return result;
        },
        // 主动判断地址价格
        checkAddressAndPrice () {
            if (this.checkCommu('first') && this.checkCommu('second') && this.checkAround()) {
                this.swiperArr[6].isOk = true;
            } else {
                this.swiperArr[6].isOk = false;
            }
        }
    },
    watch: {
        // 监听当前步骤
        currentIndex: {
            handler: function (val, oldval) {
                this.swiperIndex = this.currentIndex
                // 是否是最后一步
                if (this.currentIndex === (this.swiperArr.length - 1)) {
                    this.btnObj.nextBtn = '分享'
                } else {
                    this.btnObj.nextBtn = '下一步'
                }
            },
            deep: true
        },
        setCommuFlag: {
            handler: function (val, oldval) {
                if (!this.setCommuFlag) {
                    this.addressObj.lat = '';
                    this.addressObj.lng = '';
                    this.addressObj.address = '';
                    // 清空通勤表格数据
                    this.addressTable = [];
                    this.addressTable.push(JSON.parse(JSON.stringify(plainObj)));
                    // 清除地图覆盖物
                    this.carInfo.driveRoute = [];
                    this.busInfo.driveRoute = [];
                    this.lineTraffic();
                }
            },
            deep: true
        },
        setCommuFlagSecon: {
            handler: function (val, oldval) {
                if (!this.setCommuFlagSecon) {
                    this.addressObjSen.lat = '';
                    this.addressObjSen.lng = '';
                    this.addressObjSen.address = '';
                    // 清空通勤表格数据
                    this.addressTableSecon = [];
                    this.addressTableSecon.push(JSON.parse(JSON.stringify(plainObj)));
                    // 清除地图覆盖物
                    this.carInfoSecon.driveRoute = [];
                    this.busInfoSecon.driveRoute = [];
                    this.lineTraffic();
                }
            },
            deep: true
        },
        // 个人资料校验
        employeeInfo: {
            handler: function (val, oldval) {
                // 二维码不为空，标签至少有一个
                if (this.employeeInfo && this.employeeInfo.id) {
                    let tags = this.employeeInfo.tag ? this.employeeInfo.tag : []
                    if (this.employeeInfo.wx_qrcode && tags.length > 0 && this.defaultQaNum == this.qaSelectedList.length) {
                        this.swiperArr[7].isOk = true
                    } else {
                        this.swiperArr[7].isOk = false
                    }
                }
            },
            deep: true
        },
        // 问答列表
        qaSelectedList: {
            handler: function (val, oldval) {
                if (this.employeeInfo && this.employeeInfo.id) {
                    // 问答有一个，必须选中一个，大于一个，必须选中两个，一个都没有，则可以不选择
                    let tags = this.employeeInfo.tag ? this.employeeInfo.tag : []
                    if (this.employeeInfo.wx_qrcode && tags.length > 0 && this.defaultQaNum == this.qaSelectedList.length) {
                        this.swiperArr[7].isOk = true
                    } else {
                        this.swiperArr[7].isOk = false
                    }
                }
            },
            deep: true
        },
        // 实时监听楼盘参数
        tableVoice: {
            handler: function (val, oldval) {
                setTimeout(() => {
                    this._calculateHeight()
                })
            },
            deep: true
        },
        // 监听楼盘参数
        houseInfo: {
            handler: function (val, oldval) {
                // 楼盘参数都不能为空
                let houseInfo = this.houseInfo ? this.houseInfo : {}
                if (this.status != '' && houseInfo.unit_price != '' && houseInfo.total_price.price_min != '' && houseInfo.total_price.price_min && houseInfo.total_price.price_max && houseInfo.decorate.length > 0 && houseInfo.project_type != '' && houseInfo.manage_fee != '') {
                    this.swiperArr[3].isOk = true
                } else {
                    this.swiperArr[3].isOk = false
                }
                setTimeout(() => {
                    this._calculateHeight()
                })
            },
            deep: true
        },
        // 实时监听用户需求
        user_require: {
            handler: function (val, oldval) {
                let sum = this.user_require
                let opt = 0
                let successOpt = 0
                for (let i in sum) {
                    if (sum[i].is_show == 0) {
                        opt++
                        if (i == 'total_price' || i == 'first_price' || i == 'acreage') {
                            if (sum[i].isMore) {
                                if (sum[i].value_max != '' && sum[i].value_min != '') {
                                    successOpt++
                                }
                            } else {
                                if (sum[i].value_min != '') {
                                    successOpt++
                                }
                            }
                        } else if (sum[i].value != '') {
                            successOpt++
                        }
                    }
                }
                if (opt == successOpt) {
                    this.swiperArr[0].isOk = true
                } else {
                    this.swiperArr[0].isOk = false
                }
                setTimeout(() => {
                    this._calculateHeight()
                })
            },
            deep: true
        },
        // 实时监听楼盘概述，进行模块高度动态计算
        houseMessage: {
            handler: function (val, oldval) {
                if (this.houseMessage && this.houseMessage.trim()) {
                    // 给左侧步骤条切换状态
                    this.swiperArr[2].isOk = true
                } else {
                    // 给左侧步骤条切换状态
                    this.swiperArr[2].isOk = false
                }
                setTimeout(() => {
                    this._calculateHeight()
                })
            },
            deep: true
        },
        // 实时监听标签，确认第一步是否完成
        labelList: {
            handler: function (val, oldval) {
                if (this.labelList.length > 0) {
                    // 给左侧步骤条切换状态
                    this.swiperArr[1].isOk = true
                } else {
                    // 给左侧步骤条切换状态
                    this.swiperArr[1].isOk = false
                }
            },
            deep: true
        },
        // 监听贷款利率
        loanObj: {
            handler: function (val, oldval) {
                if (!this.loanObj.lending_rate) {
                    this.swiperArr[4].isOk = false
                } else {
                    if (Object.keys(this.sysHouse).length > 0) {
                        let isOk = false
                        // 若当前楼盘在系统中有户型，则需要至少选中一个户型，且户型面积及总价不为空，且贷款利率不为空
                        if (this.houseList.length > 0 && this.loanObj.lending_rate) {
                            for (let i = 0; i < this.houseList.length; i++) {
                                if (this.houseList[i].square_metre && this.houseList[i].total_price) {
                                    isOk = true
                                    break
                                }
                            }
                            setTimeout(() => {
                                if (isOk === true) {
                                    this.swiperArr[4].isOk = true
                                } else {
                                    this.swiperArr[4].isOk = false
                                }
                            })
                        }
                    } else {
                        this.swiperArr[4].isOk = true
                    }
                }
            },
            deep: true
        },
        // 实时监听标签，确认第一步是否完成
        houseList: {
            handler: function (val, oldval) {
                let isOk = true
                // 若当前楼盘在系统中有户型，则需要至少选中一个户型，且户型面积及总价不为空，且贷款利率不为空
                if (this.houseList.length > 0 && this.loanObj.lending_rate) {
                    for (let i = 0; i < this.houseList.length; i++) {
                        if (this.houseList[i].apartment_type + '' === '2' && (!(this.houseList[i].square_metre + '') || !(this.houseList[i].total_price + '') || !(this.houseList[i].name + ''))) {
                            isOk = false
                            break
                        } else if (this.houseList[i].apartment_type + '' === '1' && (!(this.houseList[i].square_metre + '') || !(this.houseList[i].total_price + ''))) {
                            isOk = false
                            break
                        }
                    }
                    setTimeout(() => {
                        if (isOk === true) {
                            this.swiperArr[4].isOk = true
                        } else {
                            this.swiperArr[4].isOk = false
                        }
                    })
                } else {
                    this.swiperArr[4].isOk = false
                }
            },
            deep: true
        },
        // 实时监听交通
        tableTrafficData: {
            handler: function (val, oldval) {
                // 判断公交是否完成
                this.checkTrafficOk()
            },
            deep: true
        },
        // 实时监听交通右侧预览，计算顺序
        preTraffic: {
            handler: function (val, oldval) {
                let lineList = JSON.parse(JSON.stringify(this.preTraffic.line))
                let carList = JSON.parse(JSON.stringify(this.preTraffic.car))
                // 现进行排序
                lineList.sort((i1, i2) => {
                    return i1.distance - i2.distance
                })
                carList.sort((i1, i2) => {
                    return i1.distance - i2.distance
                })
                this.preTrafficList = [...lineList, ...carList]
            },
            deep: true
        },
        // 监听通勤的步行勾选项
        isWalkCheck: {
            handler: function (val, oldval) {
                this.checkAddressAndPrice();
            },
            deep: true
        },
        isWalkCheckSen: {
            handler: function (val, oldval) {
                this.checkAddressAndPrice();
            },
            deep: true
        },
        // 监听通勤
        addressTable: {
            handler: function (val, oldval) {
                this.checkAddressAndPrice();
            },
            deep: true
        },
        addressTableSecon: {
            handler: function (val, oldval) {
                this.checkAddressAndPrice();
            },
            deep: true
        },
        // 实时监听周边
        esfData: {
            handler: function (val, oldval) {
                this.checkAddressAndPrice();
            },
            deep: true
        },
        // 监听每一步是否符合分享操作
        swiperArr: {
            handler: function (val, oldval) {
                let shareFlag = true
                for (let i = 0; i < this.swiperArr.length; i++) {
                    if (!this.swiperArr[i].isOk) {
                        shareFlag = false
                        break
                    }
                }
                setTimeout(() => {
                    if (shareFlag) {
                        this.shareBtn = true
                    } else {
                        this.shareBtn = false
                    }
                })
            },
            deep: true
        }
    },
    components: { BScroll, swiper, swiperSlide, SearchSelectRadio }
}
</script>

<style src='swiper/dist/css/swiper.css'></style>
<style scoped>
.house-share-box {
    height: 100%;
    min-width: 800px;
    background-color: #fff;
}
.house-share-box .error-fix-box {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
}
.option {
    float: left;
}
.edit-wrapper {
    width: 100%;
    height: 100%;
}
.center-content {
    position: relative;
    margin-left: 215px;
    margin-right: 350px;
    height: 100%;
    box-sizing: border-box;
}
.center-content-box {
    height: 100%;
    overflow-y: auto;
}
.step-box-wrapper {
    padding-bottom: 80px;
}
.left-wrapper {
    margin-left: -100%;
    width: 213px;
    height: 100%;
    border-right: 2px dashed #e6e6e6;
}
.left-title {
    width: 169px;
    height: 53px;
    line-height: 53px;
    text-align: center;
    margin-top: 30px;
    background: #33a1ff;
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
    height: 61px;
    font-size: 14px;
    text-align: center;
    border-left: 2px dashed #e6e6e6;
}
.shop_box .content > li.active {
    border-color: #33a1ff;
}
.shop_box .content > li:before {
    content: "";
    display: inline-block;
    position: absolute;
    left: -7px;
    bottom: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #e6e6e6;
}
.shop_box .content > li.last-li:before {
    background-color: #fff;
    border: 1px solid #33a1ff;
    width: 9px;
    height: 9px;
}
.shop_box .content > li .step-ok {
    position: absolute;
    left: -7px;
    bottom: 0;
    width: 12px;
    height: 12px;
}
.shop_box .content > li .step-hint {
    background-color: #fff;
    font-size: 12px;
    bottom: .15rem;
}
.content > li .step-cont {
    position: relative;
    margin-left: 14px;
    color: #3e4254;
}
.step-require{
    font-size: 12px;
    color: #fa5f35;
}
.content > li .step-cont-active:after {
    content: "";
    position: absolute;
    right: -2px;
    top: 38px;
    width: 0;
    border-width: 15px;
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
    text-align: left;
    text-indent: 10px;
    font-size: 14px;
    cursor: pointer;
}
.content > li .step-box-active {
    position: absolute;
    left: 0;
    top: 30px;
    width: 103px;
    height: 50px;
    background-color: #f4f5f9;
    line-height: 50px;
    text-align: left;
    text-indent: 10px;
    color: #33a1ff;
    font-size: 14px;
    font-weight: bold;
    z-index: 2;
}
.content > li .step-box-active:before {
    content: "";
    position: absolute;
    left: -12px;
    top: 18px;
    width: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent #f4f5f9 transparent transparent;
}
.content > li.step-hint-box {
    color: #ff5c47;
    border-left: 2px dashed #ff5c47;
}
.shop_box .content > li.step-hint-box {
    border-color: #ff5c47;
}
.shop_box .content > li.step-hint-box .step-box{
    color: #ff5c47;
}
/*右侧*/
.right-wrapper {
    position: relative;
    padding-top: 107px;
    box-sizing: border-box;
    height: 100%;
    background: #f6f6f6;
    box-shadow: 0 0 20px 0 rgba(152, 152, 152, 0.1);
}
.preview-wrapper {
    width: 350px;
    height: 100%;
    margin-left: -350px;
}
.share-success-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
    right: 351px;
    padding-left: 351px;
    box-sizing: border-box;
    z-index: 3;
}
.right-header {
    position: absolute;
    top: 0;
    left: 0;
    height: 107px;
    width: 100%;
    z-index: 2;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.share-header-box {
    height: 56px;
    overflow: hidden;
}
.right-header-tit {
    float: left;
    width: 110px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background: #ff5c47;
    border-radius: 0px 100px 100px 0px;
    font-size: 16px;
    margin: 13px 6px 0 0;
    color: #fff;
}
.right-header-btn {
    float: right;
    margin: 13px 20px 0 0;
    box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
    border-radius: 2px;
}
.right-header-btn >>> .el-button--primary {
    font-size: 16px;
    padding: 4px 10px;
    box-sizing: border-box;
    background: #3da6ff;
    border-radius: 2px;
}
.disabled-btn {
    float: right;
    margin: 13px 20px 0 0;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
}
.disabled-btn >>> .el-button--primary {
    font-size: 16px;
    padding: 4px 10px;
    background-color: rgba(171, 176, 181, 0.3);
    border: none;
     box-shadow: none;
    border-radius: 2px;
}
.right-header-cont {
    overflow: hidden;
    font-size: 12px;
    color: #77808a;
    line-height: 12px;
    margin-top: 22px;
}
.right-body {
    height: 100%;
    overflow-y: auto;
}
.content-box {
    background-color: #fff;
}
.right-body-row {
    padding: 22px 18px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
}
.scroll-line {
    border: 1px solid transparent;
}
.scroll-line-white {
    border: 1px solid #fff;
}
.swith-next {
    border: 1px solid transparent;
}
.swith-pre {
    /*border: 1px solid transparent;*/
}
.swith-pre .pre-row {
    padding: 0 0 28px 0;
}
.swith-pre .pre-row .bd {
    margin-top: 0;
}
.swith-next .right-body-row {
    margin-bottom: 0;
    padding-bottom: 0;
}
.right-body-row .hd {
    position: relative;
    overflow: hidden;
    width: 100%;
    font-size: 18px;
    color: #3e4254;
    line-height: 25px;
    margin-bottom: 20px;
    font-weight: bold;
}
.right-body-row .hd .sub-hd {
    float: left;
    position: relative;
    font-size: 16px;
    line-height: 21px;
}
.right-body-row .hd .sub-icon {
    overflow: hidden;
    line-height: 18px;
}
.right-body-row .hd .sub-hd:after {
    content: "";
    position: absolute;
    bottom: 3px;
    left: 0;
    height: 4px;
    width: 100%;
    background-color: #fa5f35;
    opacity: 0.3;
}
.right-body-row .hd .iconhelp_icon {
    color: #77808a;
    margin-left: 8px;
    font-weight: normal;
}
.right-body-title {
    padding: 7px 20px 0;
    margin-bottom: 0;
    background-color: #fff;
}
.traffic-body-row .hd {
    float: left;
}
.traffic-body-row .hd-tip-text {
    overflow: hidden;
    line-height: 25px;
    font-size: 13px;
    color: #000;
    padding-left: 8px;
}
.hd .hd-link {
    float: right;
    margin-right: 5px;
    font-size: 14px;
    color: #abb0b5;
    line-height: 25px;
}
.hd .hd-link:after {
    content: "\e64a";
    font-family: "iconfont";
    font-size: 12px;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-left: 5px;
}
.esf-body-row .hd .hd-link:after {
    display: none;
}
.hd .hd-txt {
    overflow: hidden;
    font-size: 18px;
    color: #3e4254;
    line-height: 25px;
}
.right-body-row .bd {
    margin-top: 20px;
}
.right-body-title .bd {
    margin-top: 0;
}
.right-body-row:last-of-type .bd {
    margin-bottom: 0;
}
.bd-tit {
    font-size: 14px;
    color: #3e4a59;
    letter-spacing: 0;
    line-height: 20px;
}
.txt-bold {
    font-weight: bold;
}
.bd-tit-dis {
    font-size: 12px;
    color: #333;
    word-break: break-all;
    line-height: 24px;
    margin-bottom: 20px;
    padding: 0 20px;
    box-sizing: border-box;
}
.swith-pre .bd-cont {
    padding: 0 20px;
    box-sizing: border-box;
}
.bd-cont .cont-title {
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
    margin-bottom: 16px;
}
.bd-cont .cont-con {
    width: 100%;
    height: 74px;
    border-radius: 4px;
}
.bd-cont .cont-con img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
}
.label-list {
    overflow: hidden;
}
.label-list > li {
    float: left;
    padding: 3px 5px;
    background-color: #f3f6f9;
    border-radius: 2px;
    font-size: 12px;
    margin: 0 8px 5px 0;
    color: #77808a;
    line-height: 12px;
}
.label-list > li:first-of-type {
    background-color: #e3f6fe;
    color: #47b3e3;
}
.bd .s-query {
    overflow: hidden;
}
.bd .s-query > li {
    width: 130px;
    font-size: 14px;
    margin-bottom: 10px;
}
.bd .s-query > li:last-of-type {
    margin-bottom: 0;
}
.bd .s-query > li.auto {
    width: 100%;
}
.bd .s-query > li.small {
    margin-right: 30px;
}
.bd .s-query .th {
    width: 70px;
    color: #77808a;
    line-height: 20px;
    height: auto;
    text-align: left;
}
.bd .s-query .td-right {
    float: right;
}
.bd .s-query .td-right-btn {
    padding: 3px 5px;
    box-sizing: border-box;
    border-radius: 2px;
    font-size: 12px;
    color: #fff;
    line-height: 12px;
}
.bd .s-query .td-right-green {
    background: #0ad487;
}
.bd .s-query .td-right-gray {
    background: #a1b1c6;
}
.bd .s-query .td-right-blue {
    background: #47b3e3;
}
.bd .s-query .th-link {
    float: right;
    width: 16px;
    height: 16px;
    margin: 2px 0 0 12px;
}
.bd .s-query .th-link > img {
    width: 100%;
    height: 100%;
}
.bd .s-query .td {
    color: #333;
    line-height: 20px;
    height: auto;
}
.bd .s-query .td-red {
    color: #fa5f35;
}
.bd .s-query .td-red > span {
    color: #fa5f35;
    font-size: 20px;
    font-weight: bold;
}
.bd .s-query .td-big {
    font-size: 16px;
    color: #3e4a59;
    font-weight: bold;
}
.bd .s-query .td-concat {
    font-size: 0;
}
.bd .s-query .td-concat {
    font-size: 16px;
}
.bd .s-query .td-blue {
    color: #47b3e3;
}
.hx-info {
    margin: 16px 0;
    font-size: 16px;
    color: #3e4a59;
    line-height: 16px;
    text-indent: 10px;
}
.swiper-card {
    width: 100%;
    height: 100%;
}
.slide-wrapper .describe-banner {
    width: 260px;
    height: 171px;
    margin-right: 10px;
}
.slide-wrapper .describe-banner:last-of-type {
    margin-right: 0;
}
.card-pic {
    width: 100%;
    height: 100%;
}
.card-pic img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
}
.hx-tb-box {
    position: relative;
    margin-top: 20px;
    height: 260px;
}
.hx-list {
    width: auto;
    white-space: nowrap;
    padding-left: 58px;
    overflow-x: auto;
    padding-bottom: 4px;
    box-sizing: border-box;
}
.hx-list-box {
    display: inline-block;
    box-shadow: 0 2px 4px 0 rgba(187, 187, 187, 0.5);
    border-radius: 4px;
    margin-right: 10px;
}
.hx-list-box > li {
    padding: 16px 10px;
    font-size: 14px;
    color: #3e4a59;
    font-weight: bold;
}
.box-tit {
    position: absolute;
    background-color: #f3f6f9;
    top: 0;
    left: 0;
}
.hx-list .hx-list-box {
    background-color: #fff;
}
.hx-list .hx-list-box-active {
    background-color: #e3f6fe;
}
.hx-list .hx-list-box li:nth-of-type(odd) {
    background: rgba(230, 230, 230, 0.2);
}
.bd-list .s-query > li {
    margin-bottom: 13px;
    font-size: 12px;
    color: #77808a;
    line-height: 17px;
}
.bd-list .s-query > li.display-none {
    display: none;
}
.traffic-item-box {
    position: relative;
    margin-left: 18px;
}
.traffic-item-box:before {
    content: "\e60c";
    font-family: "iconfont";
    font-size: 13px;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    color: #77808a;
    top: 0;
    left: -18px;
    line-height: 20px;
    opacity: 0.4;
}
.bd-list .s-query > li.auto-column .th {
    width: auto;
}
.bd-list .s-query > li .th,
.bd-list .s-query > li .td {
    color: #77808a;
}
.bd-list .s-query > li:last-of-type {
    margin-bottom: 0;
}
.around-list .s-query {
    border: 1px solid #f3f6f9;
}
.around-list .s-query > li {
    margin-bottom: 0;
}
.around-list .s-query > li .th {
    width: 120px;
    height: 52px;
    text-indent: 20px;
    line-height: 52px;
    background-color: #f3f6f9;
    font-size: 14px;
    color: #3e4a59;
    font-weight: bold;
    border-bottom: 1px solid #f3f6f9;
}
.around-list .s-query > li:last-of-type .th {
    border-bottom: none;
}
.around-list .s-query > li .td {
    text-indent: 20px;
    line-height: 52px;
    font-size: 14px;
    color: #3e4a59;
    border-bottom: 1px solid #f3f6f9;
    background-color: #fff;
}
.around-list .s-query > li:last-of-type .td {
    border-bottom: none;
}
.bd-btn {
    position: relative;
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-color: #f3f6f9;
    font-size: 14px;
    color: #47b3e3;
    margin-top: 20px;
    text-indent: 65px;
    border-radius: 4px;
    font-weight: bold;
}
.bd-btn .iconicon_dianjiliaojiegengduox {
    margin-right: 5px;
}
.zxs-info-pic {
    float: left;
    width: 56px;
    height: 56px;
    border-radius: 50%;
}
.zxs-info-pic > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.zxs-info {
    overflow: hidden;
    padding-left: 4px;
    box-sizing: border-box;
}
.info-top-right {
    float: right;
    width: 72px;
    height: 30px;
    line-height: 30px;
    background-image: linear-gradient(-90deg, #ffeff0 0%, #fff1ed 100%);
    border-radius: 15px;
}
.info-top-right > img {
    float: left;
    width: 18px;
    height: 18px;
    margin: 6px 6px 0 10px;
}
.info-top-right > p {
    overflow: hidden;
    font-size: 14px;
    color: #fa5f35;
}
.info-top-left {
    overflow: hidden;
    margin-right: 78px;
}
.info-item {
    margin-bottom: 3px;
    line-height: 16px;
    overflow: hidden;
}
.info-item .item-name {
    font-size: 16px;
    color: #3e4a59;
    line-height: 22px;
    margin-right: 10px;
    font-weight: bold;
    vertical-align: middle;
    float: left;
}
.info-item .info-item-txt {
    font-size: 12px;
    color: #77808a;
}
.info-item .item-label {
    background-color: #c2e7f8;
    border-radius: 2px;
    height: 15px;
    line-height: 15px;
    padding: 1px 5px 0;
    box-sizing: border-box;
    font-size: 12px;
    color: #37394c;
}
.item-tag-list {
    overflow: hidden;
    height: 15px;
    margin-top: 3px;
}
.info-item .item-label:last-of-type {
    margin-right: 0;
}
.info-bottom {
    font-size: 12px;
    color: #abb0b5;
    line-height: 16px;
}
.txt-red {
    color: #fa5f35;
}
/*中间部分*/
.center-header {
    margin-top: 50px;
    padding-left: 40px;
}
.header-step {
    float: left;
    width: 20px;
    height: 20px;
    background: url("./images/step_bg.png");
    background-size: 100%;
    color: #fff;
    line-height: 20px;
    text-align: center;
    font-size: 16px;
}
.header-step-dis {
    float: left;
    font-size: 16px;
    color: #333;
    line-height: 22px;
    margin: 0 10px;
}
.header-step-status {
    position: relative;
    overflow: hidden;
    height: 22px;
}
.header-line {
    position: relative;
    float: right;
    width: 98%;
    margin-top: 10px;
    height: 0;
    border-bottom: 1px solid #ff5c47;
}
.header-step-status > img {
    position: absolute;
    left: 0;
    top: 4px;
    width: 12px;
    height: 12px;
}
.center-body {
    margin-top: 30px;
    padding: 0 40px;
}
.center-body .body-hd {
    font-size: 18px;
    color: #3e4254;
    line-height: 25px;
    font-weight: bold;
}
.traffic-center .body-hd {
    float: left;
}
.step-commu .body-hd {
    display: inline-block;
}
.traffic-center .hd-tip-text {
    overflow: hidden;
    padding-left: 10px;
    line-height: 25px;
    font-size: 14px;
    color: #000;
}
.step-house .center-body .body-hd {
    float: left;
}
.step-house .center-body {
    overflow: hidden;
}
.body-hd-box {
    overflow: hidden;
}
.center-body-btn {
    float: left;
    margin-left: 20px;
    width: 118px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    font-size: 14px;
    background: #0ad487;
    border-radius: 2px;
    cursor: pointer;
}
.bd-house-list {
    position: relative;
    overflow-x: hidden;
}
.bd-house-list-info {
    float: left;
    height: 251px;
    padding: 1px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    width: 110%;
}
.bd-house-list-show {
    position: relative;
    margin-top: 20px;
    height: 326px;
    margin-left: 40px;
    box-sizing: border-box;
}
.house-list-show-title {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #f3f6f9;
}
.house-list-show-title > li {
    height: 54px;
    line-height: 54px;
    width: 85px;
    text-align: center;
    font-size: 14px;
    color: #3e4a59;
    font-weight: bold;
}
.house-list-show-cont {
    margin-left: 85px;
    height: 325px;
    width: auto;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
}
.show-cont-list {
    display: inline-block;
    border: 1px solid #f3f6f9;
    border-bottom: none;
    border-left: none;
}
show-cont-list:last-of-type {
    border-right: 0;
}
.show-cont-list > li {
    height: 54px;
    line-height: 54px;
    font-size: 12px;
    color: #3e4a59;
    border-bottom: 1px solid #f3f6f9;
    text-align: left;
    padding: 0 20px;
    box-sizing: border-box;
}
.show-cont-input >>> .el-input {
    float: left;
    width: 52px;
    height: 30px;
    border-radius: 2px;
    line-height: 30px;
    margin: 11px 6px 0 0;
    font-size: 12px;
}
.show-cont-input >>> .el-input__inner {
    height: 30px;
    border-radius: 2px;
    line-height: 30px;
    padding: 0 8px;
    font-size: 12px;
}
.show-status-drop >>> .el-select .el-input{
    width: 90px;
}
.show-status-drop >>> .el-select .el-input__icon{
    line-height: 30px;
}
.show-cont-tit >>> .el-input {
    width: 90px;
    height: 30px;
    line-height: 30px;
    margin: 11px 6px 0 0;
    border-radius: 2px;
    font-size: 12px;
}
.show-cont-tit >>> .el-input__inner {
    height: 30px;
    border-radius: 2px;
    line-height: 30px;
    padding: 0 8px;
    font-size: 12px;
}
.show-cont-list > li.show-cont-pic {
    color: #33a1ff;
}
.show-cont-pic .iconicon_chosen {
    font-size: 12px;
    color: #0ad487;
    margin-left: 6px;
    vertical-align: middle;
}
.pic-up-file {
    cursor: pointer;
    font-weight: bold;
}
.house-loan-box {
    padding-left: 40px;
    box-sizing: border-box;
    margin-top: 20px;
}
.loan-tip {
    font-size: 14px;
    color: #77808a;
    margin-bottom: 20px;
}
.bd-houst-list-fixed {
    position: absolute;
    top: 0;
    left: 1px;
    z-index: 2;
}
.bd-houst-list-fixed > li {
    float: left;
    background-color: #f3f6f9;
    height: 54px;
    line-height: 54px;
    text-align: center;
    font-size: 14px;
    color: #3e4a59;
    font-weight: bold;
    cursor: default;
}
.bd-houst-list-fixed > li.display-none {
    display: none;
}
.house-list-item {
    float: left;
    border-bottom: 1px solid #f3f6f9;
}
.house-list-item > li {
    position: relative;
    height: 50px;
    padding-left: 4px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #f3f6f9;
    margin-right: -1px;
    margin-bottom: -1px;
    cursor: pointer;
    overflow: hidden;
}
.dele-hide {
    position: absolute;
    width: 0;
    height: 0;
    top: 5px;
    right: 5px;
    border-width: 12px;
    border-style: solid;
    border-color: transparent transparent transparent transparent;
    transform: rotate(-135deg);
}
.dele-pic-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
}
.dele-pic-wrapper > img {
    width: 100%;
    height: 100%;
}
.house-list-item > li.house-list-title {
    background-color: #f3f6f9;
    height: 54px;
    line-height: 54px;
    text-align: center;
    font-size: 14px;
    color: #3e4a59;
    font-weight: bold;
    cursor: default;
}
.house-list-item > li.chosenBox {
    background-color: #33a1ff;
}
.chosenBox .item-box {
    color: #fff;
}
.chosenBox .item-house-area .iconicon_chosen {
    font-size: 12px;
    color: #fff;
}
.item-box {
    font-size: 12px;
    color: #3e4254;
    line-height: 17px;
    text-align: left;
}
.item-house-name {
    padding-top: 9px;
    box-sizing: border-box;
    height: 26px;
    overflow: hidden;
}
.item-house-area .iconicon_chosen {
    float: right;
    margin-right: 4px;
    font-size: 12px;
    color: #abb0b5;
}
.item-house-area .area-txt {
    overflow: hidden;
}
.center-body .body-bd {
    margin-top: 20px;
}
.add-input >>> .el-button {
    float: right;
    margin-left: 10px;
    border-radius: 2px;
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
    padding: 9px 10px;
    font-weight: normal;
}
.add-input .add-label {
    overflow: hidden;
}
.add-label >>> .el-input__inner {
    border-radius: 2px;
    padding: 0 10px;
}
.lable-box-title {
    margin-bottom: 20px;
    font-size: 14px;
    color: #333;
    line-height: 20px;
}
.custom-box {
    overflow: hidden;
    margin-top: 20px;
}
.custom-box > li {
    float: left;
    margin: 0 12px 12px 0;
}
.add-input {
    margin-top: 28px;
}
.custom-box .custom-item {
    padding: 7px 10px;
    background: #33a1ff;
    border-radius: 14px;
    color: #fff;
    overflow: hidden;
    font-size: 0;
}
.custom-item .custom-item-name {
    font-size: 14px;
    line-height: 14px;
}
.custom-item .iconicon_guanbi {
    font-size: 12px;
    margin-left: 5px;
    cursor: pointer;
}
.custom-item .iconicon_chosen {
    font-size: 12px;
    margin-left: 5px;
    color: #abb0b5;
}
.sys-box > li {
    float: left;
    margin: 0 10px 12px 0;
}
.sys-box .custom-item {
    padding: 7px 10px;
    background: #f3f6f9;
    border-radius: 2px;
    color: #77808a;
    font-size: 14px;
    cursor: pointer;
}
.sys-box .custom-item-active {
    background-color: #33a1ff;
    color: #fff;
}
.custom-item-active .iconicon_chosen {
    font-size: 12px;
    margin-left: 5px;
    color: #fff;
}
.step-label-list {
    overflow: hidden;
}
.step-label-list > li {
    float: left;
    padding: 3px 5px;
    background-color: #f3f6f9;
    border-radius: 2px;
    font-size: 12px;
    margin: 0 8px 10px 0;
    color: #77808a;
    line-height: 12px;
}
.step-label-list > li:first-of-type {
    background-color: #e3f6fe;
    color: #47b3e3;
}
.center-body-row {
    margin-bottom: 20px;
}
.esf-around-box {
    padding-top: 10px;
}
.body-bd-box {
    margin-bottom: 20px;
}
.body-bd-box:last-of-type {
    margin-bottom: 0;
}
.body-bd-box-hd {
    position: relative;
    font-size: 16px;
    color: #3e4254;
    line-height: 22px;
    text-indent: 4px;
    margin: 10px 0 20px 6px;
}
.body-bd-box-bd >>> .el-input__inner,
.body-bd-box-bd >>> .el-input {
    border-radius: 2px;
}
.body-bd-box-hd:before {
    content: "";
    position: absolute;
    top: 2px;
    left: -6px;
    background: #ff5c47;
    border-radius: 2px;
    width: 4px;
    height: 18px;
}
.commu-pic {
    width: 310px;
    height: 170px;
}
.commu-pic > img {
    width: 100%;
    height: 100%;
}
.cus-traffic-box {
    font-size: 12px;
    color: #77808a;
}
.commu-pic-row .body-hd {
    font-weight: normal;
}
.right-box-pre .right-wrapper .curren-scroll-box {
    background: rgba(255, 92, 71, 0.05);
    border: 1px dashed #ff5c47;
}
.right-box-pre .right-wrapper .curren-scroll-box-wrapper {
    border: 1px dashed #ff5c47;
}
.right-box-pre .right-wrapper .curren-scroll-bg {
    background: rgba(255, 92, 71, 0.05);
}
.right-box-pre .right-wrapper .curren-scroll-box-around {
    background: rgba(255, 136, 0, 0.05);
    border: 1px dashed #ff8800;
}
.replenish-height {
    height: 400px;
}
</style>
<style lang="less" scoped>
/*客户微信绑定信息*/
/deep/.wx-bind-dialog{
    border-radius: 8px;
    width: 430px;
    .el-dialog__header{
        font-weight: bold;
        padding-top: 30px;
    }
    .el-select{
        width: 100%;
    }
    .el-dialog__body{
        padding: 25px 30px 30px;
        min-height: 240px;
    }
}
/deep/.wx-upload-dialog{
    border-radius: 8px;
    width: 430px;
    .el-dialog__header{
        font-weight: bold;
        padding-top: 30px;
    }
}
.wechat-dialog-con {
    position: relative;
    .wechat-dialog-tit{
        font-size: 14px;
        color: #3e4254;
        line-height: 20px;
        font-weight: bold;
    }
    .wechat-dialog-tip{
        color: #ff5c47;
        font-size: 12px;
        line-height: 18px;
        margin-top: 20px;
        .iconupload_fail {
            font-size: 12px;
            margin-right: 6px;
        }
    }
    .error-msg {
        color: #ff5c47;
        position: absolute;
        bottom: -16px;
        left: 0;
        &.is-wechat-error-hide {
            display: none;
        }
    }
    .dialog-con-tit {
        font-size: 14px;
        color: #3e4254;
        margin-bottom: 20px;
        font-weight: bolder;
    }
    .dialog-input-list {
        text-align: center;
        /deep/.el-input{
            height: 30px;
            .el-input__inner{
                height: 30px;
                line-height: 30px;
                border-radius: 0;
                padding: 0 8px;
            }
        }
        li {
            position: relative;
            margin-bottom: 10px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
        .th {
            text-align: left;
            line-height: 30px;
            width: 70px;
            position: absolute;
            top: 0px;
            left: 0px;
        }
        .td {
            overflow: hidden;
            margin: 0 39px 0 70px;
        }
        .tf {
            float: right;
            .el-button {
                color: #ff5c47;
                padding: 0 6px;
                line-height: 30px;
                font-size: 12px;
            }
        }
    }
    .add-input-item {
        padding-left: 73px;
        font-size: 12px;
        /deep/.el-button {
            font-size: 12px;
            color: #0ad487;
            padding: 10px 10px;
        }
        .beyond-limit-msg {
            display: none;
        }
    }
    .dialog-upload-ul {
        line-height: 17px;
        font-size: 12px;
        overflow: hidden;
        .th {
            float: left;
            color: #ff5c47;
            margin-right: 20px;
        }
        .td {
            line-height: 17px;
            float: left;
        }
        .upload-wx{
            cursor: pointer;
            color: #33a1ff;
        }
        .iconupload_fail {
            font-size: 12px;
            margin-right: 6px;
        }
    }
}
/*上传微信数据提示*/
.upload-dialog-con {
    .upload-dialog-tit {
        color: #3e4254;
        font-size: 14px;
        font-weight: bolder;
        margin-bottom: 20px;
    }
    .upload-dialog-des {
        color: #ff5c47;
        font-size: 12px;
        line-height: 18px;
        .iconupload_fail {
            font-size: 12px;
        }
    }
}
/*2019-8-29:通勤地址样式修改*/
.color-orange {
    color: #fa5f35;
}
.scope-input-box {
    overflow: hidden;
    /deep/.el-input {
        float: left;
        width: 52px;
        .el-input__inner {
            height: 30px;
            line-height: 30px;
            width: 52px;
            font-size: 12px;
            padding: 0 6px;
            border-radius: 0;
            color: #3e4a59;
            border-color: #ccc;
        }
    }
    /deep/.el-textarea {
        .el-textarea__inner {
            font-size: 12px;
            padding: 6px;
            color: #3e4a59;
        }
    }
    .input-unit {
        overflow: hidden;
        font-size: 12px;
        color: #3e4a59;
        margin-left: 6px;
        line-height: 30px;
    }
}
.commu-center-body{
    .header-name{
        white-space: normal;
        line-height: 16px;
        font-size: 12px;
        vertical-align: middle;
        padding: 0;
        /deep/.el-checkbox__label{
            font-size:12px;
            line-height: 16px;
        }
    }
}
.end-address-wrap {
    margin-bottom: 20px;
    .end-address-box {
        float: left;
        width: 80px;
        margin-top: 8px;
        .end-address-num {
            float: left;
            width: 20px;
            height: 16px;
            background: url("./images/bg-num.png");
            background-size: 100%;
            color: #fff;
            font-size: 13px;
            line-height: 16px;
            text-indent: 4px;
            font-weight: bold;
            margin: 3px 2px 0 0;
        }
        .end-address-tit {
            overflow: hidden;
            font-size: 16px;
            color: #3e4254;
            line-height: 22px;
        }
    }
    .end-address-btn {
        float: right;
        margin-left: 20px;
        margin-top: 8px;
            .del-address-btn{
                display: block;
                font-size: 12px;
                width: 44px;
                line-height: 20px;
                height: 22px;
                background: #FF5C47;
                border-radius: 2px;
                box-sizing: border-box;
                padding: 0;
            }
    }
    .end-address-input {
        /deep/.el-input__inner {
            height: 38px;
            line-height: 38px;
            border: 1px solid #ccc;
        }
    }
}
audio:focus {
    outline: none;
}
.step-house-info {
    /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: transparent;
    }
    /deep/.el-table td {
        padding: 10px 0;
    }
}
/*语音播放*/
.audio-box {
    height: 28px;
    padding-top: 2px;
    & > span {
        color: #33a1ff;
        vertical-align: middle;
    }
    .iconfont {
        font-size: 26px;
        cursor: pointer;
    }
    .audio-name {
        font-size: 12px;
        color: #33a1ff;
        font-weight: bold;
        margin-left: 5px;
    }
}
.sum-up {
    .house-wrap {
        margin-top: 10px;
        background-color: #fff;
        .house-detail {
            padding: 20px;
            background: #f4f5f9;
            border-radius: 4px;
            .info-each {
                margin-bottom: 10px;
                font-size: 14px;
                span {
                    display: inline-block;
                }
                .th {
                    margin-right: 20px;
                    &.hou-name {
                        color: #3e4254;
                    }
                }
                .td {
                    color: #77808a;
                    span {
                        margin-right: 20px;
                    }
                }
            }
            .area-txt {
                height: 160px;
                margin-bottom: 20px;
                /deep/ .el-textarea {
                    height: 100%;
                    .el-textarea__inner {
                        resize: none;
                        height: 100%;
                        border: 1px solid #fff;
                    }
                }
            }
            .rate-temp {
                .info-each {
                    margin-bottom: 12px;
                }
                .tmp-wrap {
                    overflow: hidden;
                    width: 100%;
                    .temp-card {
                        font-size: 14px;
                        padding: 20px;
                        box-sizing: border-box;
                        background-color: #fff;
                        float: left;
                        border-radius: 4px;
                        margin-bottom: 20px;
                        width: 100%;
                        &:last-of-type {
                            margin-bottom: 0;
                        }
                        .name {
                            margin-bottom: 12px;
                            font-weight: bold;
                            .licks {
                                float: right;
                                color: #abb0b5;
                            }
                        }
                        .copy-btn {
                            cursor: default;
                            float: right;
                            display: inline-block;
                            font-size: 16px;
                            padding: 4px 10px;
                            color: #fff;
                            background: #3da6ff;
                            box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
                            cursor: pointer;
                            border-radius: 2px;
                        }
                        .txt-con {
                            height: 80px;
                            overflow: hidden;
                            margin-bottom: 20px;
                            .txt {
                                height: 100%;
                                overflow-y: auto;
                            }
                        }
                    }
                }
            }
        }
    }
}
.house-wrap {
    /deep/ .el-table {
        border: none;
        border-left: 1px solid #f3f6f9;
        th {
            border-right: 1px solid #f3f6f9;
            background-color: #f3f6f9;
            color: #3e4a59;
        }
        .cell {
            text-align: center;
        }
        .cell-left .cell {
            text-align: left;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .el-table__body-wrapper {
            td {
                padding: 8px 0;
                border-right: 1px solid #f3f6f9;
            }
        }
        .el-input {
            width: 100px;
            .el-input__inner {
                height: 30px;
                line-height: 30px;
                border-radius: 0;
            }
        }
    }
    .house-name {
        color: #fa5f35;
    }
    .traffic-name {
        color: #77808a;
        font-size: 12px;
    }
    .traffic-distance-box {
        color: #3e4a59;
        font-size: 12px;
        /deep/ .el-input {
            width: 52px;
            margin-right: 6px;
        }
        /deep/ .el-input__inner {
            padding: 0 6px;
            color: #3e4a59;
            font-size: 12px;
        }
    }
    .tb-operate-box {
        border: 1px solid #f3f6f9;
        border-top: none;
        overflow: hidden;
        margin-bottom: 20px;
        .center-body-btn {
            margin: 10px 20px;
        }
    }
    .tail {
        background-color: #f3f6f9;
        height: 48px;
        line-height: 48px;
        .set-show {
            float: left;
            text-align: center;
            &:first-child {
                width: 36%;
            }
            &:nth-child(2) {
                width: 32%;
            }
            &:last-child {
                width: 32%;
            }
        }
    }
    /deep/ .el-switch {
        height: 22px;
        line-height: 22px;
        /deep/ .el-switch__core {
            height: 22px !important;
            line-height: 22px !important;
            width: 46px !important;
            border-radius: 15px;
        }
        /deep/ .el-switch__label--left {
            position: relative;
            left: 46px;
            color: #fff;
            z-index: -1111;
        }
        /deep/ .el-switch__label--right {
            position: relative;
            right: 46px;
            color: #fff;
            z-index: -1111;
        }
        /deep/ .el-switch__label--right.is-active {
            z-index: 1111;
            color: #fff !important;
        }
        /deep/ .el-switch__label--left.is-active {
            z-index: 1111;
            color: #fff !important;
        }
        /deep/ .el-switch__core:after {
            top: 2px;
        }
    }
}
.house-wrap {
    /deep/ .el-table {
        /deep/ .el-button--danger {
            line-height: 16px;
            font-size: 12px;
            padding: 3px 10px;
            background-color: #ff5c47;
        }
        .cus-traffic-box {
            .select-wrap {
                display: inline-block;
                width: 54px;
                font-size: 12px;
                /deep/ .el-select {
                    width: 54px;
                    color: #77808a;
                    margin-right: 6px;
                    /deep/ .el-input {
                        width: 100%;
                        /deep/ .el-input__inner {
                            font-size: 12px;
                            padding: 0 6px;
                            color: #77808a;
                        }
                    }
                    /deep/ .el-input__suffix {
                        right: 0;
                        /deep/ .el-select__caret {
                            line-height: 30px;
                            font-size: 12px;
                            color: #77808a;
                        }
                    }
                }
            }
            /deep/ .el-input {
                width: 80px;
                font-size: 12px;
                color: #77808a;
                margin-right: 6px;
                /deep/ .el-input__inner {
                    font-size: 12px;
                    padding: 0 6px;
                    color: #77808a;
                }
            }
        }
    }
}
.info-wrap {
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
    span {
        display: inline-block;
    }
    .bd {
        overflow: hidden;
    }
    .info {
        width: 114px;
        height: 30px;
        float: left;
        margin-right: 20px;
        .td {
            float: left;
            width: 52px;
            overflow: hidden;
            /deep/ .el-input__icon {
                font-size: 12px;
                line-height: 30px;
                width: 12px;
            }
            /deep/ .el-input__inner {
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                padding: 0 4px;
                border-radius: 0;
            }
            /deep/ .el-input__suffix {
                right: 3px;
            }
        }
        .sele-unit {
            /deep/ .el-input__suffix-inner {
                display: none;
                /*value=value.replace(/[^0-9.]/g,'')*/
            }
            /deep/ .el-input__suffix:after {
                content: "%";
                position: absolute;
                right: 0;
                font-size: 12px;
                line-height: 30px;
            }
        }
        .th {
            float: left;
            font-size: 14px;
            line-height: 30px;
            margin-right: 6px;
        }
    }
    .term-info {
        .td {
            /deep/ .el-input__inner {
                height: 30px !important;
                line-height: 30px;
                font-size: 12px;
                padding: 0 4px;
                border-radius: 0;
            }
        }
    }
}
.step-commu {
    .body-bd-box-bd {
        overflow: hidden;
        /deep/.el-input {
            margin-bottom: 20px;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
    .add-address-btn {
        margin-left: 20px;
        font-size: 14px;
        color: #fff;
        background: #0ad487;
        border-radius: 2px;
        border-color: #0ad487;
        padding: 9px 10px;
    }
    .add-address-forbid {
        cursor: not-allowed;
        margin-left: 20px;
        font-size: 14px;
        color: #fff;
        opacity: 0.3;
        background: #abb0b5;
        border-color: #abb0b5;
        border-radius: 2px;
        padding: 9px 10px;
    }
}
/*个人资料模块--编辑*/
.step-user-info {
    .tag-info-box {
        margin-bottom: 18px;
        .add-input {
            margin-top: 20px;
        }
    }
    .center-body {
        .center-body-right {
            float: right;
            width: 218px;
            background-color: #f4f6f9;
            border-radius: 2px;
            padding: 0 16px 6px 16px;
            box-sizing: border-box;
            margin-left: 21px;
            .body-bd-box-hd {
                margin: 6px 0 16px 6px;
            }
            .body-bd-box-bd {
                overflow: hidden;
            }
            .code-img-box {
                float: left;
                width: 80px;
                height: 80px;
                margin-left: 10px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .code-btn {
                overflow: hidden;
                display: inline-block;
                margin: 20px 0 0 6px;
                padding: 5px 10px;
                box-sizing: border-box;
                font-size: 14px;
                color: #fff;
                line-height: 20px;
                background: #0ad487;
                border-radius: 2px;
                cursor: pointer;
            }
        }
        .center-body-left {
            overflow: hidden;
        }
        .body-qa-box {
            position: relative;
            background: #f4f5f9;
            border-radius: 4px;
            height: 395px;
            /deep/.el-scrollbar {
                height: 100%;
                position: static;
                .el-scrollbar__wrap {
                    overflow-x: hidden;
                }
            }
            .body-qa-header {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                width: 100%;
                height: 174px;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                .qa-header-search {
                    height: 62px;
                    border-bottom: 1px solid #f3f6f9;
                    line-height: 62px;
                    font-size: 12px;
                    color: #333;
                    padding: 0 19px;
                    box-sizing: border-box;
                    .search-th {
                        float: left;
                        margin-right: 10px;
                    }
                    .search-chosen {
                        float: right;
                        font-size: 14px;
                        color: #3e4a59;
                        margin-left: 10px;
                        span {
                            color: #33a1ff;
                        }
                    }
                    .search-td {
                        overflow: hidden;
                        .search-td-btn {
                            float: right;
                            background-color: #33a1ff;
                            color: #fff;
                            height: 30px;
                            line-height: 30px;
                            margin: 15px 0 0 10px;
                            border-radius: 2px;
                            padding: 0 10px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        }
                        .search-input-box {
                            overflow: hidden;
                        }
                    }
                }
                .qa-header-default {
                    height: 112px;
                    padding: 7px 19px 10px;
                    box-sizing: border-box;
                }
            }
            .header-default-box {
                overflow: hidden;
                & > li {
                    float: left;
                    width: 47%;
                    margin-right: 16px;
                    .default-item {
                        height: 94px;
                        background: #fff;
                        border: 1px solid #f3f6f9;
                        border-radius: 4px;
                        cursor: pointer;
                        .item-line {
                            position: relative;
                            float: left;
                            margin-right: 10px;
                            width: 10px;
                            height: 100%;
                            border-radius: 4px 0 0 4px;
                            background-color: #a9bacf;
                            border-top: 1px solid #a9bacf;
                            .iconsuccess_all {
                                position: absolute;
                                top: 50%;
                                left: -1px;
                                transform: translate(0, -50%) scale(0.83, 0.83);
                                color: #fff;
                                font-size: 12px;
                                font-weight: bold;
                            }
                        }
                        .item-info-cont {
                            overflow: hidden;
                            padding: 8px 10px 10px 0;
                            box-sizing: border-box;
                            .info-cont-title {
                                overflow: hidden;
                                height: 48px;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                font-size: 14px;
                                color: #3e4254;
                                line-height: 24px;
                                font-weight: bold;
                                margin-bottom: 8px;
                            }
                            .info-cont-tip {
                                overflow: hidden;
                                .tip-left {
                                    float: left;
                                    font-size: 14px;
                                    color: #abb0b5;
                                    line-height: 20px;
                                }
                                .tip-right {
                                    float: right;
                                    font-size: 14px;
                                    color: #abb0b5;
                                    line-height: 20px;
                                    margin-right: 10px;
                                }
                            }
                        }
                    }
                    &:nth-child(even) {
                        float: right;
                    }
                    &.chosen-item {
                        .default-item {
                            .item-line {
                                background-color: #33a1ff;
                                border-top: 1px solid #33a1ff;
                            }
                        }
                    }
                }
            }
            .body-qa-main {
                padding-top: 184px;
                box-sizing: border-box;
                height: 100%;
                overflow-y: auto;
                .qa-main-cont {
                    padding: 0 19px 0;
                    box-sizing: border-box;
                    .header-default-box {
                        & > li {
                            margin-bottom: 10px;
                        }
                    }
                }
            }
        }
    }
}
.body-bd-box-tit {
    margin-bottom: 20px;
    .box-tit-edit {
        margin-bottom: 20px;
        .box-tit-th {
            float: left;
            line-height: 30px;
            font-size: 14px;
            color: #333;
            margin-right: 6px;
        }
        .box-tit-td {
            overflow: hidden;
            /deep/.el-date-editor {
                width: 150px;
                .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                    color: #333;
                    padding: 0 6px 0 30px;
                    border-radius: 0;
                }
                .el-input__icon {
                    width: 14px;
                    line-height: 30px;
                }
            }
        }
    }
    .box-tit-tip {
        font-size: 14px;
        color: #333;
    }
}
.around-list-wrapper {
    overflow: hidden;
    .around-list-box {
        float: left;
        width: 120px;
        & > li {
            height: 52px;
            line-height: 52px;
            border: 1px solid #f3f6f9;
            border-top: none;
            border-left: none;
            font-size: 12px;
            color: #3e4a59;
            text-align: center;
            &.around-list-tit {
                font-weight: bold;
                font-size: 14px;
                background-color: #f3f6f9;
            }
            .around-list-price {
                /deep/ .el-input {
                    width: 104px;
                    margin-right: 6px;
                    /deep/ .el-input__inner {
                        padding: 0 6px;
                        height: 30px;
                        line-height: 30px;
                        font-size: 12px;
                        border-radius: 0;
                    }
                }
            }
        }
    }
    .esf-around-list {
        font-size: 14px;
        color: #3e4a59;
        font-weight: bold;
        background-color: #f3f6f9;
        & > li {
            font-size: 14px;
            font-weight: bold;
        }
    }
    .around-list-rest {
        overflow: hidden;
        .around-list-box {
            &:first-of-type {
                width: 60%;
            }
            &:last-of-type {
                width: 40%;
            }
        }
    }
}
.center-body {
    .bd-tip-info {
        font-size: 14px;
        color: #333;
        line-height: 20px;
    }
    .center-module {
        margin-bottom: 30px;
        &:last-of-type {
            margin-bottom: 0;
        }
        .bd-tip-info {
            font-size: 14px;
            color: #333;
            line-height: 20px;
        }
        .tab-info-box {
            overflow: hidden;
            .tab-box {
                float: left;
                border: 1px solid #f4f6f9;
                border-radius: 2px;
                &:after {
                    content: "";
                    display: block;
                    visibility: hidden;
                    clear: both;
                    height: 0;
                }
                & > li {
                    position: relative;
                    float: left;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    box-sizing: border-box;
                    font-size: 12px;
                    cursor: pointer;
                    color: #3e4254;
                    border-right: 1px;
                    &:after {
                        position: absolute;
                        content: "";
                        top: 3px;
                        right: 0;
                        bottom: 3px;
                        border-right: 1px dashed #e6e6e6;
                    }
                    &:first-of-type {
                        border-radius: 2px 0 0 2px;
                    }
                    &:last-of-type {
                        border-radius: 0 2px 2px 0;
                        &:after {
                            content: "";
                            display: none;
                        }
                    }
                    &.active {
                        background-color: #33a1ff;
                        color: #fff;
                        &:after {
                            top: 0;
                            bottom: 0;
                            border-right: 1px solid #33a1ff;
                        }
                    }
                    &.no-after {
                        &:after {
                            top: 0;
                            bottom: 0;
                            border-right: 1px solid #33a1ff;
                        }
                    }
                }
            }
        }
    }
    .bd-table {
        margin-top: 20px;
        /deep/.el-table {
            th {
                background-color: #f3f6f9;
                font-size: 14px;
                color: #3e4a59;
                border-bottom: none;
                padding: 17px 0;
                .cell {
                    padding: 0 20px;
                }
            }
            td {
                font-size: 12px;
                color: #77808a;
                line-height: 16px;
                .cell {
                    padding: 0 20px;
                }
                &.switch-column {
                    .cell {
                        padding: 0 10px;
                    }
                }
            }
            audio {
                height: 46px;
                &:focus {
                    outline: none;
                }
            }
        }
        /*模拟表格*/
        .like-tb-box {
            border-right: 1px solid #f3f6f9;
            margin-top: -1px;
            & > li {
                height: 50px;
                border: 1px solid #f3f6f9;
                margin-right: -1px;
                margin-top: -1px;
                padding-left: 20px;
                box-sizing: border-box;
                .tb-cell {
                    overflow: hidden;
                    .like-th {
                        width: 180px;
                        float: left;
                        height: 100%;
                        font-size: 12px;
                        color: #77808a;
                        line-height: 50px;
                        border-right: 1px solid #f3f6f9;
                    }
                    .like-th-right {
                        float: right;
                        width: 94px;
                        padding-top: 13px;
                        box-sizing: border-box;
                    }
                    .like-td {
                        overflow: hidden;
                        padding-left: 20px;
                        box-sizing: border-box;
                        height: 50px;
                        border-right: 1px solid #f3f6f9;
                        .like-td-box {
                            padding-top: 10px;
                            box-sizing: border-box;
                            overflow: hidden;
                            /deep/.el-checkbox-group {
                                padding-top: 5px;
                                box-sizing: border-box;
                                .el-checkbox__label {
                                    font-size: 12px;
                                    color: #3e4a59;
                                    font-weight: normal;
                                    padding-left: 5px;
                                }
                                .el-checkbox {
                                    margin-right: 20px;
                                }
                                .is-checked {
                                    .el-checkbox__inner {
                                        background: #33a1ff;
                                        border-color: #33a1ff;
                                    }
                                    .el-checkbox__label {
                                        color: #33a1ff;
                                    }
                                }
                            }
                            /deep/.el-radio-group {
                                padding-top: 5px;
                                box-sizing: border-box;
                                .el-radio__label {
                                    font-size: 12px;
                                    color: #3e4a59;
                                    font-weight: normal;
                                    padding-left: 5px;
                                }
                                .el-radio {
                                    margin-right: 20px;
                                }
                                .is-checked {
                                    .el-radio__inner {
                                        background: #33a1ff;
                                        border-color: #33a1ff;
                                    }
                                    .el-radio__label {
                                        color: #33a1ff;
                                    }
                                }
                            }
                            /deep/.el-select {
                                width: 52px;
                                .el-input__inner {
                                    height: 30px;
                                    line-height: 30px;
                                    font-size: 12px;
                                    color: #3e4a59;
                                    padding: 0 0 0 6px;
                                    border-radius: 0;
                                }
                                .el-input__icon {
                                    line-height: 30px;
                                    width: 10px;
                                    font-size: 12px;
                                }
                            }
                            .input-unit-middle {
                                float: left;
                                height: 0;
                                width: 6px;
                                border-bottom: 1px solid #ccc;
                                margin: 15px 10px 0 0;
                            }
                            .input-unit-operate {
                                float: left;
                                margin-left: 22px;
                                line-height: 30px;
                                font-size: 12px;
                                color: #33a1ff;
                                cursor: pointer;
                            }
                            .input-unit-box {
                                float: left;
                                width: 70px;
                                margin-right: 10px;
                                line-height: 30px;
                                &:after {
                                    content: "";
                                    display: block;
                                    visibility: hidden;
                                    clear: both;
                                    height: 0;
                                }
                                .input-unit {
                                    float: left;
                                    font-size: 12px;
                                    color: #3e4a59;
                                    line-height: 30px;
                                    margin-left: 6px;
                                }
                                /deep/.el-input {
                                    float: left;
                                    width: 52px;
                                    .el-input__inner {
                                        height: 30px;
                                        line-height: 30px;
                                        font-size: 12px;
                                        color: #3e4a59;
                                        padding: 0 6px;
                                        box-sizing: border-box;
                                        border-radius: 0;
                                    }
                                }
                            }
                        }
                        .manage-fee {
                            .input-unit-box {
                                width: auto;
                            }
                        }
                    }
                }
                .tb-cell-acreage {
                    .like-td {
                        .like-td-box {
                            .input-unit-box {
                                width: 82px;
                            }
                        }
                    }
                }
                &.tb-header {
                    background-color: #f3f6f9;
                    height: 54px;
                    line-height: 54px;
                    font-weight: bold;
                    text-align: left;
                    .tb-cell {
                        overflow: hidden;
                        .like-th {
                            height: 54px;
                            line-height: 54px;
                            font-size: 14px;
                            color: #3e4a59;
                            border-right: none;
                        }
                        .like-th-right {
                            font-size: 14px;
                            color: #3e4a59;
                            padding-top: 0;
                            text-align: center;
                        }
                        .like-td {
                            overflow: hidden;
                            font-size: 14px;
                            color: #3e4a59;
                        }
                    }
                }
            }
        }
    }
}
/*置顶咨询师信息*/
.user-info-box {
    height: 50px;
    padding: 5px 20px 0;
    box-sizing: border-box;
    border-top: 1px solid #f3f6f9;
    .user-info-pic {
        position: relative;
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        & > img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        .pic-icon {
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 2;
            width: 12px;
            height: 12px;
        }
    }
    .user-info-op {
        float: right;
        font-size: 0;
        padding-top: 6px;
        box-sizing: border-box;
        .iconfont {
            font-size: 20px;
            margin-right: 20px;
            &:last-of-type {
                margin-right: 0;
            }
            &.iconphone_icon {
                color: #ff5c47;
            }
        }
    }
    .user-info-cont {
        overflow: hidden;
        padding-left: 6px;
        box-sizing: border-box;
        .user-info-name {
            font-size: 16px;
            color: #3e4a59;
            line-height: 22px;
            margin-bottom: 2px;
            height: 22px;
        }
        .user-info-phone {
            font-size: 12px;
            color: #77808a;
            line-height: 17px;
        }
    }
}
/*购房需求模块--预览*/
.require-box {
    .right-body-row {
        padding: 26px 18px 3px;
        margin-bottom: 0;
        .require-list {
            overflow: hidden;
            & > li {
                float: left;
                &:after {
                    content: "";
                    display: block;
                    visibility: hidden;
                    clear: both;
                    height: 0;
                }
                .tag-wrapper {
                    float: left;
                    margin: 0 10px 10px 0;
                    background: #e3f6fe;
                    border-radius: 4px;
                    line-height: 12px;
                    padding: 7px 8px;
                    box-sizing: border-box;
                    font-size: 12px;
                    color: #47b3e3;
                }
            }
        }
    }
}
/*购房推荐理由--预览*/
.recommend-box {
    .right-body-row {
        margin-bottom: 0;
        padding: 22px 18px 0;
        .label-list {
            margin-bottom: 5px;
        }
        .hd {
            font-size: 16px;
            color: #3e4a59;
            margin-bottom: 16px;
        }
    }
}
/*楼盘描述--预览*/
.house-introduce {
    .right-body-row {
        min-height: 30px;
        margin-bottom: 0;
        padding: 0 18px;
        .recommen-info {
            font-size: 14px;
            color: #3e4a59;
            line-height: 24px;
            word-wrap: break-word;
            word-break: break-word;
        }
    }
}
/*楼盘参数--预览*/
.house-info-introduce {
    .house-info-inner {
        .right-body-row {
            margin-bottom: 0;
            background-color: transparent;
            .hd {
                font-size: 16px;
                color: #3e4a59;
            }
        }
    }
}
.middle-row {
    height: 10px;
    background-color: #f6f6f6;
}
/*推荐户型--预览*/
.door-introduce {
    padding: 0;
    .door-introduce-inner {
        padding: 24px 20px;
    }
    .hd {
        font-size: 16px;
        color: #3e4a59;
    }
}
/*交通--预览*/
.traffic-row {
    padding: 0;
    .traffic-row-inner {
        padding: 24px 20px;
    }
}
/*通勤--预览*/
.commu-info-box {
    margin-bottom: 10px;
    .right-body-row {
        margin-bottom: 0;
    }
}
/*个人资料--预览*/
.counse-container {
    background-color: #f6f6f6;
    padding: 0;
    .right-body-row {
        padding: 0;
    }
    .bd {
        margin-top: 0;
        > div {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .counselor-box {
        .img-warp {
            width: 100%;
            height: 210px;
            position: relative;
            color: #ffffff;
            .shadow {
                position: absolute;
                top: 0;
                left: 0;
            }
            img {
                width: 100%;
                height: 100%;
            }
            .desc {
                position: absolute;
                bottom: 12px;
                width: 100%;
            }
            .left {
                float: left;
                margin-left: 20px;
                .coun-name {
                    font-size: 22px;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .graduation-school {
                    font-size: 14px;
                }
            }
            .right {
                float: right;
                font-size: 16px;
                margin-right: 20px;
                padding: 9px 20px;
                background-image: linear-gradient(
                    93deg,
                    #45c0f6 6%,
                    #30b0e9 97%
                );
                border-radius: 20px;
                margin-top: 7px;
            }
        }
        .serve {
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            justify-content: space-around;
            height: 75px;
            align-items: center;
            background: #fff;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
            padding: 0 10px;
            position: relative;
            .line {
                height: 20px;
                width: 1px;
                background-color: #f4f6f9;
            }
            > li {
                .num {
                    font-size: 26px;
                    color: #3e4a59;
                    font-weight: bold;
                    margin-bottom: 7px;
                    text-align: center;
                    span {
                        font-size: 16px;
                        font-weight: normal;
                    }
                    &.good {
                        color: #fa5f35;
                    }
                }
                .text {
                    color: #77808a;
                    font-size: 17px;
                }
            }
        }
        .tag-warp {
            padding: 14px 20px 24px;
            background-color: #fff;
            ul {
                margin-bottom: 10px;
                overflow: hidden;
                .item {
                    font-size: 12px;
                    float: left;
                    padding: 0 5px;
                    color: #47b3e3;
                    border: 1px solid #47b3e3;
                    border-radius: 2px;
                    margin-right: 6px;
                    margin-bottom: 6px;
                }
            }
            p {
                font-size: 14px;
                line-height: 24px;
            }
        }
        .curren-scroll-bg {
            background: rgba(255, 92, 71, 0.05);
        }
    }
    .question-box,
    .remark-box {
        padding: 24px 20px;
        background-color: #fff;
        .buy-house {
            ul {
                li {
                    margin-bottom: 20px;
                    color: #3e4a59;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .title {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .desc {
                        margin-bottom: 15px;
                        font-size: 12px;
                        color: #77808a;
                        overflow: hidden;
                        > span {
                            float: left;
                            margin-right: 10px;
                        }
                        .time {
                            float: right;
                        }
                    }
                    .content {
                        font-size: 14px;
                        background: #f3f6f9;
                        border-radius: 8px;
                        box-sizing: border-box;
                        padding: 12px;
                        position: relative;
                        /deep/img {
                            width: 100%;
                            height: 100%;
                        }
                        span {
                            position: absolute;
                            display: inline-block;
                            top: -7px;
                            width: 0;
                            left: 20px;
                            height: 0;
                            border-left: 10px solid transparent;
                            border-right: 10px solid transparent;
                            border-bottom: 10px solid #f3f6f9;
                        }
                    }
                }
            }
        }
    }
    .remark-box {
        margin-bottom: 0 !important;
        .user-info {
            overflow: hidden;
            margin-bottom: 12px;
            background-color: transparent;
            .avatar {
                width: 75px;
                height: 95px;
                border-radius: 5px;
                overflow: hidden;
                float: left;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .desc {
                float: left;
                margin-left: 5px;
                > li {
                    color: #77808a;
                    font-size: 12px;
                    margin-bottom: 6px;
                    position: relative;
                    overflow: hidden;
                    line-height: 20px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .th {
                        float: left;
                    }
                    .td {
                        overflow: hidden;
                        zoom: 1;
                    }
                    > ul {
                        li {
                            color: #fa5f35;
                            background: #fff4f1;
                            border-radius: 2px;
                            font-size: 12px;
                            line-height: 18px;
                            padding: 0 5px;
                            display: inline-block;
                            margin-right: 5px;
                        }
                    }
                }
                .name {
                    font-size: 16px;
                    line-height: 18px;
                    color: #3e4a59;
                    font-weight: bold;
                }
            }
        }
        p {
            font-size: 14px;
            color: #3e4a59;
            line-height: 24px;
        }
    }
    .btn-area {
        box-sizing: border-box;
        padding: 15px 20px;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.06);
        background-color: #fff;
        font-size: 14px;
        color: #ffffff;
        > div {
            width: 48%;
            line-height: 42px;
            border-radius: 4px;
            text-align: center;
        }
        .left-btn {
            background-image: linear-gradient(
                -131deg,
                #58cff9 0%,
                #47b3e3 100%
            );
        }
        .right-btn {
            background-image: linear-gradient(
                -137deg,
                #ff8e56 0%,
                #fa5f35 100%
            );
        }
    }
}
.map-commu-box {
    position: relative;
    width: 100%;
    background-color: #fff;
    box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.07);
    border-radius: 4px;
    .dispear-box {
        z-index: -10 !important;
        opacity: 0;
    }
    &:after {
        content: "";
        display: block;
        visibility: hidden;
        clear: both;
        height: 0;
    }
    .tab-map-box {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
        border-radius: 4.59px;
        z-index: 3;
        padding: 5px 1px 3px;
        box-sizing: border-box;
        .tab-map-item {
            margin-bottom: 9px;
            cursor: pointer;
            &:last-of-type {
                margin-bottom: 0;
            }
            &:first-child {
                padding-bottom: 1px;
                margin-bottom: 4px;
                &:after {
                    background: #f3f6f9;
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 5px;
                    width: 14px;
                    height: 1px;
                }
            }
            .item-pic {
                width: 14px;
                height: 14px;
                margin: 0 auto;
                & > img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item-tit {
                font-size: 12px;
                color: #3e4254;
                text-align: center;
                transform: scale(0.7, 0.7);
            }
            .item-tit-active {
                color: #47b3e3;
            }
        }
    }
    .map-commu {
        height: 170px;
    }
    #map-single-share-second {
        position: absolute !important;
        width: 100%;
        top: 0;
        left: 0;
    }
    .map-commu-info-box {
        padding: 16px 20px 20px 20px;
        box-sizing: border-box;
        .commu-tab {
            overflow: hidden;
            & > li {
                float: left;
                font-size: 14px;
                background-color: #f3f6f9;
                width: 37%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: #3e4a59;
                border-radius: 15px;
                margin-right: 16px;
                min-height: 20px;
                line-height: 20px;
                padding: 5px 12px;
                text-align: center;
                cursor: pointer;
                &.active {
                    background-image: linear-gradient(
                        -93deg,
                        #45c0f6 6%,
                        #30b0e9 97%
                    );
                    box-shadow: 0 2px 4px 0 rgba(71, 179, 227, 0.3);
                    color: #fff;
                }
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
        .s-query {
            position: relative;
            margin-top: 16px;
            font-size: 14px;
            color: #77808a;
            &:before {
                content: "";
                position: absolute;
                left: 4px;
                top: 16px;
                width: 1px;
                height: 12px;
                background-color: #f3f6f9;
            }
            & > li {
                position: relative;
                line-height: 20px;
                margin-bottom: 6px;
                width: 100%;
                .th {
                    width: auto;
                    font-size: 14px;
                    text-indent: 18px;
                }
                .td {
                    font-size: 14px;
                    color: #3e4a59;
                }
                .icommu-tab-info-tit {
                    color: #47b3e3;
                    line-height: 20px;
                }
                &:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 5px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #47b3e3;
                }
                &:last-of-type {
                    margin-bottom: 0;
                    &:before {
                        background-color: #fa5f35;
                    }
                }
            }
        }
    }
}
.share-success-box {
    .center-header {
        padding-left: 0;
        margin-left: 30%;
        .iconsuccess_all {
            font-size: 15px;
            font-weight: bold;
        }
    }
    .share-body {
        margin-top: 30px;
        padding-left: 30%;
        box-sizing: border-box;
        /*2019.9.4修改*/
        .share-method-box{
            margin-bottom: 20px;
            .share-box-hd{
                margin-bottom: 20px;
                h3{
                    font-size: 18px;
                    color: #3e4254;
                    line-height: 25px;
                }
            }
            .share-box-bd{
                .share-method{
                    margin-bottom: 30px;
                    /deep/.el-radio{
                        color: #3e4a59;
                        line-height: 16px;
                        font-weight: normal;
                    }
                }
                .wx-message-method-box{
                    font-size: 14px;
                    color: #3e4254;
                    line-height: 20px;
                    .wx-message{
                        margin-bottom: 10px;
                        padding-right: 20px;
                        box-sizing: border-box;
                        .bind-wx{
                            font-size: 14px;
                            color: #33a1ff;
                            margin-left: 20px;
                            cursor: pointer;
                        }
                        .th{
                            float: left;
                            width: auto;
                            line-height: 30px;
                        }
                        .td{
                            overflow: hidden;
                            margin-left: 6px;
                            /deep/.el-input{
                                width: 260px;
                                height: 30px;
                                .el-input__inner{
                                    height: 30px;
                                    line-height: 30px;
                                    padding: 0 8px;
                                    border-radius: 0;
                                }
                            }
                        }
                    }
                    .method-tip{
                        font-size: 12px;
                        color: #ff5c47;
                        line-height: 17px;
                        .iconupload_fail{
                            margin-right: 6px;
                            color: #ff5c47;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .share-code-box {
            margin: 40px 0 0 82px;
            width: 218px;
            height: 218px;
            & > img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .share-btn-area{
        padding-top: 40px;
        box-sizing: border-box;
        margin-left: 22%;
        width: 586px;
        display: flex;
        justify-content: center;
        button{
            padding: 11px 34px;
            border-radius: 4px;
            &.update-btn {
                background: #33a1ff;
                box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
            }
            &.send-article{
                background: #0ad487;
                border-color: #0ad487;
                box-shadow: 0 2px 4px 0 rgba(51,161,255,0.30);
            }
            &.send-immediately{
                background: #ff8800;
                border-color: #ff8800;
                box-shadow: 0 2px 4px 0 rgba(255,136,0,0.30);
            }
        }
    }
}
.step-btn-area {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 3;
    .step-area {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        border-radius: 21px;
        width: 130px;
        height: 40px;
        line-height: 34px;
        font-size: 14px;
        font-weight: bold;
        background-color: #fff;
        overflow: hidden;
        padding: 3px 0;
        box-sizing: border-box;
        display: flex;
        cursor: pointer;
        .step-btn {
            flex: 1;
            font-size: 14px;
            color: #3e4254;
            text-align: center;
            &:first-of-type {
                border-right: 1px dashed #e6e6e6;
            }
            &:hover {
                color: #33a1ff;
            }
        }
        .unactive {
            color: #abb0b5;
            cursor: not-allowed;
            &:hover {
                color: #abb0b5;
            }
        }
        .btn-unactive {
            cursor: pointer;
        }
    }
}
</style>
<style scoped>
.edit-wrapper >>> .el-switch {
    height: 22px;
    line-height: 22px;
}
.edit-wrapper >>> .el-switch .el-switch__core {
    height: 22px !important;
    line-height: 22px !important;
    width: 46px !important;
    border-radius: 15px;
}
.edit-wrapper >>> .el-switch .el-switch__label--left {
    position: relative;
    left: 46px;
    color: #fff;
    z-index: -1111;
}
.edit-wrapper >>> .el-switch .el-switch__label--right {
    position: relative;
    right: 46px;
    color: #fff;
    z-index: -1111;
}
.edit-wrapper >>> .el-switch .el-switch__label--right.is-active {
    z-index: 1111;
    color: #fff !important;
}
.edit-wrapper >>> .el-switch .el-switch__label--left.is-active {
    z-index: 1111;
    color: #fff !important;
}
.edit-wrapper >>> .el-switch .el-switch__core:after {
    top: 2px;
}
.around-list-price >>> .el-input {
    width: 104px;
    margin-right: 6px;
}
.around-list-price >>> .el-input .el-input__inner {
    padding: 0 6px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 0;
}
.cus-traffic-box .select-wrap {
    display: inline-block;
    width: 54px;
    font-size: 12px;
}
.cus-traffic-box .select-wrap >>> .el-select {
    width: 54px;
    color: #77808a;
    margin-right: 6px;
}
.cus-traffic-box .select-wrap >>> .el-select .el-input {
    width: 100%;
}
.cus-traffic-box .select-wrap >>> .el-select .el-input .el-input__inner {
    font-size: 12px;
    padding: 0 6px;
    color: #77808a;
}
.cus-traffic-box .select-wrap >>> .el-select .el-input__suffix {
    right: 0;
}
.cus-traffic-box
    .select-wrap
    >>> .el-select
    .el-input__suffix
    .el-select__caret {
    line-height: 30px;
    font-size: 12px;
    color: #77808a;
}
.cus-traffic-box >>> .el-input {
    width: 80px;
    font-size: 12px;
    color: #77808a;
    margin-right: 6px;
}
.cus-traffic-box >>> .el-input .el-input__inner {
    font-size: 12px;
    padding: 0 6px;
    color: #77808a;
}
</style>
