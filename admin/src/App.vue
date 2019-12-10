<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { checkDb, CreateDrop } from '@api/sys.user'
import util from '@/libs/util'
export default {
    name: 'app',
    watch: {
        '$i18n.locale': 'i18nHandle'
    },
    created() {
        this.isInit()
        this.i18nHandle(this.$i18n.locale)
    },
    methods: {
        isInit() {
            if (!this.$store.getters['d2admin/user/isInit']) {
                checkDb({})
                    .then(async res => {
                        this.$store.commit('d2admin/user/setInit', res)

                        if (!res) this.$alert('系统暂不能正常使用, 是否初始化数据库', '重要提示', {
                            confirmButtonText: '确定',
                            showClose: false,
                            callback: action => {
                                this.init()
                            }
                        })
                    })
            }
        },
        init() {
            let loadingInstance = this.$loading(this.loadOption('系统初始化中，请耐心等待.....'))

            CreateDrop({})
                .then(async res => {
                    loadingInstance.close()
                    this.$store.commit('d2admin/user/setInit', true)
                    this.$notify.success({
                        title: '初始化数据库成功',
                        offset: 100,
                        duration: 5000,
                        dangerouslyUseHTMLString: true,
                        message: '<div>管理员: ' + res.username + '<div><div>初始密码：' + res.password + '<div>',
                        showClose: false
                    })
                })
                .catch(() => {
                    loadingInstance.close()
                    this.$alert('初始化失败，点击重新初始化', '错误提示', {
                        confirmButtonText: '确定',
                        showClose: false,
                        callback: action => {
                            this.init()
                        }
                    })
                })
        },
        i18nHandle(val, oldVal) {
            util.cookies.set('lang', val)
            document.querySelector('html').setAttribute('lang', val)
        }
    }
}
</script>

<style lang="scss">
@import "~@/assets/style/public-class.scss";

.el-scrollbar__wrap {
    overflow: auto !important;
}
</style>
