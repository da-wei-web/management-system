<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" icon="el-icon-arrow-right" />
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'
  export default {
    name: 'Orders',
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
            value: '订单管理'
          },
          {
            value: '订单列表'
          }
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;
  }
</style>