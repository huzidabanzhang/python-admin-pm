<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addInterface(mark_btn.add)"
                title="新增"
                v-premissions="{
                    mark: mark.interface.add,
                    type: 'add'
                }"
            ></el-button>
            <el-button
                type="success"
                icon="el-icon-check"
                size="mini"
                circle
                @click="lockInterface(interface_id, false)"
                title="启用"
                :disabled="mark_btn.all_lock"
                v-premissions="{
                    mark: mark.interface.all_lock,
                    type: 'all_lock',
                    not_disabled: true
                }"
            ></el-button>
            <el-button
                type="info"
                size="mini"
                icon="el-icon-close"
                circle
                @click="lockInterface(interface_id, true)"
                title="禁用"
                :disabled="mark_btn.all_lock"
                v-premissions="{
                    mark: mark.interface.all_lock,
                    type: 'all_lock',
                    not_disabled: true
                }"
            ></el-button>
            <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="delInterface(interface_id)"
                title="删除"
                :disabled="mark_btn.all_del"
                v-premissions="{
                    mark: mark.interface.all_del,
                    type: 'all_del',
                    not_disabled: true
                }"
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
                        placeholder="接口状态"
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
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="method"
                        placeholder="请求方式"
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
                </el-form-item>
                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="changeAll"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            :data="interfaceData"
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
                width="200"
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
                prop="mark"
                label="标识"
                align="left"
            >
                <template slot-scope="scope">
                    <el-tag size="smaill">{{scope.row.mark}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_disabled"
                label="状态"
                align="center"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="smaill"
                        type="success"
                        v-if="!scope.row.is_disabled"
                    >启用</el-tag>
                    <el-tag
                        size="smaill"
                        type="info"
                        v-else
                    >禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="操作"
                align="left"
            >
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click.native="editInterface(scope.row, mark_btn.set)"
                        title="编辑"
                        v-premissions="{
                            mark: mark.interface.set,
                            type: 'set',
                            not_hidden: true
                        }"
                    ></el-button>
                    <el-button
                        type="info"
                        v-if="!scope.row.is_disabled && isSelect(scope.row) && !scope.row.not_allow"
                        icon="el-icon-close"
                        size="mini"
                        circle
                        @click.native="lockInterface([scope.row.interface_id], true)"
                        title="禁用"
                        :disabled="mark_btn.lock"
                        v-premissions="{
                            mark: mark.interface.lock,
                            type: 'lock'
                        }"
                    ></el-button>
                    <el-button
                        v-if="isSelect(scope.row) && scope.row.is_disabled && !scope.row.not_allow"
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        circle
                        @click.native="lockInterface([scope.row.interface_id], false)"
                        title="启用"
                        :disabled="mark_btn.lock"
                        v-premissions="{
                            mark: mark.interface.lock,
                            type: 'lock'
                        }"
                    >
                    </el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="delInterface([scope.row.interface_id], false)"
                        v-if="isSelect(scope.row)"
                        title="删除"
                        :disabled="mark_btn.del"
                        v-premissions="{
                            mark: mark.interface.del,
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
            ref="roleInfo"
            :title="title"
            :params="params"
            :submit="btn_submit"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryInterfaceByParam, LockInterface, DelInterface } from '@api/sys.interface'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
import Info from './info.vue'
import util from '@/libs/util.js'
import setting from '@/setting.js'
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
            is_disabled: '',
            lockOption: [
                { label: '启用', value: 'false' },
                { label: '禁用', value: 'true' }
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
            mark: setting.mark,
            mark_btn: {
                add: false,
                del: false,
                set: false,
                lock: false,
                all_del: true,
                all_lock: true
            }
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
            if (this.is_disabled != '') params['is_disabled'] = this.is_disabled
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
            this.is_disabled = this.lock
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
        isSelect(row) {
            return !setting.lock_interface.some((i) => {
                return i == row.mark
            })
        },
        addInterface(disabled) {
            this.btn_submit = disabled
            this.title = '新建接口'
            this.params = {
                name: '',
                path: '',
                method: 'GET',
                description: '',
                mark: '',
                menu_id: '',
                not_allow: false
            }
            this.centerDialogVisible = true
        },
        editInterface(params, disabled) {
            this.btn_submit = disabled
            this.title = '编辑接口'
            this.params = params
            this.centerDialogVisible = true
        },
        changeSelect(selection) {
            this.interface_id = selection.map((i) => {
                return i.interface_id
            })
            let data = this.$store.getters['d2admin/user/interfaces']
            if (data) {
                let del = data.filter((i) => {
                    return i.mark == this.mark.interface.all_del
                }), lock = data.filter((i) => {
                    return i.mark == this.mark.interface.all_lock
                })
                if (del.length > 0 && !del[0].is_disabled) 
                    this.mark_btn.all_del = this.interface_id.length == 0
                if (lock.length > 0 && !lock[0].is_disabled) 
                    this.mark_btn.all_lock = this.interface_id.length == 0
            }
        },
        lockInterface(keys, is_disabled) {
            if (keys.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm(is_disabled ? '确定要禁用该接口吗' : '确定要启用该接口吗',
                is_disabled ? '禁用接口' : '启用接口',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, is_disabled)
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
                        this.interface_id = []
                        this.$message.success('接口删除成功')
                        this.init()
                    })
                })
        },
        getInterfaceInfo(interface_id, type, is_disabled) {
            let interfaces = cloneDeep(this.$store.getters['d2admin/user/interfaces'])
            interface_id.map((i) => {
                for (let j = 0; j < interfaces.length; j++) {
                    if (i == interfaces[j].interface_id) {
                        if (type == 1) {
                            interfaces.splice(j)
                            j--
                        }

                        if (type == 2) {
                            interfaces[j].is_disabled = is_disabled
                        }

                        break
                    }
                }
            })

            util.initInterface(interfaces)
        },
        Lock(keys, is_disabled) {
            LockInterface({
                interface_id: keys,
                is_disabled: is_disabled
            }).then(async res => {
                this.getInterfaceInfo(keys, 2, is_disabled)
                this.interface_id = []
                this.$message.success(is_disabled ? '接口禁用成功' : '接口启用成功')
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