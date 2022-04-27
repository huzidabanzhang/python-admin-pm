<template>
    <admin-container>
        <Markdown :content="content" :save="handleSave"></Markdown>
    </admin-container>
</template>

<script setup lang="ts">
import Markdown from '@/layout/pages/markdown/index.vue'
import { ref } from 'vue'

const content = ref('')

function handleSave() {}
</script>
