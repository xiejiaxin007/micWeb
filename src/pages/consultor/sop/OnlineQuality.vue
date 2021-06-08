<!--
 * @Name: 线上带看质检
 * @author: wangshuaixue
 * @Date: 2020-02-26 19:24:18
 * @description:线上带看质检sop
 -->
 <template>
    <div class="online-quality-box">
        <!--面包屑导航-->
        <el-breadcrumb
            class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>线上带看质检</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索区域-->
        <div class="v-box form-table-box search-wrap">
            <div class="bd">
                <div class="order-search">
                    <!--搜索条件-->
                    <ul class="s-query clearfix">
                        <li>
                            <div class="th">订单ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="orderId"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">带看ID：</div>
                            <div class="td">
                                <el-input
                                    v-model="seeId"
                                    placeholder="请输入内容"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="th">带看咨询师：</div>
                            <div class="td">
                                <el-autocomplete
                                    v-model="employee.text"
                                    :fetch-suggestions="searchEmployee"
                                    placeholder="请输入名字搜索"
                                    @select="((qs)=>{affirmEmpl(qs, 1)})"
                                ></el-autocomplete>
                            </div>
                        </li>
                        <li>
                            <div class="th">sop标签：</div>
                            <div class="td">
                                <el-select
                                    v-model="sopTag"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in sopList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">城市：</div>
                            <div class="td">
                                <el-select
                                    v-model="cityId"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in cityList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <div class="th">操作人：</div>
                            <div class="td">
                                <el-autocomplete
                                    v-model="operator.text"
                                    :fetch-suggestions="searchEmployee"
                                    placeholder="请输入名字搜索"
                                    @select="((qs)=>{affirmEmpl(qs, 2)})"
                                ></el-autocomplete>
                            </div>
                        </li>
                        <li class="time-warp">
                            <div class="th">带看时间：</div>
                            <div class="td">
                                <el-date-picker
                                    v-model="seeTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </li>
                         <li class="time-warp">
                            <div class="th">质检时间：</div>
                            <div class="td">
                                <el-date-picker
                                    v-model="qualityTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="btn-area">
                    <el-button @click="resetSearch">重置</el-button>
                    <el-button
                        type="primary"
                        @click="searchData"
                    >搜索</el-button>
                </div>
            </div>
        </div>
        <!--表格区域-->
        <div class="v-box form-table-box">
            <div class="bd">
                <div class="search-result">
                    <div class="data-stat">
                        <el-row>
                            <el-col :span="16">
                                <p class="total-num">当前条件下共{{totalNum}}条数据</p>
                            </el-col>
                            <el-col :span="8">
                                <div class="operation-area">
                                    <el-button
                                        type="primary"
                                        @click="uploadTemp"
                                    >下载模板</el-button>
                                    <el-button
                                        type="primary"
                                        class="export-btn"
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
                                        @click="addQualityTag"
                                    >新增标签</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="quality-table-wrap">
                        <el-table
                            ref="tableFixedWrap"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            row-class-name="row"
                            cell-class-name="column"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor">
                            <el-table-column
                                min-width="70"
                                prop="city"
                                label="城市"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="70"
                                prop="order_id"
                                label="订单ID"
                                align="center"
                            >
                            <!-- 订单id可以跳转 -->
                            <template slot-scope="scope">
                                <div class="hint-color">
                                    <a :href="scope.row.order_url" target="_blank">
                                        {{scope.row.order_id}}
                                    </a>
                                </div>
                            </template>
                            </el-table-column>
                            <el-table-column
                                min-width="70"
                                prop="see_project_id"
                                label="带看ID"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="employee_name"
                                label="带看咨询师"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="see_time"
                                label="带看时间"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="see_score"
                                label="带看分数"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="sop_tag"
                                label="SOP标签"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="quality_time"
                                label="质检时间"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                prop="operator"
                                label="操作人"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                min-width="80"
                                label="操作"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        v-if="scope.row.can_del == 1"
                                        type="text"
                                        size="medium"
                                        @click="deleteDialogShow(scope.row.id)"
                                    >删除</el-button>
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
        <!-- 删除弹窗 -->
        <el-dialog
            title="系统提示"
            :visible.sync="deleteDialog"
            width="400px"
            center>
            <span>点击删除即可删除本条数据</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="deleteQualityData"
                >删 除</el-button>
            </span>
        </el-dialog>
        <!-- 新增标签 -->
        <el-dialog
            class="kfs-operation-dialog"
            title="线上带看质检"
            :visible.sync="qualityData.isShow"
            width="520px"
            center
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="resetForm('qualityData')"
        >
            <div class="operation-employee-dialog">
                <el-form
                    ref="qualityData"
                    :model="qualityData"
                    label-width="100px"
                    class="operation-dialog">
                    <el-form-item
                        label="带看ID："
                        prop="seeId"
                        :rules="{required: true, message: '请填写带看ID', trigger: 'blur'}">
                        <jl-number-input
                            reg="number"
                            v-model="qualityData.seeId"
                        ></jl-number-input>
                    </el-form-item>
                    <el-form-item
                        label="带看分数："
                        prop="seeScore"
                    >
                        <jl-number-input
                            :key='1'
                            :maxVal='100'
                            reg="int"
                            v-model="qualityData.seeScore"
                        ></jl-number-input>
                    </el-form-item>
                    <el-form-item
                        label="标签："
                        prop="sopTag"
                        :rules="{required: true, message: '请选择标签', trigger: 'change'}">
                        <el-select
                            v-model="qualityData.sopTag"
                            filterable
                            placeholder="请选择">
                            <el-option
                                v-for="item in sopList"
                                :key="item.id+''"
                                :label="item.text"
                                :value="item.id+''">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="质检时间："
                        prop="time"
                        :rules="{required: true, message: '请选择质检时间', trigger: 'blur'}">
                        <el-date-picker
                            v-model="qualityData.time"
                            type="datetime"
                            :picker-options="pickerOptions"
                            placeholder="选择质检时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="resetForm('qualityData')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('qualityData')"
                >提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import qualityApi from './api/onlineQuality';
