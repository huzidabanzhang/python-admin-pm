import store from '@/store/index'

export default {
  install (Vue, options) {
    // 按钮权限判断指令
    Vue.directive('auth', function (el, binding, node) {
      let user = store.getters['chubby/user/user'],
        mark = binding.arg,
        role = store.getters['chubby/user/interfaces'],
        t = mark.split('_')[0]

      if (!user) return true

      if (user.is_admin == true) return true

      if (role) {
        let item = role.filter((i) => {
          return i.mark == mark
        })

        node.context.auth[t] = item.length == 0 ? true : Boolean(item[0].disable)
      } else node.context.auth[t] = true
    })

    // 注册权限判断事件
    Vue.prototype.$isDisabled = (mark) => {
      let user = store.getters['chubby/user/user'],
        role = store.getters['chubby/user/interfaces']

      if (!user) return true

      if (user.is_admin) return false

      if (role) {
        let item = role.filter((i) => {
          return i.mark == mark
        })

        return item.length == 0 ? true : Boolean(item[0].disable)
      } else return true
    }
  }
}
