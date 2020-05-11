<template>
  <div class="chubby-container-ghost">
    <div v-if="$slots.header" class="chubby-container-ghost__header" ref="header">
      <slot name="header"/>
    </div>
    <div class="chubby-container-ghost__body" ref="body">
      <slot/>
    </div>
    <div v-if="$slots.footer" class="chubby-container-ghost__footer" ref="footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
import scroll from './mixins/normal'
export default {
  name: 'chubby-container-ghost',
  mixins: [
    scroll
  ],
  mounted () {
    // 增加滚动事件监听
    this.addScrollListener()
  },
  beforeDestroy () {
    // 移除滚动事件监听
    this.removeScrollListener()
  }
}
</script>
