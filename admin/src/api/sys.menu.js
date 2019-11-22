import request from '@/plugin/axios'

/**
 * 新建菜单
 * @param {*} data 
 */
export function CreateMenu(data) {
    return request({
        url: '/v1/Menu/CreateMenu',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 禁用菜单
 * @param {*} data 
 */
export function LockMenu(data) {
    return request({
        url: '/v1/Menu/LockMenu',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 修改菜单信息
 * @param {*} data 
 */
export function ModifyMenu(data) {
    return request({
        url: '/v1/Menu/ModifyMenu',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 获取菜单列表
 * @param {*} data 
 */
export function QueryMenuByParam(data) {
    return request({
        url: '/v1/Menu/QueryMenuByParam',
        method: 'post',
        data,
        isCheck: true
    })
}