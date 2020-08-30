<template>
  <el-submenu :index="newCurrentIndex">
    <template slot="title">
      <slot></slot>
    </template>
    <slot name="subtitle"></slot>
  </el-submenu>
</template>

<script>
  export default {
    name: 'SubMenu',
    props: {
      currentIndex: {
        type: Number,
        default: 1
      }
    },
    computed: {
      newCurrentIndex() {
        return this.currentIndex.toString()
      }
    },
    methods: {
      
    }
  }
</script>

<style>

</style>