<template>
    <chubby-container>
        <div slot="header">
            <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                @click="addAdmin(mark_btn.add)"
                title="新增"
                v-premissions="{
                    mark: mark.admin.add,
                    type: 'add'
                }"
            >
            </el-button>
            <el-button
                type="success"
                icon="el-icon-check"
                circle
                @click="lockAdmin(admin_id, false)"
                title="显示"
                :disabled="mark_btn.all_lock"
                v-premissions="{
                    mark: mark.admin.all_lock,
                    type: 'all_lock',
                    not_disabled: true
                }"
            >
            </el-button>
            <el-button
                type="info"
                icon="el-icon-close"
                circle
                @click="lockAdmin(admin_id, true)"
                title="隐藏"
                :disabled="mark_btn.all_lock"
                v-premissions="{
                    mark: mark.admin.all_lock,
                    type: 'all_lock',
                    not_disabled: true
                }"
            ></el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delAdmin(admins)"
                title="删除"
                :disabled="mark_btn.all_del"
                v-premissions="{
                    mark: mark.admin.all_del,
                    type: 'all_del',
                    not_disabled: true
                }"
            ></el-button>
            <el-button
                icon="el-icon-refresh-right"
                @click="init"
                circle
                title="刷新"
            ></el-button>

            <el-form
                :inline="true"
                class="form-right"
            >
                <el-form-item>
                    <el-select
                        v-model="lock"
                        placeholder="管理员状态"
                        clearable
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
                        :loading="loading"
                        type="primary"
                        @click="changeAdmin"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            :data="adminData"
            style="width: 100%"
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
                        type="primary"
                        v-html="getRoleName(scope.row.role_id)"
                    ></el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_disabled"
                label="可见性"
                align="left"
            >
                <template slot-scope="scope">
                    <el-radio-group
                        v-model="scope.row.is_disabled"
                        v-if="isSelect(scope.row)"
                        :disabled="mark_btn.lock"
                        v-premissions="{
                            mark: mark.admin.lock,
                            type: 'lock'
                        }"
                        @change="(label) => {lockAdmin([scope.row.admin_id], label, scope.row)}"
                    >
                        <el-radio-button :label="false">显示</el-radio-button>
                        <el-radio-button :label="true">隐藏</el-radio-button>
                    </el-radio-group>
                    <el-button
                        type="primary"
                        v-else
                    >显示</el-button>
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
                    v-if="isSelect(scope.row)"
                >
                    <el-button
                        icon="el-icon-edit"
                        circle
                        @click.native="editAdmin(scope.row, mark_btn.set)"
                        title="编辑"
                        v-premissions="{
                            mark: mark.admin.set,
                            type: 'set',
                            not_hidden: true
                        }"
                    ></el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click.native="delAdmin([scope.row], false)"
                        title="删除"
                        :disabled="mark_btn.del"
                        v-premissions="{
                            mark: mark.admin.del,
                            type: 'del'
                        }"
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
            :isTab="false"
            :submit="btn_submit"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </chubby-container>
</template>

<script>
import { QueryAdminByParam, LockAdmin, DelAdmin } from '@api/sys.user'
import { QueryRoleByParam } from '@api/sys.role'
import Info from './info.vue'
import Pagination from '@/pages/pagination/index.vue'
import setting from '@/setting.js'
export default {
    name: 'AdminPage',
    components: { Info, Pagination },
    data () {
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
                { label: '显示', value: 'false' },
                { label: '隐藏', value: 'true' }
            ],
            loading: false,
            title: '',
            params: {},
            centerDialogVisible: false,
            admin_id: [],
            admins: [],
            btn_submit: false,
            mark: setting.mark,
            mark_btn: {
                add: false,
                set: false,
                del: false,
                lock: false,
                all_del: true,
                all_lock: true
            }
        }
    },
    created () {
        this.getRoleList()
    },
    methods: {
        init (isTrue) {
            this.changeSelect([])

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
        getRoleList () {
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
        getRoleName (role_id) {
            let item = this.roleOption.find((i) => {
                return i.value == role_id
            })
            return item ? item.label : '未选择角色'
        },
        handleSize (size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent (page) {
            this.page = page
            this.init()
        },
        changeAdmin () {
            this.is_disabled = this.lock
            this.isRole = this.role
            this.init()
        },
        clearLock () {
            this.lock = ''
        },
        clearRole () {
            this.role = ''
        },
        isSelect (row) {
            return row.username != setting.SYS_ADMIN.name
        },
        handleClose () {
            this.centerDialogVisible = false
        },
        changeSelect (selection) {
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
            let data = this.$store.getters['chubby/user/interfaces']
            if (data) {
                let del = data.filter((i) => {
                    return i.mark == this.mark.admin.all_del
                }), lock = data.filter((i) => {
                    return i.mark == this.mark.admin.all_lock
                })
                if (del.length > 0 && !del[0].is_disabled)
                    this.mark_btn.all_del = this.admin_id.length == 0
                if (lock.length > 0 && !lock[0].is_disabled)
                    this.mark_btn.all_lock = this.admin_id.length == 0
            }
        },
        addAdmin (disabled) {
            this.btn_submit = disabled
            this.title = '新建管理员'
            this.params = {
                sex: 1,
                is_disabled: false
            }
            this.centerDialogVisible = true
        },
        editAdmin (params, disabled) {
            this.btn_submit = disabled
            this.title = '编辑管理员'
            this.params = params
            this.centerDialogVisible = true
        },
        lockAdmin (keys, is_disabled, row) {
            if (keys.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm(is_disabled ? '确定要隐藏该管理员吗' : '确定要显示该管理员吗',
                is_disabled ? '隐藏管理员' : '显示管理员',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, is_disabled)
                }).catch(() => {
                    if (row) row.is_disabled = !is_disabled
                })
        },
        Lock (keys, is_disabled) {
            LockAdmin({
                admin_id: keys,
                is_disabled: is_disabled
            }).then(async res => {
                this.init()
            })
        },
        delAdmin (admins) {
            if (admins.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm('确定要删除该管理员吗', '删除管理员',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelAdmin({
                        admin_id: admins.map(i => {
                            return i.admin_id
                        })
                    }).then(async res => {
                        this.$message.success('删除管理员成功')
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