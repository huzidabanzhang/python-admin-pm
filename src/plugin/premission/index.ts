import store from '@/store/index'
import { isBoolean } from 'lodash'

function handleAuth(mark) {
    const user = store.getters['user/user']
    const role = store.getters['user/interfaces']

    if (!user) return true
    if (user.is_admin) return false

    if (role) return role.filter(i => { return i.mark === mark })
    else return []
}

export default {
    install(app, options) {
        // 下拉框 禁止删除已选择选项或者默认选项
        app.directive('default', {
            updated(el, bindings) {
                // values v-model 绑定值
                // options 下拉选项
                // prop 对应 options 中 的 value 属性
                // defaultValue 默认值判断值
                const [values, options, prop, defaultValue] = bindings.value

                // 需要隐藏的标签索引
                const indexs = []
                const tempData = values.map((a) => options.find((op) => op[prop] === a))

                tempData.forEach((a, index) => {
                    if (a[prop] === defaultValue) indexs.push(index)
                })

                const dealStyle = function (tags) {
                    tags.forEach((el, index) => {
                        if (
                            indexs.includes(index) &&
                            ![...el.classList].includes('select-tag-close-none')
                        ) {
                            el.classList.add('none')
                        }
                    })
                }

                // 设置样式 隐藏close icon
                const tags = el.querySelectorAll('.el-tag__close')
                if (tags.length > 0) dealStyle(tags)
                else {
                    setTimeout(() => {
                        dealStyle(el.querySelectorAll('.el-tag__close'))
                    })
                }
            },
        })

        // 按钮权限判断指令
        app.directive('auth', (el, binding, node) => {
            const mark = binding.arg
            const t = mark.split('_')[0]
            const item = handleAuth(mark)
            if (isBoolean(item)) return item
            node.context.auth[t] = item.length === 0 ? true : Boolean(item[0].disable)
        })

        // 注册权限判断事件
        app.config.globalProperties.$auth = (mark) => {
            const item = handleAuth(mark)
            if (isBoolean(item)) return item
            return item.length === 0 ? true : Boolean(item[0].disable)
        }
    }
}