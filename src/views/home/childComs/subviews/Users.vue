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
        <el-input 
          :clearable="true"
          @clear="getUsersLt(message, pagenum, pagesize)"
          placeholder="用户名" 
          v-model="message" 
          class="input-with-select">
          <el-button 
            slot="append" 
            icon="el-icon-search" 
            @click="message === '' ? warning() : getUsersLt(message, pagenum, pagesize)">
          </el-button>
        </el-input>
        <el-button 
          type="success" 
          class="add-user"
          @click="openAddUserForm">添加用户
        </el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <Table 
      :cell-name="titles"
      :users-list="usersList" 
      :message="message">
    </Table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <Dialog 
      :dialog-form-visible="dialogFormVisibleAdd"
      formLabelWidth="120"
      :form-content="formContent"
      :form="form"
      name="添加用户"
      @cancelAddUser="closeAddUserForm"
      @openAddUser="openAddUserForm">
    </Dialog>
  </el-card>
</template>

<script>
  import Table from 'components/content/Table'
  import Dialog from 'components/common/Dialog'

  import { getUsersList } from 'network/users'
  import { formDate } from 'common/untils/changeDate'

  export default {
    name: 'Users',
    components: {
      Table,
      Dialog
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
          {value: '姓名', width: 100, column_value: 'username'}, 
          {value: '邮箱', width: 140, column_value: 'email'}, 
          {value: '电话', width: 120, column_value: 'mobile'}, 
          {value: '创建日期', width: 120, column_value: 'create_time'}, 
        ],
        // 用户列表信息
        usersList: [],
        // 保存总共的数据数
        total: 0,
        // 对话框
        dialogFormVisibleAdd: false,
        // 添加用户
        form: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        formContent: [
          {
            item_en_title: 'username', 
            item_cn_title: '用户名'
          },
          {
            item_en_title: 'passwrd', 
            item_cn_title: '密码'
          },
          {
            item_en_title: 'email', 
            item_cn_title: '邮箱'
          },
          {
            item_en_title: 'mobile', 
            item_cn_title: '手机号'
          }
        ]
      }
    },
    created() {
      this.getUsersLt(this.message, this.pagenum, this.pagesize)
    },
    methods: {
      // 事件处理
      // 改变一页显示的数据量
      handleSizeChange(val) {
        this.pagesize = val
        this.getUsersLt(this.message, this.pagenum, this.pagesize)
        console.log(`每页 ${val} 条`);
      },

      // 改变当前页
      handleCurrentChange(val) {
        this.pagenum = val
        this.getUsersLt(this.message, this.pagenum, this.pagesize)
        console.log(`当前页: ${val}`);
      },

      // 搜索框为空时点击搜索，触发该警告提示
      warning() {
        this.$message({
          type: 'warning',
          message: '查询的内容不能为空!'
        })
      },

      // 关闭对话框
      closeAddUserForm() {
        this.dialogFormVisibleAdd = false
      },
      
      // 打开对话框
      openAddUserForm() {
        this.dialogFormVisibleAdd = true
      },

      // 网络请求

      // 获取用户列表
      async getUsersLt(query, pagenum, pagesize) {
        // 发送请求
        const res = await getUsersList(query, pagenum, pagesize)
        // 打印数据
        console.log(res)

        // 处理数据
        const {
          meta: {msg, status},
          data: {users, total}
        } = res

        if(status !== 200) return new Error('获取失败')

        // 日期格式处理
        const newUsers = []
        users.map(item => {
          // 时间变为毫秒
          let date = new Date(item.create_time * 1000)

          // 转换日期格式并替换掉create_time中的原始数据
          item.create_time = formDate(date, 'yyyy-MM-dd')
          
          // 返回新的数组
          return newUsers.push(item)
        })
        
        // 保存数据
        this.usersList = newUsers
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
      margin: 20px 0;

      .input-with-select {
        width: 400px;
        background-color: #fff;
      }

      .add-user {
        margin-left: 10px;
      }
    }

    .pagination {
      margin-top: 10px;
    }

    // .form-item {
    //   margin-bottom: 15px;
    // }

  }
</style>