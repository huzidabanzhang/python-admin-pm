<template>
    <el-dialog
        title="工资导入"
        :visible.sync="Visible"
        width="460px"
        append-to-body
        destroy-on-close
        @closed="handleClosed"
    >

        <el-date-picker
            v-model="payment_time"
            type="month"
            placeholder="选择月"
            style="text-align: center;
            margin-bottom: 10px;
            margin-left: 100px;"
        >
        </el-date-picker>

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
        </el-upload>

        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                @click="handleClosed"
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
import { ImportWages } from '@api/wages.wages'
import util from '@/libs/util.js'
export default {
    props: {
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            fileList: {},
            payment_time: '',
            loading: false,
            maxLimit: 1,
            maxSize: 5
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) {
                this.fileList = {}
                let date = new Date()
                this.payment_time = date.getFullYear() + '-' + date.getMonth()
            }
        }
    },
    methods: {
        handleClosed() {
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
        close() {
            this.$emit('handleClose')
        },
        handleExceed(files, fileList) {
            let count = this.maxLimit - fileList.length
            this.$message.warning(`您一次选择的文件过多，还能选择` + count + `个文件`)
        },
        handleRemove(file) {
            if (this.fileList[file.uid]) delete this.fileList[file.uid]
        },
        beforeUpload(file) {
            if (file.size > 1024 * 1024 * this.maxSize) {
                this.$message.warning(`文件` + file.name + `超过了` + this.maxSize + `MB`)
                return false
            }
        },
        addUpload(params) {
            this.fileList[params.file.uid] = {
                file: params.file,
                onSuccess: params.onSuccess,
                onProgress: params.onProgress,
                onError: params.onError,
                uid: params.file.uid,
                type: 'ready'
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
                if (this.fileList[i].type == 'ready') {
                    formData.append('file', this.fileList[i].file)
                }
            }
            formData.append('payment_time', this.payment_time)

            this.loading = true
            ImportWages(formData, this.handelProgress)
                .then(async res => {
                    this.fileList[0].onSuccess()
                    this.loading = false
                    this.close()
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