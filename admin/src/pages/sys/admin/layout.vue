<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addAdmin"
                title="新增"
            >
            </el-button>
            <el-button
                type="success"
                icon="el-icon-check"
                size="mini"
                circle
                @click="lockAdmin(admin_id, false)"
                title="启用"
            >
            </el-button>
            <el-button
                type="info"
                size="mini"
                icon="el-icon-close"
                circle
                @click="lockAdmin(admin_id, true)"
                title="禁用"
            ></el-button>
            <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="delAdmin(admins)"
                title="删除"
            ></el-button>
            <el-button
                icon="el-icon-refresh-right"
                size="mini"
                @click="init"
                circle
                title="刷新"
            ></el-button>

            <el-form
                :inline="true"
                size="mini"
                class="form-right"
            >
                <el-form-item>
                    <el-select
                        v-model="lock"
                        placeholder="管理员状态"
                        clearable
                        size="mini"
                        :clear="clearLock"
                    >
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
                    <el-select
                        v-model="role"
                        placeholder="角色"
                        clearable
                        size="mini"
                        :clear="clearRole"
                    >
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
                    <el-button
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="changeAdmin"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            :data="adminData"
            style="width: 100%"
            size="mini"
            type="ghost"
            v-loading="loading"
            @select="changeSelect"
            @select-all="changeSelect"
        >
            <el-table-column
                type="selection"
                width="55"
                :selectable="isSelect"
            >
            </el-table-column>
            <el-table-column
                prop="username"
                label="用户名"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="role_id"
                label="角色名"
                align="center"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="medium"
                        type="primary"
                        v-html="getRoleName(scope.row.role_id)"
                    ></el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_disabled"
                label="状态"
                align="center"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="medium"
                        type="success"
                        v-if="!scope.row.is_disabled"
                    >启用</el-tag>
                    <el-tag
                        size="medium"
                        type="info"
                        v-else
                    >禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="content"
                label="操作"
                align="center"
            >
                <template
                    slot-scope="scope"
                    v-if="scope.row.username != 'Admin'"
                >
                    <el-button
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click.native="editAdmin(scope.row)"
                        title="编辑"
                    ></el-button>
                    <el-button
                        type="info"
                        v-if="!scope.row.is_disabled"
                        icon="el-icon-close"
                        size="mini"
                        circle
                        @click.native="lockAdmin([scope.row.admin_id], true)"
                        title="禁用"
                    ></el-button>
                    <el-button
                        v-else
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        circle
                        @click.native="lockAdmin([scope.row.admin_id], false)"
                        title="启用"
                    >
                    </el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="delAdmin([scope.row], false)"
                        title="删除"
                    >
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination
            slot="footer"
            :page="page"
            :total="total"
            :size="size"
            @handleSize="handleSize"
            @handleCurrent="handleCurrent"
        ></Pagination>

        <Info
            ref="adminData"
            :title="title"
            :params="params"
            :role="roleParams"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryAdminByParam, LockAdmin, DelAdmin } from '@api/sys.user'
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
            is_disabled: '',
            role: '',
            isRole: '',
            roleOption: [],
            roleParams: [],
            lockOption: [
                { label: '启用', value: 'false' },
                { label: '禁用', value: 'true' }
            ],
            loading: false,
            title: '',
            params: {},
            centerDialogVisible: false,
            admin_id: [],
            admins: []
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
            if (this.is_disabled != '') params['is_disabled'] = this.is_disabled
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
                is_disabled: false
            })
                .then(async res => {
                    this.roleParams = res
                    this.roleOption = res.map((i) => {
                        return { label: i.name, value: i.role_id }
                    })
                    this.init()
                })
        },
        getRoleName(role_id) {
            let item = this.roleOption.find((i) => {
                return i.value == role_id
            })
            return item ? item.label : '未选择角色'
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
            this.is_disabled = this.lock
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
            if (row.username == 'Admin') return false
            return !row.is_disabled
        },
        handleClose() {
            this.centerDialogVisible = false
        },
        changeSelect(selection) {
            this.admin_id = selection.map((i) => {
                return i.admin_id
            })

            this.admins = []
            selection.forEach(i => {
                this.admins.push({
                    role_id: i.role_id,
                    admin_id: i.admin_id
                })
            })
        },
        addAdmin() {
            this.title = '新建管理员'
            this.params = {
                username: '',
                password: '',
                nickname: '',
                email: '',
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
        lockAdmin(keys, is_disabled) {
            if (keys.length == 0) return this.$message({
                message: '未选择任何记录',
                type: 'warning',
                duration: 3 * 1000
            })

            this.$confirm(is_disabled ? '确定要禁用该管理员吗' : '确定要启用该管理员吗',
                is_disabled ? '禁用管理员' : '启用管理员',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, is_disabled)
                })
        },
        Lock(keys, is_disabled) {
            LockAdmin({
                admin_id: keys,
                is_disabled: is_disabled
            }).then(async res => {
                this.admin_id == []
                this.init()
            })
        },
        delAdmin(admins) {
            if (admins.length == 0) return this.$message({
                message: '未选择任何记录',
                type: 'warning',
                duration: 3 * 1000
            })

            this.$confirm('确定要删除该管理员吗', '删除管理员',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelAdmin({
                        admins: JSON.stringify(admins)
                    }).then(async res => {
                        this.$message({
                            message: '删除管理员成功',
                            type: 'success',
                            duration: 3 * 1000
                        })
                        this.admins = []
                        this.init()
                    })
                })
        }
    }
}
</script>

<style scoped>
.el-select {
    width: 120px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}

.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}

.form-right {
    float: right;
}
</style>