import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import util from '@/libs/util'
import { cloneDeep } from 'lodash'

const adapter = new LocalStorage(`admin-${import.meta.env.VITE_APP_VERSION}`)
const db = low(adapter)

db
    .defaults({
        sys: {},
        database: {}
    })
    .write()

export default db

/**
 * @description 检查路径是否存在 不存在的话初始化
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 路径
 * @param {Object} payload user {Boolean} 区分用户
 * @param {Object} payload defaultValue {*} 初始化默认值
 * @returns {String} 可以直接使用的路径
 */
export function pathInit({
    dbName = 'database',
    path = '',
    user = true,
    defaultValue = '' as (string | object)
}) {
    const admin_id = util.cookies.get('uuid') || 'test'
    const currentPath = `${dbName}.${user ? `user.${admin_id}` : 'public'}${path ? `.${path}` : ''}`
    const value = db.get(currentPath).value()
    if (!(value !== undefined)) {
        db
            .set(currentPath, defaultValue)
            .write()
    }
    return currentPath
}

/**
 * @description 将数据存储到指定位置 | 路径不存在会自动初始化
 * @description 效果类似于取值 dbName.path = value
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 存储路径
 * @param {Object} payload value {*} 需要存储的值
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function dbSet({
    dbName = 'database',
    path = '',
    value = '',
    user = false
}) {
    db.set(pathInit({
        dbName,
        path,
        user
    }), value).write()
}

/**
 * @description 获取数据
 * @description 效果类似于取值 dbName.path || defaultValue
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 存储路径
 * @param {Object} payload defaultValue {*} 取值失败的默认值
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function dbGet({
    dbName = 'database',
    path = '',
    defaultValue = '' as (string | object),
    user = false
}) {
    return new Promise<void>(resolve => {
        resolve(cloneDeep(db.get(pathInit({
            dbName,
            path,
            user,
            defaultValue
        })).value()))
    })
}

/**
 * @description 获取存储数据库对象
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function database({
    dbName = 'database',
    path = '',
    user = false,
    defaultValue = '' as (string | object)
} = {}) {
    return new Promise<void>(resolve => {
        resolve(db.get(pathInit({
            dbName, path, user, defaultValue
        })))
    })
}
