export default {
    namespaced: true,
    state: {
        // 用户信息
        info: {},
        isInit: false,
    },
    getters: {
        /**
         * @description 返回菜单数据
         * @param {*} state vuex state
         */
        menus(state) {
            try {
                return state.info.menus
            } catch (error) {
                return []
            }
        },
        /**
         * @description 返回接口数据
         * @param {*} state vuex state
         */
        interfaces(state) {
            try {
                return state.info.interfaces
            } catch (error) {
                return []
            }
        },
        /**
         * @description 返回用户所有数据
         * @param {*} state vuex state
         */
        info(state) {
            return state.info
        },
        /**
         * @description 返回用户基本数据
         * @param {*} state vuex state
         */
        user(state) {
            try {
                return state.info.user
            } catch (error) {
                return {}
            }
        },
        /**
         * @description 返回是否初始化
         * @param {*} state vuex state
         */
        isInit(state) {
            return state.isInit
        },
    },
    actions: {
        /**
         * @description 设置用户数据
         * @param {Object} context
         * @param {*} info info
         */
        set({ state, dispatch }, info) {
            return new Promise<void>(async (resolve) => {
                // store 赋值
                state.info = info
                // 持久化
                await dispatch(
                    'db/set',
                    {
                        dbName: 'sys',
                        path: 'user.info',
                        value: info,
                        user: true,
                    },
                    { root: true }
                )
                // end
                resolve()
            })
        },
        /**
         * @description 从数据库取用户数据
         * @param {Object} context
         */
        load({ state, dispatch }) {
            return new Promise<void>(async (resolve) => {
                // store 赋值
                state.info = await dispatch(
                    'db/get',
                    {
                        dbName: 'sys',
                        path: 'user.info',
                        defaultValue: {},
                        user: true,
                    },
                    { root: true }
                )
                // end
                resolve()
            })
        },
    },
    mutations: {
        /**
         * @description 修改是否初始化
         * @param {Object} state state
         */
        setInit(state, isInit) {
            state.isInit = isInit
        },
    },
}
