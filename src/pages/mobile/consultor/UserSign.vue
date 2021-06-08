<!--
    @name: 签名页面
    @description: 用户签名
    @author: wangshuaixue
    @date: 2019-10-18
-->
<template>
    <div
        class="sign-wrap"
        v-loading="loading"
        element-loading-text="生成图片中，长按图片保存">
        <div class="service-affirm affirm-base">
            <div class='title'>
                居理买房网服务确认单
            </div>
            <img :src="serviceImg" alt="图片">
            <div class="user-name">
                <span>用户签名：</span>
                <img :src="signUrl" alt="用户签名">
            </div>
            <div class="sign-time">
                签字时间：{{transTime}}
            </div>
        </div>
        <canvas ref="canvasRotate"
                class="canvas-rotate">
        </canvas>
        <div id="uploadImg"></div>
        <div id="uploadBigImg"></div>
        <div id="baseSec"></div>
        <div 
            class="signature"
            ref="signatureContainer">
            <div class="signatureBox">
                <div class="canvasBox"
                    ref="canvasHW">
                    <canvas ref="canvasF"
                        @touchstart="touchStart"
                        @touchmove="touchMove"
                        @touchend="touchEnd"></canvas>
                </div>
            </div>
            <div :class="`btnBox ${hasContent ? '' : 'disable-btn'}`">
                <div
                    class="success"
                    id="upload">完成</div>
                <div
                    class="reset"
                    @click="overwrite">
                    清除内容
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'lib-flexible';
import moment from 'moment';
import html2canvas from 'html2canvas';
import dataStorage from '@/assets/js/utils/dataStorage';
import timeRelated from '@/assets/js/utils/timeRelated';
import { getSign } from '@/api/commonApi';
import { commonFun } from '@/assets/js/utils/utils';
import serviceVoucher from './api/serviceVoucher';
const { setConfirmSign } = serviceVoucher;
window.mOxie = window.moxie = require('../../../../static/lib/uploads/moxie.js');
require('../../../../static/lib/uploads/plupload.dev');
export default {
    name: 'user-sign',
    data() {
        return {
            // 当前日期
            transTime: '',
            // 全图的base64
            bigImgBase: '',
            // oss地址
            bigImgUrl: '',
            // 页面加载
            loading: false,
            // 签名图片
            signUrl: '',
            // 服务确认单图片
            serviceImg: '',
            // 画布是否有内容
            hasContent: false,
            // oss签字信息
            signs: {},
            // 签名相关参数
            client: {},
            points: [],
            canvas: '',
            canvasTxt: null,
            startX: 0,
            startY: 0,
            moveY: 0,
            moveX: 0,
            endY: 0,
            endX: 0
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.serviceImg = dataStorage.getStorage('affirm').oData // 获取缓存信息
            // 上传大图
            this.initAllPlupload();
            // 获取oss签名
            this.uploadSign();
            // 上传图片
            this.initPlupload();
            // 设置canvas
            this.canvas = this.$refs.canvasF;
            this.canvas.height = this.$refs.canvasHW.offsetHeight - 2;
            this.canvas.width = this.$refs.canvasHW.offsetWidth - 60;
            this.canvasTxt = this.canvas.getContext('2d');
            this.canvasTxt.lineWidth = 3;
            this.canvasTxt.fillStyle = '#fff';
            this.canvasTxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
        })
    },
    methods: {
        // 初始化上传图片
        initAllPlupload() {
            let that = this;
            let maxSize = '3mb';
            // 定义 plupload 对象
            function setUploadParam(up, filename, ret) {
                let fileName = '';
                if (filename && typeof filename == 'string') {
                    fileName = commonFun.trimAll(filename);
                }
                let keyName =
                    that.signs.dir +
                    moment().format('X') +
                    commonFun.random_string(6) +
                    fileName;
                let newMultipartParams = {
                    key: keyName,
                    policy: that.signs.policy,
                    OSSAccessKeyId: that.signs.accessid,
                    success_action_status: 200, // 默认是 204
                    signature: that.signs.signature
                };
                up.setOption({
                    url: that.signs.host,
                    multipart_params: newMultipartParams
                });
                up.start();
                return keyName;
            }
            // 图片上传实例化
            that.uploaderSec = new plupload.Uploader({
                multi_selection: true, // 不禁止多文件上传
                browse_button: 'uploadBigImg', // 触发文件上传的按钮 id（传入的参数）
                url: that.signs.host, // 服务器的地址，与提供的阿里云的地址一致
                flash_swf_url: '../../../../static/lib/uploads/moxie.swf',
                filters: {
                    max_file_size: maxSize, // 允许上传的最大尺寸
                    prevent_duplicates: true // 不允许上传重复文件
                },
                init: {
                    // 上传初始化
                    PostInit: function() {
                        document.getElementById(
                            'baseSec'
                        ).onclick = function() {
                            let file = commonFun.base64ToBlob(that.bigImgBase);
                            that.uploaderSec.addFile(file, '');
                            setUploadParam(that.uploaderSec, '', false);
                        };
                    },
                    // 文件添加到上传队列后
                    FilesAdded: function(up, files) {
                        setUploadParam(that.uploaderSec, '', false);
                    },
                    FileUploaded: function(up, file, info) {
                        // file 里可以得到压缩率
                        if (info.status === 203) {
                            alert(
                                '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' +
                                    info.response
                            );
                        } else if (info.status !== 200) {
                            alert('imgError');
                            alert(JSON.stringify(info.response));
                        }
                    },
                    BeforeUpload: function(up, file) {
                        that.upFile = setUploadParam(up, file.name, true);
                    },
                    UploadComplete: function(up, file) {
                        that.loading = false;
                        that.bigImgUrl = `${that.signs.host}/${that.upFile}`;
                        that.downloadFile('签名', that.bigImgUrl);
                        that.$router.push({path: 'serviceVoucherList'});
                    },
                    // 错误信息
                    Error: function(up, err) {
                        if (err.code === -602) {
                            that.errorMsg = '已上传过';
                        } else if (err.code !== -601 && err.code !== -600) {
                            alert(JSON.stringify(err));
                        }
                        that.loading = false;
                    }
                }
            });
            // 初始化
            that.uploaderSec.init();
        },
        /**
         * 在本地进行文件保存
         * @param  {String} content 要保存到本地的图片数据 base64
         * @param  {String} fileName 文件名
         */
        downloadFile(fileName, content) {
            let aLink = document.createElement('a');
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('click', true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = content;
            aLink.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            ); // 兼容火狐
        },
        // 签字完成
        signSuccess() {
            var affirm = document.querySelector('.service-affirm');
            var copyDom = affirm.cloneNode(true);
            copyDom.className += ' voucher-user-sign-copy-dom';
            copyDom.style.position = 'absolute';
            copyDom.style.backgroundColor = 'white';
            copyDom.style.zIndex = '-3';
            document.body.appendChild(copyDom);
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            html2canvas(
                document.querySelector('.voucher-user-sign-copy-dom')
            ).then(canvas => {
                this.bigImgBase = canvas.toDataURL('image/png');
                let base = document.querySelector('.affirm-base');
                document.querySelector('.sign-wrap').removeChild(base);
                document.body.removeChild(copyDom);
                // 模拟点击全图
                var btn = document.getElementById('baseSec');
                var event = new MouseEvent('click');
                btn.dispatchEvent(event);
            });
        },
        /**
         * 添加确认单签名
         * @param {string} url 参数描述 上传签名的地址
         * return 空
         */
        async addConfirmSign(url) {
            try {
                let params = {
                    url: url
                };
                const { data } = await setConfirmSign(params);
                if (data.code === 0) {
                    console.log(data);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // mobile
        touchStart(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (ev.touches.length == 1) {
                let obj = {
                    x: ev.targetTouches[0].clienX,
                    y: ev.targetTouches[0].clientY
                };
                this.startX = obj.x;
                this.startY = obj.y;
                this.canvasTxt.beginPath();
                this.canvasTxt.moveTo(this.startX, this.startY);
                this.canvasTxt.lineTo(obj.x, obj.y);
                this.canvasTxt.stroke();
                this.canvasTxt.closePath();
                this.points.push(obj);
            }
        },
        touchMove(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (ev.touches.length == 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX,
                    y: ev.targetTouches[0].clientY
                };
                this.moveY = obj.y;
                this.moveX = obj.x;
                this.canvasTxt.beginPath();
                this.canvasTxt.moveTo(this.startX, this.startY);
                this.canvasTxt.lineTo(obj.x, obj.y);
                this.canvasTxt.stroke();
                this.canvasTxt.closePath();
                this.startY = obj.y;
                this.startX = obj.x;
                this.points.push(obj);
            }
            if (!this.hasContent) {
                this.hasContent = true;
            }
        },
        touchEnd(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (ev.touches.length == 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX,
                    y: ev.targetTouches[0].clientY
                };
                this.canvasTxt.beginPath();
                this.canvasTxt.moveTo(this.startX, this.startY);
                this.canvasTxt.lineTo(obj.x, obj.y);
                this.canvasTxt.stroke();
                this.canvasTxt.closePath();
                this.points.push(obj);
            }
        },
        // 重写
        overwrite() {
            this.canvasTxt.clearRect(
                0,
                0,
                this.$refs.canvasF.width,
                this.$refs.canvasF.height
            );
            this.points = [];
            this.hasContent = false;
        },
        // 初始化上传图片
        initPlupload() {
            // http://comjia-1.oss-cn-beijing.aliyuncs.com/sop_web/icon-@2x.png
            let that = this;
            let maxSize = '100mb';
            // 定义 plupload 对象
            function setUploadParam(up, filename, ret) {
                let fileName = '';
                if (filename && typeof filename == 'string') {
                    fileName = commonFun.trimAll(filename);
                }
                let keyName =
                    that.signs.dir +
                    moment().format('X') +
                    commonFun.random_string(6) +
                    fileName;
                let newMultipartParams = {
                    key: keyName,
                    policy: that.signs.policy,
                    OSSAccessKeyId: that.signs.accessid,
                    success_action_status: 200, // 默认是 204
                    signature: that.signs.signature
                };
                up.setOption({
                    url: that.signs.host,
                    multipart_params: newMultipartParams
                });
                up.start();
                return keyName;
            }
            // 图片上传实例化
            that.uploader = new plupload.Uploader({
                multi_selection: true, // 不禁止多文件上传
                browse_button: 'uploadImg', // 触发文件上传的按钮 id（传入的参数）
                url: that.signs.host, // 服务器的地址，与提供的阿里云的地址一致
                flash_swf_url: '../../../../static/lib/uploads/moxie.swf',
                filters: {
                    max_file_size: maxSize, // 允许上传的最大尺寸
                    prevent_duplicates: true // 不允许上传重复文件
                },
                init: {
                    // 上传初始化
                    PostInit: function() {
                        document.getElementById('upload').onclick = function() {
                            // 新Canvas画布 添加图片
                            var imgnew = that.$refs.canvasRotate;
                            imgnew.height =
                                that.$refs.canvasHW.offsetWidth - 60;
                            imgnew.width = that.$refs.canvasHW.offsetHeight - 2;
                            var ctxNew = that.$refs.canvasRotate.getContext(
                                '2d'
                            );
                            ctxNew.fillStyle = '#fff';

                            // 新建img对象
                            var img = new Image();
                            // 把img的值设置为原画布的base64数据;
                            img.src = that.$refs.canvasF.toDataURL('image/png');
                            that.signUrl = that.$refs.canvasF.toDataURL(
                                'image/png'
                            );
                            img.onload = function(ev) {
                                var width =
                                    (that.$refs.canvasHW.offsetHeight - 40) / 2;
                                // 给canvas 设置中心点
                                ctxNew.translate(0, width);
                                // 画布旋转（旋转度数需要用  度数 *Math.PI/180 来计算）
                                ctxNew.rotate((-90 * Math.PI) / 180);
                                // 绘图
                                ctxNew.drawImage(img, 0, 0);

                                let file = commonFun.base64ToBlob(
                                    that.$refs.canvasRotate.toDataURL(
                                        'image/png'
                                    )
                                );
                                that.uploader.addFile(file, '');
                                setUploadParam(that.uploader, '', false);
                                that.loading = true;
                            };
                        };
                    },
                    // 文件添加到上传队列后
                    FilesAdded: function(up, files) {
                        setUploadParam(that.uploader, '', false);
                    },
                    FileUploaded: function(up, file, info) {
                        // file 里可以得到压缩率
                        if (info.status === 203) {
                            alert(
                                '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' +
                                    info.response
                            );
                        } else if (info.status !== 200) {
                            alert('imgError');
                            alert(JSON.stringify(info.response));
                        }
                    },
                    BeforeUpload: function(up, file) {
                        that.upFile = setUploadParam(up, file.name, true);
                    },
                    UploadComplete: function(up, file) {
                        // 上传成功
                        var img = new Image();
                        img.src = that.signUrl; //需要判断的图片地址
                        img.onload = function() {
                            //该图片已加载完毕,实现自己的业务逻辑
                            that.signSuccess();
                        };
                        // 新增确认单
                        that.addConfirmSign(`/${that.upFile}`);
                    },
                    // 错误信息
                    Error: function(up, err) {
                        if (err.code === -602) {
                            that.errorMsg = '已上传过';
                        } else if (err.code !== -601 && err.code !== -600) {
                            alert(JSON.stringify(err));
                        }
                        that.loading = false;
                    }
                }
            });
            // 初始化
            that.uploader.init();
        },
        // 请求签名信息
        async uploadSign() {
            try {
                let params = {
                    cate: 'order_service_confirm'
                };
                const { data } = await getSign(params);
                if (data.code === 0) {
                    this.signs = data.data;
                    this.transTime =  timeRelated.filterDate(new Date().getTime(), 'YYYY年MM月DD日');
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="less">
@white_color: #fff;
@bule_color: #33a1ff;
@up_gray_color: #bcc0c4;
.voucher-user-sign-copy-dom {
    font-size: 0.48rem;
    text-align: center;
    .title {
        margin: 0.4rem 0;
    }
    > img {
        width: 100%;
    }
    .user-name {
        overflow: hidden;
        padding: 0.266667rem 0.533333rem 0;
        background-color: @white_color;
        > span {
            font-size: 0.373333rem;
            float: left;
            line-height: 1.253333rem;
        }
        > img {
            float: left;
            height: 2.666667rem;
            transform: rotate(-90deg);
            margin-top: -0.72rem;
            margin-left: 0.533333rem;
        }
    }
    .sign-time {
        padding: 0 0.533333rem;
        height: 1.066667rem;
        line-height: 0.533333rem;
        font-size: 0.373333rem;
        text-align: right;
        background-color: @white_color;
    }
}
</style>

<style lang="less" scoped>
@white_color: #fff;
@bule_color: #33a1ff;
@up_gray_color: #bcc0c4;

.sign-wrap {
    position: relative;
    height: 100%;
    overflow: hidden;
    background-color: @white_color;
    .service-affirm {
        position: absolute;
        font-size: 0.48rem;
        text-align: center;
        visibility: hidden;
        .title {
            margin: 0.4rem 0;
        }
        > img {
            width: 100%;
        }
        .user-name {
            overflow: hidden;
            padding: 0 0.533333rem;
            background-color: @white_color;
            > span {
                font-size: 0.373333rem;
                float: left;
                line-height: 1.253333rem;
            }
            > img {
                float: left;
                width: 2.666667rem;
            }
        }
        .sign-time {
            padding: 0 0.533333rem 0.533333rem;
            height: 1.066667rem;
            line-height: 0.533333rem;
            font-size: 0.373333rem;
            text-align: right;
            background-color: @white_color;
        }
    }
}
.imgs2 {
    width: 238px;
    position: relative;
    left: 100px;
    bottom: 10px;
    height: 50px;
}
#uploadImg,
#uploadBigImg,
#baseSec {
    display: none;
}
.canvas-rotate {
    display: none;
}
.signature {
    position: absolute;
    height: 100%;
    width: 100%;
    .btnBox {
        transform: rotate(90deg);
        position: absolute;
        bottom: 2.133333rem;
        right: -0.933333rem;
        font-size: 0.426667rem;
    }
    .reset {
        float: right;
        color: @bule_color;
        height: 0.88rem;
        line-height: 0.88rem;
        margin-right: 0.933333rem;
    }
    .success {
        float: right;
        color: @white_color;
        background-color: @bule_color;
        padding: 5px 0.266667rem;
        border-radius: 3px;
    }
    .disable-btn {
        .success,
        .reset {
            pointer-events: none;
        }
        .reset {
            color: @up_gray_color;
        }
        .success {
            background-color: @up_gray_color;
        }
    }
}

.signatureBox {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    z-index: 100;
    display: flex;
    flex-direction: column;
}
.canvasBox {
    box-sizing: border-box;
    flex: 1;
}
.btnBox {
    text-align: center;
}
</style>
