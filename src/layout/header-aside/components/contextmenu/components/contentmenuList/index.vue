<template>
    <div class="admin-contentmenu-list" @click="rowClick">
        <div
            v-for="item in menulist"
            :key="item.value"
            :data-value="item.value"
            class="admin-contentmenu-item"
            flex="cross:center main:center"
        >
            <admin-icon v-if="item.icon" :name="item.icon" />
            <div class="admin-contentmenu-item-title" flex-box="1">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        menulist: Array<any>
    }>(),
    {
        menulist: () => []
    }
)
const emits = defineEmits(['rowClick'])

function rowClick(event) {
    let target = event.target
    while (!target.dataset.value) {
        target = target.parentNode
    }
    emits('rowClick', target.dataset.value)
}
</script>

<style lang="scss">
.admin-contentmenu-list {
    .admin-contentmenu-item {
        padding: 8px 20px 8px 15px;
        margin: 0;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        &:hover {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary-light-3);
        }
        .admin-contentmenu-item-title {
            margin-left: 10px;
        }
    }
}
</style>
