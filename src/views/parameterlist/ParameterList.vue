<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <bread-crumb :titles-list="titlesList" icon="el-icon-arrow-right" />
    <!-- 提示信息 -->
    <el-alert title="商品参数" type="error"></el-alert>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  export default {
    name: 'ParameterList',
    components: {
      BreadCrumb
    },
    data() {
      return {
        // 面包屑数据
        titlesList: [
          {
            value: '首页',
            path: '/',
          },
          {
            value: '商品管理'
          },
          {
            value: '参数列表'
          }
        ],
        // 
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