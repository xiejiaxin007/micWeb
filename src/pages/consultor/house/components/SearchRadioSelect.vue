 <!--
    @author: xjx
    @Date: 2019-09-05
    @description:
  -->
<template>
    <div class="custom-search-input">
        <input type="text" :value="value" style="display: none;" />
        <el-select
            v-model="selectModel"
            filterable
            remote
            reserve-keyword
            placeholder
            :popper-append-to-body="isAppend"
            :remote-method="remoteMethod"
            @change="changeOption"
            :loading="loading"
            @focus="focusSelect"
            ref="searchRadioSelect"
        >
            <el-option
                v-for="(item, index) in options"
                @click.native="selectChange(item)"
                :key="'sear-' + index"
                :label="item.text"
                :value="item.id + ''"
                :disabled="item.disabled"
            ></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: "search-radio-select",
    data () {
        return {
            // 所有选项
            options: [],
            //选中项
            selectModel: '',
            // 当前所在行的索引
            thisIndex: 0,
            // 是否在渲染
            mountedFlag: true,
            // 当前选中项
            thisObj: {},
            // loading动画开关
            loading: false,
            // focus触发次数
            focusIndex: 0
        }
    },
    props: {
        // 这个比较特殊，v-model的绑定，不限制输入类型
        value: {
            default: () => {
                return []
            }
        },
        // 已经选中的下拉项数组
        chosenList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 是否将下拉嵌入html的body中
        isAppend: {
            type: Boolean,
            default: false
        },
        // 当前所在操作项
        checkKey: {
            type: String,
            default: ''
        },
        // 当前选中的index
        currentIndex: {
            type: Number,
            default: 0
        },
        // 请求的api类型
        apiInfo: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // 默认选中项
        chosenObj: {
            type: Object,
            default: function () {
                return {
                    id: '',
                    text: ''
                }
            }
        }
    },
    mounted () {
        this.selectModel = ''
        this.selectModel = this.value
        this.thisIndex = this.currentIndex
        // 获取已经关联了的楼栋数组
        this.$nextTick(() => {
            if (this.chosenObj.id) {
                this.options.unshift(this.chosenObj)
            }
            this.mountedFlag = false
        })
    },
    methods: {
         /**
         * 远程搜索
         * @param {String} query 关键字
         * @return {Promise}
         */
        remoteMethod (query) {
            // 修改关键字
            this.apiInfo.params.q = query;
            let chosenArr = [];
            let len = this.chosenList.length;
            for (let i = 0; i < len; i++) {
                if (this.chosenList[i].id) {
                    chosenArr.push(this.chosenList[i].id);
                }
            }
            this.apiInfo.params.exclude = chosenArr
            this.axios.post(this.apiInfo.api, this.apiInfo.params).then(res => {
                if (res.status == 200) {
                    if (res.data.code == 0) {
                        this.loading = false
                        if (Array.isArray(res.data.data.list)) {
                            if (res.data.data.list.length <= 0 && query == '') {
                                let arr = [{ id: '', text: '没有更多数据了', disabled: true }]
                                this.options = arr
                            } else {
                                if (this.chosenObj.id) {
                                    let isHas = res.data.data.list.findIndex((v) => {
                                        return v.id == this.chosenObj.id
                                    })
                                    if (isHas == -1) {
                                        res.data.data.list.unshift(this.chosenObj)
                                    }
                                }
                                this.options = res.data.data.list
                            }
                        } else {
                            let arr = [{ id: '', text: '没有更多数据了', disabled: true }]
                            this.options = arr
                        }
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        /**
         * 下拉框选中事件
         * @param {String} item 选中的下拉对象
         * @return {Promise}
         */
        changeOption (item) {
            this.$emit('changeSelect', this.checkKey)
        },
        // 获取焦点
        focusSelect () {
            this.remoteMethod('')
        },
        // 切换下拉框点击item事件
        selectChange (item) {
            this.$emit('getOption', item)
        }
    },
    watch: {
        selectModel: {
            handler: function (val, oldval) {
                this.$emit('input', this.selectModel)
            },
            deep: true
        },
        value: {
            handler: function (val, oldval) {
                this.selectModel = this.value
            },
            deep: true
        },
        chosenObj: {
            handler: function (val, oldval) {
                if (!this.mountedFlag) {
                    if (this.chosenObj.id) {
                        let isHas = this.options.findIndex((v) => {
                            return v.id == this.chosenObj.id
                        })
                        if (isHas == -1) {
                            this.options.unshift(this.chosenObj)
                        }
                    }
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped>
</style>
