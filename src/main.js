// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import Chubby from '@/plugin/chubby'
// store
import store from '@/store/index'

// [ 可选组件 ]D2-Crud
import D2Crud from '@d2-projects/d2-crud'
import VCharts from 'v-charts'

// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'

// 核心插件
Vue.use(Chubby)

// 可选插件组件
Vue.use(D2Crud)
Vue.use(VCharts)

// 按钮权限判断指令
Vue.directive('premissions', function (el, binding, node) {
    let params = binding.value, data = store.getters['chubby/user/interfaces']
    if (data) {
        let item  = data.filter((i) => {
            return i.mark == params.mark
        })
        if (item.length == 0) {
            // if (!params.not_hidden) el.style.display = 'none'
            // else node.context.mark_btn[params.type] = true
            node.context.mark_btn[params.type] = true
        } else {
            if (params.not_disabled == undefined || !params.not_disabled)
                node.context.mark_btn[params.type] = Boolean(item[0].is_disabled)
        }
    } else node.context.mark_btn[params.type] = true
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
    created() {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('chubby/page/init', frameInRoutes)
        // 设置顶栏菜单
        this.$store.commit('chubby/menu/headerSet', menuHeader)
        // 初始化菜单搜索功能
        this.$store.commit('chubby/search/init', menuHeader)
    },
    mounted() {
        // 用户登录后从数据库加载一系列的设置
        this.$store.dispatch('chubby/account/load')
        // 获取并记录用户 UA
        this.$store.commit('chubby/ua/get')
        // 初始化全屏监听
        this.$store.dispatch('chubby/fullscreen/listen')
    }
}).$mount('#app')
