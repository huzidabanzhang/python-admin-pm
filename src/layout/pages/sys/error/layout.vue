<template>
    <admin-container>
        <template v-slot:header>
            <el-form :inline="true">
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
            <el-table-column
                prop="content"
                label="操作"
                align="center"
            >
                <template v-slot="scope">
                    <el-button
                        type="text"
                        @click="handleClose(true, scope.row.content)"
                    >异常信息</el-button>
                </template>
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

        <Dialog
            title="异常信息"
            :content="error"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
        ></Dialog>
    </admin-container>
</template>

<script>
import { RefreshRight as ElIconRefreshRight } from '@element-plus/icons'
import * as Vue from 'vue'
import { QueryLogByParam } from '@/api/sys.log'
import Pagination from '@/layout/pages/pagination/index.vue'
import Dialog from '@/layout/pages/dialog/index.vue'
export default {
    data () {
        return {
            logData: [],
            page: 1,
            total: 0,
            size: 20,
            centerDialogVisible: false,
            error: '',
            loading: false,
            ElIconRefreshRight,
        }
    },
    name: 'LorError',
    components: {
        Pagination,
        Dialog,
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            let params = {
                type: [0, 1], // 其他类型
                status: [1, 2],
                page: this.page,
                page_size: this.size,
            }

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
        handleSize (size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent (page) {
            this.page = page
            this.init()
        },
        handleClose (isShow, error) {
            if (error) this.error = error
            this.centerDialogVisible = isShow
        },
    },
}
</script>

<style scoped>
.el-form-item.el-form-item {
    margin-bottom: 0;
}
</style>
