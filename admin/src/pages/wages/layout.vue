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
                        placeholder="选择工资时间"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="id"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form
                        label-position="left"
                        inline
                        class="demo-table-expand"
                    >
                        <el-form-item
                            v-for="(item, key) in props.row.wages"
                            label="key"
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
        </el-table>

        <Info
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
        ></Info>
    </d2-container>
</template>

<script>
import { QueryWagesByParam } from '@api/wages.wages'
import { cloneDeep } from 'lodash'
import Info from './info.vue'
export default {
    name: 'wages-wages',
    components: { Info },
    data() {
        return {
            wageData: [],
            loading: false,
            company: '',
            name: '',
            payment_time: '',
            params: {},
            centerDialogVisible: false,
            btn_submit: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            // if (isTrue) this.centerDialogVisible = false
            // let params = {}
            // if (this.is_disabled != '') params['is_disabled'] = this.is_disabled

            // this.loading = true
            // QueryRouteByParam(params)
            //     .then(async res => {
            //         let data = cloneDeep(res)
            //         this.routeData = util.dealData(res, 2)
            //         this.loading = false
            //         // 更新当前路由
            //         if (isTrue) util.initRoute(data, 2, true)
            //     })
            //     .catch(() => {
            //         this.loading = false
            //     })
        },
        handleClose() {
            this.centerDialogVisible = false
            this.init()
        },
        clear(val) {
            val = ''
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
</style>