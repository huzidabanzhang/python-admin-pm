<template>
    <admin-container>
        <template v-slot:header>
            <div>
                <el-button
                    circle
                    type="primary"
                    title="新增"
                    :icon="Plus"
                    :disabled="auth.add"
                    v-auth:add_menu
                    @click="getMenuItem()"
                >
                </el-button>
                <el-button circle title="刷新" :icon="RefreshRight" @click="init()"></el-button>
            </div>
        </template>

        <el-tree
            v-loading="loading"
            node-key="menu_id"
            default-expand-all
            :data="menuData"
            :props="tree_prop"
            :expand-on-click-node="false"
            @node-click="getMenuItem"
        >
            <template #default="{ node, data }">
                <span class="custom-tree-node" :class="{ disable: data.disable }">
                    <span class="label"><i :class="'fa fa-' + data.icon"></i>{{ node.label }}</span>
                </span>
            </template>
        </el-tree>

        <el-card class="box-card" v-loading="formLoad">
            <template v-slot:header>
                <div class="clearfix">
                    <span>{{ !form.menu_id ? '新建菜单' : '编辑菜单' }}</span>
                </div>
            </template>
            <el-form ref="SYSMENU" label-width="80px" :model="form" :rules="rules">
                <el-form-item label="图标" prop="icon">
                    <admin-icon-select v-model:value="form.icon" />
                </el-form-item>
                <el-form-item label="菜单名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="路由名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="mark">
                    <el-input v-model="form.mark" :readonly="!form.menu_id"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                    <el-select
                        multiple
                        placeholder="请选择"
                        v-model="form.roles"
                        v-default="[form.roles, roleData, 'role_id', roleDefault]"
                    >
                        <el-option
                            v-for="item in roleData"
                            :key="item.role_id"
                            :label="item.name"
                            :value="item.role_id"
                            :disabled="item.role_id === roleDefault"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级菜单" prop="pid">
                    <el-cascader
                        :options="treeData"
                        :props="menu_prop"
                        :show-all-levels="false"
                        v-model="form.pid"
                        filterable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item prop="component" label="路由组件">
                    <el-input v-model="form.component"></el-input>
                </el-form-item>
                <el-form-item prop="componentPath" label="组件路径">
                    <el-input v-model="form.componentPath"></el-input>
                </el-form-item>
                <el-form-item prop="cache" label="路由缓存">
                    <el-switch v-model="form.cache" :active-value="true" :inactive-value="false" />
                </el-form-item>
                <el-form-item prop="disable" label="可见性">
                    <el-switch
                        v-model="form.disable"
                        :disabled="!isHidden(form.mark)"
                        :active-value="false"
                        :inactive-value="true"
                    />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item v-if="!form.menu_id">
                    <el-button
                        type="primary"
                        :icon="Check"
                        :disabled="auth.add"
                        v-auth:add_menu
                        @click="submit('SYSMENU')"
                        >保 存</el-button
                    >
                </el-form-item>

                <el-form-item v-else>
                    <el-button
                        type="primary"
                        :icon="Check"
                        :disabled="auth.set"
                        v-auth:set_menu
                        @click="submit('SYSMENU')"
                        >保 存</el-button
                    >
                    <el-button
                        v-if="isHidden(form.mark)"
                        type="danger"
                        :icon="Delete"
                        :disabled="auth.del"
                        v-auth:del_menu
                        @click="delMenu(form.menu_id)"
                        >删 除</el-button
                    >
                    <el-button :icon="DocumentCopy" @click="copy_this">复 制 </el-button>
                    <el-button
                        :icon="Position"
                        :disabled="auth.interface"
                        v-auth:interface_menu
                        @click="getMenuToInterface(form.title, form.menu_id)"
                        >关联接口</el-button
                    >
                </el-form-item>
            </el-form>
        </el-card>

        <el-dialog ref="menuToInter" width="1000px" :title="dialogTitle" v-model="dialogTableVisible">
            <el-table :data="interfaceData" v-loading="dialogLoading">
                <el-table-column prop="name" label="名称" align="left"> </el-table-column>
                <el-table-column prop="path" label="路由" align="left"> </el-table-column>
                <el-table-column prop="method" label="请求方式" align="center"> </el-table-column>
                <el-table-column prop="description" label="描述" align="left"> </el-table-column>
                <el-table-column prop="mark" label="标识" align="left" width="150">
                    <template #default="scope">
                        <el-tag>{{ scope.row.mark }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="disable" label="可见性" align="center" width="100">
                    <template #default="scope">
                        <el-tag v-if="!scope.row.disable" type="success">显示</el-tag>
                        <el-tag v-else type="info">隐藏</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </admin-container>
</template>

<script setup lang="ts">
import { Plus, RefreshRight, Check, Delete, DocumentCopy, Position } from '@element-plus/icons-vue'
import { QueryMenuByParam, CreateMenu, ModifyMenu, LockMenu, DelMenu, GetMenuToInterface } from '@/api/sys.menu'
import { QueryRoleByParam } from '@/api/sys.role'
import { cloneDeep } from 'lodash'
import { ref, reactive, onMounted } from 'vue'
import util from '@/libs/util'
import setting from '@/setting'
import useCurrentInstance from '@/proxy'

const { proxy } = useCurrentInstance() as any

const tree_prop = {
    label: 'title',
    children: 'children'
}
const menu_prop = {
    value: 'menu_id',
    label: 'title',
    emitPath: false,
    checkStrictly: true
}
const rules = {
    title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
    mark: [{ required: true, message: '请输入标识', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
    sort: [
        { required: true, message: '请输入排序', trigger: 'blur' },
        { type: 'number', message: '排序必须为数字值' }
    ],
    icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
    component: [{ required: true, message: '请输入路由组件', trigger: 'blur' }],
    componentPath: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    cache: [{ required: true, message: '请选择路由缓存', trigger: 'blur' }],
    roles: [{ required: true, message: '请选择角色', trigger: 'blur' }]
}
const auth = reactive({
    add: false,
    set: false,
    interface: false,
    del: false
})
const menuData = ref([])
const treeData = ref([])
const roleData = ref([])
const interfaceData = ref([])
const loading = ref(false)
const formLoad = ref(false)
const dialogTableVisible = ref(false)
const dialogLoading = ref(false)
const form = ref({
    cache: true,
    disable: false,
    sort: 1,
    roles: []
}) as any
const roleDefault = ref(null)
const dialogTitle = ref('')

function init(visible = false) {
    loading.value = true

    util.axiosAll(
        [
            QueryMenuByParam({}),
            QueryRoleByParam({
                is_default: true
            })
        ],
        (res) => {
            menuData.value = util.getMenuTree(false, cloneDeep(res[0]))
            treeData.value = cloneDeep(menuData.value)
            if (visible) util.initMenu(res[0], true)

            roleData.value = res[1].data
            roleDefault.value = res[1].default

            loading.value = false
        },
        (err) => {
            loading.value = false
        }
    )
}

function isHidden(mark) {
    return !setting.hidden_menu.some((i) => {
        return i === mark
    })
}

function submit(formName) {
    proxy.$refs[formName].validate((valid) => {
        if (valid) {
            formLoad.value = true
            if (form.value.pid === null) form.value.pid = '0'
            if (form.value.menu_id) {
                ModifyMenu(form.value)
                    .then(async (res) => {
                        handleInitParent('菜单编辑成功')
                    })
                    .catch(() => {
                        formLoad.value = false
                    })
            } else {
                CreateMenu(form.value)
                    .then(async (res) => {
                        handleInitParent('菜单创建成功')
                    })
                    .catch(() => {
                        formLoad.value = false
                    })
            }
        }
    })
}

function copy_this() {
    delete form.value['menu_id']
    proxy.$refs['SYSMENU'].clearValidate()
}

function handleInitParent(title) {
    proxy.$message.success(title)
    formLoad.value = false
    init(true)
}

function getMenuItem(data = null) {
    form.value = data
        ? cloneDeep(data)
        : {
              cache: true,
              disable: false,
              sort: 1,
              roles: roleDefault.value === null ? [] : [roleDefault.value]
          }
    treeData.value = cloneDeep(menuData.value)
    disabledMenu(form.value, treeData.value)
    proxy.$refs['SYSMENU'].clearValidate()
}

function disabledMenu(item, data) {
    data.map((i) => {
        if (i.menu_id === item.menu_id) i.disabled = true
        if (i.children) disabledMenu(item, i.children)
    })
}

function delMenu(menu_id) {
    proxy
        .$confirm('删除后子菜单将自动到根菜单下，确定删除该菜单吗', '删除菜单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            DelMenu({
                menu_id: menu_id
            }).then(async (res) => {
                init(true)
            })
        })
}

function getMenuToInterface(title, menu_id) {
    dialogTitle.value = title + '关联接口'
    dialogTableVisible.value = true
    dialogLoading.value = true
    GetMenuToInterface({
        menu_id: menu_id
    })
        .then(async (res) => {
            interfaceData.value = res
            dialogLoading.value = false
        })
        .catch(() => {
            dialogLoading.value = false
        })
}

onMounted(() => {
    init()
})
</script>

<style lang="scss" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.el-tree {
    width: 30%;
    display: inline-block;
}
.el-card {
    display: initial;
    width: 60%;
    margin-left: 7%;
    position: absolute;

    ::v-deep(.el-card__body) {
        max-height: 580px;
        overflow-y: auto;
    }
}
.title-group {
    margin-top: 20px;
    margin-bottom: 10px;
    &:first-child {
        margin-top: 0px;
    }
    .title {
        margin: 0px;
    }
    .sub-title {
        margin: 0px;
        color: $color-text-sub;
        font-size: 10px;
    }
}
.fa {
    padding-right: 10px;
    opacity: 0.8;
}
.disabled {
    .label {
        opacity: 0.25;
    }
}
</style>

<style>
.el-tree-node__content {
    line-height: 35px;
    height: 35px;
}
</style>
