<template>
  <div class="app-question-box" v-loading="loading">
    <div class="question-wrapper">
      <!--头部-->
      <div class="question-box-header">
        <div class="header-box">
          <h3><span class="iconfont iconturn-back" @click="turnBack"></span>{{questionInfo.project_name}}</h3>
        </div>
      </div>
      <div class="question-box-body">
        <div class="box-body-wrapper">
          <!--问题内容-->
          <div class="box-body-title">
            <div class="title-box-title">
              <span class="title-info-tip">问</span>
              <span class="title-info">{{questionInfo.question}}</span>
            </div>
            <div class="title-box-info">{{questionInfo.creator}} · {{questionTime}}</div>
          </div>
          <!--问题回答区域-->
          <div class="box-body-cont">
            <div class="input-box">
              <el-input
                type="textarea"
                resize="none"
                placeholder="我来输入答案……"
                maxlength="150"
                v-model.trim="inputStr">
              </el-input>
            </div>
            <!--图片上传-->
            <div class="pic-box">
              <div class="pic-item" v-for="(picItem, imgIndex) in imagesList" :key="'imgIndex-index-' +imgIndex">
                <img :src="showImg(picItem)" @click="zoomImg(picItem)" alt="图片">
                <div :class="{'dele-box ios-center': isIOS, 'dele-box': !isIOS}" @click="delteItem(imgIndex, 'img')"><span class="iconfont iconguanbi"></span></div>
              </div>
              <div class="upload-box" id="uploadImg">
                <div class="upload-btn">
                  <div><span class="iconfont iconadded"></span></div>
                  <div class="btn-title">上传图片</div>
                </div>
              </div>
            </div>
            <!--文件上传-->
            <div class="file-box">
              <ul class="file-list-box">
                <li v-for="(fileItem, fileIndex) in fileList" :key="'fileIndex-' +fileIndex">
                  <div class="file-item">
                    <div class="file-img">
                      <img :src="matchImg(fileItem.extension)" alt="图片">
                    </div>
                    <div class="file-info">
                      <div class="delete-file-box" @click="delteItem(fileIndex, 'file')"><span class="iconfont icondelete-file"></span></div>
                      <div class="file-info-cont">
                        <p class="info-cont-tit">{{fileItem.name}}</p>
                        <p class="info-cont-info">{{fileItem.extension}} · {{culcuSize(fileItem.size)}}mb</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="upload-file-btn" id="upFiles">+ 上传文件</div>
              <p class="upload-tip"><span class="iconfont iconinformation"></span><span class="tip-cont">提交后会将问题的答案同步给咨询师</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-area" id="uploadFile">
        <div class="btn-area-submit" id="upload">提交答案</div>
      </div>
    </div>
    <toast :msg="errorMsg" :toastShow="toastShow"></toast>
    <div v-if="imgShow" class="img-mask" @click="closeMask">
      <img :src="currenImg" alt="图片">
    </div>
  </div>
</template>

