import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// 楼盘侧stroe
import buildingDictionary from '../pages/propertySide/buildingDictionary/store/index'
// 引入找房工具vuex
import house from '../pages/consultor/house/store/index'
// 直播间vuex
import liveRoom from '../pages/consultor/liveRoom/store/index';

Vue.use(Vuex)

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
	modules: {
		house,
		liveRoom,
		buildingDictionary
	}
});
