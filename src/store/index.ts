import { createStore } from 'vuex'

const files = import.meta.globEager('./modules/*')
const modules = {}

for (let key in files) {
    modules[key.replace(/(\.\/|\.ts)/g, '').replace('modules/', '')] = files[key].default
}

export default createStore({
    modules: modules
})
