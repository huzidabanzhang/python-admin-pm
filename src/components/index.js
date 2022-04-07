import adminIcon from './admin-icon/index.vue'
import adminContainer from './admin-container/index'

export default function installComponent (Vue) {
    Vue.component('admin-container', adminContainer)
    Vue.component('admin-icon', adminIcon)
    Vue.component(
        'admin-icon-select',
        () => import('./admin-icon-select/index.vue')
    )
}
