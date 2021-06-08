<template>
  <div class="sub-component-wrapper">
    <div class="door-list-wrapper">
      <div class="sub-header">
        <div class="search-result-box">
          <div class="result-box">
            <!--首付比例-->
            <div class="box-pay">
              <div class="pay-item">
                <div class="pay-item-th">首付比例</div>
                <div class="pay-item-td">
                  <el-select v-model="loanObj.down_payments" placeholder="" @change="changeFilter">
                    <el-option
                      v-for="item in payList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="pay-item">
                <div class="pay-item-th">贷款年限</div>
                <div class="pay-item-td">
                  <el-select v-model="loanObj.loan_term" placeholder="" :disabled="loanObj.down_payments === 100" @change="changeFilter">
                    <el-option
                      v-for="item in loanYearList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="pay-item">
                <div class="pay-item-th">贷款利率</div>
                <div class="pay-item-td">
                  <el-input
                    placeholder="" class="sele-unit" type="text" :disabled="loanObj.down_payments === 100" @change="changeFilter"
                    suffix-icon="el-icon-date"
                    v-model.trim="loanObj.lending_rate" oninput="value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')">
                  </el-input>
                </div>
              </div>
            </div>
            <div class="box-choose">
              <ul class="choose-door">
                <li :class="{'active': seleChoose ? (door.room_type.toString() === seleChoose.toString()) : index === 0}" @click="selectDoor(door.room_type)" v-for="(door, index) in doorInfo" :key="'door' + index" v-if="door.name">
                  <div class="door-item">{{door.name}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="sub-body">
        <div class="list-result-wrapper">
          <ul class="door-list" v-for="(item, index) in doorInfo" :key="'doorInfo-' + index" v-if="seleChoose ? (item.room_type.toString() === seleChoose.toString()) : index === 0">
            <li v-for="(subItem, index) in item.list" :key="'subItem-' + index" @click="turnTo(subItem.url)">
              <div class="door-item">
                <div class="door-item-row">
                  <div class="door-item-tit">{{subItem.summary}}</div>
                  <div class="door-item-label green-label" v-if="subItem.status === '在售'">{{subItem.status}}</div>
                  <div class="door-item-label blue-label" v-if="subItem.status === '待售'">{{subItem.status}}</div>
                  <div class="door-item-label gray-label" v-if="subItem.status === '售罄'">{{subItem.status}}</div>
                  <div class="door-item-label" v-if="subItem.building_type">{{subItem.building_type}}</div>
                  <div class="door-item-label" v-if="subItem.orientation">{{subItem.orientation}}</div>
                </div>
                <div class="door-item-row">
                  <div class="door-item-price">{{subItem.acreage}}㎡</div>
                  <div class="door-item-price item-price-red" v-if="subItem.offer_price != 0 && subItem.offer_price != '' && subItem.offer_price != null">{{subItem.offer_price}}元/㎡</div>
                  <div class="door-item-price item-price-red" v-if="subItem.offer_price == 0 || subItem.offer_price == '' || subItem.offer_price == null">待定</div>
                  <div class="door-item-price" v-if="subItem.price != 0 && subItem.price != '' && subItem.price != null">总价{{subItem.price}}万</div>
                  <div class="door-item-price" v-if="subItem.price == 0 || subItem.price == '' && subItem.price == null">待定</div>
                </div>
                <div class="door-item-row">
                  <div class="door-item-price" v-if="loanObj.lending_rate === ''">请完善贷款信息</div>
                  <div class="door-item-price" v-if="loanObj.lending_rate !== ''">首付{{subItem.first_pay}}万</div>
                  <div class="door-item-price" v-if="loanObj.lending_rate !== ''">月供 {{subItem.month_pay}} 元</div>
                  <div @click.stop="joinCompare(subItem)" :class="{'door-item-btn door-item-turn': subItem.is_contrast.toString() === '1', 'door-item-btn door-item-active': subItem.is_contrast.toString() === '0'}">{{compareShow(subItem.is_contrast.toString())}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="toast-show" v-if="isToast">已加入对比，请点击右下角的进入对比查看</div>
    </div>
  </div>
</template>

<script>
import { commonFun } from '@/assets/js/utils/utils'
import {trackAxios} from '@/assets/js/http/axios'
import { mapState } from 'vuex'
import dataStorage from '@/assets/js/utils/dataStorage'
export default {
  name: 'door-tab',
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
      loanObj: {
        down_payments: null, // 首付比例
        lending_rate: 4.9, // 贷款利率
        loan_term: null // 贷款年限
      }, // 楼盘筛选
      payList: [
        {
          value: 10,
          label: '10%'
        }, {
          value: 15,
          label: '15%'
        }, {
          value: 20,
          label: '20%'
        }, {
          value: 25,
          label: '25%'
        }, {
          value: 30,
          label: '30%'
        }, {
          value: 35,
          label: '35%'
        }, {
          value: 40,
          label: '40%'
        }, {
          value: 45,
          label: '45%'
        }, {
          value: 50,
          label: '50%'
        }, {
          value: 55,
          label: '55%'
        }, {
          value: 60,
          label: '60%'
        }, {
          value: 65,
          label: '65%'
        }, {
          value: 70,
          label: '70%'
        }, {
          value: 75,
          label: '75%'
        }, {
          value: 80,
          label: '80%'
        }, {
          value: 85,
          label: '85%'
        }, {
          value: 90,
          label: '90%'
        }, {
          value: 95,
          label: '95%'
        }, {
          value: 100,
          label: '100%'
        }
      ], // 首付比例列表
      loanYearList: [], // 贷款年限列表
      currenUrl: '', // 当前m站url
      infoChangeObj: {}, // 接受父组件参数
      saveRate: 4.9, // 当前保存的利率
      cityLabel: {}, // 楼盘卡片传递的城市信息
      doorInfo: [], // 户型信息
      seleChoose: '', // 点击图片中的户型传过来的居室
      repeatFlag: true, // 重复提交
      isToast: false, // toast
      project_id: '' // project_id
    }
  },
  computed: {
    ...mapState(['trackMessages', 'backendApi'])
  },
  mounted () {
    this.infoChangeObj = this.infoObj
    this.seleChoose = this.infoChangeObj.doorType
    this.project_id = this.infoChangeObj.house.projectId
    // 匹配贷款年限和首付比例
    this.loanMatch(this.infoObj)
    // 动态写年限
    for (let i = 1; i <= 30; i++) {
      let obj = {
        value: i,
        label: i + '年'
      }
      this.loanYearList.push(obj)
    }
    // 获取户型信息
    this.getDoorData('0')
  },
  methods: {
    // 根据城市配置首付和贷款年限
    loanMatch (para) {
      this.cityLabel = para
      if (this.cityLabel.cityId && this.cityLabel.cityId.toString() === '20000001') {
        // 上海默认首付比例是35%--20000001，天津默认贷款年限是25--20000019
        if (this.loanObj.down_payments === null) {
          this.loanObj.down_payments = 35
        }
        if (this.loanObj.loan_term === null) {
          this.loanObj.loan_term = 30
        }
      } else if (this.cityLabel.cityId && this.cityLabel.cityId.toString() === '20000019') {
        if (this.loanObj.loan_term === null) {
          this.loanObj.loan_term = 25
        }
        if (this.loanObj.down_payments === null) {
          this.loanObj.down_payments = 30
        }
      } else {
        if (this.loanObj.down_payments === null) {
          this.loanObj.down_payments = 30
        }
        if (this.loanObj.loan_term === null) {
          this.loanObj.loan_term = 30
        }
      }
    },
    // 判断按钮是否加入对比
    compareShow (para) {
      let rel
      rel = para === '0' ? '加入对比' : '移出对比'
      return rel
    },
    // 切换首付比例、年限或者利率
    changeFilter () {
      // 每次切换需要请求接口，如果有某一项为空，不请求
      if (this.loanObj.lending_rate && parseFloat(this.loanObj.lending_rate) > 0) {
        // 获取户型信息
        this.getDoorData('1')
      } else if (parseFloat(this.loanObj.lending_rate) === 0 || parseFloat(this.loanObj.lending_rate) > 1000) {
        this.loanObj.lending_rate = this.saveRate
      }
	},
	/**
	 * 判断当前户型是否可以加入对比
	 * @param {String} para 楼盘ID
	 * @return {Boolean} 是否可以加入
	 */
	checkJoinCompare (para) {
		let result = true;
		// 获取已经加入对比的楼盘
        let projectStorage = dataStorage.getStorage('projectIdData') ? dataStorage.getStorage('projectIdData') : {};
        let projectArr = JSON.parse(projectStorage.oData);
		// 判断本地存储的楼盘格式是否正确
		if (JSON.stringify(projectStorage) !== '{}' && Array.isArray(projectArr)) {
			// 当前已经加入对比的楼盘个数小于10
			if (projectArr.length < 10) {
				result = true;
			} else {
				// 已经加入楼盘的个数超过或者等于10个
				let isHas = projectArr.findIndex((v) => {
					return v == para;
				});
				// 当前要加入户型的楼盘ID是否已经存在于数组中，如果存在，则可以继续加入户型
				if (isHas !== -1) {
					result = true;
				} else {
					result = false;
				}
			}
        } else {
			result = false;
		}
		return result;
	},
    // 加入对比
    joinCompare (para) {
      if (para.is_contrast.toString() === '0') {
        if (this.repeatFlag) {
			// 不能增加户型
			if (!this.checkJoinCompare(this.project_id)) {
				this.$message({
					message: '最多支持添加10个楼盘进行对比，请在【楼盘对比】中删除不需要对比的楼盘，然后再添加新的楼盘！',
					type: 'error'
				});
				return;
			}
          this.repeatFlag = false
          let params = {
            order_id: this.$route.query.order_id,
            project_id: this.project_id,
            house_id: para.house_type_id
          }
          this.axios.post('/backend-api/bk-map/add-contrast', params).then((res) => {
            if (res.data.code === 0) {
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
              let trackData = {
                extrack_arr: {
                  ini_params: trackAll
                },
                track_id: '3907'
              }
              // 请求埋点接口
              trackAxios.post(this.backendApi + '/send-data/index', trackData).then(() => {
              }).catch((err) => {
                console.log(err)
              })
              // 手动改变对比状态
              para.is_contrast = 1
              this.repeatFlag = true
              // 弹窗toast
              this.isToast = true
              setTimeout(() => {
                this.isToast = false
              }, 1000)
              PubSub.publish('addCompare', {
                type: true,
                num: 1
              })
            }
          }).catch((err) => {
            this.repeatFlag = true
            console.log(err)
          })
        }
      } else {
        // 移除对比
        if (this.repeatFlag) {
          this.repeatFlag = false
          let params = {
            order_id: this.$route.query.order_id,
            project_id: this.project_id,
            house_id: para.house_type_id
          }
          this.axios.post('/backend-api/bk-map/del-contrast', params).then((res) => {
            if (res.data.code === 0) {
              // 手动改变对比状态
              para.is_contrast = 0
              this.repeatFlag = true
              PubSub.publish('addCompare', {
                type: false,
                num: 1
              })
            }
          }).catch((err) => {
            this.repeatFlag = true
            console.log(err)
          })
        }
      }
    },
    // 点击户型跳转到m站
    turnTo (para) {
      this.currenUrl = para
      window.open(this.currenUrl)
    },
    // 切换居室tab
    selectDoor (para) {
      this.seleChoose = para
    },
    // 获取户型信息
    getDoorData (para) {
      let params
      if (para === '0') {
        // 首次查询
        params = {
          project_id: this.project_id,
          order_id: this.$route.query.order_id
        }
      } else if (para === '1') {
        // 根据筛选条件进行计算
        params = {
          project_id: this.project_id,
          order_id: this.$route.query.order_id,
          down_payments: this.loanObj.down_payments,
          lending_rate: this.loanObj.lending_rate,
          loan_term: this.loanObj.loan_term
        }
      }
      this.axios.post('/backend-api/bk-map/get-house-detail', params).then((res) => {
        if (res.data.code === 0) {
          this.doorInfo = res.data.data.data
          this.loanObj = res.data.data.loan
          // 保存当前利率，在利率输入错误时候进行替换
          this.saveRate = this.loanObj.lending_rate
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  watch: {
    // 监听父组件传过来的值
    infoObj: {
      handler: function (val, oldval) {
        this.infoChangeObj = this.infoObj
        this.seleChoose = this.infoChangeObj.doorType
        this.project_id = this.infoChangeObj.house.projectId// 获取户型信息
        this.getDoorData('0')
        // 默认值设置修改为使用楼盘卡片传递的，而不使用vuex中的
        this.loanMatch(this.infoObj);
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .sub-component-wrapper{
    position: relative;
    height: 100%;
  }
  .door-list-wrapper{
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
  .ifram-box{
    height: 100%;
  }
  .box-choose{
    margin-top: 8px;
  }
  .choose-door{
    overflow: hidden;
  }
  .choose-door > li{
    float: left;
    margin-right: 9px;
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
  .door-list > li{
    padding: 20px 0;
    margin: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px dashed #e6e6e6;
    cursor: pointer;
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
  .blue-label{
    color: #33a1ff;
    background: rgba(51,161,255,0.20);
  }
  .gray-label{
    color: #fff;
    background: #c9c9c9;
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
    cursor: pointer;
  }
  .door-item-row .door-item-turn{
    background: #ff8800;
    box-shadow: 0 0 5px 0 rgba(69,69,83,0.10);
    color: #fff;
  }
  .door-item-row .door-item-active{
    background: #33a1ff;
    color: #fff;
  }
  .toast-show{
    position: absolute;
    top: 30%;
    left: 50%;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 10px;
    transform: translateX(-50%);
    color: #fff;
    border-radius: 5px;
    z-index: 100;
    text-align: center;
    transition:all 1s;
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
