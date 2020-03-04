<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addRoute(mark_btn.add)"
                title="新增"
                v-premissions="{
                    mark: mark.route.add,
                    type: 'add'
                }"
            >
            </el-button>
            <el-button
                type="success"
                icon="el-icon-check"
                size="mini"
                circle
                @click="lockRoute(route_id, false)"
                title="启用"
                :disabled="mark_btn.all_lock"
                v-premissions="{
                    mark: mark.route.all_lock,
                    type: 'all_lock',
                    not_disabled: true
                }"
            >
            </el-button>
            <el-button
                type="info"
                size="mini"
                icon="el-icon-close"
                circle
                @click="lockRoute(route_id, true)"
                title="禁用"
                :disabled="mark_btn.all_lock"
                v-premissions="{
                    mark: mark.route.all_lock,
                    type: 'all_lock',
                    not_disabled: true
                }"
            ></el-button>
            <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="delRoute(route_id)"
                title="删除"
                :disabled="mark_btn.all_del"
                v-premissions="{
                    mark: mark.route.all_del,
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
                    <el-select
                        v-model="lock"
                        placeholder="路由状态"
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
                    <el-button
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="changeLock"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            :data="routeData"
            style="width: 100%"
            size="mini"
            type="ghost"
            v-loading="loading"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="id"
            @select="changeSelect"
            @select-all="changeSelect"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column
                prop="title"
                label="路由名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="component"
                label="组件"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="componentPath"
                label="组件路径"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="cache"
                label="keep-alive"
                align="center"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="smaill"
                        type="primary"
                        v-if="scope.row.cache"
                    >是</el-tag>
                    <el-tag
                        size="smaill"
                        type="info"
                        v-else
                    >否</el-tag>
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
                align="center"
            >
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click.native="editRoute(scope.row, mark_btn.set)"
                        title="编辑"
                        v-premissions="{
                            mark: mark.route.set,
                            type: 'set'
                        }"
                    ></el-button>
                    <el-button
                        type="info"
                        v-if="!scope.row.is_disabled"
                        icon="el-icon-close"
                        size="mini"
                        circle
                        @click.native="lockRoute([scope.row.route_id], true)"
                        title="禁用"
                        :disabled="mark_btn.lock"
                        v-premissions="{
                            mark: mark.route.lock,
                            type: 'lock'
                        }"
                    ></el-button>
                    <el-button
                        v-else
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        circle
                        @click.native="lockRoute([scope.row.route_id], false)"
                        title="启用"
                        :disabled="mark_btn.lock"
                        v-premissions="{
                            mark: mark.route.lock,
                            type: 'lock'
                        }"
                    >
                    </el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="delRoute([scope.row.route_id])"
                        title="删除"
                        :disabled="mark_btn.del"
                        v-premissions="{
                            mark: mark.route.del,
                            type: 'del'
                        }"
                    >
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Info
            ref="routeInfo"
            :title="title"
            :params="params"
            :centerDialogVisible="centerDialogVisible"
            :parent="routeData"
            :submit="btn_submit"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryRouteByParam, LockRoute, DelRoute } from '@api/sys.route'
import { cloneDeep } from 'lodash'
import Info from './info.vue'
import util from '@/libs/util.js'
import setting from '@/setting.js'
export default {
    name: 'sys-route',
    components: { Info },
    data() {
        return {
            routeData: [],
            lock: '',
            is_disabled: '',
            lockOption: [
                { label: '启用', value: 'true' },
                { label: '禁用', value: 'false' }
            ],
            loading: false,
            title: '',
            params: {},
            centerDialogVisible: false,
            route_id: [],
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
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            if (isTrue) this.centerDialogVisible = false
            let params = {}
            if (this.is_disabled != '') params['is_disabled'] = this.is_disabled

            this.loading = true
            QueryRouteByParam(params)
                .then(async res => {
                    let data = cloneDeep(res)
                    this.routeData = util.dealData(res, 2)
                    this.loading = false
                    // 更新当前路由
                    if (isTrue) util.initRoute(data, 2, true)
                })
                .catch(() => {
                    this.loading = false
                })
        },
        changeLock() {
            this.is_disabled = this.lock
            this.init()
        },
        clearLock() {
            this.lock = ''
        },
        handleClose() {
            this.centerDialogVisible = false
        },
        changeSelect(selection) {
            this.route_id = selection.map((i) => {
                return i.route_id
            })
            let data = this.$store.getters['d2admin/user/interfaces']
            if (data) {
                let del = data.filter((i) => {
                    return i.mark == this.mark.route.all_del
                }), lock = data.filter((i) => {
                    return i.mark == this.mark.route.all_lock
                })
                if (del.length > 0 && !del[0].is_disabled) 
                    this.mark_btn.all_del = this.route_id.length == 0
                if (lock.length > 0 && !lock[0].is_disabled) 
                    this.mark_btn.all_lock = this.route_id.length == 0
            }
        },
        addRoute(disabled) {
            this.btn_submit = disabled
            this.title = '新建路由'
            this.params = {
                pid: '0',
                name: '',
                title: '',
                path: '',
                component: '',
                componentPath: '',
                cache: true
            }
            this.centerDialogVisible = true
        },
        editRoute(params, disabled) {
            this.btn_submit = disabled
            this.title = '编辑路由'
            this.params = params
            this.centerDialogVisible = true
        },
        lockRoute(keys, is_disabled) {
            if (keys.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm(is_disabled ? '确定要禁用该路由吗' : '确定要启用该路由吗',
                is_disabled ? '禁用路由' : '启用路由',
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
            LockRoute({
                route_id: keys,
                is_disabled: is_disabled
            }).then(async res => {
                this.route_id = []
                this.init(true)
            })
        },
        delRoute(route_id) {
            if (route_id.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm('确定要删除该路由吗', '删除路由',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelRoute({
                        route_id: route_id
                    }).then(async res => {
                        this.$message.success('删除路由成功')
                        this.route_id = []
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