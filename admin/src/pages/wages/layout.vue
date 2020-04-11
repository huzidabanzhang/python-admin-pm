<template>
    <d2-container>
        <div slot="header">
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
                <!-- <el-form-item>
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
                </el-form-item> -->
                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="centerDialogVisible = true"
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
        </el-table>

        <Info
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryWagesByParam } from '@api/wages.wages'
import { cloneDeep } from 'lodash'
import Info from './info.vue'
export default {
    name: 'wages-wages',
    components: { Info },
    data() {
        return {
            routeData: [],
            loading: false,
            title: '',
            params: {},
            centerDialogVisible: false,
            route_id: [],
            btn_submit: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            // if (isTrue) this.centerDialogVisible = false
            // let params = {}
            // if (this.is_disabled != '') params['is_disabled'] = this.is_disabled

            // this.loading = true
            // QueryRouteByParam(params)
            //     .then(async res => {
            //         let data = cloneDeep(res)
            //         this.routeData = util.dealData(res, 2)
            //         this.loading = false
            //         // 更新当前路由
            //         if (isTrue) util.initRoute(data, 2, true)
            //     })
            //     .catch(() => {
            //         this.loading = false
            //     })
        },
        handleClose() {
            this.centerDialogVisible = false
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