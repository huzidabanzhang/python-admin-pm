<template>
    <el-dialog
        title="文档上传"
        width="460px"
        append-to-body
        destroy-on-close
        v-model="Visible"
        :before-close="handleClosed"
    >
        <el-upload
            class="upload"
            drag
            action="1"
            multiple
            ref="upload"
            :limit="maxLimit"
            :http-request="addUpload"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
        >
            <el-icon class="el-icon--upload">
                <upload-filled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
                <div class="el-upload__tip">最多上传{{ maxLimit }}个文件，且单文件不超过{{ maxSize }}MB</div>
            </template>
        </el-upload>

        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button style="float: left" type="primary" :loading="loading" @click="CreateUpload">上 传</el-button>
                <el-button @click="handleClosed">取 消</el-button>
                <el-button type="primary" @click="handleClosed">提 交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { CreateDocument } from '@/api/sys.document'
import { ref, watch } from 'vue'
import util from '@/libs/util'
import useCurrentInstance from '@/proxy'

const { _this } = useCurrentInstance()
const props = defineProps({
    centerDialogVisible: Boolean,
    folder_id: String
})
const emits = defineEmits(['handleClose'])

const maxLimit = 5
const maxSize = 5
const loading = ref(false)
const Visible = ref(false)
const fileList = ref({})

watch(
    () => props.centerDialogVisible,
    (val) => {
        Visible.value = val
        if (val) fileList.value = {}
    },
    { immediate: true }
)

function handleClosed() {
    let count = 0
    for (let i in fileList.value) {
        if (fileList.value[i].type === 'ready') count++
    }

    if (!loading.value) {
        if (count === 0) close()
        else
            _this
                .$confirm(`还有` + count + `个文件未上传，确定关闭嘛？`, '提醒', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    close()
                })
                .catch(() => {})
    }
}

function close() {
    emits('handleClose', {
        data: fileList.value,
        change: false
    })
}

function handleExceed(files, fileList) {
    let count = maxLimit - fileList.length
    _this.$message.warning(`您一次选择的文件过多，还能选择` + count + `个文件`)
}

function handleRemove(file) {
    if (fileList.value[file.uid]) delete fileList.value[file.uid]
}

function beforeUpload(file) {
    if (file.size > 1024 * 1024 * maxSize) {
        _this.$message.warning(`文件` + file.name + `超过了` + maxSize + `MB`)
        return false
    }
}

function addUpload(params) {
    fileList.value[params.file.uid] = {
        file: params.file,
        onSuccess: params.onSuccess,
        onProgress: params.onProgress,
        onError: params.onError,
        uid: params.file.uid,
        type: 'ready'
    }
}

function handelProgress(params) {
    for (let i in fileList.value) {
        fileList.value[i].onProgress(params)
    }
}

function CreateUpload() {
    let formData = new FormData() as any,
        uids = []

    for (let i in fileList.value) {
        if (fileList.value[i].type === 'ready') {
            formData.append('document', fileList.value[i].file)
            uids.push(fileList.value[i].uid)
        }
    }
    formData.append('uid[]', uids)
    formData.append('admin_id', util.cookies.get('uuid'))
    formData.append('folder_id', props.folder_id)
    formData.append('status', 1)

    if (formData.get('document') === null) return _this.$message.error('请选择上传文件')

    loading.value = true
    CreateDocument(formData, handelProgress)
        .then((res) => {
            res.map((i) => {
                if (i.res === 1) {
                    fileList.value[i.uid].onSuccess()
                    fileList.value[i.uid].type = 'success'
                }

                if (i.res === 2) {
                    fileList.value[i.uid].onError()
                    fileList.value[i.uid].type = 'error'
                }
            })
            loading.value = false
        })
        .catch(() => {
            loading.value = false
        })
}
</script>

<style>
.upload {
    text-align: center;
}
.el-upload-list {
    text-align: left;
}
</style>
