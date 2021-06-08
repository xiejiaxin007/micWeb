<!--
 * @Name: 编辑自动分组页
 * @Description: 编辑自动分组页
 * @Author: wangshuaixue
 * @Date: 2019-11-11 15:50:36
 -->
<template>
    <div class="edit-auto-group">
        <!--面包屑-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>编辑自动分组页</el-breadcrumb-item>
        </el-breadcrumb >
        <!-- 自动分组配置 -->
        <div class="v-box group-config">
            <div class="hd">
            <h2>编辑自动分组页</h2>
            </div>
            <div class="bd">
                <ul class="s-query">
                    <li class="auto">
                        <div class="th required">名称：</div>
                        <div class="td">
                            <el-input v-model="groupName"></el-input>
                        </div>
                    </li>
                    <li class="auto">
                        <div class="th required key-word">关键词：</div>
                        <div class="td">
                            <div class="key-word-list">
                                <div class="text-hint">请在下方输入关键词，微信名称包含以下关键词的微信好友会自动分组，每组关键词之间是「或」的关系，同组关键词是「且」的关系，同组有多个关键词，中间用逗号隔开，一组最多输入5个关键词，最多输入20组”</div>
                                <div
                                    class="key-word clearfloat"
                                    v-for="(keyWord, index) in keyWordList"
                                    :key="index">
                                    <el-input
                                        v-model="keyWord.value"
                                        @input="keyWordVerify(keyWord.value, index)">
                                    </el-input>
                                    <span
                                        :class="`surplus ${index === 0 ? 'add-btn' : 'edit-btn'}`"
                                        @click="controlKeyWord(index)">
                                        {{index === 0 ? '新增' : '删除'}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="auto">
                        <div class="th required">自动分组：</div>
                        <div class="td">
                            <el-select
                                v-model="autoGroup"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in groupOpts"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <span class="surplus">
                                请选择分组类型，满足条件的微信好友将会自动分到该分组中
                            </span>
                        </div>
                    </li>
                    <li class="auto">
                        <div class="th required">优先级：</div>
                        <div class="td">
                            <jl-number-input
                                :min-val="1"
                                :value="priority"
                                :max-val="100"
                                @input="numInput"/>
                            <span class="surplus">
                                输入1-100纯数字，数字越大优先级越高，优先级高的优先执行
                            </span>
                        </div>
                    </li>
                    <li class="auto">
                        <div class="th required">是否启用：</div>
                        <div class="td">
                            <el-radio
                                v-model="isStartUse"
                                label="1">
                                启用
                            </el-radio>
                            <el-radio
                                v-model="isStartUse"
                                label="2">
                                非启用
                            </el-radio>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-area">
                <el-button
                    type="primary"
                    @click="saveConfig">
                    保存配置
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from './api/editAutoGroup';
    export default {
        name: 'editAutoGroup',
        data() {
            return {
                // 分组名称
                groupName: '',
                // 关键词
                keyWordList: [
                    {
                        value: ''
                    }
                ],
                // 自动分组
                autoGroup: '',
                // 优先级
                priority: '',
                // 是否启用
                isStartUse: '1',
                // 自动分组下拉
                groupOpts: []
            }
        },
        created () {
            // 配置id
            this.configId = this.$route.query.id;
            this.initData();
        },
        methods: {
            // 保存配置数据
            async saveConfig() {
                try {
                    // 必填校验
                    let arr = [];
                    this.keyWordList.forEach((ele, index) => {
                        let eleArr = ele.value.split('，');
                        if (eleArr.length > 0 && eleArr[0] != '') {
                            arr.push(eleArr);
                        }
                    })
                    if (arr.length === 0 || this.groupName === '' || this.autoGroup === '' || this.isStartUse === '' || this.priority === '') {
                        this.$message({
                            message: '选项为必填',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    }
                    let params = {
                        id: this.configId,
                        title: this.groupName,
                        key_words: arr,
                        group_type: this.autoGroup,
                        priority: this.priority,
                        is_open: this.isStartUse
                    };
                    let { data } = await api.autoGroupSave(params);
                    if (data.code === 0) {
                        this.$router.push({path: '/weChatAddressBook/autoGroupConfig'})
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 初始化数据
            async initData() {
                try {
                    let params = {
                        id: this.configId
                    };
                    let { data } = await api.getinitialize(params);
                    if (data.code === 0) {
                        // 分组下拉
                        this.groupOpts = data.data.group_list;
                        // 名称
                        this.groupName = data.data.list.title ? data.data.list.title : '';
                        // 关键词处理
                        let keyList = [];
                        if (data.data.list.key_words && data.data.list.key_words.length > 0) {
                            data.data.list.key_words.forEach((ele, index) => {
                                let obj = {
                                    // 将后台返回的字段中英文逗号替换为中文逗号
                                    value: ele.replace(',', '，')
                                };
                                keyList.push(obj);
                            });
                            this.keyWordList = keyList;
                        }
                        // 自动分组
                        this.autoGroup = data.data.list.group_type ? data.data.list.group_type : '';
                        // 优先级
                        this.priority = data.data.list.priority ? data.data.list.priority : '';
                        // 是否启用
                        this.isStartUse = data.data.list.is_open ? data.data.list.is_open + '' : '1';
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * num输入框赋值
             * @param {String} val 输入的值
             */
            numInput(val) {
                this.priority = val;
            },
            /**
             * 关键字验证 （只能输入4个逗号，包含中英文）
             * @param {String} para 当前输入框内容
             * @param {Number} index 当前输入框索引
             */
            keyWordVerify(para, index) {
                para = para.replace(/,/g, "，");
                this.keyWordList[index].value = para.replace(/,/g, "，");
                let matched = para.match(/，/g) || [];
                // 第5个逗号输入时替换为空
                if (matched.length > 4) {
                    this.keyWordList[index].value = para.replace(/，$/, "");
                }
            },
            /**
             * 新增/删除关键词组
             * @param {Number} para 当前点击的索引
             */
            controlKeyWord(para) {
                // 新增
                if (para === 0) {
                    let obj = {
                        value: ''
                    }
                    if (this.keyWordList.length < 20) {
                        this.keyWordList.push(obj);
                    }
                } else {
                    this.keyWordList.splice(para, 1);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.edit-auto-group {
    padding: 0 20px 30px;
    .group-config{
        .bd{
            .auto{
                float: none;
                .th{
                    width: 140px;
                    &.key-word{
                        line-height: 20px;
                    }
                }
                .text-hint{
                    font-size: 14px;
                    line-height: 20px;
                    margin-bottom: 10px;
                }
                /deep/.el-input{
                    float: left;
                    width: 300px;
                }
                /deep/.el-select{
                    float: left;
                    width: 300px;
                }
                .td{
                    .add-btn{
                        color: #ff5c47;
                    }
                    .edit-btn{
                        color: #33a1ff;
                    }
                    .surplus{
                        float: left;
                        margin-left: 10px;
                        line-height: 40px;
                        cursor: pointer;
                    }
                    .key-word-list{
                        .key-word{
                            margin-bottom: 5px;
                            &:last-child{
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
