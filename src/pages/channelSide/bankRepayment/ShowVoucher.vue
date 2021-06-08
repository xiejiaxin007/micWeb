<!--
  * @file 银行回款信息页面
  * @author --贺伟
  * @updateTime 2019.10.23
 -->
<template>
    <div class="show-voucher">
        <div class="reason-wrap">
            <h5 class="reason-label">原因说明：</h5>
            <p
                class="reason-content"
                v-for="(item, index) in reasonList"
                :key="index">
                {{item.reason}}
            </p>
        </div>
        <h5 class="file-label">附件：</h5>
        <ul>
            <li
                class="img-list"
                v-for="(item, index) in attach_list"
                :key="index"
            >
                <img
                    :src=" host + v.path"
                    v-for="(v,i) in item"
                    :key="i"
                    :alt="v.name"
                />
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'show-voucher',
        data() {
            return {
                attach_list: [], // 图片展示列表
                host: '', // 域名
                // 原因列表
                reasonList: []
            };
        },
        created() {
            let params = {
                id: this.$route.query.flowId,
                batch_id: this.$route.query.batchId
            };
            this.axios
                .get('/backend-api/select2/select2/get-file-domain')
                .then(res => {
                    if (res.data.code === 0) {
                        this.host = res.data.data.url;
                    }
                });
            this.axios
                .get('/backend-api/expand/ex-bank-flow/get-voucher', { params })
                .then(res => {
                    if (res.status === 200 && res.data.code === 0) {
                        this.attach_list = res.data.data.attach_list;
                        this.reasonList = res.data.data.reason_list;
                    } else {
                        alert(res.data.msg);
                    }
                });
        }
    };
</script>

<style lang="less" scoped>
.show-voucher {
    padding: 0 20px 20px;
    background-color: #fff;
    .reason-label,
    .file-label {
        font-size: 14px;
        padding: 15px 0;
    }
    .reason-content {
        border: 1px solid #ddd;
        border-radius: 2px;
        min-height: 30px;
        margin-bottom: 8px;
        width: 50%;
        line-height: 28px;
        color: #666;
        padding: 5px 10px;
        word-break: break-word;
    }
    .file-label{
        margin-top: 20px;
    }
    > ul {
        li {
            max-width: 100%;
            margin-top: 10px;
            overflow-x: auto;
            margin: 10px 5px;
            img {
                width: 350px;
                display: inline-block;
                border: 2px solid #ddd;
                border-radius: 2px;
                margin: 0 5px;
            }
        }
    }
}
</style>
