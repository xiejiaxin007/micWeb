<!--
 * @author: kangxue
 * @Date: 2020-08-21 10:04:03
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-13 11:16:02
 * @description: 报备截图上传图片弹窗
-->
<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="dialogVisble"
            @close="cancel"
            :close-on-click-modal="false"
            width="620px"
            center>
            <el-form :model="imgForm"
                :rules="formRules"
                ref="imgForm">
                <el-form-item prop="imgList">
                    <div class="upload-btn-box">
                        <jl-file-upload v-if="imgLimit"
                            class="upload-btn"
                            ref="fileUpload"
                            fileType="jpg,png,jpeg"
                            :fileMaxSize="maxSize"
                            upID="imgUpload"
                            :isMulti="true"
                            :limit="imgLimit"
                            :ossData="ossData"
                            @beforeUpdate="beforeUpdate"
                            @getFileURL="getFileURL">
                            <el-button type="primary">上传附件</el-button>
                        </jl-file-upload>
                        <span class="upload-tips">可上传{{limit}}张图片，仅限jpg，png和jpeg格式，单张不超过10M</span>
                    </div>
                    <!-- 图片展示 -->
                    <ul class="img-list"
                        v-if="imgForm.imgList.length > 0">
                        <li v-for="(item, index) in imgForm.imgList"
                            :key="item.file_path">
                            <div class="img-item-box">
                                <img :src="item.file_path_full"
                                    alt="图片凭证">
                            </div>
                            <div class="img-name"
                                v-if="item.fileName">{{item.fileName}}</div>
                            <i @click="delFile(index)"
                                aria-hidden="true"
                                class="img-del iconfont iconicon-delete"></i>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary"
                    @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import commonApi from '@/api/commonApi';
export default {
    name: 'upload-img-dialog',
    props: {
        // 弹窗标题
        title: {
            type: String,
            default: ''
        },
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 图片限制个数
        limit: {
            type: Number,
            default: 5
        },
        // 图片限制大小
        maxSize: {
            type: String,
            default: '10mb'
        },
        // 图片初始值  为了兼容上传后展示图片，这个数组内部结构是[{file_path: 图片半链接, file_path_full: 图片全链接}]
        imgList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
        },
        // 监听图片获取图片限制数目
        imgList: {
            handler: function() {
                this.imgForm.imgList = this.imgList;
                this.imgLimit = this.limit - this.imgList.length;
            }
        }
    },
    data() {
        // 报备截图图片不能为空
        let fileRequired = (rule, value, callback) => {
            if (this.imgForm.imgList.length === 0) {
                callback(new Error());
            } else {
                callback();
            }
        };
        return {
            // 弹窗展示
            dialogVisble: this.visible,
            // 图片限制长度
            imgLimit: this.limit,
            // 表单
            imgForm: {
                // 图片数组
                imgList: []
            },
            // 表单验证规则
            formRules: {
                imgList: [{ validator: fileRequired, message: '请选择图片' }]
            },
            // oss配置
            ossData: {},
            // 图片预览
            photoIsShow: false,
            // 图片预览的url
            previewUrl: [],
            // 上传的加载
            uploadLoading: '',
            // 重复提交
            isSubmit: false
        };
    },
    mounted() {
        this.getSignCode();
    },
    methods: {
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
        // 上传之前
        beforeUpdate() {
            this.uploadLoading = this.$loading({
                lock: true,
                text: '请求中，请稍后',
                spinner: 'el-icon-loading',
                customClass: 'loading-default-box',
                background: 'rgba(255, 255, 255, 0.8)'
            });
        },
        /**
         * 获取文件
         * @param {String} fileList 文件列表
         * @return
         */
        getFileURL(fileList) {
            // 关闭加载loading
            this.uploadLoading.close();
            // 如果返回文件列表长度为0
            if (fileList.length === 0) {
                this.$message('上传失败,请重新上传');
                return;
            }
            for (var i = 0; i < fileList.length; i++) {
                let obj = {
                    fileName: fileList[i].originName,
                    file_path: fileList[i].upURL,
                    file_path_full: fileList[i].fileURL
                };
                // 判断是否有重复
                if (this.imgForm.imgList.some(item => item.fileName === fileList[i].originName)) {
                    this.$message('无法上传重复的凭证');
                } else {
                    this.imgForm.imgList.push(obj);
                    this.imgLimit--;
                }
            }
        },
        /**
         * 删除文件
         * @param {String} index 文件下标
         * @return
         */
        delFile(index) {
            this.imgLimit++;
            this.imgForm.imgList.splice(index, 1);
        },
        // 操作保存接口后，父组件请求重复校验置为false
        setSubmit() {
            this.isSubmit = false;
        },
        // 关闭弹窗时重置表单
        cancel() {
            this.$emit('close');
        },
        confirm() {
            this.$refs.imgForm.validate(async valid => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    this.$emit('getImgs', this.imgForm.imgList);
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.upload-btn-box {
    padding-bottom: 10px;
    .upload-btn {
        display: inline-block;
        margin-right: 20px;
    }
    .upload-tips {
        color: #888;
    }
}
.img-list {
    height: auto;
    overflow: hidden;
    li {
        position: relative;
        float: left;
        width: 100px;
        height: 100px;
        text-align: center;
        margin-right: 12px;
        margin-bottom: 10px;
        border: 1px solid #eee;
        .img-item-box {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                max-width: 100%;
                max-height: 100%;
            }
        }
        .img-name {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            background: rgba(0, 0, 0, 0.7);
            overflow: hidden;
            color: #fff;
            padding: 0 4px;
            line-height: 26px;
            font-size: 12px;
            word-break: break-all;
        }
        .img-del {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            width: 16px;
            height: 16px;
            line-height: 1;
            cursor: pointer;
        }
    }
}
</style>
