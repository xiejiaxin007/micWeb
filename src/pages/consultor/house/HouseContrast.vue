<!--
 * @author: hewei
 * @Date: 2019-08-29 18:15:12
 * @description：楼盘对比页面，将原来楼盘对比弹窗移植为页面
 -->
<template>
  <div class="loupan-content">
    <!-- 头部 -->
    <div class="loupan-title">
      <span></span>
      <span class="jl-db">楼盘对比</span>
      <el-button type="primary" size="small" @click="shareUser" :disabled="shareUserStatus">编辑对比并分享</el-button>
    </div>
    <!--主题内容 -->
    <div class="loupan-plane">
      <div class="loupan-plane-head">
        <ul>
          <li>
            <div class="th">首付比例</div>
            <div class="td">
              <el-select
                v-model="loanObj.down_payments"
                placeholder="请选择"
                :disabled="tbLoading"
                @change="changeFilter"
              >
                <el-option
                  v-for="item in down_payments_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <div class="th">贷款年限</div>
            <div class="td">
              <el-select
                v-model="loanObj.loan_term"
                placeholder="请选择"
                :disabled="tbLoading || is_down_payments_100"
                @change="changeFilter"
              >
                <el-option
                  :label="`${list}年`"
                  :value="list"
                  v-for="(list, index) in 30"
                  :key="index"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <div class="th">贷款利率</div>
            <div class="td">
              <el-input
                placeholder
                class="sele-unit"
                type="text"
                suffix-icon="el-icon-date"
                :disabled="tbLoading || is_down_payments_100"
                @input="loanInput(loanObj.lending_rate)"
                @blur="loanBlur(loanObj.lending_rate)"
                v-model.trim="loanObj.lending_rate"
              ></el-input>
            </div>
          </li>
          <li>
            <div class="th">通勤地址</div>
            <div class="td fak-td">
              <!--百度地图的搜索-->
              <div id="fak"></div>
              <el-input
                placeholder="搜索通勤地点"
                id="searchHo"
                v-model.trim="commute_name"
                :disabled="tbLoading"
              ></el-input>
            </div>
          </li>
        </ul>
        <p class="p-text">
          当前已有
          <span class="text-num">{{project_num}}个</span>楼盘加入对比，页面最多对比
          <span class="text-num">10个</span> 楼盘
        </p>
      </div>
      <!-- 表格区域 -->
      <div class="loupan-plane-body house_table" v-loading="tbLoading">
        <el-table
          ref="table"
          :key="tableKey"
          :data="[1]"
          style="width: 100%"
          :height="clientHeight?clientHeight:500"
          border
        >
          <el-table-column fixed width="138" :resizable="false">
            <template slot="header" slot-scope="scope">
              <div class="h-46">
                <div class="title_type">楼盘名称</div>
              </div>
              <div class="house_head_over">
                <ul class="house_head_ul" style="width:150px">
                  <li :class="scrollY?'scroll_y':''" class="btn_li">
                    <el-button
                      v-if="isRealCity"
                      @click="add_contrast" :disabled="project_num >= 10">+新增对比户型</el-button>
                  </li>
                </ul>
              </div>
            </template>
            <template slot-scope="scope">
              <ul v-if="scope.$index === 0" class="house-ul">
                <li class="house_img" :style="'height:'+ autoHeight[0] +'px'"></li>
                <li class="title_type" :style="'height:'+ autoHeight[1] +'px'">价格</li>
                <li :style="'height:'+ autoHeight[2] +'px'">建面</li>
                <li :style="'height:'+ autoHeight[3] +'px'">单价</li>
                <li :style="'height:'+ autoHeight[4] +'px'">总价</li>
                <li :style="'height:'+ autoHeight[5] +'px'">首付</li>
                <li :style="'height:'+ autoHeight[6] +'px'">月供</li>
                <li class="title_type" :style="'height:'+ autoHeight[7] +'px'">户型</li>
                <li :style="'height:'+ autoHeight[8] +'px'">朝向</li>
                <li :style="'height:'+ autoHeight[9] +'px'">层高</li>
                <li :style="'height:'+ autoHeight[10] +'px'">类型</li>
                <li class="title_type" :style="'height:'+ autoHeight[11] +'px'">通勤</li>
                <li :style="'height:'+ autoHeight[12] +'px'">驾车</li>
                <li :style="'height:'+ autoHeight[13] +'px'">公交</li>
                <li class="title_type" :style="'height:'+ autoHeight[14] +'px'">交通</li>
                <li :style="'height:'+ autoHeight[15] +'px'">地铁站</li>
                <li :style="'height:'+ autoHeight[16] +'px'">公交站</li>
                <li class="title_type" :style="'height:'+ autoHeight[17] +'px'">楼盘信息</li>
                <li :style="'height:'+ autoHeight[18] +'px'">区域</li>
                <li :style="'height:'+ autoHeight[19] +'px'">开发商</li>
                <li :style="'height:'+ autoHeight[20] +'px'">物业公司</li>
                <li :style="'height:'+ autoHeight[21] +'px'">物业费用</li>
                <li :style="'height:'+ autoHeight[22] +'px'">车位情况</li>
                <li :style="'height:'+ autoHeight[23] +'px'">装修情况</li>
                <li :style="'height:'+ autoHeight[24] +'px'">水电燃气</li>
                <li :style="'height:'+ autoHeight[25] +'px'">供暖方式</li>
                <li :style="'height:'+ autoHeight[26] +'px'">最早交房</li>
                <li :style="'height:'+ autoHeight[27] +'px'">最新开盘</li>
                <li :style="'height:'+ autoHeight[28] +'px'">产权年限</li>
                <li :style="'height:'+ autoHeight[29] +'px'">容积率</li>
                <li :style="'height:'+ autoHeight[30] +'px'">绿化率</li>
                <li class="title_type" :style="'height:'+ autoHeight[31] +'px'">周边房价行情</li>
                <li :style="'height:'+ autoHeight[32] +'px'">区域均价</li>
                <li :style="'height:'+ autoHeight[33] +'px'">周边二手房价格</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(items, index) in houseData"
            :key="index"
            :width="items.house_type.length * 220 + items.house_type.length + 1"
            :resizable="false"
          >
            <template slot="header" slot-scope="scope">
              <div class="h-46 house_project_name">
                <span
                  class="name"
                  :style="{'width':items.house_type.length > 1 || index === 0  ? 'auto':'130px'}"
                >{{items.project_name}}</span>
                <div class="move" @click="house_move(items,index)" v-if="index !== 0">
                  <span class="before"></span>
                  移动
                </div>
              </div>
              <div class="house_table-head">
                <div class="house_head_over">
                  <ul v-for="(v,i) in items.house_type" :key="i" class="house_head_ul">
                    <li :class="scrollY?'scroll_y':''">
                      <div class="house_name">
                        <span>{{v.summary}}</span>
                        <span>{{v.status}}</span>
                      </div>
                      <span
                        class="delete_house iconfont iconguanbi"
                        @click="house_delete(v,index, i)"
                      ></span>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.$index === 0">
                <ul v-for="(v,i) in items.house_type" :key="i" class="house_type">
                  <li>
                    <ul class="house_type_item">
                      <li class="house_img" :style="'height:'+ autoHeight[0] +'px'">
                        <img
                          :src="v.apart_img?v.apart_img:errorImg"
                          alt="图片"
                          @error="error($event)"
                          @click="openBigImg(v.apart_img)"
                        />
                      </li>
                      <!-- 价格 -->
                      <li class="title_type_kb" :style="'height:'+ autoHeight[1] +'px'"></li>
                      <!-- 面积 -->
                      <li
                        :class="{'color_red': compareFilter('area', '面积', v.acreage)}"
                        :style="'height:'+ autoHeight[2] +'px'"
                      >
                        <p v-if="v.acreage*1 === 0 || v.acreage === ''">待定</p>
                        <p v-else>{{v.acreage}}㎡</p>
                      </li>
                      <!-- 单价 -->
                      <li
                        :class="{'color_red': compareFilter('perPay', '价格', v.offer_price)}"
                        :style="'height:'+ autoHeight[3] +'px'"
                      >
                        <p v-if="v.offer_price*1 === 0 || v.offer_price === ''">待定</p>
                        <p v-else>{{v.offer_price}}元/㎡</p>
                      </li>
                      <!-- 总价 -->
                      <li
                        :class="{'color_red': compareFilter('allPay', '价格', v.price)}"
                        :style="'height:'+ autoHeight[4] +'px'"
                      >
                        <p v-if="v.price*1 === 0 || v.price === ''">待定</p>
                        <p v-else>{{v.price}}万</p>
                      </li>
                      <!-- 首付 -->
                      <li
                        :class="{'color_red': compareFilter('firPay', '价格', v.first_pay)}"
                        :style="'height:'+ autoHeight[5] +'px'"
                      >
                        <p v-if="v.first_pay*1 === 0 || v.first_pay === ''">待定</p>
                        <p v-else>{{v.first_pay}}万</p>
                      </li>
                      <li :style="'height:'+ autoHeight[6] +'px'">
                        <p v-if="v.month_pay*1 === 0 || v.month_pay === ''">待定</p>
                        <p v-else>{{v.month_pay}}元</p>
                      </li>
                      <!-- 户型 -->
                      <li class="title_type_kb" :style="'height:'+ autoHeight[7] +'px'"></li>
                      <li :style="'height:'+ autoHeight[8] +'px'">
                        <p>{{v.orientation}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[9] +'px'">
                        <p>
                          {{v.floor_height}}
                          <span v-if="v.floor_height !== ''">m</span>
                        </p>
                      </li>
                      <li :style="'height:'+ autoHeight[10] +'px'">
                        <p>{{v.building_type}}</p>
                      </li>
                      <!-- 通勤 -->
                      <li class="title_type_kb" :style="'height:'+ autoHeight[11] +'px'"></li>
                      <li :style="'height:'+ autoHeight[12] +'px'">
                        <p>{{items.drive}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[13] +'px'">
                        <p>{{items.transit}}</p>
                      </li>
                      <!-- 交通 -->
                      <li class="title_type_kb" :style="'height:'+ autoHeight[14] +'px'"></li>
                      <li :style="'height:'+ autoHeight[15] +'px'">
                        <p>{{items.metro}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[16] +'px'">
                        <p v-html="items.bus_stop"></p>
                      </li>
                      <!-- 楼盘信息 -->
                      <li class="title_type_kb" :style="'height:'+ autoHeight[17] +'px'"></li>
                      <li :style="'height:'+ autoHeight[18] +'px'">
                        <p>{{items.district_name}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[19] +'px'">
                        <p>{{items.developer}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[20] +'px'">
                        <p>{{items.partner}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[21] +'px'">
                        <p>
                          {{items.property_fee}}
                          <span v-if="items.property_fee !== ''">元/㎡*月</span>
                        </p>
                      </li>
                      <li :style="'height:'+ autoHeight[22] +'px'">
                        <p>{{items.car_space}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[23] +'px'">
                        <p>{{items.decorate_info}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[24] +'px'">
                        <p>{{items.water_electy}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[25] +'px'">
                        <p>{{items.heating}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[26] +'px'">
                        <p>
                          <span
                            v-if="items.live_year_month !== '年月' && items.live_year_month !== '0年0月'"
                          >{{items.live_year_month}}</span>
                        </p>
                      </li>
                      <li :style="'height:'+ autoHeight[27] +'px'">
                        <p>
                          <span v-if="items.volume_year_month !== '年月'">{{items.volume_year_month}}</span>
                        </p>
                      </li>
                      <li :style="'height:'+ autoHeight[28] +'px'">
                        <p>
                          {{items.property_year}}
                          <span v-if="items.property_year !=='' ">年</span>
                        </p>
                      </li>
                      <li :style="'height:'+ autoHeight[29] +'px'">
                        <p>{{items.far}}</p>
                      </li>
                      <li :style="'height:'+ autoHeight[30] +'px'">
                        <p>{{items.greening}}</p>
                      </li>
                      <!-- 周边房价行情 -->
                      <li class="title_type_kb" :style="'height:'+ autoHeight[31] +'px'"></li>
                      <li :style="'height:'+ autoHeight[32] +'px'">
                        <p>
                          {{items.district_ave_rate}}
                          <span v-if="items.district_ave_rate !== ''">元/㎡</span>
                        </p>
                      </li>
                      <li :style="'height:'+ autoHeight[33] +'px'">
                        <p>{{items.second_house}}</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分享给客户弹窗 -->
    <el-dialog title="请选择你要分享的户型，一次最多分享三个楼盘的户型" :visible.sync="dialogVisible" class="dialog">
      <div class="dialog-body">
        <ul class="list">
          <li
            v-for="(items, index) in dialogarry"
            :data-houseType="items.house_type_id"
            :data-projectId="items.project_id"
            :key="index"
            :class="items.isactive ? 'active' : '' "
            @click="selectElemnt(index, items, dialogarry)"
          >
            <span class="bg"></span>
            <span class="project_name">{{items.project_name}}</span>
            <span>{{items.summary}}{{items.house_type_num}}&nbsp;&nbsp;{{items.acreage}}㎡ &nbsp;&nbsp;</span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submitBtn" :disabled="!shareStatus">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="imgDialogVisible"
      width="600px"
      class="img-dialog"
      :closed="closeImgDialog"
    >
      <img :src="bigImgUrl" 
        alt="图片"/>
    </el-dialog>
    <div id="mapcon"></div>
    <ContrastMadel ref="oldMadel" @updateData="updateData" @updateHouseContrast="getSearch(1)" />
  </div>
</template>

<script>
// import PubSub from 'pubsub-js'
import ContrastMadel from "./components/ContrastMadel.vue";
import { commonFun } from "@/assets/js/utils/utils";
import errorImg from "./images/nohouse.png";
import searchApi from "./api/searchToolShare";
import loadMap from '@/assets/js/utils/map.js';
const {
    multiApi
} = searchApi;
export default {
  components: {
    ContrastMadel
  },
  data () {
    return {
      bigImgUrl: "",
      imgDialogVisible: false,
      // 首付比例
      down_payments_options: [
        {
          value: 10,
          label: "10%"
        },
        {
          value: 15,
          label: "15%"
        },
        {
          value: 20,
          label: "20%"
        },
        {
          value: 25,
          label: "25%"
        },
        {
          value: 30,
          label: "30%"
        },
        {
          value: 35,
          label: "35%"
        },
        {
          value: 40,
          label: "40%"
        },
        {
          value: 45,
          label: "45%"
        },
        {
          value: 50,
          label: "50%"
        },
        {
          value: 55,
          label: "55%"
        },
        {
          value: 60,
          label: "60%"
        },
        {
          value: 65,
          label: "65%"
        },
        {
          value: 70,
          label: "70%"
        },
        {
          value: 75,
          label: "75%"
        },
        {
          value: 80,
          label: "80%"
        },
        {
          value: 85,
          label: "85%"
        },
        {
          value: 90,
          label: "90%"
        },
        {
          value: 95,
          label: "95%"
        },
        {
          value: 100,
          label: "100%"
        }
      ],
      is_down_payments_100: false, // 首付100% 贷款年限 贷款利率不可选
      loanObj: {
        down_payments: "", // 首付比例
        lending_rate: "", // 贷款利率
        loan_term: "" // 贷款年限
      },
      commute_name: "", // 通勤地址
      dialogVisible: false, // 分享给客户开关
      tbLoading: true, // 表格加载中
      house_num: 0,
      project_num: 0,
      arr: [],
      dooListgroup: [],
      dialogarry: [],
      mapco: {},
      dataUrl: "",
      loan_cun: "4.9",
      shareUserStatus: true, // 分享给客户按钮
      shareStatus: false, // 分享给客户弹窗确定按钮
      sortstatus: true,
      scrollY: false,
      houseData: [], // 性情数据
      mapcon: {},
      ac: {},
      autoHeight: [],
      projectInfo: [], // 确定分享选择的楼盘
      // 是否是真实城市
      isRealCity: false,
      local: {
        // 检索经纬度
        work_addr_lat: "",
        work_addr_lng: ""
      },
      clientHeight: "", // 可视窗口高度,
      // 表格key 强制刷新
      tableKey: 1
    };
  },
  created () {
    // 获取父组件下发的筛选内容
    this.cityId = this.$route.query.city_id;
    this.filterData = JSON.parse(localStorage.getItem("controlData"));
    this.getSearch(1);
    this.dataUrl = window.location.host;
    this.shareStatus = false;
    // 动态设置表格高度
    this.clientHeight = document.documentElement.clientHeight - 170;
    commonFun.highThottle(this.clientH(), this);
    // 确保加载完成才实例化地图
    loadMap.loadMap().then(() => {
      this.mapco = new BMap.Map("mapCon");
      this.setSearch();
    });
    // 获取是否是真实城市
    this.getRealCity();
  },
  methods: {
    // 获取虚拟城市匹配的真实城市
    async getRealCity() {
        try {
            let params = {
                order_id: this.$route.query.order_id,
                type: '25',
                city_id: this.cityId
            };
            const { data } = await multiApi(params);
            if (data.code === 0) {
                if (data.data.real_city_id !== '0') {
                    // 说明是虚拟城市
                    this.isRealCity = false;
                } else {
                    this.isRealCity = true;
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    updateData () {
      // 像父窗口推送数据
      const message = {
        type: "1",
        msg: "updateHouseCount"
      };
      window.opener.postMessage(message, location.origin);
    },
    closeImgDialog () {
      this.bigImgUrl = "";
      this.imgDialogVisible = false;
    },
    openBigImg (url) {
      this.bigImgUrl = url;
      this.imgDialogVisible = true;
    },
    clientH () {
      let _this = this;
      window.onresize = function () {
        _this.clientHeight =
          document.documentElement.clientHeight - 170;
      };
    },
    // 图片加载失败
    error (el) {
      el.target.src = errorImg;
      el.target.error = null;
    },
    // 匹配筛选项
    compareFilter (para, paraName, paraVal) {
      try {
        if (paraVal) {
          let currnString = "";
          switch (para) {
            case "allPay":
              currnString = "总价";
              break;
            case "perPay":
              currnString = "单价";
              break;
            case "firPay":
              currnString = "首付";
              break;
            case "area":
              currnString = "面积";
              break;
          }
          let resl = false;
          // 添加异常处理
          if (!Array.isArray(this.filterData)) {
            return resl;
          }
          this.filterData.map(item => {
            if (item.name === paraName && paraName === "面积") {
              if (
                item.condition.length > 0 &&
                item.condition[0].state
              ) {
                // 如果是面积，condition里面没有name，单独处理
                let cMax;
                let cMin;
                let subItem = item.condition[0];
                // 判断比较的最大值和最小值
                if (subItem.max && subItem.min) {
                  cMax = parseFloat(subItem.max);
                  cMin = parseFloat(subItem.min);
                } else if (subItem.max && !subItem.min) {
                  cMax = parseFloat(subItem.max);
                  cMin = parseFloat(0);
                } else if (!subItem.max && subItem.min) {
                  cMax = null;
                  cMin = parseFloat(subItem.min);
                }
                if (
                  parseFloat(paraVal) >= cMin &&
                  parseFloat(paraVal) <= cMax &&
                  cMax !== null
                ) {
                  resl = true;
                } else if (
                  parseFloat(paraVal) >= cMin &&
                  cMax === null
                ) {
                  resl = true;
                } else {
                  resl = false;
                }
              }
            } else {
              if (item.condition.length > 0) {
                item.condition.map(subItem => {
                  if (
                    subItem.name === currnString &&
                    subItem.state
                  ) {
                    let cMax;
                    let cMin;
                    // 判断比较的最大值和最小值
                    if (subItem.max && subItem.min) {
                      cMax = parseFloat(subItem.max);
                      cMin = parseFloat(subItem.min);
                    } else if (
                      subItem.max &&
                      !subItem.min
                    ) {
                      cMax = parseFloat(subItem.max);
                      cMin = parseFloat(0);
                    } else if (
                      !subItem.max &&
                      subItem.min
                    ) {
                      cMax = null;
                      cMin = parseFloat(subItem.min);
                    }
                    if (
                      paraVal >= cMin &&
                      paraVal <= cMax &&
                      cMax !== null
                    ) {
                      resl = true;
                    } else if (
                      paraVal >= cMin &&
                      cMax === null
                    ) {
                      resl = true;
                    } else {
                      resl = false;
                    }
                  }
                });
              }
            }
          });
          return resl;
        }
      } catch (e) {
        console.log(e);
      }
    },
    changeFilter () {
      if (this.loanObj.lending_rate !== "") {
        // 获取户型信息
        this.getSearch();
      }
    },
    // 贷款利率input事件
    loanInput (para) {
      this.loanObj.lending_rate = para.replace(/[^\d.]/g, "");
      this.loanObj.lending_rate = this.loanObj.lending_rate.replace(
        /\.{2,}/g,
        ""
      );
      this.loanObj.lending_rate = this.loanObj.lending_rate
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      this.loanObj.lending_rate = this.loanObj.lending_rate.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      );
    },
    // 贷款利率blur事件
    loanBlur (para) {
      let num = para - 0;
      if (num === 0 || num > 1000) {
        this.loanObj.lending_rate = this.loan_cun;
      } else {
        if (
          this.loanObj.lending_rate !== "" &&
          this.loanObj.lending_rate + "" !== this.loan_cun + ""
        ) {
          this.getSearch();
        }
      }
    },
    selectElemnt (index, item, list) {
      // 添加
      let _objloupan = {
        houseType: item.house_type_id,
        projectId: item.project_id,
        apartmentType: "1",
        projectName: item.project_name
      };
      item.isactive = !item.isactive;
      // 判断楼盘个数是否超出3
      let remReat = [];
      this.projectInfo.forEach(val => {
        remReat.push(val.projectId);
      });
      if (this.projectInfo.length > 2) {
        if (remReat.indexOf(item.project_id) === -1) {
          item.isactive = false;
        }
      }
      if (item.isactive) {
        this.dooListgroup.push(_objloupan);
      } else {
        // 去掉选中的一项
        for (let i = 0; i < this.dooListgroup.length; i++) {
          if (
            this.dooListgroup[i].houseType ===
            _objloupan.houseType &&
            this.dooListgroup[i].projectId === _objloupan.projectId
          ) {
            this.dooListgroup.splice(i, 1);
            break;
          }
        }
      }
      // 去重拿出楼盘id name
      let a = [];
      let b = [];
      this.projectInfo = [];
      this.dooListgroup.forEach(val => {
        let Aobj = {
          projectId: val.projectId,
          projectName: val.projectName
        };
        a.push(Aobj);
      });
      for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i].projectId) === -1) {
          b.push(a[i].projectId);
          this.projectInfo.push(a[i]);
        }
      }
      if (this.dooListgroup.length >= 2) {
        this.shareStatus = true;
      } else {
        this.shareStatus = false;
      }
    },
    // 拉取对比详情数据
    getSearch (para) {
      let paramsData = {};
      if (para) {
        paramsData = {
          order_id: this.$route.query.order_id,
          work_addr_lng: this.local.work_addr_lng,
          work_addr_lat: this.local.work_addr_lat,
          work_addr: this.commute_name
        };
      } else {
        paramsData = {
          order_id: this.$route.query.order_id,
          work_addr_lng: this.local.work_addr_lng,
          work_addr_lat: this.local.work_addr_lat,
          down_payments: this.loanObj.down_payments, // 首付比例
          loan_term: this.loanObj.loan_term,
          lending_rate: this.loanObj.lending_rate,
          work_addr: this.commute_name
        };
      }
      // 添加loading动画
      this.tbLoading = true;
      this.shareUserStatus = true;
      let environment = process.env.NODE_ENV;
      const houseArr = JSON.parse(localStorage.getItem("chooseHouseProjectInfo"));
      Object.assign(paramsData, { project_data: houseArr });
      this.axios
        .post("/backend-api/bk-map/house-contrast-detail", paramsData)
        .then(res => {
          if (res.data.code === 0) {
            // 去掉loading动画
            this.tbLoading = false;
            if (!res.data.data.data) {
              return;
            }
            this.houseData = [];
            this.commute_name = res.data.data.work_data.work_addr;
            this.houseData = res.data.data.data
              ? res.data.data.data
              : [];
            this.loanObj.down_payments =
              res.data.data.loan.down_payments;
            this.loanObj.loan_term = res.data.data.loan.loan_term;
            this.loanObj.lending_rate =
              res.data.data.loan.lending_rate;
            if (this.loanObj.down_payments === 100) {
              this.is_down_payments_100 = true;
            } else {
              this.is_down_payments_100 = false;
            }
            this.loan_cun = res.data.data.loan.lending_rate;
            this.house_num = res.data.data.house_num;
            this.project_num = res.data.data.project_num;
            if (environment === "development") {
              this.dataUrl =
                "https://comjia-1.oss-cn-beijing.aliyuncs.com";
            } else if (environment === "production") {
              this.dataUrl =
                "https://comjia-img.oss-cn-beijing.aliyuncs.com";
            }
            if (res.data.data.house_num < 2) {
              this.shareUserStatus = true;
            } else {
              this.shareUserStatus = false;
            }
            this.dialogarry = [];
            this.houseData.forEach(list => {
              list.house_type.forEach(items => {
                this.dialogarry.push(items);
                items.apart_img =
                  this.dataUrl + items.apart_img;
              });
            });
            this.houseHeight();
            // 重新调整样式
            this.scroll_y();
            this.tableKey += 1;
          } else {
            // 去掉loading动画
            this.tbLoading = false;
          }
        })
        .catch(err => {
          // 去掉loading动画
          this.tbLoading = false;
          console.log(err);
        });
    },
    // 打开楼盘对比分享弹窗
    shareUser () {
      let houseArr = [];
      this.houseData.forEach(ele => {
        ele.house_type.forEach(item => {
            houseArr.push({
                projectId: ele.project_id,
                houseType: item.house_type_id,
                apartmentType: item.apartment_type
            });
        });
      });
      localStorage.setItem("projectInfo", JSON.stringify(houseArr));
      let routeData = this.$router.resolve({
        path: `/moreHouseShare`,
        query: {
          city_id: this.$route.query.city_id,
          order_id: this.$route.query.order_id,
          is_open: true
        }
      });
      window.open(routeData.href, "_blank");
      this.shareStatus = false;
      // 进入弹窗默认选中前3个楼盘的户型
      let projeId = [];
      for (let i = 0; i < this.dialogarry.length; i++) {
        if (
          projeId.length < 3 &&
          projeId.indexOf(this.dialogarry[i].project_id) === -1
        ) {
          let Aobj = {
            projectId: this.dialogarry[i].project_id,
            projectName: this.dialogarry[i].project_name
          };
          this.projectInfo.push(Aobj);
          projeId.push(this.dialogarry[i].project_id);
        }
        if (projeId.indexOf(this.dialogarry[i].project_id) !== -1) {
          this.dialogarry[i].isactive = true;
          let obj = {
            houseType: this.dialogarry[i].house_type_id,
            projectId: this.dialogarry[i].project_id,
            apartmentType: "1",
            projectName: this.dialogarry[i].project_name
          };
          this.dooListgroup.push(obj);
        }
      }
      if (this.dooListgroup.length >= 2) {
        this.shareStatus = true;
      } else {
        this.shareStatus = false;
      }
      // 请求埋点接口
      commonFun.setTrack('3914', this.$store.state.trackCommon.info, {}, this.$store.state.trackCommon.backendApi);
    },
    cancelDialog () {
      // 取消弹窗
      this.dialogVisible = false;
      // 清除背景色
      for (let i = 0; i < this.dialogarry.length; i++) {
        if (this.dialogarry[i].isactive) {
          this.dialogarry[i].isactive = false;
        }
      }
      // 去掉选中项
      this.dooListgroup = [];
      this.projectInfo = [];
      this.shareStatus = false;
    },
    submitBtn () { },
    // 移动当前数据项
    house_move (items, index) {
      if (this.sortstatus) {
        this.sortstatus = false;
        let postData = {
          order_id: this.$route.query.order_id,
          project_id: items.project_id
        };
        this.axios
          .post("/backend-api/bk-map/sort-contrast", postData)
          .then(res => {
            this.sortstatus = true;
            if (res.status === 200 && res.data.code === 0) {
              let obj = items;
              this.houseData.splice(index, 1);
              this.houseData.unshift(obj);
              this.scroll_y();
              this.tableKey += 1;
              // 移动后整理当前分享给客户户型数组
              this.dialogarry = [];
              // this.houseData.forEach(list => {
              //   list.house_type.forEach(items => {
              //     this.dialogarry.push(items);
              //     items.apart_img =
              //       this.dataUrl + items.apart_img;
              //   });
              // });
            }
          });
      }
    },
    /**
     * 删除户型
     * @param {Object} eitem 户型数据对象
     * @param {Number} index 楼盘索引
     * @param {Number} i 户型索引
     */
    house_delete (eitem, index, i) {
      this.dialogarry = [];
      this.houseData[index].house_type.splice(i, 1);
      if (this.houseData[index].house_type.length <= 0) {
        this.houseData.splice(index, 1);
        this.project_num = this.project_num - 1;
      }
      let houseItem = [];
      this.houseData.forEach((ele) => {
            ele.house_type.forEach(item => {
                houseItem.push({
                    project_id: item.project_id,
                    house_id: item.house_type_id,
                    apartment_type: item.apartment_type
                });
            });
        });
      localStorage.setItem("chooseHouseProjectInfo", JSON.stringify(houseItem));
      this.scroll_y();
      this.tableKey += 1;
      this.houseData.forEach(list => {
        list.house_type.forEach(items => {
          this.dialogarry.push(items);
        });
      });
    },
    /**
     * 根据当前数据获取需要存储本地的数据
     * @param {Number} type 类型 表示谁调取的方法
     */
    getHasCheckedData() {
        const houseList = [];
        this.getCheckedHouse().forEach((ele, idx) => {
            if (ele) {
                const projectItem = this.houseOptions[idx];
                const houseItem = projectItem.house_id.map(item => {
                    return {
                        project_id: projectItem.project_id,
                        house_id: item.house_id,
                        apartment_type: item.apartment_type
                    };
                });
                houseList.push(...houseItem);
            }
        });
        localStorage.setItem("chooseHouseProjectInfo", JSON.stringify(houseList));
    },
    // 表格滚动事件监听Y轴
    scroll_y () {
      this.scrollY = false;
      this.$nextTick(() => {
        let scrollDiv = document.getElementsByClassName(
          "el-table__body-wrapper"
        )[0];
        scrollDiv.addEventListener("scroll", () => {
          let l1 = scrollDiv.scrollTop || document.body.scrollTop;
          if (l1 > 0) {
            this.scrollY = true;
          } else {
            this.scrollY = false;
          }
        });
      });
    },
    // 百度搜索地址
    setSearch () {
      let _this = this;
      this.mapcon = new BMap.Map("fak");
      this.ac = new BMap.Autocomplete({
        input: "searchHo",
        // 多个城市取第一个
        location: this.cityId.split(',')[0]
      });
      let myValue;
      // 鼠标点击下拉列表后的事件
      this.ac.addEventListener("onconfirm", e => {
        if (e && e.preventDefault) {
          e.preventDefault();
        } else {
          let _value = e.item.value;
          // 具体名字
          myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
          // 匹配经纬度
          let local = new BMap.LocalSearch(_this.mapcon, {
            onSearchComplete: function () {
              let pp = local.getResults().getPoi(0).point;
              _this.local.work_addr_lat = pp.lat;
              _this.local.work_addr_lng = pp.lng;
              _this.commute_name = myValue;
              _this.getSearch();
            }
          });
          local.search(myValue);
        }
      });
    },
    // 新增对比户型
    add_contrast () {
      // PubSub.publish('openContrastModal', { type: '2' })
      this.$refs.oldMadel.getloupanData("2");
    },
    houseHeight () {
      this.$nextTick(() => {
        let houseTypeItem = document.getElementsByClassName(
          "house_type_item"
        );
        let arr = [];
        for (let i = 0; i < houseTypeItem.length; i++) {
          let houseTypeLi = houseTypeItem[i].children;
          arr.push(houseTypeLi);
        }
        this.autoHeight = [];
        for (let k = 0; k < arr[0].length; k++) {
          for (let j = 0; j < arr.length; j++) {
            arr[j][k].style.cssText = "height:auto;";
          }
        }
        setTimeout(() => {
          for (let k = 0; k < arr[0].length; k++) {
            let c = [];
            for (let j = 0; j < arr.length; j++) {
              c.push(arr[j][k].offsetHeight);
            }
            let max = Math.max(...c);
            this.autoHeight.push(max);
          }
        }, 100);
      });
    }
  },
  watch: {
    controlData: {
      deep: true,
      handler: function (val) {
        // 获取父组件下发的筛选内容
        this.filterData = this.controlData;
        if (val[0].condition[1]) {
          this.loanObj.down_payments = val[0].condition[1].ratio;
        }
      }
    },
    houseData: {
      handler: function (val, oldval) {
        if (val.length) {
          this.scroll_y();
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.sliderLeft-enter,
.sliderLeft-leave-to {
  transform: translateX(100%);
}
.sliderLeft-enter-active,
.sliderLeft-leave-active {
  transition: 0.2s cubic-bezier(0, 0, 1, 1);
}
.loupan-plane {
  .loupan-plane-head {
    overflow: hidden;
    padding-left: 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    > ul {
      overflow: hidden;
      margin-top: 12px;
      margin-bottom: 10px;
      li {
        float: left;
        margin-right: 14px;
        color: #333;
        &:last-child {
          margin-left: 22px;
          .td {
            width: 250px;
          }
        }
        .th {
          float: left;
          line-height: 34px;
          font-size: 14px;
          margin-right: 6px;
        }
        .td {
          float: left;
          width: 100px;
        }
      }
    }
    .p-text {
      font-size: 12px;
      margin-bottom: 12px;
      .text-num {
        color: #33a1ff;
      }
    }
  }
}
.loupan-content {
  background: #fff;
  .el-dialog__header {
    padding: 30px 30px 10px;
  }
  .dialog-body {
    max-height: 240px;
    overflow: auto;
  }
}
.loupan-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  height: 56px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  span {
    cursor: pointer;
    padding: 10px 10px 10px 0;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
}
.house_table {
  padding-left: 20px;
  min-height: 550px;
  margin-top: 10px;
  .house-ul {
    li {
      min-height: 44px;
      line-height: 44px;
      border-bottom: 1px solid #ebeef5;
      padding-left: 20px;
      color: #333;
    }
  }
  .house_type {
    float: left;
    width: 220px;
    border-right: 1px solid #ebeef5;
    &:last-child {
      border-right: none;
    }
  }
}
.house_table-head {
  overflow: hidden;
}
.house_head_over {
  overflow: hidden;
}
.house_head_ul {
  float: left;
  width: 220px;
  border-right: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  &:last-child {
    border-right: none;
  }
  li {
    padding-top: 20px;
    padding-bottom: 9px;
    padding-left: 20px;
    position: relative;
    color: #333;
    .delete_house {
      position: absolute;
      color: #ccc;
      font-size: 12px;
      cursor: pointer;
      display: inline-block;
      top: 12px;
      right: 12px;
    }
    .house_name {
      span {
        &:first-child {
          font-size: 14px;
          display: inline-block;
          margin-right: 6px;
        }
        &:last-child {
          color: #6ac073;
          background: rgba(106, 192, 115, 0.2);
          border-radius: 2px;
          padding: 2px 6px;
        }
      }
    }
  }
  .btn_li {
    padding-top: 0;
    padding-left: 20px;
    height: 40px;
    overflow: hidden;
    button {
      border: none;
      margin-top: 10px;
      font-size: 12px;
      background: #0ad487;
      border-radius: 2px;
      color: #fff;
      padding: 8px 10px;
    }
  }
  .scroll_y {
    background: rgba(236, 240, 241, 0.5);
  }
}

.h-46 {
  height: 46px;
  display: block;
}
.house_project_name {
  background: rgba(236, 240, 241, 0.5);
  position: relative;
  .name {
    line-height: 46px;
    padding-left: 20px;
    font-size: 16px;
    color: #3e4254;
    font-weight: 700;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    // width: 130px;
  }
  .move {
    position: absolute;
    right: 12px;
    top: 12px;
    cursor: pointer;
    .before {
      height: 15px;
      width: 17px;
      display: inline-block;
      vertical-align: text-top;
      background: url(./images/move.png);
      background-size: cover;
      margin-right: 5px;
    }
  }
}
.house_table {
  /deep/.title_type {
    background: #ecf0f1;
    font-size: 14px;
    font-weight: 700;
    color: #3e4254;
    height: 100%;
  }
  .title_type_kb {
    background: rgba(236, 240, 241, 0.5);
  }
  .color_red {
    color: #ff5c47;
  }
  .house_img {
    img {
      width: 180px;
      height: 120px;
      padding: 10px 0;
    }
  }
}
.house_type_item li {
  min-height: 44px;
  border-bottom: 1px solid #ebeef5;
  padding-left: 20px;
  padding-right: 10px;
  line-height: 2;
  color: #333;
  p {
    padding-top: 10px;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
}
.list li {
  width: 170px;
  border: solid 1px #e6e6e6;
  border-radius: 2px;
  display: inline-block;
  color: #3e4254;
  font-size: 14px;
  margin-bottom: 12px;
  padding: 5px 8px;
  box-sizing: border-box;
  font-weight: 500;
  cursor: pointer;
  &:nth-of-type(odd) {
    margin-right: 20px;
  }
  .project_name {
    font-size: 14px;
    margin-bottom: 2px;
  }
  span {
    display: block;
    font-size: 12px;
    font-weight: normal;
  }
  &.active {
    background-color: #e3f6fe;
    border-color: #e3f6fe;
    position: relative;
    .bg {
      display: inline-block;
      position: absolute;
      background-image: url(./images/house-xz.png);
      background-size: cover;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
    }
  }
}
.img-dialog {
  /deep/.el-dialog {
    height: 300px;
    text-align: center;
    img {
      display: inline-block;
      height: 100%;
      max-width: 100%;
    }
    .el-dialog__header {
      padding-bottom: 15px;
      .el-dialog__headerbtn {
        display: block ;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
<style scoped>
.loupan-plane-head .td >>> .el-input {
  font-size: 14px;
}
.loupan-plane-head .td >>> .el-input__inner {
  height: 34px;
  line-height: 34px;
  padding-left: 6px;
  padding-right: 0;
  border-radius: 3px;
}
.loupan-plane-head .td >>> .el-input__icon {
  line-height: 34px;
}
.sele-unit >>> .el-input__suffix-inner {
  display: none;
}
.sele-unit >>> .el-input__suffix:after {
  content: "%";
  position: absolute;
  right: 5px;
  top: 10px;
  font-size: 12px;
}

.dialog-footer >>> .el-button--default {
  background-color: #e6e6e6;
  color: #77808a;
}
.loupan-content .dialog-footer >>> .el-button--default:hover {
  border: solid 1px #e6e6e6;
}
.loupan-content .dialog-footer >>> .el-button--primary {
  background-color: #33a1ff;
}
.loupan-content .dialog >>> .el-dialog {
  border-radius: 7px;
  width: 430px;
}
.loupan-title >>> .el-button--primary {
  box-shadow: 0 2px 4px 0 rgba(51, 161, 255, 0.3);
}

.house_table >>> .el-table .cell {
  padding-right: 0;
}
.house_table >>> .el-table--border th.gutter:last-of-type {
  border: none;
}
.house_table >>> .el-table .cell,
.house_table >>> .el-table th div,
.house_table >>> .el-table--border td:first-child .cell,
.house_table >>> .el-table--border th:first-child .cell {
  padding-left: 0;
}
.house_table >>> .el-table th div {
  padding-right: 0;
  padding-bottom: 0;
}
.house_table >>> .el-table__row > td {
  padding-top: 0;
  padding-bottom: 0;
}
.house_table >>> .el-table__body tr.hover-row td {
  background: none;
}
.house_table >>> .el-table td,
.house_table >>> .el-table th {
  padding: 0;
}
.house_table >>> .el-table thead {
  font-size: 14px;
}
.house_table >>> .el-table__fixed-header-wrapper .el-table__header th {
  font-weight: 500;
}
.house_table >>> .el-table__header-wrapper .has-gutter tr th {
  font-weight: 500;
}
.house_table >>> .el-table th div {
  line-height: normal;
  padding-left: 0;
}
.house_table >>> .el-table th .title_type{
  line-height: 46px;
  padding-left: 20px;
}
.house_table >>> .el-table th div,
.house_table >>> .el-table th > .cell {
  display: block;
}
.house_table >>> .el-table--scrollable-y .el-table__body-wrapper {
  overflow-y: auto;
}
.house_table >>>  .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.house_table >>> .el-table td,
.house_table >>> .el-table th.is-leaf {
  border-bottom: none;
}
.house_table >>> .el-table--border th,
.house_table >>> .el-table__fixed-right-patch {
  border-bottom: none;
}
.loupan-content >>> .el-dialog__header .el-dialog__headerbtn {
  display: none ;
}
.loupan-content >>> .el-dialog__body {
  padding-bottom: 0;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 0;
  height: 236px;
}
.loupan-content >>> .el-dialog__title {
  font-weight: 500;
  color: #3e4254;
}
.loupan-content >>> .el-dialog__footer {
  padding: 14px 0;
  font-size: 16px;
  text-align: center;
  box-shadow: 0 0 5px 0 rgba(69, 69, 83, 0.1);
  border-radius: 0px 0px 8px 8px;
}
.loupan-content .dialog-footer >>> .el-button {
  padding: 10px 30px;
  height: 38px;
  width: 132px;
}
</style>
