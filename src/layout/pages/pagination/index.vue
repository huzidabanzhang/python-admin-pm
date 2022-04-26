<template>
    <el-pagination
        style="float: right"
        :current-page="page"
        :page-sizes="pageList"
        :page-size="size"
        :layout="layout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    >
    </el-pagination>
</template>

<script setup lang="ts">
const props = defineProps({
    size: Number,
    total: Number,
    page: Number,
    pageList: {
        type: Array,
        default: function () {
            return [20, 50, 100];
        },
    },
    layout: {
        type: String,
        default: function () {
            return "total, sizes, prev, pager, next, jumper";
        },
    },
});
const emits = defineEmits(["handleSize", "handleCurrent"]);

function handleSizeChange(val) {
    emits("handleSize", val);
}

function handleCurrentChange(val) {
    emits("handleCurrent", val);
}
</script>
