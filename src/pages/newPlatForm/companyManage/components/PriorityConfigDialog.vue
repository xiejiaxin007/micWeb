<!--
 * @Author: xie bin
 * @Date: 2020-11-11 14:35:15
 * @LastEditTime: 2020-11-11 16:35:30
 * @LastEditors: xie bin
 * @Description: 优先级配置列表弹窗
 * @FilePath: /webapp_backend/src/pages/newPlatForm/companyManage/components/priorityConfigDialog.vue
-->
<template>
  <div class="dialog-box">
    <el-dialog
        :title="cityName + '的优先级配置'"
        :visible.sync="dialogVisibles"
        width="30%"
        @closed="closeDialog">
        <div>
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="priority"
                    label="优先级">
                </el-table-column>
                <el-table-column
                    prop="org_name"
                    label="公司">
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props: {
        // 弹窗是否显示
        dialogVisible: {
            type: Boolean,
            default: false
        },
        // 公司名称
        cityName: {
            type: String,
            default: ''
        },
        // 表格数据
        tableData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisibles: false,
        }
    },
    watch: {
        dialogVisible: function (newVal,oldVal) {
            this.dialogVisibles = newVal;
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', false);
        }
    }
}
</script>

<style>

</style>