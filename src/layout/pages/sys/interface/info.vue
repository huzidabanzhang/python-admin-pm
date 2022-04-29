<template>
    <el-dialog
        v-model="Visible"
        width="600px"
        append-to-body
        :title="title"
        :close-on-click-modal="false"
        @closed="handleClosed"
    >
        <el-form label-width="100px" ref="interfaceForm" v-loading="loading" :model="form" :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="路由" prop="path">
                <el-input v-model="form.path"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="method">
                <el-select v-model="form.method" placeholder="请选择请求方式">
                    <el-option v-for="item in methodOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="标识" prop="mark">
                <el-input v-model="form.mark" :readonly="!form.interface_id"></el-input>
            </el-form-item>
            <el-form-item label="所属菜单" prop="menus">
                <el-select multiple placeholder="请选择所属菜单" class="inherit" v-model="form.menus">
                    <el-option v-for="item in menuOption" :key="item.id" :label="item.title" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属角色" prop="roles">
                <el-select
                    multiple
                    placeholder="请选择所属角色"
                    class="inherit"
                    v-model="form.roles"
                    v-default="[form.roles, roleOption, 'role_id', def]"
                >
                    <el-option
                        v-for="item in roleOption"
                        :key="item.role_id"
                        :label="item.name"
                        :value="item.role_id"
                        :disabled="item.role_id === def"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="disable" label="可见性">
                <el-switch v-model="form.disable" :active-value="false" :inactive-value="true" />
            </el-form-item>
            <el-form-item v-if="form.interface_id" label="是否可隐藏" prop="forbid">
                <el-switch v-model="form.forbid"></el-switch>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button @click="handleClosed">取 消</el-button>
                <el-button type="primary" :loading="isSubmit" :disabled="btn" @click="handelInfo(interfaceForm)"
                    >提 交</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { CreateInterface, ModifyInterface } from '@/api/sys.interface'
import { cloneDeep } from 'lodash'
import { ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import util from '@/libs/util'
import type { FormInstance, FormRules } from 'element-plus'
import useCurrentInstance from '@/proxy'

const { _this } = useCurrentInstance()
const store = useStore()
const props = defineProps({
    title: String,
    params: Object,
    role: Array,
    centerDialogVisible: Boolean,
    submit: Boolean,
    menus: Array,
    def: String,
    roles: Array
})
const emits = defineEmits(['callback', 'handleClose'])
const interfaceForm = ref<FormInstance>()
const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由', trigger: 'blur' }],
    method: [
        {
            required: true,
            message: '请选择请求方式',
            trigger: 'change'
        }
    ],
    description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    mark: [{ required: true, message: '请输入标识', trigger: 'blur' }],
    menus: [
        {
            required: true,
            message: '请选择所属菜单',
            trigger: 'change'
        }
    ],
    roles: [
        {
            required: true,
            message: '请选择所属角色',
            trigger: 'change'
        }
    ]
})
const methodOption = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' }
]
const Visible = ref(false)
const isSubmit = ref(false)
const loading = ref(false)
const btn = ref(false)
const menuOption = ref([])
const roleOption = ref([])
const form = ref({
    roles: []
}) as any

watch(
    () => props.centerDialogVisible,
    (val) => {
        Visible.value = val
        if (val) {
            menuOption.value = props.menus
            roleOption.value = props.roles
            form.value = cloneDeep(props.params)
            setTimeout(() => {
                interfaceForm.value.clearValidate()
            })
        }
    },
    { immediate: true }
)

watch(
    () => props.submit,
    (val) => {
        btn.value = val
    },
    { immediate: true }
)

function handelInfo(formEl: FormInstance) {
    formEl.validate((valid) => {
        if (valid) {
            isSubmit.value = true
            let interfaces = cloneDeep(store.getters['user/interfaces'])

            if (form.value.interface_id) {
                ModifyInterface(form.value)
                    .then(async (res) => {
                        interfaces.map((i, index) => {
                            if (i.interface_id === form.value.interface_id) return (interfaces[index] = form.value)
                        })
                        util.initInterface(interfaces)
                        handleInitParent('接口编辑成功')
                    })
                    .catch(() => {
                        isSubmit.value = false
                    })
            } else {
                CreateInterface(form.value)
                    .then(async (res) => {
                        interfaces.push(res)
                        util.initInterface(interfaces)
                        handleInitParent('接口创建成功')
                    })
                    .catch(() => {
                        isSubmit.value = false
                    })
            }
        }
    })
}

function handleInitParent(title) {
    _this.$message.success(title)
    emits('callback', true)
    isSubmit.value = false
}

function handleClosed() {
    emits('handleClose', false)
}
</script>

<style>
.el-form-width {
    width: 50%;
    display: inline-grid;
}
</style>

<style scoped>
.inherit {
    display: inherit;
}
</style>
