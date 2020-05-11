<template>
  <transition name="fade-transverse">
    <div v-if="show" class="chubby-module-index-menu">
      <chubby-module-index-menu-group
        v-for="(item, index) in menu.children"
        :key="index"
        :menu="item"/>
    </div>
  </transition>
</template>

<script>
import chubbyModuleIndexMenuGroup from './components/group'
export default {
  components: {
    chubbyModuleIndexMenuGroup
  },
  props: {
    menu: {
      default: () => ({
        children: []
      })
    }
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.show = true
    }, 300)
  }
}
</script>

<style lang="scss">
.chubby-module-index-menu {
  @extend %unable-select;
  margin-top: 20px;
}
</style>
