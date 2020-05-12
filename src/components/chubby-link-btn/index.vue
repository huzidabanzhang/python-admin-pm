<template>
  <el-button-group>
    <el-button v-if="title" @click="$open(link)">{{title}}</el-button>
    <el-button @click="$open(link)">
      <chubby-icon :name="icon"/>
      {{link}}
    </el-button>
  </el-button-group>
</template>

<script>
export default {
  name: 'chubby-link-btn',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: false,
      default: 'link'
    },
    link: {
      type: String,
      required: false,
      default: 'https://github.com/chubby-projects'
    }
  }
}
</script>
