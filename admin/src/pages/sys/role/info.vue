<template>
    <el-dialog :title="title" :visible.sync="Visible" width="50%" append-to-body destroy-on-close
        @closed="handleClosed">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="角色名">
                <el-input v-model="name"></el-input>
            </el-form-item>
        </el-form>
        <!-- <el-tree :props="props" :load="loadNode" show-checkbox @check-change="handleCheckChange">
        </el-tree>
        <el-tree :props="props" :load="loadNode" show-checkbox @check-change="handleCheckChange">
        </el-tree> -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClosed">取 消</el-button>
            <el-button type="primary" @click="handelInfo" :loading="isSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { QueryMenuByParam } from '@api/sys.menu'
import { QueryRouteByParam } from '@api/sys.route'
export default {
    props: {
        title: String,
        params: Object,
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            name: '',
            isSubmit: false
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
        }
    },
    create() {
        this.init()
    },
    methods: {
        init() {

        },
        handelInfo() {

        },
        handleClosed() {
            this.$emit('handleClose', false)
        }
    }
}
</script>
