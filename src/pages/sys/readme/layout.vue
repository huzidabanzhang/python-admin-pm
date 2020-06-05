<template>
    <chubby-container>
        <Preview :content="content"></Preview>
    </chubby-container>
</template>

<script>
import { GetReadmeContent } from '@api/sys.base'
import Preview from '@/pages/markdown/preview.vue'
export default {
    name: 'preview',
    components: { Preview },
    data () {
        return {
            content: ''
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            GetReadmeContent()
                .then(async res => {
                    this.content = res.content
                })
                .catch(() => {

                })
        }
    }
}
</script>