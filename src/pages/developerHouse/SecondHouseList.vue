<!--
 * @Name: 二手房源列表
 * @Description: 二手房源列表
 * @Author: xiebin
 * @Date: 2020-04-22
-->
<template>
  	<div class="house-box">
    	<!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
        <el-breadcrumb-item>
			<i class="iconfont iconicon_zhoubianjiaotongx" aria-hidden="true"></i>
            <a href="/">首页</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            二手房源列表
        </el-breadcrumb-item>
        </el-breadcrumb>
		<div class="filter-box">
			<el-form :inline="true" :model="selectForm" class="demo-form-inline">
			<el-form-item label="小区名称:">
				<el-select
				 	v-model="selectForm.communityVal"
					filterable
    				remote
					placeholder="请输入小区名称"
					:remote-method="getPlatListInfo"
					@change="communityChangeVal">
					<el-option
					v-for="item in selectForm.communityData"
					:key="item.value"
					:label="item.name"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="维护人:">
				<el-select
					v-model="selectForm.maintenanceVal"
					filterable
					placeholder="请输入维护人信息"
					remote
					:remote-method="getMaintainListInfo"
					@change="maintenanceChangeVal">
					<el-option
					v-for="item in selectForm.maintenanceData"
					:key="item.value"
					:label="item.name"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			</el-form>
			<div class="check-box">
				<ul>
					<li>
						<div class="jl-th">
							<label>区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="regionRadioVal">
								<el-radio
									v-for="(item, index) in filterData.a.value"
									:key="index"
									:label="item.value"
									@change="radioChangeVal(item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<li v-show="this.businessIsShow">
						<div class="jl-th">
							<label>商&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;圈:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-checkbox-group v-model="checkListVal">
								<el-checkbox
									v-for="(item, index) in checkListData"
									:key="index"
									:label="item.value"
									@change="areaCheckChangeVal($event, item)">
									{{item.name}}
								</el-checkbox>
							</el-checkbox-group>
						</div>
					</li>
					<li>
						<div class="jl-th">
							<label>居&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="roomRadioVal">
								<el-radio
									v-for="(item, index) in filterData.f.value"
									:key="index"
									:label="item.value"
									@change="roomChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<!-- 面积 -->
					<li>
						<div class="jl-th">
							<label>面&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;积:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="areaRadioVal">
								<el-radio
									v-for="(item, index) in filterData.e.value"
									:key="index"
									:label="item.value"
									@change="areaChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
							<div class="input-box">
								<jl-number-input
									v-model="minAreaVal"
									placeholder="最小"
									reg="int">
								</jl-number-input>
								<span class="line"> - </span>
								<jl-number-input
									v-model="maxAreaVal"
									placeholder="最大"
									reg="int">
								</jl-number-input>
								<span class="unit"> ㎡</span>
								<el-button
								 	type="text"
									 @click="areaSearch">
									 确定
								</el-button>
							</div>
						</div>
					</li>
					<!-- 价格 -->
					<li>
						<div class="jl-th">
							<label>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="priceRadioVal">
								<el-radio
									v-for="(item, index) in filterData.c.value"
									:key="index"
									:label="item.value"
									@change="priceChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
							<div class="input-box">
								<jl-number-input
									v-model="minPriceVal"
									placeholder="最小"
									reg="int">
								</jl-number-input>
								<span class="line"> - </span>
								<jl-number-input
									v-model="maxPriceVal"
									placeholder="最大"
									reg="int">
								</jl-number-input>
								<span class="unit"> 万</span>
								<el-button
									type="text"
									@click="priceSearch">
									确定
								</el-button>
							</div>
						</div>
					</li>
					<div v-if="isAllFilter">
					<!-- 楼层 -->
					<li>
						<div class="jl-th">
							<label>楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;层:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="floorRadioVal">
								<el-radio
									v-for="(item, index) in filterData.j.value"
									:key="index"
									:label="item.value"
									@change="floorChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<!-- 总楼层 -->
					<li>
						<div class="jl-th">
							<label>总 楼 层 :</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="allFloorRadioVal">
								<el-radio
									v-for="(item, index) in filterData.q.value"
									:key="index"
									:label="item.value"
									@change="allFloorChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
							<div class="input-box">
								<jl-number-input
									v-model="minAllFloorVal"
									placeholder="最小"
									reg="int">
								</jl-number-input>
								<span class="line"> - </span>
								<jl-number-input
									v-model="maxAllFloorVal"
									placeholder="最大"
									reg="int">
								</jl-number-input>
								<span class="unit">层</span>
								<el-button
								 	type="text"
									 @click="allFloorSearch">
									确定
								</el-button>
							</div>
						</div>
					</li>
					<!-- 朝向 -->
					<li>
						<div class="jl-th">
							<label>朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-checkbox-group v-model="towardsCheckListVal">
								<el-checkbox
									v-for="(item, index) in filterData.i.value"
									:key="index"
									:label="item.value"
									@change="towardsCheckChangeVal($event, item)">
									{{item.name}}
								</el-checkbox>
							</el-checkbox-group>
						</div>
					</li>
					<!-- 产证唯一 -->
					<li>
						<div class="jl-th">
							<label>产证唯一:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="certificateRadioVal">
								<el-radio
									v-for="(item, index) in filterData.m.value"
									:key="index"
									:label="item.value"
									@change="tcertificateCheckChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<!-- 装修 -->
					<li>
						<div class="jl-th">
							<label>装&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="decorationRadioVal">
								<el-radio
									v-for="(item, index) in filterData.k.value"
									:key="index"
									:label="item.value"
									@change="decorationCheckChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<!-- 房屋用途 -->
					<li>
						<div class="jl-th">
							<label>房屋用途:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="useRadioVal">
								<el-radio
									v-for="(item, index) in filterData.g.value"
									:key="index"
									:label="item.value"
									@change="useCheckChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<!-- 有无电梯 -->
					<li>
						<div class="jl-th">
							<label>有无电梯:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="elevatorRadioVal">
								<el-radio
									v-for="(item, index) in filterData.r.value"
									:key="index"
									:label="item.value"
									@change="elevatorChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					<!-- 房态 -->
					<li>
						<div class="jl-th">
							<label>房&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</label>
						</div>
						<div class="jl-td" v-if="this.filterData">
							<el-radio-group v-model="roomTypeRadioVal">
								<el-radio
									v-for="(item, index) in filterData.p.value"
									:key="index"
									:label="item.value"
									@change="roomTypeChangeVal($event, item)">
									{{item.name}}
								</el-radio>
							</el-radio-group>
						</div>
					</li>
					</div>
				</ul>
			</div>
			<!-- 分割线 -->
			<div @click="unfoldAll">
				<el-divider>{{!isAllFilter ? '展开' : '收起'}}全部条件</el-divider>
			</div>
			<!-- 筛选项 -->
			<div class="check-box" v-show="clearBtnIsShow">
				<ul>
					<li>
						<div class="jl-th">
							<label>已 选 择 :</label>
						</div>
						<div class="jl-td">
							<div
								style="display:flex"
								v-for="(item, key, index) in allFilterListData"
								:key="index">
								<div class="tag-list" v-if="typeof(item) == 'string'">
									<p>{{item}}</p>
									<i
									 	class="iconfont iconicon-delete" 
										aria-hidden="true"
										@click="clearFilter(item, key, 'string')"></i>
								</div>
								<div v-else class="tag-list" v-for="(data,i) in item"
										:key="i">
									<p>
										{{data}}
									</p>
									<i
										class="iconfont iconicon-delete" 
										aria-hidden="true"
										@click="clearFilter(data, key, 'array')">
										</i>
								</div>
							</div>
							<el-button
							 	type="text"
								class="btn-clear"
								v-show="clearBtnIsShow"
								@click="clearAllCheckList">清空已选项</el-button>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="table-box">
			<HouseTableList
				v-if="this.tableDataList && this.filterData"
				:tableDataList="tableDataList"
				:sortDataList="filterData.sort"
				:currentPage="currentPage"
				@sortTableList="sortTableList"
				@pageListChange="pageListChange"
				>
			</HouseTableList>
		</div>
  	</div>
