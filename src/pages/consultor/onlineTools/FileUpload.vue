<template>
    <div class="jl-file-upload-wrap">
        <div
            :id="upID"
            class="upload-box"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
// window.mOxie = window.moxie = require('../../static/lib/uploads/moxie.js');
require('../../../../static/lib/uploads/plupload.dev');
export default {
    name: 'JlFileUpload',
    props: {
        // 请求阿里地址返回的数据
        ossData: {
            type: Object,
            default: () => {},
            required: true
        },
        // 允许上传的文件类型
        fileType: {
            type: String,
            default: 'jpg,png,jpeg,gif'
        },
        // 允许上传文件的大小
        fileMaxSize: {
            type: String,
            default: '10mb'
        },
        // 初始化插件写入ID
        upID: {
            type: String,
            default: ''
        },
        // 上传限制个数
        limit: {
            type: Number,
            default: 1
        },
        // 是否上传多个文件
        isMulti: {
            type: Boolean,
            default: false
        },
        // 限制上传尺寸 比如使用[1,1] 宽高比
        ratio: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 是否需要裁剪
        isCropper: {
            type: Boolean,
            default: false
        },
        // 裁剪后图片质量会变大，是否需要压缩
        isCompress: {
            type: Boolean,
            default: false
        },
        // 如需要压缩，压缩至多少（例如500k）如果不传则默认原图片大小
        compressSize: {
            type: String,
            default: ''
        },
        // 是否需要上传进度条
        isProgress: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            uploader: '', // 上传实例化
            upFileURL: '', // 上传成功的路径
            cropperUrl: '', // 裁剪url
            cropperShow: false, // 裁剪弹窗
            cropperStatus: false, // 是否裁剪过
            loading: null, // loading状态
            instantiation: false // 是否实例化过
        };
    },
    mounted() {
        if (this.ossData && !this.instantiation) {
            this.initUpload();
            this.instantiation = true;
        }
    },
    methods: {
        /**
         * 获取图片对象
         * @param {Object} file 图片对象
         */
        getCropperFile(file) {
            // 标记裁剪过了
            this.cropperStatus = true;
            this.$emit('beforeUpdate');
            // 将图片文件加入到上传队列里
            this.uploader.addFile(file);
        },
        /**
         * 关闭弹窗
         * @param {Boolean} para 关闭状态
         */
        getStatus(para) {
            this.cropperShow = para;
        },
        // 实例化上传插件
        initUpload() {
            let that = this;
            // 获取文件的keyName  阿里上传需要
            function getFileKeyName(up, filename) {
                let date = moment().format('YYYYMMDD'); // 当前时间
                let dateTime = moment().format('YYYYMMDDhhmmss'); // 当前时间
                let randomStr = that.getRandomString(4); //  4位随机字符串
                let extensionName = filename
                    ? filename.substr(filename.indexOf('.'))
                    : ''; // 文件扩展名
                let keyName =
                    that.ossData.dir +
                    date +
                    '/' +
                    dateTime +
                    '_' +
                    randomStr +
                    extensionName; // 文件名字
                return keyName;
            }
            that.uploader = new plupload.Uploader({
                multi_selection: this.isMulti, // 禁止多文件上传
                browse_button: that.upID, // 触发文件上传的按钮 id（传入的参数）
                url: that.ossData.host, // 服务器的地址，与提供的阿里云的地址一致
                flash_swf_url: '../../static/lib/uploads/moxie.swf',
                headers: {
                    'Content-Disposition': 'attachment;filename=test.mp4'
                },
                filters: {
                    mime_types: [
                        {
                            title: 'files',
                            extensions: that.fileType // 允许上传的文件类型
                        }
                    ],
                    max_file_size: this.fileMaxSize,
                    // 是否允许选取重复的文件，为true时表示不允许，为false时表示允许
                    prevent_duplicates: true
                },
                init: {
                    // 文件添加到上传队列后
                    FilesAdded: function(up, files) {
                        if (
                            !that.isMulti &&
                            (that.ratio.length > 0 || that.isCropper)
                        ) {
                            let w = parseInt(that.ratio[0]);
                            let h = parseInt(that.ratio[1]);
                            var reader = new FileReader();
                            reader.readAsDataURL(files[0].getNative());
                            reader.onload = function(e) {
                                // 如果需要裁剪 且该张图片还没有裁剪过
                                if (that.isCropper && !that.cropperStatus) {
                                    up.removeFile(files[0].id);
                                    that.cropperUrl = e.target.result;
                                    that.cropperShow = true;
                                } else {
                                    // 将裁剪设置为初始状态
                                    that.cropperStatus = false;
                                    // 不需要裁剪 仅提示
                                    var image = new Image();
                                    image.src = e.target.result;
                                    image.onload = function() {
                                        if (
                                            this.width * h !==
                                            this.height * w
                                        ) {
                                            up.removeFile(files[0].id);
                                            alert(
                                                '尺寸不符，必须上传尺寸为' +
                                                    w +
                                                    ':' +
                                                    h +
                                                    '的文件！'
                                            );
                                        } else {
                                            up.start();
                                        }
                                    };
                                }
                            };
                        } else if (that.limit && up.files.length > that.limit) {
                            // 移除多余文件
                            up.splice(that.limit, files.length - that.limit);
                            alert('最多上传' + that.limit + '个文件!');
                        } else {
                            that.$emit('beforeUpdate');
                            up.start();
                        }
                    },
                    FileUploaded: function(up, file, info) {
                        // file 里可以得到压缩率
                        if (info.status === 203) {
                            alert(
                                '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' +
                                    info.response
                            );
                        } else if (info.status !== 200 && info.status !== 203) {
                            alert(info.respose);
                        }
                    },
                    BeforeUpload: function(up, file) {
                        that.$emit('beforeUpdate');
                        let keyName = getFileKeyName(up, file.name);
                        let newMultipartParams = {
                            key: keyName,
                            policy: that.ossData.policy,
                            OSSAccessKeyId: that.ossData.accessid,
                            success_action_status: 200, // 默认是 204
                            signature: that.ossData.signature
                        };
                        up.setOption({
                            url: that.ossData.host,
                            multipart_params: newMultipartParams
                        });
                        // 获取到上传路径
                        file.upURL = '/' + keyName;
                    },
                    UploadProgress: function (uder, file) {
                        if (that.isProgress) {
                            that.$emit("getProgress", file);
                        }
                    },
                    UploadComplete: function(up, file) {
                        // 上传进度为100%
                        let fileArr = file.map(fileItem => {
                            if (fileItem.percent === 100) {
                                let upFileURlObj = {
                                    upURL: fileItem.upURL,
                                    fileURL:
                                        that.ossData.host + '' + fileItem.upURL,
                                    upID: that.upID,
                                    originName: fileItem.name
                                };
                                return upFileURlObj;
                            }
                        });
                        // 传递给父组件
                        that.$emit('getFileURL', fileArr);
                        // 反复上传时会累加队列，此时最好清空队列
                        up.splice(0, file.length);
                    },
                    // 错误信息
                    Error: function(up, err) {
                        if (err.code === -600) {
                            alert('图片大小不能超过' + that.fileMaxSize);
                        } else if (err.code === -601) {
                            alert('文件类型不正确');
                        } else if (err.code === -602) {
                            alert('已上传过');
                        } else {
                            alert(err);
                        }
                    }
                }
            });
            that.uploader.init();
        },
        /**
         * 创建随机字符串
         * @param num
         * @returns {string}
         */
        getRandomString(num) {
            let chars = [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z'
            ];
            let res = '';
            for (let i = 0; i < num; i++) {
                var id = Math.ceil(Math.random() * 35);
                res += chars[id];
            }
            return res;
        }
    },
    watch: {
        ossData: {
            handler: function (val, oldval) {
                if (val && !this.instantiation) {
                    this.initUpload();
                    this.instantiation = true;
                }
            },
            deep: true
        },
    }
};
</script>

<style scoped>
</style>
