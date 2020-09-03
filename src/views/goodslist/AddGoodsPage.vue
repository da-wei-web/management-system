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
    <el-steps :active="1 * active" align-center simple finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- tab -->
    <el-tabs v-model="active" tab-position="left" class="tabs" style="height: 300px;">
      <el-tab-pane label="基本信息" name="1">基本信息</el-tab-pane>
      <el-tab-pane label="商品参数" name="2">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="4">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
    </el-tabs>

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
        // 当前处于激活状态的步骤
        active: '0'
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
    
    // 修改默认的ElementUI样式
    /deep/.el-tabs__item {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
  }

</style>