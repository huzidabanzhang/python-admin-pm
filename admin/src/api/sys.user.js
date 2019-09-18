import request from '@/plugin/axios'

export function AccountLogin(data) {
    return request({
        url: '/API/v1/User/Login',
        method: 'post',
        data
    })
}
