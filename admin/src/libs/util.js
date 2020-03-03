import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'

// 菜单路由 初始化需要
import router from '@/router/index'
import store from '@/store/index'
import layoutHeaderAside from '@/layout/header-aside'
import { cloneDeep } from 'lodash'
import { frameInRoutes } from '@/router/routes'
import { Notification } from 'element-ui'

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
            is_disabled: data.is_disabled
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

    let routes = route.concat(util.dealData(data, 1))
    router.$addRoutes(routes)
    // 更新标签页池
    store.commit('d2admin/page/init', [
        ...frameInRoutes,
        ...routes
    ])

    if (isAll && type != 1) {
        Notification({
            title: '提示',
            message: '动态加载路由成功',
            type: 'success',
            offset: 100
        })
        let info = store.getters['d2admin/user/info']
        store.dispatch('d2admin/user/set', {
            user: info.user,
            menus: info.menus,
            routes: r,
            interfaces: info.interfaces
        }, { root: true })
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
    let data = cloneDeep(m).filter(i => {
        return !i.is_disabled
    }), menus = util.dealData(data, 3)
    store.commit('d2admin/menu/asideSet', menus)
    if (isAll && type != 1) {
        Notification({
            title: '提示',
            message: '动态加载菜单成功',
            type: 'success',
            offset: 100
        })
        let info = store.getters['d2admin/user/info']
        store.dispatch('d2admin/user/set', {
            user: info.user,
            menus: m,
            routes: info.routes,
            interfaces: info.interfaces
        }, { root: true })
    }
}

/**
 * @description 更新接口列表
 * @param {Object} m 菜单
 */
util.initInterface = function (f) {
    let info = store.getters['d2admin/user/info']
    store.dispatch('d2admin/user/set', {
        user: info.user,
        menus: info.menus,
        routes: info.routes,
        interfaces: f
    }, { root: true })
}

/**
 * @description 获取菜单树
 */
util.getMenuTree = function () {
    let menus = cloneDeep(store.getters['d2admin/user/menus'])
    return util.dealData(menus, 1)
}


/**
 * @description 更新个人信息
 * @param {Object} u 数据
 */
util.updateUserInfo = function (u) {
    let info = cloneDeep(store.getters['d2admin/user/info'])
    
    store.dispatch('d2admin/user/set', {}, { root: true })

    util.cookies.set('token', u.token)
    util.cookies.set('password', u.user.password)

    store.dispatch('d2admin/user/set', {
        user: u.user,
        menus: info.menus,
        routes: info.routes,
        interfaces: info.interfaces
    }, { root: true })
}

/**
 * @description 菜单处理
 * @param {Object} params 数据
 */
util.dealData = function (params, type) {
    let data = []
    while (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            if (params[i].pid == 0) {
                data.push(type == 1 ? (params[i].menu_id ? getMenuInfo(params[i]) : getRouteInfo(params[i])) : params[i])
                params.splice(i, 1)
                i--
            } else {
                let index = data.findIndex(item => (type == 1 ? item.id : (type == 2 ? item.route_id : item.menu_id)) === params[i].pid)
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
