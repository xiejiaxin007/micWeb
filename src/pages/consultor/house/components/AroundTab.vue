<template>
  <div class="sub-component-wrapper">
    <div class="sub-header">
      <div class="result-box">
        <!--tab切换-->
        <div class="result-tab">
          <ul class="result-tab-box">
            <li :class="{'active': tab.key === tabActive}" v-for="(tab, index) in tabList" :key="index" @click="checkTab(tab.key)">
              <div class="tab-item">{{tab.name}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sub-body">
      <div class="list-result-wrapper">
        <!--学校-->
        <div class="normal-box" v-if="checkSecon(tabActive)">
          <ul class="sub-list" v-loading="normalLoading">
            <li v-for="(school, index) in aroundList" :key="index" v-if="school.list.length > 0">
              <div class="result-tab-hd">
                <div class="tab-hd-img"><img src="../images/local_icon.png" alt="图片"></div>
                <div class="tab-hd-tit">{{school.name}}</div>
              </div>
              <div class="result-tab-bd">
                <div class="list-result-box">
                  <div :class="{'list-result-box-item': !(activeIndex.index === index && activeIndex.name === school.name), 'list-result-box-item list-result-box-item-active': (activeIndex.index === index && activeIndex.name === school.name)}"
                       v-for="(item, index) in school.list" @click="chooseItem(item, index, school.name)" :key="'info-' + index">
                    <div class="box-item-right">{{item.dis}}米</div>
                    <div class="box-item-tit">{{item.name}}</div>
                    <div class="line"></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!--二手房-->
        <div class="second-box" v-loading="secondLoading" v-else>
          <div class="second-bot-tit">
            <div class="result-tab-hd">
              <div class="tab-hd-img"><img src="../images/local_icon.png" alt="图片"></div>
              <div class="tab-hd-tit">附近二手房</div>
            </div>
            <div class="data-none" v-if="secondInfo.result ? secondInfo.result.length === 0 : true">暂无</div>
            <div class="result-tab-bd">
              <div class="list-result-box" v-if="secondInfo.result ? secondInfo.result.length > 0 : false">
                <div class="list-result-box-item">
                  <div class="list-result-box-show">
                    <div class="box-item-left">平均单价：</div>
                    <div class="box-item-con font-orange">{{secondInfo.info ? secondInfo.info.averagePrice : ''}}</div>
                  </div>
                  <div class="list-result-box-show">
                    <div class="box-item-left">单价范围：</div>
                    <div class="box-item-con font-orange">{{secondInfo.info ? secondInfo.info.priceRange : ''}}</div>
                  </div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
          </div>
          <ul class="sub-list">
            <li>
              <div class="result-tab-bd">
                <div class="list-result-box">
                  <div :class="{'list-result-box-item': !(activeIndex.index === index), 'list-result-box-item list-result-box-item-active': activeIndex.index === index}" v-for="(second, index) in secondInfo.result" @click="chooseItem(second, index)" :key="'secon-' + index">
                    <div class="box-item-right" v-if="second.price ? second.price.toString() !== 0 : false">{{second.price}}元/㎡</div>
                    <div class="box-item-tit">{{second.communityName}}</div>
                    <div class="line"></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="map-around" style="height: 0;"></div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import { mapState } from 'vuex'
import { commonFun } from '@/assets/js/utils/utils'
import loadMap from '@/assets/js/utils/map.js';
export default {
  name: 'around-tab',
  props: {
    infoObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loc: {},
      infoChangeObj: {}, // 接受父组件参数
      activeIndex: {}, // 选中项当前
      isSecondary: false,
      mapTem: '', // 地图对象
      tabActive: 'school', // 当前tab选中
      tabList: [ // tab列表
        {
          name: '学校',
          key: 'school'
        },
        {
          name: '购物',
          key: 'shopping'
        },
        {
          name: '交通',
          key: 'traffic'
        },
        {
          name: '医院',
          key: 'hospital'
        },
        {
          name: '二手房',
          key: 'second'
        }
      ],
      notAround: true, // 判断当前是否是周边tab
      aroundList: [], // 学校数组
      cityId: '', // 当前的城市id
      shoppingList: [], // 购物数组
      secondLoading: false, // 二手房loading
      normalLoading: false, // 周边loading
      secondInfo: {} // 二手房信息
    }
  },
  mounted () {
    // 订阅下面tab切换
    PubSub.subscribe('tabAround', (msg, data) => {
      this.notAround = false
    })
    // 获取城市id
    this.cityId = this.infoObj.cityId;
    this.infoChangeObj = this.infoObj
    this.loc = this.infoChangeObj.house
    // 确保加载完成才实例化地图
    loadMap.loadMap().then(() => {
        // 实例化地图
      this.mapTem = new BMap.Map('map-around')
      // 渲染数据
      if (this.tabActive === 'second') {
        // 获取二手房数据
        this.getSecond()
      } else {
        if (this.tabActive === 'school') {
          // 组装周边对象
          this.getTabData('school', this.loc)
        } else if (this.tabActive === 'shopping') {
          // 获取购物信息
          this.getTabData('shopping', this.loc)
        } else if (this.tabActive === 'traffic') {
          // 获取购物信息
          this.getTabData('traffic', this.loc)
        } else if (this.tabActive === 'hospital') {
          // 获取购物信息
          this.getTabData('hospital', this.loc)
        }
      }
    });
    // 埋点
    let trackObj = {
      surround_type: '学校'
    }
    commonFun.setTrack('4170', this.trackMessages, trackObj, this.backendApi)
    // 通知当前周报tab
    if (this.notAround) {
      PubSub.publish('surroundType', '学校')
    }
  },
  computed: {
    ...mapState(['trackMessages', 'backendApi'])
  },
  methods: {
    // 点击相应item，回显到地图
    chooseItem (para, paraIndex, paraName) {
      this.activeIndex = {
        index: paraIndex,
        name: paraName
      }
      if (paraName) {
        // 埋点
        let trackObj = {
          surround_type: this.compareName(this.tabActive)
        }
        commonFun.setTrack('3920', this.trackMessages, trackObj, this.backendApi)
        // 周边
        // 给地图组件传值
        PubSub.publish('signAround', para)
      } else {
        // 埋点
        let trackObj = {
          surround_type: '二手房'
        }
        commonFun.setTrack('3920', this.trackMessages, trackObj, this.backendApi)
        // 二手房
        // 给地图组件传值
        PubSub.publish('signCesf', para)
      }
      PubSub.publish('labelLoc', para)
    },
    // 获取二手房数据
    getSecond () {
      let params = {
        order_id: this.$route.query.order_id,
        city_id: this.cityId,
        type: '4', // 二手房代表4
        lng: this.loc.lng,
        lat: this.loc.lat,
        project_id: this.loc.projectId
      }
      // 添加loading动画
      this.secondLoading = true
      this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
        if (res.data.code === 0) {
          this.secondInfo = res.data.data
          // 去掉loading动画
          this.secondLoading = false
          // 给地图组件传值
          if (this.notAround) {
            // 避免正在渲染时候详情页关闭还更改地图的情况
            PubSub.publish('drawCesfList', this.secondInfo.result)
          }
        } else {
          // 去掉loading动画
          this.secondLoading = false
          // 给地图组件传值
          if (this.notAround) {
            PubSub.publish('drawCesfList', [])
          }
        }
      }).catch((err) => {
        // 去掉loading动画
        this.secondLoading = false
        console.log(err)
      })
    },
    // 判断tab展示
    checkSecon (para) {
      return para !== 'second';
    },
    // 切换tab
    checkTab (para) {
      this.activeIndex = {}
      this.tabActive = para
    },
    // 获取周边信息
    getTabData (para, paraLoca) {
      // paraLoca为传递过来的地点
      let axiosList = []
      if (para === 'school') {
        axiosList = [this.getMapApi('小学', paraLoca), this.getMapApi('中学', paraLoca), this.getMapApi('幼儿园', paraLoca)]
      } else if (para === 'shopping') {
        axiosList = [this.getMapApi('商场', paraLoca), this.getMapApi('超市', paraLoca)]
      } else if (para === 'traffic') {
        axiosList = [this.getMapApi('地铁站', paraLoca), this.getMapApi('公交车站', paraLoca), this.getMapApi('高速路口', paraLoca)]
      } else if (para === 'hospital') {
        axiosList = [this.getMapApi('综合医院', paraLoca), this.getMapApi('专科医院', paraLoca)]
      }
      // 清空数组
      this.aroundList = []
      // 添加动画
      this.normalLoading = true
      Promise.all(axiosList).then((result) => {
        this.aroundList = result
        // 去掉动画
        this.normalLoading = false
        // 给地图组件传值
        if (this.notAround) {
          PubSub.publish('drawAroundList', result)
        }
      }).catch((error) => {
        // 去掉动画
        this.normalLoading = false
        console.log(error)
      })
    },
    // 获取百度地图信息
    getMapApi (para, paraLoca) {
      let _this = this
      let list = {}
      let p = new Promise((resolve, reject) => {
        let mpoint = new BMap.Point(parseFloat(paraLoca.lng), parseFloat(paraLoca.lat))
        this.mapTem.centerAndZoom(mpoint, 11)
        let options = {
          onSearchComplete: function (results) {
            // 判断状态是否正确
            let s = []
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              let obj = {
                name: results.getPoi(i).title,
                address: results.getPoi(i).address,
                location: results.getPoi(i).point
              }
              s.push(obj)
            }
            list.name = para
            list.list = _this.getDistance(s)
            resolve(list)
          }
        }
        let local = new BMap.LocalSearch(this.mapTem, options)
        local.searchNearby(para, mpoint, 3000)
      })
      return p
    },
    // 匹配tab中文
    compareName (para) {
      let tabName = ''
      switch (para) {
        case 'second': tabName = '二手房'
          break
        case 'school': tabName = '学校'
          break
        case 'shopping': tabName = '购物'
          break
        case 'traffic': tabName = '交通'
          break
        case 'hospital': tabName = '医疗'
          break
      }
      return tabName
    },
    // 组装周边信息
    getDistance (para) {
      let distace = []
      // aroundList
      for (let i = 0; i < para.length; i++) {
        let start = new BMap.Point(parseFloat(this.loc.lng), parseFloat(this.loc.lat))
        let end = new BMap.Point(para[i].location.lng, para[i].location.lat)
        let obj = {
          dis: this.mapTem.getDistance(start, end).toFixed(0),
          name: para[i].name,
          address: para[i].address,
          lng: para[i].location.lng,
          lat: para[i].location.lat
        }
        distace.push(obj)
      }
      return distace
    }
  },
  watch: {
    tabActive: {
      handler: function (val, oldval) {
        if (this.tabActive === 'second') {
          // 获取二手房数据
          this.getSecond()
        } else {
          if (this.tabActive === 'school') {
            // 组装周边对象
            this.getTabData('school', this.loc)
          } else if (this.tabActive === 'shopping') {
            // 获取购物信息
            this.getTabData('shopping', this.loc)
          } else if (this.tabActive === 'traffic') {
            // 获取购物信息
            this.getTabData('traffic', this.loc)
          } else if (this.tabActive === 'hospital') {
            // 获取购物信息
            this.getTabData('hospital', this.loc)
          }
        }
        // 埋点
        let trackObj = {
          surround_type: this.compareName(this.tabActive)
        }
        commonFun.setTrack('4170', this.trackMessages, trackObj, this.backendApi)
        // 通知当前周报tab
        if (this.notAround) {
          PubSub.publish('surroundType', this.compareName(this.tabActive))
        }
      },
      deep: true
    },
    // 监听父组件传过来的值
    infoObj: {
      handler: function (val, oldval) {
        // 获取城市id
        this.cityId = this.infoObj.cityId
        this.infoChangeObj = this.infoObj
        this.loc = this.infoChangeObj.house
        // 通知当前周报tab
        if (this.notAround) {
          PubSub.publish('surroundType', '学校')
        }
        this.getTabData('school', this.loc)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .sub-component-wrapper{
    height: 100%;
  }
  .sub-header{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    border-bottom: 1px solid rgba(152,152,152,0.10);
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.10);
    z-index: 98;
  }
  .search-result-box{
    margin: 9px 10px;
    overflow: hidden;
  }
  .data-none{
    margin: 10px 0 0 40px;
    color: #666;
    font-size: 14px;
  }
  .result-tab{
    padding: 24px 0 16px;
    box-sizing: border-box;
  }
  .result-tab-box{
    overflow: hidden;
    margin-left: 20px;
  }
  .result-tab-box > li{
    float: left;
    margin-right: 38px;
    cursor: pointer;
  }
  .result-tab-box > li:last-of-type{
    margin-right: 0;
  }
  .result-tab-box > li .tab-item{
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
    font-weight: 600;
  }
  .result-tab-box > li.active .tab-item{
    font-size: 16px;
    color: #33a1ff;
    line-height: 22px;
    padding-bottom: 6px;
    border-bottom: 2px solid #33a1ff;
  }
  .sub-list > li{
    margin-top: 20px;
  }
  .result-tab-hd{
    overflow: hidden;
    margin-left: 20px;
  }
  .result-tab-hd .tab-hd-img{
    float: left;
    width: 14px;
    height: 14px;
    margin: 3px 6px 0 0;
  }
  .tab-hd-img > img{
    width: 100%;
    height: 100%;
  }
  .result-tab-hd .tab-hd-tit{
    overflow: hidden;
    font-size: 14px;
    color: #3e4254;
    font-weight: 600;
  }
  .result-tab-bd{
    box-sizing: border-box;
  }
  .list-result-box-item{
    padding: 12px 20px 0 40px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .list-result-box-show{
    margin-bottom: 10px;
  }
  .list-result-box-show:last-of-type{
    margin-bottom: 0;
  }
  .list-result-box-show .box-item-left{
    float: left;
    color: #333;
    line-height: 20px;
  }
  .list-result-box-show .box-item-con{
    overflow: hidden;
    font-size: 14px;
    color: #333;
    line-height: 20px;
  }
  .list-result-box-show .font-orange{
    color: #ff8e0c;
  }
  .list-result-box-item-active{
    background-color: #e3f6fe;
  }
  .second-bot-tit .list-result-box-item{
    cursor: default;
  }
  .list-result-box-item .box-item-right{
    float: right;
    margin-left: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #77808a;
  }
  .normal-box >>> .el-loading-mask{
    top: 70px;
  }
  .second-box .list-result-box-item .box-item-right{
    color: #ff5c47;
  }
  .list-result-box-item .box-item-tit{
    overflow: hidden;
    line-height: 20px;
    white-space: nowrap;
    text-overflow:ellipsis;
    font-size: 14px;
    color: #333;
  }
  .line{
    height: 0;
    border-bottom: 1px dashed #e6e6e6;
    margin-top: 12px;
  }
  .second-box .sub-list > li:first-of-type{
    margin-top: 0;
  }
  .second-bot-tit .line{
    margin-top: 20px;
  }
  .second-bot-tit{
    margin-top: 20px;
  }
  .box-pay{
    overflow: hidden;
  }
  .box-pay .pay-item{
    float: left;
    width: 103px;
    margin-right: 10px;
  }
  .box-pay .pay-item:last-of-type{
    margin-right: 0;
  }
  .pay-item .pay-item-th{
    float: left;
    font-size: 12px;
    color: #333;
    line-height: 22px;
    margin-right: 4px;
  }
  .pay-item .pay-item-td{
    overflow: hidden;
  }
  .pay-item .pay-item-td >>> .el-input__inner{
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    padding: 0 4px;
    border-radius: 0;
  }
  .pay-item .sele-unit >>> .el-input__suffix-inner{
    display: none;
  }
  .pay-item .sele-unit >>> .el-input__suffix:after{
    content: '%';
    position: absolute;
    right: 0;
    font-size: 12px;
    line-height: 22px;
  }
  .pay-item .pay-item-td >>> .el-input__suffix{
    right: 3px;
  }
  .pay-item .pay-item-td >>> .el-input__icon{
    font-size: 12px;
    line-height: 22px;
    width: 12px;
  }
  .box-choose{
    margin-top: 8px;
  }
  .choose-door{
    overflow: hidden;
  }
  .choose-door > li{
    float: left;
    margin-right: 12px;
  }
  .choose-door > li:last-of-type{
    margin-right: 0;
  }
  .choose-door > li .door-item{
    padding: 2px 6px;
    border: 1px solid #ccc;
    font-size: 12px;
    color: #77808a;
    cursor: pointer;
  }
  .choose-door > li.active .door-item{
    border: 1px solid #33a1ff;
    background-color: #e3f6fe;
    color: #33a1ff;
  }
  .door-list{
    margin: 0 20px;
  }
  .door-list > li{
    padding: 20px 0;
    box-sizing: border-box;
    border-bottom: 1px dashed #e6e6e6;
  }
  .door-list > li:last-of-type{
    margin-bottom: 0;
  }
  .door-item-row > div{
    float: left;
  }
  .door-item .door-item-row{
    overflow: hidden;
    margin-bottom: 10px;
  }
  .door-item .door-item-row:last-of-type{
    margin-bottom: 0;
  }
  .door-item-tit{
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
    margin-right: 10px;
  }
  .door-item-label{
    margin-right: 6px;
    border-radius: 2px;
    font-size: 12px;
    padding: 0 6px;
    line-height: 17px;
    color: #77808A;
    background: #eaf2fb;
    margin-top: 2px;
  }
  .door-item-label:last-of-type{
    margin-right: 0;
  }
  .green-label{
    color: #6ac073;
    background: rgba(106,192,115,0.20);
  }
  .door-item-price{
    font-size: 14px;
    color: #333;
    margin-right: 10px;
  }
  .door-item-price:last-of-type{
    margin-right: 0;
  }
  .item-price-red{
    color: #ff5c47;
  }
  .door-item-row .door-item-btn{
    float: right;
    width: 60px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 12px;
    border-radius: 2px;
  }
  .door-item-row .door-item-unactive{
    background: #c9c9c9;
    box-shadow: 0 0 5px 0 rgba(69,69,83,0.10);
    color: #3e4254;
  }
  .door-item-row .door-item-active{
    background: #33a1ff;
    color: #fff;
  }
  .result-box-left{
    float: left;
    width: 16px;
    height: 16px;
    margin: 15px 20px 0 0;
  }
  .result-box-right{
    overflow: hidden;
    font-size: 14px;
    color: #333;
  }
  .result-box-right > p{
    height: 20px;
    line-height: 20px;
  }
  .result-box-right .right-tit{
    font-size: 16px;
    color: #3e4254;
    line-height: 22px;
    margin-bottom: 6px;
  }
  .sub-body{
    padding-top: 70px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .list-result > li{
    margin-bottom: 12px;
    box-sizing: border-box;
  }
  .list-result > li:last-of-type{
    margin-bottom: 0;
  }
  .list-result-hd{
    overflow: hidden;
    margin: 20px 20px 0 20px;
  }
  .list-result-hd .result-hd-img{
    float: left;
    width: 14px;
    height: 14px;
    margin: 3px 6px 0 0;
  }
  .list-result-hd .result-hd-tit{
    overflow: hidden;
    font-size: 14px;
    color: #3e4254;
  }
  .list-result-bd{
    padding: 12px 20px 12px 40px;
    box-sizing: border-box;
  }
  .list-result-bd:hover{
    background-color: #e3f6fe;
  }
  .bd-tip{
    display: inline-block;
    padding: 2px 6px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    margin-bottom: 10px;
  }
  .bd-tip-green{
    background-color: #6ac073;
  }
  .box-discrib{
    font-size: 0;
    overflow: hidden;
  }
  .box-discrib .time-sub{
    float: left;
    font-size: 14px;
    color: #333;
    margin-left: 10px;
    line-height: 20px;
  }
  .box-discrib .time-sub:first-of-type{
    margin-left: 0;
  }
  .time-sub .time-sub-icon{
    float: left;
    width: 14px;
    height: 14px;
    margin: 3px 6px 0 0;
  }
  .time-sub > span{
    overflow: hidden;
  }
  .box-discrib > span{
    font-size: 14px;
    color: #333;
    margin-left: 10px;
    line-height: 20px;
  }
  .box-discrib > span:first-of-type{
    margin-left: 0;
  }
  .list-result > li.drive-box{
    margin-bottom: 22px;
  }
  .list-result > li.drive-box:last-of-type{
    margin-bottom: 0;
  }
  .line-box{
    margin-top: 10px;
  }
  .line-box:after{
    content: '';
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
  }
  .line-item{
    float: left;
    margin: 0  0 10px 10px;
  }
  .line-item:after{
    content: '';
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
  }
  .line-item:first-of-type{
    margin-left: 0;
  }
  .line-item .item-info{
    float: left;
  }
  .line-item .item-info-next{
    width: 8px;
    height: 8px;
    margin: 8px 10px 0 0;
  }
  .line-item .item-into-btn{
    padding: 4px 10px;
    border-radius: 25px;
    background-color: #33a1ff;
    color: #fff;
    font-size: 12px;
  }
  .line-item .item-car{
    background-color: #fff;
    border: 1px solid #33a1ff;
    color: #33a1ff;
  }
  .item-into-btn .item-info-pic{
    float: left;
    width: 14px;
    height: 14px;
    margin: 2px 6px 0 0;
  }
  .item-info-text{
    overflow: hidden;
  }
  .line-box-info-list{
    overflow: hidden;
  }
  .line-box-info-list > li{
    float: left;
  }
  .line-box-info-list > li .list-txt{
    font-size: 14px;
    color: #abb0b5;
    line-height: 20px;
  }
  .list-txt .seperate-doc{
    color: #33a1ff;
    width: 7px;
    line-height: 20px;
    margin: 0 4px;
  }
  .body-his-list .his-hd{
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
  }
  .body-his-list .his-bd{
    margin-top: 20px;
  }
  .his-list-box > li{
    margin-bottom: 26px;
    font-size: 14px;
    color: #333;
    line-height: 20px;
    overflow: hidden;
  }
  .his-list-box > li:last-of-type{
    margin-bottom: 0;
  }
  .item-pic{
    float: left;
    margin: 3px 6px 0 0;
  }
  .item-txt{
    overflow: hidden;
  }
</style>
