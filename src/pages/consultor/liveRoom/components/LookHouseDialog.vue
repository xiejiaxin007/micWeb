<!--
 * @Name: 带看流程介绍
 * @Description: 带看流程介绍组件
 * @Author: xiejiaxin
 * @Date: 2020-02-27
 -->
<template>
<div class="look-house-dialog">
    <el-dialog
        custom-class="live-dialog-wrapper process-detail-wrapper"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="show"
        width="520px"
        :show-close="false"
        center>
        <div
            slot="title"
            class="dialog-header"
        >
            编辑带看楼盘
        </div>
        <div class="dialog-body-box share-form-box">
            <!-- 选择楼盘 -->
            <div class="choose-house">
                <div class="th">添加带看楼盘</div>
                <div class="td">
                    <search-select-radio
                        v-model="lookHouseInput"
                        :isDisabled="houseList.length === 10"
                        placeholder="请选择楼盘"
                        :isSlot="isSlot"
                        :isBlurByChange="isBlurByChange"
                        @getOption="getOption"
                        :apiInfo="houseApi"></search-select-radio>
                </div>
            </div>
            <!-- 楼盘数据 -->
            <div
                v-if="houseList.length > 0"
                class="house-list-box">
                <div
                    v-for="(house, index) in houseList"
                    :key="house.value"
                    class="house-item">
                    <div
                        v-show="houseList.length > 1"
                        class="item-operate">
                        <span
                            @click="delHouse(index, house)"
                            class="operate-btn del-btn">删除</span>
                        <span
                            @click="moveHouse('up', index)"
                            class="operate-btn move-btn"
                            :class="{'is-disabled': index === 0}">上移</span>
                        <span
                            @click="moveHouse('down', index)"
                            class="operate-btn move-btn"
                            :class="{'is-disabled': index === (houseList.length - 1)}">下移</span>
                    </div>
                    <div class="item-house-name">{{index + 1}}、{{house.name}}</div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close('cancel')">取消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import { SearchSelectRadio } from '@/components';