</template>

<script>
import secondListApi from './api/secondHouseList';
import HouseTableList from './HouseTableList';
export default {
	components: {
		HouseTableList
	},
	data() {
		return {
			currentPage: 0,
			// 是否展开搜索条件
			isAllFilter: false,
			selectForm: {
				// 小区名称
				communityVal: '',
				// 小区名称数据
				communityData: [],
				// 维护人
				maintenanceVal: '',
				// 维护人数据
				maintenanceData: [],
			},
			// 区域的值
			regionRadioVal: '0',
			// 居室的值
			roomRadioVal: '0',
			// 面积的值
			areaRadioVal: '0',
			// 面积输入框的最小值
			minAreaVal: '',
			// 面积输入框的最大值
			maxAreaVal: '',
			// 价格输入框的最小值
			minPriceVal: '',
			// 价格输入框的最大值
			maxPriceVal: '',
			// 总楼层输入框的最小值
			minAllFloorVal: '',
			// 总楼层输入框的最大值
			maxAllFloorVal: '',
			// 价格的值
			priceRadioVal: '0',
			// 楼层的值
			floorRadioVal: '0',
			// 总楼层的值
			allFloorRadioVal: '0',
			// 朝向的值
			towardsCheckListVal: ['0'],
			// 产证唯一的值
			certificateRadioVal: '0',
			// 装修的值
			decorationRadioVal: '0',
			// 房屋用途的值
			useRadioVal: '0',
			// 有无电梯的值
			elevatorRadioVal: '0',
			// 房态的值
			roomTypeRadioVal: '0',
			// 筛选项的值集合
			filterData: null,
			// 商圈复选框的val
			checkListVal: [],
			// 商圈复选框的值
			checkListData: [],
			// 已选择的筛选项
			allFilterListData: {},
			// 商圈已选择的值集合
			businessArr: [],
			// 朝向已选择的值集合
			towardsArr: [],
			// 搜索条件
			filterSearchData: {
				filter: {
				}
			},
			// 表格数据
			tableDataList: null,
			// 商圈字段是否展示
			businessIsShow: false
		}
	},
	computed: {
		clearBtnIsShow() {
			return JSON.stringify(this.allFilterListData) !== '{}'
		}
	},
	mounted() {
		// 获取筛选项
		this.getsecondListInfo();
		// 获取维护人选项
		this.getMaintainListInfo();
		// 获取小区下拉选项
		this.getPlatListInfo();
		// 搜索条件重置
		this.searchListInit();
		this.getTableDataList();
	},
	methods: {
		// 搜索条件重置
		searchListInit() {
			// 搜索项默认值
			this.filterSearchData = {
				city_id: '',
				page: 1,
				filter: {
					// 区域
					a: this.checkListVal[0] == '0' ? this.regionRadioVal : this.checkListVal,
					// 价格
					c: this.priceRadioVal,
					// 面积
					e: this.areaRadioVal,
					// 居室
					f: this.roomRadioVal,
					// 房屋用途
					g: this.useRadioVal,
					// 朝向
					i: this.towardsCheckListVal,
					// 楼层
					j: this.floorRadioVal,
					// 总楼层
					q: this.allFloorRadioVal,
					// 装修
					k: this.decorationRadioVal,
					// 产证唯一
					m: this.certificateRadioVal,
					// 房态
					p: this.roomTypeRadioVal,
					// 有无电梯
					r: this.elevatorRadioVal,
				},
				// 小区
				village: this.selectForm.communityVal,
				// 维护人
				maintain: this.selectForm.maintenanceVal,
				// 排序
				sort: []
			}
		},
		// 获取筛选项
		async getsecondListInfo() {
			try {
				let params = {
					city_id: ''
				}
				let result = await secondListApi.getFilterListData(params);
				let { data } = result;
				if (data.code === 0) {
					// 筛选项赋值
					this.filterData = data.data.filter;
					// 商圈的值初始化
					if (this.filterData.a) {
						this.checkListData = this.filterData.a.value[1].options;
					}
					console.log(this.filterData)
				}
				else if (data.code === 1007) {
					this.$alert('该角色无虚拟城市数据', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							window.location.href = "/";
						}
					});
				}
			}
			catch(error) {
				console.log(error);
			}
		},
		// 获取维护人选项
		async getMaintainListInfo(query) {
			try {
				let params = {
					q: query
				}
				let result = await secondListApi.getMaintainListData(params);
				let { data } = result;
				if (data.code === 0) {
					this.selectForm.maintenanceData = data.data.list;
				}
			}
			catch(error) {
				console.log(error);
			}
		},
		// 获取小区选项
		async getPlatListInfo(query) {
			try {
				let params = {
					q: query
				}
				let result = await secondListApi.getPlatListData(params);
				let { data } = result;
				if (data.code === 0) {
					this.selectForm.communityData = data.data.list;
				}
			}
			catch(error) {
				console.log(error);
			}
		},
		// 小区select发生改变的时候
		communityChangeVal(e) {
			this.currentPage++;
			this.filterSearchData.village = this.selectForm.communityVal;
			let index = this.selectForm.communityData.findIndex(itme => {
				return e == itme.value
			})
			this.$set(this.allFilterListData, 'village', this.selectForm.communityData[index].name);
			// 搜索方法调用
			this.getTableDataList();
		},
		// 维护人select发生改变的时候
		maintenanceChangeVal(e, name) {
			this.currentPage++;
			this.filterSearchData.maintain = this.selectForm.maintenanceVal;
			let index = this.selectForm.maintenanceData.findIndex(itme => {
				return e == itme.value
			})
			this.$set(this.allFilterListData, 'maintain', this.selectForm.maintenanceData[index].name);
			// 搜索方法调用
			this.getTableDataList();
		},
		// 搜索获取表格数据
		async getTableDataList() {
			try {
				let params = this.filterSearchData;
				let result = await secondListApi.getsearchListData(params);
				let { data } = result;
				console.log(data);
				if (data.code === 0) {
					this.tableDataList = data.data;
					console.log(this.tableDataList)
				}
			}
			catch(error) {
				console.log(error);
			}
		},
		/**
		 * 排序
		 */
		sortTableList(e) {
			console.log(e)
			this.filterSearchData.sort = e;
			this.getTableDataList();
		},
		// 分页改变的 时候
		pageListChange(e) {
			console.log(e)
			this.filterSearchData.page = e;
			this.getTableDataList();
		},
		// 点击价格搜索的时候
		priceSearch() {
			this.currentPage++;
			if (this.minPriceVal !== '' && this.maxPriceVal !== '') {
				if (Number(this.minPriceVal) > Number(this.maxPriceVal)) {
					this.$message({
						showClose: true,
						message: '价格最小值需要小于最大值',
						type: 'error'
					});
					return
				}
			}
			// 删除单选框已选择项
			// this.$delete(this.allFilterListData, 'price');
			this.priceRadioVal = '';
			if (this.minPriceVal == '' && this.maxPriceVal.length > 0) {
				this.minPriceVal = 0;
				let priceVal = `<=${this.maxPriceVal}万`;
				this.$set(this.allFilterListData, 'price', priceVal);
				this.filterSearchData.filter.c = `0,${this.maxPriceVal}`;
			}
			else if (this.minPriceVal.length > 0 && this.maxPriceVal == '') {
				this.maxPriceVal = 9999;
				let priceVal = `>=${this.minPriceVal}万`;
				this.$set(this.allFilterListData, 'price', priceVal);
				this.filterSearchData.filter.c = `${this.minPriceVal},9999`;
			}
			else if (this.minPriceVal.length > 0 && this.maxPriceVal.length > 0) {
				let priceVal = `${this.minPriceVal}-${this.maxPriceVal}万`;
				this.$set(this.allFilterListData, 'price', priceVal);
				this.filterSearchData.filter.e = `${this.minPriceVal},${this.maxPriceVal}`;
			}
			// 搜索方法调用
			this.getTableDataList();
		},
		// 点击面积搜索的时候
		areaSearch() {
			this.currentPage++;
			if (this.minAreaVal !== '' && this.maxAreaVal !== '') {
				if (Number(this.minAreaVal) > Number(this.maxAreaVal)) {
					this.$message({
						showClose: true,
						message: '面积最小值需要小于最大值',
						type: 'error'
					});
					return
				}
			}
			// 删除单选框已选择项
			// this.$delete(this.allFilterListData, 'price');
			// 点击搜索的时候将面积单选设为不限
			this.areaRadioVal = '';
			// 当最小值为空  最大值有值时
			if (this.minAreaVal == '' && this.maxAreaVal.length > 0) {
				this.minAreaVal = 0;
				let areaVal = `<=${this.maxAreaVal}㎡`;
				this.$set(this.allFilterListData, 'area', areaVal);
				this.filterSearchData.filter.e = `0,${this.maxAreaVal}`;
			}
			else if (this.minAreaVal.length > 0 && this.maxAreaVal == '') {
				this.maxAreaVal = 9999;
				let areaVal = `>=${this.minAreaVal}㎡`;
				this.$set(this.allFilterListData, 'area', areaVal);
				this.filterSearchData.filter.e = `${this.minAreaVal},9999`;
			} else if (this.minAreaVal.length > 0 && this.maxAreaVal.length > 0) {
				let areaVal = `${this.minAreaVal}-${this.maxAreaVal}㎡`;
				this.$set(this.allFilterListData, 'area', areaVal);
				this.filterSearchData.filter.e = `${this.minAreaVal},${this.maxAreaVal}`;
			}
			// 搜索方法调用
			this.getTableDataList();
		},
		// 点击总楼层搜索的时候
		allFloorSearch() {
			this.currentPage++;
			if (this.minAllFloorVal !== '' && this.maxAllFloorVal !== '') {
				if (Number(this.minAllFloorVal) > Number(this.maxAllFloorVal)) {
					this.$message({
						showClose: true,
						message: '面积最小值需要小于最大值',
						type: 'error'
					});
					return
				}
			}
			// 删除单选框已选择项
			// this.$delete(this.allFilterListData, 'price');
			// 点击搜索的时候将总楼层单选设为不限
			this.allFloorRadioVal = '';
			// 当最小值为空  最大值有值时
			if (this.minAllFloorVal == '' && this.maxAllFloorVal.length > 0) {
				this.minAllFloorVal = 0;
				let allFloorVal = `<=${this.maxAllFloorVal}层`;
				this.$set(this.allFilterListData, 'allFloor', allFloorVal);
				this.filterSearchData.filter.q = `0,${this.maxAllFloorVal}`;
			}
			// 当最大值为空  最小值有值时
			else if (this.minAllFloorVal.length > 0 && this.maxAllFloorVal == '') {
				this.maxAllFloorVal = 9999;
				let allFloorVal = `>=${this.minAllFloorVal}层`;
				this.$set(this.allFilterListData, 'allFloor', allFloorVal);
				this.filterSearchData.filter.q = `${this.minAllFloorVal},9999`;
			}
			else if (this.minAllFloorVal.length > 0 && this.maxAllFloorVal.length > 0) {
				let allFloorVal = `${this.minAllFloorVal}-${this.maxAllFloorVal}层`;
				this.$set(this.allFilterListData, 'allFloor', allFloorVal);
				this.filterSearchData.filter.e = `${this.minAllFloorVal},${this.maxAllFloorVal}`;
			}
			// 搜索方法调用
			this.getTableDataList();
		},
		
		/**
		 * 单选已选择项赋值
		 * @param {Object} item 当前选中的项 
		 * @param {Object} key 选项分类 
		 * @param {Object} type 类型 
		 */
		clearFilter(item, key, type) {
			console.log(item, key)
			this.$delete(this.allFilterListData, key);
			if (type == 'string') {
				if (key == 'district') {
					// 将商圈隐藏
					this.businessIsShow = false;
					this.regionRadioVal = '0';
					// 将商圈选中的数据也清除
					this.businessArr = [];
					this.$set(this.allFilterListData, 'business', this.businessArr);
					// 清空商圈的值
					this.checkListVal = ['0'];
					this.checkListData = this.filterData.a.value[1].options;
					this.$delete(this.allFilterListData, 'business');
				}
				else if (key == 'room') {
					this.roomRadioVal = '0';
				}
				else if (key == 'area') {
					this.areaRadioVal = '0';
					// 清空面积输入框
					this.minAreaVal = '';
					this.maxAreaVal = '';
				}
				else if (key == 'price') {
					this.priceRadioVal = '0';
					this.minPriceVal = '';
					this.maxPriceVal = '';
				}
				else if (key == 'floor') {
					this.floorRadioVal = '0';
				}
				else if (key == 'allFloor') {
					this.allFloorRadioVal = '0';
					this.minAllFloorVal = '';
					this.maxAllFloorVal = '';
				}
				else if (key == 'certificate') {
					// 产证唯一
					this.certificateRadioVal = '0';
				}
				else if (key == 'decoration') {
					this.decorationRadioVal = '0';
				}
				else if (key == 'use') {
					this.useRadioVal = '0';
				}
				else if (key == 'elevator') {
					this.elevatorRadioVal = '0';
				}
				else if (key == 'roomType') {
					this.roomTypeRadioVal = '0';
				}
				else if (key == 'village') {
					this.selectForm.communityVal = '';
				}
				else if (key == 'maintain') {
					this.selectForm.maintenanceVal = '';
				}
			} else {
				if (key == 'business') {
					// 当取消选中的时候将已选中项里的值清空
					let index = this.businessArr.findIndex(data => data == item);
					this.businessArr.splice(index, 1);
					this.$set(this.allFilterListData, 'business', this.businessArr);
					// 清空复选框选中的值
					this.checkListVal.splice(index, 1);
					if (this.checkListVal.length == 0) {
						this.checkListVal = ['0'];
					}
				}
				else if (key == 'towards') {
					// 当取消选中的时候将已选中项里的值清空
					let index = this.towardsArr.findIndex(data => data == item.name);
					this.towardsArr.splice(index, 1);
					this.allFilterListData.towards = this.towardsArr;
					// 清空复选框选中的值
					this.towardsCheckListVal.splice(index, 1);
					if (this.towardsCheckListVal.length == 0) {
							this.towardsCheckListVal = ['0'];
							this.$delete(this.allFilterListData, 'towards');
					}
				}
			}
				console.log(this.allFilterListData)
			// 搜索选项重置
			this.searchListInit();
			// 搜索方法调用
			this.getTableDataList();
		},
		// 清空全部已选项
		clearAllCheckList() {
			// 将商圈隐藏
			this.businessIsShow = false;
			this.regionRadioVal = '0';
			this.$delete(this.allFilterListData, 'district');
			this.areaRadioVal = '0';
			this.$delete(this.allFilterListData, 'area');
			this.priceRadioVal = '0';
			this.$delete(this.allFilterListData, 'price');
			this.roomRadioVal = '0';
			this.$delete(this.allFilterListData, 'room');
			this.floorRadioVal = '0';
			this.$delete(this.allFilterListData, 'floor');
			this.allFloorRadioVal = '0';
			this.$delete(this.allFilterListData, 'allFloor');
			this.certificateRadioVal = '0';
			this.$delete(this.allFilterListData, 'certificate');
			this.decorationRadioVal = '0';
			this.$delete(this.allFilterListData, 'decoration');
			this.useRadioVal = '0';
			this.$delete(this.allFilterListData, 'use');
			this.elevatorRadioVal = '0';
			this.$delete(this.allFilterListData, 'elevator');
			this.roomTypeRadioVal = '0';
			this.$delete(this.allFilterListData, 'roomType');
			// 清空小区的值
			this.selectForm.communityVal = '';
			this.$delete(this.allFilterListData, 'village');
			// 清空维护人的值
			this.selectForm.maintenanceVal = '';
			this.$delete(this.allFilterListData, 'maintain');
			this.towardsCheckListVal = ['0'];
			this.checkListVal = ['0'];
			this.towardsArr = [];
			this.businessArr = [];
			this.$set(this.allFilterListData, 'business', this.businessArr);
			this.$set(this.allFilterListData, 'towards', this.towardsArr);
			this.$delete(this.allFilterListData, 'business');
			this.$delete(this.allFilterListData, 'towards');
			// 清空商圈的值
			this.checkListVal = ['0'];
			this.checkListData = this.filterData.a.value[1].options;
			// 搜索选项重置
			this.searchListInit();
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 单选已选择项赋值
		 * @param {Object} item 当前选中的项 
		 * @param {Object} typeNmae 选项分类 
		 */
		radioCheckVal(item, typeName) {
			console.log(item, typeName)
			this.currentPage++;
			if (item.name !== '不限') {
				// this.allFilterListData[typeName] = item.name;
				this.$set(this.allFilterListData, typeName, item.name);
			} else {
				this.$delete(this.allFilterListData, typeName);
			}
			console.log(this.allFilterListData)
		},
		/**
		 * 当区域放生改变的时候
		 * @param {Array} item 商圈的值
		 */
		radioChangeVal(item) {
			console.log(item)
			if (item.name == '不限') {
				this.businessIsShow = false;
			} else {
				this.businessIsShow = true;
			}
			this.checkListData = item.options;
			// 清空商圈的值
			this.checkListVal = ['0'];
			// 切换区域的时候将商圈的已选择项清除
			this.businessArr = [];
			this.$delete(this.allFilterListData, 'business');
			// 已选中项赋值
			this.radioCheckVal(item, 'district');
			// 搜索条件赋值
			this.filterSearchData.filter.a = this.regionRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当商圈放生改变的时候
		 * @param {Array} item 当前商圈的值
		 */
		areaCheckChangeVal(e, item) {
			console.log(e)
			this.currentPage++;
			if (e == true) {
				if (item.name === '不限') {
					this.checkListVal = ['0'];
					// 选择不限的时候删除已选择项的值
					this.$delete(this.allFilterListData, 'business');
					this.businessArr = [];
					// 搜索条件赋值
					this.filterSearchData.filter.a = this.regionRadioVal;
				} else {
					if (this.checkListVal.includes('0')) {
						this.checkListVal = this.checkListVal.slice(1);
					}
					this.checkListVal.push(item.value);
					this.checkListVal = Array.from(new Set(this.checkListVal));
					// 已选择项赋值
					this.businessArr.push(item.name)
					this.$set(this.allFilterListData, 'business', this.businessArr);
					// 搜索条件赋值
					this.filterSearchData.filter.a = this.checkListVal;
				}
			} else {
				// 当取消选中的时候将已选中项里的值清空
				let index = this.businessArr.findIndex(data => data == item.name);
				this.businessArr.splice(index, 1);
				this.allFilterListData.business = this.businessArr;
				console.log(this.allFilterListData)
				if(this.checkListVal.length > 0) {
					this.filterSearchData.filter.a = this.checkListVal;
				} else {
					this.filterSearchData.filter.a = this.regionRadioVal;
				}
			}
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当朝向放生改变的时候
		 * @param {Array} item 当前商圈的值
		 */
		towardsCheckChangeVal(e, item) {
			console.log(e, item)
			this.currentPage++;
			if (e == true) {
				if (item.name === '不限') {
					this.towardsCheckListVal = ['0'];
					// 选择不限的时候删除已选择项的值
					this.$delete(this.allFilterListData, 'towards');
					this.towardsArr = [];
				} else {
					if (this.towardsCheckListVal.includes('0')) {
						this.towardsCheckListVal = this.towardsCheckListVal.slice(1);
					}
					this.towardsCheckListVal.push(item.value);
					this.towardsCheckListVal = Array.from(new Set(this.towardsCheckListVal));
					// 已选择项赋值
					this.towardsArr.push(item.name)
					this.$set(this.allFilterListData, 'towards', this.towardsArr);
					if (this.towardsArr.length == 0) {
						this.$delete(this.allFilterListData, 'towards');
					}
					console.log(this.allFilterListData)
					// 搜索条件赋值
					this.filterSearchData.filter.i = this.towardsCheckListVal;
				}
			} else {
				// 当取消选中的时候将已选中项里的值清空
				let index = this.towardsArr.findIndex(data => data == item.name);
				this.towardsArr.splice(index, 1);
				this.allFilterListData.towards = this.towardsArr;
				if(this.towardsCheckListVal.length > 0) {
					this.filterSearchData.filter.i = this.towardsCheckListVal;
				} else {
					this.towardsCheckListVal = ['0'];
					this.filterSearchData.filter.i = this.towardsCheckListVal;
					this.$delete(this.allFilterListData, 'towards');
				}
				console.log(this.allFilterListData)
			}
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当居室放生改变的时候
		 * @param {Array} item 当前居室的值
		 */
		roomChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'room');
			// 搜索条件赋值
			this.filterSearchData.filter.f = this.roomRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当面积放生改变的时候
		 * @param {Array} item 当前面积的值
		 */
		areaChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'area');
			// 搜索条件赋值
			this.filterSearchData.filter.e = this.areaRadioVal;
			// 调用搜索方法
			this.getTableDataList();
			// 清空面积输入框
			this.minAreaVal = '';
			this.maxAreaVal = '';
		},
		/**
		 * 当价格放生改变的时候
		 * @param {Array} item 当前价格的值
		 */
		priceChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'price');
			// 搜索条件赋值
			this.filterSearchData.filter.c = this.priceRadioVal;
			// 清空价格
			this.minPriceVal = '';
			this.maxPriceVal = '';
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当楼层放生改变的时候
		 * @param {Array} item 当前楼层的值
		 */
		floorChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'floor');
			// 搜索条件赋值
			this.filterSearchData.filter.j = this.floorRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当总楼层放生改变的时候
		 * @param {Array} item 当前总楼层的值
		 */
		allFloorChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'allFloor');
			// 搜索条件赋值
			this.filterSearchData.filter.q = this.allFloorRadioVal;
			this.minAllFloorVal = '';
			this.maxAllFloorVal = '';
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当产证唯一放生改变的时候
		 * @param {Array} item 当前产证唯一的值
		 */
		tcertificateCheckChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'certificate');
			// 搜索条件赋值
			this.filterSearchData.filter.m = this.certificateRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当装修放生改变的时候
		 * @param {Array} item 当前装修的值
		 */
		decorationCheckChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'decoration');
			// 搜索条件赋值
			this.filterSearchData.filter.k = this.decorationRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当房屋用途改变的时候
		 * @param {Array} item 当前房屋用途的值
		 */
		useCheckChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'use');
			// 搜索条件赋值
			this.filterSearchData.filter.g = this.useRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当有无电梯改变的时候
		 * @param {Array} item 当前有无电梯的值
		 */
		elevatorChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'elevator');
			// 搜索条件赋值
			this.filterSearchData.filter.r = this.elevatorRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		/**
		 * 当房态改变的时候
		 * @param {Array} item 当前房态的值
		 */
		roomTypeChangeVal(e, item) {
			// 已选中项赋值
			this.radioCheckVal(item, 'roomType');
			// 搜索条件赋值
			this.filterSearchData.filter.p = this.roomTypeRadioVal;
			// 调用搜索方法
			this.getTableDataList();
		},
		// 展开所有搜索条件
		unfoldAll() {
			this.isAllFilter = !this.isAllFilter;			
		}
	}
}
</script>

