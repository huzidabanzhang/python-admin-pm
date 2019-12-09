<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { checkDb } from '@api/sys.user'
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
            if (!this.$isInit) {
                checkDb({})
                    .then(async res => {
                        this.$isInit = res
                    })
            }
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
</style>
