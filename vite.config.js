import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { resolve } = require('path')
const mdPlugin = require('vite-plugin-markdown')
const publicPath = '/'
const version = new Date().getTime()
// 增加环境变量
process.env.VITE_APP_VERSION = require('./package.json').version
process.env.VITE_APP_BUILD_TIME = require('dayjs')().format('YYYY年M月D日 HH时mm分ss秒')

export default defineConfig({
    base: publicPath,
    publicDir: resolve(__dirname, 'public'),
    assetsInclude: resolve(__dirname, 'src/assets'),
    resolve: {
        // 别名
        alias: {
            '@': resolve(__dirname, 'src'),
            '@api': resolve(__dirname, 'src/api')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import '@/assets/style/public.scss';
                `
            }
        },
        postcss: {
            plugins: [
                // 移除打包element时的@charset警告
                {
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: (atRule) => {
                            if (atRule.name === 'charset') {
                                atRule.remove();
                            }
                        }
                    }
                }
            ],
        }
    },
    server: {
        port: 5001,
        publicPath, // 和 publicPath 保持一致
        https: false,
        hotOnly: false,
        // proxy: {
        //     '/API': {
        //         target: 'http://127.0.0.1:92', // 要跨域的域名
        //         changeOrigin: true, // 是否开启跨域
        //         rewrite: (path) => path.replace(/^\/API/, '')
        //     }
        // }
    },
    build: {
        target: 'modules',
        outDir: 'dist', //指定输出路径
        assetsDir: 'assets', // 指定生成静态资源的存放路径
        minify: 'terser' // 混淆器，terser构建后文件体积更小
    },
    define: {
        process: import.meta
    },
    plugins: [
        vue(),
        mdPlugin.plugin({
            mode: ['html']
        })
    ]
})