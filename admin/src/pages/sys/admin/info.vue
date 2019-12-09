<template>
    <el-dialog
        :title="title"
        :visible.sync="Visible"
        width="40%"
        append-to-body
        destroy-on-close
        @closed="handleClosed"
    >
        <el-form
            label-width="80px"
            ref="adminForm"
            :model="form"
            :rules="rules"
            size="medium"
            v-loading="loading"
        >
            <el-form-item
                label="头像"
                prop="avatarUrl"
            >
                <el-upload
                    class="avatar-uploader"
                    :http-request="CreateUpload"
                    :show-file-list="false"
                    ref="avatarUrl"
                    action="1"
                    accept="image/jpeg, image/png, image/jpg"
                >
                    <img
                        v-if="avatarUrl != ''"
                        :src="avatarUrl"
                        class="avatar"
                    >
                    <img
                        v-else
                        :src="circleUrl"
                        class="avatar"
                    >
                </el-upload>
            </el-form-item>
            <el-form-item
                label="用户名"
                prop="username"
            >
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="form.password"
                    type="password"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="昵称"
                prop="nickname"
            >
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item
                label="性别"
                prop="sex"
            >
                <el-select
                    v-model="form.sex"
                    placeholder="请选择性别"
                >
                    <el-option
                        v-for="item in sexOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="角色"
                prop="role_id"
            >
                <el-select
                    v-model="form.role_id"
                    placeholder="请选择角色"
                >
                    <el-option
                        v-for="item in roleOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                @click="handleClosed"
                size="medium"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="handelInfo"
                :loading="isSubmit"
                size="medium"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateAdmin, ModifyAdmin } from '@api/sys.user'
import { CreateDocument, GetDocument } from '@api/sys.document'
import util from '@/libs/util.js'
import defaultImg from '@/assets/3ea6beec64369c2642b92c6726f1epng.png'
import { cloneDeep } from 'lodash'
export default {
    props: {
        title: String,
        params: Object,
        role: Array,
        centerDialogVisible: Boolean
    },
    data() {
        return {
            circleUrl: defaultImg,
            Visible: this.centerDialogVisible,
            form: {
                username: '',
                nickname: '',
                password: '',
                sex: 1,
                role_id: '',
                avatarUrl: ''
            },
            avatarUrl: '',
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 20, message: '长度在 4 到 20 个字之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 32, message: '长度在 4 到 32 个字之间', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                role_id: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ]
            },
            isSubmit: false,
            loading: false,
            img_load: false,
            sexOption: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ],
            roleOption: this.role,
            API: '/API/v1/Document/GetDocument/'
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) {
                this.roleOption = this.role.map((i) => {
                    if (i.value == 1) i.disabled = true
                    return i
                })
                this.form = cloneDeep(this.params)
                if (this.form.avatarUrl != '') {
                    this.avatarUrl = this.API + this.form.avatarUrl
                } else this.avatarUrl = ''
            }
        }
    },
    methods: {
        handelInfo() {
            let isError = false
            this.$refs.adminForm.validate((valid) => {
                if (!valid) {
                    isError = true
                    return false
                }
            })
            if (isError) return true

            this.isSubmit = true
            let params = this.form

            if (this.form.admin_id) {
                ModifyAdmin(params)
                    .then(async res => {
                        this.handleInitParent(1)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            } else {
                CreateAdmin(params)
                    .then(async res => {
                        this.handleInitParent(2)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            }
        },
        handleInitParent(type) {
            this.$message({
                message: type == 1 ? '管理员编辑成功' : '管理员创建成功',
                type: 'success',
                duration: 3 * 1000
            })
            this.$emit('callback', true)
            this.isSubmit = false
        },
        handleClosed() {
            this.$emit('handleClose', false)
        },
        CreateUpload(params) {
            const isLt2M = params.file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
                this.$refs.avatarUrl.uploadFiles = []
                return false
            }
            let self = this, formData = new FormData()
            formData.append('document', params.file)
            formData.append('admin_id', util.cookies.get('uuid'))
            formData.append('type', 1)

            this.img_load = true
            CreateDocument(formData)
                .then(async res => {
                    this.avatarUrl = this.API + res
                    this.form.avatarUrl = res
                    this.$refs.avatarUrl.uploadFiles = []
                    this.$message.success('上传头像成功')
                    this.img_load = false
                })
                .catch(() => {
                    this.img_load = false
                })
        }
    }
}
</script>

<style>
.el-form-width {
    width: 50%;
    display: inline-grid;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: block;
}
</style>