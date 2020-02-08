<template>
    <d2-container>
        <el-form
            :inline="true"
            slot="header"
            size="mini"
        >
            <el-form-item>
                <el-select
                    v-model="value"
                    placeholder="请选择"
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
                ></el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="addRole"
                >新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="roleData"
            style="width: 100%"
            size="mini"
            type="ghost"
            v-loading="loading"
        >
            <el-table-column
                prop="name"
                label="角色名"
                align="center"
            >
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
                        v-if="scope.row.is_disabled"
                    >启用</el-tag>
                    <el-tag
                        size="medium"
                        type="info"
                        v-else
                    >禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="操作"
                align="center"
            >
                <template
                    slot-scope="scope"
                    v-if="scope.row.id != 1"
                >
                    <el-button
                        icon="el-icon-edit"
                        v-if="scope.row.is_disabled"
                        size="mini"
                        circle
                        @click.native="editRole(scope.row)"
                        title="编辑"
                    ></el-button>
                    <el-button
                        type="danger"
                        v-if="scope.row.is_disabled"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="lockRole([scope.row.role_id], false)"
                        title="禁用"
                    ></el-button>
                    <el-button
                        v-if="!scope.row.is_disabled"
                        type="primary"
                        icon="el-icon-circle-check"
                        size="mini"
                        circle
                        @click.native="lockRole([scope.row.role_id], true)"
                        title="启用"
                    >
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

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
import { QueryRoleByParam, LockRole } from '@api/sys.role'
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
            params: {},
            centerDialogVisible: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            if (isTrue) this.centerDialogVisible = false
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
                checkKey: {
                    route: [],
                    menu: []
                }
            }
            this.centerDialogVisible = true
            this.$refs.roleInfo.getAllList()
        },
        editRole(params) {
            this.title = '编辑角色'
            this.params = params
            this.centerDialogVisible = true
            this.$refs.roleInfo.getAllList()
        },
        lockRole(keys, is_disabled) {
            this.$confirm(!is_disabled ? '确定要禁用吗' : '确定要启用吗',
                !is_disabled ? '禁用角色' : '启用角色',
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
                this.init()
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
</style>