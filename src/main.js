// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import Chubby from '@/plugin/chubby'
// store
import store from '@/store/index'

// [ 可选组件 ]D2-Crud
import D2Crud from '@d2-projects/d2-crud'
import VCharts from 'v-charts'
import markdown from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

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
Vue.use(markdown)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  async created () {
    // 加载接口配置
    await this.$store.dispatch('chubby/api/load')
    // 处理路由 得到每一级的路由设置
    this.$store.commit('chubby/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('chubby/menu/headerSet', menuHeader)
    // 初始化菜单搜索功能
    this.$store.commit('chubby/search/init', menuHeader)

    await util.isInitialized()
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
