<template>
  <!-- <el-submenu :index="newCurrentIndex">
    <template v-slot:title>
      <slot></slot>
    </template>
    <slot name='title'>
      <el-menu-item index="">选项1</el-menu-item>
    </slot>
  </el-submenu> -->
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