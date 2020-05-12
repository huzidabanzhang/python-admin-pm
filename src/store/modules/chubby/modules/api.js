import { Notification, Message } from 'element-ui'

const optionsEnv = Object.keys(process.env)
  .filter(keyName => /^VUE_APP_API_\d+_\w+$/.test(keyName))
  .map(keyName => {
    const [index, ...name] = keyName.replace('VUE_APP_API_', '').split('_')
    return {
      index: Number(index),
      name: name.join('_'),
      value: process.env[keyName]
    }
  })
  .sort((a, b) => a.index - b.index)
  .map(e => ({
    name: e.name,
    value: e.value,
    type: 'env'
  }))

const base = process.env.VUE_APP_API || (optionsEnv.length > 0 ? optionsEnv[0].value : '')

export default {
  namespaced: true,
  state: {
    // 网络请求地址
    base,
    // env 中设置的地址选项
    optionsEnv,
    // 用户自己添加的地址
    optionsUser: []
  },
  getters: {
    // 混合系统提供的地址和用户自己设置的地址记录
    options (state) {
      return [
        ...state.optionsUser,
        ...state.optionsEnv
      ]
    }
  },
  actions: {
    /**
     * @description 改变网络请求地址
     * @param {Object} vuex process
     * @param {String} value
     */
    set ({ state, dispatch }, value) {
      // 如果和现在的值一样 直接返回
      if (state.base === value) return

      return new Promise(async resolve => {
        // 如果不是选项中的值 将其加入选项
        const findIndex = [
          ...state.optionsEnv,
          ...state.optionsUser
        ].map(e => e.value).indexOf(value)
        if (findIndex === -1) {
          state.optionsUser.push({
            name: '自定义',
            value,
            type: 'custom'
          })
          // 持久化用户自定义选项
          await dispatch('chubby/db/set', {
            dbName: 'sys',
            path: 'api.optionsUser',
            value: state.optionsUser,
            user: false
          }, { root: true })
        }

        // 判断是否登录
        let user = await dispatch('chubby/db/get', {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })
        if (Object.keys(user).length == 0) {
          // 显示提示
          Notification({
            title: '环境变更',
            message: value
          })
        } else {
          // 注销当前登录
          await dispatch('chubby/account/logout', {}, { root: true })
          // 显示提示
          Notification({
            title: '环境变更，请重新登录',
            message: value
          })
        }

        // 应用变更
        state.base = value
        // 持久化接口地址设置
        await dispatch('chubby/db/set', {
          dbName: 'sys',
          path: 'api.base',
          value: state.base,
          user: false
        }, { root: true })
        resolve(user)
      })
    },
    /**
     * @description 删除一个用户自己的地址配置
     * @param {Object} vuex process
     * @param {String} value
     */
    remove ({ state, dispatch }, value) {
      return new Promise(async resolve => {
        const index = state.optionsUser.map(e => e.value).indexOf(value)
        if (index >= 0) {
          // 移除
          state.optionsUser.splice(index, 1)
          // 持久化用户自定义选项
          await dispatch('chubby/db/set', {
            dbName: 'sys',
            path: 'api.optionsUser',
            value: state.optionsUser,
            user: false
          }, { root: true })
          // 显示提示
          Message({
            message: `${value} 已经删除`,
            type: 'success'
          })
        }
        resolve()
      })
    },
    /**
     * @description 加载设置
     * @param {Object} vuex process
     */
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        // 加载接口地址设置
        state.base = await dispatch('chubby/db/get', {
          dbName: 'sys',
          path: 'api.base',
          defaultValue: base,
          user: false
        }, { root: true })
        // 加载接口地址设置
        state.optionsUser = await dispatch('chubby/db/get', {
          dbName: 'sys',
          path: 'api.optionsUser',
          defaultValue: [],
          user: false
        }, { root: true })
        resolve()
      })
    }
  }
}