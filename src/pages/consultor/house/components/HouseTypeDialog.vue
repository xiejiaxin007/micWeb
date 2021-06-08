<template>
    <div :class="`${isRealCity ? 'house-type-wrap' : 'house-type-wrap house-is-not-real'}`">
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="520px"
            class="dialog choose-house-hx-dialog"
            @close="closeDialog"
            :center="true"
            :show-close="false"
            :modal="modal">
            <div
                v-if="isRealCity"
                class="dialog-body">
                <div
                    class="dialog-body-items"
                    v-for="(items, index) in houseList"
                    :key="index">
                    <h4>{{items.house_type}}</h4>
                    <ul class="lists">
                        <li
                            v-for="(itemcut, idx) in items.children"
                            :key="idx"
                            :data-house_type_id="itemcut.id"
                            class="list">
                            <div
                                :class="{'list-check': true, 'active': itemcut.is_select == 0}"
                                @click="houseChoice(itemcut)"
                            >
                                <span class="hx">{{itemcut.name}}</span>
                                <span class="hx">{{itemcut.square_metre}}㎡</span>
                                <span class="hx">{{itemcut.house_status_name}}</span>
                                <span class="hook"></span>
                            </div>
                            <div
                                class="delete"
                                v-if="itemcut.apartment_type == 2"
                                @click="deleteHouse(itemcut.id,index,idx)"
                            >删除</div>
                        </li>
                    </ul>
                </div>
                <div class="add-house-type">
                    <div class="house-type-header">
                        <h4>新增户型</h4>
                        <button
                            class="el-button is-plain add-btn"
                            v-show="addBtnShow"
                            @click="addHouseType"
                        >+ 添加户型</button>
                    </div>
                    <ul class="add-items">
                        <li
                            class="add-item"
                            v-for="(item, index) in newHouseData"
                            :key="index"
                        >
                            <div class="item-panel">
                                <div
                                    :class="{ 'panel-checked' :true, 'checked': valite(item) }"
                                    @click="checkHouse(item)"
                                ><i class="iconfont iconsuccess_all" aria-hidden="true"></i></div>
                                <el-form :model="item">
                                    <el-form-item
                                        label="居室"
                                        :label-width="formLabelWidth"
                                    >
                                        <el-select
                                            v-model="item.room_type"
                                            placeholder="请选择居室"
                                        >
                                            <el-option
                                                :label="list.name"
                                                :value="list.value"
                                                v-for="list in roomType"
                                                :key="list.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        label="户型"
                                        :label-width="formLabelWidth"
                                    >
                                        <el-input
                                            v-model="item.name"
                                            maxlength="20"
                                            autocomplete="off"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        class="area"
                                        label="面积"
                                        :label-width="formLabelWidth"
                                    >
                                        <jl-number-input
                                            :min-val="0"
                                            :value="item.square_metre"
                                            :max-val="10000"
                                        @input="numInput(item, $event)" />
                                    </el-form-item>
                                    <el-form-item
                                        label="状态"
                                        :label-width="formLabelWidth"
                                    >
                                        <el-select
                                            v-model="item.house_status"
                                            placeholder="请选择状态"
                                        >
                                            <el-option
                                                :label="list.name"
                                                :value="list.value"
                                                v-for="list in projectStatus"
                                                :key="list.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div
                                class="delete delete-floor"
                                @click="delHasAddHouse(index)"
                            >删除</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                v-else
                class="dialog-body">
                <div class="dialog-tab-box">
                    <ul class="tab-query">
                        <li
                            v-for="(items, index) in houseVirList"
                            :key="index + '-tab'"
                            :class="`${index === currentIndex ? 'active' : ''}`">
                            <div
                                @click="changeTab(items, index)"
                                class="tab-item">{{items.house_type}}</div>
                        </li>
                    </ul>
                </div>
                <div class="dialog-info-box dialog-body-items">
                    <ul
                        v-if="houseList[currentIndex]"
                        class="lists info-query">
                        <li
                            v-for="(itemcut, idx) in houseList[currentIndex].children"
                            :key="idx"
                            :data-house_type_id="itemcut.id"
                            class="list">
                            <div
                                :class="{'list-check': true, 'active': itemcut.is_select == 0}"
                                @click="houseChoice(itemcut)">
                                <span class="hx-info">
                                    <span class="hx area">{{itemcut.square_metre}}㎡</span>
                                    <span
                                        v-if="itemcut.total_price"
                                        class="hx price">{{parseFloat((itemcut.total_price / 10000).toFixed(2))}}万</span>
                                    <span class="hook"></span>
                                </span>
                                <div class="hx hx-name">{{itemcut.name}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button class="btn-dialog" @click="dialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    class="btn-dialog"
                    @click="saveHouseContrastInfo"
                >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import searchApi from "../api/searchToolShare";
    import dataStorage from "@/assets/js/utils/dataStorage";
    import { commonFun } from "@/assets/js/utils/utils";
    const {
        getHouseTypeInfo,
        setHouseConstrastInfo,
        deleteRecommendHouse,
        multiApi
    } = searchApi;
    export default {
        name: "HouseTypeDialog",
        props: {
            // 选中的城市
            cityInfo: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            title: {
                type: String,
                default: ""
            },
            modal: {
                type: Boolean,
                default: true
            },
            // 是否是真实城市，true为真实城市，展示样式不变，false为虚拟城市，整体样式布局修改
            isRealCity: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                formLabelWidth: "50px",
                dialogVisible: false,
                // 初始化户型数据
                houseList: [],
                // 新增户型数据
                newHouseData: [],
                // 户型
                roomType: [],
                // 销售状态
                projectStatus: [],
                // 当前选中的tab
                currentIndex: 0
            };
        },
        created() {
            this.initInfo();
        },
        computed: {
            // 虚拟城市下最多五个户型
            houseVirList() {
                let filterArr = this.houseList.filter((item, i) => {
                    return i < 5;
                });
                return filterArr;
            },
            // 新增按钮是否显示
            addBtnShow() {
                return this.newHouseData.length < 5;
            },
            // 新增的户型是否可选中
            valite() {
                return item => {
                    item.iscomplete = !!(
                        item.name &&
                        item.square_metre &&
                        item.house_status &&
                        item.room_type
                    );
                    return item.iscomplete && item.is_select == 0;
                };
            }
        },
        methods: {
            /**
             * 切换tab
             * @param {Object} item item对象
             * @param {Number} i 选中的索引值
             */
            changeTab(item, i) {
                this.currentIndex = i;
            },
            // 初始化字典数据
            initInfo() {
                let performInfo = {};
                if (!dataStorage.getStorage("houseBaseInfo")) {
                    (async () => {
                        try {
                            const options = {
                                type: "19",
                                city_id: this.$route.query.city_id ? this.$route.query.city_id.split(',') : (this.cityInfo.currentCityId ? this.cityInfo.currentCityId.split(',') : ''),
                                order_id: this.$route.query.order_id
                            };
                            // post cityid传数组
                            const { data } = await multiApi(options);
                            if (data.code === 0) {
                                performInfo = data.data;
                                this.roomType = performInfo.room_type;
                                this.projectStatus = performInfo.project_status;
                                dataStorage.setStorage(
                                    "houseBaseInfo",
                                    JSON.stringify(performInfo)
                                );
                            } else {
                                this.$message(data.msg);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    })();
                } else {
                    performInfo = JSON.parse(
                        dataStorage.getStorage("houseBaseInfo").oData
                    );
                    this.roomType = performInfo.room_type;
                    this.projectStatus = performInfo.project_status;
                }
                this.projectId = "";
                this.orderId = this.$route.query.order_id;
                // 存储已经选中户型的数据（不包括新增）
                this.selectData = [];
            },
            /**
             * num输入框赋值
             * @param {Object} item item对象
             * @param {String} input 输入的值
             */
            numInput(item, val) {
                item.square_metre = val
            },
            // 新增户型
            addHouseType() {
                let newHouseData = {
                    name: "",
                    square_metre: "",
                    house_status: "",
                    room_type: "",
                    is_select: "0",
                    apartment_type: "2",
                    iscomplete: false
                };
                this.newHouseData.unshift(commonFun.deepClone(newHouseData));
            },
            // 删除新增的户型
            delHasAddHouse(idx) {
                this.newHouseData.splice(idx, 1);
            },
            // 删除已存在对比的户型
            async deleteHouse(id, pIdx, idx) {
                let options = {
                    type: "10",
                    house_id: id,
                    // employee_id: '',
                    project_id: this.projectId,
                    order_id: this.orderId
                };
                try {
                    const { data: res } = await deleteRecommendHouse(options);
                    if (res.code === 0) {
                        this.$message(res.msg);
                        // 删除对对应的数据
                        // this.houseList[pIdx].children.splice(idx, 1);
                        this.getHouseInfo(this.orderId, this.projectId)
                        
                    } else {
                        this.$message(res.msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            /** 根据订单id和楼盘id获取但楼盘户型数据
             ** @param {String} orderId 订单id
             ** @param {String} projectId 楼盘id
             */
            async getHouseInfo(orderId, projectId) {
                try {
                    const { data } = await getHouseTypeInfo(orderId, projectId);
                    const houseData = data.data;
                    if (data.code === 0) {
                        const formatData = Object.keys(houseData).map(ele => {
                            let name = "";
                            this.roomType.forEach(item => {
                                if (item.value === ele) {
                                    name = item.name;
                                }
                            });
                            return {
                                house_type: name,
                                children: houseData[ele]
                            };
                        });
                        this.houseList = formatData;
                    } else {
                        this.$message(data.msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            // 选中新增的户型
            checkHouse(item) {
                item.is_select = item.is_select == 0 ? 1 : 0;
            },
            // 关闭弹窗
            closeDialog() {
                this.dialogVisible = false;
                this.newHouseData = [];
            },
            // 打开弹窗
            async openDialog(projectId) {
                this.projectId = projectId;
                /**
                 * date:2020.5.11
                 * updater:xiejiaxin
                 * description:手动打开弹窗，已经不会再走create函数，如果当时本地缓存失效，则会出现roomType为空，则无法对应上居室的情况，所以需要手动请求一下缓存的方法
                 */
                if (!dataStorage.getStorage("houseBaseInfo")) {
                    // 如果本地存储已经失效了，重新请求一遍
                    try {
                        const options = {
                            type: "19",
                            city_id: this.$route.query.city_id ? this.$route.query.city_id.split(',') : (this.cityInfo.currentCityId ? this.cityInfo.currentCityId.split(',') : ''),
                            order_id: this.$route.query.order_id
                        };
                        // post cityid传数组
                        const { data } = await multiApi(options);
                        if (data.code === 0) {
                            let performInfo = data.data;
                            this.roomType = performInfo.room_type;
                            this.projectStatus = performInfo.project_status;
                            dataStorage.setStorage(
                                "houseBaseInfo",
                                JSON.stringify(performInfo)
                            );
                        } else {
                            this.$message(data.msg);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                // 直接从路由中取值orderId
                this.getHouseInfo(this.$route.query.order_id, projectId);
                this.dialogVisible = true;
            },
            /**
             * 选中户型操作
             * @param {Object} houseList 单户型数据
             */
            houseChoice(houseList) {
                houseList.is_select = houseList.is_select == 1 ? 0 : 1;
            },
            // 保存对比的户型信息
            saveHouseContrastInfo() {
                let options = {
                    order_id: this.orderId,
                    project_id: this.projectId,
                    select_data: [],
                    add_data: []
                };
                // 遍历获取已有户型选中的户型
                this.houseList.forEach(item => {
                    item.children.forEach(ele => {
                        if (ele.is_select == 0) {
                            options.select_data.push(ele);
                        }
                    });
                });
                // 遍历获取新增加的户型（去除未填写完数据的）
                this.newHouseData.forEach(ele => {
                    if (ele.iscomplete) {
                        options.add_data.push(ele);
                    }
                });
                if (options.select_data.length === 0 && options.add_data.length === 0) {
                    this.$message('请至少添加或选择一个楼盘户型');
                    return;
                }
                this.setHouseInfo(options);
                this.dialogVisible = false;
                this.newHouseData = [];
            },
            // 户型数据保存到服务端
            async setHouseInfo(ops) {
                try {
                    const { data: res } = await setHouseConstrastInfo(ops);
                    this.$message(res.msg);
                    if (res.code === 0) {
                        this.$emit("dataUpdate");
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };
</script>

<style lang="less" scoped>

.house-type-wrap{
    /deep/ .el-dialog{
        .el-dialog__body{
            padding: 10px 25px;
        }
        .el-dialog__header{
            padding-top: 30px;
        }
    }
    /deep/ .el-dialog__title{
        font-weight: bold;
        color: #3e4254;
    }

}
.house-is-not-real {
    /deep/ .el-dialog{
        .el-dialog__header{
            padding-bottom: 0;
        }
        .el-dialog__body {
            padding: 0;
            min-height: 220px;
        }
        .el-dialog__footer {
            padding-top: 20px;
        }
        .dialog-body {
            position: relative;
            padding: 0;
            overflow: hidden;
            margin-top: 0;
        }
    }
}
.dialog-body {
    max-height: 280px;
    overflow: auto;
    margin-top: 5px;
    &::-webkit-scrollbar-track
    {
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 5px;
        background-color: #f5f5f5;
    }

    &::-webkit-scrollbar
    {
        width: 10px;
        background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb
    {
        border-radius: 5px;
        box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #ddd;
    }
    .dialog-tab-box {
        height: 70px;
        padding: 0 30px;
        box-sizing: border-box;
        position: absolute;
        background-color: #fff;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        box-shadow:0px 1px 2px 0px rgba(0,0,0,0.1);
    }
    .tab-query {
        box-sizing: border-box;
        & > li {
            float: left;
            width: 92px;
            padding: 26px 0 16px;
            box-sizing: border-box;
            text-align: left;
            font-size: 14px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight: 500;
            color: #3e4254;
            &.active {
                color: #33a1ff;
                font-size: 16px;
                .tab-item {
                    line-height: 22px;
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -4px;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        border-radius: 1px;
                        background-color: #33a1ff;
                    }
                }
            }
            .tab-item {
                display: inline-block;
                position: relative;
                line-height: 20px;
                cursor: pointer;
            }
        }
    }
    .dialog-info-box {
        padding: 70px 30px 0 30px;
        box-sizing: border-box;
        height: 100%;
        max-height: 358px;
        overflow-y: auto;
    }
}
.dialog-body-items {
    &:first-child {
        margin-top: 0;
    }
    h4 {
        font-weight: 700;
        color: #3e4254;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .lists {
        display: flex;
        flex-wrap: wrap;
        .list {
            display: flex;
            flex: 1;
            .list-check {
                position: relative;
                width: 190px;
                border: solid 1px #e6e6e6;
                border-radius: 2px;
                height: 22px;
                line-height: 23px;
                margin-bottom: 10px;
                cursor: pointer;
                span {
                    margin-left: 6px;
                    vertical-align: middle;
                    &:first-child {
                        padding-left: 6px;
                        width: 70px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .hx {
                    font-size: 12px;
                    float: left;
                }
                .hook {
                    position: absolute;
                    right: 9px;
                    top: 4px;
                    height: 12px;
                    width: 12px;
                    display: inline-block;
                    background-image: url("../images/icon-yiyou.png");
                    background-size: 100%;
                }
                &.active {
                    background-color: #33a1ff;
                    border-color: #33a1ff;
                    color: #fff;
                    .hook {
                        background-color: #409eff;
                        color: #fff;
                        border: 1px solid #409eff;
                        background-image: url("../images/icon-xuanz.png");
                    }
                }
            }
        }
    }
    .info-query {
        margin-top: 20px;
        .list {
            .list-check {
                width: 460px;
                .hx-name {
                    float: none;
                    margin-left: 6px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                span {
                    &.hx-info {
                        float: right;
                        width: auto;
                        margin-right: 27px;
                        padding-left: 0;
                        .area {
                            width: auto;
                            padding-left: 0;
                            margin-left: 0;
                        }
                        .price {
                            color: #ff5c47;
                        }
                    }
                }
            }
        }
    }
}
.btn-dialog{
    width: 132px;
    height: 38px;
}
.house-type-header {
    display: flex;
    align-items: center;
    margin: 15px 0;
    .add-btn {
        padding: 6px 10px;
        border: 1px solid #0ad487;
        border-radius: 2px;
        color: #0ad487;
        margin-left: 20px;
        &.is-plain:focus, &.is-plain:hover{
            background-color: #fff;
            color: #0ad487;
            border: 1px solid #0ad487;
        }
    }
}
.add-item {
    display: flex;
    margin-top: 20px;
    .item-panel {
        flex: 1;
        padding: 12px 25px;
        border-radius: 4px;
        background-color: #f4f5f9;
        position: relative;
        overflow: hidden;
        .panel-checked {
            position: absolute;
            top: -20px;
            right: -20px;
            width: 41px;
            height: 41px;
            background: #e6e6e6;
            transform: rotate(45deg);
            &.checked {
                background-color: #33a1ff;
            }
            .iconsuccess_all {
                position: absolute;
                bottom: 0;
                right: 12px;
                color: #fff;
                transform: rotate(-45deg);
            }
        }
        .el-form {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .el-form-item {
                width: 46%;
                margin: 4px 0;
                position: relative;
                &.area::before {
                    content: "㎡";
                    position: absolute;
                    top: 10px;
                    right: -18px;
                }
            }
            /deep/ .el-input__inner{
                height: 30px;
                line-height: 30px;
                border-radius: 0;
            }
        }
    }
}
.delete {
    font-size: 12px;
    color: #ff5c47;
    line-height: 26px;
    margin-left: 6px;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
    &.delete-floor{
        line-height: 124px;
    }
}
</style>