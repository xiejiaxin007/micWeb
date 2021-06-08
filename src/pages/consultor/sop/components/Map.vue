<template>
<div class="map-wrap" >
  <el-dialog
    custom-class='dia-wrap'
    :visible.sync="visible"
    @close='closeDialog'>
    <span slot="title">
      楼盘位置信息说明
    </span>
    <div class="con">
      <ul class="info">
        <li class="auto">
          <div class="th">楼盘名称：</div>
          <div class="td">{{houseName}}</div>
        </li>
        <li class="auto">
          <div class="th">楼盘位置：</div>
          <div class="td">（经度：{{location.lng}} 纬度：{{location.lat}}）</div>
        </li>
      </ul>
      <div class="map-container" >
        <div id="map"></div>
        <div class="search">
          <div class="up-error">
            <el-checkbox v-model="checked"></el-checkbox>
            楼盘位置有误？点击报错
          </div>
          <div id="find-house" v-show="checked">
            <p>请输入楼盘位置：</p>
            <input type="text" id="suggestId" placeholder="请输入楼盘正确位置帮助我们及时更正"/>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancleEdit">取 消</el-button>
      <el-button type="primary" @click="selectLocation">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import loadMap from '@/assets/js/utils/map.js';
export default {
  props: ['project_id', 'project_name', 'showMap'],
  data () {
    return {
      checked: false,
      val: '',
      location: {
        lng: '',
        lat: ''
      },
      map: {},
      ac: {},
      visible: true,
      checkAddress: '', // 选择的地址
      houseId: '', // 楼盘project_id
      houseName: '' // 楼盘名称
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.houseName = this.project_name
      this.houseId = this.project_id
      this.getAddress()
    })
  },
  methods: {
    closeDialog () {
      this.visible = false
      this.$emit('closeDialog', false)
    },
    // 初始化地图
    setMap (lng, lat) {
      this.map = new BMap.Map('map')
      this.map.clearOverlays()
      let point = new BMap.Point(lng, lat)
      let marker = new BMap.Marker(point)
      // 鼠标缩放
      this.map.enableScrollWheelZoom(true)
      this.map.addOverlay(marker)
      this.map.centerAndZoom(point, 17)
    },
    // 搜索位置功能实现
    setSearch () {
      const _this = this
      // 建立一个自动完成的对象
      this.ac = new BMap.Autocomplete({'input': 'suggestId', 'location': _this.map})
      let myValue
      // 鼠标点击下拉列表后的事件
      this.ac.addEventListener('onconfirm', (e) => {
        if (e && e.preventDefault) {
          e.preventDefault()
        } else {
          let _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          this.checkAddress = myValue
        }
      })
    },
    // 获取楼盘位置信息
    getAddress () {
      let params = {
        project_id: this.houseId
      }
      this.axios.get('/backend-api/bk-project/get-project-pos', {params: params})
        .then((res) => {
          if (res.data.code === 0) {
            let resData = res.data.data
            this.location.lng = parseFloat(resData.lng)
            this.location.lat = parseFloat(resData.lat)
            this.$nextTick(() => {
              // 确保加载完成才实例化地图
              loadMap.loadMap().then(() => {
                this.setMap(this.location.lng, this.location.lat)
                this.setSearch()
                let lngAdd = this.location.lng
                let latAdd = this.location.lat
                this.map.addEventListener('zoomend', () => {
                  let point = new BMap.Point(lngAdd, latAdd)
                  let marker = new BMap.Marker(point)
                  this.map.addOverlay(marker)
                  this.map.centerAndZoom(point)
                  this.map.panTo(point)
                })
              });
            })
          }
        })
    },
    // 上报楼盘位置信息
    selectLocation () {
      if (!this.checked) {
        this.visible = false
      } else {
        let params = {
          project_id: this.houseId,
          content: this.checkAddress
        }
        this.axios.post('/backend-api/bk-project/report-error', params)
          .then((res) => {
            if (res.data.code === 0) {
              this.visible = false
            } else {
              this.$message({
                message: '提交失败',
                type: null,
                duration: 1000
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    // 取消
    cancleEdit () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.con{
  margin:auto;
}
#map{
  height: 300px;
  width: 480px;
  margin:auto;
}
.map-container {
  width: 100%;
  height: 100%;
  font-size: 14px;
}
.search {
  margin-top: 10px;
}
.up-error{
  padding-bottom: 5px;
}
#find-house p {
  float: left;
  padding-right: 10px;
  line-height: 32px;
}
#find-house input {
  width: 340px;
  padding: 5px;
  border:1px solid #ddd;
}
.th,.td{
  float: left;
  font-size: 14px;
}
.info li.auto{
  overflow: hidden;
  padding-bottom: 10px;
}
.map-wrap  .dia-wrap{
  width: 520px;
}
.map-wrap >>> .el-dialog__wrapper .el-dialog__body{
  padding: 15px 20px;
}
.map-wrap >>> .el-dialog__wrapper .el-dialog__header{
  font-size: 18px;
  color: #fff;
  padding: 20px 15px;
  border-bottom: 1px solid #e3e3e3;
  background-image: linear-gradient(-1deg, #2ea1f8 2%, #1990ea 100%);
  overflow: hidden;
}
.map-wrap >>> .el-dialog__wrapper .el-dialog__footer{
  text-align: center;
}
.map-wrap >>> .anchorBL{
  display:none;
}
</style>
<style>
body .tangram-suggestion-main{
  z-index: 2222;
  height: 150px;
  overflow-y: scroll;
}
</style>