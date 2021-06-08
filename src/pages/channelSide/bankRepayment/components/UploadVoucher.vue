<!--
  * @file 银行回款信息页面
  * @author --贺伟
  * @updateTime 2019.10.23
 -->
<template>
    <div>
        <el-dialog
            :visible.sync="is_voucher_dialog"
            width="650px"
            class="voucher"
            @closed="canSubmit = true"
        >
            <h2
                slot="title"
                class="line"
            >财务审核</h2>
            <div class="add_voucher">
                <p>当开票主体与付款公司名称不一致的时候，需要财务审核。</p>
                <div
                    class="file_img"
                    v-loading="loading"
                >
                    <div class="reason-warp">
                        <div class="label">填写原因：</div>
                        <div class="td">
                            <el-input
                                type="textarea"
                                placeholder="最多只能输入300个字"
                                v-model="postData.reason"
                                maxlength="300"
                                show-word-limit
                                :autosize="{ minRows: 2, maxRows: 5}"
                            ></el-input>
                            <span class="warning-msg" v-show="textOverflowMsg">最多只能输入300个字</span>
                        </div>
                    </div>
                    <div class="text">请上传代付款凭证：</div>
                    <ul class="voucher_content">
                        <li
                            v-for="(item, index) in postData.attach_list"
                            :key="index"
                        >
                            <div class="img">
                                <img :src="item.fileURL"
                                    alt="凭证"/>
                            </div>
                            <img
                                src="../../../../assets/images/deleteImg.png"
                                alt
                                class="delete"
                                @click="deleteImg(index)"
                            />
                        </li>
                        <li v-if="postData.attach_list.length < 5">
                            <jl-file-upload
                                ref="upload"
                                fileMaxSize="2mb"
                                upID="Imgupload"
                                :isMulti="true"
                                :limit="5 - postData.attach_list.length"
                                :ossData="ossData"
                                @getFileURL='getFileURL'>
                                <div class="img">
                                    <i class="el-icon-plus add_img" aria-hidden="true"></i>
                                </div>
                            </jl-file-upload>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                class="btn-area"
                slot="footer"
            >
                <button
                    class="btn cancel"
                    @click="is_voucher_dialog = false"
                >取消</button>
                <el-button
                    class="btn confirm"
                    @click="upload"
                >确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            width="450px"
            class="reject"
            :visible.sync="checkDialog"
            :show-close="false"
        >
            <h2
                slot="title"
                class="line"
            >核销提示</h2>
            <div class="reject-body">{{checkMsg}}</div>
            <div
                class="btn-area reject-btn"
                slot="footer"
            >
                <el-button
                    class="btn close-reject"
                    @click="checkDialog = false"
                >取消</el-button>
                <el-button
                    class="btn submit-reject"
                    @click="goNewPage"
                >前往更改流水信息</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getSign } from '@/api/commonApi';
    export default {
        name: 'upload-voucher',
        props: {
            checkData: {
                type: Array,
                default: function() {
                    return [];
                }
            }
        },
        data() {
            return {
                is_voucher_dialog: false, // 弹窗是否展示
                is_voucher_btn: false, // 按钮是否可点击
                postData: {
                    // 提交数据
                    id: '',
                    attach_list: [],
                    reason: ''
                },
                loading: false,
                checkDialog: false,
                checkMsg: '',
                checkUrl: '',
                // 财务审核按钮是否能继续提交
                canSubmit: true,
                // 请求阿里地址返回的数据
                ossData: {}
            };
        },
        computed: {
            textOverflowMsg() {
                return this.postData.reason.length >= 300;
            }
        },
        methods: {
            // 获取阿里云上传签名
            async getSignCode() {
                let params = {
                    cate: 'uploadVoucher'
                };
                try {
                    let { data } = await getSign(params);
                    if (data.code === 0) {
                        this.ossData = data.data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 调用显示弹窗
            showVoucher() {
                this.is_voucher_dialog = true;
                this.loading = false;
                this.postData.attach_list = [];
            },
            // 删除图片
            deleteImg(ind) {
                this.postData.attach_list.splice(ind, 1);
            },
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @return
             */
            getFileURL(fileList) {
                // 关闭加载loading
                this.loading = false;
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                fileList.forEach(imgItem => {
                    if (this.postData.attach_list.find(ele => ele.name === imgItem.originName)) {
                        this.$message('已过滤掉重复图片');
                    } else {
                        let obj = {
                            size: parseInt(imgItem.size / 1024),
                            path: imgItem.upURL,
                            fileURL: imgItem.fileURL,
                            name: imgItem.originName,
                            extension: imgItem.extension,
                            type: '1'
                        };
                        this.postData.attach_list.push(obj);
                    }
                })
            },
            upload() {
                let dataArr = [];
                this.checkData.forEach(item => {
                    let obj = {
                        business_type: item.business_type,
                        business_id: item.business_id,
                        ex_forecast_id: item.forecast_id,
                        forecast_step: item.step,
                        forecast_num: item.num,
                        forecast_step_num: item.step_num,
                        actual_money: item.actual_money,
                        deal_id: item.deal_id
                    };
                    dataArr.push(obj);
                });
                let postData = {
                    data: dataArr,
                    bank_flow_id: this.postData.id,
                    attach_list: this.postData.attach_list,
                    reason: this.postData.reason
                };
                if (!this.canSubmit) {
                    return;
                }
                this.canSubmit = false;
                this.axios
                    .post(
                        '/backend-api/expand/ex-bank-flow/submit-review',
                        postData
                    )
                    .then(res => {
                        if (res.data.code === 0) {
                            this.is_voucher_dialog = false;
                            this.$emit('uploaded');
                        } else if (res.data.code === 10) {
                            this.is_voucher_dialog = false;
                            this.checkDialog = true;
                            this.checkMsg = res.data.msg;
                            this.checkUrl = res.data.data.redirect_url;
                        } else {
                            alert(res.data.msg);
                        }
                    });
            },
            goNewPage() {
                this.checkDialog = false;
                window.open(this.checkUrl, '_blank');
            }
        },
        created() {
            this.postData.id = this.$route.query.flowId;
            this.getSignCode();
        }
    };
</script>

<style lang="less" scoped>
.voucher {
    .warning-msg{
        font-size: 12px;
        color: #ff0000;
    }
    button {
        background: #fff;
    }
    .line {
        position: relative;
        padding-left: 14px;
        margin-bottom: 10px;
    }
    .line:before {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        width: 6px;
        height: 24px;
        background-color: steelblue;
    }
    /deep/ .el-dialog__body {
        padding: 0 30px;
    }
    /deep/ .add_voucher {
        .label{
            padding: 15px 0 10px;
            color: #333;
        }
        .file_img {
            overflow: hidden;
            .text {
                font-size: 14px;
                color: #333;
                padding-top: 10px;
            }
            .voucher_content {
                height: 120px;
                > li {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-top: 15px;
                    float: left;
                    .add_img {
                        font-size: 35px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    &:last-child {
                        box-sizing: border-box;
                        border: 1px double #ccc;
                    }
                    + li {
                        margin-left: 15px;
                    }
                    .img {
                        width: 100px;
                        height: 100px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .delete {
                        position: absolute;
                        width: 24px;
                        height: 24px;
                        top: -12px;
                        right: -12px;
                    }
                }
            }
        }
    }
    /deep/ .el-dialog__header {
        > h2 {
            padding-bottom: 10px;
            border-bottom: 1px solid #edeff0;
        }
    }
    /deep/ .btn-area {
        text-align: right;
        .cancel {
            color: #333;
            border: 1px solid #333;
            margin-right: 10px;
            cursor: pointer;
        }
        .confirm {
            background: #337ab7;
            color: #fff;
            border: 1px solid #337ab7;
            margin-left: 10px;
        }
    }
}
</style>
