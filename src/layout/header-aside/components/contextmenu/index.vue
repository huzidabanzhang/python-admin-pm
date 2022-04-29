<template>
    <div class="admin-contextmenu" v-show="flag" :style="style">
        <slot />
    </div>
</template>

<script setup lang="ts">
import useCurrentInstance from '@/proxy'
import { computed, onMounted } from 'vue'

const { proxy } = useCurrentInstance() as any
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    }
})
const emits = defineEmits(['handleVisible'])

const style = computed(() => {
    return {
        left: props.x + 'px',
        top: props.y + 'px',
        display: props.visible ? 'block' : 'none '
    }
})
const flag = computed({
    get() {
        if (props.visible) {
            // 注册全局监听事件 [ 目前只考虑鼠标解除触发 ]
            window.addEventListener('mousedown', watchContextmenu)
        }
        return props.visible
    },
    set(newVal) {
        emits('handleVisible', newVal)
    }
})

function watchContextmenu(event) {
    if (!proxy.$el.contains(event.target) || event.button !== 0) flag.value = false
    window.removeEventListener('mousedown', watchContextmenu)
}

onMounted(() => {
    // 将菜单放置到body下
    document.querySelector('body').appendChild(proxy.$el)
})
</script>

<style>
.admin-contextmenu {
    position: absolute;
    padding: 5px 0;
    z-index: 2018;
    background: #fff;
    border: 1px solid #cfd7e5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
