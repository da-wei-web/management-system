<template>
  <el-breadcrumb :separator-class="icon">
    <el-breadcrumb-item
      v-for="(item, index) in titlesList"
      :key="index"
      :to="item.path ? { path: item.path } : '' ">
      {{ item.value }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'BreadCrumb',
    props: {
      titlesList: {
        type: Array,
        default: []
      },
      icon: ''
    }
  }
</script>

<style>

</style>