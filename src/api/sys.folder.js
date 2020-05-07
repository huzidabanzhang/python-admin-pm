import request from '@/plugin/axios'

/**
 * 创建文件夹
 * @param {*} data 
 */
export function CreateFolder(data, progressEvent) {
    return request({
        url: '/v1/Folder/CreateFolder',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 修改文件夹
 * @param {*} data 
 */
export function ModifyFolder(data, progressEvent) {
    return request({
        url: '/v1/Folder/ModifyFolder',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 删除 文件夹
 * @param {*} data 
 */
export function DelFolder(data) {
    return request({
        url: '/v1/Folder/DelFolder',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 获取文件夹列表
 * @param {*} data 
 */
export function QueryFolderByParam(data) {
    return request({
        url: '/v1/Folder/QueryFolderByParam',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}