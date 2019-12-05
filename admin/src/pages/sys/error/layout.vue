<template>
    <d2-container>
        <el-form
            :inline="true"
            slot="header"
            size="mini"
        >
            <el-form-item>
                <!-- <el-button icon="el-icon-search" size="mini" type="primary" @click="changeStatus"></el-button> -->
            </el-form-item>
        </el-form>

        <el-table
            :data="logData"
            style="width: 100%"
            size="mini"
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
                <template slot-scope="scope">
                    <el-popover
                        trigger="hover"
                        placement="bottom"
                        width="400"
                    >
                        <p>{{ scope.row.params }}</p>
                        <div
                            slot="reference"
                            class="name-wrapper"
                        >
                            {{ scope.row.params }}
                        </div>
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
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click.native="handleClose(true, scope.row.content)"
                    >异常信息</el-button>
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

        <Dialog
            title="异常信息"
            :content="error"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
        ></Dialog>
    </d2-container>
</template>

<script>
import { QueryLogByParam } from '@api/sys.log'
import Pagination from '@/pages/pagination/index.vue'
import Dialog from '@/pages/dialog/index.vue'
export default {
    name: 'sys-login-log',
    components: {
        Pagination,
        Dialog
    },
    data() {
        return {
            logData: [],
            page: 1,
            total: 0,
            size: 20,
            centerDialogVisible: false,
            error: '',
            loading: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            let params = {
                type: [0, 1], // 其他类型
                status: [1, 2],
                page: this.page,
                page_size: this.size
            }

            this.loading = true
            QueryLogByParam(params)
                .then(async res => {
                    this.logData = res.data
                    this.total = res.total
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
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
        handleClose(isShow, error) {
            if (error) this.error = error
            this.centerDialogVisible = isShow
        }
    }
}
</script>

<style scoped>
.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}
</style>