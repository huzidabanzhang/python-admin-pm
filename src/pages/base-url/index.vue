<template>
    <div>
        <el-tooltip
            effect="dark"
            content="切换环境"
            placement="bottom"
        >
            <el-button
                class="chubby-ml-0 chubby-mr btn-text can-hover"
                type="text"
                @click="dialogVisible = true"
            >
                <chubby-icon
                    name="globe"
                    style="font-size: 16px"
                />
            </el-button>
        </el-tooltip>
        <el-dialog
            title="切换环境"
            width="300px"
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            :close-on-click-modal="false"
            @closed="onClose"
        >
            <el-scrollbar>
                <div class="wrapper">
                    <div
                        v-for="option of options"
                        :key="option.value"
                        class="item"
                    >
                        <el-button
                            :type="isItemActive(option.value) ? 'primary' : 'default'"
                            style="width: 100%;"
                            @click="onSelect(option.value)"
                        >
                            <div flex="main:justify cross:center">
                                <div flex="dir:top cross:top">
                                    <div class="item-name">
                                        {{option.name}}
                                    </div>
                                    <div class="item-value">
                                        {{option.value}}
                                    </div>
                                </div>
                                <span v-if="isItemActive(option.value)">
                                    <chubby-icon
                                        class="item-icon"
                                        name="check-circle"
                                    />
                                </span>
                                <span
                                    v-else-if="option.type === 'custom'"
                                    @click.stop="onRemove(option.value)"
                                >
                                    <chubby-icon
                                        class="item-icon"
                                        name="close"
                                    />
                                </span>
                            </div>
                        </el-button>
                    </div>
                </div>
            </el-scrollbar>
            <el-divider>自定义</el-divider>
            <div flex="main:justify cross:center">
                <el-input
                    v-model="custom"
                    class="chubby-mr-5"
                />
                <el-button
                    :disabled="custom.length === 0"
                    @click="onSelect(custom)"
                >使用</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    name: 'chubby-api-base-url',
    data () {
        return {
            dialogVisible: false,
            custom: ''
        }
    },
    computed: {
        ...mapState('chubby/api', [
            'base'
        ]),
        ...mapGetters('chubby/api', [
            'options'
        ])
    },
    methods: {
        ...mapActions('chubby/api', {
            baseUrlSet: 'set',
            baseUrlOptionRemove: 'remove'
        }),
        onClose () {
            this.dialogVisible = false
        },
        onSelect (value) {
            this.$confirm('确定切换该环境嘛？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    let is_route = this.baseUrlSet(value)
                    this.$store.commit('chubby/user/setInit', false)
                    if (Object.keys(is_route).length == 0) this.$router.push({
                        path: '/'
                    },  () => {}, () => {})
                    this.onClose()
                }).catch()
        },
        onRemove (value) {
            this.$confirm('确定删除该环境嘛？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.baseUrlOptionRemove(value)
                }).catch()
        },
        isItemActive (value) {
            return this.base === value
        }
    }
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
                }
            }
        }
    }
}
</style>
