import { createStore } from 'vuex'

const files = import.meta.globEager('./modules/*.js')
const modules = {}

for (let key in files) {
    modules[key.replace(/(\.\/|\.js)/g, '').replace('modules/', '')] = files[key].default
}

export default createStore({
    modules: modules
})
