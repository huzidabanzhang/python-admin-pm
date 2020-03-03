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
                    @click="exportBase"
                    v-premissions="{
                        mark: mark.base.export,
                        type: 'export'
                    }"
                >备份数据库</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    size="mini"
                    @click="importBase"
                    v-if="isMark()"
                >导入数据库</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    size="mini"
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

        <el-dialog
            title="备份数据库"
            :visible.sync="centerDialogVisible"
            width="40%"
            append-to-body
            destroy-on-close
            @closed="centerDialogVisible = false"
        >
            <el-form
                label-width="80px"
                :model="form"
                :rules="rules"
                size="smaill"
            >
                <el-form-item
                    label="备份方式"
                    prop="type"
                >
                    <el-select v-model="form.type">
                        <el-option
                            v-for="item in typeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="centerDialogVisible = false"
                    size="smaill"
                >取 消</el-button>
                <el-button
                    type="primary"
                    @click="exportSql"
                    :loading="loading"
                    size="smaill"
                >确 定</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
import { AgainCreateDrop, ImportSql, ExportSql } from '@api/sys.base'
import util from '@/libs/util.js'
import setting from '@/setting.js'
export default {
    name: 'sys-base',
    data() {
        return {
            admin: setting.SYS_ADMIN.mark,
            mark: setting.mark,
            mark_btn: {
                export: false
            },
            centerDialogVisible: false,
            loading: false,
            rules: {
                type: [
                    { required: true, message: '请选择备份方式', trigger: 'change' }
                ]
            },
            typeOption: [
                { label: '数据加表结构', value: 1 },
                { label: '表结构不包含数据', value: 2 },
                { label: '数据不包含表结构', value: 3 }
            ],
            form: {
                type: 1
            },
            user: this.$store.getters['d2admin/user/user']
        }
    },
    methods: {
        ...mapActions('d2admin/account', [
            'logout'
        ]),
        initBase() {
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
        isMark() {
            if (this.user && Object.keys(this.user).length > 0) 
                return this.user.mark == this.admin
            return false
        },
        exportBase() {
            this.form.type = 1
            this.centerDialogVisible = true
        },
        exportSql() {
            this.loading = true
            ExportSql({
                type: this.form.type
            }).then((response) => {
                const href = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
                let downloadElement = document.createElement('a')
                downloadElement.href = href
                downloadElement.download = response.headers.filename //下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() //点击下载
                document.body.removeChild(downloadElement);//下载完成移除元素
                window.URL.revokeObjectURL(href) //释放blob对象
                this.loading = false
                this.centerDialogVisible = false
            }).catch(() => {
                this.loading = false
            })
        },
        importBase() {
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
        sqlognout() {
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
                    this.logout({
                        confirm: false
                    })
                })
        },
        importSql(event) {
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