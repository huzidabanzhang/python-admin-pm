<template>
    <Docment :visible="visible" :type="1"></Docment>
</template>

<script>
import Docment from './list.vue'
export default {
    components: { Docment },
    data() {
        return {
            visible: true
        }
    }
}
</script>
