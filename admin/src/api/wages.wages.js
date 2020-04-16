import request from '@/plugin/axios'

/**
 * 工资列表
 * @param {*} data 
 */
export function QueryWagesByParam(data) {
    return request({
        url: '/wages/Wages/QueryWagesByParam',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 删除工资
 * @param {*} data 
 */
export function DelWages(data) {
    return request({
        url: '/wages/Wages/DelWages',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 导入工资
 * @param {*} data 
 */
export function ImportWages(data, progressEvent) {
    return request({
        url: '/wages/Wages/ImportWages',
        method: 'post',
        data,
        headers: { 'content-type': 'multipart/form-data', isCheck: true },
        onUploadProgress: res => {
            const percentCompleted = Math.floor((res.loaded * 100) / res.total)
            progressEvent({ percent: percentCompleted })
        }
    })
}