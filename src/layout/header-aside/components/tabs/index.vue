<template>
    <div
        class="admin-multiple-page-control-group"
        flex
    >
        <div
            class="admin-multiple-page-control-content"
            flex-box="1"
        >
            <div class="admin-multiple-page-control-content-inner">
                <admin-contextmenu
                    :visible.sync="contextmenuFlag"
                    :x="contentmenuX"
                    :y="contentmenuY"
                    @handleVisible="(visible) => {contextmenuFlag = visible}"
                >
                    <admin-contextmenu-list
                        :menulist="
                        tagName === '/index' ? contextmenuListIndex : contextmenuList
                        "
                        @rowClick="contextmenuClick"
                    />
                </admin-contextmenu>
                <el-tabs
                    class="admin-multiple-page-control"
                    :model-value="current"
                    type="card"
                    :closable="true"
                    @tab-click="handleClick"
                    @edit="handleTabsEdit"
                    @contextmenu="handleContextmenu"
                >
                    <el-tab-pane
                        v-for="page in opened"
                        :key="page.fullPath"
                        :label="page.meta.title || '未命名'"
                        :name="page.fullPath"
                    />
                </el-tabs>
            </div>
        </div>
        <div
            class="admin-multiple-page-control-btn"
            flex-box="0"
        >
            <el-dropdown
                size="default"
                split-button
                @click="handleControlItemClick('all')"
                @command="(command) => handleControlItemClick(command)"
            >
                <admin-icon name="times-circle" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="left">
                            <admin-icon
                                name="arrow-left"
                                class="admin-mr-10"
                            />
                            关闭左侧
                        </el-dropdown-item>
                        <el-dropdown-item command="right">
                            <admin-icon
                                name="arrow-right"
                                class="admin-mr-10"
                            />
                            关闭右侧
                        </el-dropdown-item>
                        <el-dropdown-item command="other">
                            <admin-icon
                                name="times"
                                class="admin-mr-10"
                            />
                            关闭其它
                        </el-dropdown-item>
                        <el-dropdown-item command="all">
                            <admin-icon
                                name="times-circle"
                                class="admin-mr-10"
                            />
                            全部关闭
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import AdminContextmenu from '../contextmenu/index.vue'
import AdminContextmenuList from '../contextmenu/components/contentmenuList/index.vue'
import useCurrentInstance from '@/proxy'
import { computed, ref } from 'vue'
import { useStore } from "vuex"

const { proxy } = useCurrentInstance()
const store = useStore()

const contextmenuFlag = ref(false)
const contentmenuX = ref(0)
const contentmenuY = ref(0)
const contextmenuListIndex = [
    { icon: 'times-circle', title: '关闭全部', value: 'all' },
]
const contextmenuList = [
    { icon: 'arrow-left', title: '关闭左侧', value: 'left' },
    { icon: 'arrow-right', title: '关闭右侧', value: 'right' },
    { icon: 'times', title: '关闭其它', value: 'other' },
    { icon: 'times-circle', title: '关闭全部', value: 'all' },
]
const tagName = ref('/index')

const opened = computed(() => store.state.page.opened)
const current = computed(() => store.state.page.current)

/**
 * @description 右键菜单功能点击
 */
function handleContextmenu (event) {
    let target = event.target
    // 解决
    let flag = false
    if (target.className.indexOf('el-tabs__item') > -1) flag = true
    else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
    }
    if (flag) {
        event.preventDefault()
        event.stopPropagation()
        contentmenuX.value = event.clientX
        contentmenuY.value = event.clientY
        tagName.value = target.getAttribute('aria-controls').slice(5)
        contextmenuFlag.value = true
    }
}

/**
 * @description 接收点击关闭控制上选项的事件
 */
function handleControlItemClick (command, name = null) {
    if (name) {
        contextmenuFlag.value = false
    }
    const params = {
        pageSelect: name
    }
    switch (command) {
        case 'left':
            store.dispatch('page/closeLeft', params)
            break
        case 'right':
            store.dispatch('page/closeRight', params)
            break
        case 'other':
            store.dispatch('page/closeOther', params)
            break
        case 'all':
            store.dispatch('page/closeAll')
            break
        default:
            proxy.$message.error('无效的操作')
            break
    }
}

/**
 * @description 右键菜单的row-click事件
 */
function contextmenuClick (command) {
    handleControlItemClick(command, tagName.value)
}

/**
 * @description 接收点击 tab 标签的事件
 */
function handleClick (tab, event) {
    // 找到点击的页面在 tag 列表里是哪个
    const page = opened.value.find((page) => page.fullPath === tab.paneName)
    const { name, params, query } = page
    if (page) {
        proxy.$router.push({ name, params, query })
    }
}

/**
 * @description 点击 tab 上的删除按钮触发这里 首页的删除按钮已经隐藏 因此这里不用判断是 index
 */
function handleTabsEdit (paneName, action) {
    if (action === 'remove') store.dispatch('page/close', {
        tagName: paneName
    })
}
</script>
