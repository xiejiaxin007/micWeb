# webapp_backend

> https://backend.julive.com 后台支撑系统

## Build Setup

``` bash
# 安装依赖包
npm install

# 开发环境
npm run dev

# 测试环境、沙盒以及线上都统一采用相同的打包方式（沙盒和线上采用https协议）
npm run build
# 部署测试环境（目前建议使用Jenkins进行部署）
###hosts配置
123.57.229.36 test.jenkins.julive.com
```
### 项目开发
1. 注意开发中可以直接使用私服中已经有的npm包，常用的是__文件下载__、__数字输入框__、__svg转换组件__
    + 使用组件之前先配置nrm：[配置nrm](http://cwiki.comjia.com/pages/viewpage.action?pageId=502858790)
    + [npm组件地址](http://npm.julive.com/)
    + 如果想要新增组件，遵循[组件规范](http://cwiki.comjia.com/pages/viewpage.action?pageId=537986159)
    + hosts：47.95.208.236 npm.julive.com
2. [开发规范](http://cwiki.comjia.com/pages/viewpage.action?pageId=65339505)
3. vuex分模块存储
4. 组件库：element-ui
5. api跟页面单独存放

### 项目本地存储记录
只要使用了本地存储，请将你使用的相关信息放到wiki中存档，防止其他小伙伴覆盖你的数据：[本地存储记录](http://cwiki.comjia.com/pages/viewpage.action?pageId=679806636)

### 目录结构

``` bash
project
|-- dist     # 编译输出（发布模式）
|   |-- fonts      # 存放iconfont
|   |-- img      # 大图片
|   |-- js      # webpack打包出来的js模块（包括css也打包进去了）
|   |-- vendor   # dll插件打包后的输出
|   |-- index.html # 打包后的html入口文件
|
|-- node_modules # 依赖模块
|
|-- public    # 项目的静态资源
|   |-- vendor # 打包后的dll文件
|   |-- index.html # 打包后的html入口文件
|
|-- src      # 源码目录 (各业务模块相互独立)
|   |-- api  # api分层（存放api请求），后续都以对象方式导出
|       |-- bankRepayment   # 银企智联模块api
|       |-- buildingDictionary   # 楼盘字典模块api
|       |-- citySettingApi   # 城市模块api
|       |-- rateSettingApi  # 城市费率模块api
|       |-- commonApi.js  # 公共api
|       |-- houseManage #楼盘管理api（待分层）
|       |-- ...  # 未分层的api
|   |-- assets  # 封装的公共文件、静态资源
|       |-- css  # 公共css
|       |-- fonts  # 字体文件夹（icon）
|           |-- iconfont # 阿里云下载的iconfont
|           |-- iconfontNew # 自动添加的iconfont
|           |-- iconSvg # svg文件 （目前正在使用的）
|       |-- images   # 项目所用的公共图片
|       |-- js  # js文件夹
|           |-- http  # http相关js文件
|           |-- upload  # 上传相关js文件
|           |-- utils  # 公用方法文件
|   |-- components  # 存放公共组件，每个模块的自定义组件可放每个模块下的components文件夹中（二次确认弹窗、通用审核弹窗、音频播放组件、全局导航组件、全局系统弹窗、提示弹窗、裁剪弹窗、文件上传组件（文件上传建议使用<jl-file-upload></jl-file-upload>，是我们私服里面的npm包）、图片预览组件、全局页面底部和头部、驳回弹窗、远程实时搜索下拉）
|   |-- config  # 存放配置文件
|   |-- pages  # 各模块组件
|       |-- channelSide  # 渠道侧
|           |-- bankRepayment   # 银企智联模块
|               |-- api  #当前模块下的api   
|               |-- images  #当前模块下的图片   
|               |-- store  #当前模块下的vuex
|               |-- components   # 当下模块自定义的组件
|               |-- config   # 当下模块下的配置数据
|               |-- ... # 路由组件
|               |-- route.js   # 当前模块下的vue组件路由文件
|       |-- consultor  # 咨询师侧
|       |-- developer  # 开发商模块
|       |-- developerHouse  # 二手房模块
|       |-- marketingCenter  # 营销中台模块
|       |-- materials  # 材料类文件
|       |-- mobile  # 移动端文件
|       |-- newPlatForm  # 新平台模块
|       |-- oldPassengerOperation  # 老客运营模块
|       |-- propertySide  # 楼盘侧
|       |-- qualityControl  # 质检模块
|       |-- rateSetting  # 城市费率模块
|       |-- index.js  # 对外暴露整个模块的js
|       |-- Login.vue  # 本地开发的登录口
|       |-- ...   # 项目固定组件（无权限等）
|   |-- router  # 路由文件
|   |-- store   # vuex
|
|-- static   # 静态文件，不参与编译，直接拷贝到 dist 目录(vuecli2升级遗留下来的，以后静态文件都往public里面加)
|   |-- lib # 第三方用的工具包
|       |-- uploads # 第三方上传插件用到的js文件
|
|-- webpack.config.js  #项目配置文件
|-- webpack.dll.conf.js  #dll配置文件
|-- ...
|-- README.md
```
