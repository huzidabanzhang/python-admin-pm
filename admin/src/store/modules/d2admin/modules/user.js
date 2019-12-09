export default {
    namespaced: true,
    state: {
        // 用户信息
        info: {},
        isInit: false
    },
    getters: {
        /**
         * @description 返回菜单数据
         * @param {*} state vuex state
         */
        menus(state) {
            return state.info.menus
        },
        /**
         * @description 返回接口数据
         * @param {*} state vuex state
         */
        interfaces(state) {
            return state.info.interfaces
        },
        /**
         * @description 返回路由数据
         * @param {*} state vuex state
         */
        routes(state) {
            return state.info.routers
        },
        /**
         * @description 返回用户数据
         * @param {*} state vuex state
         */
        info(state) {
            return state.info
        },
        /**
         * @description 返回是否初始化
         * @param {*} state vuex state
         */
        isInit(state) {
            return state.isInit
        }
    },
    actions: {
        /**
         * @description 设置用户数据
         * @param {Object} context
         * @param {*} info info
         */
        set({ state, dispatch }, info) {
            return new Promise(async resolve => {
                // store 赋值
                state.info = info
                // 持久化
                await dispatch('d2admin/db/set', {
                    dbName: 'sys',
                    path: 'user.info',
                    value: info,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * @description 从数据库取用户数据
         * @param {Object} context
         */
        load({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.info = await dispatch('d2admin/db/get', {
                    dbName: 'sys',
                    path: 'user.info',
                    defaultValue: {},
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        }
    },
    mutations: {
        /**
         * @description 修改是否初始化
         * @param {Object} state state
         */
        setInit(state, isInit) {
            state.isInit = isInit
        }
    }
}
