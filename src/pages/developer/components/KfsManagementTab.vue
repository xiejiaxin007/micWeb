<!--
 * @Name: 开发商管理
 * @Description: 开发商管理
 * @Author: wangxue
 * @Date: 2020-02-05
-->
<template>
    <div class="ksf-management-tab">
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="bd">
                <div class="order-search">
                    <!--查询需求-->
                    <ul class="s-query clearfix">
                        <li>
                            <div class="th">品牌开发商：</div>
                            <div class="td">
                                <el-input
                                    v-model="developerName"
                                    placeholder="请输入内容"
                                >
                                </el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">楼盘名称：</div>
                            <div class="td">
                                <el-input
                                    v-model="projectName"
                                    placeholder="请输入内容"
                                >
                                </el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">楼盘ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="projectId"
                                    placeholder="请输入内容"
                                >
                                </el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">开发商ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="developerId"
                                    placeholder="请输入内容"
                                >
                                </el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">状态：</div>
                            <div class="td">
                                <el-select
                                    v-model="state"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in stateList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">更新时间：</div>
                            <div class="td">
                                <el-date-picker
                                    v-model="updateTime"
                                    clearable
                                    :default-time="['00:00:00', '23:59:59']"
                                    class="form-date-range-box"
                                    type="datetimerange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                >
                                </el-date-picker>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="btn-area">
                    <el-button @click="resetSearch">重置</el-button>
                    <el-button
                        type="primary"
                        @click="searchData(1)"
                    >搜索</el-button>
                </div>
            </div>
        </div>
        <!--表格展示区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="12">
                                <p class="total-num">当前条件下共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="12">
                                <div class="operation-area">
                                    <el-button
                                        type="primary"
                                        @click="downloadTemplate"
                                    >下载模版</el-button>
                                    <el-button
                                        type="primary"
                                        @click="exportFile"
                                    >导出</el-button>
                                    <el-upload
                                        ref="uploadBtn"
                                        class="upload-file"
                                        action
                                        :http-request="beforeUpdata"
                                        :show-file-list="false"
                                    >
                                        <el-button size="primary">批量导入
                                        </el-button>
                                    </el-upload>
                                    <el-button
                                        type="primary"
                                        @click="addModifyKfs('1')"
                                    >新增开发商</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-wrap">
                        <el-table
                            ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="Loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor"
                        >
                            <el-table-column
                                min-width="60"
                                prop="developer_id"
                                label="开发商ID"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="developer_name"
                                label="品牌开发商"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                label="开发商logo"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <img
                                        v-if="scope.row.developer_logo"
                                        :src="scope.row.developer_logo"
                                        alt="开发商logo"
                                        width="50"
                                        @click="zoomImg(scope.row.developer_logo)"
                                    >
                                    <span v-else>无</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="developer_desc"
                                label="开发商概述"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="150"
                                prop="project_name"
                                label="楼盘名称"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="update_datetime"
                                label="更新时间"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="is_delete"
                                label="状态"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.is_delete === '1' ? '正常' : '已删除'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                label="操作"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="medium"
                                        :disabled="scope.row.is_delete==='2'"
                                        @click="addModifyKfs('0', scope.row.developer_id)"
                                    >编辑</el-button>
                                    <el-button
                                        v-if="scope.row.is_delete==='1'"
                                        type="text"
                                        size="medium"
                                        class="delete-txt"
                                        @click="deleteDialogShow(scope.row.developer_id, '1')"
                                    >删除</el-button>
                                    <el-button
                                        v-else
                                        type="text"
                                        size="medium"
                                        @click="deleteDialogShow(scope.row.developer_id, '2')"
                                    >恢复</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                v-if="totalNum-pageSize>0"
                                background
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :current-page.sync="currentPage"
                                @current-change="pageChange"
                                :total="totalNum"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 删除开发商弹窗 -->
        <el-dialog
            title="系统提示"
            :visible.sync="deleteDialog"
            width="30%"
            center
        >
            <span>{{deleteDialogText}}</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="deleteDeveloper"
                >确 定</el-button>
            </span>
        </el-dialog>
        <div
            v-if="imgShow"
            class="img-mask"
            @click="imgShow=false"
        >
            <img
                :src="imgPath"
                width="500"
                alt="图片"
            >
        </div>
    </div>
