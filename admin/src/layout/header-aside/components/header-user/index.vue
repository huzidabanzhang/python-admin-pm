<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.info | getUsername}}</span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="init" v-if="info.info.username == 'Admin'">
            <d2-icon name="power-off" class="fa fa-refresh"/>
            重置数据库
        </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { AgainCreateDrop } from '@api/sys.user'
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
    },
    init () {
        this.$confirm('重置数据库后数据将全部清空，确定要重置吗？', '重置数据库',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let loadingInstance = this.$loading(this.loadOption('数据库重置中，请耐心等待.....'))

                AgainCreateDrop().then(async res => {
                    loadingInstance.close()
                    this.$alert('请重新登录', '提示', {
                        confirmButtonText: '确定',
                        showClose: false,
                        callback: action => {
                            this.logOff()
                        }
                    })
                }).catch(() => {
                    loadingInstance.close()
                })
            })
    }
  }
}
</script>
