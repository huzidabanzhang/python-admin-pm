import { getCurrentInstance, ComponentInternalInstance } from 'vue'

export default function useCurrentInstance() {
    const { appContext, proxy } = getCurrentInstance() as ComponentInternalInstance
    const _this = appContext.config.globalProperties
    return {
        _this,
        proxy
    }
}