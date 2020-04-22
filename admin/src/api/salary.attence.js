import request from '@/plugin/axios'

/**
 * 考勤列表
 * @param {*} data 
 */
export function QueryAttendanceByParam(data) {
    return request({
        url: '/v2/Salary/QueryAttendanceByParam',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 删除考勤
 * @param {*} data 
 */
export function DelAttendance(data) {
    return request({
        url: '/v2/Salary/DelAttendance',
        method: 'post',
        data,
        headers: { isCheck: true }
    })
}

/**
 * 导入考勤
 * @param {*} data 
 */
export function ImportAttendance(data, progressEvent) {
    return request({
        url: '/v2/Salary/ImportAttendance',
        method: 'post',
        data,
        headers: { 'content-type': 'multipart/form-data', isCheck: true },
        onUploadProgress: res => {
            const percentCompleted = Math.floor((res.loaded * 100) / res.total)
            progressEvent({ percent: percentCompleted })
        }
    })
}