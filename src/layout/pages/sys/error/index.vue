<template>
    <admin-container>
        <template v-slot:header>
            <el-form inline>
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
                label="操作IP"
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

<script setup lang="ts">
import { RefreshRight } from "@element-plus/icons-vue";
import { QueryLogByParam } from "@/api/sys.log";
import { ref, onMounted } from "vue";
import Pagination from "@/layout/pages/pagination/index.vue";
import Dialog from "@/layout/pages/dialog/index.vue";

const logData = ref([]);
const page = ref(1);
const total = ref(0);
const size = ref(20);
const error = ref("");
const loading = ref(false);
const centerDialogVisible = ref(false);

function init() {
    let params = {
        type: [0, 1], // 其他类型
        status: [1, 2],
        page: page.value,
        page_size: size.value,
    };

    loading.value = true;
    QueryLogByParam(params)
        .then(async (res) => {
            logData.value = res.data;
            total.value = res.total;
            loading.value = false;
        })
        .catch(() => {
            loading.value = false;
        });
}

function handleClose(visible, content) {
    if (content) error.value = content;
    centerDialogVisible.value = visible;
}

function handleSize(size) {
    page.value = 1;
    size.value = size;
    init();
}

function handleCurrent(page) {
    page.value = page;
    init();
}

onMounted(() => {
    init();
});
</script>

<style scoped>
.el-form-item.el-form-item {
    margin-bottom: 0;
    margin-right: 16px;
}
</style>
