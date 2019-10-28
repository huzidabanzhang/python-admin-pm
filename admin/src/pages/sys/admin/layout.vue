<template>
    <d2-container>
        <el-form :inline="true" slot="header" size="mini">
            <el-form-item>
                <el-select v-model="lock" placeholder="请选择" clearable size="mini" :clear="clearLock">
                    <el-option v-for="item in lockOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="role" placeholder="请选择" clearable size="mini" :clear="clearRole">
                    <el-option v-for="item in roleOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button icon="el-icon-search" size="mini" type="primary" @click="changeAdmin"></el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addAdmin">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="lockAdmin(admin_id)">禁用</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="adminData" style="width: 100%" size="mini" type="ghost" v-loading="loading" @select="changeSelect">
            <el-table-column type="selection" width="55" :selectable="isSelect">
            </el-table-column>
            <el-table-column prop="username" label="用户名" align="center">
            </el-table-column>
            <el-table-column prop="role_id" label="角色名" align="center">
                <template slot-scope="scope">
                    <el-tag size="medium" type="primary" v-html="getRoleName(scope.row.role_id)"></el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="isLock" label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag size="medium" type="success" v-if="scope.row.isLock">启用</el-tag>
                    <el-tag size="medium" type="info" v-else>禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" align="center">
            </el-table-column>
            <el-table-column prop="content" label="操作" align="center">
                <template slot-scope="scope" v-if="scope.row.role_id != 1">
                    <el-button icon="el-icon-edit" v-if="scope.row.isLock" size="mini" circle
                        @click.native="editAdmin(scope.row)" title="编辑"></el-button>
                    <el-button type="danger" v-if="scope.row.isLock" icon="el-icon-delete" size="mini" circle
                        @click.native="lockAdmin([scope.row.admin_id], false)" title="禁用"></el-button>
                    <el-button v-else type="primary" icon="el-icon-circle-check" size="mini" circle
                        @click.native="lockAdmin([scope.row.admin_id], true)" title="启用">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination slot="footer" :page="page" :total="total" :size="size" @handleSize="handleSize"
            @handleCurrent="handleCurrent"></Pagination>

        <Info ref="adminData" :title="title" :params="params" :role="roleOption" :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose" @callback="init"></Info>
    </d2-container>
</template>

<script>
import { QueryAdminByParam, LockAdmin } from '@api/sys.user'
import { QueryRoleByParam } from '@api/sys.role'
import Info from './info.vue'
import Pagination from '@/pages/pagination/index.vue'
export default {
    name: 'sys-admin',
    components: { Info, Pagination },
    data() {
        return {
            adminData: [],
            page: 1,
            total: 0,
            size: 20,
            lock: '',
            isLock: '',
            role: '',
            isRole: '',
            roleOption: [],
            lockOption: [
                { label: '启用', value: 'true' },
                { label: '禁用', value: 'false' }
            ],
            loading: false,
            title: '',
            params: {},
            centerDialogVisible: false,
            admin_id: []
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        init(isTrue) {
            if (isTrue) this.centerDialogVisible = false
            let params = {
                page: this.page,
                page_size: this.size
            }
            if (this.isLock != '') params['isLock'] = this.isLock
            if (this.isRole != '') params['role_id'] = this.isRole

            this.loading = true
            QueryAdminByParam(params)
                .then(async res => {
                    this.total = res.total
                    this.adminData = res.data
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        getRoleList() {
            QueryRoleByParam({
                isLock: true
            })
                .then(async res => {
                    this.roleOption = res.map((i) => {
                        return { label: i.name, value: i.id }
                    })
                    this.init()
                })
        },
        getRoleName(role_id) {
            let item = this.roleOption.find((i) => {
                return i.value == role_id
            })
            return item ? item.label : '~~~~~未知'
        },
        handleSize(size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent(page) {
            this.page = page
            this.init()
        },
        changeAdmin() {
            this.isLock = this.lock
            this.isRole = this.role
            this.init()
        },
        clearLock() {
            this.lock = ''
        },
        clearRole() {
            this.role = ''
        },
        isSelect(row, index) {
            if (row.id == 1) return false
            return row.isLock
        },
        handleClose() {
            this.centerDialogVisible = false
        },
        changeSelect(selection) {
            this.admin_id = selection.map((i) => {
                return i.id
            })
        },
        addAdmin() {
            this.title = '新建管理员'
            this.params = {
                username: '',
                password: '',
                nickname: '',
                sex: 1,
                role_id: '',
                avatarUrl: ''
            }
            this.centerDialogVisible = true
        },
        editAdmin(params) {
            this.title = '编辑管理员'
            this.params = params
            this.centerDialogVisible = true
        },
        lockAdmin(keys, isLock) {
            this.$confirm(!isLock ? '确定要禁用吗' : '确定要启用吗',
                !isLock ? '禁用管理员' : '启用管理员',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, isLock)
                })
        },
        Lock(keys, isLock) {
            LockAdmin({
                admin_id: keys,
                isLock: isLock
            }).then(async res => {
                this.init()
            })
        }
    }
}
</script>

<style scoped>
.el-select {
    padding-right: 5px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}
</style>