<style lang="less" scoped>
.house-box {
	padding: 10px 104px;
	box-sizing: border-box;
	.bread-nav {
		display: flex;
		align-items:center;
		.iconicon_zhoubianjiaotongx, a {
			font-size: 14px !important;
			color: #bcbcbc;
			font-weight: 400;
		}
		/deep/ .el-breadcrumb__inner {
			color: #bcbcbc;
		}
		/deep/ .el-breadcrumb__separator {
			margin: 0;
		}
	}
	.filter-box {
		padding: 24px 26px 24px 24px;
		box-sizing: border-box;
		background: #fff;
		margin-top: 10px;
		border-radius: 8px;
		/deep/ .el-form-item__label {
			font-size: 14px;
			font-family: PingFangSC-Medium,PingFang SC;
			font-weight: 500;
			color: #424242;
		}
		/deep/ .el-form-item {
			margin-right: 40px;
			margin-bottom: 15px;
		}
		/deep/ .el-input--suffix .el-input__inner {
			border-color: #f1f4fb;
			background: #fbfcfe;
		}
	}
	/deep/ input::-webkit-input-placeholder {
		color: #797979;
	}
	/deep/ input::-moz-input-placeholder {
		color: #797979;
	}
	/deep/ input::-ms-input-placeholder {
		color: #797979;
	}
	.check-box {
		li {
			display: flex;
			margin-bottom: 10px;
			.jl-th {
				display: flex;
				align-items: end;
				label {
					width: 60px;
					font-size: 14px;
					color: #424242;
					font-family: PingFangSC-Medium,PingFang SC;
					font-weight: 500;
					margin-right: 12px;
				}
			}
			.jl-td {
				display: flex;
				// align-items: center;
				flex-wrap: wrap;
				margin-top: -4px;
				/deep/ .el-radio {
					margin-right: 16px;
					height: 30px;
					line-height: 30px;
				}
				/deep/ .el-radio__input {
					display: none;
				}
				/deep/ .el-radio__label {
					font-size: 14px;
					color: #424242;
					font-family:PingFangSC-Regular,PingFang SC;
					padding-left: 0px;
				}
				/deep/ .el-radio__input.is-checked+.el-radio__label {
					color: #00c0eb;
				}
				span:nth-child(1) {
					color:#00c0eb;
				}
				// 复选框
				/deep/ .el-checkbox {
					color: #424242;
					font-weight:400;
					margin-right: 16px;
					height: 30px;
					line-height: 30px;
				}
				/deep/ .el-checkbox:nth-child(1) {
					.el-checkbox__input {
						display: none;
					}
					.el-checkbox__label {
						padding-left: 0px;
					}
				}
				/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
					background-color: #00c0eb;
					border-color: #00c0eb;
				}
				/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
					color: #00c0ed;
				}
				.input-box {
					display: flex;
				}
				/deep/ .el-input {
					width: 80px;
				}
				/deep/ .el-input__inner {
					width: 80px;
					height: 28px;
					background: #FBFCFE;
					border-color: #F1F4FB;
				}
				/deep/ .el-button {
					color: #00c0eb;
					margin-left: 16px;
					margin-top: -5px;
				}
				.line {
					font-size: 14px;
					margin: 0 5px;
				}
				.unit {
					margin-left: 8px;
					font-size:14px;
					line-height: 32px;
				}
			}
			// 已选择筛选项
			.tag-list {
				position: relative;
				margin: 0px 24px 10px 0px;
				p {
					padding: 6px 16px;
					background:rgba(0,192,235, .1);
					color: #00c0eb;
					font-size: 14px;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
				}
				i {
					position: absolute;
					color: #fA5f35;
					font-size: 16px;
					top: -5px;
					right: -4px;
					cursor: pointer;
				}
			}
			.arr-box {
				display: flex;
			}
			/deep/ .btn-clear {
				color: #fA5f35 !important;
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
	/deep/ .el-divider {
		border: 0.5px dotted #e4e4e9;
		height: 0px;
		background-color: #fff;
	}
	/deep/ .el-divider__text {
		font-weight: 400;
	}
	/deep/ .el-divider__text.is-center {
		color: #797979 !important;
		cursor: pointer;
	}
	.table-box {
		margin-top: 16px;
	}
}
</style>