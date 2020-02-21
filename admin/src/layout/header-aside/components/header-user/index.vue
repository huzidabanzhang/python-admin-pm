<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.info | getUsername}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
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
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
