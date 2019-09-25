<template>
    <d2-container class="page">
    </d2-container>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapMutations, mapActions } from 'vuex'
import { frameInRoutes } from '@/router/routes'
import layoutHeaderAside from '@/layout/header-aside'
import router from '@/router'
export default {
    data() {
        return {
            menu: []
        }
    },
    created() {
        this.init()
    },
    // 回退 刷新时执行
    activated() {
        this.init()
    },
    computed: {
        menus() {
            return this.$store.state.d2admin.user.info.menus || []
        },
        routes() {
            return this.$store.state.d2admin.user.info.routes || []
        }
    },
    methods: {
        ...mapMutations({
            pageInit: 'd2admin/page/init',
            asideSet: 'd2admin/menu/asideSet'
        }),
        init() {
            let children = this.routes.map(item => {
                const index = this.menus.findIndex(i => i.id === item.menu_id)
                return {
                    name: item.name,
                    path: this.menus[index].path,
                    component: () => import(`@/views/` + item.path),
                    meta: {
                        auth: true,
                        name: item.name
                    }
                }
            })

            const route = [
                {
                    path: '/',
                    component: layoutHeaderAside,
                    children: children
                }
            ]

            this.$router.$addRoutes(route)
            // 更新标签页池
            this.pageInit([
                ...frameInRoutes,
                ...route
            ])

            this.menu = cloneDeep(this.menus)

            let menu = []
            while (this.menu.length > 0) {
                for (let i = 0; i < this.menu.length; i++) {
                    if (this.menu[i].parentId == 0) {
                        menu.push(this.getMenuInfo(this.menu[i]))
                        this.menu.splice(i, 1)
                    } else {
                        let index = menu.findIndex(item => item.id === this.menu[i].parentId)
                        if (index == -1) continue
                        if (!menu[index]['children']) menu[index]['children'] = []
                        menu[index]['children'].push(this.getMenuInfo(this.menu[i]))
                        this.menu.splice(i, 1)
                    }
                }
            }
            this.asideSet(menu)
        },
        getMenuInfo(params) {
            let item = {
                title: params.title,
                icon: params.icon,
                id: params.id
            }
            if (params.path) item['path'] = params.path
            return item
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
