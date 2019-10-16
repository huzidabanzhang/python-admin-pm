import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'
import layoutHeaderAside from '@/layout/header-aside'
import { cloneDeep } from 'lodash'
import { frameInRoutes } from '@/router/routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes,
    mode: 'history'
})

let RouteFresh = true

let getMenuInfo = (params) => {
    return {
        title: params.title,
        icon: params.icon,
        id: params.menu_id,
        path: params.path
    }
}

let getRouteInfo = (data) => {
    return {
        name: data.name,
        path: data.path,
        component: () => import('@' + data.componentPath),
        meta: {
            title: data.title,
            auth: data.auth
        },
        id: data.route_id
    }
}

// 处理动态理由 刷新后失效的问题 通过判断RouteFresh来确定是否加载
function ResetRoute(to, next) {
    if (RouteFresh) {
        store.dispatch('d2admin/db/get', {
            dbName: 'sys',
            path: 'user.info',
            defaultValue: {},
            user: true
        }, { root: true }).then(res => {
            const r = res.routes || []
            const m = res.menus || []
            
            let route_list = cloneDeep(r), route = [
                {
                    path: '/',
                    component: layoutHeaderAside
                },
                { path: '*', redirect: '/404', hidden: true }
            ]

            while (route_list.length > 0) {
                for (let i = 0; i < route_list.length; i++) {
                    if (route_list[i].parentId == 0) {
                        route.push(getRouteInfo(route_list[i]))
                        route_list.splice(i, 1)
                    } else {
                        let index = route.findIndex(item => item.id === route_list[i].parentId)
                        if (index == -1) continue
                        if (!route[index]['children']) route[index]['children'] = []
                        route[index]['children'].push(getRouteInfo(route_list[i]))
                        route_list.splice(i, 1)
                    }
                }
            }

            router.$addRoutes(route)
            // 更新标签页池
            store.commit('d2admin/page/init', [
                ...frameInRoutes,
                ...route
            ])

            let menu_list = cloneDeep(m), menu = []
            while (menu_list.length > 0) {
                for (let i = 0; i < menu_list.length; i++) {
                    if (menu_list[i].parentId == 0) {
                        menu.push(getMenuInfo(menu_list[i]))
                        menu_list.splice(i, 1)
                    } else {
                        let index = menu.findIndex(item => item.id === menu_list[i].parentId)
                        if (index == -1) continue
                        if (!menu[index]['children']) menu[index]['children'] = []
                        menu[index]['children'].push(getMenuInfo(menu_list[i]))
                        menu_list.splice(i, 1)
                    }
                }
            }

            store.commit('d2admin/menu/asideSet', menu)

            RouteFresh = false
            next({ ...to, replace: true })
        }).catch(err => {
            console.log(err)
        })
        return true
    }
}

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    // 进度条
    NProgress.start()
    // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
    await store.dispatch('d2admin/page/isLoaded')
    // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
    await store.dispatch('d2admin/size/isLoaded')
    // 关闭搜索面板
    store.commit('d2admin/search/set', false)
    // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some(r => r.meta.auth)) {
        // 这里暂时将cookie里是否存有token作为验证是否登录的条件
        // 请根据自身业务需要修改
        const token = util.cookies.get('token')
        const user_info = store.state.d2admin.user.info
        if (token && token !== 'undefined' && JSON.stringify(user_info) != '{}') {
            ResetRoute(to, next)
            next()
        } else {
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
            // https://github.com/d2-projects/d2-admin/issues/138
            NProgress.done()
        }
    } else {
        // 不需要身份校验 直接通过
        ResetRoute(to, next)
        next()
    }
})

router.afterEach(to => {
    // 进度条
    NProgress.done()
    // 多页控制 打开新的页面
    store.dispatch('d2admin/page/open', to)
    // 更改标题
    util.title(to.meta.title)
})

// 重置当前router的match = 初始router.match 防止回退之类的重置路由报重名警报 https://github.com/vuejs/vue-router/issues/1727
router.$addRoutes = (params) => {
    router.matcher = new VueRouter({ mode: 'history', routes }).matcher
    router.addRoutes(params)
}

export default router
