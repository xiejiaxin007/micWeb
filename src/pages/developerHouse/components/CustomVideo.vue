<!--
    @name: 视频组件
    @description: 原生video封装的组件，仅包括一些交互和样式
    @author: hewei
    @date: 2020-04-26
-->
<template>
    <div class="video-wrap">
        <video
            class="video"
            id="myVideo"
            ref="customVideo"
            :poster="previewImgUrl"
            @timeupdate="timeUpdate"
            @ended="ended">
            <source
                :src="videoSrc"
                type="video/mp4">
        </video>
        <div class="video-bg">
            <div class="video-init">
                <div class="icon-start-wrap">
                    <i class="icon-font icon-play" aria-hidden="true" @click="playVideo" v-show="!isPlayEnd && !palyStatus"></i>
                    <i class="icon-font icon-pause" aria-hidden="true" @click="pauseVideo" v-show="!isPlayEnd && palyStatus"></i>
                </div>
                <div class="icon-time-wrap">
                    <span class="correct-time" v-show="!isFirstLoad">{{currTime}}</span>
                    <span class="correct-tag" v-show="!isFirstLoad">/</span>
                    <span>{{mediaMins}}:{{mediaSec}}</span>
                    <i class="icon-font icon-expand" aria-hidden="true" @click="fullScreenVideo" v-show="!isFirstLoad"></i>
                </div>
            </div>
            <div class="video-end" @click="reloadVideo" v-show="isPlayEnd">
                <i class="icon-font icon-reload" aria-hidden="true"></i>
                <span>重播</span>
            </div>
            <!-- 视频进度 -->
            <div class="video-progress-bg" v-show="!isFirstLoad">
                <div class="video-progress" :style="progressStyle"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CustomVideo',
        props: {
            // 视频地址
            videoSrc: {
                type: String,
                default: ''
            },
            // 视频预览图地址
            previewImgUrl: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                // 是否时播放状态
                palyStatus: false,
                // 是否播放完毕
                isPlayEnd: false,
                // 是否时初次加载
                isFirstLoad: true,
                // 分钟
                mediaMins: 0,
                // 秒
                mediaSec: 0,
                // 当前播放的时间
                currTime: '00:00',
                // 播放的进度
                progressStyle: {
                    width: '0%'
                }
            }
        },
        mounted() {
            let video = this.$refs.customVideo;
            // 监听audio是否加载完毕，如果加载完毕，则读取audio播放时间
            video.addEventListener("loadedmetadata", () => {
                this.canplay();
            }, {once: true});
        },
        methods: {
            // 在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发
            canplay() {
                const min = Math.floor(this.$refs.customVideo.duration / 60);
                const max = Math.floor(this.$refs.customVideo.duration % 60)
                this.mediaMins = min < 10 ? `0${min}` : min;
                this.mediaSec = max < 10 ? `0${max}` : max;
            },
            // time更新事件，播放时currentTime会更新 连续触发
            timeUpdate(evt) {
                const oAudio = evt.currentTarget;
                const totalTimes = Math.floor(oAudio.duration);
                const curTime = Math.floor(oAudio.currentTime);
                this.currTime = this.currentTimeFormat(curTime);
                const value = (curTime / totalTimes) * 100;
                this.progressStyle.width = Math.ceil(value) + '%';
            },
            // 播放视频
            playVideo() {
                this.$refs.customVideo.play();
                this.isFirstLoad = false;
                this.palyStatus = true;
                this.$emit('videoPlay');
            },
            // 暂停视频
            pauseVideo() {
                this.$refs.customVideo.pause();
                this.palyStatus = false;
                this.$emit('videoPause');
            },
            // 全屏视频
            fullScreenVideo() {
                const ele = this.$refs.customVideo;
                if (ele.requestFullscreen) {
                    ele.requestFullscreen();
                } else if (ele.mozRequestFullScreen) {
                    ele.mozRequestFullScreen();
                } else if (ele.webkitRequestFullScreen) {
                    ele.webkitRequestFullScreen();
                }
            },
            // 重播
            reloadVideo() {
                this.isPlayEnd = false;
                this.$refs.customVideo.play();
                this.palyStatus = true;
            },
            // 播放结束事件
            ended() {
                this.isPlayEnd = true;
                this.$emit('videoEnd');
            },
            /**
             * 进度改变事件
             * @param {String} val 滑块进度值
             */
            progressChange(val) {
                const oAudio = this.$refs.audioPlay;
                const totalTimes = oAudio.duration;
                const dragTime = (totalTimes / 100) * val;
                oAudio.currentTime = dragTime;
                oAudio.play();
            },
            /**
             * 格式化播放时间
             * @param {String} currentTime 时间
             */
            currentTimeFormat(currentTime) {
                let h = Math.floor(currentTime / 3600 % 24);
                let m = Math.floor(currentTime / 60 % 60);
                currentTime = Math.floor(currentTime % 60);
                if (m < 10) {
                    m = '0' + m;
                }
                if (h < 10) {
                    h = '0' + h;
                }
                if (currentTime < 10) {
                    currentTime = '0' + currentTime;
                }
                if (h < 1) {
                    currentTime = m + ":" + currentTime;
                    return currentTime
                } else {
                    currentTime = h + ":" + m + ":" + currentTime;
                    return currentTime;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .video-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #000;
    }
    video {
        width: 100%;
        height: 100%;
        border-radius: 4px;

    }
    .video-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .icon-start-wrap {
            .icon-font {
                width: 22px;
                height: 22px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                cursor: pointer;
                color: #fff;
                &.icon-pause {
                    // display: none;
                    width: 12px;
                    height: 12px;
                    left: 8px;
                    bottom: 7px;
                    top: auto;
                    transform: none;
                }
            }
        }

        .icon-time-wrap {
            position: absolute;
            right: 8px;
            bottom: 4px;
            font-size: 12px;
            display: flex;
            align-items: center;
            color: #fff;

            .icon-expand {
                width: 12px;
                height: 12px;
                margin-left: 8px;
                cursor: pointer;
            }
        }

        .video-progress-bg {
            // display: none;
            position: absolute;
            bottom: 24px;
            width: 100%;
            height: 2px;
            background: #FFFFFF;

            .video-progress {
                width: 0;
                height: 2px;
                background: #00C0EB;
            }


        }


        .video-end {
            // display: none;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);

            .icon-font {
                width: 0.64rem;
                height: 0.64rem;
                color: #fff;
            }

            span {
                display: block;
                font-size: 0.32rem;
                margin-top: 0.21rem;
                color: #fff;
            }
        }
    }

    .icon-close {
        position: absolute;
        right: -8px;
        top: -8px;
        font-size: 16px;
        color: #FA5F35;
        cursor: pointer;
    }
</style>