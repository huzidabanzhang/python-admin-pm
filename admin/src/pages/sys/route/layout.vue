<template>
    <d2-container>
        <el-form
            :inline="true"
            slot="header"
            size="mini"
        >
            <el-form-item>
                <el-select
                    v-model="lock"
                    placeholder="请选择"
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
                ></el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="addRoute"
                >新增
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-close"
                    @click="lockRoute(route_id)"
                >禁用</el-button>
            </el-form-item>
        </el-form>

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
                        size="medium"
                        type="primary"
                        v-if="scope.row.cache"
                    >是</el-tag>
                    <el-tag
                        size="medium"
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
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit"
                        v-if="scope.row.is_disabled"
                        size="mini"
                        circle
                        @click.native="editRoute(scope.row)"
                        title="编辑"
                    ></el-button>
                    <el-button
                        type="danger"
                        v-if="scope.row.is_disabled"
                        icon="el-icon-close"
                        size="mini"
                        circle
                        @click.native="lockRoute([scope.row.route_id], false)"
                        title="禁用"
                    ></el-button>
                    <el-button
                        v-else
                        type="primary"
                        icon="el-icon-check"
                        size="mini"
                        circle
                        @click.native="lockRoute([scope.row.route_id], true)"
                        title="启用"
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
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryRouteByParam, LockRoute } from '@api/sys.route'
import { cloneDeep } from 'lodash'
import Info from './info.vue'
import util from '@/libs/util.js'
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
            route_id: []
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
                    this.routeData = util.dealData(res, 2, false)
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
        },
        addRoute() {
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
        editRoute(params) {
            this.title = '编辑路由'
            this.params = params
            this.centerDialogVisible = true
        },
        lockRoute(keys, is_disabled) {
            this.$confirm(!is_disabled ? '确定要禁用吗' : '确定要启用吗',
                !is_disabled ? '禁用路由' : '启用路由',
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
                this.init(true)
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