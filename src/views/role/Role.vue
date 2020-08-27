<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <BreadCrumb :titles-list="titlesList" icon="el-icon-arrow-right"></BreadCrumb>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'
  export default {
    name: 'Role',
    components: {
      BreadCrumb
    },
    data() {
      return {
        titlesList: [
          {
            value: '首页',
            path: '/'
          },
          {
            value: '权限管理',
          },
          {
            value: '角色列表'
          }
        ]
      }
    }
  }
</script>

<style>

</style>