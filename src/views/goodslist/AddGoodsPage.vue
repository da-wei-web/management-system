<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <BreadCrumb 
      :titles-list="titlesList" 
      icon="el-icon-arrow-right">
    </BreadCrumb>

    <!-- 警告提示 -->
    <el-row class="alert-msg">
      <el-col>
        <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
      </el-col>
    </el-row>
    

    <!-- 步骤 -->
    <el-steps :active="active" align-center simple finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>



  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'
  export default {
    name: 'AddGoodsPage',
    components: {
      BreadCrumb
    },
    data() {
      return {
        // 面包屑数据列表
        titlesList: [
          {
            value: '首页',
            path: '/'
          },
          {
            value: '商品管理',
          },
          {
            value: '商品列表'
          }
        ],

        // 步骤
        active: 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;

    .alert-msg {
      margin: 20px 0 10px;
    }
  }
</style>