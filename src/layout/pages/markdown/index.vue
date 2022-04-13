<template>
    <md-editor
        style="height: 100%"
        v-model="value"
        @onUploadImg="handleImageCreate"
        @onSave="handleSave"
    />
</template>

<script setup>
import { CreateDocument } from '@api/sys.document'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import util from '@/libs/util.js'
import useCurrentInstance from '@/proxy'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const { proxy } = useCurrentInstance()
const store = useStore()
const props = defineProps({
    content: String,
    save: {
        type: Function,
        default: null
    }
})

const value = ref('')
const API = store.getters['api/base'] + '/API/v1/Document/GetDocument'

watch(
    () => props.content,
    (val) => {
        value.value = val
    },
    { immediate: true }
)

function handleSave (value, render) {
    proxy.$message.warning('功能暂不开放')
}

async function handleImageCreate (files, callback) {
    const res = await Promise.all(
        Array.from(files).map((file) => {
            return new Promise((rev, rej) => {
                const formData = new FormData()
                formData.append('uid[]', [1])
                formData.append('document', file)
                formData.append('admin_id', util.cookies.get('uuid'))
                formData.append('status', 1)

                CreateDocument(formData)
                    .then((res) => rev(res))
                    .catch((error) => rej(error))
            })
        })
    );

    callback(res.map((item) => item.data.url))
}
</script>