<template>
    <admin-container>
        <template v-slot:header>
            <div>
                <el-button
                    type="primary"
                    title="新增"
                    circle
                    v-auth:add_admin
                    :icon="Plus"
                    @click="editAdmin(auth.add)"
                >
                </el-button>
                <el-button
                    type="success"
                    title="显示"
                    circle
                    :icon="Check"
                    :disabled="auth.lock_all"
                    @click="lockAdmin(admin_id, false)"
                >
                </el-button>
                <el-button
                    type="info"
                    title="隐藏"
                    circle
                    :icon="Close"
                    :disabled="auth.lock_all"
                    @click="lockAdmin(admin_id, true)"
                ></el-button>
                <el-button
                    type="danger"
                    title="删除"
                    circle
                    :icon="Delete"
                    :disabled="auth.del_all"
                    @click="delAdmin(admins)"
                ></el-button>
                <el-button title="刷新" circle :icon="RefreshRight" @click="init"></el-button>

                <el-form inline class="form-right">
                    <el-form-item>
                        <el-select v-model="search.lock" placeholder="管理员状态" clearable>
                            <el-option
                                v-for="item in lockOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="search.role" placeholder="角色" clearable>
                            <el-option
                                v-for="item in roleOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" :loading="loading" @click="init()">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </template>

        <el-table
            style="width: 100%"
            type="ghost"
            v-loading="loading"
            :data="adminData"
            @select="changeSelect"
            @select-all="changeSelect"
        >
            <el-table-column type="selection" width="55" :selectable="isAdmin"> </el-table-column>
            <el-table-column prop="username" label="用户名" align="center"> </el-table-column>
            <el-table-column prop="role_id" label="角色名" align="center">
                <template #default="scope">
                    <el-tag effect="dark" v-html="getRoleName(scope.row.role_id)"></el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="disable" label="可见性" align="left">
                <template #default="scope">
                    <el-button
                        :type="scope.row.disable ? 'info' : 'success'"
                        :disabled="auth.lock"
                        @click="handleRowLock(scope.row)"
                        >{{ scope.row.disable ? '隐藏' : '显示' }}</el-button
                    >
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"> </el-table-column>
            <el-table-column prop="update_time" label="更新时间" align="center"> </el-table-column>
            <el-table-column prop="content" label="操作" align="center">
                <template #default="scope">
                    <el-button
                        v-if="isAdmin(scope.row)"
                        circle
                        title="编辑"
                        :icon="Edit"
                        @click="editAdmin(auth.set, scope.row)"
                    ></el-button>
                    <el-button
                        v-if="isAdmin(scope.row)"
                        circle
                        title="删除"
                        type="danger"
                        :icon="Delete"
                        :disabled="auth.del"
                        @click="delAdmin([scope.row])"
                    >
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <template v-slot:footer>
            <Pagination
                :page="page"
                :total="total"
                :size="size"
                @handleSize="handleSize"
                @handleCurrent="handleCurrent"
            ></Pagination>
        </template>

        <Admin
            ref="admin"
            :title="title"
            :params="params"
            :role="roleParams"
            :isAdmin="false"
            :submit="btnSubmit"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Admin>
    </admin-container>
</template>

<script setup lang="ts">
import { RefreshRight, Plus, Check, Close, Delete, Edit, Search } from '@element-plus/icons-vue'
import { QueryAdminByParam, LockAdmin, DelAdmin } from '@/api/sys.user'
import { QueryRoleByParam } from '@/api/sys.role'
import { ref, reactive, onMounted } from 'vue'
import { cloneDeep } from 'lodash'
import Admin from './info.vue'
import Pagination from '@/layout/pages/pagination/index.vue'
import setting from '@/setting'
import useCurrentInstance from '@/proxy'

const { _this } = useCurrentInstance()

