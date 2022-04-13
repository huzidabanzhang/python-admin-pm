<template>
    <div class="admin-container-card">
        <div
            v-if="$slots.header"
            class="admin-container-card__header"
            ref="header"
        >
            <slot name="header" />
        </div>
        <div
            class="admin-container-card__body"
            ref="body"
        >
            <div class="admin-container-card__body-card">
                <slot />
            </div>
        </div>
        <div
            v-if="$slots.footer"
            class="admin-container-card__footer"
            ref="footer"
        >
            <slot name="footer" />
        </div>
    </div>
</template>

<script>
import scroll from './mixins/normal'
export default {
    name: 'admin-container-card',
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
