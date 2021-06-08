<template>
  <div class="side-page-wrapper">
    <!--头部-->
    <div class="side-page-header">
      <div class="header-close" @click="closeSidePage"><img src="../images/icon_close_side.png" alt="图片"></div>
      <div :class="{'header-btn header-error hover-color': errorHover, 'header-btn header-error': !errorHover}" @mouseenter="errorHover = true" @mouseleave="errorHover = false" @click="upError"><i aria-hidden="true"></i><span class="header-btn-tip">报错</span></div>
      <div :class="{'header-btn header-loction hover-loction-color': locaHover, 'header-btn header-loction': !locaHover}" @mouseenter="locaHover = true" @mouseleave="locaHover = false" @click="location"><i aria-hidden="true"></i><span class="header-btn-tip">定位</span></div>
      <div :class="{'header-btn header-share hover-sharen-color': shareHover, 'header-btn header-share': !shareHover}" @mouseenter="shareHover = true" @mouseleave="shareHover = false" @click="goShare"><i aria-hidden="true"></i><span class="header-btn-tip">分享</span></div>
      <div class="header-title">{{infoObj.house.name}}</div>
    </div>
    <!--子组件展示-->
    <div class="side-page-body">
      <div class="side-sub-box">
        <!--通勤-->
        <commuting-search v-if="currentTab.key === 'commu'" :infoObj="infoObj"></commuting-search>
        <!--户型-->
        <door-tab v-if="currentTab.key === 'door'" :infoObj="infoObj"></door-tab>
        <!--周边-->
        <around-tab v-if="currentTab.key === 'around'" :infoObj="infoObj"></around-tab>
        <!--iframe-->
        <iframe v-else id="iframeShow" frameborder=0 name="showHere" width="100%" height="100%" scrolling=auto :src="currentTab.iframeSrc"></iframe>
      </div>
    </div>
    <!--底部-->
    <div class="side-page-footer">
      <ul class="footer-tab">
        <li v-for="(tab, index) in tabList" :key="index" @click="chooseTab(tab)">
          <div class="tab-item">
            <div class="tab-item-pic">
              <img v-if="currentTab.key === tab.key" :src="tab.img.activeImg" alt="图片">
              <img v-else :src="tab.img.unActiveImg" alt="图片">
            </div>
            <div :class="{'tab-item-con': !(currentTab.key === tab.key), 'tab-item-con tab-item-cheched': currentTab.key === tab.key}">{{tab.name}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommutingSearch from './CommutingSearch'
import AroundTab from './AroundTab'
import DoorTab from './DoorTab'
import PubSub from 'pubsub-js'
import iframInfoImg from '../images/icon_info.png'
import doorImg from '../images/icon_door.png'
import iframComImg from '../images/icon_com.png'
import iframVerImg from '../images/icon_ver.png'
import aroundImg from '../images/icon_around.png'
import commuImg from '../images/icon_commu.png'
import iframInfoAcImg from '../images/icon_info_active.png'
import doorAcImg from '../images/icon_door_active.png'
import iframComAcImg from '../images/icon_com_active.png'
import iframVerAcImg from '../images/icon_ver_active.png'
import aroundAcImg from '../images/icon_around_active.png'
import commuAcImg from '../images/icon_commu_active.png'
import { commonFun } from '@/assets/js/utils/utils'
import {trackAxios} from '@/assets/js/http/axios'
export default {
  name: 'side-page',
  props: {
    // 输入的详情对象
    infoObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isTabActive: true, // tab切换激活标志
      displayNone: false,
      infoChangeObj: {}, // 详情对象
      currentTab: {}, // 当前tab切换项
      errorHover: false, // 错误按钮是否鼠标悬停
      locaHover: false, // 定位按钮同上
      shareHover: false, // 分享按钮同时
      // 真实城市多出来的tab
      virtualTabList: [
        {
          name: '详情',
          key: 'iframInfo',
          iframeSrc: '',
          img: {
            activeImg: iframInfoAcImg,
            unActiveImg: iframInfoImg
          }
        },
        {
          name: '周边',
          key: 'around',
          img: {
            activeImg: aroundAcImg,
            unActiveImg: aroundImg
          }
        },
        {
          name: '通勤',
          key: 'commu',
          img: {
            activeImg: commuAcImg,
            unActiveImg: commuImg
          }
        }
      ],
      // 实际tab列表
      tabList: [],
      realTabList: [ // tab列表，选中图片需要补充
        {
          name: '详情',
          key: 'iframInfo',
          iframeSrc: '',
          img: {
            activeImg: iframInfoAcImg,
            unActiveImg: iframInfoImg
          }
        },
        {
          name: '户型',
          key: 'door',
          img: {
            activeImg: doorAcImg,
            unActiveImg: doorImg
          }
        },
        {
          name: '点评',
          key: 'iframCom',
          iframeSrc: '',
          img: {
            activeImg: iframComAcImg,
            unActiveImg: iframComImg
          }
        },
        {
          name: '动态',
          key: 'iframVer',
          iframeSrc: '',
          img: {
            activeImg: iframVerAcImg,
            unActiveImg: iframVerImg
          }
        },
        {
          name: '周边',
          key: 'around',
          img: {
            activeImg: aroundAcImg,
            unActiveImg: aroundImg
          }
        },
        {
          name: '通勤',
          key: 'commu',
          img: {
            activeImg: commuAcImg,
            unActiveImg: commuImg
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['cityInfo', 'trackMessages', 'backendApi'])
  },
  components: {CommutingSearch, AroundTab, DoorTab},
  mounted () {
    // 获取当前选择的城市缩写
    this.infoChangeObj = this.infoObj
    // 判断是否是虚拟城市
    if (this.infoObj && !this.infoObj.isReal) {
      // 如果是虚拟城市，需要隐藏下面的tab---户型、动态、点评
      this.tabList = this.virtualTabList;
      this.currentTab = this.tabList[0];
      this.currentTab.iframeSrc = this.infoObj.villageUrl;
    } else {
      this.tabList = this.realTabList;
      // 拼城市缩写
      let CurUrl = ''
      if (this.infoObj && this.infoObj.cityId !== undefined && this.infoObj.cityId.toString() !== '2') {
        // 如果是北京就不用加
        CurUrl = this.infoObj.abbreviationName + '/'
      }
      // 循环一遍找到相应对象
      this.tabList.map((item) => {
        if (item.key === this.infoObj.tab) {
          if (this.infoObj.tab === 'iframInfo') {
            this.currentTab = item
            this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/details.html'
          } else if (this.infoObj.tab === 'iframCom') {
            this.currentTab = item
            this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/exportcom.html'
          } else if (this.infoObj.tab === 'iframVer') {
            this.currentTab = item
            this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/news.html'
          } else {
            this.currentTab = item
          }
          // 埋点
          let trackObj = {
            tab_type: this.compareTab(this.currentTab)
          }
          this.trackMethod(trackObj, '3912')
          return item
        }
      })
    }
  },
  methods: {
    // 点击上报
    upError () {
        PubSub.publish("openReportModal", {
            name: this.infoObj.house.name,
            city_id: this.infoObj.cityId
        });
    },
    // 定位
    location () {
      PubSub.publish('location', this.infoObj.house)
    },
    // 分享
    goShare () {
      let routeData = this.$router.resolve({
        path: `/singleHouseShare`,
        query: {
            // 当前楼盘的城市ID
            city_id: this.infoObj.cityId,
            // 订单ID
            order_id: this.$route.query.order_id,
            // 楼盘ID
            project_id: this.infoObj.house.projectId,
            // 当前楼盘的城市name
            city_name: this.infoObj.cityName,
            // 当前选择城市ID {String} 例：'2000001,2000003'
            currentCityId: this.cityInfo.cityId,
            // 当前选择城市name {String} 例：'北京,廊坊'
            currentCity: this.cityInfo.cityName
        }
      })
      window.open(routeData.href, '_blank')
    },
    // 选择tab切换
    chooseTab (para) {
      // 判断是否是虚拟城市
      if (this.infoObj && !this.infoObj.isReal) {
        this.currentTab = para;
        this.currentTab.iframeSrc = this.infoObj.villageUrl;
      } else {
        // 拼城市缩写
        let CurUrl = ''
        if (this.infoObj && this.infoObj.cityId !== undefined && this.infoObj.cityId.toString() !== '2') {
          // 如果是北京就不用加
          CurUrl = this.infoObj.abbreviationName + '/'
        }
        // 循环一遍找到相应对象
        this.tabList.map((item) => {
          if (item.key === para.key) {
            if (para.key === 'iframInfo') {
              this.currentTab = para
              this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/details.html'
            } else if (para.key === 'iframCom') {
              this.currentTab = para
              this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/exportcom.html'
            } else if (para.key === 'iframVer') {
              this.currentTab = para
              this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/news.html'
            } else {
              this.currentTab = para
            }
          }
        })
      }
      if (para.key !== 'commu') {
        // 当前不是通勤，则删除地图中已经画好的路线
        PubSub.publish('closeTab')
      }
      if (para.key !== 'around') {
        // 当前不是周边，则恢复地图中的筛选内容
        PubSub.publish('tabAround')
      }
      // 埋点
      let trackObj = {
        tab_type: this.compareTab(para)
      }
      this.trackMethod(trackObj, '3912')
    },
    // 对应tab名称
    compareTab (para) {
      let tabName = ''
      switch (para.key) {
        case 'iframInfo': tabName = '详情'
          break
        case 'door': tabName = '户型'
          break
        case 'iframCom': tabName = '点评'
          break
        case 'iframVer': tabName = '动态'
          break
        case 'around': tabName = '周边'
          break
        case 'commu': tabName = '通勤'
          break
      }
      return tabName
    },
    // 埋点方法
    trackMethod (paraObj, trackId) {
      // 组装埋点数据
      let moreInfo = {
        screen_height: commonFun.ScreenHeight(),
        screen_width: commonFun.ScreenWidth(),
        device_type: commonFun.getDevice().device,
        os: commonFun.getOS().os,
        os_version: commonFun.getOS().os_version,
        browser: commonFun.getBrowse().browser,
        browser_version: commonFun.getBrowse().browser_version
      }
      let trackAll = Object.assign({}, moreInfo, this.trackMessages)
      let ex = {ini_params: trackAll}
      let trackExtr = Object.assign({}, paraObj, ex)
      let trackData = {
        extrack_arr: trackExtr,
        track_id: trackId
      }
      // 请求埋点接口
      trackAxios.post(this.backendApi + '/send-data/index', trackData).then(() => {
      }).catch((err) => {
        console.log(err)
      })
    },
    // 关闭当前详情窗口
    closeSidePage () {
      // 关闭右侧详情，去掉地图中的通勤线路
      PubSub.publish('closeTab')
      // 关闭右侧详情，去掉地图选中楼盘
      PubSub.publish('closePage')
      this.$emit('closeSidePage', false)
    }
  },
  watch: {
    infoObj: {
      handler: function (val, oldval) {
        this.infoChangeObj = this.infoObj
        // 判断是否是虚拟城市
        if (this.infoObj && !this.infoObj.isReal) {
          this.tabList = this.virtualTabList;
          this.currentTab = this.tabList[0];
          this.currentTab.iframeSrc = this.infoObj.villageUrl;
        } else {
          this.tabList = this.realTabList;
          // 拼城市缩写
          let CurUrl = ''
          if (this.infoObj && this.infoObj.cityId !== undefined && this.infoObj.cityId.toString() !== '2') {
            // 如果是北京就不用加
            CurUrl = this.infoObj.abbreviationName + '/'
          }
          // 循环一遍找到相应对象
          this.tabList.map((item) => {
            if (item.key === this.infoObj.tab) {
              if (this.infoObj.tab === 'iframInfo') {
                this.currentTab = item
                this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/details.html'
              } else if (this.infoObj.tab === 'iframCom') {
                this.currentTab = item
                this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/exportcom.html'
              } else if (this.infoObj.tab === 'iframVer') {
                this.currentTab = item
                this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/news.html'
              } else {
                this.currentTab = item
              }
              // 埋点
              let trackObj = {
                tab_type: this.compareTab(this.currentTab)
              }
              this.trackMethod(trackObj, '3912')
              return item
            }
          })
        }
      },
      deep: true
    },
    // 监听城市信息
    cityInfo: {
      handler: function (val, oldval) {
        // 获取城市缩写
        this.infoChangeObj = this.infoObj
        // 判断是否是虚拟城市
        if (this.infoObj && !this.infoObj.isReal) {
          this.tabList = this.virtualTabList;
          this.currentTab = this.tabList[0];
          this.currentTab.iframeSrc = this.infoObj.villageUrl;
        } else {
          // 拼城市缩写
          let CurUrl = ''
          if (this.infoObj && this.infoObj.cityId !== undefined && this.infoObj.cityId.toString() !== '2') {
            // 如果是北京就不用加
            CurUrl = this.infoObj.abbreviationName + '/'
          }
          // 循环一遍找到相应对象
          this.tabList.map((item) => {
            if (item.key === this.infoObj.tab) {
              if (this.infoObj.tab === 'iframInfo') {
                this.currentTab = item
                this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/details.html'
              } else if (this.infoObj.tab === 'iframCom') {
                this.currentTab = item
                this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/exportcom.html'
              } else if (this.infoObj.tab === 'iframVer') {
                this.currentTab = item
                this.currentTab.iframeSrc = 'https://m.julive.com/' + CurUrl + 'project/' + this.infoObj.house.projectId + '/news.html'
              } else {
                this.currentTab = item
              }
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .side-page-wrapper{
    position: relative;
    width: 350px;
    height: 100%;
    background-color: #fff;
  }
  .side-page-header{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 56px;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
    line-height: 56px;
    z-index: 99;
  }
  .header-close{
    position: absolute;
    top: 20px;
    left: 20px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .header-close > img{
    width: 100%;
    height: 100%;
  }
  .header-btn{
    position: absolute;
    top: 50%;
    right: 20px;
    width: 24px;
    line-height: normal;
    text-align: center;
    transform: translate(0,-50%);
    cursor: pointer;
    font-size: 0;
  }
  .header-btn span{
    display: inline-block;
    width: 100%;
    font-size: 12px;
    line-height: 17px;
    font-weight: bold;
    color: #3e4a59;
    white-space: nowrap;
  }
  .header-btn i{
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-bottom: 2px;
  }
  .header-error{
    right: 96px;
  }
  .hover-color span.header-btn-tip{
    color: #FF5C47;
  }
  .header-error i{
    background: url("../images/header-error.png") no-repeat center;
    background-size: contain;
  }
  .header-loction{
    right: 58px;
    color: #FF8800;
  }
  .hover-loction-color span.header-btn-tip{
    color: #FF8800;
  }
  .header-loction i{
    background: url("../images/header-loction.png") no-repeat center;
    background-size: contain;
  }
  .header-share{
    right: 20px;
    color: #33A1FF;
  }
  .hover-sharen-color span.header-btn-tip{
    color: #33A1FF;
  }
  .header-share i{
    background: url("../images/header-share.png") no-repeat center;
    background-size: contain;
  }
  .header-title{
    font-size: 16px;
    color: #333;
    text-align: left;
    margin: 0 140px 0 56px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    font-weight: 700;

  }
  .side-page-body{
    height: 100%;
    padding: 56px 0 64px 0;
    box-sizing: border-box;
  }
  .side-sub-box{
    position: relative;
    height: 100%;
  }
  .side-page-footer{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    box-shadow: 0 -2px 4px 0 rgba(0,0,0,0.10);
    z-index: 99;
    background-color: #fff;
  }
  .footer-tab {
    display: flex;
  }
  .footer-tab > li{
    /* width: 58px; */
    height: 100%;
    flex: 1;
    text-align: center;
    cursor: pointer;
  }
  .tab-item-pic{
    width: 18px;
    height: 18px;
    margin: 10px auto 6px;
  }
  .tab-item-pic > img{
    width: 100%;
    height: 100%;
  }
  .tab-item-con{
    text-align: center;
    font-size: 14px;
    color: #3e4254;
  }
  .footer-tab > li:hover .tab-item-con{
    color: #33a1ff;
  }
  .tab-item-cheched{
    color: #33a1ff;
  }
  .footer-tab-active{
    color: #33a1ff;
  }
</style>
