<template>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageList"
        :page-size="size"
        :layout="layout"
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
        },
        layout: {
            type: String,
            default: function () {
                return "total, sizes, prev, pager, next, jumper"
            }
        }
    },
    methods: {
        handleSizeChange (val) {
            this.$emit('handleSize', val)
        },
        handleCurrentChange (val) {
            this.$emit('handleCurrent', val)
        }
    }
}
</script>
