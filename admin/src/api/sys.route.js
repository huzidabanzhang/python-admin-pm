import request from '@/plugin/axios'

/**
 * 新建路由
 * @param {*} data 
 */
export function CreateRoute(data) {
    return request({
        url: '/v1/Route/CreateRoute',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 禁用路由
 * @param {*} data 
 */
export function LockRoute(data) {
    return request({
        url: '/v1/Route/LockRoute',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 修改路由信息
 * @param {*} data 
 */
export function ModifyRoute(data) {
    return request({
        url: '/v1/Route/ModifyRoute',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 获取路由列表
 * @param {*} data 
 */
export function QueryRouteByParam(data) {
    return request({
        url: '/v1/Route/QueryRouteByParam',
        method: 'post',
        data,
        isCheck: true
    })
}