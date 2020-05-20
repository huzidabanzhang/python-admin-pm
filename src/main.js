// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import Chubby from '@/plugin/chubby'
// store
import store from '@/store/index'
// socket
import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

// [ 可选组件 ]D2-Crud
import D2Crud from '@d2-projects/d2-crud'
import VCharts from 'v-charts'

// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'

import setting from '@/setting'
import util from '@/libs/util'

// 核心插件
Vue.use(Chubby)

// 可选插件组件
Vue.use(D2Crud)
Vue.use(VCharts)

// 按钮权限判断指令
Vue.directive('premissions', function (el, binding, node) {
  let params = binding.value, data = store.getters['chubby/user/interfaces']
  if (data) {
    let item = data.filter((i) => {
      return i.mark == params.mark
    })
    if (item.length == 0) {
      // if (!params.not_hidden) el.style.display = 'none'
      // else node.context.mark_btn[params.type] = true
      node.context.mark_btn[params.type] = true
    } else {
      if (params.not_disabled == undefined || !params.not_disabled)
        node.context.mark_btn[params.type] = Boolean(item[0].is_disabled)
    }
  } else node.context.mark_btn[params.type] = true
})

// socket插件
Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: io(store.state.chubby.api.base),
  reconnectionDelayMax: 30000,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  sockets: {
    connect (data) {
      console.log(data)
      this.$socket.emit('my_response', '111')
    },
    reconnect () {
      console.log('重新连接')
    },
    disconnect () {
      console.log('断开连接')
    },
    my_response (data) {
      console.log(data)
    }
  },
  destroyed () {
    this.$socket.emit('disconnect')
  },
  async created () {
    // 加载接口配置
    await this.$store.dispatch('chubby/api/load')
    // 处理路由 得到每一级的路由设置
    this.$store.commit('chubby/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('chubby/menu/headerSet', menuHeader)
    // 初始化菜单搜索功能
    this.$store.commit('chubby/search/init', menuHeader)

    util.isInitialized()
  },
  mounted () {
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('chubby/account/load')
    // 获取并记录用户 UA
    this.$store.commit('chubby/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('chubby/fullscreen/listen')
    // 控制整体尺寸大小
    this.$ELEMENT.size = setting.size.type
  }
}).$mount('#app')
