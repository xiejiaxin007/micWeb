// /* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// webpack管理iconfont,支持热更新
const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs')
const dir = 'src/assets/fonts/iconfontNew'

// let dataUrlDev = 'http://testbackendapi.comjia.com'
// let dataUrlDev = 'http://test.kfs.backend.comjia.com'
// let dataUrlDev = 'http://testbackendapi6.comjia.com'
let dataUrlDev = 'http://test21backend.comjia.com'

// 获取当前分支名为版本号
const childProcess = require('child_process');
const RELEASE = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '');
// 判断jl npm包是否更新
let npm = 'jl_ui jl-report';
childProcess.execSync(`npm ls ${npm}`);
// 赋值全局变量
process.env.VUE_APP_RELEASE = RELEASE;
// 是否是生产环境标志
const isProduction = process.env.NODE_ENV === "production";
const productionGzipExtensions = ["js", "css"];

// const isProduction = process.env.NODE_ENV === "production";
// const productionGzipExtensions = ["js", "css"];
console.log('当前环境为：', process.env.NODE_ENV, process.env.VUE_APP_REPORT_URL);
module.exports = {
    publicPath: process.env.NODE_ENV == 'production' ? '/dist/' : '/',
    productionSourceMap: false,
    lintOnSave: false,
    // lintOnSave: 'error',
    devServer: {
        port: 8080,
        open: false,
        host: '0.0.0.0',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '/backend-api': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/backend-api/api-user': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/backend-api/bk-api-tag-manage': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/send-data': {
                target: 'http://api6.comjia.com',
                changeOrigin: true
            },
            '/backend-api/bk-map': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/api': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/backend-api/paper-map': {
                target: dataUrlDev,
                changeOrigin: true
            }
        }
    },
    css: {
        extract: false
    },
    configureWebpack: config => {
        config.performance = {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        };
        config["externals"] = {
            'BMap': 'BMap'
        };
        // 给vendor分包
        config.optimization = {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 30000,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](element-ui|video|ali-oss)/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                            return `npm.${packageName.replace('@', '')}`
                        }
                    }, 
                    default: {
                        minChunks: 3,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        };
        if (isProduction) {
            //gzip压缩
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
                    // 只有大小大于该值的资源会被处理 10240
                    threshold: 10240,
                    // 只有压缩率小于这个值的资源才会被处理
                    minRatio: 0.8,
                    deleteOriginalAssets: false // 删除原文件
                })
            )
        }
        config.resolve.extensions = ['.js', '.vue', '.json'];
        config.plugins.push(...[
            // new webpack.optimize.LimitChunkCountPlugin({
            //         maxChunks: 50
            // }),
            // 限制chunk保持最小值为minChunkSize，合并小于 minChunkSize 大小的 chunk
            new webpack.optimize.MinChunkSizePlugin({
                minChunkSize: 20480
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
            // 配置iconfont
            new WebpackIconfontPluginNodejs({
                fontName: 'icon',
                cssPrefix: 'icon',
                svgs: path.join(dir, 'svgs/*.svg'),
                fontsOutput: path.join(dir, 'fonts/'),
                cssOutput: path.join(dir, 'fonts/font.css')
            })
        ]);
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', path.join(__dirname, './src'))

        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/fonts/iconSvg'))
            .end()

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/fonts/iconSvg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        // config
        //     .plugin('webpack-bundle-analyzer')
        //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
}
function resolve(url) {
    // 路径可能与你的项目不同
    return path.join(__dirname, url)
}