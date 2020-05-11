<template>
    <el-dialog
        title="备份数据库"
        :visible.sync="Visible"
        width="40%"
        append-to-body
        destroy-on-close
        @closed="handleClosed"
    >
        <el-form
            label-width="80px"
            :model="form"
            :rules="rules"
            size="mini"
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
                @click="handleClosed"
                size="mini"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="exportSql"
                :loading="loading"
                size="mini"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { ExportSql } from '@api/sys.base'
import { cloneDeep } from 'lodash'
export default {
    props: {
        params: Object,
        centerDialogVisible: Boolean
    },
    data () {
        return {
            Visible: this.centerDialogVisible,
            loading: false,
            rules: {
                type: [
                    { required: true, message: '请选择备份方式', trigger: 'change' }
                ]
            },
            form: {
                type: 1
            },
            typeOption: [
                { label: '数据加表结构', value: 1 },
                { label: '表结构不包含数据', value: 2 },
                { label: '数据不包含表结构', value: 3 }
            ]
        }
    },
    watch: {
        centerDialogVisible (newVal) {
            this.Visible = newVal
            if (newVal) this.form = cloneDeep(this.params)
        }
    },
    methods: {
        handleClosed () {
            this.$emit('handleClose', false)
        },
        exportSql () {
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
                this.$emit('handleClose', false)
            }).catch(() => {
                this.loading = false
            })
        }
    }
}
</script>