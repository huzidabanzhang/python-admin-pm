import qs from 'qs'
import axios from 'axios'
import util from '@/libs/util'
import store from '@/store/index'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'

// 创建一个错误
function errorCreate (msg) {
    const error = new Error(msg)
    errorLog(error)
    throw error
}

// 记录和显示错误
function errorLog (error) {
    // 打印到控制台
    if (import.meta.env.NODE_ENV === 'development') {
        util.log.danger('>>>>>> Error >>>>>>')
        console.log(error)
    }
    // 显示提示
    ElMessage({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
    })
}

// 创建一个 axios 实例
const service = axios.create({
    timeout: 30000, // 请求超时时间
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
            if (
                pending[i].name ==
                config.url + JSON.stringify(config.data) + '&' + config.method
            ) {
                pending[i].fun()
                pending.splice(i, 1)
                break
            }
        }
    }
}

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // API接口权限判断
        let isCheck = true
        if (config.headers.isCheck) {
            let interfaces = cloneDeep(store.getters['user/interfaces'])
            isCheck = interfaces.some((item) => {
                return item.path == config.url && !item.disable
            })

            if (!isCheck) return Promise.reject({ message: '无权限~' })
        }

        // 在HTTP请求前取消前面的所有请求
        if (config.headers.removeP) removePending(config, true)
        // 在HTTP请求前取消相同的请求
        else removePending(config, false)

        // 记录本次HTTP请求
        config.cancelToken = new cancelToekn((c) => {
            pending.push({
                name: config.url + JSON.stringify(config.data) + '&' + config.method,
                fun: c,
            })
        })

        // 在请求发送之前做一些处理
        const token = util.cookies.get('token')
        const password = util.cookies.get('password')
        config.auth = {
            username: token,
            password: password,
        }

        if (config.headers.isGet) {
            if (Object.keys(config.data).length > 0) {
                let count = 0
                config.url += '?'
                for (let i in config.data) {
                    config.url += (count == 0 ? '' : '&') + i + '=' + config.data[i]
                    count++
                }
            }
        } else {
            if (!config.headers['content-type']) {
                config.headers['content-type'] = 'application/x-www-form-urlencoded'
                config.data = qs.stringify(config.data, { arrayFormat: 'brackets' }) // 传数组到后端接收为 type[] = xxx
            }
        }

        config.baseURL = store.state.api.base + '/API'

        return config
    },
    (error) => {
        // 发送失败
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        setTimeout(() => {
            // 请求成功后删除记录（延时是为了防止短时间内重复请求）
            removePending(response.config)
        }, 500)

        const { code, data, msg } = response.data
        // 根据 status 进行判断
        if (code === undefined) {
            return response
        } else {
            switch (code) {
                case 0:
                    return data
                default:
                    errorCreate(msg)
                    break
            }
        }
    },
    (error) => {
        // 判断是否是被取消请求
        if (!axios.isCancel(error)) {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400:
                        error.message = '请求错误'
                        break
                    case 401:
                        error.message = '未授权，请登录'
                        break
                    case 403:
                        error.message = '拒绝访问'
                        break
                    case 404:
                        error.message = `请求地址出错: ${error.response.config.url}`
                        break
                    case 408:
                        error.message = '请求超时'
                        break
                    case 500:
                        error.message = '服务器内部错误'
                        break
                    case 501:
                        error.message = '服务未实现'
                        break
                    case 502:
                        error.message = '网关错误'
                        break
                    case 503:
                        error.message = '服务不可用'
                        break
                    case 504:
                        error.message = '网关超时'
                        break
                    case 505:
                        error.message = 'HTTP版本不受支持'
                        break
                    default:
                        break
                }

                setTimeout(() => {
                    // 请求成功后删除记录（延时是为了防止短时间内重复请求）
                    removePending(error.config)
                }, 500)
            }
            errorLog(error)
        }

        return Promise.reject(error)
    }
)

export default service
