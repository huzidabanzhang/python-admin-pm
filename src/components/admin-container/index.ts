
import { h } from 'vue' // 组件
import adminContainerFull from './components/admin-container-full.vue'
import adminContainerFullBs from './components/admin-container-full-bs.vue'
import adminContainerGhost from './components/admin-container-ghost.vue'
import adminContainerGhostBs from './components/admin-container-ghost-bs.vue'
import adminContainerCard from './components/admin-container-card.vue'
import adminContainerCardBs from './components/admin-container-card-bs.vue'

interface Slots {
    [key: string]: Function
}

export default {
    name: 'admin-container',
    props: {
        // 容器样式
        type: {
            type: String,
            required: false,
            default: 'full',
        },
        // 滚动优化
        betterScroll: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        // 始终返回渲染组件
        component() {
            if (this.type === 'card' && !this.betterScroll) return adminContainerCard
            if (this.type === 'card' && this.betterScroll) return adminContainerCardBs
            if (this.type === 'ghost' && !this.betterScroll)
                return adminContainerGhost
            if (this.type === 'ghost' && this.betterScroll)
                return adminContainerGhostBs
            if (this.type === 'full' && !this.betterScroll) return adminContainerFull
            if (this.type === 'full' && this.betterScroll) return adminContainerFullBs
            else {
                return 'div'
            }
        },
    },
    render() {
        let slots: Slots = {
            default: () => {
                return [this.$slots.default()]
            }
        }

        if (this.$slots.header) slots.header = () => {
            return [this.$slots.header()]
        }

        if (this.$slots.footer) slots.footer = () => {
            return [this.$slots.footer()]
        }

        return h(
            'div',
            {
                ref: 'container',
                class: 'container-component',
            },
            [
                h(
                    this.component,
                    {
                        ref: 'component',
                        ...this.$attrs,
                        onScroll: (e) => this.$emit(this, 'scroll', e)
                    },
                    slots
                )
            ]
        )
    },
    methods: {
        // 返回顶部
        scrollToTop() {
            this.$refs.component.scrollToTop()
            // 如果开启了 better scroll 还需要手动触发一遍 scroll 事件
            const bs = this.$refs.component.BS
            if (bs) this.$refs.component.scroll()
        },
        // 用法同原生方法 scrollBy
        scrollBy(x = 0, y = 0, time = 300) {
            if (this.betterScroll) {
                const bs = this.$refs.component.BS
                if (bs) {
                    bs.scrollBy(-x, -y, time)
                    // 手动触发一遍 scroll 事件
                    this.$refs.component.scroll()
                }
            } else {
                this.$refs.component.$refs.body.scrollBy(x, y)
            }
        },
        // 用法同原生方法 scrollTo
        scrollTo(x = 0, y = 0, time = 300) {
            if (this.betterScroll) {
                const bs = this.$refs.component.BS
                if (bs) {
                    bs.scrollTo(-x, -y, time)
                    // 手动触发一遍 scroll 事件
                    this.$refs.component.scroll()
                }
            } else {
                this.$refs.component.$refs.body.scrollTo(x, y)
            }
        },
        // 用法同原生方法 scrollTop
        scrollTop(top = 0, time = 300) {
            if (this.betterScroll) {
                const bs = this.$refs.component.BS
                if (bs) {
                    bs.scrollTo(bs.x, -top, time)
                    // 手动触发一遍 scroll 事件
                    this.$refs.component.scroll()
                }
            } else {
                this.$refs.component.$refs.body.scrollTop = top
            }
        }
    },
    emits: ['scroll']
}
