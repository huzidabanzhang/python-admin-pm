<template>
    <el-dialog :title="title" :visible.sync="Visible" width="40%" append-to-body destroy-on-close
        @closed="handleClosed">
        <el-form label-width="80px" ref="adminForm" :model="form" :rules="rules" size="medium" v-loading="loading">
            <el-form-item label="头像" prop="avatarUrl">
                <el-avatar :size="50" :src="form.avatarUrl == '' ? circleUrl : form.avatarUrl"></el-avatar>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option v-for="item in sexOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="role_id">
                <el-select v-model="form.role_id" placeholder="请选择角色">
                    <el-option v-for="item in roleOption" :key="item.value" :label="item.label" :value="item.value"
                        :disabled="item.vlaue == 1">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClosed" size="medium">取 消</el-button>
            <el-button type="primary" @click="handelInfo" :loading="isSubmit" size="medium">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateAdmin, ModifyAdmin } from '@api/sys.user'
import defaultImg from '@/assets/3ea6beec64369c2642b92c6726f1epng.png'
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
                password: '',
                nickname: '',
                sex: 1,
                role_id: '',
                avatarUrl: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 20, message: '长度在 4 到 20 个字之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 20, message: '长度在 8 到 20 个字之间', trigger: 'blur' }
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
            sexOption: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ],
            roleOption: this.role
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            this.roleOption = this.role
            this.form = this.params
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
            let params = {
                menu_id: menu_id,
                route_id: route_id,
                name: this.form.name,
                checkKey: JSON.stringify(checkKey)
            }

            if (JSON.stringify(this.params) != '{}') {
                params['admin_id'] = this.params.admin_id
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
        }
    }
}
</script>

<style scoped>
.el-form-width {
    width: 50%;
    display: inline-grid;
}
</style>