<template>
    <d2-container>
        <el-form
            :inline="true"
            slot="header"
            size="mini"
        >
            <el-form-item>
                <el-input
                    placeholder="请输入内容"
                    v-model="name"
                    clearable
                    :clear="clear(name)"
                >
                </el-input>
                <el-select
                    v-model="lock"
                    placeholder="请选择"
                    clearable
                    size="mini"
                    :clear="clear(lock)"
                >
                    <el-option
                        v-for="item in lockOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-select
                    v-model="method"
                    placeholder="请选择"
                    clearable
                    size="mini"
                    :clear="clear(method)"
                >
                    <el-option
                        v-for="item in methodOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-button
                    icon="el-icon-search"
                    size="mini"
                    type="primary"
                    @click="changeAll"
                ></el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="addInterface"
                >新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="interfaceData"
            style="width: 100%"
            size="mini"
            type="ghost"
            v-loading="loading"
        >
            <el-table-column
                prop="name"
                label="名称"
                align="left"
            >
            </el-table-column>
            <el-table-column
                prop="path"
                label="路由"
                align="left"
                width="260"
            >
            </el-table-column>
            <el-table-column
                prop="method"
                label="请求方式"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述"
                align="left"
            >
            </el-table-column>
            <el-table-column
                prop="identification"
                label="标识"
                align="left"
            >
                <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.identification}}</el-tag>
                </template>
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
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit"
                        v-if="scope.row.isLock"
                        size="mini"
                        circle
                        @click.native="editInterface(scope.row)"
                        title="编辑"
                    ></el-button>
                    <el-button
                        type="danger"
                        v-if="scope.row.isLock"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="lockInterface([scope.row], false)"
                        title="禁用"
                    ></el-button>
                    <el-button
                        v-if="!scope.row.isLock"
                        type="primary"
                        icon="el-icon-circle-check"
                        size="mini"
                        circle
                        @click.native="lockInterface([scope.row], true)"
                        title="启用"
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
import { QueryInterfaceByParam, LockInterface } from '@api/sys.interface'
import Pagination from '@/pages/pagination/index.vue'
import Info from './info.vue'
export default {
    name: 'sys-interface',
    components: { Pagination, Info },
    data() {
        return {
            interfaceData: [],
            page: 1,
            total: 0,
            size: 20,
            lock: '',
            isLock: '',
            lockOption: [
                { label: '启用', value: 'true' },
                { label: '禁用', value: 'false' }
            ],
            method: '',
            isMethod: '',
            methodOption: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' }
            ],
            name: '',
            isName: '',
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
            let params = {
                page: this.page,
                page_size: this.size
            }
            if (this.isLock != '') params['isLock'] = this.isLock
            if (this.isName != '') params['name'] = this.isName
            if (this.isMethod != '') params['method'] = this.isMethod

            this.loading = true
            QueryInterfaceByParam(params)
                .then(async res => {
                    this.total = res.total
                    this.interfaceData = res.data
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        changeAll() {
            this.isLock = this.lock
            this.isName = this.name
            this.isMethod = this.method
            this.init()
        },
        clear(val) {
            val = ''
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
        handleClose() {
            this.centerDialogVisible = false
        },
        addInterface() {
            this.title = '新建接口'
            this.params = {
                name: '',
                path: '',
                method: 'GET',
                description: '',
                identification: '',
                menu_id: ''
            }
            this.centerDialogVisible = true
        },
        editInterface(params) {
            this.title = '编辑接口'
            this.params = params
            this.centerDialogVisible = true
        },
        lockInterface(keys, isLock) {
            this.$confirm(!isLock ? '确定要禁用吗' : '确定要启用吗',
                !isLock ? '禁用接口' : '启用接口',
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
            let id = keys.map((i) => {
                return i.interface_id
            }), interfaces = this.$store.state.d2admin.user.info.interfaces

            LockInterface({
                interface_id: id,
                isLock: isLock
            }).then(async res => {
                this.init()
                if (isLock) {
                    keys.map((i) => {
                        interfaces.push(i)
                    })
                } else {
                    keys.map((item) => {
                        for (let i = 0; i < interfaces.length; i++) {
                            if (interfaces[i].interface_id == item.interface_id) {
                                interfaces.splice(i, 1)
                                break
                            }
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.el-select {
    padding-right: 5px;
}

.el-input--mini {
    width: 200px;
    padding-right: 5px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}
</style>