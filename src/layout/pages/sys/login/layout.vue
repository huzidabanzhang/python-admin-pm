<template>
    <admin-container>
        <template v-slot:header>
            <el-form :inline="true">
                <el-form-item>
                    <el-select
                        v-model="value"
                        placeholder="请选择"
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
                        :icon="ElIconSearch"
                        type="primary"
                        @click="changeStatus"
                    ></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :icon="ElIconRefreshRight"
                        @click="init"
                        circle
                        title="刷新"
                    ></el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table
            :data="logData"
            style="width: 100%"
            type="ghost"
            v-loading="loading"
        >
            <el-table-column
                prop="username"
                label="用户名"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="type"
                label="操作类型"
                align="center"
            >
                <template v-slot="scope">
                    <el-tag>登录</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                align="center"
            >
                <template v-slot="scope">
                    <el-tag
                        type="success"
                        v-if="scope.row.status == 0"
                    >成功</el-tag>
                    <el-tag
                        type="danger"
                        v-else-if="scope.row.status == 1"
                    >失败</el-tag>
                    <el-tag
                        type="info"
                        v-else
                    >隐藏</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="ip"
                label="操作Ip"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间"
                align="center"
            >
            </el-table-column>
        </el-table>

        <template v-slot:footer>
            <Pagination
                :page="page"
                :total="total"
                :size="size"
                @handleSize="handleSize"
                @handleCurrent="handleCurrent"
            ></Pagination>
        </template>
    </admin-container>
</template>

<script>
import {
    Search as ElIconSearch,
    RefreshRight as ElIconRefreshRight,
} from '@element-plus/icons'
import * as Vue from 'vue'
import { QueryLogByParam } from '@/api/sys.log'
import Pagination from '@/layout/pages/pagination/index.vue'
export default {
    data () {
        return {
            logData: [],
            page: 1,
            total: 0,
            size: 20,
            value: '',
            status: '',
            statusOption: [
                { label: '成功', value: 0 },
                { label: '失败', value: 1 },
                { label: '隐藏', value: 2 },
            ],
            loading: false,
            ElIconSearch,
            ElIconRefreshRight,
        }
    },
    name: 'LogLogin',
    components: {
        Pagination,
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            let params = {
                type: [1], // 登录类型
                page: this.page,
                page_size: this.size,
            }
            if (this.status != '') params['status'] = [this.status]

            this.loading = true
            QueryLogByParam(params)
                .then(async (res) => {
                    this.loading = false
                    this.logData = res.data
                    this.total = res.total
                })
                .catch(() => {
                    this.loading = false
                })
        },
        changeStatus () {
            this.status = this.value
            this.init()
        },
        clearStatus () {
            this.value = ''
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
    },
}
</script>

<style scoped>
.el-select {
    width: 120px;
}
.el-form-item.el-form-item {
    margin-bottom: 0;
}
</style>
