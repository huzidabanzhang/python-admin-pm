import request from '@/plugin/axios'

/**
 * 上传文档
 * @param {*} data
 */
export function CreateDocument(data, progressEvent) {
  return request({
    url: '/v1/Document/CreateDocument',
    method: 'post',
    data,
    headers: { 'content-type': 'multipart/form-data', isCheck: true },
    onUploadProgress: (res) => {
      if (progressEvent) {
        const percentCompleted = Math.floor((res.loaded * 100) / res.total)
        progressEvent({ percent: percentCompleted })
      }
    },
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
    data,
    headers: { isCheck: true },
  })
}

/**
 * 回收 文档
 * @param {*} data
 */
export function RetrieveDocument(data) {
  return request({
    url: '/v1/Document/RetrieveDocument',
    method: 'post',
    data,
    headers: { isCheck: true },
  })
}

/**
 * 下载 文档
 * @param {*} data
 */
export function DownDocument(data) {
  return request({
    url: '/v1/Document/DownDocument',
    method: 'get',
    data,
    headers: { isCheck: true, isGet: true },
    responseType: 'blob',
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
    data,
    headers: { isCheck: true },
  })
}
