<template>
    <div class="admin-container-ghost-bs">
        <div
            v-if="$slots.header"
            class="admin-container-ghost-bs__header"
            ref="header"
        >
            <slot name="header" />
        </div>
        <div
            class="admin-container-ghost-bs__body"
            ref="wrapper"
        >
            <div>
                <slot />
            </div>
        </div>
        <div
            v-if="$slots.footer"
            class="admin-container-ghost-bs__footer"
            ref="footer"
        >
            <slot name="footer" />
        </div>
    </div>
</template>

<script>
import bs from './mixins/bs'
export default {
    name: 'admin-container-card-bs',
    mixins: [bs],
}
</script>
