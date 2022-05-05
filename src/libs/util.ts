import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import axios from 'axios'

import router from '@/router/index'
import store from '@/store/index'
import layoutHeaderAside from '@/layout/header-aside'
import { cloneDeep } from 'lodash'
import { frameInRoutes } from '@/menu'
import { ElNotification, ElMessageBox, ElLoading } from 'element-plus'
import { checkDb } from '@api/sys.user'
import { CreateDrop } from '@api/sys.base'

const util: any = {
    cookies,
    db,
    log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
    const processTitle = import.meta.env.VITE_APP_TITLE || 'admin'
    window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

util.axiosAll = function (requestList = [], success, error) {
    if (requestList.length === 0) return false

    axios
        .all(requestList)
        .then(
            axios.spread((...res) => {
                return success(res)
            })
        )
        .catch((err) => {
            return error(err)
        })
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'admin-link-temp')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('admin-link-temp'))
}

function componentToImport(ary) {
    const modules = import.meta.glob('../layout/pages/**/**.vue')
    ary.forEach((i) => {
        if (i.componentPath !== 'layout/header-aside') {
            i.component = modules[/* @vite-ignore */ `../layout/pages/${i.componentPath}.vue`]
        } else {
            i.component = layoutHeaderAside
        }

        if (i.children) componentToImport(i.children)
    })
}

function addRoute(params) {
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

/**
 * @description 动态加载路由
 * @param {Object} r 路由
 */
util.initRoute = function (r) {
    let data = cloneDeep(r),
        route = [
            {
                path: '/',
                component: layoutHeaderAside,
            },
            {
                path: "/:pathMatch(.*)*",
                redirect: '/404',
                hidden: true
            }
        ]

    componentToImport(data)

    let routes = route.concat(data)
    addRoute(routes)
    // 更新标签页池
    store.commit('page/init', [...frameInRoutes, ...routes])
}

/**
 * @description 动态加载菜单
 * @param {Object} m 菜单
 */
util.initMenu = function (m, isAll = false) {
    let params = isAll ? util.dealData(cloneDeep(m)) : m
    store.commit('menu/asideSet', params.menu)

    if (isAll) {
        ElNotification({
            title: '提示',
            message: '动态加载菜单成功',
            type: 'success',
            offset: 100
        })
        let info = store.getters['user/info']
        store.dispatch(
            'user/set',
            {
                user: info.user,
                menus: params,
                interfaces: info.interfaces
            },
            { root: true }
        )
    }
    util.initRoute(params.route)
}

/**
 * @description 更新接口列表
 * @param {Object} m 菜单
 */
util.initInterface = function (f) {
    let info = store.getters['user/info']
    store.dispatch(
        'user/set',
        {
            user: info.user,
            menus: info.menus,
            interfaces: f,
        },
        { root: true }
    )
}

/**
 * @description 获取菜单树
 */
util.getMenuTree = function (isGet, params) {
    if (isGet) {
        return cloneDeep(store.getters['user/menus'].menu)
    } else {
        let data = []
        while (params.length > 0) {
            for (let i = 0; i < params.length; i++) {
                if (params[i].menu_id === undefined) {
                    params.splice(i, 1)
                    i--
                    continue
                }

                if (params[i].pid === 0) {
                    data.push(params[i])
                    params.splice(i, 1)
                    i--
                } else {
                    let index = data.findIndex((item) => item.menu_id === params[i].pid)
                    if (index === -1) continue
                    if (!data[index]['children']) data[index]['children'] = []
                    data[index]['children'].push(params[i])
                    params.splice(i, 1)
                    i--
                }
            }
        }
        return data
    }
}

/**
 * @description 更新个人信息
 * @param {Object} u 数据
 */
util.updateUserInfo = function (u) {
    let info = cloneDeep(store.getters['user/info'])

    store.dispatch('user/set', {}, { root: true })

    util.cookies.set('token', u.token)
    util.cookies.set('password', u.user.password)

    store.dispatch(
        'user/set',
        {
            user: u.user,
            menus: info.menus,
            interfaces: info.interfaces,
        },
        { root: true }
    )
}

let getRouteInfo = (params) => {
    return {
        id: params.menu_id,
        name: params.name,
        path: params.path,
        meta: {
            title: params.title,
            cache: params.cache,
            auth: true,
            disable: params.disable,
        },
        componentPath: params.componentPath,
    }
}

let getMenuInfo = (params) => {
    return {
        title: params.title,
        icon: params.icon,
        id: params.menu_id,
        path: params.path,
        disable: params.disable,
    }
}

/**
 * @description 菜单路由初始化处理
 * @param {Object} params 数据
 */
util.dealData = function (params) {
    let data = {
        route: [],
        menu: [],
    }
    while (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            if (params[i].menu_id === undefined) {
                params.splice(i, 1)
                i--
                continue
            }

            if (params[i].pid === '0') {
                data.menu.push(getMenuInfo(params[i]))
                data.route.push(getRouteInfo(params[i]))
                params.splice(i, 1)
                i--
            } else {
                let index = data.menu.findIndex((item) => item.id === params[i].pid)
                if (index === -1) continue
                if (!data.menu[index]['children']) data.menu[index]['children'] = []
                if (!data.route[index]['children']) data.route[index]['children'] = []
                data.menu[index]['children'].push(getMenuInfo(params[i]))
                data.route[index]['children'].push(getRouteInfo(params[i]))
                params.splice(i, 1)
                i--
            }
        }
    }
    return data
}

/**
 * @description 检测是否初始化过数据库
 */
util.isInitialized = function () {
    if (!store.getters['user/isInit']) {
        checkDb()
            .then(res => {
                store.commit('user/setInit', res)

                if (!res) ElMessageBox.alert('系统暂不能正常使用, 是否初始化数据库', '重要提示', {
                    confirmButtonText: '确定',
                    showClose: false,
                    callback: action => {
                        sys_to_init()
                    }
                })
            })
    }
}

function sys_to_init() {
    let loadingInstance = ElLoading.service({
        lock: true,
        text: '系统初始化中，请耐心等待.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })

    CreateDrop()
        .then(res => {
            loadingInstance.close()
            store.commit('user/setInit', true)
            ElNotification({
                type: 'success',
                title: '初始化数据库成功',
                offset: 100,
                duration: 5000,
                dangerouslyUseHTMLString: true,
                message: '<div>管理员: ' + res.username + '<div><div>初始密码：' + res.password + '<div>',
                showClose: false
            })
        })
        .catch(() => {
            loadingInstance.close()
            ElMessageBox.alert('初始化失败，请检查数据库是否开启', '错误提示', {
                confirmButtonText: '确定',
                showClose: false
            })
        })
}

export default util
