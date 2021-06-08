<template>
    <section class="contrast-madel">
        <el-dialog
            :visible.sync="dialogVisible"
            width="480px"
            class="dialog"
            @close="closeDialog"
            :center="true"
            :show-close="false"
        >
            <div
                slot="title"
                class="dialog-title"
            >
                <h2>请选择你想要加入对比的户型？</h2>
                <div class="dialog-select">
                    <div class="th">
                        切换楼盘
                    </div>
                    <div class="td">
                        <el-select
                            v-model.trim="project_value"
                            filterable
                            @focus="focusProject"
                            remote
                            :disabled="disabledProject"
                            :remote-method="remoteProject"
                            @change="changeProject"
                            :loading="loading"
                            placeholder="请选择楼盘"
                        >
                            <el-option
                                v-for="item in project_options"
                                :key="item.project_id"
                                :label="item.name"
                                :value="item.project_id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div
                class="dialog-body"
                v-if="loupanList.length > 0"
            >
                <div
                    class="dialog-body-items"
                    v-for="(items, index) in loupanList"
                    :key="index"
                >
                    <h4>{{items.name}}</h4>
                    <ul class="list">
                        <li
                            v-for="(itemcut, i) in items.list"
                            :key="i"
                            :data-house_type_id="itemcut.house_type_id"
                            :class="{iscurrent:itemcut.isactive, isContrast:itemcut.is_contrast === 1}"
                            @click="houseChoice(items.list, i)"
                        >
                            <span class="hx">{{itemcut.summary}}</span>
                            <span class="hx">{{itemcut.acreage}}㎡</span>
                            <span class="hx">{{itemcut.status}}</span>
                            <span
                                class="hook"
                                v-if="itemcut.isactive || itemcut.is_contrast === 1"
                            ></span>
                            <span
                                class="end-hook"
                                v-else
                            ></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else>
                <p>当前楼盘暂无户型</p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitQuit"
                    :disabled="isSubmit"
                >确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import PubSub from 'pubsub-js'
    export default {
        name: 'contrastMadel',
        data() {
            return {
                dialogVisible: false, // 弹窗默认隐藏
                loupanList: [], // 户型列表
                project_id: '', // 楼盘id
                house_id_list: [], // 户型id列表
                order_id: '', // 订单id
                isSubmit: true, // 是否提交
                flag: true, // 重复提交
                project_value: '',
                project_options: [],
                disabledProject: true,
                type: '',
                loading: false
            }
        },
        created() {
            this.house_id_list = []
            this.flag = true
        },
        mounted() {
            // 获取楼盘id
            PubSub.subscribe('openContrastModal', (msg, data) => {
                this.getloupanData(data.type, data.id, data.name)
                this.project_id = data.id
                this.type = data.type
            })
            this.order_id = this.$route.query.order_id
        },
        methods: {
            getloupanData(type, id, name) { // 渲染弹窗内容
                // 对比页打开弹窗
                if (type === '2') {
                    this.type = '2';
                    this.dialogVisible = true
                    this.loupanList = []
                    this.project_options = []
                    this.project_value = ''
                    this.disabledProject = false
                } else if (type === '3') {
                    // type 为3 调取新弹窗
                    this.$emit('opneHouseDialog', id, name)
                } else {
                    let _objdata = {
                        order_id: this.order_id,
                        project_id: id,
                        customize: '1'
                    }
                    this.disabledProject = true
                    this.loading = true
                    this.axios.post('/backend-api/bk-map/get-house-detail', _objdata).then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            let obj = {
                                project_id: res.data.data.project_id,
                                name: res.data.data.project_name
                            }
                            let a = []
                            a.push(obj)
                            this.project_options = a
                            this.disabledProject = false
                            this.loading = false
                            this.project_value = res.data.data.project_id
                            this.loupanList = res.data.data.data
                            this.loupanList.forEach((items, index) => {
                                items.list.forEach((item) => {
                                    if (item.house_type_num) {
                                        item.summary = item.summary + item.house_type_num
                                    }
                                })
                            })
                            console.log(this.loupanList, '111')
                            this.dialogVisible = true
                        } else {
                            this.disabledProject = false
                        }
                        
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            focusProject() {
                if (this.project_options.length <= 1) {
                    let getData = {
                        order_id: this.order_id,
                        cityId: this.$route.query.city_id
                    }
                    this.loading = true
                    this.axios.get('/backend-api/select2/select2/get-projects', { params: getData }).then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            if (res.data.data.length > 50) {
                                let a = res.data.data.splice(0, 50)
                                this.project_options = a
                            } else {
                                this.project_options = res.data.data
                            }
                            this.loading = false
                        }
                    })
                } else {
                    this.loading = false
                }
            },
            remoteProject(para) {
                if (para !== '') {
                    let getData = {
                        order_id: this.order_id,
                        cityId: this.$route.query.city_id,
                        projectName: para
                    }
                    this.axios.get('/backend-api/select2/select2/get-projects', { params: getData }).then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            this.project_options = res.data.data
                        }
                    })
                } else {
                    this.project_options = [];
                }
            },
            changeProject() {
                this.house_id_list = []
                this.getloupanData('1', this.project_value)
            },
            // 合并数据
            mergeHouseData() {
                let houseArr = JSON.parse(localStorage.getItem('chooseHouseProjectInfo')) || [];
                this.loupanList.forEach(ele => {
                    ele.list.forEach(item => {
                        if (item.isactive) {
                            houseArr.push({
                                project_id: this.project_value,
                                house_id: item.house_type_id,
                                apartment_type: item.apartment_type
                            })
                        }
                    })
                });
                localStorage.setItem('chooseHouseProjectInfo', JSON.stringify(houseArr));
            },
            submitQuit() { // 提交对比
                this.mergeHouseData();
                this.$emit('updateHouseContrast');
                this.dialogVisible = false
                this.$emit('updateData')
                /* let _data = {
                    order_id: this.order_id,
                    project_id: this.project_value,
                    house_id: this.house_id_list + ''
                }
                // 发送选中户型的个数
                let num = this.house_id_list.length
                // 提交数据到后端
                if (this.flag) {
                    this.flag = false
                    this.axios.post('/backend-api/bk-map/add-contrast', _data).then(res => {
                        if (res.status === 200 && res.data.code === 0) {
                            // 发送选中户型的个数
                            PubSub.publish('addCompare', {
                                num: num,
                                type: true
                            })
                            this.flag = true
                            this.dialogVisible = false
                            // 更新对比页数据
                            if (this.type === '2') {
                                //PubSub.publish('updateHouse', {
                                 // type: true
                                //})
                                this.$emit('updateData')
                                this.$message({
                                    message: '已加入对比，请查看',
                                    type: 'success'
                                })
                            } else {
                                this.$message({
                                    message: '已加入对比，请点击右下角的进入对比查看',
                                    type: 'success'
                                })
                            }
                        } else {
                            this.flag = true
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                } */
            },
            houseChoice(houseList, houseInd) {
                if (houseList[houseInd].is_contrast !== 1) {
                    houseList[houseInd].isactive = !houseList[houseInd].isactive
                    if (houseList[houseInd].isactive && houseList[houseInd].is_contrast === 0) {
                        this.house_id_list.push(houseList[houseInd].house_type_id)
                        this.house_id_list = [...new Set(this.house_id_list)]
                    } else {
                        let ind = this.house_id_list.indexOf(houseList[houseInd].house_type_id)
                        this.house_id_list.splice(ind, 1)
                    }
                }
            },
            closeDialog() {
                this.house_id_list = []
            }
        },
        watch: {
            house_id_list: function (val) {
                if (val.length > 0) {
                    this.isSubmit = false
                } else {
                    this.isSubmit = true
                }
            }
        }
    }
