<!--
 * @author: kangxue
 * @Date: 2021-04-12 11:26:39
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-19 14:37:15
 * @description: 凭证模块，结佣单据详情使用，通用模块，展示图片+最新修改+最新审核的，带修改，审核，驳回按钮
-->
<template>
    <div class="voucher-con">
        <div class="operate-btn">
            <el-button v-if="info.can_edit"
                type="primary"
                size="small"
                @click="updateReport(info.detail)">修改</el-button>
            <el-button v-if="info.can_approval"
                size="small"
                @click="rejectReport">驳回</el-button>
            <el-button v-if="info.can_approval"
                size="small"
                type="primary"
                @click="passReport">通过</el-button>
        </div>
        <div class="voucher-title">{{title}}</div>
        <div class="voucher-info"
            v-if="info.detail">
            <!-- 交易合同，认购，网签自带的 -->
            <div v-if="dealName"
                class="time-info">{{dealName}}姓名：{{info.detail.customer_name}}</div>
            <div v-if="dealName"
                class="time-info">{{dealName}}电话：{{info.detail.customer_mobile}}</div>
            <!-- pdf -->
            <ul v-if="pdfList && pdfList.length"
                class="voucher-pdf">
                <li v-for="(pdf, index) in pdfList"
                    :key="'pdf_'+index">
                    <a :href="imgDomain + pdf.file_url"
                        target="_blank"
                        rel="noopener noreferrer">{{pdf.file_name}}</a>
                </li>
            </ul>
            <!-- 图片 -->
            <ul v-if="imgList && imgList.length"
                class="voucher-imgs">
                <li v-for="(img, index) in imgList"
                    :key="'img_'+index"
                    @click="showPreview(imgList, index)">
                    <img :src="isFullImg(img) ? img : imgDomain + img"
                        alt="图片">
                </li>
            </ul>
            <div v-if="info.detail.newest_edit"
                class="time-info">最新修改：
                <span v-if="info.detail.newest_edit.update_datetime">{{info.detail.newest_edit.update_datetime}}</span>
                <span v-if="info.detail.newest_edit.updator">{{info.detail.newest_edit.updator}}</span>
            </div>
            <div v-if="info.detail.newest_approval && info.detail.newest_approval.audit_status"
                class="time-info">最新审核：
                <span v-if="info.detail.newest_approval.audit_datetime">{{info.detail.newest_approval.audit_datetime}}</span>
                <span v-if="info.detail.newest_approval.auditor">{{info.detail.newest_approval.auditor}}</span>
                <span v-if="info.detail.newest_approval.audit_status">{{info.detail.newest_approval.audit_status}}</span>
            </div>
            <div v-if="info.detail.newest_approval && info.detail.newest_approval.reject_reason"
                class="text-danger">驳回原因：{{info.detail.newest_approval.reject_reason}}</div>
        </div>
        <!-- 没有数据展示黄色文字 -->
        <warn-msg v-else
            :modalKey="info.key"></warn-msg>
    </div>
</template>

<script>
import WarnMsg from './WarnMsg';
export default {
    name: 'VoucherModule',
    components: {
        WarnMsg,
    },
    props: {
        // 模块名称
        title: {
            type: String,
            default: '',
        },
        // 展示信息
        info: {
            type: Object,
            default: () => {
                return {};
            },
        },
        // 图片域名
        imgDomain: {
            type: String,
            default: '',
        },
    },
    computed: {
        // 当前是认购还是网签
        dealName() {
            let key = Number(this.info.key);
            let nameInfo = {
                3301: '排号',
                3302: '认购',
                3303: '草签',
                3304: '网签',
            };
            return nameInfo[key] || '';
        },
        // 图片列表, 1=图片，2=文件
        imgList() {
            let list = [];
            let fileList = this.info.detail.file_list;
            // 业绩确认单使用file_list_all字段，file_list用来下载
            if (Number(this.info.key) === 36) {
                fileList = this.info.detail.file_list_all;
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].file_type === '1') {
                        list.push(fileList[i].file_url);
                    }
                }
            } else {
                list = fileList && fileList.length > 0 ? fileList : [];
            }
            return list;
        },
        // pdf列表
        pdfList() {
            let list = [];
            if (Number(this.info.key) === 36) {
                let fileList = this.info.detail.file_list_all;
                list = fileList.filter((item) => item.file_type === '2');
            }
            return list;
        },
    },
    methods: {
        /**
         * @description: 是否是全路径，包含http:// 或者https://是全路径图片，目前主要是带看确认单有全连接
         * @param {string} img  图片路径
         * @return {boolean}
         */
        isFullImg(img) {
            let reg = /^(http|https):\/\/([\w.]+\/?)\S*$/;
            return reg.test(img);
        },
        /**
         * @description: 图片预览
         * @param {String} previewUrl 预览图片url
         * @param {Number} index 当前选中的是哪一项
         */
        showPreview(previewUrl, index) {
            this.$emit('showPreview', {
                previewUrl: previewUrl,
                index: index,
            });
        },
        /**
         * @description: 修改报备截图
         * @param {Array} detail  报备截图的详情数据
         */
        updateReport(detail) {
            this.$emit('updateReport', detail);
        },
        // 驳回报备截图
        rejectReport() {
            this.$emit('rejectReport', true);
        },
        // 审核通过报备截图
        passReport() {
            this.$emit('passReport', true);
        },
    },
};
</script>

<style lang="less" scoped>
.voucher-box {
    border: 2px dashed #eee;
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;
    .voucher-con {
        flex: 1;
        max-width: 33%;
        min-width: 33%;
        padding-right: 20px;
        box-sizing: border-box;
        padding: 15px 10px;
        .voucher-title {
            color: #555;
            font-weight: bold;
            padding-bottom: 10px;
        }
        .voucher-info {
            clear: both;
            padding-top: 5px;
        }
        .operate-btn {
            float: right;
            margin-top: -5px;
        }
        .voucher-pdf {
            li {
                display: block;
                a {
                    color: #409eff;
                }
            }
        }
        .voucher-imgs {
            display: flex;
            flex-wrap: wrap;
            li {
                height: 80px;
                width: 20%;
                overflow: hidden;
                padding: 5px;
                box-sizing: border-box;
                img {
                    border: 1px solid #eee;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }
        .time-info {
            color: #666;
            padding-bottom: 5px;
            word-break: break-all;
            span {
                padding-right: 20px;
            }
        }
    }
}
.text-danger {
    color: #f56c6c;
}
</style>
