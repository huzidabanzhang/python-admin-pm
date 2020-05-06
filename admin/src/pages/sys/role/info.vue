<template>
    <el-dialog
        :title="title"
        :visible.sync="Visible"
        width="50%"
        append-to-body
        destroy-on-close
        :close-on-click-modal="false"
        @closed="handleClosed"
    >
        <el-form
            label-width="80px"
            :model="form"
            :rules="rules"
            size="mini"
            v-loading="loading"
            ref="roleForm"
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
                    :disabled="form.role_id != undefined"
                ></el-input>
            </el-form-item>
            <el-form-item
                prop="is_disabled"
                label="可见性"
            >
                <el-radio-group v-model="form.is_disabled">
                    <el-radio-button label="false">显示</el-radio-button>
                    <el-radio-button label="true">隐藏</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单">
                <el-tree
                    ref="treeMenu"
                    :data="menu"
                    :props="prop"
                    :default-checked-keys="select"
                    node-key="menu_id"
                    show-checkbox
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
                size="mini"
                style="float: left;"
                v-if="params.role_id"
                :disabled="btn_del"
            ></el-button>
            <el-button
                @click="handleClosed"
                size="mini"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="handelInfo('roleForm')"
                :loading="isSubmit"
                :disabled="btn_add"
                size="mini"
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
        centerDialogVisible: Boolean,
        submit: Boolean,
        del: Boolean
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
            },
            btn_add: this.submit,
            btn_del: this.del,
            select: []
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) {
                this.form = cloneDeep(this.params)
                this.getMenuList()
            }
        },
        submit(newVal) {
            this.btn_add = newVal
        },
        del(newVal) {
            this.btn_del = newVal
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
                        this.select = res.select
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
        handelInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let role_list = []
                    this.$refs.treeMenu.getCheckedNodes().forEach((i) => {
                        if (i.type != 'MENU') role_list.push(i.menu_id)
                    })
                    this.$refs.treeMenu.getHalfCheckedNodes().forEach((i) => {
                        if (i.type != 'MENU') role_list.push(i.menu_id)
                    })

                    this.isSubmit = true
                    let params = {
                        role_list: role_list,
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
                }
            })
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