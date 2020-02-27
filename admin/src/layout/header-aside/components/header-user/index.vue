<template>
    <el-dropdown
        size="small"
        class="d2-mr"
    >
        <span class="btn-text">{{user | getUsername}}</span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logOff">
                <d2-icon
                    name="power-off"
                    class="d2-mr-5"
                />
                注销
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            user: this.$store.getters['d2admin/user/user']
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
        ...mapActions('d2admin/account', [
            'logout'
        ]),
        /**
         * @description 登出
         */
        logOff() {
            this.logout({
                confirm: true
            })
        }
    }
}
</script>
