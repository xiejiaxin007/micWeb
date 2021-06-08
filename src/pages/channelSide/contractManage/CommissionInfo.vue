<!--
 * @author: kangxue
 * @Date: 2020-08-12 10:59:30
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-04-16 11:32:17
 * @description: 结佣单据标准1.0查看
--> 
<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/contract/commissionList' }">结佣单据标准管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.meta.tit}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="view-box">
            <router-link class="router-link"
                v-if="isEdit && $route.name === 'commissionInfo'"
                :to="{path: '/contract/commissionEditIn', query: {id: id}}">
                <el-button type="primary">编辑</el-button>
            </router-link>
            <div class="main-title">{{$route.meta.tit}}</div>
            <div v-loading="loading">
                <div class="info-cell">结佣单据标准ID：{{info.bill_id}}</div>
                <div class="info-cell">结佣单据标准名称：{{info.bill_name}}</div>
                <div class="info-cell">结佣材料必须提供：</div>
                <div v-for="(value, key) in infoList"
                    :key="key">
                    <div class="info-cell">{{voucherTitle[key]}}</div>
                    <div class="voucher-box">
                        <div class="voucher-con"
                            v-for="item in value"
                            :key="item.cat_child_type">
                            <div class="voucher-title">{{item.cat_child_name}}</div>
                            <div class="voucher-info">{{item.cat_child_desc}}</div>
                            <ul class="voucher-imgs">
                                <li v-for="(img, index) in item.file_list"
                                    :key="'img_'+index"
                                    @click="showPreview(info.img_domain, item.file_list, index)">
                                    <img :src="info.img_domain + img"
                                        alt="图片">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="history-list"
                v-if="$route.name === 'commissionInfo' && info.history && info.history.length > 0">
                <div class="info-cell">修改记录</div>
                <ul v-if="!isShow">
                    <li v-for="(item, index) in historyList"
                        :key="item.id">
                        <span class="history-info">{{index + 1 == info.history.length ? '创建' : '修改'}}时间：{{item.create_datetime}}，{{item.creator}}</span>
                        <el-button type="text"
                            size="medium"
                            @click="toHistory(item.id)">历史链接</el-button>
                    </li>
                </ul>
                <ul v-if="isShow">
                    <li v-for="(item, index) in info.history"
                        :key="item.id">
                        <span class="history-info">{{index + 1 == info.history.length ? '创建' : '修改'}}时间：{{item.create_datetime}}，{{item.creator}}</span>
                        <el-button type="text"
                            size="medium"
                            @click="toHistory(item.id)">历史链接</el-button>
                    </li>
                </ul>
                <el-button type="text"
                    size="medium"
                    v-if="isShowBtn && !isShow"
                    @click="isShow = true">展开全部</el-button>
            </div>
        </div>
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="photoIsShow"
            :showViewer="photoIsShow"
            :currentIndex="currentIndex"
            :urlList="previewUrl"
            @closeViewer="closeViewer">
        </jl-image-preview>
    </div>
</template>

<script>
import api from './api/api';
// 标题配置
const voucherTitle = {
    1: '报备凭证',
    2: '带看凭证',
    3: '交易凭证',
    4: '业绩凭证'
};
export default {
    data() {
        return {
            // 结佣标准详情信息
            info: {},
            // 结佣材料标题对应
            voucherTitle: voucherTitle,
            // 单据标准ID
            id: '',
            loading: false,
            // 是否展开全部
            isShow: false,
            // 是否有展开全部按钮
            isShowBtn: false,
            // 是否可编辑
            isEdit: false,
            // 大图展示标志
            photoIsShow: false,
            // 图片预览的url
            previewUrl: [],
            // 大图预览开始的索引
            currentIndex: 0
        };
    },
    computed: {
        historyList: function() {
            if (this.info.history && this.info.history.length > 0) {
                return this.info.history.filter(function(item, index) {
                    return index < 3;
                });
            } else {
                return [];
            }
        },
        // 页面数据--去除不展示的数据
        infoList() {
            if (JSON.stringify(this.info.list) === '{}') return {};
            let list = {};
            for(let key in this.info.list) {
                list[key] = this.info.list[key].filter(v => v.is_check === '1');
            }
            return list;
        }
    },
    methods: {
        /**
         * @description: 图片预览
         * @param {String} host 图片域名
         * @param {String} previewUrl 预览图片url
         * @param {Number} index 当前选中的是哪一项
         */
        showPreview(host, previewUrl, index) {
            this.photoIsShow = true;
            // 给每一个图片加上域名
            let imgArr = previewUrl.map(v => {
                return host + v;
            });
            this.previewUrl = imgArr;
            this.currentIndex = index;
        },
        // 关闭大图预览
        closeViewer() {
            this.photoIsShow = false;
            this.previewUrl = [];
        },
        // 初始化数据
        async initData() {
            try {
                this.loading = true;
                let result;
                if (this.$route.name === 'commissionInfo') {
                    result = await api.getStandardInfo({
                        bill_id: this.id
                    });
                } else {
                    result = await api.getStandardHistoryInfo({
                        history_id: this.id
                    });
                }
                const {
                    data: { code, msg, data }
                } = result;
                if (code === 0) {
                    this.info = data;
                    if (this.$route.name === 'commissionInfo') {
                        this.isEdit = data.edit_auth;
                        this.isShowBtn = data && data.history.length > 3;
                    }
                    this.loading = false;
                } else {
                    this.$message({
                        message: msg,
                        type: 'warning'
                    });
                    this.loading = false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 去历史页面
         * @param {string} id 请求参数，历史ID
         * @return
         */
        toHistory(id) {
            let routeData = this.$router.resolve({
                path: '/contract/commissionHistory',
                query: {
                    id: id
                }
            });
            let newOpen = window.open(routeData.href);
            newOpen.opener = null;
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.initData();
    }
};
</script>

<style scoped lang="less">
.main-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.view-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 20px;
    font-size: 14px;
    .router-link {
        float: right;
        margin-top: -10px;
    }
    .info-cell {
        font-weight: bold;
        margin: 10px 0;
    }
    .voucher-box {
        border: 2px dashed #eee;
        padding: 10px;
        display: flex;
        .voucher-con {
            flex: 1;
            max-width: 33%;
            padding-right: 20px;
            box-sizing: border-box;
            .voucher-title {
                color: #555;
                font-weight: bold;
                padding-bottom: 10px;
            }
            .voucher-info {
                color: #bbb;
                padding-bottom: 10px;
                word-break: break-all;
            }
            .voucher-imgs {
                display: flex;
                li {
                    max-width: 60px;
                    height: 60px;
                    overflow: hidden;
                    margin: 5px;
                    flex: 1;
                    box-sizing: border-box;
                    border: 1px solid #eee;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
            }
        }
    }
}
.history-list {
    margin-top: 30px;
    .history-info {
        display: inline-block;
        min-width: 300px;
    }
}
</style>