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
        headers: { isCheck: true },
    })
}

/**
 * 隐藏权限
 * @param {*} data
 */
export function LockRole(data) {
    return request({
        url: '/v1/Role/LockRole',
        method: 'post',
        data,
        headers: { isCheck: true },
    })
}

/**
 * 删除权限
 * @param {*} data
 */
export function DelRole(data) {
    return request({
        url: '/v1/Role/DelRole',
        method: 'post',
        data,
        headers: { isCheck: true },
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
        headers: { isCheck: true },
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
        headers: { isCheck: true },
    })
}
