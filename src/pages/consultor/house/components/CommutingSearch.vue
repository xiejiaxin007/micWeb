<template>
  <div class="sub-component-wrapper">
    <div class="commu-search" v-if="searchFlag">
      <div class="sub-header">
        <div class="search-box">
          <el-input placeholder="目的地：请输入搜索" id="search-input" prefix-icon="el-icon-search" v-model="searchCon"></el-input>
        </div>
      </div>
      <div class="sub-body">
        <div class="sub-body-list-box">
          <div class="sub-body-tip">请输入可能频繁往返的地址，如工作地点等或在下方历史地址中直接点击选择</div>
          <div class="body-his-list">
            <div class="his-hd">历史地址</div>
            <div class="his-bd">
              <ul class="his-list-box">
                <li v-for="(his, index) in hisLocal" :key="'hisLocal-' + index" @click="chooseHisLocal(index)">
                  <div class="item-pic"><img src="../images/list-position.png" alt="图片"></div>
                  <div class="item-txt">{{his.address}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="commu-result" v-else>
      <div class="sub-header">
        <div class="search-result-box">
          <div class="result-box-left" @click="turnSearch">
            <img src="../images/icon_turn.png" alt="图片">
          </div>
          <div class="result-box-right">
            <p class="right-tit">{{loc.name}}</p>
            <p>{{commuLoc.name}}</p>
          </div>
        </div>
      </div>
      <div class="sub-body">
        <div class="list-result-wrapper">
          <ul class="list-result" v-loading="commuLoading">
            <li class="drive-box">
              <div class="result-box">
                <div class="list-result-hd">
                  <div class="result-hd-img"><img src="../images/local_icon.png" alt="图片"></div>
                  <div class="result-hd-tit">驾车</div>
                </div>
                <div v-if="carInfo.duration && carInfo.distance" :class="{'list-result-bd': !(carActiveIndex === 0), 'list-result-bd list-result-bd-active': carActiveIndex === 0}"
                     @click="chooseCarLine">
                  <div class="list-result-box">
                    <div class="result-bd-box">
                      <div class="box-discrib">
                        <span>{{carInfo.duration}}分钟</span>
                        <span>{{carInfo.distance}}公里</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="result-box">
                <div class="list-result-hd">
                  <div class="result-hd-img"><img src="../images/local_icon.png" alt="图片"></div>
                  <div class="result-hd-tit">公交/地铁</div>
                </div>
                <div :class="{'list-result-bd': !(busActiveIndex === index), 'list-result-bd list-result-bd-active': busActiveIndex === index}"
                     v-for="(bus, index) in busInfo" :key="'bus-' + index" @click="chooseBusLine(index)">
                  <div class="list-result-box">
                    <div class="bd-tip bd-tip-green" v-if="index === 0">最快</div>
                    <div class="result-bd-box">
                      <div class="box-discrib">
                        <div class="time-sub">{{bus.useTime}}分钟</div>
                        <div class="time-sub">
                          <div class="time-sub-icon"><img src="../images/work_by_foot.png" alt="图片"></div>
                          <span>{{bus.walkDistance}}米</span>
                        </div>
                      </div>
                      <div class="line-box">
                        <div class="line-item" v-for="(line, index) in bus.busLine" :key="'line-' + index">
                          <div :class="{'item-info item-into-btn item-bus': line.type.toString() !== '1', 'item-info item-into-btn item-car': line.type.toString() === '1'}">
                            <div class="item-info-pic">
                              <img src="../images/transit_icon.png" alt="图片" v-if="line.type.toString() === '1'">
                              <img src="../images/metro_icon.png" alt="图片" v-else>
                            </div>
                            <div class="item-info-text">{{line.name}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="line-box-info">
                        <ul class="line-box-info-list">
                          <li>
                            <div class="list-txt">{{bus.stopNum}}站</div>
                          </li>
                          <li>
                            <div class="list-txt"><span class="seperate-doc">·</span><span>{{bus.ticketPrice}}元</span></div>
                          </li>
                          <li>
                            <div class="list-txt"><span class="seperate-doc">·</span><span>{{bus.onStation}}</span></div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="map-info-search" style="height: 0;"></div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import loadMap from '@/assets/js/utils/map.js';
import { mapState } from 'vuex'
export default {
  name: 'commuting-page',
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
      loc: {}, // 楼盘经纬度
      searchCon: '', // 搜索框绑定
      searchFlag: true, // 是否展示搜索框
      infoChangeObj: {}, // 详情对象
      map: '', // 地图实例
      carInfo: {}, // 驾车信息
      busInfo: [], // 公交信息
      carActiveIndex: '', // 驾车当前选中项
      busActiveIndex: '', // 公交
      cityId: '', // 当前城市id
      commuLoading: false, // 通勤结果loading
      tabNot: true, // 当前是否是通勤
      checkAddress: {
        name: '',
        point: {}
      }, // 选择的地址
      hisLocal: [], // 历史地址
      ac: '' // 输入框实例
    }
  },
  computed: {
    ...mapState('house', ['commuLoc'])
  },
  mounted () {
    // 获取城市id
    this.cityId = this.infoObj.cityName;
    // 订阅下面tab切换
    PubSub.subscribe('closeTab', (msg, data) => {
      this.tabNot = false
    })
    // 确保加载完成才实例化地图
    loadMap.loadMap().then(() => {
      this.init();
    });
  },
  methods: {
    // 初始化
    init() {
      // 判断是否有通勤
      if (this.commuLoc.name) {
        this.searchFlag = false
      } else {
        this.searchFlag = true
      }
      this.map = new BMap.Map('map-info-search')
      // 获取父组件传递的值
      this.infoChangeObj = this.infoObj
      this.loc = this.infoChangeObj.house
      // 默认进来就没有通勤地址
      if (this.searchFlag) {
        // 初始化input框
        this.initInput()
        let params = {
          order_id: this.$route.query.order_id,
          type: '2',
          addressType: '1'
        }
        this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
          if (res.data.code === 0) {
            this.hisLocal = res.data.data.slice(0, 10)
          }
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.commuLoading = true
        this.carInfo = {}
        this.busInfo = []
        let params = {
          order_id: this.$route.query.order_id,
          type: '3',
          endLng: this.commuLoc.point.lng,
          endLat: this.commuLoc.point.lat,
          startLng: this.loc.lng,
          startLat: this.loc.lat
        }
        this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
          if (res.data.code === 0) {
            this.carInfo = res.data.data.car
            this.busInfo = res.data.data.bus
            this.commuLoading = false
            // 如果是当前是通勤（避免通勤正在请求就进行tab切换）
            if (this.tabNot) {
              // 默认选择驾车
              this.chooseCarLine()
            }
          } else {
            this.commuLoading = false
          }
        }).catch((err) => {
          this.commuLoading = true
          console.log(err)
        })
      }
    },
    // 选择线路
    chooseBusLine (paraIndex) {
      this.busActiveIndex = paraIndex
      // 相互对立
      this.carActiveIndex = ''
      // type为1，代表有换乘点，也就是公交路线
      let pubData = {
        driveRoute: this.busInfo[paraIndex].driveRoute,
        transfer: this.busInfo[paraIndex].transfer,
        type: 1
      }
      PubSub.publish('locPath', pubData)
    },
    chooseCarLine () {
      this.carActiveIndex = 0
      // 相互对立
      this.busActiveIndex = ''
      if (this.tabNot) {
        let pubData = {
          driveRoute: this.carInfo.driveRoute,
          type: 2
        }
        PubSub.publish('locPath', pubData)
      }
    },
    // 点击历史记录
    chooseHisLocal (para) {
      let obj = {lng: this.hisLocal[para].lng, lat: this.hisLocal[para].lat}
      this.checkAddress.point = obj
      this.checkAddress.name = this.hisLocal[para].address
      // 添加到vuex中保存
      this.$store.dispatch('house/get_commu', this.checkAddress)
      this.searchFlag = false
      // 请求添加到历史记录
      let params = {
        order_id: this.$route.query.order_id,
        type: '2',
        addressType: '2',
        address: this.checkAddress.name,
        lat: this.checkAddress.point.lat,
        lng: this.checkAddress.point.lng
      }
      this.axios.post('/backend-api/bk-map/perform-tasks', params).then(() => {
      }).catch((err) => {
        console.log(err)
      })
    },
    // 返回搜索页面
    turnSearch () {
      this.searchFlag = true
      // 清除通勤地址
      this.searchCon = ''
      this.checkAddress = {}
      // 清楚vuex保存的通勤地址
      this.$store.dispatch('house/get_commu', this.checkAddress)
    },
    // 初始化联想下拉框
    initInput () {
      const _this = this
      // 建立一个自动完成的对象
      this.ac = new BMap.Autocomplete({'input': 'search-input', 'location': _this.cityId})
      let myValue
      // 鼠标点击下拉列表后的事件
      this.ac.addEventListener('onconfirm', (e) => {
        if (e && e.preventDefault) {
          e.preventDefault()
        } else {
          let _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          _this.setPlace(myValue)
        }
      })
    },
    // 匹配经纬度
    setPlace (para) {
      let _this = this
      function myFun () {
        // 切换成地址结果页
        _this.searchFlag = false
        let res = local.getResults().getPoi(0);
        let pp = res ? res.point : '';
        _this.checkAddress.point = pp
        _this.checkAddress.name = para
        // 添加到vuex中保存
        _this.$store.dispatch('house/get_commu', _this.checkAddress)
        // 请求添加到历史记录
        let params = {
          order_id: _this.$route.query.order_id,
          type: '2',
          addressType: '2',
          address: _this.checkAddress.name,
          lat: _this.checkAddress.point.lat,
          lng: _this.checkAddress.point.lng
        }
        _this.axios.post('/backend-api/bk-map/perform-tasks', params).then(() => {
        }).catch((err) => {
          console.log(err)
        })
      }
      let local = new BMap.LocalSearch(_this.map, {
        onSearchComplete: myFun
      })
      local.search(para)
    }
  },
  watch: {
    // 监听是否有通勤地址
    commuLoc: {
      handler: function (val, oldval) {
        this.checkAddress = this.commuLoc
        if (this.commuLoc.name) {
          // 有值代表已经输入了通勤地址
          this.searchFlag = false
        } else {
          this.searchFlag = true
        }
      },
      deep: true
    },
    // 监听父组件传过来的值
    infoObj: {
      handler: function (val, oldval) {
        this.infoChangeObj = this.infoObj
        this.loc = this.infoChangeObj.house
        // 获取城市id
        this.cityId = this.infoObj.cityName;
        if (this.searchFlag) {
          // 获取历史记录
          let params = {
            order_id: this.$route.query.order_id,
            type: '2',
            addressType: '1'
          }
          this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
            if (res.data.code === 0) {
              this.hisLocal = res.data.data.slice(0, 10)
            }
          }).catch((err) => {
            console.log(err)
          })
          this.$nextTick(() => {
            // 重新初始化input
            this.initInput()
          })
        } else {
          this.commuLoading = true
          this.carInfo = {}
          this.busInfo = []
          // 获取通勤详情
          let params = {
            order_id: this.$route.query.order_id,
            type: '3',
            endLng: this.commuLoc.point.lng,
            endLat: this.commuLoc.point.lat,
            startLng: this.loc.lng,
            startLat: this.loc.lat
          }
          this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
            if (res.data.code === 0) {
              this.carInfo = res.data.data.car
              this.busInfo = res.data.data.bus
              this.commuLoading = false
              // 如果是当前是通勤（避免通勤正在请求就进行tab切换）
              if (this.tabNot) {
                // 默认选择驾车
                this.chooseCarLine()
              }
            } else {
              this.commuLoading = false
            }
          }).catch((err) => {
            this.commuLoading = false
            console.log(err)
          })
        }
      },
      deep: true
    },
    // 监听展示通勤的搜索还是搜索结果
    searchFlag: {
      handler: function (val, oldval) {
        if (this.searchFlag) {
          // 获取历史记录
          let params = {
            order_id: this.$route.query.order_id,
            type: '2',
            addressType: '1'
          }
          this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
            if (res.data.code === 0) {
              this.hisLocal = res.data.data.slice(0, 10)
            }
          }).catch((err) => {
            console.log(err)
          })
          this.$nextTick(() => {
            // 重新初始化input
            this.initInput()
          })
        } else {
          this.commuLoading = true
          this.carInfo = {}
          this.busInfo = []
          // 获取通勤详情
          let params = {
            order_id: this.$route.query.order_id,
            type: '3',
            endLng: this.commuLoc.point.lng,
            endLat: this.commuLoc.point.lat,
            startLng: this.loc.lng,
            startLat: this.loc.lat
          }
          this.axios.post('/backend-api/bk-map/perform-tasks', params).then((res) => {
            if (res.data.code === 0) {
              this.carInfo = res.data.data.car
              this.busInfo = res.data.data.bus
              this.commuLoading = false
              // 默认选择驾车
              this.chooseCarLine()
            } else {
              this.commuLoading = false
            }
          }).catch((err) => {
            this.commuLoading = false
            console.log(err)
          })
        }
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
  .commu-search, .commu-result{
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
  .commu-search .search-box{
    margin: 16px 20px 0 20px;
  }
  .commu-search .search-box >>> .el-input__icon{
    color: #33a1ff;
    font-size: 16px;
  }
  .commu-search .sub-body{
    padding-top: 70px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .sub-body-list-box{
    height: 100%;
  }
  .commu-search .sub-body-tip{
    margin: 20px;
    font-size: 14px;
    color: #abb0b5;
  }
  .commu-search .body-his-list{
    margin: 0 20px 0 20px;
  }
  .commu-search .body-his-list .his-hd{
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
  }
  .commu-search .body-his-list .his-bd{
    margin-top: 8px;
  }
  .commu-search .his-list-box > li{
    padding: 12px 0;
    font-size: 14px;
    color: #333;
    line-height: 20px;
    overflow: hidden;
    border-bottom: 1px dashed #e6e6e6;
    cursor: pointer;
  }
  .commu-search .his-list-box > li:last-of-type{
    margin-bottom: 0;
  }
  .commu-search .item-pic{
    float: left;
    margin: 3px 6px 0 0;
    height: 14px;
    width: 14px;
  }
  .item-pic > img{
    width: 100%;
    height: 100%;
  }
  .commu-search .item-txt{
    overflow: hidden;
  }
  .commu-result .search-result-box{
    margin: 12px 20px;
    overflow: hidden;
  }
  .commu-result .result-box-left{
    float: left;
    width: 16px;
    height: 16px;
    margin: 15px 20px 0 0;
    cursor: pointer;
  }
  .result-box-left > img{
    width: 100%;
    height: 100%;
  }
  .commu-result .result-box-right{
    overflow: hidden;
    font-size: 14px;
    color: #333;
  }
  .commu-result .result-box-right > p{
    height: 20px;
    line-height: 20px;
  }
  .commu-result .result-box-right .right-tit{
    font-size: 16px;
    color: #3e4254;
    line-height: 22px;
    margin-bottom: 6px;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .commu-result .sub-body{
    padding-top: 70px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .commu-result .list-result > li{
    margin-bottom: 12px;
    box-sizing: border-box;
  }
  .commu-result .list-result > li:last-of-type{
    margin-bottom: 0;
  }
  .commu-result .list-result-hd{
    overflow: hidden;
    margin: 20px 20px 0 20px;
  }
  .commu-result .list-result-hd .result-hd-img{
    float: left;
    width: 14px;
    height: 14px;
    margin: 3px 6px 0 0;
  }
  .result-hd-img > img{
    width: 100%;
    height: 100%;
  }
  .commu-result .list-result-hd .result-hd-tit{
    overflow: hidden;
    font-size: 14px;
    color: #3e4254;
  }
  .commu-result .list-result-bd{
    box-sizing: border-box;
    cursor: pointer;
  }
  .commu-result .list-result-bd-active{
    background-color: #e3f6fe;
  }
  .commu-result .list-result-bd:hover{
    /*background-color: #e3f6fe;*/
  }
  .commu-result .list-result-box{
    margin: 0 20px 0 40px;
    padding: 12px 0;
    border-bottom: 1px dashed #e6e6e6;
  }
  .commu-result .bd-tip{
    display: inline-block;
    padding: 2px 6px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    margin-bottom: 10px;
  }
  .commu-result .bd-tip-green{
    background-color: #6ac073;
  }
  .commu-result .box-discrib{
    font-size: 0;
    overflow: hidden;
  }
  .commu-result .box-discrib .time-sub{
    float: left;
    font-size: 14px;
    color: #333;
    margin-left: 10px;
    line-height: 20px;
  }
  .commu-result .box-discrib .time-sub:first-of-type{
    margin-left: 0;
  }
  .commu-result .time-sub .time-sub-icon{
    float: left;
    width: 14px;
    height: 14px;
    margin: 3px 6px 0 0;
  }
  .time-sub-icon > img{
    width: 100%;
    height: 100%;
  }
  .commu-result .time-sub > span{
    overflow: hidden;
  }
  .commu-result .box-discrib > span{
    font-size: 14px;
    color: #333;
    margin-left: 10px;
    line-height: 20px;
  }
  .commu-result .box-discrib > span:first-of-type{
    margin-left: 0;
  }
  .commu-result .list-result > li.drive-box{
    margin-bottom: 22px;
  }
  .commu-result .list-result > li.drive-box:last-of-type{
    margin-bottom: 0;
  }
  .commu-result .line-box{
    margin-top: 10px;
  }
  .commu-result .line-box:after{
    content: '';
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
  }
  .commu-result .line-item{
    float: left;
    margin: 0  10px 10px 0;
  }
  .commu-result .line-item:after{
    content: '';
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
  }
  .commu-result .line-item:last-of-type{
    margin-right: 0;
  }
  .commu-result .line-item .item-info{
    float: left;
  }
  .commu-result .line-item .item-info-next{
    width: 8px;
    height: 8px;
    margin: 8px 10px 0 0;
  }
  .commu-result .line-item .item-into-btn{
    /* padding: 4px 10px; */
    height: 26px;
    line-height: 26px;
    padding: 0 10px;
    border-radius: 25px;
    background-color: #33a1ff;
    color: #fff;
    font-size: 12px;
  }
  .commu-result .line-item .item-car{
    background-color: #fff;
    border: 1px solid #33a1ff;
    color: #33a1ff;
  }
  .commu-result .line-item .item-bus{
    border: 1px solid #33a1ff;
  }
  .commu-result .item-into-btn .item-info-pic{
    float: left;
    width: 14px;
    height: 14px;
    margin: 6px 6px 0 0;
  }
  .item-info-pic > img{
    width: 100%;
    height: 100%;
  }
  .commu-result .item-info-text{
    overflow: hidden;
  }
  .commu-result .line-box-info-list{
    overflow: hidden;
  }
  .commu-result .line-box-info-list > li{
    float: left;
  }
  .commu-result .line-box-info-list > li .list-txt{
    font-size: 14px;
    color: #abb0b5;
    line-height: 20px;
  }
  .commu-result .list-txt .seperate-doc{
    color: #33a1ff;
    width: 7px;
    line-height: 20px;
    margin: 0 4px;
  }
  .commu-result .body-his-list .his-hd{
    font-size: 14px;
    color: #3e4254;
    line-height: 20px;
  }
  .commu-result .body-his-list .his-bd{
    margin-top: 20px;
  }
  .commu-result .his-list-box > li{
    margin-bottom: 26px;
    font-size: 14px;
    color: #333;
    line-height: 20px;
    overflow: hidden;
  }
  .commu-result .his-list-box > li:last-of-type{
    margin-bottom: 0;
  }
</style>
