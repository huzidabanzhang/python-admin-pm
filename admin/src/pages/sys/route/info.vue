<template>
    <el-dialog :title="title" :visible.sync="Visible" width="50%" append-to-body destroy-on-close
        @closed="handleClosed">
        <el-form label-width="80px" :model="form" :rules="rules" size="medium" v-loading="loading">
            <el-form-item label="路由名称" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="上级路由">
                <el-cascader :options="parent" :props="prop" :show-all-levels="false" v-model="form.parentId" clearable
                    filterable></el-cascader>
            </el-form-item>
            <el-form-item label="路径" prop="path">
                <el-input v-model="form.path"></el-input>
            </el-form-item>
            <el-form-item label="组件" prop="component">
                <el-input v-model="form.component"></el-input>
            </el-form-item>
            <el-form-item label="组件路径" prop="componentPath">
                <el-input v-model="form.componentPath"></el-input>
            </el-form-item>
            <el-form-item label="是否缓存" prop="cache">
                <el-select placeholder="请选择" v-model="form.cache">
                    <el-option v-for="item in cacheOption" :key="item.value" :label="item.label" :value="item.value">
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
import { CreateRoute, ModifyRoute } from '@api/sys.route'
import { cloneDeep } from 'lodash'
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
            form: {},
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                title: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
                component: [{ required: true, message: '请输入组件', trigger: 'blur' }],
                componentPath: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
                cache: [{ required: true, message: '请选择是否缓存', trigger: 'blur' }]
            },
            cacheOption: [
                { label: '启用', value: true },
                { label: '禁用', value: false }
            ],
            isSubmit: false,
            loading: false,
            prop: { checkStrictly: true, value: 'route_id', label: 'title', emitPath: false }
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            this.form = cloneDeep(this.params)  
        }
    },
    methods: {
        handelInfo() {
            this.isSubmit = true
            if (this.form.parentId == null) this.form.parentId = '0'
            if (this.form.route_id) {
                ModifyRoute(this.form)
                    .then(async res => {
                        this.handleInitParent(1)
                    })
                    .catch(() => {
                        this.isSubmit = false
                    })
            } else {
                CreateRoute(this.form)
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