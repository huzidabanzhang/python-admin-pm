<template>
    <el-dialog :title="title" :visible.sync="Visible" width="60%" append-to-body destroy-on-close
        @closed="handleClosed">
        <el-form label-width="80px" :model="form" :rules="rules" size="medium" v-loading="loading">
            <el-form-item label="角色名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单" class="el-form-width">
                <el-tree ref="treeMenu" :data="menu" :props="prop" node-key="menu_id" show-checkbox default-expand-all>
                </el-tree>
            </el-form-item>
            <el-form-item label="路由" class="el-form-width">
                <el-tree ref="treeRoute" :data="route" :props="prop" node-key="route_id" show-checkbox
                    default-expand-all>
                </el-tree>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClosed" size="medium">取 消</el-button>
            <el-button type="primary" @click="handelInfo" :loading="isSubmit" size="medium">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CreateRoute, ModifyRoute } from '@api/sys.route'
export default {
    props: {
        title: String,
        params: Object,
        centerDialogVisible: Boolean,
        parent: Array
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            form: { name: this.params.name },
            rules: {
                name: [
                    { required: true, message: '请输入角色名', trigger: 'blur' }
                ]
            },
            isSubmit: false,
            menu: [],
            route: [],
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
            this.form.name = this.params.name
        }
    },
    methods: {
        handelInfo() {
            let menu_id = [], route_id = [], checkKey = {
                menu: [],
                route: []
            }
            this.$refs.treeMenu.getCheckedNodes().map((i) => {
                checkKey['menu'].push(i.menu_id)
                return menu_id.push(i.menu_id)
            })
            this.$refs.treeMenu.getHalfCheckedNodes().map((i) => {
                return menu_id.push(i.menu_id)
            })
            this.$refs.treeRoute.getCheckedNodes().map((i) => {
                checkKey['route'].push(i.route_id)
                return route_id.push(i.route_id)
            })
            this.$refs.treeRoute.getHalfCheckedNodes().map((i) => {
                return route_id.push(i.route_id)
            })
            if (this.form.name == '') {
                this.$message({
                    message: '请输入角色名',
                    type: 'error',
                    duration: 3 * 1000
                })
                return true
            }

            this.isSubmit = true
            let params = {
                menu_id: menu_id,
                route_id: route_id,
                name: this.form.name,
                checkKey: JSON.stringify(checkKey)
            }

            if (this.params.role_id) {
                params['role_id'] = this.params.role_id
                ModifyRoute(params)
                    .then(async res => {
                        this.handleInitParent(1)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            } else {
                CreateRoute(params)
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
                message: type == 1 ? '角色编辑成功' : '角色创建成功',
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