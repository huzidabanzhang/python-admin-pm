<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(rid)"
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
                        placeholder="手机号"
                        v-model="phone"
                        clearable
                        :clear="clear(phone)"
                    >
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-input
                        placeholder="身份证"
                        v-model="id_card"
                        clearable
                        :clear="clear(id_card)"
                    >
                    </el-input>
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
            :data="userData"
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
            <el-table-column
                prop="phone"
                label="手机号"
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
                prop="content"
                label="操作"
                align="left"
                width="100"
            >
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click.native="setUser(scope.row)"
                        title="编辑"
                    ></el-button>

                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click.native="delUser([scope.row.salary_user_id])"
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
            :params="item"
            @handleClose="handleClose"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryUserByParam, DelUser } from '@api/salary.user'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
import Info from './info.vue'
export default {
    name: 'salary-user',
    components: { Info, Pagination },
    data() {
        return {
            page: 1,
            total: 0,
            size: 20,
            userData: [],
            loading: false,
            id_card: '',
            phone: '',
            params: {},
            item: {},
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
            if (this.id_card != '') params['id_card'] = this.id_card
            if (this.phone != '') params['phone'] = this.phone

            this.loading = true
            QueryUserByParam(params)
                .then(async res => {
                    this.userData = res.data
                    this.total = res.total
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        handleClose(is) {
            if (is) this.init(is)
            else this.centerDialogVisible = false
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
                return i.salary_user_id
            })
        },
        delUser(rid) {
            if (rid.length == 0) return this.$message.warning('未选择任何记录')

            this.$confirm('确定要删除选择的记录吗', '删除记录',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.loading = true
                    DelUser({
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
        },
        setUser(item) {
            this.item = item
            this.centerDialogVisible = true
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