<!--
 * @author: kangxue
 * @Date: 2020-07-15 11:21:23
 * @LastEditors: kangxue
 * @LastEditTime: 2020-07-15 14:19:26
 * @description: 客诉材料展示（图片+音频）
-->
<template>
    <div>
        <!-- 图片展示 -->
        <ul class="img-list"
            v-if="imgList && imgList.length > 0">
            <li v-for="(item, index) in imgList"
                :key="index">
                <div class="img-item-box">
                    <img :src="imgUrl ? item[imgUrl] : item"
                        alt="图片凭证"
                        @click="showPreview(imgUrl ? item[imgUrl] : item)">
                </div>
            </li>
        </ul>
        <!-- 音频展示 -->
        <ul class="audio-list"
            v-if="audioList && audioList.length > 0">
            <li v-for="(item, index) in audioList"
                :key="index">
                <audio-play
                    class="audio-item-box"
                    :url="audioUrl ? item[audioUrl] : item"></audio-play>
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
import { AudioPlay } from '@/components';
export default {
    name: 'ShowMaterial',
    props: {
        // 图片列表
        imgList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 图片链接参数
        imgUrl: {
            type: String,
            default: ''
        },
        // 音频列表
        audioList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 音频链接参数
        audioUrl: {
            type: String,
            default: ''
        }
    },
    components: {
        AudioPlay
    },
    data() {
        return {
            // 图片预览
            photoIsShow: false,
            // 图片预览的url
            previewUrl: []
        };
    },
    methods: {
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
    }
}
</style>