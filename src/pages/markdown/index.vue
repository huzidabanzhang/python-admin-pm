<template>
    <mavon-editor
        style="height: 100%"
        :boxShadow="false"
        defaultOpen="preview"
        @imgAdd="handleImageCreate"
        @imgDel="handleImageDel"
        v-model="value"
        @save="handleSave"
        ref="MARKDOWN"
    />
</template>

<script>
import { CreateDocument, GetDocument } from '@api/sys.document'
import util from '@/libs/util.js'
export default {
    props: {
        content: String,
        save: {
            type: Function,
            default: null
        }
    },
    data () {
        return {
            value: this.content,
            images: {},
            API: this.$store.state.chubby.api.base + '/API/v1/Document/GetDocument'
        }
    },
    methods: {
        handleSave (value, render) {
            this.$message.warning('功能暂不开放')
        },
        handleImageCreate (pos, file) {
            this.images[pos] = file

            let formData = new FormData()
            formData.append('uid[]', [1])
            formData.append('document', file)
            formData.append('admin_id', util.cookies.get('uuid'))
            formData.append('status', 1)

            CreateDocument(formData)
                .then(res => {
                    this.$refs.MARKDOWN.$img2Url(pos, this.API + res[0].src)
                })
                .catch(() => {
                    delete this.images[pos]
                })
        },
        handleImageDel (pos) {
            delete this.images[pos]
        }
    }
}
</script>
