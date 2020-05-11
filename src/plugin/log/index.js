import util from '@/libs/util'

export default {
  install (Vue) {
    // 快速打印 log
    Vue.prototype.$log = {
      ...util.log
    }
  }
}
