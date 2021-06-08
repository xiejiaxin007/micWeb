<!--
 * @author: kangxue
 * @Date: 2020-07-16 15:28:57
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-13 16:28:49
 * @description: 上传客诉材料/申诉材料组件  
-->
<template>
    <div>
        <!-- 上传图片 -->
        <div class="upload-btn-box"
            v-if="imgLimit">
            <jl-file-upload class="upload-btn"
                ref="fileUpload"
                fileType="jpg,png,jpeg"
                fileMaxSize="10mb"
                upID="imgUpload"
                :isMulti="true"
                :limit="imgLimit"
                :ossData="ossData"
                @beforeUpdate="beforeUpdate"
                @getFileURL="(fileList) => getFileURL(fileList, 'img')">
                <el-button type="primary">上传附件</el-button>
            </jl-file-upload>
            <span class="upload-tips">选择附件后进行上传，仅限jpg，png和jpeg格式，10M以内，最多10张</span>
        </div>
        <!-- 图片展示 -->
        <ul class="img-list"
            v-if="form.imgList.length > 0">
            <li v-for="(item, index) in form.imgList"
                :key="index">
                <div class="img-item-box">
                    <img :src="item.file_path_full"
                        alt="图片凭证"
                        @click="showPreview(item.file_path_full)">
                </div>
                <div class="img-name"
                    v-if="item.fileName">{{item.fileName}}</div>
                <i @click="delFile('img', index)"
                    class="img-del iconfont iconicon-delete"
                    aria-hidden="true"></i>
            </li>
        </ul>
        <!-- 上传录音 -->
        <div class="upload-btn-box"
            v-if="audioLimit">
            <jl-file-upload class="upload-btn"
                ref="fileUpload"
                fileType="mp3,amr,m4a"
                fileMaxSize="30mb"
                upID="audioUpload"
                :isMulti="true"
                :limit="audioLimit"
                :ossData="ossData"
                @beforeUpdate="beforeUpdate"
                @getFileURL="(fileList) => getFileURL(fileList, 'audio')">
                <el-button type="primary">上传录音</el-button>
            </jl-file-upload>
            <span class="upload-tips">选择附件后进行上传，仅限mp3、amr和m4a格式，30M以内，最多10条</span>
        </div>
        <!-- 音频展示 -->
        <ul class="audio-list"
            v-if="form.audioList.length > 0">
            <li v-for="(item, index) in form.audioList"
                :key="index">
                <audio-play class="audio-item-box"
                    :url="item.file_path_full"></audio-play>
                <div class="audio-del"
                    @click="delFile('audio', index)">删除</div>
            </li>
        </ul>
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="photoIsShow"
            :showViewer="photoIsShow"
            :urlList="previewUrl"
            @closeViewer="closeViewer">
        </jl-image-preview>
    </div>
</template>

<script>
import commonApi from '@/api/commonApi';
import { AudioPlay } from '@/components';
export default {
    name: 'UploadMaterial',
    components: {
        AudioPlay
    },
    props: {
        // 图片初始值
        imgList: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 音频初始值
        audioList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            // 图片限制上传数目
            imgLimit: 10,
            // 音频上传数目
            audioLimit: 10,
            form: {
                // 客诉材料-图片
                imgList: [],
                // 客诉材料-音频
                audioList: []
            },
            // oss配置
            ossData: {},
            // 图片预览
            photoIsShow: false,
            // 图片预览的url
            previewUrl: [],
            // 上传的加载
            uploadLoading: ''
        };
    },
    // 监听，编辑初始化的图片音频展示
    watch: {
        // 监听图片数目获取图片限制数目
        'imgList': {
            handler: function(val) {
                this.form.imgList = this.imgList;
                this.imgLimit = 10 - this.imgList.length;
            }
        },
        // 监听音频数目获取音频限制数目
        'audioList': {
            handler: function(val) {
                this.form.audioList = this.audioList;
                this.audioLimit = 10 - this.audioList.length;
            }
        }
    },
    mounted() {
        this.getSignCode();
    },
    methods: {
        // 获取阿里云上传签名
        async getSignCode() {
            let params = {
                cate: 'complaint'
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
         * @param {String} type 文件类型，img=图片   audio=音频
         * @return
         */
        getFileURL(fileList, type) {
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
                if (type === 'img') {
                    if (this.form.imgList.some(item => item.fileName === fileList[i].originName)) {
                        this.$message('无法上传重复的凭证');
                    } else {
                        this.form.imgList.push(obj);
                        this.imgLimit--;
                    }
                } else if (type === 'audio') {
                    if (this.form.audioList.some(item => item.fileName === fileList[i].originName)) {
                        this.$message('无法上传重复的凭证');
                    } else {
                        this.form.audioList.push(obj);
                        this.audioLimit--;
                    }
                }
            }
            this.$emit('getMaterial', this.form);
        },
        /**
         * 删除文件
         * @param {String} type 文件类型
         * @param {String} index 文件下标
         * @return
         */
        delFile(type, index) {
            if (type === 'img') {
                this.imgLimit++;
                this.form.imgList.splice(index, 1);
            } else if (type === 'audio') {
                this.audioLimit++;
                this.form.audioList.splice(index, 1);
            }
            this.$emit('getMaterial', this.form);
        },
        /**
         * 图片预览
         * @param {String} previewUrl 预览图片url
         * @return
         */
        showPreview(previewUrl) {
            this.photoIsShow = true;
            this.previewUrl = [previewUrl];
        },
        // 关闭大图预览
        closeViewer() {
            this.photoIsShow = false;
            this.previewUrl = [];
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
.audio-list {
    li {
        height: auto;
        overflow: hidden;
        padding-bottom: 8px;
        .audio-item-box {
            float: left;
        }
        .audio-del {
            float: left;
            color: #409eff;
            padding-left: 20px;
            cursor: pointer;
        }
    }
}
</style>
