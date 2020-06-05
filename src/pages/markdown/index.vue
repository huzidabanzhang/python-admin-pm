<template>
    <mavon-editor
        :subfield="false"
        :boxShadow="false"
        defaultOpen="preview"
        :toolbarsFlag="false"
        @imgAdd="handleImageCreate"
        @imgDel="handleImageDel"
        v-model="content"
        @save="handleSave"
        ref="MARKDOWN"
    />
</template>

<script>
export default {
    props: {
        content: String,
        save: {
            type: Function,
            default: null
        }
    },
    methods: {
        handleSave (value, render) {
            console.log(value)
            console.log(render)
            console.log(this.save)
        },
        handleImageCreate (pos, file) {

        },
        handleImageDel (pos) {

        }
    }
}
</script>
