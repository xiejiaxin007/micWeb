<!--
    @name: 选择楼盘对比侧边弹窗
    @description: 点击地图页面楼盘对比展示该弹窗
    @author: hewei
    @date: 2019-09-21
-->
<template>
    <transition name="fadeInleft">
        <div
            :class="`${!isRealCity ? 'not-real-city-box' : ''}`"
            v-show="isShow">
            <div
                class="choose-house"
            >
                <div class="house-topbar">
                    <i
                        class="iconfont iconguanbi close" 
                        aria-hidden="true"
                        @click="closeModel"
                    ></i>
                    <h4 class="head-line">选择楼盘对比</h4>
                </div>
                <div class="choose-header">
                    <label class="floor-label">新增楼盘</label>
                    <i class="iconfont iconsearch_input" 
                        aria-hidden="true"></i>
                    <div class="floor-form">
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
                </div>
                <div class="choose-body">
                    <div
                        class="house-list"
                        v-for="(item, index) in houseOptions"
                        :key="item.room_type"
                    >
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
                                    <i class="iconfont iconicon-delete" 
                                        aria-hidden="true"></i>
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
                                        <i class="iconfont iconicon-delete" 
                                            aria-hidden="true"></i>
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

                <house-type-dialog
                    :title="title"
                    :modal="false"
                    :cityInfo="cityInfo"
                    ref="houseDialog"
                    :isRealCity="isRealCity"
                    @dataUpdate="dataUpdate"
                />
            </div>

            <div
                class="mask"
                v-show="isShow"
                @click="closeModel"
            ></div>
        </div>
    </transition>
</template>

<script>
    import HouseTypeDialog from "./HouseTypeDialog.vue";
    import searchApi from "../api/searchToolShare";
    const {
        getHouseContrastInfo,
        deleteRecommendHouse,
        getHouseGroupApi
    } = searchApi;
    export default {
        name: "ChooseHouseBar",
        components: {
            HouseTypeDialog
        },
        props: {
            cityInfo: {
                type: Object,
                default: () => {}
            },
            // 是否是真实城市，true为真实城市，展示样式不变，false为虚拟城市，整体样式布局修改
            isRealCity: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                // 是否显示隐藏
                isShow: false,
                // select 绑定的对象，用于取其绑定的text
                houseValue: {},
                loading: false,
                // select 搜索下拉数据
                options: [],
                // 楼盘列表数据
                houseOptions: [],
                // 弹窗标题
                title: ""
            };
        },
        created() {
            this.initData();
        },
        watch: {
            isShow(newval, oldval) {
                if (newval) {
                    this.initData();
                }
            }
        },
        methods: {
            // 获取勾选的楼盘
            getCheckedHouse() {
                return this.houseOptions.map(ele => ele.isActive);
            },
            // 初始化数据
            initData() {
                this.orderId = this.$route.query.order_id;
                this.getInitHouseData();
            },
            // 更新最新数据
            dataUpdate() {
                this.getInitHouseData();
                // 更新楼盘对比数量
                this.$emit('dataUpdateNum');
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
            // 删除户型
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
            // 远程搜索
            remoteHouse(query) {
                if (!query) {
                    this.options = [];
                    return;
                }
                this.getFloorDataByKey(query);
            },
            // 获取楼盘数据
            async getFloorDataByKey(query) {
                try {
                    let options = {
                        q: query,
                        city_id: this.cityInfo.currentCityId.split(','),
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
            // 选中list中选项时
            changeHouse(value) {
                this.title = this.houseValue.name;
                this.$refs.houseDialog.openDialog(value.project_id);
            },
            // 获取焦点时获取数据
            focusHouse() {
                this.getFloorDataByKey();
            },
            // 打开新增户型弹窗 新增户型
            openHouseDialog(id, title) {
                /*  if (this.houseOptions >= 10) {
                     this.$message('最多只可添加十个楼盘对比');
                 } */
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
                 window.open(`housecontrasts?order_id=${this.orderId}&city_id=${this.cityInfo.currentCityId}`);
            },
            // 打开户型编辑
            houseEdit() {
                if (this.getCheckedHouse().length <= 0) {
                    this.$message("请至少勾选一个楼盘");
                    return;
                }
                this.getHasCheckedData(1);
                const shareArticle = this.$route.query.share_article || false;
                window.open(`moreHouseShare?city_id=${this.cityInfo.currentCityId}&order_id=${this.orderId}&is_open=true&share_article=${shareArticle}`)
            },
            /**
             * 获取已经选中的数据
             * @param {Number} type 类型 表示谁调取的方法
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
            },
            // 关闭弹窗
            closeModel() {
                this.isShow = false;
            },
            // 关闭弹窗
            openModel() {
                this.isShow = true;
            }
        }
    };
</script>

<style lang="less" scoped>
.choose-house {
    background-color: #fff;
    padding: 10px 20px 0;
    height: 100%;
    overflow-y: auto;
    position: fixed;
    width: 800px;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    .iconsearch_input {
        color: #46aaff;
        position: absolute;
        left: 77px;
        top: 12px;
        width: 5px;
        display: inline-block;
        z-index: 2;
    }
    .iconicon-delete {
        font-size: 12px;
    }
    .choose-header {
        position: relative;
        .floor-label {
            float: left;
            line-height: 40px;
            margin-right: 10px;
            font-size: 14px;
        }
        /deep/ .el-input__inner {
            padding-left: 34px;
            width: 240px;
        }
    }
}
.not-real-city-box {
    .choose-house {
        .floor-form {
            overflow: hidden;
            /deep/.el-select {
                width: 100%;
            }
        }
        /deep/ .el-input__inner {
            padding-left: 34px;
            width: 100%;
        }
    }
    .house-list {
        .list-content {
            padding-right: 0;
            .house-type-item {
                width: 100%;
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
.mask {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 8;
}
.head-line {
    font-size: 18px;
    text-align: center;
    margin-bottom: 30px;
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
.choose-body {
    margin-bottom: 70px;
}
.choose-footer {
    text-align: center;
    padding: 10px 0;
    position: fixed;
    bottom: 10px;
    right: 276px;
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
</style>