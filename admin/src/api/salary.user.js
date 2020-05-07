import request from '@/plugin/axios'

/**
 * 用户列表
 * @param {*} data 
 */
export function QueryUserByParam(data) {
    return request({
        url: '/v2/Salary/QueryUserByParam',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 删除用户
 * @param {*} data 
 */
export function DelUser(data) {
    return request({
        url: '/v2/Salary/DelUser',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 修改用户
 * @param {*} data 
 */
export function SetUser(data) {
    return request({
        url: '/v2/Salary/SetUser',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}