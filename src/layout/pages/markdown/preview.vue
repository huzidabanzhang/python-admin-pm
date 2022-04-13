<template>
    <div
        class="markdown-body"
        v-html="html"
    ></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import 'github-markdown-css/github-markdown.css'  //导入

const props = defineProps(['content', 'loadingInstance'])

const html = ref('')

watch(
    () => props.content,
    (value) => {
        html.value = value
        try {
            props.loadingInstance.close()
        } catch (error) {

        }
    },
    { immediate: true }
)
</script>

<style lang="scss" scoped>
.markdown-body {
    padding: 10px;
}
</style>