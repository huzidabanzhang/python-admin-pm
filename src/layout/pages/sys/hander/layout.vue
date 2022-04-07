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
                prop="path"
                label="请求URL"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="method"
                label="请求方式"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="params"
                label="请求参数"
                align="center"
            >
                <template v-slot="scope">
                    <el-popover
                        trigger="hover"
                        placement="bottom"
                        width="400"
                    >
                        <p>{{ scope.row.params }}</p>
                        <template v-slot:reference>
                            <div class="name-wrapper">
                                {{ scope.row.params }}
                            </div>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="time"
                label="请求时长(ms)"
                align="center"
            >
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
                        v-else
                    >失败</el-tag>
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
            ],
            loading: false,
            ElIconSearch,
            ElIconRefreshRight,
        }
    },
    name: 'LogHander',
    components: {
        Pagination,
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            let params = {
                type: [0], // 其他类型
                page: this.page,
                page_size: this.size,
            }
            if (this.status != '') params['status'] = [this.status]

            this.loading = true
            QueryLogByParam(params)
                .then(async (res) => {
                    this.logData = res.data
                    this.total = res.total
                    this.loading = false
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
