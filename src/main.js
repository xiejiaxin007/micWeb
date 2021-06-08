/*
 * @author: hewei
 * @Date: 2021-04-14 09:42:00
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-06-08 06:56:36
 * @description: file content
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import {
    axios
} from './assets/js/http/axios'
import store from './store'
import upload from './assets/js/upload/upload.js' // 挂载到vue上面的公共方法
import { registerMicroApps, start } from 'qiankun';
import microApps from './micro-app';

// 引入第三方npm包组件
import './assets/js/utils/npmLib';
// 引入样式初始化文件
import './assets/css/reset.css'
import './assets/fonts/iconfont/iconfont.css'
import './assets/fonts/iconfontNew/fonts/font.css'
import './assets/css/common.css'
// 公共弹窗样式
import './assets/css/dialog.less'
// 引入svg文件
import './assets/fonts/iconSvg';
// 覆盖element样式
import './assets/css/override.less';

Vue.use(upload)
Vue.config.productionTip = false;
// 天眼监控配置
import { Performance } from 'jl-report';

Performance({
    domain: process.env.VUE_APP_REPORT_URL,
    add: {
        appId: process.env.VUE_APP_ID
    }
});

Vue.config.errorHandler = function (err, vm, info) {
    let {
        message,
        stack
    } = err;

    // Processing error
    let resourceUrl, col, line;
    let errs = stack.match(/\(.+?\)/)
    if (errs && errs.length) errs = errs[0]
    errs = errs.replace(/\w.+js/g, $1 => {
        resourceUrl = $1;
        return '';
    })
    errs = errs.split(':')
    if (errs && errs.length > 1) {
        line = parseInt(errs[1] || 0);
        col = parseInt(errs[2] || 0);
    }
    if (process.env.NODE_ENV === 'development') {
        console.error(err)
    }
    // Fixed parameters
    // Call the Performance.addError method
    Performance.addError({
        msg: message,
        col: col,
        line: line,
        resourceUrl: resourceUrl
    })
};


// 365预览的域名配置
let host = window.location.host;
if (host === 'backend.julive.com') {
    Vue.prototype.OSSView = '//vip.ow365.cn/?i=20811&ssl=1&furl=';
} else {
    Vue.prototype.OSSView = '//ow365.cn/?i=21495&ssl=1&furl=';
}
// 设置为全局的axios
Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})

registerMicroApps(microApps, {
    beforeLoad: app => {
      console.log('before load app.name====>>>>>', app.name)
    },
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterMount: [
      app => {
        console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
      }
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      },
    ],
});
start();
