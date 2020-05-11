<template>
  <el-tooltip
    effect="dark"
    :content="active ? '退出全屏' : '全屏'"
    placement="bottom">
    <el-button class="chubby-mr btn-text can-hover" type="text" @click="toggle">
      <chubby-icon v-if="active" name="compress"/>
      <chubby-icon v-else name="arrows-alt" style="font-size: 16px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('chubby/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('chubby/fullscreen', [
      'toggle'
    ])
  }
}
</script>
