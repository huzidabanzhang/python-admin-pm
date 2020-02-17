<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addRole"
                title="新增"
            >
            </el-button>
            <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                :disabled="select.role_id == null || select.mark == 'SYS_ADMIN'"
                @click="delRole"
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
                        v-model="value"
                        placeholder="角色状态"
                        clearable
                        size="mini"
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
                        size="mini"
                        type="primary"
                        @click="changeStatus"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <ul v-loading="loading" class="role-ul">
            <li v-for="(item, key) in roleData" 
                :key="key" 
                class="role-group" 
                :class="select.role_id == item.role_id ? 'select' : ''" 
                @dblclick="editRole(item)"
                @click="select = item"
            >
                <i class="fa fa-group role-icon"></i>
                <i class="icon role-top" 
                    :class="item.is_disabled ? 'el-icon-close disabled' : 'el-icon-check'"
                    @click="lockRole([item.role_id], !item.is_disabled)"
                ></i>
                <span>{{item.name}}</span>
            </li>
        </ul>

        <Info
            ref="roleInfo"
            :title="title"
            :params="params"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryRoleByParam, LockRole, DelRole } from '@api/sys.role'
import Info from './info.vue'
export default {
    name: 'sys-role',
    components: { Info },
    data() {
        return {
            roleData: [],
            value: '',
            is_disabled: '',
            statusOption: [
                { label: '启用', value: 'true' },
                { label: '禁用', value: 'false' }
            ],
            loading: false,
            title: '',
            select: {
                role_id: null
            },
            params: {},
            centerDialogVisible: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            if (isTrue == true) this.centerDialogVisible = false
            let params = {}
            if (this.is_disabled != '') params['is_disabled'] = this.is_disabled

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
        changeStatus() {
            this.is_disabled = this.value
            this.init()
        },
        clearStatus() {
            this.value = ''
        },
        handleClose() {
            this.centerDialogVisible = false
        },
        addRole() {
            this.title = '新建角色'
            this.params = {
                name: '',
                mark: ''
            }
            this.centerDialogVisible = true
        },
        editRole(params) {
            this.title = '编辑角色'
            this.params = params
            this.centerDialogVisible = true
        },
        lockRole(keys, is_disabled) {
            if (keys.length == 0) return this.$message({
                message: '未选择任何记录',
                type: 'warning',
                duration: 3 * 1000
            })

            this.$confirm(is_disabled ? '确定要禁用该角色吗' : '确定要启用该角色吗',
                is_disabled ? '禁用角色' : '启用角色',
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
            LockRole({
                role_id: keys,
                is_disabled: is_disabled
            }).then(async res => {
                this.select = {role_id: null}
                this.init()
            })
        },
        delRole() {
            if (this.select.role_id != null && this.select.mark != 'SYS_ADMIN') {
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
                            this.$message({
                                message: '删除角色成功',
                                type: 'success',
                                duration: 3 * 1000
                            })
                            this.select = {role_id: null}
                            this.init()
                        })
                    })
            } else this.$message({
                message: '未选择任何记录',
                type: 'warning',
                duration: 3 * 1000
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
    padding: 7px 15px;
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
    padding-bottom: 5px;
}

.role-top {
    position: absolute;
    top: 5px;
    color: white;
    padding: 1px;
    border-radius: 50%;
    background: #67C23A;
    right: 5px;
}

.role-top.disabled {
    background: #F56C6C;
}

.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}

.form-right {
    float: right;
}
</style>