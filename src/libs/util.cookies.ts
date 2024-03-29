import Cookies from 'js-cookie'

interface Cookie {
    set: Function,
    get: Function,
    getAll: Function,
    remove: Function
}

const cookies: Cookie = {
    /**
     * @description 存储 cookie 值
     * @param {String} name cookie name
     * @param {String} value cookie value
     * @param {Object} setting cookie setting
     */
    set: function (name = 'default', value = '', cookieSetting = {}) {
        let currentCookieSetting = {
            expires: 1,
        }
        Object.assign(currentCookieSetting, cookieSetting)
        Cookies.set(
            `admin-${import.meta.env.VITE_APP_VERSION}-${name}`,
            value,
            currentCookieSetting
        )
    },
    /**
     * @description 拿到 cookie 值
     * @param {String} name cookie name
     */
    get: function (name = 'default') {
        return Cookies.get(`admin-${import.meta.env.VITE_APP_VERSION}-${name}`)
    },
    /**
     * @description 拿到 cookie 全部的值
     */
    getAll: function () {
        return Cookies.get()
    },
    /**
     * @description 删除 cookie
     * @param {String} name cookie name
     */
    remove: function (name = 'default') {
        return Cookies.remove(`admin-${import.meta.env.VITE_APP_VERSION}-${name}`)
    }
}

export default cookies
