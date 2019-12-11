<template>
    <el-dialog
        title="文档上传"
        :visible.sync="Visible"
        width="460px"
        append-to-body
        destroy-on-close
        @closed="handleClosed"
    >
        <el-upload
            class="upload"
            drag
            action="1"
            multiple
            ref="upload"
            :limit="5"
            :http-request="addUpload"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div
                class="el-upload__tip"
                slot="tip"
            >最多上传5个文件，且单文件不超过5MB</div>
        </el-upload>

        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                @click="Visible = false"
                size="mini"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="CreateUpload"
                size="mini"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateDocument } from '@api/sys.document'
import util from '@/libs/util.js'
export default {
    props: {
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            fileList: {}
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) this.fileList = {}
        }
    },
    methods: {
        handleClosed() {
            this.$emit('handleClose', false)
        },
        handleExceed(files, fileList) {
            console.log(files)
        },
        handleRemove(file, fileList) {
            console.log(file)
        },
        beforeUpload(file) {
            console.log(file)
            // return false
        },
        addUpload(params) {
            console.log(params)
            this.fileList[params.file.uid] = {
                file: params.file,
                onSuccess: params.onSuccess,
                onProgress: params.onProgress,
                onError: params.onError
            }
        },
        handelProgress(params) {
            for (let i in this.fileList) {
                this.fileList[i].onProgress(params)
            }
        },
        CreateUpload() {
            let self = this, formData = new FormData()
            for (let i in this.fileList) {
                formData.append('document', this.fileList[i].file)
            }
            formData.append('admin_id', util.cookies.get('uuid'))
            formData.append('type', 1)

            this.img_load = true
            CreateDocument(formData, this.handelProgress)
                .then(async res => {
                    
                    // this.avatarUrl = this.API + res
                    // this.form.avatarUrl = res
                    // this.$refs.avatarUrl.uploadFiles = []
                    // this.$message.success('上传头像成功')
                    // this.img_load = false
                })
                .catch(() => {
                    // this.img_load = false
                })
        }
    }
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