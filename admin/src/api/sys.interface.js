import request from '@/plugin/axios'

/**
 * 新建接口
 * @param {*} data 
 */
export function CreateInterface(data) {
    return request({
        url: '/v1/Interface/CreateInterface',
        method: 'post',
        data
    })
}

/**
 * 禁用接口
 * @param {*} data 
 */
export function LockInterface(data) {
    return request({
        url: '/v1/Interface/LockInterface',
        method: 'post',
        data
    })
}

/**
 * 修改接口信息
 * @param {*} data 
 */
export function ModifyInterface(data) {
    return request({
        url: '/v1/Interface/ModifyInterface',
        method: 'post',
        data
    })
}

/**
 * 获取接口列表
 * @param {*} data 
 */
export function QueryInterfaceByParam(data) {
    return request({
        url: '/v1/Interface/QueryInterfaceByParam',
        method: 'post',
        data
    })
}