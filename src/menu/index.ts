import { RouteRecordRaw } from "vue-router"
/**
 * 在主框架内显示
 */
const frameIn: RouteRecordRaw[] = [
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
                    auth: true
                },
                component: () => import('@/views/system/index')
            },
            // 404页面
            {
                path: '404',
                name: 'page404',
                meta: {
                    title: '莫有页面~',
                    auth: false
                },
                component: () => import('@/views/system/error/404/index.vue')
            },
            {
                path: '403',
                name: 'page403',
                meta: {
                    title: '无权限~',
                    auth: false
                },
                component: () => import('@/views/system/error/403/index.vue')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                meta: {
                    hidden: true
                },
                component: () => import('@/views/system/function/refresh')
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                meta: {
                    hidden: true
                },
                component: () => import('@/views/system/function/redirect')
            }
        ]
    }
]

/**
 * 在主框架之外显示
 */
const frameOut: RouteRecordRaw[] = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/system/login')
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

export const frameRoutes = [
    ...frameIn,
    ...frameOut
]