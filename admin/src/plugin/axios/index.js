import qs from 'qs'
import axios from 'axios'
import { Message } from 'element-ui'
import { cloneDeep } from 'lodash'
import util from '@/libs/util'
import store from '@/store/index'

// 创建一个错误
function errorCreate(msg) {
    const error = new Error(msg)
    errorLog(error)
    throw error
}

// 记录和显示错误
function errorLog(error) {
    // 打印到控制台
    if (process.env.NODE_ENV === 'development') {
        util.log.danger('>>>>>> Error >>>>>>')
        console.log(error)
    }
    // 显示提示
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
}

// 创建一个 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 5000 // 请求超时时间
})

// 解决跨域session丢失问题
service.defaults.withCredentials = true

// 存储的HTTP请求
let pending = []
let cancelToekn = axios.CancelToken
let removePending = (config, isAll) => {
    for (let i = 0; i < pending.length; i++) {
        if (isAll) {
            pending[i].fun()
            pending.splice(i, 1)
            i--
        } else {
            if (pending[i].name == config.url + JSON.stringify(config.data) + '&' + config.method) {
                pending[i].fun()
                pending.splice(i, 1)
                break
            }
        }
    }
}

// 请求拦截器
service.interceptors.request.use(
    config => {
        // API接口权限判断
        let isCheck = true

        if (config.headers.isCheck) {
            let interfaces = cloneDeep(store.state.d2admin.user.info.interfaces)
            isCheck = interfaces.some((item) => {
                return item.path == config.url
            })

            if (!isCheck) return Promise.reject(Message({
                message: '无权限~',
                type: 'error',
                duration: 3 * 1000
            }))
        }

         // 在HTTP请求前取消前面的所有请求
        if (config.headers.removeP) removePending(config, true)
         // 在HTTP请求前取消相同的请求
        else removePending(config, false)

        // 记录本次HTTP请求
        config.cancelToken = new cancelToekn((c) => {
            pending.push({
                name: config.url + JSON.stringify(config.data) + '&' + config.method,
                fun: c
            })
        })

        // 在请求发送之前做一些处理
        const token = util.cookies.get('token')
        const password = util.cookies.get('password')
        config.auth = {
            username: token,
            password: password
        }
        if (!config.headers['content-type']) {
            config.headers['content-type'] = 'application/x-www-form-urlencoded'
            config.data = qs.stringify(config.data, { arrayFormat: 'brackets' }) // 传数组到后端接收为 type[] = xxx
        }
        return config
    },
    error => {
        // 发送失败
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        setTimeout(() => {
            // 请求成功后删除记录（延时是为了防止短时间内重复请求）
            removePending(response.config)
        }, 500)

        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        const { code } = dataAxios
        // 根据 code 进行判断
        if (code === undefined) {
            // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
            return response
        } else {
            // 有 code 代表这是一个后端接口 可以进行进一步的判断
            switch (code) {
                case 0:
                    // [ 示例 ] code === 0 代表没有错误
                    return dataAxios.data
                case -1:
                    // [ 示例 ] 其它和后台约定的 code
                    errorCreate(dataAxios.msg)
                    break
                case 401:
                    // token 问题返回登录页面
                    errorCreate(dataAxios.msg)
                    break
                case 403:
                    // 无权限访问 跳转到无权限页面
                    errorCreate(dataAxios.msg)
                    break
                case 404:
                    // 无权限访问 跳转到无权限页面
                    errorCreate(dataAxios.msg)
                    break
                case 405:
                    // 无权限访问 跳转到无权限页面
                    errorCreate(dataAxios.msg)

                    break
                default:
                    // 不是正确的 code
                    errorCreate(dataAxios.msg)
                    break
            }
        }
    },
    error => {
        // 判断是否是被取消请求
        if (!axios.isCancel(error)) {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400: error.message = '请求错误'; break
                    case 401: error.message = '未授权，请登录'; break
                    case 403: error.message = '拒绝访问'; break
                    case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
                    case 408: error.message = '请求超时'; break
                    case 500: error.message = '服务器内部错误'; break
                    case 501: error.message = '服务未实现'; break
                    case 502: error.message = '网关错误'; break
                    case 503: error.message = '服务不可用'; break
                    case 504: error.message = '网关超时'; break
                    case 505: error.message = 'HTTP版本不受支持'; break
                    default: break
                }
            }
            errorLog(error)

            setTimeout(() => {
                // 请求成功后删除记录（延时是为了防止短时间内重复请求）
                removePending(error.config)
            }, 500)
        }

        return Promise.reject(error)
    }
)

export default service
