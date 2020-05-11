<template>
  <el-color-picker
    class="btn-text can-hover"
    :value="value"
    :predefine="predefine"
    size="mini"
    @change="set"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'chubby-header-color',
  data () {
    return {
      predefine: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    }
  },
  computed: {
    ...mapState('chubby/color', [
      'value'
    ])
  },
  watch: {
    value (value) {
      this.set(value)
    }
  },
  methods: {
    ...mapActions('chubby/color', [
      'set'
    ])
  }
}
</script>
