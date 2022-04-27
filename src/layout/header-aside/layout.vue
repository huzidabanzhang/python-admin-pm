<template>
    <div class="admin-layout-header-aside-group" :style="styleLayoutMainGroup">
        <!-- 半透明遮罩 -->
        <div class="admin-layout-header-aside-mask"></div>
        <!-- 主体内容 -->
        <div class="admin-layout-header-aside-content" flex="dir:top">
            <!-- 顶栏 -->
            <div class="admin-theme-header" :style="{ opacity: 1 }" flex-box="0" flex>
                <div class="logo-group" flex-box="0">
                    <img :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`" />
                    <span class="logo-title">后台管理系统</span>
                </div>

                <div flex-box="1"></div>
                <!-- 顶栏右侧 -->
                <div class="admin-header-right" flex-box="0">
                    <!-- <el-badge
                        is-dot
                        class="item"
                    >
                        <el-icon>
                            <bell />
                        </el-icon>
                    </el-badge>

                    <el-divider direction="vertical" /> -->

                    <admin-header-user />
                </div>
            </div>
            <!-- 下面 主体 -->
            <div class="admin-theme-container" flex-box="1" flex>
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

                    <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
                        <el-icon v-if="!asideCollapse">
                            <fold />
                        </el-icon>
                        <el-icon v-else>
                            <expand />
                        </el-icon>
                    </div>
                </div>
                <!-- 主体 -->
                <div class="admin-theme-container-main" flex-box="1" flex>
                    <!-- 内容 -->
                    <div class="admin-theme-container-main-layer" flex="dir:top">
                        <!-- tab -->
                        <div class="admin-theme-container-main-header" flex-box="0">
                            <admin-tabs />
                        </div>
                        <!-- 页面 -->
                        <div class="admin-theme-container-main-body" flex-box="1">
                            <router-view v-slot="{ Component }">
                                <transition :name="transitionActive ? 'fade-transverse' : ''" mode="out-in">
                                    <keep-alive :include="keepAlive">
                                        <component :is="Component" />
                                    </keep-alive>
                                </transition>
                            </router-view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <adminBase :Visible="Visible"></adminBase>
    </div>
</template>

<script setup lang="ts">
import adminMenuSide from './components/menu-side'
import adminHeaderUser from './components/header-user/index.vue'
import adminTabs from './components/tabs/index.vue'
import adminBase from '@/layout/pages/sys/base/index.vue'
import useCurrentInstance from '@/proxy'
import { computed, ref, provide } from 'vue'
import { useStore } from 'vuex'
import { Bell, Fold, Expand } from '@element-plus/icons-vue'

const { proxy } = useCurrentInstance() as any
const store = useStore()
const asideWidth = ref('200px')
const asideWidthCollapse = ref('65px')
const Visible = ref(false)
const keepAlive = computed(() => store.state.page.keepAlive)
const transitionActive = computed(() => store.state.transition.active)
const asideCollapse = computed(() => store.state.menu.asideCollapse)
const themeActiveSetting = computed(() => store.getters['theme/activeSetting']) as any
const styleLayoutMainGroup = computed(() => {
    return {
        ...(themeActiveSetting.preview
            ? {
                  backgroundImage: `url('${proxy.$baseUrl}${themeActiveSetting.preview}')`
              }
            : {})
    }
})

const handleToggleAside = () => {
    store.dispatch('menu/asideCollapseToggle')
}

provide('handleVisible', (visible) => {
    Visible.value = visible
})
</script>
