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
                prop="isLock"
                label="状态"
                align="center"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="medium"
                        type="success"
                        v-if="scope.row.isLock"
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
                        v-if="scope.row.isLock"
                        size="mini"
                        circle
                        @click.native="editRole(scope.row)"
                        title="编辑"
                    ></el-button>
                    <el-button
                        type="danger"
                        v-if="scope.row.isLock"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="lockRole([scope.row.role_id], false)"
                        title="禁用"
                    ></el-button>
                    <el-button
                        v-if="!scope.row.isLock"
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
            isLock: '',
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
            if (this.isLock != '') params['isLock'] = this.isLock

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
            this.isLock = this.value
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
        lockRole(keys, isLock) {
            this.$confirm(!isLock ? '确定要禁用吗' : '确定要启用吗',
                !isLock ? '禁用角色' : '启用角色',
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
            LockRole({
                role_id: keys,
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
    width: 120px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}
</style>