<script>
import 'lib-flexible';
import pdfImg from './images/pdf.png'
import pptImg from './images/ppt.png'
import wordImg from './images/word.png'
import xlsImg from './images/xls.png'
import defaultPhoto from '@/assets/images/img-small-default.png'
import { commonFun } from '@/assets/js/utils/utils'
import {Toast} from '../components'
import moment from 'moment'
window.mOxie = window.moxie = require('../../../../static/lib/uploads/moxie.js')
require('../../../../static/lib/uploads/plupload.dev')
export default {
  name: 'app-answer-question',
  data () {
    return {
      loading: true, // 页面loading
      signs: {}, // oss签名
      uploader: '', // 图片上传实例
      isIOS: false, // 是否是IOS操作系统
      fileUploader: '', // 文件上传实例
      fileList: [], // 文件数组
      fileArr: [], // 用于上传的文件
      errorMsg: '', // 错误toast提示内容
      toastShow: false, // toast出现标志
      currenImg: '', // 点击查看大图的url
      inputStr: '', // 答案输入框
      imagesList: [], // 传递给后台的上传成功图片路径
      upImg: [], // 记录上传图片的拼接名称
      imgShow: false, // 图片放大的展示标志
      imgUploaded: false, // 图片是否已经上传完成标志
      fileUped: false, // 文件是否已经上传完成标志
      questionId: this.$route.query.question_id, // url上的问题id
      answerId: this.$route.query.answer_id, // url上的回答id
      questionTime: '', // 提问时间
      questionInfo: {}, // 问题数据
      inputFlag: false, // 答案输入错误提示
      submiting: false, // 正在提交
      answerInfo: {} // 回答数据
    }
  },
  mounted () {
    // 获取oss签名
    this.getSign()
    // 上传图片
    this.initPlupload()
    // 数据初始化
    this.getData()
    this.$nextTick(() => {
      // 图片加载不出来
      document.addEventListener('error', function (e) {
        var elem = e.target
        if (elem.tagName.toLowerCase() === 'img') {
          elem.src = defaultPhoto
          elem.error = null
        }
      }, true)
      // 判断当前操作系统，修改样式
      this.checkAgent()
    })
  },
  components: {Toast},
  methods: {
    // 文件大小转换Mb
    culcuSize (para) {
      let rel = parseFloat(para) / 1024 / 1024
      let data = rel.toFixed(2)
      return data
    },
    // 展示oss图片
    showImg (para) {
      let imgUrl
      if (para.upload) {
        // 还没有上传的
        imgUrl = para.path
      } else {
        // 已经上传过的
        imgUrl = this.signs.host + para.path
      }
      return imgUrl
    },
    // 数据初始化
    getData () {
      this.loading = true
      let params = {
        question_id: this.questionId,
        answer_id: this.answerId
      }
      this.axios.get('/backend-api/app-answer/edit', {params: params}).then((res) => {
        if (res.data.code === 0) {
          this.loading = false
          let resData = res.data.data
          this.questionInfo = resData.questionInfo
          this.answerInfo = resData.answerInfo
          // 计算问题提问的时间，后台返回的是秒为单位的时间戳
          this.questionTime = this.formatDateTime(this.questionInfo.create_datetime + '000')
          this.imagesList = this.answerInfo.img ? this.answerInfo.img : []
          this.fileList = this.answerInfo.file ? this.answerInfo.file : []
          this.inputStr = this.answerInfo.answer ? this.answerInfo.answer : ''
        } else {
          this.loading = false
        }
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    // 时间戳转换为日期YYYY-MM-DD hh:mm:ss
    formatDateTime (inputTime) {
      let date = new Date(parseInt(inputTime))
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      // let second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      // second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute
    },
    // 关闭大图
    closeMask () {
      this.imgShow = false
    },
    // 点击图片看大图
    zoomImg (para) {
      if (para.upload) {
        // 还未上传的图片，可以直接预览
        this.currenImg = para.path
      } else {
        // 已经上传的图片
        this.currenImg = this.signs.host + para.path
      }
      this.imgShow = true
    },
    // 根据文件后缀动态匹配文件图片
    matchImg (para) {
      let result = para ? para.toLowerCase() : ''
      let imgUrl
      if (result == 'doc' || result == 'txt' || result == 'wps' || result == 'dot') {
        imgUrl = wordImg
      } else if (result == 'et' || result == 'xls' || result == 'xlt' || result == 'xlsx' || result == 'xlsm' || result == 'xml' || result == 'cvs') {
        imgUrl = xlsImg
      } else if (result == 'ppt' || result == 'dps' || result == 'dpt' || result == 'pot' || result == 'pptx') {
        imgUrl = pptImg
      } else if (result == 'pdf') {
        imgUrl = pdfImg
      } else {
        imgUrl = wordImg
      }
      return imgUrl
    },
    // 上传图片个数超过回调函数
    limitImgCheck (para, paraList) {
      console.log(paraList)
    },
    // 上传文件个数超过回调函数
    limitFileCheck (para, paraList) {
      console.log(paraList)
    },
    // 返回
    turnBack () {
      window.history.go(-1)
    },
    getSign () {
      let params = {
        cate: 'Upload/project/answer'
      }
      this.axios.post('/backend-api/bk-api-upload/get-upload-sign', params).then((res) => {
        if (res.data.code === 0) {
          this.signs = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initPlupload () {
      // http://comjia-1.oss-cn-beijing.aliyuncs.com/sop_web/icon-@2x.png
      let that = this
      let maxSize = '100mb'
      // 定义 plupload 对象
      function setUploadParam (up, filename, ret) {
        let fileName = ''
        if (filename && typeof filename == 'string') {
          fileName = commonFun.trimAll(filename)
        }
        let keyName = that.signs.dir + moment().format('X') + commonFun.random_string(6) + fileName
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
      // 图片上传实例化
      that.uploader = new plupload.Uploader({
        multi_selection: true, // 不禁止多文件上传
        browse_button: 'uploadImg', // 触发文件上传的按钮 id（传入的参数）
        url: that.host, // 服务器的地址，与提供的阿里云的地址一致
        flash_swf_url: '../../../static/lib/uploads/moxie.swf',
        filters: {
          prevent_duplicates: true // 不允许上传重复文件
        },
        init: {
          // 上传初始化
          PostInit: function () {
            document.getElementById('upload').onclick = function () {
              // 输入框判断
              if (that.inputStr.length > 0 && that.inputStr.length <= 150) {
                // 开始请求
                that.loading = true
                setUploadParam(that.uploader, '', false)
              } else {
                that.inputFlag = true
              }
              return false
            }
          },
          // 文件添加到上传队列后
          FilesAdded: function (up, files) {
            function previewImage (file, callback, fileIndex) {
              // file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
              if (!file || !/image\//.test(file.type)) return
              // 确保文件是图片
              if (file.type === 'image/gif') {
                // gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                let fr = new moxie.image.Image()
                fr.onload = function () {
                  callback(fr.result, file, fileIndex)
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
                  callback && callback(imgsrc, file, fileIndex)
                  // callback传入的参数为预览图片的url
                  preloader.destroy()
                  preloader = null
                }
                preloader.load(file.getSource())
              }
            }
            function getImg (para, filePara, index) {
              that.$set(that.imagesList[index], 'path', para)
            }
            // 判断不能超过十张图片，并且是图片格式
            for (let i = 0; i < files.length; i++) {
              if (/image\//.test(files[i].type)) {
                if (that.imagesList.length < 10) {
                  let obj = {
                    size: files[i].size,
                    file: files[i],
                    id: files[i].id,
                    upload: true
                  }
                  that.imagesList.push(obj)
                  previewImage(files[i], getImg, (that.imagesList.length - 1))
                } else {
                  up.removeFile(files[i].id)
                  that.errorMsg = '最多可上传10张图片'
                  that.toastShow = true
                  setTimeout(() => {
                    that.toastShow = false
                  }, 1000)
                }
              } else {
                up.removeFile(files[i].id)
                that.errorMsg = '图片格式不正确'
                that.toastShow = true
                setTimeout(() => {
                  that.toastShow = false
                }, 1000)
                // 跳出循环
                break
              }
            }
          },
          FileUploaded: function (up, file, info) {
            // file 里可以得到压缩率
            if (info.status === 203) {
              alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response)
            } else if (info.status !== 200) {
              alert('imgError')
              alert(JSON.stringify(info.response))
            }
          },
          BeforeUpload: function (up, file) {
            let fileName = ''
            if (file.name && typeof file.name == 'string') {
              fileName = commonFun.trimAll(file.name)
            }
            let type = file.type.split('/')[1]
            let pathName = '/' + setUploadParam(up, file.name, true)
            let obj = {
              id: file.id,
              path: pathName,
              size: file.size,
              name: fileName,
              extension: type,
              type: 1
            }
            that.upImg.push(obj)
          },
          UploadComplete: function (up, file) {
            // 上传成功的文件数组
            let imgLists = []
            for (let j = 0; j < file.length; j++) {
              let isHas = that.upImg.findIndex((v) => {
                return v.id == file[j].id
              })
              if (isHas !== -1) {
                let obj = {
                  id: that.upImg[isHas].id,
                  path: that.upImg[isHas].path,
                  size: that.upImg[isHas].size,
                  name: that.upImg[isHas].name,
                  extension: that.upImg[isHas].extension,
                  type: 1
                }
                imgLists.push(obj)
              }
            }
            that.upImg = JSON.parse(JSON.stringify(imgLists))
            // 上传完成标志置为true
            that.imgUploaded = true
          },
          // 错误信息
          Error: function (up, err) {
            if (err.code === -602) {
              that.errorMsg = '已上传过'
              that.toastShow = true
              setTimeout(() => {
                that.toastShow = false
              }, 1000)
            } else if (err.code !== -601 && err.code !== -600) {
              alert(JSON.stringify(err))
            }
          }
        }
      })
      // 文件上传实例化
      that.fileUploader = new plupload.Uploader({
        multi_selection: true, // 不禁止多文件上传
        browse_button: 'upFiles', // 触发文件上传的按钮 id（传入的参数）
        url: that.host, // 服务器的地址，与提供的阿里云的地址一致
        filters: {
          mime_types: [
            {title: "files", extensions: "doc,docx,txt,wps,dot,et,xls,xlt,xlsx,xlsm,xml,csv,ppt,dps,dpt,pot,pptx,pdf"}
          ],
          max_file_size: maxSize, // 允许上传的最大尺寸
          prevent_duplicates: true // 不允许上传重复文件
        },
        init: {
          // 上传初始化
          PostInit: function () {
            document.getElementById('uploadFile').onclick = function () {
              // 输入框判断
              if (that.inputStr.length > 0 && that.inputStr.length <= 150) {
                // 开始请求
                that.loading = true
                setUploadParam(that.fileUploader, '', false)
              } else {
                that.inputFlag = true
              }
              return false
            }
          },
          // 文件添加到上传队列后
          FilesAdded: function (up, files) {
            // 判断不能超过十张文件
            for (let i = 0; i < files.length; i++) {
              if (that.fileList.length < 10) {
                let fileName = ''
                if (files[i].name && typeof files[i].name == 'string') {
                  fileName = commonFun.trimAll(files[i].name)
                }
                // 判断文件大小
                if (Math.round(files[i].size / 1024 / 1024) < 100) {
                  let obj = {
                    name: fileName,
                    size: files[i].size,
                    id: files[i].id,
                    extension: files[i].name.indexOf('.') ? files[i].name.replace(/.+\./, '') : '',
                    file: files[i]
                  }
                  that.fileList.push(obj)
                } else {
                  that.errorMsg = '最大上传附件大小为100M，请重新选择'
                  that.toastShow = true
                  setTimeout(() => {
                    that.toastShow = false
                  }, 1000)
                  up.removeFile(files[i].id)
                }
              } else {
                up.removeFile(files[i].id)
                that.errorMsg = '最多可上传10个文件'
                that.toastShow = true
                setTimeout(() => {
                  that.toastShow = false
                }, 1000)
              }
            }
          },
          FileUploaded: function (up, file, info) {
            // file 里可以得到压缩率
            if (info.status === 203) {
              alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response)
            } else if (info.status !== 200) {
              alert(JSON.stringify(info.respose))
            }
          },
          BeforeUpload: function (up, file) {
            let fileName = ''
            if (file.name && typeof file.name == 'string') {
              fileName = commonFun.trimAll(file.name)
            }
            let pathName = '/' + setUploadParam(up, file.name, true)
            let obj = {
              id: file.id,
              size: file.size,
              path: pathName,
              name: fileName,
              extension: file.name.indexOf('.') ? file.name.replace(/.+\./, '') : '',
              type: 2
            }
            that.fileArr.push(obj)
          },
          UploadComplete: function (up, file) {
            // 上传成功的文件数组
            let fileLists = []
            for (let j = 0; j < file.length; j++) {
              let isHas = that.fileArr.findIndex((v) => {
                return v.id == file[j].id
              })
              if (isHas !== -1) {
                let obj = {
                  id: that.fileArr[isHas].id,
                  size: that.fileArr[isHas].size,
                  path: that.fileArr[isHas].path,
                  name: that.fileArr[isHas].name,
                  extension: that.fileArr[isHas].extension,
                  type: 2
                }
                fileLists.push(obj)
              }
            }
            that.fileArr = JSON.parse(JSON.stringify(fileLists))
            // 上传完成标志置为true
            that.fileUped = true
          },
          // 错误信息
          Error: function (up, err) {
            if (err.code === -601) {
              that.errorMsg = '文件类型不正确'
              that.toastShow = true
              setTimeout(() => {
                that.toastShow = false
              }, 1000)
            } else if (err.code === -602) {
              that.errorMsg = '已上传过'
              that.toastShow = true
              setTimeout(() => {
                that.toastShow = false
              }, 1000)
            } else if (err.code !== -600) {
              alert('error')
              alert(JSON.stringify(err))
            }
          }
        }
      })
      // 初始化
      that.uploader.init()
      that.fileUploader.init()
    },
    // 请求上传
    uploadMethod () {
      // 防止重复提交
      if (!this.submiting) {
        // 正在请求中
        this.submiting = true
        if (this.imagesList.length <= 10 && this.fileList.length <= 10) {
          // 图片和文件都小于10个
          let saveId
          if (this.answerId || this.answerId == 0) {
            saveId = this.answerId
          } else {
            saveId = ''
          }
          // 将已经上传的和新上传的合并
          let imgArr = []
          let files = []
          for (let i = 0; i < this.imagesList.length; i++) {
            if (this.imagesList[i].id) {
              // 如果有id，则是新增的上传
              let obj = this.upImg.filter((item) => {
                return item.id == this.imagesList[i].id
              })
              // 如果有匹配才加入
              if (obj.length > 0) {
                imgArr.push(obj[0])
              }
            } else {
              imgArr.push(this.imagesList[i])
            }
          }
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].id) {
              // 如果有id，则是新增的上传
              let obj = this.fileArr.filter((item) => {
                return item.id == this.fileList[i].id
              })
              if (obj.length > 0) {
                files.push(obj[0])
              }
            } else {
              files.push(this.fileList[i])
            }
          }
          let params = {
            answer_id: saveId,
            question_id: this.questionId,
            answer_content: this.inputStr,
            source: 2,
            attach_list: [...imgArr, ...files]
          }
          this.axios.post('/backend-api/app-answer/save-answer', params).then((res) => {
            if (res.data.code === 0) {
              // loading结束
              this.loading = false
              // 请求完成
              this.errorMsg = '答案提交成功'
              this.toastShow = true
              setTimeout(() => {
                this.toastShow = false
              }, 1000)
              this.$router.push({path: '/appAnswerDetail', query: {id: this.questionId}})
              // 跳转页面
              // window.loction.href = ''
              this.submiting = false
            } else {
              // 请求完成
              this.submiting = false
              // loading结束
              this.loading = false
            }
          }).catch((err) => {
            // 请求完成
            this.submiting = false
            // loading结束
            this.loading = false
            console.log(err)
          })
        } else {
          this.submiting = false
          // loading结束
          this.loading = false
        }
      } else {
        // loading结束
        this.loading = false
      }
    },
    // 删除项
    delteItem (index, type) {
      if (type === 'img') {
        // 删除图片
        this.upImg.splice(index, 1)
        if (this.imagesList[index].id) {
          // 判断是否是还没有上传过的，需要移出上传队列
          this.uploader.removeFile(this.imagesList[index].id)
        }
        this.imagesList.splice(index, 1)
        this.upImg.splice(index, 1)
      } else if (type === 'file') {
        // 删除文件
        this.upImg.splice(index, 1)
        if (this.fileList[index].id) {
          // 判断是否是还没有上传过的，需要移出上传队列
          this.fileUploader.removeFile(this.fileList[index].id)
        }
        this.fileList.splice(index, 1)
        this.fileArr.splice(index, 1)
      }
    },
    // 判断当前操作系统
    checkAgent () {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        // 这个是安卓操作系统
        this.isIOS = false
      }
      if (isIOS) {
        // 这个是ios操作系统
        this.isIOS = true
      }
    }
  },
  watch: {
    // 文件上传完成标志
    fileUped: {
      deep: true,
      handler: function (val) {
        // 文件和图片状态都已上传完成再请求接口
        if (this.fileUped && this.imgUploaded) {
          this.uploadMethod()
          this.fileUped = false
          this.imgUploaded = false
        }
      }
    },
    // 图片上传完成标志
    imgUploaded: {
      deep: true,
      handler: function (val) {
        // 文件和图片状态都已上传完成再请求接口
        if (this.fileUped && this.imgUploaded) {
          this.uploadMethod()
          this.fileUped = false
          this.imgUploaded = false
        }
      }
    },
    // 答案输入提示监听
    inputFlag: {
      deep: true,
      handler: function (val) {
        if (this.inputFlag) {
          this.errorMsg = '答案字段不能为空'
          this.toastShow = true
          setTimeout(() => {
            this.toastShow = false
            this.inputFlag = false
          }, 1000)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .app-question-box{
    width: 10rem;
    margin: 0 auto;
    height: 100%;
    .question-wrapper{
      height: 100%;
      overflow-y: auto;
      background-color: #fff;
      /*头部*/
      .question-box-header{
        position: fixed;
        top: 0;
        left: 50%;
        margin-left: -5rem;
        padding: 0.253rem 0.533rem;
        box-sizing: border-box;
        background-color: #fff;
        height: 1.173rem;
        width: 10rem;
        border-bottom: 1px solid #ecf0f4;
        line-height: 0.667rem;
        z-index: 3;
        .header-box{
          h3{
            position: relative;
            font-size: 0.48rem;
            text-align: center;
            font-weight: normal;
            color: #3e4a59;
            overflow: hidden;
            height: 0.66rem;
            .iconturn-back{
              float: left;
              font-size: 0.6rem;
              font-weight: bold;
              vertical-align: middle;
            }
          }
        }
      }
      /*内容*/
      .question-box-body{
        padding: 1.173rem 0 1.706rem 0;
        box-sizing: border-box;
        background-color: #fff;
        .box-body-wrapper{
          background-color: #f4f4f4;
          /*问题内容*/
          .box-body-title{
            background-color: #fff;
            padding: 0.533rem;
            box-sizing: border-box;
            border-radius: 0 0 10px 10px;
            .title-box-title{
              overflow: hidden;
              &>span{
                &:first-of-type{
                  float: left;
                  width: 0.48rem;
                }
                &:last-of-type{
                  overflow: hidden;
                }
              }
              .title-info{
                font-size: 0.426rem;
                color: #3e4a59;
                line-height: 0.6rem;
                font-weight: bold;
                margin-left: 0.266rem;
              }
              .title-info-tip{
                padding: 1px 0;
                box-sizing: border-box;
                text-align: center;
                background-image: linear-gradient(-180deg, #ff8091 0%, #ff4958 100%);
                border-radius: 4px;
                font-size: 0.32rem;
                margin-top: 1px;
                color: #fff;
              }
            }
            .title-box-info{
              margin-top: 0.266rem;
              font-size: 0.32rem;
              color: #77808a;
            }
          }
          /*回答区域*/
          .box-body-cont{
            margin-top: 0.266rem;
            background: #fff;
            border-radius: 10px 10px 0 0;
            padding: 0 0.533rem;
            box-sizing: border-box;
            /deep/.moxie-shim{
              z-index: -1!important;
            }
            .input-box{
              padding: 0.533rem 0 0.586rem 0;
              box-sizing: border-box;
              /deep/.el-textarea{
                textarea{
                  border: none;
                  height: 4rem;
                  background-color: #f4f6f9;
                  border-radius: 0.106rem;
                  padding: 0.266rem;
                  box-sizing: border-box;
                }
              }
            }
            .pic-box{
              &:after{
                content:".";
                clear: both;
                height: 0;
                overflow: hidden;
                visibility: hidden;
                display: block;
              }
              .pic-item{
                position: relative;
                float: left;
                width: 2rem;
                height: 2rem;
                margin: 0 0.2rem 0.2rem 0;
                &>img{
                  width: 100%;
                  height: 100%;
                }
                .dele-box{
                  position: absolute;
                  left: -5px;
                  top: -5px;
                  width: 0.48rem;
                  height: 0.48rem;
                  background-color: #33a1ff;
                  color: #fff;
                  border: 2px solid #fff;
                  border-radius: 50%;
                  font-weight: bold;
                  z-index: 2;
                  .iconguanbi{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #fff;
                    font-size: 0.213rem;
                  }
                }
                .ios-center{
                  .iconguanbi{
                    margin: 0.02rem 0 0 0.02rem;
                  }
                }
              }
              .upload-box{
                float: left;
                .upload-btn{
                  width: 2.053rem;
                  height: 2.053rem;
                  background-color: #f4f6f9;
                  border-radius: 8px;
                  box-sizing: border-box;
                  text-align: center;
                  padding-top: 0.4rem;
                  box-sizing: border-box;
                  .iconadded{
                    font-size: 22px;
                    color: #999;
                  }
                  .btn-title{
                    font-size: 0.32rem;
                    color: #77808a;
                    line-height: 0.32rem;
                    margin-top: 0.186rem;
                  }
                }
              }
            }
            .file-box{
              margin-top: 0.33rem;
              padding-bottom: 0.533rem;
              /deep/.el-upload{
                width: 100%;
              }
              &:after{
                content:".";
                clear: both;
                height: 0;
                overflow: hidden;
                visibility: hidden;
                display: block;
              }
              .file-list-box{
                padding-bottom: 0.133rem;
                box-sizing: border-box;
                .file-item{
                  margin-bottom: 0.4rem;
                  overflow: hidden;
                  .file-img{
                    float: left;
                    width: 0.933rem;
                    height: 0.933rem;
                    &>img{
                      width: 100%;
                      height: 100%;
                    }
                  }
                  .file-info{
                    border-radius: 0 8px 8px 0;
                    overflow: hidden;
                    height: 0.84rem;
                    border: 2px solid #f4f6f9;
                    border-left: none;
                    .delete-file-box{
                      float: right;
                      width: 0.986rem;
                      height: 100%;
                      border-left: 2px solid #f4f6f9;
                      text-align: center;
                      border-radius: 0 0.133rem 0.133rem 0;
                      .icondelete-file{
                        font-size: 0.5rem;
                        line-height: 0.84rem;
                        color: #77808a;
                      }
                    }
                    .file-info-cont{
                      overflow: hidden;
                      padding: 4px 0 0 0.186rem;
                      box-sizing: border-box;
                      .info-cont-tit{
                        width: 4.986rem;
                        height: 0.32rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        font-size: 0.32rem;
                        color: #3e4a59;
                        letter-spacing: 0;
                        line-height: 0.32rem;
                      }
                      .info-cont-info{
                        color: #999;
                      }
                    }
                  }
                }
              }
              .upload-file-btn{
                width: 100%;
                height: 1.173rem;
                border: 1px solid #e2e2e2;
                text-align: center;
                line-height: 1.173rem;
                color: #33a1ff;
                font-size: 0.373rem;
              }
              .upload-tip{
                font-size: 0;
                margin-top: 0.4rem;
                .tip-cont{
                  font-size: 0.293rem;
                  color: #aaa;
                  line-height: 32px;
                  margin-top: 0.4rem;
                  vertical-align: middle;
                }
                .iconinformation{
                  font-size: 0.426rem;
                  color: rgb(255, 175, 48);
                  margin-right: 0.146rem;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
      .btn-area{
        position: fixed;
        width: 10rem;
        left: 50%;
        margin-left: -5rem;
        bottom: 0;
        margin-bottom: 0;
        background-color: #fff;
        z-index: 3;
        box-shadow: 0 -2px 4px 0 rgba(222,222,222,0.50);
        padding: 0.32rem 0.533rem;
        box-sizing: border-box;
        text-align: center;
        .btn-area-submit{
          width: 100%;
          box-shadow: 0 5px 0.24rem 0 #cce4ff;
          border-radius: 0.533rem;
          background-color: #33a1ff;
          color: #fff;
          padding: 0.24rem 0 0.2266rem 0;
          box-sizing: border-box;
          text-align: center;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
      }
    }
    .img-mask{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 4;
      background-color: rgba(0, 0, 0, 0.8);
      &>img{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
</style>
