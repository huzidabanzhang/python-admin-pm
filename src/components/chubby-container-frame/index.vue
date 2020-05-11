<template>
  <chubby-container v-bind="$attrs">
    <iframe
      class="chubby-container-frame"
      :src="src"
      frameborder="0"/>
  </chubby-container>
</template>

<script>
export default {
  name: 'chubby-container-frame',
  props: {
    src: {
      type: String,
      required: false,
      default: 'https://doc.chubby.fairyever.com/zh/'
    }
  }
}
</script>

<style lang="scss" scoped>
.chubby-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>
