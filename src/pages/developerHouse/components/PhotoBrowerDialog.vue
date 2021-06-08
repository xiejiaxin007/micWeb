<!--
    @name: 图集浏览组件
    @description: 在一个弹窗中可切换浏览多个图集
    @author: 贺伟
    @date: 2020-04-24
-->
<template>
    <transition name="el-fade-in">
        <div class="main-wrap" v-show="visible">
            <div class="photo-wrap">
                <div class="swiper-wrap-box">
                    <!--swiper 组件-->
                    <swiper
                        class="swiper"
                        ref="mySwiper"
                        v-if="simpleUrl === ''"
                        :options="swiperOption">
                        <swiper-slide
                            class="slide-item"
                            v-for="(item, index) in filterArr"
                            :key="index">
                            <img :src="item.url" alt="室内图">
                        </swiper-slide>
                    </swiper>
                    <div class="swiper" v-else>
                        <div class="slide-item">
                            <img :src="simpleUrl" alt="室内图">
                        </div>
                    </div>
                    <!--左右导航箭头-->
                    <template v-if="simpleUrl === ''">
                        <div class="swiper-icon-prev icon-shift" v-show="this.itemIdx !== 0">
                            <i class="el-icon el-icon-arrow-left" aria-hidden="true"></i>
                        </div>
                        <div class="swiper-icon-next icon-shift" v-show="this.itemIdx !== allPhotosLen - 1">
                            <i class="el-icon el-icon-arrow-right" aria-hidden="true"></i>
                        </div>
                        <!--底部导航进度-->
                        <div class="curent-progress">
                            {{photosName}}({{photoTypeIdx}}/{{photosLen}})
                        </div>
                    </template>
                    
                </div>
                <!--底部图册模块-->
                <ul class="photo-lists" v-if="simpleUrl === ''">
                    <li
                        :class="{'photo-item': true, active: photoIndex === idx}"
                        v-for="(item, idx) in photos"
                        :key="item.name"
                        @click="checkPhotos(idx)">
                        <img class="prev-img" :src="item.values[0].url" alt="室内图">
                        <div class="photo-type">
                            {{item.name}}({{item.values.length}})
                        </div>
                    </li>
                </ul>
                <!--关闭按钮-->
                <div class="close-box" @click="closeDialog">
                    <i class="iconfont iconguanbi" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
        name: 'PhotoBrowerDialog',
        components: {
            swiper,
            swiperSlide
        },
        props: {
            // 简单的大图浏览url 若传此参数，则认定为单张大图预览，并以此url对应的图片进行展示
            simpleUrl: {
                type: String,
                default: ''
            },
            // 弹窗的显示隐藏
            visible: {
                type: Boolean,
                default: false
            },
            // 需要预览图片的数组
            photos: {
                type: Array,
                default: () => []
            },
            // 默认当前激活的展示的图片所在索引
            // 数组第一个值为图集索引，第二个时图片所在图集的索引
            // 或者直接传当前图片所在全部图片中的索引 不传则默认从第一张开始
            slideIdx: {
                type: [Array, Number],
                default: 0
            }
        },
        watch: {
            slideIdx() {
                this.updateSlide();
            }
        },
        data() {
            return {
                // swiper配置
                swiperOption: {
                    // initialSlide: 5,
                    navigation: {
                        nextEl: '.swiper-icon-next',
                        prevEl: '.swiper-icon-prev'
                    },
                    /* watchSlidesProgress: true, */
                    on: {
                        slideChangeTransitionStart: this.slideChangeTransitionStart
                    }
                },
                // 弹窗显示隐藏
               // visible: true,
                // 当前预览图所在图集索引值
                photoIndex: 0,
                // 当前slider图片所在索引
                itemIdx: 0
            };
        },
        mounted() {
            // 更新当前激活的slide
            this.updateSlide();
        },
        computed: {
            // 将数组中的图片放置到一个数组中
            filterArr() {
                const arr = [];
                this.photos.forEach((item, idx) => {
                    item.values.forEach((ele, index) => {
                        arr.push({
                            url: ele.url,
                            photoIndex: idx
                        })
                    })
                });
                return arr;
            },
            // swiper 实例
            swiper() {
                return this.$refs.mySwiper.swiper
            },
            // 所有图集的总长度
            allPhotosLen() {
                return this.filterArr.length;
            },
            // 当前所在类型图集的长度，即url数
            photosLen() {
                return this.photos[this.photoIndex] && this.photos[this.photoIndex].values.length;
            },
            // 当前所在图集名称
            photosName() {
                 return this.photos[this.photoIndex] && this.photos[this.photoIndex].name;
            },
            // 计算当前图片所在图集的索引值
            photoTypeIdx() {
                let curIndex = this.itemIdx;
                // 当前图片所在索引减去前面图集长度的和 即为当前图片在当前图集中的索引
                for (let i = 0; i < this.photoIndex; i++) {
                    curIndex -= this.photos[i].values.length;
                }
                return curIndex + 1;
            }
        },
        methods: {
            // 当前索引变化则更新到对应的silde
            updateSlide() {
                if (this.simpleUrl !== '') {
                    return;
                }
                if (this.slideIdx === 0) {
                    return;
                }
                let index = 0;
                if (Array.isArray(this.slideIdx)) {
                    for (let i = 0; i < this.slideIdx[0]; i++) {
                        if (this.photos[i]) {
                            index += this.photos[i].values.length;
                        }
                        
                    }
                    index += this.slideIdx[1];
                    this.swiper.slideTo(index, 0);
                    return;
                }
                this.swiper.slideTo(this.slideIdx, 0);
            },
            // 当前slide开始过渡到另一个slide时触发
            slideChangeTransitionStart() {
                // 获取当前slider所在的索引
                this.itemIdx = this.swiper.activeIndex;
                // 计算当前slider所在图集的索引
                this.photoIndex = this.filterArr[this.itemIdx] && this.filterArr[this.itemIdx].photoIndex;
            },
            // 关闭弹窗
            closeDialog() {
                // this.visible = false;
                this.$emit('update:visible', false)
            },
            // 选中该当前相册进行预览
            checkPhotos(idx) {
                // 定义需要跳转的图片索引
                let toSliderIdx = 0;
                // 遍历获取之前图册集的长度累加得到需要跳转的索引
                for (let i = 0; i < idx; i++) {
                    toSliderIdx += this.photos[i].values.length;
                }
                // 滚动到指定索引的图片
                this.swiper.slideTo(toSliderIdx);
            }
        }
    };
