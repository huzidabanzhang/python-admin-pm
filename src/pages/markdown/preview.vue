<template>
    <div
        class="markdown-body"
        v-html="html"
    ></div>
</template>

<script>
import marked from 'marked'
import 'github-markdown-css/github-markdown.css'  //导入
export default {
    name: 'markdown_perview',
    props: ['content', 'loadingInstance'],
    data () {
        return {
            html: marked(this.content)
        }
    },
    watch: {
        content (value) {
            this.html = marked(value)
            try {
                this.loadingInstance.close()
            } catch (error) {

            }
        }
    }
}
</script>

<style lang="scss" scoped>
.markdown-body {
    padding: 10px;
}
</style