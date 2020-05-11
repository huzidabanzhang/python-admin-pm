import Vue from 'vue'

import chubbyContainer from './chubby-container'
import chubbyContainerFrame from './chubby-container-frame'
import chubbyLinkBtn from './chubby-link-btn'

// 注意 有些组件使用异步加载会有影响
Vue.component('chubby-container', chubbyContainer)
Vue.component('chubby-container-frame', chubbyContainerFrame)
Vue.component('chubby-link-btn', chubbyLinkBtn)
Vue.component('chubby-count-up', () => import('./chubby-count-up'))
Vue.component('chubby-highlight', () => import('./chubby-highlight'))
Vue.component('chubby-icon', () => import('./chubby-icon'))
Vue.component('chubby-icon-svg', () => import('./chubby-icon-svg/index.vue'))
Vue.component('chubby-icon-select', () => import('./chubby-icon-select/index.vue'))
Vue.component('chubby-icon-svg-select', () => import('./chubby-icon-svg-select/index.vue'))
Vue.component('chubby-module-index-banner', () => import('./chubby-module-index-banner'))
Vue.component('chubby-module-index-menu', () => import('./chubby-module-index-menu'))
