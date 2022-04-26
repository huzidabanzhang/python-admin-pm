import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

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
                                atRule.remove()
                            }
                        }
                    }
                }
            ]
        }
    },
    server: {
        port: 5001
    },
    build: {
        target: 'modules',
        outDir: 'dist', //指定输出路径
        assetsDir: 'assets', // 指定生成静态资源的存放路径
        minify: 'terser', // 混淆器，terser构建后文件体积更小
        terserOptions: {
            compress: {
                //生产环境时移除console
                drop_console: true,
                drop_debugger: true
            }
        },
        // 取消计算文件大小，加快打包速度
        reportCompressedSize: false,
        sourcemap: true,
        rollupOptions: {
            output: {
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: '[ext]/[name]-[hash].[ext]'
            }
        }
    },
    plugins: [
        vue(),
        mdPlugin.plugin({
            mode: ['html']
        }),
        viteCompression({
            algorithm: 'gzip',
            threshold: 10240
        })
    ]
})