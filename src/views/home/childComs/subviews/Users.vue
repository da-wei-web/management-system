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
    <Table :cell-name="titles" :users-list="usersList"></Table>
  </el-card>
</template>

<script>
  import Table from 'components/content/Table'

  import getUsersList from 'network/users'

  export default {
    name: 'Users',
    components: {
      Table
    },
    data() {
      return {
        // 搜索框用于双向绑定的数据
        message: '',
        // 页数
        pagenum: 1,
        // 一页的数据量
        pagesize: 2,
        // 表格表头数据
        titles: [
          {value: '姓名', width: 100, column_value: "username"}, 
          {value: '邮箱', width: 140, column_value: "email"}, 
          {value: '电话', width: 120, column_value: "mobile"}, 
          {value: '创建日期', width: 120, column_value: "create_time"}, 
          {value: '用户状态', width: 60, column_value: "mg_state"}
        ],
        // 用户列表信息
        usersList: [],
        // 保存总共的数据数
        total: 0
      }
    },
    created() {
      this._getUsersList(this.message, this.pagenum, this.pagesize)
    },
    methods: {
      async _getUsersList(query, pagenum, pagesize) {
        // 发送请求
        const res = await getUsersList(query, pagenum, pagesize)
        // 打印数据
        console.log(res)

        // 处理数据
        const {
          meta: {mag, status},
          data: {users, total}
        } = res

        if(status !== 200) return new Error('获取失败')

        // 保存数据
        this.usersList.push(...users)
        this.total = total
      }
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