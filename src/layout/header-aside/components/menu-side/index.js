import { h } from 'vue'
import { mapState } from 'vuex'
import { elMenuItem, elSubmenu } from '../libs/util.menu'
import { ElMenu } from 'element-plus'
import menuMixin from '../mixin/menu'
import BScroll from 'better-scroll'

export default {
    name: 'admin-layout-header-aside-menu-side',
    mixins: [menuMixin],
    render () {
        return h(
            'div',
            {
                class: 'admin-layout-header-aside-menu-side'
            },
            [
                h(
                    ElMenu,
                    {
                        collapse: this.asideCollapse,
                        uniqueOpened: true,
                        defaultActive: this.active,
                        ref: 'menu',
                        onSelect: this.handleMenuSelect
                    },
                    {
                        default: () => {
                            return this.aside.map((menu) =>
                                (menu.children === undefined ? elMenuItem : elSubmenu).call(
                                    this,
                                    h,
                                    menu
                                )
                            )
                        }
                    }
                ),
                ...(this.aside.length === 0 && !this.asideCollapse
                    ? [
                        h(
                            'div',
                            {
                                class: 'admin-layout-header-aside-menu-empty',
                                flex: 'dir:top main:center cross:center'
                            },
                            [
                                h(
                                    'admin-icon',
                                    { props: { name: 'inbox' } }
                                ),
                                h('span', {}, '没有侧栏菜单'),
                            ]
                        ),
                    ]
                    : []),
            ]
        )
    },
    data () {
        return {
            active: '',
            asideHeight: 300,
            BS: null,
        }
    },
    computed: {
        ...mapState('menu', ['aside', 'asideCollapse']),
    },
    watch: {
        // 折叠和展开菜单的时候销毁 better scroll
        asideCollapse (val) {
            this.scrollDestroy()
            setTimeout(() => {
                this.scrollInit()
            }, 500)
        },
        // 监听路由 控制侧边栏激活状态
        '$route.fullPath': {
            handler (value) {
                this.active = value
            },
            immediate: true,
        },
    },
    mounted () {
        this.scrollInit()
    },
    beforeUnmount () {
        this.scrollDestroy()
    },
    methods: {
        scrollInit () {
            this.BS = new BScroll(this.$el, {
                mouseWheel: true,
                click: true,
                // 如果你愿意可以打开显示滚动条
                // scrollbar: {
                //   fade: true,
                //   interactive: false
                // }
            })
        },
        scrollDestroy () {
            try {
                this.BS.destroy()
            } catch (e) {
                delete this.BS
                this.BS = null
            }
        },
    },
}
