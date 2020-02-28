<template>
    <el-dialog
        :title="title"
        :visible.sync="Visible"
        width="50%"
        append-to-body
        destroy-on-close
        @closed="handleClosed"
    >
        <el-form
            label-width="80px"
            :model="form"
            :rules="rules"
            size="smaill"
            v-loading="loading"
        >
            <el-form-item
                label="角色名"
                prop="name"
            >
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
                label="标识"
                prop="mark"
            >
                <el-input 
                    v-model="form.mark"
                    :disabled="!form.admin_id"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="菜单"
            >
                <el-tree
                    ref="treeMenu"
                    :data="menu"
                    :props="prop"
                    node-key="menu_id"
                    show-checkbox
                    default-expand-all
                >
                    <span
                        class="custom-tree-node"
                        slot-scope="{ node, data }"
                    >
                        <span>
                            ({{data.type == 'MENU' ? `菜单` : `接口`}}) {{ data.title }}
                        </span>
                    </span>
                </el-tree>
            </el-form-item>
        </el-form>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delRole"
                size="smaill"
                style="float: left;"
                v-if="params.role_id"
            ></el-button>
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
import { QueryMenuByParam } from '@api/sys.menu'
import { CreateRole, ModifyRole, DelRole } from '@api/sys.role'
import { cloneDeep } from 'lodash'
export default {
    props: {
        title: String,
        params: Object,
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            form: { name: this.params.name },
            rules: {
                name: [
                    { required: true, message: '请输入角色名', trigger: 'blur' }
                ],
                mark: [
                    { required: true, message: '请输入标识', trigger: 'blur' }
                ]
            },
            isSubmit: false,
            menu: [],
            interface: [],
            loading: false,
            prop: {
                label: 'title',
                children: 'children'
            }
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) {
                this.form = cloneDeep(this.params)
                this.getMenuList()
            }
        }
    },
    methods: {
        getMenuList() {
            this.menu = []
            this.interface = []

            let params = {
                is_interface: true
            }
            if (this.params.role_id) params['role_id'] = this.params.role_id

            this.loading = true
            QueryMenuByParam(params)
                .then(async res => {
                    this.dealData(res.data)
                    this.$nextTick(() => {
                        this.$refs.treeMenu.setCheckedKeys(res.select, false)
                    })
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        dealData(data) {
            while (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].pid == '0') {
                        this.menu.push(data[i])
                        data.splice(i, 1)
                        i--
                    } else {
                        let index = this.menu.findIndex(item => item.menu_id == data[i].pid)
                        if (index == -1) continue
                        this.menu[index].children.push(data[i])
                        data.splice(i, 1)
                        i--
                    }
                }
            }
        },
        handelInfo() {
            let menu_id = [], interface_id = []
            this.$refs.treeMenu.getCheckedNodes().map((i) => {
                return i.type == 'MENU' ? menu_id.push(i.menu_id) : interface_id.push(i.menu_id)
            })
            this.$refs.treeMenu.getHalfCheckedNodes().map((i) => {
                return i.type == 'MENU' ? menu_id.push(i.menu_id) : interface_id.push(i.menu_id)
            })

            if (this.form.name == '') return this.$message.error('请输入角色名')

            if (this.form.mark == '') this.$message.error('请输入标识')

            this.isSubmit = true
            let params = {
                menu_id: menu_id,
                interface_id: interface_id,
                name: this.form.name,
                mark: this.form.mark
            }

            if (this.params.role_id) {
                params['role_id'] = this.params.role_id
                ModifyRole(params)
                    .then(async res => {
                        this.handleInitParent(1)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            } else {
                CreateRole(params)
                    .then(async res => {
                        this.handleInitParent(2)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            }
        },
        handleInitParent(type) {
            this.$message.success(type == 1 ? '角色编辑成功' : '角色创建成功')
            this.$emit('callback', true)
            this.isSubmit = false
        },
        handleClosed() {
            this.$emit('handleClose', false)
        },
        delRole() {
            this.$confirm('确定要删除该角色吗', '删除角色',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelRole({
                        role_id: [this.params.role_id]
                    }).then(async res => {
                        this.$message.success('删除角色成功')
                        this.$emit('callback', true)
                    })
                })
        }
    }
}
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
}
</style>

<style>
.el-tree-node__content {
    line-height: 30px;
    height: 30px;
}
</style>