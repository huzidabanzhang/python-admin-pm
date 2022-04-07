import { getCurrentInstance } from 'vue'

export default function useCurrentInstance () {
    const { appContext, proxy } = getCurrentInstance()
    const _this = appContext.config.globalProperties
    return {
        _this,
        proxy
    }
}