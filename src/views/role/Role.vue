<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <BreadCrumb 
      :titles-list="titlesList" 
      icon="el-icon-arrow-right">
    </BreadCrumb>
    <!-- 按钮 -->
    <el-row  class="add-role">
      <el-col>
        <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表展示 -->
    <el-table
      :data="rolesList"
      style="width: 100%">
      <!-- 第一列-展开详情 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row 
            v-for="(item, index) in scope.row.children" 
            :key="index"
            :gutter="20">
            <el-col :span="4">
              <el-tag closable class="m-tag" @close="deleteRoleRight(scope.row, item.id)">
                {{ item.authName }}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row 
                v-for="(tItem, tIndex) in item.children" 
                :key="tIndex">
                <el-col :span="4">
                  <el-tag closable type="success" class="m-tag" @close="deleteRoleRight(scope.row, tItem.id)">
                    {{ tItem.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag class="m-tag" type="warning" @close="deleteRoleRight(scope.row, endItem.id)" closable v-for="(endItem, endIndex) in tItem.children" :key="endIndex">
                    {{ endItem.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限提示 -->
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <!-- 第二列-序号 -->
      <el-table-column
        label="#"
        type="index">
      </el-table-column>
      <!-- 第三列-角色名 -->
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <!-- 第四列-角色描述 -->
      <el-table-column
        label="角色描述"
        prop="roleDesc">
      </el-table-column>
      <!-- 第五列-操作 -->
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit" 
            circle
            plain
            type="primary"
            @click="openEditRoleDialog(scope.row.id)">
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete" 
            circle
            plain
            @click="handleDeleteRole(scope.row.id)">
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-check" 
            circle
            plain
            @click="openRightDialog(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="设置权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形  default-expand-all 全部展开 default-checked-keys 选中对应id的权限 -->
      <el-tree
        ref="tree"
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all  
        :default-checked-keys="rightsIdList"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAddRole">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
        <el-button type="primary" @click="addOneRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEditRole">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      {{form}}
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { 
    getRoles, deleteCurrentRole, 
    deleteRight, changeRoleRights,
    addRole, getRole, editRoleById
  } from 'network/role'
  import { getRights } from 'network/right'
  export default {
    name: 'Role',
    components: {
      BreadCrumb
    },
    data() {
      return {
        // 面包屑
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
        ],
        // 角色列表信息
        rolesList: [],
        // 打开设置权限对话框的开关
        dialogFormVisibleRight: false,
        // 权限列表
        rightsList: [],
        // 权限名和子列表
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        // 保存角色的权限id
        rightsIdList: [],
        // 保存当前角色id
        currentRoleId: -1,
        // 保存所有选中的节点的key值
        ridsList: [],
        // 添加角色的表单
        form: {
          roleName: '',
          roleDesc: ''
        },
        // 添加角色对话框
        dialogFormVisibleAddRole: false,
        // 编辑角色对话框
        dialogFormVisibleEditRole: false
      }
    },
    created() {
      // 组件创建时立即请求角色列表信息
      this.getRolesList()
    },
    methods: {
      // 打开添加角色对话框
      openAddRoleDialog() {
        console.log(this.form)
        // 打开添加角色对话框
        this.dialogFormVisibleAddRole = true
      },

      // 打开设置权限对话框
      openRightDialog(role) {
        // 获取到的角色
        // console.log(role)

        // 保存当前角色的id
        this.currentRoleId = role.id


        /*
         * 1.此处有一个巨坑，elementUi的树形控件，当叶子节点一个选中其上层都会自动选中
         * 2.下方的操作如果一二级节点的将会自动选中
         * 3. 如果一二级节点也放入arrtemp1，当点击叶子节点，处于半选状态的节点会全部变为全选
         */ 
        let arrtemp1 = []
        // 保存角色每一级权限对应的id
        role.children.forEach((item, index) => { // 一级
          // arrtemp1.push(item.id)
          item.children.forEach((tItem, tIndex) => { // 二级 (tItem -> twoItem)
            // arrtemp1.push(tItem.id)
            tItem.children.forEach((endItem, endIndex) => { // 三级 (endItem -> 最后一级)
              arrtemp1.push(endItem.id)
            })
          })
        })

        // 保存被选中的节点，用于数据展示
        this.rightsIdList = arrtemp1

        // 获取所有权限
        this.getRightsList('tree')

        // 打开设置权限对话框
        this.dialogFormVisibleRight = true
      },

      // 打开编辑角色对话框
      openEditRoleDialog(roleId) {
        // 通过id获取角色
        this.getRoleById(roleId)

        // 保存当前角色的id
        this.currentRoleId = roleId

        // 打开编辑角色对话框
        this.dialogFormVisibleEditRole = true
      },

      // 添加角色
      async addOneRole() {
        // 获取角色名称
        let rolesName = []
        this.rolesList.forEach(item => {
          rolesName.push(item.roleName)
        })
        
        // 判断输入的角色名称是否存在，存在返回true
        let result = rolesName.includes(this.form.roleName)

        // 如果是true, 将不会再添加该角色
        if(!result) {
          // 发送添加角色的请求
          const res = await addRole(this.form)

          const {
            meta: {msg, status}
          } = res

          if (status === 201) {
            // 添加成功
            this.$message.success(msg)

            // 更新视图
            this.getRolesList()

            // 清空表单内容
            this.form = {}

            // 关闭添加角色对话框
            this.dialogFormVisibleAddRole = false
          } else {
            // 角色名为空
            this.$message.warning(msg)
          }
        } else {
          // 角色名已存在
          this.$message.warning('角色已存在')
        } 
      },

      // 获取角色列表
      async getRolesList() {
        // console.log('啊啥时候')
        const res = await getRoles()

        const {
          data,
          meta: {msg, status}
        } = res

        if (status === 200) {
          this.rolesList = data
        }
      },

      // 根据id获取角色
      async getRoleById(roleId) {
        const res = await getRole(roleId)

        const {
          data,
          meta: {msg, status} 
        } = res

        if (status === 200) {
          // 将数据保存到form表单中
          this.form.roleName = data.roleName
          this.form.roleDesc = data.roleDesc
        } 

      },

      // 删除角色
      async handleDeleteRole(roleId) {
        // 发送删除角色的请求
        const res = await deleteCurrentRole(roleId)

        const {
          meta: {msg, status}
        } = res

        if (status === 200) {
          this.$message.success(msg)

          // 更新视图
          this.getRolesList()
        }
      },

      // 删除角色的指定权限
      async deleteRoleRight(role, rightId) {
        // role -> 角色， 传角色是为了局部更新单个角色权限的变化
        const res = await deleteRight(role.id, rightId)

        const {
          data,  // 该角色剩余的所有权限
          meta: {msg, status}
        } = res

        if (status === 200) {
          this.$message.success(msg)
          // 更新该角色的权限
          role.children = data
        }
      },

      // 获取权限列表
      async getRightsList(type) {
        const res = await getRights(type)

        const {
          data,
          meta: {status}
        } = res

        if (status === 200) {
          // 保存所有权限
          this.rightsList = data
        }
      },

      // 修改角色权限
      async setRoleRights() {

        // 获取全选中的节点的key值
        let selectAll = this.$refs.tree.getCheckedKeys()
        // 获取半选中的节点的key值
        let semiSelected = this.$refs.tree.getHalfCheckedKeys()

        // 合并selectAll， semiSelected
        this.ridsList = selectAll.concat(semiSelected)
        
        console.log(this.ridsList)
        // 列表转换为以,为分隔符的字符串
        
        // 发送修改权限的请求 this.currentRoleId -> 当前角色的id
        const res = await changeRoleRights(this.currentRoleId, this.ridsList.join(','))

        const {
          meta: {msg, status}
        } = res

        if (status === 200) {
          // 更新视图
          this.getRolesList()

          // 修改成功时提示信息
          this.$message.success(msg)

          // 关闭设置权限对话框
          this.dialogFormVisibleRight = false
        }
      },

      // 编辑用户
      async editRole() {
        // 发送编辑角色请求
        const res = await editRoleById(this.currentRoleId, this.form)

        const {
          meta: {msg, status}
        } = res

        if (status === 200) {
          // 成功的提示信息
          this.$message.success(msg)

          // 更新视图
          this.getRolesList()

          // 清空表单
          this.form = {}

          // 关闭编辑角色对话框
          this.dialogFormVisibleEditRole = false
        } 
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card {
    width: 100%;
    height: 100%;

    .add-role {
      margin: 20px 0;
    }

    .m-tag {
      margin: 5px;
    }
  }
</style>