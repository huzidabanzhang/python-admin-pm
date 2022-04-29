<template>
    <admin-container>
        <div slot="header">
            <el-radio-group v-model="value" @change="handleChange">
                <el-radio-button v-for="(name, key) in data" :label="name" :key="key"></el-radio-button>
            </el-radio-group>
        </div>

        <Preview ref="MARK_PREVIEW" :content="content" :callback="loadingInstance"></Preview>
    </admin-container>
</template>

<script setup lang="ts">
import { GetReadmeContent } from '@api/sys.base'
import { ref, onMounted } from 'vue'
import { html } from '/README.md'
import Preview from '@/layout/pages/markdown/preview.vue'
import useCurrentInstance from '@/proxy'

const { _this } = useCurrentInstance()
const data = ['vue-admin', 'python-admin']
const value = ref('vue-admin')
const content = ref('')
const markPreview = ref<HTMLElement>()
let loadingInstance = {} as any

function handleChange() {
    loadingInstance = _this.$loading(_this.loadOption('', markPreview.value, false))

    if (value.value == 'vue-admin') {
        content.value = html
    } else {
        GetReadmeContent()
            .then(async (res) => {
                content.value = res.content
            })
            .catch(() => {
                loadingInstance.close()
            })
    }
}

onMounted(() => {
    handleChange()
})
</script>
