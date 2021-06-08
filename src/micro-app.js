/*
 * @author: xiejiaxin
 * @Date: 2021-06-06 16:16:41
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-06-06 17:07:16
 * @description: file content
 */
const microApps = [
    {
      name: 'building',
      entry: '//localhost:8888/',
      activeRule: '/building',
      container: '#sub-building-only', // 子应用挂载的div
      props: {
        routerBase: '/building' // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
      }
    },
    // {
    //   name: 'sub-react',
    //   entry: '//localhost:7788/',
    //   activeRule: '/sub-react',
    //   container: '#subapp-viewport', // 子应用挂载的div
    //   props: {
    //     routerBase: '/sub-react'
    //   }
    // }
  ]
  export default microApps