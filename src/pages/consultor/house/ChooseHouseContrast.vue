<!--
 * @author: hewei
 * @Date: 2019-08-29 18:15:12
 * @description：选择楼盘页面
 -->
<template>
    <div :class="`${isRealCity ? 'choose-house' : 'choose-house real-city-house'}`">
        <div class="choose-house-header">
            <h4 class="head-line">选择楼盘对比</h4>
            <!-- 城市下拉 -->
            <div class="left-inner">
                <div
                    v-if="isRealCity"
                    class="left-inner-th">选择城市</div>
                <div
                    v-if="isRealCity"
                    class="left-inner-td">
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
                                    {{cityCon.currentCity.split(',').join('/')}}
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
                                    <span class="check-btn">
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
                </div>
            </div>
        </div>
        <div class="choose-house-body">
            <div class="choose-header">
                <label class="floor-label">新增楼盘</label>
                <i class="iconfont iconsearch_input" aria-hidden="true"></i>
                <el-select
                    v-model="houseValue"
                    filterable
                    :disabled="this.houseOptions.length >= 10"
                    :loading="loading"
                    placeholder="请选择楼盘"
                    remote
                    value-key="project_id"
                    :remote-method="remoteHouse"
                    @change="changeHouse"
                    @focus="focusHouse"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.project_id"
                        :label="item.name"
                        :value="item"
                    ></el-option>
                </el-select>
            </div>
            <div class="choose-body">
                <div
                    class="house-list"
                    v-for="(item, index) in houseOptions"
                    :key="item.room_type">
                    <div class="list-title">
                        <el-checkbox v-model="item.isActive">
                            <h4>{{ index + 1 }}、{{ item.project_name }}</h4>
                        </el-checkbox>
                        <span
                            class="delete-house"
                            @click="deleteHouse(item.project_id)"
                        >删除</span>
                    </div>
                    <div
                        v-if="isRealCity"
                        class="list-content">
                        <div
                            class="house-type-item"
                            v-for="list in item.house_id"
                            :key="list.house_id">
                            <span class="house-model">{{ list.name }}</span>
                            <span>{{ list.square_metre }} ㎡</span>
                            <span>{{ list.house_status_name }}</span>
                            <span @click="deleteHouse(item.project_id, list.house_id)">
                                <i class="iconfont iconicon-delete" aria-hidden="true"></i>
                            </span>
                        </div>
                        <button
                            class="add-house el-button el-button--text"
                            @click="openHouseDialog(item.project_id, item.project_name)"
                        >+ 新增户型</button>
                    </div>
                    <div
                        v-else
                        class="list-content">
                        <div
                            class="house-type-item"
                            v-for="list in item.house_id"
                            :key="list.house_id">
                            <span class="house-model">{{ list.name }}</span>
                            <div class="house-right-box">
                                <span>{{ list.square_metre }} ㎡</span>
                                <span class="price">{{parseFloat((list.total_price / 10000).toFixed(2))}}万</span>
                                <span @click="deleteHouse(item.project_id, list.house_id)">
                                    <i class="iconfont iconicon-delete" aria-hidden="true"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="choose-footer">
                <button
                    class="check-btn el-button"
                    @click="houseContrast"
                >查看楼盘对比</button>
                <button
                    class="edit-btn el-button"
                    @click="houseEdit"
                >编辑&amp;分享</button>
            </div>
        </div>

        <house-type-dialog
            :title="title"
            :isRealCity="isRealCity"
            ref="houseDialog"
            @dataUpdate="dataUpdate"
        />
    </div>
</template>

