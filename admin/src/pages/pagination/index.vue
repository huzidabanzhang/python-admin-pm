<template>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageList"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
</template>

<script>
export default {
    props: {
        size: Number,
        total: Number,
        page: Number,
        pageList: {
            type: Array,
            default: function () {
                return [20, 50, 100]
            }
        }
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
