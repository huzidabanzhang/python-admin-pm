import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { elMenuItem, elSubmenu } from '../libs/util.menu'
import BScroll from 'better-scroll'

export default {
  name: 'chubby-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render (createElement) {
    return createElement('div', { attrs: { class: 'chubby-layout-header-aside-menu-side' } }, [
      createElement('el-menu', {
        props: { collapse: this.asideCollapse, uniqueOpened: true, defaultActive: this.active },
        ref: 'menu',
        on: { select: this.handleMenuSelect }
      }, this.aside.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, createElement, menu))),
      ...this.aside.length === 0 && !this.asideCollapse ? [
        createElement('div', { attrs: { class: 'chubby-layout-header-aside-menu-empty', flex: 'dir:top main:center cross:center' } }, [
          createElement('chubby-icon', { props: { name: 'inbox' } }),
          createElement('span', {}, '没有侧栏菜单')
        ])
      ] : []
    ])
  },
  data () {
    return {
      active: '',
      asideHeight: 300,
      BS: null
    }
  },
  computed: {
    ...mapState('chubby/menu', [
      'aside',
      'asideCollapse'
    ])
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
      immediate: true
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
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
    }
  }
}