export default {
    name: 'online-quality',
    data() {
        return {
            // 质检id
            qualityId: '',
            // 下载模版
            tempUrl: '',
            // 城市id
            cityId: '',
            // 带看id
            seeId: '',
            // 订单id
            orderId: '',
            // 带看时间
            seeTime: '',
            // 质检时间
            qualityTime: '',
            // 带看咨询师
            employee: {
                id: '',
                text: ''
            },
            // sop标签
            sopTag: '',
            // 操作人
            operator: {
                id: '',
                text: ''
            },
            // 当前页面
            currentPage: 1,
            // 是否导出 1是2否
            export: '2',
            // 数据总数
            totalNum: '0',
            // 表格数据
            tableList: [],
            // 点击删除弹窗
            deleteDialog: false,
            // 搜索loading
            loading: false,
            // 每页显示数据
            pageSize: 20,
            // 城市下拉列表
            cityList: [],
            // sop列表
            sopList: [],
            // 新增信息
            qualityData: {
                isShow: false,
                seeId: '',
                seeScore: '',
                sopTag: '',
                time: ''
            },
            // 防止重复提交
            flag: true,
            pickerOptions: { // 质检时间日期选择
                disabledDate (time) {
                return time.getTime() > Date.now()
                }
            }
        };
    },
    mounted() {
        // 获取初始数据
        this.searchData();
        // 获取开发商列表
        this.getConfigData();
    },
    methods: {
        /**
         * 确认员工
         * @param {string} para 确认值
         * @param {string} type 类型 1带看咨询师 2操作人
         */
        affirmEmpl (para, type) {
            console.log(para, type)
            if (type === 1) {
                this.employee.id = para.id;
                this.employee.text = para.text;
            } else if (type === 2) {
                this.operator.id = para.id;
                this.operator.name = para.text;
            }
        },
        /**
         * 请求员工列表
         * @param {string} val 输入内容
         * @param {Object} cb 返回数据
         */
        async searchEmployee (val, cb) {
            console.log(val)
            try {
                let params = {
                    q: val,
                    list: 1
                };
                // 隐藏历史记录模块
                var list = [{}]
                let { data } = await qualityApi.getUserList({params});
                if (data.code === 0) {
                    for (let i of data.data.list) {
                        i.value = i.text; // 将想要展示的数据作为value
                    }
                    list = data.data.list;
                    cb(list);
                } else {
                    let arr = [];
                    cb(arr);
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 下载模板
        uploadTemp () {
            window.open(this.tempUrl, "_blank");
        },
        // 获取配置数据
        async getConfigData () {
            try {
                let { data } = await qualityApi.qualityConfig();
                if (data.code === 0) {
                    this.cityList = data.data.city;
                    this.sopList = data.data.sop_tag;
                    this.tempUrl = data.data.template_download_url;
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 点击搜索
        async searchData() {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            this.flag = false;
            try {
                this.loading = true;
                let params = {
                    order_id: this.orderId,
                    see_project_id: this.seeId,
                    employee_id: this.employee.id,
                    city_id: this.cityId,
                    sop_tag: this.sopTag,
                    operator: this.operator.id,
                    see_time: this.seeTime,
                    see_start_time: this.seeTime.length > 0 ? this.seeTime[0].getTime() / 1000 : '',
                    see_end_time: this.seeTime.length > 0 ? this.seeTime[1].getTime() / 1000 : '',
                    quality_start_time: this.qualityTime.length > 0 ? this.qualityTime[0].getTime() / 1000 : '',
                    quality_end_time: this.qualityTime.length > 0 ? this.qualityTime[1].getTime() / 1000 : '',
                    page: this.currentPage,
                    page_size: this.pageSize,
                    developer_name: this.developerName,
                    is_export: this.export
                };
                let { data } = await qualityApi.initList({params});
                if (data.code === 0) {
                    this.tableList = data.data.list;
                    this.totalNum = data.data.total ? parseInt(data.data.total) : '0';
                    this.loading = false;
                    this.flag = true;
                } else {
                    this.loading = false;
                    this.$message(data.msg);
                    this.flag = true;
                }
            } catch (err) {
                this.loading = false;
                console.log(err);
                this.flag = true;
            }
        },
        // 点击重置
        resetSearch() {
            this.cityId = '';
            this.orderId = '';
            this.seeId = '';
            this.employee.id = '';
            this.employee.text = '';
            this.sopTag = '';
            this.operator.id = '';
            this.operator.text = '';
            this.seeTime = [];
            this.qualityTime = [];
            this.currentPage = 1;
            this.searchData();
        },
        // 新增质检弹窗
        addQualityTag() {
            this.qualityData.isShow = true;
            this.qualityData.seeId = '';
            this.qualityData.seeScore = '';
            this.qualityData.sopTag = '';
            this.qualityData.time = '';
        },
        /**
         * 提交按钮 增加质检
         * @param {Object} formName 表单数据
         */
        async submitForm(formName) {
            // 防止重复提交
            if (!this.flag) return;
            this.flag = false;
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    try {
                        let params = {
                            see_project_id: this.qualityData.seeId,
                            see_score: this.qualityData.seeScore,
                            sop_tag: this.qualityData.sopTag,
                            quality_time: this.qualityData ? this.qualityData.time.getTime() / 1000 : ''
                        };
                        const {
                            data: { code, msg }
                        } = await qualityApi.addQuality(params);
                        if (code === 0) {
                            this.$message({
                                message: msg,
                                duration: 2000,
                                type: 'success'
                            });
                            this.qualityData.isShow = false;
                            this.flag = true;
                            this.searchData()
                        } else {
                            this.$message({
                                message: msg,
                                duration: 2000,
                                type: 'error'
                            });
                            this.flag = true;
                        }
                    } catch (err) {
                        this.flag = true;
                        console.log(err);
                    }
                } else {
                    this.flag = true;
                    return false;
                }
            });
        },
        /**
         * 重置数据
         * @param {Object} formName 表单数据
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.qualityData.isShow = false;
        },
        /**
         * 点击删除出现确认删除弹窗
         * @param {String} id 质检id
         */
        deleteDialogShow(id) {
            this.qualityId = id;
            this.deleteDialog = true;
        },
        // 确认删除数据
        async deleteQualityData() {
            // 请求数据
            try {
                console.log(this.qualityId)
                let params = {
                    id: this.qualityId
                };
                const {
                    data: { code, msg }
                } = await qualityApi.delQuality({params});
                if (code === 0) {
                    // 删除成功
                    this.$message(msg);
                    this.searchData();
                } else {
                    this.$message(msg);
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
        // 导出文件
        async exportFile() {
            try {
                let params = {
                    order_id: this.orderId,
                    see_project_id: this.seeId,
                    employee_id: this.employee.id,
                    city_id: this.cityId,
                    sop_tag: this.sopTag,
                    operator: this.operator.id,
                    see_time: this.seeTime,
                    see_start_time: this.seeTime.length > 0 ? this.seeTime[0].getTime() / 1000 : '',
                    see_end_time: this.seeTime.length > 0 ? this.seeTime[1].getTime() / 1000 : '',
                    quality_start_time: this.qualityTime.length > 0 ? this.qualityTime[0].getTime() / 1000 : '',
                    quality_end_time: this.qualityTime.length > 0 ? this.qualityTime[1].getTime() / 1000 : '',
                    page: this.currentPage,
                    page_size: this.pageSize,
                    developer_name: this.developerName,
                    is_export: '1'
                };
                let url = '/backend-api/online-see-quality/list?';
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
            let excelfileExtend = '.xlsx、.XLSX'
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
                let { data } = await qualityApi.batchImport(params);
                if (data.code === 0) {
                    this.$message(data.msg);
                    this.searchData();
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
                return 'background-color: #f9f9f9; color: #333; font-size: 14px;';
            }
        }
    }
};
</script>

<style lang="less" scoped>
.online-quality-box {
    padding: 0 15px;
    /deep/.el-range-input {
        background-color: transparent;
    }
    .quality-table-wrap {
        overflow-x: scroll;
        .hint-color a{
            color: #409EFF;
        }
    }
    .s-query {
        >li {
            width: 260px;
        }
        .th {
            width: 90px;
        }
        .time-warp {
            width: auto;
        }
    }
    .search-wrap {
        padding-top: 20px;
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
            .export-btn {
                margin-left: 2px;
            }
        }
    }
    .pagination {
        text-align: center;
        margin: 25px 0 10px;
    }
    .el-select {
        width: 100%;
    }
    .mobile-input {
        width: 250px;
    }
    /deep/.kfs-operation-dialog {
        .el-dialog {
            overflow: hidden;
        }
    }
}
</style>
