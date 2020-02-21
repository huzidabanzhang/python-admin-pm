<template>
    <d2-container>
        <el-form
            :inline="true"
            size="mini"
            class="form-right"
        >
            <el-form-item>
                <el-button
                    size="mini"
                    type="primary"
                    :disabled="mark_btn.export"
                    v-premissions="{
                        mark: mark.base.export,
                        type: 'export'
                    }"
                >备份数据库</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    size="mini"
                    :disabled="mark_btn.import"
                    v-premissions="{
                        mark: mark.base.import,
                        type: 'import'
                    }"
                >导入数据库</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    size="mini"
                    type="danger"
                >重置数据库</el-button>
            </el-form-item>
        </el-form>
    </d2-container>
</template>

<script>
import { AgainCreateDrop, ImportSql, ExportSql } from '@api/sys.route'
import util from '@/libs/util.js'
import setting from '@/setting.js'
import store from '@/store/index'
export default {
    name: 'sys-base',
    data() {
        return {
            mark: setting.mark,
            mark_btn: {
                export: false,
                import: false
            }
        }
    },
    methods: {
        importBase(keys, is_disabled) {
            if (keys.length == 0) return this.$message({
                message: '未选择任何记录',
                type: 'warning',
                duration: 3 * 1000
            })

            this.$confirm(is_disabled ? '确定要禁用该路由吗' : '确定要启用该路由吗',
                is_disabled ? '禁用路由' : '启用路由',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(keys, is_disabled)
                })
        },
        importBase(route_id) {
            if (route_id.length == 0) return this.$message({
                message: '未选择任何记录',
                type: 'warning',
                duration: 3 * 1000
            })

            this.$confirm('确定要删除该路由吗', '删除路由',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelRoute({
                        route_id: route_id
                    }).then(async res => {
                        this.$message({
                            message: '删除路由成功',
                            type: 'success',
                            duration: 3 * 1000
                        })
                        this.route_id = []
                        this.init()
                    })
                })
        }
    }
}
</script>