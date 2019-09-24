<template>
    <d2-container class="page">
    </d2-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
    data() {
        return {}
    },
    // 回退 刷新时执行
    activated() {
        this.init()
    },
    computed: {
        menus () {
            return this.$store.state.d2admin.user.info.menus || []
        }
    },
    methods: {
        ...mapMutations({
            headerSet: 'd2admin/menu/headerSet'
        }),
        init() {
            let menu = []
            while (this.menus.length > 0) {
                if (menu.length == 0) {
                    menu = this.getInfo(0)
                } else {
                    for (let i = 0; i < menu.length; i++) {
                        let info = this.getInfo(menu[i].id)
                        if (info.length > 0) menu[i]['children'] = info
                    }
                }
            }
            this.headerSet(menu)
        },
        getInfo(parentId) {
            let info = []
            for (let i = 0; i < this.menus.length; i++) {
                let item = {
                    path: this.menus[i].path,
                    title: this.menus[i].title,
                    icon: this.menus[i].icon,
                    id: this.menus[i].id
                }
                if (parentId == 0) {
                    if (this.menus[i].parentId == 0) {
                        info.push(item)
                        this.menus.splice(i--, 1)
                    }
                } else {
                    if (res.menus[i].id == parentId) {
                        info.push(item)
                        this.menus.splice(i--, 1)
                    }
                }
            }
            return info
        }
    }
}
</script>

<style lang="scss" scoped>
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
