<template>
    <el-dialog
        width="500px"
        append-to-body
        destroy-on-close
        v-model="Visible"
        :title="title"
        :close-on-click-modal="false"
        @closed="handleClosed"
    >
        <el-form
            label-width="80px"
            ref="adminForm"
            v-loading="loading"
            :model="form"
            :rules="rules"
        >
            <el-form-item
                label="头像"
                prop="avatar"
            >
                <el-upload
                    class="avatar-uploader"
                    ref="avatar"
                    action="1"
                    accept="image/jpeg, image/png, image/jpg, image/gif"
                    :http-request="CreateUpload"
                    :show-file-list="false"
                >
                    <img
                        v-if="avatar != '' && avatar"
                        :src="avatar"
                        class="avatar"
                    />
                    <img
                        v-else
                        :src="defaultImg"
                        class="avatar"
                    />
                </el-upload>
            </el-form-item>
            <el-form-item
                v-if="isAdmin == false"
                label="角色"
                prop="role_id"
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
                    :readonly="form.admin_id != undefined"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="form.password"
                    type="password"
                    show-password
                ></el-input>
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
                v-if="isAdmin === false"
                prop="disable"
                label="可见性"
            >
                <el-radio-group v-model="form.disable">
                    <el-radio-button label="false">显示</el-radio-button>
                    <el-radio-button label="true">隐藏</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button @click="handleClosed">取 消</el-button>
                <el-button
                    type="primary"
                    :loading="isSubmit"
                    :disabled="disabled"
                    @click="handelInfo('adminForm')"
                >提 交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from "vuex"
import { CreateAdmin, ModifyAdmin } from '@/api/sys.user'
import { CreateDocument } from '@/api/sys.document'
import { cloneDeep } from 'lodash'
import util from '@/libs/util.js'
import defaultImg from '@/assets/3ea6beec64369c2642b92c6726f1epng.png'
import setting from '@/setting.js'
import useCurrentInstance from '@/proxy'

const { proxy } = useCurrentInstance()
const store = useStore()

const props = defineProps({
    title: {
        type: String,
        default: '个人中心'
    },
    params: {
        type: Object,
        required: true
    },
    role: {
        type: Array,
        default: []
    },
    centerDialogVisible: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    submit: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['callback', 'handleClose'])

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字之间',
            trigger: 'blur'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            min: 4,
            max: 32,
            message: '长度在 4 到 32 个字之间',
            trigger: 'blur'
        }
    ],
    email: [
        {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
        },
    ],
    role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
}
const Visible = ref(false)
const form = ref({
    sex: 1,
    disable: false,
})
const avatar = ref('')
const isSubmit = ref(false)
const loading = ref(false)
const imgLoad = ref(false)
const roleOption = ref([])
const API = ref('')
const disabled = ref(false)

computed({
    get () {
        API.value = store.getters('api/base') + '/API/v1/Document/GetDocument'
    }
})

watch(
    () => props.centerDialogVisible,
    (val) => {
        Visible.value = val
        if (val) {
            roleOption.value = props.role.map((i) => {
                if (i.mark == setting.SYS_ADMIN.mark) i.disabled = true
                return i
            })

            form.value = cloneDeep(props.params)
            if (form.value.avatar && form.value.avatar !== '') {
                avatar.value = API.value + form.value.avatar
            } else avatar.value = ''
        }
    },
    {
        immediate: true
    }
)

watch(
    () => props.submit,
    (val) => {
        disabled.value = val
    },
    {
        immediate: true
    }
)

function handelInfo (formName) {
    proxy.$refs[formName].validate((valid) => {
        if (valid) {
            isSubmit.value = true
            let params = form.value

            if (form.value.admin_id) {
                ModifyAdmin(params)
                    .then(res => {
                        if (res.is_self == true) {
                            util.updateUserInfo(res)
                            proxy.$message.success('编辑成功')
                            emits('callback', res.user)
                            isSubmit.value = false
                        } else handleInitParent(1)
                    })
                    .catch(() => {
                        isSubmit.value = false
                    })
            } else {
                CreateAdmin(params)
                    .then(res => {
                        handleInitParent(2)
                    })
                    .catch(() => {
                        isSubmit.value = false
                    })
            }
        }
    })
}

function handleInitParent (type) {
    proxy.$message.success(type == 1 ? '编辑成功' : '创建成功')
    emits('callback', true)
    isSubmit.value = false
}

function handleClosed () {
    emits('handleClose', false)
}

function CreateUpload (params) {
    const max = params.file.size / 1024 / 1024 < 2
    if (!max) {
        proxy.$message.error('头像图片大小不能超过 2MB!')
        proxy.$refs.avatar.uploadFiles = []
        return false
    }
    let formData = new FormData()
    formData.append('uid[]', [1])
    formData.append('document', params.file)
    formData.append('admin_id', util.cookies.get('uuid'))
    formData.append('status', 3)

    imgLoad.value = true
    CreateDocument(formData)
        .then((res) => {
            avatar.value = API.value + res[0].src
            form.value.avatar = res[0].src
            proxy.$refs.avatar.uploadFiles = []
            proxy.$message.success('头像上传成功')
            imgLoad.value = false
        })
        .catch(() => {
            imgLoad.value = false
        })
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
