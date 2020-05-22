import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
// socket
// import VueSocketIO from 'vue-socket.io'
// import io from 'socket.io-client'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
  mode: 'history'
})

let RouteFresh = true

// 处理动态理由 刷新后失效的问题 通过判断RouteFresh来确定是否加载
function ResetRoute (to, next) {
  if (RouteFresh) {
    store.dispatch('chubby/db/get', {
      dbName: 'sys',
      path: 'user.info',
      defaultValue: {},
      user: true
    }, { root: true }).then(res => {
      if (Object.keys(res).length == 0) {
        next({ name: 'login' })
      } else {
        const m = res.menus || {
          'menu': [],
          'route': []
        }
        util.initMenu(m, false)

        if (to.path != '/login') RouteFresh = false
        if (process.env.NODE_ENV !== 'development') next()
        else next({ ...to, replace: true })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  next()
}

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // socket 暂时用不到注释了
  // if ((to.name == 'index' && from.name == 'login') || (from.name == null && to.name != 'login')) {
  //   Vue.use(new VueSocketIO({
  //     debug: true,
  //     // 服务器端地址
  //     connection: io(store.state.chubby.api.base, {
  //       reconnectionDelayMax: 10000
  //     }),
  //     vuex: {
  //       store,
  //       actionPrefix: 'SOCKET_',
  //       mutationPrefix: 'SOCKET_'
  //     }
  //   }))
  // }
  // 进度条
  NProgress.start()
  // 确认已经加载多标签页数据 
  await store.dispatch('chubby/page/isLoaded')
  // 关闭搜索面板
  store.commit('chubby/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    const user_info = store.getters['chubby/user/info']
    if (token && token != 'undefined' && Object.keys(user_info).length > 0) {
      if (to.path == '/index') RouteFresh = true
      if (to.matched.some(r => r.meta.is_disabled == true)) {
        next({ name: 'page403' })
      } else ResetRoute(to, next)
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    ResetRoute(to, next)
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('chubby/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

// 重置当前router的match = 初始router.match 防止回退之类的重置路由报重名警报 https://github.com/vuejs/vue-router/issues/1727
router.$addRoutes = (params) => {
  router.matcher = new VueRouter({ mode: 'history', routes }).matcher
  router.addRoutes(params)
}

export default router
