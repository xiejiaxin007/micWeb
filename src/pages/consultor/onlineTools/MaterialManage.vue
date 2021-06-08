<!--
 * @Name: 带看材料管理页
 * @Description: 线上带看材料管理页
 * @Author: wangxue
 * @Date: 2020-2-23
 -->
<template>
    <div class="material-box">
        <div class="el-row">
            <el-col
                :span="24"
                class="content-main"
            >
                <el-breadcrumb
                    class="bread-crumb-box"
                    separator-class="el-icon-arrow-right"
                >
                    <el-breadcrumb-item>
                        <a href="/">首页</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>线上带看材料管理</el-breadcrumb-item>
                </el-breadcrumb>
                <!--搜索区域-->
                <div class="v-box form-table-box">
                    <div class="hd">
                        <h2>线上带看材料管理</h2>
                    </div>
                    <div class="bd">
                        <div class="order-search">
                            <!--查询需求-->
                            <ul class="s-query">
                                <li>
                                    <div class="th">城市：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="cityId"
                                            filterable
                                            placeholder="请选择"
                                            @change="getAreaList"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in cityList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">材料分类：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="materialClass"
                                            filterable
                                            placeholder="请选择"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in materialClassList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">楼盘：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="projectId"
                                            filterable
                                            remote
                                            :remote-method="getProjectList"
                                            placeholder="请选择"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in projectList"
                                                :key="item.project_id"
                                                :label="item.name"
                                                :value="item.project_id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">区域：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="areaId"
                                            filterable
                                            placeholder="请选择"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in areaList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <div class="th">标题：</div>
                                    <div class="td">
                                        <el-input
                                            type="text"
                                            v-model="title"
                                            clearable
                                        ></el-input>
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
                                <li>
                                    <div class="th">创建人：</div>
                                    <div class="td">
                                        <el-select
                                            v-model="founder"
                                            filterable
                                            placeholder="请选择"
                                            remote
                                            :remote-method="getFounderList"
                                            clearable
                                        >
                                            <el-option
                                                v-for="item in founderList"
                                                :key="item.id"
                                                :label="item.text"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="btn-area">
                            <el-button @click="resetSearch">重置</el-button>
                            <el-button
                                type="primary"
                                @click="doSearch(1)"
                            >搜索</el-button>
                        </div>
                    </div>
                </div>
                <!--表格展示区域-->
                <div class="v-box form-table-box wx-list-table">
                    <div class="bd">
                        <div class="search-result">
                            <div class="data-stat">
                                <el-row>
                                    <el-col :span="10">
                                        共有{{total}}条材料
                                    </el-col>
                                    <el-col :span="14">
                                        <el-button
                                            type="primary"
                                            class="add-material"
                                            @click="operation('0')"
                                        >新增材料</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="table-wrap-box">
                                <el-table
                                    ref="tableFixedWrap"
                                    border
                                    :data="tableList"
                                    v-loading="tbLoading"
                                    size="small"
                                    row-class-name="row"
                                    cell-class-name="column"
                                    :highlight-current-row="true"
                                    :header-cell-style="tableHeaderColor"
                                >
                                    <el-table-column
                                        min-width="60"
                                        prop="id"
                                        label="编号"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="100"
                                        prop="city_name"
                                        label="城市"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="100"
                                        prop="object_type_name"
                                        label="材料分类"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="title"
                                        label="标题"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="120"
                                        prop="district_name"
                                        label="区域"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="project_name"
                                        label="楼盘"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="150"
                                        prop="update_datetime"
                                        label="更新时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="100"
                                        prop="creator"
                                        label="创建人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        min-width="120"
                                        prop="operate"
                                        label="操作"
                                    >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="text"
                                                size="medium"
                                                @click="operation(scope.row.id)"
                                            >编辑</el-button>
                                            <el-button
                                                v-if="scope.row.object_type !== '6'"
                                                type="text"
                                                size="medium"
                                                @click="downLoad(scope.row)"
                                            >下载</el-button>
                                            <el-button
                                                type="text"
                                                size="medium"
                                                @click="deleteDialogShow(scope.row.id)"
                                            >删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="pagination">
                                <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    :page-size="pageLimit"
                                    hide-on-single-page
                                    :current-page.sync="page"
                                    @current-change="pageChange"
                                    :total="total"
                                >
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </div>
        <!-- 删除弹窗 -->
        <el-dialog
            :visible.sync="deleteDialog"
            width="400px"
            center
        >
            <span>是否要删除带看材料？</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="deleteConfirm"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getAllCityNew, getProjectListPublic, getAllEmployee } from '@/api/commonApi';
    import onlineToolsApi from './api/onlineToolsApi';
    import commonApi2 from '@/api/manualReview/photonAudit';
    export default {
        name: 'material',
        data() {
            return {
                // 城市
                cityId: '',
                // 城市列表
                cityList: [],
                // 材料分类
                materialClass: '',
                // 材料分类列表
                materialClassList: [
                    {
                        text: '公司介绍',
                        id: '2'
                    },
                    {
                        text: '市场介绍',
                        id: '3'
                    },
                    {
                        text: '区域介绍',
                        id: '4'
                    },
                    {
                        text: '楼盘介绍',
                        id: '5'
                    },
                    {
                        text: '视频材料',
                        id: '6'
                    }
                ],
                // 楼盘
                projectId: '',
                // 楼盘列表
                projectList: [],
                // 区域
                areaId: '',
                // 区域列表
                areaList: [],
                // 标题
                title: '',
                // 更新时间
                updateTime: '',
                // 创建人
                founder: '',
                // 创建人列表
                founderList: [],
                // 表格总条数
                total: 0,
                // 表格数据
                tableList: [],
                // 当前页数
                page: 1,
                // 每页数据条数
                pageLimit: 20,
                // 表格加载loading
                tbLoading: false,
                // 删除弹窗
                deleteDialog: false,
                // 要删除的材料id
                delId: ''
            };
        },
        created() {
            // 获取城市下拉
            this.getCityList();
            // 获取楼盘下拉
            this.getProjectList();
            // 获取创建人下拉
            this.getFounderList();
            this.doSearch(1);
        },
        methods: {
            /**
             * @description: 点击删除出现删除弹窗
             * @param {String} id 材料ID
             * @return
             */
            deleteDialogShow(id) {
                this.deleteDialog = true;
                this.delId = id;
            },
            // 确定删除
            async deleteConfirm () {
                let params = {
                    id: this.delId
                };
                try {
                    let { data } = await onlineToolsApi.delMaterial(params);
                    if (data.code === 0) {
                        this.$message(data.msg);
                        this.deleteDialog = false;
                        this.doSearch(this.page);
                    } else {
                        this.$message(data.msg);
                        this.deleteDialog = false;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取城市下拉
            async getCityList() {
                try {
                    let { data } = await getAllCityNew();
                    if (data.code === 0) {
                        this.cityList = data.data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取楼盘下拉
            async getProjectList(q) {
                let params = {
                    q: q,
                    city_id: '',
                    for: 'frontend'
                };
                try {
                    let { data } = await getProjectListPublic(params);
                    if (data.code === 0) {
                        this.projectList = data.data.list;
                    } else {
                        this.$message(data.msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取区域下拉
            async getAreaList() {
                let params = {
                    city_id: this.cityId,
                    status: 1
                };
                try {
                    let { data } = await commonApi2.getDistrictInfoData(params);
                    if (data.code === 0) {
                        this.areaList = data.data;
                        this.areaId = '';
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * @description: 获取创建人下拉
             * @param {String} q 搜索内容
             * @return: Promise
             */
            async getFounderList(q) {
                let params = {
                    q
                };
                try {
                    const { data } = await getAllEmployee(params);
                    if (data.code === 0) {
                        this.founderList = data.data;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 重置搜索项
            resetSearch() {
                // 重置form表单
                this.cityId = '';
                this.materialClass = '';
                this.projectId = '';
                this.areaId = '';
                this.title = '';
                this.updateTime = '';
                this.founder = '';
                // 重新请求
                this.doSearch(1);
            },
            /**
             * 点击搜索进行数据筛选
             * @param {Number} pagePara 当前点击的第几页
             */
            async doSearch(pagePara) {
                this.page = pagePara;
                // 设置loading
                this.tbLoading = true;
                let params = {
                    page: pagePara,
                    city_id: this.cityId,
                    title: this.title,
                    object_type: this.materialClass,
                    project_id: this.projectId,
                    district_id: this.areaId,
                    update_datetime_start:
                        this.updateTime
                            ? this.updateTime[0] / 1000
                            : '',
                    update_datetime_end:
                        this.updateTime
                            ? this.updateTime[1] / 1000
                            : '',
                    creator: this.founder
                };
                try {
                    let result = await onlineToolsApi.getMaterialList(params);
                    let { data } = result;
                    if (data.code === 0) {
                        // 关闭loading
                        this.tbLoading = false;
                        this.total = parseInt(data.data.total_num);
                        this.tableList = data.data.list;
                    } else {
                        // 关闭loading
                        this.tbLoading = false;
                    }
                } catch (error) {
                    console.log(error);
                    // 关闭loading
                    this.tbLoading = false;
                }
            },
            /**
             * 点击编辑/新增
             * @param {Object} id 材料id
             */
            operation(id) {
                this.$router.push({
                    path: '/onlineTools/editOnlineMaterial',
                    query: {
                        id
                    }
                })
            },
            /**
             * 点击下载
             * @param {Object} para 点击的当前行数据对象
             */
            downLoad(para) {
                // let urls = ['https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200617/20200617031442_q7vg.mp4'];
                // let urls = ['https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200617/20200617031442_q7vg.mp4', 'https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200616/20200616063404_uxgx.mp4', 'https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200616/20200616063303_l3ez.mp4']
                // let urls = [
                //     'https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200605/20200605023528_khm5.pptx',
                //     'https://comjia-1.oss-cn-beijing.aliyuncs.com/online_contact_voucher/20200311114115_vljn_1efeba074ed96ae16c40aa4aef82d1b6.pptx'
                // ]
                window.location.href = para.url;
                // for (let i = 0; i < urls.length; i++) {
                //     setTimeout(() => {
                //         // document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
                //         let aLabel = document.createElement('a');
                //         // const aEvent = document.createEvent('MouseEvents'); // 创建鼠标事件对象
                //         // aEvent.initEvent('click', false, false);
                //         aLabel.href = urls[i];
                //         aLabel.download = 'mp4'; // 设置下载文件名，当不需要重新命名时，可以赋值为空字符串
                //         aLabel.target = '_blank';
                //         aLabel.click();
                //         // 同源文件可以不用写这句，如果非同源文件，请一定加上这句话
                //         // 否则每次只会下载其中一个文件就中断其余文件的下载了，控制台报和单个文件中截图的那个警告
                //         // aLabel.target = '_blank';
                //         // aLabel.dispatchEvent(aEvent);
                //     }, 1000 * i)
                // }
                // this.downVideo(urls[0], 'test');

                // let url = "https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200616/20200616063404_uxgx.mp4";
                // // 创建form， 添加所需传的参数
                // var formHtml = "<form id='downLoadForm' style='display:none' method='get' action='https://comjia-1.oss-cn-beijing.aliyuncs.com/onlineTools/20200616/20200616063404_uxgx.mp4'>" +
                // "<input style='display:none;' type='hidden' name='c' value=''>" +
                // "</form>";
                // var divDom = document.createElement("div");
                // divDom.innerHTML = formHtml;
                // document.body.appendChild(divDom);
                // // 下载文件
                // document.getElementById("downLoadForm").submit();
                // // 下载完了，需要删除该form，否则会生成多个form，一个小优化
                // document.body.removeChild(divDom);
            },
            downVideo(url, name) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let blob = this.response;
                        // 转换一个blob链接
                        let u = window.URL.createObjectURL(new Blob([blob],{ type: 'video/mp4' }))
                        let a = document.createElement('a');
                        a.download = name;
                        a.href = u;
                        a.style.display = 'none'
                        document.body.appendChild(a)
                        a.click();
                        a.remove();
                    }
                };
                xhr.send()
            },
            /**
             * 表格翻页
             * @param {Number} page 当前点击的第几页
             */
            pageChange(page) {
                // 分页请求
                this.doSearch(page);
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


<style scoped>
.content-main {
    padding: 0 15px;
}
.form-table-box {
    background-color: #fff;
}
.order-search {
    overflow: hidden;
}
.order-search >>> .el-date-editor,
.order-search >>> .el-select {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}
.order-search >>> .el-select >>> .el-input {
    height: 40px;
}
.order-search >>> .el-range-input {
    background-color: #fff;
    font-size: 12px;
    line-height: 32px;
}
.order-search >>> .el-date-editor .el-range-separator {
    font-size: 12px;
}
.order-search .fixHeight {
    height: 40px;
}
.order-search >>> .el-date-editor .date-tip-logo {
    display: none;
}
.form-table-box .filter-link-more {
    float: right;
    padding: 9px 20px;
    margin-top: 6px;
}
.order-search > .s-query > li .td {
    height: 40px;
}
.s-query > li.long-column {
    width: 360px;
}
.s-query > li.margin-next {
    margin-left: 20px;
}
.form-tip-box {
    color: #999;
}
.form-table-box .batch-btn-area {
    text-align: right;
}
.batch-form-box >>> .el-form-item {
    margin-bottom: 0;
}
.data-stat {
    overflow: hidden;
    padding: 10px 0 10px;
    font-size: 14px;
    line-height: 40px;
}
.data-stat .add-material {
    float: right;
}
</style>
<style lang="less" scoped>
.material-box {
    padding: 0 20px 30px;
}
.wx-list-table {
    /deep/.el-table {
        th {
            .cell {
                font-size: 14px;
                color: #333;
                text-align: center;
                font-weight: normal;
            }
        }
        td {
            .cell {
                font-size: 14px;
                color: #333;
                text-align: center;
                font-weight: normal;
            }
        }
    }
    .pagination {
        text-align: center;
        padding: 20px 0;
        background: #fff;
    }
}
</style>
