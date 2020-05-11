<template>
  <div>
    <el-tooltip
      effect="dark"
      content="主题"
      placement="bottom">
      <el-button
        class="chubby-ml-0 chubby-mr btn-text can-hover"
        type="text"
        @click="dialogVisible = true">
        <chubby-icon
          name="diamond"
          style="font-size: 16px"/>
      </el-button>
    </el-tooltip>
    <el-dialog
      title="主题"
      width="600px"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <chubby-theme-list style="margin-top: -25px;"/>
    </el-dialog>
  </div>
</template>

<script>
import themeList from './components/chubby-theme-list'
export default {
  components: {
    'chubby-theme-list': themeList
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
