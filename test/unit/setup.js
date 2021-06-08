import Vue from 'vue'
global.Vue = Vue;
Vue.config.productionTip = false
import ElementUI from "element-ui";
import jl_ui from 'jl_ui';
Vue.use(jl_ui);
Vue.use(ElementUI);