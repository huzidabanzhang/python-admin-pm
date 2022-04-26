import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import router from '@/router'
import Admin from '@/plugin/admin'

createApp(App)
    .use(store)
    .use(router)
    .use(Admin)
    .mount('#app')