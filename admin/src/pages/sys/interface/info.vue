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
            label-width="100px"
            ref="adminForm"
            :model="form"
            :rules="rules"
            size="smaill"
            v-loading="loading"
        >
            <el-form-item
                label="名称"
                prop="name"
            >
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
                label="路由"
                prop="path"
            >
                <el-input v-model="form.path"></el-input>
            </el-form-item>
            <el-form-item
                label="请求方式"
                prop="method"
            >
                <el-select
                    v-model="form.method"
                    placeholder="请选择请求方式"
                >
                    <el-option
                        v-for="item in methodOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="描述"
                prop="description"
            >
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item
                label="标识"
                prop="mark"
            >
                <el-input
                    v-model="form.mark"
                    :disabled="form.interface_id != undefined"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="所属菜单"
                prop="menu_id"
            >
                <el-select
                    v-model="form.menu_id"
                    placeholder="请选择所属菜单"
                >
                    <el-option
                        v-for="item in menuOption"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="不允许禁用"
                prop="not_allow"
            >
                <el-switch v-model="form.not_allow" :disabled="form.interface_id != undefined"></el-switch>
            </el-form-item>
        </el-form>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                @click="handleClosed"
                size="smaill"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="handelInfo"
                :loading="isSubmit"
                size="smaill"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateInterface, ModifyInterface } from '@api/sys.interface'
import { cloneDeep } from 'lodash'
// 获取缓存菜单需要
import util from '@/libs/util.js'
export default {
    props: {
        title: String,
        params: Object,
        role: Array,
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            form: {
                name: '',
                path: '',
                method: 'GET',
                description: '',
                mark: '',
                menu_id: '',
                not_allow: false
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入路由', trigger: 'blur' }
                ],
                method: [
                    { required: true, message: '请选择请求方式', trigger: 'change' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' }
                ],
                mark: [
                    { required: true, message: '请输入标识', trigger: 'blur' }
                ],
                menu_id: [
                    { required: true, message: '请选择所属菜单', trigger: 'change' }
                ],
                not_allow: [
                    { required: true, message: '请选择', trigger: 'change' }
                ]
            },
            isSubmit: false,
            loading: false,
            methodOption: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' }
            ],
            menuOption: []
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) {
                // 菜单遍历
                let menus = util.getMenuTree()
                this.menuOption = []
                this.pushMenu(menus)

                this.form = cloneDeep(this.params)
            }
        }
    },
    methods: {
        pushMenu(ary) {
            ary.map((i) => {
                if (i.children && i.children.length > 0) {
                    this.pushMenu(i.children)
                } else this.menuOption.push(i)
            });
        },
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
            let params = this.form, interfaces = cloneDeep(this.$store.getters['d2admin/user/interfaces'])

            if (this.form.interface_id) {
                ModifyInterface(params)
                    .then(async res => {
                        interfaces.map((i, index) => {
                            if (i.interface_id == params.interface_id)
                                return interfaces[index] = params
                        })
                        util.initInterface(interfaces)
                        this.handleInitParent(1)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            } else {
                CreateInterface(params)
                    .then(async res => {
                        interfaces.push(res.data)
                        util.initInterface(interfaces)
                        this.handleInitParent(2)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            }
        },
        handleInitParent(type) {
            this.$message.success(type == 1 ? '接口编辑成功' : '接口创建成功')
            this.$emit('callback', true)
            this.isSubmit = false
        },
        handleClosed() {
            this.$emit('handleClose', false)
        }
    }
}
</script>

<style>
.el-form-width {
    width: 50%;
    display: inline-grid;
}
</style>