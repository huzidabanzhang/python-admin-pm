<template>
    <el-dialog
        title="编辑用户"
        :visible.sync="Visible"
        width="40%"
        append-to-body
        destroy-on-close
        :close-on-click-modal="false"
        @closed="handleClosed(false)"
    >
        <el-form
            label-width="80px"
            ref="salaryUser"
            :model="form"
            :rules="rules"
            size="mini"
        >
            <el-form-item
                label="手机号"
                prop="phone"
            >
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item
                label="身份证"
                prop="id_card"
            >
                <el-input v-model="form.id_card"></el-input>
            </el-form-item>
        </el-form>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                @click="handleClosed(false)"
                size="mini"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="handelInfo"
                :loading="isSubmit"
                size="mini"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { SetUser } from '@api/salary.user'
import { cloneDeep } from 'lodash'
export default {
    props: {
        params: Object,
        centerDialogVisible: Boolean
    },
    data() {
        return {
            Visible: this.centerDialogVisible,
            form: {},
            rules: {
                phone: [
                    { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
                ],
                id_card: [
                    { pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
, message: '请输入正确的身份证', trigger: ['blur', 'change'] }
                ]
            },
            isSubmit: false
        }
    },
    watch: {
        centerDialogVisible(newVal) {
            this.Visible = newVal
            if (newVal) this.form = cloneDeep(this.params)
        }
    },
    methods: {
        handelInfo() {
            this.$refs.salaryUser.validate((valid) => {
                if (valid) {
                    this.isSubmit = true
                    let params = this.form

                    SetUser(params)
                        .then(async res => {
                            this.$message.success('编辑成功')
                            this.isSubmit = false
                            this.handleClosed(true)
                        })
                        .catch(() => {
                            this.isSubmit = false
                        })
                }
            })
        },
        handleClosed(is) {
            this.$emit('handleClose', is)
        }
    }
}
</script>