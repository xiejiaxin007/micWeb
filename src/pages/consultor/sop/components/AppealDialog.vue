<template>
  <div class="appeal-dialog-wrap">
    <!--楼盘任务未完成-->
    <el-dialog
      title="发起申诉"
      :visible.sync="appealShowFlag"
      @close="closePop"
      width="50%">
      <div class="appeal-content">
        <div class="appeal-box">
          <ul class="s-query">
            <li class="auto-column">
              <div class="th">标签ID：</div>
              <div class="td">
                <div class="txt">{{tagId}}</div>
              </div>
            </li>
            <li class="auto-column">
              <div class="th">标签内容：</div>
              <div class="td">
                <div class="txt">{{tbItem.left.val}}</div>
              </div>
            </li>
            <li class="auto auto-column" v-if="tbItem.desc && tbItem.desc!=''">
              <div class="th">标记原因：</div>
              <div class="td">
                <div class="txt">{{tbItem.desc}}</div>
              </div>
            </li>
            <li class="auto auto-column">
              <div class="th">主管驳回意见：</div>
              <div class="td">
                <div class="txt">{{manaReason}}</div>
              </div>
            </li>
            <li class="auto">
              <div class="th required">请描述问题原因：</div>
              <div class="td">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                  <el-form-item label="" prop="qsDiscrib">
                    <el-input type="textarea" v-model="ruleForm.qsDiscrib" :autosize="{ minRows: 4, maxRows: 4}" maxlength="500" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </li>
            <li class="auto">
              <div class="th required">请上传截图凭证：</div>
              <div class="td">
                <div class="upload-img-wrapper">
                  <div class="upload-img-box" v-for="(img, index) in files" :key="index">
                    <div class="icon-box"><span class="iconfont iconicon-delete" @click="deleteImg(index)"></span></div>
                    <img :src="img.fileURL" alt="图片">
                  </div>
                  <div class="upload-file-warp"  v-if="files.length < 3">
                      <jl-file-upload
                          ref="uploadImg"
                          upID="postinitNew"
                          fileMaxSize="2mb"
                          :ossData="signs"
                          :isMulti="true"
                          :limit="3 - files.length"
                          @beforeUpdate="loading = false"
                          @getFileURL="getFileURL">
                          <div class="up-box">
                            <span class="wrap">
                              <span class="h-line"></span>
                              <span class="s-line"></span>
                            </span>
                          </div>
                      </jl-file-upload>
                  </div>
                </div>
              </div>
            </li>
            <li class="auto txt-link" v-if="limitFlag">
              <div class="th"></div>
              <div class="td">
                <div class="txt text-red">图片至少上传一张</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePop">取 消</el-button>
        <el-button type="primary" id="postfiles" @click="appealSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
