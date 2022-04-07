<template>
    <el-config-provider
        :locale="local"
        :size="size"
    >
        <router-view />
    </el-config-provider>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { frameInRoutes } from '@/router/index'
import setting from './setting'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const store = useStore()
const local = reactive(zhCn)
const size = setting.size.type

onMounted(async () => {
    await store.dispatch('api/load')
    // 处理路由 得到每一级的路由设置
    await store.commit('page/init', frameInRoutes)
    // 用户登录后从数据库加载一系列的设置
    await store.dispatch("account/load")
    // 获取并记录用户 UA
    store.commit('ua/get')
})
</script>

<style lang="scss">
.el-scrollbar__wrap {
    overflow: auto !important;
}
</style>
