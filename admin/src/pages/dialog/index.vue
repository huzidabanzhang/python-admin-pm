<template>
    <el-dialog :title="title" :visible.sync="Visible" width="50%" append-to-body center destroy-on-close
        @closed="handleClosed">
        <span>{{ content }}</span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        title: String,
        content: String,
        centerDialogVisible: Boolean
    },
    data () {
        return {
            Visible: this.centerDialogVisible
        }
    },
    watch: {
        centerDialogVisible(newVal){
            this.Visible = newVal
        }
    },
    methods: {
        handleClosed() {
            this.$emit('handleClose', false)
        }
    }
}
</script>
