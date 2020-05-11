<template>
  <div
    class="chubby-layout-header-aside-group"
    :style="styleLayoutMainGroup"
    :class="{grayMode: grayActive}">
    <!-- 半透明遮罩 -->
    <div class="chubby-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="chubby-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        class="chubby-theme-header"
        :style="{
          opacity: this.searchActive ? 0.5 : 1
        }"
        flex-box="0"
        flex>
        <div class="logo-group" :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}" flex-box="0">
          <img v-if="asideCollapse" :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`">
          <img v-else :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`">
        </div>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <chubby-icon name="bars"/>
        </div>
        <chubby-menu-header flex-box="1"/>
        <!-- 顶栏右侧 -->
        <div class="chubby-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <!-- <chubby-header-search @click="handleSearchClick"/> -->
          <chubby-header-fullscreen/>
          <chubby-header-url/>
          <chubby-header-theme/>
          <!-- <chubby-header-locales/> -->
          <!-- <chubby-header-color/> -->
          <chubby-header-user/>
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="chubby-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          class="chubby-theme-container-aside"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }">
          <chubby-menu-side/>
        </div>
        <!-- 主体 -->
        <div class="chubby-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
            <!-- <transition name="fade-scale">
                <div v-if="searchActive" class="chubby-theme-container-main-layer" flex>
                <chubby-panel-search
                    ref="panelSearch"
                    @close="searchPanelClose"/>
                </div>
            </transition> -->
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="chubby-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="chubby-theme-container-main-header" flex-box="0">
                <chubby-tabs/>
              </div>
              <!-- 页面 -->
              <div class="chubby-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view/>
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <chubby-base
        :Visible="Visible"
        @handleClose="handleVisible"
    ></chubby-base>
  </div>
</template>

<script>
import chubbyMenuSide from './components/menu-side'
import chubbyMenuHeader from './components/menu-header'
import chubbyTabs from './components/tabs'
import chubbyHeaderFullscreen from './components/header-fullscreen'
import chubbyHeaderUrl from '@/pages/base-url'
// import chubbyHeaderLocales from './components/header-locales'
// import chubbyHeaderSearch from './components/header-search'
import chubbyHeaderTheme from './components/header-theme'
import chubbyHeaderUser from './components/header-user'
import chubbyBase from '@/pages/sys/base/index'
// import chubbyHeaderColor from './components/header-color'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'chubby-layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    chubbyMenuSide,
    chubbyMenuHeader,
    chubbyTabs,
    chubbyHeaderFullscreen,
    chubbyHeaderUrl,
    // chubbyHeaderLocales,
    // chubbyHeaderSearch,
    chubbyHeaderTheme,
    chubbyHeaderUser,
    chubbyBase
    // chubbyHeaderColor
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px',
      Visible: false
    }
  },
  computed: {
    ...mapState('chubby', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapGetters('chubby', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return {
        ...this.themeActiveSetting.backgroundImage ? {
          backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
        } : {}
      }
    }
  },
  methods: {
    ...mapActions('chubby/menu', [
      'asideCollapseToggle'
    ]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    },
    handleVisible (isShow) {
        this.Visible = isShow
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '~@/assets/style/theme/register.scss';
</style>
