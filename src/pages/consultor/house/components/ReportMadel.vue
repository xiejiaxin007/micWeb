<template>
  <div class="report-wrap">
    <el-dialog
      :visible.sync="dialogVisible"
      width="430px"
      class="dialog"
      @close="closeDialog"
      :center="true"
      :title="name"
      :show-close="false"
    >
      <div class="tips">请输入您发现的楼盘错误信息及其正确值，运营同学收到您的报错会在第一时间改正</div>
      <el-input
        type="textarea"
        resize="vertical"
        placeholder="请输入"
        v-model="textarea"
        :autofocus="true"
      >
      </el-input>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="report"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import PubSub from "pubsub-js";
export default {
  props: ["cityInfo"],
  data() {
    return {
      dialogVisible: false,
      name: "",
      textarea: "",
      city_id: ""
    };
  },
  mounted() {
    // 订阅打开报错弹窗事件
    PubSub.subscribe("openReportModal", (msg, data) => {
      this.name = data.name;
      this.city_id = data.city_id;
      this.dialogVisible = true;
    });
  },
  methods: {
    // 关闭弹窗 恢复
    closeDialog() {
      this.name = "";
      this.textarea = "";
    },
    // 点击确定
    report() {
      if (this.textarea === "") {
        this.$message({
          message: "请输入报错内容",
          type: "error"
        });
        return false;
      } else {
        this.axios
          .post("/backend-api/bk-map/project-report-errors", {
            city_id: this.city_id,
            content: this.textarea,
            project_name: this.name
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.dialogVisible = false;
            } else {
              this.$message({
                message: res.data.data.msg,
                type: "error"
              });
            }
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.report-wrap {
  /deep/.el-dialog__header {
    padding: 30px 30px 10px;
    font-size: 18px;
    font-weight: bold;
    color: #3e4254;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /deep/.el-dialog__body {
    padding: 10px 30px 20px;
  }
  /deep/.el-button--default {
    border-radius: 4px;
    width: 132px;
    line-height: 38px;
    padding: 0;
    margin-right: 20px;
    background: #e6e6e6;
  }
  /deep/.el-button--primary {
    border-radius: 4px;
    width: 132px;
    line-height: 38px;
    padding: 0;
    background: #33a1ff;
  }
  /deep/.el-textarea__inner {
    box-sizing: border-box;
    width: 100%;
    height: 163px;
    padding: 18px 20px;
    border: 1px solid #dddddd;
    border-radius: 4px;
    font-size: 14px;
    color: #333333;
    background: #ffffff;
    &::-webkit-input-placeholder {
      font-size: 14px;
      color: #77808a;
    }
  }
}
.tips {
  line-height: 20px;
  font-size: 14px;
  margin-bottom: 20px;
  color: #3e4254;
}
</style>