</template>

<script>
    import developerApi from '../api/developerApi';
    export default {
        name: 'Evaluate',
        data() {
            return {
                // 品牌开发商名称
                developerName: '',
                // 楼盘名称
                projectName: '',
                // 楼盘ID
                projectId: '',
                // 开发商ID
                developerId: '',
                // 状态
                state: '',
                // 状态列表
                stateList: [
                    {
                        id: '1',
                        text: '正常'
                    },
                    {
                        id: '2',
                        text: '已删除'
                    }
                ],
                // 更新时间
                updateTime: '',
                // 当前页面
                currentPage: 1,
                // 数据总数
                totalNum: 0,
                // 表格数据
                tableList: [],
                // 点击删除弹窗
                deleteDialog: false,
                // 弹窗提示内容
                deleteDialogText: '',
                // 操作开发商id
                operationDeveloperId: '',
                // 操作 删除/恢复
                operationIsDelete: '',
                // 搜索loading
                Loading: false,
                // 每页显示数据
                pageSize: 20,
                // 大图是否显示
                imgShow: false,
                // 大图路径
                imgPath: '',
                // 防止重复提交
                flag: true
            };
        },
        mounted() {
            // 获取初始数据
            this.searchData(1);
        },
        methods: {
            /**
             * 点击搜索
             * @param {string} page 页码
             */
            async searchData(page) {
                // 请求接口数据返回结果
                // 防止重复提交
                if (!this.flag) return;
                if (page) {
                    this.currentPage = page;
                }
                this.flag = false;
                try {
                    this.loading = true;
                    let params = {
                        page: this.currentPage,
                        developer_name: this.developerName,
                        developer_id: this.developerId,
                        project_name: this.projectName,
                        project_id: this.projectId,
                        is_delete: this.state,
                        time_min: this.updateTime ? this.updateTime[0] / 1000 : '',
                        time_max: this.updateTime ? this.updateTime[1] / 1000 : ''
                    };
                    let { data } = await developerApi.developerList({params});
                    if (data.code === 0) {
                        this.tableList = data.data.list;
                        this.totalNum = data.data.total_count ? parseInt(data.data.total_count) : '0';
                        this.loading = false;
                        this.flag = true;
                    } else {
                        this.flag = true;
                        this.$message(data.msg);
                        this.loading = false;
                    }
                } catch (err) {
                    this.flag = true;
                    console.log(err);
                }
            },
            // 点击重置
            resetSearch() {
                this.developerName = '';
                this.projectName = '';
                this.developerId = '';
                this.projectId = '';
                this.state = '';
                this.updateTime = '';
                this.searchData(1);
            },
            /**
             * 跳转到增加或编辑页面
             * @param {string} editDeveloperID 开发商id
             * @param {string} isAdd 类型 0编辑/1新增
             */
            addModifyKfs(isAdd, editDeveloperID) {
                // isAdd 1新增页面 0编辑页面
                let query = {
                    operation: isAdd
                };
                if (isAdd === '0') {
                    query.developerId = editDeveloperID;
                }
                this.$router.push({
                    path: '/developer/developerAddModify',
                    query
                });
            },
            /**
             * 点击删除出现确认删除弹窗
             * @param {string} developerId 开发商id
             * @param {string} isDelete 1是删除 2是恢复
             */
            deleteDialogShow(developerId, isDelete) {
                if (isDelete === '1') {
                    this.deleteDialogText = '点击删除即可删除本条数据';
                } else {
                    this.deleteDialogText = '点击恢复即可恢复本条数据';
                }
                this.operationDeveloperId = developerId;
                this.operationIsDelete = isDelete;
                this.deleteDialog = true;
            },
            // 确认删除/恢复数据
            async deleteDeveloper() {
                // 请求数据
                try {
                    let params = {
                        developer_id: this.operationDeveloperId
                    };
                    if (this.operationIsDelete === '1') {
                        // 删除数据
                        const { data: { code, msg } } = await developerApi.delDeveloper(params);
                        if (code === 0) {
                            // 删除成功
                            this.$message(msg);
                            this.searchData();
                        } else if (code === 1002) {
                            // code值为1002 说明此开发商下有订单，不可删除
                            this.$message(msg);
                        } else {
                            this.$message(msg);
                        }
                    } else {
                        // 恢复数据
                        const { data: { code, msg } } = await developerApi.recoveryDeveloper(params);
                        if (code === 0) {
                            // 恢复成功
                            this.$message(msg);
                            this.searchData();
                        } else {
                            this.$message(msg);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                this.deleteDialog = false;
            },
            // 表格翻页
            pageChange() {
                this.searchData();
            },
            /**
             * 点击图片看大图
             * @param {string} path 路径
             */
            zoomImg(path) {
                if (!path) return;
                this.imgPath = path;
                this.imgShow = true;
            },
            // 点击下载模版
            downloadTemplate() {
                window.location.href = 'https://comjia-1.oss-cn-beijing.aliyuncs.com/developer/template/1584590801PhYesSmanagement.xlsx';
            },
            // 导出文件
            async exportFile() {
                // 请求接口数据返回结果
                try {
                    let params = {
                        page: this.currentPage,
                        developer_name: this.developerName,
                        developer_id: this.developerId,
                        project_name: this.projectName,
                        project_id: this.projectId,
                        is_delete: this.state,
                        time_min: this.updateTime ? this.updateTime[0] / 1000 : '',
                        time_max: this.updateTime ? this.updateTime[1] / 1000 : '',
                        export: '1'
                    };
                    let url = '/backend-api/kfs-developer/developer-list?';
                    Object.keys(params).map((item, i) => {
                        if (i !== 0) {
                            url += '&' + item + '=' + params[item];
                        } else {
                            url += item + '=' + params[item];
                        }
                    });
                    window.location.href = url;
                } catch (err) {
                    console.log(err);
                }
            },
            /**
             * 导入文件前校验
             * @param {Object} file 文件
             */
            beforeUpdata(file) {
                // 文件大小限制
                let isLt20M = file.file.size / 1024 / 1024 <= 20;
                let excelfileExtend = '.xlsx、.xls、.csv、.CSV、.XLSX、.XLS'
                let fileExtend = file.file.name
                    .substring(file.file.name.lastIndexOf('.'))
                    .toLowerCase();
                if (excelfileExtend.indexOf(fileExtend) === -1) {
                    this.$message.error(`只能上传${excelfileExtend}格式文件！`);
                    return;
                } else if (!isLt20M) {
                    this.$message.error('文件大小不超过20M！');
                    return;
                }
                // 转换excel文件
                let fileR = new FileReader();
                fileR.readAsDataURL(file.file);
                fileR.onload = () => {
                    let excelBase64Str = fileR.result;
                    this.importExcelFile(excelBase64Str);
                };
            },
            /**
             * 批量导入文件
             * @param {string} excelBase64Str excel数据流
             */
            async importExcelFile(excelBase64Str) {
                excelBase64Str = excelBase64Str.substring(excelBase64Str.indexOf(',') + 1);
                try {
                    let params = {
                        file_data: excelBase64Str
                    };
                    let { data } = await developerApi.importDeveloper(params);
                    if (data.code === 0) {
                        this.$message(data.msg);
                    } else {
                        this.$message.error(data.msg);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #f9f9f9;color: #333;';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.ksf-management-tab {
    .search-wrap {
        padding-top: 20px;
        /deep/.order-search {
            .el-date-editor {
                width: 100%;
                height: 40px;
                box-sizing: border-box;
                .el-range-separator {
                    font-size: 12px;
                }
                .date-tip-logo {
                    display: none;
                }
            }
            .el-range-input {
                background-color: #fff;
                font-size: 12px;
                line-height: 32px;
            }
        }
    }
    .data-stat {
        margin-bottom: 10px;
        .total-num {
            line-height: 40px;
        }
        .operation-area {
            float: right;
            .upload-file {
                display: inline-block;
            }
        }
    }
    .delete-txt {
        color: #f64a4a;
    }
    .pagination {
        text-align: center;
        margin: 25px 0 10px;
    }
    .img-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.8);
        & > img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>
