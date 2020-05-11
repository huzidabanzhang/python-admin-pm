<template>
    <Docment :visible="visible"></Docment>
</template>

<script>
import Docment from './list.vue'
export default {
    components: { Docment },
    data () {
        return {
            visible: false
        }
    },
    created () {
        this.visible = true
    }
}
</script>