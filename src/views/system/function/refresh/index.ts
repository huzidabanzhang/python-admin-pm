import * as Vue from 'vue'
export default {
    beforeRouteEnter (to, from, next) {
        next((instance) => instance.$router.replace(from.fullPath))
    },
    render: (h) => h(),
}
