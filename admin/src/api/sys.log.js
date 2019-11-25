import request from '@/plugin/axios'

/**
 * 获取日志列表
 * @param {*} data 
 */
export function QueryLogByParam(data) {
    return request({
        url: '/v1/Log/QueryLogByParam',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}