</script>
<style lang="less" scoped>
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
    .list {
        li {
            width: 200px;
            border: solid 1px #e6e6e6;
            border-radius: 3px;
            display: inline-block;
            height: 22px;
            line-height: 22px;
            margin-bottom: 10px;
            position: relative;
            cursor: pointer;
            span {
                margin-left: 4px;
                vertical-align: middle;
                &:first-child {
                    padding-left: 6px;
                    width: 84px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .hx {
                font-size: 12px;
                float: left;
            }
            &:nth-of-type(odd) {
                margin-right: 10px;
            }
            .end-hook {
                display: inline-block;
                height: 12px;
                width: 12px;
                border: solid 1px #e6e6e6;
                border-radius: 50%;
                position: absolute;
                right: 10px;
                top: 5px;
            }
            &.iscurrent {
                background-color: #409eff;
                color: #fff;
                border: 1px solid #409eff;
                .hook {
                    height: 12px;
                    width: 12px;
                    display: inline-block;
                    background-image: url("../images/icon-xuanz.png");
                    background-size: 100%;
                    position: absolute;
                    right: 10px;
                    top: 5px;
                }
            }
            &.isContrast {
                background-color: #e6e6e6;
                color: #3e4254;
                border: 1px solid #e6e6e6;
                font-size: 14px;
                .hook {
                    height: 12px;
                    width: 12px;
                    display: inline-block;
                    background-image: url("../images/icon-yiyou.png");
                    background-size: 100%;
                    position: absolute;
                    right: 10px;
                    top: 5px;
                }
                &:hover {
                    cursor: not-allowed;
                }
            }
        }
    }
}
.dialog-body {
    max-height: 260px;
    overflow: auto;
    margin-top: 5px;
}
.dialog-title {
    h2 {
        font-weight: 700;
        font-size: 18px;
        color: #3e4254;
    }
}
</style>
<style scoped>
.dialog-select {
    padding-right: 15px;
    margin-top: 20px;
    padding-left: 7px;
    overflow: hidden;
}
.dialog-select .th {
    float: left;
    line-height: 40px;
    margin-right: 10px;
    font-size: 12px;
    color: #333;
}
.dialog-select .td {
    overflow: hidden;
}
.dialog-select >>> .el-select {
    width: 340px;
}
.contrast-madel >>> .el-dialog--center .el-dialog__body {
    padding: 20px 0 20px 30px;
    padding-top: 0;
    padding-bottom: 0;
    height: 258px;
}
.contrast-madel >>> .el-dialog__header {
    font-weight: 700;
    padding-top: 30px;
}
.contrast-madel >>> .el-dialog__footer {
    padding: 20px 0;
    box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
}
.contrast-madel .dialog >>> .el-dialog {
    width: 480px !important;
    height: auto;
}
.contrast-madel .jl-hx {
    position: absolute;
    right: 0;
}
</style>
