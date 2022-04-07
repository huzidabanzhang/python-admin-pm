<template>
    <div class="admin-container-full">
        <div
            v-if="$slots.header"
            class="admin-container-full__header"
            ref="header"
        >
            <slot name="header" />
        </div>
        <div
            class="admin-container-full__body"
            ref="body"
        >
            <slot />
        </div>
        <div
            v-if="$slots.footer"
            class="admin-container-full__footer"
            ref="footer"
        >
            <slot name="footer" />
        </div>
    </div>
</template>

<script>
import scroll from './mixins/normal'
export default {
    name: 'admin-container-full',
    mixins: [scroll],
    mounted () {
        // 增加滚动事件监听
        this.addScrollListener()
    },
    beforeUnmount () {
        // 移除滚动事件监听
        this.removeScrollListener()
    },
}
</script>