</script>

<style lang="less" scoped>
    .main-wrap {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        background-color: rgba(0,0,0,.5);
        * {
            box-sizing: border-box;
        }
    }
    .photo-wrap {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 8px;
        padding: 24px;
        width: 688px;
        .close-box {
            position: absolute;
            top: -16px;
            right: -16px;
            background-color: #fa5f35;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            text-align: center;
            cursor: pointer;
            :hover {
                opacity: 0.8;
            }
            .iconfont {
                font-size: 14px;
                color: #fff;
                line-height: 32px;
            }
        }
    }
    .swiper-wrap-box {
        position: relative;
        .curent-progress {
            position: absolute;
            left: 16px;
            bottom: 16px;
            z-index: 2;
            width: 113px;
            height: 36px;
            background: #fff;
            border-radius: 4px;
            font-weight: bold;
            color: #424242;
            text-align: center;
            line-height: 36px;
        }
        .icon-shift {
            position: absolute;
            top: 188px;
            z-index: 3;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            text-align: center;
            background-color: rgba(0,0,0,.4);
            cursor: pointer;
            &:hover {
                background:rgba(0,0,0,.8);
            }
            &:focus {
                outline-style: none;
            }
            &.swiper-icon-prev {
                left: 20px;
            }
            &.swiper-icon-next {
                right: 20px;
            }
            .el-icon {
                font-size: 14px;
                color: #fff;
                line-height: 44px;
                font-weight: bold;
            }
        }
    }
    .swiper {
        width: 640px;
        height: 420px;
        background-color: #e6e8f3;
        background-image: url('../../../assets/images/bg-julive-icon.png');
        background-size: 150px 82px;
        border-radius:4px;
        overflow: hidden;
        
    }
    .slide-item {
        width: 100%;
        height: 100%;
        
        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    .photo-lists {
        display: flex;
        margin-top: 24px;
        .photo-item {
            position: relative;
            width: 120px;
            height: 90px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            &:hover {
                .photo-type {
                    background:rgba(0,192,235,.9);
                }
            }
            &.active {
                .photo-type {
                    background:rgba(0,192,235,.9);
                }
            }
            .photo-type {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 32px;
                background: rgba(0,0,0,.78);
                font-size: 13px;
                color: #fff;
                text-align: center;
                line-height: 32px;
                transition: all .3s;
                &:hover {
                    background:rgba(0,192,235,.9);
                }
            }
            > .prev-img {
                width: 100%;
                height: 100%;
            }
            &:not(:last-child) {
                margin-right: 10px;
            }
        }
    }
    
</style>