import utilJs from '../js/utils/utils';
import api from '../api/shareMaterialApi';
import { mapState } from 'vuex';
import { commonFun } from '@/assets/js/utils/utils';
import commonApi from '@/api/commonApi';
export default {
    name: "look-process-detail",
    props: {
        // 弹窗展示标志
        show: {
            type: Boolean,
            default: false
        },
        // 请求数据参数
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            // 是否需要失去焦点
            isBlurByChange: false,
            // 记录当前已经选中的楼盘ID数组
            chosenHouseList: [],
            // 带看楼盘选择
            lookHouseInput: '',
            // 远程下拉框的自定义icon
            isSlot: {
                icon: 'svg-search-input'
            },
            // 带看楼盘下拉请求配置
            houseApi: {
                api: commonApi.getHouseOrder,
                params: {
                    q: '',
                    from: 'liveOrder',
                    not_in: []
                }
            },
            // 楼盘列表
            houseList: []
        }
    },
    components: {
        SearchSelectRadio
    },
    computed: {
        ...mapState('liveRoom', ['currentStep', 'draftInfo', 'orderId']),
        ...mapState(['trackCommon'])
    },
    mounted() {
        if (this.show) {
            // 获取楼盘数组
            this.getModuleData();
        }
    },
    methods: {
        // 根据当前步骤条类型请求相应数据
        getModuleData() {
            // 组装请求参数
            let obj = JSON.parse(JSON.stringify(this.params));
            obj.materialsType = '2';
            // 不需要loading
            obj.noLoading = true;
            utilJs.getStepInfo(obj).then((data) => {
                if (data.code === 0 && data.data) {
                    let list = data.data ? data.data.list : {};
                    this.stepData = list;
                    this.houseList = this.stepData ? this.stepData.result : [];
                    // 将默认选好的楼盘ID添加到过滤对象中，第一次下拉时候就应该过滤掉
                    this.houseList.forEach((item, index, arr) => {
                        this.houseApi.params.not_in.push(item.value);
                    });
                }
            });
        },
        // 提交
        async submit() {
            try {
                let projectArr = [];
                this.houseList.forEach((item, index, arr) => {
                    let obj = {
                        project_id: item.value
                    };
                    projectArr.push(obj);
                });
                // 组装保存数组
                let params = {
                    see_project_id: this.params.seeProId,
                    room_id: this.params.roomId,
                    project_arr: projectArr
                };
                let result = await api.updateHouseList(params);
                let {data} = result;
                if (data.code === 0) {
                    // 清空vuex里面的草稿
                    this.draftInfo.processDetail = [];
                    this.draftInfo.summary = [];
                    this.draftInfo.require = {};
                    this.$store.dispatch('liveRoom/set_draft_info', this.draftInfo);
                    // 通知组件更新状态
                    this.$store.dispatch('liveRoom/set_house_list', this.houseList);
                    // 埋点
                    this.doTrack('7212');
                    this.close();
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 关闭弹窗
         * @param {String} type 关闭的类型，如果为cancel，表示点击取消按钮，进行埋点
         */
        close(type) {
            if (type === 'cancel') {
                this.doTrack('7211');
            }
            this.$emit('checkShow', false);
        },
        /**
         * 选择楼盘下拉内容，并新增到楼盘列表中
         * @param {Object} item 选中楼盘数据对象
         */
        getOption(item) {
            this.houseList.push(item);
            // 把选中项加入选中楼盘数组中，请求下拉时候传递给后台
            this.houseApi.params.not_in.push(item.value);
            // 清空输入
            this.lookHouseInput = '';
            this.isBlurByChange = !this.isBlurByChange;
        },
        /**
         * 删除楼盘
         * @param {Number} paraIndex 选中楼盘的索引
         * @param {Object} item 选中楼盘数据对象
         */
        delHouse(paraIndex, item) {
            this.houseList.splice(paraIndex, 1);
            // 把选中的楼盘ID删除
            let isHas = this.houseApi.params.not_in.findIndex((house) => {
                return house === item.value;
            });
            if (isHas !== -1) {
                this.houseApi.params.not_in.splice(isHas, 1);
                this.doTrack('7208');
            }
        },
        /**
         * 统一埋点
         * @param {String} trackId 埋点ID
         */
        doTrack(trackId) {
            // 埋点
            let obj = {
                order_id: this.orderId,
                adviser_id: this.trackCommon.info.login_employee_id,
                tag_type: this.currentStep.materials_type
            };
            commonFun.setTrackNew(trackId, obj);
        },
        /**
         * 移动楼盘
         * @param {String} type 上移下移标志 up：上移，down：下移
         * @param {Number} index 选中楼盘的索引
         */
        moveHouse(type, index) {
            let trackId = '';
            // 第一个上移和最后一个下移，点击无效
            if ((type === 'up' && index === 0) || (type === 'down' && index === this.houseList.length - 1)) {
                return;
            }
            if (type === 'up' && index > 0) {
                this.houseList[index] = this.houseList.splice(index - 1, 1, this.houseList[index])[0];
                trackId = '7206';
            } else if (type === 'down' && index !== this.houseList.length - 1) {
                this.houseList[index] = this.houseList.splice(index + 1, 1, this.houseList[index])[0];
                trackId = '7207';
            }
            this.doTrack(trackId);
        }
    },
    watch: {
        // 监听弹窗开关
        show: {
            handler: function (val, oldval) {
                if (val) {
                    this.getModuleData();
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.process-detail-wrapper{
    height: 100%;
    color: #222;
    /deep/.el-dialog__footer{
        margin-top: 11px;
    }
    .choose-house {
        overflow: hidden;
        .th {
            float: left;
            width: 94px;
            line-height: 38px;
            font-size: 14px;
            color: #222;
        }
        .td {
            overflow: hidden;
            font-size: 14px;
        }
    }
}
/*楼盘列表样式*/
.house-list-box {
    max-height: 298px;
    overflow-y: auto;
    margin-top: 20px;
    border: 1px solid #eee;
    border-radius: 2px;
    .house-item {
        height: 50px;
        line-height: 50px;
        padding: 0 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        &:last-of-type {
            border-bottom: none;
        }
    }
    .item-operate {
        float: right;
        margin-left: 12px;
        padding-top: 15px;
        box-sizing: border-box;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        &>span {
            position: relative;
            padding: 0 6px;
            box-sizing: border-box;
            cursor: pointer;
            &::after {
                content: '';
                position: absolute;
                height: 14px;
                top: 2px;
                right: 0;
                width: 1px;
                background-color: #eee;
            }
            &:last-of-type {
                padding-right: 0;
                &::after {
                    display: none;
                }
            }
            &:first-of-type {
                padding-left: 0;
            }
        }
        .move-btn {
            color: #2776ef;
        }
        .del-btn {
            color: #f64a4a;
        }
        .is-disabled {
            color: #eee;
            cursor: not-allowed;
        }
    }
    .item-house-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #222;
        font-family: PingFangSC-Medium,PingFang SC;
    }
}
</style>
<style lang="less">
.look-house-dialog{
    .process-detail-wrapper{
        .el-dialog__footer{
            margin-top: 11px;
        }
    }
}
</style>
