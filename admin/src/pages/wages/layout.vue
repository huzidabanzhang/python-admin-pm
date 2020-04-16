<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="success"
                size="mini"
                icon="el-icon-upload"
                @click="centerDialogVisible = true"
            >上传</el-button>

            <el-button
                type="primary"
                size="mini"
            ><a
                    href="http://wages.ye9418.com/test.xlsx"
                    style="color: white;"
                ><i class="el-icon-download"></i>模板</a></el-button>

            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delWages(rid)"
                circle
                title="删除"
            ></el-button>

            <el-button
                icon="el-icon-refresh-right"
                size="mini"
                @click="init"
                circle
                title="刷新"
            ></el-button>

            <el-form
                :inline="true"
                size="mini"
                class="form-right"
            >
                <el-form-item>
                    <el-input
                        placeholder="公司"
                        v-model="company"
                        clearable
                        :clear="clear(company)"
                    >
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-input
                        placeholder="姓名"
                        v-model="name"
                        clearable
                        :clear="clear(name)"
                    >
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                        v-model="payment_time"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择工资时间"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="init"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            :data="wageData"
            style="width: 100%"
            size="mini"
            type="ghost"
            v-loading="loading"
            @select="changeSelect"
            @select-all="changeSelect"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form
                        label-position="left"
                        inline
                        class="demo-table-expand"
                    >
                        <el-form-item
                            v-for="(item, key) in props.row.wages"
                            :label="key"
                            :key="key"
                        >
                            <span>{{ item }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="company"
                label="公司"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="id_card"
                label="身份证"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="payment_time"
                label="工资时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="content"
                label="操作"
                align="left"
            >
                <template slot-scope="scope">
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="delWages([scope.row.wages_id])"
                        title="删除"
                    >
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination
            slot="footer"
            :page="page"
            :total="total"
            :size="size"
            @handleSize="handleSize"
            @handleCurrent="handleCurrent"
        ></Pagination>

        <Info
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryWagesByParam, DelWages } from '@api/wages.wages'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
import Info from './info.vue'
export default {
    name: 'wages-wages',
    components: { Info, Pagination },
    data() {
        return {
            page: 1,
            total: 0,
            size: 20,
            wageData: [],
            loading: false,
            company: '',
            name: '',
            payment_time: '',
            params: {},
            centerDialogVisible: false,
            btn_submit: false,
            rid: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            if (isTrue) this.centerDialogVisible = false
            let params = {
                page: this.page,
                page_size: this.size
            }
            if (this.company != '') params['company'] = this.company
            if (this.name != '') params['name'] = this.name
            if (this.payment_time != '') params['payment_time'] = this.payment_time

            this.loading = true
            QueryWagesByParam(params)
                .then(async res => {
                    this.wageData = res.data
                    this.total = res.total
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        handleClose() {
            this.init(true)
        },
        handleSize(size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent(page) {
            this.page = page
            this.init()
        },
        clear(val) {
            val = ''
        },
        changeSelect(selection) {
            this.rid = selection.map((i) => {
                return i.wages_id
            })
        },
        delWages(rid) {
            if (rid.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm('确定要删除选择的记录吗', '删除记录',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.loading = true
                    DelWages({
                        rid: rid
                    }).then(async res => {
                        this.rid = []
                        this.$message.success('删除成功')
                        this.init()
                    })
                        .catch(() => {
                            this.loading = false
                        })
                })
        }
    }
}
</script>

<style scoped>
.el-select {
    width: 120px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}

.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}

.form-right {
    float: right;
}

.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>