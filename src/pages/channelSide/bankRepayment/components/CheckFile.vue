<template>
    <el-dialog :visible.sync="fileDialog" width="750px" class="file">
        <h2 slot="title" class="line">查看附件</h2>
        <ul class="s-query">
            <li class="auto" v-for="(item, index) in fileList" :key="index">
                <div class="sub-li">
                    <div class="th">释放原因：</div>
                    <div class="td">
                        {{item.reason}}
                    </div>
                </div>
                <div class="sub-li">
                    <div class="th">附件：</div>
                    <div class="td">
                        <div class="item">
                            <div class="sub-item" v-for="(subItem, subIndex) in item.files"
                                 :key="index + '_' + subIndex">
                <span class="name">
                  {{subItem.name}}
                </span>
                                <span class="down-load">
                <a :href="host + subItem.path" download v-show="host && subItem.path">下载</a>
              </span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </el-dialog>
</template>

<script>
    export default {
        name: "check-file",
        data () {
            return {
                fileDialog: false
            }
        },
        props: {
            fileList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            host: {
                type: String,
                default: ''
            }
        },
        methods: {
            openDialog () {
                this.fileDialog = true
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .file .el-dialog__body {
        padding: 0 20px 10px;
    }

    /deep/ .file {
        .el-dialog__header {
            padding-bottom: 0;
            > h2 {
                border-bottom: 1px solid #edeff0;
                height: 46px;
                line-height: 46px;
            }
        }
    }

    .file {
        .s-query {
            max-height: 450px;
            overflow: auto;
        }
        li {
            margin-bottom: 0;
        }
        .sub-li {
            overflow: hidden;
        }
        .down-load a {
            color: #1662b3;
            margin-left: 10px;
            text-decoration: underline;
        }
        .item {
            overflow: hidden;
            .sub-item {
                float: left;
                margin-left: 10px;
            }
        }
    }
</style>
