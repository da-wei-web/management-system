<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search-row">
      <el-col :span="24">
        <el-input placeholder="用户名" 
                  v-model="message" 
                  class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" class="add-user">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <!-- <el-table
    style="width: 100%">
      <el-table-column
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column label="邮箱">
      </el-table-column>
      <el-table-column label="电话">
      </el-table-column>
      <el-table-column label="创建日期">
      </el-table-column>
      <el-table-column label="用户状态">
      </el-table-column>
      <el-table-column label="操作">
      </el-table-column>
    </el-table> -->
    <Table :cell-name="titles"></Table>
  </el-card>
</template>

<script>

  import Table from 'components/content/Table'
  export default {
    name: 'Users',
    components: {
      Table
    },
    data() {
      return {
        // 搜索框用于双向绑定的数据
        message: '',
        // 表格表头数据
        titles: [
          {value: '姓名', width: 100}, 
          {value: '邮箱', width: 100}, 
          {value: '电话', width: 100}, 
          {value: '创建日期', width: 100}, 
          {value: '用户状态', width: 100}, 
          {value: '操作', width: 100}
        ]
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="less" sccoped>
  .box-card {
    width: 100%;
    height: 100%;

    .search-row {
      margin-top: 20px;

      .input-with-select {
        width: 400px;
        background-color: #fff;
      }

      .add-user {
        margin-left: 10px;
      }
    }

  }
</style>