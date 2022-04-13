import adminIcon from './admin-icon/index.vue'
import adminContainer from './admin-container/index'
import adminIconSelect from './admin-icon-select/index.vue'

export default function installComponent (Vue) {
    Vue.component('admin-container', adminContainer)
    Vue.component('admin-icon', adminIcon)
    Vue.component('admin-icon-select', adminIconSelect)
}
