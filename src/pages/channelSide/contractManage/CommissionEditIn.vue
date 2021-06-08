<!--
 * @Name: 结佣单据标准录入/编辑页
 * @Description: 结佣单据标准录入页
 * @Author: xiejiaxin
 * @Date: 2020-08-11
 -->
<template>
    <div class="commission-edit-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.query.id ? '结佣单据标准编辑页' : '结佣单据标准录入页'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 内容部分 -->
        <div class="content-box">
            <!-- 非材料表单 -->
            <el-form :model="sigleForm"
                ref="sigleForm"
                label-width="150px"
                class="commission-form">
                <el-form-item label="复制已有单据标准："
                    v-if="!$route.query.id"
                    prop="receiptId">
                    <search-select-radio v-model="sigleForm.receiptId"
                        placeholder="请选择"
                        :isBlurByChange="isBlurByChange"
                        @getOption="changeSelect"
                        :apiInfo="receiptApi"></search-select-radio>
                </el-form-item>
                <el-form-item label="结佣单据标准名称："
                    :rules="{ required: true, message: '请填写结佣单据标准名称', validator: changeInput, trigger: 'blur' }"
                    prop="name">
                    <el-input v-model="sigleForm.name"
                        maxlength="50"></el-input>
                </el-form-item>
            </el-form>
            <!-- 材料表单 -->
            <el-form :model="ruleForm"
                ref="ruleForm"
                label-width="0"
                class="commission-form">
                <div class="materials-box"
                    v-loading="loading">
                    <p class="materials-title">以下哪些材料，结佣时必须提供请勾选</p>
                    <!-- 材料凭证 -->
                    <div class="materials-item"
                        v-for="(formItem, formKey, formIndex) in ruleForm"
                        :key="`formItem-${formIndex}`">
                        <div class="item-title">{{voucherTit[formKey]}}</div>
                        <div class="materials-item-box">
                            <div class="item-content"
                                v-for="(form, index) in formItem"
                                :key="'see-' + index">
                                <div class="item-content-box">
                                    <el-checkbox v-model="form.is_check"
                                        true-label="1"
                                        false-label="2"
                                        :disabled="form.is_change === '2'"
                                        class="report-box">{{form.cat_child_name}}</el-checkbox>
                                    <el-form-item v-if="form.is_check === '1'"
                                        class="form-input-item"
                                        :rules="{ required: true, message: '请填写对应凭证的要求', validator: changeInput, trigger: 'blur' }"
                                        :prop="`${formKey}.${index}.cat_child_desc`">
                                        <el-input type="textarea"
                                            :rows="3"
                                            maxlength="100"
                                            resize="none"
                                            v-model="form.cat_child_desc">
                                        </el-input>
                                    </el-form-item>
                                    <jl-file-upload v-if="form.is_check === '1' && form.file_list && form.file_list.length < 5"
                                        :ref="`uploadImg-${index}`"
                                        fileMaxSize="10mb"
                                        fileType="jpg,png,jpeg"
                                        :limit="imgLimit"
                                        :upID="`commission-report-upload-${formKey}-${index}`"
                                        :ossData="ossData"
                                        @beforeUpdate="loading = true"
                                        @getFileURL="(fileList) => getFileURL(fileList, form.file_list)">
                                        <el-button type="primary">上传图片</el-button>
                                    </jl-file-upload>
                                    <div class="img-list-box"
                                        v-if="form.is_check === '1'">
                                        <a v-for="(item, i) in form.file_list"
                                            :href="`${imgDomain}${item}`"
                                            class="img-item"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :key="item">
                                            <div class="img-box">
                                                <img :src="`${imgDomain}${item}`"
                                                    alt="上传图片">
                                                <img @click.prevent="delImg(form.file_list, i)"
                                                    class="btn-del"
                                                    src="../../../assets/images/delete-icon.png"
                                                    alt="删除按钮">
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="btn-area">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary"
                @click="confirom">确定</el-button>
        </div>
        <!-- 复制弹窗 -->
        <confirm-dialog title="信息"
            content="复制此标准后，此页面会刷新？"
            :visible="copyDialog"
            @cancel="copyDialog = false"
            @confirm="confirmDialog"></confirm-dialog>
    </div>
