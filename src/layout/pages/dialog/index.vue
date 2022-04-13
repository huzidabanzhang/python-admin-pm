<template>
    <el-dialog
        width="50%"
        append-to-body
        center
        destroy-on-close
        :title="title"
        v-model="Visible"
        @closed="handleClosed"
    >
        <div style="min-height: 300px">{{ content }}</div>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    centerDialogVisible: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['handleClose'])
const Visible = ref(false)

watch(
    () => props.centerDialogVisible,
    (val) => {
        Visible.value = val
    },
    {
        immediate: true
    }
)

function handleClosed () {
    emits('handleClose', false)
}
</script>
