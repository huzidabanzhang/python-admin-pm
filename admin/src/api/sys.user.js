import request from '@/plugin/axios'

/**
 * 管理员登录
 * @param {*} data 
 */
export function AccountLogin(data) {
    return request({
        url: '/v1/Admin/Login',
        method: 'post',
        data
    })
}

/**
 * 管理员登出
 */
export function AccountLogout() {
    return request({
        url: '/v1/Admin/Logout',
        method: 'get'
    })
}

/**
 * 初始化数据库和原始数据
 */
export function CreateDrop() {
    return request({
        url: '/v1/Admin/CreateDrop',
        method: 'get'
    })
}

/**
 * 初始化数据库和原始数据(新建后想重新初始化)
 */
export function AgainCreateDrop() {
    return request({
        url: '/v1/Admin/AgainCreateDrop',
        method: 'get',
        headers: { isCheck: true }
    })
}

/**
 * 初始化数据库和原始数据
 */
export function checkDb() {
    return request({
        url: '/v1/Admin/checkDb',
        method: 'get'
    })
}

/**
 * 新建管理员用户
 * @param {*} data 
 */
export function CreateAdmin(data) {
    return request({
        url: '/v1/Admin/CreateAdmin',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 禁用管理员用户
 * @param {*} data 
 */
export function LockAdmin(data) {
    return request({
        url: '/v1/Admin/LockAdmin',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 修改管理员用户信息
 * @param {*} data 
 */
export function ModifyAdmin(data) {
    return request({
        url: '/v1/Admin/ModifyAdmin',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 获取管理员用户列表
 * @param {*} data 
 */
export function QueryAdminByParam(data) {
    return request({
        url: '/v1/Admin/QueryAdminByParam',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}