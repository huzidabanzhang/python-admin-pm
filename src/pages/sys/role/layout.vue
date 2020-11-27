<template>
    <chubby-container>
        <div slot="header">
            <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                @click="addRole(auth.add)"
                title="新增"
                v-auth:add_role
            >
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delRole"
                title="删除"
                :disabled="auth.del"
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
                        v-model="value"
                        placeholder="角色状态"
                        clearable
                        :clear="clearStatus"
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
                        icon="el-icon-search"
                        type="primary"
                        :loading="loading"
                        @click="changeStatus"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <ul
            v-loading="loading"
            class="role-ul"
        >
            <li
                v-for="(item, key) in roleData"
                :key="key"
                class="role-group"
                :class="select.role_id == item.role_id ? 'select' : ''"
                @dblclick="editRole(item)"
                @click="getRole(item)"
            >
                <i class="fa fa-group role-icon"></i>
                <i
                    class="icon role-top"
                    :class="item.disable ? 'el-icon-close disabled' : 'el-icon-check'"
                    @click="lockRole([item.role_id], !item.disable)"
                    v-if="item.mark !== mark"
                ></i>
                <span>{{item.name}}</span>
            </li>
        </ul>

        <Info
            ref="roleInfo"
            :title="title"
            :params="params"
            :centerDialogVisible="centerDialogVisible"
            :submit="btn_submit"
            :del="auth.del"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </chubby-container>
</template>

<script>
import { QueryRoleByParam, LockRole, DelRole } from '@api/sys.role'
import Info from './info.vue'
import setting from '@/setting.js'
export default {
    name: 'RolePage',
    components: { Info },
    data () {
        return {
            roleData: [],
            value: '',
            disable: '',
            statusOption: [
                { label: '显示', value: 'false' },
                { label: '隐藏', value: 'true' }
            ],
            loading: false,
            title: '',
            select: {
                role_id: null
            },
            params: {},
            centerDialogVisible: false,
            btn_submit: false,
            mark: setting.SYS_ADMIN.mark,
            auth: {
                add: false,
                del: true
            },
            auth_all: {
                set: this.$auth('set_role', 'all'),
                del: this.$auth('del_role', 'all'),
                lock: this.$auth('lock_role', 'all')
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        init (isTrue) {
            if (isTrue == true) this.centerDialogVisible = false
            let params = {}
            if (this.disable != '') params['disable'] = this.disable

            this.loading = true
            QueryRoleByParam(params)
                .then(async res => {
                    this.roleData = res
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        changeStatus () {
            this.disable = this.value
            this.init()
        },
        clearStatus () {
            this.value = ''
        },
        handleClose () {
            this.centerDialogVisible = false
        },
        addRole (disabled) {
            this.btn_submit = disabled
            this.title = '新建角色'
            this.params = {
                disable: false
            }
            this.centerDialogVisible = true
        },
        getRole (item) {
            this.select = item
            if (this.auth_all.del == false && item.mark !== this.mark) this.auth.del = false
        },
        editRole (params) {
            this.btn_submit = this.auth_all.set
            this.title = '编辑角色'
            this.params = params
            this.centerDialogVisible = true
        },
        lockRole (keys, disable) {
            if (this.auth_all.lock) return true

            if (keys.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm(disable ? '确定要隐藏该角色吗' : '确定要显示该角色吗',
                disable ? '隐藏角色' : '显示角色',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, disable)
                })
        },
        Lock (keys, disable) {
            LockRole({
                role_id: keys,
                disable: disable
            }).then(async res => {
                this.select = { role_id: null }
                this.init()
            })
        },
        delRole () {
            if (this.select.role_id != null && this.select.mark != this.mark) {
                this.$confirm('确定要删除该角色吗', '删除角色',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        DelRole({
                            role_id: [this.select.role_id]
                        }).then(async res => {
                            this.$message.success('删除角色成功')
                            this.select = { role_id: null }
                            this.init()
                        })
                    })
            } else this.$message.warning('未选择任何记录')
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