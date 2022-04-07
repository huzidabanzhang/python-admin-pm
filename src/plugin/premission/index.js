import store from '@/store/index'

export default {
    install (Vue, options) {
        // 下拉框 禁止删除已选择选项或者默认选项
        Vue.directive('default', {
            updated (el, bindings, vnode) {
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
        Vue.directive('auth', function (el, binding, node) {
            let user = store.getters['user/user'],
                mark = binding.arg,
                role = store.getters['user/interfaces'],
                t = mark.split('_')[0]

            if (!user) return true

            if (user.is_admin == true) return true

            if (role) {
                let item = role.filter((i) => {
                    return i.mark == mark
                })

                node.context.auth[t] =
                    item.length == 0 ? true : Boolean(item[0].disable)
            } else node.context.auth[t] = true
        })

        // 注册权限判断事件
        Vue.config.globalProperties.$auth = (mark) => {
            let user = store.getters['user/user'],
                role = store.getters['user/interfaces']

            if (!user) return true

            if (user.is_admin) return false

            if (role) {
                let item = role.filter((i) => {
                    return i.mark == mark
                })

                return item.length == 0 ? true : Boolean(item[0].disable)
            } else return true
        }
    },
}
