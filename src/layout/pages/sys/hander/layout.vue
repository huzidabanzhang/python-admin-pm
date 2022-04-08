<template>
    <admin-container>
        <template v-slot:header>
            <el-form inline>
                <el-form-item>
                    <el-select
                        placeholder="请选择"
                        clearable
                        v-model="value"
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
                        type="primary"
                        :icon="Search"
                        @click="changeStatus"
                    ></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        circle
                        title="刷新"
                        :icon="RefreshRight"
                        @click="init"
                    ></el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table
            v-loading="loading"
            :data="logData"
            style="width: 100%"
            type="ghost"
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

<script setup>
import {
    Search,
    RefreshRight,
} from '@element-plus/icons-vue'
import { QueryLogByParam } from '@/api/sys.log'
import { ref, onMounted } from 'vue'
import Pagination from '@/layout/pages/pagination/index.vue'

const statusOption = [
    { label: '成功', value: 0 },
    { label: '失败', value: 1 }
]
const logData = ref([])
const page = ref(1)
const total = ref(0)
const size = ref(20)
const value = ref('')
const loading = ref(false)

function init () {
    let params = {
        type: [0], // 其他类型
        page: page.value,
        page_size: size.value
    }
    if (value.value != '') params['status'] = [value.value]

    loading.value = true
    QueryLogByParam(params)
        .then(async (res) => {
            logData.value = res.data
            total.value = res.total
            loading.value = false
        })
        .catch(() => {
            loading.value = false
        })
}

function changeStatus () {
    page.value = 1
    init()
}

function handleSize (size) {
    page.value = 1
    size.value = size
    init()
}

function handleCurrent (page) {
    page.value = page
    init()
}

onMounted(() => {
    init()
})
</script>

<style scoped>
.el-select {
    width: 120px;
}
.el-form-item.el-form-item {
    margin-bottom: 0;
}
</style>
