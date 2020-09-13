<template>
  <el-table style="width: 100%" :data="msgList">
    <el-table-column label="#" width="60" type="index"></el-table-column>
    <el-table-column 
      v-for="(item, index) in cellName"
      :key="index" 
      :width="(item.width).toString()"
      :label="item.value"
      :prop="item.column_value">
    </el-table-column>
    <el-table-column label="用户状态" width="120" v-if="isShow">
      <template slot-scope="scope">
        <el-switch 
          v-model="scope.row.mg_state" 
          @change="changeUserState(scope.row.id, scope.row.mg_state)"
          :inactive-color="fbgcolor"
          :active-color="tbgcolor">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit" 
          circle
          plain
          type="primary"
          @click="handleEdit(scope.row.id || scope.row.goods_id, scope.row.email, scope.row.mobile)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete" 
          circle
          plain
          @click="handleDelete(scope.row.id || scope.row.goods_id)">
        </el-button>
        <el-button
          size="mini"
          type="success"
          icon="el-icon-check" 
          circle
          plain
          v-if="isShow"
          @click="handleCheck(scope.row.id, scope.row.username)">
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
      msgList: {
        type: Array,
        default: []
      },
      tbgcolor: {
        type: String,
        default: '#409EFF'
      },
      fbgcolor: {
        type: String,
        default: '#C0CCDA'
      },
      isShow: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      // 删除用户信息
      handleDelete(id) {
        this.$emit('deleteItem', id)
      },

      // 编辑用户信息
      handleEdit(id, userEmail, userMobile) {
        this.$emit('openEditDialog', id, userEmail, userMobile)
      },
      
      // 改变用户状态
      changeUserState(id, state) {
        this.$emit('changeState', id, state)
      },

      // 检查
      handleCheck(id, username) {
        this.$emit('openMatchDialog', id, username)
      }

    }
  }
</script>

<style>

</style>