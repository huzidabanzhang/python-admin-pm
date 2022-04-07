<template>
  <el-dialog
    :title="title"
    v-model="Visible"
    width="50%"
    append-to-body
    center
    destroy-on-close
    @closed="handleClosed"
  >
    <div style="min-height: 300px">{{ content }}</div>
  </el-dialog>
</template>

<script>
import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
import * as Vue from 'vue'
export default {
  props: {
    title: String,
    content: String,
    centerDialogVisible: Boolean,
  },
  data() {
    return {
      Visible: this.centerDialogVisible,
    }
  },
  watch: {
    centerDialogVisible(newVal) {
      this.Visible = newVal
    },
  },
  methods: {
    handleClosed() {
      $emit(this, 'handleClose', false)
    },
  },
  emits: ['handleClose'],
}
</script>
