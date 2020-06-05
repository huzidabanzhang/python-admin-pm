<template>
    <chubby-container>
        <div slot="header">
            <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                @click="addInterface(auth.add)"
                title="新增"
                v-auth:add_interface
            ></el-button>
            <el-button
                type="success"
                icon="el-icon-check"
                circle
                @click="lockInterface(interface_id, false)"
                title="显示"
                :disabled="auth.lock_all"
            ></el-button>
            <el-button
                type="info"
                icon="el-icon-close"
                circle
                @click="lockInterface(interface_id, true)"
                title="隐藏"
                :disabled="auth.lock_all"
            ></el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delInterface(interface_id)"
                title="删除"
                :disabled="auth.del_all"
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
                    <el-input
                        placeholder="接口名称"
                        v-model="name"
                        clearable
                        :clear="clear(name)"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="lock"
                        placeholder="可见性"
                        clearable
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
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="method"
                        placeholder="请求方式"
                        clearable
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
                </el-form-item>
                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        type="primary"
                        :loading="loading"
                        @click="changeAll"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            :data="interfaceData"
            style="width: 100%"
            height="100%"
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
                prop="name"
                label="名称"
                align="left"
                width="200"
            >
            </el-table-column>
            <el-table-column
                prop="path"
                label="路由"
                align="left"
            >
            </el-table-column>
            <el-table-column
                prop="method"
                label="请求方式"
                align="center"
                width="100"
            >
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述"
                align="left"
                width="200"
            >
            </el-table-column>
            <el-table-column
                prop="mark"
                label="标识"
                align="left"
                width="200"
            >
                <template slot-scope="scope">
                    <el-tag>{{scope.row.mark}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="disable"
                label="可见性"
                align="left"
                width="150"
            >
                <template slot-scope="scope">
                    <el-radio-group
                        v-model="scope.row.disable"
                        v-if="isSelect(scope.row) && !scope.row.forbid"
                        :disabled="auth.lock"
                        @change="(label) => {lockInterface([scope.row.interface_id], label, scope.row)}"
                    >
                        <el-radio-button :label="false">显示</el-radio-button>
                        <el-radio-button :label="true">隐藏</el-radio-button>
                    </el-radio-group>
                    <el-button
                        type="primary"
                        :disabled="auth.lock"
                        v-else
                    >显示</el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="操作"
                align="left"
                width="100"
            >
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit"
                        circle
                        @click.native="editInterface(scope.row, auth.set)"
                        title="编辑"
                    ></el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click.native="delInterface([scope.row.interface_id], false)"
                        v-if="isSelect(scope.row)"
                        title="删除"
                        :disabled="auth.del"
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
            :submit="btn_submit"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </chubby-container>
</template>

<script>
import { QueryInterfaceByParam, LockInterface, DelInterface } from '@api/sys.interface'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
import Info from './info.vue'
import util from '@/libs/util.js'
import setting from '@/setting.js'
export default {
    name: 'InterfacePage',
    components: { Pagination, Info },
    data () {
        return {
            interfaceData: [],
            page: 1,
            total: 0,
            size: 20,
            lock: '',
            disable: '',
            lockOption: [
                { label: '显示', value: 'false' },
                { label: '隐藏', value: 'true' }
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
            centerDialogVisible: false,
            interface_id: [],
            btn_submit: false,
            auth: {
                add: false,
                del: this.$isDisabled('del_interface'),
                set: this.$isDisabled('set_interface'),
                lock: this.$isDisabled('lock_interface'),
                del_all: true,
                lock_all: true
            },
            auth_all: {
                del: this.$isDisabled('del_interface'),
                lock: this.$isDisabled('lock_interface')
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        init (isTrue) {
            this.changeSelect([])

            if (isTrue) this.centerDialogVisible = false
            let params = {
                page: this.page,
                page_size: this.size
            }
            if (this.disable != '') params['disable'] = this.disable
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
        changeAll () {
            this.disable = this.lock
            this.isName = this.name
            this.isMethod = this.method
            this.init()
        },
        clear (val) {
            val = ''
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
        handleClose () {
            this.centerDialogVisible = false
        },
        isSelect (row) {
            return !setting.lock_interface.some((i) => {
                return i == row.mark
            })
        },
        addInterface (disabled) {
            this.btn_submit = disabled
            this.title = '新建接口'
            this.params = {
                method: 'GET',
                forbid: true,
                disable: false
            }
            this.centerDialogVisible = true
        },
        editInterface (params, disabled) {
            this.btn_submit = disabled
            this.title = '编辑接口'
            this.params = params
            this.centerDialogVisible = true
        },
        changeSelect (selection) {
            this.interface_id = selection.map((i) => {
                return i.interface_id
            })
            for (let i in this.auth_all) {
                if (!this.auth_all[i]) this.auth[i + '_all'] = this.interface_id.length == 0
            }
        },
        lockInterface (keys, disable, row) {
            if (keys.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm(disable ? '确定要隐藏该接口吗' : '确定要显示该接口吗',
                disable ? '隐藏接口' : '显示接口',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, disable)
                }).catch(() => {
                    if (row) row.disable = !disable
                })
        },
        delInterface (interface_id) {
            if (interface_id.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm('确定要删除该接口吗', '删除接口',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelInterface({
                        interface_id: interface_id
                    }).then(async res => {
                        this.getInterfaceInfo(interface_id, 1)
                        this.$message.success('接口删除成功')
                        this.init()
                    })
                })
        },
        getInterfaceInfo (interface_id, type, disable) {
            let interfaces = cloneDeep(this.$store.getters['chubby/user/interfaces'])
            interface_id.map((i) => {
                for (let j = 0; j < interfaces.length; j++) {
                    if (i == interfaces[j].interface_id) {
                        if (type == 1) {
                            interfaces.splice(j)
                            j--
                        }

                        if (type == 2) {
                            interfaces[j].disable = disable == 'true' ? true : false
                        }

                        break
                    }
                }
            })

            util.initInterface(interfaces)
        },
        Lock (keys, disable) {
            LockInterface({
                interface_id: keys,
                disable: disable
            }).then(async res => {
                this.getInterfaceInfo(keys, 2, disable)
                this.$message.success(disable ? '接口隐藏成功' : '接口显示成功')
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

.el-input--mini {
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