</template>

<script>
// 标题配置
const voucherTitle = {
    1: '报备凭证',
    2: '带看凭证',
    3: '交易凭证',
    4: '业绩凭证'
};
import commonApi from '@/api/commonApi.js';
import api from './api/api.js';
import { SearchSelectRadio, ConfirmDialog } from '@/components';
export default {
    name: 'commission-edit-in',
    data() {
        return {
            // 失去焦点标志
            isBlurByChange: false,
            // 凭证类型对象
            voucherTit: voucherTitle,
            // 复制弹窗
            copyDialog: false,
            // 顶部form表单
            sigleForm: {
                // 单据标准
                receiptId: '',
                // 标准名称
                name: ''
            },
            // 单据标准下拉
            receiptApi: {
                api: api.getStandardList,
                params: {
                    q: ''
                }
            },
            // from表单
            ruleForm: {},
            // 上传图片限制
            imgLimit: 5,
            // oss上传配置
            ossData: {},
            // 上传loading
            loading: false,
            // 重复提交标志
            isSubmiting: false,
            // oss域名
            imgDomain: ''
        };
    },
    components: {
        SearchSelectRadio,
        ConfirmDialog
    },
    mounted() {
        // 默认请求oss上传配置
        this.getSignCode();
        // 数据请求
        this.getData();
        // 动态修改title
        if (this.$route.query.id) {
            document.title = '结佣单据标准编辑页';
        } else {
            document.title = '结佣单据标准录入页';
        }
    },
    methods: {
        /**
         * 获取输入内容改变方法
         * @param {Object} rule 校验规则
         * @param {string} value 值
         * @param {Funcion} callback 回调函数
         */
        changeInput(rule, value, callback) {
            if (value && value.replace(/\s+/g, '')) {
                callback()
            } else {
                callback(new Error('请填写对应凭证的要求'));
            }
        },
        /**
         * 初始化数据
         * @param {String} type get--根据id复制
         * @param {String} id 单据ID
         * @return {Promise}
         */
        async getData(type, id) {
            try {
                this.loading = true;
                let currentApi = null;
                let params = {};
                // url上面有id，代表当前是编辑页面
                if (this.$route.query.id) {
                    currentApi = api.getStandardInfo;
                    params.bill_id = this.$route.query.id;
                } else if (type === 'get') {
                    currentApi = api.getStandardInfo;
                    params.bill_id = id;
                } else {
                    currentApi = api.initStandard;
                }
                const {
                    data: { code, msg, data }
                } = await currentApi(params);
                if (code === 0) {
                    // 材料表单赋值
                    this.ruleForm = data.list
                    if (type !== 'get') {
                        this.sigleForm.name = data.bill_name;
                    } else {
                        this.sigleForm.name = this.nativeName;
                    }
                    // oss域名赋值
                    this.imgDomain = data.img_domain;
                } else {
                    this.$message({
                        message: msg,
                        type: 'warning'
                    });
                }
                this.loading = false;
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        // 修改了复制下拉选中值
        changeSelect(item) {
            // 保存当前下拉里面的名称，如果接口里面没有返回，则赋值为这个名称
            this.nativeName = item.text;
            this.isBlurByChange = !this.isBlurByChange;
            this.copyDialog = true;
        },
        // 复制弹窗确认按钮
        confirmDialog() {
            this.copyDialog = false;
            this.getData('get', this.sigleForm.receiptId);
        },
        /**
         * 提交表单
         * @param {String} type 表达类型 sigleForm-顶部表单 ruleForm-材料
         * @return {Promise}
         */
        sumbitForm(type) {
            let p = new Promise((resolve, reject) => {
                this.$refs[type].validate(valid => {
                    if (valid) {
                        resolve(true);
                    } else {
                        reject();
                    }
                });
            });
            return p;
        },
        // 提交
        async confirom() {
            try {
                const sigleRes = await this.sumbitForm('sigleForm');
                const ruleRes = await this.sumbitForm('ruleForm');
                if (sigleRes && ruleRes) {
                    // 校验成功
                    this.saveData();
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 保存数据
        async saveData() {
            // 防止重复提交
            if (!this.isSubmiting) {
                this.isSubmiting = true;
            }
            try {
                let currentApi = null;
                let params = {
                    bill_name: this.sigleForm.name,
                    list: this.ruleForm
                };
                // url上面有id，代表当前是编辑页面
                if (this.$route.query.id) {
                    currentApi = api.updateStandard;
                    params.id = this.$route.query.id;
                } else {
                    currentApi = api.createStandard;
                }
                const {
                    data: { code, msg }
                } = await currentApi(params);
                if (code === 0) {
                    // 跳转结佣单据管理页面
                    this.$router.push({
                        path: '/contract/commissionList'
                    });
                } else {
                    this.$message({
                        message: msg,
                        type: 'warning'
                    });
                }
                this.isSubmiting = false;
            } catch (error) {
                this.isSubmiting = false;
                console.log(error);
            }
        },
        // 取消
        cancel() {
            // 跳转结佣单据管理页面
            this.$router.push({
                path: '/contract/commissionList'
            });
        },
        // 删除图片
        delImg(list, index) {
            list.splice(index, 1);
        },
        // 获取阿里云上传签名
        async getSignCode() {
            let params = {
                cate: 'commission'
            };
            try {
                let { data } = await commonApi.getSign(params);
                if (data.code === 0) {
                    this.ossData = data.data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 获取文件
         * @param {String} fileList 文件列表
         * @param {Array} list 要加入文件的文件列表
         * @return
         */
        getFileURL(fileList, list) {
            // 关闭加载loading
            this.loading = false;
            // 如果返回文件列表长度为0
            if (fileList.length === 0) {
                this.$message('上传失败,请重新上传');
                return;
            }
            list.push(fileList[0].upURL);
        }
    }
};
</script>
<style lang="less" scoped>
.commission-edit-box {
    padding: 0 20px;
    box-sizing: border-box;
}
.materials-title {
    font-size: 14px;
    color: #606266;
    &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
    }
}
.commission-form {
    /deep/ .el-form-item {
        margin-bottom: 20px;
    }
}
.materials-item {
    .item-title {
        margin: 20px 0 10px;
        font-weight: bold;
        font-size: 14px;
    }
}
.materials-item-box {
    display: flex;
    border: 1px dashed #999;
    padding: 16px;
    box-sizing: border-box;
    .report-box {
        margin-bottom: 10px;
    }
    .item-content {
        flex: 1;
        max-width: 33%;
        margin-right: 20px;
        &:last-of-type {
            margin-right: 0;
        }
    }
    /deep/.jl-file-upload-wrap {
        display: inline-block;
        .el-button {
            padding: 8px 10px;
        }
    }
}
.img-list-box {
    margin-top: 16px;
    .img-box {
        position: relative;
        border: 1px solid #ccc;
        & > img {
            width: 60px;
            height: 60px;
            object-fit: contain;
            &.btn-del {
                position: absolute;
                width: 20px;
                height: 20px;
                top: -8px;
                right: -8px;
                cursor: pointer;
                background-color: #fff;
                border-radius: 50%;
            }
        }
    }
    .img-item {
        display: inline-block;
        margin-right: 16px;
        &:last-of-type {
            margin-right: 0;
        }
    }
}
.btn-area {
    margin: 20px 0;
}
</style>
