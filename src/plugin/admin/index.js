import ElementPlus from 'element-plus'
import '@/assets/style/theme/register.scss'
import 'flex.css'
import installComponent from '@/components'

// 功能插件
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import premission from '@/plugin/premission'

export default {
    async install (Vue, options) {
        // 注册全局组件
        installComponent(Vue)

        Vue.config.productionTip = false
        // 当前环境
        Vue.config.globalProperties.$env = import.meta.env.MODE
        // 当前的 baseUrl
        Vue.config.globalProperties.$baseUrl = import.meta.env.BASE_URL
        // 当前版本
        Vue.config.globalProperties.$version = import.meta.env.VITE_APP_VERSION
        // 构建时间
        Vue.config.globalProperties.$buildTime = import.meta.env.VITE_APP_BUILD_TIME
        // 加载框
        Vue.config.globalProperties.loadOption = (
            title,
            dom = document.body,
            spinner = true,
            background = true
        ) => {
            return {
                lock: true,
                text: title,
                target: dom,
                spinner: spinner ? 'el-icon-loading' : '',
                background: background ? 'rgba(0, 0, 0, 0.7)' : '',
            }
        }
        // Element
        Vue.use(ElementPlus)
        // 插件
        Vue.use(pluginError)
        Vue.use(pluginLog)
        Vue.use(pluginOpen)
        Vue.use(premission)
    },
}