const lockOption = [
    { label: '显示', value: 'false' },
    { label: '隐藏', value: 'true' }
]
const auth = reactive({
    add: false,
    del: _this.$auth('del_admin'),
    lock: _this.$auth('lock_admin'),
    set: _this.$auth('set_admin'),
    del_all: true,
    lock_all: true
})
const auth_all = {
    del: _this.$auth('del_admin'),
    lock: _this.$auth('lock_admin')
}

const adminData = ref([])
const roleOption = ref([])
const roleParams = ref([])
const admin_id = ref([])
const admins = ref([])
const params = ref({})
const page = ref(1)
const total = ref(0)
const size = ref(20)
const search = reactive({
    lock: '',
    role: ''
})
const title = ref('')
const loading = ref(false)
const centerDialogVisible = ref(false)
const btnSubmit = ref(false)

function init(visible = false) {
    changeSelect([])

    if (visible) centerDialogVisible.value = false

    let params = {
        page: page.value,
        page_size: size.value
    }
    if (search.lock !== '') params['disable'] = search.lock
    if (search.role !== '') params['role_id'] = search.role

    loading.value = true
    QueryAdminByParam(params)
        .then(async (res) => {
            total.value = res.total
            adminData.value = res.data
            loading.value = false
        })
        .catch(() => {
            loading.value = false
        })
}

function getRoleList() {
    QueryRoleByParam({
        disable: false
    }).then(async (res) => {
        roleParams.value = res
        roleOption.value = res.map((i) => {
            return { label: i.name, value: i.role_id }
        })
        init()
    })
}

function getRoleName(role_id) {
    const item = roleOption.value.find((i) => {
        return i.value === role_id
    })
    return item ? item.label : '未选择角色'
}

function handleSize(size) {
    size.value = size
    page.value = 1
    init()
}

function handleCurrent(page) {
    page.value = page
    init()
}

function isAdmin(row) {
    return row.username !== setting.SYS_ADMIN.name
}

function handleClose() {
    centerDialogVisible.value = false
}

function changeSelect(selection) {
    admin_id.value = selection.map((i) => {
        return i.admin_id
    })
    admins.value = selection.map((i) => {
        return {
            role_id: i.role_id,
            admin_id: i.admin_id
        }
    })

    for (let i in auth_all) {
        if (!auth_all[i]) auth[i + '_all'] = admin_id.value.length === 0
    }
}

function editAdmin(disabled, row) {
    btnSubmit.value = disabled
    title.value = params ? '编辑管理员' : '新建管理员'
    params.value = row
        ? cloneDeep(row)
        : {
              sex: 1,
              disable: false
          }
    centerDialogVisible.value = true
}

function handleRowLock(row) {
    if (!isAdmin(row)) return true

    lockAdmin([row.admin_id], row.disable ? false : true)
}

function lockAdmin(keys, disable) {
    if (keys.length === 0) return _this.$message.warning('未选择任何记录')

    _this
        .$confirm(disable ? '确定要隐藏该管理员吗' : '确定要显示该管理员吗', disable ? '隐藏管理员' : '显示管理员', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            Lock(keys, disable)
        })
        .catch()
}

function Lock(keys, disable) {
    LockAdmin({
        admin_id: keys,
        disable: disable
    }).then(async (res) => {
        init()
    })
}

function delAdmin(admins) {
    if (admins.length === 0) return _this.$message.warning('未选择任何记录')

    _this
        .$confirm('确定要删除该管理员吗', '删除管理员', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            DelAdmin({
                admin_id: admins.map((i) => {
                    return i.admin_id
                })
            }).then(async (res) => {
                _this.$message.success('删除管理员成功')
                init()
            })
        })
}

onMounted(() => {
    getRoleList()
})
</script>

<style scoped>
.el-select {
    width: 120px;
}
.el-form-item.el-form-item {
    margin-bottom: 0;
    margin-right: 16px;
}
.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}
.form-right {
    float: right;
}
</style>
