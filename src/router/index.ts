import { createRouter, createWebHistory } from "vue-router"
import { frameRoutes } from '@/menu'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'
import util from '@/libs/util'

// 导出路由 在 main 里使用
const router = createRouter({
    history: createWebHistory(),
    routes: frameRoutes
})

let RouteFresh = true

// 处理动态理由 刷新后失效的问题 通过判断RouteFresh来确定是否加载
async function ResetRoute(to, next) {
    if (RouteFresh) {
        await store.dispatch('db/get', {
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
        const admin_id = util.cookies.get('uuid')
        if (token && admin_id) {
            if (to.path == '/index') RouteFresh = true

            if (to.matched.some((r) => r.meta.disable == true)) {
                next({ name: 'page403' })
            } else await ResetRoute(to, next)
        } else {
            store.dispatch('account/initUser', () => {
                next({
                    name: 'login',
                    query: {
                        redirect: to.fullPath
                    }
                })
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

export default router
