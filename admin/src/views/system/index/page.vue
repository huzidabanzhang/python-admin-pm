<template>
    <d2-container class="page">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>{{user.username}} {{info.isAdmin ? '管理员' : '普通用户'}}信息</span>
                    </div>
                    <div class="info">
                        <img
                            v-if="info.avatarUrl && info.avatarUrl != ''"
                            :src="'/API/v1/Document/GetDocument/' + info.avatarUrl"
                            class="avatar"
                        >
                        <img
                            v-else
                            :src="circleUrl"
                            class="avatar"
                        >
                    </div>
                    <div class="info">
                        角色: {{info.role_name}}
                    </div>
                    <div class="info">
                        角色标识: {{info.mark}}
                    </div>
                    <div class="info">
                        最后登录时间: {{info.time}}
                    </div>
                </el-card>
            </el-col>

            <el-col :span="16">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>{{user.username}} 登录统计表</span>
                    </div>
                    <div>
                        <ve-histogram
                            :loading="userLogin.loading"
                            :data="userLogin.chartData"
                            :extend="userLogin.extend"
                        ></ve-histogram>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>所有用户登录次数表</span>
                    </div>
                    <div>
                        <ve-pie
                            :loading="userAll.loading"
                            :data="userAll.chartData"
                        ></ve-pie>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
import { GetLoginInfo, GetAllUserLoginCount } from '@api/sys.base'
import defaultImg from '@/assets/3ea6beec64369c2642b92c6726f1epng.png'
export default {
    data() {
        return {
            userLogin: {
                extend: {
                    series: {
                        type: 'line',
                        label: { show: true, position: 'top' }
                    }
                },
                chartData: {},
                loading: false
            },
            userAll: {
                chartData: {},
                loading: false
            },
            user: this.$store.getters['d2admin/user/user'],
            info: '',
            circleUrl: defaultImg
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.userLogin.loading = true
            GetLoginInfo({})
                .then(async res => {
                    this.userLogin.chartData = {
                        rows: res.rows,
                        columns: res.columns
                    }
                    this.info = res.info
                    this.userLogin.loading = false
                })
                .catch(() => {
                    this.userLogin.loading = false
                })

            this.userAll.loading = true
            GetAllUserLoginCount({})
                .then(async res => {
                    this.userAll.chartData = {
                        rows: res.data,
                        columns: res.user
                    }
                    this.userAll.loading = false
                })
                .catch(() => {
                    this.userAll.loading = false
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.header {
    text-align: center;
}

.info {
    text-align: center;
    line-height: 30px;
    height: auto;
    padding-bottom: 10px;
}

.avatar {
    display: initial;
}

.page {
    .logo {
        width: 120px;
    }
    .btn-group {
        color: $color-text-placehoder;
        font-size: 12px;
        line-height: 12px;
        margin-top: 0px;
        margin-bottom: 20px;
        .btn-group__btn {
            color: $color-text-sub;
            &:hover {
                color: $color-text-main;
            }
            &.btn-group__btn--link {
                color: $color-primary;
            }
        }
    }
}
</style>
