<template>
    <chubby-container>
        <Markdown
            :content="content"
            :save="handleSave"
        ></Markdown>
    </chubby-container>
</template>

<script>
import Markdown from '@/pages/markdown/index.vue'
export default {
    name: 'markdown_write',
    components: { Markdown },
    data () {
        return {
            content: ''
        }
    },
    methods: {
        handleSave () {

        }
    }
}
</script>