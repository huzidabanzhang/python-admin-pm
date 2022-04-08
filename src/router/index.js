import { createRouter, createWebHistory } from "vue-router"
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'
import util from '@/libs/util'

/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        redirect: { name: 'index' },
        component: () => import('@/layout/header-aside'),
        children: [
            // 首页
            {
                path: 'index',
                name: 'index',
                meta: {
                    auth: true,
                },
                component: () => import('@/views/system/index')
            },
            // 404页面
            {
                path: '404',
                name: 'page404',
                meta: {
                    title: '莫有页面~',
                    auth: false,
                },
                component: () => import('@/views/system/error/404')
            },
            {
                path: '403',
                name: 'page403',
                meta: {
                    title: '无权限~',
                    auth: false,
                },
                component: () => import('@/views/system/error/403')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: () => import('@/views/system/function/refresh')
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: () => import('@/views/system/function/redirect')
            }
        ]
    }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/system/login')
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 导出路由 在 main.js 里使用
const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...frameIn,
        ...frameOut
    ]
})

let RouteFresh = true

// 处理动态理由 刷新后失效的问题 通过判断RouteFresh来确定是否加载
function ResetRoute (to, next) {
    if (RouteFresh) {
        store.dispatch('db/get', {
            dbName: 'sys',
            path: 'user.info',
            defaultValue: {},
            user: true
        }, { root: true }).then(res => {
            if (Object.keys(res).length == 0) {
                next({ name: 'login' })
            } else {
                util.initMenu(res.menus || {
                    menu: [],
                    route: []
                }, false)

                if (to.path != '/login') RouteFresh = false

                if (to.matched.length == 0) {
                    next({ ...to, replace: true })
                } else next()
            }
        }).catch(err => {
            console.log(err)
        })
    } else next()
}

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    // 进度条
    NProgress.start()
    // 确认已经加载多标签页数据
    await store.dispatch('page/isLoaded')
    // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some((r) => r.meta.auth)) {
        // 这里暂时将cookie里是否存有token作为验证是否登录的条件
        // 请根据自身业务需要修改
        const token = util.cookies.get('token')
        const user_info = store.getters['user/info']
        if (token && token != 'undefined' && Object.keys(user_info).length > 0) {
            if (to.path == '/index') RouteFresh = true

            if (to.matched.some((r) => r.meta.disable == true)) {
                next({ name: 'page403' })
            } else await ResetRoute(to, next)
        } else {
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else {
        if (to.matched.length == 0) await ResetRoute(to, next)
        // 不需要身份校验 直接通过
        else next()
    }
})

router.afterEach((to) => {
    // 进度条
    NProgress.done()
    // 多页控制 打开新的页面
    store.dispatch('page/open', to)
    // 更改标题
    util.title(to.meta.title)
})

router.$addRoute = (params) => {
    const routers = router.getRoutes()
    params.forEach((i) => {
        if (
            routers.findIndex((x) => {
                return x.path === i.path
            }) === -1
        )
            router.addRoute(i)
    })
}

export default router
