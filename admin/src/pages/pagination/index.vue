<template>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page" :page-sizes="[20, 50, 100]" :page-size="size"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</template>

<script>
export default {
    props: {
        size: Number,
        total: Number,
        page: Number
    },
    methods: {
        handleSizeChange(val) {
            this.$emit('handleSize', val)
        },
        handleCurrentChange(val) {
            this.$emit('handleCurrent', val)
        }
    }
}
</script>
