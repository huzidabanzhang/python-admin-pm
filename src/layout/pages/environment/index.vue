<template>
    <div>
        <el-tooltip effect="dark" content="切换环境" placement="bottom">
            <el-button class="admin-ml-0 admin-mr btn-text can-hover" type="text" @click="dialogVisible = true">
                <admin-icon name="globe" style="font-size: 16px" />
            </el-button>
        </el-tooltip>

        <el-dialog
            title="切换环境"
            width="300px"
            append-to-body
            destroy-on-close
            v-model="dialogVisible"
            :close-on-click-modal="false"
            @closed="onClose"
        >
            <el-scrollbar>
                <div class="wrapper">
                    <div v-for="option of options" :key="option.value" class="item">
                        <el-button
                            style="width: 100%"
                            size="large"
                            :type="isItemActive(option.value) ? 'primary' : 'default'"
                            @click="onSelect(option.value)"
                        >
                            <div flex="main:justify cross:center">
                                <div flex="dir:top cross:top">
                                    <div class="item-name">
                                        {{ option.name }}
                                    </div>
                                    <div class="item-value">
                                        {{ option.value }}
                                    </div>
                                </div>
                                <admin-icon v-if="isItemActive(option.value)" class="item-icon" name="check-circle" />
                                <admin-icon
                                    v-else-if="option.type === 'custom'"
                                    class="item-icon"
                                    name="close"
                                    @click.stop="onRemove(option.value)"
                                />
                            </div>
                        </el-button>
                    </div>
                </div>
            </el-scrollbar>
            <el-divider>自定义</el-divider>
            <div flex="main:justify cross:center">
                <el-input v-model="custom" class="admin-mr-5" />
                <el-button :disabled="custom.length === 0" @click="onSelect(custom)">使用</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import useCurrentInstance from '@/proxy'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const { proxy } = useCurrentInstance() as any
const store = useStore()

const dialogVisible = ref(false)
const custom = ref('')
const base = computed(() => store.getters['api/base'])
const options = computed(() => store.getters['api/options'])

function onClose() {
    dialogVisible.value = false
}

function onSelect(value) {
    proxy
        .$confirm('确定切换该环境嘛？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(async () => {
            await store.commit('user/setInit', false)
            let is_route = store.dispatch('api/set', value)
            if (Object.keys(is_route).length == 0)
                proxy.$router.push({
                    path: '/'
                })
            onClose()
        })
        .catch()
}

function onRemove(value) {
    proxy
        .$confirm('确定删除该环境嘛？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            store.dispatch('api/remove', value)
        })
        .catch()
}

function isItemActive(value) {
    return base.value === value
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
    .wrapper {
        max-height: 220px;
        .item {
            &:last-child {
                .el-button {
                    margin-bottom: 0px;
                }
            }
            .el-button {
                margin-bottom: 10px;
                & ::v-deep(span) {
                    width: 100%;
                }
                .item-name {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 4px;
                }
                .item-value {
                    font-size: 12px;
                }
                .item-icon {
                    font-size: 24px;
                    right: 10px;
                    position: absolute;
                }
            }
        }
    }
}
</style>
