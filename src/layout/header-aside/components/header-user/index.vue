<template>
    <el-dropdown
        size="small"
        class="d2-mr"
    >
        <span class="btn-text">{{user | getUsername}}</span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
                @click.native="getInfo"
            >
                <i class="fa fa-user-circle"></i>
                个人中心
            </el-dropdown-item>

            <el-dropdown-item
                @click.native="initBase"
                v-show="!isMark()"
            >
                <i class="fa fa-refresh"></i>
                重置数据库
            </el-dropdown-item>

            <el-dropdown-item @click.native="logOff">
                <d2-icon
                    name="power-off"
                    class="d2-mr-5"
                />
                注销
            </el-dropdown-item>
        </el-dropdown-menu>

        <Info
            ref="adminData"
            :title="title"
            :params="params"
            :role="roleParams"
            :isTab="true"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="handleClose"
        ></Info>
    </el-dropdown>
</template>

<script>
import { mapActions } from 'vuex'
import { AgainCreateDrop } from '@api/sys.base'
import Info from '@/pages/sys/admin/info.vue'
import setting from '@/setting.js'
export default {
    components: { Info },
    data() {
        return {
            user: this.$store.getters['chubby/user/user'],
            mark: setting.SYS_ADMIN.mark,
            title: '',
            params: {},
            roleParams: [],
            centerDialogVisible: false
        }
    },
    filters: {
        getUsername(info) {
            if (info && Object.keys(info).length > 0) {
                let name = info.nickname ? info.nickname : info.username
                return name ? `你好 ${name}` : '未登录'
            }
            return '未登录'
        }
    },
    methods: {
        ...mapActions('chubby/account', [
            'logout'
        ]),
        /**
         * @description 登出
         */
        logOff() {
            this.logout({
                confirm: true
            })
        },  
        isMark() {
            if (this.user && Object.keys(this.user).length > 0) 
                return this.user.mark != this.mark
            return false
        },  
        getInfo() {
            this.params = this.user
            this.centerDialogVisible = true
        },
        handleClose(data) {
            if (data.admin_id) this.user = data
            this.centerDialogVisible = false
        },
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
                        })
                        .catch(async res => {
                            loadingInstance.close()
                        })
                })
        }
    }
}
</script>

<style scoped>
.el-dropdown-menu--small .el-dropdown-menu__item {
    padding: 5px 15px;
}
</style>