<template>
    <el-dialog
        title="备份数据库"
        width="400px"
        append-to-body
        destroy-on-close
        v-model="Visible"
        @closed="handleClosed"
    >
        <el-form label-width="80px" :model="form" :rules="rules">
            <el-form-item label="备份方式" prop="type">
                <el-select v-model="form.type">
                    <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button @click="handleClosed">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="exportSql">提 交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ExportSql } from '@/api/sys.base'
import { cloneDeep } from 'lodash'
import { ref, watch } from 'vue'

const props = defineProps({
    params: Object,
    centerDialogVisible: Boolean
})
const emits = defineEmits(['handleClose'])

const rules = {
    type: [{ required: true, message: '请选择备份方式', trigger: 'change' }]
}
const typeOption = [
    { label: '数据加表结构', value: 1 },
    { label: '表结构不包含数据', value: 2 },
    { label: '数据不包含表结构', value: 3 }
]
const Visible = ref(false)
const loading = ref(false)
const form = ref({
    type: 1
}) as any

watch(
    () => props.centerDialogVisible,
    (val) => {
        Visible.value = val
        if (val) form.value = cloneDeep(props.params)
    },
    { immediate: true }
)

function handleClosed() {
    emits('handleClose', false)
}

function exportSql() {
    loading.value = true
    ExportSql({
        type: form.value.type
    })
        .then((response) => {
            const href = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
            let downloadElement = document.createElement('a')
            downloadElement.href = href
            downloadElement.download = response.headers.filename //下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() //点击下载
            document.body.removeChild(downloadElement) //下载完成移除元素
            window.URL.revokeObjectURL(href) //释放blob对象
            loading.value = false
            emits('handleClose', false)
        })
        .catch(() => {
            loading.value = false
        })
}
</script>
