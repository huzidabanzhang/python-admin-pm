import util from '@/libs/util'

export default {
  install (Vue) {
    Vue.config.errorHandler = function (error, instance, info) {
      Vue.nextTick(() => {
        // 只在开发模式下打印 log
        if (process.env.NODE_ENV === 'development') {
          util.log.capsule('Admin', 'ErrorHandler', 'danger')
          util.log.danger('>>>>>> 错误信息 >>>>>>')
          console.log(info)
          util.log.danger('>>>>>> Vue 实例 >>>>>>')
          console.log(instance)
          util.log.danger('>>>>>> Error >>>>>>')
          console.log(error)
        }
      })
    }
  }
}
