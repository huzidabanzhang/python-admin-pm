<template>
    <div
        class="admin-layout-header-aside-group"
        :style="styleLayoutMainGroup"
    >
        <!-- 半透明遮罩 -->
        <div class="admin-layout-header-aside-mask"></div>
        <!-- 主体内容 -->
        <div
            class="admin-layout-header-aside-content"
            flex="dir:top"
        >
            <!-- 顶栏 -->
            <div
                class="admin-theme-header"
                :style="{opacity: 1}"
                flex-box="0"
                flex
            >
                <div
                    class="logo-group"
                    :style="{ width: asideCollapse ? asideWidthCollapse : asideWidth }"
                    flex-box="0"
                >
                    <img
                        v-if="asideCollapse"
                        :src="`${baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`"
                    />
                    <img
                        v-else
                        :src="`${baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`"
                    />
                </div>
                <div
                    class="toggle-aside-btn"
                    @click="handleToggleAside"
                    flex-box="0"
                >
                    <admin-icon name="bars" />
                </div>
                <div flex-box="1"></div>
                <!-- 顶栏右侧 -->
                <div
                    class="admin-header-right"
                    flex-box="0"
                >
                    <admin-header-user />
                </div>
            </div>
            <!-- 下面 主体 -->
            <div
                class="admin-theme-container"
                flex-box="1"
                flex
            >
                <!-- 主体 侧边栏 -->
                <div
                    flex-box="0"
                    ref="aside"
                    class="admin-theme-container-aside"
                    :style="{
                        width: asideCollapse ? asideWidthCollapse : asideWidth,
                        opacity: 1
                    }"
                >
                    <admin-menu-side />
                </div>
                <!-- 主体 -->
                <div
                    class="admin-theme-container-main"
                    flex-box="1"
                    flex
                >
                    <!-- 内容 -->
                    <!-- <transition name="fade-scale"> -->
                    <div
                        class="admin-theme-container-main-layer"
                        flex="dir:top"
                    >
                        <!-- tab -->
                        <div
                            class="admin-theme-container-main-header"
                            flex-box="0"
                        >
                            <admin-tabs />
                        </div>
                        <!-- 页面 -->
                        <div
                            class="admin-theme-container-main-body"
                            flex-box="1"
                        >
                            <router-view v-slot="{ Component }">
                                <transition :name="transitionActive ? 'fade-transverse' : ''">
                                    <keep-alive :include="keepAlive">
                                        <component :is="Component" />
                                    </keep-alive>
                                </transition>
                            </router-view>
                        </div>
                    </div>
                    <!-- </transition> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import adminMenuSide from './components/menu-side'
import adminHeaderUser from './components/header-user/index.vue'
import adminTabs from './components/tabs/index.vue'
import useCurrentInstance from '@/proxy'
import { computed, onMounted, ref } from 'vue'
import { useStore } from "vuex"

const { proxy } = useCurrentInstance()
const baseUrl = proxy.$baseUrl
const store = useStore()
const asideWidth = ref('200px')
const asideWidthCollapse = ref('65px')
const keepAlive = computed(() => store.state.page.keepAlive)
const transitionActive = computed(() => store.state.transition.active)
const asideCollapse = computed(() => store.state.menu.asideCollapse)
const themeActiveSetting = computed(() => store.getters['theme/activeSetting'])

const styleLayoutMainGroup = computed(() => {
    return {
        ...(themeActiveSetting.backgroundImage
            ? {
                backgroundImage: `url('${proxy.$baseUrl}${themeActiveSetting.backgroundImage}')`,
            }
            : {})
    }
})

const handleToggleAside = () => {
    store.dispatch('menu/asideCollapseToggle')
}
</script>
