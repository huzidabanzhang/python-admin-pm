<template>
    <admin-container>
        <template v-slot:header>
            <el-form inline>
                <el-form-item>
                    <el-select placeholder="请选择" clearable v-model="value">
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
                    <el-button type="primary" :icon="Search" @click="changeStatus"></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button circle title="刷新" :icon="RefreshRight" @click="init"></el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table v-loading="loading" :data="logData" style="width: 100%" type="ghost">
            <el-table-column prop="username" label="用户名" align="center"> </el-table-column>
            <el-table-column prop="type" label="操作类型" align="center">
                <template v-slot="scope">
                    <el-tag>登录</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.status === 0" type="success">成功</el-tag>
                    <el-tag v-else-if="scope.row.status === 1" type="danger">失败</el-tag>
                    <el-tag v-else type="info">隐藏</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="操作IP" align="center"> </el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"> </el-table-column>
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

<script setup lang="ts">
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { QueryLogByParam } from '@/api/sys.log'
import { ref, onMounted } from 'vue'
import Pagination from '@/layout/pages/pagination/index.vue'

const statusOption = [
    { label: '成功', value: 0 },
    { label: '失败', value: 1 },
    { label: '隐藏', value: 2 }
]
const logData = ref([])
const page = ref(1)
const total = ref(0)
const size = ref(20)
const value = ref('')
const loading = ref(false)

function init() {
    let params = {
        type: [1], // 其他类型
        page: page.value,
        page_size: size.value
    }
    if (value.value !== '') params['status'] = [value.value]

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

function changeStatus() {
    page.value = 1
    init()
}

function handleSize(size) {
    page.value = 1
    size.value = size
    init()
}

function handleCurrent(page) {
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
    margin-right: 16px;
}
</style>
