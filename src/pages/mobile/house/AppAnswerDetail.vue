<template>
  <div class="app-question-detail">
    <div class="question-wrapper">
      <!--头部-->
      <div class="question-box-header">
        <div class="header-box">
          <h3>
            <i class="iconfont iconturn-back" aria-hidden="true" @click="turnBack"></i>
            <span class="pro-title">{{projectName}}</span>
          </h3>
        </div>
      </div>
      <div class="question-box-body">
        <div class="content-wrap">
          <!--问题内容-->
          <div class="box-body-title">
            <div class="title-box-title">
              <span class="title-info-tip">问</span>
              <span class="title-info">{{questionInfo.question}}</span>
            </div>
            <div class="title-img-wrap" v-if="questionImg.length>0">
                <img :src="img.show_path" v-for="(img,index) in questionImg" :key="index"  @click="openMask(img.show_path)" alt="图片">
            </div>
            <div class="title-box-info">
              <span>{{questionInfo.employee_name}}_{{questionInfo.job_number}} · {{filterDate(questionInfo.create_datetime)}}</span>
            </div>
          </div>
          <!--问题答案区域-->
          <div class="box-body-cont" :class="answerInfo.length==0 ? ' noAns' : ''" ref="bodyCon">
            <div class="has-answer" v-if="answerInfo.length>0">
              <div class="file-box">
                <ul class="file-list-box">
                  <li class="item-box" v-for="(item,index) in answerInfo" :key="index">
                    <div class="answer-title">
                      <span class="title-tip">答</span>
                      <span class="title-info">{{item.answer}}</span>
                    </div>
                    <div class="file-item" v-for="(itemFile, indexs) in item.file" :key="indexs">
                      <div class="file-img">
                        <img :src="matchImg(itemFile.extension)" alt="图片">
                      </div>
                      <div class="file-info">
                        <span class="down-file" @click="openDownloadDialog(itemFile.show_path,itemFile.name)"> <i class="iconfont iconicon_download" aria-hidden="true"></i> </span>
                        <div class="file-info-cont">
                          <p class="info-cont-tit">{{itemFile.name}}</p>
                          <p class="info-cont-info">{{itemFile.extension}} · {{compSize(itemFile.size)}}mb</p>
                        </div>
                      </div>
                    </div>
                    <div class="file-item" v-if="item.img.length>0">
                      <div class="img-info">
                        <img :src="imgIt.show_path" v-for="(imgIt,ind) in item.img" :key="ind" @click="openMask(imgIt.show_path)" alt="图片">
                      </div>
                    </div>
                    <div class="author-wrap">
                        <span class="author-data">{{item.employee_name}}_{{item.job_number}} · {{filterDate(item.update_datetime)}}</span>
                        <div class="edit-con" v-if="item.is_edit"  @click="editIsShowState(item,index)"><img src="./images/edit-point.png" alt="图片"></div>
                        <div class='hand-wrap' v-show="item.isShow"  @click="editHandler(item.id)">
                          <span></span>
                          <div>
                            编辑
                          </div>
                        </div>
                        <div class="give-wrap">
                            <span class="give-after" v-if="item.is_like" @click="likeHandler(item)">
                              <em class="img-warp"><img src="./images/give-liked.png" alt="图片"></em>
                              <span class="number">{{item.likes}}</span>
                            </span>
                            <span class="give-before" v-else  @click="likeHandler(item)">
                              <em class="img-warp"><img src="./images/give-like.png" alt="图片"></em>
                              <span class="number">{{item.likes}}</span>
                            </span>
                        </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 答案区域无数据时 -->
            <div class="no-answer" v-if="answerInfo.length==0">
              暂无数据
            </div>
          </div>
          <div class="btn-area">
            <div class="btn-area-submit" @click="needAnswer">我要回答</div>
          </div>
          <div class="shadow-wrap" v-if='isShadow' @click="closeShadow">
          </div>
        </div>
      </div>
    </div>
    <div v-if="imgShow" class="img-mask" @click="closeMask">
      <img :src="currenImg" alt="图片">
    </div>
    <div
      class="map-wrap"
      v-if="loading"
      v-loading="loading"
    >
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'lib-flexible';
import pdfImg from './images/pdf.png'
import pptImg from './images/ppt.png'
import wordImg from './images/word.png'
import xlsImg from './images/xls.png'
import defaultPhoto from '@/assets/images/img-middle-default.png'
import { commonFun } from '@/assets/js/utils/utils'
export default {
  name: 'app-answer-detail',
  data () {
    return {
      imgShow: false, // 大图
      isShow: false, // 默认不展开
      currenImg: '', // 大图链接
      questionInfo: {},
      answerInfo: [],
      questionImg: [],
      projectName: '',
      quesId: '',
      employeeId: '',
      isShadow: false,
      backendApi: '',
      trackMessages: '',
      signs: {},
      loading: true
    }
  },
  mounted () {
    this.quesId = this.$route.query.id
    // this.getSign() // =========  目前文件地址不对使用这个下载  沙盒环境
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
    })
  },
  methods: {
    openDownloadDialog (url, saveName) {
      // var baseUrl = `${this.signs.host}${url}`
      // for ie 10 and later
      if (window.navigator.msSaveBlob) {
        try {
          window.navigator.msSaveBlob(url, downloadFileName)
        } catch (e) {
          console.log(e)
        }
      } else { // 谷歌浏览器 创建a标签 添加download属性下载
        if (typeof url == 'object' && url instanceof Blob) {
          url = URL.createObjectURL(url) // 创建blob地址
        }
        var aLink = document.createElement('a')
        aLink.href = url
        aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event
        if (window.MouseEvent) {
          event = new MouseEvent('click')
        } else {
          event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        }
        aLink.dispatchEvent(event)
      }
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
    closeShadow () {
      this.isShadow = false
      this.answerInfo.forEach(element => {
        element.isShow = false
      })
    },
    compSize (size) {
      var sizes = size && size != '' ? parseInt(size) : ''
      var num
      if (sizes !== '') {
        num = (sizes / 1024 / 1024).toFixed(2)
      } else {
        num = ''
      }
      return num
    },
    needAnswer () {
      // 埋点
      commonFun.setTrack('4383', this.trackMessages, {}, this.backendApi)
      this.$router.push({path: `/appAnswerQuestion?question_id=${this.quesId}`})
    },
    likeHandler (para) {
      let params = {
        id: para.id,
        type: para.is_like ? '2' : '1'
      }
      this.axios.post('/backend-api/app-question/like', params).then((res) => {
        if (res.data.code == 0) {
          if (para.is_like) {
            para.likes = parseInt(para.likes) > 0 ? parseInt(para.likes) - 1 : 0
            // 埋点
            let trackObj = {
              answer_id: para.id
            }
            commonFun.setTrack('4382', this.trackMessages, trackObj, this.backendApi)
          } else {
            para.likes = parseInt(para.likes) + 1
            // 埋点
            let trackObj = {
              answer_id: para.id
            }
            commonFun.setTrack('4381', this.trackMessages, trackObj, this.backendApi)
          }
          para.is_like = !para.is_like
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 根据文件后缀动态匹配文件图片
    matchImg (para) {
      let result = para
      var imgUrl
      if (result == 'pptx' || result == 'ppt' || result == 'dps' || result == 'dpt' || result == 'pot') {
        imgUrl = pptImg
      } else if (result == 'doc' || result == 'txt' || result == 'wps' || result == 'dot' || result == 'docx') {
        imgUrl = wordImg
      } else if (result == 'et' || result == 'xls' || result == 'xlt' || result == 'xlsx' || result == 'xlsm' || result == 'xml' || result == 'cvs' || result == 'cvs') {
        imgUrl = xlsImg
      } else if (result == 'pdf') {
        imgUrl = pdfImg
      }
      return imgUrl
    },
    filterDate (para) {
      let time = parseInt(para + '000')
      return moment(time).format('YYYY-MM-DD HH:mm')
    },
    // 展开大图
    openMask (para) {
      this.imgShow = true
      this.currenImg = para
    },
    // 关闭弹窗
    closeMask () {
      this.imgShow = false
    },
    editIsShowState (item) {
      if (item.isShow == false) {
        this.isShadow = true
      } else {
        this.isShadow = false
      }
      item.isShow = !item.isShow
      this.$forceUpdate()
      // 埋点
      let trackObj = {
        answer_id: item.id
      }
      commonFun.setTrack('4376', this.trackMessages, trackObj, this.backendApi)
    },
    // 点击编辑
    editHandler (para) {
      this.$router.push({path: `/appAnswerQuestion?question_id=${this.quesId}&answer_id=${para}`})
    },
    getData () {
      let params = {
        id: this.quesId
      }
      this.axios.get('backend-api/app-question/detail', {params: params})
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            this.questionInfo = result.question_info
            this.projectName = result.project_name
            this.employeeId = result.employee_id
            this.answerInfo = result.answer_info
            this.questionImg = result.question_img_info
            this.backendApi = result.www_backend_api
            this.trackMessages = result.track_common_property
            this.answerInfo.forEach(element => {
              element.isShow = false
            })
            this.loading = false
          }
        })
        .then(() => {
          let index = this.answerInfo.length - 1
          if (index > -1 && this.answerInfo[index].is_edit) {
            this.$refs.bodyCon.style.paddingBottom = ".55rem"
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 返回
    turnBack () {
      window.history.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  // *{
  //   -webkit-overflow-scrolling: touch;
  // }
  .app-question-detail{
    width: 10rem;
    margin: 0 auto;
    height: 100%;
    .map-wrap{
      position: absolute!important;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .question-wrapper{
      height: 100%;
      overflow-y: auto;
      background-color: #f4f4f4;
      -webkit-overflow-scrolling: touch;
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
            .iconturn-back{
              float: left;
              font-size: 0.6rem;
              font-weight: bold;
              vertical-align: middle;
            }
            .pro-title{
              width: 4.5rem;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              display: inline-block;
            }
          }
        }
      }
      /*内容*/
      .question-box-body{
        -webkit-overflow-scrolling: touch;
        padding: 1.173rem 0 1.706rem 0;
        box-sizing: border-box;
        .content-wrap{
          position:relative;
          background-color: #f4f4f4;
        }
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
              display: inline-block;
              width: 0.48rem;
              height: .48rem;
              line-height: .48rem;
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
          .title-img-wrap{
            margin: .4rem 0;
            overflow: hidden;
            >img{
              float: left;
              margin-right: .1rem;
              width: 1.67rem;
              height: 1.26rem;
              border-radius: 2px;
              overflow: hidden;
            }
          }
          .title-box-info{
            margin-top: 0.266rem;
            font-size: 0.32rem;
            color: #77808a;
            position: relative;
            >div{
              float: right;
            }
            .edit-con{
                width: .426rem;
                height: .426rem;
                >img{
                  width: 100%
                }
            }
            .hand-wrap{
                >span{
                    width: 0;
                    height: 0;
                    border-width: 0 7px 8px;
                    border-style: solid;
                    border-color: transparent transparent #3e4a59;
                    position: absolute;
                    top: -.14rem;
                    right: 0.05rem;
                }
                position: absolute;
                right: 0;
                bottom: -.8rem;
                text-align: center;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
                border-radius: 4px;
                background-color: #3e4a59;
                color: #fff;
                // font-size: .426rem;
                width: 1.5rem;
                height: .75rem;
                line-height: .75rem;
            }
          }
        }
        /*答案区域*/
        .box-body-cont{
          margin-top: 0.266rem;
          background: #fff;
          border-radius: 10px 10px 0 0;
          padding: 0 0.533rem;
          box-sizing: border-box;
          .file-box{
            margin-top: 0.266rem;
            padding-bottom: 0.533rem;
            padding-top: 0.533rem;
            &:after{
              content:".";
              clear: both;
              height: 0;
              overflow: hidden;
              visibility: hidden;
              display: block;
            }
            .file-list-box{
              box-sizing: border-box;
              .item-box{
                margin-bottom:.53rem;
                .answer-title{
                   .title-tip{
                       margin-right: .13rem;
                       display: inline-block;
                       width: 0.48rem;
                       height: .48rem;
                       line-height: .48rem;
                       padding: 1px 0;
                       box-sizing: border-box;
                       text-align: center;
                       background-image: linear-gradient(-180deg, #62CFFF 0%, #33A1FF 100%);
                       border-radius: 4px;
                       font-size: 0.32rem;
                       margin-top: 1px;
                       color: #fff;
                   }
                   .title-info{
                        font-size: 0.346rem;
                        line-height: .5rem;
                        color: #3E4A59;
                   }
                }
                .file-item{
                    margin:0.4rem 0;
                    overflow: hidden;
                    .img-info{
                      overflow: hidden;
                        >img{
                          width: 1.67rem;
                          height: 1.26rem;
                          float: left;
                          margin-right: .13rem;
                          margin-bottom: .13rem;
                          border-radius: 2px;
                          overflow: hidden;
                          &:nth-child(5n){
                            margin-right: 0;
                          }
                        }
                    }
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
                    height: 0.85rem;
                    border: 2px solid #f4f6f9;
                    border-left: none;
                    .down-file{
                        float: right;
                        width: 0.986rem;
                        height: 100%;
                        border-left: 2px solid #f4f6f9;
                        text-align: center;
                        border-radius: 0 0.133rem 0.133rem 0;
                        i{
                            font-size: .5rem;
                            top: .13rem;
                            position: relative;
                            color: #77808A;
                        }
                    }
                    .file-info-cont{
                        overflow: hidden;
                        padding: .07rem 0 0 0.186rem;
                        box-sizing: border-box;
                        .info-cont-tit{
                        width: 4.986rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        font-size: 0.32rem;
                        color: #3e4a59;
                        letter-spacing: 0;
                        line-height: 0.345rem;
                        }
                        .info-cont-info{
                          font-size:.3rem;
                          color: #999;
                        }
                    }
                    }
                }
                .author-wrap{
                  position: relative;
                  margin-top: .266rem;
                  font-size: 0.32rem;
                    .author-data{
                      color:#77808a;
                    }
                    >div{
                        float: right;
                        line-height: .5rem;
                        >img{
                            width: .453rem;
                        }
                    }
                    .edit-con{
                        z-index:2;
                        margin-left: 0.4rem;
                        width: .426rem;
                        height: .426rem;
                        position: relative;
                        top: 2px;
                        img{
                          width:100%;
                        }
                    }
                    .hand-wrap{
                      z-index:2;
                        >span{
                            width: 0;
                            height: 0;
                            border-width: 2px 11px 11px;
                            border-style: solid;
                            border-color: transparent transparent #3e4a59;
                            position: absolute;
                            top: -0.2rem;
                            right: 0.01rem;
                        }
                        position: absolute;
                        right: 0;
                        bottom: -1.1rem;
                        text-align: center;
                        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
                        border-radius: 4px;
                        background-color: #3e4a59;
                        color: #fff;
                        font-size: .426rem;
                        width: 1.5rem;
                        height: 1rem;
                        line-height: 1rem
                    }
                    .give-wrap{
                      >span{
                        font-size: .32rem;
                        i{
                          position: relative;
                          top: 1px;
                          font-size: 0.45rem;
                        }
                      }
                      .number{
                        font-weight: bold;
                      }
                      .give-after{
                         color: #FF4958;
                      }
                      .img-warp{
                        width: .48rem;
                        height: .48rem;
                        display: inline-block;
                        img{
                          width: 100%;
                          height: 100%
                        }
                      }
                    }
                }
                &:last-of-type{
                  margin-bottom:0;
                }
              }
            }
          }
        }
        // 答案无数据
        .noAns{
          background:none;
          .no-answer{
            font-size: .35rem;
            height: 1.5rem;
            color: #bbb;
            text-align: center;
            line-height: 1.5rem;
          }
        }
        // 遮罩层
        .shadow-wrap{
          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          pointer-events:auto;
        }
      }
      .btn-area{
        position: fixed;
        width: 10rem;
        left: 50%;
        bottom: 0;
        margin-left: -5rem;
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
<style lang="less" scoped>
/deep/.mint-msgbox-wrapper{
  .mint-msgbox-title{
    display: none;
  }
}
</style>
