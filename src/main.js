import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store/index'
import router from '@/router/index'
import Admin from '@/plugin/admin'

createApp(App)
    .use(store)
    .use(router)
    .use(Admin)
    .mount('#app')