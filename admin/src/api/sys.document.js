import request from '@/plugin/axios'

/**
 * 上传文档
 * @param {*} data 
 */
export function CreateDocument(data) {
    return request({
        url: '/v1/Document/CreateDocument',
        method: 'post',
        data,
        headers: { 'content-type': 'multipart/form-data' }
    })
}

/**
 * 删除 文档
 * @param {*} data 
 */
export function DelDocument(data) {
    return request({
        url: '/v1/Document/DelDocument',
        method: 'post',
        data    
    })
}

/**
 * 获取文档
 * @param {*} data 
 */
export function GetDocument(params) {
    return request({
        url: '/v1/Document/GetDocument' + params,
        method: 'get',
        responseType: 'arraybuffer'
    })
}

/**
 * 下载文档
 * @param {*} data 
 */
export function DownDocument(params) {
    return request({
        url: '/v1/Document/DownDocument' + params,
        method: 'get'
    })
}

/**
 * 获取文档列表
 * @param {*} data 
 */
export function QueryDocumentByParam(data) {
    return request({
        url: '/v1/Document/QueryDocumentByParam',
        method: 'post',
        data
    })
}