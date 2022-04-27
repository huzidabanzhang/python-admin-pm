<template>
    <Docment :visible="visible"></Docment>
</template>

<script setup lang="ts">
import Docment from './list.vue'
import { ref, onMounted } from 'vue'

const visible = ref(false)
onMounted(() => {
    visible.value = true
})
</script>