window.mOxie = window.moxie = require('../../../../../static/lib/uploads/moxie.js')
require('../../../../../static/lib/uploads/plupload.dev')
export default {
  props: {
    configId: {
      default: 0
    },
    tagId: {
      default: 0
    },
    uid: {
      default: ''
    },
    tbItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    manaReason: {
      default: ''
    }
  },
  data () {
    let validateQs = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('问题描述原因不能为空！'))
      }
      if (value.length > 500 || value.length < 12) {
        callback(new Error('请仔细描述问题，至少要输入12个字符，最多输入500个字符。'))
      } else {
        callback()
      }
    }
    return {
      imageUrl: '', // 上传图片路径
      imgArr: [], // 上传的图片的展示路径
      ruleForm: { // 表单
        qsDiscrib: ''
      },
      rules: {
        qsDiscrib: [
          { validator: validateQs, trigger: 'change' }
        ]
      },
      upFile: [], // 插件上传的文件
      files: [], // 上传的文件列表
      appealShowFlag: true,
      uploader: {},
      signs: {}, // 获取的oss签名信息
      limitFlag: false, // 上传的错误提示
      // 是否重复提交
      isSubmit: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getSign()
      // this.initPlupload()
    })
  },
  methods: {
    /**
     * 获取文件
     * @param {String} fileList 文件列表
     * @return
     */
    getFileURL(fileList) {
        // 关闭加载loading
        this.loading = false;
        fileList.forEach(imgItem => {
            if (this.files.find(ele => ele.originName === imgItem.originName)) {
                this.$message('已过滤掉重复图片');
            } else {
                this.files.push(imgItem);
            }
        })
    },
    initPlupload (id) {
      // http://comjia-1.oss-cn-beijing.aliyuncs.com/sop_web/icon-@2x.png
      let that = this
      var maxSize = '2mb'
      // 定义 plupload 对象
      function setUploadParam (up, filename, ret) {
        let keyName = that.signs.dir + filename + moment().format('X')
        let newMultipartParams = {
          key: keyName,
          policy: that.signs.policy,
          OSSAccessKeyId: that.signs.accessid,
          success_action_status: 200, // 默认是 204
          signature: that.signs.signature
        }
        up.setOption({
          'url': that.signs.host,
          'multipart_params': newMultipartParams
        })
        up.start()
        return keyName
      }
      that.uploader = new plupload.Uploader({
        mulit_selection: false, // 禁止多文件上传
        browse_button: 'postinit', // 触发文件上传的按钮 id（传入的参数）
        url: that.host, // 服务器的地址，与提供的阿里云的地址一致
        flash_swf_url: '../../../../static/lib/uploads/moxie.swf',
        filters: {
          mime_types: [
            {
              title: 'Image files',
              extensions: 'jpg,png' // 允许上传的文件类型
            }
          ],
          max_file_size: maxSize, // 允许上传的最大尺寸
          prevent_duplicates: true // 不允许上传重复文件
        },
        /* resize: {
          width: 600, // 压缩后的宽
          height: 400, // 压缩后的高
          crop: true, // 开启图片裁剪
          quality: 55, // 裁剪质量，数值越小图片越小
          preserve_headers: false // 不保留图片原数据
        }, */
        init: {
          // 上传初始化
          PostInit: function () {
            document.getElementById('postfiles').onclick = function () {
              if (that.uploader.files.length > 0) {
                // 图片数量大于1
                  setUploadParam(that.uploader, '', false)
              } else {
                that.limitFlag = true
              }
              return false
            }
          },
          // 文件添加到上传队列后
          FilesAdded: function (up, files) {
            function previewImage (file, callback) {
              // file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
              if (!file || !/image\//.test(file.type)) return
              // 确保文件是图片
              if (file.type === 'image/gif') {
                // gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                let fr = new moxie.image.Image()
                fr.onload = function () {
                  callback(fr.result)
                  fr.destroy()
                  fr = null
                }
                fr.readAsDataURL(file.getSource())
              } else {
                let preloader = new moxie.image.Image()
                preloader.onload = function () {
                  // preloader.downsize(80,80,true);//先压缩一下要预览的图片,宽，高
                  let imgsrc = preloader.type === 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 70) : preloader.getAsDataURL()
                  // 得到图片src,实质为一个base64编码的数据
                  callback && callback(imgsrc)
                  // callback传入的参数为预览图片的url
                  preloader.destroy()
                  preloader = null
                }
                preloader.load(file.getSource())
              }
            }
            function getImg (para) {
              let obj = {
                name: para,
                size: files[0].size,
                file: files[0],
                id: files[0].id
              }
              that.files.push(obj)
            }
            // 判断不能超过三张图片
            if (that.files.length < 3) {
              previewImage(files[0], getImg)
            } else {
              up.removeFile(files[0].id)
              alert('最多上传三张图片')
            }
          },
          FileUploaded: function (up, file, info) {
            // file 里可以得到压缩率
            if (info.status === 200) {
              console.log("上传成功");
            } else if (info.status === 203) {
              alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response)
            } else {
              alert(info.respose)
            }
          },
          BeforeUpload: function (up, file) {
            that.$refs['ruleForm'].validate((valid) => {
              if (valid && that.files.length > 0) {
                that.upFile.push(setUploadParam(up, file.name, true))
              } else {
                up.stop()
                return false
              }
            })
          },
          UploadComplete: function (up, file) {
            let imgList = []
            for (let i = 0; i < that.upFile.length; i++) {
              imgList.push(that.signs.host + '/' + that.upFile[i])
            }
            // 上传成功后执行的操作
            let params = {
              tag_id: that.tagId,
              tag_config_id: that.configId,
              appeal_reason: that.ruleForm.qsDiscrib,
              appeal_img: imgList,
              creator: that.uid
            }
            that.axios.post('/backend-api/bk-api-tag-manage/appeal', params).then((res) => {
              if (res.data.code === 0) {
                // 关闭弹窗，区别是请求成功关闭的弹窗还是取消和点叉关闭
                let obj = {
                  close: false,
                  isUpdate: true
                }
                that.$emit('closeAppeal', obj)
              }
            }).catch((err) => {
              console.log(err)
            })
          },
          // 错误信息
          Error: function (up, err) {
            if (err.code === -600) {
              alert('图片大小不能超过' + maxSize)
            } else if (err.code === -601) {
              alert('文件类型不正确')
            } else if (err.code === -602) {
              alert('已上传过')
            } else {
              alert(err)
            }
          }
        }
      })
      that.uploader.init()
    },
    closePop () {
      this.appealShowFlag = false
      // 关闭弹窗，区别是请求成功关闭的弹窗还是取消和点叉关闭
      let obj = {
        close: false,
        isUpdate: false
      }
      this.$emit('closeAppeal', obj)
    },
    // 请求oss上传设置参数
    getSign () {
      let params = {
        cate: 'sop_web'
      }
      this.axios.post('/backend-api/bk-api-upload/get-upload-sign', params).then((res) => {
        if (res.data.code === 0) {
          this.signs = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 上传成功函数
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 确认发起申诉提交按钮
    appealSubmit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.files.length <= 0) {
            this.$message.warning('请上传截图凭证');
            return false;
          } 
          let imgList = []
          this.files.forEach(item => {
              imgList.push(this.signs.host + item.upURL)
          })
          // 上传成功后执行的操作
          let params = {
            tag_id: this.tagId,
            tag_config_id: this.configId,
            appeal_reason: this.ruleForm.qsDiscrib,
            appeal_img: imgList,
            creator: this.uid
          }
          // 防止重复提交
          if (this.isSubmit) return false;
          this.isSubmit = true; 
          this.axios.post('/backend-api/bk-api-tag-manage/appeal', params).then((res) => {
            if (res.data.code === 0) {
              // 关闭弹窗，区别是请求成功关闭的弹窗还是取消和点叉关闭
              let obj = {
                close: false,
                isUpdate: true
              }
              this.$emit('closeAppeal', obj)
            }
            this.isSubmit = false; 
          }).catch((err) => {
            console.log(err)
            this.isSubmit = false; 
          })
        } else {
          return false
        }
      })
    },
    // 获取文件名字
    getObjectURL (file) {
      let url = null
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 删除图片
    deleteImg (para) {
      this.imgArr.splice(para, 1)
      this.files.splice(para, 1)
    }
  },
  watch: {
    files: {
      deep: true,
      handler: function (val) {
        if (this.files.length > 0) {
          this.limitFlag = false
        } else {
          this.limitFlag = true
        }
      }
    }
  }
}
</script>
<style scoped>
  .dialog-footer {
    text-align: center;
  }
  .up-box {
    display: inline-block;
    width: 76px;
    height: 76px;
    border: 2px dotted #eee;
    border-radius: 4px;
  }
  .up-box .wrap{
    display: block;
    position: relative;
  }
  .up-box .wrap .h-line{
    width:20px;
    height:2px;
    position: absolute;
    left: 28px;
    top: 37px;
    background-color: #bbb;
  }
  .up-box .wrap .s-line{
    height:20px;
    width:2px;
    position: absolute;
    top: 28px;
    left: 37px;
    background-color: #bbb;
  }
  .appeal-dialog-wrap >>> .el-dialog__body{
    padding: 15px 20px;
  }
  .appeal-box{
    overflow: hidden;
  }
  .appeal-box .s-query .th{
    color: #333;
  }
  .appeal-box .s-query > li{
    width: 300px;
    margin-bottom: 10px;
  }
  .appeal-box .s-query > li.auto{
    width: 100%;
  }
  .appeal-box .s-query > li.txt-link{
    margin-top: -20px;
    line-height: 30px;
  }
  .text-red{
    color: #f56c6c;
    font-size: 12px;
  }
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .upload-img-wrapper{
    padding-top: 10px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .upload-img-box{
    position: relative;
    float: left;
    width: 80px;
    height: 80px;
    margin-right: 10px;
    word-break: break-all;
    z-index: 99;
  }
  .upload-img-box > img{
    width: 100%;
    height: 100%;
  }
  .upload-img-box > span.test-img{
    width: 100%;
    height: 100%;
  }
  .icon-box{
    position: absolute;
    top: -5px;
    right: -5px;
    border-radius: 50%;
    line-height: normal;
    cursor: pointer;
    text-align: right;
    background-color: #fff;
    z-index: 99;
  }
  .iconicon-delete{
    font-size: 18px;
    color: #ff0000;
  }
  .appeal-dialog-wrap >>> .el-form-item__content{
    overflow: inherit;
  }
</style>
<style lang="less" scoped>
  .upload-file-warp {
    float: left;
    /deep/.jl-file-upload-wrap {
      cursor: pointer;
      width: 80px;
    }
  }
</style>
