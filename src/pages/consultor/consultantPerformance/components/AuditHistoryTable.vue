<!--
 * @Author: xie bin
 * @Date: 2021-05-18 17:29:28
 * @LastEditTime: 2021-05-26 16:57:22
 * @LastEditors: xie bin
 * @Description: 弹出框组件
 * @FilePath: /webapp_backend/src/pages/consultor/consultantPerformance/components/AuditHistoryTable.vue
-->
<template>
    <el-dialog :title="title"
        :visible.sync="dialogVisble"
        @close="cancelReject"
        :close-on-click-modal="false"
        width="800px"
        center>
        <el-table
            :data="auditHistoryData"
            border
            style="width: 100%">
            <el-table-column
                prop="audit_status_name"
                label="审核结果"
                width="111px">
            </el-table-column>
            <el-table-column
                prop="reason"
                label="驳回原因">
            </el-table-column>
            <el-table-column
                prop="auditor"
                label="审核人"
                width="130px">
            </el-table-column>
            <el-table-column
                prop="audit_time"
                label="审核时间"
                width="135px">
            </el-table-column>
            <el-table-column
                prop="submit_time"
                label="提交时间"
                width="135px">
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
    name: 'audit-history-table',
    props: {
        // 弹窗标题
        title: {
            type: String,
            default: ''
        },
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 是否展示弹窗
        auditHistoryArr: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            // 弹窗展示
            dialogVisble: this.visible,
            auditHistoryData: this.auditHistoryArr
        };
    },
    watch: {
        // 监听是否展示弹窗
        visible(newVal) {
            this.dialogVisble = newVal;
        },
        // 监听是否展示弹窗
        auditHistoryArr(newVal) {
            this.auditHistoryData = newVal;
        }
    },
    methods: {
        // 关闭弹窗
        cancelReject() {
            this.$emit('close');
        }
    }
};
</script>
