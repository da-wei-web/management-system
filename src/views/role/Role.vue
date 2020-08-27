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
        <template>
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
            @click="handleCheck()">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import BreadCrumb from 'components/common/BreadCrumb'

  import { getRoles, deleteRight } from 'network/role'
  export default {
    name: 'Role',
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
            value: '权限管理',
          },
          {
            value: '角色列表'
          }
        ],
        rolesList: []
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
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