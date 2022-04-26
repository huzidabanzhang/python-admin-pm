import ElementPlus from 'element-plus'
import '@/assets/style/theme/register.scss'
import 'flex.css'
import installComponent from '@/components'

// 功能插件
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import premission from '@/plugin/premission'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $env: any,
        $baseUrl: String,
        $version: String,
        $buildTime: any,
        $auth: Function,
        loadOption: Function
    }
}

export default {
    async install(app) {
        // 注册全局组件
        installComponent(app)

        app.config.productionTip = false
        // 当前环境
        app.config.globalProperties.$env = import.meta.env.MODE
        // 当前的 baseUrl
        app.config.globalProperties.$baseUrl = import.meta.env.BASE_URL
        // 当前版本
        app.config.globalProperties.$version = import.meta.env.VITE_APP_VERSION
        // 构建时间
        app.config.globalProperties.$buildTime = import.meta.env.VITE_APP_BUILD_TIME
        // 加载框
        app.config.globalProperties.loadOption = (
            title,
            dom = document.body,
            background = true
        ) => {
            return {
                lock: true,
                text: title,
                target: dom,
                background: background ? 'rgba(0, 0, 0, 0.7)' : ''
            }
        }
        // 全局错误捕捉
        app.config.errorHandler = (err, vm, info) => {
            console.log('[全局异常]', err, vm, info)
        }
        // Element
        app.use(ElementPlus)
        // 插件
        app.use(pluginError)
        app.use(pluginLog)
        app.use(pluginOpen)
        app.use(premission)
    },
}
