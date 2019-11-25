import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'

// 菜单路由 初始化需要
import router from '@/router/index'
import store from '@/store/index'
import layoutHeaderAside from '@/layout/header-aside'
import { cloneDeep } from 'lodash'
import { frameInRoutes } from '@/router/routes'

const util = {
    cookies,
    db,
    log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
    const processTitle = process.env.VUE_APP_TITLE || 'P_Admin'
    window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'd2admin-link-temp')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

let getRouteInfo = (data) => {
    let info = {
        name: data.name,
        path: data.path,
        meta: {
            title: data.title,
            cache: data.cache,
            auth: true,
            isLock: data.isLock
        },
        id: data.route_id
    }

    if (data.componentPath == 'layout/header-aside')
        info['component'] = layoutHeaderAside
    else info['component'] = () => import('@/pages/' + data.componentPath)

    return info
}

/**
 * @description 动态加载路由
 * @param {Object} r 路由
 */
util.initRoute = function (r, type, isAll = false) {
    let data = cloneDeep(r), route = [
        {
            path: '/',
            component: layoutHeaderAside
        },
        { path: '*', redirect: '/404', hidden: true }
    ]

    let routes = route.concat(util.dealData(data, 1, true))
    router.$addRoutes(routes)
    // 更新标签页池
    store.commit('d2admin/page/init', [
        ...frameInRoutes,
        ...routes
    ])

    if (isAll && type != 1) {
        store.dispatch('d2admin/db/get', {
            dbName: 'sys',
            path: 'user.info',
            defaultValue: {},
            user: true
        }, { root: true }).then(res => {
            store.dispatch('d2admin/user/set', {
                info: res.info,
                menus: res.menus,
                routes: r
            }, { root: true })
        })
    }
}

let getMenuInfo = (params) => {
    return {
        title: params.title,
        icon: params.icon,
        id: params.menu_id,
        path: params.path
    }
}

/**
 * @description 动态加载菜单
 * @param {Object} m 菜单
 */
util.initMenu = function (m, type, isAll = false) {
    let data = cloneDeep(m), menu = util.dealData(data, 1, true)
    store.commit('d2admin/menu/asideSet', menu)
    if (isAll && type != 1) {
        store.dispatch('d2admin/db/get', {
            dbName: 'sys',
            path: 'user.info',
            defaultValue: {},
            user: true
        }, { root: true }).then(res => {
            store.dispatch('d2admin/user/set', {
                info: res.info,
                menus: m,
                routes: res.routes
            }, { root: true })
        })
    }
}

/**
 * @description 菜单处理
 * @param {Object} params 数据
 */
util.dealData = function (params, type, isAll) {
    let data = []
    while (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            if (isAll && !params[i].isLock && type == 3) {
                params.splice(i, 1)
                i--
                continue
            }
            if (params[i].parentId == 0) {
                data.push(type == 1 ? (params[i].menu_id ? getMenuInfo(params[i]) : getRouteInfo(params[i])) : params[i])
                params.splice(i, 1)
                i--
            } else {
                let index = data.findIndex(item => (type == 1 ? item.id : (type == 2 ? item.route_id : item.menu_id)) === params[i].parentId)
                if (index == -1) continue
                if (!data[index]['children']) data[index]['children'] = []
                data[index]['children'].push(type == 1 ? (params[i].menu_id ? getMenuInfo(params[i]) : getRouteInfo(params[i])) : params[i])
                params.splice(i, 1)
                i--
            }
        }
    }
    return data
}

export default util
