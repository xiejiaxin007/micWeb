<!--
 * @Name: 微信好友自动分组配置页
 * @Description: 微信好友自动分组配置页
 * @Author: wangshuaixue
 * @Date: 2019-11-11 15:50:36
 -->
<template>
    <div class="auto-group-wrap">
        <!--面包屑-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>微信好友自动分组配置页</el-breadcrumb-item>
        </el-breadcrumb >
        <div class="v-box group-config">
            <div class="hd">
            <h2>微信好友自动分组配置页</h2>
            </div>
            <div class="bd">
                <div class="add-config">
                    <el-button
                        type="primary"
                        @click="skipEdit(0)"
                        v-show="total < 11">
                        +新增自动分组配置
                    </el-button>
                </div>
                <el-table
                    v-loading="loading"
                    border
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        label="编号"
                        width="80">
                        <template slot-scope="scope">
                            <div v-if="scope.$index !== 0">
                                {{scope.$index}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="group_name"
                        label="名称"
                        min-width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-input
                                    v-model="params.groupName"
                                    size="mini"
                                    @blur=searchGroupList
                                    placeholder="输入名称搜索"/>
                            </div>
                            <div v-else>{{scope.row.group_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="key_word"
                        label="关键词"
                        min-width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-input
                                    v-model="params.keyWord"
                                    size="mini"
                                    @blur=searchGroupList
                                    placeholder="输入关键词搜索"/>
                            </div>
                            <div v-else>
                                <div
                                    v-for="(word, index) in scope.row.key_word" 
                                    :key=index>
                                    {{word}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="group"
                        label="自动分组"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-select
                                    @change="searchGroupList"
                                    v-model="params.autoGroup"
                                    placeholder="请选择"
                                    size="mini">
                                    <el-option
                                        v-for="item in groupOpts"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>{{scope.row.group}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="is_open"
                        label="是否启用"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-select
                                    @change="searchGroupList"
                                    v-model="params.isOpen"
                                    placeholder="请选择"
                                    size="mini">
                                    <el-option
                                        v-for="item in openOpts"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>{{scope.row.is_open == 1 ? '启用' : '停用'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="priority"
                        label="优先级"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-input
                                    v-model="params.priority"
                                    size="mini"
                                    @blur=searchGroupList
                                    placeholder="输入优先级搜索"/>
                            </div>
                            <div v-else>{{scope.row.priority}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="create_time"
                        label="创建时间"
                        min-width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.$index !== 0">
                                {{scope.row.create_time}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="creator"
                        label="创建人"
                        min-width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.$index === 0">
                                <el-autocomplete
                                    v-model="params.creator"
                                    :fetch-suggestions="searchCreator"
                                    placeholder="输入创建人搜索"
                                    @blur=searchGroupList
                                    size="mini"
                                ></el-autocomplete>
                            </div>
                            <div v-else>{{scope.row.creator}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="update_auth"
                        label="编辑"
                        min-width="100">
                        <template slot-scope="scope">
                            <div
                                class="edit-color"
                                v-if="scope.$index !== 0">
                                <span
                                    @click="skipEdit(scope.row.id)"
                                    v-if="scope.row.update_auth">
                                    编辑
                                </span>
                                <span @click="editDialog(scope.row)">
                                    {{scope.row.is_open == 1 ? '停用' : '启用'}}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 停启弹窗 -->
        <el-dialog
            class="start-dialog"
            :visible.sync="dialogStatus"
            width="400px">
            <span
                slot="title"
                class="dialog-header">
                {{openStatus.state == '1' ? '停用' : '启用'}}自动分组
            </span>
            <!-- 停用 -->
            <span v-if="openStatus.state == '1'">
                您确认要将{{openStatus.name}}的自动分组配置为停用吗？停用后，本条策略不再生效，不会对咨询师的微信好友进行自动分组；
            </span>
            <span v-else>
                您确认要将{{openStatus.name}}的自动分组配置为启用吗？启用后，本条策略将生效，会对咨询师的微信好友进行自动分组；
            </span>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="dialogStatus = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confrim">
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import commonApi from '@/api/commonApi';
import api from './api/autoGroupConfig';
export default {
    name: 'autoGroupConfig',
    data() {
        return {
            // 未筛选时总条数
            total: 0,
            // 第一次请求标识
            firstFlag: true,
            // 加载
            loading: false,
            // 弹窗状态
            dialogStatus: false,
            // 弹窗中是否要启动
            openStatus: {},
            // 启用/停用数据
            statusData: {},
            // 页面初始化请求参数
            params: {
                // 名称
                groupName: '',
                // 关键词
                keyWord: '',
                // 自动分组
                autoGroup: '',
                // 是否启用
                isOpen: '',
                // 优先级
                priority: '',
                // 创建人
                creator: ''
            },
            // 自动分组筛选项
            groupOpts: [],
            // 停启下拉
            openOpts: [],
            // 表格数据
            tableData: []
        }
    },
    created () {
        // 初始化请求数据
        this.searchGroupList();
    },
    methods: {
        /**
         * 跳转编辑分组页
         * @param {String} configId 配置id
         */
        skipEdit(configId) {
            let routeData = this.$router.resolve({ path: '/weChatAddressBook/editAutoGroup', query: {id: configId} });
            window.open(routeData.href, '_blank');
        },
        // 弹窗点击确认
        async confrim() {
            this.dialogStatus = false;
            try {
                let params = {
                    is_open: this.openStatus.state == 1 ? '2' : '1',
                    id: this.openStatus.configId
                };
                let { data } = await api.groupStartEnd(params);
                if (data.code === 0) {
                    // 更新状态成功后更新表格
                    this.searchGroupList();
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 编辑停用/启用
         * @param {Object} para 表格当前行数据
         */
        async editDialog(para) {
            // 当前点击停用还是启用
            this.openStatus = {
                state: para.is_open,
                name: para.group_name,
                configId: para.id
            };
            this.dialogStatus = true;
        },
        /**
         * 搜索关键词组
         * @param {String} val 输入内容
         * @param {Object} cb 返回列表内容
         */
        async searchCreator(val, cb) {
            try {
                if (val) {
                    let list = [{}];
                    let params = {
                        q: val
                    };
                    let { data } = await commonApi.getPageEmployee(params);
                    if (data.code === 0) {
                        for (let i of data.data.list) {
                            i.value = i.text; // 将想要展示的数据作为value
                        }
                        list = data.data.list;
                        cb(list);
                    }
                } else {
                    let list = [];
                    cb(list);
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 搜索配置页列表数据
        async searchGroupList() {
            try {
                this.loading = true;
                let params = {
                    group_name: this.params.groupName,
                    key_word: this.params.keyWord,
                    group: this.params.autoGroup,
                    priority: this.params.priority,
                    creator: this.params.creator,
                    is_open: this.params.isOpen
                };
                let { data } = await api.getAutoGroupList(params);
                if (data.code === 0) {
                    // 赋值表格数据
                    this.tableData = data.data.list ? data.data.list : [];
                    // 添加一行空内容用来处理搜索项
                    this.tableData.unshift({})
                    // 是否启用下拉
                    this.openOpts = data.data.open_list ? data.data.open_list : [];
                    // 自动分组下拉
                    this.groupOpts = data.data.group_list ? data.data.group_list : [];
                    // 处理总条数
                    if (this.firstFlag) {
                        this.firstFlag = false;
                        this.total = this.tableData.length;
                    }
                }
                // 关闭loading
                this.loading = false;
            } catch (error) {
                console.log(error);
                // 关闭loading
                this.loading = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.auto-group-wrap {
    padding: 0 20px 30px;
    /deep/.start-dialog{
        .el-dialog__header{
            text-align: center;
            span{
                font-size: 18px;
            }
            .el-dialog__headerbtn{
                display: none;
            }
        }
        .el-dialog__body{
            padding: 20px 20px;
        }
        .el-dialog__footer{
            text-align: center;
        }
    }
    /deep/.el-table{
        th, td{
            text-align: center;
        }
        .edit-color{
            cursor: pointer;
            color: #409eff;
        }
    }
    .add-config{
        text-align: right;
        margin-bottom: 10px;
    }
}

</style>
