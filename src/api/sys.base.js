import request from '@/plugin/axios'

/**
 * 导出数据库
 * @param {*} data 
 */
export function ExportSql (data) {
  return request({
    url: '/v1/Base/ExportSql',
    method: 'post',
    data,
    headers: { isCheck: true },
    responseType: 'blob'
  })
}

/**
 * 导入数据库
 * @param {*} data 
 */
export function ImportSql (data) {
  return request({
    url: '/v1/Base/ImportSql',
    method: 'post',
    data,
    headers: { 'content-type': 'multipart/form-data' }
  })
}

/**
 * 初始化数据库和原始数据
 */
export function CreateDrop () {
  return request({
    url: '/v1/Base/CreateDrop',
    method: 'get'
  })
}

/**
 * 初始化数据库和原始数据(新建后想重新初始化)
 */
export function AgainCreateDrop () {
  return request({
    url: '/v1/Base/AgainCreateDrop',
    method: 'get'
  })
}

/**
 * 获取用户登录情况
 * @param {*} data 
 */
export function GetLoginInfo (data) {
  return request({
    url: '/v1/Base/GetLoginInfo',
    method: 'post',
    data,
    headers: { isCheck: true }
  })
}

/**
 * 获取所有用户登录次数
 * @param {*} data 
 */
export function GetAllUserLoginCount (data) {
  return request({
    url: '/v1/Base/GetAllUserLoginCount',
    method: 'post',
    data,
    headers: { isCheck: true }
  })
}

/**
 * 获取所有用户登录次数
 * @param {*} data 
 */
export function GetUserLoginIp (data) {
  return request({
    url: '/v1/Base/GetUserLoginIp',
    method: 'post',
    data,
    headers: { isCheck: true }
  })
}