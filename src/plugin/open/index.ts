import util from '@/libs/util'

export default {
    install(Vue, options) {
        Vue.config.globalProperties.$open = util.open
    },
}
