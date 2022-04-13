<template>
    <admin-container>
        <template v-slot:header>
            <div>
                <el-button
                    circle
                    type="primary"
                    title="新增"
                    v-auth:add_role
                    :icon="Plus"
                    @click="editRole(auth.add)"
                >
                </el-button>
                <el-button
                    circle
                    type="danger"
                    title="删除"
                    :icon="Delete"
                    :disabled="auth.del"
                    @click="delRole"
                ></el-button>
                <el-button
                    circle
                    title="刷新"
                    :icon="RefreshRight"
                    @click="init"
                ></el-button>

                <el-form
                    inline
                    class="form-right"
                >
                    <el-form-item>
                        <el-select
                            v-model="search.status"
                            placeholder="角色状态"
                            clearable
                        >
                            <el-option
                                v-for="item in statusOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            :icon="Search"
                            :loading="loading"
                            @click="init()"
                        >搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </template>

        <ul
            v-loading="loading"
            class="role-ul"
        >
            <li
                class="role-group"
                v-for="(item, key) in roleData"
                :key="key"
                :class="select.role_id == item.role_id ? 'select' : ''"
                @dblclick="editRole(auth_all.set, item)"
                @click="getRole(item)"
            >
                <i class="fa fa-group role-icon"></i>
                <i
                    v-if="item.mark !== mark"
                    class="icon role-top"
                    :class="item.disable ? 'fa fa-ban disabled' : 'el-icon-check'"
                    @click="lockRole([item.role_id], !item.disable)"
                ></i>
                <span>{{ item.name }}</span>
            </li>
        </ul>

        <Info
            ref="roleInfo"
            :title="title"
            :params="params"
            :centerDialogVisible="centerDialogVisible"
            :submit="btnSubmit"
            :del="auth.del"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </admin-container>
</template>

<script setup>
import {
    Plus,
    Delete,
    RefreshRight,
    Search
} from '@element-plus/icons-vue'
import { QueryRoleByParam, LockRole, DelRole } from '@/api/sys.role'
import { cloneDeep } from 'lodash'
import { ref, reactive, onMounted } from 'vue'
import Info from './info.vue'
import setting from '@/setting.js'
import useCurrentInstance from '@/proxy'

const { proxy } = useCurrentInstance()
const auth_all = {
    set: proxy.$auth('set_role', 'all'),
    del: proxy.$auth('del_role', 'all'),
    lock: proxy.$auth('lock_role', 'all')
}
const statusOption = [
    { label: '显示', value: 'false' },
    { label: '隐藏', value: 'true' }
]
const mark = setting.SYS_ADMIN.mark

const auth = reactive({
    add: false,
    del: true
})
const roleData = ref([])
const params = ref({})
const loading = ref(false)
const centerDialogVisible = ref(false)
const btnSubmit = ref(false)
const search = reactive({
    status: ''
})
const title = ref('')
const select = ref({
    role_id: null
})

function init (visible) {
    if (visible == true) centerDialogVisible.value = false
    let params = {}
    if (search.status !== '') params['disable'] = search.status

    loading.value = true
    QueryRoleByParam(params)
        .then(async (res) => {
            roleData.value = res
            loading.value = false
        })
        .catch(() => {
            loading.value = false
        })
}

function handleClose () {
    centerDialogVisible.value = false
}

function getRole (item) {
    select.value = item
    auth.del = item.mark === mark
}

function editRole (disabled, role) {
    btnSubmit.value = disabled
    title.value = role ? '编辑角色' : '新建角色'
    params.value = role ? cloneDeep(role) : {
        disable: false
    }
    centerDialogVisible.value = true
}

function lockRole (keys, disable) {
    if (auth_all.lock) return true

    if (keys.length == 0) return proxy.$message.warning('未选择任何记录')

    proxy.$confirm(
        disable ? '确定要隐藏该角色吗' : '确定要显示该角色吗',
        disable ? '隐藏角色' : '显示角色',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        Lock(keys, disable)
    })
}

function Lock (keys, disable) {
    LockRole({
        role_id: keys,
        disable: disable,
    }).then(async (res) => {
        select.value = { role_id: null }
        init()
    })
}

function delRole () {
    if (select.value.role_id !== null && select.value.mark !== mark) {
        proxy.$confirm('确定要删除该角色吗', '删除角色', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            DelRole({
                role_id: [select.value.role_id],
            }).then(async (res) => {
                proxy.$message.success('删除角色成功')
                select.value = { role_id: null }
                init()
            })
        })
    } else proxy.$message.warning('未选择任何记录')
}

onMounted(() => {
    init()
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
.role-ul {
    margin: 0;
    height: 100%;
    padding: 0;
}
.role-group {
    position: relative;
    max-width: 100px;
    min-width: 60px;
    display: inline-block;
    padding: 10px;
    margin: 5px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
}
.role-group.select {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.role-group:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.role-icon {
    font-size: 24px;
    color: #999;
    display: block;
    padding: 7px;
}
.role-top {
    position: absolute;
    top: 5px;
    color: white;
    padding: 1px;
    border-radius: 50%;
    background: #67c23a;
    right: 5px;
}
.role-top.disabled {
    background: #f56c6c;
}
.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}
.form-right {
    float: right;
}
</style>
