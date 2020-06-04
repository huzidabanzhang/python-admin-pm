<template>
    <el-dialog
        :title="title"
        :visible.sync="Visible"
        width="500px"
        append-to-body
        destroy-on-close
        :close-on-click-modal="false"
        @closed="handleClosed"
    >
        <el-form
            label-width="80px"
            ref="adminForm"
            :model="form"
            :rules="rules"
            v-loading="loading"
        >
            <el-form-item
                label="头像"
                prop="avatar"
            >
                <el-upload
                    class="avatar-uploader"
                    :http-request="CreateUpload"
                    :show-file-list="false"
                    ref="avatar"
                    action="1"
                    accept="image/jpeg, image/png, image/jpg"
                >
                    <img
                        v-if="avatar != '' && avatar"
                        :src="avatar"
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
                label="角色"
                prop="role_id"
                v-if="isTab == false"
            >
                <el-select
                    v-model="form.role_id"
                    placeholder="请选择角色"
                >
                    <el-option
                        v-for="item in roleOption"
                        :key="item.role_id"
                        :label="item.name"
                        :value="item.role_id"
                        :disabled="item.disabled"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="用户名"
                prop="username"
            >
                <el-input
                    v-model="form.username"
                    :disabled="form.admin_id != undefined"
                ></el-input>
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
                label="邮箱"
                prop="email"
            >
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item
                label="性别"
                prop="sex"
            >
                <el-radio-group v-model="form.sex">
                    <el-radio-button label="1">男</el-radio-button>
                    <el-radio-button label="2">女</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                prop="disable"
                label="可见性"
            >
                <el-radio-group v-model="form.disable">
                    <el-radio-button label="false">显示</el-radio-button>
                    <el-radio-button label="true">隐藏</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="handleClosed">取 消</el-button>
            <el-button
                type="primary"
                @click="handelInfo('adminForm')"
                :loading="isSubmit"
                :disabled="btn"
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
import setting from '@/setting.js'
export default {
    props: {
        title: String,
        params: Object,
        role: Array,
        centerDialogVisible: Boolean,
        isTab: Boolean,
        submit: Boolean
    },
    data () {
        return {
            circleUrl: defaultImg,
            Visible: this.centerDialogVisible,
            form: {
                sex: 1,
                disable: false
            },
            avatar: '',
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 20, message: '长度在 4 到 20 个字之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 32, message: '长度在 4 到 32 个字之间', trigger: 'blur' }
                ],
                email: [
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                role_id: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ]
            },
            isSubmit: false,
            loading: false,
            img_load: false,
            roleOption: this.role,
            API: this.$store.state.chubby.api.base + '/API/v1/Document/GetDocument/',
            btn: this.submit
        }
    },
    watch: {
        centerDialogVisible (newVal) {
            this.Visible = newVal
            if (newVal) {
                this.roleOption = this.role.map((i) => {
                    if (i.mark == setting.SYS_ADMIN.mark) i.disabled = true
                    return i
                })
                this.form = cloneDeep(this.params)
                if (this.form.avatar && this.form.avatar != '') {
                    this.avatar = this.API + this.form.avatar
                } else this.avatar = ''
            }
        },
        submit (newVal) {
            this.btn = newVal
        }
    },
    methods: {
        handelInfo (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isSubmit = true
                    let params = this.form

                    if (this.form.admin_id) {
                        ModifyAdmin(params)
                            .then(async res => {
                                if (res.is_self == true) {
                                    util.updateUserInfo(res)
                                    this.$message.success('管理员编辑成功')
                                    this.$emit('callback', res.user)
                                    this.isSubmit = false
                                } else this.handleInitParent(1)
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
                }
            })
        },
        handleInitParent (type) {
            this.$message.success(type == 1 ? '管理员编辑成功' : '管理员创建成功')
            this.$emit('callback', true)
            this.isSubmit = false
        },
        handleClosed () {
            this.$emit('handleClose', false)
        },
        CreateUpload (params) {
            const max = params.file.size / 1024 / 1024 < 2
            if (!max) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
                this.$refs.avatar.uploadFiles = []
                return false
            }
            let formData = new FormData()
            formData.append('uid[]', [1])
            formData.append('document', params.file)
            formData.append('admin_id', util.cookies.get('uuid'))
            formData.append('status', 1)

            this.img_load = true
            CreateDocument(formData)
                .then(res => {
                    this.avatar = this.API + res[0].src
                    this.form.avatar = res[0].src
                    this.$refs.avatar.uploadFiles = []
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