<template>
  <el-table style="width: 100%" :data="usersList">
    <el-table-column label="#" width="60" type="index"></el-table-column>
    <el-table-column 
      v-for="(item, index) in cellName"
      :key="index" 
      :width="(item.width).toString()"
      :label="item.value"
      :prop="item.column_value">
    </el-table-column>
    <el-table-column label="用户状态" width="120">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit" 
          circle
          plain
          type="primary"
          @click="handleEdit(scope.row.id, scope.row.email, scope.row.mobile)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete" 
          circle
          plain
          @click="handleDelete(scope.row.id)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-check" 
          circle
          plain
          @click="handleDelete(scope.$index, scope.row)">
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>  
  export default {
    name: 'Table',
    props: {
      // 表头
      cellName: {
        type: Array,
        default: []
      },
      // 表格数据
      usersList: {
        type: Array,
        default: []
      },
      message: ''
    },
    methods: {
      // 删除用户信息
      handleDelete(userId) {
        this.$emit('deleteOneUser', userId)
      },

      // 编辑用户信息
      handleEdit(userId, userEmail, userMobile) {
        this.$emit('openEditUserForm', userId, userEmail, userMobile)
      } 
    }
  }
</script>

<style>

</style>