<script>
    import HouseTypeDialog from "./components/HouseTypeDialog.vue";
    import searchApi from "./api/searchToolShare";
    import { commonFun } from '@/assets/js/utils/utils';
    const {
        getHouseContrastInfo,
        deleteRecommendHouse,
        getCityGroupApi,
        getHouseGroupApi,
        multiApi
    } = searchApi;
    export default {
        name: "ChooseHouseContrast",
        components: {
            HouseTypeDialog
        },
        data() {
            return {
                // 选择框绑定的值，绑定对象用来获取选项对应的文本
                houseValue: {},
                loading: false,
                // 下拉框数据
                options: [],
                // 楼盘列表数据
                houseOptions: [],
                title: "",
                cityCon: {
                    // 当前城市
                    currentCity: "",
                    // 当前城市id
                    currentCityId: ""
                },
                // 备份城市状态
                cityTotalBase: [],
                // 添加城市
                checkCityCon: [],
                // 选择城市备份数据
                checkCityConBase: [],
                // 选择城市弹窗
                unfoldCity: false,
                // 城市信息
                cityTotal: [],
                // 是否是真实城市
                isRealCity: false
            };
        },
        created() {
            this.initData();
        },
        methods: {
            // 获取当前市
            async getCity() {
                try {
                    const { data } = await getCityGroupApi();
                    if (data.code === 0) {
                        // 给城市下拉默认值
                        data.data.forEach((city, index) => {
                            // 给第一层城市添加为主城标识
                            city.type = 'major'
                            city.isOpen = true;
                            if (this.cityCon.currentCityId == city.id) {
                                // 初始化的时候默认给城市下拉赋值
                                this.cityCon.currentCity = city.text;
                                city.state = true;
                                city.scrollFlag = true;
                                this.checkCityCon.push({
                                    type: 'major',
                                    majorId: city.id,
                                    id: city.id,
                                    text: city.text
                                });
                            }
                        });

                        this.checkCityConBase = commonFun.deepClone(this.checkCityCon);
                        this.cityTotal = data.data;
                        this.cityTotalBase = data.data;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 获取虚拟城市匹配的真实城市
            async getRealCity() {
                try {
                    let params = {
                        order_id: this.orderId,
                        type: '25',
                        city_id: this.cityId
                    };
                    const { data } = await multiApi(params);
                    if (data.code === 0) {
                        if (data.data.real_city_id !== '0') {
                            // 说明是虚拟城市
                            this.isRealCity = false;
                        } else {
                            this.isRealCity = true;
                        }
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
                    this.cityTotal = commonFun.deepClone(arr);
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
                    this.checkCityCon = commonFun.deepClone(this.checkCityConBase);
                    this.cityTotal = commonFun.deepClone(this.cityTotalBase);
                    // 选中主城的top值
                    this.citySrollTop = document.querySelector('.current-major-active') ? document.querySelector('.current-major-active').offsetTop - 4 : 0;
                } else {
                    // 确定更新数据
                    // 选中主城的top值
                    this.citySrollTop = document.querySelector('.current-major-active') ? document.querySelector('.current-major-active').offsetTop - 4 : 0;
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
                        this.isRealCity = false;
                    } else {
                        this.isRealCity = true;
                    }
                    let cityids = [];
                    let cityNames = [];
                    this.checkCityCon.forEach((city, index) => {
                        cityids.push(city.id);
                        cityNames.push(city.text);
                    });
                    this.checkCityConBase = commonFun.deepClone(this.checkCityCon);
                    // 修改城市
                    this.cityCon.currentCity = cityNames.join(',');
                    this.cityCon.currentCityId = cityids.join(',');
                    this.cityTotalBase = commonFun.deepClone(this.cityTotal);
                }
                document.getElementsByClassName('major-con')[0].scrollTop = this.citySrollTop;
                this.unfoldCity = false;
            },
            // 获取勾选的楼盘
            getCheckedHouse() {
                return this.houseOptions.map(ele => ele.isActive);
            },
            // 初始化数据
            initData() {
                this.orderId = this.$route.query.order_id;
                this.cityId = this.$route.query.city_id;
                this.cityCon.currentCityId = this.cityId;
                this.getInitHouseData();
                // 新加城市下拉
                this.getCity();
                this.getRealCity();
            },
            // 更新最新数据
            dataUpdate() {
                this.getInitHouseData();
                // 像父窗口推送数据
                const message = {
                    type: "1",
                    msg: "updateHouseCount"
                };
                if (window.opener) {
                    window.opener.postMessage(message, location.origin);
                }
            },
            // 获取选择楼盘对比初始化数据
            async getInitHouseData() {
                try {
                    const { data } = await getHouseContrastInfo(this.orderId);
                    if (data.code === 0) {
                        if (JSON.stringify(data.data) === '{}') {
                            this.houseOptions = [];
                            return;
                        }
                        this.houseOptions = data.data.map(ele => {
                            ele.isActive = true;
                            return ele;
                        });
                    } else {
                        this.$message(data.msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 删除户型
             * @param {String} projectId 楼盘id
             * @param {String} houseId 户型id
             */
            async deleteHouse(projectId, houseId) {
                try {
                    let options = {
                        type: houseId ? 22 : 23,
                        house_id: houseId,
                        project_id: projectId,
                        order_id: this.orderId
                    };
                    const { data: res } = await deleteRecommendHouse(options);
                    if (res.code === 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        // 不传户型为删除楼盘
                        this.dataUpdate();
                    } else {
                        this.$message(res.msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
             /**
             * 下拉框远程搜索
             * @param {String} query 查询参数
             */
            remoteHouse(query) {
                if (!query) {
                    this.options = [];
                    return;
                }
                this.getFloorDataByKey(query);
            },
            /**
             * 获取楼盘数据
             * @param {String} query 查询参数
             */
            async getFloorDataByKey(query) {
                try {
                    let options = {
                        q: query,
                        city_id: this.cityCon.currentCityId.split(','),
                        for: 'frontend',
                        cooperate: 0
                    };
                    const { data: res } = await getHouseGroupApi(options);
                    if (res.code === 0) {
                        // 默认先展示前20条
                        this.options = res.data.list.slice(0, 20);
                    } else {
                        this.$message(res.msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 选中list中选项时 change事件
             * @param {Object} value 传入的值对象
             */
            changeHouse(value) {
                this.title = this.houseValue.name;
                this.$refs.houseDialog.openDialog(value.project_id);
            },
            // 获取焦点时获取数据
            focusHouse() {
                this.getFloorDataByKey();
            },
            /**
             * 打开新增户型弹窗 新增户型
             * @param {Number} id order_id
             * @param {Object} title 弹窗标题
             */
            openHouseDialog(id, title) {
                this.title = title;
                this.$refs.houseDialog.openDialog(id);
            },
            // 打开户型对比
            houseContrast() {
                if (this.getCheckedHouse().length <= 0) {
                    this.$message("请至少勾选一个楼盘");
                    return;
                }
                this.getHasCheckedData();
                this.$router.push(`/housecontrasts?order_id=${this.orderId}&city_id=${this.cityId}`);
            },
            // 打开户型编辑
            houseEdit() {
                if (this.getCheckedHouse().length <= 0) {
                    this.$message("请至少勾选一个楼盘");
                    return;
                }
                this.getHasCheckedData(1);
                const shareArticle = this.$route.query.share_article || false;
                this.$router.push(
                    `moreHouseShare?city_id=${this.cityId}&order_id=${this.orderId}&is_open=true&share_article=${shareArticle}`
                );
            },
            /**
             * 获取已选中的数据
             * @param {String} type 类型
             */
            getHasCheckedData(type) {
                const houseList = [];
                let houseListConstract = [];
                this.getCheckedHouse().forEach((ele, idx) => {
                    if (ele) {
                        const projectItem = this.houseOptions[idx];
                        const houseItem = projectItem.house_id.map(item => {
                            // type为1时为多楼盘编辑页提供户型数据
                            if (type === 1) {
                                return {
                                    projectId: projectItem.project_id,
                                    houseType: item.house_id,
                                    apartmentType: item.apartment_type
                                };
                            }
                            return {
                                project_id: projectItem.project_id,
                                house_id: item.house_id,
                                apartment_type: item.apartment_type
                            };
                        });
                        if (type === 1) {
                            houseList.push(...houseItem);
                        } else {
                            houseListConstract.push(...houseItem)
                        }
                    }
                });
                if (type === 1) {
                    localStorage.setItem("projectInfo", JSON.stringify(houseList));
                } else {
                    localStorage.setItem("chooseHouseProjectInfo", JSON.stringify(houseListConstract));
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.choose-house {
    background-color: #fff;
    padding: 30px 0;
    min-height: 100%;
    .iconsearch_input{
        color: #46aaff;
        position: relative;
        left: 20px;
        top: 1px;
        width: 5px;
        display: inline-block;
        z-index: 2;
    }
    .iconicon-delete{
        font-size: 12px;
    }
    .choose-header{
        .floor-label{
            font-size: 14px;
        }
        /deep/ .el-input__inner{
            padding-left: 34px;
            width: 240px;
        }
    }
}
.choose-house-body{
    padding: 0 40px;
}
.head-line{
    font-size: 18px;
    text-align: center;
}

.house-list {
    margin-top: 20px;
    .list-title {
        .delete-house {
            font-size: 12px;
            color: #ff5c47;
            margin-left: 6px;
            cursor: pointer;
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .list-content {
        padding: 0 22px;
        display: flex;
        flex-wrap: wrap;
        .house-type-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 10px;
            margin-top: 12px;
            width: 190px;
            height: 22px;
            font-size: 12px;
            border: 1px solid #e6e6e6;
            border-radius: 2px;
            padding: 0 10px;
            cursor: pointer;
            .house-model {
                width: 80px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .add-house {
            color: #0ad487;
            font-size: 12px;
            margin-left: 10px;
            margin-top: 5px;
        }
        .iconicon-delete {
            color: #abb0b5;
        }
    }
}
.choose-footer {
    text-align: center;
    padding: 50px 0;
    position: fixed;
    bottom: 20px;
    left: 50%;
    margin-left: -140px;
    .el-button {
        width: 132px;
        height: 38px;
        color: #fff;
        font-size: 16px;
        line-height: 12px;
        border: 0;
        box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
        &.check-btn {
            background-color: #ff5c47;
            box-shadow: 0 2px 4px 0 rgba(255, 92, 71, 0.3);
        }
        &.edit-btn {
            background-color: #3da6ff;
        }
    }
}
/* 修改页面头部固定 */
.choose-house-header{
    margin-bottom: 30px;
    padding: 0 40px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.10);
}
/* 城市下拉 */
.left-inner .filter-box {
    position: relative;
    cursor: pointer;
    margin-bottom: 8px;
    box-sizing: border-box;
    background-color: #fff;
    height: 38px;
}
.left-inner{
    margin-top: 10px;
    padding: 12px 0;
    &::after{
        content:".";
        display:block;
        height:0;
        clear:both;
        visibility:hidden;
    }
    .left-inner-th{
        float: left;
        width: 48px;
        line-height: 38px;
        margin-right: 10px;
    }
    .left-inner-td{
        float: left;
    }
    .check-city {
        width: 236px;
        border: 1px solid #dee3ea;
        border-radius: 2px;
        .choice-city{
            height: 38px;
            .choice-city-inner{
                overflow: hidden;
                padding: 8px 12px;
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
                margin: 2px 6px 0 0;
            }
            .pull-city{
                width: 12px;
                height: 12px;
                margin-top: 1px;
                margin-right: 0;
            }
            .trans-img{
                transform: rotateX(-180deg);
            }
            .city-name-con{
                width: 171px;
                height: 20px;
                overflow: hidden;
                white-space: nowrap;
                margin-right: 5px;
                color: #3e4254;
                font-size: 14px;
                font-weight: bold;
            }
        }
        .city-group-list{
            position: absolute;
            z-index: 3;
            background: #fff;
            width: 236px;
            overflow-x: hidden;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 1px 7px 0 rgba(0,0,0,0.10);
            .major-con{
                height: 300px;
                overflow-y: auto;
                overflow-x: hidden;
                width: 236px;
                box-sizing: border-box;
                padding-top: 4px;
                /deep/ .el-checkbox__label{
                    color: #3e4254;
                }
                .major-city{
                    width: 236px;
                    min-height: 34px;
                    font-size: 14px;
                    /deep/.el-checkbox{
                        float: left;
                        width: 80%;
                    }
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
                padding: 0 47px;
                box-sizing: border-box;
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
    }
}
.real-city-house {
    .choose-header{
        /deep/ .el-input__inner{
            padding-left: 34px;
            width: 526px;
        }
    }
    .house-list {
        .list-content {
            padding-right: 0;
            .house-type-item {
                width: 49%;
                box-sizing: border-box;
                .house-model {
                    flex: 1;
                    width: auto;
                }
                .house-right-box {
                    padding-left: 6px;
                    .price {
                        color: #ff5c47;
                    }
                }
            }
        }
    }
}
</style>