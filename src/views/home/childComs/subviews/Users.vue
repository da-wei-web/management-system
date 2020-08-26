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
      :message="message"
      fbgcolor="#ff4949"
      @deleteOneUser="deleteOneUser"
      @openEditUserForm="openEditUserForm(arguments)"
      @changeState="changeState(arguments)"
      @openMatchDialog="openMatchDialog(arguments)">
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
    <!-- 添加用户对话框 -->
    <Dialog 
      ref="dialogAdd"
      :dialog-form-visible="dialogFormVisibleAdd"
      :form="form"
      dialogWidth="35%"
      name="添加用户"
      @cancelDialog="closeAddUserForm"
      @openDialog="openAddUserForm">
    </Dialog>
    <!-- 编辑用户对话框 -->
    <Dialog 
      ref="dialogEdit"
      :dialog-form-visible="dialogFormVisibleEdit"
      formLabelWidth="100px"
      :form="editForm"
      dialogWidth="35%"
      name="编辑用户"
      @cancelDialog="closeEditUserForm"
      :disabled="true">
    </Dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" 
      :visible.sync="dialogFormVisibleMatch">
      <el-form :model="form">
        <el-form-item label="用户名">
          {{currentUsername}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentRid" placeholder="请选择用户身份">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option 
              :label="item.roleName"
              :value="item.id"
              v-for="(item, index) in rolesList" 
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleMatch = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import Table from 'components/content/Table'
  import Dialog from 'components/common/Dialog'

  import { 
    getUsersList, addUser, deleteUser, editUser,
    getUserById, modifyUserState, setUserRole
  } from 'network/users'
  import { getRoles } from 'network/role'

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
        // 添加用户对话框开关
        dialogFormVisibleAdd: false,
        // 表单的label宽度
        formLabelWidth: '',
        // 添加用户格式
        form: {
          // 用于绑定表单控件中的v-model
          username: '',
          password: '',
          email: '',
          mobile: '',
          formContent: [
            {
              item_en_title: 'username',  // 与上面的属性进行连用
              item_cn_title: '用户名'     // 用于显示表单控件的类型
            },
            {
              item_en_title: 'password', 
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
        },
        // 编辑用户对话框开关
        dialogFormVisibleEdit: false,
        // 修改用户表单格式
        editForm: {
          username: '',
          email: '',
          mobile: '',
          formContent: [
            {
              item_en_title: 'username',  // 与上面的属性进行连用
              item_cn_title: '用户名',     // 用于显示表单控件的类型
              item_disabled: true // 用于input禁用
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
        },
        // 保存根据id
        id: null,
        // 保存用户角色
        currentRid: -1,
        // 角色列表
        rolesList: [],
        // 保存当前用户
        currentUsername: null,
        // 分配角色对话框开关
        dialogFormVisibleMatch: false,
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
        // console.log(`每页 ${val} 条`);
      },

      // 改变当前页
      handleCurrentChange(val) {
        this.pagenum = val
        this.getUsersLt(this.message, this.pagenum, this.pagesize)
        // console.log(`当前页: ${val}`);
      },

      // 搜索框为空时点击搜索，触发该警告提示
      warning() {
        this.$message.warning('查询的内容不能为空!')
      },

      // 打开添加用户对话框
      openAddUserForm() {
        this.dialogFormVisibleAdd = true
      },

      // 关闭对话框
      closeAddUserForm(status) {
        if(status) { // 点击确定后，发送请求
          this.addOneUser(this.form)
          this.dialogFormVisibleAdd = false
        }else{
          this.dialogFormVisibleAdd = false
        }
      },

       // 删除用户
      deleteOneUser(userId) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await deleteUser(userId)
          
          const {
            meta: {msg, status}
          } = res

          if(status === 200) {
            this.pagenum = 1
            this.getUsersLt(this.message, this.pagenum, this.pagesize)
            this.$message.success('删除成功')
          }

        }).catch(() => {
          this.$message.info('已取消该操作')        
        });
      },

      // 打开编辑用户对话框
      openEditUserForm(userMag) {
        // 根据用户id查找用户信息
        this.getOneUserById(userMag[0])

        this.dialogFormVisibleEdit = true
      },

      // 关闭编辑用户对话框
      closeEditUserForm(status) {
        if(status) { // 点击确定，发送编辑用户请求
          this.editOneUser(this.id, this.editForm)
          this.dialogFormVisibleEdit = false
        }else{
          this.dialogFormVisibleEdit = false
        }
      },

      // 打开分配角色对话框
      openMatchDialog(userMsg) {
        // userMsg[0] -> id  userMsg[1] -> username
        
        // 保存当前用户的用户名
        this.currentUsername = userMsg[1]

        // 获取角色列表
        this.getRolesList()
        
        // 根据id获取当前用户的角色rid
        this.getOneUserById(userMsg[0])

        // 打开分配角色对话框
        this.dialogFormVisibleMatch = true
      },

      // 设置用户角色
      async setRole() {
        // this.currentRid -> 角色rid   
        // this.id -> 用户id

        // 当点击分配角色对话框确定按钮时发送设置用户角色请求
        const res = await setUserRole(this.id, this.currentRid)
        
        const {
          meta: {msg, status}
        } = res
        
        if(status === 200) {
          this.$message.success(msg)
        }

        // 关闭分配角色对话框
        this.dialogFormVisibleMatch = false
      },

      // 修改用户状态
      async changeState(userMsg) {
        const res = await modifyUserState(userMsg[0], userMsg[1])
        const {
          meta: {msg, status}
        } = res

        if(status === 200) {
          this.$message.success(msg)
        }
      },
      
      // 网络请求
      // 添加用户
      async addOneUser(userData) {
        const res = await addUser(userData)

        const {
          meta: {msg, status}
        } = res

        // 请求成功
        if(status === 201) {
          this.$message.success(msg)

          // 清空表单中的内容
          for(let key in this.form) {
            // 不破坏form中的结构
            if(this.form.hasOwnProperty(key) && typeof this.form[key] !== 'object') {
              // 仅给绑定v-model的对象属性重新赋值
              this.form[key] = ''
            }
          }
        }

        // 请求失败
        if(status === 400) {
          this.$message.warning(msg)
        } 

      },

      // 获取用户列表
      async getUsersLt(query, pagenum, pagesize) {
        // 发送请求
        const res = await getUsersList(query, pagenum, pagesize)
        
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
      },
      
      // 根据id获取用户数据
      async getOneUserById(userId) {
        const res = await getUserById(userId)
        console.log(res)
        const {
          data: {rid, id, email, mobile, username},
          meta: { status }
        } = res

        console.log(id)
        if(status === 200) {
          this.id = id
          this.currentRid = rid
          this.editForm.username = username
          this.editForm.mobile = mobile
          this.editForm.email = email
        }
      },

      // 编辑用户信息
      async editOneUser(userId, userdata) {
        const res = await editUser(userId, userdata) 
        
        const {
          meta: {msg, status}
        } = res

        if(status === 200) {
          this.$message.success(msg)
          this.getUsersLt(this.message, this.pagenum, this.pagesize)
        }

        if(status === 500) {
          this.$message.error(msg)
        }
      },

      // 获取角色列表
      async getRolesList() {
        const res = await getRoles()
        console.log(res)

        const {
          data,
          meta: {msg, status}
        } = res

        if(status === 200) {
          this.rolesList = data
        }
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