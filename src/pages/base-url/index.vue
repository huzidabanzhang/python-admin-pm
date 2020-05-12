<template>
    <div>
        <el-tooltip
            effect="dark"
            content="环境"
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
            :append-to-body="true"
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
            <el-divider>或者</el-divider>
            <div flex="main:justify cross:center">
                <el-input
                    v-model="custom"
                    class="chubby-mr-5"
                />
                <el-button
                    :disabled="custom.length === 0"
                    @click="onSelect(custom)"
                >好</el-button>
            </div>
            <el-divider />
            <el-button
                type="primary"
                style="width:100%;"
                @click="onClose"
            >确定</el-button>
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
            custom: 'http://127.0.0.1:8080'
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
        onClose () {
            this.dialogVisible = false
        },
        onSelect (value) {
            // this.baseUrlSet(value)
        },
        onRemove (value) {
            // this.baseUrlOptionRemove(value)
        },
        isItemActive (value) {
            // return this.base === value
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
