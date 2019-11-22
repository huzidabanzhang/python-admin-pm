import request from '@/plugin/axios'

/**
 * 新建权限
 * @param {*} data 
 */
export function CreateRole(data) {
    return request({
        url: '/v1/Role/CreateRole',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 禁用权限
 * @param {*} data 
 */
export function LockRole(data) {
    return request({
        url: '/v1/Role/LockRole',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 修改权限信息
 * @param {*} data 
 */
export function ModifyRole(data) {
    return request({
        url: '/v1/Role/ModifyRole',
        method: 'post',
        data,
        isCheck: true
    })
}

/**
 * 获取权限列表
 * @param {*} data 
 */
export function QueryRoleByParam(data) {
    return request({
        url: '/v1/Role/QueryRoleByParam',
        method: 'post',
        data,
        isCheck: true
    })
}