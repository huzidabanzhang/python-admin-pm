<template>
    <el-dialog
        title="文档上传"
        :visible.sync="Visible"
        width="460px"
        append-to-body
        destroy-on-close
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
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div
                class="el-upload__tip"
                slot="tip"
            >最多上传{{maxLimit}}个文件，且单文件不超过{{maxSize}}MB</div>
        </el-upload>

        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                type="primary"
                @click="CreateUpload"
                :loading="loading"
                style="float: left"
            >上 传</el-button>
            <el-button @click="handleClosed">取 消</el-button>
            <el-button
                type="primary"
                @click="handleClosed"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateDocument } from '@api/sys.document'
import util from '@/libs/util.js'
export default {
    props: {
        centerDialogVisible: Boolean,
        folder_id: String
    },
    data () {
        return {
            Visible: this.centerDialogVisible,
            fileList: {},
            loading: false,
            maxLimit: 5,
            maxSize: 5
        }
    },
    watch: {
        centerDialogVisible (newVal) {
            this.Visible = newVal
            if (newVal) this.fileList = {}
        }
    },
    methods: {
        handleClosed () {
            let count = 0
            for (let i in this.fileList) {
                if (this.fileList[i].type == 'ready') count++
            }

            if (!this.loading) {
                if (count == 0) this.close()
                else this.$confirm(`还有` + count + `个文件未上传，确定关闭嘛？`, '提醒', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.close()
                    })
                    .catch(() => { })
            }
        },
        close () {
            this.$emit('handleClose', {
                data: this.fileList,
                change: false
            })
        },
        handleExceed (files, fileList) {
            let count = this.maxLimit - fileList.length
            this.$message.warning(`您一次选择的文件过多，还能选择` + count + `个文件`)
        },
        handleRemove (file) {
            if (this.fileList[file.uid]) delete this.fileList[file.uid]
        },
        beforeUpload (file) {
            if (file.size > 1024 * 1024 * this.maxSize) {
                this.$message.warning(`文件` + file.name + `超过了` + this.maxSize + `MB`)
                return false
            }
        },
        addUpload (params) {
            this.fileList[params.file.uid] = {
                file: params.file,
                onSuccess: params.onSuccess,
                onProgress: params.onProgress,
                onError: params.onError,
                uid: params.file.uid,
                type: 'ready'
            }
        },
        handelProgress (params) {
            for (let i in this.fileList) {
                this.fileList[i].onProgress(params)
            }
        },
        CreateUpload () {
            let self = this, formData = new FormData(), uids = []
            for (let i in this.fileList) {
                if (this.fileList[i].type == 'ready') {
                    formData.append('document', this.fileList[i].file)
                    uids.push(this.fileList[i].uid)
                }
            }
            formData.append('uid[]', uids)
            formData.append('admin_id', util.cookies.get('uuid'))
            formData.append('folder_id', this.folder_id)
            formData.append('status', 1)

            if (formData.get('document') == null) return this.$message.error('请选择上传文件')

            this.loading = true
            CreateDocument(formData, this.handelProgress)
                .then(res => {
                    console.log(this.fileList)
                    res.map(i => {
                        console.log(i)
                        if (i.res == 1) {
                            this.fileList[i.uid].onSuccess()
                            this.fileList[i.uid].type = 'success'
                        }

                        if (i.res == 2) {
                            this.fileList[i.uid].onError()
                            this.fileList[i.uid].type = 'error'
                        }
                    })
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
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