import request from '@/plugin/axios'

export function AccountLogin(data) {
    return request({
        url: '/v1/Admin/Login',
        method: 'post',
        data
    })
}
