import request from '@/plugin/axios'

/**
 * 工资列表
 * @param {*} data 
 */
export function QuerySalaryByParam(data) {
    return request({
        url: '/v2/Salary/QuerySalaryByParam',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 删除工资
 * @param {*} data 
 */
export function DelSalary(data) {
    return request({
        url: '/v2/Salary/DelSalary',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 导入工资
 * @param {*} data 
 */
export function ImportSalary(data, progressEvent) {
    return request({
        url: '/v2/Salary/ImportSalary',
        method: 'post',
        data,
        headers: { 'content-type': 'multipart/form-data', isCheck: true },
        onUploadProgress: res => {
            const percentCompleted = Math.floor((res.loaded * 100) / res.total)
            progressEvent({ percent: percentCompleted })
        }
    })
}