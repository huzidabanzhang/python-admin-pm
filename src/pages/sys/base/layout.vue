<template>
    <el-dialog
        title="数据库管理"
        :visible.sync="Show"
        width="40%"
        append-to-body
        destroy-on-close
        @closed="close"
    >
        <el-form
            :inline="true"
            class="form-right"
        >
            <el-form-item>
                <el-button
                    type="primary"
                    :disabled="mark_btn.export"
                    @click="exportBase"
                    v-premissions="{
                        mark: mark.base.export,
                        type: 'export'
                    }"
                >备份数据库</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    @click="importBase"
                    v-if="isMark()"
                >导入数据库</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="danger"
                    @click="initBase"
                    v-if="isMark()"
                >重置数据库</el-button>
            </el-form-item>
        </el-form>

        <input
            type="file"
            style="display: none"
            ref="SQL_FILE"
            @change="importSql"
        >

        <Info
            :params="form"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
        ></Info>
    </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import Info from './select.vue'
import { AgainCreateDrop, ImportSql } from '@api/sys.base'
import util from '@/libs/util.js'
import setting from '@/setting.js'
export default {
    name: 'BasePage',
    props: {
        Visible: Boolean
    },
    components: { Info },
    data () {
        return {
            admin: setting.SYS_ADMIN.mark,
            mark: setting.mark,
            mark_btn: {
                export: false
            },
            Show: false,
            centerDialogVisible: false,
            form: {
                type: 1
            },
            user: this.$store.getters['chubby/user/user']
        }
    },
    watch: {
        Visible (newVal) {
            this.Show = newVal
        }
    },
    methods: {
        ...mapActions('chubby/account', [
            'logout'
        ]),
        initBase () {
            this.$confirm('重置数据库将清空所有数据，确定要重置吗？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    let loadingInstance = this.$loading(this.loadOption('正在重置数据库中.....'))
                    AgainCreateDrop()
                        .then(async res => {
                            loadingInstance.close()
                            this.sqlognout()
                        })
                        .catch(async res => {
                            loadingInstance.close()
                        })
                })
        },
        close () {
            this.$emit('handleClose', false)
        },
        handleClose () {
            this.centerDialogVisible = false
        },
        isMark () {
            if (this.user && Object.keys(this.user).length > 0)
                return this.user.mark == this.admin
            return false
        },
        exportBase () {
            this.form.type = 1
            this.centerDialogVisible = true
        },
        importBase () {
            this.$confirm('导入数据库将覆盖所有数据，确定要导入吗？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.$refs.SQL_FILE.click()
                })
        },
        sqlognout () {
            this.$confirm('请重新登录', '提示',
                {
                    confirmButtonText: '确定',
                    type: 'success',
                    showClose: false,
                    showCancelButton: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    closeOnHashChange: false
                }).then(() => {
                    this.logout()
                })
        },
        importSql (event) {
            let formData = new FormData(), file = event.target.files

            if (file.length == 0) return this.$message.warning('请选择上传文件')

            formData.append('document', file[0])

            let loadingInstance = this.$loading(this.loadOption('正在导入数据库中.....'))

            ImportSql(
                formData
            ).then((response) => {
                loadingInstance.close()
                this.sqlognout()
                this.$refs.SQL_FILE.value = ''
            }).catch(async res => {
                loadingInstance.close()
                this.$refs.SQL_FILE.value = ''
            })
        }
    }
}
</script>

<style scoped>
.el-form-item:last-child {
    margin-bottom: 0;
}
</style>