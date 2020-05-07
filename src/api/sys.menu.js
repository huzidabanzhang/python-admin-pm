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
        headers: {isCheck: true}
    })
}

/**
 * 隐藏菜单
 * @param {*} data 
 */
export function LockMenu(data) {
    return request({
        url: '/v1/Menu/LockMenu',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 删除菜单
 * @param {*} data 
 */
export function DelMenu(data) {
    return request({
        url: '/v1/Menu/DelMenu',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 获取菜单下级联的API接口
 * @param {*} data 
 */
export function GetMenuToInterface(data) {
    return request({
        url: '/v1/Menu/GetMenuToInterface',
        method: 'get',
        data,
        headers: {isCheck: true, isGet: true}
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
        headers: {isCheck: true}
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
        headers: {isCheck: true}
    })
}