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
            :http-request="CreateUpload"
            action="1"
            multiple
            ref="upload"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div
                class="el-upload__tip"
                slot="tip"
            >只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>

        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="Visible = false" size="mini">取 消</el-button>
            <el-button
                type="primary"
                @click="Visible = false"
                size="mini"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateDocument } from '@api/sys.document'
export default {
    props: {
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
        }
    },
    methods: {
        handleClosed() {
            this.$emit('handleClose', false)
        },
        CreateUpload(params) {
            console.log(params)
            // const isLt2M = params.file.size / 1024 / 1024 < 2
            // if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 2MB!')
            //     this.$refs.avatarUrl.uploadFiles = []
            //     return false
            // }
            // let self = this, formData = new FormData()
            // formData.append('document', params.file)
            // formData.append('admin_id', util.cookies.get('uuid'))
            // formData.append('type', 1)

            // this.img_load = true
            // CreateDocument(formData)
            //     .then(async res => {
            //         this.avatarUrl = this.API + res
            //         this.form.avatarUrl = res
            //         this.$refs.avatarUrl.uploadFiles = []
            //         this.$message.success('上传头像成功')
            //         this.img_load = false
            //     })
            //     .catch(() => {
            //         this.img_load = false
            //     })
        }
    }
}
</script>

<style scoped>
.upload {
    text-align: center;
}
</style>