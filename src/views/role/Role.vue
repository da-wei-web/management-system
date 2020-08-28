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
        <el-button type="primary">添加角色</el-button>
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
            @click="handleEdit()">
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete" 
            circle
            plain
            @click="handleDelete()">
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
    <el-dialog title="设置权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形  default-expand-all 全部展开 default-checked-keys 选中对应id的权限 -->
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all  
        :default-checked-keys="rightsIdList"
        :props="defaultProps">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleRight = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getRoles, deleteRight } from 'network/role'
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
        // 保存所有权限的id
        rightsIdList: []
      }
    },
    created() {
      // 组件创建时立即请求角色列表信息
      this.getRolesList()
    },
    methods: {
      // 打开设置权限对话框
      openRightDialog(role) {
        // 获取到的角色
        console.log(role)

        // 保存角色每一级权限对应的id
        role.children.forEach((item, index) => { // 一级
          this.rightsIdList.push(item.id)
          item.children.forEach((tItem, tIndex) => { // 二级 (tItem -> twoItem)
            this.rightsIdList.push(tItem.id)
            tItem.children.forEach((endItem, endIndex) => { // 三级 (endItem -> 最后一级)
              this.rightsIdList.push(endItem.id)
            })
          })
        })

        // 获取所有权限
        this.getRightsList('tree')
        // 打开设置权限对话框
        this.dialogFormVisibleRight = true
      },

      // 获取角色列表
      async getRolesList() {
        const res = await getRoles()

        const {
          data,
          meta: {msg, status}
        } = res

        if(status === 200) {
          this.rolesList = data
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

        if(status === 200) {
          this.$message.success(msg)
          setTimeout(() => {
            // 更新该角色的权限
            role.children = data
          }, 300)
        }
      },

      // 获取权限列表
      async getRightsList(type) {
        const res = await getRights(type)

        const {
          data,
          meta: {status}
        } = res

        if(status === 200) {
          // 保存所有权限
          this.rightsList = data
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